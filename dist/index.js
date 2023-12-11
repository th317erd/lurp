/******/ var __webpack_modules__ = ({

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   getIdentifier: () => (/* binding */ getIdentifier),
/* harmony export */   getVisibilityMeta: () => (/* binding */ getVisibilityMeta),
/* harmony export */   importIntoDocumentFromSource: () => (/* binding */ importIntoDocumentFromSource),
/* harmony export */   loadPartialIntoElement: () => (/* binding */ loadPartialIntoElement),
/* harmony export */   recursivelyBindDynamicData: () => (/* binding */ recursivelyBindDynamicData),
/* harmony export */   remapNodeTree: () => (/* binding */ remapNodeTree),
/* harmony export */   require: () => (/* binding */ require),
/* harmony export */   resolveURL: () => (/* binding */ resolveURL),
/* harmony export */   visibilityObserver: () => (/* binding */ visibilityObserver)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");




const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

class MythixUIComponent extends HTMLElement {
  static compileStyleForDocument = compileStyleForDocument;
  static register = function(_name, _Klass) {
    let name = _name || this.tagName;
    if (!customElements.get(name)) {
      let Klass = _Klass || this;
      Klass.observedAttributes = Klass.compileAttributeMethods(Klass);
      customElements.define(name, Klass);

      let registerEvent = new Event('mythix-component-registered');
      registerEvent.componentName = name;
      registerEvent.component = Klass;

      document.dispatchEvent(registerEvent);
    }

    return this;
  };

  static compileAttributeMethods = function(Klass) {
    let proto = Klass.prototype;
    let names = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllPropertyNames(proto)
      .filter((name) => IS_ATTR_METHOD_NAME.test(name))
      .map((originalName) => {
        let name = originalName.match(IS_ATTR_METHOD_NAME)[1];
        if (REGISTERED_COMPONENTS.has(Klass))
          return name;

        let descriptor = getDescriptorFromPrototypeChain(proto, originalName);

        // If we have a "value" then the
        // user did it wrong... so just
        // make this the "setter"
        let method = descriptor.value;
        if (method)
          return name;

        let originalGet = descriptor.get;
        if (originalGet) {
          Object.defineProperties(proto, {
            [name]: {
              enumerable:   false,
              configurable: true,
              get:          function() {
                let currentValue  = this.getAttribute(name);
                let context       = Object.create(this);
                context.value = currentValue;
                return originalGet.call(context, currentValue);
              },
              set:          function(newValue) {
                this.setAttribute(name, newValue);
              },
            },
          });
        }

        return _utils_js__WEBPACK_IMPORTED_MODULE_0__.toSnakeCase(name);
      });

    REGISTERED_COMPONENTS.add(Klass);

    return names;
  };

  set attr$dataMythixSrc([ newValue, oldValue ]) {
    this.awaitFetchSrcOnVisible(newValue, oldValue);
  }

  constructor() {
    super();

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindMethods.call(this, this.constructor.prototype /*, [ HTMLElement.prototype ]*/);

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
        get:          () => _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this.constructor, '_mythixUIDocumentInitialized'),
        set:          (value) => {
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this.constructor, '_mythixUIDocumentInitialized', !!value);
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

  attr(name, value) {
    if (arguments.length > 1) {
      if (value == null)
        this.removeAttribute(name);
      else
        this.setAttribute(name, value);
    }

    return this.getAttribute(name);
  }

  injectStyleSheet(content) {
    let styleID       = `IDSTYLE${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`${this.sensitiveTagName}:${content}`)}`;
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

  processElements(node, _options) {
    if (!node)
      return node;

    let options = _options || {};
    let disableTemplateEngineSelectorStr = (options.forceTemplateEngine === true) ? undefined : _utils_js__WEBPACK_IMPORTED_MODULE_0__.disableTemplateEngineSelector();
    for (let childNode of Array.from(node.childNodes)) {
      if (disableTemplateEngineSelectorStr && childNode.parentNode && typeof childNode.parentNode.closest === 'function' && childNode.parentNode.closest(disableTemplateEngineSelectorStr))
        continue;

      if (childNode.nodeType === Node.TEXT_NODE) {
        childNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(childNode, this, ...(options.scopes || []));
      } else if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType >= Node.DOCUMENT_NODE) {
        if (!(disableTemplateEngineSelectorStr && childNode && typeof childNode.closest === 'function' && childNode.closest(disableTemplateEngineSelectorStr)))
          childNode = this.processElements(childNode, options);

        let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(childNode);
        let attributeNames  = childNode.getAttributeNames();
        for (let i = 0, il = attributeNames.length; i < il; i++) {
          let attributeName       = attributeNames[i];
          let lowerAttributeName  = attributeName.toLowerCase();
          let attributeValue      = childNode.getAttribute(attributeName);

          if (eventNames.indexOf(lowerAttributeName) >= 0) {
            _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement(childNode, lowerAttributeName.substring(2), attributeValue, childNode, ...(options.scopes || []));
            childNode.removeAttribute(attributeName);
          } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(attributeValue)) {
            let attributeNode = childNode.getAttributeNode(attributeName);
            attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(attributeNode, this, ...(options.scopes || []));
          }
        }
      }
    }

    return node;
  }

  attachShadow(options) {
    // Check environment support
    if (typeof super.attachShadow !== 'function')
      return;

    let shadow = super.attachShadow(options);
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(shadow, _utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT, this);

    return shadow;
  }

  createShadowDOM(options) {
    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  getComponentTemplate() {
    if (!this.ownerDocument)
      return;

    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  appendTemplateToShadowDOM(_template) {
    let template = _template || this.template;
    if (template) {
      ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      let formattedTemplate = this.processElements(template.content.cloneNode(true));
      this.shadow.appendChild(formattedTemplate);
    }
  }

  connectedCallback() {
    this.setAttribute('data-mythix-component-name', this.sensitiveTagName);

    this.appendTemplateToShadowDOM();
    this.processElements(this);

    this.mounted();

    this.documentInitialized = true;

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.nextTick(() => {
      this.classList.add('mythix-ready');
    });
  }

  disconnectedCallback() {
    this.unmounted();
  }

  awaitFetchSrcOnVisible(newSrc) {
    if (this.visibilityObserver) {
      this.visibilityObserver.unobserve(this);
      this.visibilityObserver = null;
    }

    if (!newSrc)
      return;

    let observer = visibilityObserver(({ wasVisible, disconnect }) => {
      if (!wasVisible)
        this.fetchSrc(this.getAttribute('data-mythix-src'));

      disconnect();

      this.visibilityObserver = null;
    }, { elements: [ this ] });

    Object.defineProperties(this, {
      'visibilityObserver': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        observer,
      },
    });
  }

  attributeChangedCallback(...args) {
    let [
      name,
      oldValue,
      newValue,
    ] = args;

    if (oldValue !== newValue) {
      let magicName   = `attr$${_utils_js__WEBPACK_IMPORTED_MODULE_0__.toCamelCase(name)}`;
      let descriptor  = getDescriptorFromPrototypeChain(this, magicName);
      if (descriptor && typeof descriptor.set === 'function') {
        // Call setter
        this[magicName] = [ args[2], args[1] ].concat(args.slice(3));
        return;
      }
    }

    return this.attributeChanged(...args);
  }

  adoptedCallback(...args) {
    return this.adopted(...args);
  }

  mounted() {}
  unmounted() {}
  attributeChanged() {}
  adopted() {}

  get $$() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.createProxyContext(this);
  }

  $(...args) {
    let argIndex    = 0;
    let options     = (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject(args[argIndex])) ? Object.assign(Object.create(null), args[argIndex++]) : {};
    let queryEngine = _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(this, { root: this, ...options, invokeCallbacks: false }, ...args.slice(argIndex));
    let shadowNodes;

    options = queryEngine.getOptions();

    if (options.shadow !== false && options.selector && options.root === this) {
      shadowNodes = Array.from(
        _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(
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
    let result = [ callback(_elements_js__WEBPACK_IMPORTED_MODULE_2__.ElementGenerator, {}) ].flat(Infinity).map((item) => {
      if (item && item[_elements_js__WEBPACK_IMPORTED_MODULE_2__.UNFINISHED_DEFINITION])
        return item();

      return item;
    }).filter(Boolean);

    return _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(this, result);
  }

  isAttributeTruthy(name) {
    if (!this.hasAttribute(name))
      return false;

    let value = this.getAttribute(name);
    if (value === '' || value === 'true')
      return true;

    return false;
  }

  getIdentifier() {
    return this.getAttribute('id') || this.getAttribute('name') || this.getAttribute('data-name') || _utils_js__WEBPACK_IMPORTED_MODULE_0__.toCamelCase(this.sensitiveTagName);
  }

  metadata(key, value) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this, key, value);
  }

  dynamicProp(name, defaultValue, setter, _context) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.dynamicProp.call(_context || this, name, defaultValue, setter);
  }

  dynamicData(obj) {
    let keys = Object.keys(obj);
    let data = Object.create(null);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = obj[key];
      if (typeof value === 'function')
        continue;

      _utils_js__WEBPACK_IMPORTED_MODULE_0__.dynamicProp.call(data, key, value);
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

    promise = _utils_js__WEBPACK_IMPORTED_MODULE_0__.createResolvable();
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
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, 'String'))
        return item.trim();

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject(item)) {
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

  async fetchSrc(srcURL) {
    if (!srcURL)
      return;

    try {
      await loadPartialIntoElement.call(this, srcURL);
      this.classList.add('mythix-ready');
    } catch (error) {
      console.error(`"${this.sensitiveTagName}": Failed to load specified resource: ${srcURL} (resolved to: ${error.url})`, error);
    }
  }
}

function getIdentifier(target) {
  if (!target)
    return 'undefined';

  if (typeof target.getIdentifier === 'function')
    return target.getIdentifier.call(target);

  if (target instanceof Element)
    return target.getAttribute('id') || target.getAttribute('name') || target.getAttribute('data-name') || _utils_js__WEBPACK_IMPORTED_MODULE_0__.toCamelCase(target.localName);

  return 'undefined';
}

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
  let objID             = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getObjID(template);
  let templateID        = _utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(objID);
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

function getDescriptorFromPrototypeChain(startProto, descriptorName) {
  let thisProto = startProto;
  let descriptor;

  while (thisProto && !(descriptor = Object.getOwnPropertyDescriptor(thisProto, descriptorName)))
    thisProto = Object.getPrototypeOf(thisProto);

  return descriptor;
}

const SCHEME_RE     = /^[\w-]+:\/\//;
const HAS_FILENAME  = /\.[^/.]+$/;

function resolveURL(location, _urlish, magic) {
  let urlish = _urlish;
  if (urlish instanceof URL)
    return urlish;

  if (!urlish)
    return new URL(location);

  if (urlish instanceof Location)
    return new URL(urlish);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(urlish, 'String'))
    return;

  const internalResolve = (_location, _urlPart, magic) => {
    let originalURL = urlish;
    if (SCHEME_RE.test(urlish))
      return urlish;

    // Magic!
    if (magic === true && !HAS_FILENAME.test(urlish)) {
      let parts     = urlish.split('/').map((part) => part.trim()).filter(Boolean);
      let lastPart  = parts[parts.length - 1];
      if (lastPart)
        urlish = `${urlish.replace(/\/+$/, '')}/${lastPart}.html`;
    }

    let location = new URL(_location);
    return {
      url: new URL(`${location.origin}${location.pathname}${urlish}`.replace(/\/{2,}/g, '/')),
      originalURL,
    };
  };

  let {
    url,
    originalURL,
  } = internalResolve(location, urlish.toString(), magic);

  if (typeof globalThis.mythixUI.urlResolver === 'function') {
    let fileName;
    let path;

    url.pathname.replace(/(.*\/)([^/]+)$/, (m, first, second) => {
      path = first;
      fileName = second;
      return m;
    });

    let newSrc = globalThis.mythixUI.urlResolver.call(this, { src: originalURL, url, path, fileName });
    if (newSrc === false) {
      console.warn(`"mythix-require": Not loading "${originalURL}" because the global "mythixUI.urlResolver" requested I not do so.`);
      return;
    }

    if (newSrc !== originalURL)
      url = resolveURL.call(this, location, newSrc, magic);
  }

  return url;
}

const IS_TEMPLATE   = /^(template)$/i;
const IS_SCRIPT     = /^(script)$/i;
const REQUIRE_CACHE = new Map();

function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
  let options   = _options || {};
  let url       = resolveURL.call(this, location, _url, options.magic);
  let fileName;
  let baseURL   = new URL(`${url.origin}${url.pathname.replace(/[^/]+$/, (m) => {
    fileName = m;
    return '';
  })}${url.search}${url.hash}`);

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

  const fileNameToElementName = (fileName) => {
    return fileName.trim().replace(/\..*$/, '').replace(/\b[A-Z]|[^A-Z][A-Z]/g, (_m) => {
      let m = _m.toLowerCase();
      return (m.length < 2) ? `-${m}` : `${m.charAt(0)}-${m.charAt(1)}`;
    }).replace(/-{2,}/g, '-').replace(/^[^a-z]*/, '').replace(/[^a-z]*$/, '');
  };

  let guessedElementName  = fileNameToElementName(fileName);
  let context             = {
    guessedElementName,
    children,
    ownerDocument,
    template,
    url,
    baseURL,
    fileName,
  };

  if (typeof options.preProcess === 'function') {
    template = context.template = options.preProcess.call(this, context);
    children = Array.from(template.content.children);
  }

  let nodeHandler   = options.nodeHandler;
  let templateCount = children.reduce((sum, element) => ((IS_TEMPLATE.test(element.tagName)) ? (sum + 1) : sum), 0);

  context.templateCount = templateCount;

  for (let child of children) {
    if (IS_TEMPLATE.test(child.tagName)) { // <template>
      if (templateCount === 1 && child.getAttribute('data-for') == null && child.getAttribute('data-mythix-component-name') == null) {
        console.warn(`${url}: <template> is missing a "data-for" attribute, linking it to its owner component. Guessing "${guessedElementName}".`);
        child.setAttribute('data-for', guessedElementName);
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isTemplate: true, isHandled: true }) === false)
        continue;

      // append to head
      let elementName = (child.getAttribute('data-for') || child.getAttribute('data-mythix-component-name'));
      if (!ownerDocument.body.querySelector(`[data-for="${elementName}" i],[data-mythix-component-name="${elementName}" i]`))
        ownerDocument.body.appendChild(child);
    } else if (IS_SCRIPT.test(child.tagName)) { // <script>
      let childClone = ownerDocument.createElement(child.tagName);
      for (let attributeName of child.getAttributeNames())
        childClone.setAttribute(attributeName, child.getAttribute(attributeName));

      let src = child.getAttribute('src');
      if (src) {
        src = resolveURL.call(this, baseURL, src, false);
        childClone.setAttribute('src', src.toString());
      } else {
        childClone.setAttribute('type', 'module');
        childClone.innerHTML = child.textContent;
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isScript: true, isHandled: true }) === false)
        continue;

      let styleID = `ID${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`${guessedElementName}:${childClone.innerHTML}`)}`;
      if (!childClone.getAttribute('id'))
        childClone.setAttribute('id', styleID);

      // append to head
      if (!ownerDocument.querySelector(`script#${styleID}`))
        ownerDocument.head.appendChild(childClone);
    } else if ((/^(link|style)$/i).test(child.tagName)) {
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      let id = `ID${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(child.outerHTML)}`;
      if (!child.getAttribute('id'))
        child.setAttribute('id', id);

      // append to head
      if (!ownerDocument.querySelector(`${child.tagName}#${id}`))
        ownerDocument.head.appendChild(child);
    } else if ((/^meta$/i).test(child.tagName)) {
      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isMeta: true, isHandled: true });

      // do nothing with these tags
      continue;
    } else {
      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isHandled: false });
    }
  }

  if (typeof options.postProcess === 'function') {
    template = context.template = options.postProcess.call(this, context);
    children = Array.from(template.content.children);
  }

  return context;
}

async function require(ownerDocument, urlOrName, _options) {
  let options   = _options || {};
  let url       = resolveURL.call(this, ownerDocument.location, urlOrName, options.magic);
  let cacheKey;

  if (!(/^(false|no-store|reload|no-cache)$/).test(url.searchParams.get('cache'))) {
    if (url.searchParams.get('cacheParams') !== 'true') {
      let cacheKeyURL = new URL(`${url.origin}${url.pathname}`);
      cacheKey = cacheKeyURL.toString();
    } else {
      cacheKey = url.toString();
    }

    let cachedResponse = REQUIRE_CACHE.get(cacheKey);
    if (cachedResponse) {
      cachedResponse = await cachedResponse;
      if (cachedResponse.response && cachedResponse.response.ok)
        return { url, response: cachedResponse.response, ownerDocument, cached: true };
    }
  }

  let promise = globalThis.fetch(url, options.fetchOptions).then(
    async (response) => {
      if (!response.ok) {
        if (cacheKey)
          REQUIRE_CACHE.delete(cacheKey);

        let error = new Error(`${response.status} ${response.statusText}`);
        error.url = url;
        throw error;
      }

      let body = await response.text();
      response.text = async () => body;
      response.json = async () => JSON.parse(body);

      return { url, response, ownerDocument, cached: false };
    },
    (error) => {
      console.error('Error from Mythix UI "require": ', error);

      if (cacheKey)
        REQUIRE_CACHE.delete(cacheKey);

      error.url = url;
      throw error;
    },
  );

  REQUIRE_CACHE.set(cacheKey, promise);

  return await promise;
}

async function loadPartialIntoElement(src, _options) {
  let options = _options || {};

  let {
    ownerDocument,
    url,
    response,
  } = await require.call(
    this,
    this.ownerDocument || document,
    src,
  );

  let body = await response.text();
  while (this.childNodes.length)
    this.removeChild(this.childNodes[0]);

  let scopeData = Object.create(null);
  for (let [ key, value ] of url.searchParams.entries())
    scopeData[key] = _utils_js__WEBPACK_IMPORTED_MODULE_0__.coerce(value);

  importIntoDocumentFromSource.call(
    this,
    ownerDocument,
    ownerDocument.location,
    url,
    body,
    {
      nodeHandler: (node, { isHandled, isTemplate }) => {
        if ((isTemplate || !isHandled) && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE))
          this.appendChild(recursivelyBindDynamicData(node, { ...options, scopes: [ scopeData ].concat(options.scopes || []) }));
      },
    },
  );
}

function visibilityObserver(callback, _options) {
  const intersectionCallback = (entries) => {
    for (let i = 0, il = entries.length; i < il; i++) {
      let entry   = entries[i];
      let element = entry.target;
      if (!entry.isIntersecting)
        continue;

      let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, '_mythixUIIntersectionObservers');
      if (!elementObservers) {
        elementObservers = new Map();
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, '_mythixUIIntersectionObservers', elementObservers);
      }

      let data = elementObservers.get(observer);
      if (!data) {
        data = { wasVisible: false, ratioVisible: entry.intersectionRatio };
        elementObservers.set(observer, data);
      }

      if (entry.intersectionRatio > data.ratioVisible)
        data.ratioVisible = entry.intersectionRatio;

      data.previousVisibility = (data.visibility === undefined) ? data.visibility : data.visibility;
      data.visibility = (entry.intersectionRatio > 0.0);

      callback({ ...data, entry, element, index: i, disconnect: () => observer.unobserve(element) });

      if (data.visibility && !data.wasVisible)
        data.wasVisible = true;
    }
  };

  let options = {
    root:       null,
    threshold:  0.0,
    ...(_options || {}),
  };

  let observer  = new IntersectionObserver(intersectionCallback, options);
  let elements  = (_options || {}).elements || [];

  for (let i = 0, il = elements.length; i < il; i++)
    observer.observe(elements[i]);

  return observer;
}

const NO_OBSERVER = Object.freeze({
  wasVisible:         false,
  ratioVisible:       0.0,
  visibility:         false,
  previousVisibility: false,
});

function getVisibilityMeta(element, observer) {
  let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, '_mythixUIIntersectionObservers');
  if (!elementObservers)
    return NO_OBSERVER;

  return elementObservers.get(observer) || NO_OBSERVER;
}

function remapNodeTree(node, callback, _index) {
  if (!node)
    return node;

  let index = 0;
  for (let childNode of Array.from(node.childNodes)) {
    let newNode = callback(remapNodeTree(childNode, callback, index), index++);
    if (newNode !== childNode) {
      if (newNode)
        node.replaceChild(newNode, childNode);
      else
        node.removeChild(childNode);
    }
  }

  return (_index == null) ? callback(node,  -1) : node;
}

function recursivelyBindDynamicData(node, _options) {
  let options = _options || {};
  let disableTemplateEngineSelectorStr = (options.forceTemplateEngine === true) ? undefined : _utils_js__WEBPACK_IMPORTED_MODULE_0__.disableTemplateEngineSelector();
  return remapNodeTree(node, (node) => {
    if (disableTemplateEngineSelectorStr && node.parentNode && typeof node.parentNode.closest === 'function' && node.parentNode.closest(disableTemplateEngineSelectorStr))
      return node;

    if (node.nodeType === Node.TEXT_NODE) {
      let nodeValue = node.nodeValue;
      if (nodeValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(nodeValue))
        node.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(node, node.parentNode, ...(options.scopes || []));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(node);
      let attributeNames  = node.getAttributeNames();
      for (let i = 0, il = attributeNames.length; i < il; i++) {
        let attributeName       = attributeNames[i];
        let lowerAttributeName  = attributeName.toLowerCase();
        if (eventNames.indexOf(lowerAttributeName) >= 0)
          continue;

        let attributeValue = node.getAttribute(attributeName);
        if (attributeValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(attributeValue)) {
          let attributeNode = node.getAttributeNode(attributeName);
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(attributeNode, node, ...(options.scopes || []));
        }
      }
    }

    return node;
  });
}


/***/ }),

/***/ "./lib/elements.js":
/*!*************************!*\
  !*** ./lib/elements.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElementDefinition: () => (/* binding */ ElementDefinition),
/* harmony export */   ElementGenerator: () => (/* binding */ ElementGenerator),
/* harmony export */   Term: () => (/* binding */ Term),
/* harmony export */   UNFINISHED_DEFINITION: () => (/* binding */ UNFINISHED_DEFINITION),
/* harmony export */   build: () => (/* binding */ build),
/* harmony export */   isSVGElement: () => (/* binding */ isSVGElement)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");


const UNFINISHED_DEFINITION = Symbol.for('@mythix/mythix-ui/constants/unfinished');

const IS_PROP_NAME = /^prop\$/;

/*
*/
class ElementDefinition {
  constructor(tagName, attributes, children) {
    Object.defineProperties(this, {
      'tagName': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        tagName,
      },
      'attributes': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        attributes || {},
      },
      'children': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        children || [],
      },
    });
  }

  toDOMAttributeName(attributeName) {
    return attributeName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  bindEventToElement(...args) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement(...args);
  }

  build(document, context) {
    let attributes    = this.attributes;
    let namespaceURI  = attributes.namespaceURI;
    let options;
    let element;

    if (this.attributes.is)
      options = { is: this.attributes.is };

    if (this.tagName === '#text') {
      let textNode = document.createTextNode(attributes.value || '');
      textNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(textNode, context);
      return textNode;
    }

    if (namespaceURI)
      element = document.createElementNS(namespaceURI, this.tagName, options);
    else if (isSVGElement(this.tagName))
      element = document.createElementNS('http://www.w3.org/2000/svg', this.tagName, options);
    else
      element = document.createElement(this.tagName);

    const handleAttribute = (element, attributeName, _attributeValue) => {
      let attributeValue      = _attributeValue;
      let lowerAttributeName  = attributeName.toLowerCase();

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        this.bindEventToElement(element, lowerAttributeName.substring(2), attributeValue, context);
      } else {
        let modifiedAttributeName = this.toDOMAttributeName(attributeName);

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(attributeValue)) {
          // Create attribute
          element.setAttribute(modifiedAttributeName, attributeValue);

          // Get attribute node just created
          let attributeNode = element.getAttributeNode(modifiedAttributeName);
          attributeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(attributeNode, context);
        }

        element.setAttribute(modifiedAttributeName, attributeValue);
      }
    };

    // Dynamic bindings are not allowed for properties
    const handleProperty = (element, propertyName, propertyValue) => {
      let name = propertyName.replace(IS_PROP_NAME, '');
      element[name] = propertyValue;
    };

    let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(element);
    let attributeNames  = Object.keys(attributes);
    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName       = attributeNames[i];
      let attributeValue      = attributes[attributeName];

      if (IS_PROP_NAME.test(attributeName))
        handleProperty(element, attributeName, attributeValue);
      else
        handleAttribute(element, attributeName, attributeValue);
    }

    let children = this.children;
    if (children.length > 0) {
      for (let i = 0, il = children.length; i < il; i++) {
        let child         = children[i];
        let childElement  = child.build(document, context);

        element.appendChild(childElement);
      }
    }

    return element;
  }
}

