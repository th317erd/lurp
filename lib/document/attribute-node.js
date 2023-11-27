import {
  _,
  SafeValue,
  valueToString,
} from './node-utils.js';

import { Node } from './node.js';

export class Attr extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    let nodeValue = (options.value === undefined) ? '' : valueToString(options.value);
    let nodeName  = options.localName.toLowerCase();

    super(_({
      ...options,
      nodeType: Node.ATTRIBUTE_NODE,
      nodeName,
      nodeValue,
    }));

    let prefix        = (options.prefix == null || options.prefix === '') ? null : valueToString(options.prefix);
    let namespaceURI  = (options.namespaceURI == null || options.namespaceURI === '') ? null : valueToString(options.namespaceURI);

    if (prefix)
      prefix = prefix.toLowerCase();

    Object.defineProperties(this, {
      'prefix': {
        enumerable:   false,
        configurable: true,
        get:          () => prefix,
      },
      'namespaceURI': {
        enumerable:   false,
        configurable: true,
        get:          () => namespaceURI,
      },
      'localName': {
        enumerable:   false,
        configurable: true,
        get:          () => this.nodeName,
      },
      'name': {
        enumerable:   false,
        configurable: true,
        get:          () => {
          return (this.prefix) ? `${this.prefix}:${this.localName}` : this.localName;
        },
      },
      'ownerElement': {
        enumerable:   false,
        configurable: true,
        get:          () => this.parentElement,
      },
      'value': {
        enumerable:   false,
        configurable: true,
        get:          () => this.nodeValue,
        set:          (newValue) => {
          this.nodeValue = valueToString(newValue);
        },
      },
    });
  }
}
