/******/ var __webpack_modules__ = ({

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
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

  set attr$dataMythixSrc([ oldValue, newValue ]) {
    this.awaitFetchSrcOnVisible(newValue, oldValue);
  }

  constructor() {
    super();

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindMethods.call(this, this.constructor.prototype, [ HTMLElement.prototype ]);

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

  processElements(node) {
    if (!node)
      return node;

    for (let childNode of Array.from(node.childNodes)) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        childNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(this, childNode);
      } else if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType >= Node.DOCUMENT_NODE) {
        childNode = this.processElements(childNode);

        let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(childNode);
        let attributeNames  = childNode.getAttributeNames();
        for (let i = 0, il = attributeNames.length; i < il; i++) {
          let attributeName       = attributeNames[i];
          let lowerAttributeName  = attributeName.toLowerCase();
          let attributeValue      = childNode.getAttribute(attributeName);

          if (eventNames.indexOf(lowerAttributeName) >= 0) {
            _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement(childNode, childNode, lowerAttributeName.substring(2), attributeValue);
            childNode.removeAttribute(attributeName);
          } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(attributeValue)) {
            let attributeNode = childNode.getAttributeNode(attributeName);
            attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(this, attributeNode);
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
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(shadow, '_mythixUIShadowParent', this);

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

    return this.ownerDocument.querySelector(`template[data-mythix-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
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
    this.setAttribute('component-name', this.sensitiveTagName);

    this.appendTemplateToShadowDOM();
    this.processElements(this);

    this.mounted();

    this.documentInitialized = true;
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
        this[magicName] = args.slice(1);
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
    let context = Object.create(null);
    if (typeof this.publishContext === 'function')
      context = (this.publishContext() || Object.create(null));

    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.createProxyContext(this, context);
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
    let result = [ callback(_elements_js__WEBPACK_IMPORTED_MODULE_2__, {}) ].flat(Infinity).map((item) => {
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

  metadata(key, value) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this, key, value);
  }

  dynamicProp(name, _getter, _setter, _context) {
    let isGetterFunc  = (typeof _getter === 'function');
    let internalValue = (isGetterFunc) ? undefined : _getter;
    let getter        = (isGetterFunc) ? _getter : () => internalValue;
    let setter        = (typeof _setter === 'function') ? _setter : (newValue) => {
      internalValue = newValue;
    };

    let dynamicProperty = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty(getter, setter);
    let context         = _context || this;

    Object.defineProperties(context, {
      [name]: {
        enumerable:   true,
        configurable: true,
        get:          () => dynamicProperty,
        set:          (newValue) => {
          dynamicProperty.set(newValue);
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
    } catch (error) {
      console.error(`"${this.sensitiveTagName}": Failed to load specified resource: ${srcURL} (resolved to: ${error.url})`, error);
    }
  }
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
      url = resolveURL(location, newSrc, magic);
  }

  return url;
}

const IS_TEMPLATE   = /^(template)$/i;
const IS_SCRIPT     = /^(script)$/i;
const REQUIRE_CACHE = new Map();

function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
  let options   = _options || {};
  let url       = resolveURL(location, _url, options.magic);
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

  if (typeof options.preProcessTemplate === 'function') {
    template = context.template = options.preProcessTemplate.call(this, context);
    children = Array.from(template.content.children);
  }

  let nodeHandler   = options.nodeHandler;
  let templateCount = children.reduce((sum, element) => ((IS_TEMPLATE.test(element.tagName)) ? (sum + 1) : sum), 0);

  context.templateCount = templateCount;

  for (let child of children) {
    if (IS_TEMPLATE.test(child.tagName)) { // <template>
      if (templateCount === 1 && child.getAttribute('data-for') == null && child.getAttribute('data-mythix-name') == null) {
        console.warn(`${url}: <template> is missing a "data-for" attribute, linking it to its owner component. Guessing "${guessedElementName}".`);
        child.setAttribute('data-for', guessedElementName);
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isTemplate: true, isHandled: true }) === false)
        continue;

      // append to head
      let elementName = (child.getAttribute('data-for') || child.getAttribute('data-mythix-name'));
      if (!ownerDocument.body.querySelector(`[data-for="${elementName}" i],[data-mythix-name="${elementName}" i]`))
        ownerDocument.body.appendChild(child);
    } else if (IS_SCRIPT.test(child.tagName)) { // <script>
      let childClone = ownerDocument.createElement(child.tagName);
      for (let attributeName of child.getAttributeNames())
        childClone.setAttribute(attributeName, child.getAttribute(attributeName));

      let src = child.getAttribute('src');
      if (src) {
        src = resolveURL(baseURL, src, false);
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

  return context;
}

async function require(ownerDocument, urlOrName, _options) {
  let options   = _options || {};
  let url       = resolveURL(ownerDocument.location, urlOrName, options.magic);
  let cacheKey;

  if (url.searchParams.get('cache') !== 'false') {
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

  let promise = globalThis.fetch(url, options.fetchOptions).then(
    async (response) => {
      if (!response.ok) {
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
      REQUIRE_CACHE.delete(cacheKey);

      error.url = url;
      throw error;
    },
  );

  REQUIRE_CACHE.set(cacheKey, promise);

  return await promise;
}

async function loadPartialIntoElement(src) {
  // await sleep(1500);

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

  let context = _utils_js__WEBPACK_IMPORTED_MODULE_0__.createProxyContext(this, scopeData);
  let scope   = { context, $$: context };

  importIntoDocumentFromSource.call(
    this,
    ownerDocument,
    ownerDocument.location,
    url,
    body,
    {
      nodeHandler: (node, { isHandled, isTemplate }) => {
        if ((isTemplate || !isHandled) && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE))
          this.appendChild(recursivelyBindDynamicData(scope, node));
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

function recursivelyBindDynamicData(context, node) {
  return remapNodeTree(node, (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let nodeValue = node.nodeValue;
      if (nodeValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(nodeValue))
        node.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(context, node);
    } else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType >= Node.DOCUMENT_NODE) {
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
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(context, attributeNode);
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
/* harmony export */   A: () => (/* binding */ A),
/* harmony export */   ABBR: () => (/* binding */ ABBR),
/* harmony export */   ADDRESS: () => (/* binding */ ADDRESS),
/* harmony export */   ALTGLYPH: () => (/* binding */ ALTGLYPH),
/* harmony export */   ALTGLYPHDEF: () => (/* binding */ ALTGLYPHDEF),
/* harmony export */   ALTGLYPHITEM: () => (/* binding */ ALTGLYPHITEM),
/* harmony export */   ANIMATE: () => (/* binding */ ANIMATE),
/* harmony export */   ANIMATECOLOR: () => (/* binding */ ANIMATECOLOR),
/* harmony export */   ANIMATEMOTION: () => (/* binding */ ANIMATEMOTION),
/* harmony export */   ANIMATETRANSFORM: () => (/* binding */ ANIMATETRANSFORM),
/* harmony export */   ANIMATION: () => (/* binding */ ANIMATION),
/* harmony export */   AREA: () => (/* binding */ AREA),
/* harmony export */   ARTICLE: () => (/* binding */ ARTICLE),
/* harmony export */   ASIDE: () => (/* binding */ ASIDE),
/* harmony export */   AUDIO: () => (/* binding */ AUDIO),
/* harmony export */   B: () => (/* binding */ B),
/* harmony export */   BASE: () => (/* binding */ BASE),
/* harmony export */   BDI: () => (/* binding */ BDI),
/* harmony export */   BDO: () => (/* binding */ BDO),
/* harmony export */   BLOCKQUOTE: () => (/* binding */ BLOCKQUOTE),
/* harmony export */   BR: () => (/* binding */ BR),
/* harmony export */   BUTTON: () => (/* binding */ BUTTON),
/* harmony export */   CANVAS: () => (/* binding */ CANVAS),
/* harmony export */   CAPTION: () => (/* binding */ CAPTION),
/* harmony export */   CIRCLE: () => (/* binding */ CIRCLE),
/* harmony export */   CITE: () => (/* binding */ CITE),
/* harmony export */   CLIPPATH: () => (/* binding */ CLIPPATH),
/* harmony export */   CODE: () => (/* binding */ CODE),
/* harmony export */   COL: () => (/* binding */ COL),
/* harmony export */   COLGROUP: () => (/* binding */ COLGROUP),
/* harmony export */   COLORPROFILE: () => (/* binding */ COLORPROFILE),
/* harmony export */   CURSOR: () => (/* binding */ CURSOR),
/* harmony export */   DATA: () => (/* binding */ DATA),
/* harmony export */   DATALIST: () => (/* binding */ DATALIST),
/* harmony export */   DD: () => (/* binding */ DD),
/* harmony export */   DEFS: () => (/* binding */ DEFS),
/* harmony export */   DEL: () => (/* binding */ DEL),
/* harmony export */   DESC: () => (/* binding */ DESC),
/* harmony export */   DETAILS: () => (/* binding */ DETAILS),
/* harmony export */   DFN: () => (/* binding */ DFN),
/* harmony export */   DIALOG: () => (/* binding */ DIALOG),
/* harmony export */   DISCARD: () => (/* binding */ DISCARD),
/* harmony export */   DIV: () => (/* binding */ DIV),
/* harmony export */   DL: () => (/* binding */ DL),
/* harmony export */   DT: () => (/* binding */ DT),
/* harmony export */   ELEMENT_NAMES: () => (/* binding */ ELEMENT_NAMES),
/* harmony export */   ELLIPSE: () => (/* binding */ ELLIPSE),
/* harmony export */   EM: () => (/* binding */ EM),
/* harmony export */   EMBED: () => (/* binding */ EMBED),
/* harmony export */   ElementDefinition: () => (/* binding */ ElementDefinition),
/* harmony export */   FEBLEND: () => (/* binding */ FEBLEND),
/* harmony export */   FECOLORMATRIX: () => (/* binding */ FECOLORMATRIX),
/* harmony export */   FECOMPONENTTRANSFER: () => (/* binding */ FECOMPONENTTRANSFER),
/* harmony export */   FECOMPOSITE: () => (/* binding */ FECOMPOSITE),
/* harmony export */   FECONVOLVEMATRIX: () => (/* binding */ FECONVOLVEMATRIX),
/* harmony export */   FEDIFFUSELIGHTING: () => (/* binding */ FEDIFFUSELIGHTING),
/* harmony export */   FEDISPLACEMENTMAP: () => (/* binding */ FEDISPLACEMENTMAP),
/* harmony export */   FEDISTANTLIGHT: () => (/* binding */ FEDISTANTLIGHT),
/* harmony export */   FEDROPSHADOW: () => (/* binding */ FEDROPSHADOW),
/* harmony export */   FEFLOOD: () => (/* binding */ FEFLOOD),
/* harmony export */   FEFUNCA: () => (/* binding */ FEFUNCA),
/* harmony export */   FEFUNCB: () => (/* binding */ FEFUNCB),
/* harmony export */   FEFUNCG: () => (/* binding */ FEFUNCG),
/* harmony export */   FEFUNCR: () => (/* binding */ FEFUNCR),
/* harmony export */   FEGAUSSIANBLUR: () => (/* binding */ FEGAUSSIANBLUR),
/* harmony export */   FEIMAGE: () => (/* binding */ FEIMAGE),
/* harmony export */   FEMERGE: () => (/* binding */ FEMERGE),
/* harmony export */   FEMERGENODE: () => (/* binding */ FEMERGENODE),
/* harmony export */   FEMORPHOLOGY: () => (/* binding */ FEMORPHOLOGY),
/* harmony export */   FEOFFSET: () => (/* binding */ FEOFFSET),
/* harmony export */   FEPOINTLIGHT: () => (/* binding */ FEPOINTLIGHT),
/* harmony export */   FESPECULARLIGHTING: () => (/* binding */ FESPECULARLIGHTING),
/* harmony export */   FESPOTLIGHT: () => (/* binding */ FESPOTLIGHT),
/* harmony export */   FETILE: () => (/* binding */ FETILE),
/* harmony export */   FETURBULENCE: () => (/* binding */ FETURBULENCE),
/* harmony export */   FIELDSET: () => (/* binding */ FIELDSET),
/* harmony export */   FIGCAPTION: () => (/* binding */ FIGCAPTION),
/* harmony export */   FIGURE: () => (/* binding */ FIGURE),
/* harmony export */   FILTER: () => (/* binding */ FILTER),
/* harmony export */   FONT: () => (/* binding */ FONT),
/* harmony export */   FONTFACE: () => (/* binding */ FONTFACE),
/* harmony export */   FONTFACEFORMAT: () => (/* binding */ FONTFACEFORMAT),
/* harmony export */   FONTFACENAME: () => (/* binding */ FONTFACENAME),
/* harmony export */   FONTFACESRC: () => (/* binding */ FONTFACESRC),
/* harmony export */   FONTFACEURI: () => (/* binding */ FONTFACEURI),
/* harmony export */   FOOTER: () => (/* binding */ FOOTER),
/* harmony export */   FOREIGNOBJECT: () => (/* binding */ FOREIGNOBJECT),
/* harmony export */   FORM: () => (/* binding */ FORM),
/* harmony export */   G: () => (/* binding */ G),
/* harmony export */   GLYPH: () => (/* binding */ GLYPH),
/* harmony export */   GLYPHREF: () => (/* binding */ GLYPHREF),
/* harmony export */   H1: () => (/* binding */ H1),
/* harmony export */   H2: () => (/* binding */ H2),
/* harmony export */   H3: () => (/* binding */ H3),
/* harmony export */   H4: () => (/* binding */ H4),
/* harmony export */   H5: () => (/* binding */ H5),
/* harmony export */   H6: () => (/* binding */ H6),
/* harmony export */   HANDLER: () => (/* binding */ HANDLER),
/* harmony export */   HEADER: () => (/* binding */ HEADER),
/* harmony export */   HGROUP: () => (/* binding */ HGROUP),
/* harmony export */   HKERN: () => (/* binding */ HKERN),
/* harmony export */   HR: () => (/* binding */ HR),
/* harmony export */   I: () => (/* binding */ I),
/* harmony export */   IFRAME: () => (/* binding */ IFRAME),
/* harmony export */   IMAGE: () => (/* binding */ IMAGE),
/* harmony export */   IMG: () => (/* binding */ IMG),
/* harmony export */   INPUT: () => (/* binding */ INPUT),
/* harmony export */   INS: () => (/* binding */ INS),
/* harmony export */   KBD: () => (/* binding */ KBD),
/* harmony export */   LABEL: () => (/* binding */ LABEL),
/* harmony export */   LEGEND: () => (/* binding */ LEGEND),
/* harmony export */   LI: () => (/* binding */ LI),
/* harmony export */   LINE: () => (/* binding */ LINE),
/* harmony export */   LINEARGRADIENT: () => (/* binding */ LINEARGRADIENT),
/* harmony export */   LINK: () => (/* binding */ LINK),
/* harmony export */   LISTENER: () => (/* binding */ LISTENER),
/* harmony export */   MAIN: () => (/* binding */ MAIN),
/* harmony export */   MAP: () => (/* binding */ MAP),
/* harmony export */   MARK: () => (/* binding */ MARK),
/* harmony export */   MARKER: () => (/* binding */ MARKER),
/* harmony export */   MASK: () => (/* binding */ MASK),
/* harmony export */   MENU: () => (/* binding */ MENU),
/* harmony export */   META: () => (/* binding */ META),
/* harmony export */   METADATA: () => (/* binding */ METADATA),
/* harmony export */   METER: () => (/* binding */ METER),
/* harmony export */   MISSINGGLYPH: () => (/* binding */ MISSINGGLYPH),
/* harmony export */   MPATH: () => (/* binding */ MPATH),
/* harmony export */   NAV: () => (/* binding */ NAV),
/* harmony export */   NOSCRIPT: () => (/* binding */ NOSCRIPT),
/* harmony export */   OBJECT: () => (/* binding */ OBJECT),
/* harmony export */   OL: () => (/* binding */ OL),
/* harmony export */   OPTGROUP: () => (/* binding */ OPTGROUP),
/* harmony export */   OPTION: () => (/* binding */ OPTION),
/* harmony export */   OUTPUT: () => (/* binding */ OUTPUT),
/* harmony export */   P: () => (/* binding */ P),
/* harmony export */   PATH: () => (/* binding */ PATH),
/* harmony export */   PATTERN: () => (/* binding */ PATTERN),
/* harmony export */   PICTURE: () => (/* binding */ PICTURE),
/* harmony export */   POLYGON: () => (/* binding */ POLYGON),
/* harmony export */   POLYLINE: () => (/* binding */ POLYLINE),
/* harmony export */   PRE: () => (/* binding */ PRE),
/* harmony export */   PREFETCH: () => (/* binding */ PREFETCH),
/* harmony export */   PROGRESS: () => (/* binding */ PROGRESS),
/* harmony export */   Q: () => (/* binding */ Q),
/* harmony export */   RADIALGRADIENT: () => (/* binding */ RADIALGRADIENT),
/* harmony export */   RECT: () => (/* binding */ RECT),
/* harmony export */   RP: () => (/* binding */ RP),
/* harmony export */   RT: () => (/* binding */ RT),
/* harmony export */   RUBY: () => (/* binding */ RUBY),
/* harmony export */   S: () => (/* binding */ S),
/* harmony export */   SAMP: () => (/* binding */ SAMP),
/* harmony export */   SCRIPT: () => (/* binding */ SCRIPT),
/* harmony export */   SECTION: () => (/* binding */ SECTION),
/* harmony export */   SELECT: () => (/* binding */ SELECT),
/* harmony export */   SET: () => (/* binding */ SET),
/* harmony export */   SLOT: () => (/* binding */ SLOT),
/* harmony export */   SMALL: () => (/* binding */ SMALL),
/* harmony export */   SOLIDCOLOR: () => (/* binding */ SOLIDCOLOR),
/* harmony export */   SOURCE: () => (/* binding */ SOURCE),
/* harmony export */   SPAN: () => (/* binding */ SPAN),
/* harmony export */   STOP: () => (/* binding */ STOP),
/* harmony export */   STRONG: () => (/* binding */ STRONG),
/* harmony export */   STYLE: () => (/* binding */ STYLE),
/* harmony export */   SUB: () => (/* binding */ SUB),
/* harmony export */   SUMMARY: () => (/* binding */ SUMMARY),
/* harmony export */   SUP: () => (/* binding */ SUP),
/* harmony export */   SVG: () => (/* binding */ SVG),
/* harmony export */   SVG_ELEMENT_NAMES: () => (/* binding */ SVG_ELEMENT_NAMES),
/* harmony export */   SWITCH: () => (/* binding */ SWITCH),
/* harmony export */   SYMBOL: () => (/* binding */ SYMBOL),
/* harmony export */   TABLE: () => (/* binding */ TABLE),
/* harmony export */   TBODY: () => (/* binding */ TBODY),
/* harmony export */   TBREAK: () => (/* binding */ TBREAK),
/* harmony export */   TD: () => (/* binding */ TD),
/* harmony export */   TEMPLATE: () => (/* binding */ TEMPLATE),
/* harmony export */   TEXT: () => (/* binding */ TEXT),
/* harmony export */   TEXTAREA: () => (/* binding */ TEXTAREA),
/* harmony export */   TEXTPATH: () => (/* binding */ TEXTPATH),
/* harmony export */   TFOOT: () => (/* binding */ TFOOT),
/* harmony export */   TH: () => (/* binding */ TH),
/* harmony export */   THEAD: () => (/* binding */ THEAD),
/* harmony export */   TIME: () => (/* binding */ TIME),
/* harmony export */   TITLE: () => (/* binding */ TITLE),
/* harmony export */   TR: () => (/* binding */ TR),
/* harmony export */   TRACK: () => (/* binding */ TRACK),
/* harmony export */   TREF: () => (/* binding */ TREF),
/* harmony export */   TSPAN: () => (/* binding */ TSPAN),
/* harmony export */   Term: () => (/* binding */ Term),
/* harmony export */   U: () => (/* binding */ U),
/* harmony export */   UL: () => (/* binding */ UL),
/* harmony export */   UNFINISHED_DEFINITION: () => (/* binding */ UNFINISHED_DEFINITION),
/* harmony export */   UNKNOWN: () => (/* binding */ UNKNOWN),
/* harmony export */   USE: () => (/* binding */ USE),
/* harmony export */   VAR: () => (/* binding */ VAR),
/* harmony export */   VIDEO: () => (/* binding */ VIDEO),
/* harmony export */   VIEW: () => (/* binding */ VIEW),
/* harmony export */   VKERN: () => (/* binding */ VKERN),
/* harmony export */   WBR: () => (/* binding */ WBR),
/* harmony export */   build: () => (/* binding */ build),
/* harmony export */   isSVGElement: () => (/* binding */ isSVGElement)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");


const UNFINISHED_DEFINITION = Symbol.for('/joy/elementDefinition/constants/unfinished');

const IS_PROP_NAME = /^prop\$/;

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
      textNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(context, textNode);
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
        this.bindEventToElement(context, element, lowerAttributeName.substring(2), attributeValue);
      } else {
        let modifiedAttributeName = this.toDOMAttributeName(attributeName);

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(attributeValue)) {
          // Create attribute
          element.setAttribute(modifiedAttributeName, attributeValue);

          // Get attribute node just created
          let attributeNode = element.getAttributeNode(modifiedAttributeName);
          attributeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(context, attributeNode);
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

const ELEMENT_NAMES = [];
const E = (tagName, defaultAttributes) => {
  ELEMENT_NAMES.push(tagName);
  return build(tagName, defaultAttributes);
};

const A          = E('a');
const ABBR       = E('abbr');
const ADDRESS    = E('address');
const AREA       = E('area');
const ARTICLE    = E('article');
const ASIDE      = E('aside');
const AUDIO      = E('audio');
const B          = E('b');
const BASE       = E('base');
const BDI        = E('bdi');
const BDO        = E('bdo');
const BLOCKQUOTE = E('blockquote');
const BR         = E('br');
const BUTTON     = E('button');
const CANVAS     = E('canvas');
const CAPTION    = E('caption');
const CITE       = E('cite');
const CODE       = E('code');
const COL        = E('col');
const COLGROUP   = E('colgroup');
const DATA       = E('data');
const DATALIST   = E('datalist');
const DD         = E('dd');
const DEL        = E('del');
const DETAILS    = E('details');
const DFN        = E('dfn');
const DIALOG     = E('dialog');
const DIV        = E('div');
const DL         = E('dl');
const DT         = E('dt');
const EM         = E('em');
const EMBED      = E('embed');
const FIELDSET   = E('fieldset');
const FIGCAPTION = E('figcaption');
const FIGURE     = E('figure');
const FOOTER     = E('footer');
const FORM       = E('form');
const H1         = E('h1');
const H2         = E('h2');
const H3         = E('h3');
const H4         = E('h4');
const H5         = E('h5');
const H6         = E('h6');
const HEADER     = E('header');
const HGROUP     = E('hgroup');
const HR         = E('hr');
const I          = E('i');
const IFRAME     = E('iframe');
const IMG        = E('img');
const INPUT      = E('input');
const INS        = E('ins');
const KBD        = E('kbd');
const LABEL      = E('label');
const LEGEND     = E('legend');
const LI         = E('li');
const LINK       = E('link');
const MAIN       = E('main');
const MAP        = E('map');
const MARK       = E('mark');
const MENU       = E('menu');
const META       = E('meta');
const METER      = E('meter');
const NAV        = E('nav');
const NOSCRIPT   = E('noscript');
const OBJECT     = E('object');
const OL         = E('ol');
const OPTGROUP   = E('optgroup');
const OPTION     = E('option');
const OUTPUT     = E('output');
const P          = E('p');
const PICTURE    = E('picture');
const PRE        = E('pre');
const PROGRESS   = E('progress');
const Q          = E('q');
const RP         = E('rp');
const RT         = E('rt');
const RUBY       = E('ruby');
const S          = E('s');
const SAMP       = E('samp');
const SCRIPT     = E('script');
const SECTION    = E('section');
const SELECT     = E('select');
const SLOT       = E('slot');
const SMALL      = E('small');
const SOURCE     = E('source');
const SPAN       = E('span');
const STRONG     = E('strong');
const STYLE      = E('style');
const SUB        = E('sub');
const SUMMARY    = E('summary');
const SUP        = E('sup');
const TABLE      = E('table');
const TBODY      = E('tbody');
const TD         = E('td');
const TEMPLATE   = E('template');
const TEXTAREA   = E('textarea');
const TFOOT      = E('tfoot');
const TH         = E('th');
const THEAD      = E('thead');
const TIME       = E('time');
const TITLE      = E('title');
const TR         = E('tr');
const TRACK      = E('track');
const U          = E('u');
const UL         = E('ul');
const VAR        = E('var');
const VIDEO      = E('video');
const WBR        = E('wbr');

const SVG_ELEMENT_NAMES = [];

const SE = (tagName, defaultAttributes) => {
  SVG_ELEMENT_NAMES.push(tagName);
  return build(tagName, defaultAttributes);
};

// SVG element names
const ALTGLYPH             = SE('altglyph');
const ALTGLYPHDEF          = SE('altglyphdef');
const ALTGLYPHITEM         = SE('altglyphitem');
const ANIMATE              = SE('animate');
const ANIMATECOLOR         = SE('animateColor');
const ANIMATEMOTION        = SE('animateMotion');
const ANIMATETRANSFORM     = SE('animateTransform');
const ANIMATION            = SE('animation');
const CIRCLE               = SE('circle');
const CLIPPATH             = SE('clipPath');
const COLORPROFILE         = SE('colorProfile');
const CURSOR               = SE('cursor');
const DEFS                 = SE('defs');
const DESC                 = SE('desc');
const DISCARD              = SE('discard');
const ELLIPSE              = SE('ellipse');
const FEBLEND              = SE('feblend');
const FECOLORMATRIX        = SE('fecolormatrix');
const FECOMPONENTTRANSFER  = SE('fecomponenttransfer');
const FECOMPOSITE          = SE('fecomposite');
const FECONVOLVEMATRIX     = SE('feconvolvematrix');
const FEDIFFUSELIGHTING    = SE('fediffuselighting');
const FEDISPLACEMENTMAP    = SE('fedisplacementmap');
const FEDISTANTLIGHT       = SE('fedistantlight');
const FEDROPSHADOW         = SE('fedropshadow');
const FEFLOOD              = SE('feflood');
const FEFUNCA              = SE('fefunca');
const FEFUNCB              = SE('fefuncb');
const FEFUNCG              = SE('fefuncg');
const FEFUNCR              = SE('fefuncr');
const FEGAUSSIANBLUR       = SE('fegaussianblur');
const FEIMAGE              = SE('feimage');
const FEMERGE              = SE('femerge');
const FEMERGENODE          = SE('femergenode');
const FEMORPHOLOGY         = SE('femorphology');
const FEOFFSET             = SE('feoffset');
const FEPOINTLIGHT         = SE('fepointlight');
const FESPECULARLIGHTING   = SE('fespecularlighting');
const FESPOTLIGHT          = SE('fespotlight');
const FETILE               = SE('fetile');
const FETURBULENCE         = SE('feturbulence');
const FILTER               = SE('filter');
const FONT                 = SE('font');
const FONTFACE             = SE('fontFace');
const FONTFACEFORMAT       = SE('fontFaceFormat');
const FONTFACENAME         = SE('fontFaceName');
const FONTFACESRC          = SE('fontFaceSrc');
const FONTFACEURI          = SE('fontFaceUri');
const FOREIGNOBJECT        = SE('foreignObject');
const G                    = SE('g');
const GLYPH                = SE('glyph');
const GLYPHREF             = SE('glyphRef');
const HANDLER              = SE('handler');
const HKERN                = SE('hKern');
const IMAGE                = SE('image');
const LINE                 = SE('line');
const LINEARGRADIENT       = SE('lineargradient');
const LISTENER             = SE('listener');
const MARKER               = SE('marker');
const MASK                 = SE('mask');
const METADATA             = SE('metadata');
const MISSINGGLYPH         = SE('missingGlyph');
const MPATH                = SE('mPath');
const PATH                 = SE('path');
const PATTERN              = SE('pattern');
const POLYGON              = SE('polygon');
const POLYLINE             = SE('polyline');
const PREFETCH             = SE('prefetch');
const RADIALGRADIENT       = SE('radialgradient');
const RECT                 = SE('rect');
const SET                  = SE('set');
const SOLIDCOLOR           = SE('solidColor');
const STOP                 = SE('stop');
const SVG                  = SE('svg');
const SWITCH               = SE('switch');
const SYMBOL               = SE('symbol');
const TBREAK               = SE('tbreak');
const TEXT                 = SE('text');
const TEXTPATH             = SE('textpath');
const TREF                 = SE('tref');
const TSPAN                = SE('tspan');
const UNKNOWN              = SE('unknown');
const USE                  = SE('use');
const VIEW                 = SE('view');
const VKERN                = SE('vKern');

const SVG_RE = new RegExp(`^(${SVG_ELEMENT_NAMES.join('|')})$`, 'i');

function isSVGElement(tagName) {
  return SVG_RE.test(tagName);
}


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

  set attr$lang([ oldValue, newValue ]) {
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

      console.log('Compiled terms: ', compiledTerms);

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
          property.set(value);
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
          preProcessTemplate: ({ template, children }) => {
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

  set attr$kind([ _, newValue ]) {
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

      let result = options.callback.call(this, _elements_js__WEBPACK_IMPORTED_MODULE_1__, options);
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
/* harmony export */   NOE: () => (/* binding */ NOE),
/* harmony export */   SHA256: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_0__.SHA256),
/* harmony export */   bindEventToElement: () => (/* binding */ bindEventToElement),
/* harmony export */   bindMethods: () => (/* binding */ bindMethods),
/* harmony export */   coerce: () => (/* binding */ coerce),
/* harmony export */   createDynamicPropertyFetcher: () => (/* binding */ createDynamicPropertyFetcher),
/* harmony export */   createEventCallback: () => (/* binding */ createEventCallback),
/* harmony export */   createProxyContext: () => (/* binding */ createProxyContext),
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   fetchPath: () => (/* binding */ fetchPath),
/* harmony export */   formatTerm: () => (/* binding */ formatTerm),
/* harmony export */   generateID: () => (/* binding */ generateID),
/* harmony export */   getAllEventNamesForElement: () => (/* binding */ getAllEventNamesForElement),
/* harmony export */   getAllPropertyNames: () => (/* binding */ getAllPropertyNames),
/* harmony export */   getDynamicPropertyForPath: () => (/* binding */ getDynamicPropertyForPath),
/* harmony export */   getObjID: () => (/* binding */ getObjID),
/* harmony export */   isCollectable: () => (/* binding */ isCollectable),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   notNOE: () => (/* binding */ notNOE),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   specialClosest: () => (/* binding */ specialClosest),
/* harmony export */   stringIsDynamicBindingTemplate: () => (/* binding */ stringIsDynamicBindingTemplate),
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
/* harmony export */   toSnakeCase: () => (/* binding */ toSnakeCase),
/* harmony export */   typeOf: () => (/* binding */ typeOf)
/* harmony export */ });
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256.js */ "./lib/sha256.js");




function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

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
  if (!isCollectable(target))
    throw new Error(`Unable to set metadata on provided object: ${(typeof target === 'symbol') ? target.toString() : target}`);

  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    data = new Map();
    METADATA_WEAKMAP.set(target, data);
  }

  if (arguments.length === 1)
    return data;

  if (arguments.length === 2)
    return data.get(key);

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

const DYNAMIC_PROPERTY_GC_TIME = 10000;

class DynamicProperty {
  constructor(getter, setter) {
    if (typeof getter !== 'function')
      throw new TypeError('"getter" (first) argument must be a function');

    if (typeof setter !== 'function')
      throw new TypeError('"setter" (second) argument must be a function');

    Object.defineProperties(this, {
      'value': {
        enumerable:   false,
        configurable: true,
        get:          getter,
        set:          setter,
      },
      'registeredNodes': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        [],
      },
      'cleanMemoryTimer': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        null,
      },
      'isSetting': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        false,
      },
    });
  }

  toString() {
    let value = this.value;
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  freeDeadReferences() {
    // clear dead nodes
    this.registeredNodes = this.registeredNodes.filter((entry) => !!entry.ref.deref());

    clearTimeout(this.cleanMemoryTimer);
    this.cleanMemoryTimer = null;

    if (this.registeredNodes.length) {
      let randomness = (Math.random() * DYNAMIC_PROPERTY_GC_TIME);
      this.cleanMemoryTimer = setTimeout(() => this.freeDeadReferences(), Math.round(DYNAMIC_PROPERTY_GC_TIME + randomness));
    }
  }

  set(newValue) {
    if (this.isSetting)
      return;

    if (this.value === newValue)
      return;

    try {
      this.isSetting = true;
      this.value = newValue;
    } catch (error) {
      console.error(error);
    } finally {
      this.isSetting = false;
    }

    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(() => this.triggerUpdates());
    } else {
      (new Promise((resolve) => {
        resolve();
      })).then(() => this.triggerUpdates());
    }
  }

  triggerUpdates() {
    for (let { ref, callback } of this.registeredNodes) {
      let node = ref.deref();
      if (!node)
        continue;

      let newValue = callback();
      node.nodeValue = newValue;
    }
  }

  registerForUpdate(node, callback) {
    let exists = this.registeredNodes.find((entry) => (entry.ref.deref() === node));
    if (exists)
      return;

    let ref = new WeakRef(node);
    this.registeredNodes.push({ ref, callback });

    this.freeDeadReferences();
  }
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
const VALID_JS_IDENTIFIER         = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function getContextCallArgs(context) {
  let contextCallArgs = getAllPropertyNames(context).filter((name) => VALID_JS_IDENTIFIER.test(name));
  contextCallArgs = Array.from(new Set(contextCallArgs.concat([ 'attributes', 'classList' ])));

  return `{${contextCallArgs.filter((name) => !(/^(i18n|\$\$)$/).test(name)).join(',')}}`;
}

function createProxyContext(parentElement, context) {
  const findPropNameScope = (target, propName) => {
    if (propName in target)
      return target;

    if (!parentElement)
      return;

    const getParentNode = (element) => {
      if (!element)
        return null;

      if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
        return metadata(element, '_mythixUIShadowParent');

      return element.parentNode;
    };

    const findParentContext = (parentElement) => {
      let currentParent = parentElement;
      if (!currentParent)
        return;

      let componentPublishContext = currentParent.publishContext;
      while (currentParent) {
        if (propName in currentParent)
          return currentParent;

        if (typeof(componentPublishContext = currentParent.publishContext) === 'function')
          break;

        currentParent = getParentNode(currentParent);
      }

      if (!componentPublishContext)
        return;

      let publishedContext = componentPublishContext.call(currentParent);
      if (!(propName in publishedContext) && currentParent)
        return findParentContext(getParentNode(currentParent));

      return publishedContext;
    };

    let parentContext = findParentContext(parentElement);
    return parentContext;
  };

  return new Proxy(context, {
    get: (target, propName) => {
      let scope = findPropNameScope(target, propName);
      if (!scope)
        return;

      return scope[propName];
    },
    set: (target, propName, value) => {
      let scope = findPropNameScope(target, propName);
      if (!scope) {
        target[propName] = value;
        return true;
      }

      scope[propName] = value;
      return true;
    },
  });
}

function createDynamicPropertyFetcher(context, _functionBody, _contextCallArgs) {
  let contextCallArgs = (_contextCallArgs) ? _contextCallArgs : getContextCallArgs(context, (context instanceof Node));
  let functionBody    = `let C=arguments[3],$$=((C.$$)?C.$$:createProxyContext(C, { context: C, $$: C })),i18n=$$.i18n||((path,d)=>getDynamicPropertyForPath.call(specialClosest(C,'mythix-language-provider')||C,\`global.i18n.\${path}\`,d));if($$.i18n==null)$$.i18n=i18n;return ${_functionBody.replace(/^\s*return\s+/, '').trim()};`;
  return (new Function('getDynamicPropertyForPath', 'specialClosest', 'createProxyContext', contextCallArgs, functionBody)).bind(context, getDynamicPropertyForPath, specialClosest, createProxyContext);
}

function formatTerm(context, _text) {
  let text = _text;
  let node;

  if (text instanceof Node) {
    node = text;
    if (FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
      throw new TypeError('"formatTerm" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

    text = node.nodeValue;
  }

  let contextCallArgs = getContextCallArgs(context);
  let result          = text.replace(/(?:^@@|([^\\])@@)(.+?)@@/g, (m, start, macro) => {
    const fetcher = createDynamicPropertyFetcher(context, macro, contextCallArgs);
    let value = fetcher(context);
    if (value == null)
      value = '';

    if (node && value instanceof DynamicProperty) {
      value.registerForUpdate(node, () => {
        let result = formatTerm(context, text);
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

const EVENT_ACTION_JUST_NAME = /^[\w.$]+$/;
function createEventCallback(_functionBody) {
  let functionBody = _functionBody;
  if (EVENT_ACTION_JUST_NAME.test(functionBody))
    functionBody = `this.${functionBody}(event)`;

  return (new Function('event', `let e=event,ev=event,evt=event;return ${functionBody.replace(/^\s*return\s*/, '').trim()};`)).bind(createProxyContext(this, {context: this, $$: this}));
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

function bindEventToElement(context, element, eventName, _callback) {
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
    callback = createEventCallback.call(context, callback);

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
    let value = defaultValue;

    property = new DynamicProperty(() => value, (newValue) => {
      value = newValue;
    });

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
      return metadata(element, '_mythixUIShadowParent');

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
/* harmony export */   A: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.A),
/* harmony export */   ABBR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ABBR),
/* harmony export */   ADDRESS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ADDRESS),
/* harmony export */   ALTGLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ALTGLYPH),
/* harmony export */   ALTGLYPHDEF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ALTGLYPHDEF),
/* harmony export */   ALTGLYPHITEM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ALTGLYPHITEM),
/* harmony export */   ANIMATE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ANIMATE),
/* harmony export */   ANIMATECOLOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ANIMATECOLOR),
/* harmony export */   ANIMATEMOTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ANIMATEMOTION),
/* harmony export */   ANIMATETRANSFORM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ANIMATETRANSFORM),
/* harmony export */   ANIMATION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ANIMATION),
/* harmony export */   AREA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.AREA),
/* harmony export */   ARTICLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ARTICLE),
/* harmony export */   ASIDE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ASIDE),
/* harmony export */   AUDIO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.AUDIO),
/* harmony export */   B: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.B),
/* harmony export */   BASE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BASE),
/* harmony export */   BDI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BDI),
/* harmony export */   BDO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BDO),
/* harmony export */   BLOCKQUOTE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BLOCKQUOTE),
/* harmony export */   BR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BR),
/* harmony export */   BUTTON: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.BUTTON),
/* harmony export */   CANVAS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CANVAS),
/* harmony export */   CAPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CAPTION),
/* harmony export */   CIRCLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CIRCLE),
/* harmony export */   CITE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CITE),
/* harmony export */   CLIPPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CLIPPATH),
/* harmony export */   CODE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CODE),
/* harmony export */   COL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.COL),
/* harmony export */   COLGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.COLGROUP),
/* harmony export */   COLORPROFILE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.COLORPROFILE),
/* harmony export */   CURSOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.CURSOR),
/* harmony export */   DATA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DATA),
/* harmony export */   DATALIST: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DATALIST),
/* harmony export */   DD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DD),
/* harmony export */   DEFS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DEFS),
/* harmony export */   DEL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DEL),
/* harmony export */   DESC: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DESC),
/* harmony export */   DETAILS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DETAILS),
/* harmony export */   DFN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DFN),
/* harmony export */   DIALOG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DIALOG),
/* harmony export */   DISCARD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DISCARD),
/* harmony export */   DIV: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DIV),
/* harmony export */   DL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DL),
/* harmony export */   DT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.DT),
/* harmony export */   ELEMENT_NAMES: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ELEMENT_NAMES),
/* harmony export */   ELLIPSE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ELLIPSE),
/* harmony export */   EM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.EM),
/* harmony export */   EMBED: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.EMBED),
/* harmony export */   ElementDefinition: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.ElementDefinition),
/* harmony export */   FEBLEND: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEBLEND),
/* harmony export */   FECOLORMATRIX: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FECOLORMATRIX),
/* harmony export */   FECOMPONENTTRANSFER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FECOMPONENTTRANSFER),
/* harmony export */   FECOMPOSITE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FECOMPOSITE),
/* harmony export */   FECONVOLVEMATRIX: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FECONVOLVEMATRIX),
/* harmony export */   FEDIFFUSELIGHTING: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEDIFFUSELIGHTING),
/* harmony export */   FEDISPLACEMENTMAP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEDISPLACEMENTMAP),
/* harmony export */   FEDISTANTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEDISTANTLIGHT),
/* harmony export */   FEDROPSHADOW: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEDROPSHADOW),
/* harmony export */   FEFLOOD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEFLOOD),
/* harmony export */   FEFUNCA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEFUNCA),
/* harmony export */   FEFUNCB: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEFUNCB),
/* harmony export */   FEFUNCG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEFUNCG),
/* harmony export */   FEFUNCR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEFUNCR),
/* harmony export */   FEGAUSSIANBLUR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEGAUSSIANBLUR),
/* harmony export */   FEIMAGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEIMAGE),
/* harmony export */   FEMERGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEMERGE),
/* harmony export */   FEMERGENODE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEMERGENODE),
/* harmony export */   FEMORPHOLOGY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEMORPHOLOGY),
/* harmony export */   FEOFFSET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEOFFSET),
/* harmony export */   FEPOINTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FEPOINTLIGHT),
/* harmony export */   FESPECULARLIGHTING: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FESPECULARLIGHTING),
/* harmony export */   FESPOTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FESPOTLIGHT),
/* harmony export */   FETILE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FETILE),
/* harmony export */   FETURBULENCE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FETURBULENCE),
/* harmony export */   FIELDSET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FIELDSET),
/* harmony export */   FIGCAPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FIGCAPTION),
/* harmony export */   FIGURE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FIGURE),
/* harmony export */   FILTER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FILTER),
/* harmony export */   FONT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONT),
/* harmony export */   FONTFACE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONTFACE),
/* harmony export */   FONTFACEFORMAT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONTFACEFORMAT),
/* harmony export */   FONTFACENAME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONTFACENAME),
/* harmony export */   FONTFACESRC: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONTFACESRC),
/* harmony export */   FONTFACEURI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FONTFACEURI),
/* harmony export */   FOOTER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FOOTER),
/* harmony export */   FOREIGNOBJECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FOREIGNOBJECT),
/* harmony export */   FORM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.FORM),
/* harmony export */   G: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.G),
/* harmony export */   GLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.GLYPH),
/* harmony export */   GLYPHREF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.GLYPHREF),
/* harmony export */   H1: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H1),
/* harmony export */   H2: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H2),
/* harmony export */   H3: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H3),
/* harmony export */   H4: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H4),
/* harmony export */   H5: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H5),
/* harmony export */   H6: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.H6),
/* harmony export */   HANDLER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.HANDLER),
/* harmony export */   HEADER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.HEADER),
/* harmony export */   HGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.HGROUP),
/* harmony export */   HKERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.HKERN),
/* harmony export */   HR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.HR),
/* harmony export */   I: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.I),
/* harmony export */   IFRAME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.IFRAME),
/* harmony export */   IMAGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.IMAGE),
/* harmony export */   IMG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.IMG),
/* harmony export */   INPUT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.INPUT),
/* harmony export */   INS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.INS),
/* harmony export */   KBD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.KBD),
/* harmony export */   LABEL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LABEL),
/* harmony export */   LEGEND: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LEGEND),
/* harmony export */   LI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LI),
/* harmony export */   LINE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LINE),
/* harmony export */   LINEARGRADIENT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LINEARGRADIENT),
/* harmony export */   LINK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LINK),
/* harmony export */   LISTENER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.LISTENER),
/* harmony export */   MAIN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MAIN),
/* harmony export */   MAP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MAP),
/* harmony export */   MARK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MARK),
/* harmony export */   MARKER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MARKER),
/* harmony export */   MASK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MASK),
/* harmony export */   MENU: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MENU),
/* harmony export */   META: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.META),
/* harmony export */   METADATA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.METADATA),
/* harmony export */   METER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.METER),
/* harmony export */   MISSINGGLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MISSINGGLYPH),
/* harmony export */   MPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.MPATH),
/* harmony export */   MythixUIComponent: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent),
/* harmony export */   MythixUILanguageProvider: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__.MythixUILanguageProvider),
/* harmony export */   MythixUIRequire: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIRequire),
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__.MythixUISpinner),
/* harmony export */   NAV: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.NAV),
/* harmony export */   NOSCRIPT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.NOSCRIPT),
/* harmony export */   OBJECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.OBJECT),
/* harmony export */   OL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.OL),
/* harmony export */   OPTGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.OPTGROUP),
/* harmony export */   OPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.OPTION),
/* harmony export */   OUTPUT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.OUTPUT),
/* harmony export */   P: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.P),
/* harmony export */   PATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PATH),
/* harmony export */   PATTERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PATTERN),
/* harmony export */   PICTURE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PICTURE),
/* harmony export */   POLYGON: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.POLYGON),
/* harmony export */   POLYLINE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.POLYLINE),
/* harmony export */   PRE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PRE),
/* harmony export */   PREFETCH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PREFETCH),
/* harmony export */   PROGRESS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.PROGRESS),
/* harmony export */   Q: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.Q),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine),
/* harmony export */   RADIALGRADIENT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.RADIALGRADIENT),
/* harmony export */   RECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.RECT),
/* harmony export */   RP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.RP),
/* harmony export */   RT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.RT),
/* harmony export */   RUBY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.RUBY),
/* harmony export */   S: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.S),
/* harmony export */   SAMP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SAMP),
/* harmony export */   SCRIPT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SCRIPT),
/* harmony export */   SECTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SECTION),
/* harmony export */   SELECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SELECT),
/* harmony export */   SET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SET),
/* harmony export */   SLOT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SLOT),
/* harmony export */   SMALL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SMALL),
/* harmony export */   SOLIDCOLOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SOLIDCOLOR),
/* harmony export */   SOURCE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SOURCE),
/* harmony export */   SPAN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SPAN),
/* harmony export */   STOP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.STOP),
/* harmony export */   STRONG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.STRONG),
/* harmony export */   STYLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.STYLE),
/* harmony export */   SUB: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SUB),
/* harmony export */   SUMMARY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SUMMARY),
/* harmony export */   SUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SUP),
/* harmony export */   SVG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SVG),
/* harmony export */   SVG_ELEMENT_NAMES: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SVG_ELEMENT_NAMES),
/* harmony export */   SWITCH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SWITCH),
/* harmony export */   SYMBOL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.SYMBOL),
/* harmony export */   TABLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TABLE),
/* harmony export */   TBODY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TBODY),
/* harmony export */   TBREAK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TBREAK),
/* harmony export */   TD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TD),
/* harmony export */   TEMPLATE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TEMPLATE),
/* harmony export */   TEXT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TEXT),
/* harmony export */   TEXTAREA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TEXTAREA),
/* harmony export */   TEXTPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TEXTPATH),
/* harmony export */   TFOOT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TFOOT),
/* harmony export */   TH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TH),
/* harmony export */   THEAD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.THEAD),
/* harmony export */   TIME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TIME),
/* harmony export */   TITLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TITLE),
/* harmony export */   TR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TR),
/* harmony export */   TRACK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TRACK),
/* harmony export */   TREF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TREF),
/* harmony export */   TSPAN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.TSPAN),
/* harmony export */   Term: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.Term),
/* harmony export */   U: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.U),
/* harmony export */   UL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.UL),
/* harmony export */   UNFINISHED_DEFINITION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.UNFINISHED_DEFINITION),
/* harmony export */   UNKNOWN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.UNKNOWN),
/* harmony export */   USE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.USE),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   VAR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.VAR),
/* harmony export */   VIDEO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.VIDEO),
/* harmony export */   VIEW: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.VIEW),
/* harmony export */   VKERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.VKERN),
/* harmony export */   WBR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.WBR),
/* harmony export */   build: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.build),
/* harmony export */   getVisibilityMeta: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.getVisibilityMeta),
/* harmony export */   importIntoDocumentFromSource: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.importIntoDocumentFromSource),
/* harmony export */   isSVGElement: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_2__.isSVGElement),
/* harmony export */   loadPartialIntoElement: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement),
/* harmony export */   recursivelyBindDynamicData: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.recursivelyBindDynamicData),
/* harmony export */   remapNodeTree: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.remapNodeTree),
/* harmony export */   require: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.require),
/* harmony export */   resolveURL: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.resolveURL),
/* harmony export */   visibilityObserver: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-language-provider.js */ "./lib/mythix-ui-language-provider.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});














globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Components = _component_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_2__;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
    _component_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver(({ disconnect, element, wasVisible }) => {
      if (wasVisible)
        return;

      let src = element.getAttribute('data-mythix-src');
      if (!src)
        return;

      disconnect();

      _component_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement.call(element, src);
    }, { elements });
  });

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
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation = mutations[i];
      if (mutation.type === 'attributes') {
        let attributeNode = mutation.target.getAttributeNode(mutation.attributeName);
        let newValue      = attributeNode.nodeValue;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.stringIsDynamicBindingTemplate(newValue))
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(mutation.target, attributeNode);
      } else if (mutation.type === 'childList') {
        let addedNodes = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];
          _component_js__WEBPACK_IMPORTED_MODULE_1__.recursivelyBindDynamicData(mutation.target, node);
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
}

})();

var __webpack_exports__A = __webpack_exports__.A;
var __webpack_exports__ABBR = __webpack_exports__.ABBR;
var __webpack_exports__ADDRESS = __webpack_exports__.ADDRESS;
var __webpack_exports__ALTGLYPH = __webpack_exports__.ALTGLYPH;
var __webpack_exports__ALTGLYPHDEF = __webpack_exports__.ALTGLYPHDEF;
var __webpack_exports__ALTGLYPHITEM = __webpack_exports__.ALTGLYPHITEM;
var __webpack_exports__ANIMATE = __webpack_exports__.ANIMATE;
var __webpack_exports__ANIMATECOLOR = __webpack_exports__.ANIMATECOLOR;
var __webpack_exports__ANIMATEMOTION = __webpack_exports__.ANIMATEMOTION;
var __webpack_exports__ANIMATETRANSFORM = __webpack_exports__.ANIMATETRANSFORM;
var __webpack_exports__ANIMATION = __webpack_exports__.ANIMATION;
var __webpack_exports__AREA = __webpack_exports__.AREA;
var __webpack_exports__ARTICLE = __webpack_exports__.ARTICLE;
var __webpack_exports__ASIDE = __webpack_exports__.ASIDE;
var __webpack_exports__AUDIO = __webpack_exports__.AUDIO;
var __webpack_exports__B = __webpack_exports__.B;
var __webpack_exports__BASE = __webpack_exports__.BASE;
var __webpack_exports__BDI = __webpack_exports__.BDI;
var __webpack_exports__BDO = __webpack_exports__.BDO;
var __webpack_exports__BLOCKQUOTE = __webpack_exports__.BLOCKQUOTE;
var __webpack_exports__BR = __webpack_exports__.BR;
var __webpack_exports__BUTTON = __webpack_exports__.BUTTON;
var __webpack_exports__CANVAS = __webpack_exports__.CANVAS;
var __webpack_exports__CAPTION = __webpack_exports__.CAPTION;
var __webpack_exports__CIRCLE = __webpack_exports__.CIRCLE;
var __webpack_exports__CITE = __webpack_exports__.CITE;
var __webpack_exports__CLIPPATH = __webpack_exports__.CLIPPATH;
var __webpack_exports__CODE = __webpack_exports__.CODE;
var __webpack_exports__COL = __webpack_exports__.COL;
var __webpack_exports__COLGROUP = __webpack_exports__.COLGROUP;
var __webpack_exports__COLORPROFILE = __webpack_exports__.COLORPROFILE;
var __webpack_exports__CURSOR = __webpack_exports__.CURSOR;
var __webpack_exports__DATA = __webpack_exports__.DATA;
var __webpack_exports__DATALIST = __webpack_exports__.DATALIST;
var __webpack_exports__DD = __webpack_exports__.DD;
var __webpack_exports__DEFS = __webpack_exports__.DEFS;
var __webpack_exports__DEL = __webpack_exports__.DEL;
var __webpack_exports__DESC = __webpack_exports__.DESC;
var __webpack_exports__DETAILS = __webpack_exports__.DETAILS;
var __webpack_exports__DFN = __webpack_exports__.DFN;
var __webpack_exports__DIALOG = __webpack_exports__.DIALOG;
var __webpack_exports__DISCARD = __webpack_exports__.DISCARD;
var __webpack_exports__DIV = __webpack_exports__.DIV;
var __webpack_exports__DL = __webpack_exports__.DL;
var __webpack_exports__DT = __webpack_exports__.DT;
var __webpack_exports__ELEMENT_NAMES = __webpack_exports__.ELEMENT_NAMES;
var __webpack_exports__ELLIPSE = __webpack_exports__.ELLIPSE;
var __webpack_exports__EM = __webpack_exports__.EM;
var __webpack_exports__EMBED = __webpack_exports__.EMBED;
var __webpack_exports__ElementDefinition = __webpack_exports__.ElementDefinition;
var __webpack_exports__FEBLEND = __webpack_exports__.FEBLEND;
var __webpack_exports__FECOLORMATRIX = __webpack_exports__.FECOLORMATRIX;
var __webpack_exports__FECOMPONENTTRANSFER = __webpack_exports__.FECOMPONENTTRANSFER;
var __webpack_exports__FECOMPOSITE = __webpack_exports__.FECOMPOSITE;
var __webpack_exports__FECONVOLVEMATRIX = __webpack_exports__.FECONVOLVEMATRIX;
var __webpack_exports__FEDIFFUSELIGHTING = __webpack_exports__.FEDIFFUSELIGHTING;
var __webpack_exports__FEDISPLACEMENTMAP = __webpack_exports__.FEDISPLACEMENTMAP;
var __webpack_exports__FEDISTANTLIGHT = __webpack_exports__.FEDISTANTLIGHT;
var __webpack_exports__FEDROPSHADOW = __webpack_exports__.FEDROPSHADOW;
var __webpack_exports__FEFLOOD = __webpack_exports__.FEFLOOD;
var __webpack_exports__FEFUNCA = __webpack_exports__.FEFUNCA;
var __webpack_exports__FEFUNCB = __webpack_exports__.FEFUNCB;
var __webpack_exports__FEFUNCG = __webpack_exports__.FEFUNCG;
var __webpack_exports__FEFUNCR = __webpack_exports__.FEFUNCR;
var __webpack_exports__FEGAUSSIANBLUR = __webpack_exports__.FEGAUSSIANBLUR;
var __webpack_exports__FEIMAGE = __webpack_exports__.FEIMAGE;
var __webpack_exports__FEMERGE = __webpack_exports__.FEMERGE;
var __webpack_exports__FEMERGENODE = __webpack_exports__.FEMERGENODE;
var __webpack_exports__FEMORPHOLOGY = __webpack_exports__.FEMORPHOLOGY;
var __webpack_exports__FEOFFSET = __webpack_exports__.FEOFFSET;
var __webpack_exports__FEPOINTLIGHT = __webpack_exports__.FEPOINTLIGHT;
var __webpack_exports__FESPECULARLIGHTING = __webpack_exports__.FESPECULARLIGHTING;
var __webpack_exports__FESPOTLIGHT = __webpack_exports__.FESPOTLIGHT;
var __webpack_exports__FETILE = __webpack_exports__.FETILE;
var __webpack_exports__FETURBULENCE = __webpack_exports__.FETURBULENCE;
var __webpack_exports__FIELDSET = __webpack_exports__.FIELDSET;
var __webpack_exports__FIGCAPTION = __webpack_exports__.FIGCAPTION;
var __webpack_exports__FIGURE = __webpack_exports__.FIGURE;
var __webpack_exports__FILTER = __webpack_exports__.FILTER;
var __webpack_exports__FONT = __webpack_exports__.FONT;
var __webpack_exports__FONTFACE = __webpack_exports__.FONTFACE;
var __webpack_exports__FONTFACEFORMAT = __webpack_exports__.FONTFACEFORMAT;
var __webpack_exports__FONTFACENAME = __webpack_exports__.FONTFACENAME;
var __webpack_exports__FONTFACESRC = __webpack_exports__.FONTFACESRC;
var __webpack_exports__FONTFACEURI = __webpack_exports__.FONTFACEURI;
var __webpack_exports__FOOTER = __webpack_exports__.FOOTER;
var __webpack_exports__FOREIGNOBJECT = __webpack_exports__.FOREIGNOBJECT;
var __webpack_exports__FORM = __webpack_exports__.FORM;
var __webpack_exports__G = __webpack_exports__.G;
var __webpack_exports__GLYPH = __webpack_exports__.GLYPH;
var __webpack_exports__GLYPHREF = __webpack_exports__.GLYPHREF;
var __webpack_exports__H1 = __webpack_exports__.H1;
var __webpack_exports__H2 = __webpack_exports__.H2;
var __webpack_exports__H3 = __webpack_exports__.H3;
var __webpack_exports__H4 = __webpack_exports__.H4;
var __webpack_exports__H5 = __webpack_exports__.H5;
var __webpack_exports__H6 = __webpack_exports__.H6;
var __webpack_exports__HANDLER = __webpack_exports__.HANDLER;
var __webpack_exports__HEADER = __webpack_exports__.HEADER;
var __webpack_exports__HGROUP = __webpack_exports__.HGROUP;
var __webpack_exports__HKERN = __webpack_exports__.HKERN;
var __webpack_exports__HR = __webpack_exports__.HR;
var __webpack_exports__I = __webpack_exports__.I;
var __webpack_exports__IFRAME = __webpack_exports__.IFRAME;
var __webpack_exports__IMAGE = __webpack_exports__.IMAGE;
var __webpack_exports__IMG = __webpack_exports__.IMG;
var __webpack_exports__INPUT = __webpack_exports__.INPUT;
var __webpack_exports__INS = __webpack_exports__.INS;
var __webpack_exports__KBD = __webpack_exports__.KBD;
var __webpack_exports__LABEL = __webpack_exports__.LABEL;
var __webpack_exports__LEGEND = __webpack_exports__.LEGEND;
var __webpack_exports__LI = __webpack_exports__.LI;
var __webpack_exports__LINE = __webpack_exports__.LINE;
var __webpack_exports__LINEARGRADIENT = __webpack_exports__.LINEARGRADIENT;
var __webpack_exports__LINK = __webpack_exports__.LINK;
var __webpack_exports__LISTENER = __webpack_exports__.LISTENER;
var __webpack_exports__MAIN = __webpack_exports__.MAIN;
var __webpack_exports__MAP = __webpack_exports__.MAP;
var __webpack_exports__MARK = __webpack_exports__.MARK;
var __webpack_exports__MARKER = __webpack_exports__.MARKER;
var __webpack_exports__MASK = __webpack_exports__.MASK;
var __webpack_exports__MENU = __webpack_exports__.MENU;
var __webpack_exports__META = __webpack_exports__.META;
var __webpack_exports__METADATA = __webpack_exports__.METADATA;
var __webpack_exports__METER = __webpack_exports__.METER;
var __webpack_exports__MISSINGGLYPH = __webpack_exports__.MISSINGGLYPH;
var __webpack_exports__MPATH = __webpack_exports__.MPATH;
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__MythixUILanguageProvider = __webpack_exports__.MythixUILanguageProvider;
var __webpack_exports__MythixUIRequire = __webpack_exports__.MythixUIRequire;
var __webpack_exports__MythixUISpinner = __webpack_exports__.MythixUISpinner;
var __webpack_exports__NAV = __webpack_exports__.NAV;
var __webpack_exports__NOSCRIPT = __webpack_exports__.NOSCRIPT;
var __webpack_exports__OBJECT = __webpack_exports__.OBJECT;
var __webpack_exports__OL = __webpack_exports__.OL;
var __webpack_exports__OPTGROUP = __webpack_exports__.OPTGROUP;
var __webpack_exports__OPTION = __webpack_exports__.OPTION;
var __webpack_exports__OUTPUT = __webpack_exports__.OUTPUT;
var __webpack_exports__P = __webpack_exports__.P;
var __webpack_exports__PATH = __webpack_exports__.PATH;
var __webpack_exports__PATTERN = __webpack_exports__.PATTERN;
var __webpack_exports__PICTURE = __webpack_exports__.PICTURE;
var __webpack_exports__POLYGON = __webpack_exports__.POLYGON;
var __webpack_exports__POLYLINE = __webpack_exports__.POLYLINE;
var __webpack_exports__PRE = __webpack_exports__.PRE;
var __webpack_exports__PREFETCH = __webpack_exports__.PREFETCH;
var __webpack_exports__PROGRESS = __webpack_exports__.PROGRESS;
var __webpack_exports__Q = __webpack_exports__.Q;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__RADIALGRADIENT = __webpack_exports__.RADIALGRADIENT;
var __webpack_exports__RECT = __webpack_exports__.RECT;
var __webpack_exports__RP = __webpack_exports__.RP;
var __webpack_exports__RT = __webpack_exports__.RT;
var __webpack_exports__RUBY = __webpack_exports__.RUBY;
var __webpack_exports__S = __webpack_exports__.S;
var __webpack_exports__SAMP = __webpack_exports__.SAMP;
var __webpack_exports__SCRIPT = __webpack_exports__.SCRIPT;
var __webpack_exports__SECTION = __webpack_exports__.SECTION;
var __webpack_exports__SELECT = __webpack_exports__.SELECT;
var __webpack_exports__SET = __webpack_exports__.SET;
var __webpack_exports__SLOT = __webpack_exports__.SLOT;
var __webpack_exports__SMALL = __webpack_exports__.SMALL;
var __webpack_exports__SOLIDCOLOR = __webpack_exports__.SOLIDCOLOR;
var __webpack_exports__SOURCE = __webpack_exports__.SOURCE;
var __webpack_exports__SPAN = __webpack_exports__.SPAN;
var __webpack_exports__STOP = __webpack_exports__.STOP;
var __webpack_exports__STRONG = __webpack_exports__.STRONG;
var __webpack_exports__STYLE = __webpack_exports__.STYLE;
var __webpack_exports__SUB = __webpack_exports__.SUB;
var __webpack_exports__SUMMARY = __webpack_exports__.SUMMARY;
var __webpack_exports__SUP = __webpack_exports__.SUP;
var __webpack_exports__SVG = __webpack_exports__.SVG;
var __webpack_exports__SVG_ELEMENT_NAMES = __webpack_exports__.SVG_ELEMENT_NAMES;
var __webpack_exports__SWITCH = __webpack_exports__.SWITCH;
var __webpack_exports__SYMBOL = __webpack_exports__.SYMBOL;
var __webpack_exports__TABLE = __webpack_exports__.TABLE;
var __webpack_exports__TBODY = __webpack_exports__.TBODY;
var __webpack_exports__TBREAK = __webpack_exports__.TBREAK;
var __webpack_exports__TD = __webpack_exports__.TD;
var __webpack_exports__TEMPLATE = __webpack_exports__.TEMPLATE;
var __webpack_exports__TEXT = __webpack_exports__.TEXT;
var __webpack_exports__TEXTAREA = __webpack_exports__.TEXTAREA;
var __webpack_exports__TEXTPATH = __webpack_exports__.TEXTPATH;
var __webpack_exports__TFOOT = __webpack_exports__.TFOOT;
var __webpack_exports__TH = __webpack_exports__.TH;
var __webpack_exports__THEAD = __webpack_exports__.THEAD;
var __webpack_exports__TIME = __webpack_exports__.TIME;
var __webpack_exports__TITLE = __webpack_exports__.TITLE;
var __webpack_exports__TR = __webpack_exports__.TR;
var __webpack_exports__TRACK = __webpack_exports__.TRACK;
var __webpack_exports__TREF = __webpack_exports__.TREF;
var __webpack_exports__TSPAN = __webpack_exports__.TSPAN;
var __webpack_exports__Term = __webpack_exports__.Term;
var __webpack_exports__U = __webpack_exports__.U;
var __webpack_exports__UL = __webpack_exports__.UL;
var __webpack_exports__UNFINISHED_DEFINITION = __webpack_exports__.UNFINISHED_DEFINITION;
var __webpack_exports__UNKNOWN = __webpack_exports__.UNKNOWN;
var __webpack_exports__USE = __webpack_exports__.USE;
var __webpack_exports__Utils = __webpack_exports__.Utils;
var __webpack_exports__VAR = __webpack_exports__.VAR;
var __webpack_exports__VIDEO = __webpack_exports__.VIDEO;
var __webpack_exports__VIEW = __webpack_exports__.VIEW;
var __webpack_exports__VKERN = __webpack_exports__.VKERN;
var __webpack_exports__WBR = __webpack_exports__.WBR;
var __webpack_exports__build = __webpack_exports__.build;
var __webpack_exports__getVisibilityMeta = __webpack_exports__.getVisibilityMeta;
var __webpack_exports__importIntoDocumentFromSource = __webpack_exports__.importIntoDocumentFromSource;
var __webpack_exports__isSVGElement = __webpack_exports__.isSVGElement;
var __webpack_exports__loadPartialIntoElement = __webpack_exports__.loadPartialIntoElement;
var __webpack_exports__recursivelyBindDynamicData = __webpack_exports__.recursivelyBindDynamicData;
var __webpack_exports__remapNodeTree = __webpack_exports__.remapNodeTree;
var __webpack_exports__require = __webpack_exports__.require;
var __webpack_exports__resolveURL = __webpack_exports__.resolveURL;
var __webpack_exports__visibilityObserver = __webpack_exports__.visibilityObserver;
export { __webpack_exports__A as A, __webpack_exports__ABBR as ABBR, __webpack_exports__ADDRESS as ADDRESS, __webpack_exports__ALTGLYPH as ALTGLYPH, __webpack_exports__ALTGLYPHDEF as ALTGLYPHDEF, __webpack_exports__ALTGLYPHITEM as ALTGLYPHITEM, __webpack_exports__ANIMATE as ANIMATE, __webpack_exports__ANIMATECOLOR as ANIMATECOLOR, __webpack_exports__ANIMATEMOTION as ANIMATEMOTION, __webpack_exports__ANIMATETRANSFORM as ANIMATETRANSFORM, __webpack_exports__ANIMATION as ANIMATION, __webpack_exports__AREA as AREA, __webpack_exports__ARTICLE as ARTICLE, __webpack_exports__ASIDE as ASIDE, __webpack_exports__AUDIO as AUDIO, __webpack_exports__B as B, __webpack_exports__BASE as BASE, __webpack_exports__BDI as BDI, __webpack_exports__BDO as BDO, __webpack_exports__BLOCKQUOTE as BLOCKQUOTE, __webpack_exports__BR as BR, __webpack_exports__BUTTON as BUTTON, __webpack_exports__CANVAS as CANVAS, __webpack_exports__CAPTION as CAPTION, __webpack_exports__CIRCLE as CIRCLE, __webpack_exports__CITE as CITE, __webpack_exports__CLIPPATH as CLIPPATH, __webpack_exports__CODE as CODE, __webpack_exports__COL as COL, __webpack_exports__COLGROUP as COLGROUP, __webpack_exports__COLORPROFILE as COLORPROFILE, __webpack_exports__CURSOR as CURSOR, __webpack_exports__DATA as DATA, __webpack_exports__DATALIST as DATALIST, __webpack_exports__DD as DD, __webpack_exports__DEFS as DEFS, __webpack_exports__DEL as DEL, __webpack_exports__DESC as DESC, __webpack_exports__DETAILS as DETAILS, __webpack_exports__DFN as DFN, __webpack_exports__DIALOG as DIALOG, __webpack_exports__DISCARD as DISCARD, __webpack_exports__DIV as DIV, __webpack_exports__DL as DL, __webpack_exports__DT as DT, __webpack_exports__ELEMENT_NAMES as ELEMENT_NAMES, __webpack_exports__ELLIPSE as ELLIPSE, __webpack_exports__EM as EM, __webpack_exports__EMBED as EMBED, __webpack_exports__ElementDefinition as ElementDefinition, __webpack_exports__FEBLEND as FEBLEND, __webpack_exports__FECOLORMATRIX as FECOLORMATRIX, __webpack_exports__FECOMPONENTTRANSFER as FECOMPONENTTRANSFER, __webpack_exports__FECOMPOSITE as FECOMPOSITE, __webpack_exports__FECONVOLVEMATRIX as FECONVOLVEMATRIX, __webpack_exports__FEDIFFUSELIGHTING as FEDIFFUSELIGHTING, __webpack_exports__FEDISPLACEMENTMAP as FEDISPLACEMENTMAP, __webpack_exports__FEDISTANTLIGHT as FEDISTANTLIGHT, __webpack_exports__FEDROPSHADOW as FEDROPSHADOW, __webpack_exports__FEFLOOD as FEFLOOD, __webpack_exports__FEFUNCA as FEFUNCA, __webpack_exports__FEFUNCB as FEFUNCB, __webpack_exports__FEFUNCG as FEFUNCG, __webpack_exports__FEFUNCR as FEFUNCR, __webpack_exports__FEGAUSSIANBLUR as FEGAUSSIANBLUR, __webpack_exports__FEIMAGE as FEIMAGE, __webpack_exports__FEMERGE as FEMERGE, __webpack_exports__FEMERGENODE as FEMERGENODE, __webpack_exports__FEMORPHOLOGY as FEMORPHOLOGY, __webpack_exports__FEOFFSET as FEOFFSET, __webpack_exports__FEPOINTLIGHT as FEPOINTLIGHT, __webpack_exports__FESPECULARLIGHTING as FESPECULARLIGHTING, __webpack_exports__FESPOTLIGHT as FESPOTLIGHT, __webpack_exports__FETILE as FETILE, __webpack_exports__FETURBULENCE as FETURBULENCE, __webpack_exports__FIELDSET as FIELDSET, __webpack_exports__FIGCAPTION as FIGCAPTION, __webpack_exports__FIGURE as FIGURE, __webpack_exports__FILTER as FILTER, __webpack_exports__FONT as FONT, __webpack_exports__FONTFACE as FONTFACE, __webpack_exports__FONTFACEFORMAT as FONTFACEFORMAT, __webpack_exports__FONTFACENAME as FONTFACENAME, __webpack_exports__FONTFACESRC as FONTFACESRC, __webpack_exports__FONTFACEURI as FONTFACEURI, __webpack_exports__FOOTER as FOOTER, __webpack_exports__FOREIGNOBJECT as FOREIGNOBJECT, __webpack_exports__FORM as FORM, __webpack_exports__G as G, __webpack_exports__GLYPH as GLYPH, __webpack_exports__GLYPHREF as GLYPHREF, __webpack_exports__H1 as H1, __webpack_exports__H2 as H2, __webpack_exports__H3 as H3, __webpack_exports__H4 as H4, __webpack_exports__H5 as H5, __webpack_exports__H6 as H6, __webpack_exports__HANDLER as HANDLER, __webpack_exports__HEADER as HEADER, __webpack_exports__HGROUP as HGROUP, __webpack_exports__HKERN as HKERN, __webpack_exports__HR as HR, __webpack_exports__I as I, __webpack_exports__IFRAME as IFRAME, __webpack_exports__IMAGE as IMAGE, __webpack_exports__IMG as IMG, __webpack_exports__INPUT as INPUT, __webpack_exports__INS as INS, __webpack_exports__KBD as KBD, __webpack_exports__LABEL as LABEL, __webpack_exports__LEGEND as LEGEND, __webpack_exports__LI as LI, __webpack_exports__LINE as LINE, __webpack_exports__LINEARGRADIENT as LINEARGRADIENT, __webpack_exports__LINK as LINK, __webpack_exports__LISTENER as LISTENER, __webpack_exports__MAIN as MAIN, __webpack_exports__MAP as MAP, __webpack_exports__MARK as MARK, __webpack_exports__MARKER as MARKER, __webpack_exports__MASK as MASK, __webpack_exports__MENU as MENU, __webpack_exports__META as META, __webpack_exports__METADATA as METADATA, __webpack_exports__METER as METER, __webpack_exports__MISSINGGLYPH as MISSINGGLYPH, __webpack_exports__MPATH as MPATH, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUILanguageProvider as MythixUILanguageProvider, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__NAV as NAV, __webpack_exports__NOSCRIPT as NOSCRIPT, __webpack_exports__OBJECT as OBJECT, __webpack_exports__OL as OL, __webpack_exports__OPTGROUP as OPTGROUP, __webpack_exports__OPTION as OPTION, __webpack_exports__OUTPUT as OUTPUT, __webpack_exports__P as P, __webpack_exports__PATH as PATH, __webpack_exports__PATTERN as PATTERN, __webpack_exports__PICTURE as PICTURE, __webpack_exports__POLYGON as POLYGON, __webpack_exports__POLYLINE as POLYLINE, __webpack_exports__PRE as PRE, __webpack_exports__PREFETCH as PREFETCH, __webpack_exports__PROGRESS as PROGRESS, __webpack_exports__Q as Q, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__RADIALGRADIENT as RADIALGRADIENT, __webpack_exports__RECT as RECT, __webpack_exports__RP as RP, __webpack_exports__RT as RT, __webpack_exports__RUBY as RUBY, __webpack_exports__S as S, __webpack_exports__SAMP as SAMP, __webpack_exports__SCRIPT as SCRIPT, __webpack_exports__SECTION as SECTION, __webpack_exports__SELECT as SELECT, __webpack_exports__SET as SET, __webpack_exports__SLOT as SLOT, __webpack_exports__SMALL as SMALL, __webpack_exports__SOLIDCOLOR as SOLIDCOLOR, __webpack_exports__SOURCE as SOURCE, __webpack_exports__SPAN as SPAN, __webpack_exports__STOP as STOP, __webpack_exports__STRONG as STRONG, __webpack_exports__STYLE as STYLE, __webpack_exports__SUB as SUB, __webpack_exports__SUMMARY as SUMMARY, __webpack_exports__SUP as SUP, __webpack_exports__SVG as SVG, __webpack_exports__SVG_ELEMENT_NAMES as SVG_ELEMENT_NAMES, __webpack_exports__SWITCH as SWITCH, __webpack_exports__SYMBOL as SYMBOL, __webpack_exports__TABLE as TABLE, __webpack_exports__TBODY as TBODY, __webpack_exports__TBREAK as TBREAK, __webpack_exports__TD as TD, __webpack_exports__TEMPLATE as TEMPLATE, __webpack_exports__TEXT as TEXT, __webpack_exports__TEXTAREA as TEXTAREA, __webpack_exports__TEXTPATH as TEXTPATH, __webpack_exports__TFOOT as TFOOT, __webpack_exports__TH as TH, __webpack_exports__THEAD as THEAD, __webpack_exports__TIME as TIME, __webpack_exports__TITLE as TITLE, __webpack_exports__TR as TR, __webpack_exports__TRACK as TRACK, __webpack_exports__TREF as TREF, __webpack_exports__TSPAN as TSPAN, __webpack_exports__Term as Term, __webpack_exports__U as U, __webpack_exports__UL as UL, __webpack_exports__UNFINISHED_DEFINITION as UNFINISHED_DEFINITION, __webpack_exports__UNKNOWN as UNKNOWN, __webpack_exports__USE as USE, __webpack_exports__Utils as Utils, __webpack_exports__VAR as VAR, __webpack_exports__VIDEO as VIDEO, __webpack_exports__VIEW as VIEW, __webpack_exports__VKERN as VKERN, __webpack_exports__WBR as WBR, __webpack_exports__build as build, __webpack_exports__getVisibilityMeta as getVisibilityMeta, __webpack_exports__importIntoDocumentFromSource as importIntoDocumentFromSource, __webpack_exports__isSVGElement as isSVGElement, __webpack_exports__loadPartialIntoElement as loadPartialIntoElement, __webpack_exports__recursivelyBindDynamicData as recursivelyBindDynamicData, __webpack_exports__remapNodeTree as remapNodeTree, __webpack_exports__require as require, __webpack_exports__resolveURL as resolveURL, __webpack_exports__visibilityObserver as visibilityObserver };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUCwrQkFBK0IsNEJBQTRCOztBQUVwRDtBQUNQO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM1lvQztBQUlaOztBQUVqQix1Q0FBdUMsNERBQWlCO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsTUFBTTtBQUMzQyxzQkFBc0IsZ0RBQWU7O0FBRXJDO0FBQ0EsaUJBQWlCLGdFQUErQjs7QUFFaEQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLG9EQUFvRCwwQkFBMEI7QUFDOUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnR0FBZ0csS0FBSztBQUNyRztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLFlBQVksUUFBUSxrREFBTztBQUN2Qzs7QUFFQTs7QUFFQTtBQUNBLE1BQU07QUFDTixzRkFBc0YsSUFBSTtBQUMxRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLG9EQUFtQjtBQUMvQjtBQUNBLFVBQVU7QUFDVix5QkFBeUIsZ0VBQStCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLGlEQUFpRDs7Ozs7Ozs7Ozs7Ozs7OztBQ2pITDs7QUFFNUM7QUFDQTs7QUFFTyw4QkFBOEIsNERBQTJCO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxRQUFRLGtEQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLHVFQUFzQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsV0FBVztBQUMzQztBQUNBO0FBQ0EsV0FBVztBQUNYLGlDQUFpQyxvQkFBb0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQSxNQUFNO0FBQ04sNEVBQTRFLElBQUk7QUFDaEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQ7O0FBRWpEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRkE7O0FBRW1EOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyw4QkFBOEIsNERBQWlCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQSxnREFBZ0Q7O0FBRVo7QUFDUztBQUNIOztBQUVOOztBQUVGO0FBQ0g7QUFDRDtBQUNTO0FBQ1U7QUFDVjs7QUFFdkMsNEJBQTRCLHNDQUFLO0FBQ2pDLGlDQUFpQywwQ0FBVTtBQUMzQywrQkFBK0IseUNBQVE7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBLElBQUksNkRBQTZCLElBQUksaUNBQWlDO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLE1BQU0saUVBQWlDO0FBQ3ZDLEtBQUssSUFBSSxVQUFVO0FBQ25CLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3QkFBd0IscUVBQW9DO0FBQzVELG9DQUFvQyxpREFBZ0I7QUFDcEQsUUFBUTtBQUNSO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQSxVQUFVLHFFQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1yZXF1aXJlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1zcGlubmVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3F1ZXJ5LWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGlmICghcnVsZS5zZWxlY3RvclRleHQpXG4gICAgcmV0dXJuIHJ1bGUuY3NzVGV4dDtcblxuICBsZXQgX2JvZHkgICA9IHJ1bGUuY3NzVGV4dC5zdWJzdHJpbmcocnVsZS5zZWxlY3RvclRleHQubGVuZ3RoKS50cmltKCk7XG4gIGxldCByZXN1bHQgID0gKGNhbGxiYWNrKHJ1bGUuc2VsZWN0b3JUZXh0LCBfYm9keSkgfHwgW10pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmV0dXJuICcnO1xuXG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBjc3NSdWxlc1RvU291cmNlKGNzc1J1bGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQXJyYXkuZnJvbShjc3NSdWxlcyB8fCBbXSkubWFwKChydWxlKSA9PiB7XG4gICAgbGV0IHJ1bGVTdHIgPSBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gYCR7Y3NzUnVsZXNUb1NvdXJjZShydWxlLmNzc1J1bGVzLCBjYWxsYmFjayl9JHtydWxlU3RyfWA7XG4gIH0pLmpvaW4oJ1xcblxcbicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVGb3JEb2N1bWVudChlbGVtZW50TmFtZSwgc3R5bGVFbGVtZW50KSB7XG4gIGNvbnN0IGhhbmRsZUhvc3QgPSAobSwgdHlwZSwgX2NvbnRlbnQpID0+IHtcbiAgICBsZXQgY29udGVudCA9ICghX2NvbnRlbnQpID8gX2NvbnRlbnQgOiBfY29udGVudC5yZXBsYWNlKC9eXFwoLywgJycpLnJlcGxhY2UoL1xcKSQvLCAnJyk7XG5cbiAgICBpZiAodHlwZSA9PT0gJzpob3N0Jykge1xuICAgICAgaWYgKCFjb250ZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudE5hbWU7XG5cbiAgICAgIC8vIEVsZW1lbnQgc2VsZWN0b3I/XG4gICAgICBpZiAoKC9eW2EtekEtWl9dLykudGVzdChjb250ZW50KSlcbiAgICAgICAgcmV0dXJuIGAke2NvbnRlbnR9W2RhdGEtbXl0aGl4LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbiAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4gICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3RvcjtcbiAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4gICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuICAgICAgICB0YWdzLnB1c2gobSk7XG4gICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4gICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuICAgIH0sXG4gICk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4gIGxldCBvYmpJRCAgICAgICAgICAgICA9IFV0aWxzLmdldE9iaklEKHRlbXBsYXRlKTtcbiAgbGV0IHRlbXBsYXRlSUQgICAgICAgID0gVXRpbHMuU0hBMjU2KG9iaklEKTtcbiAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4gIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbiAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbiAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4gICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihzdGFydFByb3RvLCBkZXNjcmlwdG9yTmFtZSkge1xuICBsZXQgdGhpc1Byb3RvID0gc3RhcnRQcm90bztcbiAgbGV0IGRlc2NyaXB0b3I7XG5cbiAgd2hpbGUgKHRoaXNQcm90byAmJiAhKGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXNQcm90bywgZGVzY3JpcHRvck5hbWUpKSlcbiAgICB0aGlzUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1Byb3RvKTtcblxuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuY29uc3QgSVNfQVRUUl9NRVRIT0RfTkFNRSAgID0gL15hdHRyXFwkKC4qKSQvO1xuY29uc3QgUkVHSVNURVJFRF9DT01QT05FTlRTID0gbmV3IFNldCgpO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgX0tsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpIHtcbiAgICAgIGxldCBLbGFzcyA9IF9LbGFzcyB8fCB0aGlzO1xuICAgICAgS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gS2xhc3MuY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMoS2xhc3MpO1xuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKG5hbWUsIEtsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBzdGF0aWMgY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbihLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgbmFtZXMgPSBVdGlscy5nZXRBbGxQcm9wZXJ0eU5hbWVzKHByb3RvKVxuICAgICAgLmZpbHRlcigobmFtZSkgPT4gSVNfQVRUUl9NRVRIT0RfTkFNRS50ZXN0KG5hbWUpKVxuICAgICAgLm1hcCgob3JpZ2luYWxOYW1lKSA9PiB7XG4gICAgICAgIGxldCBuYW1lID0gb3JpZ2luYWxOYW1lLm1hdGNoKElTX0FUVFJfTUVUSE9EX05BTUUpWzFdO1xuICAgICAgICBpZiAoUkVHSVNURVJFRF9DT01QT05FTlRTLmhhcyhLbGFzcykpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHByb3RvLCBvcmlnaW5hbE5hbWUpO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGVcbiAgICAgICAgLy8gdXNlciBkaWQgaXQgd3JvbmcuLi4gc28ganVzdFxuICAgICAgICAvLyBtYWtlIHRoaXMgdGhlIFwic2V0dGVyXCJcbiAgICAgICAgbGV0IG1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgIGlmIChtZXRob2QpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IG9yaWdpbmFsR2V0ID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICAgIGlmIChvcmlnaW5hbEdldCkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb3RvLCB7XG4gICAgICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgICAgICAgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsR2V0LmNhbGwoY29udGV4dCwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0OiAgICAgICAgICBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVXRpbHMudG9TbmFrZUNhc2UobmFtZSk7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIG5hbWVzO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBvbGRWYWx1ZSwgbmV3VmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NlbnNpdGl2ZVRhZ05hbWUnOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lELFxuICAgICAgfSxcbiAgICAgICdkZWxheVRpbWVycyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgICAnZG9jdW1lbnRJbml0aWFsaXplZCc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsICdfbXl0aGl4VUlEb2N1bWVudEluaXRpYWxpemVkJyksXG4gICAgICAgIHNldDogICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnLCAhIXZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2hhZG93Jzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd0RPTSgpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGluamVjdFN0eWxlU2hlZXQoY29udGVudCkge1xuICAgIGxldCBzdHlsZUlEICAgICAgID0gYElEU1RZTEUke1V0aWxzLlNIQTI1NihgJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9OiR7Y29udGVudH1gKX1gO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBzdHlsZUVsZW1lbnQgID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCk7XG5cbiAgICBpZiAoc3R5bGVFbGVtZW50KVxuICAgICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcblxuICAgIHN0eWxlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuICB9XG5cbiAgcHJvY2Vzc0VsZW1lbnRzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUpXG4gICAgICByZXR1cm4gbm9kZTtcblxuICAgIGZvciAobGV0IGNoaWxkTm9kZSBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGNoaWxkTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKHRoaXMsIGNoaWxkTm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgY2hpbGROb2RlLm5vZGVUeXBlID49IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgICBjaGlsZE5vZGUgPSB0aGlzLnByb2Nlc3NFbGVtZW50cyhjaGlsZE5vZGUpO1xuXG4gICAgICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChjaGlsZE5vZGUpO1xuICAgICAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZU5hbWVzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQoY2hpbGROb2RlLCBjaGlsZE5vZGUsIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgIGNoaWxkTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKHRoaXMsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgYXR0YWNoU2hhZG93KG9wdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlbnZpcm9ubWVudCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiBzdXBlci5hdHRhY2hTaGFkb3cgIT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgc2hhZG93ID0gc3VwZXIuYXR0YWNoU2hhZG93KG9wdGlvbnMpO1xuICAgIFV0aWxzLm1ldGFkYXRhKHNoYWRvdywgJ19teXRoaXhVSVNoYWRvd1BhcmVudCcsIHRoaXMpO1xuXG4gICAgcmV0dXJuIHNoYWRvdztcbiAgfVxuXG4gIGNyZWF0ZVNoYWRvd0RPTShvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMub3duZXJEb2N1bWVudClcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LW5hbWU9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldYCk7XG4gIH1cblxuICBhcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKF90ZW1wbGF0ZSkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IF90ZW1wbGF0ZSB8fCB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgZW5zdXJlRG9jdW1lbnRTdHlsZXMuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSwgdGVtcGxhdGUpO1xuXG4gICAgICBsZXQgZm9ybWF0dGVkVGVtcGxhdGUgPSB0aGlzLnByb2Nlc3NFbGVtZW50cyh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChmb3JtYXR0ZWRUZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2NvbXBvbmVudC1uYW1lJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcblxuICAgIHRoaXMuYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTSgpO1xuICAgIHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRoaXMpO1xuXG4gICAgdGhpcy5tb3VudGVkKCk7XG5cbiAgICB0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51bm1vdW50ZWQoKTtcbiAgfVxuXG4gIGF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3U3JjKSB7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci51bm9ic2VydmUodGhpcyk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTcmMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb2JzZXJ2ZXIgPSB2aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgd2FzVmlzaWJsZSwgZGlzY29ubmVjdCB9KSA9PiB7XG4gICAgICBpZiAoIXdhc1Zpc2libGUpXG4gICAgICAgIHRoaXMuZmV0Y2hTcmModGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpKTtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfSwgeyBlbGVtZW50czogWyB0aGlzIF0gfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmlzaWJpbGl0eU9ic2VydmVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvYnNlcnZlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIGxldCBbXG4gICAgICBuYW1lLFxuICAgICAgb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZSxcbiAgICBdID0gYXJncztcblxuICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGxldCBtYWdpY05hbWUgICA9IGBhdHRyJCR7VXRpbHMudG9DYW1lbENhc2UobmFtZSl9YDtcbiAgICAgIGxldCBkZXNjcmlwdG9yICA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBDYWxsIHNldHRlclxuICAgICAgICB0aGlzW21hZ2ljTmFtZV0gPSBhcmdzLnNsaWNlKDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlQ2hhbmdlZCguLi5hcmdzKTtcbiAgfVxuXG4gIGFkb3B0ZWRDYWxsYmFjayguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRvcHRlZCguLi5hcmdzKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7fVxuICB1bm1vdW50ZWQoKSB7fVxuICBhdHRyaWJ1dGVDaGFuZ2VkKCkge31cbiAgYWRvcHRlZCgpIHt9XG5cbiAgZ2V0ICQkKCkge1xuICAgIGxldCBjb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBpZiAodHlwZW9mIHRoaXMucHVibGlzaENvbnRleHQgPT09ICdmdW5jdGlvbicpXG4gICAgICBjb250ZXh0ID0gKHRoaXMucHVibGlzaENvbnRleHQoKSB8fCBPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuICAgIHJldHVybiBVdGlscy5jcmVhdGVQcm94eUNvbnRleHQodGhpcywgY29udGV4dCk7XG4gIH1cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy4kKHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKSk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH1cblxuICBidWlsZChjYWxsYmFjaykge1xuICAgIGxldCByZXN1bHQgPSBbIGNhbGxiYWNrKEVsZW1lbnRzLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bRWxlbWVudHMuVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCByZXN1bHQpO1xuICB9XG5cbiAgaXNBdHRyaWJ1dGVUcnV0aHkobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG1ldGFkYXRhKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gVXRpbHMubWV0YWRhdGEodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cblxuICBkeW5hbWljUHJvcChuYW1lLCBfZ2V0dGVyLCBfc2V0dGVyLCBfY29udGV4dCkge1xuICAgIGxldCBpc0dldHRlckZ1bmMgID0gKHR5cGVvZiBfZ2V0dGVyID09PSAnZnVuY3Rpb24nKTtcbiAgICBsZXQgaW50ZXJuYWxWYWx1ZSA9IChpc0dldHRlckZ1bmMpID8gdW5kZWZpbmVkIDogX2dldHRlcjtcbiAgICBsZXQgZ2V0dGVyICAgICAgICA9IChpc0dldHRlckZ1bmMpID8gX2dldHRlciA6ICgpID0+IGludGVybmFsVmFsdWU7XG4gICAgbGV0IHNldHRlciAgICAgICAgPSAodHlwZW9mIF9zZXR0ZXIgPT09ICdmdW5jdGlvbicpID8gX3NldHRlciA6IChuZXdWYWx1ZSkgPT4ge1xuICAgICAgaW50ZXJuYWxWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH07XG5cbiAgICBsZXQgZHluYW1pY1Byb3BlcnR5ID0gbmV3IFV0aWxzLkR5bmFtaWNQcm9wZXJ0eShnZXR0ZXIsIHNldHRlcik7XG4gICAgbGV0IGNvbnRleHQgICAgICAgICA9IF9jb250ZXh0IHx8IHRoaXM7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb250ZXh0LCB7XG4gICAgICBbbmFtZV06IHtcbiAgICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gZHluYW1pY1Byb3BlcnR5LFxuICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eS5zZXQobmV3VmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLmR5bmFtaWNQcm9wKGtleSwgdmFsdWUsIHVuZGVmaW5lZCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBkZWJvdW5jZShjYWxsYmFjaywgbXMsIF9pZCkge1xuICAgIHZhciBpZCA9IF9pZDtcblxuICAgIC8vIElmIHdlIGRvbid0IGdldCBhbiBpZCBmcm9tIHRoZSB1c2VyLCB0aGVuIGd1ZXNzIHRoZSBpZCBieSB0dXJuaW5nIHRoZSBmdW5jdGlvblxuICAgIC8vIGludG8gYSBzdHJpbmcgKHJhdyBzb3VyY2UpIGFuZCB1c2UgdGhhdCBmb3IgYW4gaWQgaW5zdGVhZFxuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICBpZCA9ICgnJyArIGNhbGxiYWNrKTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhIHRyYW5zcGlsZWQgY29kZSwgdGhlbiBhbiBhc3luYyBnZW5lcmF0b3Igd2lsbCBiZSB1c2VkIGZvciBhc3luYyBmdW5jdGlvbnNcbiAgICAgIC8vIFRoaXMgd3JhcHMgdGhlIHJlYWwgZnVuY3Rpb24sIGFuZCBzbyB3aGVuIGNvbnZlcnRpbmcgdGhlIGZ1bmN0aW9uIGludG8gYSBzdHJpbmdcbiAgICAgIC8vIGl0IHdpbGwgTk9UIGJlIHVuaXF1ZSBwZXIgY2FsbC1zaXRlLiBGb3IgdGhpcyByZWFzb24sIGlmIHdlIGRldGVjdCB0aGlzIGlzc3VlLFxuICAgICAgLy8gd2Ugd2lsbCBnbyB0aGUgXCJzbG93XCIgcm91dGUgYW5kIGNyZWF0ZSBhIHN0YWNrIHRyYWNlLCBhbmQgdXNlIHRoYXQgZm9yIHRoZSB1bmlxdWUgaWRcbiAgICAgIGlmIChpZC5tYXRjaCgvYXN5bmNHZW5lcmF0b3JTdGVwLykpIHtcbiAgICAgICAgaWQgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgICAgICBjb25zb2xlLndhcm4oJ215dGhpeC11aSB3YXJuaW5nOiBcInRoaXMuZGVsYXlcIiBjYWxsZWQgd2l0aG91dCBhIHNwZWNpZmllZCBcImlkXCIgcGFyYW1ldGVyLiBUaGlzIHdpbGwgcmVzdWx0IGluIGEgcGVyZm9ybWFuY2UgaGl0LiBQbGVhc2Ugc3BlY2lmeSBhbmQgXCJpZFwiIGFyZ3VtZW50IGZvciB5b3VyIGNhbGw6IFwidGhpcy5kZWxheShjYWxsYmFjaywgbXMsIFxcJ3NvbWUtY3VzdG9tLWNhbGwtc2l0ZS1pZFxcJylcIicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9ICgnJyArIGlkKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UudGltZXJJRClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcbiAgICB9XG5cbiAgICBwcm9taXNlID0gVXRpbHMuY3JlYXRlUmVzb2x2YWJsZSgpO1xuICAgIHRoaXMuZGVsYXlUaW1lcnMuc2V0KGlkLCBwcm9taXNlKTtcblxuICAgIC8vIExldCdzIG5vdCBjb21wbGFpbiBhYm91dFxuICAgIC8vIHVuY2F1Z2h0IGVycm9yc1xuICAgIHByb21pc2UuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgcHJvbWlzZS50aW1lcklEID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBjYWxsaW5nIFwiZGVsYXlcIiBjYWxsYmFjazogJywgZXJyb3IsIGNhbGxiYWNrLnRvU3RyaW5nKCkpO1xuICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgfSwgbXMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsYXNzZXMoLi4uX2FyZ3MpIHtcbiAgICBsZXQgYXJncyA9IF9hcmdzLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoaXRlbSkpIHtcbiAgICAgICAgbGV0IGtleXMgID0gT2JqZWN0LmtleXMoaXRlbSk7XG4gICAgICAgIGxldCBpdGVtcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICAgICAgbGV0IHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGl0ZW1zLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhcmdzKSkuam9pbignICcpO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hTcmMoc3JjVVJMKSB7XG4gICAgaWYgKCFzcmNVUkwpXG4gICAgICByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbG9hZFBhcnRpYWxJbnRvRWxlbWVudC5jYWxsKHRoaXMsIHNyY1VSTCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmNVUkx9IChyZXNvbHZlZCB0bzogJHtlcnJvci51cmx9KWAsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgU0NIRU1FX1JFICAgICA9IC9eW1xcdy1dKzpcXC9cXC8vO1xuY29uc3QgSEFTX0ZJTEVOQU1FICA9IC9cXC5bXi8uXSskLztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVVUkwobG9jYXRpb24sIF91cmxpc2gsIG1hZ2ljKSB7XG4gIGxldCB1cmxpc2ggPSBfdXJsaXNoO1xuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgVVJMKVxuICAgIHJldHVybiB1cmxpc2g7XG5cbiAgaWYgKCF1cmxpc2gpXG4gICAgcmV0dXJuIG5ldyBVUkwobG9jYXRpb24pO1xuXG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBMb2NhdGlvbilcbiAgICByZXR1cm4gbmV3IFVSTCh1cmxpc2gpO1xuXG4gIGlmICghVXRpbHMuaXNUeXBlKHVybGlzaCwgJ1N0cmluZycpKVxuICAgIHJldHVybjtcblxuICBjb25zdCBpbnRlcm5hbFJlc29sdmUgPSAoX2xvY2F0aW9uLCBfdXJsUGFydCwgbWFnaWMpID0+IHtcbiAgICBsZXQgb3JpZ2luYWxVUkwgPSB1cmxpc2g7XG4gICAgaWYgKFNDSEVNRV9SRS50ZXN0KHVybGlzaCkpXG4gICAgICByZXR1cm4gdXJsaXNoO1xuXG4gICAgLy8gTWFnaWMhXG4gICAgaWYgKG1hZ2ljID09PSB0cnVlICYmICFIQVNfRklMRU5BTUUudGVzdCh1cmxpc2gpKSB7XG4gICAgICBsZXQgcGFydHMgICAgID0gdXJsaXNoLnNwbGl0KCcvJykubWFwKChwYXJ0KSA9PiBwYXJ0LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgbGV0IGxhc3RQYXJ0ICA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGxhc3RQYXJ0KVxuICAgICAgICB1cmxpc2ggPSBgJHt1cmxpc2gucmVwbGFjZSgvXFwvKyQvLCAnJyl9LyR7bGFzdFBhcnR9Lmh0bWxgO1xuICAgIH1cblxuICAgIGxldCBsb2NhdGlvbiA9IG5ldyBVUkwoX2xvY2F0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBuZXcgVVJMKGAke2xvY2F0aW9uLm9yaWdpbn0ke2xvY2F0aW9uLnBhdGhuYW1lfSR7dXJsaXNofWAucmVwbGFjZSgvXFwvezIsfS9nLCAnLycpKSxcbiAgICAgIG9yaWdpbmFsVVJMLFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgb3JpZ2luYWxVUkwsXG4gIH0gPSBpbnRlcm5hbFJlc29sdmUobG9jYXRpb24sIHVybGlzaC50b1N0cmluZygpLCBtYWdpYyk7XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IGZpbGVOYW1lO1xuICAgIGxldCBwYXRoO1xuXG4gICAgdXJsLnBhdGhuYW1lLnJlcGxhY2UoLyguKlxcLykoW14vXSspJC8sIChtLCBmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICBwYXRoID0gZmlyc3Q7XG4gICAgICBmaWxlTmFtZSA9IHNlY29uZDtcbiAgICAgIHJldHVybiBtO1xuICAgIH0pO1xuXG4gICAgbGV0IG5ld1NyYyA9IGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIuY2FsbCh0aGlzLCB7IHNyYzogb3JpZ2luYWxVUkwsIHVybCwgcGF0aCwgZmlsZU5hbWUgfSk7XG4gICAgaWYgKG5ld1NyYyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtcmVxdWlyZVwiOiBOb3QgbG9hZGluZyBcIiR7b3JpZ2luYWxVUkx9XCIgYmVjYXVzZSB0aGUgZ2xvYmFsIFwibXl0aGl4VUkudXJsUmVzb2x2ZXJcIiByZXF1ZXN0ZWQgSSBub3QgZG8gc28uYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5ld1NyYyAhPT0gb3JpZ2luYWxVUkwpXG4gICAgICB1cmwgPSByZXNvbHZlVVJMKGxvY2F0aW9uLCBuZXdTcmMsIG1hZ2ljKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBJU19TQ1JJUFQgICAgID0gL14oc2NyaXB0KSQvaTtcbmNvbnN0IFJFUVVJUkVfQ0FDSEUgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IHJlc29sdmVVUkwobG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgZ3Vlc3NlZEVsZW1lbnROYW1lLFxuICAgIGNoaWxkcmVuLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdGVtcGxhdGUsXG4gICAgdXJsLFxuICAgIGJhc2VVUkwsXG4gICAgZmlsZU5hbWUsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnByZVByb2Nlc3NUZW1wbGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucHJlUHJvY2Vzc1RlbXBsYXRlLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pO1xuICB9XG5cbiAgbGV0IG5vZGVIYW5kbGVyICAgPSBvcHRpb25zLm5vZGVIYW5kbGVyO1xuICBsZXQgdGVtcGxhdGVDb3VudCA9IGNoaWxkcmVuLnJlZHVjZSgoc3VtLCBlbGVtZW50KSA9PiAoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyAoc3VtICsgMSkgOiBzdW0pLCAwKTtcblxuICBjb250ZXh0LnRlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50O1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgaWYgKHRlbXBsYXRlQ291bnQgPT09IDEgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpID09IG51bGwgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LW5hbWUnKSk7XG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKGBbZGF0YS1mb3I9XCIke2VsZW1lbnROYW1lfVwiIGldLFtkYXRhLW15dGhpeC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIiBpXWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoSVNfU0NSSVBULnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHNjcmlwdD5cbiAgICAgIGxldCBjaGlsZENsb25lID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBjaGlsZC5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBjaGlsZC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpO1xuXG4gICAgICBsZXQgc3JjID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgc3JjID0gcmVzb2x2ZVVSTChiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYy50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ21vZHVsZScpO1xuICAgICAgICBjaGlsZENsb25lLmlubmVySFRNTCA9IGNoaWxkLnRleHRDb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNTY3JpcHQ6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgc3R5bGVJRCA9IGBJRCR7VXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZENsb25lLmlubmVySFRNTH1gKX1gO1xuICAgICAgaWYgKCFjaGlsZENsb25lLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2NyaXB0IyR7c3R5bGVJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkQ2xvbmUpO1xuICAgIH0gZWxzZSBpZiAoKC9eKGxpbmt8c3R5bGUpJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBsZXQgaXNTdHlsZSA9ICgvXnN0eWxlJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU3R5bGUsIGlzTGluazogIWlzU3R5bGUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgaWQgPSBgSUQke1V0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkOiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUob3duZXJEb2N1bWVudCwgdXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB1cmwgICAgICAgPSByZXNvbHZlVVJMKG93bmVyRG9jdW1lbnQubG9jYXRpb24sIHVybE9yTmFtZSwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBjYWNoZUtleTtcblxuICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlJykgIT09ICdmYWxzZScpIHtcbiAgICBsZXQgY2FjaGVLZXlVUkwgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWV9YCk7XG4gICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIGNhY2hlS2V5ID0gdXJsLnRvU3RyaW5nKCk7XG4gIH1cblxuICBsZXQgY2FjaGVkUmVzcG9uc2UgPSBSRVFVSVJFX0NBQ0hFLmdldChjYWNoZUtleSk7XG4gIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgaWYgKGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlICYmIGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLm9rKVxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZTogY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogdHJ1ZSB9O1xuICB9XG5cbiAgbGV0IHByb21pc2UgPSBnbG9iYWxUaGlzLmZldGNoKHVybCwgb3B0aW9ucy5mZXRjaE9wdGlvbnMpLnRoZW4oXG4gICAgYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcbiAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICBlcnJvci51cmwgPSB1cmw7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIHJlc3BvbnNlLnRleHQgPSBhc3luYyAoKSA9PiBib2R5O1xuICAgICAgcmVzcG9uc2UuanNvbiA9IGFzeW5jICgpID0+IEpTT04ucGFyc2UoYm9keSk7XG5cbiAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogZmFsc2UgfTtcbiAgICB9LFxuICAgIChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZnJvbSBNeXRoaXggVUkgXCJyZXF1aXJlXCI6ICcsIGVycm9yKTtcbiAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYykge1xuICAvLyBhd2FpdCBzbGVlcCgxNTAwKTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgIHNyYyxcbiAgKTtcblxuICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgd2hpbGUgKHRoaXMuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmNoaWxkTm9kZXNbMF0pO1xuXG4gIGxldCBzY29wZURhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiB1cmwuc2VhcmNoUGFyYW1zLmVudHJpZXMoKSlcbiAgICBzY29wZURhdGFba2V5XSA9IFV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgbGV0IGNvbnRleHQgPSBVdGlscy5jcmVhdGVQcm94eUNvbnRleHQodGhpcywgc2NvcGVEYXRhKTtcbiAgbGV0IHNjb3BlICAgPSB7IGNvbnRleHQsICQkOiBjb250ZXh0IH07XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSlcbiAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHJlY3Vyc2l2ZWx5QmluZER5bmFtaWNEYXRhKHNjb3BlLCBub2RlKSk7XG4gICAgICB9LFxuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpYmlsaXR5T2JzZXJ2ZXIoY2FsbGJhY2ssIF9vcHRpb25zKSB7XG4gIGNvbnN0IGludGVyc2VjdGlvbkNhbGxiYWNrID0gKGVudHJpZXMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbnRyeSAgID0gZW50cmllc1tpXTtcbiAgICAgIGxldCBlbGVtZW50ID0gZW50cnkudGFyZ2V0O1xuICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSUludGVyc2VjdGlvbk9ic2VydmVycycpO1xuICAgICAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKSB7XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlJbnRlcnNlY3Rpb25PYnNlcnZlcnMnLCBlbGVtZW50T2JzZXJ2ZXJzKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRhdGEgPSBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcik7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHsgd2FzVmlzaWJsZTogZmFsc2UsIHJhdGlvVmlzaWJsZTogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gfTtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycy5zZXQob2JzZXJ2ZXIsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiBkYXRhLnJhdGlvVmlzaWJsZSlcbiAgICAgICAgZGF0YS5yYXRpb1Zpc2libGUgPSBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbztcblxuICAgICAgZGF0YS5wcmV2aW91c1Zpc2liaWxpdHkgPSAoZGF0YS52aXNpYmlsaXR5ID09PSB1bmRlZmluZWQpID8gZGF0YS52aXNpYmlsaXR5IDogZGF0YS52aXNpYmlsaXR5O1xuICAgICAgZGF0YS52aXNpYmlsaXR5ID0gKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMC4wKTtcblxuICAgICAgY2FsbGJhY2soeyAuLi5kYXRhLCBlbnRyeSwgZWxlbWVudCwgaW5kZXg6IGksIGRpc2Nvbm5lY3Q6ICgpID0+IG9ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KSB9KTtcblxuICAgICAgaWYgKGRhdGEudmlzaWJpbGl0eSAmJiAhZGF0YS53YXNWaXNpYmxlKVxuICAgICAgICBkYXRhLndhc1Zpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHtcbiAgICByb290OiAgICAgICBudWxsLFxuICAgIHRocmVzaG9sZDogIDAuMCxcbiAgICAuLi4oX29wdGlvbnMgfHwge30pLFxuICB9O1xuXG4gIGxldCBvYnNlcnZlciAgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaW50ZXJzZWN0aW9uQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICBsZXQgZWxlbWVudHMgID0gKF9vcHRpb25zIHx8IHt9KS5lbGVtZW50cyB8fCBbXTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudHNbaV0pO1xuXG4gIHJldHVybiBvYnNlcnZlcjtcbn1cblxuY29uc3QgTk9fT0JTRVJWRVIgPSBPYmplY3QuZnJlZXplKHtcbiAgd2FzVmlzaWJsZTogICAgICAgICBmYWxzZSxcbiAgcmF0aW9WaXNpYmxlOiAgICAgICAwLjAsXG4gIHZpc2liaWxpdHk6ICAgICAgICAgZmFsc2UsXG4gIHByZXZpb3VzVmlzaWJpbGl0eTogZmFsc2UsXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlNZXRhKGVsZW1lbnQsIG9ic2VydmVyKSB7XG4gIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSUludGVyc2VjdGlvbk9ic2VydmVycycpO1xuICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpXG4gICAgcmV0dXJuIE5PX09CU0VSVkVSO1xuXG4gIHJldHVybiBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcikgfHwgTk9fT0JTRVJWRVI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1hcE5vZGVUcmVlKG5vZGUsIGNhbGxiYWNrLCBfaW5kZXgpIHtcbiAgaWYgKCFub2RlKVxuICAgIHJldHVybiBub2RlO1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAobGV0IGNoaWxkTm9kZSBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykpIHtcbiAgICBsZXQgbmV3Tm9kZSA9IGNhbGxiYWNrKHJlbWFwTm9kZVRyZWUoY2hpbGROb2RlLCBjYWxsYmFjaywgaW5kZXgpLCBpbmRleCsrKTtcbiAgICBpZiAobmV3Tm9kZSAhPT0gY2hpbGROb2RlKSB7XG4gICAgICBpZiAobmV3Tm9kZSlcbiAgICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgY2hpbGROb2RlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoX2luZGV4ID09IG51bGwpID8gY2FsbGJhY2sobm9kZSwgIC0xKSA6IG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVseUJpbmREeW5hbWljRGF0YShjb250ZXh0LCBub2RlKSB7XG4gIHJldHVybiByZW1hcE5vZGVUcmVlKG5vZGUsIChub2RlKSA9PiB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICBpZiAobm9kZVZhbHVlICYmIFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShub2RlVmFsdWUpKVxuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgbm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID49IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KG5vZGUpO1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUgJiYgVXRpbHMuc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gbm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShjb250ZXh0LCBhdHRyaWJ1dGVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY29uc3QgVU5GSU5JU0hFRF9ERUZJTklUSU9OID0gU3ltYm9sLmZvcignL2pveS9lbGVtZW50RGVmaW5pdGlvbi9jb25zdGFudHMvdW5maW5pc2hlZCcpO1xuXG5jb25zdCBJU19QUk9QX05BTUUgPSAvXnByb3BcXCQvO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd0YWdOYW1lJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRhZ05hbWUsXG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH0sXG4gICAgICAnY2hpbGRyZW4nOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgY2hpbGRyZW4gfHwgW10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpO1xuICB9XG5cbiAgYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpIHtcbiAgICBsZXQgYXR0cmlidXRlcyAgICA9IHRoaXMuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZXNwYWNlVVJJICA9IGF0dHJpYnV0ZXMubmFtZXNwYWNlVVJJO1xuICAgIGxldCBvcHRpb25zO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5pcylcbiAgICAgIG9wdGlvbnMgPSB7IGlzOiB0aGlzLmF0dHJpYnV0ZXMuaXMgfTtcblxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGF0dHJpYnV0ZXMudmFsdWUgfHwgJycpO1xuICAgICAgdGV4dE5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShjb250ZXh0LCB0ZXh0Tm9kZSk7XG4gICAgICByZXR1cm4gdGV4dE5vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZVVSSSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2UgaWYgKGlzU1ZHRWxlbWVudCh0aGlzLnRhZ05hbWUpKVxuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudGFnTmFtZSk7XG5cbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudChjb250ZXh0LCBlbGVtZW50LCBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbW9kaWZpZWRBdHRyaWJ1dGVOYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgaWYgKFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYXR0cmlidXRlXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG5cbiAgICAgICAgICAvLyBHZXQgYXR0cmlidXRlIG5vZGUganVzdCBjcmVhdGVkXG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgYXR0cmlidXRlTm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIGhhbmRsZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgaGFuZGxlQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCAgICAgICAgID0gY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBjaGlsZEVsZW1lbnQgID0gY2hpbGQuYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jb25zdCBJU19UQVJHRVRfUFJPUCA9IC9ecHJvdG90eXBlfGNvbnN0cnVjdG9yJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFVdGlscy5pc1R5cGUodGFnTmFtZSwgJ1N0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBsZXQgY2hpbGRyZW4gPSBfY2hpbGRyZW4ubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIHZhbHVlKCk7XG5cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnREZWZpbml0aW9uKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIGlmICghVXRpbHMuaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKHRhZ05hbWUsIHNjb3BlLCBjaGlsZHJlbik7XG4gIH07XG5cbiAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eShmaW5hbGl6ZXIsIHtcbiAgICBnZXQ6ICh0YXJnZXQsIGF0dHJpYnV0ZU5hbWUpID0+IHtcbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgbGV0IHNjb3BlZFByb3h5ID0gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgZGVmYXVsdEF0dHJpYnV0ZXMgfHwge30pKTtcbiAgICAgICAgcmV0dXJuIHNjb3BlZFByb3h5W2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KFxuICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiByb290UHJveHk7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gcm9vdFByb3h5W3Byb3BOYW1lXTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcm9vdFByb3h5O1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX05BTUVTID0gW107XG5jb25zdCBFID0gKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKSA9PiB7XG4gIEVMRU1FTlRfTkFNRVMucHVzaCh0YWdOYW1lKTtcbiAgcmV0dXJuIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBICAgICAgICAgID0gRSgnYScpO1xuZXhwb3J0IGNvbnN0IEFCQlIgICAgICAgPSBFKCdhYmJyJyk7XG5leHBvcnQgY29uc3QgQUREUkVTUyAgICA9IEUoJ2FkZHJlc3MnKTtcbmV4cG9ydCBjb25zdCBBUkVBICAgICAgID0gRSgnYXJlYScpO1xuZXhwb3J0IGNvbnN0IEFSVElDTEUgICAgPSBFKCdhcnRpY2xlJyk7XG5leHBvcnQgY29uc3QgQVNJREUgICAgICA9IEUoJ2FzaWRlJyk7XG5leHBvcnQgY29uc3QgQVVESU8gICAgICA9IEUoJ2F1ZGlvJyk7XG5leHBvcnQgY29uc3QgQiAgICAgICAgICA9IEUoJ2InKTtcbmV4cG9ydCBjb25zdCBCQVNFICAgICAgID0gRSgnYmFzZScpO1xuZXhwb3J0IGNvbnN0IEJESSAgICAgICAgPSBFKCdiZGknKTtcbmV4cG9ydCBjb25zdCBCRE8gICAgICAgID0gRSgnYmRvJyk7XG5leHBvcnQgY29uc3QgQkxPQ0tRVU9URSA9IEUoJ2Jsb2NrcXVvdGUnKTtcbmV4cG9ydCBjb25zdCBCUiAgICAgICAgID0gRSgnYnInKTtcbmV4cG9ydCBjb25zdCBCVVRUT04gICAgID0gRSgnYnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ0FOVkFTICAgICA9IEUoJ2NhbnZhcycpO1xuZXhwb3J0IGNvbnN0IENBUFRJT04gICAgPSBFKCdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgQ0lURSAgICAgICA9IEUoJ2NpdGUnKTtcbmV4cG9ydCBjb25zdCBDT0RFICAgICAgID0gRSgnY29kZScpO1xuZXhwb3J0IGNvbnN0IENPTCAgICAgICAgPSBFKCdjb2wnKTtcbmV4cG9ydCBjb25zdCBDT0xHUk9VUCAgID0gRSgnY29sZ3JvdXAnKTtcbmV4cG9ydCBjb25zdCBEQVRBICAgICAgID0gRSgnZGF0YScpO1xuZXhwb3J0IGNvbnN0IERBVEFMSVNUICAgPSBFKCdkYXRhbGlzdCcpO1xuZXhwb3J0IGNvbnN0IEREICAgICAgICAgPSBFKCdkZCcpO1xuZXhwb3J0IGNvbnN0IERFTCAgICAgICAgPSBFKCdkZWwnKTtcbmV4cG9ydCBjb25zdCBERVRBSUxTICAgID0gRSgnZGV0YWlscycpO1xuZXhwb3J0IGNvbnN0IERGTiAgICAgICAgPSBFKCdkZm4nKTtcbmV4cG9ydCBjb25zdCBESUFMT0cgICAgID0gRSgnZGlhbG9nJyk7XG5leHBvcnQgY29uc3QgRElWICAgICAgICA9IEUoJ2RpdicpO1xuZXhwb3J0IGNvbnN0IERMICAgICAgICAgPSBFKCdkbCcpO1xuZXhwb3J0IGNvbnN0IERUICAgICAgICAgPSBFKCdkdCcpO1xuZXhwb3J0IGNvbnN0IEVNICAgICAgICAgPSBFKCdlbScpO1xuZXhwb3J0IGNvbnN0IEVNQkVEICAgICAgPSBFKCdlbWJlZCcpO1xuZXhwb3J0IGNvbnN0IEZJRUxEU0VUICAgPSBFKCdmaWVsZHNldCcpO1xuZXhwb3J0IGNvbnN0IEZJR0NBUFRJT04gPSBFKCdmaWdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgRklHVVJFICAgICA9IEUoJ2ZpZ3VyZScpO1xuZXhwb3J0IGNvbnN0IEZPT1RFUiAgICAgPSBFKCdmb290ZXInKTtcbmV4cG9ydCBjb25zdCBGT1JNICAgICAgID0gRSgnZm9ybScpO1xuZXhwb3J0IGNvbnN0IEgxICAgICAgICAgPSBFKCdoMScpO1xuZXhwb3J0IGNvbnN0IEgyICAgICAgICAgPSBFKCdoMicpO1xuZXhwb3J0IGNvbnN0IEgzICAgICAgICAgPSBFKCdoMycpO1xuZXhwb3J0IGNvbnN0IEg0ICAgICAgICAgPSBFKCdoNCcpO1xuZXhwb3J0IGNvbnN0IEg1ICAgICAgICAgPSBFKCdoNScpO1xuZXhwb3J0IGNvbnN0IEg2ICAgICAgICAgPSBFKCdoNicpO1xuZXhwb3J0IGNvbnN0IEhFQURFUiAgICAgPSBFKCdoZWFkZXInKTtcbmV4cG9ydCBjb25zdCBIR1JPVVAgICAgID0gRSgnaGdyb3VwJyk7XG5leHBvcnQgY29uc3QgSFIgICAgICAgICA9IEUoJ2hyJyk7XG5leHBvcnQgY29uc3QgSSAgICAgICAgICA9IEUoJ2knKTtcbmV4cG9ydCBjb25zdCBJRlJBTUUgICAgID0gRSgnaWZyYW1lJyk7XG5leHBvcnQgY29uc3QgSU1HICAgICAgICA9IEUoJ2ltZycpO1xuZXhwb3J0IGNvbnN0IElOUFVUICAgICAgPSBFKCdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IElOUyAgICAgICAgPSBFKCdpbnMnKTtcbmV4cG9ydCBjb25zdCBLQkQgICAgICAgID0gRSgna2JkJyk7XG5leHBvcnQgY29uc3QgTEFCRUwgICAgICA9IEUoJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgTEVHRU5EICAgICA9IEUoJ2xlZ2VuZCcpO1xuZXhwb3J0IGNvbnN0IExJICAgICAgICAgPSBFKCdsaScpO1xuZXhwb3J0IGNvbnN0IExJTksgICAgICAgPSBFKCdsaW5rJyk7XG5leHBvcnQgY29uc3QgTUFJTiAgICAgICA9IEUoJ21haW4nKTtcbmV4cG9ydCBjb25zdCBNQVAgICAgICAgID0gRSgnbWFwJyk7XG5leHBvcnQgY29uc3QgTUFSSyAgICAgICA9IEUoJ21hcmsnKTtcbmV4cG9ydCBjb25zdCBNRU5VICAgICAgID0gRSgnbWVudScpO1xuZXhwb3J0IGNvbnN0IE1FVEEgICAgICAgPSBFKCdtZXRhJyk7XG5leHBvcnQgY29uc3QgTUVURVIgICAgICA9IEUoJ21ldGVyJyk7XG5leHBvcnQgY29uc3QgTkFWICAgICAgICA9IEUoJ25hdicpO1xuZXhwb3J0IGNvbnN0IE5PU0NSSVBUICAgPSBFKCdub3NjcmlwdCcpO1xuZXhwb3J0IGNvbnN0IE9CSkVDVCAgICAgPSBFKCdvYmplY3QnKTtcbmV4cG9ydCBjb25zdCBPTCAgICAgICAgID0gRSgnb2wnKTtcbmV4cG9ydCBjb25zdCBPUFRHUk9VUCAgID0gRSgnb3B0Z3JvdXAnKTtcbmV4cG9ydCBjb25zdCBPUFRJT04gICAgID0gRSgnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgT1VUUFVUICAgICA9IEUoJ291dHB1dCcpO1xuZXhwb3J0IGNvbnN0IFAgICAgICAgICAgPSBFKCdwJyk7XG5leHBvcnQgY29uc3QgUElDVFVSRSAgICA9IEUoJ3BpY3R1cmUnKTtcbmV4cG9ydCBjb25zdCBQUkUgICAgICAgID0gRSgncHJlJyk7XG5leHBvcnQgY29uc3QgUFJPR1JFU1MgICA9IEUoJ3Byb2dyZXNzJyk7XG5leHBvcnQgY29uc3QgUSAgICAgICAgICA9IEUoJ3EnKTtcbmV4cG9ydCBjb25zdCBSUCAgICAgICAgID0gRSgncnAnKTtcbmV4cG9ydCBjb25zdCBSVCAgICAgICAgID0gRSgncnQnKTtcbmV4cG9ydCBjb25zdCBSVUJZICAgICAgID0gRSgncnVieScpO1xuZXhwb3J0IGNvbnN0IFMgICAgICAgICAgPSBFKCdzJyk7XG5leHBvcnQgY29uc3QgU0FNUCAgICAgICA9IEUoJ3NhbXAnKTtcbmV4cG9ydCBjb25zdCBTQ1JJUFQgICAgID0gRSgnc2NyaXB0Jyk7XG5leHBvcnQgY29uc3QgU0VDVElPTiAgICA9IEUoJ3NlY3Rpb24nKTtcbmV4cG9ydCBjb25zdCBTRUxFQ1QgICAgID0gRSgnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3QgU0xPVCAgICAgICA9IEUoJ3Nsb3QnKTtcbmV4cG9ydCBjb25zdCBTTUFMTCAgICAgID0gRSgnc21hbGwnKTtcbmV4cG9ydCBjb25zdCBTT1VSQ0UgICAgID0gRSgnc291cmNlJyk7XG5leHBvcnQgY29uc3QgU1BBTiAgICAgICA9IEUoJ3NwYW4nKTtcbmV4cG9ydCBjb25zdCBTVFJPTkcgICAgID0gRSgnc3Ryb25nJyk7XG5leHBvcnQgY29uc3QgU1RZTEUgICAgICA9IEUoJ3N0eWxlJyk7XG5leHBvcnQgY29uc3QgU1VCICAgICAgICA9IEUoJ3N1YicpO1xuZXhwb3J0IGNvbnN0IFNVTU1BUlkgICAgPSBFKCdzdW1tYXJ5Jyk7XG5leHBvcnQgY29uc3QgU1VQICAgICAgICA9IEUoJ3N1cCcpO1xuZXhwb3J0IGNvbnN0IFRBQkxFICAgICAgPSBFKCd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IFRCT0RZICAgICAgPSBFKCd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IFREICAgICAgICAgPSBFKCd0ZCcpO1xuZXhwb3J0IGNvbnN0IFRFTVBMQVRFICAgPSBFKCd0ZW1wbGF0ZScpO1xuZXhwb3J0IGNvbnN0IFRFWFRBUkVBICAgPSBFKCd0ZXh0YXJlYScpO1xuZXhwb3J0IGNvbnN0IFRGT09UICAgICAgPSBFKCd0Zm9vdCcpO1xuZXhwb3J0IGNvbnN0IFRIICAgICAgICAgPSBFKCd0aCcpO1xuZXhwb3J0IGNvbnN0IFRIRUFEICAgICAgPSBFKCd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IFRJTUUgICAgICAgPSBFKCd0aW1lJyk7XG5leHBvcnQgY29uc3QgVElUTEUgICAgICA9IEUoJ3RpdGxlJyk7XG5leHBvcnQgY29uc3QgVFIgICAgICAgICA9IEUoJ3RyJyk7XG5leHBvcnQgY29uc3QgVFJBQ0sgICAgICA9IEUoJ3RyYWNrJyk7XG5leHBvcnQgY29uc3QgVSAgICAgICAgICA9IEUoJ3UnKTtcbmV4cG9ydCBjb25zdCBVTCAgICAgICAgID0gRSgndWwnKTtcbmV4cG9ydCBjb25zdCBWQVIgICAgICAgID0gRSgndmFyJyk7XG5leHBvcnQgY29uc3QgVklERU8gICAgICA9IEUoJ3ZpZGVvJyk7XG5leHBvcnQgY29uc3QgV0JSICAgICAgICA9IEUoJ3dicicpO1xuXG5leHBvcnQgY29uc3QgU1ZHX0VMRU1FTlRfTkFNRVMgPSBbXTtcblxuY29uc3QgU0UgPSAodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMpID0+IHtcbiAgU1ZHX0VMRU1FTlRfTkFNRVMucHVzaCh0YWdOYW1lKTtcbiAgcmV0dXJuIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKTtcbn07XG5cbi8vIFNWRyBlbGVtZW50IG5hbWVzXG5leHBvcnQgY29uc3QgQUxUR0xZUEggICAgICAgICAgICAgPSBTRSgnYWx0Z2x5cGgnKTtcbmV4cG9ydCBjb25zdCBBTFRHTFlQSERFRiAgICAgICAgICA9IFNFKCdhbHRnbHlwaGRlZicpO1xuZXhwb3J0IGNvbnN0IEFMVEdMWVBISVRFTSAgICAgICAgID0gU0UoJ2FsdGdseXBoaXRlbScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVEUgICAgICAgICAgICAgID0gU0UoJ2FuaW1hdGUnKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFQ09MT1IgICAgICAgICA9IFNFKCdhbmltYXRlQ29sb3InKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFTU9USU9OICAgICAgICA9IFNFKCdhbmltYXRlTW90aW9uJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURVRSQU5TRk9STSAgICAgPSBTRSgnYW5pbWF0ZVRyYW5zZm9ybScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTiAgICAgICAgICAgID0gU0UoJ2FuaW1hdGlvbicpO1xuZXhwb3J0IGNvbnN0IENJUkNMRSAgICAgICAgICAgICAgID0gU0UoJ2NpcmNsZScpO1xuZXhwb3J0IGNvbnN0IENMSVBQQVRIICAgICAgICAgICAgID0gU0UoJ2NsaXBQYXRoJyk7XG5leHBvcnQgY29uc3QgQ09MT1JQUk9GSUxFICAgICAgICAgPSBTRSgnY29sb3JQcm9maWxlJyk7XG5leHBvcnQgY29uc3QgQ1VSU09SICAgICAgICAgICAgICAgPSBTRSgnY3Vyc29yJyk7XG5leHBvcnQgY29uc3QgREVGUyAgICAgICAgICAgICAgICAgPSBTRSgnZGVmcycpO1xuZXhwb3J0IGNvbnN0IERFU0MgICAgICAgICAgICAgICAgID0gU0UoJ2Rlc2MnKTtcbmV4cG9ydCBjb25zdCBESVNDQVJEICAgICAgICAgICAgICA9IFNFKCdkaXNjYXJkJyk7XG5leHBvcnQgY29uc3QgRUxMSVBTRSAgICAgICAgICAgICAgPSBTRSgnZWxsaXBzZScpO1xuZXhwb3J0IGNvbnN0IEZFQkxFTkQgICAgICAgICAgICAgID0gU0UoJ2ZlYmxlbmQnKTtcbmV4cG9ydCBjb25zdCBGRUNPTE9STUFUUklYICAgICAgICA9IFNFKCdmZWNvbG9ybWF0cml4Jyk7XG5leHBvcnQgY29uc3QgRkVDT01QT05FTlRUUkFOU0ZFUiAgPSBTRSgnZmVjb21wb25lbnR0cmFuc2ZlcicpO1xuZXhwb3J0IGNvbnN0IEZFQ09NUE9TSVRFICAgICAgICAgID0gU0UoJ2ZlY29tcG9zaXRlJyk7XG5leHBvcnQgY29uc3QgRkVDT05WT0xWRU1BVFJJWCAgICAgPSBTRSgnZmVjb252b2x2ZW1hdHJpeCcpO1xuZXhwb3J0IGNvbnN0IEZFRElGRlVTRUxJR0hUSU5HICAgID0gU0UoJ2ZlZGlmZnVzZWxpZ2h0aW5nJyk7XG5leHBvcnQgY29uc3QgRkVESVNQTEFDRU1FTlRNQVAgICAgPSBTRSgnZmVkaXNwbGFjZW1lbnRtYXAnKTtcbmV4cG9ydCBjb25zdCBGRURJU1RBTlRMSUdIVCAgICAgICA9IFNFKCdmZWRpc3RhbnRsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFRFJPUFNIQURPVyAgICAgICAgID0gU0UoJ2ZlZHJvcHNoYWRvdycpO1xuZXhwb3J0IGNvbnN0IEZFRkxPT0QgICAgICAgICAgICAgID0gU0UoJ2ZlZmxvb2QnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNBICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNhJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DQiAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jYicpO1xuZXhwb3J0IGNvbnN0IEZFRlVOQ0cgICAgICAgICAgICAgID0gU0UoJ2ZlZnVuY2cnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNSICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNyJyk7XG5leHBvcnQgY29uc3QgRkVHQVVTU0lBTkJMVVIgICAgICAgPSBTRSgnZmVnYXVzc2lhbmJsdXInKTtcbmV4cG9ydCBjb25zdCBGRUlNQUdFICAgICAgICAgICAgICA9IFNFKCdmZWltYWdlJyk7XG5leHBvcnQgY29uc3QgRkVNRVJHRSAgICAgICAgICAgICAgPSBTRSgnZmVtZXJnZScpO1xuZXhwb3J0IGNvbnN0IEZFTUVSR0VOT0RFICAgICAgICAgID0gU0UoJ2ZlbWVyZ2Vub2RlJyk7XG5leHBvcnQgY29uc3QgRkVNT1JQSE9MT0dZICAgICAgICAgPSBTRSgnZmVtb3JwaG9sb2d5Jyk7XG5leHBvcnQgY29uc3QgRkVPRkZTRVQgICAgICAgICAgICAgPSBTRSgnZmVvZmZzZXQnKTtcbmV4cG9ydCBjb25zdCBGRVBPSU5UTElHSFQgICAgICAgICA9IFNFKCdmZXBvaW50bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRVNQRUNVTEFSTElHSFRJTkcgICA9IFNFKCdmZXNwZWN1bGFybGlnaHRpbmcnKTtcbmV4cG9ydCBjb25zdCBGRVNQT1RMSUdIVCAgICAgICAgICA9IFNFKCdmZXNwb3RsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFVElMRSAgICAgICAgICAgICAgID0gU0UoJ2ZldGlsZScpO1xuZXhwb3J0IGNvbnN0IEZFVFVSQlVMRU5DRSAgICAgICAgID0gU0UoJ2ZldHVyYnVsZW5jZScpO1xuZXhwb3J0IGNvbnN0IEZJTFRFUiAgICAgICAgICAgICAgID0gU0UoJ2ZpbHRlcicpO1xuZXhwb3J0IGNvbnN0IEZPTlQgICAgICAgICAgICAgICAgID0gU0UoJ2ZvbnQnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRSAgICAgICAgICAgICA9IFNFKCdmb250RmFjZScpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFRk9STUFUICAgICAgID0gU0UoJ2ZvbnRGYWNlRm9ybWF0Jyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VOQU1FICAgICAgICAgPSBTRSgnZm9udEZhY2VOYW1lJyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VTUkMgICAgICAgICAgPSBTRSgnZm9udEZhY2VTcmMnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRVVSSSAgICAgICAgICA9IFNFKCdmb250RmFjZVVyaScpO1xuZXhwb3J0IGNvbnN0IEZPUkVJR05PQkpFQ1QgICAgICAgID0gU0UoJ2ZvcmVpZ25PYmplY3QnKTtcbmV4cG9ydCBjb25zdCBHICAgICAgICAgICAgICAgICAgICA9IFNFKCdnJyk7XG5leHBvcnQgY29uc3QgR0xZUEggICAgICAgICAgICAgICAgPSBTRSgnZ2x5cGgnKTtcbmV4cG9ydCBjb25zdCBHTFlQSFJFRiAgICAgICAgICAgICA9IFNFKCdnbHlwaFJlZicpO1xuZXhwb3J0IGNvbnN0IEhBTkRMRVIgICAgICAgICAgICAgID0gU0UoJ2hhbmRsZXInKTtcbmV4cG9ydCBjb25zdCBIS0VSTiAgICAgICAgICAgICAgICA9IFNFKCdoS2VybicpO1xuZXhwb3J0IGNvbnN0IElNQUdFICAgICAgICAgICAgICAgID0gU0UoJ2ltYWdlJyk7XG5leHBvcnQgY29uc3QgTElORSAgICAgICAgICAgICAgICAgPSBTRSgnbGluZScpO1xuZXhwb3J0IGNvbnN0IExJTkVBUkdSQURJRU5UICAgICAgID0gU0UoJ2xpbmVhcmdyYWRpZW50Jyk7XG5leHBvcnQgY29uc3QgTElTVEVORVIgICAgICAgICAgICAgPSBTRSgnbGlzdGVuZXInKTtcbmV4cG9ydCBjb25zdCBNQVJLRVIgICAgICAgICAgICAgICA9IFNFKCdtYXJrZXInKTtcbmV4cG9ydCBjb25zdCBNQVNLICAgICAgICAgICAgICAgICA9IFNFKCdtYXNrJyk7XG5leHBvcnQgY29uc3QgTUVUQURBVEEgICAgICAgICAgICAgPSBTRSgnbWV0YWRhdGEnKTtcbmV4cG9ydCBjb25zdCBNSVNTSU5HR0xZUEggICAgICAgICA9IFNFKCdtaXNzaW5nR2x5cGgnKTtcbmV4cG9ydCBjb25zdCBNUEFUSCAgICAgICAgICAgICAgICA9IFNFKCdtUGF0aCcpO1xuZXhwb3J0IGNvbnN0IFBBVEggICAgICAgICAgICAgICAgID0gU0UoJ3BhdGgnKTtcbmV4cG9ydCBjb25zdCBQQVRURVJOICAgICAgICAgICAgICA9IFNFKCdwYXR0ZXJuJyk7XG5leHBvcnQgY29uc3QgUE9MWUdPTiAgICAgICAgICAgICAgPSBTRSgncG9seWdvbicpO1xuZXhwb3J0IGNvbnN0IFBPTFlMSU5FICAgICAgICAgICAgID0gU0UoJ3BvbHlsaW5lJyk7XG5leHBvcnQgY29uc3QgUFJFRkVUQ0ggICAgICAgICAgICAgPSBTRSgncHJlZmV0Y2gnKTtcbmV4cG9ydCBjb25zdCBSQURJQUxHUkFESUVOVCAgICAgICA9IFNFKCdyYWRpYWxncmFkaWVudCcpO1xuZXhwb3J0IGNvbnN0IFJFQ1QgICAgICAgICAgICAgICAgID0gU0UoJ3JlY3QnKTtcbmV4cG9ydCBjb25zdCBTRVQgICAgICAgICAgICAgICAgICA9IFNFKCdzZXQnKTtcbmV4cG9ydCBjb25zdCBTT0xJRENPTE9SICAgICAgICAgICA9IFNFKCdzb2xpZENvbG9yJyk7XG5leHBvcnQgY29uc3QgU1RPUCAgICAgICAgICAgICAgICAgPSBTRSgnc3RvcCcpO1xuZXhwb3J0IGNvbnN0IFNWRyAgICAgICAgICAgICAgICAgID0gU0UoJ3N2ZycpO1xuZXhwb3J0IGNvbnN0IFNXSVRDSCAgICAgICAgICAgICAgID0gU0UoJ3N3aXRjaCcpO1xuZXhwb3J0IGNvbnN0IFNZTUJPTCAgICAgICAgICAgICAgID0gU0UoJ3N5bWJvbCcpO1xuZXhwb3J0IGNvbnN0IFRCUkVBSyAgICAgICAgICAgICAgID0gU0UoJ3RicmVhaycpO1xuZXhwb3J0IGNvbnN0IFRFWFQgICAgICAgICAgICAgICAgID0gU0UoJ3RleHQnKTtcbmV4cG9ydCBjb25zdCBURVhUUEFUSCAgICAgICAgICAgICA9IFNFKCd0ZXh0cGF0aCcpO1xuZXhwb3J0IGNvbnN0IFRSRUYgICAgICAgICAgICAgICAgID0gU0UoJ3RyZWYnKTtcbmV4cG9ydCBjb25zdCBUU1BBTiAgICAgICAgICAgICAgICA9IFNFKCd0c3BhbicpO1xuZXhwb3J0IGNvbnN0IFVOS05PV04gICAgICAgICAgICAgID0gU0UoJ3Vua25vd24nKTtcbmV4cG9ydCBjb25zdCBVU0UgICAgICAgICAgICAgICAgICA9IFNFKCd1c2UnKTtcbmV4cG9ydCBjb25zdCBWSUVXICAgICAgICAgICAgICAgICA9IFNFKCd2aWV3Jyk7XG5leHBvcnQgY29uc3QgVktFUk4gICAgICAgICAgICAgICAgPSBTRSgndktlcm4nKTtcblxuY29uc3QgU1ZHX1JFID0gbmV3IFJlZ0V4cChgXigke1NWR19FTEVNRU5UX05BTUVTLmpvaW4oJ3wnKX0pJGAsICdpJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gU1ZHX1JFLnRlc3QodGFnTmFtZSk7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICByZXF1aXJlLFxufSBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcic7XG5cbiAgc2V0IGF0dHIkbGFuZyhbIG9sZFZhbHVlLCBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVMYW5nQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Rlcm1zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIHB1Ymxpc2hDb250ZXh0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpMThuOiAoX3BhdGgsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgICAgICBsZXQgcGF0aCAgICA9IGBnbG9iYWwuaTE4bi4ke19wYXRofWA7XG4gICAgICAgIGxldCByZXN1bHQgID0gVXRpbHMuZmV0Y2hQYXRoKHRoaXMudGVybXMsIHBhdGgpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgICAgICByZXR1cm4gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIHBhdGgsIChkZWZhdWx0VmFsdWUgPT0gbnVsbCkgPyAnJyA6IGRlZmF1bHRWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGdldFNvdXJjZUZvckxhbmcobGFuZykge1xuICAgIHJldHVybiB0aGlzLiQoYHNvdXJjZVt0eXBlXj1cImxhbmcvXCIgaV1bbGFuZ149XCIke2xhbmcucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApWzBdO1xuICB9XG5cbiAgaGFuZGxlTGFuZ0F0dHJpYnV0ZUNoYW5nZShfbGFuZykge1xuICAgIGxldCBsYW5nICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudCA9IHRoaXMuZ2V0U291cmNlRm9yTGFuZyhsYW5nKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnQgfHwgIXNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBObyBcInNvdXJjZVwiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkTGFuZ3VhZ2VUZXJtcyhsYW5nLCBzb3VyY2VFbGVtZW50KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRMYW5ndWFnZVRlcm1zKGxhbmcsIHNvdXJjZUVsZW1lbnQsIF9vcHRpb25zKSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IHJlcXVpcmUuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsIHNyYyk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgYXdhaXQgcmVzcG9uc2UuanNvbigpKTtcblxuICAgICAgY29uc29sZS5sb2coJ0NvbXBpbGVkIHRlcm1zOiAnLCBjb21waWxlZFRlcm1zKTtcblxuICAgICAgdGhpcy50ZXJtcyA9IGNvbXBpbGVkVGVybXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVMYW5ndWFnZVRlcm1zKGxhbmcsIHRlcm1zKSB7XG4gICAgY29uc3Qgd2Fsa1Rlcm1zID0gKHRlcm1zLCByYXdLZXlQYXRoKSA9PiB7XG4gICAgICBsZXQga2V5cyAgICAgID0gT2JqZWN0LmtleXModGVybXMpO1xuICAgICAgbGV0IHRlcm1zQ29weSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGtleSAgICAgICAgID0ga2V5c1tpXTtcbiAgICAgICAgbGV0IHZhbHVlICAgICAgID0gdGVybXNba2V5XTtcbiAgICAgICAgbGV0IG5ld0tleVBhdGggID0gcmF3S2V5UGF0aC5jb25jYXQoa2V5KTtcblxuICAgICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdCh2YWx1ZSkgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHdhbGtUZXJtcyh2YWx1ZSwgbmV3S2V5UGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIG5ld0tleVBhdGguam9pbignLicpLCB2YWx1ZSk7XG4gICAgICAgICAgdGVybXNDb3B5W2tleV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgICBwcm9wZXJ0eS5zZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXJtc0NvcHk7XG4gICAgfTtcblxuICAgIHJldHVybiB3YWxrVGVybXModGVybXMsIFsgJ2dsb2JhbCcsICdpMThuJyBdKTtcbiAgfVxufVxuXG5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciA9IE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlcjtcbiIsImltcG9ydCAqIGFzIENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgVEVNUExBVEVfVEVNUExBVEUgPSAvXihcXCp8XFx8XFwqfFxcKlxcfCkkLztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJUmVxdWlyZSBleHRlbmRzIENvbXBvbmVudC5NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQge1xuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBjYWNoZWQsXG4gICAgICB9ID0gYXdhaXQgQ29tcG9uZW50LnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXNIYW5kbGVkICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJlUHJvY2Vzc1RlbXBsYXRlOiAoeyB0ZW1wbGF0ZSwgY2hpbGRyZW4gfSkgPT4ge1xuICAgICAgICAgICAgbGV0IHN0YXJUZW1wbGF0ZSA9IGNoaWxkcmVuLmZpbmQoKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgIGxldCBkYXRhRm9yID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpO1xuICAgICAgICAgICAgICByZXR1cm4gKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkgJiYgVEVNUExBVEVfVEVNUExBVEUudGVzdChkYXRhRm9yKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFzdGFyVGVtcGxhdGUpXG4gICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcblxuICAgICAgICAgICAgbGV0IGRhdGFGb3IgPSBzdGFyVGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpO1xuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBzdGFyVGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIGxldCBzdGFyQ2xvbmUgPSBzdGFyVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFGb3IgPT09ICcqfCcpXG4gICAgICAgICAgICAgICAgICBjaGlsZC5jb250ZW50Lmluc2VydEJlZm9yZShzdGFyQ2xvbmUsIGNoaWxkLmNvbnRlbnQuY2hpbGROb2Rlc1swXSB8fCBudWxsKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBjaGlsZC5jb250ZW50LmFwcGVuZENoaWxkKHN0YXJDbG9uZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhclRlbXBsYXRlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3RhclRlbXBsYXRlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1yZXF1aXJlXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKCkge1xuICAgIC8vIE5PT1BcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlSZXF1aXJlO1xuXG5pZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiAhY3VzdG9tRWxlbWVudHMuZ2V0KCdteXRoaXgtcmVxdWlyZScpKVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ215dGhpeC1yZXF1aXJlJywgTXl0aGl4VUlSZXF1aXJlKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuaW1wb3J0IHsgTXl0aGl4VUlDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbi8qXG5NYW55IHRoYW5rcyB0byBTYWdlZSBDb253YXkgZm9yIHRoZSBmb2xsb3dpbmcgQ1NTIHNwaW5uZXJzXG5odHRwczovL2NvZGVwZW4uaW8vc2Fjb253YXkvcGVuL3ZZS1l5cnhcbiovXG5cbmNvbnN0IFNUWUxFX1NIRUVUID1cbmBcbjpob3N0IHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiAxZW07XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbjpob3N0KC5zbWFsbCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMC43NSk7XG59XG46aG9zdCgubWVkaXVtKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAxLjUpO1xufVxuOmhvc3QoLmxhcmdlKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAzKTtcbn1cbi5zcGlubmVyLWl0ZW0sXG4uc3Bpbm5lci1pdGVtOjpiZWZvcmUsXG4uc3Bpbm5lci1pdGVtOjphZnRlciB7XG5cdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA2MCU7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWF1ZGlvLWFuaW1hdGlvbiB7XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4yNSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzczogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMDc1KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgYm9yZGVyOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAxLjApO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSAqIDAuMDc1KSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC43KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLWJvdHRvbTogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuODc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC40KTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuNzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpKSByb3RhdGUoNDVkZWcpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIuNSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMSB7XG4gIDAlLCA4LjMzJSwgMTYuNjYlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDI0Ljk5JSwgMzMuMzIlLCA0MS42NSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDAlKTtcbiAgfVxuICA0OS45OCUsIDU4LjMxJSwgNjYuNjQlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAxMDAlKTtcbiAgfVxuICA3NC45NyUsIDgzLjMwJSwgOTEuNjMlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogMDtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMiB7XG4gIDAlLCA4LjMzJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMCUpO1xuICB9XG4gIDE2LjY2JSwgMjQuOTklLCAzMy4zMiUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxuICA0MS42NSUsIDQ5Ljk4JSwgNTguMzElIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMTAwJSk7XG4gIH1cbiAgNjYuNjQlLCA3NC45NyUsIDgzLjMwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIHtcbiAgMCUsIDgzLjMwJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwKTtcbiAgfVxuICA4LjMzJSwgMTYuNjYlLCAyNC45OSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwKTtcbiAgfVxuICAzMy4zMiUsIDQxLjY1JSwgNDkuOTglIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgLTEwMCUpO1xuICB9XG4gIDU4LjMxJSwgNjYuNjQlLCA3NC45NyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC0xMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyA0KTtcbiAgbWluLXdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDc1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTc1JSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMSk7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiB7XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDIpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAzKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogNCk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC4yNSk7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAzLjApIC8gLTIpO1xufVxuYDtcblxuY29uc3QgS0lORFMgPSB7XG4gICdhdWRpbyc6ICA1LFxuICAnY2lyY2xlJzogMyxcbiAgJ2RvdCc6ICAgIDIsXG4gICdwaXBlJzogICA1LFxuICAncHV6emxlJzogMyxcbiAgJ3dhdmUnOiAgIDMsXG59O1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlTcGlubmVyIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgdGFnTmFtZSA9ICdteXRoaXgtc3Bpbm5lcic7XG5cbiAgc2V0IGF0dHIka2luZChbIF8sIG5ld1ZhbHVlIF0pIHtcbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCkge1xuICAgICAgLy8gYXBwZW5kIHRlbXBsYXRlXG4gICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIHRoaXMuYnVpbGQoKHsgVEVNUExBVEUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gVEVNUExBVEVcbiAgICAgICAgICAuZGF0YU15dGhpeE5hbWUodGhpcy5zZW5zaXRpdmVUYWdOYW1lKVxuICAgICAgICAgIC5wcm9wJGlubmVySFRNTChgPHN0eWxlPiR7U1RZTEVfU0hFRVR9PC9zdHlsZT5gKTtcbiAgICAgIH0pLmFwcGVuZFRvKG93bmVyRG9jdW1lbnQuYm9keSk7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00odGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGxldCBraW5kID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2tpbmQnKTtcbiAgICBpZiAoIWtpbmQpIHtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgna2luZCcsIGtpbmQpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShraW5kKTtcbiAgfVxuXG4gIGhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UoX2tpbmQpIHtcbiAgICBsZXQga2luZCAgICAgICAgPSAoJycgKyBfa2luZCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChLSU5EUywga2luZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtc3Bpbm5lclwiIHVua25vd24gXCJraW5kXCIgcHJvdmlkZWQ6IFwiJHtraW5kfVwiLiBTdXBwb3J0ZWQgXCJraW5kXCIgYXR0cmlidXRlIHZhbHVlcyBhcmU6IFwicGlwZVwiLCBcImF1ZGlvXCIsIFwiY2lyY2xlXCIsIFwicHV6emxlXCIsIFwid2F2ZVwiLCBhbmQgXCJkb3RcIi5gKTtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VTcGlubmVyQ2hpbGRyZW4oS0lORFNba2luZF0pO1xuICB9XG5cbiAgYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICBsZXQgY2hpbGRyZW4gICAgICA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXItaXRlbScpO1xuXG4gICAgICBjaGlsZHJlbltpXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJChjaGlsZHJlbik7XG4gIH1cblxuICBjaGFuZ2VTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICB0aGlzLiQoJy5zcGlubmVyLWl0ZW0nKS5yZW1vdmUoKTtcbiAgICB0aGlzLmJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG5cbiAgICAvLyBBbHdheXMgYXBwZW5kIHN0eWxlIGFnYWluLCBzb1xuICAgIC8vIHRoYXQgaXQgaXMgdGhlIGxhc3QgY2hpbGQsIGFuZFxuICAgIC8vIGRvZXNuJ3QgbWVzcyB3aXRoIFwibnRoLWNoaWxkXCJcbiAgICAvLyBzZWxlY3RvcnNcbiAgICB0aGlzLiQoJ3N0eWxlJykuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuICB9XG59XG5cbk15dGhpeFVJU3Bpbm5lci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlTcGlubmVyO1xuIiwiaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuY29uc3QgSVNfSU5URUdFUiA9IC9eXFxkKyQvO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gV2UgaGF2ZSBhbiBFbGVtZW50IG9yIGEgRG9jdW1lbnRcbiAgaWYgKHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1Nsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBpc05vdFNsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICFlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENsYXNzTmFtZXMoLi4uYXJncykge1xuICBsZXQgY2xhc3NOYW1lcyA9IFtdLmNvbmNhdCguLi5hcmdzKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAubWFwKChwYXJ0KSA9PiAoJycgKyBwYXJ0KS5zcGxpdCgvXFxzKy8pKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBjbGFzc05hbWVzO1xufVxuXG5leHBvcnQgY2xhc3MgUXVlcnlFbmdpbmUge1xuICBzdGF0aWMgaXNFbGVtZW50ICAgID0gaXNFbGVtZW50O1xuICBzdGF0aWMgaXNTbG90dGVkICAgID0gaXNTbG90dGVkO1xuICBzdGF0aWMgaXNOb3RTbG90dGVkID0gaXNOb3RTbG90dGVkO1xuXG4gIHN0YXRpYyBmcm9tID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoW10sIHsgcm9vdDogKGlzRWxlbWVudCh0aGlzKSkgPyB0aGlzIDogZG9jdW1lbnQsIGNvbnRleHQ6IHRoaXMgfSk7XG5cbiAgICBjb25zdCBnZXRPcHRpb25zID0gKCkgPT4ge1xuICAgICAgbGV0IGJhc2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihiYXNlLCBhcmdzW2FyZ0luZGV4KytdKTtcblxuICAgICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXhdLmdldE9wdGlvbnMoKSB8fCB7fSwgYmFzZSk7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSb290RWxlbWVudCA9IChvcHRpb25zUm9vdCkgPT4ge1xuICAgICAgaWYgKGlzRWxlbWVudChvcHRpb25zUm9vdCkpXG4gICAgICAgIHJldHVybiBvcHRpb25zUm9vdDtcblxuICAgICAgaWYgKGlzRWxlbWVudCh0aGlzKSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHJldHVybiAoKHRoaXMgJiYgdGhpcy5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudCk7XG4gICAgfTtcblxuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBnZXRPcHRpb25zKCk7XG4gICAgbGV0IHJvb3QgICAgICA9IGdldFJvb3RFbGVtZW50KG9wdGlvbnMucm9vdCk7XG4gICAgbGV0IHF1ZXJ5RW5naW5lO1xuXG4gICAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgdGhpcztcblxuICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XS5zbGljZSgpLCBvcHRpb25zKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbYXJnSW5kZXhdKSkge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4ICsgMV0sICdGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1sxXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnU3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJvb3QucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdGdW5jdGlvbicpKSB7XG4gICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cywgb3B0aW9ucyk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbnZva2VDYWxsYmFja3MgIT09IGZhbHNlICYmIHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfTtcblxuICBnZXRFbmdpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gUXVlcnlFbmdpbmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSU9wdGlvbnMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnX215dGhpeFVJRWxlbWVudHMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5maWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhvcHRpb25zLmNvbnRleHQsIGVsZW1lbnRzKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wTmFtZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdsZW5ndGgnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5wcm90b3R5cGU7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gSW5kZXggbG9va3VwXG4gICAgICAgIGlmIChJU19JTlRFR0VSLnRlc3QocHJvcE5hbWUpKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG5cbiAgICAgICAgLy8gUmVkaXJlY3QgYW55IGFycmF5IG1ldGhvZHM6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFwibWFnaWNQcm9wTmFtZVwiIGlzIHdoZW4gdGhlXG4gICAgICAgIC8vIGZ1bmN0aW9uIG5hbWUgYmVnaW5zIHdpdGggXCIkXCIsXG4gICAgICAgIC8vIGkuZS4gXCIkZmlsdGVyXCIsIG9yIFwiJG1hcFwiLiBJZlxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjYXNlLCB0aGVuIHRoZSByZXR1cm5cbiAgICAgICAgLy8gdmFsdWUgd2lsbCBhbHdheXMgYmUgY29lcmNlZCBpbnRvXG4gICAgICAgIC8vIGEgUXVlcnlFbmdpbmUuIE90aGVyd2lzZSwgaXQgd2lsbFxuICAgICAgICAvLyBvbmx5IGJlIGNvZXJjZWQgaW50byBhIFF1ZXJ5RW5naW5lXG4gICAgICAgIC8vIGlmIEVWRVJZIGVsZW1lbnQgaW4gdGhlIHJlc3VsdCBpc1xuICAgICAgICAvLyBhbiBcImVsZW1lbnR5XCIgdHlwZSB2YWx1ZS5cbiAgICAgICAgbGV0IG1hZ2ljUHJvcE5hbWUgPSAocHJvcE5hbWUuY2hhckF0KDApID09PSAnJCcpID8gcHJvcE5hbWUuc3Vic3RyaW5nKDEpIDogcHJvcE5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlW21hZ2ljUHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgICA9IHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cztcbiAgICAgICAgICAgIGxldCByZXN1bHQgID0gYXJyYXlbbWFnaWNQcm9wTmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkgJiYgKG1hZ2ljUHJvcE5hbWUgIT09IHByb3BOYW1lIHx8IHJlc3VsdC5ldmVyeSgoaXRlbSkgPT4gVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uLCBOb2RlLCBRdWVyeUVuZ2luZSkpKSkge1xuICAgICAgICAgICAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRhcmdldC5nZXRFbmdpbmVDbGFzcygpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHJlc3VsdCwgdGFyZ2V0LmdldE9wdGlvbnMoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByb290UHJveHk7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSU9wdGlvbnM7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5yb290IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZ2V0VW5kZXJseWluZ0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuICB9XG5cbiAgZ2V0T3duZXJEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSb290KCkub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKGNvbnRleHQsIGVsZW1lbnRzKSB7XG4gICAgbGV0IGZpbmFsRWxlbWVudHMgPSBBcnJheS5mcm9tKGVsZW1lbnRzKS5mbGF0KEluZmluaXR5KS5tYXAoKF9pdGVtKSA9PiB7XG4gICAgICBpZiAoIV9pdGVtKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBpdGVtID0gX2l0ZW07XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICByZXR1cm4gaXRlbS5nZXRVbmRlcmx5aW5nQXJyYXkoKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCBOb2RlKSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgIGlmIChpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIGl0ZW0gPSBpdGVtKCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgJ1N0cmluZycpKVxuICAgICAgICBpdGVtID0gRWxlbWVudHMuVGVybShpdGVtKTtcbiAgICAgIGVsc2UgaWYgKCFVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24pKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmICghY29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJjb250ZXh0XCIgb3B0aW9uIGZvciBRdWVyeUVuZ2luZSBpcyByZXF1aXJlZCB3aGVuIGNvbnN0cnVjdGluZyBlbGVtZW50cy4nKTtcblxuICAgICAgcmV0dXJuIGl0ZW0uYnVpbGQodGhpcy5nZXRPd25lckRvY3VtZW50KCksIGNvbnRleHQpO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgJCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgdGhpcy5nZXRPcHRpb25zKCksIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy4kKFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1swXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkpKTtcbiAgfVxuXG4gIGxhc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIVV0aWxzLmlzVHlwZShjb3VudCwgJ051bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuJChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkgKiAtMSkpO1xuICB9XG5cbiAgYWRkKC4uLmVsZW1lbnRzKSB7XG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLnNsaWNlKCkuY29uY2F0KC4uLmVsZW1lbnRzKSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgc3VidHJhY3QoLi4uZWxlbWVudHMpIHtcbiAgICBsZXQgc2V0ID0gbmV3IFNldChlbGVtZW50cyk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gIXNldC5oYXMoaXRlbSk7XG4gICAgfSksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYXBwZW5kVG8oc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgfVxuXG4gIGluc2VydEludG8oc2VsZWN0b3JPckVsZW1lbnQsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5nZXRPd25lckRvY3VtZW50KCk7XG4gICAgbGV0IHNvdXJjZSAgICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cbiAgICAgIHNvdXJjZSA9IFsgZnJhZ21lbnQgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50Lmluc2VydChzb3VyY2VbMF0sIHJlZmVyZW5jZU5vZGUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXBsYWNlQ2hpbGRyZW5PZihzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBlbmRUbyhlbGVtZW50KTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xhc3NMaXN0KG9wZXJhdGlvbiwgLi4uYXJncykge1xuICAgIGxldCBjbGFzc05hbWVzID0gY29sbGVjdENsYXNzTmFtZXMoYXJncyk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAndG9nZ2xlJylcbiAgICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4gbm9kZS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZS5jbGFzc0xpc3Rbb3BlcmF0aW9uXSguLi5jbGFzc05hbWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ2FkZCcsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgncmVtb3ZlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICB0b2dnbGVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCd0b2dnbGUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHNsb3R0ZWQoeWVzTm8pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgeWVzTm8pID8gaXNTbG90dGVkIDogaXNOb3RTbG90dGVkKTtcbiAgfVxuXG4gIHNsb3Qoc2xvdE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuc2xvdCA9PT0gc2xvdE5hbWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAoZWxlbWVudC5jbG9zZXN0KGBzbG90W25hbWU9XCIke3Nsb3ROYW1lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuUXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFNIQTI1NihfaW5wdXQpIHtcbiAgbGV0IGlucHV0ID0gX2lucHV0O1xuXG4gIGxldCBtYXRoUG93ID0gTWF0aC5wb3c7XG4gIGxldCBtYXhXb3JkID0gbWF0aFBvdygyLCAzMik7XG4gIGxldCBsZW5ndGhQcm9wZXJ0eSA9ICdsZW5ndGgnO1xuICBsZXQgaTsgbGV0IGo7IC8vIFVzZWQgYXMgYSBjb3VudGVyIGFjcm9zcyB0aGUgd2hvbGUgZmlsZVxuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgbGV0IHdvcmRzID0gW107XG4gIGxldCBhc2NpaUJpdExlbmd0aCA9IGlucHV0W2xlbmd0aFByb3BlcnR5XSAqIDg7XG5cbiAgLy8qIGNhY2hpbmcgcmVzdWx0cyBpcyBvcHRpb25hbCAtIHJlbW92ZS9hZGQgc2xhc2ggZnJvbSBmcm9udCBvZiB0aGlzIGxpbmUgdG8gdG9nZ2xlXG4gIC8vIEluaXRpYWwgaGFzaCB2YWx1ZTogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lc1xuICAvLyAod2UgYWN0dWFsbHkgY2FsY3VsYXRlIHRoZSBmaXJzdCA2NCwgYnV0IGV4dHJhIHZhbHVlcyBhcmUganVzdCBpZ25vcmVkKVxuICBsZXQgaGFzaCA9IFNIQTI1Ni5oID0gU0hBMjU2LmggfHwgW107XG4gIC8vIFJvdW5kIGNvbnN0YW50czogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgY3ViZSByb290cyBvZiB0aGUgZmlyc3QgNjQgcHJpbWVzXG4gIGxldCBrID0gU0hBMjU2LmsgPSBTSEEyNTYuayB8fCBbXTtcbiAgbGV0IHByaW1lQ291bnRlciA9IGtbbGVuZ3RoUHJvcGVydHldO1xuICAvKi9cbiAgICBsZXQgaGFzaCA9IFtdLCBrID0gW107XG4gICAgbGV0IHByaW1lQ291bnRlciA9IDA7XG4gICAgLy8qL1xuXG4gIGxldCBpc0NvbXBvc2l0ZSA9IHt9O1xuICBmb3IgKGxldCBjYW5kaWRhdGUgPSAyOyBwcmltZUNvdW50ZXIgPCA2NDsgY2FuZGlkYXRlKyspIHtcbiAgICBpZiAoIWlzQ29tcG9zaXRlW2NhbmRpZGF0ZV0pIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAzMTM7IGkgKz0gY2FuZGlkYXRlKVxuICAgICAgICBpc0NvbXBvc2l0ZVtpXSA9IGNhbmRpZGF0ZTtcblxuICAgICAgaGFzaFtwcmltZUNvdW50ZXJdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAwLjUpICogbWF4V29yZCkgfCAwO1xuICAgICAga1twcmltZUNvdW50ZXIrK10gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDEgLyAzKSAqIG1heFdvcmQpIHwgMDtcbiAgICB9XG4gIH1cblxuICBpbnB1dCArPSAnXFx4ODAnOyAvLyBBcHBlbmQgxocnIGJpdCAocGx1cyB6ZXJvIHBhZGRpbmcpXG4gIHdoaWxlIChpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gJSA2NCAtIDU2KVxuICAgIGlucHV0ICs9ICdcXHgwMCc7IC8vIE1vcmUgemVybyBwYWRkaW5nXG5cbiAgZm9yIChpID0gMDsgaSA8IGlucHV0W2xlbmd0aFByb3BlcnR5XTsgaSsrKSB7XG4gICAgaiA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGogPj4gOClcbiAgICAgIHJldHVybjsgLy8gQVNDSUkgY2hlY2s6IG9ubHkgYWNjZXB0IGNoYXJhY3RlcnMgaW4gcmFuZ2UgMC0yNTVcbiAgICB3b3Jkc1tpID4+IDJdIHw9IGogPDwgKCgzIC0gaSkgJSA0KSAqIDg7XG4gIH1cblxuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKChhc2NpaUJpdExlbmd0aCAvIG1heFdvcmQpIHwgMCk7XG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoYXNjaWlCaXRMZW5ndGgpO1xuXG4gIC8vIHByb2Nlc3MgZWFjaCBjaHVua1xuICBmb3IgKGogPSAwOyBqIDwgd29yZHNbbGVuZ3RoUHJvcGVydHldOykge1xuICAgIGxldCB3ID0gd29yZHMuc2xpY2UoaiwgaiArPSAxNik7IC8vIFRoZSBtZXNzYWdlIGlzIGV4cGFuZGVkIGludG8gNjQgd29yZHMgYXMgcGFydCBvZiB0aGUgaXRlcmF0aW9uXG4gICAgbGV0IG9sZEhhc2ggPSBoYXNoO1xuXG4gICAgLy8gVGhpcyBpcyBub3cgdGhlIHVuZGVmaW5lZHdvcmtpbmcgaGFzaFwiLCBvZnRlbiBsYWJlbGxlZCBhcyB2YXJpYWJsZXMgYS4uLmdcbiAgICAvLyAod2UgaGF2ZSB0byB0cnVuY2F0ZSBhcyB3ZWxsLCBvdGhlcndpc2UgZXh0cmEgZW50cmllcyBhdCB0aGUgZW5kIGFjY3VtdWxhdGVcbiAgICBoYXNoID0gaGFzaC5zbGljZSgwLCA4KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2UgaW50byA2NCB3b3Jkc1xuICAgICAgLy8gVXNlZCBiZWxvdyBpZlxuICAgICAgbGV0IHcxNSA9IHdbaSAtIDE1XTsgbGV0IHcyID0gd1tpIC0gMl07XG5cbiAgICAgIC8vIEl0ZXJhdGVcbiAgICAgIGxldCBhID0gaGFzaFswXTsgbGV0IGUgPSBoYXNoWzRdO1xuICAgICAgbGV0IHRlbXAxID0gaGFzaFs3XVxuICAgICAgICAgICAgICAgICsgKCgoZSA+Pj4gNikgfCAoZSA8PCAyNikpIF4gKChlID4+PiAxMSkgfCAoZSA8PCAyMSkpIF4gKChlID4+PiAyNSkgfCAoZSA8PCA3KSkpIC8vIFMxXG4gICAgICAgICAgICAgICAgKyAoKGUgJiBoYXNoWzVdKSBeICgofmUpICYgaGFzaFs2XSkpIC8vIGNoXG4gICAgICAgICAgICAgICAgKyBrW2ldXG4gICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICsgKHdbaV0gPSAoaSA8IDE2KSA/IHdbaV0gOiAoXG4gICAgICAgICAgICAgICAgICB3W2kgLSAxNl1cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzE1ID4+PiA3KSB8ICh3MTUgPDwgMjUpKSBeICgodzE1ID4+PiAxOCkgfCAodzE1IDw8IDE0KSkgXiAodzE1ID4+PiAzKSkgLy8gczBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgd1tpIC0gN11cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzIgPj4+IDE3KSB8ICh3MiA8PCAxNSkpIF4gKCh3MiA+Pj4gMTkpIHwgKHcyIDw8IDEzKSkgXiAodzIgPj4+IDEwKSkgLy8gczFcbiAgICAgICAgICAgICAgICApIHwgMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAvLyBUaGlzIGlzIG9ubHkgdXNlZCBvbmNlLCBzbyAqY291bGQqIGJlIG1vdmVkIGJlbG93LCBidXQgaXQgb25seSBzYXZlcyA0IGJ5dGVzIGFuZCBtYWtlcyB0aGluZ3MgdW5yZWFkYmxlXG4gICAgICBsZXQgdGVtcDIgPSAoKChhID4+PiAyKSB8IChhIDw8IDMwKSkgXiAoKGEgPj4+IDEzKSB8IChhIDw8IDE5KSkgXiAoKGEgPj4+IDIyKSB8IChhIDw8IDEwKSkpIC8vIFMwXG4gICAgICAgICAgICAgICAgKyAoKGEgJiBoYXNoWzFdKSBeIChhICYgaGFzaFsyXSkgXiAoaGFzaFsxXSAmIGhhc2hbMl0pKTsgLy8gbWFqXG5cbiAgICAgIGhhc2ggPSBbKHRlbXAxICsgdGVtcDIpIHwgMF0uY29uY2F0KGhhc2gpOyAvLyBXZSBkb24ndCBib3RoZXIgdHJpbW1pbmcgb2ZmIHRoZSBleHRyYSBvbmVzLCB0aGV5J3JlIGhhcm1sZXNzIGFzIGxvbmcgYXMgd2UncmUgdHJ1bmNhdGluZyB3aGVuIHdlIGRvIHRoZSBzbGljZSgpXG4gICAgICBoYXNoWzRdID0gKGhhc2hbNF0gKyB0ZW1wMSkgfCAwO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICBoYXNoW2ldID0gKGhhc2hbaV0gKyBvbGRIYXNoW2ldKSB8IDA7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgZm9yIChqID0gMzsgaiArIDE7IGotLSkge1xuICAgICAgbGV0IGIgPSAoaGFzaFtpXSA+PiAoaiAqIDgpKSAmIDI1NTtcbiAgICAgIHJlc3VsdCArPSAoKGIgPCAxNikgPyAwIDogJycpICsgYi50b1N0cmluZygxNik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFNIQTI1NiB9IGZyb20gJy4vc2hhMjU2LmpzJztcblxuZXhwb3J0IHtcbiAgU0hBMjU2LFxufTtcblxuZnVuY3Rpb24gcGFkKHN0ciwgY291bnQsIGNoYXIgPSAnMCcpIHtcbiAgcmV0dXJuIHN0ci5wYWRTdGFydChjb3VudCwgY2hhcik7XG59XG5cbmNvbnN0IElEX0NPVU5UX0xFTkdUSCAgICAgICAgID0gMTk7XG5jb25zdCBJU19DTEFTUyAgICAgICAgICAgICAgICA9ICgvXmNsYXNzIFxcUysgXFx7Lyk7XG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUyA9IFtcbiAgJ0FnZ3JlZ2F0ZUVycm9yJyxcbiAgJ0FycmF5JyxcbiAgJ0FycmF5QnVmZmVyJyxcbiAgJ0JpZ0ludCcsXG4gICdCaWdJbnQ2NEFycmF5JyxcbiAgJ0JpZ1VpbnQ2NEFycmF5JyxcbiAgJ0Jvb2xlYW4nLFxuICAnRGF0YVZpZXcnLFxuICAnRGF0ZScsXG4gICdEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZScsXG4gICdFcnJvcicsXG4gICdFdmFsRXJyb3InLFxuICAnRmluYWxpemF0aW9uUmVnaXN0cnknLFxuICAnRmxvYXQzMkFycmF5JyxcbiAgJ0Zsb2F0NjRBcnJheScsXG4gICdGdW5jdGlvbicsXG4gICdJbnQxNkFycmF5JyxcbiAgJ0ludDMyQXJyYXknLFxuICAnSW50OEFycmF5JyxcbiAgJ01hcCcsXG4gICdOdW1iZXInLFxuICAnT2JqZWN0JyxcbiAgJ1Byb3h5JyxcbiAgJ1JhbmdlRXJyb3InLFxuICAnUmVmZXJlbmNlRXJyb3InLFxuICAnUmVnRXhwJyxcbiAgJ1NldCcsXG4gICdTaGFyZWRBcnJheUJ1ZmZlcicsXG4gICdTdHJpbmcnLFxuICAnU3ltYm9sJyxcbiAgJ1N5bnRheEVycm9yJyxcbiAgJ1R5cGVFcnJvcicsXG4gICdVaW50MTZBcnJheScsXG4gICdVaW50MzJBcnJheScsXG4gICdVaW50OEFycmF5JyxcbiAgJ1VpbnQ4Q2xhbXBlZEFycmF5JyxcbiAgJ1VSSUVycm9yJyxcbiAgJ1dlYWtNYXAnLFxuICAnV2Vha1JlZicsXG4gICdXZWFrU2V0Jyxcbl07XG5cbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFU19NRVRBID0gTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMubWFwKCh0eXBlTmFtZSkgPT4ge1xuICByZXR1cm4gWyB0eXBlTmFtZSwgZ2xvYmFsVGhpc1t0eXBlTmFtZV0gXTtcbn0pLmZpbHRlcigobWV0YSkgPT4gbWV0YVsxXSk7XG5cbmxldCBpZENvdW50ZXIgPSAwbjtcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlEKCkge1xuICBpZENvdW50ZXIgKz0gQmlnSW50KDEpO1xuICByZXR1cm4gYCR7RGF0ZS5ub3coKX0ke3BhZChpZENvdW50ZXIudG9TdHJpbmcoKSwgSURfQ09VTlRfTEVOR1RIKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVzb2x2YWJsZSgpIHtcbiAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgbGV0IHJlc29sdmU7XG4gIGxldCByZWplY3Q7XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICByZXNvbHZlID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ2Z1bGZpbGxlZCc7XG4gICAgICAgIF9yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHJlamVjdCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgIF9yZWplY3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm9taXNlLCB7XG4gICAgJ3Jlc29sdmUnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlc29sdmUsXG4gICAgfSxcbiAgICAncmVqZWN0Jzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZWplY3QsXG4gICAgfSxcbiAgICAnc3RhdHVzJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICAoKSA9PiBzdGF0dXMsXG4gICAgfSxcbiAgICAnaWQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIGdlbmVyYXRlSUQoKSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGxldCB0aGlzVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHRoaXNUeXBlID09PSAnYmlnaW50JylcbiAgICByZXR1cm4gJ0JpZ0ludCc7XG5cbiAgaWYgKHRoaXNUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0aGlzVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh2YWx1ZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtuYXRpdmVUeXBlTWV0YVswXX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIElTX0NMQVNTLnRlc3QoJycgKyB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IpKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke3ZhbHVlLm5hbWV9XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgIHJldHVybiBgW0NsYXNzICR7cmVzdWx0fV1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzVHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3RoaXNUeXBlLnN1YnN0cmluZygxKX1gO1xuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKVxuICAgIHJldHVybiAnU3RyaW5nJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOdW1iZXIpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgcmV0dXJuICdCb29sZWFuJztcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgcmV0dXJuICdPYmplY3QnO1xuXG4gIGlmICh0eXBlb2YgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuXG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlKHZhbHVlLCAuLi50eXBlcykge1xuICBsZXQgdmFsdWVUeXBlID0gdHlwZU9mKHZhbHVlKTtcbiAgaWYgKHR5cGVzLmluZGV4T2YodmFsdWVUeXBlKSA+PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiB0eXBlcy5zb21lKCh0eXBlKSA9PiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyKHZhbHVlKSB7XG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnTnVtYmVyJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3RhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXMoSW5maW5pdHkpIHx8IE9iamVjdC5pcygtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycsICdOdW1iZXInLCAnQm9vbGVhbicsICdCaWdJbnQnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOT0UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAodmFsdWUgPT09ICcnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICdTdHJpbmcnKSAmJiAoL15bXFxzXFxyXFxuXSokLykudGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZS5sZW5ndGgsICdOdW1iZXInKSlcbiAgICByZXR1cm4gKHZhbHVlLmxlbmd0aCA9PT0gMCk7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90Tk9FKHZhbHVlKSB7XG4gIHJldHVybiAhTk9FKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvXlxcVy8sICcnKVxuICAgIC5yZXBsYWNlKC9bXFxXXSskLywgJycpXG4gICAgLnJlcGxhY2UoLyhbQS1aXSspL2csICctJDEnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL1xcVysoLikvZywgKG0sIHApID0+IHtcbiAgICAgIHJldHVybiBwLnRvVXBwZXJDYXNlKCk7XG4gICAgfSlcbiAgICAucmVwbGFjZSgvXiguKSguKikkLywgKG0sIGYsIGwpID0+IGAke2YudG9Mb3dlckNhc2UoKX0ke2x9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL1tBLVpdKy9nLCAobSwgb2Zmc2V0KSA9PiAoKG9mZnNldCkgPyBgLSR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZE1ldGhvZHMoX3Byb3RvLCBza2lwUHJvdG9zKSB7XG4gIGxldCBwcm90byAgICAgICAgICAgPSBfcHJvdG87XG4gIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKHByb3RvKSB7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG8pO1xuICAgIGxldCBrZXlzICAgICAgICA9IE9iamVjdC5rZXlzKGRlc2NyaXB0b3JzKS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhkZXNjcmlwdG9ycykpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgfHwga2V5ID09PSAncHJvdG90eXBlJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXMoa2V5KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZChrZXkpO1xuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzW2tleV07XG5cbiAgICAgIC8vIENhbiBpdCBiZSBjaGFuZ2VkP1xuICAgICAgaWYgKGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIElmIGlzIGdldHRlciwgdGhlbiBza2lwXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdnZXQnKSB8fCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ3NldCcpKSB7XG4gICAgICAgIGxldCBuZXdEZXNjcmlwdG9yID0geyAuLi5kZXNjcmlwdG9yIH07XG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLmdldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLmdldCA9IG5ld0Rlc2NyaXB0b3IuZ2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3Iuc2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3Iuc2V0ID0gbmV3RGVzY3JpcHRvci5zZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBuZXdEZXNjcmlwdG9yKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB2YWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cbiAgICAgIC8vIFNraXAgcHJvdG90eXBlIG9mIE9iamVjdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBPYmplY3QucHJvdG90eXBlW2tleV0gPT09IHZhbHVlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHsgLi4uZGVzY3JpcHRvciwgdmFsdWU6IHZhbHVlLmJpbmQodGhpcykgfSk7XG4gICAgfVxuXG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIGJyZWFrO1xuXG4gICAgaWYgKHNraXBQcm90b3MgJiYgc2tpcFByb3Rvcy5pbmRleE9mKHByb3RvKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuY29uc3QgTUVUQURBVEFfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCFpc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoIWRhdGEpIHtcbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gZGF0YS5nZXQoa2V5KTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmNvbnN0IE9CSl9JRF9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcbmxldCBpZENvdW50ID0gMW47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmpJRChvYmopIHtcbiAgbGV0IGlkID0gT0JKX0lEX1dFQUtNQVAuZ2V0KG9iaik7XG4gIGlmIChpZCA9PSBudWxsKSB7XG4gICAgbGV0IHRoaXNJRCA9IGAke2lkQ291bnQrK31gO1xuICAgIE9CSl9JRF9XRUFLTUFQLnNldChvYmosIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5jb25zdCBEWU5BTUlDX1BST1BFUlRZX0dDX1RJTUUgPSAxMDAwMDtcblxuZXhwb3J0IGNsYXNzIER5bmFtaWNQcm9wZXJ0eSB7XG4gIGNvbnN0cnVjdG9yKGdldHRlciwgc2V0dGVyKSB7XG4gICAgaWYgKHR5cGVvZiBnZXR0ZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImdldHRlclwiIChmaXJzdCkgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgICBpZiAodHlwZW9mIHNldHRlciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2V0dGVyXCIgKHNlY29uZCkgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmFsdWUnOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICBnZXR0ZXIsXG4gICAgICAgIHNldDogICAgICAgICAgc2V0dGVyLFxuICAgICAgfSxcbiAgICAgICdyZWdpc3RlcmVkTm9kZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIFtdLFxuICAgICAgfSxcbiAgICAgICdjbGVhbk1lbW9yeVRpbWVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBudWxsLFxuICAgICAgfSxcbiAgICAgICdpc1NldHRpbmcnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpID8gdmFsdWUudG9TdHJpbmcoKSA6ICgnJyArIHZhbHVlKTtcbiAgfVxuXG4gIGZyZWVEZWFkUmVmZXJlbmNlcygpIHtcbiAgICAvLyBjbGVhciBkZWFkIG5vZGVzXG4gICAgdGhpcy5yZWdpc3RlcmVkTm9kZXMgPSB0aGlzLnJlZ2lzdGVyZWROb2Rlcy5maWx0ZXIoKGVudHJ5KSA9PiAhIWVudHJ5LnJlZi5kZXJlZigpKTtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmNsZWFuTWVtb3J5VGltZXIpO1xuICAgIHRoaXMuY2xlYW5NZW1vcnlUaW1lciA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5yZWdpc3RlcmVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgcmFuZG9tbmVzcyA9IChNYXRoLnJhbmRvbSgpICogRFlOQU1JQ19QUk9QRVJUWV9HQ19USU1FKTtcbiAgICAgIHRoaXMuY2xlYW5NZW1vcnlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mcmVlRGVhZFJlZmVyZW5jZXMoKSwgTWF0aC5yb3VuZChEWU5BTUlDX1BST1BFUlRZX0dDX1RJTUUgKyByYW5kb21uZXNzKSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KG5ld1ZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR0aW5nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaXNTZXR0aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNTZXR0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy50cmlnZ2VyVXBkYXRlcygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pKS50aGVuKCgpID0+IHRoaXMudHJpZ2dlclVwZGF0ZXMoKSk7XG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlclVwZGF0ZXMoKSB7XG4gICAgZm9yIChsZXQgeyByZWYsIGNhbGxiYWNrIH0gb2YgdGhpcy5yZWdpc3RlcmVkTm9kZXMpIHtcbiAgICAgIGxldCBub2RlID0gcmVmLmRlcmVmKCk7XG4gICAgICBpZiAoIW5vZGUpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgbmV3VmFsdWUgPSBjYWxsYmFjaygpO1xuICAgICAgbm9kZS5ub2RlVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckZvclVwZGF0ZShub2RlLCBjYWxsYmFjaykge1xuICAgIGxldCBleGlzdHMgPSB0aGlzLnJlZ2lzdGVyZWROb2Rlcy5maW5kKChlbnRyeSkgPT4gKGVudHJ5LnJlZi5kZXJlZigpID09PSBub2RlKSk7XG4gICAgaWYgKGV4aXN0cylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCByZWYgPSBuZXcgV2Vha1JlZihub2RlKTtcbiAgICB0aGlzLnJlZ2lzdGVyZWROb2Rlcy5wdXNoKHsgcmVmLCBjYWxsYmFjayB9KTtcblxuICAgIHRoaXMuZnJlZURlYWRSZWZlcmVuY2VzKCk7XG4gIH1cbn1cblxuY29uc3QgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTID0gWyAzLCAyIF07IC8vIFRFWFRfTk9ERSwgQVRUUklCVVRFX05PREVcbmNvbnN0IFZBTElEX0pTX0lERU5USUZJRVIgICAgICAgICA9IC9eW2EtekEtWl8kXVthLXpBLVowLTlfJF0qJC87XG5cbmZ1bmN0aW9uIGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0KSB7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBnZXRBbGxQcm9wZXJ0eU5hbWVzKGNvbnRleHQpLmZpbHRlcigobmFtZSkgPT4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpKTtcbiAgY29udGV4dENhbGxBcmdzID0gQXJyYXkuZnJvbShuZXcgU2V0KGNvbnRleHRDYWxsQXJncy5jb25jYXQoWyAnYXR0cmlidXRlcycsICdjbGFzc0xpc3QnIF0pKSk7XG5cbiAgcmV0dXJuIGB7JHtjb250ZXh0Q2FsbEFyZ3MuZmlsdGVyKChuYW1lKSA9PiAhKC9eKGkxOG58XFwkXFwkKSQvKS50ZXN0KG5hbWUpKS5qb2luKCcsJyl9fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm94eUNvbnRleHQocGFyZW50RWxlbWVudCwgY29udGV4dCkge1xuICBjb25zdCBmaW5kUHJvcE5hbWVTY29wZSA9ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgIHJldHVybiB0YXJnZXQ7XG5cbiAgICBpZiAoIXBhcmVudEVsZW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCBnZXRQYXJlbnROb2RlID0gKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghZWxlbWVudClcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIGlmICghZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlTaGFkb3dQYXJlbnQnKTtcblxuICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmluZFBhcmVudENvbnRleHQgPSAocGFyZW50RWxlbWVudCkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xuICAgICAgaWYgKCFjdXJyZW50UGFyZW50KVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBjb21wb25lbnRQdWJsaXNoQ29udGV4dCA9IGN1cnJlbnRQYXJlbnQucHVibGlzaENvbnRleHQ7XG4gICAgICB3aGlsZSAoY3VycmVudFBhcmVudCkge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gY3VycmVudFBhcmVudClcbiAgICAgICAgICByZXR1cm4gY3VycmVudFBhcmVudDtcblxuICAgICAgICBpZiAodHlwZW9mKGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0ID0gY3VycmVudFBhcmVudC5wdWJsaXNoQ29udGV4dCkgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY3VycmVudFBhcmVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudFBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghY29tcG9uZW50UHVibGlzaENvbnRleHQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHB1Ymxpc2hlZENvbnRleHQgPSBjb21wb25lbnRQdWJsaXNoQ29udGV4dC5jYWxsKGN1cnJlbnRQYXJlbnQpO1xuICAgICAgaWYgKCEocHJvcE5hbWUgaW4gcHVibGlzaGVkQ29udGV4dCkgJiYgY3VycmVudFBhcmVudClcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnRDb250ZXh0KGdldFBhcmVudE5vZGUoY3VycmVudFBhcmVudCkpO1xuXG4gICAgICByZXR1cm4gcHVibGlzaGVkQ29udGV4dDtcbiAgICB9O1xuXG4gICAgbGV0IHBhcmVudENvbnRleHQgPSBmaW5kUGFyZW50Q29udGV4dChwYXJlbnRFbGVtZW50KTtcbiAgICByZXR1cm4gcGFyZW50Q29udGV4dDtcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb3h5KGNvbnRleHQsIHtcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgIGlmICghc2NvcGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIHNjb3BlW3Byb3BOYW1lXTtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgcHJvcE5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgc2NvcGVbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoY29udGV4dCwgX2Z1bmN0aW9uQm9keSwgX2NvbnRleHRDYWxsQXJncykge1xuICBsZXQgY29udGV4dENhbGxBcmdzID0gKF9jb250ZXh0Q2FsbEFyZ3MpID8gX2NvbnRleHRDYWxsQXJncyA6IGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0LCAoY29udGV4dCBpbnN0YW5jZW9mIE5vZGUpKTtcbiAgbGV0IGZ1bmN0aW9uQm9keSAgICA9IGBsZXQgQz1hcmd1bWVudHNbM10sJCQ9KChDLiQkKT9DLiQkOmNyZWF0ZVByb3h5Q29udGV4dChDLCB7IGNvbnRleHQ6IEMsICQkOiBDIH0pKSxpMThuPSQkLmkxOG58fCgocGF0aCxkKT0+Z2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHNwZWNpYWxDbG9zZXN0KEMsJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpfHxDLFxcYGdsb2JhbC5pMThuLlxcJHtwYXRofVxcYCxkKSk7aWYoJCQuaTE4bj09bnVsbCkkJC5pMThuPWkxOG47cmV0dXJuICR7X2Z1bmN0aW9uQm9keS5yZXBsYWNlKC9eXFxzKnJldHVyblxccysvLCAnJykudHJpbSgpfTtgO1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbignZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aCcsICdzcGVjaWFsQ2xvc2VzdCcsICdjcmVhdGVQcm94eUNvbnRleHQnLCBjb250ZXh0Q2FsbEFyZ3MsIGZ1bmN0aW9uQm9keSkpLmJpbmQoY29udGV4dCwgZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aCwgc3BlY2lhbENsb3Nlc3QsIGNyZWF0ZVByb3h5Q29udGV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUZXJtKGNvbnRleHQsIF90ZXh0KSB7XG4gIGxldCB0ZXh0ID0gX3RleHQ7XG4gIGxldCBub2RlO1xuXG4gIGlmICh0ZXh0IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIG5vZGUgPSB0ZXh0O1xuICAgIGlmIChGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImZvcm1hdFRlcm1cIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gICAgdGV4dCA9IG5vZGUubm9kZVZhbHVlO1xuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0KTtcbiAgbGV0IHJlc3VsdCAgICAgICAgICA9IHRleHQucmVwbGFjZSgvKD86XkBAfChbXlxcXFxdKUBAKSguKz8pQEAvZywgKG0sIHN0YXJ0LCBtYWNybykgPT4ge1xuICAgIGNvbnN0IGZldGNoZXIgPSBjcmVhdGVEeW5hbWljUHJvcGVydHlGZXRjaGVyKGNvbnRleHQsIG1hY3JvLCBjb250ZXh0Q2FsbEFyZ3MpO1xuICAgIGxldCB2YWx1ZSA9IGZldGNoZXIoY29udGV4dCk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICB2YWx1ZSA9ICcnO1xuXG4gICAgaWYgKG5vZGUgJiYgdmFsdWUgaW5zdGFuY2VvZiBEeW5hbWljUHJvcGVydHkpIHtcbiAgICAgIHZhbHVlLnJlZ2lzdGVyRm9yVXBkYXRlKG5vZGUsICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZvcm1hdFRlcm0oY29udGV4dCwgdGV4dCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7c3RhcnQgfHwgJyd9JHt2YWx1ZX1gO1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jb25zdCBIQVNfRFlOQU1JQ19CSU5ESU5HID0gL15AQHxbXlxcXFxdQEAvO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKHZhbHVlKSB7XG4gIGlmICghaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBIQVNfRFlOQU1JQ19CSU5ESU5HLnRlc3QodmFsdWUpO1xufVxuXG5jb25zdCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FID0gL15bXFx3LiRdKyQvO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50Q2FsbGJhY2soX2Z1bmN0aW9uQm9keSkge1xuICBsZXQgZnVuY3Rpb25Cb2R5ID0gX2Z1bmN0aW9uQm9keTtcbiAgaWYgKEVWRU5UX0FDVElPTl9KVVNUX05BTUUudGVzdChmdW5jdGlvbkJvZHkpKVxuICAgIGZ1bmN0aW9uQm9keSA9IGB0aGlzLiR7ZnVuY3Rpb25Cb2R5fShldmVudClgO1xuXG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKCdldmVudCcsIGBsZXQgZT1ldmVudCxldj1ldmVudCxldnQ9ZXZlbnQ7cmV0dXJuICR7ZnVuY3Rpb25Cb2R5LnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKi8sICcnKS50cmltKCl9O2ApKS5iaW5kKGNyZWF0ZVByb3h5Q29udGV4dCh0aGlzLCB7Y29udGV4dDogdGhpcywgJCQ6IHRoaXN9KSk7XG59XG5cbmNvbnN0IElTX0VWRU5UX05BTUUgICAgID0gL15vbi87XG5jb25zdCBFVkVOVF9OQU1FX0NBQ0hFICA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoRVZFTlRfTkFNRV9DQUNIRVt0YWdOYW1lXSlcbiAgICByZXR1cm4gRVZFTlRfTkFNRV9DQUNIRVt0YWdOYW1lXTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV0gPSBldmVudE5hbWVzO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGNvbnRleHQsIGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoaXNQbGFpbk9iamVjdChfY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgID0gX2NhbGxiYWNrLmNhbGxiYWNrO1xuICAgIG9wdGlvbnMgICA9IF9jYWxsYmFjay5vcHRpb25zIHx8IHt9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBfY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfVxuXG4gIGlmIChpc1R5cGUoY2FsbGJhY2ssICdTdHJpbmcnKSlcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUV2ZW50Q2FsbGJhY2suY2FsbChjb250ZXh0LCBjYWxsYmFjayk7XG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7IGNhbGxiYWNrLCBvcHRpb25zIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFBhdGgob2JqLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAob2JqID09IG51bGwgfHwgT2JqZWN0LmlzKG9iaiwgTmFOKSB8fCBPYmplY3QuaXMob2JqLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKG9iaiwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGlmIChrZXkgPT0gbnVsbCB8fCBPYmplY3QuaXMoa2V5LCBOYU4pIHx8IE9iamVjdC5pcyhrZXksIEluZmluaXR5KSB8fCBPYmplY3QuaXMoa2V5LCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgbGV0IHBhcnRzICAgICAgICAgPSBrZXkuc3BsaXQoL1xcLi9nKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBjdXJyZW50VmFsdWUgID0gb2JqO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xuICAgIGxldCBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWVbcGFydF07XG4gICAgaWYgKG5leHRWYWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGN1cnJlbnRWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChnbG9iYWxUaGlzLk5vZGUgJiYgY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSBpbnN0YW5jZW9mIGdsb2JhbFRoaXMuTm9kZSAmJiAoY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpKVxuICAgIHJldHVybiBjdXJyZW50VmFsdWUubm9kZVZhbHVlO1xuXG4gIHJldHVybiAoY3VycmVudFZhbHVlID09IG51bGwpID8gZGVmYXVsdFZhbHVlIDogY3VycmVudFZhbHVlO1xufVxuXG5jb25zdCBJU19OVU1CRVIgPSAvXihbLStdPykoXFxkKig/OlxcLlxcZCspPykoZVstK11cXGQrKT8kLztcbmNvbnN0IElTX0JPT0xFQU4gPSAvXih0cnVlfGZhbHNlKSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gY29lcmNlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gJ251bGwnKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBpZiAodmFsdWUgPT09ICdOYU4nKVxuICAgIHJldHVybiBOYU47XG5cbiAgaWYgKHZhbHVlID09PSAnSW5maW5pdHknIHx8IHZhbHVlID09PSAnK0luZmluaXR5JylcbiAgICByZXR1cm4gSW5maW5pdHk7XG5cbiAgaWYgKHZhbHVlID09PSAnLUluZmluaXR5JylcbiAgICByZXR1cm4gLUluZmluaXR5O1xuXG4gIGlmIChJU19OVU1CRVIudGVzdCh2YWx1ZSkpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSwgMTApO1xuXG4gIGlmIChJU19CT09MRUFOLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiAodmFsdWUgPT09ICd0cnVlJyk7XG5cbiAgcmV0dXJuICgnJyArIHZhbHVlKTtcbn1cblxuY29uc3QgQ0FDSEVEX1BST1BFUlRZX05BTUVTID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IFNLSVBfUFJPVE9UWVBFUyAgICAgICA9IFtcbiAgZ2xvYmFsVGhpcy5IVE1MRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5Ob2RlLFxuICBnbG9iYWxUaGlzLkVsZW1lbnQsXG4gIGdsb2JhbFRoaXMuT2JqZWN0LFxuICBnbG9iYWxUaGlzLkFycmF5LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFByb3BlcnR5TmFtZXMoX29iaikge1xuICBpZiAoIWlzQ29sbGVjdGFibGUoX29iaikpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGxldCBjYWNoZWROYW1lcyA9IENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5nZXQoX29iaik7XG4gIGlmIChjYWNoZWROYW1lcylcbiAgICByZXR1cm4gY2FjaGVkTmFtZXM7XG5cbiAgbGV0IG9iaiAgID0gX29iajtcbiAgbGV0IG5hbWVzID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChvYmopIHtcbiAgICBsZXQgb2JqTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG9iak5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgICBuYW1lcy5hZGQob2JqTmFtZXNbaV0pO1xuXG4gICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKG9iaiAmJiBTS0lQX1BST1RPVFlQRVMuaW5kZXhPZihvYmouY29uc3RydWN0b3IpID49IDApXG4gICAgICBicmVhaztcbiAgfVxuXG4gIGxldCBmaW5hbE5hbWVzID0gQXJyYXkuZnJvbShuYW1lcyk7XG4gIENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5zZXQoX29iaiwgZmluYWxOYW1lcyk7XG5cbiAgcmV0dXJuIGZpbmFsTmFtZXM7XG59XG5cbmNvbnN0IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRSA9IG5ldyBXZWFrTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aChrZXlQYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgbGV0IGluc3RhbmNlQ2FjaGUgPSBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuZ2V0KHRoaXMpO1xuICBpZiAoIWluc3RhbmNlQ2FjaGUpIHtcbiAgICBpbnN0YW5jZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgIExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5zZXQodGhpcywgaW5zdGFuY2VDYWNoZSk7XG4gIH1cblxuICBsZXQgcHJvcGVydHkgPSBpbnN0YW5jZUNhY2hlLmdldChrZXlQYXRoKTtcbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIGxldCB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblxuICAgIHByb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eSgoKSA9PiB2YWx1ZSwgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH0pO1xuXG4gICAgaW5zdGFuY2VDYWNoZS5zZXQoa2V5UGF0aCwgcHJvcGVydHkpO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BlY2lhbENsb3Nlc3Qobm9kZSwgc2VsZWN0b3IpIHtcbiAgaWYgKCFub2RlIHx8ICFzZWxlY3RvcilcbiAgICByZXR1cm47XG5cbiAgaWYgKHR5cGVvZiBub2RlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IGdldFBhcmVudE5vZGUgPSAoZWxlbWVudCkgPT4ge1xuICAgIGlmICghZWxlbWVudClcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlTaGFkb3dQYXJlbnQnKTtcblxuICAgIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGU7XG4gIH07XG5cbiAgbGV0IGN1cnJlbnROb2RlID0gbm9kZTtcbiAgbGV0IHJlc3VsdDtcblxuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgIShyZXN1bHQgPSBjdXJyZW50Tm9kZS5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyB8fCAwKTtcbiAgfSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZWxlbWVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktcmVxdWlyZS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1sYW5ndWFnZS1wcm92aWRlci5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1zcGlubmVyLmpzJztcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5VdGlscyA9IFV0aWxzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5Db21wb25lbnRzID0gQ29tcG9uZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuRWxlbWVudHMgPSBFbGVtZW50cztcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW15dGhpeC1zcmNdJykpO1xuICAgIENvbXBvbmVudHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IGRpc2Nvbm5lY3QsIGVsZW1lbnQsIHdhc1Zpc2libGUgfSkgPT4ge1xuICAgICAgaWYgKHdhc1Zpc2libGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1zcmMnKTtcbiAgICAgIGlmICghc3JjKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgQ29tcG9uZW50cy5sb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwoZWxlbWVudCwgc3JjKTtcbiAgICB9LCB7IGVsZW1lbnRzIH0pO1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLCB7XG4gICAgJyQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogICAgICAgICguLi5hcmdzKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKC4uLmFyZ3MpLFxuICAgIH0sXG4gICAgJyQkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCguLi5hcmdzKSxcbiAgICB9LFxuICB9KTtcblxuICBsZXQgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsVGhpcy5teXRoaXhVSS5kb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiA9IG11dGF0aW9uc1tpXTtcbiAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnYXR0cmlidXRlcycpIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBtdXRhdGlvbi50YXJnZXQuZ2V0QXR0cmlidXRlTm9kZShtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlICAgICAgPSBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUobmV3VmFsdWUpKVxuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShtdXRhdGlvbi50YXJnZXQsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0Jykge1xuICAgICAgICBsZXQgYWRkZWROb2RlcyA9IG11dGF0aW9uLmFkZGVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IGFkZGVkTm9kZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIGxldCBub2RlID0gYWRkZWROb2Rlc1tqXTtcbiAgICAgICAgICBDb21wb25lbnRzLnJlY3Vyc2l2ZWx5QmluZER5bmFtaWNEYXRhKG11dGF0aW9uLnRhcmdldCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50TXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgc3VidHJlZTogICAgICAgICAgICB0cnVlLFxuICAgIGNoaWxkTGlzdDogICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiAgICAgICAgIHRydWUsXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6ICB0cnVlLFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==