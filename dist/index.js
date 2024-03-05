/******/ var __webpack_modules__ = ({

/***/ "./node_modules/deepmerge/dist/cjs.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/cjs.js ***!
  \********************************************/
/***/ ((module) => {



var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "./lib/base-utils.js":
/*!***************************!*\
  !*** ./lib/base-utils.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHA256: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_0__.SHA256),
/* harmony export */   coerce: () => (/* binding */ coerce),
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   generateID: () => (/* binding */ generateID),
/* harmony export */   getObjectID: () => (/* binding */ getObjectID),
/* harmony export */   isCollectable: () => (/* binding */ isCollectable),
/* harmony export */   isNOE: () => (/* binding */ isNOE),
/* harmony export */   isNotNOE: () => (/* binding */ isNotNOE),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase),
/* harmony export */   toSnakeCase: () => (/* binding */ toSnakeCase),
/* harmony export */   typeOf: () => (/* binding */ typeOf)
/* harmony export */ });
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256.js */ "./lib/sha256.js");


globalThis.mythixUI = (globalThis.mythixUI || {});



/**
 * type: Namespace
 * name: BaseUtils
 * groupName: BaseUtils
 * desc: |
 *   `import { BaseUtils } from 'mythix-ui-core@1.0';`
 *
 *   Misc utility functions and global constants are found within this namespace.
 */

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

const ID_COUNTER_CURRENT_VALUE  = Symbol.for('@mythix/mythix-ui/component/constants/id-counter-current-value');

// eslint-disable-next-line no-magic-numbers
let idCounter = (Object.prototype.hasOwnProperty.call(globalThis.mythixUI, ID_COUNTER_CURRENT_VALUE)) ? globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] : 0n;

/**
 * groupName: BaseUtils
 * desc: |
 *   Generate a partially random unique ID. The id generated will be a `Date.now()`
 *   value with an incrementing BigInt postfixed to it.
 * return: |
 *   @types string; A unique ID.
 * examples:
 *   - |
 *     ```javascript
 *     import { BaseUtils } from 'mythix-ui-core@1.0';
 *
 *     console.log('ID: ', BaseUtils.generateID());
 *     // output -> 'ID17041430271790000000000000000007'
 *     ```
 */
function generateID() {
  idCounter += BigInt(1);
  globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] = idCounter;

  return `ID${Date.now()}${pad(idCounter.toString(), ID_COUNT_LENGTH)}`;
}

const OBJECT_ID_STORAGE = Symbol.for('@mythix/mythix-ui/component/constants/object-id-storage');
const OBJECT_ID_WEAKMAP = globalThis.mythixUI[OBJECT_ID_STORAGE] = (globalThis.mythixUI[OBJECT_ID_STORAGE]) ? globalThis.mythixUI[OBJECT_ID_STORAGE] : new WeakMap();

/**
 * groupName: BaseUtils
 * desc: |
 *   Get a unique ID for any garbage-collectable reference.
 *
 *   Unique IDs are generated via @see BaseUtils.generateID;.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Any garbage-collectable reference.
 * return: |
 *   @types string; A unique ID for this reference (as a SHA256 hash).
 * examples:
 *   - |
 *     ```javascript
 *     import { BaseUtils } from 'mythix-ui-core@1.0';
 *
 *     console.log(BaseUtils.getObjectID(divElement));
 *     // output -> '17041430271790000000000000000007'
 *     ```
 */
function getObjectID(value) {
  let id = OBJECT_ID_WEAKMAP.get(value);
  if (id == null) {
    let thisID = generateID();

    OBJECT_ID_WEAKMAP.set(value, thisID);

    return thisID;
  }

  return id;
}

/**
 * groupName: BaseUtils
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
function createResolvable() {
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
 * groupName: BaseUtils
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
function typeOf(value) {
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
 * groupName: BaseUtils
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
 *     :eye: @see BaseUtils.typeOf;.
 */
function isType(value, ...types) {
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
 * groupName: BaseUtils
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
 *     :eye: @see BaseUtils.typeOf;.
 *   - |
 *     :eye: @see BaseUtils.isType;.
 */
function isValidNumber(value) {
  return (isType(value, '::Number') && isFinite(value));
}

/**
 * groupName: BaseUtils
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
 *     :eye: @see BaseUtils.typeOf;.
 *   - |
 *     :eye: @see BaseUtils.isType;.
 */
function isPlainObject(value) {
  if (!value)
    return false;

  if (typeof value !== 'object')
    return false;

  if (value.constructor === Object || value.constructor == null)
    return true;

  return false;
}

/**
 * groupName: BaseUtils
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
 *     :eye: @see BaseUtils.typeOf;.
 *   - |
 *     :eye: @see BaseUtils.isType;.
 */
function isPrimitive(value) {
  if (value == null || Object.is(value, NaN))
    return false;

  if (typeof value === 'symbol')
    return true;

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return true;

  return isType(value, '::String', '::Number', '::Boolean', '::BigInt');
}

/**
 * groupName: BaseUtils
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
 *     :eye: @see BaseUtils.typeOf;.
 *   - |
 *     :eye: @see BaseUtils.isType;.
 */
function isCollectable(value) {
  if (value == null || Object.is(value, NaN) || Object.is(Infinity) || Object.is(-Infinity))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (isType(value, '::String', '::Number', '::Boolean', '::BigInt'))
    return false;

  return true;
}

/**
 * groupName: BaseUtils
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
 *   7. `value` is a @see BaseUtils.isPlainObject?caption=plain+object; and has no iterable keys.
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
 *     :eye: @see BaseUtils.isNotNOE;.
 */
function isNOE(value) {
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
 * groupName: BaseUtils
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
 *   7. `value` is a @see BaseUtils.isPlainObject?caption=plain+object; and has no iterable keys.
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
 *     :info: This is the exact inverse of @see BaseUtils.isNOE;
 *   - |
 *     :eye: @see BaseUtils.isNOE;.
 */
function isNotNOE(value) {
  return !isNOE(value);
}

/**
 * groupName: BaseUtils
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
 *     import { BaseUtils } from 'mythix-ui-core@1.0';
 *
 *     console.log(BaseUtils.toCamelCase('--test-some_value_@'));
 *     // output -> 'testSomeValue'
 *     ```
 */
function toCamelCase(value) {
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
 * groupName: BaseUtils
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
 *     import { BaseUtils } from 'mythix-ui-core@1.0';
 *
 *     console.log(BaseUtils.toSnakeCase('ThisIsASentence'));
 *     // output -> 'this_is_a_sentence'
 *     ```
 */
function toSnakeCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `_${m.toLowerCase()}` : m.toLowerCase()))
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * groupName: BaseUtils
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
 *     import { BaseUtils } from 'mythix-ui-core@1.0';
 *
 *     console.log(BaseUtils.toKebabCase('ThisIsASentence'));
 *     // output -> 'this-is-a-sentence'
 *     ```
 */

const IS_LAST_CHAR_UPPERCASE = /[A-Z]$/;
function toKebabCase(value) {
  return ('' + value)
    .replace(/[A-Z][a-z]+|[A-Z]{2,}/g, (m, offset) => {
      if (m.length > 1 && IS_LAST_CHAR_UPPERCASE.test(m))
        return (`${(offset) ? '-' : ''}${m.slice(0, -1)}-${m.slice(-1)}`).toLowerCase();

      return ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase());
    })
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

/**
 * groupName: BaseUtils
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
function nextTick(callback) {
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

const IS_NUMBER = /^([-+]?)(\d*(?:\.\d+)?)(e[-+]\d+)?$/;
const IS_BOOLEAN = /^(true|false)$/;

/**
 * groupName: BaseUtils
 * desc: |
 *   Coerce a string to its most likely underlying primitive type.
 *
 *   Conversion input and output table:
 *   * `'null'` converts to `null`
 *   * `'undefined'` converts to `undefined`
 *   * `'NaN'` converts to `NaN`
 *   * `'Infinity'` converts to `Infinity`
 *   * `'-Infinity'` converts to `-Infinity`
 *   * `'true'` converts to `true`
 *   * `'false'` converts to `false`
 *   * Any parsable numeric string value (including [E notation](https://en.wikipedia.org/wiki/Scientific_notation#E_notation)) converts to `number`
 *
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: Value to convert.
 */
function coerce(value) {
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

  return value;
}


/***/ }),

/***/ "./lib/component-utils.js":
/*!********************************!*\
  !*** ./lib/component-utils.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getIdentifier: () => (/* binding */ getIdentifier),
/* harmony export */   getLargestDocumentTabIndex: () => (/* binding */ getLargestDocumentTabIndex),
/* harmony export */   getVisibilityMeta: () => (/* binding */ getVisibilityMeta),
/* harmony export */   importIntoDocumentFromSource: () => (/* binding */ importIntoDocumentFromSource),
/* harmony export */   insertScriptIntoHead: () => (/* binding */ insertScriptIntoHead),
/* harmony export */   loadPartialIntoElement: () => (/* binding */ loadPartialIntoElement),
/* harmony export */   require: () => (/* binding */ require),
/* harmony export */   resolveURL: () => (/* binding */ resolveURL),
/* harmony export */   visibilityObserver: () => (/* binding */ visibilityObserver)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");






/**
 * type: Namespace
 * name: ComponentUtils
 * groupName: ComponentUtils
 * desc: |
 *   `import { ComponentUtils } from 'mythix-ui-core@1.0';`
 *
 *   Component and framework classes and functionality are found here.
 */

function getIdentifier(target) {
  if (!target)
    return 'undefined';

  if (typeof target.getIdentifier === 'function')
    return target.getIdentifier.call(target);

  if (target instanceof Element)
    return target.getAttribute('id') || target.getAttribute('name') || target.getAttribute('data-name') || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toCamelCase(target.localName);

  return 'undefined';
}

function resolveURL(rootLocation, _urlish) {
  let urlish = _urlish;
  if (urlish instanceof URL)
    urlish = urlish.toString();

  if (!urlish)
    urlish = '';

  if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(urlish, '::String'))
    return;

  let url = new URL(urlish, new URL(rootLocation));
  if (typeof globalThis.mythixUI.urlResolver === 'function') {
    let fileName  = '';
    let path      = '/';

    url.pathname.replace(/^(.*\/)([^/]+)$/, (m, first, second) => {
      path = first.replace(/\/+$/, '/');
      if (path.charAt(path.length - 1) !== '/')
        path = `${path}/`;

      fileName = second;
      return m;
    });

    let newSrc = globalThis.mythixUI.urlResolver.call(this, { src: urlish, url, path, fileName });
    if (newSrc === false) {
      console.warn(`"mythix-require": Not loading "${urlish}" because the global "mythixUI.urlResolver" requested I not do so.`);
      return;
    }

    if (newSrc && (newSrc.toString() !== url.toString() && newSrc.toString() !== urlish))
      url = resolveURL.call(this, rootLocation, newSrc);
  }

  return url;
}

const IS_TEMPLATE         = /^(template)$/i;
const IS_SCRIPT           = /^(script)$/i;
const IS_HEAD_TAG         = /^(style|link|meta)$/i;
const SHOULD_IGNORE       = /^(base|noscript|title)$/i;
const REQUIRE_CACHE       = new Map();
const RESOLVE_SRC_ELEMENT = /^script|link|style|mythix-language-pack|mythix-require$/i;

function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
  let options   = _options || {};
  let url       = resolveURL.call(this, location, _url, options.magic);
  let fileName;
  let baseURL   = new URL(`${url.origin}${url.pathname.replace(/[^/]+$/, (m) => {
    fileName = m;
    return '';
  })}${url.search}${url.hash}`);

  let template = ownerDocument.createElement('template');
  template.innerHTML = sourceString;

  let children = Array.from(template.content.children).sort((a, b) => {
    let x = a.tagName;
    let y = b.tagName;

    // eslint-disable-next-line eqeqeq
    if (x == y)
      return 0;

    return (x < y) ? 1 : -1;
  });

  const fileNameToElementName = (fileName) => {
    return fileName.trim().replace(/\..*$/, '').replace(/\b[A-Z]|[^A-Z][A-Z]/g, (_m) => {
      let m = _m.toLowerCase();
      return (m.length < 2) ? `-${m}` : `${m.charAt(0)}-${m.charAt(1)}`;
    }).replace(/-{2,}/g, '-').replace(/^[^a-z]*/, '').replace(/[^a-z]*$/, '');
  };

  let guessedElementName  = fileNameToElementName(fileName);
  let context             = {
    guessedElementName,
    children,
    ownerDocument,
    template,
    url,
    baseURL,
    fileName,
  };

  if (typeof options.preProcess === 'function') {
    template = context.template = options.preProcess.call(this, context);
    children = Array.from(template.content.children);
  }

  let nodeHandler   = options.nodeHandler;
  let templateCount = children.reduce((sum, element) => ((IS_TEMPLATE.test(element.tagName)) ? (sum + 1) : sum), 0);

  context.templateCount = templateCount;

  const resolveElementSrcAttribute = (element, baseURL) => {
    // Resolve "src" attribute, since we are
    // going to be moving the element around
    let src = element.getAttribute('src');
    if (src) {
      src = resolveURL.call(this, baseURL, src, false);
      element.setAttribute('src', src.toString());
    }

    return element;
  };

  for (let child of children) {
    if (options.magic && RESOLVE_SRC_ELEMENT.test(child.localName))
      child = resolveElementSrcAttribute(child, baseURL);

    if (SHOULD_IGNORE.test(child.tagName)) {
      continue;
    } else if (IS_TEMPLATE.test(child.tagName)) { // <template>
      if (templateCount === 1 && child.getAttribute('data-for') == null && child.getAttribute('data-mythix-component-name') == null) {
        console.warn(`${url}: <template> is missing a "data-for" attribute, linking it to its owner component. Guessing "${guessedElementName}".`);
        child.setAttribute('data-for', guessedElementName);
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isTemplate: true, isHandled: true }) === false)
        continue;

      // append to body
      let elementName = (child.getAttribute('data-for') || child.getAttribute('data-mythix-component-name'));
      if (!ownerDocument.body.querySelector(`[data-for="${elementName}" i],[data-mythix-component-name="${elementName}" i]`))
        ownerDocument.body.appendChild(child);
    } else if (IS_SCRIPT.test(child.tagName)) { // <script>
      let childClone = ownerDocument.createElement(child.tagName);
      for (let attributeName of child.getAttributeNames()) {
        if (attributeName === 'src')
          continue;

        childClone.setAttribute(attributeName, child.getAttribute(attributeName));
      }

      let src = child.getAttribute('src');
      if (src) {
        src = resolveURL.call(this, baseURL, src, false);
        childClone.setAttribute('src', src.toString());
      } else {
        childClone.setAttribute('type', 'module');
        childClone.innerHTML = child.textContent;
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, childClone, { ...context, isScript: true, isHandled: true }) === false)
        continue;

      let scriptID = childClone.getAttribute('id');
      if (!scriptID) {
        scriptID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(`${guessedElementName}:${src || childClone.innerHTML}`)}`;
        childClone.setAttribute('id', scriptID);
      }

      // append to head
      if (!ownerDocument.querySelector(scriptID))
        ownerDocument.head.appendChild(childClone);
    } else if (IS_HEAD_TAG.test(child.tagName)) { // <link> & <style>
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      let styleID = child.getAttribute('id');
      if (!styleID) {
        styleID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(child.outerHTML)}`;
        child.setAttribute('id', styleID);
      }

      // append to head
      if (!ownerDocument.querySelector(`${child.tagName}#${styleID}`))
        ownerDocument.head.appendChild(child);
    } else if ((/^meta$/i).test(child.tagName)) { // <meta>
      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isMeta: true, isHandled: true });

      // do nothing with these tags
      continue;
    } else { // Everything else
      let isHandled = false;

      if (child.localName === 'mythix-language-pack') {
        let langPackID = child.getAttribute('id');
        if (!langPackID) {
          langPackID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(`${guessedElementName}:${child.outerHTML}`)}`;
          child.setAttribute('id', langPackID);
        }

        let languageProvider = this.closest('mythix-language-provider');
        if (!languageProvider)
          languageProvider = document.querySelector('mythix-language-provider');

        if (languageProvider) {
          if (!languageProvider.querySelector(`mythix-language-pack#${langPackID}`))
            languageProvider.insertBefore(child, languageProvider.firstChild);

          isHandled = true;
        } // else do nothing... let it be dumped into the dom later
      }

      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isHandled });
    }
  }

  if (typeof options.postProcess === 'function') {
    template = context.template = options.postProcess.call(this, context);
    children = Array.from(template.content.children);
  }

  return context;
}

async function require(urlOrName, _options) {
  let options       = _options || {};
  let ownerDocument = options.ownerDocument || document;
  let url           = resolveURL.call(this, ownerDocument.location, urlOrName, options.magic);
  let cacheKey;

  if (!(/^(false|no-store|reload|no-cache)$/).test(url.searchParams.get('cache'))) {
    if (url.searchParams.get('cacheParams') !== 'true') {
      let cacheKeyURL = new URL(`${url.origin}${url.pathname}`);
      cacheKey = cacheKeyURL.toString();
    } else {
      cacheKey = url.toString();
    }

    let cachedResponse = REQUIRE_CACHE.get(cacheKey);
    if (cachedResponse) {
      cachedResponse = await cachedResponse;
      if (cachedResponse.response && cachedResponse.response.ok)
        return { url, response: cachedResponse.response, ownerDocument, cached: true };
    }
  }

  let promise = globalThis.fetch(url, options.fetchOptions).then(
    async (response) => {
      if (!response.ok) {
        if (cacheKey)
          REQUIRE_CACHE.delete(cacheKey);

        let error = new Error(`${response.status} ${response.statusText}`);
        error.url = url;
        throw error;
      }

      let body = await response.text();
      response.text = async () => body;
      response.json = async () => JSON.parse(body);

      return { url, response, ownerDocument, cached: false };
    },
    (error) => {
      console.error('Error from Mythix UI "require": ', error);

      if (cacheKey)
        REQUIRE_CACHE.delete(cacheKey);

      error.url = url;
      throw error;
    },
  );

  REQUIRE_CACHE.set(cacheKey, promise);

  return await promise;
}

async function loadPartialIntoElement(src, _options) {
  let options = _options || {};

  let {
    ownerDocument,
    url,
    response,
  } = await require.call(
    this,
    src,
    {
      ownerDocument: this.ownerDocument || document,
    },
  );

  let body = await response.text();
  while (this.childNodes.length)
    this.removeChild(this.childNodes[0]);

  let scopeData = Object.create(null);
  for (let [ key, value ] of url.searchParams.entries())
    scopeData[key] = _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.coerce(value);

  importIntoDocumentFromSource.call(
    this,
    ownerDocument,
    ownerDocument.location,
    url,
    body,
    {
      nodeHandler: (node, { isHandled, isTemplate }) => {
        if ((isTemplate || !isHandled) && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE)) {
          this.appendChild(
            _elements_js__WEBPACK_IMPORTED_MODULE_3__.processElements.call(
              this,
              node,
              {
                ...options,
                scope: _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(scopeData, options.scope),
              },
            ),
          );
        }
      },
    },
  );
}

function visibilityObserver(callback, _options) {
  const intersectionCallback = (entries) => {
    for (let i = 0, il = entries.length; i < il; i++) {
      let entry   = entries[i];
      let element = entry.target;
      if (!entry.isIntersecting)
        continue;

      let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(element, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_INTERSECTION_OBSERVERS);
      if (!elementObservers) {
        elementObservers = new Map();
        _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(element, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_INTERSECTION_OBSERVERS, elementObservers);
      }

      let data = elementObservers.get(observer);
      if (!data) {
        data = { wasVisible: false, ratioVisible: entry.intersectionRatio };
        elementObservers.set(observer, data);
      }

      if (entry.intersectionRatio > data.ratioVisible)
        data.ratioVisible = entry.intersectionRatio;

      data.previousVisibility = (data.visibility === undefined) ? data.visibility : data.visibility;
      data.visibility = (entry.intersectionRatio > 0.0);

      callback({ ...data, entry, element, index: i, disconnect: () => observer.unobserve(element) });

      if (data.visibility && !data.wasVisible)
        data.wasVisible = true;
    }
  };

  let options = {
    root:       null,
    threshold:  0.0,
    ...(_options || {}),
  };

  let observer  = new IntersectionObserver(intersectionCallback, options);
  let elements  = (_options || {}).elements || [];

  for (let i = 0, il = elements.length; i < il; i++)
    observer.observe(elements[i]);

  return observer;
}

const NO_OBSERVER = Object.freeze({
  wasVisible:         false,
  ratioVisible:       0.0,
  visibility:         false,
  previousVisibility: false,
});

function getVisibilityMeta(element, observer) {
  let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(element, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_INTERSECTION_OBSERVERS);
  if (!elementObservers)
    return NO_OBSERVER;

  return elementObservers.get(observer) || NO_OBSERVER;
}

function getLargestDocumentTabIndex(ownerDocument) {
  let largest = -Infinity;

  Array.from((ownerDocument || document).querySelectorAll('[tabindex]')).forEach((element) => {
    let tabIndex = parseInt(element.getAttribute('tabindex'), 10);
    if (!isFinite(tabIndex))
      return;

    if (tabIndex > largest)
      largest = tabIndex;
  });

  return (largest < 0) ? 0 : largest;
}

function insertScriptIntoHead(_url, _options) {
  let options       = _options || {};
  let attributes    = options.attributes || {};
  let ownerDocument = options.ownerDocument || document;
  let scriptElement = ownerDocument.createElement('script');
  let url           = resolveURL.call(this, ownerDocument.location, _url, { magic: true });

  for (let [ attributeName, attributeValue ] of Object.entries(attributes)) {
    if (attributeName === 'src')
      attributeValue = resolveURL.call(this, ownerDocument.location, attributeValue, { magic: true });

    scriptElement.setAttribute(attributeName, attributeValue);
  }

  let scriptID = scriptElement.getAttribute('id');
  if (!scriptID) {
    scriptID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(url)}`;
    scriptElement.setAttribute('id', scriptID);
  }

  scriptElement.setAttribute('src', url);

  if (!Object.prototype.hasOwnProperty.call(attributes, 'type'))
    scriptElement.setAttribute('type', 'module');

  // append to head
  if (!ownerDocument.querySelector(scriptID))
    ownerDocument.head.appendChild(scriptElement);

  return scriptElement;
}

/***/ }),

/***/ "./lib/constants.js":
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DYNAMIC_PROPERTY_IS_SETTING: () => (/* binding */ DYNAMIC_PROPERTY_IS_SETTING),
/* harmony export */   DYNAMIC_PROPERTY_SET: () => (/* binding */ DYNAMIC_PROPERTY_SET),
/* harmony export */   DYNAMIC_PROPERTY_TYPE: () => (/* binding */ DYNAMIC_PROPERTY_TYPE),
/* harmony export */   DYNAMIC_PROPERTY_VALUE: () => (/* binding */ DYNAMIC_PROPERTY_VALUE),
/* harmony export */   ELEMENT_DEFINITION_TYPE: () => (/* binding */ ELEMENT_DEFINITION_TYPE),
/* harmony export */   MYTHIX_DOCUMENT_INITIALIZED: () => (/* binding */ MYTHIX_DOCUMENT_INITIALIZED),
/* harmony export */   MYTHIX_INTERSECTION_OBSERVERS: () => (/* binding */ MYTHIX_INTERSECTION_OBSERVERS),
/* harmony export */   MYTHIX_NAME_VALUE_PAIR_HELPER: () => (/* binding */ MYTHIX_NAME_VALUE_PAIR_HELPER),
/* harmony export */   MYTHIX_SHADOW_PARENT: () => (/* binding */ MYTHIX_SHADOW_PARENT),
/* harmony export */   MYTHIX_TYPE: () => (/* binding */ MYTHIX_TYPE),
/* harmony export */   MYTHIX_UI_COMPONENT_TYPE: () => (/* binding */ MYTHIX_UI_COMPONENT_TYPE),
/* harmony export */   QUERY_ENGINE_TYPE: () => (/* binding */ QUERY_ENGINE_TYPE),
/* harmony export */   UNFINISHED_DEFINITION: () => (/* binding */ UNFINISHED_DEFINITION)
/* harmony export */ });
/**
 * type: Namespace
 * name: Constants
 * groupName: Constants
 * desc: |
 *   `import { Constants } from 'mythix-ui-core@1.0';`
 *
 *   Misc global constants are found within this namespace.
 * properties:
 *   - name: MYTHIX_INTERSECTION_OBSERVERS
 *     dataType: symbol
 *     desc: |
 *       This symbol is used as a @see Utils.metadata; key against elements with a `data-src` attribute.
 *       For elements with this attribute, set an [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is setup.
 *       When the intersection observer reports that the element is visible, then the URL specified by `data-src` is fetched, and dumped into
 *       the element as its children. This allows for dynamic "partials" that are loaded at run-time.
 *
 *       The value stored at this @see Utils.metadata; key is a Map of [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
 *       instances. The keys of this map are the intersection observers themselves. The values are raw objects with the shape
 *       `{ wasVisible: boolean, ratioVisible: float, previousVisibility: boolean, visibility: boolean }`.
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
 *         :eye: @see BaseUtils.isType;.
 *   - name: DYNAMIC_PROPERTY_TYPE
 *     dataType: symbol
 *     desc: |
 *       Used for runtime type reflection against @see Utils.DynamicProperty;.
 *     notes:
 *       - |
 *         :eye: @see DynamicProperty;.
 *       - |
 *         :eye: @see BaseUtils.isType;.
 *       - |
 *         :eye: @see Constants.MYTHIX_TYPE;.
 */

// Base
const MYTHIX_NAME_VALUE_PAIR_HELPER  = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper'); // @ref:Constants.MYTHIX_NAME_VALUE_PAIR_HELPER
const MYTHIX_SHADOW_PARENT           = Symbol.for('@mythix/mythix-ui/constants/shadow-parent'); // @ref:Constants.MYTHIX_SHADOW_PARENT
const MYTHIX_TYPE                    = Symbol.for('@mythix/mythix-ui/constants/element-definition'); // @ref:Constants.MYTHIX_TYPE
const MYTHIX_INTERSECTION_OBSERVERS  = Symbol.for('@mythix/mythix-ui/component/constants/intersection-observers'); // @ref:Constants.MYTHIX_INTERSECTION_OBSERVERS
const MYTHIX_DOCUMENT_INITIALIZED    = Symbol.for('@mythix/mythix-ui/component/constants/document-initialized'); // @ref:Constants.MYTHIX_DOCUMENT_INITIALIZED

// DynamicProperty
const DYNAMIC_PROPERTY_VALUE         = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/value');
const DYNAMIC_PROPERTY_IS_SETTING    = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');
const DYNAMIC_PROPERTY_SET           = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/set');

// Types
const ELEMENT_DEFINITION_TYPE        = Symbol.for('@mythix/mythix-ui/types/MythixUI::ElementDefinition');
const QUERY_ENGINE_TYPE              = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');
const DYNAMIC_PROPERTY_TYPE          = Symbol.for('@mythix/mythix-ui/types/MythixUI::DynamicProperty'); // @ref:Constants.DYNAMIC_PROPERTY_TYPE
const MYTHIX_UI_COMPONENT_TYPE       = Symbol.for('@mythix/mythix-ui/types/MythixUI::MythixUIComponent');

// Elements
const UNFINISHED_DEFINITION    = Symbol.for('@mythix/mythix-ui/constants/unfinished');




/***/ }),

/***/ "./lib/dynamic-property.js":
/*!*********************************!*\
  !*** ./lib/dynamic-property.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynamicProperty: () => (/* binding */ DynamicProperty)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");




globalThis.mythixUI = (globalThis.mythixUI || {});

/**
 * groupName: DynamicProperty
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
class DynamicProperty extends EventTarget {
  static [Symbol.hasInstance](instance) { // @ref:_mythixTypeExample
    try {
      return (instance && instance[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_TYPE);
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
  static set = _constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_SET; // @ref:DynamicProperty.set

  /**
   * type: Function
   * name: constructor
   * groupName: DynamicProperty
   * parent: Utils
   * desc: |
   *   Construct a `DynamicProperty`.
   * arguments:
   *   - name: initialValue
   *     dataType: any
   *     desc:
   *       The initial value to store.
   * notes:
   *   - |
   *     :info: This will return a Proxy instance wrapping the `DynamicProperty` instance.
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If `initialValue` is a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  constructor(initialValue) {
    super();

    Object.defineProperties(this, {
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        _constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_TYPE,
      },
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(initialValue, DynamicProperty)) ? initialValue.valueOf() : initialValue,
      },
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_IS_SETTING]: {
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

        let value = target[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE][propName];
        return (value === 'function') ? value.bind(target[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE]) : value;
      },
      set:  (target, propName, value) => {
        if (propName in target)
          target[propName] = value;
        else
          target[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE][propName] = value;

        return true;
      },
    });

    return proxy;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number')
      return +this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE];
    else if (hint === 'string')
      return this.toString();

    return this.valueOf();
  }

  toString() {
    let value = this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE];
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  /**
   * type: Function
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Fetch the underlying raw value stored by this `DynamicProperty`.
   * return: |
   *   @types: any; The underling raw value.
   */
  valueOf() {
    return this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE];
  }

  /**
   * type: Function
   * name: "[DynamicProperty.set]"
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Set the underlying raw value stored by this `DynamicProperty`.
   *
   *   If the current stored value is exactly the same as the provided `value`,
   *   then this method will simply return.
   *
   *   Otherwise, when the underlying value is updated, `this.dispatchEvent` will
   *   be called to dispatch an `'update'` event to notify all listeners that the
   *   underlying value has been changed.
   * arguments:
   *   - name: newValue
   *     dataType: any
   *     desc: |
   *       The new value to set. If this is itself a `DynamicProperty` instance, then
   *       it will be unwrapped to its underlying value, and that will be used as the value instead.
   *   - name: options
   *     optional: true
   *     dataType: object
   *     desc: |
   *       An object to provided options for the operation. The shape of this object is `{ dispatchUpdateEvent: boolean }`.
   *       If `options.dispatchUpdateEvent` equals `false`, then no `'update'` event will be dispatched to listeners.
   * notes:
   *   - |
   *     :info: If the underlying stored value is exactly the same as the value provided,
   *     then nothing will happen, and the method will simply return.
   *   - |
   *     :info: The underlying value is updated *before* dispatching events.
   *   - |
   *     :info: `DynamicProperty` protects against cyclic event callbacks. If an
   *     event callback again sets the underlying `DynamicProperty` value, then
   *     the value will be set, but no event will be dispatched (to prevent event loops).
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If this method receives a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  [_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_SET](_newValue, _options) {
    let newValue = _newValue;
    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(newValue, DynamicProperty))
      newValue = newValue.valueOf();

    if (this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE] === newValue)
      return;

    if (this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_IS_SETTING]) {
      this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE] = newValue;
      return;
    }

    let options = _options || {};

    try {
      this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_IS_SETTING] = true;

      let oldValue = this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE];
      this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_VALUE] = newValue;

      if (options.dispatchUpdateEvent === false)
        return;

      let updateEvent = new Event('update');

      updateEvent.originator = this;
      updateEvent.oldValue = oldValue;
      updateEvent.value = newValue;

      this.dispatchEvent(updateEvent);
    } catch (error) {
      console.error(error);
    } finally {
      this[_constants_js__WEBPACK_IMPORTED_MODULE_0__.DYNAMIC_PROPERTY_IS_SETTING] = false;
    }
  }
}

globalThis.mythixUI.DynamicProperty = DynamicProperty;


/***/ }),

/***/ "./lib/elements.js":
/*!*************************!*\
  !*** ./lib/elements.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElementDefinition: () => (/* binding */ ElementDefinition),
/* harmony export */   ElementGenerator: () => (/* binding */ ElementGenerator),
/* harmony export */   Term: () => (/* binding */ Term),
/* harmony export */   build: () => (/* binding */ build),
/* harmony export */   encodeAttributeValue: () => (/* binding */ encodeAttributeValue),
/* harmony export */   encodeValue: () => (/* binding */ encodeValue),
/* harmony export */   hasChild: () => (/* binding */ hasChild),
/* harmony export */   isSVGElement: () => (/* binding */ isSVGElement),
/* harmony export */   isVoidTag: () => (/* binding */ isVoidTag),
/* harmony export */   mergeChildren: () => (/* binding */ mergeChildren),
/* harmony export */   nodeToElementDefinition: () => (/* binding */ nodeToElementDefinition),
/* harmony export */   processElements: () => (/* binding */ processElements),
/* harmony export */   queryTemplate: () => (/* binding */ queryTemplate)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");






const SUBSTITUTE_CHAR_CODE = 26;

/**
 * type: Namespace
 * name: Elements
 * groupName: Elements
 * desc: |
 *   `import { Elements } from 'mythix-ui-core@1.0';`
 *
 *   Utility and element building functions for the DOM.
 */

const IS_PROP_NAME    = /^prop\$/;
const IS_TARGET_PROP  = /^prototype|constructor$/;

class ElementDefinition {
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE);
    } catch (e) {
      return false;
    }
  }

  constructor(tagName, attributes, children) {
    Object.defineProperties(this, {
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE,
      },
      'tagName': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        tagName,
      },
      'attributes': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        attributes || {},
      },
      'children': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        children || [],
      },
    });
  }

  toString(_options) {
    let options = _options || {};
    let tagName = this.tagName;
    if (tagName === '#text')
      return this.attributes.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let attrs = (tagName === '#fragment') ? null : ((attributes) => {
      let parts = [];

      for (let [ attributeName, value ] of Object.entries(attributes)) {
        if (IS_PROP_NAME.test(attributeName))
          continue;

        let name = this.toDOMAttributeName(attributeName);
        if (value == null)
          parts.push(name);
        else
          parts.push(`${name}="${encodeAttributeValue(value)}"`);
      }

      return parts.join(' ');
    })(this.attributes);

    let children = ((children) => {
      return children
        .filter((child) => (child != null && child !== false && !Object.is(child, NaN)))
        .map((child) => ((child && typeof child.toString === 'function') ? child.toString(options) : ('' + child)))
        .join('');
    })(this.children);

    if (tagName === '#fragment')
      return children;

    // this will more commonly look like written html
    tagName = tagName.toLowerCase();

    let elementTagStart = `<${tagName}${(attrs) ? ` ${attrs}` : ''}>`;
    let elementTagEnd   = `</${tagName}>`;

    if (Object.prototype.hasOwnProperty.call(options, 'maskHTML')) {
      let charCode = (typeof options.maskHTML === 'number') ? String.fromCharCode(SUBSTITUTE_CHAR_CODE) : options.maskHTML;
      const wipeBlank = (content) => {
        return content.replace(/./g, charCode);
      };

      elementTagStart = wipeBlank(elementTagStart);
      elementTagEnd = wipeBlank(elementTagEnd);

      if (options.maskChildrenPattern && options.maskChildrenPattern.test(tagName))
        children = wipeBlank(children);
    }

    return `${elementTagStart}${(isVoidTag(tagName)) ? '' : `${children}${elementTagEnd}`}`;
  }

  toDOMAttributeName(attributeName) {
    return attributeName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  build(ownerDocument, templateOptions) {
    if (this.tagName === '#fragment')
      return this.children.map((child) => child.build(ownerDocument, templateOptions));

    let attributes    = this.attributes;
    let namespaceURI  = attributes.namespaceURI;
    let options;
    let element;

    if (this.attributes.is)
      options = { is: this.attributes.is };

    if (this.tagName === '#text')
      return processElements.call(this, ownerDocument.createTextNode(attributes.value || ''), templateOptions);

    if (namespaceURI)
      element = ownerDocument.createElementNS(namespaceURI, this.tagName, options);
    else if (isSVGElement(this.tagName))
      element = ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tagName, options);
    else
      element = ownerDocument.createElement(this.tagName);

    const eventNames = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getAllEventNamesForElement(element);
    const handleAttribute = (element, attributeName, _attributeValue) => {
      let attributeValue      = _attributeValue;
      let lowerAttributeName  = attributeName.toLowerCase();

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        _utils_js__WEBPACK_IMPORTED_MODULE_2__.bindEventToElement.call(
          _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(element, templateOptions.scope), // this
          element,
          lowerAttributeName.substring(2),
          attributeValue,
        );
      } else {
        let modifiedAttributeName = this.toDOMAttributeName(attributeName);
        element.setAttribute(modifiedAttributeName, attributeValue);
      }
    };

    // Dynamic bindings are not allowed for properties
    const handleProperty = (element, propertyName, propertyValue) => {
      let name = propertyName.replace(IS_PROP_NAME, '');
      element[name] = propertyValue;
    };

    let attributeNames = Object.keys(attributes);
    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName   = attributeNames[i];
      let attributeValue  = attributes[attributeName];

      if (IS_PROP_NAME.test(attributeName))
        handleProperty(element, attributeName, attributeValue);
      else
        handleAttribute(element, attributeName, attributeValue);
    }

    let children = this.children;
    if (children.length > 0) {
      for (let i = 0, il = children.length; i < il; i++) {
        let child         = children[i];
        let childElement  = child.build(ownerDocument, templateOptions);

        if (Array.isArray(childElement))
          childElement.flat(Infinity).forEach((child) => element.appendChild(child));
        else
          element.appendChild(childElement);
      }
    }

    return processElements.call(
      this,
      element,
      {
        ...templateOptions,
        processEventCallbacks: false,
      },
    );
  }
}

const IS_HTML_SAFE_CHARACTER = /^[\sa-zA-Z0-9_-]$/;
function encodeValue(value) {
  return value.replace(/./g, (m) => {
    return (IS_HTML_SAFE_CHARACTER.test(m)) ? m : `&#${m.charCodeAt(0)};`;
  });
}

function encodeAttributeValue(value) {
  return value.replace(/["&]/g, (m) => {
    return `&#${m.charCodeAt(0)};`;
  });
}

const IS_VOID_TAG = /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr$/i;
function isVoidTag(tagName) {
  return IS_VOID_TAG.test(tagName.split(':').slice(-1)[0]);
}

function isValidNodeType(item) {
  if (!item)
    return false;

  if (item instanceof Node)
    return true;

  if (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE)
    return true;

  if (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE)
    return true;

  return false;
}

function queryTemplate(ownerDocument, nameOrID) {
  if (nameOrID instanceof Node)
    return nameOrID;

  if (!ownerDocument)
    return;

  let result = ownerDocument.getElementById(nameOrID);
  if (!result)
    result = ownerDocument.querySelector(`template[data-mythix-component-name="${nameOrID}" i],template[data-for="${nameOrID}" i]`);

  if (!result)
    result = ownerDocument.querySelector(nameOrID);

  return result;
}

function filterNodeTree(node, filterFunc) {
  if (!filterFunc.call(this, node))
    return;

  let children = Array.from(node.childNodes);
  for (let childNode of children) {
    let result = filterNodeTree(childNode, filterFunc);
    if (result == null)
      node.removeChild(childNode);
  }

  return node;
}

function compileMergeFragment(ownerDocument, node) {
  let fragment  = ownerDocument.createDocumentFragment();
  let selectors = (node.getAttribute('data-from') || '').split(',').map(((part) => part.trim())).filter(Boolean);

  for (let i = 0, il = selectors.length; i < il; i++) {
    let selector  = selectors[i];
    let element   = queryTemplate(ownerDocument, selector);
    if (element) {
      let clonedNode  = (IS_TEMPLATE.test(element.tagName)) ? element.content.cloneNode(true) : element.cloneNode(true);
      let filter      = node.getAttribute('data-filter');
      if (filter) {
        clonedNode = filterNodeTree.call(this, clonedNode, (node) => {
          return !(typeof node.matches === 'function' && node.matches(filter));
        });
      }

      fragment.appendChild(clonedNode);
    }
  }

  return fragment;
}

const IS_TEMPLATE_MERGE_ELEMENT = /^mythix-merge$/i;
function processElements(_node, _options) {
  let node = _node;
  if (!node)
    return node;

  let options       = _options || {};
  let scope         = options.scope;
  if (!scope) {
    scope = _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(node);
    options = { ...options, scope };
  }

  let disableTemplateEngineSelector = (options.forceTemplateEngine === true) ? undefined : options.disableTemplateEngineSelector;
  let children                      = Array.from(node.childNodes);

  if (options.forceTemplateEngine !== true && !disableTemplateEngineSelector) {
    disableTemplateEngineSelector = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getDisableTemplateEngineSelector();
    options = { ...options, disableTemplateEngineSelector };
  }

  let isTemplateEngineDisabled = false;
  if (disableTemplateEngineSelector && _utils_js__WEBPACK_IMPORTED_MODULE_2__.specialClosest(node, disableTemplateEngineSelector))
    isTemplateEngineDisabled = true;

  if (typeof options.helper === 'function') {
    let result = options.helper.call(this, { scope, options, node, children, isTemplateEngineDisabled, disableTemplateEngineSelector });
    if (result instanceof Node)
      node = result;
    else if (result === false)
      return node;
  }

  let ownerDocument = options.ownerDocument || scope.ownerDocument || node.ownerDocument || document;
  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ATTRIBUTE_NODE) {
    if (!isTemplateEngineDisabled) {
      let result = _utils_js__WEBPACK_IMPORTED_MODULE_2__.formatNodeValue(node, options);
      if ((Array.isArray(result) && result.some(isValidNodeType)) || isValidNodeType(result)) {
        if (!Array.isArray(result))
          result = [ result ];

        let fragment = ownerDocument.createDocumentFragment();
        for (let item of result) {
          if (item instanceof Node) {
            fragment.appendChild(item);
          } else if (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE) {
            let elements = item.build(ownerDocument, { scope });
            if (!elements)
              continue;

            if (Array.isArray(elements))
              elements.flat(Infinity).forEach((element) => fragment.appendChild(element));
            else
              fragment.appendChild(elements);
          } else if (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE) {
            item.appendTo(fragment);
          } else {
            let textNode = ownerDocument.createTextNode(('' + item));
            fragment.appendChild(textNode);
          }
        }

        return fragment;
      } else if (result !== node.nodeValue) {
        node.nodeValue =  result;
      }
    }

    return node;
  } else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_NODE) {
    if (IS_TEMPLATE_MERGE_ELEMENT.test(node.tagName)) {
      let fragment = compileMergeFragment.call(this, ownerDocument, node);
      return processElements.call(this, fragment, { ...options, scope });
    }

    let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getAllEventNamesForElement(node);
    let attributeNames  = node.getAttributeNames();

    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName       = attributeNames[i];
      let lowerAttributeName  = attributeName.toLowerCase();
      let attributeValue      = node.getAttribute(attributeName);

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        if (options.processEventCallbacks !== false) {
          _utils_js__WEBPACK_IMPORTED_MODULE_2__.bindEventToElement.call(
            _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(node, scope), // this
            node,
            lowerAttributeName.substring(2),
            attributeValue,
          );

          node.removeAttribute(attributeName);
        }
      } else if (_utils_js__WEBPACK_IMPORTED_MODULE_2__.isTemplate(attributeValue)) {
        let attributeNode = node.getAttributeNode(attributeName);
        if (attributeNode)
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_2__.formatNodeValue(attributeNode, { ...options, disallowHTML: true });
      }
    }
  }

  if (options.processChildren === false)
    return node;

  for (let childNode of children) {
    let result = processElements.call(this, childNode, options);
    if (result instanceof Node && result !== childNode) {
      try {
        node.replaceChild(result, childNode);
      } catch (e) {
        // NOOP
      }
    }
  }

  return node;
}

function hasChild(parentNode, childNode) {
  if (!parentNode || !childNode)
    return false;

  for (let child of Array.from(parentNode.childNodes)) {
    if (child === childNode)
      return true;
  }

  return false;
}

function build(tagName, defaultAttributes, scope) {
  if (!tagName || !_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(tagName, '::String'))
    throw new Error('Can not create an ElementDefinition without a "tagName".');

  const finalizer = (..._children) => {
    const wrangleChildren = (children) => {
      return children.flat(Infinity).map((value) => {
        if (value == null || Object.is(value, NaN))
          return null;

        if (typeof value === 'symbol')
          return null;

        if (value[_constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION])
          return value();

        if (value[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE)
          return value;

        if (value[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE)
          return wrangleChildren(value.getUnderlyingArray());

        if (value instanceof Node)
          return nodeToElementDefinition(value);

        if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(value, '::String', _dynamic_property_js__WEBPACK_IMPORTED_MODULE_3__.DynamicProperty))
          return null;

        return new ElementDefinition('#text', { value: ('' + value) });
      }).flat(Infinity).filter(Boolean);
    };

    let children = wrangleChildren(_children || []);
    return new ElementDefinition(tagName, scope, children);
  };

  let rootProxy = new Proxy(finalizer, {
    get: (target, attributeName) => {
      if (attributeName === _constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION)
        return true;

      if (typeof attributeName === 'symbol' || IS_TARGET_PROP.test(attributeName))
        return target[attributeName];

      if (!scope) {
        let scopedProxy = build(tagName, defaultAttributes, Object.assign(Object.create(null), defaultAttributes || {}));
        return scopedProxy[attributeName];
      }

      return new Proxy(
        (value) => {
          scope[attributeName] = value;
          return rootProxy;
        },
        {
          get: (target, propName) => {
            if (attributeName === _constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION)
              return true;

            if (typeof attributeName === 'symbol' || IS_TARGET_PROP.test(attributeName))
              return target[attributeName];

            scope[attributeName] = true;
            return rootProxy[propName];
          },
        },
      );
    },
  });

  return rootProxy;
}

function nodeToElementDefinition(node) {
  if (node.nodeType === Node.TEXT_NODE)
    return new ElementDefinition('#text', { value: ('' + node.nodeValue) });

  if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)
    return;

  let attributes = {};

  if (typeof node.getAttributeNames === 'function') {
    for (let attributeName of node.getAttributeNames())
      attributes[attributeName] = node.getAttribute(attributeName);
  }

  let children = Array.from(node.childNodes).map(nodeToElementDefinition);
  return new ElementDefinition((node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) ? '#fragment' : node.tagName, attributes, children);
}

const IS_TEMPLATE = /^(template)$/i;

/**
   * parent: Elements
   * groupName: Elements
   * desc: |
   *   Almost like `Object.assign`, merge all component children into a single node (the `target`).
   *
   *   This is "template intelligent", meaning for `<template>` elements specifically, it will execute
   *   `children = template.content.cloneNode(true).childNodes` to clone all the child nodes, and not
   *   modify the original template. It is also template intelligent by the fact that if the `target` is
   *   a template, it will add the children to `content` properly.
   * arguments:
   *   - name: target
   *     dataTypes: Node
   *     desc: |
   *       The target Node to merge all children into. If this Node is a `<template>` Node, then it will
   *       place all the merged children into `template.content`.
   * notes:
   *   - Any template Node will be cloned, and so the original will not be modified. All other nodes are **NOT**
   *     cloned before the merge, and so will be stripped of their children.
   *   - Make certain you deep clone any element first (except templates) if you don't want the provided elements
   *     to be modified.
   * return: |
   *   @types Node; The provided `target`, with all children merged (added) into it.
   */
function mergeChildren(target, ...others) {
  if (!(target instanceof Node))
    return target;

  let targetIsTemplate = IS_TEMPLATE.test(target.tagName);
  for (let other of others) {
    if (!(other instanceof Node))
      continue;

    let childNodes = (IS_TEMPLATE.test(other.tagName)) ? other.content.cloneNode(true).childNodes : other.childNodes;
    for (let child of Array.from(childNodes)) {
      let content = (IS_TEMPLATE.test(child.tagName)) ? child.content.cloneNode(true) : child;
      if (targetIsTemplate)
        target.content.appendChild(content);
      else
        target.appendChild(content);
    }
  }

  return target;
}

const IS_SVG_ELEMENT_NAME = /^(altglyph|altglyphdef|altglyphitem|animate|animateColor|animateMotion|animateTransform|animation|circle|clipPath|colorProfile|cursor|defs|desc|discard|ellipse|feblend|fecolormatrix|fecomponenttransfer|fecomposite|feconvolvematrix|fediffuselighting|fedisplacementmap|fedistantlight|fedropshadow|feflood|fefunca|fefuncb|fefuncg|fefuncr|fegaussianblur|feimage|femerge|femergenode|femorphology|feoffset|fepointlight|fespecularlighting|fespotlight|fetile|feturbulence|filter|font|fontFace|fontFaceFormat|fontFaceName|fontFaceSrc|fontFaceUri|foreignObject|g|glyph|glyphRef|handler|hKern|image|line|lineargradient|listener|marker|mask|metadata|missingGlyph|mPath|path|pattern|polygon|polyline|prefetch|radialgradient|rect|set|solidColor|stop|svg|switch|symbol|tbreak|text|textpath|tref|tspan|unknown|use|view|vKern)$/i;
function isSVGElement(tagName) {
  return IS_SVG_ELEMENT_NAME.test(tagName);
}

const Term = (value) => new ElementDefinition('#text', { value });
const ElementGenerator = new Proxy(
  {
    Term,
    $TEXT: Term,
  },
  {
    get: function(target, propName) {
      if (propName in target)
        return target[propName];

      if (IS_SVG_ELEMENT_NAME.test(propName)) {
        // SVG elements
        return build(propName, { namespaceURI: 'http://www.w3.org/2000/svg' });
      }

      return build(propName);
    },
    set: function() {
      // NOOP
      return true;
    },
  },
);


/***/ }),

/***/ "./lib/mythix-ui-component.js":
/*!************************************!*\
  !*** ./lib/mythix-ui-component.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   isMythixComponent: () => (/* binding */ isMythixComponent)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _component_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component-utils.js */ "./lib/component-utils.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");








const isMythixComponent = Symbol.for('@mythix/mythix-ui/component/constants/is-mythix-component'); // @ref:MythixUIComponent.isMythixComponent

const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

/***
 * groupName: MythixUIComponent
 * desc: |
 *   This the base class of all Mythix UI components. It inherits
 *   from HTMLElement, and so will end up being a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components).
 *
 *   It is strongly recommended that you fully read up and understand
 *   [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)
 *   if you don't already fully understand them. The core of Mythix UI is the
 *   [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) standard,
 *   so you might end up a little confused if you don't already understand the foundation.
 *
 * properties:
 *   - caption: "... HTMLElement Instance Properties"
 *     desc: "All [HTMLElement Instance Properties](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties) are inherited from [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)"
 *     link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties
 *
 *   - name: isMythixComponent
 *     dataType: boolean
 *     caption: "[static MythixUIComponent.isMythixComponent]"
 *     desc: |
 *       Is `true` for Mythix UI components.
 *   - name: sensitiveTagName
 *     dataType: string
 *     caption: sensitiveTagName
 *     desc: |
 *       Works identically to [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) for XML, where case is preserved.
 *       In HTML this works like [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName), but instead of the result
 *       always being UPPERCASE, the tag name will be returned with the casing preserved.
 *   - name: templateID
 *     dataType: string
 *     caption: templateID
 *     desc: |
 *       This is a convenience property that returns the value of `this.constructor.TEMPLATE_ID`
 *   - name: delayTimers
 *     dataType: "Map&lt;string, Promise&gt;"
 *     caption: delayTimers
 *     desc: |
 *       A Map instance that
 *       retains `setTimeout` ids so that @see MythixUIComponent.debounce; can properly function. Keys are @see MythixUIComponent.debounce;
 *       timer ids (of type `string`). Values are Promise instances.
 *       Each promise instance also has a special key `timerID` that contains a `setTimeout` id of a javascript timer.
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *       - |
 *         :eye: @see MythixUIComponent.debounce;
 *   - name: shadow
 *     dataType: "[ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)"
 *     caption: shadow
 *     desc: |
 *       The shadow root of this component (or `null` if none).
 *     notes:
 *       - This is the cached result of calling @see MythixUIComponent.createShadowDOM; when
 *         the component is first initialized.
 *   - name: template
 *     dataType: "[template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)"
 *     caption: template
 *     desc: |
 *       The [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element for this
 *       component, or `null` if there is no template found for the component.
 *     notes:
 *       - This is the cached result of calling @see MythixUIComponent.getComponentTemplate; when
 *         the component is first initialized.
***/

class MythixUIComponent extends HTMLElement {
  static isMythixComponent = isMythixComponent;

  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_UI_COMPONENT_TYPE);
    } catch (e) {
      return false;
    }
  }

  // static compileStyleForDocument = compileStyleForDocument;
  static register = function(_name, _Klass) {
    let name = _name || this.tagName || _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.toKebabCase(this.name);

    if (!customElements.get(name)) {
      let Klass = _Klass || this;

      let observedAttributes = Array.from(
        new Set(
          (Klass.observedAttributes || []).concat(Klass.compileAttributeMethods(Klass)),
        ),
      );

      if (observedAttributes.length > 0)
        Klass.observedAttributes = observedAttributes;

      customElements.define(name, Klass);

      let registerEvent = new Event('mythix-component-registered');
      registerEvent.componentName = name;
      registerEvent.component = Klass;

      if (typeof document !== 'undefined')
        document.dispatchEvent(registerEvent);
    }

    return this;
  };

  static compileAttributeMethods = function(Klass) {
    const setupAttributeHandlers = ({ propertyName, attributeName, originalName }) => {
      if (REGISTERED_COMPONENTS.has(Klass))
        return;

      let { descriptor } = _utils_js__WEBPACK_IMPORTED_MODULE_3__.getDescriptorFromPrototypeChain(proto, originalName);
      if (!descriptor)
        return;

      // We don't want to remove this from
      // the prototype, as child classes will
      // want to inherit attribute behavior.
      // delete prototype[originalName];

      // If we have a "value" then the user did it wrong...
      // so just make it the "setter"
      let setter    = descriptor.set || descriptor.value;
      let getter    = descriptor.get;
      let hasSetter = (typeof setter === 'function');
      let hasGetter = (typeof getter === 'function');

      Object.defineProperties(proto, {
        [propertyName]: {
          enumerable:   false,
          configurable: true,
          get:          function() {
            return (hasGetter) ? getter.call(this) : this.attr(attributeName);
          },
          set:          function(newValue) {
            let oldValue = this.attr(attributeName);

            this.attr(attributeName, newValue);

            if (hasSetter)
              setter.call(this, [ newValue, oldValue ]);
          },
        },
      });
    };

    let proto           = Klass.prototype;
    let attributeNames  = _utils_js__WEBPACK_IMPORTED_MODULE_3__.getAllPropertyNames(proto)
      .filter((name) => IS_ATTR_METHOD_NAME.test(name))
      .map((originalName) => {
        let propertyName  = originalName.match(IS_ATTR_METHOD_NAME)[1];
        let attributeName = _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.toKebabCase(propertyName);

        setupAttributeHandlers({ propertyName, attributeName, originalName });

        return attributeName;
      });

    REGISTERED_COMPONENTS.add(Klass);

    return Array.from(new Set(attributeNames));
  };

  set attr$dataMythixSrc([ newValue, oldValue ]) {
    this.awaitFetchSrcOnVisible(newValue, oldValue);
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Called when the component is added to the DOM.
   * arguments:
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationAdded() {}

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Called when the component is removed from the DOM.
   * arguments:
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationRemoved() {}

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Called when an element is added as a child.
   * arguments:
   *   - name: node
   *     dataTypes: Element
   *     desc: |
   *       The child element being added.
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationChildAdded() {}

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Called when a child element is removed.
   * arguments:
   *   - name: node
   *     dataTypes: Element
   *     desc: |
   *       The child element being removed.
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationChildRemoved() {}

  constructor() {
    super();

    Object.defineProperties(this, {
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_UI_COMPONENT_TYPE,
      },
      [isMythixComponent]: { // @ref:MythixUIComponent.isMythixComponent
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        isMythixComponent,
      },
    });

    _utils_js__WEBPACK_IMPORTED_MODULE_3__.bindMethods.call(this, this.constructor.prototype /*, [ HTMLElement.prototype ]*/);

    Object.defineProperties(this, {
      'sensitiveTagName': { // @ref:MythixUIComponent.sensitiveTagName
        enumerable:   false,
        configurable: true,
        get:          () => ((this.prefix) ? `${this.prefix}:${this.localName}` : this.localName),
      },
      'templateID': { // @ref:MythixUIComponent.templateID
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.TEMPLATE_ID,
      },
      'delayTimers': { // @ref:MythixUIComponent.delayTimers
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        new Map(),
      },
      'documentInitialized': { // @ref:MythixUIComponent.documentInitialized
        enumerable:   false,
        configurable: true,
        get:          () => _utils_js__WEBPACK_IMPORTED_MODULE_3__.metadata(this.constructor, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_DOCUMENT_INITIALIZED),
        set:          (value) => {
          _utils_js__WEBPACK_IMPORTED_MODULE_3__.metadata(this.constructor, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_DOCUMENT_INITIALIZED, !!value);
        },
      },
    });

    Object.defineProperties(this, {
      'shadow': { // @ref:MythixUIComponent.shadow
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        this.createShadowDOM(),
      },
      'template': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        this.getComponentTemplate(),
      },
    });
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   A convenience method for getting and setting attributes. If only one argument is provided
   *   to this method, then it will act as a getter, getting the attribute specified by name.
   *
   *   If however two or more arguments are provided, then this is an attribute setter.
   *
   *   If the provided value is `undefined`, `null`, or `false`, then the attribute will be
   *   removed.
   *
   *   If the provided value is `true`, then the attribute's value will be set to an empty string `''`.
   *
   *   Any other value is converted to a string and set as the attribute's value.
   * arguments:
   *   - name: name
   *     dataTypes: string
   *     desc: |
   *       The name of the attribute to operate on.
   *   - name: value
   *     dataTypes: any
   *     desc: |
   *       If `undefined`, `null`, or `false`, remove the named attribute.
   *       If `true`, set the named attribute's value to an empty string `''`.
   *       For any other value, first convert it into a string, and then set the named attribute's value to the resulting string.
   * return: |
   *   1. @types string; If a single argument is provided, then return the value of the specified named attribute.
   *   2. @types this; If more than one argument is provided, then set the specified attribute to the specified value,
   *      and return `this` (to allow for chaining).
   */
  attr(name, value) {
    if (arguments.length > 1) {
      if (value == null || value === false)
        this.removeAttribute(name);
      else
        this.setAttribute(name, (value === true) ? '' : ('' + value));

      return this;
    }

    return this.getAttribute(name);
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Inject a new style sheet via a `<style>` element dynamically at run-time.
   *
   *   This method allows the caller to inject dynamic styles at run-time.
   *   It will only inject the styles once, no matter how many times the
   *   method is called--as long as the style content itself doesn't change.
   *
   *   The content is hashed via SHA256, and the hash is used as the style sheet id. This
   *   allows you to call the method inside a component's @see MythixUIComponent.mounted;
   *   method, without needing to worry about duplicating the styles over and over again.
   * arguments:
   *   - name: content
   *     dataTypes: string
   *     desc: |
   *       The CSS stylesheet content to inject into a `<style>` element. This content is
   *       used to generate an `id` for the `<style>` element, so that it only gets added
   *       to the `document` once.
   *   - name: media
   *     dataTypes: string
   *     default: "'screen'"
   *     optional: true
   *     desc: |
   *       What to set the `media` attribute of the created `<style>` element to. Defaults
   *       to `'screen'`.
   * notes:
   *   - |
   *     :warning: It is often better to simply add a `<style>` element to your component's HTML template.
   *     However, sometimes truly dynamic styles are needed, where the content won't be known
   *     until runtime. This is the proper use case for this method.
   *   - |
   *     :warning: Please educated yourself (unlike people who love React) and do not overuse dynamic or inline styles.
   *     While the result of this method is certainly a step above inline styles, this method has
   *     [great potential to cause harm](https://worldofdev.info/6-reasons-why-you-shouldnt-style-inline/)
   *     and spread your own ignorance to others. Use with **CARE**!
   * return: |
   *   @types Element; The `<style>` element for the specified style.
   * examples:
   *   - |
   *     ```javascript
   *     import { MythixUIComponent } from 'mythix-ui-core@1.0';
   *
   *     class MyComponent extends MythixUIComponent {
   *       static tagName = 'my-component';
   *
   *       // ...
   *
   *       mounted() {
   *         let { sidebarWidth } = this.loadUserPreferences();
   *         this.injectStyleSheet(`nav.sidebar { width: ${sidebarWidth}px; }`, 'screen');
   *       }
   *     }
   *
   *     MyComponent.register();
   *     ```
   */
  injectStyleSheet(content, media = 'screen') {
    let styleID       = `IDSTYLE${_base_utils_js__WEBPACK_IMPORTED_MODULE_2__.SHA256(`${this.sensitiveTagName}:${content}:${media}`)}`;
    let ownerDocument = this.ownerDocument || document;
    let styleElement  = ownerDocument.querySelector(`style#${styleID}`);

    if (styleElement)
      return styleElement;

    styleElement = ownerDocument.createElement('style');
    styleElement.setAttribute('data-mythix-for', this.sensitiveTagName);
    styleElement.setAttribute('id', styleID);
    if (media)
      styleElement.setAttribute('media', media);

    styleElement.innerHTML = content;

    document.head.appendChild(styleElement);

    return styleElement;
  }

  processElements(node, _options) {
    let options = _options || {};
    if (!options.scope)
      options = { ...options, scope: this.$$ };

    return _elements_js__WEBPACK_IMPORTED_MODULE_5__.processElements(node, options);
  }

  getChildrenAsFragment(noEmptyResult) {
    let hasContent    = false;
    let ownerDocument = this.ownerDocument || document;
    let template      = ownerDocument.createDocumentFragment();

    if (!this.childNodes.length)
      return (noEmptyResult) ? undefined : template;

    while (this.childNodes.length) {
      let node = this.childNodes[0];
      if (!(node.nodeType === Node.TEXT_NODE && _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNOE(node.nodeValue)))
        hasContent = true;

      template.appendChild(node);
    }

    if (noEmptyResult && !hasContent)
      return;

    return template;
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   Get the parent Node of this element.
   *
   * notes:
   *   - |
   *     :warning: Unlike [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode), this
   *     will also search across Shadow DOM boundaries.
   *   - |
   *     :warning: **Searching across Shadow DOM boundaries only works for Mythix UI components!**
   *   - |
   *     :info: Searching across Shadow DOM boundaries is accomplished via leveraging @see MythixUIComponent.metadata; for
   *     `this` component. When a `null` parent is encountered, `getParentNode` will look for @see MythixUIComponent.metadata?caption=metadata; key @see Constants.MYTHIX_SHADOW_PARENT;
   *     on `this`. If found, the result is considered the [parent Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) of `this` component.
   *   - |
   *     :eye: This is just a wrapper for @see Utils.getParentNode;.
   *
   * return: |
   *   @types Node; The parent node, if there is any, or `null` otherwise.
   */
  getParentNode() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_3__.getParentNode(this);
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   This is a replacement for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   *   with one notable difference: It runs Mythix UI framework specific code after a shadow is attached.
   *
   *   Currently, the method completes the following actions:
   *   1. Call `super.attachShadow(options)` to actually attach a Shadow DOM
   *   2. Assign @see MythixUIComponent.metadata?caption=metadata; to the resulting `shadow`, using the key `Constants.MYTHIX_SHADOW_PARENT`, and value of `this`. @sourceRef _shadowMetadataAssignment; This allows @see getParentNode; to later find the parent of the shadow.
   *   3. `return shadow`
   * arguments:
   *   - name: options
   *     dataTypes: object
   *     desc: |
   *       [options](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options) for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   * notes:
   *   - This is just a wrapper for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) that executes
   *     custom framework functionality after the `super` call.
   * return: |
   *   @types ShadowRoot; The ShadowRoot instance created by [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).
   */
  attachShadow(options) {
    // Check environment support
    if (typeof super.attachShadow !== 'function')
      return;

    let shadow = super.attachShadow(options);
    _utils_js__WEBPACK_IMPORTED_MODULE_3__.metadata(shadow, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT, this); // @ref:_shadowMetadataAssignment

    return shadow;
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   A stub for developers to control the Shadow DOM of the component.
   *
   *   By default, this method will simply call @see MythixUIComponent.attachShadow; in `"open"` `mode`.
   *
   *   Developers can overload this to do nothing (have no Shadow DOM for a specific component for example),
   *   or to do something else, such as specify they would like their component to be in `"closed"` `mode`.
   *
   *   The result of this method is assigned to `this.shadow` inside the `constructor` of the component.
   * arguments:
   *   - name: options
   *     dataTypes: object
   *     desc: |
   *       [options](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options) for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   * notes:
   *   - All this does is call `this.attachShadow`. Its purpose is for the developer to control
   *     what happens with the component's Shadow DOM.
   * return: |
   *   @types ShadowRoot; The ShadowRoot instance created by @see MythixUIComponent.attachShadow;.
   */
  createShadowDOM(options) {
    if (this.constructor.shadow === false)
      return null;

    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  mergeChildren(target, ...others) {
    return _elements_js__WEBPACK_IMPORTED_MODULE_5__.mergeChildren(target, ...others);
  }

  getComponentTemplate(nameOrID) {
    if (nameOrID instanceof Node)
      return nameOrID;

    if (!this.ownerDocument)
      return;

    if (nameOrID)
      return _elements_js__WEBPACK_IMPORTED_MODULE_5__.queryTemplate(this.ownerDocument || document, nameOrID);

    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  appendExternalToShadowDOM() {
    if (!this.shadow)
      return;

    let ownerDocument = (this.ownerDocument || document);
    let elements      = ownerDocument.head.querySelectorAll('[data-auto-merge]');

    for (let element of Array.from(elements)) {
      let selector = element.getAttribute('data-auto-merge');
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_2__.isNOE(selector))
        continue;

      if (!this.matches(selector))
        continue;

      this.shadow.appendChild(element.cloneNode(true));
    }
  }

  getProcessedTemplate(_template) {
    let template = this.getComponentTemplate(_template) || this.template;
    if (!template)
      return;

    return this.processElements((template.content) ? template.content.cloneNode(true) : template.cloneNode(true));
  }

  getRawTemplate(_template) {
    let template = this.getComponentTemplate(_template) || this.template;
    if (!template)
      return;

    return template;
  }

  appendTemplateTo(target, _template) {
    if (!target)
      return false;

    let processedTemplate = this.getProcessedTemplate(_template);
    if (processedTemplate) {
      // ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      target.appendChild(processedTemplate);
      return true;
    }

    return false;
  }

  appendTemplateToShadowDOM(_template) {
    return this.appendTemplateTo(this.shadow, _template);
  }

  connectedCallback() {
    this.setAttribute('data-mythix-component-name', this.sensitiveTagName);

    this.appendExternalToShadowDOM();
    this.appendTemplateToShadowDOM();

    this.processElements(this);

    this.mounted();

    this.documentInitialized = true;

    _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.nextTick(() => {
      this.classList.add('mythix-ready');
    });
  }

  disconnectedCallback() {
    this.unmounted();
  }

  awaitFetchSrcOnVisible(newSrc) {
    if (this.visibilityObserver) {
      this.visibilityObserver.unobserve(this);
      this.visibilityObserver = null;
    }

    if (!newSrc)
      return;

    let observer = _component_utils_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver(({ wasVisible, disconnect }) => {
      if (!wasVisible)
        this.fetchSrc(this.getAttribute('data-mythix-src'));

      disconnect();

      this.visibilityObserver = null;
    }, { elements: [ this ] });

    Object.defineProperties(this, {
      'visibilityObserver': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        observer,
      },
    });
  }

  attributeChangedCallback(...args) {
    let [
      attributeName,
      oldValue,
      newValue,
    ] = args;

    if (oldValue !== newValue) {
      // Security: ensure this is actually a handled attribute call!
      // We wouldn't just want to start setting anything on the instance
      // via attributes... that might be bad, i.e: <img valueOf="">

      let propertyName    = _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.toCamelCase(attributeName);
      let magicName       = `attr$${propertyName}`;
      let { descriptor }  = _utils_js__WEBPACK_IMPORTED_MODULE_3__.getDescriptorFromPrototypeChain(this, magicName);
      if (descriptor) {
        // Call setter
        this[propertyName] = newValue;
      }
    }

    return this.attributeChanged(...args);
  }

  adoptedCallback(...args) {
    return this.adopted(...args);
  }

  mounted() {}
  unmounted() {}
  attributeChanged() {}
  adopted() {}

  get $$() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_3__.createScope(this);
  }

  select(...args) {
    let argIndex    = 0;
    let options     = (_base_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject(args[argIndex])) ? Object.assign(Object.create(null), args[argIndex++]) : {};
    let queryEngine = _query_engine_js__WEBPACK_IMPORTED_MODULE_4__.QueryEngine.from.call(this, { root: this, ...options, invokeCallbacks: false }, ...args.slice(argIndex));
    let shadowNodes;

    options = queryEngine.getOptions();

    if (options.shadow !== false && options.selector && options.root === this) {
      shadowNodes = Array.from(
        _query_engine_js__WEBPACK_IMPORTED_MODULE_4__.QueryEngine.from.call(
          this,
          { root: this.shadow },
          options.selector,
          options.callback,
        ).values(),
      );
    }

    if (shadowNodes)
      queryEngine = queryEngine.add(shadowNodes);

    if (options.slotted !== true)
      queryEngine = queryEngine.slotted(false);

    if (typeof options.callback === 'function')
      return this.select(queryEngine.map(options.callback));

    return queryEngine;
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   This method will dynamically build elements, or rather, @see ElementDefinition; instances, that
   *   define elements to be created later. @see ElementDefinition; instances are just that, a simple
   *   structure that defines the name, attributes, and children of any given element.
   *
   *   When these are inserted into a document, either through a @see QueryEngine;, or directly by
   *   calling @see ElementDefinition.build; before insert, they are only at this point converted
   *   into real [Elements](https://developer.mozilla.org/en-US/docs/Web/API/Element) and inserted
   *   into the specified DOM (document) at the specified location.
   * arguments:
   *   - name: callback
   *     dataTypes: function
   *     desc: |
   *       A callback that is immediately called and expected to return @see ElementDefinition; instances.
   *       The callback is called with only two arguments. The first arguments, `elements`, is a
   *       @see ElementGenerator; Proxy instance, that will properly generate any element definition requested.
   *       The second argument, `context`, is simply an empty object provided to the callback, allowing the
   *       developer to store contextual based information for the operation, if desired.
   * return: |
   *   * @types ElementDefinition; A single @see ElementDefinition; instance defining
   *     the DOM to generate when inserted. Can be a `#fragment` element definition.
   *   * @types Array<ElementDefinition>; An array of element definition instances
   *     defining the DOM to generate when inserted.
   *   * @types null; If nothing is returned, then no elements will be created.
   * notes:
   *   - |
   *     :info: The difference between this method and @see MythixUIComponent.$build; method is
   *     that this method will return @see ElementDefinition; instances, whereas the
   *     @see MythixUIComponent.$build; method will return a @see QueryEngine; instance containing
   *     all the built @see ElementDefinition; instances.
   * examples:
   *   - |
   *     ```javascript
   *     import {
   *       MythixUIComponent,
   *       Utils,
   *     } from '@cdn/mythix-ui-core@1'; // ensure we lock this to whatever version is important to us
   *
   *     export class DemoNavComponent extends MythixUIComponent {
   *       static tagName = 'demo-nav-component'; // a "something-" prefix is required
   *
   *       mounted() { // called whenever the component is added to another element
   *         let list = [
   *           'Test 1',
   *           'Test 2',
   *           'Lorem Ipsum',
   *         ];
   *
   *         // Dynamically build and append some elements (with attributes and event bindings)
   *         let unorderedListElement = this.build(({ NAV, UL, LI, $TEXT }) => { // any element name can be requested here (even custom ones)
   *           return UL.id('primary-list').class('interactive-list')(
   *             // ...children of UL element
   *             ...list.map((item, index) => {
   *               return LI.class('item-name focusable').dataIndex(index).onClick(this.onItemClick)(
   *                 // ...children of LI element
   *                 $TEXT(item),  // in this case, a single text node
   *               );
   *             }),
   *           );
   *         });
   *
   *         // Create an append elements to this element
   *         this.append(
   *           unorderedListElement.build(
   *             this.ownerDocument,
   *             { scope: Utils.createScope(this) },
   *           ),
   *         );
   *       }
   *
   *       // All class methods are automatically bound to "this" inside the super.constructor
   *       onItemClick(event) {
   *         console.log('Item Clicked!', event.target);
   *       }
   *     }
   *
   *     DemoNavComponent.register();
   *     ```
   */
  build(callback) {
    let result = [ callback.call(this, _elements_js__WEBPACK_IMPORTED_MODULE_5__.ElementGenerator, {}) ].flat(Infinity).map((item) => {
      if (item && item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION])
        return item();

      return item;
    }).filter(Boolean);

    return (result.length < 2) ? result[0] : new _elements_js__WEBPACK_IMPORTED_MODULE_5__.ElementDefinition('#fragment', {}, result);
  }

  $build(callback) {
    return _query_engine_js__WEBPACK_IMPORTED_MODULE_4__.QueryEngine.from.call(this, [ this.build(callback) ].flat(Infinity));
  }

  isAttributeTruthy(name) {
    if (!this.hasAttribute(name))
      return false;

    let value = this.getAttribute(name);
    if (value === '' || value === 'true')
      return true;

    return false;
  }

  getIdentifier() {
    return this.getAttribute('id') || this.getAttribute('name') || this.getAttribute('data-name') || _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.toCamelCase(this.sensitiveTagName);
  }

  metadata(key, value) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_3__.metadata(this, key, value);
  }

  defineDynamicProp(name, defaultValue, setter, _context) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_3__.defineDynamicProp.call(_context || this, name, defaultValue, setter);
  }

  dynamicData(obj) {
    let keys = Object.keys(obj);
    let data = Object.create(null);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = obj[key];
      if (typeof value === 'function')
        continue;

      _utils_js__WEBPACK_IMPORTED_MODULE_3__.defineDynamicProp.call(data, key, value);
    }

    return data;
  }

  /**
   * parent: MythixUIComponent
   * groupName: MythixUIComponent
   * desc: |
   *   A self-resetting timeout. This method expects an `id` argument (or will generate one from the provided
   *   callback method if not provided). It uses this provided `id` to create a timeout. This timeout has a special feature
   *   however that differentiates it from a normal `setTimeout` call: if you call `this.debounce` again with the
   *   same `id` **before** the time runs out, then it will automatically reset the timer. In short, only the last call
   *   to `this.debounce` (given the same id) will take effect (unless the specified timeout is reached between calls).
   * return: |
   *   This method returns a specialized Promise instance. The instance is specialized because the following properties
   *   are injected into it:
   *   1. `resolve(resultValue)` - When called, resolves the promise with the first provided argument
   *   2. `reject(errorValue)` - When called, rejects the promise with the first provided argument
   *   3. `status()` - When called, will return the fulfillment status of the promise, as a `string`, one of: `"pending", "fulfilled"`, or `"rejected"`
   *   4. `id<string>` - A randomly generated ID for this promise
   *
   *   See @see BaseUtils.createResolvable;
   * arguments:
   *   - name: callback
   *     dataTypes: function
   *     desc: |
   *       The method to call when the timeout has been met.
   *   - name: timeMS
   *     dataTypes: number
   *     optional: true
   *     default: 0
   *     desc: |
   *       The number of milliseconds to wait before calling `callback`.
   *   - name: id
   *     dataTypes: string
   *     optional: true
   *     default: "null"
   *     desc: |
   *       The identifier for this debounce timer. If not provided, then one
   *       will be generated for you based on the provided callback.
   * notes:
   *   - Though not required, it is faster and less problematic to provide your own `id` argument
   */
  debounce(callback, timeMS, _id) {
    var id = _id;

    // If we don't get an id from the user, then guess the id by turning the function
    // into a string (raw source) and use that for an id instead
    if (id == null) {
      id = ('' + callback);

      // If this is a transpiled code, then an async generator will be used for async functions
      // This wraps the real function, and so when converting the function into a string
      // it will NOT be unique per call-site. For this reason, if we detect this issue,
      // we will go the "slow" route and create a stack trace, and use that for the unique id
      if (id.match(/asyncGeneratorStep/)) {
        id = (new Error()).stack;
        console.warn('mythix-ui warning: "this.delay" called without a specified "id" parameter. This will result in a performance hit. Please specify and "id" argument for your call: "this.delay(callback, ms, \'some-custom-call-site-id\')"');
      }
    } else {
      id = ('' + id);
    }

    let promise = this.delayTimers.get(id);
    if (promise) {
      if (promise.timerID)
        clearTimeout(promise.timerID);

      promise.reject('cancelled');
    }

    promise = _base_utils_js__WEBPACK_IMPORTED_MODULE_2__.createResolvable();
    this.delayTimers.set(id, promise);

    // Let's not complain about
    // uncaught errors
    promise.catch(() => {});

    promise.timerID = setTimeout(async () => {
      try {
        let result = await callback();
        promise.resolve(result);
      } catch (error) {
        console.error('Error encountered while calling "delay" callback: ', error, callback.toString());
        promise.reject(error);
      }
    }, timeMS || 0);

    return promise;
  }

  clearDebounce(id) {
    let promise = this.delayTimers.get(id);
    if (!promise)
      return;

    if (promise.timerID)
      clearTimeout(promise.timerID);

    promise.reject('cancelled');

    this.delayTimers.delete(id);
  }

  classes(..._args) {
    let args = _args.flat(Infinity).map((item) => {
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_2__.isType(item, '::String'))
        return item.trim();

      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_2__.isPlainObject(item)) {
        let keys  = Object.keys(item);
        let items = [];

        for (let i = 0, il = keys.length; i < il; i++) {
          let key   = keys[i];
          let value = item[key];
          if (!value)
            continue;

          items.push(key);
        }

        return items;
      }

      return null;
    }).flat(Infinity).filter(Boolean);

    return Array.from(new Set(args)).join(' ');
  }

  async fetchSrc(srcURL) {
    if (!srcURL)
      return;

    try {
      await _component_utils_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement.call(this, srcURL);
      this.classList.add('mythix-ready');
    } catch (error) {
      console.error(`"${this.sensitiveTagName}": Failed to load specified resource: ${srcURL} (resolved to: ${error.url})`, error);
    }
  }
}


/***/ }),

/***/ "./lib/mythix-ui-dynamic-style.js":
/*!****************************************!*\
  !*** ./lib/mythix-ui-dynamic-style.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIDynamicStyle: () => (/* binding */ MythixUIDynamicStyle)
/* harmony export */ });
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _component_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component-utils.js */ "./lib/component-utils.js");
/* harmony import */ var _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mythix-ui-component.js */ "./lib/mythix-ui-component.js");
/* eslint-disable no-magic-numbers */






class MythixUIDynamicStyle extends _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent {
  static tagName = 'mythix-dynamic-style';

  set attr$dataEnabled([ newValue ]) {
    this.handleDataEnabledAttributeChange(newValue);
  }

  createStyleNode() {
    let ownerDocument   = this.ownerDocument || document;
    let initialContent  = this.textContent.trim();
    let href            = this.attr('href');
    let styleNode       = ownerDocument.createElement('style');

    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNotNOE(href)) {
      _component_utils_js__WEBPACK_IMPORTED_MODULE_1__.require(href, { ownerDocument }).then(
        async ({ response }) => {
          let content = await response.text();
          styleNode.innerHTML = content;

          this.handleDataEnabledAttributeChange(this.attr('data-enabled'));
        },
        (error) => {
          console.error(`mythix-dynamic-style: Error while attempting to load style "${href}": `, this, error);
        },
      );
    } else if (_base_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNotNOE(initialContent)) {
      if ((/<style[^>]*>/i).test(initialContent)) {
        let tempDiv = ownerDocument.createElement('div');
        tempDiv.innerHTML = initialContent;

        let tempNode = tempDiv.querySelector('style');
        if (tempNode)
          styleNode = tempNode;
        else
          styleNode.innerHTML = initialContent;
      } else {
        styleNode.innerHTML = initialContent;
      }
    }

    return styleNode;
  }

  mounted() {
    super.mounted();

    this.styleNode = this.createStyleNode();

    this.handleDataEnabledAttributeChange(this.attr('data-enabled'));
  }

  handleDataEnabledAttributeChange(enabled) {
    if (!this.styleNode)
      return;

    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNOE(this.styleNode.textContent))
      return;

    let isEnabled = (/^(true)$/i).test(enabled);
    if (isEnabled)
      this.appendChild(this.styleNode);
    else if (this.contains(this.styleNode))
      this.removeChild(this.styleNode);
  }
}

MythixUIDynamicStyle.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIDynamicStyle = MythixUIDynamicStyle;


/***/ }),

/***/ "./lib/mythix-ui-language-provider.js":
/*!********************************************!*\
  !*** ./lib/mythix-ui-language-provider.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUILanguagePack: () => (/* binding */ MythixUILanguagePack),
/* harmony export */   MythixUILanguageProvider: () => (/* binding */ MythixUILanguageProvider)
/* harmony export */ });
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./component-utils.js */ "./lib/component-utils.js");
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");
/* harmony import */ var _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-component.js */ "./lib/mythix-ui-component.js");









class MythixUILanguagePack extends _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_5__.MythixUIComponent {
  static tagName = 'mythix-language-pack';

  createShadowDOM() {
    // NOOP
  }

  getComponentTemplate() {
    // NOOP
  }

  set attr$dataMythixSrc([ value ]) {
    // NOOP... Trap this because we
    // don't want to load a partial here
  }

  onMutationAdded(mutation) {
    // When added to the DOM, ensure that we were
    // added to the root of a language provider...
    // If not, then move ourselves to the root
    // of the language provider.
    let parentLanguageProvider = this.closest('mythix-language-provider');
    if (parentLanguageProvider && parentLanguageProvider !== mutation.target)
      _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.nextTick(() => parentLanguageProvider.insertBefore(this, parentLanguageProvider.firstChild));
  }
}

const IS_JSON_ENCTYPE                 = /^application\/json/i;
const LANGUAGE_PACK_INSERT_GRACE_TIME = 50;

class MythixUILanguageProvider extends _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_5__.MythixUIComponent {
  static tagName = 'mythix-language-provider';

  set attr$lang([ newValue, oldValue ]) {
    this.loadAllLanguagePacksForLanguage(newValue, oldValue);
  }

  onMutationChildAdded(node) {
    if (node.localName === 'mythix-language-pack') {
      this.debounce(() => {
        // Reload language packs after additions
        this.loadAllLanguagePacksForLanguage(this.getCurrentLocale());
      }, LANGUAGE_PACK_INSERT_GRACE_TIME, 'reloadLanguagePacks');
    }
  }

  constructor() {
    super();

    Object.defineProperties(this, {
      'terms': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        Object.create(null),
      },
    });
  }

  i18n(_path, defaultValue) {
    let path    = `global.i18n.${_path}`;
    let result  = _utils_js__WEBPACK_IMPORTED_MODULE_2__.fetchPath(this.terms, path);

    if (result == null)
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.getDynamicPropertyForPath.call(this, path, (defaultValue == null) ? '' : defaultValue);

    return result;
  }

  getCurrentLocale() {
    // (this.ownerDocument || document).childNodes[1] is the `<html`> tag of the document
    return this.getAttribute('lang') || (this.ownerDocument || document).childNodes[1].getAttribute('lang') || 'en';
  }

  mounted() {
    super.mounted();

    if (!this.getAttribute('lang'))
      this.setAttribute('lang', (this.ownerDocument || document).childNodes[1].getAttribute('lang') || 'en');
  }

  createShadowDOM() {
    // NOOP
  }

  getComponentTemplate() {
    // NOOP
  }

  getSourcesForLang(lang) {
    return this.select(`mythix-language-pack[lang^="${lang.replace(/"/g, '\\"')}"]`);
  }

  loadAllLanguagePacksForLanguage(_lang) {
    let lang            = _lang || 'en';
    let sourceElements  = this.getSourcesForLang(lang).filter((sourceElement) => _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNotNOE(sourceElement.getAttribute('src')));
    if (!sourceElements || !sourceElements.length) {
      console.warn(`"mythix-language-provider": No "mythix-language-pack" tag found for specified language "${lang}"`);
      return;
    }

    this.loadAllLanguagePacks(lang, sourceElements);
  }

  async loadAllLanguagePacks(lang, sourceElements) {
    try {
      let promises  = sourceElements.map((sourceElement) => this.loadLanguagePack(lang, sourceElement));
      let allTerms  = (await Promise.allSettled(promises)).map((result) => {
        if (result.status !== 'fulfilled')
          return;

        return result.value;
      }).filter(Boolean);

      let terms         = deepmerge__WEBPACK_IMPORTED_MODULE_0__.all(Array.from(new Set(allTerms)));
      let compiledTerms = this.compileLanguageTerms(lang, terms);

      this.terms = compiledTerms;
    } catch (error) {
      console.error('"mythix-language-provider": Failed to load language packs', error);
    }
  }

  async loadLanguagePack(lang, sourceElement) {
    let src = sourceElement.getAttribute('src');
    if (!src)
      return;

    try {
      let { response }  = await _component_utils_js__WEBPACK_IMPORTED_MODULE_3__.require.call(this, src, { ownerDocument: this.ownerDocument || document });
      let type          = this.getAttribute('enctype') || 'application/json';
      if (IS_JSON_ENCTYPE.test(type)) {
        // Handle JSON
        return response.json();
      } else {
        new TypeError(`Don't know how to load a language pack of type "${type}"`);
      }
    } catch (error) {
      console.error(`"mythix-language-provider": Failed to load specified resource: ${src}`, error);
    }
  }

  compileLanguageTerms(lang, terms) {
    const walkTerms = (terms, rawKeyPath) => {
      let keys      = Object.keys(terms);
      let termsCopy = {};

      for (let i = 0, il = keys.length; i < il; i++) {
        let key         = keys[i];
        let value       = terms[key];
        let newKeyPath  = rawKeyPath.concat(key);

        if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(value) || Array.isArray(value)) {
          termsCopy[key] = walkTerms(value, newKeyPath);
        } else {
          let property = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getDynamicPropertyForPath.call(this, newKeyPath.join('.'), value);
          termsCopy[key] = property;
          property[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__.DynamicProperty.set](value);
        }
      }

      return termsCopy;
    };

    return walkTerms(terms, [ 'global', 'i18n' ]);
  }
}

MythixUILanguagePack.register();
MythixUILanguageProvider.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUILanguagePack = MythixUILanguagePack;
globalThis.mythixUI.MythixUILanguageProvider = MythixUILanguageProvider;


/***/ }),

/***/ "./lib/mythix-ui-require.js":
/*!**********************************!*\
  !*** ./lib/mythix-ui-require.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIRequire: () => (/* binding */ MythixUIRequire)
/* harmony export */ });
/* harmony import */ var _component_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component-utils.js */ "./lib/component-utils.js");
/* harmony import */ var _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mythix-ui-component.js */ "./lib/mythix-ui-component.js");



const IS_TEMPLATE       = /^(template)$/i;
const TEMPLATE_TEMPLATE = /^(\*|\|\*|\*\|)$/;

/**
 * type: MythixElement
 * name: MythixUIRequire
 * groupName: MythixElements
 * desc: |
 *   ```javascript
 *   import { MythixElements } from 'mythix-ui-core@1.0';
 *
 *   const {
 *     MythixUIRequire,
 *   } = MythixElements;
 *   ```
 *
 *   MythixUIRequire is an Element that will load other resources. It is inspired by and named after `require` in Node. It works very similarly as well, so not too much needs to be explained about it.
 *
 *   Except Mythix UI standard component file structure maybe... Yeah, maybe we should discuss that.
 *
 *   The `<mythix-require src="./components/widget.html">` tag allows you to load other resources simply by specifying a path. This path can be relative, or absolute. The path can contain query parameters.
 *
 *   You may have noticed that the tag name doesn't quite match the class name, `MythixUIRequire`, vs `<mythix-require>`. This deviation was chosen by the Mythix development team because Mythix is an entire ecosystem, not just a UI framework. For this reason, and in part to avoid future naming collisions, we have decided that in code, the class name should contain the `UI` part to delimit it from other Mythix technologies. Next, we felt constantly typing `<mythix-ui-require>` in HTML, vs the nicer `<mythix-require>` was kinda silly. Besides, in HTML, you ARE in the UI context, so why repeat ourselves? Anyhow, this is just a little note to keep in mind. The Element class names do not match the Element `tagName` for Mythix UI standard components.
 *
 *   If `<mythix-require>` is used to fetch a JavaScript resource, then it behaves almost identically to a `<script>` tag. If however it is being used to fetch another type of known resource, such as text/html, then it will behave differently.
 *
 *   When an HTML file is fetched by a `<mythix-require>` element, then any internal `<script>`, `<style>`, or other tag that belongs in the `<head>` tag will be placed in the `<head>` tag of the document. Duplicate inserts are prevented by use of tag ids. If a tag in the `<head>` of the document already has the same id as one MythixUIRequire is trying to insert, then MythixUIRequire will abort, and it won't duplicate inserting said element.
 *
 *   Other elements are treated specially as well when encountered in the loaded HTML file. Below is a table of special cases:
 *
 *   | Elements | Notes |
 *   |------|-------|
 *   | `<link>`, `<style>`, `<meta>` | Are appended to the `<head>` of the document. |
 *   | `<script>` | Is appended to the `<head>` of the document after the `src` attribute is fully resolved. |
 *   | `<template>` | Is appended to the bottom of the `<body>` of the document. |
 *   | `<base>`, `<noscript>`, `<title>` | Are deliberately discarded. |
 *   | All others | Are appended to the `<body>` of the document. |
 *
 * notes:
 *   - |
 *     :info: `globalThis.mythixUI.urlResolver: (context: { src: string | URL, url: URL, path: string, fileName: string }) => string | URL` is a method that can be defined by the user. When defined, it will be called every time @see ComponentUtils.resolveURL; is called. `MythixUIRequire` calls @see ComponentUtils.resolveURL; to resolve URLs, including in sub `<script>` tag `src` attributes loaded from resources. It is the intent of this method that it will globally resolve all URLs internal to the Mythix UI framework. Obviously it won't resolve URLs directly from static `import` or dynamic `import()` statements in JavaScript. Those are handled by the [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) you setup, remember?.
 * examples:
 *   - |
 *     Another component can be loaded dynamically--usually by loading its corresponding HTML file (which will generally then load the `<script>` require by the component). In the example below we are loading the standard modal component provided by Mythix UI:
 *     ```html
 *     <mythix-require src="@cdn/mythix-ui-modal@${{majorVersion}}/dist/mythix-ui-modal.html"></mythix-require>
 *     ```
 */

let REQUIRE_HANDLERS = [];

function registerRequireHandler(pattern, callback) {
  REQUIRE_HANDLERS.unshift({
    pattern,
    callback,
  });
}

registerRequireHandler(/\.html$/i, async function({ url, ownerDocument }) {
  let {
    response,
    cached,
  } = await _component_utils_js__WEBPACK_IMPORTED_MODULE_0__.require.call(
    this,
    url,
    {
      magic:          false,
      ownerDocument:  ownerDocument || document,
    },
  );

  if (cached)
    return true;

  let body = await response.text();
  _component_utils_js__WEBPACK_IMPORTED_MODULE_0__.importIntoDocumentFromSource.call(
    this,
    ownerDocument,
    ownerDocument.location,
    url,
    body,
    {
      magic:        true,
      nodeHandler:  (node, { isHandled }) => {
        if (!isHandled && node.nodeType === Node.ELEMENT_NODE)
          document.body.appendChild(node);
      },
      preProcess:   ({ template, children }) => {
        let starTemplate = children.find((child) => {
          let dataFor = child.getAttribute('data-for');
          return (IS_TEMPLATE.test(child.tagName) && TEMPLATE_TEMPLATE.test(dataFor));
        });

        if (!starTemplate)
          return template;

        let dataFor = starTemplate.getAttribute('data-for');
        for (let child of children) {
          if (child === starTemplate)
            continue;

          if (IS_TEMPLATE.test(child.tagName)) { // <template>
            let starClone = starTemplate.content.cloneNode(true);
            if (dataFor === '*|')
              child.content.insertBefore(starClone, child.content.childNodes[0] || null);
            else
              child.content.appendChild(starClone);
          }
        }

        starTemplate.parentNode.removeChild(starTemplate);

        return template;
      },
    },
  );

  return true;
});

registerRequireHandler(/\.js$/i, async function({ url, ownerDocument }) {
  let result = _component_utils_js__WEBPACK_IMPORTED_MODULE_0__.insertScriptIntoHead(url, { ownerDocument });
  console.log({ scriptElement: result });
  return true;
});

class MythixUIRequire extends _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent {
  static registerHandler = registerRequireHandler;

  async mounted() {
    super.mounted();

    let src = this.getAttribute('src');

    try {
      let ownerDocument = this.ownerDocument || document;
      let url           = _component_utils_js__WEBPACK_IMPORTED_MODULE_0__.resolveURL.call(this, ownerDocument.location, src, { magic: true });

      for (let [ index, handler ] of REQUIRE_HANDLERS.entries()) {
        let {
          pattern,
          callback,
        } = handler;

        if (pattern.test(url)) {
          let result = await callback.call(this, { src, url, index, ownerDocument });
          if (result === true)
            break;
        }
      }
    } catch (error) {
      console.error(`"mythix-require": Failed to load specified resource: ${src}`, error);
    }
  }

  async fetchSrc() {
    // NOOP
  }
}

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIRequire = MythixUIRequire;

if (typeof customElements !== 'undefined' && !customElements.get('mythix-require'))
  customElements.define('mythix-require', MythixUIRequire);


/***/ }),

/***/ "./lib/mythix-ui-spinner.js":
/*!**********************************!*\
  !*** ./lib/mythix-ui-spinner.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUISpinner: () => (/* binding */ MythixUISpinner)
/* harmony export */ });
/* harmony import */ var _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mythix-ui-component.js */ "./lib/mythix-ui-component.js");
/* eslint-disable no-magic-numbers */



/*
Many thanks to Sagee Conway for the following CSS spinners
https://codepen.io/saconway/pen/vYKYyrx
*/

const STYLE_SHEET =
`
:host {
  --mythix-spinner-size: 1em;
  width: var(--mythix-spinner-size);
  height: var(--mythix-spinner-size);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
}
:host(.small) {
  --mythix-spinner-size: calc(1em * 0.75);
}
:host(.medium) {
  --mythix-spinner-size: calc(1em * 1.5);
}
:host(.large) {
  --mythix-spinner-size: calc(1em * 3);
}
.spinner-item,
.spinner-item::before,
.spinner-item::after {
	box-sizing: border-box;
}
:host([kind="audio"]) .spinner-item {
  width: 11%;
  height: 60%;
  background: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-audio-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) ease-in-out infinite;
}
@keyframes mythix-spinner-audio-animation {
  50% {
    transform: scaleY(0.25);
  }
}
:host([kind="audio"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -3);
}
:host([kind="audio"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -2);
}
:host([kind="audio"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -3);
}
:host([kind="circle"]) .spinner-item {
  --mythix-spinner-circle-thickness: calc(var(--mythix-spinner-size) * 0.075);
  position: absolute;
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  top: calc(50% - var(--mythix-spinner-item-size) / 2);
  left: calc(50% - var(--mythix-spinner-item-size) / 2);
  border: var(--mythix-spinner-circle-thickness) solid transparent;
  border-left: var(--mythix-spinner-circle-thickness) solid var(--mythix-spinner-segment-color);
  border-right: var(--mythix-spinner-circle-thickness) solid var(--mythix-spinner-segment-color);
  border-radius: 50%;
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) linear infinite;
}
@keyframes mythix-spinner-circle-animation {
  to {
    transform: rotate(360deg);
  }
}
:host([kind="circle"]) .spinner-item:nth-of-type(1) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 1.0);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  border-top: var(--mythix-spinner-circle-thickness) * 0.075) solid var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.7);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  border-bottom: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 0.875) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(3) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.4);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  border-top: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 0.75) linear infinite;
}
:host([kind="puzzle"]) {
  transform: translate(0, calc(var(--mythix-spinner-size) * 0.1)) rotate(45deg);
}
:host([kind="puzzle"]) .spinner-item {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) / 2.5);
  position: absolute;
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  border: calc(var(--mythix-spinner-size) * 0.1) solid var(--mythix-spinner-segment-color);
}
:host([kind="puzzle"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  top: 0;
  left: 0;
  animation: mythix-spinner-puzzle-animation1 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation1 {
  0%, 8.33%, 16.66%, 100% {
    transform: translate(0%, 0%);
  }
  24.99%, 33.32%, 41.65% {
    transform: translate(100%, 0%);
  }
  49.98%, 58.31%, 66.64% {
    transform: translate(100%, 100%);
  }
  74.97%, 83.30%, 91.63% {
    transform: translate(0%, 100%);
  }
}
:host([kind="puzzle"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  top: 0;
  left: var(--mythix-spinner-item-size);
  animation: mythix-spinner-puzzle-animation2 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation2 {
  0%, 8.33%, 91.63%, 100% {
    transform: translate(0%, 0%);
  }
  16.66%, 24.99%, 33.32% {
    transform: translate(0%, 100%);
  }
  41.65%, 49.98%, 58.31% {
    transform: translate(-100%, 100%);
  }
  66.64%, 74.97%, 83.30% {
    transform: translate(-100%, 0%);
  }
}
:host([kind="puzzle"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  top: var(--mythix-spinner-item-size);
  left: var(--mythix-spinner-item-size);
  animation: mythix-spinner-puzzle-animation3 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation3 {
  0%, 83.30%, 91.63%, 100% {
    transform: translate(0, 0);
  }
  8.33%, 16.66%, 24.99% {
    transform: translate(-100%, 0);
  }
  33.32%, 41.65%, 49.98% {
    transform: translate(-100%, -100%);
  }
  58.31%, 66.64%, 74.97% {
    transform: translate(0, -100%);
  }
}
:host([kind="wave"]) .spinner-item {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) / 4);
  min-width: var(--mythix-spinner-item-size);
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  border-radius: 50%;
  border: none;
  overflow: hidden;
  background-color: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-wave-animation calc(var(--theme-animation-duration, 1000ms) * 1.15) ease-in-out infinite;
}
@keyframes mythix-spinner-wave-animation {
  0%, 100% {
    transform: translateY(75%);
  }
  50% {
    transform: translateY(-75%);
  }
}
:host([kind="wave"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -1);
}
:host([kind="wave"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -2);
}
:host([kind="wave"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -3);
}
:host([kind="pipe"]) .spinner-item {
  width: 11%;
  height: 40%;
  background-color: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-pipe-animation calc(var(--theme-animation-duration, 1000ms) * 1.15) ease-in-out infinite;
}
@keyframes mythix-spinner-pipe-animation {
  25% {
    transform: scaleY(2);
  }
  50% {
    transform: scaleY(1);
  }
}
:host([kind="pipe"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
}
:host([kind="pipe"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10);
}
:host([kind="pipe"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 2);
}
:host([kind="pipe"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 3);
}
:host([kind="pipe"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 4);
}
:host([kind="dot"]) .spinner-item {
  position: absolute;
  top: calc(50% - var(--mythix-spinner-size) / 2);
  left: calc(50% - var(--mythix-spinner-size) / 2);
  width: var(--mythix-spinner-size);
  height: var(--mythix-spinner-size);
  background: var(--mythix-spinner-segment-color);
  border-radius: 50%;
  animation: mythix-spinner-dot-animation calc(var(--theme-animation-duration, 1000ms) * 3.0) ease-in-out infinite;
}
@keyframes mythix-spinner-dot-animation {
  0%, 100% {
    transform: scale(0.25);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0;
  }
}
:host([kind="dot"]) .spinner-item:nth-of-type(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
}
:host([kind="dot"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 3.0) / -2);
}
`;

const KINDS = {
  'audio':  5,
  'circle': 3,
  'dot':    2,
  'pipe':   5,
  'puzzle': 3,
  'wave':   3,
};

class MythixUISpinner extends _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  static tagName = 'mythix-spinner';

  set attr$kind([ newValue ]) {
    this.handleKindAttributeChange(newValue);
  }

  mounted() {
    super.mounted();

    if (!this.documentInitialized) {
      // append template
      let ownerDocument = this.ownerDocument || document;
      this.$build(({ TEMPLATE }) => {
        return TEMPLATE
          .dataMythixName(this.sensitiveTagName)
          .prop$innerHTML(`<style>${STYLE_SHEET}</style>`);
      }).appendTo(ownerDocument.body);

      let template = this.template = this.getComponentTemplate();
      this.appendTemplateToShadowDOM(template);
    }

    let kind = this.getAttribute('kind');
    if (!kind) {
      kind = 'pipe';
      this.setAttribute('kind', kind);
    }

    this.handleKindAttributeChange(kind);
  }

  handleKindAttributeChange(_kind) {
    let kind        = ('' + _kind).toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(KINDS, kind)) {
      console.warn(`"mythix-spinner" unknown "kind" provided: "${kind}". Supported "kind" attribute values are: "pipe", "audio", "circle", "puzzle", "wave", and "dot".`);
      kind = 'pipe';
    }

    this.changeSpinnerChildren(KINDS[kind]);
  }

  buildSpinnerChildren(count) {
    let children      = new Array(count);
    let ownerDocument = (this.ownerDocument || document);

    for (let i = 0; i < count; i++) {
      let element = ownerDocument.createElement('div');
      element.setAttribute('class', 'spinner-item');

      children[i] = element;
    }

    return this.select(children);
  }

  changeSpinnerChildren(count) {
    this.select('.spinner-item').remove();
    this.buildSpinnerChildren(count).appendTo(this.shadow);

    // Always append style again, so
    // that it is the last child, and
    // doesn't mess with "nth-child"
    // selectors
    this.select('style').appendTo(this.shadow);
  }
}

MythixUISpinner.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIRequire = MythixUISpinner;


/***/ }),

/***/ "./lib/query-engine.js":
/*!*****************************!*\
  !*** ./lib/query-engine.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QueryEngine: () => (/* binding */ QueryEngine)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");








const IS_INTEGER = /^\d+$/;

function isElement(value) {
  if (!value)
    return false;

  // We have an Element or a Document
  if (value.nodeType === Node.ELEMENT_NODE || value.nodeType === Node.DOCUMENT_NODE || value.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
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

class QueryEngine {
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE);
    } catch (e) {
      return false;
    }
  }

  static isElement    = isElement;
  static isSlotted    = isSlotted;
  static isNotSlotted = isNotSlotted;

  static from = function(...args) {
    if (args.length === 0)
      return new QueryEngine([], { root: (isElement(this)) ? this : document, context: this });

    const getOptions = () => {
      let base = Object.create(null);
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(args[argIndex]))
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
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(args[argIndex + 1], '::Function'))
        options.callback = args[1];

      queryEngine = new QueryEngine(args[argIndex], options);
    } else if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(args[argIndex], '::String')) {
      options.selector = args[argIndex++];

      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(args[argIndex], '::Function'))
        options.callback = args[argIndex++];

      queryEngine = new QueryEngine(root.querySelectorAll(options.selector), options);
    } else if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(args[argIndex], '::Function')) {
      options.callback = args[argIndex++];

      let result = options.callback.call(this, _elements_js__WEBPACK_IMPORTED_MODULE_3__.ElementGenerator, options);
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
      [_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE,
      },
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
        if (typeof propName === 'symbol') {
          if (propName in target)
            return target[propName];
          else if (propName in target._mythixUIElements)
            return target._mythixUIElements[propName];

          return;
        }

        if (propName === 'length')
          return target._mythixUIElements.length;

        if (propName === 'prototype')
          return target.prototype;

        if (propName === 'constructor')
          return target.constructor;

        // Index lookup
        if (IS_INTEGER.test(propName))
          return target._mythixUIElements[propName];

        if (propName in target)
          return target[propName];

        // Redirect any array methods:
        //
        // "magicPropName" is when the
        // function name begins with "$",
        // i.e. "$filter", or "$map". If
        // this is the case, then the return
        // value will always be coerced into
        // a QueryEngine. Otherwise, it will
        // only be coerced into a QueryEngine
        // if EVERY element in the result is
        // an "elementy" type value.
        let magicPropName = (propName.charAt(0) === '$') ? propName.substring(1) : propName;
        if (typeof Array.prototype[magicPropName] === 'function') {
          return (...args) => {
            let array   = target._mythixUIElements;
            let result  = array[magicPropName](...args);

            if (Array.isArray(result) && (magicPropName !== propName || result.every((item) => _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, _elements_js__WEBPACK_IMPORTED_MODULE_3__.ElementDefinition, Node, QueryEngine)))) {
              const EngineClass = target.getEngineClass();
              return new EngineClass(result, target.getOptions());
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

  getUnderlyingArray() {
    return this._mythixUIElements;
  }

  getOwnerDocument() {
    return this.getRoot().ownerDocument || document;
  }

  filterAndConstructElements(context, elements) {
    let finalElements = Array.from(elements).flat(Infinity).map((_item) => {
      if (!_item)
        return;

      let item = _item;
      if (item instanceof QueryEngine)
        return item.getUnderlyingArray();

      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, Node))
        return item;

      if (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION])
        item = item();

      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, '::String'))
        item = _elements_js__WEBPACK_IMPORTED_MODULE_3__.Term(item);
      else if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, _elements_js__WEBPACK_IMPORTED_MODULE_3__.ElementDefinition))
        return;

      if (!context)
        throw new Error('The "context" option for QueryEngine is required when constructing elements.');

      return item.build(this.getOwnerDocument(), {
        scope: _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(context),
      });
    }).flat(Infinity).filter(Boolean);

    return Array.from(new Set(finalElements));
  }

  select(...args) {
    let argIndex  = 0;
    let options   = Object.assign(Object.create(null), this.getOptions(), (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(args[argIndex])) ? args[argIndex++] : {});

    if (options.context && typeof options.context.$ === 'function')
      return options.context.$.call(options.context, options, ...args.slice(argIndex));

    const EngineClass = this.getEngineClass();
    return EngineClass.from.call(options.context || this, options, ...args.slice(argIndex));
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

  first(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(count, '::Number'))
      return this.select([ this._mythixUIElements[0] ]);

    return this.select(this._mythixUIElements.slice(Math.abs(count)));
  }

  last(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(count, '::Number'))
      return this.select([ this._mythixUIElements[this._mythixUIElements.length - 1] ]);

    return this.select(this._mythixUIElements.slice(Math.abs(count) * -1));
  }

  add(...elements) {
    const EngineClass = this.getEngineClass();
    return new EngineClass(this.slice().concat(...elements), this.getOptions());
  }

  subtract(...elements) {
    let set = new Set(elements);

    const EngineClass = this.getEngineClass();
    return new EngineClass(this.filter((item) => {
      return !set.has(item);
    }), this.getOptions());
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
    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(selectorOrElement, '::String'))
      element = this.getRoot().querySelector(selectorOrElement);

    for (let child of this._mythixUIElements)
      element.appendChild(child);
  }

  insertInto(selectorOrElement, referenceNode) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(selectorOrElement, '::String'))
      element = this.getRoot().querySelector(selectorOrElement);

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

  replaceChildrenOf(selectorOrElement) {
    let element = selectorOrElement;
    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(selectorOrElement, '::String'))
      element = this.getRoot().querySelector(selectorOrElement);

    while (element.childNodes.length)
      element.removeChild(element.childNodes[0]);

    return this.appendTo(element);
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

  slot(slotName) {
    return this.filter((element) => {
      if (element && element.slot === slotName)
        return true;

      if (element.closest(`slot[name="${slotName.replace(/"/g, '\\"')}"]`))
        return true;

      return false;
    });
  }
}

(globalThis.mythixUI = (globalThis.mythixUI || {})).QueryEngine = QueryEngine;


/***/ }),

/***/ "./lib/sha256.js":
/*!***********************!*\
  !*** ./lib/sha256.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHA256: () => (/* binding */ SHA256)
/* harmony export */ });
/* eslint-disable no-magic-numbers */

/*
Many thanks to Geraint Luff for the following

https://github.com/geraintluff/sha256/
*/

/**
 * type: Function
 * name: SHA256
 * groupName: BaseUtils
 * desc: |
 *   SHA256 hashing function
 * arguments:
 *   - name: input
 *     dataType: string
 *     desc: Input string
 * return: |
 *   @types string; The SHA256 hash of the provided `input`.
 * notes:
 *   - |
 *     :warning: This is a custom baked SHA256 hashing function, minimized for size.
 *     It may be incomplete, and it is strongly recommended that you **DO NOT** use this
 *     for anything related to security.
 *   - |
 *     :warning: Read all the notes, and use this method with caution.
 *   - |
 *     :info: This method has been modified slightly from the original to *not* bail when
 *     unicode characters are detected. There is a decent chance that--given certain
 *     input--this method will return an invalid SHA256 hash."
 *   - |
 *     :info: Mythix UI uses this method simply to generate consistent IDs.
 *   - |
 *     :heart: Many thanks to the author [Geraint Luff](https://github.com/geraintluff/sha256/)
 *     for this method!
 */
function SHA256(_input) {
  let input = _input;

  let mathPow = Math.pow;
  let maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i; let j; // Used as a counter across the whole file
  let result = '';

  let words = [];
  let asciiBitLength = input[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  let hash = SHA256.h = SHA256.h || [];
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  let k = SHA256.k = SHA256.k || [];
  let primeCounter = k[lengthProperty];
  /*/
    let hash = [], k = [];
    let primeCounter = 0;
    //*/

  let isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate)
        isComposite[i] = candidate;

      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  input += '\x80'; // Append Ƈ' bit (plus zero padding)
  while (input[lengthProperty] % 64 - 56)
    input += '\x00'; // More zero padding

  for (i = 0; i < input[lengthProperty]; i++) {
    j = input.charCodeAt(i);
    if (j >> 8)
      return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }

  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);

  // process each chunk
  for (j = 0; j < words[lengthProperty];) {
    let w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
    let oldHash = hash;

    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      // Expand the message into 64 words
      // Used below if
      let w15 = w[i - 15]; let w2 = w[i - 2];

      // Iterate
      let a = hash[0]; let e = hash[4];
      let temp1 = hash[7]
                + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                  w[i - 16]
                        + (((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3)) // s0
                        + w[i - 7]
                        + (((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10)) // s1
                ) | 0
                );
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      let temp2 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++)
      hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      let b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }

  return result;
}


/***/ }),

/***/ "./lib/utils.js":
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindEventToElement: () => (/* binding */ bindEventToElement),
/* harmony export */   bindMethods: () => (/* binding */ bindMethods),
/* harmony export */   compileTemplateFromParts: () => (/* binding */ compileTemplateFromParts),
/* harmony export */   createScope: () => (/* binding */ createScope),
/* harmony export */   createTemplateMacro: () => (/* binding */ createTemplateMacro),
/* harmony export */   defineDynamicProp: () => (/* binding */ defineDynamicProp),
/* harmony export */   dynamicPropID: () => (/* binding */ dynamicPropID),
/* harmony export */   fetchPath: () => (/* binding */ fetchPath),
/* harmony export */   formatNodeValue: () => (/* binding */ formatNodeValue),
/* harmony export */   getAllEventNamesForElement: () => (/* binding */ getAllEventNamesForElement),
/* harmony export */   getAllPropertyNames: () => (/* binding */ getAllPropertyNames),
/* harmony export */   getDescriptorFromPrototypeChain: () => (/* binding */ getDescriptorFromPrototypeChain),
/* harmony export */   getDisableTemplateEngineSelector: () => (/* binding */ getDisableTemplateEngineSelector),
/* harmony export */   getDynamicPropertyForPath: () => (/* binding */ getDynamicPropertyForPath),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   globalStore: () => (/* binding */ globalStore),
/* harmony export */   globalStoreDynamic: () => (/* binding */ globalStoreDynamic),
/* harmony export */   globalStoreNameValuePairHelper: () => (/* binding */ globalStoreNameValuePairHelper),
/* harmony export */   isTemplate: () => (/* binding */ isTemplate),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   parseTemplateParts: () => (/* binding */ parseTemplateParts),
/* harmony export */   registerDisableTemplateEngineSelector: () => (/* binding */ registerDisableTemplateEngineSelector),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   specialClosest: () => (/* binding */ specialClosest),
/* harmony export */   storage: () => (/* binding */ storage),
/* harmony export */   unregisterDisableTemplateEngineSelector: () => (/* binding */ unregisterDisableTemplateEngineSelector)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");






/**
 * type: Namespace
 * name: Utils
 * groupName: Utils
 * desc: |
 *   `import { Utils } from 'mythix-ui-core@1.0';`
 *
 *   Misc utility functions are found within this namespace.
 */

function bindMethods(_proto, skipProtos) {
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

function getDescriptorFromPrototypeChain(startProto, descriptorName) {
  let thisProto = startProto;
  let descriptor;

  while (thisProto && !(descriptor = Object.getOwnPropertyDescriptor(thisProto, descriptorName)))
    thisProto = Object.getPrototypeOf(thisProto);

  return { prototype: thisProto, descriptor };
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
function metadata(target, key, value) {
  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isCollectable(target))
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

const VALID_JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const RESERVED_IDENTIFIER = /^(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|let|static|yield)$/;

function getContextCallArgs(context, ...extraContexts) {
  let contextCallArgs = Array.from(
    new Set(getAllPropertyNames(context).concat(
      Object.keys(globalThis.mythixUI.globalScope || {}),
      [ 'attributes', 'classList', '$$', 'i18n' ],
      ...extraContexts.map((extraContext) => Object.keys(extraContext || {})),
    )),
  ).filter((name) => {
    if (RESERVED_IDENTIFIER.test(name))
      return false;

    return VALID_JS_IDENTIFIER.test(name);
  });

  return `{${contextCallArgs.join(',')}}`;
}

/**
 * groupName: Utils
 * desc: |
 *   Get the parent Node of `element`.
 * arguments:
 *   - name: element
 *     dataType: Node
 *     desc: |
 *       The Node whose parent you wish to find.
 * notes:
 *   - |
 *     :warning: Unlike [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode), this
 *     will also search across Shadow DOM boundaries.
 *   - |
 *     :warning: **Searching across Shadow DOM boundaries only works for Mythix UI components!**
 *   - |
 *     :info: Searching across Shadow DOM boundaries is accomplished via leveraging @see MythixUIComponent.metadata; on
 *     `element`. When a `null` parent is encountered, `getParentNode` will look for @see MythixUIComponent.metadata?caption=metadata; key @see Constants.MYTHIX_SHADOW_PARENT;
 *     on `element`. If found, the result is considered the [parent Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) of `element`.
 * return: |
 *   @types Node; The parent node, if there is any, or `null` otherwise.
 */
function getParentNode(element) {
  if (!element)
    return null;

  if (element.parentNode && element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element.parentNode, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT) || null;

  if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT) || null;

  return element.parentNode;
}

/**
 * groupName: Utils
 * desc: |
 *   Create a Proxy that is essentially (functionally) a multi-prototype `object` instance.
 *
 *   A "scope" in Mythix UI might be better called a "context"... however, "scope"
 *   was chosen because it *is* a scope... or might be better described as "multiple scopes in one".
 *   This is specifically a "DOM scope", in that this method is "DOM aware" and will traverse the
 *   DOM looking for the requested data (if any of the specified `targets` is an Element that is).
 *
 *   The way this works is that the caller will provide at least one "target". These targets are
 *   themselves scopes, elements, or other data objects. When the returned Proxy instance is accessed,
 *   the requested key is searched in all provided `targets`, in the order they were provided.
 *
 *   Aside from searching all targets for the desired key, it will also fallback to other data sources
 *   it searches in as well:
 *   1. If any given `target` it is searching is an Element, then it will also search
 *      for the requested key on the element itself.
 *   2. If step #1 has failed, then move to the parent node of the current Element instance, and
 *      repeat the process, starting from step #1.
 *   3. After steps 1-2 are repeated for every given `target` (and all parent nodes of those `targets`... if any),
 *      then this method will finally fallback to searching `globalThis.mythixUI.globalScope` for the requested key.
 *
 *   We aren't quite finished yet though...
 *
 *   If steps 1-3 above all fail, then this method will still fallback to the fallowing hard-coded key/value pairs:
 *   1. A requested key of `'globalScope'` (if not found on a target) will result in `globalThis.mythixUI.globalScope` being returned.
 *   2. A requested key of `'i18n'` (if not found on a target) will result in the built-in `i18n` language term processor being returned.
 *   3. A requested key of `'dynamicPropID'` (if not found on a target) will result in the built-in `dynamicPropID` dynamic property provided. See @see Utils.dynamicPropID;.
 *
 *   Finally, the returned Proxy will also intercept any value [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set) operation,
 *   to set a value on the first target found.
 *
 *   The Proxy also overloads [ownKeys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys) to list **all** keys across **all** `targets`.
 * arguments:
 *   - name: ...targets
 *     dataTypes:
 *       - Object
 *       - Element
 *       - non-primitive
 *     desc: |
 *       The `targets` to be searched, in the order provided. Targets are searched both for get operations, and set operations (the first target found will be the set target).
 * notes:
 *   - |
 *     :warning: Mythix UI will deliberately never directly access `globalThis` from the template engine (for security reasons).
 *     Because of this, Mythix UI automatically provides its own global scope `globalThis.mythixUI.globalScope`.
 *     If you want data to be "globally" visible to Mythix UI, then you need to add your data to this special global scope.
 *   - |
 *     :info: This method is complex because it is intended to be used to provide a "scope" to the Mythix UI templating engine.
 *     The templating engine needs to be DOM aware, and also needs to have access to specialized, scoped data
 *     (i.e. the `mythix-ui-for-each` component will publish scoped data for each iteration, which needs to be both
 *     DOM-aware, and iteration-aware).
 *   - |
 *     :info: Any provided `target` can also be one of these Proxy scopes returned by this method.
 *   - |
 *     :info: It can help to think of the returned "scope" as an plain Object that has an array of prototypes.
 * return: |
 *   @types Proxy; A proxy instance, that is used to get and set keys across multiple `targets`.
 */
function createScope(..._targets) {
  const findPropNameScope = (target, propName) => {
    if (target == null || Object.is(target, NaN))
      return;

    if (propName in target)
      return target;

    if (!(target instanceof Node))
      return;

    const searchParentNodesForKey = (element) => {
      let currentElement = element;
      if (!currentElement)
        return;

      do {
        if (propName in currentElement)
          return currentElement;

        currentElement = getParentNode(currentElement);
      } while (currentElement);
    };

    return searchParentNodesForKey(target);
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
        if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(scope[propName], _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty))
          scope[propName][_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](value);
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

/**
 * groupName: Utils
 * desc: |
 *   Create a context-aware function, or "macro", that can be called and used by the template engine.
 *
 *   If you are ever trying to pass methods or dynamic properties across the DOM, then this is the method you want to use, to
 *   properly "parse" and use the attribute value as intended.
 *
 *   This is used for example for event bindings via attributes. If you have for example an `onclick="doSomething"`
 *   attribute on an element, then this will be used to create a context-aware "macro" for the method "doSomething".
 *
 *   The term "macro" is used here because there are special formats "understood" by the template engine. For example,
 *   prefixing an attribute value with a percent sign, i.e. `name="%globalDynamicPropName"` will use @see Utils.dynamicPropID;
 *   to globally fetch property of this name. This is important, because due to the async nature of the DOM, you might
 *   be requesting a dynamic property that hasn't yet been loaded/defined. This is the purpose of @see Utils.dynamicPropID;,
 *   and this specialized template format: to provide dynamic props by id, that will be available when needed.
 *
 *   The template engine also will happily accept rogue method names. For example, in a Mythix UI component you are building,
 *   you might have an element like `<button onclick="onButtonClick">Click Me!<button>`. The templating engine will detect that
 *   this is ONLY an identifier, and so will search for the specified method in the available "scope" (see @see Utils.createScope;),
 *   which includes `this` instance of your component as the first `target`. This pattern is not required, as you can call your
 *   component method directly yourself, as with any attribute event binding in the DOM, i.e: `<button onclick="this.onButtonClick(event)">Click Me!<button>`.
 *
 *   One last thing to mention is that when these "macro" methods are called by Mythix UI, all enumerable keys of the generated
 *   "scope" (see @see Utils.createScope;) are passed into the macro method as arguments. This means that the keys/values of all scope `targets`
 *   are available directly in your javascript scope. i.e. you can do things like `name="componentInstanceProperty(thisAttribute1, otherAttribute)"` without needing to do
 *   `name="this.componentInstanceProperty(this.thisAttribute1, this.otherAttribute)"`. :warning: It is important to keep in mind that direct reference access like this in a macro
 *   will bypass the "scope" (see @see Utils.createScope;) Proxy, and so if the specified key is not found (passed in as an argument to the macro), then an error will be thrown by javascript.
 *
 *   It is absolutely possible for you to receive and send arguments via these generated "macros". `mythix-ui-search` does this for
 *   example when a "filter" method is passed via an attribute. By default no extra arguments are provided when called directly by the templating engine.
 * arguments:
 *   - name: options
 *     dataType: object
 *     desc: |
 *       An object with the shape `{ body: string; prefix?: string; scope: object; }`.
 *
 *       1. `body` is the actual body of the `new Function`.
 *       2. `scope` is the scope (`this`) that you want to bind to the resulting method.
 *          This would generally be a scope created by @see Utils.createScope;
 *       3. `prefix` an optional prefix for the body of the `new Function`. This prefix is added
 *          before any function body code that Mythix UI generates.
 *          See here @sourceRef _createTemplateMacroPrefixForBindEventToElement; for an example use
 *          of `prefix` (notice how `arguments[1]` is used instead of `arguments[0]`, as `arguments[0]` is always reserved
 *          for local variable names "injected" from the created "scope").
 * notes:
 *   - |
 *     :info: Aside for some behind-the-scene modifications and ease-of-use slickness, this essentially just creates a `new Function` and binds a "scope" (see @see Utils.createScope;) to it.
 *   - |
 *     :info: The provided (and optional) `prefix` can be used as the start of the macro `new Function` body code. i.e. @see Utils.bindEventToElement; does exactly this to allow direct scoped
 *     access to the `event` instance. @sourceRef _createTemplateMacroPrefixForBindEventToElement;
 *   - |
 *     :info: The return method is bound by calling `.bind(scope)`. It is not possible to modify `this` at the call-site.
 * return: |
 *   @types function; A function that is "context aware" by being bound to the provided `scope` (see @see Utils.createScope;).
 */
function createTemplateMacro({ prefix, body, scope }) {
  let functionBody = body;
  if (functionBody.charAt(0) === '%' || EVENT_ACTION_JUST_NAME.test(functionBody)) {
    if (functionBody.charAt(0) === '%') {
      functionBody = `(this.dynamicPropID || globalThis.mythixUI.globalScope.dynamicPropID)('${functionBody.substring(1).trim().replace(/'/g, '\\\'')}')`;
    } else {
      functionBody = `(() => {
        try {
          let ____$ = ${functionBody};
          return (typeof ____$ === 'function') ? ____$.apply(this, Array.from(arguments).slice(1)) : ____$;
        } catch (e) {
          return this.${functionBody.replace(/^\s*this\./, '')}.apply(this, Array.from(arguments).slice(1));
        }
      })();`;
    }
  }

  let contextCallArgs = getContextCallArgs(scope, { '__macroSource': null, '__expandedMacroSource': null });

  functionBody = `try { ${(prefix) ? `${prefix};` : ''}return ${(functionBody || '(void 0)').replace(/^\s*return\s+/, '').trim()}; } catch (error) { console.error(\`Error in macro [\${__macroSource}]:\`, error, __expandedMacroSource); throw error; }`;

  let localScope = Object.create(scope);
  localScope.__macroSource = body;
  localScope.__expandedMacroSource = functionBody;

  return (new Function(contextCallArgs, functionBody)).bind(scope || {}, scope);
}

/**
 * groupName: Utils
 * desc: |
 *   Parse a template, and return its parts. A template "part" is one of two types: `'literal'`, or `'macro'`.
 *
 *   Take for example the following template: `'Hello \@@greeting@@!!!'`. This template would result in three "parts" after parsing:
 *   1. `{ type: 'literal', source: 'Hello ', start: 0, end: 6 }`
 *   2. `{ type: 'macro', source: '\@@greeting@@', macro: <function>, start: 6, end: 18 }`
 *   3. `{ type: 'literal', source: '!!!', start: 18, end: 21 }`
 *
 *   Concatenating all `source` properties together will result in the original input.
 *   Concatenating all `source` properties, along with the result of calling all `macro` functions, will result in the output (i.e. `part[0].source + part[1].macro() + part[2].source`).
 *   The `macro` property is the actual macro function for the parsed template part (i.e. in our example `'\@@greeting@@'`).
 *   `start` and `end` are the offsets from the original `text` where the part can be found.
 * arguments:
 *   - name: text
 *     dataType: string
 *     desc: |
 *       The template string to parse.
 *   - name: options
 *     dataType: object
 *     desc: |
 *       Options for the operation. The shape of this object is `{ prefix?: string, scope: object }`.
 *       `scope` defines the scope for macros created by this method (see @see Utils.createScope;).
 *       `prefix` defines a function body prefix to use while creating macros (see @see Utils.createTemplateMacro;).
 * notes:
 *   - |
 *     :info: To skip parsing a specific template part, prefix with a backslash, i.e. `\\\\@@greeting@@`.
 * return: |
 *   @types Array<TemplatePart>; **TemplatePart**: `{ type: 'literal' | 'macro', source: string, start: number, end: number, macro?: function }`. Return all parsed parts of the template.
 */
function parseTemplateParts(text, _options) {
  let options       = _options || {};
  let parts         = [];
  let currentOffset = 0;

  const addLiteral = (startOffset, endOffset) => {
    let source = text.substring(startOffset, endOffset).replace(/\\@@/g, '@@');
    parts.push({ type: 'literal', source, start: startOffset, end: endOffset });
  };

  text.replace(/(?<!\\)(@@)(.+?)\1/g, (m, _, parsedText, offset) => {
    if (currentOffset < offset)
      addLiteral(currentOffset, offset);

    currentOffset = offset + m.length;

    let macro = createTemplateMacro({ ...options, body: parsedText });
    parts.push({ type: 'macro', source: m, macro, start: offset, end: currentOffset });
  });

  if (currentOffset < text.length)
    addLiteral(currentOffset, text.length);

  return parts;
}

const NOOP = (item) => item;

/**
 * groupName: Utils
 * desc: |
 *   Compile the template parts that were parsed by @see Utils.parseTemplateParts;.
 *
 *   It is also possible to provide this method an array of @see Elements.ElementDefinition; instances,
 *   or @see QueryEngine.QueryEngine; instances (that contain @see Elements.ElementDefinition; instances).
 *   If either of these types are found in the input array (even one), then the entire result is returned
 *   as a raw array.
 *
 *   Or, if any of the resulting parts is **not** a @see Utils.parseTemplateParts?caption=TemplatePart; or a `string`,
 *   then return the resulting value raw.
 *
 *   Otherwise, if all resulting parts are a `string`, then the resulting parts are joined, and a `string` is returned.
 * arguments:
 *   - name: parts
 *     dataTypes:
 *       - Array<TemplatePart>
 *       - Array<ElementDefinition>
 *       - Array<QueryEngine>
 *       - Array<any>
 *     desc: |
 *       The template parts to compile together.
 * return: |
 *   @types Array<any>; @types string; Return the result as a string, or an array of raw values, or a raw value.
 */
function compileTemplateFromParts(parts, callback) {
  let result = parts
    .map((part) => {
      if (!part)
        return part;

      if (part[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE || part[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE)
        return part;

      try {
        if (part.type === 'literal')
          return part.source;
        else if (part.type === 'macro')
          return part.macro();

        return part;
      } catch (e) {
        console.error(e);
        return part.source;
      }
    })
    .map(callback || NOOP)
    .filter((item) => (item != null && item !== ''));

  if (result.some((item) => (item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_DEFINITION_TYPE || item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.QUERY_ENGINE_TYPE)))
    return result;

  if (result.some((item) => _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, '::String')))
    return result.join('');

  return (result.length < 2) ? result[0] : result;
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE

/**
 * groupName: Utils
 * desc: |
 *   Given a Node, take the `.nodeValue` of that node, and if it is a template,
 *   parse that template using @see Utils.parseTemplateParts;, and then
 *   compile that template using @see Utils.compileTemplateFromParts;. The
 *   resulting template parts are then scanned. If any of the `macro()` calls
 *   result in a @see DynamicProperty?caption=DynamicProperty;, then set up
 *   listeners via `addEventListener('update', ...)` on each to listen for
 *   changes to dynamic properties. When a listener updates, the template parts
 *   are recompiled, and the `.nodeValue` is set again with the new result.
 *
 *   In short, this method formats the value of a Node if the value is a template,
 *   and in doing so binds to dynamic properties for future updates to this node.
 *
 *   If the `.nodeValue` of the Node is detected to **not** be a template, then
 *   the result is a no-operation, and the raw value of the Node is simply returned.
 * arguments:
 *   - name: node
 *     dataType: Node
 *     desc: |
 *       The Node whose value should be formatted. This must be a TEXT_NODE or a ATTRIBUTE_NODE.
 * return: |
 *   @types string; The resulting node value. If a template was successfully compiled, dynamic properties
 *   are also listened to for future updates.
 */
function formatNodeValue(node, _options) {
  if (node.parentNode && (/^(style|script)$/).test(node.parentNode.localName))
    return node.nodeValue;

  if (!node || FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
    throw new TypeError('"formatNodeValue" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

  let options       = _options || {};
  let text          = node.nodeValue;
  let templateParts = parseTemplateParts(text, options);

  // templateParts.forEach(({ type, macro }) => {
  //   if (type !== 'macro')
  //     return;

  //   let result = macro();
  //   if (options.bindToDynamicProperties !== false && isType(result, DynamicProperty)) {
  //     result.addEventListener('update', () => {
  //       let result = ('' + compileTemplateFromParts(templateParts));
  //       if (result !== node.nodeValue)
  //         node.nodeValue = result;
  //     }, { capture: true });
  //   }
  // });

  let result = compileTemplateFromParts(templateParts, (result) => {
    if (result && options.bindToDynamicProperties !== false && _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(result, _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty)) {
      result.addEventListener('update', () => {
        let result = ('' + compileTemplateFromParts(templateParts));
        if (result !== node.nodeValue)
          node.nodeValue = result;
      }, { capture: true });
    }

    return result;
  });

  if (result == null)
    result = '';

  return (options.disallowHTML === true) ? ('' + result) : result;
}

const IS_TEMPLATE = /(?<!\\)@@/;
function isTemplate(value) {
  if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(value, '::String'))
    return false;

  return IS_TEMPLATE.test(value);
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = new Map();

function getAllEventNamesForElement(element) {
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

function bindEventToElement(element, eventName, _callback) {
  let options = {};
  let callback;

  if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else {
    callback = _callback;
  }

  if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(callback, '::String'))
    callback = createTemplateMacro({ prefix: 'let event=arguments[1]', body: callback, scope: this }); // @ref:_createTemplateMacroPrefixForBindEventToElement

  element.addEventListener(eventName, callback, options);

  return { callback, options };
}

function fetchPath(obj, key, defaultValue) {
  if (obj == null || Object.is(obj, NaN) || Object.is(obj, Infinity) || Object.is(obj, -Infinity))
    return defaultValue;

  if (key == null || Object.is(key, NaN) || Object.is(key, Infinity) || Object.is(key, -Infinity))
    return defaultValue;

  let parts         = key.split(/(?<!\\)\./g).filter(Boolean);
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

const CACHED_PROPERTY_NAMES = new WeakMap();
const SKIP_PROTOTYPES       = [
  globalThis.HTMLElement,
  globalThis.Node,
  globalThis.Element,
  globalThis.Object,
  globalThis.Array,
];

function getAllPropertyNames(_obj) {
  if (!_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isCollectable(_obj))
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
function getDynamicPropertyForPath(keyPath, defaultValue) {
  let instanceCache = LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.get(this);
  if (!instanceCache) {
    instanceCache = new Map();
    LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.set(this, instanceCache);
  }

  let property = instanceCache.get(keyPath);
  if (!property) {
    property = new _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty(defaultValue);
    instanceCache.set(keyPath, property);
  }

  return property;
}

function specialClosest(node, selector) {
  if (!node || !selector)
    return;

  let currentNode = node;
  while (currentNode && (typeof currentNode.matches !== 'function' || !currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return currentNode;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 0);
  });
}

function defineDynamicProp(name, defaultValue, setter) {
  let dynamicProperty = new _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty(defaultValue);

  Object.defineProperties(this, {
    [name]: {
      enumerable:   true,
      configurable: true,
      get:          () => dynamicProperty,
      set:          (newValue) => {
        if (typeof setter === 'function')
          dynamicProperty[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](setter(newValue));
        else
          dynamicProperty[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](newValue);
      },
    },
  });

  return dynamicProperty;
}

const DYNAMIC_PROP_REGISTRY = new Map();
function dynamicPropID(id, setValue) {
  let prop = DYNAMIC_PROP_REGISTRY.get(id);
  if (prop) {
    if (arguments.length > 1)
      prop[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](setValue);

    return prop;
  }

  prop = new _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty((arguments.length > 1) ? setValue : '');
  DYNAMIC_PROP_REGISTRY.set(id, prop);

  return prop;
}

function globalStoreNameValuePairHelper(target, name, value) {
  metadata(
    target,
    _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_NAME_VALUE_PAIR_HELPER,
    [ name, value ],
  );

  return target;
}

const REGISTERED_DISABLE_TEMPLATE_SELECTORS = new Set([ '[data-templates-disable]', 'mythix-for-each' ]);
function getDisableTemplateEngineSelector() {
  return Array.from(REGISTERED_DISABLE_TEMPLATE_SELECTORS).join(',');
}

function registerDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.add(selector);
}

function unregisterDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.delete(selector);
}

function globalStoreHelper(dynamic, args) {
  if (args.length === 0)
    return;

  const setOnGlobal = (name, value) => {
    let currentValue = globalThis.mythixUI.globalScope[name];
    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(currentValue, _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty)) {
      globalThis.mythixUI.globalScope[name][_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](value);
      return currentValue;
    }

    if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(value, _dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty)) {
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => value,
          set:          (newValue) => {
            value[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](newValue);
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
            prop[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](newValue);
          },
        },
      });

      prop[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_2__.DynamicProperty.set](value);

      return prop;
    } else {
      globalThis.mythixUI.globalScope[name] = value;
      return value;
    }
  };

  let nameValuePair = (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isCollectable(args[0])) ? metadata(
    args[0],                        // context
    _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_NAME_VALUE_PAIR_HELPER,  // special key
  ) : null; // @ref:_mythixNameValuePairHelperUsage

  if (nameValuePair) {
    let [ name, value ] = nameValuePair;
    setOnGlobal(name, value);
  } else if (args.length > 1 && _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(args[0], '::String')) {
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

function globalStore(...args) {
  return globalStoreHelper.call(this, false, args);
}

function globalStoreDynamic(...args) {
  return globalStoreHelper.call(this, true, args);
}

class StorageItem {
  constructor(value) {
    this._c = Date.now();
    this._u = Date.now();
    this._v = value;
  }

  getValue() {
    return this._v;
  }

  setValue(value) {
    this._u = Date.now();
    this._v = value;
  }

  toJSON() {
    return {
      $type:  'StorageItem',
      _c:     this._c,
      _u:     this._u,
      _v:     this._v,
    };
  }
}

class Storage {
  _revive(data, _alreadyVisited) {
    if (!data || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive(data))
      return data;

    let alreadyVisited  = _alreadyVisited || new Set();
    let type            = (data && data.$type);

    if (type) {
      if (type === 'StorageItem') {
        let value = data._v;

        return Object.assign(new StorageItem(), {
          _c: data._c,
          _u: data._u,
          _v: (value && !_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive(value)) ? this._revive(value, alreadyVisited) : value,
        });
      }
    }

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive(value))
        continue;

      if (alreadyVisited.has(value))
        continue;

      alreadyVisited.add(value);
      data[key] = this._revive(value, alreadyVisited);
    }

    return data;
  }

  _raw(data, _alreadyVisited) {
    if (!data || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive(data))
      return data;

    let alreadyVisited = _alreadyVisited || new Set();
    if (data instanceof StorageItem)
      return this._raw(data.getValue(), alreadyVisited);

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive(value))
        continue;

      if (alreadyVisited.has(value))
        continue;

      alreadyVisited.add(value);
      data[key] = this._raw(value, alreadyVisited);
    }

    return data;
  }

  _getPartsForOperation(type, parts) {
    let pathParts   = (type === 'set') ? parts.slice(0, -1) : parts.slice();
    let path        = pathParts.map((part) => ((typeof part === 'symbol') ? part.toString() : ('' + part)).replace(/\./g, '\\.')).join('.');
    let parsedParts = path.split(/(?<!\\)\./g);
    let storageType = parsedParts[0];
    let data        = (type === 'set') ? parts[parts.length - 1] : undefined;

    // localStorage, or sessionStorage
    let storageEngine = globalThis[storageType];
    if (!storageEngine)
      return;

    let rootData    = {};
    let encodedBase = storageEngine.getItem('mythix-ui');
    if (encodedBase)
      rootData = this._revive(JSON.parse(encodedBase));

    return {
      pathParts,
      path,
      parsedParts,
      storageType,
      data,
      storageEngine,
      encodedBase,
      rootData,
    };
  }

  _getMeta(type, parts) {
    let operation = this._getPartsForOperation(type, parts);
    let {
      parsedParts,
      rootData,
    } = operation;

    let scope        = rootData;
    let parentScope  = null;

    for (let i = 1, il = parsedParts.length; i < il; i++) {
      if (scope instanceof StorageItem) {
        scope = scope.getValue();
        if (!scope)
          break;
      }

      let part = parsedParts[i];
      let subScope = (scope) ? scope[part] : scope;
      if (type === 'set' && !subScope)
        subScope = scope[part] = {};

      if (subScope == null || Object.is(subScope, NaN) || Object.is(subScope, -Infinity) || Object.is(subScope, Infinity))
        break;

      parentScope = scope;
      scope = subScope;
    }

    return {
      operation,
      parentScope,
      scope,
    };
  }

  getMeta(...parts) {
    return this._getMeta('get', parts);
  }

  get(...parts) {
    let { scope } = this._getMeta('get', parts);
    return this._raw(scope);
  }

  set(...parts) {
    let {
      operation,
      parentScope,
      scope,
    } = this._getMeta('set', parts);

    let {
      data,
      parsedParts,
      path,
      rootData,
      storageEngine,
    } = operation;

    if (data === undefined) {
      // Delete
      if (parentScope)
        delete parentScope[parsedParts[parsedParts.length - 1]];
      else
        delete scope[parsedParts[parsedParts.length - 1]];
    } else {
      if (parentScope)
        parentScope[parsedParts[parsedParts.length - 1]] = new StorageItem(data);
      else
        scope[parsedParts[parsedParts.length - 1]] = new StorageItem(data);
    }

    storageEngine.setItem('mythix-ui', JSON.stringify(rootData));

    return path;
  }

}

const storage = new Storage();


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseUtils: () => (/* reexport module object */ _base_utils_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   ComponentUtils: () => (/* reexport module object */ _component_utils_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   DynamicProperty: () => (/* reexport safe */ _dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__.DynamicProperty),
/* harmony export */   Elements: () => (/* reexport module object */ _elements_js__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   MythixElements: () => (/* binding */ MythixElements),
/* harmony export */   MythixUIComponent: () => (/* reexport safe */ _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_5__.QueryEngine),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   isMythixComponent: () => (/* reexport safe */ _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.isMythixComponent)
/* harmony export */ });
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component-utils.js */ "./lib/component-utils.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mythix-ui-component.js */ "./lib/mythix-ui-component.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mythix-ui-language-provider.js */ "./lib/mythix-ui-language-provider.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
/* harmony import */ var _mythix_ui_dynamic_style_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./mythix-ui-dynamic-style.js */ "./lib/mythix-ui-dynamic-style.js");
globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});

if (typeof document !== 'undefined' && !globalThis.mythixUI.globalScope.url)
  globalThis.mythixUI.globalScope.url = new URL(document.location);


























const MythixElements = {
  MythixUIRequire: _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_7__.MythixUIRequire,
  MythixUILanguagePack: _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_8__.MythixUILanguagePack,
  MythixUILanguageProvider: _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_8__.MythixUILanguageProvider,
  MythixUISpinner: _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_9__.MythixUISpinner,
  MythixUIDynamicStyle: _mythix_ui_dynamic_style_js__WEBPACK_IMPORTED_MODULE_10__.MythixUIDynamicStyle,
};



let _mythixIsReady = false;
Object.defineProperties(globalThis, {
  'onmythixready': {
    enumerable:   false,
    configurable: true,
    get:          () => {
      return null;
    },
    set:          (callback) => {
      if (_mythixIsReady) {
        Promise.resolve().then(() => callback(new Event('mythix-ready')));
        return;
      }

      document.addEventListener('mythix-ready', callback);
    },
  },
});

globalThis.mythixUI.BaseUtils = _base_utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.ComponentUtils = _component_utils_js__WEBPACK_IMPORTED_MODULE_2__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_3__;
globalThis.mythixUI.globalScope.globalStore = _utils_js__WEBPACK_IMPORTED_MODULE_1__.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = _utils_js__WEBPACK_IMPORTED_MODULE_1__.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_1__.dynamicPropID(id);
};

class MythixConnectedEvent extends CustomEvent {
  constructor() {
    super('mythix-connected');
  }
}

class MythixDisconnectedEvent extends CustomEvent {
  constructor() {
    super('mythix-disconnected');
  }
}

if (typeof document !== 'undefined') {
  let didVisibilityObservers = false;

  const onDocumentReady = () => {
    if (!didVisibilityObservers) {
      let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
      _component_utils_js__WEBPACK_IMPORTED_MODULE_2__.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        disconnect();

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        _component_utils_js__WEBPACK_IMPORTED_MODULE_2__.loadPartialIntoElement.call(element, src).then(() => {
          element.classList.add('mythix-ready');
        });
      }, { elements });

      didVisibilityObservers = true;
    }

    document.body.classList.add('mythix-ready');

    if (_mythixIsReady)
      return;

    _mythixIsReady = true;

    document.dispatchEvent(new Event('mythix-ready'));
  };

  Object.defineProperties(globalThis, {
    '$': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelector(...args),
    },
    '$$': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelectorAll(...args),
    },
  });

  let documentMutationObserver = globalThis.mythixUI.documentMutationObserver = new MutationObserver((mutations) => {
    let disableTemplateEngineSelectorStr = _utils_js__WEBPACK_IMPORTED_MODULE_1__.getDisableTemplateEngineSelector();
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation  = mutations[i];
      let target    = mutation.target;

      if (mutation.type === 'attributes') {
        if (disableTemplateEngineSelectorStr && target.parentNode && typeof target.parentNode.closest === 'function' && target.parentNode.closest(disableTemplateEngineSelectorStr))
          continue;

        let attributeNode = target.getAttributeNode(mutation.attributeName);
        let newValue      = (attributeNode) ? attributeNode.nodeValue : null;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && _utils_js__WEBPACK_IMPORTED_MODULE_1__.isTemplate(newValue))
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_1__.formatNodeValue(attributeNode, { scope: _utils_js__WEBPACK_IMPORTED_MODULE_1__.createScope(target), disallowHTML: true });

        let observedAttributes = target.constructor.observedAttributes;
        if (observedAttributes && observedAttributes.indexOf(mutation.attributeName) < 0) {
          if (target[_mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent.isMythixComponent])
            target.attributeChangedCallback.call(target, mutation.attributeName, oldValue, newValue);
        }
      } else if (mutation.type === 'childList') {
        let disableTemplating = (disableTemplateEngineSelectorStr && target && typeof target.closest === 'function' && target.closest('[data-templates-disable],mythix-for-each'));
        let addedNodes        = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          if (node[_mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent.isMythixComponent] && node.onMutationAdded.call(node, mutation) === false)
            continue;

          if (!disableTemplating)
            _elements_js__WEBPACK_IMPORTED_MODULE_3__.processElements(node);

          if (typeof node.dispatchEvent === 'function') {
            let connectedEvent = new MythixConnectedEvent();
            node.dispatchEvent(connectedEvent);
          }

          if (target[_mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[_mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

          if (typeof node.dispatchEvent === 'function') {
            let disconnectedEvent = new MythixDisconnectedEvent();
            node.dispatchEvent(disconnectedEvent);
          }

          if (target[_mythix_ui_component_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIComponent.isMythixComponent])
            target.onMutationChildRemoved(node, mutation);
        }
      }
    }
  });

  documentMutationObserver.observe(document, {
    subtree:            true,
    childList:          true,
    attributes:         true,
    attributeOldValue:  true,
  });

  _elements_js__WEBPACK_IMPORTED_MODULE_3__.processElements(document.head);
  _elements_js__WEBPACK_IMPORTED_MODULE_3__.processElements(document.body);

  const DOCUMENT_CHECK_READY_TIME = 250;

  setTimeout(() => {
    if (document.readyState === 'complete')
      onDocumentReady();
    else
      document.addEventListener('DOMContentLoaded', onDocumentReady);
  }, DOCUMENT_CHECK_READY_TIME);

  window.addEventListener('load', onDocumentReady);
}

})();

var __webpack_exports__BaseUtils = __webpack_exports__.BaseUtils;
var __webpack_exports__ComponentUtils = __webpack_exports__.ComponentUtils;
var __webpack_exports__DynamicProperty = __webpack_exports__.DynamicProperty;
var __webpack_exports__Elements = __webpack_exports__.Elements;
var __webpack_exports__MythixElements = __webpack_exports__.MythixElements;
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
var __webpack_exports__isMythixComponent = __webpack_exports__.isMythixComponent;
export { __webpack_exports__BaseUtils as BaseUtils, __webpack_exports__ComponentUtils as ComponentUtils, __webpack_exports__DynamicProperty as DynamicProperty, __webpack_exports__Elements as Elements, __webpack_exports__MythixElements as MythixElements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils, __webpack_exports__isMythixComponent as isMythixComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFLElBQUk7QUFDTjs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwSXFDOztBQUVyQyxnREFBZ0Q7O0FBSTlDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVksMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUEsY0FBYyxXQUFXLEVBQUUsMkNBQTJDO0FBQ3RFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDLG1DQUFtQyxhQUFhLDRFQUE0RSxLQUFLO0FBQ2pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7O0FBRTdDO0FBQ0EseUJBQXlCLFdBQVc7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7O0FBRUEsZ0JBQWdCLGlDQUFpQyxFQUFFLHNCQUFzQjtBQUN6RTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsZ0JBQWdCLGtCQUFrQjs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q3BDOztBQUVBO0FBQ0EsWUFBWSx5REFBd0I7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixzRUFBaUI7QUFDdEM7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRCxRQUFRO0FBQzFEO0FBQ0EsbUJBQW1CLHNFQUFpQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsc0VBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxFQUFFLHlEQUF3QjtBQUMxQixFQUFFLHlEQUF3Qjs7QUFFMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbm9kZV9tb2R1bGVzL2RlZXBtZXJnZS9kaXN0L2Nqcy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9iYXNlLXV0aWxzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2NvbXBvbmVudC11dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZHluYW1pYy1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktY29tcG9uZW50LmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1keW5hbWljLXN0eWxlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1sYW5ndWFnZS1wcm92aWRlci5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktcmVxdWlyZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktc3Bpbm5lci5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9xdWVyeS1lbmdpbmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvc2hhMjU2LmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3V0aWxzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNNZXJnZWFibGVPYmplY3QgPSBmdW5jdGlvbiBpc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gaXNOb25OdWxsT2JqZWN0KHZhbHVlKVxuXHRcdCYmICFpc1NwZWNpYWwodmFsdWUpXG59O1xuXG5mdW5jdGlvbiBpc05vbk51bGxPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xufVxuXG5mdW5jdGlvbiBpc1NwZWNpYWwodmFsdWUpIHtcblx0dmFyIHN0cmluZ1ZhbHVlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcblxuXHRyZXR1cm4gc3RyaW5nVmFsdWUgPT09ICdbb2JqZWN0IFJlZ0V4cF0nXG5cdFx0fHwgc3RyaW5nVmFsdWUgPT09ICdbb2JqZWN0IERhdGVdJ1xuXHRcdHx8IGlzUmVhY3RFbGVtZW50KHZhbHVlKVxufVxuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvYjVhYzk2M2ZiNzkxZDEyOThlN2YzOTYyMzYzODNiYzk1NWY5MTZjMS9zcmMvaXNvbW9ycGhpYy9jbGFzc2ljL2VsZW1lbnQvUmVhY3RFbGVtZW50LmpzI0wyMS1MMjVcbnZhciBjYW5Vc2VTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gY2FuVXNlU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xuXG5mdW5jdGlvbiBpc1JlYWN0RWxlbWVudCh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRVxufVxuXG5mdW5jdGlvbiBlbXB0eVRhcmdldCh2YWwpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IFtdIDoge31cbn1cblxuZnVuY3Rpb24gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodmFsdWUsIG9wdGlvbnMpIHtcblx0cmV0dXJuIChvcHRpb25zLmNsb25lICE9PSBmYWxzZSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSlcblx0XHQ/IGRlZXBtZXJnZShlbXB0eVRhcmdldCh2YWx1ZSksIHZhbHVlLCBvcHRpb25zKVxuXHRcdDogdmFsdWVcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0cmV0dXJuIHRhcmdldC5jb25jYXQoc291cmNlKS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChlbGVtZW50LCBvcHRpb25zKVxuXHR9KVxufVxuXG5mdW5jdGlvbiBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykge1xuXHRpZiAoIW9wdGlvbnMuY3VzdG9tTWVyZ2UpIHtcblx0XHRyZXR1cm4gZGVlcG1lcmdlXG5cdH1cblx0dmFyIGN1c3RvbU1lcmdlID0gb3B0aW9ucy5jdXN0b21NZXJnZShrZXkpO1xuXHRyZXR1cm4gdHlwZW9mIGN1c3RvbU1lcmdlID09PSAnZnVuY3Rpb24nID8gY3VzdG9tTWVyZ2UgOiBkZWVwbWVyZ2Vcbn1cblxuZnVuY3Rpb24gZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpIHtcblx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNcblx0XHQ/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KS5maWx0ZXIoZnVuY3Rpb24oc3ltYm9sKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGFyZ2V0LCBzeW1ib2wpXG5cdFx0fSlcblx0XHQ6IFtdXG59XG5cbmZ1bmN0aW9uIGdldEtleXModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXQpLmNvbmNhdChnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpXG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5SXNPbk9iamVjdChvYmplY3QsIHByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHByb3BlcnR5IGluIG9iamVjdFxuXHR9IGNhdGNoKF8pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxufVxuXG4vLyBQcm90ZWN0cyBmcm9tIHByb3RvdHlwZSBwb2lzb25pbmcgYW5kIHVuZXhwZWN0ZWQgbWVyZ2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuXHRyZXR1cm4gcHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAvLyBQcm9wZXJ0aWVzIGFyZSBzYWZlIHRvIG1lcmdlIGlmIHRoZXkgZG9uJ3QgZXhpc3QgaW4gdGhlIHRhcmdldCB5ZXQsXG5cdFx0JiYgIShPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkgLy8gdW5zYWZlIGlmIHRoZXkgZXhpc3QgdXAgdGhlIHByb3RvdHlwZSBjaGFpbixcblx0XHRcdCYmIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwga2V5KSkgLy8gYW5kIGFsc28gdW5zYWZlIGlmIHRoZXkncmUgbm9uZW51bWVyYWJsZS5cbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0ge307XG5cdGlmIChvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHRhcmdldCkpIHtcblx0XHRnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0Z2V0S2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXJyYXlNZXJnZSA9IG9wdGlvbnMuYXJyYXlNZXJnZSB8fCBkZWZhdWx0QXJyYXlNZXJnZTtcblx0b3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCA9IG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgfHwgaXNNZXJnZWFibGVPYmplY3Q7XG5cdC8vIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkIGlzIGFkZGVkIHRvIGBvcHRpb25zYCBzbyB0aGF0IGN1c3RvbSBhcnJheU1lcmdlKClcblx0Ly8gaW1wbGVtZW50YXRpb25zIGNhbiB1c2UgaXQuIFRoZSBjYWxsZXIgbWF5IG5vdCByZXBsYWNlIGl0LlxuXHRvcHRpb25zLmNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQ7XG5cblx0dmFyIHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSk7XG5cdHZhciB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xuXHR2YXIgc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCA9IHNvdXJjZUlzQXJyYXkgPT09IHRhcmdldElzQXJyYXk7XG5cblx0aWYgKCFzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoKSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIGlmIChzb3VyY2VJc0FycmF5KSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH1cbn1cblxuZGVlcG1lcmdlLmFsbCA9IGZ1bmN0aW9uIGRlZXBtZXJnZUFsbChhcnJheSwgb3B0aW9ucykge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgYW4gYXJyYXknKVxuXHR9XG5cblx0cmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBuZXh0KSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZShwcmV2LCBuZXh0LCBvcHRpb25zKVxuXHR9LCB7fSlcbn07XG5cbnZhciBkZWVwbWVyZ2VfMSA9IGRlZXBtZXJnZTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWVwbWVyZ2VfMTtcbiIsImltcG9ydCB7IFNIQTI1NiB9IGZyb20gJy4vc2hhMjU2LmpzJztcblxuZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcblxuZXhwb3J0IHtcbiAgU0hBMjU2LFxufTtcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IEJhc2VVdGlsc1xuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgYGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgTWlzYyB1dGlsaXR5IGZ1bmN0aW9ucyBhbmQgZ2xvYmFsIGNvbnN0YW50cyBhcmUgZm91bmQgd2l0aGluIHRoaXMgbmFtZXNwYWNlLlxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5jb25zdCBJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUUgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pZC1jb3VudGVyLWN1cnJlbnQtdmFsdWUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbmxldCBpZENvdW50ZXIgPSAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdsb2JhbFRoaXMubXl0aGl4VUksIElEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRSkpID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUVdIDogMG47XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2VuZXJhdGUgYSBwYXJ0aWFsbHkgcmFuZG9tIHVuaXF1ZSBJRC4gVGhlIGlkIGdlbmVyYXRlZCB3aWxsIGJlIGEgYERhdGUubm93KClgXG4gKiAgIHZhbHVlIHdpdGggYW4gaW5jcmVtZW50aW5nIEJpZ0ludCBwb3N0Zml4ZWQgdG8gaXQuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgQSB1bmlxdWUgSUQuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKCdJRDogJywgQmFzZVV0aWxzLmdlbmVyYXRlSUQoKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICdJRDE3MDQxNDMwMjcxNzkwMDAwMDAwMDAwMDAwMDAwMDA3J1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcbiAgaWRDb3VudGVyICs9IEJpZ0ludCgxKTtcbiAgZ2xvYmFsVGhpcy5teXRoaXhVSVtJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUVdID0gaWRDb3VudGVyO1xuXG4gIHJldHVybiBgSUQke0RhdGUubm93KCl9JHtwYWQoaWRDb3VudGVyLnRvU3RyaW5nKCksIElEX0NPVU5UX0xFTkdUSCl9YDtcbn1cblxuY29uc3QgT0JKRUNUX0lEX1NUT1JBR0UgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL29iamVjdC1pZC1zdG9yYWdlJyk7XG5jb25zdCBPQkpFQ1RfSURfV0VBS01BUCA9IGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdID0gKGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdKSA/IGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdIDogbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBHZXQgYSB1bmlxdWUgSUQgZm9yIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqXG4gKiAgIFVuaXF1ZSBJRHMgYXJlIGdlbmVyYXRlZCB2aWEgQHNlZSBCYXNlVXRpbHMuZ2VuZXJhdGVJRDsuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogQW55IGdhcmJhZ2UtY29sbGVjdGFibGUgcmVmZXJlbmNlLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IEEgdW5pcXVlIElEIGZvciB0aGlzIHJlZmVyZW5jZSAoYXMgYSBTSEEyNTYgaGFzaCkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKEJhc2VVdGlscy5nZXRPYmplY3RJRChkaXZFbGVtZW50KSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICcxNzA0MTQzMDI3MTc5MDAwMDAwMDAwMDAwMDAwMDAwNydcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9iamVjdElEKHZhbHVlKSB7XG4gIGxldCBpZCA9IE9CSkVDVF9JRF9XRUFLTUFQLmdldCh2YWx1ZSk7XG4gIGlmIChpZCA9PSBudWxsKSB7XG4gICAgbGV0IHRoaXNJRCA9IGdlbmVyYXRlSUQoKTtcblxuICAgIE9CSkVDVF9JRF9XRUFLTUFQLnNldCh2YWx1ZSwgdGhpc0lEKTtcblxuICAgIHJldHVybiB0aGlzSUQ7XG4gIH1cblxuICByZXR1cm4gaWQ7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ3JlYXRlIGFuIHVucmVzb2x2ZWQgc3BlY2lhbGl6ZWQgUHJvbWlzZSBpbnN0YW5jZSwgd2l0aCB0aGUgaW50ZW50IHRoYXQgaXQgd2lsbCBiZVxuICogICByZXNvbHZlZCBsYXRlci5cbiAqXG4gKiAgIFRoZSBQcm9taXNlIGluc3RhbmNlIGlzIHNwZWNpYWxpemVkIGJlY2F1c2UgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGFyZSBpbmplY3RlZCBpbnRvIGl0OlxuICogICAxLiBgcmVzb2x2ZShyZXN1bHRWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlc29sdmVzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gKiAgIDIuIGByZWplY3QoZXJyb3JWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlamVjdHMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAqICAgMy4gYHN0YXR1cygpYCAtIFdoZW4gY2FsbGVkLCB3aWxsIHJldHVybiB0aGUgZnVsZmlsbG1lbnQgc3RhdHVzIG9mIHRoZSBwcm9taXNlLCBhcyBhIGBzdHJpbmdgLCBvbmUgb2Y6IGBcInBlbmRpbmdcIiwgXCJmdWxmaWxsZWRcImAsIG9yIGBcInJlamVjdGVkXCJgXG4gKiAgIDQuIGBpZDxzdHJpbmc+YCAtIEEgcmFuZG9tbHkgZ2VuZXJhdGVkIElEIGZvciB0aGlzIHByb21pc2VcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgUHJvbWlzZTsgQW4gdW5yZXNvbHZlZCBQcm9taXNlIHRoYXQgY2FuIGJlIHJlc29sdmVkIG9yIHJlamVjdGVkIGJ5IGNhbGxpbmcgYHByb21pc2UucmVzb2x2ZShyZXN1bHQpYCBvciBgcHJvbWlzZS5yZWplY3QoZXJyb3IpYCByZXNwZWN0aXZlbHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXNvbHZhYmxlKCkge1xuICBsZXQgc3RhdHVzID0gJ3BlbmRpbmcnO1xuICBsZXQgcmVzb2x2ZTtcbiAgbGV0IHJlamVjdDtcblxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChfcmVzb2x2ZSwgX3JlamVjdCkgPT4ge1xuICAgIHJlc29sdmUgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAnZnVsZmlsbGVkJztcbiAgICAgICAgX3Jlc29sdmUodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgcmVqZWN0ID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ3JlamVjdGVkJztcbiAgICAgICAgX3JlamVjdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb21pc2UsIHtcbiAgICAncmVzb2x2ZSc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVzb2x2ZSxcbiAgICB9LFxuICAgICdyZWplY3QnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlamVjdCxcbiAgICB9LFxuICAgICdzdGF0dXMnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgICgpID0+IHN0YXR1cyxcbiAgICB9LFxuICAgICdpZCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgZ2VuZXJhdGVJRCgpLFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGhlbHBlci4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZSBhIG1vcmUgcm9idXN0IHJlcGxhY2VtZW50IGZvciB0aGUgYHR5cGVvZmAgb3BlcmF0b3IuXG4gKlxuICogICBUaGlzIG1ldGhvZCBhbHdheXMgcmV0dXJucyBhIG5hbWUgKGFzIGEgYHN0cmluZ2AgdHlwZSkgb2YgdGhlIHVuZGVybHlpbmcgZGF0YXR5cGUuXG4gKiAgIFRoZSBcImRhdGF0eXBlXCIgaXMgYSBsaXR0bGUgbG9vc2UgZm9yIHByaW1pdGl2ZSB0eXBlcy4gRm9yIGV4YW1wbGUsIGFcbiAqICAgcHJpbWl0aXZlIGB0eXBlb2YgeCA9PT0gJ251bWJlcidgIHR5cGUgaXMgcmV0dXJuZWQgYXMgaXRzIGNvcnJlc3BvbmRpbmcgT2JqZWN0IChjbGFzcykgdHlwZSBgJ051bWJlcidgLiBGb3IgYGJvb2xlYW5gIGl0IHdpbGwgaW5zdGVhZFxuICogICByZXR1cm4gYCdCb29sZWFuJ2AsIGFuZCBmb3IgYCdzdHJpbmcnYCwgaXQgd2lsbCBpbnN0ZWFkIHJldHVybiBgJ1N0cmluZydgLiBUaGlzIGlzIHRydWUgb2YgYWxsIHVuZGVybHlpbmcgcHJpbWl0aXZlIHR5cGVzLlxuICpcbiAqICAgRm9yIGludGVybmFsIGRhdGF0eXBlcywgaXQgd2lsbCByZXR1cm4gdGhlIHJlYWwgY2xhc3MgbmFtZSBwcmVmaXhlZCBieSB0d28gY29sb25zLlxuICogICBGb3IgZXhhbXBsZSwgYHR5cGVPZihuZXcgTWFwKCkpYCB3aWxsIHJldHVybiBgJzo6TWFwJ2AuXG4gKlxuICogICBOb24taW50ZXJuYWwgdHlwZXMgd2lsbCBub3QgYmUgcHJlZml4ZWQsIGFsbG93aW5nIGN1c3RvbSB0eXBlcyB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgaW50ZXJuYWwgdHlwZXMgdG8gYWxzbyBiZSBkZXRlY3RlZC5cbiAqICAgRm9yIGV4YW1wbGUsIGBjbGFzcyBUZXN0IHt9OyB0eXBlT2YobmV3IFRlc3QoKSlgIHdpbGwgcmVzdWx0IGluIHRoZSBub24tcHJlZml4ZWQgcmVzdWx0IGAnVGVzdCdgLlxuICpcbiAqICAgRm9yIHJhdyBgZnVuY3Rpb25gIHR5cGVzLCBgdHlwZU9mYCB3aWxsIGNoZWNrIGlmIHRoZXkgYXJlIGEgY29uc3RydWN0b3Igb3Igbm90LiBJZiBhIGNvbnN0cnVjdG9yIGlzIGRldGVjdGVkLCB0aGVuXG4gKiAgIHRoZSBmb3JtYXQgYCdbQ2xhc3MgJHtuYW1lfV0nYCB3aWxsIGJlIHJldHVybmVkIGFzIHRoZSB0eXBlLiBGb3IgaW50ZXJuYWwgdHlwZXMgdGhlIG5hbWUgd2lsbFxuICogICBiZSBwcmVmaXhlZCwgaS5lLiBgW0NsYXNzIDo6JHtpbnRlcm5hbE5hbWV9XWAsIGFuZCBmb3Igbm9uLWludGVybmFsIHR5cGVzIHdpbGwgaW5zdGVhZCBiZSBub24tcHJlZml4ZWQsIGkuZS4gYFtDbGFzcyAke25hbWV9XWAgLlxuICogICBGb3IgZXhhbXBsZSwgYHR5cGVPZihNYXApYCB3aWxsIHJldHVybiBgJ1tDbGFzcyA6Ok1hcF0nYCwgd2hlcmVhcyBgdHlwZU9mKFRlc3QpYCB3aWxsIHJlc3VsdCBpbiBgJ1tDbGFzcyBUZXN0XSdgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFRoZSB2YWx1ZSB3aG9zZSB0eXBlIHlvdSB3aXNoIHRvIGRpc2NvdmVyLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBuYW1lIG9mIHRoZSBwcm92aWRlZCB0eXBlLCBvciBhbiBlbXB0eSBzdHJpbmcgYCcnYCBpZiB0aGUgcHJvdmlkZWQgdmFsdWUgaGFzIG5vIHR5cGUuXG4gKiBub3RlczpcbiAqICAgLSBUaGlzIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGEgW1N5bWJvbC50b1N0cmluZ1RhZ10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3ltYm9sL3RvU3RyaW5nVGFnKVxuICogICAgIGtleSBvbiB0aGUgdmFsdWUgcHJvdmlkZWQuLi4gYW5kIGlmIGZvdW5kLCB3aWxsIHVzZSBpdCB0byBhc3Npc3Qgd2l0aCBmaW5kaW5nIHRoZSBjb3JyZWN0IHR5cGUgbmFtZS5cbiAqICAgLSBJZiB0aGUgYHZhbHVlYCBwcm92aWRlZCBpcyB0eXBlLWxlc3MsIGkuZS4gYHVuZGVmaW5lZGAsIGBudWxsYCwgb3IgYE5hTmAsIHRoZW4gYW4gZW1wdHkgdHlwZSBgJydgIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiAgIC0gVXNlIHRoZSBgdHlwZW9mYCBvcGVyYXRvciBpZiB5b3Ugd2FudCB0byBkZXRlY3QgaWYgYSB0eXBlIGlzIHByaW1pdGl2ZSBvciBub3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiAnJztcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiAnOjpOdW1iZXInO1xuXG4gIGxldCB0aGlzVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHRoaXNUeXBlID09PSAnYmlnaW50JylcbiAgICByZXR1cm4gJzo6QmlnSW50JztcblxuICBpZiAodGhpc1R5cGUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiAnOjpTeW1ib2wnO1xuXG4gIGlmICh0aGlzVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodGhpc1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodmFsdWUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICAgIHJldHVybiBgW0NsYXNzIDo6JHtuYXRpdmVUeXBlTWV0YVswXX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIElTX0NMQVNTLnRlc3QoJycgKyB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IpKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke3ZhbHVlLm5hbWV9XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgIHJldHVybiBgW0NsYXNzICR7cmVzdWx0fV1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBgOjoke3RoaXNUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7dGhpc1R5cGUuc3Vic3RyaW5nKDEpfWA7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgcmV0dXJuICc6OkFycmF5JztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpXG4gICAgcmV0dXJuICc6OlN0cmluZyc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgIHJldHVybiAnOjpOdW1iZXInO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgcmV0dXJuICc6OkJvb2xlYW4nO1xuXG4gIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAodHlwZU1ldGFbMF0gIT09ICdPYmplY3QnICYmIHZhbHVlIGluc3RhbmNlb2YgdHlwZU1ldGFbMV0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgcmV0dXJuIGA6OiR7bmF0aXZlVHlwZU1ldGFbMF19YDtcblxuICBpZiAodHlwZW9mIE1hdGggIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBNYXRoKVxuICAgIHJldHVybiAnOjpNYXRoJztcblxuICBpZiAodHlwZW9mIEpTT04gIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBKU09OKVxuICAgIHJldHVybiAnOjpKU09OJztcblxuICBpZiAodHlwZW9mIEF0b21pY3MgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBBdG9taWNzKVxuICAgIHJldHVybiAnOjpBdG9taWNzJztcblxuICBpZiAodHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBSZWZsZWN0KVxuICAgIHJldHVybiAnOjpSZWZsZWN0JztcblxuICBpZiAodmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSlcbiAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10oKSA6IHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ107XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgIHJldHVybiAnOjpPYmplY3QnO1xuXG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGhlbHBlci4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZSBhIG1vcmUgcm9idXN0IHJlcGxhY2VtZW50IGZvciB0aGUgYGluc3RhbmNlb2ZgIG9wZXJhdG9yLlxuICpcbiAqICAgVGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYHRydWVgIGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzICphbnkqIG9mIHRoZSBwcm92aWRlZCBgdHlwZXNgLlxuICpcbiAqICAgVGhlIHByb3ZpZGVkIGB0eXBlc2AgY2FuIGVhY2ggZWl0aGVyIGJlIGEgcmVhbCByYXcgdHlwZSAoaS5lLiBgU3RyaW5nYCBjbGFzcyksIG9yIHRoZSBuYW1lIG9mIGEgdHlwZSwgYXMgYSBzdHJpbmcsXG4gKiAgIGkuZS4gYCc6OlN0cmluZydgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFRoZSB2YWx1ZSB3aG9zZSB0eXBlIHlvdSB3aXNoIHRvIGNvbXBhcmUuXG4gKiAgIC0gbmFtZTogLi4udHlwZXNcbiAqICAgICBkYXRhVHlwZTogQXJyYXk8YW55PlxuICogICAgIGRlc2M6IEFsbCB0eXBlcyB5b3Ugd2lzaCB0byBjaGVjayBhZ2FpbnN0LiBTdHJpbmcgdmFsdWVzIGNvbXBhcmUgdHlwZXMgYnkgbmFtZSwgZnVuY3Rpb24gdmFsdWVzIGNvbXBhcmUgdHlwZXMgYnkgYGluc3RhbmNlb2ZgLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB2YWx1ZWAgbWF0Y2hlcyBhbnkgb2YgdGhlIHByb3ZpZGVkIGB0eXBlc2AuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlKHZhbHVlLCAuLi50eXBlcykge1xuICBjb25zdCBnZXRJbnRlcm5hbFR5cGVOYW1lID0gKHR5cGUpID0+IHtcbiAgICBsZXQgbmF0aXZlVHlwZU1ldGEgPSBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQS5maW5kKCh0eXBlTWV0YSkgPT4gKHR5cGUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgaWYgKG5hdGl2ZVR5cGVNZXRhKVxuICAgICAgcmV0dXJuIGA6OiR7bmF0aXZlVHlwZU1ldGFbMF19YDtcbiAgfTtcblxuICBsZXQgdmFsdWVUeXBlID0gdHlwZU9mKHZhbHVlKTtcbiAgZm9yIChsZXQgdHlwZSBvZiB0eXBlcykge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZU9mKHR5cGUsICc6OlN0cmluZycpICYmIHZhbHVlVHlwZSA9PT0gdHlwZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgdHlwZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBsZXQgaW50ZXJuYWxUeXBlID0gZ2V0SW50ZXJuYWxUeXBlTmFtZSh0eXBlKTtcbiAgICAgICAgaWYgKGludGVybmFsVHlwZSAmJiBpbnRlcm5hbFR5cGUgPT09IHZhbHVlVHlwZSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgVmVyaWZ5IHRoYXQgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBgbnVtYmVyYCB0eXBlIChvciBgTnVtYmVyYCBpbnN0YW5jZSksIGFuZCB0aGF0XG4gKiAgIGl0ICoqaXMgbm90KiogYE5hTmAsIGBJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGBudW1iZXJgIChvciBgTnVtYmVyYCBpbnN0YW5jZSkgYW5kIGlzIGFsc28gKipub3QqKiBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAuIGkuZS4gYChpc051bWJlcih2YWx1ZSkgJiYgaXNGaW5pdGUodmFsdWUpKWAuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE51bWJlcih2YWx1ZSkge1xuICByZXR1cm4gKGlzVHlwZSh2YWx1ZSwgJzo6TnVtYmVyJykgJiYgaXNGaW5pdGUodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBWZXJpZnkgdGhhdCB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBhIFwicGxhaW5cIi9cInZhbmlsbGFcIiBPYmplY3QgaW5zdGFuY2UuXG4gKlxuICogICBUaGlzIG1ldGhvZCBpcyBpbnRlbmRlZCB0byBoZWxwIHRoZSBjYWxsZXIgZGV0ZWN0IGlmIGFuIG9iamVjdCBpcyBhIFwicmF3IHBsYWluIG9iamVjdFwiLFxuICogICBpbmhlcml0aW5nIGZyb20gYE9iamVjdC5wcm90b3R5cGVgIChvciBhIGBudWxsYCBwcm90b3R5cGUpLlxuICpcbiAqICAgMS4gYGlzUGxhaW5PYmplY3Qoe30pYCB3aWxsIHJldHVybiBgdHJ1ZWAuXG4gKiAgIDIuIGBpc1BsYWluT2JqZWN0KG5ldyBPYmplY3QoKSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgMy4gYGlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgNC4gYGlzUGxhaW5PYmplY3QobmV3IEN1c3RvbUNsYXNzKCkpYCB3aWxsIHJldHVybiBgZmFsc2VgLlxuICogICA1LiBBbGwgb3RoZXIgaW52b2NhdGlvbnMgc2hvdWxkIHJldHVybiBgZmFsc2VgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIFwicmF3XCIvXCJwbGFpblwiIE9iamVjdCBpbnN0YW5jZS5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBqYXZhc2NyaXB0IHByaW1pdGl2ZSB0eXBlLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHR5cGVvZiB2YWx1ZWAgaXMgb25lIG9mOiBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCwgYGJpZ2ludGAsIG9yIGBzeW1ib2xgLFxuICogICAgICAqYW5kIGFsc28qIGB2YWx1ZWAgaXMgKm5vdCogYE5hTmAsIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBgdW5kZWZpbmVkYCwgb3IgYG51bGxgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnLCAnOjpOdW1iZXInLCAnOjpCb29sZWFuJywgJzo6QmlnSW50Jyk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGdhcmJhZ2UgY29sbGVjdGFibGUuXG4gKlxuICogICBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGNoZWNrIGlmIGFueSBgdmFsdWVgIGlzIGFsbG93ZWQgdG8gYmUgdXNlZCBhcyBhIHdlYWsgcmVmZXJlbmNlLlxuICpcbiAqICAgRXNzZW50aWFsbHksIHRoaXMgd2lsbCByZXR1cm4gYGZhbHNlYCBmb3IgYW55IHByaW1pdGl2ZSB0eXBlLCBvciBgbnVsbGAsIGB1bmRlZmluZWRgLCBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAgdmFsdWVzLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHR5cGVvZiB2YWx1ZWAgaXMgb25lIG9mOiBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCwgYGJpZ2ludGAsIG9yIGBzeW1ib2xgLFxuICogICAgICAqYW5kIGFsc28qIGB2YWx1ZWAgKmlzIG5vdCogYE5hTmAsIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBgdW5kZWZpbmVkYCwgb3IgYG51bGxgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29sbGVjdGFibGUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyhJbmZpbml0eSkgfHwgT2JqZWN0LmlzKC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnLCAnOjpOdW1iZXInLCAnOjpCb29sZWFuJywgJzo6QmlnSW50JykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERldGVjdCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBcImVtcHR5XCIgKGlzICoqTioqdWxsICoqTyoqciAqKkUqKm1wdHkpLlxuICpcbiAqICAgQSB2YWx1ZSBpcyBjb25zaWRlcmVkIFwiZW1wdHlcIiBpZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIG1ldDpcbiAqICAgMS4gYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqICAgMi4gYHZhbHVlYCBpcyBgbnVsbGAuXG4gKiAgIDMuIGB2YWx1ZWAgaXMgYCcnYCAoYW4gZW1wdHkgc3RyaW5nKS5cbiAqICAgNC4gYHZhbHVlYCBpcyBub3QgYW4gZW1wdHkgc3RyaW5nLCBidXQgaXQgY29udGFpbnMgbm90aGluZyBleGNlcHQgd2hpdGVzcGFjZSAoYFxcdGAsIGBcXHJgLCBgXFxzYCwgb3IgYFxcbmApLlxuICogICA1LiBgdmFsdWVgIGlzIGBOYU5gLlxuICogICA2LiBgdmFsdWUubGVuZ3RoYCBpcyBhIGBOdW1iZXJgIG9yIGBudW1iZXJgIHR5cGUsIGFuZCBpcyBlcXVhbCB0byBgMGAuXG4gKiAgIDcuIGB2YWx1ZWAgaXMgYSBAc2VlIEJhc2VVdGlscy5pc1BsYWluT2JqZWN0P2NhcHRpb249cGxhaW4rb2JqZWN0OyBhbmQgaGFzIG5vIGl0ZXJhYmxlIGtleXMuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBhbnkgb2YgdGhlIFwiZW1wdHlcIiBjb25kaXRpb25zIGFib3ZlIGFyZSB0cnVlLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNOb3ROT0U7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOT0UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAodmFsdWUgPT09ICcnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICc6OlN0cmluZycpICYmICgvXltcXHRcXHNcXHJcXG5dKiQvKS50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLmxlbmd0aCwgJzo6TnVtYmVyJykpXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDApO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgKipub3QqKiBcImVtcHR5XCIgKGlzIG5vdCAqKk4qKnVsbCAqKk8qKnIgKipFKiptcHR5KS5cbiAqXG4gKiAgIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBcImVtcHR5XCIgaWYgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBpcyBtZXQ6XG4gKiAgIDEuIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKiAgIDIuIGB2YWx1ZWAgaXMgYG51bGxgLlxuICogICAzLiBgdmFsdWVgIGlzIGAnJ2AgKGFuIGVtcHR5IHN0cmluZykuXG4gKiAgIDQuIGB2YWx1ZWAgaXMgbm90IGFuIGVtcHR5IHN0cmluZywgYnV0IGl0IGNvbnRhaW5zIG5vdGhpbmcgZXhjZXB0IHdoaXRlc3BhY2UgKGBcXHRgLCBgXFxyYCwgYFxcc2AsIG9yIGBcXG5gKS5cbiAqICAgNS4gYHZhbHVlYCBpcyBgTmFOYC5cbiAqICAgNi4gYHZhbHVlLmxlbmd0aGAgaXMgYSBgTnVtYmVyYCBvciBgbnVtYmVyYCB0eXBlLCBhbmQgaXMgZXF1YWwgdG8gYDBgLlxuICogICA3LiBgdmFsdWVgIGlzIGEgQHNlZSBCYXNlVXRpbHMuaXNQbGFpbk9iamVjdD9jYXB0aW9uPXBsYWluK29iamVjdDsgYW5kIGhhcyBubyBpdGVyYWJsZSBrZXlzLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgZmFsc2VgIGlmIGFueSBvZiB0aGUgXCJlbXB0eVwiIGNvbmRpdGlvbnMgYWJvdmUgYXJlIHRydWUuXG4gKiAgIDIuIE90aGVyd2lzZSwgYHRydWVgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIGlzIHRoZSBleGFjdCBpbnZlcnNlIG9mIEBzZWUgQmFzZVV0aWxzLmlzTk9FO1xuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc05PRTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIWlzTk9FKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBDb252ZXJ0IHRoZSBwcm92aWRlZCBgc3RyaW5nYCBgdmFsdWVgIGludG8gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBub24td29yZCBjaGFyYWN0ZXJzIChbYS16QS1aMC05X10pIGFyZSBzdHJpcHBlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZy5cbiAqICAgMi4gQW55IG5vbi13b3JkIGNoYXJhY3RlcnMgKFthLXpBLVowLTlfXSkgYXJlIHN0cmlwcGVkIGZyb20gdGhlIGVuZCBvZiB0aGUgc3RyaW5nLlxuICogICAzLiBFYWNoIFwid29yZFwiIGlzIGNhcGl0YWxpemVkLlxuICogICA0LiBUaGUgZmlyc3QgbGV0dGVyIGlzIGFsd2F5cyBsb3dlci1jYXNlZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBTdHJpbmcgdG8gY29udmVydCBpbnRvIFtjYW1lbENhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0NhbWVsX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtjYW1lbENhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0NhbWVsX2Nhc2UpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMudG9DYW1lbENhc2UoJy0tdGVzdC1zb21lX3ZhbHVlX0AnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0ZXN0U29tZVZhbHVlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9eXFxXLywgJycpXG4gICAgLnJlcGxhY2UoL1tcXFddKyQvLCAnJylcbiAgICAucmVwbGFjZSgvKFtBLVpdKykvZywgJy0kMScpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxXKyguKS9nLCAobSwgcCkgPT4ge1xuICAgICAgcmV0dXJuIHAudG9VcHBlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9eKC4pKC4qKSQvLCAobSwgZiwgbCkgPT4gYCR7Zi50b0xvd2VyQ2FzZSgpfSR7bH1gKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBDb252ZXJ0IHRoZSBwcm92aWRlZCBgc3RyaW5nYCBgdmFsdWVgIGludG8gW3NuYWtlX2Nhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1NuYWtlX2Nhc2UpLlxuICpcbiAqICAgVGhlIHByb2Nlc3MgaXMgcm91Z2hseSBhcyBmb2xsb3dzOlxuICogICAxLiBBbnkgY2FwaXRhbGl6ZWQgY2hhcmFjdGVyIHNlcXVlbmNlIGlzIHByZWZpeGVkIGJ5IGFuIHVuZGVyc2NvcmUuXG4gKiAgIDIuIE1vcmUgdGhhbiBvbmUgc2VxdWVudGlhbCB1bmRlcnNjb3JlcyBhcmUgY29udmVydGVkIGludG8gYSBzaW5nbGUgdW5kZXJzY29yZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBTdHJpbmcgdG8gY29udmVydCBpbnRvIFtzbmFrZV9jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNTbmFrZV9jYXNlKS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgZm9ybWF0dGVkIHN0cmluZyBpbiBbc25ha2VfY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU25ha2VfY2FzZSkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKEJhc2VVdGlscy50b1NuYWtlQ2FzZSgnVGhpc0lzQVNlbnRlbmNlJykpO1xuICogICAgIC8vIG91dHB1dCAtPiAndGhpc19pc19hX3NlbnRlbmNlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXSsvZywgKG0sIG9mZnNldCkgPT4gKChvZmZzZXQpID8gYF8ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKSlcbiAgICAucmVwbGFjZSgvX3syLH0vZywgJ18nKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBba2ViYWItY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjS2ViYWJfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBjYXBpdGFsaXplZCBjaGFyYWN0ZXIgc2VxdWVuY2UgaXMgcHJlZml4ZWQgYnkgYSBoeXBoZW4uXG4gKiAgIDIuIE1vcmUgdGhhbiBvbmUgc2VxdWVudGlhbCBoeXBoZW5zIGFyZSBjb252ZXJ0ZWQgaW50byBhIHNpbmdsZSBoeXBoZW4uXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogU3RyaW5nIHRvIHR1cm4gaW50byBba2ViYWItY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjS2ViYWJfY2FzZSkuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIGZvcm1hdHRlZCBzdHJpbmcgaW4gW2tlYmFiLWNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0tlYmFiX2Nhc2UpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMudG9LZWJhYkNhc2UoJ1RoaXNJc0FTZW50ZW5jZScpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ3RoaXMtaXMtYS1zZW50ZW5jZSdcbiAqICAgICBgYGBcbiAqL1xuXG5jb25zdCBJU19MQVNUX0NIQVJfVVBQRVJDQVNFID0gL1tBLVpdJC87XG5leHBvcnQgZnVuY3Rpb24gdG9LZWJhYkNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXVthLXpdK3xbQS1aXXsyLH0vZywgKG0sIG9mZnNldCkgPT4ge1xuICAgICAgaWYgKG0ubGVuZ3RoID4gMSAmJiBJU19MQVNUX0NIQVJfVVBQRVJDQVNFLnRlc3QobSkpXG4gICAgICAgIHJldHVybiAoYCR7KG9mZnNldCkgPyAnLScgOiAnJ30ke20uc2xpY2UoMCwgLTEpfS0ke20uc2xpY2UoLTEpfWApLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIHJldHVybiAoKG9mZnNldCkgPyBgLSR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoLy17Mix9L2csICctJylcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBEbyBvdXIgYmVzdCB0byBlbXVsYXRlIFtwcm9jZXNzLm5leHRUaWNrXShodHRwczovL25vZGVqcy5vcmcvZW4vZ3VpZGVzL2V2ZW50LWxvb3AtdGltZXJzLWFuZC1uZXh0dGljay8jcHJvY2Vzc25leHR0aWNrKVxuICogICBpbiB0aGUgYnJvd3Nlci5cbiAqXG4gKiAgIEluIG9yZGVyIHRvIHRyeSBhbmQgZW11bGF0ZSBgcHJvY2Vzcy5uZXh0VGlja2AsIHRoaXMgZnVuY3Rpb24gd2lsbCB1c2UgYGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGNhbGxiYWNrKCkpYCBpZiBhdmFpbGFibGUsXG4gKiAgIG90aGVyd2lzZSBpdCB3aWxsIGZhbGxiYWNrIHRvIHVzaW5nIGBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrKWAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogY2FsbGJhY2tcbiAqICAgICBkYXRhVHlwZTogZnVuY3Rpb25cbiAqICAgICBkZXNjOiBDYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIG9uIFwibmV4dFRpY2tcIi5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBmdW5jdGlvbiB3aWxsIHByZWZlciBhbmQgdXNlIGBwcm9jZXNzLm5leHRUaWNrYCBpZiBpdCBpcyBhdmFpbGFibGUgKGkuZS4gaWYgcnVubmluZyBvbiBOb2RlSlMpLlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVGhpcyBmdW5jdGlvbiBpcyB1bmxpa2VseSB0byBhY3R1YWxseSBiZSB0aGUgbmV4dCBcInRpY2tcIiBvZiB0aGUgdW5kZXJseWluZ1xuICogICAgIGphdmFzY3JpcHQgZW5naW5lLiBUaGlzIG1ldGhvZCBqdXN0IGRvZXMgaXRzIGJlc3QgdG8gZW11bGF0ZSBcIm5leHRUaWNrXCIuIEluc3RlYWQgb2YgdGhlXG4gKiAgICAgYWN0dWFsIFwibmV4dCB0aWNrXCIsIHRoaXMgd2lsbCBpbnN0ZWFkIGJlIFwiYXMgZmFzdCBhcyBwb3NzaWJsZVwiLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBmdW5jdGlvbiBkZWxpYmVyYXRlbHkgYXR0ZW1wdHMgdG8gdXNlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGZpcnN0LS1ldmVuIHRob3VnaCBpdCBsaWtlbHkgZG9lc24ndFxuICogICAgIGhhdmUgdGhlIGZhc3Rlc3QgdHVybi1hcm91bmQtdGltZS0tdG8gc2F2ZSBiYXR0ZXJ5IHBvd2VyLiBUaGUgaWRlYSBiZWluZyB0aGF0IFwic29tZXRoaW5nIG5lZWRzIHRvIGJlIGRvbmUgKnNvb24qXCIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzLm5leHRUaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KSkudGhlbigoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IElTX05VTUJFUiA9IC9eKFstK10/KShcXGQqKD86XFwuXFxkKyk/KShlWy0rXVxcZCspPyQvO1xuY29uc3QgSVNfQk9PTEVBTiA9IC9eKHRydWV8ZmFsc2UpJC87XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29lcmNlIGEgc3RyaW5nIHRvIGl0cyBtb3N0IGxpa2VseSB1bmRlcmx5aW5nIHByaW1pdGl2ZSB0eXBlLlxuICpcbiAqICAgQ29udmVyc2lvbiBpbnB1dCBhbmQgb3V0cHV0IHRhYmxlOlxuICogICAqIGAnbnVsbCdgIGNvbnZlcnRzIHRvIGBudWxsYFxuICogICAqIGAndW5kZWZpbmVkJ2AgY29udmVydHMgdG8gYHVuZGVmaW5lZGBcbiAqICAgKiBgJ05hTidgIGNvbnZlcnRzIHRvIGBOYU5gXG4gKiAgICogYCdJbmZpbml0eSdgIGNvbnZlcnRzIHRvIGBJbmZpbml0eWBcbiAqICAgKiBgJy1JbmZpbml0eSdgIGNvbnZlcnRzIHRvIGAtSW5maW5pdHlgXG4gKiAgICogYCd0cnVlJ2AgY29udmVydHMgdG8gYHRydWVgXG4gKiAgICogYCdmYWxzZSdgIGNvbnZlcnRzIHRvIGBmYWxzZWBcbiAqICAgKiBBbnkgcGFyc2FibGUgbnVtZXJpYyBzdHJpbmcgdmFsdWUgKGluY2x1ZGluZyBbRSBub3RhdGlvbl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU2NpZW50aWZpY19ub3RhdGlvbiNFX25vdGF0aW9uKSkgY29udmVydHMgdG8gYG51bWJlcmBcbiAqXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY29udmVydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvZXJjZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09ICdudWxsJylcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgaWYgKHZhbHVlID09PSAnTmFOJylcbiAgICByZXR1cm4gTmFOO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ0luZmluaXR5JyB8fCB2YWx1ZSA9PT0gJytJbmZpbml0eScpXG4gICAgcmV0dXJuIEluZmluaXR5O1xuXG4gIGlmICh2YWx1ZSA9PT0gJy1JbmZpbml0eScpXG4gICAgcmV0dXJuIC1JbmZpbml0eTtcblxuICBpZiAoSVNfTlVNQkVSLnRlc3QodmFsdWUpKVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUsIDEwKTtcblxuICBpZiAoSVNfQk9PTEVBTi50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gKHZhbHVlID09PSAndHJ1ZScpO1xuXG4gIHJldHVybiB2YWx1ZTtcbn1cbiIsImltcG9ydCB7XG4gIE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyAgIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG4vKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29tcG9uZW50VXRpbHNcbiAqIGdyb3VwTmFtZTogQ29tcG9uZW50VXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgYGltcG9ydCB7IENvbXBvbmVudFV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBDb21wb25lbnQgYW5kIGZyYW1ld29yayBjbGFzc2VzIGFuZCBmdW5jdGlvbmFsaXR5IGFyZSBmb3VuZCBoZXJlLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZGVudGlmaWVyKHRhcmdldCkge1xuICBpZiAoIXRhcmdldClcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKHR5cGVvZiB0YXJnZXQuZ2V0SWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdGFyZ2V0LmdldElkZW50aWZpZXIuY2FsbCh0YXJnZXQpO1xuXG4gIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KVxuICAgIHJldHVybiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBCYXNlVXRpbHMudG9DYW1lbENhc2UodGFyZ2V0LmxvY2FsTmFtZSk7XG5cbiAgcmV0dXJuICd1bmRlZmluZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVVSTChyb290TG9jYXRpb24sIF91cmxpc2gpIHtcbiAgbGV0IHVybGlzaCA9IF91cmxpc2g7XG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBVUkwpXG4gICAgdXJsaXNoID0gdXJsaXNoLnRvU3RyaW5nKCk7XG5cbiAgaWYgKCF1cmxpc2gpXG4gICAgdXJsaXNoID0gJyc7XG5cbiAgaWYgKCFCYXNlVXRpbHMuaXNUeXBlKHVybGlzaCwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuO1xuXG4gIGxldCB1cmwgPSBuZXcgVVJMKHVybGlzaCwgbmV3IFVSTChyb290TG9jYXRpb24pKTtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IGZpbGVOYW1lICA9ICcnO1xuICAgIGxldCBwYXRoICAgICAgPSAnLyc7XG5cbiAgICB1cmwucGF0aG5hbWUucmVwbGFjZSgvXiguKlxcLykoW14vXSspJC8sIChtLCBmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICBwYXRoID0gZmlyc3QucmVwbGFjZSgvXFwvKyQvLCAnLycpO1xuICAgICAgaWYgKHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJylcbiAgICAgICAgcGF0aCA9IGAke3BhdGh9L2A7XG5cbiAgICAgIGZpbGVOYW1lID0gc2Vjb25kO1xuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbiAgICBsZXQgbmV3U3JjID0gZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlci5jYWxsKHRoaXMsIHsgc3JjOiB1cmxpc2gsIHVybCwgcGF0aCwgZmlsZU5hbWUgfSk7XG4gICAgaWYgKG5ld1NyYyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtcmVxdWlyZVwiOiBOb3QgbG9hZGluZyBcIiR7dXJsaXNofVwiIGJlY2F1c2UgdGhlIGdsb2JhbCBcIm15dGhpeFVJLnVybFJlc29sdmVyXCIgcmVxdWVzdGVkIEkgbm90IGRvIHNvLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdTcmMgJiYgKG5ld1NyYy50b1N0cmluZygpICE9PSB1cmwudG9TdHJpbmcoKSAmJiBuZXdTcmMudG9TdHJpbmcoKSAhPT0gdXJsaXNoKSlcbiAgICAgIHVybCA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCByb290TG9jYXRpb24sIG5ld1NyYyk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG5jb25zdCBJU19URU1QTEFURSAgICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgSVNfU0NSSVBUICAgICAgICAgICA9IC9eKHNjcmlwdCkkL2k7XG5jb25zdCBJU19IRUFEX1RBRyAgICAgICAgID0gL14oc3R5bGV8bGlua3xtZXRhKSQvaTtcbmNvbnN0IFNIT1VMRF9JR05PUkUgICAgICAgPSAvXihiYXNlfG5vc2NyaXB0fHRpdGxlKSQvaTtcbmNvbnN0IFJFUVVJUkVfQ0FDSEUgICAgICAgPSBuZXcgTWFwKCk7XG5jb25zdCBSRVNPTFZFX1NSQ19FTEVNRU5UID0gL15zY3JpcHR8bGlua3xzdHlsZXxteXRoaXgtbGFuZ3VhZ2UtcGFja3xteXRoaXgtcmVxdWlyZSQvaTtcblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2Uob3duZXJEb2N1bWVudCwgbG9jYXRpb24sIF91cmwsIHNvdXJjZVN0cmluZywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdXJsICAgICAgID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGxvY2F0aW9uLCBfdXJsLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGZpbGVOYW1lO1xuICBsZXQgYmFzZVVSTCAgID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lLnJlcGxhY2UoL1teL10rJC8sIChtKSA9PiB7XG4gICAgZmlsZU5hbWUgPSBtO1xuICAgIHJldHVybiAnJztcbiAgfSl9JHt1cmwuc2VhcmNofSR7dXJsLmhhc2h9YCk7XG5cbiAgbGV0IHRlbXBsYXRlID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzb3VyY2VTdHJpbmc7XG5cbiAgbGV0IGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgbGV0IHggPSBhLnRhZ05hbWU7XG4gICAgbGV0IHkgPSBiLnRhZ05hbWU7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKHggPT0geSlcbiAgICAgIHJldHVybiAwO1xuXG4gICAgcmV0dXJuICh4IDwgeSkgPyAxIDogLTE7XG4gIH0pO1xuXG4gIGNvbnN0IGZpbGVOYW1lVG9FbGVtZW50TmFtZSA9IChmaWxlTmFtZSkgPT4ge1xuICAgIHJldHVybiBmaWxlTmFtZS50cmltKCkucmVwbGFjZSgvXFwuLiokLywgJycpLnJlcGxhY2UoL1xcYltBLVpdfFteQS1aXVtBLVpdL2csIChfbSkgPT4ge1xuICAgICAgbGV0IG0gPSBfbS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIChtLmxlbmd0aCA8IDIpID8gYC0ke219YCA6IGAke20uY2hhckF0KDApfS0ke20uY2hhckF0KDEpfWA7XG4gICAgfSkucmVwbGFjZSgvLXsyLH0vZywgJy0nKS5yZXBsYWNlKC9eW15hLXpdKi8sICcnKS5yZXBsYWNlKC9bXmEtel0qJC8sICcnKTtcbiAgfTtcblxuICBsZXQgZ3Vlc3NlZEVsZW1lbnROYW1lICA9IGZpbGVOYW1lVG9FbGVtZW50TmFtZShmaWxlTmFtZSk7XG4gIGxldCBjb250ZXh0ICAgICAgICAgICAgID0ge1xuICAgIGd1ZXNzZWRFbGVtZW50TmFtZSxcbiAgICBjaGlsZHJlbixcbiAgICBvd25lckRvY3VtZW50LFxuICAgIHRlbXBsYXRlLFxuICAgIHVybCxcbiAgICBiYXNlVVJMLFxuICAgIGZpbGVOYW1lLFxuICB9O1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wcmVQcm9jZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGVtcGxhdGUgPSBjb250ZXh0LnRlbXBsYXRlID0gb3B0aW9ucy5wcmVQcm9jZXNzLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pO1xuICB9XG5cbiAgbGV0IG5vZGVIYW5kbGVyICAgPSBvcHRpb25zLm5vZGVIYW5kbGVyO1xuICBsZXQgdGVtcGxhdGVDb3VudCA9IGNoaWxkcmVuLnJlZHVjZSgoc3VtLCBlbGVtZW50KSA9PiAoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyAoc3VtICsgMSkgOiBzdW0pLCAwKTtcblxuICBjb250ZXh0LnRlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50O1xuXG4gIGNvbnN0IHJlc29sdmVFbGVtZW50U3JjQXR0cmlidXRlID0gKGVsZW1lbnQsIGJhc2VVUkwpID0+IHtcbiAgICAvLyBSZXNvbHZlIFwic3JjXCIgYXR0cmlidXRlLCBzaW5jZSB3ZSBhcmVcbiAgICAvLyBnb2luZyB0byBiZSBtb3ZpbmcgdGhlIGVsZW1lbnQgYXJvdW5kXG4gICAgbGV0IHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoc3JjKSB7XG4gICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9O1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgaWYgKG9wdGlvbnMubWFnaWMgJiYgUkVTT0xWRV9TUkNfRUxFTUVOVC50ZXN0KGNoaWxkLmxvY2FsTmFtZSkpXG4gICAgICBjaGlsZCA9IHJlc29sdmVFbGVtZW50U3JjQXR0cmlidXRlKGNoaWxkLCBiYXNlVVJMKTtcblxuICAgIGlmIChTSE9VTERfSUdOT1JFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICBpZiAodGVtcGxhdGVDb3VudCA9PT0gMSAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgPT0gbnVsbCAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gYm9keVxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiIGldYCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmIChJU19TQ1JJUFQudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8c2NyaXB0PlxuICAgICAgbGV0IGNoaWxkQ2xvbmUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY2hpbGQudGFnTmFtZSk7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIG9mIGNoaWxkLmdldEF0dHJpYnV0ZU5hbWVzKCkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdzcmMnKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGNoaWxkLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzcmMgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgaWYgKHNyYykge1xuICAgICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkQ2xvbmUsIHsgLi4uY29udGV4dCwgaXNTY3JpcHQ6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgc2NyaXB0SUQgPSBjaGlsZENsb25lLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIGlmICghc2NyaXB0SUQpIHtcbiAgICAgICAgc2NyaXB0SUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke3NyYyB8fCBjaGlsZENsb25lLmlubmVySFRNTH1gKX1gO1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnaWQnLCBzY3JpcHRJRCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY3JpcHRJRCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKElTX0hFQURfVEFHLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPGxpbms+ICYgPHN0eWxlPlxuICAgICAgbGV0IGlzU3R5bGUgPSAoL15zdHlsZSQvaSkudGVzdChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1N0eWxlLCBpc0xpbms6ICFpc1N0eWxlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICBpZiAoIXN0eWxlSUQpIHtcbiAgICAgICAgc3R5bGVJRCA9IGBJRCR7QmFzZVV0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7c3R5bGVJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKCgvXm1ldGEkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPG1ldGE+XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHsgLy8gRXZlcnl0aGluZyBlbHNlXG4gICAgICBsZXQgaXNIYW5kbGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChjaGlsZC5sb2NhbE5hbWUgPT09ICdteXRoaXgtbGFuZ3VhZ2UtcGFjaycpIHtcbiAgICAgICAgbGV0IGxhbmdQYWNrSUQgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIGlmICghbGFuZ1BhY2tJRCkge1xuICAgICAgICAgIGxhbmdQYWNrSUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke2NoaWxkLm91dGVySFRNTH1gKX1gO1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBsYW5nUGFja0lEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcblxuICAgICAgICBpZiAobGFuZ3VhZ2VQcm92aWRlcikge1xuICAgICAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlci5xdWVyeVNlbGVjdG9yKGBteXRoaXgtbGFuZ3VhZ2UtcGFjayMke2xhbmdQYWNrSUR9YCkpXG4gICAgICAgICAgICBsYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZShjaGlsZCwgbGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKTtcblxuICAgICAgICAgIGlzSGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH0gLy8gZWxzZSBkbyBub3RoaW5nLi4uIGxldCBpdCBiZSBkdW1wZWQgaW50byB0aGUgZG9tIGxhdGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wb3N0UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucG9zdFByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUodXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgdXJsT3JOYW1lLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGNhY2hlS2V5O1xuXG4gIGlmICghKC9eKGZhbHNlfG5vLXN0b3JlfHJlbG9hZHxuby1jYWNoZSkkLykudGVzdCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGUnKSkpIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlUGFyYW1zJykgIT09ICd0cnVlJykge1xuICAgICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZWRSZXNwb25zZSA9IFJFUVVJUkVfQ0FDSEUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICBpZiAoY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UgJiYgY2FjaGVkUmVzcG9uc2UucmVzcG9uc2Uub2spXG4gICAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgICB9XG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGdsb2JhbFRoaXMuZmV0Y2godXJsLCBvcHRpb25zLmZldGNoT3B0aW9ucykudGhlbihcbiAgICBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgcmVzcG9uc2UudGV4dCA9IGFzeW5jICgpID0+IGJvZHk7XG4gICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiBmYWxzZSB9O1xuICAgIH0sXG4gICAgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmcm9tIE15dGhpeCBVSSBcInJlcXVpcmVcIjogJywgZXJyb3IpO1xuXG4gICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgc3JjLFxuICAgIHtcbiAgICAgIG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgbGV0IHNjb3BlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIHVybC5zZWFyY2hQYXJhbXMuZW50cmllcygpKVxuICAgIHNjb3BlRGF0YVtrZXldID0gQmFzZVV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSkge1xuICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMuY2FsbChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFV0aWxzLmNyZWF0ZVNjb3BlKHNjb3BlRGF0YSwgb3B0aW9ucy5zY29wZSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2liaWxpdHlPYnNlcnZlcihjYWxsYmFjaywgX29wdGlvbnMpIHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVudHJpZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVudHJ5ICAgPSBlbnRyaWVzW2ldO1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbnRyeS50YXJnZXQ7XG4gICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gICAgICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsIGVsZW1lbnRPYnNlcnZlcnMpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0geyB3YXNWaXNpYmxlOiBmYWxzZSwgcmF0aW9WaXNpYmxlOiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB9O1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzLnNldChvYnNlcnZlciwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IGRhdGEucmF0aW9WaXNpYmxlKVxuICAgICAgICBkYXRhLnJhdGlvVmlzaWJsZSA9IGVudHJ5LmludGVyc2VjdGlvblJhdGlvO1xuXG4gICAgICBkYXRhLnByZXZpb3VzVmlzaWJpbGl0eSA9IChkYXRhLnZpc2liaWxpdHkgPT09IHVuZGVmaW5lZCkgPyBkYXRhLnZpc2liaWxpdHkgOiBkYXRhLnZpc2liaWxpdHk7XG4gICAgICBkYXRhLnZpc2liaWxpdHkgPSAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjApO1xuXG4gICAgICBjYWxsYmFjayh7IC4uLmRhdGEsIGVudHJ5LCBlbGVtZW50LCBpbmRleDogaSwgZGlzY29ubmVjdDogKCkgPT4gb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpIH0pO1xuXG4gICAgICBpZiAoZGF0YS52aXNpYmlsaXR5ICYmICFkYXRhLndhc1Zpc2libGUpXG4gICAgICAgIGRhdGEud2FzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBvcHRpb25zID0ge1xuICAgIHJvb3Q6ICAgICAgIG51bGwsXG4gICAgdGhyZXNob2xkOiAgMC4wLFxuICAgIC4uLihfb3B0aW9ucyB8fCB7fSksXG4gIH07XG5cbiAgbGV0IG9ic2VydmVyICA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpbnRlcnNlY3Rpb25DYWxsYmFjaywgb3B0aW9ucyk7XG4gIGxldCBlbGVtZW50cyAgPSAoX29wdGlvbnMgfHwge30pLmVsZW1lbnRzIHx8IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50c1tpXSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5jb25zdCBOT19PQlNFUlZFUiA9IE9iamVjdC5mcmVlemUoe1xuICB3YXNWaXNpYmxlOiAgICAgICAgIGZhbHNlLFxuICByYXRpb1Zpc2libGU6ICAgICAgIDAuMCxcbiAgdmlzaWJpbGl0eTogICAgICAgICBmYWxzZSxcbiAgcHJldmlvdXNWaXNpYmlsaXR5OiBmYWxzZSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eU1ldGEoZWxlbWVudCwgb2JzZXJ2ZXIpIHtcbiAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gIGlmICghZWxlbWVudE9ic2VydmVycylcbiAgICByZXR1cm4gTk9fT0JTRVJWRVI7XG5cbiAgcmV0dXJuIGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKSB8fCBOT19PQlNFUlZFUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhcmdlc3REb2N1bWVudFRhYkluZGV4KG93bmVyRG9jdW1lbnQpIHtcbiAgbGV0IGxhcmdlc3QgPSAtSW5maW5pdHk7XG5cbiAgQXJyYXkuZnJvbSgob3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgbGV0IHRhYkluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JyksIDEwKTtcbiAgICBpZiAoIWlzRmluaXRlKHRhYkluZGV4KSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0YWJJbmRleCA+IGxhcmdlc3QpXG4gICAgICBsYXJnZXN0ID0gdGFiSW5kZXg7XG4gIH0pO1xuXG4gIHJldHVybiAobGFyZ2VzdCA8IDApID8gMCA6IGxhcmdlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRTY3JpcHRJbnRvSGVhZChfdXJsLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgYXR0cmlidXRlcyAgICA9IG9wdGlvbnMuYXR0cmlidXRlcyB8fCB7fTtcbiAgbGV0IG93bmVyRG9jdW1lbnQgPSBvcHRpb25zLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIGxldCBzY3JpcHRFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgX3VybCwgeyBtYWdpYzogdHJ1ZSB9KTtcblxuICBmb3IgKGxldCBbIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ3NyYycpXG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmxvY2F0aW9uLCBhdHRyaWJ1dGVWYWx1ZSwgeyBtYWdpYzogdHJ1ZSB9KTtcblxuICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgfVxuXG4gIGxldCBzY3JpcHRJRCA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICBpZiAoIXNjcmlwdElEKSB7XG4gICAgc2NyaXB0SUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYodXJsKX1gO1xuICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHNjcmlwdElEKTtcbiAgfVxuXG4gIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJpYnV0ZXMsICd0eXBlJykpXG4gICAgc2NyaXB0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG5cbiAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2NyaXB0SUQpKVxuICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICByZXR1cm4gc2NyaXB0RWxlbWVudDtcbn0iLCIvKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29uc3RhbnRzXG4gKiBncm91cE5hbWU6IENvbnN0YW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBhZ2FpbnN0IGVsZW1lbnRzIHdpdGggYSBgZGF0YS1zcmNgIGF0dHJpYnV0ZS5cbiAqICAgICAgIEZvciBlbGVtZW50cyB3aXRoIHRoaXMgYXR0cmlidXRlLCBzZXQgYW4gW2ludGVyc2VjdGlvbiBvYnNlcnZlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbl9PYnNlcnZlcl9BUEkpIGlzIHNldHVwLlxuICogICAgICAgV2hlbiB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIHJlcG9ydHMgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCB0aGVuIHRoZSBVUkwgc3BlY2lmaWVkIGJ5IGBkYXRhLXNyY2AgaXMgZmV0Y2hlZCwgYW5kIGR1bXBlZCBpbnRvXG4gKiAgICAgICB0aGUgZWxlbWVudCBhcyBpdHMgY2hpbGRyZW4uIFRoaXMgYWxsb3dzIGZvciBkeW5hbWljIFwicGFydGlhbHNcIiB0aGF0IGFyZSBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogICAgICAgVGhlIHZhbHVlIHN0b3JlZCBhdCB0aGlzIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBpcyBhIE1hcCBvZiBbaW50ZXJzZWN0aW9uIG9ic2VydmVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpXG4gKiAgICAgICBpbnN0YW5jZXMuIFRoZSBrZXlzIG9mIHRoaXMgbWFwIGFyZSB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVycyB0aGVtc2VsdmVzLiBUaGUgdmFsdWVzIGFyZSByYXcgb2JqZWN0cyB3aXRoIHRoZSBzaGFwZVxuICogICAgICAgYHsgd2FzVmlzaWJsZTogYm9vbGVhbiwgcmF0aW9WaXNpYmxlOiBmbG9hdCwgcHJldmlvdXNWaXNpYmlsaXR5OiBib29sZWFuLCB2aXNpYmlsaXR5OiBib29sZWFuIH1gLlxuICogICAtIG5hbWU6IE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgVXRpbHMuZ2xvYmFsU3RvcmVOYW1lVmFsdWVQYWlySGVscGVyO1xuICogICAgICAgdG8gc3RvcmUga2V5L3ZhbHVlIHBhaXJzIGZvciBhIHNpbmdsZSB2YWx1ZS5cbiAqXG4gKiAgICAgICBNeXRoaXggVUkgaGFzIGdsb2JhbCBzdG9yZSBhbmQgZmV0Y2ggaGVscGVycyBmb3Igc2V0dGluZyBhbmQgZmV0Y2hpbmcgZHluYW1pYyBwcm9wZXJ0aWVzLiBUaGVzZVxuICogICAgICAgbWV0aG9kcyBvbmx5IGFjY2VwdCBhIHNpbmdsZSB2YWx1ZSBieSBkZXNpZ24uLi4gYnV0IHNvbWV0aW1lcyBpdCBpcyBkZXNpcmVkIHRoYXQgYSB2YWx1ZSBiZSBzZXRcbiAqICAgICAgIHdpdGggYSBzcGVjaWZpYyBrZXkgaW5zdGVhZC4gVGhpcyBgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJgIHByb3BlcnR5IGFzc2lzdHMgd2l0aCB0aGlzIHByb2Nlc3MsXG4gKiAgICAgICBhbGxvd2luZyBnbG9iYWwgaGVscGVycyB0byBzdGlsbCBmdW5jdGlvbiB3aXRoIGEgc2luZ2xlIHZhbHVlIHNldCwgd2hpbGUgaW4gc29tZSBjYXNlcyBzdGlsbCBwYXNzaW5nXG4gKiAgICAgICBhIGtleSB0aHJvdWdoIHRvIHRoZSBzZXR0ZXIuIEBzb3VyY2VSZWYgX215dGhpeE5hbWVWYWx1ZVBhaXJIZWxwZXJVc2FnZTtcbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgLSBuYW1lOiBNWVRISVhfU0hBRE9XX1BBUkVOVFxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgYXMgYSBAc2VlIFV0aWxzLm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBieSBAc2VlIE15dGhpeFVJQ29tcG9uZW50OyB0b1xuICogICAgICAgc3RvcmUgdGhlIHBhcmVudCBub2RlIG9mIGEgU2hhZG93IERPTSwgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgdHJhdmVyc2VkIGJ5IEBzZWUgVXRpbHMuZ2V0UGFyZW50Tm9kZTsuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOndhcm5pbmc6IFVzZSBhdCB5b3VyIG93biByaXNrLiBUaGlzIGlzIE15dGhpeCBVSSBpbnRlcm5hbCBjb2RlIHRoYXQgbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgLSBuYW1lOiBNWVRISVhfVFlQRVxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgZm9yIHR5cGUgY2hlY2tpbmcgYnkgYGluc3RhbmNlb2ZgIGNoZWNrcyB0byBkZXRlcm1pbmUgaWYgYW4gaW5zdGFuY2VcbiAqICAgICAgIGlzIGEgc3BlY2lmaWMgdHlwZSAoZXZlbiBhY3Jvc3MgamF2YXNjcmlwdCBjb250ZXh0cyBhbmQgbGlicmFyeSB2ZXJzaW9ucykuIEBzb3VyY2VSZWYgX215dGhpeFR5cGVFeGFtcGxlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKiAgIC0gbmFtZTogRFlOQU1JQ19QUk9QRVJUWV9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFVzZWQgZm9yIHJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGFnYWluc3QgQHNlZSBVdGlscy5EeW5hbWljUHJvcGVydHk7LlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgRHluYW1pY1Byb3BlcnR5Oy5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9UWVBFOy5cbiAqL1xuXG4vLyBCYXNlXG5leHBvcnQgY29uc3QgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL25hbWUtdmFsdWUtcGFpci1oZWxwZXInKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbmV4cG9ydCBjb25zdCBNWVRISVhfU0hBRE9XX1BBUkVOVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvc2hhZG93LXBhcmVudCcpOyAvLyBAcmVmOkNvbnN0YW50cy5NWVRISVhfU0hBRE9XX1BBUkVOVFxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9UWVBFICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9lbGVtZW50LWRlZmluaXRpb24nKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX1RZUEVcbmV4cG9ydCBjb25zdCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2ludGVyc2VjdGlvbi1vYnNlcnZlcnMnKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbmV4cG9ydCBjb25zdCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2RvY3VtZW50LWluaXRpYWxpemVkJyk7IC8vIEByZWY6Q29uc3RhbnRzLk1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRFxuXG4vLyBEeW5hbWljUHJvcGVydHlcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy92YWx1ZScpO1xuZXhwb3J0IGNvbnN0IERZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElORyAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL2lzLXNldHRpbmcnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1NFVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9zZXQnKTtcblxuLy8gVHlwZXNcbmV4cG9ydCBjb25zdCBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RWxlbWVudERlZmluaXRpb24nKTtcbmV4cG9ydCBjb25zdCBRVUVSWV9FTkdJTkVfVFlQRSAgICAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6UXVlcnlFbmdpbmUnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1RZUEUgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RHluYW1pY1Byb3BlcnR5Jyk7IC8vIEByZWY6Q29uc3RhbnRzLkRZTkFNSUNfUFJPUEVSVFlfVFlQRVxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpNeXRoaXhVSUNvbXBvbmVudCcpO1xuXG4vLyBFbGVtZW50c1xuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy91bmZpbmlzaGVkJyk7XG5cblxuIiwiaW1wb3J0IHtcbiAgRFlOQU1JQ19QUk9QRVJUWV9UWVBFLFxuICBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFLFxuICBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcsXG4gIERZTkFNSUNfUFJPUEVSVFlfU0VULFxuICBNWVRISVhfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcblxuLyoqXG4gKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICogZGVzYzogfFxuICogICBgRHluYW1pY1Byb3BlcnR5YCBpcyBhIHNpbXBsZSB2YWx1ZSBzdG9yYWdlIGNsYXNzIHdyYXBwZWQgaW4gYSBQcm94eS5cbiAqXG4gKiAgICBJdCB3aWxsIGFsbG93IHRoZSB1c2VyIHRvIHN0b3JlIGFueSBkZXNpcmVkIHZhbHVlLiBUaGUgY2F0Y2ggaG93ZXZlciBpcyB0aGF0XG4gKiAgICBhbnkgdmFsdWUgc3RvcmVkIGNhbiBvbmx5IGJlIHNldCB0aHJvdWdoIGl0cyBzcGVjaWFsIGBzZXRgIG1ldGhvZC5cbiAqXG4gKiAgICBUaGlzIHdpbGwgYWxsb3cgYW55IGxpc3RlbmVycyB0byByZWNlaXZlIHRoZSBgJ3VwZGF0ZSdgIGV2ZW50IHdoZW4gYSB2YWx1ZSBpcyBzZXQuXG4gKlxuICogICAgU2luY2UgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2VzIGFyZSBhbHNvIGFsd2F5cyB3cmFwcGVkIGluIGEgUHJveHksIHRoZSB1c2VyIG1heVxuICogICAgXCJkaXJlY3RseVwiIGFjY2VzcyBhdHRyaWJ1dGVzIG9mIHRoZSBzdG9yZWQgdmFsdWUuIEZvciBleGFtcGxlLCBpZiBhIGBEeW5hbWljUHJvcGVydHlgXG4gKiAgICBpcyBzdG9yaW5nIGFuIEFycmF5IGluc3RhbmNlLCB0aGVuIG9uZSB3b3VsZCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgYC5sZW5ndGhgIHByb3BlcnR5XG4gKiAgICBcImRpcmVjdGx5XCIsIGkuZS4gYGR5bmFtaWNQcm9wLmxlbmd0aGAuXG4gKlxuICogICAgYER5bmFtaWNQcm9wZXJ0eWAgaGFzIGEgc3BlY2lhbCBgc2V0YCBtZXRob2QsIHdob3NlIG5hbWUgaXMgYSBgc3ltYm9sYCwgdG8gYXZvaWQgY29uZmxpY3RpbmdcbiAqICAgIG5hbWVzcGFjZXMgd2l0aCB0aGUgdW5kZXJseWluZyBkYXRhdHlwZSAoYW5kIHRoZSB3cmFwcGluZyBQcm94eSkuXG4gKiAgICBUbyBzZXQgYSB2YWx1ZSBvbiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCBvbmUgbXVzdCBkbyBzbyBhcyBmb2xsb3dzOiBgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG15TmV3VmFsdWUpYC5cbiAqICAgIFRoaXMgd2lsbCB1cGRhdGUgdGhlIGludGVybmFsIHZhbHVlLCBhbmQgaWYgdGhlIHNldCB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIHN0b3JlZCB2YWx1ZSwgdGhlIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvXG4gKiAgICBhbnkgbGlzdGVuZXJzLlxuICpcbiAqICAgIEFzIGBEeW5hbWljUHJvcGVydHlgIGlzIGFuIFtFdmVudFRhcmdldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0V2ZW50VGFyZ2V0L0V2ZW50VGFyZ2V0KSwgb25lIGNhbiBhdHRhY2hcbiAqICAgIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgYCd1cGRhdGUnYCBldmVudCB0byBsaXN0ZW4gZm9yIHVwZGF0ZXMgdG8gdGhlIHVuZGVybHlpbmcgdmFsdWUuIFRoZSBgJ3VwZGF0ZSdgIGV2ZW50IGlzIHRoZSBvbmx5IGV2ZW50IHRoYXQgaXNcbiAqICAgIGV2ZXIgdHJpZ2dlcmVkIGJ5IHRoaXMgY2xhc3MuIFRoZSByZWNlaXZlZCBgZXZlbnRgIGluc3RhbmNlIGluIGV2ZW50IGNhbGxiYWNrcyB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICogICAgMS4gYHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO2AgLSBgb3JpZ2luYXRvcmAgaXMgdGhlIGluc3RhbmNlIG9mIHRoZSBgRHluYW1pY1Byb3BlcnR5YCB3aGVyZSB0aGUgZXZlbnQgb3JpZ2luYXRlZCBmcm9tLlxuICogICAgMi4gYHVwZGF0ZUV2ZW50Lm9sZFZhbHVlID0gY3VycmVudFZhbHVlO2AgLSBgb2xkVmFsdWVgIGNvbnRhaW5zIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgYmVmb3JlIHNldC5cbiAqICAgIDMuIGB1cGRhdGVFdmVudC52YWx1ZSA9IG5ld1ZhbHVlO2AgLSBgdmFsdWVgIGNvbnRhaW5zIHRoZSBjdXJyZW50IHZhbHVlIGJlaW5nIHNldCBvbiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAuXG4gKlxuICogICAgVG8gcmV0cmlldmUgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAsIG9uZSBtYXkgY2FsbCBgdmFsdWVPZigpYDogYGxldCByYXdWYWx1ZSA9IGR5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCk7YFxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZXMgd2lsbCBpbnRlcm5hbGx5IHRyYWNrIHdoZW4gYSBgc2V0YCBvcGVyYXRpb24gaXMgdW5kZXJ3YXksIHRvIHByZXZlbnRcbiAqICAgICBjeWNsaWMgc2V0cyBhbmQgbWF4aW11bSBjYWxsIHN0YWNrIGVycm9ycy4gWW91IGFyZSBhbGxvd2VkIHRvIHNldCB0aGUgdmFsdWUgcmVjdXJzaXZlbHksIGhvd2V2ZXIgYHVwZGF0ZWAgZXZlbnRzXG4gKiAgICAgd2lsbCBvbmx5IGJlIGRpc3BhdGNoZWQgZm9yIHRoZSBmaXJzdCBgc2V0YCBjYWxsLiBBbnkgYHNldGAgb3BlcmF0aW9uIHRoYXQgaGFwcGVucyB3aGlsZSBhbm90aGVyIGBzZXRgIG9wZXJhdGlvbiBpc1xuICogICAgIHVuZGVyd2F5IHdpbGwgKipub3QqKiBkaXNwYXRjaCBhbnkgYCd1cGRhdGUnYCBldmVudHMuXG4gKiAgIC0gfFxuICogICAgIGAndXBkYXRlJ2AgZXZlbnRzIHdpbGwgYmUgZGlzcGF0Y2hlZCBpbW1lZGlhdGVseSAqYWZ0ZXIqIHRoZSBpbnRlcm5hbCB1bmRlcmx5aW5nIHN0b3JlZCB2YWx1ZSBpcyB1cGRhdGVkLiBUaG91Z2ggaXQgaXNcbiAqICAgICBwb3NzaWJsZSB0byBgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uYCBpbiBhbiBldmVudCBjYWxsYmFjaywgYXR0ZW1wdGluZyB0byBcInByZXZlbnREZWZhdWx0XCIgb3IgXCJzdG9wUHJvcGFnYXRpb25cIiB3aWxsIGRvIG5vdGhpbmcuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gKlxuICogICAgIGR5bmFtaWNQcm9wZXJ0eS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICogICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgVmFsdWUgPSAnJHtkeW5hbWljUHJvcGVydHkudmFsdWVPZigpfSdgKTtcbiAqICAgICB9KTtcbiAqXG4gKiAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKCduZXcgdmFsdWUnKTtcbiAqXG4gKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICogICAgIC8vIG91dHB1dCAtPiBDdXJyZW50IFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbWljUHJvcGVydHkgZXh0ZW5kcyBFdmVudFRhcmdldCB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkgeyAvLyBAcmVmOl9teXRoaXhUeXBlRXhhbXBsZVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gRFlOQU1JQ19QUk9QRVJUWV9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHR5cGU6IFByb3BlcnR5XG4gICAqIG5hbWU6IHNldFxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBzdGF0aWM6IHRydWVcbiAgICogZGVzYzogfFxuICAgKiAgIEEgc3BlY2lhbCBgc3ltYm9sYCB1c2VkIHRvIGFjY2VzcyB0aGUgYHNldGAgbWV0aG9kIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGV4YW1wbGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgYGBgamF2YXNjcmlwdFxuICAgKiAgICAgaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAgICpcbiAgICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHkuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKGV2ZW50KSA9PiB7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICAgKiAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCBWYWx1ZSA9ICcke2R5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCl9J2ApO1xuICAgKiAgICAgfSk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oJ25ldyB2YWx1ZScpO1xuICAgKlxuICAgKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICAgKiAgICAgLy8gb3V0cHV0IC0+IEN1cnJlbnQgVmFsdWUgPSAnaW5pdGlhbCB2YWx1ZSdcbiAgICogICAgIGBgYFxuICAgKi9cbiAgc3RhdGljIHNldCA9IERZTkFNSUNfUFJPUEVSVFlfU0VUOyAvLyBAcmVmOkR5bmFtaWNQcm9wZXJ0eS5zZXRcblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogbmFtZTogY29uc3RydWN0b3JcbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBVdGlsc1xuICAgKiBkZXNjOiB8XG4gICAqICAgQ29uc3RydWN0IGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IGluaXRpYWxWYWx1ZVxuICAgKiAgICAgZGF0YVR5cGU6IGFueVxuICAgKiAgICAgZGVzYzpcbiAgICogICAgICAgVGhlIGluaXRpYWwgdmFsdWUgdG8gc3RvcmUuXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFRoaXMgd2lsbCByZXR1cm4gYSBQcm94eSBpbnN0YW5jZSB3cmFwcGluZyB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogWW91IGNhbiBub3Qgc2V0IGEgYER5bmFtaWNQcm9wZXJ0eWAgdG8gYW5vdGhlciBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAgIElmIGBpbml0aWFsVmFsdWVgIGlzIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIGl0IHdpbGwgdXNlIHRoZSBzdG9yZWQgdmFsdWVcbiAgICogICAgIG9mIHRoYXQgaW5zdGFuY2UgaW5zdGVhZCAoYnkgY2FsbGluZyBAc2VlIER5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mOykuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBEWU5BTUlDX1BST1BFUlRZX1RZUEUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIChCYXNlVXRpbHMuaXNUeXBlKGluaXRpYWxWYWx1ZSwgRHluYW1pY1Byb3BlcnR5KSkgPyBpbml0aWFsVmFsdWUudmFsdWVPZigpIDogaW5pdGlhbFZhbHVlLFxuICAgICAgfSxcbiAgICAgIFtEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCBwcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldCkgOiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXVtwcm9wTmFtZV07XG4gICAgICAgIHJldHVybiAodmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUuYmluZCh0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0pIDogdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2V0OiAgKHRhcmdldCwgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgdGFyZ2V0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpXG4gICAgICByZXR1cm4gK3RoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgZWxzZSBpZiAoaGludCA9PT0gJ3N0cmluZycpXG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS50b1N0cmluZygpIDogKCcnICsgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHR5cGU6IEZ1bmN0aW9uXG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIGRlc2M6IHxcbiAgICogICBGZXRjaCB0aGUgdW5kZXJseWluZyByYXcgdmFsdWUgc3RvcmVkIGJ5IHRoaXMgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlczogYW55OyBUaGUgdW5kZXJsaW5nIHJhdyB2YWx1ZS5cbiAgICovXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogbmFtZTogXCJbRHluYW1pY1Byb3BlcnR5LnNldF1cIlxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBkZXNjOiB8XG4gICAqICAgU2V0IHRoZSB1bmRlcmx5aW5nIHJhdyB2YWx1ZSBzdG9yZWQgYnkgdGhpcyBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICpcbiAgICogICBJZiB0aGUgY3VycmVudCBzdG9yZWQgdmFsdWUgaXMgZXhhY3RseSB0aGUgc2FtZSBhcyB0aGUgcHJvdmlkZWQgYHZhbHVlYCxcbiAgICogICB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IHJldHVybi5cbiAgICpcbiAgICogICBPdGhlcndpc2UsIHdoZW4gdGhlIHVuZGVybHlpbmcgdmFsdWUgaXMgdXBkYXRlZCwgYHRoaXMuZGlzcGF0Y2hFdmVudGAgd2lsbFxuICAgKiAgIGJlIGNhbGxlZCB0byBkaXNwYXRjaCBhbiBgJ3VwZGF0ZSdgIGV2ZW50IHRvIG5vdGlmeSBhbGwgbGlzdGVuZXJzIHRoYXQgdGhlXG4gICAqICAgdW5kZXJseWluZyB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBuZXdWYWx1ZVxuICAgKiAgICAgZGF0YVR5cGU6IGFueVxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbmV3IHZhbHVlIHRvIHNldC4gSWYgdGhpcyBpcyBpdHNlbGYgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgdGhlblxuICAgKiAgICAgICBpdCB3aWxsIGJlIHVud3JhcHBlZCB0byBpdHMgdW5kZXJseWluZyB2YWx1ZSwgYW5kIHRoYXQgd2lsbCBiZSB1c2VkIGFzIHRoZSB2YWx1ZSBpbnN0ZWFkLlxuICAgKiAgIC0gbmFtZTogb3B0aW9uc1xuICAgKiAgICAgb3B0aW9uYWw6IHRydWVcbiAgICogICAgIGRhdGFUeXBlOiBvYmplY3RcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgQW4gb2JqZWN0IHRvIHByb3ZpZGVkIG9wdGlvbnMgZm9yIHRoZSBvcGVyYXRpb24uIFRoZSBzaGFwZSBvZiB0aGlzIG9iamVjdCBpcyBgeyBkaXNwYXRjaFVwZGF0ZUV2ZW50OiBib29sZWFuIH1gLlxuICAgKiAgICAgICBJZiBgb3B0aW9ucy5kaXNwYXRjaFVwZGF0ZUV2ZW50YCBlcXVhbHMgYGZhbHNlYCwgdGhlbiBubyBgJ3VwZGF0ZSdgIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCB0byBsaXN0ZW5lcnMuXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IElmIHRoZSB1bmRlcmx5aW5nIHN0b3JlZCB2YWx1ZSBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIHRoZSB2YWx1ZSBwcm92aWRlZCxcbiAgICogICAgIHRoZW4gbm90aGluZyB3aWxsIGhhcHBlbiwgYW5kIHRoZSBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuLlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFRoZSB1bmRlcmx5aW5nIHZhbHVlIGlzIHVwZGF0ZWQgKmJlZm9yZSogZGlzcGF0Y2hpbmcgZXZlbnRzLlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IGBEeW5hbWljUHJvcGVydHlgIHByb3RlY3RzIGFnYWluc3QgY3ljbGljIGV2ZW50IGNhbGxiYWNrcy4gSWYgYW5cbiAgICogICAgIGV2ZW50IGNhbGxiYWNrIGFnYWluIHNldHMgdGhlIHVuZGVybHlpbmcgYER5bmFtaWNQcm9wZXJ0eWAgdmFsdWUsIHRoZW5cbiAgICogICAgIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCwgYnV0IG5vIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCAodG8gcHJldmVudCBldmVudCBsb29wcykuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogWW91IGNhbiBub3Qgc2V0IGEgYER5bmFtaWNQcm9wZXJ0eWAgdG8gYW5vdGhlciBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAgIElmIHRoaXMgbWV0aG9kIHJlY2VpdmVzIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIGl0IHdpbGwgdXNlIHRoZSBzdG9yZWQgdmFsdWVcbiAgICogICAgIG9mIHRoYXQgaW5zdGFuY2UgaW5zdGVhZCAoYnkgY2FsbGluZyBAc2VlIER5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mOykuXG4gICAqL1xuICBbRFlOQU1JQ19QUk9QRVJUWV9TRVRdKF9uZXdWYWx1ZSwgX29wdGlvbnMpIHtcbiAgICBsZXQgbmV3VmFsdWUgPSBfbmV3VmFsdWU7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUobmV3VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpXG4gICAgICBuZXdWYWx1ZSA9IG5ld1ZhbHVlLnZhbHVlT2YoKTtcblxuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID09PSBuZXdWYWx1ZSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10pIHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IHRydWU7XG5cbiAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmIChvcHRpb25zLmRpc3BhdGNoVXBkYXRlRXZlbnQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCB1cGRhdGVFdmVudCA9IG5ldyBFdmVudCgndXBkYXRlJyk7XG5cbiAgICAgIHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO1xuICAgICAgdXBkYXRlRXZlbnQub2xkVmFsdWUgPSBvbGRWYWx1ZTtcbiAgICAgIHVwZGF0ZUV2ZW50LnZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh1cGRhdGVFdmVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10gPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5EeW5hbWljUHJvcGVydHkgPSBEeW5hbWljUHJvcGVydHk7XG4iLCJpbXBvcnQge1xuICBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSxcbiAgTVlUSElYX1RZUEUsXG4gIFFVRVJZX0VOR0lORV9UWVBFLFxuICBVTkZJTklTSEVEX0RFRklOSVRJT04sXG59IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuaW1wb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJy4vZHluYW1pYy1wcm9wZXJ0eS5qcyc7XG5cbmNvbnN0IFNVQlNUSVRVVEVfQ0hBUl9DT0RFID0gMjY7XG5cbi8qKlxuICogdHlwZTogTmFtZXNwYWNlXG4gKiBuYW1lOiBFbGVtZW50c1xuICogZ3JvdXBOYW1lOiBFbGVtZW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgRWxlbWVudHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgIFV0aWxpdHkgYW5kIGVsZW1lbnQgYnVpbGRpbmcgZnVuY3Rpb25zIGZvciB0aGUgRE9NLlxuICovXG5cbmNvbnN0IElTX1BST1BfTkFNRSAgICA9IC9ecHJvcFxcJC87XG5jb25zdCBJU19UQVJHRVRfUFJPUCAgPSAvXnByb3RvdHlwZXxjb25zdHJ1Y3RvciQvO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudERlZmluaXRpb24ge1xuICBzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0oaW5zdGFuY2UpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChpbnN0YW5jZSAmJiBpbnN0YW5jZVtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IodGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIEVMRU1FTlRfREVGSU5JVElPTl9UWVBFLFxuICAgICAgfSxcbiAgICAgICd0YWdOYW1lJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRhZ05hbWUsXG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH0sXG4gICAgICAnY2hpbGRyZW4nOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgY2hpbGRyZW4gfHwgW10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9TdHJpbmcoX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuICAgIGxldCB0YWdOYW1lID0gdGhpcy50YWdOYW1lO1xuICAgIGlmICh0YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy52YWx1ZS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuXG4gICAgbGV0IGF0dHJzID0gKHRhZ05hbWUgPT09ICcjZnJhZ21lbnQnKSA/IG51bGwgOiAoKGF0dHJpYnV0ZXMpID0+IHtcbiAgICAgIGxldCBwYXJ0cyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBbIGF0dHJpYnV0ZU5hbWUsIHZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGxldCBuYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICAgIHBhcnRzLnB1c2gobmFtZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwYXJ0cy5wdXNoKGAke25hbWV9PVwiJHtlbmNvZGVBdHRyaWJ1dGVWYWx1ZSh2YWx1ZSl9XCJgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJyAnKTtcbiAgICB9KSh0aGlzLmF0dHJpYnV0ZXMpO1xuXG4gICAgbGV0IGNoaWxkcmVuID0gKChjaGlsZHJlbikgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiAoY2hpbGQgIT0gbnVsbCAmJiBjaGlsZCAhPT0gZmFsc2UgJiYgIU9iamVjdC5pcyhjaGlsZCwgTmFOKSkpXG4gICAgICAgIC5tYXAoKGNoaWxkKSA9PiAoKGNoaWxkICYmIHR5cGVvZiBjaGlsZC50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyBjaGlsZC50b1N0cmluZyhvcHRpb25zKSA6ICgnJyArIGNoaWxkKSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICB9KSh0aGlzLmNoaWxkcmVuKTtcblxuICAgIGlmICh0YWdOYW1lID09PSAnI2ZyYWdtZW50JylcbiAgICAgIHJldHVybiBjaGlsZHJlbjtcblxuICAgIC8vIHRoaXMgd2lsbCBtb3JlIGNvbW1vbmx5IGxvb2sgbGlrZSB3cml0dGVuIGh0bWxcbiAgICB0YWdOYW1lID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGVsZW1lbnRUYWdTdGFydCA9IGA8JHt0YWdOYW1lfSR7KGF0dHJzKSA/IGAgJHthdHRyc31gIDogJyd9PmA7XG4gICAgbGV0IGVsZW1lbnRUYWdFbmQgICA9IGA8LyR7dGFnTmFtZX0+YDtcblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucywgJ21hc2tIVE1MJykpIHtcbiAgICAgIGxldCBjaGFyQ29kZSA9ICh0eXBlb2Ygb3B0aW9ucy5tYXNrSFRNTCA9PT0gJ251bWJlcicpID8gU3RyaW5nLmZyb21DaGFyQ29kZShTVUJTVElUVVRFX0NIQVJfQ09ERSkgOiBvcHRpb25zLm1hc2tIVE1MO1xuICAgICAgY29uc3Qgd2lwZUJsYW5rID0gKGNvbnRlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvLi9nLCBjaGFyQ29kZSk7XG4gICAgICB9O1xuXG4gICAgICBlbGVtZW50VGFnU3RhcnQgPSB3aXBlQmxhbmsoZWxlbWVudFRhZ1N0YXJ0KTtcbiAgICAgIGVsZW1lbnRUYWdFbmQgPSB3aXBlQmxhbmsoZWxlbWVudFRhZ0VuZCk7XG5cbiAgICAgIGlmIChvcHRpb25zLm1hc2tDaGlsZHJlblBhdHRlcm4gJiYgb3B0aW9ucy5tYXNrQ2hpbGRyZW5QYXR0ZXJuLnRlc3QodGFnTmFtZSkpXG4gICAgICAgIGNoaWxkcmVuID0gd2lwZUJsYW5rKGNoaWxkcmVuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7ZWxlbWVudFRhZ1N0YXJ0fSR7KGlzVm9pZFRhZyh0YWdOYW1lKSkgPyAnJyA6IGAke2NoaWxkcmVufSR7ZWxlbWVudFRhZ0VuZH1gfWA7XG4gIH1cblxuICB0b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBidWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI2ZyYWdtZW50JylcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykpO1xuXG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0cmlidXRlcy52YWx1ZSB8fCAnJyksIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICBpZiAobmFtZXNwYWNlVVJJKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy50YWdOYW1lKTtcblxuICAgIGNvbnN0IGV2ZW50TmFtZXMgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICBVdGlscy5jcmVhdGVTY29wZShlbGVtZW50LCB0ZW1wbGF0ZU9wdGlvbnMuc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLFxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgaGFuZGxlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgZWxzZVxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGNoaWxkICAgICAgICAgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IGNoaWxkRWxlbWVudCAgPSBjaGlsZC5idWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWxlbWVudCkpXG4gICAgICAgICAgY2hpbGRFbGVtZW50LmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGNoaWxkKSA9PiBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKFxuICAgICAgdGhpcyxcbiAgICAgIGVsZW1lbnQsXG4gICAgICB7XG4gICAgICAgIC4uLnRlbXBsYXRlT3B0aW9ucyxcbiAgICAgICAgcHJvY2Vzc0V2ZW50Q2FsbGJhY2tzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBJU19IVE1MX1NBRkVfQ0hBUkFDVEVSID0gL15bXFxzYS16QS1aMC05Xy1dJC87XG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLy4vZywgKG0pID0+IHtcbiAgICByZXR1cm4gKElTX0hUTUxfU0FGRV9DSEFSQUNURVIudGVzdChtKSkgPyBtIDogYCYjJHttLmNoYXJDb2RlQXQoMCl9O2A7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlQXR0cmlidXRlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL1tcIiZdL2csIChtKSA9PiB7XG4gICAgcmV0dXJuIGAmIyR7bS5jaGFyQ29kZUF0KDApfTtgO1xuICB9KTtcbn1cblxuY29uc3QgSVNfVk9JRF9UQUcgPSAvXmFyZWF8YmFzZXxicnxjb2x8ZW1iZWR8aHJ8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyJC9pO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVm9pZFRhZyh0YWdOYW1lKSB7XG4gIHJldHVybiBJU19WT0lEX1RBRy50ZXN0KHRhZ05hbWUuc3BsaXQoJzonKS5zbGljZSgtMSlbMF0pO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkTm9kZVR5cGUoaXRlbSkge1xuICBpZiAoIWl0ZW0pXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlUZW1wbGF0ZShvd25lckRvY3VtZW50LCBuYW1lT3JJRCkge1xuICBpZiAobmFtZU9ySUQgaW5zdGFuY2VvZiBOb2RlKVxuICAgIHJldHVybiBuYW1lT3JJRDtcblxuICBpZiAoIW93bmVyRG9jdW1lbnQpXG4gICAgcmV0dXJuO1xuXG4gIGxldCByZXN1bHQgPSBvd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVPcklEKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmVzdWx0ID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0ZW1wbGF0ZVtkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZT1cIiR7bmFtZU9ySUR9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke25hbWVPcklEfVwiIGldYCk7XG5cbiAgaWYgKCFyZXN1bHQpXG4gICAgcmVzdWx0ID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5hbWVPcklEKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJOb2RlVHJlZShub2RlLCBmaWx0ZXJGdW5jKSB7XG4gIGlmICghZmlsdGVyRnVuYy5jYWxsKHRoaXMsIG5vZGUpKVxuICAgIHJldHVybjtcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG4gIGZvciAobGV0IGNoaWxkTm9kZSBvZiBjaGlsZHJlbikge1xuICAgIGxldCByZXN1bHQgPSBmaWx0ZXJOb2RlVHJlZShjaGlsZE5vZGUsIGZpbHRlckZ1bmMpO1xuICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBjb21waWxlTWVyZ2VGcmFnbWVudChvd25lckRvY3VtZW50LCBub2RlKSB7XG4gIGxldCBmcmFnbWVudCAgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgbGV0IHNlbGVjdG9ycyA9IChub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1mcm9tJykgfHwgJycpLnNwbGl0KCcsJykubWFwKCgocGFydCkgPT4gcGFydC50cmltKCkpKS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gc2VsZWN0b3JzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgc2VsZWN0b3IgID0gc2VsZWN0b3JzW2ldO1xuICAgIGxldCBlbGVtZW50ICAgPSBxdWVyeVRlbXBsYXRlKG93bmVyRG9jdW1lbnQsIHNlbGVjdG9yKTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgbGV0IGNsb25lZE5vZGUgID0gKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyBlbGVtZW50LmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpIDogZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBsZXQgZmlsdGVyICAgICAgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcbiAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgY2xvbmVkTm9kZSA9IGZpbHRlck5vZGVUcmVlLmNhbGwodGhpcywgY2xvbmVkTm9kZSwgKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gISh0eXBlb2Ygbm9kZS5tYXRjaGVzID09PSAnZnVuY3Rpb24nICYmIG5vZGUubWF0Y2hlcyhmaWx0ZXIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNsb25lZE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEVfTUVSR0VfRUxFTUVOVCA9IC9ebXl0aGl4LW1lcmdlJC9pO1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NFbGVtZW50cyhfbm9kZSwgX29wdGlvbnMpIHtcbiAgbGV0IG5vZGUgPSBfbm9kZTtcbiAgaWYgKCFub2RlKVxuICAgIHJldHVybiBub2RlO1xuXG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBzY29wZSAgICAgICAgID0gb3B0aW9ucy5zY29wZTtcbiAgaWYgKCFzY29wZSkge1xuICAgIHNjb3BlID0gVXRpbHMuY3JlYXRlU2NvcGUobm9kZSk7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2NvcGUgfTtcbiAgfVxuXG4gIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciA9IChvcHRpb25zLmZvcmNlVGVtcGxhdGVFbmdpbmUgPT09IHRydWUpID8gdW5kZWZpbmVkIDogb3B0aW9ucy5kaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcjtcbiAgbGV0IGNoaWxkcmVuICAgICAgICAgICAgICAgICAgICAgID0gQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpO1xuXG4gIGlmIChvcHRpb25zLmZvcmNlVGVtcGxhdGVFbmdpbmUgIT09IHRydWUgJiYgIWRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKSB7XG4gICAgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgPSBVdGlscy5nZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpO1xuICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yIH07XG4gIH1cblxuICBsZXQgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkID0gZmFsc2U7XG4gIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciAmJiBVdGlscy5zcGVjaWFsQ2xvc2VzdChub2RlLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcikpXG4gICAgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaGVscGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuaGVscGVyLmNhbGwodGhpcywgeyBzY29wZSwgb3B0aW9ucywgbm9kZSwgY2hpbGRyZW4sIGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCwgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgfSk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICBub2RlID0gcmVzdWx0O1xuICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGxldCBvd25lckRvY3VtZW50ID0gb3B0aW9ucy5vd25lckRvY3VtZW50IHx8IHNjb3BlLm93bmVyRG9jdW1lbnQgfHwgbm9kZS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkge1xuICAgIGlmICghaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gVXRpbHMuZm9ybWF0Tm9kZVZhbHVlKG5vZGUsIG9wdGlvbnMpO1xuICAgICAgaWYgKChBcnJheS5pc0FycmF5KHJlc3VsdCkgJiYgcmVzdWx0LnNvbWUoaXNWYWxpZE5vZGVUeXBlKSkgfHwgaXNWYWxpZE5vZGVUeXBlKHJlc3VsdCkpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpXG4gICAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXN1bHQpIHtcbiAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBpdGVtLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHsgc2NvcGUgfSk7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnRzKVxuICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudHMpKVxuICAgICAgICAgICAgICBlbGVtZW50cy5mbGF0KEluZmluaXR5KS5mb3JFYWNoKChlbGVtZW50KSA9PiBmcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsZW1lbnRzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSkge1xuICAgICAgICAgICAgaXRlbS5hcHBlbmRUbyhmcmFnbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoKCcnICsgaXRlbSkpO1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmcmFnbWVudDtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSkge1xuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9ICByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFKSB7XG4gICAgaWYgKElTX1RFTVBMQVRFX01FUkdFX0VMRU1FTlQudGVzdChub2RlLnRhZ05hbWUpKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBjb21waWxlTWVyZ2VGcmFnbWVudC5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQsIG5vZGUpO1xuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIGZyYWdtZW50LCB7IC4uLm9wdGlvbnMsIHNjb3BlIH0pO1xuICAgIH1cblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChub2RlKTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMucHJvY2Vzc0V2ZW50Q2FsbGJhY2tzICE9PSBmYWxzZSkge1xuICAgICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgICAgVXRpbHMuY3JlYXRlU2NvcGUobm9kZSwgc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChVdGlscy5pc1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5vZGUpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyAuLi5vcHRpb25zLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvY2Vzc0NoaWxkcmVuID09PSBmYWxzZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgY2hpbGROb2RlLCBvcHRpb25zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSAmJiByZXN1bHQgIT09IGNoaWxkTm9kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQocmVzdWx0LCBjaGlsZE5vZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBOT09QXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZChwYXJlbnROb2RlLCBjaGlsZE5vZGUpIHtcbiAgaWYgKCFwYXJlbnROb2RlIHx8ICFjaGlsZE5vZGUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20ocGFyZW50Tm9kZS5jaGlsZE5vZGVzKSkge1xuICAgIGlmIChjaGlsZCA9PT0gY2hpbGROb2RlKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFCYXNlVXRpbHMuaXNUeXBlKHRhZ05hbWUsICc6OlN0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBjb25zdCB3cmFuZ2xlQ2hpbGRyZW4gPSAoY2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiBjaGlsZHJlbi5mbGF0KEluZmluaXR5KS5tYXAoKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgICByZXR1cm4gdmFsdWUoKTtcblxuICAgICAgICBpZiAodmFsdWVbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSlcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpXG4gICAgICAgICAgcmV0dXJuIHdyYW5nbGVDaGlsZHJlbih2YWx1ZS5nZXRVbmRlcmx5aW5nQXJyYXkoKSk7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgICAgICByZXR1cm4gbm9kZVRvRWxlbWVudERlZmluaXRpb24odmFsdWUpO1xuXG4gICAgICAgIGlmICghQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9O1xuXG4gICAgbGV0IGNoaWxkcmVuID0gd3JhbmdsZUNoaWxkcmVuKF9jaGlsZHJlbiB8fCBbXSk7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZTogKCcnICsgbm9kZS5ub2RlVmFsdWUpIH0pO1xuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBub2RlLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG5cbiAgaWYgKHR5cGVvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gIH1cblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbigobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSA/ICcjZnJhZ21lbnQnIDogbm9kZS50YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbik7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gL14odGVtcGxhdGUpJC9pO1xuXG4vKipcbiAgICogcGFyZW50OiBFbGVtZW50c1xuICAgKiBncm91cE5hbWU6IEVsZW1lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBbG1vc3QgbGlrZSBgT2JqZWN0LmFzc2lnbmAsIG1lcmdlIGFsbCBjb21wb25lbnQgY2hpbGRyZW4gaW50byBhIHNpbmdsZSBub2RlICh0aGUgYHRhcmdldGApLlxuICAgKlxuICAgKiAgIFRoaXMgaXMgXCJ0ZW1wbGF0ZSBpbnRlbGxpZ2VudFwiLCBtZWFuaW5nIGZvciBgPHRlbXBsYXRlPmAgZWxlbWVudHMgc3BlY2lmaWNhbGx5LCBpdCB3aWxsIGV4ZWN1dGVcbiAgICogICBgY2hpbGRyZW4gPSB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzYCB0byBjbG9uZSBhbGwgdGhlIGNoaWxkIG5vZGVzLCBhbmQgbm90XG4gICAqICAgbW9kaWZ5IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZS4gSXQgaXMgYWxzbyB0ZW1wbGF0ZSBpbnRlbGxpZ2VudCBieSB0aGUgZmFjdCB0aGF0IGlmIHRoZSBgdGFyZ2V0YCBpc1xuICAgKiAgIGEgdGVtcGxhdGUsIGl0IHdpbGwgYWRkIHRoZSBjaGlsZHJlbiB0byBgY29udGVudGAgcHJvcGVybHkuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IHRhcmdldFxuICAgKiAgICAgZGF0YVR5cGVzOiBOb2RlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSB0YXJnZXQgTm9kZSB0byBtZXJnZSBhbGwgY2hpbGRyZW4gaW50by4gSWYgdGhpcyBOb2RlIGlzIGEgYDx0ZW1wbGF0ZT5gIE5vZGUsIHRoZW4gaXQgd2lsbFxuICAgKiAgICAgICBwbGFjZSBhbGwgdGhlIG1lcmdlZCBjaGlsZHJlbiBpbnRvIGB0ZW1wbGF0ZS5jb250ZW50YC5cbiAgICogbm90ZXM6XG4gICAqICAgLSBBbnkgdGVtcGxhdGUgTm9kZSB3aWxsIGJlIGNsb25lZCwgYW5kIHNvIHRoZSBvcmlnaW5hbCB3aWxsIG5vdCBiZSBtb2RpZmllZC4gQWxsIG90aGVyIG5vZGVzIGFyZSAqKk5PVCoqXG4gICAqICAgICBjbG9uZWQgYmVmb3JlIHRoZSBtZXJnZSwgYW5kIHNvIHdpbGwgYmUgc3RyaXBwZWQgb2YgdGhlaXIgY2hpbGRyZW4uXG4gICAqICAgLSBNYWtlIGNlcnRhaW4geW91IGRlZXAgY2xvbmUgYW55IGVsZW1lbnQgZmlyc3QgKGV4Y2VwdCB0ZW1wbGF0ZXMpIGlmIHlvdSBkb24ndCB3YW50IHRoZSBwcm92aWRlZCBlbGVtZW50c1xuICAgKiAgICAgdG8gYmUgbW9kaWZpZWQuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBOb2RlOyBUaGUgcHJvdmlkZWQgYHRhcmdldGAsIHdpdGggYWxsIGNoaWxkcmVuIG1lcmdlZCAoYWRkZWQpIGludG8gaXQuXG4gICAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgcmV0dXJuIHRhcmdldDtcblxuICBsZXQgdGFyZ2V0SXNUZW1wbGF0ZSA9IElTX1RFTVBMQVRFLnRlc3QodGFyZ2V0LnRhZ05hbWUpO1xuICBmb3IgKGxldCBvdGhlciBvZiBvdGhlcnMpIHtcbiAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIE5vZGUpKVxuICAgICAgY29udGludWU7XG5cbiAgICBsZXQgY2hpbGROb2RlcyA9IChJU19URU1QTEFURS50ZXN0KG90aGVyLnRhZ05hbWUpKSA/IG90aGVyLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXMgOiBvdGhlci5jaGlsZE5vZGVzO1xuICAgIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20oY2hpbGROb2RlcykpIHtcbiAgICAgIGxldCBjb250ZW50ID0gKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpID8gY2hpbGQuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiBjaGlsZDtcbiAgICAgIGlmICh0YXJnZXRJc1RlbXBsYXRlKVxuICAgICAgICB0YXJnZXQuY29udGVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IElTX1NWR19FTEVNRU5UX05BTUUgPSAvXihhbHRnbHlwaHxhbHRnbHlwaGRlZnxhbHRnbHlwaGl0ZW18YW5pbWF0ZXxhbmltYXRlQ29sb3J8YW5pbWF0ZU1vdGlvbnxhbmltYXRlVHJhbnNmb3JtfGFuaW1hdGlvbnxjaXJjbGV8Y2xpcFBhdGh8Y29sb3JQcm9maWxlfGN1cnNvcnxkZWZzfGRlc2N8ZGlzY2FyZHxlbGxpcHNlfGZlYmxlbmR8ZmVjb2xvcm1hdHJpeHxmZWNvbXBvbmVudHRyYW5zZmVyfGZlY29tcG9zaXRlfGZlY29udm9sdmVtYXRyaXh8ZmVkaWZmdXNlbGlnaHRpbmd8ZmVkaXNwbGFjZW1lbnRtYXB8ZmVkaXN0YW50bGlnaHR8ZmVkcm9wc2hhZG93fGZlZmxvb2R8ZmVmdW5jYXxmZWZ1bmNifGZlZnVuY2d8ZmVmdW5jcnxmZWdhdXNzaWFuYmx1cnxmZWltYWdlfGZlbWVyZ2V8ZmVtZXJnZW5vZGV8ZmVtb3JwaG9sb2d5fGZlb2Zmc2V0fGZlcG9pbnRsaWdodHxmZXNwZWN1bGFybGlnaHRpbmd8ZmVzcG90bGlnaHR8ZmV0aWxlfGZldHVyYnVsZW5jZXxmaWx0ZXJ8Zm9udHxmb250RmFjZXxmb250RmFjZUZvcm1hdHxmb250RmFjZU5hbWV8Zm9udEZhY2VTcmN8Zm9udEZhY2VVcml8Zm9yZWlnbk9iamVjdHxnfGdseXBofGdseXBoUmVmfGhhbmRsZXJ8aEtlcm58aW1hZ2V8bGluZXxsaW5lYXJncmFkaWVudHxsaXN0ZW5lcnxtYXJrZXJ8bWFza3xtZXRhZGF0YXxtaXNzaW5nR2x5cGh8bVBhdGh8cGF0aHxwYXR0ZXJufHBvbHlnb258cG9seWxpbmV8cHJlZmV0Y2h8cmFkaWFsZ3JhZGllbnR8cmVjdHxzZXR8c29saWRDb2xvcnxzdG9wfHN2Z3xzd2l0Y2h8c3ltYm9sfHRicmVha3x0ZXh0fHRleHRwYXRofHRyZWZ8dHNwYW58dW5rbm93bnx1c2V8dmlld3x2S2VybikkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1NWR19FTEVNRU5UX05BTUUudGVzdCh0YWdOYW1lKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuZXhwb3J0IGNvbnN0IEVsZW1lbnRHZW5lcmF0b3IgPSBuZXcgUHJveHkoXG4gIHtcbiAgICBUZXJtLFxuICAgICRURVhUOiBUZXJtLFxuICB9LFxuICB7XG4gICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BOYW1lKSB7XG4gICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgaWYgKElTX1NWR19FTEVNRU5UX05BTUUudGVzdChwcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gU1ZHIGVsZW1lbnRzXG4gICAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSwgeyBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTk9PUFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSxcbik7XG4iLCJpbXBvcnQge1xuICBNWVRISVhfVFlQRSxcbiAgTVlUSElYX1VJX0NPTVBPTkVOVF9UWVBFLFxuICBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQsXG4gIE1ZVEhJWF9TSEFET1dfUEFSRU5ULFxuICBVTkZJTklTSEVEX0RFRklOSVRJT04sXG59IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuaW1wb3J0ICogYXMgQ29tcG9uZW50VXRpbHMgIGZyb20gJy4vY29tcG9uZW50LXV0aWxzLmpzJztcbmltcG9ydCAqIGFzIEJhc2VVdGlscyAgICAgICBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgICAgICAgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgUXVlcnlFbmdpbmUgfSAgICAgIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgICAgICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuZXhwb3J0IGNvbnN0IGlzTXl0aGl4Q29tcG9uZW50ID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pcy1teXRoaXgtY29tcG9uZW50Jyk7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuaXNNeXRoaXhDb21wb25lbnRcblxuY29uc3QgSVNfQVRUUl9NRVRIT0RfTkFNRSAgID0gL15hdHRyXFwkKC4qKSQvO1xuY29uc3QgUkVHSVNURVJFRF9DT01QT05FTlRTID0gbmV3IFNldCgpO1xuXG4vKioqXG4gKiBncm91cE5hbWU6IE15dGhpeFVJQ29tcG9uZW50XG4gKiBkZXNjOiB8XG4gKiAgIFRoaXMgdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIE15dGhpeCBVSSBjb21wb25lbnRzLiBJdCBpbmhlcml0c1xuICogICBmcm9tIEhUTUxFbGVtZW50LCBhbmQgc28gd2lsbCBlbmQgdXAgYmVpbmcgYSBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKS5cbiAqXG4gKiAgIEl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91IGZ1bGx5IHJlYWQgdXAgYW5kIHVuZGVyc3RhbmRcbiAqICAgW1dlYiBDb21wb25lbnRzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpXG4gKiAgIGlmIHlvdSBkb24ndCBhbHJlYWR5IGZ1bGx5IHVuZGVyc3RhbmQgdGhlbS4gVGhlIGNvcmUgb2YgTXl0aGl4IFVJIGlzIHRoZVxuICogICBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKSBzdGFuZGFyZCxcbiAqICAgc28geW91IG1pZ2h0IGVuZCB1cCBhIGxpdHRsZSBjb25mdXNlZCBpZiB5b3UgZG9uJ3QgYWxyZWFkeSB1bmRlcnN0YW5kIHRoZSBmb3VuZGF0aW9uLlxuICpcbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gY2FwdGlvbjogXCIuLi4gSFRNTEVsZW1lbnQgSW5zdGFuY2UgUHJvcGVydGllc1wiXG4gKiAgICAgZGVzYzogXCJBbGwgW0hUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzKSBhcmUgaW5oZXJpdGVkIGZyb20gW0hUTUxFbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQpXCJcbiAqICAgICBsaW5rOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQjaW5zdGFuY2VfcHJvcGVydGllc1xuICpcbiAqICAgLSBuYW1lOiBpc015dGhpeENvbXBvbmVudFxuICogICAgIGRhdGFUeXBlOiBib29sZWFuXG4gKiAgICAgY2FwdGlvbjogXCJbc3RhdGljIE15dGhpeFVJQ29tcG9uZW50LmlzTXl0aGl4Q29tcG9uZW50XVwiXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgSXMgYHRydWVgIGZvciBNeXRoaXggVUkgY29tcG9uZW50cy5cbiAqICAgLSBuYW1lOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGNhcHRpb246IHNlbnNpdGl2ZVRhZ05hbWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBXb3JrcyBpZGVudGljYWxseSB0byBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSBmb3IgWE1MLCB3aGVyZSBjYXNlIGlzIHByZXNlcnZlZC5cbiAqICAgICAgIEluIEhUTUwgdGhpcyB3b3JrcyBsaWtlIFtFbGVtZW50LnRhZ05hbWVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3RhZ05hbWUpLCBidXQgaW5zdGVhZCBvZiB0aGUgcmVzdWx0XG4gKiAgICAgICBhbHdheXMgYmVpbmcgVVBQRVJDQVNFLCB0aGUgdGFnIG5hbWUgd2lsbCBiZSByZXR1cm5lZCB3aXRoIHRoZSBjYXNpbmcgcHJlc2VydmVkLlxuICogICAtIG5hbWU6IHRlbXBsYXRlSURcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgY2FwdGlvbjogdGVtcGxhdGVJRFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlIHZhbHVlIG9mIGB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lEYFxuICogICAtIG5hbWU6IGRlbGF5VGltZXJzXG4gKiAgICAgZGF0YVR5cGU6IFwiTWFwJmx0O3N0cmluZywgUHJvbWlzZSZndDtcIlxuICogICAgIGNhcHRpb246IGRlbGF5VGltZXJzXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgQSBNYXAgaW5zdGFuY2UgdGhhdFxuICogICAgICAgcmV0YWlucyBgc2V0VGltZW91dGAgaWRzIHNvIHRoYXQgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5kZWJvdW5jZTsgY2FuIHByb3Blcmx5IGZ1bmN0aW9uLiBLZXlzIGFyZSBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAgICAgdGltZXIgaWRzIChvZiB0eXBlIGBzdHJpbmdgKS4gVmFsdWVzIGFyZSBQcm9taXNlIGluc3RhbmNlcy5cbiAqICAgICAgIEVhY2ggcHJvbWlzZSBpbnN0YW5jZSBhbHNvIGhhcyBhIHNwZWNpYWwga2V5IGB0aW1lcklEYCB0aGF0IGNvbnRhaW5zIGEgYHNldFRpbWVvdXRgIGlkIG9mIGEgamF2YXNjcmlwdCB0aW1lci5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAtIG5hbWU6IHNoYWRvd1xuICogICAgIGRhdGFUeXBlOiBcIltTaGFkb3dSb290XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2hhZG93Um9vdClcIlxuICogICAgIGNhcHRpb246IHNoYWRvd1xuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBzaGFkb3cgcm9vdCBvZiB0aGlzIGNvbXBvbmVudCAob3IgYG51bGxgIGlmIG5vbmUpLlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSBUaGlzIGlzIHRoZSBjYWNoZWQgcmVzdWx0IG9mIGNhbGxpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5jcmVhdGVTaGFkb3dET007IHdoZW5cbiAqICAgICAgICAgdGhlIGNvbXBvbmVudCBpcyBmaXJzdCBpbml0aWFsaXplZC5cbiAqICAgLSBuYW1lOiB0ZW1wbGF0ZVxuICogICAgIGRhdGFUeXBlOiBcIlt0ZW1wbGF0ZSBlbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvdGVtcGxhdGUpXCJcbiAqICAgICBjYXB0aW9uOiB0ZW1wbGF0ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBbdGVtcGxhdGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC90ZW1wbGF0ZSkgZWxlbWVudCBmb3IgdGhpc1xuICogICAgICAgY29tcG9uZW50LCBvciBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gdGVtcGxhdGUgZm91bmQgZm9yIHRoZSBjb21wb25lbnQuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIFRoaXMgaXMgdGhlIGNhY2hlZCByZXN1bHQgb2YgY2FsbGluZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmdldENvbXBvbmVudFRlbXBsYXRlOyB3aGVuXG4gKiAgICAgICAgIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgaW5pdGlhbGl6ZWQuXG4qKiovXG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIGlzTXl0aGl4Q29tcG9uZW50ID0gaXNNeXRoaXhDb21wb25lbnQ7XG5cbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBNWVRISVhfVUlfQ09NUE9ORU5UX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBzdGF0aWMgY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudDtcbiAgc3RhdGljIHJlZ2lzdGVyID0gZnVuY3Rpb24oX25hbWUsIF9LbGFzcykge1xuICAgIGxldCBuYW1lID0gX25hbWUgfHwgdGhpcy50YWdOYW1lIHx8IEJhc2VVdGlscy50b0tlYmFiQ2FzZSh0aGlzLm5hbWUpO1xuXG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpIHtcbiAgICAgIGxldCBLbGFzcyA9IF9LbGFzcyB8fCB0aGlzO1xuXG4gICAgICBsZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAoS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdKS5jb25jYXQoS2xhc3MuY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMoS2xhc3MpKSxcbiAgICAgICAgKSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMubGVuZ3RoID4gMClcbiAgICAgICAgS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVnaXN0ZXJFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc3RhdGljIGNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24oS2xhc3MpIHtcbiAgICBjb25zdCBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzID0gKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSkgPT4ge1xuICAgICAgaWYgKFJFR0lTVEVSRURfQ09NUE9ORU5UUy5oYXMoS2xhc3MpKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCB7IGRlc2NyaXB0b3IgfSA9IFV0aWxzLmdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4ocHJvdG8sIG9yaWdpbmFsTmFtZSk7XG4gICAgICBpZiAoIWRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhpcyBmcm9tXG4gICAgICAvLyB0aGUgcHJvdG90eXBlLCBhcyBjaGlsZCBjbGFzc2VzIHdpbGxcbiAgICAgIC8vIHdhbnQgdG8gaW5oZXJpdCBhdHRyaWJ1dGUgYmVoYXZpb3IuXG4gICAgICAvLyBkZWxldGUgcHJvdG90eXBlW29yaWdpbmFsTmFtZV07XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGUgdXNlciBkaWQgaXQgd3JvbmcuLi5cbiAgICAgIC8vIHNvIGp1c3QgbWFrZSBpdCB0aGUgXCJzZXR0ZXJcIlxuICAgICAgbGV0IHNldHRlciAgICA9IGRlc2NyaXB0b3Iuc2V0IHx8IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICBsZXQgZ2V0dGVyICAgID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICBsZXQgaGFzU2V0dGVyID0gKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgICAgbGV0IGhhc0dldHRlciA9ICh0eXBlb2YgZ2V0dGVyID09PSAnZnVuY3Rpb24nKTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvdG8sIHtcbiAgICAgICAgW3Byb3BlcnR5TmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChoYXNHZXR0ZXIpID8gZ2V0dGVyLmNhbGwodGhpcykgOiB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXR0cihhdHRyaWJ1dGVOYW1lLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNTZXR0ZXIpXG4gICAgICAgICAgICAgIHNldHRlci5jYWxsKHRoaXMsIFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IHByb3RvICAgICAgICAgICA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gVXRpbHMuZ2V0QWxsUHJvcGVydHlOYW1lcyhwcm90bylcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IElTX0FUVFJfTUVUSE9EX05BTUUudGVzdChuYW1lKSlcbiAgICAgIC5tYXAoKG9yaWdpbmFsTmFtZSkgPT4ge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lICA9IG9yaWdpbmFsTmFtZS5tYXRjaChJU19BVFRSX01FVEhPRF9OQU1FKVsxXTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBCYXNlVXRpbHMudG9LZWJhYkNhc2UocHJvcGVydHlOYW1lKTtcblxuICAgICAgICBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhdHRyaWJ1dGVOYW1lcykpO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBkZXNjOiB8XG4gICAqICAgQ2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBhZGRlZCB0byB0aGUgRE9NLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBtdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGF0YVR5cGVzOiBNdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgTXV0YXRpb25SZWNvcmQgaW5zdGFuY2UgdGhhdCB0aGF0IGNhdXNlZCB0aGlzIG1ldGhvZCB0byBiZSBjYWxsZWQuXG4gICAqL1xuICBvbk11dGF0aW9uQWRkZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25SZW1vdmVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiBhbiBlbGVtZW50IGlzIGFkZGVkIGFzIGEgY2hpbGQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5vZGVcbiAgICogICAgIGRhdGFUeXBlczogRWxlbWVudFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgY2hpbGQgZWxlbWVudCBiZWluZyBhZGRlZC5cbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiBhIGNoaWxkIGVsZW1lbnQgaXMgcmVtb3ZlZC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbm9kZVxuICAgKiAgICAgZGF0YVR5cGVzOiBFbGVtZW50XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBjaGlsZCBlbGVtZW50IGJlaW5nIHJlbW92ZWQuXG4gICAqICAgLSBuYW1lOiBtdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGF0YVR5cGVzOiBNdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgTXV0YXRpb25SZWNvcmQgaW5zdGFuY2UgdGhhdCB0aGF0IGNhdXNlZCB0aGlzIG1ldGhvZCB0byBiZSBjYWxsZWQuXG4gICAqL1xuICBvbk11dGF0aW9uQ2hpbGRSZW1vdmVkKCkge31cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBNWVRISVhfVUlfQ09NUE9ORU5UX1RZUEUsXG4gICAgICB9LFxuICAgICAgW2lzTXl0aGl4Q29tcG9uZW50XTogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LmlzTXl0aGl4Q29tcG9uZW50XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgaXNNeXRoaXhDb21wb25lbnQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVXRpbHMuYmluZE1ldGhvZHMuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAvKiwgWyBIVE1MRWxlbWVudC5wcm90b3R5cGUgXSovKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzZW5zaXRpdmVUYWdOYW1lJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LnNlbnNpdGl2ZVRhZ05hbWVcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+ICgodGhpcy5wcmVmaXgpID8gYCR7dGhpcy5wcmVmaXh9OiR7dGhpcy5sb2NhbE5hbWV9YCA6IHRoaXMubG9jYWxOYW1lKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGVJRCc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC50ZW1wbGF0ZUlEXG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lELFxuICAgICAgfSxcbiAgICAgICdkZWxheVRpbWVycyc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5kZWxheVRpbWVyc1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbmV3IE1hcCgpLFxuICAgICAgfSxcbiAgICAgICdkb2N1bWVudEluaXRpYWxpemVkJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LmRvY3VtZW50SW5pdGlhbGl6ZWRcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsIE1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRCksXG4gICAgICAgIHNldDogICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVELCAhIXZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2hhZG93JzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LnNoYWRvd1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd0RPTSgpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZGVzYzogfFxuICAgKiAgIEEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIGF0dHJpYnV0ZXMuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkXG4gICAqICAgdG8gdGhpcyBtZXRob2QsIHRoZW4gaXQgd2lsbCBhY3QgYXMgYSBnZXR0ZXIsIGdldHRpbmcgdGhlIGF0dHJpYnV0ZSBzcGVjaWZpZWQgYnkgbmFtZS5cbiAgICpcbiAgICogICBJZiBob3dldmVyIHR3byBvciBtb3JlIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHRoZW4gdGhpcyBpcyBhbiBhdHRyaWJ1dGUgc2V0dGVyLlxuICAgKlxuICAgKiAgIElmIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgZmFsc2VgLCB0aGVuIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZVxuICAgKiAgIHJlbW92ZWQuXG4gICAqXG4gICAqICAgSWYgdGhlIHByb3ZpZGVkIHZhbHVlIGlzIGB0cnVlYCwgdGhlbiB0aGUgYXR0cmlidXRlJ3MgdmFsdWUgd2lsbCBiZSBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqICAgQW55IG90aGVyIHZhbHVlIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBhbmQgc2V0IGFzIHRoZSBhdHRyaWJ1dGUncyB2YWx1ZS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbmFtZVxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBvcGVyYXRlIG9uLlxuICAgKiAgIC0gbmFtZTogdmFsdWVcbiAgICogICAgIGRhdGFUeXBlczogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIElmIGB1bmRlZmluZWRgLCBgbnVsbGAsIG9yIGBmYWxzZWAsIHJlbW92ZSB0aGUgbmFtZWQgYXR0cmlidXRlLlxuICAgKiAgICAgICBJZiBgdHJ1ZWAsIHNldCB0aGUgbmFtZWQgYXR0cmlidXRlJ3MgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqICAgICAgIEZvciBhbnkgb3RoZXIgdmFsdWUsIGZpcnN0IGNvbnZlcnQgaXQgaW50byBhIHN0cmluZywgYW5kIHRoZW4gc2V0IHRoZSBuYW1lZCBhdHRyaWJ1dGUncyB2YWx1ZSB0byB0aGUgcmVzdWx0aW5nIHN0cmluZy5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgMS4gQHR5cGVzIHN0cmluZzsgSWYgYSBzaW5nbGUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIG5hbWVkIGF0dHJpYnV0ZS5cbiAgICogICAyLiBAdHlwZXMgdGhpczsgSWYgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhlbiBzZXQgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZSxcbiAgICogICAgICBhbmQgcmV0dXJuIGB0aGlzYCAodG8gYWxsb3cgZm9yIGNoYWluaW5nKS5cbiAgICovXG4gIGF0dHIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSlcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsICh2YWx1ZSA9PT0gdHJ1ZSkgPyAnJyA6ICgnJyArIHZhbHVlKSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZGVzYzogfFxuICAgKiAgIEluamVjdCBhIG5ldyBzdHlsZSBzaGVldCB2aWEgYSBgPHN0eWxlPmAgZWxlbWVudCBkeW5hbWljYWxseSBhdCBydW4tdGltZS5cbiAgICpcbiAgICogICBUaGlzIG1ldGhvZCBhbGxvd3MgdGhlIGNhbGxlciB0byBpbmplY3QgZHluYW1pYyBzdHlsZXMgYXQgcnVuLXRpbWUuXG4gICAqICAgSXQgd2lsbCBvbmx5IGluamVjdCB0aGUgc3R5bGVzIG9uY2UsIG5vIG1hdHRlciBob3cgbWFueSB0aW1lcyB0aGVcbiAgICogICBtZXRob2QgaXMgY2FsbGVkLS1hcyBsb25nIGFzIHRoZSBzdHlsZSBjb250ZW50IGl0c2VsZiBkb2Vzbid0IGNoYW5nZS5cbiAgICpcbiAgICogICBUaGUgY29udGVudCBpcyBoYXNoZWQgdmlhIFNIQTI1NiwgYW5kIHRoZSBoYXNoIGlzIHVzZWQgYXMgdGhlIHN0eWxlIHNoZWV0IGlkLiBUaGlzXG4gICAqICAgYWxsb3dzIHlvdSB0byBjYWxsIHRoZSBtZXRob2QgaW5zaWRlIGEgY29tcG9uZW50J3MgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tb3VudGVkO1xuICAgKiAgIG1ldGhvZCwgd2l0aG91dCBuZWVkaW5nIHRvIHdvcnJ5IGFib3V0IGR1cGxpY2F0aW5nIHRoZSBzdHlsZXMgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogY29udGVudFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIENTUyBzdHlsZXNoZWV0IGNvbnRlbnQgdG8gaW5qZWN0IGludG8gYSBgPHN0eWxlPmAgZWxlbWVudC4gVGhpcyBjb250ZW50IGlzXG4gICAqICAgICAgIHVzZWQgdG8gZ2VuZXJhdGUgYW4gYGlkYCBmb3IgdGhlIGA8c3R5bGU+YCBlbGVtZW50LCBzbyB0aGF0IGl0IG9ubHkgZ2V0cyBhZGRlZFxuICAgKiAgICAgICB0byB0aGUgYGRvY3VtZW50YCBvbmNlLlxuICAgKiAgIC0gbmFtZTogbWVkaWFcbiAgICogICAgIGRhdGFUeXBlczogc3RyaW5nXG4gICAqICAgICBkZWZhdWx0OiBcIidzY3JlZW4nXCJcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFdoYXQgdG8gc2V0IHRoZSBgbWVkaWFgIGF0dHJpYnV0ZSBvZiB0aGUgY3JlYXRlZCBgPHN0eWxlPmAgZWxlbWVudCB0by4gRGVmYXVsdHNcbiAgICogICAgICAgdG8gYCdzY3JlZW4nYC5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogSXQgaXMgb2Z0ZW4gYmV0dGVyIHRvIHNpbXBseSBhZGQgYSBgPHN0eWxlPmAgZWxlbWVudCB0byB5b3VyIGNvbXBvbmVudCdzIEhUTUwgdGVtcGxhdGUuXG4gICAqICAgICBIb3dldmVyLCBzb21ldGltZXMgdHJ1bHkgZHluYW1pYyBzdHlsZXMgYXJlIG5lZWRlZCwgd2hlcmUgdGhlIGNvbnRlbnQgd29uJ3QgYmUga25vd25cbiAgICogICAgIHVudGlsIHJ1bnRpbWUuIFRoaXMgaXMgdGhlIHByb3BlciB1c2UgY2FzZSBmb3IgdGhpcyBtZXRob2QuXG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogUGxlYXNlIGVkdWNhdGVkIHlvdXJzZWxmICh1bmxpa2UgcGVvcGxlIHdobyBsb3ZlIFJlYWN0KSBhbmQgZG8gbm90IG92ZXJ1c2UgZHluYW1pYyBvciBpbmxpbmUgc3R5bGVzLlxuICAgKiAgICAgV2hpbGUgdGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBjZXJ0YWlubHkgYSBzdGVwIGFib3ZlIGlubGluZSBzdHlsZXMsIHRoaXMgbWV0aG9kIGhhc1xuICAgKiAgICAgW2dyZWF0IHBvdGVudGlhbCB0byBjYXVzZSBoYXJtXShodHRwczovL3dvcmxkb2ZkZXYuaW5mby82LXJlYXNvbnMtd2h5LXlvdS1zaG91bGRudC1zdHlsZS1pbmxpbmUvKVxuICAgKiAgICAgYW5kIHNwcmVhZCB5b3VyIG93biBpZ25vcmFuY2UgdG8gb3RoZXJzLiBVc2Ugd2l0aCAqKkNBUkUqKiFcbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIEVsZW1lbnQ7IFRoZSBgPHN0eWxlPmAgZWxlbWVudCBmb3IgdGhlIHNwZWNpZmllZCBzdHlsZS5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gICAqXG4gICAqICAgICBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgICogICAgICAgc3RhdGljIHRhZ05hbWUgPSAnbXktY29tcG9uZW50JztcbiAgICpcbiAgICogICAgICAgLy8gLi4uXG4gICAqXG4gICAqICAgICAgIG1vdW50ZWQoKSB7XG4gICAqICAgICAgICAgbGV0IHsgc2lkZWJhcldpZHRoIH0gPSB0aGlzLmxvYWRVc2VyUHJlZmVyZW5jZXMoKTtcbiAgICogICAgICAgICB0aGlzLmluamVjdFN0eWxlU2hlZXQoYG5hdi5zaWRlYmFyIHsgd2lkdGg6ICR7c2lkZWJhcldpZHRofXB4OyB9YCwgJ3NjcmVlbicpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqXG4gICAqICAgICBNeUNvbXBvbmVudC5yZWdpc3RlcigpO1xuICAgKiAgICAgYGBgXG4gICAqL1xuICBpbmplY3RTdHlsZVNoZWV0KGNvbnRlbnQsIG1lZGlhID0gJ3NjcmVlbicpIHtcbiAgICBsZXQgc3R5bGVJRCAgICAgICA9IGBJRFNUWUxFJHtCYXNlVXRpbHMuU0hBMjU2KGAke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fToke21lZGlhfWApfWA7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHN0eWxlRWxlbWVudCAgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKTtcblxuICAgIGlmIChzdHlsZUVsZW1lbnQpXG4gICAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuXG4gICAgc3R5bGVFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICBpZiAobWVkaWEpXG4gICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdtZWRpYScsIG1lZGlhKTtcblxuICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50cyhub2RlLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gICAgaWYgKCFvcHRpb25zLnNjb3BlKVxuICAgICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2NvcGU6IHRoaXMuJCQgfTtcblxuICAgIHJldHVybiBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXRDaGlsZHJlbkFzRnJhZ21lbnQobm9FbXB0eVJlc3VsdCkge1xuICAgIGxldCBoYXNDb250ZW50ICAgID0gZmFsc2U7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHRlbXBsYXRlICAgICAgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIHJldHVybiAobm9FbXB0eVJlc3VsdCkgPyB1bmRlZmluZWQgOiB0ZW1wbGF0ZTtcblxuICAgIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgbm9kZSA9IHRoaXMuY2hpbGROb2Rlc1swXTtcbiAgICAgIGlmICghKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIEJhc2VVdGlscy5pc05PRShub2RlLm5vZGVWYWx1ZSkpKVxuICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKG5vRW1wdHlSZXN1bHQgJiYgIWhhc0NvbnRlbnQpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGRlc2M6IHxcbiAgICogICBHZXQgdGhlIHBhcmVudCBOb2RlIG9mIHRoaXMgZWxlbWVudC5cbiAgICpcbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogVW5saWtlIFtOb2RlLnBhcmVudE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpLCB0aGlzXG4gICAqICAgICB3aWxsIGFsc28gc2VhcmNoIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMuXG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogKipTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBvbmx5IHdvcmtzIGZvciBNeXRoaXggVUkgY29tcG9uZW50cyEqKlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIGlzIGFjY29tcGxpc2hlZCB2aWEgbGV2ZXJhZ2luZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1ldGFkYXRhOyBmb3JcbiAgICogICAgIGB0aGlzYCBjb21wb25lbnQuIFdoZW4gYSBgbnVsbGAgcGFyZW50IGlzIGVuY291bnRlcmVkLCBgZ2V0UGFyZW50Tm9kZWAgd2lsbCBsb29rIGZvciBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBAc2VlIENvbnN0YW50cy5NWVRISVhfU0hBRE9XX1BBUkVOVDtcbiAgICogICAgIG9uIGB0aGlzYC4gSWYgZm91bmQsIHRoZSByZXN1bHQgaXMgY29uc2lkZXJlZCB0aGUgW3BhcmVudCBOb2RlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9wYXJlbnROb2RlKSBvZiBgdGhpc2AgY29tcG9uZW50LlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmV5ZTogVGhpcyBpcyBqdXN0IGEgd3JhcHBlciBmb3IgQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAgICpcbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIE5vZGU7IFRoZSBwYXJlbnQgbm9kZSwgaWYgdGhlcmUgaXMgYW55LCBvciBgbnVsbGAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0UGFyZW50Tm9kZSgpIHtcbiAgICByZXR1cm4gVXRpbHMuZ2V0UGFyZW50Tm9kZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZGVzYzogfFxuICAgKiAgIFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpXG4gICAqICAgd2l0aCBvbmUgbm90YWJsZSBkaWZmZXJlbmNlOiBJdCBydW5zIE15dGhpeCBVSSBmcmFtZXdvcmsgc3BlY2lmaWMgY29kZSBhZnRlciBhIHNoYWRvdyBpcyBhdHRhY2hlZC5cbiAgICpcbiAgICogICBDdXJyZW50bHksIHRoZSBtZXRob2QgY29tcGxldGVzIHRoZSBmb2xsb3dpbmcgYWN0aW9uczpcbiAgICogICAxLiBDYWxsIGBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucylgIHRvIGFjdHVhbGx5IGF0dGFjaCBhIFNoYWRvdyBET01cbiAgICogICAyLiBBc3NpZ24gQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyB0byB0aGUgcmVzdWx0aW5nIGBzaGFkb3dgLCB1c2luZyB0aGUga2V5IGBDb25zdGFudHMuTVlUSElYX1NIQURPV19QQVJFTlRgLCBhbmQgdmFsdWUgb2YgYHRoaXNgLiBAc291cmNlUmVmIF9zaGFkb3dNZXRhZGF0YUFzc2lnbm1lbnQ7IFRoaXMgYWxsb3dzIEBzZWUgZ2V0UGFyZW50Tm9kZTsgdG8gbGF0ZXIgZmluZCB0aGUgcGFyZW50IG9mIHRoZSBzaGFkb3cuXG4gICAqICAgMy4gYHJldHVybiBzaGFkb3dgXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG9wdGlvbnNcbiAgICogICAgIGRhdGFUeXBlczogb2JqZWN0XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFtvcHRpb25zXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cjb3B0aW9ucykgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KVxuICAgKiBub3RlczpcbiAgICogICAtIFRoaXMgaXMganVzdCBhIHdyYXBwZXIgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KSB0aGF0IGV4ZWN1dGVzXG4gICAqICAgICBjdXN0b20gZnJhbWV3b3JrIGZ1bmN0aW9uYWxpdHkgYWZ0ZXIgdGhlIGBzdXBlcmAgY2FsbC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIFNoYWRvd1Jvb3Q7IFRoZSBTaGFkb3dSb290IGluc3RhbmNlIGNyZWF0ZWQgYnkgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpLlxuICAgKi9cbiAgYXR0YWNoU2hhZG93KG9wdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlbnZpcm9ubWVudCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiBzdXBlci5hdHRhY2hTaGFkb3cgIT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KG9wdGlvbnMpO1xuICAgIFV0aWxzLm1ldGFkYXRhKHNoYWRvdywgTVlUSElYX1NIQURPV19QQVJFTlQsIHRoaXMpOyAvLyBAcmVmOl9zaGFkb3dNZXRhZGF0YUFzc2lnbm1lbnRcblxuICAgIHJldHVybiBzaGFkb3c7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGRlc2M6IHxcbiAgICogICBBIHN0dWIgZm9yIGRldmVsb3BlcnMgdG8gY29udHJvbCB0aGUgU2hhZG93IERPTSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiAgIEJ5IGRlZmF1bHQsIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IGNhbGwgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5hdHRhY2hTaGFkb3c7IGluIGBcIm9wZW5cImAgYG1vZGVgLlxuICAgKlxuICAgKiAgIERldmVsb3BlcnMgY2FuIG92ZXJsb2FkIHRoaXMgdG8gZG8gbm90aGluZyAoaGF2ZSBubyBTaGFkb3cgRE9NIGZvciBhIHNwZWNpZmljIGNvbXBvbmVudCBmb3IgZXhhbXBsZSksXG4gICAqICAgb3IgdG8gZG8gc29tZXRoaW5nIGVsc2UsIHN1Y2ggYXMgc3BlY2lmeSB0aGV5IHdvdWxkIGxpa2UgdGhlaXIgY29tcG9uZW50IHRvIGJlIGluIGBcImNsb3NlZFwiYCBgbW9kZWAuXG4gICAqXG4gICAqICAgVGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBhc3NpZ25lZCB0byBgdGhpcy5zaGFkb3dgIGluc2lkZSB0aGUgYGNvbnN0cnVjdG9yYCBvZiB0aGUgY29tcG9uZW50LlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBkYXRhVHlwZXM6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBbb3B0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I29wdGlvbnMpIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdylcbiAgICogbm90ZXM6XG4gICAqICAgLSBBbGwgdGhpcyBkb2VzIGlzIGNhbGwgYHRoaXMuYXR0YWNoU2hhZG93YC4gSXRzIHB1cnBvc2UgaXMgZm9yIHRoZSBkZXZlbG9wZXIgdG8gY29udHJvbFxuICAgKiAgICAgd2hhdCBoYXBwZW5zIHdpdGggdGhlIGNvbXBvbmVudCdzIFNoYWRvdyBET00uXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBTaGFkb3dSb290OyBUaGUgU2hhZG93Um9vdCBpbnN0YW5jZSBjcmVhdGVkIGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQuYXR0YWNoU2hhZG93Oy5cbiAgICovXG4gIGNyZWF0ZVNoYWRvd0RPTShvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3Iuc2hhZG93ID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBtZXJnZUNoaWxkcmVuKHRhcmdldCwgLi4ub3RoZXJzKSB7XG4gICAgcmV0dXJuIEVsZW1lbnRzLm1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUobmFtZU9ySUQpIHtcbiAgICBpZiAobmFtZU9ySUQgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgcmV0dXJuIG5hbWVPcklEO1xuXG4gICAgaWYgKCF0aGlzLm93bmVyRG9jdW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAobmFtZU9ySUQpXG4gICAgICByZXR1cm4gRWxlbWVudHMucXVlcnlUZW1wbGF0ZSh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsIG5hbWVPcklEKTtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hdXRvLW1lcmdlXScpO1xuXG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBBcnJheS5mcm9tKGVsZW1lbnRzKSkge1xuICAgICAgbGV0IHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1tZXJnZScpO1xuICAgICAgaWYgKEJhc2VVdGlscy5pc05PRShzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2hlcyhzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvY2Vzc2VkVGVtcGxhdGUoX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZShfdGVtcGxhdGUpIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0aGlzLnByb2Nlc3NFbGVtZW50cygodGVtcGxhdGUuY29udGVudCkgPyB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSk7XG4gIH1cblxuICBnZXRSYXdUZW1wbGF0ZShfdGVtcGxhdGUpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKF90ZW1wbGF0ZSkgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUbyh0YXJnZXQsIF90ZW1wbGF0ZSkge1xuICAgIGlmICghdGFyZ2V0KVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHByb2Nlc3NlZFRlbXBsYXRlID0gdGhpcy5nZXRQcm9jZXNzZWRUZW1wbGF0ZShfdGVtcGxhdGUpO1xuICAgIGlmIChwcm9jZXNzZWRUZW1wbGF0ZSkge1xuICAgICAgLy8gZW5zdXJlRG9jdW1lbnRTdHlsZXMuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSwgdGVtcGxhdGUpO1xuXG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocHJvY2Vzc2VkVGVtcGxhdGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTShfdGVtcGxhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRUZW1wbGF0ZVRvKHRoaXMuc2hhZG93LCBfdGVtcGxhdGUpO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcblxuICAgIHRoaXMuYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpO1xuICAgIHRoaXMuYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTSgpO1xuXG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBCYXNlVXRpbHMubmV4dFRpY2soKCkgPT4ge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMudW5tb3VudGVkKCk7XG4gIH1cblxuICBhd2FpdEZldGNoU3JjT25WaXNpYmxlKG5ld1NyYykge1xuICAgIGlmICh0aGlzLnZpc2liaWxpdHlPYnNlcnZlcikge1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudW5vYnNlcnZlKHRoaXMpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICghbmV3U3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG9ic2VydmVyID0gQ29tcG9uZW50VXRpbHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IHdhc1Zpc2libGUsIGRpc2Nvbm5lY3QgfSkgPT4ge1xuICAgICAgaWYgKCF3YXNWaXNpYmxlKVxuICAgICAgICB0aGlzLmZldGNoU3JjKHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1zcmMnKSk7XG5cbiAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIHsgZWxlbWVudHM6IFsgdGhpcyBdIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Zpc2liaWxpdHlPYnNlcnZlcic6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb2JzZXJ2ZXIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICBsZXQgW1xuICAgICAgYXR0cmlidXRlTmFtZSxcbiAgICAgIG9sZFZhbHVlLFxuICAgICAgbmV3VmFsdWUsXG4gICAgXSA9IGFyZ3M7XG5cbiAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAvLyBTZWN1cml0eTogZW5zdXJlIHRoaXMgaXMgYWN0dWFsbHkgYSBoYW5kbGVkIGF0dHJpYnV0ZSBjYWxsIVxuICAgICAgLy8gV2Ugd291bGRuJ3QganVzdCB3YW50IHRvIHN0YXJ0IHNldHRpbmcgYW55dGhpbmcgb24gdGhlIGluc3RhbmNlXG4gICAgICAvLyB2aWEgYXR0cmlidXRlcy4uLiB0aGF0IG1pZ2h0IGJlIGJhZCwgaS5lOiA8aW1nIHZhbHVlT2Y9XCJcIj5cblxuICAgICAgbGV0IHByb3BlcnR5TmFtZSAgICA9IEJhc2VVdGlscy50b0NhbWVsQ2FzZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIGxldCBtYWdpY05hbWUgICAgICAgPSBgYXR0ciQke3Byb3BlcnR5TmFtZX1gO1xuICAgICAgbGV0IHsgZGVzY3JpcHRvciB9ICA9IFV0aWxzLmdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIENhbGwgc2V0dGVyXG4gICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoLi4uYXJncyk7XG4gIH1cblxuICBhZG9wdGVkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFkb3B0ZWQoLi4uYXJncyk7XG4gIH1cblxuICBtb3VudGVkKCkge31cbiAgdW5tb3VudGVkKCkge31cbiAgYXR0cmlidXRlQ2hhbmdlZCgpIHt9XG4gIGFkb3B0ZWQoKSB7fVxuXG4gIGdldCAkJCgpIHtcbiAgICByZXR1cm4gVXRpbHMuY3JlYXRlU2NvcGUodGhpcyk7XG4gIH1cblxuICBzZWxlY3QoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICAgID0gKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZGVzYzogfFxuICAgKiAgIFRoaXMgbWV0aG9kIHdpbGwgZHluYW1pY2FsbHkgYnVpbGQgZWxlbWVudHMsIG9yIHJhdGhlciwgQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLCB0aGF0XG4gICAqICAgZGVmaW5lIGVsZW1lbnRzIHRvIGJlIGNyZWF0ZWQgbGF0ZXIuIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcyBhcmUganVzdCB0aGF0LCBhIHNpbXBsZVxuICAgKiAgIHN0cnVjdHVyZSB0aGF0IGRlZmluZXMgdGhlIG5hbWUsIGF0dHJpYnV0ZXMsIGFuZCBjaGlsZHJlbiBvZiBhbnkgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogICBXaGVuIHRoZXNlIGFyZSBpbnNlcnRlZCBpbnRvIGEgZG9jdW1lbnQsIGVpdGhlciB0aHJvdWdoIGEgQHNlZSBRdWVyeUVuZ2luZTssIG9yIGRpcmVjdGx5IGJ5XG4gICAqICAgY2FsbGluZyBAc2VlIEVsZW1lbnREZWZpbml0aW9uLmJ1aWxkOyBiZWZvcmUgaW5zZXJ0LCB0aGV5IGFyZSBvbmx5IGF0IHRoaXMgcG9pbnQgY29udmVydGVkXG4gICAqICAgaW50byByZWFsIFtFbGVtZW50c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQpIGFuZCBpbnNlcnRlZFxuICAgKiAgIGludG8gdGhlIHNwZWNpZmllZCBET00gKGRvY3VtZW50KSBhdCB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBBIGNhbGxiYWNrIHRoYXQgaXMgaW1tZWRpYXRlbHkgY2FsbGVkIGFuZCBleHBlY3RlZCB0byByZXR1cm4gQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLlxuICAgKiAgICAgICBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggb25seSB0d28gYXJndW1lbnRzLiBUaGUgZmlyc3QgYXJndW1lbnRzLCBgZWxlbWVudHNgLCBpcyBhXG4gICAqICAgICAgIEBzZWUgRWxlbWVudEdlbmVyYXRvcjsgUHJveHkgaW5zdGFuY2UsIHRoYXQgd2lsbCBwcm9wZXJseSBnZW5lcmF0ZSBhbnkgZWxlbWVudCBkZWZpbml0aW9uIHJlcXVlc3RlZC5cbiAgICogICAgICAgVGhlIHNlY29uZCBhcmd1bWVudCwgYGNvbnRleHRgLCBpcyBzaW1wbHkgYW4gZW1wdHkgb2JqZWN0IHByb3ZpZGVkIHRvIHRoZSBjYWxsYmFjaywgYWxsb3dpbmcgdGhlXG4gICAqICAgICAgIGRldmVsb3BlciB0byBzdG9yZSBjb250ZXh0dWFsIGJhc2VkIGluZm9ybWF0aW9uIGZvciB0aGUgb3BlcmF0aW9uLCBpZiBkZXNpcmVkLlxuICAgKiByZXR1cm46IHxcbiAgICogICAqIEB0eXBlcyBFbGVtZW50RGVmaW5pdGlvbjsgQSBzaW5nbGUgQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2UgZGVmaW5pbmdcbiAgICogICAgIHRoZSBET00gdG8gZ2VuZXJhdGUgd2hlbiBpbnNlcnRlZC4gQ2FuIGJlIGEgYCNmcmFnbWVudGAgZWxlbWVudCBkZWZpbml0aW9uLlxuICAgKiAgICogQHR5cGVzIEFycmF5PEVsZW1lbnREZWZpbml0aW9uPjsgQW4gYXJyYXkgb2YgZWxlbWVudCBkZWZpbml0aW9uIGluc3RhbmNlc1xuICAgKiAgICAgZGVmaW5pbmcgdGhlIERPTSB0byBnZW5lcmF0ZSB3aGVuIGluc2VydGVkLlxuICAgKiAgICogQHR5cGVzIG51bGw7IElmIG5vdGhpbmcgaXMgcmV0dXJuZWQsIHRoZW4gbm8gZWxlbWVudHMgd2lsbCBiZSBjcmVhdGVkLlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBUaGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoaXMgbWV0aG9kIGFuZCBAc2VlIE15dGhpeFVJQ29tcG9uZW50LiRidWlsZDsgbWV0aG9kIGlzXG4gICAqICAgICB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcywgd2hlcmVhcyB0aGVcbiAgICogICAgIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuJGJ1aWxkOyBtZXRob2Qgd2lsbCByZXR1cm4gYSBAc2VlIFF1ZXJ5RW5naW5lOyBpbnN0YW5jZSBjb250YWluaW5nXG4gICAqICAgICBhbGwgdGhlIGJ1aWx0IEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcy5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQge1xuICAgKiAgICAgICBNeXRoaXhVSUNvbXBvbmVudCxcbiAgICogICAgICAgVXRpbHMsXG4gICAqICAgICB9IGZyb20gJ0BjZG4vbXl0aGl4LXVpLWNvcmVAMSc7IC8vIGVuc3VyZSB3ZSBsb2NrIHRoaXMgdG8gd2hhdGV2ZXIgdmVyc2lvbiBpcyBpbXBvcnRhbnQgdG8gdXNcbiAgICpcbiAgICogICAgIGV4cG9ydCBjbGFzcyBEZW1vTmF2Q29tcG9uZW50IGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICAgKiAgICAgICBzdGF0aWMgdGFnTmFtZSA9ICdkZW1vLW5hdi1jb21wb25lbnQnOyAvLyBhIFwic29tZXRoaW5nLVwiIHByZWZpeCBpcyByZXF1aXJlZFxuICAgKlxuICAgKiAgICAgICBtb3VudGVkKCkgeyAvLyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBhZGRlZCB0byBhbm90aGVyIGVsZW1lbnRcbiAgICogICAgICAgICBsZXQgbGlzdCA9IFtcbiAgICogICAgICAgICAgICdUZXN0IDEnLFxuICAgKiAgICAgICAgICAgJ1Rlc3QgMicsXG4gICAqICAgICAgICAgICAnTG9yZW0gSXBzdW0nLFxuICAgKiAgICAgICAgIF07XG4gICAqXG4gICAqICAgICAgICAgLy8gRHluYW1pY2FsbHkgYnVpbGQgYW5kIGFwcGVuZCBzb21lIGVsZW1lbnRzICh3aXRoIGF0dHJpYnV0ZXMgYW5kIGV2ZW50IGJpbmRpbmdzKVxuICAgKiAgICAgICAgIGxldCB1bm9yZGVyZWRMaXN0RWxlbWVudCA9IHRoaXMuYnVpbGQoKHsgTkFWLCBVTCwgTEksICRURVhUIH0pID0+IHsgLy8gYW55IGVsZW1lbnQgbmFtZSBjYW4gYmUgcmVxdWVzdGVkIGhlcmUgKGV2ZW4gY3VzdG9tIG9uZXMpXG4gICAqICAgICAgICAgICByZXR1cm4gVUwuaWQoJ3ByaW1hcnktbGlzdCcpLmNsYXNzKCdpbnRlcmFjdGl2ZS1saXN0JykoXG4gICAqICAgICAgICAgICAgIC8vIC4uLmNoaWxkcmVuIG9mIFVMIGVsZW1lbnRcbiAgICogICAgICAgICAgICAgLi4ubGlzdC5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAqICAgICAgICAgICAgICAgcmV0dXJuIExJLmNsYXNzKCdpdGVtLW5hbWUgZm9jdXNhYmxlJykuZGF0YUluZGV4KGluZGV4KS5vbkNsaWNrKHRoaXMub25JdGVtQ2xpY2spKFxuICAgKiAgICAgICAgICAgICAgICAgLy8gLi4uY2hpbGRyZW4gb2YgTEkgZWxlbWVudFxuICAgKiAgICAgICAgICAgICAgICAgJFRFWFQoaXRlbSksICAvLyBpbiB0aGlzIGNhc2UsIGEgc2luZ2xlIHRleHQgbm9kZVxuICAgKiAgICAgICAgICAgICAgICk7XG4gICAqICAgICAgICAgICAgIH0pLFxuICAgKiAgICAgICAgICAgKTtcbiAgICogICAgICAgICB9KTtcbiAgICpcbiAgICogICAgICAgICAvLyBDcmVhdGUgYW4gYXBwZW5kIGVsZW1lbnRzIHRvIHRoaXMgZWxlbWVudFxuICAgKiAgICAgICAgIHRoaXMuYXBwZW5kKFxuICAgKiAgICAgICAgICAgdW5vcmRlcmVkTGlzdEVsZW1lbnQuYnVpbGQoXG4gICAqICAgICAgICAgICAgIHRoaXMub3duZXJEb2N1bWVudCxcbiAgICogICAgICAgICAgICAgeyBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUodGhpcykgfSxcbiAgICogICAgICAgICAgICksXG4gICAqICAgICAgICAgKTtcbiAgICogICAgICAgfVxuICAgKlxuICAgKiAgICAgICAvLyBBbGwgY2xhc3MgbWV0aG9kcyBhcmUgYXV0b21hdGljYWxseSBib3VuZCB0byBcInRoaXNcIiBpbnNpZGUgdGhlIHN1cGVyLmNvbnN0cnVjdG9yXG4gICAqICAgICAgIG9uSXRlbUNsaWNrKGV2ZW50KSB7XG4gICAqICAgICAgICAgY29uc29sZS5sb2coJ0l0ZW0gQ2xpY2tlZCEnLCBldmVudC50YXJnZXQpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqXG4gICAqICAgICBEZW1vTmF2Q29tcG9uZW50LnJlZ2lzdGVyKCk7XG4gICAqICAgICBgYGBcbiAgICovXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIChyZXN1bHQubGVuZ3RoIDwgMikgPyByZXN1bHRbMF0gOiBuZXcgRWxlbWVudHMuRWxlbWVudERlZmluaXRpb24oJyNmcmFnbWVudCcsIHt9LCByZXN1bHQpO1xuICB9XG5cbiAgJGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCBbIHRoaXMuYnVpbGQoY2FsbGJhY2spIF0uZmxhdChJbmZpbml0eSkpO1xuICB9XG5cbiAgaXNBdHRyaWJ1dGVUcnV0aHkobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldElkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IEJhc2VVdGlscy50b0NhbWVsQ2FzZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGRlZmluZUR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyLCBfY29udGV4dCkge1xuICAgIHJldHVybiBVdGlscy5kZWZpbmVEeW5hbWljUHJvcC5jYWxsKF9jb250ZXh0IHx8IHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBVdGlscy5kZWZpbmVEeW5hbWljUHJvcC5jYWxsKGRhdGEsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzZWxmLXJlc2V0dGluZyB0aW1lb3V0LiBUaGlzIG1ldGhvZCBleHBlY3RzIGFuIGBpZGAgYXJndW1lbnQgKG9yIHdpbGwgZ2VuZXJhdGUgb25lIGZyb20gdGhlIHByb3ZpZGVkXG4gICAqICAgY2FsbGJhY2sgbWV0aG9kIGlmIG5vdCBwcm92aWRlZCkuIEl0IHVzZXMgdGhpcyBwcm92aWRlZCBgaWRgIHRvIGNyZWF0ZSBhIHRpbWVvdXQuIFRoaXMgdGltZW91dCBoYXMgYSBzcGVjaWFsIGZlYXR1cmVcbiAgICogICBob3dldmVyIHRoYXQgZGlmZmVyZW50aWF0ZXMgaXQgZnJvbSBhIG5vcm1hbCBgc2V0VGltZW91dGAgY2FsbDogaWYgeW91IGNhbGwgYHRoaXMuZGVib3VuY2VgIGFnYWluIHdpdGggdGhlXG4gICAqICAgc2FtZSBgaWRgICoqYmVmb3JlKiogdGhlIHRpbWUgcnVucyBvdXQsIHRoZW4gaXQgd2lsbCBhdXRvbWF0aWNhbGx5IHJlc2V0IHRoZSB0aW1lci4gSW4gc2hvcnQsIG9ubHkgdGhlIGxhc3QgY2FsbFxuICAgKiAgIHRvIGB0aGlzLmRlYm91bmNlYCAoZ2l2ZW4gdGhlIHNhbWUgaWQpIHdpbGwgdGFrZSBlZmZlY3QgKHVubGVzcyB0aGUgc3BlY2lmaWVkIHRpbWVvdXQgaXMgcmVhY2hlZCBiZXR3ZWVuIGNhbGxzKS5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgVGhpcyBtZXRob2QgcmV0dXJucyBhIHNwZWNpYWxpemVkIFByb21pc2UgaW5zdGFuY2UuIFRoZSBpbnN0YW5jZSBpcyBzcGVjaWFsaXplZCBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllc1xuICAgKiAgIGFyZSBpbmplY3RlZCBpbnRvIGl0OlxuICAgKiAgIDEuIGByZXNvbHZlKHJlc3VsdFZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVzb2x2ZXMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAgICogICAyLiBgcmVqZWN0KGVycm9yVmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZWplY3RzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gICAqICAgMy4gYHN0YXR1cygpYCAtIFdoZW4gY2FsbGVkLCB3aWxsIHJldHVybiB0aGUgZnVsZmlsbG1lbnQgc3RhdHVzIG9mIHRoZSBwcm9taXNlLCBhcyBhIGBzdHJpbmdgLCBvbmUgb2Y6IGBcInBlbmRpbmdcIiwgXCJmdWxmaWxsZWRcImAsIG9yIGBcInJlamVjdGVkXCJgXG4gICAqICAgNC4gYGlkPHN0cmluZz5gIC0gQSByYW5kb21seSBnZW5lcmF0ZWQgSUQgZm9yIHRoaXMgcHJvbWlzZVxuICAgKlxuICAgKiAgIFNlZSBAc2VlIEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlO1xuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiB0aGUgdGltZW91dCBoYXMgYmVlbiBtZXQuXG4gICAqICAgLSBuYW1lOiB0aW1lTVNcbiAgICogICAgIGRhdGFUeXBlczogbnVtYmVyXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGVmYXVsdDogMFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2AuXG4gICAqICAgLSBuYW1lOiBpZFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZWZhdWx0OiBcIm51bGxcIlxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgaWRlbnRpZmllciBmb3IgdGhpcyBkZWJvdW5jZSB0aW1lci4gSWYgbm90IHByb3ZpZGVkLCB0aGVuIG9uZVxuICAgKiAgICAgICB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgeW91IGJhc2VkIG9uIHRoZSBwcm92aWRlZCBjYWxsYmFjay5cbiAgICogbm90ZXM6XG4gICAqICAgLSBUaG91Z2ggbm90IHJlcXVpcmVkLCBpdCBpcyBmYXN0ZXIgYW5kIGxlc3MgcHJvYmxlbWF0aWMgdG8gcHJvdmlkZSB5b3VyIG93biBgaWRgIGFyZ3VtZW50XG4gICAqL1xuICBkZWJvdW5jZShjYWxsYmFjaywgdGltZU1TLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lTVMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsZWFyRGVib3VuY2UoaWQpIHtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAoIXByb21pc2UpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG5cbiAgICB0aGlzLmRlbGF5VGltZXJzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBjbGFzc2VzKC4uLl9hcmdzKSB7XG4gICAgbGV0IGFyZ3MgPSBfYXJncy5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKVxuICAgICAgICByZXR1cm4gaXRlbS50cmltKCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYyhzcmNVUkwpIHtcbiAgICBpZiAoIXNyY1VSTClcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBDb21wb25lbnRVdGlscy5sb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwodGhpcywgc3JjVVJMKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmNVUkx9IChyZXNvbHZlZCB0bzogJHtlcnJvci51cmx9KWAsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuaW1wb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBDb21wb25lbnRVdGlscyBmcm9tICcuL2NvbXBvbmVudC11dGlscy5qcyc7XG5cbmltcG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxufSBmcm9tICcuL215dGhpeC11aS1jb21wb25lbnQuanMnO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlEeW5hbWljU3R5bGUgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1keW5hbWljLXN0eWxlJztcblxuICBzZXQgYXR0ciRkYXRhRW5hYmxlZChbIG5ld1ZhbHVlIF0pIHtcbiAgICB0aGlzLmhhbmRsZURhdGFFbmFibGVkQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIGNyZWF0ZVN0eWxlTm9kZSgpIHtcbiAgICBsZXQgb3duZXJEb2N1bWVudCAgID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBpbml0aWFsQ29udGVudCAgPSB0aGlzLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICBsZXQgaHJlZiAgICAgICAgICAgID0gdGhpcy5hdHRyKCdocmVmJyk7XG4gICAgbGV0IHN0eWxlTm9kZSAgICAgICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgIGlmIChCYXNlVXRpbHMuaXNOb3ROT0UoaHJlZikpIHtcbiAgICAgIENvbXBvbmVudFV0aWxzLnJlcXVpcmUoaHJlZiwgeyBvd25lckRvY3VtZW50IH0pLnRoZW4oXG4gICAgICAgIGFzeW5jICh7IHJlc3BvbnNlIH0pID0+IHtcbiAgICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgICAgICAgIHRoaXMuaGFuZGxlRGF0YUVuYWJsZWRBdHRyaWJ1dGVDaGFuZ2UodGhpcy5hdHRyKCdkYXRhLWVuYWJsZWQnKSk7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYG15dGhpeC1keW5hbWljLXN0eWxlOiBFcnJvciB3aGlsZSBhdHRlbXB0aW5nIHRvIGxvYWQgc3R5bGUgXCIke2hyZWZ9XCI6IGAsIHRoaXMsIGVycm9yKTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChCYXNlVXRpbHMuaXNOb3ROT0UoaW5pdGlhbENvbnRlbnQpKSB7XG4gICAgICBpZiAoKC88c3R5bGVbXj5dKj4vaSkudGVzdChpbml0aWFsQ29udGVudCkpIHtcbiAgICAgICAgbGV0IHRlbXBEaXYgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IGluaXRpYWxDb250ZW50O1xuXG4gICAgICAgIGxldCB0ZW1wTm9kZSA9IHRlbXBEaXYucXVlcnlTZWxlY3Rvcignc3R5bGUnKTtcbiAgICAgICAgaWYgKHRlbXBOb2RlKVxuICAgICAgICAgIHN0eWxlTm9kZSA9IHRlbXBOb2RlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IGluaXRpYWxDb250ZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IGluaXRpYWxDb250ZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZU5vZGU7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIHN1cGVyLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuc3R5bGVOb2RlID0gdGhpcy5jcmVhdGVTdHlsZU5vZGUoKTtcblxuICAgIHRoaXMuaGFuZGxlRGF0YUVuYWJsZWRBdHRyaWJ1dGVDaGFuZ2UodGhpcy5hdHRyKCdkYXRhLWVuYWJsZWQnKSk7XG4gIH1cblxuICBoYW5kbGVEYXRhRW5hYmxlZEF0dHJpYnV0ZUNoYW5nZShlbmFibGVkKSB7XG4gICAgaWYgKCF0aGlzLnN0eWxlTm9kZSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChCYXNlVXRpbHMuaXNOT0UodGhpcy5zdHlsZU5vZGUudGV4dENvbnRlbnQpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGlzRW5hYmxlZCA9ICgvXih0cnVlKSQvaSkudGVzdChlbmFibGVkKTtcbiAgICBpZiAoaXNFbmFibGVkKVxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlTm9kZSk7XG4gICAgZWxzZSBpZiAodGhpcy5jb250YWlucyh0aGlzLnN0eWxlTm9kZSkpXG4gICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuc3R5bGVOb2RlKTtcbiAgfVxufVxuXG5NeXRoaXhVSUR5bmFtaWNTdHlsZS5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlEeW5hbWljU3R5bGUgPSBNeXRoaXhVSUR5bmFtaWNTdHlsZTtcbiIsImltcG9ydCBkZWVwTWVyZ2UgZnJvbSAnZGVlcG1lcmdlJztcbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBDb21wb25lbnRVdGlscyBmcm9tICcuL2NvbXBvbmVudC11dGlscy5qcyc7XG5cbmltcG9ydCB7XG4gIER5bmFtaWNQcm9wZXJ0eSxcbn0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuaW1wb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG59IGZyb20gJy4vbXl0aGl4LXVpLWNvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUGFjayBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snO1xuXG4gIGNyZWF0ZVNoYWRvd0RPTSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBzZXQgYXR0ciRkYXRhTXl0aGl4U3JjKFsgdmFsdWUgXSkge1xuICAgIC8vIE5PT1AuLi4gVHJhcCB0aGlzIGJlY2F1c2Ugd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxvYWQgYSBwYXJ0aWFsIGhlcmVcbiAgfVxuXG4gIG9uTXV0YXRpb25BZGRlZChtdXRhdGlvbikge1xuICAgIC8vIFdoZW4gYWRkZWQgdG8gdGhlIERPTSwgZW5zdXJlIHRoYXQgd2Ugd2VyZVxuICAgIC8vIGFkZGVkIHRvIHRoZSByb290IG9mIGEgbGFuZ3VhZ2UgcHJvdmlkZXIuLi5cbiAgICAvLyBJZiBub3QsIHRoZW4gbW92ZSBvdXJzZWx2ZXMgdG8gdGhlIHJvb3RcbiAgICAvLyBvZiB0aGUgbGFuZ3VhZ2UgcHJvdmlkZXIuXG4gICAgbGV0IHBhcmVudExhbmd1YWdlUHJvdmlkZXIgPSB0aGlzLmNsb3Nlc3QoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgIGlmIChwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICYmIHBhcmVudExhbmd1YWdlUHJvdmlkZXIgIT09IG11dGF0aW9uLnRhcmdldClcbiAgICAgIEJhc2VVdGlscy5uZXh0VGljaygoKSA9PiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZSh0aGlzLCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmZpcnN0Q2hpbGQpKTtcbiAgfVxufVxuXG5jb25zdCBJU19KU09OX0VOQ1RZUEUgICAgICAgICAgICAgICAgID0gL15hcHBsaWNhdGlvblxcL2pzb24vaTtcbmNvbnN0IExBTkdVQUdFX1BBQ0tfSU5TRVJUX0dSQUNFX1RJTUUgPSA1MDtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJztcblxuICBzZXQgYXR0ciRsYW5nKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKG5vZGUpIHtcbiAgICBpZiAobm9kZS5sb2NhbE5hbWUgPT09ICdteXRoaXgtbGFuZ3VhZ2UtcGFjaycpIHtcbiAgICAgIHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAvLyBSZWxvYWQgbGFuZ3VhZ2UgcGFja3MgYWZ0ZXIgYWRkaXRpb25zXG4gICAgICAgIHRoaXMubG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZSh0aGlzLmdldEN1cnJlbnRMb2NhbGUoKSk7XG4gICAgICB9LCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FLCAncmVsb2FkTGFuZ3VhZ2VQYWNrcycpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGVybXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgaTE4bihfcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgbGV0IHBhdGggICAgPSBgZ2xvYmFsLmkxOG4uJHtfcGF0aH1gO1xuICAgIGxldCByZXN1bHQgID0gVXRpbHMuZmV0Y2hQYXRoKHRoaXMudGVybXMsIHBhdGgpO1xuXG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgcmV0dXJuIFV0aWxzLmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbCh0aGlzLCBwYXRoLCAoZGVmYXVsdFZhbHVlID09IG51bGwpID8gJycgOiBkZWZhdWx0VmFsdWUpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbGUoKSB7XG4gICAgLy8gKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkuY2hpbGROb2Rlc1sxXSBpcyB0aGUgYDxodG1sYD4gdGFnIG9mIHRoZSBkb2N1bWVudFxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJztcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgc3VwZXIubW91bnRlZCgpO1xuXG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldFNvdXJjZXNGb3JMYW5nKGxhbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoYG15dGhpeC1sYW5ndWFnZS1wYWNrW2xhbmdePVwiJHtsYW5nLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKTtcbiAgfVxuXG4gIGxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UoX2xhbmcpIHtcbiAgICBsZXQgbGFuZyAgICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudHMgID0gdGhpcy5nZXRTb3VyY2VzRm9yTGFuZyhsYW5nKS5maWx0ZXIoKHNvdXJjZUVsZW1lbnQpID0+IEJhc2VVdGlscy5pc05vdE5PRShzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnRzIHx8ICFzb3VyY2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogTm8gXCJteXRoaXgtbGFuZ3VhZ2UtcGFja1wiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cyk7XG4gIH1cblxuICBhc3luYyBsb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgcHJvbWlzZXMgID0gc291cmNlRWxlbWVudHMubWFwKChzb3VyY2VFbGVtZW50KSA9PiB0aGlzLmxvYWRMYW5ndWFnZVBhY2sobGFuZywgc291cmNlRWxlbWVudCkpO1xuICAgICAgbGV0IGFsbFRlcm1zICA9IChhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQocHJvbWlzZXMpKS5tYXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ2Z1bGZpbGxlZCcpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgIGxldCB0ZXJtcyAgICAgICAgID0gZGVlcE1lcmdlLmFsbChBcnJheS5mcm9tKG5ldyBTZXQoYWxsVGVybXMpKSk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpO1xuXG4gICAgICB0aGlzLnRlcm1zID0gY29tcGlsZWRUZXJtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgbGFuZ3VhZ2UgcGFja3MnLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IENvbXBvbmVudFV0aWxzLnJlcXVpcmUuY2FsbCh0aGlzLCBzcmMsIHsgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50IH0pO1xuICAgICAgbGV0IHR5cGUgICAgICAgICAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZW5jdHlwZScpIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgIGlmIChJU19KU09OX0VOQ1RZUEUudGVzdCh0eXBlKSkge1xuICAgICAgICAvLyBIYW5kbGUgSlNPTlxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgRG9uJ3Qga25vdyBob3cgdG8gbG9hZCBhIGxhbmd1YWdlIHBhY2sgb2YgdHlwZSBcIiR7dHlwZX1cImApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcykge1xuICAgIGNvbnN0IHdhbGtUZXJtcyA9ICh0ZXJtcywgcmF3S2V5UGF0aCkgPT4ge1xuICAgICAgbGV0IGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRlcm1zKTtcbiAgICAgIGxldCB0ZXJtc0NvcHkgPSB7fTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgICAgICAgICA9IGtleXNbaV07XG4gICAgICAgIGxldCB2YWx1ZSAgICAgICA9IHRlcm1zW2tleV07XG4gICAgICAgIGxldCBuZXdLZXlQYXRoICA9IHJhd0tleVBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgICAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gd2Fsa1Rlcm1zKHZhbHVlLCBuZXdLZXlQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgbmV3S2V5UGF0aC5qb2luKCcuJyksIHZhbHVlKTtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICAgIHByb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVybXNDb3B5O1xuICAgIH07XG5cbiAgICByZXR1cm4gd2Fsa1Rlcm1zKHRlcm1zLCBbICdnbG9iYWwnLCAnaTE4bicgXSk7XG4gIH1cbn1cblxuTXl0aGl4VUlMYW5ndWFnZVBhY2sucmVnaXN0ZXIoKTtcbk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlMYW5ndWFnZVBhY2sgPSBNeXRoaXhVSUxhbmd1YWdlUGFjaztcbmdsb2JhbFRoaXMubXl0aGl4VUkuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyID0gTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyO1xuIiwiaW1wb3J0ICogYXMgQ29tcG9uZW50VXRpbHMgZnJvbSAnLi9jb21wb25lbnQtdXRpbHMuanMnO1xuaW1wb3J0IHsgTXl0aGl4VUlDb21wb25lbnQgfSBmcm9tICcuL215dGhpeC11aS1jb21wb25lbnQuanMnO1xuXG5jb25zdCBJU19URU1QTEFURSAgICAgICA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IFRFTVBMQVRFX1RFTVBMQVRFID0gL14oXFwqfFxcfFxcKnxcXCpcXHwpJC87XG5cbi8qKlxuICogdHlwZTogTXl0aGl4RWxlbWVudFxuICogbmFtZTogTXl0aGl4VUlSZXF1aXJlXG4gKiBncm91cE5hbWU6IE15dGhpeEVsZW1lbnRzXG4gKiBkZXNjOiB8XG4gKiAgIGBgYGphdmFzY3JpcHRcbiAqICAgaW1wb3J0IHsgTXl0aGl4RWxlbWVudHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgY29uc3Qge1xuICogICAgIE15dGhpeFVJUmVxdWlyZSxcbiAqICAgfSA9IE15dGhpeEVsZW1lbnRzO1xuICogICBgYGBcbiAqXG4gKiAgIE15dGhpeFVJUmVxdWlyZSBpcyBhbiBFbGVtZW50IHRoYXQgd2lsbCBsb2FkIG90aGVyIHJlc291cmNlcy4gSXQgaXMgaW5zcGlyZWQgYnkgYW5kIG5hbWVkIGFmdGVyIGByZXF1aXJlYCBpbiBOb2RlLiBJdCB3b3JrcyB2ZXJ5IHNpbWlsYXJseSBhcyB3ZWxsLCBzbyBub3QgdG9vIG11Y2ggbmVlZHMgdG8gYmUgZXhwbGFpbmVkIGFib3V0IGl0LlxuICpcbiAqICAgRXhjZXB0IE15dGhpeCBVSSBzdGFuZGFyZCBjb21wb25lbnQgZmlsZSBzdHJ1Y3R1cmUgbWF5YmUuLi4gWWVhaCwgbWF5YmUgd2Ugc2hvdWxkIGRpc2N1c3MgdGhhdC5cbiAqXG4gKiAgIFRoZSBgPG15dGhpeC1yZXF1aXJlIHNyYz1cIi4vY29tcG9uZW50cy93aWRnZXQuaHRtbFwiPmAgdGFnIGFsbG93cyB5b3UgdG8gbG9hZCBvdGhlciByZXNvdXJjZXMgc2ltcGx5IGJ5IHNwZWNpZnlpbmcgYSBwYXRoLiBUaGlzIHBhdGggY2FuIGJlIHJlbGF0aXZlLCBvciBhYnNvbHV0ZS4gVGhlIHBhdGggY2FuIGNvbnRhaW4gcXVlcnkgcGFyYW1ldGVycy5cbiAqXG4gKiAgIFlvdSBtYXkgaGF2ZSBub3RpY2VkIHRoYXQgdGhlIHRhZyBuYW1lIGRvZXNuJ3QgcXVpdGUgbWF0Y2ggdGhlIGNsYXNzIG5hbWUsIGBNeXRoaXhVSVJlcXVpcmVgLCB2cyBgPG15dGhpeC1yZXF1aXJlPmAuIFRoaXMgZGV2aWF0aW9uIHdhcyBjaG9zZW4gYnkgdGhlIE15dGhpeCBkZXZlbG9wbWVudCB0ZWFtIGJlY2F1c2UgTXl0aGl4IGlzIGFuIGVudGlyZSBlY29zeXN0ZW0sIG5vdCBqdXN0IGEgVUkgZnJhbWV3b3JrLiBGb3IgdGhpcyByZWFzb24sIGFuZCBpbiBwYXJ0IHRvIGF2b2lkIGZ1dHVyZSBuYW1pbmcgY29sbGlzaW9ucywgd2UgaGF2ZSBkZWNpZGVkIHRoYXQgaW4gY29kZSwgdGhlIGNsYXNzIG5hbWUgc2hvdWxkIGNvbnRhaW4gdGhlIGBVSWAgcGFydCB0byBkZWxpbWl0IGl0IGZyb20gb3RoZXIgTXl0aGl4IHRlY2hub2xvZ2llcy4gTmV4dCwgd2UgZmVsdCBjb25zdGFudGx5IHR5cGluZyBgPG15dGhpeC11aS1yZXF1aXJlPmAgaW4gSFRNTCwgdnMgdGhlIG5pY2VyIGA8bXl0aGl4LXJlcXVpcmU+YCB3YXMga2luZGEgc2lsbHkuIEJlc2lkZXMsIGluIEhUTUwsIHlvdSBBUkUgaW4gdGhlIFVJIGNvbnRleHQsIHNvIHdoeSByZXBlYXQgb3Vyc2VsdmVzPyBBbnlob3csIHRoaXMgaXMganVzdCBhIGxpdHRsZSBub3RlIHRvIGtlZXAgaW4gbWluZC4gVGhlIEVsZW1lbnQgY2xhc3MgbmFtZXMgZG8gbm90IG1hdGNoIHRoZSBFbGVtZW50IGB0YWdOYW1lYCBmb3IgTXl0aGl4IFVJIHN0YW5kYXJkIGNvbXBvbmVudHMuXG4gKlxuICogICBJZiBgPG15dGhpeC1yZXF1aXJlPmAgaXMgdXNlZCB0byBmZXRjaCBhIEphdmFTY3JpcHQgcmVzb3VyY2UsIHRoZW4gaXQgYmVoYXZlcyBhbG1vc3QgaWRlbnRpY2FsbHkgdG8gYSBgPHNjcmlwdD5gIHRhZy4gSWYgaG93ZXZlciBpdCBpcyBiZWluZyB1c2VkIHRvIGZldGNoIGFub3RoZXIgdHlwZSBvZiBrbm93biByZXNvdXJjZSwgc3VjaCBhcyB0ZXh0L2h0bWwsIHRoZW4gaXQgd2lsbCBiZWhhdmUgZGlmZmVyZW50bHkuXG4gKlxuICogICBXaGVuIGFuIEhUTUwgZmlsZSBpcyBmZXRjaGVkIGJ5IGEgYDxteXRoaXgtcmVxdWlyZT5gIGVsZW1lbnQsIHRoZW4gYW55IGludGVybmFsIGA8c2NyaXB0PmAsIGA8c3R5bGU+YCwgb3Igb3RoZXIgdGFnIHRoYXQgYmVsb25ncyBpbiB0aGUgYDxoZWFkPmAgdGFnIHdpbGwgYmUgcGxhY2VkIGluIHRoZSBgPGhlYWQ+YCB0YWcgb2YgdGhlIGRvY3VtZW50LiBEdXBsaWNhdGUgaW5zZXJ0cyBhcmUgcHJldmVudGVkIGJ5IHVzZSBvZiB0YWcgaWRzLiBJZiBhIHRhZyBpbiB0aGUgYDxoZWFkPmAgb2YgdGhlIGRvY3VtZW50IGFscmVhZHkgaGFzIHRoZSBzYW1lIGlkIGFzIG9uZSBNeXRoaXhVSVJlcXVpcmUgaXMgdHJ5aW5nIHRvIGluc2VydCwgdGhlbiBNeXRoaXhVSVJlcXVpcmUgd2lsbCBhYm9ydCwgYW5kIGl0IHdvbid0IGR1cGxpY2F0ZSBpbnNlcnRpbmcgc2FpZCBlbGVtZW50LlxuICpcbiAqICAgT3RoZXIgZWxlbWVudHMgYXJlIHRyZWF0ZWQgc3BlY2lhbGx5IGFzIHdlbGwgd2hlbiBlbmNvdW50ZXJlZCBpbiB0aGUgbG9hZGVkIEhUTUwgZmlsZS4gQmVsb3cgaXMgYSB0YWJsZSBvZiBzcGVjaWFsIGNhc2VzOlxuICpcbiAqICAgfCBFbGVtZW50cyB8IE5vdGVzIHxcbiAqICAgfC0tLS0tLXwtLS0tLS0tfFxuICogICB8IGA8bGluaz5gLCBgPHN0eWxlPmAsIGA8bWV0YT5gIHwgQXJlIGFwcGVuZGVkIHRvIHRoZSBgPGhlYWQ+YCBvZiB0aGUgZG9jdW1lbnQuIHxcbiAqICAgfCBgPHNjcmlwdD5gIHwgSXMgYXBwZW5kZWQgdG8gdGhlIGA8aGVhZD5gIG9mIHRoZSBkb2N1bWVudCBhZnRlciB0aGUgYHNyY2AgYXR0cmlidXRlIGlzIGZ1bGx5IHJlc29sdmVkLiB8XG4gKiAgIHwgYDx0ZW1wbGF0ZT5gIHwgSXMgYXBwZW5kZWQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgYDxib2R5PmAgb2YgdGhlIGRvY3VtZW50LiB8XG4gKiAgIHwgYDxiYXNlPmAsIGA8bm9zY3JpcHQ+YCwgYDx0aXRsZT5gIHwgQXJlIGRlbGliZXJhdGVseSBkaXNjYXJkZWQuIHxcbiAqICAgfCBBbGwgb3RoZXJzIHwgQXJlIGFwcGVuZGVkIHRvIHRoZSBgPGJvZHk+YCBvZiB0aGUgZG9jdW1lbnQuIHxcbiAqXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IGBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyOiAoY29udGV4dDogeyBzcmM6IHN0cmluZyB8IFVSTCwgdXJsOiBVUkwsIHBhdGg6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyB9KSA9PiBzdHJpbmcgfCBVUkxgIGlzIGEgbWV0aG9kIHRoYXQgY2FuIGJlIGRlZmluZWQgYnkgdGhlIHVzZXIuIFdoZW4gZGVmaW5lZCwgaXQgd2lsbCBiZSBjYWxsZWQgZXZlcnkgdGltZSBAc2VlIENvbXBvbmVudFV0aWxzLnJlc29sdmVVUkw7IGlzIGNhbGxlZC4gYE15dGhpeFVJUmVxdWlyZWAgY2FsbHMgQHNlZSBDb21wb25lbnRVdGlscy5yZXNvbHZlVVJMOyB0byByZXNvbHZlIFVSTHMsIGluY2x1ZGluZyBpbiBzdWIgYDxzY3JpcHQ+YCB0YWcgYHNyY2AgYXR0cmlidXRlcyBsb2FkZWQgZnJvbSByZXNvdXJjZXMuIEl0IGlzIHRoZSBpbnRlbnQgb2YgdGhpcyBtZXRob2QgdGhhdCBpdCB3aWxsIGdsb2JhbGx5IHJlc29sdmUgYWxsIFVSTHMgaW50ZXJuYWwgdG8gdGhlIE15dGhpeCBVSSBmcmFtZXdvcmsuIE9idmlvdXNseSBpdCB3b24ndCByZXNvbHZlIFVSTHMgZGlyZWN0bHkgZnJvbSBzdGF0aWMgYGltcG9ydGAgb3IgZHluYW1pYyBgaW1wb3J0KClgIHN0YXRlbWVudHMgaW4gSmF2YVNjcmlwdC4gVGhvc2UgYXJlIGhhbmRsZWQgYnkgdGhlIFtpbXBvcnRtYXBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9zY3JpcHQvdHlwZS9pbXBvcnRtYXApIHlvdSBzZXR1cCwgcmVtZW1iZXI/LlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIEFub3RoZXIgY29tcG9uZW50IGNhbiBiZSBsb2FkZWQgZHluYW1pY2FsbHktLXVzdWFsbHkgYnkgbG9hZGluZyBpdHMgY29ycmVzcG9uZGluZyBIVE1MIGZpbGUgKHdoaWNoIHdpbGwgZ2VuZXJhbGx5IHRoZW4gbG9hZCB0aGUgYDxzY3JpcHQ+YCByZXF1aXJlIGJ5IHRoZSBjb21wb25lbnQpLiBJbiB0aGUgZXhhbXBsZSBiZWxvdyB3ZSBhcmUgbG9hZGluZyB0aGUgc3RhbmRhcmQgbW9kYWwgY29tcG9uZW50IHByb3ZpZGVkIGJ5IE15dGhpeCBVSTpcbiAqICAgICBgYGBodG1sXG4gKiAgICAgPG15dGhpeC1yZXF1aXJlIHNyYz1cIkBjZG4vbXl0aGl4LXVpLW1vZGFsQCR7e21ham9yVmVyc2lvbn19L2Rpc3QvbXl0aGl4LXVpLW1vZGFsLmh0bWxcIj48L215dGhpeC1yZXF1aXJlPlxuICogICAgIGBgYFxuICovXG5cbmxldCBSRVFVSVJFX0hBTkRMRVJTID0gW107XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyUmVxdWlyZUhhbmRsZXIocGF0dGVybiwgY2FsbGJhY2spIHtcbiAgUkVRVUlSRV9IQU5ETEVSUy51bnNoaWZ0KHtcbiAgICBwYXR0ZXJuLFxuICAgIGNhbGxiYWNrLFxuICB9KTtcbn1cblxucmVnaXN0ZXJSZXF1aXJlSGFuZGxlcigvXFwuaHRtbCQvaSwgYXN5bmMgZnVuY3Rpb24oeyB1cmwsIG93bmVyRG9jdW1lbnQgfSkge1xuICBsZXQge1xuICAgIHJlc3BvbnNlLFxuICAgIGNhY2hlZCxcbiAgfSA9IGF3YWl0IENvbXBvbmVudFV0aWxzLnJlcXVpcmUuY2FsbChcbiAgICB0aGlzLFxuICAgIHVybCxcbiAgICB7XG4gICAgICBtYWdpYzogICAgICAgICAgZmFsc2UsXG4gICAgICBvd25lckRvY3VtZW50OiAgb3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGlmIChjYWNoZWQpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIENvbXBvbmVudFV0aWxzLmltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICB0aGlzLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICB1cmwsXG4gICAgYm9keSxcbiAgICB7XG4gICAgICBtYWdpYzogICAgICAgIHRydWUsXG4gICAgICBub2RlSGFuZGxlcjogIChub2RlLCB7IGlzSGFuZGxlZCB9KSA9PiB7XG4gICAgICAgIGlmICghaXNIYW5kbGVkICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICB9LFxuICAgICAgcHJlUHJvY2VzczogICAoeyB0ZW1wbGF0ZSwgY2hpbGRyZW4gfSkgPT4ge1xuICAgICAgICBsZXQgc3RhclRlbXBsYXRlID0gY2hpbGRyZW4uZmluZCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQgZGF0YUZvciA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICByZXR1cm4gKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkgJiYgVEVNUExBVEVfVEVNUExBVEUudGVzdChkYXRhRm9yKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghc3RhclRlbXBsYXRlKVxuICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICBsZXQgZGF0YUZvciA9IHN0YXJUZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJyk7XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkID09PSBzdGFyVGVtcGxhdGUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgICAgICAgIGxldCBzdGFyQ2xvbmUgPSBzdGFyVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBpZiAoZGF0YUZvciA9PT0gJyp8JylcbiAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5pbnNlcnRCZWZvcmUoc3RhckNsb25lLCBjaGlsZC5jb250ZW50LmNoaWxkTm9kZXNbMF0gfHwgbnVsbCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGNoaWxkLmNvbnRlbnQuYXBwZW5kQ2hpbGQoc3RhckNsb25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFyVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdGFyVGVtcGxhdGUpO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcblxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5yZWdpc3RlclJlcXVpcmVIYW5kbGVyKC9cXC5qcyQvaSwgYXN5bmMgZnVuY3Rpb24oeyB1cmwsIG93bmVyRG9jdW1lbnQgfSkge1xuICBsZXQgcmVzdWx0ID0gQ29tcG9uZW50VXRpbHMuaW5zZXJ0U2NyaXB0SW50b0hlYWQodXJsLCB7IG93bmVyRG9jdW1lbnQgfSk7XG4gIGNvbnNvbGUubG9nKHsgc2NyaXB0RWxlbWVudDogcmVzdWx0IH0pO1xuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlSZXF1aXJlIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgcmVnaXN0ZXJIYW5kbGVyID0gcmVnaXN0ZXJSZXF1aXJlSGFuZGxlcjtcblxuICBhc3luYyBtb3VudGVkKCkge1xuICAgIHN1cGVyLm1vdW50ZWQoKTtcblxuICAgIGxldCBzcmMgPSB0aGlzLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICB0cnkge1xuICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICBsZXQgdXJsICAgICAgICAgICA9IENvbXBvbmVudFV0aWxzLnJlc29sdmVVUkwuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmxvY2F0aW9uLCBzcmMsIHsgbWFnaWM6IHRydWUgfSk7XG5cbiAgICAgIGZvciAobGV0IFsgaW5kZXgsIGhhbmRsZXIgXSBvZiBSRVFVSVJFX0hBTkRMRVJTLmVudHJpZXMoKSkge1xuICAgICAgICBsZXQge1xuICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIH0gPSBoYW5kbGVyO1xuXG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSkge1xuICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjay5jYWxsKHRoaXMsIHsgc3JjLCB1cmwsIGluZGV4LCBvd25lckRvY3VtZW50IH0pO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1yZXF1aXJlXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKCkge1xuICAgIC8vIE5PT1BcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlSZXF1aXJlO1xuXG5pZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiAhY3VzdG9tRWxlbWVudHMuZ2V0KCdteXRoaXgtcmVxdWlyZScpKVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ215dGhpeC1yZXF1aXJlJywgTXl0aGl4VUlSZXF1aXJlKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuaW1wb3J0IHsgTXl0aGl4VUlDb21wb25lbnQgfSBmcm9tICcuL215dGhpeC11aS1jb21wb25lbnQuanMnO1xuXG4vKlxuTWFueSB0aGFua3MgdG8gU2FnZWUgQ29ud2F5IGZvciB0aGUgZm9sbG93aW5nIENTUyBzcGlubmVyc1xuaHR0cHM6Ly9jb2RlcGVuLmlvL3NhY29ud2F5L3Blbi92WUtZeXJ4XG4qL1xuXG5jb25zdCBTVFlMRV9TSEVFVCA9XG5gXG46aG9zdCB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogMWVtO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG46aG9zdCguc21hbGwpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDAuNzUpO1xufVxuOmhvc3QoLm1lZGl1bSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMS41KTtcbn1cbjpob3N0KC5sYXJnZSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMyk7XG59XG4uc3Bpbm5lci1pdGVtLFxuLnNwaW5uZXItaXRlbTo6YmVmb3JlLFxuLnNwaW5uZXItaXRlbTo6YWZ0ZXIge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNjAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMjUpO1xuICB9XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMik7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3M6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjA3NSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGJvcmRlcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1sZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMS4wKTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgKiAwLjA3NSkgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci1ib3R0b206IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjg3NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMykge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSkgcm90YXRlKDQ1ZGVnKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyLjUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlcjogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEge1xuICAwJSwgOC4zMyUsIDE2LjY2JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNC45OSUsIDMzLjMyJSwgNDEuNjUlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwJSk7XG4gIH1cbiAgNDkuOTglLCA1OC4zMSUsIDY2LjY0JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMTAwJSk7XG4gIH1cbiAgNzQuOTclLCA4My4zMCUsIDkxLjYzJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyB7XG4gIDAlLCA4My4zMCUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCk7XG4gIH1cbiAgOC4zMyUsIDE2LjY2JSwgMjQuOTklIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG4gIH1cbiAgMzMuMzIlLCA0MS42NSUsIDQ5Ljk4JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIC0xMDAlKTtcbiAgfVxuICA1OC4zMSUsIDY2LjY0JSwgNzQuOTclIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gNCk7XG4gIG1pbi13aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg3NSUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03NSUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDQwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24ge1xuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDIpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAyKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSAvIC0yKTtcbn1cbmA7XG5cbmNvbnN0IEtJTkRTID0ge1xuICAnYXVkaW8nOiAgNSxcbiAgJ2NpcmNsZSc6IDMsXG4gICdkb3QnOiAgICAyLFxuICAncGlwZSc6ICAgNSxcbiAgJ3B1enpsZSc6IDMsXG4gICd3YXZlJzogICAzLFxufTtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJU3Bpbm5lciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LXNwaW5uZXInO1xuXG4gIHNldCBhdHRyJGtpbmQoWyBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgc3VwZXIubW91bnRlZCgpO1xuXG4gICAgaWYgKCF0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIGFwcGVuZCB0ZW1wbGF0ZVxuICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICB0aGlzLiRidWlsZCgoeyBURU1QTEFURSB9KSA9PiB7XG4gICAgICAgIHJldHVybiBURU1QTEFURVxuICAgICAgICAgIC5kYXRhTXl0aGl4TmFtZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpXG4gICAgICAgICAgLnByb3AkaW5uZXJIVE1MKGA8c3R5bGU+JHtTVFlMRV9TSEVFVH08L3N0eWxlPmApO1xuICAgICAgfSkuYXBwZW5kVG8ob3duZXJEb2N1bWVudC5ib2R5KTtcblxuICAgICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKTtcbiAgICAgIHRoaXMuYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgbGV0IGtpbmQgPSB0aGlzLmdldEF0dHJpYnV0ZSgna2luZCcpO1xuICAgIGlmICgha2luZCkge1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdraW5kJywga2luZCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKGtpbmQpO1xuICB9XG5cbiAgaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShfa2luZCkge1xuICAgIGxldCBraW5kICAgICAgICA9ICgnJyArIF9raW5kKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKEtJTkRTLCBraW5kKSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1zcGlubmVyXCIgdW5rbm93biBcImtpbmRcIiBwcm92aWRlZDogXCIke2tpbmR9XCIuIFN1cHBvcnRlZCBcImtpbmRcIiBhdHRyaWJ1dGUgdmFsdWVzIGFyZTogXCJwaXBlXCIsIFwiYXVkaW9cIiwgXCJjaXJjbGVcIiwgXCJwdXp6bGVcIiwgXCJ3YXZlXCIsIGFuZCBcImRvdFwiLmApO1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5nZVNwaW5uZXJDaGlsZHJlbihLSU5EU1traW5kXSk7XG4gIH1cblxuICBidWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIGxldCBjaGlsZHJlbiAgICAgID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3Bpbm5lci1pdGVtJyk7XG5cbiAgICAgIGNoaWxkcmVuW2ldID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoY2hpbGRyZW4pO1xuICB9XG5cbiAgY2hhbmdlU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgdGhpcy5zZWxlY3QoJy5zcGlubmVyLWl0ZW0nKS5yZW1vdmUoKTtcbiAgICB0aGlzLmJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG5cbiAgICAvLyBBbHdheXMgYXBwZW5kIHN0eWxlIGFnYWluLCBzb1xuICAgIC8vIHRoYXQgaXQgaXMgdGhlIGxhc3QgY2hpbGQsIGFuZFxuICAgIC8vIGRvZXNuJ3QgbWVzcyB3aXRoIFwibnRoLWNoaWxkXCJcbiAgICAvLyBzZWxlY3RvcnNcbiAgICB0aGlzLnNlbGVjdCgnc3R5bGUnKS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG4gIH1cbn1cblxuTXl0aGl4VUlTcGlubmVyLnJlZ2lzdGVyKCk7XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVNwaW5uZXI7XG4iLCJpbXBvcnQge1xuICBNWVRISVhfVFlQRSxcbiAgUVVFUllfRU5HSU5FX1RZUEUsXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHtcbiAgRWxlbWVudERlZmluaXRpb24sXG59IGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19JTlRFR0VSID0gL15cXGQrJC87XG5cbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBXZSBoYXZlIGFuIEVsZW1lbnQgb3IgYSBEb2N1bWVudFxuICBpZiAodmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzU2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGlzTm90U2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gIWVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2xhc3NOYW1lcyguLi5hcmdzKSB7XG4gIGxldCBjbGFzc05hbWVzID0gW10uY29uY2F0KC4uLmFyZ3MpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5tYXAoKHBhcnQpID0+ICgnJyArIHBhcnQpLnNwbGl0KC9cXHMrLykpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcmV0dXJuIGNsYXNzTmFtZXM7XG59XG5cbmV4cG9ydCBjbGFzcyBRdWVyeUVuZ2luZSB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaXNFbGVtZW50ICAgID0gaXNFbGVtZW50O1xuICBzdGF0aWMgaXNTbG90dGVkICAgID0gaXNTbG90dGVkO1xuICBzdGF0aWMgaXNOb3RTbG90dGVkID0gaXNOb3RTbG90dGVkO1xuXG4gIHN0YXRpYyBmcm9tID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoW10sIHsgcm9vdDogKGlzRWxlbWVudCh0aGlzKSkgPyB0aGlzIDogZG9jdW1lbnQsIGNvbnRleHQ6IHRoaXMgfSk7XG5cbiAgICBjb25zdCBnZXRPcHRpb25zID0gKCkgPT4ge1xuICAgICAgbGV0IGJhc2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oYmFzZSwgYXJnc1thcmdJbmRleCsrXSk7XG5cbiAgICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBhcmdzW2FyZ0luZGV4XS5nZXRPcHRpb25zKCkgfHwge30sIGJhc2UpO1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0Um9vdEVsZW1lbnQgPSAob3B0aW9uc1Jvb3QpID0+IHtcbiAgICAgIGlmIChpc0VsZW1lbnQob3B0aW9uc1Jvb3QpKVxuICAgICAgICByZXR1cm4gb3B0aW9uc1Jvb3Q7XG5cbiAgICAgIGlmIChpc0VsZW1lbnQodGhpcykpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICByZXR1cm4gKCh0aGlzICYmIHRoaXMub3duZXJEb2N1bWVudCkgfHwgZG9jdW1lbnQpO1xuICAgIH07XG5cbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gZ2V0T3B0aW9ucygpO1xuICAgIGxldCByb290ICAgICAgPSBnZXRSb290RWxlbWVudChvcHRpb25zLnJvb3QpO1xuICAgIGxldCBxdWVyeUVuZ2luZTtcblxuICAgIG9wdGlvbnMucm9vdCA9IHJvb3Q7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IHRoaXM7XG5cbiAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0uc2xpY2UoKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzW2FyZ0luZGV4XSkpIHtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXggKyAxXSwgJzo6RnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbMV07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKEJhc2VVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICc6OlN0cmluZycpKSB7XG4gICAgICBvcHRpb25zLnNlbGVjdG9yID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICc6OkZ1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyb290LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3RvciksIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6RnVuY3Rpb24nKSkge1xuICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwgb3B0aW9ucyk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbnZva2VDYWxsYmFja3MgIT09IGZhbHNlICYmIHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfTtcblxuICBnZXRFbmdpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gUXVlcnlFbmdpbmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgICAgIH0sXG4gICAgICAnX215dGhpeFVJT3B0aW9ucyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvcHRpb25zLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlFbGVtZW50cyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKG9wdGlvbnMuY29udGV4dCwgZWxlbWVudHMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCByb290UHJveHkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BOYW1lID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2xlbmd0aCcpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAncHJvdG90eXBlJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjb25zdHJ1Y3RvcicpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5jb25zdHJ1Y3RvcjtcblxuICAgICAgICAvLyBJbmRleCBsb29rdXBcbiAgICAgICAgaWYgKElTX0lOVEVHRVIudGVzdChwcm9wTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgICAvLyBSZWRpcmVjdCBhbnkgYXJyYXkgbWV0aG9kczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gXCJtYWdpY1Byb3BOYW1lXCIgaXMgd2hlbiB0aGVcbiAgICAgICAgLy8gZnVuY3Rpb24gbmFtZSBiZWdpbnMgd2l0aCBcIiRcIixcbiAgICAgICAgLy8gaS5lLiBcIiRmaWx0ZXJcIiwgb3IgXCIkbWFwXCIuIElmXG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2UsIHRoZW4gdGhlIHJldHVyblxuICAgICAgICAvLyB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBjb2VyY2VkIGludG9cbiAgICAgICAgLy8gYSBRdWVyeUVuZ2luZS4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICAgICAgIC8vIG9ubHkgYmUgY29lcmNlZCBpbnRvIGEgUXVlcnlFbmdpbmVcbiAgICAgICAgLy8gaWYgRVZFUlkgZWxlbWVudCBpbiB0aGUgcmVzdWx0IGlzXG4gICAgICAgIC8vIGFuIFwiZWxlbWVudHlcIiB0eXBlIHZhbHVlLlxuICAgICAgICBsZXQgbWFnaWNQcm9wTmFtZSA9IChwcm9wTmFtZS5jaGFyQXQoMCkgPT09ICckJykgPyBwcm9wTmFtZS5zdWJzdHJpbmcoMSkgOiBwcm9wTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGVbbWFnaWNQcm9wTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGxldCBhcnJheSAgID0gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCAgPSBhcnJheVttYWdpY1Byb3BOYW1lXSguLi5hcmdzKTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiAobWFnaWNQcm9wTmFtZSAhPT0gcHJvcE5hbWUgfHwgcmVzdWx0LmV2ZXJ5KChpdGVtKSA9PiBCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uLCBOb2RlLCBRdWVyeUVuZ2luZSkpKSkge1xuICAgICAgICAgICAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRhcmdldC5nZXRFbmdpbmVDbGFzcygpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHJlc3VsdCwgdGFyZ2V0LmdldE9wdGlvbnMoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByb290UHJveHk7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSU9wdGlvbnM7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5yb290IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZ2V0VW5kZXJseWluZ0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuICB9XG5cbiAgZ2V0T3duZXJEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSb290KCkub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKGNvbnRleHQsIGVsZW1lbnRzKSB7XG4gICAgbGV0IGZpbmFsRWxlbWVudHMgPSBBcnJheS5mcm9tKGVsZW1lbnRzKS5mbGF0KEluZmluaXR5KS5tYXAoKF9pdGVtKSA9PiB7XG4gICAgICBpZiAoIV9pdGVtKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBpdGVtID0gX2l0ZW07XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICByZXR1cm4gaXRlbS5nZXRVbmRlcmx5aW5nQXJyYXkoKTtcblxuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgTm9kZSkpXG4gICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICBpZiAoaXRlbVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICBpdGVtID0gaXRlbSgpO1xuXG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShpdGVtLCAnOjpTdHJpbmcnKSlcbiAgICAgICAgaXRlbSA9IEVsZW1lbnRzLlRlcm0oaXRlbSk7XG4gICAgICBlbHNlIGlmICghQmFzZVV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKCFjb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImNvbnRleHRcIiBvcHRpb24gZm9yIFF1ZXJ5RW5naW5lIGlzIHJlcXVpcmVkIHdoZW4gY29uc3RydWN0aW5nIGVsZW1lbnRzLicpO1xuXG4gICAgICByZXR1cm4gaXRlbS5idWlsZCh0aGlzLmdldE93bmVyRG9jdW1lbnQoKSwge1xuICAgICAgICBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUoY29udGV4dCksXG4gICAgICB9KTtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGZpbmFsRWxlbWVudHMpKTtcbiAgfVxuXG4gIHNlbGVjdCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgdGhpcy5nZXRPcHRpb25zKCksIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpID8gYXJnc1thcmdJbmRleCsrXSA6IHt9KTtcblxuICAgIGlmIChvcHRpb25zLmNvbnRleHQgJiYgdHlwZW9mIG9wdGlvbnMuY29udGV4dC4kID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dC4kLmNhbGwob3B0aW9ucy5jb250ZXh0LCBvcHRpb25zLCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gRW5naW5lQ2xhc3MuZnJvbS5jYWxsKG9wdGlvbnMuY29udGV4dCB8fCB0aGlzLCBvcHRpb25zLCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gIH1cblxuICAqZW50cmllcygpIHtcbiAgICBsZXQgZWxlbWVudHMgPSB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgIHlpZWxkKFtpLCBlbGVtZW50XSk7XG4gICAgfVxuICB9XG5cbiAgKmtleXMoKSB7XG4gICAgZm9yIChsZXQgWyBrZXksIF8gXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIGtleTtcbiAgfVxuXG4gICp2YWx1ZXMoKSB7XG4gICAgZm9yIChsZXQgWyBfLCB2YWx1ZSBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQgdmFsdWU7XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHlpZWxkICp0aGlzLnZhbHVlcygpO1xuICB9XG5cbiAgZmlyc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIUJhc2VVdGlscy5pc1R5cGUoY291bnQsICc6Ok51bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1swXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSkpO1xuICB9XG5cbiAgbGFzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhQmFzZVV0aWxzLmlzVHlwZShjb3VudCwgJzo6TnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzW3RoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoIC0gMV0gXSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkgKiAtMSkpO1xuICB9XG5cbiAgYWRkKC4uLmVsZW1lbnRzKSB7XG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLnNsaWNlKCkuY29uY2F0KC4uLmVsZW1lbnRzKSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgc3VidHJhY3QoLi4uZWxlbWVudHMpIHtcbiAgICBsZXQgc2V0ID0gbmV3IFNldChlbGVtZW50cyk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gIXNldC5oYXMoaXRlbSk7XG4gICAgfSksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYXBwZW5kVG8oc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnOjpTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgfVxuXG4gIGluc2VydEludG8oc2VsZWN0b3JPckVsZW1lbnQsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnOjpTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5nZXRPd25lckRvY3VtZW50KCk7XG4gICAgbGV0IHNvdXJjZSAgICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cbiAgICAgIHNvdXJjZSA9IFsgZnJhZ21lbnQgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50Lmluc2VydChzb3VyY2VbMF0sIHJlZmVyZW5jZU5vZGUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXBsYWNlQ2hpbGRyZW5PZihzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICc6OlN0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBlbmRUbyhlbGVtZW50KTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xhc3NMaXN0KG9wZXJhdGlvbiwgLi4uYXJncykge1xuICAgIGxldCBjbGFzc05hbWVzID0gY29sbGVjdENsYXNzTmFtZXMoYXJncyk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAndG9nZ2xlJylcbiAgICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4gbm9kZS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZS5jbGFzc0xpc3Rbb3BlcmF0aW9uXSguLi5jbGFzc05hbWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ2FkZCcsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgncmVtb3ZlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICB0b2dnbGVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCd0b2dnbGUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHNsb3R0ZWQoeWVzTm8pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgeWVzTm8pID8gaXNTbG90dGVkIDogaXNOb3RTbG90dGVkKTtcbiAgfVxuXG4gIHNsb3Qoc2xvdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuc2xvdCA9PT0gc2xvdE5hbWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAoZWxlbWVudC5jbG9zZXN0KGBzbG90W25hbWU9XCIke3Nsb3ROYW1lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuUXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuLypcbk1hbnkgdGhhbmtzIHRvIEdlcmFpbnQgTHVmZiBmb3IgdGhlIGZvbGxvd2luZ1xuXG5odHRwczovL2dpdGh1Yi5jb20vZ2VyYWludGx1ZmYvc2hhMjU2L1xuKi9cblxuLyoqXG4gKiB0eXBlOiBGdW5jdGlvblxuICogbmFtZTogU0hBMjU2XG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBTSEEyNTYgaGFzaGluZyBmdW5jdGlvblxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGlucHV0XG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IElucHV0IHN0cmluZ1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBTSEEyNTYgaGFzaCBvZiB0aGUgcHJvdmlkZWQgYGlucHV0YC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVGhpcyBpcyBhIGN1c3RvbSBiYWtlZCBTSEEyNTYgaGFzaGluZyBmdW5jdGlvbiwgbWluaW1pemVkIGZvciBzaXplLlxuICogICAgIEl0IG1heSBiZSBpbmNvbXBsZXRlLCBhbmQgaXQgaXMgc3Ryb25nbHkgcmVjb21tZW5kZWQgdGhhdCB5b3UgKipETyBOT1QqKiB1c2UgdGhpc1xuICogICAgIGZvciBhbnl0aGluZyByZWxhdGVkIHRvIHNlY3VyaXR5LlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogUmVhZCBhbGwgdGhlIG5vdGVzLCBhbmQgdXNlIHRoaXMgbWV0aG9kIHdpdGggY2F1dGlvbi5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgbWV0aG9kIGhhcyBiZWVuIG1vZGlmaWVkIHNsaWdodGx5IGZyb20gdGhlIG9yaWdpbmFsIHRvICpub3QqIGJhaWwgd2hlblxuICogICAgIHVuaWNvZGUgY2hhcmFjdGVycyBhcmUgZGV0ZWN0ZWQuIFRoZXJlIGlzIGEgZGVjZW50IGNoYW5jZSB0aGF0LS1naXZlbiBjZXJ0YWluXG4gKiAgICAgaW5wdXQtLXRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGFuIGludmFsaWQgU0hBMjU2IGhhc2guXCJcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IE15dGhpeCBVSSB1c2VzIHRoaXMgbWV0aG9kIHNpbXBseSB0byBnZW5lcmF0ZSBjb25zaXN0ZW50IElEcy5cbiAqICAgLSB8XG4gKiAgICAgOmhlYXJ0OiBNYW55IHRoYW5rcyB0byB0aGUgYXV0aG9yIFtHZXJhaW50IEx1ZmZdKGh0dHBzOi8vZ2l0aHViLmNvbS9nZXJhaW50bHVmZi9zaGEyNTYvKVxuICogICAgIGZvciB0aGlzIG1ldGhvZCFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFNIQTI1NihfaW5wdXQpIHtcbiAgbGV0IGlucHV0ID0gX2lucHV0O1xuXG4gIGxldCBtYXRoUG93ID0gTWF0aC5wb3c7XG4gIGxldCBtYXhXb3JkID0gbWF0aFBvdygyLCAzMik7XG4gIGxldCBsZW5ndGhQcm9wZXJ0eSA9ICdsZW5ndGgnO1xuICBsZXQgaTsgbGV0IGo7IC8vIFVzZWQgYXMgYSBjb3VudGVyIGFjcm9zcyB0aGUgd2hvbGUgZmlsZVxuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgbGV0IHdvcmRzID0gW107XG4gIGxldCBhc2NpaUJpdExlbmd0aCA9IGlucHV0W2xlbmd0aFByb3BlcnR5XSAqIDg7XG5cbiAgLy8qIGNhY2hpbmcgcmVzdWx0cyBpcyBvcHRpb25hbCAtIHJlbW92ZS9hZGQgc2xhc2ggZnJvbSBmcm9udCBvZiB0aGlzIGxpbmUgdG8gdG9nZ2xlXG4gIC8vIEluaXRpYWwgaGFzaCB2YWx1ZTogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lc1xuICAvLyAod2UgYWN0dWFsbHkgY2FsY3VsYXRlIHRoZSBmaXJzdCA2NCwgYnV0IGV4dHJhIHZhbHVlcyBhcmUganVzdCBpZ25vcmVkKVxuICBsZXQgaGFzaCA9IFNIQTI1Ni5oID0gU0hBMjU2LmggfHwgW107XG4gIC8vIFJvdW5kIGNvbnN0YW50czogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgY3ViZSByb290cyBvZiB0aGUgZmlyc3QgNjQgcHJpbWVzXG4gIGxldCBrID0gU0hBMjU2LmsgPSBTSEEyNTYuayB8fCBbXTtcbiAgbGV0IHByaW1lQ291bnRlciA9IGtbbGVuZ3RoUHJvcGVydHldO1xuICAvKi9cbiAgICBsZXQgaGFzaCA9IFtdLCBrID0gW107XG4gICAgbGV0IHByaW1lQ291bnRlciA9IDA7XG4gICAgLy8qL1xuXG4gIGxldCBpc0NvbXBvc2l0ZSA9IHt9O1xuICBmb3IgKGxldCBjYW5kaWRhdGUgPSAyOyBwcmltZUNvdW50ZXIgPCA2NDsgY2FuZGlkYXRlKyspIHtcbiAgICBpZiAoIWlzQ29tcG9zaXRlW2NhbmRpZGF0ZV0pIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAzMTM7IGkgKz0gY2FuZGlkYXRlKVxuICAgICAgICBpc0NvbXBvc2l0ZVtpXSA9IGNhbmRpZGF0ZTtcblxuICAgICAgaGFzaFtwcmltZUNvdW50ZXJdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAwLjUpICogbWF4V29yZCkgfCAwO1xuICAgICAga1twcmltZUNvdW50ZXIrK10gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDEgLyAzKSAqIG1heFdvcmQpIHwgMDtcbiAgICB9XG4gIH1cblxuICBpbnB1dCArPSAnXFx4ODAnOyAvLyBBcHBlbmQgxocnIGJpdCAocGx1cyB6ZXJvIHBhZGRpbmcpXG4gIHdoaWxlIChpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gJSA2NCAtIDU2KVxuICAgIGlucHV0ICs9ICdcXHgwMCc7IC8vIE1vcmUgemVybyBwYWRkaW5nXG5cbiAgZm9yIChpID0gMDsgaSA8IGlucHV0W2xlbmd0aFByb3BlcnR5XTsgaSsrKSB7XG4gICAgaiA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGogPj4gOClcbiAgICAgIHJldHVybjsgLy8gQVNDSUkgY2hlY2s6IG9ubHkgYWNjZXB0IGNoYXJhY3RlcnMgaW4gcmFuZ2UgMC0yNTVcbiAgICB3b3Jkc1tpID4+IDJdIHw9IGogPDwgKCgzIC0gaSkgJSA0KSAqIDg7XG4gIH1cblxuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKChhc2NpaUJpdExlbmd0aCAvIG1heFdvcmQpIHwgMCk7XG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoYXNjaWlCaXRMZW5ndGgpO1xuXG4gIC8vIHByb2Nlc3MgZWFjaCBjaHVua1xuICBmb3IgKGogPSAwOyBqIDwgd29yZHNbbGVuZ3RoUHJvcGVydHldOykge1xuICAgIGxldCB3ID0gd29yZHMuc2xpY2UoaiwgaiArPSAxNik7IC8vIFRoZSBtZXNzYWdlIGlzIGV4cGFuZGVkIGludG8gNjQgd29yZHMgYXMgcGFydCBvZiB0aGUgaXRlcmF0aW9uXG4gICAgbGV0IG9sZEhhc2ggPSBoYXNoO1xuXG4gICAgLy8gVGhpcyBpcyBub3cgdGhlIHVuZGVmaW5lZHdvcmtpbmcgaGFzaFwiLCBvZnRlbiBsYWJlbGxlZCBhcyB2YXJpYWJsZXMgYS4uLmdcbiAgICAvLyAod2UgaGF2ZSB0byB0cnVuY2F0ZSBhcyB3ZWxsLCBvdGhlcndpc2UgZXh0cmEgZW50cmllcyBhdCB0aGUgZW5kIGFjY3VtdWxhdGVcbiAgICBoYXNoID0gaGFzaC5zbGljZSgwLCA4KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2UgaW50byA2NCB3b3Jkc1xuICAgICAgLy8gVXNlZCBiZWxvdyBpZlxuICAgICAgbGV0IHcxNSA9IHdbaSAtIDE1XTsgbGV0IHcyID0gd1tpIC0gMl07XG5cbiAgICAgIC8vIEl0ZXJhdGVcbiAgICAgIGxldCBhID0gaGFzaFswXTsgbGV0IGUgPSBoYXNoWzRdO1xuICAgICAgbGV0IHRlbXAxID0gaGFzaFs3XVxuICAgICAgICAgICAgICAgICsgKCgoZSA+Pj4gNikgfCAoZSA8PCAyNikpIF4gKChlID4+PiAxMSkgfCAoZSA8PCAyMSkpIF4gKChlID4+PiAyNSkgfCAoZSA8PCA3KSkpIC8vIFMxXG4gICAgICAgICAgICAgICAgKyAoKGUgJiBoYXNoWzVdKSBeICgofmUpICYgaGFzaFs2XSkpIC8vIGNoXG4gICAgICAgICAgICAgICAgKyBrW2ldXG4gICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICsgKHdbaV0gPSAoaSA8IDE2KSA/IHdbaV0gOiAoXG4gICAgICAgICAgICAgICAgICB3W2kgLSAxNl1cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzE1ID4+PiA3KSB8ICh3MTUgPDwgMjUpKSBeICgodzE1ID4+PiAxOCkgfCAodzE1IDw8IDE0KSkgXiAodzE1ID4+PiAzKSkgLy8gczBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgd1tpIC0gN11cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzIgPj4+IDE3KSB8ICh3MiA8PCAxNSkpIF4gKCh3MiA+Pj4gMTkpIHwgKHcyIDw8IDEzKSkgXiAodzIgPj4+IDEwKSkgLy8gczFcbiAgICAgICAgICAgICAgICApIHwgMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAvLyBUaGlzIGlzIG9ubHkgdXNlZCBvbmNlLCBzbyAqY291bGQqIGJlIG1vdmVkIGJlbG93LCBidXQgaXQgb25seSBzYXZlcyA0IGJ5dGVzIGFuZCBtYWtlcyB0aGluZ3MgdW5yZWFkYmxlXG4gICAgICBsZXQgdGVtcDIgPSAoKChhID4+PiAyKSB8IChhIDw8IDMwKSkgXiAoKGEgPj4+IDEzKSB8IChhIDw8IDE5KSkgXiAoKGEgPj4+IDIyKSB8IChhIDw8IDEwKSkpIC8vIFMwXG4gICAgICAgICAgICAgICAgKyAoKGEgJiBoYXNoWzFdKSBeIChhICYgaGFzaFsyXSkgXiAoaGFzaFsxXSAmIGhhc2hbMl0pKTsgLy8gbWFqXG5cbiAgICAgIGhhc2ggPSBbKHRlbXAxICsgdGVtcDIpIHwgMF0uY29uY2F0KGhhc2gpOyAvLyBXZSBkb24ndCBib3RoZXIgdHJpbW1pbmcgb2ZmIHRoZSBleHRyYSBvbmVzLCB0aGV5J3JlIGhhcm1sZXNzIGFzIGxvbmcgYXMgd2UncmUgdHJ1bmNhdGluZyB3aGVuIHdlIGRvIHRoZSBzbGljZSgpXG4gICAgICBoYXNoWzRdID0gKGhhc2hbNF0gKyB0ZW1wMSkgfCAwO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICBoYXNoW2ldID0gKGhhc2hbaV0gKyBvbGRIYXNoW2ldKSB8IDA7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgZm9yIChqID0gMzsgaiArIDE7IGotLSkge1xuICAgICAgbGV0IGIgPSAoaGFzaFtpXSA+PiAoaiAqIDgpKSAmIDI1NTtcbiAgICAgIHJlc3VsdCArPSAoKGIgPCAxNikgPyAwIDogJycpICsgYi50b1N0cmluZygxNik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7XG4gIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLFxuICBNWVRISVhfU0hBRE9XX1BBUkVOVCxcbiAgTVlUSElYX1RZUEUsXG4gIEVMRU1FTlRfREVGSU5JVElPTl9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IFV0aWxzXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIGBpbXBvcnQgeyBVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgTWlzYyB1dGlsaXR5IGZ1bmN0aW9ucyBhcmUgZm91bmQgd2l0aGluIHRoaXMgbmFtZXNwYWNlLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTWV0aG9kcyhfcHJvdG8sIHNraXBQcm90b3MpIHtcbiAgbGV0IHByb3RvICAgICAgICAgICA9IF9wcm90bztcbiAgbGV0IGFscmVhZHlWaXNpdGVkICA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAocHJvdG8pIHtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90byk7XG4gICAgbGV0IGtleXMgICAgICAgID0gT2JqZWN0LmtleXMoZGVzY3JpcHRvcnMpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGRlc2NyaXB0b3JzKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyB8fCBrZXkgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyhrZXkpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKGtleSk7XG5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gZGVzY3JpcHRvcnNba2V5XTtcblxuICAgICAgLy8gQ2FuIGl0IGJlIGNoYW5nZWQ/XG4gICAgICBpZiAoZGVzY3JpcHRvci5jb25maWd1cmFibGUgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gSWYgaXMgZ2V0dGVyLCB0aGVuIHNraXBcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ2dldCcpIHx8IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnc2V0JykpIHtcbiAgICAgICAgbGV0IG5ld0Rlc2NyaXB0b3IgPSB7IC4uLmRlc2NyaXB0b3IgfTtcbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3IuZ2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IuZ2V0ID0gbmV3RGVzY3JpcHRvci5nZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5zZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5zZXQgPSBuZXdEZXNjcmlwdG9yLnNldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcblxuICAgICAgLy8gU2tpcCBwcm90b3R5cGUgb2YgT2JqZWN0XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIE9iamVjdC5wcm90b3R5cGVba2V5XSA9PT0gdmFsdWUpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAuLi5kZXNjcmlwdG9yLCB2YWx1ZTogdmFsdWUuYmluZCh0aGlzKSB9KTtcbiAgICB9XG5cbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgYnJlYWs7XG5cbiAgICBpZiAoc2tpcFByb3RvcyAmJiBza2lwUHJvdG9zLmluZGV4T2YocHJvdG8pID49IDApXG4gICAgICBicmVhaztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihzdGFydFByb3RvLCBkZXNjcmlwdG9yTmFtZSkge1xuICBsZXQgdGhpc1Byb3RvID0gc3RhcnRQcm90bztcbiAgbGV0IGRlc2NyaXB0b3I7XG5cbiAgd2hpbGUgKHRoaXNQcm90byAmJiAhKGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXNQcm90bywgZGVzY3JpcHRvck5hbWUpKSlcbiAgICB0aGlzUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1Byb3RvKTtcblxuICByZXR1cm4geyBwcm90b3R5cGU6IHRoaXNQcm90bywgZGVzY3JpcHRvciB9O1xufVxuXG5jb25zdCBNRVRBREFUQV9TVE9SQUdFID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9tZXRhZGF0YS1zdG9yYWdlJyk7XG5jb25zdCBNRVRBREFUQV9XRUFLTUFQID0gZ2xvYmFsVGhpcy5teXRoaXhVSVtNRVRBREFUQV9TVE9SQUdFXSA9IChnbG9iYWxUaGlzLm15dGhpeFVJW01FVEFEQVRBX1NUT1JBR0VdKSA/IGdsb2JhbFRoaXMubXl0aGl4VUlbTUVUQURBVEFfU1RPUkFHRV0gOiBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgU3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhIG9uIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqXG4gKiAgIFRoaXMgZnVuY3Rpb24gdXNlcyBhbiBpbnRlcm5hbCBXZWFrTWFwIHRvIHN0b3JlIG1ldGFkYXRhIGZvciBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSB2YWx1ZS5cbiAqXG4gKiAgIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHByb3ZpZGVkIHdpbGwgY2hhbmdlIHRoZSBiZWhhdmlvciBvZiB0aGlzIGZ1bmN0aW9uOlxuICogICAxLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBzdXBwbGllZCAoYSBgdGFyZ2V0YCksIHRoZW4gYSBNYXAgb2YgbWV0YWRhdGEga2V5L3ZhbHVlIHBhaXJzIGlzIHJldHVybmVkLlxuICogICAyLiBJZiBvbmx5IHR3byBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCB0aGVuIGBtZXRhZGF0YWAgYWN0cyBhcyBhIGdldHRlciwgYW5kIHRoZSB2YWx1ZSBzdG9yZWQgdW5kZXIgdGhlIHNwZWNpZmllZCBga2V5YCBpcyByZXR1cm5lZC5cbiAqICAgMy4gSWYgbW9yZSB0aGFuIHR3byBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCB0aGVuIGBtZXRhZGF0YWAgYWN0cyBhcyBhIHNldHRlciwgYW5kIGB0YXJnZXRgIGlzIHJldHVybmVkIChmb3IgY29udGludWVkIGNoYWluaW5nKS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB0YXJnZXRcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyB0aGUgdmFsdWUgZm9yIHdoaWNoIG1ldGFkYXRhIGlzIGJlaW5nIHN0b3JlZCBvciByZXRyaWV2ZWQuXG4gKiAgICAgICBUaGlzIGNhbiBiZSBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSB2YWx1ZSAoYW55IHZhbHVlIHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBrZXkgaW4gYSBXZWFrTWFwKS5cbiAqICAgLSBuYW1lOiBrZXlcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgb3B0aW9uYWw6IHRydWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUga2V5IHVzZWQgdG8gc3RvcmUgb3IgZmV0Y2ggdGhlIHNwZWNpZmllZCBtZXRhZGF0YSB2YWx1ZS4gVGhpcyBjYW4gYmUgYW55IHZhbHVlLCBhcyB0aGUgdW5kZXJseWluZ1xuICogICAgICAgc3RvcmFnZSBpcyBhIE1hcC5cbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBvcHRpb25hbDogdHJ1ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSB2YWx1ZSB0byBzdG9yZSBvbiB0aGUgYHRhcmdldGAgdW5kZXIgdGhlIHNwZWNpZmllZCBga2V5YC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYW55O1xuICogICAxLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCAoYSBidWxrIGdldCBvcGVyYXRpb24pLCByZXR1cm4gYSBNYXAgY29udGFpbmluZyB0aGUgbWV0YWRhdGEgZm9yIHRoZSBzcGVjaWZpZWQgYHRhcmdldGAuXG4gKiAgIDIuIElmIHR3byBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIChhIGdldCBvcGVyYXRpb24pLCB0aGUgYHRhcmdldGAgbWV0YWRhdGEgdmFsdWUgc3RvcmVkIGZvciB0aGUgc3BlY2lmaWVkIGBrZXlgLlxuICogICAyLiBJZiBtb3JlIHRoYW4gdHdvIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgKGEgc2V0IG9wZXJhdGlvbiksIHRoZSBwcm92aWRlZCBgdGFyZ2V0YCBpcyByZXR1cm5lZC5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICAvLyBzZXRcbiAqICAgICBVdGlscy5tZXRhZGF0YShteUVsZW1lbnQsICdjdXN0b21DYXB0aW9uJywgJ01ldGFkYXRhIENhcHRpb24hJyk7XG4gKlxuICogICAgIC8vIGdldFxuICogICAgIGNvbnNvbGUubG9nKFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCwgJ2N1c3RvbUNhcHRpb24nKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICdNZXRhZGF0YSBDYXB0aW9uISdcbiAqXG4gKiAgICAgLy8gZ2V0IGFsbFxuICogICAgIGNvbnNvbGUubG9nKFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCkpO1xuICogICAgIC8vIG91dHB1dCAtPiBNYXAoMSkgeyAnY3VzdG9tQ2FwdGlvbicgPT4gJ01ldGFkYXRhIENhcHRpb24hJyB9XG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoIWRhdGEpIHtcbiAgICBpZiAoIUJhc2VVdGlscy5pc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBzZXQgbWV0YWRhdGEgb24gcHJvdmlkZWQgb2JqZWN0OiAkeyh0eXBlb2YgdGFyZ2V0ID09PSAnc3ltYm9sJykgPyB0YXJnZXQudG9TdHJpbmcoKSA6IHRhcmdldH1gKTtcblxuICAgIGRhdGEgPSBuZXcgTWFwKCk7XG4gICAgTUVUQURBVEFfV0VBS01BUC5zZXQodGFyZ2V0LCBkYXRhKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKVxuICAgIHJldHVybiBkYXRhO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKVxuICAgIHJldHVybiAoZGF0YSkgPyBkYXRhLmdldChrZXkpIDogdW5kZWZpbmVkO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IFZBTElEX0pTX0lERU5USUZJRVIgPSAvXlthLXpBLVpfJF1bYS16QS1aMC05XyRdKiQvO1xuY29uc3QgUkVTRVJWRURfSURFTlRJRklFUiA9IC9eKGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxleHBvcnR8ZXh0ZW5kc3xmYWxzZXxmaW5hbGx5fGZvcnxmdW5jdGlvbnxpZnxpbXBvcnR8aW58aW5zdGFuY2VvZnxuZXd8bnVsbHxyZXR1cm58c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ1ZXx0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8bGV0fHN0YXRpY3x5aWVsZCkkLztcblxuZnVuY3Rpb24gZ2V0Q29udGV4dENhbGxBcmdzKGNvbnRleHQsIC4uLmV4dHJhQ29udGV4dHMpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IEFycmF5LmZyb20oXG4gICAgbmV3IFNldChnZXRBbGxQcm9wZXJ0eU5hbWVzKGNvbnRleHQpLmNvbmNhdChcbiAgICAgIE9iamVjdC5rZXlzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pLFxuICAgICAgWyAnYXR0cmlidXRlcycsICdjbGFzc0xpc3QnLCAnJCQnLCAnaTE4bicgXSxcbiAgICAgIC4uLmV4dHJhQ29udGV4dHMubWFwKChleHRyYUNvbnRleHQpID0+IE9iamVjdC5rZXlzKGV4dHJhQ29udGV4dCB8fCB7fSkpLFxuICAgICkpLFxuICApLmZpbHRlcigobmFtZSkgPT4ge1xuICAgIGlmIChSRVNFUlZFRF9JREVOVElGSUVSLnRlc3QobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpO1xuICB9KTtcblxuICByZXR1cm4gYHske2NvbnRleHRDYWxsQXJncy5qb2luKCcsJyl9fWA7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBHZXQgdGhlIHBhcmVudCBOb2RlIG9mIGBlbGVtZW50YC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBlbGVtZW50XG4gKiAgICAgZGF0YVR5cGU6IE5vZGVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgTm9kZSB3aG9zZSBwYXJlbnQgeW91IHdpc2ggdG8gZmluZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVW5saWtlIFtOb2RlLnBhcmVudE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpLCB0aGlzXG4gKiAgICAgd2lsbCBhbHNvIHNlYXJjaCBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzLlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogKipTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBvbmx5IHdvcmtzIGZvciBNeXRoaXggVUkgY29tcG9uZW50cyEqKlxuICogICAtIHxcbiAqICAgICA6aW5mbzogU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgaXMgYWNjb21wbGlzaGVkIHZpYSBsZXZlcmFnaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE7IG9uXG4gKiAgICAgYGVsZW1lbnRgLiBXaGVuIGEgYG51bGxgIHBhcmVudCBpcyBlbmNvdW50ZXJlZCwgYGdldFBhcmVudE5vZGVgIHdpbGwgbG9vayBmb3IgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgQHNlZSBDb25zdGFudHMuTVlUSElYX1NIQURPV19QQVJFTlQ7XG4gKiAgICAgb24gYGVsZW1lbnRgLiBJZiBmb3VuZCwgdGhlIHJlc3VsdCBpcyBjb25zaWRlcmVkIHRoZSBbcGFyZW50IE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpIG9mIGBlbGVtZW50YC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgTm9kZTsgVGhlIHBhcmVudCBub2RlLCBpZiB0aGVyZSBpcyBhbnksIG9yIGBudWxsYCBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmIChlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQucGFyZW50Tm9kZSwgTVlUSElYX1NIQURPV19QQVJFTlQpIHx8IG51bGw7XG5cbiAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiBtZXRhZGF0YShlbGVtZW50LCBNWVRISVhfU0hBRE9XX1BBUkVOVCkgfHwgbnVsbDtcblxuICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ3JlYXRlIGEgUHJveHkgdGhhdCBpcyBlc3NlbnRpYWxseSAoZnVuY3Rpb25hbGx5KSBhIG11bHRpLXByb3RvdHlwZSBgb2JqZWN0YCBpbnN0YW5jZS5cbiAqXG4gKiAgIEEgXCJzY29wZVwiIGluIE15dGhpeCBVSSBtaWdodCBiZSBiZXR0ZXIgY2FsbGVkIGEgXCJjb250ZXh0XCIuLi4gaG93ZXZlciwgXCJzY29wZVwiXG4gKiAgIHdhcyBjaG9zZW4gYmVjYXVzZSBpdCAqaXMqIGEgc2NvcGUuLi4gb3IgbWlnaHQgYmUgYmV0dGVyIGRlc2NyaWJlZCBhcyBcIm11bHRpcGxlIHNjb3BlcyBpbiBvbmVcIi5cbiAqICAgVGhpcyBpcyBzcGVjaWZpY2FsbHkgYSBcIkRPTSBzY29wZVwiLCBpbiB0aGF0IHRoaXMgbWV0aG9kIGlzIFwiRE9NIGF3YXJlXCIgYW5kIHdpbGwgdHJhdmVyc2UgdGhlXG4gKiAgIERPTSBsb29raW5nIGZvciB0aGUgcmVxdWVzdGVkIGRhdGEgKGlmIGFueSBvZiB0aGUgc3BlY2lmaWVkIGB0YXJnZXRzYCBpcyBhbiBFbGVtZW50IHRoYXQgaXMpLlxuICpcbiAqICAgVGhlIHdheSB0aGlzIHdvcmtzIGlzIHRoYXQgdGhlIGNhbGxlciB3aWxsIHByb3ZpZGUgYXQgbGVhc3Qgb25lIFwidGFyZ2V0XCIuIFRoZXNlIHRhcmdldHMgYXJlXG4gKiAgIHRoZW1zZWx2ZXMgc2NvcGVzLCBlbGVtZW50cywgb3Igb3RoZXIgZGF0YSBvYmplY3RzLiBXaGVuIHRoZSByZXR1cm5lZCBQcm94eSBpbnN0YW5jZSBpcyBhY2Nlc3NlZCxcbiAqICAgdGhlIHJlcXVlc3RlZCBrZXkgaXMgc2VhcmNoZWQgaW4gYWxsIHByb3ZpZGVkIGB0YXJnZXRzYCwgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBwcm92aWRlZC5cbiAqXG4gKiAgIEFzaWRlIGZyb20gc2VhcmNoaW5nIGFsbCB0YXJnZXRzIGZvciB0aGUgZGVzaXJlZCBrZXksIGl0IHdpbGwgYWxzbyBmYWxsYmFjayB0byBvdGhlciBkYXRhIHNvdXJjZXNcbiAqICAgaXQgc2VhcmNoZXMgaW4gYXMgd2VsbDpcbiAqICAgMS4gSWYgYW55IGdpdmVuIGB0YXJnZXRgIGl0IGlzIHNlYXJjaGluZyBpcyBhbiBFbGVtZW50LCB0aGVuIGl0IHdpbGwgYWxzbyBzZWFyY2hcbiAqICAgICAgZm9yIHRoZSByZXF1ZXN0ZWQga2V5IG9uIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqICAgMi4gSWYgc3RlcCAjMSBoYXMgZmFpbGVkLCB0aGVuIG1vdmUgdG8gdGhlIHBhcmVudCBub2RlIG9mIHRoZSBjdXJyZW50IEVsZW1lbnQgaW5zdGFuY2UsIGFuZFxuICogICAgICByZXBlYXQgdGhlIHByb2Nlc3MsIHN0YXJ0aW5nIGZyb20gc3RlcCAjMS5cbiAqICAgMy4gQWZ0ZXIgc3RlcHMgMS0yIGFyZSByZXBlYXRlZCBmb3IgZXZlcnkgZ2l2ZW4gYHRhcmdldGAgKGFuZCBhbGwgcGFyZW50IG5vZGVzIG9mIHRob3NlIGB0YXJnZXRzYC4uLiBpZiBhbnkpLFxuICogICAgICB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgZmluYWxseSBmYWxsYmFjayB0byBzZWFyY2hpbmcgYGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVgIGZvciB0aGUgcmVxdWVzdGVkIGtleS5cbiAqXG4gKiAgIFdlIGFyZW4ndCBxdWl0ZSBmaW5pc2hlZCB5ZXQgdGhvdWdoLi4uXG4gKlxuICogICBJZiBzdGVwcyAxLTMgYWJvdmUgYWxsIGZhaWwsIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBzdGlsbCBmYWxsYmFjayB0byB0aGUgZmFsbG93aW5nIGhhcmQtY29kZWQga2V5L3ZhbHVlIHBhaXJzOlxuICogICAxLiBBIHJlcXVlc3RlZCBrZXkgb2YgYCdnbG9iYWxTY29wZSdgIChpZiBub3QgZm91bmQgb24gYSB0YXJnZXQpIHdpbGwgcmVzdWx0IGluIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlYCBiZWluZyByZXR1cm5lZC5cbiAqICAgMi4gQSByZXF1ZXN0ZWQga2V5IG9mIGAnaTE4bidgIChpZiBub3QgZm91bmQgb24gYSB0YXJnZXQpIHdpbGwgcmVzdWx0IGluIHRoZSBidWlsdC1pbiBgaTE4bmAgbGFuZ3VhZ2UgdGVybSBwcm9jZXNzb3IgYmVpbmcgcmV0dXJuZWQuXG4gKiAgIDMuIEEgcmVxdWVzdGVkIGtleSBvZiBgJ2R5bmFtaWNQcm9wSUQnYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiB0aGUgYnVpbHQtaW4gYGR5bmFtaWNQcm9wSURgIGR5bmFtaWMgcHJvcGVydHkgcHJvdmlkZWQuIFNlZSBAc2VlIFV0aWxzLmR5bmFtaWNQcm9wSUQ7LlxuICpcbiAqICAgRmluYWxseSwgdGhlIHJldHVybmVkIFByb3h5IHdpbGwgYWxzbyBpbnRlcmNlcHQgYW55IHZhbHVlIFtzZXRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb3h5L1Byb3h5L3NldCkgb3BlcmF0aW9uLFxuICogICB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgZmlyc3QgdGFyZ2V0IGZvdW5kLlxuICpcbiAqICAgVGhlIFByb3h5IGFsc28gb3ZlcmxvYWRzIFtvd25LZXlzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm94eS9Qcm94eS9vd25LZXlzKSB0byBsaXN0ICoqYWxsKioga2V5cyBhY3Jvc3MgKiphbGwqKiBgdGFyZ2V0c2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogLi4udGFyZ2V0c1xuICogICAgIGRhdGFUeXBlczpcbiAqICAgICAgIC0gT2JqZWN0XG4gKiAgICAgICAtIEVsZW1lbnRcbiAqICAgICAgIC0gbm9uLXByaW1pdGl2ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBgdGFyZ2V0c2AgdG8gYmUgc2VhcmNoZWQsIGluIHRoZSBvcmRlciBwcm92aWRlZC4gVGFyZ2V0cyBhcmUgc2VhcmNoZWQgYm90aCBmb3IgZ2V0IG9wZXJhdGlvbnMsIGFuZCBzZXQgb3BlcmF0aW9ucyAodGhlIGZpcnN0IHRhcmdldCBmb3VuZCB3aWxsIGJlIHRoZSBzZXQgdGFyZ2V0KS5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogTXl0aGl4IFVJIHdpbGwgZGVsaWJlcmF0ZWx5IG5ldmVyIGRpcmVjdGx5IGFjY2VzcyBgZ2xvYmFsVGhpc2AgZnJvbSB0aGUgdGVtcGxhdGUgZW5naW5lIChmb3Igc2VjdXJpdHkgcmVhc29ucykuXG4gKiAgICAgQmVjYXVzZSBvZiB0aGlzLCBNeXRoaXggVUkgYXV0b21hdGljYWxseSBwcm92aWRlcyBpdHMgb3duIGdsb2JhbCBzY29wZSBgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZWAuXG4gKiAgICAgSWYgeW91IHdhbnQgZGF0YSB0byBiZSBcImdsb2JhbGx5XCIgdmlzaWJsZSB0byBNeXRoaXggVUksIHRoZW4geW91IG5lZWQgdG8gYWRkIHlvdXIgZGF0YSB0byB0aGlzIHNwZWNpYWwgZ2xvYmFsIHNjb3BlLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBtZXRob2QgaXMgY29tcGxleCBiZWNhdXNlIGl0IGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gcHJvdmlkZSBhIFwic2NvcGVcIiB0byB0aGUgTXl0aGl4IFVJIHRlbXBsYXRpbmcgZW5naW5lLlxuICogICAgIFRoZSB0ZW1wbGF0aW5nIGVuZ2luZSBuZWVkcyB0byBiZSBET00gYXdhcmUsIGFuZCBhbHNvIG5lZWRzIHRvIGhhdmUgYWNjZXNzIHRvIHNwZWNpYWxpemVkLCBzY29wZWQgZGF0YVxuICogICAgIChpLmUuIHRoZSBgbXl0aGl4LXVpLWZvci1lYWNoYCBjb21wb25lbnQgd2lsbCBwdWJsaXNoIHNjb3BlZCBkYXRhIGZvciBlYWNoIGl0ZXJhdGlvbiwgd2hpY2ggbmVlZHMgdG8gYmUgYm90aFxuICogICAgIERPTS1hd2FyZSwgYW5kIGl0ZXJhdGlvbi1hd2FyZSkuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBBbnkgcHJvdmlkZWQgYHRhcmdldGAgY2FuIGFsc28gYmUgb25lIG9mIHRoZXNlIFByb3h5IHNjb3BlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEl0IGNhbiBoZWxwIHRvIHRoaW5rIG9mIHRoZSByZXR1cm5lZCBcInNjb3BlXCIgYXMgYW4gcGxhaW4gT2JqZWN0IHRoYXQgaGFzIGFuIGFycmF5IG9mIHByb3RvdHlwZXMuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIFByb3h5OyBBIHByb3h5IGluc3RhbmNlLCB0aGF0IGlzIHVzZWQgdG8gZ2V0IGFuZCBzZXQga2V5cyBhY3Jvc3MgbXVsdGlwbGUgYHRhcmdldHNgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2NvcGUoLi4uX3RhcmdldHMpIHtcbiAgY29uc3QgZmluZFByb3BOYW1lU2NvcGUgPSAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmICh0YXJnZXQgPT0gbnVsbCB8fCBPYmplY3QuaXModGFyZ2V0LCBOYU4pKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgIHJldHVybiB0YXJnZXQ7XG5cbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHNlYXJjaFBhcmVudE5vZGVzRm9yS2V5ID0gKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBpZiAoIWN1cnJlbnRFbGVtZW50KVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIGN1cnJlbnRFbGVtZW50KVxuICAgICAgICAgIHJldHVybiBjdXJyZW50RWxlbWVudDtcblxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2VhcmNoUGFyZW50Tm9kZXNGb3JLZXkodGFyZ2V0KTtcbiAgfTtcblxuICBsZXQgdGFyZ2V0cyAgICAgICAgID0gX3RhcmdldHMuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZmlyc3RFbGVtZW50ICAgID0gdGFyZ2V0cy5maW5kKCh0YXJnZXQpID0+ICh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSkgfHwgdGFyZ2V0c1swXTtcbiAgbGV0IGJhc2VDb250ZXh0ICAgICA9IHt9O1xuICBsZXQgZmFsbGJhY2tDb250ZXh0ID0ge1xuICAgIGdsb2JhbFNjb3BlOiAgKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSksXG4gICAgaTE4bjogICAgICAgICAocGF0aCwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gICAgICBsZXQgbGFuZ3VhZ2VQcm92aWRlciA9IHNwZWNpYWxDbG9zZXN0KGZpcnN0RWxlbWVudCwgJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgICByZXR1cm4gbGFuZ3VhZ2VQcm92aWRlci5pMThuKHBhdGgsIGRlZmF1bHRWYWx1ZSk7XG4gICAgfSxcbiAgICBkeW5hbWljUHJvcElELFxuICB9O1xuXG4gIHRhcmdldHMgPSB0YXJnZXRzLmNvbmNhdChmYWxsYmFja0NvbnRleHQpO1xuICBsZXQgcHJveHkgICA9IG5ldyBQcm94eShiYXNlQ29udGV4dCwge1xuICAgIG93bktleXM6ICgpID0+IHtcbiAgICAgIGxldCBhbGxLZXlzID0gW107XG5cbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoZ2V0QWxsUHJvcGVydHlOYW1lcyh0YXJnZXQpKTtcblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoZ2xvYmFsU2NvcGUpXG4gICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChPYmplY3Qua2V5cyhnbG9iYWxTY29wZSkpO1xuXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFsbEtleXMpKTtcbiAgICB9LFxuICAgIGhhczogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiAocHJvcE5hbWUgaW4gZ2xvYmFsU2NvcGUpO1xuICAgIH0sXG4gICAgZ2V0OiAoXywgcHJvcE5hbWUpID0+IHtcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBzY29wZVtwcm9wTmFtZV07XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICByZXR1cm4gZ2xvYmFsU2NvcGVbcHJvcE5hbWVdO1xuICAgIH0sXG4gICAgc2V0OiAoXywgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBkb1NldCA9IChzY29wZSwgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHNjb3BlW3Byb3BOYW1lXSwgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICBzY29wZVtwcm9wTmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gZG9TZXQoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gZG9TZXQoZ2xvYmFsU2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgZmFsbGJhY2tDb250ZXh0LiQkID0gcHJveHk7XG5cbiAgcmV0dXJuIHByb3h5O1xufVxuXG5jb25zdCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FID0gL14lP1tcXHcuJF0rJC87XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDcmVhdGUgYSBjb250ZXh0LWF3YXJlIGZ1bmN0aW9uLCBvciBcIm1hY3JvXCIsIHRoYXQgY2FuIGJlIGNhbGxlZCBhbmQgdXNlZCBieSB0aGUgdGVtcGxhdGUgZW5naW5lLlxuICpcbiAqICAgSWYgeW91IGFyZSBldmVyIHRyeWluZyB0byBwYXNzIG1ldGhvZHMgb3IgZHluYW1pYyBwcm9wZXJ0aWVzIGFjcm9zcyB0aGUgRE9NLCB0aGVuIHRoaXMgaXMgdGhlIG1ldGhvZCB5b3Ugd2FudCB0byB1c2UsIHRvXG4gKiAgIHByb3Blcmx5IFwicGFyc2VcIiBhbmQgdXNlIHRoZSBhdHRyaWJ1dGUgdmFsdWUgYXMgaW50ZW5kZWQuXG4gKlxuICogICBUaGlzIGlzIHVzZWQgZm9yIGV4YW1wbGUgZm9yIGV2ZW50IGJpbmRpbmdzIHZpYSBhdHRyaWJ1dGVzLiBJZiB5b3UgaGF2ZSBmb3IgZXhhbXBsZSBhbiBgb25jbGljaz1cImRvU29tZXRoaW5nXCJgXG4gKiAgIGF0dHJpYnV0ZSBvbiBhbiBlbGVtZW50LCB0aGVuIHRoaXMgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIGNvbnRleHQtYXdhcmUgXCJtYWNyb1wiIGZvciB0aGUgbWV0aG9kIFwiZG9Tb21ldGhpbmdcIi5cbiAqXG4gKiAgIFRoZSB0ZXJtIFwibWFjcm9cIiBpcyB1c2VkIGhlcmUgYmVjYXVzZSB0aGVyZSBhcmUgc3BlY2lhbCBmb3JtYXRzIFwidW5kZXJzdG9vZFwiIGJ5IHRoZSB0ZW1wbGF0ZSBlbmdpbmUuIEZvciBleGFtcGxlLFxuICogICBwcmVmaXhpbmcgYW4gYXR0cmlidXRlIHZhbHVlIHdpdGggYSBwZXJjZW50IHNpZ24sIGkuZS4gYG5hbWU9XCIlZ2xvYmFsRHluYW1pY1Byb3BOYW1lXCJgIHdpbGwgdXNlIEBzZWUgVXRpbHMuZHluYW1pY1Byb3BJRDtcbiAqICAgdG8gZ2xvYmFsbHkgZmV0Y2ggcHJvcGVydHkgb2YgdGhpcyBuYW1lLiBUaGlzIGlzIGltcG9ydGFudCwgYmVjYXVzZSBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgRE9NLCB5b3UgbWlnaHRcbiAqICAgYmUgcmVxdWVzdGluZyBhIGR5bmFtaWMgcHJvcGVydHkgdGhhdCBoYXNuJ3QgeWV0IGJlZW4gbG9hZGVkL2RlZmluZWQuIFRoaXMgaXMgdGhlIHB1cnBvc2Ugb2YgQHNlZSBVdGlscy5keW5hbWljUHJvcElEOyxcbiAqICAgYW5kIHRoaXMgc3BlY2lhbGl6ZWQgdGVtcGxhdGUgZm9ybWF0OiB0byBwcm92aWRlIGR5bmFtaWMgcHJvcHMgYnkgaWQsIHRoYXQgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiBuZWVkZWQuXG4gKlxuICogICBUaGUgdGVtcGxhdGUgZW5naW5lIGFsc28gd2lsbCBoYXBwaWx5IGFjY2VwdCByb2d1ZSBtZXRob2QgbmFtZXMuIEZvciBleGFtcGxlLCBpbiBhIE15dGhpeCBVSSBjb21wb25lbnQgeW91IGFyZSBidWlsZGluZyxcbiAqICAgeW91IG1pZ2h0IGhhdmUgYW4gZWxlbWVudCBsaWtlIGA8YnV0dG9uIG9uY2xpY2s9XCJvbkJ1dHRvbkNsaWNrXCI+Q2xpY2sgTWUhPGJ1dHRvbj5gLiBUaGUgdGVtcGxhdGluZyBlbmdpbmUgd2lsbCBkZXRlY3QgdGhhdFxuICogICB0aGlzIGlzIE9OTFkgYW4gaWRlbnRpZmllciwgYW5kIHNvIHdpbGwgc2VhcmNoIGZvciB0aGUgc3BlY2lmaWVkIG1ldGhvZCBpbiB0aGUgYXZhaWxhYmxlIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSxcbiAqICAgd2hpY2ggaW5jbHVkZXMgYHRoaXNgIGluc3RhbmNlIG9mIHlvdXIgY29tcG9uZW50IGFzIHRoZSBmaXJzdCBgdGFyZ2V0YC4gVGhpcyBwYXR0ZXJuIGlzIG5vdCByZXF1aXJlZCwgYXMgeW91IGNhbiBjYWxsIHlvdXJcbiAqICAgY29tcG9uZW50IG1ldGhvZCBkaXJlY3RseSB5b3Vyc2VsZiwgYXMgd2l0aCBhbnkgYXR0cmlidXRlIGV2ZW50IGJpbmRpbmcgaW4gdGhlIERPTSwgaS5lOiBgPGJ1dHRvbiBvbmNsaWNrPVwidGhpcy5vbkJ1dHRvbkNsaWNrKGV2ZW50KVwiPkNsaWNrIE1lITxidXR0b24+YC5cbiAqXG4gKiAgIE9uZSBsYXN0IHRoaW5nIHRvIG1lbnRpb24gaXMgdGhhdCB3aGVuIHRoZXNlIFwibWFjcm9cIiBtZXRob2RzIGFyZSBjYWxsZWQgYnkgTXl0aGl4IFVJLCBhbGwgZW51bWVyYWJsZSBrZXlzIG9mIHRoZSBnZW5lcmF0ZWRcbiAqICAgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspIGFyZSBwYXNzZWQgaW50byB0aGUgbWFjcm8gbWV0aG9kIGFzIGFyZ3VtZW50cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBrZXlzL3ZhbHVlcyBvZiBhbGwgc2NvcGUgYHRhcmdldHNgXG4gKiAgIGFyZSBhdmFpbGFibGUgZGlyZWN0bHkgaW4geW91ciBqYXZhc2NyaXB0IHNjb3BlLiBpLmUuIHlvdSBjYW4gZG8gdGhpbmdzIGxpa2UgYG5hbWU9XCJjb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXNBdHRyaWJ1dGUxLCBvdGhlckF0dHJpYnV0ZSlcImAgd2l0aG91dCBuZWVkaW5nIHRvIGRvXG4gKiAgIGBuYW1lPVwidGhpcy5jb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXMudGhpc0F0dHJpYnV0ZTEsIHRoaXMub3RoZXJBdHRyaWJ1dGUpXCJgLiA6d2FybmluZzogSXQgaXMgaW1wb3J0YW50IHRvIGtlZXAgaW4gbWluZCB0aGF0IGRpcmVjdCByZWZlcmVuY2UgYWNjZXNzIGxpa2UgdGhpcyBpbiBhIG1hY3JvXG4gKiAgIHdpbGwgYnlwYXNzIHRoZSBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykgUHJveHksIGFuZCBzbyBpZiB0aGUgc3BlY2lmaWVkIGtleSBpcyBub3QgZm91bmQgKHBhc3NlZCBpbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgbWFjcm8pLCB0aGVuIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duIGJ5IGphdmFzY3JpcHQuXG4gKlxuICogICBJdCBpcyBhYnNvbHV0ZWx5IHBvc3NpYmxlIGZvciB5b3UgdG8gcmVjZWl2ZSBhbmQgc2VuZCBhcmd1bWVudHMgdmlhIHRoZXNlIGdlbmVyYXRlZCBcIm1hY3Jvc1wiLiBgbXl0aGl4LXVpLXNlYXJjaGAgZG9lcyB0aGlzIGZvclxuICogICBleGFtcGxlIHdoZW4gYSBcImZpbHRlclwiIG1ldGhvZCBpcyBwYXNzZWQgdmlhIGFuIGF0dHJpYnV0ZS4gQnkgZGVmYXVsdCBubyBleHRyYSBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIHdoZW4gY2FsbGVkIGRpcmVjdGx5IGJ5IHRoZSB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIEFuIG9iamVjdCB3aXRoIHRoZSBzaGFwZSBgeyBib2R5OiBzdHJpbmc7IHByZWZpeD86IHN0cmluZzsgc2NvcGU6IG9iamVjdDsgfWAuXG4gKlxuICogICAgICAgMS4gYGJvZHlgIGlzIHRoZSBhY3R1YWwgYm9keSBvZiB0aGUgYG5ldyBGdW5jdGlvbmAuXG4gKiAgICAgICAyLiBgc2NvcGVgIGlzIHRoZSBzY29wZSAoYHRoaXNgKSB0aGF0IHlvdSB3YW50IHRvIGJpbmQgdG8gdGhlIHJlc3VsdGluZyBtZXRob2QuXG4gKiAgICAgICAgICBUaGlzIHdvdWxkIGdlbmVyYWxseSBiZSBhIHNjb3BlIGNyZWF0ZWQgYnkgQHNlZSBVdGlscy5jcmVhdGVTY29wZTtcbiAqICAgICAgIDMuIGBwcmVmaXhgIGFuIG9wdGlvbmFsIHByZWZpeCBmb3IgdGhlIGJvZHkgb2YgdGhlIGBuZXcgRnVuY3Rpb25gLiBUaGlzIHByZWZpeCBpcyBhZGRlZFxuICogICAgICAgICAgYmVmb3JlIGFueSBmdW5jdGlvbiBib2R5IGNvZGUgdGhhdCBNeXRoaXggVUkgZ2VuZXJhdGVzLlxuICogICAgICAgICAgU2VlIGhlcmUgQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDsgZm9yIGFuIGV4YW1wbGUgdXNlXG4gKiAgICAgICAgICBvZiBgcHJlZml4YCAobm90aWNlIGhvdyBgYXJndW1lbnRzWzFdYCBpcyB1c2VkIGluc3RlYWQgb2YgYGFyZ3VtZW50c1swXWAsIGFzIGBhcmd1bWVudHNbMF1gIGlzIGFsd2F5cyByZXNlcnZlZFxuICogICAgICAgICAgZm9yIGxvY2FsIHZhcmlhYmxlIG5hbWVzIFwiaW5qZWN0ZWRcIiBmcm9tIHRoZSBjcmVhdGVkIFwic2NvcGVcIikuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEFzaWRlIGZvciBzb21lIGJlaGluZC10aGUtc2NlbmUgbW9kaWZpY2F0aW9ucyBhbmQgZWFzZS1vZi11c2Ugc2xpY2tuZXNzLCB0aGlzIGVzc2VudGlhbGx5IGp1c3QgY3JlYXRlcyBhIGBuZXcgRnVuY3Rpb25gIGFuZCBiaW5kcyBhIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSB0byBpdC5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSBwcm92aWRlZCAoYW5kIG9wdGlvbmFsKSBgcHJlZml4YCBjYW4gYmUgdXNlZCBhcyB0aGUgc3RhcnQgb2YgdGhlIG1hY3JvIGBuZXcgRnVuY3Rpb25gIGJvZHkgY29kZS4gaS5lLiBAc2VlIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudDsgZG9lcyBleGFjdGx5IHRoaXMgdG8gYWxsb3cgZGlyZWN0IHNjb3BlZFxuICogICAgIGFjY2VzcyB0byB0aGUgYGV2ZW50YCBpbnN0YW5jZS4gQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDtcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSByZXR1cm4gbWV0aG9kIGlzIGJvdW5kIGJ5IGNhbGxpbmcgYC5iaW5kKHNjb3BlKWAuIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBtb2RpZnkgYHRoaXNgIGF0IHRoZSBjYWxsLXNpdGUuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGZ1bmN0aW9uOyBBIGZ1bmN0aW9uIHRoYXQgaXMgXCJjb250ZXh0IGF3YXJlXCIgYnkgYmVpbmcgYm91bmQgdG8gdGhlIHByb3ZpZGVkIGBzY29wZWAgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4LCBib2R5LCBzY29wZSB9KSB7XG4gIGxldCBmdW5jdGlvbkJvZHkgPSBib2R5O1xuICBpZiAoZnVuY3Rpb25Cb2R5LmNoYXJBdCgwKSA9PT0gJyUnIHx8IEVWRU5UX0FDVElPTl9KVVNUX05BTUUudGVzdChmdW5jdGlvbkJvZHkpKSB7XG4gICAgaWYgKGZ1bmN0aW9uQm9keS5jaGFyQXQoMCkgPT09ICclJykge1xuICAgICAgZnVuY3Rpb25Cb2R5ID0gYCh0aGlzLmR5bmFtaWNQcm9wSUQgfHwgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5keW5hbWljUHJvcElEKSgnJHtmdW5jdGlvbkJvZHkuc3Vic3RyaW5nKDEpLnRyaW0oKS5yZXBsYWNlKC8nL2csICdcXFxcXFwnJyl9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgX19fXyQgPSAke2Z1bmN0aW9uQm9keX07XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgX19fXyQgPT09ICdmdW5jdGlvbicpID8gX19fXyQuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKSA6IF9fX18kO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJHtmdW5jdGlvbkJvZHkucmVwbGFjZSgvXlxccyp0aGlzXFwuLywgJycpfS5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICB9KSgpO2A7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldENvbnRleHRDYWxsQXJncyhzY29wZSwgeyAnX19tYWNyb1NvdXJjZSc6IG51bGwsICdfX2V4cGFuZGVkTWFjcm9Tb3VyY2UnOiBudWxsIH0pO1xuXG4gIGZ1bmN0aW9uQm9keSA9IGB0cnkgeyAkeyhwcmVmaXgpID8gYCR7cHJlZml4fTtgIDogJyd9cmV0dXJuICR7KGZ1bmN0aW9uQm9keSB8fCAnKHZvaWQgMCknKS5yZXBsYWNlKC9eXFxzKnJldHVyblxccysvLCAnJykudHJpbSgpfTsgfSBjYXRjaCAoZXJyb3IpIHsgY29uc29sZS5lcnJvcihcXGBFcnJvciBpbiBtYWNybyBbXFwke19fbWFjcm9Tb3VyY2V9XTpcXGAsIGVycm9yLCBfX2V4cGFuZGVkTWFjcm9Tb3VyY2UpOyB0aHJvdyBlcnJvcjsgfWA7XG5cbiAgbGV0IGxvY2FsU2NvcGUgPSBPYmplY3QuY3JlYXRlKHNjb3BlKTtcbiAgbG9jYWxTY29wZS5fX21hY3JvU291cmNlID0gYm9keTtcbiAgbG9jYWxTY29wZS5fX2V4cGFuZGVkTWFjcm9Tb3VyY2UgPSBmdW5jdGlvbkJvZHk7XG5cbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKHNjb3BlIHx8IHt9LCBzY29wZSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBQYXJzZSBhIHRlbXBsYXRlLCBhbmQgcmV0dXJuIGl0cyBwYXJ0cy4gQSB0ZW1wbGF0ZSBcInBhcnRcIiBpcyBvbmUgb2YgdHdvIHR5cGVzOiBgJ2xpdGVyYWwnYCwgb3IgYCdtYWNybydgLlxuICpcbiAqICAgVGFrZSBmb3IgZXhhbXBsZSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOiBgJ0hlbGxvIFxcQEBncmVldGluZ0BAISEhJ2AuIFRoaXMgdGVtcGxhdGUgd291bGQgcmVzdWx0IGluIHRocmVlIFwicGFydHNcIiBhZnRlciBwYXJzaW5nOlxuICogICAxLiBgeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZTogJ0hlbGxvICcsIHN0YXJ0OiAwLCBlbmQ6IDYgfWBcbiAqICAgMi4gYHsgdHlwZTogJ21hY3JvJywgc291cmNlOiAnXFxAQGdyZWV0aW5nQEAnLCBtYWNybzogPGZ1bmN0aW9uPiwgc3RhcnQ6IDYsIGVuZDogMTggfWBcbiAqICAgMy4gYHsgdHlwZTogJ2xpdGVyYWwnLCBzb3VyY2U6ICchISEnLCBzdGFydDogMTgsIGVuZDogMjEgfWBcbiAqXG4gKiAgIENvbmNhdGVuYXRpbmcgYWxsIGBzb3VyY2VgIHByb3BlcnRpZXMgdG9nZXRoZXIgd2lsbCByZXN1bHQgaW4gdGhlIG9yaWdpbmFsIGlucHV0LlxuICogICBDb25jYXRlbmF0aW5nIGFsbCBgc291cmNlYCBwcm9wZXJ0aWVzLCBhbG9uZyB3aXRoIHRoZSByZXN1bHQgb2YgY2FsbGluZyBhbGwgYG1hY3JvYCBmdW5jdGlvbnMsIHdpbGwgcmVzdWx0IGluIHRoZSBvdXRwdXQgKGkuZS4gYHBhcnRbMF0uc291cmNlICsgcGFydFsxXS5tYWNybygpICsgcGFydFsyXS5zb3VyY2VgKS5cbiAqICAgVGhlIGBtYWNyb2AgcHJvcGVydHkgaXMgdGhlIGFjdHVhbCBtYWNybyBmdW5jdGlvbiBmb3IgdGhlIHBhcnNlZCB0ZW1wbGF0ZSBwYXJ0IChpLmUuIGluIG91ciBleGFtcGxlIGAnXFxAQGdyZWV0aW5nQEAnYCkuXG4gKiAgIGBzdGFydGAgYW5kIGBlbmRgIGFyZSB0aGUgb2Zmc2V0cyBmcm9tIHRoZSBvcmlnaW5hbCBgdGV4dGAgd2hlcmUgdGhlIHBhcnQgY2FuIGJlIGZvdW5kLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHRleHRcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHRlbXBsYXRlIHN0cmluZyB0byBwYXJzZS5cbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIE9wdGlvbnMgZm9yIHRoZSBvcGVyYXRpb24uIFRoZSBzaGFwZSBvZiB0aGlzIG9iamVjdCBpcyBgeyBwcmVmaXg/OiBzdHJpbmcsIHNjb3BlOiBvYmplY3QgfWAuXG4gKiAgICAgICBgc2NvcGVgIGRlZmluZXMgdGhlIHNjb3BlIGZvciBtYWNyb3MgY3JlYXRlZCBieSB0aGlzIG1ldGhvZCAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KS5cbiAqICAgICAgIGBwcmVmaXhgIGRlZmluZXMgYSBmdW5jdGlvbiBib2R5IHByZWZpeCB0byB1c2Ugd2hpbGUgY3JlYXRpbmcgbWFjcm9zIChzZWUgQHNlZSBVdGlscy5jcmVhdGVUZW1wbGF0ZU1hY3JvOykuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRvIHNraXAgcGFyc2luZyBhIHNwZWNpZmljIHRlbXBsYXRlIHBhcnQsIHByZWZpeCB3aXRoIGEgYmFja3NsYXNoLCBpLmUuIGBcXFxcXFxcXEBAZ3JlZXRpbmdAQGAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIEFycmF5PFRlbXBsYXRlUGFydD47ICoqVGVtcGxhdGVQYXJ0Kio6IGB7IHR5cGU6ICdsaXRlcmFsJyB8ICdtYWNybycsIHNvdXJjZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgbWFjcm8/OiBmdW5jdGlvbiB9YC4gUmV0dXJuIGFsbCBwYXJzZWQgcGFydHMgb2YgdGhlIHRlbXBsYXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBwYXJ0cyAgICAgICAgID0gW107XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcblxuICBjb25zdCBhZGRMaXRlcmFsID0gKHN0YXJ0T2Zmc2V0LCBlbmRPZmZzZXQpID0+IHtcbiAgICBsZXQgc291cmNlID0gdGV4dC5zdWJzdHJpbmcoc3RhcnRPZmZzZXQsIGVuZE9mZnNldCkucmVwbGFjZSgvXFxcXEBAL2csICdAQCcpO1xuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZSwgc3RhcnQ6IHN0YXJ0T2Zmc2V0LCBlbmQ6IGVuZE9mZnNldCB9KTtcbiAgfTtcblxuICB0ZXh0LnJlcGxhY2UoLyg/PCFcXFxcKShAQCkoLis/KVxcMS9nLCAobSwgXywgcGFyc2VkVGV4dCwgb2Zmc2V0KSA9PiB7XG4gICAgaWYgKGN1cnJlbnRPZmZzZXQgPCBvZmZzZXQpXG4gICAgICBhZGRMaXRlcmFsKGN1cnJlbnRPZmZzZXQsIG9mZnNldCk7XG5cbiAgICBjdXJyZW50T2Zmc2V0ID0gb2Zmc2V0ICsgbS5sZW5ndGg7XG5cbiAgICBsZXQgbWFjcm8gPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgLi4ub3B0aW9ucywgYm9keTogcGFyc2VkVGV4dCB9KTtcbiAgICBwYXJ0cy5wdXNoKHsgdHlwZTogJ21hY3JvJywgc291cmNlOiBtLCBtYWNybywgc3RhcnQ6IG9mZnNldCwgZW5kOiBjdXJyZW50T2Zmc2V0IH0pO1xuICB9KTtcblxuICBpZiAoY3VycmVudE9mZnNldCA8IHRleHQubGVuZ3RoKVxuICAgIGFkZExpdGVyYWwoY3VycmVudE9mZnNldCwgdGV4dC5sZW5ndGgpO1xuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuY29uc3QgTk9PUCA9IChpdGVtKSA9PiBpdGVtO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29tcGlsZSB0aGUgdGVtcGxhdGUgcGFydHMgdGhhdCB3ZXJlIHBhcnNlZCBieSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0czsuXG4gKlxuICogICBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHByb3ZpZGUgdGhpcyBtZXRob2QgYW4gYXJyYXkgb2YgQHNlZSBFbGVtZW50cy5FbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLFxuICogICBvciBAc2VlIFF1ZXJ5RW5naW5lLlF1ZXJ5RW5naW5lOyBpbnN0YW5jZXMgKHRoYXQgY29udGFpbiBAc2VlIEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMpLlxuICogICBJZiBlaXRoZXIgb2YgdGhlc2UgdHlwZXMgYXJlIGZvdW5kIGluIHRoZSBpbnB1dCBhcnJheSAoZXZlbiBvbmUpLCB0aGVuIHRoZSBlbnRpcmUgcmVzdWx0IGlzIHJldHVybmVkXG4gKiAgIGFzIGEgcmF3IGFycmF5LlxuICpcbiAqICAgT3IsIGlmIGFueSBvZiB0aGUgcmVzdWx0aW5nIHBhcnRzIGlzICoqbm90KiogYSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0cz9jYXB0aW9uPVRlbXBsYXRlUGFydDsgb3IgYSBgc3RyaW5nYCxcbiAqICAgdGhlbiByZXR1cm4gdGhlIHJlc3VsdGluZyB2YWx1ZSByYXcuXG4gKlxuICogICBPdGhlcndpc2UsIGlmIGFsbCByZXN1bHRpbmcgcGFydHMgYXJlIGEgYHN0cmluZ2AsIHRoZW4gdGhlIHJlc3VsdGluZyBwYXJ0cyBhcmUgam9pbmVkLCBhbmQgYSBgc3RyaW5nYCBpcyByZXR1cm5lZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBwYXJ0c1xuICogICAgIGRhdGFUeXBlczpcbiAqICAgICAgIC0gQXJyYXk8VGVtcGxhdGVQYXJ0PlxuICogICAgICAgLSBBcnJheTxFbGVtZW50RGVmaW5pdGlvbj5cbiAqICAgICAgIC0gQXJyYXk8UXVlcnlFbmdpbmU+XG4gKiAgICAgICAtIEFycmF5PGFueT5cbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgdGVtcGxhdGUgcGFydHMgdG8gY29tcGlsZSB0b2dldGhlci5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgQXJyYXk8YW55PjsgQHR5cGVzIHN0cmluZzsgUmV0dXJuIHRoZSByZXN1bHQgYXMgYSBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIHJhdyB2YWx1ZXMsIG9yIGEgcmF3IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHBhcnRzLCBjYWxsYmFjaykge1xuICBsZXQgcmVzdWx0ID0gcGFydHNcbiAgICAubWFwKChwYXJ0KSA9PiB7XG4gICAgICBpZiAoIXBhcnQpXG4gICAgICAgIHJldHVybiBwYXJ0O1xuXG4gICAgICBpZiAocGFydFtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFIHx8IHBhcnRbTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICAgICAgcmV0dXJuIHBhcnQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwYXJ0LnR5cGUgPT09ICdsaXRlcmFsJylcbiAgICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICAgIGVsc2UgaWYgKHBhcnQudHlwZSA9PT0gJ21hY3JvJylcbiAgICAgICAgICByZXR1cm4gcGFydC5tYWNybygpO1xuXG4gICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICB9XG4gICAgfSlcbiAgICAubWFwKGNhbGxiYWNrIHx8IE5PT1ApXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gKGl0ZW0gIT0gbnVsbCAmJiBpdGVtICE9PSAnJykpO1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gKGl0ZW1bTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSB8fCBpdGVtW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpKSlcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gQmFzZVV0aWxzLmlzVHlwZShpdGVtLCAnOjpTdHJpbmcnKSkpXG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcblxuICByZXR1cm4gKHJlc3VsdC5sZW5ndGggPCAyKSA/IHJlc3VsdFswXSA6IHJlc3VsdDtcbn1cblxuY29uc3QgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTID0gWyAzLCAyIF07IC8vIFRFWFRfTk9ERSwgQVRUUklCVVRFX05PREVcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdpdmVuIGEgTm9kZSwgdGFrZSB0aGUgYC5ub2RlVmFsdWVgIG9mIHRoYXQgbm9kZSwgYW5kIGlmIGl0IGlzIGEgdGVtcGxhdGUsXG4gKiAgIHBhcnNlIHRoYXQgdGVtcGxhdGUgdXNpbmcgQHNlZSBVdGlscy5wYXJzZVRlbXBsYXRlUGFydHM7LCBhbmQgdGhlblxuICogICBjb21waWxlIHRoYXQgdGVtcGxhdGUgdXNpbmcgQHNlZSBVdGlscy5jb21waWxlVGVtcGxhdGVGcm9tUGFydHM7LiBUaGVcbiAqICAgcmVzdWx0aW5nIHRlbXBsYXRlIHBhcnRzIGFyZSB0aGVuIHNjYW5uZWQuIElmIGFueSBvZiB0aGUgYG1hY3JvKClgIGNhbGxzXG4gKiAgIHJlc3VsdCBpbiBhIEBzZWUgRHluYW1pY1Byb3BlcnR5P2NhcHRpb249RHluYW1pY1Byb3BlcnR5OywgdGhlbiBzZXQgdXBcbiAqICAgbGlzdGVuZXJzIHZpYSBgYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgLi4uKWAgb24gZWFjaCB0byBsaXN0ZW4gZm9yXG4gKiAgIGNoYW5nZXMgdG8gZHluYW1pYyBwcm9wZXJ0aWVzLiBXaGVuIGEgbGlzdGVuZXIgdXBkYXRlcywgdGhlIHRlbXBsYXRlIHBhcnRzXG4gKiAgIGFyZSByZWNvbXBpbGVkLCBhbmQgdGhlIGAubm9kZVZhbHVlYCBpcyBzZXQgYWdhaW4gd2l0aCB0aGUgbmV3IHJlc3VsdC5cbiAqXG4gKiAgIEluIHNob3J0LCB0aGlzIG1ldGhvZCBmb3JtYXRzIHRoZSB2YWx1ZSBvZiBhIE5vZGUgaWYgdGhlIHZhbHVlIGlzIGEgdGVtcGxhdGUsXG4gKiAgIGFuZCBpbiBkb2luZyBzbyBiaW5kcyB0byBkeW5hbWljIHByb3BlcnRpZXMgZm9yIGZ1dHVyZSB1cGRhdGVzIHRvIHRoaXMgbm9kZS5cbiAqXG4gKiAgIElmIHRoZSBgLm5vZGVWYWx1ZWAgb2YgdGhlIE5vZGUgaXMgZGV0ZWN0ZWQgdG8gKipub3QqKiBiZSBhIHRlbXBsYXRlLCB0aGVuXG4gKiAgIHRoZSByZXN1bHQgaXMgYSBuby1vcGVyYXRpb24sIGFuZCB0aGUgcmF3IHZhbHVlIG9mIHRoZSBOb2RlIGlzIHNpbXBseSByZXR1cm5lZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBub2RlXG4gKiAgICAgZGF0YVR5cGU6IE5vZGVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgTm9kZSB3aG9zZSB2YWx1ZSBzaG91bGQgYmUgZm9ybWF0dGVkLiBUaGlzIG11c3QgYmUgYSBURVhUX05PREUgb3IgYSBBVFRSSUJVVEVfTk9ERS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgcmVzdWx0aW5nIG5vZGUgdmFsdWUuIElmIGEgdGVtcGxhdGUgd2FzIHN1Y2Nlc3NmdWxseSBjb21waWxlZCwgZHluYW1pYyBwcm9wZXJ0aWVzXG4gKiAgIGFyZSBhbHNvIGxpc3RlbmVkIHRvIGZvciBmdXR1cmUgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE5vZGVWYWx1ZShub2RlLCBfb3B0aW9ucykge1xuICBpZiAobm9kZS5wYXJlbnROb2RlICYmICgvXihzdHlsZXxzY3JpcHQpJC8pLnRlc3Qobm9kZS5wYXJlbnROb2RlLmxvY2FsTmFtZSkpXG4gICAgcmV0dXJuIG5vZGUubm9kZVZhbHVlO1xuXG4gIGlmICghbm9kZSB8fCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJmb3JtYXROb2RlVmFsdWVcIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB0ZXh0ICAgICAgICAgID0gbm9kZS5ub2RlVmFsdWU7XG4gIGxldCB0ZW1wbGF0ZVBhcnRzID0gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIG9wdGlvbnMpO1xuXG4gIC8vIHRlbXBsYXRlUGFydHMuZm9yRWFjaCgoeyB0eXBlLCBtYWNybyB9KSA9PiB7XG4gIC8vICAgaWYgKHR5cGUgIT09ICdtYWNybycpXG4gIC8vICAgICByZXR1cm47XG5cbiAgLy8gICBsZXQgcmVzdWx0ID0gbWFjcm8oKTtcbiAgLy8gICBpZiAob3B0aW9ucy5iaW5kVG9EeW5hbWljUHJvcGVydGllcyAhPT0gZmFsc2UgJiYgaXNUeXBlKHJlc3VsdCwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAvLyAgICAgcmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsICgpID0+IHtcbiAgLy8gICAgICAgbGV0IHJlc3VsdCA9ICgnJyArIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKSk7XG4gIC8vICAgICAgIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKVxuICAvLyAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcmVzdWx0O1xuICAvLyAgICAgfSwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAvLyAgIH1cbiAgLy8gfSk7XG5cbiAgbGV0IHJlc3VsdCA9IGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzLCAocmVzdWx0KSA9PiB7XG4gICAgaWYgKHJlc3VsdCAmJiBvcHRpb25zLmJpbmRUb0R5bmFtaWNQcm9wZXJ0aWVzICE9PSBmYWxzZSAmJiBCYXNlVXRpbHMuaXNUeXBlKHJlc3VsdCwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAgICAgcmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICgnJyArIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKSk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKVxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcmVzdWx0O1xuICAgICAgfSwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICByZXN1bHQgPSAnJztcblxuICByZXR1cm4gKG9wdGlvbnMuZGlzYWxsb3dIVE1MID09PSB0cnVlKSA/ICgnJyArIHJlc3VsdCkgOiByZXN1bHQ7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gLyg/PCFcXFxcKUBALztcbmV4cG9ydCBmdW5jdGlvbiBpc1RlbXBsYXRlKHZhbHVlKSB7XG4gIGlmICghQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBJU19URU1QTEFURS50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9ICghZWxlbWVudC50YWdOYW1lKSA/IGVsZW1lbnQgOiBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgbGV0IGNhY2hlICAgPSBFVkVOVF9OQU1FX0NBQ0hFLmdldCh0YWdOYW1lKTtcbiAgaWYgKGNhY2hlKVxuICAgIHJldHVybiBjYWNoZTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEUuc2V0KHRhZ05hbWUsIGV2ZW50TmFtZXMpO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoX2NhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrICA9IF9jYWxsYmFjay5jYWxsYmFjaztcbiAgICBvcHRpb25zICAgPSBfY2FsbGJhY2sub3B0aW9ucyB8fCB7fTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfVxuXG4gIGlmIChCYXNlVXRpbHMuaXNUeXBlKGNhbGxiYWNrLCAnOjpTdHJpbmcnKSlcbiAgICBjYWxsYmFjayA9IGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyBwcmVmaXg6ICdsZXQgZXZlbnQ9YXJndW1lbnRzWzFdJywgYm9keTogY2FsbGJhY2ssIHNjb3BlOiB0aGlzIH0pOyAvLyBAcmVmOl9jcmVhdGVUZW1wbGF0ZU1hY3JvUHJlZml4Rm9yQmluZEV2ZW50VG9FbGVtZW50XG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7IGNhbGxiYWNrLCBvcHRpb25zIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFBhdGgob2JqLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAob2JqID09IG51bGwgfHwgT2JqZWN0LmlzKG9iaiwgTmFOKSB8fCBPYmplY3QuaXMob2JqLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKG9iaiwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGlmIChrZXkgPT0gbnVsbCB8fCBPYmplY3QuaXMoa2V5LCBOYU4pIHx8IE9iamVjdC5pcyhrZXksIEluZmluaXR5KSB8fCBPYmplY3QuaXMoa2V5LCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgbGV0IHBhcnRzICAgICAgICAgPSBrZXkuc3BsaXQoLyg/PCFcXFxcKVxcLi9nKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBjdXJyZW50VmFsdWUgID0gb2JqO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xuICAgIGxldCBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWVbcGFydF07XG4gICAgaWYgKG5leHRWYWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGN1cnJlbnRWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChnbG9iYWxUaGlzLk5vZGUgJiYgY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSBpbnN0YW5jZW9mIGdsb2JhbFRoaXMuTm9kZSAmJiAoY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpKVxuICAgIHJldHVybiBjdXJyZW50VmFsdWUubm9kZVZhbHVlO1xuXG4gIHJldHVybiAoY3VycmVudFZhbHVlID09IG51bGwpID8gZGVmYXVsdFZhbHVlIDogY3VycmVudFZhbHVlO1xufVxuXG5jb25zdCBDQUNIRURfUFJPUEVSVFlfTkFNRVMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgU0tJUF9QUk9UT1RZUEVTICAgICAgID0gW1xuICBnbG9iYWxUaGlzLkhUTUxFbGVtZW50LFxuICBnbG9iYWxUaGlzLk5vZGUsXG4gIGdsb2JhbFRoaXMuRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5PYmplY3QsXG4gIGdsb2JhbFRoaXMuQXJyYXksXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvcGVydHlOYW1lcyhfb2JqKSB7XG4gIGlmICghQmFzZVV0aWxzLmlzQ29sbGVjdGFibGUoX29iaikpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGxldCBjYWNoZWROYW1lcyA9IENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5nZXQoX29iaik7XG4gIGlmIChjYWNoZWROYW1lcylcbiAgICByZXR1cm4gY2FjaGVkTmFtZXM7XG5cbiAgbGV0IG9iaiAgID0gX29iajtcbiAgbGV0IG5hbWVzID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChvYmopIHtcbiAgICBsZXQgb2JqTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG9iak5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgICBuYW1lcy5hZGQob2JqTmFtZXNbaV0pO1xuXG4gICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKG9iaiAmJiBTS0lQX1BST1RPVFlQRVMuaW5kZXhPZihvYmouY29uc3RydWN0b3IpID49IDApXG4gICAgICBicmVhaztcbiAgfVxuXG4gIGxldCBmaW5hbE5hbWVzID0gQXJyYXkuZnJvbShuYW1lcyk7XG4gIENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5zZXQoX29iaiwgZmluYWxOYW1lcyk7XG5cbiAgcmV0dXJuIGZpbmFsTmFtZXM7XG59XG5cbmNvbnN0IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRSA9IG5ldyBXZWFrTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aChrZXlQYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgbGV0IGluc3RhbmNlQ2FjaGUgPSBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuZ2V0KHRoaXMpO1xuICBpZiAoIWluc3RhbmNlQ2FjaGUpIHtcbiAgICBpbnN0YW5jZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgIExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5zZXQodGhpcywgaW5zdGFuY2VDYWNoZSk7XG4gIH1cblxuICBsZXQgcHJvcGVydHkgPSBpbnN0YW5jZUNhY2hlLmdldChrZXlQYXRoKTtcbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIHByb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuICAgIGluc3RhbmNlQ2FjaGUuc2V0KGtleVBhdGgsIHByb3BlcnR5KTtcbiAgfVxuXG4gIHJldHVybiBwcm9wZXJ0eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwZWNpYWxDbG9zZXN0KG5vZGUsIHNlbGVjdG9yKSB7XG4gIGlmICghbm9kZSB8fCAhc2VsZWN0b3IpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gIHdoaWxlIChjdXJyZW50Tm9kZSAmJiAodHlwZW9mIGN1cnJlbnROb2RlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicgfHwgIWN1cnJlbnROb2RlLm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoY3VycmVudE5vZGUpO1xuXG4gIHJldHVybiBjdXJyZW50Tm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMgfHwgMCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lRHluYW1pY1Byb3AobmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIpIHtcbiAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoZGVmYXVsdFZhbHVlKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgW25hbWVdOiB7XG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6ICAgICAgICAgICgpID0+IGR5bmFtaWNQcm9wZXJ0eSxcbiAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShzZXR0ZXIobmV3VmFsdWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBkeW5hbWljUHJvcGVydHk7XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUF9SRUdJU1RSWSA9IG5ldyBNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljUHJvcElEKGlkLCBzZXRWYWx1ZSkge1xuICBsZXQgcHJvcCA9IERZTkFNSUNfUFJPUF9SRUdJU1RSWS5nZXQoaWQpO1xuICBpZiAocHJvcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcbiAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0oc2V0VmFsdWUpO1xuXG4gICAgcmV0dXJuIHByb3A7XG4gIH1cblxuICBwcm9wID0gbmV3IER5bmFtaWNQcm9wZXJ0eSgoYXJndW1lbnRzLmxlbmd0aCA+IDEpID8gc2V0VmFsdWUgOiAnJyk7XG4gIERZTkFNSUNfUFJPUF9SRUdJU1RSWS5zZXQoaWQsIHByb3ApO1xuXG4gIHJldHVybiBwcm9wO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmVOYW1lVmFsdWVQYWlySGVscGVyKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgbWV0YWRhdGEoXG4gICAgdGFyZ2V0LFxuICAgIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLFxuICAgIFsgbmFtZSwgdmFsdWUgXSxcbiAgKTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTID0gbmV3IFNldChbICdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0nLCAnbXl0aGl4LWZvci1lYWNoJyBdKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUykuam9pbignLCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcihzZWxlY3Rvcikge1xuICBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTLmFkZChzZWxlY3Rvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5kZWxldGUoc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBnbG9iYWxTdG9yZUhlbHBlcihkeW5hbWljLCBhcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm47XG5cbiAgY29uc3Qgc2V0T25HbG9iYWwgPSAobmFtZSwgdmFsdWUpID0+IHtcbiAgICBsZXQgY3VycmVudFZhbHVlID0gZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXTtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShjdXJyZW50VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gdmFsdWUsXG4gICAgICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHZhbHVlW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgIGxldCBwcm9wID0gZHluYW1pY1Byb3BJRChuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUsIHtcbiAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHByb3AsXG4gICAgICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG5cbiAgICAgIHJldHVybiBwcm9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBuYW1lVmFsdWVQYWlyID0gKEJhc2VVdGlscy5pc0NvbGxlY3RhYmxlKGFyZ3NbMF0pKSA/IG1ldGFkYXRhKFxuICAgIGFyZ3NbMF0sICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGV4dFxuICAgIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLCAgLy8gc3BlY2lhbCBrZXlcbiAgKSA6IG51bGw7IC8vIEByZWY6X215dGhpeE5hbWVWYWx1ZVBhaXJIZWxwZXJVc2FnZVxuXG4gIGlmIChuYW1lVmFsdWVQYWlyKSB7XG4gICAgbGV0IFsgbmFtZSwgdmFsdWUgXSA9IG5hbWVWYWx1ZVBhaXI7XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiBCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbMF0sICc6OlN0cmluZycpKSB7XG4gICAgbGV0IG5hbWUgID0gYXJnc1swXTtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzFdO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzBdO1xuICAgIGxldCBuYW1lICA9ICh0eXBlb2YgdGhpcy5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSA/IHRoaXMuZ2V0SWRlbnRpZmllcigpIDogKHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIGlmICghbmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJteXRoaXhVSS5nbG9iYWxTdG9yZVwiOiBcIm5hbWVcIiBpcyB1bmtub3duLCBzbyB1bmFibGUgdG8gc3RvcmUgdmFsdWUnKTtcblxuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmUoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCBmYWxzZSwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZUR5bmFtaWMoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCB0cnVlLCBhcmdzKTtcbn1cblxuY2xhc3MgU3RvcmFnZUl0ZW0ge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHRoaXMuX2MgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3YgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92O1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl91ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl92ID0gdmFsdWU7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICR0eXBlOiAgJ1N0b3JhZ2VJdGVtJyxcbiAgICAgIF9jOiAgICAgdGhpcy5fYyxcbiAgICAgIF91OiAgICAgdGhpcy5fdSxcbiAgICAgIF92OiAgICAgdGhpcy5fdixcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIFN0b3JhZ2Uge1xuICBfcmV2aXZlKGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUoZGF0YSkpXG4gICAgICByZXR1cm4gZGF0YTtcblxuICAgIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBfYWxyZWFkeVZpc2l0ZWQgfHwgbmV3IFNldCgpO1xuICAgIGxldCB0eXBlICAgICAgICAgICAgPSAoZGF0YSAmJiBkYXRhLiR0eXBlKTtcblxuICAgIGlmICh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ1N0b3JhZ2VJdGVtJykge1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLl92O1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBTdG9yYWdlSXRlbSgpLCB7XG4gICAgICAgICAgX2M6IGRhdGEuX2MsXG4gICAgICAgICAgX3U6IGRhdGEuX3UsXG4gICAgICAgICAgX3Y6ICh2YWx1ZSAmJiAhQmFzZVV0aWxzLmlzUHJpbWl0aXZlKHZhbHVlKSkgPyB0aGlzLl9yZXZpdmUodmFsdWUsIGFscmVhZHlWaXNpdGVkKSA6IHZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgaWYgKCF2YWx1ZSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgZGF0YVtrZXldID0gdGhpcy5fcmV2aXZlKHZhbHVlLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfcmF3KGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUoZGF0YSkpXG4gICAgICByZXR1cm4gZGF0YTtcblxuICAgIGxldCBhbHJlYWR5VmlzaXRlZCA9IF9hbHJlYWR5VmlzaXRlZCB8fCBuZXcgU2V0KCk7XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBTdG9yYWdlSXRlbSlcbiAgICAgIHJldHVybiB0aGlzLl9yYXcoZGF0YS5nZXRWYWx1ZSgpLCBhbHJlYWR5VmlzaXRlZCk7XG5cbiAgICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgaWYgKCF2YWx1ZSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgZGF0YVtrZXldID0gdGhpcy5fcmF3KHZhbHVlLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfZ2V0UGFydHNGb3JPcGVyYXRpb24odHlwZSwgcGFydHMpIHtcbiAgICBsZXQgcGF0aFBhcnRzICAgPSAodHlwZSA9PT0gJ3NldCcpID8gcGFydHMuc2xpY2UoMCwgLTEpIDogcGFydHMuc2xpY2UoKTtcbiAgICBsZXQgcGF0aCAgICAgICAgPSBwYXRoUGFydHMubWFwKChwYXJ0KSA9PiAoKHR5cGVvZiBwYXJ0ID09PSAnc3ltYm9sJykgPyBwYXJ0LnRvU3RyaW5nKCkgOiAoJycgKyBwYXJ0KSkucmVwbGFjZSgvXFwuL2csICdcXFxcLicpKS5qb2luKCcuJyk7XG4gICAgbGV0IHBhcnNlZFBhcnRzID0gcGF0aC5zcGxpdCgvKD88IVxcXFwpXFwuL2cpO1xuICAgIGxldCBzdG9yYWdlVHlwZSA9IHBhcnNlZFBhcnRzWzBdO1xuICAgIGxldCBkYXRhICAgICAgICA9ICh0eXBlID09PSAnc2V0JykgPyBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIC8vIGxvY2FsU3RvcmFnZSwgb3Igc2Vzc2lvblN0b3JhZ2VcbiAgICBsZXQgc3RvcmFnZUVuZ2luZSA9IGdsb2JhbFRoaXNbc3RvcmFnZVR5cGVdO1xuICAgIGlmICghc3RvcmFnZUVuZ2luZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCByb290RGF0YSAgICA9IHt9O1xuICAgIGxldCBlbmNvZGVkQmFzZSA9IHN0b3JhZ2VFbmdpbmUuZ2V0SXRlbSgnbXl0aGl4LXVpJyk7XG4gICAgaWYgKGVuY29kZWRCYXNlKVxuICAgICAgcm9vdERhdGEgPSB0aGlzLl9yZXZpdmUoSlNPTi5wYXJzZShlbmNvZGVkQmFzZSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhQYXJ0cyxcbiAgICAgIHBhdGgsXG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHN0b3JhZ2VUeXBlLFxuICAgICAgZGF0YSxcbiAgICAgIHN0b3JhZ2VFbmdpbmUsXG4gICAgICBlbmNvZGVkQmFzZSxcbiAgICAgIHJvb3REYXRhLFxuICAgIH07XG4gIH1cblxuICBfZ2V0TWV0YSh0eXBlLCBwYXJ0cykge1xuICAgIGxldCBvcGVyYXRpb24gPSB0aGlzLl9nZXRQYXJ0c0Zvck9wZXJhdGlvbih0eXBlLCBwYXJ0cyk7XG4gICAgbGV0IHtcbiAgICAgIHBhcnNlZFBhcnRzLFxuICAgICAgcm9vdERhdGEsXG4gICAgfSA9IG9wZXJhdGlvbjtcblxuICAgIGxldCBzY29wZSAgICAgICAgPSByb290RGF0YTtcbiAgICBsZXQgcGFyZW50U2NvcGUgID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAxLCBpbCA9IHBhcnNlZFBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGlmIChzY29wZSBpbnN0YW5jZW9mIFN0b3JhZ2VJdGVtKSB7XG4gICAgICAgIHNjb3BlID0gc2NvcGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IHBhcnQgPSBwYXJzZWRQYXJ0c1tpXTtcbiAgICAgIGxldCBzdWJTY29wZSA9IChzY29wZSkgPyBzY29wZVtwYXJ0XSA6IHNjb3BlO1xuICAgICAgaWYgKHR5cGUgPT09ICdzZXQnICYmICFzdWJTY29wZSlcbiAgICAgICAgc3ViU2NvcGUgPSBzY29wZVtwYXJ0XSA9IHt9O1xuXG4gICAgICBpZiAoc3ViU2NvcGUgPT0gbnVsbCB8fCBPYmplY3QuaXMoc3ViU2NvcGUsIE5hTikgfHwgT2JqZWN0LmlzKHN1YlNjb3BlLCAtSW5maW5pdHkpIHx8IE9iamVjdC5pcyhzdWJTY29wZSwgSW5maW5pdHkpKVxuICAgICAgICBicmVhaztcblxuICAgICAgcGFyZW50U2NvcGUgPSBzY29wZTtcbiAgICAgIHNjb3BlID0gc3ViU2NvcGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZXJhdGlvbixcbiAgICAgIHBhcmVudFNjb3BlLFxuICAgICAgc2NvcGUsXG4gICAgfTtcbiAgfVxuXG4gIGdldE1ldGEoLi4ucGFydHMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0TWV0YSgnZ2V0JywgcGFydHMpO1xuICB9XG5cbiAgZ2V0KC4uLnBhcnRzKSB7XG4gICAgbGV0IHsgc2NvcGUgfSA9IHRoaXMuX2dldE1ldGEoJ2dldCcsIHBhcnRzKTtcbiAgICByZXR1cm4gdGhpcy5fcmF3KHNjb3BlKTtcbiAgfVxuXG4gIHNldCguLi5wYXJ0cykge1xuICAgIGxldCB7XG4gICAgICBvcGVyYXRpb24sXG4gICAgICBwYXJlbnRTY29wZSxcbiAgICAgIHNjb3BlLFxuICAgIH0gPSB0aGlzLl9nZXRNZXRhKCdzZXQnLCBwYXJ0cyk7XG5cbiAgICBsZXQge1xuICAgICAgZGF0YSxcbiAgICAgIHBhcnNlZFBhcnRzLFxuICAgICAgcGF0aCxcbiAgICAgIHJvb3REYXRhLFxuICAgICAgc3RvcmFnZUVuZ2luZSxcbiAgICB9ID0gb3BlcmF0aW9uO1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRGVsZXRlXG4gICAgICBpZiAocGFyZW50U2NvcGUpXG4gICAgICAgIGRlbGV0ZSBwYXJlbnRTY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV07XG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZSBzY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXJlbnRTY29wZSlcbiAgICAgICAgcGFyZW50U2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dID0gbmV3IFN0b3JhZ2VJdGVtKGRhdGEpO1xuICAgICAgZWxzZVxuICAgICAgICBzY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV0gPSBuZXcgU3RvcmFnZUl0ZW0oZGF0YSk7XG4gICAgfVxuXG4gICAgc3RvcmFnZUVuZ2luZS5zZXRJdGVtKCdteXRoaXgtdWknLCBKU09OLnN0cmluZ2lmeShyb290RGF0YSkpO1xuXG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxufVxuXG5leHBvcnQgY29uc3Qgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS51cmwpXG4gIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUudXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbik7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuZXhwb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmV4cG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQgKiBhcyBDb21wb25lbnRVdGlscyBmcm9tICcuL2NvbXBvbmVudC11dGlscy5qcyc7XG5leHBvcnQgKiBhcyBDb21wb25lbnRVdGlscyBmcm9tICcuL2NvbXBvbmVudC11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuZXhwb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9teXRoaXgtdWktY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLWNvbXBvbmVudC5qcyc7XG5cbmltcG9ydCB7IE15dGhpeFVJUmVxdWlyZSB9IGZyb20gJy4vbXl0aGl4LXVpLXJlcXVpcmUuanMnO1xuXG5pbXBvcnQge1xuICBNeXRoaXhVSUxhbmd1YWdlUGFjayxcbiAgTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyLFxufSBmcm9tICcuL215dGhpeC11aS1sYW5ndWFnZS1wcm92aWRlci5qcyc7XG5cbmltcG9ydCB7IE15dGhpeFVJU3Bpbm5lciB9IGZyb20gJy4vbXl0aGl4LXVpLXNwaW5uZXIuanMnO1xuXG5pbXBvcnQgeyBNeXRoaXhVSUR5bmFtaWNTdHlsZSB9IGZyb20gJy4vbXl0aGl4LXVpLWR5bmFtaWMtc3R5bGUuanMnO1xuXG5leHBvcnQgY29uc3QgTXl0aGl4RWxlbWVudHMgPSB7XG4gIE15dGhpeFVJUmVxdWlyZSxcbiAgTXl0aGl4VUlMYW5ndWFnZVBhY2ssXG4gIE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlcixcbiAgTXl0aGl4VUlTcGlubmVyLFxuICBNeXRoaXhVSUR5bmFtaWNTdHlsZSxcbn07XG5cbmV4cG9ydCB7XG4gIER5bmFtaWNQcm9wZXJ0eSxcbn07XG5cbmxldCBfbXl0aGl4SXNSZWFkeSA9IGZhbHNlO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAnb25teXRoaXhyZWFkeSc6IHtcbiAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICAgICAgICAgICgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2V0OiAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgIGlmIChfbXl0aGl4SXNSZWFkeSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGNhbGxiYWNrKG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdteXRoaXgtcmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLkJhc2VVdGlscyA9IEJhc2VVdGlscztcbmdsb2JhbFRoaXMubXl0aGl4VUkuVXRpbHMgPSBVdGlscztcbmdsb2JhbFRoaXMubXl0aGl4VUkuQ29tcG9uZW50VXRpbHMgPSBDb21wb25lbnRVdGlscztcbmdsb2JhbFRoaXMubXl0aGl4VUkuRWxlbWVudHMgPSBFbGVtZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmUgPSBVdGlscy5nbG9iYWxTdG9yZTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmVEeW5hbWljID0gVXRpbHMuZ2xvYmFsU3RvcmVEeW5hbWljO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gVXRpbHMuZHluYW1pY1Byb3BJRChpZCk7XG59O1xuXG5jbGFzcyBNeXRoaXhDb25uZWN0ZWRFdmVudCBleHRlbmRzIEN1c3RvbUV2ZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ215dGhpeC1jb25uZWN0ZWQnKTtcbiAgfVxufVxuXG5jbGFzcyBNeXRoaXhEaXNjb25uZWN0ZWRFdmVudCBleHRlbmRzIEN1c3RvbUV2ZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ215dGhpeC1kaXNjb25uZWN0ZWQnKTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBsZXQgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IGZhbHNlO1xuXG4gIGNvbnN0IG9uRG9jdW1lbnRSZWFkeSA9ICgpID0+IHtcbiAgICBpZiAoIWRpZFZpc2liaWxpdHlPYnNlcnZlcnMpIHtcbiAgICAgIGxldCBlbGVtZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbXl0aGl4LXNyY10nKSk7XG4gICAgICBDb21wb25lbnRVdGlscy52aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgZGlzY29ubmVjdCwgZWxlbWVudCwgd2FzVmlzaWJsZSB9KSA9PiB7XG4gICAgICAgIGlmICh3YXNWaXNpYmxlKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBkaXNjb25uZWN0KCk7XG5cbiAgICAgICAgbGV0IHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1zcmMnKTtcbiAgICAgICAgaWYgKCFzcmMpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIENvbXBvbmVudFV0aWxzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgeyBlbGVtZW50cyB9KTtcblxuICAgICAgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IHRydWU7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcblxuICAgIGlmIChfbXl0aGl4SXNSZWFkeSlcbiAgICAgIHJldHVybjtcblxuICAgIF9teXRoaXhJc1JlYWR5ID0gdHJ1ZTtcblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAgICckJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciguLi5hcmdzKSxcbiAgICB9LFxuICAgICckJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoLi4uYXJncyksXG4gICAgfSxcbiAgfSk7XG5cbiAgbGV0IGRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiAgPSBtdXRhdGlvbnNbaV07XG4gICAgICBsZXQgdGFyZ2V0ICAgID0gbXV0YXRpb24udGFyZ2V0O1xuXG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0eXBlb2YgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IChhdHRyaWJ1dGVOb2RlKSA/IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlIDogbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5pc1RlbXBsYXRlKG5ld1ZhbHVlKSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZSh0YXJnZXQpLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG5cbiAgICAgICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcyA9IHRhcmdldC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMgJiYgb2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobXV0YXRpb24uYXR0cmlidXRlTmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwodGFyZ2V0LCBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGxldCBkaXNhYmxlVGVtcGxhdGluZyA9IChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5jbG9zZXN0ID09PSAnZnVuY3Rpb24nICYmIHRhcmdldC5jbG9zZXN0KCdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0sbXl0aGl4LWZvci1lYWNoJykpO1xuICAgICAgICBsZXQgYWRkZWROb2RlcyAgICAgICAgPSBtdXRhdGlvbi5hZGRlZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgamwgPSBhZGRlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IGFkZGVkTm9kZXNbal07XG4gICAgICAgICAgaWYgKG5vZGVbTXl0aGl4VUlDb21wb25lbnQuaXNNeXRoaXhDb21wb25lbnRdICYmIG5vZGUub25NdXRhdGlvbkFkZGVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCFkaXNhYmxlVGVtcGxhdGluZylcbiAgICAgICAgICAgIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlKTtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5kaXNwYXRjaEV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgY29ubmVjdGVkRXZlbnQgPSBuZXcgTXl0aGl4Q29ubmVjdGVkRXZlbnQoKTtcbiAgICAgICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjb25uZWN0ZWRFdmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRhcmdldFtNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbW92ZWROb2RlcyA9IG11dGF0aW9uLnJlbW92ZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IHJlbW92ZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudF0gJiYgbm9kZS5vbk11dGF0aW9uUmVtb3ZlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5kaXNwYXRjaEV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgZGlzY29ubmVjdGVkRXZlbnQgPSBuZXcgTXl0aGl4RGlzY29ubmVjdGVkRXZlbnQoKTtcbiAgICAgICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChkaXNjb25uZWN0ZWRFdmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRhcmdldFtNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkUmVtb3ZlZChub2RlLCBtdXRhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50TXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgc3VidHJlZTogICAgICAgICAgICB0cnVlLFxuICAgIGNoaWxkTGlzdDogICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiAgICAgICAgIHRydWUsXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6ICB0cnVlLFxuICB9KTtcblxuICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMoZG9jdW1lbnQuaGVhZCk7XG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5ib2R5KTtcblxuICBjb25zdCBET0NVTUVOVF9DSEVDS19SRUFEWV9USU1FID0gMjUwO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKVxuICAgICAgb25Eb2N1bWVudFJlYWR5KCk7XG4gICAgZWxzZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG4gIH0sIERPQ1VNRU5UX0NIRUNLX1JFQURZX1RJTUUpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Eb2N1bWVudFJlYWR5KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==