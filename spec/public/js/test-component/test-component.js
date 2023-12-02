import { Component } from 'mythix-ui-core';

export default class TestComponent extends Component {
  static tagName = 'test-component';

  // get name() {
  //   return 'Wyatt Greenway';
  // }

  constructor() {
    super();

    this.data = this.dynamicData({
      name:     'Dude!',
      classes:  'wow man',
    });
  }

  mounted() {
    console.log('mounted');
    this.build(({ DIV, P }) => {
      return DIV.class('{{data.classes}}').id('fancyID').onClick(() => console.log('DID THE THING!'))(
        P.class('red').dataStuff('hello')('Hello {{data.name}}!'),
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
