import {
  _,
  SafeValue,
  DOMException,
  valueToString,
} from './node-utils.js';

const HIDDEN_SET_PROPERTY = Symbol.for('/lurp/constants/hiddenSetProperty');

function validateToken(callerName, _value) {
  let value = valueToString(_value);
  if (value === '')
    throw new DOMException(`Failed to execute '${callerName}' on 'DOMTokenList': The token provided must not be empty.`);

  if ((/\s/).test(value))
    throw new DOMException(`Failed to execute '${callerName}' on 'DOMTokenList': The token provided ('${value}') contains HTML space characters, which are not valid in tokens.`);
}

export class DOMTokenList {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    Object.defineProperties(this, {
      [HIDDEN_SET_PROPERTY]: {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        new Set(),
      },
      'value': {
        enumerable:   false,
        configurable: false,
        get:          () => this.toString(),
      },
    });
  }

  add(...args) {
    let data = this[HIDDEN_SET_PROPERTY];
    for (let i = 0, il = args.length; i < il; i++) {
      let value = args[i];
      validateToken('add', value);
      data.add(args[i]);
    }
  }

  contains(token) {
    let data = this[HIDDEN_SET_PROPERTY];
    return data.has(token);
  }

  *entries() {
    let data  = this[HIDDEN_SET_PROPERTY];
    let index = 0;

    for (let value of data.values())
      yield([ index++, value ]);
  }

  forEach(callback, _thisArg) {
    let thisArg = (_thisArg == null) ? this : _thisArg;

    for (let [ key, value] of this.entries())
      callback.call(thisArg, value, key, this);
  }

  item(_index) {
    let index = parseInt(_index, 10);
    if (!isFinite(index))
      index = 0;

    let data      = this[HIDDEN_SET_PROPERTY];
    let allValues = Array.from(data.values());
    return (index >= allValues.length) ? null : allValues[index];
  }

  *keys() {
    for (let [ key, _ ] of this.entries())
      yield key;
  }

  remove(...args) {
    let data = this[HIDDEN_SET_PROPERTY];
    for (let i = 0, il = args.length; i < il; i++) {
      let value = args[i];
      validateToken('remove', value);
      data.delete(args[i]);
    }
  }

  replace(oldToken, newToken) {
    validateToken('replace', oldToken);
    validateToken('replace', newToken);

    let data        = this[HIDDEN_SET_PROPERTY];
    let valueExists = data.has(oldToken);

    this.remove(oldToken);
    this.add(newToken);

    return valueExists;
  }

  supports(token) {
    return this.contains(token);
  }

  toggle(token, force) {
    validateToken('toggle', token);

    let op = (arguments.length > 1) ? !!force : !this.contains(token);
    if (op === true)
      this.add(token);
    else
      this.remove(token);

    return op;
  }

  *values() {
    for (let [ _, value ] of this.entries())
      yield value;
  }

  toString() {
    let items = Array.from(this.values());
    return items.join(' ');
  }
}

export function tokenList() {
  let _tokenList = new DOMTokenList(_());

  return {
    enumerable:   false,
    configurable: true,
    get:          () => _tokenList,
    set:          (value) => {
      let tokens = valueToString(value).split(/\s+/g);
      _tokenList.add(...tokens);
    },
  };
}
