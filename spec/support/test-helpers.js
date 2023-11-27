import * as Util          from 'node:util';
import { isPlainObject }  from '../../lib/utils.js';

const INSPECT_OPTIONS = Object.assign(Object.create(null), {
  depth:            Infinity,
  colors:           true,
  maxArrayLength:   Infinity,
  maxStringLength:  Infinity,
  breakLength:      Infinity,
  compact:          false,
  sorted:           false,
  getters:          false,
  numericSeparator: true,
});

export function inspect(...args) {
  let options = INSPECT_OPTIONS;
  if (this !== globalThis && isPlainObject(this))
    options = Object.assign({}, INSPECT_OPTIONS, this);

  return args.map((arg) => Util.inspect(arg, options)).join('');
}

export function inspectLog(...args) {
  console.log(inspect.call(this, ...args));
}
