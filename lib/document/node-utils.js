/* eslint-disable max-classes-per-file */

import XMLName from 'xml-name-validator';

export const ON_CHILDREN_CHANGED = Symbol.for('/lurp/constants/onChildrenChanged');

export class SafeValue {
  constructor(value) {
    Object.defineProperties(this, {
      'value': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        value,
      },
    });
  }
}

export const _ = (value) => {
  return new SafeValue(value);
};

export function readOnlyProperty(defaultValue, onSet) {
  let internalValue = (defaultValue == null) ? null : defaultValue;

  return {
    enumerable:   false,
    configurable: true,
    get:          () => internalValue,
    set:          (safeValue) => {
      if (safeValue instanceof SafeValue) {
        internalValue = safeValue.value;
        if (typeof onSet === 'function')
          onSet(safeValue.value, internalValue);
      }
    },
  };
}

export function valueToString(value) {
  if (value != null && typeof value.toString === 'function')
    return value.toString();

  return ('' + value);
}

export function isValidName(name, fullyQualified) {
  if (!name)
    return false;

  if (typeof name !== 'string')
    return false;

  return (fullyQualified !== false) ? XMLName.name(name) : XMLName.qname(name);
}

const NAME_PARTS_RE = /^([^:]+):(.*)$/;

export function getNameParts(fullyQualifiedName) {
  let result = fullyQualifiedName.match(NAME_PARTS_RE);
  return (result) ? [ result[1], result[2] ] : [ undefined, fullyQualifiedName ];
}

export class DOMException extends Error {}
export class InvalidCharacterError extends DOMException {}
export class InUseAttributeError extends DOMException {}
export class NotFoundError extends DOMException {}
