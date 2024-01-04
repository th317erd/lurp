import { SHA256 } from './sha256.js';

globalThis.mythixUI = (globalThis.mythixUI || {});

export {
  SHA256,
};

/**
 * type: Namespace
 * name: Utils
 * groupName: Utils
 * desc: |
 *   `import { Utils } from 'mythix-ui-core@1.0';`
 *
 *   Misc utility functions and global constants are found within this namespace.
 * properties:
 *   - name: MYTHIX_NAME_VALUE_PAIR_HELPER
 *     dataType: symbol
 *     desc: |
 *       This is used as a @see Utils.metadata?caption=metadata; key by @see Utils.globalStoreNameValuePairHelper;
 *       to store key/value pairs for a single value.
 *
 *       Mythix UI has global store and fetch helpers for setting and fetching dynamic properties. These
 *       methods only accept a single value by design... but sometimes it is desired that a value be set
 *       with a specific key instead. This `MYTHIX_NAME_VALUE_PAIR_HELPER` property assists with this process,
 *       allowing global helpers to still function with a single value set, while in some cases still passing
 *       a key through to the setter. @sourceRef _mythixNameValuePairHelperUsage;
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *   - name: MYTHIX_SHADOW_PARENT
 *     dataType: symbol
 *     desc: |
 *       This is used as a @see Utils.metadata?caption=metadata; key by @see MythixUIComponent; to
 *       store the parent node of a Shadow DOM, so that it can later be traversed by @see Utils.getParentNode;.
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *       - |
 *         :eye: @see Utils.getParentNode;.
 *   - name: MYTHIX_TYPE
 *     dataType: symbol
 *     desc: |
 *       This is used for type checking by `instanceof` checks to determine if an instance
 *       is a specific type (even across javascript contexts and library versions). @sourceRef _mythixTypeExample;
 *     notes:
 *       - |
 *         :eye: @see Utils.isType;.
 *   - name: DYNAMIC_PROPERTY_TYPE
 *     dataType: symbol
 *     desc: |
 *       Used for runtime type reflection against @see Utils.DynamicProperty;.
 *     notes:
 *       - |
 *         :eye: @see Utils.DynamicProperty;.
 *       - |
 *         :eye: @see Utils.isType;.
 *       - |
 *         :eye: @see Utils.MYTHIX_TYPE;.
 */

function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

export const MYTHIX_NAME_VALUE_PAIR_HELPER  = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper'); // @ref:Utils.MYTHIX_NAME_VALUE_PAIR_HELPER
export const MYTHIX_SHADOW_PARENT           = Symbol.for('@mythix/mythix-ui/constants/shadow-parent'); // @ref:Utils.MYTHIX_SHADOW_PARENT
export const MYTHIX_TYPE                    = Symbol.for('@mythix/mythix-ui/constants/element-definition'); // @ref:Utils.MYTHIX_TYPE

export const DYNAMIC_PROPERTY_TYPE          = Symbol.for('@mythix/mythix-ui/types/MythixUI::DynamicProperty'); // @ref:Utils.DYNAMIC_PROPERTY_TYPE

const ELEMENT_DEFINITION_TYPE               = Symbol.for('@mythix/mythix-ui/types/MythixUI::ElementDefinition');
const QUERY_ENGINE_TYPE                     = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');

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

const ID_COUNTER_CURRENT_VALUE  = Symbol.for('@mythix/mythix-ui/component/constants/id-counter-current-value');

// eslint-disable-next-line no-magic-numbers
let idCounter = (Object.prototype.hasOwnProperty.call(globalThis.mythixUI, ID_COUNTER_CURRENT_VALUE)) ? globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] : 0n;

/**
 * groupName: Utils
 * desc: |
 *   Generate a partially random unique ID. The id generated will be a `Date.now()`
 *   value with an incrementing BigInt postfixed to it.
 * return: |
 *   @types string; A unique ID.
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log('ID: ', Utils.generateID());
 *     // output -> '17041430271790000000000000000007'
 *     ```
 */
export function generateID() {
  idCounter += BigInt(1);
  globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] = idCounter;

  return `${Date.now()}${pad(idCounter.toString(), ID_COUNT_LENGTH)}`;
}

const OBJECT_ID_STORAGE = Symbol.for('@mythix/mythix-ui/component/constants/object-id-storage');
const OBJECT_ID_WEAKMAP = globalThis.mythixUI[OBJECT_ID_STORAGE] = (globalThis.mythixUI[OBJECT_ID_STORAGE]) ? globalThis.mythixUI[OBJECT_ID_STORAGE] : new WeakMap();

