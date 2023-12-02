import * as Utils from './utils.js';

const { Component: _Component } = await import('./component.js');

// function mutateTemplate(ownerDocument, templateElement) {
//   const walkNodes = (node) => {
//     if (!node)
//       return node;

//     let newChildren = Array.from(node.childNodes || []).map((_child) => {
//       let child = walkNodes(_child);

//       if (child.nodeType === Node.ELEMENT_NODE) {
//         let eventNames = Utils.getAllEventNamesForElement(child);
//         Array.from(child.attributes).forEach((attribute) => {
//           let attributeName = attribute.nodeName;
//           let lowerAttrName = attributeName.toLowerCase();

//           if (eventNames.indexOf(lowerAttrName) >= 0) {
//             child.removeAttributeNode(attribute);
//             child.setAttribute('data-mythix-event-action', attribute.value);
//             child.setAttribute('data-mythix-event-name', lowerAttrName.substring(2));
//           }
//         });
//       }

//       return child;
//     });

//     if (typeof node.replaceChildren === 'function') {
//       node.replaceChildren(...newChildren);
//     } else if (typeof node.removeChild === 'function') {
//       while (node.childNodes.length)
//         node.removeChild(node.childNodes[0]);

//       for (let i = 0, il = newChildren.length; i < il; i++) {
//         let child = newChildren[i];
//         node.appendChild(child);
//       }
//     }

//     return node;
//   };

//   let newTemplate = templateElement.cloneNode(true);
//   walkNodes(newTemplate.content);

//   return newTemplate;
// }

export function loadComponentFromSource(ownerDocument, baseURL, sourceString) {
  let template = ownerDocument.createElement('template');

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
      ownerDocument.body.appendChild(child);
    } else if ((/^(script)$/i).test(child.tagName)) {
      let childClone = ownerDocument.createElement(child.tagName);
      for (let attributeName of child.getAttributeNames())
        childClone.setAttribute(attributeName, child.getAttribute(attributeName));

      let src = child.getAttribute('src');
      if (src) {
        if ((/^\.\/|[^:]*\/|/).test(src)) {
          let newSrc = new URL(baseURL.toString());
          newSrc.pathname += src;
          src = newSrc;
        } else {
          src = new URL(src);
        }

        childClone.setAttribute('src', src.toString());
      } else {
        childClone.setAttribute('type', 'module');
        childClone.innerHTML = child.textContent;
      }

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

      let baseURL = new URL(response.url);
      baseURL.pathname = baseURL.pathname.replace(/[^/]+$/, '');

      let body = await response.text();
      loadComponentFromSource(this.ownerDocument, baseURL, body);
    } catch (error) {
      console.error(`mythix-require: Failed to load specified resource: ${src}`, error);
    }
  }
}

customElements.define('mythix-require', Require);
