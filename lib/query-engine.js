import * as Utils     from './utils.js';
import * as Elements  from './elements.js';

import {
  ElementDefinition,
  UNFINISHED_DEFINITION,
} from './elements.js';

function isElement(value) {
  if (!value)
    return false;

  // We have an Element or a Document
  if (value.nodeType === Utils.ELEMENT_NODE || value.nodeType === Utils.DOCUMENT_NODE || value.nodeType === Utils.DOCUMENT_FRAGMENT_NODE)
    return true;

  return false;
}

function isSlotted(element) {
  if (!element)
    return null;

  return element.closest('slot');
}

function isNotSlotted(element) {
  if (!element)
    return null;

  return !element.closest('slot');
}

function collectClassNames(...args) {
  let classNames = [].concat(...args)
      .flat(Infinity)
      .map((part) => ('' + part).split(/\s+/))
      .flat(Infinity)
      .filter(Boolean);

  return classNames;
}

export class QueryEngine {
  static isElement    = isElement;
  static isSlotted    = isSlotted;
  static isNotSlotted = isNotSlotted;

  static collectQueryEngineArgs = function(..._args) {
    let args = _args.slice();
    if (typeof args[0] === 'function' && !args[UNFINISHED_DEFINITION])
      args[0] = args[0](Elements);

    let isUnfinishedDefinition = (args && args[UNFINISHED_DEFINITION]);
    if (args[0] instanceof ElementDefinition || isUnfinishedDefinition) {
      let elementDefinition = args[0];
      if (isUnfinishedDefinition)
        elementDefinition = elementDefinition();

      let document = ((args[1] && args[1].ownerDocument) || args[1]) || globalThis.document;
      if (!document)
        throw new Error('Unable to create specified Elements. "document" not found. Please provide one.');

      return [ new QueryEngine(this, [ elementDefinition.build(document, this) ]) ];
    }

    let argIndex  = 0;
    let element   = (isElement(args[argIndex])) ? args[argIndex++] : null;
    if (!element) {
      if (isElement(this))
        element = this;
      else if (isElement(globalThis.document))
        element = globalThis.document;

      if (!Utils.isType(args[argIndex], 'String'))
        argIndex++;
    }

    let selector  = args[argIndex++];
    let callback  = args[argIndex++];
    let options   = args[argIndex++];

    if (!options && Utils.isPlainObject(callback))
      options = callback;

    if (!options)
      options = {};

    return [
      element,
      selector,
      callback,
      options,
    ];
  };

  static from = function(...args) {
    let [
      element,
      selector,
      callback,
    ] = QueryEngine.collectQueryEngineArgs.apply(this, args);

    if (element instanceof QueryEngine)
      return element;

    let query = new QueryEngine(this, element.querySelectorAll(selector));
    if (typeof callback === 'function')
      return query.map(callback);

    return query;
  };

  getEngineClass() {
    return QueryEngine;
  }

  constructor(context, elements) {
    Object.defineProperties(this, {
      '_mythixUIContext': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        context,
      },
      '_mythixUIElements': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        Array.from((new Set(Array.from(elements || []))).values()),
      },
    });

    let rootProxy = new Proxy(this, {
      get: (target, propName) => {
        // Redirect any array methods
        if (propName in Array.prototype) {
          return (...args) => {
            let array   = this._mythixUIElements;
            let result  = array[propName](...args);
            if (Array.isArray(result)) {
              const EngineClass = target.getEngineClass();
              return new EngineClass(this._mythixUIContext || this, result);
            }

            return result;
          };
        }

        return target[propName];
      },
    });

    return rootProxy;
  }

  getOwnerDocument() {
    return ((this._mythixUIContext && this._mythixUIContext.ownerDocument) || document);
  }

  $(...args) {
    const EngineClass = this.getEngineClass();
    return EngineClass.from(this._mythixUIContext || this, ...args);
  }

  *entries() {
    let elements = this._mythixUIElements;

    for (let i = 0, il = elements.length; i < il; i++) {
      let element = elements[i];
      yield([i, element]);
    }
  }

  *keys() {
    for (let [ key, _ ] of this.entries())
      yield key;
  }

  *values() {
    for (let [ _, value ] of this.entries())
      yield value;
  }

  *[Symbol.iterator]() {
    return yield *this.values();
  }

  addToQuery(...elements) {
    const EngineClass = this.getEngineClass();
    return new EngineClass(this._mythixUIContext || this, Array.from(this.values()).concat(...elements));
  }

  on(eventName, callback, options) {
    for (let value of this.values()) {
      if (!isElement(value))
        continue;

      value.addEventListener(eventName, callback, options);
    }

    return this;
  }

  off(eventName, callback, options) {
    for (let value of this.values()) {
      if (!isElement(value))
        continue;

      value.removeEventListener(eventName, callback, options);
    }

    return this;
  }

  appendTo(selectorOrElement) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (Utils.isType(selectorOrElement, 'String'))
      element = this.getOwnerDocument().querySelector(selectorOrElement);

    for (let child of this._mythixUIElements)
      element.appendChild(child);
  }

  insertInto(selectorOrElement, referenceNode) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (Utils.isType(selectorOrElement, 'String'))
      element = this.getOwnerDocument().querySelector(selectorOrElement);

    let ownerDocument = this.getOwnerDocument();
    let source        = this;

    if (this._mythixUIElements.length > 1) {
      let fragment = ownerDocument.createDocumentFragment();
      for (let child of this._mythixUIElements)
        fragment.appendChild(child);

      source = [ fragment ];
    }

    element.insert(source[0], referenceNode);

    return this;
  }

  remove() {
    for (let node of this._mythixUIElements) {
      if (node && node.parentNode)
        node.parentNode.removeChild(node);
    }

    return this;
  }

  classList(operation, ...args) {
    let classNames = collectClassNames(args);
    for (let node of this._mythixUIElements) {
      if (node && node.classList) {
        if (operation === 'toggle')
          classNames.forEach((className) => node.classList.toggle(className));
        else
          node.classList[operation](...classNames);
      }
    }

    return this;
  }

  addClass(...classNames) {
    return this.classList('add', ...classNames);
  }

  removeClass(...classNames) {
    return this.classList('remove', ...classNames);
  }

  toggleClass(...classNames) {
    return this.classList('toggle', ...classNames);
  }

  slotted(yesNo) {
    return this.filter((arguments.length === 0 || yesNo) ? isSlotted : isNotSlotted);
  }

  metadata(target, key, value) {
    return Utils.metadata(target, key, value);
  }
}

globalThis.MythixUIQueryEngine = QueryEngine;
