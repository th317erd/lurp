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
 *         :eye: @see BaseUtils.isType;.
 *   - name: DYNAMIC_PROPERTY_TYPE
 *     dataType: symbol
 *     desc: |
 *       Used for runtime type reflection against @see DynamicProperty;.
 *     notes:
 *       - |
 *         :eye: @see DynamicProperty;.
 *       - |
 *         :eye: @see BaseUtils.isType;.
 *       - |
 *         :eye: @see Constants.MYTHIX_TYPE;.
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
 * groupName: Utils
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
 * groupName: Utils
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
 *     :eye: @see BaseUtils.typeOf;.
 *   - |
 *     :eye: @see BaseUtils.isType;.
 */
function isValidNumber(value) {
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

  return ('' + value);
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

  build(callback) {
    let result = [ callback(_elements_js__WEBPACK_IMPORTED_MODULE_4__.ElementGenerator, {}) ].flat(Infinity).map((item) => {
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

// Base
const MYTHIX_NAME_VALUE_PAIR_HELPER  = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper'); // @ref:Utils.MYTHIX_NAME_VALUE_PAIR_HELPER
const MYTHIX_SHADOW_PARENT           = Symbol.for('@mythix/mythix-ui/constants/shadow-parent'); // @ref:Utils.MYTHIX_SHADOW_PARENT
const MYTHIX_TYPE                    = Symbol.for('@mythix/mythix-ui/constants/element-definition'); // @ref:Utils.MYTHIX_TYPE
const MYTHIX_INTERSECTION_OBSERVERS  = Symbol.for('@mythix/mythix-ui/component/constants/intersection-observers'); // @ref:Components.MYTHIX_INTERSECTION_OBSERVERS
const MYTHIX_DOCUMENT_INITIALIZED    = Symbol.for('@mythix/mythix-ui/component/constants/document-initialized'); // @ref:Components.MYTHIX_DOCUMENT_INITIALIZED

// DynamicProperty
const DYNAMIC_PROPERTY_VALUE         = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/value');
const DYNAMIC_PROPERTY_IS_SETTING    = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');
const DYNAMIC_PROPERTY_SET           = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/set');

// Types
const ELEMENT_DEFINITION_TYPE        = Symbol.for('@mythix/mythix-ui/types/MythixUI::ElementDefinition');
const QUERY_ENGINE_TYPE              = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');
const DYNAMIC_PROPERTY_TYPE          = Symbol.for('@mythix/mythix-ui/types/MythixUI::DynamicProperty'); // @ref:Utils.DYNAMIC_PROPERTY_TYPE
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

  toString() {
    let tagName = this.tagName;
    if (tagName === '#text')
      return this.attributes.value;

    let attrs = ((attributes) => {
      let parts = [];

      for (let [ attributeName, value ] of Object.entries(attributes)) {
        if (IS_PROP_NAME.test(attributeName))
          continue;

        let name = this.toDOMAttributeName(attributeName);
        if (value == null)
          parts.push(name);
        else
          parts.push(`${name}="${encodeValue(value)}"`);
      }

      return parts.join(' ');
    })(this.attributes);

    let children = ((children) => {
      return children
        .filter((child) => (child != null && child !== false && !Object.is(child, NaN)))
        .map((child) => ('' + child))
        .join('');
    })(this.children);

    return `<${tagName}${(attrs) ? ` ${attrs}` : ''}>${(isVoidTag(tagName)) ? '' : `${children}</${tagName}>`}`;
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

  if (node.nodeType !== Node.ELEMENT_NODE)
    return;

  let attributes = {};
  for (let attributeName of node.getAttributeNames())
    attributes[attributeName] = node.getAttribute(attributeName);

  let children = Array.from(node.childNodes).map(nodeToElementDefinition);
  return new ElementDefinition(node.tagName, attributes, children);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUk7QUFDaEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQ7O0FBRWpEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRkE7O0FBRW9EOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyw4QkFBOEIsNkRBQWlCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVO0FBQy9CO0FBQ0E7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEtBQUs7QUFDdEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsaURBQWlE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QUFtQiw2REFBNEI7QUFDL0M7O0FBRUE7QUFDQSxZQUFZLHlEQUF3Qjs7QUFFcEMscUJBQXFCLDZEQUE0QjtBQUNqRDtBQUNBOztBQUVBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxtQkFBbUIsNkRBQTRCO0FBQy9DOztBQUVBLHFCQUFxQiw2REFBNEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUseURBQXdCO0FBQzFCLEVBQUUseURBQXdCOztBQUUxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2Jhc2UtdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvY29tcG9uZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZHluYW1pYy1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwgc3ltYm9sKVxuXHRcdH0pXG5cdFx0OiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHR0cnkge1xuXHRcdHJldHVybiBwcm9wZXJ0eSBpbiBvYmplY3Rcblx0fSBjYXRjaChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcblx0cmV0dXJuIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuXHRcdCYmICEoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG5cdFx0XHQmJiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSkpIC8vIGFuZCBhbHNvIHVuc2FmZSBpZiB0aGV5J3JlIG5vbmVudW1lcmFibGUuXG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHZhciBkZXN0aW5hdGlvbiA9IHt9O1xuXHRpZiAob3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSB7XG5cdFx0Z2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG5cdGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZGVzdGluYXRpb25cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2U7XG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGlzTWVyZ2VhYmxlT2JqZWN0O1xuXHQvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG5cdC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cblx0b3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkO1xuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuXHR2YXIgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcblx0dmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59O1xuXG52YXIgZGVlcG1lcmdlXzEgPSBkZWVwbWVyZ2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXzE7XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbi8qKlxuICogdHlwZTogTmFtZXNwYWNlXG4gKiBuYW1lOiBVdGlsc1xuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgIE1pc2MgdXRpbGl0eSBmdW5jdGlvbnMgYW5kIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyB1c2VkIGFzIGEgQHNlZSBVdGlscy5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgYnkgQHNlZSBVdGlscy5nbG9iYWxTdG9yZU5hbWVWYWx1ZVBhaXJIZWxwZXI7XG4gKiAgICAgICB0byBzdG9yZSBrZXkvdmFsdWUgcGFpcnMgZm9yIGEgc2luZ2xlIHZhbHVlLlxuICpcbiAqICAgICAgIE15dGhpeCBVSSBoYXMgZ2xvYmFsIHN0b3JlIGFuZCBmZXRjaCBoZWxwZXJzIGZvciBzZXR0aW5nIGFuZCBmZXRjaGluZyBkeW5hbWljIHByb3BlcnRpZXMuIFRoZXNlXG4gKiAgICAgICBtZXRob2RzIG9ubHkgYWNjZXB0IGEgc2luZ2xlIHZhbHVlIGJ5IGRlc2lnbi4uLiBidXQgc29tZXRpbWVzIGl0IGlzIGRlc2lyZWQgdGhhdCBhIHZhbHVlIGJlIHNldFxuICogICAgICAgd2l0aCBhIHNwZWNpZmljIGtleSBpbnN0ZWFkLiBUaGlzIGBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUmAgcHJvcGVydHkgYXNzaXN0cyB3aXRoIHRoaXMgcHJvY2VzcyxcbiAqICAgICAgIGFsbG93aW5nIGdsb2JhbCBoZWxwZXJzIHRvIHN0aWxsIGZ1bmN0aW9uIHdpdGggYSBzaW5nbGUgdmFsdWUgc2V0LCB3aGlsZSBpbiBzb21lIGNhc2VzIHN0aWxsIHBhc3NpbmdcbiAqICAgICAgIGEga2V5IHRocm91Z2ggdG8gdGhlIHNldHRlci4gQHNvdXJjZVJlZiBfbXl0aGl4TmFtZVZhbHVlUGFpckhlbHBlclVzYWdlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDp3YXJuaW5nOiBVc2UgYXQgeW91ciBvd24gcmlzay4gVGhpcyBpcyBNeXRoaXggVUkgaW50ZXJuYWwgY29kZSB0aGF0IG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuICogICAtIG5hbWU6IE1ZVEhJWF9TSEFET1dfUEFSRU5UXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IHRvXG4gKiAgICAgICBzdG9yZSB0aGUgcGFyZW50IG5vZGUgb2YgYSBTaGFkb3cgRE9NLCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSB0cmF2ZXJzZWQgYnkgQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIFV0aWxzLmdldFBhcmVudE5vZGU7LlxuICogICAtIG5hbWU6IE1ZVEhJWF9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBmb3IgdHlwZSBjaGVja2luZyBieSBgaW5zdGFuY2VvZmAgY2hlY2tzIHRvIGRldGVybWluZSBpZiBhbiBpbnN0YW5jZVxuICogICAgICAgaXMgYSBzcGVjaWZpYyB0eXBlIChldmVuIGFjcm9zcyBqYXZhc2NyaXB0IGNvbnRleHRzIGFuZCBsaWJyYXJ5IHZlcnNpb25zKS4gQHNvdXJjZVJlZiBfbXl0aGl4VHlwZUV4YW1wbGU7XG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqICAgLSBuYW1lOiBEWU5BTUlDX1BST1BFUlRZX1RZUEVcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVXNlZCBmb3IgcnVudGltZSB0eXBlIHJlZmxlY3Rpb24gYWdhaW5zdCBAc2VlIER5bmFtaWNQcm9wZXJ0eTsuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBEeW5hbWljUHJvcGVydHk7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBDb25zdGFudHMuTVlUSElYX1RZUEU7LlxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5jb25zdCBJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUUgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pZC1jb3VudGVyLWN1cnJlbnQtdmFsdWUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbmxldCBpZENvdW50ZXIgPSAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdsb2JhbFRoaXMubXl0aGl4VUksIElEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRSkpID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUVdIDogMG47XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBHZW5lcmF0ZSBhIHBhcnRpYWxseSByYW5kb20gdW5pcXVlIElELiBUaGUgaWQgZ2VuZXJhdGVkIHdpbGwgYmUgYSBgRGF0ZS5ub3coKWBcbiAqICAgdmFsdWUgd2l0aCBhbiBpbmNyZW1lbnRpbmcgQmlnSW50IHBvc3RmaXhlZCB0byBpdC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRC5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coJ0lEOiAnLCBCYXNlVXRpbHMuZ2VuZXJhdGVJRCgpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ0lEMTcwNDE0MzAyNzE3OTAwMDAwMDAwMDAwMDAwMDAwMDcnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlEKCkge1xuICBpZENvdW50ZXIgKz0gQmlnSW50KDEpO1xuICBnbG9iYWxUaGlzLm15dGhpeFVJW0lEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRV0gPSBpZENvdW50ZXI7XG5cbiAgcmV0dXJuIGBJRCR7RGF0ZS5ub3coKX0ke3BhZChpZENvdW50ZXIudG9TdHJpbmcoKSwgSURfQ09VTlRfTEVOR1RIKX1gO1xufVxuXG5jb25zdCBPQkpFQ1RfSURfU1RPUkFHRSA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvb2JqZWN0LWlkLXN0b3JhZ2UnKTtcbmNvbnN0IE9CSkVDVF9JRF9XRUFLTUFQID0gZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0gPSAoZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0pID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtPQkpFQ1RfSURfU1RPUkFHRV0gOiBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2V0IGEgdW5pcXVlIElEIGZvciBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSByZWZlcmVuY2UuXG4gKlxuICogICBVbmlxdWUgSURzIGFyZSBnZW5lcmF0ZWQgdmlhIEBzZWUgQmFzZVV0aWxzLmdlbmVyYXRlSUQ7LlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IEFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRCBmb3IgdGhpcyByZWZlcmVuY2UgKGFzIGEgU0hBMjU2IGhhc2gpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMuZ2V0T2JqZWN0SUQoZGl2RWxlbWVudCkpO1xuICogICAgIC8vIG91dHB1dCAtPiAnMTcwNDE0MzAyNzE3OTAwMDAwMDAwMDAwMDAwMDAwMDcnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmplY3RJRCh2YWx1ZSkge1xuICBsZXQgaWQgPSBPQkpFQ1RfSURfV0VBS01BUC5nZXQodmFsdWUpO1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIGxldCB0aGlzSUQgPSBnZW5lcmF0ZUlEKCk7XG5cbiAgICBPQkpFQ1RfSURfV0VBS01BUC5zZXQodmFsdWUsIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ3JlYXRlIGFuIHVucmVzb2x2ZWQgc3BlY2lhbGl6ZWQgUHJvbWlzZSBpbnN0YW5jZSwgd2l0aCB0aGUgaW50ZW50IHRoYXQgaXQgd2lsbCBiZVxuICogICByZXNvbHZlZCBsYXRlci5cbiAqXG4gKiAgIFRoZSBQcm9taXNlIGluc3RhbmNlIGlzIHNwZWNpYWxpemVkIGJlY2F1c2UgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGFyZSBpbmplY3RlZCBpbnRvIGl0OlxuICogICAxLiBgcmVzb2x2ZShyZXN1bHRWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlc29sdmVzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gKiAgIDIuIGByZWplY3QoZXJyb3JWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlamVjdHMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAqICAgMy4gYHN0YXR1cygpYCAtIFdoZW4gY2FsbGVkLCB3aWxsIHJldHVybiB0aGUgZnVsZmlsbG1lbnQgc3RhdHVzIG9mIHRoZSBwcm9taXNlLCBhcyBhIGBzdHJpbmdgLCBvbmUgb2Y6IGBcInBlbmRpbmdcIiwgXCJmdWxmaWxsZWRcImAsIG9yIGBcInJlamVjdGVkXCJgXG4gKiAgIDQuIGBpZDxzdHJpbmc+YCAtIEEgcmFuZG9tbHkgZ2VuZXJhdGVkIElEIGZvciB0aGlzIHByb21pc2VcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgUHJvbWlzZTsgQW4gdW5yZXNvbHZlZCBQcm9taXNlIHRoYXQgY2FuIGJlIHJlc29sdmVkIG9yIHJlamVjdGVkIGJ5IGNhbGxpbmcgYHByb21pc2UucmVzb2x2ZShyZXN1bHQpYCBvciBgcHJvbWlzZS5yZWplY3QoZXJyb3IpYCByZXNwZWN0aXZlbHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXNvbHZhYmxlKCkge1xuICBsZXQgc3RhdHVzID0gJ3BlbmRpbmcnO1xuICBsZXQgcmVzb2x2ZTtcbiAgbGV0IHJlamVjdDtcblxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChfcmVzb2x2ZSwgX3JlamVjdCkgPT4ge1xuICAgIHJlc29sdmUgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAnZnVsZmlsbGVkJztcbiAgICAgICAgX3Jlc29sdmUodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgcmVqZWN0ID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ3JlamVjdGVkJztcbiAgICAgICAgX3JlamVjdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb21pc2UsIHtcbiAgICAncmVzb2x2ZSc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVzb2x2ZSxcbiAgICB9LFxuICAgICdyZWplY3QnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlamVjdCxcbiAgICB9LFxuICAgICdzdGF0dXMnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgICgpID0+IHN0YXR1cyxcbiAgICB9LFxuICAgICdpZCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgZ2VuZXJhdGVJRCgpLFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgUnVudGltZSB0eXBlIHJlZmxlY3Rpb24gaGVscGVyLiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbW9yZSByb2J1c3QgcmVwbGFjZW1lbnQgZm9yIHRoZSBgdHlwZW9mYCBvcGVyYXRvci5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIGFsd2F5cyByZXR1cm5zIGEgbmFtZSAoYXMgYSBgc3RyaW5nYCB0eXBlKSBvZiB0aGUgdW5kZXJseWluZyBkYXRhdHlwZS5cbiAqICAgVGhlIFwiZGF0YXR5cGVcIiBpcyBhIGxpdHRsZSBsb29zZSBmb3IgcHJpbWl0aXZlIHR5cGVzLiBGb3IgZXhhbXBsZSwgYVxuICogICBwcmltaXRpdmUgYHR5cGVvZiB4ID09PSAnbnVtYmVyJ2AgdHlwZSBpcyByZXR1cm5lZCBhcyBpdHMgY29ycmVzcG9uZGluZyBPYmplY3QgKGNsYXNzKSB0eXBlIGAnTnVtYmVyJ2AuIEZvciBgYm9vbGVhbmAgaXQgd2lsbCBpbnN0ZWFkXG4gKiAgIHJldHVybiBgJ0Jvb2xlYW4nYCwgYW5kIGZvciBgJ3N0cmluZydgLCBpdCB3aWxsIGluc3RlYWQgcmV0dXJuIGAnU3RyaW5nJ2AuIFRoaXMgaXMgdHJ1ZSBvZiBhbGwgdW5kZXJseWluZyBwcmltaXRpdmUgdHlwZXMuXG4gKlxuICogICBGb3IgaW50ZXJuYWwgZGF0YXR5cGVzLCBpdCB3aWxsIHJldHVybiB0aGUgcmVhbCBjbGFzcyBuYW1lIHByZWZpeGVkIGJ5IHR3byBjb2xvbnMuXG4gKiAgIEZvciBleGFtcGxlLCBgdHlwZU9mKG5ldyBNYXAoKSlgIHdpbGwgcmV0dXJuIGAnOjpNYXAnYC5cbiAqXG4gKiAgIE5vbi1pbnRlcm5hbCB0eXBlcyB3aWxsIG5vdCBiZSBwcmVmaXhlZCwgYWxsb3dpbmcgY3VzdG9tIHR5cGVzIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBpbnRlcm5hbCB0eXBlcyB0byBhbHNvIGJlIGRldGVjdGVkLlxuICogICBGb3IgZXhhbXBsZSwgYGNsYXNzIFRlc3Qge307IHR5cGVPZihuZXcgVGVzdCgpKWAgd2lsbCByZXN1bHQgaW4gdGhlIG5vbi1wcmVmaXhlZCByZXN1bHQgYCdUZXN0J2AuXG4gKlxuICogICBGb3IgcmF3IGBmdW5jdGlvbmAgdHlwZXMsIGB0eXBlT2ZgIHdpbGwgY2hlY2sgaWYgdGhleSBhcmUgYSBjb25zdHJ1Y3RvciBvciBub3QuIElmIGEgY29uc3RydWN0b3IgaXMgZGV0ZWN0ZWQsIHRoZW5cbiAqICAgdGhlIGZvcm1hdCBgJ1tDbGFzcyAke25hbWV9XSdgIHdpbGwgYmUgcmV0dXJuZWQgYXMgdGhlIHR5cGUuIEZvciBpbnRlcm5hbCB0eXBlcyB0aGUgbmFtZSB3aWxsXG4gKiAgIGJlIHByZWZpeGVkLCBpLmUuIGBbQ2xhc3MgOjoke2ludGVybmFsTmFtZX1dYCwgYW5kIGZvciBub24taW50ZXJuYWwgdHlwZXMgd2lsbCBpbnN0ZWFkIGJlIG5vbi1wcmVmaXhlZCwgaS5lLiBgW0NsYXNzICR7bmFtZX1dYCAuXG4gKiAgIEZvciBleGFtcGxlLCBgdHlwZU9mKE1hcClgIHdpbGwgcmV0dXJuIGAnW0NsYXNzIDo6TWFwXSdgLCB3aGVyZWFzIGB0eXBlT2YoVGVzdClgIHdpbGwgcmVzdWx0IGluIGAnW0NsYXNzIFRlc3RdJ2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVGhlIHZhbHVlIHdob3NlIHR5cGUgeW91IHdpc2ggdG8gZGlzY292ZXIuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVkIHR5cGUsIG9yIGFuIGVtcHR5IHN0cmluZyBgJydgIGlmIHRoZSBwcm92aWRlZCB2YWx1ZSBoYXMgbm8gdHlwZS5cbiAqIG5vdGVzOlxuICogICAtIFRoaXMgbWV0aG9kIHdpbGwgbG9vayBmb3IgYSBbU3ltYm9sLnRvU3RyaW5nVGFnXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TeW1ib2wvdG9TdHJpbmdUYWcpXG4gKiAgICAga2V5IG9uIHRoZSB2YWx1ZSBwcm92aWRlZC4uLiBhbmQgaWYgZm91bmQsIHdpbGwgdXNlIGl0IHRvIGFzc2lzdCB3aXRoIGZpbmRpbmcgdGhlIGNvcnJlY3QgdHlwZSBuYW1lLlxuICogICAtIElmIHRoZSBgdmFsdWVgIHByb3ZpZGVkIGlzIHR5cGUtbGVzcywgaS5lLiBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgTmFOYCwgdGhlbiBhbiBlbXB0eSB0eXBlIGAnJ2Agd2lsbCBiZSByZXR1cm5lZC5cbiAqICAgLSBVc2UgdGhlIGB0eXBlb2ZgIG9wZXJhdG9yIGlmIHlvdSB3YW50IHRvIGRldGVjdCBpZiBhIHR5cGUgaXMgcHJpbWl0aXZlIG9yIG5vdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuICcnO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuICc6Ok51bWJlcic7XG5cbiAgbGV0IHRoaXNUeXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodGhpc1R5cGUgPT09ICdiaWdpbnQnKVxuICAgIHJldHVybiAnOjpCaWdJbnQnO1xuXG4gIGlmICh0aGlzVHlwZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuICc6OlN5bWJvbCc7XG5cbiAgaWYgKHRoaXNUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0aGlzVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh2YWx1ZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgOjoke25hdGl2ZVR5cGVNZXRhWzBdfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgSVNfQ0xBU1MudGVzdCgnJyArIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvcikpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7dmFsdWUubmFtZX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG4gICAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtyZXN1bHR9XWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGA6OiR7dGhpc1R5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt0aGlzVHlwZS5zdWJzdHJpbmcoMSl9YDtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICByZXR1cm4gJzo6QXJyYXknO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICByZXR1cm4gJzo6U3RyaW5nJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOdW1iZXIpXG4gICAgcmV0dXJuICc6Ok51bWJlcic7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbilcbiAgICByZXR1cm4gJzo6Qm9vbGVhbic7XG5cbiAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICh0eXBlTWV0YVswXSAhPT0gJ09iamVjdCcgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlTWV0YVsxXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICByZXR1cm4gYDo6JHtuYXRpdmVUeXBlTWV0YVswXX1gO1xuXG4gIGlmICh0eXBlb2YgTWF0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IE1hdGgpXG4gICAgcmV0dXJuICc6Ok1hdGgnO1xuXG4gIGlmICh0eXBlb2YgSlNPTiAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IEpTT04pXG4gICAgcmV0dXJuICc6OkpTT04nO1xuXG4gIGlmICh0eXBlb2YgQXRvbWljcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IEF0b21pY3MpXG4gICAgcmV0dXJuICc6OkF0b21pY3MnO1xuXG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgPT09IFJlZmxlY3QpXG4gICAgcmV0dXJuICc6OlJlZmxlY3QnO1xuXG4gIGlmICh2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKVxuICAgIHJldHVybiAodHlwZW9mIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpID8gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIDogdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgcmV0dXJuICc6Ok9iamVjdCc7XG5cbiAgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ09iamVjdCc7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBSdW50aW1lIHR5cGUgcmVmbGVjdGlvbiBoZWxwZXIuIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgYSBtb3JlIHJvYnVzdCByZXBsYWNlbWVudCBmb3IgdGhlIGBpbnN0YW5jZW9mYCBvcGVyYXRvci5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGB0cnVlYCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyAqYW55KiBvZiB0aGUgcHJvdmlkZWQgYHR5cGVzYC5cbiAqXG4gKiAgIFRoZSBwcm92aWRlZCBgdHlwZXNgIGNhbiBlYWNoIGVpdGhlciBiZSBhIHJlYWwgcmF3IHR5cGUgKGkuZS4gYFN0cmluZ2AgY2xhc3MpLCBvciB0aGUgbmFtZSBvZiBhIHR5cGUsIGFzIGEgc3RyaW5nLFxuICogICBpLmUuIGAnOjpTdHJpbmcnYC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBUaGUgdmFsdWUgd2hvc2UgdHlwZSB5b3Ugd2lzaCB0byBjb21wYXJlLlxuICogICAtIG5hbWU6IC4uLnR5cGVzXG4gKiAgICAgZGF0YVR5cGU6IEFycmF5PGFueT5cbiAqICAgICBkZXNjOiBBbGwgdHlwZXMgeW91IHdpc2ggdG8gY2hlY2sgYWdhaW5zdC4gU3RyaW5nIHZhbHVlcyBjb21wYXJlIHR5cGVzIGJ5IG5hbWUsIGZ1bmN0aW9uIHZhbHVlcyBjb21wYXJlIHR5cGVzIGJ5IGBpbnN0YW5jZW9mYC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdmFsdWVgIG1hdGNoZXMgYW55IG9mIHRoZSBwcm92aWRlZCBgdHlwZXNgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgY29uc3QgZ2V0SW50ZXJuYWxUeXBlTmFtZSA9ICh0eXBlKSA9PiB7XG4gICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh0eXBlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgIHJldHVybiBgOjoke25hdGl2ZVR5cGVNZXRhWzBdfWA7XG4gIH07XG5cbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGZvciAobGV0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVPZih0eXBlLCAnOjpTdHJpbmcnKSAmJiB2YWx1ZVR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgbGV0IGludGVybmFsVHlwZSA9IGdldEludGVybmFsVHlwZU5hbWUodHlwZSk7XG4gICAgICAgIGlmIChpbnRlcm5hbFR5cGUgJiYgaW50ZXJuYWxUeXBlID09PSB2YWx1ZVR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgVmVyaWZ5IHRoYXQgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBgbnVtYmVyYCB0eXBlIChvciBgTnVtYmVyYCBpbnN0YW5jZSksIGFuZCB0aGF0XG4gKiAgIGl0ICoqaXMgbm90KiogYE5hTmAsIGBJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGBudW1iZXJgIChvciBgTnVtYmVyYCBpbnN0YW5jZSkgYW5kIGlzIGFsc28gKipub3QqKiBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAuIGkuZS4gYChpc051bWJlcih2YWx1ZSkgJiYgaXNGaW5pdGUodmFsdWUpKWAuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE51bWJlcih2YWx1ZSkge1xuICByZXR1cm4gKGlzVHlwZSh2YWx1ZSwgJzo6TnVtYmVyJykgJiYgaXNGaW5pdGUodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFZlcmlmeSB0aGF0IHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGEgXCJwbGFpblwiL1widmFuaWxsYVwiIE9iamVjdCBpbnN0YW5jZS5cbiAqXG4gKiAgIFRoaXMgbWV0aG9kIGlzIGludGVuZGVkIHRvIGhlbHAgdGhlIGNhbGxlciBkZXRlY3QgaWYgYW4gb2JqZWN0IGlzIGEgXCJyYXcgcGxhaW4gb2JqZWN0XCIsXG4gKiAgIGluaGVyaXRpbmcgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAgKG9yIGEgYG51bGxgIHByb3RvdHlwZSkuXG4gKlxuICogICAxLiBgaXNQbGFpbk9iamVjdCh7fSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgMi4gYGlzUGxhaW5PYmplY3QobmV3IE9iamVjdCgpKWAgd2lsbCByZXR1cm4gYHRydWVgLlxuICogICAzLiBgaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKWAgd2lsbCByZXR1cm4gYHRydWVgLlxuICogICA0LiBgaXNQbGFpbk9iamVjdChuZXcgQ3VzdG9tQ2xhc3MoKSlgIHdpbGwgcmV0dXJuIGBmYWxzZWAuXG4gKiAgIDUuIEFsbCBvdGhlciBpbnZvY2F0aW9ucyBzaG91bGQgcmV0dXJuIGBmYWxzZWAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgXCJyYXdcIi9cInBsYWluXCIgT2JqZWN0IGluc3RhbmNlLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGEgamF2YXNjcmlwdCBwcmltaXRpdmUgdHlwZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGB0eXBlb2YgdmFsdWVgIGlzIG9uZSBvZjogYHN0cmluZ2AsIGBudW1iZXJgLCBgYm9vbGVhbmAsIGBiaWdpbnRgLCBvciBgc3ltYm9sYCxcbiAqICAgICAgKmFuZCBhbHNvKiBgdmFsdWVgIGlzICpub3QqIGBOYU5gLCBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYHVuZGVmaW5lZGAsIG9yIGBudWxsYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgQmFzZVV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgJzo6TnVtYmVyJywgJzo6Qm9vbGVhbicsICc6OkJpZ0ludCcpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGdhcmJhZ2UgY29sbGVjdGFibGUuXG4gKlxuICogICBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGNoZWNrIGlmIGFueSBgdmFsdWVgIGlzIGFsbG93ZWQgdG8gYmUgdXNlZCBhcyBhIHdlYWsgcmVmZXJlbmNlLlxuICpcbiAqICAgRXNzZW50aWFsbHksIHRoaXMgd2lsbCByZXR1cm4gYGZhbHNlYCBmb3IgYW55IHByaW1pdGl2ZSB0eXBlLCBvciBgbnVsbGAsIGB1bmRlZmluZWRgLCBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAgdmFsdWVzLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHR5cGVvZiB2YWx1ZWAgaXMgb25lIG9mOiBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCwgYGJpZ2ludGAsIG9yIGBzeW1ib2xgLFxuICogICAgICAqYW5kIGFsc28qIGB2YWx1ZWAgKmlzIG5vdCogYE5hTmAsIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBgdW5kZWZpbmVkYCwgb3IgYG51bGxgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29sbGVjdGFibGUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyhJbmZpbml0eSkgfHwgT2JqZWN0LmlzKC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnLCAnOjpOdW1iZXInLCAnOjpCb29sZWFuJywgJzo6QmlnSW50JykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIFwiZW1wdHlcIiAoaXMgKipOKip1bGwgKipPKipyICoqRSoqbXB0eSkuXG4gKlxuICogICBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgXCJlbXB0eVwiIGlmIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaXMgbWV0OlxuICogICAxLiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICogICAyLiBgdmFsdWVgIGlzIGBudWxsYC5cbiAqICAgMy4gYHZhbHVlYCBpcyBgJydgIChhbiBlbXB0eSBzdHJpbmcpLlxuICogICA0LiBgdmFsdWVgIGlzIG5vdCBhbiBlbXB0eSBzdHJpbmcsIGJ1dCBpdCBjb250YWlucyBub3RoaW5nIGV4Y2VwdCB3aGl0ZXNwYWNlIChgXFx0YCwgYFxccmAsIGBcXHNgLCBvciBgXFxuYCkuXG4gKiAgIDUuIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKiAgIDYuIGB2YWx1ZS5sZW5ndGhgIGlzIGEgYE51bWJlcmAgb3IgYG51bWJlcmAgdHlwZSwgYW5kIGlzIGVxdWFsIHRvIGAwYC5cbiAqICAgNy4gYHZhbHVlYCBpcyBhIEBzZWUgQmFzZVV0aWxzLmlzUGxhaW5PYmplY3Q/Y2FwdGlvbj1wbGFpbitvYmplY3Q7IGFuZCBoYXMgbm8gaXRlcmFibGUga2V5cy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGFueSBvZiB0aGUgXCJlbXB0eVwiIGNvbmRpdGlvbnMgYWJvdmUgYXJlIHRydWUuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIEJhc2VVdGlscy5pc05vdE5PRTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05PRSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJykgJiYgKC9eW1xcdFxcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnOjpOdW1iZXInKSlcbiAgICByZXR1cm4gKHZhbHVlLmxlbmd0aCA9PT0gMCk7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzICoqbm90KiogXCJlbXB0eVwiIChpcyBub3QgKipOKip1bGwgKipPKipyICoqRSoqbXB0eSkuXG4gKlxuICogICBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgXCJlbXB0eVwiIGlmIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgaXMgbWV0OlxuICogICAxLiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICogICAyLiBgdmFsdWVgIGlzIGBudWxsYC5cbiAqICAgMy4gYHZhbHVlYCBpcyBgJydgIChhbiBlbXB0eSBzdHJpbmcpLlxuICogICA0LiBgdmFsdWVgIGlzIG5vdCBhbiBlbXB0eSBzdHJpbmcsIGJ1dCBpdCBjb250YWlucyBub3RoaW5nIGV4Y2VwdCB3aGl0ZXNwYWNlIChgXFx0YCwgYFxccmAsIGBcXHNgLCBvciBgXFxuYCkuXG4gKiAgIDUuIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKiAgIDYuIGB2YWx1ZS5sZW5ndGhgIGlzIGEgYE51bWJlcmAgb3IgYG51bWJlcmAgdHlwZSwgYW5kIGlzIGVxdWFsIHRvIGAwYC5cbiAqICAgNy4gYHZhbHVlYCBpcyBhIEBzZWUgQmFzZVV0aWxzLmlzUGxhaW5PYmplY3Q/Y2FwdGlvbj1wbGFpbitvYmplY3Q7IGFuZCBoYXMgbm8gaXRlcmFibGUga2V5cy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYGZhbHNlYCBpZiBhbnkgb2YgdGhlIFwiZW1wdHlcIiBjb25kaXRpb25zIGFib3ZlIGFyZSB0cnVlLlxuICogICAyLiBPdGhlcndpc2UsIGB0cnVlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBpcyB0aGUgZXhhY3QgaW52ZXJzZSBvZiBAc2VlIEJhc2VVdGlscy5pc05PRTtcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBCYXNlVXRpbHMuaXNOT0U7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOb3ROT0UodmFsdWUpIHtcbiAgcmV0dXJuICFpc05PRSh2YWx1ZSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDb252ZXJ0IHRoZSBwcm92aWRlZCBgc3RyaW5nYCBgdmFsdWVgIGludG8gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBub24td29yZCBjaGFyYWN0ZXJzIChbYS16QS1aMC05X10pIGFyZSBzdHJpcHBlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZy5cbiAqICAgMi4gQW55IG5vbi13b3JkIGNoYXJhY3RlcnMgKFthLXpBLVowLTlfXSkgYXJlIHN0cmlwcGVkIGZyb20gdGhlIGVuZCBvZiB0aGUgc3RyaW5nLlxuICogICAzLiBFYWNoIFwid29yZFwiIGlzIGNhcGl0YWxpemVkLlxuICogICA0LiBUaGUgZmlyc3QgbGV0dGVyIGlzIGFsd2F5cyBsb3dlci1jYXNlZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBTdHJpbmcgdG8gY29udmVydCBpbnRvIFtjYW1lbENhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0NhbWVsX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtjYW1lbENhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0NhbWVsX2Nhc2UpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBCYXNlVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhCYXNlVXRpbHMudG9DYW1lbENhc2UoJy0tdGVzdC1zb21lX3ZhbHVlX0AnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0ZXN0U29tZVZhbHVlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9eXFxXLywgJycpXG4gICAgLnJlcGxhY2UoL1tcXFddKyQvLCAnJylcbiAgICAucmVwbGFjZSgvKFtBLVpdKykvZywgJy0kMScpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxXKyguKS9nLCAobSwgcCkgPT4ge1xuICAgICAgcmV0dXJuIHAudG9VcHBlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9eKC4pKC4qKSQvLCAobSwgZiwgbCkgPT4gYCR7Zi50b0xvd2VyQ2FzZSgpfSR7bH1gKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBbc25ha2VfY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU25ha2VfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBjYXBpdGFsaXplZCBjaGFyYWN0ZXIgc2VxdWVuY2UgaXMgcHJlZml4ZWQgYnkgYW4gdW5kZXJzY29yZS5cbiAqICAgMi4gTW9yZSB0aGFuIG9uZSBzZXF1ZW50aWFsIHVuZGVyc2NvcmVzIGFyZSBjb252ZXJ0ZWQgaW50byBhIHNpbmdsZSB1bmRlcnNjb3JlLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byBjb252ZXJ0IGludG8gW3NuYWtlX2Nhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1NuYWtlX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtzbmFrZV9jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNTbmFrZV9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLnRvU25ha2VDYXNlKCdUaGlzSXNBU2VudGVuY2UnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0aGlzX2lzX2Ffc2VudGVuY2UnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL1tBLVpdKy9nLCAobSwgb2Zmc2V0KSA9PiAoKG9mZnNldCkgPyBgXyR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpKVxuICAgIC5yZXBsYWNlKC9fezIsfS9nLCAnXycpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDb252ZXJ0IHRoZSBwcm92aWRlZCBgc3RyaW5nYCBgdmFsdWVgIGludG8gW2tlYmFiLWNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0tlYmFiX2Nhc2UpLlxuICpcbiAqICAgVGhlIHByb2Nlc3MgaXMgcm91Z2hseSBhcyBmb2xsb3dzOlxuICogICAxLiBBbnkgY2FwaXRhbGl6ZWQgY2hhcmFjdGVyIHNlcXVlbmNlIGlzIHByZWZpeGVkIGJ5IGEgaHlwaGVuLlxuICogICAyLiBNb3JlIHRoYW4gb25lIHNlcXVlbnRpYWwgaHlwaGVucyBhcmUgY29udmVydGVkIGludG8gYSBzaW5nbGUgaHlwaGVuLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byB0dXJuIGludG8gW2tlYmFiLWNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI0tlYmFiX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgQmFzZVV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coQmFzZVV0aWxzLnRvS2ViYWJDYXNlKCdUaGlzSXNBU2VudGVuY2UnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0aGlzLWlzLWEtc2VudGVuY2UnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0tlYmFiQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL1tBLVpdKy9nLCAobSwgb2Zmc2V0KSA9PiAoKG9mZnNldCkgPyBgLSR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpKVxuICAgIC5yZXBsYWNlKC8tezIsfS9nLCAnLScpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBEbyBvdXIgYmVzdCB0byBlbXVsYXRlIFtwcm9jZXNzLm5leHRUaWNrXShodHRwczovL25vZGVqcy5vcmcvZW4vZ3VpZGVzL2V2ZW50LWxvb3AtdGltZXJzLWFuZC1uZXh0dGljay8jcHJvY2Vzc25leHR0aWNrKVxuICogICBpbiB0aGUgYnJvd3Nlci5cbiAqXG4gKiAgIEluIG9yZGVyIHRvIHRyeSBhbmQgZW11bGF0ZSBgcHJvY2Vzcy5uZXh0VGlja2AsIHRoaXMgZnVuY3Rpb24gd2lsbCB1c2UgYGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGNhbGxiYWNrKCkpYCBpZiBhdmFpbGFibGUsXG4gKiAgIG90aGVyd2lzZSBpdCB3aWxsIGZhbGxiYWNrIHRvIHVzaW5nIGBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrKWAuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogY2FsbGJhY2tcbiAqICAgICBkYXRhVHlwZTogZnVuY3Rpb25cbiAqICAgICBkZXNjOiBDYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIG9uIFwibmV4dFRpY2tcIi5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBmdW5jdGlvbiB3aWxsIHByZWZlciBhbmQgdXNlIGBwcm9jZXNzLm5leHRUaWNrYCBpZiBpdCBpcyBhdmFpbGFibGUgKGkuZS4gaWYgcnVubmluZyBvbiBOb2RlSlMpLlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVGhpcyBmdW5jdGlvbiBpcyB1bmxpa2VseSB0byBhY3R1YWxseSBiZSB0aGUgbmV4dCBcInRpY2tcIiBvZiB0aGUgdW5kZXJseWluZ1xuICogICAgIGphdmFzY3JpcHQgZW5naW5lLiBUaGlzIG1ldGhvZCBqdXN0IGRvZXMgaXRzIGJlc3QgdG8gZW11bGF0ZSBcIm5leHRUaWNrXCIuIEluc3RlYWQgb2YgdGhlXG4gKiAgICAgYWN0dWFsIFwibmV4dCB0aWNrXCIsIHRoaXMgd2lsbCBpbnN0ZWFkIGJlIFwiYXMgZmFzdCBhcyBwb3NzaWJsZVwiLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBmdW5jdGlvbiBkZWxpYmVyYXRlbHkgYXR0ZW1wdHMgdG8gdXNlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGZpcnN0LS1ldmVuIHRob3VnaCBpdCBsaWtlbHkgZG9lc24ndFxuICogICAgIGhhdmUgdGhlIGZhc3Rlc3QgdHVybi1hcm91bmQtdGltZS0tdG8gc2F2ZSBiYXR0ZXJ5IHBvd2VyLiBUaGUgaWRlYSBiZWluZyB0aGF0IFwic29tZXRoaW5nIG5lZWRzIHRvIGJlIGRvbmUgKnNvb24qXCIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzLm5leHRUaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KSkudGhlbigoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IElTX05VTUJFUiA9IC9eKFstK10/KShcXGQqKD86XFwuXFxkKyk/KShlWy0rXVxcZCspPyQvO1xuY29uc3QgSVNfQk9PTEVBTiA9IC9eKHRydWV8ZmFsc2UpJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ05hTicpXG4gICAgcmV0dXJuIE5hTjtcblxuICBpZiAodmFsdWUgPT09ICdJbmZpbml0eScgfHwgdmFsdWUgPT09ICcrSW5maW5pdHknKVxuICAgIHJldHVybiBJbmZpbml0eTtcblxuICBpZiAodmFsdWUgPT09ICctSW5maW5pdHknKVxuICAgIHJldHVybiAtSW5maW5pdHk7XG5cbiAgaWYgKElTX05VTUJFUi50ZXN0KHZhbHVlKSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG5cbiAgaWYgKElTX0JPT0xFQU4udGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gJ3RydWUnKTtcblxuICByZXR1cm4gKCcnICsgdmFsdWUpO1xufVxuIiwiaW1wb3J0IHtcbiAgTVlUSElYX1RZUEUsXG4gIE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSxcbiAgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVELFxuICBNWVRISVhfU0hBRE9XX1BBUkVOVCxcbiAgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgICBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgICAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBRdWVyeUVuZ2luZSB9ICBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IENvbXBvbmVudHNcbiAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29tcG9uZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgQ29tcG9uZW50IGFuZCBmcmFtZXdvcmsgY2xhc3NlcyBhbmQgZnVuY3Rpb25hbGl0eSBhcmUgZm91bmQgaGVyZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogaXNNeXRoaXhDb21wb25lbnRcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhbiBpbnN0YW5jZSBrZXkgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IGluc3RhbmNlcy5cbiAqXG4gKiAgICAgICBGb3Igc3VjaCBpbnN0YW5jZXMsIGFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IHNpbXBseSByZXR1cm5zIGB0cnVlYCwgYWxsb3dpbmcgdGhlIGNhbGxlclxuICogICAgICAgdG8ga25vdyBpZiBhIHNwZWNpZmljIGluc3RhbmNlIChFbGVtZW50KSBpcyBhIE15dGhpeCBVSSBjb21wb25lbnQuXG4gKiAgIC0gbmFtZTogTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBhZ2FpbnN0IGVsZW1lbnRzIHdpdGggYSBgZGF0YS1zcmNgIGF0dHJpYnV0ZS5cbiAqICAgICAgIEZvciBlbGVtZW50cyB3aXRoIHRoaXMgYXR0cmlidXRlLCBzZXQgYW4gW2ludGVyc2VjdGlvbiBvYnNlcnZlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbl9PYnNlcnZlcl9BUEkpIGlzIHNldHVwLlxuICogICAgICAgV2hlbiB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIHJlcG9ydHMgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCB0aGVuIHRoZSBVUkwgc3BlY2lmaWVkIGJ5IGBkYXRhLXNyY2AgaXMgZmV0Y2hlZCwgYW5kIGR1bXBlZCBpbnRvXG4gKiAgICAgICB0aGUgZWxlbWVudCBhcyBpdHMgY2hpbGRyZW4uIFRoaXMgYWxsb3dzIGZvciBkeW5hbWljIFwicGFydGlhbHNcIiB0aGF0IGFyZSBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogICAgICAgVGhlIHZhbHVlIHN0b3JlZCBhdCB0aGlzIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBpcyBhIE1hcCBvZiBbaW50ZXJzZWN0aW9uIG9ic2VydmVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpXG4gKiAgICAgICBpbnN0YW5jZXMuIFRoZSBrZXlzIG9mIHRoaXMgbWFwIGFyZSB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVycyB0aGVtc2VsdmVzLiBUaGUgdmFsdWVzIGFyZSByYXcgb2JqZWN0cyB3aXRoIHRoZSBzaGFwZVxuICogICAgICAgYHsgd2FzVmlzaWJsZTogYm9vbGVhbiwgcmF0aW9WaXNpYmxlOiBmbG9hdCwgcHJldmlvdXNWaXNpYmlsaXR5OiBib29sZWFuLCB2aXNpYmlsaXR5OiBib29sZWFuIH1gLlxuICovXG5cbmV4cG9ydCBjb25zdCBpc015dGhpeENvbXBvbmVudCA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaXMtbXl0aGl4LWNvbXBvbmVudCcpOyAvLyBAcmVmOkNvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRcblxuY29uc3QgSVNfQVRUUl9NRVRIT0RfTkFNRSAgID0gL15hdHRyXFwkKC4qKSQvO1xuY29uc3QgUkVHSVNURVJFRF9DT01QT05FTlRTID0gbmV3IFNldCgpO1xuXG4vKioqXG4gKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAqIGRlc2M6IHxcbiAqICAgVGhpcyB0aGUgYmFzZSBjbGFzcyBvZiBhbGwgTXl0aGl4IFVJIGNvbXBvbmVudHMuIEl0IGluaGVyaXRzXG4gKiAgIGZyb20gSFRNTEVsZW1lbnQsIGFuZCBzbyB3aWxsIGVuZCB1cCBiZWluZyBhIFtXZWIgQ29tcG9uZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpLlxuICpcbiAqICAgSXQgaXMgc3Ryb25nbHkgcmVjb21tZW5kZWQgdGhhdCB5b3UgZnVsbHkgcmVhZCB1cCBhbmQgdW5kZXJzdGFuZFxuICogICBbV2ViIENvbXBvbmVudHNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQ29tcG9uZW50cylcbiAqICAgaWYgeW91IGRvbid0IGFscmVhZHkgZnVsbHkgdW5kZXJzdGFuZCB0aGVtLiBUaGUgY29yZSBvZiBNeXRoaXggVUkgaXMgdGhlXG4gKiAgIFtXZWIgQ29tcG9uZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpIHN0YW5kYXJkLFxuICogICBzbyB5b3UgbWlnaHQgZW5kIHVwIGEgbGl0dGxlIGNvbmZ1c2VkIGlmIHlvdSBkb24ndCBhbHJlYWR5IHVuZGVyc3RhbmQgdGhlIGZvdW5kYXRpb24uXG4gKlxuICogcHJvcGVydGllczpcbiAqICAgLSBjYXB0aW9uOiBcIi4uLiBIVE1MRWxlbWVudCBJbnN0YW5jZSBQcm9wZXJ0aWVzXCJcbiAqICAgICBkZXNjOiBcIkFsbCBbSFRNTEVsZW1lbnQgSW5zdGFuY2UgUHJvcGVydGllc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50I2luc3RhbmNlX3Byb3BlcnRpZXMpIGFyZSBpbmhlcml0ZWQgZnJvbSBbSFRNTEVsZW1lbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudClcIlxuICogICAgIGxpbms6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzXG4gKlxuICogICAtIG5hbWU6IGlzTXl0aGl4Q29tcG9uZW50XG4gKiAgICAgZGF0YVR5cGU6IGJvb2xlYW5cbiAqICAgICBjYXB0aW9uOiBcIltzdGF0aWMgTXl0aGl4VUlDb21wb25lbnQuaXNNeXRoaXhDb21wb25lbnRdXCJcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBJcyBgdHJ1ZWAgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzLlxuICogICAtIG5hbWU6IHNlbnNpdGl2ZVRhZ05hbWVcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgY2FwdGlvbjogc2Vuc2l0aXZlVGFnTmFtZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFdvcmtzIGlkZW50aWNhbGx5IHRvIFtFbGVtZW50LnRhZ05hbWVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3RhZ05hbWUpIGZvciBYTUwsIHdoZXJlIGNhc2UgaXMgcHJlc2VydmVkLlxuICogICAgICAgSW4gSFRNTCB0aGlzIHdvcmtzIGxpa2UgW0VsZW1lbnQudGFnTmFtZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvdGFnTmFtZSksIGJ1dCBpbnN0ZWFkIG9mIHRoZSByZXN1bHRcbiAqICAgICAgIGFsd2F5cyBiZWluZyBVUFBFUkNBU0UsIHRoZSB0YWcgbmFtZSB3aWxsIGJlIHJldHVybmVkIHdpdGggdGhlIGNhc2luZyBwcmVzZXJ2ZWQuXG4gKiAgIC0gbmFtZTogdGVtcGxhdGVJRFxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBjYXB0aW9uOiB0ZW1wbGF0ZUlEXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyBhIGNvbnZlbmllbmNlIHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2YgYHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSURgXG4gKiAgIC0gbmFtZTogZGVsYXlUaW1lcnNcbiAqICAgICBkYXRhVHlwZTogXCJNYXAmbHQ7c3RyaW5nLCBQcm9taXNlJmd0O1wiXG4gKiAgICAgY2FwdGlvbjogZGVsYXlUaW1lcnNcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBBIE1hcCBpbnN0YW5jZSB0aGF0XG4gKiAgICAgICByZXRhaW5zIGBzZXRUaW1lb3V0YCBpZHMgc28gdGhhdCBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlOyBjYW4gcHJvcGVybHkgZnVuY3Rpb24uIEtleXMgYXJlIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuZGVib3VuY2U7XG4gKiAgICAgICB0aW1lciBpZHMgKG9mIHR5cGUgYHN0cmluZ2ApLiBWYWx1ZXMgYXJlIFByb21pc2UgaW5zdGFuY2VzLlxuICogICAgICAgRWFjaCBwcm9taXNlIGluc3RhbmNlIGFsc28gaGFzIGEgc3BlY2lhbCBrZXkgYHRpbWVySURgIHRoYXQgY29udGFpbnMgYSBgc2V0VGltZW91dGAgaWQgb2YgYSBqYXZhc2NyaXB0IHRpbWVyLlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDp3YXJuaW5nOiBVc2UgYXQgeW91ciBvd24gcmlzay4gVGhpcyBpcyBNeXRoaXggVUkgaW50ZXJuYWwgY29kZSB0aGF0IG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgTXl0aGl4VUlDb21wb25lbnQuZGVib3VuY2U7XG4gKiAgIC0gbmFtZTogc2hhZG93XG4gKiAgICAgZGF0YVR5cGU6IFwiW1NoYWRvd1Jvb3RdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TaGFkb3dSb290KVwiXG4gKiAgICAgY2FwdGlvbjogc2hhZG93XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHNoYWRvdyByb290IG9mIHRoaXMgY29tcG9uZW50IChvciBgbnVsbGAgaWYgbm9uZSkuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIFRoaXMgaXMgdGhlIGNhY2hlZCByZXN1bHQgb2YgY2FsbGluZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmNyZWF0ZVNoYWRvd0RPTTsgd2hlblxuICogICAgICAgICB0aGUgY29tcG9uZW50IGlzIGZpcnN0IGluaXRpYWxpemVkLlxuICogICAtIG5hbWU6IHRlbXBsYXRlXG4gKiAgICAgZGF0YVR5cGU6IFwiW3RlbXBsYXRlIGVsZW1lbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC90ZW1wbGF0ZSlcIlxuICogICAgIGNhcHRpb246IHRlbXBsYXRlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIFt0ZW1wbGF0ZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50L3RlbXBsYXRlKSBlbGVtZW50IGZvciB0aGlzXG4gKiAgICAgICBjb21wb25lbnQsIG9yIGBudWxsYCBpZiB0aGVyZSBpcyBubyB0ZW1wbGF0ZSBmb3VuZCBmb3IgdGhlIGNvbXBvbmVudC5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gVGhpcyBpcyB0aGUgY2FjaGVkIHJlc3VsdCBvZiBjYWxsaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuZ2V0Q29tcG9uZW50VGVtcGxhdGU7IHdoZW5cbiAqICAgICAgICAgdGhlIGNvbXBvbmVudCBpcyBmaXJzdCBpbml0aWFsaXplZC5cbioqKi9cblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0oaW5zdGFuY2UpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChpbnN0YW5jZSAmJiBpbnN0YW5jZVtNWVRISVhfVFlQRV0gPT09IE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgX0tsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG5cbiAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSkge1xuICAgICAgbGV0IEtsYXNzID0gX0tsYXNzIHx8IHRoaXM7XG4gICAgICBLbGFzcy5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBLbGFzcy5jb21waWxlQXR0cmlidXRlTWV0aG9kcyhLbGFzcyk7XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVnaXN0ZXJFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc3RhdGljIGNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24oS2xhc3MpIHtcbiAgICBjb25zdCBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzID0gKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSkgPT4ge1xuICAgICAgaWYgKFJFR0lTVEVSRURfQ09NUE9ORU5UUy5oYXMoS2xhc3MpKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCB7IGRlc2NyaXB0b3IgfSA9IFV0aWxzLmdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4ocHJvdG8sIG9yaWdpbmFsTmFtZSk7XG4gICAgICBpZiAoIWRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhpcyBmcm9tXG4gICAgICAvLyB0aGUgcHJvdG90eXBlLCBhcyBjaGlsZCBjbGFzc2VzIHdpbGxcbiAgICAgIC8vIHdhbnQgdG8gaW5oZXJpdCBhdHRyaWJ1dGUgYmVoYXZpb3IuXG4gICAgICAvLyBkZWxldGUgcHJvdG90eXBlW29yaWdpbmFsTmFtZV07XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGUgdXNlciBkaWQgaXQgd3JvbmcuLi5cbiAgICAgIC8vIHNvIGp1c3QgbWFrZSBpdCB0aGUgXCJzZXR0ZXJcIlxuICAgICAgbGV0IHNldHRlciAgICA9IGRlc2NyaXB0b3Iuc2V0IHx8IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICBsZXQgZ2V0dGVyICAgID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICBsZXQgaGFzU2V0dGVyID0gKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgICAgbGV0IGhhc0dldHRlciA9ICh0eXBlb2YgZ2V0dGVyID09PSAnZnVuY3Rpb24nKTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvdG8sIHtcbiAgICAgICAgW3Byb3BlcnR5TmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChoYXNHZXR0ZXIpID8gZ2V0dGVyLmNhbGwodGhpcykgOiB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLmF0dHIoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXR0cihhdHRyaWJ1dGVOYW1lLCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNTZXR0ZXIpXG4gICAgICAgICAgICAgIHNldHRlci5jYWxsKHRoaXMsIFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IHByb3RvICAgICAgICAgICA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gVXRpbHMuZ2V0QWxsUHJvcGVydHlOYW1lcyhwcm90bylcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IElTX0FUVFJfTUVUSE9EX05BTUUudGVzdChuYW1lKSlcbiAgICAgIC5tYXAoKG9yaWdpbmFsTmFtZSkgPT4ge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lICA9IG9yaWdpbmFsTmFtZS5tYXRjaChJU19BVFRSX01FVEhPRF9OQU1FKVsxXTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBCYXNlVXRpbHMudG9LZWJhYkNhc2UocHJvcGVydHlOYW1lKTtcblxuICAgICAgICBzZXR1cEF0dHJpYnV0ZUhhbmRsZXJzKHsgcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lLCBvcmlnaW5hbE5hbWUgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWU7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhdHRyaWJ1dGVOYW1lcykpO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGFkZGVkIHRvIHRoZSBET00uXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25BZGRlZCgpIHt9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBtdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGF0YVR5cGVzOiBNdXRhdGlvblJlY29yZFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgTXV0YXRpb25SZWNvcmQgaW5zdGFuY2UgdGhhdCB0aGF0IGNhdXNlZCB0aGlzIG1ldGhvZCB0byBiZSBjYWxsZWQuXG4gICAqL1xuICBvbk11dGF0aW9uUmVtb3ZlZCgpIHt9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBDYWxsZWQgd2hlbiBhbiBlbGVtZW50IGlzIGFkZGVkIGFzIGEgY2hpbGQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5vZGVcbiAgICogICAgIGRhdGFUeXBlczogRWxlbWVudFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgY2hpbGQgZWxlbWVudCBiZWluZyBhZGRlZC5cbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIGEgY2hpbGQgZWxlbWVudCBpcyByZW1vdmVkLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBub2RlXG4gICAqICAgICBkYXRhVHlwZXM6IEVsZW1lbnRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIGNoaWxkIGVsZW1lbnQgYmVpbmcgcmVtb3ZlZC5cbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25DaGlsZFJlbW92ZWQoKSB7fVxuXG4gIHN0YXRpYyBpc015dGhpeENvbXBvbmVudCA9IGlzTXl0aGl4Q29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSxcbiAgICAgIH0sXG4gICAgICBbaXNNeXRoaXhDb21wb25lbnRdOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuaXNNeXRoaXhDb21wb25lbnRcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBpc015dGhpeENvbXBvbmVudCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBVdGlscy5iaW5kTWV0aG9kcy5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlIC8qLCBbIEhUTUxFbGVtZW50LnByb3RvdHlwZSBdKi8pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NlbnNpdGl2ZVRhZ05hbWUnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuc2Vuc2l0aXZlVGFnTmFtZVxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gKCh0aGlzLnByZWZpeCkgPyBgJHt0aGlzLnByZWZpeH06JHt0aGlzLmxvY2FsTmFtZX1gIDogdGhpcy5sb2NhbE5hbWUpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZUlEJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LnRlbXBsYXRlSURcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSUQsXG4gICAgICB9LFxuICAgICAgJ2RlbGF5VGltZXJzJzogeyAvLyBAcmVmOk15dGhpeFVJQ29tcG9uZW50LmRlbGF5VGltZXJzXG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBuZXcgTWFwKCksXG4gICAgICB9LFxuICAgICAgJ2RvY3VtZW50SW5pdGlhbGl6ZWQnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuZG9jdW1lbnRJbml0aWFsaXplZFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVEKSxcbiAgICAgICAgc2V0OiAgICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQsICEhdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzaGFkb3cnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuc2hhZG93XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY3JlYXRlU2hhZG93RE9NKCksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgZ2V0dGluZyBhbmQgc2V0dGluZyBhdHRyaWJ1dGVzLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZFxuICAgKiAgIHRvIHRoaXMgbWV0aG9kLCB0aGVuIGl0IHdpbGwgYWN0IGFzIGEgZ2V0dGVyLCBnZXR0aW5nIHRoZSBhdHRyaWJ1dGUgc3BlY2lmaWVkIGJ5IG5hbWUuXG4gICAqXG4gICAqICAgSWYgaG93ZXZlciB0d28gb3IgbW9yZSBhcmd1bWVudHMgYXJlIHByb3ZpZGVkLCB0aGVuIHRoaXMgaXMgYW4gYXR0cmlidXRlIHNldHRlci5cbiAgICpcbiAgICogICBJZiB0aGUgcHJvdmlkZWQgdmFsdWUgaXMgYHVuZGVmaW5lZGAsIGBudWxsYCwgb3IgYGZhbHNlYCwgdGhlbiB0aGUgYXR0cmlidXRlIHdpbGwgYmVcbiAgICogICByZW1vdmVkLlxuICAgKlxuICAgKiAgIElmIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBgdHJ1ZWAsIHRoZW4gdGhlIGF0dHJpYnV0ZSdzIHZhbHVlIHdpbGwgYmUgc2V0IHRvIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKlxuICAgKiAgIEFueSBvdGhlciB2YWx1ZSBpcyBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgYW5kIHNldCBhcyB0aGUgYXR0cmlidXRlJ3MgdmFsdWUuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5hbWVcbiAgICogICAgIGRhdGFUeXBlczogc3RyaW5nXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgdG8gb3BlcmF0ZSBvbi5cbiAgICogICAtIG5hbWU6IHZhbHVlXG4gICAqICAgICBkYXRhVHlwZXM6IGFueVxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBJZiBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgZmFsc2VgLCByZW1vdmUgdGhlIG5hbWVkIGF0dHJpYnV0ZS5cbiAgICogICAgICAgSWYgYHRydWVgLCBzZXQgdGhlIG5hbWVkIGF0dHJpYnV0ZSdzIHZhbHVlIHRvIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKiAgICAgICBGb3IgYW55IG90aGVyIHZhbHVlLCBmaXJzdCBjb252ZXJ0IGl0IGludG8gYSBzdHJpbmcsIGFuZCB0aGVuIHNldCB0aGUgbmFtZWQgYXR0cmlidXRlJ3MgdmFsdWUgdG8gdGhlIHJlc3VsdGluZyBzdHJpbmcuXG4gICAqIHJldHVybjogfFxuICAgKiAgIDEuIEB0eXBlcyBzdHJpbmc7IElmIGEgc2luZ2xlIGFyZ3VtZW50IGlzIHByb3ZpZGVkLCB0aGVuIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBuYW1lZCBhdHRyaWJ1dGUuXG4gICAqICAgMi4gQHR5cGVzIHRoaXM7IElmIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gc2V0IHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlIHRvIHRoZSBzcGVjaWZpZWQgdmFsdWUsXG4gICAqICAgICAgYW5kIHJldHVybiBgdGhpc2AgKHRvIGFsbG93IGZvciBjaGFpbmluZykuXG4gICAqL1xuICBhdHRyKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCAodmFsdWUgPT09IHRydWUpID8gJycgOiAoJycgKyB2YWx1ZSkpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEluamVjdCBhIG5ldyBzdHlsZSBzaGVldCB2aWEgYSBgPHN0eWxlPmAgZWxlbWVudCBkeW5hbWljYWxseSBhdCBydW4tdGltZS5cbiAgICpcbiAgICogICBUaGlzIG1ldGhvZCBhbGxvd3MgdGhlIGNhbGxlciB0byBpbmplY3QgZHluYW1pYyBzdHlsZXMgYXQgcnVuLXRpbWUuXG4gICAqICAgSXQgd2lsbCBvbmx5IGluamVjdCB0aGUgc3R5bGVzIG9uY2UsIG5vIG1hdHRlciBob3cgbWFueSB0aW1lcyB0aGVcbiAgICogICBtZXRob2QgaXMgY2FsbGVkLS1hcyBsb25nIGFzIHRoZSBzdHlsZSBjb250ZW50IGl0c2VsZiBkb2Vzbid0IGNoYW5nZS5cbiAgICpcbiAgICogICBUaGUgY29udGVudCBpcyBoYXNoZWQgdmlhIFNIQTI1NiwgYW5kIHRoZSBoYXNoIGlzIHVzZWQgYXMgdGhlIHN0eWxlIHNoZWV0IGlkLiBUaGlzXG4gICAqICAgYWxsb3dzIHlvdSB0byBjYWxsIHRoZSBtZXRob2QgaW5zaWRlIGEgY29tcG9uZW50J3MgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tb3VudGVkO1xuICAgKiAgIG1ldGhvZCwgd2l0aG91dCBuZWVkaW5nIHRvIHdvcnJ5IGFib3V0IGR1cGxpY2F0aW5nIHRoZSBzdHlsZXMgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogY29udGVudFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIENTUyBzdHlsZXNoZWV0IGNvbnRlbnQgdG8gaW5qZWN0IGludG8gYSBgPHN0eWxlPmAgZWxlbWVudC4gVGhpcyBjb250ZW50IGlzXG4gICAqICAgICAgIHVzZWQgdG8gZ2VuZXJhdGUgYW4gYGlkYCBmb3IgdGhlIGA8c3R5bGU+YCBlbGVtZW50LCBzbyB0aGF0IGl0IG9ubHkgZ2V0cyBhZGRlZFxuICAgKiAgICAgICB0byB0aGUgYGRvY3VtZW50YCBvbmNlLlxuICAgKiAgIC0gbmFtZTogbWVkaWFcbiAgICogICAgIGRhdGFUeXBlczogc3RyaW5nXG4gICAqICAgICBkZWZhdWx0OiBcIidzY3JlZW4nXCJcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFdoYXQgdG8gc2V0IHRoZSBgbWVkaWFgIGF0dHJpYnV0ZSBvZiB0aGUgY3JlYXRlZCBgPHN0eWxlPmAgZWxlbWVudCB0by4gRGVmYXVsdHNcbiAgICogICAgICAgdG8gYCdzY3JlZW4nYC5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogSXQgaXMgb2Z0ZW4gYmV0dGVyIHRvIHNpbXBseSBhZGQgYSBgPHN0eWxlPmAgZWxlbWVudCB0byB5b3VyIGNvbXBvbmVudCdzIEhUTUwgdGVtcGxhdGUuXG4gICAqICAgICBIb3dldmVyLCBzb21ldGltZXMgdHJ1bHkgZHluYW1pYyBzdHlsZXMgYXJlIG5lZWRlZCwgd2hlcmUgdGhlIGNvbnRlbnQgd29uJ3QgYmUga25vd25cbiAgICogICAgIHVudGlsIHJ1bnRpbWUuIFRoaXMgaXMgdGhlIHByb3BlciB1c2UgY2FzZSBmb3IgdGhpcyBtZXRob2QuXG4gICAqICAgLSB8XG4gICAqICAgICA6d2FybmluZzogUGxlYXNlIGVkdWNhdGVkIHlvdXJzZWxmICh1bmxpa2UgcGVvcGxlIHdobyBsb3ZlIFJlYWN0KSBhbmQgZG8gbm90IG92ZXJ1c2UgZHluYW1pYyBvciBpbmxpbmUgc3R5bGVzLlxuICAgKiAgICAgV2hpbGUgdGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBjZXJ0YWlubHkgYSBzdGVwIGFib3ZlIGlubGluZSBzdHlsZXMsIHRoaXMgbWV0aG9kIGhhc1xuICAgKiAgICAgW2dyZWF0IHBvdGVudGlhbCB0byBjYXVzZSBoYXJtXShodHRwczovL3dvcmxkb2ZkZXYuaW5mby82LXJlYXNvbnMtd2h5LXlvdS1zaG91bGRudC1zdHlsZS1pbmxpbmUvKVxuICAgKiAgICAgYW5kIHNwcmVhZCB5b3VyIG93biBpZ25vcmFuY2UgdG8gb3RoZXJzLiBVc2Ugd2l0aCAqKkNBUkUqKiFcbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIEVsZW1lbnQ7IFRoZSBgPHN0eWxlPmAgZWxlbWVudCBmb3IgdGhlIHNwZWNpZmllZCBzdHlsZS5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gICAqXG4gICAqICAgICBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgICogICAgICAgc3RhdGljIHRhZ05hbWUgPSAnbXktY29tcG9uZW50JztcbiAgICpcbiAgICogICAgICAgLy8gLi4uXG4gICAqXG4gICAqICAgICAgIG1vdW50ZWQoKSB7XG4gICAqICAgICAgICAgbGV0IHsgc2lkZWJhcldpZHRoIH0gPSB0aGlzLmxvYWRVc2VyUHJlZmVyZW5jZXMoKTtcbiAgICogICAgICAgICB0aGlzLmluamVjdFN0eWxlU2hlZXQoYG5hdi5zaWRlYmFyIHsgd2lkdGg6ICR7c2lkZWJhcldpZHRofXB4OyB9YCwgJ3NjcmVlbicpO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqXG4gICAqICAgICBNeUNvbXBvbmVudC5yZWdpc3RlcigpO1xuICAgKiAgICAgYGBgXG4gICAqL1xuICBpbmplY3RTdHlsZVNoZWV0KGNvbnRlbnQsIG1lZGlhID0gJ3NjcmVlbicpIHtcbiAgICBsZXQgc3R5bGVJRCAgICAgICA9IGBJRFNUWUxFJHtCYXNlVXRpbHMuU0hBMjU2KGAke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fToke21lZGlhfWApfWA7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHN0eWxlRWxlbWVudCAgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKTtcblxuICAgIGlmIChzdHlsZUVsZW1lbnQpXG4gICAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuXG4gICAgc3R5bGVFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICBpZiAobWVkaWEpXG4gICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdtZWRpYScsIG1lZGlhKTtcblxuICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50cyhub2RlLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gICAgaWYgKCFvcHRpb25zLnNjb3BlKVxuICAgICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2NvcGU6IHRoaXMuJCQgfTtcblxuICAgIHJldHVybiBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXRDaGlsZHJlbkFzRnJhZ21lbnQobm9FbXB0eVJlc3VsdCkge1xuICAgIGxldCBoYXNDb250ZW50ICAgID0gZmFsc2U7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHRlbXBsYXRlICAgICAgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIHJldHVybiAobm9FbXB0eVJlc3VsdCkgPyB1bmRlZmluZWQgOiB0ZW1wbGF0ZTtcblxuICAgIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgbm9kZSA9IHRoaXMuY2hpbGROb2Rlc1swXTtcbiAgICAgIGlmICghKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIEJhc2VVdGlscy5pc05PRShub2RlLm5vZGVWYWx1ZSkpKVxuICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKG5vRW1wdHlSZXN1bHQgJiYgIWhhc0NvbnRlbnQpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEdldCB0aGUgcGFyZW50IE5vZGUgb2YgdGhpcyBlbGVtZW50LlxuICAgKlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBVbmxpa2UgW05vZGUucGFyZW50Tm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSksIHRoaXNcbiAgICogICAgIHdpbGwgYWxzbyBzZWFyY2ggYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcy5cbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiAqKlNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIG9ubHkgd29ya3MgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzISoqXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgaXMgYWNjb21wbGlzaGVkIHZpYSBsZXZlcmFnaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE7IGZvclxuICAgKiAgICAgYHRoaXNgIGNvbXBvbmVudC4gV2hlbiBhIGBudWxsYCBwYXJlbnQgaXMgZW5jb3VudGVyZWQsIGBnZXRQYXJlbnROb2RlYCB3aWxsIGxvb2sgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IEBzZWUgQ29uc3RhbnRzLk1ZVEhJWF9TSEFET1dfUEFSRU5UO1xuICAgKiAgICAgb24gYHRoaXNgLiBJZiBmb3VuZCwgdGhlIHJlc3VsdCBpcyBjb25zaWRlcmVkIHRoZSBbcGFyZW50IE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpIG9mIGB0aGlzYCBjb21wb25lbnQuXG4gICAqICAgLSB8XG4gICAqICAgICA6ZXllOiBUaGlzIGlzIGp1c3QgYSB3cmFwcGVyIGZvciBAc2VlIFV0aWxzLmdldFBhcmVudE5vZGU7LlxuICAgKlxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgTm9kZTsgVGhlIHBhcmVudCBub2RlLCBpZiB0aGVyZSBpcyBhbnksIG9yIGBudWxsYCBvdGhlcndpc2UuXG4gICAqL1xuICBnZXRQYXJlbnROb2RlKCkge1xuICAgIHJldHVybiBVdGlscy5nZXRQYXJlbnROb2RlKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBUaGlzIGlzIGEgcmVwbGFjZW1lbnQgZm9yIFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KVxuICAgKiAgIHdpdGggb25lIG5vdGFibGUgZGlmZmVyZW5jZTogSXQgcnVucyBNeXRoaXggVUkgZnJhbWV3b3JrIHNwZWNpZmljIGNvZGUgYWZ0ZXIgYSBzaGFkb3cgaXMgYXR0YWNoZWQuXG4gICAqXG4gICAqICAgQ3VycmVudGx5LCB0aGUgbWV0aG9kIGNvbXBsZXRlcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XG4gICAqICAgMS4gQ2FsbCBgc3VwZXIuYXR0YWNoU2hhZG93KG9wdGlvbnMpYCB0byBhY3R1YWxseSBhdHRhY2ggYSBTaGFkb3cgRE9NXG4gICAqICAgMi4gQXNzaWduIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsgdG8gdGhlIHJlc3VsdGluZyBgc2hhZG93YCwgdXNpbmcgdGhlIGtleSBgQ29uc3RhbnRzLk1ZVEhJWF9TSEFET1dfUEFSRU5UYCwgYW5kIHZhbHVlIG9mIGB0aGlzYC4gQHNvdXJjZVJlZiBfc2hhZG93TWV0YWRhdGFBc3NpZ25tZW50OyBUaGlzIGFsbG93cyBAc2VlIGdldFBhcmVudE5vZGU7IHRvIGxhdGVyIGZpbmQgdGhlIHBhcmVudCBvZiB0aGUgc2hhZG93LlxuICAgKiAgIDMuIGByZXR1cm4gc2hhZG93YFxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBkYXRhVHlwZXM6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBbb3B0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I29wdGlvbnMpIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdylcbiAgICogbm90ZXM6XG4gICAqICAgLSBUaGlzIGlzIGp1c3QgYSB3cmFwcGVyIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdykgdGhhdCBleGVjdXRlc1xuICAgKiAgICAgY3VzdG9tIGZyYW1ld29yayBmdW5jdGlvbmFsaXR5IGFmdGVyIHRoZSBgc3VwZXJgIGNhbGwuXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBTaGFkb3dSb290OyBUaGUgU2hhZG93Um9vdCBpbnN0YW5jZSBjcmVhdGVkIGJ5IFtFbGVtZW50LmF0dGFjaFNoYWRvd10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93KS5cbiAgICovXG4gIGF0dGFjaFNoYWRvdyhvcHRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZW52aXJvbm1lbnQgc3VwcG9ydFxuICAgIGlmICh0eXBlb2Ygc3VwZXIuYXR0YWNoU2hhZG93ICE9PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhvcHRpb25zKTtcbiAgICBVdGlscy5tZXRhZGF0YShzaGFkb3csIE1ZVEhJWF9TSEFET1dfUEFSRU5ULCB0aGlzKTsgLy8gQHJlZjpfc2hhZG93TWV0YWRhdGFBc3NpZ25tZW50XG5cbiAgICByZXR1cm4gc2hhZG93O1xuICB9XG5cbiAgLyoqXG4gICAqIHBhcmVudDogTXl0aGl4VUlDb21wb25lbnRcbiAgICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gICAqIGRlc2M6IHxcbiAgICogICBBIHN0dWIgZm9yIGRldmVsb3BlcnMgdG8gY29udHJvbCB0aGUgU2hhZG93IERPTSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiAgIEJ5IGRlZmF1bHQsIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IGNhbGwgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5hdHRhY2hTaGFkb3c7IGluIGBcIm9wZW5cImAgYG1vZGVgLlxuICAgKlxuICAgKiAgIERldmVsb3BlcnMgY2FuIG92ZXJsb2FkIHRoaXMgdG8gZG8gbm90aGluZyAoaGF2ZSBubyBTaGFkb3cgRE9NIGZvciBhIHNwZWNpZmljIGNvbXBvbmVudCBmb3IgZXhhbXBsZSksXG4gICAqICAgb3IgdG8gZG8gc29tZXRoaW5nIGVsc2UsIHN1Y2ggYXMgc3BlY2lmeSB0aGV5IHdvdWxkIGxpa2UgdGhlaXIgY29tcG9uZW50IHRvIGJlIGluIGBcImNsb3NlZFwiYCBgbW9kZWAuXG4gICAqXG4gICAqICAgVGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZCBpcyBhc3NpZ25lZCB0byBgdGhpcy5zaGFkb3dgIGluc2lkZSB0aGUgYGNvbnN0cnVjdG9yYCBvZiB0aGUgY29tcG9uZW50LlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBkYXRhVHlwZXM6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBbb3B0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I29wdGlvbnMpIGZvciBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdylcbiAgICogbm90ZXM6XG4gICAqICAgLSBBbGwgdGhpcyBkb2VzIGlzIGNhbGwgYHRoaXMuYXR0YWNoU2hhZG93YC4gSXRzIHB1cnBvc2UgaXMgZm9yIHRoZSBkZXZlbG9wZXIgdG8gY29udHJvbFxuICAgKiAgICAgd2hhdCBoYXBwZW5zIHdpdGggdGhlIGNvbXBvbmVudCdzIFNoYWRvdyBET00uXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBTaGFkb3dSb290OyBUaGUgU2hhZG93Um9vdCBpbnN0YW5jZSBjcmVhdGVkIGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQuYXR0YWNoU2hhZG93Oy5cbiAgICovXG4gIGNyZWF0ZVNoYWRvd0RPTShvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBtZXJnZUNoaWxkcmVuKHRhcmdldCwgLi4ub3RoZXJzKSB7XG4gICAgcmV0dXJuIEVsZW1lbnRzLm1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUobmFtZU9ySUQpIHtcbiAgICBpZiAobmFtZU9ySUQgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgcmV0dXJuIG5hbWVPcklEO1xuXG4gICAgaWYgKCF0aGlzLm93bmVyRG9jdW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAobmFtZU9ySUQpXG4gICAgICByZXR1cm4gRWxlbWVudHMucXVlcnlUZW1wbGF0ZSh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsIG5hbWVPcklEKTtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mb3JdJyk7XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIEFycmF5LmZyb20oZWxlbWVudHMpKSB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNOT0Uoc2VsZWN0b3IpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKCF0aGlzLm1hdGNoZXMoc2VsZWN0b3IpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdGhpcy5zaGFkb3cuYXBwZW5kQ2hpbGQoZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb2Nlc3NlZFRlbXBsYXRlKF90ZW1wbGF0ZSkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoX3RlbXBsYXRlKSB8fCB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzRWxlbWVudHMoKHRlbXBsYXRlLmNvbnRlbnQpID8gdGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkgOiB0ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkpO1xuICB9XG5cbiAgZ2V0UmF3VGVtcGxhdGUoX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZShfdGVtcGxhdGUpIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG8odGFyZ2V0LCBfdGVtcGxhdGUpIHtcbiAgICBpZiAoIXRhcmdldClcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBwcm9jZXNzZWRUZW1wbGF0ZSA9IHRoaXMuZ2V0UHJvY2Vzc2VkVGVtcGxhdGUoX3RlbXBsYXRlKTtcbiAgICBpZiAocHJvY2Vzc2VkVGVtcGxhdGUpIHtcbiAgICAgIC8vIGVuc3VyZURvY3VtZW50U3R5bGVzLmNhbGwodGhpcywgdGhpcy5vd25lckRvY3VtZW50LCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUsIHRlbXBsYXRlKTtcblxuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHByb2Nlc3NlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBhcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKF90ZW1wbGF0ZSkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZFRlbXBsYXRlVG8odGhpcy5zaGFkb3csIF90ZW1wbGF0ZSk7XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRFeHRlcm5hbFRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBCYXNlVXRpbHMubmV4dFRpY2soKCkgPT4ge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMudW5tb3VudGVkKCk7XG4gIH1cblxuICBhd2FpdEZldGNoU3JjT25WaXNpYmxlKG5ld1NyYykge1xuICAgIGlmICh0aGlzLnZpc2liaWxpdHlPYnNlcnZlcikge1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudW5vYnNlcnZlKHRoaXMpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICghbmV3U3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG9ic2VydmVyID0gdmlzaWJpbGl0eU9ic2VydmVyKCh7IHdhc1Zpc2libGUsIGRpc2Nvbm5lY3QgfSkgPT4ge1xuICAgICAgaWYgKCF3YXNWaXNpYmxlKVxuICAgICAgICB0aGlzLmZldGNoU3JjKHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1zcmMnKSk7XG5cbiAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIHsgZWxlbWVudHM6IFsgdGhpcyBdIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Zpc2liaWxpdHlPYnNlcnZlcic6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb2JzZXJ2ZXIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICBsZXQgW1xuICAgICAgYXR0cmlidXRlTmFtZSxcbiAgICAgIG9sZFZhbHVlLFxuICAgICAgbmV3VmFsdWUsXG4gICAgXSA9IGFyZ3M7XG5cbiAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAvLyBTZWN1cml0eTogZW5zdXJlIHRoaXMgaXMgYWN0dWFsbHkgYSBoYW5kbGVkIGF0dHJpYnV0ZSBjYWxsIVxuICAgICAgLy8gV2Ugd291bGRuJ3QganVzdCB3YW50IHRvIHN0YXJ0IHNldHRpbmcgYW55dGhpbmcgb24gdGhlIGluc3RhbmNlXG4gICAgICAvLyB2aWEgYXR0cmlidXRlcy4uLiB0aGF0IG1pZ2h0IGJlIGJhZCwgaS5lOiA8aW1nIHZhbHVlT2Y9XCJcIj5cblxuICAgICAgbGV0IHByb3BlcnR5TmFtZSAgICA9IEJhc2VVdGlscy50b0NhbWVsQ2FzZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIGxldCBtYWdpY05hbWUgICAgICAgPSBgYXR0ciQke3Byb3BlcnR5TmFtZX1gO1xuICAgICAgbGV0IHsgZGVzY3JpcHRvciB9ICA9IFV0aWxzLmdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIENhbGwgc2V0dGVyXG4gICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoLi4uYXJncyk7XG4gIH1cblxuICBhZG9wdGVkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFkb3B0ZWQoLi4uYXJncyk7XG4gIH1cblxuICBtb3VudGVkKCkge31cbiAgdW5tb3VudGVkKCkge31cbiAgYXR0cmlidXRlQ2hhbmdlZCgpIHt9XG4gIGFkb3B0ZWQoKSB7fVxuXG4gIGdldCAkJCgpIHtcbiAgICByZXR1cm4gVXRpbHMuY3JlYXRlU2NvcGUodGhpcyk7XG4gIH1cblxuICBzZWxlY3QoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICAgID0gKEJhc2VVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2soRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwge30pIF0uZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiBpdGVtKCk7XG5cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogbmV3IEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uKCcjZnJhZ21lbnQnLCB7fSwgcmVzdWx0KTtcbiAgfVxuXG4gICRidWlsZChjYWxsYmFjaykge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgWyB0aGlzLmJ1aWxkKGNhbGxiYWNrKSBdLmZsYXQoSW5maW5pdHkpKTtcbiAgfVxuXG4gIGlzQXR0cmlidXRlVHJ1dGh5KG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKG5hbWUpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBCYXNlVXRpbHMudG9DYW1lbENhc2UodGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgfVxuXG4gIG1ldGFkYXRhKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gVXRpbHMubWV0YWRhdGEodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cblxuICBkeW5hbWljUHJvcChuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlciwgX2NvbnRleHQpIHtcbiAgICByZXR1cm4gVXRpbHMuZHluYW1pY1Byb3AuY2FsbChfY29udGV4dCB8fCB0aGlzLCBuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlcik7XG4gIH1cblxuICBkeW5hbWljRGF0YShvYmopIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgbGV0IGRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ICAgPSBrZXlzW2ldO1xuICAgICAgbGV0IHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgVXRpbHMuZHluYW1pY1Byb3AuY2FsbChkYXRhLCBrZXksIHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzZWxmLXJlc2V0dGluZyB0aW1lb3V0LiBUaGlzIG1ldGhvZCBleHBlY3RzIGFuIGBpZGAgYXJndW1lbnQgKG9yIHdpbGwgZ2VuZXJhdGUgb25lIGZyb20gdGhlIHByb3ZpZGVkXG4gICAqICAgY2FsbGJhY2sgbWV0aG9kIGlmIG5vdCBwcm92aWRlZCkuIEl0IHVzZXMgdGhpcyBwcm92aWRlZCBgaWRgIHRvIGNyZWF0ZSBhIHRpbWVvdXQuIFRoaXMgdGltZW91dCBoYXMgYSBzcGVjaWFsIGZlYXR1cmVcbiAgICogICBob3dldmVyIHRoYXQgZGlmZmVyZW50aWF0ZXMgaXQgZnJvbSBhIG5vcm1hbCBgc2V0VGltZW91dGAgY2FsbDogaWYgeW91IGNhbGwgYHRoaXMuZGVib3VuY2VgIGFnYWluIHdpdGggdGhlXG4gICAqICAgc2FtZSBgaWRgICoqYmVmb3JlKiogdGhlIHRpbWUgcnVucyBvdXQsIHRoZW4gaXQgd2lsbCBhdXRvbWF0aWNhbGx5IHJlc2V0IHRoZSB0aW1lci4gSW4gc2hvcnQsIG9ubHkgdGhlIGxhc3QgY2FsbFxuICAgKiAgIHRvIGB0aGlzLmRlYm91bmNlYCAoZ2l2ZW4gdGhlIHNhbWUgaWQpIHdpbGwgdGFrZSBlZmZlY3QgKHVubGVzcyB0aGUgc3BlY2lmaWVkIHRpbWVvdXQgaXMgcmVhY2hlZCBiZXR3ZWVuIGNhbGxzKS5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgVGhpcyBtZXRob2QgcmV0dXJucyBhIHNwZWNpYWxpemVkIFByb21pc2UgaW5zdGFuY2UuIFRoZSBpbnN0YW5jZSBpcyBzcGVjaWFsaXplZCBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllc1xuICAgKiAgIGFyZSBpbmplY3RlZCBpbnRvIGl0OlxuICAgKiAgIDEuIGByZXNvbHZlKHJlc3VsdFZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVzb2x2ZXMgdGhlIHByb21pc2Ugd2l0aCB0aGUgZmlyc3QgcHJvdmlkZWQgYXJndW1lbnRcbiAgICogICAyLiBgcmVqZWN0KGVycm9yVmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZWplY3RzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gICAqICAgMy4gYHN0YXR1cygpYCAtIFdoZW4gY2FsbGVkLCB3aWxsIHJldHVybiB0aGUgZnVsZmlsbG1lbnQgc3RhdHVzIG9mIHRoZSBwcm9taXNlLCBhcyBhIGBzdHJpbmdgLCBvbmUgb2Y6IGBcInBlbmRpbmdcIiwgXCJmdWxmaWxsZWRcImAsIG9yIGBcInJlamVjdGVkXCJgXG4gICAqICAgNC4gYGlkPHN0cmluZz5gIC0gQSByYW5kb21seSBnZW5lcmF0ZWQgSUQgZm9yIHRoaXMgcHJvbWlzZVxuICAgKlxuICAgKiAgIFNlZSBAc2VlIEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlO1xuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiB0aGUgdGltZW91dCBoYXMgYmVlbiBtZXQuXG4gICAqICAgLSBuYW1lOiB0aW1lTVNcbiAgICogICAgIGRhdGFUeXBlczogbnVtYmVyXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGVmYXVsdDogMFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2AuXG4gICAqICAgLSBuYW1lOiBpZFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZWZhdWx0OiBcIm51bGxcIlxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgaWRlbnRpZmllciBmb3IgdGhpcyBkZWJvdW5jZSB0aW1lci4gSWYgbm90IHByb3ZpZGVkLCB0aGVuIG9uZVxuICAgKiAgICAgICB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgeW91IGJhc2VkIG9uIHRoZSBwcm92aWRlZCBjYWxsYmFjay5cbiAgICogbm90ZXM6XG4gICAqICAgLSBUaG91Z2ggbm90IHJlcXVpcmVkLCBpdCBpcyBmYXN0ZXIgYW5kIGxlc3MgcHJvYmxlbWF0aWMgdG8gcHJvdmlkZSB5b3VyIG93biBgaWRgIGFyZ3VtZW50XG4gICAqL1xuICBkZWJvdW5jZShjYWxsYmFjaywgdGltZU1TLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IEJhc2VVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCB0aW1lTVMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsZWFyRGVib3VuY2UoaWQpIHtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAoIXByb21pc2UpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG5cbiAgICB0aGlzLmRlbGF5VGltZXJzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBjbGFzc2VzKC4uLl9hcmdzKSB7XG4gICAgbGV0IGFyZ3MgPSBfYXJncy5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKVxuICAgICAgICByZXR1cm4gaXRlbS50cmltKCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYyhzcmNVUkwpIHtcbiAgICBpZiAoIXNyY1VSTClcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBsb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwodGhpcywgc3JjVVJMKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmNVUkx9IChyZXNvbHZlZCB0bzogJHtlcnJvci51cmx9KWAsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElkZW50aWZpZXIodGFyZ2V0KSB7XG4gIGlmICghdGFyZ2V0KVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAodHlwZW9mIHRhcmdldC5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0YXJnZXQuZ2V0SWRlbnRpZmllci5jYWxsKHRhcmdldCk7XG5cbiAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IEJhc2VVdGlscy50b0NhbWVsQ2FzZSh0YXJnZXQubG9jYWxOYW1lKTtcblxuICByZXR1cm4gJ3VuZGVmaW5lZCc7XG59XG5cbi8vIGZ1bmN0aW9uIGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spIHtcbi8vICAgaWYgKCFydWxlLnNlbGVjdG9yVGV4dClcbi8vICAgICByZXR1cm4gcnVsZS5jc3NUZXh0O1xuXG4vLyAgIGxldCBfYm9keSAgID0gcnVsZS5jc3NUZXh0LnN1YnN0cmluZyhydWxlLnNlbGVjdG9yVGV4dC5sZW5ndGgpLnRyaW0oKTtcbi8vICAgbGV0IHJlc3VsdCAgPSAoY2FsbGJhY2socnVsZS5zZWxlY3RvclRleHQsIF9ib2R5KSB8fCBbXSkuZmlsdGVyKEJvb2xlYW4pO1xuLy8gICBpZiAoIXJlc3VsdClcbi8vICAgICByZXR1cm4gJyc7XG5cbi8vICAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGNzc1J1bGVzVG9Tb3VyY2UoY3NzUnVsZXMsIGNhbGxiYWNrKSB7XG4vLyAgIHJldHVybiBBcnJheS5mcm9tKGNzc1J1bGVzIHx8IFtdKS5tYXAoKHJ1bGUpID0+IHtcbi8vICAgICBsZXQgcnVsZVN0ciA9IGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spO1xuLy8gICAgIHJldHVybiBgJHtjc3NSdWxlc1RvU291cmNlKHJ1bGUuY3NzUnVsZXMsIGNhbGxiYWNrKX0ke3J1bGVTdHJ9YDtcbi8vICAgfSkuam9pbignXFxuXFxuJyk7XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGVsZW1lbnROYW1lLCBzdHlsZUVsZW1lbnQpIHtcbi8vICAgY29uc3QgaGFuZGxlSG9zdCA9IChtLCB0eXBlLCBfY29udGVudCkgPT4ge1xuLy8gICAgIGxldCBjb250ZW50ID0gKCFfY29udGVudCkgPyBfY29udGVudCA6IF9jb250ZW50LnJlcGxhY2UoL15cXCgvLCAnJykucmVwbGFjZSgvXFwpJC8sICcnKTtcblxuLy8gICAgIGlmICh0eXBlID09PSAnOmhvc3QnKSB7XG4vLyAgICAgICBpZiAoIWNvbnRlbnQpXG4vLyAgICAgICAgIHJldHVybiBlbGVtZW50TmFtZTtcblxuLy8gICAgICAgLy8gRWxlbWVudCBzZWxlY3Rvcj9cbi8vICAgICAgIGlmICgoL15bYS16QS1aX10vKS50ZXN0KGNvbnRlbnQpKVxuLy8gICAgICAgICByZXR1cm4gYCR7Y29udGVudH1bZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbi8vICAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbi8vICAgICB9XG4vLyAgIH07XG5cbi8vICAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4vLyAgICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuLy8gICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbi8vICAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3Rvcjtcbi8vICAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4vLyAgICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4vLyAgICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuLy8gICAgICAgICB0YWdzLnB1c2gobSk7XG4vLyAgICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4vLyAgICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbi8vICAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuLy8gICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4vLyAgICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuLy8gICAgICAgICByZXR1cm47XG5cbi8vICAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuLy8gICAgIH0sXG4vLyAgICk7XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVEb2N1bWVudFN0eWxlcyhvd25lckRvY3VtZW50LCBjb21wb25lbnROYW1lLCB0ZW1wbGF0ZSkge1xuLy8gICBsZXQgb2JqSUQgICAgICAgICAgICAgPSBCYXNlVXRpbHMuZ2V0T2JqZWN0SUQodGVtcGxhdGUpO1xuLy8gICBsZXQgdGVtcGxhdGVJRCAgICAgICAgPSBCYXNlVXRpbHMuU0hBMjU2KG9iaklEKTtcbi8vICAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuLy8gICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4vLyAgIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuLy8gICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbi8vICAgICAgIGNvbnRpbnVlO1xuXG4vLyAgICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbi8vICAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbi8vICAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbi8vICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4vLyAgICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4vLyAgICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuLy8gICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbi8vICAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4vLyAgICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuLy8gICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbi8vICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVVUkwocm9vdExvY2F0aW9uLCBfdXJsaXNoKSB7XG4gIGxldCB1cmxpc2ggPSBfdXJsaXNoO1xuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgVVJMKVxuICAgIHVybGlzaCA9IHVybGlzaC50b1N0cmluZygpO1xuXG4gIGlmICghdXJsaXNoKVxuICAgIHVybGlzaCA9ICcnO1xuXG4gIGlmICghQmFzZVV0aWxzLmlzVHlwZSh1cmxpc2gsICc6OlN0cmluZycpKVxuICAgIHJldHVybjtcblxuICBsZXQgdXJsID0gbmV3IFVSTCh1cmxpc2gsIG5ldyBVUkwocm9vdExvY2F0aW9uKSk7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBmaWxlTmFtZSAgPSAnJztcbiAgICBsZXQgcGF0aCAgICAgID0gJy8nO1xuXG4gICAgdXJsLnBhdGhuYW1lLnJlcGxhY2UoL14oLipcXC8pKFteL10rKSQvLCAobSwgZmlyc3QsIHNlY29uZCkgPT4ge1xuICAgICAgcGF0aCA9IGZpcnN0LnJlcGxhY2UoL1xcLyskLywgJy8nKTtcbiAgICAgIGlmIChwYXRoLmNoYXJBdChwYXRoLmxlbmd0aCAtIDEpICE9PSAnLycpXG4gICAgICAgIHBhdGggPSBgJHtwYXRofS9gO1xuXG4gICAgICBmaWxlTmFtZSA9IHNlY29uZDtcbiAgICAgIHJldHVybiBtO1xuICAgIH0pO1xuXG4gICAgbGV0IG5ld1NyYyA9IGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIuY2FsbCh0aGlzLCB7IHNyYzogdXJsaXNoLCB1cmwsIHBhdGgsIGZpbGVOYW1lIH0pO1xuICAgIGlmIChuZXdTcmMgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXJlcXVpcmVcIjogTm90IGxvYWRpbmcgXCIke3VybGlzaH1cIiBiZWNhdXNlIHRoZSBnbG9iYWwgXCJteXRoaXhVSS51cmxSZXNvbHZlclwiIHJlcXVlc3RlZCBJIG5vdCBkbyBzby5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmV3U3JjICYmIChuZXdTcmMudG9TdHJpbmcoKSAhPT0gdXJsLnRvU3RyaW5nKCkgJiYgbmV3U3JjLnRvU3RyaW5nKCkgIT09IHVybGlzaCkpXG4gICAgICB1cmwgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgcm9vdExvY2F0aW9uLCBuZXdTcmMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgICA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IElTX1NDUklQVCAgICAgICAgICAgPSAvXihzY3JpcHQpJC9pO1xuY29uc3QgUkVRVUlSRV9DQUNIRSAgICAgICA9IG5ldyBNYXAoKTtcbmNvbnN0IFJFU09MVkVfU1JDX0VMRU1FTlQgPSAvXnNjcmlwdHxsaW5rfHN0eWxlfG15dGhpeC1sYW5ndWFnZS1wYWNrfG15dGhpeC1yZXF1aXJlJC9pO1xuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZShvd25lckRvY3VtZW50LCBsb2NhdGlvbiwgX3VybCwgc291cmNlU3RyaW5nLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB1cmwgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgbG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgZ3Vlc3NlZEVsZW1lbnROYW1lLFxuICAgIGNoaWxkcmVuLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdGVtcGxhdGUsXG4gICAgdXJsLFxuICAgIGJhc2VVUkwsXG4gICAgZmlsZU5hbWUsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnByZVByb2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0ZW1wbGF0ZSA9IGNvbnRleHQudGVtcGxhdGUgPSBvcHRpb25zLnByZVByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICBsZXQgbm9kZUhhbmRsZXIgICA9IG9wdGlvbnMubm9kZUhhbmRsZXI7XG4gIGxldCB0ZW1wbGF0ZUNvdW50ID0gY2hpbGRyZW4ucmVkdWNlKChzdW0sIGVsZW1lbnQpID0+ICgoSVNfVEVNUExBVEUudGVzdChlbGVtZW50LnRhZ05hbWUpKSA/IChzdW0gKyAxKSA6IHN1bSksIDApO1xuXG4gIGNvbnRleHQudGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnQ7XG5cbiAgY29uc3QgcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYmFzZVVSTCkgPT4ge1xuICAgIC8vIFJlc29sdmUgXCJzcmNcIiBhdHRyaWJ1dGUsIHNpbmNlIHdlIGFyZVxuICAgIC8vIGdvaW5nIHRvIGJlIG1vdmluZyB0aGUgZWxlbWVudCBhcm91bmRcbiAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmIChzcmMpIHtcbiAgICAgIHNyYyA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH07XG5cbiAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICBpZiAob3B0aW9ucy5tYWdpYyAmJiBSRVNPTFZFX1NSQ19FTEVNRU5ULnRlc3QoY2hpbGQubG9jYWxOYW1lKSlcbiAgICAgIGNoaWxkID0gcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUoY2hpbGQsIGJhc2VVUkwpO1xuXG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgaWYgKHRlbXBsYXRlQ291bnQgPT09IDEgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpID09IG51bGwgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke3VybH06IDx0ZW1wbGF0ZT4gaXMgbWlzc2luZyBhIFwiZGF0YS1mb3JcIiBhdHRyaWJ1dGUsIGxpbmtpbmcgaXQgdG8gaXRzIG93bmVyIGNvbXBvbmVudC4gR3Vlc3NpbmcgXCIke2d1ZXNzZWRFbGVtZW50TmFtZX1cIi5gKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWZvcicsIGd1ZXNzZWRFbGVtZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1RlbXBsYXRlOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgfHwgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpKTtcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWZvcj1cIiR7ZWxlbWVudE5hbWV9XCIgaV0sW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIiBpXWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoSVNfU0NSSVBULnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHNjcmlwdD5cbiAgICAgIGxldCBjaGlsZENsb25lID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBjaGlsZC5nZXRBdHRyaWJ1dGVOYW1lcygpKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnc3JjJylcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBjaGlsZC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpO1xuICAgICAgfVxuXG4gICAgICBsZXQgc3JjID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgc3JjID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGJhc2VVUkwsIHNyYywgZmFsc2UpO1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG4gICAgICAgIGNoaWxkQ2xvbmUuaW5uZXJIVE1MID0gY2hpbGQudGV4dENvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZENsb25lLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHNjcmlwdElEID0gYElEJHtCYXNlVXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtzcmMgfHwgY2hpbGRDbG9uZS5pbm5lckhUTUx9YCl9YDtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHNjcmlwdElEKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHQjJHtzY3JpcHRJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkQ2xvbmUpO1xuICAgIH0gZWxzZSBpZiAoKC9eKGxpbmt8c3R5bGUpJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxsaW5rPiAmIDxzdHlsZT5cbiAgICAgIGxldCBpc1N0eWxlID0gKC9ec3R5bGUkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSk7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNTdHlsZSwgaXNMaW5rOiAhaXNTdHlsZSwgaXNIYW5kbGVkOiB0cnVlIH0pID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBpZCA9IGBJRCR7QmFzZVV0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxtZXRhPlxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc01ldGE6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KTtcblxuICAgICAgLy8gZG8gbm90aGluZyB3aXRoIHRoZXNlIHRhZ3NcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7IC8vIEV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgbGV0IGlzSGFuZGxlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICAgIGxldCBsYW5nUGFja0lEID0gYElEJHtCYXNlVXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZC5vdXRlckhUTUx9YCl9YDtcbiAgICAgICAgaWYgKCFjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGxhbmdQYWNrSUQpO1xuXG4gICAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcblxuICAgICAgICBpZiAobGFuZ3VhZ2VQcm92aWRlcikge1xuICAgICAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlci5xdWVyeVNlbGVjdG9yKGBteXRoaXgtbGFuZ3VhZ2UtcGFjayMke2xhbmdQYWNrSUR9YCkpXG4gICAgICAgICAgICBsYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZShjaGlsZCwgbGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKTtcblxuICAgICAgICAgIGlzSGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH0gLy8gZWxzZSBkbyBub3RoaW5nLi4uIGxldCBpdCBiZSBkdW1wZWQgaW50byB0aGUgZG9tIGxhdGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wb3N0UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucG9zdFByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUodXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgdXJsT3JOYW1lLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGNhY2hlS2V5O1xuXG4gIGlmICghKC9eKGZhbHNlfG5vLXN0b3JlfHJlbG9hZHxuby1jYWNoZSkkLykudGVzdCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGUnKSkpIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlUGFyYW1zJykgIT09ICd0cnVlJykge1xuICAgICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZWRSZXNwb25zZSA9IFJFUVVJUkVfQ0FDSEUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICBpZiAoY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UgJiYgY2FjaGVkUmVzcG9uc2UucmVzcG9uc2Uub2spXG4gICAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgICB9XG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGdsb2JhbFRoaXMuZmV0Y2godXJsLCBvcHRpb25zLmZldGNoT3B0aW9ucykudGhlbihcbiAgICBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgcmVzcG9uc2UudGV4dCA9IGFzeW5jICgpID0+IGJvZHk7XG4gICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiBmYWxzZSB9O1xuICAgIH0sXG4gICAgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmcm9tIE15dGhpeCBVSSBcInJlcXVpcmVcIjogJywgZXJyb3IpO1xuXG4gICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgc3JjLFxuICAgIHtcbiAgICAgIG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgbGV0IHNjb3BlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIHVybC5zZWFyY2hQYXJhbXMuZW50cmllcygpKVxuICAgIHNjb3BlRGF0YVtrZXldID0gQmFzZVV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSkge1xuICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMuY2FsbChcbiAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc2NvcGU6IFV0aWxzLmNyZWF0ZVNjb3BlKHNjb3BlRGF0YSwgb3B0aW9ucy5zY29wZSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2liaWxpdHlPYnNlcnZlcihjYWxsYmFjaywgX29wdGlvbnMpIHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVudHJpZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVudHJ5ICAgPSBlbnRyaWVzW2ldO1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbnRyeS50YXJnZXQ7XG4gICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gICAgICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMsIGVsZW1lbnRPYnNlcnZlcnMpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0geyB3YXNWaXNpYmxlOiBmYWxzZSwgcmF0aW9WaXNpYmxlOiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB9O1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzLnNldChvYnNlcnZlciwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IGRhdGEucmF0aW9WaXNpYmxlKVxuICAgICAgICBkYXRhLnJhdGlvVmlzaWJsZSA9IGVudHJ5LmludGVyc2VjdGlvblJhdGlvO1xuXG4gICAgICBkYXRhLnByZXZpb3VzVmlzaWJpbGl0eSA9IChkYXRhLnZpc2liaWxpdHkgPT09IHVuZGVmaW5lZCkgPyBkYXRhLnZpc2liaWxpdHkgOiBkYXRhLnZpc2liaWxpdHk7XG4gICAgICBkYXRhLnZpc2liaWxpdHkgPSAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjApO1xuXG4gICAgICBjYWxsYmFjayh7IC4uLmRhdGEsIGVudHJ5LCBlbGVtZW50LCBpbmRleDogaSwgZGlzY29ubmVjdDogKCkgPT4gb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpIH0pO1xuXG4gICAgICBpZiAoZGF0YS52aXNpYmlsaXR5ICYmICFkYXRhLndhc1Zpc2libGUpXG4gICAgICAgIGRhdGEud2FzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBvcHRpb25zID0ge1xuICAgIHJvb3Q6ICAgICAgIG51bGwsXG4gICAgdGhyZXNob2xkOiAgMC4wLFxuICAgIC4uLihfb3B0aW9ucyB8fCB7fSksXG4gIH07XG5cbiAgbGV0IG9ic2VydmVyICA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpbnRlcnNlY3Rpb25DYWxsYmFjaywgb3B0aW9ucyk7XG4gIGxldCBlbGVtZW50cyAgPSAoX29wdGlvbnMgfHwge30pLmVsZW1lbnRzIHx8IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50c1tpXSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5jb25zdCBOT19PQlNFUlZFUiA9IE9iamVjdC5mcmVlemUoe1xuICB3YXNWaXNpYmxlOiAgICAgICAgIGZhbHNlLFxuICByYXRpb1Zpc2libGU6ICAgICAgIDAuMCxcbiAgdmlzaWJpbGl0eTogICAgICAgICBmYWxzZSxcbiAgcHJldmlvdXNWaXNpYmlsaXR5OiBmYWxzZSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eU1ldGEoZWxlbWVudCwgb2JzZXJ2ZXIpIHtcbiAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyk7XG4gIGlmICghZWxlbWVudE9ic2VydmVycylcbiAgICByZXR1cm4gTk9fT0JTRVJWRVI7XG5cbiAgcmV0dXJuIGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKSB8fCBOT19PQlNFUlZFUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExhcmdlc3REb2N1bWVudFRhYkluZGV4KG93bmVyRG9jdW1lbnQpIHtcbiAgbGV0IGxhcmdlc3QgPSAtSW5maW5pdHk7XG5cbiAgQXJyYXkuZnJvbSgob3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XScpKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgbGV0IHRhYkluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JyksIDEwKTtcbiAgICBpZiAoIWlzRmluaXRlKHRhYkluZGV4KSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0YWJJbmRleCA+IGxhcmdlc3QpXG4gICAgICBsYXJnZXN0ID0gdGFiSW5kZXg7XG4gIH0pO1xuXG4gIHJldHVybiAobGFyZ2VzdCA8IDApID8gMCA6IGxhcmdlc3Q7XG59XG4iLCIvKipcbiAqIHR5cGU6IE5hbWVzcGFjZVxuICogbmFtZTogQ29uc3RhbnRzXG4gKiBncm91cE5hbWU6IENvbnN0YW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztgXG4gKlxuICogICBNaXNjIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyB1c2VkIGFzIGEgQHNlZSBVdGlscy5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgYnkgQHNlZSBVdGlscy5nbG9iYWxTdG9yZU5hbWVWYWx1ZVBhaXJIZWxwZXI7XG4gKiAgICAgICB0byBzdG9yZSBrZXkvdmFsdWUgcGFpcnMgZm9yIGEgc2luZ2xlIHZhbHVlLlxuICpcbiAqICAgICAgIE15dGhpeCBVSSBoYXMgZ2xvYmFsIHN0b3JlIGFuZCBmZXRjaCBoZWxwZXJzIGZvciBzZXR0aW5nIGFuZCBmZXRjaGluZyBkeW5hbWljIHByb3BlcnRpZXMuIFRoZXNlXG4gKiAgICAgICBtZXRob2RzIG9ubHkgYWNjZXB0IGEgc2luZ2xlIHZhbHVlIGJ5IGRlc2lnbi4uLiBidXQgc29tZXRpbWVzIGl0IGlzIGRlc2lyZWQgdGhhdCBhIHZhbHVlIGJlIHNldFxuICogICAgICAgd2l0aCBhIHNwZWNpZmljIGtleSBpbnN0ZWFkLiBUaGlzIGBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUmAgcHJvcGVydHkgYXNzaXN0cyB3aXRoIHRoaXMgcHJvY2VzcyxcbiAqICAgICAgIGFsbG93aW5nIGdsb2JhbCBoZWxwZXJzIHRvIHN0aWxsIGZ1bmN0aW9uIHdpdGggYSBzaW5nbGUgdmFsdWUgc2V0LCB3aGlsZSBpbiBzb21lIGNhc2VzIHN0aWxsIHBhc3NpbmdcbiAqICAgICAgIGEga2V5IHRocm91Z2ggdG8gdGhlIHNldHRlci4gQHNvdXJjZVJlZiBfbXl0aGl4TmFtZVZhbHVlUGFpckhlbHBlclVzYWdlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDp3YXJuaW5nOiBVc2UgYXQgeW91ciBvd24gcmlzay4gVGhpcyBpcyBNeXRoaXggVUkgaW50ZXJuYWwgY29kZSB0aGF0IG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuICogICAtIG5hbWU6IE1ZVEhJWF9TSEFET1dfUEFSRU5UXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IHRvXG4gKiAgICAgICBzdG9yZSB0aGUgcGFyZW50IG5vZGUgb2YgYSBTaGFkb3cgRE9NLCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSB0cmF2ZXJzZWQgYnkgQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIFV0aWxzLmdldFBhcmVudE5vZGU7LlxuICogICAtIG5hbWU6IE1ZVEhJWF9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBmb3IgdHlwZSBjaGVja2luZyBieSBgaW5zdGFuY2VvZmAgY2hlY2tzIHRvIGRldGVybWluZSBpZiBhbiBpbnN0YW5jZVxuICogICAgICAgaXMgYSBzcGVjaWZpYyB0eXBlIChldmVuIGFjcm9zcyBqYXZhc2NyaXB0IGNvbnRleHRzIGFuZCBsaWJyYXJ5IHZlcnNpb25zKS4gQHNvdXJjZVJlZiBfbXl0aGl4VHlwZUV4YW1wbGU7XG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5pc1R5cGU7LlxuICogICAtIG5hbWU6IERZTkFNSUNfUFJPUEVSVFlfVFlQRVxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBVc2VkIGZvciBydW50aW1lIHR5cGUgcmVmbGVjdGlvbiBhZ2FpbnN0IEBzZWUgVXRpbHMuRHluYW1pY1Byb3BlcnR5Oy5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIFV0aWxzLkR5bmFtaWNQcm9wZXJ0eTsuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5pc1R5cGU7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgVXRpbHMuTVlUSElYX1RZUEU7LlxuICovXG5cbi8vIEJhc2VcbmV4cG9ydCBjb25zdCBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUiAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvbmFtZS12YWx1ZS1wYWlyLWhlbHBlcicpOyAvLyBAcmVmOlV0aWxzLk1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSXG5leHBvcnQgY29uc3QgTVlUSElYX1NIQURPV19QQVJFTlQgICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL3NoYWRvdy1wYXJlbnQnKTsgLy8gQHJlZjpVdGlscy5NWVRISVhfU0hBRE9XX1BBUkVOVFxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9UWVBFICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9lbGVtZW50LWRlZmluaXRpb24nKTsgLy8gQHJlZjpVdGlscy5NWVRISVhfVFlQRVxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaW50ZXJzZWN0aW9uLW9ic2VydmVycycpOyAvLyBAcmVmOkNvbXBvbmVudHMuTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbmV4cG9ydCBjb25zdCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2RvY3VtZW50LWluaXRpYWxpemVkJyk7IC8vIEByZWY6Q29tcG9uZW50cy5NWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRURcblxuLy8gRHluYW1pY1Byb3BlcnR5XG5leHBvcnQgY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9WQUxVRSAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvdmFsdWUnKTtcbmV4cG9ydCBjb25zdCBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9pcy1zZXR0aW5nJyk7XG5leHBvcnQgY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9TRVQgICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvc2V0Jyk7XG5cbi8vIFR5cGVzXG5leHBvcnQgY29uc3QgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvdHlwZXMvTXl0aGl4VUk6OkVsZW1lbnREZWZpbml0aW9uJyk7XG5leHBvcnQgY29uc3QgUVVFUllfRU5HSU5FX1RZUEUgICAgICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvdHlwZXMvTXl0aGl4VUk6OlF1ZXJ5RW5naW5lJyk7XG5leHBvcnQgY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9UWVBFICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvdHlwZXMvTXl0aGl4VUk6OkR5bmFtaWNQcm9wZXJ0eScpOyAvLyBAcmVmOlV0aWxzLkRZTkFNSUNfUFJPUEVSVFlfVFlQRVxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9VSV9DT01QT05FTlRfVFlQRSAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpNeXRoaXhVSUNvbXBvbmVudCcpO1xuXG4vLyBFbGVtZW50c1xuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy91bmZpbmlzaGVkJyk7XG5cblxuIiwiaW1wb3J0IHtcbiAgRFlOQU1JQ19QUk9QRVJUWV9UWVBFLFxuICBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFLFxuICBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcsXG4gIERZTkFNSUNfUFJPUEVSVFlfU0VULFxuICBNWVRISVhfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIGBEeW5hbWljUHJvcGVydHlgIGlzIGEgc2ltcGxlIHZhbHVlIHN0b3JhZ2UgY2xhc3Mgd3JhcHBlZCBpbiBhIFByb3h5LlxuICpcbiAqICAgIEl0IHdpbGwgYWxsb3cgdGhlIHVzZXIgdG8gc3RvcmUgYW55IGRlc2lyZWQgdmFsdWUuIFRoZSBjYXRjaCBob3dldmVyIGlzIHRoYXRcbiAqICAgIGFueSB2YWx1ZSBzdG9yZWQgY2FuIG9ubHkgYmUgc2V0IHRocm91Z2ggaXRzIHNwZWNpYWwgYHNldGAgbWV0aG9kLlxuICpcbiAqICAgIFRoaXMgd2lsbCBhbGxvdyBhbnkgbGlzdGVuZXJzIHRvIHJlY2VpdmUgdGhlIGAndXBkYXRlJ2AgZXZlbnQgd2hlbiBhIHZhbHVlIGlzIHNldC5cbiAqXG4gKiAgICBTaW5jZSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZXMgYXJlIGFsc28gYWx3YXlzIHdyYXBwZWQgaW4gYSBQcm94eSwgdGhlIHVzZXIgbWF5XG4gKiAgICBcImRpcmVjdGx5XCIgYWNjZXNzIGF0dHJpYnV0ZXMgb2YgdGhlIHN0b3JlZCB2YWx1ZS4gRm9yIGV4YW1wbGUsIGlmIGEgYER5bmFtaWNQcm9wZXJ0eWBcbiAqICAgIGlzIHN0b3JpbmcgYW4gQXJyYXkgaW5zdGFuY2UsIHRoZW4gb25lIHdvdWxkIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBgLmxlbmd0aGAgcHJvcGVydHlcbiAqICAgIFwiZGlyZWN0bHlcIiwgaS5lLiBgZHluYW1pY1Byb3AubGVuZ3RoYC5cbiAqXG4gKiAgICBgRHluYW1pY1Byb3BlcnR5YCBoYXMgYSBzcGVjaWFsIGBzZXRgIG1ldGhvZCwgd2hvc2UgbmFtZSBpcyBhIGBzeW1ib2xgLCB0byBhdm9pZCBjb25mbGljdGluZ1xuICogICAgbmFtZXNwYWNlcyB3aXRoIHRoZSB1bmRlcmx5aW5nIGRhdGF0eXBlIChhbmQgdGhlIHdyYXBwaW5nIFByb3h5KS5cbiAqICAgIFRvIHNldCBhIHZhbHVlIG9uIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIG9uZSBtdXN0IGRvIHNvIGFzIGZvbGxvd3M6IGBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0obXlOZXdWYWx1ZSlgLlxuICogICAgVGhpcyB3aWxsIHVwZGF0ZSB0aGUgaW50ZXJuYWwgdmFsdWUsIGFuZCBpZiB0aGUgc2V0IHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgc3RvcmVkIHZhbHVlLCB0aGUgYCd1cGRhdGUnYCBldmVudCB3aWxsIGJlIGRpc3BhdGNoZWQgdG9cbiAqICAgIGFueSBsaXN0ZW5lcnMuXG4gKlxuICogICAgQXMgYER5bmFtaWNQcm9wZXJ0eWAgaXMgYW4gW0V2ZW50VGFyZ2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRXZlbnRUYXJnZXQvRXZlbnRUYXJnZXQpLCBvbmUgY2FuIGF0dGFjaFxuICogICAgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBgJ3VwZGF0ZSdgIGV2ZW50IHRvIGxpc3RlbiBmb3IgdXBkYXRlcyB0byB0aGUgdW5kZXJseWluZyB2YWx1ZS4gVGhlIGAndXBkYXRlJ2AgZXZlbnQgaXMgdGhlIG9ubHkgZXZlbnQgdGhhdCBpc1xuICogICAgZXZlciB0cmlnZ2VyZWQgYnkgdGhpcyBjbGFzcy4gVGhlIHJlY2VpdmVkIGBldmVudGAgaW5zdGFuY2UgaW4gZXZlbnQgY2FsbGJhY2tzIHdpbGwgaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKiAgICAxLiBgdXBkYXRlRXZlbnQub3JpZ2luYXRvciA9IHRoaXM7YCAtIGBvcmlnaW5hdG9yYCBpcyB0aGUgaW5zdGFuY2Ugb2YgdGhlIGBEeW5hbWljUHJvcGVydHlgIHdoZXJlIHRoZSBldmVudCBvcmlnaW5hdGVkIGZyb20uXG4gKiAgICAyLiBgdXBkYXRlRXZlbnQub2xkVmFsdWUgPSBjdXJyZW50VmFsdWU7YCAtIGBvbGRWYWx1ZWAgY29udGFpbnMgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgRHluYW1pY1Byb3BlcnR5YCBiZWZvcmUgc2V0LlxuICogICAgMy4gYHVwZGF0ZUV2ZW50LnZhbHVlID0gbmV3VmFsdWU7YCAtIGB2YWx1ZWAgY29udGFpbnMgdGhlIGN1cnJlbnQgdmFsdWUgYmVpbmcgc2V0IG9uIHRoZSBgRHluYW1pY1Byb3BlcnR5YC5cbiAqXG4gKiAgICBUbyByZXRyaWV2ZSB0aGUgdW5kZXJseWluZyByYXcgdmFsdWUgb2YgYSBgRHluYW1pY1Byb3BlcnR5YCwgb25lIG1heSBjYWxsIGB2YWx1ZU9mKClgOiBgbGV0IHJhd1ZhbHVlID0gZHluYW1pY1Byb3BlcnR5LnZhbHVlT2YoKTtgXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlcyB3aWxsIGludGVybmFsbHkgdHJhY2sgd2hlbiBhIGBzZXRgIG9wZXJhdGlvbiBpcyB1bmRlcndheSwgdG8gcHJldmVudFxuICogICAgIGN5Y2xpYyBzZXRzIGFuZCBtYXhpbXVtIGNhbGwgc3RhY2sgZXJyb3JzLiBZb3UgYXJlIGFsbG93ZWQgdG8gc2V0IHRoZSB2YWx1ZSByZWN1cnNpdmVseSwgaG93ZXZlciBgdXBkYXRlYCBldmVudHNcbiAqICAgICB3aWxsIG9ubHkgYmUgZGlzcGF0Y2hlZCBmb3IgdGhlIGZpcnN0IGBzZXRgIGNhbGwuIEFueSBgc2V0YCBvcGVyYXRpb24gdGhhdCBoYXBwZW5zIHdoaWxlIGFub3RoZXIgYHNldGAgb3BlcmF0aW9uIGlzXG4gKiAgICAgdW5kZXJ3YXkgd2lsbCAqKm5vdCoqIGRpc3BhdGNoIGFueSBgJ3VwZGF0ZSdgIGV2ZW50cy5cbiAqICAgLSB8XG4gKiAgICAgYCd1cGRhdGUnYCBldmVudHMgd2lsbCBiZSBkaXNwYXRjaGVkIGltbWVkaWF0ZWx5ICphZnRlciogdGhlIGludGVybmFsIHVuZGVybHlpbmcgc3RvcmVkIHZhbHVlIGlzIHVwZGF0ZWQuIFRob3VnaCBpdCBpc1xuICogICAgIHBvc3NpYmxlIHRvIGBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25gIGluIGFuIGV2ZW50IGNhbGxiYWNrLCBhdHRlbXB0aW5nIHRvIFwicHJldmVudERlZmF1bHRcIiBvciBcInN0b3BQcm9wYWdhdGlvblwiIHdpbGwgZG8gbm90aGluZy5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoJ2luaXRpYWwgdmFsdWUnKTtcbiAqXG4gKiAgICAgZHluYW1pY1Byb3BlcnR5LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsIChldmVudCkgPT4ge1xuICogICAgICAgY29uc29sZS5sb2coYER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJyR7ZXZlbnQudmFsdWV9JywgUHJldmlvdXMgVmFsdWUgPSAnJHtldmVudC5vbGRWYWx1ZX0nYCk7XG4gKiAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCBWYWx1ZSA9ICcke2R5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCl9J2ApO1xuICogICAgIH0pO1xuICpcbiAqICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oJ25ldyB2YWx1ZScpO1xuICpcbiAqICAgICAvLyBvdXRwdXQgLT4gRHluYW1pYyBQcm9wZXJ0eSBVcGRhdGVkISBOZXcgdmFsdWUgPSAnbmV3IHZhbHVlJywgT2xkIFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gKiAgICAgLy8gb3V0cHV0IC0+IEN1cnJlbnQgVmFsdWUgPSAnaW5pdGlhbCB2YWx1ZSdcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIER5bmFtaWNQcm9wZXJ0eSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7IC8vIEByZWY6X215dGhpeFR5cGVFeGFtcGxlXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBEWU5BTUlDX1BST1BFUlRZX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogUHJvcGVydHlcbiAgICogbmFtZTogc2V0XG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIHN0YXRpYzogdHJ1ZVxuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzcGVjaWFsIGBzeW1ib2xgIHVzZWQgdG8gYWNjZXNzIHRoZSBgc2V0YCBtZXRob2Qgb2YgYSBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgLSB8XG4gICAqICAgICBgYGBqYXZhc2NyaXB0XG4gICAqICAgICBpbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICAgKlxuICAgKiAgICAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoJ2luaXRpYWwgdmFsdWUnKTtcbiAgICpcbiAgICogICAgIGR5bmFtaWNQcm9wZXJ0eS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAgICogICAgICAgY29uc29sZS5sb2coYER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJyR7ZXZlbnQudmFsdWV9JywgUHJldmlvdXMgVmFsdWUgPSAnJHtldmVudC5vbGRWYWx1ZX0nYCk7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IFZhbHVlID0gJyR7ZHluYW1pY1Byb3BlcnR5LnZhbHVlT2YoKX0nYCk7XG4gICAqICAgICB9KTtcbiAgICpcbiAgICogICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XSgnbmV3IHZhbHVlJyk7XG4gICAqXG4gICAqICAgICAvLyBvdXRwdXQgLT4gRHluYW1pYyBQcm9wZXJ0eSBVcGRhdGVkISBOZXcgdmFsdWUgPSAnbmV3IHZhbHVlJywgT2xkIFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gICAqICAgICAvLyBvdXRwdXQgLT4gQ3VycmVudCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICAgKiAgICAgYGBgXG4gICAqL1xuICBzdGF0aWMgc2V0ID0gRFlOQU1JQ19QUk9QRVJUWV9TRVQ7IC8vIEByZWY6RHluYW1pY1Byb3BlcnR5LnNldFxuXG4gIC8qKlxuICAgKiB0eXBlOiBGdW5jdGlvblxuICAgKiBuYW1lOiBjb25zdHJ1Y3RvclxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IFV0aWxzXG4gICAqIGRlc2M6IHxcbiAgICogICBDb25zdHJ1Y3QgYSBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogaW5pdGlhbFZhbHVlXG4gICAqICAgICBkYXRhVHlwZTogYW55XG4gICAqICAgICBkZXNjOlxuICAgKiAgICAgICBUaGUgaW5pdGlhbCB2YWx1ZSB0byBzdG9yZS5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhpcyB3aWxsIHJldHVybiBhIFByb3h5IGluc3RhbmNlIHdyYXBwaW5nIHRoZSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBZb3UgY2FuIG5vdCBzZXQgYSBgRHluYW1pY1Byb3BlcnR5YCB0byBhbm90aGVyIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLlxuICAgKiAgICAgSWYgYGluaXRpYWxWYWx1ZWAgaXMgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgaXQgd2lsbCB1c2UgdGhlIHN0b3JlZCB2YWx1ZVxuICAgKiAgICAgb2YgdGhhdCBpbnN0YW5jZSBpbnN0ZWFkIChieSBjYWxsaW5nIEBzZWUgRHluYW1pY1Byb3BlcnR5LnZhbHVlT2Y7KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIERZTkFNSUNfUFJPUEVSVFlfVFlQRSxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgKEJhc2VVdGlscy5pc1R5cGUoaW5pdGlhbFZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSA/IGluaXRpYWxWYWx1ZS52YWx1ZU9mKCkgOiBpbml0aWFsVmFsdWUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR106IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0KSA6IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSkgOiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJylcbiAgICAgIHJldHVybiArdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICBlbHNlIGlmIChoaW50ID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBEeW5hbWljUHJvcGVydHlcbiAgICogZGVzYzogfFxuICAgKiAgIEZldGNoIHRoZSB1bmRlcmx5aW5nIHJhdyB2YWx1ZSBzdG9yZWQgYnkgdGhpcyBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzOiBhbnk7IFRoZSB1bmRlcmxpbmcgcmF3IHZhbHVlLlxuICAgKi9cbiAgdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0eXBlOiBGdW5jdGlvblxuICAgKiBuYW1lOiBcIltEeW5hbWljUHJvcGVydHkuc2V0XVwiXG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIGRlc2M6IHxcbiAgICogICBTZXQgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIHN0b3JlZCBieSB0aGlzIGBEeW5hbWljUHJvcGVydHlgLlxuICAgKlxuICAgKiAgIElmIHRoZSBjdXJyZW50IHN0b3JlZCB2YWx1ZSBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIHRoZSBwcm92aWRlZCBgdmFsdWVgLFxuICAgKiAgIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuLlxuICAgKlxuICAgKiAgIE90aGVyd2lzZSwgd2hlbiB0aGUgdW5kZXJseWluZyB2YWx1ZSBpcyB1cGRhdGVkLCBgdGhpcy5kaXNwYXRjaEV2ZW50YCB3aWxsXG4gICAqICAgYmUgY2FsbGVkIHRvIGRpc3BhdGNoIGFuIGAndXBkYXRlJ2AgZXZlbnQgdG8gbm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCB0aGVcbiAgICogICB1bmRlcmx5aW5nIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5ld1ZhbHVlXG4gICAqICAgICBkYXRhVHlwZTogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBuZXcgdmFsdWUgdG8gc2V0LiBJZiB0aGlzIGlzIGl0c2VsZiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCB0aGVuXG4gICAqICAgICAgIGl0IHdpbGwgYmUgdW53cmFwcGVkIHRvIGl0cyB1bmRlcmx5aW5nIHZhbHVlLCBhbmQgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHZhbHVlIGluc3RlYWQuXG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBBbiBvYmplY3QgdG8gcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIG9wZXJhdGlvbi4gVGhlIHNoYXBlIG9mIHRoaXMgb2JqZWN0IGlzIGB7IGRpc3BhdGNoVXBkYXRlRXZlbnQ6IGJvb2xlYW4gfWAuXG4gICAqICAgICAgIElmIGBvcHRpb25zLmRpc3BhdGNoVXBkYXRlRXZlbnRgIGVxdWFscyBgZmFsc2VgLCB0aGVuIG5vIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvIGxpc3RlbmVycy5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogSWYgdGhlIHVuZGVybHlpbmcgc3RvcmVkIHZhbHVlIGlzIGV4YWN0bHkgdGhlIHNhbWUgYXMgdGhlIHZhbHVlIHByb3ZpZGVkLFxuICAgKiAgICAgdGhlbiBub3RoaW5nIHdpbGwgaGFwcGVuLCBhbmQgdGhlIG1ldGhvZCB3aWxsIHNpbXBseSByZXR1cm4uXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhlIHVuZGVybHlpbmcgdmFsdWUgaXMgdXBkYXRlZCAqYmVmb3JlKiBkaXNwYXRjaGluZyBldmVudHMuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogYER5bmFtaWNQcm9wZXJ0eWAgcHJvdGVjdHMgYWdhaW5zdCBjeWNsaWMgZXZlbnQgY2FsbGJhY2tzLiBJZiBhblxuICAgKiAgICAgZXZlbnQgY2FsbGJhY2sgYWdhaW4gc2V0cyB0aGUgdW5kZXJseWluZyBgRHluYW1pY1Byb3BlcnR5YCB2YWx1ZSwgdGhlblxuICAgKiAgICAgdGhlIHZhbHVlIHdpbGwgYmUgc2V0LCBidXQgbm8gZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkICh0byBwcmV2ZW50IGV2ZW50IGxvb3BzKS5cbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBZb3UgY2FuIG5vdCBzZXQgYSBgRHluYW1pY1Byb3BlcnR5YCB0byBhbm90aGVyIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLlxuICAgKiAgICAgSWYgdGhpcyBtZXRob2QgcmVjZWl2ZXMgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgaXQgd2lsbCB1c2UgdGhlIHN0b3JlZCB2YWx1ZVxuICAgKiAgICAgb2YgdGhhdCBpbnN0YW5jZSBpbnN0ZWFkIChieSBjYWxsaW5nIEBzZWUgRHluYW1pY1Byb3BlcnR5LnZhbHVlT2Y7KS5cbiAgICovXG4gIFtEWU5BTUlDX1BST1BFUlRZX1NFVF0oX25ld1ZhbHVlLCBfb3B0aW9ucykge1xuICAgIGxldCBuZXdWYWx1ZSA9IF9uZXdWYWx1ZTtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShuZXdWYWx1ZSwgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgIG5ld1ZhbHVlID0gbmV3VmFsdWUudmFsdWVPZigpO1xuXG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9IG5ld1ZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICB0cnkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gdHJ1ZTtcblxuICAgICAgbGV0IG9sZFZhbHVlID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPSBuZXdWYWx1ZTtcblxuICAgICAgaWYgKG9wdGlvbnMuZGlzcGF0Y2hVcGRhdGVFdmVudCA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHVwZGF0ZUV2ZW50ID0gbmV3IEV2ZW50KCd1cGRhdGUnKTtcblxuICAgICAgdXBkYXRlRXZlbnQub3JpZ2luYXRvciA9IHRoaXM7XG4gICAgICB1cGRhdGVFdmVudC5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgICAgdXBkYXRlRXZlbnQudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHVwZGF0ZUV2ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUsXG4gIE1ZVEhJWF9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBEeW5hbWljUHJvcGVydHkgfSBmcm9tICcuL2R5bmFtaWMtcHJvcGVydHkuanMnO1xuXG4vKipcbiAqICB0eXBlOiBOYW1lc3BhY2VcbiAqICBuYW1lOiBFbGVtZW50c1xuICogIGdyb3VwTmFtZTogRWxlbWVudHNcbiAqICBkZXNjOiB8XG4gKiAgICBgaW1wb3J0IHsgRWxlbWVudHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgICBVdGlsaXR5IGFuZCBlbGVtZW50IGJ1aWxkaW5nIGZ1bmN0aW9ucyBmb3IgdGhlIERPTS5cbiAqL1xuXG5jb25zdCBJU19QUk9QX05BTUUgICAgPSAvXnByb3BcXCQvO1xuY29uc3QgSVNfVEFSR0VUX1BST1AgID0gL15wcm90b3R5cGV8Y29uc3RydWN0b3IkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSxcbiAgICAgIH0sXG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB0YWdOYW1lID0gdGhpcy50YWdOYW1lO1xuICAgIGlmICh0YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy52YWx1ZTtcblxuICAgIGxldCBhdHRycyA9ICgoYXR0cmlidXRlcykgPT4ge1xuICAgICAgbGV0IHBhcnRzID0gW107XG5cbiAgICAgIGZvciAobGV0IFsgYXR0cmlidXRlTmFtZSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLnRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgICAgcGFydHMucHVzaChuYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcnRzLnB1c2goYCR7bmFtZX09XCIke2VuY29kZVZhbHVlKHZhbHVlKX1cImApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xuICAgIH0pKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgY2hpbGRyZW4gPSAoKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9PSBmYWxzZSAmJiAhT2JqZWN0LmlzKGNoaWxkLCBOYU4pKSlcbiAgICAgICAgLm1hcCgoY2hpbGQpID0+ICgnJyArIGNoaWxkKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH0pKHRoaXMuY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGA8JHt0YWdOYW1lfSR7KGF0dHJzKSA/IGAgJHthdHRyc31gIDogJyd9PiR7KGlzVm9pZFRhZyh0YWdOYW1lKSkgPyAnJyA6IGAke2NoaWxkcmVufTwvJHt0YWdOYW1lfT5gfWA7XG4gIH1cblxuICB0b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBidWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI2ZyYWdtZW50JylcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykpO1xuXG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0cmlidXRlcy52YWx1ZSB8fCAnJyksIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICBpZiAobmFtZXNwYWNlVVJJKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy50YWdOYW1lKTtcblxuICAgIGNvbnN0IGV2ZW50TmFtZXMgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICBVdGlscy5jcmVhdGVTY29wZShlbGVtZW50LCB0ZW1wbGF0ZU9wdGlvbnMuc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLFxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgaGFuZGxlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgZWxzZVxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGNoaWxkICAgICAgICAgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IGNoaWxkRWxlbWVudCAgPSBjaGlsZC5idWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWxlbWVudCkpXG4gICAgICAgICAgY2hpbGRFbGVtZW50LmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGNoaWxkKSA9PiBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKFxuICAgICAgdGhpcyxcbiAgICAgIGVsZW1lbnQsXG4gICAgICB7XG4gICAgICAgIC4uLnRlbXBsYXRlT3B0aW9ucyxcbiAgICAgICAgcHJvY2Vzc0V2ZW50Q2FsbGJhY2tzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBJU19IVE1MX1NBRkVfQ0hBUkFDVEVSID0gL15bXFxzYS16QS1aMC05Xy1dJC87XG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLy4vZywgKG0pID0+IHtcbiAgICByZXR1cm4gKElTX0hUTUxfU0FGRV9DSEFSQUNURVIudGVzdChtKSkgPyBtIDogYCYjJHttLmNoYXJDb2RlQXQoMCl9O2A7XG4gIH0pO1xufVxuXG5jb25zdCBJU19WT0lEX1RBRyA9IC9eYXJlYXxiYXNlfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNWb2lkVGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1ZPSURfVEFHLnRlc3QodGFnTmFtZS5zcGxpdCgnOicpLnNsaWNlKC0xKVswXSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWROb2RlVHlwZShpdGVtKSB7XG4gIGlmICghaXRlbSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBOb2RlKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGl0ZW1bTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeVRlbXBsYXRlKG93bmVyRG9jdW1lbnQsIG5hbWVPcklEKSB7XG4gIGlmIChuYW1lT3JJRCBpbnN0YW5jZW9mIE5vZGUpXG4gICAgcmV0dXJuIG5hbWVPcklEO1xuXG4gIGlmICghb3duZXJEb2N1bWVudClcbiAgICByZXR1cm47XG5cbiAgbGV0IHJlc3VsdCA9IG93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZU9ySUQpO1xuICBpZiAoIXJlc3VsdClcbiAgICByZXN1bHQgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtuYW1lT3JJRH1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7bmFtZU9ySUR9XCIgaV1gKTtcblxuICBpZiAoIXJlc3VsdClcbiAgICByZXN1bHQgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobmFtZU9ySUQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVNZXJnZUZyYWdtZW50KG93bmVyRG9jdW1lbnQsIG5vZGUpIHtcbiAgbGV0IGZyYWdtZW50ICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICBsZXQgc2VsZWN0b3JzID0gKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWZyb20nKSB8fCAnJykuc3BsaXQoJywnKS5tYXAoKChwYXJ0KSA9PiBwYXJ0LnRyaW0oKSkpLmZpbHRlcihCb29sZWFuKTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBzZWxlY3RvcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBzZWxlY3RvciAgPSBzZWxlY3RvcnNbaV07XG4gICAgbGV0IGVsZW1lbnQgICA9IHF1ZXJ5VGVtcGxhdGUob3duZXJEb2N1bWVudCwgc2VsZWN0b3IpO1xuICAgIGlmIChlbGVtZW50KVxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyBlbGVtZW50LmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpIDogZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG5jb25zdCBJU19URU1QTEFURV9NRVJHRV9FTEVNRU5UID0gL15teXRoaXgtbWVyZ2UkL2k7XG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0VsZW1lbnRzKF9ub2RlLCBfb3B0aW9ucykge1xuICBsZXQgbm9kZSA9IF9ub2RlO1xuICBpZiAoIW5vZGUpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHNjb3BlICAgICAgICAgPSBvcHRpb25zLnNjb3BlO1xuICBpZiAoIXNjb3BlKSB7XG4gICAgc2NvcGUgPSBVdGlscy5jcmVhdGVTY29wZShub2RlKTtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZSB9O1xuICB9XG5cbiAgbGV0IGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yID0gKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSA9PT0gdHJ1ZSkgPyB1bmRlZmluZWQgOiBvcHRpb25zLmRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yO1xuICBsZXQgY2hpbGRyZW4gICAgICAgICAgICAgICAgICAgICAgPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG5cbiAgaWYgKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSAhPT0gdHJ1ZSAmJiAhZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IpIHtcbiAgICBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgfTtcbiAgfVxuXG4gIGxldCBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSBmYWxzZTtcbiAgaWYgKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yICYmIFV0aWxzLnNwZWNpYWxDbG9zZXN0KG5vZGUsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKSlcbiAgICBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5oZWxwZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5oZWxwZXIuY2FsbCh0aGlzLCB7IHNjb3BlLCBvcHRpb25zLCBub2RlLCBjaGlsZHJlbiwgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciB9KTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSlcbiAgICAgIG5vZGUgPSByZXN1bHQ7XG4gICAgZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgbGV0IG93bmVyRG9jdW1lbnQgPSBvcHRpb25zLm93bmVyRG9jdW1lbnQgfHwgc2NvcGUub3duZXJEb2N1bWVudCB8fCBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSB7XG4gICAgaWYgKCFpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUobm9kZSwgb3B0aW9ucyk7XG4gICAgICBpZiAoKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiByZXN1bHQuc29tZShpc1ZhbGlkTm9kZVR5cGUpKSB8fCBpc1ZhbGlkTm9kZVR5cGUocmVzdWx0KSkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICAgIGxldCBmcmFnbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IGl0ZW0uYnVpbGQob3duZXJEb2N1bWVudCwgeyBzY29wZSB9KTtcbiAgICAgICAgICAgIGlmICghZWxlbWVudHMpXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbGVtZW50cykpXG4gICAgICAgICAgICAgIGVsZW1lbnRzLmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGVsZW1lbnQpID0+IGZyYWdtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudHMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGVuZFRvKGZyYWdtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoJycgKyBpdGVtKSk7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgIG5vZGUubm9kZVZhbHVlID0gIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICBpZiAoSVNfVEVNUExBVEVfTUVSR0VfRUxFTUVOVC50ZXN0KG5vZGUudGFnTmFtZSkpXG4gICAgICByZXR1cm4gY29tcGlsZU1lcmdlRnJhZ21lbnQob3duZXJEb2N1bWVudCwgbm9kZSk7XG5cbiAgICBsZXQgZXZlbnROYW1lcyAgICAgID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQobm9kZSk7XG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBhdHRyaWJ1dGVOYW1lICAgICAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnByb2Nlc3NFdmVudENhbGxiYWNrcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICAgIFV0aWxzLmNyZWF0ZVNjb3BlKG5vZGUsIHNjb3BlKSwgLy8gdGhpc1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksXG4gICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBub2RlLmdldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVOb2RlKVxuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0Tm9kZVZhbHVlKGF0dHJpYnV0ZU5vZGUsIHsgLi4ub3B0aW9ucywgZGlzYWxsb3dIVE1MOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2Nlc3NDaGlsZHJlbiA9PT0gZmFsc2UpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgZm9yIChsZXQgY2hpbGROb2RlIG9mIGNoaWxkcmVuKSB7XG4gICAgbGV0IHJlc3VsdCA9IHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgb3B0aW9ucyk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE5vZGUgJiYgcmVzdWx0ICE9PSBjaGlsZE5vZGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5vZGUucmVwbGFjZUNoaWxkKHJlc3VsdCwgY2hpbGROb2RlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gTk9PUFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2hpbGQocGFyZW50Tm9kZSwgY2hpbGROb2RlKSB7XG4gIGlmICghcGFyZW50Tm9kZSB8fCAhY2hpbGROb2RlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKHBhcmVudE5vZGUuY2hpbGROb2RlcykpIHtcbiAgICBpZiAoY2hpbGQgPT09IGNoaWxkTm9kZSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIHNjb3BlKSB7XG4gIGlmICghdGFnTmFtZSB8fCAhQmFzZVV0aWxzLmlzVHlwZSh0YWdOYW1lLCAnOjpTdHJpbmcnKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGFuIEVsZW1lbnREZWZpbml0aW9uIHdpdGhvdXQgYSBcInRhZ05hbWVcIi4nKTtcblxuICBjb25zdCBmaW5hbGl6ZXIgPSAoLi4uX2NoaWxkcmVuKSA9PiB7XG4gICAgY29uc3Qgd3JhbmdsZUNoaWxkcmVuID0gKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW4uZmxhdChJbmZpbml0eSkubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHZhbHVlW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgICAgcmV0dXJuIHZhbHVlKCk7XG5cbiAgICAgICAgaWYgKHZhbHVlW01ZVEhJWF9UWVBFXSA9PT0gRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUpXG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgIGlmICh2YWx1ZVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKVxuICAgICAgICAgIHJldHVybiB3cmFuZ2xlQ2hpbGRyZW4odmFsdWUuZ2V0VW5kZXJseWluZ0FycmF5KCkpO1xuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICAgICAgcmV0dXJuIG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKHZhbHVlKTtcblxuICAgICAgICBpZiAoIUJhc2VVdGlscy5pc1R5cGUodmFsdWUsICc6OlN0cmluZycsIER5bmFtaWNQcm9wZXJ0eSkpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlOiAoJycgKyB2YWx1ZSkgfSk7XG4gICAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfTtcblxuICAgIGxldCBjaGlsZHJlbiA9IHdyYW5nbGVDaGlsZHJlbihfY2hpbGRyZW4gfHwgW10pO1xuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24odGFnTmFtZSwgc2NvcGUsIGNoaWxkcmVuKTtcbiAgfTtcblxuICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KGZpbmFsaXplciwge1xuICAgIGdldDogKHRhcmdldCwgYXR0cmlidXRlTmFtZSkgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKCFzY29wZSkge1xuICAgICAgICBsZXQgc2NvcGVkUHJveHkgPSBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBkZWZhdWx0QXR0cmlidXRlcyB8fCB7fSkpO1xuICAgICAgICByZXR1cm4gc2NvcGVkUHJveHlbYXR0cmlidXRlTmFtZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJveHkoXG4gICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByb290UHJveHlbcHJvcE5hbWVdO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiByb290UHJveHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlVG9FbGVtZW50RGVmaW5pdGlvbihub2RlKSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSlcbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIG5vZGUubm9kZVZhbHVlKSB9KTtcblxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG4gIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2Ygbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbihub2RlLnRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKTtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgPSAvXih0ZW1wbGF0ZSkkL2k7XG5cbi8qKlxuICAgKiBwYXJlbnQ6IEVsZW1lbnRzXG4gICAqIGdyb3VwTmFtZTogRWxlbWVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEFsbW9zdCBsaWtlIGBPYmplY3QuYXNzaWduYCwgbWVyZ2UgYWxsIGNvbXBvbmVudCBjaGlsZHJlbiBpbnRvIGEgc2luZ2xlIG5vZGUgKHRoZSBgdGFyZ2V0YCkuXG4gICAqXG4gICAqICAgVGhpcyBpcyBcInRlbXBsYXRlIGludGVsbGlnZW50XCIsIG1lYW5pbmcgZm9yIGA8dGVtcGxhdGU+YCBlbGVtZW50cyBzcGVjaWZpY2FsbHksIGl0IHdpbGwgZXhlY3V0ZVxuICAgKiAgIGBjaGlsZHJlbiA9IHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXNgIHRvIGNsb25lIGFsbCB0aGUgY2hpbGQgbm9kZXMsIGFuZCBub3RcbiAgICogICBtb2RpZnkgdGhlIG9yaWdpbmFsIHRlbXBsYXRlLiBJdCBpcyBhbHNvIHRlbXBsYXRlIGludGVsbGlnZW50IGJ5IHRoZSBmYWN0IHRoYXQgaWYgdGhlIGB0YXJnZXRgIGlzXG4gICAqICAgYSB0ZW1wbGF0ZSwgaXQgd2lsbCBhZGQgdGhlIGNoaWxkcmVuIHRvIGBjb250ZW50YCBwcm9wZXJseS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogdGFyZ2V0XG4gICAqICAgICBkYXRhVHlwZXM6IE5vZGVcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIHRhcmdldCBOb2RlIHRvIG1lcmdlIGFsbCBjaGlsZHJlbiBpbnRvLiBJZiB0aGlzIE5vZGUgaXMgYSBgPHRlbXBsYXRlPmAgTm9kZSwgdGhlbiBpdCB3aWxsXG4gICAqICAgICAgIHBsYWNlIGFsbCB0aGUgbWVyZ2VkIGNoaWxkcmVuIGludG8gYHRlbXBsYXRlLmNvbnRlbnRgLlxuICAgKiBub3RlczpcbiAgICogICAtIEFueSB0ZW1wbGF0ZSBOb2RlIHdpbGwgYmUgY2xvbmVkLCBhbmQgc28gdGhlIG9yaWdpbmFsIHdpbGwgbm90IGJlIG1vZGlmaWVkLiBBbGwgb3RoZXIgbm9kZXMgYXJlICoqTk9UKipcbiAgICogICAgIGNsb25lZCBiZWZvcmUgdGhlIG1lcmdlLCBhbmQgc28gd2lsbCBiZSBzdHJpcHBlZCBvZiB0aGVpciBjaGlsZHJlbi5cbiAgICogICAtIE1ha2UgY2VydGFpbiB5b3UgZGVlcCBjbG9uZSBhbnkgZWxlbWVudCBmaXJzdCAoZXhjZXB0IHRlbXBsYXRlcykgaWYgeW91IGRvbid0IHdhbnQgdGhlIHByb3ZpZGVkIGVsZW1lbnRzXG4gICAqICAgICB0byBiZSBtb2RpZmllZC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIE5vZGU7IFRoZSBwcm92aWRlZCBgdGFyZ2V0YCwgd2l0aCBhbGwgY2hpbGRyZW4gbWVyZ2VkIChhZGRlZCkgaW50byBpdC5cbiAgICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycykge1xuICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICByZXR1cm4gdGFyZ2V0O1xuXG4gIGxldCB0YXJnZXRJc1RlbXBsYXRlID0gSVNfVEVNUExBVEUudGVzdCh0YXJnZXQudGFnTmFtZSk7XG4gIGZvciAobGV0IG90aGVyIG9mIG90aGVycykge1xuICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICBjb250aW51ZTtcblxuICAgIGxldCBjaGlsZE5vZGVzID0gKElTX1RFTVBMQVRFLnRlc3Qob3RoZXIudGFnTmFtZSkpID8gb3RoZXIuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2RlcyA6IG90aGVyLmNoaWxkTm9kZXM7XG4gICAgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbShjaGlsZE5vZGVzKSkge1xuICAgICAgbGV0IGNvbnRlbnQgPSAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgPyBjaGlsZC5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IGNoaWxkO1xuICAgICAgaWYgKHRhcmdldElzVGVtcGxhdGUpXG4gICAgICAgIHRhcmdldC5jb250ZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgSVNfU1ZHX0VMRU1FTlRfTkFNRSA9IC9eKGFsdGdseXBofGFsdGdseXBoZGVmfGFsdGdseXBoaXRlbXxhbmltYXRlfGFuaW1hdGVDb2xvcnxhbmltYXRlTW90aW9ufGFuaW1hdGVUcmFuc2Zvcm18YW5pbWF0aW9ufGNpcmNsZXxjbGlwUGF0aHxjb2xvclByb2ZpbGV8Y3Vyc29yfGRlZnN8ZGVzY3xkaXNjYXJkfGVsbGlwc2V8ZmVibGVuZHxmZWNvbG9ybWF0cml4fGZlY29tcG9uZW50dHJhbnNmZXJ8ZmVjb21wb3NpdGV8ZmVjb252b2x2ZW1hdHJpeHxmZWRpZmZ1c2VsaWdodGluZ3xmZWRpc3BsYWNlbWVudG1hcHxmZWRpc3RhbnRsaWdodHxmZWRyb3BzaGFkb3d8ZmVmbG9vZHxmZWZ1bmNhfGZlZnVuY2J8ZmVmdW5jZ3xmZWZ1bmNyfGZlZ2F1c3NpYW5ibHVyfGZlaW1hZ2V8ZmVtZXJnZXxmZW1lcmdlbm9kZXxmZW1vcnBob2xvZ3l8ZmVvZmZzZXR8ZmVwb2ludGxpZ2h0fGZlc3BlY3VsYXJsaWdodGluZ3xmZXNwb3RsaWdodHxmZXRpbGV8ZmV0dXJidWxlbmNlfGZpbHRlcnxmb250fGZvbnRGYWNlfGZvbnRGYWNlRm9ybWF0fGZvbnRGYWNlTmFtZXxmb250RmFjZVNyY3xmb250RmFjZVVyaXxmb3JlaWduT2JqZWN0fGd8Z2x5cGh8Z2x5cGhSZWZ8aGFuZGxlcnxoS2VybnxpbWFnZXxsaW5lfGxpbmVhcmdyYWRpZW50fGxpc3RlbmVyfG1hcmtlcnxtYXNrfG1ldGFkYXRhfG1pc3NpbmdHbHlwaHxtUGF0aHxwYXRofHBhdHRlcm58cG9seWdvbnxwb2x5bGluZXxwcmVmZXRjaHxyYWRpYWxncmFkaWVudHxyZWN0fHNldHxzb2xpZENvbG9yfHN0b3B8c3ZnfHN3aXRjaHxzeW1ib2x8dGJyZWFrfHRleHR8dGV4dHBhdGh8dHJlZnx0c3Bhbnx1bmtub3dufHVzZXx2aWV3fHZLZXJuKSQvaTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHRhZ05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5leHBvcnQgY29uc3QgRWxlbWVudEdlbmVyYXRvciA9IG5ldyBQcm94eShcbiAge1xuICAgIFRlcm0sXG4gICAgJFRFWFQ6IFRlcm0sXG4gIH0sXG4gIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHByb3BOYW1lKSkge1xuICAgICAgICAvLyBTVkcgZWxlbWVudHNcbiAgICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lLCB7IG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lKTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBOT09QXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9LFxuKTtcbiIsImltcG9ydCBkZWVwTWVyZ2UgZnJvbSAnZGVlcG1lcmdlJztcbmltcG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmltcG9ydCB7XG4gIER5bmFtaWNQcm9wZXJ0eSxcbn0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuaW1wb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIHJlcXVpcmUsXG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUGFjayBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snO1xuXG4gIGNyZWF0ZVNoYWRvd0RPTSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBzZXQgYXR0ciRkYXRhTXl0aGl4U3JjKFsgdmFsdWUgXSkge1xuICAgIC8vIE5PT1AuLi4gVHJhcCB0aGlzIGJlY2F1c2Ugd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxvYWQgYSBwYXJ0aWFsIGhlcmVcbiAgfVxuXG4gIG9uTXV0YXRpb25BZGRlZChtdXRhdGlvbikge1xuICAgIC8vIFdoZW4gYWRkZWQgdG8gdGhlIERPTSwgZW5zdXJlIHRoYXQgd2Ugd2VyZVxuICAgIC8vIGFkZGVkIHRvIHRoZSByb290IG9mIGEgbGFuZ3VhZ2UgcHJvdmlkZXIuLi5cbiAgICAvLyBJZiBub3QsIHRoZW4gbW92ZSBvdXJzZWx2ZXMgdG8gdGhlIHJvb3RcbiAgICAvLyBvZiB0aGUgbGFuZ3VhZ2UgcHJvdmlkZXIuXG4gICAgbGV0IHBhcmVudExhbmd1YWdlUHJvdmlkZXIgPSB0aGlzLmNsb3Nlc3QoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgIGlmIChwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICYmIHBhcmVudExhbmd1YWdlUHJvdmlkZXIgIT09IG11dGF0aW9uLnRhcmdldClcbiAgICAgIEJhc2VVdGlscy5uZXh0VGljaygoKSA9PiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZSh0aGlzLCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmZpcnN0Q2hpbGQpKTtcbiAgfVxufVxuXG5jb25zdCBJU19KU09OX0VOQ1RZUEUgICAgICAgICAgICAgICAgID0gL15hcHBsaWNhdGlvblxcL2pzb24vaTtcbmNvbnN0IExBTkdVQUdFX1BBQ0tfSU5TRVJUX0dSQUNFX1RJTUUgPSA1MDtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJztcblxuICBzZXQgYXR0ciRsYW5nKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKG5vZGUpIHtcbiAgICBpZiAobm9kZS5sb2NhbE5hbWUgPT09ICdteXRoaXgtbGFuZ3VhZ2UtcGFjaycpIHtcbiAgICAgIHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAvLyBSZWxvYWQgbGFuZ3VhZ2UgcGFja3MgYWZ0ZXIgYWRkaXRpb25zXG4gICAgICAgIHRoaXMubG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZSh0aGlzLmdldEN1cnJlbnRMb2NhbGUoKSk7XG4gICAgICB9LCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FLCAncmVsb2FkTGFuZ3VhZ2VQYWNrcycpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGVybXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgaTE4bihfcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgbGV0IHBhdGggICAgPSBgZ2xvYmFsLmkxOG4uJHtfcGF0aH1gO1xuICAgIGxldCByZXN1bHQgID0gVXRpbHMuZmV0Y2hQYXRoKHRoaXMudGVybXMsIHBhdGgpO1xuXG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgcmV0dXJuIFV0aWxzLmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbCh0aGlzLCBwYXRoLCAoZGVmYXVsdFZhbHVlID09IG51bGwpID8gJycgOiBkZWZhdWx0VmFsdWUpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkuY2hpbGROb2Rlc1sxXS5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAnZW4nO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBpZiAoIXRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykpXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJyk7XG4gIH1cblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0U291cmNlc0ZvckxhbmcobGFuZykge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdChgbXl0aGl4LWxhbmd1YWdlLXBhY2tbbGFuZ149XCIke2xhbmcucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApO1xuICB9XG5cbiAgbG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZShfbGFuZykge1xuICAgIGxldCBsYW5nICAgICAgICAgICAgPSBfbGFuZyB8fCAnZW4nO1xuICAgIGxldCBzb3VyY2VFbGVtZW50cyAgPSB0aGlzLmdldFNvdXJjZXNGb3JMYW5nKGxhbmcpLmZpbHRlcigoc291cmNlRWxlbWVudCkgPT4gQmFzZVV0aWxzLmlzTm90Tk9FKHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSkpO1xuICAgIGlmICghc291cmNlRWxlbWVudHMgfHwgIXNvdXJjZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBObyBcIm15dGhpeC1sYW5ndWFnZS1wYWNrXCIgdGFnIGZvdW5kIGZvciBzcGVjaWZpZWQgbGFuZ3VhZ2UgXCIke2xhbmd9XCJgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzKGxhbmcsIHNvdXJjZUVsZW1lbnRzKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRBbGxMYW5ndWFnZVBhY2tzKGxhbmcsIHNvdXJjZUVsZW1lbnRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBwcm9taXNlcyAgPSBzb3VyY2VFbGVtZW50cy5tYXAoKHNvdXJjZUVsZW1lbnQpID0+IHRoaXMubG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSk7XG4gICAgICBsZXQgYWxsVGVybXMgID0gKGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChwcm9taXNlcykpLm1hcCgocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9PSAnZnVsZmlsbGVkJylcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgbGV0IHRlcm1zICAgICAgICAgPSBkZWVwTWVyZ2UuYWxsKEFycmF5LmZyb20obmV3IFNldChhbGxUZXJtcykpKTtcbiAgICAgIGxldCBjb21waWxlZFRlcm1zID0gdGhpcy5jb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcyk7XG5cbiAgICAgIHRoaXMudGVybXMgPSBjb21waWxlZFRlcm1zO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBsYW5ndWFnZSBwYWNrcycsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkTGFuZ3VhZ2VQYWNrKGxhbmcsIHNvdXJjZUVsZW1lbnQpIHtcbiAgICBsZXQgc3JjID0gc291cmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmICghc3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7IHJlc3BvbnNlIH0gID0gYXdhaXQgcmVxdWlyZS5jYWxsKHRoaXMsIHNyYywgeyBvd25lckRvY3VtZW50OiB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQgfSk7XG4gICAgICBsZXQgdHlwZSAgICAgICAgICA9IHRoaXMuZ2V0QXR0cmlidXRlKCdlbmN0eXBlJykgfHwgJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgaWYgKElTX0pTT05fRU5DVFlQRS50ZXN0KHR5cGUpKSB7XG4gICAgICAgIC8vIEhhbmRsZSBKU09OXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgVHlwZUVycm9yKGBEb24ndCBrbm93IGhvdyB0byBsb2FkIGEgbGFuZ3VhZ2UgcGFjayBvZiB0eXBlIFwiJHt0eXBlfVwiYCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVMYW5ndWFnZVRlcm1zKGxhbmcsIHRlcm1zKSB7XG4gICAgY29uc3Qgd2Fsa1Rlcm1zID0gKHRlcm1zLCByYXdLZXlQYXRoKSA9PiB7XG4gICAgICBsZXQga2V5cyAgICAgID0gT2JqZWN0LmtleXModGVybXMpO1xuICAgICAgbGV0IHRlcm1zQ29weSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGtleSAgICAgICAgID0ga2V5c1tpXTtcbiAgICAgICAgbGV0IHZhbHVlICAgICAgID0gdGVybXNba2V5XTtcbiAgICAgICAgbGV0IG5ld0tleVBhdGggID0gcmF3S2V5UGF0aC5jb25jYXQoa2V5KTtcblxuICAgICAgICBpZiAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgdGVybXNDb3B5W2tleV0gPSB3YWxrVGVybXModmFsdWUsIG5ld0tleVBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eSA9IFV0aWxzLmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbCh0aGlzLCBuZXdLZXlQYXRoLmpvaW4oJy4nKSwgdmFsdWUpO1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gcHJvcGVydHk7XG4gICAgICAgICAgcHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXJtc0NvcHk7XG4gICAgfTtcblxuICAgIHJldHVybiB3YWxrVGVybXModGVybXMsIFsgJ2dsb2JhbCcsICdpMThuJyBdKTtcbiAgfVxufVxuXG5NeXRoaXhVSUxhbmd1YWdlUGFjay5yZWdpc3RlcigpO1xuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyLnJlZ2lzdGVyKCk7XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSUxhbmd1YWdlUGFjayA9IE15dGhpeFVJTGFuZ3VhZ2VQYWNrO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgPSBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXI7XG4iLCJpbXBvcnQgKiBhcyBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBURU1QTEFURV9URU1QTEFURSA9IC9eKFxcKnxcXHxcXCp8XFwqXFx8KSQvO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlSZXF1aXJlIGV4dGVuZHMgQ29tcG9uZW50Lk15dGhpeFVJQ29tcG9uZW50IHtcbiAgYXN5bmMgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7XG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVybCxcbiAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIGNhY2hlZCxcbiAgICAgIH0gPSBhd2FpdCBDb21wb25lbnQucmVxdWlyZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBvd25lckRvY3VtZW50OiAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICB9LFxuICAgICAgKTtcblxuICAgICAgaWYgKGNhY2hlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIENvbXBvbmVudC5pbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlLmNhbGwoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIG93bmVyRG9jdW1lbnQubG9jYXRpb24sXG4gICAgICAgIHVybCxcbiAgICAgICAgYm9keSxcbiAgICAgICAge1xuICAgICAgICAgIG1hZ2ljOiAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBub2RlSGFuZGxlcjogIChub2RlLCB7IGlzSGFuZGxlZCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzSGFuZGxlZCAmJiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSlcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByZVByb2Nlc3M6ICAgKHsgdGVtcGxhdGUsIGNoaWxkcmVuIH0pID0+IHtcbiAgICAgICAgICAgIGxldCBzdGFyVGVtcGxhdGUgPSBjaGlsZHJlbi5maW5kKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICBsZXQgZGF0YUZvciA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpICYmIFRFTVBMQVRFX1RFTVBMQVRFLnRlc3QoZGF0YUZvcikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIGxldCBkYXRhRm9yID0gc3RhclRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICBsZXQgc3RhckNsb25lID0gc3RhclRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhRm9yID09PSAnKnwnKVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5pbnNlcnRCZWZvcmUoc3RhckNsb25lLCBjaGlsZC5jb250ZW50LmNoaWxkTm9kZXNbMF0gfHwgbnVsbCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5hcHBlbmRDaGlsZChzdGFyQ2xvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJUZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtcmVxdWlyZVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICAvLyBOT09QXG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJUmVxdWlyZTtcblxuaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIE15dGhpeFVJUmVxdWlyZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuLypcbk1hbnkgdGhhbmtzIHRvIFNhZ2VlIENvbndheSBmb3IgdGhlIGZvbGxvd2luZyBDU1Mgc3Bpbm5lcnNcbmh0dHBzOi8vY29kZXBlbi5pby9zYWNvbndheS9wZW4vdllLWXlyeFxuKi9cblxuY29uc3QgU1RZTEVfU0hFRVQgPVxuYFxuOmhvc3Qge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IDFlbTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuOmhvc3QoLnNtYWxsKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAwLjc1KTtcbn1cbjpob3N0KC5tZWRpdW0pIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDEuNSk7XG59XG46aG9zdCgubGFyZ2UpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDMpO1xufVxuLnNwaW5uZXItaXRlbSxcbi5zcGlubmVyLWl0ZW06OmJlZm9yZSxcbi5zcGlubmVyLWl0ZW06OmFmdGVyIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDYwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjI1KTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4wNzUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBib3JkZXI6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24ge1xuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDEuMCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpICogMC4wNzUpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjcpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItYm90dG9tOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC44NzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjQpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC43NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkpIHJvdGF0ZSg0NWRlZyk7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMi41KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXI6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIHtcbiAgMCUsIDguMzMlLCAxNi42NiUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMjQuOTklLCAzMy4zMiUsIDQxLjY1JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMCUpO1xuICB9XG4gIDQ5Ljk4JSwgNTguMzElLCA2Ni42NCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDEwMCUpO1xuICB9XG4gIDc0Ljk3JSwgODMuMzAlLCA5MS42MyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIHtcbiAgMCUsIDguMzMlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMTYuNjYlLCAyNC45OSUsIDMzLjMyJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG4gIDQxLjY1JSwgNDkuOTglLCA1OC4zMSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAxMDAlKTtcbiAgfVxuICA2Ni42NCUsIDc0Ljk3JSwgODMuMzAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMge1xuICAwJSwgODMuMzAlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDApO1xuICB9XG4gIDguMzMlLCAxNi42NiUsIDI0Ljk5JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDApO1xuICB9XG4gIDMzLjMyJSwgNDEuNjUlLCA0OS45OCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAtMTAwJSk7XG4gIH1cbiAgNTguMzElLCA2Ni42NCUsIDc0Ljk3JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDQpO1xuICBtaW4td2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYm9yZGVyOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNzUlKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNzUlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMik7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA0MCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIHtcbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgyKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xuICB9XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMik7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiA0KTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI1KTtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgLyAtMik7XG59XG5gO1xuXG5jb25zdCBLSU5EUyA9IHtcbiAgJ2F1ZGlvJzogIDUsXG4gICdjaXJjbGUnOiAzLFxuICAnZG90JzogICAgMixcbiAgJ3BpcGUnOiAgIDUsXG4gICdwdXp6bGUnOiAzLFxuICAnd2F2ZSc6ICAgMyxcbn07XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSVNwaW5uZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1zcGlubmVyJztcblxuICBzZXQgYXR0ciRraW5kKFsgbmV3VmFsdWUgXSkge1xuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShuZXdWYWx1ZSk7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIHN1cGVyLm1vdW50ZWQoKTtcblxuICAgIGlmICghdGhpcy5kb2N1bWVudEluaXRpYWxpemVkKSB7XG4gICAgICAvLyBhcHBlbmQgdGVtcGxhdGVcbiAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgdGhpcy4kYnVpbGQoKHsgVEVNUExBVEUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gVEVNUExBVEVcbiAgICAgICAgICAuZGF0YU15dGhpeE5hbWUodGhpcy5zZW5zaXRpdmVUYWdOYW1lKVxuICAgICAgICAgIC5wcm9wJGlubmVySFRNTChgPHN0eWxlPiR7U1RZTEVfU0hFRVR9PC9zdHlsZT5gKTtcbiAgICAgIH0pLmFwcGVuZFRvKG93bmVyRG9jdW1lbnQuYm9keSk7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00odGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGxldCBraW5kID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2tpbmQnKTtcbiAgICBpZiAoIWtpbmQpIHtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgna2luZCcsIGtpbmQpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShraW5kKTtcbiAgfVxuXG4gIGhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UoX2tpbmQpIHtcbiAgICBsZXQga2luZCAgICAgICAgPSAoJycgKyBfa2luZCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChLSU5EUywga2luZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtc3Bpbm5lclwiIHVua25vd24gXCJraW5kXCIgcHJvdmlkZWQ6IFwiJHtraW5kfVwiLiBTdXBwb3J0ZWQgXCJraW5kXCIgYXR0cmlidXRlIHZhbHVlcyBhcmU6IFwicGlwZVwiLCBcImF1ZGlvXCIsIFwiY2lyY2xlXCIsIFwicHV6emxlXCIsIFwid2F2ZVwiLCBhbmQgXCJkb3RcIi5gKTtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VTcGlubmVyQ2hpbGRyZW4oS0lORFNba2luZF0pO1xuICB9XG5cbiAgYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICBsZXQgY2hpbGRyZW4gICAgICA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXItaXRlbScpO1xuXG4gICAgICBjaGlsZHJlbltpXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KGNoaWxkcmVuKTtcbiAgfVxuXG4gIGNoYW5nZVNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIHRoaXMuc2VsZWN0KCcuc3Bpbm5lci1pdGVtJykucmVtb3ZlKCk7XG4gICAgdGhpcy5idWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBzdHlsZSBhZ2Fpbiwgc29cbiAgICAvLyB0aGF0IGl0IGlzIHRoZSBsYXN0IGNoaWxkLCBhbmRcbiAgICAvLyBkb2Vzbid0IG1lc3Mgd2l0aCBcIm50aC1jaGlsZFwiXG4gICAgLy8gc2VsZWN0b3JzXG4gICAgdGhpcy5zZWxlY3QoJ3N0eWxlJykuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuICB9XG59XG5cbk15dGhpeFVJU3Bpbm5lci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlTcGlubmVyO1xuIiwiaW1wb3J0IHtcbiAgTVlUSElYX1RZUEUsXG4gIFFVRVJZX0VOR0lORV9UWVBFLFxuICBVTkZJTklTSEVEX0RFRklOSVRJT04sXG59IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuaW1wb3J0ICogYXMgQmFzZVV0aWxzIGZyb20gJy4vYmFzZS11dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmltcG9ydCB7XG4gIEVsZW1lbnREZWZpbml0aW9uLFxufSBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuY29uc3QgSVNfSU5URUdFUiA9IC9eXFxkKyQvO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gV2UgaGF2ZSBhbiBFbGVtZW50IG9yIGEgRG9jdW1lbnRcbiAgaWYgKHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1Nsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBpc05vdFNsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICFlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENsYXNzTmFtZXMoLi4uYXJncykge1xuICBsZXQgY2xhc3NOYW1lcyA9IFtdLmNvbmNhdCguLi5hcmdzKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAubWFwKChwYXJ0KSA9PiAoJycgKyBwYXJ0KS5zcGxpdCgvXFxzKy8pKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBjbGFzc05hbWVzO1xufVxuXG5leHBvcnQgY2xhc3MgUXVlcnlFbmdpbmUge1xuICBzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0oaW5zdGFuY2UpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChpbnN0YW5jZSAmJiBpbnN0YW5jZVtNWVRISVhfVFlQRV0gPT09IFFVRVJZX0VOR0lORV9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGlzRWxlbWVudCAgICA9IGlzRWxlbWVudDtcbiAgc3RhdGljIGlzU2xvdHRlZCAgICA9IGlzU2xvdHRlZDtcbiAgc3RhdGljIGlzTm90U2xvdHRlZCA9IGlzTm90U2xvdHRlZDtcblxuICBzdGF0aWMgZnJvbSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKFtdLCB7IHJvb3Q6IChpc0VsZW1lbnQodGhpcykpID8gdGhpcyA6IGRvY3VtZW50LCBjb250ZXh0OiB0aGlzIH0pO1xuXG4gICAgY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGxldCBiYXNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGlmIChCYXNlVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKGJhc2UsIGFyZ3NbYXJnSW5kZXgrK10pO1xuXG4gICAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleF0uZ2V0T3B0aW9ucygpIHx8IHt9LCBiYXNlKTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJvb3RFbGVtZW50ID0gKG9wdGlvbnNSb290KSA9PiB7XG4gICAgICBpZiAoaXNFbGVtZW50KG9wdGlvbnNSb290KSlcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNSb290O1xuXG4gICAgICBpZiAoaXNFbGVtZW50KHRoaXMpKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgcmV0dXJuICgodGhpcyAmJiB0aGlzLm93bmVyRG9jdW1lbnQpIHx8IGRvY3VtZW50KTtcbiAgICB9O1xuXG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IGdldE9wdGlvbnMoKTtcbiAgICBsZXQgcm9vdCAgICAgID0gZ2V0Um9vdEVsZW1lbnQob3B0aW9ucy5yb290KTtcbiAgICBsZXQgcXVlcnlFbmdpbmU7XG5cbiAgICBvcHRpb25zLnJvb3QgPSByb290O1xuICAgIG9wdGlvbnMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCB8fCB0aGlzO1xuXG4gICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLnNsaWNlKCksIG9wdGlvbnMpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1thcmdJbmRleF0pKSB7XG4gICAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4ICsgMV0sICc6OkZ1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzWzFdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnOjpTdHJpbmcnKSkge1xuICAgICAgb3B0aW9ucy5zZWxlY3RvciA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnOjpGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocm9vdC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKEJhc2VVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICc6OkZ1bmN0aW9uJykpIHtcbiAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5jYWxsYmFjay5jYWxsKHRoaXMsIEVsZW1lbnRzLkVsZW1lbnRHZW5lcmF0b3IsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpXG4gICAgICAgIHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaW52b2tlQ2FsbGJhY2tzICE9PSBmYWxzZSAmJiB0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjayk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH07XG5cbiAgZ2V0RW5naW5lQ2xhc3MoKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtNWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgUVVFUllfRU5HSU5FX1RZUEUsXG4gICAgICB9LFxuICAgICAgJ19teXRoaXhVSU9wdGlvbnMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnX215dGhpeFVJRWxlbWVudHMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5maWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhvcHRpb25zLmNvbnRleHQsIGVsZW1lbnRzKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wTmFtZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdsZW5ndGgnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5wcm90b3R5cGU7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gSW5kZXggbG9va3VwXG4gICAgICAgIGlmIChJU19JTlRFR0VSLnRlc3QocHJvcE5hbWUpKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG5cbiAgICAgICAgLy8gUmVkaXJlY3QgYW55IGFycmF5IG1ldGhvZHM6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFwibWFnaWNQcm9wTmFtZVwiIGlzIHdoZW4gdGhlXG4gICAgICAgIC8vIGZ1bmN0aW9uIG5hbWUgYmVnaW5zIHdpdGggXCIkXCIsXG4gICAgICAgIC8vIGkuZS4gXCIkZmlsdGVyXCIsIG9yIFwiJG1hcFwiLiBJZlxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlLCB0aGVuIHRoZSByZXR1cm5cbiAgICAgICAgLy8gdmFsdWUgd2lsbCBhbHdheXMgYmUgY29lcmNlZCBpbnRvXG4gICAgICAgIC8vIGEgUXVlcnlFbmdpbmUuIE90aGVyd2lzZSwgaXQgd2lsbFxuICAgICAgICAvLyBvbmx5IGJlIGNvZXJjZWQgaW50byBhIFF1ZXJ5RW5naW5lXG4gICAgICAgIC8vIGlmIEVWRVJZIGVsZW1lbnQgaW4gdGhlIHJlc3VsdCBpc1xuICAgICAgICAvLyBhbiBcImVsZW1lbnR5XCIgdHlwZSB2YWx1ZS5cbiAgICAgICAgbGV0IG1hZ2ljUHJvcE5hbWUgPSAocHJvcE5hbWUuY2hhckF0KDApID09PSAnJCcpID8gcHJvcE5hbWUuc3Vic3RyaW5nKDEpIDogcHJvcE5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlW21hZ2ljUHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgICA9IHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cztcbiAgICAgICAgICAgIGxldCByZXN1bHQgID0gYXJyYXlbbWFnaWNQcm9wTmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkgJiYgKG1hZ2ljUHJvcE5hbWUgIT09IHByb3BOYW1lIHx8IHJlc3VsdC5ldmVyeSgoaXRlbSkgPT4gQmFzZVV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbiwgTm9kZSwgUXVlcnlFbmdpbmUpKSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0YXJnZXQuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyhyZXN1bHQsIHRhcmdldC5nZXRPcHRpb25zKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm9vdFByb3h5O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlPcHRpb25zO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQ7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGdldFVuZGVybHlpbmdBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcbiAgfVxuXG4gIGdldE93bmVyRG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um9vdCgpLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBmaWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhjb250ZXh0LCBlbGVtZW50cykge1xuICAgIGxldCBmaW5hbEVsZW1lbnRzID0gQXJyYXkuZnJvbShlbGVtZW50cykuZmxhdChJbmZpbml0eSkubWFwKChfaXRlbSkgPT4ge1xuICAgICAgaWYgKCFfaXRlbSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgaXRlbSA9IF9pdGVtO1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0VW5kZXJseWluZ0FycmF5KCk7XG5cbiAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKGl0ZW0sIE5vZGUpKVxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgaWYgKGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgaXRlbSA9IGl0ZW0oKTtcblxuICAgICAgaWYgKEJhc2VVdGlscy5pc1R5cGUoaXRlbSwgJzo6U3RyaW5nJykpXG4gICAgICAgIGl0ZW0gPSBFbGVtZW50cy5UZXJtKGl0ZW0pO1xuICAgICAgZWxzZSBpZiAoIUJhc2VVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24pKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmICghY29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJjb250ZXh0XCIgb3B0aW9uIGZvciBRdWVyeUVuZ2luZSBpcyByZXF1aXJlZCB3aGVuIGNvbnN0cnVjdGluZyBlbGVtZW50cy4nKTtcblxuICAgICAgcmV0dXJuIGl0ZW0uYnVpbGQodGhpcy5nZXRPd25lckRvY3VtZW50KCksIHtcbiAgICAgICAgc2NvcGU6IFV0aWxzLmNyZWF0ZVNjb3BlKGNvbnRleHQpLFxuICAgICAgfSk7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChmaW5hbEVsZW1lbnRzKSk7XG4gIH1cblxuICBzZWxlY3QoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHRoaXMuZ2V0T3B0aW9ucygpLCAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IGFyZ3NbYXJnSW5kZXgrK10gOiB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZXh0ICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQuJCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQuJC5jYWxsKG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIEVuZ2luZUNsYXNzLmZyb20uY2FsbChvcHRpb25zLmNvbnRleHQgfHwgdGhpcywgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICB9XG5cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICB5aWVsZChbaSwgZWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gICprZXlzKCkge1xuICAgIGZvciAobGV0IFsga2V5LCBfIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCBrZXk7XG4gIH1cblxuICAqdmFsdWVzKCkge1xuICAgIGZvciAobGV0IFsgXywgdmFsdWUgXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIHZhbHVlO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB5aWVsZCAqdGhpcy52YWx1ZXMoKTtcbiAgfVxuXG4gIGZpcnN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFCYXNlVXRpbHMuaXNUeXBlKGNvdW50LCAnOjpOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbMF0gXSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkpKTtcbiAgfVxuXG4gIGxhc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIUJhc2VVdGlscy5pc1R5cGUoY291bnQsICc6Ok51bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1t0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCAtIDFdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpICogLTEpKTtcbiAgfVxuXG4gIGFkZCguLi5lbGVtZW50cykge1xuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5zbGljZSgpLmNvbmNhdCguLi5lbGVtZW50cyksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIHN1YnRyYWN0KC4uLmVsZW1lbnRzKSB7XG4gICAgbGV0IHNldCA9IG5ldyBTZXQoZWxlbWVudHMpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuICFzZXQuaGFzKGl0ZW0pO1xuICAgIH0pLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFwcGVuZFRvKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gIH1cblxuICBpbnNlcnRJbnRvKHNlbGVjdG9yT3JFbGVtZW50LCByZWZlcmVuY2VOb2RlKSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpO1xuICAgIGxldCBzb3VyY2UgICAgICAgID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxldCBmcmFnbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXG4gICAgICBzb3VyY2UgPSBbIGZyYWdtZW50IF07XG4gICAgfVxuXG4gICAgZWxlbWVudC5pbnNlcnQoc291cmNlWzBdLCByZWZlcmVuY2VOb2RlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVwbGFjZUNoaWxkcmVuT2Yoc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnOjpTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIHdoaWxlIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVG8oZWxlbWVudCk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTGlzdChvcGVyYXRpb24sIC4uLmFyZ3MpIHtcbiAgICBsZXQgY2xhc3NOYW1lcyA9IGNvbGxlY3RDbGFzc05hbWVzKGFyZ3MpO1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jbGFzc0xpc3QpIHtcbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJ3RvZ2dsZScpXG4gICAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IG5vZGUuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5vZGUuY2xhc3NMaXN0W29wZXJhdGlvbl0oLi4uY2xhc3NOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdhZGQnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3JlbW92ZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgdG9nZ2xlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgndG9nZ2xlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICBzbG90dGVkKHllc05vKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHllc05vKSA/IGlzU2xvdHRlZCA6IGlzTm90U2xvdHRlZCk7XG4gIH1cblxuICBzbG90KHNsb3ROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnNsb3QgPT09IHNsb3ROYW1lKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKGVsZW1lbnQuY2xvc2VzdChgc2xvdFtuYW1lPVwiJHtzbG90TmFtZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyl9XCJdYCkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLlF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbi8qXG5NYW55IHRoYW5rcyB0byBHZXJhaW50IEx1ZmYgZm9yIHRoZSBmb2xsb3dpbmdcblxuaHR0cHM6Ly9naXRodWIuY29tL2dlcmFpbnRsdWZmL3NoYTI1Ni9cbiovXG5cbi8qKlxuICogdHlwZTogRnVuY3Rpb25cbiAqIG5hbWU6IFNIQTI1NlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBTSEEyNTYgaGFzaGluZyBmdW5jdGlvblxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGlucHV0XG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IElucHV0IHN0cmluZ1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBTSEEyNTYgaGFzaCBvZiB0aGUgcHJvdmlkZWQgYGlucHV0YC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVGhpcyBpcyBhIGN1c3RvbSBiYWtlZCBTSEEyNTYgaGFzaGluZyBmdW5jdGlvbiwgbWluaW1pemVkIGZvciBzaXplLlxuICogICAgIEl0IG1heSBiZSBpbmNvbXBsZXRlLCBhbmQgaXQgaXMgc3Ryb25nbHkgcmVjb21tZW5kZWQgdGhhdCB5b3UgKipETyBOT1QqKiB1c2UgdGhpc1xuICogICAgIGZvciBhbnl0aGluZyByZWxhdGVkIHRvIHNlY3VyaXR5LlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogUmVhZCBhbGwgdGhlIG5vdGVzLCBhbmQgdXNlIHRoaXMgbWV0aG9kIHdpdGggY2F1dGlvbi5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgbWV0aG9kIGhhcyBiZWVuIG1vZGlmaWVkIHNsaWdodGx5IGZyb20gdGhlIG9yaWdpbmFsIHRvICpub3QqIGJhaWwgd2hlblxuICogICAgIHVuaWNvZGUgY2hhcmFjdGVycyBhcmUgZGV0ZWN0ZWQuIFRoZXJlIGlzIGEgZGVjZW50IGNoYW5jZSB0aGF0LS1naXZlbiBjZXJ0YWluXG4gKiAgICAgaW5wdXQtLXRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGFuIGludmFsaWQgU0hBMjU2IGhhc2guXCJcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IE15dGhpeCBVSSB1c2VzIHRoaXMgbWV0aG9kIHNpbXBseSB0byBnZW5lcmF0ZSBjb25zaXN0ZW50IElEcy5cbiAqICAgLSB8XG4gKiAgICAgOmhlYXJ0OiBNYW55IHRoYW5rcyB0byB0aGUgYXV0aG9yIFtHZXJhaW50IEx1ZmZdKGh0dHBzOi8vZ2l0aHViLmNvbS9nZXJhaW50bHVmZi9zaGEyNTYvKVxuICogICAgIGZvciB0aGlzIG1ldGhvZCFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFNIQTI1NihfaW5wdXQpIHtcbiAgbGV0IGlucHV0ID0gX2lucHV0O1xuXG4gIGxldCBtYXRoUG93ID0gTWF0aC5wb3c7XG4gIGxldCBtYXhXb3JkID0gbWF0aFBvdygyLCAzMik7XG4gIGxldCBsZW5ndGhQcm9wZXJ0eSA9ICdsZW5ndGgnO1xuICBsZXQgaTsgbGV0IGo7IC8vIFVzZWQgYXMgYSBjb3VudGVyIGFjcm9zcyB0aGUgd2hvbGUgZmlsZVxuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgbGV0IHdvcmRzID0gW107XG4gIGxldCBhc2NpaUJpdExlbmd0aCA9IGlucHV0W2xlbmd0aFByb3BlcnR5XSAqIDg7XG5cbiAgLy8qIGNhY2hpbmcgcmVzdWx0cyBpcyBvcHRpb25hbCAtIHJlbW92ZS9hZGQgc2xhc2ggZnJvbSBmcm9udCBvZiB0aGlzIGxpbmUgdG8gdG9nZ2xlXG4gIC8vIEluaXRpYWwgaGFzaCB2YWx1ZTogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lc1xuICAvLyAod2UgYWN0dWFsbHkgY2FsY3VsYXRlIHRoZSBmaXJzdCA2NCwgYnV0IGV4dHJhIHZhbHVlcyBhcmUganVzdCBpZ25vcmVkKVxuICBsZXQgaGFzaCA9IFNIQTI1Ni5oID0gU0hBMjU2LmggfHwgW107XG4gIC8vIFJvdW5kIGNvbnN0YW50czogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgY3ViZSByb290cyBvZiB0aGUgZmlyc3QgNjQgcHJpbWVzXG4gIGxldCBrID0gU0hBMjU2LmsgPSBTSEEyNTYuayB8fCBbXTtcbiAgbGV0IHByaW1lQ291bnRlciA9IGtbbGVuZ3RoUHJvcGVydHldO1xuICAvKi9cbiAgICBsZXQgaGFzaCA9IFtdLCBrID0gW107XG4gICAgbGV0IHByaW1lQ291bnRlciA9IDA7XG4gICAgLy8qL1xuXG4gIGxldCBpc0NvbXBvc2l0ZSA9IHt9O1xuICBmb3IgKGxldCBjYW5kaWRhdGUgPSAyOyBwcmltZUNvdW50ZXIgPCA2NDsgY2FuZGlkYXRlKyspIHtcbiAgICBpZiAoIWlzQ29tcG9zaXRlW2NhbmRpZGF0ZV0pIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAzMTM7IGkgKz0gY2FuZGlkYXRlKVxuICAgICAgICBpc0NvbXBvc2l0ZVtpXSA9IGNhbmRpZGF0ZTtcblxuICAgICAgaGFzaFtwcmltZUNvdW50ZXJdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAwLjUpICogbWF4V29yZCkgfCAwO1xuICAgICAga1twcmltZUNvdW50ZXIrK10gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDEgLyAzKSAqIG1heFdvcmQpIHwgMDtcbiAgICB9XG4gIH1cblxuICBpbnB1dCArPSAnXFx4ODAnOyAvLyBBcHBlbmQgxocnIGJpdCAocGx1cyB6ZXJvIHBhZGRpbmcpXG4gIHdoaWxlIChpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gJSA2NCAtIDU2KVxuICAgIGlucHV0ICs9ICdcXHgwMCc7IC8vIE1vcmUgemVybyBwYWRkaW5nXG5cbiAgZm9yIChpID0gMDsgaSA8IGlucHV0W2xlbmd0aFByb3BlcnR5XTsgaSsrKSB7XG4gICAgaiA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGogPj4gOClcbiAgICAgIHJldHVybjsgLy8gQVNDSUkgY2hlY2s6IG9ubHkgYWNjZXB0IGNoYXJhY3RlcnMgaW4gcmFuZ2UgMC0yNTVcbiAgICB3b3Jkc1tpID4+IDJdIHw9IGogPDwgKCgzIC0gaSkgJSA0KSAqIDg7XG4gIH1cblxuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKChhc2NpaUJpdExlbmd0aCAvIG1heFdvcmQpIHwgMCk7XG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoYXNjaWlCaXRMZW5ndGgpO1xuXG4gIC8vIHByb2Nlc3MgZWFjaCBjaHVua1xuICBmb3IgKGogPSAwOyBqIDwgd29yZHNbbGVuZ3RoUHJvcGVydHldOykge1xuICAgIGxldCB3ID0gd29yZHMuc2xpY2UoaiwgaiArPSAxNik7IC8vIFRoZSBtZXNzYWdlIGlzIGV4cGFuZGVkIGludG8gNjQgd29yZHMgYXMgcGFydCBvZiB0aGUgaXRlcmF0aW9uXG4gICAgbGV0IG9sZEhhc2ggPSBoYXNoO1xuXG4gICAgLy8gVGhpcyBpcyBub3cgdGhlIHVuZGVmaW5lZHdvcmtpbmcgaGFzaFwiLCBvZnRlbiBsYWJlbGxlZCBhcyB2YXJpYWJsZXMgYS4uLmdcbiAgICAvLyAod2UgaGF2ZSB0byB0cnVuY2F0ZSBhcyB3ZWxsLCBvdGhlcndpc2UgZXh0cmEgZW50cmllcyBhdCB0aGUgZW5kIGFjY3VtdWxhdGVcbiAgICBoYXNoID0gaGFzaC5zbGljZSgwLCA4KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2UgaW50byA2NCB3b3Jkc1xuICAgICAgLy8gVXNlZCBiZWxvdyBpZlxuICAgICAgbGV0IHcxNSA9IHdbaSAtIDE1XTsgbGV0IHcyID0gd1tpIC0gMl07XG5cbiAgICAgIC8vIEl0ZXJhdGVcbiAgICAgIGxldCBhID0gaGFzaFswXTsgbGV0IGUgPSBoYXNoWzRdO1xuICAgICAgbGV0IHRlbXAxID0gaGFzaFs3XVxuICAgICAgICAgICAgICAgICsgKCgoZSA+Pj4gNikgfCAoZSA8PCAyNikpIF4gKChlID4+PiAxMSkgfCAoZSA8PCAyMSkpIF4gKChlID4+PiAyNSkgfCAoZSA8PCA3KSkpIC8vIFMxXG4gICAgICAgICAgICAgICAgKyAoKGUgJiBoYXNoWzVdKSBeICgofmUpICYgaGFzaFs2XSkpIC8vIGNoXG4gICAgICAgICAgICAgICAgKyBrW2ldXG4gICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICsgKHdbaV0gPSAoaSA8IDE2KSA/IHdbaV0gOiAoXG4gICAgICAgICAgICAgICAgICB3W2kgLSAxNl1cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzE1ID4+PiA3KSB8ICh3MTUgPDwgMjUpKSBeICgodzE1ID4+PiAxOCkgfCAodzE1IDw8IDE0KSkgXiAodzE1ID4+PiAzKSkgLy8gczBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgd1tpIC0gN11cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzIgPj4+IDE3KSB8ICh3MiA8PCAxNSkpIF4gKCh3MiA+Pj4gMTkpIHwgKHcyIDw8IDEzKSkgXiAodzIgPj4+IDEwKSkgLy8gczFcbiAgICAgICAgICAgICAgICApIHwgMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAvLyBUaGlzIGlzIG9ubHkgdXNlZCBvbmNlLCBzbyAqY291bGQqIGJlIG1vdmVkIGJlbG93LCBidXQgaXQgb25seSBzYXZlcyA0IGJ5dGVzIGFuZCBtYWtlcyB0aGluZ3MgdW5yZWFkYmxlXG4gICAgICBsZXQgdGVtcDIgPSAoKChhID4+PiAyKSB8IChhIDw8IDMwKSkgXiAoKGEgPj4+IDEzKSB8IChhIDw8IDE5KSkgXiAoKGEgPj4+IDIyKSB8IChhIDw8IDEwKSkpIC8vIFMwXG4gICAgICAgICAgICAgICAgKyAoKGEgJiBoYXNoWzFdKSBeIChhICYgaGFzaFsyXSkgXiAoaGFzaFsxXSAmIGhhc2hbMl0pKTsgLy8gbWFqXG5cbiAgICAgIGhhc2ggPSBbKHRlbXAxICsgdGVtcDIpIHwgMF0uY29uY2F0KGhhc2gpOyAvLyBXZSBkb24ndCBib3RoZXIgdHJpbW1pbmcgb2ZmIHRoZSBleHRyYSBvbmVzLCB0aGV5J3JlIGhhcm1sZXNzIGFzIGxvbmcgYXMgd2UncmUgdHJ1bmNhdGluZyB3aGVuIHdlIGRvIHRoZSBzbGljZSgpXG4gICAgICBoYXNoWzRdID0gKGhhc2hbNF0gKyB0ZW1wMSkgfCAwO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICBoYXNoW2ldID0gKGhhc2hbaV0gKyBvbGRIYXNoW2ldKSB8IDA7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgZm9yIChqID0gMzsgaiArIDE7IGotLSkge1xuICAgICAgbGV0IGIgPSAoaGFzaFtpXSA+PiAoaiAqIDgpKSAmIDI1NTtcbiAgICAgIHJlc3VsdCArPSAoKGIgPCAxNikgPyAwIDogJycpICsgYi50b1N0cmluZygxNik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7XG4gIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLFxuICBNWVRISVhfU0hBRE9XX1BBUkVOVCxcbiAgTVlUSElYX1RZUEUsXG4gIEVMRU1FTlRfREVGSU5JVElPTl9UWVBFLFxuICBRVUVSWV9FTkdJTkVfVFlQRSxcbn0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG5pbXBvcnQgKiBhcyBCYXNlVXRpbHMgZnJvbSAnLi9iYXNlLXV0aWxzLmpzJztcblxuaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnLi9keW5hbWljLXByb3BlcnR5LmpzJztcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IFV0aWxzXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIGBpbXBvcnQgeyBVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgTWlzYyB1dGlsaXR5IGZ1bmN0aW9ucyBhcmUgZm91bmQgd2l0aGluIHRoaXMgbmFtZXNwYWNlLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTWV0aG9kcyhfcHJvdG8sIHNraXBQcm90b3MpIHtcbiAgbGV0IHByb3RvICAgICAgICAgICA9IF9wcm90bztcbiAgbGV0IGFscmVhZHlWaXNpdGVkICA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAocHJvdG8pIHtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90byk7XG4gICAgbGV0IGtleXMgICAgICAgID0gT2JqZWN0LmtleXMoZGVzY3JpcHRvcnMpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGRlc2NyaXB0b3JzKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyB8fCBrZXkgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyhrZXkpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKGtleSk7XG5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gZGVzY3JpcHRvcnNba2V5XTtcblxuICAgICAgLy8gQ2FuIGl0IGJlIGNoYW5nZWQ/XG4gICAgICBpZiAoZGVzY3JpcHRvci5jb25maWd1cmFibGUgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gSWYgaXMgZ2V0dGVyLCB0aGVuIHNraXBcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ2dldCcpIHx8IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnc2V0JykpIHtcbiAgICAgICAgbGV0IG5ld0Rlc2NyaXB0b3IgPSB7IC4uLmRlc2NyaXB0b3IgfTtcbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3IuZ2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IuZ2V0ID0gbmV3RGVzY3JpcHRvci5nZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5zZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5zZXQgPSBuZXdEZXNjcmlwdG9yLnNldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcblxuICAgICAgLy8gU2tpcCBwcm90b3R5cGUgb2YgT2JqZWN0XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIE9iamVjdC5wcm90b3R5cGVba2V5XSA9PT0gdmFsdWUpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAuLi5kZXNjcmlwdG9yLCB2YWx1ZTogdmFsdWUuYmluZCh0aGlzKSB9KTtcbiAgICB9XG5cbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgYnJlYWs7XG5cbiAgICBpZiAoc2tpcFByb3RvcyAmJiBza2lwUHJvdG9zLmluZGV4T2YocHJvdG8pID49IDApXG4gICAgICBicmVhaztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihzdGFydFByb3RvLCBkZXNjcmlwdG9yTmFtZSkge1xuICBsZXQgdGhpc1Byb3RvID0gc3RhcnRQcm90bztcbiAgbGV0IGRlc2NyaXB0b3I7XG5cbiAgd2hpbGUgKHRoaXNQcm90byAmJiAhKGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXNQcm90bywgZGVzY3JpcHRvck5hbWUpKSlcbiAgICB0aGlzUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1Byb3RvKTtcblxuICByZXR1cm4geyBwcm90b3R5cGU6IHRoaXNQcm90bywgZGVzY3JpcHRvciB9O1xufVxuXG5jb25zdCBNRVRBREFUQV9TVE9SQUdFID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9tZXRhZGF0YS1zdG9yYWdlJyk7XG5jb25zdCBNRVRBREFUQV9XRUFLTUFQID0gZ2xvYmFsVGhpcy5teXRoaXhVSVtNRVRBREFUQV9TVE9SQUdFXSA9IChnbG9iYWxUaGlzLm15dGhpeFVJW01FVEFEQVRBX1NUT1JBR0VdKSA/IGdsb2JhbFRoaXMubXl0aGl4VUlbTUVUQURBVEFfU1RPUkFHRV0gOiBuZXcgV2Vha01hcCgpO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgU3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhIG9uIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqXG4gKiAgIFRoaXMgZnVuY3Rpb24gdXNlcyBhbiBpbnRlcm5hbCBXZWFrTWFwIHRvIHN0b3JlIG1ldGFkYXRhIGZvciBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSB2YWx1ZS5cbiAqXG4gKiAgIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHByb3ZpZGVkIHdpbGwgY2hhbmdlIHRoZSBiZWhhdmlvciBvZiB0aGlzIGZ1bmN0aW9uOlxuICogICAxLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBzdXBwbGllZCAoYSBgdGFyZ2V0YCksIHRoZW4gYSBNYXAgb2YgbWV0YWRhdGEga2V5L3ZhbHVlIHBhaXJzIGlzIHJldHVybmVkLlxuICogICAyLiBJZiBvbmx5IHR3byBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCB0aGVuIGBtZXRhZGF0YWAgYWN0cyBhcyBhIGdldHRlciwgYW5kIHRoZSB2YWx1ZSBzdG9yZWQgdW5kZXIgdGhlIHNwZWNpZmllZCBga2V5YCBpcyByZXR1cm5lZC5cbiAqICAgMy4gSWYgbW9yZSB0aGFuIHR3byBhcmd1bWVudHMgYXJlIHN1cHBsaWVkLCB0aGVuIGBtZXRhZGF0YWAgYWN0cyBhcyBhIHNldHRlciwgYW5kIGB0YXJnZXRgIGlzIHJldHVybmVkIChmb3IgY29udGludWVkIGNoYWluaW5nKS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB0YXJnZXRcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyB0aGUgdmFsdWUgZm9yIHdoaWNoIG1ldGFkYXRhIGlzIGJlaW5nIHN0b3JlZCBvciByZXRyaWV2ZWQuXG4gKiAgICAgICBUaGlzIGNhbiBiZSBhbnkgZ2FyYmFnZS1jb2xsZWN0YWJsZSB2YWx1ZSAoYW55IHZhbHVlIHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBrZXkgaW4gYSBXZWFrTWFwKS5cbiAqICAgLSBuYW1lOiBrZXlcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgb3B0aW9uYWw6IHRydWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUga2V5IHVzZWQgdG8gc3RvcmUgb3IgZmV0Y2ggdGhlIHNwZWNpZmllZCBtZXRhZGF0YSB2YWx1ZS4gVGhpcyBjYW4gYmUgYW55IHZhbHVlLCBhcyB0aGUgdW5kZXJseWluZ1xuICogICAgICAgc3RvcmFnZSBpcyBhIE1hcC5cbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBvcHRpb25hbDogdHJ1ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSB2YWx1ZSB0byBzdG9yZSBvbiB0aGUgYHRhcmdldGAgdW5kZXIgdGhlIHNwZWNpZmllZCBga2V5YC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYW55O1xuICogICAxLiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCAoYSBidWxrIGdldCBvcGVyYXRpb24pLCByZXR1cm4gYSBNYXAgY29udGFpbmluZyB0aGUgbWV0YWRhdGEgZm9yIHRoZSBzcGVjaWZpZWQgYHRhcmdldGAuXG4gKiAgIDIuIElmIHR3byBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIChhIGdldCBvcGVyYXRpb24pLCB0aGUgYHRhcmdldGAgbWV0YWRhdGEgdmFsdWUgc3RvcmVkIGZvciB0aGUgc3BlY2lmaWVkIGBrZXlgLlxuICogICAyLiBJZiBtb3JlIHRoYW4gdHdvIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgKGEgc2V0IG9wZXJhdGlvbiksIHRoZSBwcm92aWRlZCBgdGFyZ2V0YCBpcyByZXR1cm5lZC5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICAvLyBzZXRcbiAqICAgICBVdGlscy5tZXRhZGF0YShteUVsZW1lbnQsICdjdXN0b21DYXB0aW9uJywgJ01ldGFkYXRhIENhcHRpb24hJyk7XG4gKlxuICogICAgIC8vIGdldFxuICogICAgIGNvbnNvbGUubG9nKFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCwgJ2N1c3RvbUNhcHRpb24nKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICdNZXRhZGF0YSBDYXB0aW9uISdcbiAqXG4gKiAgICAgLy8gZ2V0IGFsbFxuICogICAgIGNvbnNvbGUubG9nKFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCkpO1xuICogICAgIC8vIG91dHB1dCAtPiBNYXAoMSkgeyAnY3VzdG9tQ2FwdGlvbicgPT4gJ01ldGFkYXRhIENhcHRpb24hJyB9XG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoIWRhdGEpIHtcbiAgICBpZiAoIUJhc2VVdGlscy5pc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBzZXQgbWV0YWRhdGEgb24gcHJvdmlkZWQgb2JqZWN0OiAkeyh0eXBlb2YgdGFyZ2V0ID09PSAnc3ltYm9sJykgPyB0YXJnZXQudG9TdHJpbmcoKSA6IHRhcmdldH1gKTtcblxuICAgIGRhdGEgPSBuZXcgTWFwKCk7XG4gICAgTUVUQURBVEFfV0VBS01BUC5zZXQodGFyZ2V0LCBkYXRhKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKVxuICAgIHJldHVybiBkYXRhO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKVxuICAgIHJldHVybiAoZGF0YSkgPyBkYXRhLmdldChrZXkpIDogdW5kZWZpbmVkO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IFZBTElEX0pTX0lERU5USUZJRVIgPSAvXlthLXpBLVpfJF1bYS16QS1aMC05XyRdKiQvO1xuY29uc3QgUkVTRVJWRURfSURFTlRJRklFUiA9IC9eKGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxleHBvcnR8ZXh0ZW5kc3xmYWxzZXxmaW5hbGx5fGZvcnxmdW5jdGlvbnxpZnxpbXBvcnR8aW58aW5zdGFuY2VvZnxuZXd8bnVsbHxyZXR1cm58c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ1ZXx0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8bGV0fHN0YXRpY3x5aWVsZCkkLztcblxuZnVuY3Rpb24gZ2V0Q29udGV4dENhbGxBcmdzKGNvbnRleHQsIC4uLmV4dHJhQ29udGV4dHMpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IEFycmF5LmZyb20oXG4gICAgbmV3IFNldChnZXRBbGxQcm9wZXJ0eU5hbWVzKGNvbnRleHQpLmNvbmNhdChcbiAgICAgIE9iamVjdC5rZXlzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pLFxuICAgICAgWyAnYXR0cmlidXRlcycsICdjbGFzc0xpc3QnLCAnJCQnLCAnaTE4bicgXSxcbiAgICAgIC4uLmV4dHJhQ29udGV4dHMubWFwKChleHRyYUNvbnRleHQpID0+IE9iamVjdC5rZXlzKGV4dHJhQ29udGV4dCB8fCB7fSkpLFxuICAgICkpLFxuICApLmZpbHRlcigobmFtZSkgPT4ge1xuICAgIGlmIChSRVNFUlZFRF9JREVOVElGSUVSLnRlc3QobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpO1xuICB9KTtcblxuICByZXR1cm4gYHske2NvbnRleHRDYWxsQXJncy5qb2luKCcsJyl9fWA7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBHZXQgdGhlIHBhcmVudCBOb2RlIG9mIGBlbGVtZW50YC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBlbGVtZW50XG4gKiAgICAgZGF0YVR5cGU6IE5vZGVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgTm9kZSB3aG9zZSBwYXJlbnQgeW91IHdpc2ggdG8gZmluZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogVW5saWtlIFtOb2RlLnBhcmVudE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpLCB0aGlzXG4gKiAgICAgd2lsbCBhbHNvIHNlYXJjaCBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzLlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogKipTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBvbmx5IHdvcmtzIGZvciBNeXRoaXggVUkgY29tcG9uZW50cyEqKlxuICogICAtIHxcbiAqICAgICA6aW5mbzogU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgaXMgYWNjb21wbGlzaGVkIHZpYSBsZXZlcmFnaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE7IG9uXG4gKiAgICAgYGVsZW1lbnRgLiBXaGVuIGEgYG51bGxgIHBhcmVudCBpcyBlbmNvdW50ZXJlZCwgYGdldFBhcmVudE5vZGVgIHdpbGwgbG9vayBmb3IgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgQHNlZSBDb25zdGFudHMuTVlUSElYX1NIQURPV19QQVJFTlQ7XG4gKiAgICAgb24gYGVsZW1lbnRgLiBJZiBmb3VuZCwgdGhlIHJlc3VsdCBpcyBjb25zaWRlcmVkIHRoZSBbcGFyZW50IE5vZGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3BhcmVudE5vZGUpIG9mIGBlbGVtZW50YC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgTm9kZTsgVGhlIHBhcmVudCBub2RlLCBpZiB0aGVyZSBpcyBhbnksIG9yIGBudWxsYCBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmIChlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQucGFyZW50Tm9kZSwgTVlUSElYX1NIQURPV19QQVJFTlQpIHx8IG51bGw7XG5cbiAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiBtZXRhZGF0YShlbGVtZW50LCBNWVRISVhfU0hBRE9XX1BBUkVOVCkgfHwgbnVsbDtcblxuICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ3JlYXRlIGEgUHJveHkgdGhhdCBpcyBlc3NlbnRpYWxseSAoZnVuY3Rpb25hbGx5KSBhIG11bHRpLXByb3RvdHlwZSBgb2JqZWN0YCBpbnN0YW5jZS5cbiAqXG4gKiAgIEEgXCJzY29wZVwiIGluIE15dGhpeCBVSSBtaWdodCBiZSBiZXR0ZXIgY2FsbGVkIGEgXCJjb250ZXh0XCIuLi4gaG93ZXZlciwgXCJzY29wZVwiXG4gKiAgIHdhcyBjaG9zZW4gYmVjYXVzZSBpdCAqaXMqIGEgc2NvcGUuLi4gb3IgbWlnaHQgYmUgYmV0dGVyIGRlc2NyaWJlZCBhcyBcIm11bHRpcGxlIHNjb3BlcyBpbiBvbmVcIi5cbiAqICAgVGhpcyBpcyBzcGVjaWZpY2FsbHkgYSBcIkRPTSBzY29wZVwiLCBpbiB0aGF0IHRoaXMgbWV0aG9kIGlzIFwiRE9NIGF3YXJlXCIgYW5kIHdpbGwgdHJhdmVyc2UgdGhlXG4gKiAgIERPTSBsb29raW5nIGZvciB0aGUgcmVxdWVzdGVkIGRhdGEgKGlmIGFueSBvZiB0aGUgc3BlY2lmaWVkIGB0YXJnZXRzYCBpcyBhbiBFbGVtZW50IHRoYXQgaXMpLlxuICpcbiAqICAgVGhlIHdheSB0aGlzIHdvcmtzIGlzIHRoYXQgdGhlIGNhbGxlciB3aWxsIHByb3ZpZGUgYXQgbGVhc3Qgb25lIFwidGFyZ2V0XCIuIFRoZXNlIHRhcmdldHMgYXJlXG4gKiAgIHRoZW1zZWx2ZXMgc2NvcGVzLCBlbGVtZW50cywgb3Igb3RoZXIgZGF0YSBvYmplY3RzLiBXaGVuIHRoZSByZXR1cm5lZCBQcm94eSBpbnN0YW5jZSBpcyBhY2Nlc3NlZCxcbiAqICAgdGhlIHJlcXVlc3RlZCBrZXkgaXMgc2VhcmNoZWQgaW4gYWxsIHByb3ZpZGVkIGB0YXJnZXRzYCwgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBwcm92aWRlZC5cbiAqXG4gKiAgIEFzaWRlIGZyb20gc2VhcmNoaW5nIGFsbCB0YXJnZXRzIGZvciB0aGUgZGVzaXJlZCBrZXksIGl0IHdpbGwgYWxzbyBmYWxsYmFjayB0byBvdGhlciBkYXRhIHNvdXJjZXNcbiAqICAgaXQgc2VhcmNoZXMgaW4gYXMgd2VsbDpcbiAqICAgMS4gSWYgYW55IGdpdmVuIGB0YXJnZXRgIGl0IGlzIHNlYXJjaGluZyBpcyBhbiBFbGVtZW50LCB0aGVuIGl0IHdpbGwgYWxzbyBzZWFyY2hcbiAqICAgICAgZm9yIHRoZSByZXF1ZXN0ZWQga2V5IG9uIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqICAgMi4gSWYgc3RlcCAjMSBoYXMgZmFpbGVkLCB0aGVuIG1vdmUgdG8gdGhlIHBhcmVudCBub2RlIG9mIHRoZSBjdXJyZW50IEVsZW1lbnQgaW5zdGFuY2UsIGFuZFxuICogICAgICByZXBlYXQgdGhlIHByb2Nlc3MsIHN0YXJ0aW5nIGZyb20gc3RlcCAjMS5cbiAqICAgMy4gQWZ0ZXIgc3RlcHMgMS0yIGFyZSByZXBlYXRlZCBmb3IgZXZlcnkgZ2l2ZW4gYHRhcmdldGAgKGFuZCBhbGwgcGFyZW50IG5vZGVzIG9mIHRob3NlIGB0YXJnZXRzYC4uLiBpZiBhbnkpLFxuICogICAgICB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgZmluYWxseSBmYWxsYmFjayB0byBzZWFyY2hpbmcgYGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVgIGZvciB0aGUgcmVxdWVzdGVkIGtleS5cbiAqXG4gKiAgIFdlIGFyZW4ndCBxdWl0ZSBmaW5pc2hlZCB5ZXQgdGhvdWdoLi4uXG4gKlxuICogICBJZiBzdGVwcyAxLTMgYWJvdmUgYWxsIGZhaWwsIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBzdGlsbCBmYWxsYmFjayB0byB0aGUgZmFsbG93aW5nIGhhcmQtY29kZWQga2V5L3ZhbHVlIHBhaXJzOlxuICogICAxLiBBIHJlcXVlc3RlZCBrZXkgb2YgYCdnbG9iYWxTY29wZSdgIChpZiBub3QgZm91bmQgb24gYSB0YXJnZXQpIHdpbGwgcmVzdWx0IGluIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlYCBiZWluZyByZXR1cm5lZC5cbiAqICAgMi4gQSByZXF1ZXN0ZWQga2V5IG9mIGAnaTE4bidgIChpZiBub3QgZm91bmQgb24gYSB0YXJnZXQpIHdpbGwgcmVzdWx0IGluIHRoZSBidWlsdC1pbiBgaTE4bmAgbGFuZ3VhZ2UgdGVybSBwcm9jZXNzb3IgYmVpbmcgcmV0dXJuZWQuXG4gKiAgIDMuIEEgcmVxdWVzdGVkIGtleSBvZiBgJ2R5bmFtaWNQcm9wSUQnYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiB0aGUgYnVpbHQtaW4gYGR5bmFtaWNQcm9wSURgIGR5bmFtaWMgcHJvcGVydHkgcHJvdmlkZWQuIFNlZSBAc2VlIFV0aWxzLmR5bmFtaWNQcm9wSUQ7LlxuICpcbiAqICAgRmluYWxseSwgdGhlIHJldHVybmVkIFByb3h5IHdpbGwgYWxzbyBpbnRlcmNlcHQgYW55IHZhbHVlIFtzZXRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb3h5L1Byb3h5L3NldCkgb3BlcmF0aW9uLFxuICogICB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgZmlyc3QgdGFyZ2V0IGZvdW5kLlxuICpcbiAqICAgVGhlIFByb3h5IGFsc28gb3ZlcmxvYWRzIFtvd25LZXlzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm94eS9Qcm94eS9vd25LZXlzKSB0byBsaXN0ICoqYWxsKioga2V5cyBhY3Jvc3MgKiphbGwqKiBgdGFyZ2V0c2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogLi4udGFyZ2V0c1xuICogICAgIGRhdGFUeXBlczpcbiAqICAgICAgIC0gT2JqZWN0XG4gKiAgICAgICAtIEVsZW1lbnRcbiAqICAgICAgIC0gbm9uLXByaW1pdGl2ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBgdGFyZ2V0c2AgdG8gYmUgc2VhcmNoZWQsIGluIHRoZSBvcmRlciBwcm92aWRlZC4gVGFyZ2V0cyBhcmUgc2VhcmNoZWQgYm90aCBmb3IgZ2V0IG9wZXJhdGlvbnMsIGFuZCBzZXQgb3BlcmF0aW9ucyAodGhlIGZpcnN0IHRhcmdldCBmb3VuZCB3aWxsIGJlIHRoZSBzZXQgdGFyZ2V0KS5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6d2FybmluZzogTXl0aGl4IFVJIHdpbGwgZGVsaWJlcmF0ZWx5IG5ldmVyIGRpcmVjdGx5IGFjY2VzcyBgZ2xvYmFsVGhpc2AgZnJvbSB0aGUgdGVtcGxhdGUgZW5naW5lIChmb3Igc2VjdXJpdHkgcmVhc29ucykuXG4gKiAgICAgQmVjYXVzZSBvZiB0aGlzLCBNeXRoaXggVUkgYXV0b21hdGljYWxseSBwcm92aWRlcyBpdHMgb3duIGdsb2JhbCBzY29wZSBgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZWAuXG4gKiAgICAgSWYgeW91IHdhbnQgZGF0YSB0byBiZSBcImdsb2JhbGx5XCIgdmlzaWJsZSB0byBNeXRoaXggVUksIHRoZW4geW91IG5lZWQgdG8gYWRkIHlvdXIgZGF0YSB0byB0aGlzIHNwZWNpYWwgZ2xvYmFsIHNjb3BlLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogVGhpcyBtZXRob2QgaXMgY29tcGxleCBiZWNhdXNlIGl0IGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gcHJvdmlkZSBhIFwic2NvcGVcIiB0byB0aGUgTXl0aGl4IFVJIHRlbXBsYXRpbmcgZW5naW5lLlxuICogICAgIFRoZSB0ZW1wbGF0aW5nIGVuZ2luZSBuZWVkcyB0byBiZSBET00gYXdhcmUsIGFuZCBhbHNvIG5lZWRzIHRvIGhhdmUgYWNjZXNzIHRvIHNwZWNpYWxpemVkLCBzY29wZWQgZGF0YVxuICogICAgIChpLmUuIHRoZSBgbXl0aGl4LXVpLWZvci1lYWNoYCBjb21wb25lbnQgd2lsbCBwdWJsaXNoIHNjb3BlZCBkYXRhIGZvciBlYWNoIGl0ZXJhdGlvbiwgd2hpY2ggbmVlZHMgdG8gYmUgYm90aFxuICogICAgIERPTS1hd2FyZSwgYW5kIGl0ZXJhdGlvbi1hd2FyZSkuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBBbnkgcHJvdmlkZWQgYHRhcmdldGAgY2FuIGFsc28gYmUgb25lIG9mIHRoZXNlIFByb3h5IHNjb3BlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEl0IGNhbiBoZWxwIHRvIHRoaW5rIG9mIHRoZSByZXR1cm5lZCBcInNjb3BlXCIgYXMgYW4gcGxhaW4gT2JqZWN0IHRoYXQgaGFzIGFuIGFycmF5IG9mIHByb3RvdHlwZXMuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIFByb3h5OyBBIHByb3h5IGluc3RhbmNlLCB0aGF0IGlzIHVzZWQgdG8gZ2V0IGFuZCBzZXQga2V5cyBhY3Jvc3MgbXVsdGlwbGUgYHRhcmdldHNgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2NvcGUoLi4uX3RhcmdldHMpIHtcbiAgY29uc3QgZmluZFByb3BOYW1lU2NvcGUgPSAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmICh0YXJnZXQgPT0gbnVsbCB8fCBPYmplY3QuaXModGFyZ2V0LCBOYU4pKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgIHJldHVybiB0YXJnZXQ7XG5cbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IHNlYXJjaFBhcmVudE5vZGVzRm9yS2V5ID0gKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBpZiAoIWN1cnJlbnRFbGVtZW50KVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIGN1cnJlbnRFbGVtZW50KVxuICAgICAgICAgIHJldHVybiBjdXJyZW50RWxlbWVudDtcblxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2VhcmNoUGFyZW50Tm9kZXNGb3JLZXkodGFyZ2V0KTtcbiAgfTtcblxuICBsZXQgdGFyZ2V0cyAgICAgICAgID0gX3RhcmdldHMuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgZmlyc3RFbGVtZW50ICAgID0gdGFyZ2V0cy5maW5kKCh0YXJnZXQpID0+ICh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSkgfHwgdGFyZ2V0c1swXTtcbiAgbGV0IGJhc2VDb250ZXh0ICAgICA9IHt9O1xuICBsZXQgZmFsbGJhY2tDb250ZXh0ID0ge1xuICAgIGdsb2JhbFNjb3BlOiAgKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSksXG4gICAgaTE4bjogICAgICAgICAocGF0aCwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gICAgICBsZXQgbGFuZ3VhZ2VQcm92aWRlciA9IHNwZWNpYWxDbG9zZXN0KGZpcnN0RWxlbWVudCwgJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgICByZXR1cm4gbGFuZ3VhZ2VQcm92aWRlci5pMThuKHBhdGgsIGRlZmF1bHRWYWx1ZSk7XG4gICAgfSxcbiAgICBkeW5hbWljUHJvcElELFxuICB9O1xuXG4gIHRhcmdldHMgPSB0YXJnZXRzLmNvbmNhdChmYWxsYmFja0NvbnRleHQpO1xuICBsZXQgcHJveHkgICA9IG5ldyBQcm94eShiYXNlQ29udGV4dCwge1xuICAgIG93bktleXM6ICgpID0+IHtcbiAgICAgIGxldCBhbGxLZXlzID0gW107XG5cbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoZ2V0QWxsUHJvcGVydHlOYW1lcyh0YXJnZXQpKTtcblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoZ2xvYmFsU2NvcGUpXG4gICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChPYmplY3Qua2V5cyhnbG9iYWxTY29wZSkpO1xuXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFsbEtleXMpKTtcbiAgICB9LFxuICAgIGhhczogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiAocHJvcE5hbWUgaW4gZ2xvYmFsU2NvcGUpO1xuICAgIH0sXG4gICAgZ2V0OiAoXywgcHJvcE5hbWUpID0+IHtcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBzY29wZVtwcm9wTmFtZV07XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICByZXR1cm4gZ2xvYmFsU2NvcGVbcHJvcE5hbWVdO1xuICAgIH0sXG4gICAgc2V0OiAoXywgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBkb1NldCA9IChzY29wZSwgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChCYXNlVXRpbHMuaXNUeXBlKHNjb3BlW3Byb3BOYW1lXSwgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICBzY29wZVtwcm9wTmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gZG9TZXQoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gZG9TZXQoZ2xvYmFsU2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgZmFsbGJhY2tDb250ZXh0LiQkID0gcHJveHk7XG5cbiAgcmV0dXJuIHByb3h5O1xufVxuXG5jb25zdCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FID0gL14lP1tcXHcuJF0rJC87XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDcmVhdGUgYSBjb250ZXh0LWF3YXJlIGZ1bmN0aW9uLCBvciBcIm1hY3JvXCIsIHRoYXQgY2FuIGJlIGNhbGxlZCBhbmQgdXNlZCBieSB0aGUgdGVtcGxhdGUgZW5naW5lLlxuICpcbiAqICAgSWYgeW91IGFyZSBldmVyIHRyeWluZyB0byBwYXNzIG1ldGhvZHMgb3IgZHluYW1pYyBwcm9wZXJ0aWVzIGFjcm9zcyB0aGUgRE9NLCB0aGVuIHRoaXMgaXMgdGhlIG1ldGhvZCB5b3Ugd2FudCB0byB1c2UsIHRvXG4gKiAgIHByb3Blcmx5IFwicGFyc2VcIiBhbmQgdXNlIHRoZSBhdHRyaWJ1dGUgdmFsdWUgYXMgaW50ZW5kZWQuXG4gKlxuICogICBUaGlzIGlzIHVzZWQgZm9yIGV4YW1wbGUgZm9yIGV2ZW50IGJpbmRpbmdzIHZpYSBhdHRyaWJ1dGVzLiBJZiB5b3UgaGF2ZSBmb3IgZXhhbXBsZSBhbiBgb25jbGljaz1cImRvU29tZXRoaW5nXCJgXG4gKiAgIGF0dHJpYnV0ZSBvbiBhbiBlbGVtZW50LCB0aGVuIHRoaXMgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIGNvbnRleHQtYXdhcmUgXCJtYWNyb1wiIGZvciB0aGUgbWV0aG9kIFwiZG9Tb21ldGhpbmdcIi5cbiAqXG4gKiAgIFRoZSB0ZXJtIFwibWFjcm9cIiBpcyB1c2VkIGhlcmUgYmVjYXVzZSB0aGVyZSBhcmUgc3BlY2lhbCBmb3JtYXRzIFwidW5kZXJzdG9vZFwiIGJ5IHRoZSB0ZW1wbGF0ZSBlbmdpbmUuIEZvciBleGFtcGxlLFxuICogICBwcmVmaXhpbmcgYW4gYXR0cmlidXRlIHZhbHVlIHdpdGggYSBwZXJjZW50IHNpZ24sIGkuZS4gYG5hbWU9XCIlZ2xvYmFsRHluYW1pY1Byb3BOYW1lXCJgIHdpbGwgdXNlIEBzZWUgVXRpbHMuZHluYW1pY1Byb3BJRDtcbiAqICAgdG8gZ2xvYmFsbHkgZmV0Y2ggcHJvcGVydHkgb2YgdGhpcyBuYW1lLiBUaGlzIGlzIGltcG9ydGFudCwgYmVjYXVzZSBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgRE9NLCB5b3UgbWlnaHRcbiAqICAgYmUgcmVxdWVzdGluZyBhIGR5bmFtaWMgcHJvcGVydHkgdGhhdCBoYXNuJ3QgeWV0IGJlZW4gbG9hZGVkL2RlZmluZWQuIFRoaXMgaXMgdGhlIHB1cnBvc2Ugb2YgQHNlZSBVdGlscy5keW5hbWljUHJvcElEOyxcbiAqICAgYW5kIHRoaXMgc3BlY2lhbGl6ZWQgdGVtcGxhdGUgZm9ybWF0OiB0byBwcm92aWRlIGR5bmFtaWMgcHJvcHMgYnkgaWQsIHRoYXQgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiBuZWVkZWQuXG4gKlxuICogICBUaGUgdGVtcGxhdGUgZW5naW5lIGFsc28gd2lsbCBoYXBwaWx5IGFjY2VwdCByb2d1ZSBtZXRob2QgbmFtZXMuIEZvciBleGFtcGxlLCBpbiBhIE15dGhpeCBVSSBjb21wb25lbnQgeW91IGFyZSBidWlsZGluZyxcbiAqICAgeW91IG1pZ2h0IGhhdmUgYW4gZWxlbWVudCBsaWtlIGA8YnV0dG9uIG9uY2xpY2s9XCJvbkJ1dHRvbkNsaWNrXCI+Q2xpY2sgTWUhPGJ1dHRvbj5gLiBUaGUgdGVtcGxhdGluZyBlbmdpbmUgd2lsbCBkZXRlY3QgdGhhdFxuICogICB0aGlzIGlzIE9OTFkgYW4gaWRlbnRpZmllciwgYW5kIHNvIHdpbGwgc2VhcmNoIGZvciB0aGUgc3BlY2lmaWVkIG1ldGhvZCBpbiB0aGUgYXZhaWxhYmxlIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSxcbiAqICAgd2hpY2ggaW5jbHVkZXMgYHRoaXNgIGluc3RhbmNlIG9mIHlvdXIgY29tcG9uZW50IGFzIHRoZSBmaXJzdCBgdGFyZ2V0YC4gVGhpcyBwYXR0ZXJuIGlzIG5vdCByZXF1aXJlZCwgYXMgeW91IGNhbiBjYWxsIHlvdXJcbiAqICAgY29tcG9uZW50IG1ldGhvZCBkaXJlY3RseSB5b3Vyc2VsZiwgYXMgd2l0aCBhbnkgYXR0cmlidXRlIGV2ZW50IGJpbmRpbmcgaW4gdGhlIERPTSwgaS5lOiBgPGJ1dHRvbiBvbmNsaWNrPVwidGhpcy5vbkJ1dHRvbkNsaWNrKGV2ZW50KVwiPkNsaWNrIE1lITxidXR0b24+YC5cbiAqXG4gKiAgIE9uZSBsYXN0IHRoaW5nIHRvIG1lbnRpb24gaXMgdGhhdCB3aGVuIHRoZXNlIFwibWFjcm9cIiBtZXRob2RzIGFyZSBjYWxsZWQgYnkgTXl0aGl4IFVJLCBhbGwgZW51bWVyYWJsZSBrZXlzIG9mIHRoZSBnZW5lcmF0ZWRcbiAqICAgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspIGFyZSBwYXNzZWQgaW50byB0aGUgbWFjcm8gbWV0aG9kIGFzIGFyZ3VtZW50cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBrZXlzL3ZhbHVlcyBvZiBhbGwgc2NvcGUgYHRhcmdldHNgXG4gKiAgIGFyZSBhdmFpbGFibGUgZGlyZWN0bHkgaW4geW91ciBqYXZhc2NyaXB0IHNjb3BlLiBpLmUuIHlvdSBjYW4gZG8gdGhpbmdzIGxpa2UgYG5hbWU9XCJjb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXNBdHRyaWJ1dGUxLCBvdGhlckF0dHJpYnV0ZSlcImAgd2l0aG91dCBuZWVkaW5nIHRvIGRvXG4gKiAgIGBuYW1lPVwidGhpcy5jb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXMudGhpc0F0dHJpYnV0ZTEsIHRoaXMub3RoZXJBdHRyaWJ1dGUpXCJgLiA6d2FybmluZzogSXQgaXMgaW1wb3J0YW50IHRvIGtlZXAgaW4gbWluZCB0aGF0IGRpcmVjdCByZWZlcmVuY2UgYWNjZXNzIGxpa2UgdGhpcyBpbiBhIG1hY3JvXG4gKiAgIHdpbGwgYnlwYXNzIHRoZSBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykgUHJveHksIGFuZCBzbyBpZiB0aGUgc3BlY2lmaWVkIGtleSBpcyBub3QgZm91bmQgKHBhc3NlZCBpbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgbWFjcm8pLCB0aGVuIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duIGJ5IGphdmFzY3JpcHQuXG4gKlxuICogICBJdCBpcyBhYnNvbHV0ZWx5IHBvc3NpYmxlIGZvciB5b3UgdG8gcmVjZWl2ZSBhbmQgc2VuZCBhcmd1bWVudHMgdmlhIHRoZXNlIGdlbmVyYXRlZCBcIm1hY3Jvc1wiLiBgbXl0aGl4LXVpLXNlYXJjaGAgZG9lcyB0aGlzIGZvclxuICogICBleGFtcGxlIHdoZW4gYSBcImZpbHRlclwiIG1ldGhvZCBpcyBwYXNzZWQgdmlhIGFuIGF0dHJpYnV0ZS4gQnkgZGVmYXVsdCBubyBleHRyYSBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIHdoZW4gY2FsbGVkIGRpcmVjdGx5IGJ5IHRoZSB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIEFuIG9iamVjdCB3aXRoIHRoZSBzaGFwZSBgeyBib2R5OiBzdHJpbmc7IHByZWZpeD86IHN0cmluZzsgc2NvcGU6IG9iamVjdDsgfWAuXG4gKlxuICogICAgICAgMS4gYGJvZHlgIGlzIHRoZSBhY3R1YWwgYm9keSBvZiB0aGUgYG5ldyBGdW5jdGlvbmAuXG4gKiAgICAgICAyLiBgc2NvcGVgIGlzIHRoZSBzY29wZSAoYHRoaXNgKSB0aGF0IHlvdSB3YW50IHRvIGJpbmQgdG8gdGhlIHJlc3VsdGluZyBtZXRob2QuXG4gKiAgICAgICAgICBUaGlzIHdvdWxkIGdlbmVyYWxseSBiZSBhIHNjb3BlIGNyZWF0ZWQgYnkgQHNlZSBVdGlscy5jcmVhdGVTY29wZTtcbiAqICAgICAgIDMuIGBwcmVmaXhgIGFuIG9wdGlvbmFsIHByZWZpeCBmb3IgdGhlIGJvZHkgb2YgdGhlIGBuZXcgRnVuY3Rpb25gLiBUaGlzIHByZWZpeCBpcyBhZGRlZFxuICogICAgICAgICAgYmVmb3JlIGFueSBmdW5jdGlvbiBib2R5IGNvZGUgdGhhdCBNeXRoaXggVUkgZ2VuZXJhdGVzLlxuICogICAgICAgICAgU2VlIGhlcmUgQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDsgZm9yIGFuIGV4YW1wbGUgdXNlXG4gKiAgICAgICAgICBvZiBgcHJlZml4YCAobm90aWNlIGhvdyBgYXJndW1lbnRzWzFdYCBpcyB1c2VkIGluc3RlYWQgb2YgYGFyZ3VtZW50c1swXWAsIGFzIGBhcmd1bWVudHNbMF1gIGlzIGFsd2F5cyByZXNlcnZlZFxuICogICAgICAgICAgZm9yIGxvY2FsIHZhcmlhYmxlIG5hbWVzIFwiaW5qZWN0ZWRcIiBmcm9tIHRoZSBjcmVhdGVkIFwic2NvcGVcIikuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEFzaWRlIGZvciBzb21lIGJlaGluZC10aGUtc2NlbmUgbW9kaWZpY2F0aW9ucyBhbmQgZWFzZS1vZi11c2Ugc2xpY2tuZXNzLCB0aGlzIGVzc2VudGlhbGx5IGp1c3QgY3JlYXRlcyBhIGBuZXcgRnVuY3Rpb25gIGFuZCBiaW5kcyBhIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSB0byBpdC5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSBwcm92aWRlZCAoYW5kIG9wdGlvbmFsKSBgcHJlZml4YCBjYW4gYmUgdXNlZCBhcyB0aGUgc3RhcnQgb2YgdGhlIG1hY3JvIGBuZXcgRnVuY3Rpb25gIGJvZHkgY29kZS4gaS5lLiBAc2VlIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudDsgZG9lcyBleGFjdGx5IHRoaXMgdG8gYWxsb3cgZGlyZWN0IHNjb3BlZFxuICogICAgIGFjY2VzcyB0byB0aGUgYGV2ZW50YCBpbnN0YW5jZS4gQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDtcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSByZXR1cm4gbWV0aG9kIGlzIGJvdW5kIGJ5IGNhbGxpbmcgYC5iaW5kKHNjb3BlKWAuIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBtb2RpZnkgYHRoaXNgIGF0IHRoZSBjYWxsLXNpdGUuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGZ1bmN0aW9uOyBBIGZ1bmN0aW9uIHRoYXQgaXMgXCJjb250ZXh0IGF3YXJlXCIgYnkgYmVpbmcgYm91bmQgdG8gdGhlIHByb3ZpZGVkIGBzY29wZWAgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4LCBib2R5LCBzY29wZSB9KSB7XG4gIGxldCBmdW5jdGlvbkJvZHkgPSBib2R5O1xuICBpZiAoZnVuY3Rpb25Cb2R5LmNoYXJBdCgwKSA9PT0gJyUnIHx8IEVWRU5UX0FDVElPTl9KVVNUX05BTUUudGVzdChmdW5jdGlvbkJvZHkpKSB7XG4gICAgaWYgKGZ1bmN0aW9uQm9keS5jaGFyQXQoMCkgPT09ICclJykge1xuICAgICAgZnVuY3Rpb25Cb2R5ID0gYCh0aGlzLmR5bmFtaWNQcm9wSUQgfHwgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5keW5hbWljUHJvcElEKSgnJHtmdW5jdGlvbkJvZHkuc3Vic3RyaW5nKDEpLnRyaW0oKS5yZXBsYWNlKC8nL2csICdcXFxcXFwnJyl9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgX19fXyQgPSAke2Z1bmN0aW9uQm9keX07XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgX19fXyQgPT09ICdmdW5jdGlvbicpID8gX19fXyQuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKSA6IF9fX18kO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJHtmdW5jdGlvbkJvZHkucmVwbGFjZSgvXlxccyp0aGlzXFwuLywgJycpfS5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICB9KSgpO2A7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldENvbnRleHRDYWxsQXJncyhzY29wZSwgeyAnX19tYWNyb1NvdXJjZSc6IG51bGwsICdfX2V4cGFuZGVkTWFjcm9Tb3VyY2UnOiBudWxsIH0pO1xuXG4gIGZ1bmN0aW9uQm9keSA9IGB0cnkgeyAkeyhwcmVmaXgpID8gYCR7cHJlZml4fTtgIDogJyd9cmV0dXJuICR7KGZ1bmN0aW9uQm9keSB8fCAnKHZvaWQgMCknKS5yZXBsYWNlKC9eXFxzKnJldHVyblxccysvLCAnJykudHJpbSgpfTsgfSBjYXRjaCAoZXJyb3IpIHsgY29uc29sZS5lcnJvcihcXGBFcnJvciBpbiBtYWNybyBbXFwke19fbWFjcm9Tb3VyY2V9XTpcXGAsIGVycm9yLCBfX2V4cGFuZGVkTWFjcm9Tb3VyY2UpOyB0aHJvdyBlcnJvcjsgfWA7XG5cbiAgbGV0IGxvY2FsU2NvcGUgPSBPYmplY3QuY3JlYXRlKHNjb3BlKTtcbiAgbG9jYWxTY29wZS5fX21hY3JvU291cmNlID0gYm9keTtcbiAgbG9jYWxTY29wZS5fX2V4cGFuZGVkTWFjcm9Tb3VyY2UgPSBmdW5jdGlvbkJvZHk7XG5cbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKHNjb3BlIHx8IHt9LCBzY29wZSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBQYXJzZSBhIHRlbXBsYXRlLCBhbmQgcmV0dXJuIGl0cyBwYXJ0cy4gQSB0ZW1wbGF0ZSBcInBhcnRcIiBpcyBvbmUgb2YgdHdvIHR5cGVzOiBgJ2xpdGVyYWwnYCwgb3IgYCdtYWNybydgLlxuICpcbiAqICAgVGFrZSBmb3IgZXhhbXBsZSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOiBgJ0hlbGxvIFxcQEBncmVldGluZ0BAISEhJ2AuIFRoaXMgdGVtcGxhdGUgd291bGQgcmVzdWx0IGluIHRocmVlIFwicGFydHNcIiBhZnRlciBwYXJzaW5nOlxuICogICAxLiBgeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZTogJ0hlbGxvICcsIHN0YXJ0OiAwLCBlbmQ6IDYgfWBcbiAqICAgMi4gYHsgdHlwZTogJ21hY3JvJywgc291cmNlOiAnXFxAQGdyZWV0aW5nQEAnLCBtYWNybzogPGZ1bmN0aW9uPiwgc3RhcnQ6IDYsIGVuZDogMTggfWBcbiAqICAgMy4gYHsgdHlwZTogJ2xpdGVyYWwnLCBzb3VyY2U6ICchISEnLCBzdGFydDogMTgsIGVuZDogMjEgfWBcbiAqXG4gKiAgIENvbmNhdGVuYXRpbmcgYWxsIGBzb3VyY2VgIHByb3BlcnRpZXMgdG9nZXRoZXIgd2lsbCByZXN1bHQgaW4gdGhlIG9yaWdpbmFsIGlucHV0LlxuICogICBDb25jYXRlbmF0aW5nIGFsbCBgc291cmNlYCBwcm9wZXJ0aWVzLCBhbG9uZyB3aXRoIHRoZSByZXN1bHQgb2YgY2FsbGluZyBhbGwgYG1hY3JvYCBmdW5jdGlvbnMsIHdpbGwgcmVzdWx0IGluIHRoZSBvdXRwdXQgKGkuZS4gYHBhcnRbMF0uc291cmNlICsgcGFydFsxXS5tYWNybygpICsgcGFydFsyXS5zb3VyY2VgKS5cbiAqICAgVGhlIGBtYWNyb2AgcHJvcGVydHkgaXMgdGhlIGFjdHVhbCBtYWNybyBmdW5jdGlvbiBmb3IgdGhlIHBhcnNlZCB0ZW1wbGF0ZSBwYXJ0IChpLmUuIGluIG91ciBleGFtcGxlIGAnXFxAQGdyZWV0aW5nQEAnYCkuXG4gKiAgIGBzdGFydGAgYW5kIGBlbmRgIGFyZSB0aGUgb2Zmc2V0cyBmcm9tIHRoZSBvcmlnaW5hbCBgdGV4dGAgd2hlcmUgdGhlIHBhcnQgY2FuIGJlIGZvdW5kLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHRleHRcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHRlbXBsYXRlIHN0cmluZyB0byBwYXJzZS5cbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIE9wdGlvbnMgZm9yIHRoZSBvcGVyYXRpb24uIFRoZSBzaGFwZSBvZiB0aGlzIG9iamVjdCBpcyBgeyBwcmVmaXg/OiBzdHJpbmcsIHNjb3BlOiBvYmplY3QgfWAuXG4gKiAgICAgICBgc2NvcGVgIGRlZmluZXMgdGhlIHNjb3BlIGZvciBtYWNyb3MgY3JlYXRlZCBieSB0aGlzIG1ldGhvZCAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KS5cbiAqICAgICAgIGBwcmVmaXhgIGRlZmluZXMgYSBmdW5jdGlvbiBib2R5IHByZWZpeCB0byB1c2Ugd2hpbGUgY3JlYXRpbmcgbWFjcm9zIChzZWUgQHNlZSBVdGlscy5jcmVhdGVUZW1wbGF0ZU1hY3JvOykuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRvIHNraXAgcGFyc2luZyBhIHNwZWNpZmljIHRlbXBsYXRlIHBhcnQsIHByZWZpeCB3aXRoIGEgYmFja3NsYXNoLCBpLmUuIGBcXFxcXFxcXEBAZ3JlZXRpbmdAQGAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIEFycmF5PFRlbXBsYXRlUGFydD47ICoqVGVtcGxhdGVQYXJ0Kio6IGB7IHR5cGU6ICdsaXRlcmFsJyB8ICdtYWNybycsIHNvdXJjZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgbWFjcm8/OiBmdW5jdGlvbiB9YC4gUmV0dXJuIGFsbCBwYXJzZWQgcGFydHMgb2YgdGhlIHRlbXBsYXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBwYXJ0cyAgICAgICAgID0gW107XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcblxuICBjb25zdCBhZGRMaXRlcmFsID0gKHN0YXJ0T2Zmc2V0LCBlbmRPZmZzZXQpID0+IHtcbiAgICBsZXQgc291cmNlID0gdGV4dC5zdWJzdHJpbmcoc3RhcnRPZmZzZXQsIGVuZE9mZnNldCkucmVwbGFjZSgvXFxcXEBAL2csICdAQCcpO1xuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZSwgc3RhcnQ6IHN0YXJ0T2Zmc2V0LCBlbmQ6IGVuZE9mZnNldCB9KTtcbiAgfTtcblxuICB0ZXh0LnJlcGxhY2UoLyg/PCFcXFxcKShAQCkoLis/KVxcMS9nLCAobSwgXywgcGFyc2VkVGV4dCwgb2Zmc2V0KSA9PiB7XG4gICAgaWYgKGN1cnJlbnRPZmZzZXQgPCBvZmZzZXQpXG4gICAgICBhZGRMaXRlcmFsKGN1cnJlbnRPZmZzZXQsIG9mZnNldCk7XG5cbiAgICBjdXJyZW50T2Zmc2V0ID0gb2Zmc2V0ICsgbS5sZW5ndGg7XG5cbiAgICBsZXQgbWFjcm8gPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgLi4ub3B0aW9ucywgYm9keTogcGFyc2VkVGV4dCB9KTtcbiAgICBwYXJ0cy5wdXNoKHsgdHlwZTogJ21hY3JvJywgc291cmNlOiBtLCBtYWNybywgc3RhcnQ6IG9mZnNldCwgZW5kOiBjdXJyZW50T2Zmc2V0IH0pO1xuICB9KTtcblxuICBpZiAoY3VycmVudE9mZnNldCA8IHRleHQubGVuZ3RoKVxuICAgIGFkZExpdGVyYWwoY3VycmVudE9mZnNldCwgdGV4dC5sZW5ndGgpO1xuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuY29uc3QgTk9PUCA9IChpdGVtKSA9PiBpdGVtO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29tcGlsZSB0aGUgdGVtcGxhdGUgcGFydHMgdGhhdCB3ZXJlIHBhcnNlZCBieSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0czsuXG4gKlxuICogICBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHByb3ZpZGUgdGhpcyBtZXRob2QgYW4gYXJyYXkgb2YgQHNlZSBFbGVtZW50cy5FbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLFxuICogICBvciBAc2VlIFF1ZXJ5RW5naW5lLlF1ZXJ5RW5naW5lOyBpbnN0YW5jZXMgKHRoYXQgY29udGFpbiBAc2VlIEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMpLlxuICogICBJZiBlaXRoZXIgb2YgdGhlc2UgdHlwZXMgYXJlIGZvdW5kIGluIHRoZSBpbnB1dCBhcnJheSAoZXZlbiBvbmUpLCB0aGVuIHRoZSBlbnRpcmUgcmVzdWx0IGlzIHJldHVybmVkXG4gKiAgIGFzIGEgcmF3IGFycmF5LlxuICpcbiAqICAgT3IsIGlmIGFueSBvZiB0aGUgcmVzdWx0aW5nIHBhcnRzIGlzICoqbm90KiogYSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0cz9jYXB0aW9uPVRlbXBsYXRlUGFydDsgb3IgYSBgc3RyaW5nYCxcbiAqICAgdGhlbiByZXR1cm4gdGhlIHJlc3VsdGluZyB2YWx1ZSByYXcuXG4gKlxuICogICBPdGhlcndpc2UsIGlmIGFsbCByZXN1bHRpbmcgcGFydHMgYXJlIGEgYHN0cmluZ2AsIHRoZW4gdGhlIHJlc3VsdGluZyBwYXJ0cyBhcmUgam9pbmVkLCBhbmQgYSBgc3RyaW5nYCBpcyByZXR1cm5lZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBwYXJ0c1xuICogICAgIGRhdGFUeXBlczpcbiAqICAgICAgIC0gQXJyYXk8VGVtcGxhdGVQYXJ0PlxuICogICAgICAgLSBBcnJheTxFbGVtZW50RGVmaW5pdGlvbj5cbiAqICAgICAgIC0gQXJyYXk8UXVlcnlFbmdpbmU+XG4gKiAgICAgICAtIEFycmF5PGFueT5cbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgdGVtcGxhdGUgcGFydHMgdG8gY29tcGlsZSB0b2dldGhlci5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgQXJyYXk8YW55PjsgQHR5cGVzIHN0cmluZzsgUmV0dXJuIHRoZSByZXN1bHQgYXMgYSBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIHJhdyB2YWx1ZXMsIG9yIGEgcmF3IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHBhcnRzLCBjYWxsYmFjaykge1xuICBsZXQgcmVzdWx0ID0gcGFydHNcbiAgICAubWFwKChwYXJ0KSA9PiB7XG4gICAgICBpZiAoIXBhcnQpXG4gICAgICAgIHJldHVybiBwYXJ0O1xuXG4gICAgICBpZiAocGFydFtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFIHx8IHBhcnRbTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICAgICAgcmV0dXJuIHBhcnQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwYXJ0LnR5cGUgPT09ICdsaXRlcmFsJylcbiAgICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICAgIGVsc2UgaWYgKHBhcnQudHlwZSA9PT0gJ21hY3JvJylcbiAgICAgICAgICByZXR1cm4gcGFydC5tYWNybygpO1xuXG4gICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICB9XG4gICAgfSlcbiAgICAubWFwKGNhbGxiYWNrIHx8IE5PT1ApXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gKGl0ZW0gIT0gbnVsbCAmJiBpdGVtICE9PSAnJykpO1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gKGl0ZW1bTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSB8fCBpdGVtW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpKSlcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gQmFzZVV0aWxzLmlzVHlwZShpdGVtLCAnOjpTdHJpbmcnKSkpXG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcblxuICByZXR1cm4gKHJlc3VsdC5sZW5ndGggPCAyKSA/IHJlc3VsdFswXSA6IHJlc3VsdDtcbn1cblxuY29uc3QgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTID0gWyAzLCAyIF07IC8vIFRFWFRfTk9ERSwgQVRUUklCVVRFX05PREVcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdpdmVuIGEgTm9kZSwgdGFrZSB0aGUgYC5ub2RlVmFsdWVgIG9mIHRoYXQgbm9kZSwgYW5kIGlmIGl0IGlzIGEgdGVtcGxhdGUsXG4gKiAgIHBhcnNlIHRoYXQgdGVtcGxhdGUgdXNpbmcgQHNlZSBVdGlscy5wYXJzZVRlbXBsYXRlUGFydHM7LCBhbmQgdGhlblxuICogICBjb21waWxlIHRoYXQgdGVtcGxhdGUgdXNpbmcgQHNlZSBVdGlscy5jb21waWxlVGVtcGxhdGVGcm9tUGFydHM7LiBUaGVcbiAqICAgcmVzdWx0aW5nIHRlbXBsYXRlIHBhcnRzIGFyZSB0aGVuIHNjYW5uZWQuIElmIGFueSBvZiB0aGUgYG1hY3JvKClgIGNhbGxzXG4gKiAgIHJlc3VsdCBpbiBhIEBzZWUgRHluYW1pY1Byb3BlcnR5P2NhcHRpb249RHluYW1pY1Byb3BlcnR5OywgdGhlbiBzZXQgdXBcbiAqICAgbGlzdGVuZXJzIHZpYSBgYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgLi4uKWAgb24gZWFjaCB0byBsaXN0ZW4gZm9yXG4gKiAgIGNoYW5nZXMgdG8gZHluYW1pYyBwcm9wZXJ0aWVzLiBXaGVuIGEgbGlzdGVuZXIgdXBkYXRlcywgdGhlIHRlbXBsYXRlIHBhcnRzXG4gKiAgIGFyZSByZWNvbXBpbGVkLCBhbmQgdGhlIGAubm9kZVZhbHVlYCBpcyBzZXQgYWdhaW4gd2l0aCB0aGUgbmV3IHJlc3VsdC5cbiAqXG4gKiAgIEluIHNob3J0LCB0aGlzIG1ldGhvZCBmb3JtYXRzIHRoZSB2YWx1ZSBvZiBhIE5vZGUgaWYgdGhlIHZhbHVlIGlzIGEgdGVtcGxhdGUsXG4gKiAgIGFuZCBpbiBkb2luZyBzbyBiaW5kcyB0byBkeW5hbWljIHByb3BlcnRpZXMgZm9yIGZ1dHVyZSB1cGRhdGVzIHRvIHRoaXMgbm9kZS5cbiAqXG4gKiAgIElmIHRoZSBgLm5vZGVWYWx1ZWAgb2YgdGhlIE5vZGUgaXMgZGV0ZWN0ZWQgdG8gKipub3QqKiBiZSBhIHRlbXBsYXRlLCB0aGVuXG4gKiAgIHRoZSByZXN1bHQgaXMgYSBuby1vcGVyYXRpb24sIGFuZCB0aGUgcmF3IHZhbHVlIG9mIHRoZSBOb2RlIGlzIHNpbXBseSByZXR1cm5lZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBub2RlXG4gKiAgICAgZGF0YVR5cGU6IE5vZGVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgTm9kZSB3aG9zZSB2YWx1ZSBzaG91bGQgYmUgZm9ybWF0dGVkLiBUaGlzIG11c3QgYmUgYSBURVhUX05PREUgb3IgYSBBVFRSSUJVVEVfTk9ERS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgcmVzdWx0aW5nIG5vZGUgdmFsdWUuIElmIGEgdGVtcGxhdGUgd2FzIHN1Y2Nlc3NmdWxseSBjb21waWxlZCwgZHluYW1pYyBwcm9wZXJ0aWVzXG4gKiAgIGFyZSBhbHNvIGxpc3RlbmVkIHRvIGZvciBmdXR1cmUgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE5vZGVWYWx1ZShub2RlLCBfb3B0aW9ucykge1xuICBpZiAobm9kZS5wYXJlbnROb2RlICYmICgvXihzdHlsZXxzY3JpcHQpJC8pLnRlc3Qobm9kZS5wYXJlbnROb2RlLmxvY2FsTmFtZSkpXG4gICAgcmV0dXJuIG5vZGUubm9kZVZhbHVlO1xuXG4gIGlmICghbm9kZSB8fCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJmb3JtYXROb2RlVmFsdWVcIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB0ZXh0ICAgICAgICAgID0gbm9kZS5ub2RlVmFsdWU7XG4gIGxldCB0ZW1wbGF0ZVBhcnRzID0gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIG9wdGlvbnMpO1xuXG4gIC8vIHRlbXBsYXRlUGFydHMuZm9yRWFjaCgoeyB0eXBlLCBtYWNybyB9KSA9PiB7XG4gIC8vICAgaWYgKHR5cGUgIT09ICdtYWNybycpXG4gIC8vICAgICByZXR1cm47XG5cbiAgLy8gICBsZXQgcmVzdWx0ID0gbWFjcm8oKTtcbiAgLy8gICBpZiAob3B0aW9ucy5iaW5kVG9EeW5hbWljUHJvcGVydGllcyAhPT0gZmFsc2UgJiYgaXNUeXBlKHJlc3VsdCwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAvLyAgICAgcmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsICgpID0+IHtcbiAgLy8gICAgICAgbGV0IHJlc3VsdCA9ICgnJyArIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKSk7XG4gIC8vICAgICAgIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKVxuICAvLyAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcmVzdWx0O1xuICAvLyAgICAgfSwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAvLyAgIH1cbiAgLy8gfSk7XG5cbiAgbGV0IHJlc3VsdCA9IGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzLCAocmVzdWx0KSA9PiB7XG4gICAgaWYgKHJlc3VsdCAmJiBvcHRpb25zLmJpbmRUb0R5bmFtaWNQcm9wZXJ0aWVzICE9PSBmYWxzZSAmJiBCYXNlVXRpbHMuaXNUeXBlKHJlc3VsdCwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAgICAgcmVzdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICgnJyArIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKSk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKVxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcmVzdWx0O1xuICAgICAgfSwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xuXG4gIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICByZXN1bHQgPSAnJztcblxuICByZXR1cm4gKG9wdGlvbnMuZGlzYWxsb3dIVE1MID09PSB0cnVlKSA/ICgnJyArIHJlc3VsdCkgOiByZXN1bHQ7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gLyg/PCFcXFxcKUBALztcbmV4cG9ydCBmdW5jdGlvbiBpc1RlbXBsYXRlKHZhbHVlKSB7XG4gIGlmICghQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBJU19URU1QTEFURS50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9ICghZWxlbWVudC50YWdOYW1lKSA/IGVsZW1lbnQgOiBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgbGV0IGNhY2hlICAgPSBFVkVOVF9OQU1FX0NBQ0hFLmdldCh0YWdOYW1lKTtcbiAgaWYgKGNhY2hlKVxuICAgIHJldHVybiBjYWNoZTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEUuc2V0KHRhZ05hbWUsIGV2ZW50TmFtZXMpO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoQmFzZVV0aWxzLmlzUGxhaW5PYmplY3QoX2NhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrICA9IF9jYWxsYmFjay5jYWxsYmFjaztcbiAgICBvcHRpb25zICAgPSBfY2FsbGJhY2sub3B0aW9ucyB8fCB7fTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfVxuXG4gIGlmIChCYXNlVXRpbHMuaXNUeXBlKGNhbGxiYWNrLCAnOjpTdHJpbmcnKSlcbiAgICBjYWxsYmFjayA9IGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyBwcmVmaXg6ICdsZXQgZXZlbnQ9YXJndW1lbnRzWzFdJywgYm9keTogY2FsbGJhY2ssIHNjb3BlOiB0aGlzIH0pOyAvLyBAcmVmOl9jcmVhdGVUZW1wbGF0ZU1hY3JvUHJlZml4Rm9yQmluZEV2ZW50VG9FbGVtZW50XG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7IGNhbGxiYWNrLCBvcHRpb25zIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFBhdGgob2JqLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAob2JqID09IG51bGwgfHwgT2JqZWN0LmlzKG9iaiwgTmFOKSB8fCBPYmplY3QuaXMob2JqLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKG9iaiwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGlmIChrZXkgPT0gbnVsbCB8fCBPYmplY3QuaXMoa2V5LCBOYU4pIHx8IE9iamVjdC5pcyhrZXksIEluZmluaXR5KSB8fCBPYmplY3QuaXMoa2V5LCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgbGV0IHBhcnRzICAgICAgICAgPSBrZXkuc3BsaXQoLyg/PCFcXFxcKVxcLi9nKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBjdXJyZW50VmFsdWUgID0gb2JqO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xuICAgIGxldCBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWVbcGFydF07XG4gICAgaWYgKG5leHRWYWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGN1cnJlbnRWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChnbG9iYWxUaGlzLk5vZGUgJiYgY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSBpbnN0YW5jZW9mIGdsb2JhbFRoaXMuTm9kZSAmJiAoY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpKVxuICAgIHJldHVybiBjdXJyZW50VmFsdWUubm9kZVZhbHVlO1xuXG4gIHJldHVybiAoY3VycmVudFZhbHVlID09IG51bGwpID8gZGVmYXVsdFZhbHVlIDogY3VycmVudFZhbHVlO1xufVxuXG5jb25zdCBDQUNIRURfUFJPUEVSVFlfTkFNRVMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgU0tJUF9QUk9UT1RZUEVTICAgICAgID0gW1xuICBnbG9iYWxUaGlzLkhUTUxFbGVtZW50LFxuICBnbG9iYWxUaGlzLk5vZGUsXG4gIGdsb2JhbFRoaXMuRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5PYmplY3QsXG4gIGdsb2JhbFRoaXMuQXJyYXksXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvcGVydHlOYW1lcyhfb2JqKSB7XG4gIGlmICghQmFzZVV0aWxzLmlzQ29sbGVjdGFibGUoX29iaikpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGxldCBjYWNoZWROYW1lcyA9IENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5nZXQoX29iaik7XG4gIGlmIChjYWNoZWROYW1lcylcbiAgICByZXR1cm4gY2FjaGVkTmFtZXM7XG5cbiAgbGV0IG9iaiAgID0gX29iajtcbiAgbGV0IG5hbWVzID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChvYmopIHtcbiAgICBsZXQgb2JqTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG9iak5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgICBuYW1lcy5hZGQob2JqTmFtZXNbaV0pO1xuXG4gICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKG9iaiAmJiBTS0lQX1BST1RPVFlQRVMuaW5kZXhPZihvYmouY29uc3RydWN0b3IpID49IDApXG4gICAgICBicmVhaztcbiAgfVxuXG4gIGxldCBmaW5hbE5hbWVzID0gQXJyYXkuZnJvbShuYW1lcyk7XG4gIENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5zZXQoX29iaiwgZmluYWxOYW1lcyk7XG5cbiAgcmV0dXJuIGZpbmFsTmFtZXM7XG59XG5cbmNvbnN0IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRSA9IG5ldyBXZWFrTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aChrZXlQYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgbGV0IGluc3RhbmNlQ2FjaGUgPSBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuZ2V0KHRoaXMpO1xuICBpZiAoIWluc3RhbmNlQ2FjaGUpIHtcbiAgICBpbnN0YW5jZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgIExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5zZXQodGhpcywgaW5zdGFuY2VDYWNoZSk7XG4gIH1cblxuICBsZXQgcHJvcGVydHkgPSBpbnN0YW5jZUNhY2hlLmdldChrZXlQYXRoKTtcbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIHByb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuICAgIGluc3RhbmNlQ2FjaGUuc2V0KGtleVBhdGgsIHByb3BlcnR5KTtcbiAgfVxuXG4gIHJldHVybiBwcm9wZXJ0eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwZWNpYWxDbG9zZXN0KG5vZGUsIHNlbGVjdG9yKSB7XG4gIGlmICghbm9kZSB8fCAhc2VsZWN0b3IpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gIHdoaWxlIChjdXJyZW50Tm9kZSAmJiAodHlwZW9mIGN1cnJlbnROb2RlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicgfHwgIWN1cnJlbnROb2RlLm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoY3VycmVudE5vZGUpO1xuXG4gIHJldHVybiBjdXJyZW50Tm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMgfHwgMCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY1Byb3AobmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIpIHtcbiAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoZGVmYXVsdFZhbHVlKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgW25hbWVdOiB7XG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6ICAgICAgICAgICgpID0+IGR5bmFtaWNQcm9wZXJ0eSxcbiAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShzZXR0ZXIobmV3VmFsdWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBkeW5hbWljUHJvcGVydHk7XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUF9SRUdJU1RSWSA9IG5ldyBNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljUHJvcElEKGlkLCBzZXRWYWx1ZSkge1xuICBsZXQgcHJvcCA9IERZTkFNSUNfUFJPUF9SRUdJU1RSWS5nZXQoaWQpO1xuICBpZiAocHJvcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcbiAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0oc2V0VmFsdWUpO1xuXG4gICAgcmV0dXJuIHByb3A7XG4gIH1cblxuICBwcm9wID0gbmV3IER5bmFtaWNQcm9wZXJ0eSgoYXJndW1lbnRzLmxlbmd0aCA+IDEpID8gc2V0VmFsdWUgOiAnJyk7XG4gIERZTkFNSUNfUFJPUF9SRUdJU1RSWS5zZXQoaWQsIHByb3ApO1xuXG4gIHJldHVybiBwcm9wO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmVOYW1lVmFsdWVQYWlySGVscGVyKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgbWV0YWRhdGEoXG4gICAgdGFyZ2V0LFxuICAgIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLFxuICAgIFsgbmFtZSwgdmFsdWUgXSxcbiAgKTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTID0gbmV3IFNldChbICdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0nLCAnbXl0aGl4LWZvci1lYWNoJyBdKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUykuam9pbignLCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcihzZWxlY3Rvcikge1xuICBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTLmFkZChzZWxlY3Rvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5kZWxldGUoc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBnbG9iYWxTdG9yZUhlbHBlcihkeW5hbWljLCBhcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm47XG5cbiAgY29uc3Qgc2V0T25HbG9iYWwgPSAobmFtZSwgdmFsdWUpID0+IHtcbiAgICBsZXQgY3VycmVudFZhbHVlID0gZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXTtcbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZShjdXJyZW50VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoQmFzZVV0aWxzLmlzVHlwZSh2YWx1ZSwgRHluYW1pY1Byb3BlcnR5KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gdmFsdWUsXG4gICAgICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHZhbHVlW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgIGxldCBwcm9wID0gZHluYW1pY1Byb3BJRChuYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUsIHtcbiAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHByb3AsXG4gICAgICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG5cbiAgICAgIHJldHVybiBwcm9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBuYW1lVmFsdWVQYWlyID0gKEJhc2VVdGlscy5pc0NvbGxlY3RhYmxlKGFyZ3NbMF0pKSA/IG1ldGFkYXRhKFxuICAgIGFyZ3NbMF0sICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGV4dFxuICAgIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSLCAgLy8gc3BlY2lhbCBrZXlcbiAgKSA6IG51bGw7IC8vIEByZWY6X215dGhpeE5hbWVWYWx1ZVBhaXJIZWxwZXJVc2FnZVxuXG4gIGlmIChuYW1lVmFsdWVQYWlyKSB7XG4gICAgbGV0IFsgbmFtZSwgdmFsdWUgXSA9IG5hbWVWYWx1ZVBhaXI7XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiBCYXNlVXRpbHMuaXNUeXBlKGFyZ3NbMF0sICc6OlN0cmluZycpKSB7XG4gICAgbGV0IG5hbWUgID0gYXJnc1swXTtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzFdO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzBdO1xuICAgIGxldCBuYW1lICA9ICh0eXBlb2YgdGhpcy5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSA/IHRoaXMuZ2V0SWRlbnRpZmllcigpIDogKHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIGlmICghbmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJteXRoaXhVSS5nbG9iYWxTdG9yZVwiOiBcIm5hbWVcIiBpcyB1bmtub3duLCBzbyB1bmFibGUgdG8gc3RvcmUgdmFsdWUnKTtcblxuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmUoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCBmYWxzZSwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZUR5bmFtaWMoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCB0cnVlLCBhcmdzKTtcbn1cblxuY2xhc3MgU3RvcmFnZUl0ZW0ge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHRoaXMuX2MgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3YgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92O1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl91ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl92ID0gdmFsdWU7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICR0eXBlOiAgJ1N0b3JhZ2VJdGVtJyxcbiAgICAgIF9jOiAgICAgdGhpcy5fYyxcbiAgICAgIF91OiAgICAgdGhpcy5fdSxcbiAgICAgIF92OiAgICAgdGhpcy5fdixcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIFN0b3JhZ2Uge1xuICBfcmV2aXZlKGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUoZGF0YSkpXG4gICAgICByZXR1cm4gZGF0YTtcblxuICAgIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBfYWxyZWFkeVZpc2l0ZWQgfHwgbmV3IFNldCgpO1xuICAgIGxldCB0eXBlICAgICAgICAgICAgPSAoZGF0YSAmJiBkYXRhLiR0eXBlKTtcblxuICAgIGlmICh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ1N0b3JhZ2VJdGVtJykge1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLl92O1xuXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBTdG9yYWdlSXRlbSgpLCB7XG4gICAgICAgICAgX2M6IGRhdGEuX2MsXG4gICAgICAgICAgX3U6IGRhdGEuX3UsXG4gICAgICAgICAgX3Y6ICh2YWx1ZSAmJiAhQmFzZVV0aWxzLmlzUHJpbWl0aXZlKHZhbHVlKSkgPyB0aGlzLl9yZXZpdmUodmFsdWUsIGFscmVhZHlWaXNpdGVkKSA6IHZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgaWYgKCF2YWx1ZSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgZGF0YVtrZXldID0gdGhpcy5fcmV2aXZlKHZhbHVlLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfcmF3KGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUoZGF0YSkpXG4gICAgICByZXR1cm4gZGF0YTtcblxuICAgIGxldCBhbHJlYWR5VmlzaXRlZCA9IF9hbHJlYWR5VmlzaXRlZCB8fCBuZXcgU2V0KCk7XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBTdG9yYWdlSXRlbSlcbiAgICAgIHJldHVybiB0aGlzLl9yYXcoZGF0YS5nZXRWYWx1ZSgpLCBhbHJlYWR5VmlzaXRlZCk7XG5cbiAgICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xuICAgICAgaWYgKCF2YWx1ZSB8fCBCYXNlVXRpbHMuaXNQcmltaXRpdmUodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgZGF0YVtrZXldID0gdGhpcy5fcmF3KHZhbHVlLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfZ2V0UGFydHNGb3JPcGVyYXRpb24odHlwZSwgcGFydHMpIHtcbiAgICBsZXQgcGF0aFBhcnRzICAgPSAodHlwZSA9PT0gJ3NldCcpID8gcGFydHMuc2xpY2UoMCwgLTEpIDogcGFydHMuc2xpY2UoKTtcbiAgICBsZXQgcGF0aCAgICAgICAgPSBwYXRoUGFydHMubWFwKChwYXJ0KSA9PiAoKHR5cGVvZiBwYXJ0ID09PSAnc3ltYm9sJykgPyBwYXJ0LnRvU3RyaW5nKCkgOiAoJycgKyBwYXJ0KSkucmVwbGFjZSgvXFwuL2csICdcXFxcLicpKS5qb2luKCcuJyk7XG4gICAgbGV0IHBhcnNlZFBhcnRzID0gcGF0aC5zcGxpdCgvKD88IVxcXFwpXFwuL2cpO1xuICAgIGxldCBzdG9yYWdlVHlwZSA9IHBhcnNlZFBhcnRzWzBdO1xuICAgIGxldCBkYXRhICAgICAgICA9ICh0eXBlID09PSAnc2V0JykgPyBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIC8vIGxvY2FsU3RvcmFnZSwgb3Igc2Vzc2lvblN0b3JhZ2VcbiAgICBsZXQgc3RvcmFnZUVuZ2luZSA9IGdsb2JhbFRoaXNbc3RvcmFnZVR5cGVdO1xuICAgIGlmICghc3RvcmFnZUVuZ2luZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCByb290RGF0YSAgICA9IHt9O1xuICAgIGxldCBlbmNvZGVkQmFzZSA9IHN0b3JhZ2VFbmdpbmUuZ2V0SXRlbSgnbXl0aGl4LXVpJyk7XG4gICAgaWYgKGVuY29kZWRCYXNlKVxuICAgICAgcm9vdERhdGEgPSB0aGlzLl9yZXZpdmUoSlNPTi5wYXJzZShlbmNvZGVkQmFzZSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhQYXJ0cyxcbiAgICAgIHBhdGgsXG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHN0b3JhZ2VUeXBlLFxuICAgICAgZGF0YSxcbiAgICAgIHN0b3JhZ2VFbmdpbmUsXG4gICAgICBlbmNvZGVkQmFzZSxcbiAgICAgIHJvb3REYXRhLFxuICAgIH07XG4gIH1cblxuICBfZ2V0TWV0YSh0eXBlLCBwYXJ0cykge1xuICAgIGxldCBvcGVyYXRpb24gPSB0aGlzLl9nZXRQYXJ0c0Zvck9wZXJhdGlvbih0eXBlLCBwYXJ0cyk7XG4gICAgbGV0IHtcbiAgICAgIHBhcnNlZFBhcnRzLFxuICAgICAgcm9vdERhdGEsXG4gICAgfSA9IG9wZXJhdGlvbjtcblxuICAgIGxldCBzY29wZSAgICAgICAgPSByb290RGF0YTtcbiAgICBsZXQgcGFyZW50U2NvcGUgID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAxLCBpbCA9IHBhcnNlZFBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGlmIChzY29wZSBpbnN0YW5jZW9mIFN0b3JhZ2VJdGVtKSB7XG4gICAgICAgIHNjb3BlID0gc2NvcGUuZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IHBhcnQgPSBwYXJzZWRQYXJ0c1tpXTtcbiAgICAgIGxldCBzdWJTY29wZSA9IChzY29wZSkgPyBzY29wZVtwYXJ0XSA6IHNjb3BlO1xuICAgICAgaWYgKHR5cGUgPT09ICdzZXQnICYmICFzdWJTY29wZSlcbiAgICAgICAgc3ViU2NvcGUgPSBzY29wZVtwYXJ0XSA9IHt9O1xuXG4gICAgICBpZiAoc3ViU2NvcGUgPT0gbnVsbCB8fCBPYmplY3QuaXMoc3ViU2NvcGUsIE5hTikgfHwgT2JqZWN0LmlzKHN1YlNjb3BlLCAtSW5maW5pdHkpIHx8IE9iamVjdC5pcyhzdWJTY29wZSwgSW5maW5pdHkpKVxuICAgICAgICBicmVhaztcblxuICAgICAgcGFyZW50U2NvcGUgPSBzY29wZTtcbiAgICAgIHNjb3BlID0gc3ViU2NvcGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9wZXJhdGlvbixcbiAgICAgIHBhcmVudFNjb3BlLFxuICAgICAgc2NvcGUsXG4gICAgfTtcbiAgfVxuXG4gIGdldE1ldGEoLi4ucGFydHMpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0TWV0YSgnZ2V0JywgcGFydHMpO1xuICB9XG5cbiAgZ2V0KC4uLnBhcnRzKSB7XG4gICAgbGV0IHsgc2NvcGUgfSA9IHRoaXMuX2dldE1ldGEoJ2dldCcsIHBhcnRzKTtcbiAgICByZXR1cm4gdGhpcy5fcmF3KHNjb3BlKTtcbiAgfVxuXG4gIHNldCguLi5wYXJ0cykge1xuICAgIGxldCB7XG4gICAgICBvcGVyYXRpb24sXG4gICAgICBwYXJlbnRTY29wZSxcbiAgICAgIHNjb3BlLFxuICAgIH0gPSB0aGlzLl9nZXRNZXRhKCdzZXQnLCBwYXJ0cyk7XG5cbiAgICBsZXQge1xuICAgICAgZGF0YSxcbiAgICAgIHBhcnNlZFBhcnRzLFxuICAgICAgcGF0aCxcbiAgICAgIHJvb3REYXRhLFxuICAgICAgc3RvcmFnZUVuZ2luZSxcbiAgICB9ID0gb3BlcmF0aW9uO1xuXG4gICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gRGVsZXRlXG4gICAgICBpZiAocGFyZW50U2NvcGUpXG4gICAgICAgIGRlbGV0ZSBwYXJlbnRTY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV07XG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZSBzY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXJlbnRTY29wZSlcbiAgICAgICAgcGFyZW50U2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dID0gbmV3IFN0b3JhZ2VJdGVtKGRhdGEpO1xuICAgICAgZWxzZVxuICAgICAgICBzY29wZVtwYXJzZWRQYXJ0c1twYXJzZWRQYXJ0cy5sZW5ndGggLSAxXV0gPSBuZXcgU3RvcmFnZUl0ZW0oZGF0YSk7XG4gICAgfVxuXG4gICAgc3RvcmFnZUVuZ2luZS5zZXRJdGVtKCdteXRoaXgtdWknLCBKU09OLnN0cmluZ2lmeShyb290RGF0YSkpO1xuXG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxufVxuXG5leHBvcnQgY29uc3Qgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS51cmwpXG4gIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUudXJsID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbik7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmV4cG9ydCAqIGFzIEJhc2VVdGlscyBmcm9tICcuL2Jhc2UtdXRpbHMuanMnO1xuZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJy4vZHluYW1pYy1wcm9wZXJ0eS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5leHBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5leHBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXJlcXVpcmUuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktc3Bpbm5lci5qcyc7XG5cbmNvbnN0IE15dGhpeFVJQ29tcG9uZW50ID0gQ29tcG9uZW50cy5NeXRoaXhVSUNvbXBvbmVudDtcblxuZXhwb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIER5bmFtaWNQcm9wZXJ0eSxcbn07XG5cbmxldCBfbXl0aGl4SXNSZWFkeSA9IGZhbHNlO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAnb25teXRoaXhyZWFkeSc6IHtcbiAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICAgICAgICAgICgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2V0OiAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgIGlmIChfbXl0aGl4SXNSZWFkeSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGNhbGxiYWNrKG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdteXRoaXgtcmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLlV0aWxzID0gVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkNvbXBvbmVudHMgPSBDb21wb25lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5FbGVtZW50cyA9IEVsZW1lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZSA9IFV0aWxzLmdsb2JhbFN0b3JlO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZUR5bmFtaWMgPSBVdGlscy5nbG9iYWxTdG9yZUR5bmFtaWM7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiBVdGlscy5keW5hbWljUHJvcElEKGlkKTtcbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxldCBkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzID0gZmFsc2U7XG5cbiAgY29uc3Qgb25Eb2N1bWVudFJlYWR5ID0gKCkgPT4ge1xuICAgIGlmICghZGlkVmlzaWJpbGl0eU9ic2VydmVycykge1xuICAgICAgbGV0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1teXRoaXgtc3JjXScpKTtcbiAgICAgIENvbXBvbmVudHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IGRpc2Nvbm5lY3QsIGVsZW1lbnQsIHdhc1Zpc2libGUgfSkgPT4ge1xuICAgICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJyk7XG4gICAgICAgIGlmICghc3JjKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBDb21wb25lbnRzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgeyBlbGVtZW50cyB9KTtcblxuICAgICAgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IHRydWU7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcblxuICAgIGlmIChfbXl0aGl4SXNSZWFkeSlcbiAgICAgIHJldHVybjtcblxuICAgIF9teXRoaXhJc1JlYWR5ID0gdHJ1ZTtcblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAgICckJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciguLi5hcmdzKSxcbiAgICB9LFxuICAgICckJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoLi4uYXJncyksXG4gICAgfSxcbiAgfSk7XG5cbiAgbGV0IGRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiAgPSBtdXRhdGlvbnNbaV07XG4gICAgICBsZXQgdGFyZ2V0ICAgID0gbXV0YXRpb24udGFyZ2V0O1xuXG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0eXBlb2YgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IChhdHRyaWJ1dGVOb2RlKSA/IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlIDogbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5pc1RlbXBsYXRlKG5ld1ZhbHVlKSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZSh0YXJnZXQpLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG5cbiAgICAgICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcyA9IHRhcmdldC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMgJiYgb2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobXV0YXRpb24uYXR0cmlidXRlTmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbCh0YXJnZXQsIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgbGV0IGRpc2FibGVUZW1wbGF0aW5nID0gKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyICYmIHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXSxteXRoaXgtZm9yLWVhY2gnKSk7XG4gICAgICAgIGxldCBhZGRlZE5vZGVzICAgICAgICA9IG11dGF0aW9uLmFkZGVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IGFkZGVkTm9kZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIGxldCBub2RlID0gYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIGlmIChub2RlW0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdICYmIG5vZGUub25NdXRhdGlvbkFkZGVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCFkaXNhYmxlVGVtcGxhdGluZylcbiAgICAgICAgICAgIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlKTtcblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbW92ZWROb2RlcyA9IG11dGF0aW9uLnJlbW92ZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IHJlbW92ZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25SZW1vdmVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5vbk11dGF0aW9uQ2hpbGRSZW1vdmVkKG5vZGUsIG11dGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBzdWJ0cmVlOiAgICAgICAgICAgIHRydWUsXG4gICAgY2hpbGRMaXN0OiAgICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6ICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogIHRydWUsXG4gIH0pO1xuXG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5oZWFkKTtcbiAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzKGRvY3VtZW50LmJvZHkpO1xuXG4gIGNvbnN0IERPQ1VNRU5UX0NIRUNLX1JFQURZX1RJTUUgPSAyNTA7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpXG4gICAgICBvbkRvY3VtZW50UmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25Eb2N1bWVudFJlYWR5KTtcbiAgfSwgRE9DVU1FTlRfQ0hFQ0tfUkVBRFlfVElNRSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkRvY3VtZW50UmVhZHkpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9