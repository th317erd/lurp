import * as _TestHelpers from '../support/test-helpers.js';

import { QueryEngine, Elements }  from '../../lib/index.js';
import { JSDOM }      from 'jsdom';

describe('Elements', () => {
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

  describe('ElementDefinition', () => {
    it('can stringify to html', () => {
      const $ = Elements.build;

      let elementBuilder = $('div').id('test !@#$%^&*()').class('one two & $!')(
        $('span').class('three').dataForFun('stuff')('Test'),
        $('div').id('test2').class('hello world')(
          $('input').class('four').prop$value('stuff')(),
        ),
      );

      expect(elementBuilder.toString()).toEqual('<div id="test &#33;&#64;&#35;&#36;&#37;&#94;&#38;&#42;&#40;&#41;" class="one two &#38; &#36;&#33;"><span class="three" data-for-fun="stuff">Test</span><div id="test2" class="hello world"><input class="four"></div></div>');
    });
  });
});
