import {
  _,
  SafeValue,
  ON_CHILDREN_CHANGED,
  NotFoundError,
  InUseAttributeError,
} from './node-utils.js';

import { NodeList } from './node-list.js';

function findChildNode(callback) {
  let child = this.firstChild;

  while (child) {
    if (callback(child) === true)
      return child;

    child = child.nextSibling;
  }

  return null;
}

export class NamedNodeMap extends NodeList {
  constructor() {
    super(_());

    const _attributes = Object.create(this.childNodes);

    const clearAttributes = (exceptionKeys) => {
      let keys = Object.keys(_attributes);
      for (let i = 0, il = keys.length; i < il; i++) {
        let key = keys[i];
        if (Object.prototype.hasOwnProperty.call(exceptionKeys, key))
          continue;

        delete _attributes[key];
      }
    };

    Object.defineProperties(this, {
      'attributes': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          return Object.freeze(Object.create(_attributes));
        },
        set:          (value) => {
          if ((value instanceof SafeValue)) {
            Object.assign(_attributes, value.value);
            clearAttributes(value.value);
          }
        },
      },
    });
  }

  [ON_CHILDREN_CHANGED](childNodes) {
    let attributeObj = {};

    for (let i = 0, il = childNodes.length; i < il; i++) {
      let childNode = childNodes[i];
      attributeObj[childNode.nodeName] = childNode.nodeValue;
    }

    this.attributes = _(attributeObj);
  }

  getNamedItem(name) {
    return findChildNode.call(this, (node) => (node.name === name));
  }

  getNamedItemNS(namespace, localName) {
    return findChildNode.call(this, (node) => (node.name === localName && node.namespaceURI === namespace));
  }

  item(_index) {
    let index = parseInt(_index, 10);
    if (!isFinite(index))
      index = 0;

    return (index >= this.childNodes.length) ? null : this.childNodes[index];
  }

  removeNamedItem(name) {
    let attributeNode = this.getNamedItem(name);
    if (attributeNode)
      return this.removeChild(attributeNode);
    else
      throw new NotFoundError(`Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name '${name}' was found.`);
  }

  removeNamedItemNS(namespace, name) {
    let attributeNode = this.getNamedItemNS(namespace, name);
    if (attributeNode)
      return this.removeChild(attributeNode);
    else
      throw new NotFoundError(`Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': No item with name '${namespace}::${name}' was found.`);
  }

  setNamedItem(attributeNode) {
    if (attributeNode.parentNode)
      throw new InUseAttributeError('Failed to execute \'setNamedItem\' on \'NamedNodeMap\': The node provided is an attribute node that is already an attribute of another Element; attribute nodes must be explicitly cloned.');

    let existingAttributeNode = this.getNamedItem(attributeNode.localName);
    if (!existingAttributeNode) {
      this.appendChild(attributeNode);
      return null;
    } else {
      return this.replaceChild(attributeNode, existingAttributeNode);
    }
  }

  setNamedItemNS(attributeNode) {
    if (attributeNode.parentNode)
      throw new InUseAttributeError('Failed to execute \'setNamedItem\' on \'NamedNodeMap\': The node provided is an attribute node that is already an attribute of another Element; attribute nodes must be explicitly cloned.');

    let existingAttributeNode = this.getNamedItemNS(attributeNode.namespaceURI, attributeNode.localName);
    if (!existingAttributeNode) {
      this.appendChild(attributeNode);
      return null;
    } else {
      return this.replaceChild(attributeNode, existingAttributeNode);
    }
  }
}
