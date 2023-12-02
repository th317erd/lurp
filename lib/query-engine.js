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

  // static collectQueryEngineArgs = function(..._args) {
  //   let args = _args.slice();
  //   if (typeof args[0] === 'function' && !args[UNFINISHED_DEFINITION])
  //     args[0] = args[0](Elements);

  //   let isUnfinishedDefinition = (args && args[UNFINISHED_DEFINITION]);
  //   if (args[0] instanceof ElementDefinition || isUnfinishedDefinition) {
  //     let elementDefinition = args[0];
  //     if (isUnfinishedDefinition)
  //       elementDefinition = elementDefinition();

  //     let document = ((args[1] && args[1].ownerDocument) || args[1]) || globalThis.document;
  //     if (!document)
  //       throw new Error('Unable to create specified Elements. "document" not found. Please provide one.');

  //     return [ new QueryEngine(this, [ elementDefinition.build(document, this) ]) ];
  //   } else if (args[0] instanceof Node)


  //   let argIndex  = 0;
  //   let element   = (isElement(args[argIndex])) ? args[argIndex++] : null;
  //   if (!element) {
  //     if (isElement(this))
  //       element = this;
  //     else if (isElement(globalThis.document))
  //       element = globalThis.document;

  //     if (!Utils.isType(args[argIndex], 'String'))
  //       argIndex++;
  //   }

  //   let selector  = args[argIndex++];
  //   let callback  = args[argIndex++];
  //   let options   = args[argIndex++];

  //   if (!options && Utils.isPlainObject(callback))
  //     options = callback;

  //   if (!options)
  //     options = {};

  //   return [
  //     element,
  //     selector,
  //     callback,
  //     options,
  //   ];
  // };

  static from = function(...args) {
    if (args.length === 0)
      return new QueryEngine([], { root: (isElement(this)) ? this : document, context: this });

    const getOptions = () => {
      let base = Object.create(null);
      if (Utils.isPlainObject(args[argIndex]))
        base = Object.assign(base, args[argIndex++]);

      if (args[argIndex] instanceof QueryEngine)
        base = Object.assign(Object.create(null), args[argIndex].getOptions() || {}, base);

      return base;
    };

    const getRootElement = (optionsRoot) => {
      if (isElement(optionsRoot))
        return optionsRoot;

      if (isElement(this))
        return this;

      return ((this && this.ownerDocument) || document);
    };

    let argIndex  = 0;
    let options   = getOptions();
    let root      = getRootElement(options.root);
    let queryEngine;

    options.root = root;
    options.context = options.context || this;

    if (args[argIndex] instanceof QueryEngine)
      return new QueryEngine(args[argIndex].slice(), options);

    if (Array.isArray(args[argIndex])) {
      if (Utils.isType(args[argIndex + 1], 'Function'))
        options.callback = args[1];

      queryEngine = new QueryEngine(args[argIndex], options);
    } else if (Utils.isType(args[argIndex], 'String')) {
      options.selector = args[argIndex++];

      if (Utils.isType(args[argIndex], 'Function'))
        options.callback = args[argIndex++];

      queryEngine = new QueryEngine(root.querySelectorAll(options.selector), options);
    } else if (Utils.isType(args[argIndex], 'Function')) {
      options.callback = args[argIndex++];

      let result = options.callback.call(this, Elements, options);
      if (!Array.isArray(result))
        result = [ result ];

      queryEngine = new QueryEngine(result, options);
    }

    if (options.invokeCallbacks !== false && typeof options.callback === 'function')
      return queryEngine.map(options.callback);

    return queryEngine;
  };

  getEngineClass() {
    return QueryEngine;
  }

  constructor(elements, _options) {
    let options = _options || {};

    Object.defineProperties(this, {
      '_mythixUIOptions': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options,
      },
    });

    Object.defineProperties(this, {
      '_mythixUIElements': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        this.filterAndConstructElements(options.context, elements),
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
              return new EngineClass(result, this.getOptions());
            }

            return result;
          };
        }

        return target[propName];
      },
    });

    return rootProxy;
  }

  getOptions() {
    return this._mythixUIOptions;
  }

  getContext() {
    let options = this.getOptions();
    return options.context;
  }

  getRoot() {
    let options = this.getOptions();
    return options.root || document;
  }

  getOwnerDocument() {
    return this.getRoot().ownerDocument || document;
  }

  filterAndConstructElements(context, elements) {
    let finalElements = Array.from(elements).flat(Infinity).map((_item) => {
      if (!_item)
        return;

      let item = _item;
      if (Utils.isType(item, Node))
        return item;

      if (item[UNFINISHED_DEFINITION])
        item = item();

      if (Utils.isType(item, 'String'))
        item = Elements.Term(item);
      else if (!Utils.isType(item, ElementDefinition))
        return;

      if (!context)
        throw new Error('The "context" option for QueryEngine is required when constructing elements.');

      return item.build(this.getOwnerDocument(), context);
    }).flat(Infinity).filter(Boolean);

    return Array.from((new Set(finalElements)).values());
  }

  $(...args) {
    const EngineClass = this.getEngineClass();

    let argIndex  = 0;
    let options   = Object.assign(Object.create(null), this.getOptions(), (Utils.isPlainObject(args[argIndex])) ? args[argIndex++] : {});

    return EngineClass.from(options, ...args.slice(argIndex));
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
    return new EngineClass(this.slice().concat(...elements), this.getOptions());
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
