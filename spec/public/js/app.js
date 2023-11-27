const { Worker, Component, Utils } = await import('./lurp/index.js');

globalThis.Utils = Utils;

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

Component.Element.$tagName('DIV').on('click', () => {

})();

let result = CustomButton.name('hello')('test1', CustomButton());
console.log(result);
console.log('ONE: ', Utils.deadbeef(result), '\nTWO: ', Utils.deadbeef(result.children[1]));
