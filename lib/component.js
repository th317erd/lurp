import { SHA256, deadbeef } from './utils.js';

// import {
//   EntityDefinition,
//   EntityInstance,
//   markNoChildren,
// } from './entity.js';

// import { TYPE_COMPONENT } from './constants.js';

// export const INTERNAL_COMPONENT_PROPS = {
//   key: undefined,
//   ref: undefined,
// };

// export class CustomPropertyHandler {
//   static filterOutCustomPropHandlers(props) {
//     let newObj  = Object.create(null);
//     let keys    = Object.keys(props);

//     for (let i = 0, il = keys.length; i < il; i++) {
//       let key   = keys[i];
//       let value = props[key];

//       if (value instanceof CustomPropertyHandler)
//         continue;

//       newObj[key] = value;
//     }

//     return newObj;
//   }

//   constructor(callback) {
//     Object.defineProperties(this, {
//       'callback': {
//         writable:     false,
//         enumerable:   false,
//         configurable: false,
//         value:        callback,
//       },
//     });
//   }
// }

// export class ComponentDefinition extends EntityDefinition {
//   constructor(_options) {
//     let options = _options || {};

//     super({
//       ...options,
//       type: TYPE_COMPONENT,
//     });

//     Object.defineProperties(this, {
//       'renderMethod': {
//         writable:     false,
//         enumerable:   true,
//         configurable: false,
//         value:        options.renderMethod,
//       },
//     });
//   }

//   clone(options) {
//     return super.clone({
//       renderMethod: this.renderMethod,
//       ...(options || {}),
//     });
//   }
// }

// export class ComponentInstance extends EntityInstance {
//   constructor(definition) {
//     super(definition);

//     Object.defineProperties(this, {
//       'state': {
//         writable:     true,
//         enumerable:   false,
//         configurable: false,
//         value:        [],
//       },
//     });
//   }

//   render(entityDefinition) {
//     let stateCounter = 0;

//     const useState = (defaultValue) => {
//       const setter = (value) => {
//         let currentValue = this.state[index];

//         if (currentValue !== value) {
//           // TODO: Trigger update
//           this.state[index] = value;
//         }
//       };

//       let index = stateCounter;
//       let value;

//       if (index >= this.state.length) {
//         value = defaultValue;
//         this.state.push(value);
//       } else {
//         value = this.state[index];
//       }

//       stateCounter++;

//       return [ value, setter ];
//     };

//     return entityDefinition.render.call(
//       entityDefinition,
//       entityDefinition.props,
//       {
//         useState,
//       },
//       entityDefinition,
//     );
//   }
// }

// export function create(renderMethod, _componentProps, defaultProps, _DefinitionKlass) {
//   let componentProps = Object.assign(
//     Object.create(null),
//     (_componentProps || {}),
//     INTERNAL_COMPONENT_PROPS,
//   );

//   const DefinitionKlass = _DefinitionKlass || ComponentDefinition;

//   const Component = (props, ...children) => {
//     let componentDefinition = new DefinitionKlass({ props, children, renderMethod });
//     return componentDefinition;
//   };

//   const assignPropHelpers = (_method, _props) => {
//     const props   = _props;
//     const method  = _method.bind(this, props);

//     Object.keys(componentProps || {}).forEach((propName) => {
//       let propValue = componentProps[propName];

//       Object.defineProperty(method, propName, {
//         writable:     false,
//         enumerable:   false,
//         configurable: false,
//         value:        (propValue instanceof CustomPropertyHandler) ? (...args) => {
//           return propValue.callback.call(this, { assignPropHelpers, Component, props }, ...args);
//         } : (value) => {
//           let newProps = Object.assign(
//             Object.create(null),
//             props,
//             {
//               [propName]: value,
//             },
//           );

//           return assignPropHelpers((...children) => {
//             return Component(newProps, ...children);
//           }, newProps);
//         },
//       });
//     });

//     Object.defineProperty(method, 'assign', {
//       writable:     false,
//       enumerable:   false,
//       configurable: false,
//       value:        (...args) => {
//         let newProps = Object.assign(
//           Object.create(null),
//           props,
//           ...args,
//         );

//         return assignPropHelpers((...children) => {
//           return Component(newProps, ...children);
//         }, newProps);
//       },
//     });

//     markNoChildren(method);

//     return method;
//   };

