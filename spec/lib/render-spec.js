import * as _TestHelpers from '../support/test-helpers.js';

import { Render, Elements } from '../../lib/index.js';

describe('Render', () => {
  describe('Renderer', () => {
    it('can properly calculate uniqueness', async () => {
      let renderer  = new Render.Renderer();
      let result    = await renderer.render(
        Elements.DIV(
          Elements.SPAN(Elements.Term('Hello!')),
          Elements.SPAN(Elements.Term('World!')),
        ),
      );

      // _TestHelpers.inspectLog(result);

      await renderer.render(
        Elements.DIV(
          Elements.SPAN(Elements.Term('Hello!')),
          Elements.SPAN(Elements.Term('World!')),
        ),
      );
    });
  });
});
