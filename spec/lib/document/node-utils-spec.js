import * as _TestHelpers from '../../support/test-helpers.js';

import * as NodeUtils from '../../../lib/document/node-utils.js';

describe('Document', () => {
  fdescribe('NodeUtils', () => {
    describe('isValidName', () => {
      it('works', async () => {
        expect(NodeUtils.isValidName()).toBe(false);
        expect(NodeUtils.isValidName(0)).toBe(false);
        expect(NodeUtils.isValidName('0test')).toBe(false);
        expect(NodeUtils.isValidName('.test')).toBe(false);
        expect(NodeUtils.isValidName('-test')).toBe(false);
        expect(NodeUtils.isValidName(':test')).toBe(true);
      });
    });

    describe('getNameParts', () => {
      it('works', async () => {
        expect(NodeUtils.getNameParts('test')).toEqual([ undefined, 'test' ]);
        expect(NodeUtils.getNameParts(':test')).toEqual([ undefined, ':test' ]);
        expect(NodeUtils.getNameParts('xml:test')).toEqual([ 'xml', 'test' ]);
        expect(NodeUtils.getNameParts('xml:test:derp')).toEqual([ 'xml', 'test:derp' ]);
        expect(NodeUtils.getNameParts('xml-stuff:_hello')).toEqual([ 'xml-stuff', '_hello' ]);
      });
    });
  });
});