/**
 * groupName: Utils
 * desc: |
 *   Get a unique ID for any garbage-collectable reference.
 *
 *   Unique IDs are generated via @see Utils.generateID;.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Any garbage-collectable reference.
 * return: |
 *   @types string; A unique ID for this reference (as a SHA256 hash).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.getObjectID(divElement));
 *     // output -> '17041430271790000000000000000007'
 *     ```
 */
export function getObjectID(value) {
  let id = OBJECT_ID_WEAKMAP.get(value);
  if (id == null) {
    let thisID = generateID();

    OBJECT_ID_WEAKMAP.set(value, thisID);

    return thisID;
  }

  return id;
}

/**
 * groupName: Utils
 * desc: |
 *   Create an unresolved specialized Promise instance, with the intent that it will be
 *   resolved later.
 *
 *   The Promise instance is specialized because the following properties are injected into it:
 *   1. `resolve(resultValue)` - When called, resolves the promise with the first provided argument
 *   2. `reject(errorValue)` - When called, rejects the promise with the first provided argument
 *   3. `status()` - When called, will return the fulfillment status of the promise, as a `string`, one of: `"pending", "fulfilled"`, or `"rejected"`
 *   4. `id<string>` - A randomly generated ID for this promise
 * return: |
 *   @types Promise; An unresolved Promise that can be resolved or rejected by calling `promise.resolve(result)` or `promise.reject(error)` respectively.
 */
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

/**
 * groupName: Utils
 * desc: |
 *   Runtime type reflection helper. This is intended to be a more robust replacement for the `typeof` operator.
 *
 *   This method always returns a name (as a `string` type) of the underlying datatype.
 *   The "datatype" is a little loose for primitive types. For example, a
 *   primitive `typeof x === 'number'` type is returned as its corresponding Object (class) type `'Number'`. For `boolean` it will instead
 *   return `'Boolean'`, and for `'string'`, it will instead return `'String'`. This is true of all underlying primitive types.
 *
 *   For internal datatypes, it will return the real class name prefixed by two colons.
 *   For example, `typeOf(new Map())` will return `'::Map'`.
 *
 *   Non-internal types will not be prefixed, allowing custom types with the same name as internal types to also be detected.
 *   For example, `class Test {}; typeOf(new Test())` will result in the non-prefixed result `'Test'`.
 *
 *   For raw `function` types, `typeOf` will check if they are a constructor or not. If a constructor is detected, then
 *   the format `'[Class ${name}]'` will be returned as the type. For internal types the name will
 *   be prefixed, i.e. `[Class ::${internalName}]`, and for non-internal types will instead be non-prefixed, i.e. `[Class ${name}]` .
 *   For example, `typeOf(Map)` will return `'[Class ::Map]'`, whereas `typeOf(Test)` will result in `'[Class Test]'`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: The value whose type you wish to discover.
 * return: |
 *   @types string; The name of the provided type, or an empty string `''` if the provided value has no type.
 * notes:
 *   - This method will look for a [Symbol.toStringTag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)
 *     key on the value provided... and if found, will use it to assist with finding the correct type name.
 *   - If the `value` provided is type-less, i.e. `undefined`, `null`, or `NaN`, then an empty type `''` will be returned.
 *   - Use the `typeof` operator if you want to detect if a type is primitive or not.
 */
export function typeOf(value) {
  if (value == null || Object.is(value, NaN))
    return '';

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return '::Number';

  let thisType = typeof value;
  if (thisType === 'bigint')
    return '::BigInt';

  if (thisType === 'symbol')
    return '::Symbol';

  if (thisType !== 'object') {
    if (thisType === 'function') {
      let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (value === typeMeta[1]));
      if (nativeTypeMeta)
        return `[Class ::${nativeTypeMeta[0]}]`;

      if (value.prototype && typeof value.prototype.constructor === 'function' && IS_CLASS.test('' + value.prototype.constructor))
        return `[Class ${value.name}]`;

      if (value.prototype && typeof value.prototype[Symbol.toStringTag] === 'function') {
        let result = value.prototype[Symbol.toStringTag]();
        if (result)
          return `[Class ${result}]`;
      }
    }

    return `::${thisType.charAt(0).toUpperCase()}${thisType.substring(1)}`;
  }

  if (Array.isArray(value))
    return '::Array';

  if (value instanceof String)
    return '::String';

  if (value instanceof Number)
    return '::Number';

  if (value instanceof Boolean)
    return '::Boolean';

  let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => {
    try {
      return (typeMeta[0] !== 'Object' && value instanceof typeMeta[1]);
    } catch (e) {
      return false;
    }
  });
  if (nativeTypeMeta)
    return `::${nativeTypeMeta[0]}`;

  if (typeof Math !== 'undefined' && value === Math)
    return '::Math';

  if (typeof JSON !== 'undefined' && value === JSON)
    return '::JSON';

  if (typeof Atomics !== 'undefined' && value === Atomics)
    return '::Atomics';

  if (typeof Reflect !== 'undefined' && value === Reflect)
    return '::Reflect';

  if (value[Symbol.toStringTag])
    return (typeof value[Symbol.toStringTag] === 'function') ? value[Symbol.toStringTag]() : value[Symbol.toStringTag];

  if (isPlainObject(value))
    return '::Object';

  return value.constructor.name || 'Object';
}

