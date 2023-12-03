import * as _TestHelpers from '../support/test-helpers.js';

import { MythixUIComponent } from '../../lib/index.js';
import { JSDOM }      from 'jsdom';

describe('MythixUIComponent', () => {
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

    // Not great for parallel testing... I know...
    globalThis.window = dom.window;
    globalThis.document = window.document;
    globalThis.Node = window.Node;
  });

  describe('compileStyleForDocument', () => {
    it('works', () => {
      let styleElement = dom.window.document.head.querySelector('style');
      expect(MythixUIComponent.compileStyleForDocument('test-component', styleElement).replace(/\n+/, ' ')).toEqual('test-component[stuff="true"], test-component .sub, test-component.test {color: red;} body.dark test-component span {background-color: black;}');
    });
  });

  describe('classes', () => {
    it('works', () => {
      let test = new MythixUIComponent();

      expect(test.classes('test', 'derp', 'wow')).toBe('test derp wow');
      expect(test.classes('test', { stuff: true, otherStuff: false })).toBe('test stuff');
      expect(test.classes('test', { stuff: true, otherStuff: false }, [ '   cool', '  bean ' ])).toBe('test stuff cool bean');
    });
  });
});
