/******/ var __webpack_modules__ = ({

/***/ "./lib/browser.js":
/*!************************!*\
  !*** ./lib/browser.js ***!
  \************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadComponentFromSource: () => (/* binding */ loadComponentFromSource)
/* harmony export */ });
const { MythixUIComponent: _MythixUIComponent } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./component.js */ "./lib/component.js"));

const IS_TEMPLATE = /^(template)$/i;
const IS_SCRIPT   = /^(script)$/i;

function loadComponentFromSource(ownerDocument, url, sourceString) {
  let baseURL = new URL(url);
  let fileName;

  baseURL.pathname = baseURL.pathname.replace(/[^/]+$/, (m) => {
    fileName = m;
    return '';
  });

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

  let templateCount = children.reduce((sum, element) => ((IS_TEMPLATE.test(element.tagName)) ? (sum + 1) : sum), 0);
  for (let child of children) {
    if (IS_TEMPLATE.test(child.tagName)) {
      if (templateCount === 1 && child.getAttribute('data-for') == null && child.getAttribute('data-mythix-component-name') == null) {
        let guessedElementName = fileNameToElementName(fileName);
        console.warn(`${url}: <template> is missing a "data-for" attribute, linking it to its owner component. Guessing "${guessedElementName}".`);
        child.setAttribute('data-for', guessedElementName);
      }

      ownerDocument.body.appendChild(child);
    } else if (IS_SCRIPT.test(child.tagName)) {
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
    } else if ((/^(link|style)$/i).test(child.tagName)) {
      // append to head
      ownerDocument.head.appendChild(child);
    } else if ((/^(meta)$/i).test(child.tagName)) {
      // do nothing with these tags
      continue;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      // append everything else to the body
      ownerDocument.body.appendChild(child);
    }
  }
}

class Require extends _MythixUIComponent {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let response = await fetch(src);
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);

      let body = await response.text();
      loadComponentFromSource(this.ownerDocument, response.url, body);
    } catch (error) {
      console.error(`mythix-require: Failed to load specified resource: ${src}`, error);
    }
  }
}

customElements.define('mythix-require', Require);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");




function formatRuleSet(rule, callback) {
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
    if (!ownerDocument.head.querySelector(`#${styleID}`)) {
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
  static register = function(name, Klass) {
    customElements.define(name || this.tagName, Klass || this);
    return this;
  };

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

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  connectedCallback() {
    this.setAttribute('component-name', this.sensitiveTagName);

    if (this.template) {
      ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, this.template);

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
    return _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(this, [ callback(_elements_js__WEBPACK_IMPORTED_MODULE_2__, {}) ]);
  }

  metadata(key, value) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this, key, value);
  }

  createDynamicProperty(name, _value, _context) {
    let value   = new _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty(_value);
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

    console.log('id', id);

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
          get: (_, propName) => {
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

const E = (tagName, defaultAttributes) => build(tagName, defaultAttributes);

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

const SE = (tagName, defaultAttributes) => build(tagName, defaultAttributes);

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

const SVG_ELEMENT_NAMES = [
  'ALTGLYPH',
  'ALTGLYPHDEF',
  'ALTGLYPHITEM',
  'ANIMATE',
  'ANIMATECOLOR',
  'ANIMATEMOTION',
  'ANIMATETRANSFORM',
  'ANIMATION',
  'CIRCLE',
  'CLIPPATH',
  'COLORPROFILE',
  'CURSOR',
  'DEFS',
  'DESC',
  'DISCARD',
  'ELLIPSE',
  'FEBLEND',
  'FECOLORMATRIX',
  'FECOMPONENTTRANSFER',
  'FECOMPOSITE',
  'FECONVOLVEMATRIX',
  'FEDIFFUSELIGHTING',
  'FEDISPLACEMENTMAP',
  'FEDISTANTLIGHT',
  'FEDROPSHADOW',
  'FEFLOOD',
  'FEFUNCA',
  'FEFUNCB',
  'FEFUNCG',
  'FEFUNCR',
  'FEGAUSSIANBLUR',
  'FEIMAGE',
  'FEMERGE',
  'FEMERGENODE',
  'FEMORPHOLOGY',
  'FEOFFSET',
  'FEPOINTLIGHT',
  'FESPECULARLIGHTING',
  'FESPOTLIGHT',
  'FETILE',
  'FETURBULENCE',
  'FILTER',
  'FONT',
  'FONTFACE',
  'FONTFACEFORMAT',
  'FONTFACENAME',
  'FONTFACESRC',
  'FONTFACEURI',
  'FOREIGNOBJECT',
  'G',
  'GLYPH',
  'GLYPHREF',
  'HANDLER',
  'HKERN',
  'IMAGE',
  'LINE',
  'LINEARGRADIENT',
  'LISTENER',
  'MARKER',
  'MASK',
  'METADATA',
  'MISSINGGLYPH',
  'MPATH',
  'PATH',
  'PATTERN',
  'POLYGON',
  'POLYLINE',
  'PREFETCH',
  'RADIALGRADIENT',
  'RECT',
  'SET',
  'SOLIDCOLOR',
  'STOP',
  'SVG',
  'SWITCH',
  'SYMBOL',
  'TBREAK',
  'TEXT',
  'TEXTPATH',
  'TREF',
  'TSPAN',
  'UNKNOWN',
  'USE',
  'VIEW',
  'VKERN',
];

const SVG_RE = new RegExp(`^(${SVG_ELEMENT_NAMES.join('|')})$`, 'i');

function isSVGElement(tagName) {
  return SVG_RE.test(tagName);
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.A),
/* harmony export */   ABBR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ABBR),
/* harmony export */   ADDRESS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ADDRESS),
/* harmony export */   ALTGLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ALTGLYPH),
/* harmony export */   ALTGLYPHDEF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ALTGLYPHDEF),
/* harmony export */   ALTGLYPHITEM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ALTGLYPHITEM),
/* harmony export */   ANIMATE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATE),
/* harmony export */   ANIMATECOLOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATECOLOR),
/* harmony export */   ANIMATEMOTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATEMOTION),
/* harmony export */   ANIMATETRANSFORM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATETRANSFORM),
/* harmony export */   ANIMATION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ANIMATION),
/* harmony export */   AREA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.AREA),
/* harmony export */   ARTICLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ARTICLE),
/* harmony export */   ASIDE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ASIDE),
/* harmony export */   AUDIO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.AUDIO),
/* harmony export */   B: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.B),
/* harmony export */   BASE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BASE),
/* harmony export */   BDI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BDI),
/* harmony export */   BDO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BDO),
/* harmony export */   BLOCKQUOTE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BLOCKQUOTE),
/* harmony export */   BR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BR),
/* harmony export */   BUTTON: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.BUTTON),
/* harmony export */   CANVAS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CANVAS),
/* harmony export */   CAPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CAPTION),
/* harmony export */   CIRCLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CIRCLE),
/* harmony export */   CITE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CITE),
/* harmony export */   CLIPPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CLIPPATH),
/* harmony export */   CODE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CODE),
/* harmony export */   COL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.COL),
/* harmony export */   COLGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.COLGROUP),
/* harmony export */   COLORPROFILE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.COLORPROFILE),
/* harmony export */   CURSOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.CURSOR),
/* harmony export */   DATA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DATA),
/* harmony export */   DATALIST: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DATALIST),
/* harmony export */   DD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DD),
/* harmony export */   DEFS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DEFS),
/* harmony export */   DEL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DEL),
/* harmony export */   DESC: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DESC),
/* harmony export */   DETAILS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DETAILS),
/* harmony export */   DFN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DFN),
/* harmony export */   DIALOG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DIALOG),
/* harmony export */   DISCARD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DISCARD),
/* harmony export */   DIV: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DIV),
/* harmony export */   DL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DL),
/* harmony export */   DT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.DT),
/* harmony export */   ELLIPSE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ELLIPSE),
/* harmony export */   EM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.EM),
/* harmony export */   EMBED: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.EMBED),
/* harmony export */   ElementDefinition: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.ElementDefinition),
/* harmony export */   FEBLEND: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEBLEND),
/* harmony export */   FECOLORMATRIX: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FECOLORMATRIX),
/* harmony export */   FECOMPONENTTRANSFER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FECOMPONENTTRANSFER),
/* harmony export */   FECOMPOSITE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FECOMPOSITE),
/* harmony export */   FECONVOLVEMATRIX: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FECONVOLVEMATRIX),
/* harmony export */   FEDIFFUSELIGHTING: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEDIFFUSELIGHTING),
/* harmony export */   FEDISPLACEMENTMAP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEDISPLACEMENTMAP),
/* harmony export */   FEDISTANTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEDISTANTLIGHT),
/* harmony export */   FEDROPSHADOW: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEDROPSHADOW),
/* harmony export */   FEFLOOD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEFLOOD),
/* harmony export */   FEFUNCA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEFUNCA),
/* harmony export */   FEFUNCB: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEFUNCB),
/* harmony export */   FEFUNCG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEFUNCG),
/* harmony export */   FEFUNCR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEFUNCR),
/* harmony export */   FEGAUSSIANBLUR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEGAUSSIANBLUR),
/* harmony export */   FEIMAGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEIMAGE),
/* harmony export */   FEMERGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEMERGE),
/* harmony export */   FEMERGENODE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEMERGENODE),
/* harmony export */   FEMORPHOLOGY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEMORPHOLOGY),
/* harmony export */   FEOFFSET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEOFFSET),
/* harmony export */   FEPOINTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FEPOINTLIGHT),
/* harmony export */   FESPECULARLIGHTING: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FESPECULARLIGHTING),
/* harmony export */   FESPOTLIGHT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FESPOTLIGHT),
/* harmony export */   FETILE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FETILE),
/* harmony export */   FETURBULENCE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FETURBULENCE),
/* harmony export */   FIELDSET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FIELDSET),
/* harmony export */   FIGCAPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FIGCAPTION),
/* harmony export */   FIGURE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FIGURE),
/* harmony export */   FILTER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FILTER),
/* harmony export */   FONT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONT),
/* harmony export */   FONTFACE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONTFACE),
/* harmony export */   FONTFACEFORMAT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONTFACEFORMAT),
/* harmony export */   FONTFACENAME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONTFACENAME),
/* harmony export */   FONTFACESRC: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONTFACESRC),
/* harmony export */   FONTFACEURI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FONTFACEURI),
/* harmony export */   FOOTER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FOOTER),
/* harmony export */   FOREIGNOBJECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FOREIGNOBJECT),
/* harmony export */   FORM: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.FORM),
/* harmony export */   G: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.G),
/* harmony export */   GLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.GLYPH),
/* harmony export */   GLYPHREF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.GLYPHREF),
/* harmony export */   H1: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H1),
/* harmony export */   H2: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H2),
/* harmony export */   H3: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H3),
/* harmony export */   H4: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H4),
/* harmony export */   H5: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H5),
/* harmony export */   H6: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.H6),
/* harmony export */   HANDLER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.HANDLER),
/* harmony export */   HEADER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.HEADER),
/* harmony export */   HGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.HGROUP),
/* harmony export */   HKERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.HKERN),
/* harmony export */   HR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.HR),
/* harmony export */   I: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.I),
/* harmony export */   IFRAME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.IFRAME),
/* harmony export */   IMAGE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.IMAGE),
/* harmony export */   IMG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.IMG),
/* harmony export */   INPUT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.INPUT),
/* harmony export */   INS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.INS),
/* harmony export */   KBD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.KBD),
/* harmony export */   LABEL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LABEL),
/* harmony export */   LEGEND: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LEGEND),
/* harmony export */   LI: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LI),
/* harmony export */   LINE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LINE),
/* harmony export */   LINEARGRADIENT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LINEARGRADIENT),
/* harmony export */   LINK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LINK),
/* harmony export */   LISTENER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.LISTENER),
/* harmony export */   MAIN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MAIN),
/* harmony export */   MAP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MAP),
/* harmony export */   MARK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MARK),
/* harmony export */   MARKER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MARKER),
/* harmony export */   MASK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MASK),
/* harmony export */   MENU: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MENU),
/* harmony export */   META: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.META),
/* harmony export */   METADATA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.METADATA),
/* harmony export */   METER: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.METER),
/* harmony export */   MISSINGGLYPH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MISSINGGLYPH),
/* harmony export */   MPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.MPATH),
/* harmony export */   MythixUIComponent: () => (/* reexport safe */ _component_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent),
/* harmony export */   NAV: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.NAV),
/* harmony export */   NOSCRIPT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.NOSCRIPT),
/* harmony export */   OBJECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.OBJECT),
/* harmony export */   OL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.OL),
/* harmony export */   OPTGROUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.OPTGROUP),
/* harmony export */   OPTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.OPTION),
/* harmony export */   OUTPUT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.OUTPUT),
/* harmony export */   P: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.P),
/* harmony export */   PATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PATH),
/* harmony export */   PATTERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PATTERN),
/* harmony export */   PICTURE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PICTURE),
/* harmony export */   POLYGON: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.POLYGON),
/* harmony export */   POLYLINE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.POLYLINE),
/* harmony export */   PRE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PRE),
/* harmony export */   PREFETCH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PREFETCH),
/* harmony export */   PROGRESS: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.PROGRESS),
/* harmony export */   Q: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.Q),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine),
/* harmony export */   RADIALGRADIENT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.RADIALGRADIENT),
/* harmony export */   RECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.RECT),
/* harmony export */   RP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.RP),
/* harmony export */   RT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.RT),
/* harmony export */   RUBY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.RUBY),
/* harmony export */   S: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.S),
/* harmony export */   SAMP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SAMP),
/* harmony export */   SCRIPT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SCRIPT),
/* harmony export */   SECTION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SECTION),
/* harmony export */   SELECT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SELECT),
/* harmony export */   SET: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SET),
/* harmony export */   SLOT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SLOT),
/* harmony export */   SMALL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SMALL),
/* harmony export */   SOLIDCOLOR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SOLIDCOLOR),
/* harmony export */   SOURCE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SOURCE),
/* harmony export */   SPAN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SPAN),
/* harmony export */   STOP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.STOP),
/* harmony export */   STRONG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.STRONG),
/* harmony export */   STYLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.STYLE),
/* harmony export */   SUB: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SUB),
/* harmony export */   SUMMARY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SUMMARY),
/* harmony export */   SUP: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SUP),
/* harmony export */   SVG: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SVG),
/* harmony export */   SVG_ELEMENT_NAMES: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SVG_ELEMENT_NAMES),
/* harmony export */   SWITCH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SWITCH),
/* harmony export */   SYMBOL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.SYMBOL),
/* harmony export */   TABLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TABLE),
/* harmony export */   TBODY: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TBODY),
/* harmony export */   TBREAK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TBREAK),
/* harmony export */   TD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TD),
/* harmony export */   TEMPLATE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TEMPLATE),
/* harmony export */   TEXT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TEXT),
/* harmony export */   TEXTAREA: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TEXTAREA),
/* harmony export */   TEXTPATH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TEXTPATH),
/* harmony export */   TFOOT: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TFOOT),
/* harmony export */   TH: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TH),
/* harmony export */   THEAD: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.THEAD),
/* harmony export */   TIME: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TIME),
/* harmony export */   TITLE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TITLE),
/* harmony export */   TR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TR),
/* harmony export */   TRACK: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TRACK),
/* harmony export */   TREF: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TREF),
/* harmony export */   TSPAN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.TSPAN),
/* harmony export */   Term: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.Term),
/* harmony export */   U: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.U),
/* harmony export */   UL: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.UL),
/* harmony export */   UNFINISHED_DEFINITION: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.UNFINISHED_DEFINITION),
/* harmony export */   UNKNOWN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.UNKNOWN),
/* harmony export */   USE: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.USE),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   VAR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.VAR),
/* harmony export */   VIDEO: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.VIDEO),
/* harmony export */   VIEW: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.VIEW),
/* harmony export */   VKERN: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.VKERN),
/* harmony export */   WBR: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.WBR),
/* harmony export */   build: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.build),
/* harmony export */   isSVGElement: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.isSVGElement),
/* harmony export */   loadComponentFromSource: () => (/* reexport safe */ _browser_js__WEBPACK_IMPORTED_MODULE_4__.loadComponentFromSource)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _browser_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./browser.js */ "./lib/browser.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_browser_js__WEBPACK_IMPORTED_MODULE_4__]);
_browser_js__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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