/**
 * groupName: Utils
 * desc: |
 *   Runtime type reflection helper. This is intended to be a more robust replacement for the `instanceof` operator.
 *
 *   This method will return `true` if the provided `value` is *any* of the provided `types`.
 *
 *   The provided `types` can each either be a real raw type (i.e. `String` class), or the name of a type, as a string,
 *   i.e. `'::String'`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: The value whose type you wish to compare.
 *   - name: ...types
 *     dataType: Array<any>
 *     desc: All types you wish to check against. String values compare types by name, function values compare types by `instanceof`.
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` matches any of the provided `types`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 */
export function isType(value, ...types) {
  const getInternalTypeName = (type) => {
    let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (type === typeMeta[1]));
    if (nativeTypeMeta)
      return `::${nativeTypeMeta[0]}`;
  };

  let valueType = typeOf(value);
  for (let type of types) {
    try {
      if (typeOf(type, '::String') && valueType === type) {
        return true;
      } else if (typeof type === 'function') {
        if (value instanceof type)
          return true;

        let internalType = getInternalTypeName(type);
        if (internalType && internalType === valueType)
          return true;
      }
    } catch (e) {
      continue;
    }
  }

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Verify that the provided `value` is a `number` type (or `Number` instance), and that
 *   it **is not** `NaN`, `Infinity`, or `-Infinity`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` is a `number` (or `Number` instance) and is also **not** `NaN`, `Infinity`, or `-Infinity`. i.e. `(isNumber(value) && isFinite(value))`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
export function isValidNumber(value) {
  return (isType(value, '::Number') && isFinite(value));
}

/**
 * groupName: Utils
 * desc: |
 *   Verify that the provided `value` is a "plain"/"vanilla" Object instance.
 *
 *   This method is intended to help the caller detect if an object is a "raw plain object",
 *   inheriting from `Object.prototype` (or a `null` prototype).
 *
 *   1. `isPlainObject({})` will return `true`.
 *   2. `isPlainObject(new Object())` will return `true`.
 *   3. `isPlainObject(Object.create(null))` will return `true`.
 *   4. `isPlainObject(new CustomClass())` will return `false`.
 *   5. All other invocations should return `false`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` is a "raw"/"plain" Object instance.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
