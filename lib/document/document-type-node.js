import { _, readOnlyProperty, SafeValue }    from './node-utils.js';
import { Node } from './node.js';

export class DocumentType extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    super(_({
      ...options,
      nodeType: Node.DOCUMENT_TYPE_NODE,
      nodeName: options.nodeName || 'html',
    }));

    Object.defineProperties(this, {
      'name': {
        enumerable:   false,
        configurable: true,
        get:          () => this.nodeName,
      },
      'publicId':     readOnlyProperty('html'),
      'systemId':     readOnlyProperty('html'),
    });
  }
}
