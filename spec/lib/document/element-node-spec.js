import * as _TestHelpers from '../../support/test-helpers.js';

import { Document as _Document } from '../../../lib/index.js';

const {
  Node,
  Document,
  Element,
} = _Document;

describe('Document', () => {
  fdescribe('Element', () => {
    it('works', async () => {
      let document  = new Document();
      let element   = document.createElement('div');
    });
  });
});