//   return assignPropHelpers(
//     Component,
//     CustomPropertyHandler.filterOutCustomPropHandlers(
//       Object.assign(
//         Object.create(null),
//         defaultProps,
//         componentProps || {},
//       ),
//     ),
//   );
// }

const TEMPLATE_REGISTRY = globalThis.TEMPLATE_REGISTRY || new Map();
if (!globalThis.TEMPLATE_REGISTRY) {
  Object.defineProperties(globalThis, {
    'TEMPLATE_REGISTRY': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        TEMPLATE_REGISTRY,
    },
  });
}

function addTemplateToRegistry(namespace, template) {
  let collection = TEMPLATE_REGISTRY.get(namespace);
  if (!collection) {
    collection = new Map();
    TEMPLATE_REGISTRY.set(namespace, collection);
  }

  let forName = template.getAttribute('for') || '_default';
  collection.set(forName, template);
}

function getTemplateFromRegistry(namespace, className) {
  let collection = TEMPLATE_REGISTRY.get(namespace);
  if (!collection)
    return;

  let template = collection.get(className);
  if (!template)
    return collection.get('_default');

  return template;
}

const IS_TAGNAME_SELECTOR_RE  = /^[a-z][\w.-]*/i;
const HOST_SELECTOR_RE        = /:host(?:-context)?\s*\(([^)]+)\)/i;

function createStyleForDocument(elementName, styleSrc) {
  return styleSrc.replace(/(^|\b|\s+)(\S[^{]+?)\{/g, (_, prefixWS, selector) => {
    let newSelector = selector.replace(/^(\s*)(.*)(\s*)$/, (_, bw, selector, aw) => {
      let finalSelector = selector.split(',').map((subSelector) => {
        let hostFunc = subSelector.match(HOST_SELECTOR_RE);
        if (hostFunc) {
          if ((/^:host-context/i).test(hostFunc[0])) {
            return subSelector.replace(HOST_SELECTOR_RE, `$1 ${elementName}`);
          } else {
            if ((IS_TAGNAME_SELECTOR_RE).test(hostFunc[1]))
              return subSelector.replace(HOST_SELECTOR_RE, `$1[data-component-name="${elementName}"]`);
            else
              return subSelector.replace(HOST_SELECTOR_RE, `${elementName}$1`);
          }
        } else {
          if ((/:host/i).test(subSelector))
            return subSelector.replace(/:host/ig, elementName);
          else
            return `${elementName} ${subSelector}`;
        }
      }).join(',');

      return `${bw}${finalSelector}${aw}`;
    });

    return `${prefixWS}${newSelector}{`;
  });
}

function ensureDocumentStyles(ownerDocument, componentName, template) {
  let templateID        = SHA256(deadbeef(template));
  let templateChildren  = Array.from(template.content.childNodes);
  let index             = 0;

  for (let templateChild of templateChildren) {
    if (!(/^style$/i).test(templateChild.tagName))
      continue;

    let styleID = `IDSTYLE${templateID}${++index}`;
    if (!ownerDocument.head.querySelector(`#${styleID}`)) {
      let newStyleSheet = createStyleForDocument(componentName, templateChild.textContent);

      let styleNode = ownerDocument.createElement('style');
      styleNode.setAttribute('id', styleID);
      styleNode.innerHTML = newStyleSheet;

      document.head.appendChild(styleNode);
    }
  }
}

export class Component extends HTMLElement {
  static createStyleForDocument   = createStyleForDocument;
  static addTemplateToRegistry    = addTemplateToRegistry;
  static getTemplateFromRegistry  = getTemplateFromRegistry;

  constructor() {
    super();

    let componentName = this.constructor.name;
    let template      = getTemplateFromRegistry(this.constructor.NAMESPACE, componentName);

    Object.defineProperties(this, {
      'shadow': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        this.attachShadow({ mode: 'open' }),
      },
      'template': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        template,
      },
    });

    if (template)
      this.shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    let elementName = this.constructor.ELEMENT_NAME;
    if (elementName)
      this.setAttribute('data-component-name', elementName);

    if (this.template)
      ensureDocumentStyles(this.ownerDocument, elementName, this.template);

    this.mounted();
  }

  disconnectedCallback() {
    this.unmounted();
  }

  mounted() {}
  unmounted() {}

  q(selector) {
    return Array.from(this.querySelectorAll(selector));
  }
}
