import { SHA256 } from './sha256.js';

export {
  SHA256,
};

function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

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

  if (isType(value.length, 'Number'))
    return (value.length === 0);

  if (isPlainObject(value) && Object.keys(value).length === 0)
    return true;

  return false;
}

export function notNOE(value) {
  return !NOE(value);
}

export function toCamelCase(value) {
  return ('' + value)
    .replace(/^\W/, '')
    .replace(/[\W]+$/, '')
    .replace(/([A-Z]+)/g, '-$1')
    .toLowerCase()
    .replace(/\W+(.)/g, (m, p) => {
      return p.toUpperCase();
    })
    .replace(/^(.)(.*)$/, (m, f, l) => `${f.toLowerCase()}${l}`);
}

export function toSnakeCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase()))
    .toLowerCase();
}

export function bindMethods(_proto, skipProtos) {
  let proto           = _proto;
  let alreadyVisited  = new Set();

  while (proto) {
    if (proto === Object.prototype)
      return;

    let descriptors = Object.getOwnPropertyDescriptors(proto);
    let keys        = Object.keys(descriptors).concat(Object.getOwnPropertySymbols(descriptors));

    for (let i = 0, il = keys.length; i < il; i++) {
      let key = keys[i];
      if (key === 'constructor')
        continue;

      if (alreadyVisited.has(key))
        continue;

      alreadyVisited.add(key);

      let descriptor = descriptors[key];

      // Can it be changed?
      if (descriptor.configurable === false)
        continue;

      // If is getter, then skip
      if (Object.prototype.hasOwnProperty.call(descriptor, 'get') || Object.prototype.hasOwnProperty.call(descriptor, 'set')) {
        let newDescriptor = { ...descriptor };
        if (newDescriptor.get)
          newDescriptor.get = newDescriptor.get.bind(this);

        if (newDescriptor.set)
          newDescriptor.set = newDescriptor.set.bind(this);

        Object.defineProperty(this, key, newDescriptor);
        continue;
      }

      let value = descriptor.value;

      // Skip prototype of Object
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty(key) && Object.prototype[key] === value)
        continue;

      if (typeof value !== 'function')
        continue;

      Object.defineProperty(this, key, { ...descriptor, value: value.bind(this) });
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

const DYNAMIC_PROPERTY_GC_TIME = 10000;

export class DynamicProperty {
  constructor(getter, setter) {
    if (typeof getter !== 'function')
      throw new TypeError('"getter" (first) argument must be a function');

    if (typeof setter !== 'function')
      throw new TypeError('"setter" (second) argument must be a function');

    Object.defineProperties(this, {
      'value': {
        enumerable:   false,
        configurable: true,
        get:          getter,
        set:          setter,
      },
      'registeredNodes': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        [],
      },
      'cleanMemoryTimer': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        null,
      },
      'isSetting': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        false,
      },
    });
  }

  toString() {
    let value = this.value;
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  freeDeadReferences() {
    // clear dead nodes
    this.registeredNodes = this.registeredNodes.filter((entry) => !!entry.ref.deref());

    clearTimeout(this.cleanMemoryTimer);
    this.cleanMemoryTimer = null;

    if (this.registeredNodes.length) {
      let randomness = (Math.random() * DYNAMIC_PROPERTY_GC_TIME);
      this.cleanMemoryTimer = setTimeout(() => this.freeDeadReferences(), Math.round(DYNAMIC_PROPERTY_GC_TIME + randomness));
    }
  }

  set(newValue) {
    if (this.isSetting)
      return;

    if (this.value === newValue)
      return;

    try {
      this.isSetting = true;
      this.value = newValue;
    } catch (error) {
      console.error(error);
    } finally {
      this.isSetting = false;
    }

    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(() => this.triggerUpdates());
    } else {
      (new Promise((resolve) => {
        resolve();
      })).then(() => this.triggerUpdates());
    }
  }

  triggerUpdates() {
    for (let { ref, callback } of this.registeredNodes) {
      let node = ref.deref();
      if (!node)
        continue;

      let newValue = callback();
      node.nodeValue = newValue;
    }
  }

  registerForUpdate(node, callback) {
    let exists = this.registeredNodes.find((entry) => (entry.ref.deref() === node));
    if (exists)
      return;

    let ref = new WeakRef(node);
    this.registeredNodes.push({ ref, callback });

    this.freeDeadReferences();
  }
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
const VALID_JS_IDENTIFIER         = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function getContextCallArgs(context) {
  let contextCallArgs = getAllPropertyNames(context).filter((name) => VALID_JS_IDENTIFIER.test(name));
  contextCallArgs = Array.from(new Set(contextCallArgs.concat([ 'attributes', 'classList' ])));

  return `{${contextCallArgs.filter((name) => !(/^(i18n|\$\$)$/).test(name)).join(',')}}`;
}

export function createDynamicPropertyFetcher(context, _functionBody, _contextCallArgs) {
  let contextCallArgs = (_contextCallArgs) ? _contextCallArgs : getContextCallArgs(context, (context instanceof Node));
  let functionBody    = `let C=arguments[2],$$=C.$$||{},i18n=$$.i18n||((path,d)=>getDynamicPropertyForPath.call(specialClosest(C,'mythix-language-provider')||C,\`global.i18n.\${path}\`,d));if($$.i18n==null)$$.i18n=i18n;return ${_functionBody.replace(/^\s*return\s+/, '').trim()};`;
  return (new Function('getDynamicPropertyForPath', 'specialClosest', contextCallArgs, functionBody)).bind(context, getDynamicPropertyForPath, specialClosest);
}

