/* eslint-disable max-classes-per-file */
/* eslint-disable no-array-constructor */
/* eslint-disable no-magic-numbers */

import * as _TestHelpers from '../support/test-helpers.js';

import {
  Tokenizer,
  CSS,
} from '../../lib/index.js';

const {
  $any,
  $pattern,
  $repeat,
} = Tokenizer;

const {
  $atKeyword,
  $comment,
  $error,
  $escape,
  $function,
  $hash,
  $hexDigit,
  $identifier,
  $newline,
  $string,
  $whitespace,
} = CSS;

describe('CSS', () => {
  describe('$error', () => {
    it('works', () => {
      let context = Tokenizer.createPatternContext('test');
      expect($error('Test Error')(context)).toMatchSnapshot();
    });
  });

  describe('$comment', () => {
    it('works', () => {
      let context = Tokenizer.createPatternContext('/* comment */');
      expect($comment(context)).toMatchSnapshot();
    });
  });

  describe('$newline', () => {
    it('works', () => {
      let context   = Tokenizer.createPatternContext('\n\r\n\r\f');
      let $program  = $repeat($newline);

      expect($program(context)).toMatchSnapshot();
    });
  });

  describe('$whitespace', () => {
    it('works', () => {
      let context   = Tokenizer.createPatternContext('\t\n\r\n\r\f ');
      let $program  = $repeat($whitespace);

      expect($program(context)).toMatchSnapshot();
    });
  });

  describe('$hexDigit', () => {
    it('works', () => {
      let context   = Tokenizer.createPatternContext('0|f0|dd|cdf|abc1|a0cdef');
      let $program  = $repeat(
        $any(
          $hexDigit,
          $pattern.discard(true)(/\|/),
        ),
      );

      expect($program(context)).toMatchSnapshot();
    });
  });

  describe('$escape', () => {
    it('works', () => {
      let context   = Tokenizer.createPatternContext('\\\\\\.\\ \\1f303');
      let $program  = $repeat($escape);

      expect($program(context)).toMatchSnapshot();
    });
  });

  describe('$identifier', () => {
    it('works', () => {
      const test = (src) => {
        let context = Tokenizer.createPatternContext(src);
        return $identifier(context);
      };

      // Success
      expect(test('a')).toMatchSnapshot();
      expect(test('abc0_01d-')).toMatchSnapshot();
      expect(test('--0abc0_01d-')).toMatchSnapshot();
      expect(test('--_abc0_01d-')).toMatchSnapshot();
      expect(test('---abc0_01d-')).toMatchSnapshot();
      expect(test('---a\\ bc0_01d-')).toMatchSnapshot();
      expect(test('---a\\1f303x_01d-')).toMatchSnapshot();
      expect(test('-a')).toMatchSnapshot();
      expect(test('_Z')).toMatchSnapshot();
      expect(test('Z')).toMatchSnapshot();

      // Fail
      expect(test('-0')).toBe(undefined);
      expect(test('0')).toBe(undefined);
      expect(test('0a')).toBe(undefined);
    });
  });

  describe('$function', () => {
    it('works', () => {
      const test = (src) => {
        let context = Tokenizer.createPatternContext(src);
        return $function(context);
      };

      // Success
      expect(test('a(')).toMatchSnapshot();
      expect(test('abc0_01d-(')).toMatchSnapshot();
      expect(test('--0abc0_01d-(')).toMatchSnapshot();
      expect(test('--_abc0_01d-(')).toMatchSnapshot();
      expect(test('---abc0_01d-(')).toMatchSnapshot();
      expect(test('---a\\ bc0_01d-(')).toMatchSnapshot();
      expect(test('---a\\1f303x_01d-(')).toMatchSnapshot();
      expect(test('-a(')).toMatchSnapshot();
      expect(test('_Z(')).toMatchSnapshot();
      expect(test('Z(')).toMatchSnapshot();

      // Fail
      expect(test('-0(')).toBe(undefined);
      expect(test('0(')).toBe(undefined);
      expect(test('0a(')).toBe(undefined);
    });
  });

  describe('$atKeyword', () => {
    it('works', () => {
      const test = (src) => {
        let context = Tokenizer.createPatternContext(src);
        return $atKeyword(context);
      };

      // Success
      expect(test('@a')).toMatchSnapshot();
      expect(test('@abc0_01d-')).toMatchSnapshot();
      expect(test('@--0abc0_01d-')).toMatchSnapshot();
      expect(test('@--_abc0_01d-')).toMatchSnapshot();
      expect(test('@---abc0_01d-')).toMatchSnapshot();
      expect(test('@---a\\ bc0_01d-')).toMatchSnapshot();
      expect(test('@---a\\1f303x_01d-')).toMatchSnapshot();
      expect(test('@-a')).toMatchSnapshot();
      expect(test('@_Z')).toMatchSnapshot();
      expect(test('@Z')).toMatchSnapshot();

      // Fail
      expect(test('@-0')).toBe(undefined);
      expect(test('@0')).toBe(undefined);
      expect(test('@0a')).toBe(undefined);
    });
  });

  describe('$hash', () => {
    it('works', () => {
      const test = (src) => {
        let context = Tokenizer.createPatternContext(src);
        return $hash(context);
      };

      // Success
      expect(test('#a')).toMatchSnapshot();
      expect(test('#abc0_01d-')).toMatchSnapshot();
      expect(test('#--0abc0_01d-')).toMatchSnapshot();
      expect(test('#--_abc0_01d-')).toMatchSnapshot();
      expect(test('#---abc0_01d-')).toMatchSnapshot();
      expect(test('#---a\\ bc0_01d-')).toMatchSnapshot();
      expect(test('#---a\\1f303x_01d-')).toMatchSnapshot();
      expect(test('#-a')).toMatchSnapshot();
      expect(test('#_Z')).toMatchSnapshot();
      expect(test('#Z')).toMatchSnapshot();
      expect(test('#-0')).toMatchSnapshot();
      expect(test('#0')).toMatchSnapshot();
      expect(test('#0a')).toMatchSnapshot();
      expect(test('#0a something else')).toMatchSnapshot();
    });
  });

  describe('$string', () => {
    it('works', () => {
      const test = (src) => {
        let context = Tokenizer.createPatternContext(src);
        return $string(context);
      };

      // Success
      expect(test('\'test\'')).toMatchSnapshot();
      expect(test('\'test \\\'substring\\\' here\'')).toMatchSnapshot();
      expect(test('\'test "substring" here\'')).toMatchSnapshot();
      expect(test('\'test "substring" \\\nhere\'')).toMatchSnapshot();
      expect(test('"test"')).toMatchSnapshot();
      expect(test('"test \\"substring\\" here"')).toMatchSnapshot();
      expect(test('"test \'substring\' here"')).toMatchSnapshot();
      expect(test('"test \'substring\' \\\nhere"')).toMatchSnapshot();
    });
  });
});