export function isPlainObject(value) {
  if (!value)
    return false;

  if (typeof value !== 'object')
    return false;

  if (value.constructor === Object || value.constructor == null)
    return true;

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is a javascript primitive type.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `typeof value` is one of: `string`, `number`, `boolean`, `bigint`, or `symbol`,
 *      *and also* `value` is *not* `NaN`, `Infinity`, `-Infinity`, `undefined`, or `null`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
export function isPrimitive(value) {
  if (value == null || Object.is(value, NaN))
    return false;

  if (typeof value === 'symbol')
    return true;

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return false;

  return isType(value, '::String', '::Number', '::Boolean', '::BigInt');
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is garbage collectable.
 *
 *   This method is used to check if any `value` is allowed to be used as a weak reference.
 *
 *   Essentially, this will return `false` for any primitive type, or `null`, `undefined`, `NaN`, `Infinity`, or `-Infinity` values.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `typeof value` is one of: `string`, `number`, `boolean`, `bigint`, or `symbol`,
 *      *and also* `value` *is not* `NaN`, `Infinity`, `-Infinity`, `undefined`, or `null`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
export function isCollectable(value) {
  if (value == null || Object.is(value, NaN) || Object.is(Infinity) || Object.is(-Infinity))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (isType(value, '::String', '::Number', '::Boolean', '::BigInt'))
    return false;

  return true;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is "empty" (is **N**ull **O**r **E**mpty).
 *
 *   A value is considered "empty" if any of the following conditions is met:
 *   1. `value` is `undefined`.
 *   2. `value` is `null`.
 *   3. `value` is `''` (an empty string).
 *   4. `value` is not an empty string, but it contains nothing except whitespace (`\t`, `\r`, `\s`, or `\n`).
 *   5. `value` is `NaN`.
 *   6. `value.length` is a `Number` or `number` type, and is equal to `0`.
 *   7. `value` is a @see Utils.isPlainObject?caption=plain+object; and has no iterable keys.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if any of the "empty" conditions above are true.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.isNotNOE;.
 */
export function isNOE(value) {
  if (value == null)
    return true;

  if (Object.is(value, NaN))
    return true;

  if (value === '')
    return true;

  if (isType(value, '::String') && (/^[\t\s\r\n]*$/).test(value))
    return true;

  if (isType(value.length, '::Number'))
    return (value.length === 0);

  if (isPlainObject(value) && Object.keys(value).length === 0)
    return true;

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is **not** "empty" (is not **N**ull **O**r **E**mpty).
 *
 *   A value is considered "empty" if any of the following conditions is met:
 *   1. `value` is `undefined`.
 *   2. `value` is `null`.
 *   3. `value` is `''` (an empty string).
 *   4. `value` is not an empty string, but it contains nothing except whitespace (`\t`, `\r`, `\s`, or `\n`).
 *   5. `value` is `NaN`.
 *   6. `value.length` is a `Number` or `number` type, and is equal to `0`.
 *   7. `value` is a @see Utils.isPlainObject?caption=plain+object; and has no iterable keys.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `false` if any of the "empty" conditions above are true.
 *   2. Otherwise, `true` is returned.
 * notes:
 *   - |
 *     :info: This is the exact inverse of @see Utils.isNOE;
 *   - |
 *     :eye: @see Utils.isNOE;.
 */
export function isNotNOE(value) {
  return !isNOE(value);
}

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 *
 *   The process is roughly as follows:
 *   1. Any non-word characters ([a-zA-Z0-9_]) are stripped from the beginning of the string.
 *   2. Any non-word characters ([a-zA-Z0-9_]) are stripped from the end of the string.
 *   3. Each "word" is capitalized.
 *   4. The first letter is always lower-cased.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to convert into [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 * return: |
 *   @types string; The formatted string in [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toCamelCase('--test-some_value_@'));
 *     // output -> 'testSomeValue'
 *     ```
 */
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

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 *
 *   The process is roughly as follows:
 *   1. Any capitalized character sequence is prefixed by an underscore.
 *   2. More than one sequential underscores are converted into a single underscore.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to convert into [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 * return: |
 *   @types string; The formatted string in [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toSnakeCase('ThisIsASentence'));
 *     // output -> 'this_is_a_sentence'
 *     ```
 */
export function toSnakeCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `_${m.toLowerCase()}` : m.toLowerCase()))
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 *
 *   The process is roughly as follows:
 *   1. Any capitalized character sequence is prefixed by a hyphen.
 *   2. More than one sequential hyphens are converted into a single hyphen.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to turn into [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 * return: |
 *   @types string; The formatted string in [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toCamelCase('ThisIsASentence'));
 *     // output -> 'this-is-a-sentence'
 *     ```
 */
export function toKebabCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase()))
    .replace(/-{2,}/g, '-')
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
      if (key === 'constructor' || key === 'prototype')
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

const METADATA_STORAGE = Symbol.for('@mythix/mythix-ui/component/constants/metadata-storage');
const METADATA_WEAKMAP = globalThis.mythixUI[METADATA_STORAGE] = (globalThis.mythixUI[METADATA_STORAGE]) ? globalThis.mythixUI[METADATA_STORAGE] : new WeakMap();

/**
 * groupName: Utils
 * desc: |
 *   Store and retrieve metadata on any garbage-collectable reference.
 *
 *   This function uses an internal WeakMap to store metadata for any garbage-collectable value.
 *
 *   The number of arguments provided will change the behavior of this function:
 *   1. If only one argument is supplied (a `target`), then a Map of metadata key/value pairs is returned.
 *   2. If only two arguments are supplied, then `metadata` acts as a getter, and the value stored under the specified `key` is returned.
 *   3. If more than two arguments are supplied, then `metadata` acts as a setter, and `target` is returned (for continued chaining).
 * arguments:
 *   - name: target
 *     dataType: any
 *     desc: |
 *       This is the value for which metadata is being stored or retrieved.
 *       This can be any garbage-collectable value (any value that can be used as a key in a WeakMap).
 *   - name: key
 *     dataType: any
 *     optional: true
 *     desc: |
 *       The key used to store or fetch the specified metadata value. This can be any value, as the underlying
 *       storage is a Map.
 *   - name: value
 *     dataType: any
 *     optional: true
 *     desc: |
 *       The value to store on the `target` under the specified `key`.
 * return: |
 *   @types any;
 *   1. If only one argument is provided (a bulk get operation), return a Map containing the metadata for the specified `target`.
 *   2. If two arguments are provided (a get operation), the `target` metadata value stored for the specified `key`.
 *   2. If more than two arguments are provided (a set operation), the provided `target` is returned.
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     // set
 *     Utils.metadata(myElement, 'customCaption', 'Metadata Caption!');
 *
 *     // get
 *     console.log(Utils.metadata(myElement, 'customCaption'));
 *     // output -> 'Metadata Caption!'
 *
 *     // get all
 *     console.log(Utils.metadata(myElement));
 *     // output -> Map(1) { 'customCaption' => 'Metadata Caption!' }
 *     ```
 */
export function metadata(target, key, value) {
  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    if (!isCollectable(target))
      throw new Error(`Unable to set metadata on provided object: ${(typeof target === 'symbol') ? target.toString() : target}`);

    data = new Map();
    METADATA_WEAKMAP.set(target, data);
  }

  if (arguments.length === 1)
    return data;

  if (arguments.length === 2)
    return (data) ? data.get(key) : undefined;

  data.set(key, value);

  return target;
}

/**
 * groupName: Utils
 * desc: |
 *   Do our best to emulate [process.nextTick](https://nodejs.org/en/guides/event-loop-timers-and-nexttick/#processnexttick)
 *   in the browser.
 *
 *   In order to try and emulate `process.nextTick`, this function will use `globalThis.requestAnimationFrame(() => callback())` if available,
 *   otherwise it will fallback to using `Promise.resolve().then(callback)`.
 * arguments:
 *   - name: callback
 *     dataType: function
 *     desc: Callback function to call on "nextTick".
 * notes:
 *   - |
 *     :info: This function will prefer and use `process.nextTick` if it is available (i.e. if running on NodeJS).
 *   - |
 *     :warning: This function is unlikely to actually be the next "tick" of the underlying
 *     javascript engine. This method just does its best to emulate "nextTick". Instead of the
 *     actual "next tick", this will instead be "as fast as possible".
 *   - |
 *     :info: This function deliberately attempts to use `requestAnimationFrame` first--even though it likely doesn't
 *     have the fastest turn-around-time--to save battery power. The idea being that "something needs to be done *soon*".
 */
export function nextTick(callback) {
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    process.nextTick(callback);
  } else if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(() => {
      callback();
    });
  } else {
    (new Promise((resolve) => {
      resolve();
    })).then(() => {
      callback();
    });
  }
}

const DYNAMIC_PROPERTY_VALUE      = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/value');
const DYNAMIC_PROPERTY_IS_SETTING = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');
const DYNAMIC_PROPERTY_SET        = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/set');

/**
 * groupName: Utils
 * desc: |
 *   `DynamicProperty` is a simple value storage class wrapped in a Proxy.
 *
 *    It will allow the user to store any desired value. The catch however is that
 *    any value stored can only be set through its special `set` method.
 *
 *    This will allow any listeners to receive the `'update'` event when a value is set.
 *
 *    Since `DynamicProperty` instances are also always wrapped in a Proxy, the user may
 *    "directly" access attributes of the stored value. For example, if a `DynamicProperty`
 *    is storing an Array instance, then one would be able to access the `.length` property
 *    "directly", i.e. `dynamicProp.length`.
 *
 *    `DynamicProperty` has a special `set` method, whose name is a `symbol`, to avoid conflicting
 *    namespaces with the underlying datatype (and the wrapping Proxy).
 *    To set a value on a `DynamicProperty` instance, one must do so as follows: `dynamicProperty[DynamicProperty.set](myNewValue)`.
 *    This will update the internal value, and if the set value differs from the stored value, the `'update'` event will be dispatched to
 *    any listeners.
 *
 *    As `DynamicProperty` is an [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget), one can attach
 *    event listeners to the `'update'` event to listen for updates to the underlying value. The `'update'` event is the only event that is
 *    ever triggered by this class. The received `event` instance in event callbacks will have the following attributes:
 *    1. `updateEvent.originator = this;` - `originator` is the instance of the `DynamicProperty` where the event originated from.
 *    2. `updateEvent.oldValue = currentValue;` - `oldValue` contains the previous value of the `DynamicProperty` before set.
 *    3. `updateEvent.value = newValue;` - `value` contains the current value being set on the `DynamicProperty`.
 *
 *    To retrieve the underlying raw value of a `DynamicProperty`, one may call `valueOf()`: `let rawValue = dynamicProperty.valueOf();`
 * notes:
 *   - |
 *     :warning: `DynamicProperty` instances will internally track when a `set` operation is underway, to prevent
 *     cyclic sets and maximum call stack errors. You are allowed to set the value recursively, however `update` events
 *     will only be dispatched for the first `set` call. Any `set` operation that happens while another `set` operation is
 *     underway will **not** dispatch any `'update'` events.
 *   - |
 *     `'update'` events will be dispatched immediately *after* the internal underlying stored value is updated. Though it is
 *     possible to `stopImmediatePropagation` in an event callback, attempting to "preventDefault" or "stopPropagation" will do nothing.
 * examples:
 *   - |
 *     ```javascript
 *     import { DynamicProperty } from 'mythix-ui-core@1.0';
 *
 *     let dynamicProperty = new DynamicProperty('initial value');
 *
 *     dynamicProperty.addEventListener('update', (event) => {
 *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
 *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
 *     });
 *
 *     dynamicProperty[DynamicProperty.set]('new value');
 *
 *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
 *     // output -> Current Value = 'initial value'
 *     ```
 */
export class DynamicProperty extends EventTarget {
  static [Symbol.hasInstance](instance) { // @ref:_mythixTypeExample
    try {
      return (instance && instance[MYTHIX_TYPE] === DYNAMIC_PROPERTY_TYPE);
    } catch (e) {
      return false;
    }
  }

  /**
   * type: Property
   * name: set
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * static: true
   * desc: |
   *   A special `symbol` used to access the `set` method of a `DynamicProperty`.
   * examples:
   *   - |
   *     ```javascript
   *     import { DynamicProperty } from 'mythix-ui-core@1.0';
   *
   *     let dynamicProperty = new DynamicProperty('initial value');
   *
   *     dynamicProperty.addEventListener('update', (event) => {
   *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
   *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
   *     });
   *
   *     dynamicProperty[DynamicProperty.set]('new value');
   *
   *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
   *     // output -> Current Value = 'initial value'
   *     ```
   */
  static set = DYNAMIC_PROPERTY_SET; // @ref:DynamicProperty.set

  constructor(defaultValue) {
    super();

    Object.defineProperties(this, {
      [MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        DYNAMIC_PROPERTY_TYPE,
      },
      [DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        defaultValue,
      },
      [DYNAMIC_PROPERTY_IS_SETTING]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        false,
      },
    });

    let proxy = new Proxy(this, {
      get:  (target, propName) => {
        if (propName in target) {
          let value = target[propName];
          return (typeof value === 'function') ? value.bind(target) : value;
        }

        let value = target[DYNAMIC_PROPERTY_VALUE][propName];
        return (value === 'function') ? value.bind(target[DYNAMIC_PROPERTY_VALUE]) : value;
      },
      set:  (target, propName, value) => {
        if (propName in target)
          target[propName] = value;
        else
          target[DYNAMIC_PROPERTY_VALUE][propName] = value;

        return true;
      },
    });

    return proxy;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number')
      return +this[DYNAMIC_PROPERTY_VALUE];
    else if (hint === 'string')
      return this.toString();

    return this.valueOf();
  }

  toString() {
    let value = this[DYNAMIC_PROPERTY_VALUE];
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  valueOf() {
    return this[DYNAMIC_PROPERTY_VALUE];
  }

  [DYNAMIC_PROPERTY_SET](_newValue) {
    let newValue = _newValue;
    if (isType(newValue, DynamicProperty))
      newValue = newValue.valueOf();

    if (this[DYNAMIC_PROPERTY_VALUE] === newValue)
      return;

    if (this[DYNAMIC_PROPERTY_IS_SETTING]) {
      this[DYNAMIC_PROPERTY_VALUE] = newValue;
      return;
    }

    try {
      this[DYNAMIC_PROPERTY_IS_SETTING] = true;

      let oldValue    = this[DYNAMIC_PROPERTY_VALUE];
      let updateEvent = new Event('update');

      updateEvent.originator = this;
      updateEvent.oldValue = oldValue;
      updateEvent.value = newValue;

      this[DYNAMIC_PROPERTY_VALUE] = newValue;

      this.dispatchEvent(updateEvent);
    } catch (error) {
      console.error(error);
    } finally {
      this[DYNAMIC_PROPERTY_IS_SETTING] = false;
    }
  }
}

const VALID_JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
function getContextCallArgs(context, ...extraContexts) {
  let contextCallArgs = Array.from(
    new Set(getAllPropertyNames(context).concat(
      Object.keys(globalThis.mythixUI.globalScope || {}),
      [ 'attributes', 'classList', '$$', 'i18n' ],
      ...extraContexts.map((extraContext) => Object.keys(extraContext || {})),
    )),
  ).filter((name) => VALID_JS_IDENTIFIER.test(name));

  return `{${contextCallArgs.join(',')}}`;
}

export function getParentNode(element) {
  if (!element)
    return null;

  if (element.parentNode && element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element.parentNode, MYTHIX_SHADOW_PARENT);

  if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element, MYTHIX_SHADOW_PARENT);

  return element.parentNode;
}

