import { SafeValue, _ } from './node-utils.js';
import { Node }         from './node.js';

export class DocumentFragment extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      options = {};
    else
      options = options.value;

    super(_({
      ...options,
      nodeType: Node.DOCUMENT_NODE,
      nodeName: '#document-fragment',
    }));
  }
}
