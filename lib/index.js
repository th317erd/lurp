globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});

import * as Utils from './utils.js';
import * as Components from './component.js';
import * as Elements from './elements.js';

export * as Utils from './utils.js';

export * from './query-engine.js';
export * as Components from './component.js';
export * as Elements from './elements.js';
export * from './mythix-ui-require.js';
export * from './mythix-ui-language-provider.js';
export * from './mythix-ui-spinner.js';

const MythixUIComponent = Components.MythixUIComponent;

export {
  MythixUIComponent,
};

let _onMythixReady = globalThis.onMythixReady || [];
Object.defineProperties(globalThis, {
  'onMythixReady': {
    enumerable:   false,
    configurable: true,
    get:          () => {
      return _onMythixReady;
    },
    set:          (newValue) => {
      _onMythixReady = newValue;
      callOnMythixReadyCallbacks();
    },
  },
});

const MYTHIX_ALREADY_CALLED = Symbol.for('@mythix/mythix-ui/constants/already-called');

function callOnMythixReadyCallbacks() {
  if (document.readyState !== 'complete')
    return;

  for (let callback of globalThis.onMythixReady) {
    let alreadyCalled = Utils.metadata(callback, MYTHIX_ALREADY_CALLED);
    if (alreadyCalled)
      continue;

    Utils.metadata(callback, MYTHIX_ALREADY_CALLED, true);
    callback({ Components, Utils, Elements });
  }
}

globalThis.mythixUI.Utils = Utils;
globalThis.mythixUI.Components = Components;
globalThis.mythixUI.Elements = Elements;
globalThis.mythixUI.globalScope.globalStore = Utils.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = Utils.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return Utils.dynamicPropID(id);
};

if (typeof document !== 'undefined') {
  let didVisibilityObservers = false;

  const onDocumentReady = () => {
    if (!didVisibilityObservers) {
      let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
      Components.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        disconnect();

        Components.loadPartialIntoElement.call(element, src).then(() => {
          element.classList.add('mythix-ready');
        });
      }, { elements });

      didVisibilityObservers = true;
    }

    document.body.classList.add('mythix-ready');

    callOnMythixReadyCallbacks();
  };

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
    let disableTemplateEngineSelectorStr = Utils.disableTemplateEngineSelector();
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation = mutations[i];
      if (mutation.type === 'attributes') {
        if (disableTemplateEngineSelectorStr && mutation.target.parentNode && mutation.target.parentNode.closest(disableTemplateEngineSelectorStr))
          continue;

        let attributeNode = mutation.target.getAttributeNode(mutation.attributeName);
        let newValue      = attributeNode.nodeValue;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && Utils.stringIsDynamicBindingTemplate(newValue))
          attributeNode.nodeValue = Utils.formatTerm(mutation.target, attributeNode);
      } else if (mutation.type === 'childList') {
        if (disableTemplateEngineSelectorStr && mutation.target && mutation.target.closest('[data-templates-disable],mythix-for-each'))
          continue;

        let addedNodes = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          Components.recursivelyBindDynamicData(node);
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

  Components.recursivelyBindDynamicData(document.head);
  Components.recursivelyBindDynamicData(document.body);

  setTimeout(() => {
    if (document.readyState === 'complete')
      onDocumentReady();
    else
      document.addEventListener('DOMContentLoaded', onDocumentReady);
  }, 250);

  window.addEventListener('load', onDocumentReady);
}
