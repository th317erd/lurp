const { Worker, Component } = await import('./lurp/index.js');

console.log('APP STARTED!', globalThis);

const bridge = globalThis.bridge = Worker.setupBridge({
  expose: {
    hello:  () => 'World!',
    add:    (a, b) => (a + b),
  },
});

const CustomButton = Component.create(({ props, children, useState, ref }) => {
  return Component.Element('DIV');
}, {
  name: 'Test',
});

Component.Element.tagName('DIV').on('click', () => {

})();

console.log(CustomButton.name('hello')('test1', 'test2'));