export function createScope(..._targets) {
  const findPropNameScope = (target, propName) => {
    if (target == null || Object.is(target, NaN))
      return;

    if (propName in target)
      return target;

    if (!(target instanceof Node))
      return;

    const fetchPublishContext = (element) => {
      let currentElement = element;
      if (!currentElement)
        return;

      let componentPublishContext;
      do {
        if (propName in currentElement)
          return currentElement;

        componentPublishContext = currentElement.publishContext;
        if (typeof componentPublishContext === 'function')
          break;

        currentElement = getParentNode(currentElement);
      } while (currentElement);

      if (!componentPublishContext || !currentElement)
        return;

      let publishedContext = componentPublishContext.call(currentElement);
      if (!publishedContext || !(propName in publishedContext))
        return fetchPublishContext(getParentNode(currentElement));

      return publishedContext;
    };

    return fetchPublishContext(target);
  };

  let targets         = _targets.filter(Boolean);
  let firstElement    = targets.find((target) => (target instanceof Node)) || targets[0];
  let baseContext     = {};
  let fallbackContext = {
    globalScope:  (globalThis.mythixUI && globalThis.mythixUI.globalScope),
    i18n:         (path, defaultValue) => {
      let languageProvider = specialClosest(firstElement, 'mythix-language-provider');
      if (!languageProvider)
        return defaultValue;

      return languageProvider.i18n(path, defaultValue);
    },
    dynamicPropID,
  };

  targets = targets.concat(fallbackContext);
  let proxy   = new Proxy(baseContext, {
    ownKeys: () => {
      let allKeys = [];

      for (let target of targets)
        allKeys = allKeys.concat(getAllPropertyNames(target));

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (globalScope)
        allKeys = allKeys.concat(Object.keys(globalScope));

      return Array.from(new Set(allKeys));
    },
    has: (_, propName) => {
      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return true;
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return false;

      return (propName in globalScope);
    },
    get: (_, propName) => {
      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return scope[propName];
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return;

      return globalScope[propName];
    },
    set: (_, propName, value) => {
      const doSet = (scope, propName, value) => {
        if (isType(scope[propName], DynamicProperty))
          scope[propName][DynamicProperty.set](value);
        else
          scope[propName] = value;

        return true;
      };

      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return doSet(scope, propName, value);
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return false;

      return doSet(globalScope, propName, value);
    },
  });

  fallbackContext.$$ = proxy;

  return proxy;
}

