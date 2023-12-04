/******/ var __webpack_modules__ = ({

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   createProxyContext: () => (/* binding */ createProxyContext),
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




// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms || 0);
//   });
// }

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

class MythixUIComponent extends HTMLElement {
  static compileStyleForDocument = compileStyleForDocument;
  static register = function(_name, Klass) {
    let name = _name || this.tagName;
    if (!customElements.get(name))
      customElements.define(name, Klass || this);

    return this;
  };

  static observedAttributes = [ 'src' ];

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

  formatTemplateNodes(node) {
    if (!node)
      return node;

    for (let childNode of Array.from(node.childNodes)) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        childNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTerm(this, childNode);
      } else if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType >= Node.DOCUMENT_NODE) {
        childNode = this.formatTemplateNodes(childNode);

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
        this.fetchSrc();

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
    if (args[0] === 'src')
      this.awaitFetchSrcOnVisible(args[2], args[1]);

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

    let value   = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty(getter, setter);
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

  async fetchSrc() {
    let src = this.getAttribute('src');
    if (!src)
      return;

    console.log('Fetching Resource: ', src);

    try {
      await loadPartialIntoElement.call(this, src);
    } catch (error) {
      console.error(`"${this.sensitiveTagName}": Failed to load specified resource: ${src} (resolved to: ${error.url})`, error);
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
    let newSrc = globalThis.mythixUI.urlResolver.call(this, { src: originalURL, url });
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

function createProxyContext(parentElement, context) {
  return new Proxy(context, {
    get: (target, propName) => {
      if (propName in target)
        return target[propName];

      if (!parentElement)
        return;

      let currentParent   = parentElement;
      let publishContext  = currentParent.publishContext;
      while (currentParent && typeof(publishContext = currentParent.publishContext) !== 'function')
        currentParent = currentParent.parentNode;

      if (!publishContext)
        return;

      let parentContext = publishContext();
      return (parentContext) ? parentContext[propName] : undefined;
    },
  });
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

  let context = createProxyContext(this, scopeData);
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

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
    _component_js__WEBPACK_IMPORTED_MODULE_0__.visibilityObserver(({ disconnect, element, wasVisible }) => {
      if (wasVisible)
        return;

      let src = element.getAttribute('data-mythix-src');
      if (!src)
        return;

      disconnect();

      console.log('Fetching Resource (for native element): ', src);
      _component_js__WEBPACK_IMPORTED_MODULE_0__.loadPartialIntoElement.call(element, src);
    }, { elements });
  });
}


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
  static tagName            = 'mythix-spinner';
  static observedAttributes = [ 'kind' ];

  attributeChanged(name, oldValue, newValue) {
    if (name !== 'kind')
      return;

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

        // Redirect any array methods
        if (typeof Array.prototype[propName] === 'function') {
          return (...args) => {
            let array   = target._mythixUIElements;
            let result  = array[propName](...args);

            if (Array.isArray(result) && result.every((item) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, _elements_js__WEBPACK_IMPORTED_MODULE_1__.ElementDefinition, Node, QueryEngine))) {
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
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   fetchPath: () => (/* binding */ fetchPath),
/* harmony export */   formatTerm: () => (/* binding */ formatTerm),
/* harmony export */   generateID: () => (/* binding */ generateID),
/* harmony export */   getAllEventNamesForElement: () => (/* binding */ getAllEventNamesForElement),
/* harmony export */   getObjID: () => (/* binding */ getObjID),
/* harmony export */   isCollectable: () => (/* binding */ isCollectable),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   notNOE: () => (/* binding */ notNOE),
/* harmony export */   stringIsDynamicBindingTemplate: () => (/* binding */ stringIsDynamicBindingTemplate),
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

function bindMethods(_proto, skipProtos) {
  let proto           = _proto;
  let alreadyVisited  = new Set();

  while (proto) {
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
      if (Object.prototype.hasOwnProperty.call(descriptor, 'get'))
        continue;

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
        value:        new WeakMap(),
      },
    });
  }

  toString() {
    let value = this.value;
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  set(context, newValue) {
    if (this.value === newValue)
      return;

    this.value = newValue;
    this.triggerUpdates(context);
  }

  triggerUpdates(context) {
    let map = this.registeredNodes.get(context);
    if (!map)
      return;

    for (let [ node, callback ] of map.entries())
      node.nodeValue = callback(context);
  }

  registerForUpdate(context, node, callback) {
    let map = this.registeredNodes.get(context);
    if (!map) {
      map = new Map();
      this.registeredNodes.set(context, map);
    }

    if (map.has(node))
      return;

    map.set(node, callback);
  }
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
const VALID_JS_IDENTIFIER         = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function createDynamicPropertyFetcher(context, _functionBody, _contextCallArgs) {
  let contextCallArgs = (_contextCallArgs) ? _contextCallArgs : `{${Object.keys(context).filter((name) => VALID_JS_IDENTIFIER.test(name)).join(',')}}`;
  return (new Function(contextCallArgs, `return ${_functionBody.replace(/^\s*return\s+/, '')};`)).bind(this);
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

  let contextCallArgs = `{${Object.keys(context).filter((name) => VALID_JS_IDENTIFIER.test(name)).join(',')}}`;
  return text.replace(/(?:^\{\{|([^\\])\{\{)([^}]+?)\}{2,}/g, (m, start, macro) => {
    const fetchPath = createDynamicPropertyFetcher(context, macro, contextCallArgs);
    let value = fetchPath(context);
    if (value == null)
      value = '';

    if (node && value instanceof DynamicProperty)
      value.registerForUpdate(context, node, (context) => formatTerm(context, text));

    return `${start || ''}${value}`;
  });
}

const HAS_DYNAMIC_BINDING = /^\{\{|[^\\]\{\{/;

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

  return (new Function('event', `let e=event,ev=event,evt=event;return ${functionBody.replace(/^\s*return\s*/, '')};`)).bind(this);
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

  if (currentValue && currentValue instanceof Node && (currentValue.nodeType === Node.TEXT_NODE || currentValue.nodeType === Node.ATTRIBUTE_NODE))
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
/* harmony export */   MythixUIRequire: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIRequire),
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_5__.MythixUISpinner),
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
/* harmony export */   createProxyContext: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_1__.createProxyContext),
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
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});













globalThis.mythixUI.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_0__;
globalThis.mythixUI.Components = _component_js__WEBPACK_IMPORTED_MODULE_1__;
globalThis.mythixUI.Elements = _elements_js__WEBPACK_IMPORTED_MODULE_2__;

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
var __webpack_exports__createProxyContext = __webpack_exports__.createProxyContext;
var __webpack_exports__getVisibilityMeta = __webpack_exports__.getVisibilityMeta;
var __webpack_exports__importIntoDocumentFromSource = __webpack_exports__.importIntoDocumentFromSource;
var __webpack_exports__isSVGElement = __webpack_exports__.isSVGElement;
var __webpack_exports__loadPartialIntoElement = __webpack_exports__.loadPartialIntoElement;
var __webpack_exports__recursivelyBindDynamicData = __webpack_exports__.recursivelyBindDynamicData;
var __webpack_exports__remapNodeTree = __webpack_exports__.remapNodeTree;
var __webpack_exports__require = __webpack_exports__.require;
var __webpack_exports__resolveURL = __webpack_exports__.resolveURL;
var __webpack_exports__visibilityObserver = __webpack_exports__.visibilityObserver;
export { __webpack_exports__A as A, __webpack_exports__ABBR as ABBR, __webpack_exports__ADDRESS as ADDRESS, __webpack_exports__ALTGLYPH as ALTGLYPH, __webpack_exports__ALTGLYPHDEF as ALTGLYPHDEF, __webpack_exports__ALTGLYPHITEM as ALTGLYPHITEM, __webpack_exports__ANIMATE as ANIMATE, __webpack_exports__ANIMATECOLOR as ANIMATECOLOR, __webpack_exports__ANIMATEMOTION as ANIMATEMOTION, __webpack_exports__ANIMATETRANSFORM as ANIMATETRANSFORM, __webpack_exports__ANIMATION as ANIMATION, __webpack_exports__AREA as AREA, __webpack_exports__ARTICLE as ARTICLE, __webpack_exports__ASIDE as ASIDE, __webpack_exports__AUDIO as AUDIO, __webpack_exports__B as B, __webpack_exports__BASE as BASE, __webpack_exports__BDI as BDI, __webpack_exports__BDO as BDO, __webpack_exports__BLOCKQUOTE as BLOCKQUOTE, __webpack_exports__BR as BR, __webpack_exports__BUTTON as BUTTON, __webpack_exports__CANVAS as CANVAS, __webpack_exports__CAPTION as CAPTION, __webpack_exports__CIRCLE as CIRCLE, __webpack_exports__CITE as CITE, __webpack_exports__CLIPPATH as CLIPPATH, __webpack_exports__CODE as CODE, __webpack_exports__COL as COL, __webpack_exports__COLGROUP as COLGROUP, __webpack_exports__COLORPROFILE as COLORPROFILE, __webpack_exports__CURSOR as CURSOR, __webpack_exports__DATA as DATA, __webpack_exports__DATALIST as DATALIST, __webpack_exports__DD as DD, __webpack_exports__DEFS as DEFS, __webpack_exports__DEL as DEL, __webpack_exports__DESC as DESC, __webpack_exports__DETAILS as DETAILS, __webpack_exports__DFN as DFN, __webpack_exports__DIALOG as DIALOG, __webpack_exports__DISCARD as DISCARD, __webpack_exports__DIV as DIV, __webpack_exports__DL as DL, __webpack_exports__DT as DT, __webpack_exports__ELEMENT_NAMES as ELEMENT_NAMES, __webpack_exports__ELLIPSE as ELLIPSE, __webpack_exports__EM as EM, __webpack_exports__EMBED as EMBED, __webpack_exports__ElementDefinition as ElementDefinition, __webpack_exports__FEBLEND as FEBLEND, __webpack_exports__FECOLORMATRIX as FECOLORMATRIX, __webpack_exports__FECOMPONENTTRANSFER as FECOMPONENTTRANSFER, __webpack_exports__FECOMPOSITE as FECOMPOSITE, __webpack_exports__FECONVOLVEMATRIX as FECONVOLVEMATRIX, __webpack_exports__FEDIFFUSELIGHTING as FEDIFFUSELIGHTING, __webpack_exports__FEDISPLACEMENTMAP as FEDISPLACEMENTMAP, __webpack_exports__FEDISTANTLIGHT as FEDISTANTLIGHT, __webpack_exports__FEDROPSHADOW as FEDROPSHADOW, __webpack_exports__FEFLOOD as FEFLOOD, __webpack_exports__FEFUNCA as FEFUNCA, __webpack_exports__FEFUNCB as FEFUNCB, __webpack_exports__FEFUNCG as FEFUNCG, __webpack_exports__FEFUNCR as FEFUNCR, __webpack_exports__FEGAUSSIANBLUR as FEGAUSSIANBLUR, __webpack_exports__FEIMAGE as FEIMAGE, __webpack_exports__FEMERGE as FEMERGE, __webpack_exports__FEMERGENODE as FEMERGENODE, __webpack_exports__FEMORPHOLOGY as FEMORPHOLOGY, __webpack_exports__FEOFFSET as FEOFFSET, __webpack_exports__FEPOINTLIGHT as FEPOINTLIGHT, __webpack_exports__FESPECULARLIGHTING as FESPECULARLIGHTING, __webpack_exports__FESPOTLIGHT as FESPOTLIGHT, __webpack_exports__FETILE as FETILE, __webpack_exports__FETURBULENCE as FETURBULENCE, __webpack_exports__FIELDSET as FIELDSET, __webpack_exports__FIGCAPTION as FIGCAPTION, __webpack_exports__FIGURE as FIGURE, __webpack_exports__FILTER as FILTER, __webpack_exports__FONT as FONT, __webpack_exports__FONTFACE as FONTFACE, __webpack_exports__FONTFACEFORMAT as FONTFACEFORMAT, __webpack_exports__FONTFACENAME as FONTFACENAME, __webpack_exports__FONTFACESRC as FONTFACESRC, __webpack_exports__FONTFACEURI as FONTFACEURI, __webpack_exports__FOOTER as FOOTER, __webpack_exports__FOREIGNOBJECT as FOREIGNOBJECT, __webpack_exports__FORM as FORM, __webpack_exports__G as G, __webpack_exports__GLYPH as GLYPH, __webpack_exports__GLYPHREF as GLYPHREF, __webpack_exports__H1 as H1, __webpack_exports__H2 as H2, __webpack_exports__H3 as H3, __webpack_exports__H4 as H4, __webpack_exports__H5 as H5, __webpack_exports__H6 as H6, __webpack_exports__HANDLER as HANDLER, __webpack_exports__HEADER as HEADER, __webpack_exports__HGROUP as HGROUP, __webpack_exports__HKERN as HKERN, __webpack_exports__HR as HR, __webpack_exports__I as I, __webpack_exports__IFRAME as IFRAME, __webpack_exports__IMAGE as IMAGE, __webpack_exports__IMG as IMG, __webpack_exports__INPUT as INPUT, __webpack_exports__INS as INS, __webpack_exports__KBD as KBD, __webpack_exports__LABEL as LABEL, __webpack_exports__LEGEND as LEGEND, __webpack_exports__LI as LI, __webpack_exports__LINE as LINE, __webpack_exports__LINEARGRADIENT as LINEARGRADIENT, __webpack_exports__LINK as LINK, __webpack_exports__LISTENER as LISTENER, __webpack_exports__MAIN as MAIN, __webpack_exports__MAP as MAP, __webpack_exports__MARK as MARK, __webpack_exports__MARKER as MARKER, __webpack_exports__MASK as MASK, __webpack_exports__MENU as MENU, __webpack_exports__META as META, __webpack_exports__METADATA as METADATA, __webpack_exports__METER as METER, __webpack_exports__MISSINGGLYPH as MISSINGGLYPH, __webpack_exports__MPATH as MPATH, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__NAV as NAV, __webpack_exports__NOSCRIPT as NOSCRIPT, __webpack_exports__OBJECT as OBJECT, __webpack_exports__OL as OL, __webpack_exports__OPTGROUP as OPTGROUP, __webpack_exports__OPTION as OPTION, __webpack_exports__OUTPUT as OUTPUT, __webpack_exports__P as P, __webpack_exports__PATH as PATH, __webpack_exports__PATTERN as PATTERN, __webpack_exports__PICTURE as PICTURE, __webpack_exports__POLYGON as POLYGON, __webpack_exports__POLYLINE as POLYLINE, __webpack_exports__PRE as PRE, __webpack_exports__PREFETCH as PREFETCH, __webpack_exports__PROGRESS as PROGRESS, __webpack_exports__Q as Q, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__RADIALGRADIENT as RADIALGRADIENT, __webpack_exports__RECT as RECT, __webpack_exports__RP as RP, __webpack_exports__RT as RT, __webpack_exports__RUBY as RUBY, __webpack_exports__S as S, __webpack_exports__SAMP as SAMP, __webpack_exports__SCRIPT as SCRIPT, __webpack_exports__SECTION as SECTION, __webpack_exports__SELECT as SELECT, __webpack_exports__SET as SET, __webpack_exports__SLOT as SLOT, __webpack_exports__SMALL as SMALL, __webpack_exports__SOLIDCOLOR as SOLIDCOLOR, __webpack_exports__SOURCE as SOURCE, __webpack_exports__SPAN as SPAN, __webpack_exports__STOP as STOP, __webpack_exports__STRONG as STRONG, __webpack_exports__STYLE as STYLE, __webpack_exports__SUB as SUB, __webpack_exports__SUMMARY as SUMMARY, __webpack_exports__SUP as SUP, __webpack_exports__SVG as SVG, __webpack_exports__SVG_ELEMENT_NAMES as SVG_ELEMENT_NAMES, __webpack_exports__SWITCH as SWITCH, __webpack_exports__SYMBOL as SYMBOL, __webpack_exports__TABLE as TABLE, __webpack_exports__TBODY as TBODY, __webpack_exports__TBREAK as TBREAK, __webpack_exports__TD as TD, __webpack_exports__TEMPLATE as TEMPLATE, __webpack_exports__TEXT as TEXT, __webpack_exports__TEXTAREA as TEXTAREA, __webpack_exports__TEXTPATH as TEXTPATH, __webpack_exports__TFOOT as TFOOT, __webpack_exports__TH as TH, __webpack_exports__THEAD as THEAD, __webpack_exports__TIME as TIME, __webpack_exports__TITLE as TITLE, __webpack_exports__TR as TR, __webpack_exports__TRACK as TRACK, __webpack_exports__TREF as TREF, __webpack_exports__TSPAN as TSPAN, __webpack_exports__Term as Term, __webpack_exports__U as U, __webpack_exports__UL as UL, __webpack_exports__UNFINISHED_DEFINITION as UNFINISHED_DEFINITION, __webpack_exports__UNKNOWN as UNKNOWN, __webpack_exports__USE as USE, __webpack_exports__Utils as Utils, __webpack_exports__VAR as VAR, __webpack_exports__VIDEO as VIDEO, __webpack_exports__VIEW as VIEW, __webpack_exports__VKERN as VKERN, __webpack_exports__WBR as WBR, __webpack_exports__build as build, __webpack_exports__createProxyContext as createProxyContext, __webpack_exports__getVisibilityMeta as getVisibilityMeta, __webpack_exports__importIntoDocumentFromSource as importIntoDocumentFromSource, __webpack_exports__isSVGElement as isSVGElement, __webpack_exports__loadPartialIntoElement as loadPartialIntoElement, __webpack_exports__recursivelyBindDynamicData as recursivelyBindDynamicData, __webpack_exports__remapNodeTree as remapNodeTree, __webpack_exports__require as require, __webpack_exports__resolveURL as resolveURL, __webpack_exports__visibilityObserver as visibilityObserver };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LDZDQUFZO0FBQ3ZCOztBQUVBLDhDQUE4QyxxQkFBcUI7QUFDbkUsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzSEFBc0g7QUFDdEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFTyx5REFBeUQsT0FBTzs7QUFFaEU7QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUCwrQkFBK0IsNEJBQTRCOztBQUVwRDtBQUNQO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzWTRDOztBQUVyQyw4QkFBOEIsNERBQTJCO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxRQUFRLGtEQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLHVFQUFzQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsV0FBVztBQUMzQztBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTiw0RUFBNEUsSUFBSTtBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDs7QUFFakQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDZEQUE0QixJQUFJLGlDQUFpQztBQUNyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLE1BQU0saUVBQWdDO0FBQ3RDLEtBQUssSUFBSSxVQUFVO0FBQ25CLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFQTs7QUFFbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLDhCQUE4Qiw0REFBaUI7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEtBQUs7QUFDdEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsaURBQWlEOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFWVDtBQUNHOztBQUtwQjs7QUFF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O1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLGdEQUFnRDs7QUFFWjtBQUNTO0FBQ0g7O0FBRU47O0FBRUY7QUFDSDtBQUNEO0FBQ1M7QUFDQTs7QUFFdkMsNEJBQTRCLHNDQUFLO0FBQ2pDLGlDQUFpQywwQ0FBVTtBQUMzQywrQkFBK0IseUNBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFV0aWxzICAgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgUXVlcnlFbmdpbmUgfSAgZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgICAgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbi8vIGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4vLyAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuLy8gICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMgfHwgMCk7XG4vLyAgIH0pO1xuLy8gfVxuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGlmICghcnVsZS5zZWxlY3RvclRleHQpXG4gICAgcmV0dXJuIHJ1bGUuY3NzVGV4dDtcblxuICBsZXQgX2JvZHkgICA9IHJ1bGUuY3NzVGV4dC5zdWJzdHJpbmcocnVsZS5zZWxlY3RvclRleHQubGVuZ3RoKS50cmltKCk7XG4gIGxldCByZXN1bHQgID0gKGNhbGxiYWNrKHJ1bGUuc2VsZWN0b3JUZXh0LCBfYm9keSkgfHwgW10pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmV0dXJuICcnO1xuXG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBjc3NSdWxlc1RvU291cmNlKGNzc1J1bGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQXJyYXkuZnJvbShjc3NSdWxlcyB8fCBbXSkubWFwKChydWxlKSA9PiB7XG4gICAgbGV0IHJ1bGVTdHIgPSBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gYCR7Y3NzUnVsZXNUb1NvdXJjZShydWxlLmNzc1J1bGVzLCBjYWxsYmFjayl9JHtydWxlU3RyfWA7XG4gIH0pLmpvaW4oJ1xcblxcbicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVGb3JEb2N1bWVudChlbGVtZW50TmFtZSwgc3R5bGVFbGVtZW50KSB7XG4gIGNvbnN0IGhhbmRsZUhvc3QgPSAobSwgdHlwZSwgX2NvbnRlbnQpID0+IHtcbiAgICBsZXQgY29udGVudCA9ICghX2NvbnRlbnQpID8gX2NvbnRlbnQgOiBfY29udGVudC5yZXBsYWNlKC9eXFwoLywgJycpLnJlcGxhY2UoL1xcKSQvLCAnJyk7XG5cbiAgICBpZiAodHlwZSA9PT0gJzpob3N0Jykge1xuICAgICAgaWYgKCFjb250ZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudE5hbWU7XG5cbiAgICAgIC8vIEVsZW1lbnQgc2VsZWN0b3I/XG4gICAgICBpZiAoKC9eW2EtekEtWl9dLykudGVzdChjb250ZW50KSlcbiAgICAgICAgcmV0dXJuIGAke2NvbnRlbnR9W2RhdGEtbXl0aGl4LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbiAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4gICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3RvcjtcbiAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4gICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuICAgICAgICB0YWdzLnB1c2gobSk7XG4gICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4gICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuICAgIH0sXG4gICk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4gIGxldCBvYmpJRCAgICAgICAgICAgICA9IFV0aWxzLmdldE9iaklEKHRlbXBsYXRlKTtcbiAgbGV0IHRlbXBsYXRlSUQgICAgICAgID0gVXRpbHMuU0hBMjU2KG9iaklEKTtcbiAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4gIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbiAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbiAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4gICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudDtcbiAgc3RhdGljIHJlZ2lzdGVyID0gZnVuY3Rpb24oX25hbWUsIEtsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MgfHwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gWyAnc3JjJyBdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBVdGlscy5iaW5kTWV0aG9kcy5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLCBbIE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgXSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+ICgodGhpcy5wcmVmaXgpID8gYCR7dGhpcy5wcmVmaXh9OiR7dGhpcy5sb2NhbE5hbWV9YCA6IHRoaXMubG9jYWxOYW1lKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGVJRCc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSUQsXG4gICAgICB9LFxuICAgICAgJ2RlbGF5VGltZXJzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbmV3IE1hcCgpLFxuICAgICAgfSxcbiAgICAgICdkb2N1bWVudEluaXRpYWxpemVkJzoge1xuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnKSxcbiAgICAgICAgc2V0OiAgICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCAnX215dGhpeFVJRG9jdW1lbnRJbml0aWFsaXplZCcsICEhdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzaGFkb3cnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY3JlYXRlU2hhZG93RE9NKCksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgaW5qZWN0U3R5bGVTaGVldChjb250ZW50KSB7XG4gICAgbGV0IHN0eWxlSUQgICAgICAgPSBgSURTVFlMRSR7VXRpbHMuU0hBMjU2KGAke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fWApfWA7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IHN0eWxlRWxlbWVudCAgPSBvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKTtcblxuICAgIGlmIChzdHlsZUVsZW1lbnQpXG4gICAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuXG4gICAgc3R5bGVFbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblxuICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG4gIH1cblxuICBmb3JtYXRUZW1wbGF0ZU5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUpXG4gICAgICByZXR1cm4gbm9kZTtcblxuICAgIGZvciAobGV0IGNoaWxkTm9kZSBvZiBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykpIHtcbiAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGNoaWxkTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKHRoaXMsIGNoaWxkTm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgY2hpbGROb2RlLm5vZGVUeXBlID49IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgICBjaGlsZE5vZGUgPSB0aGlzLmZvcm1hdFRlbXBsYXRlTm9kZXMoY2hpbGROb2RlKTtcblxuICAgICAgICBsZXQgZXZlbnROYW1lcyAgICAgID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoY2hpbGROb2RlKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50KHRoaXMsIGNoaWxkTm9kZSwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0odGhpcywgYXR0cmlidXRlTm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjcmVhdGVTaGFkb3dET00ob3B0aW9ucykge1xuICAgIC8vIENoZWNrIGVudmlyb25tZW50IHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIHRoaXMuYXR0YWNoU2hhZG93ICE9PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nLCAuLi4ob3B0aW9ucyB8fCB7fSkgfSk7XG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMub3duZXJEb2N1bWVudClcbiAgICAgIHJldHVybjtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LW5hbWU9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldYCk7XG4gIH1cblxuICBhcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKF90ZW1wbGF0ZSkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IF90ZW1wbGF0ZSB8fCB0aGlzLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgZW5zdXJlRG9jdW1lbnRTdHlsZXMuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSwgdGVtcGxhdGUpO1xuXG4gICAgICBsZXQgZm9ybWF0dGVkVGVtcGxhdGUgPSB0aGlzLmZvcm1hdFRlbXBsYXRlTm9kZXModGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgdGhpcy5zaGFkb3cuYXBwZW5kQ2hpbGQoZm9ybWF0dGVkVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKCdjb21wb25lbnQtbmFtZScsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG5cbiAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oKTtcblxuICAgIHRoaXMubW91bnRlZCgpO1xuXG4gICAgdGhpcy5kb2N1bWVudEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMudW5tb3VudGVkKCk7XG4gIH1cblxuICBhd2FpdEZldGNoU3JjT25WaXNpYmxlKG5ld1NyYykge1xuICAgIGlmICh0aGlzLnZpc2liaWxpdHlPYnNlcnZlcikge1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudW5vYnNlcnZlKHRoaXMpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICghbmV3U3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG9ic2VydmVyID0gdmlzaWJpbGl0eU9ic2VydmVyKCh7IHdhc1Zpc2libGUsIGRpc2Nvbm5lY3QgfSkgPT4ge1xuICAgICAgaWYgKCF3YXNWaXNpYmxlKVxuICAgICAgICB0aGlzLmZldGNoU3JjKCk7XG5cbiAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0sIHsgZWxlbWVudHM6IFsgdGhpcyBdIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Zpc2liaWxpdHlPYnNlcnZlcic6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb2JzZXJ2ZXIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJnc1swXSA9PT0gJ3NyYycpXG4gICAgICB0aGlzLmF3YWl0RmV0Y2hTcmNPblZpc2libGUoYXJnc1syXSwgYXJnc1sxXSk7XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy4kKHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKSk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH1cblxuICBidWlsZChjYWxsYmFjaykge1xuICAgIGxldCByZXN1bHQgPSBbIGNhbGxiYWNrKEVsZW1lbnRzLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bRWxlbWVudHMuVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCByZXN1bHQpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGR5bmFtaWNQcm9wKG5hbWUsIF9nZXR0ZXIsIF9zZXR0ZXIsIF9jb250ZXh0KSB7XG4gICAgbGV0IGlzR2V0dGVyRnVuYyAgPSAodHlwZW9mIF9nZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgIGxldCBpbnRlcm5hbFZhbHVlID0gKGlzR2V0dGVyRnVuYykgPyB1bmRlZmluZWQgOiBfZ2V0dGVyO1xuICAgIGxldCBnZXR0ZXIgICAgICAgID0gKGlzR2V0dGVyRnVuYykgPyBfZ2V0dGVyIDogKCkgPT4gaW50ZXJuYWxWYWx1ZTtcbiAgICBsZXQgc2V0dGVyICAgICAgICA9ICh0eXBlb2YgX3NldHRlciA9PT0gJ2Z1bmN0aW9uJykgPyBfc2V0dGVyIDogKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpbnRlcm5hbFZhbHVlID0gbmV3VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCB2YWx1ZSAgID0gbmV3IFV0aWxzLkR5bmFtaWNQcm9wZXJ0eShnZXR0ZXIsIHNldHRlcik7XG4gICAgbGV0IGNvbnRleHQgPSBfY29udGV4dCB8fCB0aGlzO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29udGV4dCwge1xuICAgICAgW25hbWVdOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHZhbHVlLnZhbHVlLFxuICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgIHZhbHVlLnNldCh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZHluYW1pY0RhdGEob2JqKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGxldCBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHRoaXMuZHluYW1pY1Byb3Aoa2V5LCB2YWx1ZSwgdW5kZWZpbmVkLCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGRlYm91bmNlKGNhbGxiYWNrLCBtcywgX2lkKSB7XG4gICAgdmFyIGlkID0gX2lkO1xuXG4gICAgLy8gSWYgd2UgZG9uJ3QgZ2V0IGFuIGlkIGZyb20gdGhlIHVzZXIsIHRoZW4gZ3Vlc3MgdGhlIGlkIGJ5IHR1cm5pbmcgdGhlIGZ1bmN0aW9uXG4gICAgLy8gaW50byBhIHN0cmluZyAocmF3IHNvdXJjZSkgYW5kIHVzZSB0aGF0IGZvciBhbiBpZCBpbnN0ZWFkXG4gICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgIGlkID0gKCcnICsgY2FsbGJhY2spO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgdHJhbnNwaWxlZCBjb2RlLCB0aGVuIGFuIGFzeW5jIGdlbmVyYXRvciB3aWxsIGJlIHVzZWQgZm9yIGFzeW5jIGZ1bmN0aW9uc1xuICAgICAgLy8gVGhpcyB3cmFwcyB0aGUgcmVhbCBmdW5jdGlvbiwgYW5kIHNvIHdoZW4gY29udmVydGluZyB0aGUgZnVuY3Rpb24gaW50byBhIHN0cmluZ1xuICAgICAgLy8gaXQgd2lsbCBOT1QgYmUgdW5pcXVlIHBlciBjYWxsLXNpdGUuIEZvciB0aGlzIHJlYXNvbiwgaWYgd2UgZGV0ZWN0IHRoaXMgaXNzdWUsXG4gICAgICAvLyB3ZSB3aWxsIGdvIHRoZSBcInNsb3dcIiByb3V0ZSBhbmQgY3JlYXRlIGEgc3RhY2sgdHJhY2UsIGFuZCB1c2UgdGhhdCBmb3IgdGhlIHVuaXF1ZSBpZFxuICAgICAgaWYgKGlkLm1hdGNoKC9hc3luY0dlbmVyYXRvclN0ZXAvKSkge1xuICAgICAgICBpZCA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gICAgICAgIGNvbnNvbGUud2FybignbXl0aGl4LXVpIHdhcm5pbmc6IFwidGhpcy5kZWxheVwiIGNhbGxlZCB3aXRob3V0IGEgc3BlY2lmaWVkIFwiaWRcIiBwYXJhbWV0ZXIuIFRoaXMgd2lsbCByZXN1bHQgaW4gYSBwZXJmb3JtYW5jZSBoaXQuIFBsZWFzZSBzcGVjaWZ5IGFuZCBcImlkXCIgYXJndW1lbnQgZm9yIHlvdXIgY2FsbDogXCJ0aGlzLmRlbGF5KGNhbGxiYWNrLCBtcywgXFwnc29tZS1jdXN0b20tY2FsbC1zaXRlLWlkXFwnKVwiJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gKCcnICsgaWQpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gdGhpcy5kZWxheVRpbWVycy5nZXQoaWQpO1xuICAgIGlmIChwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgICBjbGVhclRpbWVvdXQocHJvbWlzZS50aW1lcklEKTtcblxuICAgICAgcHJvbWlzZS5yZWplY3QoJ2NhbmNlbGxlZCcpO1xuICAgIH1cblxuICAgIHByb21pc2UgPSBVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCBtcyB8fCAwKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2xhc3NlcyguLi5fYXJncykge1xuICAgIGxldCBhcmdzID0gX2FyZ3MuZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSlcbiAgICAgICAgcmV0dXJuIGl0ZW0udHJpbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmICghc3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIFJlc291cmNlOiAnLCBzcmMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbCh0aGlzLCBzcmMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfSAocmVzb2x2ZWQgdG86ICR7ZXJyb3IudXJsfSlgLCBlcnJvcik7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFNDSEVNRV9SRSAgICAgPSAvXltcXHctXSs6XFwvXFwvLztcbmNvbnN0IEhBU19GSUxFTkFNRSAgPSAvXFwuW14vLl0rJC87XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVVJMKGxvY2F0aW9uLCBfdXJsaXNoLCBtYWdpYykge1xuICBsZXQgdXJsaXNoID0gX3VybGlzaDtcbiAgaWYgKHVybGlzaCBpbnN0YW5jZW9mIFVSTClcbiAgICByZXR1cm4gdXJsaXNoO1xuXG4gIGlmICghdXJsaXNoKVxuICAgIHJldHVybiBuZXcgVVJMKGxvY2F0aW9uKTtcblxuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgTG9jYXRpb24pXG4gICAgcmV0dXJuIG5ldyBVUkwodXJsaXNoKTtcblxuICBpZiAoIVV0aWxzLmlzVHlwZSh1cmxpc2gsICdTdHJpbmcnKSlcbiAgICByZXR1cm47XG5cbiAgY29uc3QgaW50ZXJuYWxSZXNvbHZlID0gKF9sb2NhdGlvbiwgX3VybFBhcnQsIG1hZ2ljKSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsVVJMID0gdXJsaXNoO1xuICAgIGlmIChTQ0hFTUVfUkUudGVzdCh1cmxpc2gpKVxuICAgICAgcmV0dXJuIHVybGlzaDtcblxuICAgIC8vIE1hZ2ljIVxuICAgIGlmIChtYWdpYyA9PT0gdHJ1ZSAmJiAhSEFTX0ZJTEVOQU1FLnRlc3QodXJsaXNoKSkge1xuICAgICAgbGV0IHBhcnRzICAgICA9IHVybGlzaC5zcGxpdCgnLycpLm1hcCgocGFydCkgPT4gcGFydC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGxldCBsYXN0UGFydCAgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChsYXN0UGFydClcbiAgICAgICAgdXJsaXNoID0gYCR7dXJsaXNoLnJlcGxhY2UoL1xcLyskLywgJycpfS8ke2xhc3RQYXJ0fS5odG1sYDtcbiAgICB9XG5cbiAgICBsZXQgbG9jYXRpb24gPSBuZXcgVVJMKF9sb2NhdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogbmV3IFVSTChgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke3VybGlzaH1gLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKSksXG4gICAgICBvcmlnaW5hbFVSTCxcbiAgICB9O1xuICB9O1xuXG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG9yaWdpbmFsVVJMLFxuICB9ID0gaW50ZXJuYWxSZXNvbHZlKGxvY2F0aW9uLCB1cmxpc2gudG9TdHJpbmcoKSwgbWFnaWMpO1xuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBuZXdTcmMgPSBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyLmNhbGwodGhpcywgeyBzcmM6IG9yaWdpbmFsVVJMLCB1cmwgfSk7XG4gICAgaWYgKG5ld1NyYyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtcmVxdWlyZVwiOiBOb3QgbG9hZGluZyBcIiR7b3JpZ2luYWxVUkx9XCIgYmVjYXVzZSB0aGUgZ2xvYmFsIFwibXl0aGl4VUkudXJsUmVzb2x2ZXJcIiByZXF1ZXN0ZWQgSSBub3QgZG8gc28uYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5ld1NyYyAhPT0gb3JpZ2luYWxVUkwpXG4gICAgICB1cmwgPSByZXNvbHZlVVJMKGxvY2F0aW9uLCBuZXdTcmMsIG1hZ2ljKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBJU19TQ1JJUFQgICAgID0gL14oc2NyaXB0KSQvaTtcbmNvbnN0IFJFUVVJUkVfQ0FDSEUgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IHJlc29sdmVVUkwobG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IG5vZGVIYW5kbGVyICAgICAgICAgPSBvcHRpb25zLm5vZGVIYW5kbGVyO1xuICBsZXQgdGVtcGxhdGVDb3VudCAgICAgICA9IGNoaWxkcmVuLnJlZHVjZSgoc3VtLCBlbGVtZW50KSA9PiAoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyAoc3VtICsgMSkgOiBzdW0pLCAwKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgY2hpbGRyZW4sXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB0ZW1wbGF0ZSxcbiAgICB0ZW1wbGF0ZUNvdW50LFxuICAgIHVybCxcbiAgfTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgIGlmICh0ZW1wbGF0ZUNvdW50ID09PSAxICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSA9PSBudWxsICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtbmFtZScpID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke3VybH06IDx0ZW1wbGF0ZT4gaXMgbWlzc2luZyBhIFwiZGF0YS1mb3JcIiBhdHRyaWJ1dGUsIGxpbmtpbmcgaXQgdG8gaXRzIG93bmVyIGNvbXBvbmVudC4gR3Vlc3NpbmcgXCIke2d1ZXNzZWRFbGVtZW50TmFtZX1cIi5gKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWZvcicsIGd1ZXNzZWRFbGVtZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1RlbXBsYXRlOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgfHwgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCIgaV1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKElTX1NDUklQVC50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxzY3JpcHQ+XG4gICAgICBsZXQgY2hpbGRDbG9uZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2YgY2hpbGQuZ2V0QXR0cmlidXRlTmFtZXMoKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgY2hpbGQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpKTtcblxuICAgICAgbGV0IHNyYyA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIHNyYyA9IHJlc29sdmVVUkwoYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBgSUQke1V0aWxzLlNIQTI1NihgJHtndWVzc2VkRWxlbWVudE5hbWV9OiR7Y2hpbGRDbG9uZS5pbm5lckhUTUx9YCl9YDtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdCMke3N0eWxlSUR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKCgvXihsaW5rfHN0eWxlKSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkge1xuICAgICAgbGV0IGlzU3R5bGUgPSAoL15zdHlsZSQvaSkudGVzdChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1N0eWxlLCBpc0xpbms6ICFpc1N0eWxlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGlkID0gYElEJHtVdGlscy5TSEEyNTYoY2hpbGQub3V0ZXJIVE1MKX1gO1xuICAgICAgaWYgKCFjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtjaGlsZC50YWdOYW1lfSMke2lkfWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoKC9ebWV0YSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkge1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc01ldGE6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KTtcblxuICAgICAgLy8gZG8gbm90aGluZyB3aXRoIHRoZXNlIHRhZ3NcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzSGFuZGxlZDogZmFsc2UgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlKG93bmVyRG9jdW1lbnQsIHVybE9yTmFtZSwgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdXJsICAgICAgID0gcmVzb2x2ZVVSTChvd25lckRvY3VtZW50LmxvY2F0aW9uLCB1cmxPck5hbWUsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgY2FjaGVLZXk7XG5cbiAgaWYgKHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdjYWNoZScpICE9PSAnZmFsc2UnKSB7XG4gICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgIGNhY2hlS2V5ID0gY2FjaGVLZXlVUkwudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICB9XG5cbiAgbGV0IGNhY2hlZFJlc3BvbnNlID0gUkVRVUlSRV9DQUNIRS5nZXQoY2FjaGVLZXkpO1xuICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICBjYWNoZWRSZXNwb25zZSA9IGF3YWl0IGNhY2hlZFJlc3BvbnNlO1xuICAgIGlmIChjYWNoZWRSZXNwb25zZS5yZXNwb25zZSAmJiBjYWNoZWRSZXNwb25zZS5yZXNwb25zZS5vaylcbiAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgfVxuXG4gIGxldCBwcm9taXNlID0gZ2xvYmFsVGhpcy5mZXRjaCh1cmwsIG9wdGlvbnMuZmV0Y2hPcHRpb25zKS50aGVuKFxuICAgIGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBSRVFVSVJFX0NBQ0hFLmRlbGV0ZShjYWNoZUtleSk7XG4gICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihgJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICByZXNwb25zZS50ZXh0ID0gYXN5bmMgKCkgPT4gYm9keTtcbiAgICAgIHJlc3BvbnNlLmpzb24gPSBhc3luYyAoKSA9PiBKU09OLnBhcnNlKGJvZHkpO1xuXG4gICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IGZhbHNlIH07XG4gICAgfSxcbiAgICAoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZyb20gTXl0aGl4IFVJIFwicmVxdWlyZVwiOiAnLCBlcnJvcik7XG4gICAgICBSRVFVSVJFX0NBQ0hFLmRlbGV0ZShjYWNoZUtleSk7XG5cbiAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0sXG4gICk7XG5cbiAgUkVRVUlSRV9DQUNIRS5zZXQoY2FjaGVLZXksIHByb21pc2UpO1xuXG4gIHJldHVybiBhd2FpdCBwcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJveHlDb250ZXh0KHBhcmVudEVsZW1lbnQsIGNvbnRleHQpIHtcbiAgcmV0dXJuIG5ldyBQcm94eShjb250ZXh0LCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG5cbiAgICAgIGlmICghcGFyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgY3VycmVudFBhcmVudCAgID0gcGFyZW50RWxlbWVudDtcbiAgICAgIGxldCBwdWJsaXNoQ29udGV4dCAgPSBjdXJyZW50UGFyZW50LnB1Ymxpc2hDb250ZXh0O1xuICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnQgJiYgdHlwZW9mKHB1Ymxpc2hDb250ZXh0ID0gY3VycmVudFBhcmVudC5wdWJsaXNoQ29udGV4dCkgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LnBhcmVudE5vZGU7XG5cbiAgICAgIGlmICghcHVibGlzaENvbnRleHQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHBhcmVudENvbnRleHQgPSBwdWJsaXNoQ29udGV4dCgpO1xuICAgICAgcmV0dXJuIChwYXJlbnRDb250ZXh0KSA/IHBhcmVudENvbnRleHRbcHJvcE5hbWVdIDogdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFBhcnRpYWxJbnRvRWxlbWVudChzcmMpIHtcbiAgLy8gYXdhaXQgc2xlZXAoMTUwMCk7XG5cbiAgbGV0IHtcbiAgICBvd25lckRvY3VtZW50LFxuICAgIHVybCxcbiAgICByZXNwb25zZSxcbiAgfSA9IGF3YWl0IHJlcXVpcmUuY2FsbChcbiAgICB0aGlzLFxuICAgIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICBzcmMsXG4gICk7XG5cbiAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5jaGlsZE5vZGVzWzBdKTtcblxuICBsZXQgc2NvcGVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgdXJsLnNlYXJjaFBhcmFtcy5lbnRyaWVzKCkpXG4gICAgc2NvcGVEYXRhW2tleV0gPSBVdGlscy5jb2VyY2UodmFsdWUpO1xuXG4gIGxldCBjb250ZXh0ID0gY3JlYXRlUHJveHlDb250ZXh0KHRoaXMsIHNjb3BlRGF0YSk7XG4gIGxldCBzY29wZSAgID0geyBjb250ZXh0LCAkJDogY29udGV4dCB9O1xuXG4gIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICB0aGlzLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICB1cmwsXG4gICAgYm9keSxcbiAgICB7XG4gICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkLCBpc1RlbXBsYXRlIH0pID0+IHtcbiAgICAgICAgaWYgKChpc1RlbXBsYXRlIHx8ICFpc0hhbmRsZWQpICYmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkpXG4gICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChyZWN1cnNpdmVseUJpbmREeW5hbWljRGF0YShzY29wZSwgbm9kZSkpO1xuICAgICAgfSxcbiAgICB9LFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaWJpbGl0eU9ic2VydmVyKGNhbGxiYWNrLCBfb3B0aW9ucykge1xuICBjb25zdCBpbnRlcnNlY3Rpb25DYWxsYmFjayA9IChlbnRyaWVzKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gZW50cmllcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZW50cnkgICA9IGVudHJpZXNbaV07XG4gICAgICBsZXQgZWxlbWVudCA9IGVudHJ5LnRhcmdldDtcbiAgICAgIGlmICghZW50cnkuaXNJbnRlcnNlY3RpbmcpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgZWxlbWVudE9ic2VydmVycyA9IFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlJbnRlcnNlY3Rpb25PYnNlcnZlcnMnKTtcbiAgICAgIGlmICghZWxlbWVudE9ic2VydmVycykge1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICBVdGlscy5tZXRhZGF0YShlbGVtZW50LCAnX215dGhpeFVJSW50ZXJzZWN0aW9uT2JzZXJ2ZXJzJywgZWxlbWVudE9ic2VydmVycyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBkYXRhID0gZWxlbWVudE9ic2VydmVycy5nZXQob2JzZXJ2ZXIpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSB7IHdhc1Zpc2libGU6IGZhbHNlLCByYXRpb1Zpc2libGU6IGVudHJ5LmludGVyc2VjdGlvblJhdGlvIH07XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMuc2V0KG9ic2VydmVyLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gZGF0YS5yYXRpb1Zpc2libGUpXG4gICAgICAgIGRhdGEucmF0aW9WaXNpYmxlID0gZW50cnkuaW50ZXJzZWN0aW9uUmF0aW87XG5cbiAgICAgIGRhdGEucHJldmlvdXNWaXNpYmlsaXR5ID0gKGRhdGEudmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkKSA/IGRhdGEudmlzaWJpbGl0eSA6IGRhdGEudmlzaWJpbGl0eTtcbiAgICAgIGRhdGEudmlzaWJpbGl0eSA9IChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IDAuMCk7XG5cbiAgICAgIGNhbGxiYWNrKHsgLi4uZGF0YSwgZW50cnksIGVsZW1lbnQsIGluZGV4OiBpLCBkaXNjb25uZWN0OiAoKSA9PiBvYnNlcnZlci51bm9ic2VydmUoZWxlbWVudCkgfSk7XG5cbiAgICAgIGlmIChkYXRhLnZpc2liaWxpdHkgJiYgIWRhdGEud2FzVmlzaWJsZSlcbiAgICAgICAgZGF0YS53YXNWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG9wdGlvbnMgPSB7XG4gICAgcm9vdDogICAgICAgbnVsbCxcbiAgICB0aHJlc2hvbGQ6ICAwLjAsXG4gICAgLi4uKF9vcHRpb25zIHx8IHt9KSxcbiAgfTtcblxuICBsZXQgb2JzZXJ2ZXIgID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGludGVyc2VjdGlvbkNhbGxiYWNrLCBvcHRpb25zKTtcbiAgbGV0IGVsZW1lbnRzICA9IChfb3B0aW9ucyB8fCB7fSkuZWxlbWVudHMgfHwgW107XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnRzW2ldKTtcblxuICByZXR1cm4gb2JzZXJ2ZXI7XG59XG5cbmNvbnN0IE5PX09CU0VSVkVSID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHdhc1Zpc2libGU6ICAgICAgICAgZmFsc2UsXG4gIHJhdGlvVmlzaWJsZTogICAgICAgMC4wLFxuICB2aXNpYmlsaXR5OiAgICAgICAgIGZhbHNlLFxuICBwcmV2aW91c1Zpc2liaWxpdHk6IGZhbHNlLFxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5TWV0YShlbGVtZW50LCBvYnNlcnZlcikge1xuICBsZXQgZWxlbWVudE9ic2VydmVycyA9IFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsICdfbXl0aGl4VUlJbnRlcnNlY3Rpb25PYnNlcnZlcnMnKTtcbiAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKVxuICAgIHJldHVybiBOT19PQlNFUlZFUjtcblxuICByZXR1cm4gZWxlbWVudE9ic2VydmVycy5nZXQob2JzZXJ2ZXIpIHx8IE5PX09CU0VSVkVSO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtYXBOb2RlVHJlZShub2RlLCBjYWxsYmFjaywgX2luZGV4KSB7XG4gIGlmICghbm9kZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBsZXQgaW5kZXggPSAwO1xuICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpKSB7XG4gICAgbGV0IG5ld05vZGUgPSBjYWxsYmFjayhyZW1hcE5vZGVUcmVlKGNoaWxkTm9kZSwgY2FsbGJhY2ssIGluZGV4KSwgaW5kZXgrKyk7XG4gICAgaWYgKG5ld05vZGUgIT09IGNoaWxkTm9kZSkge1xuICAgICAgaWYgKG5ld05vZGUpXG4gICAgICAgIG5vZGUucmVwbGFjZUNoaWxkKG5ld05vZGUsIGNoaWxkTm9kZSk7XG4gICAgICBlbHNlXG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKF9pbmRleCA9PSBudWxsKSA/IGNhbGxiYWNrKG5vZGUsICAtMSkgOiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVjdXJzaXZlbHlCaW5kRHluYW1pY0RhdGEoY29udGV4dCwgbm9kZSkge1xuICByZXR1cm4gcmVtYXBOb2RlVHJlZShub2RlLCAobm9kZSkgPT4ge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgbGV0IG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgaWYgKG5vZGVWYWx1ZSAmJiBVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUobm9kZVZhbHVlKSlcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKGNvbnRleHQsIG5vZGUpO1xuICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA+PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChub2RlKTtcbiAgICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCk7XG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVOYW1lICAgICAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMClcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZVZhbHVlICYmIFV0aWxzLnN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgYXR0cmlidXRlTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiA9IFN5bWJvbC5mb3IoJy9qb3kvZWxlbWVudERlZmluaXRpb24vY29uc3RhbnRzL3VuZmluaXNoZWQnKTtcblxuY29uc3QgSVNfUFJPUF9OQU1FID0gL15wcm9wXFwkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IodGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKTtcbiAgfVxuXG4gIGJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KSB7XG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyaWJ1dGVzLnZhbHVlIHx8ICcnKTtcbiAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgdGV4dE5vZGUpO1xuICAgICAgcmV0dXJuIHRleHROb2RlO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2VVUkkpXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZ05hbWUpO1xuXG4gICAgY29uc3QgaGFuZGxlQXR0cmlidXRlID0gKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIF9hdHRyaWJ1dGVWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBfYXR0cmlidXRlVmFsdWU7XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQoY29udGV4dCwgZWxlbWVudCwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgIGlmIChVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIGF0dHJpYnV0ZVxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuXG4gICAgICAgICAgLy8gR2V0IGF0dHJpYnV0ZSBub2RlIGp1c3QgY3JlYXRlZFxuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKGNvbnRleHQsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIER5bmFtaWMgYmluZGluZ3MgYXJlIG5vdCBhbGxvd2VkIGZvciBwcm9wZXJ0aWVzXG4gICAgY29uc3QgaGFuZGxlUHJvcGVydHkgPSAoZWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKSA9PiB7XG4gICAgICBsZXQgbmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKElTX1BST1BfTkFNRSwgJycpO1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICBoYW5kbGVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQgY2hpbGQgICAgICAgICA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBsZXQgY2hpbGRFbGVtZW50ICA9IGNoaWxkLmJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY29uc3QgSVNfVEFSR0VUX1BST1AgPSAvXnByb3RvdHlwZXxjb25zdHJ1Y3RvciQvO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIHNjb3BlKSB7XG4gIGlmICghdGFnTmFtZSB8fCAhVXRpbHMuaXNUeXBlKHRhZ05hbWUsICdTdHJpbmcnKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGFuIEVsZW1lbnREZWZpbml0aW9uIHdpdGhvdXQgYSBcInRhZ05hbWVcIi4nKTtcblxuICBjb25zdCBmaW5hbGl6ZXIgPSAoLi4uX2NoaWxkcmVuKSA9PiB7XG4gICAgbGV0IGNoaWxkcmVuID0gX2NoaWxkcmVuLm1hcCgodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKHZhbHVlW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiB2YWx1ZSgpO1xuXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50RGVmaW5pdGlvbilcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICBpZiAoIVV0aWxzLmlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlOiAoJycgKyB2YWx1ZSkgfSk7XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuXG5leHBvcnQgY29uc3QgRUxFTUVOVF9OQU1FUyA9IFtdO1xuY29uc3QgRSA9ICh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcykgPT4ge1xuICBFTEVNRU5UX05BTUVTLnB1c2godGFnTmFtZSk7XG4gIHJldHVybiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcyk7XG59O1xuXG5leHBvcnQgY29uc3QgQSAgICAgICAgICA9IEUoJ2EnKTtcbmV4cG9ydCBjb25zdCBBQkJSICAgICAgID0gRSgnYWJicicpO1xuZXhwb3J0IGNvbnN0IEFERFJFU1MgICAgPSBFKCdhZGRyZXNzJyk7XG5leHBvcnQgY29uc3QgQVJFQSAgICAgICA9IEUoJ2FyZWEnKTtcbmV4cG9ydCBjb25zdCBBUlRJQ0xFICAgID0gRSgnYXJ0aWNsZScpO1xuZXhwb3J0IGNvbnN0IEFTSURFICAgICAgPSBFKCdhc2lkZScpO1xuZXhwb3J0IGNvbnN0IEFVRElPICAgICAgPSBFKCdhdWRpbycpO1xuZXhwb3J0IGNvbnN0IEIgICAgICAgICAgPSBFKCdiJyk7XG5leHBvcnQgY29uc3QgQkFTRSAgICAgICA9IEUoJ2Jhc2UnKTtcbmV4cG9ydCBjb25zdCBCREkgICAgICAgID0gRSgnYmRpJyk7XG5leHBvcnQgY29uc3QgQkRPICAgICAgICA9IEUoJ2JkbycpO1xuZXhwb3J0IGNvbnN0IEJMT0NLUVVPVEUgPSBFKCdibG9ja3F1b3RlJyk7XG5leHBvcnQgY29uc3QgQlIgICAgICAgICA9IEUoJ2JyJyk7XG5leHBvcnQgY29uc3QgQlVUVE9OICAgICA9IEUoJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IENBTlZBUyAgICAgPSBFKCdjYW52YXMnKTtcbmV4cG9ydCBjb25zdCBDQVBUSU9OICAgID0gRSgnY2FwdGlvbicpO1xuZXhwb3J0IGNvbnN0IENJVEUgICAgICAgPSBFKCdjaXRlJyk7XG5leHBvcnQgY29uc3QgQ09ERSAgICAgICA9IEUoJ2NvZGUnKTtcbmV4cG9ydCBjb25zdCBDT0wgICAgICAgID0gRSgnY29sJyk7XG5leHBvcnQgY29uc3QgQ09MR1JPVVAgICA9IEUoJ2NvbGdyb3VwJyk7XG5leHBvcnQgY29uc3QgREFUQSAgICAgICA9IEUoJ2RhdGEnKTtcbmV4cG9ydCBjb25zdCBEQVRBTElTVCAgID0gRSgnZGF0YWxpc3QnKTtcbmV4cG9ydCBjb25zdCBERCAgICAgICAgID0gRSgnZGQnKTtcbmV4cG9ydCBjb25zdCBERUwgICAgICAgID0gRSgnZGVsJyk7XG5leHBvcnQgY29uc3QgREVUQUlMUyAgICA9IEUoJ2RldGFpbHMnKTtcbmV4cG9ydCBjb25zdCBERk4gICAgICAgID0gRSgnZGZuJyk7XG5leHBvcnQgY29uc3QgRElBTE9HICAgICA9IEUoJ2RpYWxvZycpO1xuZXhwb3J0IGNvbnN0IERJViAgICAgICAgPSBFKCdkaXYnKTtcbmV4cG9ydCBjb25zdCBETCAgICAgICAgID0gRSgnZGwnKTtcbmV4cG9ydCBjb25zdCBEVCAgICAgICAgID0gRSgnZHQnKTtcbmV4cG9ydCBjb25zdCBFTSAgICAgICAgID0gRSgnZW0nKTtcbmV4cG9ydCBjb25zdCBFTUJFRCAgICAgID0gRSgnZW1iZWQnKTtcbmV4cG9ydCBjb25zdCBGSUVMRFNFVCAgID0gRSgnZmllbGRzZXQnKTtcbmV4cG9ydCBjb25zdCBGSUdDQVBUSU9OID0gRSgnZmlnY2FwdGlvbicpO1xuZXhwb3J0IGNvbnN0IEZJR1VSRSAgICAgPSBFKCdmaWd1cmUnKTtcbmV4cG9ydCBjb25zdCBGT09URVIgICAgID0gRSgnZm9vdGVyJyk7XG5leHBvcnQgY29uc3QgRk9STSAgICAgICA9IEUoJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBIMSAgICAgICAgID0gRSgnaDEnKTtcbmV4cG9ydCBjb25zdCBIMiAgICAgICAgID0gRSgnaDInKTtcbmV4cG9ydCBjb25zdCBIMyAgICAgICAgID0gRSgnaDMnKTtcbmV4cG9ydCBjb25zdCBINCAgICAgICAgID0gRSgnaDQnKTtcbmV4cG9ydCBjb25zdCBINSAgICAgICAgID0gRSgnaDUnKTtcbmV4cG9ydCBjb25zdCBINiAgICAgICAgID0gRSgnaDYnKTtcbmV4cG9ydCBjb25zdCBIRUFERVIgICAgID0gRSgnaGVhZGVyJyk7XG5leHBvcnQgY29uc3QgSEdST1VQICAgICA9IEUoJ2hncm91cCcpO1xuZXhwb3J0IGNvbnN0IEhSICAgICAgICAgPSBFKCdocicpO1xuZXhwb3J0IGNvbnN0IEkgICAgICAgICAgPSBFKCdpJyk7XG5leHBvcnQgY29uc3QgSUZSQU1FICAgICA9IEUoJ2lmcmFtZScpO1xuZXhwb3J0IGNvbnN0IElNRyAgICAgICAgPSBFKCdpbWcnKTtcbmV4cG9ydCBjb25zdCBJTlBVVCAgICAgID0gRSgnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBJTlMgICAgICAgID0gRSgnaW5zJyk7XG5leHBvcnQgY29uc3QgS0JEICAgICAgICA9IEUoJ2tiZCcpO1xuZXhwb3J0IGNvbnN0IExBQkVMICAgICAgPSBFKCdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IExFR0VORCAgICAgPSBFKCdsZWdlbmQnKTtcbmV4cG9ydCBjb25zdCBMSSAgICAgICAgID0gRSgnbGknKTtcbmV4cG9ydCBjb25zdCBMSU5LICAgICAgID0gRSgnbGluaycpO1xuZXhwb3J0IGNvbnN0IE1BSU4gICAgICAgPSBFKCdtYWluJyk7XG5leHBvcnQgY29uc3QgTUFQICAgICAgICA9IEUoJ21hcCcpO1xuZXhwb3J0IGNvbnN0IE1BUksgICAgICAgPSBFKCdtYXJrJyk7XG5leHBvcnQgY29uc3QgTUVOVSAgICAgICA9IEUoJ21lbnUnKTtcbmV4cG9ydCBjb25zdCBNRVRBICAgICAgID0gRSgnbWV0YScpO1xuZXhwb3J0IGNvbnN0IE1FVEVSICAgICAgPSBFKCdtZXRlcicpO1xuZXhwb3J0IGNvbnN0IE5BViAgICAgICAgPSBFKCduYXYnKTtcbmV4cG9ydCBjb25zdCBOT1NDUklQVCAgID0gRSgnbm9zY3JpcHQnKTtcbmV4cG9ydCBjb25zdCBPQkpFQ1QgICAgID0gRSgnb2JqZWN0Jyk7XG5leHBvcnQgY29uc3QgT0wgICAgICAgICA9IEUoJ29sJyk7XG5leHBvcnQgY29uc3QgT1BUR1JPVVAgICA9IEUoJ29wdGdyb3VwJyk7XG5leHBvcnQgY29uc3QgT1BUSU9OICAgICA9IEUoJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IE9VVFBVVCAgICAgPSBFKCdvdXRwdXQnKTtcbmV4cG9ydCBjb25zdCBQICAgICAgICAgID0gRSgncCcpO1xuZXhwb3J0IGNvbnN0IFBJQ1RVUkUgICAgPSBFKCdwaWN0dXJlJyk7XG5leHBvcnQgY29uc3QgUFJFICAgICAgICA9IEUoJ3ByZScpO1xuZXhwb3J0IGNvbnN0IFBST0dSRVNTICAgPSBFKCdwcm9ncmVzcycpO1xuZXhwb3J0IGNvbnN0IFEgICAgICAgICAgPSBFKCdxJyk7XG5leHBvcnQgY29uc3QgUlAgICAgICAgICA9IEUoJ3JwJyk7XG5leHBvcnQgY29uc3QgUlQgICAgICAgICA9IEUoJ3J0Jyk7XG5leHBvcnQgY29uc3QgUlVCWSAgICAgICA9IEUoJ3J1YnknKTtcbmV4cG9ydCBjb25zdCBTICAgICAgICAgID0gRSgncycpO1xuZXhwb3J0IGNvbnN0IFNBTVAgICAgICAgPSBFKCdzYW1wJyk7XG5leHBvcnQgY29uc3QgU0NSSVBUICAgICA9IEUoJ3NjcmlwdCcpO1xuZXhwb3J0IGNvbnN0IFNFQ1RJT04gICAgPSBFKCdzZWN0aW9uJyk7XG5leHBvcnQgY29uc3QgU0VMRUNUICAgICA9IEUoJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IFNMT1QgICAgICAgPSBFKCdzbG90Jyk7XG5leHBvcnQgY29uc3QgU01BTEwgICAgICA9IEUoJ3NtYWxsJyk7XG5leHBvcnQgY29uc3QgU09VUkNFICAgICA9IEUoJ3NvdXJjZScpO1xuZXhwb3J0IGNvbnN0IFNQQU4gICAgICAgPSBFKCdzcGFuJyk7XG5leHBvcnQgY29uc3QgU1RST05HICAgICA9IEUoJ3N0cm9uZycpO1xuZXhwb3J0IGNvbnN0IFNUWUxFICAgICAgPSBFKCdzdHlsZScpO1xuZXhwb3J0IGNvbnN0IFNVQiAgICAgICAgPSBFKCdzdWInKTtcbmV4cG9ydCBjb25zdCBTVU1NQVJZICAgID0gRSgnc3VtbWFyeScpO1xuZXhwb3J0IGNvbnN0IFNVUCAgICAgICAgPSBFKCdzdXAnKTtcbmV4cG9ydCBjb25zdCBUQUJMRSAgICAgID0gRSgndGFibGUnKTtcbmV4cG9ydCBjb25zdCBUQk9EWSAgICAgID0gRSgndGJvZHknKTtcbmV4cG9ydCBjb25zdCBURCAgICAgICAgID0gRSgndGQnKTtcbmV4cG9ydCBjb25zdCBURU1QTEFURSAgID0gRSgndGVtcGxhdGUnKTtcbmV4cG9ydCBjb25zdCBURVhUQVJFQSAgID0gRSgndGV4dGFyZWEnKTtcbmV4cG9ydCBjb25zdCBURk9PVCAgICAgID0gRSgndGZvb3QnKTtcbmV4cG9ydCBjb25zdCBUSCAgICAgICAgID0gRSgndGgnKTtcbmV4cG9ydCBjb25zdCBUSEVBRCAgICAgID0gRSgndGhlYWQnKTtcbmV4cG9ydCBjb25zdCBUSU1FICAgICAgID0gRSgndGltZScpO1xuZXhwb3J0IGNvbnN0IFRJVExFICAgICAgPSBFKCd0aXRsZScpO1xuZXhwb3J0IGNvbnN0IFRSICAgICAgICAgPSBFKCd0cicpO1xuZXhwb3J0IGNvbnN0IFRSQUNLICAgICAgPSBFKCd0cmFjaycpO1xuZXhwb3J0IGNvbnN0IFUgICAgICAgICAgPSBFKCd1Jyk7XG5leHBvcnQgY29uc3QgVUwgICAgICAgICA9IEUoJ3VsJyk7XG5leHBvcnQgY29uc3QgVkFSICAgICAgICA9IEUoJ3ZhcicpO1xuZXhwb3J0IGNvbnN0IFZJREVPICAgICAgPSBFKCd2aWRlbycpO1xuZXhwb3J0IGNvbnN0IFdCUiAgICAgICAgPSBFKCd3YnInKTtcblxuZXhwb3J0IGNvbnN0IFNWR19FTEVNRU5UX05BTUVTID0gW107XG5cbmNvbnN0IFNFID0gKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKSA9PiB7XG4gIFNWR19FTEVNRU5UX05BTUVTLnB1c2godGFnTmFtZSk7XG4gIHJldHVybiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcyk7XG59O1xuXG4vLyBTVkcgZWxlbWVudCBuYW1lc1xuZXhwb3J0IGNvbnN0IEFMVEdMWVBIICAgICAgICAgICAgID0gU0UoJ2FsdGdseXBoJyk7XG5leHBvcnQgY29uc3QgQUxUR0xZUEhERUYgICAgICAgICAgPSBTRSgnYWx0Z2x5cGhkZWYnKTtcbmV4cG9ydCBjb25zdCBBTFRHTFlQSElURU0gICAgICAgICA9IFNFKCdhbHRnbHlwaGl0ZW0nKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFICAgICAgICAgICAgICA9IFNFKCdhbmltYXRlJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURUNPTE9SICAgICAgICAgPSBTRSgnYW5pbWF0ZUNvbG9yJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURU1PVElPTiAgICAgICAgPSBTRSgnYW5pbWF0ZU1vdGlvbicpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVEVUUkFOU0ZPUk0gICAgID0gU0UoJ2FuaW1hdGVUcmFuc2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT04gICAgICAgICAgICA9IFNFKCdhbmltYXRpb24nKTtcbmV4cG9ydCBjb25zdCBDSVJDTEUgICAgICAgICAgICAgICA9IFNFKCdjaXJjbGUnKTtcbmV4cG9ydCBjb25zdCBDTElQUEFUSCAgICAgICAgICAgICA9IFNFKCdjbGlwUGF0aCcpO1xuZXhwb3J0IGNvbnN0IENPTE9SUFJPRklMRSAgICAgICAgID0gU0UoJ2NvbG9yUHJvZmlsZScpO1xuZXhwb3J0IGNvbnN0IENVUlNPUiAgICAgICAgICAgICAgID0gU0UoJ2N1cnNvcicpO1xuZXhwb3J0IGNvbnN0IERFRlMgICAgICAgICAgICAgICAgID0gU0UoJ2RlZnMnKTtcbmV4cG9ydCBjb25zdCBERVNDICAgICAgICAgICAgICAgICA9IFNFKCdkZXNjJyk7XG5leHBvcnQgY29uc3QgRElTQ0FSRCAgICAgICAgICAgICAgPSBTRSgnZGlzY2FyZCcpO1xuZXhwb3J0IGNvbnN0IEVMTElQU0UgICAgICAgICAgICAgID0gU0UoJ2VsbGlwc2UnKTtcbmV4cG9ydCBjb25zdCBGRUJMRU5EICAgICAgICAgICAgICA9IFNFKCdmZWJsZW5kJyk7XG5leHBvcnQgY29uc3QgRkVDT0xPUk1BVFJJWCAgICAgICAgPSBTRSgnZmVjb2xvcm1hdHJpeCcpO1xuZXhwb3J0IGNvbnN0IEZFQ09NUE9ORU5UVFJBTlNGRVIgID0gU0UoJ2ZlY29tcG9uZW50dHJhbnNmZXInKTtcbmV4cG9ydCBjb25zdCBGRUNPTVBPU0lURSAgICAgICAgICA9IFNFKCdmZWNvbXBvc2l0ZScpO1xuZXhwb3J0IGNvbnN0IEZFQ09OVk9MVkVNQVRSSVggICAgID0gU0UoJ2ZlY29udm9sdmVtYXRyaXgnKTtcbmV4cG9ydCBjb25zdCBGRURJRkZVU0VMSUdIVElORyAgICA9IFNFKCdmZWRpZmZ1c2VsaWdodGluZycpO1xuZXhwb3J0IGNvbnN0IEZFRElTUExBQ0VNRU5UTUFQICAgID0gU0UoJ2ZlZGlzcGxhY2VtZW50bWFwJyk7XG5leHBvcnQgY29uc3QgRkVESVNUQU5UTElHSFQgICAgICAgPSBTRSgnZmVkaXN0YW50bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRURST1BTSEFET1cgICAgICAgICA9IFNFKCdmZWRyb3BzaGFkb3cnKTtcbmV4cG9ydCBjb25zdCBGRUZMT09EICAgICAgICAgICAgICA9IFNFKCdmZWZsb29kJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DQSAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jYScpO1xuZXhwb3J0IGNvbnN0IEZFRlVOQ0IgICAgICAgICAgICAgID0gU0UoJ2ZlZnVuY2InKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNHICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNnJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DUiAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jcicpO1xuZXhwb3J0IGNvbnN0IEZFR0FVU1NJQU5CTFVSICAgICAgID0gU0UoJ2ZlZ2F1c3NpYW5ibHVyJyk7XG5leHBvcnQgY29uc3QgRkVJTUFHRSAgICAgICAgICAgICAgPSBTRSgnZmVpbWFnZScpO1xuZXhwb3J0IGNvbnN0IEZFTUVSR0UgICAgICAgICAgICAgID0gU0UoJ2ZlbWVyZ2UnKTtcbmV4cG9ydCBjb25zdCBGRU1FUkdFTk9ERSAgICAgICAgICA9IFNFKCdmZW1lcmdlbm9kZScpO1xuZXhwb3J0IGNvbnN0IEZFTU9SUEhPTE9HWSAgICAgICAgID0gU0UoJ2ZlbW9ycGhvbG9neScpO1xuZXhwb3J0IGNvbnN0IEZFT0ZGU0VUICAgICAgICAgICAgID0gU0UoJ2Zlb2Zmc2V0Jyk7XG5leHBvcnQgY29uc3QgRkVQT0lOVExJR0hUICAgICAgICAgPSBTRSgnZmVwb2ludGxpZ2h0Jyk7XG5leHBvcnQgY29uc3QgRkVTUEVDVUxBUkxJR0hUSU5HICAgPSBTRSgnZmVzcGVjdWxhcmxpZ2h0aW5nJyk7XG5leHBvcnQgY29uc3QgRkVTUE9UTElHSFQgICAgICAgICAgPSBTRSgnZmVzcG90bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRVRJTEUgICAgICAgICAgICAgICA9IFNFKCdmZXRpbGUnKTtcbmV4cG9ydCBjb25zdCBGRVRVUkJVTEVOQ0UgICAgICAgICA9IFNFKCdmZXR1cmJ1bGVuY2UnKTtcbmV4cG9ydCBjb25zdCBGSUxURVIgICAgICAgICAgICAgICA9IFNFKCdmaWx0ZXInKTtcbmV4cG9ydCBjb25zdCBGT05UICAgICAgICAgICAgICAgICA9IFNFKCdmb250Jyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0UgICAgICAgICAgICAgPSBTRSgnZm9udEZhY2UnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRUZPUk1BVCAgICAgICA9IFNFKCdmb250RmFjZUZvcm1hdCcpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFTkFNRSAgICAgICAgID0gU0UoJ2ZvbnRGYWNlTmFtZScpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFU1JDICAgICAgICAgID0gU0UoJ2ZvbnRGYWNlU3JjJyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VVUkkgICAgICAgICAgPSBTRSgnZm9udEZhY2VVcmknKTtcbmV4cG9ydCBjb25zdCBGT1JFSUdOT0JKRUNUICAgICAgICA9IFNFKCdmb3JlaWduT2JqZWN0Jyk7XG5leHBvcnQgY29uc3QgRyAgICAgICAgICAgICAgICAgICAgPSBTRSgnZycpO1xuZXhwb3J0IGNvbnN0IEdMWVBIICAgICAgICAgICAgICAgID0gU0UoJ2dseXBoJyk7XG5leHBvcnQgY29uc3QgR0xZUEhSRUYgICAgICAgICAgICAgPSBTRSgnZ2x5cGhSZWYnKTtcbmV4cG9ydCBjb25zdCBIQU5ETEVSICAgICAgICAgICAgICA9IFNFKCdoYW5kbGVyJyk7XG5leHBvcnQgY29uc3QgSEtFUk4gICAgICAgICAgICAgICAgPSBTRSgnaEtlcm4nKTtcbmV4cG9ydCBjb25zdCBJTUFHRSAgICAgICAgICAgICAgICA9IFNFKCdpbWFnZScpO1xuZXhwb3J0IGNvbnN0IExJTkUgICAgICAgICAgICAgICAgID0gU0UoJ2xpbmUnKTtcbmV4cG9ydCBjb25zdCBMSU5FQVJHUkFESUVOVCAgICAgICA9IFNFKCdsaW5lYXJncmFkaWVudCcpO1xuZXhwb3J0IGNvbnN0IExJU1RFTkVSICAgICAgICAgICAgID0gU0UoJ2xpc3RlbmVyJyk7XG5leHBvcnQgY29uc3QgTUFSS0VSICAgICAgICAgICAgICAgPSBTRSgnbWFya2VyJyk7XG5leHBvcnQgY29uc3QgTUFTSyAgICAgICAgICAgICAgICAgPSBTRSgnbWFzaycpO1xuZXhwb3J0IGNvbnN0IE1FVEFEQVRBICAgICAgICAgICAgID0gU0UoJ21ldGFkYXRhJyk7XG5leHBvcnQgY29uc3QgTUlTU0lOR0dMWVBIICAgICAgICAgPSBTRSgnbWlzc2luZ0dseXBoJyk7XG5leHBvcnQgY29uc3QgTVBBVEggICAgICAgICAgICAgICAgPSBTRSgnbVBhdGgnKTtcbmV4cG9ydCBjb25zdCBQQVRIICAgICAgICAgICAgICAgICA9IFNFKCdwYXRoJyk7XG5leHBvcnQgY29uc3QgUEFUVEVSTiAgICAgICAgICAgICAgPSBTRSgncGF0dGVybicpO1xuZXhwb3J0IGNvbnN0IFBPTFlHT04gICAgICAgICAgICAgID0gU0UoJ3BvbHlnb24nKTtcbmV4cG9ydCBjb25zdCBQT0xZTElORSAgICAgICAgICAgICA9IFNFKCdwb2x5bGluZScpO1xuZXhwb3J0IGNvbnN0IFBSRUZFVENIICAgICAgICAgICAgID0gU0UoJ3ByZWZldGNoJyk7XG5leHBvcnQgY29uc3QgUkFESUFMR1JBRElFTlQgICAgICAgPSBTRSgncmFkaWFsZ3JhZGllbnQnKTtcbmV4cG9ydCBjb25zdCBSRUNUICAgICAgICAgICAgICAgICA9IFNFKCdyZWN0Jyk7XG5leHBvcnQgY29uc3QgU0VUICAgICAgICAgICAgICAgICAgPSBTRSgnc2V0Jyk7XG5leHBvcnQgY29uc3QgU09MSURDT0xPUiAgICAgICAgICAgPSBTRSgnc29saWRDb2xvcicpO1xuZXhwb3J0IGNvbnN0IFNUT1AgICAgICAgICAgICAgICAgID0gU0UoJ3N0b3AnKTtcbmV4cG9ydCBjb25zdCBTVkcgICAgICAgICAgICAgICAgICA9IFNFKCdzdmcnKTtcbmV4cG9ydCBjb25zdCBTV0lUQ0ggICAgICAgICAgICAgICA9IFNFKCdzd2l0Y2gnKTtcbmV4cG9ydCBjb25zdCBTWU1CT0wgICAgICAgICAgICAgICA9IFNFKCdzeW1ib2wnKTtcbmV4cG9ydCBjb25zdCBUQlJFQUsgICAgICAgICAgICAgICA9IFNFKCd0YnJlYWsnKTtcbmV4cG9ydCBjb25zdCBURVhUICAgICAgICAgICAgICAgICA9IFNFKCd0ZXh0Jyk7XG5leHBvcnQgY29uc3QgVEVYVFBBVEggICAgICAgICAgICAgPSBTRSgndGV4dHBhdGgnKTtcbmV4cG9ydCBjb25zdCBUUkVGICAgICAgICAgICAgICAgICA9IFNFKCd0cmVmJyk7XG5leHBvcnQgY29uc3QgVFNQQU4gICAgICAgICAgICAgICAgPSBTRSgndHNwYW4nKTtcbmV4cG9ydCBjb25zdCBVTktOT1dOICAgICAgICAgICAgICA9IFNFKCd1bmtub3duJyk7XG5leHBvcnQgY29uc3QgVVNFICAgICAgICAgICAgICAgICAgPSBTRSgndXNlJyk7XG5leHBvcnQgY29uc3QgVklFVyAgICAgICAgICAgICAgICAgPSBTRSgndmlldycpO1xuZXhwb3J0IGNvbnN0IFZLRVJOICAgICAgICAgICAgICAgID0gU0UoJ3ZLZXJuJyk7XG5cbmNvbnN0IFNWR19SRSA9IG5ldyBSZWdFeHAoYF4oJHtTVkdfRUxFTUVOVF9OQU1FUy5qb2luKCd8Jyl9KSRgLCAnaScpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KHRhZ05hbWUpIHtcbiAgcmV0dXJuIFNWR19SRS50ZXN0KHRhZ05hbWUpO1xufVxuIiwiaW1wb3J0ICogYXMgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJUmVxdWlyZSBleHRlbmRzIENvbXBvbmVudC5NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQge1xuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBjYWNoZWQsXG4gICAgICB9ID0gYXdhaXQgQ29tcG9uZW50LnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXNIYW5kbGVkICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1yZXF1aXJlXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKCkge1xuICAgIC8vIE5PT1BcbiAgfVxufVxuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlSZXF1aXJlO1xuXG5pZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiAhY3VzdG9tRWxlbWVudHMuZ2V0KCdteXRoaXgtcmVxdWlyZScpKVxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoJ215dGhpeC1yZXF1aXJlJywgTXl0aGl4VUlSZXF1aXJlKTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsZXQgZWxlbWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW15dGhpeC1zcmNdJykpO1xuICAgIENvbXBvbmVudC52aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgZGlzY29ubmVjdCwgZWxlbWVudCwgd2FzVmlzaWJsZSB9KSA9PiB7XG4gICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpO1xuICAgICAgaWYgKCFzcmMpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgUmVzb3VyY2UgKGZvciBuYXRpdmUgZWxlbWVudCk6ICcsIHNyYyk7XG4gICAgICBDb21wb25lbnQubG9hZFBhcnRpYWxJbnRvRWxlbWVudC5jYWxsKGVsZW1lbnQsIHNyYyk7XG4gICAgfSwgeyBlbGVtZW50cyB9KTtcbiAgfSk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG4vKlxuTWFueSB0aGFua3MgdG8gU2FnZWUgQ29ud2F5IGZvciB0aGUgZm9sbG93aW5nIENTUyBzcGlubmVyc1xuaHR0cHM6Ly9jb2RlcGVuLmlvL3NhY29ud2F5L3Blbi92WUtZeXJ4XG4qL1xuXG5jb25zdCBTVFlMRV9TSEVFVCA9XG5gXG46aG9zdCB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogMWVtO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG46aG9zdCguc21hbGwpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDAuNzUpO1xufVxuOmhvc3QoLm1lZGl1bSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMS41KTtcbn1cbjpob3N0KC5sYXJnZSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMyk7XG59XG4uc3Bpbm5lci1pdGVtLFxuLnNwaW5uZXItaXRlbTo6YmVmb3JlLFxuLnNwaW5uZXItaXRlbTo6YWZ0ZXIge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNjAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMjUpO1xuICB9XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMik7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3M6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjA3NSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGJvcmRlcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1sZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMS4wKTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgKiAwLjA3NSkgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci1ib3R0b206IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjg3NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMykge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSkgcm90YXRlKDQ1ZGVnKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyLjUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlcjogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEge1xuICAwJSwgOC4zMyUsIDE2LjY2JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNC45OSUsIDMzLjMyJSwgNDEuNjUlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwJSk7XG4gIH1cbiAgNDkuOTglLCA1OC4zMSUsIDY2LjY0JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMTAwJSk7XG4gIH1cbiAgNzQuOTclLCA4My4zMCUsIDkxLjYzJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyB7XG4gIDAlLCA4My4zMCUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCk7XG4gIH1cbiAgOC4zMyUsIDE2LjY2JSwgMjQuOTklIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG4gIH1cbiAgMzMuMzIlLCA0MS42NSUsIDQ5Ljk4JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIC0xMDAlKTtcbiAgfVxuICA1OC4zMSUsIDY2LjY0JSwgNzQuOTclIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gNCk7XG4gIG1pbi13aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg3NSUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03NSUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDQwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24ge1xuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDIpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAyKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSAvIC0yKTtcbn1cbmA7XG5cbmNvbnN0IEtJTkRTID0ge1xuICAnYXVkaW8nOiAgNSxcbiAgJ2NpcmNsZSc6IDMsXG4gICdkb3QnOiAgICAyLFxuICAncGlwZSc6ICAgNSxcbiAgJ3B1enpsZSc6IDMsXG4gICd3YXZlJzogICAzLFxufTtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJU3Bpbm5lciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgICAgICAgICAgICA9ICdteXRoaXgtc3Bpbm5lcic7XG4gIHN0YXRpYyBvYnNlcnZlZEF0dHJpYnV0ZXMgPSBbICdraW5kJyBdO1xuXG4gIGF0dHJpYnV0ZUNoYW5nZWQobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKG5hbWUgIT09ICdraW5kJylcbiAgICAgIHJldHVybjtcblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShuZXdWYWx1ZSk7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIGlmICghdGhpcy5kb2N1bWVudEluaXRpYWxpemVkKSB7XG4gICAgICAvLyBhcHBlbmQgdGVtcGxhdGVcbiAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgdGhpcy5idWlsZCgoeyBURU1QTEFURSB9KSA9PiB7XG4gICAgICAgIHJldHVybiBURU1QTEFURVxuICAgICAgICAgIC5kYXRhTXl0aGl4TmFtZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpXG4gICAgICAgICAgLnByb3AkaW5uZXJIVE1MKGA8c3R5bGU+JHtTVFlMRV9TSEVFVH08L3N0eWxlPmApO1xuICAgICAgfSkuYXBwZW5kVG8ob3duZXJEb2N1bWVudC5ib2R5KTtcblxuICAgICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKTtcbiAgICAgIHRoaXMuYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgbGV0IGtpbmQgPSB0aGlzLmdldEF0dHJpYnV0ZSgna2luZCcpO1xuICAgIGlmICgha2luZCkge1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdraW5kJywga2luZCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKGtpbmQpO1xuICB9XG5cbiAgaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShfa2luZCkge1xuICAgIGxldCBraW5kICAgICAgICA9ICgnJyArIF9raW5kKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKEtJTkRTLCBraW5kKSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1zcGlubmVyXCIgdW5rbm93biBcImtpbmRcIiBwcm92aWRlZDogXCIke2tpbmR9XCIuIFN1cHBvcnRlZCBcImtpbmRcIiBhdHRyaWJ1dGUgdmFsdWVzIGFyZTogXCJwaXBlXCIsIFwiYXVkaW9cIiwgXCJjaXJjbGVcIiwgXCJwdXp6bGVcIiwgXCJ3YXZlXCIsIGFuZCBcImRvdFwiLmApO1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5nZVNwaW5uZXJDaGlsZHJlbihLSU5EU1traW5kXSk7XG4gIH1cblxuICBidWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIGxldCBjaGlsZHJlbiAgICAgID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3Bpbm5lci1pdGVtJyk7XG5cbiAgICAgIGNoaWxkcmVuW2ldID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kKGNoaWxkcmVuKTtcbiAgfVxuXG4gIGNoYW5nZVNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIHRoaXMuJCgnLnNwaW5uZXItaXRlbScpLnJlbW92ZSgpO1xuICAgIHRoaXMuYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpLmFwcGVuZFRvKHRoaXMuc2hhZG93KTtcblxuICAgIC8vIEFsd2F5cyBhcHBlbmQgc3R5bGUgYWdhaW4sIHNvXG4gICAgLy8gdGhhdCBpdCBpcyB0aGUgbGFzdCBjaGlsZCwgYW5kXG4gICAgLy8gZG9lc24ndCBtZXNzIHdpdGggXCJudGgtY2hpbGRcIlxuICAgIC8vIHNlbGVjdG9yc1xuICAgIHRoaXMuJCgnc3R5bGUnKS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG4gIH1cbn1cblxuTXl0aGl4VUlTcGlubmVyLnJlZ2lzdGVyKCk7XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVNwaW5uZXI7XG4iLCJpbXBvcnQgKiBhcyBVdGlscyAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmltcG9ydCB7XG4gIEVsZW1lbnREZWZpbml0aW9uLFxuICBVTkZJTklTSEVEX0RFRklOSVRJT04sXG59IGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19JTlRFR0VSID0gL15cXGQrJC87XG5cbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBXZSBoYXZlIGFuIEVsZW1lbnQgb3IgYSBEb2N1bWVudFxuICBpZiAodmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzU2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGlzTm90U2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gIWVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2xhc3NOYW1lcyguLi5hcmdzKSB7XG4gIGxldCBjbGFzc05hbWVzID0gW10uY29uY2F0KC4uLmFyZ3MpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5tYXAoKHBhcnQpID0+ICgnJyArIHBhcnQpLnNwbGl0KC9cXHMrLykpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcmV0dXJuIGNsYXNzTmFtZXM7XG59XG5cbmV4cG9ydCBjbGFzcyBRdWVyeUVuZ2luZSB7XG4gIHN0YXRpYyBpc0VsZW1lbnQgICAgPSBpc0VsZW1lbnQ7XG4gIHN0YXRpYyBpc1Nsb3R0ZWQgICAgPSBpc1Nsb3R0ZWQ7XG4gIHN0YXRpYyBpc05vdFNsb3R0ZWQgPSBpc05vdFNsb3R0ZWQ7XG5cbiAgc3RhdGljIGZyb20gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShbXSwgeyByb290OiAoaXNFbGVtZW50KHRoaXMpKSA/IHRoaXMgOiBkb2N1bWVudCwgY29udGV4dDogdGhpcyB9KTtcblxuICAgIGNvbnN0IGdldE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBsZXQgYmFzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKGJhc2UsIGFyZ3NbYXJnSW5kZXgrK10pO1xuXG4gICAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleF0uZ2V0T3B0aW9ucygpIHx8IHt9LCBiYXNlKTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJvb3RFbGVtZW50ID0gKG9wdGlvbnNSb290KSA9PiB7XG4gICAgICBpZiAoaXNFbGVtZW50KG9wdGlvbnNSb290KSlcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNSb290O1xuXG4gICAgICBpZiAoaXNFbGVtZW50KHRoaXMpKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgcmV0dXJuICgodGhpcyAmJiB0aGlzLm93bmVyRG9jdW1lbnQpIHx8IGRvY3VtZW50KTtcbiAgICB9O1xuXG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IGdldE9wdGlvbnMoKTtcbiAgICBsZXQgcm9vdCAgICAgID0gZ2V0Um9vdEVsZW1lbnQob3B0aW9ucy5yb290KTtcbiAgICBsZXQgcXVlcnlFbmdpbmU7XG5cbiAgICBvcHRpb25zLnJvb3QgPSByb290O1xuICAgIG9wdGlvbnMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCB8fCB0aGlzO1xuXG4gICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLnNsaWNlKCksIG9wdGlvbnMpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1thcmdJbmRleF0pKSB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXggKyAxXSwgJ0Z1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzWzFdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdTdHJpbmcnKSkge1xuICAgICAgb3B0aW9ucy5zZWxlY3RvciA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocm9vdC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ0Z1bmN0aW9uJykpIHtcbiAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5jYWxsYmFjay5jYWxsKHRoaXMsIEVsZW1lbnRzLCBvcHRpb25zKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKVxuICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyZXN1bHQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmludm9rZUNhbGxiYWNrcyAhPT0gZmFsc2UgJiYgdHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gcXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9O1xuXG4gIGdldEVuZ2luZUNsYXNzKCkge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnX215dGhpeFVJT3B0aW9ucyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvcHRpb25zLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlFbGVtZW50cyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKG9wdGlvbnMuY29udGV4dCwgZWxlbWVudHMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCByb290UHJveHkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BOYW1lID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2xlbmd0aCcpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAncHJvdG90eXBlJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjb25zdHJ1Y3RvcicpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5jb25zdHJ1Y3RvcjtcblxuICAgICAgICAvLyBJbmRleCBsb29rdXBcbiAgICAgICAgaWYgKElTX0lOVEVHRVIudGVzdChwcm9wTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgLy8gUmVkaXJlY3QgYW55IGFycmF5IG1ldGhvZHNcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGVbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgICA9IHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cztcbiAgICAgICAgICAgIGxldCByZXN1bHQgID0gYXJyYXlbcHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5ldmVyeSgoaXRlbSkgPT4gVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uLCBOb2RlLCBRdWVyeUVuZ2luZSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sIE5vZGUpKVxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgaWYgKGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgaXRlbSA9IGl0ZW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIGl0ZW0gPSBFbGVtZW50cy5UZXJtKGl0ZW0pO1xuICAgICAgZWxzZSBpZiAoIVV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKCFjb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImNvbnRleHRcIiBvcHRpb24gZm9yIFF1ZXJ5RW5naW5lIGlzIHJlcXVpcmVkIHdoZW4gY29uc3RydWN0aW5nIGVsZW1lbnRzLicpO1xuXG4gICAgICByZXR1cm4gaXRlbS5idWlsZCh0aGlzLmdldE93bmVyRG9jdW1lbnQoKSwgY29udGV4dCk7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChmaW5hbEVsZW1lbnRzKSk7XG4gIH1cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IGFyZ3NbYXJnSW5kZXgrK10gOiB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZXh0ICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQuJCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQuJC5jYWxsKG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIEVuZ2luZUNsYXNzLmZyb20uY2FsbChvcHRpb25zLmNvbnRleHQgfHwgdGhpcywgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICB9XG5cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICB5aWVsZChbaSwgZWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gICprZXlzKCkge1xuICAgIGZvciAobGV0IFsga2V5LCBfIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCBrZXk7XG4gIH1cblxuICAqdmFsdWVzKCkge1xuICAgIGZvciAobGV0IFsgXywgdmFsdWUgXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIHZhbHVlO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB5aWVsZCAqdGhpcy52YWx1ZXMoKTtcbiAgfVxuXG4gIGZpcnN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICdOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLiQoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzWzBdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuJCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSkpO1xuICB9XG5cbiAgbGFzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy4kKFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1t0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCAtIDFdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuJCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG5cbiAgaW5zZXJ0SW50byhzZWxlY3Rvck9yRWxlbWVudCwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmdldE93bmVyRG9jdW1lbnQoKTtcbiAgICBsZXQgc291cmNlICAgICAgICA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblxuICAgICAgc291cmNlID0gWyBmcmFnbWVudCBdO1xuICAgIH1cblxuICAgIGVsZW1lbnQuaW5zZXJ0KHNvdXJjZVswXSwgcmVmZXJlbmNlTm9kZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlcGxhY2VDaGlsZHJlbk9mKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5RdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gU0hBMjU2KF9pbnB1dCkge1xuICBsZXQgaW5wdXQgPSBfaW5wdXQ7XG5cbiAgbGV0IG1hdGhQb3cgPSBNYXRoLnBvdztcbiAgbGV0IG1heFdvcmQgPSBtYXRoUG93KDIsIDMyKTtcbiAgbGV0IGxlbmd0aFByb3BlcnR5ID0gJ2xlbmd0aCc7XG4gIGxldCBpOyBsZXQgajsgLy8gVXNlZCBhcyBhIGNvdW50ZXIgYWNyb3NzIHRoZSB3aG9sZSBmaWxlXG4gIGxldCByZXN1bHQgPSAnJztcblxuICBsZXQgd29yZHMgPSBbXTtcbiAgbGV0IGFzY2lpQml0TGVuZ3RoID0gaW5wdXRbbGVuZ3RoUHJvcGVydHldICogODtcblxuICAvLyogY2FjaGluZyByZXN1bHRzIGlzIG9wdGlvbmFsIC0gcmVtb3ZlL2FkZCBzbGFzaCBmcm9tIGZyb250IG9mIHRoaXMgbGluZSB0byB0b2dnbGVcbiAgLy8gSW5pdGlhbCBoYXNoIHZhbHVlOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBzcXVhcmUgcm9vdHMgb2YgdGhlIGZpcnN0IDggcHJpbWVzXG4gIC8vICh3ZSBhY3R1YWxseSBjYWxjdWxhdGUgdGhlIGZpcnN0IDY0LCBidXQgZXh0cmEgdmFsdWVzIGFyZSBqdXN0IGlnbm9yZWQpXG4gIGxldCBoYXNoID0gU0hBMjU2LmggPSBTSEEyNTYuaCB8fCBbXTtcbiAgLy8gUm91bmQgY29uc3RhbnRzOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBjdWJlIHJvb3RzIG9mIHRoZSBmaXJzdCA2NCBwcmltZXNcbiAgbGV0IGsgPSBTSEEyNTYuayA9IFNIQTI1Ni5rIHx8IFtdO1xuICBsZXQgcHJpbWVDb3VudGVyID0ga1tsZW5ndGhQcm9wZXJ0eV07XG4gIC8qL1xuICAgIGxldCBoYXNoID0gW10sIGsgPSBbXTtcbiAgICBsZXQgcHJpbWVDb3VudGVyID0gMDtcbiAgICAvLyovXG5cbiAgbGV0IGlzQ29tcG9zaXRlID0ge307XG4gIGZvciAobGV0IGNhbmRpZGF0ZSA9IDI7IHByaW1lQ291bnRlciA8IDY0OyBjYW5kaWRhdGUrKykge1xuICAgIGlmICghaXNDb21wb3NpdGVbY2FuZGlkYXRlXSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IDMxMzsgaSArPSBjYW5kaWRhdGUpXG4gICAgICAgIGlzQ29tcG9zaXRlW2ldID0gY2FuZGlkYXRlO1xuXG4gICAgICBoYXNoW3ByaW1lQ291bnRlcl0gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDAuNSkgKiBtYXhXb3JkKSB8IDA7XG4gICAgICBrW3ByaW1lQ291bnRlcisrXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMSAvIDMpICogbWF4V29yZCkgfCAwO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0ICs9ICdcXHg4MCc7IC8vIEFwcGVuZCDGhycgYml0IChwbHVzIHplcm8gcGFkZGluZylcbiAgd2hpbGUgKGlucHV0W2xlbmd0aFByb3BlcnR5XSAlIDY0IC0gNTYpXG4gICAgaW5wdXQgKz0gJ1xceDAwJzsgLy8gTW9yZSB6ZXJvIHBhZGRpbmdcblxuICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRbbGVuZ3RoUHJvcGVydHldOyBpKyspIHtcbiAgICBqID0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaiA+PiA4KVxuICAgICAgcmV0dXJuOyAvLyBBU0NJSSBjaGVjazogb25seSBhY2NlcHQgY2hhcmFjdGVycyBpbiByYW5nZSAwLTI1NVxuICAgIHdvcmRzW2kgPj4gMl0gfD0gaiA8PCAoKDMgLSBpKSAlIDQpICogODtcbiAgfVxuXG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoKGFzY2lpQml0TGVuZ3RoIC8gbWF4V29yZCkgfCAwKTtcbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9IChhc2NpaUJpdExlbmd0aCk7XG5cbiAgLy8gcHJvY2VzcyBlYWNoIGNodW5rXG4gIGZvciAoaiA9IDA7IGogPCB3b3Jkc1tsZW5ndGhQcm9wZXJ0eV07KSB7XG4gICAgbGV0IHcgPSB3b3Jkcy5zbGljZShqLCBqICs9IDE2KTsgLy8gVGhlIG1lc3NhZ2UgaXMgZXhwYW5kZWQgaW50byA2NCB3b3JkcyBhcyBwYXJ0IG9mIHRoZSBpdGVyYXRpb25cbiAgICBsZXQgb2xkSGFzaCA9IGhhc2g7XG5cbiAgICAvLyBUaGlzIGlzIG5vdyB0aGUgdW5kZWZpbmVkd29ya2luZyBoYXNoXCIsIG9mdGVuIGxhYmVsbGVkIGFzIHZhcmlhYmxlcyBhLi4uZ1xuICAgIC8vICh3ZSBoYXZlIHRvIHRydW5jYXRlIGFzIHdlbGwsIG90aGVyd2lzZSBleHRyYSBlbnRyaWVzIGF0IHRoZSBlbmQgYWNjdW11bGF0ZVxuICAgIGhhc2ggPSBoYXNoLnNsaWNlKDAsIDgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBpbnRvIDY0IHdvcmRzXG4gICAgICAvLyBVc2VkIGJlbG93IGlmXG4gICAgICBsZXQgdzE1ID0gd1tpIC0gMTVdOyBsZXQgdzIgPSB3W2kgLSAyXTtcblxuICAgICAgLy8gSXRlcmF0ZVxuICAgICAgbGV0IGEgPSBoYXNoWzBdOyBsZXQgZSA9IGhhc2hbNF07XG4gICAgICBsZXQgdGVtcDEgPSBoYXNoWzddXG4gICAgICAgICAgICAgICAgKyAoKChlID4+PiA2KSB8IChlIDw8IDI2KSkgXiAoKGUgPj4+IDExKSB8IChlIDw8IDIxKSkgXiAoKGUgPj4+IDI1KSB8IChlIDw8IDcpKSkgLy8gUzFcbiAgICAgICAgICAgICAgICArICgoZSAmIGhhc2hbNV0pIF4gKCh+ZSkgJiBoYXNoWzZdKSkgLy8gY2hcbiAgICAgICAgICAgICAgICArIGtbaV1cbiAgICAgICAgICAgICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2Ugc2NoZWR1bGUgaWYgbmVlZGVkXG4gICAgICAgICAgICAgICAgKyAod1tpXSA9IChpIDwgMTYpID8gd1tpXSA6IChcbiAgICAgICAgICAgICAgICAgIHdbaSAtIDE2XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MTUgPj4+IDcpIHwgKHcxNSA8PCAyNSkpIF4gKCh3MTUgPj4+IDE4KSB8ICh3MTUgPDwgMTQpKSBeICh3MTUgPj4+IDMpKSAvLyBzMFxuICAgICAgICAgICAgICAgICAgICAgICAgKyB3W2kgLSA3XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MiA+Pj4gMTcpIHwgKHcyIDw8IDE1KSkgXiAoKHcyID4+PiAxOSkgfCAodzIgPDwgMTMpKSBeICh3MiA+Pj4gMTApKSAvLyBzMVxuICAgICAgICAgICAgICAgICkgfCAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgIC8vIFRoaXMgaXMgb25seSB1c2VkIG9uY2UsIHNvICpjb3VsZCogYmUgbW92ZWQgYmVsb3csIGJ1dCBpdCBvbmx5IHNhdmVzIDQgYnl0ZXMgYW5kIG1ha2VzIHRoaW5ncyB1bnJlYWRibGVcbiAgICAgIGxldCB0ZW1wMiA9ICgoKGEgPj4+IDIpIHwgKGEgPDwgMzApKSBeICgoYSA+Pj4gMTMpIHwgKGEgPDwgMTkpKSBeICgoYSA+Pj4gMjIpIHwgKGEgPDwgMTApKSkgLy8gUzBcbiAgICAgICAgICAgICAgICArICgoYSAmIGhhc2hbMV0pIF4gKGEgJiBoYXNoWzJdKSBeIChoYXNoWzFdICYgaGFzaFsyXSkpOyAvLyBtYWpcblxuICAgICAgaGFzaCA9IFsodGVtcDEgKyB0ZW1wMikgfCAwXS5jb25jYXQoaGFzaCk7IC8vIFdlIGRvbid0IGJvdGhlciB0cmltbWluZyBvZmYgdGhlIGV4dHJhIG9uZXMsIHRoZXkncmUgaGFybWxlc3MgYXMgbG9uZyBhcyB3ZSdyZSB0cnVuY2F0aW5nIHdoZW4gd2UgZG8gdGhlIHNsaWNlKClcbiAgICAgIGhhc2hbNF0gPSAoaGFzaFs0XSArIHRlbXAxKSB8IDA7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IDg7IGkrKylcbiAgICAgIGhhc2hbaV0gPSAoaGFzaFtpXSArIG9sZEhhc2hbaV0pIHwgMDtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICBmb3IgKGogPSAzOyBqICsgMTsgai0tKSB7XG4gICAgICBsZXQgYiA9IChoYXNoW2ldID4+IChqICogOCkpICYgMjU1O1xuICAgICAgcmVzdWx0ICs9ICgoYiA8IDE2KSA/IDAgOiAnJykgKyBiLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgU0hBMjU2IH0gZnJvbSAnLi9zaGEyNTYuanMnO1xuXG5leHBvcnQge1xuICBTSEEyNTYsXG59O1xuXG5mdW5jdGlvbiBwYWQoc3RyLCBjb3VudCwgY2hhciA9ICcwJykge1xuICByZXR1cm4gc3RyLnBhZFN0YXJ0KGNvdW50LCBjaGFyKTtcbn1cblxuY29uc3QgSURfQ09VTlRfTEVOR1RIICAgICAgICAgPSAxOTtcbmNvbnN0IElTX0NMQVNTICAgICAgICAgICAgICAgID0gKC9eY2xhc3MgXFxTKyBcXHsvKTtcbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFX05BTUVTID0gW1xuICAnQWdncmVnYXRlRXJyb3InLFxuICAnQXJyYXknLFxuICAnQXJyYXlCdWZmZXInLFxuICAnQmlnSW50JyxcbiAgJ0JpZ0ludDY0QXJyYXknLFxuICAnQmlnVWludDY0QXJyYXknLFxuICAnQm9vbGVhbicsXG4gICdEYXRhVmlldycsXG4gICdEYXRlJyxcbiAgJ0RlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlJyxcbiAgJ0Vycm9yJyxcbiAgJ0V2YWxFcnJvcicsXG4gICdGaW5hbGl6YXRpb25SZWdpc3RyeScsXG4gICdGbG9hdDMyQXJyYXknLFxuICAnRmxvYXQ2NEFycmF5JyxcbiAgJ0Z1bmN0aW9uJyxcbiAgJ0ludDE2QXJyYXknLFxuICAnSW50MzJBcnJheScsXG4gICdJbnQ4QXJyYXknLFxuICAnTWFwJyxcbiAgJ051bWJlcicsXG4gICdPYmplY3QnLFxuICAnUHJveHknLFxuICAnUmFuZ2VFcnJvcicsXG4gICdSZWZlcmVuY2VFcnJvcicsXG4gICdSZWdFeHAnLFxuICAnU2V0JyxcbiAgJ1NoYXJlZEFycmF5QnVmZmVyJyxcbiAgJ1N0cmluZycsXG4gICdTeW1ib2wnLFxuICAnU3ludGF4RXJyb3InLFxuICAnVHlwZUVycm9yJyxcbiAgJ1VpbnQxNkFycmF5JyxcbiAgJ1VpbnQzMkFycmF5JyxcbiAgJ1VpbnQ4QXJyYXknLFxuICAnVWludDhDbGFtcGVkQXJyYXknLFxuICAnVVJJRXJyb3InLFxuICAnV2Vha01hcCcsXG4gICdXZWFrUmVmJyxcbiAgJ1dlYWtTZXQnLFxuXTtcblxuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEgPSBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUy5tYXAoKHR5cGVOYW1lKSA9PiB7XG4gIHJldHVybiBbIHR5cGVOYW1lLCBnbG9iYWxUaGlzW3R5cGVOYW1lXSBdO1xufSkuZmlsdGVyKChtZXRhKSA9PiBtZXRhWzFdKTtcblxubGV0IGlkQ291bnRlciA9IDBuO1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSUQoKSB7XG4gIGlkQ291bnRlciArPSBCaWdJbnQoMSk7XG4gIHJldHVybiBgJHtEYXRlLm5vdygpfSR7cGFkKGlkQ291bnRlci50b1N0cmluZygpLCBJRF9DT1VOVF9MRU5HVEgpfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXNvbHZhYmxlKCkge1xuICBsZXQgc3RhdHVzID0gJ3BlbmRpbmcnO1xuICBsZXQgcmVzb2x2ZTtcbiAgbGV0IHJlamVjdDtcblxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChfcmVzb2x2ZSwgX3JlamVjdCkgPT4ge1xuICAgIHJlc29sdmUgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAnZnVsZmlsbGVkJztcbiAgICAgICAgX3Jlc29sdmUodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgcmVqZWN0ID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ3JlamVjdGVkJztcbiAgICAgICAgX3JlamVjdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb21pc2UsIHtcbiAgICAncmVzb2x2ZSc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVzb2x2ZSxcbiAgICB9LFxuICAgICdyZWplY3QnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlamVjdCxcbiAgICB9LFxuICAgICdzdGF0dXMnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgICgpID0+IHN0YXR1cyxcbiAgICB9LFxuICAgICdpZCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgZ2VuZXJhdGVJRCgpLFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZU9mKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gJ051bWJlcic7XG5cbiAgbGV0IHRoaXNUeXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodGhpc1R5cGUgPT09ICdiaWdpbnQnKVxuICAgIHJldHVybiAnQmlnSW50JztcblxuICBpZiAodGhpc1R5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHRoaXNUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsZXQgbmF0aXZlVHlwZU1ldGEgPSBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQS5maW5kKCh0eXBlTWV0YSkgPT4gKHZhbHVlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgICAgaWYgKG5hdGl2ZVR5cGVNZXRhKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke25hdGl2ZVR5cGVNZXRhWzBdfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgSVNfQ0xBU1MudGVzdCgnJyArIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvcikpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7dmFsdWUubmFtZX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG4gICAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtyZXN1bHR9XWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXNUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7dGhpc1R5cGUuc3Vic3RyaW5nKDEpfWA7XG4gIH1cblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpXG4gICAgcmV0dXJuICdTdHJpbmcnO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE51bWJlcilcbiAgICByZXR1cm4gJ051bWJlcic7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbilcbiAgICByZXR1cm4gJ0Jvb2xlYW4nO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgICByZXR1cm4gJ09iamVjdCc7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG5cbiAgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ09iamVjdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGUodmFsdWUsIC4uLnR5cGVzKSB7XG4gIGxldCB2YWx1ZVR5cGUgPSB0eXBlT2YodmFsdWUpO1xuICBpZiAodHlwZXMuaW5kZXhPZih2YWx1ZVR5cGUpID49IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIHR5cGVzLnNvbWUoKHR5cGUpID0+ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIodmFsdWUpIHtcbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICdOdW1iZXInKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycsICdOdW1iZXInLCAnQm9vbGVhbicsICdCaWdJbnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29sbGVjdGFibGUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyhJbmZpbml0eSkgfHwgT2JqZWN0LmlzKC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgJ051bWJlcicsICdCb29sZWFuJywgJ0JpZ0ludCcpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5PRSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpICYmICgvXltcXHNcXHJcXG5dKiQvKS50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLmxlbmd0aCwgJ051bWJlcicpKVxuICAgIHJldHVybiAodmFsdWUubGVuZ3RoID09PSAwKTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3ROT0UodmFsdWUpIHtcbiAgcmV0dXJuICFOT0UodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZE1ldGhvZHMoX3Byb3RvLCBza2lwUHJvdG9zKSB7XG4gIGxldCBwcm90byAgICAgICAgICAgPSBfcHJvdG87XG4gIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKHByb3RvKSB7XG4gICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG8pO1xuICAgIGxldCBrZXlzICAgICAgICA9IE9iamVjdC5rZXlzKGRlc2NyaXB0b3JzKS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhkZXNjcmlwdG9ycykpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKGtleSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQoa2V5KTtcblxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yc1trZXldO1xuXG4gICAgICAvLyBDYW4gaXQgYmUgY2hhbmdlZD9cbiAgICAgIGlmIChkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJZiBpcyBnZXR0ZXIsIHRoZW4gc2tpcFxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnZ2V0JykpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgdmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXG4gICAgICAvLyBTa2lwIHByb3RvdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KGtleSkgJiYgT2JqZWN0LnByb3RvdHlwZVtrZXldID09PSB2YWx1ZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7IC4uLmRlc2NyaXB0b3IsIHZhbHVlOiB2YWx1ZS5iaW5kKHRoaXMpIH0pO1xuICAgIH1cblxuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICBicmVhaztcblxuICAgIGlmIChza2lwUHJvdG9zICYmIHNraXBQcm90b3MuaW5kZXhPZihwcm90bykgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmNvbnN0IE1FVEFEQVRBX1dFQUtNQVAgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gbWV0YWRhdGEodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gIGlmICghaXNDb2xsZWN0YWJsZSh0YXJnZXQpKVxuICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHNldCBtZXRhZGF0YSBvbiBwcm92aWRlZCBvYmplY3Q6ICR7KHR5cGVvZiB0YXJnZXQgPT09ICdzeW1ib2wnKSA/IHRhcmdldC50b1N0cmluZygpIDogdGFyZ2V0fWApO1xuXG4gIGxldCBkYXRhID0gTUVUQURBVEFfV0VBS01BUC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkYXRhKSB7XG4gICAgZGF0YSA9IG5ldyBNYXAoKTtcbiAgICBNRVRBREFUQV9XRUFLTUFQLnNldCh0YXJnZXQsIGRhdGEpO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgcmV0dXJuIGRhdGE7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpXG4gICAgcmV0dXJuIGRhdGEuZ2V0KGtleSk7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5jb25zdCBPQkpfSURfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5sZXQgaWRDb3VudCA9IDFuO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqSUQob2JqKSB7XG4gIGxldCBpZCA9IE9CSl9JRF9XRUFLTUFQLmdldChvYmopO1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIGxldCB0aGlzSUQgPSBgJHtpZENvdW50Kyt9YDtcbiAgICBPQkpfSURfV0VBS01BUC5zZXQob2JqLCB0aGlzSUQpO1xuXG4gICAgcmV0dXJuIHRoaXNJRDtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuZXhwb3J0IGNsYXNzIER5bmFtaWNQcm9wZXJ0eSB7XG4gIGNvbnN0cnVjdG9yKGdldHRlciwgc2V0dGVyKSB7XG4gICAgaWYgKHR5cGVvZiBnZXR0ZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImdldHRlclwiIChmaXJzdCkgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgICBpZiAodHlwZW9mIHNldHRlciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2V0dGVyXCIgKHNlY29uZCkgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmFsdWUnOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICBnZXR0ZXIsXG4gICAgICAgIHNldDogICAgICAgICAgc2V0dGVyLFxuICAgICAgfSxcbiAgICAgICdyZWdpc3RlcmVkTm9kZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBXZWFrTWFwKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS50b1N0cmluZygpIDogKCcnICsgdmFsdWUpO1xuICB9XG5cbiAgc2V0KGNvbnRleHQsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKHRoaXMudmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIHRoaXMudHJpZ2dlclVwZGF0ZXMoY29udGV4dCk7XG4gIH1cblxuICB0cmlnZ2VyVXBkYXRlcyhjb250ZXh0KSB7XG4gICAgbGV0IG1hcCA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmdldChjb250ZXh0KTtcbiAgICBpZiAoIW1hcClcbiAgICAgIHJldHVybjtcblxuICAgIGZvciAobGV0IFsgbm9kZSwgY2FsbGJhY2sgXSBvZiBtYXAuZW50cmllcygpKVxuICAgICAgbm9kZS5ub2RlVmFsdWUgPSBjYWxsYmFjayhjb250ZXh0KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRm9yVXBkYXRlKGNvbnRleHQsIG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgbGV0IG1hcCA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmdldChjb250ZXh0KTtcbiAgICBpZiAoIW1hcCkge1xuICAgICAgbWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGhpcy5yZWdpc3RlcmVkTm9kZXMuc2V0KGNvbnRleHQsIG1hcCk7XG4gICAgfVxuXG4gICAgaWYgKG1hcC5oYXMobm9kZSkpXG4gICAgICByZXR1cm47XG5cbiAgICBtYXAuc2V0KG5vZGUsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuY29uc3QgVkFMSURfSlNfSURFTlRJRklFUiAgICAgICAgID0gL15bYS16QS1aXyRdW2EtekEtWjAtOV8kXSokLztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoY29udGV4dCwgX2Z1bmN0aW9uQm9keSwgX2NvbnRleHRDYWxsQXJncykge1xuICBsZXQgY29udGV4dENhbGxBcmdzID0gKF9jb250ZXh0Q2FsbEFyZ3MpID8gX2NvbnRleHRDYWxsQXJncyA6IGB7JHtPYmplY3Qua2V5cyhjb250ZXh0KS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSkuam9pbignLCcpfX1gO1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihjb250ZXh0Q2FsbEFyZ3MsIGByZXR1cm4gJHtfZnVuY3Rpb25Cb2R5LnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKy8sICcnKX07YCkpLmJpbmQodGhpcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUZXJtKGNvbnRleHQsIF90ZXh0KSB7XG4gIGxldCB0ZXh0ID0gX3RleHQ7XG4gIGxldCBub2RlO1xuXG4gIGlmICh0ZXh0IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIG5vZGUgPSB0ZXh0O1xuICAgIGlmIChGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImZvcm1hdFRlcm1cIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gICAgdGV4dCA9IG5vZGUubm9kZVZhbHVlO1xuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGB7JHtPYmplY3Qua2V5cyhjb250ZXh0KS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSkuam9pbignLCcpfX1gO1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oPzpeXFx7XFx7fChbXlxcXFxdKVxce1xceykoW159XSs/KVxcfXsyLH0vZywgKG0sIHN0YXJ0LCBtYWNybykgPT4ge1xuICAgIGNvbnN0IGZldGNoUGF0aCA9IGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoY29udGV4dCwgbWFjcm8sIGNvbnRleHRDYWxsQXJncyk7XG4gICAgbGV0IHZhbHVlID0gZmV0Y2hQYXRoKGNvbnRleHQpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdmFsdWUgPSAnJztcblxuICAgIGlmIChub2RlICYmIHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1Byb3BlcnR5KVxuICAgICAgdmFsdWUucmVnaXN0ZXJGb3JVcGRhdGUoY29udGV4dCwgbm9kZSwgKGNvbnRleHQpID0+IGZvcm1hdFRlcm0oY29udGV4dCwgdGV4dCkpO1xuXG4gICAgcmV0dXJuIGAke3N0YXJ0IHx8ICcnfSR7dmFsdWV9YDtcbiAgfSk7XG59XG5cbmNvbnN0IEhBU19EWU5BTUlDX0JJTkRJTkcgPSAvXlxce1xce3xbXlxcXFxdXFx7XFx7LztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZSh2YWx1ZSkge1xuICBpZiAoIWlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gSEFTX0RZTkFNSUNfQklORElORy50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRSA9IC9eW1xcdy4kXSskLztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFdmVudENhbGxiYWNrKF9mdW5jdGlvbkJvZHkpIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IF9mdW5jdGlvbkJvZHk7XG4gIGlmIChFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSlcbiAgICBmdW5jdGlvbkJvZHkgPSBgdGhpcy4ke2Z1bmN0aW9uQm9keX0oZXZlbnQpYDtcblxuICByZXR1cm4gKG5ldyBGdW5jdGlvbignZXZlbnQnLCBgbGV0IGU9ZXZlbnQsZXY9ZXZlbnQsZXZ0PWV2ZW50O3JldHVybiAke2Z1bmN0aW9uQm9keS5yZXBsYWNlKC9eXFxzKnJldHVyblxccyovLCAnJyl9O2ApKS5iaW5kKHRoaXMpO1xufVxuXG5jb25zdCBJU19FVkVOVF9OQU1FICAgICA9IC9eb24vO1xuY29uc3QgRVZFTlRfTkFNRV9DQUNIRSAgPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgbGV0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgaWYgKEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV0pXG4gICAgcmV0dXJuIEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV07XG5cbiAgbGV0IGV2ZW50TmFtZXMgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gZWxlbWVudCkge1xuICAgIGlmIChrZXkubGVuZ3RoID4gMiAmJiBJU19FVkVOVF9OQU1FLnRlc3Qoa2V5KSlcbiAgICAgIGV2ZW50TmFtZXMucHVzaChrZXkudG9Mb3dlckNhc2UoKSk7XG4gIH1cblxuICBFVkVOVF9OQU1FX0NBQ0hFW3RhZ05hbWVdID0gZXZlbnROYW1lcztcblxuICByZXR1cm4gZXZlbnROYW1lcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRFdmVudFRvRWxlbWVudChjb250ZXh0LCBlbGVtZW50LCBldmVudE5hbWUsIF9jYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgY2FsbGJhY2s7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QoX2NhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrICA9IF9jYWxsYmFjay5jYWxsYmFjaztcbiAgICBvcHRpb25zICAgPSBfY2FsbGJhY2sub3B0aW9ucyB8fCB7fTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgX2NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH1cblxuICBpZiAoaXNUeXBlKGNhbGxiYWNrLCAnU3RyaW5nJykpXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVFdmVudENhbGxiYWNrLmNhbGwoY29udGV4dCwgY2FsbGJhY2spO1xuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblxuICByZXR1cm4geyBjYWxsYmFjaywgb3B0aW9ucyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQYXRoKG9iaiwga2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKG9iaiA9PSBudWxsIHx8IE9iamVjdC5pcyhvYmosIE5hTikgfHwgT2JqZWN0LmlzKG9iaiwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhvYmosIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBpZiAoa2V5ID09IG51bGwgfHwgT2JqZWN0LmlzKGtleSwgTmFOKSB8fCBPYmplY3QuaXMoa2V5LCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKGtleSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGxldCBwYXJ0cyAgICAgICAgID0ga2V5LnNwbGl0KC9cXC4vZykuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgY3VycmVudFZhbHVlICA9IG9iajtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBwYXJ0cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgbGV0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBsZXQgbmV4dFZhbHVlID0gY3VycmVudFZhbHVlW3BhcnRdO1xuICAgIGlmIChuZXh0VmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjdXJyZW50VmFsdWUgPSBuZXh0VmFsdWU7XG4gIH1cblxuICBpZiAoY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSBpbnN0YW5jZW9mIE5vZGUgJiYgKGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHwgY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSlcbiAgICByZXR1cm4gY3VycmVudFZhbHVlLm5vZGVWYWx1ZTtcblxuICByZXR1cm4gKGN1cnJlbnRWYWx1ZSA9PSBudWxsKSA/IGRlZmF1bHRWYWx1ZSA6IGN1cnJlbnRWYWx1ZTtcbn1cblxuY29uc3QgSVNfTlVNQkVSID0gL14oWy0rXT8pKFxcZCooPzpcXC5cXGQrKT8pKGVbLStdXFxkKyk/JC87XG5jb25zdCBJU19CT09MRUFOID0gL14odHJ1ZXxmYWxzZSkkLztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvZXJjZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09ICdudWxsJylcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgaWYgKHZhbHVlID09PSAnTmFOJylcbiAgICByZXR1cm4gTmFOO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ0luZmluaXR5JyB8fCB2YWx1ZSA9PT0gJytJbmZpbml0eScpXG4gICAgcmV0dXJuIEluZmluaXR5O1xuXG4gIGlmICh2YWx1ZSA9PT0gJy1JbmZpbml0eScpXG4gICAgcmV0dXJuIC1JbmZpbml0eTtcblxuICBpZiAoSVNfTlVNQkVSLnRlc3QodmFsdWUpKVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUsIDEwKTtcblxuICBpZiAoSVNfQk9PTEVBTi50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gKHZhbHVlID09PSAndHJ1ZScpO1xuXG4gIHJldHVybiAoJycgKyB2YWx1ZSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZWxlbWVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktcmVxdWlyZS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1zcGlubmVyLmpzJztcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5VdGlscyA9IFV0aWxzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5Db21wb25lbnRzID0gQ29tcG9uZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuRWxlbWVudHMgPSBFbGVtZW50cztcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==