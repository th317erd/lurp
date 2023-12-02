import { SHA256 } from './sha256.js';

export {
  SHA256,
};

function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

export const ELEMENT_NODE                 = 1;
export const ATTRIBUTE_NODE               = 2;
export const TEXT_NODE                    = 3;
export const CDATA_SECTION_NODE           = 4;
export const PROCESSING_INSTRUCTION_NODE  = 7;
export const COMMENT_NODE                 = 8;
export const DOCUMENT_NODE                = 9;
export const DOCUMENT_TYPE_NODE           = 10;
export const DOCUMENT_FRAGMENT_NODE       = 11;

const ID_COUNT_LENGTH         = 19;
const IS_CLASS                = (/^class \S+ \{/);
const NATIVE_CLASS_TYPE_NAMES = [
  'AggregateError',
  'Array',
  'ArrayBuffer',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'DedicatedWorkerGlobalScope',
  'Error',
  'EvalError',
  'FinalizationRegistry',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Map',
  'Number',
  'Object',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'URIError',
  'WeakMap',
  'WeakRef',
  'WeakSet',
];

const NATIVE_CLASS_TYPES_META = NATIVE_CLASS_TYPE_NAMES.map((typeName) => {
  return [ typeName, globalThis[typeName] ];
}).filter((meta) => meta[1]);

let idCounter = 0n;
export function generateID() {
  idCounter += BigInt(1);
  return `${Date.now()}${pad(idCounter.toString(), ID_COUNT_LENGTH)}`;
}

export function createResolvable() {
  let status = 'pending';
  let resolve;
  let reject;

  let promise = new Promise((_resolve, _reject) => {
    resolve = (value) => {
      if (status === 'pending') {
        status = 'fulfilled';
        _resolve(value);
      }

      return promise;
    };

    reject = (value) => {
      if (status === 'pending') {
        status = 'rejected';
        _reject(value);
      }

      return promise;
    };
  });

  Object.defineProperties(promise, {
    'resolve': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        resolve,
    },
    'reject': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        reject,
    },
    'status': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        () => status,
    },
    'id': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        generateID(),
    },
  });

  return promise;
}

export function typeOf(value) {
  if (value == null || Object.is(value, NaN))
    return 'undefined';

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return 'Number';

  let thisType = typeof value;
  if (thisType === 'bigint')
    return 'BigInt';

  if (thisType !== 'object') {
    if (thisType === 'function') {
      let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (value === typeMeta[1]));
      if (nativeTypeMeta)
        return `[Class ${nativeTypeMeta[0]}]`;

      if (value.prototype && typeof value.prototype.constructor === 'function' && IS_CLASS.test('' + value.prototype.constructor))
        return `[Class ${value.name}]`;

      if (value.prototype && typeof value.prototype[Symbol.toStringTag] === 'function') {
        let result = value.prototype[Symbol.toStringTag]();
        if (result)
          return `[Class ${result}]`;
      }
    }

    return `${thisType.charAt(0).toUpperCase()}${thisType.substring(1)}`;
  }

  if (value instanceof String)
    return 'String';

  if (value instanceof Number)
    return 'Number';

  if (value instanceof Boolean)
    return 'Boolean';

  if (isPlainObject(value))
    return 'Object';

  if (typeof value[Symbol.toStringTag] === 'function')
    return value[Symbol.toStringTag]();

  return value.constructor.name || 'Object';
}

export function isType(value, ...types) {
  let valueType = typeOf(value);
  if (types.indexOf(valueType) >= 0)
    return true;

  return types.some((type) => (typeof type === 'function' && value instanceof type));
}

export function isValidNumber(value) {
  if (Object.is(value, NaN) || Object.is(value, Infinity) || Object.is(value, -Infinity))
    return false;

  return isType(value, 'Number');
}

export function isPlainObject(value) {
  if (!value)
    return false;

  if (typeof value !== 'object')
    return false;

  if (value.constructor === Object || value.constructor == null)
    return true;

  return false;
}

