import * as _TestHelpers from '../support/test-helpers.js';

import { Component } from '../../lib/index.js';

describe('Component', () => {
  describe('createStyleForDocument', () => {
    it('works', () => {
      expect(Component.createStyleForDocument('test-component', 'span {}')).toEqual('test-component span {}');
      expect(Component.createStyleForDocument('test-component', ':host {}')).toEqual('test-component {}');
      expect(Component.createStyleForDocument('test-component', ':host-context(body.red) span {}\n\nspan {}')).toEqual('body.red test-component span {}\n\ntest-component span {}');
      expect(Component.createStyleForDocument('test-component', ':host span {}')).toEqual('test-component span {}');
      expect(Component.createStyleForDocument('test-component', ':host(h1) span {}')).toEqual('h1[data-component-name="test-component"] span {}');
      expect(Component.createStyleForDocument('test-component', ':host(.red) span {}')).toEqual('test-component.red span {}');
      expect(Component.createStyleForDocument('test-component', ':host(.red[derp="stuff"]) span {}')).toEqual('test-component.red[derp="stuff"] span {}');
      expect(Component.createStyleForDocument('test-component', ':host-context(body.red) span {}')).toEqual('body.red test-component span {}');
      expect(Component.createStyleForDocument('test-component', ':host-context(body.red[theme="dark"]) span {}')).toEqual('body.red[theme="dark"] test-component span {}');

    });
  });
});
