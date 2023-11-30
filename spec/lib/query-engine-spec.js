import * as _TestHelpers from '../support/test-helpers.js';

import { Component, QueryEngine }  from '../../lib/index.js';
import { JSDOM }      from 'jsdom';

describe('QueryEngine', () => {
  let dom;
  let document;

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

    document = dom.window.document;
  });

  describe('Array methods work', () => {
    it('forEach', () => {
      let query = QueryEngine.from(document, 'span', (element) => {
        return element.textContent;
      });

      expect(Array.from(query)).toEqual([ 'Howdy!', 'Well hello!', 'Sweet!' ]);
    });
  });
});
