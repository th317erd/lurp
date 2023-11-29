// import * as Utils     from './utils.js';
import * as Tokenizer from './tokenizer.js';

const {
  $,
  $all,
  $any,
  $map,
  $message,
  $pattern,
  $repeat,
} = Tokenizer;

export const $error       = $message.type('error').name('error');
export const $comment     = $pattern.name('comment')(/\/\*.*\*\//);
export const $newline     = $pattern.name('newline')(/\n|\r\n|\r|\f/);
export const $whitespace  = $pattern.name('whitespace')(/\t|\n|\r\n|\r|\f|\s/);
export const $hexDigit    = $pattern.name('hexDigit')(/[0-9a-fA-F]{1,6}/);
export const $escape      = $map.successOnly(true)(
  $all.name('escape')(
    $pattern(/\\/),
    $any(
      $hexDigit.setAttribute('escaped', true),
      $whitespace.setAttribute('escaped', true),
      $pattern.setAttribute('escaped', true).name('character')(/./),
    ),
  ),
  ({ token }) => {
    token.value = token.value.substring(1);

    let type = token.children[1].name;
    if (type === 'hexDigit')
      token.value = String.fromCodePoint(parseInt(token.value, 16));

    token.setAttribute('type', type);

    delete token.children;
  },
);

export const $identifier  = $map.successOnly(true)(
  $any(
    $all.name('identifier')(
      $pattern(/--/),
      $repeat.fragment(true)(
        $any(
          $escape,
          $pattern.name('character')(/[_a-zA-Z0-9-]/),
        ),
      ),
    ),
    $all.name('identifier')(
      $pattern(/-?/),
      $repeat.optional(true)($escape),
      $pattern.name('character')(/[_a-zA-Z]/),
      $repeat.optional(true).fragment(true)(
        $any(
          $escape,
          $pattern.name('character')(/[_a-zA-Z0-9-]/),
        ),
      ),
    ),
  ),
  ({ token }) => {
    token.value = token.children.map((child) => child.value).join('');
    delete token.children;
  },
);

export const $function = $map.successOnly(true)(
  $all.name('function')(
    $identifier,
    $pattern.discard(true)(/\(/),
  ),
  ({ token }) => {
    token.value = token.children[0].value;
    delete token.children;
  },
);

export function parseCSS(styleSheetString) {

}