export function isPrimitive(value) {
  if (value == null || Object.is(value, NaN))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return false;

  return isType(value, 'String', 'Number', 'Boolean', 'BigInt');
}

export function isCollectable(value) {
  if (value == null || Object.is(value, NaN) || Object.is(Infinity) || Object.is(-Infinity))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (isType(value, 'String', 'Number', 'Boolean', 'BigInt'))
    return false;

  return true;
}

export function NOE(value) {
  if (value == null)
    return true;

  if (Object.is(value, NaN))
    return true;

  if (value === '')
    return true;

  if (isType(value, 'String') && (/^[\s\r\n]*$/).test(value))
    return true;

  if ('length' in value && typeof value.length === 'number')
    return (value.length === 0);

  if (isPlainObject(value) && Object.keys(value).length === 0)
    return true;

  return false;
}

export function notNOE(value) {
  return !NOE(value);
}

export function cloneRegExp(regexp, _forceFlags, _disallowFlags) {
  let forceFlags    = _forceFlags;
  let disallowFlags = _disallowFlags;

  if (typeof forceFlags === 'string' || forceFlags instanceof String)
    forceFlags = ('' + forceFlags).toLowerCase().split('');

  if (typeof disallowFlags === 'string' || disallowFlags instanceof String)
    disallowFlags = ('' + disallowFlags).toLowerCase().split('');

  const getFlags = (_flags) => {
    let flags = (_flags || '').split('').map((p) => p.toLowerCase());

    if (disallowFlags && disallowFlags.length > 0)
      flags = flags.filter((flag) => (disallowFlags.indexOf(flag) < 0));

    if (forceFlags && forceFlags.length > 0) {
      for (let i = 0, il = forceFlags.length; i < il; i++) {
        let forceFlag = forceFlags[i];
        if (flags.indexOf(forceFlag) < 0)
          flags.push(forceFlag);
      }
    }

    return flags.sort().join('');
  };

  let flags = getFlags(regexp.flags);
  return new RegExp(regexp.source, flags);
}

export function attributableMethod(method, _defaultAttributes) {
  let defaultAttributes = _defaultAttributes || {};
  let attributeNames    = Object.keys(defaultAttributes);

  const bindMethodAttributes = (method, scope) => {
    let boundMethod = method.bind(this, scope);

    attributeNames.forEach((attributeName) => {
      Object.defineProperty(boundMethod, attributeName, {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        function(_value) {
          let value = _value;
          if (arguments.length === 0)
            value = true;

          let newScope = {
            ...scope,
            [attributeName]: value,
          };

          return bindMethodAttributes(method, newScope);
        },
      });
    });

    Object.defineProperty(boundMethod, 'getAttribute', {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        function(attributeName) {
        return scope[attributeName];
      },
    });

    Object.defineProperty(boundMethod, 'setAttribute', {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        function(attributeName, _value) {
        if (arguments.length < 1)
          bindMethodAttributes(method, scope);

        let value = _value;
        if (arguments.length === 1)
          value = true;

        let newScope = {
          ...scope,
          [attributeName]: value,
        };

        return bindMethodAttributes(method, newScope);
      },
    });

    Object.defineProperty(boundMethod, 'setAttributes', {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        function(attributes) {
        let newScope = {
          ...scope,
          ...(attributes || {}),
        };

        return bindMethodAttributes(method, newScope);
      },
    });

    return boundMethod;
  };

  // Default method
  return bindMethodAttributes(method, defaultAttributes);
}

export function bindMethods(_proto, skipProtos) {
  let proto           = _proto;
  let alreadyVisited  = new Set();

  while (proto) {
    let descriptors = Object.getOwnPropertyDescriptors(proto);
    let keys        = Object.keys(descriptors).concat(Object.getOwnPropertySymbols(descriptors));

    for (let i = 0, il = keys.length; i < il; i++) {
      let key = keys[i];
      if (key === 'constructor')
        continue;

      if (alreadyVisited.has(key))
        continue;

      alreadyVisited.add(key);

      let value = proto[key];

      // Skip prototype of Object
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty(key) && Object.prototype[key] === value)
        continue;

      if (typeof value !== 'function')
        continue;

      this[key] = value.bind(this);
    }

    proto = Object.getPrototypeOf(proto);
    if (proto === Object.prototype)
      break;

    if (skipProtos && skipProtos.indexOf(proto) >= 0)
      break;
  }
}

