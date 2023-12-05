globalThis.mythixUI = (globalThis.mythixUI || {});

import * as Utils from './utils.js';
import * as Components from './component.js';
import * as Elements from './elements.js';

export * as Utils from './utils.js';

export * from './query-engine.js';
export * from './component.js';
export * from './elements.js';
export * from './mythix-ui-require.js';
export * from './mythix-ui-language-provider.js';
export * from './mythix-ui-spinner.js';

globalThis.mythixUI.Utils = Utils;
globalThis.mythixUI.Components = Components;
globalThis.mythixUI.Elements = Elements;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
    Components.visibilityObserver(({ disconnect, element, wasVisible }) => {
      if (wasVisible)
        return;

      let src = element.getAttribute('data-mythix-src');
      if (!src)
        return;

      disconnect();

      Components.loadPartialIntoElement.call(element, src);
    }, { elements });
  });
}

if (!Object.prototype.hasOwnProperty.call(globalThis, '$Q')) {
  Object.defineProperties(globalThis, {
    '$Q': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelector(...args),
    },
    '$$Q': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelectorAll(...args),
    },
  });
}
