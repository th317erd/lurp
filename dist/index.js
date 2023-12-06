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

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindMethods.call(this, this.constructor.prototype, [ Object.getPrototypeOf(this.constructor.prototype) ]);

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
            _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement(this, childNode, lowerAttributeName.substring(2), attributeValue);
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

  let template  = ownerDocument.createElement('template');

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
  let nodeHandler         = options.nodeHandler;
  let templateCount       = children.reduce((sum, element) => ((IS_TEMPLATE.test(element.tagName)) ? (sum + 1) : sum), 0);
  let context             = {
    children,
    ownerDocument,
    template,
    templateCount,
    url,
  };

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
    return this.filter((element) => (element && element.slot === slotName));
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
      if (key === 'constructor')
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
  return new Proxy(context, {
    get: (target, propName) => {
      if (propName in target)
        return target[propName];

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
        if (!parentElement)
          return;

        let componentPublishContext = currentParent.publishContext;
        while (currentParent && typeof(componentPublishContext = currentParent.publishContext) !== 'function')
          currentParent = getParentNode(currentParent);

        if (!componentPublishContext)
          return;

        let publishedContext = componentPublishContext.call(currentParent);
        if (!(propName in publishedContext) && currentParent)
          return findParentContext(getParentNode(currentParent));

        return publishedContext;
      };

      let parentContext = findParentContext(parentElement);
      return (parentContext) ? parentContext[propName] : undefined;
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

  return (new Function('event', `let e=event,ev=event,evt=event;return ${functionBody.replace(/^\s*return\s*/, '').trim()};`)).bind(this);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVQLCtCQUErQiw0QkFBNEI7O0FBRXBEO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzWW9DO0FBSVo7O0FBRWpCLHVDQUF1Qyw0REFBaUI7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxNQUFNO0FBQzNDLHNCQUFzQixnREFBZTs7QUFFckM7QUFDQSxpQkFBaUIsZ0VBQStCOztBQUVoRDtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0Esb0RBQW9ELDBCQUEwQjtBQUM5RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdHQUFnRyxLQUFLO0FBQ3JHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksWUFBWSxRQUFRLGtEQUFPO0FBQ3ZDOztBQUVBOztBQUVBO0FBQ0EsTUFBTTtBQUNOLHNGQUFzRixJQUFJO0FBQzFGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBOztBQUVBLFlBQVksb0RBQW1CO0FBQy9CO0FBQ0EsVUFBVTtBQUNWLHlCQUF5QixnRUFBK0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsaURBQWlEOzs7Ozs7Ozs7Ozs7Ozs7O0FDakhMOztBQUVyQyw4QkFBOEIsNERBQTJCO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxRQUFRLGtEQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLHVFQUFzQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsV0FBVztBQUMzQztBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTiw0RUFBNEUsSUFBSTtBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDs7QUFFakQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ25EQTs7QUFFbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3QkFBd0IscUVBQW9DO0FBQzVELG9DQUFvQyxpREFBZ0I7QUFDcEQsUUFBUTtBQUNSO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQSxVQUFVLHFFQUFxQztBQUMvQztBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1yZXF1aXJlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1zcGlubmVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3F1ZXJ5LWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGlmICghcnVsZS5zZWxlY3RvclRleHQpXG4gICAgcmV0dXJuIHJ1bGUuY3NzVGV4dDtcblxuICBsZXQgX2JvZHkgICA9IHJ1bGUuY3NzVGV4dC5zdWJzdHJpbmcocnVsZS5zZWxlY3RvclRleHQubGVuZ3RoKS50cmltKCk7XG4gIGxldCByZXN1bHQgID0gKGNhbGxiYWNrKHJ1bGUuc2VsZWN0b3JUZXh0LCBfYm9keSkgfHwgW10pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmV0dXJuICcnO1xuXG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBjc3NSdWxlc1RvU291cmNlKGNzc1J1bGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQXJyYXkuZnJvbShjc3NSdWxlcyB8fCBbXSkubWFwKChydWxlKSA9PiB7XG4gICAgbGV0IHJ1bGVTdHIgPSBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gYCR7Y3NzUnVsZXNUb1NvdXJjZShydWxlLmNzc1J1bGVzLCBjYWxsYmFjayl9JHtydWxlU3RyfWA7XG4gIH0pLmpvaW4oJ1xcblxcbicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVGb3JEb2N1bWVudChlbGVtZW50TmFtZSwgc3R5bGVFbGVtZW50KSB7XG4gIGNvbnN0IGhhbmRsZUhvc3QgPSAobSwgdHlwZSwgX2NvbnRlbnQpID0+IHtcbiAgICBsZXQgY29udGVudCA9ICghX2NvbnRlbnQpID8gX2NvbnRlbnQgOiBfY29udGVudC5yZXBsYWNlKC9eXFwoLywgJycpLnJlcGxhY2UoL1xcKSQvLCAnJyk7XG5cbiAgICBpZiAodHlwZSA9PT0gJzpob3N0Jykge1xuICAgICAgaWYgKCFjb250ZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudE5hbWU7XG5cbiAgICAgIC8vIEVsZW1lbnQgc2VsZWN0b3I/XG4gICAgICBpZiAoKC9eW2EtekEtWl9dLykudGVzdChjb250ZW50KSlcbiAgICAgICAgcmV0dXJuIGAke2NvbnRlbnR9W2RhdGEtbXl0aGl4LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbiAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4gICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3RvcjtcbiAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4gICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuICAgICAgICB0YWdzLnB1c2gobSk7XG4gICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4gICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuICAgIH0sXG4gICk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4gIGxldCBvYmpJRCAgICAgICAgICAgICA9IFV0aWxzLmdldE9iaklEKHRlbXBsYXRlKTtcbiAgbGV0IHRlbXBsYXRlSUQgICAgICAgID0gVXRpbHMuU0hBMjU2KG9iaklEKTtcbiAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4gIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbiAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbiAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4gICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihzdGFydFByb3RvLCBkZXNjcmlwdG9yTmFtZSkge1xuICBsZXQgdGhpc1Byb3RvID0gc3RhcnRQcm90bztcbiAgbGV0IGRlc2NyaXB0b3I7XG5cbiAgd2hpbGUgKHRoaXNQcm90byAmJiAhKGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXNQcm90bywgZGVzY3JpcHRvck5hbWUpKSlcbiAgICB0aGlzUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1Byb3RvKTtcblxuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuY29uc3QgSVNfQVRUUl9NRVRIT0RfTkFNRSAgID0gL15hdHRyXFwkKC4qKSQvO1xuY29uc3QgUkVHSVNURVJFRF9DT01QT05FTlRTID0gbmV3IFNldCgpO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgX0tsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpIHtcbiAgICAgIGxldCBLbGFzcyA9IF9LbGFzcyB8fCB0aGlzO1xuICAgICAgS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gS2xhc3MuY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMoS2xhc3MpO1xuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKG5hbWUsIEtsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBzdGF0aWMgY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMgPSBmdW5jdGlvbihLbGFzcykge1xuICAgIGxldCBwcm90byA9IEtsYXNzLnByb3RvdHlwZTtcbiAgICBsZXQgbmFtZXMgPSBVdGlscy5nZXRBbGxQcm9wZXJ0eU5hbWVzKHByb3RvKVxuICAgICAgLmZpbHRlcigobmFtZSkgPT4gSVNfQVRUUl9NRVRIT0RfTkFNRS50ZXN0KG5hbWUpKVxuICAgICAgLm1hcCgob3JpZ2luYWxOYW1lKSA9PiB7XG4gICAgICAgIGxldCBuYW1lID0gb3JpZ2luYWxOYW1lLm1hdGNoKElTX0FUVFJfTUVUSE9EX05BTUUpWzFdO1xuICAgICAgICBpZiAoUkVHSVNURVJFRF9DT01QT05FTlRTLmhhcyhLbGFzcykpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBnZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHByb3RvLCBvcmlnaW5hbE5hbWUpO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBcInZhbHVlXCIgdGhlbiB0aGVcbiAgICAgICAgLy8gdXNlciBkaWQgaXQgd3JvbmcuLi4gc28ganVzdFxuICAgICAgICAvLyBtYWtlIHRoaXMgdGhlIFwic2V0dGVyXCJcbiAgICAgICAgbGV0IG1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgIGlmIChtZXRob2QpXG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG5cbiAgICAgICAgbGV0IG9yaWdpbmFsR2V0ID0gZGVzY3JpcHRvci5nZXQ7XG4gICAgICAgIGlmIChvcmlnaW5hbEdldCkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb3RvLCB7XG4gICAgICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQ6ICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgICAgICAgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsR2V0LmNhbGwoY29udGV4dCwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0OiAgICAgICAgICBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVXRpbHMudG9TbmFrZUNhc2UobmFtZSk7XG4gICAgICB9KTtcblxuICAgIFJFR0lTVEVSRURfQ09NUE9ORU5UUy5hZGQoS2xhc3MpO1xuXG4gICAgcmV0dXJuIG5hbWVzO1xuICB9O1xuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyBvbGRWYWx1ZSwgbmV3VmFsdWUgXSkge1xuICAgIHRoaXMuYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFsgT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKSBdKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzZW5zaXRpdmVUYWdOYW1lJzoge1xuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gKCh0aGlzLnByZWZpeCkgPyBgJHt0aGlzLnByZWZpeH06JHt0aGlzLmxvY2FsTmFtZX1gIDogdGhpcy5sb2NhbE5hbWUpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZUlEJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5URU1QTEFURV9JRCxcbiAgICAgIH0sXG4gICAgICAnZGVsYXlUaW1lcnMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBuZXcgTWFwKCksXG4gICAgICB9LFxuICAgICAgJ2RvY3VtZW50SW5pdGlhbGl6ZWQnOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCAnX215dGhpeFVJRG9jdW1lbnRJbml0aWFsaXplZCcpLFxuICAgICAgICBzZXQ6ICAgICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsICdfbXl0aGl4VUlEb2N1bWVudEluaXRpYWxpemVkJywgISF2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NoYWRvdyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dET00oKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpbmplY3RTdHlsZVNoZWV0KGNvbnRlbnQpIHtcbiAgICBsZXQgc3R5bGVJRCAgICAgICA9IGBJRFNUWUxFJHtVdGlscy5TSEEyNTYoYCR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfToke2NvbnRlbnR9YCl9YDtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICBsZXQgc3R5bGVFbGVtZW50ICA9IG93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc3R5bGUjJHtzdHlsZUlEfWApO1xuXG4gICAgaWYgKHN0eWxlRWxlbWVudClcbiAgICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG5cbiAgICBzdHlsZUVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtZm9yJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcbiAgfVxuXG4gIHByb2Nlc3NFbGVtZW50cyhub2RlKSB7XG4gICAgaWYgKCFub2RlKVxuICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpKSB7XG4gICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICBjaGlsZE5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybSh0aGlzLCBjaGlsZE5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IGNoaWxkTm9kZS5ub2RlVHlwZSA+PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICAgICAgY2hpbGROb2RlID0gdGhpcy5wcm9jZXNzRWxlbWVudHMoY2hpbGROb2RlKTtcblxuICAgICAgICBsZXQgZXZlbnROYW1lcyAgICAgID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoY2hpbGROb2RlKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KHRoaXMsIGNoaWxkTm9kZSwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0odGhpcywgYXR0cmlidXRlTm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBhdHRhY2hTaGFkb3cob3B0aW9ucykge1xuICAgIC8vIENoZWNrIGVudmlyb25tZW50IHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIHN1cGVyLmF0dGFjaFNoYWRvdyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucyk7XG4gICAgVXRpbHMubWV0YWRhdGEoc2hhZG93LCAnX215dGhpeFVJU2hhZG93UGFyZW50JywgdGhpcyk7XG5cbiAgICByZXR1cm4gc2hhZG93O1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMudGVtcGxhdGVJRClcbiAgICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlEKTtcblxuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtbmFtZT1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV1gKTtcbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gX3RlbXBsYXRlIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBlbnN1cmVEb2N1bWVudFN0eWxlcy5jYWxsKHRoaXMsIHRoaXMub3duZXJEb2N1bWVudCwgdGhpcy5zZW5zaXRpdmVUYWdOYW1lLCB0ZW1wbGF0ZSk7XG5cbiAgICAgIGxldCBmb3JtYXR0ZWRUZW1wbGF0ZSA9IHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKGZvcm1hdHRlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVubW91bnRlZCgpO1xuICB9XG5cbiAgYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdTcmMpIHtcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyLnVub2JzZXJ2ZSh0aGlzKTtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIW5ld1NyYylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBvYnNlcnZlciA9IHZpc2liaWxpdHlPYnNlcnZlcigoeyB3YXNWaXNpYmxlLCBkaXNjb25uZWN0IH0pID0+IHtcbiAgICAgIGlmICghd2FzVmlzaWJsZSlcbiAgICAgICAgdGhpcy5mZXRjaFNyYyh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJykpO1xuXG4gICAgICBkaXNjb25uZWN0KCk7XG5cbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9LCB7IGVsZW1lbnRzOiBbIHRoaXMgXSB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd2aXNpYmlsaXR5T2JzZXJ2ZXInOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9ic2VydmVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzKSB7XG4gICAgbGV0IFtcbiAgICAgIG5hbWUsXG4gICAgICBvbGRWYWx1ZSxcbiAgICAgIG5ld1ZhbHVlLFxuICAgIF0gPSBhcmdzO1xuXG4gICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgbGV0IG1hZ2ljTmFtZSAgID0gYGF0dHIkJHtVdGlscy50b0NhbWVsQ2FzZShuYW1lKX1gO1xuICAgICAgbGV0IGRlc2NyaXB0b3IgID0gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbih0aGlzLCBtYWdpY05hbWUpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIENhbGwgc2V0dGVyXG4gICAgICAgIHRoaXNbbWFnaWNOYW1lXSA9IGFyZ3Muc2xpY2UoMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICBnZXQgJCQoKSB7XG4gICAgbGV0IGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGlmICh0eXBlb2YgdGhpcy5wdWJsaXNoQ29udGV4dCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNvbnRleHQgPSAodGhpcy5wdWJsaXNoQ29udGV4dCgpIHx8IE9iamVjdC5jcmVhdGUobnVsbCkpO1xuXG4gICAgcmV0dXJuIFV0aWxzLmNyZWF0ZVByb3h5Q29udGV4dCh0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gICQoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICAgID0gKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleCsrXSkgOiB7fTtcbiAgICBsZXQgcXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgeyByb290OiB0aGlzLCAuLi5vcHRpb25zLCBpbnZva2VDYWxsYmFja3M6IGZhbHNlIH0sIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgICBsZXQgc2hhZG93Tm9kZXM7XG5cbiAgICBvcHRpb25zID0gcXVlcnlFbmdpbmUuZ2V0T3B0aW9ucygpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hhZG93ICE9PSBmYWxzZSAmJiBvcHRpb25zLnNlbGVjdG9yICYmIG9wdGlvbnMucm9vdCA9PT0gdGhpcykge1xuICAgICAgc2hhZG93Tm9kZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBRdWVyeUVuZ2luZS5mcm9tLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICB7IHJvb3Q6IHRoaXMuc2hhZG93IH0sXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3RvcixcbiAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrLFxuICAgICAgICApLnZhbHVlcygpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc2hhZG93Tm9kZXMpXG4gICAgICBxdWVyeUVuZ2luZSA9IHF1ZXJ5RW5naW5lLmFkZChzaGFkb3dOb2Rlcyk7XG5cbiAgICBpZiAob3B0aW9ucy5zbG90dGVkICE9PSB0cnVlKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5zbG90dGVkKGZhbHNlKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiB0aGlzLiQocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2soRWxlbWVudHMsIHt9KSBdLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbVtFbGVtZW50cy5VTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICByZXR1cm4gaXRlbSgpO1xuXG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gIH1cblxuICBpc0F0dHJpYnV0ZVRydXRoeShuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmhhc0F0dHJpYnV0ZShuYW1lKSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICd0cnVlJylcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGR5bmFtaWNQcm9wKG5hbWUsIF9nZXR0ZXIsIF9zZXR0ZXIsIF9jb250ZXh0KSB7XG4gICAgbGV0IGlzR2V0dGVyRnVuYyAgPSAodHlwZW9mIF9nZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgIGxldCBpbnRlcm5hbFZhbHVlID0gKGlzR2V0dGVyRnVuYykgPyB1bmRlZmluZWQgOiBfZ2V0dGVyO1xuICAgIGxldCBnZXR0ZXIgICAgICAgID0gKGlzR2V0dGVyRnVuYykgPyBfZ2V0dGVyIDogKCkgPT4gaW50ZXJuYWxWYWx1ZTtcbiAgICBsZXQgc2V0dGVyICAgICAgICA9ICh0eXBlb2YgX3NldHRlciA9PT0gJ2Z1bmN0aW9uJykgPyBfc2V0dGVyIDogKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpbnRlcm5hbFZhbHVlID0gbmV3VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgVXRpbHMuRHluYW1pY1Byb3BlcnR5KGdldHRlciwgc2V0dGVyKTtcbiAgICBsZXQgY29udGV4dCAgICAgICAgID0gX2NvbnRleHQgfHwgdGhpcztcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbnRleHQsIHtcbiAgICAgIFtuYW1lXToge1xuICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBkeW5hbWljUHJvcGVydHksXG4gICAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5LnNldChuZXdWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZHluYW1pY0RhdGEob2JqKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGxldCBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHRoaXMuZHluYW1pY1Byb3Aoa2V5LCB2YWx1ZSwgdW5kZWZpbmVkLCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGRlYm91bmNlKGNhbGxiYWNrLCBtcywgX2lkKSB7XG4gICAgdmFyIGlkID0gX2lkO1xuXG4gICAgLy8gSWYgd2UgZG9uJ3QgZ2V0IGFuIGlkIGZyb20gdGhlIHVzZXIsIHRoZW4gZ3Vlc3MgdGhlIGlkIGJ5IHR1cm5pbmcgdGhlIGZ1bmN0aW9uXG4gICAgLy8gaW50byBhIHN0cmluZyAocmF3IHNvdXJjZSkgYW5kIHVzZSB0aGF0IGZvciBhbiBpZCBpbnN0ZWFkXG4gICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgIGlkID0gKCcnICsgY2FsbGJhY2spO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgdHJhbnNwaWxlZCBjb2RlLCB0aGVuIGFuIGFzeW5jIGdlbmVyYXRvciB3aWxsIGJlIHVzZWQgZm9yIGFzeW5jIGZ1bmN0aW9uc1xuICAgICAgLy8gVGhpcyB3cmFwcyB0aGUgcmVhbCBmdW5jdGlvbiwgYW5kIHNvIHdoZW4gY29udmVydGluZyB0aGUgZnVuY3Rpb24gaW50byBhIHN0cmluZ1xuICAgICAgLy8gaXQgd2lsbCBOT1QgYmUgdW5pcXVlIHBlciBjYWxsLXNpdGUuIEZvciB0aGlzIHJlYXNvbiwgaWYgd2UgZGV0ZWN0IHRoaXMgaXNzdWUsXG4gICAgICAvLyB3ZSB3aWxsIGdvIHRoZSBcInNsb3dcIiByb3V0ZSBhbmQgY3JlYXRlIGEgc3RhY2sgdHJhY2UsIGFuZCB1c2UgdGhhdCBmb3IgdGhlIHVuaXF1ZSBpZFxuICAgICAgaWYgKGlkLm1hdGNoKC9hc3luY0dlbmVyYXRvclN0ZXAvKSkge1xuICAgICAgICBpZCA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gICAgICAgIGNvbnNvbGUud2FybignbXl0aGl4LXVpIHdhcm5pbmc6IFwidGhpcy5kZWxheVwiIGNhbGxlZCB3aXRob3V0IGEgc3BlY2lmaWVkIFwiaWRcIiBwYXJhbWV0ZXIuIFRoaXMgd2lsbCByZXN1bHQgaW4gYSBwZXJmb3JtYW5jZSBoaXQuIFBsZWFzZSBzcGVjaWZ5IGFuZCBcImlkXCIgYXJndW1lbnQgZm9yIHlvdXIgY2FsbDogXCJ0aGlzLmRlbGF5KGNhbGxiYWNrLCBtcywgXFwnc29tZS1jdXN0b20tY2FsbC1zaXRlLWlkXFwnKVwiJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gKCcnICsgaWQpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gdGhpcy5kZWxheVRpbWVycy5nZXQoaWQpO1xuICAgIGlmIChwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgICBjbGVhclRpbWVvdXQocHJvbWlzZS50aW1lcklEKTtcblxuICAgICAgcHJvbWlzZS5yZWplY3QoJ2NhbmNlbGxlZCcpO1xuICAgIH1cblxuICAgIHByb21pc2UgPSBVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCBtcyB8fCAwKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2xhc3NlcyguLi5fYXJncykge1xuICAgIGxldCBhcmdzID0gX2FyZ3MuZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSlcbiAgICAgICAgcmV0dXJuIGl0ZW0udHJpbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYyhzcmNVUkwpIHtcbiAgICBpZiAoIXNyY1VSTClcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBsb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwodGhpcywgc3JjVVJMKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY1VSTH0gKHJlc29sdmVkIHRvOiAke2Vycm9yLnVybH0pYCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBTQ0hFTUVfUkUgICAgID0gL15bXFx3LV0rOlxcL1xcLy87XG5jb25zdCBIQVNfRklMRU5BTUUgID0gL1xcLlteLy5dKyQvO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVVSTChsb2NhdGlvbiwgX3VybGlzaCwgbWFnaWMpIHtcbiAgbGV0IHVybGlzaCA9IF91cmxpc2g7XG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBVUkwpXG4gICAgcmV0dXJuIHVybGlzaDtcblxuICBpZiAoIXVybGlzaClcbiAgICByZXR1cm4gbmV3IFVSTChsb2NhdGlvbik7XG5cbiAgaWYgKHVybGlzaCBpbnN0YW5jZW9mIExvY2F0aW9uKVxuICAgIHJldHVybiBuZXcgVVJMKHVybGlzaCk7XG5cbiAgaWYgKCFVdGlscy5pc1R5cGUodXJsaXNoLCAnU3RyaW5nJykpXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IGludGVybmFsUmVzb2x2ZSA9IChfbG9jYXRpb24sIF91cmxQYXJ0LCBtYWdpYykgPT4ge1xuICAgIGxldCBvcmlnaW5hbFVSTCA9IHVybGlzaDtcbiAgICBpZiAoU0NIRU1FX1JFLnRlc3QodXJsaXNoKSlcbiAgICAgIHJldHVybiB1cmxpc2g7XG5cbiAgICAvLyBNYWdpYyFcbiAgICBpZiAobWFnaWMgPT09IHRydWUgJiYgIUhBU19GSUxFTkFNRS50ZXN0KHVybGlzaCkpIHtcbiAgICAgIGxldCBwYXJ0cyAgICAgPSB1cmxpc2guc3BsaXQoJy8nKS5tYXAoKHBhcnQpID0+IHBhcnQudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICBsZXQgbGFzdFBhcnQgID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAobGFzdFBhcnQpXG4gICAgICAgIHVybGlzaCA9IGAke3VybGlzaC5yZXBsYWNlKC9cXC8rJC8sICcnKX0vJHtsYXN0UGFydH0uaHRtbGA7XG4gICAgfVxuXG4gICAgbGV0IGxvY2F0aW9uID0gbmV3IFVSTChfbG9jYXRpb24pO1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6IG5ldyBVUkwoYCR7bG9jYXRpb24ub3JpZ2lufSR7bG9jYXRpb24ucGF0aG5hbWV9JHt1cmxpc2h9YC5yZXBsYWNlKC9cXC97Mix9L2csICcvJykpLFxuICAgICAgb3JpZ2luYWxVUkwsXG4gICAgfTtcbiAgfTtcblxuICBsZXQge1xuICAgIHVybCxcbiAgICBvcmlnaW5hbFVSTCxcbiAgfSA9IGludGVybmFsUmVzb2x2ZShsb2NhdGlvbiwgdXJsaXNoLnRvU3RyaW5nKCksIG1hZ2ljKTtcblxuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsZXQgZmlsZU5hbWU7XG4gICAgbGV0IHBhdGg7XG5cbiAgICB1cmwucGF0aG5hbWUucmVwbGFjZSgvKC4qXFwvKShbXi9dKykkLywgKG0sIGZpcnN0LCBzZWNvbmQpID0+IHtcbiAgICAgIHBhdGggPSBmaXJzdDtcbiAgICAgIGZpbGVOYW1lID0gc2Vjb25kO1xuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbiAgICBsZXQgbmV3U3JjID0gZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlci5jYWxsKHRoaXMsIHsgc3JjOiBvcmlnaW5hbFVSTCwgdXJsLCBwYXRoLCBmaWxlTmFtZSB9KTtcbiAgICBpZiAobmV3U3JjID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1yZXF1aXJlXCI6IE5vdCBsb2FkaW5nIFwiJHtvcmlnaW5hbFVSTH1cIiBiZWNhdXNlIHRoZSBnbG9iYWwgXCJteXRoaXhVSS51cmxSZXNvbHZlclwiIHJlcXVlc3RlZCBJIG5vdCBkbyBzby5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmV3U3JjICE9PSBvcmlnaW5hbFVSTClcbiAgICAgIHVybCA9IHJlc29sdmVVUkwobG9jYXRpb24sIG5ld1NyYywgbWFnaWMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgICA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IElTX1NDUklQVCAgICAgPSAvXihzY3JpcHQpJC9pO1xuY29uc3QgUkVRVUlSRV9DQUNIRSA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2Uob3duZXJEb2N1bWVudCwgbG9jYXRpb24sIF91cmwsIHNvdXJjZVN0cmluZywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdXJsICAgICAgID0gcmVzb2x2ZVVSTChsb2NhdGlvbiwgX3VybCwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBmaWxlTmFtZTtcbiAgbGV0IGJhc2VVUkwgICA9IG5ldyBVUkwoYCR7dXJsLm9yaWdpbn0ke3VybC5wYXRobmFtZS5yZXBsYWNlKC9bXi9dKyQvLCAobSkgPT4ge1xuICAgIGZpbGVOYW1lID0gbTtcbiAgICByZXR1cm4gJyc7XG4gIH0pfSR7dXJsLnNlYXJjaH0ke3VybC5oYXNofWApO1xuXG4gIGxldCB0ZW1wbGF0ZSAgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlU3RyaW5nO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCB4ID0gYS50YWdOYW1lO1xuICAgIGxldCB5ID0gYi50YWdOYW1lO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuICAgIGlmICh4ID09IHkpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHJldHVybiAoeCA8IHkpID8gMSA6IC0xO1xuICB9KTtcblxuICBjb25zdCBmaWxlTmFtZVRvRWxlbWVudE5hbWUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICByZXR1cm4gZmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLi4qJC8sICcnKS5yZXBsYWNlKC9cXGJbQS1aXXxbXkEtWl1bQS1aXS9nLCAoX20pID0+IHtcbiAgICAgIGxldCBtID0gX20udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiAobS5sZW5ndGggPCAyKSA/IGAtJHttfWAgOiBgJHttLmNoYXJBdCgwKX0tJHttLmNoYXJBdCgxKX1gO1xuICAgIH0pLnJlcGxhY2UoLy17Mix9L2csICctJykucmVwbGFjZSgvXlteYS16XSovLCAnJykucmVwbGFjZSgvW15hLXpdKiQvLCAnJyk7XG4gIH07XG5cbiAgbGV0IGd1ZXNzZWRFbGVtZW50TmFtZSAgPSBmaWxlTmFtZVRvRWxlbWVudE5hbWUoZmlsZU5hbWUpO1xuICBsZXQgbm9kZUhhbmRsZXIgICAgICAgICA9IG9wdGlvbnMubm9kZUhhbmRsZXI7XG4gIGxldCB0ZW1wbGF0ZUNvdW50ICAgICAgID0gY2hpbGRyZW4ucmVkdWNlKChzdW0sIGVsZW1lbnQpID0+ICgoSVNfVEVNUExBVEUudGVzdChlbGVtZW50LnRhZ05hbWUpKSA/IChzdW0gKyAxKSA6IHN1bSksIDApO1xuICBsZXQgY29udGV4dCAgICAgICAgICAgICA9IHtcbiAgICBjaGlsZHJlbixcbiAgICBvd25lckRvY3VtZW50LFxuICAgIHRlbXBsYXRlLFxuICAgIHRlbXBsYXRlQ291bnQsXG4gICAgdXJsLFxuICB9O1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgaWYgKHRlbXBsYXRlQ291bnQgPT09IDEgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpID09IG51bGwgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LW5hbWUnKSk7XG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKGBbZGF0YS1mb3I9XCIke2VsZW1lbnROYW1lfVwiIGldLFtkYXRhLW15dGhpeC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIiBpXWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoSVNfU0NSSVBULnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHNjcmlwdD5cbiAgICAgIGxldCBjaGlsZENsb25lID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBjaGlsZC5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBjaGlsZC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpO1xuXG4gICAgICBsZXQgc3JjID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgc3JjID0gcmVzb2x2ZVVSTChiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYy50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ21vZHVsZScpO1xuICAgICAgICBjaGlsZENsb25lLmlubmVySFRNTCA9IGNoaWxkLnRleHRDb250ZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nICYmIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNTY3JpcHQ6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgc3R5bGVJRCA9IGBJRCR7VXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZENsb25lLmlubmVySFRNTH1gKX1gO1xuICAgICAgaWYgKCFjaGlsZENsb25lLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2NyaXB0IyR7c3R5bGVJRH1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNoaWxkQ2xvbmUpO1xuICAgIH0gZWxzZSBpZiAoKC9eKGxpbmt8c3R5bGUpJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBsZXQgaXNTdHlsZSA9ICgvXnN0eWxlJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU3R5bGUsIGlzTGluazogIWlzU3R5bGUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgaWQgPSBgSUQke1V0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkOiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUob3duZXJEb2N1bWVudCwgdXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB1cmwgICAgICAgPSByZXNvbHZlVVJMKG93bmVyRG9jdW1lbnQubG9jYXRpb24sIHVybE9yTmFtZSwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBjYWNoZUtleTtcblxuICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlJykgIT09ICdmYWxzZScpIHtcbiAgICBsZXQgY2FjaGVLZXlVUkwgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWV9YCk7XG4gICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIGNhY2hlS2V5ID0gdXJsLnRvU3RyaW5nKCk7XG4gIH1cblxuICBsZXQgY2FjaGVkUmVzcG9uc2UgPSBSRVFVSVJFX0NBQ0hFLmdldChjYWNoZUtleSk7XG4gIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgaWYgKGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlICYmIGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLm9rKVxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZTogY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogdHJ1ZSB9O1xuICB9XG5cbiAgbGV0IHByb21pc2UgPSBnbG9iYWxUaGlzLmZldGNoKHVybCwgb3B0aW9ucy5mZXRjaE9wdGlvbnMpLnRoZW4oXG4gICAgYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcbiAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICBlcnJvci51cmwgPSB1cmw7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIHJlc3BvbnNlLnRleHQgPSBhc3luYyAoKSA9PiBib2R5O1xuICAgICAgcmVzcG9uc2UuanNvbiA9IGFzeW5jICgpID0+IEpTT04ucGFyc2UoYm9keSk7XG5cbiAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogZmFsc2UgfTtcbiAgICB9LFxuICAgIChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZnJvbSBNeXRoaXggVUkgXCJyZXF1aXJlXCI6ICcsIGVycm9yKTtcbiAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYykge1xuICAvLyBhd2FpdCBzbGVlcCgxNTAwKTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgIHNyYyxcbiAgKTtcblxuICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgd2hpbGUgKHRoaXMuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmNoaWxkTm9kZXNbMF0pO1xuXG4gIGxldCBzY29wZURhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBmb3IgKGxldCBbIGtleSwgdmFsdWUgXSBvZiB1cmwuc2VhcmNoUGFyYW1zLmVudHJpZXMoKSlcbiAgICBzY29wZURhdGFba2V5XSA9IFV0aWxzLmNvZXJjZSh2YWx1ZSk7XG5cbiAgbGV0IGNvbnRleHQgPSBVdGlscy5jcmVhdGVQcm94eUNvbnRleHQodGhpcywgc2NvcGVEYXRhKTtcbiAgbGV0IHNjb3BlICAgPSB7IGNvbnRleHQsICQkOiBjb250ZXh0IH07XG5cbiAgaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgIHVybCxcbiAgICBib2R5LFxuICAgIHtcbiAgICAgIG5vZGVIYW5kbGVyOiAobm9kZSwgeyBpc0hhbmRsZWQsIGlzVGVtcGxhdGUgfSkgPT4ge1xuICAgICAgICBpZiAoKGlzVGVtcGxhdGUgfHwgIWlzSGFuZGxlZCkgJiYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSlcbiAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHJlY3Vyc2l2ZWx5QmluZER5bmFtaWNEYXRhKHNjb3BlLCBub2RlKSk7XG4gICAgICB9LFxuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpYmlsaXR5T2JzZXJ2ZXIoY2FsbGJhY2ssIF9vcHRpb25zKSB7XG4gIGNvbnN0IGludGVyc2VjdGlvbkNhbGxiYWNrID0gKGVudHJpZXMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbnRyeSAgID0gZW50cmllc1tpXTtcbiAgICAgIGxldCBlbGVtZW50ID0gZW50cnkudGFyZ2V0O1xuICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSUludGVyc2VjdGlvbk9ic2VydmVycycpO1xuICAgICAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKSB7XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlJbnRlcnNlY3Rpb25PYnNlcnZlcnMnLCBlbGVtZW50T2JzZXJ2ZXJzKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRhdGEgPSBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcik7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHsgd2FzVmlzaWJsZTogZmFsc2UsIHJhdGlvVmlzaWJsZTogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gfTtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycy5zZXQob2JzZXJ2ZXIsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiBkYXRhLnJhdGlvVmlzaWJsZSlcbiAgICAgICAgZGF0YS5yYXRpb1Zpc2libGUgPSBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbztcblxuICAgICAgZGF0YS5wcmV2aW91c1Zpc2liaWxpdHkgPSAoZGF0YS52aXNpYmlsaXR5ID09PSB1bmRlZmluZWQpID8gZGF0YS52aXNpYmlsaXR5IDogZGF0YS52aXNpYmlsaXR5O1xuICAgICAgZGF0YS52aXNpYmlsaXR5ID0gKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMC4wKTtcblxuICAgICAgY2FsbGJhY2soeyAuLi5kYXRhLCBlbnRyeSwgZWxlbWVudCwgaW5kZXg6IGksIGRpc2Nvbm5lY3Q6ICgpID0+IG9ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KSB9KTtcblxuICAgICAgaWYgKGRhdGEudmlzaWJpbGl0eSAmJiAhZGF0YS53YXNWaXNpYmxlKVxuICAgICAgICBkYXRhLndhc1Zpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHtcbiAgICByb290OiAgICAgICBudWxsLFxuICAgIHRocmVzaG9sZDogIDAuMCxcbiAgICAuLi4oX29wdGlvbnMgfHwge30pLFxuICB9O1xuXG4gIGxldCBvYnNlcnZlciAgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaW50ZXJzZWN0aW9uQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICBsZXQgZWxlbWVudHMgID0gKF9vcHRpb25zIHx8IHt9KS5lbGVtZW50cyB8fCBbXTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudHNbaV0pO1xuXG4gIHJldHVybiBvYnNlcnZlcjtcbn1cblxuY29uc3QgTk9fT0JTRVJWRVIgPSBPYmplY3QuZnJlZXplKHtcbiAgd2FzVmlzaWJsZTogICAgICAgICBmYWxzZSxcbiAgcmF0aW9WaXNpYmxlOiAgICAgICAwLjAsXG4gIHZpc2liaWxpdHk6ICAgICAgICAgZmFsc2UsXG4gIHByZXZpb3VzVmlzaWJpbGl0eTogZmFsc2UsXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlNZXRhKGVsZW1lbnQsIG9ic2VydmVyKSB7XG4gIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSUludGVyc2VjdGlvbk9ic2VydmVycycpO1xuICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpXG4gICAgcmV0dXJuIE5PX09CU0VSVkVSO1xuXG4gIHJldHVybiBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcikgfHwgTk9fT0JTRVJWRVI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1hcE5vZGVUcmVlKG5vZGUsIGNhbGxiYWNrLCBfaW5kZXgpIHtcbiAgaWYgKCFub2RlKVxuICAgIHJldHVybiBub2RlO1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAobGV0IGNoaWxkTm9kZSBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykpIHtcbiAgICBsZXQgbmV3Tm9kZSA9IGNhbGxiYWNrKHJlbWFwTm9kZVRyZWUoY2hpbGROb2RlLCBjYWxsYmFjaywgaW5kZXgpLCBpbmRleCsrKTtcbiAgICBpZiAobmV3Tm9kZSAhPT0gY2hpbGROb2RlKSB7XG4gICAgICBpZiAobmV3Tm9kZSlcbiAgICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgY2hpbGROb2RlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoX2luZGV4ID09IG51bGwpID8gY2FsbGJhY2sobm9kZSwgIC0xKSA6IG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVseUJpbmREeW5hbWljRGF0YShjb250ZXh0LCBub2RlKSB7XG4gIHJldHVybiByZW1hcE5vZGVUcmVlKG5vZGUsIChub2RlKSA9PiB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICBpZiAobm9kZVZhbHVlICYmIFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShub2RlVmFsdWUpKVxuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgbm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID49IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KG5vZGUpO1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUgJiYgVXRpbHMuc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gbm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShjb250ZXh0LCBhdHRyaWJ1dGVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY29uc3QgVU5GSU5JU0hFRF9ERUZJTklUSU9OID0gU3ltYm9sLmZvcignL2pveS9lbGVtZW50RGVmaW5pdGlvbi9jb25zdGFudHMvdW5maW5pc2hlZCcpO1xuXG5jb25zdCBJU19QUk9QX05BTUUgPSAvXnByb3BcXCQvO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd0YWdOYW1lJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRhZ05hbWUsXG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH0sXG4gICAgICAnY2hpbGRyZW4nOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgY2hpbGRyZW4gfHwgW10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KC4uLmFyZ3MpO1xuICB9XG5cbiAgYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpIHtcbiAgICBsZXQgYXR0cmlidXRlcyAgICA9IHRoaXMuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZXNwYWNlVVJJICA9IGF0dHJpYnV0ZXMubmFtZXNwYWNlVVJJO1xuICAgIGxldCBvcHRpb25zO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5pcylcbiAgICAgIG9wdGlvbnMgPSB7IGlzOiB0aGlzLmF0dHJpYnV0ZXMuaXMgfTtcblxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGF0dHJpYnV0ZXMudmFsdWUgfHwgJycpO1xuICAgICAgdGV4dE5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybShjb250ZXh0LCB0ZXh0Tm9kZSk7XG4gICAgICByZXR1cm4gdGV4dE5vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZVVSSSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2UgaWYgKGlzU1ZHRWxlbWVudCh0aGlzLnRhZ05hbWUpKVxuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudGFnTmFtZSk7XG5cbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudChjb250ZXh0LCBlbGVtZW50LCBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbW9kaWZpZWRBdHRyaWJ1dGVOYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgaWYgKFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYXR0cmlidXRlXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG5cbiAgICAgICAgICAvLyBHZXQgYXR0cmlidXRlIG5vZGUganVzdCBjcmVhdGVkXG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgYXR0cmlidXRlTm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIGhhbmRsZVByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgaGFuZGxlQXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCAgICAgICAgID0gY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBjaGlsZEVsZW1lbnQgID0gY2hpbGQuYnVpbGQoZG9jdW1lbnQsIGNvbnRleHQpO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jb25zdCBJU19UQVJHRVRfUFJPUCA9IC9ecHJvdG90eXBlfGNvbnN0cnVjdG9yJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFVdGlscy5pc1R5cGUodGFnTmFtZSwgJ1N0cmluZycpKVxuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBjcmVhdGUgYW4gRWxlbWVudERlZmluaXRpb24gd2l0aG91dCBhIFwidGFnTmFtZVwiLicpO1xuXG4gIGNvbnN0IGZpbmFsaXplciA9ICguLi5fY2hpbGRyZW4pID0+IHtcbiAgICBsZXQgY2hpbGRyZW4gPSBfY2hpbGRyZW4ubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICBpZiAodmFsdWVbVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIHZhbHVlKCk7XG5cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnREZWZpbml0aW9uKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIGlmICghVXRpbHMuaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKHRhZ05hbWUsIHNjb3BlLCBjaGlsZHJlbik7XG4gIH07XG5cbiAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eShmaW5hbGl6ZXIsIHtcbiAgICBnZXQ6ICh0YXJnZXQsIGF0dHJpYnV0ZU5hbWUpID0+IHtcbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgbGV0IHNjb3BlZFByb3h5ID0gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgZGVmYXVsdEF0dHJpYnV0ZXMgfHwge30pKTtcbiAgICAgICAgcmV0dXJuIHNjb3BlZFByb3h5W2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KFxuICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiByb290UHJveHk7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gcm9vdFByb3h5W3Byb3BOYW1lXTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcm9vdFByb3h5O1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX05BTUVTID0gW107XG5jb25zdCBFID0gKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKSA9PiB7XG4gIEVMRU1FTlRfTkFNRVMucHVzaCh0YWdOYW1lKTtcbiAgcmV0dXJuIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBICAgICAgICAgID0gRSgnYScpO1xuZXhwb3J0IGNvbnN0IEFCQlIgICAgICAgPSBFKCdhYmJyJyk7XG5leHBvcnQgY29uc3QgQUREUkVTUyAgICA9IEUoJ2FkZHJlc3MnKTtcbmV4cG9ydCBjb25zdCBBUkVBICAgICAgID0gRSgnYXJlYScpO1xuZXhwb3J0IGNvbnN0IEFSVElDTEUgICAgPSBFKCdhcnRpY2xlJyk7XG5leHBvcnQgY29uc3QgQVNJREUgICAgICA9IEUoJ2FzaWRlJyk7XG5leHBvcnQgY29uc3QgQVVESU8gICAgICA9IEUoJ2F1ZGlvJyk7XG5leHBvcnQgY29uc3QgQiAgICAgICAgICA9IEUoJ2InKTtcbmV4cG9ydCBjb25zdCBCQVNFICAgICAgID0gRSgnYmFzZScpO1xuZXhwb3J0IGNvbnN0IEJESSAgICAgICAgPSBFKCdiZGknKTtcbmV4cG9ydCBjb25zdCBCRE8gICAgICAgID0gRSgnYmRvJyk7XG5leHBvcnQgY29uc3QgQkxPQ0tRVU9URSA9IEUoJ2Jsb2NrcXVvdGUnKTtcbmV4cG9ydCBjb25zdCBCUiAgICAgICAgID0gRSgnYnInKTtcbmV4cG9ydCBjb25zdCBCVVRUT04gICAgID0gRSgnYnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ0FOVkFTICAgICA9IEUoJ2NhbnZhcycpO1xuZXhwb3J0IGNvbnN0IENBUFRJT04gICAgPSBFKCdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgQ0lURSAgICAgICA9IEUoJ2NpdGUnKTtcbmV4cG9ydCBjb25zdCBDT0RFICAgICAgID0gRSgnY29kZScpO1xuZXhwb3J0IGNvbnN0IENPTCAgICAgICAgPSBFKCdjb2wnKTtcbmV4cG9ydCBjb25zdCBDT0xHUk9VUCAgID0gRSgnY29sZ3JvdXAnKTtcbmV4cG9ydCBjb25zdCBEQVRBICAgICAgID0gRSgnZGF0YScpO1xuZXhwb3J0IGNvbnN0IERBVEFMSVNUICAgPSBFKCdkYXRhbGlzdCcpO1xuZXhwb3J0IGNvbnN0IEREICAgICAgICAgPSBFKCdkZCcpO1xuZXhwb3J0IGNvbnN0IERFTCAgICAgICAgPSBFKCdkZWwnKTtcbmV4cG9ydCBjb25zdCBERVRBSUxTICAgID0gRSgnZGV0YWlscycpO1xuZXhwb3J0IGNvbnN0IERGTiAgICAgICAgPSBFKCdkZm4nKTtcbmV4cG9ydCBjb25zdCBESUFMT0cgICAgID0gRSgnZGlhbG9nJyk7XG5leHBvcnQgY29uc3QgRElWICAgICAgICA9IEUoJ2RpdicpO1xuZXhwb3J0IGNvbnN0IERMICAgICAgICAgPSBFKCdkbCcpO1xuZXhwb3J0IGNvbnN0IERUICAgICAgICAgPSBFKCdkdCcpO1xuZXhwb3J0IGNvbnN0IEVNICAgICAgICAgPSBFKCdlbScpO1xuZXhwb3J0IGNvbnN0IEVNQkVEICAgICAgPSBFKCdlbWJlZCcpO1xuZXhwb3J0IGNvbnN0IEZJRUxEU0VUICAgPSBFKCdmaWVsZHNldCcpO1xuZXhwb3J0IGNvbnN0IEZJR0NBUFRJT04gPSBFKCdmaWdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgRklHVVJFICAgICA9IEUoJ2ZpZ3VyZScpO1xuZXhwb3J0IGNvbnN0IEZPT1RFUiAgICAgPSBFKCdmb290ZXInKTtcbmV4cG9ydCBjb25zdCBGT1JNICAgICAgID0gRSgnZm9ybScpO1xuZXhwb3J0IGNvbnN0IEgxICAgICAgICAgPSBFKCdoMScpO1xuZXhwb3J0IGNvbnN0IEgyICAgICAgICAgPSBFKCdoMicpO1xuZXhwb3J0IGNvbnN0IEgzICAgICAgICAgPSBFKCdoMycpO1xuZXhwb3J0IGNvbnN0IEg0ICAgICAgICAgPSBFKCdoNCcpO1xuZXhwb3J0IGNvbnN0IEg1ICAgICAgICAgPSBFKCdoNScpO1xuZXhwb3J0IGNvbnN0IEg2ICAgICAgICAgPSBFKCdoNicpO1xuZXhwb3J0IGNvbnN0IEhFQURFUiAgICAgPSBFKCdoZWFkZXInKTtcbmV4cG9ydCBjb25zdCBIR1JPVVAgICAgID0gRSgnaGdyb3VwJyk7XG5leHBvcnQgY29uc3QgSFIgICAgICAgICA9IEUoJ2hyJyk7XG5leHBvcnQgY29uc3QgSSAgICAgICAgICA9IEUoJ2knKTtcbmV4cG9ydCBjb25zdCBJRlJBTUUgICAgID0gRSgnaWZyYW1lJyk7XG5leHBvcnQgY29uc3QgSU1HICAgICAgICA9IEUoJ2ltZycpO1xuZXhwb3J0IGNvbnN0IElOUFVUICAgICAgPSBFKCdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IElOUyAgICAgICAgPSBFKCdpbnMnKTtcbmV4cG9ydCBjb25zdCBLQkQgICAgICAgID0gRSgna2JkJyk7XG5leHBvcnQgY29uc3QgTEFCRUwgICAgICA9IEUoJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgTEVHRU5EICAgICA9IEUoJ2xlZ2VuZCcpO1xuZXhwb3J0IGNvbnN0IExJICAgICAgICAgPSBFKCdsaScpO1xuZXhwb3J0IGNvbnN0IExJTksgICAgICAgPSBFKCdsaW5rJyk7XG5leHBvcnQgY29uc3QgTUFJTiAgICAgICA9IEUoJ21haW4nKTtcbmV4cG9ydCBjb25zdCBNQVAgICAgICAgID0gRSgnbWFwJyk7XG5leHBvcnQgY29uc3QgTUFSSyAgICAgICA9IEUoJ21hcmsnKTtcbmV4cG9ydCBjb25zdCBNRU5VICAgICAgID0gRSgnbWVudScpO1xuZXhwb3J0IGNvbnN0IE1FVEEgICAgICAgPSBFKCdtZXRhJyk7XG5leHBvcnQgY29uc3QgTUVURVIgICAgICA9IEUoJ21ldGVyJyk7XG5leHBvcnQgY29uc3QgTkFWICAgICAgICA9IEUoJ25hdicpO1xuZXhwb3J0IGNvbnN0IE5PU0NSSVBUICAgPSBFKCdub3NjcmlwdCcpO1xuZXhwb3J0IGNvbnN0IE9CSkVDVCAgICAgPSBFKCdvYmplY3QnKTtcbmV4cG9ydCBjb25zdCBPTCAgICAgICAgID0gRSgnb2wnKTtcbmV4cG9ydCBjb25zdCBPUFRHUk9VUCAgID0gRSgnb3B0Z3JvdXAnKTtcbmV4cG9ydCBjb25zdCBPUFRJT04gICAgID0gRSgnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgT1VUUFVUICAgICA9IEUoJ291dHB1dCcpO1xuZXhwb3J0IGNvbnN0IFAgICAgICAgICAgPSBFKCdwJyk7XG5leHBvcnQgY29uc3QgUElDVFVSRSAgICA9IEUoJ3BpY3R1cmUnKTtcbmV4cG9ydCBjb25zdCBQUkUgICAgICAgID0gRSgncHJlJyk7XG5leHBvcnQgY29uc3QgUFJPR1JFU1MgICA9IEUoJ3Byb2dyZXNzJyk7XG5leHBvcnQgY29uc3QgUSAgICAgICAgICA9IEUoJ3EnKTtcbmV4cG9ydCBjb25zdCBSUCAgICAgICAgID0gRSgncnAnKTtcbmV4cG9ydCBjb25zdCBSVCAgICAgICAgID0gRSgncnQnKTtcbmV4cG9ydCBjb25zdCBSVUJZICAgICAgID0gRSgncnVieScpO1xuZXhwb3J0IGNvbnN0IFMgICAgICAgICAgPSBFKCdzJyk7XG5leHBvcnQgY29uc3QgU0FNUCAgICAgICA9IEUoJ3NhbXAnKTtcbmV4cG9ydCBjb25zdCBTQ1JJUFQgICAgID0gRSgnc2NyaXB0Jyk7XG5leHBvcnQgY29uc3QgU0VDVElPTiAgICA9IEUoJ3NlY3Rpb24nKTtcbmV4cG9ydCBjb25zdCBTRUxFQ1QgICAgID0gRSgnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3QgU0xPVCAgICAgICA9IEUoJ3Nsb3QnKTtcbmV4cG9ydCBjb25zdCBTTUFMTCAgICAgID0gRSgnc21hbGwnKTtcbmV4cG9ydCBjb25zdCBTT1VSQ0UgICAgID0gRSgnc291cmNlJyk7XG5leHBvcnQgY29uc3QgU1BBTiAgICAgICA9IEUoJ3NwYW4nKTtcbmV4cG9ydCBjb25zdCBTVFJPTkcgICAgID0gRSgnc3Ryb25nJyk7XG5leHBvcnQgY29uc3QgU1RZTEUgICAgICA9IEUoJ3N0eWxlJyk7XG5leHBvcnQgY29uc3QgU1VCICAgICAgICA9IEUoJ3N1YicpO1xuZXhwb3J0IGNvbnN0IFNVTU1BUlkgICAgPSBFKCdzdW1tYXJ5Jyk7XG5leHBvcnQgY29uc3QgU1VQICAgICAgICA9IEUoJ3N1cCcpO1xuZXhwb3J0IGNvbnN0IFRBQkxFICAgICAgPSBFKCd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IFRCT0RZICAgICAgPSBFKCd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IFREICAgICAgICAgPSBFKCd0ZCcpO1xuZXhwb3J0IGNvbnN0IFRFTVBMQVRFICAgPSBFKCd0ZW1wbGF0ZScpO1xuZXhwb3J0IGNvbnN0IFRFWFRBUkVBICAgPSBFKCd0ZXh0YXJlYScpO1xuZXhwb3J0IGNvbnN0IFRGT09UICAgICAgPSBFKCd0Zm9vdCcpO1xuZXhwb3J0IGNvbnN0IFRIICAgICAgICAgPSBFKCd0aCcpO1xuZXhwb3J0IGNvbnN0IFRIRUFEICAgICAgPSBFKCd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IFRJTUUgICAgICAgPSBFKCd0aW1lJyk7XG5leHBvcnQgY29uc3QgVElUTEUgICAgICA9IEUoJ3RpdGxlJyk7XG5leHBvcnQgY29uc3QgVFIgICAgICAgICA9IEUoJ3RyJyk7XG5leHBvcnQgY29uc3QgVFJBQ0sgICAgICA9IEUoJ3RyYWNrJyk7XG5leHBvcnQgY29uc3QgVSAgICAgICAgICA9IEUoJ3UnKTtcbmV4cG9ydCBjb25zdCBVTCAgICAgICAgID0gRSgndWwnKTtcbmV4cG9ydCBjb25zdCBWQVIgICAgICAgID0gRSgndmFyJyk7XG5leHBvcnQgY29uc3QgVklERU8gICAgICA9IEUoJ3ZpZGVvJyk7XG5leHBvcnQgY29uc3QgV0JSICAgICAgICA9IEUoJ3dicicpO1xuXG5leHBvcnQgY29uc3QgU1ZHX0VMRU1FTlRfTkFNRVMgPSBbXTtcblxuY29uc3QgU0UgPSAodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMpID0+IHtcbiAgU1ZHX0VMRU1FTlRfTkFNRVMucHVzaCh0YWdOYW1lKTtcbiAgcmV0dXJuIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKTtcbn07XG5cbi8vIFNWRyBlbGVtZW50IG5hbWVzXG5leHBvcnQgY29uc3QgQUxUR0xZUEggICAgICAgICAgICAgPSBTRSgnYWx0Z2x5cGgnKTtcbmV4cG9ydCBjb25zdCBBTFRHTFlQSERFRiAgICAgICAgICA9IFNFKCdhbHRnbHlwaGRlZicpO1xuZXhwb3J0IGNvbnN0IEFMVEdMWVBISVRFTSAgICAgICAgID0gU0UoJ2FsdGdseXBoaXRlbScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVEUgICAgICAgICAgICAgID0gU0UoJ2FuaW1hdGUnKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFQ09MT1IgICAgICAgICA9IFNFKCdhbmltYXRlQ29sb3InKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFTU9USU9OICAgICAgICA9IFNFKCdhbmltYXRlTW90aW9uJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURVRSQU5TRk9STSAgICAgPSBTRSgnYW5pbWF0ZVRyYW5zZm9ybScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTiAgICAgICAgICAgID0gU0UoJ2FuaW1hdGlvbicpO1xuZXhwb3J0IGNvbnN0IENJUkNMRSAgICAgICAgICAgICAgID0gU0UoJ2NpcmNsZScpO1xuZXhwb3J0IGNvbnN0IENMSVBQQVRIICAgICAgICAgICAgID0gU0UoJ2NsaXBQYXRoJyk7XG5leHBvcnQgY29uc3QgQ09MT1JQUk9GSUxFICAgICAgICAgPSBTRSgnY29sb3JQcm9maWxlJyk7XG5leHBvcnQgY29uc3QgQ1VSU09SICAgICAgICAgICAgICAgPSBTRSgnY3Vyc29yJyk7XG5leHBvcnQgY29uc3QgREVGUyAgICAgICAgICAgICAgICAgPSBTRSgnZGVmcycpO1xuZXhwb3J0IGNvbnN0IERFU0MgICAgICAgICAgICAgICAgID0gU0UoJ2Rlc2MnKTtcbmV4cG9ydCBjb25zdCBESVNDQVJEICAgICAgICAgICAgICA9IFNFKCdkaXNjYXJkJyk7XG5leHBvcnQgY29uc3QgRUxMSVBTRSAgICAgICAgICAgICAgPSBTRSgnZWxsaXBzZScpO1xuZXhwb3J0IGNvbnN0IEZFQkxFTkQgICAgICAgICAgICAgID0gU0UoJ2ZlYmxlbmQnKTtcbmV4cG9ydCBjb25zdCBGRUNPTE9STUFUUklYICAgICAgICA9IFNFKCdmZWNvbG9ybWF0cml4Jyk7XG5leHBvcnQgY29uc3QgRkVDT01QT05FTlRUUkFOU0ZFUiAgPSBTRSgnZmVjb21wb25lbnR0cmFuc2ZlcicpO1xuZXhwb3J0IGNvbnN0IEZFQ09NUE9TSVRFICAgICAgICAgID0gU0UoJ2ZlY29tcG9zaXRlJyk7XG5leHBvcnQgY29uc3QgRkVDT05WT0xWRU1BVFJJWCAgICAgPSBTRSgnZmVjb252b2x2ZW1hdHJpeCcpO1xuZXhwb3J0IGNvbnN0IEZFRElGRlVTRUxJR0hUSU5HICAgID0gU0UoJ2ZlZGlmZnVzZWxpZ2h0aW5nJyk7XG5leHBvcnQgY29uc3QgRkVESVNQTEFDRU1FTlRNQVAgICAgPSBTRSgnZmVkaXNwbGFjZW1lbnRtYXAnKTtcbmV4cG9ydCBjb25zdCBGRURJU1RBTlRMSUdIVCAgICAgICA9IFNFKCdmZWRpc3RhbnRsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFRFJPUFNIQURPVyAgICAgICAgID0gU0UoJ2ZlZHJvcHNoYWRvdycpO1xuZXhwb3J0IGNvbnN0IEZFRkxPT0QgICAgICAgICAgICAgID0gU0UoJ2ZlZmxvb2QnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNBICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNhJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DQiAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jYicpO1xuZXhwb3J0IGNvbnN0IEZFRlVOQ0cgICAgICAgICAgICAgID0gU0UoJ2ZlZnVuY2cnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNSICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNyJyk7XG5leHBvcnQgY29uc3QgRkVHQVVTU0lBTkJMVVIgICAgICAgPSBTRSgnZmVnYXVzc2lhbmJsdXInKTtcbmV4cG9ydCBjb25zdCBGRUlNQUdFICAgICAgICAgICAgICA9IFNFKCdmZWltYWdlJyk7XG5leHBvcnQgY29uc3QgRkVNRVJHRSAgICAgICAgICAgICAgPSBTRSgnZmVtZXJnZScpO1xuZXhwb3J0IGNvbnN0IEZFTUVSR0VOT0RFICAgICAgICAgID0gU0UoJ2ZlbWVyZ2Vub2RlJyk7XG5leHBvcnQgY29uc3QgRkVNT1JQSE9MT0dZICAgICAgICAgPSBTRSgnZmVtb3JwaG9sb2d5Jyk7XG5leHBvcnQgY29uc3QgRkVPRkZTRVQgICAgICAgICAgICAgPSBTRSgnZmVvZmZzZXQnKTtcbmV4cG9ydCBjb25zdCBGRVBPSU5UTElHSFQgICAgICAgICA9IFNFKCdmZXBvaW50bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRVNQRUNVTEFSTElHSFRJTkcgICA9IFNFKCdmZXNwZWN1bGFybGlnaHRpbmcnKTtcbmV4cG9ydCBjb25zdCBGRVNQT1RMSUdIVCAgICAgICAgICA9IFNFKCdmZXNwb3RsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFVElMRSAgICAgICAgICAgICAgID0gU0UoJ2ZldGlsZScpO1xuZXhwb3J0IGNvbnN0IEZFVFVSQlVMRU5DRSAgICAgICAgID0gU0UoJ2ZldHVyYnVsZW5jZScpO1xuZXhwb3J0IGNvbnN0IEZJTFRFUiAgICAgICAgICAgICAgID0gU0UoJ2ZpbHRlcicpO1xuZXhwb3J0IGNvbnN0IEZPTlQgICAgICAgICAgICAgICAgID0gU0UoJ2ZvbnQnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRSAgICAgICAgICAgICA9IFNFKCdmb250RmFjZScpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFRk9STUFUICAgICAgID0gU0UoJ2ZvbnRGYWNlRm9ybWF0Jyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VOQU1FICAgICAgICAgPSBTRSgnZm9udEZhY2VOYW1lJyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VTUkMgICAgICAgICAgPSBTRSgnZm9udEZhY2VTcmMnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRVVSSSAgICAgICAgICA9IFNFKCdmb250RmFjZVVyaScpO1xuZXhwb3J0IGNvbnN0IEZPUkVJR05PQkpFQ1QgICAgICAgID0gU0UoJ2ZvcmVpZ25PYmplY3QnKTtcbmV4cG9ydCBjb25zdCBHICAgICAgICAgICAgICAgICAgICA9IFNFKCdnJyk7XG5leHBvcnQgY29uc3QgR0xZUEggICAgICAgICAgICAgICAgPSBTRSgnZ2x5cGgnKTtcbmV4cG9ydCBjb25zdCBHTFlQSFJFRiAgICAgICAgICAgICA9IFNFKCdnbHlwaFJlZicpO1xuZXhwb3J0IGNvbnN0IEhBTkRMRVIgICAgICAgICAgICAgID0gU0UoJ2hhbmRsZXInKTtcbmV4cG9ydCBjb25zdCBIS0VSTiAgICAgICAgICAgICAgICA9IFNFKCdoS2VybicpO1xuZXhwb3J0IGNvbnN0IElNQUdFICAgICAgICAgICAgICAgID0gU0UoJ2ltYWdlJyk7XG5leHBvcnQgY29uc3QgTElORSAgICAgICAgICAgICAgICAgPSBTRSgnbGluZScpO1xuZXhwb3J0IGNvbnN0IExJTkVBUkdSQURJRU5UICAgICAgID0gU0UoJ2xpbmVhcmdyYWRpZW50Jyk7XG5leHBvcnQgY29uc3QgTElTVEVORVIgICAgICAgICAgICAgPSBTRSgnbGlzdGVuZXInKTtcbmV4cG9ydCBjb25zdCBNQVJLRVIgICAgICAgICAgICAgICA9IFNFKCdtYXJrZXInKTtcbmV4cG9ydCBjb25zdCBNQVNLICAgICAgICAgICAgICAgICA9IFNFKCdtYXNrJyk7XG5leHBvcnQgY29uc3QgTUVUQURBVEEgICAgICAgICAgICAgPSBTRSgnbWV0YWRhdGEnKTtcbmV4cG9ydCBjb25zdCBNSVNTSU5HR0xZUEggICAgICAgICA9IFNFKCdtaXNzaW5nR2x5cGgnKTtcbmV4cG9ydCBjb25zdCBNUEFUSCAgICAgICAgICAgICAgICA9IFNFKCdtUGF0aCcpO1xuZXhwb3J0IGNvbnN0IFBBVEggICAgICAgICAgICAgICAgID0gU0UoJ3BhdGgnKTtcbmV4cG9ydCBjb25zdCBQQVRURVJOICAgICAgICAgICAgICA9IFNFKCdwYXR0ZXJuJyk7XG5leHBvcnQgY29uc3QgUE9MWUdPTiAgICAgICAgICAgICAgPSBTRSgncG9seWdvbicpO1xuZXhwb3J0IGNvbnN0IFBPTFlMSU5FICAgICAgICAgICAgID0gU0UoJ3BvbHlsaW5lJyk7XG5leHBvcnQgY29uc3QgUFJFRkVUQ0ggICAgICAgICAgICAgPSBTRSgncHJlZmV0Y2gnKTtcbmV4cG9ydCBjb25zdCBSQURJQUxHUkFESUVOVCAgICAgICA9IFNFKCdyYWRpYWxncmFkaWVudCcpO1xuZXhwb3J0IGNvbnN0IFJFQ1QgICAgICAgICAgICAgICAgID0gU0UoJ3JlY3QnKTtcbmV4cG9ydCBjb25zdCBTRVQgICAgICAgICAgICAgICAgICA9IFNFKCdzZXQnKTtcbmV4cG9ydCBjb25zdCBTT0xJRENPTE9SICAgICAgICAgICA9IFNFKCdzb2xpZENvbG9yJyk7XG5leHBvcnQgY29uc3QgU1RPUCAgICAgICAgICAgICAgICAgPSBTRSgnc3RvcCcpO1xuZXhwb3J0IGNvbnN0IFNWRyAgICAgICAgICAgICAgICAgID0gU0UoJ3N2ZycpO1xuZXhwb3J0IGNvbnN0IFNXSVRDSCAgICAgICAgICAgICAgID0gU0UoJ3N3aXRjaCcpO1xuZXhwb3J0IGNvbnN0IFNZTUJPTCAgICAgICAgICAgICAgID0gU0UoJ3N5bWJvbCcpO1xuZXhwb3J0IGNvbnN0IFRCUkVBSyAgICAgICAgICAgICAgID0gU0UoJ3RicmVhaycpO1xuZXhwb3J0IGNvbnN0IFRFWFQgICAgICAgICAgICAgICAgID0gU0UoJ3RleHQnKTtcbmV4cG9ydCBjb25zdCBURVhUUEFUSCAgICAgICAgICAgICA9IFNFKCd0ZXh0cGF0aCcpO1xuZXhwb3J0IGNvbnN0IFRSRUYgICAgICAgICAgICAgICAgID0gU0UoJ3RyZWYnKTtcbmV4cG9ydCBjb25zdCBUU1BBTiAgICAgICAgICAgICAgICA9IFNFKCd0c3BhbicpO1xuZXhwb3J0IGNvbnN0IFVOS05PV04gICAgICAgICAgICAgID0gU0UoJ3Vua25vd24nKTtcbmV4cG9ydCBjb25zdCBVU0UgICAgICAgICAgICAgICAgICA9IFNFKCd1c2UnKTtcbmV4cG9ydCBjb25zdCBWSUVXICAgICAgICAgICAgICAgICA9IFNFKCd2aWV3Jyk7XG5leHBvcnQgY29uc3QgVktFUk4gICAgICAgICAgICAgICAgPSBTRSgndktlcm4nKTtcblxuY29uc3QgU1ZHX1JFID0gbmV3IFJlZ0V4cChgXigke1NWR19FTEVNRU5UX05BTUVTLmpvaW4oJ3wnKX0pJGAsICdpJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gU1ZHX1JFLnRlc3QodGFnTmFtZSk7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7XG4gIE15dGhpeFVJQ29tcG9uZW50LFxuICByZXF1aXJlLFxufSBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcic7XG5cbiAgc2V0IGF0dHIkbGFuZyhbIG9sZFZhbHVlLCBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVMYW5nQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Rlcm1zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIHB1Ymxpc2hDb250ZXh0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBpMThuOiAoX3BhdGgsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgICAgICBsZXQgcGF0aCAgICA9IGBnbG9iYWwuaTE4bi4ke19wYXRofWA7XG4gICAgICAgIGxldCByZXN1bHQgID0gVXRpbHMuZmV0Y2hQYXRoKHRoaXMudGVybXMsIHBhdGgpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgICAgICByZXR1cm4gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIHBhdGgsIChkZWZhdWx0VmFsdWUgPT0gbnVsbCkgPyAnJyA6IGRlZmF1bHRWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGdldFNvdXJjZUZvckxhbmcobGFuZykge1xuICAgIHJldHVybiB0aGlzLiQoYHNvdXJjZVt0eXBlXj1cImxhbmcvXCIgaV1bbGFuZ149XCIke2xhbmcucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApWzBdO1xuICB9XG5cbiAgaGFuZGxlTGFuZ0F0dHJpYnV0ZUNoYW5nZShfbGFuZykge1xuICAgIGxldCBsYW5nICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudCA9IHRoaXMuZ2V0U291cmNlRm9yTGFuZyhsYW5nKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnQgfHwgIXNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBObyBcInNvdXJjZVwiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkTGFuZ3VhZ2VUZXJtcyhsYW5nLCBzb3VyY2VFbGVtZW50KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRMYW5ndWFnZVRlcm1zKGxhbmcsIHNvdXJjZUVsZW1lbnQsIF9vcHRpb25zKSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IHJlcXVpcmUuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQsIHNyYyk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgYXdhaXQgcmVzcG9uc2UuanNvbigpKTtcblxuICAgICAgY29uc29sZS5sb2coJ0NvbXBpbGVkIHRlcm1zOiAnLCBjb21waWxlZFRlcm1zKTtcblxuICAgICAgdGhpcy50ZXJtcyA9IGNvbXBpbGVkVGVybXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVMYW5ndWFnZVRlcm1zKGxhbmcsIHRlcm1zKSB7XG4gICAgY29uc3Qgd2Fsa1Rlcm1zID0gKHRlcm1zLCByYXdLZXlQYXRoKSA9PiB7XG4gICAgICBsZXQga2V5cyAgICAgID0gT2JqZWN0LmtleXModGVybXMpO1xuICAgICAgbGV0IHRlcm1zQ29weSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGtleSAgICAgICAgID0ga2V5c1tpXTtcbiAgICAgICAgbGV0IHZhbHVlICAgICAgID0gdGVybXNba2V5XTtcbiAgICAgICAgbGV0IG5ld0tleVBhdGggID0gcmF3S2V5UGF0aC5jb25jYXQoa2V5KTtcblxuICAgICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdCh2YWx1ZSkgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHdhbGtUZXJtcyh2YWx1ZSwgbmV3S2V5UGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIG5ld0tleVBhdGguam9pbignLicpLCB2YWx1ZSk7XG4gICAgICAgICAgdGVybXNDb3B5W2tleV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgICBwcm9wZXJ0eS5zZXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXJtc0NvcHk7XG4gICAgfTtcblxuICAgIHJldHVybiB3YWxrVGVybXModGVybXMsIFsgJ2dsb2JhbCcsICdpMThuJyBdKTtcbiAgfVxufVxuXG5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciA9IE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlcjtcbiIsImltcG9ydCAqIGFzIENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSVJlcXVpcmUgZXh0ZW5kcyBDb21wb25lbnQuTXl0aGl4VUlDb21wb25lbnQge1xuICBhc3luYyBtb3VudGVkKCkge1xuICAgIGxldCBzcmMgPSB0aGlzLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICB0cnkge1xuICAgICAgbGV0IHtcbiAgICAgICAgb3duZXJEb2N1bWVudCxcbiAgICAgICAgdXJsLFxuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgY2FjaGVkLFxuICAgICAgfSA9IGF3YWl0IENvbXBvbmVudC5yZXF1aXJlLmNhbGwoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICAgICAgc3JjLFxuICAgICAgICB7XG4gICAgICAgICAgbWFnaWM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgICBpZiAoY2FjaGVkKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgQ29tcG9uZW50LmltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3duZXJEb2N1bWVudCxcbiAgICAgICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICAgICAgdXJsLFxuICAgICAgICBib2R5LFxuICAgICAgICB7XG4gICAgICAgICAgbm9kZUhhbmRsZXI6IChub2RlLCB7IGlzSGFuZGxlZCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzSGFuZGxlZCAmJiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSlcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtcmVxdWlyZVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICAvLyBOT09QXG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJUmVxdWlyZTtcblxuaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIE15dGhpeFVJUmVxdWlyZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG4vKlxuTWFueSB0aGFua3MgdG8gU2FnZWUgQ29ud2F5IGZvciB0aGUgZm9sbG93aW5nIENTUyBzcGlubmVyc1xuaHR0cHM6Ly9jb2RlcGVuLmlvL3NhY29ud2F5L3Blbi92WUtZeXJ4XG4qL1xuXG5jb25zdCBTVFlMRV9TSEVFVCA9XG5gXG46aG9zdCB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogMWVtO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG46aG9zdCguc21hbGwpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDAuNzUpO1xufVxuOmhvc3QoLm1lZGl1bSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMS41KTtcbn1cbjpob3N0KC5sYXJnZSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMyk7XG59XG4uc3Bpbm5lci1pdGVtLFxuLnNwaW5uZXItaXRlbTo6YmVmb3JlLFxuLnNwaW5uZXItaXRlbTo6YWZ0ZXIge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNjAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMjUpO1xuICB9XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMik7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3M6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjA3NSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGJvcmRlcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1sZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMS4wKTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgKiAwLjA3NSkgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci1ib3R0b206IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjg3NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMykge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSkgcm90YXRlKDQ1ZGVnKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyLjUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlcjogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEge1xuICAwJSwgOC4zMyUsIDE2LjY2JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNC45OSUsIDMzLjMyJSwgNDEuNjUlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwJSk7XG4gIH1cbiAgNDkuOTglLCA1OC4zMSUsIDY2LjY0JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMTAwJSk7XG4gIH1cbiAgNzQuOTclLCA4My4zMCUsIDkxLjYzJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyB7XG4gIDAlLCA4My4zMCUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCk7XG4gIH1cbiAgOC4zMyUsIDE2LjY2JSwgMjQuOTklIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG4gIH1cbiAgMzMuMzIlLCA0MS42NSUsIDQ5Ljk4JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIC0xMDAlKTtcbiAgfVxuICA1OC4zMSUsIDY2LjY0JSwgNzQuOTclIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gNCk7XG4gIG1pbi13aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg3NSUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03NSUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDQwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24ge1xuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDIpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAyKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSAvIC0yKTtcbn1cbmA7XG5cbmNvbnN0IEtJTkRTID0ge1xuICAnYXVkaW8nOiAgNSxcbiAgJ2NpcmNsZSc6IDMsXG4gICdkb3QnOiAgICAyLFxuICAncGlwZSc6ICAgNSxcbiAgJ3B1enpsZSc6IDMsXG4gICd3YXZlJzogICAzLFxufTtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJU3Bpbm5lciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LXNwaW5uZXInO1xuXG4gIHNldCBhdHRyJGtpbmQoWyBfLCBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIGFwcGVuZCB0ZW1wbGF0ZVxuICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICB0aGlzLmJ1aWxkKCh7IFRFTVBMQVRFIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIFRFTVBMQVRFXG4gICAgICAgICAgLmRhdGFNeXRoaXhOYW1lKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSlcbiAgICAgICAgICAucHJvcCRpbm5lckhUTUwoYDxzdHlsZT4ke1NUWUxFX1NIRUVUfTwvc3R5bGU+YCk7XG4gICAgICB9KS5hcHBlbmRUbyhvd25lckRvY3VtZW50LmJvZHkpO1xuXG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBsZXQga2luZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdraW5kJyk7XG4gICAgaWYgKCFraW5kKSB7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2tpbmQnLCBraW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2Uoa2luZCk7XG4gIH1cblxuICBoYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKF9raW5kKSB7XG4gICAgbGV0IGtpbmQgICAgICAgID0gKCcnICsgX2tpbmQpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoS0lORFMsIGtpbmQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXNwaW5uZXJcIiB1bmtub3duIFwia2luZFwiIHByb3ZpZGVkOiBcIiR7a2luZH1cIi4gU3VwcG9ydGVkIFwia2luZFwiIGF0dHJpYnV0ZSB2YWx1ZXMgYXJlOiBcInBpcGVcIiwgXCJhdWRpb1wiLCBcImNpcmNsZVwiLCBcInB1enpsZVwiLCBcIndhdmVcIiwgYW5kIFwiZG90XCIuYCk7XG4gICAgICBraW5kID0gJ3BpcGUnO1xuICAgIH1cblxuICAgIHRoaXMuY2hhbmdlU3Bpbm5lckNoaWxkcmVuKEtJTkRTW2tpbmRdKTtcbiAgfVxuXG4gIGJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgbGV0IGNoaWxkcmVuICAgICAgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGlubmVyLWl0ZW0nKTtcblxuICAgICAgY2hpbGRyZW5baV0gPSBlbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiQoY2hpbGRyZW4pO1xuICB9XG5cbiAgY2hhbmdlU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgdGhpcy4kKCcuc3Bpbm5lci1pdGVtJykucmVtb3ZlKCk7XG4gICAgdGhpcy5idWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBzdHlsZSBhZ2Fpbiwgc29cbiAgICAvLyB0aGF0IGl0IGlzIHRoZSBsYXN0IGNoaWxkLCBhbmRcbiAgICAvLyBkb2Vzbid0IG1lc3Mgd2l0aCBcIm50aC1jaGlsZFwiXG4gICAgLy8gc2VsZWN0b3JzXG4gICAgdGhpcy4kKCdzdHlsZScpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcbiAgfVxufVxuXG5NeXRoaXhVSVNwaW5uZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJU3Bpbm5lcjtcbiIsImltcG9ydCAqIGFzIFV0aWxzICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHtcbiAgRWxlbWVudERlZmluaXRpb24sXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmNvbnN0IElTX0lOVEVHRVIgPSAvXlxcZCskLztcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFdlIGhhdmUgYW4gRWxlbWVudCBvciBhIERvY3VtZW50XG4gIGlmICh2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gaXNOb3RTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAhZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDbGFzc05hbWVzKC4uLmFyZ3MpIHtcbiAgbGV0IGNsYXNzTmFtZXMgPSBbXS5jb25jYXQoLi4uYXJncylcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLm1hcCgocGFydCkgPT4gKCcnICsgcGFydCkuc3BsaXQoL1xccysvKSlcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gY2xhc3NOYW1lcztcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIGlzRWxlbWVudCAgICA9IGlzRWxlbWVudDtcbiAgc3RhdGljIGlzU2xvdHRlZCAgICA9IGlzU2xvdHRlZDtcbiAgc3RhdGljIGlzTm90U2xvdHRlZCA9IGlzTm90U2xvdHRlZDtcblxuICBzdGF0aWMgZnJvbSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKFtdLCB7IHJvb3Q6IChpc0VsZW1lbnQodGhpcykpID8gdGhpcyA6IGRvY3VtZW50LCBjb250ZXh0OiB0aGlzIH0pO1xuXG4gICAgY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGxldCBiYXNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oYmFzZSwgYXJnc1thcmdJbmRleCsrXSk7XG5cbiAgICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBhcmdzW2FyZ0luZGV4XS5nZXRPcHRpb25zKCkgfHwge30sIGJhc2UpO1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0Um9vdEVsZW1lbnQgPSAob3B0aW9uc1Jvb3QpID0+IHtcbiAgICAgIGlmIChpc0VsZW1lbnQob3B0aW9uc1Jvb3QpKVxuICAgICAgICByZXR1cm4gb3B0aW9uc1Jvb3Q7XG5cbiAgICAgIGlmIChpc0VsZW1lbnQodGhpcykpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICByZXR1cm4gKCh0aGlzICYmIHRoaXMub3duZXJEb2N1bWVudCkgfHwgZG9jdW1lbnQpO1xuICAgIH07XG5cbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gZ2V0T3B0aW9ucygpO1xuICAgIGxldCByb290ICAgICAgPSBnZXRSb290RWxlbWVudChvcHRpb25zLnJvb3QpO1xuICAgIGxldCBxdWVyeUVuZ2luZTtcblxuICAgIG9wdGlvbnMucm9vdCA9IHJvb3Q7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IHRoaXM7XG5cbiAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0uc2xpY2UoKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzW2FyZ0luZGV4XSkpIHtcbiAgICAgIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleCArIDFdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbMV07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ1N0cmluZycpKSB7XG4gICAgICBvcHRpb25zLnNlbGVjdG9yID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ0Z1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyb290LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3RvciksIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSkge1xuICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpXG4gICAgICAgIHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaW52b2tlQ2FsbGJhY2tzICE9PSBmYWxzZSAmJiB0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjayk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH07XG5cbiAgZ2V0RW5naW5lQ2xhc3MoKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlPcHRpb25zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSUVsZW1lbnRzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMob3B0aW9ucy5jb250ZXh0LCBlbGVtZW50cyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lIGluIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnbGVuZ3RoJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQucHJvdG90eXBlO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIC8vIEluZGV4IGxvb2t1cFxuICAgICAgICBpZiAoSVNfSU5URUdFUi50ZXN0KHByb3BOYW1lKSlcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICAgIC8vIFJlZGlyZWN0IGFueSBhcnJheSBtZXRob2RzOlxuICAgICAgICAvL1xuICAgICAgICAvLyBcIm1hZ2ljUHJvcE5hbWVcIiBpcyB3aGVuIHRoZVxuICAgICAgICAvLyBmdW5jdGlvbiBuYW1lIGJlZ2lucyB3aXRoIFwiJFwiLFxuICAgICAgICAvLyBpLmUuIFwiJGZpbHRlclwiLCBvciBcIiRtYXBcIi4gSWZcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSwgdGhlbiB0aGUgcmV0dXJuXG4gICAgICAgIC8vIHZhbHVlIHdpbGwgYWx3YXlzIGJlIGNvZXJjZWQgaW50b1xuICAgICAgICAvLyBhIFF1ZXJ5RW5naW5lLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICAgICAgLy8gb25seSBiZSBjb2VyY2VkIGludG8gYSBRdWVyeUVuZ2luZVxuICAgICAgICAvLyBpZiBFVkVSWSBlbGVtZW50IGluIHRoZSByZXN1bHQgaXNcbiAgICAgICAgLy8gYW4gXCJlbGVtZW50eVwiIHR5cGUgdmFsdWUuXG4gICAgICAgIGxldCBtYWdpY1Byb3BOYW1lID0gKHByb3BOYW1lLmNoYXJBdCgwKSA9PT0gJyQnKSA/IHByb3BOYW1lLnN1YnN0cmluZygxKSA6IHByb3BOYW1lO1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZVttYWdpY1Byb3BOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IGFycmF5ICAgPSB0YXJnZXQuX215dGhpeFVJRWxlbWVudHM7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ICA9IGFycmF5W21hZ2ljUHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIChtYWdpY1Byb3BOYW1lICE9PSBwcm9wTmFtZSB8fCByZXN1bHQuZXZlcnkoKGl0ZW0pID0+IFV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbiwgTm9kZSwgUXVlcnlFbmdpbmUpKSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0YXJnZXQuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyhyZXN1bHQsIHRhcmdldC5nZXRPcHRpb25zKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm9vdFByb3h5O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlPcHRpb25zO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQ7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGdldFVuZGVybHlpbmdBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcbiAgfVxuXG4gIGdldE93bmVyRG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um9vdCgpLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBmaWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhjb250ZXh0LCBlbGVtZW50cykge1xuICAgIGxldCBmaW5hbEVsZW1lbnRzID0gQXJyYXkuZnJvbShlbGVtZW50cykuZmxhdChJbmZpbml0eSkubWFwKChfaXRlbSkgPT4ge1xuICAgICAgaWYgKCFfaXRlbSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgaXRlbSA9IF9pdGVtO1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0VW5kZXJseWluZ0FycmF5KCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgTm9kZSkpXG4gICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICBpZiAoaXRlbVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICBpdGVtID0gaXRlbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSlcbiAgICAgICAgaXRlbSA9IEVsZW1lbnRzLlRlcm0oaXRlbSk7XG4gICAgICBlbHNlIGlmICghVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoIWNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiY29udGV4dFwiIG9wdGlvbiBmb3IgUXVlcnlFbmdpbmUgaXMgcmVxdWlyZWQgd2hlbiBjb25zdHJ1Y3RpbmcgZWxlbWVudHMuJyk7XG5cbiAgICAgIHJldHVybiBpdGVtLmJ1aWxkKHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpLCBjb250ZXh0KTtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGZpbmFsRWxlbWVudHMpKTtcbiAgfVxuXG4gICQoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHRoaXMuZ2V0T3B0aW9ucygpLCAoVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpID8gYXJnc1thcmdJbmRleCsrXSA6IHt9KTtcblxuICAgIGlmIChvcHRpb25zLmNvbnRleHQgJiYgdHlwZW9mIG9wdGlvbnMuY29udGV4dC4kID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dC4kLmNhbGwob3B0aW9ucy5jb250ZXh0LCBvcHRpb25zLCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gRW5naW5lQ2xhc3MuZnJvbS5jYWxsKG9wdGlvbnMuY29udGV4dCB8fCB0aGlzLCBvcHRpb25zLCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gIH1cblxuICAqZW50cmllcygpIHtcbiAgICBsZXQgZWxlbWVudHMgPSB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgIHlpZWxkKFtpLCBlbGVtZW50XSk7XG4gICAgfVxuICB9XG5cbiAgKmtleXMoKSB7XG4gICAgZm9yIChsZXQgWyBrZXksIF8gXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIGtleTtcbiAgfVxuXG4gICp2YWx1ZXMoKSB7XG4gICAgZm9yIChsZXQgWyBfLCB2YWx1ZSBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQgdmFsdWU7XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHlpZWxkICp0aGlzLnZhbHVlcygpO1xuICB9XG5cbiAgZmlyc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIVV0aWxzLmlzVHlwZShjb3VudCwgJ051bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuJChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbMF0gXSk7XG5cbiAgICByZXR1cm4gdGhpcy4kKHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpKSk7XG4gIH1cblxuICBsYXN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICdOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLiQoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzW3RoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoIC0gMV0gXSk7XG5cbiAgICByZXR1cm4gdGhpcy4kKHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpICogLTEpKTtcbiAgfVxuXG4gIGFkZCguLi5lbGVtZW50cykge1xuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5zbGljZSgpLmNvbmNhdCguLi5lbGVtZW50cyksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIHN1YnRyYWN0KC4uLmVsZW1lbnRzKSB7XG4gICAgbGV0IHNldCA9IG5ldyBTZXQoZWxlbWVudHMpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuICFzZXQuaGFzKGl0ZW0pO1xuICAgIH0pLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFwcGVuZFRvKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gIH1cblxuICBpbnNlcnRJbnRvKHNlbGVjdG9yT3JFbGVtZW50LCByZWZlcmVuY2VOb2RlKSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpO1xuICAgIGxldCBzb3VyY2UgICAgICAgID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxldCBmcmFnbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXG4gICAgICBzb3VyY2UgPSBbIGZyYWdtZW50IF07XG4gICAgfVxuXG4gICAgZWxlbWVudC5pbnNlcnQoc291cmNlWzBdLCByZWZlcmVuY2VOb2RlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVwbGFjZUNoaWxkcmVuT2Yoc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIHdoaWxlIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVG8oZWxlbWVudCk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTGlzdChvcGVyYXRpb24sIC4uLmFyZ3MpIHtcbiAgICBsZXQgY2xhc3NOYW1lcyA9IGNvbGxlY3RDbGFzc05hbWVzKGFyZ3MpO1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jbGFzc0xpc3QpIHtcbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJ3RvZ2dsZScpXG4gICAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IG5vZGUuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5vZGUuY2xhc3NMaXN0W29wZXJhdGlvbl0oLi4uY2xhc3NOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdhZGQnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3JlbW92ZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgdG9nZ2xlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgndG9nZ2xlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICBzbG90dGVkKHllc05vKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHllc05vKSA/IGlzU2xvdHRlZCA6IGlzTm90U2xvdHRlZCk7XG4gIH1cblxuICBzbG90KHNsb3ROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChlbGVtZW50KSA9PiAoZWxlbWVudCAmJiBlbGVtZW50LnNsb3QgPT09IHNsb3ROYW1lKSk7XG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLlF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBTSEEyNTYoX2lucHV0KSB7XG4gIGxldCBpbnB1dCA9IF9pbnB1dDtcblxuICBsZXQgbWF0aFBvdyA9IE1hdGgucG93O1xuICBsZXQgbWF4V29yZCA9IG1hdGhQb3coMiwgMzIpO1xuICBsZXQgbGVuZ3RoUHJvcGVydHkgPSAnbGVuZ3RoJztcbiAgbGV0IGk7IGxldCBqOyAvLyBVc2VkIGFzIGEgY291bnRlciBhY3Jvc3MgdGhlIHdob2xlIGZpbGVcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIGxldCB3b3JkcyA9IFtdO1xuICBsZXQgYXNjaWlCaXRMZW5ndGggPSBpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gKiA4O1xuXG4gIC8vKiBjYWNoaW5nIHJlc3VsdHMgaXMgb3B0aW9uYWwgLSByZW1vdmUvYWRkIHNsYXNoIGZyb20gZnJvbnQgb2YgdGhpcyBsaW5lIHRvIHRvZ2dsZVxuICAvLyBJbml0aWFsIGhhc2ggdmFsdWU6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgZmlyc3QgOCBwcmltZXNcbiAgLy8gKHdlIGFjdHVhbGx5IGNhbGN1bGF0ZSB0aGUgZmlyc3QgNjQsIGJ1dCBleHRyYSB2YWx1ZXMgYXJlIGp1c3QgaWdub3JlZClcbiAgbGV0IGhhc2ggPSBTSEEyNTYuaCA9IFNIQTI1Ni5oIHx8IFtdO1xuICAvLyBSb3VuZCBjb25zdGFudHM6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDY0IHByaW1lc1xuICBsZXQgayA9IFNIQTI1Ni5rID0gU0hBMjU2LmsgfHwgW107XG4gIGxldCBwcmltZUNvdW50ZXIgPSBrW2xlbmd0aFByb3BlcnR5XTtcbiAgLyovXG4gICAgbGV0IGhhc2ggPSBbXSwgayA9IFtdO1xuICAgIGxldCBwcmltZUNvdW50ZXIgPSAwO1xuICAgIC8vKi9cblxuICBsZXQgaXNDb21wb3NpdGUgPSB7fTtcbiAgZm9yIChsZXQgY2FuZGlkYXRlID0gMjsgcHJpbWVDb3VudGVyIDwgNjQ7IGNhbmRpZGF0ZSsrKSB7XG4gICAgaWYgKCFpc0NvbXBvc2l0ZVtjYW5kaWRhdGVdKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMzEzOyBpICs9IGNhbmRpZGF0ZSlcbiAgICAgICAgaXNDb21wb3NpdGVbaV0gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGhhc2hbcHJpbWVDb3VudGVyXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMC41KSAqIG1heFdvcmQpIHwgMDtcbiAgICAgIGtbcHJpbWVDb3VudGVyKytdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAxIC8gMykgKiBtYXhXb3JkKSB8IDA7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQgKz0gJ1xceDgwJzsgLy8gQXBwZW5kIMaHJyBiaXQgKHBsdXMgemVybyBwYWRkaW5nKVxuICB3aGlsZSAoaW5wdXRbbGVuZ3RoUHJvcGVydHldICUgNjQgLSA1NilcbiAgICBpbnB1dCArPSAnXFx4MDAnOyAvLyBNb3JlIHplcm8gcGFkZGluZ1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbnB1dFtsZW5ndGhQcm9wZXJ0eV07IGkrKykge1xuICAgIGogPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChqID4+IDgpXG4gICAgICByZXR1cm47IC8vIEFTQ0lJIGNoZWNrOiBvbmx5IGFjY2VwdCBjaGFyYWN0ZXJzIGluIHJhbmdlIDAtMjU1XG4gICAgd29yZHNbaSA+PiAyXSB8PSBqIDw8ICgoMyAtIGkpICUgNCkgKiA4O1xuICB9XG5cbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9ICgoYXNjaWlCaXRMZW5ndGggLyBtYXhXb3JkKSB8IDApO1xuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKGFzY2lpQml0TGVuZ3RoKTtcblxuICAvLyBwcm9jZXNzIGVhY2ggY2h1bmtcbiAgZm9yIChqID0gMDsgaiA8IHdvcmRzW2xlbmd0aFByb3BlcnR5XTspIHtcbiAgICBsZXQgdyA9IHdvcmRzLnNsaWNlKGosIGogKz0gMTYpOyAvLyBUaGUgbWVzc2FnZSBpcyBleHBhbmRlZCBpbnRvIDY0IHdvcmRzIGFzIHBhcnQgb2YgdGhlIGl0ZXJhdGlvblxuICAgIGxldCBvbGRIYXNoID0gaGFzaDtcblxuICAgIC8vIFRoaXMgaXMgbm93IHRoZSB1bmRlZmluZWR3b3JraW5nIGhhc2hcIiwgb2Z0ZW4gbGFiZWxsZWQgYXMgdmFyaWFibGVzIGEuLi5nXG4gICAgLy8gKHdlIGhhdmUgdG8gdHJ1bmNhdGUgYXMgd2VsbCwgb3RoZXJ3aXNlIGV4dHJhIGVudHJpZXMgYXQgdGhlIGVuZCBhY2N1bXVsYXRlXG4gICAgaGFzaCA9IGhhc2guc2xpY2UoMCwgOCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIGludG8gNjQgd29yZHNcbiAgICAgIC8vIFVzZWQgYmVsb3cgaWZcbiAgICAgIGxldCB3MTUgPSB3W2kgLSAxNV07IGxldCB3MiA9IHdbaSAtIDJdO1xuXG4gICAgICAvLyBJdGVyYXRlXG4gICAgICBsZXQgYSA9IGhhc2hbMF07IGxldCBlID0gaGFzaFs0XTtcbiAgICAgIGxldCB0ZW1wMSA9IGhhc2hbN11cbiAgICAgICAgICAgICAgICArICgoKGUgPj4+IDYpIHwgKGUgPDwgMjYpKSBeICgoZSA+Pj4gMTEpIHwgKGUgPDwgMjEpKSBeICgoZSA+Pj4gMjUpIHwgKGUgPDwgNykpKSAvLyBTMVxuICAgICAgICAgICAgICAgICsgKChlICYgaGFzaFs1XSkgXiAoKH5lKSAmIGhhc2hbNl0pKSAvLyBjaFxuICAgICAgICAgICAgICAgICsga1tpXVxuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICArICh3W2ldID0gKGkgPCAxNikgPyB3W2ldIDogKFxuICAgICAgICAgICAgICAgICAgd1tpIC0gMTZdXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcxNSA+Pj4gNykgfCAodzE1IDw8IDI1KSkgXiAoKHcxNSA+Pj4gMTgpIHwgKHcxNSA8PCAxNCkpIF4gKHcxNSA+Pj4gMykpIC8vIHMwXG4gICAgICAgICAgICAgICAgICAgICAgICArIHdbaSAtIDddXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcyID4+PiAxNykgfCAodzIgPDwgMTUpKSBeICgodzIgPj4+IDE5KSB8ICh3MiA8PCAxMykpIF4gKHcyID4+PiAxMCkpIC8vIHMxXG4gICAgICAgICAgICAgICAgKSB8IDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgLy8gVGhpcyBpcyBvbmx5IHVzZWQgb25jZSwgc28gKmNvdWxkKiBiZSBtb3ZlZCBiZWxvdywgYnV0IGl0IG9ubHkgc2F2ZXMgNCBieXRlcyBhbmQgbWFrZXMgdGhpbmdzIHVucmVhZGJsZVxuICAgICAgbGV0IHRlbXAyID0gKCgoYSA+Pj4gMikgfCAoYSA8PCAzMCkpIF4gKChhID4+PiAxMykgfCAoYSA8PCAxOSkpIF4gKChhID4+PiAyMikgfCAoYSA8PCAxMCkpKSAvLyBTMFxuICAgICAgICAgICAgICAgICsgKChhICYgaGFzaFsxXSkgXiAoYSAmIGhhc2hbMl0pIF4gKGhhc2hbMV0gJiBoYXNoWzJdKSk7IC8vIG1halxuXG4gICAgICBoYXNoID0gWyh0ZW1wMSArIHRlbXAyKSB8IDBdLmNvbmNhdChoYXNoKTsgLy8gV2UgZG9uJ3QgYm90aGVyIHRyaW1taW5nIG9mZiB0aGUgZXh0cmEgb25lcywgdGhleSdyZSBoYXJtbGVzcyBhcyBsb25nIGFzIHdlJ3JlIHRydW5jYXRpbmcgd2hlbiB3ZSBkbyB0aGUgc2xpY2UoKVxuICAgICAgaGFzaFs0XSA9IChoYXNoWzRdICsgdGVtcDEpIHwgMDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKVxuICAgICAgaGFzaFtpXSA9IChoYXNoW2ldICsgb2xkSGFzaFtpXSkgfCAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIGZvciAoaiA9IDM7IGogKyAxOyBqLS0pIHtcbiAgICAgIGxldCBiID0gKGhhc2hbaV0gPj4gKGogKiA4KSkgJiAyNTU7XG4gICAgICByZXN1bHQgKz0gKChiIDwgMTYpID8gMCA6ICcnKSArIGIudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5sZXQgaWRDb3VudGVyID0gMG47XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcbiAgaWRDb3VudGVyICs9IEJpZ0ludCgxKTtcbiAgcmV0dXJuIGAke0RhdGUubm93KCl9JHtwYWQoaWRDb3VudGVyLnRvU3RyaW5nKCksIElEX0NPVU5UX0xFTkdUSCl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc29sdmFibGUoKSB7XG4gIGxldCBzdGF0dXMgPSAncGVuZGluZyc7XG4gIGxldCByZXNvbHZlO1xuICBsZXQgcmVqZWN0O1xuXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdmdWxmaWxsZWQnO1xuICAgICAgICBfcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICByZWplY3QgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAncmVqZWN0ZWQnO1xuICAgICAgICBfcmVqZWN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvbWlzZSwge1xuICAgICdyZXNvbHZlJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZXNvbHZlLFxuICAgIH0sXG4gICAgJ3JlamVjdCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVqZWN0LFxuICAgIH0sXG4gICAgJ3N0YXR1cyc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKCkgPT4gc3RhdHVzLFxuICAgIH0sXG4gICAgJ2lkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICBnZW5lcmF0ZUlEKCksXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBsZXQgdGhpc1R5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0aGlzVHlwZSA9PT0gJ2JpZ2ludCcpXG4gICAgcmV0dXJuICdCaWdJbnQnO1xuXG4gIGlmICh0aGlzVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodGhpc1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodmFsdWUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7bmF0aXZlVHlwZU1ldGFbMF19XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBJU19DTEFTUy50ZXN0KCcnICsgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yKSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHt2YWx1ZS5uYW1lfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcbiAgICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgICByZXR1cm4gYFtDbGFzcyAke3Jlc3VsdH1dYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYCR7dGhpc1R5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt0aGlzVHlwZS5zdWJzdHJpbmcoMSl9YDtcbiAgfVxuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICByZXR1cm4gJ1N0cmluZyc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKVxuICAgIHJldHVybiAnQm9vbGVhbic7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgIHJldHVybiAnT2JqZWN0JztcblxuICBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcblxuICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fCAnT2JqZWN0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGlmICh0eXBlcy5pbmRleE9mKHZhbHVlVHlwZSkgPj0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gdHlwZXMuc29tZSgodHlwZSkgPT4gKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nICYmIHZhbHVlIGluc3RhbmNlb2YgdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE51bWJlcih2YWx1ZSkge1xuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJ051bWJlcicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgJ051bWJlcicsICdCb29sZWFuJywgJ0JpZ0ludCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xsZWN0YWJsZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKEluZmluaXR5KSB8fCBPYmplY3QuaXMoLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50JykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykgJiYgKC9eW1xcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnTnVtYmVyJykpXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDApO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIU5PRSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL15cXFcvLCAnJylcbiAgICAucmVwbGFjZSgvW1xcV10rJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oW0EtWl0rKS9nLCAnLSQxJylcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXFcrKC4pL2csIChtLCBwKSA9PiB7XG4gICAgICByZXR1cm4gcC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL14oLikoLiopJC8sIChtLCBmLCBsKSA9PiBgJHtmLnRvTG93ZXJDYXNlKCl9JHtsfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXSsvZywgKG0sIG9mZnNldCkgPT4gKChvZmZzZXQpID8gYC0ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKSlcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRNZXRob2RzKF9wcm90bywgc2tpcFByb3Rvcykge1xuICBsZXQgcHJvdG8gICAgICAgICAgID0gX3Byb3RvO1xuICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChwcm90bykge1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKTtcbiAgICBsZXQga2V5cyAgICAgICAgPSBPYmplY3Qua2V5cyhkZXNjcmlwdG9ycykuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZGVzY3JpcHRvcnMpKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyhrZXkpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKGtleSk7XG5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gZGVzY3JpcHRvcnNba2V5XTtcblxuICAgICAgLy8gQ2FuIGl0IGJlIGNoYW5nZWQ/XG4gICAgICBpZiAoZGVzY3JpcHRvci5jb25maWd1cmFibGUgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gSWYgaXMgZ2V0dGVyLCB0aGVuIHNraXBcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ2dldCcpIHx8IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnc2V0JykpIHtcbiAgICAgICAgbGV0IG5ld0Rlc2NyaXB0b3IgPSB7IC4uLmRlc2NyaXB0b3IgfTtcbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3IuZ2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IuZ2V0ID0gbmV3RGVzY3JpcHRvci5nZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5zZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5zZXQgPSBuZXdEZXNjcmlwdG9yLnNldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcblxuICAgICAgLy8gU2tpcCBwcm90b3R5cGUgb2YgT2JqZWN0XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIE9iamVjdC5wcm90b3R5cGVba2V5XSA9PT0gdmFsdWUpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAuLi5kZXNjcmlwdG9yLCB2YWx1ZTogdmFsdWUuYmluZCh0aGlzKSB9KTtcbiAgICB9XG5cbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgYnJlYWs7XG5cbiAgICBpZiAoc2tpcFByb3RvcyAmJiBza2lwUHJvdG9zLmluZGV4T2YocHJvdG8pID49IDApXG4gICAgICBicmVhaztcbiAgfVxufVxuXG5jb25zdCBNRVRBREFUQV9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ldGFkYXRhKHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICBpZiAoIWlzQ29sbGVjdGFibGUodGFyZ2V0KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBzZXQgbWV0YWRhdGEgb24gcHJvdmlkZWQgb2JqZWN0OiAkeyh0eXBlb2YgdGFyZ2V0ID09PSAnc3ltYm9sJykgPyB0YXJnZXQudG9TdHJpbmcoKSA6IHRhcmdldH1gKTtcblxuICBsZXQgZGF0YSA9IE1FVEFEQVRBX1dFQUtNQVAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGF0YSkge1xuICAgIGRhdGEgPSBuZXcgTWFwKCk7XG4gICAgTUVUQURBVEFfV0VBS01BUC5zZXQodGFyZ2V0LCBkYXRhKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKVxuICAgIHJldHVybiBkYXRhO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKVxuICAgIHJldHVybiBkYXRhLmdldChrZXkpO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuY29uc3QgT0JKX0lEX1dFQUtNQVAgPSBuZXcgV2Vha01hcCgpO1xubGV0IGlkQ291bnQgPSAxbjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9iaklEKG9iaikge1xuICBsZXQgaWQgPSBPQkpfSURfV0VBS01BUC5nZXQob2JqKTtcbiAgaWYgKGlkID09IG51bGwpIHtcbiAgICBsZXQgdGhpc0lEID0gYCR7aWRDb3VudCsrfWA7XG4gICAgT0JKX0lEX1dFQUtNQVAuc2V0KG9iaiwgdGhpc0lEKTtcblxuICAgIHJldHVybiB0aGlzSUQ7XG4gIH1cblxuICByZXR1cm4gaWQ7XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUEVSVFlfR0NfVElNRSA9IDEwMDAwO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3BlcnR5IHtcbiAgY29uc3RydWN0b3IoZ2V0dGVyLCBzZXR0ZXIpIHtcbiAgICBpZiAodHlwZW9mIGdldHRlciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZ2V0dGVyXCIgKGZpcnN0KSBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICAgIGlmICh0eXBlb2Ygc2V0dGVyICE9PSAnZnVuY3Rpb24nKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzZXR0ZXJcIiAoc2Vjb25kKSBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd2YWx1ZSc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgIGdldHRlcixcbiAgICAgICAgc2V0OiAgICAgICAgICBzZXR0ZXIsXG4gICAgICB9LFxuICAgICAgJ3JlZ2lzdGVyZWROb2Rlcyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgW10sXG4gICAgICB9LFxuICAgICAgJ2NsZWFuTWVtb3J5VGltZXInOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG51bGwsXG4gICAgICB9LFxuICAgICAgJ2lzU2V0dGluZyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS50b1N0cmluZygpIDogKCcnICsgdmFsdWUpO1xuICB9XG5cbiAgZnJlZURlYWRSZWZlcmVuY2VzKCkge1xuICAgIC8vIGNsZWFyIGRlYWQgbm9kZXNcbiAgICB0aGlzLnJlZ2lzdGVyZWROb2RlcyA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmZpbHRlcigoZW50cnkpID0+ICEhZW50cnkucmVmLmRlcmVmKCkpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xlYW5NZW1vcnlUaW1lcik7XG4gICAgdGhpcy5jbGVhbk1lbW9yeVRpbWVyID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnJlZ2lzdGVyZWROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGxldCByYW5kb21uZXNzID0gKE1hdGgucmFuZG9tKCkgKiBEWU5BTUlDX1BST1BFUlRZX0dDX1RJTUUpO1xuICAgICAgdGhpcy5jbGVhbk1lbW9yeVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmZyZWVEZWFkUmVmZXJlbmNlcygpLCBNYXRoLnJvdW5kKERZTkFNSUNfUFJPUEVSVFlfR0NfVElNRSArIHJhbmRvbW5lc3MpKTtcbiAgICB9XG4gIH1cblxuICBzZXQobmV3VmFsdWUpIHtcbiAgICBpZiAodGhpcy5pc1NldHRpbmcpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gbmV3VmFsdWUpXG4gICAgICByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5pc1NldHRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc1NldHRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnRyaWdnZXJVcGRhdGVzKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSkpLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyVXBkYXRlcygpKTtcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyVXBkYXRlcygpIHtcbiAgICBmb3IgKGxldCB7IHJlZiwgY2FsbGJhY2sgfSBvZiB0aGlzLnJlZ2lzdGVyZWROb2Rlcykge1xuICAgICAgbGV0IG5vZGUgPSByZWYuZGVyZWYoKTtcbiAgICAgIGlmICghbm9kZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBuZXdWYWx1ZSA9IGNhbGxiYWNrKCk7XG4gICAgICBub2RlLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRm9yVXBkYXRlKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgbGV0IGV4aXN0cyA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmZpbmQoKGVudHJ5KSA9PiAoZW50cnkucmVmLmRlcmVmKCkgPT09IG5vZGUpKTtcbiAgICBpZiAoZXhpc3RzKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHJlZiA9IG5ldyBXZWFrUmVmKG5vZGUpO1xuICAgIHRoaXMucmVnaXN0ZXJlZE5vZGVzLnB1c2goeyByZWYsIGNhbGxiYWNrIH0pO1xuXG4gICAgdGhpcy5mcmVlRGVhZFJlZmVyZW5jZXMoKTtcbiAgfVxufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuY29uc3QgVkFMSURfSlNfSURFTlRJRklFUiAgICAgICAgID0gL15bYS16QS1aXyRdW2EtekEtWjAtOV8kXSokLztcblxuZnVuY3Rpb24gZ2V0Q29udGV4dENhbGxBcmdzKGNvbnRleHQpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldEFsbFByb3BlcnR5TmFtZXMoY29udGV4dCkuZmlsdGVyKChuYW1lKSA9PiBWQUxJRF9KU19JREVOVElGSUVSLnRlc3QobmFtZSkpO1xuICBjb250ZXh0Q2FsbEFyZ3MgPSBBcnJheS5mcm9tKG5ldyBTZXQoY29udGV4dENhbGxBcmdzLmNvbmNhdChbICdhdHRyaWJ1dGVzJywgJ2NsYXNzTGlzdCcgXSkpKTtcblxuICByZXR1cm4gYHske2NvbnRleHRDYWxsQXJncy5maWx0ZXIoKG5hbWUpID0+ICEoL14oaTE4bnxcXCRcXCQpJC8pLnRlc3QobmFtZSkpLmpvaW4oJywnKX19YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb3h5Q29udGV4dChwYXJlbnRFbGVtZW50LCBjb250ZXh0KSB7XG4gIHJldHVybiBuZXcgUHJveHkoY29udGV4dCwge1xuICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoIXBhcmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgY29uc3QgZ2V0UGFyZW50Tm9kZSA9IChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghZWxlbWVudClcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgICAgICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlTaGFkb3dQYXJlbnQnKTtcblxuICAgICAgICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZmluZFBhcmVudENvbnRleHQgPSAocGFyZW50RWxlbWVudCkgPT4ge1xuICAgICAgICBsZXQgY3VycmVudFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGlmICghcGFyZW50RWxlbWVudClcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0ID0gY3VycmVudFBhcmVudC5wdWJsaXNoQ29udGV4dDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnQgJiYgdHlwZW9mKGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0ID0gY3VycmVudFBhcmVudC5wdWJsaXNoQ29udGV4dCkgIT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudFBhcmVudCk7XG5cbiAgICAgICAgaWYgKCFjb21wb25lbnRQdWJsaXNoQ29udGV4dClcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IHB1Ymxpc2hlZENvbnRleHQgPSBjb21wb25lbnRQdWJsaXNoQ29udGV4dC5jYWxsKGN1cnJlbnRQYXJlbnQpO1xuICAgICAgICBpZiAoIShwcm9wTmFtZSBpbiBwdWJsaXNoZWRDb250ZXh0KSAmJiBjdXJyZW50UGFyZW50KVxuICAgICAgICAgIHJldHVybiBmaW5kUGFyZW50Q29udGV4dChnZXRQYXJlbnROb2RlKGN1cnJlbnRQYXJlbnQpKTtcblxuICAgICAgICByZXR1cm4gcHVibGlzaGVkQ29udGV4dDtcbiAgICAgIH07XG5cbiAgICAgIGxldCBwYXJlbnRDb250ZXh0ID0gZmluZFBhcmVudENvbnRleHQocGFyZW50RWxlbWVudCk7XG4gICAgICByZXR1cm4gKHBhcmVudENvbnRleHQpID8gcGFyZW50Q29udGV4dFtwcm9wTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEeW5hbWljUHJvcGVydHlGZXRjaGVyKGNvbnRleHQsIF9mdW5jdGlvbkJvZHksIF9jb250ZXh0Q2FsbEFyZ3MpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IChfY29udGV4dENhbGxBcmdzKSA/IF9jb250ZXh0Q2FsbEFyZ3MgOiBnZXRDb250ZXh0Q2FsbEFyZ3MoY29udGV4dCwgKGNvbnRleHQgaW5zdGFuY2VvZiBOb2RlKSk7XG4gIGxldCBmdW5jdGlvbkJvZHkgICAgPSBgbGV0IEM9YXJndW1lbnRzWzNdLCQkPSgoQy4kJCk/Qy4kJDpjcmVhdGVQcm94eUNvbnRleHQoQywgeyBjb250ZXh0OiBDLCAkJDogQyB9KSksaTE4bj0kJC5pMThufHwoKHBhdGgsZCk9PmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbChzcGVjaWFsQ2xvc2VzdChDLCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKXx8QyxcXGBnbG9iYWwuaTE4bi5cXCR7cGF0aH1cXGAsZCkpO2lmKCQkLmkxOG49PW51bGwpJCQuaTE4bj1pMThuO3JldHVybiAke19mdW5jdGlvbkJvZHkucmVwbGFjZSgvXlxccypyZXR1cm5cXHMrLywgJycpLnRyaW0oKX07YDtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oJ2dldER5bmFtaWNQcm9wZXJ0eUZvclBhdGgnLCAnc3BlY2lhbENsb3Nlc3QnLCAnY3JlYXRlUHJveHlDb250ZXh0JywgY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKGNvbnRleHQsIGdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGgsIHNwZWNpYWxDbG9zZXN0LCBjcmVhdGVQcm94eUNvbnRleHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGVybShjb250ZXh0LCBfdGV4dCkge1xuICBsZXQgdGV4dCA9IF90ZXh0O1xuICBsZXQgbm9kZTtcblxuICBpZiAodGV4dCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICBub2RlID0gdGV4dDtcbiAgICBpZiAoRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTLmluZGV4T2Yobm9kZS5ub2RlVHlwZSkgPCAwKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJmb3JtYXRUZXJtXCIgdW5zdXBwb3J0ZWQgbm9kZSB0eXBlIHByb3ZpZGVkLiBPbmx5IFRFWFRfTk9ERSBhbmQgQVRUUklCVVRFX05PREUgdHlwZXMgYXJlIHN1cHBvcnRlZC4nKTtcblxuICAgIHRleHQgPSBub2RlLm5vZGVWYWx1ZTtcbiAgfVxuXG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBnZXRDb250ZXh0Q2FsbEFyZ3MoY29udGV4dCk7XG4gIGxldCByZXN1bHQgICAgICAgICAgPSB0ZXh0LnJlcGxhY2UoLyg/Ol5AQHwoW15cXFxcXSlAQCkoLis/KUBAL2csIChtLCBzdGFydCwgbWFjcm8pID0+IHtcbiAgICBjb25zdCBmZXRjaGVyID0gY3JlYXRlRHluYW1pY1Byb3BlcnR5RmV0Y2hlcihjb250ZXh0LCBtYWNybywgY29udGV4dENhbGxBcmdzKTtcbiAgICBsZXQgdmFsdWUgPSBmZXRjaGVyKGNvbnRleHQpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdmFsdWUgPSAnJztcblxuICAgIGlmIChub2RlICYmIHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1Byb3BlcnR5KSB7XG4gICAgICB2YWx1ZS5yZWdpc3RlckZvclVwZGF0ZShub2RlLCAoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmb3JtYXRUZXJtKGNvbnRleHQsIHRleHQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke3N0YXJ0IHx8ICcnfSR7dmFsdWV9YDtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY29uc3QgSEFTX0RZTkFNSUNfQklORElORyA9IC9eQEB8W15cXFxcXUBALztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZSh2YWx1ZSkge1xuICBpZiAoIWlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gSEFTX0RZTkFNSUNfQklORElORy50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRSA9IC9eW1xcdy4kXSskLztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFdmVudENhbGxiYWNrKF9mdW5jdGlvbkJvZHkpIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IF9mdW5jdGlvbkJvZHk7XG4gIGlmIChFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSlcbiAgICBmdW5jdGlvbkJvZHkgPSBgdGhpcy4ke2Z1bmN0aW9uQm9keX0oZXZlbnQpYDtcblxuICByZXR1cm4gKG5ldyBGdW5jdGlvbignZXZlbnQnLCBgbGV0IGU9ZXZlbnQsZXY9ZXZlbnQsZXZ0PWV2ZW50O3JldHVybiAke2Z1bmN0aW9uQm9keS5yZXBsYWNlKC9eXFxzKnJldHVyblxccyovLCAnJykudHJpbSgpfTtgKSkuYmluZCh0aGlzKTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGxldCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gIGlmIChFVkVOVF9OQU1FX0NBQ0hFW3RhZ05hbWVdKVxuICAgIHJldHVybiBFVkVOVF9OQU1FX0NBQ0hFW3RhZ05hbWVdO1xuXG4gIGxldCBldmVudE5hbWVzID0gW107XG5cbiAgZm9yIChsZXQga2V5IGluIGVsZW1lbnQpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDIgJiYgSVNfRVZFTlRfTkFNRS50ZXN0KGtleSkpXG4gICAgICBldmVudE5hbWVzLnB1c2goa2V5LnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgRVZFTlRfTkFNRV9DQUNIRVt0YWdOYW1lXSA9IGV2ZW50TmFtZXM7XG5cbiAgcmV0dXJuIGV2ZW50TmFtZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRUb0VsZW1lbnQoY29udGV4dCwgZWxlbWVudCwgZXZlbnROYW1lLCBfY2FsbGJhY2spIHtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IGNhbGxiYWNrO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KF9jYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayAgPSBfY2FsbGJhY2suY2FsbGJhY2s7XG4gICAgb3B0aW9ucyAgID0gX2NhbGxiYWNrLm9wdGlvbnMgfHwge307XG4gIH0gZWxzZSBpZiAodHlwZW9mIF9jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9XG5cbiAgaWYgKGlzVHlwZShjYWxsYmFjaywgJ1N0cmluZycpKVxuICAgIGNhbGxiYWNrID0gY3JlYXRlRXZlbnRDYWxsYmFjay5jYWxsKGNvbnRleHQsIGNhbGxiYWNrKTtcblxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHsgY2FsbGJhY2ssIG9wdGlvbnMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUGF0aChvYmosIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmIChvYmogPT0gbnVsbCB8fCBPYmplY3QuaXMob2JqLCBOYU4pIHx8IE9iamVjdC5pcyhvYmosIEluZmluaXR5KSB8fCBPYmplY3QuaXMob2JqLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgaWYgKGtleSA9PSBudWxsIHx8IE9iamVjdC5pcyhrZXksIE5hTikgfHwgT2JqZWN0LmlzKGtleSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhrZXksIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBsZXQgcGFydHMgICAgICAgICA9IGtleS5zcGxpdCgvXFwuL2cpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGN1cnJlbnRWYWx1ZSAgPSBvYmo7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gcGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XG4gICAgbGV0IG5leHRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwYXJ0XTtcbiAgICBpZiAobmV4dFZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY3VycmVudFZhbHVlID0gbmV4dFZhbHVlO1xuICB9XG5cbiAgaWYgKGdsb2JhbFRoaXMuTm9kZSAmJiBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlIGluc3RhbmNlb2YgZ2xvYmFsVGhpcy5Ob2RlICYmIChjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkpXG4gICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5ub2RlVmFsdWU7XG5cbiAgcmV0dXJuIChjdXJyZW50VmFsdWUgPT0gbnVsbCkgPyBkZWZhdWx0VmFsdWUgOiBjdXJyZW50VmFsdWU7XG59XG5cbmNvbnN0IElTX05VTUJFUiA9IC9eKFstK10/KShcXGQqKD86XFwuXFxkKyk/KShlWy0rXVxcZCspPyQvO1xuY29uc3QgSVNfQk9PTEVBTiA9IC9eKHRydWV8ZmFsc2UpJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ05hTicpXG4gICAgcmV0dXJuIE5hTjtcblxuICBpZiAodmFsdWUgPT09ICdJbmZpbml0eScgfHwgdmFsdWUgPT09ICcrSW5maW5pdHknKVxuICAgIHJldHVybiBJbmZpbml0eTtcblxuICBpZiAodmFsdWUgPT09ICctSW5maW5pdHknKVxuICAgIHJldHVybiAtSW5maW5pdHk7XG5cbiAgaWYgKElTX05VTUJFUi50ZXN0KHZhbHVlKSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG5cbiAgaWYgKElTX0JPT0xFQU4udGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gJ3RydWUnKTtcblxuICByZXR1cm4gKCcnICsgdmFsdWUpO1xufVxuXG5jb25zdCBDQUNIRURfUFJPUEVSVFlfTkFNRVMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgU0tJUF9QUk9UT1RZUEVTICAgICAgID0gW1xuICBnbG9iYWxUaGlzLkhUTUxFbGVtZW50LFxuICBnbG9iYWxUaGlzLk5vZGUsXG4gIGdsb2JhbFRoaXMuRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5PYmplY3QsXG4gIGdsb2JhbFRoaXMuQXJyYXksXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvcGVydHlOYW1lcyhfb2JqKSB7XG4gIGlmICghaXNDb2xsZWN0YWJsZShfb2JqKSlcbiAgICByZXR1cm4gW107XG5cbiAgbGV0IGNhY2hlZE5hbWVzID0gQ0FDSEVEX1BST1BFUlRZX05BTUVTLmdldChfb2JqKTtcbiAgaWYgKGNhY2hlZE5hbWVzKVxuICAgIHJldHVybiBjYWNoZWROYW1lcztcblxuICBsZXQgb2JqICAgPSBfb2JqO1xuICBsZXQgbmFtZXMgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKG9iaikge1xuICAgIGxldCBvYmpOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gb2JqTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgIG5hbWVzLmFkZChvYmpOYW1lc1tpXSk7XG5cbiAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAob2JqICYmIFNLSVBfUFJPVE9UWVBFUy5pbmRleE9mKG9iai5jb25zdHJ1Y3RvcikgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgbGV0IGZpbmFsTmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKTtcbiAgQ0FDSEVEX1BST1BFUlRZX05BTUVTLnNldChfb2JqLCBmaW5hbE5hbWVzKTtcblxuICByZXR1cm4gZmluYWxOYW1lcztcbn1cblxuY29uc3QgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREeW5hbWljUHJvcGVydHlGb3JQYXRoKGtleVBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICBsZXQgaW5zdGFuY2VDYWNoZSA9IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5nZXQodGhpcyk7XG4gIGlmICghaW5zdGFuY2VDYWNoZSkge1xuICAgIGluc3RhbmNlQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLnNldCh0aGlzLCBpbnN0YW5jZUNhY2hlKTtcbiAgfVxuXG4gIGxldCBwcm9wZXJ0eSA9IGluc3RhbmNlQ2FjaGUuZ2V0KGtleVBhdGgpO1xuICBpZiAoIXByb3BlcnR5KSB7XG4gICAgbGV0IHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuXG4gICAgcHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCgpID0+IHZhbHVlLCAobmV3VmFsdWUpID0+IHtcbiAgICAgIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgfSk7XG5cbiAgICBpbnN0YW5jZUNhY2hlLnNldChrZXlQYXRoLCBwcm9wZXJ0eSk7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGVjaWFsQ2xvc2VzdChub2RlLCBzZWxlY3Rvcikge1xuICBpZiAoIW5vZGUgfHwgIXNlbGVjdG9yKVxuICAgIHJldHVybjtcblxuICBpZiAodHlwZW9mIG5vZGUubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm47XG5cbiAgY29uc3QgZ2V0UGFyZW50Tm9kZSA9IChlbGVtZW50KSA9PiB7XG4gICAgaWYgKCFlbGVtZW50KVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgICByZXR1cm4gbWV0YWRhdGEoZWxlbWVudCwgJ19teXRoaXhVSVNoYWRvd1BhcmVudCcpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgfTtcblxuICBsZXQgY3VycmVudE5vZGUgPSBub2RlO1xuICBsZXQgcmVzdWx0O1xuXG4gIHdoaWxlIChjdXJyZW50Tm9kZSAmJiAhKHJlc3VsdCA9IGN1cnJlbnROb2RlLm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoY3VycmVudE5vZGUpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGVlcChtcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zIHx8IDApO1xuICB9KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcblxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5leHBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9jb21wb25lbnQuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1yZXF1aXJlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXNwaW5uZXIuanMnO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLlV0aWxzID0gVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkNvbXBvbmVudHMgPSBDb21wb25lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5FbGVtZW50cyA9IEVsZW1lbnRzO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBlbGVtZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbXl0aGl4LXNyY10nKSk7XG4gICAgQ29tcG9uZW50cy52aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgZGlzY29ubmVjdCwgZWxlbWVudCwgd2FzVmlzaWJsZSB9KSA9PiB7XG4gICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpO1xuICAgICAgaWYgKCFzcmMpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICBDb21wb25lbnRzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpO1xuICAgIH0sIHsgZWxlbWVudHMgfSk7XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgICAnJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoLi4uYXJncyksXG4gICAgfSxcbiAgICAnJCQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogICAgICAgICguLi5hcmdzKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKC4uLmFyZ3MpLFxuICAgIH0sXG4gIH0pO1xuXG4gIGxldCBkb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxUaGlzLm15dGhpeFVJLmRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBtdXRhdGlvbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG11dGF0aW9uLnRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlO1xuICAgICAgICBsZXQgb2xkVmFsdWUgICAgICA9IG11dGF0aW9uLm9sZFZhbHVlO1xuXG4gICAgICAgIGlmIChvbGRWYWx1ZSA9PT0gbmV3VmFsdWUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlICYmIFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShuZXdWYWx1ZSkpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKG11dGF0aW9uLnRhcmdldCwgYXR0cmlidXRlTm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGxldCBhZGRlZE5vZGVzID0gbXV0YXRpb24uYWRkZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gYWRkZWROb2Rlcy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgbGV0IG5vZGUgPSBhZGRlZE5vZGVzW2pdO1xuICAgICAgICAgIENvbXBvbmVudHMucmVjdXJzaXZlbHlCaW5kRHluYW1pY0RhdGEobXV0YXRpb24udGFyZ2V0LCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBzdWJ0cmVlOiAgICAgICAgICAgIHRydWUsXG4gICAgY2hpbGRMaXN0OiAgICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6ICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogIHRydWUsXG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9