const EVENT_ACTION_JUST_NAME = /^%?[\w.$]+$/;
export function createTemplateMacro({ prefix, body, scope }) {
  let functionBody = body;
  if (EVENT_ACTION_JUST_NAME.test(functionBody)) {
    if (functionBody.charAt(0) === '%') {
      functionBody = `(this.dynamicPropID || globalThis.mythixUI.globalScope.dynamicPropID)('${functionBody.substring(1).trim().replace(/[^\w$]/g, '')}')`;
    } else {
      functionBody = `(() => {
        try {
          let ____$ = ${functionBody};
          return (typeof ____$ === 'function') ? ____$.apply(this, Array.from(arguments).slice(1)) : ____$;
        } catch (e) {
          return this.${functionBody}.apply(this, Array.from(arguments).slice(1));
        }
      })();`;
    }
  }

  let contextCallArgs = getContextCallArgs(scope);

  functionBody = `${(prefix) ? `${prefix};` : ''}return ${(functionBody || '(void 0)').replace(/^\s*return\s+/, '').trim()};`;
  return (new Function(contextCallArgs, functionBody)).bind(scope, scope);
}

export function parseTemplateParts(text, _options) {
  let options       = _options || {};
  let scope         = options.scope;
  let parts         = [];
  let currentOffset = 0;

  text.replace(/(?<!\\)(@@)(.+?)\1/g, (m, start, macro, offset) => {
    if (currentOffset < offset)
      parts.push({ type: 'literal', value: text.substring(currentOffset, offset) });

    currentOffset = offset + m.length;

    let method  = createTemplateMacro({ body: macro, scope });
    let value   = method();

    parts.push({ type: 'macro', value, method });
  });

  if (currentOffset < text.length)
    parts.push({ type: 'literal', value: text.substring(currentOffset) });

  return parts;
}

