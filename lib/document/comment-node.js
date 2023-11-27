import {
  _,
  valueToString,
  SafeValue,
} from './node-utils.js';

import { Node } from './node.js';

export class Comment extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      options = { nodeValue: options };
    else
      options = options.value;

    super(_({
      ...options,
      nodeType:   Node.COMMENT_NODE,
      nodeName:   '#comment',
      nodeValue:  (options.nodeValue == null) ? '' : valueToString(options.nodeValue),
    }));
  }
}