const METADATA_WEAKMAP = new WeakMap();

export function metadata(target, key, value) {
  if (!isCollectable(target))
    throw new Error(`Unable to set metadata on provided object: ${(typeof target === 'symbol') ? target.toString() : target}`);

  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    data = new Map();
    METADATA_WEAKMAP.set(target, data);
  }

  if (arguments.length === 1)
    return data;

  if (arguments.length === 2)
    return data.get(key);

  data.set(key, value);

  return value;
}

const OBJ_ID_WEAKMAP = new WeakMap();
let idCount = 1n;

export function getObjID(obj) {
  let id = OBJ_ID_WEAKMAP.get(obj);
  if (id == null) {
    let thisID = `${idCount++}`;
    OBJ_ID_WEAKMAP.set(obj, thisID);

    return thisID;
  }

  return id;
}

export class DynamicProperty {
  constructor(value) {
    Object.defineProperties(this, {
      'value': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        value,
      },
      'registeredNodes': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        new WeakMap(),
      },
    });
  }

  toString() {
    let value = this.value;
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  set(context, newValue) {
    this.value = newValue;
    this.triggerUpdates(context);
  }

  triggerUpdates(context) {
    let map = this.registeredNodes.get(context);
    if (!map)
      return;

    for (let [ node, callback ] of map.entries())
      node.nodeValue = callback(context);
  }

  registerForUpdate(context, node, callback) {
    let map = this.registeredNodes.get(context);
    if (!map) {
      map = new Map();
      this.registeredNodes.set(context, map);
    }

    if (map.has(node))
      return;

    map.set(node, callback);
  }
}

export function formatTerm(context, _text) {
  let text = _text;
  let node;

  if (text instanceof Node) {
    node = text;
    if (!node.nodeType === TEXT_NODE)
      throw new TypeError('"formatTerm" only supports TextNodes');

    text = node.nodeValue;
  }

  return text.replace(/(?:^\{\{|([^\\])\{\{)([^\s}]+?)\}\}/g, (m, start, name) => {
    let value = context[name];
    if (value == null)
      value = '';

    if (node && value instanceof DynamicProperty)
      value.registerForUpdate(context, node, (context) => formatTerm(context, text));

    return `${start || ''}${value}`;
  });
}

const EVENT_ACTION_JUST_NAME = /^[\w.$]+$/;
export function createEventCallback(_functionBody) {
  let functionBody = _functionBody;
  if (EVENT_ACTION_JUST_NAME.test(functionBody))
    functionBody = `this.${functionBody}(event)`;

  return (new Function('event', `let e=event;let ev=event;let evt=event;return ${functionBody.replace(/^\s*return\s*/, '')};`)).bind(this);
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = {};

export function getAllEventNamesForElement(element) {
  let tagName = element.tagName.toUpperCase();
  if (EVENT_NAME_CACHE[tagName])
    return EVENT_NAME_CACHE[tagName];

  let eventNames = [];

  for (let key in element) {
    if (key.length > 2 && IS_EVENT_NAME.test(key))
      eventNames.push(key.toLowerCase());
  }

  EVENT_NAME_CACHE[tagName] = eventNames;

  return eventNames;
}

export function bindEventToElement(context, element, eventName, _callback) {
  let options = {};
  let callback;

  if (isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else if (typeof _callback === 'function') {
    callback = _callback;
  } else {
    callback = _callback;
  }

  if (isType(callback, 'String'))
    callback = createEventCallback.call(context, callback);

  element.addEventListener(eventName, callback, options);

  return { callback, options };
}
