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

  console.log('BODY: ', result);

  return result;
}

class Require extends _Component {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let response = await fetch(src);
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

      let body      = await response.text();
      let template  = this.ownerDocument.createElement('template');
      let namespaceHash = `ID${SHA256(body)}`;
      let ownerDocument = this.ownerDocument;

      template.innerHTML = body;

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
          _Component.addTemplateToRegistry(namespaceHash, child);
        } else if ((/^(script)$/i).test(child.tagName)) {
          let childClone = ownerDocument.createElement(child.tagName);

          childClone.setAttribute('type', 'module');
          childClone.innerHTML = mutateScript(child.textContent, namespaceHash);
          ownerDocument.head.appendChild(childClone);
        }
      }
    } catch (error) {
      console.error(`o-require: Failed to load specified resource: ${src}`, error);
    }
  }

  unmounted() {
    console.log('unmounted', arguments, this.children);
  }
}

customElements.define('o-require', Require);
