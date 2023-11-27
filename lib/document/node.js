/* eslint-disable no-magic-numbers */

import {
  _,
  SafeValue,
  readOnlyProperty,
} from './node-utils.js';

import { NodeList } from './node-list.js';

export class Node extends NodeList {
  static ELEMENT_NODE                 = 1;
  static ATTRIBUTE_NODE               = 2;
  static TEXT_NODE                    = 3;
  static CDATA_SECTION_NODE           = 4;
  static PROCESSING_INSTRUCTION_NODE  = 7;
  static COMMENT_NODE                 = 8;
  static DOCUMENT_NODE                = 9;
  static DOCUMENT_TYPE_NODE           = 10;
  static DOCUMENT_FRAGMENT_NODE       = 11;

  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      throw new TypeError('Illegal constructor');

    options = options.value;

    super(_());

    let {
      nodeType,
      nodeName,
    } = options;

    const _childNodes = [];

    let _nodeValue      = (options.nodeValue == null) ? null : options.nodeValue;
    let _ownerDocument  = options.ownerDocument || null;

    Object.defineProperties(this, {
      'ownerDocument':    {
        enumerable:   false,
        configurable: true,
        get:          () => _ownerDocument || (this.parentElement && this.parentElement.ownerDocument) || (this.ownerElement && this.ownerElement.ownerDocument),
        set:          (safeValue) => {
          if (safeValue instanceof SafeValue)
            _ownerDocument = safeValue.value;
        },
      },
      'nodeType':         readOnlyProperty(nodeType),
      'nodeName':         readOnlyProperty(nodeName),
      'parentElement':    {
        enumerable:   false,
        configurable: false,
        get:          () => {
          let parentNode = this.parentNode;
          if (!parentNode || parentNode.nodeType !== Node.ELEMENT_NODE)
            return null;

          return parentNode;
        },
      },
      'isConnected':      {
        enumerable:   false,
        configurable: true,
        get:          () => !!this.ownerDocument,
      },
      'nodeValue':        {
        enumerable:   false,
        configurable: true,
        get:          () => _nodeValue,
        set:          (newValue) => {
          _nodeValue = newValue;
        },
      },
    });
  }

  isEqualNode(_otherNode) {
  }
}
