import * as _TestHelpers from '../support/test-helpers.js';

import { QueryEngine }  from '../../lib/index.js';
import { JSDOM }      from 'jsdom';

describe('QueryEngine', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <p>Hello there!</p>
    <div>
      <span>Howdy!</span>
      <span>Well hello!</span>
      <span>Sweet!</span>
    </div>
  </body>
</html>
`.trim());

    // Not great for parallel testing... I know...
    globalThis.window = dom.window;
    globalThis.document = window.document;
    globalThis.Node = window.Node;
    globalThis.HTMLElement = window.HTMLElement;
  });

  describe('Array methods work', () => {
    it('[index]', () => {
      let query = QueryEngine.from({ root: document }, 'span');

      expect(document.querySelectorAll('span')[0]).toBeTruthy();
      expect(document.querySelectorAll('span')[1]).toBeTruthy();
      expect(document.querySelectorAll('span')[2]).toBeTruthy();

      expect(query.length).toEqual(3);
      expect(query[0]).toBe(document.querySelectorAll('span')[0]);
      expect(query[1]).toBe(document.querySelectorAll('span')[1]);
      expect(query[2]).toBe(document.querySelectorAll('span')[2]);
    });

    it('forEach', () => {
      let callCount = 0;

      let query = QueryEngine.from({ root: document }, 'span', (element) => {
        callCount++;
        return element.textContent;
      });

      expect(callCount).toEqual(3);
      expect(Array.from(query)).toEqual([ 'Howdy!', 'Well hello!', 'Sweet!' ]);
    });
  });
});
