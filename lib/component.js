import * as Utils       from './utils.js';
import { QueryEngine }  from './query-engine.js';
import * as Elements    from './elements.js';

function formatRuleSet(rule, callback) {
  if (!rule.selectorText)
    return rule.cssText;

  let _body   = rule.cssText.substring(rule.selectorText.length).trim();
  let result  = (callback(rule.selectorText, _body) || []).filter(Boolean);
  if (!result)
    return '';

  return result.join(' ');
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
        return `${content}[data-mythix-name="${elementName}"]`;

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
        let modified = selector.replace(/(:host(?:-context)?)(\(\s*[^)]+?\s*\))?/, handleHost);
        return (modified === selector) ? null : modified;
      }).filter(Boolean).join(',').replace(/@@@TAG\[(\d+)\]@@@/, (m, index) => {
        return tags[+index];
      });

      if (!updatedSelector)
        return;

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
    if (!ownerDocument.head.querySelector(`style#${styleID}`)) {
      let clonedStyleElement = templateChild.cloneNode(true);
      ownerDocument.head.appendChild(clonedStyleElement);

      let newStyleSheet = compileStyleForDocument(componentName, clonedStyleElement);
      ownerDocument.head.removeChild(clonedStyleElement);

      let styleNode = ownerDocument.createElement('style');
      styleNode.setAttribute('data-mythix-for', this.sensitiveTagName);
      styleNode.setAttribute('id', styleID);
      styleNode.innerHTML = newStyleSheet;

      document.head.appendChild(styleNode);
    }
  }
}

export class MythixUIComponent extends HTMLElement {
  static compileStyleForDocument = compileStyleForDocument;
  static register = function(_name, Klass) {
    let name = _name || this.tagName;
    if (!customElements.get(name))
      customElements.define(name, Klass || this);

    return this;
  };

  constructor() {
    super();

    Utils.bindMethods.call(this, this.constructor.prototype, [ Object.getPrototypeOf(this.constructor.prototype) ]);

    Object.defineProperties(this, {
      'sensitiveTagName': {
        enumerable:   false,
        configurable: true,
        get:          () => ((this.prefix) ? `${this.prefix}:${this.localName}` : this.localName),
      },
      'templateID': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.TEMPLATE_ID,
      },
      'delayTimers': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        new Map(),
      },
      'documentInitialized': {
        enumerable:   false,
        configurable: true,
        get:          () => Utils.metadata(this.constructor, '_mythixUIDocumentInitialized'),
        set:          (value) => {
          Utils.metadata(this.constructor, '_mythixUIDocumentInitialized', !!value);
        },
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
        value:        this.getComponentTemplate(),
      },
    });
  }

  injectStyleSheet(content) {
    let styleID       = Utils.SHA256(`IDSTYLE${this.sensitiveTagName}:${content}`);
    let ownerDocument = this.ownerDocument || document;
    let styleElement  = ownerDocument.querySelector(`style#${styleID}`);

    if (styleElement)
      return styleElement;

    styleElement = ownerDocument.createElement('style');
    styleElement.setAttribute('data-mythix-for', this.sensitiveTagName);
    styleElement.setAttribute('id', styleID);
    styleElement.innerHTML = content;

    document.head.appendChild(styleElement);

    return styleElement;
  }

  formatTemplateNodes(node) {
    if (!node)
      return node;

    for (let childNode of Array.from(node.childNodes)) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        childNode.nodeValue = Utils.formatTerm(this, childNode);
      } else if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType >= Node.DOCUMENT_NODE) {
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
    // Check environment support
    if (typeof this.attachShadow !== 'function')
      return;

    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  getComponentTemplate() {
    if (!this.ownerDocument)
      return;

    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  appendTemplateToShadowDOM(_template) {
    let template = _template || this.template;
    if (template) {
      ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      let formattedTemplate = this.formatTemplateNodes(template.content.cloneNode(true));
      this.shadow.appendChild(formattedTemplate);
    }
  }

  connectedCallback() {
    this.setAttribute('component-name', this.sensitiveTagName);

    this.appendTemplateToShadowDOM();

    this.mounted();

    this.documentInitialized = true;

    this.fetchSrc();
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
    let argIndex    = 0;
    let options     = (Utils.isPlainObject(args[argIndex])) ? Object.assign(Object.create(null), args[argIndex++]) : {};
    let queryEngine = QueryEngine.from.call(this, { root: this, ...options, invokeCallbacks: false }, ...args.slice(argIndex));
    let shadowNodes;

    options = queryEngine.getOptions();

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
      queryEngine = queryEngine.add(shadowNodes);

    if (options.slotted !== true)
      queryEngine = queryEngine.slotted(false);

    if (typeof options.callback === 'function')
      return this.$(queryEngine.map(options.callback));

    return queryEngine;
  }

  build(callback) {
    let result = [ callback(Elements, {}) ].flat(Infinity).map((item) => {
      if (item && item[Elements.UNFINISHED_DEFINITION])
        return item();

      return item;
    }).filter(Boolean);

    return QueryEngine.from.call(this, result);
  }

  metadata(key, value) {
    return Utils.metadata(this, key, value);
  }

  dynamicProp(name, _getter, _setter, _context) {
    let isGetterFunc  = (typeof _getter === 'function');
    let internalValue = (isGetterFunc) ? undefined : _getter;
    let getter        = (isGetterFunc) ? _getter : () => internalValue;
    let setter        = (typeof _setter === 'function') ? _setter : (newValue) => {
      internalValue = newValue;
    };

    let value   = new Utils.DynamicProperty(getter, setter);
    let context = _context || this;

    Object.defineProperties(context, {
      [name]: {
        enumerable:   true,
        configurable: true,
        get:          () => value.value,
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
      if (typeof value === 'function')
        continue;

      this.dynamicProp(key, value, undefined, data);
    }

    return data;
  }

  debounce(callback, ms, _id) {
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

  classes(..._args) {
    let args = _args.flat(Infinity).map((item) => {
      if (Utils.isType(item, 'String'))
        return item.trim();

      if (Utils.isPlainObject(item)) {
        let keys  = Object.keys(item);
        let items = [];

        for (let i = 0, il = keys.length; i < il; i++) {
          let key   = keys[i];
          let value = item[key];
          if (!value)
            continue;

          items.push(key);
        }

        return items;
      }

      return null;
    }).flat(Infinity).filter(Boolean);

    return Array.from(new Set(args)).join(' ');
  }

  fetchSrc() {
    let src = this.getAttribute('src');
  }
}
