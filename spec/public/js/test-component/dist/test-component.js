import { MythixUIComponent } from '@cdn/mythix-ui-core@1';

export default class TestComponent extends MythixUIComponent {
  static tagName = 'test-component';

  constructor() {
    super();

    this.data = this.dynamicData({
      name:     'Dude!',
      classes:  'wow man',
    });
  }

  mounted() {
    super.mounted();

    console.log('mounted');
    this.$build(({ DIV, P }) => {
      return DIV.class('@@data.classes@@').id('fancyID').onClick(() => console.log('DID THE THING!'))(
        P.class('red').dataStuff('hello')('Hello @@data.name@@ @@$$.i18n("Mythix.MythixModal.Alert.confirmButton.caption")@@!'),
      );
    }).appendTo(this.shadow);
  }

  unmounted() {
    console.log('unmounted', arguments, this.children);
  }

  onDerp() {
    console.log('DERP!');
  }

  onSpanClicked() {
    this.classList.toggle('red');
  }

  onSlotChanged(...args) {
    console.log('On slot changed!', args);
  }
}

TestComponent.register();
