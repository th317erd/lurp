globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});

if (typeof document !== 'undefined' && !globalThis.mythixUI.globalScope.url)
  globalThis.mythixUI.globalScope.url = new URL(document.location);

import * as BaseUtils from './base-utils.js';
export * as BaseUtils from './base-utils.js';
import * as Utils from './utils.js';
export * as Utils from './utils.js';

import * as ComponentUtils from './component-utils.js';
export * as ComponentUtils from './component-utils.js';
import * as Elements from './elements.js';

import { DynamicProperty } from './dynamic-property.js';

export * from './query-engine.js';
export * as Elements from './elements.js';

import { MythixUIComponent } from './mythix-ui-component.js';
export * from './mythix-ui-component.js';

import { MythixUIRequire } from './mythix-ui-require.js';

import {
  MythixUILanguagePack,
  MythixUILanguageProvider,
} from './mythix-ui-language-provider.js';

import { MythixUISpinner } from './mythix-ui-spinner.js';

import { MythixUIDynamicStyle } from './mythix-ui-dynamic-style.js';

export const MythixElements = {
  MythixUIRequire,
  MythixUILanguagePack,
  MythixUILanguageProvider,
  MythixUISpinner,
  MythixUIDynamicStyle,
};

export {
  DynamicProperty,
};

let _mythixIsReady = false;
Object.defineProperties(globalThis, {
  'onmythixready': {
    enumerable:   false,
    configurable: true,
    get:          () => {
      return null;
    },
    set:          (callback) => {
      if (_mythixIsReady) {
        Promise.resolve().then(() => callback(new Event('mythix-ready')));
        return;
      }

      document.addEventListener('mythix-ready', callback);
    },
  },
});

globalThis.mythixUI.BaseUtils = BaseUtils;
globalThis.mythixUI.Utils = Utils;
globalThis.mythixUI.ComponentUtils = ComponentUtils;
globalThis.mythixUI.Elements = Elements;
globalThis.mythixUI.globalScope.globalStore = Utils.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = Utils.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return Utils.dynamicPropID(id);
};

class MythixConnectedEvent extends CustomEvent {
  constructor() {
    super('mythix-connected');
  }
}

class MythixDisconnectedEvent extends CustomEvent {
  constructor() {
    super('mythix-disconnected');
  }
}

if (typeof document !== 'undefined') {
  let didVisibilityObservers = false;

  const onDocumentReady = () => {
    if (!didVisibilityObservers) {
      let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
      ComponentUtils.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        disconnect();

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        ComponentUtils.loadPartialIntoElement.call(element, src).then(() => {
          element.classList.add('mythix-ready');
        });
      }, { elements });

      didVisibilityObservers = true;
    }

    document.body.classList.add('mythix-ready');

    if (_mythixIsReady)
      return;

    _mythixIsReady = true;

    document.dispatchEvent(new Event('mythix-ready'));
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
    let disableTemplateEngineSelectorStr = Utils.getDisableTemplateEngineSelector();
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation  = mutations[i];
      let target    = mutation.target;

      if (mutation.type === 'attributes') {
        if (disableTemplateEngineSelectorStr && target.parentNode && typeof target.parentNode.closest === 'function' && target.parentNode.closest(disableTemplateEngineSelectorStr))
          continue;

        let attributeNode = target.getAttributeNode(mutation.attributeName);
        let newValue      = (attributeNode) ? attributeNode.nodeValue : null;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && Utils.isTemplate(newValue))
          attributeNode.nodeValue = Utils.formatNodeValue(attributeNode, { scope: Utils.createScope(target), disallowHTML: true });

        let observedAttributes = target.constructor.observedAttributes;
        if (observedAttributes && observedAttributes.indexOf(mutation.attributeName) < 0) {
          if (target[MythixUIComponent.isMythixComponent])
            target.attributeChangedCallback.call(target, mutation.attributeName, oldValue, newValue);
        }
      } else if (mutation.type === 'childList') {
        let disableTemplating = (disableTemplateEngineSelectorStr && target && typeof target.closest === 'function' && target.closest('[data-templates-disable],mythix-for-each'));
        let addedNodes        = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          if (node[MythixUIComponent.isMythixComponent] && node.onMutationAdded.call(node, mutation) === false)
            continue;

          if (!disableTemplating)
            Elements.processElements(node);

          if (typeof node.dispatchEvent === 'function') {
            let connectedEvent = new MythixConnectedEvent();
            node.dispatchEvent(connectedEvent);
          }

          if (target[MythixUIComponent.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[MythixUIComponent.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

          if (typeof node.dispatchEvent === 'function') {
            let disconnectedEvent = new MythixDisconnectedEvent();
            node.dispatchEvent(disconnectedEvent);
          }

          if (target[MythixUIComponent.isMythixComponent])
            target.onMutationChildRemoved(node, mutation);
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

  Elements.processElements(document.head);
  Elements.processElements(document.body);

  const DOCUMENT_CHECK_READY_TIME = 250;

  setTimeout(() => {
    if (document.readyState === 'complete')
      onDocumentReady();
    else
      document.addEventListener('DOMContentLoaded', onDocumentReady);
  }, DOCUMENT_CHECK_READY_TIME);

  window.addEventListener('load', onDocumentReady);
}
