import {
  _,
  valueToString,
  SafeValue,
} from './node-utils.js';

import { Node } from './node.js';

export class Text extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      options = { nodeValue: options };
    else
      options = options.value;

    super(_({
      ...options,
      nodeType:   Node.TEXT_NODE,
      nodeName:   '#text',
      nodeValue:  (options.nodeValue == null) ? '' : valueToString(options.nodeValue),
    }));
  }
}
