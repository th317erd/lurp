import * as Utils       from './utils.js';
import { QueryEngine }  from './query-engine.js';
import ProxyClass       from 'prixi';

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

function formatRuleSet(rule, callback) {
  let _body = rule.cssText.substring(rule.selectorText.length).trim();
  return callback(rule.selectorText, _body).filter(Boolean).join(' ');
}

function cssRulesToSource(cssRules, callback) {
  return Array.from(cssRules || []).map((rule) => {
    let ruleStr = formatRuleSet(rule, callback);
    return `${cssRulesToSource(rule.cssRules, callback)}${ruleStr}`;
  }).join('\n\n');
}

function compileStyleForDocument(elementName, styleElement) {
  const handleHost = (m, type, _content) => {
    let content = (!_content) ? _content : _content.replace(/^\(/, '').replace(/\)$/, '');

    if (type === ':host') {
      if (!content)
        return elementName;

      // Element selector?
      if ((/^[a-zA-Z_]/).test(content))
        return `${content}[data-joy-name="${elementName}"]`;

      return `${elementName}${content}`;
    } else {
      return `${content} ${elementName}`;
    }
  };

  return cssRulesToSource(
    styleElement.sheet.cssRules,
    (_selector, body) => {
      let selector = _selector;
      let tags     = [];

      let updatedSelector = selector.replace(/(['"])(?:\\.|[^\1])+?\1/, (m) => {
        let index = tags.length;
        tags.push(m);
        return `@@@TAG[${index}]@@@`;
      }).split(',').map((selector) => {
        return selector.replace(/(:host(?:-context)?)(\(\s*[^)]+?\s*\))?/, handleHost);
      }).join(',').replace(/@@@TAG\[(\d+)\]@@@/, (m, index) => {
        return tags[+index];
      });

      return [ updatedSelector, body ];
    },
  );
}

function ensureDocumentStyles(ownerDocument, componentName, template) {
  let templateID        = Utils.SHA256(Utils.deadbeef(template));
  let templateChildren  = Array.from(template.content.childNodes);
  let index             = 0;

  for (let templateChild of templateChildren) {
    if (!(/^style$/i).test(templateChild.tagName))
      continue;

    let styleID = `IDSTYLE${templateID}${++index}`;
    if (!ownerDocument.head.querySelector(`#${styleID}`)) {
      let clonedStyleElement = templateChild.cloneNode(true);
      ownerDocument.head.appendChild(clonedStyleElement);

      let newStyleSheet = compileStyleForDocument(componentName, clonedStyleElement);
      ownerDocument.head.removeChild(clonedStyleElement);

      let styleNode = ownerDocument.createElement('style');
      styleNode.setAttribute('id', styleID);
      styleNode.innerHTML = newStyleSheet;

      document.head.appendChild(styleNode);
    }
  }
}

export class Component extends HTMLElement {
  static compileStyleForDocument  = compileStyleForDocument;
  static addTemplateToRegistry    = addTemplateToRegistry;
  static getTemplateFromRegistry  = getTemplateFromRegistry;

  constructor() {
    super();

    Utils.bindMethods.call(this, this.constructor.prototype, [ Object.getPrototypeOf(this.constructor.prototype) ]);

    Object.defineProperties(this, {
      'shadow': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        this.createShadowDOM(),
      },
      'template': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        this.createComponentTemplate(),
      },
      'componentName': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        this.constructor.name,
      },
      'elementName': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        this.constructor.ELEMENT_NAME,
      },
      'namespaceHash': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        this.constructor.NAMESPACE,
      },
    });

    if (this.template)
      this.shadow.appendChild(this.template.content.cloneNode(true));
  }

  createShadowDOM(options) {
    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  createComponentTemplate() {
    let template = getTemplateFromRegistry(this.constructor.NAMESPACE, this.constructor.name);
    return template;
  }

  bindAttributeEvents() {
    const createEventCallback = (functionBody) => {
      return (new Function('event', `let e=event;let ev=event;let evt=event;return ${functionBody.replace(/^\s*return\s*/, '')};`)).bind(this);
    };

    this.$('[data-joy-event-action]', (element) => {
      let action    = element.getAttribute('data-joy-event-action');
      let eventName = element.getAttribute('data-joy-event-name');

      if (!action || !eventName)
        return element;

      let eventCallback = createEventCallback(action);
      this.metadata(element, `/${this.elementName}/events/bindings/${eventName}`);
      element.addEventListener(eventName, eventCallback);

      return element;
    });
  }

  connectedCallback() {
    let elementName = this.elementName;
    if (elementName)
      this.setAttribute('data-joy-name', elementName);

    if (this.template) {
      ensureDocumentStyles(this.ownerDocument, elementName, this.template);
      this.bindAttributeEvents();
    }

    this.mounted();
  }

  disconnectedCallback() {
    this.unmounted();
  }

  mounted() {}
  unmounted() {}

  $(...args) {
    let [
      element,
      selector,
      callback,
      options,
    ] = QueryEngine.collectQueryEngineArgs.apply(this, args);

    let shadowNodes;
    if (options.shadow !== false && element === this) {
      shadowNodes = Array.from(
        QueryEngine.from(this.shadow, selector, callback).values(),
      );
    }

    let query = QueryEngine.from(element, selector, callback);
    if (shadowNodes)
      query = query.add(shadowNodes);

    return query;
  }

  metadata(target, key, value) {
    return Utils.metadata(target, key, value);
  }
}
