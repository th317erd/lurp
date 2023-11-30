// import { BridgeInterface } from './bridge-interface.js';

import { SHA256 } from './sha256.js';

// export class BrowserBridgeInterface extends BridgeInterface {

// }

// function render(component) {
//   console.log('Got a render request!');
// }

// export const INTERNAL_INTERFACE_METHODS = {
//   render,
// };

// export function createWorker(workerScriptURI, _context, options) {
//   if (!window.Worker)
//     throw new Error('Script environment doesn\'t support Workers');

//   const worker = new Worker(workerScriptURI, { type: 'module' });

//   worker.onmessage = function(event) {
//     console.log('Message received from worker', event);
//   };

//   let context = Object.assign(
//     Object.create(null),
//     INTERNAL_INTERFACE_METHODS,
//     _context || {},
//     {
//       expose: Object.assign(
//         Object.create(null),
//         INTERNAL_INTERFACE_METHODS,
//         (_context || {}).expose,
//       ),
//     },
//   );

//   return new BrowserBridgeInterface(worker, context, options);
// }

const { Component: _Component } = await import('./component.js');

function mutateScript(scriptSrc, namespaceHash) {
  let result = `let _LURP=await import("lurp");${scriptSrc}`
    .replace(/(class[\s\w$]*extends[^\S\n\r]+)(Component)(\s*\{)/, '$1_LURP.Component$3')
    .replace(/(static\s*ELEMENT_NAME\s*=\s*)(['"])([^\2]*?)\2/, `static __ = (function(){let name=$2$3$2;this.ELEMENT_NAME=name;this.NAMESPACE='${namespaceHash}';customElements.define(name, this);return name;}).call(this)`);

  return result;
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = {};

function getAllEventNamesForElement(element) {
  let tagName = element.tagName.toUpperCase();
  if (EVENT_NAME_CACHE[tagName])
    return EVENT_NAME_CACHE[tagName];

  let eventNames = [];

  for (let key in element) {
    if (key.length > 2 && IS_EVENT_NAME.test(key))
      eventNames.push(key.toLowerCase());
  }

  EVENT_NAME_CACHE[tagName] = eventNames;

  return eventNames;
}

function mutateTemplate(ownerDocument, templateElement) {
  const walkNodes = (node) => {
    if (!node)
      return node;

    let newChildren = Array.from(node.childNodes || []).map((_child) => {
      let child = walkNodes(_child);

      if (child.nodeType === Node.ELEMENT_NODE) {
        let eventNames = getAllEventNamesForElement(child);
        Array.from(child.attributes).forEach((attribute) => {
          let attributeName = attribute.nodeName;
          let lowerAttrName = attributeName.toLowerCase();

          if (eventNames.indexOf(lowerAttrName) >= 0) {
            child.removeAttributeNode(attribute);
            child.setAttribute('data-joy-event-action', attribute.value);
            child.setAttribute('data-joy-event-name', lowerAttrName.substring(2));
          }
        });
      }

      return child;
    });

    if (typeof node.replaceChildren === 'function') {
      node.replaceChildren(...newChildren);
    } else if (typeof node.removeChild === 'function') {
      while (node.childNodes.length)
        node.removeChild(node.childNodes[0]);

      for (let i = 0, il = newChildren.length; i < il; i++) {
        let child = newChildren[i];
        node.appendChild(child);
      }
    }

    return node;
  };

  let newTemplate = templateElement.cloneNode(true);
  walkNodes(newTemplate.content);

  return newTemplate;
}

export function loadComponentFromSource(ownerDocument, sourceString) {
  let template      = ownerDocument.createElement('template');
  let namespaceHash = `ID${SHA256(sourceString)}`;

  template.innerHTML = sourceString;

  let children = Array.from(template.content.children).sort((a, b) => {
    let x = a.tagName;
    let y = b.tagName;

    // eslint-disable-next-line eqeqeq
    if (x == y)
      return 0;

    return (x < y) ? 1 : -1;
  });

  for (let child of children) {
    if ((/^(template)$/i).test(child.tagName)) {
      _Component.addTemplateToRegistry(namespaceHash, mutateTemplate(ownerDocument, child));
    } else if ((/^(script)$/i).test(child.tagName)) {
      let childClone = ownerDocument.createElement(child.tagName);

      childClone.setAttribute('type', 'module');
      childClone.innerHTML = mutateScript(child.textContent, namespaceHash);
      ownerDocument.head.appendChild(childClone);
    }
  }
}

class Require extends _Component {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let response = await fetch(src);
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

      let body = await response.text();
      loadComponentFromSource(this.ownerDocument, body);
    } catch (error) {
      console.error(`o-require: Failed to load specified resource: ${src}`, error);
    }
  }

  unmounted() {
    console.log('unmounted', arguments, this.children);
  }
}

customElements.define('o-require', Require);