const IS_TARGET_PROP = /^prototype|constructor$/;

function build(tagName, defaultAttributes, scope) {
  if (!tagName || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(tagName, 'String'))
    throw new Error('Can not create an ElementDefinition without a "tagName".');

  const finalizer = (..._children) => {
    let children = _children.map((value) => {
      if (value == null || Object.is(value, NaN))
        return null;

      if (typeof value === 'symbol')
        return null;

      if (value[UNFINISHED_DEFINITION])
        return value();

      if (value instanceof ElementDefinition)
        return value;

      if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(value, 'String'))
        return null;

      return new ElementDefinition('#text', { value: ('' + value) });
    }).filter(Boolean);

    return new ElementDefinition(tagName, scope, children);
  };

  let rootProxy = new Proxy(finalizer, {
    get: (target, attributeName) => {
      if (attributeName === UNFINISHED_DEFINITION)
        return true;

      if (typeof attributeName === 'symbol' || IS_TARGET_PROP.test(attributeName))
        return target[attributeName];

      if (!scope) {
        let scopedProxy = build(tagName, defaultAttributes, Object.assign(Object.create(null), defaultAttributes || {}));
        return scopedProxy[attributeName];
      }

      return new Proxy(
        (value) => {
          scope[attributeName] = value;
          return rootProxy;
        },
        {
          get: (target, propName) => {
            if (attributeName === UNFINISHED_DEFINITION)
              return true;

            if (typeof attributeName === 'symbol' || IS_TARGET_PROP.test(attributeName))
              return target[attributeName];

            scope[attributeName] = true;
            return rootProxy[propName];
          },
        },
      );
    },
  });

  return rootProxy;
}

const Term = (value) => new ElementDefinition('#text', { value });

const IS_SVG_ELEMENT_NAME = /^(altglyph|altglyphdef|altglyphitem|animate|animateColor|animateMotion|animateTransform|animation|circle|clipPath|colorProfile|cursor|defs|desc|discard|ellipse|feblend|fecolormatrix|fecomponenttransfer|fecomposite|feconvolvematrix|fediffuselighting|fedisplacementmap|fedistantlight|fedropshadow|feflood|fefunca|fefuncb|fefuncg|fefuncr|fegaussianblur|feimage|femerge|femergenode|femorphology|feoffset|fepointlight|fespecularlighting|fespotlight|fetile|feturbulence|filter|font|fontFace|fontFaceFormat|fontFaceName|fontFaceSrc|fontFaceUri|foreignObject|g|glyph|glyphRef|handler|hKern|image|line|lineargradient|listener|marker|mask|metadata|missingGlyph|mPath|path|pattern|polygon|polyline|prefetch|radialgradient|rect|set|solidColor|stop|svg|switch|symbol|tbreak|text|textpath|tref|tspan|unknown|use|view|vKern)$/i;

function isSVGElement(tagName) {
  return IS_SVG_ELEMENT_NAME.test(tagName);
}

const ElementGenerator = new Proxy(
  {
    Term,
  },
  {
    get: function(target, propName) {
      if (propName in target)
        return target[propName];

      if (IS_SVG_ELEMENT_NAME.test(propName)) {
        // SVG elements
        return build(propName, { namespaceURI: 'http://www.w3.org/2000/svg' });
      }

      return build(propName);
    },
    set: function() {
      // NOOP
      return true;
    },
  },
);


/***/ }),

/***/ "./lib/mythix-ui-language-provider.js":
/*!********************************************!*\
  !*** ./lib/mythix-ui-language-provider.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUILanguageProvider: () => (/* binding */ MythixUILanguageProvider)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");



class MythixUILanguageProvider extends _component_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent {
  static tagName = 'mythix-language-provider';

  set attr$lang([ newValue, oldValue ]) {
    this.handleLangAttributeChange(newValue, oldValue);
  }

  constructor() {
    super();

    Object.defineProperties(this, {
      'terms': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        Object.create(null),
      },
    });
  }

  mounted() {
    if (!this.getAttribute('lang'))
      this.setAttribute('lang', (this.ownerDocument || document).childNodes[1].getAttribute('lang') || 'en');
  }

  createShadowDOM() {
    // NOOP
  }

  getComponentTemplate() {
    // NOOP
  }

  publishContext() {
    return {
      i18n: (_path, defaultValue) => {
        let path    = `global.i18n.${_path}`;
        let result  = _utils_js__WEBPACK_IMPORTED_MODULE_0__.fetchPath(this.terms, path);

        if (result == null)
          return _utils_js__WEBPACK_IMPORTED_MODULE_0__.getDynamicPropertyForPath.call(this, path, (defaultValue == null) ? '' : defaultValue);

        return result;
      },
    };
  }

  getSourceForLang(lang) {
    return this.$(`source[type^="lang/" i][lang^="${lang.replace(/"/g, '\\"')}"]`)[0];
  }

  handleLangAttributeChange(_lang) {
    let lang          = _lang || 'en';
    let sourceElement = this.getSourceForLang(lang);
    if (!sourceElement || !sourceElement.getAttribute('src')) {
      console.warn(`"mythix-language-provider": No "source" tag found for specified language "${lang}"`);
      return;
    }

    this.loadLanguageTerms(lang, sourceElement);
  }

  async loadLanguageTerms(lang, sourceElement, _options) {
    let src = sourceElement.getAttribute('src');
    if (!src)
      return;

    try {
      let { response }  = await _component_js__WEBPACK_IMPORTED_MODULE_1__.require.call(this, this.ownerDocument || document, src);
      let compiledTerms = this.compileLanguageTerms(lang, await response.json());

      this.terms = compiledTerms;
    } catch (error) {
      console.error(`"mythix-language-provider": Failed to load specified resource: ${src}`, error);
    }
  }

  compileLanguageTerms(lang, terms) {
    const walkTerms = (terms, rawKeyPath) => {
      let keys      = Object.keys(terms);
      let termsCopy = {};

      for (let i = 0, il = keys.length; i < il; i++) {
        let key         = keys[i];
        let value       = terms[key];
        let newKeyPath  = rawKeyPath.concat(key);

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject(value) || Array.isArray(value)) {
          termsCopy[key] = walkTerms(value, newKeyPath);
        } else {
          let property = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getDynamicPropertyForPath.call(this, newKeyPath.join('.'), value);
          termsCopy[key] = property;
          property._set(value);
        }
      }

      return termsCopy;
    };

    return walkTerms(terms, [ 'global', 'i18n' ]);
  }
}

MythixUILanguageProvider.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUILanguageProvider = MythixUILanguageProvider;


/***/ }),

/***/ "./lib/mythix-ui-require.js":
/*!**********************************!*\
  !*** ./lib/mythix-ui-require.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIRequire: () => (/* binding */ MythixUIRequire)
/* harmony export */ });
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");


const IS_TEMPLATE       = /^(template)$/i;
const TEMPLATE_TEMPLATE = /^(\*|\|\*|\*\|)$/;

class MythixUIRequire extends _component_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await _component_js__WEBPACK_IMPORTED_MODULE_0__.require.call(
        this,
        this.ownerDocument || document,
        src,
        {
          magic: true,
        },
      );

      if (cached)
        return;

      let body = await response.text();
      _component_js__WEBPACK_IMPORTED_MODULE_0__.importIntoDocumentFromSource.call(
        this,
        ownerDocument,
        ownerDocument.location,
        url,
        body,
        {
          nodeHandler: (node, { isHandled }) => {
            if (!isHandled && node.nodeType === Node.ELEMENT_NODE)
              document.body.appendChild(node);
          },
          preProcess: ({ template, children }) => {
            let starTemplate = children.find((child) => {
              let dataFor = child.getAttribute('data-for');
              return (IS_TEMPLATE.test(child.tagName) && TEMPLATE_TEMPLATE.test(dataFor));
            });

            if (!starTemplate)
              return template;

            let dataFor = starTemplate.getAttribute('data-for');
            for (let child of children) {
              if (child === starTemplate)
                continue;

              if (IS_TEMPLATE.test(child.tagName)) { // <template>
                let starClone = starTemplate.content.cloneNode(true);
                if (dataFor === '*|')
                  child.content.insertBefore(starClone, child.content.childNodes[0] || null);
                else
                  child.content.appendChild(starClone);
              }
            }

            starTemplate.parentNode.removeChild(starTemplate);

            return template;
          },
        },
      );
    } catch (error) {
      console.error(`"mythix-require": Failed to load specified resource: ${src}`, error);
    }
  }

  async fetchSrc() {
    // NOOP
  }
}

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIRequire = MythixUIRequire;

if (typeof customElements !== 'undefined' && !customElements.get('mythix-require'))
  customElements.define('mythix-require', MythixUIRequire);


/***/ }),

/***/ "./lib/mythix-ui-spinner.js":
/*!**********************************!*\
  !*** ./lib/mythix-ui-spinner.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUISpinner: () => (/* binding */ MythixUISpinner)
/* harmony export */ });
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");
/* eslint-disable no-magic-numbers */



/*
Many thanks to Sagee Conway for the following CSS spinners
https://codepen.io/saconway/pen/vYKYyrx
*/

const STYLE_SHEET =
`
:host {
  --mythix-spinner-size: 1em;
  width: var(--mythix-spinner-size);
  height: var(--mythix-spinner-size);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
}
:host(.small) {
  --mythix-spinner-size: calc(1em * 0.75);
}
:host(.medium) {
  --mythix-spinner-size: calc(1em * 1.5);
}
:host(.large) {
  --mythix-spinner-size: calc(1em * 3);
}
.spinner-item,
.spinner-item::before,
.spinner-item::after {
	box-sizing: border-box;
}
:host([kind="audio"]) .spinner-item {
  width: 11%;
  height: 60%;
  background: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-audio-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) ease-in-out infinite;
}
@keyframes mythix-spinner-audio-animation {
  50% {
    transform: scaleY(0.25);
  }
}
:host([kind="audio"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -3);
}
:host([kind="audio"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -2);
}
:host([kind="audio"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, #333));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -3);
}
:host([kind="circle"]) .spinner-item {
  --mythix-spinner-circle-thickness: calc(var(--mythix-spinner-size) * 0.075);
  position: absolute;
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  top: calc(50% - var(--mythix-spinner-item-size) / 2);
  left: calc(50% - var(--mythix-spinner-item-size) / 2);
  border: var(--mythix-spinner-circle-thickness) solid transparent;
  border-left: var(--mythix-spinner-circle-thickness) solid var(--mythix-spinner-segment-color);
  border-right: var(--mythix-spinner-circle-thickness) solid var(--mythix-spinner-segment-color);
  border-radius: 50%;
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) linear infinite;
}
@keyframes mythix-spinner-circle-animation {
  to {
    transform: rotate(360deg);
  }
}
:host([kind="circle"]) .spinner-item:nth-of-type(1) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 1.0);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  border-top: var(--mythix-spinner-circle-thickness) * 0.075) solid var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.7);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  border-bottom: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 0.875) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(3) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.4);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  border-top: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 0.75) linear infinite;
}
:host([kind="puzzle"]) {
  transform: translate(0, calc(var(--mythix-spinner-size) * 0.1)) rotate(45deg);
}
:host([kind="puzzle"]) .spinner-item {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) / 2.5);
  position: absolute;
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  border: calc(var(--mythix-spinner-size) * 0.1) solid var(--mythix-spinner-segment-color);
}
:host([kind="puzzle"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  top: 0;
  left: 0;
  animation: mythix-spinner-puzzle-animation1 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation1 {
  0%, 8.33%, 16.66%, 100% {
    transform: translate(0%, 0%);
  }
  24.99%, 33.32%, 41.65% {
    transform: translate(100%, 0%);
  }
  49.98%, 58.31%, 66.64% {
    transform: translate(100%, 100%);
  }
  74.97%, 83.30%, 91.63% {
    transform: translate(0%, 100%);
  }
}
:host([kind="puzzle"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  top: 0;
  left: var(--mythix-spinner-item-size);
  animation: mythix-spinner-puzzle-animation2 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation2 {
  0%, 8.33%, 91.63%, 100% {
    transform: translate(0%, 0%);
  }
  16.66%, 24.99%, 33.32% {
    transform: translate(0%, 100%);
  }
  41.65%, 49.98%, 58.31% {
    transform: translate(-100%, 100%);
  }
  66.64%, 74.97%, 83.30% {
    transform: translate(-100%, 0%);
  }
}
:host([kind="puzzle"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  top: var(--mythix-spinner-item-size);
  left: var(--mythix-spinner-item-size);
  animation: mythix-spinner-puzzle-animation3 calc(var(--theme-animation-duration, 1000ms) * 5.0) linear infinite;
}
@keyframes mythix-spinner-puzzle-animation3 {
  0%, 83.30%, 91.63%, 100% {
    transform: translate(0, 0);
  }
  8.33%, 16.66%, 24.99% {
    transform: translate(-100%, 0);
  }
  33.32%, 41.65%, 49.98% {
    transform: translate(-100%, -100%);
  }
  58.31%, 66.64%, 74.97% {
    transform: translate(0, -100%);
  }
}
:host([kind="wave"]) .spinner-item {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) / 4);
  min-width: var(--mythix-spinner-item-size);
  width: var(--mythix-spinner-item-size);
  height: var(--mythix-spinner-item-size);
  border-radius: 50%;
  border: none;
  overflow: hidden;
  background-color: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-wave-animation calc(var(--theme-animation-duration, 1000ms) * 1.15) ease-in-out infinite;
}
@keyframes mythix-spinner-wave-animation {
  0%, 100% {
    transform: translateY(75%);
  }
  50% {
    transform: translateY(-75%);
  }
}
:host([kind="wave"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -1);
}
:host([kind="wave"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -2);
}
:host([kind="wave"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -3);
}
:host([kind="pipe"]) .spinner-item {
  width: 11%;
  height: 40%;
  background-color: var(--mythix-spinner-segment-color);
  animation: mythix-spinner-pipe-animation calc(var(--theme-animation-duration, 1000ms) * 1.15) ease-in-out infinite;
}
@keyframes mythix-spinner-pipe-animation {
  25% {
    transform: scaleY(2);
  }
  50% {
    transform: scaleY(1);
  }
}
:host([kind="pipe"]) .spinner-item:nth-child(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
}
:host([kind="pipe"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10);
}
:host([kind="pipe"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 2);
}
:host([kind="pipe"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 3);
}
:host([kind="pipe"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 4);
}
:host([kind="dot"]) .spinner-item {
  position: absolute;
  top: calc(50% - var(--mythix-spinner-size) / 2);
  left: calc(50% - var(--mythix-spinner-size) / 2);
  width: var(--mythix-spinner-size);
  height: var(--mythix-spinner-size);
  background: var(--mythix-spinner-segment-color);
  border-radius: 50%;
  animation: mythix-spinner-dot-animation calc(var(--theme-animation-duration, 1000ms) * 3.0) ease-in-out infinite;
}
@keyframes mythix-spinner-dot-animation {
  0%, 100% {
    transform: scale(0.25);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0;
  }
}
:host([kind="dot"]) .spinner-item:nth-of-type(1) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, #333));
}
:host([kind="dot"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, #333));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 3.0) / -2);
}
`;

const KINDS = {
  'audio':  5,
  'circle': 3,
  'dot':    2,
  'pipe':   5,
  'puzzle': 3,
  'wave':   3,
};

class MythixUISpinner extends _component_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  static tagName = 'mythix-spinner';

  set attr$kind([ newValue ]) {
    this.handleKindAttributeChange(newValue);
  }

  mounted() {
    if (!this.documentInitialized) {
      // append template
      let ownerDocument = this.ownerDocument || document;
      this.build(({ TEMPLATE }) => {
        return TEMPLATE
          .dataMythixName(this.sensitiveTagName)
          .prop$innerHTML(`<style>${STYLE_SHEET}</style>`);
      }).appendTo(ownerDocument.body);

      let template = this.template = this.getComponentTemplate();
      this.appendTemplateToShadowDOM(template);
    }

    let kind = this.getAttribute('kind');
    if (!kind) {
      kind = 'pipe';
      this.setAttribute('kind', kind);
    }

    this.handleKindAttributeChange(kind);
  }

  handleKindAttributeChange(_kind) {
    let kind        = ('' + _kind).toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(KINDS, kind)) {
      console.warn(`"mythix-spinner" unknown "kind" provided: "${kind}". Supported "kind" attribute values are: "pipe", "audio", "circle", "puzzle", "wave", and "dot".`);
      kind = 'pipe';
    }

    this.changeSpinnerChildren(KINDS[kind]);
  }

  buildSpinnerChildren(count) {
    let children      = new Array(count);
    let ownerDocument = (this.ownerDocument || document);

    for (let i = 0; i < count; i++) {
      let element = ownerDocument.createElement('div');
      element.setAttribute('class', 'spinner-item');

      children[i] = element;
    }

    return this.$(children);
  }

  changeSpinnerChildren(count) {
    this.$('.spinner-item').remove();
    this.buildSpinnerChildren(count).appendTo(this.shadow);

    // Always append style again, so
    // that it is the last child, and
    // doesn't mess with "nth-child"
    // selectors
    this.$('style').appendTo(this.shadow);
  }
}

MythixUISpinner.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIRequire = MythixUISpinner;


/***/ }),

/***/ "./lib/query-engine.js":
/*!*****************************!*\
  !*** ./lib/query-engine.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QueryEngine: () => (/* binding */ QueryEngine)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");





const IS_INTEGER = /^\d+$/;

function isElement(value) {
  if (!value)
    return false;

  // We have an Element or a Document
  if (value.nodeType === Node.ELEMENT_NODE || value.nodeType === Node.DOCUMENT_NODE || value.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return true;

  return false;
}

function isSlotted(element) {
  if (!element)
    return null;

  return element.closest('slot');
}

function isNotSlotted(element) {
  if (!element)
    return null;

  return !element.closest('slot');
}

function collectClassNames(...args) {
  let classNames = [].concat(...args)
      .flat(Infinity)
      .map((part) => ('' + part).split(/\s+/))
      .flat(Infinity)
      .filter(Boolean);

  return classNames;
}

class QueryEngine {
  static isElement    = isElement;
  static isSlotted    = isSlotted;
  static isNotSlotted = isNotSlotted;

  static from = function(...args) {
    if (args.length === 0)
      return new QueryEngine([], { root: (isElement(this)) ? this : document, context: this });

    const getOptions = () => {
      let base = Object.create(null);
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject(args[argIndex]))
        base = Object.assign(base, args[argIndex++]);

      if (args[argIndex] instanceof QueryEngine)
        base = Object.assign(Object.create(null), args[argIndex].getOptions() || {}, base);

      return base;
    };

    const getRootElement = (optionsRoot) => {
      if (isElement(optionsRoot))
        return optionsRoot;

      if (isElement(this))
        return this;

      return ((this && this.ownerDocument) || document);
    };

    let argIndex  = 0;
    let options   = getOptions();
    let root      = getRootElement(options.root);
    let queryEngine;

    options.root = root;
    options.context = options.context || this;

    if (args[argIndex] instanceof QueryEngine)
      return new QueryEngine(args[argIndex].slice(), options);

    if (Array.isArray(args[argIndex])) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex + 1], 'Function'))
        options.callback = args[1];

      queryEngine = new QueryEngine(args[argIndex], options);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], 'String')) {
      options.selector = args[argIndex++];

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], 'Function'))
        options.callback = args[argIndex++];

      queryEngine = new QueryEngine(root.querySelectorAll(options.selector), options);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], 'Function')) {
      options.callback = args[argIndex++];

      let result = options.callback.call(this, _elements_js__WEBPACK_IMPORTED_MODULE_1__.ElementGenerator, options);
      if (!Array.isArray(result))
        result = [ result ];

      queryEngine = new QueryEngine(result, options);
    }

    if (options.invokeCallbacks !== false && typeof options.callback === 'function')
      return queryEngine.map(options.callback);

    return queryEngine;
  };

  getEngineClass() {
    return QueryEngine;
  }

  constructor(elements, _options) {
    let options = _options || {};

    Object.defineProperties(this, {
      '_mythixUIOptions': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options,
      },
    });

    Object.defineProperties(this, {
      '_mythixUIElements': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        this.filterAndConstructElements(options.context, elements),
      },
    });

    let rootProxy = new Proxy(this, {
      get: (target, propName) => {
        if (typeof propName === 'symbol') {
          if (propName in target)
            return target[propName];
          else if (propName in target._mythixUIElements)
            return target._mythixUIElements[propName];

          return;
        }

        if (propName === 'length')
          return target._mythixUIElements.length;

        if (propName === 'prototype')
          return target.prototype;

        if (propName === 'constructor')
          return target.constructor;

        // Index lookup
        if (IS_INTEGER.test(propName))
          return target._mythixUIElements[propName];

        if (propName in target)
          return target[propName];

        // Redirect any array methods:
        //
        // "magicPropName" is when the
        // function name begins with "$",
        // i.e. "$filter", or "$map". If
        // this is the case, then the return
        // value will always be coerced into
        // a QueryEngine. Otherwise, it will
        // only be coerced into a QueryEngine
        // if EVERY element in the result is
        // an "elementy" type value.
        let magicPropName = (propName.charAt(0) === '$') ? propName.substring(1) : propName;
        if (typeof Array.prototype[magicPropName] === 'function') {
          return (...args) => {
            let array   = target._mythixUIElements;
            let result  = array[magicPropName](...args);

            if (Array.isArray(result) && (magicPropName !== propName || result.every((item) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, _elements_js__WEBPACK_IMPORTED_MODULE_1__.ElementDefinition, Node, QueryEngine)))) {
              const EngineClass = target.getEngineClass();
              return new EngineClass(result, target.getOptions());
            }

            return result;
          };
        }

        return target[propName];
      },
    });

    return rootProxy;
  }

  getOptions() {
    return this._mythixUIOptions;
  }

  getContext() {
    let options = this.getOptions();
    return options.context;
  }

  getRoot() {
    let options = this.getOptions();
    return options.root || document;
  }

  getUnderlyingArray() {
    return this._mythixUIElements;
  }

  getOwnerDocument() {
    return this.getRoot().ownerDocument || document;
  }

  filterAndConstructElements(context, elements) {
    let finalElements = Array.from(elements).flat(Infinity).map((_item) => {
      if (!_item)
        return;

      let item = _item;
      if (item instanceof QueryEngine)
        return item.getUnderlyingArray();

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, Node))
        return item;

      if (item[_elements_js__WEBPACK_IMPORTED_MODULE_1__.UNFINISHED_DEFINITION])
        item = item();

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, 'String'))
        item = _elements_js__WEBPACK_IMPORTED_MODULE_1__.Term(item);
      else if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, _elements_js__WEBPACK_IMPORTED_MODULE_1__.ElementDefinition))
        return;

      if (!context)
        throw new Error('The "context" option for QueryEngine is required when constructing elements.');

      return item.build(this.getOwnerDocument(), context);
    }).flat(Infinity).filter(Boolean);

    return Array.from(new Set(finalElements));
  }

  $(...args) {
    let argIndex  = 0;
    let options   = Object.assign(Object.create(null), this.getOptions(), (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject(args[argIndex])) ? args[argIndex++] : {});

    if (options.context && typeof options.context.$ === 'function')
      return options.context.$.call(options.context, options, ...args.slice(argIndex));

    const EngineClass = this.getEngineClass();
    return EngineClass.from.call(options.context || this, options, ...args.slice(argIndex));
  }

  *entries() {
    let elements = this._mythixUIElements;

    for (let i = 0, il = elements.length; i < il; i++) {
      let element = elements[i];
      yield([i, element]);
    }
  }

  *keys() {
    for (let [ key, _ ] of this.entries())
      yield key;
  }

  *values() {
    for (let [ _, value ] of this.entries())
      yield value;
  }

  *[Symbol.iterator]() {
    return yield *this.values();
  }

  first(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(count, 'Number'))
      return this.$([ this._mythixUIElements[0] ]);

    return this.$(this._mythixUIElements.slice(Math.abs(count)));
  }

  last(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(count, 'Number'))
      return this.$([ this._mythixUIElements[this._mythixUIElements.length - 1] ]);

    return this.$(this._mythixUIElements.slice(Math.abs(count) * -1));
  }

  add(...elements) {
    const EngineClass = this.getEngineClass();
    return new EngineClass(this.slice().concat(...elements), this.getOptions());
  }

  subtract(...elements) {
    let set = new Set(elements);

    const EngineClass = this.getEngineClass();
    return new EngineClass(this.filter((item) => {
      return !set.has(item);
    }), this.getOptions());
  }

  on(eventName, callback, options) {
    for (let value of this.values()) {
      if (!isElement(value))
        continue;

      value.addEventListener(eventName, callback, options);
    }

    return this;
  }

  off(eventName, callback, options) {
    for (let value of this.values()) {
      if (!isElement(value))
        continue;

      value.removeEventListener(eventName, callback, options);
    }

    return this;
  }

  appendTo(selectorOrElement) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, 'String'))
      element = this.getRoot().querySelector(selectorOrElement);

    for (let child of this._mythixUIElements)
      element.appendChild(child);
  }

  insertInto(selectorOrElement, referenceNode) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, 'String'))
      element = this.getRoot().querySelector(selectorOrElement);

    let ownerDocument = this.getOwnerDocument();
    let source        = this;

    if (this._mythixUIElements.length > 1) {
      let fragment = ownerDocument.createDocumentFragment();
      for (let child of this._mythixUIElements)
        fragment.appendChild(child);

      source = [ fragment ];
    }

    element.insert(source[0], referenceNode);

    return this;
  }

  replaceChildrenOf(selectorOrElement) {
    let element = selectorOrElement;
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, 'String'))
      element = this.getRoot().querySelector(selectorOrElement);

    while (element.childNodes.length)
      element.removeChild(element.childNodes[0]);

    return this.appendTo(element);
  }

  remove() {
    for (let node of this._mythixUIElements) {
      if (node && node.parentNode)
        node.parentNode.removeChild(node);
    }

    return this;
  }

  classList(operation, ...args) {
    let classNames = collectClassNames(args);
    for (let node of this._mythixUIElements) {
      if (node && node.classList) {
        if (operation === 'toggle')
          classNames.forEach((className) => node.classList.toggle(className));
        else
          node.classList[operation](...classNames);
      }
    }

    return this;
  }

  addClass(...classNames) {
    return this.classList('add', ...classNames);
  }

  removeClass(...classNames) {
    return this.classList('remove', ...classNames);
  }

  toggleClass(...classNames) {
    return this.classList('toggle', ...classNames);
  }

  slotted(yesNo) {
    return this.filter((arguments.length === 0 || yesNo) ? isSlotted : isNotSlotted);
  }

  slot(slotName) {
    return this.filter((element) => {
      if (element && element.slot === slotName)
        return true;

      if (element.closest(`slot[name="${slotName.replace(/"/g, '\\"')}"]`))
        return true;

      return false;
    });
  }
}

