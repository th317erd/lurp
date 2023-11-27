import {
  _,
  InvalidCharacterError,
  isValidName,
  getNameParts,
  SafeValue,
} from './node-utils.js';

import { Node }             from './node.js';
import { DocumentFragment } from './document-fragment.js';
import { Comment }          from './comment-node.js';
import { Text }             from './text-node.js';
import { Element } from './element-node.js';

export class Document extends Node {
  constructor(_options) {
    let options = _options;
    if (!(options instanceof SafeValue))
      options = {};
    else
      options = options.value;

    super(_({
      ...options,
      nodeType: Node.DOCUMENT_NODE,
      nodeName: '#document',
    }));
  }

  createAttribute(name) {
    if (!isValidName(name, false))
      throw new InvalidCharacterError(`Failed to execute 'createAttribute' on 'Document': The localName provided ('${name}') contains an invalid character.`);

    return new Attr(_({
      ownerDocument:  this,
      localName:      name,
    }));
  }

  createAttributeNS(namespaceURI, qualifiedName) {
    if (!isValidName(qualifiedName))
      throw new InvalidCharacterError(`Failed to execute 'createAttributeNS' on 'Document': The qualified name provided ('${qualifiedName}') contains an invalid character.`);

    let [ prefix, localName ] = getNameParts(qualifiedName);

    return new Attr(_({
      ownerDocument: this,
      prefix,
      localName,
      namespaceURI,
    }));
  }

  createComment(data) {
    return new Comment(_({
      ownerDocument:  this,
      nodeValue:      data,
    }));
  }

  createDocumentFragment() {
    return new DocumentFragment(_({
      ownerDocument:  this,
    }));
  }

  createElement(tagName, options) {
    let [ prefix, localName ] = getNameParts(tagName);

    return new Element(_({
      ownerDocument:  this,
      nodeName:       tagName,
      is:             (options || {}).is,
      prefix,
      localName,
    }));
  }

  createTextNode(data) {
    return new Text(_({
      ownerDocument:  this,
      nodeValue:      data,
    }));
  }
}
