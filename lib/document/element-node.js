import {
  _,
  valueToString,
  SafeValue,
  ON_CHILDREN_CHANGED,
  readOnlyProperty,
  isValidName,
  InvalidCharacterError,
  getNameParts,
} from './node-utils.js';

import { liveArrayList }  from './node-list.js';
import { NamedNodeMap }   from './named-node-map.js';
import { Node }           from './node.js';
import { tokenList }      from './dom-token-list.js';
import { Attr }           from './attribute-node.js';

const ATTRIBUTES_KEY = Symbol.for('/lurp/constants/attributesKey');

function attributeGetterSetter(attributeName) {
  return {
    enumerable:   false,
    configurable: true,
    get:          () => this.getAttribute(attributeName),
    set:          (attributeValue) => {
      this.setAttribute(attributeName, attributeValue);
    },
  };
}

const ATTRIBUTE_PROPERTIES = {
  'ariaAtomic':           'aria-atomic',
  'ariaAutoComplete':     'aria-autocomplete',
  'ariaBusy':             'aria-busy',
  'ariaChecked':          'aria-checked',
  'ariaColCount':         'aria-colcount',
  'ariaColIndex':         'aria-colindex',
  'ariaColIndexText':     'aria-colindextext',
  'ariaColSpan':          'aria-colspan',
  'ariaCurrent':          'aria-current',
  'ariaDescription':      'aria-description',
  'ariaDisabled':         'aria-disabled',
  'ariaExpanded':         'aria-expanded',
  'ariaHasPopup':         'aria-haspopup',
  'ariaHidden':           'aria-hidden',
  'ariaKeyShortcuts':     'aria-keyshortcuts',
  'ariaLabel':            'aria-label',
  'ariaLevel':            'aria-level',
  'ariaLive':             'aria-live',
  'ariaModal':            'aria-modal',
  'ariaMultiLine':        'aria-multiline',
  'ariaMultiSelectable':  'aria-multiselectable',
  'ariaOrientation':      'aria-orientation',
  'ariaPlaceholder':      'aria-placeholder',
  'ariaPosInSet':         'aria-posinset',
  'ariaPressed':          'aria-pressed',
  'ariaReadOnly':         'aria-readonly',
  'ariaRequired':         'aria-required',
  'ariaRoleDescription':  'aria-roledescription',
  'ariaRowCount':         'aria-rowcount',
  'ariaRowIndex':         'aria-rowindex',
  'ariaRowIndexText':     'aria-rowindextext',
  'ariaRowSpan':          'aria-rowspan',
  'ariaSelected':         'aria-selected',
  'ariaSetSize':          'aria-setsize',
  'ariaSort':             'aria-sort',
  'ariaValueMax':         'aria-valuemax',
  'ariaValueMin':         'aria-valuemin',
  'ariaValueNow':         'aria-valuenow',
  'ariaValueText':        'aria-valuetext',
  'classList':            'class',
  'elementTiming':        'elementtiming',
  'id':                   'id',
};

