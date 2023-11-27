import * as _TestHelpers from '../../support/test-helpers.js';

import { Document as _Document } from '../../../lib/index.js';

const {
  Node,
  Document,
  Element,
  Text,
} = _Document;

describe('Document', () => {
  fdescribe('Node', () => {
    it('won\'t allow creation via constructor', async () => {
      try {
        new Node();
        fail('unreachable');
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe('Illegal constructor');
      }
    });

    it('can operate with children', async () => {
      let document  = new Document();
      let element   = document.createElement('div');

      expect(element.childNodes).toEqual([]);
      expect(element.children).toEqual([]);

      let textNode = element.appendChild(document.createTextNode('Hello World!'));
      expect(textNode).toBeInstanceOf(Text);

      expect(element.childNodes).toEqual([ textNode ]);
      expect(element.children).toEqual([]);

      let span = element.appendChild(document.createElement('span'));
      expect(span).toBeInstanceOf(Element);

      expect(element.childNodes).toEqual([ textNode, span ]);
      expect(element.children).toEqual([ span ]);

      let img = element.insertBefore(document.createElement('img'), textNode);
      expect(img).toBeInstanceOf(Element);

      expect(element.childNodes).toEqual([ img, textNode, span ]);
      expect(element.children).toEqual([ img, span ]);

      let header  = document.createElement('header');
      let img2    = element.replaceChild(header, img);
      expect(img2).toBe(img);

      expect(element.childNodes).toEqual([ header, textNode, span ]);
      expect(element.children).toEqual([ header, span ]);

      let removed = element.removeChild(textNode);
      expect(removed).toBe(textNode);

      expect(element.childNodes).toEqual([ header, span ]);
      expect(element.children).toEqual([ header, span ]);
    });
  });
});
