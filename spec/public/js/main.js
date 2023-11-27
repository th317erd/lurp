const { Browser, Utils } = await import('./lurp/index.js');

window.app = Browser.createWorker('./js/app.js', {
  getRootElement: () => document.getElementById('root'),
  expose:         {
  },
});

window.Utils = Utils;