export function compileTemplateFromParts(parts) {
  let result = parts
    .map((part) => part.value)
    .filter((item) => (item != null && item !== ''));

  if (result.some((item) => (item[MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE || item[MYTHIX_TYPE] === QUERY_ENGINE_TYPE)))
    return result;

  if (result.some((item) => isType(item, '::String')))
    return result.join('');

  return (result.length < 2) ? result[0] : result;
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
export function formatNodeValue(node, _options) {
  if (node.parentNode && (/^(style|script)$/).test(node.parentNode.localName))
    return node.nodeValue;

  if (!node || FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
    throw new TypeError('"formatNodeValue" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

  let options       = _options || {};
  let text          = node.nodeValue;
  let templateParts = parseTemplateParts(text, options);

  templateParts.forEach(({ value }) => {
    if (options.bindToDynamicProperties !== false && isType(value, DynamicProperty)) {
      value.addEventListener('update', () => {
        let result = ('' + compileTemplateFromParts(templateParts));
        if (result !== node.nodeValue)
          node.nodeValue = result;
      }, { capture: true });
    }
  });

  let result = compileTemplateFromParts(templateParts);
  if (result == null)
    result = '';

  return (options.disallowHTML === true) ? ('' + result) : result;
}

const IS_TEMPLATE = /(?<!\\)@@/;
export function isTemplate(value) {
  if (!isType(value, '::String'))
    return false;

  return IS_TEMPLATE.test(value);
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = new Map();

export function getAllEventNamesForElement(element) {
  let tagName = (!element.tagName) ? element : element.tagName.toUpperCase();
  let cache   = EVENT_NAME_CACHE.get(tagName);
  if (cache)
    return cache;

  let eventNames = [];

  for (let key in element) {
    if (key.length > 2 && IS_EVENT_NAME.test(key))
      eventNames.push(key.toLowerCase());
  }

  EVENT_NAME_CACHE.set(tagName, eventNames);

  return eventNames;
}

export function bindEventToElement(element, eventName, _callback) {
  let options = {};
  let callback;

  if (isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else {
    callback = _callback;
  }

  if (isType(callback, '::String'))
    callback = createTemplateMacro({ prefix: 'let event=arguments[1]', body: callback, scope: this });

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
    property = new DynamicProperty(defaultValue);
    instanceCache.set(keyPath, property);
  }

  return property;
}

export function specialClosest(node, selector) {
  if (!node || !selector)
    return;

  let currentNode = node;
  while (currentNode && (typeof currentNode.matches !== 'function' || !currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return currentNode;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 0);
  });
}

export function dynamicProp(name, defaultValue, setter) {
  let dynamicProperty = new DynamicProperty(defaultValue);

  Object.defineProperties(this, {
    [name]: {
      enumerable:   true,
      configurable: true,
      get:          () => dynamicProperty,
      set:          (newValue) => {
        if (typeof setter === 'function')
          dynamicProperty[DynamicProperty.set](setter(newValue));
        else
          dynamicProperty[DynamicProperty.set](newValue);
      },
    },
  });

  return dynamicProperty;
}

const DYNAMIC_PROP_REGISTRY = new Map();
export function dynamicPropID(id) {
  let prop = DYNAMIC_PROP_REGISTRY.get(id);
  if (prop)
    return prop;

  prop = new DynamicProperty('');
  DYNAMIC_PROP_REGISTRY.set(id, prop);

  return prop;
}

export function globalStoreNameValuePairHelper(target, name, value) {
  metadata(
    target,
    MYTHIX_NAME_VALUE_PAIR_HELPER,
    [ name, value ],
  );

  return target;
}

const REGISTERED_DISABLE_TEMPLATE_SELECTORS = new Set([ '[data-templates-disable]', 'mythix-for-each' ]);
export function getDisableTemplateEngineSelector() {
  return Array.from(REGISTERED_DISABLE_TEMPLATE_SELECTORS).join(',');
}

export function registerDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.add(selector);
}

export function unregisterDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.delete(selector);
}

function globalStoreHelper(dynamic, args) {
  if (args.length === 0)
    return;

  const setOnGlobal = (name, value) => {
    let currentValue = globalThis.mythixUI.globalScope[name];
    if (isType(currentValue, DynamicProperty)) {
      globalThis.mythixUI.globalScope[name][DynamicProperty.set](value);
      return currentValue;
    }

    if (isType(value, DynamicProperty)) {
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => value,
          set:          (newValue) => {
            value[DynamicProperty.set](newValue);
          },
        },
      });

      return value;
    } else if (dynamic) {
      let prop = dynamicPropID(name);
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => prop,
          set:          (newValue) => {
            prop[DynamicProperty.set](newValue);
          },
        },
      });

      prop[DynamicProperty.set](value);

      return prop;
    } else {
      globalThis.mythixUI.globalScope[name] = value;
      return value;
    }
  };

  let nameValuePair = (isCollectable(args[0])) ? metadata(
    args[0],                        // context
    MYTHIX_NAME_VALUE_PAIR_HELPER,  // special key
  ) : null; // @ref:_mythixNameValuePairHelperUsage

  if (nameValuePair) {
    let [ name, value ] = nameValuePair;
    setOnGlobal(name, value);
  } else if (args.length > 1 && isType(args[0], '::String')) {
    let name  = args[0];
    let value = args[1];
    setOnGlobal(name, value);
  } else {
    let value = args[0];
    let name  = (typeof this.getIdentifier === 'function') ? this.getIdentifier() : (this.getAttribute('id') || this.getAttribute('name'));
    if (!name)
      throw new Error('"mythixUI.globalStore": "name" is unknown, so unable to store value');

    setOnGlobal(name, value);
  }
}

export function globalStore(...args) {
  return globalStoreHelper.call(this, false, args);
}

export function globalStoreDynamic(...args) {
  return globalStoreHelper.call(this, true, args);
}
