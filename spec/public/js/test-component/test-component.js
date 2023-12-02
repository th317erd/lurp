import { Component } from 'mythix-ui-core';

export default class TestComponent extends Component {
  static tagName = 'test-component';

  // get name() {
  //   return 'Wyatt Greenway';
  // }

  constructor() {
    super();

    this.createDynamicProperty('name', 'Dude!');
  }

  mounted() {
    console.log('mounted');
    this.$(({ DIV, P }) => {
      return DIV.class('test stuff').id('fancyID').onClick(() => console.log('DID THE THING!'))(
        P.class('red').dataStuff('hello')('Hello {{name}}!'),
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