(globalThis.mythixUI = (globalThis.mythixUI || {})).QueryEngine = QueryEngine;


/***/ }),

/***/ "./lib/sha256.js":
/*!***********************!*\
  !*** ./lib/sha256.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHA256: () => (/* binding */ SHA256)
/* harmony export */ });
/* eslint-disable no-magic-numbers */

function SHA256(_input) {
  let input = _input;

  let mathPow = Math.pow;
  let maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i; let j; // Used as a counter across the whole file
  let result = '';

  let words = [];
  let asciiBitLength = input[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  let hash = SHA256.h = SHA256.h || [];
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  let k = SHA256.k = SHA256.k || [];
  let primeCounter = k[lengthProperty];
  /*/
    let hash = [], k = [];
    let primeCounter = 0;
    //*/

  let isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate)
        isComposite[i] = candidate;

      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  input += '\x80'; // Append Ƈ' bit (plus zero padding)
  while (input[lengthProperty] % 64 - 56)
    input += '\x00'; // More zero padding

  for (i = 0; i < input[lengthProperty]; i++) {
    j = input.charCodeAt(i);
    if (j >> 8)
      return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }

  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);

  // process each chunk
  for (j = 0; j < words[lengthProperty];) {
    let w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
    let oldHash = hash;

    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      // Expand the message into 64 words
      // Used below if
      let w15 = w[i - 15]; let w2 = w[i - 2];

      // Iterate
      let a = hash[0]; let e = hash[4];
      let temp1 = hash[7]
                + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                  w[i - 16]
                        + (((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3)) // s0
                        + w[i - 7]
                        + (((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10)) // s1
                ) | 0
                );
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      let temp2 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++)
      hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      let b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }

  return result;
}


/***/ }),

/***/ "./lib/utils.js":
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynamicProperty: () => (/* binding */ DynamicProperty),
/* harmony export */   MYTHIX_NAME_VALUE_PAIR_HELPER: () => (/* binding */ MYTHIX_NAME_VALUE_PAIR_HELPER),
/* harmony export */   MYTHIX_SHADOW_PARENT: () => (/* binding */ MYTHIX_SHADOW_PARENT),
/* harmony export */   NOE: () => (/* binding */ NOE),
/* harmony export */   SHA256: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_0__.SHA256),
/* harmony export */   bindEventToElement: () => (/* binding */ bindEventToElement),
/* harmony export */   bindMethods: () => (/* binding */ bindMethods),
/* harmony export */   coerce: () => (/* binding */ coerce),
/* harmony export */   createContextAwareCallback: () => (/* binding */ createContextAwareCallback),
/* harmony export */   createDynamicPropertyFetcher: () => (/* binding */ createDynamicPropertyFetcher),
/* harmony export */   createProxyContext: () => (/* binding */ createProxyContext),
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   disableTemplateEngineSelector: () => (/* binding */ disableTemplateEngineSelector),
/* harmony export */   dynamicProp: () => (/* binding */ dynamicProp),
/* harmony export */   dynamicPropID: () => (/* binding */ dynamicPropID),
/* harmony export */   fetchPath: () => (/* binding */ fetchPath),
/* harmony export */   formatTerm: () => (/* binding */ formatTerm),
/* harmony export */   generateID: () => (/* binding */ generateID),
/* harmony export */   getAllEventNamesForElement: () => (/* binding */ getAllEventNamesForElement),
/* harmony export */   getAllPropertyNames: () => (/* binding */ getAllPropertyNames),
/* harmony export */   getDynamicPropertyForPath: () => (/* binding */ getDynamicPropertyForPath),
/* harmony export */   getObjID: () => (/* binding */ getObjID),
/* harmony export */   globalStore: () => (/* binding */ globalStore),
/* harmony export */   globalStoreDynamic: () => (/* binding */ globalStoreDynamic),
/* harmony export */   globalStoreNameValuePairHelper: () => (/* binding */ globalStoreNameValuePairHelper),
/* harmony export */   isCollectable: () => (/* binding */ isCollectable),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   notNOE: () => (/* binding */ notNOE),
/* harmony export */   registerDisableTemplateEngineSelector: () => (/* binding */ registerDisableTemplateEngineSelector),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   specialClosest: () => (/* binding */ specialClosest),
/* harmony export */   stringIsDynamicBindingTemplate: () => (/* binding */ stringIsDynamicBindingTemplate),
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
/* harmony export */   toSnakeCase: () => (/* binding */ toSnakeCase),
/* harmony export */   typeOf: () => (/* binding */ typeOf),
/* harmony export */   unregisterDisableTemplateEngineSelector: () => (/* binding */ unregisterDisableTemplateEngineSelector)
/* harmony export */ });
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256.js */ "./lib/sha256.js");




function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

const MYTHIX_NAME_VALUE_PAIR_HELPER = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper');
const MYTHIX_SHADOW_PARENT = Symbol.for('@mythix/mythix-ui/constants/shadow-parent');

const ID_COUNT_LENGTH         = 19;
const IS_CLASS                = (/^class \S+ \{/);
const NATIVE_CLASS_TYPE_NAMES = [
  'AggregateError',
  'Array',
  'ArrayBuffer',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'DedicatedWorkerGlobalScope',
  'Error',
  'EvalError',
  'FinalizationRegistry',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Map',
  'Number',
  'Object',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'URIError',
  'WeakMap',
  'WeakRef',
  'WeakSet',
];

const NATIVE_CLASS_TYPES_META = NATIVE_CLASS_TYPE_NAMES.map((typeName) => {
  return [ typeName, globalThis[typeName] ];
}).filter((meta) => meta[1]);

let idCounter = 0n;
function generateID() {
  idCounter += BigInt(1);
  return `${Date.now()}${pad(idCounter.toString(), ID_COUNT_LENGTH)}`;
}

function createResolvable() {
  let status = 'pending';
  let resolve;
  let reject;

  let promise = new Promise((_resolve, _reject) => {
    resolve = (value) => {
      if (status === 'pending') {
        status = 'fulfilled';
        _resolve(value);
      }

      return promise;
    };

    reject = (value) => {
      if (status === 'pending') {
        status = 'rejected';
        _reject(value);
      }

      return promise;
    };
  });

  Object.defineProperties(promise, {
    'resolve': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        resolve,
    },
    'reject': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        reject,
    },
    'status': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        () => status,
    },
    'id': {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        generateID(),
    },
  });

  return promise;
}

function typeOf(value) {
  if (value == null || Object.is(value, NaN))
    return 'undefined';

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return 'Number';

  let thisType = typeof value;
  if (thisType === 'bigint')
    return 'BigInt';

  if (thisType !== 'object') {
    if (thisType === 'function') {
      let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (value === typeMeta[1]));
      if (nativeTypeMeta)
        return `[Class ${nativeTypeMeta[0]}]`;

      if (value.prototype && typeof value.prototype.constructor === 'function' && IS_CLASS.test('' + value.prototype.constructor))
        return `[Class ${value.name}]`;

      if (value.prototype && typeof value.prototype[Symbol.toStringTag] === 'function') {
        let result = value.prototype[Symbol.toStringTag]();
        if (result)
          return `[Class ${result}]`;
      }
    }

    return `${thisType.charAt(0).toUpperCase()}${thisType.substring(1)}`;
  }

  if (value instanceof String)
    return 'String';

  if (value instanceof Number)
    return 'Number';

  if (value instanceof Boolean)
    return 'Boolean';

  if (isPlainObject(value))
    return 'Object';

  if (typeof value[Symbol.toStringTag] === 'function')
    return value[Symbol.toStringTag]();

  return value.constructor.name || 'Object';
}

function isType(value, ...types) {
  let valueType = typeOf(value);
  if (types.indexOf(valueType) >= 0)
    return true;

  return types.some((type) => (typeof type === 'function' && value instanceof type));
}

function isValidNumber(value) {
  if (Object.is(value, NaN) || Object.is(value, Infinity) || Object.is(value, -Infinity))
    return false;

  return isType(value, 'Number');
}

function isPlainObject(value) {
  if (!value)
    return false;

  if (typeof value !== 'object')
    return false;

  if (value.constructor === Object || value.constructor == null)
    return true;

  return false;
}

function isPrimitive(value) {
  if (value == null || Object.is(value, NaN))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return false;

  return isType(value, 'String', 'Number', 'Boolean', 'BigInt');
}

function isCollectable(value) {
  if (value == null || Object.is(value, NaN) || Object.is(Infinity) || Object.is(-Infinity))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (isType(value, 'String', 'Number', 'Boolean', 'BigInt'))
    return false;

  return true;
}

function NOE(value) {
  if (value == null)
    return true;

  if (Object.is(value, NaN))
    return true;

  if (value === '')
    return true;

  if (isType(value, 'String') && (/^[\s\r\n]*$/).test(value))
    return true;

  if (isType(value.length, 'Number'))
    return (value.length === 0);

  if (isPlainObject(value) && Object.keys(value).length === 0)
    return true;

  return false;
}

function notNOE(value) {
  return !NOE(value);
}

function toCamelCase(value) {
  return ('' + value)
    .replace(/^\W/, '')
    .replace(/[\W]+$/, '')
    .replace(/([A-Z]+)/g, '-$1')
    .toLowerCase()
    .replace(/\W+(.)/g, (m, p) => {
      return p.toUpperCase();
    })
    .replace(/^(.)(.*)$/, (m, f, l) => `${f.toLowerCase()}${l}`);
}

function toSnakeCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase()))
    .toLowerCase();
}

function bindMethods(_proto, skipProtos) {
  let proto           = _proto;
  let alreadyVisited  = new Set();

  while (proto) {
    if (proto === Object.prototype)
      return;

    let descriptors = Object.getOwnPropertyDescriptors(proto);
    let keys        = Object.keys(descriptors).concat(Object.getOwnPropertySymbols(descriptors));

    for (let i = 0, il = keys.length; i < il; i++) {
      let key = keys[i];
      if (key === 'constructor' || key === 'prototype')
        continue;

      if (alreadyVisited.has(key))
        continue;

      alreadyVisited.add(key);

      let descriptor = descriptors[key];

      // Can it be changed?
      if (descriptor.configurable === false)
        continue;

      // If is getter, then skip
      if (Object.prototype.hasOwnProperty.call(descriptor, 'get') || Object.prototype.hasOwnProperty.call(descriptor, 'set')) {
        let newDescriptor = { ...descriptor };
        if (newDescriptor.get)
          newDescriptor.get = newDescriptor.get.bind(this);

        if (newDescriptor.set)
          newDescriptor.set = newDescriptor.set.bind(this);

        Object.defineProperty(this, key, newDescriptor);
        continue;
      }

      let value = descriptor.value;

      // Skip prototype of Object
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty(key) && Object.prototype[key] === value)
        continue;

      if (typeof value !== 'function')
        continue;

      Object.defineProperty(this, key, { ...descriptor, value: value.bind(this) });
    }

    proto = Object.getPrototypeOf(proto);
    if (proto === Object.prototype)
      break;

    if (skipProtos && skipProtos.indexOf(proto) >= 0)
      break;
  }
}

const METADATA_WEAKMAP = new WeakMap();

function metadata(target, key, value) {
  let data = METADATA_WEAKMAP.get(target);
  if (arguments.length === 1)
    return data;

  if (arguments.length === 2)
    return (data) ? data.get(key) : undefined;

  if (!data) {
    if (!isCollectable(target))
      throw new Error(`Unable to set metadata on provided object: ${(typeof target === 'symbol') ? target.toString() : target}`);

    data = new Map();
    METADATA_WEAKMAP.set(target, data);
  }

  data.set(key, value);

  return value;
}

const OBJ_ID_WEAKMAP = new WeakMap();
let idCount = 1n;

function getObjID(obj) {
  let id = OBJ_ID_WEAKMAP.get(obj);
  if (id == null) {
    let thisID = `${idCount++}`;
    OBJ_ID_WEAKMAP.set(obj, thisID);

    return thisID;
  }

  return id;
}

function nextTick(callback) {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(() => {
      callback();
    });
  } else {
    (new Promise((resolve) => {
      resolve();
    })).then(() => {
      callback();
    });
  }
}

const DYNAMIC_PROPERTY_GC_TIME = 10000;
const DYNAMIC_PROPERTY_VALUE            = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/value');
const DYNAMIC_PROPERTY_REGISTERED_NODES = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/registered-nodes');
const DYNAMIC_PROPERTY_CMT              = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/clean-memory-timer');
const DYNAMIC_PROPERTY_IS_SETTING       = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');

class DynamicProperty extends EventTarget {
  constructor(defaultValue) {
    super();

    Object.defineProperties(this, {
      [DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        defaultValue,
      },
      [DYNAMIC_PROPERTY_REGISTERED_NODES]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        [],
      },
      [DYNAMIC_PROPERTY_CMT]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        null,
      },
      [DYNAMIC_PROPERTY_IS_SETTING]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        false,
      },
    });

    let proxy = new Proxy(this, {
      get:  (target, propName) => {
        if (propName in target) {
          let value = target[propName];
          return (typeof value === 'function') ? value.bind(target) : value;
        }

        let value = target[DYNAMIC_PROPERTY_VALUE][propName];
        return (value === 'function') ? value.bind(target[DYNAMIC_PROPERTY_VALUE]) : value;
      },
      set:  (target, propName, value) => {
        if (propName in target)
          target[propName] = value;
        else
          target[DYNAMIC_PROPERTY_VALUE][propName] = value;

        return true;
      },
    });

    return proxy;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number')
      return +this[DYNAMIC_PROPERTY_VALUE];
    else if (hint === 'string')
      return this.toString();

    return this.valueOf();
  }

  toString() {
    let value = this[DYNAMIC_PROPERTY_VALUE];
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  valueOf() {
    return this[DYNAMIC_PROPERTY_VALUE];
  }

  _freeDeadReferences() {
    // clear dead nodes
    this[DYNAMIC_PROPERTY_REGISTERED_NODES] = this[DYNAMIC_PROPERTY_REGISTERED_NODES].filter((entry) => !!entry.ref.deref());

    clearTimeout(this[DYNAMIC_PROPERTY_CMT]);
    this[DYNAMIC_PROPERTY_CMT] = null;

    if (this[DYNAMIC_PROPERTY_REGISTERED_NODES].length) {
      let randomness = (Math.random() * DYNAMIC_PROPERTY_GC_TIME);
      this[DYNAMIC_PROPERTY_CMT] = setTimeout(() => this._freeDeadReferences(), Math.round(DYNAMIC_PROPERTY_GC_TIME + randomness));
    }
  }

  _set(_newValue) {
    if (this[DYNAMIC_PROPERTY_IS_SETTING])
      return;

    let newValue = _newValue;
    if (isType(newValue, DynamicProperty, 'DynamicProperty'))
      newValue = newValue.valueOf();

    if (this[DYNAMIC_PROPERTY_VALUE] === newValue)
      return;

    try {
      this[DYNAMIC_PROPERTY_IS_SETTING] = true;

      let oldValue    = this[DYNAMIC_PROPERTY_VALUE];
      let updateEvent = new Event('update');

      updateEvent.originator = this;
      updateEvent.oldValue = oldValue;
      updateEvent.value = newValue;

      this.dispatchEvent(updateEvent);
      if (updateEvent.defaultPrevented)
        return;

      this[DYNAMIC_PROPERTY_VALUE] = newValue;
    } catch (error) {
      console.error(error);
    } finally {
      this[DYNAMIC_PROPERTY_IS_SETTING] = false;
    }

    nextTick(() => this._triggerUpdates());
  }

  _triggerUpdates() {
    for (let { ref, callback } of this[DYNAMIC_PROPERTY_REGISTERED_NODES]) {
      let node = ref.deref();
      if (!node)
        continue;

      let newValue = callback(node, this);
      node.nodeValue = newValue;
    }
  }

  _registerForUpdate(node, callback) {
    let exists = this[DYNAMIC_PROPERTY_REGISTERED_NODES].find((entry) => (entry.ref.deref() === node));
    if (exists)
      return;

    let ref = new WeakRef(node);
    this[DYNAMIC_PROPERTY_REGISTERED_NODES].push({ ref, callback });

    this._freeDeadReferences();
  }
}

const VALID_JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function getContextCallArgs(context, ...extraContexts) {
  let contextCallArgs = Array.from(
    new Set(getAllPropertyNames(context).concat(
      Object.keys(globalThis.mythixUI.globalScope || {}),
      [ 'attributes', 'classList', '$$', 'i18n' ],
      ...extraContexts.map((extraContext) => Object.keys(extraContext || {})),
    )),
  ).filter((name) => VALID_JS_IDENTIFIER.test(name));

  return `{${contextCallArgs.join(',')}}`;
}

function createProxyContext(..._targets) {
  const findPropNameScope = (target, propName) => {
    if (target == null || Object.is(target, NaN))
      return;

    if (propName in target)
      return target;

    if (!(target instanceof Node))
      return;

    const getParentNode = (element) => {
      if (!element)
        return null;

      if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
        return metadata(element, MYTHIX_SHADOW_PARENT);

      return element.parentNode;
    };

    const fetchPublishContext = (element) => {
      let currentElement = element;
      if (!currentElement)
        return;

      let componentPublishContext;
      do {
        if (propName in currentElement)
          return currentElement;

        componentPublishContext = currentElement.publishContext;
        if (typeof componentPublishContext === 'function')
          break;

        currentElement = getParentNode(currentElement);
      } while (currentElement);

      if (!componentPublishContext || !currentElement)
        return;

      let publishedContext = componentPublishContext.call(currentElement);
      if (!publishedContext || !(propName in publishedContext))
        return fetchPublishContext(getParentNode(currentElement));

      return publishedContext;
    };

    return fetchPublishContext(target);
  };

  let targets         = _targets.filter(Boolean);
  let firstElement    = targets.find((target) => (target instanceof Node)) || targets[0];
  let baseContext     = {};
  let fallbackContext = {
    i18n: ((path, d) => getDynamicPropertyForPath.call(specialClosest(firstElement, 'mythix-language-provider') || firstElement, `globalThis.mythixUI.globalStore.i18n.${path}`, d)),
    dynamicPropID,
  };

  targets = targets.concat(fallbackContext);
  let proxy   = new Proxy(baseContext, {
    ownKeys: () => {
      let allKeys = [];

      for (let target of targets)
        allKeys = allKeys.concat(getAllPropertyNames(target));

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (globalScope)
        allKeys = allKeys.concat(Object.keys(globalScope));

      return Array.from(new Set(allKeys));
    },
    get: (_, propName) => {
      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return scope[propName];
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return;

      return globalScope[propName];
    },
    set: (_, propName, value) => {
      const doSet = (scope, propName, value) => {
        if (isType(scope[propName], DynamicProperty, 'DynamicProperty'))
          scope[propName]._set(value);
        else
          scope[propName] = value;

        return true;
      };

      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return doSet(scope, propName, value);
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return false;

      return doSet(globalScope, propName, value);
    },
  });

  fallbackContext.$$ = proxy;

  return proxy;
}

