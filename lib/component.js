import * as Utils       from './utils.js';
import { QueryEngine }  from './query-engine.js';
import * as Elements    from './elements.js';

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
        return `${content}[data-mythix-component-name="${elementName}"]`;

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
  let objID             = Utils.getObjID(template);
  let templateID        = Utils.SHA256(objID);
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
      styleNode.setAttribute('data-mythix-for', this.elementName);
      styleNode.setAttribute('id', styleID);
      styleNode.innerHTML = newStyleSheet;

      document.head.appendChild(styleNode);
    }
  }
}

export class Component extends HTMLElement {
  static compileStyleForDocument = compileStyleForDocument;
  static register = function(name) {
    customElements.define(name || this.tagName, this);
  };

  constructor() {
    super();

    Utils.bindMethods.call(this, this.constructor.prototype, [ Object.getPrototypeOf(this.constructor.prototype) ]);

    Object.defineProperties(this, {
      'componentName': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.name,
      },
      'elementName': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.tagName,
      },
      'templateID': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.TEMPLATE_ID,
      },
      'Utils': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        Utils,
      },
      'delayTimers': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        new Map(),
      },
    });

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
    });
  }

  formatTemplateNodes(node) {
    if (!node)
      return node;

    for (let childNode of Array.from(node.childNodes)) {
      if (childNode.nodeType === Utils.TEXT_NODE) {
        childNode.nodeValue = Utils.formatTerm(this, childNode);
      } else if (childNode.nodeType === Utils.ELEMENT_NODE || childNode.nodeType >= Utils.DOCUMENT_NODE) {
        childNode = this.formatTemplateNodes(childNode);

        let eventNames      = Utils.getAllEventNamesForElement(childNode);
        let attributeNames  = childNode.getAttributeNames();
        for (let i = 0, il = attributeNames.length; i < il; i++) {
          let attributeName       = attributeNames[i];
          let lowerAttributeName  = attributeName.toLowerCase();
          let attributeValue      = childNode.getAttribute(attributeName);

          if (eventNames.indexOf(lowerAttributeName) >= 0) {
            Utils.bindEventToElement(this, childNode, lowerAttributeName.substring(2), attributeValue);
            childNode.removeAttribute(attributeName);
          } else if (Utils.stringIsDynamicBindingTemplate(attributeValue)) {
            let attributeNode = childNode.getAttributeNode(attributeName);
            attributeNode.nodeValue = Utils.formatTerm(this, attributeNode);
          }
        }
      }
    }

    return node;
  }

  createShadowDOM(options) {
    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  createComponentTemplate() {
    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.elementName}"],template[for="${this.elementName}"]`);
  }

  connectedCallback() {
    let elementName = this.elementName;
    if (elementName)
      this.setAttribute('data-mythix-component-name', elementName);

    if (this.template) {
      ensureDocumentStyles.call(this, this.ownerDocument, elementName, this.template);

      let formattedTemplate = this.formatTemplateNodes(this.template.content.cloneNode(true));
      this.shadow.appendChild(formattedTemplate);
    }

    this.mounted();
  }

  disconnectedCallback() {
    this.unmounted();
  }

  attributeChangedCallback(...args) {
    return this.attributeChanged(...args);
  }

  adoptedCallback(...args) {
    return this.adopted(...args);
  }

  mounted() {}
  unmounted() {}
  attributeChanged() {}
  adopted() {}

  $(...args) {
    let queryEngine = QueryEngine.from.call(this, { root: this, invokeCallbacks: false }, ...args);
    let options     = queryEngine.getOptions();
    let shadowNodes;

    if (options.shadow !== false && options.selector && options.root === this) {
      shadowNodes = Array.from(
        QueryEngine.from.call(
          this,
          { root: this.shadow },
          options.selector,
          options.callback,
        ).values(),
      );
    }

    if (shadowNodes)
      queryEngine = queryEngine.addToQuery(shadowNodes);

    if (typeof options.callback === 'function')
      return this.$(queryEngine.map(options.callback));

    return queryEngine;
  }

  build(callback) {
    return QueryEngine.from.call(this, [ callback(Elements, {}) ]);
  }

  metadata(target, key, value) {
    return Utils.metadata(target, key, value);
  }

  createDynamicProperty(name, _value, _context) {
    let value   = new Utils.DynamicProperty(_value);
    let context = _context || this;

    Object.defineProperties(context, {
      [name]: {
        enumerable:   false,
        configurable: true,
        get:          () => value,
        set:          (newValue) => {
          value.set(this, newValue);
        },
      },
    });
  }

  dynamicData(obj) {
    let keys = Object.keys(obj);
    let data = Object.create(null);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = obj[key];

      this.createDynamicProperty(key, value, data);
    }

    return data;
  }

  delay(callback, ms, _id) {
    var id = _id;

    // If we don't get an id from the user, then guess the id by turning the function
    // into a string (raw source) and use that for an id instead
    if (id == null) {
      id = ('' + callback);

      // If this is a transpiled code, then an async generator will be used for async functions
      // This wraps the real function, and so when converting the function into a string
      // it will NOT be unique per call-site. For this reason, if we detect this issue,
      // we will go the "slow" route and create a stack trace, and use that for the unique id
      if (id.match(/asyncGeneratorStep/)) {
        id = (new Error()).stack;
        console.warn('mythix-ui warning: "this.delay" called without a specified "id" parameter. This will result in a performance hit. Please specify and "id" argument for your call: "this.delay(callback, ms, \'some-custom-call-site-id\')"');
      }
    } else {
      id = ('' + id);
    }

    console.log('id', id);

    let promise = this.delayTimers.get(id);
    if (promise) {
      if (promise.timerID)
        clearTimeout(promise.timerID);

      promise.reject('cancelled');
    }

    promise = Utils.createResolvable();
    this.delayTimers.set(id, promise);

    // Let's not complain about
    // uncaught errors
    promise.catch(() => {});

    promise.timerID = setTimeout(async () => {
      try {
        let result = await callback();
        promise.resolve(result);
      } catch (error) {
        console.error('Error encountered while calling "delay" callback: ', error, callback.toString());
        promise.reject(error);
      }
    }, ms || 0);

    return promise;
  }
}