if (!globalThis.MythixUIQueryEngine)
  globalThis.MythixUIQueryEngine = QueryEngine;


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
/* harmony export */   createDynamicPropertyFetcher: () => (/* binding */ createDynamicPropertyFetcher),
/* harmony export */   createEventCallback: () => (/* binding */ createEventCallback),
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   fetch: () => (/* binding */ fetch),
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

      let value = proto[key];

      // Skip prototype of Object
      // eslint-disable-next-line no-prototype-builtins
      if (Object.prototype.hasOwnProperty(key) && Object.prototype[key] === value)
        continue;

      if (typeof value !== 'function')
        continue;

      this[key] = value.bind(this);
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
  constructor(value) {
    Object.defineProperties(this, {
      'value': {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        value,
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
    const fetch = createDynamicPropertyFetcher(context, macro, contextCallArgs);
    let value   = fetch(context);
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

function fetch(obj, key, defaultValue) {
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
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
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
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__("./lib/index.js");
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ var __webpack_exports__A = __webpack_exports__.A;
/******/ var __webpack_exports__ABBR = __webpack_exports__.ABBR;
/******/ var __webpack_exports__ADDRESS = __webpack_exports__.ADDRESS;
/******/ var __webpack_exports__ALTGLYPH = __webpack_exports__.ALTGLYPH;
/******/ var __webpack_exports__ALTGLYPHDEF = __webpack_exports__.ALTGLYPHDEF;
/******/ var __webpack_exports__ALTGLYPHITEM = __webpack_exports__.ALTGLYPHITEM;
/******/ var __webpack_exports__ANIMATE = __webpack_exports__.ANIMATE;
/******/ var __webpack_exports__ANIMATECOLOR = __webpack_exports__.ANIMATECOLOR;
/******/ var __webpack_exports__ANIMATEMOTION = __webpack_exports__.ANIMATEMOTION;
/******/ var __webpack_exports__ANIMATETRANSFORM = __webpack_exports__.ANIMATETRANSFORM;
/******/ var __webpack_exports__ANIMATION = __webpack_exports__.ANIMATION;
/******/ var __webpack_exports__AREA = __webpack_exports__.AREA;
/******/ var __webpack_exports__ARTICLE = __webpack_exports__.ARTICLE;
/******/ var __webpack_exports__ASIDE = __webpack_exports__.ASIDE;
/******/ var __webpack_exports__AUDIO = __webpack_exports__.AUDIO;
/******/ var __webpack_exports__B = __webpack_exports__.B;
/******/ var __webpack_exports__BASE = __webpack_exports__.BASE;
/******/ var __webpack_exports__BDI = __webpack_exports__.BDI;
/******/ var __webpack_exports__BDO = __webpack_exports__.BDO;
/******/ var __webpack_exports__BLOCKQUOTE = __webpack_exports__.BLOCKQUOTE;
/******/ var __webpack_exports__BR = __webpack_exports__.BR;
/******/ var __webpack_exports__BUTTON = __webpack_exports__.BUTTON;
/******/ var __webpack_exports__CANVAS = __webpack_exports__.CANVAS;
/******/ var __webpack_exports__CAPTION = __webpack_exports__.CAPTION;
/******/ var __webpack_exports__CIRCLE = __webpack_exports__.CIRCLE;
/******/ var __webpack_exports__CITE = __webpack_exports__.CITE;
/******/ var __webpack_exports__CLIPPATH = __webpack_exports__.CLIPPATH;
/******/ var __webpack_exports__CODE = __webpack_exports__.CODE;
/******/ var __webpack_exports__COL = __webpack_exports__.COL;
/******/ var __webpack_exports__COLGROUP = __webpack_exports__.COLGROUP;
/******/ var __webpack_exports__COLORPROFILE = __webpack_exports__.COLORPROFILE;
/******/ var __webpack_exports__CURSOR = __webpack_exports__.CURSOR;
/******/ var __webpack_exports__DATA = __webpack_exports__.DATA;
/******/ var __webpack_exports__DATALIST = __webpack_exports__.DATALIST;
/******/ var __webpack_exports__DD = __webpack_exports__.DD;
/******/ var __webpack_exports__DEFS = __webpack_exports__.DEFS;
/******/ var __webpack_exports__DEL = __webpack_exports__.DEL;
/******/ var __webpack_exports__DESC = __webpack_exports__.DESC;
/******/ var __webpack_exports__DETAILS = __webpack_exports__.DETAILS;
/******/ var __webpack_exports__DFN = __webpack_exports__.DFN;
/******/ var __webpack_exports__DIALOG = __webpack_exports__.DIALOG;
/******/ var __webpack_exports__DISCARD = __webpack_exports__.DISCARD;
/******/ var __webpack_exports__DIV = __webpack_exports__.DIV;
/******/ var __webpack_exports__DL = __webpack_exports__.DL;
/******/ var __webpack_exports__DT = __webpack_exports__.DT;
/******/ var __webpack_exports__ELLIPSE = __webpack_exports__.ELLIPSE;
/******/ var __webpack_exports__EM = __webpack_exports__.EM;
/******/ var __webpack_exports__EMBED = __webpack_exports__.EMBED;
/******/ var __webpack_exports__ElementDefinition = __webpack_exports__.ElementDefinition;
/******/ var __webpack_exports__FEBLEND = __webpack_exports__.FEBLEND;
/******/ var __webpack_exports__FECOLORMATRIX = __webpack_exports__.FECOLORMATRIX;
/******/ var __webpack_exports__FECOMPONENTTRANSFER = __webpack_exports__.FECOMPONENTTRANSFER;
/******/ var __webpack_exports__FECOMPOSITE = __webpack_exports__.FECOMPOSITE;
/******/ var __webpack_exports__FECONVOLVEMATRIX = __webpack_exports__.FECONVOLVEMATRIX;
/******/ var __webpack_exports__FEDIFFUSELIGHTING = __webpack_exports__.FEDIFFUSELIGHTING;
/******/ var __webpack_exports__FEDISPLACEMENTMAP = __webpack_exports__.FEDISPLACEMENTMAP;
/******/ var __webpack_exports__FEDISTANTLIGHT = __webpack_exports__.FEDISTANTLIGHT;
/******/ var __webpack_exports__FEDROPSHADOW = __webpack_exports__.FEDROPSHADOW;
/******/ var __webpack_exports__FEFLOOD = __webpack_exports__.FEFLOOD;
/******/ var __webpack_exports__FEFUNCA = __webpack_exports__.FEFUNCA;
/******/ var __webpack_exports__FEFUNCB = __webpack_exports__.FEFUNCB;
/******/ var __webpack_exports__FEFUNCG = __webpack_exports__.FEFUNCG;
/******/ var __webpack_exports__FEFUNCR = __webpack_exports__.FEFUNCR;
/******/ var __webpack_exports__FEGAUSSIANBLUR = __webpack_exports__.FEGAUSSIANBLUR;
/******/ var __webpack_exports__FEIMAGE = __webpack_exports__.FEIMAGE;
/******/ var __webpack_exports__FEMERGE = __webpack_exports__.FEMERGE;
/******/ var __webpack_exports__FEMERGENODE = __webpack_exports__.FEMERGENODE;
/******/ var __webpack_exports__FEMORPHOLOGY = __webpack_exports__.FEMORPHOLOGY;
/******/ var __webpack_exports__FEOFFSET = __webpack_exports__.FEOFFSET;
/******/ var __webpack_exports__FEPOINTLIGHT = __webpack_exports__.FEPOINTLIGHT;
/******/ var __webpack_exports__FESPECULARLIGHTING = __webpack_exports__.FESPECULARLIGHTING;
/******/ var __webpack_exports__FESPOTLIGHT = __webpack_exports__.FESPOTLIGHT;
/******/ var __webpack_exports__FETILE = __webpack_exports__.FETILE;
/******/ var __webpack_exports__FETURBULENCE = __webpack_exports__.FETURBULENCE;
/******/ var __webpack_exports__FIELDSET = __webpack_exports__.FIELDSET;
/******/ var __webpack_exports__FIGCAPTION = __webpack_exports__.FIGCAPTION;
/******/ var __webpack_exports__FIGURE = __webpack_exports__.FIGURE;
/******/ var __webpack_exports__FILTER = __webpack_exports__.FILTER;
/******/ var __webpack_exports__FONT = __webpack_exports__.FONT;
/******/ var __webpack_exports__FONTFACE = __webpack_exports__.FONTFACE;
/******/ var __webpack_exports__FONTFACEFORMAT = __webpack_exports__.FONTFACEFORMAT;
/******/ var __webpack_exports__FONTFACENAME = __webpack_exports__.FONTFACENAME;
/******/ var __webpack_exports__FONTFACESRC = __webpack_exports__.FONTFACESRC;
/******/ var __webpack_exports__FONTFACEURI = __webpack_exports__.FONTFACEURI;
/******/ var __webpack_exports__FOOTER = __webpack_exports__.FOOTER;
/******/ var __webpack_exports__FOREIGNOBJECT = __webpack_exports__.FOREIGNOBJECT;
/******/ var __webpack_exports__FORM = __webpack_exports__.FORM;
/******/ var __webpack_exports__G = __webpack_exports__.G;
/******/ var __webpack_exports__GLYPH = __webpack_exports__.GLYPH;
/******/ var __webpack_exports__GLYPHREF = __webpack_exports__.GLYPHREF;
/******/ var __webpack_exports__H1 = __webpack_exports__.H1;
/******/ var __webpack_exports__H2 = __webpack_exports__.H2;
/******/ var __webpack_exports__H3 = __webpack_exports__.H3;
/******/ var __webpack_exports__H4 = __webpack_exports__.H4;
/******/ var __webpack_exports__H5 = __webpack_exports__.H5;
/******/ var __webpack_exports__H6 = __webpack_exports__.H6;
/******/ var __webpack_exports__HANDLER = __webpack_exports__.HANDLER;
/******/ var __webpack_exports__HEADER = __webpack_exports__.HEADER;
/******/ var __webpack_exports__HGROUP = __webpack_exports__.HGROUP;
/******/ var __webpack_exports__HKERN = __webpack_exports__.HKERN;
/******/ var __webpack_exports__HR = __webpack_exports__.HR;
/******/ var __webpack_exports__I = __webpack_exports__.I;
/******/ var __webpack_exports__IFRAME = __webpack_exports__.IFRAME;
/******/ var __webpack_exports__IMAGE = __webpack_exports__.IMAGE;
/******/ var __webpack_exports__IMG = __webpack_exports__.IMG;
/******/ var __webpack_exports__INPUT = __webpack_exports__.INPUT;
/******/ var __webpack_exports__INS = __webpack_exports__.INS;
/******/ var __webpack_exports__KBD = __webpack_exports__.KBD;
/******/ var __webpack_exports__LABEL = __webpack_exports__.LABEL;
/******/ var __webpack_exports__LEGEND = __webpack_exports__.LEGEND;
/******/ var __webpack_exports__LI = __webpack_exports__.LI;
/******/ var __webpack_exports__LINE = __webpack_exports__.LINE;
/******/ var __webpack_exports__LINEARGRADIENT = __webpack_exports__.LINEARGRADIENT;
/******/ var __webpack_exports__LINK = __webpack_exports__.LINK;
/******/ var __webpack_exports__LISTENER = __webpack_exports__.LISTENER;
/******/ var __webpack_exports__MAIN = __webpack_exports__.MAIN;
/******/ var __webpack_exports__MAP = __webpack_exports__.MAP;
/******/ var __webpack_exports__MARK = __webpack_exports__.MARK;
/******/ var __webpack_exports__MARKER = __webpack_exports__.MARKER;
/******/ var __webpack_exports__MASK = __webpack_exports__.MASK;
/******/ var __webpack_exports__MENU = __webpack_exports__.MENU;
/******/ var __webpack_exports__META = __webpack_exports__.META;
/******/ var __webpack_exports__METADATA = __webpack_exports__.METADATA;
/******/ var __webpack_exports__METER = __webpack_exports__.METER;
/******/ var __webpack_exports__MISSINGGLYPH = __webpack_exports__.MISSINGGLYPH;
/******/ var __webpack_exports__MPATH = __webpack_exports__.MPATH;
/******/ var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
/******/ var __webpack_exports__NAV = __webpack_exports__.NAV;
/******/ var __webpack_exports__NOSCRIPT = __webpack_exports__.NOSCRIPT;
/******/ var __webpack_exports__OBJECT = __webpack_exports__.OBJECT;
/******/ var __webpack_exports__OL = __webpack_exports__.OL;
/******/ var __webpack_exports__OPTGROUP = __webpack_exports__.OPTGROUP;
/******/ var __webpack_exports__OPTION = __webpack_exports__.OPTION;
/******/ var __webpack_exports__OUTPUT = __webpack_exports__.OUTPUT;
/******/ var __webpack_exports__P = __webpack_exports__.P;
/******/ var __webpack_exports__PATH = __webpack_exports__.PATH;
/******/ var __webpack_exports__PATTERN = __webpack_exports__.PATTERN;
/******/ var __webpack_exports__PICTURE = __webpack_exports__.PICTURE;
/******/ var __webpack_exports__POLYGON = __webpack_exports__.POLYGON;
/******/ var __webpack_exports__POLYLINE = __webpack_exports__.POLYLINE;
/******/ var __webpack_exports__PRE = __webpack_exports__.PRE;
/******/ var __webpack_exports__PREFETCH = __webpack_exports__.PREFETCH;
/******/ var __webpack_exports__PROGRESS = __webpack_exports__.PROGRESS;
/******/ var __webpack_exports__Q = __webpack_exports__.Q;
/******/ var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
/******/ var __webpack_exports__RADIALGRADIENT = __webpack_exports__.RADIALGRADIENT;
/******/ var __webpack_exports__RECT = __webpack_exports__.RECT;
/******/ var __webpack_exports__RP = __webpack_exports__.RP;
/******/ var __webpack_exports__RT = __webpack_exports__.RT;
/******/ var __webpack_exports__RUBY = __webpack_exports__.RUBY;
/******/ var __webpack_exports__S = __webpack_exports__.S;
/******/ var __webpack_exports__SAMP = __webpack_exports__.SAMP;
/******/ var __webpack_exports__SCRIPT = __webpack_exports__.SCRIPT;
/******/ var __webpack_exports__SECTION = __webpack_exports__.SECTION;
/******/ var __webpack_exports__SELECT = __webpack_exports__.SELECT;
/******/ var __webpack_exports__SET = __webpack_exports__.SET;
/******/ var __webpack_exports__SLOT = __webpack_exports__.SLOT;
/******/ var __webpack_exports__SMALL = __webpack_exports__.SMALL;
/******/ var __webpack_exports__SOLIDCOLOR = __webpack_exports__.SOLIDCOLOR;
/******/ var __webpack_exports__SOURCE = __webpack_exports__.SOURCE;
/******/ var __webpack_exports__SPAN = __webpack_exports__.SPAN;
/******/ var __webpack_exports__STOP = __webpack_exports__.STOP;
/******/ var __webpack_exports__STRONG = __webpack_exports__.STRONG;
/******/ var __webpack_exports__STYLE = __webpack_exports__.STYLE;
/******/ var __webpack_exports__SUB = __webpack_exports__.SUB;
/******/ var __webpack_exports__SUMMARY = __webpack_exports__.SUMMARY;
/******/ var __webpack_exports__SUP = __webpack_exports__.SUP;
/******/ var __webpack_exports__SVG = __webpack_exports__.SVG;
/******/ var __webpack_exports__SVG_ELEMENT_NAMES = __webpack_exports__.SVG_ELEMENT_NAMES;
/******/ var __webpack_exports__SWITCH = __webpack_exports__.SWITCH;
/******/ var __webpack_exports__SYMBOL = __webpack_exports__.SYMBOL;
/******/ var __webpack_exports__TABLE = __webpack_exports__.TABLE;
/******/ var __webpack_exports__TBODY = __webpack_exports__.TBODY;
/******/ var __webpack_exports__TBREAK = __webpack_exports__.TBREAK;
/******/ var __webpack_exports__TD = __webpack_exports__.TD;
/******/ var __webpack_exports__TEMPLATE = __webpack_exports__.TEMPLATE;
/******/ var __webpack_exports__TEXT = __webpack_exports__.TEXT;
/******/ var __webpack_exports__TEXTAREA = __webpack_exports__.TEXTAREA;
/******/ var __webpack_exports__TEXTPATH = __webpack_exports__.TEXTPATH;
/******/ var __webpack_exports__TFOOT = __webpack_exports__.TFOOT;
/******/ var __webpack_exports__TH = __webpack_exports__.TH;
/******/ var __webpack_exports__THEAD = __webpack_exports__.THEAD;
/******/ var __webpack_exports__TIME = __webpack_exports__.TIME;
/******/ var __webpack_exports__TITLE = __webpack_exports__.TITLE;
/******/ var __webpack_exports__TR = __webpack_exports__.TR;
/******/ var __webpack_exports__TRACK = __webpack_exports__.TRACK;
/******/ var __webpack_exports__TREF = __webpack_exports__.TREF;
/******/ var __webpack_exports__TSPAN = __webpack_exports__.TSPAN;
/******/ var __webpack_exports__Term = __webpack_exports__.Term;
/******/ var __webpack_exports__U = __webpack_exports__.U;
/******/ var __webpack_exports__UL = __webpack_exports__.UL;
/******/ var __webpack_exports__UNFINISHED_DEFINITION = __webpack_exports__.UNFINISHED_DEFINITION;
/******/ var __webpack_exports__UNKNOWN = __webpack_exports__.UNKNOWN;
/******/ var __webpack_exports__USE = __webpack_exports__.USE;
/******/ var __webpack_exports__Utils = __webpack_exports__.Utils;
/******/ var __webpack_exports__VAR = __webpack_exports__.VAR;
/******/ var __webpack_exports__VIDEO = __webpack_exports__.VIDEO;
/******/ var __webpack_exports__VIEW = __webpack_exports__.VIEW;
/******/ var __webpack_exports__VKERN = __webpack_exports__.VKERN;
/******/ var __webpack_exports__WBR = __webpack_exports__.WBR;
/******/ var __webpack_exports__build = __webpack_exports__.build;
/******/ var __webpack_exports__isSVGElement = __webpack_exports__.isSVGElement;
/******/ var __webpack_exports__loadComponentFromSource = __webpack_exports__.loadComponentFromSource;
/******/ export { __webpack_exports__A as A, __webpack_exports__ABBR as ABBR, __webpack_exports__ADDRESS as ADDRESS, __webpack_exports__ALTGLYPH as ALTGLYPH, __webpack_exports__ALTGLYPHDEF as ALTGLYPHDEF, __webpack_exports__ALTGLYPHITEM as ALTGLYPHITEM, __webpack_exports__ANIMATE as ANIMATE, __webpack_exports__ANIMATECOLOR as ANIMATECOLOR, __webpack_exports__ANIMATEMOTION as ANIMATEMOTION, __webpack_exports__ANIMATETRANSFORM as ANIMATETRANSFORM, __webpack_exports__ANIMATION as ANIMATION, __webpack_exports__AREA as AREA, __webpack_exports__ARTICLE as ARTICLE, __webpack_exports__ASIDE as ASIDE, __webpack_exports__AUDIO as AUDIO, __webpack_exports__B as B, __webpack_exports__BASE as BASE, __webpack_exports__BDI as BDI, __webpack_exports__BDO as BDO, __webpack_exports__BLOCKQUOTE as BLOCKQUOTE, __webpack_exports__BR as BR, __webpack_exports__BUTTON as BUTTON, __webpack_exports__CANVAS as CANVAS, __webpack_exports__CAPTION as CAPTION, __webpack_exports__CIRCLE as CIRCLE, __webpack_exports__CITE as CITE, __webpack_exports__CLIPPATH as CLIPPATH, __webpack_exports__CODE as CODE, __webpack_exports__COL as COL, __webpack_exports__COLGROUP as COLGROUP, __webpack_exports__COLORPROFILE as COLORPROFILE, __webpack_exports__CURSOR as CURSOR, __webpack_exports__DATA as DATA, __webpack_exports__DATALIST as DATALIST, __webpack_exports__DD as DD, __webpack_exports__DEFS as DEFS, __webpack_exports__DEL as DEL, __webpack_exports__DESC as DESC, __webpack_exports__DETAILS as DETAILS, __webpack_exports__DFN as DFN, __webpack_exports__DIALOG as DIALOG, __webpack_exports__DISCARD as DISCARD, __webpack_exports__DIV as DIV, __webpack_exports__DL as DL, __webpack_exports__DT as DT, __webpack_exports__ELLIPSE as ELLIPSE, __webpack_exports__EM as EM, __webpack_exports__EMBED as EMBED, __webpack_exports__ElementDefinition as ElementDefinition, __webpack_exports__FEBLEND as FEBLEND, __webpack_exports__FECOLORMATRIX as FECOLORMATRIX, __webpack_exports__FECOMPONENTTRANSFER as FECOMPONENTTRANSFER, __webpack_exports__FECOMPOSITE as FECOMPOSITE, __webpack_exports__FECONVOLVEMATRIX as FECONVOLVEMATRIX, __webpack_exports__FEDIFFUSELIGHTING as FEDIFFUSELIGHTING, __webpack_exports__FEDISPLACEMENTMAP as FEDISPLACEMENTMAP, __webpack_exports__FEDISTANTLIGHT as FEDISTANTLIGHT, __webpack_exports__FEDROPSHADOW as FEDROPSHADOW, __webpack_exports__FEFLOOD as FEFLOOD, __webpack_exports__FEFUNCA as FEFUNCA, __webpack_exports__FEFUNCB as FEFUNCB, __webpack_exports__FEFUNCG as FEFUNCG, __webpack_exports__FEFUNCR as FEFUNCR, __webpack_exports__FEGAUSSIANBLUR as FEGAUSSIANBLUR, __webpack_exports__FEIMAGE as FEIMAGE, __webpack_exports__FEMERGE as FEMERGE, __webpack_exports__FEMERGENODE as FEMERGENODE, __webpack_exports__FEMORPHOLOGY as FEMORPHOLOGY, __webpack_exports__FEOFFSET as FEOFFSET, __webpack_exports__FEPOINTLIGHT as FEPOINTLIGHT, __webpack_exports__FESPECULARLIGHTING as FESPECULARLIGHTING, __webpack_exports__FESPOTLIGHT as FESPOTLIGHT, __webpack_exports__FETILE as FETILE, __webpack_exports__FETURBULENCE as FETURBULENCE, __webpack_exports__FIELDSET as FIELDSET, __webpack_exports__FIGCAPTION as FIGCAPTION, __webpack_exports__FIGURE as FIGURE, __webpack_exports__FILTER as FILTER, __webpack_exports__FONT as FONT, __webpack_exports__FONTFACE as FONTFACE, __webpack_exports__FONTFACEFORMAT as FONTFACEFORMAT, __webpack_exports__FONTFACENAME as FONTFACENAME, __webpack_exports__FONTFACESRC as FONTFACESRC, __webpack_exports__FONTFACEURI as FONTFACEURI, __webpack_exports__FOOTER as FOOTER, __webpack_exports__FOREIGNOBJECT as FOREIGNOBJECT, __webpack_exports__FORM as FORM, __webpack_exports__G as G, __webpack_exports__GLYPH as GLYPH, __webpack_exports__GLYPHREF as GLYPHREF, __webpack_exports__H1 as H1, __webpack_exports__H2 as H2, __webpack_exports__H3 as H3, __webpack_exports__H4 as H4, __webpack_exports__H5 as H5, __webpack_exports__H6 as H6, __webpack_exports__HANDLER as HANDLER, __webpack_exports__HEADER as HEADER, __webpack_exports__HGROUP as HGROUP, __webpack_exports__HKERN as HKERN, __webpack_exports__HR as HR, __webpack_exports__I as I, __webpack_exports__IFRAME as IFRAME, __webpack_exports__IMAGE as IMAGE, __webpack_exports__IMG as IMG, __webpack_exports__INPUT as INPUT, __webpack_exports__INS as INS, __webpack_exports__KBD as KBD, __webpack_exports__LABEL as LABEL, __webpack_exports__LEGEND as LEGEND, __webpack_exports__LI as LI, __webpack_exports__LINE as LINE, __webpack_exports__LINEARGRADIENT as LINEARGRADIENT, __webpack_exports__LINK as LINK, __webpack_exports__LISTENER as LISTENER, __webpack_exports__MAIN as MAIN, __webpack_exports__MAP as MAP, __webpack_exports__MARK as MARK, __webpack_exports__MARKER as MARKER, __webpack_exports__MASK as MASK, __webpack_exports__MENU as MENU, __webpack_exports__META as META, __webpack_exports__METADATA as METADATA, __webpack_exports__METER as METER, __webpack_exports__MISSINGGLYPH as MISSINGGLYPH, __webpack_exports__MPATH as MPATH, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__NAV as NAV, __webpack_exports__NOSCRIPT as NOSCRIPT, __webpack_exports__OBJECT as OBJECT, __webpack_exports__OL as OL, __webpack_exports__OPTGROUP as OPTGROUP, __webpack_exports__OPTION as OPTION, __webpack_exports__OUTPUT as OUTPUT, __webpack_exports__P as P, __webpack_exports__PATH as PATH, __webpack_exports__PATTERN as PATTERN, __webpack_exports__PICTURE as PICTURE, __webpack_exports__POLYGON as POLYGON, __webpack_exports__POLYLINE as POLYLINE, __webpack_exports__PRE as PRE, __webpack_exports__PREFETCH as PREFETCH, __webpack_exports__PROGRESS as PROGRESS, __webpack_exports__Q as Q, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__RADIALGRADIENT as RADIALGRADIENT, __webpack_exports__RECT as RECT, __webpack_exports__RP as RP, __webpack_exports__RT as RT, __webpack_exports__RUBY as RUBY, __webpack_exports__S as S, __webpack_exports__SAMP as SAMP, __webpack_exports__SCRIPT as SCRIPT, __webpack_exports__SECTION as SECTION, __webpack_exports__SELECT as SELECT, __webpack_exports__SET as SET, __webpack_exports__SLOT as SLOT, __webpack_exports__SMALL as SMALL, __webpack_exports__SOLIDCOLOR as SOLIDCOLOR, __webpack_exports__SOURCE as SOURCE, __webpack_exports__SPAN as SPAN, __webpack_exports__STOP as STOP, __webpack_exports__STRONG as STRONG, __webpack_exports__STYLE as STYLE, __webpack_exports__SUB as SUB, __webpack_exports__SUMMARY as SUMMARY, __webpack_exports__SUP as SUP, __webpack_exports__SVG as SVG, __webpack_exports__SVG_ELEMENT_NAMES as SVG_ELEMENT_NAMES, __webpack_exports__SWITCH as SWITCH, __webpack_exports__SYMBOL as SYMBOL, __webpack_exports__TABLE as TABLE, __webpack_exports__TBODY as TBODY, __webpack_exports__TBREAK as TBREAK, __webpack_exports__TD as TD, __webpack_exports__TEMPLATE as TEMPLATE, __webpack_exports__TEXT as TEXT, __webpack_exports__TEXTAREA as TEXTAREA, __webpack_exports__TEXTPATH as TEXTPATH, __webpack_exports__TFOOT as TFOOT, __webpack_exports__TH as TH, __webpack_exports__THEAD as THEAD, __webpack_exports__TIME as TIME, __webpack_exports__TITLE as TITLE, __webpack_exports__TR as TR, __webpack_exports__TRACK as TRACK, __webpack_exports__TREF as TREF, __webpack_exports__TSPAN as TSPAN, __webpack_exports__Term as Term, __webpack_exports__U as U, __webpack_exports__UL as UL, __webpack_exports__UNFINISHED_DEFINITION as UNFINISHED_DEFINITION, __webpack_exports__UNKNOWN as UNKNOWN, __webpack_exports__USE as USE, __webpack_exports__Utils as Utils, __webpack_exports__VAR as VAR, __webpack_exports__VIDEO as VIDEO, __webpack_exports__VIEW as VIEW, __webpack_exports__VKERN as VKERN, __webpack_exports__WBR as WBR, __webpack_exports__build as build, __webpack_exports__isSVGElement as isSVGElement, __webpack_exports__loadComponentFromSource as loadComponentFromSource };
/******/ 

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUDs7QUFFQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7Ozs7Ozs7U0NoZkE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxJQUFJO1VBQ0o7VUFDQTtVQUNBLElBQUk7VUFDSjtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxDQUFDO1VBQ0Q7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLEVBQUU7VUFDRjtVQUNBLHNHQUFzRztVQUN0RztVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLEdBQUc7VUFDSDtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EsR0FBRztVQUNIO1VBQ0EsRUFBRTtVQUNGO1VBQ0E7Ozs7O1VDaEVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7OztTRU5BO1NBQ0E7U0FDQTtTQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgTXl0aGl4VUlDb21wb25lbnQ6IF9NeXRoaXhVSUNvbXBvbmVudCB9ID0gYXdhaXQgaW1wb3J0KCcuL2NvbXBvbmVudC5qcycpO1xuXG5jb25zdCBJU19URU1QTEFURSA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IElTX1NDUklQVCAgID0gL14oc2NyaXB0KSQvaTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRDb21wb25lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIHVybCwgc291cmNlU3RyaW5nKSB7XG4gIGxldCBiYXNlVVJMID0gbmV3IFVSTCh1cmwpO1xuICBsZXQgZmlsZU5hbWU7XG5cbiAgYmFzZVVSTC5wYXRobmFtZSA9IGJhc2VVUkwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KTtcblxuICBsZXQgdGVtcGxhdGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG5cbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlU3RyaW5nO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCB4ID0gYS50YWdOYW1lO1xuICAgIGxldCB5ID0gYi50YWdOYW1lO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuICAgIGlmICh4ID09IHkpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHJldHVybiAoeCA8IHkpID8gMSA6IC0xO1xuICB9KTtcblxuICBjb25zdCBmaWxlTmFtZVRvRWxlbWVudE5hbWUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICByZXR1cm4gZmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLi4qJC8sICcnKS5yZXBsYWNlKC9cXGJbQS1aXXxbXkEtWl1bQS1aXS9nLCAoX20pID0+IHtcbiAgICAgIGxldCBtID0gX20udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiAobS5sZW5ndGggPCAyKSA/IGAtJHttfWAgOiBgJHttLmNoYXJBdCgwKX0tJHttLmNoYXJBdCgxKX1gO1xuICAgIH0pLnJlcGxhY2UoLy17Mix9L2csICctJykucmVwbGFjZSgvXlteYS16XSovLCAnJykucmVwbGFjZSgvW15hLXpdKiQvLCAnJyk7XG4gIH07XG5cbiAgbGV0IHRlbXBsYXRlQ291bnQgPSBjaGlsZHJlbi5yZWR1Y2UoKHN1bSwgZWxlbWVudCkgPT4gKChJU19URU1QTEFURS50ZXN0KGVsZW1lbnQudGFnTmFtZSkpID8gKHN1bSArIDEpIDogc3VtKSwgMCk7XG4gIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHtcbiAgICAgIGlmICh0ZW1wbGF0ZUNvdW50ID09PSAxICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSA9PSBudWxsICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnKSA9PSBudWxsKSB7XG4gICAgICAgIGxldCBndWVzc2VkRWxlbWVudE5hbWUgPSBmaWxlTmFtZVRvRWxlbWVudE5hbWUoZmlsZU5hbWUpO1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgb3duZXJEb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKElTX1NDUklQVC50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBsZXQgY2hpbGRDbG9uZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2YgY2hpbGQuZ2V0QXR0cmlidXRlTmFtZXMoKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgY2hpbGQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpKTtcblxuICAgICAgbGV0IHNyYyA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIGlmICgoL15cXC5cXC98W146XSpcXC98LykudGVzdChzcmMpKSB7XG4gICAgICAgICAgbGV0IG5ld1NyYyA9IG5ldyBVUkwoYmFzZVVSTC50b1N0cmluZygpKTtcbiAgICAgICAgICBuZXdTcmMucGF0aG5hbWUgKz0gc3JjO1xuICAgICAgICAgIHNyYyA9IG5ld1NyYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcmMgPSBuZXcgVVJMKHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG4gICAgICAgIGNoaWxkQ2xvbmUuaW5uZXJIVE1MID0gY2hpbGQudGV4dENvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKCgvXihsaW5rfHN0eWxlKSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkge1xuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL14obWV0YSkkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSkpIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcgd2l0aCB0aGVzZSB0YWdzXG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgLy8gYXBwZW5kIGV2ZXJ5dGhpbmcgZWxzZSB0byB0aGUgYm9keVxuICAgICAgb3duZXJEb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVxdWlyZSBleHRlbmRzIF9NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChzcmMpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIGxvYWRDb21wb25lbnRGcm9tU291cmNlKHRoaXMub3duZXJEb2N1bWVudCwgcmVzcG9uc2UudXJsLCBib2R5KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgbXl0aGl4LXJlcXVpcmU6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ215dGhpeC1yZXF1aXJlJywgUmVxdWlyZSk7XG4iLCJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGxldCBfYm9keSAgID0gcnVsZS5jc3NUZXh0LnN1YnN0cmluZyhydWxlLnNlbGVjdG9yVGV4dC5sZW5ndGgpLnRyaW0oKTtcbiAgbGV0IHJlc3VsdCAgPSAoY2FsbGJhY2socnVsZS5zZWxlY3RvclRleHQsIF9ib2R5KSB8fCBbXSkuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAoIXJlc3VsdClcbiAgICByZXR1cm4gJyc7XG5cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGNzc1J1bGVzVG9Tb3VyY2UoY3NzUnVsZXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGNzc1J1bGVzIHx8IFtdKS5tYXAoKHJ1bGUpID0+IHtcbiAgICBsZXQgcnVsZVN0ciA9IGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spO1xuICAgIHJldHVybiBgJHtjc3NSdWxlc1RvU291cmNlKHJ1bGUuY3NzUnVsZXMsIGNhbGxiYWNrKX0ke3J1bGVTdHJ9YDtcbiAgfSkuam9pbignXFxuXFxuJyk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGVsZW1lbnROYW1lLCBzdHlsZUVsZW1lbnQpIHtcbiAgY29uc3QgaGFuZGxlSG9zdCA9IChtLCB0eXBlLCBfY29udGVudCkgPT4ge1xuICAgIGxldCBjb250ZW50ID0gKCFfY29udGVudCkgPyBfY29udGVudCA6IF9jb250ZW50LnJlcGxhY2UoL15cXCgvLCAnJykucmVwbGFjZSgvXFwpJC8sICcnKTtcblxuICAgIGlmICh0eXBlID09PSAnOmhvc3QnKSB7XG4gICAgICBpZiAoIWNvbnRlbnQpXG4gICAgICAgIHJldHVybiBlbGVtZW50TmFtZTtcblxuICAgICAgLy8gRWxlbWVudCBzZWxlY3Rvcj9cbiAgICAgIGlmICgoL15bYS16QS1aX10vKS50ZXN0KGNvbnRlbnQpKVxuICAgICAgICByZXR1cm4gYCR7Y29udGVudH1bZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbiAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4gICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3RvcjtcbiAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4gICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuICAgICAgICB0YWdzLnB1c2gobSk7XG4gICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4gICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuICAgIH0sXG4gICk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4gIGxldCBvYmpJRCAgICAgICAgICAgICA9IFV0aWxzLmdldE9iaklEKHRlbXBsYXRlKTtcbiAgbGV0IHRlbXBsYXRlSUQgICAgICAgID0gVXRpbHMuU0hBMjU2KG9iaklEKTtcbiAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4gIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbiAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGAjJHtzdHlsZUlEfWApKSB7XG4gICAgICBsZXQgY2xvbmVkU3R5bGVFbGVtZW50ID0gdGVtcGxhdGVDaGlsZC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IG5ld1N0eWxlU2hlZXQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudChjb21wb25lbnROYW1lLCBjbG9uZWRTdHlsZUVsZW1lbnQpO1xuICAgICAgb3duZXJEb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbiAgICAgIGxldCBzdHlsZU5vZGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICAgIHN0eWxlTm9kZS5pbm5lckhUTUwgPSBuZXdTdHlsZVNoZWV0O1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQ7XG4gIHN0YXRpYyByZWdpc3RlciA9IGZ1bmN0aW9uKG5hbWUsIEtsYXNzKSB7XG4gICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKG5hbWUgfHwgdGhpcy50YWdOYW1lLCBLbGFzcyB8fCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgVXRpbHMuYmluZE1ldGhvZHMuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgWyBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpIF0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NlbnNpdGl2ZVRhZ05hbWUnOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lELFxuICAgICAgfSxcbiAgICAgICdkZWxheVRpbWVycyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2hhZG93Jzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd0RPTSgpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGZvcm1hdFRlbXBsYXRlTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZSlcbiAgICAgIHJldHVybiBub2RlO1xuXG4gICAgZm9yIChsZXQgY2hpbGROb2RlIG9mIEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKSkge1xuICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgY2hpbGROb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0odGhpcywgY2hpbGROb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBjaGlsZE5vZGUubm9kZVR5cGUgPj0gTm9kZS5ET0NVTUVOVF9OT0RFKSB7XG4gICAgICAgIGNoaWxkTm9kZSA9IHRoaXMuZm9ybWF0VGVtcGxhdGVOb2RlcyhjaGlsZE5vZGUpO1xuXG4gICAgICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChjaGlsZE5vZGUpO1xuICAgICAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZU5hbWVzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gY2hpbGROb2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQodGhpcywgY2hpbGROb2RlLCBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICBjaGlsZE5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybSh0aGlzLCBhdHRyaWJ1dGVOb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNyZWF0ZVNoYWRvd0RPTShvcHRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZW52aXJvbm1lbnQgc3VwcG9ydFxuICAgIGlmICh0eXBlb2YgdGhpcy5hdHRhY2hTaGFkb3cgIT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMudGVtcGxhdGVJRClcbiAgICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlEKTtcblxuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXSx0ZW1wbGF0ZVtkYXRhLWZvcj1cIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiIGldYCk7XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgaWYgKHRoaXMudGVtcGxhdGUpIHtcbiAgICAgIGVuc3VyZURvY3VtZW50U3R5bGVzLmNhbGwodGhpcywgdGhpcy5vd25lckRvY3VtZW50LCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUsIHRoaXMudGVtcGxhdGUpO1xuXG4gICAgICBsZXQgZm9ybWF0dGVkVGVtcGxhdGUgPSB0aGlzLmZvcm1hdFRlbXBsYXRlTm9kZXModGhpcy50ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChmb3JtYXR0ZWRUZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5tb3VudGVkKCk7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVubW91bnRlZCgpO1xuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy4kKHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKSk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH1cblxuICBidWlsZChjYWxsYmFjaykge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgWyBjYWxsYmFjayhFbGVtZW50cywge30pIF0pO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eShuYW1lLCBfdmFsdWUsIF9jb250ZXh0KSB7XG4gICAgbGV0IHZhbHVlICAgPSBuZXcgVXRpbHMuRHluYW1pY1Byb3BlcnR5KF92YWx1ZSk7XG4gICAgbGV0IGNvbnRleHQgPSBfY29udGV4dCB8fCB0aGlzO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29udGV4dCwge1xuICAgICAgW25hbWVdOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiB2YWx1ZSxcbiAgICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICB2YWx1ZS5zZXQodGhpcywgbmV3VmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgdGhpcy5jcmVhdGVEeW5hbWljUHJvcGVydHkoa2V5LCB2YWx1ZSwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBkZWJvdW5jZShjYWxsYmFjaywgbXMsIF9pZCkge1xuICAgIHZhciBpZCA9IF9pZDtcblxuICAgIC8vIElmIHdlIGRvbid0IGdldCBhbiBpZCBmcm9tIHRoZSB1c2VyLCB0aGVuIGd1ZXNzIHRoZSBpZCBieSB0dXJuaW5nIHRoZSBmdW5jdGlvblxuICAgIC8vIGludG8gYSBzdHJpbmcgKHJhdyBzb3VyY2UpIGFuZCB1c2UgdGhhdCBmb3IgYW4gaWQgaW5zdGVhZFxuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICBpZCA9ICgnJyArIGNhbGxiYWNrKTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhIHRyYW5zcGlsZWQgY29kZSwgdGhlbiBhbiBhc3luYyBnZW5lcmF0b3Igd2lsbCBiZSB1c2VkIGZvciBhc3luYyBmdW5jdGlvbnNcbiAgICAgIC8vIFRoaXMgd3JhcHMgdGhlIHJlYWwgZnVuY3Rpb24sIGFuZCBzbyB3aGVuIGNvbnZlcnRpbmcgdGhlIGZ1bmN0aW9uIGludG8gYSBzdHJpbmdcbiAgICAgIC8vIGl0IHdpbGwgTk9UIGJlIHVuaXF1ZSBwZXIgY2FsbC1zaXRlLiBGb3IgdGhpcyByZWFzb24sIGlmIHdlIGRldGVjdCB0aGlzIGlzc3VlLFxuICAgICAgLy8gd2Ugd2lsbCBnbyB0aGUgXCJzbG93XCIgcm91dGUgYW5kIGNyZWF0ZSBhIHN0YWNrIHRyYWNlLCBhbmQgdXNlIHRoYXQgZm9yIHRoZSB1bmlxdWUgaWRcbiAgICAgIGlmIChpZC5tYXRjaCgvYXN5bmNHZW5lcmF0b3JTdGVwLykpIHtcbiAgICAgICAgaWQgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgICAgICBjb25zb2xlLndhcm4oJ215dGhpeC11aSB3YXJuaW5nOiBcInRoaXMuZGVsYXlcIiBjYWxsZWQgd2l0aG91dCBhIHNwZWNpZmllZCBcImlkXCIgcGFyYW1ldGVyLiBUaGlzIHdpbGwgcmVzdWx0IGluIGEgcGVyZm9ybWFuY2UgaGl0LiBQbGVhc2Ugc3BlY2lmeSBhbmQgXCJpZFwiIGFyZ3VtZW50IGZvciB5b3VyIGNhbGw6IFwidGhpcy5kZWxheShjYWxsYmFjaywgbXMsIFxcJ3NvbWUtY3VzdG9tLWNhbGwtc2l0ZS1pZFxcJylcIicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9ICgnJyArIGlkKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnaWQnLCBpZCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UudGltZXJJRClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcbiAgICB9XG5cbiAgICBwcm9taXNlID0gVXRpbHMuY3JlYXRlUmVzb2x2YWJsZSgpO1xuICAgIHRoaXMuZGVsYXlUaW1lcnMuc2V0KGlkLCBwcm9taXNlKTtcblxuICAgIC8vIExldCdzIG5vdCBjb21wbGFpbiBhYm91dFxuICAgIC8vIHVuY2F1Z2h0IGVycm9yc1xuICAgIHByb21pc2UuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgcHJvbWlzZS50aW1lcklEID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBjYWxsaW5nIFwiZGVsYXlcIiBjYWxsYmFjazogJywgZXJyb3IsIGNhbGxiYWNrLnRvU3RyaW5nKCkpO1xuICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgfSwgbXMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsYXNzZXMoLi4uX2FyZ3MpIHtcbiAgICBsZXQgYXJncyA9IF9hcmdzLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoaXRlbSkpIHtcbiAgICAgICAgbGV0IGtleXMgID0gT2JqZWN0LmtleXMoaXRlbSk7XG4gICAgICAgIGxldCBpdGVtcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICAgICAgbGV0IHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGl0ZW1zLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhcmdzKSkuam9pbignICcpO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiA9IFN5bWJvbC5mb3IoJy9qb3kvZWxlbWVudERlZmluaXRpb24vY29uc3RhbnRzL3VuZmluaXNoZWQnKTtcblxuY29uc3QgSVNfUFJPUF9OQU1FID0gL15wcm9wXFwkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IodGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKTtcbiAgfVxuXG4gIGJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KSB7XG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyaWJ1dGVzLnZhbHVlIHx8ICcnKTtcbiAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgdGV4dE5vZGUpO1xuICAgICAgcmV0dXJuIHRleHROb2RlO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2VVUkkpXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZ05hbWUpO1xuXG4gICAgY29uc3QgaGFuZGxlQXR0cmlidXRlID0gKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIF9hdHRyaWJ1dGVWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBfYXR0cmlidXRlVmFsdWU7XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQoY29udGV4dCwgZWxlbWVudCwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgIGlmIChVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIGF0dHJpYnV0ZVxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuXG4gICAgICAgICAgLy8gR2V0IGF0dHJpYnV0ZSBub2RlIGp1c3QgY3JlYXRlZFxuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKGNvbnRleHQsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIER5bmFtaWMgYmluZGluZ3MgYXJlIG5vdCBhbGxvd2VkIGZvciBwcm9wZXJ0aWVzXG4gICAgY29uc3QgaGFuZGxlUHJvcGVydHkgPSAoZWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKSA9PiB7XG4gICAgICBsZXQgbmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKElTX1BST1BfTkFNRSwgJycpO1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICBoYW5kbGVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQgY2hpbGQgICAgICAgICA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBsZXQgY2hpbGRFbGVtZW50ICA9IGNoaWxkLmJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBzY29wZSkge1xuICBpZiAoIXRhZ05hbWUgfHwgIVV0aWxzLmlzVHlwZSh0YWdOYW1lLCAnU3RyaW5nJykpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGNyZWF0ZSBhbiBFbGVtZW50RGVmaW5pdGlvbiB3aXRob3V0IGEgXCJ0YWdOYW1lXCIuJyk7XG5cbiAgY29uc3QgZmluYWxpemVyID0gKC4uLl9jaGlsZHJlbikgPT4ge1xuICAgIGxldCBjaGlsZHJlbiA9IF9jaGlsZHJlbi5tYXAoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIGlmICh2YWx1ZVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICByZXR1cm4gdmFsdWUoKTtcblxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudERlZmluaXRpb24pXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgaWYgKCFVdGlscy5pc1R5cGUodmFsdWUsICdTdHJpbmcnKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZTogKCcnICsgdmFsdWUpIH0pO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24odGFnTmFtZSwgc2NvcGUsIGNoaWxkcmVuKTtcbiAgfTtcblxuICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KGZpbmFsaXplciwge1xuICAgIGdldDogKHRhcmdldCwgYXR0cmlidXRlTmFtZSkgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgbGV0IHNjb3BlZFByb3h5ID0gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgZGVmYXVsdEF0dHJpYnV0ZXMgfHwge30pKTtcbiAgICAgICAgcmV0dXJuIHNjb3BlZFByb3h5W2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KFxuICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBzY29wZVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiByb290UHJveHk7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBnZXQ6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuXG5jb25zdCBFID0gKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKSA9PiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcyk7XG5cbmV4cG9ydCBjb25zdCBBICAgICAgICAgID0gRSgnYScpO1xuZXhwb3J0IGNvbnN0IEFCQlIgICAgICAgPSBFKCdhYmJyJyk7XG5leHBvcnQgY29uc3QgQUREUkVTUyAgICA9IEUoJ2FkZHJlc3MnKTtcbmV4cG9ydCBjb25zdCBBUkVBICAgICAgID0gRSgnYXJlYScpO1xuZXhwb3J0IGNvbnN0IEFSVElDTEUgICAgPSBFKCdhcnRpY2xlJyk7XG5leHBvcnQgY29uc3QgQVNJREUgICAgICA9IEUoJ2FzaWRlJyk7XG5leHBvcnQgY29uc3QgQVVESU8gICAgICA9IEUoJ2F1ZGlvJyk7XG5leHBvcnQgY29uc3QgQiAgICAgICAgICA9IEUoJ2InKTtcbmV4cG9ydCBjb25zdCBCQVNFICAgICAgID0gRSgnYmFzZScpO1xuZXhwb3J0IGNvbnN0IEJESSAgICAgICAgPSBFKCdiZGknKTtcbmV4cG9ydCBjb25zdCBCRE8gICAgICAgID0gRSgnYmRvJyk7XG5leHBvcnQgY29uc3QgQkxPQ0tRVU9URSA9IEUoJ2Jsb2NrcXVvdGUnKTtcbmV4cG9ydCBjb25zdCBCUiAgICAgICAgID0gRSgnYnInKTtcbmV4cG9ydCBjb25zdCBCVVRUT04gICAgID0gRSgnYnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ0FOVkFTICAgICA9IEUoJ2NhbnZhcycpO1xuZXhwb3J0IGNvbnN0IENBUFRJT04gICAgPSBFKCdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgQ0lURSAgICAgICA9IEUoJ2NpdGUnKTtcbmV4cG9ydCBjb25zdCBDT0RFICAgICAgID0gRSgnY29kZScpO1xuZXhwb3J0IGNvbnN0IENPTCAgICAgICAgPSBFKCdjb2wnKTtcbmV4cG9ydCBjb25zdCBDT0xHUk9VUCAgID0gRSgnY29sZ3JvdXAnKTtcbmV4cG9ydCBjb25zdCBEQVRBICAgICAgID0gRSgnZGF0YScpO1xuZXhwb3J0IGNvbnN0IERBVEFMSVNUICAgPSBFKCdkYXRhbGlzdCcpO1xuZXhwb3J0IGNvbnN0IEREICAgICAgICAgPSBFKCdkZCcpO1xuZXhwb3J0IGNvbnN0IERFTCAgICAgICAgPSBFKCdkZWwnKTtcbmV4cG9ydCBjb25zdCBERVRBSUxTICAgID0gRSgnZGV0YWlscycpO1xuZXhwb3J0IGNvbnN0IERGTiAgICAgICAgPSBFKCdkZm4nKTtcbmV4cG9ydCBjb25zdCBESUFMT0cgICAgID0gRSgnZGlhbG9nJyk7XG5leHBvcnQgY29uc3QgRElWICAgICAgICA9IEUoJ2RpdicpO1xuZXhwb3J0IGNvbnN0IERMICAgICAgICAgPSBFKCdkbCcpO1xuZXhwb3J0IGNvbnN0IERUICAgICAgICAgPSBFKCdkdCcpO1xuZXhwb3J0IGNvbnN0IEVNICAgICAgICAgPSBFKCdlbScpO1xuZXhwb3J0IGNvbnN0IEVNQkVEICAgICAgPSBFKCdlbWJlZCcpO1xuZXhwb3J0IGNvbnN0IEZJRUxEU0VUICAgPSBFKCdmaWVsZHNldCcpO1xuZXhwb3J0IGNvbnN0IEZJR0NBUFRJT04gPSBFKCdmaWdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgRklHVVJFICAgICA9IEUoJ2ZpZ3VyZScpO1xuZXhwb3J0IGNvbnN0IEZPT1RFUiAgICAgPSBFKCdmb290ZXInKTtcbmV4cG9ydCBjb25zdCBGT1JNICAgICAgID0gRSgnZm9ybScpO1xuZXhwb3J0IGNvbnN0IEgxICAgICAgICAgPSBFKCdoMScpO1xuZXhwb3J0IGNvbnN0IEgyICAgICAgICAgPSBFKCdoMicpO1xuZXhwb3J0IGNvbnN0IEgzICAgICAgICAgPSBFKCdoMycpO1xuZXhwb3J0IGNvbnN0IEg0ICAgICAgICAgPSBFKCdoNCcpO1xuZXhwb3J0IGNvbnN0IEg1ICAgICAgICAgPSBFKCdoNScpO1xuZXhwb3J0IGNvbnN0IEg2ICAgICAgICAgPSBFKCdoNicpO1xuZXhwb3J0IGNvbnN0IEhFQURFUiAgICAgPSBFKCdoZWFkZXInKTtcbmV4cG9ydCBjb25zdCBIR1JPVVAgICAgID0gRSgnaGdyb3VwJyk7XG5leHBvcnQgY29uc3QgSFIgICAgICAgICA9IEUoJ2hyJyk7XG5leHBvcnQgY29uc3QgSSAgICAgICAgICA9IEUoJ2knKTtcbmV4cG9ydCBjb25zdCBJRlJBTUUgICAgID0gRSgnaWZyYW1lJyk7XG5leHBvcnQgY29uc3QgSU1HICAgICAgICA9IEUoJ2ltZycpO1xuZXhwb3J0IGNvbnN0IElOUFVUICAgICAgPSBFKCdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IElOUyAgICAgICAgPSBFKCdpbnMnKTtcbmV4cG9ydCBjb25zdCBLQkQgICAgICAgID0gRSgna2JkJyk7XG5leHBvcnQgY29uc3QgTEFCRUwgICAgICA9IEUoJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgTEVHRU5EICAgICA9IEUoJ2xlZ2VuZCcpO1xuZXhwb3J0IGNvbnN0IExJICAgICAgICAgPSBFKCdsaScpO1xuZXhwb3J0IGNvbnN0IExJTksgICAgICAgPSBFKCdsaW5rJyk7XG5leHBvcnQgY29uc3QgTUFJTiAgICAgICA9IEUoJ21haW4nKTtcbmV4cG9ydCBjb25zdCBNQVAgICAgICAgID0gRSgnbWFwJyk7XG5leHBvcnQgY29uc3QgTUFSSyAgICAgICA9IEUoJ21hcmsnKTtcbmV4cG9ydCBjb25zdCBNRU5VICAgICAgID0gRSgnbWVudScpO1xuZXhwb3J0IGNvbnN0IE1FVEEgICAgICAgPSBFKCdtZXRhJyk7XG5leHBvcnQgY29uc3QgTUVURVIgICAgICA9IEUoJ21ldGVyJyk7XG5leHBvcnQgY29uc3QgTkFWICAgICAgICA9IEUoJ25hdicpO1xuZXhwb3J0IGNvbnN0IE5PU0NSSVBUICAgPSBFKCdub3NjcmlwdCcpO1xuZXhwb3J0IGNvbnN0IE9CSkVDVCAgICAgPSBFKCdvYmplY3QnKTtcbmV4cG9ydCBjb25zdCBPTCAgICAgICAgID0gRSgnb2wnKTtcbmV4cG9ydCBjb25zdCBPUFRHUk9VUCAgID0gRSgnb3B0Z3JvdXAnKTtcbmV4cG9ydCBjb25zdCBPUFRJT04gICAgID0gRSgnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgT1VUUFVUICAgICA9IEUoJ291dHB1dCcpO1xuZXhwb3J0IGNvbnN0IFAgICAgICAgICAgPSBFKCdwJyk7XG5leHBvcnQgY29uc3QgUElDVFVSRSAgICA9IEUoJ3BpY3R1cmUnKTtcbmV4cG9ydCBjb25zdCBQUkUgICAgICAgID0gRSgncHJlJyk7XG5leHBvcnQgY29uc3QgUFJPR1JFU1MgICA9IEUoJ3Byb2dyZXNzJyk7XG5leHBvcnQgY29uc3QgUSAgICAgICAgICA9IEUoJ3EnKTtcbmV4cG9ydCBjb25zdCBSUCAgICAgICAgID0gRSgncnAnKTtcbmV4cG9ydCBjb25zdCBSVCAgICAgICAgID0gRSgncnQnKTtcbmV4cG9ydCBjb25zdCBSVUJZICAgICAgID0gRSgncnVieScpO1xuZXhwb3J0IGNvbnN0IFMgICAgICAgICAgPSBFKCdzJyk7XG5leHBvcnQgY29uc3QgU0FNUCAgICAgICA9IEUoJ3NhbXAnKTtcbmV4cG9ydCBjb25zdCBTQ1JJUFQgICAgID0gRSgnc2NyaXB0Jyk7XG5leHBvcnQgY29uc3QgU0VDVElPTiAgICA9IEUoJ3NlY3Rpb24nKTtcbmV4cG9ydCBjb25zdCBTRUxFQ1QgICAgID0gRSgnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3QgU0xPVCAgICAgICA9IEUoJ3Nsb3QnKTtcbmV4cG9ydCBjb25zdCBTTUFMTCAgICAgID0gRSgnc21hbGwnKTtcbmV4cG9ydCBjb25zdCBTT1VSQ0UgICAgID0gRSgnc291cmNlJyk7XG5leHBvcnQgY29uc3QgU1BBTiAgICAgICA9IEUoJ3NwYW4nKTtcbmV4cG9ydCBjb25zdCBTVFJPTkcgICAgID0gRSgnc3Ryb25nJyk7XG5leHBvcnQgY29uc3QgU1RZTEUgICAgICA9IEUoJ3N0eWxlJyk7XG5leHBvcnQgY29uc3QgU1VCICAgICAgICA9IEUoJ3N1YicpO1xuZXhwb3J0IGNvbnN0IFNVTU1BUlkgICAgPSBFKCdzdW1tYXJ5Jyk7XG5leHBvcnQgY29uc3QgU1VQICAgICAgICA9IEUoJ3N1cCcpO1xuZXhwb3J0IGNvbnN0IFRBQkxFICAgICAgPSBFKCd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IFRCT0RZICAgICAgPSBFKCd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IFREICAgICAgICAgPSBFKCd0ZCcpO1xuZXhwb3J0IGNvbnN0IFRFTVBMQVRFICAgPSBFKCd0ZW1wbGF0ZScpO1xuZXhwb3J0IGNvbnN0IFRFWFRBUkVBICAgPSBFKCd0ZXh0YXJlYScpO1xuZXhwb3J0IGNvbnN0IFRGT09UICAgICAgPSBFKCd0Zm9vdCcpO1xuZXhwb3J0IGNvbnN0IFRIICAgICAgICAgPSBFKCd0aCcpO1xuZXhwb3J0IGNvbnN0IFRIRUFEICAgICAgPSBFKCd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IFRJTUUgICAgICAgPSBFKCd0aW1lJyk7XG5leHBvcnQgY29uc3QgVElUTEUgICAgICA9IEUoJ3RpdGxlJyk7XG5leHBvcnQgY29uc3QgVFIgICAgICAgICA9IEUoJ3RyJyk7XG5leHBvcnQgY29uc3QgVFJBQ0sgICAgICA9IEUoJ3RyYWNrJyk7XG5leHBvcnQgY29uc3QgVSAgICAgICAgICA9IEUoJ3UnKTtcbmV4cG9ydCBjb25zdCBVTCAgICAgICAgID0gRSgndWwnKTtcbmV4cG9ydCBjb25zdCBWQVIgICAgICAgID0gRSgndmFyJyk7XG5leHBvcnQgY29uc3QgVklERU8gICAgICA9IEUoJ3ZpZGVvJyk7XG5leHBvcnQgY29uc3QgV0JSICAgICAgICA9IEUoJ3dicicpO1xuXG5jb25zdCBTRSA9ICh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcykgPT4gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMpO1xuXG4vLyBTVkcgZWxlbWVudCBuYW1lc1xuZXhwb3J0IGNvbnN0IEFMVEdMWVBIICAgICAgICAgICAgID0gU0UoJ2FsdGdseXBoJyk7XG5leHBvcnQgY29uc3QgQUxUR0xZUEhERUYgICAgICAgICAgPSBTRSgnYWx0Z2x5cGhkZWYnKTtcbmV4cG9ydCBjb25zdCBBTFRHTFlQSElURU0gICAgICAgICA9IFNFKCdhbHRnbHlwaGl0ZW0nKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFICAgICAgICAgICAgICA9IFNFKCdhbmltYXRlJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURUNPTE9SICAgICAgICAgPSBTRSgnYW5pbWF0ZUNvbG9yJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURU1PVElPTiAgICAgICAgPSBTRSgnYW5pbWF0ZU1vdGlvbicpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVEVUUkFOU0ZPUk0gICAgID0gU0UoJ2FuaW1hdGVUcmFuc2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT04gICAgICAgICAgICA9IFNFKCdhbmltYXRpb24nKTtcbmV4cG9ydCBjb25zdCBDSVJDTEUgICAgICAgICAgICAgICA9IFNFKCdjaXJjbGUnKTtcbmV4cG9ydCBjb25zdCBDTElQUEFUSCAgICAgICAgICAgICA9IFNFKCdjbGlwUGF0aCcpO1xuZXhwb3J0IGNvbnN0IENPTE9SUFJPRklMRSAgICAgICAgID0gU0UoJ2NvbG9yUHJvZmlsZScpO1xuZXhwb3J0IGNvbnN0IENVUlNPUiAgICAgICAgICAgICAgID0gU0UoJ2N1cnNvcicpO1xuZXhwb3J0IGNvbnN0IERFRlMgICAgICAgICAgICAgICAgID0gU0UoJ2RlZnMnKTtcbmV4cG9ydCBjb25zdCBERVNDICAgICAgICAgICAgICAgICA9IFNFKCdkZXNjJyk7XG5leHBvcnQgY29uc3QgRElTQ0FSRCAgICAgICAgICAgICAgPSBTRSgnZGlzY2FyZCcpO1xuZXhwb3J0IGNvbnN0IEVMTElQU0UgICAgICAgICAgICAgID0gU0UoJ2VsbGlwc2UnKTtcbmV4cG9ydCBjb25zdCBGRUJMRU5EICAgICAgICAgICAgICA9IFNFKCdmZWJsZW5kJyk7XG5leHBvcnQgY29uc3QgRkVDT0xPUk1BVFJJWCAgICAgICAgPSBTRSgnZmVjb2xvcm1hdHJpeCcpO1xuZXhwb3J0IGNvbnN0IEZFQ09NUE9ORU5UVFJBTlNGRVIgID0gU0UoJ2ZlY29tcG9uZW50dHJhbnNmZXInKTtcbmV4cG9ydCBjb25zdCBGRUNPTVBPU0lURSAgICAgICAgICA9IFNFKCdmZWNvbXBvc2l0ZScpO1xuZXhwb3J0IGNvbnN0IEZFQ09OVk9MVkVNQVRSSVggICAgID0gU0UoJ2ZlY29udm9sdmVtYXRyaXgnKTtcbmV4cG9ydCBjb25zdCBGRURJRkZVU0VMSUdIVElORyAgICA9IFNFKCdmZWRpZmZ1c2VsaWdodGluZycpO1xuZXhwb3J0IGNvbnN0IEZFRElTUExBQ0VNRU5UTUFQICAgID0gU0UoJ2ZlZGlzcGxhY2VtZW50bWFwJyk7XG5leHBvcnQgY29uc3QgRkVESVNUQU5UTElHSFQgICAgICAgPSBTRSgnZmVkaXN0YW50bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRURST1BTSEFET1cgICAgICAgICA9IFNFKCdmZWRyb3BzaGFkb3cnKTtcbmV4cG9ydCBjb25zdCBGRUZMT09EICAgICAgICAgICAgICA9IFNFKCdmZWZsb29kJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DQSAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jYScpO1xuZXhwb3J0IGNvbnN0IEZFRlVOQ0IgICAgICAgICAgICAgID0gU0UoJ2ZlZnVuY2InKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNHICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNnJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DUiAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jcicpO1xuZXhwb3J0IGNvbnN0IEZFR0FVU1NJQU5CTFVSICAgICAgID0gU0UoJ2ZlZ2F1c3NpYW5ibHVyJyk7XG5leHBvcnQgY29uc3QgRkVJTUFHRSAgICAgICAgICAgICAgPSBTRSgnZmVpbWFnZScpO1xuZXhwb3J0IGNvbnN0IEZFTUVSR0UgICAgICAgICAgICAgID0gU0UoJ2ZlbWVyZ2UnKTtcbmV4cG9ydCBjb25zdCBGRU1FUkdFTk9ERSAgICAgICAgICA9IFNFKCdmZW1lcmdlbm9kZScpO1xuZXhwb3J0IGNvbnN0IEZFTU9SUEhPTE9HWSAgICAgICAgID0gU0UoJ2ZlbW9ycGhvbG9neScpO1xuZXhwb3J0IGNvbnN0IEZFT0ZGU0VUICAgICAgICAgICAgID0gU0UoJ2Zlb2Zmc2V0Jyk7XG5leHBvcnQgY29uc3QgRkVQT0lOVExJR0hUICAgICAgICAgPSBTRSgnZmVwb2ludGxpZ2h0Jyk7XG5leHBvcnQgY29uc3QgRkVTUEVDVUxBUkxJR0hUSU5HICAgPSBTRSgnZmVzcGVjdWxhcmxpZ2h0aW5nJyk7XG5leHBvcnQgY29uc3QgRkVTUE9UTElHSFQgICAgICAgICAgPSBTRSgnZmVzcG90bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRVRJTEUgICAgICAgICAgICAgICA9IFNFKCdmZXRpbGUnKTtcbmV4cG9ydCBjb25zdCBGRVRVUkJVTEVOQ0UgICAgICAgICA9IFNFKCdmZXR1cmJ1bGVuY2UnKTtcbmV4cG9ydCBjb25zdCBGSUxURVIgICAgICAgICAgICAgICA9IFNFKCdmaWx0ZXInKTtcbmV4cG9ydCBjb25zdCBGT05UICAgICAgICAgICAgICAgICA9IFNFKCdmb250Jyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0UgICAgICAgICAgICAgPSBTRSgnZm9udEZhY2UnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRUZPUk1BVCAgICAgICA9IFNFKCdmb250RmFjZUZvcm1hdCcpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFTkFNRSAgICAgICAgID0gU0UoJ2ZvbnRGYWNlTmFtZScpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFU1JDICAgICAgICAgID0gU0UoJ2ZvbnRGYWNlU3JjJyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VVUkkgICAgICAgICAgPSBTRSgnZm9udEZhY2VVcmknKTtcbmV4cG9ydCBjb25zdCBGT1JFSUdOT0JKRUNUICAgICAgICA9IFNFKCdmb3JlaWduT2JqZWN0Jyk7XG5leHBvcnQgY29uc3QgRyAgICAgICAgICAgICAgICAgICAgPSBTRSgnZycpO1xuZXhwb3J0IGNvbnN0IEdMWVBIICAgICAgICAgICAgICAgID0gU0UoJ2dseXBoJyk7XG5leHBvcnQgY29uc3QgR0xZUEhSRUYgICAgICAgICAgICAgPSBTRSgnZ2x5cGhSZWYnKTtcbmV4cG9ydCBjb25zdCBIQU5ETEVSICAgICAgICAgICAgICA9IFNFKCdoYW5kbGVyJyk7XG5leHBvcnQgY29uc3QgSEtFUk4gICAgICAgICAgICAgICAgPSBTRSgnaEtlcm4nKTtcbmV4cG9ydCBjb25zdCBJTUFHRSAgICAgICAgICAgICAgICA9IFNFKCdpbWFnZScpO1xuZXhwb3J0IGNvbnN0IExJTkUgICAgICAgICAgICAgICAgID0gU0UoJ2xpbmUnKTtcbmV4cG9ydCBjb25zdCBMSU5FQVJHUkFESUVOVCAgICAgICA9IFNFKCdsaW5lYXJncmFkaWVudCcpO1xuZXhwb3J0IGNvbnN0IExJU1RFTkVSICAgICAgICAgICAgID0gU0UoJ2xpc3RlbmVyJyk7XG5leHBvcnQgY29uc3QgTUFSS0VSICAgICAgICAgICAgICAgPSBTRSgnbWFya2VyJyk7XG5leHBvcnQgY29uc3QgTUFTSyAgICAgICAgICAgICAgICAgPSBTRSgnbWFzaycpO1xuZXhwb3J0IGNvbnN0IE1FVEFEQVRBICAgICAgICAgICAgID0gU0UoJ21ldGFkYXRhJyk7XG5leHBvcnQgY29uc3QgTUlTU0lOR0dMWVBIICAgICAgICAgPSBTRSgnbWlzc2luZ0dseXBoJyk7XG5leHBvcnQgY29uc3QgTVBBVEggICAgICAgICAgICAgICAgPSBTRSgnbVBhdGgnKTtcbmV4cG9ydCBjb25zdCBQQVRIICAgICAgICAgICAgICAgICA9IFNFKCdwYXRoJyk7XG5leHBvcnQgY29uc3QgUEFUVEVSTiAgICAgICAgICAgICAgPSBTRSgncGF0dGVybicpO1xuZXhwb3J0IGNvbnN0IFBPTFlHT04gICAgICAgICAgICAgID0gU0UoJ3BvbHlnb24nKTtcbmV4cG9ydCBjb25zdCBQT0xZTElORSAgICAgICAgICAgICA9IFNFKCdwb2x5bGluZScpO1xuZXhwb3J0IGNvbnN0IFBSRUZFVENIICAgICAgICAgICAgID0gU0UoJ3ByZWZldGNoJyk7XG5leHBvcnQgY29uc3QgUkFESUFMR1JBRElFTlQgICAgICAgPSBTRSgncmFkaWFsZ3JhZGllbnQnKTtcbmV4cG9ydCBjb25zdCBSRUNUICAgICAgICAgICAgICAgICA9IFNFKCdyZWN0Jyk7XG5leHBvcnQgY29uc3QgU0VUICAgICAgICAgICAgICAgICAgPSBTRSgnc2V0Jyk7XG5leHBvcnQgY29uc3QgU09MSURDT0xPUiAgICAgICAgICAgPSBTRSgnc29saWRDb2xvcicpO1xuZXhwb3J0IGNvbnN0IFNUT1AgICAgICAgICAgICAgICAgID0gU0UoJ3N0b3AnKTtcbmV4cG9ydCBjb25zdCBTVkcgICAgICAgICAgICAgICAgICA9IFNFKCdzdmcnKTtcbmV4cG9ydCBjb25zdCBTV0lUQ0ggICAgICAgICAgICAgICA9IFNFKCdzd2l0Y2gnKTtcbmV4cG9ydCBjb25zdCBTWU1CT0wgICAgICAgICAgICAgICA9IFNFKCdzeW1ib2wnKTtcbmV4cG9ydCBjb25zdCBUQlJFQUsgICAgICAgICAgICAgICA9IFNFKCd0YnJlYWsnKTtcbmV4cG9ydCBjb25zdCBURVhUICAgICAgICAgICAgICAgICA9IFNFKCd0ZXh0Jyk7XG5leHBvcnQgY29uc3QgVEVYVFBBVEggICAgICAgICAgICAgPSBTRSgndGV4dHBhdGgnKTtcbmV4cG9ydCBjb25zdCBUUkVGICAgICAgICAgICAgICAgICA9IFNFKCd0cmVmJyk7XG5leHBvcnQgY29uc3QgVFNQQU4gICAgICAgICAgICAgICAgPSBTRSgndHNwYW4nKTtcbmV4cG9ydCBjb25zdCBVTktOT1dOICAgICAgICAgICAgICA9IFNFKCd1bmtub3duJyk7XG5leHBvcnQgY29uc3QgVVNFICAgICAgICAgICAgICAgICAgPSBTRSgndXNlJyk7XG5leHBvcnQgY29uc3QgVklFVyAgICAgICAgICAgICAgICAgPSBTRSgndmlldycpO1xuZXhwb3J0IGNvbnN0IFZLRVJOICAgICAgICAgICAgICAgID0gU0UoJ3ZLZXJuJyk7XG5cbmV4cG9ydCBjb25zdCBTVkdfRUxFTUVOVF9OQU1FUyA9IFtcbiAgJ0FMVEdMWVBIJyxcbiAgJ0FMVEdMWVBIREVGJyxcbiAgJ0FMVEdMWVBISVRFTScsXG4gICdBTklNQVRFJyxcbiAgJ0FOSU1BVEVDT0xPUicsXG4gICdBTklNQVRFTU9USU9OJyxcbiAgJ0FOSU1BVEVUUkFOU0ZPUk0nLFxuICAnQU5JTUFUSU9OJyxcbiAgJ0NJUkNMRScsXG4gICdDTElQUEFUSCcsXG4gICdDT0xPUlBST0ZJTEUnLFxuICAnQ1VSU09SJyxcbiAgJ0RFRlMnLFxuICAnREVTQycsXG4gICdESVNDQVJEJyxcbiAgJ0VMTElQU0UnLFxuICAnRkVCTEVORCcsXG4gICdGRUNPTE9STUFUUklYJyxcbiAgJ0ZFQ09NUE9ORU5UVFJBTlNGRVInLFxuICAnRkVDT01QT1NJVEUnLFxuICAnRkVDT05WT0xWRU1BVFJJWCcsXG4gICdGRURJRkZVU0VMSUdIVElORycsXG4gICdGRURJU1BMQUNFTUVOVE1BUCcsXG4gICdGRURJU1RBTlRMSUdIVCcsXG4gICdGRURST1BTSEFET1cnLFxuICAnRkVGTE9PRCcsXG4gICdGRUZVTkNBJyxcbiAgJ0ZFRlVOQ0InLFxuICAnRkVGVU5DRycsXG4gICdGRUZVTkNSJyxcbiAgJ0ZFR0FVU1NJQU5CTFVSJyxcbiAgJ0ZFSU1BR0UnLFxuICAnRkVNRVJHRScsXG4gICdGRU1FUkdFTk9ERScsXG4gICdGRU1PUlBIT0xPR1knLFxuICAnRkVPRkZTRVQnLFxuICAnRkVQT0lOVExJR0hUJyxcbiAgJ0ZFU1BFQ1VMQVJMSUdIVElORycsXG4gICdGRVNQT1RMSUdIVCcsXG4gICdGRVRJTEUnLFxuICAnRkVUVVJCVUxFTkNFJyxcbiAgJ0ZJTFRFUicsXG4gICdGT05UJyxcbiAgJ0ZPTlRGQUNFJyxcbiAgJ0ZPTlRGQUNFRk9STUFUJyxcbiAgJ0ZPTlRGQUNFTkFNRScsXG4gICdGT05URkFDRVNSQycsXG4gICdGT05URkFDRVVSSScsXG4gICdGT1JFSUdOT0JKRUNUJyxcbiAgJ0cnLFxuICAnR0xZUEgnLFxuICAnR0xZUEhSRUYnLFxuICAnSEFORExFUicsXG4gICdIS0VSTicsXG4gICdJTUFHRScsXG4gICdMSU5FJyxcbiAgJ0xJTkVBUkdSQURJRU5UJyxcbiAgJ0xJU1RFTkVSJyxcbiAgJ01BUktFUicsXG4gICdNQVNLJyxcbiAgJ01FVEFEQVRBJyxcbiAgJ01JU1NJTkdHTFlQSCcsXG4gICdNUEFUSCcsXG4gICdQQVRIJyxcbiAgJ1BBVFRFUk4nLFxuICAnUE9MWUdPTicsXG4gICdQT0xZTElORScsXG4gICdQUkVGRVRDSCcsXG4gICdSQURJQUxHUkFESUVOVCcsXG4gICdSRUNUJyxcbiAgJ1NFVCcsXG4gICdTT0xJRENPTE9SJyxcbiAgJ1NUT1AnLFxuICAnU1ZHJyxcbiAgJ1NXSVRDSCcsXG4gICdTWU1CT0wnLFxuICAnVEJSRUFLJyxcbiAgJ1RFWFQnLFxuICAnVEVYVFBBVEgnLFxuICAnVFJFRicsXG4gICdUU1BBTicsXG4gICdVTktOT1dOJyxcbiAgJ1VTRScsXG4gICdWSUVXJyxcbiAgJ1ZLRVJOJyxcbl07XG5cbmNvbnN0IFNWR19SRSA9IG5ldyBSZWdFeHAoYF4oJHtTVkdfRUxFTUVOVF9OQU1FUy5qb2luKCd8Jyl9KSRgLCAnaScpO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KHRhZ05hbWUpIHtcbiAgcmV0dXJuIFNWR19SRS50ZXN0KHRhZ05hbWUpO1xufVxuIiwiZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZWxlbWVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9icm93c2VyLmpzJztcbiIsImltcG9ydCAqIGFzIFV0aWxzICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuaW1wb3J0IHtcbiAgRWxlbWVudERlZmluaXRpb24sXG4gIFVORklOSVNIRURfREVGSU5JVElPTixcbn0gZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmNvbnN0IElTX0lOVEVHRVIgPSAvXlxcZCskLztcblxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFdlIGhhdmUgYW4gRWxlbWVudCBvciBhIERvY3VtZW50XG4gIGlmICh2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gaXNOb3RTbG90dGVkKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAhZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDbGFzc05hbWVzKC4uLmFyZ3MpIHtcbiAgbGV0IGNsYXNzTmFtZXMgPSBbXS5jb25jYXQoLi4uYXJncylcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLm1hcCgocGFydCkgPT4gKCcnICsgcGFydCkuc3BsaXQoL1xccysvKSlcbiAgICAgIC5mbGF0KEluZmluaXR5KVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gY2xhc3NOYW1lcztcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIGlzRWxlbWVudCAgICA9IGlzRWxlbWVudDtcbiAgc3RhdGljIGlzU2xvdHRlZCAgICA9IGlzU2xvdHRlZDtcbiAgc3RhdGljIGlzTm90U2xvdHRlZCA9IGlzTm90U2xvdHRlZDtcblxuICBzdGF0aWMgZnJvbSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKFtdLCB7IHJvb3Q6IChpc0VsZW1lbnQodGhpcykpID8gdGhpcyA6IGRvY3VtZW50LCBjb250ZXh0OiB0aGlzIH0pO1xuXG4gICAgY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+IHtcbiAgICAgIGxldCBiYXNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oYmFzZSwgYXJnc1thcmdJbmRleCsrXSk7XG5cbiAgICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBhcmdzW2FyZ0luZGV4XS5nZXRPcHRpb25zKCkgfHwge30sIGJhc2UpO1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0Um9vdEVsZW1lbnQgPSAob3B0aW9uc1Jvb3QpID0+IHtcbiAgICAgIGlmIChpc0VsZW1lbnQob3B0aW9uc1Jvb3QpKVxuICAgICAgICByZXR1cm4gb3B0aW9uc1Jvb3Q7XG5cbiAgICAgIGlmIChpc0VsZW1lbnQodGhpcykpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICByZXR1cm4gKCh0aGlzICYmIHRoaXMub3duZXJEb2N1bWVudCkgfHwgZG9jdW1lbnQpO1xuICAgIH07XG5cbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gZ2V0T3B0aW9ucygpO1xuICAgIGxldCByb290ICAgICAgPSBnZXRSb290RWxlbWVudChvcHRpb25zLnJvb3QpO1xuICAgIGxldCBxdWVyeUVuZ2luZTtcblxuICAgIG9wdGlvbnMucm9vdCA9IHJvb3Q7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IHRoaXM7XG5cbiAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0uc2xpY2UoKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzW2FyZ0luZGV4XSkpIHtcbiAgICAgIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleCArIDFdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbMV07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ1N0cmluZycpKSB7XG4gICAgICBvcHRpb25zLnNlbGVjdG9yID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ0Z1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyb290LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3RvciksIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSkge1xuICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpXG4gICAgICAgIHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaW52b2tlQ2FsbGJhY2tzICE9PSBmYWxzZSAmJiB0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjayk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH07XG5cbiAgZ2V0RW5naW5lQ2xhc3MoKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlPcHRpb25zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSUVsZW1lbnRzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMob3B0aW9ucy5jb250ZXh0LCBlbGVtZW50cyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lIGluIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnbGVuZ3RoJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAvLyBJbmRleCBsb29rdXBcbiAgICAgICAgaWYgKElTX0lOVEVHRVIudGVzdChwcm9wTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgLy8gUmVkaXJlY3QgYW55IGFycmF5IG1ldGhvZHNcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGVbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBsZXQgYXJyYXkgICA9IHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cztcbiAgICAgICAgICAgIGxldCByZXN1bHQgID0gYXJyYXlbcHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5ldmVyeSgoaXRlbSkgPT4gVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uLCBOb2RlLCBRdWVyeUVuZ2luZSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sIE5vZGUpKVxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgaWYgKGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgaXRlbSA9IGl0ZW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIGl0ZW0gPSBFbGVtZW50cy5UZXJtKGl0ZW0pO1xuICAgICAgZWxzZSBpZiAoIVV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKCFjb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImNvbnRleHRcIiBvcHRpb24gZm9yIFF1ZXJ5RW5naW5lIGlzIHJlcXVpcmVkIHdoZW4gY29uc3RydWN0aW5nIGVsZW1lbnRzLicpO1xuXG4gICAgICByZXR1cm4gaXRlbS5idWlsZCh0aGlzLmdldE93bmVyRG9jdW1lbnQoKSwgY29udGV4dCk7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChmaW5hbEVsZW1lbnRzKSk7XG4gIH1cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IGFyZ3NbYXJnSW5kZXgrK10gOiB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZXh0ICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQuJCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQuJC5jYWxsKG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIEVuZ2luZUNsYXNzLmZyb20uY2FsbChvcHRpb25zLmNvbnRleHQgfHwgdGhpcywgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICB9XG5cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICB5aWVsZChbaSwgZWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gICprZXlzKCkge1xuICAgIGZvciAobGV0IFsga2V5LCBfIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCBrZXk7XG4gIH1cblxuICAqdmFsdWVzKCkge1xuICAgIGZvciAobGV0IFsgXywgdmFsdWUgXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIHZhbHVlO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB5aWVsZCAqdGhpcy52YWx1ZXMoKTtcbiAgfVxuXG4gIGZpcnN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICdOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLiQoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzWzBdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuJCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSkpO1xuICB9XG5cbiAgbGFzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy4kKFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1t0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCAtIDFdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuJCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG5cbiAgaW5zZXJ0SW50byhzZWxlY3Rvck9yRWxlbWVudCwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmdldE93bmVyRG9jdW1lbnQoKTtcbiAgICBsZXQgc291cmNlICAgICAgICA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblxuICAgICAgc291cmNlID0gWyBmcmFnbWVudCBdO1xuICAgIH1cblxuICAgIGVsZW1lbnQuaW5zZXJ0KHNvdXJjZVswXSwgcmVmZXJlbmNlTm9kZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlcGxhY2VDaGlsZHJlbk9mKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG59XG5cbmlmICghZ2xvYmFsVGhpcy5NeXRoaXhVSVF1ZXJ5RW5naW5lKVxuICBnbG9iYWxUaGlzLk15dGhpeFVJUXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW1hZ2ljLW51bWJlcnMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFNIQTI1NihfaW5wdXQpIHtcbiAgbGV0IGlucHV0ID0gX2lucHV0O1xuXG4gIGxldCBtYXRoUG93ID0gTWF0aC5wb3c7XG4gIGxldCBtYXhXb3JkID0gbWF0aFBvdygyLCAzMik7XG4gIGxldCBsZW5ndGhQcm9wZXJ0eSA9ICdsZW5ndGgnO1xuICBsZXQgaTsgbGV0IGo7IC8vIFVzZWQgYXMgYSBjb3VudGVyIGFjcm9zcyB0aGUgd2hvbGUgZmlsZVxuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgbGV0IHdvcmRzID0gW107XG4gIGxldCBhc2NpaUJpdExlbmd0aCA9IGlucHV0W2xlbmd0aFByb3BlcnR5XSAqIDg7XG5cbiAgLy8qIGNhY2hpbmcgcmVzdWx0cyBpcyBvcHRpb25hbCAtIHJlbW92ZS9hZGQgc2xhc2ggZnJvbSBmcm9udCBvZiB0aGlzIGxpbmUgdG8gdG9nZ2xlXG4gIC8vIEluaXRpYWwgaGFzaCB2YWx1ZTogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lc1xuICAvLyAod2UgYWN0dWFsbHkgY2FsY3VsYXRlIHRoZSBmaXJzdCA2NCwgYnV0IGV4dHJhIHZhbHVlcyBhcmUganVzdCBpZ25vcmVkKVxuICBsZXQgaGFzaCA9IFNIQTI1Ni5oID0gU0hBMjU2LmggfHwgW107XG4gIC8vIFJvdW5kIGNvbnN0YW50czogZmlyc3QgMzIgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgY3ViZSByb290cyBvZiB0aGUgZmlyc3QgNjQgcHJpbWVzXG4gIGxldCBrID0gU0hBMjU2LmsgPSBTSEEyNTYuayB8fCBbXTtcbiAgbGV0IHByaW1lQ291bnRlciA9IGtbbGVuZ3RoUHJvcGVydHldO1xuICAvKi9cbiAgICBsZXQgaGFzaCA9IFtdLCBrID0gW107XG4gICAgbGV0IHByaW1lQ291bnRlciA9IDA7XG4gICAgLy8qL1xuXG4gIGxldCBpc0NvbXBvc2l0ZSA9IHt9O1xuICBmb3IgKGxldCBjYW5kaWRhdGUgPSAyOyBwcmltZUNvdW50ZXIgPCA2NDsgY2FuZGlkYXRlKyspIHtcbiAgICBpZiAoIWlzQ29tcG9zaXRlW2NhbmRpZGF0ZV0pIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCAzMTM7IGkgKz0gY2FuZGlkYXRlKVxuICAgICAgICBpc0NvbXBvc2l0ZVtpXSA9IGNhbmRpZGF0ZTtcblxuICAgICAgaGFzaFtwcmltZUNvdW50ZXJdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAwLjUpICogbWF4V29yZCkgfCAwO1xuICAgICAga1twcmltZUNvdW50ZXIrK10gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDEgLyAzKSAqIG1heFdvcmQpIHwgMDtcbiAgICB9XG4gIH1cblxuICBpbnB1dCArPSAnXFx4ODAnOyAvLyBBcHBlbmQgxocnIGJpdCAocGx1cyB6ZXJvIHBhZGRpbmcpXG4gIHdoaWxlIChpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gJSA2NCAtIDU2KVxuICAgIGlucHV0ICs9ICdcXHgwMCc7IC8vIE1vcmUgemVybyBwYWRkaW5nXG5cbiAgZm9yIChpID0gMDsgaSA8IGlucHV0W2xlbmd0aFByb3BlcnR5XTsgaSsrKSB7XG4gICAgaiA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGogPj4gOClcbiAgICAgIHJldHVybjsgLy8gQVNDSUkgY2hlY2s6IG9ubHkgYWNjZXB0IGNoYXJhY3RlcnMgaW4gcmFuZ2UgMC0yNTVcbiAgICB3b3Jkc1tpID4+IDJdIHw9IGogPDwgKCgzIC0gaSkgJSA0KSAqIDg7XG4gIH1cblxuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKChhc2NpaUJpdExlbmd0aCAvIG1heFdvcmQpIHwgMCk7XG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoYXNjaWlCaXRMZW5ndGgpO1xuXG4gIC8vIHByb2Nlc3MgZWFjaCBjaHVua1xuICBmb3IgKGogPSAwOyBqIDwgd29yZHNbbGVuZ3RoUHJvcGVydHldOykge1xuICAgIGxldCB3ID0gd29yZHMuc2xpY2UoaiwgaiArPSAxNik7IC8vIFRoZSBtZXNzYWdlIGlzIGV4cGFuZGVkIGludG8gNjQgd29yZHMgYXMgcGFydCBvZiB0aGUgaXRlcmF0aW9uXG4gICAgbGV0IG9sZEhhc2ggPSBoYXNoO1xuXG4gICAgLy8gVGhpcyBpcyBub3cgdGhlIHVuZGVmaW5lZHdvcmtpbmcgaGFzaFwiLCBvZnRlbiBsYWJlbGxlZCBhcyB2YXJpYWJsZXMgYS4uLmdcbiAgICAvLyAod2UgaGF2ZSB0byB0cnVuY2F0ZSBhcyB3ZWxsLCBvdGhlcndpc2UgZXh0cmEgZW50cmllcyBhdCB0aGUgZW5kIGFjY3VtdWxhdGVcbiAgICBoYXNoID0gaGFzaC5zbGljZSgwLCA4KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2UgaW50byA2NCB3b3Jkc1xuICAgICAgLy8gVXNlZCBiZWxvdyBpZlxuICAgICAgbGV0IHcxNSA9IHdbaSAtIDE1XTsgbGV0IHcyID0gd1tpIC0gMl07XG5cbiAgICAgIC8vIEl0ZXJhdGVcbiAgICAgIGxldCBhID0gaGFzaFswXTsgbGV0IGUgPSBoYXNoWzRdO1xuICAgICAgbGV0IHRlbXAxID0gaGFzaFs3XVxuICAgICAgICAgICAgICAgICsgKCgoZSA+Pj4gNikgfCAoZSA8PCAyNikpIF4gKChlID4+PiAxMSkgfCAoZSA8PCAyMSkpIF4gKChlID4+PiAyNSkgfCAoZSA8PCA3KSkpIC8vIFMxXG4gICAgICAgICAgICAgICAgKyAoKGUgJiBoYXNoWzVdKSBeICgofmUpICYgaGFzaFs2XSkpIC8vIGNoXG4gICAgICAgICAgICAgICAgKyBrW2ldXG4gICAgICAgICAgICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICsgKHdbaV0gPSAoaSA8IDE2KSA/IHdbaV0gOiAoXG4gICAgICAgICAgICAgICAgICB3W2kgLSAxNl1cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzE1ID4+PiA3KSB8ICh3MTUgPDwgMjUpKSBeICgodzE1ID4+PiAxOCkgfCAodzE1IDw8IDE0KSkgXiAodzE1ID4+PiAzKSkgLy8gczBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgd1tpIC0gN11cbiAgICAgICAgICAgICAgICAgICAgICAgICsgKCgodzIgPj4+IDE3KSB8ICh3MiA8PCAxNSkpIF4gKCh3MiA+Pj4gMTkpIHwgKHcyIDw8IDEzKSkgXiAodzIgPj4+IDEwKSkgLy8gczFcbiAgICAgICAgICAgICAgICApIHwgMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAvLyBUaGlzIGlzIG9ubHkgdXNlZCBvbmNlLCBzbyAqY291bGQqIGJlIG1vdmVkIGJlbG93LCBidXQgaXQgb25seSBzYXZlcyA0IGJ5dGVzIGFuZCBtYWtlcyB0aGluZ3MgdW5yZWFkYmxlXG4gICAgICBsZXQgdGVtcDIgPSAoKChhID4+PiAyKSB8IChhIDw8IDMwKSkgXiAoKGEgPj4+IDEzKSB8IChhIDw8IDE5KSkgXiAoKGEgPj4+IDIyKSB8IChhIDw8IDEwKSkpIC8vIFMwXG4gICAgICAgICAgICAgICAgKyAoKGEgJiBoYXNoWzFdKSBeIChhICYgaGFzaFsyXSkgXiAoaGFzaFsxXSAmIGhhc2hbMl0pKTsgLy8gbWFqXG5cbiAgICAgIGhhc2ggPSBbKHRlbXAxICsgdGVtcDIpIHwgMF0uY29uY2F0KGhhc2gpOyAvLyBXZSBkb24ndCBib3RoZXIgdHJpbW1pbmcgb2ZmIHRoZSBleHRyYSBvbmVzLCB0aGV5J3JlIGhhcm1sZXNzIGFzIGxvbmcgYXMgd2UncmUgdHJ1bmNhdGluZyB3aGVuIHdlIGRvIHRoZSBzbGljZSgpXG4gICAgICBoYXNoWzRdID0gKGhhc2hbNF0gKyB0ZW1wMSkgfCAwO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspXG4gICAgICBoYXNoW2ldID0gKGhhc2hbaV0gKyBvbGRIYXNoW2ldKSB8IDA7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgZm9yIChqID0gMzsgaiArIDE7IGotLSkge1xuICAgICAgbGV0IGIgPSAoaGFzaFtpXSA+PiAoaiAqIDgpKSAmIDI1NTtcbiAgICAgIHJlc3VsdCArPSAoKGIgPCAxNikgPyAwIDogJycpICsgYi50b1N0cmluZygxNik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFNIQTI1NiB9IGZyb20gJy4vc2hhMjU2LmpzJztcblxuZXhwb3J0IHtcbiAgU0hBMjU2LFxufTtcblxuZnVuY3Rpb24gcGFkKHN0ciwgY291bnQsIGNoYXIgPSAnMCcpIHtcbiAgcmV0dXJuIHN0ci5wYWRTdGFydChjb3VudCwgY2hhcik7XG59XG5cbmNvbnN0IElEX0NPVU5UX0xFTkdUSCAgICAgICAgID0gMTk7XG5jb25zdCBJU19DTEFTUyAgICAgICAgICAgICAgICA9ICgvXmNsYXNzIFxcUysgXFx7Lyk7XG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUyA9IFtcbiAgJ0FnZ3JlZ2F0ZUVycm9yJyxcbiAgJ0FycmF5JyxcbiAgJ0FycmF5QnVmZmVyJyxcbiAgJ0JpZ0ludCcsXG4gICdCaWdJbnQ2NEFycmF5JyxcbiAgJ0JpZ1VpbnQ2NEFycmF5JyxcbiAgJ0Jvb2xlYW4nLFxuICAnRGF0YVZpZXcnLFxuICAnRGF0ZScsXG4gICdEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZScsXG4gICdFcnJvcicsXG4gICdFdmFsRXJyb3InLFxuICAnRmluYWxpemF0aW9uUmVnaXN0cnknLFxuICAnRmxvYXQzMkFycmF5JyxcbiAgJ0Zsb2F0NjRBcnJheScsXG4gICdGdW5jdGlvbicsXG4gICdJbnQxNkFycmF5JyxcbiAgJ0ludDMyQXJyYXknLFxuICAnSW50OEFycmF5JyxcbiAgJ01hcCcsXG4gICdOdW1iZXInLFxuICAnT2JqZWN0JyxcbiAgJ1Byb3h5JyxcbiAgJ1JhbmdlRXJyb3InLFxuICAnUmVmZXJlbmNlRXJyb3InLFxuICAnUmVnRXhwJyxcbiAgJ1NldCcsXG4gICdTaGFyZWRBcnJheUJ1ZmZlcicsXG4gICdTdHJpbmcnLFxuICAnU3ltYm9sJyxcbiAgJ1N5bnRheEVycm9yJyxcbiAgJ1R5cGVFcnJvcicsXG4gICdVaW50MTZBcnJheScsXG4gICdVaW50MzJBcnJheScsXG4gICdVaW50OEFycmF5JyxcbiAgJ1VpbnQ4Q2xhbXBlZEFycmF5JyxcbiAgJ1VSSUVycm9yJyxcbiAgJ1dlYWtNYXAnLFxuICAnV2Vha1JlZicsXG4gICdXZWFrU2V0Jyxcbl07XG5cbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFU19NRVRBID0gTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMubWFwKCh0eXBlTmFtZSkgPT4ge1xuICByZXR1cm4gWyB0eXBlTmFtZSwgZ2xvYmFsVGhpc1t0eXBlTmFtZV0gXTtcbn0pLmZpbHRlcigobWV0YSkgPT4gbWV0YVsxXSk7XG5cbmxldCBpZENvdW50ZXIgPSAwbjtcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlEKCkge1xuICBpZENvdW50ZXIgKz0gQmlnSW50KDEpO1xuICByZXR1cm4gYCR7RGF0ZS5ub3coKX0ke3BhZChpZENvdW50ZXIudG9TdHJpbmcoKSwgSURfQ09VTlRfTEVOR1RIKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVzb2x2YWJsZSgpIHtcbiAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgbGV0IHJlc29sdmU7XG4gIGxldCByZWplY3Q7XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICByZXNvbHZlID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ2Z1bGZpbGxlZCc7XG4gICAgICAgIF9yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHJlamVjdCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgIF9yZWplY3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm9taXNlLCB7XG4gICAgJ3Jlc29sdmUnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlc29sdmUsXG4gICAgfSxcbiAgICAncmVqZWN0Jzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZWplY3QsXG4gICAgfSxcbiAgICAnc3RhdHVzJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICAoKSA9PiBzdGF0dXMsXG4gICAgfSxcbiAgICAnaWQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIGdlbmVyYXRlSUQoKSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGxldCB0aGlzVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHRoaXNUeXBlID09PSAnYmlnaW50JylcbiAgICByZXR1cm4gJ0JpZ0ludCc7XG5cbiAgaWYgKHRoaXNUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0aGlzVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh2YWx1ZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtuYXRpdmVUeXBlTWV0YVswXX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIElTX0NMQVNTLnRlc3QoJycgKyB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IpKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke3ZhbHVlLm5hbWV9XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgIHJldHVybiBgW0NsYXNzICR7cmVzdWx0fV1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzVHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3RoaXNUeXBlLnN1YnN0cmluZygxKX1gO1xuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKVxuICAgIHJldHVybiAnU3RyaW5nJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOdW1iZXIpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgcmV0dXJuICdCb29sZWFuJztcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgcmV0dXJuICdPYmplY3QnO1xuXG4gIGlmICh0eXBlb2YgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuXG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlKHZhbHVlLCAuLi50eXBlcykge1xuICBsZXQgdmFsdWVUeXBlID0gdHlwZU9mKHZhbHVlKTtcbiAgaWYgKHR5cGVzLmluZGV4T2YodmFsdWVUeXBlKSA+PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiB0eXBlcy5zb21lKCh0eXBlKSA9PiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyKHZhbHVlKSB7XG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnTnVtYmVyJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3RhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXMoSW5maW5pdHkpIHx8IE9iamVjdC5pcygtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycsICdOdW1iZXInLCAnQm9vbGVhbicsICdCaWdJbnQnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOT0UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAodmFsdWUgPT09ICcnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICdTdHJpbmcnKSAmJiAoL15bXFxzXFxyXFxuXSokLykudGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZS5sZW5ndGgsICdOdW1iZXInKSlcbiAgICByZXR1cm4gKHZhbHVlLmxlbmd0aCA9PT0gMCk7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90Tk9FKHZhbHVlKSB7XG4gIHJldHVybiAhTk9FKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRNZXRob2RzKF9wcm90bywgc2tpcFByb3Rvcykge1xuICBsZXQgcHJvdG8gICAgICAgICAgID0gX3Byb3RvO1xuICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChwcm90bykge1xuICAgIGxldCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKTtcbiAgICBsZXQga2V5cyAgICAgICAgPSBPYmplY3Qua2V5cyhkZXNjcmlwdG9ycykuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZGVzY3JpcHRvcnMpKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyhrZXkpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKGtleSk7XG5cbiAgICAgIGxldCB2YWx1ZSA9IHByb3RvW2tleV07XG5cbiAgICAgIC8vIFNraXAgcHJvdG90eXBlIG9mIE9iamVjdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBPYmplY3QucHJvdG90eXBlW2tleV0gPT09IHZhbHVlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHRoaXNba2V5XSA9IHZhbHVlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIGJyZWFrO1xuXG4gICAgaWYgKHNraXBQcm90b3MgJiYgc2tpcFByb3Rvcy5pbmRleE9mKHByb3RvKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuY29uc3QgTUVUQURBVEFfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCFpc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoIWRhdGEpIHtcbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gZGF0YS5nZXQoa2V5KTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmNvbnN0IE9CSl9JRF9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcbmxldCBpZENvdW50ID0gMW47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmpJRChvYmopIHtcbiAgbGV0IGlkID0gT0JKX0lEX1dFQUtNQVAuZ2V0KG9iaik7XG4gIGlmIChpZCA9PSBudWxsKSB7XG4gICAgbGV0IHRoaXNJRCA9IGAke2lkQ291bnQrK31gO1xuICAgIE9CSl9JRF9XRUFLTUFQLnNldChvYmosIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3BlcnR5IHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmFsdWUnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHZhbHVlLFxuICAgICAgfSxcbiAgICAgICdyZWdpc3RlcmVkTm9kZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBXZWFrTWFwKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS50b1N0cmluZygpIDogKCcnICsgdmFsdWUpO1xuICB9XG5cbiAgc2V0KGNvbnRleHQsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKHRoaXMudmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIHRoaXMudHJpZ2dlclVwZGF0ZXMoY29udGV4dCk7XG4gIH1cblxuICB0cmlnZ2VyVXBkYXRlcyhjb250ZXh0KSB7XG4gICAgbGV0IG1hcCA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmdldChjb250ZXh0KTtcbiAgICBpZiAoIW1hcClcbiAgICAgIHJldHVybjtcblxuICAgIGZvciAobGV0IFsgbm9kZSwgY2FsbGJhY2sgXSBvZiBtYXAuZW50cmllcygpKVxuICAgICAgbm9kZS5ub2RlVmFsdWUgPSBjYWxsYmFjayhjb250ZXh0KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRm9yVXBkYXRlKGNvbnRleHQsIG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgbGV0IG1hcCA9IHRoaXMucmVnaXN0ZXJlZE5vZGVzLmdldChjb250ZXh0KTtcbiAgICBpZiAoIW1hcCkge1xuICAgICAgbWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGhpcy5yZWdpc3RlcmVkTm9kZXMuc2V0KGNvbnRleHQsIG1hcCk7XG4gICAgfVxuXG4gICAgaWYgKG1hcC5oYXMobm9kZSkpXG4gICAgICByZXR1cm47XG5cbiAgICBtYXAuc2V0KG5vZGUsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuY29uc3QgVkFMSURfSlNfSURFTlRJRklFUiAgICAgICAgID0gL15bYS16QS1aXyRdW2EtekEtWjAtOV8kXSokLztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUR5bmFtaWNQcm9wZXJ0eUZldGNoZXIoY29udGV4dCwgX2Z1bmN0aW9uQm9keSwgX2NvbnRleHRDYWxsQXJncykge1xuICBsZXQgY29udGV4dENhbGxBcmdzID0gKF9jb250ZXh0Q2FsbEFyZ3MpID8gX2NvbnRleHRDYWxsQXJncyA6IGB7JHtPYmplY3Qua2V5cyhjb250ZXh0KS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSkuam9pbignLCcpfX1gO1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihjb250ZXh0Q2FsbEFyZ3MsIGByZXR1cm4gJHtfZnVuY3Rpb25Cb2R5LnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKy8sICcnKX07YCkpLmJpbmQodGhpcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUZXJtKGNvbnRleHQsIF90ZXh0KSB7XG4gIGxldCB0ZXh0ID0gX3RleHQ7XG4gIGxldCBub2RlO1xuXG4gIGlmICh0ZXh0IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIG5vZGUgPSB0ZXh0O1xuICAgIGlmIChGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImZvcm1hdFRlcm1cIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gICAgdGV4dCA9IG5vZGUubm9kZVZhbHVlO1xuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGB7JHtPYmplY3Qua2V5cyhjb250ZXh0KS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSkuam9pbignLCcpfX1gO1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oPzpeXFx7XFx7fChbXlxcXFxdKVxce1xceykoW159XSs/KVxcfXsyLH0vZywgKG0sIHN0YXJ0LCBtYWNybykgPT4ge1xuICAgIGNvbnN0IGZldGNoID0gY3JlYXRlRHluYW1pY1Byb3BlcnR5RmV0Y2hlcihjb250ZXh0LCBtYWNybywgY29udGV4dENhbGxBcmdzKTtcbiAgICBsZXQgdmFsdWUgICA9IGZldGNoKGNvbnRleHQpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdmFsdWUgPSAnJztcblxuICAgIGlmIChub2RlICYmIHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1Byb3BlcnR5KVxuICAgICAgdmFsdWUucmVnaXN0ZXJGb3JVcGRhdGUoY29udGV4dCwgbm9kZSwgKGNvbnRleHQpID0+IGZvcm1hdFRlcm0oY29udGV4dCwgdGV4dCkpO1xuXG4gICAgcmV0dXJuIGAke3N0YXJ0IHx8ICcnfSR7dmFsdWV9YDtcbiAgfSk7XG59XG5cbmNvbnN0IEhBU19EWU5BTUlDX0JJTkRJTkcgPSAvXlxce1xce3xbXlxcXFxdXFx7XFx7LztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0lzRHluYW1pY0JpbmRpbmdUZW1wbGF0ZSh2YWx1ZSkge1xuICBpZiAoIWlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gSEFTX0RZTkFNSUNfQklORElORy50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRSA9IC9eW1xcdy4kXSskLztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFdmVudENhbGxiYWNrKF9mdW5jdGlvbkJvZHkpIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IF9mdW5jdGlvbkJvZHk7XG4gIGlmIChFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSlcbiAgICBmdW5jdGlvbkJvZHkgPSBgdGhpcy4ke2Z1bmN0aW9uQm9keX0oZXZlbnQpYDtcblxuICByZXR1cm4gKG5ldyBGdW5jdGlvbignZXZlbnQnLCBgbGV0IGU9ZXZlbnQsZXY9ZXZlbnQsZXZ0PWV2ZW50O3JldHVybiAke2Z1bmN0aW9uQm9keS5yZXBsYWNlKC9eXFxzKnJldHVyblxccyovLCAnJyl9O2ApKS5iaW5kKHRoaXMpO1xufVxuXG5jb25zdCBJU19FVkVOVF9OQU1FICAgICA9IC9eb24vO1xuY29uc3QgRVZFTlRfTkFNRV9DQUNIRSAgPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgbGV0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgaWYgKEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV0pXG4gICAgcmV0dXJuIEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV07XG5cbiAgbGV0IGV2ZW50TmFtZXMgPSBbXTtcblxuICBmb3IgKGxldCBrZXkgaW4gZWxlbWVudCkge1xuICAgIGlmIChrZXkubGVuZ3RoID4gMiAmJiBJU19FVkVOVF9OQU1FLnRlc3Qoa2V5KSlcbiAgICAgIGV2ZW50TmFtZXMucHVzaChrZXkudG9Mb3dlckNhc2UoKSk7XG4gIH1cblxuICBFVkVOVF9OQU1FX0NBQ0hFW3RhZ05hbWVdID0gZXZlbnROYW1lcztcblxuICByZXR1cm4gZXZlbnROYW1lcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRFdmVudFRvRWxlbWVudChjb250ZXh0LCBlbGVtZW50LCBldmVudE5hbWUsIF9jYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgY2FsbGJhY2s7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QoX2NhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrICA9IF9jYWxsYmFjay5jYWxsYmFjaztcbiAgICBvcHRpb25zICAgPSBfY2FsbGJhY2sub3B0aW9ucyB8fCB7fTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgX2NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH1cblxuICBpZiAoaXNUeXBlKGNhbGxiYWNrLCAnU3RyaW5nJykpXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVFdmVudENhbGxiYWNrLmNhbGwoY29udGV4dCwgY2FsbGJhY2spO1xuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblxuICByZXR1cm4geyBjYWxsYmFjaywgb3B0aW9ucyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2gob2JqLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAob2JqID09IG51bGwgfHwgT2JqZWN0LmlzKG9iaiwgTmFOKSB8fCBPYmplY3QuaXMob2JqLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKG9iaiwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGlmIChrZXkgPT0gbnVsbCB8fCBPYmplY3QuaXMoa2V5LCBOYU4pIHx8IE9iamVjdC5pcyhrZXksIEluZmluaXR5KSB8fCBPYmplY3QuaXMoa2V5LCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgbGV0IHBhcnRzICAgICAgICAgPSBrZXkuc3BsaXQoL1xcLi9nKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBjdXJyZW50VmFsdWUgID0gb2JqO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xuICAgIGxldCBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWVbcGFydF07XG4gICAgaWYgKG5leHRWYWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGN1cnJlbnRWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlIGluc3RhbmNlb2YgTm9kZSAmJiAoY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpKVxuICAgIHJldHVybiBjdXJyZW50VmFsdWUubm9kZVZhbHVlO1xuXG4gIHJldHVybiAoY3VycmVudFZhbHVlID09IG51bGwpID8gZGVmYXVsdFZhbHVlIDogY3VycmVudFZhbHVlO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgcXVldWUuZCA8IDEpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gLTEpO1xuXHR2YXIgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHR2YXIgY3VycmVudERlcHM7XG5cdHZhciBvdXRlclJlc29sdmU7XG5cdHZhciByZWplY3Q7XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSByZXNvbHZlO1xuXHR9KTtcblx0cHJvbWlzZVt3ZWJwYWNrRXhwb3J0c10gPSBleHBvcnRzO1xuXHRwcm9taXNlW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAocXVldWUgJiYgZm4ocXVldWUpLCBkZXBRdWV1ZXMuZm9yRWFjaChmbiksIHByb21pc2VbXCJjYXRjaFwiXSh4ID0+IHt9KSk7XG5cdG1vZHVsZS5leHBvcnRzID0gcHJvbWlzZTtcblx0Ym9keSgoZGVwcykgPT4ge1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0dmFyIGZuO1xuXHRcdHZhciBnZXRSZXN1bHQgPSAoKSA9PiAoY3VycmVudERlcHMubWFwKChkKSA9PiB7XG5cdFx0XHRpZihkW3dlYnBhY2tFcnJvcl0pIHRocm93IGRbd2VicGFja0Vycm9yXTtcblx0XHRcdHJldHVybiBkW3dlYnBhY2tFeHBvcnRzXTtcblx0XHR9KSlcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKGdldFJlc3VsdCkpO1xuXHRcdFx0Zm4uciA9IDA7XG5cdFx0XHR2YXIgZm5RdWV1ZSA9IChxKSA9PiAocSAhPT0gcXVldWUgJiYgIWRlcFF1ZXVlcy5oYXMocSkgJiYgKGRlcFF1ZXVlcy5hZGQocSksIHEgJiYgIXEuZCAmJiAoZm4ucisrLCBxLnB1c2goZm4pKSkpO1xuXHRcdFx0Y3VycmVudERlcHMubWFwKChkZXApID0+IChkZXBbd2VicGFja1F1ZXVlc10oZm5RdWV1ZSkpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZm4uciA/IHByb21pc2UgOiBnZXRSZXN1bHQoKTtcblx0fSwgKGVycikgPT4gKChlcnIgPyByZWplY3QocHJvbWlzZVt3ZWJwYWNrRXJyb3JdID0gZXJyKSA6IG91dGVyUmVzb2x2ZShleHBvcnRzKSksIHJlc29sdmVRdWV1ZShxdWV1ZSkpKTtcblx0cXVldWUgJiYgcXVldWUuZCA8IDAgJiYgKHF1ZXVlLmQgPSAwKTtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2xpYi9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==