export function formatTerm(context, _text) {
  let text = _text;
  let node;

  if (text instanceof Node) {
    node = text;
    if (FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
      throw new TypeError('"formatTerm" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

    text = node.nodeValue;
  }

  let contextCallArgs = getContextCallArgs(context);
  let result          = text.replace(/(?:^@@|([^\\])@@)(.+?)@@/g, (m, start, macro) => {
    const fetcher = createDynamicPropertyFetcher(context, macro, contextCallArgs);
    let value = fetcher(context);
    if (value == null)
      value = '';

    if (node && value instanceof DynamicProperty) {
      value.registerForUpdate(node, () => {
        let result = formatTerm(context, text);
        return result;
      });
    }

    return `${start || ''}${value}`;
  });

  return result;
}

const HAS_DYNAMIC_BINDING = /^@@|[^\\]@@/;

export function stringIsDynamicBindingTemplate(value) {
  if (!isType(value, 'String'))
    return false;

  return HAS_DYNAMIC_BINDING.test(value);
}

const EVENT_ACTION_JUST_NAME = /^[\w.$]+$/;
export function createEventCallback(_functionBody) {
  let functionBody = _functionBody;
  if (EVENT_ACTION_JUST_NAME.test(functionBody))
    functionBody = `this.${functionBody}(event)`;

  return (new Function('event', `let e=event,ev=event,evt=event;return ${functionBody.replace(/^\s*return\s*/, '').trim()};`)).bind(this);
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

export function fetchPath(obj, key, defaultValue) {
  if (obj == null || Object.is(obj, NaN) || Object.is(obj, Infinity) || Object.is(obj, -Infinity))
    return defaultValue;

  if (key == null || Object.is(key, NaN) || Object.is(key, Infinity) || Object.is(key, -Infinity))
    return defaultValue;

  let parts         = key.split(/\./g).filter(Boolean);
  let currentValue  = obj;

  for (let i = 0, il = parts.length; i < il; i++) {
    let part = parts[i];
    let nextValue = currentValue[part];
    if (nextValue == null)
      return defaultValue;

    currentValue = nextValue;
  }

  if (globalThis.Node && currentValue && currentValue instanceof globalThis.Node && (currentValue.nodeType === Node.TEXT_NODE || currentValue.nodeType === Node.ATTRIBUTE_NODE))
    return currentValue.nodeValue;

  return (currentValue == null) ? defaultValue : currentValue;
}

const IS_NUMBER = /^([-+]?)(\d*(?:\.\d+)?)(e[-+]\d+)?$/;
const IS_BOOLEAN = /^(true|false)$/;

export function coerce(value) {
  if (value === 'null')
    return null;

  if (value === 'undefined')
    return undefined;

  if (value === 'NaN')
    return NaN;

  if (value === 'Infinity' || value === '+Infinity')
    return Infinity;

  if (value === '-Infinity')
    return -Infinity;

  if (IS_NUMBER.test(value))
    // eslint-disable-next-line no-magic-numbers
    return parseFloat(value, 10);

  if (IS_BOOLEAN.test(value))
    return (value === 'true');

  return ('' + value);
}

const CACHED_PROPERTY_NAMES = new WeakMap();
const SKIP_PROTOTYPES       = [
  globalThis.HTMLElement,
  globalThis.Node,
  globalThis.Element,
  globalThis.Object,
  globalThis.Array,
];

export function getAllPropertyNames(_obj) {
  if (!isCollectable(_obj))
    return [];

  let cachedNames = CACHED_PROPERTY_NAMES.get(_obj);
  if (cachedNames)
    return cachedNames;

  let obj   = _obj;
  let names = new Set();

  while (obj) {
    let objNames = Object.getOwnPropertyNames(obj);
    for (let i = 0, il = objNames.length; i < il; i++)
      names.add(objNames[i]);

    obj = Object.getPrototypeOf(obj);
    if (obj && SKIP_PROTOTYPES.indexOf(obj.constructor) >= 0)
      break;
  }

  let finalNames = Array.from(names);
  CACHED_PROPERTY_NAMES.set(_obj, finalNames);

  return finalNames;
}

const LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE = new WeakMap();
export function getDynamicPropertyForPath(keyPath, defaultValue) {
  let instanceCache = LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.get(this);
  if (!instanceCache) {
    instanceCache = new Map();
    LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.set(this, instanceCache);
  }

  let property = instanceCache.get(keyPath);
  if (!property) {
    let value = defaultValue;

    property = new DynamicProperty(() => value, (newValue) => {
      value = newValue;
    });

    instanceCache.set(keyPath, property);
  }

  return property;
}

export function specialClosest(node, selector) {
  if (!node || !selector)
    return;

  if (typeof node.matches !== 'function')
    return;

  const getParentNode = (element) => {
    if (!element)
      return null;

    if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
      return metadata(element, '_mythixUIShadowParent');

    return element.parentNode;
  };

  let currentNode = node;
  let result;

  while (currentNode && !(result = currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return result;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 0);
  });
}