function createDynamicPropertyFetcher({ prefix, body, scopes }) {
  let context         = createProxyContext(...(scopes || []));
  let contextCallArgs = getContextCallArgs(context);
  let functionBody    = `${prefix || '(void 0)'};return ${(body || '(void 0)').replace(/^\s*return\s+/, '').trim()};`;
  return (new Function(contextCallArgs, functionBody)).bind(context, context);
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
function formatTerm(_nodeOrText, ..._scopes) {
  let scopes  = _scopes.filter(Boolean);
  let text    = _nodeOrText;
  let node;

  if (text instanceof Node) {
    node = text;
    if (FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
      throw new TypeError('"formatTerm" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

    text = node.nodeValue;
  }

  let result = text.replace(/(?:^@@|([^\\])@@)(.+?)@@/g, (m, start, macro) => {
    const fetcher = createDynamicPropertyFetcher({ body: macro, scopes });
    let value = fetcher();
    if (value == null)
      value = '';

    if (node && isType(value, DynamicProperty, 'DynamicProperty')) {
      value._registerForUpdate(node, () => {
        let result = formatTerm(text, ...scopes);
        return result;
      });
    }

    return `${start || ''}${value}`;
  });

  return result;
}

const HAS_DYNAMIC_BINDING = /^@@|[^\\]@@/;
function stringIsDynamicBindingTemplate(value) {
  if (!isType(value, 'String'))
    return false;

  return HAS_DYNAMIC_BINDING.test(value);
}

const EVENT_ACTION_JUST_NAME = /^%?[\w.$]+$/;
function createContextAwareCallback({ prefix, body, scopes }) {
  let functionBody = body;
  if (EVENT_ACTION_JUST_NAME.test(functionBody)) {
    if (functionBody.charAt(0) === '%')
      functionBody = `(this.dynamicPropID || globalThis.mythixUI.globalScope.dynamicPropID)('${functionBody.substring(1).trim().replace(/[^\w$]/g, '')}')`;
    else
      functionBody = `this.${functionBody}.apply(this, Array.from(arguments).slice(1));`;
  }

  return createDynamicPropertyFetcher({
    body:   functionBody,
    prefix: `${prefix || '(void 0)'};`,
    scopes,
  });
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = new Map();

function getAllEventNamesForElement(element) {
  let tagName = (!element.tagName) ? element : element.tagName.toUpperCase();
  let cache   = EVENT_NAME_CACHE.get(tagName);
  if (cache)
    return cache;

  let eventNames = [];

  for (let key in element) {
    if (key.length > 2 && IS_EVENT_NAME.test(key))
      eventNames.push(key.toLowerCase());
  }

  EVENT_NAME_CACHE.set(tagName, eventNames);

  return eventNames;
}

function bindEventToElement(element, eventName, _callback, ...scopes) {
  let options = {};
  let callback;

  if (isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else if (typeof _callback === 'function') {
    callback = _callback;
  } else {
    callback = _callback;
  }

  if (isType(callback, 'String'))
    callback = createContextAwareCallback({ prefix: 'let event=arguments[0]', body: callback, scopes });

  element.addEventListener(eventName, callback, options);

  return { callback, options };
}

function fetchPath(obj, key, defaultValue) {
  if (obj == null || Object.is(obj, NaN) || Object.is(obj, Infinity) || Object.is(obj, -Infinity))
    return defaultValue;

  if (key == null || Object.is(key, NaN) || Object.is(key, Infinity) || Object.is(key, -Infinity))
    return defaultValue;

  let parts         = key.split(/\./g).filter(Boolean);
  let currentValue  = obj;

  for (let i = 0, il = parts.length; i < il; i++) {
    let part = parts[i];
    let nextValue = currentValue[part];
    if (nextValue == null)
      return defaultValue;

    currentValue = nextValue;
  }

  if (globalThis.Node && currentValue && currentValue instanceof globalThis.Node && (currentValue.nodeType === Node.TEXT_NODE || currentValue.nodeType === Node.ATTRIBUTE_NODE))
    return currentValue.nodeValue;

  return (currentValue == null) ? defaultValue : currentValue;
}

const IS_NUMBER = /^([-+]?)(\d*(?:\.\d+)?)(e[-+]\d+)?$/;
const IS_BOOLEAN = /^(true|false)$/;

function coerce(value) {
  if (value === 'null')
    return null;

  if (value === 'undefined')
    return undefined;

  if (value === 'NaN')
    return NaN;

  if (value === 'Infinity' || value === '+Infinity')
    return Infinity;

  if (value === '-Infinity')
    return -Infinity;

  if (IS_NUMBER.test(value))
    // eslint-disable-next-line no-magic-numbers
    return parseFloat(value, 10);

  if (IS_BOOLEAN.test(value))
    return (value === 'true');

  return ('' + value);
}

const CACHED_PROPERTY_NAMES = new WeakMap();
const SKIP_PROTOTYPES       = [
  globalThis.HTMLElement,
  globalThis.Node,
  globalThis.Element,
  globalThis.Object,
  globalThis.Array,
];

function getAllPropertyNames(_obj) {
  if (!isCollectable(_obj))
    return [];

  let cachedNames = CACHED_PROPERTY_NAMES.get(_obj);
  if (cachedNames)
    return cachedNames;

  let obj   = _obj;
  let names = new Set();

  while (obj) {
    let objNames = Object.getOwnPropertyNames(obj);
    for (let i = 0, il = objNames.length; i < il; i++)
      names.add(objNames[i]);

    obj = Object.getPrototypeOf(obj);
    if (obj && SKIP_PROTOTYPES.indexOf(obj.constructor) >= 0)
      break;
  }

  let finalNames = Array.from(names);
  CACHED_PROPERTY_NAMES.set(_obj, finalNames);

  return finalNames;
}

const LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE = new WeakMap();
function getDynamicPropertyForPath(keyPath, defaultValue) {
  let instanceCache = LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.get(this);
  if (!instanceCache) {
    instanceCache = new Map();
    LANG_PROVIDER_DYNAMIC_PROPERTY_CACHE.set(this, instanceCache);
  }

  let property = instanceCache.get(keyPath);
  if (!property) {
    property = new DynamicProperty(defaultValue);
    instanceCache.set(keyPath, property);
  }

  return property;
}

function specialClosest(node, selector) {
  if (!node || !selector)
    return;

  if (typeof node.matches !== 'function')
    return;

  const getParentNode = (element) => {
    if (!element)
      return null;

    if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
      return metadata(element, MYTHIX_SHADOW_PARENT);

    return element.parentNode;
  };

  let currentNode = node;
  let result;

  while (currentNode && !(result = currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return result;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 0);
  });
}

function dynamicProp(name, defaultValue, setter) {
  let dynamicProperty = new DynamicProperty(defaultValue);

  Object.defineProperties(this, {
    [name]: {
      enumerable:   true,
      configurable: true,
      get:          () => dynamicProperty,
      set:          (newValue) => {
        if (typeof setter === 'function')
          dynamicProperty._set(setter(newValue));
        else
          dynamicProperty._set(newValue);
      },
    },
  });

  return dynamicProperty;
}

const DYNAMIC_PROP_REGISTRY = new Map();

function dynamicPropID(id) {
  let prop = DYNAMIC_PROP_REGISTRY.get(id);
  if (prop)
    return prop;

  prop = new DynamicProperty('');
  DYNAMIC_PROP_REGISTRY.set(id, prop);

  return prop;
}

function globalStoreNameValuePairHelper(target, name, value) {
  metadata(
    target,
    MYTHIX_NAME_VALUE_PAIR_HELPER,
    [ name, value ],
  );

  return target;
}

const REGISTERED_DISABLE_TEMPLATE_SELECTORS = new Set([ '[data-templates-disable]', 'mythix-for-each' ]);
function disableTemplateEngineSelector() {
  return Array.from(REGISTERED_DISABLE_TEMPLATE_SELECTORS).join(',');
}

function registerDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.add(selector);
}

function unregisterDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.delete(selector);
}

function globalStoreHelper(dynamic, args) {
  if (args.length === 0)
    return;

  const setOnGlobal = (name, value) => {
    let currentValue = globalThis.mythixUI.globalScope[name];
    if (isType(currentValue, DynamicProperty, 'DynamicProperty')) {
      globalThis.mythixUI.globalScope[name]._set(value);
      return;
    }

    if (isType(value, DynamicProperty, 'DynamicProperty')) {
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => value,
          set:          (newValue) => {
            value._set(newValue);
          },
        },
      });
    } else if (dynamic) {
      let prop = dynamicPropID(name);
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => prop,
          set:          (newValue) => {
            prop._set(newValue);
          },
        },
      });

      prop._set(value);
    } else {
      globalThis.mythixUI.globalScope[name] = value;
    }
  };

  let nameValuePair = metadata(args[0], MYTHIX_NAME_VALUE_PAIR_HELPER);
  if (nameValuePair) {
    let [ name, value ] = nameValuePair;
    setOnGlobal(name, value);
  } else if (args.length > 1 && isType(args[0], 'String')) {
    let name  = args[0];
    let value = args[1];
    setOnGlobal(name, value);
  } else {
    let value = args[0];
    let name  = (typeof this.getIdentifier === 'function') ? this.getIdentifier() : (this.getAttribute('id') || this.getAttribute('name'));
    if (!name)
      throw new Error('"mythixUI.globalStore": "name" is unknown, so unable to store value');

    setOnGlobal(name, value);
  }
}

function globalStore(...args) {
  return globalStoreHelper.call(this, false, args);
}

function globalStoreDynamic(...args) {
  return globalStoreHelper.call(this, true, args);
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Components: () => (/* reexport module object */ _component_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   Elements: () => (/* reexport module object */ _elements_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   MythixUILanguageProvider: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__.MythixUILanguageProvider),
/* harmony export */   MythixUIRequire: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIRequire),
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__.MythixUISpinner),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-language-provider.js */ "./lib/mythix-ui-language-provider.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});














const MythixUIComponent = _component_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent;



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

globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Components = _component_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_2__;
globalThis.mythixUI.globalScope.globalStore = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStore;
globalThis.mythixUI.globalScope.globalStoreDynamic = _utils_js__WEBPACK_IMPORTED_MODULE_0__.globalStoreDynamic;

globalThis.mythixUI.globalScope.dynamicPropID = function(id) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.dynamicPropID(id);
};

