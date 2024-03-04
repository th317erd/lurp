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

/***/ "./lib/components.js":
/*!***************************!*\
  !*** ./lib/components.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   getIdentifier: () => (/* binding */ getIdentifier),
/* harmony export */   getLargestDocumentTabIndex: () => (/* binding */ getLargestDocumentTabIndex),
/* harmony export */   getVisibilityMeta: () => (/* binding */ getVisibilityMeta),
/* harmony export */   importIntoDocumentFromSource: () => (/* binding */ importIntoDocumentFromSource),
/* harmony export */   insertScriptIntoHead: () => (/* binding */ insertScriptIntoHead),
/* harmony export */   isMythixComponent: () => (/* binding */ isMythixComponent),
/* harmony export */   loadPartialIntoElement: () => (/* binding */ loadPartialIntoElement),
/* harmony export */   require: () => (/* binding */ require),
/* harmony export */   resolveURL: () => (/* binding */ resolveURL),
/* harmony export */   visibilityObserver: () => (/* binding */ visibilityObserver)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./lib/constants.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");







/**
 * type: Namespace
 * name: Components
 * groupName: Components
 * desc: |
 *   `import { Components } from 'mythix-ui-core@1.0';`
 *
 *   Component and framework classes and functionality are found here.
 * properties:
 *   - name: isMythixComponent
 *     dataType: symbol
 *     desc: |
 *       This symbol is used as an instance key for @see MythixUIComponent; instances.
 *
 *       For such instances, accessing this property simply returns `true`, allowing the caller
 *       to know if a specific instance (Element) is a Mythix UI component.
 */

const isMythixComponent = Symbol.for('@mythix/mythix-ui/component/constants/is-mythix-component'); // @ref:Components.isMythixComponent

const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

/***
 * groupName: Components
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
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_UI_COMPONENT_TYPE);
    } catch (e) {
      return false;
    }
  }

  // static compileStyleForDocument = compileStyleForDocument;
  static register = function(_name, _Klass) {
    let name = _name || this.tagName || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toKebabCase(this.name);

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

      let { descriptor } = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getDescriptorFromPrototypeChain(proto, originalName);
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
    let attributeNames  = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getAllPropertyNames(proto)
      .filter((name) => IS_ATTR_METHOD_NAME.test(name))
      .map((originalName) => {
        let propertyName  = originalName.match(IS_ATTR_METHOD_NAME)[1];
        let attributeName = _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toKebabCase(propertyName);

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
   * groupName: Components
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
   * groupName: Components
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
   * groupName: Components
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
   * groupName: Components
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

  static isMythixComponent = isMythixComponent;

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

    _utils_js__WEBPACK_IMPORTED_MODULE_2__.bindMethods.call(this, this.constructor.prototype /*, [ HTMLElement.prototype ]*/);

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
        get:          () => _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(this.constructor, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_DOCUMENT_INITIALIZED),
        set:          (value) => {
          _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(this.constructor, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_DOCUMENT_INITIALIZED, !!value);
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
   * groupName: Components
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
   * groupName: Components
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
    let styleID       = `IDSTYLE${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(`${this.sensitiveTagName}:${content}:${media}`)}`;
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

    return _elements_js__WEBPACK_IMPORTED_MODULE_4__.processElements(node, options);
  }

  getChildrenAsFragment(noEmptyResult) {
    let hasContent    = false;
    let ownerDocument = this.ownerDocument || document;
    let template      = ownerDocument.createDocumentFragment();

    if (!this.childNodes.length)
      return (noEmptyResult) ? undefined : template;

    while (this.childNodes.length) {
      let node = this.childNodes[0];
      if (!(node.nodeType === Node.TEXT_NODE && _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNOE(node.nodeValue)))
        hasContent = true;

      template.appendChild(node);
    }

    if (noEmptyResult && !hasContent)
      return;

    return template;
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
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
    return _utils_js__WEBPACK_IMPORTED_MODULE_2__.getParentNode(this);
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
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
    _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(shadow, _constants_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT, this); // @ref:_shadowMetadataAssignment

    return shadow;
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
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
    return _elements_js__WEBPACK_IMPORTED_MODULE_4__.mergeChildren(target, ...others);
  }

  getComponentTemplate(nameOrID) {
    if (nameOrID instanceof Node)
      return nameOrID;

    if (!this.ownerDocument)
      return;

    if (nameOrID)
      return _elements_js__WEBPACK_IMPORTED_MODULE_4__.queryTemplate(this.ownerDocument || document, nameOrID);

    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  appendExternalToShadowDOM() {
    if (!this.shadow)
      return;

    let ownerDocument = (this.ownerDocument || document);
    let elements      = ownerDocument.head.querySelectorAll('[data-for]');

    for (let element of Array.from(elements)) {
      let selector = element.getAttribute('data-for');
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isNOE(selector))
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

    _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.nextTick(() => {
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

    let observer = visibilityObserver(({ wasVisible, disconnect }) => {
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

      let propertyName    = _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toCamelCase(attributeName);
      let magicName       = `attr$${propertyName}`;
      let { descriptor }  = _utils_js__WEBPACK_IMPORTED_MODULE_2__.getDescriptorFromPrototypeChain(this, magicName);
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
    return _utils_js__WEBPACK_IMPORTED_MODULE_2__.createScope(this);
  }

  select(...args) {
    let argIndex    = 0;
    let options     = (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(args[argIndex])) ? Object.assign(Object.create(null), args[argIndex++]) : {};
    let queryEngine = _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine.from.call(this, { root: this, ...options, invokeCallbacks: false }, ...args.slice(argIndex));
    let shadowNodes;

    options = queryEngine.getOptions();

    if (options.shadow !== false && options.selector && options.root === this) {
      shadowNodes = Array.from(
        _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine.from.call(
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
   * groupName: Components
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
    let result = [ callback.call(this, _elements_js__WEBPACK_IMPORTED_MODULE_4__.ElementGenerator, {}) ].flat(Infinity).map((item) => {
      if (item && item[_constants_js__WEBPACK_IMPORTED_MODULE_0__.UNFINISHED_DEFINITION])
        return item();

      return item;
    }).filter(Boolean);

    return (result.length < 2) ? result[0] : new _elements_js__WEBPACK_IMPORTED_MODULE_4__.ElementDefinition('#fragment', {}, result);
  }

  $build(callback) {
    return _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine.from.call(this, [ this.build(callback) ].flat(Infinity));
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
    return this.getAttribute('id') || this.getAttribute('name') || this.getAttribute('data-name') || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toCamelCase(this.sensitiveTagName);
  }

  metadata(key, value) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_2__.metadata(this, key, value);
  }

  defineDynamicProp(name, defaultValue, setter, _context) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_2__.defineDynamicProp.call(_context || this, name, defaultValue, setter);
  }

  dynamicData(obj) {
    let keys = Object.keys(obj);
    let data = Object.create(null);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = obj[key];
      if (typeof value === 'function')
        continue;

      _utils_js__WEBPACK_IMPORTED_MODULE_2__.defineDynamicProp.call(data, key, value);
    }

    return data;
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
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

    promise = _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.createResolvable();
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
      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isType(item, '::String'))
        return item.trim();

      if (_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(item)) {
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
      await loadPartialIntoElement.call(this, srcURL);
      this.classList.add('mythix-ready');
    } catch (error) {
      console.error(`"${this.sensitiveTagName}": Failed to load specified resource: ${srcURL} (resolved to: ${error.url})`, error);
    }
  }
}

function getIdentifier(target) {
  if (!target)
    return 'undefined';

  if (typeof target.getIdentifier === 'function')
    return target.getIdentifier.call(target);

  if (target instanceof Element)
    return target.getAttribute('id') || target.getAttribute('name') || target.getAttribute('data-name') || _base_utils_js__WEBPACK_IMPORTED_MODULE_1__.toCamelCase(target.localName);

  return 'undefined';
}

// function formatRuleSet(rule, callback) {
//   if (!rule.selectorText)
//     return rule.cssText;

//   let _body   = rule.cssText.substring(rule.selectorText.length).trim();
//   let result  = (callback(rule.selectorText, _body) || []).filter(Boolean);
//   if (!result)
//     return '';

//   return result.join(' ');
// }

// function cssRulesToSource(cssRules, callback) {
//   return Array.from(cssRules || []).map((rule) => {
//     let ruleStr = formatRuleSet(rule, callback);
//     return `${cssRulesToSource(rule.cssRules, callback)}${ruleStr}`;
//   }).join('\n\n');
// }

// function compileStyleForDocument(elementName, styleElement) {
//   const handleHost = (m, type, _content) => {
//     let content = (!_content) ? _content : _content.replace(/^\(/, '').replace(/\)$/, '');

//     if (type === ':host') {
//       if (!content)
//         return elementName;

//       // Element selector?
//       if ((/^[a-zA-Z_]/).test(content))
//         return `${content}[data-mythix-component-name="${elementName}"]`;

//       return `${elementName}${content}`;
//     } else {
//       return `${content} ${elementName}`;
//     }
//   };

//   return cssRulesToSource(
//     styleElement.sheet.cssRules,
//     (_selector, body) => {
//       let selector = _selector;
//       let tags     = [];

//       let updatedSelector = selector.replace(/(['"])(?:\\.|[^\1])+?\1/, (m) => {
//         let index = tags.length;
//         tags.push(m);
//         return `@@@TAG[${index}]@@@`;
//       }).split(',').map((selector) => {
//         let modified = selector.replace(/(:host(?:-context)?)(\(\s*[^)]+?\s*\))?/, handleHost);
//         return (modified === selector) ? null : modified;
//       }).filter(Boolean).join(',').replace(/@@@TAG\[(\d+)\]@@@/, (m, index) => {
//         return tags[+index];
//       });

//       if (!updatedSelector)
//         return;

//       return [ updatedSelector, body ];
//     },
//   );
// }

// export function ensureDocumentStyles(ownerDocument, componentName, template) {
//   let objID             = BaseUtils.getObjectID(template);
//   let templateID        = BaseUtils.SHA256(objID);
//   let templateChildren  = Array.from(template.content.childNodes);
//   let index             = 0;

//   for (let templateChild of templateChildren) {
//     if (!(/^style$/i).test(templateChild.tagName))
//       continue;

//     let styleID = `IDSTYLE${templateID}${++index}`;
//     if (!ownerDocument.head.querySelector(`style#${styleID}`)) {
//       let clonedStyleElement = templateChild.cloneNode(true);
//       ownerDocument.head.appendChild(clonedStyleElement);

//       let newStyleSheet = compileStyleForDocument(componentName, clonedStyleElement);
//       ownerDocument.head.removeChild(clonedStyleElement);

//       let styleNode = ownerDocument.createElement('style');
//       styleNode.setAttribute('data-mythix-for', this.sensitiveTagName);
//       styleNode.setAttribute('id', styleID);
//       styleNode.innerHTML = newStyleSheet;

//       document.head.appendChild(styleNode);
//     }
//   }
// }

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

      // append to head
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
            _elements_js__WEBPACK_IMPORTED_MODULE_4__.processElements.call(
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

function compileMergeFragment(ownerDocument, node) {
  let fragment  = ownerDocument.createDocumentFragment();
  let selectors = (node.getAttribute('data-from') || '').split(',').map(((part) => part.trim())).filter(Boolean);

  for (let i = 0, il = selectors.length; i < il; i++) {
    let selector  = selectors[i];
    let element   = queryTemplate(ownerDocument, selector);
    if (element)
      fragment.appendChild((IS_TEMPLATE.test(element.tagName)) ? element.content.cloneNode(true) : element.cloneNode(true));
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
      let fragment = compileMergeFragment(ownerDocument, node);
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
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");








class MythixUILanguagePack extends _components_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIComponent {
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

class MythixUILanguageProvider extends _components_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIComponent {
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
      let { response }  = await _components_js__WEBPACK_IMPORTED_MODULE_4__.require.call(this, src, { ownerDocument: this.ownerDocument || document });
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
          property[_dynamic_property_js__WEBPACK_IMPORTED_MODULE_3__.DynamicProperty.set](value);
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
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");


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
 *     :info: `globalThis.mythixUI.urlResolver: (context: { src: string | URL, url: URL, path: string, fileName: string }) => string | URL` is a method that can be defined by the user. When defined, it will be called every time @see Components.resolveURL; is called. `MythixUIRequire` calls @see Components.resolveURL; to resolve URLs, including in sub `<script>` tag `src` attributes loaded from resources. It is the intent of this method that it will globally resolve all URLs internal to the Mythix UI framework. Obviously it won't resolve URLs directly from static `import` or dynamic `import()` statements in JavaScript. Those are handled by the [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) you setup, remember?.
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
  } = await _components_js__WEBPACK_IMPORTED_MODULE_0__.require.call(
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
  _components_js__WEBPACK_IMPORTED_MODULE_0__.importIntoDocumentFromSource.call(
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
  let result = _components_js__WEBPACK_IMPORTED_MODULE_0__.insertScriptIntoHead(url, { ownerDocument });
  console.log({ scriptElement: result });
  return true;
});

class MythixUIRequire extends _components_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  static registerHandler = registerRequireHandler;

  async mounted() {
    super.mounted();

    let src = this.getAttribute('src');

    try {
      let ownerDocument = this.ownerDocument || document;
      let url           = _components_js__WEBPACK_IMPORTED_MODULE_0__.resolveURL.call(this, ownerDocument.location, src, { magic: true });

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
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");
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

class MythixUISpinner extends _components_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
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
/* harmony export */   BaseUtils: () => (/* reexport module object */ _base_utils_js__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   Components: () => (/* reexport module object */ _components_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   DynamicProperty: () => (/* reexport safe */ _dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__.DynamicProperty),
/* harmony export */   Elements: () => (/* reexport module object */ _elements_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   MythixElements: () => (/* binding */ MythixElements),
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_5__.QueryEngine),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _base_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./base-utils.js */ "./lib/base-utils.js");
/* harmony import */ var _dynamic_property_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dynamic-property.js */ "./lib/dynamic-property.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mythix-ui-language-provider.js */ "./lib/mythix-ui-language-provider.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});

if (typeof document !== 'undefined' && !globalThis.mythixUI.globalScope.url)
  globalThis.mythixUI.globalScope.url = new URL(document.location);





















const MythixElements = {
  MythixUIRequire: _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIRequire,
  MythixUILanguagePack: _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_7__.MythixUILanguagePack,
  MythixUILanguageProvider: _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_7__.MythixUILanguageProvider,
  MythixUISpinner: _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_8__.MythixUISpinner,
};

const MythixUIComponent = _components_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent;



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

globalThis.mythixUI.BaseUtils = _base_utils_js__WEBPACK_IMPORTED_MODULE_3__;
globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Components = _components_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_2__;
globalThis.mythixUI.globalScope.globalStore = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.dynamicPropID(id);
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
      _components_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        disconnect();

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        _components_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement.call(element, src).then(() => {
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
    let disableTemplateEngineSelectorStr = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getDisableTemplateEngineSelector();
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

        if (newValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.isTemplate(newValue))
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatNodeValue(attributeNode, { scope: _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(target), disallowHTML: true });

        let observedAttributes = target.constructor.observedAttributes;
        if (observedAttributes && observedAttributes.indexOf(mutation.attributeName) < 0) {
          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.attributeChangedCallback.call(target, mutation.attributeName, oldValue, newValue);
        }
      } else if (mutation.type === 'childList') {
        let disableTemplating = (disableTemplateEngineSelectorStr && target && typeof target.closest === 'function' && target.closest('[data-templates-disable],mythix-for-each'));
        let addedNodes        = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          if (node[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationAdded.call(node, mutation) === false)
            continue;

          if (!disableTemplating)
            _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(node);

          if (typeof node.dispatchEvent === 'function') {
            let connectedEvent = new MythixConnectedEvent();
            node.dispatchEvent(connectedEvent);
          }

          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

          if (typeof node.dispatchEvent === 'function') {
            let disconnectedEvent = new MythixDisconnectedEvent();
            node.dispatchEvent(disconnectedEvent);
          }

          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
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

  _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(document.head);
  _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(document.body);

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
var __webpack_exports__Components = __webpack_exports__.Components;
var __webpack_exports__DynamicProperty = __webpack_exports__.DynamicProperty;
var __webpack_exports__Elements = __webpack_exports__.Elements;
var __webpack_exports__MythixElements = __webpack_exports__.MythixElements;
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
export { __webpack_exports__BaseUtils as BaseUtils, __webpack_exports__Components as Components, __webpack_exports__DynamicProperty as DynamicProperty, __webpack_exports__Elements as Elements, __webpack_exports__MythixElements as MythixElements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFLElBQUk7QUFDTjs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwSXFDOztBQUVyQyxnREFBZ0Q7O0FBSTlDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVksMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUEsY0FBYyxXQUFXLEVBQUUsMkNBQTJDO0FBQ3RFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDLG1DQUFtQyxhQUFhLDRFQUE0RSxLQUFLO0FBQ2pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7O0FBRTdDO0FBQ0EseUJBQXlCLFdBQVc7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7O0FBRUEsZ0JBQWdCLGlDQUFpQyxFQUFFLHNCQUFzQjtBQUN6RTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsZ0JBQWdCLGtCQUFrQjs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDBDQUEwQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsdURBQXVELGdCQUFnQjtBQUN2RSxnQkFBZ0IsR0FBRztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0EsZ0NBQWdDLEdBQUc7QUFDbkM7QUFDQSxtQkFBbUIsb0JBQW9CLEVBQUUsZUFBZSxHQUFHLFlBQVk7O0FBRXZFLDZCQUE2QixnQkFBZ0I7QUFDN0MsS0FBSztBQUNMLGdCQUFnQixHQUFHO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcnZCd0I7O0FBRXVCO0FBQ0w7QUFDTztBQUNKOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxhQUFhLDBCQUEwQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7O0FBRU8sbUdBQW1HOztBQUUxRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsbUJBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF3RjtBQUN4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkZBQTZGO0FBQzdGO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsbUNBQW1DLHNEQUFXLE1BQU0sbUVBQXdCO0FBQzVFLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdDQUF3Qyx1REFBcUI7O0FBRTdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQywyQ0FBMkM7QUFDakY7QUFDQTs7QUFFQSxZQUFZLGFBQWEsRUFBRSxzRUFBcUM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQOztBQUVBO0FBQ0EsMEJBQTBCLDBEQUF5QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdURBQXFCOztBQUVqRCxpQ0FBaUMsMkNBQTJDOztBQUU1RTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTyxzREFBVztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsbUVBQXdCO0FBQzlDLE9BQU87QUFDUCw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTCxJQUFJLGtEQUFpQjs7QUFFckI7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLGdEQUFnRCxZQUFZLEdBQUcsZUFBZTtBQUM5RSxPQUFPO0FBQ1Asc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLDRCQUE0QiwrQ0FBYyxtQkFBbUIsc0VBQTJCO0FBQ3hGO0FBQ0EsVUFBVSwrQ0FBYyxtQkFBbUIsc0VBQTJCO0FBQ3RFLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLGtEQUFrRCxTQUFTLGFBQWEsS0FBSztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxrREFBZ0IsSUFBSSxzQkFBc0IsR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHO0FBQ25HO0FBQ0EsNkRBQTZELFFBQVE7O0FBRXJFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEIsV0FBVyx5REFBd0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELGlEQUFlO0FBQy9EOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUhBQXVIO0FBQ3ZILGdKQUFnSjtBQUNoSjtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLFdBQVcsb0RBQW1CO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxzSUFBc0ksZ0NBQWdDO0FBQ3pPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLCtDQUFjLFNBQVMsK0RBQW9CLFNBQVM7O0FBRXhEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUVBQXVFO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCQUErQiwrQkFBK0IsR0FBRztBQUNqRTs7QUFFQTtBQUNBLFdBQVcsdURBQXNCO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSx1REFBc0I7O0FBRW5DO0FBQ0E7O0FBRUEsb0ZBQW9GLHNCQUFzQiwwQkFBMEIsc0JBQXNCO0FBQzFKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLGlEQUFlO0FBQ3pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSSxvREFBa0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5Q0FBeUMsd0JBQXdCO0FBQ2pFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLLElBQUksb0JBQW9COztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsdURBQXFCO0FBQ2pELG9DQUFvQyxhQUFhO0FBQ2pELFlBQVksY0FBYyxFQUFFLHNFQUFxQztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxrREFBaUI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBLHVCQUF1Qix5REFBdUI7QUFDOUMsc0JBQXNCLHlEQUFXLG1CQUFtQixnREFBZ0Q7QUFDcEc7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFFBQVEseURBQVc7QUFDbkI7QUFDQSxZQUFZLG1CQUFtQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7QUFDdkYsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQSxrRkFBa0Y7QUFDbEYsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdHQUFnRztBQUNoRztBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsaUNBQWlDO0FBQ3BFO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSxzRkFBc0Y7QUFDdEYsOERBQThEO0FBQzlELHdDQUF3Qyx1Q0FBdUM7QUFDL0UsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsOEJBQThCO0FBQ3pDO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Qsb0JBQW9CLE9BQU87QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QywwREFBeUIsSUFBSTtBQUNwRSx1QkFBdUIsZ0VBQXFCO0FBQzVDOztBQUVBO0FBQ0EsS0FBSzs7QUFFTCxpREFBaUQsMkRBQTBCLGdCQUFnQjtBQUMzRjs7QUFFQTtBQUNBLFdBQVcseURBQVc7QUFDdEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUdBQXFHLHVEQUFxQjtBQUMxSDs7QUFFQTtBQUNBLFdBQVcsK0NBQWM7QUFDekI7O0FBRUE7QUFDQSxXQUFXLHdEQUF1QjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSx3REFBdUI7QUFDN0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGNBQWMsNERBQTBCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUsa0RBQWdCO0FBQzFCOztBQUVBLFVBQVUseURBQXVCO0FBQ2pDO0FBQ0E7O0FBRUEsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sd0JBQXdCLHNCQUFzQix3Q0FBd0MsUUFBUSxnQkFBZ0IsVUFBVTtBQUN4SDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyR0FBMkcsdURBQXFCOztBQUVoSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQ0FBMEMsRUFBRSxRQUFRO0FBQ3JFLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsUUFBUSwrQkFBK0IsWUFBWTs7QUFFeEUsbUJBQW1CLFlBQVksRUFBRSxRQUFRO0FBQ3pDLFNBQVM7QUFDVCxtQkFBbUIsU0FBUyxFQUFFLFlBQVk7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNO0FBQ2xDLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTs7QUFFVjtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCLFdBQVcsRUFBRSxRQUFRO0FBQ3BELHNEQUFzRCxRQUFRO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE9BQU8sa0RBQWdCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixLQUFLOztBQUV2QjtBQUNBO0FBQ0EsS0FBSzs7QUFFTCw4REFBOEQsa0NBQWtDO0FBQ2hHO0FBQ0EscURBQXFELE9BQU87QUFDNUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVyxFQUFFO0FBQzFDO0FBQ0E7QUFDQSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUzs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsRUFBRSxPQUFPLFlBQVksR0FBRyxZQUFZO0FBQ3RFLEtBQUssYUFBYSxHQUFHO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSw0Q0FBNEM7QUFDbEQ7QUFDQSx3QkFBd0IsSUFBSSwrRkFBK0YsbUJBQW1CO0FBQzlJO0FBQ0E7O0FBRUEsK0VBQStFLCtDQUErQztBQUM5SDs7QUFFQTtBQUNBO0FBQ0EsMERBQTBELFlBQVksb0NBQW9DLFlBQVk7QUFDdEg7QUFDQSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0YsNkNBQTZDO0FBQ2pJOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0Isa0RBQWdCLElBQUksbUJBQW1CLEdBQUcsNEJBQTRCLEdBQUc7QUFDakc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDRDQUE0QztBQUNsRDtBQUNBLCtFQUErRSx3REFBd0Q7QUFDdkk7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixrREFBZ0Isa0JBQWtCO0FBQ3pEO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsY0FBYyxHQUFHLFFBQVE7QUFDbkU7QUFDQSxNQUFNLDRDQUE0QztBQUNsRDtBQUNBLHdDQUF3QywyQ0FBMkM7O0FBRW5GO0FBQ0E7QUFDQSxNQUFNLE9BQU87QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0RBQWdCLElBQUksbUJBQW1CLEdBQUcsZ0JBQWdCLEdBQUc7QUFDekY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzRUFBc0UsV0FBVztBQUNqRjs7QUFFQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBLHdDQUF3Qyx1QkFBdUI7QUFDL0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQyxXQUFXLEVBQUUsYUFBYTtBQUM3RDtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsaUJBQWlCLEVBQUUsb0JBQW9CO0FBQ3hFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsa0RBQWdCOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix1QkFBdUI7QUFDbkQ7QUFDQTtBQUNBLFlBQVkseURBQXdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtEQUFpQjtBQUN4QyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBOztBQUVPO0FBQ1A7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsK0NBQWMsVUFBVSx3RUFBNkI7QUFDbEY7QUFDQTtBQUNBLFFBQVEsK0NBQWMsVUFBVSx3RUFBNkI7QUFDN0Q7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsa0ZBQWtGOztBQUVuRztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7QUFDQSxpQ0FBaUM7O0FBRWpDLHdDQUF3QyxRQUFRO0FBQ2hEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU07QUFDUCx5QkFBeUIsK0NBQWMsVUFBVSx3RUFBNkI7QUFDOUU7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLGFBQWE7O0FBRXpGO0FBQ0E7QUFDQSx1RkFBdUYsYUFBYTs7QUFFcEc7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGtEQUFnQixNQUFNO0FBQzFDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVksMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDtBQUNBLFlBQVksNEZBQTRGO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSwrQkFBK0I7QUFDaEcsOEdBQThHO0FBQzlHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0EsNENBQTRDO0FBQzVDOztBQUVBO0FBQ08seUdBQXlHO0FBQ3pHLGdHQUFnRztBQUNoRyxxR0FBcUc7QUFDckcsbUhBQW1IO0FBQ25ILGlIQUFpSDs7QUFFeEg7QUFDTztBQUNBO0FBQ0E7O0FBRVA7QUFDTztBQUNBO0FBQ0Esd0dBQXdHO0FBQ3hHOztBQUVQO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RWlCOztBQUVxQjs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx1Q0FBdUM7QUFDdkM7QUFDQSx1SUFBdUk7QUFDdkk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxZQUFZLHVCQUF1QixlQUFlO0FBQ2pILHlDQUF5QywwQkFBMEI7QUFDbkUsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCwwQ0FBMEM7QUFDMUM7QUFDQSxtQ0FBbUMsc0RBQVcsTUFBTSxnRUFBcUI7QUFDekUsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxZQUFZLHVCQUF1QixlQUFlO0FBQ25ILDJDQUEyQywwQkFBMEI7QUFDckUsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSwrREFBb0IsRUFBRTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU8sc0RBQVc7QUFDbEI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGdFQUFxQjtBQUMzQyxPQUFPO0FBQ1AsT0FBTyxpRUFBc0I7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtEQUFnQjtBQUN2QyxPQUFPO0FBQ1AsT0FBTyxzRUFBMkI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLGlFQUFzQjtBQUNqRCwwREFBMEQsaUVBQXNCO0FBQ2hGLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixpRUFBc0I7O0FBRXZDO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlFQUFzQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsaUVBQXNCO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLGdCQUFnQixpRUFBc0I7QUFDdEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLDhCQUE4QjtBQUN6SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0EsR0FBRywrREFBb0I7QUFDdkI7QUFDQSxRQUFRLGtEQUFnQjtBQUN4Qjs7QUFFQSxhQUFhLGlFQUFzQjtBQUNuQzs7QUFFQSxhQUFhLHNFQUEyQjtBQUN4QyxXQUFXLGlFQUFzQjtBQUNqQztBQUNBOztBQUVBOztBQUVBO0FBQ0EsV0FBVyxzRUFBMkI7O0FBRXRDLDBCQUEwQixpRUFBc0I7QUFDaEQsV0FBVyxpRUFBc0I7O0FBRWpDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOLFdBQVcsc0VBQTJCO0FBQ3RDO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlRd0I7O0FBRXFCO0FBQ1Q7QUFDb0I7O0FBRXhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVcsMEJBQTBCO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLG1DQUFtQyxzREFBVyxNQUFNLGtFQUF1QjtBQUMzRSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLHNEQUFXO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixrRUFBdUI7QUFDN0MsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEMsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELHNCQUFzQjs7QUFFNUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsS0FBSyxJQUFJLDRCQUE0QjtBQUM3RDs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhCQUE4QixRQUFRLEVBQUUsY0FBYyxNQUFNLE9BQU87QUFDbkUsK0JBQStCLFFBQVE7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYyxnQkFBZ0IsRUFBRSwrQkFBK0IsU0FBUyxFQUFFLGNBQWMsRUFBRTtBQUMxRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCOztBQUVsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsaUVBQWdDO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEseURBQXdCO0FBQ2hDLFVBQVUsa0RBQWlCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsUUFBUTtBQUN4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0EsdURBQXVELGlCQUFpQjtBQUN4RSxHQUFHO0FBQ0g7O0FBRU87QUFDUDtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakMsR0FBRztBQUNIOztBQUVBO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVcsc0RBQVcsTUFBTSxrRUFBdUI7QUFDbkQ7O0FBRUEsV0FBVyxzREFBVyxNQUFNLDREQUFpQjtBQUM3Qzs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpRkFBaUYsU0FBUywwQkFBMEIsU0FBUzs7QUFFN0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGtEQUFpQjtBQUM3QixnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyx1RUFBc0M7QUFDMUUsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0EsdUNBQXVDLHFEQUFvQjtBQUMzRDs7QUFFQTtBQUNBLDZDQUE2Qyx5RkFBeUY7QUFDdEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0RBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYyxzREFBVyxNQUFNLGtFQUF1QjtBQUNsRSx1REFBdUQsT0FBTztBQUM5RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjLHNEQUFXLE1BQU0sNERBQWlCO0FBQzVEO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esb0RBQW9ELG1CQUFtQjtBQUN2RTs7QUFFQSwwQkFBMEIsaUVBQWdDO0FBQzFEOztBQUVBLGdEQUFnRCxRQUFRO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSx5REFBd0I7QUFDbEMsWUFBWSxrREFBaUI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsU0FBUyxpREFBZ0I7QUFDakM7QUFDQTtBQUNBLG9DQUFvQyxzREFBcUIsa0JBQWtCLGdDQUFnQztBQUMzRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUCxtQkFBbUIsa0RBQWdCO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsZ0VBQXFCO0FBQ3ZDOztBQUVBLGtCQUFrQixzREFBVyxNQUFNLGtFQUF1QjtBQUMxRDs7QUFFQSxrQkFBa0Isc0RBQVcsTUFBTSw0REFBaUI7QUFDcEQ7O0FBRUE7QUFDQTs7QUFFQSxhQUFhLGtEQUFnQixvQkFBb0IsaUVBQWU7QUFDaEU7O0FBRUEsZ0RBQWdELHFCQUFxQjtBQUNyRSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsZ0VBQXFCO0FBQ2pEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzSEFBc0g7QUFDdEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0NBQWtDLGdFQUFxQjtBQUN2RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFTztBQUNQO0FBQ0EsNENBQTRDLDhCQUE4Qjs7QUFFMUU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7O0FBRU8seURBQXlELE9BQU87QUFDaEU7QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQyw0Q0FBNEM7QUFDN0U7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdmpCa0M7QUFDVztBQUNUOztBQUlMOztBQUtOOztBQUVsQixtQ0FBbUMsNkRBQWlCO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFrQjtBQUN4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRU8sdUNBQXVDLDZEQUFpQjtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGlDQUFpQyxNQUFNO0FBQ3ZDLGtCQUFrQixnREFBZTs7QUFFakM7QUFDQSxhQUFhLGdFQUErQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRCwwQkFBMEI7QUFDaEY7O0FBRUE7QUFDQTtBQUNBLGlGQUFpRixvREFBa0I7QUFDbkc7QUFDQSw4R0FBOEcsS0FBSztBQUNuSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUCwwQkFBMEIsMENBQWE7QUFDdkM7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSxZQUFZLFFBQVEsbURBQU8sbUJBQW1CLCtDQUErQztBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix5RUFBeUUsS0FBSztBQUM5RTtBQUNBLE1BQU07QUFDTixzRkFBc0YsSUFBSTtBQUMxRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHlEQUF1QjtBQUNuQztBQUNBLFVBQVU7QUFDVix5QkFBeUIsZ0VBQStCO0FBQ3hEO0FBQ0EsbUJBQW1CLGlFQUFlO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TDZDOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsaUJBQWlCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELDZEQUE2RCx1SUFBdUksK0RBQStEO0FBQy9UO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELGNBQWM7QUFDbEU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQSxvREFBb0Qsb0JBQW9CO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxtREFBaUI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRSx3RUFBc0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVztBQUN4QztBQUNBO0FBQ0EsT0FBTztBQUNQLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxDQUFDOztBQUVELGtEQUFrRCxvQkFBb0I7QUFDdEUsZUFBZSxnRUFBOEIsUUFBUSxlQUFlO0FBQ3BFLGdCQUFnQix1QkFBdUI7QUFDdkM7QUFDQSxDQUFDOztBQUVNLDhCQUE4Qiw2REFBMkI7QUFDaEU7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLHNEQUFvQiwyQ0FBMkMsYUFBYTs7QUFFdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWO0FBQ0EsbURBQW1ELGdDQUFnQztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTiw0RUFBNEUsSUFBSTtBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDs7QUFFakQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3JLQTs7QUFFb0Q7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QWtELFFBQVE7QUFDMUQ7QUFDQSxtQkFBbUIsNkRBQTRCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiw2REFBNEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUseURBQXdCO0FBQzFCLEVBQUUseURBQXdCOztBQUUxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2Jhc2UtdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZHluYW1pYy1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwgc3ltYm9sKVxuXHRcdH0pXG5cdFx0OiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHR0cnkge1xuXHRcdHJldHVybiBwcm9wZXJ0eSBpbiBvYmplY3Rcblx0fSBjYXRjaChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcblx0cmV0dXJuIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuXHRcdCYmICEoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG5cdFx0XHQmJiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSkpIC8vIGFuZCBhbHNvIHVuc2FmZSBpZiB0aGV5J3JlIG5vbmVudW1lcmFibGUuXG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHZhciBkZXN0aW5hdGlvbiA9IHt9O1xuXHRpZiAob3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSB7XG5cdFx0Z2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG5cdGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZGVzdGluYXRpb25cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2U7XG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGlzTWVyZ2VhYmxlT2JqZWN0O1xuXHQvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG5cdC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cblx0b3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkO1xuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuXHR2YXIgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcblx0dmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59O1xuXG52YXIgZGVlcG1lcmdlXzEgPSBkZWVwbWVyZ2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXzE7XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbi8qKlxuICogdHlwZTogTmFtZXNwYWNlXG4gKiBuYW1lOiBCYXNlVXRpbHNcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIGBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgIE1pc2MgdXRpbGl0eSBmdW5jdGlvbnMgYW5kIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqL1xuXG5mdW5jdGlvbiBwYWQoc3RyLCBjb3VudCwgY2hhciA9ICcwJykge1xuICByZXR1cm4gc3RyLnBhZFN0YXJ0KGNvdW50LCBjaGFyKTtcbn1cblxuY29uc3QgSURfQ09VTlRfTEVOR1RIICAgICAgICAgPSAxOTtcbmNvbnN0IElTX0NMQVNTICAgICAgICAgICAgICAgID0gKC9eY2xhc3MgXFxTKyBcXHsvKTtcbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFX05BTUVTID0gW1xuICAnQWdncmVnYXRlRXJyb3InLFxuICAnQXJyYXknLFxuICAnQXJyYXlCdWZmZXInLFxuICAnQmlnSW50JyxcbiAgJ0JpZ0ludDY0QXJyYXknLFxuICAnQmlnVWludDY0QXJyYXknLFxuICAnQm9vbGVhbicsXG4gICdEYXRhVmlldycsXG4gICdEYXRlJyxcbiAgJ0RlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlJyxcbiAgJ0Vycm9yJyxcbiAgJ0V2YWxFcnJvcicsXG4gICdGaW5hbGl6YXRpb25SZWdpc3RyeScsXG4gICdGbG9hdDMyQXJyYXknLFxuICAnRmxvYXQ2NEFycmF5JyxcbiAgJ0Z1bmN0aW9uJyxcbiAgJ0ludDE2QXJyYXknLFxuICAnSW50MzJBcnJheScsXG4gICdJbnQ4QXJyYXknLFxuICAnTWFwJyxcbiAgJ051bWJlcicsXG4gICdPYmplY3QnLFxuICAnUHJveHknLFxuICAnUmFuZ2VFcnJvcicsXG4gICdSZWZlcmVuY2VFcnJvcicsXG4gICdSZWdFeHAnLFxuICAnU2V0JyxcbiAgJ1NoYXJlZEFycmF5QnVmZmVyJyxcbiAgJ1N0cmluZycsXG4gICdTeW1ib2wnLFxuICAnU3ludGF4RXJyb3InLFxuICAnVHlwZUVycm9yJyxcbiAgJ1VpbnQxNkFycmF5JyxcbiAgJ1VpbnQzMkFycmF5JyxcbiAgJ1VpbnQ4QXJyYXknLFxuICAnVWludDhDbGFtcGVkQXJyYXknLFxuICAnVVJJRXJyb3InLFxuICAnV2Vha01hcCcsXG4gICdXZWFrUmVmJyxcbiAgJ1dlYWtTZXQnLFxuXTtcblxuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEgPSBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUy5tYXAoKHR5cGVOYW1lKSA9PiB7XG4gIHJldHVybiBbIHR5cGVOYW1lLCBnbG9iYWxUaGlzW3R5cGVOYW1lXSBdO1xufSkuZmlsdGVyKChtZXRhKSA9PiBtZXRhWzFdKTtcblxuY29uc3QgSURfQ09VTlRFUl9DVVJSRU5UX1ZBTFVFICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaWQtY291bnRlci1jdXJyZW50LXZhbHVlJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG5sZXQgaWRDb3VudGVyID0gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChnbG9iYWxUaGlzLm15dGhpeFVJLCBJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUUpKSA/IGdsb2JhbFRoaXMubXl0aGl4VUlbSURfQ09VTlRFUl9DVVJSRU5UX1ZBTFVFXSA6IDBuO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdlbmVyYXRlIGEgcGFydGlhbGx5IHJhbmRvbSB1bmlxdWUgSUQuIFRoZSBpZCBnZW5lcmF0ZWQgd2lsbCBiZSBhIGBEYXRlLm5vdygpYFxuICogICB2YWx1ZSB3aXRoIGFuIGluY3JlbWVudGluZyBCaWdJbnQgcG9zdGZpeGVkIHRvIGl0LlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IEEgdW5pcXVlIElELlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZygnSUQ6ICcsIEJhc2VVdGlscy5nZW5lcmF0ZUlEKCkpO1xuICogICAgIC8vIG91dHB1dCAtPiAnSUQxNzA0MTQzMDI3MTc5MDAwMDAwMDAwMDAwMDAwMDAwNydcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSUQoKSB7XG4gIGlkQ291bnRlciArPSBCaWdJbnQoMSk7XG4gIGdsb2JhbFRoaXMubXl0aGl4VUlbSURfQ09VTlRFUl9DVVJSRU5UX1ZBTFVFXSA9IGlkQ291bnRlcjtcblxuICByZXR1cm4gYElEJHtEYXRlLm5vdygpfSR7cGFkKGlkQ291bnRlci50b1N0cmluZygpLCBJRF9DT1VOVF9MRU5HVEgpfWA7XG59XG5cbmNvbnN0IE9CSkVDVF9JRF9TVE9SQUdFID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9vYmplY3QtaWQtc3RvcmFnZScpO1xuY29uc3QgT0JKRUNUX0lEX1dFQUtNQVAgPSBnbG9iYWxUaGlzLm15dGhpeFVJW09CSkVDVF9JRF9TVE9SQUdFXSA9IChnbG9iYWxUaGlzLm15dGhpeFVJW09CSkVDVF9JRF9TVE9SQUdFXSkgPyBnbG9iYWxUaGlzLm15dGhpeFVJW09CSkVDVF9JRF9TVE9SQUdFXSA6IG5ldyBXZWFrTWFwKCk7XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2V0IGEgdW5pcXVlIElEIGZvciBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSByZWZlcmVuY2UuXG4gKlxuICogICBVbmlxdWUgSURzIGFyZSBnZW5lcmF0ZWQgdmlhIEBzZWUgQmFzZVV0aWxzLmdlbmVyYXRlSUQ7LlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IEFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRCBmb3IgdGhpcyByZWZlcmVuY2UgKGFzIGEgU0hBMjU2IGhhc2gpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMuZ2V0T2JqZWN0SUQoZGl2RWxlbWVudCkpO1xuICogICAgIC8vIG91dHB1dCAtPiAnMTcwNDE0MzAyNzE3OTAwMDAwMDAwMDAwMDAwMDAwMDcnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmplY3RJRCh2YWx1ZSkge1xuICBsZXQgaWQgPSBPQkpFQ1RfSURfV0VBS01BUC5nZXQodmFsdWUpO1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIGxldCB0aGlzSUQgPSBnZW5lcmF0ZUlEKCk7XG5cbiAgICBPQkpFQ1RfSURfV0VBS01BUC5zZXQodmFsdWUsIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENyZWF0ZSBhbiB1bnJlc29sdmVkIHNwZWNpYWxpemVkIFByb21pc2UgaW5zdGFuY2UsIHdpdGggdGhlIGludGVudCB0aGF0IGl0IHdpbGwgYmVcbiAqICAgcmVzb2x2ZWQgbGF0ZXIuXG4gKlxuICogICBUaGUgUHJvbWlzZSBpbnN0YW5jZSBpcyBzcGVjaWFsaXplZCBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBhcmUgaW5qZWN0ZWQgaW50byBpdDpcbiAqICAgMS4gYHJlc29sdmUocmVzdWx0VmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZXNvbHZlcyB0aGUgcHJvbWlzZSB3aXRoIHRoZSBmaXJzdCBwcm92aWRlZCBhcmd1bWVudFxuICogICAyLiBgcmVqZWN0KGVycm9yVmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZWplY3RzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gKiAgIDMuIGBzdGF0dXMoKWAgLSBXaGVuIGNhbGxlZCwgd2lsbCByZXR1cm4gdGhlIGZ1bGZpbGxtZW50IHN0YXR1cyBvZiB0aGUgcHJvbWlzZSwgYXMgYSBgc3RyaW5nYCwgb25lIG9mOiBgXCJwZW5kaW5nXCIsIFwiZnVsZmlsbGVkXCJgLCBvciBgXCJyZWplY3RlZFwiYFxuICogICA0LiBgaWQ8c3RyaW5nPmAgLSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBJRCBmb3IgdGhpcyBwcm9taXNlXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIFByb21pc2U7IEFuIHVucmVzb2x2ZWQgUHJvbWlzZSB0aGF0IGNhbiBiZSByZXNvbHZlZCBvciByZWplY3RlZCBieSBjYWxsaW5nIGBwcm9taXNlLnJlc29sdmUocmVzdWx0KWAgb3IgYHByb21pc2UucmVqZWN0KGVycm9yKWAgcmVzcGVjdGl2ZWx5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVzb2x2YWJsZSgpIHtcbiAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgbGV0IHJlc29sdmU7XG4gIGxldCByZWplY3Q7XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICByZXNvbHZlID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ2Z1bGZpbGxlZCc7XG4gICAgICAgIF9yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHJlamVjdCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgIF9yZWplY3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm9taXNlLCB7XG4gICAgJ3Jlc29sdmUnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlc29sdmUsXG4gICAgfSxcbiAgICAncmVqZWN0Jzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZWplY3QsXG4gICAgfSxcbiAgICAnc3RhdHVzJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICAoKSA9PiBzdGF0dXMsXG4gICAgfSxcbiAgICAnaWQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIGdlbmVyYXRlSUQoKSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBSdW50aW1lIHR5cGUgcmVmbGVjdGlvbiBoZWxwZXIuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgYSBtb3JlIHJvYnVzdCByZXBsYWNlbWVudCBmb3IgdGhlIGB0eXBlb2ZgIG9wZXJhdG9yLlxuICpcbiAqICAgVGhpcyBtZXRob2QgYWx3YXlzIHJldHVybnMgYSBuYW1lIChhcyBhIGBzdHJpbmdgIHR5cGUpIG9mIHRoZSB1bmRlcmx5aW5nIGRhdGF0eXBlLlxuICogICBUaGUgXCJkYXRhdHlwZVwiIGlzIGEgbGl0dGxlIGxvb3NlIGZvciBwcmltaXRpdmUgdHlwZXMuIEZvciBleGFtcGxlLCBhXG4gKiAgIHByaW1pdGl2ZSBgdHlwZW9mIHggPT09ICdudW1iZXInYCB0eXBlIGlzIHJldHVybmVkIGFzIGl0cyBjb3JyZXNwb25kaW5nIE9iamVjdCAoY2xhc3MpIHR5cGUgYCdOdW1iZXInYC4gRm9yIGBib29sZWFuYCBpdCB3aWxsIGluc3RlYWRcbiAqICAgcmV0dXJuIGAnQm9vbGVhbidgLCBhbmQgZm9yIGAnc3RyaW5nJ2AsIGl0IHdpbGwgaW5zdGVhZCByZXR1cm4gYCdTdHJpbmcnYC4gVGhpcyBpcyB0cnVlIG9mIGFsbCB1bmRlcmx5aW5nIHByaW1pdGl2ZSB0eXBlcy5cbiAqXG4gKiAgIEZvciBpbnRlcm5hbCBkYXRhdHlwZXMsIGl0IHdpbGwgcmV0dXJuIHRoZSByZWFsIGNsYXNzIG5hbWUgcHJlZml4ZWQgYnkgdHdvIGNvbG9ucy5cbiAqICAgRm9yIGV4YW1wbGUsIGB0eXBlT2YobmV3IE1hcCgpKWAgd2lsbCByZXR1cm4gYCc6Ok1hcCdgLlxuICpcbiAqICAgTm9uLWludGVybmFsIHR5cGVzIHdpbGwgbm90IGJlIHByZWZpeGVkLCBhbGxvd2luZyBjdXN0b20gdHlwZXMgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIGludGVybmFsIHR5cGVzIHRvIGFsc28gYmUgZGV0ZWN0ZWQuXG4gKiAgIEZvciBleGFtcGxlLCBgY2xhc3MgVGVzdCB7fTsgdHlwZU9mKG5ldyBUZXN0KCkpYCB3aWxsIHJlc3VsdCBpbiB0aGUgbm9uLXByZWZpeGVkIHJlc3VsdCBgJ1Rlc3QnYC5cbiAqXG4gKiAgIEZvciByYXcgYGZ1bmN0aW9uYCB0eXBlcywgYHR5cGVPZmAgd2lsbCBjaGVjayBpZiB0aGV5IGFyZSBhIGNvbnN0cnVjdG9yIG9yIG5vdC4gSWYgYSBjb25zdHJ1Y3RvciBpcyBkZXRlY3RlZCwgdGhlblxuICogICB0aGUgZm9ybWF0IGAnW0NsYXNzICR7bmFtZX1dJ2Agd2lsbCBiZSByZXR1cm5lZCBhcyB0aGUgdHlwZS4gRm9yIGludGVybmFsIHR5cGVzIHRoZSBuYW1lIHdpbGxcbiAqICAgYmUgcHJlZml4ZWQsIGkuZS4gYFtDbGFzcyA6OiR7aW50ZXJuYWxOYW1lfV1gLCBhbmQgZm9yIG5vbi1pbnRlcm5hbCB0eXBlcyB3aWxsIGluc3RlYWQgYmUgbm9uLXByZWZpeGVkLCBpLmUuIGBbQ2xhc3MgJHtuYW1lfV1gIC5cbiAqICAgRm9yIGV4YW1wbGUsIGB0eXBlT2YoTWFwKWAgd2lsbCByZXR1cm4gYCdbQ2xhc3MgOjpNYXBdJ2AsIHdoZXJlYXMgYHR5cGVPZihUZXN0KWAgd2lsbCByZXN1bHQgaW4gYCdbQ2xhc3MgVGVzdF0nYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBUaGUgdmFsdWUgd2hvc2UgdHlwZSB5b3Ugd2lzaCB0byBkaXNjb3Zlci5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgbmFtZSBvZiB0aGUgcHJvdmlkZWQgdHlwZSwgb3IgYW4gZW1wdHkgc3RyaW5nIGAnJ2AgaWYgdGhlIHByb3ZpZGVkIHZhbHVlIGhhcyBubyB0eXBlLlxuICogbm90ZXM6XG4gKiAgIC0gVGhpcyBtZXRob2Qgd2lsbCBsb29rIGZvciBhIFtTeW1ib2wudG9TdHJpbmdUYWddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N5bWJvbC90b1N0cmluZ1RhZylcbiAqICAgICBrZXkgb24gdGhlIHZhbHVlIHByb3ZpZGVkLi4uIGFuZCBpZiBmb3VuZCwgd2lsbCB1c2UgaXQgdG8gYXNzaXN0IHdpdGggZmluZGluZyB0aGUgY29ycmVjdCB0eXBlIG5hbWUuXG4gKiAgIC0gSWYgdGhlIGB2YWx1ZWAgcHJvdmlkZWQgaXMgdHlwZS1sZXNzLCBpLmUuIGB1bmRlZmluZWRgLCBgbnVsbGAsIG9yIGBOYU5gLCB0aGVuIGFuIGVtcHR5IHR5cGUgYCcnYCB3aWxsIGJlIHJldHVybmVkLlxuICogICAtIFVzZSB0aGUgYHR5cGVvZmAgb3BlcmF0b3IgaWYgeW91IHdhbnQgdG8gZGV0ZWN0IGlmIGEgdHlwZSBpcyBwcmltaXRpdmUgb3Igbm90LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHlwZU9mKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gJyc7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gJzo6TnVtYmVyJztcblxuICBsZXQgdGhpc1R5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0aGlzVHlwZSA9PT0gJ2JpZ2ludCcpXG4gICAgcmV0dXJuICc6OkJpZ0ludCc7XG5cbiAgaWYgKHRoaXNUeXBlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gJzo6U3ltYm9sJztcblxuICBpZiAodGhpc1R5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHRoaXNUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsZXQgbmF0aXZlVHlwZU1ldGEgPSBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQS5maW5kKCh0eXBlTWV0YSkgPT4gKHZhbHVlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgICAgaWYgKG5hdGl2ZVR5cGVNZXRhKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyA6OiR7bmF0aXZlVHlwZU1ldGFbMF19XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBJU19DTEFTUy50ZXN0KCcnICsgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yKSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHt2YWx1ZS5uYW1lfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcbiAgICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgICByZXR1cm4gYFtDbGFzcyAke3Jlc3VsdH1dYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYDo6JHt0aGlzVHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3RoaXNUeXBlLnN1YnN0cmluZygxKX1gO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgIHJldHVybiAnOjpBcnJheSc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKVxuICAgIHJldHVybiAnOjpTdHJpbmcnO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE51bWJlcilcbiAgICByZXR1cm4gJzo6TnVtYmVyJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKVxuICAgIHJldHVybiAnOjpCb29sZWFuJztcblxuICBsZXQgbmF0aXZlVHlwZU1ldGEgPSBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQS5maW5kKCh0eXBlTWV0YSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKHR5cGVNZXRhWzBdICE9PSAnT2JqZWN0JyAmJiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGVNZXRhWzFdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgaWYgKG5hdGl2ZVR5cGVNZXRhKVxuICAgIHJldHVybiBgOjoke25hdGl2ZVR5cGVNZXRhWzBdfWA7XG5cbiAgaWYgKHR5cGVvZiBNYXRoICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gTWF0aClcbiAgICByZXR1cm4gJzo6TWF0aCc7XG5cbiAgaWYgKHR5cGVvZiBKU09OICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gSlNPTilcbiAgICByZXR1cm4gJzo6SlNPTic7XG5cbiAgaWYgKHR5cGVvZiBBdG9taWNzICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gQXRvbWljcylcbiAgICByZXR1cm4gJzo6QXRvbWljcyc7XG5cbiAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gUmVmbGVjdClcbiAgICByZXR1cm4gJzo6UmVmbGVjdCc7XG5cbiAgaWYgKHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10pXG4gICAgcmV0dXJuICh0eXBlb2YgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKCkgOiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgICByZXR1cm4gJzo6T2JqZWN0JztcblxuICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fCAnT2JqZWN0Jztcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBSdW50aW1lIHR5cGUgcmVmbGVjdGlvbiBoZWxwZXIuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgYSBtb3JlIHJvYnVzdCByZXBsYWNlbWVudCBmb3IgdGhlIGBpbnN0YW5jZW9mYCBvcGVyYXRvci5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGB0cnVlYCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyAqYW55KiBvZiB0aGUgcHJvdmlkZWQgYHR5cGVzYC5cbiAqXG4gKiAgIFRoZSBwcm92aWRlZCBgdHlwZXNgIGNhbiBlYWNoIGVpdGhlciBiZSBhIHJlYWwgcmF3IHR5cGUgKGkuZS4gYFN0cmluZ2AgY2xhc3MpLCBvciB0aGUgbmFtZSBvZiBhIHR5cGUsIGFzIGEgc3RyaW5nLFxuICogICBpLmUuIGAnOjpTdHJpbmcnYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBUaGUgdmFsdWUgd2hvc2UgdHlwZSB5b3Ugd2lzaCB0byBjb21wYXJlLlxuICogICAtIG5hbWU6IC4uLnR5cGVzXG4gKiAgICAgZGF0YVR5cGU6IEFycmF5PGFueT5cbiAqICAgICBkZXNjOiBBbGwgdHlwZXMgeW91IHdpc2ggdG8gY2hlY2sgYWdhaW5zdC4gU3RyaW5nIHZhbHVlcyBjb21wYXJlIHR5cGVzIGJ5IG5hbWUsIGZ1bmN0aW9uIHZhbHVlcyBjb21wYXJlIHR5cGVzIGJ5IGBpbnN0YW5jZW9mYC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdmFsdWVgIG1hdGNoZXMgYW55IG9mIHRoZSBwcm92aWRlZCBgdHlwZXNgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgY29uc3QgZ2V0SW50ZXJuYWxUeXBlTmFtZSA9ICh0eXBlKSA9PiB7XG4gICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh0eXBlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgIHJldHVybiBgOjoke25hdGl2ZVR5cGVNZXRhWzBdfWA7XG4gIH07XG5cbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGZvciAobGV0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVPZih0eXBlLCAnOjpTdHJpbmcnKSAmJiB2YWx1ZVR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgbGV0IGludGVybmFsVHlwZSA9IGdldEludGVybmFsVHlwZU5hbWUodHlwZSk7XG4gICAgICAgIGlmIChpbnRlcm5hbFR5cGUgJiYgaW50ZXJuYWxUeXBlID09PSB2YWx1ZVR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFZlcmlmeSB0aGF0IHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGEgYG51bWJlcmAgdHlwZSAob3IgYE51bWJlcmAgaW5zdGFuY2UpLCBhbmQgdGhhdFxuICogICBpdCAqKmlzIG5vdCoqIGBOYU5gLCBgSW5maW5pdHlgLCBvciBgLUluZmluaXR5YC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBgbnVtYmVyYCAob3IgYE51bWJlcmAgaW5zdGFuY2UpIGFuZCBpcyBhbHNvICoqbm90KiogYE5hTmAsIGBJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgLiBpLmUuIGAoaXNOdW1iZXIodmFsdWUpICYmIGlzRmluaXRlKHZhbHVlKSlgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIChpc1R5cGUodmFsdWUsICc6Ok51bWJlcicpICYmIGlzRmluaXRlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgVmVyaWZ5IHRoYXQgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBcInBsYWluXCIvXCJ2YW5pbGxhXCIgT2JqZWN0IGluc3RhbmNlLlxuICpcbiAqICAgVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgdG8gaGVscCB0aGUgY2FsbGVyIGRldGVjdCBpZiBhbiBvYmplY3QgaXMgYSBcInJhdyBwbGFpbiBvYmplY3RcIixcbiAqICAgaW5oZXJpdGluZyBmcm9tIGBPYmplY3QucHJvdG90eXBlYCAob3IgYSBgbnVsbGAgcHJvdG90eXBlKS5cbiAqXG4gKiAgIDEuIGBpc1BsYWluT2JqZWN0KHt9KWAgd2lsbCByZXR1cm4gYHRydWVgLlxuICogICAyLiBgaXNQbGFpbk9iamVjdChuZXcgT2JqZWN0KCkpYCB3aWxsIHJldHVybiBgdHJ1ZWAuXG4gKiAgIDMuIGBpc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpYCB3aWxsIHJldHVybiBgdHJ1ZWAuXG4gKiAgIDQuIGBpc1BsYWluT2JqZWN0KG5ldyBDdXN0b21DbGFzcygpKWAgd2lsbCByZXR1cm4gYGZhbHNlYC5cbiAqICAgNS4gQWxsIG90aGVyIGludm9jYXRpb25zIHNob3VsZCByZXR1cm4gYGZhbHNlYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBcInJhd1wiL1wicGxhaW5cIiBPYmplY3QgaW5zdGFuY2UuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGEgamF2YXNjcmlwdCBwcmltaXRpdmUgdHlwZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB0eXBlb2YgdmFsdWVgIGlzIG9uZSBvZjogYHN0cmluZ2AsIGBudW1iZXJgLCBgYm9vbGVhbmAsIGBiaWdpbnRgLCBvciBgc3ltYm9sYCxcbiAqICAgICAgKmFuZCBhbHNvKiBgdmFsdWVgIGlzICpub3QqIGBOYU5gLCBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYHVuZGVmaW5lZGAsIG9yIGBudWxsYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgJzo6TnVtYmVyJywgJzo6Qm9vbGVhbicsICc6OkJpZ0ludCcpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERldGVjdCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBnYXJiYWdlIGNvbGxlY3RhYmxlLlxuICpcbiAqICAgVGhpcyBtZXRob2QgaXMgdXNlZCB0byBjaGVjayBpZiBhbnkgYHZhbHVlYCBpcyBhbGxvd2VkIHRvIGJlIHVzZWQgYXMgYSB3ZWFrIHJlZmVyZW5jZS5cbiAqXG4gKiAgIEVzc2VudGlhbGx5LCB0aGlzIHdpbGwgcmV0dXJuIGBmYWxzZWAgZm9yIGFueSBwcmltaXRpdmUgdHlwZSwgb3IgYG51bGxgLCBgdW5kZWZpbmVkYCwgYE5hTmAsIGBJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgIHZhbHVlcy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB0eXBlb2YgdmFsdWVgIGlzIG9uZSBvZjogYHN0cmluZ2AsIGBudW1iZXJgLCBgYm9vbGVhbmAsIGBiaWdpbnRgLCBvciBgc3ltYm9sYCxcbiAqICAgICAgKmFuZCBhbHNvKiBgdmFsdWVgICppcyBub3QqIGBOYU5gLCBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYHVuZGVmaW5lZGAsIG9yIGBudWxsYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3RhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXMoSW5maW5pdHkpIHx8IE9iamVjdC5pcygtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgJzo6TnVtYmVyJywgJzo6Qm9vbGVhbicsICc6OkJpZ0ludCcpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgXCJlbXB0eVwiIChpcyAqKk4qKnVsbCAqKk8qKnIgKipFKiptcHR5KS5cbiAqXG4gKiAgIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBcImVtcHR5XCIgaWYgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBpcyBtZXQ6XG4gKiAgIDEuIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKiAgIDIuIGB2YWx1ZWAgaXMgYG51bGxgLlxuICogICAzLiBgdmFsdWVgIGlzIGAnJ2AgKGFuIGVtcHR5IHN0cmluZykuXG4gKiAgIDQuIGB2YWx1ZWAgaXMgbm90IGFuIGVtcHR5IHN0cmluZywgYnV0IGl0IGNvbnRhaW5zIG5vdGhpbmcgZXhjZXB0IHdoaXRlc3BhY2UgKGBcXHRgLCBgXFxyYCwgYFxcc2AsIG9yIGBcXG5gKS5cbiAqICAgNS4gYHZhbHVlYCBpcyBgTmFOYC5cbiAqICAgNi4gYHZhbHVlLmxlbmd0aGAgaXMgYSBgTnVtYmVyYCBvciBgbnVtYmVyYCB0eXBlLCBhbmQgaXMgZXF1YWwgdG8gYDBgLlxuICogICA3LiBgdmFsdWVgIGlzIGEgQHNlZSBCYXNlVXRpbHMuaXNQbGFpbk9iamVjdD9jYXB0aW9uPXBsYWluK29iamVjdDsgYW5kIGhhcyBubyBpdGVyYWJsZSBrZXlzLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYW55IG9mIHRoZSBcImVtcHR5XCIgY29uZGl0aW9ucyBhYm92ZSBhcmUgdHJ1ZS5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzTm90Tk9FOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnKSAmJiAoL15bXFx0XFxzXFxyXFxuXSokLykudGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZS5sZW5ndGgsICc6Ok51bWJlcicpKVxuICAgIHJldHVybiAodmFsdWUubGVuZ3RoID09PSAwKTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzICoqbm90KiogXCJlbXB0eVwiIChpcyBub3QgKipOKip1bGwgKipPKipyICoqRSoqbXB0eSkuXG4gKlxuICogICBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgXCJlbXB0eVwiIGlmIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaXMgbWV0OlxuICogICAxLiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICogICAyLiBgdmFsdWVgIGlzIGBudWxsYC5cbiAqICAgMy4gYHZhbHVlYCBpcyBgJydgIChhbiBlbXB0eSBzdHJpbmcpLlxuICogICA0LiBgdmFsdWVgIGlzIG5vdCBhbiBlbXB0eSBzdHJpbmcsIGJ1dCBpdCBjb250YWlucyBub3RoaW5nIGV4Y2VwdCB3aGl0ZXNwYWNlIChgXFx0YCwgYFxccmAsIGBcXHNgLCBvciBgXFxuYCkuXG4gKiAgIDUuIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKiAgIDYuIGB2YWx1ZS5sZW5ndGhgIGlzIGEgYE51bWJlcmAgb3IgYG51bWJlcmAgdHlwZSwgYW5kIGlzIGVxdWFsIHRvIGAwYC5cbiAqICAgNy4gYHZhbHVlYCBpcyBhIEBzZWUgQmFzZVV0aWxzLmlzUGxhaW5PYmplY3Q/Y2FwdGlvbj1wbGFpbitvYmplY3Q7IGFuZCBoYXMgbm8gaXRlcmFibGUga2V5cy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYGZhbHNlYCBpZiBhbnkgb2YgdGhlIFwiZW1wdHlcIiBjb25kaXRpb25zIGFib3ZlIGFyZSB0cnVlLlxuICogICAyLiBPdGhlcndpc2UsIGB0cnVlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBpcyB0aGUgZXhhY3QgaW52ZXJzZSBvZiBAc2VlIEJhc2VVdGlscy5pc05PRTtcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNOT0U7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOb3ROT0UodmFsdWUpIHtcbiAgcmV0dXJuICFpc05PRSh2YWx1ZSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29udmVydCB0aGUgcHJvdmlkZWQgYHN0cmluZ2AgYHZhbHVlYCBpbnRvIFtjYW1lbENhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0NhbWVsX2Nhc2UpLlxuICpcbiAqICAgVGhlIHByb2Nlc3MgaXMgcm91Z2hseSBhcyBmb2xsb3dzOlxuICogICAxLiBBbnkgbm9uLXdvcmQgY2hhcmFjdGVycyAoW2EtekEtWjAtOV9dKSBhcmUgc3RyaXBwZWQgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmcuXG4gKiAgIDIuIEFueSBub24td29yZCBjaGFyYWN0ZXJzIChbYS16QS1aMC05X10pIGFyZSBzdHJpcHBlZCBmcm9tIHRoZSBlbmQgb2YgdGhlIHN0cmluZy5cbiAqICAgMy4gRWFjaCBcIndvcmRcIiBpcyBjYXBpdGFsaXplZC5cbiAqICAgNC4gVGhlIGZpcnN0IGxldHRlciBpcyBhbHdheXMgbG93ZXItY2FzZWQuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogU3RyaW5nIHRvIGNvbnZlcnQgaW50byBbY2FtZWxDYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNDYW1lbF9jYXNlKS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgZm9ybWF0dGVkIHN0cmluZyBpbiBbY2FtZWxDYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNDYW1lbF9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLnRvQ2FtZWxDYXNlKCctLXRlc3Qtc29tZV92YWx1ZV9AJykpO1xuICogICAgIC8vIG91dHB1dCAtPiAndGVzdFNvbWVWYWx1ZSdcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvXlxcVy8sICcnKVxuICAgIC5yZXBsYWNlKC9bXFxXXSskLywgJycpXG4gICAgLnJlcGxhY2UoLyhbQS1aXSspL2csICctJDEnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL1xcVysoLikvZywgKG0sIHApID0+IHtcbiAgICAgIHJldHVybiBwLnRvVXBwZXJDYXNlKCk7XG4gICAgfSlcbiAgICAucmVwbGFjZSgvXiguKSguKikkLywgKG0sIGYsIGwpID0+IGAke2YudG9Mb3dlckNhc2UoKX0ke2x9YCk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29udmVydCB0aGUgcHJvdmlkZWQgYHN0cmluZ2AgYHZhbHVlYCBpbnRvIFtzbmFrZV9jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNTbmFrZV9jYXNlKS5cbiAqXG4gKiAgIFRoZSBwcm9jZXNzIGlzIHJvdWdobHkgYXMgZm9sbG93czpcbiAqICAgMS4gQW55IGNhcGl0YWxpemVkIGNoYXJhY3RlciBzZXF1ZW5jZSBpcyBwcmVmaXhlZCBieSBhbiB1bmRlcnNjb3JlLlxuICogICAyLiBNb3JlIHRoYW4gb25lIHNlcXVlbnRpYWwgdW5kZXJzY29yZXMgYXJlIGNvbnZlcnRlZCBpbnRvIGEgc2luZ2xlIHVuZGVyc2NvcmUuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogU3RyaW5nIHRvIGNvbnZlcnQgaW50byBbc25ha2VfY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU25ha2VfY2FzZSkuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIGZvcm1hdHRlZCBzdHJpbmcgaW4gW3NuYWtlX2Nhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1NuYWtlX2Nhc2UpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMudG9TbmFrZUNhc2UoJ1RoaXNJc0FTZW50ZW5jZScpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ3RoaXNfaXNfYV9zZW50ZW5jZSdcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvU25ha2VDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvW0EtWl0rL2csIChtLCBvZmZzZXQpID0+ICgob2Zmc2V0KSA/IGBfJHttLnRvTG93ZXJDYXNlKCl9YCA6IG0udG9Mb3dlckNhc2UoKSkpXG4gICAgLnJlcGxhY2UoL197Mix9L2csICdfJylcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBDb252ZXJ0IHRoZSBwcm92aWRlZCBgc3RyaW5nYCBgdmFsdWVgIGludG8gW2tlYmFiLWNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0tlYmFiX2Nhc2UpLlxuICpcbiAqICAgVGhlIHByb2Nlc3MgaXMgcm91Z2hseSBhcyBmb2xsb3dzOlxuICogICAxLiBBbnkgY2FwaXRhbGl6ZWQgY2hhcmFjdGVyIHNlcXVlbmNlIGlzIHByZWZpeGVkIGJ5IGEgaHlwaGVuLlxuICogICAyLiBNb3JlIHRoYW4gb25lIHNlcXVlbnRpYWwgaHlwaGVucyBhcmUgY29udmVydGVkIGludG8gYSBzaW5nbGUgaHlwaGVuLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byB0dXJuIGludG8gW2tlYmFiLWNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0tlYmFiX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLnRvS2ViYWJDYXNlKCdUaGlzSXNBU2VudGVuY2UnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0aGlzLWlzLWEtc2VudGVuY2UnXG4gKiAgICAgYGBgXG4gKi9cblxuY29uc3QgSVNfTEFTVF9DSEFSX1VQUEVSQ0FTRSA9IC9bQS1aXSQvO1xuZXhwb3J0IGZ1bmN0aW9uIHRvS2ViYWJDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvW0EtWl1bYS16XSt8W0EtWl17Mix9L2csIChtLCBvZmZzZXQpID0+IHtcbiAgICAgIGlmIChtLmxlbmd0aCA+IDEgJiYgSVNfTEFTVF9DSEFSX1VQUEVSQ0FTRS50ZXN0KG0pKVxuICAgICAgICByZXR1cm4gKGAkeyhvZmZzZXQpID8gJy0nIDogJyd9JHttLnNsaWNlKDAsIC0xKX0tJHttLnNsaWNlKC0xKX1gKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICByZXR1cm4gKChvZmZzZXQpID8gYC0ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC8tezIsfS9nLCAnLScpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRG8gb3VyIGJlc3QgdG8gZW11bGF0ZSBbcHJvY2Vzcy5uZXh0VGlja10oaHR0cHM6Ly9ub2RlanMub3JnL2VuL2d1aWRlcy9ldmVudC1sb29wLXRpbWVycy1hbmQtbmV4dHRpY2svI3Byb2Nlc3NuZXh0dGljaylcbiAqICAgaW4gdGhlIGJyb3dzZXIuXG4gKlxuICogICBJbiBvcmRlciB0byB0cnkgYW5kIGVtdWxhdGUgYHByb2Nlc3MubmV4dFRpY2tgLCB0aGlzIGZ1bmN0aW9uIHdpbGwgdXNlIGBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBjYWxsYmFjaygpKWAgaWYgYXZhaWxhYmxlLFxuICogICBvdGhlcndpc2UgaXQgd2lsbCBmYWxsYmFjayB0byB1c2luZyBgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjaylgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGNhbGxiYWNrXG4gKiAgICAgZGF0YVR5cGU6IGZ1bmN0aW9uXG4gKiAgICAgZGVzYzogQ2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCBvbiBcIm5leHRUaWNrXCIuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgZnVuY3Rpb24gd2lsbCBwcmVmZXIgYW5kIHVzZSBgcHJvY2Vzcy5uZXh0VGlja2AgaWYgaXQgaXMgYXZhaWxhYmxlIChpLmUuIGlmIHJ1bm5pbmcgb24gTm9kZUpTKS5cbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFRoaXMgZnVuY3Rpb24gaXMgdW5saWtlbHkgdG8gYWN0dWFsbHkgYmUgdGhlIG5leHQgXCJ0aWNrXCIgb2YgdGhlIHVuZGVybHlpbmdcbiAqICAgICBqYXZhc2NyaXB0IGVuZ2luZS4gVGhpcyBtZXRob2QganVzdCBkb2VzIGl0cyBiZXN0IHRvIGVtdWxhdGUgXCJuZXh0VGlja1wiLiBJbnN0ZWFkIG9mIHRoZVxuICogICAgIGFjdHVhbCBcIm5leHQgdGlja1wiLCB0aGlzIHdpbGwgaW5zdGVhZCBiZSBcImFzIGZhc3QgYXMgcG9zc2libGVcIi5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgZnVuY3Rpb24gZGVsaWJlcmF0ZWx5IGF0dGVtcHRzIHRvIHVzZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBmaXJzdC0tZXZlbiB0aG91Z2ggaXQgbGlrZWx5IGRvZXNuJ3RcbiAqICAgICBoYXZlIHRoZSBmYXN0ZXN0IHR1cm4tYXJvdW5kLXRpbWUtLXRvIHNhdmUgYmF0dGVyeSBwb3dlci4gVGhlIGlkZWEgYmVpbmcgdGhhdCBcInNvbWV0aGluZyBuZWVkcyB0byBiZSBkb25lICpzb29uKlwiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBJU19OVU1CRVIgPSAvXihbLStdPykoXFxkKig/OlxcLlxcZCspPykoZVstK11cXGQrKT8kLztcbmNvbnN0IElTX0JPT0xFQU4gPSAvXih0cnVlfGZhbHNlKSQvO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvZXJjZSBhIHN0cmluZyB0byBpdHMgbW9zdCBsaWtlbHkgdW5kZXJseWluZyBwcmltaXRpdmUgdHlwZS5cbiAqXG4gKiAgIENvbnZlcnNpb24gaW5wdXQgYW5kIG91dHB1dCB0YWJsZTpcbiAqICAgKiBgJ251bGwnYCBjb252ZXJ0cyB0byBgbnVsbGBcbiAqICAgKiBgJ3VuZGVmaW5lZCdgIGNvbnZlcnRzIHRvIGB1bmRlZmluZWRgXG4gKiAgICogYCdOYU4nYCBjb252ZXJ0cyB0byBgTmFOYFxuICogICAqIGAnSW5maW5pdHknYCBjb252ZXJ0cyB0byBgSW5maW5pdHlgXG4gKiAgICogYCctSW5maW5pdHknYCBjb252ZXJ0cyB0byBgLUluZmluaXR5YFxuICogICAqIGAndHJ1ZSdgIGNvbnZlcnRzIHRvIGB0cnVlYFxuICogICAqIGAnZmFsc2UnYCBjb252ZXJ0cyB0byBgZmFsc2VgXG4gKiAgICogQW55IHBhcnNhYmxlIG51bWVyaWMgc3RyaW5nIHZhbHVlIChpbmNsdWRpbmcgW0Ugbm90YXRpb25dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NjaWVudGlmaWNfbm90YXRpb24jRV9ub3RhdGlvbikpIGNvbnZlcnRzIHRvIGBudW1iZXJgXG4gKlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFZhbHVlIHRvIGNvbnZlcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ05hTicpXG4gICAgcmV0dXJuIE5hTjtcblxuICBpZiAodmFsdWUgPT09ICdJbmZpbml0eScgfHwgdmFsdWUgPT09ICcrSW5maW5pdHknKVxuICAgIHJldHVybiBJbmZpbml0eTtcblxuICBpZiAodmFsdWUgPT09ICctSW5maW5pdHknKVxuICAgIHJldHVybiAtSW5maW5pdHk7XG5cbiAgaWYgKElTX05VTUJFUi50ZXN0KHZhbHVlKSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG5cbiAgaWYgKElTX0JPT0xFQU4udGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gJ3RydWUnKTtcblxuICByZXR1cm4gdmFsdWU7XG59XG4iLCJpbXBvcnQge1xuICBNWVRISVhfVFlQRSxcbiAgTVlUSElYX1VJX0NPTVBPTkVOVF9UWVBFLFxuICBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQsXG4gIE1ZVEhJWF9TSEFET1dfUEFSRU5ULFxuICBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyxcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyAgIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG4vKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29tcG9uZW50c1xuICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gKiBkZXNjOiB8XG4gKiAgIGBpbXBvcnQgeyBDb21wb25lbnRzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBDb21wb25lbnQgYW5kIGZyYW1ld29yayBjbGFzc2VzIGFuZCBmdW5jdGlvbmFsaXR5IGFyZSBmb3VuZCBoZXJlLlxuICogcHJvcGVydGllczpcbiAqICAgLSBuYW1lOiBpc015dGhpeENvbXBvbmVudFxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIHN5bWJvbCBpcyB1c2VkIGFzIGFuIGluc3RhbmNlIGtleSBmb3IgQHNlZSBNeXRoaXhVSUNvbXBvbmVudDsgaW5zdGFuY2VzLlxuICpcbiAqICAgICAgIEZvciBzdWNoIGluc3RhbmNlcywgYWNjZXNzaW5nIHRoaXMgcHJvcGVydHkgc2ltcGx5IHJldHVybnMgYHRydWVgLCBhbGxvd2luZyB0aGUgY2FsbGVyXG4gKiAgICAgICB0byBrbm93IGlmIGEgc3BlY2lmaWMgaW5zdGFuY2UgKEVsZW1lbnQpIGlzIGEgTXl0aGl4IFVJIGNvbXBvbmVudC5cbiAqL1xuXG5leHBvcnQgY29uc3QgaXNNeXRoaXhDb21wb25lbnQgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2lzLW15dGhpeC1jb21wb25lbnQnKTsgLy8gQHJlZjpDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XG5cbmNvbnN0IElTX0FUVFJfTUVUSE9EX05BTUUgICA9IC9eYXR0clxcJCguKikkLztcbmNvbnN0IFJFR0lTVEVSRURfQ09NUE9ORU5UUyA9IG5ldyBTZXQoKTtcblxuLyoqKlxuICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gKiBkZXNjOiB8XG4gKiAgIFRoaXMgdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIE15dGhpeCBVSSBjb21wb25lbnRzLiBJdCBpbmhlcml0c1xuICogICBmcm9tIEhUTUxFbGVtZW50LCBhbmQgc28gd2lsbCBlbmQgdXAgYmVpbmcgYSBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKS5cbiAqXG4gKiAgIEl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91IGZ1bGx5IHJlYWQgdXAgYW5kIHVuZGVyc3RhbmRcbiAqICAgW1dlYiBDb21wb25lbnRzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpXG4gKiAgIGlmIHlvdSBkb24ndCBhbHJlYWR5IGZ1bGx5IHVuZGVyc3RhbmQgdGhlbS4gVGhlIGNvcmUgb2YgTXl0aGl4IFVJIGlzIHRoZVxuICogICBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKSBzdGFuZGFyZCxcbiAqICAgc28geW91IG1pZ2h0IGVuZCB1cCBhIGxpdHRsZSBjb25mdXNlZCBpZiB5b3UgZG9uJ3QgYWxyZWFkeSB1bmRlcnN0YW5kIHRoZSBmb3VuZGF0aW9uLlxuICpcbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gY2FwdGlvbjogXCIuLi4gSFRNTEVsZW1lbnQgSW5zdGFuY2UgUHJvcGVydGllc1wiXG4gKiAgICAgZGVzYzogXCJBbGwgW0hUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzKSBhcmUgaW5oZXJpdGVkIGZyb20gW0hUTUxFbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQpXCJcbiAqICAgICBsaW5rOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQjaW5zdGFuY2VfcHJvcGVydGllc1xuICpcbiAqICAgLSBuYW1lOiBpc015dGhpeENvbXBvbmVudFxuICogICAgIGRhdGFUeXBlOiBib29sZWFuXG4gKiAgICAgY2FwdGlvbjogXCJbc3RhdGljIE15dGhpeFVJQ29tcG9uZW50LmlzTXl0aGl4Q29tcG9uZW50XVwiXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgSXMgYHRydWVgIGZvciBNeXRoaXggVUkgY29tcG9uZW50cy5cbiAqICAgLSBuYW1lOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGNhcHRpb246IHNlbnNpdGl2ZVRhZ05hbWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBXb3JrcyBpZGVudGljYWxseSB0byBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSBmb3IgWE1MLCB3aGVyZSBjYXNlIGlzIHByZXNlcnZlZC5cbiAqICAgICAgIEluIEhUTUwgdGhpcyB3b3JrcyBsaWtlIFtFbGVtZW50LnRhZ05hbWVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3RhZ05hbWUpLCBidXQgaW5zdGVhZCBvZiB0aGUgcmVzdWx0XG4gKiAgICAgICBhbHdheXMgYmVpbmcgVVBQRVJDQVNFLCB0aGUgdGFnIG5hbWUgd2lsbCBiZSByZXR1cm5lZCB3aXRoIHRoZSBjYXNpbmcgcHJlc2VydmVkLlxuICogICAtIG5hbWU6IHRlbXBsYXRlSURcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgY2FwdGlvbjogdGVtcGxhdGVJRFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlIHZhbHVlIG9mIGB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lEYFxuICogICAtIG5hbWU6IGRlbGF5VGltZXJzXG4gKiAgICAgZGF0YVR5cGU6IFwiTWFwJmx0O3N0cmluZywgUHJvbWlzZSZndDtcIlxuICogICAgIGNhcHRpb246IGRlbGF5VGltZXJzXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgQSBNYXAgaW5zdGFuY2UgdGhhdFxuICogICAgICAgcmV0YWlucyBgc2V0VGltZW91dGAgaWRzIHNvIHRoYXQgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5kZWJvdW5jZTsgY2FuIHByb3Blcmx5IGZ1bmN0aW9uLiBLZXlzIGFyZSBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAgICAgdGltZXIgaWRzIChvZiB0eXBlIGBzdHJpbmdgKS4gVmFsdWVzIGFyZSBQcm9taXNlIGluc3RhbmNlcy5cbiAqICAgICAgIEVhY2ggcHJvbWlzZSBpbnN0YW5jZSBhbHNvIGhhcyBhIHNwZWNpYWwga2V5IGB0aW1lcklEYCB0aGF0IGNvbnRhaW5zIGEgYHNldFRpbWVvdXRgIGlkIG9mIGEgamF2YXNjcmlwdCB0aW1lci5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAtIG5hbWU6IHNoYWRvd1xuICogICAgIGRhdGFUeXBlOiBcIltTaGFkb3dSb290XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2hhZG93Um9vdClcIlxuICogICAgIGNhcHRpb246IHNoYWRvd1xuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBzaGFkb3cgcm9vdCBvZiB0aGlzIGNvbXBvbmVudCAob3IgYG51bGxgIGlmIG5vbmUpLlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSBUaGlzIGlzIHRoZSBjYWNoZWQgcmVzdWx0IG9mIGNhbGxpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5jcmVhdGVTaGFkb3dET007IHdoZW5cbiAqICAgICAgICAgdGhlIGNvbXBvbmVudCBpcyBmaXJzdCBpbml0aWFsaXplZC5cbiAqICAgLSBuYW1lOiB0ZW1wbGF0ZVxuICogICAgIGRhdGFUeXBlOiBcIlt0ZW1wbGF0ZSBlbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvdGVtcGxhdGUpXCJcbiAqICAgICBjYXB0aW9uOiB0ZW1wbGF0ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBbdGVtcGxhdGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC90ZW1wbGF0ZSkgZWxlbWVudCBmb3IgdGhpc1xuICogICAgICAgY29tcG9uZW50LCBvciBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gdGVtcGxhdGUgZm91bmQgZm9yIHRoZSBjb21wb25lbnQuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIFRoaXMgaXMgdGhlIGNhY2hlZCByZXN1bHQgb2YgY2FsbGluZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmdldENvbXBvbmVudFRlbXBsYXRlOyB3aGVuXG4gKiAgICAgICAgIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgaW5pdGlhbGl6ZWQuXG4qKiovXG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBNWVRISVhfVUlfQ09NUE9ORU5UX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBzdGF0aWMgY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudDtcbiAgc3RhdGljIHJlZ2lzdGVyID0gZnVuY3Rpb24oX25hbWUsIF9LbGFzcykge1xuICAgIGxldCBuYW1lID0gX25hbWUgfHwgdGhpcy50YWdOYW1lIHx8IEJhc2VVdGlscy50b0tlYmFiQ2FzZSh0aGlzLm5hbWUpO1xuXG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpIHtcbiAgICAgIGxldCBLbGFzcyA9IF9LbGFzcyB8fCB0aGlzO1xuXG4gICAgICBsZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAoS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzIHx8IFtdKS5jb25jYXQoS2xhc3MuY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMoS2xhc3MpKSxcbiAgICAgICAgKSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMubGVuZ3RoID4gMClcbiAgICAgICAgS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gb2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVnaXN0ZXJFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc3RhdGljIGNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24oS2xhc3MpIHtcbiAgICBjb25zdCBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzID0gKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSkgPT4ge1xuICAgICAgaWYgKFJFR0lTVEVSRURfQ09NUE9ORU5UUy5oYXMoS2xhc3MpKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCB7IGRlc2NyaXB0b3IgfSA9IFV0aWxzLmdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4ocHJvdG8sIG9yaWdpbmFsTmFtZSk7XG4gICAgICBpZiAoIWRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhpcyBmcm9tXG4gICAgICAvLyB0aGUgcHJvdG90eXBlLCBhcyBjaGlsZCBjbGFzc2VzIHdpbGxcbiAgICAgIC8vIHdhbnQgdG8gaW5oZXJpdCBhdHRyaWJ1dGUgYmVoYXZpb3IuXG4gICAgICAvLyBkZWxldGUgcHJvdG90eXBlW29yaWdpbmFsTmFtZV07XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGUgdXNlciBkaWQgaXQgd3JvbmcuLi5cbiAgICAgIC8vIHNvIGp1c3QgbWFrZSBpdCB0aGUgXCJzZXR0ZXJcIlxuICAgICAgbGV0IHNldHRlciAgICA9IGRlc2NyaXB0b3Iuc2V0IHx8IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICBsZXQgZ2V0dGVyICAgID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICBsZXQgaGFzU2V0dGVyID0gKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgICAgbGV0IGhhc0dldHRlciA9ICh0eXBlb2YgZ2V0dGVyID09PSAnZnVuY3Rpb24nKTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvdG8sIHtcbiAgICAgICAgW3Byb3BlcnR5TmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChoYXNHZXR0ZXIpID8gZ2V0dGVyLmNhbGwodGhpcykgOiB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXR0cihhdHRyaWJ1dGVOYW1lLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNTZXR0ZXIpXG4gICAgICAgICAgICAgIHNldHRlci5jYWxsKHRoaXMsIFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IHByb3RvICAgICAgICAgICA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gVXRpbHMuZ2V0QWxsUHJvcGVydHlOYW1lcyhwcm90bylcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IElTX0FUVFJfTUVUSE9EX05BTUUudGVzdChuYW1lKSlcbiAgICAgIC5tYXAoKG9yaWdpbmFsTmFtZSkgPT4ge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lICA9IG9yaWdpbmFsTmFtZS5tYXRjaChJU19BVFRSX01FVEhPRF9OQU1FKVsxXTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBCYXNlVXRpbHMudG9LZWJhYkNhc2UocHJvcGVydHlOYW1lKTtcblxuICAgICAgICBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhdHRyaWJ1dGVOYW1lcykpO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGFkZGVkIHRvIHRoZSBET00uXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25BZGRlZCgpIHt9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBtdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGF0YVR5cGVzOiBNdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgTXV0YXRpb25SZWNvcmQgaW5zdGFuY2UgdGhhdCB0aGF0IGNhdXNlZCB0aGlzIG1ldGhvZCB0byBiZSBjYWxsZWQuXG4gICAqL1xuICBvbk11dGF0aW9uUmVtb3ZlZCgpIHt9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiBhbiBlbGVtZW50IGlzIGFkZGVkIGFzIGEgY2hpbGQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5vZGVcbiAgICogICAgIGRhdGFUeXBlczogRWxlbWVudFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgY2hpbGQgZWxlbWVudCBiZWluZyBhZGRlZC5cbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIGEgY2hpbGQgZWxlbWVudCBpcyByZW1vdmVkLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBub2RlXG4gICAqICAgICBkYXRhVHlwZXM6IEVsZW1lbnRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIGNoaWxkIGVsZW1lbnQgYmVpbmcgcmVtb3ZlZC5cbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25DaGlsZFJlbW92ZWQoKSB7fVxuXG4gIHN0YXRpYyBpc015dGhpeENvbXBvbmVudCA9IGlzTXl0aGl4Q29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSxcbiAgICAgIH0sXG4gICAgICBbaXNNeXRoaXhDb21wb25lbnRdOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuaXNNeXRoaXhDb21wb25lbnRcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBpc015dGhpeENvbXBvbmVudCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBVdGlscy5iaW5kTWV0aG9kcy5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlIC8qLCBbIEhUTUxFbGVtZW50LnByb3RvdHlwZSBdKi8pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NlbnNpdGl2ZVRhZ05hbWUnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuc2Vuc2l0aXZlVGFnTmFtZVxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gKCh0aGlzLnByZWZpeCkgPyBgJHt0aGlzLnByZWZpeH06JHt0aGlzLmxvY2FsTmFtZX1gIDogdGhpcy5sb2NhbE5hbWUpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZUlEJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LnRlbXBsYXRlSURcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSUQsXG4gICAgICB9LFxuICAgICAgJ2RlbGF5VGltZXJzJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LmRlbGF5VGltZXJzXG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBuZXcgTWFwKCksXG4gICAgICB9LFxuICAgICAgJ2RvY3VtZW50SW5pdGlhbGl6ZWQnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuZG9jdW1lbnRJbml0aWFsaXplZFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVEKSxcbiAgICAgICAgc2V0OiAgICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQsICEhdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzaGFkb3cnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuc2hhZG93XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY3JlYXRlU2hhZG93RE9NKCksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgZ2V0dGluZyBhbmQgc2V0dGluZyBhdHRyaWJ1dGVzLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZFxuICAgKiAgIHRvIHRoaXMgbWV0aG9kLCB0aGVuIGl0IHdpbGwgYWN0IGFzIGEgZ2V0dGVyLCBnZXR0aW5nIHRoZSBhdHRyaWJ1dGUgc3BlY2lmaWVkIGJ5IG5hbWUuXG4gICAqXG4gICAqICAgSWYgaG93ZXZlciB0d28gb3IgbW9yZSBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCB0aGVuIHRoaXMgaXMgYW4gYXR0cmlidXRlIHNldHRlci5cbiAgICpcbiAgICogICBJZiB0aGUgcHJvdmlkZWQgdmFsdWUgaXMgYHVuZGVmaW5lZGAsIGBudWxsYCwgb3IgYGZhbHNlYCwgdGhlbiB0aGUgYXR0cmlidXRlIHdpbGwgYmVcbiAgICogICByZW1vdmVkLlxuICAgKlxuICAgKiAgIElmIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBgdHJ1ZWAsIHRoZW4gdGhlIGF0dHJpYnV0ZSdzIHZhbHVlIHdpbGwgYmUgc2V0IHRvIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKlxuICAgKiAgIEFueSBvdGhlciB2YWx1ZSBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgYW5kIHNldCBhcyB0aGUgYXR0cmlidXRlJ3MgdmFsdWUuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5hbWVcbiAgICogICAgIGRhdGFUeXBlczogc3RyaW5nXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgdG8gb3BlcmF0ZSBvbi5cbiAgICogICAtIG5hbWU6IHZhbHVlXG4gICAqICAgICBkYXRhVHlwZXM6IGFueVxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBJZiBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgZmFsc2VgLCByZW1vdmUgdGhlIG5hbWVkIGF0dHJpYnV0ZS5cbiAgICogICAgICAgSWYgYHRydWVgLCBzZXQgdGhlIG5hbWVkIGF0dHJpYnV0ZSdzIHZhbHVlIHRvIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKiAgICAgICBGb3IgYW55IG90aGVyIHZhbHVlLCBmaXJzdCBjb252ZXJ0IGl0IGludG8gYSBzdHJpbmcsIGFuZCB0aGVuIHNldCB0aGUgbmFtZWQgYXR0cmlidXRlJ3MgdmFsdWUgdG8gdGhlIHJlc3VsdGluZyBzdHJpbmcuXG4gICAqIHJldHVybjogfFxuICAgKiAgIDEuIEB0eXBlcyBzdHJpbmc7IElmIGEgc2luZ2xlIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGVuIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBuYW1lZCBhdHRyaWJ1dGUuXG4gICAqICAgMi4gQHR5cGVzIHRoaXM7IElmIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gc2V0IHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlIHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUsXG4gICAqICAgICAgYW5kIHJldHVybiBgdGhpc2AgKHRvIGFsbG93IGZvciBjaGFpbmluZykuXG4gICAqL1xuICBhdHRyKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCAodmFsdWUgPT09IHRydWUpID8gJycgOiAoJycgKyB2YWx1ZSkpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEluamVjdCBhIG5ldyBzdHlsZSBzaGVldCB2aWEgYSBgPHN0eWxlPmAgZWxlbWVudCBkeW5hbWljYWxseSBhdCBydW4tdGltZS5cbiAgICpcbiAgICogICBUaGlzIG1ldGhvZCBhbGxvd3MgdGhlIGNhbGxlciB0byBpbmplY3QgZHluYW1pYyBzdHlsZXMgYXQgcnVuLXRpbWUuXG4gICAqICAgSXQgd2lsbCBvbmx5IGluamVjdCB0aGUgc3R5bGVzIG9uY2UsIG5vIG1hdHRlciBob3cgbWFueSB0aW1lcyB0aGVcbiAgICogICBtZXRob2QgaXMgY2FsbGVkLS1hcyBsb25nIGFzIHRoZSBzdHlsZSBjb250ZW50IGl0c2VsZiBkb2Vzbid0IGNoYW5nZS5cbiAgICpcbiAgICogICBUaGUgY29udGVudCBpcyBoYXNoZWQgdmlhIFNIQTI1NiwgYW5kIHRoZSBoYXNoIGlzIHVzZWQgYXMgdGhlIHN0eWxlIHNoZWV0IGlkLiBUaGlzXG4gICAqICAgYWxsb3dzIHlvdSB0byBjYWxsIHRoZSBtZXRob2QgaW5zaWRlIGEgY29tcG9uZW50J3MgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tb3VudGVkO1xuICAgKiAgIG1ldGhvZCwgd2l0aG91dCBuZWVkaW5nIHRvIHdvcnJ5IGFib3V0IGR1cGxpY2F0aW5nIHRoZSBzdHlsZXMgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogY29udGVudFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIENTUyBzdHlsZXNoZWV0IGNvbnRlbnQgdG8gaW5qZWN0IGludG8gYSBgPHN0eWxlPmAgZWxlbWVudC4gVGhpcyBjb250ZW50IGlzXG4gICAqICAgICAgIHVzZWQgdG8gZ2VuZXJhdGUgYW4gYGlkYCBmb3IgdGhlIGA8c3R5bGU+YCBlbGVtZW50LCBzbyB0aGF0IGl0IG9ubHkgZ2V0cyBhZGRlZFxuICAgKiAgICAgICB0byB0aGUgYGRvY3VtZW50YCBvbmNlLlxuICAgKiAgIC0gbmFtZTogbWVkaWFcbiAgICogICAgIGRhdGFUeXBlczogc3RyaW5nXG4gICAqICAgICBkZWZhdWx0OiBcIidzY3JlZW4nXCJcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFdoYXQgdG8gc2V0IHRoZSBgbWVkaWFgIGF0dHJpYnV0ZSBvZiB0aGUgY3JlYXRlZCBgPHN0eWxlPmAgZWxlbWVudCB0by4gRGVmYXVsdHNcbiAgICogICAgICAgdG8gYCdzY3JlZW4nYC5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogSXQgaXMgb2Z0ZW4gYmV0dGVyIHRvIHNpbXBseSBhZGQgYSBgPHN0eWxlPmAgZWxlbWVudCB0byB5b3VyIGNvbXBvbmVudCdzIEhUTUwgdGVtcGxhdGUuXG4gICAqICAgICBIb3dldmVyLCBzb21ldGltZXMgdHJ1bHkgZHluYW1pYyBzdHlsZXMgYXJlIG5lZWRlZCwgd2hlcmUgdGhlIGNvbnRlbnQgd29uJ3QgYmUga25vd25cbiAgICogICAgIHVudGlsIHJ1bnRpbWUuIFRoaXMgaXMgdGhlIHByb3BlciB1c2UgY2FzZSBmb3IgdGhpcyBtZXRob2QuXG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogUGxlYXNlIGVkdWNhdGVkIHlvdXJzZWxmICh1bmxpa2UgcGVvcGxlIHdobyBsb3ZlIFJlYWN0KSBhbmQgZG8gbm90IG92ZXJ1c2UgZHluYW1pYyBvciBpbmxpbmUgc3R5bGVzLlxuICAgKiAgICAgV2hpbGUgdGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBjZXJ0YWlubHkgYSBzdGVwIGFib3ZlIGlubGluZSBzdHlsZXMsIHRoaXMgbWV0aG9kIGhhc1xuICAgKiAgICAgW2dyZWF0IHBvdGVudGlhbCB0byBjYXVzZSBoYXJtXShodHRwczovL3dvcmxkb2ZkZXYuaW5mby82LXJlYXNvbnMtd2h5LXlvdS1zaG91bGRudC1zdHlsZS1pbmxpbmUvKVxuICAgKiAgICAgYW5kIHNwcmVhZCB5b3VyIG93biBpZ25vcmFuY2UgdG8gb3RoZXJzLiBVc2Ugd2l0aCAqKkNBUkUqKiFcbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIEVsZW1lbnQ7IFRoZSBgPHN0eWxlPmAgZWxlbWVudCBmb3IgdGhlIHNwZWNpZmllZCBzdHlsZS5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gICAqXG4gICAqICAgICBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgICogICAgICAgc3RhdGljIHRhZ05hbWUgPSAnbXktY29tcG9uZW50JztcbiAgICpcbiAgICogICAgICAgLy8gLi4uXG4gICAqXG4gICAqICAgICAgIG1vdW50ZWQoKSB7XG4gICAqICAgICAgICAgbGV0IHsgc2lkZWJhcldpZHRoIH0gPSB0aGlzLmxvYWRVc2VyUHJlZmVyZW5jZXMoKTtcbiAgICogICAgICAgICB0aGlzLmluamVjdFN0eWxlU2hlZXQoYG5hdi5zaWRlYmFyIHsgd2lkdGg6ICR7c2lkZWJhcldpZHRofXB4OyB9YCwgJ3NjcmVlbicpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqXG4gICAqICAgICBNeUNvbXBvbmVudC5yZWdpc3RlcigpO1xuICAgKiAgICAgYGBgXG4gICAqL1xuICBpbmplY3RTdHlsZVNoZWV0KGNvbnRlbnQsIG1lZGlhID0gJ3NjcmVlbicpIHtcbiAgICBsZXQgc3R5bGVJRCAgICAgICA9IGBJRFNUWUxFJHtCYXNlVXRpbHMuU0hBMjU2KGAke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fToke21lZGlhfWApfWA7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHN0eWxlRWxlbWVudCAgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKTtcblxuICAgIGlmIChzdHlsZUVsZW1lbnQpXG4gICAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuXG4gICAgc3R5bGVFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICBpZiAobWVkaWEpXG4gICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdtZWRpYScsIG1lZGlhKTtcblxuICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50cyhub2RlLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gICAgaWYgKCFvcHRpb25zLnNjb3BlKVxuICAgICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2NvcGU6IHRoaXMuJCQgfTtcblxuICAgIHJldHVybiBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXRDaGlsZHJlbkFzRnJhZ21lbnQobm9FbXB0eVJlc3VsdCkge1xuICAgIGxldCBoYXNDb250ZW50ICAgID0gZmFsc2U7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHRlbXBsYXRlICAgICAgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIHJldHVybiAobm9FbXB0eVJlc3VsdCkgPyB1bmRlZmluZWQgOiB0ZW1wbGF0ZTtcblxuICAgIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgbm9kZSA9IHRoaXMuY2hpbGROb2Rlc1swXTtcbiAgICAgIGlmICghKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIEJhc2VVdGlscy5pc05PRShub2RlLm5vZGVWYWx1ZSkpKVxuICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKG5vRW1wdHlSZXN1bHQgJiYgIWhhc0NvbnRlbnQpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEdldCB0aGUgcGFyZW50IE5vZGUgb2YgdGhpcyBlbGVtZW50LlxuICAgKlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBVbmxpa2UgW05vZGUucGFyZW50Tm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSksIHRoaXNcbiAgICogICAgIHdpbGwgYWxzbyBzZWFyY2ggYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcy5cbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiAqKlNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIG9ubHkgd29ya3MgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzISoqXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgaXMgYWNjb21wbGlzaGVkIHZpYSBsZXZlcmFnaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE7IGZvclxuICAgKiAgICAgYHRoaXNgIGNvbXBvbmVudC4gV2hlbiBhIGBudWxsYCBwYXJlbnQgaXMgZW5jb3VudGVyZWQsIGBnZXRQYXJlbnROb2RlYCB3aWxsIGxvb2sgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9TSEFET1dfUEFSRU5UO1xuICAgKiAgICAgb24gYHRoaXNgLiBJZiBmb3VuZCwgdGhlIHJlc3VsdCBpcyBjb25zaWRlcmVkIHRoZSBbcGFyZW50IE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpIG9mIGB0aGlzYCBjb21wb25lbnQuXG4gICAqICAgLSB8XG4gICAqICAgICA6ZXllOiBUaGlzIGlzIGp1c3QgYSB3cmFwcGVyIGZvciBAc2VlIFV0aWxzLmdldFBhcmVudE5vZGU7LlxuICAgKlxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgTm9kZTsgVGhlIHBhcmVudCBub2RlLCBpZiB0aGVyZSBpcyBhbnksIG9yIGBudWxsYCBvdGhlcndpc2UuXG4gICAqL1xuICBnZXRQYXJlbnROb2RlKCkge1xuICAgIHJldHVybiBVdGlscy5nZXRQYXJlbnROb2RlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBUaGlzIGlzIGEgcmVwbGFjZW1lbnQgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KVxuICAgKiAgIHdpdGggb25lIG5vdGFibGUgZGlmZmVyZW5jZTogSXQgcnVucyBNeXRoaXggVUkgZnJhbWV3b3JrIHNwZWNpZmljIGNvZGUgYWZ0ZXIgYSBzaGFkb3cgaXMgYXR0YWNoZWQuXG4gICAqXG4gICAqICAgQ3VycmVudGx5LCB0aGUgbWV0aG9kIGNvbXBsZXRlcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XG4gICAqICAgMS4gQ2FsbCBgc3VwZXIuYXR0YWNoU2hhZG93KG9wdGlvbnMpYCB0byBhY3R1YWxseSBhdHRhY2ggYSBTaGFkb3cgRE9NXG4gICAqICAgMi4gQXNzaWduIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsgdG8gdGhlIHJlc3VsdGluZyBgc2hhZG93YCwgdXNpbmcgdGhlIGtleSBgQ29uc3RhbnRzLk1ZVEhJWF9TSEFET1dfUEFSRU5UYCwgYW5kIHZhbHVlIG9mIGB0aGlzYC4gQHNvdXJjZVJlZiBfc2hhZG93TWV0YWRhdGFBc3NpZ25tZW50OyBUaGlzIGFsbG93cyBAc2VlIGdldFBhcmVudE5vZGU7IHRvIGxhdGVyIGZpbmQgdGhlIHBhcmVudCBvZiB0aGUgc2hhZG93LlxuICAgKiAgIDMuIGByZXR1cm4gc2hhZG93YFxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBkYXRhVHlwZXM6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBbb3B0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I29wdGlvbnMpIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdylcbiAgICogbm90ZXM6XG4gICAqICAgLSBUaGlzIGlzIGp1c3QgYSB3cmFwcGVyIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdykgdGhhdCBleGVjdXRlc1xuICAgKiAgICAgY3VzdG9tIGZyYW1ld29yayBmdW5jdGlvbmFsaXR5IGFmdGVyIHRoZSBgc3VwZXJgIGNhbGwuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBTaGFkb3dSb290OyBUaGUgU2hhZG93Um9vdCBpbnN0YW5jZSBjcmVhdGVkIGJ5IFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KS5cbiAgICovXG4gIGF0dGFjaFNoYWRvdyhvcHRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZW52aXJvbm1lbnQgc3VwcG9ydFxuICAgIGlmICh0eXBlb2Ygc3VwZXIuYXR0YWNoU2hhZG93ICE9PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhvcHRpb25zKTtcbiAgICBVdGlscy5tZXRhZGF0YShzaGFkb3csIE1ZVEhJWF9TSEFET1dfUEFSRU5ULCB0aGlzKTsgLy8gQHJlZjpfc2hhZG93TWV0YWRhdGFBc3NpZ25tZW50XG5cbiAgICByZXR1cm4gc2hhZG93O1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBIHN0dWIgZm9yIGRldmVsb3BlcnMgdG8gY29udHJvbCB0aGUgU2hhZG93IERPTSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiAgIEJ5IGRlZmF1bHQsIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IGNhbGwgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5hdHRhY2hTaGFkb3c7IGluIGBcIm9wZW5cImAgYG1vZGVgLlxuICAgKlxuICAgKiAgIERldmVsb3BlcnMgY2FuIG92ZXJsb2FkIHRoaXMgdG8gZG8gbm90aGluZyAoaGF2ZSBubyBTaGFkb3cgRE9NIGZvciBhIHNwZWNpZmljIGNvbXBvbmVudCBmb3IgZXhhbXBsZSksXG4gICAqICAgb3IgdG8gZG8gc29tZXRoaW5nIGVsc2UsIHN1Y2ggYXMgc3BlY2lmeSB0aGV5IHdvdWxkIGxpa2UgdGhlaXIgY29tcG9uZW50IHRvIGJlIGluIGBcImNsb3NlZFwiYCBgbW9kZWAuXG4gICAqXG4gICAqICAgVGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBhc3NpZ25lZCB0byBgdGhpcy5zaGFkb3dgIGluc2lkZSB0aGUgYGNvbnN0cnVjdG9yYCBvZiB0aGUgY29tcG9uZW50LlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBkYXRhVHlwZXM6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBbb3B0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I29wdGlvbnMpIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdylcbiAgICogbm90ZXM6XG4gICAqICAgLSBBbGwgdGhpcyBkb2VzIGlzIGNhbGwgYHRoaXMuYXR0YWNoU2hhZG93YC4gSXRzIHB1cnBvc2UgaXMgZm9yIHRoZSBkZXZlbG9wZXIgdG8gY29udHJvbFxuICAgKiAgICAgd2hhdCBoYXBwZW5zIHdpdGggdGhlIGNvbXBvbmVudCdzIFNoYWRvdyBET00uXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBTaGFkb3dSb290OyBUaGUgU2hhZG93Um9vdCBpbnN0YW5jZSBjcmVhdGVkIGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQuYXR0YWNoU2hhZG93Oy5cbiAgICovXG4gIGNyZWF0ZVNoYWRvd0RPTShvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3Iuc2hhZG93ID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBtZXJnZUNoaWxkcmVuKHRhcmdldCwgLi4ub3RoZXJzKSB7XG4gICAgcmV0dXJuIEVsZW1lbnRzLm1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUobmFtZU9ySUQpIHtcbiAgICBpZiAobmFtZU9ySUQgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgcmV0dXJuIG5hbWVPcklEO1xuXG4gICAgaWYgKCF0aGlzLm93bmVyRG9jdW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAobmFtZU9ySUQpXG4gICAgICByZXR1cm4gRWxlbWVudHMucXVlcnlUZW1wbGF0ZSh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsIG5hbWVPcklEKTtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mb3JdJyk7XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIEFycmF5LmZyb20oZWxlbWVudHMpKSB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNOT0Uoc2VsZWN0b3IpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKCF0aGlzLm1hdGNoZXMoc2VsZWN0b3IpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdGhpcy5zaGFkb3cuYXBwZW5kQ2hpbGQoZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb2Nlc3NlZFRlbXBsYXRlKF90ZW1wbGF0ZSkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoX3RlbXBsYXRlKSB8fCB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzRWxlbWVudHMoKHRlbXBsYXRlLmNvbnRlbnQpID8gdGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiB0ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkpO1xuICB9XG5cbiAgZ2V0UmF3VGVtcGxhdGUoX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZShfdGVtcGxhdGUpIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG8odGFyZ2V0LCBfdGVtcGxhdGUpIHtcbiAgICBpZiAoIXRhcmdldClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGxldCBwcm9jZXNzZWRUZW1wbGF0ZSA9IHRoaXMuZ2V0UHJvY2Vzc2VkVGVtcGxhdGUoX3RlbXBsYXRlKTtcbiAgICBpZiAocHJvY2Vzc2VkVGVtcGxhdGUpIHtcbiAgICAgIC8vIGVuc3VyZURvY3VtZW50U3R5bGVzLmNhbGwodGhpcywgdGhpcy5vd25lckRvY3VtZW50LCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUsIHRlbXBsYXRlKTtcblxuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHByb2Nlc3NlZFRlbXBsYXRlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oX3RlbXBsYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVGVtcGxhdGVUbyh0aGlzLnNoYWRvdywgX3RlbXBsYXRlKTtcbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG5cbiAgICB0aGlzLmFwcGVuZEV4dGVybmFsVG9TaGFkb3dET00oKTtcbiAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oKTtcblxuICAgIHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRoaXMpO1xuXG4gICAgdGhpcy5tb3VudGVkKCk7XG5cbiAgICB0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgQmFzZVV0aWxzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSk7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVubW91bnRlZCgpO1xuICB9XG5cbiAgYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdTcmMpIHtcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyLnVub2JzZXJ2ZSh0aGlzKTtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIW5ld1NyYylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBvYnNlcnZlciA9IHZpc2liaWxpdHlPYnNlcnZlcigoeyB3YXNWaXNpYmxlLCBkaXNjb25uZWN0IH0pID0+IHtcbiAgICAgIGlmICghd2FzVmlzaWJsZSlcbiAgICAgICAgdGhpcy5mZXRjaFNyYyh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJykpO1xuXG4gICAgICBkaXNjb25uZWN0KCk7XG5cbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9LCB7IGVsZW1lbnRzOiBbIHRoaXMgXSB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd2aXNpYmlsaXR5T2JzZXJ2ZXInOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9ic2VydmVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzKSB7XG4gICAgbGV0IFtcbiAgICAgIGF0dHJpYnV0ZU5hbWUsXG4gICAgICBvbGRWYWx1ZSxcbiAgICAgIG5ld1ZhbHVlLFxuICAgIF0gPSBhcmdzO1xuXG4gICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgLy8gU2VjdXJpdHk6IGVuc3VyZSB0aGlzIGlzIGFjdHVhbGx5IGEgaGFuZGxlZCBhdHRyaWJ1dGUgY2FsbCFcbiAgICAgIC8vIFdlIHdvdWxkbid0IGp1c3Qgd2FudCB0byBzdGFydCBzZXR0aW5nIGFueXRoaW5nIG9uIHRoZSBpbnN0YW5jZVxuICAgICAgLy8gdmlhIGF0dHJpYnV0ZXMuLi4gdGhhdCBtaWdodCBiZSBiYWQsIGkuZTogPGltZyB2YWx1ZU9mPVwiXCI+XG5cbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgICAgPSBCYXNlVXRpbHMudG9DYW1lbENhc2UoYXR0cmlidXRlTmFtZSk7XG4gICAgICBsZXQgbWFnaWNOYW1lICAgICAgID0gYGF0dHIkJHtwcm9wZXJ0eU5hbWV9YDtcbiAgICAgIGxldCB7IGRlc2NyaXB0b3IgfSAgPSBVdGlscy5nZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHRoaXMsIG1hZ2ljTmFtZSk7XG4gICAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgICAvLyBDYWxsIHNldHRlclxuICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICBnZXQgJCQoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmNyZWF0ZVNjb3BlKHRoaXMpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpID8gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBhcmdzW2FyZ0luZGV4KytdKSA6IHt9O1xuICAgIGxldCBxdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCB7IHJvb3Q6IHRoaXMsIC4uLm9wdGlvbnMsIGludm9rZUNhbGxiYWNrczogZmFsc2UgfSwgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICAgIGxldCBzaGFkb3dOb2RlcztcblxuICAgIG9wdGlvbnMgPSBxdWVyeUVuZ2luZS5nZXRPcHRpb25zKCk7XG5cbiAgICBpZiAob3B0aW9ucy5zaGFkb3cgIT09IGZhbHNlICYmIG9wdGlvbnMuc2VsZWN0b3IgJiYgb3B0aW9ucy5yb290ID09PSB0aGlzKSB7XG4gICAgICBzaGFkb3dOb2RlcyA9IEFycmF5LmZyb20oXG4gICAgICAgIFF1ZXJ5RW5naW5lLmZyb20uY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIHsgcm9vdDogdGhpcy5zaGFkb3cgfSxcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdG9yLFxuICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2ssXG4gICAgICAgICkudmFsdWVzKCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzaGFkb3dOb2RlcylcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuYWRkKHNoYWRvd05vZGVzKTtcblxuICAgIGlmIChvcHRpb25zLnNsb3R0ZWQgIT09IHRydWUpXG4gICAgICBxdWVyeUVuZ2luZSA9IHF1ZXJ5RW5naW5lLnNsb3R0ZWQoZmFsc2UpO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKSk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIFRoaXMgbWV0aG9kIHdpbGwgZHluYW1pY2FsbHkgYnVpbGQgZWxlbWVudHMsIG9yIHJhdGhlciwgQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLCB0aGF0XG4gICAqICAgZGVmaW5lIGVsZW1lbnRzIHRvIGJlIGNyZWF0ZWQgbGF0ZXIuIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcyBhcmUganVzdCB0aGF0LCBhIHNpbXBsZVxuICAgKiAgIHN0cnVjdHVyZSB0aGF0IGRlZmluZXMgdGhlIG5hbWUsIGF0dHJpYnV0ZXMsIGFuZCBjaGlsZHJlbiBvZiBhbnkgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogICBXaGVuIHRoZXNlIGFyZSBpbnNlcnRlZCBpbnRvIGEgZG9jdW1lbnQsIGVpdGhlciB0aHJvdWdoIGEgQHNlZSBRdWVyeUVuZ2luZTssIG9yIGRpcmVjdGx5IGJ5XG4gICAqICAgY2FsbGluZyBAc2VlIEVsZW1lbnREZWZpbml0aW9uLmJ1aWxkOyBiZWZvcmUgaW5zZXJ0LCB0aGV5IGFyZSBvbmx5IGF0IHRoaXMgcG9pbnQgY29udmVydGVkXG4gICAqICAgaW50byByZWFsIFtFbGVtZW50c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQpIGFuZCBpbnNlcnRlZFxuICAgKiAgIGludG8gdGhlIHNwZWNpZmllZCBET00gKGRvY3VtZW50KSBhdCB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBBIGNhbGxiYWNrIHRoYXQgaXMgaW1tZWRpYXRlbHkgY2FsbGVkIGFuZCBleHBlY3RlZCB0byByZXR1cm4gQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLlxuICAgKiAgICAgICBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggb25seSB0d28gYXJndW1lbnRzLiBUaGUgZmlyc3QgYXJndW1lbnRzLCBgZWxlbWVudHNgLCBpcyBhXG4gICAqICAgICAgIEBzZWUgRWxlbWVudEdlbmVyYXRvcjsgUHJveHkgaW5zdGFuY2UsIHRoYXQgd2lsbCBwcm9wZXJseSBnZW5lcmF0ZSBhbnkgZWxlbWVudCBkZWZpbml0aW9uIHJlcXVlc3RlZC5cbiAgICogICAgICAgVGhlIHNlY29uZCBhcmd1bWVudCwgYGNvbnRleHRgLCBpcyBzaW1wbHkgYW4gZW1wdHkgb2JqZWN0IHByb3ZpZGVkIHRvIHRoZSBjYWxsYmFjaywgYWxsb3dpbmcgdGhlXG4gICAqICAgICAgIGRldmVsb3BlciB0byBzdG9yZSBjb250ZXh0dWFsIGJhc2VkIGluZm9ybWF0aW9uIGZvciB0aGUgb3BlcmF0aW9uLCBpZiBkZXNpcmVkLlxuICAgKiByZXR1cm46IHxcbiAgICogICAqIEB0eXBlcyBFbGVtZW50RGVmaW5pdGlvbjsgQSBzaW5nbGUgQHNlZSBFbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2UgZGVmaW5pbmdcbiAgICogICAgIHRoZSBET00gdG8gZ2VuZXJhdGUgd2hlbiBpbnNlcnRlZC4gQ2FuIGJlIGEgYCNmcmFnbWVudGAgZWxlbWVudCBkZWZpbml0aW9uLlxuICAgKiAgICogQHR5cGVzIEFycmF5PEVsZW1lbnREZWZpbml0aW9uPjsgQW4gYXJyYXkgb2YgZWxlbWVudCBkZWZpbml0aW9uIGluc3RhbmNlc1xuICAgKiAgICAgZGVmaW5pbmcgdGhlIERPTSB0byBnZW5lcmF0ZSB3aGVuIGluc2VydGVkLlxuICAgKiAgICogQHR5cGVzIG51bGw7IElmIG5vdGhpbmcgaXMgcmV0dXJuZWQsIHRoZW4gbm8gZWxlbWVudHMgd2lsbCBiZSBjcmVhdGVkLlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBUaGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoaXMgbWV0aG9kIGFuZCBAc2VlIE15dGhpeFVJQ29tcG9uZW50LiRidWlsZDsgbWV0aG9kIGlzXG4gICAqICAgICB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcywgd2hlcmVhcyB0aGVcbiAgICogICAgIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuJGJ1aWxkOyBtZXRob2Qgd2lsbCByZXR1cm4gYSBAc2VlIFF1ZXJ5RW5naW5lOyBpbnN0YW5jZSBjb250YWluaW5nXG4gICAqICAgICBhbGwgdGhlIGJ1aWx0IEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcy5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQge1xuICAgKiAgICAgICBNeXRoaXhVSUNvbXBvbmVudCxcbiAgICogICAgICAgVXRpbHMsXG4gICAqICAgICB9IGZyb20gJ0BjZG4vbXl0aGl4LXVpLWNvcmVAMSc7IC8vIGVuc3VyZSB3ZSBsb2NrIHRoaXMgdG8gd2hhdGV2ZXIgdmVyc2lvbiBpcyBpbXBvcnRhbnQgdG8gdXNcbiAgICpcbiAgICogICAgIGV4cG9ydCBjbGFzcyBEZW1vTmF2Q29tcG9uZW50IGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICAgKiAgICAgICBzdGF0aWMgdGFnTmFtZSA9ICdkZW1vLW5hdi1jb21wb25lbnQnOyAvLyBhIFwic29tZXRoaW5nLVwiIHByZWZpeCBpcyByZXF1aXJlZFxuICAgKlxuICAgKiAgICAgICBtb3VudGVkKCkgeyAvLyBjYWxsZWQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBhZGRlZCB0byBhbm90aGVyIGVsZW1lbnRcbiAgICogICAgICAgICBsZXQgbGlzdCA9IFtcbiAgICogICAgICAgICAgICdUZXN0IDEnLFxuICAgKiAgICAgICAgICAgJ1Rlc3QgMicsXG4gICAqICAgICAgICAgICAnTG9yZW0gSXBzdW0nLFxuICAgKiAgICAgICAgIF07XG4gICAqXG4gICAqICAgICAgICAgLy8gRHluYW1pY2FsbHkgYnVpbGQgYW5kIGFwcGVuZCBzb21lIGVsZW1lbnRzICh3aXRoIGF0dHJpYnV0ZXMgYW5kIGV2ZW50IGJpbmRpbmdzKVxuICAgKiAgICAgICAgIGxldCB1bm9yZGVyZWRMaXN0RWxlbWVudCA9IHRoaXMuYnVpbGQoKHsgTkFWLCBVTCwgTEksICRURVhUIH0pID0+IHsgLy8gYW55IGVsZW1lbnQgbmFtZSBjYW4gYmUgcmVxdWVzdGVkIGhlcmUgKGV2ZW4gY3VzdG9tIG9uZXMpXG4gICAqICAgICAgICAgICByZXR1cm4gVUwuaWQoJ3ByaW1hcnktbGlzdCcpLmNsYXNzKCdpbnRlcmFjdGl2ZS1saXN0JykoXG4gICAqICAgICAgICAgICAgIC8vIC4uLmNoaWxkcmVuIG9mIFVMIGVsZW1lbnRcbiAgICogICAgICAgICAgICAgLi4ubGlzdC5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAqICAgICAgICAgICAgICAgcmV0dXJuIExJLmNsYXNzKCdpdGVtLW5hbWUgZm9jdXNhYmxlJykuZGF0YUluZGV4KGluZGV4KS5vbkNsaWNrKHRoaXMub25JdGVtQ2xpY2spKFxuICAgKiAgICAgICAgICAgICAgICAgLy8gLi4uY2hpbGRyZW4gb2YgTEkgZWxlbWVudFxuICAgKiAgICAgICAgICAgICAgICAgJFRFWFQoaXRlbSksICAvLyBpbiB0aGlzIGNhc2UsIGEgc2luZ2xlIHRleHQgbm9kZVxuICAgKiAgICAgICAgICAgICAgICk7XG4gICAqICAgICAgICAgICAgIH0pLFxuICAgKiAgICAgICAgICAgKTtcbiAgICogICAgICAgICB9KTtcbiAgICpcbiAgICogICAgICAgICAvLyBDcmVhdGUgYW4gYXBwZW5kIGVsZW1lbnRzIHRvIHRoaXMgZWxlbWVudFxuICAgKiAgICAgICAgIHRoaXMuYXBwZW5kKFxuICAgKiAgICAgICAgICAgdW5vcmRlcmVkTGlzdEVsZW1lbnQuYnVpbGQoXG4gICAqICAgICAgICAgICAgIHRoaXMub3duZXJEb2N1bWVudCxcbiAgICogICAgICAgICAgICAgeyBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUodGhpcykgfSxcbiAgICogICAgICAgICAgICksXG4gICAqICAgICAgICAgKTtcbiAgICogICAgICAgfVxuICAgKlxuICAgKiAgICAgICAvLyBBbGwgY2xhc3MgbWV0aG9kcyBhcmUgYXV0b21hdGljYWxseSBib3VuZCB0byBcInRoaXNcIiBpbnNpZGUgdGhlIHN1cGVyLmNvbnN0cnVjdG9yXG4gICAqICAgICAgIG9uSXRlbUNsaWNrKGV2ZW50KSB7XG4gICAqICAgICAgICAgY29uc29sZS5sb2coJ0l0ZW0gQ2xpY2tlZCEnLCBldmVudC50YXJnZXQpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqXG4gICAqICAgICBEZW1vTmF2Q29tcG9uZW50LnJlZ2lzdGVyKCk7XG4gICAqICAgICBgYGBcbiAgICovXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIChyZXN1bHQubGVuZ3RoIDwgMikgPyByZXN1bHRbMF0gOiBuZXcgRWxlbWVudHMuRWxlbWVudERlZmluaXRpb24oJyNmcmFnbWVudCcsIHt9LCByZXN1bHQpO1xuICB9XG5cbiAgJGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCBbIHRoaXMuYnVpbGQoY2FsbGJhY2spIF0uZmxhdChJbmZpbml0eSkpO1xuICB9XG5cbiAgaXNBdHRyaWJ1dGVUcnV0aHkobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldElkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IEJhc2VVdGlscy50b0NhbWVsQ2FzZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGRlZmluZUR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyLCBfY29udGV4dCkge1xuICAgIHJldHVybiBVdGlscy5kZWZpbmVEeW5hbWljUHJvcC5jYWxsKF9jb250ZXh0IHx8IHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBVdGlscy5kZWZpbmVEeW5hbWljUHJvcC5jYWxsKGRhdGEsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBIHNlbGYtcmVzZXR0aW5nIHRpbWVvdXQuIFRoaXMgbWV0aG9kIGV4cGVjdHMgYW4gYGlkYCBhcmd1bWVudCAob3Igd2lsbCBnZW5lcmF0ZSBvbmUgZnJvbSB0aGUgcHJvdmlkZWRcbiAgICogICBjYWxsYmFjayBtZXRob2QgaWYgbm90IHByb3ZpZGVkKS4gSXQgdXNlcyB0aGlzIHByb3ZpZGVkIGBpZGAgdG8gY3JlYXRlIGEgdGltZW91dC4gVGhpcyB0aW1lb3V0IGhhcyBhIHNwZWNpYWwgZmVhdHVyZVxuICAgKiAgIGhvd2V2ZXIgdGhhdCBkaWZmZXJlbnRpYXRlcyBpdCBmcm9tIGEgbm9ybWFsIGBzZXRUaW1lb3V0YCBjYWxsOiBpZiB5b3UgY2FsbCBgdGhpcy5kZWJvdW5jZWAgYWdhaW4gd2l0aCB0aGVcbiAgICogICBzYW1lIGBpZGAgKipiZWZvcmUqKiB0aGUgdGltZSBydW5zIG91dCwgdGhlbiBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgcmVzZXQgdGhlIHRpbWVyLiBJbiBzaG9ydCwgb25seSB0aGUgbGFzdCBjYWxsXG4gICAqICAgdG8gYHRoaXMuZGVib3VuY2VgIChnaXZlbiB0aGUgc2FtZSBpZCkgd2lsbCB0YWtlIGVmZmVjdCAodW5sZXNzIHRoZSBzcGVjaWZpZWQgdGltZW91dCBpcyByZWFjaGVkIGJldHdlZW4gY2FsbHMpLlxuICAgKiByZXR1cm46IHxcbiAgICogICBUaGlzIG1ldGhvZCByZXR1cm5zIGEgc3BlY2lhbGl6ZWQgUHJvbWlzZSBpbnN0YW5jZS4gVGhlIGluc3RhbmNlIGlzIHNwZWNpYWxpemVkIGJlY2F1c2UgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzXG4gICAqICAgYXJlIGluamVjdGVkIGludG8gaXQ6XG4gICAqICAgMS4gYHJlc29sdmUocmVzdWx0VmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZXNvbHZlcyB0aGUgcHJvbWlzZSB3aXRoIHRoZSBmaXJzdCBwcm92aWRlZCBhcmd1bWVudFxuICAgKiAgIDIuIGByZWplY3QoZXJyb3JWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlamVjdHMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAgICogICAzLiBgc3RhdHVzKClgIC0gV2hlbiBjYWxsZWQsIHdpbGwgcmV0dXJuIHRoZSBmdWxmaWxsbWVudCBzdGF0dXMgb2YgdGhlIHByb21pc2UsIGFzIGEgYHN0cmluZ2AsIG9uZSBvZjogYFwicGVuZGluZ1wiLCBcImZ1bGZpbGxlZFwiYCwgb3IgYFwicmVqZWN0ZWRcImBcbiAgICogICA0LiBgaWQ8c3RyaW5nPmAgLSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBJRCBmb3IgdGhpcyBwcm9taXNlXG4gICAqXG4gICAqICAgU2VlIEBzZWUgQmFzZVV0aWxzLmNyZWF0ZVJlc29sdmFibGU7XG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IGNhbGxiYWNrXG4gICAqICAgICBkYXRhVHlwZXM6IGZ1bmN0aW9uXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBtZXRob2QgdG8gY2FsbCB3aGVuIHRoZSB0aW1lb3V0IGhhcyBiZWVuIG1ldC5cbiAgICogICAtIG5hbWU6IHRpbWVNU1xuICAgKiAgICAgZGF0YVR5cGVzOiBudW1iZXJcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZWZhdWx0OiAwXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGNhbGxpbmcgYGNhbGxiYWNrYC5cbiAgICogICAtIG5hbWU6IGlkXG4gICAqICAgICBkYXRhVHlwZXM6IHN0cmluZ1xuICAgKiAgICAgb3B0aW9uYWw6IHRydWVcbiAgICogICAgIGRlZmF1bHQ6IFwibnVsbFwiXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBpZGVudGlmaWVyIGZvciB0aGlzIGRlYm91bmNlIHRpbWVyLiBJZiBub3QgcHJvdmlkZWQsIHRoZW4gb25lXG4gICAqICAgICAgIHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB5b3UgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGNhbGxiYWNrLlxuICAgKiBub3RlczpcbiAgICogICAtIFRob3VnaCBub3QgcmVxdWlyZWQsIGl0IGlzIGZhc3RlciBhbmQgbGVzcyBwcm9ibGVtYXRpYyB0byBwcm92aWRlIHlvdXIgb3duIGBpZGAgYXJndW1lbnRcbiAgICovXG4gIGRlYm91bmNlKGNhbGxiYWNrLCB0aW1lTVMsIF9pZCkge1xuICAgIHZhciBpZCA9IF9pZDtcblxuICAgIC8vIElmIHdlIGRvbid0IGdldCBhbiBpZCBmcm9tIHRoZSB1c2VyLCB0aGVuIGd1ZXNzIHRoZSBpZCBieSB0dXJuaW5nIHRoZSBmdW5jdGlvblxuICAgIC8vIGludG8gYSBzdHJpbmcgKHJhdyBzb3VyY2UpIGFuZCB1c2UgdGhhdCBmb3IgYW4gaWQgaW5zdGVhZFxuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICBpZCA9ICgnJyArIGNhbGxiYWNrKTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhIHRyYW5zcGlsZWQgY29kZSwgdGhlbiBhbiBhc3luYyBnZW5lcmF0b3Igd2lsbCBiZSB1c2VkIGZvciBhc3luYyBmdW5jdGlvbnNcbiAgICAgIC8vIFRoaXMgd3JhcHMgdGhlIHJlYWwgZnVuY3Rpb24sIGFuZCBzbyB3aGVuIGNvbnZlcnRpbmcgdGhlIGZ1bmN0aW9uIGludG8gYSBzdHJpbmdcbiAgICAgIC8vIGl0IHdpbGwgTk9UIGJlIHVuaXF1ZSBwZXIgY2FsbC1zaXRlLiBGb3IgdGhpcyByZWFzb24sIGlmIHdlIGRldGVjdCB0aGlzIGlzc3VlLFxuICAgICAgLy8gd2Ugd2lsbCBnbyB0aGUgXCJzbG93XCIgcm91dGUgYW5kIGNyZWF0ZSBhIHN0YWNrIHRyYWNlLCBhbmQgdXNlIHRoYXQgZm9yIHRoZSB1bmlxdWUgaWRcbiAgICAgIGlmIChpZC5tYXRjaCgvYXN5bmNHZW5lcmF0b3JTdGVwLykpIHtcbiAgICAgICAgaWQgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgICAgICBjb25zb2xlLndhcm4oJ215dGhpeC11aSB3YXJuaW5nOiBcInRoaXMuZGVsYXlcIiBjYWxsZWQgd2l0aG91dCBhIHNwZWNpZmllZCBcImlkXCIgcGFyYW1ldGVyLiBUaGlzIHdpbGwgcmVzdWx0IGluIGEgcGVyZm9ybWFuY2UgaGl0LiBQbGVhc2Ugc3BlY2lmeSBhbmQgXCJpZFwiIGFyZ3VtZW50IGZvciB5b3VyIGNhbGw6IFwidGhpcy5kZWxheShjYWxsYmFjaywgbXMsIFxcJ3NvbWUtY3VzdG9tLWNhbGwtc2l0ZS1pZFxcJylcIicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9ICgnJyArIGlkKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UudGltZXJJRClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcbiAgICB9XG5cbiAgICBwcm9taXNlID0gQmFzZVV0aWxzLmNyZWF0ZVJlc29sdmFibGUoKTtcbiAgICB0aGlzLmRlbGF5VGltZXJzLnNldChpZCwgcHJvbWlzZSk7XG5cbiAgICAvLyBMZXQncyBub3QgY29tcGxhaW4gYWJvdXRcbiAgICAvLyB1bmNhdWdodCBlcnJvcnNcbiAgICBwcm9taXNlLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIHByb21pc2UudGltZXJJRCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgY2FsbGluZyBcImRlbGF5XCIgY2FsbGJhY2s6ICcsIGVycm9yLCBjYWxsYmFjay50b1N0cmluZygpKTtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH0sIHRpbWVNUyB8fCAwKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2xlYXJEZWJvdW5jZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5kZWxheVRpbWVycy5nZXQoaWQpO1xuICAgIGlmICghcHJvbWlzZSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICBjbGVhclRpbWVvdXQocHJvbWlzZS50aW1lcklEKTtcblxuICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcblxuICAgIHRoaXMuZGVsYXlUaW1lcnMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGNsYXNzZXMoLi4uX2FyZ3MpIHtcbiAgICBsZXQgYXJncyA9IF9hcmdzLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgJzo6U3RyaW5nJykpXG4gICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcblxuICAgICAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgIGxldCBrZXlzICA9IE9iamVjdC5rZXlzKGl0ZW0pO1xuICAgICAgICBsZXQgaXRlbXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBsZXQga2V5ICAgPSBrZXlzW2ldO1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICBpdGVtcy5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYXJncykpLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKHNyY1VSTCkge1xuICAgIGlmICghc3JjVVJMKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbCh0aGlzLCBzcmNVUkwpO1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY1VSTH0gKHJlc29sdmVkIHRvOiAke2Vycm9yLnVybH0pYCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SWRlbnRpZmllcih0YXJnZXQpIHtcbiAgaWYgKCF0YXJnZXQpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0LmdldElkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRJZGVudGlmaWVyLmNhbGwodGFyZ2V0KTtcblxuICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudClcbiAgICByZXR1cm4gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJykgfHwgQmFzZVV0aWxzLnRvQ2FtZWxDYXNlKHRhcmdldC5sb2NhbE5hbWUpO1xuXG4gIHJldHVybiAndW5kZWZpbmVkJztcbn1cblxuLy8gZnVuY3Rpb24gZm9ybWF0UnVsZVNldChydWxlLCBjYWxsYmFjaykge1xuLy8gICBpZiAoIXJ1bGUuc2VsZWN0b3JUZXh0KVxuLy8gICAgIHJldHVybiBydWxlLmNzc1RleHQ7XG5cbi8vICAgbGV0IF9ib2R5ICAgPSBydWxlLmNzc1RleHQuc3Vic3RyaW5nKHJ1bGUuc2VsZWN0b3JUZXh0Lmxlbmd0aCkudHJpbSgpO1xuLy8gICBsZXQgcmVzdWx0ICA9IChjYWxsYmFjayhydWxlLnNlbGVjdG9yVGV4dCwgX2JvZHkpIHx8IFtdKS5maWx0ZXIoQm9vbGVhbik7XG4vLyAgIGlmICghcmVzdWx0KVxuLy8gICAgIHJldHVybiAnJztcblxuLy8gICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gY3NzUnVsZXNUb1NvdXJjZShjc3NSdWxlcywgY2FsbGJhY2spIHtcbi8vICAgcmV0dXJuIEFycmF5LmZyb20oY3NzUnVsZXMgfHwgW10pLm1hcCgocnVsZSkgPT4ge1xuLy8gICAgIGxldCBydWxlU3RyID0gZm9ybWF0UnVsZVNldChydWxlLCBjYWxsYmFjayk7XG4vLyAgICAgcmV0dXJuIGAke2Nzc1J1bGVzVG9Tb3VyY2UocnVsZS5jc3NSdWxlcywgY2FsbGJhY2spfSR7cnVsZVN0cn1gO1xuLy8gICB9KS5qb2luKCdcXG5cXG4nKTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQoZWxlbWVudE5hbWUsIHN0eWxlRWxlbWVudCkge1xuLy8gICBjb25zdCBoYW5kbGVIb3N0ID0gKG0sIHR5cGUsIF9jb250ZW50KSA9PiB7XG4vLyAgICAgbGV0IGNvbnRlbnQgPSAoIV9jb250ZW50KSA/IF9jb250ZW50IDogX2NvbnRlbnQucmVwbGFjZSgvXlxcKC8sICcnKS5yZXBsYWNlKC9cXCkkLywgJycpO1xuXG4vLyAgICAgaWYgKHR5cGUgPT09ICc6aG9zdCcpIHtcbi8vICAgICAgIGlmICghY29udGVudClcbi8vICAgICAgICAgcmV0dXJuIGVsZW1lbnROYW1lO1xuXG4vLyAgICAgICAvLyBFbGVtZW50IHNlbGVjdG9yP1xuLy8gICAgICAgaWYgKCgvXlthLXpBLVpfXS8pLnRlc3QoY29udGVudCkpXG4vLyAgICAgICAgIHJldHVybiBgJHtjb250ZW50fVtkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCJdYDtcblxuLy8gICAgICAgcmV0dXJuIGAke2VsZW1lbnROYW1lfSR7Y29udGVudH1gO1xuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICByZXR1cm4gYCR7Y29udGVudH0gJHtlbGVtZW50TmFtZX1gO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICByZXR1cm4gY3NzUnVsZXNUb1NvdXJjZShcbi8vICAgICBzdHlsZUVsZW1lbnQuc2hlZXQuY3NzUnVsZXMsXG4vLyAgICAgKF9zZWxlY3RvciwgYm9keSkgPT4ge1xuLy8gICAgICAgbGV0IHNlbGVjdG9yID0gX3NlbGVjdG9yO1xuLy8gICAgICAgbGV0IHRhZ3MgICAgID0gW107XG5cbi8vICAgICAgIGxldCB1cGRhdGVkU2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8oWydcIl0pKD86XFxcXC58W15cXDFdKSs/XFwxLywgKG0pID0+IHtcbi8vICAgICAgICAgbGV0IGluZGV4ID0gdGFncy5sZW5ndGg7XG4vLyAgICAgICAgIHRhZ3MucHVzaChtKTtcbi8vICAgICAgICAgcmV0dXJuIGBAQEBUQUdbJHtpbmRleH1dQEBAYDtcbi8vICAgICAgIH0pLnNwbGl0KCcsJykubWFwKChzZWxlY3RvcikgPT4ge1xuLy8gICAgICAgICBsZXQgbW9kaWZpZWQgPSBzZWxlY3Rvci5yZXBsYWNlKC8oOmhvc3QoPzotY29udGV4dCk/KShcXChcXHMqW14pXSs/XFxzKlxcKSk/LywgaGFuZGxlSG9zdCk7XG4vLyAgICAgICAgIHJldHVybiAobW9kaWZpZWQgPT09IHNlbGVjdG9yKSA/IG51bGwgOiBtb2RpZmllZDtcbi8vICAgICAgIH0pLmZpbHRlcihCb29sZWFuKS5qb2luKCcsJykucmVwbGFjZSgvQEBAVEFHXFxbKFxcZCspXFxdQEBALywgKG0sIGluZGV4KSA9PiB7XG4vLyAgICAgICAgIHJldHVybiB0YWdzWytpbmRleF07XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaWYgKCF1cGRhdGVkU2VsZWN0b3IpXG4vLyAgICAgICAgIHJldHVybjtcblxuLy8gICAgICAgcmV0dXJuIFsgdXBkYXRlZFNlbGVjdG9yLCBib2R5IF07XG4vLyAgICAgfSxcbi8vICAgKTtcbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4vLyAgIGxldCBvYmpJRCAgICAgICAgICAgICA9IEJhc2VVdGlscy5nZXRPYmplY3RJRCh0ZW1wbGF0ZSk7XG4vLyAgIGxldCB0ZW1wbGF0ZUlEICAgICAgICA9IEJhc2VVdGlscy5TSEEyNTYob2JqSUQpO1xuLy8gICBsZXQgdGVtcGxhdGVDaGlsZHJlbiAgPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG4vLyAgIGxldCBpbmRleCAgICAgICAgICAgICA9IDA7XG5cbi8vICAgZm9yIChsZXQgdGVtcGxhdGVDaGlsZCBvZiB0ZW1wbGF0ZUNoaWxkcmVuKSB7XG4vLyAgICAgaWYgKCEoL15zdHlsZSQvaSkudGVzdCh0ZW1wbGF0ZUNoaWxkLnRhZ05hbWUpKVxuLy8gICAgICAgY29udGludWU7XG5cbi8vICAgICBsZXQgc3R5bGVJRCA9IGBJRFNUWUxFJHt0ZW1wbGF0ZUlEfSR7KytpbmRleH1gO1xuLy8gICAgIGlmICghb3duZXJEb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKSkge1xuLy8gICAgICAgbGV0IGNsb25lZFN0eWxlRWxlbWVudCA9IHRlbXBsYXRlQ2hpbGQuY2xvbmVOb2RlKHRydWUpO1xuLy8gICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbi8vICAgICAgIGxldCBuZXdTdHlsZVNoZWV0ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQoY29tcG9uZW50TmFtZSwgY2xvbmVkU3R5bGVFbGVtZW50KTtcbi8vICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4vLyAgICAgICBsZXQgc3R5bGVOb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuLy8gICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtZm9yJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbi8vICAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4vLyAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gbmV3U3R5bGVTaGVldDtcblxuLy8gICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVVSTChyb290TG9jYXRpb24sIF91cmxpc2gpIHtcbiAgbGV0IHVybGlzaCA9IF91cmxpc2g7XG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBVUkwpXG4gICAgdXJsaXNoID0gdXJsaXNoLnRvU3RyaW5nKCk7XG5cbiAgaWYgKCF1cmxpc2gpXG4gICAgdXJsaXNoID0gJyc7XG5cbiAgaWYgKCFCYXNlVXRpbHMuaXNUeXBlKHVybGlzaCwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuO1xuXG4gIGxldCB1cmwgPSBuZXcgVVJMKHVybGlzaCwgbmV3IFVSTChyb290TG9jYXRpb24pKTtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IGZpbGVOYW1lICA9ICcnO1xuICAgIGxldCBwYXRoICAgICAgPSAnLyc7XG5cbiAgICB1cmwucGF0aG5hbWUucmVwbGFjZSgvXiguKlxcLykoW14vXSspJC8sIChtLCBmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICBwYXRoID0gZmlyc3QucmVwbGFjZSgvXFwvKyQvLCAnLycpO1xuICAgICAgaWYgKHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJylcbiAgICAgICAgcGF0aCA9IGAke3BhdGh9L2A7XG5cbiAgICAgIGZpbGVOYW1lID0gc2Vjb25kO1xuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbiAgICBsZXQgbmV3U3JjID0gZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlci5jYWxsKHRoaXMsIHsgc3JjOiB1cmxpc2gsIHVybCwgcGF0aCwgZmlsZU5hbWUgfSk7XG4gICAgaWYgKG5ld1NyYyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtcmVxdWlyZVwiOiBOb3QgbG9hZGluZyBcIiR7dXJsaXNofVwiIGJlY2F1c2UgdGhlIGdsb2JhbCBcIm15dGhpeFVJLnVybFJlc29sdmVyXCIgcmVxdWVzdGVkIEkgbm90IGRvIHNvLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdTcmMgJiYgKG5ld1NyYy50b1N0cmluZygpICE9PSB1cmwudG9TdHJpbmcoKSAmJiBuZXdTcmMudG9TdHJpbmcoKSAhPT0gdXJsaXNoKSlcbiAgICAgIHVybCA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCByb290TG9jYXRpb24sIG5ld1NyYyk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG5jb25zdCBJU19URU1QTEFURSAgICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgSVNfU0NSSVBUICAgICAgICAgICA9IC9eKHNjcmlwdCkkL2k7XG5jb25zdCBJU19IRUFEX1RBRyAgICAgICAgID0gL14oc3R5bGV8bGlua3xtZXRhKSQvaTtcbmNvbnN0IFNIT1VMRF9JR05PUkUgICAgICAgPSAvXihiYXNlfG5vc2NyaXB0fHRpdGxlKSQvaTtcbmNvbnN0IFJFUVVJUkVfQ0FDSEUgICAgICAgPSBuZXcgTWFwKCk7XG5jb25zdCBSRVNPTFZFX1NSQ19FTEVNRU5UID0gL15zY3JpcHR8bGlua3xzdHlsZXxteXRoaXgtbGFuZ3VhZ2UtcGFja3xteXRoaXgtcmVxdWlyZSQvaTtcblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2Uob3duZXJEb2N1bWVudCwgbG9jYXRpb24sIF91cmwsIHNvdXJjZVN0cmluZywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdXJsICAgICAgID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGxvY2F0aW9uLCBfdXJsLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGZpbGVOYW1lO1xuICBsZXQgYmFzZVVSTCAgID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lLnJlcGxhY2UoL1teL10rJC8sIChtKSA9PiB7XG4gICAgZmlsZU5hbWUgPSBtO1xuICAgIHJldHVybiAnJztcbiAgfSl9JHt1cmwuc2VhcmNofSR7dXJsLmhhc2h9YCk7XG5cbiAgbGV0IHRlbXBsYXRlID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzb3VyY2VTdHJpbmc7XG5cbiAgbGV0IGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgbGV0IHggPSBhLnRhZ05hbWU7XG4gICAgbGV0IHkgPSBiLnRhZ05hbWU7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKHggPT0geSlcbiAgICAgIHJldHVybiAwO1xuXG4gICAgcmV0dXJuICh4IDwgeSkgPyAxIDogLTE7XG4gIH0pO1xuXG4gIGNvbnN0IGZpbGVOYW1lVG9FbGVtZW50TmFtZSA9IChmaWxlTmFtZSkgPT4ge1xuICAgIHJldHVybiBmaWxlTmFtZS50cmltKCkucmVwbGFjZSgvXFwuLiokLywgJycpLnJlcGxhY2UoL1xcYltBLVpdfFteQS1aXVtBLVpdL2csIChfbSkgPT4ge1xuICAgICAgbGV0IG0gPSBfbS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIChtLmxlbmd0aCA8IDIpID8gYC0ke219YCA6IGAke20uY2hhckF0KDApfS0ke20uY2hhckF0KDEpfWA7XG4gICAgfSkucmVwbGFjZSgvLXsyLH0vZywgJy0nKS5yZXBsYWNlKC9eW15hLXpdKi8sICcnKS5yZXBsYWNlKC9bXmEtel0qJC8sICcnKTtcbiAgfTtcblxuICBsZXQgZ3Vlc3NlZEVsZW1lbnROYW1lICA9IGZpbGVOYW1lVG9FbGVtZW50TmFtZShmaWxlTmFtZSk7XG4gIGxldCBjb250ZXh0ICAgICAgICAgICAgID0ge1xuICAgIGd1ZXNzZWRFbGVtZW50TmFtZSxcbiAgICBjaGlsZHJlbixcbiAgICBvd25lckRvY3VtZW50LFxuICAgIHRlbXBsYXRlLFxuICAgIHVybCxcbiAgICBiYXNlVVJMLFxuICAgIGZpbGVOYW1lLFxuICB9O1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wcmVQcm9jZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGVtcGxhdGUgPSBjb250ZXh0LnRlbXBsYXRlID0gb3B0aW9ucy5wcmVQcm9jZXNzLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pO1xuICB9XG5cbiAgbGV0IG5vZGVIYW5kbGVyICAgPSBvcHRpb25zLm5vZGVIYW5kbGVyO1xuICBsZXQgdGVtcGxhdGVDb3VudCA9IGNoaWxkcmVuLnJlZHVjZSgoc3VtLCBlbGVtZW50KSA9PiAoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyAoc3VtICsgMSkgOiBzdW0pLCAwKTtcblxuICBjb250ZXh0LnRlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50O1xuXG4gIGNvbnN0IHJlc29sdmVFbGVtZW50U3JjQXR0cmlidXRlID0gKGVsZW1lbnQsIGJhc2VVUkwpID0+IHtcbiAgICAvLyBSZXNvbHZlIFwic3JjXCIgYXR0cmlidXRlLCBzaW5jZSB3ZSBhcmVcbiAgICAvLyBnb2luZyB0byBiZSBtb3ZpbmcgdGhlIGVsZW1lbnQgYXJvdW5kXG4gICAgbGV0IHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoc3JjKSB7XG4gICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9O1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgaWYgKG9wdGlvbnMubWFnaWMgJiYgUkVTT0xWRV9TUkNfRUxFTUVOVC50ZXN0KGNoaWxkLmxvY2FsTmFtZSkpXG4gICAgICBjaGlsZCA9IHJlc29sdmVFbGVtZW50U3JjQXR0cmlidXRlKGNoaWxkLCBiYXNlVVJMKTtcblxuICAgIGlmIChTSE9VTERfSUdOT1JFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICBpZiAodGVtcGxhdGVDb3VudCA9PT0gMSAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgPT0gbnVsbCAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiIGldYCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmIChJU19TQ1JJUFQudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8c2NyaXB0PlxuICAgICAgbGV0IGNoaWxkQ2xvbmUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY2hpbGQudGFnTmFtZSk7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIG9mIGNoaWxkLmdldEF0dHJpYnV0ZU5hbWVzKCkpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdzcmMnKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGNoaWxkLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzcmMgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgaWYgKHNyYykge1xuICAgICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkQ2xvbmUsIHsgLi4uY29udGV4dCwgaXNTY3JpcHQ6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgc2NyaXB0SUQgPSBjaGlsZENsb25lLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIGlmICghc2NyaXB0SUQpIHtcbiAgICAgICAgc2NyaXB0SUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke3NyYyB8fCBjaGlsZENsb25lLmlubmVySFRNTH1gKX1gO1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnaWQnLCBzY3JpcHRJRCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY3JpcHRJRCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKElTX0hFQURfVEFHLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPGxpbms+ICYgPHN0eWxlPlxuICAgICAgbGV0IGlzU3R5bGUgPSAoL15zdHlsZSQvaSkudGVzdChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1N0eWxlLCBpc0xpbms6ICFpc1N0eWxlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICBpZiAoIXN0eWxlSUQpIHtcbiAgICAgICAgc3R5bGVJRCA9IGBJRCR7QmFzZVV0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7c3R5bGVJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKCgvXm1ldGEkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPG1ldGE+XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHsgLy8gRXZlcnl0aGluZyBlbHNlXG4gICAgICBsZXQgaXNIYW5kbGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChjaGlsZC5sb2NhbE5hbWUgPT09ICdteXRoaXgtbGFuZ3VhZ2UtcGFjaycpIHtcbiAgICAgICAgbGV0IGxhbmdQYWNrSUQgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIGlmICghbGFuZ1BhY2tJRCkge1xuICAgICAgICAgIGxhbmdQYWNrSUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke2NoaWxkLm91dGVySFRNTH1gKX1gO1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBsYW5nUGFja0lEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcblxuICAgICAgICBpZiAobGFuZ3VhZ2VQcm92aWRlcikge1xuICAgICAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlci5xdWVyeVNlbGVjdG9yKGBteXRoaXgtbGFuZ3VhZ2UtcGFjayMke2xhbmdQYWNrSUR9YCkpXG4gICAgICAgICAgICBsYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZShjaGlsZCwgbGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKTtcblxuICAgICAgICAgIGlzSGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH0gLy8gZWxzZSBkbyBub3RoaW5nLi4uIGxldCBpdCBiZSBkdW1wZWQgaW50byB0aGUgZG9tIGxhdGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wb3N0UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucG9zdFByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUodXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgdXJsT3JOYW1lLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGNhY2hlS2V5O1xuXG4gIGlmICghKC9eKGZhbHNlfG5vLXN0b3JlfHJlbG9hZHxuby1jYWNoZSkkLykudGVzdCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGUnKSkpIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlUGFyYW1zJykgIT09ICd0cnVlJykge1xuICAgICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZWRSZXNwb25zZSA9IFJFUVVJUkVfQ0FDSEUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICBpZiAoY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UgJiYgY2FjaGVkUmVzcG9uc2UucmVzcG9uc2Uub2spXG4gICAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgICB9XG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGdsb2JhbFRoaXMuZmV0Y2godXJsLCBvcHRpb25zLmZldGNoT3B0aW9ucykudGhlbihcbiAgICBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgcmVzcG9uc2UudGV4dCA9IGFzeW5jICgpID0+IGJvZHk7XG4gICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiBmYWxzZSB9O1xuICAgIH0sXG4gICAgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmcm9tIE15dGhpeCBVSSBcInJlcXVpcmVcIjogJywgZXJyb3IpO1xuXG4gICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgc3JjLFxuICAgIHtcbiAgICAgIG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgbGV0IHNjb3BlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIHVybC5zZWFyY2hQYXJhbXMuZW50cmllcygpKVxuICAgIHNjb3BlRGF0YVtrZXldID0gQmFzZVV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSkge1xuICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMuY2FsbChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFV0aWxzLmNyZWF0ZVNjb3BlKHNjb3BlRGF0YSwgb3B0aW9ucy5zY29wZSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2liaWxpdHlPYnNlcnZlcihjYWxsYmFjaywgX29wdGlvbnMpIHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVudHJpZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVudHJ5ICAgPSBlbnRyaWVzW2ldO1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbnRyeS50YXJnZXQ7XG4gICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gICAgICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsIGVsZW1lbnRPYnNlcnZlcnMpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0geyB3YXNWaXNpYmxlOiBmYWxzZSwgcmF0aW9WaXNpYmxlOiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB9O1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzLnNldChvYnNlcnZlciwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IGRhdGEucmF0aW9WaXNpYmxlKVxuICAgICAgICBkYXRhLnJhdGlvVmlzaWJsZSA9IGVudHJ5LmludGVyc2VjdGlvblJhdGlvO1xuXG4gICAgICBkYXRhLnByZXZpb3VzVmlzaWJpbGl0eSA9IChkYXRhLnZpc2liaWxpdHkgPT09IHVuZGVmaW5lZCkgPyBkYXRhLnZpc2liaWxpdHkgOiBkYXRhLnZpc2liaWxpdHk7XG4gICAgICBkYXRhLnZpc2liaWxpdHkgPSAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjApO1xuXG4gICAgICBjYWxsYmFjayh7IC4uLmRhdGEsIGVudHJ5LCBlbGVtZW50LCBpbmRleDogaSwgZGlzY29ubmVjdDogKCkgPT4gb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpIH0pO1xuXG4gICAgICBpZiAoZGF0YS52aXNpYmlsaXR5ICYmICFkYXRhLndhc1Zpc2libGUpXG4gICAgICAgIGRhdGEud2FzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBvcHRpb25zID0ge1xuICAgIHJvb3Q6ICAgICAgIG51bGwsXG4gICAgdGhyZXNob2xkOiAgMC4wLFxuICAgIC4uLihfb3B0aW9ucyB8fCB7fSksXG4gIH07XG5cbiAgbGV0IG9ic2VydmVyICA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpbnRlcnNlY3Rpb25DYWxsYmFjaywgb3B0aW9ucyk7XG4gIGxldCBlbGVtZW50cyAgPSAoX29wdGlvbnMgfHwge30pLmVsZW1lbnRzIHx8IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50c1tpXSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5jb25zdCBOT19PQlNFUlZFUiA9IE9iamVjdC5mcmVlemUoe1xuICB3YXNWaXNpYmxlOiAgICAgICAgIGZhbHNlLFxuICByYXRpb1Zpc2libGU6ICAgICAgIDAuMCxcbiAgdmlzaWJpbGl0eTogICAgICAgICBmYWxzZSxcbiAgcHJldmlvdXNWaXNpYmlsaXR5OiBmYWxzZSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eU1ldGEoZWxlbWVudCwgb2JzZXJ2ZXIpIHtcbiAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gIGlmICghZWxlbWVudE9ic2VydmVycylcbiAgICByZXR1cm4gTk9fT0JTRVJWRVI7XG5cbiAgcmV0dXJuIGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKSB8fCBOT19PQlNFUlZFUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhcmdlc3REb2N1bWVudFRhYkluZGV4KG93bmVyRG9jdW1lbnQpIHtcbiAgbGV0IGxhcmdlc3QgPSAtSW5maW5pdHk7XG5cbiAgQXJyYXkuZnJvbSgob3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgbGV0IHRhYkluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JyksIDEwKTtcbiAgICBpZiAoIWlzRmluaXRlKHRhYkluZGV4KSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0YWJJbmRleCA+IGxhcmdlc3QpXG4gICAgICBsYXJnZXN0ID0gdGFiSW5kZXg7XG4gIH0pO1xuXG4gIHJldHVybiAobGFyZ2VzdCA8IDApID8gMCA6IGxhcmdlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRTY3JpcHRJbnRvSGVhZChfdXJsLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgYXR0cmlidXRlcyAgICA9IG9wdGlvbnMuYXR0cmlidXRlcyB8fCB7fTtcbiAgbGV0IG93bmVyRG9jdW1lbnQgPSBvcHRpb25zLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIGxldCBzY3JpcHRFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgX3VybCwgeyBtYWdpYzogdHJ1ZSB9KTtcblxuICBmb3IgKGxldCBbIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ3NyYycpXG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmxvY2F0aW9uLCBhdHRyaWJ1dGVWYWx1ZSwgeyBtYWdpYzogdHJ1ZSB9KTtcblxuICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgfVxuXG4gIGxldCBzY3JpcHRJRCA9IHNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICBpZiAoIXNjcmlwdElEKSB7XG4gICAgc2NyaXB0SUQgPSBgSUQke0Jhc2VVdGlscy5TSEEyNTYodXJsKX1gO1xuICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHNjcmlwdElEKTtcbiAgfVxuXG4gIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJpYnV0ZXMsICd0eXBlJykpXG4gICAgc2NyaXB0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG5cbiAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2NyaXB0SUQpKVxuICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICByZXR1cm4gc2NyaXB0RWxlbWVudDtcbn0iLCIvKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29uc3RhbnRzXG4gKiBncm91cE5hbWU6IENvbnN0YW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBhZ2FpbnN0IGVsZW1lbnRzIHdpdGggYSBgZGF0YS1zcmNgIGF0dHJpYnV0ZS5cbiAqICAgICAgIEZvciBlbGVtZW50cyB3aXRoIHRoaXMgYXR0cmlidXRlLCBzZXQgYW4gW2ludGVyc2VjdGlvbiBvYnNlcnZlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbl9PYnNlcnZlcl9BUEkpIGlzIHNldHVwLlxuICogICAgICAgV2hlbiB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIHJlcG9ydHMgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCB0aGVuIHRoZSBVUkwgc3BlY2lmaWVkIGJ5IGBkYXRhLXNyY2AgaXMgZmV0Y2hlZCwgYW5kIGR1bXBlZCBpbnRvXG4gKiAgICAgICB0aGUgZWxlbWVudCBhcyBpdHMgY2hpbGRyZW4uIFRoaXMgYWxsb3dzIGZvciBkeW5hbWljIFwicGFydGlhbHNcIiB0aGF0IGFyZSBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogICAgICAgVGhlIHZhbHVlIHN0b3JlZCBhdCB0aGlzIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBpcyBhIE1hcCBvZiBbaW50ZXJzZWN0aW9uIG9ic2VydmVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpXG4gKiAgICAgICBpbnN0YW5jZXMuIFRoZSBrZXlzIG9mIHRoaXMgbWFwIGFyZSB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVycyB0aGVtc2VsdmVzLiBUaGUgdmFsdWVzIGFyZSByYXcgb2JqZWN0cyB3aXRoIHRoZSBzaGFwZVxuICogICAgICAgYHsgd2FzVmlzaWJsZTogYm9vbGVhbiwgcmF0aW9WaXNpYmxlOiBmbG9hdCwgcHJldmlvdXNWaXNpYmlsaXR5OiBib29sZWFuLCB2aXNpYmlsaXR5OiBib29sZWFuIH1gLlxuICogICAtIG5hbWU6IE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgVXRpbHMuZ2xvYmFsU3RvcmVOYW1lVmFsdWVQYWlySGVscGVyO1xuICogICAgICAgdG8gc3RvcmUga2V5L3ZhbHVlIHBhaXJzIGZvciBhIHNpbmdsZSB2YWx1ZS5cbiAqXG4gKiAgICAgICBNeXRoaXggVUkgaGFzIGdsb2JhbCBzdG9yZSBhbmQgZmV0Y2ggaGVscGVycyBmb3Igc2V0dGluZyBhbmQgZmV0Y2hpbmcgZHluYW1pYyBwcm9wZXJ0aWVzLiBUaGVzZVxuICogICAgICAgbWV0aG9kcyBvbmx5IGFjY2VwdCBhIHNpbmdsZSB2YWx1ZSBieSBkZXNpZ24uLi4gYnV0IHNvbWV0aW1lcyBpdCBpcyBkZXNpcmVkIHRoYXQgYSB2YWx1ZSBiZSBzZXRcbiAqICAgICAgIHdpdGggYSBzcGVjaWZpYyBrZXkgaW5zdGVhZC4gVGhpcyBgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJgIHByb3BlcnR5IGFzc2lzdHMgd2l0aCB0aGlzIHByb2Nlc3MsXG4gKiAgICAgICBhbGxvd2luZyBnbG9iYWwgaGVscGVycyB0byBzdGlsbCBmdW5jdGlvbiB3aXRoIGEgc2luZ2xlIHZhbHVlIHNldCwgd2hpbGUgaW4gc29tZSBjYXNlcyBzdGlsbCBwYXNzaW5nXG4gKiAgICAgICBhIGtleSB0aHJvdWdoIHRvIHRoZSBzZXR0ZXIuIEBzb3VyY2VSZWYgX215dGhpeE5hbWVWYWx1ZVBhaXJIZWxwZXJVc2FnZTtcbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgLSBuYW1lOiBNWVRISVhfU0hBRE9XX1BBUkVOVFxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgYXMgYSBAc2VlIFV0aWxzLm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBieSBAc2VlIE15dGhpeFVJQ29tcG9uZW50OyB0b1xuICogICAgICAgc3RvcmUgdGhlIHBhcmVudCBub2RlIG9mIGEgU2hhZG93IERPTSwgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgdHJhdmVyc2VkIGJ5IEBzZWUgVXRpbHMuZ2V0UGFyZW50Tm9kZTsuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOndhcm5pbmc6IFVzZSBhdCB5b3VyIG93biByaXNrLiBUaGlzIGlzIE15dGhpeCBVSSBpbnRlcm5hbCBjb2RlIHRoYXQgbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgLSBuYW1lOiBNWVRISVhfVFlQRVxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgZm9yIHR5cGUgY2hlY2tpbmcgYnkgYGluc3RhbmNlb2ZgIGNoZWNrcyB0byBkZXRlcm1pbmUgaWYgYW4gaW5zdGFuY2VcbiAqICAgICAgIGlzIGEgc3BlY2lmaWMgdHlwZSAoZXZlbiBhY3Jvc3MgamF2YXNjcmlwdCBjb250ZXh0cyBhbmQgbGlicmFyeSB2ZXJzaW9ucykuIEBzb3VyY2VSZWYgX215dGhpeFR5cGVFeGFtcGxlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKiAgIC0gbmFtZTogRFlOQU1JQ19QUk9QRVJUWV9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFVzZWQgZm9yIHJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGFnYWluc3QgQHNlZSBVdGlscy5EeW5hbWljUHJvcGVydHk7LlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgRHluYW1pY1Byb3BlcnR5Oy5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9UWVBFOy5cbiAqL1xuXG4vLyBCYXNlXG5leHBvcnQgY29uc3QgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL25hbWUtdmFsdWUtcGFpci1oZWxwZXInKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbmV4cG9ydCBjb25zdCBNWVRISVhfU0hBRE9XX1BBUkVOVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvc2hhZG93LXBhcmVudCcpOyAvLyBAcmVmOkNvbnN0YW50cy5NWVRISVhfU0hBRE9XX1BBUkVOVFxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9UWVBFICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9lbGVtZW50LWRlZmluaXRpb24nKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX1RZUEVcbmV4cG9ydCBjb25zdCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2ludGVyc2VjdGlvbi1vYnNlcnZlcnMnKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbmV4cG9ydCBjb25zdCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2RvY3VtZW50LWluaXRpYWxpemVkJyk7IC8vIEByZWY6Q29uc3RhbnRzLk1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRFxuXG4vLyBEeW5hbWljUHJvcGVydHlcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy92YWx1ZScpO1xuZXhwb3J0IGNvbnN0IERZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElORyAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL2lzLXNldHRpbmcnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1NFVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9zZXQnKTtcblxuLy8gVHlwZXNcbmV4cG9ydCBjb25zdCBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RWxlbWVudERlZmluaXRpb24nKTtcbmV4cG9ydCBjb25zdCBRVUVSWV9FTkdJTkVfVFlQRSAgICAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6UXVlcnlFbmdpbmUnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1RZUEUgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RHluYW1pY1Byb3BlcnR5Jyk7IC8vIEByZWY6Q29uc3RhbnRzLkRZTkFNSUNfUFJPUEVSVFlfVFlQRVxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpNeXRoaXhVSUNvbXBvbmVudCcpO1xuXG4vLyBFbGVtZW50c1xuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy91bmZpbmlzaGVkJyk7XG5cblxuIiwiaW1wb3J0IHtcbiAgRFlOQU1JQ19QUk9QRVJUWV9UWVBFLFxuICBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFLFxuICBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcsXG4gIERZTkFNSUNfUFJPUEVSVFlfU0VULFxuICBNWVRISVhfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuLyoqXG4gKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICogZGVzYzogfFxuICogICBgRHluYW1pY1Byb3BlcnR5YCBpcyBhIHNpbXBsZSB2YWx1ZSBzdG9yYWdlIGNsYXNzIHdyYXBwZWQgaW4gYSBQcm94eS5cbiAqXG4gKiAgICBJdCB3aWxsIGFsbG93IHRoZSB1c2VyIHRvIHN0b3JlIGFueSBkZXNpcmVkIHZhbHVlLiBUaGUgY2F0Y2ggaG93ZXZlciBpcyB0aGF0XG4gKiAgICBhbnkgdmFsdWUgc3RvcmVkIGNhbiBvbmx5IGJlIHNldCB0aHJvdWdoIGl0cyBzcGVjaWFsIGBzZXRgIG1ldGhvZC5cbiAqXG4gKiAgICBUaGlzIHdpbGwgYWxsb3cgYW55IGxpc3RlbmVycyB0byByZWNlaXZlIHRoZSBgJ3VwZGF0ZSdgIGV2ZW50IHdoZW4gYSB2YWx1ZSBpcyBzZXQuXG4gKlxuICogICAgU2luY2UgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2VzIGFyZSBhbHNvIGFsd2F5cyB3cmFwcGVkIGluIGEgUHJveHksIHRoZSB1c2VyIG1heVxuICogICAgXCJkaXJlY3RseVwiIGFjY2VzcyBhdHRyaWJ1dGVzIG9mIHRoZSBzdG9yZWQgdmFsdWUuIEZvciBleGFtcGxlLCBpZiBhIGBEeW5hbWljUHJvcGVydHlgXG4gKiAgICBpcyBzdG9yaW5nIGFuIEFycmF5IGluc3RhbmNlLCB0aGVuIG9uZSB3b3VsZCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgYC5sZW5ndGhgIHByb3BlcnR5XG4gKiAgICBcImRpcmVjdGx5XCIsIGkuZS4gYGR5bmFtaWNQcm9wLmxlbmd0aGAuXG4gKlxuICogICAgYER5bmFtaWNQcm9wZXJ0eWAgaGFzIGEgc3BlY2lhbCBgc2V0YCBtZXRob2QsIHdob3NlIG5hbWUgaXMgYSBgc3ltYm9sYCwgdG8gYXZvaWQgY29uZmxpY3RpbmdcbiAqICAgIG5hbWVzcGFjZXMgd2l0aCB0aGUgdW5kZXJseWluZyBkYXRhdHlwZSAoYW5kIHRoZSB3cmFwcGluZyBQcm94eSkuXG4gKiAgICBUbyBzZXQgYSB2YWx1ZSBvbiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCBvbmUgbXVzdCBkbyBzbyBhcyBmb2xsb3dzOiBgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG15TmV3VmFsdWUpYC5cbiAqICAgIFRoaXMgd2lsbCB1cGRhdGUgdGhlIGludGVybmFsIHZhbHVlLCBhbmQgaWYgdGhlIHNldCB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIHN0b3JlZCB2YWx1ZSwgdGhlIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvXG4gKiAgICBhbnkgbGlzdGVuZXJzLlxuICpcbiAqICAgIEFzIGBEeW5hbWljUHJvcGVydHlgIGlzIGFuIFtFdmVudFRhcmdldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0V2ZW50VGFyZ2V0L0V2ZW50VGFyZ2V0KSwgb25lIGNhbiBhdHRhY2hcbiAqICAgIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgYCd1cGRhdGUnYCBldmVudCB0byBsaXN0ZW4gZm9yIHVwZGF0ZXMgdG8gdGhlIHVuZGVybHlpbmcgdmFsdWUuIFRoZSBgJ3VwZGF0ZSdgIGV2ZW50IGlzIHRoZSBvbmx5IGV2ZW50IHRoYXQgaXNcbiAqICAgIGV2ZXIgdHJpZ2dlcmVkIGJ5IHRoaXMgY2xhc3MuIFRoZSByZWNlaXZlZCBgZXZlbnRgIGluc3RhbmNlIGluIGV2ZW50IGNhbGxiYWNrcyB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICogICAgMS4gYHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO2AgLSBgb3JpZ2luYXRvcmAgaXMgdGhlIGluc3RhbmNlIG9mIHRoZSBgRHluYW1pY1Byb3BlcnR5YCB3aGVyZSB0aGUgZXZlbnQgb3JpZ2luYXRlZCBmcm9tLlxuICogICAgMi4gYHVwZGF0ZUV2ZW50Lm9sZFZhbHVlID0gY3VycmVudFZhbHVlO2AgLSBgb2xkVmFsdWVgIGNvbnRhaW5zIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgYmVmb3JlIHNldC5cbiAqICAgIDMuIGB1cGRhdGVFdmVudC52YWx1ZSA9IG5ld1ZhbHVlO2AgLSBgdmFsdWVgIGNvbnRhaW5zIHRoZSBjdXJyZW50IHZhbHVlIGJlaW5nIHNldCBvbiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAuXG4gKlxuICogICAgVG8gcmV0cmlldmUgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAsIG9uZSBtYXkgY2FsbCBgdmFsdWVPZigpYDogYGxldCByYXdWYWx1ZSA9IGR5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCk7YFxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZXMgd2lsbCBpbnRlcm5hbGx5IHRyYWNrIHdoZW4gYSBgc2V0YCBvcGVyYXRpb24gaXMgdW5kZXJ3YXksIHRvIHByZXZlbnRcbiAqICAgICBjeWNsaWMgc2V0cyBhbmQgbWF4aW11bSBjYWxsIHN0YWNrIGVycm9ycy4gWW91IGFyZSBhbGxvd2VkIHRvIHNldCB0aGUgdmFsdWUgcmVjdXJzaXZlbHksIGhvd2V2ZXIgYHVwZGF0ZWAgZXZlbnRzXG4gKiAgICAgd2lsbCBvbmx5IGJlIGRpc3BhdGNoZWQgZm9yIHRoZSBmaXJzdCBgc2V0YCBjYWxsLiBBbnkgYHNldGAgb3BlcmF0aW9uIHRoYXQgaGFwcGVucyB3aGlsZSBhbm90aGVyIGBzZXRgIG9wZXJhdGlvbiBpc1xuICogICAgIHVuZGVyd2F5IHdpbGwgKipub3QqKiBkaXNwYXRjaCBhbnkgYCd1cGRhdGUnYCBldmVudHMuXG4gKiAgIC0gfFxuICogICAgIGAndXBkYXRlJ2AgZXZlbnRzIHdpbGwgYmUgZGlzcGF0Y2hlZCBpbW1lZGlhdGVseSAqYWZ0ZXIqIHRoZSBpbnRlcm5hbCB1bmRlcmx5aW5nIHN0b3JlZCB2YWx1ZSBpcyB1cGRhdGVkLiBUaG91Z2ggaXQgaXNcbiAqICAgICBwb3NzaWJsZSB0byBgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uYCBpbiBhbiBldmVudCBjYWxsYmFjaywgYXR0ZW1wdGluZyB0byBcInByZXZlbnREZWZhdWx0XCIgb3IgXCJzdG9wUHJvcGFnYXRpb25cIiB3aWxsIGRvIG5vdGhpbmcuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gKlxuICogICAgIGR5bmFtaWNQcm9wZXJ0eS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICogICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgVmFsdWUgPSAnJHtkeW5hbWljUHJvcGVydHkudmFsdWVPZigpfSdgKTtcbiAqICAgICB9KTtcbiAqXG4gKiAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKCduZXcgdmFsdWUnKTtcbiAqXG4gKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICogICAgIC8vIG91dHB1dCAtPiBDdXJyZW50IFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbWljUHJvcGVydHkgZXh0ZW5kcyBFdmVudFRhcmdldCB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkgeyAvLyBAcmVmOl9teXRoaXhUeXBlRXhhbXBsZVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gRFlOQU1JQ19QUk9QRVJUWV9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHR5cGU6IFByb3BlcnR5XG4gICAqIG5hbWU6IHNldFxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBzdGF0aWM6IHRydWVcbiAgICogZGVzYzogfFxuICAgKiAgIEEgc3BlY2lhbCBgc3ltYm9sYCB1c2VkIHRvIGFjY2VzcyB0aGUgYHNldGAgbWV0aG9kIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGV4YW1wbGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgYGBgamF2YXNjcmlwdFxuICAgKiAgICAgaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAgICpcbiAgICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHkuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKGV2ZW50KSA9PiB7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICAgKiAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCBWYWx1ZSA9ICcke2R5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCl9J2ApO1xuICAgKiAgICAgfSk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oJ25ldyB2YWx1ZScpO1xuICAgKlxuICAgKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICAgKiAgICAgLy8gb3V0cHV0IC0+IEN1cnJlbnQgVmFsdWUgPSAnaW5pdGlhbCB2YWx1ZSdcbiAgICogICAgIGBgYFxuICAgKi9cbiAgc3RhdGljIHNldCA9IERZTkFNSUNfUFJPUEVSVFlfU0VUOyAvLyBAcmVmOkR5bmFtaWNQcm9wZXJ0eS5zZXRcblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogbmFtZTogY29uc3RydWN0b3JcbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBVdGlsc1xuICAgKiBkZXNjOiB8XG4gICAqICAgQ29uc3RydWN0IGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IGluaXRpYWxWYWx1ZVxuICAgKiAgICAgZGF0YVR5cGU6IGFueVxuICAgKiAgICAgZGVzYzpcbiAgICogICAgICAgVGhlIGluaXRpYWwgdmFsdWUgdG8gc3RvcmUuXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFRoaXMgd2lsbCByZXR1cm4gYSBQcm94eSBpbnN0YW5jZSB3cmFwcGluZyB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogWW91IGNhbiBub3Qgc2V0IGEgYER5bmFtaWNQcm9wZXJ0eWAgdG8gYW5vdGhlciBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAgIElmIGBpbml0aWFsVmFsdWVgIGlzIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIGl0IHdpbGwgdXNlIHRoZSBzdG9yZWQgdmFsdWVcbiAgICogICAgIG9mIHRoYXQgaW5zdGFuY2UgaW5zdGVhZCAoYnkgY2FsbGluZyBAc2VlIER5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mOykuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBEWU5BTUlDX1BST1BFUlRZX1RZUEUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIChCYXNlVXRpbHMuaXNUeXBlKGluaXRpYWxWYWx1ZSwgRHluYW1pY1Byb3BlcnR5KSkgPyBpbml0aWFsVmFsdWUudmFsdWVPZigpIDogaW5pdGlhbFZhbHVlLFxuICAgICAgfSxcbiAgICAgIFtEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCBwcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldCkgOiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXVtwcm9wTmFtZV07XG4gICAgICAgIHJldHVybiAodmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUuYmluZCh0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0pIDogdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2V0OiAgKHRhcmdldCwgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgdGFyZ2V0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm94eTtcbiAgfVxuXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpXG4gICAgICByZXR1cm4gK3RoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgZWxzZSBpZiAoaGludCA9PT0gJ3N0cmluZycpXG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS50b1N0cmluZygpIDogKCcnICsgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHR5cGU6IEZ1bmN0aW9uXG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIGRlc2M6IHxcbiAgICogICBGZXRjaCB0aGUgdW5kZXJseWluZyByYXcgdmFsdWUgc3RvcmVkIGJ5IHRoaXMgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlczogYW55OyBUaGUgdW5kZXJsaW5nIHJhdyB2YWx1ZS5cbiAgICovXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogbmFtZTogXCJbRHluYW1pY1Byb3BlcnR5LnNldF1cIlxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBkZXNjOiB8XG4gICAqICAgU2V0IHRoZSB1bmRlcmx5aW5nIHJhdyB2YWx1ZSBzdG9yZWQgYnkgdGhpcyBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICpcbiAgICogICBJZiB0aGUgY3VycmVudCBzdG9yZWQgdmFsdWUgaXMgZXhhY3RseSB0aGUgc2FtZSBhcyB0aGUgcHJvdmlkZWQgYHZhbHVlYCxcbiAgICogICB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IHJldHVybi5cbiAgICpcbiAgICogICBPdGhlcndpc2UsIHdoZW4gdGhlIHVuZGVybHlpbmcgdmFsdWUgaXMgdXBkYXRlZCwgYHRoaXMuZGlzcGF0Y2hFdmVudGAgd2lsbFxuICAgKiAgIGJlIGNhbGxlZCB0byBkaXNwYXRjaCBhbiBgJ3VwZGF0ZSdgIGV2ZW50IHRvIG5vdGlmeSBhbGwgbGlzdGVuZXJzIHRoYXQgdGhlXG4gICAqICAgdW5kZXJseWluZyB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBuZXdWYWx1ZVxuICAgKiAgICAgZGF0YVR5cGU6IGFueVxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbmV3IHZhbHVlIHRvIHNldC4gSWYgdGhpcyBpcyBpdHNlbGYgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgdGhlblxuICAgKiAgICAgICBpdCB3aWxsIGJlIHVud3JhcHBlZCB0byBpdHMgdW5kZXJseWluZyB2YWx1ZSwgYW5kIHRoYXQgd2lsbCBiZSB1c2VkIGFzIHRoZSB2YWx1ZSBpbnN0ZWFkLlxuICAgKiAgIC0gbmFtZTogb3B0aW9uc1xuICAgKiAgICAgb3B0aW9uYWw6IHRydWVcbiAgICogICAgIGRhdGFUeXBlOiBvYmplY3RcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgQW4gb2JqZWN0IHRvIHByb3ZpZGVkIG9wdGlvbnMgZm9yIHRoZSBvcGVyYXRpb24uIFRoZSBzaGFwZSBvZiB0aGlzIG9iamVjdCBpcyBgeyBkaXNwYXRjaFVwZGF0ZUV2ZW50OiBib29sZWFuIH1gLlxuICAgKiAgICAgICBJZiBgb3B0aW9ucy5kaXNwYXRjaFVwZGF0ZUV2ZW50YCBlcXVhbHMgYGZhbHNlYCwgdGhlbiBubyBgJ3VwZGF0ZSdgIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCB0byBsaXN0ZW5lcnMuXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IElmIHRoZSB1bmRlcmx5aW5nIHN0b3JlZCB2YWx1ZSBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIHRoZSB2YWx1ZSBwcm92aWRlZCxcbiAgICogICAgIHRoZW4gbm90aGluZyB3aWxsIGhhcHBlbiwgYW5kIHRoZSBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuLlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFRoZSB1bmRlcmx5aW5nIHZhbHVlIGlzIHVwZGF0ZWQgKmJlZm9yZSogZGlzcGF0Y2hpbmcgZXZlbnRzLlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IGBEeW5hbWljUHJvcGVydHlgIHByb3RlY3RzIGFnYWluc3QgY3ljbGljIGV2ZW50IGNhbGxiYWNrcy4gSWYgYW5cbiAgICogICAgIGV2ZW50IGNhbGxiYWNrIGFnYWluIHNldHMgdGhlIHVuZGVybHlpbmcgYER5bmFtaWNQcm9wZXJ0eWAgdmFsdWUsIHRoZW5cbiAgICogICAgIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCwgYnV0IG5vIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCAodG8gcHJldmVudCBldmVudCBsb29wcykuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogWW91IGNhbiBub3Qgc2V0IGEgYER5bmFtaWNQcm9wZXJ0eWAgdG8gYW5vdGhlciBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAgIElmIHRoaXMgbWV0aG9kIHJlY2VpdmVzIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIGl0IHdpbGwgdXNlIHRoZSBzdG9yZWQgdmFsdWVcbiAgICogICAgIG9mIHRoYXQgaW5zdGFuY2UgaW5zdGVhZCAoYnkgY2FsbGluZyBAc2VlIER5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mOykuXG4gICAqL1xuICBbRFlOQU1JQ19QUk9QRVJUWV9TRVRdKF9uZXdWYWx1ZSwgX29wdGlvbnMpIHtcbiAgICBsZXQgbmV3VmFsdWUgPSBfbmV3VmFsdWU7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUobmV3VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpXG4gICAgICBuZXdWYWx1ZSA9IG5ld1ZhbHVlLnZhbHVlT2YoKTtcblxuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID09PSBuZXdWYWx1ZSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10pIHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IHRydWU7XG5cbiAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmIChvcHRpb25zLmRpc3BhdGNoVXBkYXRlRXZlbnQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCB1cGRhdGVFdmVudCA9IG5ldyBFdmVudCgndXBkYXRlJyk7XG5cbiAgICAgIHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO1xuICAgICAgdXBkYXRlRXZlbnQub2xkVmFsdWUgPSBvbGRWYWx1ZTtcbiAgICAgIHVwZGF0ZUV2ZW50LnZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh1cGRhdGVFdmVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10gPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEVMRU1FTlRfREVGSU5JVElPTl9UWVBFLFxuICBNWVRISVhfVFlQRSxcbiAgUVVFUllfRU5HSU5FX1RZUEUsXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuY29uc3QgU1VCU1RJVFVURV9DSEFSX0NPREUgPSAyNjtcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IEVsZW1lbnRzXG4gKiBncm91cE5hbWU6IEVsZW1lbnRzXG4gKiBkZXNjOiB8XG4gKiAgIGBpbXBvcnQgeyBFbGVtZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgVXRpbGl0eSBhbmQgZWxlbWVudCBidWlsZGluZyBmdW5jdGlvbnMgZm9yIHRoZSBET00uXG4gKi9cblxuY29uc3QgSVNfUFJPUF9OQU1FICAgID0gL15wcm9wXFwkLztcbmNvbnN0IElTX1RBUkdFVF9QUk9QICA9IC9ecHJvdG90eXBlfGNvbnN0cnVjdG9yJC87XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50RGVmaW5pdGlvbiB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtNWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUsXG4gICAgICB9LFxuICAgICAgJ3RhZ05hbWUnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGFnTmFtZSxcbiAgICAgIH0sXG4gICAgICAnYXR0cmlidXRlcyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBhdHRyaWJ1dGVzIHx8IHt9LFxuICAgICAgfSxcbiAgICAgICdjaGlsZHJlbic6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBjaGlsZHJlbiB8fCBbXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICB0b1N0cmluZyhfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gICAgbGV0IHRhZ05hbWUgPSB0aGlzLnRhZ05hbWU7XG4gICAgaWYgKHRhZ05hbWUgPT09ICcjdGV4dCcpXG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnZhbHVlLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG5cbiAgICBsZXQgYXR0cnMgPSAodGFnTmFtZSA9PT0gJyNmcmFnbWVudCcpID8gbnVsbCA6ICgoYXR0cmlidXRlcykgPT4ge1xuICAgICAgbGV0IHBhcnRzID0gW107XG5cbiAgICAgIGZvciAobGV0IFsgYXR0cmlidXRlTmFtZSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLnRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgICAgcGFydHMucHVzaChuYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcnRzLnB1c2goYCR7bmFtZX09XCIke2VuY29kZUF0dHJpYnV0ZVZhbHVlKHZhbHVlKX1cImApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xuICAgIH0pKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgY2hpbGRyZW4gPSAoKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9PSBmYWxzZSAmJiAhT2JqZWN0LmlzKGNoaWxkLCBOYU4pKSlcbiAgICAgICAgLm1hcCgoY2hpbGQpID0+ICgoY2hpbGQgJiYgdHlwZW9mIGNoaWxkLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IGNoaWxkLnRvU3RyaW5nKG9wdGlvbnMpIDogKCcnICsgY2hpbGQpKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH0pKHRoaXMuY2hpbGRyZW4pO1xuXG4gICAgaWYgKHRhZ05hbWUgPT09ICcjZnJhZ21lbnQnKVxuICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuXG4gICAgLy8gdGhpcyB3aWxsIG1vcmUgY29tbW9ubHkgbG9vayBsaWtlIHdyaXR0ZW4gaHRtbFxuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgZWxlbWVudFRhZ1N0YXJ0ID0gYDwke3RhZ05hbWV9JHsoYXR0cnMpID8gYCAke2F0dHJzfWAgOiAnJ30+YDtcbiAgICBsZXQgZWxlbWVudFRhZ0VuZCAgID0gYDwvJHt0YWdOYW1lfT5gO1xuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCAnbWFza0hUTUwnKSkge1xuICAgICAgbGV0IGNoYXJDb2RlID0gKHR5cGVvZiBvcHRpb25zLm1hc2tIVE1MID09PSAnbnVtYmVyJykgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKFNVQlNUSVRVVEVfQ0hBUl9DT0RFKSA6IG9wdGlvbnMubWFza0hUTUw7XG4gICAgICBjb25zdCB3aXBlQmxhbmsgPSAoY29udGVudCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKC8uL2csIGNoYXJDb2RlKTtcbiAgICAgIH07XG5cbiAgICAgIGVsZW1lbnRUYWdTdGFydCA9IHdpcGVCbGFuayhlbGVtZW50VGFnU3RhcnQpO1xuICAgICAgZWxlbWVudFRhZ0VuZCA9IHdpcGVCbGFuayhlbGVtZW50VGFnRW5kKTtcblxuICAgICAgaWYgKG9wdGlvbnMubWFza0NoaWxkcmVuUGF0dGVybiAmJiBvcHRpb25zLm1hc2tDaGlsZHJlblBhdHRlcm4udGVzdCh0YWdOYW1lKSlcbiAgICAgICAgY2hpbGRyZW4gPSB3aXBlQmxhbmsoY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtlbGVtZW50VGFnU3RhcnR9JHsoaXNWb2lkVGFnKHRhZ05hbWUpKSA/ICcnIDogYCR7Y2hpbGRyZW59JHtlbGVtZW50VGFnRW5kfWB9YDtcbiAgfVxuXG4gIHRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykge1xuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjZnJhZ21lbnQnKVxuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQuYnVpbGQob3duZXJEb2N1bWVudCwgdGVtcGxhdGVPcHRpb25zKSk7XG5cbiAgICBsZXQgYXR0cmlidXRlcyAgICA9IHRoaXMuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZXNwYWNlVVJJICA9IGF0dHJpYnV0ZXMubmFtZXNwYWNlVVJJO1xuICAgIGxldCBvcHRpb25zO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5pcylcbiAgICAgIG9wdGlvbnMgPSB7IGlzOiB0aGlzLmF0dHJpYnV0ZXMuaXMgfTtcblxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjdGV4dCcpXG4gICAgICByZXR1cm4gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyaWJ1dGVzLnZhbHVlIHx8ICcnKSwgdGVtcGxhdGVPcHRpb25zKTtcblxuICAgIGlmIChuYW1lc3BhY2VVUkkpXG4gICAgICBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2UgaWYgKGlzU1ZHRWxlbWVudCh0aGlzLnRhZ05hbWUpKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHRoaXMudGFnTmFtZSwgb3B0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZ05hbWUpO1xuXG4gICAgY29uc3QgZXZlbnROYW1lcyA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGNvbnN0IGhhbmRsZUF0dHJpYnV0ZSA9IChlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBfYXR0cmlidXRlVmFsdWUpID0+IHtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gX2F0dHJpYnV0ZVZhbHVlO1xuICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgIFV0aWxzLmNyZWF0ZVNjb3BlKGVsZW1lbnQsIHRlbXBsYXRlT3B0aW9ucy5zY29wZSksIC8vIHRoaXNcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksXG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbW9kaWZpZWRBdHRyaWJ1dGVOYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBEeW5hbWljIGJpbmRpbmdzIGFyZSBub3QgYWxsb3dlZCBmb3IgcHJvcGVydGllc1xuICAgIGNvbnN0IGhhbmRsZVByb3BlcnR5ID0gKGVsZW1lbnQsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSkgPT4ge1xuICAgICAgbGV0IG5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZShJU19QUk9QX05BTUUsICcnKTtcbiAgICAgIGVsZW1lbnRbbmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgIH07XG5cbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICBoYW5kbGVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQgY2hpbGQgICAgICAgICA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBsZXQgY2hpbGRFbGVtZW50ICA9IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRFbGVtZW50KSlcbiAgICAgICAgICBjaGlsZEVsZW1lbnQuZmxhdChJbmZpbml0eSkuZm9yRWFjaCgoY2hpbGQpID0+IGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvY2Vzc0VsZW1lbnRzLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgZWxlbWVudCxcbiAgICAgIHtcbiAgICAgICAgLi4udGVtcGxhdGVPcHRpb25zLFxuICAgICAgICBwcm9jZXNzRXZlbnRDYWxsYmFja3M6IGZhbHNlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG59XG5cbmNvbnN0IElTX0hUTUxfU0FGRV9DSEFSQUNURVIgPSAvXltcXHNhLXpBLVowLTlfLV0kLztcbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvLi9nLCAobSkgPT4ge1xuICAgIHJldHVybiAoSVNfSFRNTF9TQUZFX0NIQVJBQ1RFUi50ZXN0KG0pKSA/IG0gOiBgJiMke20uY2hhckNvZGVBdCgwKX07YDtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVBdHRyaWJ1dGVWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvW1wiJl0vZywgKG0pID0+IHtcbiAgICByZXR1cm4gYCYjJHttLmNoYXJDb2RlQXQoMCl9O2A7XG4gIH0pO1xufVxuXG5jb25zdCBJU19WT0lEX1RBRyA9IC9eYXJlYXxiYXNlfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNWb2lkVGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1ZPSURfVEFHLnRlc3QodGFnTmFtZS5zcGxpdCgnOicpLnNsaWNlKC0xKVswXSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWROb2RlVHlwZShpdGVtKSB7XG4gIGlmICghaXRlbSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBOb2RlKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGl0ZW1bTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeVRlbXBsYXRlKG93bmVyRG9jdW1lbnQsIG5hbWVPcklEKSB7XG4gIGlmIChuYW1lT3JJRCBpbnN0YW5jZW9mIE5vZGUpXG4gICAgcmV0dXJuIG5hbWVPcklEO1xuXG4gIGlmICghb3duZXJEb2N1bWVudClcbiAgICByZXR1cm47XG5cbiAgbGV0IHJlc3VsdCA9IG93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZU9ySUQpO1xuICBpZiAoIXJlc3VsdClcbiAgICByZXN1bHQgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtuYW1lT3JJRH1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7bmFtZU9ySUR9XCIgaV1gKTtcblxuICBpZiAoIXJlc3VsdClcbiAgICByZXN1bHQgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobmFtZU9ySUQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVNZXJnZUZyYWdtZW50KG93bmVyRG9jdW1lbnQsIG5vZGUpIHtcbiAgbGV0IGZyYWdtZW50ICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICBsZXQgc2VsZWN0b3JzID0gKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWZyb20nKSB8fCAnJykuc3BsaXQoJywnKS5tYXAoKChwYXJ0KSA9PiBwYXJ0LnRyaW0oKSkpLmZpbHRlcihCb29sZWFuKTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBzZWxlY3RvcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBzZWxlY3RvciAgPSBzZWxlY3RvcnNbaV07XG4gICAgbGV0IGVsZW1lbnQgICA9IHF1ZXJ5VGVtcGxhdGUob3duZXJEb2N1bWVudCwgc2VsZWN0b3IpO1xuICAgIGlmIChlbGVtZW50KVxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyBlbGVtZW50LmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpIDogZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG5jb25zdCBJU19URU1QTEFURV9NRVJHRV9FTEVNRU5UID0gL15teXRoaXgtbWVyZ2UkL2k7XG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0VsZW1lbnRzKF9ub2RlLCBfb3B0aW9ucykge1xuICBsZXQgbm9kZSA9IF9ub2RlO1xuICBpZiAoIW5vZGUpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHNjb3BlICAgICAgICAgPSBvcHRpb25zLnNjb3BlO1xuICBpZiAoIXNjb3BlKSB7XG4gICAgc2NvcGUgPSBVdGlscy5jcmVhdGVTY29wZShub2RlKTtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZSB9O1xuICB9XG5cbiAgbGV0IGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yID0gKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSA9PT0gdHJ1ZSkgPyB1bmRlZmluZWQgOiBvcHRpb25zLmRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yO1xuICBsZXQgY2hpbGRyZW4gICAgICAgICAgICAgICAgICAgICAgPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG5cbiAgaWYgKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSAhPT0gdHJ1ZSAmJiAhZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IpIHtcbiAgICBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgfTtcbiAgfVxuXG4gIGxldCBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSBmYWxzZTtcbiAgaWYgKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yICYmIFV0aWxzLnNwZWNpYWxDbG9zZXN0KG5vZGUsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKSlcbiAgICBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5oZWxwZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5oZWxwZXIuY2FsbCh0aGlzLCB7IHNjb3BlLCBvcHRpb25zLCBub2RlLCBjaGlsZHJlbiwgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciB9KTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSlcbiAgICAgIG5vZGUgPSByZXN1bHQ7XG4gICAgZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IG93bmVyRG9jdW1lbnQgPSBvcHRpb25zLm93bmVyRG9jdW1lbnQgfHwgc2NvcGUub3duZXJEb2N1bWVudCB8fCBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSB7XG4gICAgaWYgKCFpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUobm9kZSwgb3B0aW9ucyk7XG4gICAgICBpZiAoKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiByZXN1bHQuc29tZShpc1ZhbGlkTm9kZVR5cGUpKSB8fCBpc1ZhbGlkTm9kZVR5cGUocmVzdWx0KSkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICAgIGxldCBmcmFnbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IGl0ZW0uYnVpbGQob3duZXJEb2N1bWVudCwgeyBzY29wZSB9KTtcbiAgICAgICAgICAgIGlmICghZWxlbWVudHMpXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50cykpXG4gICAgICAgICAgICAgIGVsZW1lbnRzLmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGVsZW1lbnQpID0+IGZyYWdtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGVuZFRvKGZyYWdtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoJycgKyBpdGVtKSk7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgIG5vZGUubm9kZVZhbHVlID0gIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICBpZiAoSVNfVEVNUExBVEVfTUVSR0VfRUxFTUVOVC50ZXN0KG5vZGUudGFnTmFtZSkpIHtcbiAgICAgIGxldCBmcmFnbWVudCA9IGNvbXBpbGVNZXJnZUZyYWdtZW50KG93bmVyRG9jdW1lbnQsIG5vZGUpO1xuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIGZyYWdtZW50LCB7IC4uLm9wdGlvbnMsIHNjb3BlIH0pO1xuICAgIH1cblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChub2RlKTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMucHJvY2Vzc0V2ZW50Q2FsbGJhY2tzICE9PSBmYWxzZSkge1xuICAgICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgICAgVXRpbHMuY3JlYXRlU2NvcGUobm9kZSwgc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChVdGlscy5pc1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5vZGUpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyAuLi5vcHRpb25zLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvY2Vzc0NoaWxkcmVuID09PSBmYWxzZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgY2hpbGROb2RlLCBvcHRpb25zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSAmJiByZXN1bHQgIT09IGNoaWxkTm9kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQocmVzdWx0LCBjaGlsZE5vZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBOT09QXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZChwYXJlbnROb2RlLCBjaGlsZE5vZGUpIHtcbiAgaWYgKCFwYXJlbnROb2RlIHx8ICFjaGlsZE5vZGUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20ocGFyZW50Tm9kZS5jaGlsZE5vZGVzKSkge1xuICAgIGlmIChjaGlsZCA9PT0gY2hpbGROb2RlKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFCYXNlVXRpbHMuaXNUeXBlKHRhZ05hbWUsICc6OlN0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBjb25zdCB3cmFuZ2xlQ2hpbGRyZW4gPSAoY2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiBjaGlsZHJlbi5mbGF0KEluZmluaXR5KS5tYXAoKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgICByZXR1cm4gdmFsdWUoKTtcblxuICAgICAgICBpZiAodmFsdWVbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSlcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpXG4gICAgICAgICAgcmV0dXJuIHdyYW5nbGVDaGlsZHJlbih2YWx1ZS5nZXRVbmRlcmx5aW5nQXJyYXkoKSk7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgICAgICByZXR1cm4gbm9kZVRvRWxlbWVudERlZmluaXRpb24odmFsdWUpO1xuXG4gICAgICAgIGlmICghQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9O1xuXG4gICAgbGV0IGNoaWxkcmVuID0gd3JhbmdsZUNoaWxkcmVuKF9jaGlsZHJlbiB8fCBbXSk7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZTogKCcnICsgbm9kZS5ub2RlVmFsdWUpIH0pO1xuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBub2RlLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG5cbiAgaWYgKHR5cGVvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gIH1cblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbigobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSA/ICcjZnJhZ21lbnQnIDogbm9kZS50YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbik7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gL14odGVtcGxhdGUpJC9pO1xuXG4vKipcbiAgICogcGFyZW50OiBFbGVtZW50c1xuICAgKiBncm91cE5hbWU6IEVsZW1lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBbG1vc3QgbGlrZSBgT2JqZWN0LmFzc2lnbmAsIG1lcmdlIGFsbCBjb21wb25lbnQgY2hpbGRyZW4gaW50byBhIHNpbmdsZSBub2RlICh0aGUgYHRhcmdldGApLlxuICAgKlxuICAgKiAgIFRoaXMgaXMgXCJ0ZW1wbGF0ZSBpbnRlbGxpZ2VudFwiLCBtZWFuaW5nIGZvciBgPHRlbXBsYXRlPmAgZWxlbWVudHMgc3BlY2lmaWNhbGx5LCBpdCB3aWxsIGV4ZWN1dGVcbiAgICogICBgY2hpbGRyZW4gPSB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzYCB0byBjbG9uZSBhbGwgdGhlIGNoaWxkIG5vZGVzLCBhbmQgbm90XG4gICAqICAgbW9kaWZ5IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZS4gSXQgaXMgYWxzbyB0ZW1wbGF0ZSBpbnRlbGxpZ2VudCBieSB0aGUgZmFjdCB0aGF0IGlmIHRoZSBgdGFyZ2V0YCBpc1xuICAgKiAgIGEgdGVtcGxhdGUsIGl0IHdpbGwgYWRkIHRoZSBjaGlsZHJlbiB0byBgY29udGVudGAgcHJvcGVybHkuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IHRhcmdldFxuICAgKiAgICAgZGF0YVR5cGVzOiBOb2RlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSB0YXJnZXQgTm9kZSB0byBtZXJnZSBhbGwgY2hpbGRyZW4gaW50by4gSWYgdGhpcyBOb2RlIGlzIGEgYDx0ZW1wbGF0ZT5gIE5vZGUsIHRoZW4gaXQgd2lsbFxuICAgKiAgICAgICBwbGFjZSBhbGwgdGhlIG1lcmdlZCBjaGlsZHJlbiBpbnRvIGB0ZW1wbGF0ZS5jb250ZW50YC5cbiAgICogbm90ZXM6XG4gICAqICAgLSBBbnkgdGVtcGxhdGUgTm9kZSB3aWxsIGJlIGNsb25lZCwgYW5kIHNvIHRoZSBvcmlnaW5hbCB3aWxsIG5vdCBiZSBtb2RpZmllZC4gQWxsIG90aGVyIG5vZGVzIGFyZSAqKk5PVCoqXG4gICAqICAgICBjbG9uZWQgYmVmb3JlIHRoZSBtZXJnZSwgYW5kIHNvIHdpbGwgYmUgc3RyaXBwZWQgb2YgdGhlaXIgY2hpbGRyZW4uXG4gICAqICAgLSBNYWtlIGNlcnRhaW4geW91IGRlZXAgY2xvbmUgYW55IGVsZW1lbnQgZmlyc3QgKGV4Y2VwdCB0ZW1wbGF0ZXMpIGlmIHlvdSBkb24ndCB3YW50IHRoZSBwcm92aWRlZCBlbGVtZW50c1xuICAgKiAgICAgdG8gYmUgbW9kaWZpZWQuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBOb2RlOyBUaGUgcHJvdmlkZWQgYHRhcmdldGAsIHdpdGggYWxsIGNoaWxkcmVuIG1lcmdlZCAoYWRkZWQpIGludG8gaXQuXG4gICAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgcmV0dXJuIHRhcmdldDtcblxuICBsZXQgdGFyZ2V0SXNUZW1wbGF0ZSA9IElTX1RFTVBMQVRFLnRlc3QodGFyZ2V0LnRhZ05hbWUpO1xuICBmb3IgKGxldCBvdGhlciBvZiBvdGhlcnMpIHtcbiAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIE5vZGUpKVxuICAgICAgY29udGludWU7XG5cbiAgICBsZXQgY2hpbGROb2RlcyA9IChJU19URU1QTEFURS50ZXN0KG90aGVyLnRhZ05hbWUpKSA/IG90aGVyLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXMgOiBvdGhlci5jaGlsZE5vZGVzO1xuICAgIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20oY2hpbGROb2RlcykpIHtcbiAgICAgIGxldCBjb250ZW50ID0gKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpID8gY2hpbGQuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiBjaGlsZDtcbiAgICAgIGlmICh0YXJnZXRJc1RlbXBsYXRlKVxuICAgICAgICB0YXJnZXQuY29udGVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IElTX1NWR19FTEVNRU5UX05BTUUgPSAvXihhbHRnbHlwaHxhbHRnbHlwaGRlZnxhbHRnbHlwaGl0ZW18YW5pbWF0ZXxhbmltYXRlQ29sb3J8YW5pbWF0ZU1vdGlvbnxhbmltYXRlVHJhbnNmb3JtfGFuaW1hdGlvbnxjaXJjbGV8Y2xpcFBhdGh8Y29sb3JQcm9maWxlfGN1cnNvcnxkZWZzfGRlc2N8ZGlzY2FyZHxlbGxpcHNlfGZlYmxlbmR8ZmVjb2xvcm1hdHJpeHxmZWNvbXBvbmVudHRyYW5zZmVyfGZlY29tcG9zaXRlfGZlY29udm9sdmVtYXRyaXh8ZmVkaWZmdXNlbGlnaHRpbmd8ZmVkaXNwbGFjZW1lbnRtYXB8ZmVkaXN0YW50bGlnaHR8ZmVkcm9wc2hhZG93fGZlZmxvb2R8ZmVmdW5jYXxmZWZ1bmNifGZlZnVuY2d8ZmVmdW5jcnxmZWdhdXNzaWFuYmx1cnxmZWltYWdlfGZlbWVyZ2V8ZmVtZXJnZW5vZGV8ZmVtb3JwaG9sb2d5fGZlb2Zmc2V0fGZlcG9pbnRsaWdodHxmZXNwZWN1bGFybGlnaHRpbmd8ZmVzcG90bGlnaHR8ZmV0aWxlfGZldHVyYnVsZW5jZXxmaWx0ZXJ8Zm9udHxmb250RmFjZXxmb250RmFjZUZvcm1hdHxmb250RmFjZU5hbWV8Zm9udEZhY2VTcmN8Zm9udEZhY2VVcml8Zm9yZWlnbk9iamVjdHxnfGdseXBofGdseXBoUmVmfGhhbmRsZXJ8aEtlcm58aW1hZ2V8bGluZXxsaW5lYXJncmFkaWVudHxsaXN0ZW5lcnxtYXJrZXJ8bWFza3xtZXRhZGF0YXxtaXNzaW5nR2x5cGh8bVBhdGh8cGF0aHxwYXR0ZXJufHBvbHlnb258cG9seWxpbmV8cHJlZmV0Y2h8cmFkaWFsZ3JhZGllbnR8cmVjdHxzZXR8c29saWRDb2xvcnxzdG9wfHN2Z3xzd2l0Y2h8c3ltYm9sfHRicmVha3x0ZXh0fHRleHRwYXRofHRyZWZ8dHNwYW58dW5rbm93bnx1c2V8dmlld3x2S2VybikkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1NWR19FTEVNRU5UX05BTUUudGVzdCh0YWdOYW1lKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuZXhwb3J0IGNvbnN0IEVsZW1lbnRHZW5lcmF0b3IgPSBuZXcgUHJveHkoXG4gIHtcbiAgICBUZXJtLFxuICAgICRURVhUOiBUZXJtLFxuICB9LFxuICB7XG4gICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BOYW1lKSB7XG4gICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgaWYgKElTX1NWR19FTEVNRU5UX05BTUUudGVzdChwcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gU1ZHIGVsZW1lbnRzXG4gICAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSwgeyBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTk9PUFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSxcbik7XG4iLCJpbXBvcnQgZGVlcE1lcmdlIGZyb20gJ2RlZXBtZXJnZSc7XG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQge1xuICBEeW5hbWljUHJvcGVydHksXG59IGZyb20gJy4vZHluYW1pYy1wcm9wZXJ0eS5qcyc7XG5cbmltcG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICByZXF1aXJlLFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlMYW5ndWFnZVBhY2sgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wYWNrJztcblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgc2V0IGF0dHIkZGF0YU15dGhpeFNyYyhbIHZhbHVlIF0pIHtcbiAgICAvLyBOT09QLi4uIFRyYXAgdGhpcyBiZWNhdXNlIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsb2FkIGEgcGFydGlhbCBoZXJlXG4gIH1cblxuICBvbk11dGF0aW9uQWRkZWQobXV0YXRpb24pIHtcbiAgICAvLyBXaGVuIGFkZGVkIHRvIHRoZSBET00sIGVuc3VyZSB0aGF0IHdlIHdlcmVcbiAgICAvLyBhZGRlZCB0byB0aGUgcm9vdCBvZiBhIGxhbmd1YWdlIHByb3ZpZGVyLi4uXG4gICAgLy8gSWYgbm90LCB0aGVuIG1vdmUgb3Vyc2VsdmVzIHRvIHRoZSByb290XG4gICAgLy8gb2YgdGhlIGxhbmd1YWdlIHByb3ZpZGVyLlxuICAgIGxldCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICBpZiAocGFyZW50TGFuZ3VhZ2VQcm92aWRlciAmJiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICE9PSBtdXRhdGlvbi50YXJnZXQpXG4gICAgICBCYXNlVXRpbHMubmV4dFRpY2soKCkgPT4gcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5pbnNlcnRCZWZvcmUodGhpcywgcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKSk7XG4gIH1cbn1cblxuY29uc3QgSVNfSlNPTl9FTkNUWVBFICAgICAgICAgICAgICAgICA9IC9eYXBwbGljYXRpb25cXC9qc29uL2k7XG5jb25zdCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcic7XG5cbiAgc2V0IGF0dHIkbGFuZyhbIG5ld1ZhbHVlLCBvbGRWYWx1ZSBdKSB7XG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrc0Zvckxhbmd1YWdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBvbk11dGF0aW9uQ2hpbGRBZGRlZChub2RlKSB7XG4gICAgaWYgKG5vZGUubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICB0aGlzLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgLy8gUmVsb2FkIGxhbmd1YWdlIHBhY2tzIGFmdGVyIGFkZGl0aW9uc1xuICAgICAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UodGhpcy5nZXRDdXJyZW50TG9jYWxlKCkpO1xuICAgICAgfSwgTEFOR1VBR0VfUEFDS19JTlNFUlRfR1JBQ0VfVElNRSwgJ3JlbG9hZExhbmd1YWdlUGFja3MnKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Rlcm1zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGkxOG4oX3BhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGxldCBwYXRoICAgID0gYGdsb2JhbC5pMThuLiR7X3BhdGh9YDtcbiAgICBsZXQgcmVzdWx0ICA9IFV0aWxzLmZldGNoUGF0aCh0aGlzLnRlcm1zLCBwYXRoKTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgIHJldHVybiBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgcGF0aCwgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKSA/ICcnIDogZGVmYXVsdFZhbHVlKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDdXJyZW50TG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJztcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgc3VwZXIubW91bnRlZCgpO1xuXG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldFNvdXJjZXNGb3JMYW5nKGxhbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoYG15dGhpeC1sYW5ndWFnZS1wYWNrW2xhbmdePVwiJHtsYW5nLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKTtcbiAgfVxuXG4gIGxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UoX2xhbmcpIHtcbiAgICBsZXQgbGFuZyAgICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudHMgID0gdGhpcy5nZXRTb3VyY2VzRm9yTGFuZyhsYW5nKS5maWx0ZXIoKHNvdXJjZUVsZW1lbnQpID0+IEJhc2VVdGlscy5pc05vdE5PRShzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnRzIHx8ICFzb3VyY2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogTm8gXCJteXRoaXgtbGFuZ3VhZ2UtcGFja1wiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cyk7XG4gIH1cblxuICBhc3luYyBsb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgcHJvbWlzZXMgID0gc291cmNlRWxlbWVudHMubWFwKChzb3VyY2VFbGVtZW50KSA9PiB0aGlzLmxvYWRMYW5ndWFnZVBhY2sobGFuZywgc291cmNlRWxlbWVudCkpO1xuICAgICAgbGV0IGFsbFRlcm1zICA9IChhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQocHJvbWlzZXMpKS5tYXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ2Z1bGZpbGxlZCcpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgIGxldCB0ZXJtcyAgICAgICAgID0gZGVlcE1lcmdlLmFsbChBcnJheS5mcm9tKG5ldyBTZXQoYWxsVGVybXMpKSk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpO1xuXG4gICAgICB0aGlzLnRlcm1zID0gY29tcGlsZWRUZXJtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgbGFuZ3VhZ2UgcGFja3MnLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IHJlcXVpcmUuY2FsbCh0aGlzLCBzcmMsIHsgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50IH0pO1xuICAgICAgbGV0IHR5cGUgICAgICAgICAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZW5jdHlwZScpIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgIGlmIChJU19KU09OX0VOQ1RZUEUudGVzdCh0eXBlKSkge1xuICAgICAgICAvLyBIYW5kbGUgSlNPTlxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgRG9uJ3Qga25vdyBob3cgdG8gbG9hZCBhIGxhbmd1YWdlIHBhY2sgb2YgdHlwZSBcIiR7dHlwZX1cImApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcykge1xuICAgIGNvbnN0IHdhbGtUZXJtcyA9ICh0ZXJtcywgcmF3S2V5UGF0aCkgPT4ge1xuICAgICAgbGV0IGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRlcm1zKTtcbiAgICAgIGxldCB0ZXJtc0NvcHkgPSB7fTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgICAgICAgICA9IGtleXNbaV07XG4gICAgICAgIGxldCB2YWx1ZSAgICAgICA9IHRlcm1zW2tleV07XG4gICAgICAgIGxldCBuZXdLZXlQYXRoICA9IHJhd0tleVBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgICAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gd2Fsa1Rlcm1zKHZhbHVlLCBuZXdLZXlQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgbmV3S2V5UGF0aC5qb2luKCcuJyksIHZhbHVlKTtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICAgIHByb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVybXNDb3B5O1xuICAgIH07XG5cbiAgICByZXR1cm4gd2Fsa1Rlcm1zKHRlcm1zLCBbICdnbG9iYWwnLCAnaTE4bicgXSk7XG4gIH1cbn1cblxuTXl0aGl4VUlMYW5ndWFnZVBhY2sucmVnaXN0ZXIoKTtcbk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlMYW5ndWFnZVBhY2sgPSBNeXRoaXhVSUxhbmd1YWdlUGFjaztcbmdsb2JhbFRoaXMubXl0aGl4VUkuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyID0gTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyO1xuIiwiaW1wb3J0ICogYXMgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgVEVNUExBVEVfVEVNUExBVEUgPSAvXihcXCp8XFx8XFwqfFxcKlxcfCkkLztcblxuLyoqXG4gKiB0eXBlOiBNeXRoaXhFbGVtZW50XG4gKiBuYW1lOiBNeXRoaXhVSVJlcXVpcmVcbiAqIGdyb3VwTmFtZTogTXl0aGl4RWxlbWVudHNcbiAqIGRlc2M6IHxcbiAqICAgYGBgamF2YXNjcmlwdFxuICogICBpbXBvcnQgeyBNeXRoaXhFbGVtZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICBjb25zdCB7XG4gKiAgICAgTXl0aGl4VUlSZXF1aXJlLFxuICogICB9ID0gTXl0aGl4RWxlbWVudHM7XG4gKiAgIGBgYFxuICpcbiAqICAgTXl0aGl4VUlSZXF1aXJlIGlzIGFuIEVsZW1lbnQgdGhhdCB3aWxsIGxvYWQgb3RoZXIgcmVzb3VyY2VzLiBJdCBpcyBpbnNwaXJlZCBieSBhbmQgbmFtZWQgYWZ0ZXIgYHJlcXVpcmVgIGluIE5vZGUuIEl0IHdvcmtzIHZlcnkgc2ltaWxhcmx5IGFzIHdlbGwsIHNvIG5vdCB0b28gbXVjaCBuZWVkcyB0byBiZSBleHBsYWluZWQgYWJvdXQgaXQuXG4gKlxuICogICBFeGNlcHQgTXl0aGl4IFVJIHN0YW5kYXJkIGNvbXBvbmVudCBmaWxlIHN0cnVjdHVyZSBtYXliZS4uLiBZZWFoLCBtYXliZSB3ZSBzaG91bGQgZGlzY3VzcyB0aGF0LlxuICpcbiAqICAgVGhlIGA8bXl0aGl4LXJlcXVpcmUgc3JjPVwiLi9jb21wb25lbnRzL3dpZGdldC5odG1sXCI+YCB0YWcgYWxsb3dzIHlvdSB0byBsb2FkIG90aGVyIHJlc291cmNlcyBzaW1wbHkgYnkgc3BlY2lmeWluZyBhIHBhdGguIFRoaXMgcGF0aCBjYW4gYmUgcmVsYXRpdmUsIG9yIGFic29sdXRlLiBUaGUgcGF0aCBjYW4gY29udGFpbiBxdWVyeSBwYXJhbWV0ZXJzLlxuICpcbiAqICAgWW91IG1heSBoYXZlIG5vdGljZWQgdGhhdCB0aGUgdGFnIG5hbWUgZG9lc24ndCBxdWl0ZSBtYXRjaCB0aGUgY2xhc3MgbmFtZSwgYE15dGhpeFVJUmVxdWlyZWAsIHZzIGA8bXl0aGl4LXJlcXVpcmU+YC4gVGhpcyBkZXZpYXRpb24gd2FzIGNob3NlbiBieSB0aGUgTXl0aGl4IGRldmVsb3BtZW50IHRlYW0gYmVjYXVzZSBNeXRoaXggaXMgYW4gZW50aXJlIGVjb3N5c3RlbSwgbm90IGp1c3QgYSBVSSBmcmFtZXdvcmsuIEZvciB0aGlzIHJlYXNvbiwgYW5kIGluIHBhcnQgdG8gYXZvaWQgZnV0dXJlIG5hbWluZyBjb2xsaXNpb25zLCB3ZSBoYXZlIGRlY2lkZWQgdGhhdCBpbiBjb2RlLCB0aGUgY2xhc3MgbmFtZSBzaG91bGQgY29udGFpbiB0aGUgYFVJYCBwYXJ0IHRvIGRlbGltaXQgaXQgZnJvbSBvdGhlciBNeXRoaXggdGVjaG5vbG9naWVzLiBOZXh0LCB3ZSBmZWx0IGNvbnN0YW50bHkgdHlwaW5nIGA8bXl0aGl4LXVpLXJlcXVpcmU+YCBpbiBIVE1MLCB2cyB0aGUgbmljZXIgYDxteXRoaXgtcmVxdWlyZT5gIHdhcyBraW5kYSBzaWxseS4gQmVzaWRlcywgaW4gSFRNTCwgeW91IEFSRSBpbiB0aGUgVUkgY29udGV4dCwgc28gd2h5IHJlcGVhdCBvdXJzZWx2ZXM/IEFueWhvdywgdGhpcyBpcyBqdXN0IGEgbGl0dGxlIG5vdGUgdG8ga2VlcCBpbiBtaW5kLiBUaGUgRWxlbWVudCBjbGFzcyBuYW1lcyBkbyBub3QgbWF0Y2ggdGhlIEVsZW1lbnQgYHRhZ05hbWVgIGZvciBNeXRoaXggVUkgc3RhbmRhcmQgY29tcG9uZW50cy5cbiAqXG4gKiAgIElmIGA8bXl0aGl4LXJlcXVpcmU+YCBpcyB1c2VkIHRvIGZldGNoIGEgSmF2YVNjcmlwdCByZXNvdXJjZSwgdGhlbiBpdCBiZWhhdmVzIGFsbW9zdCBpZGVudGljYWxseSB0byBhIGA8c2NyaXB0PmAgdGFnLiBJZiBob3dldmVyIGl0IGlzIGJlaW5nIHVzZWQgdG8gZmV0Y2ggYW5vdGhlciB0eXBlIG9mIGtub3duIHJlc291cmNlLCBzdWNoIGFzIHRleHQvaHRtbCwgdGhlbiBpdCB3aWxsIGJlaGF2ZSBkaWZmZXJlbnRseS5cbiAqXG4gKiAgIFdoZW4gYW4gSFRNTCBmaWxlIGlzIGZldGNoZWQgYnkgYSBgPG15dGhpeC1yZXF1aXJlPmAgZWxlbWVudCwgdGhlbiBhbnkgaW50ZXJuYWwgYDxzY3JpcHQ+YCwgYDxzdHlsZT5gLCBvciBvdGhlciB0YWcgdGhhdCBiZWxvbmdzIGluIHRoZSBgPGhlYWQ+YCB0YWcgd2lsbCBiZSBwbGFjZWQgaW4gdGhlIGA8aGVhZD5gIHRhZyBvZiB0aGUgZG9jdW1lbnQuIER1cGxpY2F0ZSBpbnNlcnRzIGFyZSBwcmV2ZW50ZWQgYnkgdXNlIG9mIHRhZyBpZHMuIElmIGEgdGFnIGluIHRoZSBgPGhlYWQ+YCBvZiB0aGUgZG9jdW1lbnQgYWxyZWFkeSBoYXMgdGhlIHNhbWUgaWQgYXMgb25lIE15dGhpeFVJUmVxdWlyZSBpcyB0cnlpbmcgdG8gaW5zZXJ0LCB0aGVuIE15dGhpeFVJUmVxdWlyZSB3aWxsIGFib3J0LCBhbmQgaXQgd29uJ3QgZHVwbGljYXRlIGluc2VydGluZyBzYWlkIGVsZW1lbnQuXG4gKlxuICogICBPdGhlciBlbGVtZW50cyBhcmUgdHJlYXRlZCBzcGVjaWFsbHkgYXMgd2VsbCB3aGVuIGVuY291bnRlcmVkIGluIHRoZSBsb2FkZWQgSFRNTCBmaWxlLiBCZWxvdyBpcyBhIHRhYmxlIG9mIHNwZWNpYWwgY2FzZXM6XG4gKlxuICogICB8IEVsZW1lbnRzIHwgTm90ZXMgfFxuICogICB8LS0tLS0tfC0tLS0tLS18XG4gKiAgIHwgYDxsaW5rPmAsIGA8c3R5bGU+YCwgYDxtZXRhPmAgfCBBcmUgYXBwZW5kZWQgdG8gdGhlIGA8aGVhZD5gIG9mIHRoZSBkb2N1bWVudC4gfFxuICogICB8IGA8c2NyaXB0PmAgfCBJcyBhcHBlbmRlZCB0byB0aGUgYDxoZWFkPmAgb2YgdGhlIGRvY3VtZW50IGFmdGVyIHRoZSBgc3JjYCBhdHRyaWJ1dGUgaXMgZnVsbHkgcmVzb2x2ZWQuIHxcbiAqICAgfCBgPHRlbXBsYXRlPmAgfCBJcyBhcHBlbmRlZCB0byB0aGUgYm90dG9tIG9mIHRoZSBgPGJvZHk+YCBvZiB0aGUgZG9jdW1lbnQuIHxcbiAqICAgfCBgPGJhc2U+YCwgYDxub3NjcmlwdD5gLCBgPHRpdGxlPmAgfCBBcmUgZGVsaWJlcmF0ZWx5IGRpc2NhcmRlZC4gfFxuICogICB8IEFsbCBvdGhlcnMgfCBBcmUgYXBwZW5kZWQgdG8gdGhlIGA8Ym9keT5gIG9mIHRoZSBkb2N1bWVudC4gfFxuICpcbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogYGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXI6IChjb250ZXh0OiB7IHNyYzogc3RyaW5nIHwgVVJMLCB1cmw6IFVSTCwgcGF0aDogc3RyaW5nLCBmaWxlTmFtZTogc3RyaW5nIH0pID0+IHN0cmluZyB8IFVSTGAgaXMgYSBtZXRob2QgdGhhdCBjYW4gYmUgZGVmaW5lZCBieSB0aGUgdXNlci4gV2hlbiBkZWZpbmVkLCBpdCB3aWxsIGJlIGNhbGxlZCBldmVyeSB0aW1lIEBzZWUgQ29tcG9uZW50cy5yZXNvbHZlVVJMOyBpcyBjYWxsZWQuIGBNeXRoaXhVSVJlcXVpcmVgIGNhbGxzIEBzZWUgQ29tcG9uZW50cy5yZXNvbHZlVVJMOyB0byByZXNvbHZlIFVSTHMsIGluY2x1ZGluZyBpbiBzdWIgYDxzY3JpcHQ+YCB0YWcgYHNyY2AgYXR0cmlidXRlcyBsb2FkZWQgZnJvbSByZXNvdXJjZXMuIEl0IGlzIHRoZSBpbnRlbnQgb2YgdGhpcyBtZXRob2QgdGhhdCBpdCB3aWxsIGdsb2JhbGx5IHJlc29sdmUgYWxsIFVSTHMgaW50ZXJuYWwgdG8gdGhlIE15dGhpeCBVSSBmcmFtZXdvcmsuIE9idmlvdXNseSBpdCB3b24ndCByZXNvbHZlIFVSTHMgZGlyZWN0bHkgZnJvbSBzdGF0aWMgYGltcG9ydGAgb3IgZHluYW1pYyBgaW1wb3J0KClgIHN0YXRlbWVudHMgaW4gSmF2YVNjcmlwdC4gVGhvc2UgYXJlIGhhbmRsZWQgYnkgdGhlIFtpbXBvcnRtYXBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9zY3JpcHQvdHlwZS9pbXBvcnRtYXApIHlvdSBzZXR1cCwgcmVtZW1iZXI/LlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIEFub3RoZXIgY29tcG9uZW50IGNhbiBiZSBsb2FkZWQgZHluYW1pY2FsbHktLXVzdWFsbHkgYnkgbG9hZGluZyBpdHMgY29ycmVzcG9uZGluZyBIVE1MIGZpbGUgKHdoaWNoIHdpbGwgZ2VuZXJhbGx5IHRoZW4gbG9hZCB0aGUgYDxzY3JpcHQ+YCByZXF1aXJlIGJ5IHRoZSBjb21wb25lbnQpLiBJbiB0aGUgZXhhbXBsZSBiZWxvdyB3ZSBhcmUgbG9hZGluZyB0aGUgc3RhbmRhcmQgbW9kYWwgY29tcG9uZW50IHByb3ZpZGVkIGJ5IE15dGhpeCBVSTpcbiAqICAgICBgYGBodG1sXG4gKiAgICAgPG15dGhpeC1yZXF1aXJlIHNyYz1cIkBjZG4vbXl0aGl4LXVpLW1vZGFsQCR7e21ham9yVmVyc2lvbn19L2Rpc3QvbXl0aGl4LXVpLW1vZGFsLmh0bWxcIj48L215dGhpeC1yZXF1aXJlPlxuICogICAgIGBgYFxuICovXG5cbmxldCBSRVFVSVJFX0hBTkRMRVJTID0gW107XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyUmVxdWlyZUhhbmRsZXIocGF0dGVybiwgY2FsbGJhY2spIHtcbiAgUkVRVUlSRV9IQU5ETEVSUy51bnNoaWZ0KHtcbiAgICBwYXR0ZXJuLFxuICAgIGNhbGxiYWNrLFxuICB9KTtcbn1cblxucmVnaXN0ZXJSZXF1aXJlSGFuZGxlcigvXFwuaHRtbCQvaSwgYXN5bmMgZnVuY3Rpb24oeyB1cmwsIG93bmVyRG9jdW1lbnQgfSkge1xuICBsZXQge1xuICAgIHJlc3BvbnNlLFxuICAgIGNhY2hlZCxcbiAgfSA9IGF3YWl0IENvbXBvbmVudC5yZXF1aXJlLmNhbGwoXG4gICAgdGhpcyxcbiAgICB1cmwsXG4gICAge1xuICAgICAgbWFnaWM6ICAgICAgICAgIGZhbHNlLFxuICAgICAgb3duZXJEb2N1bWVudDogIG93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsXG4gICAgfSxcbiAgKTtcblxuICBpZiAoY2FjaGVkKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG1hZ2ljOiAgICAgICAgdHJ1ZSxcbiAgICAgIG5vZGVIYW5kbGVyOiAgKG5vZGUsIHsgaXNIYW5kbGVkIH0pID0+IHtcbiAgICAgICAgaWYgKCFpc0hhbmRsZWQgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgIH0sXG4gICAgICBwcmVQcm9jZXNzOiAgICh7IHRlbXBsYXRlLCBjaGlsZHJlbiB9KSA9PiB7XG4gICAgICAgIGxldCBzdGFyVGVtcGxhdGUgPSBjaGlsZHJlbi5maW5kKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGxldCBkYXRhRm9yID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpO1xuICAgICAgICAgIHJldHVybiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSAmJiBURU1QTEFURV9URU1QTEFURS50ZXN0KGRhdGFGb3IpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFzdGFyVGVtcGxhdGUpXG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgIGxldCBkYXRhRm9yID0gc3RhclRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAoY2hpbGQgPT09IHN0YXJUZW1wbGF0ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgICAgICAgbGV0IHN0YXJDbG9uZSA9IHN0YXJUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGlmIChkYXRhRm9yID09PSAnKnwnKVxuICAgICAgICAgICAgICBjaGlsZC5jb250ZW50Lmluc2VydEJlZm9yZShzdGFyQ2xvbmUsIGNoaWxkLmNvbnRlbnQuY2hpbGROb2Rlc1swXSB8fCBudWxsKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5hcHBlbmRDaGlsZChzdGFyQ2xvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJUZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJUZW1wbGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfSxcbiAgICB9LFxuICApO1xuXG4gIHJldHVybiB0cnVlO1xufSk7XG5cbnJlZ2lzdGVyUmVxdWlyZUhhbmRsZXIoL1xcLmpzJC9pLCBhc3luYyBmdW5jdGlvbih7IHVybCwgb3duZXJEb2N1bWVudCB9KSB7XG4gIGxldCByZXN1bHQgPSBDb21wb25lbnQuaW5zZXJ0U2NyaXB0SW50b0hlYWQodXJsLCB7IG93bmVyRG9jdW1lbnQgfSk7XG4gIGNvbnNvbGUubG9nKHsgc2NyaXB0RWxlbWVudDogcmVzdWx0IH0pO1xuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlSZXF1aXJlIGV4dGVuZHMgQ29tcG9uZW50Lk15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHJlZ2lzdGVySGFuZGxlciA9IHJlZ2lzdGVyUmVxdWlyZUhhbmRsZXI7XG5cbiAgYXN5bmMgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgbGV0IHVybCAgICAgICAgICAgPSBDb21wb25lbnQucmVzb2x2ZVVSTC5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQubG9jYXRpb24sIHNyYywgeyBtYWdpYzogdHJ1ZSB9KTtcblxuICAgICAgZm9yIChsZXQgWyBpbmRleCwgaGFuZGxlciBdIG9mIFJFUVVJUkVfSEFORExFUlMuZW50cmllcygpKSB7XG4gICAgICAgIGxldCB7XG4gICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgfSA9IGhhbmRsZXI7XG5cbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwpKSB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrLmNhbGwodGhpcywgeyBzcmMsIHVybCwgaW5kZXgsIG93bmVyRG9jdW1lbnQgfSk7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LXJlcXVpcmVcIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY31gLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2hTcmMoKSB7XG4gICAgLy8gTk9PUFxuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVJlcXVpcmU7XG5cbmlmICh0eXBlb2YgY3VzdG9tRWxlbWVudHMgIT09ICd1bmRlZmluZWQnICYmICFjdXN0b21FbGVtZW50cy5nZXQoJ215dGhpeC1yZXF1aXJlJykpXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnbXl0aGl4LXJlcXVpcmUnLCBNeXRoaXhVSVJlcXVpcmUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5pbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbi8qXG5NYW55IHRoYW5rcyB0byBTYWdlZSBDb253YXkgZm9yIHRoZSBmb2xsb3dpbmcgQ1NTIHNwaW5uZXJzXG5odHRwczovL2NvZGVwZW4uaW8vc2Fjb253YXkvcGVuL3ZZS1l5cnhcbiovXG5cbmNvbnN0IFNUWUxFX1NIRUVUID1cbmBcbjpob3N0IHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiAxZW07XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbjpob3N0KC5zbWFsbCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMC43NSk7XG59XG46aG9zdCgubWVkaXVtKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAxLjUpO1xufVxuOmhvc3QoLmxhcmdlKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAzKTtcbn1cbi5zcGlubmVyLWl0ZW0sXG4uc3Bpbm5lci1pdGVtOjpiZWZvcmUsXG4uc3Bpbm5lci1pdGVtOjphZnRlciB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA2MCU7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiB7XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4yNSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzczogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMDc1KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgYm9yZGVyOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAxLjApO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSAqIDAuMDc1KSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC43KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLWJvdHRvbTogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuODc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC40KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuNzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpKSByb3RhdGUoNDVkZWcpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIuNSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSB7XG4gIDAlLCA4LjMzJSwgMTYuNjYlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDI0Ljk5JSwgMzMuMzIlLCA0MS42NSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDAlKTtcbiAgfVxuICA0OS45OCUsIDU4LjMxJSwgNjYuNjQlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAxMDAlKTtcbiAgfVxuICA3NC45NyUsIDgzLjMwJSwgOTEuNjMlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiB7XG4gIDAlLCA4LjMzJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDE2LjY2JSwgMjQuOTklLCAzMy4zMiUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxuICA0MS42NSUsIDQ5Ljk4JSwgNTguMzElIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMTAwJSk7XG4gIH1cbiAgNjYuNjQlLCA3NC45NyUsIDgzLjMwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIHtcbiAgMCUsIDgzLjMwJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwKTtcbiAgfVxuICA4LjMzJSwgMTYuNjYlLCAyNC45OSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwKTtcbiAgfVxuICAzMy4zMiUsIDQxLjY1JSwgNDkuOTglIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgLTEwMCUpO1xuICB9XG4gIDU4LjMxJSwgNjYuNjQlLCA3NC45NyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC0xMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyA0KTtcbiAgbWluLXdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDc1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTc1JSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMSk7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiB7XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDIpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAzKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogNCk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNSk7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIC8gLTIpO1xufVxuYDtcblxuY29uc3QgS0lORFMgPSB7XG4gICdhdWRpbyc6ICA1LFxuICAnY2lyY2xlJzogMyxcbiAgJ2RvdCc6ICAgIDIsXG4gICdwaXBlJzogICA1LFxuICAncHV6emxlJzogMyxcbiAgJ3dhdmUnOiAgIDMsXG59O1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlTcGlubmVyIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgdGFnTmFtZSA9ICdteXRoaXgtc3Bpbm5lcic7XG5cbiAgc2V0IGF0dHIka2luZChbIG5ld1ZhbHVlIF0pIHtcbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCkge1xuICAgICAgLy8gYXBwZW5kIHRlbXBsYXRlXG4gICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIHRoaXMuJGJ1aWxkKCh7IFRFTVBMQVRFIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIFRFTVBMQVRFXG4gICAgICAgICAgLmRhdGFNeXRoaXhOYW1lKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSlcbiAgICAgICAgICAucHJvcCRpbm5lckhUTUwoYDxzdHlsZT4ke1NUWUxFX1NIRUVUfTwvc3R5bGU+YCk7XG4gICAgICB9KS5hcHBlbmRUbyhvd25lckRvY3VtZW50LmJvZHkpO1xuXG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBsZXQga2luZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdraW5kJyk7XG4gICAgaWYgKCFraW5kKSB7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2tpbmQnLCBraW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2Uoa2luZCk7XG4gIH1cblxuICBoYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKF9raW5kKSB7XG4gICAgbGV0IGtpbmQgICAgICAgID0gKCcnICsgX2tpbmQpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoS0lORFMsIGtpbmQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXNwaW5uZXJcIiB1bmtub3duIFwia2luZFwiIHByb3ZpZGVkOiBcIiR7a2luZH1cIi4gU3VwcG9ydGVkIFwia2luZFwiIGF0dHJpYnV0ZSB2YWx1ZXMgYXJlOiBcInBpcGVcIiwgXCJhdWRpb1wiLCBcImNpcmNsZVwiLCBcInB1enpsZVwiLCBcIndhdmVcIiwgYW5kIFwiZG90XCIuYCk7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgIH1cblxuICAgIHRoaXMuY2hhbmdlU3Bpbm5lckNoaWxkcmVuKEtJTkRTW2tpbmRdKTtcbiAgfVxuXG4gIGJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgbGV0IGNoaWxkcmVuICAgICAgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGlubmVyLWl0ZW0nKTtcblxuICAgICAgY2hpbGRyZW5baV0gPSBlbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbGVjdChjaGlsZHJlbik7XG4gIH1cblxuICBjaGFuZ2VTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICB0aGlzLnNlbGVjdCgnLnNwaW5uZXItaXRlbScpLnJlbW92ZSgpO1xuICAgIHRoaXMuYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcblxuICAgIC8vIEFsd2F5cyBhcHBlbmQgc3R5bGUgYWdhaW4sIHNvXG4gICAgLy8gdGhhdCBpdCBpcyB0aGUgbGFzdCBjaGlsZCwgYW5kXG4gICAgLy8gZG9lc24ndCBtZXNzIHdpdGggXCJudGgtY2hpbGRcIlxuICAgIC8vIHNlbGVjdG9yc1xuICAgIHRoaXMuc2VsZWN0KCdzdHlsZScpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcbiAgfVxufVxuXG5NeXRoaXhVSVNwaW5uZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJU3Bpbm5lcjtcbiIsImltcG9ydCB7XG4gIE1ZVEhJWF9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbn0gZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmNvbnN0IElTX0lOVEVHRVIgPSAvXlxcZCskLztcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFdlIGhhdmUgYW4gRWxlbWVudCBvciBhIERvY3VtZW50XG4gIGlmICh2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gaXNOb3RTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAhZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDbGFzc05hbWVzKC4uLmFyZ3MpIHtcbiAgbGV0IGNsYXNzTmFtZXMgPSBbXS5jb25jYXQoLi4uYXJncylcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLm1hcCgocGFydCkgPT4gKCcnICsgcGFydCkuc3BsaXQoL1xccysvKSlcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gY2xhc3NOYW1lcztcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0VsZW1lbnQgICAgPSBpc0VsZW1lbnQ7XG4gIHN0YXRpYyBpc1Nsb3R0ZWQgICAgPSBpc1Nsb3R0ZWQ7XG4gIHN0YXRpYyBpc05vdFNsb3R0ZWQgPSBpc05vdFNsb3R0ZWQ7XG5cbiAgc3RhdGljIGZyb20gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShbXSwgeyByb290OiAoaXNFbGVtZW50KHRoaXMpKSA/IHRoaXMgOiBkb2N1bWVudCwgY29udGV4dDogdGhpcyB9KTtcblxuICAgIGNvbnN0IGdldE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBsZXQgYmFzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBpZiAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihiYXNlLCBhcmdzW2FyZ0luZGV4KytdKTtcblxuICAgICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXhdLmdldE9wdGlvbnMoKSB8fCB7fSwgYmFzZSk7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSb290RWxlbWVudCA9IChvcHRpb25zUm9vdCkgPT4ge1xuICAgICAgaWYgKGlzRWxlbWVudChvcHRpb25zUm9vdCkpXG4gICAgICAgIHJldHVybiBvcHRpb25zUm9vdDtcblxuICAgICAgaWYgKGlzRWxlbWVudCh0aGlzKSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHJldHVybiAoKHRoaXMgJiYgdGhpcy5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudCk7XG4gICAgfTtcblxuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBnZXRPcHRpb25zKCk7XG4gICAgbGV0IHJvb3QgICAgICA9IGdldFJvb3RFbGVtZW50KG9wdGlvbnMucm9vdCk7XG4gICAgbGV0IHF1ZXJ5RW5naW5lO1xuXG4gICAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgdGhpcztcblxuICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XS5zbGljZSgpLCBvcHRpb25zKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbYXJnSW5kZXhdKSkge1xuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleCArIDFdLCAnOjpGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1sxXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6U3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6RnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJvb3QucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnOjpGdW5jdGlvbicpKSB7XG4gICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCBvcHRpb25zKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKVxuICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyZXN1bHQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmludm9rZUNhbGxiYWNrcyAhPT0gZmFsc2UgJiYgdHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gcXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9O1xuXG4gIGdldEVuZ2luZUNsYXNzKCkge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIFFVRVJZX0VOR0lORV9UWVBFLFxuICAgICAgfSxcbiAgICAgICdfbXl0aGl4VUlPcHRpb25zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSUVsZW1lbnRzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMob3B0aW9ucy5jb250ZXh0LCBlbGVtZW50cyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lIGluIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnbGVuZ3RoJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQucHJvdG90eXBlO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIC8vIEluZGV4IGxvb2t1cFxuICAgICAgICBpZiAoSVNfSU5URUdFUi50ZXN0KHByb3BOYW1lKSlcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICAgIC8vIFJlZGlyZWN0IGFueSBhcnJheSBtZXRob2RzOlxuICAgICAgICAvL1xuICAgICAgICAvLyBcIm1hZ2ljUHJvcE5hbWVcIiBpcyB3aGVuIHRoZVxuICAgICAgICAvLyBmdW5jdGlvbiBuYW1lIGJlZ2lucyB3aXRoIFwiJFwiLFxuICAgICAgICAvLyBpLmUuIFwiJGZpbHRlclwiLCBvciBcIiRtYXBcIi4gSWZcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSwgdGhlbiB0aGUgcmV0dXJuXG4gICAgICAgIC8vIHZhbHVlIHdpbGwgYWx3YXlzIGJlIGNvZXJjZWQgaW50b1xuICAgICAgICAvLyBhIFF1ZXJ5RW5naW5lLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICAgICAgLy8gb25seSBiZSBjb2VyY2VkIGludG8gYSBRdWVyeUVuZ2luZVxuICAgICAgICAvLyBpZiBFVkVSWSBlbGVtZW50IGluIHRoZSByZXN1bHQgaXNcbiAgICAgICAgLy8gYW4gXCJlbGVtZW50eVwiIHR5cGUgdmFsdWUuXG4gICAgICAgIGxldCBtYWdpY1Byb3BOYW1lID0gKHByb3BOYW1lLmNoYXJBdCgwKSA9PT0gJyQnKSA/IHByb3BOYW1lLnN1YnN0cmluZygxKSA6IHByb3BOYW1lO1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZVttYWdpY1Byb3BOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IGFycmF5ICAgPSB0YXJnZXQuX215dGhpeFVJRWxlbWVudHM7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ICA9IGFycmF5W21hZ2ljUHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIChtYWdpY1Byb3BOYW1lICE9PSBwcm9wTmFtZSB8fCByZXN1bHQuZXZlcnkoKGl0ZW0pID0+IEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24sIE5vZGUsIFF1ZXJ5RW5naW5lKSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShpdGVtLCBOb2RlKSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgIGlmIChpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIGl0ZW0gPSBpdGVtKCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKVxuICAgICAgICBpdGVtID0gRWxlbWVudHMuVGVybShpdGVtKTtcbiAgICAgIGVsc2UgaWYgKCFCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoIWNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiY29udGV4dFwiIG9wdGlvbiBmb3IgUXVlcnlFbmdpbmUgaXMgcmVxdWlyZWQgd2hlbiBjb25zdHJ1Y3RpbmcgZWxlbWVudHMuJyk7XG5cbiAgICAgIHJldHVybiBpdGVtLmJ1aWxkKHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpLCB7XG4gICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShjb250ZXh0KSxcbiAgICAgIH0pO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhQmFzZVV0aWxzLmlzVHlwZShjb3VudCwgJzo6TnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzWzBdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpKSk7XG4gIH1cblxuICBsYXN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFCYXNlVXRpbHMuaXNUeXBlKGNvdW50LCAnOjpOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICc6OlN0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG5cbiAgaW5zZXJ0SW50byhzZWxlY3Rvck9yRWxlbWVudCwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICc6OlN0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmdldE93bmVyRG9jdW1lbnQoKTtcbiAgICBsZXQgc291cmNlICAgICAgICA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblxuICAgICAgc291cmNlID0gWyBmcmFnbWVudCBdO1xuICAgIH1cblxuICAgIGVsZW1lbnQuaW5zZXJ0KHNvdXJjZVswXSwgcmVmZXJlbmNlTm9kZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlcGxhY2VDaGlsZHJlbk9mKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG5cbiAgc2xvdChzbG90TmFtZSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5zbG90ID09PSBzbG90TmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmIChlbGVtZW50LmNsb3Nlc3QoYHNsb3RbbmFtZT1cIiR7c2xvdE5hbWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5RdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG4vKlxuTWFueSB0aGFua3MgdG8gR2VyYWludCBMdWZmIGZvciB0aGUgZm9sbG93aW5nXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9nZXJhaW50bHVmZi9zaGEyNTYvXG4qL1xuXG4vKipcbiAqIHR5cGU6IEZ1bmN0aW9uXG4gKiBuYW1lOiBTSEEyNTZcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFNIQTI1NiBoYXNoaW5nIGZ1bmN0aW9uXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogaW5wdXRcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogSW5wdXQgc3RyaW5nXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIFNIQTI1NiBoYXNoIG9mIHRoZSBwcm92aWRlZCBgaW5wdXRgLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBUaGlzIGlzIGEgY3VzdG9tIGJha2VkIFNIQTI1NiBoYXNoaW5nIGZ1bmN0aW9uLCBtaW5pbWl6ZWQgZm9yIHNpemUuXG4gKiAgICAgSXQgbWF5IGJlIGluY29tcGxldGUsIGFuZCBpdCBpcyBzdHJvbmdseSByZWNvbW1lbmRlZCB0aGF0IHlvdSAqKkRPIE5PVCoqIHVzZSB0aGlzXG4gKiAgICAgZm9yIGFueXRoaW5nIHJlbGF0ZWQgdG8gc2VjdXJpdHkuXG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBSZWFkIGFsbCB0aGUgbm90ZXMsIGFuZCB1c2UgdGhpcyBtZXRob2Qgd2l0aCBjYXV0aW9uLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBtZXRob2QgaGFzIGJlZW4gbW9kaWZpZWQgc2xpZ2h0bHkgZnJvbSB0aGUgb3JpZ2luYWwgdG8gKm5vdCogYmFpbCB3aGVuXG4gKiAgICAgdW5pY29kZSBjaGFyYWN0ZXJzIGFyZSBkZXRlY3RlZC4gVGhlcmUgaXMgYSBkZWNlbnQgY2hhbmNlIHRoYXQtLWdpdmVuIGNlcnRhaW5cbiAqICAgICBpbnB1dC0tdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYW4gaW52YWxpZCBTSEEyNTYgaGFzaC5cIlxuICogICAtIHxcbiAqICAgICA6aW5mbzogTXl0aGl4IFVJIHVzZXMgdGhpcyBtZXRob2Qgc2ltcGx5IHRvIGdlbmVyYXRlIGNvbnNpc3RlbnQgSURzLlxuICogICAtIHxcbiAqICAgICA6aGVhcnQ6IE1hbnkgdGhhbmtzIHRvIHRoZSBhdXRob3IgW0dlcmFpbnQgTHVmZl0oaHR0cHM6Ly9naXRodWIuY29tL2dlcmFpbnRsdWZmL3NoYTI1Ni8pXG4gKiAgICAgZm9yIHRoaXMgbWV0aG9kIVxuICovXG5leHBvcnQgZnVuY3Rpb24gU0hBMjU2KF9pbnB1dCkge1xuICBsZXQgaW5wdXQgPSBfaW5wdXQ7XG5cbiAgbGV0IG1hdGhQb3cgPSBNYXRoLnBvdztcbiAgbGV0IG1heFdvcmQgPSBtYXRoUG93KDIsIDMyKTtcbiAgbGV0IGxlbmd0aFByb3BlcnR5ID0gJ2xlbmd0aCc7XG4gIGxldCBpOyBsZXQgajsgLy8gVXNlZCBhcyBhIGNvdW50ZXIgYWNyb3NzIHRoZSB3aG9sZSBmaWxlXG4gIGxldCByZXN1bHQgPSAnJztcblxuICBsZXQgd29yZHMgPSBbXTtcbiAgbGV0IGFzY2lpQml0TGVuZ3RoID0gaW5wdXRbbGVuZ3RoUHJvcGVydHldICogODtcblxuICAvLyogY2FjaGluZyByZXN1bHRzIGlzIG9wdGlvbmFsIC0gcmVtb3ZlL2FkZCBzbGFzaCBmcm9tIGZyb250IG9mIHRoaXMgbGluZSB0byB0b2dnbGVcbiAgLy8gSW5pdGlhbCBoYXNoIHZhbHVlOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBzcXVhcmUgcm9vdHMgb2YgdGhlIGZpcnN0IDggcHJpbWVzXG4gIC8vICh3ZSBhY3R1YWxseSBjYWxjdWxhdGUgdGhlIGZpcnN0IDY0LCBidXQgZXh0cmEgdmFsdWVzIGFyZSBqdXN0IGlnbm9yZWQpXG4gIGxldCBoYXNoID0gU0hBMjU2LmggPSBTSEEyNTYuaCB8fCBbXTtcbiAgLy8gUm91bmQgY29uc3RhbnRzOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBjdWJlIHJvb3RzIG9mIHRoZSBmaXJzdCA2NCBwcmltZXNcbiAgbGV0IGsgPSBTSEEyNTYuayA9IFNIQTI1Ni5rIHx8IFtdO1xuICBsZXQgcHJpbWVDb3VudGVyID0ga1tsZW5ndGhQcm9wZXJ0eV07XG4gIC8qL1xuICAgIGxldCBoYXNoID0gW10sIGsgPSBbXTtcbiAgICBsZXQgcHJpbWVDb3VudGVyID0gMDtcbiAgICAvLyovXG5cbiAgbGV0IGlzQ29tcG9zaXRlID0ge307XG4gIGZvciAobGV0IGNhbmRpZGF0ZSA9IDI7IHByaW1lQ291bnRlciA8IDY0OyBjYW5kaWRhdGUrKykge1xuICAgIGlmICghaXNDb21wb3NpdGVbY2FuZGlkYXRlXSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IDMxMzsgaSArPSBjYW5kaWRhdGUpXG4gICAgICAgIGlzQ29tcG9zaXRlW2ldID0gY2FuZGlkYXRlO1xuXG4gICAgICBoYXNoW3ByaW1lQ291bnRlcl0gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDAuNSkgKiBtYXhXb3JkKSB8IDA7XG4gICAgICBrW3ByaW1lQ291bnRlcisrXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMSAvIDMpICogbWF4V29yZCkgfCAwO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0ICs9ICdcXHg4MCc7IC8vIEFwcGVuZCDGhycgYml0IChwbHVzIHplcm8gcGFkZGluZylcbiAgd2hpbGUgKGlucHV0W2xlbmd0aFByb3BlcnR5XSAlIDY0IC0gNTYpXG4gICAgaW5wdXQgKz0gJ1xceDAwJzsgLy8gTW9yZSB6ZXJvIHBhZGRpbmdcblxuICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRbbGVuZ3RoUHJvcGVydHldOyBpKyspIHtcbiAgICBqID0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaiA+PiA4KVxuICAgICAgcmV0dXJuOyAvLyBBU0NJSSBjaGVjazogb25seSBhY2NlcHQgY2hhcmFjdGVycyBpbiByYW5nZSAwLTI1NVxuICAgIHdvcmRzW2kgPj4gMl0gfD0gaiA8PCAoKDMgLSBpKSAlIDQpICogODtcbiAgfVxuXG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoKGFzY2lpQml0TGVuZ3RoIC8gbWF4V29yZCkgfCAwKTtcbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9IChhc2NpaUJpdExlbmd0aCk7XG5cbiAgLy8gcHJvY2VzcyBlYWNoIGNodW5rXG4gIGZvciAoaiA9IDA7IGogPCB3b3Jkc1tsZW5ndGhQcm9wZXJ0eV07KSB7XG4gICAgbGV0IHcgPSB3b3Jkcy5zbGljZShqLCBqICs9IDE2KTsgLy8gVGhlIG1lc3NhZ2UgaXMgZXhwYW5kZWQgaW50byA2NCB3b3JkcyBhcyBwYXJ0IG9mIHRoZSBpdGVyYXRpb25cbiAgICBsZXQgb2xkSGFzaCA9IGhhc2g7XG5cbiAgICAvLyBUaGlzIGlzIG5vdyB0aGUgdW5kZWZpbmVkd29ya2luZyBoYXNoXCIsIG9mdGVuIGxhYmVsbGVkIGFzIHZhcmlhYmxlcyBhLi4uZ1xuICAgIC8vICh3ZSBoYXZlIHRvIHRydW5jYXRlIGFzIHdlbGwsIG90aGVyd2lzZSBleHRyYSBlbnRyaWVzIGF0IHRoZSBlbmQgYWNjdW11bGF0ZVxuICAgIGhhc2ggPSBoYXNoLnNsaWNlKDAsIDgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBpbnRvIDY0IHdvcmRzXG4gICAgICAvLyBVc2VkIGJlbG93IGlmXG4gICAgICBsZXQgdzE1ID0gd1tpIC0gMTVdOyBsZXQgdzIgPSB3W2kgLSAyXTtcblxuICAgICAgLy8gSXRlcmF0ZVxuICAgICAgbGV0IGEgPSBoYXNoWzBdOyBsZXQgZSA9IGhhc2hbNF07XG4gICAgICBsZXQgdGVtcDEgPSBoYXNoWzddXG4gICAgICAgICAgICAgICAgKyAoKChlID4+PiA2KSB8IChlIDw8IDI2KSkgXiAoKGUgPj4+IDExKSB8IChlIDw8IDIxKSkgXiAoKGUgPj4+IDI1KSB8IChlIDw8IDcpKSkgLy8gUzFcbiAgICAgICAgICAgICAgICArICgoZSAmIGhhc2hbNV0pIF4gKCh+ZSkgJiBoYXNoWzZdKSkgLy8gY2hcbiAgICAgICAgICAgICAgICArIGtbaV1cbiAgICAgICAgICAgICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2Ugc2NoZWR1bGUgaWYgbmVlZGVkXG4gICAgICAgICAgICAgICAgKyAod1tpXSA9IChpIDwgMTYpID8gd1tpXSA6IChcbiAgICAgICAgICAgICAgICAgIHdbaSAtIDE2XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MTUgPj4+IDcpIHwgKHcxNSA8PCAyNSkpIF4gKCh3MTUgPj4+IDE4KSB8ICh3MTUgPDwgMTQpKSBeICh3MTUgPj4+IDMpKSAvLyBzMFxuICAgICAgICAgICAgICAgICAgICAgICAgKyB3W2kgLSA3XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MiA+Pj4gMTcpIHwgKHcyIDw8IDE1KSkgXiAoKHcyID4+PiAxOSkgfCAodzIgPDwgMTMpKSBeICh3MiA+Pj4gMTApKSAvLyBzMVxuICAgICAgICAgICAgICAgICkgfCAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgIC8vIFRoaXMgaXMgb25seSB1c2VkIG9uY2UsIHNvICpjb3VsZCogYmUgbW92ZWQgYmVsb3csIGJ1dCBpdCBvbmx5IHNhdmVzIDQgYnl0ZXMgYW5kIG1ha2VzIHRoaW5ncyB1bnJlYWRibGVcbiAgICAgIGxldCB0ZW1wMiA9ICgoKGEgPj4+IDIpIHwgKGEgPDwgMzApKSBeICgoYSA+Pj4gMTMpIHwgKGEgPDwgMTkpKSBeICgoYSA+Pj4gMjIpIHwgKGEgPDwgMTApKSkgLy8gUzBcbiAgICAgICAgICAgICAgICArICgoYSAmIGhhc2hbMV0pIF4gKGEgJiBoYXNoWzJdKSBeIChoYXNoWzFdICYgaGFzaFsyXSkpOyAvLyBtYWpcblxuICAgICAgaGFzaCA9IFsodGVtcDEgKyB0ZW1wMikgfCAwXS5jb25jYXQoaGFzaCk7IC8vIFdlIGRvbid0IGJvdGhlciB0cmltbWluZyBvZmYgdGhlIGV4dHJhIG9uZXMsIHRoZXkncmUgaGFybWxlc3MgYXMgbG9uZyBhcyB3ZSdyZSB0cnVuY2F0aW5nIHdoZW4gd2UgZG8gdGhlIHNsaWNlKClcbiAgICAgIGhhc2hbNF0gPSAoaGFzaFs0XSArIHRlbXAxKSB8IDA7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IDg7IGkrKylcbiAgICAgIGhhc2hbaV0gPSAoaGFzaFtpXSArIG9sZEhhc2hbaV0pIHwgMDtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICBmb3IgKGogPSAzOyBqICsgMTsgai0tKSB7XG4gICAgICBsZXQgYiA9IChoYXNoW2ldID4+IChqICogOCkpICYgMjU1O1xuICAgICAgcmVzdWx0ICs9ICgoYiA8IDE2KSA/IDAgOiAnJykgKyBiLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHtcbiAgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIsXG4gIE1ZVEhJWF9TSEFET1dfUEFSRU5ULFxuICBNWVRISVhfVFlQRSxcbiAgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUsXG4gIFFVRVJZX0VOR0lORV9UWVBFLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuXG5pbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICcuL2R5bmFtaWMtcHJvcGVydHkuanMnO1xuXG4vKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogVXRpbHNcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgYGltcG9ydCB7IFV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIHV0aWxpdHkgZnVuY3Rpb25zIGFyZSBmb3VuZCB3aXRoaW4gdGhpcyBuYW1lc3BhY2UuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRNZXRob2RzKF9wcm90bywgc2tpcFByb3Rvcykge1xuICBsZXQgcHJvdG8gICAgICAgICAgID0gX3Byb3RvO1xuICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChwcm90bykge1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKTtcbiAgICBsZXQga2V5cyAgICAgICAgPSBPYmplY3Qua2V5cyhkZXNjcmlwdG9ycykuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZGVzY3JpcHRvcnMpKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InIHx8IGtleSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKGtleSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQoa2V5KTtcblxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yc1trZXldO1xuXG4gICAgICAvLyBDYW4gaXQgYmUgY2hhbmdlZD9cbiAgICAgIGlmIChkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJZiBpcyBnZXR0ZXIsIHRoZW4gc2tpcFxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnZ2V0JykgfHwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdzZXQnKSkge1xuICAgICAgICBsZXQgbmV3RGVzY3JpcHRvciA9IHsgLi4uZGVzY3JpcHRvciB9O1xuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5nZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5nZXQgPSBuZXdEZXNjcmlwdG9yLmdldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLnNldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLnNldCA9IG5ld0Rlc2NyaXB0b3Iuc2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgbmV3RGVzY3JpcHRvcik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXG4gICAgICAvLyBTa2lwIHByb3RvdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KGtleSkgJiYgT2JqZWN0LnByb3RvdHlwZVtrZXldID09PSB2YWx1ZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7IC4uLmRlc2NyaXB0b3IsIHZhbHVlOiB2YWx1ZS5iaW5kKHRoaXMpIH0pO1xuICAgIH1cblxuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICBicmVhaztcblxuICAgIGlmIChza2lwUHJvdG9zICYmIHNraXBQcm90b3MuaW5kZXhPZihwcm90bykgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHN0YXJ0UHJvdG8sIGRlc2NyaXB0b3JOYW1lKSB7XG4gIGxldCB0aGlzUHJvdG8gPSBzdGFydFByb3RvO1xuICBsZXQgZGVzY3JpcHRvcjtcblxuICB3aGlsZSAodGhpc1Byb3RvICYmICEoZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpc1Byb3RvLCBkZXNjcmlwdG9yTmFtZSkpKVxuICAgIHRoaXNQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzUHJvdG8pO1xuXG4gIHJldHVybiB7IHByb3RvdHlwZTogdGhpc1Byb3RvLCBkZXNjcmlwdG9yIH07XG59XG5cbmNvbnN0IE1FVEFEQVRBX1NUT1JBR0UgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL21ldGFkYXRhLXN0b3JhZ2UnKTtcbmNvbnN0IE1FVEFEQVRBX1dFQUtNQVAgPSBnbG9iYWxUaGlzLm15dGhpeFVJW01FVEFEQVRBX1NUT1JBR0VdID0gKGdsb2JhbFRoaXMubXl0aGl4VUlbTUVUQURBVEFfU1RPUkFHRV0pID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtNRVRBREFUQV9TVE9SQUdFXSA6IG5ldyBXZWFrTWFwKCk7XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBTdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEgb24gYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgcmVmZXJlbmNlLlxuICpcbiAqICAgVGhpcyBmdW5jdGlvbiB1c2VzIGFuIGludGVybmFsIFdlYWtNYXAgdG8gc3RvcmUgbWV0YWRhdGEgZm9yIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHZhbHVlLlxuICpcbiAqICAgVGhlIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQgd2lsbCBjaGFuZ2UgdGhlIGJlaGF2aW9yIG9mIHRoaXMgZnVuY3Rpb246XG4gKiAgIDEuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHN1cHBsaWVkIChhIGB0YXJnZXRgKSwgdGhlbiBhIE1hcCBvZiBtZXRhZGF0YSBrZXkvdmFsdWUgcGFpcnMgaXMgcmV0dXJuZWQuXG4gKiAgIDIuIElmIG9ubHkgdHdvIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIHRoZW4gYG1ldGFkYXRhYCBhY3RzIGFzIGEgZ2V0dGVyLCBhbmQgdGhlIHZhbHVlIHN0b3JlZCB1bmRlciB0aGUgc3BlY2lmaWVkIGBrZXlgIGlzIHJldHVybmVkLlxuICogICAzLiBJZiBtb3JlIHRoYW4gdHdvIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIHRoZW4gYG1ldGFkYXRhYCBhY3RzIGFzIGEgc2V0dGVyLCBhbmQgYHRhcmdldGAgaXMgcmV0dXJuZWQgKGZvciBjb250aW51ZWQgY2hhaW5pbmcpLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHRhcmdldFxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHRoZSB2YWx1ZSBmb3Igd2hpY2ggbWV0YWRhdGEgaXMgYmVpbmcgc3RvcmVkIG9yIHJldHJpZXZlZC5cbiAqICAgICAgIFRoaXMgY2FuIGJlIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHZhbHVlIChhbnkgdmFsdWUgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGtleSBpbiBhIFdlYWtNYXApLlxuICogICAtIG5hbWU6IGtleVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBvcHRpb25hbDogdHJ1ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBrZXkgdXNlZCB0byBzdG9yZSBvciBmZXRjaCB0aGUgc3BlY2lmaWVkIG1ldGFkYXRhIHZhbHVlLiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUsIGFzIHRoZSB1bmRlcmx5aW5nXG4gKiAgICAgICBzdG9yYWdlIGlzIGEgTWFwLlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIG9wdGlvbmFsOiB0cnVlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHZhbHVlIHRvIHN0b3JlIG9uIHRoZSBgdGFyZ2V0YCB1bmRlciB0aGUgc3BlY2lmaWVkIGBrZXlgLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBhbnk7XG4gKiAgIDEuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkIChhIGJ1bGsgZ2V0IG9wZXJhdGlvbiksIHJldHVybiBhIE1hcCBjb250YWluaW5nIHRoZSBtZXRhZGF0YSBmb3IgdGhlIHNwZWNpZmllZCBgdGFyZ2V0YC5cbiAqICAgMi4gSWYgdHdvIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgKGEgZ2V0IG9wZXJhdGlvbiksIHRoZSBgdGFyZ2V0YCBtZXRhZGF0YSB2YWx1ZSBzdG9yZWQgZm9yIHRoZSBzcGVjaWZpZWQgYGtleWAuXG4gKiAgIDIuIElmIG1vcmUgdGhhbiB0d28gYXJndW1lbnRzIGFyZSBwcm92aWRlZCAoYSBzZXQgb3BlcmF0aW9uKSwgdGhlIHByb3ZpZGVkIGB0YXJnZXRgIGlzIHJldHVybmVkLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIC8vIHNldFxuICogICAgIFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCwgJ2N1c3RvbUNhcHRpb24nLCAnTWV0YWRhdGEgQ2FwdGlvbiEnKTtcbiAqXG4gKiAgICAgLy8gZ2V0XG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMubWV0YWRhdGEobXlFbGVtZW50LCAnY3VzdG9tQ2FwdGlvbicpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ01ldGFkYXRhIENhcHRpb24hJ1xuICpcbiAqICAgICAvLyBnZXQgYWxsXG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMubWV0YWRhdGEobXlFbGVtZW50KSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+IE1hcCgxKSB7ICdjdXN0b21DYXB0aW9uJyA9PiAnTWV0YWRhdGEgQ2FwdGlvbiEnIH1cbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ldGFkYXRhKHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICBsZXQgZGF0YSA9IE1FVEFEQVRBX1dFQUtNQVAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGF0YSkge1xuICAgIGlmICghQmFzZVV0aWxzLmlzQ29sbGVjdGFibGUodGFyZ2V0KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHNldCBtZXRhZGF0YSBvbiBwcm92aWRlZCBvYmplY3Q6ICR7KHR5cGVvZiB0YXJnZXQgPT09ICdzeW1ib2wnKSA/IHRhcmdldC50b1N0cmluZygpIDogdGFyZ2V0fWApO1xuXG4gICAgZGF0YSA9IG5ldyBNYXAoKTtcbiAgICBNRVRBREFUQV9XRUFLTUFQLnNldCh0YXJnZXQsIGRhdGEpO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgcmV0dXJuIGRhdGE7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpXG4gICAgcmV0dXJuIChkYXRhKSA/IGRhdGEuZ2V0KGtleSkgOiB1bmRlZmluZWQ7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgVkFMSURfSlNfSURFTlRJRklFUiA9IC9eW2EtekEtWl8kXVthLXpBLVowLTlfJF0qJC87XG5jb25zdCBSRVNFUlZFRF9JREVOVElGSUVSID0gL14oYnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGV4cG9ydHxleHRlbmRzfGZhbHNlfGZpbmFsbHl8Zm9yfGZ1bmN0aW9ufGlmfGltcG9ydHxpbnxpbnN0YW5jZW9mfG5ld3xudWxsfHJldHVybnxzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnVlfHRyeXx0eXBlb2Z8dmFyfHZvaWR8d2hpbGV8d2l0aHxsZXR8c3RhdGljfHlpZWxkKSQvO1xuXG5mdW5jdGlvbiBnZXRDb250ZXh0Q2FsbEFyZ3MoY29udGV4dCwgLi4uZXh0cmFDb250ZXh0cykge1xuICBsZXQgY29udGV4dENhbGxBcmdzID0gQXJyYXkuZnJvbShcbiAgICBuZXcgU2V0KGdldEFsbFByb3BlcnR5TmFtZXMoY29udGV4dCkuY29uY2F0KFxuICAgICAgT2JqZWN0LmtleXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSB8fCB7fSksXG4gICAgICBbICdhdHRyaWJ1dGVzJywgJ2NsYXNzTGlzdCcsICckJCcsICdpMThuJyBdLFxuICAgICAgLi4uZXh0cmFDb250ZXh0cy5tYXAoKGV4dHJhQ29udGV4dCkgPT4gT2JqZWN0LmtleXMoZXh0cmFDb250ZXh0IHx8IHt9KSksXG4gICAgKSksXG4gICkuZmlsdGVyKChuYW1lKSA9PiB7XG4gICAgaWYgKFJFU0VSVkVEX0lERU5USUZJRVIudGVzdChuYW1lKSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBWQUxJRF9KU19JREVOVElGSUVSLnRlc3QobmFtZSk7XG4gIH0pO1xuXG4gIHJldHVybiBgeyR7Y29udGV4dENhbGxBcmdzLmpvaW4oJywnKX19YDtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdldCB0aGUgcGFyZW50IE5vZGUgb2YgYGVsZW1lbnRgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGVsZW1lbnRcbiAqICAgICBkYXRhVHlwZTogTm9kZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBOb2RlIHdob3NlIHBhcmVudCB5b3Ugd2lzaCB0byBmaW5kLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBVbmxpa2UgW05vZGUucGFyZW50Tm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSksIHRoaXNcbiAqICAgICB3aWxsIGFsc28gc2VhcmNoIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMuXG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiAqKlNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIG9ubHkgd29ya3MgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzISoqXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBpcyBhY2NvbXBsaXNoZWQgdmlhIGxldmVyYWdpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YTsgb25cbiAqICAgICBgZWxlbWVudGAuIFdoZW4gYSBgbnVsbGAgcGFyZW50IGlzIGVuY291bnRlcmVkLCBgZ2V0UGFyZW50Tm9kZWAgd2lsbCBsb29rIGZvciBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBAc2VlIENvbnN0YW50cy5NWVRISVhfU0hBRE9XX1BBUkVOVDtcbiAqICAgICBvbiBgZWxlbWVudGAuIElmIGZvdW5kLCB0aGUgcmVzdWx0IGlzIGNvbnNpZGVyZWQgdGhlIFtwYXJlbnQgTm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSkgb2YgYGVsZW1lbnRgLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBOb2RlOyBUaGUgcGFyZW50IG5vZGUsIGlmIHRoZXJlIGlzIGFueSwgb3IgYG51bGxgIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gbWV0YWRhdGEoZWxlbWVudC5wYXJlbnROb2RlLCBNWVRISVhfU0hBRE9XX1BBUkVOVCkgfHwgbnVsbDtcblxuICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKSB8fCBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGU7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDcmVhdGUgYSBQcm94eSB0aGF0IGlzIGVzc2VudGlhbGx5IChmdW5jdGlvbmFsbHkpIGEgbXVsdGktcHJvdG90eXBlIGBvYmplY3RgIGluc3RhbmNlLlxuICpcbiAqICAgQSBcInNjb3BlXCIgaW4gTXl0aGl4IFVJIG1pZ2h0IGJlIGJldHRlciBjYWxsZWQgYSBcImNvbnRleHRcIi4uLiBob3dldmVyLCBcInNjb3BlXCJcbiAqICAgd2FzIGNob3NlbiBiZWNhdXNlIGl0ICppcyogYSBzY29wZS4uLiBvciBtaWdodCBiZSBiZXR0ZXIgZGVzY3JpYmVkIGFzIFwibXVsdGlwbGUgc2NvcGVzIGluIG9uZVwiLlxuICogICBUaGlzIGlzIHNwZWNpZmljYWxseSBhIFwiRE9NIHNjb3BlXCIsIGluIHRoYXQgdGhpcyBtZXRob2QgaXMgXCJET00gYXdhcmVcIiBhbmQgd2lsbCB0cmF2ZXJzZSB0aGVcbiAqICAgRE9NIGxvb2tpbmcgZm9yIHRoZSByZXF1ZXN0ZWQgZGF0YSAoaWYgYW55IG9mIHRoZSBzcGVjaWZpZWQgYHRhcmdldHNgIGlzIGFuIEVsZW1lbnQgdGhhdCBpcykuXG4gKlxuICogICBUaGUgd2F5IHRoaXMgd29ya3MgaXMgdGhhdCB0aGUgY2FsbGVyIHdpbGwgcHJvdmlkZSBhdCBsZWFzdCBvbmUgXCJ0YXJnZXRcIi4gVGhlc2UgdGFyZ2V0cyBhcmVcbiAqICAgdGhlbXNlbHZlcyBzY29wZXMsIGVsZW1lbnRzLCBvciBvdGhlciBkYXRhIG9iamVjdHMuIFdoZW4gdGhlIHJldHVybmVkIFByb3h5IGluc3RhbmNlIGlzIGFjY2Vzc2VkLFxuICogICB0aGUgcmVxdWVzdGVkIGtleSBpcyBzZWFyY2hlZCBpbiBhbGwgcHJvdmlkZWQgYHRhcmdldHNgLCBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIHByb3ZpZGVkLlxuICpcbiAqICAgQXNpZGUgZnJvbSBzZWFyY2hpbmcgYWxsIHRhcmdldHMgZm9yIHRoZSBkZXNpcmVkIGtleSwgaXQgd2lsbCBhbHNvIGZhbGxiYWNrIHRvIG90aGVyIGRhdGEgc291cmNlc1xuICogICBpdCBzZWFyY2hlcyBpbiBhcyB3ZWxsOlxuICogICAxLiBJZiBhbnkgZ2l2ZW4gYHRhcmdldGAgaXQgaXMgc2VhcmNoaW5nIGlzIGFuIEVsZW1lbnQsIHRoZW4gaXQgd2lsbCBhbHNvIHNlYXJjaFxuICogICAgICBmb3IgdGhlIHJlcXVlc3RlZCBrZXkgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICogICAyLiBJZiBzdGVwICMxIGhhcyBmYWlsZWQsIHRoZW4gbW92ZSB0byB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIGN1cnJlbnQgRWxlbWVudCBpbnN0YW5jZSwgYW5kXG4gKiAgICAgIHJlcGVhdCB0aGUgcHJvY2Vzcywgc3RhcnRpbmcgZnJvbSBzdGVwICMxLlxuICogICAzLiBBZnRlciBzdGVwcyAxLTIgYXJlIHJlcGVhdGVkIGZvciBldmVyeSBnaXZlbiBgdGFyZ2V0YCAoYW5kIGFsbCBwYXJlbnQgbm9kZXMgb2YgdGhvc2UgYHRhcmdldHNgLi4uIGlmIGFueSksXG4gKiAgICAgIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBmaW5hbGx5IGZhbGxiYWNrIHRvIHNlYXJjaGluZyBgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZWAgZm9yIHRoZSByZXF1ZXN0ZWQga2V5LlxuICpcbiAqICAgV2UgYXJlbid0IHF1aXRlIGZpbmlzaGVkIHlldCB0aG91Z2guLi5cbiAqXG4gKiAgIElmIHN0ZXBzIDEtMyBhYm92ZSBhbGwgZmFpbCwgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIHN0aWxsIGZhbGxiYWNrIHRvIHRoZSBmYWxsb3dpbmcgaGFyZC1jb2RlZCBrZXkvdmFsdWUgcGFpcnM6XG4gKiAgIDEuIEEgcmVxdWVzdGVkIGtleSBvZiBgJ2dsb2JhbFNjb3BlJ2AgKGlmIG5vdCBmb3VuZCBvbiBhIHRhcmdldCkgd2lsbCByZXN1bHQgaW4gYGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVgIGJlaW5nIHJldHVybmVkLlxuICogICAyLiBBIHJlcXVlc3RlZCBrZXkgb2YgYCdpMThuJ2AgKGlmIG5vdCBmb3VuZCBvbiBhIHRhcmdldCkgd2lsbCByZXN1bHQgaW4gdGhlIGJ1aWx0LWluIGBpMThuYCBsYW5ndWFnZSB0ZXJtIHByb2Nlc3NvciBiZWluZyByZXR1cm5lZC5cbiAqICAgMy4gQSByZXF1ZXN0ZWQga2V5IG9mIGAnZHluYW1pY1Byb3BJRCdgIChpZiBub3QgZm91bmQgb24gYSB0YXJnZXQpIHdpbGwgcmVzdWx0IGluIHRoZSBidWlsdC1pbiBgZHluYW1pY1Byb3BJRGAgZHluYW1pYyBwcm9wZXJ0eSBwcm92aWRlZC4gU2VlIEBzZWUgVXRpbHMuZHluYW1pY1Byb3BJRDsuXG4gKlxuICogICBGaW5hbGx5LCB0aGUgcmV0dXJuZWQgUHJveHkgd2lsbCBhbHNvIGludGVyY2VwdCBhbnkgdmFsdWUgW3NldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJveHkvUHJveHkvc2V0KSBvcGVyYXRpb24sXG4gKiAgIHRvIHNldCBhIHZhbHVlIG9uIHRoZSBmaXJzdCB0YXJnZXQgZm91bmQuXG4gKlxuICogICBUaGUgUHJveHkgYWxzbyBvdmVybG9hZHMgW293bktleXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb3h5L1Byb3h5L293bktleXMpIHRvIGxpc3QgKiphbGwqKiBrZXlzIGFjcm9zcyAqKmFsbCoqIGB0YXJnZXRzYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiAuLi50YXJnZXRzXG4gKiAgICAgZGF0YVR5cGVzOlxuICogICAgICAgLSBPYmplY3RcbiAqICAgICAgIC0gRWxlbWVudFxuICogICAgICAgLSBub24tcHJpbWl0aXZlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIGB0YXJnZXRzYCB0byBiZSBzZWFyY2hlZCwgaW4gdGhlIG9yZGVyIHByb3ZpZGVkLiBUYXJnZXRzIGFyZSBzZWFyY2hlZCBib3RoIGZvciBnZXQgb3BlcmF0aW9ucywgYW5kIHNldCBvcGVyYXRpb25zICh0aGUgZmlyc3QgdGFyZ2V0IGZvdW5kIHdpbGwgYmUgdGhlIHNldCB0YXJnZXQpLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBNeXRoaXggVUkgd2lsbCBkZWxpYmVyYXRlbHkgbmV2ZXIgZGlyZWN0bHkgYWNjZXNzIGBnbG9iYWxUaGlzYCBmcm9tIHRoZSB0ZW1wbGF0ZSBlbmdpbmUgKGZvciBzZWN1cml0eSByZWFzb25zKS5cbiAqICAgICBCZWNhdXNlIG9mIHRoaXMsIE15dGhpeCBVSSBhdXRvbWF0aWNhbGx5IHByb3ZpZGVzIGl0cyBvd24gZ2xvYmFsIHNjb3BlIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlYC5cbiAqICAgICBJZiB5b3Ugd2FudCBkYXRhIHRvIGJlIFwiZ2xvYmFsbHlcIiB2aXNpYmxlIHRvIE15dGhpeCBVSSwgdGhlbiB5b3UgbmVlZCB0byBhZGQgeW91ciBkYXRhIHRvIHRoaXMgc3BlY2lhbCBnbG9iYWwgc2NvcGUuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIG1ldGhvZCBpcyBjb21wbGV4IGJlY2F1c2UgaXQgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCB0byBwcm92aWRlIGEgXCJzY29wZVwiIHRvIHRoZSBNeXRoaXggVUkgdGVtcGxhdGluZyBlbmdpbmUuXG4gKiAgICAgVGhlIHRlbXBsYXRpbmcgZW5naW5lIG5lZWRzIHRvIGJlIERPTSBhd2FyZSwgYW5kIGFsc28gbmVlZHMgdG8gaGF2ZSBhY2Nlc3MgdG8gc3BlY2lhbGl6ZWQsIHNjb3BlZCBkYXRhXG4gKiAgICAgKGkuZS4gdGhlIGBteXRoaXgtdWktZm9yLWVhY2hgIGNvbXBvbmVudCB3aWxsIHB1Ymxpc2ggc2NvcGVkIGRhdGEgZm9yIGVhY2ggaXRlcmF0aW9uLCB3aGljaCBuZWVkcyB0byBiZSBib3RoXG4gKiAgICAgRE9NLWF3YXJlLCBhbmQgaXRlcmF0aW9uLWF3YXJlKS5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEFueSBwcm92aWRlZCBgdGFyZ2V0YCBjYW4gYWxzbyBiZSBvbmUgb2YgdGhlc2UgUHJveHkgc2NvcGVzIHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogSXQgY2FuIGhlbHAgdG8gdGhpbmsgb2YgdGhlIHJldHVybmVkIFwic2NvcGVcIiBhcyBhbiBwbGFpbiBPYmplY3QgdGhhdCBoYXMgYW4gYXJyYXkgb2YgcHJvdG90eXBlcy5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgUHJveHk7IEEgcHJveHkgaW5zdGFuY2UsIHRoYXQgaXMgdXNlZCB0byBnZXQgYW5kIHNldCBrZXlzIGFjcm9zcyBtdWx0aXBsZSBgdGFyZ2V0c2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTY29wZSguLi5fdGFyZ2V0cykge1xuICBjb25zdCBmaW5kUHJvcE5hbWVTY29wZSA9ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHRhcmdldCA9PSBudWxsIHx8IE9iamVjdC5pcyh0YXJnZXQsIE5hTikpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgcmV0dXJuIHRhcmdldDtcblxuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2VhcmNoUGFyZW50Tm9kZXNGb3JLZXkgPSAoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGlmICghY3VycmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZG8ge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gY3VycmVudEVsZW1lbnQpXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRFbGVtZW50O1xuXG4gICAgICAgIGN1cnJlbnRFbGVtZW50ID0gZ2V0UGFyZW50Tm9kZShjdXJyZW50RWxlbWVudCk7XG4gICAgICB9IHdoaWxlIChjdXJyZW50RWxlbWVudCk7XG4gICAgfTtcblxuICAgIHJldHVybiBzZWFyY2hQYXJlbnROb2Rlc0ZvcktleSh0YXJnZXQpO1xuICB9O1xuXG4gIGxldCB0YXJnZXRzICAgICAgICAgPSBfdGFyZ2V0cy5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmaXJzdEVsZW1lbnQgICAgPSB0YXJnZXRzLmZpbmQoKHRhcmdldCkgPT4gKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKSB8fCB0YXJnZXRzWzBdO1xuICBsZXQgYmFzZUNvbnRleHQgICAgID0ge307XG4gIGxldCBmYWxsYmFja0NvbnRleHQgPSB7XG4gICAgZ2xvYmFsU2NvcGU6ICAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKSxcbiAgICBpMThuOiAgICAgICAgIChwYXRoLCBkZWZhdWx0VmFsdWUpID0+IHtcbiAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gc3BlY2lhbENsb3Nlc3QoZmlyc3RFbGVtZW50LCAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJyk7XG4gICAgICBpZiAoIWxhbmd1YWdlUHJvdmlkZXIpXG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICAgIHJldHVybiBsYW5ndWFnZVByb3ZpZGVyLmkxOG4ocGF0aCwgZGVmYXVsdFZhbHVlKTtcbiAgICB9LFxuICAgIGR5bmFtaWNQcm9wSUQsXG4gIH07XG5cbiAgdGFyZ2V0cyA9IHRhcmdldHMuY29uY2F0KGZhbGxiYWNrQ29udGV4dCk7XG4gIGxldCBwcm94eSAgID0gbmV3IFByb3h5KGJhc2VDb250ZXh0LCB7XG4gICAgb3duS2V5czogKCkgPT4ge1xuICAgICAgbGV0IGFsbEtleXMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpXG4gICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChnZXRBbGxQcm9wZXJ0eU5hbWVzKHRhcmdldCkpO1xuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmIChnbG9iYWxTY29wZSlcbiAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KE9iamVjdC5rZXlzKGdsb2JhbFNjb3BlKSk7XG5cbiAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYWxsS2V5cykpO1xuICAgIH0sXG4gICAgaGFzOiAoXywgcHJvcE5hbWUpID0+IHtcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgcmV0dXJuIChwcm9wTmFtZSBpbiBnbG9iYWxTY29wZSk7XG4gICAgfSxcbiAgICBnZXQ6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIHNjb3BlW3Byb3BOYW1lXTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBnbG9iYWxTY29wZVtwcm9wTmFtZV07XG4gICAgfSxcbiAgICBzZXQ6IChfLCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IGRvU2V0ID0gKHNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2NvcGVbcHJvcE5hbWVdLCBEeW5hbWljUHJvcGVydHkpKVxuICAgICAgICAgIHNjb3BlW3Byb3BOYW1lXVtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzY29wZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBkb1NldChzY29wZSwgcHJvcE5hbWUsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiBkb1NldChnbG9iYWxTY29wZSwgcHJvcE5hbWUsIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcblxuICBmYWxsYmFja0NvbnRleHQuJCQgPSBwcm94eTtcblxuICByZXR1cm4gcHJveHk7XG59XG5cbmNvbnN0IEVWRU5UX0FDVElPTl9KVVNUX05BTUUgPSAvXiU/W1xcdy4kXSskLztcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENyZWF0ZSBhIGNvbnRleHQtYXdhcmUgZnVuY3Rpb24sIG9yIFwibWFjcm9cIiwgdGhhdCBjYW4gYmUgY2FsbGVkIGFuZCB1c2VkIGJ5IHRoZSB0ZW1wbGF0ZSBlbmdpbmUuXG4gKlxuICogICBJZiB5b3UgYXJlIGV2ZXIgdHJ5aW5nIHRvIHBhc3MgbWV0aG9kcyBvciBkeW5hbWljIHByb3BlcnRpZXMgYWNyb3NzIHRoZSBET00sIHRoZW4gdGhpcyBpcyB0aGUgbWV0aG9kIHlvdSB3YW50IHRvIHVzZSwgdG9cbiAqICAgcHJvcGVybHkgXCJwYXJzZVwiIGFuZCB1c2UgdGhlIGF0dHJpYnV0ZSB2YWx1ZSBhcyBpbnRlbmRlZC5cbiAqXG4gKiAgIFRoaXMgaXMgdXNlZCBmb3IgZXhhbXBsZSBmb3IgZXZlbnQgYmluZGluZ3MgdmlhIGF0dHJpYnV0ZXMuIElmIHlvdSBoYXZlIGZvciBleGFtcGxlIGFuIGBvbmNsaWNrPVwiZG9Tb21ldGhpbmdcImBcbiAqICAgYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQsIHRoZW4gdGhpcyB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIGEgY29udGV4dC1hd2FyZSBcIm1hY3JvXCIgZm9yIHRoZSBtZXRob2QgXCJkb1NvbWV0aGluZ1wiLlxuICpcbiAqICAgVGhlIHRlcm0gXCJtYWNyb1wiIGlzIHVzZWQgaGVyZSBiZWNhdXNlIHRoZXJlIGFyZSBzcGVjaWFsIGZvcm1hdHMgXCJ1bmRlcnN0b29kXCIgYnkgdGhlIHRlbXBsYXRlIGVuZ2luZS4gRm9yIGV4YW1wbGUsXG4gKiAgIHByZWZpeGluZyBhbiBhdHRyaWJ1dGUgdmFsdWUgd2l0aCBhIHBlcmNlbnQgc2lnbiwgaS5lLiBgbmFtZT1cIiVnbG9iYWxEeW5hbWljUHJvcE5hbWVcImAgd2lsbCB1c2UgQHNlZSBVdGlscy5keW5hbWljUHJvcElEO1xuICogICB0byBnbG9iYWxseSBmZXRjaCBwcm9wZXJ0eSBvZiB0aGlzIG5hbWUuIFRoaXMgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mIHRoZSBET00sIHlvdSBtaWdodFxuICogICBiZSByZXF1ZXN0aW5nIGEgZHluYW1pYyBwcm9wZXJ0eSB0aGF0IGhhc24ndCB5ZXQgYmVlbiBsb2FkZWQvZGVmaW5lZC4gVGhpcyBpcyB0aGUgcHVycG9zZSBvZiBAc2VlIFV0aWxzLmR5bmFtaWNQcm9wSUQ7LFxuICogICBhbmQgdGhpcyBzcGVjaWFsaXplZCB0ZW1wbGF0ZSBmb3JtYXQ6IHRvIHByb3ZpZGUgZHluYW1pYyBwcm9wcyBieSBpZCwgdGhhdCB3aWxsIGJlIGF2YWlsYWJsZSB3aGVuIG5lZWRlZC5cbiAqXG4gKiAgIFRoZSB0ZW1wbGF0ZSBlbmdpbmUgYWxzbyB3aWxsIGhhcHBpbHkgYWNjZXB0IHJvZ3VlIG1ldGhvZCBuYW1lcy4gRm9yIGV4YW1wbGUsIGluIGEgTXl0aGl4IFVJIGNvbXBvbmVudCB5b3UgYXJlIGJ1aWxkaW5nLFxuICogICB5b3UgbWlnaHQgaGF2ZSBhbiBlbGVtZW50IGxpa2UgYDxidXR0b24gb25jbGljaz1cIm9uQnV0dG9uQ2xpY2tcIj5DbGljayBNZSE8YnV0dG9uPmAuIFRoZSB0ZW1wbGF0aW5nIGVuZ2luZSB3aWxsIGRldGVjdCB0aGF0XG4gKiAgIHRoaXMgaXMgT05MWSBhbiBpZGVudGlmaWVyLCBhbmQgc28gd2lsbCBzZWFyY2ggZm9yIHRoZSBzcGVjaWZpZWQgbWV0aG9kIGluIHRoZSBhdmFpbGFibGUgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspLFxuICogICB3aGljaCBpbmNsdWRlcyBgdGhpc2AgaW5zdGFuY2Ugb2YgeW91ciBjb21wb25lbnQgYXMgdGhlIGZpcnN0IGB0YXJnZXRgLiBUaGlzIHBhdHRlcm4gaXMgbm90IHJlcXVpcmVkLCBhcyB5b3UgY2FuIGNhbGwgeW91clxuICogICBjb21wb25lbnQgbWV0aG9kIGRpcmVjdGx5IHlvdXJzZWxmLCBhcyB3aXRoIGFueSBhdHRyaWJ1dGUgZXZlbnQgYmluZGluZyBpbiB0aGUgRE9NLCBpLmU6IGA8YnV0dG9uIG9uY2xpY2s9XCJ0aGlzLm9uQnV0dG9uQ2xpY2soZXZlbnQpXCI+Q2xpY2sgTWUhPGJ1dHRvbj5gLlxuICpcbiAqICAgT25lIGxhc3QgdGhpbmcgdG8gbWVudGlvbiBpcyB0aGF0IHdoZW4gdGhlc2UgXCJtYWNyb1wiIG1ldGhvZHMgYXJlIGNhbGxlZCBieSBNeXRoaXggVUksIGFsbCBlbnVtZXJhYmxlIGtleXMgb2YgdGhlIGdlbmVyYXRlZFxuICogICBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykgYXJlIHBhc3NlZCBpbnRvIHRoZSBtYWNybyBtZXRob2QgYXMgYXJndW1lbnRzLiBUaGlzIG1lYW5zIHRoYXQgdGhlIGtleXMvdmFsdWVzIG9mIGFsbCBzY29wZSBgdGFyZ2V0c2BcbiAqICAgYXJlIGF2YWlsYWJsZSBkaXJlY3RseSBpbiB5b3VyIGphdmFzY3JpcHQgc2NvcGUuIGkuZS4geW91IGNhbiBkbyB0aGluZ3MgbGlrZSBgbmFtZT1cImNvbXBvbmVudEluc3RhbmNlUHJvcGVydHkodGhpc0F0dHJpYnV0ZTEsIG90aGVyQXR0cmlidXRlKVwiYCB3aXRob3V0IG5lZWRpbmcgdG8gZG9cbiAqICAgYG5hbWU9XCJ0aGlzLmNvbXBvbmVudEluc3RhbmNlUHJvcGVydHkodGhpcy50aGlzQXR0cmlidXRlMSwgdGhpcy5vdGhlckF0dHJpYnV0ZSlcImAuIDp3YXJuaW5nOiBJdCBpcyBpbXBvcnRhbnQgdG8ga2VlcCBpbiBtaW5kIHRoYXQgZGlyZWN0IHJlZmVyZW5jZSBhY2Nlc3MgbGlrZSB0aGlzIGluIGEgbWFjcm9cbiAqICAgd2lsbCBieXBhc3MgdGhlIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSBQcm94eSwgYW5kIHNvIGlmIHRoZSBzcGVjaWZpZWQga2V5IGlzIG5vdCBmb3VuZCAocGFzc2VkIGluIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBtYWNybyksIHRoZW4gYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24gYnkgamF2YXNjcmlwdC5cbiAqXG4gKiAgIEl0IGlzIGFic29sdXRlbHkgcG9zc2libGUgZm9yIHlvdSB0byByZWNlaXZlIGFuZCBzZW5kIGFyZ3VtZW50cyB2aWEgdGhlc2UgZ2VuZXJhdGVkIFwibWFjcm9zXCIuIGBteXRoaXgtdWktc2VhcmNoYCBkb2VzIHRoaXMgZm9yXG4gKiAgIGV4YW1wbGUgd2hlbiBhIFwiZmlsdGVyXCIgbWV0aG9kIGlzIHBhc3NlZCB2aWEgYW4gYXR0cmlidXRlLiBCeSBkZWZhdWx0IG5vIGV4dHJhIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgd2hlbiBjYWxsZWQgZGlyZWN0bHkgYnkgdGhlIHRlbXBsYXRpbmcgZW5naW5lLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IG9wdGlvbnNcbiAqICAgICBkYXRhVHlwZTogb2JqZWN0XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgQW4gb2JqZWN0IHdpdGggdGhlIHNoYXBlIGB7IGJvZHk6IHN0cmluZzsgcHJlZml4Pzogc3RyaW5nOyBzY29wZTogb2JqZWN0OyB9YC5cbiAqXG4gKiAgICAgICAxLiBgYm9keWAgaXMgdGhlIGFjdHVhbCBib2R5IG9mIHRoZSBgbmV3IEZ1bmN0aW9uYC5cbiAqICAgICAgIDIuIGBzY29wZWAgaXMgdGhlIHNjb3BlIChgdGhpc2ApIHRoYXQgeW91IHdhbnQgdG8gYmluZCB0byB0aGUgcmVzdWx0aW5nIG1ldGhvZC5cbiAqICAgICAgICAgIFRoaXMgd291bGQgZ2VuZXJhbGx5IGJlIGEgc2NvcGUgY3JlYXRlZCBieSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlO1xuICogICAgICAgMy4gYHByZWZpeGAgYW4gb3B0aW9uYWwgcHJlZml4IGZvciB0aGUgYm9keSBvZiB0aGUgYG5ldyBGdW5jdGlvbmAuIFRoaXMgcHJlZml4IGlzIGFkZGVkXG4gKiAgICAgICAgICBiZWZvcmUgYW55IGZ1bmN0aW9uIGJvZHkgY29kZSB0aGF0IE15dGhpeCBVSSBnZW5lcmF0ZXMuXG4gKiAgICAgICAgICBTZWUgaGVyZSBAc291cmNlUmVmIF9jcmVhdGVUZW1wbGF0ZU1hY3JvUHJlZml4Rm9yQmluZEV2ZW50VG9FbGVtZW50OyBmb3IgYW4gZXhhbXBsZSB1c2VcbiAqICAgICAgICAgIG9mIGBwcmVmaXhgIChub3RpY2UgaG93IGBhcmd1bWVudHNbMV1gIGlzIHVzZWQgaW5zdGVhZCBvZiBgYXJndW1lbnRzWzBdYCwgYXMgYGFyZ3VtZW50c1swXWAgaXMgYWx3YXlzIHJlc2VydmVkXG4gKiAgICAgICAgICBmb3IgbG9jYWwgdmFyaWFibGUgbmFtZXMgXCJpbmplY3RlZFwiIGZyb20gdGhlIGNyZWF0ZWQgXCJzY29wZVwiKS5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogQXNpZGUgZm9yIHNvbWUgYmVoaW5kLXRoZS1zY2VuZSBtb2RpZmljYXRpb25zIGFuZCBlYXNlLW9mLXVzZSBzbGlja25lc3MsIHRoaXMgZXNzZW50aWFsbHkganVzdCBjcmVhdGVzIGEgYG5ldyBGdW5jdGlvbmAgYW5kIGJpbmRzIGEgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspIHRvIGl0LlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhlIHByb3ZpZGVkIChhbmQgb3B0aW9uYWwpIGBwcmVmaXhgIGNhbiBiZSB1c2VkIGFzIHRoZSBzdGFydCBvZiB0aGUgbWFjcm8gYG5ldyBGdW5jdGlvbmAgYm9keSBjb2RlLiBpLmUuIEBzZWUgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50OyBkb2VzIGV4YWN0bHkgdGhpcyB0byBhbGxvdyBkaXJlY3Qgc2NvcGVkXG4gKiAgICAgYWNjZXNzIHRvIHRoZSBgZXZlbnRgIGluc3RhbmNlLiBAc291cmNlUmVmIF9jcmVhdGVUZW1wbGF0ZU1hY3JvUHJlZml4Rm9yQmluZEV2ZW50VG9FbGVtZW50O1xuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhlIHJldHVybiBtZXRob2QgaXMgYm91bmQgYnkgY2FsbGluZyBgLmJpbmQoc2NvcGUpYC4gSXQgaXMgbm90IHBvc3NpYmxlIHRvIG1vZGlmeSBgdGhpc2AgYXQgdGhlIGNhbGwtc2l0ZS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgZnVuY3Rpb247IEEgZnVuY3Rpb24gdGhhdCBpcyBcImNvbnRleHQgYXdhcmVcIiBieSBiZWluZyBib3VuZCB0byB0aGUgcHJvdmlkZWQgYHNjb3BlYCAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyBwcmVmaXgsIGJvZHksIHNjb3BlIH0pIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IGJvZHk7XG4gIGlmIChmdW5jdGlvbkJvZHkuY2hhckF0KDApID09PSAnJScgfHwgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRS50ZXN0KGZ1bmN0aW9uQm9keSkpIHtcbiAgICBpZiAoZnVuY3Rpb25Cb2R5LmNoYXJBdCgwKSA9PT0gJyUnKSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKHRoaXMuZHluYW1pY1Byb3BJRCB8fCBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQpKCcke2Z1bmN0aW9uQm9keS5zdWJzdHJpbmcoMSkudHJpbSgpLnJlcGxhY2UoLycvZywgJ1xcXFxcXCcnKX0nKWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bmN0aW9uQm9keSA9IGAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxldCBfX19fJCA9ICR7ZnVuY3Rpb25Cb2R5fTtcbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBfX19fJCA9PT0gJ2Z1bmN0aW9uJykgPyBfX19fJC5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSkpIDogX19fXyQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy4ke2Z1bmN0aW9uQm9keS5yZXBsYWNlKC9eXFxzKnRoaXNcXC4vLCAnJyl9LmFwcGx5KHRoaXMsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7YDtcbiAgICB9XG4gIH1cblxuICBsZXQgY29udGV4dENhbGxBcmdzID0gZ2V0Q29udGV4dENhbGxBcmdzKHNjb3BlLCB7ICdfX21hY3JvU291cmNlJzogbnVsbCwgJ19fZXhwYW5kZWRNYWNyb1NvdXJjZSc6IG51bGwgfSk7XG5cbiAgZnVuY3Rpb25Cb2R5ID0gYHRyeSB7ICR7KHByZWZpeCkgPyBgJHtwcmVmaXh9O2AgOiAnJ31yZXR1cm4gJHsoZnVuY3Rpb25Cb2R5IHx8ICcodm9pZCAwKScpLnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKy8sICcnKS50cmltKCl9OyB9IGNhdGNoIChlcnJvcikgeyBjb25zb2xlLmVycm9yKFxcYEVycm9yIGluIG1hY3JvIFtcXCR7X19tYWNyb1NvdXJjZX1dOlxcYCwgZXJyb3IsIF9fZXhwYW5kZWRNYWNyb1NvdXJjZSk7IHRocm93IGVycm9yOyB9YDtcblxuICBsZXQgbG9jYWxTY29wZSA9IE9iamVjdC5jcmVhdGUoc2NvcGUpO1xuICBsb2NhbFNjb3BlLl9fbWFjcm9Tb3VyY2UgPSBib2R5O1xuICBsb2NhbFNjb3BlLl9fZXhwYW5kZWRNYWNyb1NvdXJjZSA9IGZ1bmN0aW9uQm9keTtcblxuICByZXR1cm4gKG5ldyBGdW5jdGlvbihjb250ZXh0Q2FsbEFyZ3MsIGZ1bmN0aW9uQm9keSkpLmJpbmQoc2NvcGUgfHwge30sIHNjb3BlKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFBhcnNlIGEgdGVtcGxhdGUsIGFuZCByZXR1cm4gaXRzIHBhcnRzLiBBIHRlbXBsYXRlIFwicGFydFwiIGlzIG9uZSBvZiB0d28gdHlwZXM6IGAnbGl0ZXJhbCdgLCBvciBgJ21hY3JvJ2AuXG4gKlxuICogICBUYWtlIGZvciBleGFtcGxlIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGU6IGAnSGVsbG8gXFxAQGdyZWV0aW5nQEAhISEnYC4gVGhpcyB0ZW1wbGF0ZSB3b3VsZCByZXN1bHQgaW4gdGhyZWUgXCJwYXJ0c1wiIGFmdGVyIHBhcnNpbmc6XG4gKiAgIDEuIGB7IHR5cGU6ICdsaXRlcmFsJywgc291cmNlOiAnSGVsbG8gJywgc3RhcnQ6IDAsIGVuZDogNiB9YFxuICogICAyLiBgeyB0eXBlOiAnbWFjcm8nLCBzb3VyY2U6ICdcXEBAZ3JlZXRpbmdAQCcsIG1hY3JvOiA8ZnVuY3Rpb24+LCBzdGFydDogNiwgZW5kOiAxOCB9YFxuICogICAzLiBgeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZTogJyEhIScsIHN0YXJ0OiAxOCwgZW5kOiAyMSB9YFxuICpcbiAqICAgQ29uY2F0ZW5hdGluZyBhbGwgYHNvdXJjZWAgcHJvcGVydGllcyB0b2dldGhlciB3aWxsIHJlc3VsdCBpbiB0aGUgb3JpZ2luYWwgaW5wdXQuXG4gKiAgIENvbmNhdGVuYXRpbmcgYWxsIGBzb3VyY2VgIHByb3BlcnRpZXMsIGFsb25nIHdpdGggdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGFsbCBgbWFjcm9gIGZ1bmN0aW9ucywgd2lsbCByZXN1bHQgaW4gdGhlIG91dHB1dCAoaS5lLiBgcGFydFswXS5zb3VyY2UgKyBwYXJ0WzFdLm1hY3JvKCkgKyBwYXJ0WzJdLnNvdXJjZWApLlxuICogICBUaGUgYG1hY3JvYCBwcm9wZXJ0eSBpcyB0aGUgYWN0dWFsIG1hY3JvIGZ1bmN0aW9uIGZvciB0aGUgcGFyc2VkIHRlbXBsYXRlIHBhcnQgKGkuZS4gaW4gb3VyIGV4YW1wbGUgYCdcXEBAZ3JlZXRpbmdAQCdgKS5cbiAqICAgYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIHRoZSBvZmZzZXRzIGZyb20gdGhlIG9yaWdpbmFsIGB0ZXh0YCB3aGVyZSB0aGUgcGFydCBjYW4gYmUgZm91bmQuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdGV4dFxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgdGVtcGxhdGUgc3RyaW5nIHRvIHBhcnNlLlxuICogICAtIG5hbWU6IG9wdGlvbnNcbiAqICAgICBkYXRhVHlwZTogb2JqZWN0XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgT3B0aW9ucyBmb3IgdGhlIG9wZXJhdGlvbi4gVGhlIHNoYXBlIG9mIHRoaXMgb2JqZWN0IGlzIGB7IHByZWZpeD86IHN0cmluZywgc2NvcGU6IG9iamVjdCB9YC5cbiAqICAgICAgIGBzY29wZWAgZGVmaW5lcyB0aGUgc2NvcGUgZm9yIG1hY3JvcyBjcmVhdGVkIGJ5IHRoaXMgbWV0aG9kIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspLlxuICogICAgICAgYHByZWZpeGAgZGVmaW5lcyBhIGZ1bmN0aW9uIGJvZHkgcHJlZml4IHRvIHVzZSB3aGlsZSBjcmVhdGluZyBtYWNyb3MgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVRlbXBsYXRlTWFjcm87KS5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVG8gc2tpcCBwYXJzaW5nIGEgc3BlY2lmaWMgdGVtcGxhdGUgcGFydCwgcHJlZml4IHdpdGggYSBiYWNrc2xhc2gsIGkuZS4gYFxcXFxcXFxcQEBncmVldGluZ0BAYC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgQXJyYXk8VGVtcGxhdGVQYXJ0PjsgKipUZW1wbGF0ZVBhcnQqKjogYHsgdHlwZTogJ2xpdGVyYWwnIHwgJ21hY3JvJywgc291cmNlOiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBtYWNybz86IGZ1bmN0aW9uIH1gLiBSZXR1cm4gYWxsIHBhcnNlZCBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlUGFydHModGV4dCwgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHBhcnRzICAgICAgICAgPSBbXTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSAwO1xuXG4gIGNvbnN0IGFkZExpdGVyYWwgPSAoc3RhcnRPZmZzZXQsIGVuZE9mZnNldCkgPT4ge1xuICAgIGxldCBzb3VyY2UgPSB0ZXh0LnN1YnN0cmluZyhzdGFydE9mZnNldCwgZW5kT2Zmc2V0KS5yZXBsYWNlKC9cXFxcQEAvZywgJ0BAJyk7XG4gICAgcGFydHMucHVzaCh7IHR5cGU6ICdsaXRlcmFsJywgc291cmNlLCBzdGFydDogc3RhcnRPZmZzZXQsIGVuZDogZW5kT2Zmc2V0IH0pO1xuICB9O1xuXG4gIHRleHQucmVwbGFjZSgvKD88IVxcXFwpKEBAKSguKz8pXFwxL2csIChtLCBfLCBwYXJzZWRUZXh0LCBvZmZzZXQpID0+IHtcbiAgICBpZiAoY3VycmVudE9mZnNldCA8IG9mZnNldClcbiAgICAgIGFkZExpdGVyYWwoY3VycmVudE9mZnNldCwgb2Zmc2V0KTtcblxuICAgIGN1cnJlbnRPZmZzZXQgPSBvZmZzZXQgKyBtLmxlbmd0aDtcblxuICAgIGxldCBtYWNybyA9IGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyAuLi5vcHRpb25zLCBib2R5OiBwYXJzZWRUZXh0IH0pO1xuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbWFjcm8nLCBzb3VyY2U6IG0sIG1hY3JvLCBzdGFydDogb2Zmc2V0LCBlbmQ6IGN1cnJlbnRPZmZzZXQgfSk7XG4gIH0pO1xuXG4gIGlmIChjdXJyZW50T2Zmc2V0IDwgdGV4dC5sZW5ndGgpXG4gICAgYWRkTGl0ZXJhbChjdXJyZW50T2Zmc2V0LCB0ZXh0Lmxlbmd0aCk7XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG5jb25zdCBOT09QID0gKGl0ZW0pID0+IGl0ZW07XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDb21waWxlIHRoZSB0ZW1wbGF0ZSBwYXJ0cyB0aGF0IHdlcmUgcGFyc2VkIGJ5IEBzZWUgVXRpbHMucGFyc2VUZW1wbGF0ZVBhcnRzOy5cbiAqXG4gKiAgIEl0IGlzIGFsc28gcG9zc2libGUgdG8gcHJvdmlkZSB0aGlzIG1ldGhvZCBhbiBhcnJheSBvZiBAc2VlIEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMsXG4gKiAgIG9yIEBzZWUgUXVlcnlFbmdpbmUuUXVlcnlFbmdpbmU7IGluc3RhbmNlcyAodGhhdCBjb250YWluIEBzZWUgRWxlbWVudHMuRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcykuXG4gKiAgIElmIGVpdGhlciBvZiB0aGVzZSB0eXBlcyBhcmUgZm91bmQgaW4gdGhlIGlucHV0IGFycmF5IChldmVuIG9uZSksIHRoZW4gdGhlIGVudGlyZSByZXN1bHQgaXMgcmV0dXJuZWRcbiAqICAgYXMgYSByYXcgYXJyYXkuXG4gKlxuICogICBPciwgaWYgYW55IG9mIHRoZSByZXN1bHRpbmcgcGFydHMgaXMgKipub3QqKiBhIEBzZWUgVXRpbHMucGFyc2VUZW1wbGF0ZVBhcnRzP2NhcHRpb249VGVtcGxhdGVQYXJ0OyBvciBhIGBzdHJpbmdgLFxuICogICB0aGVuIHJldHVybiB0aGUgcmVzdWx0aW5nIHZhbHVlIHJhdy5cbiAqXG4gKiAgIE90aGVyd2lzZSwgaWYgYWxsIHJlc3VsdGluZyBwYXJ0cyBhcmUgYSBgc3RyaW5nYCwgdGhlbiB0aGUgcmVzdWx0aW5nIHBhcnRzIGFyZSBqb2luZWQsIGFuZCBhIGBzdHJpbmdgIGlzIHJldHVybmVkLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHBhcnRzXG4gKiAgICAgZGF0YVR5cGVzOlxuICogICAgICAgLSBBcnJheTxUZW1wbGF0ZVBhcnQ+XG4gKiAgICAgICAtIEFycmF5PEVsZW1lbnREZWZpbml0aW9uPlxuICogICAgICAgLSBBcnJheTxRdWVyeUVuZ2luZT5cbiAqICAgICAgIC0gQXJyYXk8YW55PlxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSB0ZW1wbGF0ZSBwYXJ0cyB0byBjb21waWxlIHRvZ2V0aGVyLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBBcnJheTxhbnk+OyBAdHlwZXMgc3RyaW5nOyBSZXR1cm4gdGhlIHJlc3VsdCBhcyBhIHN0cmluZywgb3IgYW4gYXJyYXkgb2YgcmF3IHZhbHVlcywgb3IgYSByYXcgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVGVtcGxhdGVGcm9tUGFydHMocGFydHMsIGNhbGxiYWNrKSB7XG4gIGxldCByZXN1bHQgPSBwYXJ0c1xuICAgIC5tYXAoKHBhcnQpID0+IHtcbiAgICAgIGlmICghcGFydClcbiAgICAgICAgcmV0dXJuIHBhcnQ7XG5cbiAgICAgIGlmIChwYXJ0W01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUgfHwgcGFydFtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKVxuICAgICAgICByZXR1cm4gcGFydDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHBhcnQudHlwZSA9PT0gJ2xpdGVyYWwnKVxuICAgICAgICAgIHJldHVybiBwYXJ0LnNvdXJjZTtcbiAgICAgICAgZWxzZSBpZiAocGFydC50eXBlID09PSAnbWFjcm8nKVxuICAgICAgICAgIHJldHVybiBwYXJ0Lm1hY3JvKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIHJldHVybiBwYXJ0LnNvdXJjZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5tYXAoY2FsbGJhY2sgfHwgTk9PUClcbiAgICAuZmlsdGVyKChpdGVtKSA9PiAoaXRlbSAhPSBudWxsICYmIGl0ZW0gIT09ICcnKSk7XG5cbiAgaWYgKHJlc3VsdC5zb21lKChpdGVtKSA9PiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFIHx8IGl0ZW1bTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSkpKVxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgaWYgKHJlc3VsdC5zb21lKChpdGVtKSA9PiBCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKSlcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuXG4gIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogcmVzdWx0O1xufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2l2ZW4gYSBOb2RlLCB0YWtlIHRoZSBgLm5vZGVWYWx1ZWAgb2YgdGhhdCBub2RlLCBhbmQgaWYgaXQgaXMgYSB0ZW1wbGF0ZSxcbiAqICAgcGFyc2UgdGhhdCB0ZW1wbGF0ZSB1c2luZyBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0czssIGFuZCB0aGVuXG4gKiAgIGNvbXBpbGUgdGhhdCB0ZW1wbGF0ZSB1c2luZyBAc2VlIFV0aWxzLmNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0czsuIFRoZVxuICogICByZXN1bHRpbmcgdGVtcGxhdGUgcGFydHMgYXJlIHRoZW4gc2Nhbm5lZC4gSWYgYW55IG9mIHRoZSBgbWFjcm8oKWAgY2FsbHNcbiAqICAgcmVzdWx0IGluIGEgQHNlZSBEeW5hbWljUHJvcGVydHk/Y2FwdGlvbj1EeW5hbWljUHJvcGVydHk7LCB0aGVuIHNldCB1cFxuICogICBsaXN0ZW5lcnMgdmlhIGBhZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAuLi4pYCBvbiBlYWNoIHRvIGxpc3RlbiBmb3JcbiAqICAgY2hhbmdlcyB0byBkeW5hbWljIHByb3BlcnRpZXMuIFdoZW4gYSBsaXN0ZW5lciB1cGRhdGVzLCB0aGUgdGVtcGxhdGUgcGFydHNcbiAqICAgYXJlIHJlY29tcGlsZWQsIGFuZCB0aGUgYC5ub2RlVmFsdWVgIGlzIHNldCBhZ2FpbiB3aXRoIHRoZSBuZXcgcmVzdWx0LlxuICpcbiAqICAgSW4gc2hvcnQsIHRoaXMgbWV0aG9kIGZvcm1hdHMgdGhlIHZhbHVlIG9mIGEgTm9kZSBpZiB0aGUgdmFsdWUgaXMgYSB0ZW1wbGF0ZSxcbiAqICAgYW5kIGluIGRvaW5nIHNvIGJpbmRzIHRvIGR5bmFtaWMgcHJvcGVydGllcyBmb3IgZnV0dXJlIHVwZGF0ZXMgdG8gdGhpcyBub2RlLlxuICpcbiAqICAgSWYgdGhlIGAubm9kZVZhbHVlYCBvZiB0aGUgTm9kZSBpcyBkZXRlY3RlZCB0byAqKm5vdCoqIGJlIGEgdGVtcGxhdGUsIHRoZW5cbiAqICAgdGhlIHJlc3VsdCBpcyBhIG5vLW9wZXJhdGlvbiwgYW5kIHRoZSByYXcgdmFsdWUgb2YgdGhlIE5vZGUgaXMgc2ltcGx5IHJldHVybmVkLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IG5vZGVcbiAqICAgICBkYXRhVHlwZTogTm9kZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBOb2RlIHdob3NlIHZhbHVlIHNob3VsZCBiZSBmb3JtYXR0ZWQuIFRoaXMgbXVzdCBiZSBhIFRFWFRfTk9ERSBvciBhIEFUVFJJQlVURV9OT0RFLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSByZXN1bHRpbmcgbm9kZSB2YWx1ZS4gSWYgYSB0ZW1wbGF0ZSB3YXMgc3VjY2Vzc2Z1bGx5IGNvbXBpbGVkLCBkeW5hbWljIHByb3BlcnRpZXNcbiAqICAgYXJlIGFsc28gbGlzdGVuZWQgdG8gZm9yIGZ1dHVyZSB1cGRhdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Tm9kZVZhbHVlKG5vZGUsIF9vcHRpb25zKSB7XG4gIGlmIChub2RlLnBhcmVudE5vZGUgJiYgKC9eKHN0eWxlfHNjcmlwdCkkLykudGVzdChub2RlLnBhcmVudE5vZGUubG9jYWxOYW1lKSlcbiAgICByZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cbiAgaWYgKCFub2RlIHx8IEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUy5pbmRleE9mKG5vZGUubm9kZVR5cGUpIDwgMClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImZvcm1hdE5vZGVWYWx1ZVwiIHVuc3VwcG9ydGVkIG5vZGUgdHlwZSBwcm92aWRlZC4gT25seSBURVhUX05PREUgYW5kIEFUVFJJQlVURV9OT0RFIHR5cGVzIGFyZSBzdXBwb3J0ZWQuJyk7XG5cbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHRleHQgICAgICAgICAgPSBub2RlLm5vZGVWYWx1ZTtcbiAgbGV0IHRlbXBsYXRlUGFydHMgPSBwYXJzZVRlbXBsYXRlUGFydHModGV4dCwgb3B0aW9ucyk7XG5cbiAgLy8gdGVtcGxhdGVQYXJ0cy5mb3JFYWNoKCh7IHR5cGUsIG1hY3JvIH0pID0+IHtcbiAgLy8gICBpZiAodHlwZSAhPT0gJ21hY3JvJylcbiAgLy8gICAgIHJldHVybjtcblxuICAvLyAgIGxldCByZXN1bHQgPSBtYWNybygpO1xuICAvLyAgIGlmIChvcHRpb25zLmJpbmRUb0R5bmFtaWNQcm9wZXJ0aWVzICE9PSBmYWxzZSAmJiBpc1R5cGUocmVzdWx0LCBEeW5hbWljUHJvcGVydHkpKSB7XG4gIC8vICAgICByZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKCkgPT4ge1xuICAvLyAgICAgICBsZXQgcmVzdWx0ID0gKCcnICsgY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHRlbXBsYXRlUGFydHMpKTtcbiAgLy8gICAgICAgaWYgKHJlc3VsdCAhPT0gbm9kZS5ub2RlVmFsdWUpXG4gIC8vICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSByZXN1bHQ7XG4gIC8vICAgICB9LCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gIC8vICAgfVxuICAvLyB9KTtcblxuICBsZXQgcmVzdWx0ID0gY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHRlbXBsYXRlUGFydHMsIChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ICYmIG9wdGlvbnMuYmluZFRvRHluYW1pY1Byb3BlcnRpZXMgIT09IGZhbHNlICYmIEJhc2VVdGlscy5pc1R5cGUocmVzdWx0LCBEeW5hbWljUHJvcGVydHkpKSB7XG4gICAgICByZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gKCcnICsgY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHRlbXBsYXRlUGFydHMpKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbm9kZS5ub2RlVmFsdWUpXG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSByZXN1bHQ7XG4gICAgICB9LCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG5cbiAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgIHJlc3VsdCA9ICcnO1xuXG4gIHJldHVybiAob3B0aW9ucy5kaXNhbGxvd0hUTUwgPT09IHRydWUpID8gKCcnICsgcmVzdWx0KSA6IHJlc3VsdDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgPSAvKD88IVxcXFwpQEAvO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVGVtcGxhdGUodmFsdWUpIHtcbiAgaWYgKCFCYXNlVXRpbHMuaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIElTX1RFTVBMQVRFLnRlc3QodmFsdWUpO1xufVxuXG5jb25zdCBJU19FVkVOVF9OQU1FICAgICA9IC9eb24vO1xuY29uc3QgRVZFTlRfTkFNRV9DQUNIRSAgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGxldCB0YWdOYW1lID0gKCFlbGVtZW50LnRhZ05hbWUpID8gZWxlbWVudCA6IGVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuICBsZXQgY2FjaGUgICA9IEVWRU5UX05BTUVfQ0FDSEUuZ2V0KHRhZ05hbWUpO1xuICBpZiAoY2FjaGUpXG4gICAgcmV0dXJuIGNhY2hlO1xuXG4gIGxldCBldmVudE5hbWVzID0gW107XG5cbiAgZm9yIChsZXQga2V5IGluIGVsZW1lbnQpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDIgJiYgSVNfRVZFTlRfTkFNRS50ZXN0KGtleSkpXG4gICAgICBldmVudE5hbWVzLnB1c2goa2V5LnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgRVZFTlRfTkFNRV9DQUNIRS5zZXQodGFnTmFtZSwgZXZlbnROYW1lcyk7XG5cbiAgcmV0dXJuIGV2ZW50TmFtZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRUb0VsZW1lbnQoZWxlbWVudCwgZXZlbnROYW1lLCBfY2FsbGJhY2spIHtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IGNhbGxiYWNrO1xuXG4gIGlmIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChfY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgID0gX2NhbGxiYWNrLmNhbGxiYWNrO1xuICAgIG9wdGlvbnMgICA9IF9jYWxsYmFjay5vcHRpb25zIHx8IHt9O1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9XG5cbiAgaWYgKEJhc2VVdGlscy5pc1R5cGUoY2FsbGJhY2ssICc6OlN0cmluZycpKVxuICAgIGNhbGxiYWNrID0gY3JlYXRlVGVtcGxhdGVNYWNybyh7IHByZWZpeDogJ2xldCBldmVudD1hcmd1bWVudHNbMV0nLCBib2R5OiBjYWxsYmFjaywgc2NvcGU6IHRoaXMgfSk7IC8vIEByZWY6X2NyZWF0ZVRlbXBsYXRlTWFjcm9QcmVmaXhGb3JCaW5kRXZlbnRUb0VsZW1lbnRcblxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHsgY2FsbGJhY2ssIG9wdGlvbnMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUGF0aChvYmosIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmIChvYmogPT0gbnVsbCB8fCBPYmplY3QuaXMob2JqLCBOYU4pIHx8IE9iamVjdC5pcyhvYmosIEluZmluaXR5KSB8fCBPYmplY3QuaXMob2JqLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgaWYgKGtleSA9PSBudWxsIHx8IE9iamVjdC5pcyhrZXksIE5hTikgfHwgT2JqZWN0LmlzKGtleSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhrZXksIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBsZXQgcGFydHMgICAgICAgICA9IGtleS5zcGxpdCgvKD88IVxcXFwpXFwuL2cpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGN1cnJlbnRWYWx1ZSAgPSBvYmo7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gcGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XG4gICAgbGV0IG5leHRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwYXJ0XTtcbiAgICBpZiAobmV4dFZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY3VycmVudFZhbHVlID0gbmV4dFZhbHVlO1xuICB9XG5cbiAgaWYgKGdsb2JhbFRoaXMuTm9kZSAmJiBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlIGluc3RhbmNlb2YgZ2xvYmFsVGhpcy5Ob2RlICYmIChjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkpXG4gICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5ub2RlVmFsdWU7XG5cbiAgcmV0dXJuIChjdXJyZW50VmFsdWUgPT0gbnVsbCkgPyBkZWZhdWx0VmFsdWUgOiBjdXJyZW50VmFsdWU7XG59XG5cbmNvbnN0IENBQ0hFRF9QUk9QRVJUWV9OQU1FUyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBTS0lQX1BST1RPVFlQRVMgICAgICAgPSBbXG4gIGdsb2JhbFRoaXMuSFRNTEVsZW1lbnQsXG4gIGdsb2JhbFRoaXMuTm9kZSxcbiAgZ2xvYmFsVGhpcy5FbGVtZW50LFxuICBnbG9iYWxUaGlzLk9iamVjdCxcbiAgZ2xvYmFsVGhpcy5BcnJheSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxQcm9wZXJ0eU5hbWVzKF9vYmopIHtcbiAgaWYgKCFCYXNlVXRpbHMuaXNDb2xsZWN0YWJsZShfb2JqKSlcbiAgICByZXR1cm4gW107XG5cbiAgbGV0IGNhY2hlZE5hbWVzID0gQ0FDSEVEX1BST1BFUlRZX05BTUVTLmdldChfb2JqKTtcbiAgaWYgKGNhY2hlZE5hbWVzKVxuICAgIHJldHVybiBjYWNoZWROYW1lcztcblxuICBsZXQgb2JqICAgPSBfb2JqO1xuICBsZXQgbmFtZXMgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKG9iaikge1xuICAgIGxldCBvYmpOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gb2JqTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgIG5hbWVzLmFkZChvYmpOYW1lc1tpXSk7XG5cbiAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAob2JqICYmIFNLSVBfUFJPVE9UWVBFUy5pbmRleE9mKG9iai5jb25zdHJ1Y3RvcikgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgbGV0IGZpbmFsTmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKTtcbiAgQ0FDSEVEX1BST1BFUlRZX05BTUVTLnNldChfb2JqLCBmaW5hbE5hbWVzKTtcblxuICByZXR1cm4gZmluYWxOYW1lcztcbn1cblxuY29uc3QgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREeW5hbWljUHJvcGVydHlGb3JQYXRoKGtleVBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICBsZXQgaW5zdGFuY2VDYWNoZSA9IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5nZXQodGhpcyk7XG4gIGlmICghaW5zdGFuY2VDYWNoZSkge1xuICAgIGluc3RhbmNlQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLnNldCh0aGlzLCBpbnN0YW5jZUNhY2hlKTtcbiAgfVxuXG4gIGxldCBwcm9wZXJ0eSA9IGluc3RhbmNlQ2FjaGUuZ2V0KGtleVBhdGgpO1xuICBpZiAoIXByb3BlcnR5KSB7XG4gICAgcHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG4gICAgaW5zdGFuY2VDYWNoZS5zZXQoa2V5UGF0aCwgcHJvcGVydHkpO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BlY2lhbENsb3Nlc3Qobm9kZSwgc2VsZWN0b3IpIHtcbiAgaWYgKCFub2RlIHx8ICFzZWxlY3RvcilcbiAgICByZXR1cm47XG5cbiAgbGV0IGN1cnJlbnROb2RlID0gbm9kZTtcbiAgd2hpbGUgKGN1cnJlbnROb2RlICYmICh0eXBlb2YgY3VycmVudE5vZGUubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJyB8fCAhY3VycmVudE5vZGUubWF0Y2hlcyhzZWxlY3RvcikpKVxuICAgIGN1cnJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShjdXJyZW50Tm9kZSk7XG5cbiAgcmV0dXJuIGN1cnJlbnROb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyB8fCAwKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVEeW5hbWljUHJvcChuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlcikge1xuICBsZXQgZHluYW1pY1Byb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICBbbmFtZV06IHtcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogICAgICAgICAgKCkgPT4gZHluYW1pY1Byb3BlcnR5LFxuICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHNldHRlcihuZXdWYWx1ZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIGR5bmFtaWNQcm9wZXJ0eTtcbn1cblxuY29uc3QgRFlOQU1JQ19QUk9QX1JFR0lTVFJZID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNQcm9wSUQoaWQsIHNldFZhbHVlKSB7XG4gIGxldCBwcm9wID0gRFlOQU1JQ19QUk9QX1JFR0lTVFJZLmdldChpZCk7XG4gIGlmIChwcm9wKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XShzZXRWYWx1ZSk7XG5cbiAgICByZXR1cm4gcHJvcDtcbiAgfVxuXG4gIHByb3AgPSBuZXcgRHluYW1pY1Byb3BlcnR5KChhcmd1bWVudHMubGVuZ3RoID4gMSkgPyBzZXRWYWx1ZSA6ICcnKTtcbiAgRFlOQU1JQ19QUk9QX1JFR0lTVFJZLnNldChpZCwgcHJvcCk7XG5cbiAgcmV0dXJuIHByb3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZU5hbWVWYWx1ZVBhaXJIZWxwZXIodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICBtZXRhZGF0YShcbiAgICB0YXJnZXQsXG4gICAgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIsXG4gICAgWyBuYW1lLCB2YWx1ZSBdLFxuICApO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMgPSBuZXcgU2V0KFsgJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXScsICdteXRoaXgtZm9yLWVhY2gnIF0pO1xuZXhwb3J0IGZ1bmN0aW9uIGdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbShSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTKS5qb2luKCcsJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuYWRkKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJEaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcihzZWxlY3Rvcikge1xuICBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTLmRlbGV0ZShzZWxlY3Rvcik7XG59XG5cbmZ1bmN0aW9uIGdsb2JhbFN0b3JlSGVscGVyKGR5bmFtaWMsIGFyZ3MpIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgIHJldHVybjtcblxuICBjb25zdCBzZXRPbkdsb2JhbCA9IChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBjdXJyZW50VmFsdWUgPSBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdO1xuICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGN1cnJlbnRWYWx1ZSwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAgICAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXVtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG4gICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgIH1cblxuICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgbGV0IHByb3AgPSBkeW5hbWljUHJvcElEKG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gcHJvcCxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHByb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG5hbWVWYWx1ZVBhaXIgPSAoQmFzZVV0aWxzLmlzQ29sbGVjdGFibGUoYXJnc1swXSkpID8gbWV0YWRhdGEoXG4gICAgYXJnc1swXSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250ZXh0XG4gICAgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIsICAvLyBzcGVjaWFsIGtleVxuICApIDogbnVsbDsgLy8gQHJlZjpfbXl0aGl4TmFtZVZhbHVlUGFpckhlbHBlclVzYWdlXG5cbiAgaWYgKG5hbWVWYWx1ZVBhaXIpIHtcbiAgICBsZXQgWyBuYW1lLCB2YWx1ZSBdID0gbmFtZVZhbHVlUGFpcjtcbiAgICBzZXRPbkdsb2JhbChuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPiAxICYmIEJhc2VVdGlscy5pc1R5cGUoYXJnc1swXSwgJzo6U3RyaW5nJykpIHtcbiAgICBsZXQgbmFtZSAgPSBhcmdzWzBdO1xuICAgIGxldCB2YWx1ZSA9IGFyZ3NbMV07XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGxldCB2YWx1ZSA9IGFyZ3NbMF07XG4gICAgbGV0IG5hbWUgID0gKHR5cGVvZiB0aGlzLmdldElkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpID8gdGhpcy5nZXRJZGVudGlmaWVyKCkgOiAodGhpcy5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ25hbWUnKSk7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIm15dGhpeFVJLmdsb2JhbFN0b3JlXCI6IFwibmFtZVwiIGlzIHVua25vd24sIHNvIHVuYWJsZSB0byBzdG9yZSB2YWx1ZScpO1xuXG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZSguLi5hcmdzKSB7XG4gIHJldHVybiBnbG9iYWxTdG9yZUhlbHBlci5jYWxsKHRoaXMsIGZhbHNlLCBhcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlRHluYW1pYyguLi5hcmdzKSB7XG4gIHJldHVybiBnbG9iYWxTdG9yZUhlbHBlci5jYWxsKHRoaXMsIHRydWUsIGFyZ3MpO1xufVxuXG5jbGFzcyBTdG9yYWdlSXRlbSB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdGhpcy5fYyA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fdSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fdiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Y7XG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3YgPSB2YWx1ZTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJHR5cGU6ICAnU3RvcmFnZUl0ZW0nLFxuICAgICAgX2M6ICAgICB0aGlzLl9jLFxuICAgICAgX3U6ICAgICB0aGlzLl91LFxuICAgICAgX3Y6ICAgICB0aGlzLl92LFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgU3RvcmFnZSB7XG4gIF9yZXZpdmUoZGF0YSwgX2FscmVhZHlWaXNpdGVkKSB7XG4gICAgaWYgKCFkYXRhIHx8IEJhc2VVdGlscy5pc1ByaW1pdGl2ZShkYXRhKSlcbiAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgbGV0IGFscmVhZHlWaXNpdGVkICA9IF9hbHJlYWR5VmlzaXRlZCB8fCBuZXcgU2V0KCk7XG4gICAgbGV0IHR5cGUgICAgICAgICAgICA9IChkYXRhICYmIGRhdGEuJHR5cGUpO1xuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09PSAnU3RvcmFnZUl0ZW0nKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGEuX3Y7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFN0b3JhZ2VJdGVtKCksIHtcbiAgICAgICAgICBfYzogZGF0YS5fYyxcbiAgICAgICAgICBfdTogZGF0YS5fdSxcbiAgICAgICAgICBfdjogKHZhbHVlICYmICFCYXNlVXRpbHMuaXNQcmltaXRpdmUodmFsdWUpKSA/IHRoaXMuX3Jldml2ZSh2YWx1ZSwgYWxyZWFkeVZpc2l0ZWQpIDogdmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICBpZiAoIXZhbHVlIHx8IEJhc2VVdGlscy5pc1ByaW1pdGl2ZSh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZCh2YWx1ZSk7XG4gICAgICBkYXRhW2tleV0gPSB0aGlzLl9yZXZpdmUodmFsdWUsIGFscmVhZHlWaXNpdGVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9yYXcoZGF0YSwgX2FscmVhZHlWaXNpdGVkKSB7XG4gICAgaWYgKCFkYXRhIHx8IEJhc2VVdGlscy5pc1ByaW1pdGl2ZShkYXRhKSlcbiAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgbGV0IGFscmVhZHlWaXNpdGVkID0gX2FscmVhZHlWaXNpdGVkIHx8IG5ldyBTZXQoKTtcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFN0b3JhZ2VJdGVtKVxuICAgICAgcmV0dXJuIHRoaXMuX3JhdyhkYXRhLmdldFZhbHVlKCksIGFscmVhZHlWaXNpdGVkKTtcblxuICAgIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICBpZiAoIXZhbHVlIHx8IEJhc2VVdGlscy5pc1ByaW1pdGl2ZSh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZCh2YWx1ZSk7XG4gICAgICBkYXRhW2tleV0gPSB0aGlzLl9yYXcodmFsdWUsIGFscmVhZHlWaXNpdGVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9nZXRQYXJ0c0Zvck9wZXJhdGlvbih0eXBlLCBwYXJ0cykge1xuICAgIGxldCBwYXRoUGFydHMgICA9ICh0eXBlID09PSAnc2V0JykgPyBwYXJ0cy5zbGljZSgwLCAtMSkgOiBwYXJ0cy5zbGljZSgpO1xuICAgIGxldCBwYXRoICAgICAgICA9IHBhdGhQYXJ0cy5tYXAoKHBhcnQpID0+ICgodHlwZW9mIHBhcnQgPT09ICdzeW1ib2wnKSA/IHBhcnQudG9TdHJpbmcoKSA6ICgnJyArIHBhcnQpKS5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJykpLmpvaW4oJy4nKTtcbiAgICBsZXQgcGFyc2VkUGFydHMgPSBwYXRoLnNwbGl0KC8oPzwhXFxcXClcXC4vZyk7XG4gICAgbGV0IHN0b3JhZ2VUeXBlID0gcGFyc2VkUGFydHNbMF07XG4gICAgbGV0IGRhdGEgICAgICAgID0gKHR5cGUgPT09ICdzZXQnKSA/IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgLy8gbG9jYWxTdG9yYWdlLCBvciBzZXNzaW9uU3RvcmFnZVxuICAgIGxldCBzdG9yYWdlRW5naW5lID0gZ2xvYmFsVGhpc1tzdG9yYWdlVHlwZV07XG4gICAgaWYgKCFzdG9yYWdlRW5naW5lKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHJvb3REYXRhICAgID0ge307XG4gICAgbGV0IGVuY29kZWRCYXNlID0gc3RvcmFnZUVuZ2luZS5nZXRJdGVtKCdteXRoaXgtdWknKTtcbiAgICBpZiAoZW5jb2RlZEJhc2UpXG4gICAgICByb290RGF0YSA9IHRoaXMuX3Jldml2ZShKU09OLnBhcnNlKGVuY29kZWRCYXNlKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGF0aFBhcnRzLFxuICAgICAgcGF0aCxcbiAgICAgIHBhcnNlZFBhcnRzLFxuICAgICAgc3RvcmFnZVR5cGUsXG4gICAgICBkYXRhLFxuICAgICAgc3RvcmFnZUVuZ2luZSxcbiAgICAgIGVuY29kZWRCYXNlLFxuICAgICAgcm9vdERhdGEsXG4gICAgfTtcbiAgfVxuXG4gIF9nZXRNZXRhKHR5cGUsIHBhcnRzKSB7XG4gICAgbGV0IG9wZXJhdGlvbiA9IHRoaXMuX2dldFBhcnRzRm9yT3BlcmF0aW9uKHR5cGUsIHBhcnRzKTtcbiAgICBsZXQge1xuICAgICAgcGFyc2VkUGFydHMsXG4gICAgICByb290RGF0YSxcbiAgICB9ID0gb3BlcmF0aW9uO1xuXG4gICAgbGV0IHNjb3BlICAgICAgICA9IHJvb3REYXRhO1xuICAgIGxldCBwYXJlbnRTY29wZSAgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDEsIGlsID0gcGFyc2VkUGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgaWYgKHNjb3BlIGluc3RhbmNlb2YgU3RvcmFnZUl0ZW0pIHtcbiAgICAgICAgc2NvcGUgPSBzY29wZS5nZXRWYWx1ZSgpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBsZXQgcGFydCA9IHBhcnNlZFBhcnRzW2ldO1xuICAgICAgbGV0IHN1YlNjb3BlID0gKHNjb3BlKSA/IHNjb3BlW3BhcnRdIDogc2NvcGU7XG4gICAgICBpZiAodHlwZSA9PT0gJ3NldCcgJiYgIXN1YlNjb3BlKVxuICAgICAgICBzdWJTY29wZSA9IHNjb3BlW3BhcnRdID0ge307XG5cbiAgICAgIGlmIChzdWJTY29wZSA9PSBudWxsIHx8IE9iamVjdC5pcyhzdWJTY29wZSwgTmFOKSB8fCBPYmplY3QuaXMoc3ViU2NvcGUsIC1JbmZpbml0eSkgfHwgT2JqZWN0LmlzKHN1YlNjb3BlLCBJbmZpbml0eSkpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBwYXJlbnRTY29wZSA9IHNjb3BlO1xuICAgICAgc2NvcGUgPSBzdWJTY29wZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgb3BlcmF0aW9uLFxuICAgICAgcGFyZW50U2NvcGUsXG4gICAgICBzY29wZSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TWV0YSguLi5wYXJ0cykge1xuICAgIHJldHVybiB0aGlzLl9nZXRNZXRhKCdnZXQnLCBwYXJ0cyk7XG4gIH1cblxuICBnZXQoLi4ucGFydHMpIHtcbiAgICBsZXQgeyBzY29wZSB9ID0gdGhpcy5fZ2V0TWV0YSgnZ2V0JywgcGFydHMpO1xuICAgIHJldHVybiB0aGlzLl9yYXcoc2NvcGUpO1xuICB9XG5cbiAgc2V0KC4uLnBhcnRzKSB7XG4gICAgbGV0IHtcbiAgICAgIG9wZXJhdGlvbixcbiAgICAgIHBhcmVudFNjb3BlLFxuICAgICAgc2NvcGUsXG4gICAgfSA9IHRoaXMuX2dldE1ldGEoJ3NldCcsIHBhcnRzKTtcblxuICAgIGxldCB7XG4gICAgICBkYXRhLFxuICAgICAgcGFyc2VkUGFydHMsXG4gICAgICBwYXRoLFxuICAgICAgcm9vdERhdGEsXG4gICAgICBzdG9yYWdlRW5naW5lLFxuICAgIH0gPSBvcGVyYXRpb247XG5cbiAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBEZWxldGVcbiAgICAgIGlmIChwYXJlbnRTY29wZSlcbiAgICAgICAgZGVsZXRlIHBhcmVudFNjb3BlW3BhcnNlZFBhcnRzW3BhcnNlZFBhcnRzLmxlbmd0aCAtIDFdXTtcbiAgICAgIGVsc2VcbiAgICAgICAgZGVsZXRlIHNjb3BlW3BhcnNlZFBhcnRzW3BhcnNlZFBhcnRzLmxlbmd0aCAtIDFdXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBhcmVudFNjb3BlKVxuICAgICAgICBwYXJlbnRTY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV0gPSBuZXcgU3RvcmFnZUl0ZW0oZGF0YSk7XG4gICAgICBlbHNlXG4gICAgICAgIHNjb3BlW3BhcnNlZFBhcnRzW3BhcnNlZFBhcnRzLmxlbmd0aCAtIDFdXSA9IG5ldyBTdG9yYWdlSXRlbShkYXRhKTtcbiAgICB9XG5cbiAgICBzdG9yYWdlRW5naW5lLnNldEl0ZW0oJ215dGhpeC11aScsIEpTT04uc3RyaW5naWZ5KHJvb3REYXRhKSk7XG5cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG59XG5cbmV4cG9ydCBjb25zdCBzdG9yYWdlID0gbmV3IFN0b3JhZ2UoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSB8fCB7fSk7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLnVybClcbiAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS51cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uKTtcblxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5leHBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmV4cG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICcuL2R5bmFtaWMtcHJvcGVydHkuanMnO1xuXG5leHBvcnQgKiBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5leHBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5leHBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHsgTXl0aGl4VUlSZXF1aXJlIH0gZnJvbSAnLi9teXRoaXgtdWktcmVxdWlyZS5qcyc7XG5cbmltcG9ydCB7XG4gIE15dGhpeFVJTGFuZ3VhZ2VQYWNrLFxuICBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIsXG59IGZyb20gJy4vbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzJztcblxuaW1wb3J0IHsgTXl0aGl4VUlTcGlubmVyIH0gZnJvbSAnLi9teXRoaXgtdWktc3Bpbm5lci5qcyc7XG5cbmV4cG9ydCBjb25zdCBNeXRoaXhFbGVtZW50cyA9IHtcbiAgTXl0aGl4VUlSZXF1aXJlLFxuICBNeXRoaXhVSUxhbmd1YWdlUGFjayxcbiAgTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyLFxuICBNeXRoaXhVSVNwaW5uZXIsXG59O1xuXG5jb25zdCBNeXRoaXhVSUNvbXBvbmVudCA9IENvbXBvbmVudHMuTXl0aGl4VUlDb21wb25lbnQ7XG5cbmV4cG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICBEeW5hbWljUHJvcGVydHksXG59O1xuXG5sZXQgX215dGhpeElzUmVhZHkgPSBmYWxzZTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgJ29ubXl0aGl4cmVhZHknOiB7XG4gICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiAgICAgICAgICAoKSA9PiB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHNldDogICAgICAgICAgKGNhbGxiYWNrKSA9PiB7XG4gICAgICBpZiAoX215dGhpeElzUmVhZHkpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBjYWxsYmFjayhuZXcgRXZlbnQoJ215dGhpeC1yZWFkeScpKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXl0aGl4LXJlYWR5JywgY2FsbGJhY2spO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5CYXNlVXRpbHMgPSBCYXNlVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLlV0aWxzID0gVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkNvbXBvbmVudHMgPSBDb21wb25lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5FbGVtZW50cyA9IEVsZW1lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZSA9IFV0aWxzLmdsb2JhbFN0b3JlO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZUR5bmFtaWMgPSBVdGlscy5nbG9iYWxTdG9yZUR5bmFtaWM7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiBVdGlscy5keW5hbWljUHJvcElEKGlkKTtcbn07XG5cbmNsYXNzIE15dGhpeENvbm5lY3RlZEV2ZW50IGV4dGVuZHMgQ3VzdG9tRXZlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignbXl0aGl4LWNvbm5lY3RlZCcpO1xuICB9XG59XG5cbmNsYXNzIE15dGhpeERpc2Nvbm5lY3RlZEV2ZW50IGV4dGVuZHMgQ3VzdG9tRXZlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignbXl0aGl4LWRpc2Nvbm5lY3RlZCcpO1xuICB9XG59XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxldCBkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzID0gZmFsc2U7XG5cbiAgY29uc3Qgb25Eb2N1bWVudFJlYWR5ID0gKCkgPT4ge1xuICAgIGlmICghZGlkVmlzaWJpbGl0eU9ic2VydmVycykge1xuICAgICAgbGV0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1teXRoaXgtc3JjXScpKTtcbiAgICAgIENvbXBvbmVudHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IGRpc2Nvbm5lY3QsIGVsZW1lbnQsIHdhc1Zpc2libGUgfSkgPT4ge1xuICAgICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJyk7XG4gICAgICAgIGlmICghc3JjKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBDb21wb25lbnRzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgeyBlbGVtZW50cyB9KTtcblxuICAgICAgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IHRydWU7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcblxuICAgIGlmIChfbXl0aGl4SXNSZWFkeSlcbiAgICAgIHJldHVybjtcblxuICAgIF9teXRoaXhJc1JlYWR5ID0gdHJ1ZTtcblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAgICckJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciguLi5hcmdzKSxcbiAgICB9LFxuICAgICckJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoLi4uYXJncyksXG4gICAgfSxcbiAgfSk7XG5cbiAgbGV0IGRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiAgPSBtdXRhdGlvbnNbaV07XG4gICAgICBsZXQgdGFyZ2V0ICAgID0gbXV0YXRpb24udGFyZ2V0O1xuXG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0eXBlb2YgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IChhdHRyaWJ1dGVOb2RlKSA/IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlIDogbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5pc1RlbXBsYXRlKG5ld1ZhbHVlKSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZSh0YXJnZXQpLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG5cbiAgICAgICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcyA9IHRhcmdldC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMgJiYgb2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobXV0YXRpb24uYXR0cmlidXRlTmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbCh0YXJnZXQsIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgbGV0IGRpc2FibGVUZW1wbGF0aW5nID0gKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyICYmIHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXSxteXRoaXgtZm9yLWVhY2gnKSk7XG4gICAgICAgIGxldCBhZGRlZE5vZGVzICAgICAgICA9IG11dGF0aW9uLmFkZGVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IGFkZGVkTm9kZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIGxldCBub2RlID0gYWRkZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25BZGRlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICghZGlzYWJsZVRlbXBsYXRpbmcpXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSk7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUuZGlzcGF0Y2hFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IGNvbm5lY3RlZEV2ZW50ID0gbmV3IE15dGhpeENvbm5lY3RlZEV2ZW50KCk7XG4gICAgICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoY29ubmVjdGVkRXZlbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbW92ZWROb2RlcyA9IG11dGF0aW9uLnJlbW92ZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IHJlbW92ZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25SZW1vdmVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmRpc3BhdGNoRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCBkaXNjb25uZWN0ZWRFdmVudCA9IG5ldyBNeXRoaXhEaXNjb25uZWN0ZWRFdmVudCgpO1xuICAgICAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGRpc2Nvbm5lY3RlZEV2ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGFyZ2V0W0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdKVxuICAgICAgICAgICAgdGFyZ2V0Lm9uTXV0YXRpb25DaGlsZFJlbW92ZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwge1xuICAgIHN1YnRyZWU6ICAgICAgICAgICAgdHJ1ZSxcbiAgICBjaGlsZExpc3Q6ICAgICAgICAgIHRydWUsXG4gICAgYXR0cmlidXRlczogICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiAgdHJ1ZSxcbiAgfSk7XG5cbiAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzKGRvY3VtZW50LmhlYWQpO1xuICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMoZG9jdW1lbnQuYm9keSk7XG5cbiAgY29uc3QgRE9DVU1FTlRfQ0hFQ0tfUkVBRFlfVElNRSA9IDI1MDtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJylcbiAgICAgIG9uRG9jdW1lbnRSZWFkeSgpO1xuICAgIGVsc2VcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbkRvY3VtZW50UmVhZHkpO1xuICB9LCBET0NVTUVOVF9DSEVDS19SRUFEWV9USU1FKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=