/* eslint-disable max-classes-per-file */
/* eslint-disable no-array-constructor */
/* eslint-disable no-magic-numbers */

import * as _TestHelpers from '../support/test-helpers.js';

import {
  BaseUtils,
} from '../../lib/index.js';

describe('Utils', () => {
  describe('isPlainObject', () => {
    it('works', () => {
      class Test {}

      expect(BaseUtils.isPlainObject(undefined)).toBe(false);
      expect(BaseUtils.isPlainObject(null)).toBe(false);
      expect(BaseUtils.isPlainObject(NaN)).toBe(false);
      expect(BaseUtils.isPlainObject(Infinity)).toBe(false);
      expect(BaseUtils.isPlainObject('test')).toBe(false);
      expect(BaseUtils.isPlainObject(new String('test'))).toBe(false);
      expect(BaseUtils.isPlainObject(2.0)).toBe(false);
      expect(BaseUtils.isPlainObject(new Number(2.0))).toBe(false);
      expect(BaseUtils.isPlainObject(true)).toBe(false);
      expect(BaseUtils.isPlainObject(false)).toBe(false);
      expect(BaseUtils.isPlainObject(new Boolean(true))).toBe(false);
      expect(BaseUtils.isPlainObject(BigInt(1))).toBe(false);
      expect(BaseUtils.isPlainObject(new Map())).toBe(false);
      expect(BaseUtils.isPlainObject(new Set())).toBe(false);
      expect(BaseUtils.isPlainObject(new Array())).toBe(false);
      expect(BaseUtils.isPlainObject(new Map())).toBe(false);
      expect(BaseUtils.isPlainObject(new Test())).toBe(false);
      expect(BaseUtils.isPlainObject([])).toBe(false);
      expect(BaseUtils.isPlainObject(new Object())).toBe(true);
      expect(BaseUtils.isPlainObject({})).toBe(true);
      expect(BaseUtils.isPlainObject(Object.create(null))).toBe(true);
    });
  });

  describe('typeOf', () => {
    it('works', () => {
      class Test {}

      expect(BaseUtils.typeOf({})).toBe('::Object');
      expect(BaseUtils.typeOf(undefined)).toBe('');
      expect(BaseUtils.typeOf(null)).toBe('');
      expect(BaseUtils.typeOf(NaN)).toBe('');
      expect(BaseUtils.typeOf(Infinity)).toBe('::Number');
      expect(BaseUtils.typeOf(-Infinity)).toBe('::Number');
      expect(BaseUtils.typeOf('test')).toBe('::String');
      expect(BaseUtils.typeOf(new String('test'))).toBe('::String');
      expect(BaseUtils.typeOf(2.0)).toBe('::Number');
      expect(BaseUtils.typeOf(new Number(2.0))).toBe('::Number');
      expect(BaseUtils.typeOf(true)).toBe('::Boolean');
      expect(BaseUtils.typeOf(false)).toBe('::Boolean');
      expect(BaseUtils.typeOf(new Boolean(true))).toBe('::Boolean');
      expect(BaseUtils.typeOf(new Boolean(false))).toBe('::Boolean');
      expect(BaseUtils.typeOf(1n)).toBe('::BigInt');
      expect(BaseUtils.typeOf(BigInt(1))).toBe('::BigInt');
      expect(BaseUtils.typeOf([])).toBe('::Array');
      expect(BaseUtils.typeOf(new Array())).toBe('::Array');
      expect(BaseUtils.typeOf({})).toBe('::Object');
      expect(BaseUtils.typeOf(Object.create(null))).toBe('::Object');
      expect(BaseUtils.typeOf(new Test())).toBe('Test');
      expect(BaseUtils.typeOf(Test)).toBe('[Class Test]');
      expect(BaseUtils.typeOf(new Map())).toBe('::Map');
      expect(BaseUtils.typeOf(new Set())).toBe('::Set');
      expect(BaseUtils.typeOf(new WeakMap())).toBe('::WeakMap');
      expect(BaseUtils.typeOf(() => {})).toBe('::Function');

      expect(BaseUtils.typeOf(Math)).toBe('::Math');
      expect(BaseUtils.typeOf(JSON)).toBe('::JSON');
      expect(BaseUtils.typeOf(Atomics)).toBe('::Atomics');
      expect(BaseUtils.typeOf(Reflect)).toBe('::Reflect');

      expect(BaseUtils.typeOf(Test)).toBe('[Class Test]');
      expect(BaseUtils.typeOf(AggregateError)).toBe('[Class ::AggregateError]');
      expect(BaseUtils.typeOf(Array)).toBe('[Class ::Array]');
      expect(BaseUtils.typeOf(ArrayBuffer)).toBe('[Class ::ArrayBuffer]');
      expect(BaseUtils.typeOf(BigInt)).toBe('[Class ::BigInt]');
      expect(BaseUtils.typeOf(BigInt64Array)).toBe('[Class ::BigInt64Array]');
      expect(BaseUtils.typeOf(BigUint64Array)).toBe('[Class ::BigUint64Array]');
      expect(BaseUtils.typeOf(Boolean)).toBe('[Class ::Boolean]');
      expect(BaseUtils.typeOf(DataView)).toBe('[Class ::DataView]');
      expect(BaseUtils.typeOf(Date)).toBe('[Class ::Date]');
      expect(BaseUtils.typeOf(Error)).toBe('[Class ::Error]');
      expect(BaseUtils.typeOf(EvalError)).toBe('[Class ::EvalError]');
      expect(BaseUtils.typeOf(FinalizationRegistry)).toBe('[Class ::FinalizationRegistry]');
      expect(BaseUtils.typeOf(Float32Array)).toBe('[Class ::Float32Array]');
      expect(BaseUtils.typeOf(Float64Array)).toBe('[Class ::Float64Array]');
      expect(BaseUtils.typeOf(Function)).toBe('[Class ::Function]');
      expect(BaseUtils.typeOf(Int16Array)).toBe('[Class ::Int16Array]');
      expect(BaseUtils.typeOf(Int32Array)).toBe('[Class ::Int32Array]');
      expect(BaseUtils.typeOf(Int8Array)).toBe('[Class ::Int8Array]');
      expect(BaseUtils.typeOf(Map)).toBe('[Class ::Map]');
      expect(BaseUtils.typeOf(Number)).toBe('[Class ::Number]');
      expect(BaseUtils.typeOf(Object)).toBe('[Class ::Object]');
      expect(BaseUtils.typeOf(Proxy)).toBe('[Class ::Proxy]');
      expect(BaseUtils.typeOf(RangeError)).toBe('[Class ::RangeError]');
      expect(BaseUtils.typeOf(ReferenceError)).toBe('[Class ::ReferenceError]');
      expect(BaseUtils.typeOf(RegExp)).toBe('[Class ::RegExp]');
      expect(BaseUtils.typeOf(Set)).toBe('[Class ::Set]');
      expect(BaseUtils.typeOf(SharedArrayBuffer)).toBe('[Class ::SharedArrayBuffer]');
      expect(BaseUtils.typeOf(String)).toBe('[Class ::String]');
      expect(BaseUtils.typeOf(Symbol)).toBe('[Class ::Symbol]');
      expect(BaseUtils.typeOf(SyntaxError)).toBe('[Class ::SyntaxError]');
      expect(BaseUtils.typeOf(TypeError)).toBe('[Class ::TypeError]');
      expect(BaseUtils.typeOf(Uint16Array)).toBe('[Class ::Uint16Array]');
      expect(BaseUtils.typeOf(Uint32Array)).toBe('[Class ::Uint32Array]');
      expect(BaseUtils.typeOf(Uint8Array)).toBe('[Class ::Uint8Array]');
      expect(BaseUtils.typeOf(Uint8ClampedArray)).toBe('[Class ::Uint8ClampedArray]');
      expect(BaseUtils.typeOf(URIError)).toBe('[Class ::URIError]');
      expect(BaseUtils.typeOf(WeakMap)).toBe('[Class ::WeakMap]');
      expect(BaseUtils.typeOf(WeakRef)).toBe('[Class ::WeakRef]');
      expect(BaseUtils.typeOf(WeakSet)).toBe('[Class ::WeakSet]');
    });
  });

  describe('isType', () => {
    it('works', () => {
      expect(BaseUtils.isType(WeakSet, '[Class ::WeakSet]')).toBe(true);
      expect(BaseUtils.isType(JSON, 'Class')).toBe(false);
      expect(BaseUtils.isType(JSON, 'Class', 'Object')).toBe(false);
      expect(BaseUtils.isType(JSON, 'Class', 'Object', '::JSON')).toBe(true);
      expect(BaseUtils.isType(2.0, 'Class', 'Object', '::Number')).toBe(true);
    });

    it('works with classes', () => {
      expect(BaseUtils.isType(2.0, Number)).toBe(true);
      expect(BaseUtils.isType('2.0', Number)).toBe(false);
      expect(BaseUtils.isType(2n, Number)).toBe(false);
      expect(BaseUtils.isType(2n, BigInt)).toBe(true);
      expect(BaseUtils.isType(true, Boolean)).toBe(true);
      expect(BaseUtils.isType(false, Boolean)).toBe(true);
      expect(BaseUtils.isType('test', String)).toBe(true);
    });
  });

  describe('toCamelCase', () => {
    it('works', () => {
      expect(BaseUtils.toCamelCase('derp-thing-stuff')).toBe('derpThingStuff');
      expect(BaseUtils.toCamelCase('--derp-thing-stuff#$#')).toBe('derpThingStuff');
    });
  });

  describe('toSnakeCase', () => {
    it('works', () => {
      expect(BaseUtils.toSnakeCase('derp_ThingStuff')).toBe('derp_thing_stuff');
      expect(BaseUtils.toSnakeCase('DerpThingStuff')).toBe('derp_thing_stuff');
    });
  });

  describe('toKebabCase', () => {
    it('works', () => {
      expect(BaseUtils.toKebabCase('derp-ThingStuff')).toBe('derp-thing-stuff');
      expect(BaseUtils.toKebabCase('DerpThingStuff')).toBe('derp-thing-stuff');
    });
  });


  describe('isPrimitive', () => {
    it('works', () => {
      class Test {}

      expect(BaseUtils.isPrimitive(() => {})).toBe(false);
      expect(BaseUtils.isPrimitive(Set)).toBe(false);
      expect(BaseUtils.isPrimitive({})).toBe(false);
      expect(BaseUtils.isPrimitive([])).toBe(false);
      expect(BaseUtils.isPrimitive(undefined)).toBe(false);
      expect(BaseUtils.isPrimitive(null)).toBe(false);
      expect(BaseUtils.isPrimitive(NaN)).toBe(false);
      expect(BaseUtils.isPrimitive(Infinity)).toBe(true);
      expect(BaseUtils.isPrimitive(-Infinity)).toBe(true);
      expect(BaseUtils.isPrimitive(Symbol.for('test'))).toBe(true);
      expect(BaseUtils.isPrimitive(new Test())).toBe(false);
      expect(BaseUtils.isPrimitive(2n)).toBe(true);
      expect(BaseUtils.isPrimitive(BigInt(2))).toBe(true);

      expect(BaseUtils.isPrimitive(true)).toBe(true);
      expect(BaseUtils.isPrimitive(new Boolean(true))).toBe(true);
      expect(BaseUtils.isPrimitive(1)).toBe(true);
      expect(BaseUtils.isPrimitive(new Number(1))).toBe(true);
      expect(BaseUtils.isPrimitive('test')).toBe(true);
      expect(BaseUtils.isPrimitive(new String('test'))).toBe(true);
    });
  });

  describe('isValidNumber', () => {
    it('works', () => {
      class Test {}

      expect(BaseUtils.isValidNumber(() => {})).toBe(false);
      expect(BaseUtils.isValidNumber(Set)).toBe(false);
      expect(BaseUtils.isValidNumber({})).toBe(false);
      expect(BaseUtils.isValidNumber([])).toBe(false);
      expect(BaseUtils.isValidNumber(undefined)).toBe(false);
      expect(BaseUtils.isValidNumber(null)).toBe(false);
      expect(BaseUtils.isValidNumber(NaN)).toBe(false);
      expect(BaseUtils.isValidNumber(Infinity)).toBe(false);
      expect(BaseUtils.isValidNumber(-Infinity)).toBe(false);
      expect(BaseUtils.isValidNumber(Symbol.for('test'))).toBe(false);
      expect(BaseUtils.isValidNumber(new Test())).toBe(false);
      expect(BaseUtils.isValidNumber(2n)).toBe(false);
      expect(BaseUtils.isValidNumber(BigInt(2))).toBe(false);
      expect(BaseUtils.isValidNumber(true)).toBe(false);
      expect(BaseUtils.isValidNumber(new Boolean(true))).toBe(false);
      expect(BaseUtils.isValidNumber('test')).toBe(false);
      expect(BaseUtils.isValidNumber(new String('test'))).toBe(false);

      expect(BaseUtils.isValidNumber(0)).toBe(true);
      expect(BaseUtils.isValidNumber(-2.5)).toBe(true);
      expect(BaseUtils.isValidNumber(1.5)).toBe(true);
      expect(BaseUtils.isValidNumber(1)).toBe(true);
      expect(BaseUtils.isValidNumber(new Number(1))).toBe(true);
      expect(BaseUtils.isValidNumber(new Number(-1))).toBe(true);
    });
  });

  describe('isNOE', () => {
    it('works', () => {
      class Test {}

      expect(BaseUtils.isNOE(undefined)).toBe(true);
      expect(BaseUtils.isNOE(null)).toBe(true);
      expect(BaseUtils.isNOE(NaN)).toBe(true);
      expect(BaseUtils.isNOE('')).toBe(true);
      expect(BaseUtils.isNOE('   ')).toBe(true);
      expect(BaseUtils.isNOE('   \n\r\n')).toBe(true);

      expect(BaseUtils.isNOE(0)).toBe(false);
      expect(BaseUtils.isNOE(true)).toBe(false);
      expect(BaseUtils.isNOE(false)).toBe(false);
      expect(BaseUtils.isNOE([ 0 ])).toBe(false);
      expect(BaseUtils.isNOE({ hello: 'world' })).toBe(false);
      expect(BaseUtils.isNOE(new Test())).toBe(false);
      expect(BaseUtils.isNOE([])).toBe(true);
      expect(BaseUtils.isNOE({})).toBe(true);
    });
  });

  describe('fetchPath', () => {
    it('works', () => {
      let data = {
        stuff: {
          life: 42,
        },
        test: true,
      };

      let arr = [
        {
          test: 'hello',
        },
        1,
        'wow',
      ];

      expect(BaseUtils.fetchPath(undefined, null, null)).toBe(null);
      expect(BaseUtils.fetchPath(undefined, null, 'derp')).toBe('derp');
      expect(BaseUtils.fetchPath(data, 'test.stuff')).toBe(undefined);
      expect(BaseUtils.fetchPath(data, 'stuff2', null)).toBe(null);
      expect(BaseUtils.fetchPath(data, 'test', 'derp')).toBe(true);
      expect(BaseUtils.fetchPath(data, 'stuff', null)).toBe(data.stuff);
      expect(BaseUtils.fetchPath(data, 'stuff.life')).toBe(42);
      expect(BaseUtils.fetchPath(arr, '0.test')).toBe('hello');
      expect(BaseUtils.fetchPath(arr, '1')).toBe(1);
      expect(BaseUtils.fetchPath(arr, '2.length')).toBe(3);
    });
  });
});
