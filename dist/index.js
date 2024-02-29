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
function toKebabCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase()))
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
    let name = _name || this.tagName;

    if (!customElements.get(name)) {
      let Klass = _Klass || this;
      Klass.observedAttributes = Klass.compileAttributeMethods(Klass);
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
      return;

    let processedTemplate = this.getProcessedTemplate(_template);
    if (processedTemplate) {
      // ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      target.appendChild(processedTemplate);
    }
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
   *       @see ElementGenerator; Proxy instance, that will properly generate any element requested. The
   *       second argument, `context`, is simply an empty object provided to the callback, allowing the
   *       developer to store contextual based information for the operation, if desired.
   * return: |
   *   @types ElementDefinition | Array<ElementDefinition>; The @see ElementDefinition; instances defining
   *   the DOM to generate when inserted.
   * notes:
   *   - |
   *     :info: The difference between this method and @see MythixUIComponent.$build; method is
   *     that this method will return @see ElementDefinition; instances, whereas the
   *     @see MythixUIComponent.$build; method will return a @see QueryEngine; instance containing
   *     all the built @see ElementDefinition; instances.
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

  dynamicProp(name, defaultValue, setter, _context) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_2__.dynamicProp.call(_context || this, name, defaultValue, setter);
  }

  dynamicData(obj) {
    let keys = Object.keys(obj);
    let data = Object.create(null);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = obj[key];
      if (typeof value === 'function')
        continue;

      _utils_js__WEBPACK_IMPORTED_MODULE_2__.dynamicProp.call(data, key, value);
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

    if (IS_TEMPLATE.test(child.tagName)) { // <template>
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

      let scriptID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(`${guessedElementName}:${src || childClone.innerHTML}`)}`;
      if (!childClone.getAttribute('id'))
        childClone.setAttribute('id', scriptID);

      // append to head
      if (!ownerDocument.querySelector(`script#${scriptID}`))
        ownerDocument.head.appendChild(childClone);
    } else if ((/^(link|style)$/i).test(child.tagName)) { // <link> & <style>
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      let id = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(child.outerHTML)}`;
      if (!child.getAttribute('id'))
        child.setAttribute('id', id);

      // append to head
      if (!ownerDocument.querySelector(`${child.tagName}#${id}`))
        ownerDocument.head.appendChild(child);
    } else if ((/^meta$/i).test(child.tagName)) { // <meta>
      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isMeta: true, isHandled: true });

      // do nothing with these tags
      continue;
    } else { // Everything else
      let isHandled = false;

      if (child.localName === 'mythix-language-pack') {
        let langPackID = `ID${_base_utils_js__WEBPACK_IMPORTED_MODULE_1__.SHA256(`${guessedElementName}:${child.outerHTML}`)}`;
        if (!child.getAttribute('id'))
          child.setAttribute('id', langPackID);

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
 *  type: Namespace
 *  name: Elements
 *  groupName: Elements
 *  desc: |
 *    `import { Elements } from 'mythix-ui-core@1.0';`
 *
 *    Utility and element building functions for the DOM.
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
    if (IS_TEMPLATE_MERGE_ELEMENT.test(node.tagName))
      return compileMergeFragment(ownerDocument, node);

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

class MythixUIRequire extends _components_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  async mounted() {
    super.mounted();

    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await _components_js__WEBPACK_IMPORTED_MODULE_0__.require.call(
        this,
        src,
        {
          magic:          true,
          ownerDocument:  this.ownerDocument || document,
        },
      );

      if (cached)
        return;

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
 * groupName: Utils
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
/* harmony export */   dynamicProp: () => (/* binding */ dynamicProp),
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

function dynamicProp(name, defaultValue, setter) {
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
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   MythixUILanguagePack: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_7__.MythixUILanguagePack),
/* harmony export */   MythixUILanguageProvider: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_7__.MythixUILanguageProvider),
/* harmony export */   MythixUIRequire: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_6__.MythixUIRequire),
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_8__.MythixUISpinner),
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

globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Components = _components_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_2__;
globalThis.mythixUI.globalScope.globalStore = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.dynamicPropID(id);
};

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

          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

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
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__MythixUILanguagePack = __webpack_exports__.MythixUILanguagePack;
var __webpack_exports__MythixUILanguageProvider = __webpack_exports__.MythixUILanguageProvider;
var __webpack_exports__MythixUIRequire = __webpack_exports__.MythixUIRequire;
var __webpack_exports__MythixUISpinner = __webpack_exports__.MythixUISpinner;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
export { __webpack_exports__BaseUtils as BaseUtils, __webpack_exports__Components as Components, __webpack_exports__DynamicProperty as DynamicProperty, __webpack_exports__Elements as Elements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUILanguagePack as MythixUILanguagePack, __webpack_exports__MythixUILanguageProvider as MythixUILanguageProvider, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFLElBQUk7QUFDTjs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwSXFDOztBQUVyQyxnREFBZ0Q7O0FBSTlDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVksMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUEsY0FBYyxXQUFXLEVBQUUsMkNBQTJDO0FBQ3RFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDLG1DQUFtQyxhQUFhLDRFQUE0RSxLQUFLO0FBQ2pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixrQkFBa0I7O0FBRTdDO0FBQ0EseUJBQXlCLFdBQVc7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7O0FBRUEsZ0JBQWdCLGlDQUFpQyxFQUFFLHNCQUFzQjtBQUN6RTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsZ0JBQWdCLGtCQUFrQjs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBLG1DQUFtQztBQUNuQztBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDBDQUEwQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsdURBQXVELGdCQUFnQjtBQUN2RSxnQkFBZ0IsR0FBRztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsdURBQXVELGdCQUFnQjtBQUN2RSxnQkFBZ0IsR0FBRztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOXVCd0I7O0FBRXVCO0FBQ0w7QUFDTztBQUNKOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxhQUFhLDBCQUEwQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7O0FBRU8sbUdBQW1HOztBQUUxRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsbUJBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF3RjtBQUN4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkZBQTZGO0FBQzdGO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsbUNBQW1DLHNEQUFXLE1BQU0sbUVBQXdCO0FBQzVFLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQywyQ0FBMkM7QUFDakY7QUFDQTs7QUFFQSxZQUFZLGFBQWEsRUFBRSxzRUFBcUM7QUFDaEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQOztBQUVBO0FBQ0EsMEJBQTBCLDBEQUF5QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdURBQXFCOztBQUVqRCxpQ0FBaUMsMkNBQTJDOztBQUU1RTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTyxzREFBVztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsbUVBQXdCO0FBQzlDLE9BQU87QUFDUCw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTCxJQUFJLGtEQUFpQjs7QUFFckI7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLGdEQUFnRCxZQUFZLEdBQUcsZUFBZTtBQUM5RSxPQUFPO0FBQ1Asc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLDRCQUE0QiwrQ0FBYyxtQkFBbUIsc0VBQTJCO0FBQ3hGO0FBQ0EsVUFBVSwrQ0FBYyxtQkFBbUIsc0VBQTJCO0FBQ3RFLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDLGtEQUFrRCxTQUFTLGFBQWEsS0FBSztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxrREFBZ0IsSUFBSSxzQkFBc0IsR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHO0FBQ25HO0FBQ0EsNkRBQTZELFFBQVE7O0FBRXJFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEIsV0FBVyx5REFBd0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELGlEQUFlO0FBQy9EOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUhBQXVIO0FBQ3ZILGdKQUFnSjtBQUNoSjtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLFdBQVcsb0RBQW1CO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxzSUFBc0ksZ0NBQWdDO0FBQ3pPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLCtDQUFjLFNBQVMsK0RBQW9CLFNBQVM7O0FBRXhEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUVBQXVFO0FBQ2pHO0FBQ0E7QUFDQSwrQkFBK0IsK0JBQStCLEdBQUc7QUFDakU7O0FBRUE7QUFDQSxXQUFXLHVEQUFzQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGFBQWEsdURBQXNCOztBQUVuQztBQUNBOztBQUVBLG9GQUFvRixzQkFBc0IsMEJBQTBCLHNCQUFzQjtBQUMxSjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxpREFBZTtBQUN6Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLElBQUksb0RBQWtCO0FBQ3RCO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEseUNBQXlDLHdCQUF3QjtBQUNqRTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSyxJQUFJLG9CQUFvQjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLHVEQUFxQjtBQUNqRCxvQ0FBb0MsYUFBYTtBQUNqRCxZQUFZLGNBQWMsRUFBRSxzRUFBcUM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsa0RBQWlCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIseURBQXVCO0FBQzlDLHNCQUFzQix5REFBVyxtQkFBbUIsZ0RBQWdEO0FBQ3BHOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLHlEQUFXO0FBQ25CO0FBQ0EsWUFBWSxtQkFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUZBQXVGO0FBQ3ZGLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0Esa0ZBQWtGO0FBQ2xGLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnR0FBZ0c7QUFDaEc7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsNERBQTRELDRCQUE0QjtBQUN4RjtBQUNBO0FBQ0E7QUFDQSxzRkFBc0Y7QUFDdEYsOERBQThEO0FBQzlELHdDQUF3Qyx1Q0FBdUM7QUFDL0UsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQSx1Q0FBdUMsMERBQXlCLElBQUk7QUFDcEUsdUJBQXVCLGdFQUFxQjtBQUM1Qzs7QUFFQTtBQUNBLEtBQUs7O0FBRUwsaURBQWlELDJEQUEwQixnQkFBZ0I7QUFDM0Y7O0FBRUE7QUFDQSxXQUFXLHlEQUFXO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFHQUFxRyx1REFBcUI7QUFDMUg7O0FBRUE7QUFDQSxXQUFXLCtDQUFjO0FBQ3pCOztBQUVBO0FBQ0EsV0FBVyxrREFBaUI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sa0RBQWlCO0FBQ3ZCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxjQUFjLDREQUEwQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLGtEQUFnQjtBQUMxQjs7QUFFQSxVQUFVLHlEQUF1QjtBQUNqQztBQUNBOztBQUVBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHdCQUF3QixzQkFBc0Isd0NBQXdDLFFBQVEsZ0JBQWdCLFVBQVU7QUFDeEg7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkdBQTJHLHVEQUFxQjs7QUFFaEk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMENBQTBDLEVBQUUsUUFBUTtBQUNyRSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVEsK0JBQStCLFlBQVk7O0FBRXhFLG1CQUFtQixZQUFZLEVBQUUsUUFBUTtBQUN6QyxTQUFTO0FBQ1QsbUJBQW1CLFNBQVMsRUFBRSxZQUFZO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsTUFBTTtBQUNsQyxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7O0FBRVY7QUFDQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQixXQUFXLEVBQUUsUUFBUTtBQUNwRCxzREFBc0QsUUFBUTtBQUM5RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPQUFPLGtEQUFnQjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsS0FBSzs7QUFFdkI7QUFDQTtBQUNBLEtBQUs7O0FBRUwsOERBQThELGtDQUFrQztBQUNoRztBQUNBLHFEQUFxRCxPQUFPO0FBQzVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVyxFQUFFO0FBQzFDO0FBQ0E7QUFDQSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUzs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsRUFBRSxPQUFPLFlBQVksR0FBRyxZQUFZO0FBQ3RFLEtBQUssYUFBYSxHQUFHO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQ0FBMkM7QUFDM0M7QUFDQSx3QkFBd0IsSUFBSSwrRkFBK0YsbUJBQW1CO0FBQzlJO0FBQ0E7O0FBRUEsK0VBQStFLCtDQUErQztBQUM5SDs7QUFFQTtBQUNBO0FBQ0EsMERBQTBELFlBQVksb0NBQW9DLFlBQVk7QUFDdEg7QUFDQSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxvRkFBb0YsNkNBQTZDO0FBQ2pJOztBQUVBLDBCQUEwQixrREFBZ0IsSUFBSSxtQkFBbUIsR0FBRyw0QkFBNEIsR0FBRztBQUNuRztBQUNBOztBQUVBO0FBQ0EsaURBQWlELFNBQVM7QUFDMUQ7QUFDQSxNQUFNLG9EQUFvRDtBQUMxRDtBQUNBLCtFQUErRSx3REFBd0Q7QUFDdkk7O0FBRUEsb0JBQW9CLGtEQUFnQixrQkFBa0I7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQyxjQUFjLEdBQUcsR0FBRztBQUM5RDtBQUNBLE1BQU0sNENBQTRDO0FBQ2xEO0FBQ0Esd0NBQXdDLDJDQUEyQzs7QUFFbkY7QUFDQTtBQUNBLE1BQU0sT0FBTztBQUNiOztBQUVBO0FBQ0EsOEJBQThCLGtEQUFnQixJQUFJLG1CQUFtQixHQUFHLGdCQUFnQixHQUFHO0FBQzNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLFdBQVc7QUFDakY7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQSx3Q0FBd0MsdUJBQXVCO0FBQy9EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsV0FBVyxFQUFFLGFBQWE7QUFDN0Q7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGlCQUFpQixFQUFFLG9CQUFvQjtBQUN4RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLGtEQUFnQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdUJBQXVCO0FBQ25EO0FBQ0E7QUFDQSxZQUFZLHlEQUF3QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrREFBaUI7QUFDeEMsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTs7QUFFTztBQUNQO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLCtDQUFjLFVBQVUsd0VBQTZCO0FBQ2xGO0FBQ0E7QUFDQSxRQUFRLCtDQUFjLFVBQVUsd0VBQTZCO0FBQzdEOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLGtGQUFrRjs7QUFFbkc7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0EsaUNBQWlDOztBQUVqQyx3Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVNO0FBQ1AseUJBQXlCLCtDQUFjLFVBQVUsd0VBQTZCO0FBQzlFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzk2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWSwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0EsWUFBWSw0RkFBNEY7QUFDeEc7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLCtCQUErQjtBQUNoRyw4R0FBOEc7QUFDOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQSw0Q0FBNEM7QUFDNUM7O0FBRUE7QUFDTyx5R0FBeUc7QUFDekcsZ0dBQWdHO0FBQ2hHLHFHQUFxRztBQUNyRyxtSEFBbUg7QUFDbkgsaUhBQWlIOztBQUV4SDtBQUNPO0FBQ0E7QUFDQTs7QUFFUDtBQUNPO0FBQ0E7QUFDQSx3R0FBd0c7QUFDeEc7O0FBRVA7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlFaUI7O0FBRXFCOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHVDQUF1QztBQUN2QztBQUNBLHVJQUF1STtBQUN2STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStELFlBQVksdUJBQXVCLGVBQWU7QUFDakgseUNBQXlDLDBCQUEwQjtBQUNuRSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLDBDQUEwQztBQUMxQztBQUNBLG1DQUFtQyxzREFBVyxNQUFNLGdFQUFxQjtBQUN6RSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLFlBQVksdUJBQXVCLGVBQWU7QUFDbkgsMkNBQTJDLDBCQUEwQjtBQUNyRSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLCtEQUFvQixFQUFFOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTyxzREFBVztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsZ0VBQXFCO0FBQzNDLE9BQU87QUFDUCxPQUFPLGlFQUFzQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0RBQWdCO0FBQ3ZDLE9BQU87QUFDUCxPQUFPLHNFQUEyQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsaUVBQXNCO0FBQ2pELDBEQUEwRCxpRUFBc0I7QUFDaEYsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGlFQUFzQjs7QUFFdkM7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsaUVBQXNCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixpRUFBc0I7QUFDM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsZ0JBQWdCLGlFQUFzQjtBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRkFBMkYsOEJBQThCO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7QUFDQSxHQUFHLCtEQUFvQjtBQUN2QjtBQUNBLFFBQVEsa0RBQWdCO0FBQ3hCOztBQUVBLGFBQWEsaUVBQXNCO0FBQ25DOztBQUVBLGFBQWEsc0VBQTJCO0FBQ3hDLFdBQVcsaUVBQXNCO0FBQ2pDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxXQUFXLHNFQUEyQjs7QUFFdEMsMEJBQTBCLGlFQUFzQjtBQUNoRCxXQUFXLGlFQUFzQjs7QUFFakM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ04sV0FBVyxzRUFBMkI7QUFDdEM7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOVF3Qjs7QUFFcUI7QUFDVDtBQUNvQjs7QUFFeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixXQUFXLDBCQUEwQjtBQUNyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQSxtQ0FBbUMsc0RBQVcsTUFBTSxrRUFBdUI7QUFDM0UsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxzREFBVztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0VBQXVCO0FBQzdDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxzQkFBc0I7O0FBRTVFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLEtBQUssSUFBSSw0QkFBNEI7QUFDN0Q7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4QkFBOEIsUUFBUSxFQUFFLGNBQWMsTUFBTSxPQUFPO0FBQ25FLCtCQUErQixRQUFROztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGNBQWMsZ0JBQWdCLEVBQUUsK0JBQStCLFNBQVMsRUFBRSxjQUFjLEVBQUU7QUFDMUY7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLGlFQUFnQztBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHlEQUF3QjtBQUNoQyxVQUFVLGtEQUFpQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsUUFBUTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBLHVEQUF1RCxpQkFBaUI7QUFDeEUsR0FBRztBQUNIOztBQUVPO0FBQ1A7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDLEdBQUc7QUFDSDs7QUFFQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxXQUFXLHNEQUFXLE1BQU0sa0VBQXVCO0FBQ25EOztBQUVBLFdBQVcsc0RBQVcsTUFBTSw0REFBaUI7QUFDN0M7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUZBQWlGLFNBQVMsMEJBQTBCLFNBQVM7O0FBRTdIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxrREFBaUI7QUFDN0IsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsdUVBQXNDO0FBQzFFLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBLHVDQUF1QyxxREFBb0I7QUFDM0Q7O0FBRUE7QUFDQSw2Q0FBNkMseUZBQXlGO0FBQ3RJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNEQUFxQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWMsc0RBQVcsTUFBTSxrRUFBdUI7QUFDbEUsdURBQXVELE9BQU87QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYyxzREFBVyxNQUFNLDREQUFpQjtBQUM1RDtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQSwwQkFBMEIsaUVBQWdDO0FBQzFEOztBQUVBLGdEQUFnRCxRQUFRO0FBQ3hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSx5REFBd0I7QUFDbEMsWUFBWSxrREFBaUI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsU0FBUyxpREFBZ0I7QUFDakM7QUFDQTtBQUNBLG9DQUFvQyxzREFBcUIsa0JBQWtCLGdDQUFnQztBQUMzRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUCxtQkFBbUIsa0RBQWdCO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsZ0VBQXFCO0FBQ3ZDOztBQUVBLGtCQUFrQixzREFBVyxNQUFNLGtFQUF1QjtBQUMxRDs7QUFFQSxrQkFBa0Isc0RBQVcsTUFBTSw0REFBaUI7QUFDcEQ7O0FBRUE7QUFDQTs7QUFFQSxhQUFhLGtEQUFnQixvQkFBb0IsaUVBQWU7QUFDaEU7O0FBRUEsZ0RBQWdELHFCQUFxQjtBQUNyRSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsZ0VBQXFCO0FBQ2pEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzSEFBc0g7QUFDdEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0NBQWtDLGdFQUFxQjtBQUN2RDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFTztBQUNQO0FBQ0EsNENBQTRDLDhCQUE4Qjs7QUFFMUU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7O0FBRU8seURBQXlELE9BQU87QUFDaEU7QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQyw0Q0FBNEM7QUFDN0U7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcmpCa0M7QUFDVztBQUNUOztBQUlMOztBQUtOOztBQUVsQixtQ0FBbUMsNkRBQWlCO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFrQjtBQUN4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRU8sdUNBQXVDLDZEQUFpQjtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGlDQUFpQyxNQUFNO0FBQ3ZDLGtCQUFrQixnREFBZTs7QUFFakM7QUFDQSxhQUFhLGdFQUErQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRCwwQkFBMEI7QUFDaEY7O0FBRUE7QUFDQTtBQUNBLGlGQUFpRixvREFBa0I7QUFDbkc7QUFDQSw4R0FBOEcsS0FBSztBQUNuSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUCwwQkFBMEIsMENBQWE7QUFDdkM7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSxZQUFZLFFBQVEsbURBQU8sbUJBQW1CLCtDQUErQztBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix5RUFBeUUsS0FBSztBQUM5RTtBQUNBLE1BQU07QUFDTixzRkFBc0YsSUFBSTtBQUMxRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLHlEQUF1QjtBQUNuQztBQUNBLFVBQVU7QUFDVix5QkFBeUIsZ0VBQStCO0FBQ3hEO0FBQ0EsbUJBQW1CLGlFQUFlO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4TDZDOztBQUU3QztBQUNBOztBQUVPLDhCQUE4Qiw2REFBMkI7QUFDaEU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFFBQVEsbURBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE1BQU0sd0VBQXNDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFdBQVc7QUFDNUM7QUFDQTtBQUNBLFdBQVc7QUFDWCwyQkFBMkIsb0JBQW9CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsTUFBTTtBQUNOLDRFQUE0RSxJQUFJO0FBQ2hGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWlEOztBQUVqRDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDcEZBOztBQUVvRDs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU8sOEJBQThCLDZEQUFpQjtBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsVUFBVTtBQUMvQjtBQUNBO0FBQ0Esb0NBQW9DLFlBQVk7QUFDaEQsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxLQUFLO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGlEQUFpRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BWekI7O0FBRXFCO0FBQ0w7QUFDRzs7QUFJcEI7O0FBRXZCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQSxtQ0FBbUMsc0RBQVcsTUFBTSw0REFBaUI7QUFDckUsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQywwREFBMEQ7O0FBRTdGO0FBQ0E7QUFDQSxVQUFVLHlEQUF1QjtBQUNqQzs7QUFFQTtBQUNBLG1GQUFtRjs7QUFFbkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVUsa0RBQWdCO0FBQzFCOztBQUVBO0FBQ0EsTUFBTSxTQUFTLGtEQUFnQjtBQUMvQjs7QUFFQSxVQUFVLGtEQUFnQjtBQUMxQjs7QUFFQTtBQUNBLE1BQU0sU0FBUyxrREFBZ0I7QUFDL0I7O0FBRUEsK0NBQStDLDBEQUF5QjtBQUN4RTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTyxzREFBVztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsNERBQWlCO0FBQ3ZDLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrRkFBK0Ysa0RBQWdCLE9BQU8sMkRBQWlCO0FBQ3ZJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVLGtEQUFnQjtBQUMxQjs7QUFFQSxlQUFlLGdFQUFxQjtBQUNwQzs7QUFFQSxVQUFVLGtEQUFnQjtBQUMxQixlQUFlLDhDQUFhO0FBQzVCLGdCQUFnQixrREFBZ0IsT0FBTywyREFBaUI7QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGVBQWUsa0RBQWlCO0FBQ2hDLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJFQUEyRSx5REFBdUIseUNBQXlDOztBQUUzSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtFQUFrRSxrREFBZ0I7QUFDbEY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtFQUFrRSxrREFBZ0I7QUFDbEY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsa0RBQWdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLGtEQUFnQjtBQUN4Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxrREFBZ0I7QUFDeEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0MsOEJBQThCO0FBQ3RFOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsaURBQWlEOzs7Ozs7Ozs7Ozs7Ozs7QUN2Y2pEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTztBQUNoQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsbUJBQW1CO0FBQzdDO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0EscUJBQXFCOztBQUVyQixjQUFjLDJCQUEyQjtBQUN6QztBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGNBQWMsMEJBQTBCO0FBQ3hDLHFDQUFxQztBQUNyQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RTs7QUFFekUsaURBQWlEO0FBQ2pEO0FBQ0E7O0FBRUEsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTs7QUFFQSxjQUFjLE9BQU87QUFDckIsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hJd0I7O0FBRXFCOztBQUVXOztBQUV4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5Q0FBeUMsd0NBQXdDO0FBQ2pGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsU0FBUyx5REFBdUI7QUFDaEMsb0VBQW9FLDBEQUEwRDs7QUFFOUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSCxXQUFXLEVBQUUsMkJBQTJCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUhBQXFIO0FBQ3JILHVJQUF1STtBQUN2STtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDLCtEQUFvQjs7QUFFNUQ7QUFDQSw2QkFBNkIsK0RBQW9COztBQUVqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEtBQTRLO0FBQzVLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWSxrREFBZ0Isa0JBQWtCLGlFQUFlO0FBQzdELDBCQUEwQixpRUFBZTtBQUN6QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwySEFBMkg7QUFDM0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrSUFBa0k7QUFDbEk7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxjQUFjLGlCQUFpQixnQkFBZ0I7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0xBQXNMO0FBQ3RMO0FBQ0EsdUpBQXVKO0FBQ3ZKO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHNHQUFzRztBQUM1SDtBQUNPLCtCQUErQixxQkFBcUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsK0ZBQStGLHVEQUF1RDtBQUN0SixNQUFNO0FBQ047QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBLFVBQVU7QUFDVix3QkFBd0IsdUNBQXVDO0FBQy9EO0FBQ0EsT0FBTyxJQUFJO0FBQ1g7QUFDQTs7QUFFQSxvREFBb0Qsc0RBQXNEOztBQUUxRyx3QkFBd0IsRUFBRSxjQUFjLFFBQVEsT0FBTyxTQUFTLHFFQUFxRSxnQkFBZ0IsbUNBQW1DLGNBQWMscUNBQXFDLGNBQWM7O0FBRXpQO0FBQ0E7QUFDQTs7QUFFQSx1RUFBdUU7QUFDdkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxxREFBcUQ7QUFDaEUsV0FBVyw4RUFBOEU7QUFDekYsV0FBVyxvREFBb0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsZ0NBQWdDO0FBQ25HLGlHQUFpRztBQUNqRyxrSEFBa0g7QUFDbEg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMscUJBQXFCLHlGQUF5RjtBQUMvSTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsNkRBQTZEO0FBQzlFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxzQ0FBc0MsOEJBQThCO0FBQ3BFLGlCQUFpQixvRUFBb0U7QUFDckYsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0ZBQWtGO0FBQ2xGO0FBQ0EsNkZBQTZGO0FBQzdGLHNDQUFzQyx5REFBeUQ7QUFDL0Y7QUFDQTtBQUNBO0FBQ0Esd0dBQXdHO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsc0RBQVcsTUFBTSxrRUFBdUIsU0FBUyxzREFBVyxNQUFNLDREQUFpQjtBQUNsRzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLGtDQUFrQyxzREFBVyxNQUFNLGtFQUF1QixTQUFTLHNEQUFXLE1BQU0sNERBQWlCO0FBQ3JIOztBQUVBLDRCQUE0QixrREFBZ0I7QUFDNUM7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEM7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdELHFFQUFxRTtBQUNyRTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsYUFBYTtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsSUFBSSxlQUFlO0FBQzdCO0FBQ0EsTUFBTTs7QUFFTjtBQUNBLCtEQUErRCxrREFBZ0IsU0FBUyxpRUFBZTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSSxlQUFlO0FBQzFCOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQLE9BQU8sa0RBQWdCO0FBQ3ZCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBLE1BQU0seURBQXVCO0FBQzdCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQSxNQUFNLGtEQUFnQjtBQUN0QixxQ0FBcUMsK0RBQStELEdBQUc7O0FBRXZHOztBQUVBLFdBQVc7QUFDWDs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUCxPQUFPLHlEQUF1QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsaUVBQWU7QUFDbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRU87QUFDUCw0QkFBNEIsaUVBQWU7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlFQUFlO0FBQ3pDO0FBQ0EsMEJBQTBCLGlFQUFlO0FBQ3pDLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGlFQUFlOztBQUUxQjtBQUNBOztBQUVBLGFBQWEsaUVBQWU7QUFDNUI7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQSxJQUFJLHdFQUE2QjtBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsa0RBQWdCLGVBQWUsaUVBQWU7QUFDdEQsNENBQTRDLGlFQUFlO0FBQzNEO0FBQ0E7O0FBRUEsUUFBUSxrREFBZ0IsUUFBUSxpRUFBZTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUVBQWU7QUFDakMsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPOztBQUVQO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGlFQUFlO0FBQ2hDLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTzs7QUFFUCxXQUFXLGlFQUFlOztBQUUxQjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIseURBQXVCO0FBQzlDO0FBQ0EsSUFBSSx3RUFBNkI7QUFDakMsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxJQUFJLDRCQUE0QixrREFBZ0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdURBQXFCO0FBQ3RDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix1REFBcUI7QUFDOUMsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsdURBQXFCO0FBQ3pDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsdURBQXFCO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQix1REFBcUI7QUFDekM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBOztBQUVBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVUsUUFBUTtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFTzs7Ozs7OztTQ3ZuQ1A7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLGdEQUFnRDtBQUNoRCx3RUFBd0U7O0FBRXhFO0FBQ0E7O0FBRW9DO0FBQ1U7QUFDSjs7QUFFRztBQUNUOztBQUVvQjtBQUN0QjtBQUNZO0FBQ0o7QUFDSDtBQUNVO0FBQ1Y7O0FBRXZDLDBCQUEwQiw2REFBNEI7O0FBS3BEOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FBRUQsNEJBQTRCLHNDQUFLO0FBQ2pDLGlDQUFpQywyQ0FBVTtBQUMzQywrQkFBK0IseUNBQVE7QUFDdkMsOENBQThDLGtEQUFpQjtBQUMvRCxxREFBcUQseURBQXdCOztBQUU3RTtBQUNBLFNBQVMsb0RBQW1CO0FBQzVCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4REFBNkIsSUFBSSxpQ0FBaUM7QUFDeEU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxrRUFBaUM7QUFDekM7QUFDQSxTQUFTO0FBQ1QsT0FBTyxJQUFJLFVBQVU7O0FBRXJCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQSwyQ0FBMkMsdUVBQXNDO0FBQ2pGLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdCQUF3QixpREFBZ0I7QUFDeEMsb0NBQW9DLHNEQUFxQixrQkFBa0IsT0FBTyxrREFBaUIsOEJBQThCOztBQUVqSTtBQUNBO0FBQ0EscUJBQXFCLDZEQUE0QjtBQUNqRDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxnREFBZ0QsUUFBUTtBQUN4RDs7QUFFQSxtQkFBbUIsNkRBQTRCO0FBQy9DOztBQUVBO0FBQ0EsWUFBWSx5REFBd0I7O0FBRXBDLHFCQUFxQiw2REFBNEI7QUFDakQ7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRCxRQUFRO0FBQzFEO0FBQ0EsbUJBQW1CLDZEQUE0QjtBQUMvQzs7QUFFQSxxQkFBcUIsNkRBQTRCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxFQUFFLHlEQUF3QjtBQUMxQixFQUFFLHlEQUF3Qjs7QUFFMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbm9kZV9tb2R1bGVzL2RlZXBtZXJnZS9kaXN0L2Nqcy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9iYXNlLXV0aWxzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvY29uc3RhbnRzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2R5bmFtaWMtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1yZXF1aXJlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1zcGlubmVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3F1ZXJ5LWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBpc01lcmdlYWJsZU9iamVjdCA9IGZ1bmN0aW9uIGlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpXG5cdFx0JiYgIWlzU3BlY2lhbCh2YWx1ZSlcbn07XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuXHR2YXIgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXG5cdHJldHVybiBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblx0XHR8fCBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgRGF0ZV0nXG5cdFx0fHwgaXNSZWFjdEVsZW1lbnQodmFsdWUpXG59XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9iNWFjOTYzZmI3OTFkMTI5OGU3ZjM5NjIzNjM4M2JjOTU1ZjkxNmMxL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxLUwyNVxudmFyIGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBjYW5Vc2VTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG5cbmZ1bmN0aW9uIGVtcHR5VGFyZ2V0KHZhbCkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gKG9wdGlvbnMuY2xvbmUgIT09IGZhbHNlICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodmFsdWUpKVxuXHRcdD8gZGVlcG1lcmdlKGVtcHR5VGFyZ2V0KHZhbHVlKSwgdmFsdWUsIG9wdGlvbnMpXG5cdFx0OiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gdGFyZ2V0LmNvbmNhdChzb3VyY2UpLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKGVsZW1lbnQsIG9wdGlvbnMpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG5cdGlmICghb3B0aW9ucy5jdXN0b21NZXJnZSkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2Vcblx0fVxuXHR2YXIgY3VzdG9tTWVyZ2UgPSBvcHRpb25zLmN1c3RvbU1lcmdlKGtleSk7XG5cdHJldHVybiB0eXBlb2YgY3VzdG9tTWVyZ2UgPT09ICdmdW5jdGlvbicgPyBjdXN0b21NZXJnZSA6IGRlZXBtZXJnZVxufVxuXG5mdW5jdGlvbiBnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc1xuXHRcdD8gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpLmZpbHRlcihmdW5jdGlvbihzeW1ib2wpIHtcblx0XHRcdHJldHVybiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIHN5bWJvbClcblx0XHR9KVxuXHRcdDogW11cbn1cblxuZnVuY3Rpb24gZ2V0S2V5cyh0YXJnZXQpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKHRhcmdldCkuY29uY2F0KGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSlcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlJc09uT2JqZWN0KG9iamVjdCwgcHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gcHJvcGVydHkgaW4gb2JqZWN0XG5cdH0gY2F0Y2goXykge1xuXHRcdHJldHVybiBmYWxzZVxuXHR9XG59XG5cbi8vIFByb3RlY3RzIGZyb20gcHJvdG90eXBlIHBvaXNvbmluZyBhbmQgdW5leHBlY3RlZCBtZXJnaW5nIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG5mdW5jdGlvbiBwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSB7XG5cdHJldHVybiBwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpIC8vIFByb3BlcnRpZXMgYXJlIHNhZmUgdG8gbWVyZ2UgaWYgdGhleSBkb24ndCBleGlzdCBpbiB0aGUgdGFyZ2V0IHlldCxcblx0XHQmJiAhKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSAvLyB1bnNhZmUgaWYgdGhleSBleGlzdCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLFxuXHRcdFx0JiYgT2JqZWN0LnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGFyZ2V0LCBrZXkpKSAvLyBhbmQgYWxzbyB1bnNhZmUgaWYgdGhleSdyZSBub25lbnVtZXJhYmxlLlxufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHR2YXIgZGVzdGluYXRpb24gPSB7fTtcblx0aWYgKG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkge1xuXHRcdGdldEtleXModGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHRhcmdldFtrZXldLCBvcHRpb25zKTtcblx0XHR9KTtcblx0fVxuXHRnZXRLZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAocHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3Qoc291cmNlW2tleV0pKSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGRlc3RpbmF0aW9uXG59XG5cbmZ1bmN0aW9uIGRlZXBtZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlO1xuXHRvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0ID0gb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCB8fCBpc01lcmdlYWJsZU9iamVjdDtcblx0Ly8gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgaXMgYWRkZWQgdG8gYG9wdGlvbnNgIHNvIHRoYXQgY3VzdG9tIGFycmF5TWVyZ2UoKVxuXHQvLyBpbXBsZW1lbnRhdGlvbnMgY2FuIHVzZSBpdC4gVGhlIGNhbGxlciBtYXkgbm90IHJlcGxhY2UgaXQuXG5cdG9wdGlvbnMuY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZDtcblxuXHR2YXIgc291cmNlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoc291cmNlKTtcblx0dmFyIHRhcmdldElzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRhcmdldCk7XG5cdHZhciBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheTtcblxuXHRpZiAoIXNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2gpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2UgaWYgKHNvdXJjZUlzQXJyYXkpIHtcblx0XHRyZXR1cm4gb3B0aW9ucy5hcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fVxufVxuXG5kZWVwbWVyZ2UuYWxsID0gZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5LCBvcHRpb25zKSB7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSBhbiBhcnJheScpXG5cdH1cblxuXHRyZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG5leHQpIHtcblx0XHRyZXR1cm4gZGVlcG1lcmdlKHByZXYsIG5leHQsIG9wdGlvbnMpXG5cdH0sIHt9KVxufTtcblxudmFyIGRlZXBtZXJnZV8xID0gZGVlcG1lcmdlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZXBtZXJnZV8xO1xuIiwiaW1wb3J0IHsgU0hBMjU2IH0gZnJvbSAnLi9zaGEyNTYuanMnO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pO1xuXG5leHBvcnQge1xuICBTSEEyNTYsXG59O1xuXG4vKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQmFzZVV0aWxzXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIHV0aWxpdHkgZnVuY3Rpb25zIGFuZCBnbG9iYWwgY29uc3RhbnRzIGFyZSBmb3VuZCB3aXRoaW4gdGhpcyBuYW1lc3BhY2UuXG4gKi9cblxuZnVuY3Rpb24gcGFkKHN0ciwgY291bnQsIGNoYXIgPSAnMCcpIHtcbiAgcmV0dXJuIHN0ci5wYWRTdGFydChjb3VudCwgY2hhcik7XG59XG5cbmNvbnN0IElEX0NPVU5UX0xFTkdUSCAgICAgICAgID0gMTk7XG5jb25zdCBJU19DTEFTUyAgICAgICAgICAgICAgICA9ICgvXmNsYXNzIFxcUysgXFx7Lyk7XG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUyA9IFtcbiAgJ0FnZ3JlZ2F0ZUVycm9yJyxcbiAgJ0FycmF5JyxcbiAgJ0FycmF5QnVmZmVyJyxcbiAgJ0JpZ0ludCcsXG4gICdCaWdJbnQ2NEFycmF5JyxcbiAgJ0JpZ1VpbnQ2NEFycmF5JyxcbiAgJ0Jvb2xlYW4nLFxuICAnRGF0YVZpZXcnLFxuICAnRGF0ZScsXG4gICdEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZScsXG4gICdFcnJvcicsXG4gICdFdmFsRXJyb3InLFxuICAnRmluYWxpemF0aW9uUmVnaXN0cnknLFxuICAnRmxvYXQzMkFycmF5JyxcbiAgJ0Zsb2F0NjRBcnJheScsXG4gICdGdW5jdGlvbicsXG4gICdJbnQxNkFycmF5JyxcbiAgJ0ludDMyQXJyYXknLFxuICAnSW50OEFycmF5JyxcbiAgJ01hcCcsXG4gICdOdW1iZXInLFxuICAnT2JqZWN0JyxcbiAgJ1Byb3h5JyxcbiAgJ1JhbmdlRXJyb3InLFxuICAnUmVmZXJlbmNlRXJyb3InLFxuICAnUmVnRXhwJyxcbiAgJ1NldCcsXG4gICdTaGFyZWRBcnJheUJ1ZmZlcicsXG4gICdTdHJpbmcnLFxuICAnU3ltYm9sJyxcbiAgJ1N5bnRheEVycm9yJyxcbiAgJ1R5cGVFcnJvcicsXG4gICdVaW50MTZBcnJheScsXG4gICdVaW50MzJBcnJheScsXG4gICdVaW50OEFycmF5JyxcbiAgJ1VpbnQ4Q2xhbXBlZEFycmF5JyxcbiAgJ1VSSUVycm9yJyxcbiAgJ1dlYWtNYXAnLFxuICAnV2Vha1JlZicsXG4gICdXZWFrU2V0Jyxcbl07XG5cbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFU19NRVRBID0gTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMubWFwKCh0eXBlTmFtZSkgPT4ge1xuICByZXR1cm4gWyB0eXBlTmFtZSwgZ2xvYmFsVGhpc1t0eXBlTmFtZV0gXTtcbn0pLmZpbHRlcigobWV0YSkgPT4gbWV0YVsxXSk7XG5cbmNvbnN0IElEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRSAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2lkLWNvdW50ZXItY3VycmVudC12YWx1ZScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xubGV0IGlkQ291bnRlciA9IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZ2xvYmFsVGhpcy5teXRoaXhVSSwgSURfQ09VTlRFUl9DVVJSRU5UX1ZBTFVFKSkgPyBnbG9iYWxUaGlzLm15dGhpeFVJW0lEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRV0gOiAwbjtcblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBHZW5lcmF0ZSBhIHBhcnRpYWxseSByYW5kb20gdW5pcXVlIElELiBUaGUgaWQgZ2VuZXJhdGVkIHdpbGwgYmUgYSBgRGF0ZS5ub3coKWBcbiAqICAgdmFsdWUgd2l0aCBhbiBpbmNyZW1lbnRpbmcgQmlnSW50IHBvc3RmaXhlZCB0byBpdC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRC5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coJ0lEOiAnLCBCYXNlVXRpbHMuZ2VuZXJhdGVJRCgpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ0lEMTcwNDE0MzAyNzE3OTAwMDAwMDAwMDAwMDAwMDAwMDcnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlEKCkge1xuICBpZENvdW50ZXIgKz0gQmlnSW50KDEpO1xuICBnbG9iYWxUaGlzLm15dGhpeFVJW0lEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRV0gPSBpZENvdW50ZXI7XG5cbiAgcmV0dXJuIGBJRCR7RGF0ZS5ub3coKX0ke3BhZChpZENvdW50ZXIudG9TdHJpbmcoKSwgSURfQ09VTlRfTEVOR1RIKX1gO1xufVxuXG5jb25zdCBPQkpFQ1RfSURfU1RPUkFHRSA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvb2JqZWN0LWlkLXN0b3JhZ2UnKTtcbmNvbnN0IE9CSkVDVF9JRF9XRUFLTUFQID0gZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0gPSAoZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0pID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0gOiBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdldCBhIHVuaXF1ZSBJRCBmb3IgYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgcmVmZXJlbmNlLlxuICpcbiAqICAgVW5pcXVlIElEcyBhcmUgZ2VuZXJhdGVkIHZpYSBAc2VlIEJhc2VVdGlscy5nZW5lcmF0ZUlEOy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBBbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSByZWZlcmVuY2UuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgQSB1bmlxdWUgSUQgZm9yIHRoaXMgcmVmZXJlbmNlIChhcyBhIFNIQTI1NiBoYXNoKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLmdldE9iamVjdElEKGRpdkVsZW1lbnQpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJzE3MDQxNDMwMjcxNzkwMDAwMDAwMDAwMDAwMDAwMDA3J1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqZWN0SUQodmFsdWUpIHtcbiAgbGV0IGlkID0gT0JKRUNUX0lEX1dFQUtNQVAuZ2V0KHZhbHVlKTtcbiAgaWYgKGlkID09IG51bGwpIHtcbiAgICBsZXQgdGhpc0lEID0gZ2VuZXJhdGVJRCgpO1xuXG4gICAgT0JKRUNUX0lEX1dFQUtNQVAuc2V0KHZhbHVlLCB0aGlzSUQpO1xuXG4gICAgcmV0dXJuIHRoaXNJRDtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBDcmVhdGUgYW4gdW5yZXNvbHZlZCBzcGVjaWFsaXplZCBQcm9taXNlIGluc3RhbmNlLCB3aXRoIHRoZSBpbnRlbnQgdGhhdCBpdCB3aWxsIGJlXG4gKiAgIHJlc29sdmVkIGxhdGVyLlxuICpcbiAqICAgVGhlIFByb21pc2UgaW5zdGFuY2UgaXMgc3BlY2lhbGl6ZWQgYmVjYXVzZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgYXJlIGluamVjdGVkIGludG8gaXQ6XG4gKiAgIDEuIGByZXNvbHZlKHJlc3VsdFZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVzb2x2ZXMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAqICAgMi4gYHJlamVjdChlcnJvclZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVqZWN0cyB0aGUgcHJvbWlzZSB3aXRoIHRoZSBmaXJzdCBwcm92aWRlZCBhcmd1bWVudFxuICogICAzLiBgc3RhdHVzKClgIC0gV2hlbiBjYWxsZWQsIHdpbGwgcmV0dXJuIHRoZSBmdWxmaWxsbWVudCBzdGF0dXMgb2YgdGhlIHByb21pc2UsIGFzIGEgYHN0cmluZ2AsIG9uZSBvZjogYFwicGVuZGluZ1wiLCBcImZ1bGZpbGxlZFwiYCwgb3IgYFwicmVqZWN0ZWRcImBcbiAqICAgNC4gYGlkPHN0cmluZz5gIC0gQSByYW5kb21seSBnZW5lcmF0ZWQgSUQgZm9yIHRoaXMgcHJvbWlzZVxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBQcm9taXNlOyBBbiB1bnJlc29sdmVkIFByb21pc2UgdGhhdCBjYW4gYmUgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgYnkgY2FsbGluZyBgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdClgIG9yIGBwcm9taXNlLnJlamVjdChlcnJvcilgIHJlc3BlY3RpdmVseS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc29sdmFibGUoKSB7XG4gIGxldCBzdGF0dXMgPSAncGVuZGluZyc7XG4gIGxldCByZXNvbHZlO1xuICBsZXQgcmVqZWN0O1xuXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdmdWxmaWxsZWQnO1xuICAgICAgICBfcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICByZWplY3QgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAncmVqZWN0ZWQnO1xuICAgICAgICBfcmVqZWN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvbWlzZSwge1xuICAgICdyZXNvbHZlJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZXNvbHZlLFxuICAgIH0sXG4gICAgJ3JlamVjdCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVqZWN0LFxuICAgIH0sXG4gICAgJ3N0YXR1cyc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKCkgPT4gc3RhdHVzLFxuICAgIH0sXG4gICAgJ2lkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICBnZW5lcmF0ZUlEKCksXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgUnVudGltZSB0eXBlIHJlZmxlY3Rpb24gaGVscGVyLiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbW9yZSByb2J1c3QgcmVwbGFjZW1lbnQgZm9yIHRoZSBgdHlwZW9mYCBvcGVyYXRvci5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIGFsd2F5cyByZXR1cm5zIGEgbmFtZSAoYXMgYSBgc3RyaW5nYCB0eXBlKSBvZiB0aGUgdW5kZXJseWluZyBkYXRhdHlwZS5cbiAqICAgVGhlIFwiZGF0YXR5cGVcIiBpcyBhIGxpdHRsZSBsb29zZSBmb3IgcHJpbWl0aXZlIHR5cGVzLiBGb3IgZXhhbXBsZSwgYVxuICogICBwcmltaXRpdmUgYHR5cGVvZiB4ID09PSAnbnVtYmVyJ2AgdHlwZSBpcyByZXR1cm5lZCBhcyBpdHMgY29ycmVzcG9uZGluZyBPYmplY3QgKGNsYXNzKSB0eXBlIGAnTnVtYmVyJ2AuIEZvciBgYm9vbGVhbmAgaXQgd2lsbCBpbnN0ZWFkXG4gKiAgIHJldHVybiBgJ0Jvb2xlYW4nYCwgYW5kIGZvciBgJ3N0cmluZydgLCBpdCB3aWxsIGluc3RlYWQgcmV0dXJuIGAnU3RyaW5nJ2AuIFRoaXMgaXMgdHJ1ZSBvZiBhbGwgdW5kZXJseWluZyBwcmltaXRpdmUgdHlwZXMuXG4gKlxuICogICBGb3IgaW50ZXJuYWwgZGF0YXR5cGVzLCBpdCB3aWxsIHJldHVybiB0aGUgcmVhbCBjbGFzcyBuYW1lIHByZWZpeGVkIGJ5IHR3byBjb2xvbnMuXG4gKiAgIEZvciBleGFtcGxlLCBgdHlwZU9mKG5ldyBNYXAoKSlgIHdpbGwgcmV0dXJuIGAnOjpNYXAnYC5cbiAqXG4gKiAgIE5vbi1pbnRlcm5hbCB0eXBlcyB3aWxsIG5vdCBiZSBwcmVmaXhlZCwgYWxsb3dpbmcgY3VzdG9tIHR5cGVzIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBpbnRlcm5hbCB0eXBlcyB0byBhbHNvIGJlIGRldGVjdGVkLlxuICogICBGb3IgZXhhbXBsZSwgYGNsYXNzIFRlc3Qge307IHR5cGVPZihuZXcgVGVzdCgpKWAgd2lsbCByZXN1bHQgaW4gdGhlIG5vbi1wcmVmaXhlZCByZXN1bHQgYCdUZXN0J2AuXG4gKlxuICogICBGb3IgcmF3IGBmdW5jdGlvbmAgdHlwZXMsIGB0eXBlT2ZgIHdpbGwgY2hlY2sgaWYgdGhleSBhcmUgYSBjb25zdHJ1Y3RvciBvciBub3QuIElmIGEgY29uc3RydWN0b3IgaXMgZGV0ZWN0ZWQsIHRoZW5cbiAqICAgdGhlIGZvcm1hdCBgJ1tDbGFzcyAke25hbWV9XSdgIHdpbGwgYmUgcmV0dXJuZWQgYXMgdGhlIHR5cGUuIEZvciBpbnRlcm5hbCB0eXBlcyB0aGUgbmFtZSB3aWxsXG4gKiAgIGJlIHByZWZpeGVkLCBpLmUuIGBbQ2xhc3MgOjoke2ludGVybmFsTmFtZX1dYCwgYW5kIGZvciBub24taW50ZXJuYWwgdHlwZXMgd2lsbCBpbnN0ZWFkIGJlIG5vbi1wcmVmaXhlZCwgaS5lLiBgW0NsYXNzICR7bmFtZX1dYCAuXG4gKiAgIEZvciBleGFtcGxlLCBgdHlwZU9mKE1hcClgIHdpbGwgcmV0dXJuIGAnW0NsYXNzIDo6TWFwXSdgLCB3aGVyZWFzIGB0eXBlT2YoVGVzdClgIHdpbGwgcmVzdWx0IGluIGAnW0NsYXNzIFRlc3RdJ2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVGhlIHZhbHVlIHdob3NlIHR5cGUgeW91IHdpc2ggdG8gZGlzY292ZXIuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVkIHR5cGUsIG9yIGFuIGVtcHR5IHN0cmluZyBgJydgIGlmIHRoZSBwcm92aWRlZCB2YWx1ZSBoYXMgbm8gdHlwZS5cbiAqIG5vdGVzOlxuICogICAtIFRoaXMgbWV0aG9kIHdpbGwgbG9vayBmb3IgYSBbU3ltYm9sLnRvU3RyaW5nVGFnXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TeW1ib2wvdG9TdHJpbmdUYWcpXG4gKiAgICAga2V5IG9uIHRoZSB2YWx1ZSBwcm92aWRlZC4uLiBhbmQgaWYgZm91bmQsIHdpbGwgdXNlIGl0IHRvIGFzc2lzdCB3aXRoIGZpbmRpbmcgdGhlIGNvcnJlY3QgdHlwZSBuYW1lLlxuICogICAtIElmIHRoZSBgdmFsdWVgIHByb3ZpZGVkIGlzIHR5cGUtbGVzcywgaS5lLiBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgTmFOYCwgdGhlbiBhbiBlbXB0eSB0eXBlIGAnJ2Agd2lsbCBiZSByZXR1cm5lZC5cbiAqICAgLSBVc2UgdGhlIGB0eXBlb2ZgIG9wZXJhdG9yIGlmIHlvdSB3YW50IHRvIGRldGVjdCBpZiBhIHR5cGUgaXMgcHJpbWl0aXZlIG9yIG5vdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuICcnO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuICc6Ok51bWJlcic7XG5cbiAgbGV0IHRoaXNUeXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodGhpc1R5cGUgPT09ICdiaWdpbnQnKVxuICAgIHJldHVybiAnOjpCaWdJbnQnO1xuXG4gIGlmICh0aGlzVHlwZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuICc6OlN5bWJvbCc7XG5cbiAgaWYgKHRoaXNUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0aGlzVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh2YWx1ZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgOjoke25hdGl2ZVR5cGVNZXRhWzBdfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgSVNfQ0xBU1MudGVzdCgnJyArIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvcikpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7dmFsdWUubmFtZX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG4gICAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtyZXN1bHR9XWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGA6OiR7dGhpc1R5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt0aGlzVHlwZS5zdWJzdHJpbmcoMSl9YDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICByZXR1cm4gJzo6QXJyYXknO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICByZXR1cm4gJzo6U3RyaW5nJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOdW1iZXIpXG4gICAgcmV0dXJuICc6Ok51bWJlcic7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbilcbiAgICByZXR1cm4gJzo6Qm9vbGVhbic7XG5cbiAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICh0eXBlTWV0YVswXSAhPT0gJ09iamVjdCcgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlTWV0YVsxXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICByZXR1cm4gYDo6JHtuYXRpdmVUeXBlTWV0YVswXX1gO1xuXG4gIGlmICh0eXBlb2YgTWF0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IE1hdGgpXG4gICAgcmV0dXJuICc6Ok1hdGgnO1xuXG4gIGlmICh0eXBlb2YgSlNPTiAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IEpTT04pXG4gICAgcmV0dXJuICc6OkpTT04nO1xuXG4gIGlmICh0eXBlb2YgQXRvbWljcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IEF0b21pY3MpXG4gICAgcmV0dXJuICc6OkF0b21pY3MnO1xuXG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IFJlZmxlY3QpXG4gICAgcmV0dXJuICc6OlJlZmxlY3QnO1xuXG4gIGlmICh2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKVxuICAgIHJldHVybiAodHlwZW9mIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpID8gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIDogdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgcmV0dXJuICc6Ok9iamVjdCc7XG5cbiAgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ09iamVjdCc7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgUnVudGltZSB0eXBlIHJlZmxlY3Rpb24gaGVscGVyLiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbW9yZSByb2J1c3QgcmVwbGFjZW1lbnQgZm9yIHRoZSBgaW5zdGFuY2VvZmAgb3BlcmF0b3IuXG4gKlxuICogICBUaGlzIG1ldGhvZCB3aWxsIHJldHVybiBgdHJ1ZWAgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgKmFueSogb2YgdGhlIHByb3ZpZGVkIGB0eXBlc2AuXG4gKlxuICogICBUaGUgcHJvdmlkZWQgYHR5cGVzYCBjYW4gZWFjaCBlaXRoZXIgYmUgYSByZWFsIHJhdyB0eXBlIChpLmUuIGBTdHJpbmdgIGNsYXNzKSwgb3IgdGhlIG5hbWUgb2YgYSB0eXBlLCBhcyBhIHN0cmluZyxcbiAqICAgaS5lLiBgJzo6U3RyaW5nJ2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVGhlIHZhbHVlIHdob3NlIHR5cGUgeW91IHdpc2ggdG8gY29tcGFyZS5cbiAqICAgLSBuYW1lOiAuLi50eXBlc1xuICogICAgIGRhdGFUeXBlOiBBcnJheTxhbnk+XG4gKiAgICAgZGVzYzogQWxsIHR5cGVzIHlvdSB3aXNoIHRvIGNoZWNrIGFnYWluc3QuIFN0cmluZyB2YWx1ZXMgY29tcGFyZSB0eXBlcyBieSBuYW1lLCBmdW5jdGlvbiB2YWx1ZXMgY29tcGFyZSB0eXBlcyBieSBgaW5zdGFuY2VvZmAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBtYXRjaGVzIGFueSBvZiB0aGUgcHJvdmlkZWQgYHR5cGVzYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGUodmFsdWUsIC4uLnR5cGVzKSB7XG4gIGNvbnN0IGdldEludGVybmFsVHlwZU5hbWUgPSAodHlwZSkgPT4ge1xuICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodHlwZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICByZXR1cm4gYDo6JHtuYXRpdmVUeXBlTWV0YVswXX1gO1xuICB9O1xuXG4gIGxldCB2YWx1ZVR5cGUgPSB0eXBlT2YodmFsdWUpO1xuICBmb3IgKGxldCB0eXBlIG9mIHR5cGVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlT2YodHlwZSwgJzo6U3RyaW5nJykgJiYgdmFsdWVUeXBlID09PSB0eXBlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiB0eXBlKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIGxldCBpbnRlcm5hbFR5cGUgPSBnZXRJbnRlcm5hbFR5cGVOYW1lKHR5cGUpO1xuICAgICAgICBpZiAoaW50ZXJuYWxUeXBlICYmIGludGVybmFsVHlwZSA9PT0gdmFsdWVUeXBlKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBWZXJpZnkgdGhhdCB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBhIGBudW1iZXJgIHR5cGUgKG9yIGBOdW1iZXJgIGluc3RhbmNlKSwgYW5kIHRoYXRcbiAqICAgaXQgKippcyBub3QqKiBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYG51bWJlcmAgKG9yIGBOdW1iZXJgIGluc3RhbmNlKSBhbmQgaXMgYWxzbyAqKm5vdCoqIGBOYU5gLCBgSW5maW5pdHlgLCBvciBgLUluZmluaXR5YC4gaS5lLiBgKGlzTnVtYmVyKHZhbHVlKSAmJiBpc0Zpbml0ZSh2YWx1ZSkpYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiAoaXNUeXBlKHZhbHVlLCAnOjpOdW1iZXInKSAmJiBpc0Zpbml0ZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFZlcmlmeSB0aGF0IHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGEgXCJwbGFpblwiL1widmFuaWxsYVwiIE9iamVjdCBpbnN0YW5jZS5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIGlzIGludGVuZGVkIHRvIGhlbHAgdGhlIGNhbGxlciBkZXRlY3QgaWYgYW4gb2JqZWN0IGlzIGEgXCJyYXcgcGxhaW4gb2JqZWN0XCIsXG4gKiAgIGluaGVyaXRpbmcgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAgKG9yIGEgYG51bGxgIHByb3RvdHlwZSkuXG4gKlxuICogICAxLiBgaXNQbGFpbk9iamVjdCh7fSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgMi4gYGlzUGxhaW5PYmplY3QobmV3IE9iamVjdCgpKWAgd2lsbCByZXR1cm4gYHRydWVgLlxuICogICAzLiBgaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKWAgd2lsbCByZXR1cm4gYHRydWVgLlxuICogICA0LiBgaXNQbGFpbk9iamVjdChuZXcgQ3VzdG9tQ2xhc3MoKSlgIHdpbGwgcmV0dXJuIGBmYWxzZWAuXG4gKiAgIDUuIEFsbCBvdGhlciBpbnZvY2F0aW9ucyBzaG91bGQgcmV0dXJuIGBmYWxzZWAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgXCJyYXdcIi9cInBsYWluXCIgT2JqZWN0IGluc3RhbmNlLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERldGVjdCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBhIGphdmFzY3JpcHQgcHJpbWl0aXZlIHR5cGUuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdHlwZW9mIHZhbHVlYCBpcyBvbmUgb2Y6IGBzdHJpbmdgLCBgbnVtYmVyYCwgYGJvb2xlYW5gLCBgYmlnaW50YCwgb3IgYHN5bWJvbGAsXG4gKiAgICAgICphbmQgYWxzbyogYHZhbHVlYCBpcyAqbm90KiBgTmFOYCwgYEluZmluaXR5YCwgYC1JbmZpbml0eWAsIGB1bmRlZmluZWRgLCBvciBgbnVsbGAuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICc6OlN0cmluZycsICc6Ok51bWJlcicsICc6OkJvb2xlYW4nLCAnOjpCaWdJbnQnKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgZ2FyYmFnZSBjb2xsZWN0YWJsZS5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gY2hlY2sgaWYgYW55IGB2YWx1ZWAgaXMgYWxsb3dlZCB0byBiZSB1c2VkIGFzIGEgd2VhayByZWZlcmVuY2UuXG4gKlxuICogICBFc3NlbnRpYWxseSwgdGhpcyB3aWxsIHJldHVybiBgZmFsc2VgIGZvciBhbnkgcHJpbWl0aXZlIHR5cGUsIG9yIGBudWxsYCwgYHVuZGVmaW5lZGAsIGBOYU5gLCBgSW5maW5pdHlgLCBvciBgLUluZmluaXR5YCB2YWx1ZXMuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdHlwZW9mIHZhbHVlYCBpcyBvbmUgb2Y6IGBzdHJpbmdgLCBgbnVtYmVyYCwgYGJvb2xlYW5gLCBgYmlnaW50YCwgb3IgYHN5bWJvbGAsXG4gKiAgICAgICphbmQgYWxzbyogYHZhbHVlYCAqaXMgbm90KiBgTmFOYCwgYEluZmluaXR5YCwgYC1JbmZpbml0eWAsIGB1bmRlZmluZWRgLCBvciBgbnVsbGAuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xsZWN0YWJsZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKEluZmluaXR5KSB8fCBPYmplY3QuaXMoLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICc6OlN0cmluZycsICc6Ok51bWJlcicsICc6OkJvb2xlYW4nLCAnOjpCaWdJbnQnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIFwiZW1wdHlcIiAoaXMgKipOKip1bGwgKipPKipyICoqRSoqbXB0eSkuXG4gKlxuICogICBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgXCJlbXB0eVwiIGlmIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaXMgbWV0OlxuICogICAxLiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICogICAyLiBgdmFsdWVgIGlzIGBudWxsYC5cbiAqICAgMy4gYHZhbHVlYCBpcyBgJydgIChhbiBlbXB0eSBzdHJpbmcpLlxuICogICA0LiBgdmFsdWVgIGlzIG5vdCBhbiBlbXB0eSBzdHJpbmcsIGJ1dCBpdCBjb250YWlucyBub3RoaW5nIGV4Y2VwdCB3aGl0ZXNwYWNlIChgXFx0YCwgYFxccmAsIGBcXHNgLCBvciBgXFxuYCkuXG4gKiAgIDUuIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKiAgIDYuIGB2YWx1ZS5sZW5ndGhgIGlzIGEgYE51bWJlcmAgb3IgYG51bWJlcmAgdHlwZSwgYW5kIGlzIGVxdWFsIHRvIGAwYC5cbiAqICAgNy4gYHZhbHVlYCBpcyBhIEBzZWUgQmFzZVV0aWxzLmlzUGxhaW5PYmplY3Q/Y2FwdGlvbj1wbGFpbitvYmplY3Q7IGFuZCBoYXMgbm8gaXRlcmFibGUga2V5cy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGFueSBvZiB0aGUgXCJlbXB0eVwiIGNvbmRpdGlvbnMgYWJvdmUgYXJlIHRydWUuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc05vdE5PRTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05PRSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJykgJiYgKC9eW1xcdFxcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnOjpOdW1iZXInKSlcbiAgICByZXR1cm4gKHZhbHVlLmxlbmd0aCA9PT0gMCk7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERldGVjdCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyAqKm5vdCoqIFwiZW1wdHlcIiAoaXMgbm90ICoqTioqdWxsICoqTyoqciAqKkUqKm1wdHkpLlxuICpcbiAqICAgQSB2YWx1ZSBpcyBjb25zaWRlcmVkIFwiZW1wdHlcIiBpZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIG1ldDpcbiAqICAgMS4gYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqICAgMi4gYHZhbHVlYCBpcyBgbnVsbGAuXG4gKiAgIDMuIGB2YWx1ZWAgaXMgYCcnYCAoYW4gZW1wdHkgc3RyaW5nKS5cbiAqICAgNC4gYHZhbHVlYCBpcyBub3QgYW4gZW1wdHkgc3RyaW5nLCBidXQgaXQgY29udGFpbnMgbm90aGluZyBleGNlcHQgd2hpdGVzcGFjZSAoYFxcdGAsIGBcXHJgLCBgXFxzYCwgb3IgYFxcbmApLlxuICogICA1LiBgdmFsdWVgIGlzIGBOYU5gLlxuICogICA2LiBgdmFsdWUubGVuZ3RoYCBpcyBhIGBOdW1iZXJgIG9yIGBudW1iZXJgIHR5cGUsIGFuZCBpcyBlcXVhbCB0byBgMGAuXG4gKiAgIDcuIGB2YWx1ZWAgaXMgYSBAc2VlIEJhc2VVdGlscy5pc1BsYWluT2JqZWN0P2NhcHRpb249cGxhaW4rb2JqZWN0OyBhbmQgaGFzIG5vIGl0ZXJhYmxlIGtleXMuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGBmYWxzZWAgaWYgYW55IG9mIHRoZSBcImVtcHR5XCIgY29uZGl0aW9ucyBhYm92ZSBhcmUgdHJ1ZS5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgdHJ1ZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgaXMgdGhlIGV4YWN0IGludmVyc2Ugb2YgQHNlZSBCYXNlVXRpbHMuaXNOT0U7XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzTk9FOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm90Tk9FKHZhbHVlKSB7XG4gIHJldHVybiAhaXNOT0UodmFsdWUpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBbY2FtZWxDYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNDYW1lbF9jYXNlKS5cbiAqXG4gKiAgIFRoZSBwcm9jZXNzIGlzIHJvdWdobHkgYXMgZm9sbG93czpcbiAqICAgMS4gQW55IG5vbi13b3JkIGNoYXJhY3RlcnMgKFthLXpBLVowLTlfXSkgYXJlIHN0cmlwcGVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nLlxuICogICAyLiBBbnkgbm9uLXdvcmQgY2hhcmFjdGVycyAoW2EtekEtWjAtOV9dKSBhcmUgc3RyaXBwZWQgZnJvbSB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gKiAgIDMuIEVhY2ggXCJ3b3JkXCIgaXMgY2FwaXRhbGl6ZWQuXG4gKiAgIDQuIFRoZSBmaXJzdCBsZXR0ZXIgaXMgYWx3YXlzIGxvd2VyLWNhc2VkLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byBjb252ZXJ0IGludG8gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIGZvcm1hdHRlZCBzdHJpbmcgaW4gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKEJhc2VVdGlscy50b0NhbWVsQ2FzZSgnLS10ZXN0LXNvbWVfdmFsdWVfQCcpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ3Rlc3RTb21lVmFsdWUnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL15cXFcvLCAnJylcbiAgICAucmVwbGFjZSgvW1xcV10rJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oW0EtWl0rKS9nLCAnLSQxJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXFcrKC4pL2csIChtLCBwKSA9PiB7XG4gICAgICByZXR1cm4gcC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL14oLikoLiopJC8sIChtLCBmLCBsKSA9PiBgJHtmLnRvTG93ZXJDYXNlKCl9JHtsfWApO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBbc25ha2VfY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU25ha2VfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBjYXBpdGFsaXplZCBjaGFyYWN0ZXIgc2VxdWVuY2UgaXMgcHJlZml4ZWQgYnkgYW4gdW5kZXJzY29yZS5cbiAqICAgMi4gTW9yZSB0aGFuIG9uZSBzZXF1ZW50aWFsIHVuZGVyc2NvcmVzIGFyZSBjb252ZXJ0ZWQgaW50byBhIHNpbmdsZSB1bmRlcnNjb3JlLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byBjb252ZXJ0IGludG8gW3NuYWtlX2Nhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1NuYWtlX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtzbmFrZV9jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNTbmFrZV9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLnRvU25ha2VDYXNlKCdUaGlzSXNBU2VudGVuY2UnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0aGlzX2lzX2Ffc2VudGVuY2UnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL1tBLVpdKy9nLCAobSwgb2Zmc2V0KSA9PiAoKG9mZnNldCkgPyBgXyR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpKVxuICAgIC5yZXBsYWNlKC9fezIsfS9nLCAnXycpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBCYXNlVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29udmVydCB0aGUgcHJvdmlkZWQgYHN0cmluZ2AgYHZhbHVlYCBpbnRvIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqXG4gKiAgIFRoZSBwcm9jZXNzIGlzIHJvdWdobHkgYXMgZm9sbG93czpcbiAqICAgMS4gQW55IGNhcGl0YWxpemVkIGNoYXJhY3RlciBzZXF1ZW5jZSBpcyBwcmVmaXhlZCBieSBhIGh5cGhlbi5cbiAqICAgMi4gTW9yZSB0aGFuIG9uZSBzZXF1ZW50aWFsIGh5cGhlbnMgYXJlIGNvbnZlcnRlZCBpbnRvIGEgc2luZ2xlIGh5cGhlbi5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBTdHJpbmcgdG8gdHVybiBpbnRvIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgZm9ybWF0dGVkIHN0cmluZyBpbiBba2ViYWItY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjS2ViYWJfY2FzZSkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IEJhc2VVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKEJhc2VVdGlscy50b0tlYmFiQ2FzZSgnVGhpc0lzQVNlbnRlbmNlJykpO1xuICogICAgIC8vIG91dHB1dCAtPiAndGhpcy1pcy1hLXNlbnRlbmNlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9LZWJhYkNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXSsvZywgKG0sIG9mZnNldCkgPT4gKChvZmZzZXQpID8gYC0ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKSlcbiAgICAucmVwbGFjZSgvLXsyLH0vZywgJy0nKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogQmFzZVV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERvIG91ciBiZXN0IHRvIGVtdWxhdGUgW3Byb2Nlc3MubmV4dFRpY2tdKGh0dHBzOi8vbm9kZWpzLm9yZy9lbi9ndWlkZXMvZXZlbnQtbG9vcC10aW1lcnMtYW5kLW5leHR0aWNrLyNwcm9jZXNzbmV4dHRpY2spXG4gKiAgIGluIHRoZSBicm93c2VyLlxuICpcbiAqICAgSW4gb3JkZXIgdG8gdHJ5IGFuZCBlbXVsYXRlIGBwcm9jZXNzLm5leHRUaWNrYCwgdGhpcyBmdW5jdGlvbiB3aWxsIHVzZSBgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gY2FsbGJhY2soKSlgIGlmIGF2YWlsYWJsZSxcbiAqICAgb3RoZXJ3aXNlIGl0IHdpbGwgZmFsbGJhY2sgdG8gdXNpbmcgYFByb21pc2UucmVzb2x2ZSgpLnRoZW4oY2FsbGJhY2spYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBjYWxsYmFja1xuICogICAgIGRhdGFUeXBlOiBmdW5jdGlvblxuICogICAgIGRlc2M6IENhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgb24gXCJuZXh0VGlja1wiLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIGZ1bmN0aW9uIHdpbGwgcHJlZmVyIGFuZCB1c2UgYHByb2Nlc3MubmV4dFRpY2tgIGlmIGl0IGlzIGF2YWlsYWJsZSAoaS5lLiBpZiBydW5uaW5nIG9uIE5vZGVKUykuXG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBUaGlzIGZ1bmN0aW9uIGlzIHVubGlrZWx5IHRvIGFjdHVhbGx5IGJlIHRoZSBuZXh0IFwidGlja1wiIG9mIHRoZSB1bmRlcmx5aW5nXG4gKiAgICAgamF2YXNjcmlwdCBlbmdpbmUuIFRoaXMgbWV0aG9kIGp1c3QgZG9lcyBpdHMgYmVzdCB0byBlbXVsYXRlIFwibmV4dFRpY2tcIi4gSW5zdGVhZCBvZiB0aGVcbiAqICAgICBhY3R1YWwgXCJuZXh0IHRpY2tcIiwgdGhpcyB3aWxsIGluc3RlYWQgYmUgXCJhcyBmYXN0IGFzIHBvc3NpYmxlXCIuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIGZ1bmN0aW9uIGRlbGliZXJhdGVseSBhdHRlbXB0cyB0byB1c2UgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgZmlyc3QtLWV2ZW4gdGhvdWdoIGl0IGxpa2VseSBkb2Vzbid0XG4gKiAgICAgaGF2ZSB0aGUgZmFzdGVzdCB0dXJuLWFyb3VuZC10aW1lLS10byBzYXZlIGJhdHRlcnkgcG93ZXIuIFRoZSBpZGVhIGJlaW5nIHRoYXQgXCJzb21ldGhpbmcgbmVlZHMgdG8gYmUgZG9uZSAqc29vbipcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MubmV4dFRpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIChuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pKS50aGVuKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgSVNfTlVNQkVSID0gL14oWy0rXT8pKFxcZCooPzpcXC5cXGQrKT8pKGVbLStdXFxkKyk/JC87XG5jb25zdCBJU19CT09MRUFOID0gL14odHJ1ZXxmYWxzZSkkLztcblxuLyoqXG4gKiBncm91cE5hbWU6IEJhc2VVdGlsc1xuICogZGVzYzogfFxuICogICBDb2VyY2UgYSBzdHJpbmcgdG8gaXRzIG1vc3QgbGlrZWx5IHVuZGVybHlpbmcgcHJpbWl0aXZlIHR5cGUuXG4gKlxuICogICBDb252ZXJzaW9uIGlucHV0IGFuZCBvdXRwdXQgdGFibGU6XG4gKiAgICogYCdudWxsJ2AgY29udmVydHMgdG8gYG51bGxgXG4gKiAgICogYCd1bmRlZmluZWQnYCBjb252ZXJ0cyB0byBgdW5kZWZpbmVkYFxuICogICAqIGAnTmFOJ2AgY29udmVydHMgdG8gYE5hTmBcbiAqICAgKiBgJ0luZmluaXR5J2AgY29udmVydHMgdG8gYEluZmluaXR5YFxuICogICAqIGAnLUluZmluaXR5J2AgY29udmVydHMgdG8gYC1JbmZpbml0eWBcbiAqICAgKiBgJ3RydWUnYCBjb252ZXJ0cyB0byBgdHJ1ZWBcbiAqICAgKiBgJ2ZhbHNlJ2AgY29udmVydHMgdG8gYGZhbHNlYFxuICogICAqIEFueSBwYXJzYWJsZSBudW1lcmljIHN0cmluZyB2YWx1ZSAoaW5jbHVkaW5nIFtFIG5vdGF0aW9uXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TY2llbnRpZmljX25vdGF0aW9uI0Vfbm90YXRpb24pKSBjb252ZXJ0cyB0byBgbnVtYmVyYFxuICpcbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjb252ZXJ0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29lcmNlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gJ251bGwnKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBpZiAodmFsdWUgPT09ICdOYU4nKVxuICAgIHJldHVybiBOYU47XG5cbiAgaWYgKHZhbHVlID09PSAnSW5maW5pdHknIHx8IHZhbHVlID09PSAnK0luZmluaXR5JylcbiAgICByZXR1cm4gSW5maW5pdHk7XG5cbiAgaWYgKHZhbHVlID09PSAnLUluZmluaXR5JylcbiAgICByZXR1cm4gLUluZmluaXR5O1xuXG4gIGlmIChJU19OVU1CRVIudGVzdCh2YWx1ZSkpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSwgMTApO1xuXG4gIGlmIChJU19CT09MRUFOLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiAodmFsdWUgPT09ICd0cnVlJyk7XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IHtcbiAgTVlUSElYX1RZUEUsXG4gIE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSxcbiAgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVELFxuICBNWVRISVhfU0hBRE9XX1BBUkVOVCxcbiAgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgICBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgICAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBRdWVyeUVuZ2luZSB9ICBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IENvbXBvbmVudHNcbiAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29tcG9uZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgQ29tcG9uZW50IGFuZCBmcmFtZXdvcmsgY2xhc3NlcyBhbmQgZnVuY3Rpb25hbGl0eSBhcmUgZm91bmQgaGVyZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogaXNNeXRoaXhDb21wb25lbnRcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhbiBpbnN0YW5jZSBrZXkgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IGluc3RhbmNlcy5cbiAqXG4gKiAgICAgICBGb3Igc3VjaCBpbnN0YW5jZXMsIGFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IHNpbXBseSByZXR1cm5zIGB0cnVlYCwgYWxsb3dpbmcgdGhlIGNhbGxlclxuICogICAgICAgdG8ga25vdyBpZiBhIHNwZWNpZmljIGluc3RhbmNlIChFbGVtZW50KSBpcyBhIE15dGhpeCBVSSBjb21wb25lbnQuXG4gKi9cblxuZXhwb3J0IGNvbnN0IGlzTXl0aGl4Q29tcG9uZW50ID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pcy1teXRoaXgtY29tcG9uZW50Jyk7IC8vIEByZWY6Q29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudFxuXG5jb25zdCBJU19BVFRSX01FVEhPRF9OQU1FICAgPSAvXmF0dHJcXCQoLiopJC87XG5jb25zdCBSRUdJU1RFUkVEX0NPTVBPTkVOVFMgPSBuZXcgU2V0KCk7XG5cbi8qKipcbiAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICogZGVzYzogfFxuICogICBUaGlzIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBNeXRoaXggVUkgY29tcG9uZW50cy4gSXQgaW5oZXJpdHNcbiAqICAgZnJvbSBIVE1MRWxlbWVudCwgYW5kIHNvIHdpbGwgZW5kIHVwIGJlaW5nIGEgW1dlYiBDb21wb25lbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQ29tcG9uZW50cykuXG4gKlxuICogICBJdCBpcyBzdHJvbmdseSByZWNvbW1lbmRlZCB0aGF0IHlvdSBmdWxseSByZWFkIHVwIGFuZCB1bmRlcnN0YW5kXG4gKiAgIFtXZWIgQ29tcG9uZW50c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKVxuICogICBpZiB5b3UgZG9uJ3QgYWxyZWFkeSBmdWxseSB1bmRlcnN0YW5kIHRoZW0uIFRoZSBjb3JlIG9mIE15dGhpeCBVSSBpcyB0aGVcbiAqICAgW1dlYiBDb21wb25lbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQ29tcG9uZW50cykgc3RhbmRhcmQsXG4gKiAgIHNvIHlvdSBtaWdodCBlbmQgdXAgYSBsaXR0bGUgY29uZnVzZWQgaWYgeW91IGRvbid0IGFscmVhZHkgdW5kZXJzdGFuZCB0aGUgZm91bmRhdGlvbi5cbiAqXG4gKiBwcm9wZXJ0aWVzOlxuICogICAtIGNhcHRpb246IFwiLi4uIEhUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNcIlxuICogICAgIGRlc2M6IFwiQWxsIFtIVE1MRWxlbWVudCBJbnN0YW5jZSBQcm9wZXJ0aWVzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQjaW5zdGFuY2VfcHJvcGVydGllcykgYXJlIGluaGVyaXRlZCBmcm9tIFtIVE1MRWxlbWVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50KVwiXG4gKiAgICAgbGluazogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50I2luc3RhbmNlX3Byb3BlcnRpZXNcbiAqXG4gKiAgIC0gbmFtZTogaXNNeXRoaXhDb21wb25lbnRcbiAqICAgICBkYXRhVHlwZTogYm9vbGVhblxuICogICAgIGNhcHRpb246IFwiW3N0YXRpYyBNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudF1cIlxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIElzIGB0cnVlYCBmb3IgTXl0aGl4IFVJIGNvbXBvbmVudHMuXG4gKiAgIC0gbmFtZTogc2Vuc2l0aXZlVGFnTmFtZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBjYXB0aW9uOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgV29ya3MgaWRlbnRpY2FsbHkgdG8gW0VsZW1lbnQudGFnTmFtZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvdGFnTmFtZSkgZm9yIFhNTCwgd2hlcmUgY2FzZSBpcyBwcmVzZXJ2ZWQuXG4gKiAgICAgICBJbiBIVE1MIHRoaXMgd29ya3MgbGlrZSBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSwgYnV0IGluc3RlYWQgb2YgdGhlIHJlc3VsdFxuICogICAgICAgYWx3YXlzIGJlaW5nIFVQUEVSQ0FTRSwgdGhlIHRhZyBuYW1lIHdpbGwgYmUgcmV0dXJuZWQgd2l0aCB0aGUgY2FzaW5nIHByZXNlcnZlZC5cbiAqICAgLSBuYW1lOiB0ZW1wbGF0ZUlEXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGNhcHRpb246IHRlbXBsYXRlSURcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIGEgY29udmVuaWVuY2UgcHJvcGVydHkgdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZiBgdGhpcy5jb25zdHJ1Y3Rvci5URU1QTEFURV9JRGBcbiAqICAgLSBuYW1lOiBkZWxheVRpbWVyc1xuICogICAgIGRhdGFUeXBlOiBcIk1hcCZsdDtzdHJpbmcsIFByb21pc2UmZ3Q7XCJcbiAqICAgICBjYXB0aW9uOiBkZWxheVRpbWVyc1xuICogICAgIGRlc2M6IHxcbiAqICAgICAgIEEgTWFwIGluc3RhbmNlIHRoYXRcbiAqICAgICAgIHJldGFpbnMgYHNldFRpbWVvdXRgIGlkcyBzbyB0aGF0IEBzZWUgTXl0aGl4VUlDb21wb25lbnQuZGVib3VuY2U7IGNhbiBwcm9wZXJseSBmdW5jdGlvbi4gS2V5cyBhcmUgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5kZWJvdW5jZTtcbiAqICAgICAgIHRpbWVyIGlkcyAob2YgdHlwZSBgc3RyaW5nYCkuIFZhbHVlcyBhcmUgUHJvbWlzZSBpbnN0YW5jZXMuXG4gKiAgICAgICBFYWNoIHByb21pc2UgaW5zdGFuY2UgYWxzbyBoYXMgYSBzcGVjaWFsIGtleSBgdGltZXJJRGAgdGhhdCBjb250YWlucyBhIGBzZXRUaW1lb3V0YCBpZCBvZiBhIGphdmFzY3JpcHQgdGltZXIuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOndhcm5pbmc6IFVzZSBhdCB5b3VyIG93biByaXNrLiBUaGlzIGlzIE15dGhpeCBVSSBpbnRlcm5hbCBjb2RlIHRoYXQgbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5kZWJvdW5jZTtcbiAqICAgLSBuYW1lOiBzaGFkb3dcbiAqICAgICBkYXRhVHlwZTogXCJbU2hhZG93Um9vdF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NoYWRvd1Jvb3QpXCJcbiAqICAgICBjYXB0aW9uOiBzaGFkb3dcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgc2hhZG93IHJvb3Qgb2YgdGhpcyBjb21wb25lbnQgKG9yIGBudWxsYCBpZiBub25lKS5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gVGhpcyBpcyB0aGUgY2FjaGVkIHJlc3VsdCBvZiBjYWxsaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuY3JlYXRlU2hhZG93RE9NOyB3aGVuXG4gKiAgICAgICAgIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgaW5pdGlhbGl6ZWQuXG4gKiAgIC0gbmFtZTogdGVtcGxhdGVcbiAqICAgICBkYXRhVHlwZTogXCJbdGVtcGxhdGUgZWxlbWVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50L3RlbXBsYXRlKVwiXG4gKiAgICAgY2FwdGlvbjogdGVtcGxhdGVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgW3RlbXBsYXRlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvdGVtcGxhdGUpIGVsZW1lbnQgZm9yIHRoaXNcbiAqICAgICAgIGNvbXBvbmVudCwgb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHRlbXBsYXRlIGZvdW5kIGZvciB0aGUgY29tcG9uZW50LlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSBUaGlzIGlzIHRoZSBjYWNoZWQgcmVzdWx0IG9mIGNhbGxpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5nZXRDb21wb25lbnRUZW1wbGF0ZTsgd2hlblxuICogICAgICAgICB0aGUgY29tcG9uZW50IGlzIGZpcnN0IGluaXRpYWxpemVkLlxuKioqL1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gTVlUSElYX1VJX0NPTVBPTkVOVF9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gc3RhdGljIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQ7XG4gIHN0YXRpYyByZWdpc3RlciA9IGZ1bmN0aW9uKF9uYW1lLCBfS2xhc3MpIHtcbiAgICBsZXQgbmFtZSA9IF9uYW1lIHx8IHRoaXMudGFnTmFtZTtcblxuICAgIGlmICghY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpKSB7XG4gICAgICBsZXQgS2xhc3MgPSBfS2xhc3MgfHwgdGhpcztcbiAgICAgIEtsYXNzLm9ic2VydmVkQXR0cmlidXRlcyA9IEtsYXNzLmNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzKEtsYXNzKTtcbiAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShuYW1lLCBLbGFzcyk7XG5cbiAgICAgIGxldCByZWdpc3RlckV2ZW50ID0gbmV3IEV2ZW50KCdteXRoaXgtY29tcG9uZW50LXJlZ2lzdGVyZWQnKTtcbiAgICAgIHJlZ2lzdGVyRXZlbnQuY29tcG9uZW50TmFtZSA9IG5hbWU7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudCA9IEtsYXNzO1xuXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChyZWdpc3RlckV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBzdGF0aWMgY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbihLbGFzcykge1xuICAgIGNvbnN0IHNldHVwQXR0cmlidXRlSGFuZGxlcnMgPSAoeyBwcm9wZXJ0eU5hbWUsIGF0dHJpYnV0ZU5hbWUsIG9yaWdpbmFsTmFtZSB9KSA9PiB7XG4gICAgICBpZiAoUkVHSVNURVJFRF9DT01QT05FTlRTLmhhcyhLbGFzcykpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHsgZGVzY3JpcHRvciB9ID0gVXRpbHMuZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihwcm90bywgb3JpZ2luYWxOYW1lKTtcbiAgICAgIGlmICghZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHJlbW92ZSB0aGlzIGZyb21cbiAgICAgIC8vIHRoZSBwcm90b3R5cGUsIGFzIGNoaWxkIGNsYXNzZXMgd2lsbFxuICAgICAgLy8gd2FudCB0byBpbmhlcml0IGF0dHJpYnV0ZSBiZWhhdmlvci5cbiAgICAgIC8vIGRlbGV0ZSBwcm90b3R5cGVbb3JpZ2luYWxOYW1lXTtcblxuICAgICAgLy8gSWYgd2UgaGF2ZSBhIFwidmFsdWVcIiB0aGVuIHRoZSB1c2VyIGRpZCBpdCB3cm9uZy4uLlxuICAgICAgLy8gc28ganVzdCBtYWtlIGl0IHRoZSBcInNldHRlclwiXG4gICAgICBsZXQgc2V0dGVyICAgID0gZGVzY3JpcHRvci5zZXQgfHwgZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgIGxldCBnZXR0ZXIgICAgPSBkZXNjcmlwdG9yLmdldDtcbiAgICAgIGxldCBoYXNTZXR0ZXIgPSAodHlwZW9mIHNldHRlciA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgICBsZXQgaGFzR2V0dGVyID0gKHR5cGVvZiBnZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm90bywge1xuICAgICAgICBbcHJvcGVydHlOYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKGhhc0dldHRlcikgPyBnZXR0ZXIuY2FsbCh0aGlzKSA6IHRoaXMuYXR0cihhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogICAgICAgICAgZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuYXR0cihhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgICAgICAgdGhpcy5hdHRyKGF0dHJpYnV0ZU5hbWUsIG5ld1ZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKGhhc1NldHRlcilcbiAgICAgICAgICAgICAgc2V0dGVyLmNhbGwodGhpcywgWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBsZXQgcHJvdG8gICAgICAgICAgID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBVdGlscy5nZXRBbGxQcm9wZXJ0eU5hbWVzKHByb3RvKVxuICAgICAgLmZpbHRlcigobmFtZSkgPT4gSVNfQVRUUl9NRVRIT0RfTkFNRS50ZXN0KG5hbWUpKVxuICAgICAgLm1hcCgob3JpZ2luYWxOYW1lKSA9PiB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgID0gb3JpZ2luYWxOYW1lLm1hdGNoKElTX0FUVFJfTUVUSE9EX05BTUUpWzFdO1xuICAgICAgICBsZXQgYXR0cmlidXRlTmFtZSA9IEJhc2VVdGlscy50b0tlYmFiQ2FzZShwcm9wZXJ0eU5hbWUpO1xuXG4gICAgICAgIHNldHVwQXR0cmlidXRlSGFuZGxlcnMoeyBwcm9wZXJ0eU5hbWUsIGF0dHJpYnV0ZU5hbWUsIG9yaWdpbmFsTmFtZSB9KTtcblxuICAgICAgICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbiAgICAgIH0pO1xuXG4gICAgUkVHSVNURVJFRF9DT01QT05FTlRTLmFkZChLbGFzcyk7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGF0dHJpYnV0ZU5hbWVzKSk7XG4gIH07XG5cbiAgc2V0IGF0dHIkZGF0YU15dGhpeFNyYyhbIG5ld1ZhbHVlLCBvbGRWYWx1ZSBdKSB7XG4gICAgdGhpcy5hd2FpdEZldGNoU3JjT25WaXNpYmxlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQgdG8gdGhlIERPTS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkFkZGVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25SZW1vdmVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIGFuIGVsZW1lbnQgaXMgYWRkZWQgYXMgYSBjaGlsZC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbm9kZVxuICAgKiAgICAgZGF0YVR5cGVzOiBFbGVtZW50XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBjaGlsZCBlbGVtZW50IGJlaW5nIGFkZGVkLlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkNoaWxkQWRkZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgQ2FsbGVkIHdoZW4gYSBjaGlsZCBlbGVtZW50IGlzIHJlbW92ZWQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5vZGVcbiAgICogICAgIGRhdGFUeXBlczogRWxlbWVudFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgY2hpbGQgZWxlbWVudCBiZWluZyByZW1vdmVkLlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkNoaWxkUmVtb3ZlZCgpIHt9XG5cbiAgc3RhdGljIGlzTXl0aGl4Q29tcG9uZW50ID0gaXNNeXRoaXhDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtNWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgTVlUSElYX1VJX0NPTVBPTkVOVF9UWVBFLFxuICAgICAgfSxcbiAgICAgIFtpc015dGhpeENvbXBvbmVudF06IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudFxuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGlzTXl0aGl4Q29tcG9uZW50LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgLyosIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0qLyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5zZW5zaXRpdmVUYWdOYW1lXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQudGVtcGxhdGVJRFxuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5URU1QTEFURV9JRCxcbiAgICAgIH0sXG4gICAgICAnZGVsYXlUaW1lcnMnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuZGVsYXlUaW1lcnNcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgICAnZG9jdW1lbnRJbml0aWFsaXplZCc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5kb2N1bWVudEluaXRpYWxpemVkXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQpLFxuICAgICAgICBzZXQ6ICAgICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsIE1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRCwgISF2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NoYWRvdyc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5zaGFkb3dcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dET00oKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIGF0dHJpYnV0ZXMuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkXG4gICAqICAgdG8gdGhpcyBtZXRob2QsIHRoZW4gaXQgd2lsbCBhY3QgYXMgYSBnZXR0ZXIsIGdldHRpbmcgdGhlIGF0dHJpYnV0ZSBzcGVjaWZpZWQgYnkgbmFtZS5cbiAgICpcbiAgICogICBJZiBob3dldmVyIHR3byBvciBtb3JlIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHRoZW4gdGhpcyBpcyBhbiBhdHRyaWJ1dGUgc2V0dGVyLlxuICAgKlxuICAgKiAgIElmIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgZmFsc2VgLCB0aGVuIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZVxuICAgKiAgIHJlbW92ZWQuXG4gICAqXG4gICAqICAgSWYgdGhlIHByb3ZpZGVkIHZhbHVlIGlzIGB0cnVlYCwgdGhlbiB0aGUgYXR0cmlidXRlJ3MgdmFsdWUgd2lsbCBiZSBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqICAgQW55IG90aGVyIHZhbHVlIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBhbmQgc2V0IGFzIHRoZSBhdHRyaWJ1dGUncyB2YWx1ZS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbmFtZVxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBvcGVyYXRlIG9uLlxuICAgKiAgIC0gbmFtZTogdmFsdWVcbiAgICogICAgIGRhdGFUeXBlczogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIElmIGB1bmRlZmluZWRgLCBgbnVsbGAsIG9yIGBmYWxzZWAsIHJlbW92ZSB0aGUgbmFtZWQgYXR0cmlidXRlLlxuICAgKiAgICAgICBJZiBgdHJ1ZWAsIHNldCB0aGUgbmFtZWQgYXR0cmlidXRlJ3MgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqICAgICAgIEZvciBhbnkgb3RoZXIgdmFsdWUsIGZpcnN0IGNvbnZlcnQgaXQgaW50byBhIHN0cmluZywgYW5kIHRoZW4gc2V0IHRoZSBuYW1lZCBhdHRyaWJ1dGUncyB2YWx1ZSB0byB0aGUgcmVzdWx0aW5nIHN0cmluZy5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgMS4gQHR5cGVzIHN0cmluZzsgSWYgYSBzaW5nbGUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIG5hbWVkIGF0dHJpYnV0ZS5cbiAgICogICAyLiBAdHlwZXMgdGhpczsgSWYgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhlbiBzZXQgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZSxcbiAgICogICAgICBhbmQgcmV0dXJuIGB0aGlzYCAodG8gYWxsb3cgZm9yIGNoYWluaW5nKS5cbiAgICovXG4gIGF0dHIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSlcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsICh2YWx1ZSA9PT0gdHJ1ZSkgPyAnJyA6ICgnJyArIHZhbHVlKSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgSW5qZWN0IGEgbmV3IHN0eWxlIHNoZWV0IHZpYSBhIGA8c3R5bGU+YCBlbGVtZW50IGR5bmFtaWNhbGx5IGF0IHJ1bi10aW1lLlxuICAgKlxuICAgKiAgIFRoaXMgbWV0aG9kIGFsbG93cyB0aGUgY2FsbGVyIHRvIGluamVjdCBkeW5hbWljIHN0eWxlcyBhdCBydW4tdGltZS5cbiAgICogICBJdCB3aWxsIG9ubHkgaW5qZWN0IHRoZSBzdHlsZXMgb25jZSwgbm8gbWF0dGVyIGhvdyBtYW55IHRpbWVzIHRoZVxuICAgKiAgIG1ldGhvZCBpcyBjYWxsZWQtLWFzIGxvbmcgYXMgdGhlIHN0eWxlIGNvbnRlbnQgaXRzZWxmIGRvZXNuJ3QgY2hhbmdlLlxuICAgKlxuICAgKiAgIFRoZSBjb250ZW50IGlzIGhhc2hlZCB2aWEgU0hBMjU2LCBhbmQgdGhlIGhhc2ggaXMgdXNlZCBhcyB0aGUgc3R5bGUgc2hlZXQgaWQuIFRoaXNcbiAgICogICBhbGxvd3MgeW91IHRvIGNhbGwgdGhlIG1ldGhvZCBpbnNpZGUgYSBjb21wb25lbnQncyBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1vdW50ZWQ7XG4gICAqICAgbWV0aG9kLCB3aXRob3V0IG5lZWRpbmcgdG8gd29ycnkgYWJvdXQgZHVwbGljYXRpbmcgdGhlIHN0eWxlcyBvdmVyIGFuZCBvdmVyIGFnYWluLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjb250ZW50XG4gICAqICAgICBkYXRhVHlwZXM6IHN0cmluZ1xuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgQ1NTIHN0eWxlc2hlZXQgY29udGVudCB0byBpbmplY3QgaW50byBhIGA8c3R5bGU+YCBlbGVtZW50LiBUaGlzIGNvbnRlbnQgaXNcbiAgICogICAgICAgdXNlZCB0byBnZW5lcmF0ZSBhbiBgaWRgIGZvciB0aGUgYDxzdHlsZT5gIGVsZW1lbnQsIHNvIHRoYXQgaXQgb25seSBnZXRzIGFkZGVkXG4gICAqICAgICAgIHRvIHRoZSBgZG9jdW1lbnRgIG9uY2UuXG4gICAqICAgLSBuYW1lOiBtZWRpYVxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlZmF1bHQ6IFwiJ3NjcmVlbidcIlxuICAgKiAgICAgb3B0aW9uYWw6IHRydWVcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgV2hhdCB0byBzZXQgdGhlIGBtZWRpYWAgYXR0cmlidXRlIG9mIHRoZSBjcmVhdGVkIGA8c3R5bGU+YCBlbGVtZW50IHRvLiBEZWZhdWx0c1xuICAgKiAgICAgICB0byBgJ3NjcmVlbidgLlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBJdCBpcyBvZnRlbiBiZXR0ZXIgdG8gc2ltcGx5IGFkZCBhIGA8c3R5bGU+YCBlbGVtZW50IHRvIHlvdXIgY29tcG9uZW50J3MgSFRNTCB0ZW1wbGF0ZS5cbiAgICogICAgIEhvd2V2ZXIsIHNvbWV0aW1lcyB0cnVseSBkeW5hbWljIHN0eWxlcyBhcmUgbmVlZGVkLCB3aGVyZSB0aGUgY29udGVudCB3b24ndCBiZSBrbm93blxuICAgKiAgICAgdW50aWwgcnVudGltZS4gVGhpcyBpcyB0aGUgcHJvcGVyIHVzZSBjYXNlIGZvciB0aGlzIG1ldGhvZC5cbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBQbGVhc2UgZWR1Y2F0ZWQgeW91cnNlbGYgKHVubGlrZSBwZW9wbGUgd2hvIGxvdmUgUmVhY3QpIGFuZCBkbyBub3Qgb3ZlcnVzZSBkeW5hbWljIG9yIGlubGluZSBzdHlsZXMuXG4gICAqICAgICBXaGlsZSB0aGUgcmVzdWx0IG9mIHRoaXMgbWV0aG9kIGlzIGNlcnRhaW5seSBhIHN0ZXAgYWJvdmUgaW5saW5lIHN0eWxlcywgdGhpcyBtZXRob2QgaGFzXG4gICAqICAgICBbZ3JlYXQgcG90ZW50aWFsIHRvIGNhdXNlIGhhcm1dKGh0dHBzOi8vd29ybGRvZmRldi5pbmZvLzYtcmVhc29ucy13aHkteW91LXNob3VsZG50LXN0eWxlLWlubGluZS8pXG4gICAqICAgICBhbmQgc3ByZWFkIHlvdXIgb3duIGlnbm9yYW5jZSB0byBvdGhlcnMuIFVzZSB3aXRoICoqQ0FSRSoqIVxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgRWxlbWVudDsgVGhlIGA8c3R5bGU+YCBlbGVtZW50IGZvciB0aGUgc3BlY2lmaWVkIHN0eWxlLlxuICAgKiBleGFtcGxlczpcbiAgICogICAtIHxcbiAgICogICAgIGBgYGphdmFzY3JpcHRcbiAgICogICAgIGltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAgICpcbiAgICogICAgIGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICAgKiAgICAgICBzdGF0aWMgdGFnTmFtZSA9ICdteS1jb21wb25lbnQnO1xuICAgKlxuICAgKiAgICAgICAvLyAuLi5cbiAgICpcbiAgICogICAgICAgbW91bnRlZCgpIHtcbiAgICogICAgICAgICBsZXQgeyBzaWRlYmFyV2lkdGggfSA9IHRoaXMubG9hZFVzZXJQcmVmZXJlbmNlcygpO1xuICAgKiAgICAgICAgIHRoaXMuaW5qZWN0U3R5bGVTaGVldChgbmF2LnNpZGViYXIgeyB3aWR0aDogJHtzaWRlYmFyV2lkdGh9cHg7IH1gLCAnc2NyZWVuJyk7XG4gICAqICAgICAgIH1cbiAgICogICAgIH1cbiAgICpcbiAgICogICAgIE15Q29tcG9uZW50LnJlZ2lzdGVyKCk7XG4gICAqICAgICBgYGBcbiAgICovXG4gIGluamVjdFN0eWxlU2hlZXQoY29udGVudCwgbWVkaWEgPSAnc2NyZWVuJykge1xuICAgIGxldCBzdHlsZUlEICAgICAgID0gYElEU1RZTEUke0Jhc2VVdGlscy5TSEEyNTYoYCR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfToke2NvbnRlbnR9OiR7bWVkaWF9YCl9YDtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICBsZXQgc3R5bGVFbGVtZW50ICA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc3R5bGUjJHtzdHlsZUlEfWApO1xuXG4gICAgaWYgKHN0eWxlRWxlbWVudClcbiAgICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG5cbiAgICBzdHlsZUVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtZm9yJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuICAgIGlmIChtZWRpYSlcbiAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuXG4gICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuICB9XG5cbiAgcHJvY2Vzc0VsZW1lbnRzKG5vZGUsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoIW9wdGlvbnMuc2NvcGUpXG4gICAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZTogdGhpcy4kJCB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldENoaWxkcmVuQXNGcmFnbWVudChub0VtcHR5UmVzdWx0KSB7XG4gICAgbGV0IGhhc0NvbnRlbnQgICAgPSBmYWxzZTtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICBsZXQgdGVtcGxhdGUgICAgICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgaWYgKCF0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuIChub0VtcHR5UmVzdWx0KSA/IHVuZGVmaW5lZCA6IHRlbXBsYXRlO1xuXG4gICAgd2hpbGUgKHRoaXMuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGxldCBub2RlID0gdGhpcy5jaGlsZE5vZGVzWzBdO1xuICAgICAgaWYgKCEobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgQmFzZVV0aWxzLmlzTk9FKG5vZGUubm9kZVZhbHVlKSkpXG4gICAgICAgIGhhc0NvbnRlbnQgPSB0cnVlO1xuXG4gICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9XG5cbiAgICBpZiAobm9FbXB0eVJlc3VsdCAmJiAhaGFzQ29udGVudClcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgR2V0IHRoZSBwYXJlbnQgTm9kZSBvZiB0aGlzIGVsZW1lbnQuXG4gICAqXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOndhcm5pbmc6IFVubGlrZSBbTm9kZS5wYXJlbnROb2RlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9wYXJlbnROb2RlKSwgdGhpc1xuICAgKiAgICAgd2lsbCBhbHNvIHNlYXJjaCBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzLlxuICAgKiAgIC0gfFxuICAgKiAgICAgOndhcm5pbmc6ICoqU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgb25seSB3b3JrcyBmb3IgTXl0aGl4IFVJIGNvbXBvbmVudHMhKipcbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBpcyBhY2NvbXBsaXNoZWQgdmlhIGxldmVyYWdpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YTsgZm9yXG4gICAqICAgICBgdGhpc2AgY29tcG9uZW50LiBXaGVuIGEgYG51bGxgIHBhcmVudCBpcyBlbmNvdW50ZXJlZCwgYGdldFBhcmVudE5vZGVgIHdpbGwgbG9vayBmb3IgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgQHNlZSBDb25zdGFudHMuTVlUSElYX1NIQURPV19QQVJFTlQ7XG4gICAqICAgICBvbiBgdGhpc2AuIElmIGZvdW5kLCB0aGUgcmVzdWx0IGlzIGNvbnNpZGVyZWQgdGhlIFtwYXJlbnQgTm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSkgb2YgYHRoaXNgIGNvbXBvbmVudC5cbiAgICogICAtIHxcbiAgICogICAgIDpleWU6IFRoaXMgaXMganVzdCBhIHdyYXBwZXIgZm9yIEBzZWUgVXRpbHMuZ2V0UGFyZW50Tm9kZTsuXG4gICAqXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBOb2RlOyBUaGUgcGFyZW50IG5vZGUsIGlmIHRoZXJlIGlzIGFueSwgb3IgYG51bGxgIG90aGVyd2lzZS5cbiAgICovXG4gIGdldFBhcmVudE5vZGUoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmdldFBhcmVudE5vZGUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpXG4gICAqICAgd2l0aCBvbmUgbm90YWJsZSBkaWZmZXJlbmNlOiBJdCBydW5zIE15dGhpeCBVSSBmcmFtZXdvcmsgc3BlY2lmaWMgY29kZSBhZnRlciBhIHNoYWRvdyBpcyBhdHRhY2hlZC5cbiAgICpcbiAgICogICBDdXJyZW50bHksIHRoZSBtZXRob2QgY29tcGxldGVzIHRoZSBmb2xsb3dpbmcgYWN0aW9uczpcbiAgICogICAxLiBDYWxsIGBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucylgIHRvIGFjdHVhbGx5IGF0dGFjaCBhIFNoYWRvdyBET01cbiAgICogICAyLiBBc3NpZ24gQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyB0byB0aGUgcmVzdWx0aW5nIGBzaGFkb3dgLCB1c2luZyB0aGUga2V5IGBDb25zdGFudHMuTVlUSElYX1NIQURPV19QQVJFTlRgLCBhbmQgdmFsdWUgb2YgYHRoaXNgLiBAc291cmNlUmVmIF9zaGFkb3dNZXRhZGF0YUFzc2lnbm1lbnQ7IFRoaXMgYWxsb3dzIEBzZWUgZ2V0UGFyZW50Tm9kZTsgdG8gbGF0ZXIgZmluZCB0aGUgcGFyZW50IG9mIHRoZSBzaGFkb3cuXG4gICAqICAgMy4gYHJldHVybiBzaGFkb3dgXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG9wdGlvbnNcbiAgICogICAgIGRhdGFUeXBlczogb2JqZWN0XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFtvcHRpb25zXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cjb3B0aW9ucykgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KVxuICAgKiBub3RlczpcbiAgICogICAtIFRoaXMgaXMganVzdCBhIHdyYXBwZXIgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KSB0aGF0IGV4ZWN1dGVzXG4gICAqICAgICBjdXN0b20gZnJhbWV3b3JrIGZ1bmN0aW9uYWxpdHkgYWZ0ZXIgdGhlIGBzdXBlcmAgY2FsbC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIFNoYWRvd1Jvb3Q7IFRoZSBTaGFkb3dSb290IGluc3RhbmNlIGNyZWF0ZWQgYnkgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpLlxuICAgKi9cbiAgYXR0YWNoU2hhZG93KG9wdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlbnZpcm9ubWVudCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiBzdXBlci5hdHRhY2hTaGFkb3cgIT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KG9wdGlvbnMpO1xuICAgIFV0aWxzLm1ldGFkYXRhKHNoYWRvdywgTVlUSElYX1NIQURPV19QQVJFTlQsIHRoaXMpOyAvLyBAcmVmOl9zaGFkb3dNZXRhZGF0YUFzc2lnbm1lbnRcblxuICAgIHJldHVybiBzaGFkb3c7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEEgc3R1YiBmb3IgZGV2ZWxvcGVycyB0byBjb250cm9sIHRoZSBTaGFkb3cgRE9NIG9mIHRoZSBjb21wb25lbnQuXG4gICAqXG4gICAqICAgQnkgZGVmYXVsdCwgdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgY2FsbCBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmF0dGFjaFNoYWRvdzsgaW4gYFwib3BlblwiYCBgbW9kZWAuXG4gICAqXG4gICAqICAgRGV2ZWxvcGVycyBjYW4gb3ZlcmxvYWQgdGhpcyB0byBkbyBub3RoaW5nIChoYXZlIG5vIFNoYWRvdyBET00gZm9yIGEgc3BlY2lmaWMgY29tcG9uZW50IGZvciBleGFtcGxlKSxcbiAgICogICBvciB0byBkbyBzb21ldGhpbmcgZWxzZSwgc3VjaCBhcyBzcGVjaWZ5IHRoZXkgd291bGQgbGlrZSB0aGVpciBjb21wb25lbnQgdG8gYmUgaW4gYFwiY2xvc2VkXCJgIGBtb2RlYC5cbiAgICpcbiAgICogICBUaGUgcmVzdWx0IG9mIHRoaXMgbWV0aG9kIGlzIGFzc2lnbmVkIHRvIGB0aGlzLnNoYWRvd2AgaW5zaWRlIHRoZSBgY29uc3RydWN0b3JgIG9mIHRoZSBjb21wb25lbnQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG9wdGlvbnNcbiAgICogICAgIGRhdGFUeXBlczogb2JqZWN0XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFtvcHRpb25zXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cjb3B0aW9ucykgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KVxuICAgKiBub3RlczpcbiAgICogICAtIEFsbCB0aGlzIGRvZXMgaXMgY2FsbCBgdGhpcy5hdHRhY2hTaGFkb3dgLiBJdHMgcHVycG9zZSBpcyBmb3IgdGhlIGRldmVsb3BlciB0byBjb250cm9sXG4gICAqICAgICB3aGF0IGhhcHBlbnMgd2l0aCB0aGUgY29tcG9uZW50J3MgU2hhZG93IERPTS5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIFNoYWRvd1Jvb3Q7IFRoZSBTaGFkb3dSb290IGluc3RhbmNlIGNyZWF0ZWQgYnkgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5hdHRhY2hTaGFkb3c7LlxuICAgKi9cbiAgY3JlYXRlU2hhZG93RE9NKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgICByZXR1cm4gRWxlbWVudHMubWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycyk7XG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZShuYW1lT3JJRCkge1xuICAgIGlmIChuYW1lT3JJRCBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICByZXR1cm4gbmFtZU9ySUQ7XG5cbiAgICBpZiAoIXRoaXMub3duZXJEb2N1bWVudClcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChuYW1lT3JJRClcbiAgICAgIHJldHVybiBFbGVtZW50cy5xdWVyeVRlbXBsYXRlKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCwgbmFtZU9ySUQpO1xuXG4gICAgaWYgKHRoaXMudGVtcGxhdGVJRClcbiAgICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlEKTtcblxuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldYCk7XG4gIH1cblxuICBhcHBlbmRFeHRlcm5hbFRvU2hhZG93RE9NKCkge1xuICAgIGlmICghdGhpcy5zaGFkb3cpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb3duZXJEb2N1bWVudCA9ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpO1xuICAgIGxldCBlbGVtZW50cyAgICAgID0gb3duZXJEb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZvcl0nKTtcblxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgQXJyYXkuZnJvbShlbGVtZW50cykpIHtcbiAgICAgIGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpO1xuICAgICAgaWYgKEJhc2VVdGlscy5pc05PRShzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2hlcyhzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvY2Vzc2VkVGVtcGxhdGUoX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZShfdGVtcGxhdGUpIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0aGlzLnByb2Nlc3NFbGVtZW50cygodGVtcGxhdGUuY29udGVudCkgPyB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSk7XG4gIH1cblxuICBnZXRSYXdUZW1wbGF0ZShfdGVtcGxhdGUpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKF90ZW1wbGF0ZSkgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUbyh0YXJnZXQsIF90ZW1wbGF0ZSkge1xuICAgIGlmICghdGFyZ2V0KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHByb2Nlc3NlZFRlbXBsYXRlID0gdGhpcy5nZXRQcm9jZXNzZWRUZW1wbGF0ZShfdGVtcGxhdGUpO1xuICAgIGlmIChwcm9jZXNzZWRUZW1wbGF0ZSkge1xuICAgICAgLy8gZW5zdXJlRG9jdW1lbnRTdHlsZXMuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSwgdGVtcGxhdGUpO1xuXG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocHJvY2Vzc2VkVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oX3RlbXBsYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVGVtcGxhdGVUbyh0aGlzLnNoYWRvdywgX3RlbXBsYXRlKTtcbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG5cbiAgICB0aGlzLmFwcGVuZEV4dGVybmFsVG9TaGFkb3dET00oKTtcbiAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oKTtcbiAgICB0aGlzLnByb2Nlc3NFbGVtZW50cyh0aGlzKTtcblxuICAgIHRoaXMubW91bnRlZCgpO1xuXG4gICAgdGhpcy5kb2N1bWVudEluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIEJhc2VVdGlscy5uZXh0VGljaygoKSA9PiB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51bm1vdW50ZWQoKTtcbiAgfVxuXG4gIGF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3U3JjKSB7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci51bm9ic2VydmUodGhpcyk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTcmMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb2JzZXJ2ZXIgPSB2aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgd2FzVmlzaWJsZSwgZGlzY29ubmVjdCB9KSA9PiB7XG4gICAgICBpZiAoIXdhc1Zpc2libGUpXG4gICAgICAgIHRoaXMuZmV0Y2hTcmModGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpKTtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfSwgeyBlbGVtZW50czogWyB0aGlzIF0gfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmlzaWJpbGl0eU9ic2VydmVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvYnNlcnZlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIGxldCBbXG4gICAgICBhdHRyaWJ1dGVOYW1lLFxuICAgICAgb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZSxcbiAgICBdID0gYXJncztcblxuICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIC8vIFNlY3VyaXR5OiBlbnN1cmUgdGhpcyBpcyBhY3R1YWxseSBhIGhhbmRsZWQgYXR0cmlidXRlIGNhbGwhXG4gICAgICAvLyBXZSB3b3VsZG4ndCBqdXN0IHdhbnQgdG8gc3RhcnQgc2V0dGluZyBhbnl0aGluZyBvbiB0aGUgaW5zdGFuY2VcbiAgICAgIC8vIHZpYSBhdHRyaWJ1dGVzLi4uIHRoYXQgbWlnaHQgYmUgYmFkLCBpLmU6IDxpbWcgdmFsdWVPZj1cIlwiPlxuXG4gICAgICBsZXQgcHJvcGVydHlOYW1lICAgID0gQmFzZVV0aWxzLnRvQ2FtZWxDYXNlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgbGV0IG1hZ2ljTmFtZSAgICAgICA9IGBhdHRyJCR7cHJvcGVydHlOYW1lfWA7XG4gICAgICBsZXQgeyBkZXNjcmlwdG9yIH0gID0gVXRpbHMuZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbih0aGlzLCBtYWdpY05hbWUpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgLy8gQ2FsbCBzZXR0ZXJcbiAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlQ2hhbmdlZCguLi5hcmdzKTtcbiAgfVxuXG4gIGFkb3B0ZWRDYWxsYmFjayguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRvcHRlZCguLi5hcmdzKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7fVxuICB1bm1vdW50ZWQoKSB7fVxuICBhdHRyaWJ1dGVDaGFuZ2VkKCkge31cbiAgYWRvcHRlZCgpIHt9XG5cbiAgZ2V0ICQkKCkge1xuICAgIHJldHVybiBVdGlscy5jcmVhdGVTY29wZSh0aGlzKTtcbiAgfVxuXG4gIHNlbGVjdCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICAgID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgICAgPSAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleCsrXSkgOiB7fTtcbiAgICBsZXQgcXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgeyByb290OiB0aGlzLCAuLi5vcHRpb25zLCBpbnZva2VDYWxsYmFja3M6IGZhbHNlIH0sIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgICBsZXQgc2hhZG93Tm9kZXM7XG5cbiAgICBvcHRpb25zID0gcXVlcnlFbmdpbmUuZ2V0T3B0aW9ucygpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hhZG93ICE9PSBmYWxzZSAmJiBvcHRpb25zLnNlbGVjdG9yICYmIG9wdGlvbnMucm9vdCA9PT0gdGhpcykge1xuICAgICAgc2hhZG93Tm9kZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBRdWVyeUVuZ2luZS5mcm9tLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICB7IHJvb3Q6IHRoaXMuc2hhZG93IH0sXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3RvcixcbiAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrLFxuICAgICAgICApLnZhbHVlcygpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc2hhZG93Tm9kZXMpXG4gICAgICBxdWVyeUVuZ2luZSA9IHF1ZXJ5RW5naW5lLmFkZChzaGFkb3dOb2Rlcyk7XG5cbiAgICBpZiAob3B0aW9ucy5zbG90dGVkICE9PSB0cnVlKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5zbG90dGVkKGZhbHNlKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjaykpO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBUaGlzIG1ldGhvZCB3aWxsIGR5bmFtaWNhbGx5IGJ1aWxkIGVsZW1lbnRzLCBvciByYXRoZXIsIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcywgdGhhdFxuICAgKiAgIGRlZmluZSBlbGVtZW50cyB0byBiZSBjcmVhdGVkIGxhdGVyLiBAc2VlIEVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMgYXJlIGp1c3QgdGhhdCwgYSBzaW1wbGVcbiAgICogICBzdHJ1Y3R1cmUgdGhhdCBkZWZpbmVzIHRoZSBuYW1lLCBhdHRyaWJ1dGVzLCBhbmQgY2hpbGRyZW4gb2YgYW55IGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqICAgV2hlbiB0aGVzZSBhcmUgaW5zZXJ0ZWQgaW50byBhIGRvY3VtZW50LCBlaXRoZXIgdGhyb3VnaCBhIEBzZWUgUXVlcnlFbmdpbmU7LCBvciBkaXJlY3RseSBieVxuICAgKiAgIGNhbGxpbmcgQHNlZSBFbGVtZW50RGVmaW5pdGlvbi5idWlsZDsgYmVmb3JlIGluc2VydCwgdGhleSBhcmUgb25seSBhdCB0aGlzIHBvaW50IGNvbnZlcnRlZFxuICAgKiAgIGludG8gcmVhbCBbRWxlbWVudHNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50KSBhbmQgaW5zZXJ0ZWRcbiAgICogICBpbnRvIHRoZSBzcGVjaWZpZWQgRE9NIChkb2N1bWVudCkgYXQgdGhlIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogY2FsbGJhY2tcbiAgICogICAgIGRhdGFUeXBlczogZnVuY3Rpb25cbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgQSBjYWxsYmFjayB0aGF0IGlzIGltbWVkaWF0ZWx5IGNhbGxlZCBhbmQgZXhwZWN0ZWQgdG8gcmV0dXJuIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcy5cbiAgICogICAgICAgVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIG9ubHkgdHdvIGFyZ3VtZW50cy4gVGhlIGZpcnN0IGFyZ3VtZW50cywgYGVsZW1lbnRzYCwgaXMgYVxuICAgKiAgICAgICBAc2VlIEVsZW1lbnRHZW5lcmF0b3I7IFByb3h5IGluc3RhbmNlLCB0aGF0IHdpbGwgcHJvcGVybHkgZ2VuZXJhdGUgYW55IGVsZW1lbnQgcmVxdWVzdGVkLiBUaGVcbiAgICogICAgICAgc2Vjb25kIGFyZ3VtZW50LCBgY29udGV4dGAsIGlzIHNpbXBseSBhbiBlbXB0eSBvYmplY3QgcHJvdmlkZWQgdG8gdGhlIGNhbGxiYWNrLCBhbGxvd2luZyB0aGVcbiAgICogICAgICAgZGV2ZWxvcGVyIHRvIHN0b3JlIGNvbnRleHR1YWwgYmFzZWQgaW5mb3JtYXRpb24gZm9yIHRoZSBvcGVyYXRpb24sIGlmIGRlc2lyZWQuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBFbGVtZW50RGVmaW5pdGlvbiB8IEFycmF5PEVsZW1lbnREZWZpbml0aW9uPjsgVGhlIEBzZWUgRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcyBkZWZpbmluZ1xuICAgKiAgIHRoZSBET00gdG8gZ2VuZXJhdGUgd2hlbiBpbnNlcnRlZC5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGlzIG1ldGhvZCBhbmQgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC4kYnVpbGQ7IG1ldGhvZCBpc1xuICAgKiAgICAgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBAc2VlIEVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMsIHdoZXJlYXMgdGhlXG4gICAqICAgICBAc2VlIE15dGhpeFVJQ29tcG9uZW50LiRidWlsZDsgbWV0aG9kIHdpbGwgcmV0dXJuIGEgQHNlZSBRdWVyeUVuZ2luZTsgaW5zdGFuY2UgY29udGFpbmluZ1xuICAgKiAgICAgYWxsIHRoZSBidWlsdCBAc2VlIEVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMuXG4gICAqL1xuICBidWlsZChjYWxsYmFjaykge1xuICAgIGxldCByZXN1bHQgPSBbIGNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwge30pIF0uZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiBpdGVtKCk7XG5cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogbmV3IEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uKCcjZnJhZ21lbnQnLCB7fSwgcmVzdWx0KTtcbiAgfVxuXG4gICRidWlsZChjYWxsYmFjaykge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgWyB0aGlzLmJ1aWxkKGNhbGxiYWNrKSBdLmZsYXQoSW5maW5pdHkpKTtcbiAgfVxuXG4gIGlzQXR0cmlidXRlVHJ1dGh5KG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKG5hbWUpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBCYXNlVXRpbHMudG9DYW1lbENhc2UodGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgfVxuXG4gIG1ldGFkYXRhKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gVXRpbHMubWV0YWRhdGEodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cblxuICBkeW5hbWljUHJvcChuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlciwgX2NvbnRleHQpIHtcbiAgICByZXR1cm4gVXRpbHMuZHluYW1pY1Byb3AuY2FsbChfY29udGV4dCB8fCB0aGlzLCBuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlcik7XG4gIH1cblxuICBkeW5hbWljRGF0YShvYmopIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgbGV0IGRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ICAgPSBrZXlzW2ldO1xuICAgICAgbGV0IHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgVXRpbHMuZHluYW1pY1Byb3AuY2FsbChkYXRhLCBrZXksIHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzZWxmLXJlc2V0dGluZyB0aW1lb3V0LiBUaGlzIG1ldGhvZCBleHBlY3RzIGFuIGBpZGAgYXJndW1lbnQgKG9yIHdpbGwgZ2VuZXJhdGUgb25lIGZyb20gdGhlIHByb3ZpZGVkXG4gICAqICAgY2FsbGJhY2sgbWV0aG9kIGlmIG5vdCBwcm92aWRlZCkuIEl0IHVzZXMgdGhpcyBwcm92aWRlZCBgaWRgIHRvIGNyZWF0ZSBhIHRpbWVvdXQuIFRoaXMgdGltZW91dCBoYXMgYSBzcGVjaWFsIGZlYXR1cmVcbiAgICogICBob3dldmVyIHRoYXQgZGlmZmVyZW50aWF0ZXMgaXQgZnJvbSBhIG5vcm1hbCBgc2V0VGltZW91dGAgY2FsbDogaWYgeW91IGNhbGwgYHRoaXMuZGVib3VuY2VgIGFnYWluIHdpdGggdGhlXG4gICAqICAgc2FtZSBgaWRgICoqYmVmb3JlKiogdGhlIHRpbWUgcnVucyBvdXQsIHRoZW4gaXQgd2lsbCBhdXRvbWF0aWNhbGx5IHJlc2V0IHRoZSB0aW1lci4gSW4gc2hvcnQsIG9ubHkgdGhlIGxhc3QgY2FsbFxuICAgKiAgIHRvIGB0aGlzLmRlYm91bmNlYCAoZ2l2ZW4gdGhlIHNhbWUgaWQpIHdpbGwgdGFrZSBlZmZlY3QgKHVubGVzcyB0aGUgc3BlY2lmaWVkIHRpbWVvdXQgaXMgcmVhY2hlZCBiZXR3ZWVuIGNhbGxzKS5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgVGhpcyBtZXRob2QgcmV0dXJucyBhIHNwZWNpYWxpemVkIFByb21pc2UgaW5zdGFuY2UuIFRoZSBpbnN0YW5jZSBpcyBzcGVjaWFsaXplZCBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllc1xuICAgKiAgIGFyZSBpbmplY3RlZCBpbnRvIGl0OlxuICAgKiAgIDEuIGByZXNvbHZlKHJlc3VsdFZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVzb2x2ZXMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAgICogICAyLiBgcmVqZWN0KGVycm9yVmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZWplY3RzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gICAqICAgMy4gYHN0YXR1cygpYCAtIFdoZW4gY2FsbGVkLCB3aWxsIHJldHVybiB0aGUgZnVsZmlsbG1lbnQgc3RhdHVzIG9mIHRoZSBwcm9taXNlLCBhcyBhIGBzdHJpbmdgLCBvbmUgb2Y6IGBcInBlbmRpbmdcIiwgXCJmdWxmaWxsZWRcImAsIG9yIGBcInJlamVjdGVkXCJgXG4gICAqICAgNC4gYGlkPHN0cmluZz5gIC0gQSByYW5kb21seSBnZW5lcmF0ZWQgSUQgZm9yIHRoaXMgcHJvbWlzZVxuICAgKlxuICAgKiAgIFNlZSBAc2VlIEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlO1xuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiB0aGUgdGltZW91dCBoYXMgYmVlbiBtZXQuXG4gICAqICAgLSBuYW1lOiB0aW1lTVNcbiAgICogICAgIGRhdGFUeXBlczogbnVtYmVyXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGVmYXVsdDogMFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2AuXG4gICAqICAgLSBuYW1lOiBpZFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZWZhdWx0OiBcIm51bGxcIlxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgaWRlbnRpZmllciBmb3IgdGhpcyBkZWJvdW5jZSB0aW1lci4gSWYgbm90IHByb3ZpZGVkLCB0aGVuIG9uZVxuICAgKiAgICAgICB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgeW91IGJhc2VkIG9uIHRoZSBwcm92aWRlZCBjYWxsYmFjay5cbiAgICogbm90ZXM6XG4gICAqICAgLSBUaG91Z2ggbm90IHJlcXVpcmVkLCBpdCBpcyBmYXN0ZXIgYW5kIGxlc3MgcHJvYmxlbWF0aWMgdG8gcHJvdmlkZSB5b3VyIG93biBgaWRgIGFyZ3VtZW50XG4gICAqL1xuICBkZWJvdW5jZShjYWxsYmFjaywgdGltZU1TLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lTVMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsZWFyRGVib3VuY2UoaWQpIHtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAoIXByb21pc2UpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG5cbiAgICB0aGlzLmRlbGF5VGltZXJzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBjbGFzc2VzKC4uLl9hcmdzKSB7XG4gICAgbGV0IGFyZ3MgPSBfYXJncy5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKVxuICAgICAgICByZXR1cm4gaXRlbS50cmltKCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYyhzcmNVUkwpIHtcbiAgICBpZiAoIXNyY1VSTClcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBsb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwodGhpcywgc3JjVVJMKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmNVUkx9IChyZXNvbHZlZCB0bzogJHtlcnJvci51cmx9KWAsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElkZW50aWZpZXIodGFyZ2V0KSB7XG4gIGlmICghdGFyZ2V0KVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAodHlwZW9mIHRhcmdldC5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0YXJnZXQuZ2V0SWRlbnRpZmllci5jYWxsKHRhcmdldCk7XG5cbiAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IEJhc2VVdGlscy50b0NhbWVsQ2FzZSh0YXJnZXQubG9jYWxOYW1lKTtcblxuICByZXR1cm4gJ3VuZGVmaW5lZCc7XG59XG5cbi8vIGZ1bmN0aW9uIGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spIHtcbi8vICAgaWYgKCFydWxlLnNlbGVjdG9yVGV4dClcbi8vICAgICByZXR1cm4gcnVsZS5jc3NUZXh0O1xuXG4vLyAgIGxldCBfYm9keSAgID0gcnVsZS5jc3NUZXh0LnN1YnN0cmluZyhydWxlLnNlbGVjdG9yVGV4dC5sZW5ndGgpLnRyaW0oKTtcbi8vICAgbGV0IHJlc3VsdCAgPSAoY2FsbGJhY2socnVsZS5zZWxlY3RvclRleHQsIF9ib2R5KSB8fCBbXSkuZmlsdGVyKEJvb2xlYW4pO1xuLy8gICBpZiAoIXJlc3VsdClcbi8vICAgICByZXR1cm4gJyc7XG5cbi8vICAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGNzc1J1bGVzVG9Tb3VyY2UoY3NzUnVsZXMsIGNhbGxiYWNrKSB7XG4vLyAgIHJldHVybiBBcnJheS5mcm9tKGNzc1J1bGVzIHx8IFtdKS5tYXAoKHJ1bGUpID0+IHtcbi8vICAgICBsZXQgcnVsZVN0ciA9IGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spO1xuLy8gICAgIHJldHVybiBgJHtjc3NSdWxlc1RvU291cmNlKHJ1bGUuY3NzUnVsZXMsIGNhbGxiYWNrKX0ke3J1bGVTdHJ9YDtcbi8vICAgfSkuam9pbignXFxuXFxuJyk7XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGVsZW1lbnROYW1lLCBzdHlsZUVsZW1lbnQpIHtcbi8vICAgY29uc3QgaGFuZGxlSG9zdCA9IChtLCB0eXBlLCBfY29udGVudCkgPT4ge1xuLy8gICAgIGxldCBjb250ZW50ID0gKCFfY29udGVudCkgPyBfY29udGVudCA6IF9jb250ZW50LnJlcGxhY2UoL15cXCgvLCAnJykucmVwbGFjZSgvXFwpJC8sICcnKTtcblxuLy8gICAgIGlmICh0eXBlID09PSAnOmhvc3QnKSB7XG4vLyAgICAgICBpZiAoIWNvbnRlbnQpXG4vLyAgICAgICAgIHJldHVybiBlbGVtZW50TmFtZTtcblxuLy8gICAgICAgLy8gRWxlbWVudCBzZWxlY3Rvcj9cbi8vICAgICAgIGlmICgoL15bYS16QS1aX10vKS50ZXN0KGNvbnRlbnQpKVxuLy8gICAgICAgICByZXR1cm4gYCR7Y29udGVudH1bZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbi8vICAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbi8vICAgICB9XG4vLyAgIH07XG5cbi8vICAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4vLyAgICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuLy8gICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbi8vICAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3Rvcjtcbi8vICAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4vLyAgICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4vLyAgICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuLy8gICAgICAgICB0YWdzLnB1c2gobSk7XG4vLyAgICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4vLyAgICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbi8vICAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuLy8gICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4vLyAgICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuLy8gICAgICAgICByZXR1cm47XG5cbi8vICAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuLy8gICAgIH0sXG4vLyAgICk7XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVEb2N1bWVudFN0eWxlcyhvd25lckRvY3VtZW50LCBjb21wb25lbnROYW1lLCB0ZW1wbGF0ZSkge1xuLy8gICBsZXQgb2JqSUQgICAgICAgICAgICAgPSBCYXNlVXRpbHMuZ2V0T2JqZWN0SUQodGVtcGxhdGUpO1xuLy8gICBsZXQgdGVtcGxhdGVJRCAgICAgICAgPSBCYXNlVXRpbHMuU0hBMjU2KG9iaklEKTtcbi8vICAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuLy8gICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4vLyAgIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuLy8gICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbi8vICAgICAgIGNvbnRpbnVlO1xuXG4vLyAgICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbi8vICAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbi8vICAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbi8vICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4vLyAgICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4vLyAgICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuLy8gICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbi8vICAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4vLyAgICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuLy8gICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbi8vICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVVUkwocm9vdExvY2F0aW9uLCBfdXJsaXNoKSB7XG4gIGxldCB1cmxpc2ggPSBfdXJsaXNoO1xuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgVVJMKVxuICAgIHVybGlzaCA9IHVybGlzaC50b1N0cmluZygpO1xuXG4gIGlmICghdXJsaXNoKVxuICAgIHVybGlzaCA9ICcnO1xuXG4gIGlmICghQmFzZVV0aWxzLmlzVHlwZSh1cmxpc2gsICc6OlN0cmluZycpKVxuICAgIHJldHVybjtcblxuICBsZXQgdXJsID0gbmV3IFVSTCh1cmxpc2gsIG5ldyBVUkwocm9vdExvY2F0aW9uKSk7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBmaWxlTmFtZSAgPSAnJztcbiAgICBsZXQgcGF0aCAgICAgID0gJy8nO1xuXG4gICAgdXJsLnBhdGhuYW1lLnJlcGxhY2UoL14oLipcXC8pKFteL10rKSQvLCAobSwgZmlyc3QsIHNlY29uZCkgPT4ge1xuICAgICAgcGF0aCA9IGZpcnN0LnJlcGxhY2UoL1xcLyskLywgJy8nKTtcbiAgICAgIGlmIChwYXRoLmNoYXJBdChwYXRoLmxlbmd0aCAtIDEpICE9PSAnLycpXG4gICAgICAgIHBhdGggPSBgJHtwYXRofS9gO1xuXG4gICAgICBmaWxlTmFtZSA9IHNlY29uZDtcbiAgICAgIHJldHVybiBtO1xuICAgIH0pO1xuXG4gICAgbGV0IG5ld1NyYyA9IGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIuY2FsbCh0aGlzLCB7IHNyYzogdXJsaXNoLCB1cmwsIHBhdGgsIGZpbGVOYW1lIH0pO1xuICAgIGlmIChuZXdTcmMgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXJlcXVpcmVcIjogTm90IGxvYWRpbmcgXCIke3VybGlzaH1cIiBiZWNhdXNlIHRoZSBnbG9iYWwgXCJteXRoaXhVSS51cmxSZXNvbHZlclwiIHJlcXVlc3RlZCBJIG5vdCBkbyBzby5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmV3U3JjICYmIChuZXdTcmMudG9TdHJpbmcoKSAhPT0gdXJsLnRvU3RyaW5nKCkgJiYgbmV3U3JjLnRvU3RyaW5nKCkgIT09IHVybGlzaCkpXG4gICAgICB1cmwgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgcm9vdExvY2F0aW9uLCBuZXdTcmMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgICA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IElTX1NDUklQVCAgICAgICAgICAgPSAvXihzY3JpcHQpJC9pO1xuY29uc3QgUkVRVUlSRV9DQUNIRSAgICAgICA9IG5ldyBNYXAoKTtcbmNvbnN0IFJFU09MVkVfU1JDX0VMRU1FTlQgPSAvXnNjcmlwdHxsaW5rfHN0eWxlfG15dGhpeC1sYW5ndWFnZS1wYWNrfG15dGhpeC1yZXF1aXJlJC9pO1xuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZShvd25lckRvY3VtZW50LCBsb2NhdGlvbiwgX3VybCwgc291cmNlU3RyaW5nLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB1cmwgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgbG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgZ3Vlc3NlZEVsZW1lbnROYW1lLFxuICAgIGNoaWxkcmVuLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdGVtcGxhdGUsXG4gICAgdXJsLFxuICAgIGJhc2VVUkwsXG4gICAgZmlsZU5hbWUsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnByZVByb2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0ZW1wbGF0ZSA9IGNvbnRleHQudGVtcGxhdGUgPSBvcHRpb25zLnByZVByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICBsZXQgbm9kZUhhbmRsZXIgICA9IG9wdGlvbnMubm9kZUhhbmRsZXI7XG4gIGxldCB0ZW1wbGF0ZUNvdW50ID0gY2hpbGRyZW4ucmVkdWNlKChzdW0sIGVsZW1lbnQpID0+ICgoSVNfVEVNUExBVEUudGVzdChlbGVtZW50LnRhZ05hbWUpKSA/IChzdW0gKyAxKSA6IHN1bSksIDApO1xuXG4gIGNvbnRleHQudGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnQ7XG5cbiAgY29uc3QgcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYmFzZVVSTCkgPT4ge1xuICAgIC8vIFJlc29sdmUgXCJzcmNcIiBhdHRyaWJ1dGUsIHNpbmNlIHdlIGFyZVxuICAgIC8vIGdvaW5nIHRvIGJlIG1vdmluZyB0aGUgZWxlbWVudCBhcm91bmRcbiAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmIChzcmMpIHtcbiAgICAgIHNyYyA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH07XG5cbiAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICBpZiAob3B0aW9ucy5tYWdpYyAmJiBSRVNPTFZFX1NSQ19FTEVNRU5ULnRlc3QoY2hpbGQubG9jYWxOYW1lKSlcbiAgICAgIGNoaWxkID0gcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUoY2hpbGQsIGJhc2VVUkwpO1xuXG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgaWYgKHRlbXBsYXRlQ291bnQgPT09IDEgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpID09IG51bGwgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke3VybH06IDx0ZW1wbGF0ZT4gaXMgbWlzc2luZyBhIFwiZGF0YS1mb3JcIiBhdHRyaWJ1dGUsIGxpbmtpbmcgaXQgdG8gaXRzIG93bmVyIGNvbXBvbmVudC4gR3Vlc3NpbmcgXCIke2d1ZXNzZWRFbGVtZW50TmFtZX1cIi5gKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWZvcicsIGd1ZXNzZWRFbGVtZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1RlbXBsYXRlOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgfHwgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpKTtcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWZvcj1cIiR7ZWxlbWVudE5hbWV9XCIgaV0sW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIiBpXWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoSVNfU0NSSVBULnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHNjcmlwdD5cbiAgICAgIGxldCBjaGlsZENsb25lID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBjaGlsZC5nZXRBdHRyaWJ1dGVOYW1lcygpKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnc3JjJylcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBjaGlsZC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpO1xuICAgICAgfVxuXG4gICAgICBsZXQgc3JjID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgc3JjID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGJhc2VVUkwsIHNyYywgZmFsc2UpO1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG4gICAgICAgIGNoaWxkQ2xvbmUuaW5uZXJIVE1MID0gY2hpbGQudGV4dENvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZENsb25lLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHNjcmlwdElEID0gYElEJHtCYXNlVXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtzcmMgfHwgY2hpbGRDbG9uZS5pbm5lckhUTUx9YCl9YDtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHNjcmlwdElEKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHQjJHtzY3JpcHRJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkQ2xvbmUpO1xuICAgIH0gZWxzZSBpZiAoKC9eKGxpbmt8c3R5bGUpJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxsaW5rPiAmIDxzdHlsZT5cbiAgICAgIGxldCBpc1N0eWxlID0gKC9ec3R5bGUkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSk7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNTdHlsZSwgaXNMaW5rOiAhaXNTdHlsZSwgaXNIYW5kbGVkOiB0cnVlIH0pID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBpZCA9IGBJRCR7QmFzZVV0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxtZXRhPlxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc01ldGE6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KTtcblxuICAgICAgLy8gZG8gbm90aGluZyB3aXRoIHRoZXNlIHRhZ3NcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7IC8vIEV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgbGV0IGlzSGFuZGxlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICAgIGxldCBsYW5nUGFja0lEID0gYElEJHtCYXNlVXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZC5vdXRlckhUTUx9YCl9YDtcbiAgICAgICAgaWYgKCFjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGxhbmdQYWNrSUQpO1xuXG4gICAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcblxuICAgICAgICBpZiAobGFuZ3VhZ2VQcm92aWRlcikge1xuICAgICAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlci5xdWVyeVNlbGVjdG9yKGBteXRoaXgtbGFuZ3VhZ2UtcGFjayMke2xhbmdQYWNrSUR9YCkpXG4gICAgICAgICAgICBsYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZShjaGlsZCwgbGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKTtcblxuICAgICAgICAgIGlzSGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH0gLy8gZWxzZSBkbyBub3RoaW5nLi4uIGxldCBpdCBiZSBkdW1wZWQgaW50byB0aGUgZG9tIGxhdGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wb3N0UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucG9zdFByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUodXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgdXJsT3JOYW1lLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGNhY2hlS2V5O1xuXG4gIGlmICghKC9eKGZhbHNlfG5vLXN0b3JlfHJlbG9hZHxuby1jYWNoZSkkLykudGVzdCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGUnKSkpIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlUGFyYW1zJykgIT09ICd0cnVlJykge1xuICAgICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZWRSZXNwb25zZSA9IFJFUVVJUkVfQ0FDSEUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICBpZiAoY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UgJiYgY2FjaGVkUmVzcG9uc2UucmVzcG9uc2Uub2spXG4gICAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgICB9XG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGdsb2JhbFRoaXMuZmV0Y2godXJsLCBvcHRpb25zLmZldGNoT3B0aW9ucykudGhlbihcbiAgICBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgcmVzcG9uc2UudGV4dCA9IGFzeW5jICgpID0+IGJvZHk7XG4gICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiBmYWxzZSB9O1xuICAgIH0sXG4gICAgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmcm9tIE15dGhpeCBVSSBcInJlcXVpcmVcIjogJywgZXJyb3IpO1xuXG4gICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgc3JjLFxuICAgIHtcbiAgICAgIG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgbGV0IHNjb3BlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIHVybC5zZWFyY2hQYXJhbXMuZW50cmllcygpKVxuICAgIHNjb3BlRGF0YVtrZXldID0gQmFzZVV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSkge1xuICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMuY2FsbChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFV0aWxzLmNyZWF0ZVNjb3BlKHNjb3BlRGF0YSwgb3B0aW9ucy5zY29wZSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2liaWxpdHlPYnNlcnZlcihjYWxsYmFjaywgX29wdGlvbnMpIHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVudHJpZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVudHJ5ICAgPSBlbnRyaWVzW2ldO1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbnRyeS50YXJnZXQ7XG4gICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gICAgICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsIGVsZW1lbnRPYnNlcnZlcnMpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0geyB3YXNWaXNpYmxlOiBmYWxzZSwgcmF0aW9WaXNpYmxlOiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB9O1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzLnNldChvYnNlcnZlciwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IGRhdGEucmF0aW9WaXNpYmxlKVxuICAgICAgICBkYXRhLnJhdGlvVmlzaWJsZSA9IGVudHJ5LmludGVyc2VjdGlvblJhdGlvO1xuXG4gICAgICBkYXRhLnByZXZpb3VzVmlzaWJpbGl0eSA9IChkYXRhLnZpc2liaWxpdHkgPT09IHVuZGVmaW5lZCkgPyBkYXRhLnZpc2liaWxpdHkgOiBkYXRhLnZpc2liaWxpdHk7XG4gICAgICBkYXRhLnZpc2liaWxpdHkgPSAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjApO1xuXG4gICAgICBjYWxsYmFjayh7IC4uLmRhdGEsIGVudHJ5LCBlbGVtZW50LCBpbmRleDogaSwgZGlzY29ubmVjdDogKCkgPT4gb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpIH0pO1xuXG4gICAgICBpZiAoZGF0YS52aXNpYmlsaXR5ICYmICFkYXRhLndhc1Zpc2libGUpXG4gICAgICAgIGRhdGEud2FzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBvcHRpb25zID0ge1xuICAgIHJvb3Q6ICAgICAgIG51bGwsXG4gICAgdGhyZXNob2xkOiAgMC4wLFxuICAgIC4uLihfb3B0aW9ucyB8fCB7fSksXG4gIH07XG5cbiAgbGV0IG9ic2VydmVyICA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpbnRlcnNlY3Rpb25DYWxsYmFjaywgb3B0aW9ucyk7XG4gIGxldCBlbGVtZW50cyAgPSAoX29wdGlvbnMgfHwge30pLmVsZW1lbnRzIHx8IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50c1tpXSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5jb25zdCBOT19PQlNFUlZFUiA9IE9iamVjdC5mcmVlemUoe1xuICB3YXNWaXNpYmxlOiAgICAgICAgIGZhbHNlLFxuICByYXRpb1Zpc2libGU6ICAgICAgIDAuMCxcbiAgdmlzaWJpbGl0eTogICAgICAgICBmYWxzZSxcbiAgcHJldmlvdXNWaXNpYmlsaXR5OiBmYWxzZSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eU1ldGEoZWxlbWVudCwgb2JzZXJ2ZXIpIHtcbiAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gIGlmICghZWxlbWVudE9ic2VydmVycylcbiAgICByZXR1cm4gTk9fT0JTRVJWRVI7XG5cbiAgcmV0dXJuIGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKSB8fCBOT19PQlNFUlZFUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhcmdlc3REb2N1bWVudFRhYkluZGV4KG93bmVyRG9jdW1lbnQpIHtcbiAgbGV0IGxhcmdlc3QgPSAtSW5maW5pdHk7XG5cbiAgQXJyYXkuZnJvbSgob3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgbGV0IHRhYkluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JyksIDEwKTtcbiAgICBpZiAoIWlzRmluaXRlKHRhYkluZGV4KSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0YWJJbmRleCA+IGxhcmdlc3QpXG4gICAgICBsYXJnZXN0ID0gdGFiSW5kZXg7XG4gIH0pO1xuXG4gIHJldHVybiAobGFyZ2VzdCA8IDApID8gMCA6IGxhcmdlc3Q7XG59XG4iLCIvKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29uc3RhbnRzXG4gKiBncm91cE5hbWU6IENvbnN0YW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBhZ2FpbnN0IGVsZW1lbnRzIHdpdGggYSBgZGF0YS1zcmNgIGF0dHJpYnV0ZS5cbiAqICAgICAgIEZvciBlbGVtZW50cyB3aXRoIHRoaXMgYXR0cmlidXRlLCBzZXQgYW4gW2ludGVyc2VjdGlvbiBvYnNlcnZlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbl9PYnNlcnZlcl9BUEkpIGlzIHNldHVwLlxuICogICAgICAgV2hlbiB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIHJlcG9ydHMgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCB0aGVuIHRoZSBVUkwgc3BlY2lmaWVkIGJ5IGBkYXRhLXNyY2AgaXMgZmV0Y2hlZCwgYW5kIGR1bXBlZCBpbnRvXG4gKiAgICAgICB0aGUgZWxlbWVudCBhcyBpdHMgY2hpbGRyZW4uIFRoaXMgYWxsb3dzIGZvciBkeW5hbWljIFwicGFydGlhbHNcIiB0aGF0IGFyZSBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogICAgICAgVGhlIHZhbHVlIHN0b3JlZCBhdCB0aGlzIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBpcyBhIE1hcCBvZiBbaW50ZXJzZWN0aW9uIG9ic2VydmVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpXG4gKiAgICAgICBpbnN0YW5jZXMuIFRoZSBrZXlzIG9mIHRoaXMgbWFwIGFyZSB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVycyB0aGVtc2VsdmVzLiBUaGUgdmFsdWVzIGFyZSByYXcgb2JqZWN0cyB3aXRoIHRoZSBzaGFwZVxuICogICAgICAgYHsgd2FzVmlzaWJsZTogYm9vbGVhbiwgcmF0aW9WaXNpYmxlOiBmbG9hdCwgcHJldmlvdXNWaXNpYmlsaXR5OiBib29sZWFuLCB2aXNpYmlsaXR5OiBib29sZWFuIH1gLlxuICogICAtIG5hbWU6IE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgVXRpbHMuZ2xvYmFsU3RvcmVOYW1lVmFsdWVQYWlySGVscGVyO1xuICogICAgICAgdG8gc3RvcmUga2V5L3ZhbHVlIHBhaXJzIGZvciBhIHNpbmdsZSB2YWx1ZS5cbiAqXG4gKiAgICAgICBNeXRoaXggVUkgaGFzIGdsb2JhbCBzdG9yZSBhbmQgZmV0Y2ggaGVscGVycyBmb3Igc2V0dGluZyBhbmQgZmV0Y2hpbmcgZHluYW1pYyBwcm9wZXJ0aWVzLiBUaGVzZVxuICogICAgICAgbWV0aG9kcyBvbmx5IGFjY2VwdCBhIHNpbmdsZSB2YWx1ZSBieSBkZXNpZ24uLi4gYnV0IHNvbWV0aW1lcyBpdCBpcyBkZXNpcmVkIHRoYXQgYSB2YWx1ZSBiZSBzZXRcbiAqICAgICAgIHdpdGggYSBzcGVjaWZpYyBrZXkgaW5zdGVhZC4gVGhpcyBgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJgIHByb3BlcnR5IGFzc2lzdHMgd2l0aCB0aGlzIHByb2Nlc3MsXG4gKiAgICAgICBhbGxvd2luZyBnbG9iYWwgaGVscGVycyB0byBzdGlsbCBmdW5jdGlvbiB3aXRoIGEgc2luZ2xlIHZhbHVlIHNldCwgd2hpbGUgaW4gc29tZSBjYXNlcyBzdGlsbCBwYXNzaW5nXG4gKiAgICAgICBhIGtleSB0aHJvdWdoIHRvIHRoZSBzZXR0ZXIuIEBzb3VyY2VSZWYgX215dGhpeE5hbWVWYWx1ZVBhaXJIZWxwZXJVc2FnZTtcbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgLSBuYW1lOiBNWVRISVhfU0hBRE9XX1BBUkVOVFxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgYXMgYSBAc2VlIFV0aWxzLm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBieSBAc2VlIE15dGhpeFVJQ29tcG9uZW50OyB0b1xuICogICAgICAgc3RvcmUgdGhlIHBhcmVudCBub2RlIG9mIGEgU2hhZG93IERPTSwgc28gdGhhdCBpdCBjYW4gbGF0ZXIgYmUgdHJhdmVyc2VkIGJ5IEBzZWUgVXRpbHMuZ2V0UGFyZW50Tm9kZTsuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOndhcm5pbmc6IFVzZSBhdCB5b3VyIG93biByaXNrLiBUaGlzIGlzIE15dGhpeCBVSSBpbnRlcm5hbCBjb2RlIHRoYXQgbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgLSBuYW1lOiBNWVRISVhfVFlQRVxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHVzZWQgZm9yIHR5cGUgY2hlY2tpbmcgYnkgYGluc3RhbmNlb2ZgIGNoZWNrcyB0byBkZXRlcm1pbmUgaWYgYW4gaW5zdGFuY2VcbiAqICAgICAgIGlzIGEgc3BlY2lmaWMgdHlwZSAoZXZlbiBhY3Jvc3MgamF2YXNjcmlwdCBjb250ZXh0cyBhbmQgbGlicmFyeSB2ZXJzaW9ucykuIEBzb3VyY2VSZWYgX215dGhpeFR5cGVFeGFtcGxlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKiAgIC0gbmFtZTogRFlOQU1JQ19QUk9QRVJUWV9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFVzZWQgZm9yIHJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGFnYWluc3QgQHNlZSBVdGlscy5EeW5hbWljUHJvcGVydHk7LlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgRHluYW1pY1Byb3BlcnR5Oy5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9UWVBFOy5cbiAqL1xuXG4vLyBCYXNlXG5leHBvcnQgY29uc3QgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL25hbWUtdmFsdWUtcGFpci1oZWxwZXInKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbmV4cG9ydCBjb25zdCBNWVRISVhfU0hBRE9XX1BBUkVOVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvc2hhZG93LXBhcmVudCcpOyAvLyBAcmVmOkNvbnN0YW50cy5NWVRISVhfU0hBRE9XX1BBUkVOVFxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9UWVBFICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9lbGVtZW50LWRlZmluaXRpb24nKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX1RZUEVcbmV4cG9ydCBjb25zdCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2ludGVyc2VjdGlvbi1vYnNlcnZlcnMnKTsgLy8gQHJlZjpDb25zdGFudHMuTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbmV4cG9ydCBjb25zdCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2RvY3VtZW50LWluaXRpYWxpemVkJyk7IC8vIEByZWY6Q29uc3RhbnRzLk1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRFxuXG4vLyBEeW5hbWljUHJvcGVydHlcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy92YWx1ZScpO1xuZXhwb3J0IGNvbnN0IERZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElORyAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL2lzLXNldHRpbmcnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1NFVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9zZXQnKTtcblxuLy8gVHlwZXNcbmV4cG9ydCBjb25zdCBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RWxlbWVudERlZmluaXRpb24nKTtcbmV4cG9ydCBjb25zdCBRVUVSWV9FTkdJTkVfVFlQRSAgICAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6UXVlcnlFbmdpbmUnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX1RZUEUgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6RHluYW1pY1Byb3BlcnR5Jyk7IC8vIEByZWY6Q29uc3RhbnRzLkRZTkFNSUNfUFJPUEVSVFlfVFlQRVxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpNeXRoaXhVSUNvbXBvbmVudCcpO1xuXG4vLyBFbGVtZW50c1xuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy91bmZpbmlzaGVkJyk7XG5cblxuIiwiaW1wb3J0IHtcbiAgRFlOQU1JQ19QUk9QRVJUWV9UWVBFLFxuICBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFLFxuICBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcsXG4gIERZTkFNSUNfUFJPUEVSVFlfU0VULFxuICBNWVRISVhfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIGBEeW5hbWljUHJvcGVydHlgIGlzIGEgc2ltcGxlIHZhbHVlIHN0b3JhZ2UgY2xhc3Mgd3JhcHBlZCBpbiBhIFByb3h5LlxuICpcbiAqICAgIEl0IHdpbGwgYWxsb3cgdGhlIHVzZXIgdG8gc3RvcmUgYW55IGRlc2lyZWQgdmFsdWUuIFRoZSBjYXRjaCBob3dldmVyIGlzIHRoYXRcbiAqICAgIGFueSB2YWx1ZSBzdG9yZWQgY2FuIG9ubHkgYmUgc2V0IHRocm91Z2ggaXRzIHNwZWNpYWwgYHNldGAgbWV0aG9kLlxuICpcbiAqICAgIFRoaXMgd2lsbCBhbGxvdyBhbnkgbGlzdGVuZXJzIHRvIHJlY2VpdmUgdGhlIGAndXBkYXRlJ2AgZXZlbnQgd2hlbiBhIHZhbHVlIGlzIHNldC5cbiAqXG4gKiAgICBTaW5jZSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZXMgYXJlIGFsc28gYWx3YXlzIHdyYXBwZWQgaW4gYSBQcm94eSwgdGhlIHVzZXIgbWF5XG4gKiAgICBcImRpcmVjdGx5XCIgYWNjZXNzIGF0dHJpYnV0ZXMgb2YgdGhlIHN0b3JlZCB2YWx1ZS4gRm9yIGV4YW1wbGUsIGlmIGEgYER5bmFtaWNQcm9wZXJ0eWBcbiAqICAgIGlzIHN0b3JpbmcgYW4gQXJyYXkgaW5zdGFuY2UsIHRoZW4gb25lIHdvdWxkIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBgLmxlbmd0aGAgcHJvcGVydHlcbiAqICAgIFwiZGlyZWN0bHlcIiwgaS5lLiBgZHluYW1pY1Byb3AubGVuZ3RoYC5cbiAqXG4gKiAgICBgRHluYW1pY1Byb3BlcnR5YCBoYXMgYSBzcGVjaWFsIGBzZXRgIG1ldGhvZCwgd2hvc2UgbmFtZSBpcyBhIGBzeW1ib2xgLCB0byBhdm9pZCBjb25mbGljdGluZ1xuICogICAgbmFtZXNwYWNlcyB3aXRoIHRoZSB1bmRlcmx5aW5nIGRhdGF0eXBlIChhbmQgdGhlIHdyYXBwaW5nIFByb3h5KS5cbiAqICAgIFRvIHNldCBhIHZhbHVlIG9uIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIG9uZSBtdXN0IGRvIHNvIGFzIGZvbGxvd3M6IGBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0obXlOZXdWYWx1ZSlgLlxuICogICAgVGhpcyB3aWxsIHVwZGF0ZSB0aGUgaW50ZXJuYWwgdmFsdWUsIGFuZCBpZiB0aGUgc2V0IHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgc3RvcmVkIHZhbHVlLCB0aGUgYCd1cGRhdGUnYCBldmVudCB3aWxsIGJlIGRpc3BhdGNoZWQgdG9cbiAqICAgIGFueSBsaXN0ZW5lcnMuXG4gKlxuICogICAgQXMgYER5bmFtaWNQcm9wZXJ0eWAgaXMgYW4gW0V2ZW50VGFyZ2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRXZlbnRUYXJnZXQvRXZlbnRUYXJnZXQpLCBvbmUgY2FuIGF0dGFjaFxuICogICAgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBgJ3VwZGF0ZSdgIGV2ZW50IHRvIGxpc3RlbiBmb3IgdXBkYXRlcyB0byB0aGUgdW5kZXJseWluZyB2YWx1ZS4gVGhlIGAndXBkYXRlJ2AgZXZlbnQgaXMgdGhlIG9ubHkgZXZlbnQgdGhhdCBpc1xuICogICAgZXZlciB0cmlnZ2VyZWQgYnkgdGhpcyBjbGFzcy4gVGhlIHJlY2VpdmVkIGBldmVudGAgaW5zdGFuY2UgaW4gZXZlbnQgY2FsbGJhY2tzIHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKiAgICAxLiBgdXBkYXRlRXZlbnQub3JpZ2luYXRvciA9IHRoaXM7YCAtIGBvcmlnaW5hdG9yYCBpcyB0aGUgaW5zdGFuY2Ugb2YgdGhlIGBEeW5hbWljUHJvcGVydHlgIHdoZXJlIHRoZSBldmVudCBvcmlnaW5hdGVkIGZyb20uXG4gKiAgICAyLiBgdXBkYXRlRXZlbnQub2xkVmFsdWUgPSBjdXJyZW50VmFsdWU7YCAtIGBvbGRWYWx1ZWAgY29udGFpbnMgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgRHluYW1pY1Byb3BlcnR5YCBiZWZvcmUgc2V0LlxuICogICAgMy4gYHVwZGF0ZUV2ZW50LnZhbHVlID0gbmV3VmFsdWU7YCAtIGB2YWx1ZWAgY29udGFpbnMgdGhlIGN1cnJlbnQgdmFsdWUgYmVpbmcgc2V0IG9uIHRoZSBgRHluYW1pY1Byb3BlcnR5YC5cbiAqXG4gKiAgICBUbyByZXRyaWV2ZSB0aGUgdW5kZXJseWluZyByYXcgdmFsdWUgb2YgYSBgRHluYW1pY1Byb3BlcnR5YCwgb25lIG1heSBjYWxsIGB2YWx1ZU9mKClgOiBgbGV0IHJhd1ZhbHVlID0gZHluYW1pY1Byb3BlcnR5LnZhbHVlT2YoKTtgXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlcyB3aWxsIGludGVybmFsbHkgdHJhY2sgd2hlbiBhIGBzZXRgIG9wZXJhdGlvbiBpcyB1bmRlcndheSwgdG8gcHJldmVudFxuICogICAgIGN5Y2xpYyBzZXRzIGFuZCBtYXhpbXVtIGNhbGwgc3RhY2sgZXJyb3JzLiBZb3UgYXJlIGFsbG93ZWQgdG8gc2V0IHRoZSB2YWx1ZSByZWN1cnNpdmVseSwgaG93ZXZlciBgdXBkYXRlYCBldmVudHNcbiAqICAgICB3aWxsIG9ubHkgYmUgZGlzcGF0Y2hlZCBmb3IgdGhlIGZpcnN0IGBzZXRgIGNhbGwuIEFueSBgc2V0YCBvcGVyYXRpb24gdGhhdCBoYXBwZW5zIHdoaWxlIGFub3RoZXIgYHNldGAgb3BlcmF0aW9uIGlzXG4gKiAgICAgdW5kZXJ3YXkgd2lsbCAqKm5vdCoqIGRpc3BhdGNoIGFueSBgJ3VwZGF0ZSdgIGV2ZW50cy5cbiAqICAgLSB8XG4gKiAgICAgYCd1cGRhdGUnYCBldmVudHMgd2lsbCBiZSBkaXNwYXRjaGVkIGltbWVkaWF0ZWx5ICphZnRlciogdGhlIGludGVybmFsIHVuZGVybHlpbmcgc3RvcmVkIHZhbHVlIGlzIHVwZGF0ZWQuIFRob3VnaCBpdCBpc1xuICogICAgIHBvc3NpYmxlIHRvIGBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25gIGluIGFuIGV2ZW50IGNhbGxiYWNrLCBhdHRlbXB0aW5nIHRvIFwicHJldmVudERlZmF1bHRcIiBvciBcInN0b3BQcm9wYWdhdGlvblwiIHdpbGwgZG8gbm90aGluZy5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoJ2luaXRpYWwgdmFsdWUnKTtcbiAqXG4gKiAgICAgZHluYW1pY1Byb3BlcnR5LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsIChldmVudCkgPT4ge1xuICogICAgICAgY29uc29sZS5sb2coYER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJyR7ZXZlbnQudmFsdWV9JywgUHJldmlvdXMgVmFsdWUgPSAnJHtldmVudC5vbGRWYWx1ZX0nYCk7XG4gKiAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCBWYWx1ZSA9ICcke2R5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCl9J2ApO1xuICogICAgIH0pO1xuICpcbiAqICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oJ25ldyB2YWx1ZScpO1xuICpcbiAqICAgICAvLyBvdXRwdXQgLT4gRHluYW1pYyBQcm9wZXJ0eSBVcGRhdGVkISBOZXcgdmFsdWUgPSAnbmV3IHZhbHVlJywgT2xkIFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gKiAgICAgLy8gb3V0cHV0IC0+IEN1cnJlbnQgVmFsdWUgPSAnaW5pdGlhbCB2YWx1ZSdcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIER5bmFtaWNQcm9wZXJ0eSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7IC8vIEByZWY6X215dGhpeFR5cGVFeGFtcGxlXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBEWU5BTUlDX1BST1BFUlRZX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogUHJvcGVydHlcbiAgICogbmFtZTogc2V0XG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIHN0YXRpYzogdHJ1ZVxuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzcGVjaWFsIGBzeW1ib2xgIHVzZWQgdG8gYWNjZXNzIHRoZSBgc2V0YCBtZXRob2Qgb2YgYSBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICAgKlxuICAgKiAgICAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoJ2luaXRpYWwgdmFsdWUnKTtcbiAgICpcbiAgICogICAgIGR5bmFtaWNQcm9wZXJ0eS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAgICogICAgICAgY29uc29sZS5sb2coYER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJyR7ZXZlbnQudmFsdWV9JywgUHJldmlvdXMgVmFsdWUgPSAnJHtldmVudC5vbGRWYWx1ZX0nYCk7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IFZhbHVlID0gJyR7ZHluYW1pY1Byb3BlcnR5LnZhbHVlT2YoKX0nYCk7XG4gICAqICAgICB9KTtcbiAgICpcbiAgICogICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XSgnbmV3IHZhbHVlJyk7XG4gICAqXG4gICAqICAgICAvLyBvdXRwdXQgLT4gRHluYW1pYyBQcm9wZXJ0eSBVcGRhdGVkISBOZXcgdmFsdWUgPSAnbmV3IHZhbHVlJywgT2xkIFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gICAqICAgICAvLyBvdXRwdXQgLT4gQ3VycmVudCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICAgKiAgICAgYGBgXG4gICAqL1xuICBzdGF0aWMgc2V0ID0gRFlOQU1JQ19QUk9QRVJUWV9TRVQ7IC8vIEByZWY6RHluYW1pY1Byb3BlcnR5LnNldFxuXG4gIC8qKlxuICAgKiB0eXBlOiBGdW5jdGlvblxuICAgKiBuYW1lOiBjb25zdHJ1Y3RvclxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IFV0aWxzXG4gICAqIGRlc2M6IHxcbiAgICogICBDb25zdHJ1Y3QgYSBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogaW5pdGlhbFZhbHVlXG4gICAqICAgICBkYXRhVHlwZTogYW55XG4gICAqICAgICBkZXNjOlxuICAgKiAgICAgICBUaGUgaW5pdGlhbCB2YWx1ZSB0byBzdG9yZS5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhpcyB3aWxsIHJldHVybiBhIFByb3h5IGluc3RhbmNlIHdyYXBwaW5nIHRoZSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBZb3UgY2FuIG5vdCBzZXQgYSBgRHluYW1pY1Byb3BlcnR5YCB0byBhbm90aGVyIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLlxuICAgKiAgICAgSWYgYGluaXRpYWxWYWx1ZWAgaXMgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgaXQgd2lsbCB1c2UgdGhlIHN0b3JlZCB2YWx1ZVxuICAgKiAgICAgb2YgdGhhdCBpbnN0YW5jZSBpbnN0ZWFkIChieSBjYWxsaW5nIEBzZWUgRHluYW1pY1Byb3BlcnR5LnZhbHVlT2Y7KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIERZTkFNSUNfUFJPUEVSVFlfVFlQRSxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgKEJhc2VVdGlscy5pc1R5cGUoaW5pdGlhbFZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSA/IGluaXRpYWxWYWx1ZS52YWx1ZU9mKCkgOiBpbml0aWFsVmFsdWUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR106IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0KSA6IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSkgOiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJylcbiAgICAgIHJldHVybiArdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICBlbHNlIGlmIChoaW50ID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBEeW5hbWljUHJvcGVydHlcbiAgICogZGVzYzogfFxuICAgKiAgIEZldGNoIHRoZSB1bmRlcmx5aW5nIHJhdyB2YWx1ZSBzdG9yZWQgYnkgdGhpcyBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzOiBhbnk7IFRoZSB1bmRlcmxpbmcgcmF3IHZhbHVlLlxuICAgKi9cbiAgdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0eXBlOiBGdW5jdGlvblxuICAgKiBuYW1lOiBcIltEeW5hbWljUHJvcGVydHkuc2V0XVwiXG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIGRlc2M6IHxcbiAgICogICBTZXQgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIHN0b3JlZCBieSB0aGlzIGBEeW5hbWljUHJvcGVydHlgLlxuICAgKlxuICAgKiAgIElmIHRoZSBjdXJyZW50IHN0b3JlZCB2YWx1ZSBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIHRoZSBwcm92aWRlZCBgdmFsdWVgLFxuICAgKiAgIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuLlxuICAgKlxuICAgKiAgIE90aGVyd2lzZSwgd2hlbiB0aGUgdW5kZXJseWluZyB2YWx1ZSBpcyB1cGRhdGVkLCBgdGhpcy5kaXNwYXRjaEV2ZW50YCB3aWxsXG4gICAqICAgYmUgY2FsbGVkIHRvIGRpc3BhdGNoIGFuIGAndXBkYXRlJ2AgZXZlbnQgdG8gbm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCB0aGVcbiAgICogICB1bmRlcmx5aW5nIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5ld1ZhbHVlXG4gICAqICAgICBkYXRhVHlwZTogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBuZXcgdmFsdWUgdG8gc2V0LiBJZiB0aGlzIGlzIGl0c2VsZiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCB0aGVuXG4gICAqICAgICAgIGl0IHdpbGwgYmUgdW53cmFwcGVkIHRvIGl0cyB1bmRlcmx5aW5nIHZhbHVlLCBhbmQgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHZhbHVlIGluc3RlYWQuXG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBBbiBvYmplY3QgdG8gcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIG9wZXJhdGlvbi4gVGhlIHNoYXBlIG9mIHRoaXMgb2JqZWN0IGlzIGB7IGRpc3BhdGNoVXBkYXRlRXZlbnQ6IGJvb2xlYW4gfWAuXG4gICAqICAgICAgIElmIGBvcHRpb25zLmRpc3BhdGNoVXBkYXRlRXZlbnRgIGVxdWFscyBgZmFsc2VgLCB0aGVuIG5vIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvIGxpc3RlbmVycy5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogSWYgdGhlIHVuZGVybHlpbmcgc3RvcmVkIHZhbHVlIGlzIGV4YWN0bHkgdGhlIHNhbWUgYXMgdGhlIHZhbHVlIHByb3ZpZGVkLFxuICAgKiAgICAgdGhlbiBub3RoaW5nIHdpbGwgaGFwcGVuLCBhbmQgdGhlIG1ldGhvZCB3aWxsIHNpbXBseSByZXR1cm4uXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhlIHVuZGVybHlpbmcgdmFsdWUgaXMgdXBkYXRlZCAqYmVmb3JlKiBkaXNwYXRjaGluZyBldmVudHMuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogYER5bmFtaWNQcm9wZXJ0eWAgcHJvdGVjdHMgYWdhaW5zdCBjeWNsaWMgZXZlbnQgY2FsbGJhY2tzLiBJZiBhblxuICAgKiAgICAgZXZlbnQgY2FsbGJhY2sgYWdhaW4gc2V0cyB0aGUgdW5kZXJseWluZyBgRHluYW1pY1Byb3BlcnR5YCB2YWx1ZSwgdGhlblxuICAgKiAgICAgdGhlIHZhbHVlIHdpbGwgYmUgc2V0LCBidXQgbm8gZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkICh0byBwcmV2ZW50IGV2ZW50IGxvb3BzKS5cbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBZb3UgY2FuIG5vdCBzZXQgYSBgRHluYW1pY1Byb3BlcnR5YCB0byBhbm90aGVyIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLlxuICAgKiAgICAgSWYgdGhpcyBtZXRob2QgcmVjZWl2ZXMgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgaXQgd2lsbCB1c2UgdGhlIHN0b3JlZCB2YWx1ZVxuICAgKiAgICAgb2YgdGhhdCBpbnN0YW5jZSBpbnN0ZWFkIChieSBjYWxsaW5nIEBzZWUgRHluYW1pY1Byb3BlcnR5LnZhbHVlT2Y7KS5cbiAgICovXG4gIFtEWU5BTUlDX1BST1BFUlRZX1NFVF0oX25ld1ZhbHVlLCBfb3B0aW9ucykge1xuICAgIGxldCBuZXdWYWx1ZSA9IF9uZXdWYWx1ZTtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShuZXdWYWx1ZSwgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgIG5ld1ZhbHVlID0gbmV3VmFsdWUudmFsdWVPZigpO1xuXG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9IG5ld1ZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICB0cnkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gdHJ1ZTtcblxuICAgICAgbGV0IG9sZFZhbHVlID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPSBuZXdWYWx1ZTtcblxuICAgICAgaWYgKG9wdGlvbnMuZGlzcGF0Y2hVcGRhdGVFdmVudCA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHVwZGF0ZUV2ZW50ID0gbmV3IEV2ZW50KCd1cGRhdGUnKTtcblxuICAgICAgdXBkYXRlRXZlbnQub3JpZ2luYXRvciA9IHRoaXM7XG4gICAgICB1cGRhdGVFdmVudC5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgICAgdXBkYXRlRXZlbnQudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHVwZGF0ZUV2ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUsXG4gIE1ZVEhJWF9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICcuL2R5bmFtaWMtcHJvcGVydHkuanMnO1xuXG5jb25zdCBTVUJTVElUVVRFX0NIQVJfQ09ERSA9IDI2O1xuXG4vKipcbiAqICB0eXBlOiBOYW1lc3BhY2VcbiAqICBuYW1lOiBFbGVtZW50c1xuICogIGdyb3VwTmFtZTogRWxlbWVudHNcbiAqICBkZXNjOiB8XG4gKiAgICBgaW1wb3J0IHsgRWxlbWVudHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgICBVdGlsaXR5IGFuZCBlbGVtZW50IGJ1aWxkaW5nIGZ1bmN0aW9ucyBmb3IgdGhlIERPTS5cbiAqL1xuXG5jb25zdCBJU19QUk9QX05BTUUgICAgPSAvXnByb3BcXCQvO1xuY29uc3QgSVNfVEFSR0VUX1BST1AgID0gL15wcm90b3R5cGV8Y29uc3RydWN0b3IkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSxcbiAgICAgIH0sXG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RyaW5nKF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgdGFnTmFtZSA9IHRoaXMudGFnTmFtZTtcbiAgICBpZiAodGFnTmFtZSA9PT0gJyN0ZXh0JylcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMudmFsdWUucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcblxuICAgIGxldCBhdHRycyA9ICh0YWdOYW1lID09PSAnI2ZyYWdtZW50JykgPyBudWxsIDogKChhdHRyaWJ1dGVzKSA9PiB7XG4gICAgICBsZXQgcGFydHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgWyBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSBdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgbmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgICBwYXJ0cy5wdXNoKG5hbWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFydHMucHVzaChgJHtuYW1lfT1cIiR7ZW5jb2RlQXR0cmlidXRlVmFsdWUodmFsdWUpfVwiYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcgJyk7XG4gICAgfSkodGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgIGxldCBjaGlsZHJlbiA9ICgoY2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gKGNoaWxkICE9IG51bGwgJiYgY2hpbGQgIT09IGZhbHNlICYmICFPYmplY3QuaXMoY2hpbGQsIE5hTikpKVxuICAgICAgICAubWFwKChjaGlsZCkgPT4gKChjaGlsZCAmJiB0eXBlb2YgY2hpbGQudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpID8gY2hpbGQudG9TdHJpbmcob3B0aW9ucykgOiAoJycgKyBjaGlsZCkpKVxuICAgICAgICAuam9pbignJyk7XG4gICAgfSkodGhpcy5jaGlsZHJlbik7XG5cbiAgICBpZiAodGFnTmFtZSA9PT0gJyNmcmFnbWVudCcpXG4gICAgICByZXR1cm4gY2hpbGRyZW47XG5cbiAgICAvLyB0aGlzIHdpbGwgbW9yZSBjb21tb25seSBsb29rIGxpa2Ugd3JpdHRlbiBodG1sXG4gICAgdGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBlbGVtZW50VGFnU3RhcnQgPSBgPCR7dGFnTmFtZX0keyhhdHRycykgPyBgICR7YXR0cnN9YCA6ICcnfT5gO1xuICAgIGxldCBlbGVtZW50VGFnRW5kICAgPSBgPC8ke3RhZ05hbWV9PmA7XG5cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsICdtYXNrSFRNTCcpKSB7XG4gICAgICBsZXQgY2hhckNvZGUgPSAodHlwZW9mIG9wdGlvbnMubWFza0hUTUwgPT09ICdudW1iZXInKSA/IFN0cmluZy5mcm9tQ2hhckNvZGUoU1VCU1RJVFVURV9DSEFSX0NPREUpIDogb3B0aW9ucy5tYXNrSFRNTDtcbiAgICAgIGNvbnN0IHdpcGVCbGFuayA9IChjb250ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UoLy4vZywgY2hhckNvZGUpO1xuICAgICAgfTtcblxuICAgICAgZWxlbWVudFRhZ1N0YXJ0ID0gd2lwZUJsYW5rKGVsZW1lbnRUYWdTdGFydCk7XG4gICAgICBlbGVtZW50VGFnRW5kID0gd2lwZUJsYW5rKGVsZW1lbnRUYWdFbmQpO1xuXG4gICAgICBpZiAob3B0aW9ucy5tYXNrQ2hpbGRyZW5QYXR0ZXJuICYmIG9wdGlvbnMubWFza0NoaWxkcmVuUGF0dGVybi50ZXN0KHRhZ05hbWUpKVxuICAgICAgICBjaGlsZHJlbiA9IHdpcGVCbGFuayhjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2VsZW1lbnRUYWdTdGFydH0keyhpc1ZvaWRUYWcodGFnTmFtZSkpID8gJycgOiBgJHtjaGlsZHJlbn0ke2VsZW1lbnRUYWdFbmR9YH1gO1xuICB9XG5cbiAgdG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgYnVpbGQob3duZXJEb2N1bWVudCwgdGVtcGxhdGVPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMudGFnTmFtZSA9PT0gJyNmcmFnbWVudCcpXG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBjaGlsZC5idWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpKTtcblxuICAgIGxldCBhdHRyaWJ1dGVzICAgID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgIGxldCBuYW1lc3BhY2VVUkkgID0gYXR0cmlidXRlcy5uYW1lc3BhY2VVUkk7XG4gICAgbGV0IG9wdGlvbnM7XG4gICAgbGV0IGVsZW1lbnQ7XG5cbiAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmlzKVxuICAgICAgb3B0aW9ucyA9IHsgaXM6IHRoaXMuYXR0cmlidXRlcy5pcyB9O1xuXG4gICAgaWYgKHRoaXMudGFnTmFtZSA9PT0gJyN0ZXh0JylcbiAgICAgIHJldHVybiBwcm9jZXNzRWxlbWVudHMuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGF0dHJpYnV0ZXMudmFsdWUgfHwgJycpLCB0ZW1wbGF0ZU9wdGlvbnMpO1xuXG4gICAgaWYgKG5hbWVzcGFjZVVSSSlcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHRoaXMudGFnTmFtZSwgb3B0aW9ucyk7XG4gICAgZWxzZSBpZiAoaXNTVkdFbGVtZW50KHRoaXMudGFnTmFtZSkpXG4gICAgICBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlXG4gICAgICBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudGFnTmFtZSk7XG5cbiAgICBjb25zdCBldmVudE5hbWVzID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCk7XG4gICAgY29uc3QgaGFuZGxlQXR0cmlidXRlID0gKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIF9hdHRyaWJ1dGVWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBfYXR0cmlidXRlVmFsdWU7XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50LmNhbGwoXG4gICAgICAgICAgVXRpbHMuY3JlYXRlU2NvcGUoZWxlbWVudCwgdGVtcGxhdGVPcHRpb25zLnNjb3BlKSwgLy8gdGhpc1xuICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSxcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBtb2RpZmllZEF0dHJpYnV0ZU5hbWUgPSB0aGlzLnRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIER5bmFtaWMgYmluZGluZ3MgYXJlIG5vdCBhbGxvd2VkIGZvciBwcm9wZXJ0aWVzXG4gICAgY29uc3QgaGFuZGxlUHJvcGVydHkgPSAoZWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKSA9PiB7XG4gICAgICBsZXQgbmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKElTX1BST1BfTkFNRSwgJycpO1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBhdHRyaWJ1dGVOYW1lICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIGhhbmRsZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgaGFuZGxlQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCAgICAgICAgID0gY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBjaGlsZEVsZW1lbnQgID0gY2hpbGQuYnVpbGQob3duZXJEb2N1bWVudCwgdGVtcGxhdGVPcHRpb25zKTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZEVsZW1lbnQpKVxuICAgICAgICAgIGNoaWxkRWxlbWVudC5mbGF0KEluZmluaXR5KS5mb3JFYWNoKChjaGlsZCkgPT4gZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZEVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwcm9jZXNzRWxlbWVudHMuY2FsbChcbiAgICAgIHRoaXMsXG4gICAgICBlbGVtZW50LFxuICAgICAge1xuICAgICAgICAuLi50ZW1wbGF0ZU9wdGlvbnMsXG4gICAgICAgIHByb2Nlc3NFdmVudENhbGxiYWNrczogZmFsc2UsXG4gICAgICB9LFxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgSVNfSFRNTF9TQUZFX0NIQVJBQ1RFUiA9IC9eW1xcc2EtekEtWjAtOV8tXSQvO1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8uL2csIChtKSA9PiB7XG4gICAgcmV0dXJuIChJU19IVE1MX1NBRkVfQ0hBUkFDVEVSLnRlc3QobSkpID8gbSA6IGAmIyR7bS5jaGFyQ29kZUF0KDApfTtgO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZUF0dHJpYnV0ZVZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9bXCImXS9nLCAobSkgPT4ge1xuICAgIHJldHVybiBgJiMke20uY2hhckNvZGVBdCgwKX07YDtcbiAgfSk7XG59XG5cbmNvbnN0IElTX1ZPSURfVEFHID0gL15hcmVhfGJhc2V8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW18c291cmNlfHRyYWNrfHdiciQvaTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZvaWRUYWcodGFnTmFtZSkge1xuICByZXR1cm4gSVNfVk9JRF9UQUcudGVzdCh0YWdOYW1lLnNwbGl0KCc6Jykuc2xpY2UoLTEpWzBdKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZE5vZGVUeXBlKGl0ZW0pIHtcbiAgaWYgKCFpdGVtKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXRlbSBpbnN0YW5jZW9mIE5vZGUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGl0ZW1bTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5VGVtcGxhdGUob3duZXJEb2N1bWVudCwgbmFtZU9ySUQpIHtcbiAgaWYgKG5hbWVPcklEIGluc3RhbmNlb2YgTm9kZSlcbiAgICByZXR1cm4gbmFtZU9ySUQ7XG5cbiAgaWYgKCFvd25lckRvY3VtZW50KVxuICAgIHJldHVybjtcblxuICBsZXQgcmVzdWx0ID0gb3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lT3JJRCk7XG4gIGlmICghcmVzdWx0KVxuICAgIHJlc3VsdCA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke25hbWVPcklEfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHtuYW1lT3JJRH1cIiBpXWApO1xuXG4gIGlmICghcmVzdWx0KVxuICAgIHJlc3VsdCA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihuYW1lT3JJRCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29tcGlsZU1lcmdlRnJhZ21lbnQob3duZXJEb2N1bWVudCwgbm9kZSkge1xuICBsZXQgZnJhZ21lbnQgID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIGxldCBzZWxlY3RvcnMgPSAobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnJvbScpIHx8ICcnKS5zcGxpdCgnLCcpLm1hcCgoKHBhcnQpID0+IHBhcnQudHJpbSgpKSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHNlbGVjdG9ycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgbGV0IHNlbGVjdG9yICA9IHNlbGVjdG9yc1tpXTtcbiAgICBsZXQgZWxlbWVudCAgID0gcXVlcnlUZW1wbGF0ZShvd25lckRvY3VtZW50LCBzZWxlY3Rvcik7XG4gICAgaWYgKGVsZW1lbnQpXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgoSVNfVEVNUExBVEUudGVzdChlbGVtZW50LnRhZ05hbWUpKSA/IGVsZW1lbnQuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiBlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFX01FUkdFX0VMRU1FTlQgPSAvXm15dGhpeC1tZXJnZSQvaTtcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudHMoX25vZGUsIF9vcHRpb25zKSB7XG4gIGxldCBub2RlID0gX25vZGU7XG4gIGlmICghbm9kZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgc2NvcGUgICAgICAgICA9IG9wdGlvbnMuc2NvcGU7XG4gIGlmICghc2NvcGUpIHtcbiAgICBzY29wZSA9IFV0aWxzLmNyZWF0ZVNjb3BlKG5vZGUpO1xuICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIHNjb3BlIH07XG4gIH1cblxuICBsZXQgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgPSAob3B0aW9ucy5mb3JjZVRlbXBsYXRlRW5naW5lID09PSB0cnVlKSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMuZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3I7XG4gIGxldCBjaGlsZHJlbiAgICAgICAgICAgICAgICAgICAgICA9IEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKTtcblxuICBpZiAob3B0aW9ucy5mb3JjZVRlbXBsYXRlRW5naW5lICE9PSB0cnVlICYmICFkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3Rvcikge1xuICAgIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yID0gVXRpbHMuZ2V0RGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKTtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciB9O1xuICB9XG5cbiAgbGV0IGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCA9IGZhbHNlO1xuICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgJiYgVXRpbHMuc3BlY2lhbENsb3Nlc3Qobm9kZSwgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IpKVxuICAgIGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmhlbHBlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmhlbHBlci5jYWxsKHRoaXMsIHsgc2NvcGUsIG9wdGlvbnMsIG5vZGUsIGNoaWxkcmVuLCBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yIH0pO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgbm9kZSA9IHJlc3VsdDtcbiAgICBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBzY29wZS5vd25lckRvY3VtZW50IHx8IG5vZGUub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpIHtcbiAgICBpZiAoIWlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCkge1xuICAgICAgbGV0IHJlc3VsdCA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShub2RlLCBvcHRpb25zKTtcbiAgICAgIGlmICgoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5zb21lKGlzVmFsaWROb2RlVHlwZSkpIHx8IGlzVmFsaWROb2RlVHlwZShyZXN1bHQpKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKVxuICAgICAgICAgIHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cbiAgICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gaXRlbS5idWlsZChvd25lckRvY3VtZW50LCB7IHNjb3BlIH0pO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50cylcbiAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnRzKSlcbiAgICAgICAgICAgICAgZWxlbWVudHMuZmxhdChJbmZpbml0eSkuZm9yRWFjaCgoZWxlbWVudCkgPT4gZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50cyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwZW5kVG8oZnJhZ21lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGV4dE5vZGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCgnJyArIGl0ZW0pKTtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHRleHROb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnJhZ21lbnQ7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCAhPT0gbm9kZS5ub2RlVmFsdWUpIHtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAgcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgIGlmIChJU19URU1QTEFURV9NRVJHRV9FTEVNRU5ULnRlc3Qobm9kZS50YWdOYW1lKSlcbiAgICAgIHJldHVybiBjb21waWxlTWVyZ2VGcmFnbWVudChvd25lckRvY3VtZW50LCBub2RlKTtcblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChub2RlKTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMucHJvY2Vzc0V2ZW50Q2FsbGJhY2tzICE9PSBmYWxzZSkge1xuICAgICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgICAgVXRpbHMuY3JlYXRlU2NvcGUobm9kZSwgc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChVdGlscy5pc1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5vZGUpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyAuLi5vcHRpb25zLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvY2Vzc0NoaWxkcmVuID09PSBmYWxzZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgY2hpbGROb2RlLCBvcHRpb25zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSAmJiByZXN1bHQgIT09IGNoaWxkTm9kZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQocmVzdWx0LCBjaGlsZE5vZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBOT09QXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZChwYXJlbnROb2RlLCBjaGlsZE5vZGUpIHtcbiAgaWYgKCFwYXJlbnROb2RlIHx8ICFjaGlsZE5vZGUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20ocGFyZW50Tm9kZS5jaGlsZE5vZGVzKSkge1xuICAgIGlmIChjaGlsZCA9PT0gY2hpbGROb2RlKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFCYXNlVXRpbHMuaXNUeXBlKHRhZ05hbWUsICc6OlN0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBjb25zdCB3cmFuZ2xlQ2hpbGRyZW4gPSAoY2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiBjaGlsZHJlbi5mbGF0KEluZmluaXR5KS5tYXAoKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgICByZXR1cm4gdmFsdWUoKTtcblxuICAgICAgICBpZiAodmFsdWVbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSlcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpXG4gICAgICAgICAgcmV0dXJuIHdyYW5nbGVDaGlsZHJlbih2YWx1ZS5nZXRVbmRlcmx5aW5nQXJyYXkoKSk7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgICAgICByZXR1cm4gbm9kZVRvRWxlbWVudERlZmluaXRpb24odmFsdWUpO1xuXG4gICAgICAgIGlmICghQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9O1xuXG4gICAgbGV0IGNoaWxkcmVuID0gd3JhbmdsZUNoaWxkcmVuKF9jaGlsZHJlbiB8fCBbXSk7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZTogKCcnICsgbm9kZS5ub2RlVmFsdWUpIH0pO1xuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBub2RlLm5vZGVUeXBlICE9PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG5cbiAgaWYgKHR5cGVvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gIH1cblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbigobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSA/ICcjZnJhZ21lbnQnIDogbm9kZS50YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbik7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gL14odGVtcGxhdGUpJC9pO1xuXG4vKipcbiAgICogcGFyZW50OiBFbGVtZW50c1xuICAgKiBncm91cE5hbWU6IEVsZW1lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBbG1vc3QgbGlrZSBgT2JqZWN0LmFzc2lnbmAsIG1lcmdlIGFsbCBjb21wb25lbnQgY2hpbGRyZW4gaW50byBhIHNpbmdsZSBub2RlICh0aGUgYHRhcmdldGApLlxuICAgKlxuICAgKiAgIFRoaXMgaXMgXCJ0ZW1wbGF0ZSBpbnRlbGxpZ2VudFwiLCBtZWFuaW5nIGZvciBgPHRlbXBsYXRlPmAgZWxlbWVudHMgc3BlY2lmaWNhbGx5LCBpdCB3aWxsIGV4ZWN1dGVcbiAgICogICBgY2hpbGRyZW4gPSB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzYCB0byBjbG9uZSBhbGwgdGhlIGNoaWxkIG5vZGVzLCBhbmQgbm90XG4gICAqICAgbW9kaWZ5IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZS4gSXQgaXMgYWxzbyB0ZW1wbGF0ZSBpbnRlbGxpZ2VudCBieSB0aGUgZmFjdCB0aGF0IGlmIHRoZSBgdGFyZ2V0YCBpc1xuICAgKiAgIGEgdGVtcGxhdGUsIGl0IHdpbGwgYWRkIHRoZSBjaGlsZHJlbiB0byBgY29udGVudGAgcHJvcGVybHkuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IHRhcmdldFxuICAgKiAgICAgZGF0YVR5cGVzOiBOb2RlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSB0YXJnZXQgTm9kZSB0byBtZXJnZSBhbGwgY2hpbGRyZW4gaW50by4gSWYgdGhpcyBOb2RlIGlzIGEgYDx0ZW1wbGF0ZT5gIE5vZGUsIHRoZW4gaXQgd2lsbFxuICAgKiAgICAgICBwbGFjZSBhbGwgdGhlIG1lcmdlZCBjaGlsZHJlbiBpbnRvIGB0ZW1wbGF0ZS5jb250ZW50YC5cbiAgICogbm90ZXM6XG4gICAqICAgLSBBbnkgdGVtcGxhdGUgTm9kZSB3aWxsIGJlIGNsb25lZCwgYW5kIHNvIHRoZSBvcmlnaW5hbCB3aWxsIG5vdCBiZSBtb2RpZmllZC4gQWxsIG90aGVyIG5vZGVzIGFyZSAqKk5PVCoqXG4gICAqICAgICBjbG9uZWQgYmVmb3JlIHRoZSBtZXJnZSwgYW5kIHNvIHdpbGwgYmUgc3RyaXBwZWQgb2YgdGhlaXIgY2hpbGRyZW4uXG4gICAqICAgLSBNYWtlIGNlcnRhaW4geW91IGRlZXAgY2xvbmUgYW55IGVsZW1lbnQgZmlyc3QgKGV4Y2VwdCB0ZW1wbGF0ZXMpIGlmIHlvdSBkb24ndCB3YW50IHRoZSBwcm92aWRlZCBlbGVtZW50c1xuICAgKiAgICAgdG8gYmUgbW9kaWZpZWQuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBOb2RlOyBUaGUgcHJvdmlkZWQgYHRhcmdldGAsIHdpdGggYWxsIGNoaWxkcmVuIG1lcmdlZCAoYWRkZWQpIGludG8gaXQuXG4gICAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgcmV0dXJuIHRhcmdldDtcblxuICBsZXQgdGFyZ2V0SXNUZW1wbGF0ZSA9IElTX1RFTVBMQVRFLnRlc3QodGFyZ2V0LnRhZ05hbWUpO1xuICBmb3IgKGxldCBvdGhlciBvZiBvdGhlcnMpIHtcbiAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIE5vZGUpKVxuICAgICAgY29udGludWU7XG5cbiAgICBsZXQgY2hpbGROb2RlcyA9IChJU19URU1QTEFURS50ZXN0KG90aGVyLnRhZ05hbWUpKSA/IG90aGVyLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXMgOiBvdGhlci5jaGlsZE5vZGVzO1xuICAgIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20oY2hpbGROb2RlcykpIHtcbiAgICAgIGxldCBjb250ZW50ID0gKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpID8gY2hpbGQuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiBjaGlsZDtcbiAgICAgIGlmICh0YXJnZXRJc1RlbXBsYXRlKVxuICAgICAgICB0YXJnZXQuY29udGVudC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IElTX1NWR19FTEVNRU5UX05BTUUgPSAvXihhbHRnbHlwaHxhbHRnbHlwaGRlZnxhbHRnbHlwaGl0ZW18YW5pbWF0ZXxhbmltYXRlQ29sb3J8YW5pbWF0ZU1vdGlvbnxhbmltYXRlVHJhbnNmb3JtfGFuaW1hdGlvbnxjaXJjbGV8Y2xpcFBhdGh8Y29sb3JQcm9maWxlfGN1cnNvcnxkZWZzfGRlc2N8ZGlzY2FyZHxlbGxpcHNlfGZlYmxlbmR8ZmVjb2xvcm1hdHJpeHxmZWNvbXBvbmVudHRyYW5zZmVyfGZlY29tcG9zaXRlfGZlY29udm9sdmVtYXRyaXh8ZmVkaWZmdXNlbGlnaHRpbmd8ZmVkaXNwbGFjZW1lbnRtYXB8ZmVkaXN0YW50bGlnaHR8ZmVkcm9wc2hhZG93fGZlZmxvb2R8ZmVmdW5jYXxmZWZ1bmNifGZlZnVuY2d8ZmVmdW5jcnxmZWdhdXNzaWFuYmx1cnxmZWltYWdlfGZlbWVyZ2V8ZmVtZXJnZW5vZGV8ZmVtb3JwaG9sb2d5fGZlb2Zmc2V0fGZlcG9pbnRsaWdodHxmZXNwZWN1bGFybGlnaHRpbmd8ZmVzcG90bGlnaHR8ZmV0aWxlfGZldHVyYnVsZW5jZXxmaWx0ZXJ8Zm9udHxmb250RmFjZXxmb250RmFjZUZvcm1hdHxmb250RmFjZU5hbWV8Zm9udEZhY2VTcmN8Zm9udEZhY2VVcml8Zm9yZWlnbk9iamVjdHxnfGdseXBofGdseXBoUmVmfGhhbmRsZXJ8aEtlcm58aW1hZ2V8bGluZXxsaW5lYXJncmFkaWVudHxsaXN0ZW5lcnxtYXJrZXJ8bWFza3xtZXRhZGF0YXxtaXNzaW5nR2x5cGh8bVBhdGh8cGF0aHxwYXR0ZXJufHBvbHlnb258cG9seWxpbmV8cHJlZmV0Y2h8cmFkaWFsZ3JhZGllbnR8cmVjdHxzZXR8c29saWRDb2xvcnxzdG9wfHN2Z3xzd2l0Y2h8c3ltYm9sfHRicmVha3x0ZXh0fHRleHRwYXRofHRyZWZ8dHNwYW58dW5rbm93bnx1c2V8dmlld3x2S2VybikkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1NWR19FTEVNRU5UX05BTUUudGVzdCh0YWdOYW1lKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuZXhwb3J0IGNvbnN0IEVsZW1lbnRHZW5lcmF0b3IgPSBuZXcgUHJveHkoXG4gIHtcbiAgICBUZXJtLFxuICAgICRURVhUOiBUZXJtLFxuICB9LFxuICB7XG4gICAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BOYW1lKSB7XG4gICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgaWYgKElTX1NWR19FTEVNRU5UX05BTUUudGVzdChwcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gU1ZHIGVsZW1lbnRzXG4gICAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSwgeyBuYW1lc3BhY2VVUkk6ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWlsZChwcm9wTmFtZSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTk9PUFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSxcbik7XG4iLCJpbXBvcnQgZGVlcE1lcmdlIGZyb20gJ2RlZXBtZXJnZSc7XG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQge1xuICBEeW5hbWljUHJvcGVydHksXG59IGZyb20gJy4vZHluYW1pYy1wcm9wZXJ0eS5qcyc7XG5cbmltcG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICByZXF1aXJlLFxufSBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlMYW5ndWFnZVBhY2sgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wYWNrJztcblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgc2V0IGF0dHIkZGF0YU15dGhpeFNyYyhbIHZhbHVlIF0pIHtcbiAgICAvLyBOT09QLi4uIFRyYXAgdGhpcyBiZWNhdXNlIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsb2FkIGEgcGFydGlhbCBoZXJlXG4gIH1cblxuICBvbk11dGF0aW9uQWRkZWQobXV0YXRpb24pIHtcbiAgICAvLyBXaGVuIGFkZGVkIHRvIHRoZSBET00sIGVuc3VyZSB0aGF0IHdlIHdlcmVcbiAgICAvLyBhZGRlZCB0byB0aGUgcm9vdCBvZiBhIGxhbmd1YWdlIHByb3ZpZGVyLi4uXG4gICAgLy8gSWYgbm90LCB0aGVuIG1vdmUgb3Vyc2VsdmVzIHRvIHRoZSByb290XG4gICAgLy8gb2YgdGhlIGxhbmd1YWdlIHByb3ZpZGVyLlxuICAgIGxldCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICBpZiAocGFyZW50TGFuZ3VhZ2VQcm92aWRlciAmJiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICE9PSBtdXRhdGlvbi50YXJnZXQpXG4gICAgICBCYXNlVXRpbHMubmV4dFRpY2soKCkgPT4gcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5pbnNlcnRCZWZvcmUodGhpcywgcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKSk7XG4gIH1cbn1cblxuY29uc3QgSVNfSlNPTl9FTkNUWVBFICAgICAgICAgICAgICAgICA9IC9eYXBwbGljYXRpb25cXC9qc29uL2k7XG5jb25zdCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcic7XG5cbiAgc2V0IGF0dHIkbGFuZyhbIG5ld1ZhbHVlLCBvbGRWYWx1ZSBdKSB7XG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrc0Zvckxhbmd1YWdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBvbk11dGF0aW9uQ2hpbGRBZGRlZChub2RlKSB7XG4gICAgaWYgKG5vZGUubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICB0aGlzLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgLy8gUmVsb2FkIGxhbmd1YWdlIHBhY2tzIGFmdGVyIGFkZGl0aW9uc1xuICAgICAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UodGhpcy5nZXRDdXJyZW50TG9jYWxlKCkpO1xuICAgICAgfSwgTEFOR1VBR0VfUEFDS19JTlNFUlRfR1JBQ0VfVElNRSwgJ3JlbG9hZExhbmd1YWdlUGFja3MnKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Rlcm1zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGkxOG4oX3BhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGxldCBwYXRoICAgID0gYGdsb2JhbC5pMThuLiR7X3BhdGh9YDtcbiAgICBsZXQgcmVzdWx0ICA9IFV0aWxzLmZldGNoUGF0aCh0aGlzLnRlcm1zLCBwYXRoKTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgIHJldHVybiBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgcGF0aCwgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKSA/ICcnIDogZGVmYXVsdFZhbHVlKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDdXJyZW50TG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJztcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgc3VwZXIubW91bnRlZCgpO1xuXG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldFNvdXJjZXNGb3JMYW5nKGxhbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoYG15dGhpeC1sYW5ndWFnZS1wYWNrW2xhbmdePVwiJHtsYW5nLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKTtcbiAgfVxuXG4gIGxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UoX2xhbmcpIHtcbiAgICBsZXQgbGFuZyAgICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudHMgID0gdGhpcy5nZXRTb3VyY2VzRm9yTGFuZyhsYW5nKS5maWx0ZXIoKHNvdXJjZUVsZW1lbnQpID0+IEJhc2VVdGlscy5pc05vdE5PRShzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnRzIHx8ICFzb3VyY2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogTm8gXCJteXRoaXgtbGFuZ3VhZ2UtcGFja1wiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cyk7XG4gIH1cblxuICBhc3luYyBsb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgcHJvbWlzZXMgID0gc291cmNlRWxlbWVudHMubWFwKChzb3VyY2VFbGVtZW50KSA9PiB0aGlzLmxvYWRMYW5ndWFnZVBhY2sobGFuZywgc291cmNlRWxlbWVudCkpO1xuICAgICAgbGV0IGFsbFRlcm1zICA9IChhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQocHJvbWlzZXMpKS5tYXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ2Z1bGZpbGxlZCcpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgIGxldCB0ZXJtcyAgICAgICAgID0gZGVlcE1lcmdlLmFsbChBcnJheS5mcm9tKG5ldyBTZXQoYWxsVGVybXMpKSk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpO1xuXG4gICAgICB0aGlzLnRlcm1zID0gY29tcGlsZWRUZXJtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgbGFuZ3VhZ2UgcGFja3MnLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IHJlcXVpcmUuY2FsbCh0aGlzLCBzcmMsIHsgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50IH0pO1xuICAgICAgbGV0IHR5cGUgICAgICAgICAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZW5jdHlwZScpIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgIGlmIChJU19KU09OX0VOQ1RZUEUudGVzdCh0eXBlKSkge1xuICAgICAgICAvLyBIYW5kbGUgSlNPTlxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgRG9uJ3Qga25vdyBob3cgdG8gbG9hZCBhIGxhbmd1YWdlIHBhY2sgb2YgdHlwZSBcIiR7dHlwZX1cImApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcykge1xuICAgIGNvbnN0IHdhbGtUZXJtcyA9ICh0ZXJtcywgcmF3S2V5UGF0aCkgPT4ge1xuICAgICAgbGV0IGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRlcm1zKTtcbiAgICAgIGxldCB0ZXJtc0NvcHkgPSB7fTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgICAgICAgICA9IGtleXNbaV07XG4gICAgICAgIGxldCB2YWx1ZSAgICAgICA9IHRlcm1zW2tleV07XG4gICAgICAgIGxldCBuZXdLZXlQYXRoICA9IHJhd0tleVBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgICAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gd2Fsa1Rlcm1zKHZhbHVlLCBuZXdLZXlQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgbmV3S2V5UGF0aC5qb2luKCcuJyksIHZhbHVlKTtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICAgIHByb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVybXNDb3B5O1xuICAgIH07XG5cbiAgICByZXR1cm4gd2Fsa1Rlcm1zKHRlcm1zLCBbICdnbG9iYWwnLCAnaTE4bicgXSk7XG4gIH1cbn1cblxuTXl0aGl4VUlMYW5ndWFnZVBhY2sucmVnaXN0ZXIoKTtcbk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlMYW5ndWFnZVBhY2sgPSBNeXRoaXhVSUxhbmd1YWdlUGFjaztcbmdsb2JhbFRoaXMubXl0aGl4VUkuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyID0gTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyO1xuIiwiaW1wb3J0ICogYXMgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgVEVNUExBVEVfVEVNUExBVEUgPSAvXihcXCp8XFx8XFwqfFxcKlxcfCkkLztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJUmVxdWlyZSBleHRlbmRzIENvbXBvbmVudC5NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgc3VwZXIubW91bnRlZCgpO1xuXG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQge1xuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBjYWNoZWQsXG4gICAgICB9ID0gYXdhaXQgQ29tcG9uZW50LnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgc3JjLFxuICAgICAgICB7XG4gICAgICAgICAgbWFnaWM6ICAgICAgICAgIHRydWUsXG4gICAgICAgICAgb3duZXJEb2N1bWVudDogIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogICAgICAgIHRydWUsXG4gICAgICAgICAgbm9kZUhhbmRsZXI6ICAobm9kZSwgeyBpc0hhbmRsZWQgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0hhbmRsZWQgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmVQcm9jZXNzOiAgICh7IHRlbXBsYXRlLCBjaGlsZHJlbiB9KSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhclRlbXBsYXRlID0gY2hpbGRyZW4uZmluZCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IGRhdGFGb3IgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJyk7XG4gICAgICAgICAgICAgIHJldHVybiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSAmJiBURU1QTEFURV9URU1QTEFURS50ZXN0KGRhdGFGb3IpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXN0YXJUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgICAgICBsZXQgZGF0YUZvciA9IHN0YXJUZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJyk7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICBpZiAoY2hpbGQgPT09IHN0YXJUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJDbG9uZSA9IHN0YXJUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUZvciA9PT0gJyp8JylcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRlbnQuaW5zZXJ0QmVmb3JlKHN0YXJDbG9uZSwgY2hpbGQuY29udGVudC5jaGlsZE5vZGVzWzBdIHx8IG51bGwpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRlbnQuYXBwZW5kQ2hpbGQoc3RhckNsb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGFyVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdGFyVGVtcGxhdGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LXJlcXVpcmVcIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY31gLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2hTcmMoKSB7XG4gICAgLy8gTk9PUFxuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVJlcXVpcmU7XG5cbmlmICh0eXBlb2YgY3VzdG9tRWxlbWVudHMgIT09ICd1bmRlZmluZWQnICYmICFjdXN0b21FbGVtZW50cy5nZXQoJ215dGhpeC1yZXF1aXJlJykpXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnbXl0aGl4LXJlcXVpcmUnLCBNeXRoaXhVSVJlcXVpcmUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5pbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbi8qXG5NYW55IHRoYW5rcyB0byBTYWdlZSBDb253YXkgZm9yIHRoZSBmb2xsb3dpbmcgQ1NTIHNwaW5uZXJzXG5odHRwczovL2NvZGVwZW4uaW8vc2Fjb253YXkvcGVuL3ZZS1l5cnhcbiovXG5cbmNvbnN0IFNUWUxFX1NIRUVUID1cbmBcbjpob3N0IHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiAxZW07XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbjpob3N0KC5zbWFsbCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMC43NSk7XG59XG46aG9zdCgubWVkaXVtKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAxLjUpO1xufVxuOmhvc3QoLmxhcmdlKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAzKTtcbn1cbi5zcGlubmVyLWl0ZW0sXG4uc3Bpbm5lci1pdGVtOjpiZWZvcmUsXG4uc3Bpbm5lci1pdGVtOjphZnRlciB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA2MCU7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiB7XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4yNSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzczogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMDc1KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgYm9yZGVyOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAxLjApO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSAqIDAuMDc1KSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC43KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLWJvdHRvbTogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuODc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC40KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuNzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpKSByb3RhdGUoNDVkZWcpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIuNSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSB7XG4gIDAlLCA4LjMzJSwgMTYuNjYlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDI0Ljk5JSwgMzMuMzIlLCA0MS42NSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDAlKTtcbiAgfVxuICA0OS45OCUsIDU4LjMxJSwgNjYuNjQlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAxMDAlKTtcbiAgfVxuICA3NC45NyUsIDgzLjMwJSwgOTEuNjMlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiB7XG4gIDAlLCA4LjMzJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDE2LjY2JSwgMjQuOTklLCAzMy4zMiUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxuICA0MS42NSUsIDQ5Ljk4JSwgNTguMzElIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMTAwJSk7XG4gIH1cbiAgNjYuNjQlLCA3NC45NyUsIDgzLjMwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIHtcbiAgMCUsIDgzLjMwJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwKTtcbiAgfVxuICA4LjMzJSwgMTYuNjYlLCAyNC45OSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwKTtcbiAgfVxuICAzMy4zMiUsIDQxLjY1JSwgNDkuOTglIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgLTEwMCUpO1xuICB9XG4gIDU4LjMxJSwgNjYuNjQlLCA3NC45NyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC0xMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyA0KTtcbiAgbWluLXdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDc1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTc1JSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMSk7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiB7XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDIpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAzKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogNCk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNSk7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIC8gLTIpO1xufVxuYDtcblxuY29uc3QgS0lORFMgPSB7XG4gICdhdWRpbyc6ICA1LFxuICAnY2lyY2xlJzogMyxcbiAgJ2RvdCc6ICAgIDIsXG4gICdwaXBlJzogICA1LFxuICAncHV6emxlJzogMyxcbiAgJ3dhdmUnOiAgIDMsXG59O1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlTcGlubmVyIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgdGFnTmFtZSA9ICdteXRoaXgtc3Bpbm5lcic7XG5cbiAgc2V0IGF0dHIka2luZChbIG5ld1ZhbHVlIF0pIHtcbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCkge1xuICAgICAgLy8gYXBwZW5kIHRlbXBsYXRlXG4gICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIHRoaXMuJGJ1aWxkKCh7IFRFTVBMQVRFIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIFRFTVBMQVRFXG4gICAgICAgICAgLmRhdGFNeXRoaXhOYW1lKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSlcbiAgICAgICAgICAucHJvcCRpbm5lckhUTUwoYDxzdHlsZT4ke1NUWUxFX1NIRUVUfTwvc3R5bGU+YCk7XG4gICAgICB9KS5hcHBlbmRUbyhvd25lckRvY3VtZW50LmJvZHkpO1xuXG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBsZXQga2luZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdraW5kJyk7XG4gICAgaWYgKCFraW5kKSB7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2tpbmQnLCBraW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2Uoa2luZCk7XG4gIH1cblxuICBoYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKF9raW5kKSB7XG4gICAgbGV0IGtpbmQgICAgICAgID0gKCcnICsgX2tpbmQpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoS0lORFMsIGtpbmQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXNwaW5uZXJcIiB1bmtub3duIFwia2luZFwiIHByb3ZpZGVkOiBcIiR7a2luZH1cIi4gU3VwcG9ydGVkIFwia2luZFwiIGF0dHJpYnV0ZSB2YWx1ZXMgYXJlOiBcInBpcGVcIiwgXCJhdWRpb1wiLCBcImNpcmNsZVwiLCBcInB1enpsZVwiLCBcIndhdmVcIiwgYW5kIFwiZG90XCIuYCk7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgIH1cblxuICAgIHRoaXMuY2hhbmdlU3Bpbm5lckNoaWxkcmVuKEtJTkRTW2tpbmRdKTtcbiAgfVxuXG4gIGJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgbGV0IGNoaWxkcmVuICAgICAgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGlubmVyLWl0ZW0nKTtcblxuICAgICAgY2hpbGRyZW5baV0gPSBlbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbGVjdChjaGlsZHJlbik7XG4gIH1cblxuICBjaGFuZ2VTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICB0aGlzLnNlbGVjdCgnLnNwaW5uZXItaXRlbScpLnJlbW92ZSgpO1xuICAgIHRoaXMuYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcblxuICAgIC8vIEFsd2F5cyBhcHBlbmQgc3R5bGUgYWdhaW4sIHNvXG4gICAgLy8gdGhhdCBpdCBpcyB0aGUgbGFzdCBjaGlsZCwgYW5kXG4gICAgLy8gZG9lc24ndCBtZXNzIHdpdGggXCJudGgtY2hpbGRcIlxuICAgIC8vIHNlbGVjdG9yc1xuICAgIHRoaXMuc2VsZWN0KCdzdHlsZScpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcbiAgfVxufVxuXG5NeXRoaXhVSVNwaW5uZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJU3Bpbm5lcjtcbiIsImltcG9ydCB7XG4gIE1ZVEhJWF9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbn0gZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmNvbnN0IElTX0lOVEVHRVIgPSAvXlxcZCskLztcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFdlIGhhdmUgYW4gRWxlbWVudCBvciBhIERvY3VtZW50XG4gIGlmICh2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gaXNOb3RTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAhZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDbGFzc05hbWVzKC4uLmFyZ3MpIHtcbiAgbGV0IGNsYXNzTmFtZXMgPSBbXS5jb25jYXQoLi4uYXJncylcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLm1hcCgocGFydCkgPT4gKCcnICsgcGFydCkuc3BsaXQoL1xccysvKSlcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gY2xhc3NOYW1lcztcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0VsZW1lbnQgICAgPSBpc0VsZW1lbnQ7XG4gIHN0YXRpYyBpc1Nsb3R0ZWQgICAgPSBpc1Nsb3R0ZWQ7XG4gIHN0YXRpYyBpc05vdFNsb3R0ZWQgPSBpc05vdFNsb3R0ZWQ7XG5cbiAgc3RhdGljIGZyb20gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShbXSwgeyByb290OiAoaXNFbGVtZW50KHRoaXMpKSA/IHRoaXMgOiBkb2N1bWVudCwgY29udGV4dDogdGhpcyB9KTtcblxuICAgIGNvbnN0IGdldE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBsZXQgYmFzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBpZiAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihiYXNlLCBhcmdzW2FyZ0luZGV4KytdKTtcblxuICAgICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXhdLmdldE9wdGlvbnMoKSB8fCB7fSwgYmFzZSk7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSb290RWxlbWVudCA9IChvcHRpb25zUm9vdCkgPT4ge1xuICAgICAgaWYgKGlzRWxlbWVudChvcHRpb25zUm9vdCkpXG4gICAgICAgIHJldHVybiBvcHRpb25zUm9vdDtcblxuICAgICAgaWYgKGlzRWxlbWVudCh0aGlzKSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHJldHVybiAoKHRoaXMgJiYgdGhpcy5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudCk7XG4gICAgfTtcblxuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBnZXRPcHRpb25zKCk7XG4gICAgbGV0IHJvb3QgICAgICA9IGdldFJvb3RFbGVtZW50KG9wdGlvbnMucm9vdCk7XG4gICAgbGV0IHF1ZXJ5RW5naW5lO1xuXG4gICAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgdGhpcztcblxuICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XS5zbGljZSgpLCBvcHRpb25zKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbYXJnSW5kZXhdKSkge1xuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleCArIDFdLCAnOjpGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1sxXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6U3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6RnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJvb3QucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnOjpGdW5jdGlvbicpKSB7XG4gICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCBvcHRpb25zKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKVxuICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyZXN1bHQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmludm9rZUNhbGxiYWNrcyAhPT0gZmFsc2UgJiYgdHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gcXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9O1xuXG4gIGdldEVuZ2luZUNsYXNzKCkge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIFFVRVJZX0VOR0lORV9UWVBFLFxuICAgICAgfSxcbiAgICAgICdfbXl0aGl4VUlPcHRpb25zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSUVsZW1lbnRzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMob3B0aW9ucy5jb250ZXh0LCBlbGVtZW50cyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lIGluIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnbGVuZ3RoJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQucHJvdG90eXBlO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIC8vIEluZGV4IGxvb2t1cFxuICAgICAgICBpZiAoSVNfSU5URUdFUi50ZXN0KHByb3BOYW1lKSlcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICAgIC8vIFJlZGlyZWN0IGFueSBhcnJheSBtZXRob2RzOlxuICAgICAgICAvL1xuICAgICAgICAvLyBcIm1hZ2ljUHJvcE5hbWVcIiBpcyB3aGVuIHRoZVxuICAgICAgICAvLyBmdW5jdGlvbiBuYW1lIGJlZ2lucyB3aXRoIFwiJFwiLFxuICAgICAgICAvLyBpLmUuIFwiJGZpbHRlclwiLCBvciBcIiRtYXBcIi4gSWZcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSwgdGhlbiB0aGUgcmV0dXJuXG4gICAgICAgIC8vIHZhbHVlIHdpbGwgYWx3YXlzIGJlIGNvZXJjZWQgaW50b1xuICAgICAgICAvLyBhIFF1ZXJ5RW5naW5lLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICAgICAgLy8gb25seSBiZSBjb2VyY2VkIGludG8gYSBRdWVyeUVuZ2luZVxuICAgICAgICAvLyBpZiBFVkVSWSBlbGVtZW50IGluIHRoZSByZXN1bHQgaXNcbiAgICAgICAgLy8gYW4gXCJlbGVtZW50eVwiIHR5cGUgdmFsdWUuXG4gICAgICAgIGxldCBtYWdpY1Byb3BOYW1lID0gKHByb3BOYW1lLmNoYXJBdCgwKSA9PT0gJyQnKSA/IHByb3BOYW1lLnN1YnN0cmluZygxKSA6IHByb3BOYW1lO1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZVttYWdpY1Byb3BOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IGFycmF5ICAgPSB0YXJnZXQuX215dGhpeFVJRWxlbWVudHM7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ICA9IGFycmF5W21hZ2ljUHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIChtYWdpY1Byb3BOYW1lICE9PSBwcm9wTmFtZSB8fCByZXN1bHQuZXZlcnkoKGl0ZW0pID0+IEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24sIE5vZGUsIFF1ZXJ5RW5naW5lKSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShpdGVtLCBOb2RlKSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgIGlmIChpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIGl0ZW0gPSBpdGVtKCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKVxuICAgICAgICBpdGVtID0gRWxlbWVudHMuVGVybShpdGVtKTtcbiAgICAgIGVsc2UgaWYgKCFCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoIWNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiY29udGV4dFwiIG9wdGlvbiBmb3IgUXVlcnlFbmdpbmUgaXMgcmVxdWlyZWQgd2hlbiBjb25zdHJ1Y3RpbmcgZWxlbWVudHMuJyk7XG5cbiAgICAgIHJldHVybiBpdGVtLmJ1aWxkKHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpLCB7XG4gICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShjb250ZXh0KSxcbiAgICAgIH0pO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhQmFzZVV0aWxzLmlzVHlwZShjb3VudCwgJzo6TnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzWzBdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpKSk7XG4gIH1cblxuICBsYXN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFCYXNlVXRpbHMuaXNUeXBlKGNvdW50LCAnOjpOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICc6OlN0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG5cbiAgaW5zZXJ0SW50byhzZWxlY3Rvck9yRWxlbWVudCwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICc6OlN0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmdldE93bmVyRG9jdW1lbnQoKTtcbiAgICBsZXQgc291cmNlICAgICAgICA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblxuICAgICAgc291cmNlID0gWyBmcmFnbWVudCBdO1xuICAgIH1cblxuICAgIGVsZW1lbnQuaW5zZXJ0KHNvdXJjZVswXSwgcmVmZXJlbmNlTm9kZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlcGxhY2VDaGlsZHJlbk9mKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG5cbiAgc2xvdChzbG90TmFtZSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5zbG90ID09PSBzbG90TmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmIChlbGVtZW50LmNsb3Nlc3QoYHNsb3RbbmFtZT1cIiR7c2xvdE5hbWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5RdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG4vKlxuTWFueSB0aGFua3MgdG8gR2VyYWludCBMdWZmIGZvciB0aGUgZm9sbG93aW5nXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9nZXJhaW50bHVmZi9zaGEyNTYvXG4qL1xuXG4vKipcbiAqIHR5cGU6IEZ1bmN0aW9uXG4gKiBuYW1lOiBTSEEyNTZcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgU0hBMjU2IGhhc2hpbmcgZnVuY3Rpb25cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBpbnB1dFxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBJbnB1dCBzdHJpbmdcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgU0hBMjU2IGhhc2ggb2YgdGhlIHByb3ZpZGVkIGBpbnB1dGAuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFRoaXMgaXMgYSBjdXN0b20gYmFrZWQgU0hBMjU2IGhhc2hpbmcgZnVuY3Rpb24sIG1pbmltaXplZCBmb3Igc2l6ZS5cbiAqICAgICBJdCBtYXkgYmUgaW5jb21wbGV0ZSwgYW5kIGl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91ICoqRE8gTk9UKiogdXNlIHRoaXNcbiAqICAgICBmb3IgYW55dGhpbmcgcmVsYXRlZCB0byBzZWN1cml0eS5cbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFJlYWQgYWxsIHRoZSBub3RlcywgYW5kIHVzZSB0aGlzIG1ldGhvZCB3aXRoIGNhdXRpb24uXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBtb2RpZmllZCBzbGlnaHRseSBmcm9tIHRoZSBvcmlnaW5hbCB0byAqbm90KiBiYWlsIHdoZW5cbiAqICAgICB1bmljb2RlIGNoYXJhY3RlcnMgYXJlIGRldGVjdGVkLiBUaGVyZSBpcyBhIGRlY2VudCBjaGFuY2UgdGhhdC0tZ2l2ZW4gY2VydGFpblxuICogICAgIGlucHV0LS10aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhbiBpbnZhbGlkIFNIQTI1NiBoYXNoLlwiXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBNeXRoaXggVUkgdXNlcyB0aGlzIG1ldGhvZCBzaW1wbHkgdG8gZ2VuZXJhdGUgY29uc2lzdGVudCBJRHMuXG4gKiAgIC0gfFxuICogICAgIDpoZWFydDogTWFueSB0aGFua3MgdG8gdGhlIGF1dGhvciBbR2VyYWludCBMdWZmXShodHRwczovL2dpdGh1Yi5jb20vZ2VyYWludGx1ZmYvc2hhMjU2LylcbiAqICAgICBmb3IgdGhpcyBtZXRob2QhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTSEEyNTYoX2lucHV0KSB7XG4gIGxldCBpbnB1dCA9IF9pbnB1dDtcblxuICBsZXQgbWF0aFBvdyA9IE1hdGgucG93O1xuICBsZXQgbWF4V29yZCA9IG1hdGhQb3coMiwgMzIpO1xuICBsZXQgbGVuZ3RoUHJvcGVydHkgPSAnbGVuZ3RoJztcbiAgbGV0IGk7IGxldCBqOyAvLyBVc2VkIGFzIGEgY291bnRlciBhY3Jvc3MgdGhlIHdob2xlIGZpbGVcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIGxldCB3b3JkcyA9IFtdO1xuICBsZXQgYXNjaWlCaXRMZW5ndGggPSBpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gKiA4O1xuXG4gIC8vKiBjYWNoaW5nIHJlc3VsdHMgaXMgb3B0aW9uYWwgLSByZW1vdmUvYWRkIHNsYXNoIGZyb20gZnJvbnQgb2YgdGhpcyBsaW5lIHRvIHRvZ2dsZVxuICAvLyBJbml0aWFsIGhhc2ggdmFsdWU6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgZmlyc3QgOCBwcmltZXNcbiAgLy8gKHdlIGFjdHVhbGx5IGNhbGN1bGF0ZSB0aGUgZmlyc3QgNjQsIGJ1dCBleHRyYSB2YWx1ZXMgYXJlIGp1c3QgaWdub3JlZClcbiAgbGV0IGhhc2ggPSBTSEEyNTYuaCA9IFNIQTI1Ni5oIHx8IFtdO1xuICAvLyBSb3VuZCBjb25zdGFudHM6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDY0IHByaW1lc1xuICBsZXQgayA9IFNIQTI1Ni5rID0gU0hBMjU2LmsgfHwgW107XG4gIGxldCBwcmltZUNvdW50ZXIgPSBrW2xlbmd0aFByb3BlcnR5XTtcbiAgLyovXG4gICAgbGV0IGhhc2ggPSBbXSwgayA9IFtdO1xuICAgIGxldCBwcmltZUNvdW50ZXIgPSAwO1xuICAgIC8vKi9cblxuICBsZXQgaXNDb21wb3NpdGUgPSB7fTtcbiAgZm9yIChsZXQgY2FuZGlkYXRlID0gMjsgcHJpbWVDb3VudGVyIDwgNjQ7IGNhbmRpZGF0ZSsrKSB7XG4gICAgaWYgKCFpc0NvbXBvc2l0ZVtjYW5kaWRhdGVdKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMzEzOyBpICs9IGNhbmRpZGF0ZSlcbiAgICAgICAgaXNDb21wb3NpdGVbaV0gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGhhc2hbcHJpbWVDb3VudGVyXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMC41KSAqIG1heFdvcmQpIHwgMDtcbiAgICAgIGtbcHJpbWVDb3VudGVyKytdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAxIC8gMykgKiBtYXhXb3JkKSB8IDA7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQgKz0gJ1xceDgwJzsgLy8gQXBwZW5kIMaHJyBiaXQgKHBsdXMgemVybyBwYWRkaW5nKVxuICB3aGlsZSAoaW5wdXRbbGVuZ3RoUHJvcGVydHldICUgNjQgLSA1NilcbiAgICBpbnB1dCArPSAnXFx4MDAnOyAvLyBNb3JlIHplcm8gcGFkZGluZ1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbnB1dFtsZW5ndGhQcm9wZXJ0eV07IGkrKykge1xuICAgIGogPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChqID4+IDgpXG4gICAgICByZXR1cm47IC8vIEFTQ0lJIGNoZWNrOiBvbmx5IGFjY2VwdCBjaGFyYWN0ZXJzIGluIHJhbmdlIDAtMjU1XG4gICAgd29yZHNbaSA+PiAyXSB8PSBqIDw8ICgoMyAtIGkpICUgNCkgKiA4O1xuICB9XG5cbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9ICgoYXNjaWlCaXRMZW5ndGggLyBtYXhXb3JkKSB8IDApO1xuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKGFzY2lpQml0TGVuZ3RoKTtcblxuICAvLyBwcm9jZXNzIGVhY2ggY2h1bmtcbiAgZm9yIChqID0gMDsgaiA8IHdvcmRzW2xlbmd0aFByb3BlcnR5XTspIHtcbiAgICBsZXQgdyA9IHdvcmRzLnNsaWNlKGosIGogKz0gMTYpOyAvLyBUaGUgbWVzc2FnZSBpcyBleHBhbmRlZCBpbnRvIDY0IHdvcmRzIGFzIHBhcnQgb2YgdGhlIGl0ZXJhdGlvblxuICAgIGxldCBvbGRIYXNoID0gaGFzaDtcblxuICAgIC8vIFRoaXMgaXMgbm93IHRoZSB1bmRlZmluZWR3b3JraW5nIGhhc2hcIiwgb2Z0ZW4gbGFiZWxsZWQgYXMgdmFyaWFibGVzIGEuLi5nXG4gICAgLy8gKHdlIGhhdmUgdG8gdHJ1bmNhdGUgYXMgd2VsbCwgb3RoZXJ3aXNlIGV4dHJhIGVudHJpZXMgYXQgdGhlIGVuZCBhY2N1bXVsYXRlXG4gICAgaGFzaCA9IGhhc2guc2xpY2UoMCwgOCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIGludG8gNjQgd29yZHNcbiAgICAgIC8vIFVzZWQgYmVsb3cgaWZcbiAgICAgIGxldCB3MTUgPSB3W2kgLSAxNV07IGxldCB3MiA9IHdbaSAtIDJdO1xuXG4gICAgICAvLyBJdGVyYXRlXG4gICAgICBsZXQgYSA9IGhhc2hbMF07IGxldCBlID0gaGFzaFs0XTtcbiAgICAgIGxldCB0ZW1wMSA9IGhhc2hbN11cbiAgICAgICAgICAgICAgICArICgoKGUgPj4+IDYpIHwgKGUgPDwgMjYpKSBeICgoZSA+Pj4gMTEpIHwgKGUgPDwgMjEpKSBeICgoZSA+Pj4gMjUpIHwgKGUgPDwgNykpKSAvLyBTMVxuICAgICAgICAgICAgICAgICsgKChlICYgaGFzaFs1XSkgXiAoKH5lKSAmIGhhc2hbNl0pKSAvLyBjaFxuICAgICAgICAgICAgICAgICsga1tpXVxuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICArICh3W2ldID0gKGkgPCAxNikgPyB3W2ldIDogKFxuICAgICAgICAgICAgICAgICAgd1tpIC0gMTZdXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcxNSA+Pj4gNykgfCAodzE1IDw8IDI1KSkgXiAoKHcxNSA+Pj4gMTgpIHwgKHcxNSA8PCAxNCkpIF4gKHcxNSA+Pj4gMykpIC8vIHMwXG4gICAgICAgICAgICAgICAgICAgICAgICArIHdbaSAtIDddXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcyID4+PiAxNykgfCAodzIgPDwgMTUpKSBeICgodzIgPj4+IDE5KSB8ICh3MiA8PCAxMykpIF4gKHcyID4+PiAxMCkpIC8vIHMxXG4gICAgICAgICAgICAgICAgKSB8IDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgLy8gVGhpcyBpcyBvbmx5IHVzZWQgb25jZSwgc28gKmNvdWxkKiBiZSBtb3ZlZCBiZWxvdywgYnV0IGl0IG9ubHkgc2F2ZXMgNCBieXRlcyBhbmQgbWFrZXMgdGhpbmdzIHVucmVhZGJsZVxuICAgICAgbGV0IHRlbXAyID0gKCgoYSA+Pj4gMikgfCAoYSA8PCAzMCkpIF4gKChhID4+PiAxMykgfCAoYSA8PCAxOSkpIF4gKChhID4+PiAyMikgfCAoYSA8PCAxMCkpKSAvLyBTMFxuICAgICAgICAgICAgICAgICsgKChhICYgaGFzaFsxXSkgXiAoYSAmIGhhc2hbMl0pIF4gKGhhc2hbMV0gJiBoYXNoWzJdKSk7IC8vIG1halxuXG4gICAgICBoYXNoID0gWyh0ZW1wMSArIHRlbXAyKSB8IDBdLmNvbmNhdChoYXNoKTsgLy8gV2UgZG9uJ3QgYm90aGVyIHRyaW1taW5nIG9mZiB0aGUgZXh0cmEgb25lcywgdGhleSdyZSBoYXJtbGVzcyBhcyBsb25nIGFzIHdlJ3JlIHRydW5jYXRpbmcgd2hlbiB3ZSBkbyB0aGUgc2xpY2UoKVxuICAgICAgaGFzaFs0XSA9IChoYXNoWzRdICsgdGVtcDEpIHwgMDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKVxuICAgICAgaGFzaFtpXSA9IChoYXNoW2ldICsgb2xkSGFzaFtpXSkgfCAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIGZvciAoaiA9IDM7IGogKyAxOyBqLS0pIHtcbiAgICAgIGxldCBiID0gKGhhc2hbaV0gPj4gKGogKiA4KSkgJiAyNTU7XG4gICAgICByZXN1bHQgKz0gKChiIDwgMTYpID8gMCA6ICcnKSArIGIudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQge1xuICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUixcbiAgTVlUSElYX1NIQURPV19QQVJFTlQsXG4gIE1ZVEhJWF9UWVBFLFxuICBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSxcbiAgUVVFUllfRU5HSU5FX1RZUEUsXG59IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuaW1wb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5cbmltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJy4vZHluYW1pYy1wcm9wZXJ0eS5qcyc7XG5cbi8qKlxuICogdHlwZTogTmFtZXNwYWNlXG4gKiBuYW1lOiBVdGlsc1xuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgIE1pc2MgdXRpbGl0eSBmdW5jdGlvbnMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE1ldGhvZHMoX3Byb3RvLCBza2lwUHJvdG9zKSB7XG4gIGxldCBwcm90byAgICAgICAgICAgPSBfcHJvdG87XG4gIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKHByb3RvKSB7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG8pO1xuICAgIGxldCBrZXlzICAgICAgICA9IE9iamVjdC5rZXlzKGRlc2NyaXB0b3JzKS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhkZXNjcmlwdG9ycykpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgfHwga2V5ID09PSAncHJvdG90eXBlJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXMoa2V5KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZChrZXkpO1xuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzW2tleV07XG5cbiAgICAgIC8vIENhbiBpdCBiZSBjaGFuZ2VkP1xuICAgICAgaWYgKGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIElmIGlzIGdldHRlciwgdGhlbiBza2lwXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdnZXQnKSB8fCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ3NldCcpKSB7XG4gICAgICAgIGxldCBuZXdEZXNjcmlwdG9yID0geyAuLi5kZXNjcmlwdG9yIH07XG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLmdldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLmdldCA9IG5ld0Rlc2NyaXB0b3IuZ2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3Iuc2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3Iuc2V0ID0gbmV3RGVzY3JpcHRvci5zZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBuZXdEZXNjcmlwdG9yKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB2YWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cbiAgICAgIC8vIFNraXAgcHJvdG90eXBlIG9mIE9iamVjdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBPYmplY3QucHJvdG90eXBlW2tleV0gPT09IHZhbHVlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHsgLi4uZGVzY3JpcHRvciwgdmFsdWU6IHZhbHVlLmJpbmQodGhpcykgfSk7XG4gICAgfVxuXG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIGJyZWFrO1xuXG4gICAgaWYgKHNraXBQcm90b3MgJiYgc2tpcFByb3Rvcy5pbmRleE9mKHByb3RvKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4oc3RhcnRQcm90bywgZGVzY3JpcHRvck5hbWUpIHtcbiAgbGV0IHRoaXNQcm90byA9IHN0YXJ0UHJvdG87XG4gIGxldCBkZXNjcmlwdG9yO1xuXG4gIHdoaWxlICh0aGlzUHJvdG8gJiYgIShkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzUHJvdG8sIGRlc2NyaXB0b3JOYW1lKSkpXG4gICAgdGhpc1Byb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXNQcm90byk7XG5cbiAgcmV0dXJuIHsgcHJvdG90eXBlOiB0aGlzUHJvdG8sIGRlc2NyaXB0b3IgfTtcbn1cblxuY29uc3QgTUVUQURBVEFfU1RPUkFHRSA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvbWV0YWRhdGEtc3RvcmFnZScpO1xuY29uc3QgTUVUQURBVEFfV0VBS01BUCA9IGdsb2JhbFRoaXMubXl0aGl4VUlbTUVUQURBVEFfU1RPUkFHRV0gPSAoZ2xvYmFsVGhpcy5teXRoaXhVSVtNRVRBREFUQV9TVE9SQUdFXSkgPyBnbG9iYWxUaGlzLm15dGhpeFVJW01FVEFEQVRBX1NUT1JBR0VdIDogbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YSBvbiBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSByZWZlcmVuY2UuXG4gKlxuICogICBUaGlzIGZ1bmN0aW9uIHVzZXMgYW4gaW50ZXJuYWwgV2Vha01hcCB0byBzdG9yZSBtZXRhZGF0YSBmb3IgYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgdmFsdWUuXG4gKlxuICogICBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBwcm92aWRlZCB3aWxsIGNoYW5nZSB0aGUgYmVoYXZpb3Igb2YgdGhpcyBmdW5jdGlvbjpcbiAqICAgMS4gSWYgb25seSBvbmUgYXJndW1lbnQgaXMgc3VwcGxpZWQgKGEgYHRhcmdldGApLCB0aGVuIGEgTWFwIG9mIG1ldGFkYXRhIGtleS92YWx1ZSBwYWlycyBpcyByZXR1cm5lZC5cbiAqICAgMi4gSWYgb25seSB0d28gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgdGhlbiBgbWV0YWRhdGFgIGFjdHMgYXMgYSBnZXR0ZXIsIGFuZCB0aGUgdmFsdWUgc3RvcmVkIHVuZGVyIHRoZSBzcGVjaWZpZWQgYGtleWAgaXMgcmV0dXJuZWQuXG4gKiAgIDMuIElmIG1vcmUgdGhhbiB0d28gYXJndW1lbnRzIGFyZSBzdXBwbGllZCwgdGhlbiBgbWV0YWRhdGFgIGFjdHMgYXMgYSBzZXR0ZXIsIGFuZCBgdGFyZ2V0YCBpcyByZXR1cm5lZCAoZm9yIGNvbnRpbnVlZCBjaGFpbmluZykuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdGFyZ2V0XG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdGhlIHZhbHVlIGZvciB3aGljaCBtZXRhZGF0YSBpcyBiZWluZyBzdG9yZWQgb3IgcmV0cmlldmVkLlxuICogICAgICAgVGhpcyBjYW4gYmUgYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgdmFsdWUgKGFueSB2YWx1ZSB0aGF0IGNhbiBiZSB1c2VkIGFzIGEga2V5IGluIGEgV2Vha01hcCkuXG4gKiAgIC0gbmFtZToga2V5XG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIG9wdGlvbmFsOiB0cnVlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIGtleSB1c2VkIHRvIHN0b3JlIG9yIGZldGNoIHRoZSBzcGVjaWZpZWQgbWV0YWRhdGEgdmFsdWUuIFRoaXMgY2FuIGJlIGFueSB2YWx1ZSwgYXMgdGhlIHVuZGVybHlpbmdcbiAqICAgICAgIHN0b3JhZ2UgaXMgYSBNYXAuXG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgb3B0aW9uYWw6IHRydWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgdmFsdWUgdG8gc3RvcmUgb24gdGhlIGB0YXJnZXRgIHVuZGVyIHRoZSBzcGVjaWZpZWQgYGtleWAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGFueTtcbiAqICAgMS4gSWYgb25seSBvbmUgYXJndW1lbnQgaXMgcHJvdmlkZWQgKGEgYnVsayBnZXQgb3BlcmF0aW9uKSwgcmV0dXJuIGEgTWFwIGNvbnRhaW5pbmcgdGhlIG1ldGFkYXRhIGZvciB0aGUgc3BlY2lmaWVkIGB0YXJnZXRgLlxuICogICAyLiBJZiB0d28gYXJndW1lbnRzIGFyZSBwcm92aWRlZCAoYSBnZXQgb3BlcmF0aW9uKSwgdGhlIGB0YXJnZXRgIG1ldGFkYXRhIHZhbHVlIHN0b3JlZCBmb3IgdGhlIHNwZWNpZmllZCBga2V5YC5cbiAqICAgMi4gSWYgbW9yZSB0aGFuIHR3byBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIChhIHNldCBvcGVyYXRpb24pLCB0aGUgcHJvdmlkZWQgYHRhcmdldGAgaXMgcmV0dXJuZWQuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IFV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgLy8gc2V0XG4gKiAgICAgVXRpbHMubWV0YWRhdGEobXlFbGVtZW50LCAnY3VzdG9tQ2FwdGlvbicsICdNZXRhZGF0YSBDYXB0aW9uIScpO1xuICpcbiAqICAgICAvLyBnZXRcbiAqICAgICBjb25zb2xlLmxvZyhVdGlscy5tZXRhZGF0YShteUVsZW1lbnQsICdjdXN0b21DYXB0aW9uJykpO1xuICogICAgIC8vIG91dHB1dCAtPiAnTWV0YWRhdGEgQ2FwdGlvbiEnXG4gKlxuICogICAgIC8vIGdldCBhbGxcbiAqICAgICBjb25zb2xlLmxvZyhVdGlscy5tZXRhZGF0YShteUVsZW1lbnQpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gTWFwKDEpIHsgJ2N1c3RvbUNhcHRpb24nID0+ICdNZXRhZGF0YSBDYXB0aW9uIScgfVxuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWV0YWRhdGEodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gIGxldCBkYXRhID0gTUVUQURBVEFfV0VBS01BUC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkYXRhKSB7XG4gICAgaWYgKCFCYXNlVXRpbHMuaXNDb2xsZWN0YWJsZSh0YXJnZXQpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gKGRhdGEpID8gZGF0YS5nZXQoa2V5KSA6IHVuZGVmaW5lZDtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBWQUxJRF9KU19JREVOVElGSUVSID0gL15bYS16QS1aXyRdW2EtekEtWjAtOV8kXSokLztcbmNvbnN0IFJFU0VSVkVEX0lERU5USUZJRVIgPSAvXihicmVha3xjYXNlfGNhdGNofGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZXhwb3J0fGV4dGVuZHN8ZmFsc2V8ZmluYWxseXxmb3J8ZnVuY3Rpb258aWZ8aW1wb3J0fGlufGluc3RhbmNlb2Z8bmV3fG51bGx8cmV0dXJufHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRydWV8dHJ5fHR5cGVvZnx2YXJ8dm9pZHx3aGlsZXx3aXRofGxldHxzdGF0aWN8eWllbGQpJC87XG5cbmZ1bmN0aW9uIGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0LCAuLi5leHRyYUNvbnRleHRzKSB7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBBcnJheS5mcm9tKFxuICAgIG5ldyBTZXQoZ2V0QWxsUHJvcGVydHlOYW1lcyhjb250ZXh0KS5jb25jYXQoXG4gICAgICBPYmplY3Qua2V5cyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KSxcbiAgICAgIFsgJ2F0dHJpYnV0ZXMnLCAnY2xhc3NMaXN0JywgJyQkJywgJ2kxOG4nIF0sXG4gICAgICAuLi5leHRyYUNvbnRleHRzLm1hcCgoZXh0cmFDb250ZXh0KSA9PiBPYmplY3Qua2V5cyhleHRyYUNvbnRleHQgfHwge30pKSxcbiAgICApKSxcbiAgKS5maWx0ZXIoKG5hbWUpID0+IHtcbiAgICBpZiAoUkVTRVJWRURfSURFTlRJRklFUi50ZXN0KG5hbWUpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGB7JHtjb250ZXh0Q2FsbEFyZ3Muam9pbignLCcpfX1gO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2V0IHRoZSBwYXJlbnQgTm9kZSBvZiBgZWxlbWVudGAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogZWxlbWVudFxuICogICAgIGRhdGFUeXBlOiBOb2RlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIE5vZGUgd2hvc2UgcGFyZW50IHlvdSB3aXNoIHRvIGZpbmQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFVubGlrZSBbTm9kZS5wYXJlbnROb2RlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9wYXJlbnROb2RlKSwgdGhpc1xuICogICAgIHdpbGwgYWxzbyBzZWFyY2ggYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcy5cbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6ICoqU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgb25seSB3b3JrcyBmb3IgTXl0aGl4IFVJIGNvbXBvbmVudHMhKipcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIGlzIGFjY29tcGxpc2hlZCB2aWEgbGV2ZXJhZ2luZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1ldGFkYXRhOyBvblxuICogICAgIGBlbGVtZW50YC4gV2hlbiBhIGBudWxsYCBwYXJlbnQgaXMgZW5jb3VudGVyZWQsIGBnZXRQYXJlbnROb2RlYCB3aWxsIGxvb2sgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9TSEFET1dfUEFSRU5UO1xuICogICAgIG9uIGBlbGVtZW50YC4gSWYgZm91bmQsIHRoZSByZXN1bHQgaXMgY29uc2lkZXJlZCB0aGUgW3BhcmVudCBOb2RlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9wYXJlbnROb2RlKSBvZiBgZWxlbWVudGAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIE5vZGU7IFRoZSBwYXJlbnQgbm9kZSwgaWYgdGhlcmUgaXMgYW55LCBvciBgbnVsbGAgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAoZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiBtZXRhZGF0YShlbGVtZW50LnBhcmVudE5vZGUsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKSB8fCBudWxsO1xuXG4gIGlmICghZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gbWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX1NIQURPV19QQVJFTlQpIHx8IG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENyZWF0ZSBhIFByb3h5IHRoYXQgaXMgZXNzZW50aWFsbHkgKGZ1bmN0aW9uYWxseSkgYSBtdWx0aS1wcm90b3R5cGUgYG9iamVjdGAgaW5zdGFuY2UuXG4gKlxuICogICBBIFwic2NvcGVcIiBpbiBNeXRoaXggVUkgbWlnaHQgYmUgYmV0dGVyIGNhbGxlZCBhIFwiY29udGV4dFwiLi4uIGhvd2V2ZXIsIFwic2NvcGVcIlxuICogICB3YXMgY2hvc2VuIGJlY2F1c2UgaXQgKmlzKiBhIHNjb3BlLi4uIG9yIG1pZ2h0IGJlIGJldHRlciBkZXNjcmliZWQgYXMgXCJtdWx0aXBsZSBzY29wZXMgaW4gb25lXCIuXG4gKiAgIFRoaXMgaXMgc3BlY2lmaWNhbGx5IGEgXCJET00gc2NvcGVcIiwgaW4gdGhhdCB0aGlzIG1ldGhvZCBpcyBcIkRPTSBhd2FyZVwiIGFuZCB3aWxsIHRyYXZlcnNlIHRoZVxuICogICBET00gbG9va2luZyBmb3IgdGhlIHJlcXVlc3RlZCBkYXRhIChpZiBhbnkgb2YgdGhlIHNwZWNpZmllZCBgdGFyZ2V0c2AgaXMgYW4gRWxlbWVudCB0aGF0IGlzKS5cbiAqXG4gKiAgIFRoZSB3YXkgdGhpcyB3b3JrcyBpcyB0aGF0IHRoZSBjYWxsZXIgd2lsbCBwcm92aWRlIGF0IGxlYXN0IG9uZSBcInRhcmdldFwiLiBUaGVzZSB0YXJnZXRzIGFyZVxuICogICB0aGVtc2VsdmVzIHNjb3BlcywgZWxlbWVudHMsIG9yIG90aGVyIGRhdGEgb2JqZWN0cy4gV2hlbiB0aGUgcmV0dXJuZWQgUHJveHkgaW5zdGFuY2UgaXMgYWNjZXNzZWQsXG4gKiAgIHRoZSByZXF1ZXN0ZWQga2V5IGlzIHNlYXJjaGVkIGluIGFsbCBwcm92aWRlZCBgdGFyZ2V0c2AsIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgcHJvdmlkZWQuXG4gKlxuICogICBBc2lkZSBmcm9tIHNlYXJjaGluZyBhbGwgdGFyZ2V0cyBmb3IgdGhlIGRlc2lyZWQga2V5LCBpdCB3aWxsIGFsc28gZmFsbGJhY2sgdG8gb3RoZXIgZGF0YSBzb3VyY2VzXG4gKiAgIGl0IHNlYXJjaGVzIGluIGFzIHdlbGw6XG4gKiAgIDEuIElmIGFueSBnaXZlbiBgdGFyZ2V0YCBpdCBpcyBzZWFyY2hpbmcgaXMgYW4gRWxlbWVudCwgdGhlbiBpdCB3aWxsIGFsc28gc2VhcmNoXG4gKiAgICAgIGZvciB0aGUgcmVxdWVzdGVkIGtleSBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gKiAgIDIuIElmIHN0ZXAgIzEgaGFzIGZhaWxlZCwgdGhlbiBtb3ZlIHRvIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgY3VycmVudCBFbGVtZW50IGluc3RhbmNlLCBhbmRcbiAqICAgICAgcmVwZWF0IHRoZSBwcm9jZXNzLCBzdGFydGluZyBmcm9tIHN0ZXAgIzEuXG4gKiAgIDMuIEFmdGVyIHN0ZXBzIDEtMiBhcmUgcmVwZWF0ZWQgZm9yIGV2ZXJ5IGdpdmVuIGB0YXJnZXRgIChhbmQgYWxsIHBhcmVudCBub2RlcyBvZiB0aG9zZSBgdGFyZ2V0c2AuLi4gaWYgYW55KSxcbiAqICAgICAgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGZpbmFsbHkgZmFsbGJhY2sgdG8gc2VhcmNoaW5nIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlYCBmb3IgdGhlIHJlcXVlc3RlZCBrZXkuXG4gKlxuICogICBXZSBhcmVuJ3QgcXVpdGUgZmluaXNoZWQgeWV0IHRob3VnaC4uLlxuICpcbiAqICAgSWYgc3RlcHMgMS0zIGFib3ZlIGFsbCBmYWlsLCB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgc3RpbGwgZmFsbGJhY2sgdG8gdGhlIGZhbGxvd2luZyBoYXJkLWNvZGVkIGtleS92YWx1ZSBwYWlyczpcbiAqICAgMS4gQSByZXF1ZXN0ZWQga2V5IG9mIGAnZ2xvYmFsU2NvcGUnYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiBgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZWAgYmVpbmcgcmV0dXJuZWQuXG4gKiAgIDIuIEEgcmVxdWVzdGVkIGtleSBvZiBgJ2kxOG4nYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiB0aGUgYnVpbHQtaW4gYGkxOG5gIGxhbmd1YWdlIHRlcm0gcHJvY2Vzc29yIGJlaW5nIHJldHVybmVkLlxuICogICAzLiBBIHJlcXVlc3RlZCBrZXkgb2YgYCdkeW5hbWljUHJvcElEJ2AgKGlmIG5vdCBmb3VuZCBvbiBhIHRhcmdldCkgd2lsbCByZXN1bHQgaW4gdGhlIGJ1aWx0LWluIGBkeW5hbWljUHJvcElEYCBkeW5hbWljIHByb3BlcnR5IHByb3ZpZGVkLiBTZWUgQHNlZSBVdGlscy5keW5hbWljUHJvcElEOy5cbiAqXG4gKiAgIEZpbmFsbHksIHRoZSByZXR1cm5lZCBQcm94eSB3aWxsIGFsc28gaW50ZXJjZXB0IGFueSB2YWx1ZSBbc2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm94eS9Qcm94eS9zZXQpIG9wZXJhdGlvbixcbiAqICAgdG8gc2V0IGEgdmFsdWUgb24gdGhlIGZpcnN0IHRhcmdldCBmb3VuZC5cbiAqXG4gKiAgIFRoZSBQcm94eSBhbHNvIG92ZXJsb2FkcyBbb3duS2V5c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJveHkvUHJveHkvb3duS2V5cykgdG8gbGlzdCAqKmFsbCoqIGtleXMgYWNyb3NzICoqYWxsKiogYHRhcmdldHNgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IC4uLnRhcmdldHNcbiAqICAgICBkYXRhVHlwZXM6XG4gKiAgICAgICAtIE9iamVjdFxuICogICAgICAgLSBFbGVtZW50XG4gKiAgICAgICAtIG5vbi1wcmltaXRpdmVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgYHRhcmdldHNgIHRvIGJlIHNlYXJjaGVkLCBpbiB0aGUgb3JkZXIgcHJvdmlkZWQuIFRhcmdldHMgYXJlIHNlYXJjaGVkIGJvdGggZm9yIGdldCBvcGVyYXRpb25zLCBhbmQgc2V0IG9wZXJhdGlvbnMgKHRoZSBmaXJzdCB0YXJnZXQgZm91bmQgd2lsbCBiZSB0aGUgc2V0IHRhcmdldCkuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IE15dGhpeCBVSSB3aWxsIGRlbGliZXJhdGVseSBuZXZlciBkaXJlY3RseSBhY2Nlc3MgYGdsb2JhbFRoaXNgIGZyb20gdGhlIHRlbXBsYXRlIGVuZ2luZSAoZm9yIHNlY3VyaXR5IHJlYXNvbnMpLlxuICogICAgIEJlY2F1c2Ugb2YgdGhpcywgTXl0aGl4IFVJIGF1dG9tYXRpY2FsbHkgcHJvdmlkZXMgaXRzIG93biBnbG9iYWwgc2NvcGUgYGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVgLlxuICogICAgIElmIHlvdSB3YW50IGRhdGEgdG8gYmUgXCJnbG9iYWxseVwiIHZpc2libGUgdG8gTXl0aGl4IFVJLCB0aGVuIHlvdSBuZWVkIHRvIGFkZCB5b3VyIGRhdGEgdG8gdGhpcyBzcGVjaWFsIGdsb2JhbCBzY29wZS5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgbWV0aG9kIGlzIGNvbXBsZXggYmVjYXVzZSBpdCBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIHRvIHByb3ZpZGUgYSBcInNjb3BlXCIgdG8gdGhlIE15dGhpeCBVSSB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqICAgICBUaGUgdGVtcGxhdGluZyBlbmdpbmUgbmVlZHMgdG8gYmUgRE9NIGF3YXJlLCBhbmQgYWxzbyBuZWVkcyB0byBoYXZlIGFjY2VzcyB0byBzcGVjaWFsaXplZCwgc2NvcGVkIGRhdGFcbiAqICAgICAoaS5lLiB0aGUgYG15dGhpeC11aS1mb3ItZWFjaGAgY29tcG9uZW50IHdpbGwgcHVibGlzaCBzY29wZWQgZGF0YSBmb3IgZWFjaCBpdGVyYXRpb24sIHdoaWNoIG5lZWRzIHRvIGJlIGJvdGhcbiAqICAgICBET00tYXdhcmUsIGFuZCBpdGVyYXRpb24tYXdhcmUpLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogQW55IHByb3ZpZGVkIGB0YXJnZXRgIGNhbiBhbHNvIGJlIG9uZSBvZiB0aGVzZSBQcm94eSBzY29wZXMgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBJdCBjYW4gaGVscCB0byB0aGluayBvZiB0aGUgcmV0dXJuZWQgXCJzY29wZVwiIGFzIGFuIHBsYWluIE9iamVjdCB0aGF0IGhhcyBhbiBhcnJheSBvZiBwcm90b3R5cGVzLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBQcm94eTsgQSBwcm94eSBpbnN0YW5jZSwgdGhhdCBpcyB1c2VkIHRvIGdldCBhbmQgc2V0IGtleXMgYWNyb3NzIG11bHRpcGxlIGB0YXJnZXRzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNjb3BlKC4uLl90YXJnZXRzKSB7XG4gIGNvbnN0IGZpbmRQcm9wTmFtZVNjb3BlID0gKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgT2JqZWN0LmlzKHRhcmdldCwgTmFOKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuXG4gICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCBzZWFyY2hQYXJlbnROb2Rlc0ZvcktleSA9IChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgaWYgKCFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiBjdXJyZW50RWxlbWVudClcbiAgICAgICAgICByZXR1cm4gY3VycmVudEVsZW1lbnQ7XG5cbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlYXJjaFBhcmVudE5vZGVzRm9yS2V5KHRhcmdldCk7XG4gIH07XG5cbiAgbGV0IHRhcmdldHMgICAgICAgICA9IF90YXJnZXRzLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZpcnN0RWxlbWVudCAgICA9IHRhcmdldHMuZmluZCgodGFyZ2V0KSA9PiAodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHx8IHRhcmdldHNbMF07XG4gIGxldCBiYXNlQ29udGV4dCAgICAgPSB7fTtcbiAgbGV0IGZhbGxiYWNrQ29udGV4dCA9IHtcbiAgICBnbG9iYWxTY29wZTogIChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpLFxuICAgIGkxOG46ICAgICAgICAgKHBhdGgsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGxhbmd1YWdlUHJvdmlkZXIgPSBzcGVjaWFsQ2xvc2VzdChmaXJzdEVsZW1lbnQsICdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlcilcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgICAgcmV0dXJuIGxhbmd1YWdlUHJvdmlkZXIuaTE4bihwYXRoLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0sXG4gICAgZHluYW1pY1Byb3BJRCxcbiAgfTtcblxuICB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoZmFsbGJhY2tDb250ZXh0KTtcbiAgbGV0IHByb3h5ICAgPSBuZXcgUHJveHkoYmFzZUNvbnRleHQsIHtcbiAgICBvd25LZXlzOiAoKSA9PiB7XG4gICAgICBsZXQgYWxsS2V5cyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cylcbiAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KGdldEFsbFByb3BlcnR5TmFtZXModGFyZ2V0KSk7XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKGdsb2JhbFNjb3BlKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoT2JqZWN0LmtleXMoZ2xvYmFsU2NvcGUpKTtcblxuICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhbGxLZXlzKSk7XG4gICAgfSxcbiAgICBoYXM6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gKHByb3BOYW1lIGluIGdsb2JhbFNjb3BlKTtcbiAgICB9LFxuICAgIGdldDogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gc2NvcGVbcHJvcE5hbWVdO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIGdsb2JhbFNjb3BlW3Byb3BOYW1lXTtcbiAgICB9LFxuICAgIHNldDogKF8sIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgZG9TZXQgPSAoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShzY29wZVtwcm9wTmFtZV0sIER5bmFtaWNQcm9wZXJ0eSkpXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNjb3BlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcblxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIGRvU2V0KHNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgcmV0dXJuIGRvU2V0KGdsb2JhbFNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpO1xuICAgIH0sXG4gIH0pO1xuXG4gIGZhbGxiYWNrQ29udGV4dC4kJCA9IHByb3h5O1xuXG4gIHJldHVybiBwcm94eTtcbn1cblxuY29uc3QgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRSA9IC9eJT9bXFx3LiRdKyQvO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ3JlYXRlIGEgY29udGV4dC1hd2FyZSBmdW5jdGlvbiwgb3IgXCJtYWNyb1wiLCB0aGF0IGNhbiBiZSBjYWxsZWQgYW5kIHVzZWQgYnkgdGhlIHRlbXBsYXRlIGVuZ2luZS5cbiAqXG4gKiAgIElmIHlvdSBhcmUgZXZlciB0cnlpbmcgdG8gcGFzcyBtZXRob2RzIG9yIGR5bmFtaWMgcHJvcGVydGllcyBhY3Jvc3MgdGhlIERPTSwgdGhlbiB0aGlzIGlzIHRoZSBtZXRob2QgeW91IHdhbnQgdG8gdXNlLCB0b1xuICogICBwcm9wZXJseSBcInBhcnNlXCIgYW5kIHVzZSB0aGUgYXR0cmlidXRlIHZhbHVlIGFzIGludGVuZGVkLlxuICpcbiAqICAgVGhpcyBpcyB1c2VkIGZvciBleGFtcGxlIGZvciBldmVudCBiaW5kaW5ncyB2aWEgYXR0cmlidXRlcy4gSWYgeW91IGhhdmUgZm9yIGV4YW1wbGUgYW4gYG9uY2xpY2s9XCJkb1NvbWV0aGluZ1wiYFxuICogICBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudCwgdGhlbiB0aGlzIHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBjb250ZXh0LWF3YXJlIFwibWFjcm9cIiBmb3IgdGhlIG1ldGhvZCBcImRvU29tZXRoaW5nXCIuXG4gKlxuICogICBUaGUgdGVybSBcIm1hY3JvXCIgaXMgdXNlZCBoZXJlIGJlY2F1c2UgdGhlcmUgYXJlIHNwZWNpYWwgZm9ybWF0cyBcInVuZGVyc3Rvb2RcIiBieSB0aGUgdGVtcGxhdGUgZW5naW5lLiBGb3IgZXhhbXBsZSxcbiAqICAgcHJlZml4aW5nIGFuIGF0dHJpYnV0ZSB2YWx1ZSB3aXRoIGEgcGVyY2VudCBzaWduLCBpLmUuIGBuYW1lPVwiJWdsb2JhbER5bmFtaWNQcm9wTmFtZVwiYCB3aWxsIHVzZSBAc2VlIFV0aWxzLmR5bmFtaWNQcm9wSUQ7XG4gKiAgIHRvIGdsb2JhbGx5IGZldGNoIHByb3BlcnR5IG9mIHRoaXMgbmFtZS4gVGhpcyBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgdGhlIERPTSwgeW91IG1pZ2h0XG4gKiAgIGJlIHJlcXVlc3RpbmcgYSBkeW5hbWljIHByb3BlcnR5IHRoYXQgaGFzbid0IHlldCBiZWVuIGxvYWRlZC9kZWZpbmVkLiBUaGlzIGlzIHRoZSBwdXJwb3NlIG9mIEBzZWUgVXRpbHMuZHluYW1pY1Byb3BJRDssXG4gKiAgIGFuZCB0aGlzIHNwZWNpYWxpemVkIHRlbXBsYXRlIGZvcm1hdDogdG8gcHJvdmlkZSBkeW5hbWljIHByb3BzIGJ5IGlkLCB0aGF0IHdpbGwgYmUgYXZhaWxhYmxlIHdoZW4gbmVlZGVkLlxuICpcbiAqICAgVGhlIHRlbXBsYXRlIGVuZ2luZSBhbHNvIHdpbGwgaGFwcGlseSBhY2NlcHQgcm9ndWUgbWV0aG9kIG5hbWVzLiBGb3IgZXhhbXBsZSwgaW4gYSBNeXRoaXggVUkgY29tcG9uZW50IHlvdSBhcmUgYnVpbGRpbmcsXG4gKiAgIHlvdSBtaWdodCBoYXZlIGFuIGVsZW1lbnQgbGlrZSBgPGJ1dHRvbiBvbmNsaWNrPVwib25CdXR0b25DbGlja1wiPkNsaWNrIE1lITxidXR0b24+YC4gVGhlIHRlbXBsYXRpbmcgZW5naW5lIHdpbGwgZGV0ZWN0IHRoYXRcbiAqICAgdGhpcyBpcyBPTkxZIGFuIGlkZW50aWZpZXIsIGFuZCBzbyB3aWxsIHNlYXJjaCBmb3IgdGhlIHNwZWNpZmllZCBtZXRob2QgaW4gdGhlIGF2YWlsYWJsZSBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOyksXG4gKiAgIHdoaWNoIGluY2x1ZGVzIGB0aGlzYCBpbnN0YW5jZSBvZiB5b3VyIGNvbXBvbmVudCBhcyB0aGUgZmlyc3QgYHRhcmdldGAuIFRoaXMgcGF0dGVybiBpcyBub3QgcmVxdWlyZWQsIGFzIHlvdSBjYW4gY2FsbCB5b3VyXG4gKiAgIGNvbXBvbmVudCBtZXRob2QgZGlyZWN0bHkgeW91cnNlbGYsIGFzIHdpdGggYW55IGF0dHJpYnV0ZSBldmVudCBiaW5kaW5nIGluIHRoZSBET00sIGkuZTogYDxidXR0b24gb25jbGljaz1cInRoaXMub25CdXR0b25DbGljayhldmVudClcIj5DbGljayBNZSE8YnV0dG9uPmAuXG4gKlxuICogICBPbmUgbGFzdCB0aGluZyB0byBtZW50aW9uIGlzIHRoYXQgd2hlbiB0aGVzZSBcIm1hY3JvXCIgbWV0aG9kcyBhcmUgY2FsbGVkIGJ5IE15dGhpeCBVSSwgYWxsIGVudW1lcmFibGUga2V5cyBvZiB0aGUgZ2VuZXJhdGVkXG4gKiAgIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSBhcmUgcGFzc2VkIGludG8gdGhlIG1hY3JvIG1ldGhvZCBhcyBhcmd1bWVudHMuIFRoaXMgbWVhbnMgdGhhdCB0aGUga2V5cy92YWx1ZXMgb2YgYWxsIHNjb3BlIGB0YXJnZXRzYFxuICogICBhcmUgYXZhaWxhYmxlIGRpcmVjdGx5IGluIHlvdXIgamF2YXNjcmlwdCBzY29wZS4gaS5lLiB5b3UgY2FuIGRvIHRoaW5ncyBsaWtlIGBuYW1lPVwiY29tcG9uZW50SW5zdGFuY2VQcm9wZXJ0eSh0aGlzQXR0cmlidXRlMSwgb3RoZXJBdHRyaWJ1dGUpXCJgIHdpdGhvdXQgbmVlZGluZyB0byBkb1xuICogICBgbmFtZT1cInRoaXMuY29tcG9uZW50SW5zdGFuY2VQcm9wZXJ0eSh0aGlzLnRoaXNBdHRyaWJ1dGUxLCB0aGlzLm90aGVyQXR0cmlidXRlKVwiYC4gOndhcm5pbmc6IEl0IGlzIGltcG9ydGFudCB0byBrZWVwIGluIG1pbmQgdGhhdCBkaXJlY3QgcmVmZXJlbmNlIGFjY2VzcyBsaWtlIHRoaXMgaW4gYSBtYWNyb1xuICogICB3aWxsIGJ5cGFzcyB0aGUgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspIFByb3h5LCBhbmQgc28gaWYgdGhlIHNwZWNpZmllZCBrZXkgaXMgbm90IGZvdW5kIChwYXNzZWQgaW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIG1hY3JvKSwgdGhlbiBhbiBlcnJvciB3aWxsIGJlIHRocm93biBieSBqYXZhc2NyaXB0LlxuICpcbiAqICAgSXQgaXMgYWJzb2x1dGVseSBwb3NzaWJsZSBmb3IgeW91IHRvIHJlY2VpdmUgYW5kIHNlbmQgYXJndW1lbnRzIHZpYSB0aGVzZSBnZW5lcmF0ZWQgXCJtYWNyb3NcIi4gYG15dGhpeC11aS1zZWFyY2hgIGRvZXMgdGhpcyBmb3JcbiAqICAgZXhhbXBsZSB3aGVuIGEgXCJmaWx0ZXJcIiBtZXRob2QgaXMgcGFzc2VkIHZpYSBhbiBhdHRyaWJ1dGUuIEJ5IGRlZmF1bHQgbm8gZXh0cmEgYXJndW1lbnRzIGFyZSBwcm92aWRlZCB3aGVuIGNhbGxlZCBkaXJlY3RseSBieSB0aGUgdGVtcGxhdGluZyBlbmdpbmUuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogb3B0aW9uc1xuICogICAgIGRhdGFUeXBlOiBvYmplY3RcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBBbiBvYmplY3Qgd2l0aCB0aGUgc2hhcGUgYHsgYm9keTogc3RyaW5nOyBwcmVmaXg/OiBzdHJpbmc7IHNjb3BlOiBvYmplY3Q7IH1gLlxuICpcbiAqICAgICAgIDEuIGBib2R5YCBpcyB0aGUgYWN0dWFsIGJvZHkgb2YgdGhlIGBuZXcgRnVuY3Rpb25gLlxuICogICAgICAgMi4gYHNjb3BlYCBpcyB0aGUgc2NvcGUgKGB0aGlzYCkgdGhhdCB5b3Ugd2FudCB0byBiaW5kIHRvIHRoZSByZXN1bHRpbmcgbWV0aG9kLlxuICogICAgICAgICAgVGhpcyB3b3VsZCBnZW5lcmFsbHkgYmUgYSBzY29wZSBjcmVhdGVkIGJ5IEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7XG4gKiAgICAgICAzLiBgcHJlZml4YCBhbiBvcHRpb25hbCBwcmVmaXggZm9yIHRoZSBib2R5IG9mIHRoZSBgbmV3IEZ1bmN0aW9uYC4gVGhpcyBwcmVmaXggaXMgYWRkZWRcbiAqICAgICAgICAgIGJlZm9yZSBhbnkgZnVuY3Rpb24gYm9keSBjb2RlIHRoYXQgTXl0aGl4IFVJIGdlbmVyYXRlcy5cbiAqICAgICAgICAgIFNlZSBoZXJlIEBzb3VyY2VSZWYgX2NyZWF0ZVRlbXBsYXRlTWFjcm9QcmVmaXhGb3JCaW5kRXZlbnRUb0VsZW1lbnQ7IGZvciBhbiBleGFtcGxlIHVzZVxuICogICAgICAgICAgb2YgYHByZWZpeGAgKG5vdGljZSBob3cgYGFyZ3VtZW50c1sxXWAgaXMgdXNlZCBpbnN0ZWFkIG9mIGBhcmd1bWVudHNbMF1gLCBhcyBgYXJndW1lbnRzWzBdYCBpcyBhbHdheXMgcmVzZXJ2ZWRcbiAqICAgICAgICAgIGZvciBsb2NhbCB2YXJpYWJsZSBuYW1lcyBcImluamVjdGVkXCIgZnJvbSB0aGUgY3JlYXRlZCBcInNjb3BlXCIpLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBBc2lkZSBmb3Igc29tZSBiZWhpbmQtdGhlLXNjZW5lIG1vZGlmaWNhdGlvbnMgYW5kIGVhc2Utb2YtdXNlIHNsaWNrbmVzcywgdGhpcyBlc3NlbnRpYWxseSBqdXN0IGNyZWF0ZXMgYSBgbmV3IEZ1bmN0aW9uYCBhbmQgYmluZHMgYSBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykgdG8gaXQuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGUgcHJvdmlkZWQgKGFuZCBvcHRpb25hbCkgYHByZWZpeGAgY2FuIGJlIHVzZWQgYXMgdGhlIHN0YXJ0IG9mIHRoZSBtYWNybyBgbmV3IEZ1bmN0aW9uYCBib2R5IGNvZGUuIGkuZS4gQHNlZSBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQ7IGRvZXMgZXhhY3RseSB0aGlzIHRvIGFsbG93IGRpcmVjdCBzY29wZWRcbiAqICAgICBhY2Nlc3MgdG8gdGhlIGBldmVudGAgaW5zdGFuY2UuIEBzb3VyY2VSZWYgX2NyZWF0ZVRlbXBsYXRlTWFjcm9QcmVmaXhGb3JCaW5kRXZlbnRUb0VsZW1lbnQ7XG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGUgcmV0dXJuIG1ldGhvZCBpcyBib3VuZCBieSBjYWxsaW5nIGAuYmluZChzY29wZSlgLiBJdCBpcyBub3QgcG9zc2libGUgdG8gbW9kaWZ5IGB0aGlzYCBhdCB0aGUgY2FsbC1zaXRlLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBmdW5jdGlvbjsgQSBmdW5jdGlvbiB0aGF0IGlzIFwiY29udGV4dCBhd2FyZVwiIGJ5IGJlaW5nIGJvdW5kIHRvIHRoZSBwcm92aWRlZCBgc2NvcGVgIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVNYWNybyh7IHByZWZpeCwgYm9keSwgc2NvcGUgfSkge1xuICBsZXQgZnVuY3Rpb25Cb2R5ID0gYm9keTtcbiAgaWYgKGZ1bmN0aW9uQm9keS5jaGFyQXQoMCkgPT09ICclJyB8fCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSkge1xuICAgIGlmIChmdW5jdGlvbkJvZHkuY2hhckF0KDApID09PSAnJScpIHtcbiAgICAgIGZ1bmN0aW9uQm9keSA9IGAodGhpcy5keW5hbWljUHJvcElEIHx8IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCkoJyR7ZnVuY3Rpb25Cb2R5LnN1YnN0cmluZygxKS50cmltKCkucmVwbGFjZSgvJy9nLCAnXFxcXFxcJycpfScpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuY3Rpb25Cb2R5ID0gYCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IF9fX18kID0gJHtmdW5jdGlvbkJvZHl9O1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIF9fX18kID09PSAnZnVuY3Rpb24nKSA/IF9fX18kLmFwcGx5KHRoaXMsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgxKSkgOiBfX19fJDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiR7ZnVuY3Rpb25Cb2R5LnJlcGxhY2UoL15cXHMqdGhpc1xcLi8sICcnKX0uYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtgO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBnZXRDb250ZXh0Q2FsbEFyZ3Moc2NvcGUsIHsgJ19fbWFjcm9Tb3VyY2UnOiBudWxsLCAnX19leHBhbmRlZE1hY3JvU291cmNlJzogbnVsbCB9KTtcblxuICBmdW5jdGlvbkJvZHkgPSBgdHJ5IHsgJHsocHJlZml4KSA/IGAke3ByZWZpeH07YCA6ICcnfXJldHVybiAkeyhmdW5jdGlvbkJvZHkgfHwgJyh2b2lkIDApJykucmVwbGFjZSgvXlxccypyZXR1cm5cXHMrLywgJycpLnRyaW0oKX07IH0gY2F0Y2ggKGVycm9yKSB7IGNvbnNvbGUuZXJyb3IoXFxgRXJyb3IgaW4gbWFjcm8gW1xcJHtfX21hY3JvU291cmNlfV06XFxgLCBlcnJvciwgX19leHBhbmRlZE1hY3JvU291cmNlKTsgdGhyb3cgZXJyb3I7IH1gO1xuXG4gIGxldCBsb2NhbFNjb3BlID0gT2JqZWN0LmNyZWF0ZShzY29wZSk7XG4gIGxvY2FsU2NvcGUuX19tYWNyb1NvdXJjZSA9IGJvZHk7XG4gIGxvY2FsU2NvcGUuX19leHBhbmRlZE1hY3JvU291cmNlID0gZnVuY3Rpb25Cb2R5O1xuXG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKGNvbnRleHRDYWxsQXJncywgZnVuY3Rpb25Cb2R5KSkuYmluZChzY29wZSB8fCB7fSwgc2NvcGUpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgUGFyc2UgYSB0ZW1wbGF0ZSwgYW5kIHJldHVybiBpdHMgcGFydHMuIEEgdGVtcGxhdGUgXCJwYXJ0XCIgaXMgb25lIG9mIHR3byB0eXBlczogYCdsaXRlcmFsJ2AsIG9yIGAnbWFjcm8nYC5cbiAqXG4gKiAgIFRha2UgZm9yIGV4YW1wbGUgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZTogYCdIZWxsbyBcXEBAZ3JlZXRpbmdAQCEhISdgLiBUaGlzIHRlbXBsYXRlIHdvdWxkIHJlc3VsdCBpbiB0aHJlZSBcInBhcnRzXCIgYWZ0ZXIgcGFyc2luZzpcbiAqICAgMS4gYHsgdHlwZTogJ2xpdGVyYWwnLCBzb3VyY2U6ICdIZWxsbyAnLCBzdGFydDogMCwgZW5kOiA2IH1gXG4gKiAgIDIuIGB7IHR5cGU6ICdtYWNybycsIHNvdXJjZTogJ1xcQEBncmVldGluZ0BAJywgbWFjcm86IDxmdW5jdGlvbj4sIHN0YXJ0OiA2LCBlbmQ6IDE4IH1gXG4gKiAgIDMuIGB7IHR5cGU6ICdsaXRlcmFsJywgc291cmNlOiAnISEhJywgc3RhcnQ6IDE4LCBlbmQ6IDIxIH1gXG4gKlxuICogICBDb25jYXRlbmF0aW5nIGFsbCBgc291cmNlYCBwcm9wZXJ0aWVzIHRvZ2V0aGVyIHdpbGwgcmVzdWx0IGluIHRoZSBvcmlnaW5hbCBpbnB1dC5cbiAqICAgQ29uY2F0ZW5hdGluZyBhbGwgYHNvdXJjZWAgcHJvcGVydGllcywgYWxvbmcgd2l0aCB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgYWxsIGBtYWNyb2AgZnVuY3Rpb25zLCB3aWxsIHJlc3VsdCBpbiB0aGUgb3V0cHV0IChpLmUuIGBwYXJ0WzBdLnNvdXJjZSArIHBhcnRbMV0ubWFjcm8oKSArIHBhcnRbMl0uc291cmNlYCkuXG4gKiAgIFRoZSBgbWFjcm9gIHByb3BlcnR5IGlzIHRoZSBhY3R1YWwgbWFjcm8gZnVuY3Rpb24gZm9yIHRoZSBwYXJzZWQgdGVtcGxhdGUgcGFydCAoaS5lLiBpbiBvdXIgZXhhbXBsZSBgJ1xcQEBncmVldGluZ0BAJ2ApLlxuICogICBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgdGhlIG9mZnNldHMgZnJvbSB0aGUgb3JpZ2luYWwgYHRleHRgIHdoZXJlIHRoZSBwYXJ0IGNhbiBiZSBmb3VuZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB0ZXh0XG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSB0ZW1wbGF0ZSBzdHJpbmcgdG8gcGFyc2UuXG4gKiAgIC0gbmFtZTogb3B0aW9uc1xuICogICAgIGRhdGFUeXBlOiBvYmplY3RcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBPcHRpb25zIGZvciB0aGUgb3BlcmF0aW9uLiBUaGUgc2hhcGUgb2YgdGhpcyBvYmplY3QgaXMgYHsgcHJlZml4Pzogc3RyaW5nLCBzY29wZTogb2JqZWN0IH1gLlxuICogICAgICAgYHNjb3BlYCBkZWZpbmVzIHRoZSBzY29wZSBmb3IgbWFjcm9zIGNyZWF0ZWQgYnkgdGhpcyBtZXRob2QgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykuXG4gKiAgICAgICBgcHJlZml4YCBkZWZpbmVzIGEgZnVuY3Rpb24gYm9keSBwcmVmaXggdG8gdXNlIHdoaWxlIGNyZWF0aW5nIG1hY3JvcyAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlVGVtcGxhdGVNYWNybzspLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUbyBza2lwIHBhcnNpbmcgYSBzcGVjaWZpYyB0ZW1wbGF0ZSBwYXJ0LCBwcmVmaXggd2l0aCBhIGJhY2tzbGFzaCwgaS5lLiBgXFxcXFxcXFxAQGdyZWV0aW5nQEBgLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBBcnJheTxUZW1wbGF0ZVBhcnQ+OyAqKlRlbXBsYXRlUGFydCoqOiBgeyB0eXBlOiAnbGl0ZXJhbCcgfCAnbWFjcm8nLCBzb3VyY2U6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIG1hY3JvPzogZnVuY3Rpb24gfWAuIFJldHVybiBhbGwgcGFyc2VkIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGVQYXJ0cyh0ZXh0LCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgcGFydHMgICAgICAgICA9IFtdO1xuICBsZXQgY3VycmVudE9mZnNldCA9IDA7XG5cbiAgY29uc3QgYWRkTGl0ZXJhbCA9IChzdGFydE9mZnNldCwgZW5kT2Zmc2V0KSA9PiB7XG4gICAgbGV0IHNvdXJjZSA9IHRleHQuc3Vic3RyaW5nKHN0YXJ0T2Zmc2V0LCBlbmRPZmZzZXQpLnJlcGxhY2UoL1xcXFxAQC9nLCAnQEAnKTtcbiAgICBwYXJ0cy5wdXNoKHsgdHlwZTogJ2xpdGVyYWwnLCBzb3VyY2UsIHN0YXJ0OiBzdGFydE9mZnNldCwgZW5kOiBlbmRPZmZzZXQgfSk7XG4gIH07XG5cbiAgdGV4dC5yZXBsYWNlKC8oPzwhXFxcXCkoQEApKC4rPylcXDEvZywgKG0sIF8sIHBhcnNlZFRleHQsIG9mZnNldCkgPT4ge1xuICAgIGlmIChjdXJyZW50T2Zmc2V0IDwgb2Zmc2V0KVxuICAgICAgYWRkTGl0ZXJhbChjdXJyZW50T2Zmc2V0LCBvZmZzZXQpO1xuXG4gICAgY3VycmVudE9mZnNldCA9IG9mZnNldCArIG0ubGVuZ3RoO1xuXG4gICAgbGV0IG1hY3JvID0gY3JlYXRlVGVtcGxhdGVNYWNybyh7IC4uLm9wdGlvbnMsIGJvZHk6IHBhcnNlZFRleHQgfSk7XG4gICAgcGFydHMucHVzaCh7IHR5cGU6ICdtYWNybycsIHNvdXJjZTogbSwgbWFjcm8sIHN0YXJ0OiBvZmZzZXQsIGVuZDogY3VycmVudE9mZnNldCB9KTtcbiAgfSk7XG5cbiAgaWYgKGN1cnJlbnRPZmZzZXQgPCB0ZXh0Lmxlbmd0aClcbiAgICBhZGRMaXRlcmFsKGN1cnJlbnRPZmZzZXQsIHRleHQubGVuZ3RoKTtcblxuICByZXR1cm4gcGFydHM7XG59XG5cbmNvbnN0IE5PT1AgPSAoaXRlbSkgPT4gaXRlbTtcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbXBpbGUgdGhlIHRlbXBsYXRlIHBhcnRzIHRoYXQgd2VyZSBwYXJzZWQgYnkgQHNlZSBVdGlscy5wYXJzZVRlbXBsYXRlUGFydHM7LlxuICpcbiAqICAgSXQgaXMgYWxzbyBwb3NzaWJsZSB0byBwcm92aWRlIHRoaXMgbWV0aG9kIGFuIGFycmF5IG9mIEBzZWUgRWxlbWVudHMuRWxlbWVudERlZmluaXRpb247IGluc3RhbmNlcyxcbiAqICAgb3IgQHNlZSBRdWVyeUVuZ2luZS5RdWVyeUVuZ2luZTsgaW5zdGFuY2VzICh0aGF0IGNvbnRhaW4gQHNlZSBFbGVtZW50cy5FbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzKS5cbiAqICAgSWYgZWl0aGVyIG9mIHRoZXNlIHR5cGVzIGFyZSBmb3VuZCBpbiB0aGUgaW5wdXQgYXJyYXkgKGV2ZW4gb25lKSwgdGhlbiB0aGUgZW50aXJlIHJlc3VsdCBpcyByZXR1cm5lZFxuICogICBhcyBhIHJhdyBhcnJheS5cbiAqXG4gKiAgIE9yLCBpZiBhbnkgb2YgdGhlIHJlc3VsdGluZyBwYXJ0cyBpcyAqKm5vdCoqIGEgQHNlZSBVdGlscy5wYXJzZVRlbXBsYXRlUGFydHM/Y2FwdGlvbj1UZW1wbGF0ZVBhcnQ7IG9yIGEgYHN0cmluZ2AsXG4gKiAgIHRoZW4gcmV0dXJuIHRoZSByZXN1bHRpbmcgdmFsdWUgcmF3LlxuICpcbiAqICAgT3RoZXJ3aXNlLCBpZiBhbGwgcmVzdWx0aW5nIHBhcnRzIGFyZSBhIGBzdHJpbmdgLCB0aGVuIHRoZSByZXN1bHRpbmcgcGFydHMgYXJlIGpvaW5lZCwgYW5kIGEgYHN0cmluZ2AgaXMgcmV0dXJuZWQuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogcGFydHNcbiAqICAgICBkYXRhVHlwZXM6XG4gKiAgICAgICAtIEFycmF5PFRlbXBsYXRlUGFydD5cbiAqICAgICAgIC0gQXJyYXk8RWxlbWVudERlZmluaXRpb24+XG4gKiAgICAgICAtIEFycmF5PFF1ZXJ5RW5naW5lPlxuICogICAgICAgLSBBcnJheTxhbnk+XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHRlbXBsYXRlIHBhcnRzIHRvIGNvbXBpbGUgdG9nZXRoZXIuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIEFycmF5PGFueT47IEB0eXBlcyBzdHJpbmc7IFJldHVybiB0aGUgcmVzdWx0IGFzIGEgc3RyaW5nLCBvciBhbiBhcnJheSBvZiByYXcgdmFsdWVzLCBvciBhIHJhdyB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyhwYXJ0cywgY2FsbGJhY2spIHtcbiAgbGV0IHJlc3VsdCA9IHBhcnRzXG4gICAgLm1hcCgocGFydCkgPT4ge1xuICAgICAgaWYgKCFwYXJ0KVxuICAgICAgICByZXR1cm4gcGFydDtcblxuICAgICAgaWYgKHBhcnRbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSB8fCBwYXJ0W01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpXG4gICAgICAgIHJldHVybiBwYXJ0O1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAocGFydC50eXBlID09PSAnbGl0ZXJhbCcpXG4gICAgICAgICAgcmV0dXJuIHBhcnQuc291cmNlO1xuICAgICAgICBlbHNlIGlmIChwYXJ0LnR5cGUgPT09ICdtYWNybycpXG4gICAgICAgICAgcmV0dXJuIHBhcnQubWFjcm8oKTtcblxuICAgICAgICByZXR1cm4gcGFydDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgcmV0dXJuIHBhcnQuc291cmNlO1xuICAgICAgfVxuICAgIH0pXG4gICAgLm1hcChjYWxsYmFjayB8fCBOT09QKVxuICAgIC5maWx0ZXIoKGl0ZW0pID0+IChpdGVtICE9IG51bGwgJiYgaXRlbSAhPT0gJycpKTtcblxuICBpZiAocmVzdWx0LnNvbWUoKGl0ZW0pID0+IChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUgfHwgaXRlbVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKSkpXG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICBpZiAocmVzdWx0LnNvbWUoKGl0ZW0pID0+IEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgJzo6U3RyaW5nJykpKVxuICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG5cbiAgcmV0dXJuIChyZXN1bHQubGVuZ3RoIDwgMikgPyByZXN1bHRbMF0gOiByZXN1bHQ7XG59XG5cbmNvbnN0IEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUyA9IFsgMywgMiBdOyAvLyBURVhUX05PREUsIEFUVFJJQlVURV9OT0RFXG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBHaXZlbiBhIE5vZGUsIHRha2UgdGhlIGAubm9kZVZhbHVlYCBvZiB0aGF0IG5vZGUsIGFuZCBpZiBpdCBpcyBhIHRlbXBsYXRlLFxuICogICBwYXJzZSB0aGF0IHRlbXBsYXRlIHVzaW5nIEBzZWUgVXRpbHMucGFyc2VUZW1wbGF0ZVBhcnRzOywgYW5kIHRoZW5cbiAqICAgY29tcGlsZSB0aGF0IHRlbXBsYXRlIHVzaW5nIEBzZWUgVXRpbHMuY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzOy4gVGhlXG4gKiAgIHJlc3VsdGluZyB0ZW1wbGF0ZSBwYXJ0cyBhcmUgdGhlbiBzY2FubmVkLiBJZiBhbnkgb2YgdGhlIGBtYWNybygpYCBjYWxsc1xuICogICByZXN1bHQgaW4gYSBAc2VlIER5bmFtaWNQcm9wZXJ0eT9jYXB0aW9uPUR5bmFtaWNQcm9wZXJ0eTssIHRoZW4gc2V0IHVwXG4gKiAgIGxpc3RlbmVycyB2aWEgYGFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsIC4uLilgIG9uIGVhY2ggdG8gbGlzdGVuIGZvclxuICogICBjaGFuZ2VzIHRvIGR5bmFtaWMgcHJvcGVydGllcy4gV2hlbiBhIGxpc3RlbmVyIHVwZGF0ZXMsIHRoZSB0ZW1wbGF0ZSBwYXJ0c1xuICogICBhcmUgcmVjb21waWxlZCwgYW5kIHRoZSBgLm5vZGVWYWx1ZWAgaXMgc2V0IGFnYWluIHdpdGggdGhlIG5ldyByZXN1bHQuXG4gKlxuICogICBJbiBzaG9ydCwgdGhpcyBtZXRob2QgZm9ybWF0cyB0aGUgdmFsdWUgb2YgYSBOb2RlIGlmIHRoZSB2YWx1ZSBpcyBhIHRlbXBsYXRlLFxuICogICBhbmQgaW4gZG9pbmcgc28gYmluZHMgdG8gZHluYW1pYyBwcm9wZXJ0aWVzIGZvciBmdXR1cmUgdXBkYXRlcyB0byB0aGlzIG5vZGUuXG4gKlxuICogICBJZiB0aGUgYC5ub2RlVmFsdWVgIG9mIHRoZSBOb2RlIGlzIGRldGVjdGVkIHRvICoqbm90KiogYmUgYSB0ZW1wbGF0ZSwgdGhlblxuICogICB0aGUgcmVzdWx0IGlzIGEgbm8tb3BlcmF0aW9uLCBhbmQgdGhlIHJhdyB2YWx1ZSBvZiB0aGUgTm9kZSBpcyBzaW1wbHkgcmV0dXJuZWQuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogbm9kZVxuICogICAgIGRhdGFUeXBlOiBOb2RlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIE5vZGUgd2hvc2UgdmFsdWUgc2hvdWxkIGJlIGZvcm1hdHRlZC4gVGhpcyBtdXN0IGJlIGEgVEVYVF9OT0RFIG9yIGEgQVRUUklCVVRFX05PREUuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIHJlc3VsdGluZyBub2RlIHZhbHVlLiBJZiBhIHRlbXBsYXRlIHdhcyBzdWNjZXNzZnVsbHkgY29tcGlsZWQsIGR5bmFtaWMgcHJvcGVydGllc1xuICogICBhcmUgYWxzbyBsaXN0ZW5lZCB0byBmb3IgZnV0dXJlIHVwZGF0ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXROb2RlVmFsdWUobm9kZSwgX29wdGlvbnMpIHtcbiAgaWYgKG5vZGUucGFyZW50Tm9kZSAmJiAoL14oc3R5bGV8c2NyaXB0KSQvKS50ZXN0KG5vZGUucGFyZW50Tm9kZS5sb2NhbE5hbWUpKVxuICAgIHJldHVybiBub2RlLm5vZGVWYWx1ZTtcblxuICBpZiAoIW5vZGUgfHwgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTLmluZGV4T2Yobm9kZS5ub2RlVHlwZSkgPCAwKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZm9ybWF0Tm9kZVZhbHVlXCIgdW5zdXBwb3J0ZWQgbm9kZSB0eXBlIHByb3ZpZGVkLiBPbmx5IFRFWFRfTk9ERSBhbmQgQVRUUklCVVRFX05PREUgdHlwZXMgYXJlIHN1cHBvcnRlZC4nKTtcblxuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdGV4dCAgICAgICAgICA9IG5vZGUubm9kZVZhbHVlO1xuICBsZXQgdGVtcGxhdGVQYXJ0cyA9IHBhcnNlVGVtcGxhdGVQYXJ0cyh0ZXh0LCBvcHRpb25zKTtcblxuICAvLyB0ZW1wbGF0ZVBhcnRzLmZvckVhY2goKHsgdHlwZSwgbWFjcm8gfSkgPT4ge1xuICAvLyAgIGlmICh0eXBlICE9PSAnbWFjcm8nKVxuICAvLyAgICAgcmV0dXJuO1xuXG4gIC8vICAgbGV0IHJlc3VsdCA9IG1hY3JvKCk7XG4gIC8vICAgaWYgKG9wdGlvbnMuYmluZFRvRHluYW1pY1Byb3BlcnRpZXMgIT09IGZhbHNlICYmIGlzVHlwZShyZXN1bHQsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgLy8gICAgIHJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PiB7XG4gIC8vICAgICAgIGxldCByZXN1bHQgPSAoJycgKyBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cykpO1xuICAvLyAgICAgICBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSlcbiAgLy8gICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHJlc3VsdDtcbiAgLy8gICAgIH0sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgLy8gICB9XG4gIC8vIH0pO1xuXG4gIGxldCByZXN1bHQgPSBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cywgKHJlc3VsdCkgPT4ge1xuICAgIGlmIChyZXN1bHQgJiYgb3B0aW9ucy5iaW5kVG9EeW5hbWljUHJvcGVydGllcyAhPT0gZmFsc2UgJiYgQmFzZVV0aWxzLmlzVHlwZShyZXN1bHQsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIHJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSAoJycgKyBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cykpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSlcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHJlc3VsdDtcbiAgICAgIH0sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICBpZiAocmVzdWx0ID09IG51bGwpXG4gICAgcmVzdWx0ID0gJyc7XG5cbiAgcmV0dXJuIChvcHRpb25zLmRpc2FsbG93SFRNTCA9PT0gdHJ1ZSkgPyAoJycgKyByZXN1bHQpIDogcmVzdWx0O1xufVxuXG5jb25zdCBJU19URU1QTEFURSA9IC8oPzwhXFxcXClAQC87XG5leHBvcnQgZnVuY3Rpb24gaXNUZW1wbGF0ZSh2YWx1ZSkge1xuICBpZiAoIUJhc2VVdGlscy5pc1R5cGUodmFsdWUsICc6OlN0cmluZycpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gSVNfVEVNUExBVEUudGVzdCh2YWx1ZSk7XG59XG5cbmNvbnN0IElTX0VWRU5UX05BTUUgICAgID0gL15vbi87XG5jb25zdCBFVkVOVF9OQU1FX0NBQ0hFICA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgbGV0IHRhZ05hbWUgPSAoIWVsZW1lbnQudGFnTmFtZSkgPyBlbGVtZW50IDogZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gIGxldCBjYWNoZSAgID0gRVZFTlRfTkFNRV9DQUNIRS5nZXQodGFnTmFtZSk7XG4gIGlmIChjYWNoZSlcbiAgICByZXR1cm4gY2FjaGU7XG5cbiAgbGV0IGV2ZW50TmFtZXMgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gZWxlbWVudCkge1xuICAgIGlmIChrZXkubGVuZ3RoID4gMiAmJiBJU19FVkVOVF9OQU1FLnRlc3Qoa2V5KSlcbiAgICAgIGV2ZW50TmFtZXMucHVzaChrZXkudG9Mb3dlckNhc2UoKSk7XG4gIH1cblxuICBFVkVOVF9OQU1FX0NBQ0hFLnNldCh0YWdOYW1lLCBldmVudE5hbWVzKTtcblxuICByZXR1cm4gZXZlbnROYW1lcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBldmVudE5hbWUsIF9jYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgY2FsbGJhY2s7XG5cbiAgaWYgKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KF9jYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayAgPSBfY2FsbGJhY2suY2FsbGJhY2s7XG4gICAgb3B0aW9ucyAgID0gX2NhbGxiYWNrLm9wdGlvbnMgfHwge307XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH1cblxuICBpZiAoQmFzZVV0aWxzLmlzVHlwZShjYWxsYmFjaywgJzo6U3RyaW5nJykpXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4OiAnbGV0IGV2ZW50PWFyZ3VtZW50c1sxXScsIGJvZHk6IGNhbGxiYWNrLCBzY29wZTogdGhpcyB9KTsgLy8gQHJlZjpfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudFxuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblxuICByZXR1cm4geyBjYWxsYmFjaywgb3B0aW9ucyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQYXRoKG9iaiwga2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKG9iaiA9PSBudWxsIHx8IE9iamVjdC5pcyhvYmosIE5hTikgfHwgT2JqZWN0LmlzKG9iaiwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhvYmosIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBpZiAoa2V5ID09IG51bGwgfHwgT2JqZWN0LmlzKGtleSwgTmFOKSB8fCBPYmplY3QuaXMoa2V5LCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKGtleSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGxldCBwYXJ0cyAgICAgICAgID0ga2V5LnNwbGl0KC8oPzwhXFxcXClcXC4vZykuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgY3VycmVudFZhbHVlICA9IG9iajtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBwYXJ0cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgbGV0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBsZXQgbmV4dFZhbHVlID0gY3VycmVudFZhbHVlW3BhcnRdO1xuICAgIGlmIChuZXh0VmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjdXJyZW50VmFsdWUgPSBuZXh0VmFsdWU7XG4gIH1cblxuICBpZiAoZ2xvYmFsVGhpcy5Ob2RlICYmIGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUgaW5zdGFuY2VvZiBnbG9iYWxUaGlzLk5vZGUgJiYgKGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHwgY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSlcbiAgICByZXR1cm4gY3VycmVudFZhbHVlLm5vZGVWYWx1ZTtcblxuICByZXR1cm4gKGN1cnJlbnRWYWx1ZSA9PSBudWxsKSA/IGRlZmF1bHRWYWx1ZSA6IGN1cnJlbnRWYWx1ZTtcbn1cblxuY29uc3QgQ0FDSEVEX1BST1BFUlRZX05BTUVTID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IFNLSVBfUFJPVE9UWVBFUyAgICAgICA9IFtcbiAgZ2xvYmFsVGhpcy5IVE1MRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5Ob2RlLFxuICBnbG9iYWxUaGlzLkVsZW1lbnQsXG4gIGdsb2JhbFRoaXMuT2JqZWN0LFxuICBnbG9iYWxUaGlzLkFycmF5LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFByb3BlcnR5TmFtZXMoX29iaikge1xuICBpZiAoIUJhc2VVdGlscy5pc0NvbGxlY3RhYmxlKF9vYmopKVxuICAgIHJldHVybiBbXTtcblxuICBsZXQgY2FjaGVkTmFtZXMgPSBDQUNIRURfUFJPUEVSVFlfTkFNRVMuZ2V0KF9vYmopO1xuICBpZiAoY2FjaGVkTmFtZXMpXG4gICAgcmV0dXJuIGNhY2hlZE5hbWVzO1xuXG4gIGxldCBvYmogICA9IF9vYmo7XG4gIGxldCBuYW1lcyA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAob2JqKSB7XG4gICAgbGV0IG9iak5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBvYmpOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgICAgbmFtZXMuYWRkKG9iak5hbWVzW2ldKTtcblxuICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIGlmIChvYmogJiYgU0tJUF9QUk9UT1RZUEVTLmluZGV4T2Yob2JqLmNvbnN0cnVjdG9yKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cblxuICBsZXQgZmluYWxOYW1lcyA9IEFycmF5LmZyb20obmFtZXMpO1xuICBDQUNIRURfUFJPUEVSVFlfTkFNRVMuc2V0KF9vYmosIGZpbmFsTmFtZXMpO1xuXG4gIHJldHVybiBmaW5hbE5hbWVzO1xufVxuXG5jb25zdCBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUgPSBuZXcgV2Vha01hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGgoa2V5UGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIGxldCBpbnN0YW5jZUNhY2hlID0gTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLmdldCh0aGlzKTtcbiAgaWYgKCFpbnN0YW5jZUNhY2hlKSB7XG4gICAgaW5zdGFuY2VDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuc2V0KHRoaXMsIGluc3RhbmNlQ2FjaGUpO1xuICB9XG5cbiAgbGV0IHByb3BlcnR5ID0gaW5zdGFuY2VDYWNoZS5nZXQoa2V5UGF0aCk7XG4gIGlmICghcHJvcGVydHkpIHtcbiAgICBwcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoZGVmYXVsdFZhbHVlKTtcbiAgICBpbnN0YW5jZUNhY2hlLnNldChrZXlQYXRoLCBwcm9wZXJ0eSk7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGVjaWFsQ2xvc2VzdChub2RlLCBzZWxlY3Rvcikge1xuICBpZiAoIW5vZGUgfHwgIXNlbGVjdG9yKVxuICAgIHJldHVybjtcblxuICBsZXQgY3VycmVudE5vZGUgPSBub2RlO1xuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgKHR5cGVvZiBjdXJyZW50Tm9kZS5tYXRjaGVzICE9PSAnZnVuY3Rpb24nIHx8ICFjdXJyZW50Tm9kZS5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcblxuICByZXR1cm4gY3VycmVudE5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGVlcChtcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zIHx8IDApO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKSB7XG4gIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgIFtuYW1lXToge1xuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBkeW5hbWljUHJvcGVydHksXG4gICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHNldHRlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oc2V0dGVyKG5ld1ZhbHVlKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gZHluYW1pY1Byb3BlcnR5O1xufVxuXG5jb25zdCBEWU5BTUlDX1BST1BfUkVHSVNUUlkgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY1Byb3BJRChpZCwgc2V0VmFsdWUpIHtcbiAgbGV0IHByb3AgPSBEWU5BTUlDX1BST1BfUkVHSVNUUlkuZ2V0KGlkKTtcbiAgaWYgKHByb3ApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXG4gICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHNldFZhbHVlKTtcblxuICAgIHJldHVybiBwcm9wO1xuICB9XG5cbiAgcHJvcCA9IG5ldyBEeW5hbWljUHJvcGVydHkoKGFyZ3VtZW50cy5sZW5ndGggPiAxKSA/IHNldFZhbHVlIDogJycpO1xuICBEWU5BTUlDX1BST1BfUkVHSVNUUlkuc2V0KGlkLCBwcm9wKTtcblxuICByZXR1cm4gcHJvcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlTmFtZVZhbHVlUGFpckhlbHBlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIG1ldGFkYXRhKFxuICAgIHRhcmdldCxcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUixcbiAgICBbIG5hbWUsIHZhbHVlIF0sXG4gICk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUyA9IG5ldyBTZXQoWyAnW2RhdGEtdGVtcGxhdGVzLWRpc2FibGVdJywgJ215dGhpeC1mb3ItZWFjaCcgXSk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMpLmpvaW4oJywnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5hZGQoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuZGVsZXRlKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gZ2xvYmFsU3RvcmVIZWxwZXIoZHluYW1pYywgYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IHNldE9uR2xvYmFsID0gKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV07XG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoY3VycmVudFZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSB7XG4gICAgICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgIHJldHVybiBjdXJyZW50VmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKEJhc2VVdGlscy5pc1R5cGUodmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUsIHtcbiAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHZhbHVlLFxuICAgICAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZVtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICBsZXQgcHJvcCA9IGR5bmFtaWNQcm9wSUQobmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBwcm9wLFxuICAgICAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuXG4gICAgICByZXR1cm4gcHJvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgbmFtZVZhbHVlUGFpciA9IChCYXNlVXRpbHMuaXNDb2xsZWN0YWJsZShhcmdzWzBdKSkgPyBtZXRhZGF0YShcbiAgICBhcmdzWzBdLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRleHRcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUiwgIC8vIHNwZWNpYWwga2V5XG4gICkgOiBudWxsOyAvLyBAcmVmOl9teXRoaXhOYW1lVmFsdWVQYWlySGVscGVyVXNhZ2VcblxuICBpZiAobmFtZVZhbHVlUGFpcikge1xuICAgIGxldCBbIG5hbWUsIHZhbHVlIF0gPSBuYW1lVmFsdWVQYWlyO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA+IDEgJiYgQmFzZVV0aWxzLmlzVHlwZShhcmdzWzBdLCAnOjpTdHJpbmcnKSkge1xuICAgIGxldCBuYW1lICA9IGFyZ3NbMF07XG4gICAgbGV0IHZhbHVlID0gYXJnc1sxXTtcbiAgICBzZXRPbkdsb2JhbChuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHZhbHVlID0gYXJnc1swXTtcbiAgICBsZXQgbmFtZSAgPSAodHlwZW9mIHRoaXMuZ2V0SWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJykgPyB0aGlzLmdldElkZW50aWZpZXIoKSA6ICh0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpKTtcbiAgICBpZiAoIW5hbWUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wibXl0aGl4VUkuZ2xvYmFsU3RvcmVcIjogXCJuYW1lXCIgaXMgdW5rbm93biwgc28gdW5hYmxlIHRvIHN0b3JlIHZhbHVlJyk7XG5cbiAgICBzZXRPbkdsb2JhbChuYW1lLCB2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGdsb2JhbFN0b3JlSGVscGVyLmNhbGwodGhpcywgZmFsc2UsIGFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmVEeW5hbWljKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGdsb2JhbFN0b3JlSGVscGVyLmNhbGwodGhpcywgdHJ1ZSwgYXJncyk7XG59XG5cbmNsYXNzIFN0b3JhZ2VJdGVtIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB0aGlzLl9jID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl91ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl92ID0gdmFsdWU7XG4gIH1cblxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdjtcbiAgfVxuXG4gIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5fdSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fdiA9IHZhbHVlO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAkdHlwZTogICdTdG9yYWdlSXRlbScsXG4gICAgICBfYzogICAgIHRoaXMuX2MsXG4gICAgICBfdTogICAgIHRoaXMuX3UsXG4gICAgICBfdjogICAgIHRoaXMuX3YsXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBTdG9yYWdlIHtcbiAgX3Jldml2ZShkYXRhLCBfYWxyZWFkeVZpc2l0ZWQpIHtcbiAgICBpZiAoIWRhdGEgfHwgQmFzZVV0aWxzLmlzUHJpbWl0aXZlKGRhdGEpKVxuICAgICAgcmV0dXJuIGRhdGE7XG5cbiAgICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gX2FscmVhZHlWaXNpdGVkIHx8IG5ldyBTZXQoKTtcbiAgICBsZXQgdHlwZSAgICAgICAgICAgID0gKGRhdGEgJiYgZGF0YS4kdHlwZSk7XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT09ICdTdG9yYWdlSXRlbScpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZGF0YS5fdjtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgU3RvcmFnZUl0ZW0oKSwge1xuICAgICAgICAgIF9jOiBkYXRhLl9jLFxuICAgICAgICAgIF91OiBkYXRhLl91LFxuICAgICAgICAgIF92OiAodmFsdWUgJiYgIUJhc2VVdGlscy5pc1ByaW1pdGl2ZSh2YWx1ZSkpID8gdGhpcy5fcmV2aXZlKHZhbHVlLCBhbHJlYWR5VmlzaXRlZCkgOiB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICAgIGlmICghdmFsdWUgfHwgQmFzZVV0aWxzLmlzUHJpbWl0aXZlKHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXModmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKHZhbHVlKTtcbiAgICAgIGRhdGFba2V5XSA9IHRoaXMuX3Jldml2ZSh2YWx1ZSwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX3JhdyhkYXRhLCBfYWxyZWFkeVZpc2l0ZWQpIHtcbiAgICBpZiAoIWRhdGEgfHwgQmFzZVV0aWxzLmlzUHJpbWl0aXZlKGRhdGEpKVxuICAgICAgcmV0dXJuIGRhdGE7XG5cbiAgICBsZXQgYWxyZWFkeVZpc2l0ZWQgPSBfYWxyZWFkeVZpc2l0ZWQgfHwgbmV3IFNldCgpO1xuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgU3RvcmFnZUl0ZW0pXG4gICAgICByZXR1cm4gdGhpcy5fcmF3KGRhdGEuZ2V0VmFsdWUoKSwgYWxyZWFkeVZpc2l0ZWQpO1xuXG4gICAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICAgIGlmICghdmFsdWUgfHwgQmFzZVV0aWxzLmlzUHJpbWl0aXZlKHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXModmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKHZhbHVlKTtcbiAgICAgIGRhdGFba2V5XSA9IHRoaXMuX3Jhdyh2YWx1ZSwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2dldFBhcnRzRm9yT3BlcmF0aW9uKHR5cGUsIHBhcnRzKSB7XG4gICAgbGV0IHBhdGhQYXJ0cyAgID0gKHR5cGUgPT09ICdzZXQnKSA/IHBhcnRzLnNsaWNlKDAsIC0xKSA6IHBhcnRzLnNsaWNlKCk7XG4gICAgbGV0IHBhdGggICAgICAgID0gcGF0aFBhcnRzLm1hcCgocGFydCkgPT4gKCh0eXBlb2YgcGFydCA9PT0gJ3N5bWJvbCcpID8gcGFydC50b1N0cmluZygpIDogKCcnICsgcGFydCkpLnJlcGxhY2UoL1xcLi9nLCAnXFxcXC4nKSkuam9pbignLicpO1xuICAgIGxldCBwYXJzZWRQYXJ0cyA9IHBhdGguc3BsaXQoLyg/PCFcXFxcKVxcLi9nKTtcbiAgICBsZXQgc3RvcmFnZVR5cGUgPSBwYXJzZWRQYXJ0c1swXTtcbiAgICBsZXQgZGF0YSAgICAgICAgPSAodHlwZSA9PT0gJ3NldCcpID8gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBsb2NhbFN0b3JhZ2UsIG9yIHNlc3Npb25TdG9yYWdlXG4gICAgbGV0IHN0b3JhZ2VFbmdpbmUgPSBnbG9iYWxUaGlzW3N0b3JhZ2VUeXBlXTtcbiAgICBpZiAoIXN0b3JhZ2VFbmdpbmUpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgcm9vdERhdGEgICAgPSB7fTtcbiAgICBsZXQgZW5jb2RlZEJhc2UgPSBzdG9yYWdlRW5naW5lLmdldEl0ZW0oJ215dGhpeC11aScpO1xuICAgIGlmIChlbmNvZGVkQmFzZSlcbiAgICAgIHJvb3REYXRhID0gdGhpcy5fcmV2aXZlKEpTT04ucGFyc2UoZW5jb2RlZEJhc2UpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwYXRoUGFydHMsXG4gICAgICBwYXRoLFxuICAgICAgcGFyc2VkUGFydHMsXG4gICAgICBzdG9yYWdlVHlwZSxcbiAgICAgIGRhdGEsXG4gICAgICBzdG9yYWdlRW5naW5lLFxuICAgICAgZW5jb2RlZEJhc2UsXG4gICAgICByb290RGF0YSxcbiAgICB9O1xuICB9XG5cbiAgX2dldE1ldGEodHlwZSwgcGFydHMpIHtcbiAgICBsZXQgb3BlcmF0aW9uID0gdGhpcy5fZ2V0UGFydHNGb3JPcGVyYXRpb24odHlwZSwgcGFydHMpO1xuICAgIGxldCB7XG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHJvb3REYXRhLFxuICAgIH0gPSBvcGVyYXRpb247XG5cbiAgICBsZXQgc2NvcGUgICAgICAgID0gcm9vdERhdGE7XG4gICAgbGV0IHBhcmVudFNjb3BlICA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMSwgaWwgPSBwYXJzZWRQYXJ0cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBpZiAoc2NvcGUgaW5zdGFuY2VvZiBTdG9yYWdlSXRlbSkge1xuICAgICAgICBzY29wZSA9IHNjb3BlLmdldFZhbHVlKCk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBwYXJ0ID0gcGFyc2VkUGFydHNbaV07XG4gICAgICBsZXQgc3ViU2NvcGUgPSAoc2NvcGUpID8gc2NvcGVbcGFydF0gOiBzY29wZTtcbiAgICAgIGlmICh0eXBlID09PSAnc2V0JyAmJiAhc3ViU2NvcGUpXG4gICAgICAgIHN1YlNjb3BlID0gc2NvcGVbcGFydF0gPSB7fTtcblxuICAgICAgaWYgKHN1YlNjb3BlID09IG51bGwgfHwgT2JqZWN0LmlzKHN1YlNjb3BlLCBOYU4pIHx8IE9iamVjdC5pcyhzdWJTY29wZSwgLUluZmluaXR5KSB8fCBPYmplY3QuaXMoc3ViU2NvcGUsIEluZmluaXR5KSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIHBhcmVudFNjb3BlID0gc2NvcGU7XG4gICAgICBzY29wZSA9IHN1YlNjb3BlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBvcGVyYXRpb24sXG4gICAgICBwYXJlbnRTY29wZSxcbiAgICAgIHNjb3BlLFxuICAgIH07XG4gIH1cblxuICBnZXRNZXRhKC4uLnBhcnRzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldE1ldGEoJ2dldCcsIHBhcnRzKTtcbiAgfVxuXG4gIGdldCguLi5wYXJ0cykge1xuICAgIGxldCB7IHNjb3BlIH0gPSB0aGlzLl9nZXRNZXRhKCdnZXQnLCBwYXJ0cyk7XG4gICAgcmV0dXJuIHRoaXMuX3JhdyhzY29wZSk7XG4gIH1cblxuICBzZXQoLi4ucGFydHMpIHtcbiAgICBsZXQge1xuICAgICAgb3BlcmF0aW9uLFxuICAgICAgcGFyZW50U2NvcGUsXG4gICAgICBzY29wZSxcbiAgICB9ID0gdGhpcy5fZ2V0TWV0YSgnc2V0JywgcGFydHMpO1xuXG4gICAgbGV0IHtcbiAgICAgIGRhdGEsXG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHBhdGgsXG4gICAgICByb290RGF0YSxcbiAgICAgIHN0b3JhZ2VFbmdpbmUsXG4gICAgfSA9IG9wZXJhdGlvbjtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIERlbGV0ZVxuICAgICAgaWYgKHBhcmVudFNjb3BlKVxuICAgICAgICBkZWxldGUgcGFyZW50U2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dO1xuICAgICAgZWxzZVxuICAgICAgICBkZWxldGUgc2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGFyZW50U2NvcGUpXG4gICAgICAgIHBhcmVudFNjb3BlW3BhcnNlZFBhcnRzW3BhcnNlZFBhcnRzLmxlbmd0aCAtIDFdXSA9IG5ldyBTdG9yYWdlSXRlbShkYXRhKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dID0gbmV3IFN0b3JhZ2VJdGVtKGRhdGEpO1xuICAgIH1cblxuICAgIHN0b3JhZ2VFbmdpbmUuc2V0SXRlbSgnbXl0aGl4LXVpJywgSlNPTi5zdHJpbmdpZnkocm9vdERhdGEpKTtcblxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIWdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUudXJsKVxuICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLnVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pO1xuXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIENvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnRzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5leHBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcbmV4cG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICcuL2R5bmFtaWMtcHJvcGVydHkuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuZXhwb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuZXhwb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1yZXF1aXJlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXNwaW5uZXIuanMnO1xuXG5jb25zdCBNeXRoaXhVSUNvbXBvbmVudCA9IENvbXBvbmVudHMuTXl0aGl4VUlDb21wb25lbnQ7XG5cbmV4cG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICBEeW5hbWljUHJvcGVydHksXG59O1xuXG5sZXQgX215dGhpeElzUmVhZHkgPSBmYWxzZTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgJ29ubXl0aGl4cmVhZHknOiB7XG4gICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiAgICAgICAgICAoKSA9PiB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHNldDogICAgICAgICAgKGNhbGxiYWNrKSA9PiB7XG4gICAgICBpZiAoX215dGhpeElzUmVhZHkpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBjYWxsYmFjayhuZXcgRXZlbnQoJ215dGhpeC1yZWFkeScpKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXl0aGl4LXJlYWR5JywgY2FsbGJhY2spO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5VdGlscyA9IFV0aWxzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5Db21wb25lbnRzID0gQ29tcG9uZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuRWxlbWVudHMgPSBFbGVtZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmUgPSBVdGlscy5nbG9iYWxTdG9yZTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmVEeW5hbWljID0gVXRpbHMuZ2xvYmFsU3RvcmVEeW5hbWljO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gVXRpbHMuZHluYW1pY1Byb3BJRChpZCk7XG59O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBsZXQgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IGZhbHNlO1xuXG4gIGNvbnN0IG9uRG9jdW1lbnRSZWFkeSA9ICgpID0+IHtcbiAgICBpZiAoIWRpZFZpc2liaWxpdHlPYnNlcnZlcnMpIHtcbiAgICAgIGxldCBlbGVtZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbXl0aGl4LXNyY10nKSk7XG4gICAgICBDb21wb25lbnRzLnZpc2liaWxpdHlPYnNlcnZlcigoeyBkaXNjb25uZWN0LCBlbGVtZW50LCB3YXNWaXNpYmxlIH0pID0+IHtcbiAgICAgICAgaWYgKHdhc1Zpc2libGUpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpO1xuICAgICAgICBpZiAoIXNyYylcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgQ29tcG9uZW50cy5sb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwoZWxlbWVudCwgc3JjKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIHsgZWxlbWVudHMgfSk7XG5cbiAgICAgIGRpZFZpc2liaWxpdHlPYnNlcnZlcnMgPSB0cnVlO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG5cbiAgICBpZiAoX215dGhpeElzUmVhZHkpXG4gICAgICByZXR1cm47XG5cbiAgICBfbXl0aGl4SXNSZWFkeSA9IHRydWU7XG5cbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgICAnJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoLi4uYXJncyksXG4gICAgfSxcbiAgICAnJCQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogICAgICAgICguLi5hcmdzKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKC4uLmFyZ3MpLFxuICAgIH0sXG4gIH0pO1xuXG4gIGxldCBkb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxUaGlzLm15dGhpeFVJLmRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBsZXQgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgPSBVdGlscy5nZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG11dGF0aW9ucy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgbXV0YXRpb24gID0gbXV0YXRpb25zW2ldO1xuICAgICAgbGV0IHRhcmdldCAgICA9IG11dGF0aW9uLnRhcmdldDtcblxuICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgJiYgdGFyZ2V0LnBhcmVudE5vZGUgJiYgdHlwZW9mIHRhcmdldC5wYXJlbnROb2RlLmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0cikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlTm9kZShtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlICAgICAgPSAoYXR0cmlidXRlTm9kZSkgPyBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA6IG51bGw7XG4gICAgICAgIGxldCBvbGRWYWx1ZSAgICAgID0gbXV0YXRpb24ub2xkVmFsdWU7XG5cbiAgICAgICAgaWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAobmV3VmFsdWUgJiYgVXRpbHMuaXNUZW1wbGF0ZShuZXdWYWx1ZSkpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUodGFyZ2V0KSwgZGlzYWxsb3dIVE1MOiB0cnVlIH0pO1xuXG4gICAgICAgIGxldCBvYnNlcnZlZEF0dHJpYnV0ZXMgPSB0YXJnZXQuY29uc3RydWN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuICAgICAgICBpZiAob2JzZXJ2ZWRBdHRyaWJ1dGVzICYmIG9ic2VydmVkQXR0cmlidXRlcy5pbmRleE9mKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpIDwgMCkge1xuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwodGFyZ2V0LCBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGxldCBkaXNhYmxlVGVtcGxhdGluZyA9IChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5jbG9zZXN0ID09PSAnZnVuY3Rpb24nICYmIHRhcmdldC5jbG9zZXN0KCdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0sbXl0aGl4LWZvci1lYWNoJykpO1xuICAgICAgICBsZXQgYWRkZWROb2RlcyAgICAgICAgPSBtdXRhdGlvbi5hZGRlZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgamwgPSBhZGRlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IGFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25BZGRlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICghZGlzYWJsZVRlbXBsYXRpbmcpXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSk7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0W0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdKVxuICAgICAgICAgICAgdGFyZ2V0Lm9uTXV0YXRpb25DaGlsZEFkZGVkKG5vZGUsIG11dGF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZW1vdmVkTm9kZXMgPSBtdXRhdGlvbi5yZW1vdmVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IHJlbW92ZWROb2Rlcy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgbGV0IG5vZGUgPSByZW1vdmVkTm9kZXNbal07XG4gICAgICAgICAgaWYgKG5vZGVbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0gJiYgbm9kZS5vbk11dGF0aW9uUmVtb3ZlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkUmVtb3ZlZChub2RlLCBtdXRhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50TXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgc3VidHJlZTogICAgICAgICAgICB0cnVlLFxuICAgIGNoaWxkTGlzdDogICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiAgICAgICAgIHRydWUsXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6ICB0cnVlLFxuICB9KTtcblxuICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMoZG9jdW1lbnQuaGVhZCk7XG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5ib2R5KTtcblxuICBjb25zdCBET0NVTUVOVF9DSEVDS19SRUFEWV9USU1FID0gMjUwO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKVxuICAgICAgb25Eb2N1bWVudFJlYWR5KCk7XG4gICAgZWxzZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG4gIH0sIERPQ1VNRU5UX0NIRUNLX1JFQURZX1RJTUUpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Eb2N1bWVudFJlYWR5KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==