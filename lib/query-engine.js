import * as Utils     from './utils.js';
import * as Elements  from './elements.js';
import ProxyClass     from 'prixi';

import {
  ElementDefinition,
  UNFINISHED_DEFINITION,
} from './elements.js';

const ELEMENT           = 1;
const DOCUMENT          = 9;
const DOCUMENT_FRAGMENT = 11;

function isElement(value) {
  if (!value)
    return false;

  // We have an Element or a Document
  if (value.nodeType === ELEMENT || value.nodeType === DOCUMENT || value.nodeType === DOCUMENT_FRAGMENT)
    return true;

  return false;
}

export class QueryEngine extends ProxyClass {
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

      return [ new QueryEngine([ elementDefinition.build(document, this) ]) ];
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

    let query = new QueryEngine(element.querySelectorAll(selector));
    if (typeof callback === 'function')
      return query.map(callback);

    return query;
  };

  construct(proxy, elements) {
    Object.defineProperties(this, {
      '_elements': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        Array.from(elements || []),
      },
    });
  }

  $(...args) {
    return this.constructor.from(...args);
  }

  *entries() {
    let elements = this._elements;

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

  add(...elements) {
    return new this.constructor(Array.from(this.values()).concat(...elements));
  }

  [ProxyClass.missing](target, propName) {
    // Redirect any array methods
    if (propName in Array.prototype) {
      return (...args) => {
        let array   = Array.from(this.values());
        let result  = array[propName](...args);
        if (Array.isArray(result))
          return new this.constructor(result);

        return result;
      };
    }
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
    // TODO
  }

  metadata(target, key, value) {
    return Utils.metadata(target, key, value);
  }
}