if (typeof document !== 'undefined') {
  let didVisibilityObservers = false;

  const onDocumentReady = () => {
    if (!didVisibilityObservers) {
      let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
      _component_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        disconnect();

        _component_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement.call(element, src).then(() => {
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
    let disableTemplateEngineSelectorStr = _utils_js__WEBPACK_IMPORTED_MODULE_0__.disableTemplateEngineSelector();
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

        if (newValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(newValue))
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(mutation.target, attributeNode);
      } else if (mutation.type === 'childList') {
        if (disableTemplateEngineSelectorStr && mutation.target && mutation.target.closest('[data-templates-disable],mythix-for-each'))
          continue;

        let addedNodes = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          _component_js__WEBPACK_IMPORTED_MODULE_1__.recursivelyBindDynamicData(node);
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

  _component_js__WEBPACK_IMPORTED_MODULE_1__.recursivelyBindDynamicData(document.head);
  _component_js__WEBPACK_IMPORTED_MODULE_1__.recursivelyBindDynamicData(document.body);

  setTimeout(() => {
    if (document.readyState === 'complete')
      onDocumentReady();
    else
      document.addEventListener('DOMContentLoaded', onDocumentReady);
  }, 250);

  window.addEventListener('load', onDocumentReady);
}

})();

var __webpack_exports__Components = __webpack_exports__.Components;
var __webpack_exports__Elements = __webpack_exports__.Elements;
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__MythixUILanguageProvider = __webpack_exports__.MythixUILanguageProvider;
var __webpack_exports__MythixUIRequire = __webpack_exports__.MythixUIRequire;
var __webpack_exports__MythixUISpinner = __webpack_exports__.MythixUISpinner;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
export { __webpack_exports__Components as Components, __webpack_exports__Elements as Elements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUILanguageProvider as MythixUILanguageProvider, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyw4QkFBOEIsNERBQWlCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxPQUFPOztBQUVQ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RUE7QUFDQTs7QUFFQSx3QkFBd0IscUVBQW9DO0FBQzVELG9DQUFvQyxpREFBZ0I7QUFDcEQsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSxnREFBZ0QsUUFBUTtBQUN4RDtBQUNBLFVBQVUscUVBQXFDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsRUFBRSxxRUFBcUM7QUFDdkMsRUFBRSxxRUFBcUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1yZXF1aXJlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1zcGlubmVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3F1ZXJ5LWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19BVFRSX01FVEhPRF9OQU1FICAgPSAvXmF0dHJcXCQoLiopJC87XG5jb25zdCBSRUdJU1RFUkVEX0NPTVBPTkVOVFMgPSBuZXcgU2V0KCk7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQ7XG4gIHN0YXRpYyByZWdpc3RlciA9IGZ1bmN0aW9uKF9uYW1lLCBfS2xhc3MpIHtcbiAgICBsZXQgbmFtZSA9IF9uYW1lIHx8IHRoaXMudGFnTmFtZTtcbiAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSkge1xuICAgICAgbGV0IEtsYXNzID0gX0tsYXNzIHx8IHRoaXM7XG4gICAgICBLbGFzcy5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBLbGFzcy5jb21waWxlQXR0cmlidXRlTWV0aG9kcyhLbGFzcyk7XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChyZWdpc3RlckV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBzdGF0aWMgY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbihLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgbmFtZXMgPSBVdGlscy5nZXRBbGxQcm9wZXJ0eU5hbWVzKHByb3RvKVxuICAgICAgLmZpbHRlcigobmFtZSkgPT4gSVNfQVRUUl9NRVRIT0RfTkFNRS50ZXN0KG5hbWUpKVxuICAgICAgLm1hcCgob3JpZ2luYWxOYW1lKSA9PiB7XG4gICAgICAgIGxldCBuYW1lID0gb3JpZ2luYWxOYW1lLm1hdGNoKElTX0FUVFJfTUVUSE9EX05BTUUpWzFdO1xuICAgICAgICBpZiAoUkVHSVNURVJFRF9DT01QT05FTlRTLmhhcyhLbGFzcykpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHByb3RvLCBvcmlnaW5hbE5hbWUpO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGVcbiAgICAgICAgLy8gdXNlciBkaWQgaXQgd3JvbmcuLi4gc28ganVzdFxuICAgICAgICAvLyBtYWtlIHRoaXMgdGhlIFwic2V0dGVyXCJcbiAgICAgICAgbGV0IG1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgIGlmIChtZXRob2QpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IG9yaWdpbmFsR2V0ID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICAgIGlmIChvcmlnaW5hbEdldCkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb3RvLCB7XG4gICAgICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgICAgICAgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsR2V0LmNhbGwoY29udGV4dCwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0OiAgICAgICAgICBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVXRpbHMudG9TbmFrZUNhc2UobmFtZSk7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIG5hbWVzO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgLyosIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0qLyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+ICgodGhpcy5wcmVmaXgpID8gYCR7dGhpcy5wcmVmaXh9OiR7dGhpcy5sb2NhbE5hbWV9YCA6IHRoaXMubG9jYWxOYW1lKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGVJRCc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSUQsXG4gICAgICB9LFxuICAgICAgJ2RlbGF5VGltZXJzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbmV3IE1hcCgpLFxuICAgICAgfSxcbiAgICAgICdkb2N1bWVudEluaXRpYWxpemVkJzoge1xuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnKSxcbiAgICAgICAgc2V0OiAgICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCAnX215dGhpeFVJRG9jdW1lbnRJbml0aWFsaXplZCcsICEhdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzaGFkb3cnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY3JlYXRlU2hhZG93RE9NKCksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXR0cihuYW1lLCB2YWx1ZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICB9XG5cbiAgaW5qZWN0U3R5bGVTaGVldChjb250ZW50KSB7XG4gICAgbGV0IHN0eWxlSUQgICAgICAgPSBgSURTVFlMRSR7VXRpbHMuU0hBMjU2KGAke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fWApfWA7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHN0eWxlRWxlbWVudCAgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKTtcblxuICAgIGlmIChzdHlsZUVsZW1lbnQpXG4gICAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuXG4gICAgc3R5bGVFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblxuICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG4gIH1cblxuICBwcm9jZXNzRWxlbWVudHMobm9kZSwgX29wdGlvbnMpIHtcbiAgICBpZiAoIW5vZGUpXG4gICAgICByZXR1cm4gbm9kZTtcblxuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gICAgbGV0IGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyID0gKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSA9PT0gdHJ1ZSkgPyB1bmRlZmluZWQgOiBVdGlscy5kaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpO1xuICAgIGZvciAobGV0IGNoaWxkTm9kZSBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiBjaGlsZE5vZGUucGFyZW50Tm9kZSAmJiB0eXBlb2YgY2hpbGROb2RlLnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBjaGlsZE5vZGUucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGNoaWxkTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKGNoaWxkTm9kZSwgdGhpcywgLi4uKG9wdGlvbnMuc2NvcGVzIHx8IFtdKSk7XG4gICAgICB9IGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgY2hpbGROb2RlLm5vZGVUeXBlID49IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgICBpZiAoIShkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiBjaGlsZE5vZGUgJiYgdHlwZW9mIGNoaWxkTm9kZS5jbG9zZXN0ID09PSAnZnVuY3Rpb24nICYmIGNoaWxkTm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSkpXG4gICAgICAgICAgY2hpbGROb2RlID0gdGhpcy5wcm9jZXNzRWxlbWVudHMoY2hpbGROb2RlLCBvcHRpb25zKTtcblxuICAgICAgICBsZXQgZXZlbnROYW1lcyAgICAgID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoY2hpbGROb2RlKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KGNoaWxkTm9kZSwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUsIGNoaWxkTm9kZSwgLi4uKG9wdGlvbnMuc2NvcGVzIHx8IFtdKSk7XG4gICAgICAgICAgICBjaGlsZE5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShhdHRyaWJ1dGVOb2RlLCB0aGlzLCAuLi4ob3B0aW9ucy5zY29wZXMgfHwgW10pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGF0dGFjaFNoYWRvdyhvcHRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZW52aXJvbm1lbnQgc3VwcG9ydFxuICAgIGlmICh0eXBlb2Ygc3VwZXIuYXR0YWNoU2hhZG93ICE9PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHNoYWRvdyA9IHN1cGVyLmF0dGFjaFNoYWRvdyhvcHRpb25zKTtcbiAgICBVdGlscy5tZXRhZGF0YShzaGFkb3csIFV0aWxzLk1ZVEhJWF9TSEFET1dfUEFSRU5ULCB0aGlzKTtcblxuICAgIHJldHVybiBzaGFkb3c7XG4gIH1cblxuICBjcmVhdGVTaGFkb3dET00ob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJywgLi4uKG9wdGlvbnMgfHwge30pIH0pO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgaWYgKCF0aGlzLm93bmVyRG9jdW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAodGhpcy50ZW1wbGF0ZUlEKVxuICAgICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0ZW1wbGF0ZVtkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZT1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV1gKTtcbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gX3RlbXBsYXRlIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBlbnN1cmVEb2N1bWVudFN0eWxlcy5jYWxsKHRoaXMsIHRoaXMub3duZXJEb2N1bWVudCwgdGhpcy5zZW5zaXRpdmVUYWdOYW1lLCB0ZW1wbGF0ZSk7XG5cbiAgICAgIGxldCBmb3JtYXR0ZWRUZW1wbGF0ZSA9IHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKGZvcm1hdHRlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBVdGlscy5uZXh0VGljaygoKSA9PiB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51bm1vdW50ZWQoKTtcbiAgfVxuXG4gIGF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3U3JjKSB7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci51bm9ic2VydmUodGhpcyk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTcmMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb2JzZXJ2ZXIgPSB2aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgd2FzVmlzaWJsZSwgZGlzY29ubmVjdCB9KSA9PiB7XG4gICAgICBpZiAoIXdhc1Zpc2libGUpXG4gICAgICAgIHRoaXMuZmV0Y2hTcmModGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpKTtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfSwgeyBlbGVtZW50czogWyB0aGlzIF0gfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmlzaWJpbGl0eU9ic2VydmVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvYnNlcnZlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIGxldCBbXG4gICAgICBuYW1lLFxuICAgICAgb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZSxcbiAgICBdID0gYXJncztcblxuICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGxldCBtYWdpY05hbWUgICA9IGBhdHRyJCR7VXRpbHMudG9DYW1lbENhc2UobmFtZSl9YDtcbiAgICAgIGxldCBkZXNjcmlwdG9yICA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBDYWxsIHNldHRlclxuICAgICAgICB0aGlzW21hZ2ljTmFtZV0gPSBbIGFyZ3NbMl0sIGFyZ3NbMV0gXS5jb25jYXQoYXJncy5zbGljZSgzKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICBnZXQgJCQoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmNyZWF0ZVByb3h5Q29udGV4dCh0aGlzKTtcbiAgfVxuXG4gICQoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICAgID0gKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleCsrXSkgOiB7fTtcbiAgICBsZXQgcXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgeyByb290OiB0aGlzLCAuLi5vcHRpb25zLCBpbnZva2VDYWxsYmFja3M6IGZhbHNlIH0sIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgICBsZXQgc2hhZG93Tm9kZXM7XG5cbiAgICBvcHRpb25zID0gcXVlcnlFbmdpbmUuZ2V0T3B0aW9ucygpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hhZG93ICE9PSBmYWxzZSAmJiBvcHRpb25zLnNlbGVjdG9yICYmIG9wdGlvbnMucm9vdCA9PT0gdGhpcykge1xuICAgICAgc2hhZG93Tm9kZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBRdWVyeUVuZ2luZS5mcm9tLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICB7IHJvb3Q6IHRoaXMuc2hhZG93IH0sXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3RvcixcbiAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrLFxuICAgICAgICApLnZhbHVlcygpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc2hhZG93Tm9kZXMpXG4gICAgICBxdWVyeUVuZ2luZSA9IHF1ZXJ5RW5naW5lLmFkZChzaGFkb3dOb2Rlcyk7XG5cbiAgICBpZiAob3B0aW9ucy5zbG90dGVkICE9PSB0cnVlKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5zbG90dGVkKGZhbHNlKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiB0aGlzLiQocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2soRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwge30pIF0uZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtW0VsZW1lbnRzLlVORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiBpdGVtKCk7XG5cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgfVxuXG4gIGlzQXR0cmlidXRlVHJ1dGh5KG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKG5hbWUpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBVdGlscy50b0NhbWVsQ2FzZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyLCBfY29udGV4dCkge1xuICAgIHJldHVybiBVdGlscy5keW5hbWljUHJvcC5jYWxsKF9jb250ZXh0IHx8IHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBVdGlscy5keW5hbWljUHJvcC5jYWxsKGRhdGEsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZGVib3VuY2UoY2FsbGJhY2ssIG1zLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IFV0aWxzLmNyZWF0ZVJlc29sdmFibGUoKTtcbiAgICB0aGlzLmRlbGF5VGltZXJzLnNldChpZCwgcHJvbWlzZSk7XG5cbiAgICAvLyBMZXQncyBub3QgY29tcGxhaW4gYWJvdXRcbiAgICAvLyB1bmNhdWdodCBlcnJvcnNcbiAgICBwcm9taXNlLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIHByb21pc2UudGltZXJJRCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgY2FsbGluZyBcImRlbGF5XCIgY2FsbGJhY2s6ICcsIGVycm9yLCBjYWxsYmFjay50b1N0cmluZygpKTtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH0sIG1zIHx8IDApO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBjbGFzc2VzKC4uLl9hcmdzKSB7XG4gICAgbGV0IGFyZ3MgPSBfYXJncy5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgJ1N0cmluZycpKVxuICAgICAgICByZXR1cm4gaXRlbS50cmltKCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgIGxldCBrZXlzICA9IE9iamVjdC5rZXlzKGl0ZW0pO1xuICAgICAgICBsZXQgaXRlbXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBsZXQga2V5ICAgPSBrZXlzW2ldO1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICBpdGVtcy5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYXJncykpLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKHNyY1VSTCkge1xuICAgIGlmICghc3JjVVJMKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbCh0aGlzLCBzcmNVUkwpO1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY1VSTH0gKHJlc29sdmVkIHRvOiAke2Vycm9yLnVybH0pYCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SWRlbnRpZmllcih0YXJnZXQpIHtcbiAgaWYgKCF0YXJnZXQpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0LmdldElkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRJZGVudGlmaWVyLmNhbGwodGFyZ2V0KTtcblxuICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudClcbiAgICByZXR1cm4gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJykgfHwgVXRpbHMudG9DYW1lbENhc2UodGFyZ2V0LmxvY2FsTmFtZSk7XG5cbiAgcmV0dXJuICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGlmICghcnVsZS5zZWxlY3RvclRleHQpXG4gICAgcmV0dXJuIHJ1bGUuY3NzVGV4dDtcblxuICBsZXQgX2JvZHkgICA9IHJ1bGUuY3NzVGV4dC5zdWJzdHJpbmcocnVsZS5zZWxlY3RvclRleHQubGVuZ3RoKS50cmltKCk7XG4gIGxldCByZXN1bHQgID0gKGNhbGxiYWNrKHJ1bGUuc2VsZWN0b3JUZXh0LCBfYm9keSkgfHwgW10pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmV0dXJuICcnO1xuXG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBjc3NSdWxlc1RvU291cmNlKGNzc1J1bGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQXJyYXkuZnJvbShjc3NSdWxlcyB8fCBbXSkubWFwKChydWxlKSA9PiB7XG4gICAgbGV0IHJ1bGVTdHIgPSBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gYCR7Y3NzUnVsZXNUb1NvdXJjZShydWxlLmNzc1J1bGVzLCBjYWxsYmFjayl9JHtydWxlU3RyfWA7XG4gIH0pLmpvaW4oJ1xcblxcbicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVGb3JEb2N1bWVudChlbGVtZW50TmFtZSwgc3R5bGVFbGVtZW50KSB7XG4gIGNvbnN0IGhhbmRsZUhvc3QgPSAobSwgdHlwZSwgX2NvbnRlbnQpID0+IHtcbiAgICBsZXQgY29udGVudCA9ICghX2NvbnRlbnQpID8gX2NvbnRlbnQgOiBfY29udGVudC5yZXBsYWNlKC9eXFwoLywgJycpLnJlcGxhY2UoL1xcKSQvLCAnJyk7XG5cbiAgICBpZiAodHlwZSA9PT0gJzpob3N0Jykge1xuICAgICAgaWYgKCFjb250ZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudE5hbWU7XG5cbiAgICAgIC8vIEVsZW1lbnQgc2VsZWN0b3I/XG4gICAgICBpZiAoKC9eW2EtekEtWl9dLykudGVzdChjb250ZW50KSlcbiAgICAgICAgcmV0dXJuIGAke2NvbnRlbnR9W2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIl1gO1xuXG4gICAgICByZXR1cm4gYCR7ZWxlbWVudE5hbWV9JHtjb250ZW50fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHtjb250ZW50fSAke2VsZW1lbnROYW1lfWA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBjc3NSdWxlc1RvU291cmNlKFxuICAgIHN0eWxlRWxlbWVudC5zaGVldC5jc3NSdWxlcyxcbiAgICAoX3NlbGVjdG9yLCBib2R5KSA9PiB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBfc2VsZWN0b3I7XG4gICAgICBsZXQgdGFncyAgICAgPSBbXTtcblxuICAgICAgbGV0IHVwZGF0ZWRTZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyhbJ1wiXSkoPzpcXFxcLnxbXlxcMV0pKz9cXDEvLCAobSkgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSB0YWdzLmxlbmd0aDtcbiAgICAgICAgdGFncy5wdXNoKG0pO1xuICAgICAgICByZXR1cm4gYEBAQFRBR1ske2luZGV4fV1AQEBgO1xuICAgICAgfSkuc3BsaXQoJywnKS5tYXAoKHNlbGVjdG9yKSA9PiB7XG4gICAgICAgIGxldCBtb2RpZmllZCA9IHNlbGVjdG9yLnJlcGxhY2UoLyg6aG9zdCg/Oi1jb250ZXh0KT8pKFxcKFxccypbXildKz9cXHMqXFwpKT8vLCBoYW5kbGVIb3N0KTtcbiAgICAgICAgcmV0dXJuIChtb2RpZmllZCA9PT0gc2VsZWN0b3IpID8gbnVsbCA6IG1vZGlmaWVkO1xuICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywnKS5yZXBsYWNlKC9AQEBUQUdcXFsoXFxkKylcXF1AQEAvLCAobSwgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRhZ3NbK2luZGV4XTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXVwZGF0ZWRTZWxlY3RvcilcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICByZXR1cm4gWyB1cGRhdGVkU2VsZWN0b3IsIGJvZHkgXTtcbiAgICB9LFxuICApO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVEb2N1bWVudFN0eWxlcyhvd25lckRvY3VtZW50LCBjb21wb25lbnROYW1lLCB0ZW1wbGF0ZSkge1xuICBsZXQgb2JqSUQgICAgICAgICAgICAgPSBVdGlscy5nZXRPYmpJRCh0ZW1wbGF0ZSk7XG4gIGxldCB0ZW1wbGF0ZUlEICAgICAgICA9IFV0aWxzLlNIQTI1NihvYmpJRCk7XG4gIGxldCB0ZW1wbGF0ZUNoaWxkcmVuICA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzKTtcbiAgbGV0IGluZGV4ICAgICAgICAgICAgID0gMDtcblxuICBmb3IgKGxldCB0ZW1wbGF0ZUNoaWxkIG9mIHRlbXBsYXRlQ2hpbGRyZW4pIHtcbiAgICBpZiAoISgvXnN0eWxlJC9pKS50ZXN0KHRlbXBsYXRlQ2hpbGQudGFnTmFtZSkpXG4gICAgICBjb250aW51ZTtcblxuICAgIGxldCBzdHlsZUlEID0gYElEU1RZTEUke3RlbXBsYXRlSUR9JHsrK2luZGV4fWA7XG4gICAgaWYgKCFvd25lckRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3Rvcihgc3R5bGUjJHtzdHlsZUlEfWApKSB7XG4gICAgICBsZXQgY2xvbmVkU3R5bGVFbGVtZW50ID0gdGVtcGxhdGVDaGlsZC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IG5ld1N0eWxlU2hlZXQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudChjb21wb25lbnROYW1lLCBjbG9uZWRTdHlsZUVsZW1lbnQpO1xuICAgICAgb3duZXJEb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbiAgICAgIGxldCBzdHlsZU5vZGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICAgIHN0eWxlTm9kZS5pbm5lckhUTUwgPSBuZXdTdHlsZVNoZWV0O1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4oc3RhcnRQcm90bywgZGVzY3JpcHRvck5hbWUpIHtcbiAgbGV0IHRoaXNQcm90byA9IHN0YXJ0UHJvdG87XG4gIGxldCBkZXNjcmlwdG9yO1xuXG4gIHdoaWxlICh0aGlzUHJvdG8gJiYgIShkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzUHJvdG8sIGRlc2NyaXB0b3JOYW1lKSkpXG4gICAgdGhpc1Byb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXNQcm90byk7XG5cbiAgcmV0dXJuIGRlc2NyaXB0b3I7XG59XG5cbmNvbnN0IFNDSEVNRV9SRSAgICAgPSAvXltcXHctXSs6XFwvXFwvLztcbmNvbnN0IEhBU19GSUxFTkFNRSAgPSAvXFwuW14vLl0rJC87XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVVJMKGxvY2F0aW9uLCBfdXJsaXNoLCBtYWdpYykge1xuICBsZXQgdXJsaXNoID0gX3VybGlzaDtcbiAgaWYgKHVybGlzaCBpbnN0YW5jZW9mIFVSTClcbiAgICByZXR1cm4gdXJsaXNoO1xuXG4gIGlmICghdXJsaXNoKVxuICAgIHJldHVybiBuZXcgVVJMKGxvY2F0aW9uKTtcblxuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgTG9jYXRpb24pXG4gICAgcmV0dXJuIG5ldyBVUkwodXJsaXNoKTtcblxuICBpZiAoIVV0aWxzLmlzVHlwZSh1cmxpc2gsICdTdHJpbmcnKSlcbiAgICByZXR1cm47XG5cbiAgY29uc3QgaW50ZXJuYWxSZXNvbHZlID0gKF9sb2NhdGlvbiwgX3VybFBhcnQsIG1hZ2ljKSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsVVJMID0gdXJsaXNoO1xuICAgIGlmIChTQ0hFTUVfUkUudGVzdCh1cmxpc2gpKVxuICAgICAgcmV0dXJuIHVybGlzaDtcblxuICAgIC8vIE1hZ2ljIVxuICAgIGlmIChtYWdpYyA9PT0gdHJ1ZSAmJiAhSEFTX0ZJTEVOQU1FLnRlc3QodXJsaXNoKSkge1xuICAgICAgbGV0IHBhcnRzICAgICA9IHVybGlzaC5zcGxpdCgnLycpLm1hcCgocGFydCkgPT4gcGFydC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGxldCBsYXN0UGFydCAgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChsYXN0UGFydClcbiAgICAgICAgdXJsaXNoID0gYCR7dXJsaXNoLnJlcGxhY2UoL1xcLyskLywgJycpfS8ke2xhc3RQYXJ0fS5odG1sYDtcbiAgICB9XG5cbiAgICBsZXQgbG9jYXRpb24gPSBuZXcgVVJMKF9sb2NhdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogbmV3IFVSTChgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke3VybGlzaH1gLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKSksXG4gICAgICBvcmlnaW5hbFVSTCxcbiAgICB9O1xuICB9O1xuXG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG9yaWdpbmFsVVJMLFxuICB9ID0gaW50ZXJuYWxSZXNvbHZlKGxvY2F0aW9uLCB1cmxpc2gudG9TdHJpbmcoKSwgbWFnaWMpO1xuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBmaWxlTmFtZTtcbiAgICBsZXQgcGF0aDtcblxuICAgIHVybC5wYXRobmFtZS5yZXBsYWNlKC8oLipcXC8pKFteL10rKSQvLCAobSwgZmlyc3QsIHNlY29uZCkgPT4ge1xuICAgICAgcGF0aCA9IGZpcnN0O1xuICAgICAgZmlsZU5hbWUgPSBzZWNvbmQ7XG4gICAgICByZXR1cm4gbTtcbiAgICB9KTtcblxuICAgIGxldCBuZXdTcmMgPSBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyLmNhbGwodGhpcywgeyBzcmM6IG9yaWdpbmFsVVJMLCB1cmwsIHBhdGgsIGZpbGVOYW1lIH0pO1xuICAgIGlmIChuZXdTcmMgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXJlcXVpcmVcIjogTm90IGxvYWRpbmcgXCIke29yaWdpbmFsVVJMfVwiIGJlY2F1c2UgdGhlIGdsb2JhbCBcIm15dGhpeFVJLnVybFJlc29sdmVyXCIgcmVxdWVzdGVkIEkgbm90IGRvIHNvLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdTcmMgIT09IG9yaWdpbmFsVVJMKVxuICAgICAgdXJsID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGxvY2F0aW9uLCBuZXdTcmMsIG1hZ2ljKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBJU19TQ1JJUFQgICAgID0gL14oc2NyaXB0KSQvaTtcbmNvbnN0IFJFUVVJUkVfQ0FDSEUgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBsb2NhdGlvbiwgX3VybCwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBmaWxlTmFtZTtcbiAgbGV0IGJhc2VVUkwgICA9IG5ldyBVUkwoYCR7dXJsLm9yaWdpbn0ke3VybC5wYXRobmFtZS5yZXBsYWNlKC9bXi9dKyQvLCAobSkgPT4ge1xuICAgIGZpbGVOYW1lID0gbTtcbiAgICByZXR1cm4gJyc7XG4gIH0pfSR7dXJsLnNlYXJjaH0ke3VybC5oYXNofWApO1xuXG4gIGxldCB0ZW1wbGF0ZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlU3RyaW5nO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCB4ID0gYS50YWdOYW1lO1xuICAgIGxldCB5ID0gYi50YWdOYW1lO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuICAgIGlmICh4ID09IHkpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHJldHVybiAoeCA8IHkpID8gMSA6IC0xO1xuICB9KTtcblxuICBjb25zdCBmaWxlTmFtZVRvRWxlbWVudE5hbWUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICByZXR1cm4gZmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLi4qJC8sICcnKS5yZXBsYWNlKC9cXGJbQS1aXXxbXkEtWl1bQS1aXS9nLCAoX20pID0+IHtcbiAgICAgIGxldCBtID0gX20udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiAobS5sZW5ndGggPCAyKSA/IGAtJHttfWAgOiBgJHttLmNoYXJBdCgwKX0tJHttLmNoYXJBdCgxKX1gO1xuICAgIH0pLnJlcGxhY2UoLy17Mix9L2csICctJykucmVwbGFjZSgvXlteYS16XSovLCAnJykucmVwbGFjZSgvW15hLXpdKiQvLCAnJyk7XG4gIH07XG5cbiAgbGV0IGd1ZXNzZWRFbGVtZW50TmFtZSAgPSBmaWxlTmFtZVRvRWxlbWVudE5hbWUoZmlsZU5hbWUpO1xuICBsZXQgY29udGV4dCAgICAgICAgICAgICA9IHtcbiAgICBndWVzc2VkRWxlbWVudE5hbWUsXG4gICAgY2hpbGRyZW4sXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB0ZW1wbGF0ZSxcbiAgICB1cmwsXG4gICAgYmFzZVVSTCxcbiAgICBmaWxlTmFtZSxcbiAgfTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMucHJlUHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucHJlUHJvY2Vzcy5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKTtcbiAgfVxuXG4gIGxldCBub2RlSGFuZGxlciAgID0gb3B0aW9ucy5ub2RlSGFuZGxlcjtcbiAgbGV0IHRlbXBsYXRlQ291bnQgPSBjaGlsZHJlbi5yZWR1Y2UoKHN1bSwgZWxlbWVudCkgPT4gKChJU19URU1QTEFURS50ZXN0KGVsZW1lbnQudGFnTmFtZSkpID8gKHN1bSArIDEpIDogc3VtKSwgMCk7XG5cbiAgY29udGV4dC50ZW1wbGF0ZUNvdW50ID0gdGVtcGxhdGVDb3VudDtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgIGlmICh0ZW1wbGF0ZUNvdW50ID09PSAxICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSA9PSBudWxsICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnKSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgJHt1cmx9OiA8dGVtcGxhdGU+IGlzIG1pc3NpbmcgYSBcImRhdGEtZm9yXCIgYXR0cmlidXRlLCBsaW5raW5nIGl0IHRvIGl0cyBvd25lciBjb21wb25lbnQuIEd1ZXNzaW5nIFwiJHtndWVzc2VkRWxlbWVudE5hbWV9XCIuYCk7XG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnZGF0YS1mb3InLCBndWVzc2VkRWxlbWVudE5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNUZW1wbGF0ZTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBsZXQgZWxlbWVudE5hbWUgPSAoY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpIHx8IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnKSk7XG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKGBbZGF0YS1mb3I9XCIke2VsZW1lbnROYW1lfVwiIGldLFtkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCIgaV1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKElTX1NDUklQVC50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxzY3JpcHQ+XG4gICAgICBsZXQgY2hpbGRDbG9uZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2YgY2hpbGQuZ2V0QXR0cmlidXRlTmFtZXMoKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgY2hpbGQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpKTtcblxuICAgICAgbGV0IHNyYyA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIHNyYyA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYy50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ21vZHVsZScpO1xuICAgICAgICBjaGlsZENsb25lLmlubmVySFRNTCA9IGNoaWxkLnRleHRDb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNTY3JpcHQ6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgc3R5bGVJRCA9IGBJRCR7VXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZENsb25lLmlubmVySFRNTH1gKX1gO1xuICAgICAgaWYgKCFjaGlsZENsb25lLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2NyaXB0IyR7c3R5bGVJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkQ2xvbmUpO1xuICAgIH0gZWxzZSBpZiAoKC9eKGxpbmt8c3R5bGUpJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBsZXQgaXNTdHlsZSA9ICgvXnN0eWxlJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU3R5bGUsIGlzTGluazogIWlzU3R5bGUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgaWQgPSBgSUQke1V0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkOiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIG9wdGlvbnMucG9zdFByb2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0ZW1wbGF0ZSA9IGNvbnRleHQudGVtcGxhdGUgPSBvcHRpb25zLnBvc3RQcm9jZXNzLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlKG93bmVyRG9jdW1lbnQsIHVybE9yTmFtZSwgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdXJsICAgICAgID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQubG9jYXRpb24sIHVybE9yTmFtZSwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBjYWNoZUtleTtcblxuICBpZiAoISgvXihmYWxzZXxuby1zdG9yZXxyZWxvYWR8bm8tY2FjaGUpJC8pLnRlc3QodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlJykpKSB7XG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdjYWNoZVBhcmFtcycpICE9PSAndHJ1ZScpIHtcbiAgICAgIGxldCBjYWNoZUtleVVSTCA9IG5ldyBVUkwoYCR7dXJsLm9yaWdpbn0ke3VybC5wYXRobmFtZX1gKTtcbiAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXlVUkwudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FjaGVLZXkgPSB1cmwudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBsZXQgY2FjaGVkUmVzcG9uc2UgPSBSRVFVSVJFX0NBQ0hFLmdldChjYWNoZUtleSk7XG4gICAgaWYgKGNhY2hlZFJlc3BvbnNlKSB7XG4gICAgICBjYWNoZWRSZXNwb25zZSA9IGF3YWl0IGNhY2hlZFJlc3BvbnNlO1xuICAgICAgaWYgKGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlICYmIGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLm9rKVxuICAgICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlOiBjYWNoZWRSZXNwb25zZS5yZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiB0cnVlIH07XG4gICAgfVxuICB9XG5cbiAgbGV0IHByb21pc2UgPSBnbG9iYWxUaGlzLmZldGNoKHVybCwgb3B0aW9ucy5mZXRjaE9wdGlvbnMpLnRoZW4oXG4gICAgYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGlmIChjYWNoZUtleSlcbiAgICAgICAgICBSRVFVSVJFX0NBQ0hFLmRlbGV0ZShjYWNoZUtleSk7XG5cbiAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICBlcnJvci51cmwgPSB1cmw7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIHJlc3BvbnNlLnRleHQgPSBhc3luYyAoKSA9PiBib2R5O1xuICAgICAgcmVzcG9uc2UuanNvbiA9IGFzeW5jICgpID0+IEpTT04ucGFyc2UoYm9keSk7XG5cbiAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogZmFsc2UgfTtcbiAgICB9LFxuICAgIChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZnJvbSBNeXRoaXggVUkgXCJyZXF1aXJlXCI6ICcsIGVycm9yKTtcblxuICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICBSRVFVSVJFX0NBQ0hFLmRlbGV0ZShjYWNoZUtleSk7XG5cbiAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0sXG4gICk7XG5cbiAgUkVRVUlSRV9DQUNIRS5zZXQoY2FjaGVLZXksIHByb21pc2UpO1xuXG4gIHJldHVybiBhd2FpdCBwcm9taXNlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFBhcnRpYWxJbnRvRWxlbWVudChzcmMsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgbGV0IHtcbiAgICBvd25lckRvY3VtZW50LFxuICAgIHVybCxcbiAgICByZXNwb25zZSxcbiAgfSA9IGF3YWl0IHJlcXVpcmUuY2FsbChcbiAgICB0aGlzLFxuICAgIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICBzcmMsXG4gICk7XG5cbiAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5jaGlsZE5vZGVzWzBdKTtcblxuICBsZXQgc2NvcGVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgdXJsLnNlYXJjaFBhcmFtcy5lbnRyaWVzKCkpXG4gICAgc2NvcGVEYXRhW2tleV0gPSBVdGlscy5jb2VyY2UodmFsdWUpO1xuXG4gIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICB0aGlzLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICB1cmwsXG4gICAgYm9keSxcbiAgICB7XG4gICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkLCBpc1RlbXBsYXRlIH0pID0+IHtcbiAgICAgICAgaWYgKChpc1RlbXBsYXRlIHx8ICFpc0hhbmRsZWQpICYmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkpXG4gICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChyZWN1cnNpdmVseUJpbmREeW5hbWljRGF0YShub2RlLCB7IC4uLm9wdGlvbnMsIHNjb3BlczogWyBzY29wZURhdGEgXS5jb25jYXQob3B0aW9ucy5zY29wZXMgfHwgW10pIH0pKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2liaWxpdHlPYnNlcnZlcihjYWxsYmFjaywgX29wdGlvbnMpIHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVudHJpZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVudHJ5ICAgPSBlbnRyaWVzW2ldO1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbnRyeS50YXJnZXQ7XG4gICAgICBpZiAoIWVudHJ5LmlzSW50ZXJzZWN0aW5nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCAnX215dGhpeFVJSW50ZXJzZWN0aW9uT2JzZXJ2ZXJzJyk7XG4gICAgICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpIHtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSUludGVyc2VjdGlvbk9ic2VydmVycycsIGVsZW1lbnRPYnNlcnZlcnMpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0geyB3YXNWaXNpYmxlOiBmYWxzZSwgcmF0aW9WaXNpYmxlOiBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB9O1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzLnNldChvYnNlcnZlciwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IGRhdGEucmF0aW9WaXNpYmxlKVxuICAgICAgICBkYXRhLnJhdGlvVmlzaWJsZSA9IGVudHJ5LmludGVyc2VjdGlvblJhdGlvO1xuXG4gICAgICBkYXRhLnByZXZpb3VzVmlzaWJpbGl0eSA9IChkYXRhLnZpc2liaWxpdHkgPT09IHVuZGVmaW5lZCkgPyBkYXRhLnZpc2liaWxpdHkgOiBkYXRhLnZpc2liaWxpdHk7XG4gICAgICBkYXRhLnZpc2liaWxpdHkgPSAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjApO1xuXG4gICAgICBjYWxsYmFjayh7IC4uLmRhdGEsIGVudHJ5LCBlbGVtZW50LCBpbmRleDogaSwgZGlzY29ubmVjdDogKCkgPT4gb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpIH0pO1xuXG4gICAgICBpZiAoZGF0YS52aXNpYmlsaXR5ICYmICFkYXRhLndhc1Zpc2libGUpXG4gICAgICAgIGRhdGEud2FzVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGxldCBvcHRpb25zID0ge1xuICAgIHJvb3Q6ICAgICAgIG51bGwsXG4gICAgdGhyZXNob2xkOiAgMC4wLFxuICAgIC4uLihfb3B0aW9ucyB8fCB7fSksXG4gIH07XG5cbiAgbGV0IG9ic2VydmVyICA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpbnRlcnNlY3Rpb25DYWxsYmFjaywgb3B0aW9ucyk7XG4gIGxldCBlbGVtZW50cyAgPSAoX29wdGlvbnMgfHwge30pLmVsZW1lbnRzIHx8IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50c1tpXSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5jb25zdCBOT19PQlNFUlZFUiA9IE9iamVjdC5mcmVlemUoe1xuICB3YXNWaXNpYmxlOiAgICAgICAgIGZhbHNlLFxuICByYXRpb1Zpc2libGU6ICAgICAgIDAuMCxcbiAgdmlzaWJpbGl0eTogICAgICAgICBmYWxzZSxcbiAgcHJldmlvdXNWaXNpYmlsaXR5OiBmYWxzZSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eU1ldGEoZWxlbWVudCwgb2JzZXJ2ZXIpIHtcbiAgbGV0IGVsZW1lbnRPYnNlcnZlcnMgPSBVdGlscy5tZXRhZGF0YShlbGVtZW50LCAnX215dGhpeFVJSW50ZXJzZWN0aW9uT2JzZXJ2ZXJzJyk7XG4gIGlmICghZWxlbWVudE9ic2VydmVycylcbiAgICByZXR1cm4gTk9fT0JTRVJWRVI7XG5cbiAgcmV0dXJuIGVsZW1lbnRPYnNlcnZlcnMuZ2V0KG9ic2VydmVyKSB8fCBOT19PQlNFUlZFUjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbWFwTm9kZVRyZWUobm9kZSwgY2FsbGJhY2ssIF9pbmRleCkge1xuICBpZiAoIW5vZGUpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgbGV0IGluZGV4ID0gMDtcbiAgZm9yIChsZXQgY2hpbGROb2RlIG9mIEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKSkge1xuICAgIGxldCBuZXdOb2RlID0gY2FsbGJhY2socmVtYXBOb2RlVHJlZShjaGlsZE5vZGUsIGNhbGxiYWNrLCBpbmRleCksIGluZGV4KyspO1xuICAgIGlmIChuZXdOb2RlICE9PSBjaGlsZE5vZGUpIHtcbiAgICAgIGlmIChuZXdOb2RlKVxuICAgICAgICBub2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBjaGlsZE5vZGUpO1xuICAgICAgZWxzZVxuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChfaW5kZXggPT0gbnVsbCkgPyBjYWxsYmFjayhub2RlLCAgLTEpIDogbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5QmluZER5bmFtaWNEYXRhKG5vZGUsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG4gIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IChvcHRpb25zLmZvcmNlVGVtcGxhdGVFbmdpbmUgPT09IHRydWUpID8gdW5kZWZpbmVkIDogVXRpbHMuZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKTtcbiAgcmV0dXJuIHJlbWFwTm9kZVRyZWUobm9kZSwgKG5vZGUpID0+IHtcbiAgICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgJiYgbm9kZS5wYXJlbnROb2RlICYmIHR5cGVvZiBub2RlLnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlLnBhcmVudE5vZGUuY2xvc2VzdChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0cikpXG4gICAgICByZXR1cm4gbm9kZTtcblxuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgbGV0IG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgaWYgKG5vZGVWYWx1ZSAmJiBVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUobm9kZVZhbHVlKSlcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKG5vZGUsIG5vZGUucGFyZW50Tm9kZSwgLi4uKG9wdGlvbnMuc2NvcGVzIHx8IFtdKSk7XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KG5vZGUpO1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUgJiYgVXRpbHMuc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gbm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShhdHRyaWJ1dGVOb2RlLCBub2RlLCAuLi4ob3B0aW9ucy5zY29wZXMgfHwgW10pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY29uc3QgVU5GSU5JU0hFRF9ERUZJTklUSU9OID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL3VuZmluaXNoZWQnKTtcblxuY29uc3QgSVNfUFJPUF9OQU1FID0gL15wcm9wXFwkLztcblxuLypcbiovXG5leHBvcnQgY2xhc3MgRWxlbWVudERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd0YWdOYW1lJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRhZ05hbWUsXG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH0sXG4gICAgICAnY2hpbGRyZW4nOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgY2hpbGRyZW4gfHwgW10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpO1xuICB9XG5cbiAgYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpIHtcbiAgICBsZXQgYXR0cmlidXRlcyAgICA9IHRoaXMuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZXNwYWNlVVJJICA9IGF0dHJpYnV0ZXMubmFtZXNwYWNlVVJJO1xuICAgIGxldCBvcHRpb25zO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5pcylcbiAgICAgIG9wdGlvbnMgPSB7IGlzOiB0aGlzLmF0dHJpYnV0ZXMuaXMgfTtcblxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGF0dHJpYnV0ZXMudmFsdWUgfHwgJycpO1xuICAgICAgdGV4dE5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybSh0ZXh0Tm9kZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gdGV4dE5vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZVVSSSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2UgaWYgKGlzU1ZHRWxlbWVudCh0aGlzLnRhZ05hbWUpKVxuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudGFnTmFtZSk7XG5cbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLCBhdHRyaWJ1dGVWYWx1ZSwgY29udGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbW9kaWZpZWRBdHRyaWJ1dGVOYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgaWYgKFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYXR0cmlidXRlXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG5cbiAgICAgICAgICAvLyBHZXQgYXR0cmlidXRlIG5vZGUganVzdCBjcmVhdGVkXG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oYXR0cmlidXRlTm9kZSwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIGhhbmRsZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgaGFuZGxlQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCAgICAgICAgID0gY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBjaGlsZEVsZW1lbnQgID0gY2hpbGQuYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jb25zdCBJU19UQVJHRVRfUFJPUCA9IC9ecHJvdG90eXBlfGNvbnN0cnVjdG9yJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFVdGlscy5pc1R5cGUodGFnTmFtZSwgJ1N0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBsZXQgY2hpbGRyZW4gPSBfY2hpbGRyZW4ubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIHZhbHVlKCk7XG5cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnREZWZpbml0aW9uKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIGlmICghVXRpbHMuaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKHRhZ05hbWUsIHNjb3BlLCBjaGlsZHJlbik7XG4gIH07XG5cbiAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eShmaW5hbGl6ZXIsIHtcbiAgICBnZXQ6ICh0YXJnZXQsIGF0dHJpYnV0ZU5hbWUpID0+IHtcbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgbGV0IHNjb3BlZFByb3h5ID0gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgZGVmYXVsdEF0dHJpYnV0ZXMgfHwge30pKTtcbiAgICAgICAgcmV0dXJuIHNjb3BlZFByb3h5W2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KFxuICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiByb290UHJveHk7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gcm9vdFByb3h5W3Byb3BOYW1lXTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcm9vdFByb3h5O1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5cbmNvbnN0IElTX1NWR19FTEVNRU5UX05BTUUgPSAvXihhbHRnbHlwaHxhbHRnbHlwaGRlZnxhbHRnbHlwaGl0ZW18YW5pbWF0ZXxhbmltYXRlQ29sb3J8YW5pbWF0ZU1vdGlvbnxhbmltYXRlVHJhbnNmb3JtfGFuaW1hdGlvbnxjaXJjbGV8Y2xpcFBhdGh8Y29sb3JQcm9maWxlfGN1cnNvcnxkZWZzfGRlc2N8ZGlzY2FyZHxlbGxpcHNlfGZlYmxlbmR8ZmVjb2xvcm1hdHJpeHxmZWNvbXBvbmVudHRyYW5zZmVyfGZlY29tcG9zaXRlfGZlY29udm9sdmVtYXRyaXh8ZmVkaWZmdXNlbGlnaHRpbmd8ZmVkaXNwbGFjZW1lbnRtYXB8ZmVkaXN0YW50bGlnaHR8ZmVkcm9wc2hhZG93fGZlZmxvb2R8ZmVmdW5jYXxmZWZ1bmNifGZlZnVuY2d8ZmVmdW5jcnxmZWdhdXNzaWFuYmx1cnxmZWltYWdlfGZlbWVyZ2V8ZmVtZXJnZW5vZGV8ZmVtb3JwaG9sb2d5fGZlb2Zmc2V0fGZlcG9pbnRsaWdodHxmZXNwZWN1bGFybGlnaHRpbmd8ZmVzcG90bGlnaHR8ZmV0aWxlfGZldHVyYnVsZW5jZXxmaWx0ZXJ8Zm9udHxmb250RmFjZXxmb250RmFjZUZvcm1hdHxmb250RmFjZU5hbWV8Zm9udEZhY2VTcmN8Zm9udEZhY2VVcml8Zm9yZWlnbk9iamVjdHxnfGdseXBofGdseXBoUmVmfGhhbmRsZXJ8aEtlcm58aW1hZ2V8bGluZXxsaW5lYXJncmFkaWVudHxsaXN0ZW5lcnxtYXJrZXJ8bWFza3xtZXRhZGF0YXxtaXNzaW5nR2x5cGh8bVBhdGh8cGF0aHxwYXR0ZXJufHBvbHlnb258cG9seWxpbmV8cHJlZmV0Y2h8cmFkaWFsZ3JhZGllbnR8cmVjdHxzZXR8c29saWRDb2xvcnxzdG9wfHN2Z3xzd2l0Y2h8c3ltYm9sfHRicmVha3x0ZXh0fHRleHRwYXRofHRyZWZ8dHNwYW58dW5rbm93bnx1c2V8dmlld3x2S2VybikkL2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHRhZ05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgRWxlbWVudEdlbmVyYXRvciA9IG5ldyBQcm94eShcbiAge1xuICAgIFRlcm0sXG4gIH0sXG4gIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHByb3BOYW1lKSkge1xuICAgICAgICAvLyBTVkcgZWxlbWVudHNcbiAgICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lLCB7IG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lKTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBOT09QXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9LFxuKTtcbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIHJlcXVpcmUsXG59IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJztcblxuICBzZXQgYXR0ciRsYW5nKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmhhbmRsZUxhbmdBdHRyaWJ1dGVDaGFuZ2UobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGVybXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykpXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJyk7XG4gIH1cblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgcHVibGlzaENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGkxOG46IChfcGF0aCwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gICAgICAgIGxldCBwYXRoICAgID0gYGdsb2JhbC5pMThuLiR7X3BhdGh9YDtcbiAgICAgICAgbGV0IHJlc3VsdCAgPSBVdGlscy5mZXRjaFBhdGgodGhpcy50ZXJtcywgcGF0aCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgICAgIHJldHVybiBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgcGF0aCwgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKSA/ICcnIDogZGVmYXVsdFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0U291cmNlRm9yTGFuZyhsYW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuJChgc291cmNlW3R5cGVePVwibGFuZy9cIiBpXVtsYW5nXj1cIiR7bGFuZy5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyl9XCJdYClbMF07XG4gIH1cblxuICBoYW5kbGVMYW5nQXR0cmlidXRlQ2hhbmdlKF9sYW5nKSB7XG4gICAgbGV0IGxhbmcgICAgICAgICAgPSBfbGFuZyB8fCAnZW4nO1xuICAgIGxldCBzb3VyY2VFbGVtZW50ID0gdGhpcy5nZXRTb3VyY2VGb3JMYW5nKGxhbmcpO1xuICAgIGlmICghc291cmNlRWxlbWVudCB8fCAhc291cmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IE5vIFwic291cmNlXCIgdGFnIGZvdW5kIGZvciBzcGVjaWZpZWQgbGFuZ3VhZ2UgXCIke2xhbmd9XCJgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRMYW5ndWFnZVRlcm1zKGxhbmcsIHNvdXJjZUVsZW1lbnQpO1xuICB9XG5cbiAgYXN5bmMgbG9hZExhbmd1YWdlVGVybXMobGFuZywgc291cmNlRWxlbWVudCwgX29wdGlvbnMpIHtcbiAgICBsZXQgc3JjID0gc291cmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmICghc3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7IHJlc3BvbnNlIH0gID0gYXdhaXQgcmVxdWlyZS5jYWxsKHRoaXMsIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCwgc3JjKTtcbiAgICAgIGxldCBjb21waWxlZFRlcm1zID0gdGhpcy5jb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCBhd2FpdCByZXNwb25zZS5qc29uKCkpO1xuXG4gICAgICB0aGlzLnRlcm1zID0gY29tcGlsZWRUZXJtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY31gLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpIHtcbiAgICBjb25zdCB3YWxrVGVybXMgPSAodGVybXMsIHJhd0tleVBhdGgpID0+IHtcbiAgICAgIGxldCBrZXlzICAgICAgPSBPYmplY3Qua2V5cyh0ZXJtcyk7XG4gICAgICBsZXQgdGVybXNDb3B5ID0ge307XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQga2V5ICAgICAgICAgPSBrZXlzW2ldO1xuICAgICAgICBsZXQgdmFsdWUgICAgICAgPSB0ZXJtc1trZXldO1xuICAgICAgICBsZXQgbmV3S2V5UGF0aCAgPSByYXdLZXlQYXRoLmNvbmNhdChrZXkpO1xuXG4gICAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gd2Fsa1Rlcm1zKHZhbHVlLCBuZXdLZXlQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgbmV3S2V5UGF0aC5qb2luKCcuJyksIHZhbHVlKTtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICAgIHByb3BlcnR5Ll9zZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXJtc0NvcHk7XG4gICAgfTtcblxuICAgIHJldHVybiB3YWxrVGVybXModGVybXMsIFsgJ2dsb2JhbCcsICdpMThuJyBdKTtcbiAgfVxufVxuXG5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciA9IE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlcjtcbiIsImltcG9ydCAqIGFzIENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgVEVNUExBVEVfVEVNUExBVEUgPSAvXihcXCp8XFx8XFwqfFxcKlxcfCkkLztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJUmVxdWlyZSBleHRlbmRzIENvbXBvbmVudC5NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQge1xuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBjYWNoZWQsXG4gICAgICB9ID0gYXdhaXQgQ29tcG9uZW50LnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXNIYW5kbGVkICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJlUHJvY2VzczogKHsgdGVtcGxhdGUsIGNoaWxkcmVuIH0pID0+IHtcbiAgICAgICAgICAgIGxldCBzdGFyVGVtcGxhdGUgPSBjaGlsZHJlbi5maW5kKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICBsZXQgZGF0YUZvciA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpICYmIFRFTVBMQVRFX1RFTVBMQVRFLnRlc3QoZGF0YUZvcikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIGxldCBkYXRhRm9yID0gc3RhclRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICBsZXQgc3RhckNsb25lID0gc3RhclRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhRm9yID09PSAnKnwnKVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5pbnNlcnRCZWZvcmUoc3RhckNsb25lLCBjaGlsZC5jb250ZW50LmNoaWxkTm9kZXNbMF0gfHwgbnVsbCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5hcHBlbmRDaGlsZChzdGFyQ2xvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJUZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtcmVxdWlyZVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICAvLyBOT09QXG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJUmVxdWlyZTtcblxuaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIE15dGhpeFVJUmVxdWlyZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG4vKlxuTWFueSB0aGFua3MgdG8gU2FnZWUgQ29ud2F5IGZvciB0aGUgZm9sbG93aW5nIENTUyBzcGlubmVyc1xuaHR0cHM6Ly9jb2RlcGVuLmlvL3NhY29ud2F5L3Blbi92WUtZeXJ4XG4qL1xuXG5jb25zdCBTVFlMRV9TSEVFVCA9XG5gXG46aG9zdCB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogMWVtO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG46aG9zdCguc21hbGwpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDAuNzUpO1xufVxuOmhvc3QoLm1lZGl1bSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMS41KTtcbn1cbjpob3N0KC5sYXJnZSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMyk7XG59XG4uc3Bpbm5lci1pdGVtLFxuLnNwaW5uZXItaXRlbTo6YmVmb3JlLFxuLnNwaW5uZXItaXRlbTo6YWZ0ZXIge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNjAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMjUpO1xuICB9XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMik7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3M6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjA3NSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGJvcmRlcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1sZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMS4wKTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgKiAwLjA3NSkgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci1ib3R0b206IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjg3NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMykge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSkgcm90YXRlKDQ1ZGVnKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyLjUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlcjogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEge1xuICAwJSwgOC4zMyUsIDE2LjY2JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNC45OSUsIDMzLjMyJSwgNDEuNjUlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwJSk7XG4gIH1cbiAgNDkuOTglLCA1OC4zMSUsIDY2LjY0JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMTAwJSk7XG4gIH1cbiAgNzQuOTclLCA4My4zMCUsIDkxLjYzJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyB7XG4gIDAlLCA4My4zMCUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCk7XG4gIH1cbiAgOC4zMyUsIDE2LjY2JSwgMjQuOTklIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG4gIH1cbiAgMzMuMzIlLCA0MS42NSUsIDQ5Ljk4JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIC0xMDAlKTtcbiAgfVxuICA1OC4zMSUsIDY2LjY0JSwgNzQuOTclIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gNCk7XG4gIG1pbi13aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg3NSUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03NSUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDQwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24ge1xuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDIpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAyKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSAvIC0yKTtcbn1cbmA7XG5cbmNvbnN0IEtJTkRTID0ge1xuICAnYXVkaW8nOiAgNSxcbiAgJ2NpcmNsZSc6IDMsXG4gICdkb3QnOiAgICAyLFxuICAncGlwZSc6ICAgNSxcbiAgJ3B1enpsZSc6IDMsXG4gICd3YXZlJzogICAzLFxufTtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJU3Bpbm5lciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LXNwaW5uZXInO1xuXG4gIHNldCBhdHRyJGtpbmQoWyBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIGFwcGVuZCB0ZW1wbGF0ZVxuICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICB0aGlzLmJ1aWxkKCh7IFRFTVBMQVRFIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIFRFTVBMQVRFXG4gICAgICAgICAgLmRhdGFNeXRoaXhOYW1lKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSlcbiAgICAgICAgICAucHJvcCRpbm5lckhUTUwoYDxzdHlsZT4ke1NUWUxFX1NIRUVUfTwvc3R5bGU+YCk7XG4gICAgICB9KS5hcHBlbmRUbyhvd25lckRvY3VtZW50LmJvZHkpO1xuXG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBsZXQga2luZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdraW5kJyk7XG4gICAgaWYgKCFraW5kKSB7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2tpbmQnLCBraW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2Uoa2luZCk7XG4gIH1cblxuICBoYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKF9raW5kKSB7XG4gICAgbGV0IGtpbmQgICAgICAgID0gKCcnICsgX2tpbmQpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoS0lORFMsIGtpbmQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXNwaW5uZXJcIiB1bmtub3duIFwia2luZFwiIHByb3ZpZGVkOiBcIiR7a2luZH1cIi4gU3VwcG9ydGVkIFwia2luZFwiIGF0dHJpYnV0ZSB2YWx1ZXMgYXJlOiBcInBpcGVcIiwgXCJhdWRpb1wiLCBcImNpcmNsZVwiLCBcInB1enpsZVwiLCBcIndhdmVcIiwgYW5kIFwiZG90XCIuYCk7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgIH1cblxuICAgIHRoaXMuY2hhbmdlU3Bpbm5lckNoaWxkcmVuKEtJTkRTW2tpbmRdKTtcbiAgfVxuXG4gIGJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgbGV0IGNoaWxkcmVuICAgICAgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGlubmVyLWl0ZW0nKTtcblxuICAgICAgY2hpbGRyZW5baV0gPSBlbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiQoY2hpbGRyZW4pO1xuICB9XG5cbiAgY2hhbmdlU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgdGhpcy4kKCcuc3Bpbm5lci1pdGVtJykucmVtb3ZlKCk7XG4gICAgdGhpcy5idWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBzdHlsZSBhZ2Fpbiwgc29cbiAgICAvLyB0aGF0IGl0IGlzIHRoZSBsYXN0IGNoaWxkLCBhbmRcbiAgICAvLyBkb2Vzbid0IG1lc3Mgd2l0aCBcIm50aC1jaGlsZFwiXG4gICAgLy8gc2VsZWN0b3JzXG4gICAgdGhpcy4kKCdzdHlsZScpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcbiAgfVxufVxuXG5NeXRoaXhVSVNwaW5uZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJU3Bpbm5lcjtcbiIsImltcG9ydCAqIGFzIFV0aWxzICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHtcbiAgRWxlbWVudERlZmluaXRpb24sXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmNvbnN0IElTX0lOVEVHRVIgPSAvXlxcZCskLztcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFdlIGhhdmUgYW4gRWxlbWVudCBvciBhIERvY3VtZW50XG4gIGlmICh2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gaXNOb3RTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAhZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDbGFzc05hbWVzKC4uLmFyZ3MpIHtcbiAgbGV0IGNsYXNzTmFtZXMgPSBbXS5jb25jYXQoLi4uYXJncylcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLm1hcCgocGFydCkgPT4gKCcnICsgcGFydCkuc3BsaXQoL1xccysvKSlcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gY2xhc3NOYW1lcztcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIGlzRWxlbWVudCAgICA9IGlzRWxlbWVudDtcbiAgc3RhdGljIGlzU2xvdHRlZCAgICA9IGlzU2xvdHRlZDtcbiAgc3RhdGljIGlzTm90U2xvdHRlZCA9IGlzTm90U2xvdHRlZDtcblxuICBzdGF0aWMgZnJvbSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKFtdLCB7IHJvb3Q6IChpc0VsZW1lbnQodGhpcykpID8gdGhpcyA6IGRvY3VtZW50LCBjb250ZXh0OiB0aGlzIH0pO1xuXG4gICAgY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGxldCBiYXNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oYmFzZSwgYXJnc1thcmdJbmRleCsrXSk7XG5cbiAgICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBhcmdzW2FyZ0luZGV4XS5nZXRPcHRpb25zKCkgfHwge30sIGJhc2UpO1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0Um9vdEVsZW1lbnQgPSAob3B0aW9uc1Jvb3QpID0+IHtcbiAgICAgIGlmIChpc0VsZW1lbnQob3B0aW9uc1Jvb3QpKVxuICAgICAgICByZXR1cm4gb3B0aW9uc1Jvb3Q7XG5cbiAgICAgIGlmIChpc0VsZW1lbnQodGhpcykpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICByZXR1cm4gKCh0aGlzICYmIHRoaXMub3duZXJEb2N1bWVudCkgfHwgZG9jdW1lbnQpO1xuICAgIH07XG5cbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gZ2V0T3B0aW9ucygpO1xuICAgIGxldCByb290ICAgICAgPSBnZXRSb290RWxlbWVudChvcHRpb25zLnJvb3QpO1xuICAgIGxldCBxdWVyeUVuZ2luZTtcblxuICAgIG9wdGlvbnMucm9vdCA9IHJvb3Q7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IHRoaXM7XG5cbiAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0uc2xpY2UoKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzW2FyZ0luZGV4XSkpIHtcbiAgICAgIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleCArIDFdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbMV07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ1N0cmluZycpKSB7XG4gICAgICBvcHRpb25zLnNlbGVjdG9yID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ0Z1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyb290LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3RvciksIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSkge1xuICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwgb3B0aW9ucyk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbnZva2VDYWxsYmFja3MgIT09IGZhbHNlICYmIHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfTtcblxuICBnZXRFbmdpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gUXVlcnlFbmdpbmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSU9wdGlvbnMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnX215dGhpeFVJRWxlbWVudHMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5maWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhvcHRpb25zLmNvbnRleHQsIGVsZW1lbnRzKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wTmFtZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdsZW5ndGgnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5wcm90b3R5cGU7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gSW5kZXggbG9va3VwXG4gICAgICAgIGlmIChJU19JTlRFR0VSLnRlc3QocHJvcE5hbWUpKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG5cbiAgICAgICAgLy8gUmVkaXJlY3QgYW55IGFycmF5IG1ldGhvZHM6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFwibWFnaWNQcm9wTmFtZVwiIGlzIHdoZW4gdGhlXG4gICAgICAgIC8vIGZ1bmN0aW9uIG5hbWUgYmVnaW5zIHdpdGggXCIkXCIsXG4gICAgICAgIC8vIGkuZS4gXCIkZmlsdGVyXCIsIG9yIFwiJG1hcFwiLiBJZlxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlLCB0aGVuIHRoZSByZXR1cm5cbiAgICAgICAgLy8gdmFsdWUgd2lsbCBhbHdheXMgYmUgY29lcmNlZCBpbnRvXG4gICAgICAgIC8vIGEgUXVlcnlFbmdpbmUuIE90aGVyd2lzZSwgaXQgd2lsbFxuICAgICAgICAvLyBvbmx5IGJlIGNvZXJjZWQgaW50byBhIFF1ZXJ5RW5naW5lXG4gICAgICAgIC8vIGlmIEVWRVJZIGVsZW1lbnQgaW4gdGhlIHJlc3VsdCBpc1xuICAgICAgICAvLyBhbiBcImVsZW1lbnR5XCIgdHlwZSB2YWx1ZS5cbiAgICAgICAgbGV0IG1hZ2ljUHJvcE5hbWUgPSAocHJvcE5hbWUuY2hhckF0KDApID09PSAnJCcpID8gcHJvcE5hbWUuc3Vic3RyaW5nKDEpIDogcHJvcE5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlW21hZ2ljUHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgICA9IHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cztcbiAgICAgICAgICAgIGxldCByZXN1bHQgID0gYXJyYXlbbWFnaWNQcm9wTmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkgJiYgKG1hZ2ljUHJvcE5hbWUgIT09IHByb3BOYW1lIHx8IHJlc3VsdC5ldmVyeSgoaXRlbSkgPT4gVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uLCBOb2RlLCBRdWVyeUVuZ2luZSkpKSkge1xuICAgICAgICAgICAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRhcmdldC5nZXRFbmdpbmVDbGFzcygpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHJlc3VsdCwgdGFyZ2V0LmdldE9wdGlvbnMoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByb290UHJveHk7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSU9wdGlvbnM7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5yb290IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZ2V0VW5kZXJseWluZ0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuICB9XG5cbiAgZ2V0T3duZXJEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSb290KCkub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKGNvbnRleHQsIGVsZW1lbnRzKSB7XG4gICAgbGV0IGZpbmFsRWxlbWVudHMgPSBBcnJheS5mcm9tKGVsZW1lbnRzKS5mbGF0KEluZmluaXR5KS5tYXAoKF9pdGVtKSA9PiB7XG4gICAgICBpZiAoIV9pdGVtKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBpdGVtID0gX2l0ZW07XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICByZXR1cm4gaXRlbS5nZXRVbmRlcmx5aW5nQXJyYXkoKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCBOb2RlKSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgIGlmIChpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIGl0ZW0gPSBpdGVtKCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgJ1N0cmluZycpKVxuICAgICAgICBpdGVtID0gRWxlbWVudHMuVGVybShpdGVtKTtcbiAgICAgIGVsc2UgaWYgKCFVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24pKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmICghY29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJjb250ZXh0XCIgb3B0aW9uIGZvciBRdWVyeUVuZ2luZSBpcyByZXF1aXJlZCB3aGVuIGNvbnN0cnVjdGluZyBlbGVtZW50cy4nKTtcblxuICAgICAgcmV0dXJuIGl0ZW0uYnVpbGQodGhpcy5nZXRPd25lckRvY3VtZW50KCksIGNvbnRleHQpO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgJCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgdGhpcy5nZXRPcHRpb25zKCksIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy4kKFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1swXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkpKTtcbiAgfVxuXG4gIGxhc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIVV0aWxzLmlzVHlwZShjb3VudCwgJ051bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuJChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkgKiAtMSkpO1xuICB9XG5cbiAgYWRkKC4uLmVsZW1lbnRzKSB7XG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLnNsaWNlKCkuY29uY2F0KC4uLmVsZW1lbnRzKSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgc3VidHJhY3QoLi4uZWxlbWVudHMpIHtcbiAgICBsZXQgc2V0ID0gbmV3IFNldChlbGVtZW50cyk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gIXNldC5oYXMoaXRlbSk7XG4gICAgfSksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYXBwZW5kVG8oc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgfVxuXG4gIGluc2VydEludG8oc2VsZWN0b3JPckVsZW1lbnQsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5nZXRPd25lckRvY3VtZW50KCk7XG4gICAgbGV0IHNvdXJjZSAgICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cbiAgICAgIHNvdXJjZSA9IFsgZnJhZ21lbnQgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50Lmluc2VydChzb3VyY2VbMF0sIHJlZmVyZW5jZU5vZGUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXBsYWNlQ2hpbGRyZW5PZihzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBlbmRUbyhlbGVtZW50KTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xhc3NMaXN0KG9wZXJhdGlvbiwgLi4uYXJncykge1xuICAgIGxldCBjbGFzc05hbWVzID0gY29sbGVjdENsYXNzTmFtZXMoYXJncyk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAndG9nZ2xlJylcbiAgICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4gbm9kZS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZS5jbGFzc0xpc3Rbb3BlcmF0aW9uXSguLi5jbGFzc05hbWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ2FkZCcsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgncmVtb3ZlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICB0b2dnbGVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCd0b2dnbGUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHNsb3R0ZWQoeWVzTm8pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgeWVzTm8pID8gaXNTbG90dGVkIDogaXNOb3RTbG90dGVkKTtcbiAgfVxuXG4gIHNsb3Qoc2xvdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuc2xvdCA9PT0gc2xvdE5hbWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAoZWxlbWVudC5jbG9zZXN0KGBzbG90W25hbWU9XCIke3Nsb3ROYW1lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuUXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFNIQTI1NihfaW5wdXQpIHtcbiAgbGV0IGlucHV0ID0gX2lucHV0O1xuXG4gIGxldCBtYXRoUG93ID0gTWF0aC5wb3c7XG4gIGxldCBtYXhXb3JkID0gbWF0aFBvdygyLCAzMik7XG4gIGxldCBsZW5ndGhQcm9wZXJ0eSA9ICdsZW5ndGgnO1xuICBsZXQgaTsgbGV0IGo7IC8vIFVzZWQgYXMgYSBjb3VudGVyIGFjcm9zcyB0aGUgd2hvbGUgZmlsZVxuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgbGV0IHdvcmRzID0gW107XG4gIGxldCBhc2NpaUJpdExlbmd0aCA9IGlucHV0W2xlbmd0aFByb3BlcnR5XSAqIDg7XG5cbiAgLy8qIGNhY2hpbmcgcmVzdWx0cyBpcyBvcHRpb25hbCAtIHJlbW92ZS9hZGQgc2xhc2ggZnJvbSBmcm9udCBvZiB0aGlzIGxpbmUgdG8gdG9nZ2xlXG4gIC8vIEluaXRpYWwgaGFzaCB2YWx1ZTogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lc1xuICAvLyAod2UgYWN0dWFsbHkgY2FsY3VsYXRlIHRoZSBmaXJzdCA2NCwgYnV0IGV4dHJhIHZhbHVlcyBhcmUganVzdCBpZ25vcmVkKVxuICBsZXQgaGFzaCA9IFNIQTI1Ni5oID0gU0hBMjU2LmggfHwgW107XG4gIC8vIFJvdW5kIGNvbnN0YW50czogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgY3ViZSByb290cyBvZiB0aGUgZmlyc3QgNjQgcHJpbWVzXG4gIGxldCBrID0gU0hBMjU2LmsgPSBTSEEyNTYuayB8fCBbXTtcbiAgbGV0IHByaW1lQ291bnRlciA9IGtbbGVuZ3RoUHJvcGVydHldO1xuICAvKi9cbiAgICBsZXQgaGFzaCA9IFtdLCBrID0gW107XG4gICAgbGV0IHByaW1lQ291bnRlciA9IDA7XG4gICAgLy8qL1xuXG4gIGxldCBpc0NvbXBvc2l0ZSA9IHt9O1xuICBmb3IgKGxldCBjYW5kaWRhdGUgPSAyOyBwcmltZUNvdW50ZXIgPCA2NDsgY2FuZGlkYXRlKyspIHtcbiAgICBpZiAoIWlzQ29tcG9zaXRlW2NhbmRpZGF0ZV0pIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAzMTM7IGkgKz0gY2FuZGlkYXRlKVxuICAgICAgICBpc0NvbXBvc2l0ZVtpXSA9IGNhbmRpZGF0ZTtcblxuICAgICAgaGFzaFtwcmltZUNvdW50ZXJdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAwLjUpICogbWF4V29yZCkgfCAwO1xuICAgICAga1twcmltZUNvdW50ZXIrK10gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDEgLyAzKSAqIG1heFdvcmQpIHwgMDtcbiAgICB9XG4gIH1cblxuICBpbnB1dCArPSAnXFx4ODAnOyAvLyBBcHBlbmQgxocnIGJpdCAocGx1cyB6ZXJvIHBhZGRpbmcpXG4gIHdoaWxlIChpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gJSA2NCAtIDU2KVxuICAgIGlucHV0ICs9ICdcXHgwMCc7IC8vIE1vcmUgemVybyBwYWRkaW5nXG5cbiAgZm9yIChpID0gMDsgaSA8IGlucHV0W2xlbmd0aFByb3BlcnR5XTsgaSsrKSB7XG4gICAgaiA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGogPj4gOClcbiAgICAgIHJldHVybjsgLy8gQVNDSUkgY2hlY2s6IG9ubHkgYWNjZXB0IGNoYXJhY3RlcnMgaW4gcmFuZ2UgMC0yNTVcbiAgICB3b3Jkc1tpID4+IDJdIHw9IGogPDwgKCgzIC0gaSkgJSA0KSAqIDg7XG4gIH1cblxuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKChhc2NpaUJpdExlbmd0aCAvIG1heFdvcmQpIHwgMCk7XG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoYXNjaWlCaXRMZW5ndGgpO1xuXG4gIC8vIHByb2Nlc3MgZWFjaCBjaHVua1xuICBmb3IgKGogPSAwOyBqIDwgd29yZHNbbGVuZ3RoUHJvcGVydHldOykge1xuICAgIGxldCB3ID0gd29yZHMuc2xpY2UoaiwgaiArPSAxNik7IC8vIFRoZSBtZXNzYWdlIGlzIGV4cGFuZGVkIGludG8gNjQgd29yZHMgYXMgcGFydCBvZiB0aGUgaXRlcmF0aW9uXG4gICAgbGV0IG9sZEhhc2ggPSBoYXNoO1xuXG4gICAgLy8gVGhpcyBpcyBub3cgdGhlIHVuZGVmaW5lZHdvcmtpbmcgaGFzaFwiLCBvZnRlbiBsYWJlbGxlZCBhcyB2YXJpYWJsZXMgYS4uLmdcbiAgICAvLyAod2UgaGF2ZSB0byB0cnVuY2F0ZSBhcyB3ZWxsLCBvdGhlcndpc2UgZXh0cmEgZW50cmllcyBhdCB0aGUgZW5kIGFjY3VtdWxhdGVcbiAgICBoYXNoID0gaGFzaC5zbGljZSgwLCA4KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2UgaW50byA2NCB3b3Jkc1xuICAgICAgLy8gVXNlZCBiZWxvdyBpZlxuICAgICAgbGV0IHcxNSA9IHdbaSAtIDE1XTsgbGV0IHcyID0gd1tpIC0gMl07XG5cbiAgICAgIC8vIEl0ZXJhdGVcbiAgICAgIGxldCBhID0gaGFzaFswXTsgbGV0IGUgPSBoYXNoWzRdO1xuICAgICAgbGV0IHRlbXAxID0gaGFzaFs3XVxuICAgICAgICAgICAgICAgICsgKCgoZSA+Pj4gNikgfCAoZSA8PCAyNikpIF4gKChlID4+PiAxMSkgfCAoZSA8PCAyMSkpIF4gKChlID4+PiAyNSkgfCAoZSA8PCA3KSkpIC8vIFMxXG4gICAgICAgICAgICAgICAgKyAoKGUgJiBoYXNoWzVdKSBeICgofmUpICYgaGFzaFs2XSkpIC8vIGNoXG4gICAgICAgICAgICAgICAgKyBrW2ldXG4gICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICsgKHdbaV0gPSAoaSA8IDE2KSA/IHdbaV0gOiAoXG4gICAgICAgICAgICAgICAgICB3W2kgLSAxNl1cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzE1ID4+PiA3KSB8ICh3MTUgPDwgMjUpKSBeICgodzE1ID4+PiAxOCkgfCAodzE1IDw8IDE0KSkgXiAodzE1ID4+PiAzKSkgLy8gczBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgd1tpIC0gN11cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzIgPj4+IDE3KSB8ICh3MiA8PCAxNSkpIF4gKCh3MiA+Pj4gMTkpIHwgKHcyIDw8IDEzKSkgXiAodzIgPj4+IDEwKSkgLy8gczFcbiAgICAgICAgICAgICAgICApIHwgMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAvLyBUaGlzIGlzIG9ubHkgdXNlZCBvbmNlLCBzbyAqY291bGQqIGJlIG1vdmVkIGJlbG93LCBidXQgaXQgb25seSBzYXZlcyA0IGJ5dGVzIGFuZCBtYWtlcyB0aGluZ3MgdW5yZWFkYmxlXG4gICAgICBsZXQgdGVtcDIgPSAoKChhID4+PiAyKSB8IChhIDw8IDMwKSkgXiAoKGEgPj4+IDEzKSB8IChhIDw8IDE5KSkgXiAoKGEgPj4+IDIyKSB8IChhIDw8IDEwKSkpIC8vIFMwXG4gICAgICAgICAgICAgICAgKyAoKGEgJiBoYXNoWzFdKSBeIChhICYgaGFzaFsyXSkgXiAoaGFzaFsxXSAmIGhhc2hbMl0pKTsgLy8gbWFqXG5cbiAgICAgIGhhc2ggPSBbKHRlbXAxICsgdGVtcDIpIHwgMF0uY29uY2F0KGhhc2gpOyAvLyBXZSBkb24ndCBib3RoZXIgdHJpbW1pbmcgb2ZmIHRoZSBleHRyYSBvbmVzLCB0aGV5J3JlIGhhcm1sZXNzIGFzIGxvbmcgYXMgd2UncmUgdHJ1bmNhdGluZyB3aGVuIHdlIGRvIHRoZSBzbGljZSgpXG4gICAgICBoYXNoWzRdID0gKGhhc2hbNF0gKyB0ZW1wMSkgfCAwO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICBoYXNoW2ldID0gKGhhc2hbaV0gKyBvbGRIYXNoW2ldKSB8IDA7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgZm9yIChqID0gMzsgaiArIDE7IGotLSkge1xuICAgICAgbGV0IGIgPSAoaGFzaFtpXSA+PiAoaiAqIDgpKSAmIDI1NTtcbiAgICAgIHJlc3VsdCArPSAoKGIgPCAxNikgPyAwIDogJycpICsgYi50b1N0cmluZygxNik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFNIQTI1NiB9IGZyb20gJy4vc2hhMjU2LmpzJztcblxuZXhwb3J0IHtcbiAgU0hBMjU2LFxufTtcblxuZnVuY3Rpb24gcGFkKHN0ciwgY291bnQsIGNoYXIgPSAnMCcpIHtcbiAgcmV0dXJuIHN0ci5wYWRTdGFydChjb3VudCwgY2hhcik7XG59XG5cbmV4cG9ydCBjb25zdCBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUiA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9uYW1lLXZhbHVlLXBhaXItaGVscGVyJyk7XG5leHBvcnQgY29uc3QgTVlUSElYX1NIQURPV19QQVJFTlQgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvc2hhZG93LXBhcmVudCcpO1xuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5sZXQgaWRDb3VudGVyID0gMG47XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcbiAgaWRDb3VudGVyICs9IEJpZ0ludCgxKTtcbiAgcmV0dXJuIGAke0RhdGUubm93KCl9JHtwYWQoaWRDb3VudGVyLnRvU3RyaW5nKCksIElEX0NPVU5UX0xFTkdUSCl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc29sdmFibGUoKSB7XG4gIGxldCBzdGF0dXMgPSAncGVuZGluZyc7XG4gIGxldCByZXNvbHZlO1xuICBsZXQgcmVqZWN0O1xuXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdmdWxmaWxsZWQnO1xuICAgICAgICBfcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICByZWplY3QgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAncmVqZWN0ZWQnO1xuICAgICAgICBfcmVqZWN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvbWlzZSwge1xuICAgICdyZXNvbHZlJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZXNvbHZlLFxuICAgIH0sXG4gICAgJ3JlamVjdCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVqZWN0LFxuICAgIH0sXG4gICAgJ3N0YXR1cyc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKCkgPT4gc3RhdHVzLFxuICAgIH0sXG4gICAgJ2lkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICBnZW5lcmF0ZUlEKCksXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBsZXQgdGhpc1R5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0aGlzVHlwZSA9PT0gJ2JpZ2ludCcpXG4gICAgcmV0dXJuICdCaWdJbnQnO1xuXG4gIGlmICh0aGlzVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodGhpc1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodmFsdWUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7bmF0aXZlVHlwZU1ldGFbMF19XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBJU19DTEFTUy50ZXN0KCcnICsgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yKSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHt2YWx1ZS5uYW1lfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcbiAgICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgICByZXR1cm4gYFtDbGFzcyAke3Jlc3VsdH1dYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYCR7dGhpc1R5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt0aGlzVHlwZS5zdWJzdHJpbmcoMSl9YDtcbiAgfVxuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICByZXR1cm4gJ1N0cmluZyc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKVxuICAgIHJldHVybiAnQm9vbGVhbic7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgIHJldHVybiAnT2JqZWN0JztcblxuICBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcblxuICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fCAnT2JqZWN0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGlmICh0eXBlcy5pbmRleE9mKHZhbHVlVHlwZSkgPj0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gdHlwZXMuc29tZSgodHlwZSkgPT4gKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nICYmIHZhbHVlIGluc3RhbmNlb2YgdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE51bWJlcih2YWx1ZSkge1xuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJ051bWJlcicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgJ051bWJlcicsICdCb29sZWFuJywgJ0JpZ0ludCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xsZWN0YWJsZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKEluZmluaXR5KSB8fCBPYmplY3QuaXMoLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50JykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykgJiYgKC9eW1xcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnTnVtYmVyJykpXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDApO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIU5PRSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL15cXFcvLCAnJylcbiAgICAucmVwbGFjZSgvW1xcV10rJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oW0EtWl0rKS9nLCAnLSQxJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXFcrKC4pL2csIChtLCBwKSA9PiB7XG4gICAgICByZXR1cm4gcC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL14oLikoLiopJC8sIChtLCBmLCBsKSA9PiBgJHtmLnRvTG93ZXJDYXNlKCl9JHtsfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXSsvZywgKG0sIG9mZnNldCkgPT4gKChvZmZzZXQpID8gYC0ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKSlcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRNZXRob2RzKF9wcm90bywgc2tpcFByb3Rvcykge1xuICBsZXQgcHJvdG8gICAgICAgICAgID0gX3Byb3RvO1xuICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChwcm90bykge1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKTtcbiAgICBsZXQga2V5cyAgICAgICAgPSBPYmplY3Qua2V5cyhkZXNjcmlwdG9ycykuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZGVzY3JpcHRvcnMpKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InIHx8IGtleSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKGtleSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQoa2V5KTtcblxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yc1trZXldO1xuXG4gICAgICAvLyBDYW4gaXQgYmUgY2hhbmdlZD9cbiAgICAgIGlmIChkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJZiBpcyBnZXR0ZXIsIHRoZW4gc2tpcFxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnZ2V0JykgfHwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdzZXQnKSkge1xuICAgICAgICBsZXQgbmV3RGVzY3JpcHRvciA9IHsgLi4uZGVzY3JpcHRvciB9O1xuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5nZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5nZXQgPSBuZXdEZXNjcmlwdG9yLmdldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLnNldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLnNldCA9IG5ld0Rlc2NyaXB0b3Iuc2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgbmV3RGVzY3JpcHRvcik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXG4gICAgICAvLyBTa2lwIHByb3RvdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KGtleSkgJiYgT2JqZWN0LnByb3RvdHlwZVtrZXldID09PSB2YWx1ZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7IC4uLmRlc2NyaXB0b3IsIHZhbHVlOiB2YWx1ZS5iaW5kKHRoaXMpIH0pO1xuICAgIH1cblxuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICBicmVhaztcblxuICAgIGlmIChza2lwUHJvdG9zICYmIHNraXBQcm90b3MuaW5kZXhPZihwcm90bykgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmNvbnN0IE1FVEFEQVRBX1dFQUtNQVAgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gbWV0YWRhdGEodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gIGxldCBkYXRhID0gTUVUQURBVEFfV0VBS01BUC5nZXQodGFyZ2V0KTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgcmV0dXJuIGRhdGE7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpXG4gICAgcmV0dXJuIChkYXRhKSA/IGRhdGEuZ2V0KGtleSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgaWYgKCFpc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBzZXQgbWV0YWRhdGEgb24gcHJvdmlkZWQgb2JqZWN0OiAkeyh0eXBlb2YgdGFyZ2V0ID09PSAnc3ltYm9sJykgPyB0YXJnZXQudG9TdHJpbmcoKSA6IHRhcmdldH1gKTtcblxuICAgIGRhdGEgPSBuZXcgTWFwKCk7XG4gICAgTUVUQURBVEFfV0VBS01BUC5zZXQodGFyZ2V0LCBkYXRhKTtcbiAgfVxuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuY29uc3QgT0JKX0lEX1dFQUtNQVAgPSBuZXcgV2Vha01hcCgpO1xubGV0IGlkQ291bnQgPSAxbjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9iaklEKG9iaikge1xuICBsZXQgaWQgPSBPQkpfSURfV0VBS01BUC5nZXQob2JqKTtcbiAgaWYgKGlkID09IG51bGwpIHtcbiAgICBsZXQgdGhpc0lEID0gYCR7aWRDb3VudCsrfWA7XG4gICAgT0JKX0lEX1dFQUtNQVAuc2V0KG9iaiwgdGhpc0lEKTtcblxuICAgIHJldHVybiB0aGlzSUQ7XG4gIH1cblxuICByZXR1cm4gaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KSkudGhlbigoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUEVSVFlfR0NfVElNRSA9IDEwMDAwO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9WQUxVRSAgICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvdmFsdWUnKTtcbmNvbnN0IERZTkFNSUNfUFJPUEVSVFlfUkVHSVNURVJFRF9OT0RFUyA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL3JlZ2lzdGVyZWQtbm9kZXMnKTtcbmNvbnN0IERZTkFNSUNfUFJPUEVSVFlfQ01UICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL2NsZWFuLW1lbW9yeS10aW1lcicpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvaXMtc2V0dGluZycpO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3BlcnR5IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGRlZmF1bHRWYWx1ZSxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9SRUdJU1RFUkVEX05PREVTXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBbXSxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9DTVRdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG51bGwsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR106IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0KSA6IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSkgOiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJylcbiAgICAgIHJldHVybiArdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICBlbHNlIGlmIChoaW50ID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICB2YWx1ZU9mKCkge1xuICAgIHJldHVybiB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICB9XG5cbiAgX2ZyZWVEZWFkUmVmZXJlbmNlcygpIHtcbiAgICAvLyBjbGVhciBkZWFkIG5vZGVzXG4gICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1JFR0lTVEVSRURfTk9ERVNdID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1JFR0lTVEVSRURfTk9ERVNdLmZpbHRlcigoZW50cnkpID0+ICEhZW50cnkucmVmLmRlcmVmKCkpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9DTVRdKTtcbiAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfQ01UXSA9IG51bGw7XG5cbiAgICBpZiAodGhpc1tEWU5BTUlDX1BST1BFUlRZX1JFR0lTVEVSRURfTk9ERVNdLmxlbmd0aCkge1xuICAgICAgbGV0IHJhbmRvbW5lc3MgPSAoTWF0aC5yYW5kb20oKSAqIERZTkFNSUNfUFJPUEVSVFlfR0NfVElNRSk7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfQ01UXSA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fZnJlZURlYWRSZWZlcmVuY2VzKCksIE1hdGgucm91bmQoRFlOQU1JQ19QUk9QRVJUWV9HQ19USU1FICsgcmFuZG9tbmVzcykpO1xuICAgIH1cbiAgfVxuXG4gIF9zZXQoX25ld1ZhbHVlKSB7XG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBuZXdWYWx1ZSA9IF9uZXdWYWx1ZTtcbiAgICBpZiAoaXNUeXBlKG5ld1ZhbHVlLCBEeW5hbWljUHJvcGVydHksICdEeW5hbWljUHJvcGVydHknKSlcbiAgICAgIG5ld1ZhbHVlID0gbmV3VmFsdWUudmFsdWVPZigpO1xuXG4gICAgaWYgKHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IHRydWU7XG5cbiAgICAgIGxldCBvbGRWYWx1ZSAgICA9IHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgICBsZXQgdXBkYXRlRXZlbnQgPSBuZXcgRXZlbnQoJ3VwZGF0ZScpO1xuXG4gICAgICB1cGRhdGVFdmVudC5vcmlnaW5hdG9yID0gdGhpcztcbiAgICAgIHVwZGF0ZUV2ZW50Lm9sZFZhbHVlID0gb2xkVmFsdWU7XG4gICAgICB1cGRhdGVFdmVudC52YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodXBkYXRlRXZlbnQpO1xuICAgICAgaWYgKHVwZGF0ZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9IG5ld1ZhbHVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbmV4dFRpY2soKCkgPT4gdGhpcy5fdHJpZ2dlclVwZGF0ZXMoKSk7XG4gIH1cblxuICBfdHJpZ2dlclVwZGF0ZXMoKSB7XG4gICAgZm9yIChsZXQgeyByZWYsIGNhbGxiYWNrIH0gb2YgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1JFR0lTVEVSRURfTk9ERVNdKSB7XG4gICAgICBsZXQgbm9kZSA9IHJlZi5kZXJlZigpO1xuICAgICAgaWYgKCFub2RlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IG5ld1ZhbHVlID0gY2FsbGJhY2sobm9kZSwgdGhpcyk7XG4gICAgICBub2RlLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIF9yZWdpc3RlckZvclVwZGF0ZShub2RlLCBjYWxsYmFjaykge1xuICAgIGxldCBleGlzdHMgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfUkVHSVNURVJFRF9OT0RFU10uZmluZCgoZW50cnkpID0+IChlbnRyeS5yZWYuZGVyZWYoKSA9PT0gbm9kZSkpO1xuICAgIGlmIChleGlzdHMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgcmVmID0gbmV3IFdlYWtSZWYobm9kZSk7XG4gICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1JFR0lTVEVSRURfTk9ERVNdLnB1c2goeyByZWYsIGNhbGxiYWNrIH0pO1xuXG4gICAgdGhpcy5fZnJlZURlYWRSZWZlcmVuY2VzKCk7XG4gIH1cbn1cblxuY29uc3QgVkFMSURfSlNfSURFTlRJRklFUiA9IC9eW2EtekEtWl8kXVthLXpBLVowLTlfJF0qJC87XG5cbmZ1bmN0aW9uIGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0LCAuLi5leHRyYUNvbnRleHRzKSB7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBBcnJheS5mcm9tKFxuICAgIG5ldyBTZXQoZ2V0QWxsUHJvcGVydHlOYW1lcyhjb250ZXh0KS5jb25jYXQoXG4gICAgICBPYmplY3Qua2V5cyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KSxcbiAgICAgIFsgJ2F0dHJpYnV0ZXMnLCAnY2xhc3NMaXN0JywgJyQkJywgJ2kxOG4nIF0sXG4gICAgICAuLi5leHRyYUNvbnRleHRzLm1hcCgoZXh0cmFDb250ZXh0KSA9PiBPYmplY3Qua2V5cyhleHRyYUNvbnRleHQgfHwge30pKSxcbiAgICApKSxcbiAgKS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSk7XG5cbiAgcmV0dXJuIGB7JHtjb250ZXh0Q2FsbEFyZ3Muam9pbignLCcpfX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJveHlDb250ZXh0KC4uLl90YXJnZXRzKSB7XG4gIGNvbnN0IGZpbmRQcm9wTmFtZVNjb3BlID0gKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgT2JqZWN0LmlzKHRhcmdldCwgTmFOKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuXG4gICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCBnZXRQYXJlbnROb2RlID0gKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghZWxlbWVudClcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIGlmICghZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmV0Y2hQdWJsaXNoQ29udGV4dCA9IChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgaWYgKCFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgY29tcG9uZW50UHVibGlzaENvbnRleHQ7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiBjdXJyZW50RWxlbWVudClcbiAgICAgICAgICByZXR1cm4gY3VycmVudEVsZW1lbnQ7XG5cbiAgICAgICAgY29tcG9uZW50UHVibGlzaENvbnRleHQgPSBjdXJyZW50RWxlbWVudC5wdWJsaXNoQ29udGV4dDtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnRQdWJsaXNoQ29udGV4dCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQpO1xuXG4gICAgICBpZiAoIWNvbXBvbmVudFB1Ymxpc2hDb250ZXh0IHx8ICFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgcHVibGlzaGVkQ29udGV4dCA9IGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0LmNhbGwoY3VycmVudEVsZW1lbnQpO1xuICAgICAgaWYgKCFwdWJsaXNoZWRDb250ZXh0IHx8ICEocHJvcE5hbWUgaW4gcHVibGlzaGVkQ29udGV4dCkpXG4gICAgICAgIHJldHVybiBmZXRjaFB1Ymxpc2hDb250ZXh0KGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpKTtcblxuICAgICAgcmV0dXJuIHB1Ymxpc2hlZENvbnRleHQ7XG4gICAgfTtcblxuICAgIHJldHVybiBmZXRjaFB1Ymxpc2hDb250ZXh0KHRhcmdldCk7XG4gIH07XG5cbiAgbGV0IHRhcmdldHMgICAgICAgICA9IF90YXJnZXRzLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZpcnN0RWxlbWVudCAgICA9IHRhcmdldHMuZmluZCgodGFyZ2V0KSA9PiAodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHx8IHRhcmdldHNbMF07XG4gIGxldCBiYXNlQ29udGV4dCAgICAgPSB7fTtcbiAgbGV0IGZhbGxiYWNrQ29udGV4dCA9IHtcbiAgICBpMThuOiAoKHBhdGgsIGQpID0+IGdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbChzcGVjaWFsQ2xvc2VzdChmaXJzdEVsZW1lbnQsICdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKSB8fCBmaXJzdEVsZW1lbnQsIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFN0b3JlLmkxOG4uJHtwYXRofWAsIGQpKSxcbiAgICBkeW5hbWljUHJvcElELFxuICB9O1xuXG4gIHRhcmdldHMgPSB0YXJnZXRzLmNvbmNhdChmYWxsYmFja0NvbnRleHQpO1xuICBsZXQgcHJveHkgICA9IG5ldyBQcm94eShiYXNlQ29udGV4dCwge1xuICAgIG93bktleXM6ICgpID0+IHtcbiAgICAgIGxldCBhbGxLZXlzID0gW107XG5cbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoZ2V0QWxsUHJvcGVydHlOYW1lcyh0YXJnZXQpKTtcblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoZ2xvYmFsU2NvcGUpXG4gICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChPYmplY3Qua2V5cyhnbG9iYWxTY29wZSkpO1xuXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFsbEtleXMpKTtcbiAgICB9LFxuICAgIGdldDogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gc2NvcGVbcHJvcE5hbWVdO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIGdsb2JhbFNjb3BlW3Byb3BOYW1lXTtcbiAgICB9LFxuICAgIHNldDogKF8sIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgZG9TZXQgPSAoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoaXNUeXBlKHNjb3BlW3Byb3BOYW1lXSwgRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdLl9zZXQodmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gZG9TZXQoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gZG9TZXQoZ2xvYmFsU2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgZmFsbGJhY2tDb250ZXh0LiQkID0gcHJveHk7XG5cbiAgcmV0dXJuIHByb3h5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRHluYW1pY1Byb3BlcnR5RmV0Y2hlcih7IHByZWZpeCwgYm9keSwgc2NvcGVzIH0pIHtcbiAgbGV0IGNvbnRleHQgICAgICAgICA9IGNyZWF0ZVByb3h5Q29udGV4dCguLi4oc2NvcGVzIHx8IFtdKSk7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBnZXRDb250ZXh0Q2FsbEFyZ3MoY29udGV4dCk7XG4gIGxldCBmdW5jdGlvbkJvZHkgICAgPSBgJHtwcmVmaXggfHwgJyh2b2lkIDApJ307cmV0dXJuICR7KGJvZHkgfHwgJyh2b2lkIDApJykucmVwbGFjZSgvXlxccypyZXR1cm5cXHMrLywgJycpLnRyaW0oKX07YDtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKGNvbnRleHQsIGNvbnRleHQpO1xufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRlcm0oX25vZGVPclRleHQsIC4uLl9zY29wZXMpIHtcbiAgbGV0IHNjb3BlcyAgPSBfc2NvcGVzLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IHRleHQgICAgPSBfbm9kZU9yVGV4dDtcbiAgbGV0IG5vZGU7XG5cbiAgaWYgKHRleHQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgbm9kZSA9IHRleHQ7XG4gICAgaWYgKEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUy5pbmRleE9mKG5vZGUubm9kZVR5cGUpIDwgMClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZm9ybWF0VGVybVwiIHVuc3VwcG9ydGVkIG5vZGUgdHlwZSBwcm92aWRlZC4gT25seSBURVhUX05PREUgYW5kIEFUVFJJQlVURV9OT0RFIHR5cGVzIGFyZSBzdXBwb3J0ZWQuJyk7XG5cbiAgICB0ZXh0ID0gbm9kZS5ub2RlVmFsdWU7XG4gIH1cblxuICBsZXQgcmVzdWx0ID0gdGV4dC5yZXBsYWNlKC8oPzpeQEB8KFteXFxcXF0pQEApKC4rPylAQC9nLCAobSwgc3RhcnQsIG1hY3JvKSA9PiB7XG4gICAgY29uc3QgZmV0Y2hlciA9IGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoeyBib2R5OiBtYWNybywgc2NvcGVzIH0pO1xuICAgIGxldCB2YWx1ZSA9IGZldGNoZXIoKTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHZhbHVlID0gJyc7XG5cbiAgICBpZiAobm9kZSAmJiBpc1R5cGUodmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICB2YWx1ZS5fcmVnaXN0ZXJGb3JVcGRhdGUobm9kZSwgKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZm9ybWF0VGVybSh0ZXh0LCAuLi5zY29wZXMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke3N0YXJ0IHx8ICcnfSR7dmFsdWV9YDtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY29uc3QgSEFTX0RZTkFNSUNfQklORElORyA9IC9eQEB8W15cXFxcXUBALztcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUodmFsdWUpIHtcbiAgaWYgKCFpc1R5cGUodmFsdWUsICdTdHJpbmcnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIEhBU19EWU5BTUlDX0JJTkRJTkcudGVzdCh2YWx1ZSk7XG59XG5cbmNvbnN0IEVWRU5UX0FDVElPTl9KVVNUX05BTUUgPSAvXiU/W1xcdy4kXSskLztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250ZXh0QXdhcmVDYWxsYmFjayh7IHByZWZpeCwgYm9keSwgc2NvcGVzIH0pIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IGJvZHk7XG4gIGlmIChFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSkge1xuICAgIGlmIChmdW5jdGlvbkJvZHkuY2hhckF0KDApID09PSAnJScpXG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKHRoaXMuZHluYW1pY1Byb3BJRCB8fCBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQpKCcke2Z1bmN0aW9uQm9keS5zdWJzdHJpbmcoMSkudHJpbSgpLnJlcGxhY2UoL1teXFx3JF0vZywgJycpfScpYDtcbiAgICBlbHNlXG4gICAgICBmdW5jdGlvbkJvZHkgPSBgdGhpcy4ke2Z1bmN0aW9uQm9keX0uYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKTtgO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoe1xuICAgIGJvZHk6ICAgZnVuY3Rpb25Cb2R5LFxuICAgIHByZWZpeDogYCR7cHJlZml4IHx8ICcodm9pZCAwKSd9O2AsXG4gICAgc2NvcGVzLFxuICB9KTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9ICghZWxlbWVudC50YWdOYW1lKSA/IGVsZW1lbnQgOiBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgbGV0IGNhY2hlICAgPSBFVkVOVF9OQU1FX0NBQ0hFLmdldCh0YWdOYW1lKTtcbiAgaWYgKGNhY2hlKVxuICAgIHJldHVybiBjYWNoZTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEUuc2V0KHRhZ05hbWUsIGV2ZW50TmFtZXMpO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrLCAuLi5zY29wZXMpIHtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IGNhbGxiYWNrO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KF9jYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayAgPSBfY2FsbGJhY2suY2FsbGJhY2s7XG4gICAgb3B0aW9ucyAgID0gX2NhbGxiYWNrLm9wdGlvbnMgfHwge307XG4gIH0gZWxzZSBpZiAodHlwZW9mIF9jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9XG5cbiAgaWYgKGlzVHlwZShjYWxsYmFjaywgJ1N0cmluZycpKVxuICAgIGNhbGxiYWNrID0gY3JlYXRlQ29udGV4dEF3YXJlQ2FsbGJhY2soeyBwcmVmaXg6ICdsZXQgZXZlbnQ9YXJndW1lbnRzWzBdJywgYm9keTogY2FsbGJhY2ssIHNjb3BlcyB9KTtcblxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHsgY2FsbGJhY2ssIG9wdGlvbnMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUGF0aChvYmosIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmIChvYmogPT0gbnVsbCB8fCBPYmplY3QuaXMob2JqLCBOYU4pIHx8IE9iamVjdC5pcyhvYmosIEluZmluaXR5KSB8fCBPYmplY3QuaXMob2JqLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgaWYgKGtleSA9PSBudWxsIHx8IE9iamVjdC5pcyhrZXksIE5hTikgfHwgT2JqZWN0LmlzKGtleSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhrZXksIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBsZXQgcGFydHMgICAgICAgICA9IGtleS5zcGxpdCgvXFwuL2cpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGN1cnJlbnRWYWx1ZSAgPSBvYmo7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gcGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XG4gICAgbGV0IG5leHRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwYXJ0XTtcbiAgICBpZiAobmV4dFZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY3VycmVudFZhbHVlID0gbmV4dFZhbHVlO1xuICB9XG5cbiAgaWYgKGdsb2JhbFRoaXMuTm9kZSAmJiBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlIGluc3RhbmNlb2YgZ2xvYmFsVGhpcy5Ob2RlICYmIChjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkpXG4gICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5ub2RlVmFsdWU7XG5cbiAgcmV0dXJuIChjdXJyZW50VmFsdWUgPT0gbnVsbCkgPyBkZWZhdWx0VmFsdWUgOiBjdXJyZW50VmFsdWU7XG59XG5cbmNvbnN0IElTX05VTUJFUiA9IC9eKFstK10/KShcXGQqKD86XFwuXFxkKyk/KShlWy0rXVxcZCspPyQvO1xuY29uc3QgSVNfQk9PTEVBTiA9IC9eKHRydWV8ZmFsc2UpJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ05hTicpXG4gICAgcmV0dXJuIE5hTjtcblxuICBpZiAodmFsdWUgPT09ICdJbmZpbml0eScgfHwgdmFsdWUgPT09ICcrSW5maW5pdHknKVxuICAgIHJldHVybiBJbmZpbml0eTtcblxuICBpZiAodmFsdWUgPT09ICctSW5maW5pdHknKVxuICAgIHJldHVybiAtSW5maW5pdHk7XG5cbiAgaWYgKElTX05VTUJFUi50ZXN0KHZhbHVlKSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG5cbiAgaWYgKElTX0JPT0xFQU4udGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gJ3RydWUnKTtcblxuICByZXR1cm4gKCcnICsgdmFsdWUpO1xufVxuXG5jb25zdCBDQUNIRURfUFJPUEVSVFlfTkFNRVMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgU0tJUF9QUk9UT1RZUEVTICAgICAgID0gW1xuICBnbG9iYWxUaGlzLkhUTUxFbGVtZW50LFxuICBnbG9iYWxUaGlzLk5vZGUsXG4gIGdsb2JhbFRoaXMuRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5PYmplY3QsXG4gIGdsb2JhbFRoaXMuQXJyYXksXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvcGVydHlOYW1lcyhfb2JqKSB7XG4gIGlmICghaXNDb2xsZWN0YWJsZShfb2JqKSlcbiAgICByZXR1cm4gW107XG5cbiAgbGV0IGNhY2hlZE5hbWVzID0gQ0FDSEVEX1BST1BFUlRZX05BTUVTLmdldChfb2JqKTtcbiAgaWYgKGNhY2hlZE5hbWVzKVxuICAgIHJldHVybiBjYWNoZWROYW1lcztcblxuICBsZXQgb2JqICAgPSBfb2JqO1xuICBsZXQgbmFtZXMgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKG9iaikge1xuICAgIGxldCBvYmpOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gb2JqTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgIG5hbWVzLmFkZChvYmpOYW1lc1tpXSk7XG5cbiAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAob2JqICYmIFNLSVBfUFJPVE9UWVBFUy5pbmRleE9mKG9iai5jb25zdHJ1Y3RvcikgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgbGV0IGZpbmFsTmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKTtcbiAgQ0FDSEVEX1BST1BFUlRZX05BTUVTLnNldChfb2JqLCBmaW5hbE5hbWVzKTtcblxuICByZXR1cm4gZmluYWxOYW1lcztcbn1cblxuY29uc3QgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREeW5hbWljUHJvcGVydHlGb3JQYXRoKGtleVBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICBsZXQgaW5zdGFuY2VDYWNoZSA9IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5nZXQodGhpcyk7XG4gIGlmICghaW5zdGFuY2VDYWNoZSkge1xuICAgIGluc3RhbmNlQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLnNldCh0aGlzLCBpbnN0YW5jZUNhY2hlKTtcbiAgfVxuXG4gIGxldCBwcm9wZXJ0eSA9IGluc3RhbmNlQ2FjaGUuZ2V0KGtleVBhdGgpO1xuICBpZiAoIXByb3BlcnR5KSB7XG4gICAgcHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG4gICAgaW5zdGFuY2VDYWNoZS5zZXQoa2V5UGF0aCwgcHJvcGVydHkpO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BlY2lhbENsb3Nlc3Qobm9kZSwgc2VsZWN0b3IpIHtcbiAgaWYgKCFub2RlIHx8ICFzZWxlY3RvcilcbiAgICByZXR1cm47XG5cbiAgaWYgKHR5cGVvZiBub2RlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IGdldFBhcmVudE5vZGUgPSAoZWxlbWVudCkgPT4ge1xuICAgIGlmICghZWxlbWVudClcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKTtcblxuICAgIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGU7XG4gIH07XG5cbiAgbGV0IGN1cnJlbnROb2RlID0gbm9kZTtcbiAgbGV0IHJlc3VsdDtcblxuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgIShyZXN1bHQgPSBjdXJyZW50Tm9kZS5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyB8fCAwKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljUHJvcChuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlcikge1xuICBsZXQgZHluYW1pY1Byb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICBbbmFtZV06IHtcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogICAgICAgICAgKCkgPT4gZHluYW1pY1Byb3BlcnR5LFxuICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5Ll9zZXQoc2V0dGVyKG5ld1ZhbHVlKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkeW5hbWljUHJvcGVydHkuX3NldChuZXdWYWx1ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBkeW5hbWljUHJvcGVydHk7XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUF9SRUdJU1RSWSA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNQcm9wSUQoaWQpIHtcbiAgbGV0IHByb3AgPSBEWU5BTUlDX1BST1BfUkVHSVNUUlkuZ2V0KGlkKTtcbiAgaWYgKHByb3ApXG4gICAgcmV0dXJuIHByb3A7XG5cbiAgcHJvcCA9IG5ldyBEeW5hbWljUHJvcGVydHkoJycpO1xuICBEWU5BTUlDX1BST1BfUkVHSVNUUlkuc2V0KGlkLCBwcm9wKTtcblxuICByZXR1cm4gcHJvcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlTmFtZVZhbHVlUGFpckhlbHBlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIG1ldGFkYXRhKFxuICAgIHRhcmdldCxcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUixcbiAgICBbIG5hbWUsIHZhbHVlIF0sXG4gICk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUyA9IG5ldyBTZXQoWyAnW2RhdGEtdGVtcGxhdGVzLWRpc2FibGVdJywgJ215dGhpeC1mb3ItZWFjaCcgXSk7XG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMpLmpvaW4oJywnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5hZGQoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuZGVsZXRlKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gZ2xvYmFsU3RvcmVIZWxwZXIoZHluYW1pYywgYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IHNldE9uR2xvYmFsID0gKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV07XG4gICAgaWYgKGlzVHlwZShjdXJyZW50VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdLl9zZXQodmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1R5cGUodmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWUuX3NldChuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgbGV0IHByb3AgPSBkeW5hbWljUHJvcElEKG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gcHJvcCxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgcHJvcC5fc2V0KG5ld1ZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHByb3AuX3NldCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG5hbWVWYWx1ZVBhaXIgPSBtZXRhZGF0YShhcmdzWzBdLCBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUik7XG4gIGlmIChuYW1lVmFsdWVQYWlyKSB7XG4gICAgbGV0IFsgbmFtZSwgdmFsdWUgXSA9IG5hbWVWYWx1ZVBhaXI7XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiBpc1R5cGUoYXJnc1swXSwgJ1N0cmluZycpKSB7XG4gICAgbGV0IG5hbWUgID0gYXJnc1swXTtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzFdO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzBdO1xuICAgIGxldCBuYW1lICA9ICh0eXBlb2YgdGhpcy5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSA/IHRoaXMuZ2V0SWRlbnRpZmllcigpIDogKHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIGlmICghbmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJteXRoaXhVSS5nbG9iYWxTdG9yZVwiOiBcIm5hbWVcIiBpcyB1bmtub3duLCBzbyB1bmFibGUgdG8gc3RvcmUgdmFsdWUnKTtcblxuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmUoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCBmYWxzZSwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZUR5bmFtaWMoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCB0cnVlLCBhcmdzKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSB8fCB7fSk7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmV4cG9ydCAqIGFzIENvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnQuanMnO1xuZXhwb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1yZXF1aXJlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXNwaW5uZXIuanMnO1xuXG5jb25zdCBNeXRoaXhVSUNvbXBvbmVudCA9IENvbXBvbmVudHMuTXl0aGl4VUlDb21wb25lbnQ7XG5cbmV4cG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxufTtcblxubGV0IF9teXRoaXhJc1JlYWR5ID0gZmFsc2U7XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLCB7XG4gICdvbm15dGhpeHJlYWR5Jzoge1xuICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogICAgICAgICAgKCkgPT4ge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBzZXQ6ICAgICAgICAgIChjYWxsYmFjaykgPT4ge1xuICAgICAgaWYgKF9teXRoaXhJc1JlYWR5KSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gY2FsbGJhY2sobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ215dGhpeC1yZWFkeScsIGNhbGxiYWNrKTtcbiAgICB9LFxuICB9LFxufSk7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkuVXRpbHMgPSBVdGlscztcbmdsb2JhbFRoaXMubXl0aGl4VUkuQ29tcG9uZW50cyA9IENvbXBvbmVudHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkVsZW1lbnRzID0gRWxlbWVudHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmdsb2JhbFN0b3JlID0gVXRpbHMuZ2xvYmFsU3RvcmU7XG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmdsb2JhbFN0b3JlRHluYW1pYyA9IFV0aWxzLmdsb2JhbFN0b3JlRHluYW1pYztcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5keW5hbWljUHJvcElEID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIFV0aWxzLmR5bmFtaWNQcm9wSUQoaWQpO1xufTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbGV0IGRpZFZpc2liaWxpdHlPYnNlcnZlcnMgPSBmYWxzZTtcblxuICBjb25zdCBvbkRvY3VtZW50UmVhZHkgPSAoKSA9PiB7XG4gICAgaWYgKCFkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzKSB7XG4gICAgICBsZXQgZWxlbWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW15dGhpeC1zcmNdJykpO1xuICAgICAgQ29tcG9uZW50cy52aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgZGlzY29ubmVjdCwgZWxlbWVudCwgd2FzVmlzaWJsZSB9KSA9PiB7XG4gICAgICAgIGlmICh3YXNWaXNpYmxlKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpO1xuICAgICAgICBpZiAoIXNyYylcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIENvbXBvbmVudHMubG9hZFBhcnRpYWxJbnRvRWxlbWVudC5jYWxsKGVsZW1lbnQsIHNyYykudGhlbigoKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCB7IGVsZW1lbnRzIH0pO1xuXG4gICAgICBkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuXG4gICAgaWYgKF9teXRoaXhJc1JlYWR5KVxuICAgICAgcmV0dXJuO1xuXG4gICAgX215dGhpeElzUmVhZHkgPSB0cnVlO1xuXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ215dGhpeC1yZWFkeScpKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLCB7XG4gICAgJyQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogICAgICAgICguLi5hcmdzKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKC4uLmFyZ3MpLFxuICAgIH0sXG4gICAgJyQkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCguLi5hcmdzKSxcbiAgICB9LFxuICB9KTtcblxuICBsZXQgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsVGhpcy5teXRoaXhVSS5kb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbGV0IGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyID0gVXRpbHMuZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBtdXRhdGlvbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgJiYgbXV0YXRpb24udGFyZ2V0LnBhcmVudE5vZGUgJiYgbXV0YXRpb24udGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0cikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBtdXRhdGlvbi50YXJnZXQuZ2V0QXR0cmlidXRlTm9kZShtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlICAgICAgPSBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUobmV3VmFsdWUpKVxuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShtdXRhdGlvbi50YXJnZXQsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuICAgICAgICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgJiYgbXV0YXRpb24udGFyZ2V0ICYmIG11dGF0aW9uLnRhcmdldC5jbG9zZXN0KCdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0sbXl0aGl4LWZvci1lYWNoJykpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IGFkZGVkTm9kZXMgPSBtdXRhdGlvbi5hZGRlZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgamwgPSBhZGRlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IGFkZGVkTm9kZXNbal07XG4gICAgICAgICAgQ29tcG9uZW50cy5yZWN1cnNpdmVseUJpbmREeW5hbWljRGF0YShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBzdWJ0cmVlOiAgICAgICAgICAgIHRydWUsXG4gICAgY2hpbGRMaXN0OiAgICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6ICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogIHRydWUsXG4gIH0pO1xuXG4gIENvbXBvbmVudHMucmVjdXJzaXZlbHlCaW5kRHluYW1pY0RhdGEoZG9jdW1lbnQuaGVhZCk7XG4gIENvbXBvbmVudHMucmVjdXJzaXZlbHlCaW5kRHluYW1pY0RhdGEoZG9jdW1lbnQuYm9keSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpXG4gICAgICBvbkRvY3VtZW50UmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25Eb2N1bWVudFJlYWR5KTtcbiAgfSwgMjUwKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=