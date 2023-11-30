import * as _TestHelpers from '../support/test-helpers.js';

import { Component }  from '../../lib/index.js';
import { JSDOM }      from 'jsdom';

describe('Component', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
<!DOCTYPE html><html><head><style>
:host([stuff="true"]), :host .sub, :host(.test) {
  color: red;
}

:host-context(body.dark) span, span {
  background-color: black;
}
</style></head><body></body></html>
`.trim());
  });

  describe('compileStyleForDocument', () => {
    it('works', () => {
      let styleElement = dom.window.document.head.querySelector('style');
      expect(Component.compileStyleForDocument('test-component', styleElement).replace(/\n+/, ' ')).toEqual('test-component[stuff="true"], test-component .sub, test-component.test {color: red;} body.dark test-component span, span {background-color: black;}');
    });
  });
});
