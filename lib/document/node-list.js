import {
  _,
  readOnlyProperty,
  SafeValue,
  ON_CHILDREN_CHANGED,
} from './node-utils.js';

function collectAllChildren() {
  let child     = this.firstChild;
  let children  = [];

  while (child) {
    children.push(child);
    child = child.nextSibling;
  }

  return children;
}

function updateChildNodes() {
  let children = collectAllChildren.call(this);
  this.childNodes = _(children);

  if (ON_CHILDREN_CHANGED in this)
    this[ON_CHILDREN_CHANGED].call(this, this.childNodes);
}

function findChildNode(referenceNode) {
  let child = this.firstChild;

  while (child) {
    if (child === referenceNode)
      return child;

    child = child.nextSibling;
  }

  return null;
}

function removeChild(childNode) {
  if (!(childNode instanceof NodeList))
    throw new TypeError("Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.");

  let refNode = findChildNode.call(this, childNode);
  if (!refNode)
    return null;

  if (refNode.nextSibling)
    refNode.nextSibling.previousSibling = _(refNode.previousSibling);

  if (refNode.previousSibling)
    refNode.previousSibling.nextSibling = _(refNode.nextSibling);

  if (refNode === this.firstChild)
    this.firstChild = _(refNode.nextSibling);
  else if (refNode === this.lastChild)
    this.lastChild = _(refNode.previousSibling);

  refNode.parentNode = _(null);
  refNode.nextSibling = _(null);
  refNode.previousSibling = _(null);

  return refNode;
}

function insertBefore(newNode, referenceNode) {
  if (!(newNode instanceof NodeList))
    throw new TypeError("Failed to execute 'insertBefore' on 'Node': parameter 1 is not of type 'Node'.");

  let refNode = null;

  if (referenceNode) {
    if (!(referenceNode instanceof NodeList))
      throw new TypeError("Failed to execute 'insertBefore' on 'Node': parameter 2 is not of type 'Node'.");

    refNode = findChildNode.call(this, referenceNode);
  }

  if (newNode.parentNode)
    newNode.parentNode.removeChild(newNode);

  if (!refNode) {
    // Append node

    if (!this.lastChild) {
      this.lastChild = this.firstChild = _(newNode);
    } else {
      newNode.previousSibling = _(this.lastChild);
      newNode.nextSibling = _(null);
      this.lastChild.nextSibling = _(newNode);
      this.lastChild = _(newNode);
    }
  } else {
    // Insert node

    if (refNode.previousSibling)
      refNode.previousSibling.nextSibling = _(newNode);
    else
      this.firstChild = _(newNode);

    newNode.previousSibling = _(refNode.previousSibling);
    newNode.nextSibling = _(refNode);

    refNode.previousSibling = _(newNode);
  }

  newNode.parentNode = _(this);

  return newNode;
}

export function liveArrayList() {
  const _liveList = [];

  return {
    enumerable:   false,
    configurable: false,
    get:          () => _liveList,
    set:          (newValue) => {
      if (!(newValue instanceof SafeValue))
        return;

      let newChildren = newValue.value;
      let changeIndex = _liveList.length;

      // First, figure out where the arrays differ
      for (let i = 0, il = Math.min(_liveList.length, newChildren.length); i < il; i++) {
        let childNode     = _liveList[i];
        let newChildNode  = newChildren[i];

        if (childNode !== newChildNode) {
          changeIndex = i;
          break;
        }
      }

      // Now delete remaining nodes from where they differ
      let deleteCount = _liveList.length - changeIndex;
      if (deleteCount > 0)
        _liveList.splice(changeIndex, deleteCount);

      // Now add new nodes in order fro the point of difference
      for (let i = changeIndex, il = newChildren.length; i < il; i++) {
        let newChildNode = newChildren[i];
        _liveList.push(newChildNode);
      }
    },
  };
}

export class NodeList {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    const _childNodes = [];

    Object.defineProperties(this, {
      'parentNode':       readOnlyProperty(),
      'firstChild':       readOnlyProperty(),
      'lastChild':        readOnlyProperty(),
      'nextSibling':      readOnlyProperty(),
      'previousSibling':  readOnlyProperty(),
      'childNodes':       liveArrayList.call(this, 'childNodes'),
    });
  }

  appendChild(childNode) {
    if (!(childNode instanceof NodeList))
      throw new TypeError("Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.");

    return this.insertBefore(childNode, null);
  }

  cloneNode(deep) {
    let newNode = new this.constructor(this.nodeType, this.nodeName);

    newNode.ownerDocument = _(null);
    newNode.parentNode = _(null);

    if (deep) {
      let children = collectAllChildren.call(this, newNode).map((child) => child.cloneNode(true));

      for (let i = 0, il = children.length; i < il; i++) {
        let child = children[i];
        newNode.appendChild(child);
      }

      this.childNodes = _(children);
    } else {
      newNode.firstChild = _(this.firstChild);
      newNode.lastChild = _(this.lastChild);
      newNode.nextSibling = _(this.nextSibling);
      newNode.previousSibling = _(this.previousSibling);
    }

    return newNode;
  }

  hasChildNodes() {
    return !!this.firstChild;
  }

  insertBefore(newNode, referenceNode) {
    let addedChild = insertBefore.call(this, newNode, referenceNode);

    updateChildNodes.call(this);

    return addedChild;
  }

  removeChild(childNode) {
    let removedChild = removeChild.call(this, childNode);
    if (removedChild)
      updateChildNodes.call(this);

    return removedChild;
  }

  replaceChild(newChild, oldChild) {
    insertBefore.call(this, newChild, oldChild);

    let removedChild = removeChild.call(this, oldChild);

    updateChildNodes.call(this);

    return removedChild;
  }
}
