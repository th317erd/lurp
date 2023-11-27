import { Elements, Utils } from '../../lib/index.js';

describe('Elements', () => {
  describe('ElementsDefinition', () => {
    it('can properly calculate uniqueness', () => {
      expect(Utils.deadbeef(Elements.Element('SPAN')())).toBe(Utils.deadbeef(Elements.Element('SPAN')()));
      expect(Utils.deadbeef(Elements.Element('SPAN')(Elements.Element('SPAN')))).toBe(Utils.deadbeef(Elements.Element('SPAN')(Elements.Element('SPAN')())));
      expect(
        Utils.deadbeef(Elements.Element('SPAN')(Elements.Element('SPAN'))),
      ).toBe(
        Utils.deadbeef(Elements.Element('SPAN')(Elements.Element('SPAN')())),
      );
    });

    it('can properly calculate id based off parents', () => {
      let result1 = Elements.Element('SPAN')();
      let result2 = Elements.Element('SPAN')();

      // First they start off the same
      expect(Utils.deadbeef(result1)).toBe(Utils.deadbeef(result2));
      expect(result1.fullID()).toBe(result2.fullID());

      // Then we add a child to "result2"
      result2.children.push(result1.clone({ parent: result2 }));

      // Check children (no longer the same)
      expect(result2.fullID()).not.toBe(result1.fullID());

      // Check parent
      expect(Utils.deadbeef(result1)).not.toBe(Utils.deadbeef(result2.children[0]));
      expect(result1.fullID()).not.toBe(result2.children[0].fullID());
    });
  });
});
