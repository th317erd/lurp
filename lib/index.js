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

  Object.defineProperties(globalThis, {
    '$': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelector(...args),
    },
    '$$': {
      writable:     true,
      enumerable:   true,
      configurable: true,
      value:        (...args) => document.querySelectorAll(...args),
    },
  });

  let documentMutationObserver = globalThis.mythixUI.documentMutationObserver = new MutationObserver((mutations) => {
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation = mutations[i];
      if (mutation.type === 'attributes') {
        let attributeNode = mutation.target.getAttributeNode(mutation.attributeName);
        let newValue      = attributeNode.nodeValue;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && Utils.stringIsDynamicBindingTemplate(newValue))
          attributeNode.nodeValue = Utils.formatTerm(mutation.target, attributeNode);
      } else if (mutation.type === 'childList') {
        let addedNodes = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          Components.recursivelyBindDynamicData(mutation.target, node);
        }
      }
    }
  });

  documentMutationObserver.observe(document, {
    subtree:            true,
    childList:          true,
    attributes:         true,
    attributeOldValue:  true,
  });
}