export class Element extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    let nodeName = options.localName.toLowerCase();

    super(_({
      ...options,
      nodeType: Node.ELEMENT_NODE,
      nodeName,
    }));

    let prefix        = (options.prefix == null || options.prefix === '') ? null : valueToString(options.prefix);
    let namespaceURI  = (options.namespaceURI == null || options.namespaceURI === '') ? null : valueToString(options.namespaceURI);

    if (prefix)
      prefix = prefix.toLowerCase();

    const _attributes = new NamedNodeMap(_());

    Object.defineProperties(this, {
      [ATTRIBUTES_KEY]: {
        enumerable:   false,
        configurable: true,
        get:          () => _attributes,
      },
      'prefix': {
        enumerable:   false,
        configurable: true,
        get:          () => prefix,
      },
      'namespaceURI': {
        enumerable:   false,
        configurable: true,
        get:          () => namespaceURI,
      },
      'localName': {
        enumerable:   false,
        configurable: true,
        get:          () => this.nodeName,
      },
      'name': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          return (this.prefix) ? `${this.prefix}:${this.localName}` : this.localName;
        },
      },
      'attributes': {
        enumerable:   false,
        configurable: true,
        get:          () => _attributes.attributes,
      },
      'childElementCount': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          let count = 0;
          let childNodes = this.childNodes;

          for (let i = 0; i < childNodes.length; i++) {
            let node = childNodes[i];
            if (node.nodeType !== Node.ELEMENT_NODE)
              continue;

            count++;
          }

          return count;
        },
      },
      'children':           liveArrayList.call(this),
      'classList':          tokenList(),
      'clientHeight':       readOnlyProperty(0),
      'clientLeft':         readOnlyProperty(0),
      'clientTop':          readOnlyProperty(0),
      'clientWidth':        readOnlyProperty(0),
      'firstElementChild':  {
        enumerable:   false,
        configurable: true,
        get:          () => {
          return (this.children.length === 0) ? null : this.children[0];
        },
      },
      'innerHTML':  { // TODO
        enumerable:   false,
        configurable: true,
        get:          () => null,
      },
      'lastElementChild':  {
        enumerable:   false,
        configurable: true,
        get:          () => {
          let len = this.children.length;
          return (len === 0) ? null : this.children[len - 1];
        },
      },
      'nextElementSibling': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          if (!this.parentElement)
            return null;

          let parentChildren  = this.parentElement.children;
          let index           = parentChildren.indexOf(this);
          if (index < 0 || (index + 1) >= parentChildren.length)
            return null;

          return parentChildren[index + 1];
        },
      },
      'outerHTML':  { // TODO
        enumerable:   false,
        configurable: true,
        get:          () => null,
      },
      'part':                   tokenList(),
      'previousElementSibling': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          if (!this.parentElement)
            return null;

          let parentChildren  = this.parentElement.children;
          let index           = parentChildren.indexOf(this);
          if (index < 0 || (index - 1) < 0)
            return null;

          return parentChildren[index - 1];
        },
      },
      'scrollHeight': readOnlyProperty(0),
      'scrollLeft':   readOnlyProperty(0),
      'scrollTop':    readOnlyProperty(0),
      'scrollWidth':  readOnlyProperty(0),
      'shadowRoot':   {
        enumerable:   false,
        configurable: true,
        get:          () => null,
      },
      'slot': {
        enumerable:   false,
        configurable: true,
        get:          () => null,
      },
      'tagName': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          let ownerDocument = this.ownerDocument;
          let docType       = ownerDocument && ownerDocument.doctype;

          let isHTML = (docType == null) ? true : ((/^html/i).test(docType.name));
          if (isHTML)
            return this.nodeName.toUpperCase();

          return this.nodeName;
        },
      },
    });

    // Define all properties which are attribute getter/setters
    let propertyNames = Object.keys(ATTRIBUTE_PROPERTIES);
    for (let i = 0, il = propertyNames.length; i < il; i++) {
      let propertyName  = propertyNames[i];
      let attributeName = ATTRIBUTE_PROPERTIES[propertyName];

      Object.defineProperty(this, propertyName, attributeGetterSetter(attributeName));
    }

    if (options.is)
      this.setAttribute('is', options.is);
  }

  [ON_CHILDREN_CHANGED](childNodes) {
    this.children = _(childNodes.filter((childNode) => (childNode.nodeType === Node.ELEMENT_NODE)));
  }

  getAttribute(name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItem(name);
    return (attributeNode) ? attributeNode.value : null;
  }

  getAttributeNS(namespace, name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItemNS(namespace, name);
    return (attributeNode) ? attributeNode.value : null;
  }

  getAttributeNode(name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItem(name);
    return (attributeNode) ? attributeNode : null;
  }

  getAttributeNodeNS(namespace, name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItemNS(namespace, name);
    return (attributeNode) ? attributeNode : null;
  }

  setAttribute(name, value) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItem(name);
    if (!attributeNode) {
      if (this.ownerDocument) {
        attributeNode = this.ownerDocument.createAttribute(name);
      } else {
        if (!isValidName(name, false))
          throw new InvalidCharacterError(`Failed to execute 'createAttribute' on 'Document': The localName provided ('${name}') contains an invalid character.`);

        attributeNode = new Attr(_({
          localName: name,
        }));
      }

      attributeNode.value = value;
    }

    return this[ATTRIBUTES_KEY].setNamedItem(attributeNode);
  }

  setAttributeNS(namespace, qualifiedName, value) {
    let [ prefix, localName ] = getNameParts(qualifiedName);

    let attributeNode = this[ATTRIBUTES_KEY].getNamedItemNS(namespace, localName);
    if (!attributeNode) {
      if (this.ownerDocument) {
        attributeNode = this.ownerDocument.createAttributeNS(namespace, qualifiedName);
        attributeNode.prefix = _(prefix);
      } else {
        if (!isValidName(localName, false))
          throw new InvalidCharacterError(`Failed to execute 'setAttributeNS' on 'Document': The localName provided ('${name}') contains an invalid character.`);

        attributeNode = new Attr(_({
          namespaceURI: namespace,
          localName,
          prefix,
        }));
      }

      attributeNode.value = value;
    }

    return this[ATTRIBUTES_KEY].setNamedItemNS(attributeNode);
  }

  setAttributeNode(attributeNode) {
    return this[ATTRIBUTES_KEY].setNamedItem(attributeNode);
  }

  setAttributeNodeNS(attributeNode) {
    return this[ATTRIBUTES_KEY].setNamedItemNS(attributeNode);
  }

  hasAttribute(name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItem(name);
    return (attributeNode) ? true : false;
  }

  hasAttributeNS(namespace, name) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItemNS(namespace, name);
    return (attributeNode) ? true : false;
  }

  removeAttribute(name) {
    return this[ATTRIBUTES_KEY].removeNamedItem(name);
  }

  removeAttributeNS(namespace, name) {
    return this[ATTRIBUTES_KEY].removeNamedItemNS(namespace, name);
  }

  removeAttributeNode(node) {
    let attributeNode = this[ATTRIBUTES_KEY].getNamedItemNS(node.namespaceURI, node.localName);
    if (attributeNode)
      return this[ATTRIBUTES_KEY].removeChild(attributeNode);
  }
}
