/******/ var __webpack_modules__ = ({

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
    let styleID       = _utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`IDSTYLE${this.sensitiveTagName}:${content}`);
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

  fetchSrc() {
    let src = this.getAttribute('src');
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
/* harmony export */   importIntoDocumentFromSource: () => (/* binding */ importIntoDocumentFromSource)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");



const IS_TEMPLATE = /^(template)$/i;
const IS_SCRIPT   = /^(script)$/i;

function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
  let options   = _options || {};
  let url       = _utils_js__WEBPACK_IMPORTED_MODULE_0__.resolveURL(location, _url, options.magic);
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
        src = _utils_js__WEBPACK_IMPORTED_MODULE_0__.resolveURL(baseURL, src, false);
        childClone.setAttribute('src', src.toString());
      } else {
        childClone.setAttribute('type', 'module');
        childClone.innerHTML = child.textContent;
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isScript: true, isHandled: true }) === false)
        continue;

      let styleID = _utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`IDSTYLE${guessedElementName}:${childClone.innerHTML}`);
      if (!childClone.getAttribute('id'))
        childClone.setAttribute('id', styleID);

      // append to head
      if (!ownerDocument.querySelector(`script#${styleID}`))
        ownerDocument.head.appendChild(childClone);
    } else if ((/^(link|style)$/i).test(child.tagName)) {
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      // append to head
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

class Require extends _component_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent {
  static CACHE = new Map();

  static async require(ownerDocument, urlOrName, _options) {
    let options   = _options || {};
    let url       = _utils_js__WEBPACK_IMPORTED_MODULE_0__.resolveURL(ownerDocument.location, urlOrName, options.magic);
    let cacheKey  = url.toString();

    let cachedResponse = this.CACHE.get(cacheKey);
    if (cachedResponse) {
      cachedResponse = await cachedResponse;

      if (cachedResponse.response && cachedResponse.response.ok) {
        console.log('Returning cached response!');
        return { url, response: cachedResponse.response, ownerDocument, cached: true };
      }
    }

    let promise = fetch(url, options.fetchOptions).then(
      async (response) => {
        if (!response.ok) {
          this.CACHE.delete(cacheKey);
          throw new Error(`${response.status} ${response.statusText}`);
        }

        let body = await response.text();
        response.text = async () => body;
        response.json = async () => JSON.parse(body);

        return { url, response, ownerDocument, cached: false };
      },
      (error) => {
        console.error('Error from Mythix UI "require": ', error);
        this.CACHE.delete(cacheKey);

        throw error;
      },
    );

    this.CACHE.set(cacheKey, promise);

    return await promise;
  }

  async mounted() {
    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await this.constructor.require.call(
        this.constructor,
        this.ownerDocument || document,
        src,
        {
          magic: true,
        },
      );

      if (cached)
        return;

      let body = await response.text();
      importIntoDocumentFromSource(
        ownerDocument,
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
}

if (!customElements.get('mythix-require'))
  customElements.define('mythix-require', Require);


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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -3);
}
:host([kind="audio"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -2);
}
:host([kind="audio"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, '#333'));
  animation-delay: calc(var(--theme-animation-duration, 1000ms) / 10 * -1);
}
:host([kind="audio"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
  border-top: var(--mythix-spinner-circle-thickness) * 0.075) solid var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 1.0) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.7);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
  border-bottom: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
  animation: mythix-spinner-circle-animation calc(var(--theme-animation-duration, 1000ms) * 0.875) linear infinite;
}
:host([kind="circle"]) .spinner-item:nth-of-type(3) {
  --mythix-spinner-item-size: calc(var(--mythix-spinner-size) * 0.4);
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
  border-top: var(--mythix-spinner-circle-thickness) solid var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -1);
}
:host([kind="wave"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 6 * -2);
}
:host([kind="wave"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
}
:host([kind="pipe"]) .spinner-item:nth-child(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10);
}
:host([kind="pipe"]) .spinner-item:nth-child(3) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color3, var(--theme-primary-color, '#333'));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 2);
}
:host([kind="pipe"]) .spinner-item:nth-child(4) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color4, var(--theme-primary-color, '#333'));
  animation-delay: calc(calc(var(--theme-animation-duration, 1000ms) * 1.15) / 10 * 3);
}
:host([kind="pipe"]) .spinner-item:nth-child(5) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color5, var(--theme-primary-color, '#333'));
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
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color1, var(--theme-primary-color, '#333'));
}
:host([kind="dot"]) .spinner-item:nth-of-type(2) {
  --mythix-spinner-segment-color: var(--theme-mythix-spinner-color2, var(--theme-primary-color, '#333'));
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
/* harmony export */   resolveURL: () => (/* binding */ resolveURL),
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

const SCHEME_RE     = /^[\w-]+:\/\//;
const HAS_FILENAME  = /\.[^/.]+$/;

function resolveURL(location, _urlish, magic) {
  let urlish = _urlish;
  if (!urlish)
    urlish = new URL(location);

  if (urlish instanceof Location)
    urlish = new URL(urlish);

  if (!isType(urlish, 'String', URL))
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
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_5__.MythixUISpinner),
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
/* harmony export */   importIntoDocumentFromSource: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__.importIntoDocumentFromSource),
/* harmony export */   isSVGElement: () => (/* reexport safe */ _elements_js__WEBPACK_IMPORTED_MODULE_3__.isSVGElement)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});









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
var __webpack_exports__importIntoDocumentFromSource = __webpack_exports__.importIntoDocumentFromSource;
var __webpack_exports__isSVGElement = __webpack_exports__.isSVGElement;
export { __webpack_exports__A as A, __webpack_exports__ABBR as ABBR, __webpack_exports__ADDRESS as ADDRESS, __webpack_exports__ALTGLYPH as ALTGLYPH, __webpack_exports__ALTGLYPHDEF as ALTGLYPHDEF, __webpack_exports__ALTGLYPHITEM as ALTGLYPHITEM, __webpack_exports__ANIMATE as ANIMATE, __webpack_exports__ANIMATECOLOR as ANIMATECOLOR, __webpack_exports__ANIMATEMOTION as ANIMATEMOTION, __webpack_exports__ANIMATETRANSFORM as ANIMATETRANSFORM, __webpack_exports__ANIMATION as ANIMATION, __webpack_exports__AREA as AREA, __webpack_exports__ARTICLE as ARTICLE, __webpack_exports__ASIDE as ASIDE, __webpack_exports__AUDIO as AUDIO, __webpack_exports__B as B, __webpack_exports__BASE as BASE, __webpack_exports__BDI as BDI, __webpack_exports__BDO as BDO, __webpack_exports__BLOCKQUOTE as BLOCKQUOTE, __webpack_exports__BR as BR, __webpack_exports__BUTTON as BUTTON, __webpack_exports__CANVAS as CANVAS, __webpack_exports__CAPTION as CAPTION, __webpack_exports__CIRCLE as CIRCLE, __webpack_exports__CITE as CITE, __webpack_exports__CLIPPATH as CLIPPATH, __webpack_exports__CODE as CODE, __webpack_exports__COL as COL, __webpack_exports__COLGROUP as COLGROUP, __webpack_exports__COLORPROFILE as COLORPROFILE, __webpack_exports__CURSOR as CURSOR, __webpack_exports__DATA as DATA, __webpack_exports__DATALIST as DATALIST, __webpack_exports__DD as DD, __webpack_exports__DEFS as DEFS, __webpack_exports__DEL as DEL, __webpack_exports__DESC as DESC, __webpack_exports__DETAILS as DETAILS, __webpack_exports__DFN as DFN, __webpack_exports__DIALOG as DIALOG, __webpack_exports__DISCARD as DISCARD, __webpack_exports__DIV as DIV, __webpack_exports__DL as DL, __webpack_exports__DT as DT, __webpack_exports__ELLIPSE as ELLIPSE, __webpack_exports__EM as EM, __webpack_exports__EMBED as EMBED, __webpack_exports__ElementDefinition as ElementDefinition, __webpack_exports__FEBLEND as FEBLEND, __webpack_exports__FECOLORMATRIX as FECOLORMATRIX, __webpack_exports__FECOMPONENTTRANSFER as FECOMPONENTTRANSFER, __webpack_exports__FECOMPOSITE as FECOMPOSITE, __webpack_exports__FECONVOLVEMATRIX as FECONVOLVEMATRIX, __webpack_exports__FEDIFFUSELIGHTING as FEDIFFUSELIGHTING, __webpack_exports__FEDISPLACEMENTMAP as FEDISPLACEMENTMAP, __webpack_exports__FEDISTANTLIGHT as FEDISTANTLIGHT, __webpack_exports__FEDROPSHADOW as FEDROPSHADOW, __webpack_exports__FEFLOOD as FEFLOOD, __webpack_exports__FEFUNCA as FEFUNCA, __webpack_exports__FEFUNCB as FEFUNCB, __webpack_exports__FEFUNCG as FEFUNCG, __webpack_exports__FEFUNCR as FEFUNCR, __webpack_exports__FEGAUSSIANBLUR as FEGAUSSIANBLUR, __webpack_exports__FEIMAGE as FEIMAGE, __webpack_exports__FEMERGE as FEMERGE, __webpack_exports__FEMERGENODE as FEMERGENODE, __webpack_exports__FEMORPHOLOGY as FEMORPHOLOGY, __webpack_exports__FEOFFSET as FEOFFSET, __webpack_exports__FEPOINTLIGHT as FEPOINTLIGHT, __webpack_exports__FESPECULARLIGHTING as FESPECULARLIGHTING, __webpack_exports__FESPOTLIGHT as FESPOTLIGHT, __webpack_exports__FETILE as FETILE, __webpack_exports__FETURBULENCE as FETURBULENCE, __webpack_exports__FIELDSET as FIELDSET, __webpack_exports__FIGCAPTION as FIGCAPTION, __webpack_exports__FIGURE as FIGURE, __webpack_exports__FILTER as FILTER, __webpack_exports__FONT as FONT, __webpack_exports__FONTFACE as FONTFACE, __webpack_exports__FONTFACEFORMAT as FONTFACEFORMAT, __webpack_exports__FONTFACENAME as FONTFACENAME, __webpack_exports__FONTFACESRC as FONTFACESRC, __webpack_exports__FONTFACEURI as FONTFACEURI, __webpack_exports__FOOTER as FOOTER, __webpack_exports__FOREIGNOBJECT as FOREIGNOBJECT, __webpack_exports__FORM as FORM, __webpack_exports__G as G, __webpack_exports__GLYPH as GLYPH, __webpack_exports__GLYPHREF as GLYPHREF, __webpack_exports__H1 as H1, __webpack_exports__H2 as H2, __webpack_exports__H3 as H3, __webpack_exports__H4 as H4, __webpack_exports__H5 as H5, __webpack_exports__H6 as H6, __webpack_exports__HANDLER as HANDLER, __webpack_exports__HEADER as HEADER, __webpack_exports__HGROUP as HGROUP, __webpack_exports__HKERN as HKERN, __webpack_exports__HR as HR, __webpack_exports__I as I, __webpack_exports__IFRAME as IFRAME, __webpack_exports__IMAGE as IMAGE, __webpack_exports__IMG as IMG, __webpack_exports__INPUT as INPUT, __webpack_exports__INS as INS, __webpack_exports__KBD as KBD, __webpack_exports__LABEL as LABEL, __webpack_exports__LEGEND as LEGEND, __webpack_exports__LI as LI, __webpack_exports__LINE as LINE, __webpack_exports__LINEARGRADIENT as LINEARGRADIENT, __webpack_exports__LINK as LINK, __webpack_exports__LISTENER as LISTENER, __webpack_exports__MAIN as MAIN, __webpack_exports__MAP as MAP, __webpack_exports__MARK as MARK, __webpack_exports__MARKER as MARKER, __webpack_exports__MASK as MASK, __webpack_exports__MENU as MENU, __webpack_exports__META as META, __webpack_exports__METADATA as METADATA, __webpack_exports__METER as METER, __webpack_exports__MISSINGGLYPH as MISSINGGLYPH, __webpack_exports__MPATH as MPATH, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__NAV as NAV, __webpack_exports__NOSCRIPT as NOSCRIPT, __webpack_exports__OBJECT as OBJECT, __webpack_exports__OL as OL, __webpack_exports__OPTGROUP as OPTGROUP, __webpack_exports__OPTION as OPTION, __webpack_exports__OUTPUT as OUTPUT, __webpack_exports__P as P, __webpack_exports__PATH as PATH, __webpack_exports__PATTERN as PATTERN, __webpack_exports__PICTURE as PICTURE, __webpack_exports__POLYGON as POLYGON, __webpack_exports__POLYLINE as POLYLINE, __webpack_exports__PRE as PRE, __webpack_exports__PREFETCH as PREFETCH, __webpack_exports__PROGRESS as PROGRESS, __webpack_exports__Q as Q, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__RADIALGRADIENT as RADIALGRADIENT, __webpack_exports__RECT as RECT, __webpack_exports__RP as RP, __webpack_exports__RT as RT, __webpack_exports__RUBY as RUBY, __webpack_exports__S as S, __webpack_exports__SAMP as SAMP, __webpack_exports__SCRIPT as SCRIPT, __webpack_exports__SECTION as SECTION, __webpack_exports__SELECT as SELECT, __webpack_exports__SET as SET, __webpack_exports__SLOT as SLOT, __webpack_exports__SMALL as SMALL, __webpack_exports__SOLIDCOLOR as SOLIDCOLOR, __webpack_exports__SOURCE as SOURCE, __webpack_exports__SPAN as SPAN, __webpack_exports__STOP as STOP, __webpack_exports__STRONG as STRONG, __webpack_exports__STYLE as STYLE, __webpack_exports__SUB as SUB, __webpack_exports__SUMMARY as SUMMARY, __webpack_exports__SUP as SUP, __webpack_exports__SVG as SVG, __webpack_exports__SVG_ELEMENT_NAMES as SVG_ELEMENT_NAMES, __webpack_exports__SWITCH as SWITCH, __webpack_exports__SYMBOL as SYMBOL, __webpack_exports__TABLE as TABLE, __webpack_exports__TBODY as TBODY, __webpack_exports__TBREAK as TBREAK, __webpack_exports__TD as TD, __webpack_exports__TEMPLATE as TEMPLATE, __webpack_exports__TEXT as TEXT, __webpack_exports__TEXTAREA as TEXTAREA, __webpack_exports__TEXTPATH as TEXTPATH, __webpack_exports__TFOOT as TFOOT, __webpack_exports__TH as TH, __webpack_exports__THEAD as THEAD, __webpack_exports__TIME as TIME, __webpack_exports__TITLE as TITLE, __webpack_exports__TR as TR, __webpack_exports__TRACK as TRACK, __webpack_exports__TREF as TREF, __webpack_exports__TSPAN as TSPAN, __webpack_exports__Term as Term, __webpack_exports__U as U, __webpack_exports__UL as UL, __webpack_exports__UNFINISHED_DEFINITION as UNFINISHED_DEFINITION, __webpack_exports__UNKNOWN as UNKNOWN, __webpack_exports__USE as USE, __webpack_exports__Utils as Utils, __webpack_exports__VAR as VAR, __webpack_exports__VIDEO as VIDEO, __webpack_exports__VIEW as VIEW, __webpack_exports__VKERN as VKERN, __webpack_exports__WBR as WBR, __webpack_exports__build as build, __webpack_exports__importIntoDocumentFromSource as importIntoDocumentFromSource, __webpack_exports__isSVGElement as isSVGElement };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNIQUFzSDtBQUN0SDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQUVPLHlEQUF5RCxPQUFPOztBQUV2RTs7QUFFTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsZ0RBQWdEOztBQUVaOztBQUVGO0FBQ0g7QUFDRDtBQUNTO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFV0aWxzICAgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgUXVlcnlFbmdpbmUgfSAgZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgICAgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmZ1bmN0aW9uIGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFydWxlLnNlbGVjdG9yVGV4dClcbiAgICByZXR1cm4gcnVsZS5jc3NUZXh0O1xuXG4gIGxldCBfYm9keSAgID0gcnVsZS5jc3NUZXh0LnN1YnN0cmluZyhydWxlLnNlbGVjdG9yVGV4dC5sZW5ndGgpLnRyaW0oKTtcbiAgbGV0IHJlc3VsdCAgPSAoY2FsbGJhY2socnVsZS5zZWxlY3RvclRleHQsIF9ib2R5KSB8fCBbXSkuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAoIXJlc3VsdClcbiAgICByZXR1cm4gJyc7XG5cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGNzc1J1bGVzVG9Tb3VyY2UoY3NzUnVsZXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGNzc1J1bGVzIHx8IFtdKS5tYXAoKHJ1bGUpID0+IHtcbiAgICBsZXQgcnVsZVN0ciA9IGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spO1xuICAgIHJldHVybiBgJHtjc3NSdWxlc1RvU291cmNlKHJ1bGUuY3NzUnVsZXMsIGNhbGxiYWNrKX0ke3J1bGVTdHJ9YDtcbiAgfSkuam9pbignXFxuXFxuJyk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGVsZW1lbnROYW1lLCBzdHlsZUVsZW1lbnQpIHtcbiAgY29uc3QgaGFuZGxlSG9zdCA9IChtLCB0eXBlLCBfY29udGVudCkgPT4ge1xuICAgIGxldCBjb250ZW50ID0gKCFfY29udGVudCkgPyBfY29udGVudCA6IF9jb250ZW50LnJlcGxhY2UoL15cXCgvLCAnJykucmVwbGFjZSgvXFwpJC8sICcnKTtcblxuICAgIGlmICh0eXBlID09PSAnOmhvc3QnKSB7XG4gICAgICBpZiAoIWNvbnRlbnQpXG4gICAgICAgIHJldHVybiBlbGVtZW50TmFtZTtcblxuICAgICAgLy8gRWxlbWVudCBzZWxlY3Rvcj9cbiAgICAgIGlmICgoL15bYS16QS1aX10vKS50ZXN0KGNvbnRlbnQpKVxuICAgICAgICByZXR1cm4gYCR7Y29udGVudH1bZGF0YS1teXRoaXgtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCJdYDtcblxuICAgICAgcmV0dXJuIGAke2VsZW1lbnROYW1lfSR7Y29udGVudH1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7Y29udGVudH0gJHtlbGVtZW50TmFtZX1gO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gY3NzUnVsZXNUb1NvdXJjZShcbiAgICBzdHlsZUVsZW1lbnQuc2hlZXQuY3NzUnVsZXMsXG4gICAgKF9zZWxlY3RvciwgYm9keSkgPT4ge1xuICAgICAgbGV0IHNlbGVjdG9yID0gX3NlbGVjdG9yO1xuICAgICAgbGV0IHRhZ3MgICAgID0gW107XG5cbiAgICAgIGxldCB1cGRhdGVkU2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8oWydcIl0pKD86XFxcXC58W15cXDFdKSs/XFwxLywgKG0pID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGFncy5sZW5ndGg7XG4gICAgICAgIHRhZ3MucHVzaChtKTtcbiAgICAgICAgcmV0dXJuIGBAQEBUQUdbJHtpbmRleH1dQEBAYDtcbiAgICAgIH0pLnNwbGl0KCcsJykubWFwKChzZWxlY3RvcikgPT4ge1xuICAgICAgICBsZXQgbW9kaWZpZWQgPSBzZWxlY3Rvci5yZXBsYWNlKC8oOmhvc3QoPzotY29udGV4dCk/KShcXChcXHMqW14pXSs/XFxzKlxcKSk/LywgaGFuZGxlSG9zdCk7XG4gICAgICAgIHJldHVybiAobW9kaWZpZWQgPT09IHNlbGVjdG9yKSA/IG51bGwgOiBtb2RpZmllZDtcbiAgICAgIH0pLmZpbHRlcihCb29sZWFuKS5qb2luKCcsJykucmVwbGFjZSgvQEBAVEFHXFxbKFxcZCspXFxdQEBALywgKG0sIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiB0YWdzWytpbmRleF07XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF1cGRhdGVkU2VsZWN0b3IpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIFsgdXBkYXRlZFNlbGVjdG9yLCBib2R5IF07XG4gICAgfSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZW5zdXJlRG9jdW1lbnRTdHlsZXMob3duZXJEb2N1bWVudCwgY29tcG9uZW50TmFtZSwgdGVtcGxhdGUpIHtcbiAgbGV0IG9iaklEICAgICAgICAgICAgID0gVXRpbHMuZ2V0T2JqSUQodGVtcGxhdGUpO1xuICBsZXQgdGVtcGxhdGVJRCAgICAgICAgPSBVdGlscy5TSEEyNTYob2JqSUQpO1xuICBsZXQgdGVtcGxhdGVDaGlsZHJlbiAgPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG4gIGxldCBpbmRleCAgICAgICAgICAgICA9IDA7XG5cbiAgZm9yIChsZXQgdGVtcGxhdGVDaGlsZCBvZiB0ZW1wbGF0ZUNoaWxkcmVuKSB7XG4gICAgaWYgKCEoL15zdHlsZSQvaSkudGVzdCh0ZW1wbGF0ZUNoaWxkLnRhZ05hbWUpKVxuICAgICAgY29udGludWU7XG5cbiAgICBsZXQgc3R5bGVJRCA9IGBJRFNUWUxFJHt0ZW1wbGF0ZUlEfSR7KytpbmRleH1gO1xuICAgIGlmICghb3duZXJEb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKSkge1xuICAgICAgbGV0IGNsb25lZFN0eWxlRWxlbWVudCA9IHRlbXBsYXRlQ2hpbGQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbiAgICAgIGxldCBuZXdTdHlsZVNoZWV0ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQoY29tcG9uZW50TmFtZSwgY2xvbmVkU3R5bGVFbGVtZW50KTtcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4gICAgICBsZXQgc3R5bGVOb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtZm9yJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gbmV3U3R5bGVTaGVldDtcblxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgS2xhc3MpIHtcbiAgICBsZXQgbmFtZSA9IF9uYW1lIHx8IHRoaXMudGFnTmFtZTtcbiAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSlcbiAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShuYW1lLCBLbGFzcyB8fCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBVdGlscy5iaW5kTWV0aG9kcy5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLCBbIE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgXSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+ICgodGhpcy5wcmVmaXgpID8gYCR7dGhpcy5wcmVmaXh9OiR7dGhpcy5sb2NhbE5hbWV9YCA6IHRoaXMubG9jYWxOYW1lKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGVJRCc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY29uc3RydWN0b3IuVEVNUExBVEVfSUQsXG4gICAgICB9LFxuICAgICAgJ2RlbGF5VGltZXJzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbmV3IE1hcCgpLFxuICAgICAgfSxcbiAgICAgICdkb2N1bWVudEluaXRpYWxpemVkJzoge1xuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgKCkgPT4gVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnKSxcbiAgICAgICAgc2V0OiAgICAgICAgICAodmFsdWUpID0+IHtcbiAgICAgICAgICBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCAnX215dGhpeFVJRG9jdW1lbnRJbml0aWFsaXplZCcsICEhdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdzaGFkb3cnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuY3JlYXRlU2hhZG93RE9NKCksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgaW5qZWN0U3R5bGVTaGVldChjb250ZW50KSB7XG4gICAgbGV0IHN0eWxlSUQgICAgICAgPSBVdGlscy5TSEEyNTYoYElEU1RZTEUke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX06JHtjb250ZW50fWApO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBzdHlsZUVsZW1lbnQgID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCk7XG5cbiAgICBpZiAoc3R5bGVFbGVtZW50KVxuICAgICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcblxuICAgIHN0eWxlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuICB9XG5cbiAgZm9ybWF0VGVtcGxhdGVOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlKVxuICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpKSB7XG4gICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICBjaGlsZE5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0VGVybSh0aGlzLCBjaGlsZE5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IGNoaWxkTm9kZS5ub2RlVHlwZSA+PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICAgICAgY2hpbGROb2RlID0gdGhpcy5mb3JtYXRUZW1wbGF0ZU5vZGVzKGNoaWxkTm9kZSk7XG5cbiAgICAgICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGNoaWxkTm9kZSk7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOYW1lICAgICAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudCh0aGlzLCBjaGlsZE5vZGUsIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgIGNoaWxkTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKHRoaXMsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKG9wdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlbnZpcm9ubWVudCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiB0aGlzLmF0dGFjaFNoYWRvdyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJywgLi4uKG9wdGlvbnMgfHwge30pIH0pO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgaWYgKCF0aGlzLm93bmVyRG9jdW1lbnQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAodGhpcy50ZW1wbGF0ZUlEKVxuICAgICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0ZW1wbGF0ZVtkYXRhLW15dGhpeC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTShfdGVtcGxhdGUpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBfdGVtcGxhdGUgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIGVuc3VyZURvY3VtZW50U3R5bGVzLmNhbGwodGhpcywgdGhpcy5vd25lckRvY3VtZW50LCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUsIHRlbXBsYXRlKTtcblxuICAgICAgbGV0IGZvcm1hdHRlZFRlbXBsYXRlID0gdGhpcy5mb3JtYXRUZW1wbGF0ZU5vZGVzKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKGZvcm1hdHRlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICB0aGlzLmZldGNoU3JjKCk7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVubW91bnRlZCgpO1xuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICAkKC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy4kKHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKSk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH1cblxuICBidWlsZChjYWxsYmFjaykge1xuICAgIGxldCByZXN1bHQgPSBbIGNhbGxiYWNrKEVsZW1lbnRzLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bRWxlbWVudHMuVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCByZXN1bHQpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGR5bmFtaWNQcm9wKG5hbWUsIF9nZXR0ZXIsIF9zZXR0ZXIsIF9jb250ZXh0KSB7XG4gICAgbGV0IGlzR2V0dGVyRnVuYyAgPSAodHlwZW9mIF9nZXR0ZXIgPT09ICdmdW5jdGlvbicpO1xuICAgIGxldCBpbnRlcm5hbFZhbHVlID0gKGlzR2V0dGVyRnVuYykgPyB1bmRlZmluZWQgOiBfZ2V0dGVyO1xuICAgIGxldCBnZXR0ZXIgICAgICAgID0gKGlzR2V0dGVyRnVuYykgPyBfZ2V0dGVyIDogKCkgPT4gaW50ZXJuYWxWYWx1ZTtcbiAgICBsZXQgc2V0dGVyICAgICAgICA9ICh0eXBlb2YgX3NldHRlciA9PT0gJ2Z1bmN0aW9uJykgPyBfc2V0dGVyIDogKG5ld1ZhbHVlKSA9PiB7XG4gICAgICBpbnRlcm5hbFZhbHVlID0gbmV3VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCB2YWx1ZSAgID0gbmV3IFV0aWxzLkR5bmFtaWNQcm9wZXJ0eShnZXR0ZXIsIHNldHRlcik7XG4gICAgbGV0IGNvbnRleHQgPSBfY29udGV4dCB8fCB0aGlzO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY29udGV4dCwge1xuICAgICAgW25hbWVdOiB7XG4gICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHZhbHVlLnZhbHVlLFxuICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgIHZhbHVlLnNldCh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZHluYW1pY0RhdGEob2JqKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGxldCBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHRoaXMuZHluYW1pY1Byb3Aoa2V5LCB2YWx1ZSwgdW5kZWZpbmVkLCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGRlYm91bmNlKGNhbGxiYWNrLCBtcywgX2lkKSB7XG4gICAgdmFyIGlkID0gX2lkO1xuXG4gICAgLy8gSWYgd2UgZG9uJ3QgZ2V0IGFuIGlkIGZyb20gdGhlIHVzZXIsIHRoZW4gZ3Vlc3MgdGhlIGlkIGJ5IHR1cm5pbmcgdGhlIGZ1bmN0aW9uXG4gICAgLy8gaW50byBhIHN0cmluZyAocmF3IHNvdXJjZSkgYW5kIHVzZSB0aGF0IGZvciBhbiBpZCBpbnN0ZWFkXG4gICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgIGlkID0gKCcnICsgY2FsbGJhY2spO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgdHJhbnNwaWxlZCBjb2RlLCB0aGVuIGFuIGFzeW5jIGdlbmVyYXRvciB3aWxsIGJlIHVzZWQgZm9yIGFzeW5jIGZ1bmN0aW9uc1xuICAgICAgLy8gVGhpcyB3cmFwcyB0aGUgcmVhbCBmdW5jdGlvbiwgYW5kIHNvIHdoZW4gY29udmVydGluZyB0aGUgZnVuY3Rpb24gaW50byBhIHN0cmluZ1xuICAgICAgLy8gaXQgd2lsbCBOT1QgYmUgdW5pcXVlIHBlciBjYWxsLXNpdGUuIEZvciB0aGlzIHJlYXNvbiwgaWYgd2UgZGV0ZWN0IHRoaXMgaXNzdWUsXG4gICAgICAvLyB3ZSB3aWxsIGdvIHRoZSBcInNsb3dcIiByb3V0ZSBhbmQgY3JlYXRlIGEgc3RhY2sgdHJhY2UsIGFuZCB1c2UgdGhhdCBmb3IgdGhlIHVuaXF1ZSBpZFxuICAgICAgaWYgKGlkLm1hdGNoKC9hc3luY0dlbmVyYXRvclN0ZXAvKSkge1xuICAgICAgICBpZCA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gICAgICAgIGNvbnNvbGUud2FybignbXl0aGl4LXVpIHdhcm5pbmc6IFwidGhpcy5kZWxheVwiIGNhbGxlZCB3aXRob3V0IGEgc3BlY2lmaWVkIFwiaWRcIiBwYXJhbWV0ZXIuIFRoaXMgd2lsbCByZXN1bHQgaW4gYSBwZXJmb3JtYW5jZSBoaXQuIFBsZWFzZSBzcGVjaWZ5IGFuZCBcImlkXCIgYXJndW1lbnQgZm9yIHlvdXIgY2FsbDogXCJ0aGlzLmRlbGF5KGNhbGxiYWNrLCBtcywgXFwnc29tZS1jdXN0b20tY2FsbC1zaXRlLWlkXFwnKVwiJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gKCcnICsgaWQpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gdGhpcy5kZWxheVRpbWVycy5nZXQoaWQpO1xuICAgIGlmIChwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS50aW1lcklEKVxuICAgICAgICBjbGVhclRpbWVvdXQocHJvbWlzZS50aW1lcklEKTtcblxuICAgICAgcHJvbWlzZS5yZWplY3QoJ2NhbmNlbGxlZCcpO1xuICAgIH1cblxuICAgIHByb21pc2UgPSBVdGlscy5jcmVhdGVSZXNvbHZhYmxlKCk7XG4gICAgdGhpcy5kZWxheVRpbWVycy5zZXQoaWQsIHByb21pc2UpO1xuXG4gICAgLy8gTGV0J3Mgbm90IGNvbXBsYWluIGFib3V0XG4gICAgLy8gdW5jYXVnaHQgZXJyb3JzXG4gICAgcHJvbWlzZS5jYXRjaCgoKSA9PiB7fSk7XG5cbiAgICBwcm9taXNlLnRpbWVySUQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGVuY291bnRlcmVkIHdoaWxlIGNhbGxpbmcgXCJkZWxheVwiIGNhbGxiYWNrOiAnLCBlcnJvciwgY2FsbGJhY2sudG9TdHJpbmcoKSk7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCBtcyB8fCAwKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2xhc3NlcyguLi5fYXJncykge1xuICAgIGxldCBhcmdzID0gX2FyZ3MuZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSlcbiAgICAgICAgcmV0dXJuIGl0ZW0udHJpbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBmZXRjaFNyYygpIHtcbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiA9IFN5bWJvbC5mb3IoJy9qb3kvZWxlbWVudERlZmluaXRpb24vY29uc3RhbnRzL3VuZmluaXNoZWQnKTtcblxuY29uc3QgSVNfUFJPUF9OQU1FID0gL15wcm9wXFwkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IodGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudCguLi5hcmdzKTtcbiAgfVxuXG4gIGJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KSB7XG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyaWJ1dGVzLnZhbHVlIHx8ICcnKTtcbiAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdFRlcm0oY29udGV4dCwgdGV4dE5vZGUpO1xuICAgICAgcmV0dXJuIHRleHROb2RlO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2VVUkkpXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZ05hbWUpO1xuXG4gICAgY29uc3QgaGFuZGxlQXR0cmlidXRlID0gKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIF9hdHRyaWJ1dGVWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBfYXR0cmlidXRlVmFsdWU7XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQoY29udGV4dCwgZWxlbWVudCwgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgIGlmIChVdGlscy5zdHJpbmdJc0R5bmFtaWNCaW5kaW5nVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIGF0dHJpYnV0ZVxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuXG4gICAgICAgICAgLy8gR2V0IGF0dHJpYnV0ZSBub2RlIGp1c3QgY3JlYXRlZFxuICAgICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSk7XG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUgPSBVdGlscy5mb3JtYXRUZXJtKGNvbnRleHQsIGF0dHJpYnV0ZU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobW9kaWZpZWRBdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIER5bmFtaWMgYmluZGluZ3MgYXJlIG5vdCBhbGxvd2VkIGZvciBwcm9wZXJ0aWVzXG4gICAgY29uc3QgaGFuZGxlUHJvcGVydHkgPSAoZWxlbWVudCwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKSA9PiB7XG4gICAgICBsZXQgbmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKElTX1BST1BfTkFNRSwgJycpO1xuICAgICAgZWxlbWVudFtuYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICBoYW5kbGVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQgY2hpbGQgICAgICAgICA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBsZXQgY2hpbGRFbGVtZW50ICA9IGNoaWxkLmJ1aWxkKGRvY3VtZW50LCBjb250ZXh0KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY29uc3QgSVNfVEFSR0VUX1BST1AgPSAvXnByb3RvdHlwZXxjb25zdHJ1Y3RvciQvO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIHNjb3BlKSB7XG4gIGlmICghdGFnTmFtZSB8fCAhVXRpbHMuaXNUeXBlKHRhZ05hbWUsICdTdHJpbmcnKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGFuIEVsZW1lbnREZWZpbml0aW9uIHdpdGhvdXQgYSBcInRhZ05hbWVcIi4nKTtcblxuICBjb25zdCBmaW5hbGl6ZXIgPSAoLi4uX2NoaWxkcmVuKSA9PiB7XG4gICAgbGV0IGNoaWxkcmVuID0gX2NoaWxkcmVuLm1hcCgodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgaWYgKHZhbHVlW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiB2YWx1ZSgpO1xuXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50RGVmaW5pdGlvbilcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICBpZiAoIVV0aWxzLmlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlOiAoJycgKyB2YWx1ZSkgfSk7XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGNvbnN0IFRlcm0gPSAodmFsdWUpID0+IG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlIH0pO1xuXG5jb25zdCBFID0gKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKSA9PiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcyk7XG5cbmV4cG9ydCBjb25zdCBBICAgICAgICAgID0gRSgnYScpO1xuZXhwb3J0IGNvbnN0IEFCQlIgICAgICAgPSBFKCdhYmJyJyk7XG5leHBvcnQgY29uc3QgQUREUkVTUyAgICA9IEUoJ2FkZHJlc3MnKTtcbmV4cG9ydCBjb25zdCBBUkVBICAgICAgID0gRSgnYXJlYScpO1xuZXhwb3J0IGNvbnN0IEFSVElDTEUgICAgPSBFKCdhcnRpY2xlJyk7XG5leHBvcnQgY29uc3QgQVNJREUgICAgICA9IEUoJ2FzaWRlJyk7XG5leHBvcnQgY29uc3QgQVVESU8gICAgICA9IEUoJ2F1ZGlvJyk7XG5leHBvcnQgY29uc3QgQiAgICAgICAgICA9IEUoJ2InKTtcbmV4cG9ydCBjb25zdCBCQVNFICAgICAgID0gRSgnYmFzZScpO1xuZXhwb3J0IGNvbnN0IEJESSAgICAgICAgPSBFKCdiZGknKTtcbmV4cG9ydCBjb25zdCBCRE8gICAgICAgID0gRSgnYmRvJyk7XG5leHBvcnQgY29uc3QgQkxPQ0tRVU9URSA9IEUoJ2Jsb2NrcXVvdGUnKTtcbmV4cG9ydCBjb25zdCBCUiAgICAgICAgID0gRSgnYnInKTtcbmV4cG9ydCBjb25zdCBCVVRUT04gICAgID0gRSgnYnV0dG9uJyk7XG5leHBvcnQgY29uc3QgQ0FOVkFTICAgICA9IEUoJ2NhbnZhcycpO1xuZXhwb3J0IGNvbnN0IENBUFRJT04gICAgPSBFKCdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgQ0lURSAgICAgICA9IEUoJ2NpdGUnKTtcbmV4cG9ydCBjb25zdCBDT0RFICAgICAgID0gRSgnY29kZScpO1xuZXhwb3J0IGNvbnN0IENPTCAgICAgICAgPSBFKCdjb2wnKTtcbmV4cG9ydCBjb25zdCBDT0xHUk9VUCAgID0gRSgnY29sZ3JvdXAnKTtcbmV4cG9ydCBjb25zdCBEQVRBICAgICAgID0gRSgnZGF0YScpO1xuZXhwb3J0IGNvbnN0IERBVEFMSVNUICAgPSBFKCdkYXRhbGlzdCcpO1xuZXhwb3J0IGNvbnN0IEREICAgICAgICAgPSBFKCdkZCcpO1xuZXhwb3J0IGNvbnN0IERFTCAgICAgICAgPSBFKCdkZWwnKTtcbmV4cG9ydCBjb25zdCBERVRBSUxTICAgID0gRSgnZGV0YWlscycpO1xuZXhwb3J0IGNvbnN0IERGTiAgICAgICAgPSBFKCdkZm4nKTtcbmV4cG9ydCBjb25zdCBESUFMT0cgICAgID0gRSgnZGlhbG9nJyk7XG5leHBvcnQgY29uc3QgRElWICAgICAgICA9IEUoJ2RpdicpO1xuZXhwb3J0IGNvbnN0IERMICAgICAgICAgPSBFKCdkbCcpO1xuZXhwb3J0IGNvbnN0IERUICAgICAgICAgPSBFKCdkdCcpO1xuZXhwb3J0IGNvbnN0IEVNICAgICAgICAgPSBFKCdlbScpO1xuZXhwb3J0IGNvbnN0IEVNQkVEICAgICAgPSBFKCdlbWJlZCcpO1xuZXhwb3J0IGNvbnN0IEZJRUxEU0VUICAgPSBFKCdmaWVsZHNldCcpO1xuZXhwb3J0IGNvbnN0IEZJR0NBUFRJT04gPSBFKCdmaWdjYXB0aW9uJyk7XG5leHBvcnQgY29uc3QgRklHVVJFICAgICA9IEUoJ2ZpZ3VyZScpO1xuZXhwb3J0IGNvbnN0IEZPT1RFUiAgICAgPSBFKCdmb290ZXInKTtcbmV4cG9ydCBjb25zdCBGT1JNICAgICAgID0gRSgnZm9ybScpO1xuZXhwb3J0IGNvbnN0IEgxICAgICAgICAgPSBFKCdoMScpO1xuZXhwb3J0IGNvbnN0IEgyICAgICAgICAgPSBFKCdoMicpO1xuZXhwb3J0IGNvbnN0IEgzICAgICAgICAgPSBFKCdoMycpO1xuZXhwb3J0IGNvbnN0IEg0ICAgICAgICAgPSBFKCdoNCcpO1xuZXhwb3J0IGNvbnN0IEg1ICAgICAgICAgPSBFKCdoNScpO1xuZXhwb3J0IGNvbnN0IEg2ICAgICAgICAgPSBFKCdoNicpO1xuZXhwb3J0IGNvbnN0IEhFQURFUiAgICAgPSBFKCdoZWFkZXInKTtcbmV4cG9ydCBjb25zdCBIR1JPVVAgICAgID0gRSgnaGdyb3VwJyk7XG5leHBvcnQgY29uc3QgSFIgICAgICAgICA9IEUoJ2hyJyk7XG5leHBvcnQgY29uc3QgSSAgICAgICAgICA9IEUoJ2knKTtcbmV4cG9ydCBjb25zdCBJRlJBTUUgICAgID0gRSgnaWZyYW1lJyk7XG5leHBvcnQgY29uc3QgSU1HICAgICAgICA9IEUoJ2ltZycpO1xuZXhwb3J0IGNvbnN0IElOUFVUICAgICAgPSBFKCdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IElOUyAgICAgICAgPSBFKCdpbnMnKTtcbmV4cG9ydCBjb25zdCBLQkQgICAgICAgID0gRSgna2JkJyk7XG5leHBvcnQgY29uc3QgTEFCRUwgICAgICA9IEUoJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgTEVHRU5EICAgICA9IEUoJ2xlZ2VuZCcpO1xuZXhwb3J0IGNvbnN0IExJICAgICAgICAgPSBFKCdsaScpO1xuZXhwb3J0IGNvbnN0IExJTksgICAgICAgPSBFKCdsaW5rJyk7XG5leHBvcnQgY29uc3QgTUFJTiAgICAgICA9IEUoJ21haW4nKTtcbmV4cG9ydCBjb25zdCBNQVAgICAgICAgID0gRSgnbWFwJyk7XG5leHBvcnQgY29uc3QgTUFSSyAgICAgICA9IEUoJ21hcmsnKTtcbmV4cG9ydCBjb25zdCBNRU5VICAgICAgID0gRSgnbWVudScpO1xuZXhwb3J0IGNvbnN0IE1FVEEgICAgICAgPSBFKCdtZXRhJyk7XG5leHBvcnQgY29uc3QgTUVURVIgICAgICA9IEUoJ21ldGVyJyk7XG5leHBvcnQgY29uc3QgTkFWICAgICAgICA9IEUoJ25hdicpO1xuZXhwb3J0IGNvbnN0IE5PU0NSSVBUICAgPSBFKCdub3NjcmlwdCcpO1xuZXhwb3J0IGNvbnN0IE9CSkVDVCAgICAgPSBFKCdvYmplY3QnKTtcbmV4cG9ydCBjb25zdCBPTCAgICAgICAgID0gRSgnb2wnKTtcbmV4cG9ydCBjb25zdCBPUFRHUk9VUCAgID0gRSgnb3B0Z3JvdXAnKTtcbmV4cG9ydCBjb25zdCBPUFRJT04gICAgID0gRSgnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgT1VUUFVUICAgICA9IEUoJ291dHB1dCcpO1xuZXhwb3J0IGNvbnN0IFAgICAgICAgICAgPSBFKCdwJyk7XG5leHBvcnQgY29uc3QgUElDVFVSRSAgICA9IEUoJ3BpY3R1cmUnKTtcbmV4cG9ydCBjb25zdCBQUkUgICAgICAgID0gRSgncHJlJyk7XG5leHBvcnQgY29uc3QgUFJPR1JFU1MgICA9IEUoJ3Byb2dyZXNzJyk7XG5leHBvcnQgY29uc3QgUSAgICAgICAgICA9IEUoJ3EnKTtcbmV4cG9ydCBjb25zdCBSUCAgICAgICAgID0gRSgncnAnKTtcbmV4cG9ydCBjb25zdCBSVCAgICAgICAgID0gRSgncnQnKTtcbmV4cG9ydCBjb25zdCBSVUJZICAgICAgID0gRSgncnVieScpO1xuZXhwb3J0IGNvbnN0IFMgICAgICAgICAgPSBFKCdzJyk7XG5leHBvcnQgY29uc3QgU0FNUCAgICAgICA9IEUoJ3NhbXAnKTtcbmV4cG9ydCBjb25zdCBTQ1JJUFQgICAgID0gRSgnc2NyaXB0Jyk7XG5leHBvcnQgY29uc3QgU0VDVElPTiAgICA9IEUoJ3NlY3Rpb24nKTtcbmV4cG9ydCBjb25zdCBTRUxFQ1QgICAgID0gRSgnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3QgU0xPVCAgICAgICA9IEUoJ3Nsb3QnKTtcbmV4cG9ydCBjb25zdCBTTUFMTCAgICAgID0gRSgnc21hbGwnKTtcbmV4cG9ydCBjb25zdCBTT1VSQ0UgICAgID0gRSgnc291cmNlJyk7XG5leHBvcnQgY29uc3QgU1BBTiAgICAgICA9IEUoJ3NwYW4nKTtcbmV4cG9ydCBjb25zdCBTVFJPTkcgICAgID0gRSgnc3Ryb25nJyk7XG5leHBvcnQgY29uc3QgU1RZTEUgICAgICA9IEUoJ3N0eWxlJyk7XG5leHBvcnQgY29uc3QgU1VCICAgICAgICA9IEUoJ3N1YicpO1xuZXhwb3J0IGNvbnN0IFNVTU1BUlkgICAgPSBFKCdzdW1tYXJ5Jyk7XG5leHBvcnQgY29uc3QgU1VQICAgICAgICA9IEUoJ3N1cCcpO1xuZXhwb3J0IGNvbnN0IFRBQkxFICAgICAgPSBFKCd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IFRCT0RZICAgICAgPSBFKCd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IFREICAgICAgICAgPSBFKCd0ZCcpO1xuZXhwb3J0IGNvbnN0IFRFTVBMQVRFICAgPSBFKCd0ZW1wbGF0ZScpO1xuZXhwb3J0IGNvbnN0IFRFWFRBUkVBICAgPSBFKCd0ZXh0YXJlYScpO1xuZXhwb3J0IGNvbnN0IFRGT09UICAgICAgPSBFKCd0Zm9vdCcpO1xuZXhwb3J0IGNvbnN0IFRIICAgICAgICAgPSBFKCd0aCcpO1xuZXhwb3J0IGNvbnN0IFRIRUFEICAgICAgPSBFKCd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IFRJTUUgICAgICAgPSBFKCd0aW1lJyk7XG5leHBvcnQgY29uc3QgVElUTEUgICAgICA9IEUoJ3RpdGxlJyk7XG5leHBvcnQgY29uc3QgVFIgICAgICAgICA9IEUoJ3RyJyk7XG5leHBvcnQgY29uc3QgVFJBQ0sgICAgICA9IEUoJ3RyYWNrJyk7XG5leHBvcnQgY29uc3QgVSAgICAgICAgICA9IEUoJ3UnKTtcbmV4cG9ydCBjb25zdCBVTCAgICAgICAgID0gRSgndWwnKTtcbmV4cG9ydCBjb25zdCBWQVIgICAgICAgID0gRSgndmFyJyk7XG5leHBvcnQgY29uc3QgVklERU8gICAgICA9IEUoJ3ZpZGVvJyk7XG5leHBvcnQgY29uc3QgV0JSICAgICAgICA9IEUoJ3dicicpO1xuXG5leHBvcnQgY29uc3QgU1ZHX0VMRU1FTlRfTkFNRVMgPSBbXTtcblxuY29uc3QgU0UgPSAodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMpID0+IHtcbiAgU1ZHX0VMRU1FTlRfTkFNRVMucHVzaCh0YWdOYW1lKTtcbiAgcmV0dXJuIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzKTtcbn07XG5cbi8vIFNWRyBlbGVtZW50IG5hbWVzXG5leHBvcnQgY29uc3QgQUxUR0xZUEggICAgICAgICAgICAgPSBTRSgnYWx0Z2x5cGgnKTtcbmV4cG9ydCBjb25zdCBBTFRHTFlQSERFRiAgICAgICAgICA9IFNFKCdhbHRnbHlwaGRlZicpO1xuZXhwb3J0IGNvbnN0IEFMVEdMWVBISVRFTSAgICAgICAgID0gU0UoJ2FsdGdseXBoaXRlbScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVEUgICAgICAgICAgICAgID0gU0UoJ2FuaW1hdGUnKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFQ09MT1IgICAgICAgICA9IFNFKCdhbmltYXRlQ29sb3InKTtcbmV4cG9ydCBjb25zdCBBTklNQVRFTU9USU9OICAgICAgICA9IFNFKCdhbmltYXRlTW90aW9uJyk7XG5leHBvcnQgY29uc3QgQU5JTUFURVRSQU5TRk9STSAgICAgPSBTRSgnYW5pbWF0ZVRyYW5zZm9ybScpO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTiAgICAgICAgICAgID0gU0UoJ2FuaW1hdGlvbicpO1xuZXhwb3J0IGNvbnN0IENJUkNMRSAgICAgICAgICAgICAgID0gU0UoJ2NpcmNsZScpO1xuZXhwb3J0IGNvbnN0IENMSVBQQVRIICAgICAgICAgICAgID0gU0UoJ2NsaXBQYXRoJyk7XG5leHBvcnQgY29uc3QgQ09MT1JQUk9GSUxFICAgICAgICAgPSBTRSgnY29sb3JQcm9maWxlJyk7XG5leHBvcnQgY29uc3QgQ1VSU09SICAgICAgICAgICAgICAgPSBTRSgnY3Vyc29yJyk7XG5leHBvcnQgY29uc3QgREVGUyAgICAgICAgICAgICAgICAgPSBTRSgnZGVmcycpO1xuZXhwb3J0IGNvbnN0IERFU0MgICAgICAgICAgICAgICAgID0gU0UoJ2Rlc2MnKTtcbmV4cG9ydCBjb25zdCBESVNDQVJEICAgICAgICAgICAgICA9IFNFKCdkaXNjYXJkJyk7XG5leHBvcnQgY29uc3QgRUxMSVBTRSAgICAgICAgICAgICAgPSBTRSgnZWxsaXBzZScpO1xuZXhwb3J0IGNvbnN0IEZFQkxFTkQgICAgICAgICAgICAgID0gU0UoJ2ZlYmxlbmQnKTtcbmV4cG9ydCBjb25zdCBGRUNPTE9STUFUUklYICAgICAgICA9IFNFKCdmZWNvbG9ybWF0cml4Jyk7XG5leHBvcnQgY29uc3QgRkVDT01QT05FTlRUUkFOU0ZFUiAgPSBTRSgnZmVjb21wb25lbnR0cmFuc2ZlcicpO1xuZXhwb3J0IGNvbnN0IEZFQ09NUE9TSVRFICAgICAgICAgID0gU0UoJ2ZlY29tcG9zaXRlJyk7XG5leHBvcnQgY29uc3QgRkVDT05WT0xWRU1BVFJJWCAgICAgPSBTRSgnZmVjb252b2x2ZW1hdHJpeCcpO1xuZXhwb3J0IGNvbnN0IEZFRElGRlVTRUxJR0hUSU5HICAgID0gU0UoJ2ZlZGlmZnVzZWxpZ2h0aW5nJyk7XG5leHBvcnQgY29uc3QgRkVESVNQTEFDRU1FTlRNQVAgICAgPSBTRSgnZmVkaXNwbGFjZW1lbnRtYXAnKTtcbmV4cG9ydCBjb25zdCBGRURJU1RBTlRMSUdIVCAgICAgICA9IFNFKCdmZWRpc3RhbnRsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFRFJPUFNIQURPVyAgICAgICAgID0gU0UoJ2ZlZHJvcHNoYWRvdycpO1xuZXhwb3J0IGNvbnN0IEZFRkxPT0QgICAgICAgICAgICAgID0gU0UoJ2ZlZmxvb2QnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNBICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNhJyk7XG5leHBvcnQgY29uc3QgRkVGVU5DQiAgICAgICAgICAgICAgPSBTRSgnZmVmdW5jYicpO1xuZXhwb3J0IGNvbnN0IEZFRlVOQ0cgICAgICAgICAgICAgID0gU0UoJ2ZlZnVuY2cnKTtcbmV4cG9ydCBjb25zdCBGRUZVTkNSICAgICAgICAgICAgICA9IFNFKCdmZWZ1bmNyJyk7XG5leHBvcnQgY29uc3QgRkVHQVVTU0lBTkJMVVIgICAgICAgPSBTRSgnZmVnYXVzc2lhbmJsdXInKTtcbmV4cG9ydCBjb25zdCBGRUlNQUdFICAgICAgICAgICAgICA9IFNFKCdmZWltYWdlJyk7XG5leHBvcnQgY29uc3QgRkVNRVJHRSAgICAgICAgICAgICAgPSBTRSgnZmVtZXJnZScpO1xuZXhwb3J0IGNvbnN0IEZFTUVSR0VOT0RFICAgICAgICAgID0gU0UoJ2ZlbWVyZ2Vub2RlJyk7XG5leHBvcnQgY29uc3QgRkVNT1JQSE9MT0dZICAgICAgICAgPSBTRSgnZmVtb3JwaG9sb2d5Jyk7XG5leHBvcnQgY29uc3QgRkVPRkZTRVQgICAgICAgICAgICAgPSBTRSgnZmVvZmZzZXQnKTtcbmV4cG9ydCBjb25zdCBGRVBPSU5UTElHSFQgICAgICAgICA9IFNFKCdmZXBvaW50bGlnaHQnKTtcbmV4cG9ydCBjb25zdCBGRVNQRUNVTEFSTElHSFRJTkcgICA9IFNFKCdmZXNwZWN1bGFybGlnaHRpbmcnKTtcbmV4cG9ydCBjb25zdCBGRVNQT1RMSUdIVCAgICAgICAgICA9IFNFKCdmZXNwb3RsaWdodCcpO1xuZXhwb3J0IGNvbnN0IEZFVElMRSAgICAgICAgICAgICAgID0gU0UoJ2ZldGlsZScpO1xuZXhwb3J0IGNvbnN0IEZFVFVSQlVMRU5DRSAgICAgICAgID0gU0UoJ2ZldHVyYnVsZW5jZScpO1xuZXhwb3J0IGNvbnN0IEZJTFRFUiAgICAgICAgICAgICAgID0gU0UoJ2ZpbHRlcicpO1xuZXhwb3J0IGNvbnN0IEZPTlQgICAgICAgICAgICAgICAgID0gU0UoJ2ZvbnQnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRSAgICAgICAgICAgICA9IFNFKCdmb250RmFjZScpO1xuZXhwb3J0IGNvbnN0IEZPTlRGQUNFRk9STUFUICAgICAgID0gU0UoJ2ZvbnRGYWNlRm9ybWF0Jyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VOQU1FICAgICAgICAgPSBTRSgnZm9udEZhY2VOYW1lJyk7XG5leHBvcnQgY29uc3QgRk9OVEZBQ0VTUkMgICAgICAgICAgPSBTRSgnZm9udEZhY2VTcmMnKTtcbmV4cG9ydCBjb25zdCBGT05URkFDRVVSSSAgICAgICAgICA9IFNFKCdmb250RmFjZVVyaScpO1xuZXhwb3J0IGNvbnN0IEZPUkVJR05PQkpFQ1QgICAgICAgID0gU0UoJ2ZvcmVpZ25PYmplY3QnKTtcbmV4cG9ydCBjb25zdCBHICAgICAgICAgICAgICAgICAgICA9IFNFKCdnJyk7XG5leHBvcnQgY29uc3QgR0xZUEggICAgICAgICAgICAgICAgPSBTRSgnZ2x5cGgnKTtcbmV4cG9ydCBjb25zdCBHTFlQSFJFRiAgICAgICAgICAgICA9IFNFKCdnbHlwaFJlZicpO1xuZXhwb3J0IGNvbnN0IEhBTkRMRVIgICAgICAgICAgICAgID0gU0UoJ2hhbmRsZXInKTtcbmV4cG9ydCBjb25zdCBIS0VSTiAgICAgICAgICAgICAgICA9IFNFKCdoS2VybicpO1xuZXhwb3J0IGNvbnN0IElNQUdFICAgICAgICAgICAgICAgID0gU0UoJ2ltYWdlJyk7XG5leHBvcnQgY29uc3QgTElORSAgICAgICAgICAgICAgICAgPSBTRSgnbGluZScpO1xuZXhwb3J0IGNvbnN0IExJTkVBUkdSQURJRU5UICAgICAgID0gU0UoJ2xpbmVhcmdyYWRpZW50Jyk7XG5leHBvcnQgY29uc3QgTElTVEVORVIgICAgICAgICAgICAgPSBTRSgnbGlzdGVuZXInKTtcbmV4cG9ydCBjb25zdCBNQVJLRVIgICAgICAgICAgICAgICA9IFNFKCdtYXJrZXInKTtcbmV4cG9ydCBjb25zdCBNQVNLICAgICAgICAgICAgICAgICA9IFNFKCdtYXNrJyk7XG5leHBvcnQgY29uc3QgTUVUQURBVEEgICAgICAgICAgICAgPSBTRSgnbWV0YWRhdGEnKTtcbmV4cG9ydCBjb25zdCBNSVNTSU5HR0xZUEggICAgICAgICA9IFNFKCdtaXNzaW5nR2x5cGgnKTtcbmV4cG9ydCBjb25zdCBNUEFUSCAgICAgICAgICAgICAgICA9IFNFKCdtUGF0aCcpO1xuZXhwb3J0IGNvbnN0IFBBVEggICAgICAgICAgICAgICAgID0gU0UoJ3BhdGgnKTtcbmV4cG9ydCBjb25zdCBQQVRURVJOICAgICAgICAgICAgICA9IFNFKCdwYXR0ZXJuJyk7XG5leHBvcnQgY29uc3QgUE9MWUdPTiAgICAgICAgICAgICAgPSBTRSgncG9seWdvbicpO1xuZXhwb3J0IGNvbnN0IFBPTFlMSU5FICAgICAgICAgICAgID0gU0UoJ3BvbHlsaW5lJyk7XG5leHBvcnQgY29uc3QgUFJFRkVUQ0ggICAgICAgICAgICAgPSBTRSgncHJlZmV0Y2gnKTtcbmV4cG9ydCBjb25zdCBSQURJQUxHUkFESUVOVCAgICAgICA9IFNFKCdyYWRpYWxncmFkaWVudCcpO1xuZXhwb3J0IGNvbnN0IFJFQ1QgICAgICAgICAgICAgICAgID0gU0UoJ3JlY3QnKTtcbmV4cG9ydCBjb25zdCBTRVQgICAgICAgICAgICAgICAgICA9IFNFKCdzZXQnKTtcbmV4cG9ydCBjb25zdCBTT0xJRENPTE9SICAgICAgICAgICA9IFNFKCdzb2xpZENvbG9yJyk7XG5leHBvcnQgY29uc3QgU1RPUCAgICAgICAgICAgICAgICAgPSBTRSgnc3RvcCcpO1xuZXhwb3J0IGNvbnN0IFNWRyAgICAgICAgICAgICAgICAgID0gU0UoJ3N2ZycpO1xuZXhwb3J0IGNvbnN0IFNXSVRDSCAgICAgICAgICAgICAgID0gU0UoJ3N3aXRjaCcpO1xuZXhwb3J0IGNvbnN0IFNZTUJPTCAgICAgICAgICAgICAgID0gU0UoJ3N5bWJvbCcpO1xuZXhwb3J0IGNvbnN0IFRCUkVBSyAgICAgICAgICAgICAgID0gU0UoJ3RicmVhaycpO1xuZXhwb3J0IGNvbnN0IFRFWFQgICAgICAgICAgICAgICAgID0gU0UoJ3RleHQnKTtcbmV4cG9ydCBjb25zdCBURVhUUEFUSCAgICAgICAgICAgICA9IFNFKCd0ZXh0cGF0aCcpO1xuZXhwb3J0IGNvbnN0IFRSRUYgICAgICAgICAgICAgICAgID0gU0UoJ3RyZWYnKTtcbmV4cG9ydCBjb25zdCBUU1BBTiAgICAgICAgICAgICAgICA9IFNFKCd0c3BhbicpO1xuZXhwb3J0IGNvbnN0IFVOS05PV04gICAgICAgICAgICAgID0gU0UoJ3Vua25vd24nKTtcbmV4cG9ydCBjb25zdCBVU0UgICAgICAgICAgICAgICAgICA9IFNFKCd1c2UnKTtcbmV4cG9ydCBjb25zdCBWSUVXICAgICAgICAgICAgICAgICA9IFNFKCd2aWV3Jyk7XG5leHBvcnQgY29uc3QgVktFUk4gICAgICAgICAgICAgICAgPSBTRSgndktlcm4nKTtcblxuY29uc3QgU1ZHX1JFID0gbmV3IFJlZ0V4cChgXigke1NWR19FTEVNRU5UX05BTUVTLmpvaW4oJ3wnKX0pJGAsICdpJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gU1ZHX1JFLnRlc3QodGFnTmFtZSk7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IGFzIF9NeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuY29uc3QgSVNfVEVNUExBVEUgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBJU19TQ1JJUFQgICA9IC9eKHNjcmlwdCkkL2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IFV0aWxzLnJlc29sdmVVUkwobG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IG5vZGVIYW5kbGVyICAgICAgICAgPSBvcHRpb25zLm5vZGVIYW5kbGVyO1xuICBsZXQgdGVtcGxhdGVDb3VudCAgICAgICA9IGNoaWxkcmVuLnJlZHVjZSgoc3VtLCBlbGVtZW50KSA9PiAoKElTX1RFTVBMQVRFLnRlc3QoZWxlbWVudC50YWdOYW1lKSkgPyAoc3VtICsgMSkgOiBzdW0pLCAwKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgY2hpbGRyZW4sXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB0ZW1wbGF0ZSxcbiAgICB0ZW1wbGF0ZUNvdW50LFxuICAgIHVybCxcbiAgfTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgIGlmICh0ZW1wbGF0ZUNvdW50ID09PSAxICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSA9PSBudWxsICYmIGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtbmFtZScpID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke3VybH06IDx0ZW1wbGF0ZT4gaXMgbWlzc2luZyBhIFwiZGF0YS1mb3JcIiBhdHRyaWJ1dGUsIGxpbmtpbmcgaXQgdG8gaXRzIG93bmVyIGNvbXBvbmVudC4gR3Vlc3NpbmcgXCIke2d1ZXNzZWRFbGVtZW50TmFtZX1cIi5gKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWZvcicsIGd1ZXNzZWRFbGVtZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1RlbXBsYXRlOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgfHwgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCIgaV1gKSlcbiAgICAgICAgb3duZXJEb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9IGVsc2UgaWYgKElTX1NDUklQVC50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxzY3JpcHQ+XG4gICAgICBsZXQgY2hpbGRDbG9uZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2YgY2hpbGQuZ2V0QXR0cmlidXRlTmFtZXMoKSlcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgY2hpbGQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpKTtcblxuICAgICAgbGV0IHNyYyA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIHNyYyA9IFV0aWxzLnJlc29sdmVVUkwoYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBVdGlscy5TSEEyNTYoYElEU1RZTEUke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZENsb25lLmlubmVySFRNTH1gKTtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdCMke3N0eWxlSUR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKCgvXihsaW5rfHN0eWxlKSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkge1xuICAgICAgbGV0IGlzU3R5bGUgPSAoL15zdHlsZSQvaSkudGVzdChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1N0eWxlLCBpc0xpbms6ICFpc1N0eWxlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVIYW5kbGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzTWV0YTogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pO1xuXG4gICAgICAvLyBkbyBub3RoaW5nIHdpdGggdGhlc2UgdGFnc1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkOiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuY2xhc3MgUmVxdWlyZSBleHRlbmRzIF9NeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyBDQUNIRSA9IG5ldyBNYXAoKTtcblxuICBzdGF0aWMgYXN5bmMgcmVxdWlyZShvd25lckRvY3VtZW50LCB1cmxPck5hbWUsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgICA9IF9vcHRpb25zIHx8IHt9O1xuICAgIGxldCB1cmwgICAgICAgPSBVdGlscy5yZXNvbHZlVVJMKG93bmVyRG9jdW1lbnQubG9jYXRpb24sIHVybE9yTmFtZSwgb3B0aW9ucy5tYWdpYyk7XG4gICAgbGV0IGNhY2hlS2V5ICA9IHVybC50b1N0cmluZygpO1xuXG4gICAgbGV0IGNhY2hlZFJlc3BvbnNlID0gdGhpcy5DQUNIRS5nZXQoY2FjaGVLZXkpO1xuICAgIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgY2FjaGVkUmVzcG9uc2UgPSBhd2FpdCBjYWNoZWRSZXNwb25zZTtcblxuICAgICAgaWYgKGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlICYmIGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSZXR1cm5pbmcgY2FjaGVkIHJlc3BvbnNlIScpO1xuICAgICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlOiBjYWNoZWRSZXNwb25zZS5yZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiB0cnVlIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSBmZXRjaCh1cmwsIG9wdGlvbnMuZmV0Y2hPcHRpb25zKS50aGVuKFxuICAgICAgYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICB0aGlzLkNBQ0hFLmRlbGV0ZShjYWNoZUtleSk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIHJlc3BvbnNlLnRleHQgPSBhc3luYyAoKSA9PiBib2R5O1xuICAgICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IGZhbHNlIH07XG4gICAgICB9LFxuICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZyb20gTXl0aGl4IFVJIFwicmVxdWlyZVwiOiAnLCBlcnJvcik7XG4gICAgICAgIHRoaXMuQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIHRoaXMuQ0FDSEUuc2V0KGNhY2hlS2V5LCBwcm9taXNlKTtcblxuICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICB9XG5cbiAgYXN5bmMgbW91bnRlZCgpIHtcbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7XG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVybCxcbiAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIGNhY2hlZCxcbiAgICAgIH0gPSBhd2FpdCB0aGlzLmNvbnN0cnVjdG9yLnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvcixcbiAgICAgICAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghaXNIYW5kbGVkICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1yZXF1aXJlXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5pZiAoIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIFJlcXVpcmUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5pbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuLypcbk1hbnkgdGhhbmtzIHRvIFNhZ2VlIENvbndheSBmb3IgdGhlIGZvbGxvd2luZyBDU1Mgc3Bpbm5lcnNcbmh0dHBzOi8vY29kZXBlbi5pby9zYWNvbndheS9wZW4vdllLWXlyeFxuKi9cblxuY29uc3QgU1RZTEVfU0hFRVQgPVxuYFxuOmhvc3Qge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IDFlbTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuOmhvc3QoLnNtYWxsKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAwLjc1KTtcbn1cbjpob3N0KC5tZWRpdW0pIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDEuNSk7XG59XG46aG9zdCgubGFyZ2UpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDMpO1xufVxuLnNwaW5uZXItaXRlbSxcbi5zcGlubmVyLWl0ZW06OmJlZm9yZSxcbi5zcGlubmVyLWl0ZW06OmFmdGVyIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDYwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjI1KTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICcjMzMzJykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICcjMzMzJykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzczogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMDc1KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgYm9yZGVyOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIHtcbiAgdG8ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAxLjApO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpICogMC4wNzUpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYm9yZGVyLWJvdHRvbTogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC44NzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjQpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDAuNzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpKSByb3RhdGUoNDVkZWcpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIuNSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIHtcbiAgMCUsIDguMzMlLCAxNi42NiUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMjQuOTklLCAzMy4zMiUsIDQxLjY1JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMCUpO1xuICB9XG4gIDQ5Ljk4JSwgNTguMzElLCA2Ni42NCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDEwMCUpO1xuICB9XG4gIDc0Ljk3JSwgODMuMzAlLCA5MS42MyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICcjMzMzJykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24zIHtcbiAgMCUsIDgzLjMwJSwgOTEuNjMlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwKTtcbiAgfVxuICA4LjMzJSwgMTYuNjYlLCAyNC45OSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwKTtcbiAgfVxuICAzMy4zMiUsIDQxLjY1JSwgNDkuOTglIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgLTEwMCUpO1xuICB9XG4gIDU4LjMxJSwgNjYuNjQlLCA3NC45NyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIC0xMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyA0KTtcbiAgbWluLXdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItd2F2ZS1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDc1JSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTc1JSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1waXBlLWFuaW1hdGlvbiB7XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDIpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAnIzMzMycpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICcjMzMzJykpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgJyMzMzMnKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgLyAtMik7XG59XG5gO1xuXG5jb25zdCBLSU5EUyA9IHtcbiAgJ2F1ZGlvJzogIDUsXG4gICdjaXJjbGUnOiAzLFxuICAnZG90JzogICAgMixcbiAgJ3BpcGUnOiAgIDUsXG4gICdwdXp6bGUnOiAzLFxuICAnd2F2ZSc6ICAgMyxcbn07XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSVNwaW5uZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lICAgICAgICAgICAgPSAnbXl0aGl4LXNwaW5uZXInO1xuICBzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gWyAna2luZCcgXTtcblxuICBhdHRyaWJ1dGVDaGFuZ2VkKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIGlmIChuYW1lICE9PSAna2luZCcpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLmhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCkge1xuICAgICAgLy8gYXBwZW5kIHRlbXBsYXRlXG4gICAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIHRoaXMuYnVpbGQoKHsgVEVNUExBVEUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gVEVNUExBVEVcbiAgICAgICAgICAuZGF0YU15dGhpeE5hbWUodGhpcy5zZW5zaXRpdmVUYWdOYW1lKVxuICAgICAgICAgIC5wcm9wJGlubmVySFRNTChgPHN0eWxlPiR7U1RZTEVfU0hFRVR9PC9zdHlsZT5gKTtcbiAgICAgIH0pLmFwcGVuZFRvKG93bmVyRG9jdW1lbnQuYm9keSk7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00odGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGxldCBraW5kID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2tpbmQnKTtcbiAgICBpZiAoIWtpbmQpIHtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgna2luZCcsIGtpbmQpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShraW5kKTtcbiAgfVxuXG4gIGhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UoX2tpbmQpIHtcbiAgICBsZXQga2luZCAgICAgICAgPSAoJycgKyBfa2luZCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChLSU5EUywga2luZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtc3Bpbm5lclwiIHVua25vd24gXCJraW5kXCIgcHJvdmlkZWQ6IFwiJHtraW5kfVwiLiBTdXBwb3J0ZWQgXCJraW5kXCIgYXR0cmlidXRlIHZhbHVlcyBhcmU6IFwicGlwZVwiLCBcImF1ZGlvXCIsIFwiY2lyY2xlXCIsIFwicHV6emxlXCIsIFwid2F2ZVwiLCBhbmQgXCJkb3RcIi5gKTtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VTcGlubmVyQ2hpbGRyZW4oS0lORFNba2luZF0pO1xuICB9XG5cbiAgYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICBsZXQgY2hpbGRyZW4gICAgICA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXItaXRlbScpO1xuXG4gICAgICBjaGlsZHJlbltpXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJChjaGlsZHJlbik7XG4gIH1cblxuICBjaGFuZ2VTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICB0aGlzLiQoJy5zcGlubmVyLWl0ZW0nKS5yZW1vdmUoKTtcbiAgICB0aGlzLmJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG5cbiAgICAvLyBBbHdheXMgYXBwZW5kIHN0eWxlIGFnYWluLCBzb1xuICAgIC8vIHRoYXQgaXQgaXMgdGhlIGxhc3QgY2hpbGQsIGFuZFxuICAgIC8vIGRvZXNuJ3QgbWVzcyB3aXRoIFwibnRoLWNoaWxkXCJcbiAgICAvLyBzZWxlY3RvcnNcbiAgICB0aGlzLiQoJ3N0eWxlJykuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuICB9XG59XG5cbk15dGhpeFVJU3Bpbm5lci5yZWdpc3RlcigpO1xuIiwiaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuY29uc3QgSVNfSU5URUdFUiA9IC9eXFxkKyQvO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gV2UgaGF2ZSBhbiBFbGVtZW50IG9yIGEgRG9jdW1lbnRcbiAgaWYgKHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1Nsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBpc05vdFNsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICFlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENsYXNzTmFtZXMoLi4uYXJncykge1xuICBsZXQgY2xhc3NOYW1lcyA9IFtdLmNvbmNhdCguLi5hcmdzKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAubWFwKChwYXJ0KSA9PiAoJycgKyBwYXJ0KS5zcGxpdCgvXFxzKy8pKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBjbGFzc05hbWVzO1xufVxuXG5leHBvcnQgY2xhc3MgUXVlcnlFbmdpbmUge1xuICBzdGF0aWMgaXNFbGVtZW50ICAgID0gaXNFbGVtZW50O1xuICBzdGF0aWMgaXNTbG90dGVkICAgID0gaXNTbG90dGVkO1xuICBzdGF0aWMgaXNOb3RTbG90dGVkID0gaXNOb3RTbG90dGVkO1xuXG4gIHN0YXRpYyBmcm9tID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoW10sIHsgcm9vdDogKGlzRWxlbWVudCh0aGlzKSkgPyB0aGlzIDogZG9jdW1lbnQsIGNvbnRleHQ6IHRoaXMgfSk7XG5cbiAgICBjb25zdCBnZXRPcHRpb25zID0gKCkgPT4ge1xuICAgICAgbGV0IGJhc2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihiYXNlLCBhcmdzW2FyZ0luZGV4KytdKTtcblxuICAgICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXhdLmdldE9wdGlvbnMoKSB8fCB7fSwgYmFzZSk7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSb290RWxlbWVudCA9IChvcHRpb25zUm9vdCkgPT4ge1xuICAgICAgaWYgKGlzRWxlbWVudChvcHRpb25zUm9vdCkpXG4gICAgICAgIHJldHVybiBvcHRpb25zUm9vdDtcblxuICAgICAgaWYgKGlzRWxlbWVudCh0aGlzKSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHJldHVybiAoKHRoaXMgJiYgdGhpcy5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudCk7XG4gICAgfTtcblxuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBnZXRPcHRpb25zKCk7XG4gICAgbGV0IHJvb3QgICAgICA9IGdldFJvb3RFbGVtZW50KG9wdGlvbnMucm9vdCk7XG4gICAgbGV0IHF1ZXJ5RW5naW5lO1xuXG4gICAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgdGhpcztcblxuICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XS5zbGljZSgpLCBvcHRpb25zKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbYXJnSW5kZXhdKSkge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4ICsgMV0sICdGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1sxXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnU3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJvb3QucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdGdW5jdGlvbicpKSB7XG4gICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cywgb3B0aW9ucyk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbnZva2VDYWxsYmFja3MgIT09IGZhbHNlICYmIHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfTtcblxuICBnZXRFbmdpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gUXVlcnlFbmdpbmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSU9wdGlvbnMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnX215dGhpeFVJRWxlbWVudHMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5maWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhvcHRpb25zLmNvbnRleHQsIGVsZW1lbnRzKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wTmFtZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdsZW5ndGgnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5wcm90b3R5cGU7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY29uc3RydWN0b3InKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gSW5kZXggbG9va3VwXG4gICAgICAgIGlmIChJU19JTlRFR0VSLnRlc3QocHJvcE5hbWUpKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgIC8vIFJlZGlyZWN0IGFueSBhcnJheSBtZXRob2RzXG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlW3Byb3BOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IGFycmF5ICAgPSB0YXJnZXQuX215dGhpeFVJRWxlbWVudHM7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ICA9IGFycmF5W3Byb3BOYW1lXSguLi5hcmdzKTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiByZXN1bHQuZXZlcnkoKGl0ZW0pID0+IFV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbiwgTm9kZSwgUXVlcnlFbmdpbmUpKSkge1xuICAgICAgICAgICAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRhcmdldC5nZXRFbmdpbmVDbGFzcygpO1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHJlc3VsdCwgdGFyZ2V0LmdldE9wdGlvbnMoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByb290UHJveHk7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSU9wdGlvbnM7XG4gIH1cblxuICBnZXRDb250ZXh0KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMuY29udGV4dDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5yb290IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZ2V0VW5kZXJseWluZ0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzO1xuICB9XG5cbiAgZ2V0T3duZXJEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSb290KCkub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKGNvbnRleHQsIGVsZW1lbnRzKSB7XG4gICAgbGV0IGZpbmFsRWxlbWVudHMgPSBBcnJheS5mcm9tKGVsZW1lbnRzKS5mbGF0KEluZmluaXR5KS5tYXAoKF9pdGVtKSA9PiB7XG4gICAgICBpZiAoIV9pdGVtKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGxldCBpdGVtID0gX2l0ZW07XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgICByZXR1cm4gaXRlbS5nZXRVbmRlcmx5aW5nQXJyYXkoKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCBOb2RlKSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAgIGlmIChpdGVtW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIGl0ZW0gPSBpdGVtKCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgJ1N0cmluZycpKVxuICAgICAgICBpdGVtID0gRWxlbWVudHMuVGVybShpdGVtKTtcbiAgICAgIGVsc2UgaWYgKCFVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24pKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGlmICghY29udGV4dClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJjb250ZXh0XCIgb3B0aW9uIGZvciBRdWVyeUVuZ2luZSBpcyByZXF1aXJlZCB3aGVuIGNvbnN0cnVjdGluZyBlbGVtZW50cy4nKTtcblxuICAgICAgcmV0dXJuIGl0ZW0uYnVpbGQodGhpcy5nZXRPd25lckRvY3VtZW50KCksIGNvbnRleHQpO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgJCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgdGhpcy5nZXRPcHRpb25zKCksIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy4kKFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1swXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkpKTtcbiAgfVxuXG4gIGxhc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIVV0aWxzLmlzVHlwZShjb3VudCwgJ051bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuJChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLiQodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkgKiAtMSkpO1xuICB9XG5cbiAgYWRkKC4uLmVsZW1lbnRzKSB7XG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLnNsaWNlKCkuY29uY2F0KC4uLmVsZW1lbnRzKSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgc3VidHJhY3QoLi4uZWxlbWVudHMpIHtcbiAgICBsZXQgc2V0ID0gbmV3IFNldChlbGVtZW50cyk7XG5cbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gIXNldC5oYXMoaXRlbSk7XG4gICAgfSksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICBpZiAoIWlzRWxlbWVudCh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB2YWx1ZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYXBwZW5kVG8oc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgfVxuXG4gIGluc2VydEludG8oc2VsZWN0b3JPckVsZW1lbnQsIHJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoIXRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5nZXRPd25lckRvY3VtZW50KCk7XG4gICAgbGV0IHNvdXJjZSAgICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cbiAgICAgIHNvdXJjZSA9IFsgZnJhZ21lbnQgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50Lmluc2VydChzb3VyY2VbMF0sIHJlZmVyZW5jZU5vZGUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXBsYWNlQ2hpbGRyZW5PZihzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBlbmRUbyhlbGVtZW50KTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xhc3NMaXN0KG9wZXJhdGlvbiwgLi4uYXJncykge1xuICAgIGxldCBjbGFzc05hbWVzID0gY29sbGVjdENsYXNzTmFtZXMoYXJncyk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAndG9nZ2xlJylcbiAgICAgICAgICBjbGFzc05hbWVzLmZvckVhY2goKGNsYXNzTmFtZSkgPT4gbm9kZS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbm9kZS5jbGFzc0xpc3Rbb3BlcmF0aW9uXSguLi5jbGFzc05hbWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZENsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ2FkZCcsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgncmVtb3ZlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICB0b2dnbGVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCd0b2dnbGUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHNsb3R0ZWQoeWVzTm8pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIoKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgeWVzTm8pID8gaXNTbG90dGVkIDogaXNOb3RTbG90dGVkKTtcbiAgfVxufVxuXG5pZiAoIWdsb2JhbFRoaXMuTXl0aGl4VUlRdWVyeUVuZ2luZSlcbiAgZ2xvYmFsVGhpcy5NeXRoaXhVSVF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBTSEEyNTYoX2lucHV0KSB7XG4gIGxldCBpbnB1dCA9IF9pbnB1dDtcblxuICBsZXQgbWF0aFBvdyA9IE1hdGgucG93O1xuICBsZXQgbWF4V29yZCA9IG1hdGhQb3coMiwgMzIpO1xuICBsZXQgbGVuZ3RoUHJvcGVydHkgPSAnbGVuZ3RoJztcbiAgbGV0IGk7IGxldCBqOyAvLyBVc2VkIGFzIGEgY291bnRlciBhY3Jvc3MgdGhlIHdob2xlIGZpbGVcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIGxldCB3b3JkcyA9IFtdO1xuICBsZXQgYXNjaWlCaXRMZW5ndGggPSBpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gKiA4O1xuXG4gIC8vKiBjYWNoaW5nIHJlc3VsdHMgaXMgb3B0aW9uYWwgLSByZW1vdmUvYWRkIHNsYXNoIGZyb20gZnJvbnQgb2YgdGhpcyBsaW5lIHRvIHRvZ2dsZVxuICAvLyBJbml0aWFsIGhhc2ggdmFsdWU6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgZmlyc3QgOCBwcmltZXNcbiAgLy8gKHdlIGFjdHVhbGx5IGNhbGN1bGF0ZSB0aGUgZmlyc3QgNjQsIGJ1dCBleHRyYSB2YWx1ZXMgYXJlIGp1c3QgaWdub3JlZClcbiAgbGV0IGhhc2ggPSBTSEEyNTYuaCA9IFNIQTI1Ni5oIHx8IFtdO1xuICAvLyBSb3VuZCBjb25zdGFudHM6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDY0IHByaW1lc1xuICBsZXQgayA9IFNIQTI1Ni5rID0gU0hBMjU2LmsgfHwgW107XG4gIGxldCBwcmltZUNvdW50ZXIgPSBrW2xlbmd0aFByb3BlcnR5XTtcbiAgLyovXG4gICAgbGV0IGhhc2ggPSBbXSwgayA9IFtdO1xuICAgIGxldCBwcmltZUNvdW50ZXIgPSAwO1xuICAgIC8vKi9cblxuICBsZXQgaXNDb21wb3NpdGUgPSB7fTtcbiAgZm9yIChsZXQgY2FuZGlkYXRlID0gMjsgcHJpbWVDb3VudGVyIDwgNjQ7IGNhbmRpZGF0ZSsrKSB7XG4gICAgaWYgKCFpc0NvbXBvc2l0ZVtjYW5kaWRhdGVdKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMzEzOyBpICs9IGNhbmRpZGF0ZSlcbiAgICAgICAgaXNDb21wb3NpdGVbaV0gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGhhc2hbcHJpbWVDb3VudGVyXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMC41KSAqIG1heFdvcmQpIHwgMDtcbiAgICAgIGtbcHJpbWVDb3VudGVyKytdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAxIC8gMykgKiBtYXhXb3JkKSB8IDA7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQgKz0gJ1xceDgwJzsgLy8gQXBwZW5kIMaHJyBiaXQgKHBsdXMgemVybyBwYWRkaW5nKVxuICB3aGlsZSAoaW5wdXRbbGVuZ3RoUHJvcGVydHldICUgNjQgLSA1NilcbiAgICBpbnB1dCArPSAnXFx4MDAnOyAvLyBNb3JlIHplcm8gcGFkZGluZ1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbnB1dFtsZW5ndGhQcm9wZXJ0eV07IGkrKykge1xuICAgIGogPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChqID4+IDgpXG4gICAgICByZXR1cm47IC8vIEFTQ0lJIGNoZWNrOiBvbmx5IGFjY2VwdCBjaGFyYWN0ZXJzIGluIHJhbmdlIDAtMjU1XG4gICAgd29yZHNbaSA+PiAyXSB8PSBqIDw8ICgoMyAtIGkpICUgNCkgKiA4O1xuICB9XG5cbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9ICgoYXNjaWlCaXRMZW5ndGggLyBtYXhXb3JkKSB8IDApO1xuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKGFzY2lpQml0TGVuZ3RoKTtcblxuICAvLyBwcm9jZXNzIGVhY2ggY2h1bmtcbiAgZm9yIChqID0gMDsgaiA8IHdvcmRzW2xlbmd0aFByb3BlcnR5XTspIHtcbiAgICBsZXQgdyA9IHdvcmRzLnNsaWNlKGosIGogKz0gMTYpOyAvLyBUaGUgbWVzc2FnZSBpcyBleHBhbmRlZCBpbnRvIDY0IHdvcmRzIGFzIHBhcnQgb2YgdGhlIGl0ZXJhdGlvblxuICAgIGxldCBvbGRIYXNoID0gaGFzaDtcblxuICAgIC8vIFRoaXMgaXMgbm93IHRoZSB1bmRlZmluZWR3b3JraW5nIGhhc2hcIiwgb2Z0ZW4gbGFiZWxsZWQgYXMgdmFyaWFibGVzIGEuLi5nXG4gICAgLy8gKHdlIGhhdmUgdG8gdHJ1bmNhdGUgYXMgd2VsbCwgb3RoZXJ3aXNlIGV4dHJhIGVudHJpZXMgYXQgdGhlIGVuZCBhY2N1bXVsYXRlXG4gICAgaGFzaCA9IGhhc2guc2xpY2UoMCwgOCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIGludG8gNjQgd29yZHNcbiAgICAgIC8vIFVzZWQgYmVsb3cgaWZcbiAgICAgIGxldCB3MTUgPSB3W2kgLSAxNV07IGxldCB3MiA9IHdbaSAtIDJdO1xuXG4gICAgICAvLyBJdGVyYXRlXG4gICAgICBsZXQgYSA9IGhhc2hbMF07IGxldCBlID0gaGFzaFs0XTtcbiAgICAgIGxldCB0ZW1wMSA9IGhhc2hbN11cbiAgICAgICAgICAgICAgICArICgoKGUgPj4+IDYpIHwgKGUgPDwgMjYpKSBeICgoZSA+Pj4gMTEpIHwgKGUgPDwgMjEpKSBeICgoZSA+Pj4gMjUpIHwgKGUgPDwgNykpKSAvLyBTMVxuICAgICAgICAgICAgICAgICsgKChlICYgaGFzaFs1XSkgXiAoKH5lKSAmIGhhc2hbNl0pKSAvLyBjaFxuICAgICAgICAgICAgICAgICsga1tpXVxuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICArICh3W2ldID0gKGkgPCAxNikgPyB3W2ldIDogKFxuICAgICAgICAgICAgICAgICAgd1tpIC0gMTZdXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcxNSA+Pj4gNykgfCAodzE1IDw8IDI1KSkgXiAoKHcxNSA+Pj4gMTgpIHwgKHcxNSA8PCAxNCkpIF4gKHcxNSA+Pj4gMykpIC8vIHMwXG4gICAgICAgICAgICAgICAgICAgICAgICArIHdbaSAtIDddXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcyID4+PiAxNykgfCAodzIgPDwgMTUpKSBeICgodzIgPj4+IDE5KSB8ICh3MiA8PCAxMykpIF4gKHcyID4+PiAxMCkpIC8vIHMxXG4gICAgICAgICAgICAgICAgKSB8IDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgLy8gVGhpcyBpcyBvbmx5IHVzZWQgb25jZSwgc28gKmNvdWxkKiBiZSBtb3ZlZCBiZWxvdywgYnV0IGl0IG9ubHkgc2F2ZXMgNCBieXRlcyBhbmQgbWFrZXMgdGhpbmdzIHVucmVhZGJsZVxuICAgICAgbGV0IHRlbXAyID0gKCgoYSA+Pj4gMikgfCAoYSA8PCAzMCkpIF4gKChhID4+PiAxMykgfCAoYSA8PCAxOSkpIF4gKChhID4+PiAyMikgfCAoYSA8PCAxMCkpKSAvLyBTMFxuICAgICAgICAgICAgICAgICsgKChhICYgaGFzaFsxXSkgXiAoYSAmIGhhc2hbMl0pIF4gKGhhc2hbMV0gJiBoYXNoWzJdKSk7IC8vIG1halxuXG4gICAgICBoYXNoID0gWyh0ZW1wMSArIHRlbXAyKSB8IDBdLmNvbmNhdChoYXNoKTsgLy8gV2UgZG9uJ3QgYm90aGVyIHRyaW1taW5nIG9mZiB0aGUgZXh0cmEgb25lcywgdGhleSdyZSBoYXJtbGVzcyBhcyBsb25nIGFzIHdlJ3JlIHRydW5jYXRpbmcgd2hlbiB3ZSBkbyB0aGUgc2xpY2UoKVxuICAgICAgaGFzaFs0XSA9IChoYXNoWzRdICsgdGVtcDEpIHwgMDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKVxuICAgICAgaGFzaFtpXSA9IChoYXNoW2ldICsgb2xkSGFzaFtpXSkgfCAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIGZvciAoaiA9IDM7IGogKyAxOyBqLS0pIHtcbiAgICAgIGxldCBiID0gKGhhc2hbaV0gPj4gKGogKiA4KSkgJiAyNTU7XG4gICAgICByZXN1bHQgKz0gKChiIDwgMTYpID8gMCA6ICcnKSArIGIudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5sZXQgaWRDb3VudGVyID0gMG47XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcbiAgaWRDb3VudGVyICs9IEJpZ0ludCgxKTtcbiAgcmV0dXJuIGAke0RhdGUubm93KCl9JHtwYWQoaWRDb3VudGVyLnRvU3RyaW5nKCksIElEX0NPVU5UX0xFTkdUSCl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc29sdmFibGUoKSB7XG4gIGxldCBzdGF0dXMgPSAncGVuZGluZyc7XG4gIGxldCByZXNvbHZlO1xuICBsZXQgcmVqZWN0O1xuXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdmdWxmaWxsZWQnO1xuICAgICAgICBfcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICByZWplY3QgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAncmVqZWN0ZWQnO1xuICAgICAgICBfcmVqZWN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvbWlzZSwge1xuICAgICdyZXNvbHZlJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZXNvbHZlLFxuICAgIH0sXG4gICAgJ3JlamVjdCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVqZWN0LFxuICAgIH0sXG4gICAgJ3N0YXR1cyc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKCkgPT4gc3RhdHVzLFxuICAgIH0sXG4gICAgJ2lkJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICBnZW5lcmF0ZUlEKCksXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBsZXQgdGhpc1R5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0aGlzVHlwZSA9PT0gJ2JpZ2ludCcpXG4gICAgcmV0dXJuICdCaWdJbnQnO1xuXG4gIGlmICh0aGlzVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodGhpc1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodmFsdWUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7bmF0aXZlVHlwZU1ldGFbMF19XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBJU19DTEFTUy50ZXN0KCcnICsgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yKSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHt2YWx1ZS5uYW1lfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcbiAgICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgICByZXR1cm4gYFtDbGFzcyAke3Jlc3VsdH1dYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYCR7dGhpc1R5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHt0aGlzVHlwZS5zdWJzdHJpbmcoMSl9YDtcbiAgfVxuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICByZXR1cm4gJ1N0cmluZyc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgIHJldHVybiAnTnVtYmVyJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKVxuICAgIHJldHVybiAnQm9vbGVhbic7XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgIHJldHVybiAnT2JqZWN0JztcblxuICBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10oKTtcblxuICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fCAnT2JqZWN0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGlmICh0eXBlcy5pbmRleE9mKHZhbHVlVHlwZSkgPj0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gdHlwZXMuc29tZSgodHlwZSkgPT4gKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nICYmIHZhbHVlIGluc3RhbmNlb2YgdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZE51bWJlcih2YWx1ZSkge1xuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJ051bWJlcicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgJ051bWJlcicsICdCb29sZWFuJywgJ0JpZ0ludCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xsZWN0YWJsZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKEluZmluaXR5KSB8fCBPYmplY3QuaXMoLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50JykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykgJiYgKC9eW1xcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnTnVtYmVyJykpXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDApO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIU5PRSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTWV0aG9kcyhfcHJvdG8sIHNraXBQcm90b3MpIHtcbiAgbGV0IHByb3RvICAgICAgICAgICA9IF9wcm90bztcbiAgbGV0IGFscmVhZHlWaXNpdGVkICA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAocHJvdG8pIHtcbiAgICBsZXQgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90byk7XG4gICAgbGV0IGtleXMgICAgICAgID0gT2JqZWN0LmtleXMoZGVzY3JpcHRvcnMpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGRlc2NyaXB0b3JzKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXMoa2V5KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZChrZXkpO1xuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzW2tleV07XG5cbiAgICAgIC8vIENhbiBpdCBiZSBjaGFuZ2VkP1xuICAgICAgaWYgKGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIElmIGlzIGdldHRlciwgdGhlbiBza2lwXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdnZXQnKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCB2YWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cbiAgICAgIC8vIFNraXAgcHJvdG90eXBlIG9mIE9iamVjdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBPYmplY3QucHJvdG90eXBlW2tleV0gPT09IHZhbHVlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHsgLi4uZGVzY3JpcHRvciwgdmFsdWU6IHZhbHVlLmJpbmQodGhpcykgfSk7XG4gICAgfVxuXG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIGJyZWFrO1xuXG4gICAgaWYgKHNraXBQcm90b3MgJiYgc2tpcFByb3Rvcy5pbmRleE9mKHByb3RvKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuY29uc3QgTUVUQURBVEFfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCFpc0NvbGxlY3RhYmxlKHRhcmdldCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoIWRhdGEpIHtcbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gZGF0YS5nZXQoa2V5KTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmNvbnN0IE9CSl9JRF9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcbmxldCBpZENvdW50ID0gMW47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmpJRChvYmopIHtcbiAgbGV0IGlkID0gT0JKX0lEX1dFQUtNQVAuZ2V0KG9iaik7XG4gIGlmIChpZCA9PSBudWxsKSB7XG4gICAgbGV0IHRoaXNJRCA9IGAke2lkQ291bnQrK31gO1xuICAgIE9CSl9JRF9XRUFLTUFQLnNldChvYmosIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3BlcnR5IHtcbiAgY29uc3RydWN0b3IoZ2V0dGVyLCBzZXR0ZXIpIHtcbiAgICBpZiAodHlwZW9mIGdldHRlciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZ2V0dGVyXCIgKGZpcnN0KSBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICAgIGlmICh0eXBlb2Ygc2V0dGVyICE9PSAnZnVuY3Rpb24nKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzZXR0ZXJcIiAoc2Vjb25kKSBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd2YWx1ZSc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgIGdldHRlcixcbiAgICAgICAgc2V0OiAgICAgICAgICBzZXR0ZXIsXG4gICAgICB9LFxuICAgICAgJ3JlZ2lzdGVyZWROb2Rlcyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbmV3IFdlYWtNYXAoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICBzZXQoY29udGV4dCwgbmV3VmFsdWUpIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gbmV3VmFsdWUpXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlcyhjb250ZXh0KTtcbiAgfVxuXG4gIHRyaWdnZXJVcGRhdGVzKGNvbnRleHQpIHtcbiAgICBsZXQgbWFwID0gdGhpcy5yZWdpc3RlcmVkTm9kZXMuZ2V0KGNvbnRleHQpO1xuICAgIGlmICghbWFwKVxuICAgICAgcmV0dXJuO1xuXG4gICAgZm9yIChsZXQgWyBub2RlLCBjYWxsYmFjayBdIG9mIG1hcC5lbnRyaWVzKCkpXG4gICAgICBub2RlLm5vZGVWYWx1ZSA9IGNhbGxiYWNrKGNvbnRleHQpO1xuICB9XG5cbiAgcmVnaXN0ZXJGb3JVcGRhdGUoY29udGV4dCwgbm9kZSwgY2FsbGJhY2spIHtcbiAgICBsZXQgbWFwID0gdGhpcy5yZWdpc3RlcmVkTm9kZXMuZ2V0KGNvbnRleHQpO1xuICAgIGlmICghbWFwKSB7XG4gICAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICB0aGlzLnJlZ2lzdGVyZWROb2Rlcy5zZXQoY29udGV4dCwgbWFwKTtcbiAgICB9XG5cbiAgICBpZiAobWFwLmhhcyhub2RlKSlcbiAgICAgIHJldHVybjtcblxuICAgIG1hcC5zZXQobm9kZSwgY2FsbGJhY2spO1xuICB9XG59XG5cbmNvbnN0IEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUyA9IFsgMywgMiBdOyAvLyBURVhUX05PREUsIEFUVFJJQlVURV9OT0RFXG5jb25zdCBWQUxJRF9KU19JREVOVElGSUVSICAgICAgICAgPSAvXlthLXpBLVpfJF1bYS16QS1aMC05XyRdKiQvO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRHluYW1pY1Byb3BlcnR5RmV0Y2hlcihjb250ZXh0LCBfZnVuY3Rpb25Cb2R5LCBfY29udGV4dENhbGxBcmdzKSB7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSAoX2NvbnRleHRDYWxsQXJncykgPyBfY29udGV4dENhbGxBcmdzIDogYHske09iamVjdC5rZXlzKGNvbnRleHQpLmZpbHRlcigobmFtZSkgPT4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpKS5qb2luKCcsJyl9fWA7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKGNvbnRleHRDYWxsQXJncywgYHJldHVybiAke19mdW5jdGlvbkJvZHkucmVwbGFjZSgvXlxccypyZXR1cm5cXHMrLywgJycpfTtgKSkuYmluZCh0aGlzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRlcm0oY29udGV4dCwgX3RleHQpIHtcbiAgbGV0IHRleHQgPSBfdGV4dDtcbiAgbGV0IG5vZGU7XG5cbiAgaWYgKHRleHQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgbm9kZSA9IHRleHQ7XG4gICAgaWYgKEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUy5pbmRleE9mKG5vZGUubm9kZVR5cGUpIDwgMClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZm9ybWF0VGVybVwiIHVuc3VwcG9ydGVkIG5vZGUgdHlwZSBwcm92aWRlZC4gT25seSBURVhUX05PREUgYW5kIEFUVFJJQlVURV9OT0RFIHR5cGVzIGFyZSBzdXBwb3J0ZWQuJyk7XG5cbiAgICB0ZXh0ID0gbm9kZS5ub2RlVmFsdWU7XG4gIH1cblxuICBsZXQgY29udGV4dENhbGxBcmdzID0gYHske09iamVjdC5rZXlzKGNvbnRleHQpLmZpbHRlcigobmFtZSkgPT4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpKS5qb2luKCcsJyl9fWA7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoLyg/Ol5cXHtcXHt8KFteXFxcXF0pXFx7XFx7KShbXn1dKz8pXFx9ezIsfS9nLCAobSwgc3RhcnQsIG1hY3JvKSA9PiB7XG4gICAgY29uc3QgZmV0Y2ggPSBjcmVhdGVEeW5hbWljUHJvcGVydHlGZXRjaGVyKGNvbnRleHQsIG1hY3JvLCBjb250ZXh0Q2FsbEFyZ3MpO1xuICAgIGxldCB2YWx1ZSAgID0gZmV0Y2goY29udGV4dCk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICB2YWx1ZSA9ICcnO1xuXG4gICAgaWYgKG5vZGUgJiYgdmFsdWUgaW5zdGFuY2VvZiBEeW5hbWljUHJvcGVydHkpXG4gICAgICB2YWx1ZS5yZWdpc3RlckZvclVwZGF0ZShjb250ZXh0LCBub2RlLCAoY29udGV4dCkgPT4gZm9ybWF0VGVybShjb250ZXh0LCB0ZXh0KSk7XG5cbiAgICByZXR1cm4gYCR7c3RhcnQgfHwgJyd9JHt2YWx1ZX1gO1xuICB9KTtcbn1cblxuY29uc3QgSEFTX0RZTkFNSUNfQklORElORyA9IC9eXFx7XFx7fFteXFxcXF1cXHtcXHsvO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nSXNEeW5hbWljQmluZGluZ1RlbXBsYXRlKHZhbHVlKSB7XG4gIGlmICghaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBIQVNfRFlOQU1JQ19CSU5ESU5HLnRlc3QodmFsdWUpO1xufVxuXG5jb25zdCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FID0gL15bXFx3LiRdKyQvO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50Q2FsbGJhY2soX2Z1bmN0aW9uQm9keSkge1xuICBsZXQgZnVuY3Rpb25Cb2R5ID0gX2Z1bmN0aW9uQm9keTtcbiAgaWYgKEVWRU5UX0FDVElPTl9KVVNUX05BTUUudGVzdChmdW5jdGlvbkJvZHkpKVxuICAgIGZ1bmN0aW9uQm9keSA9IGB0aGlzLiR7ZnVuY3Rpb25Cb2R5fShldmVudClgO1xuXG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKCdldmVudCcsIGBsZXQgZT1ldmVudCxldj1ldmVudCxldnQ9ZXZlbnQ7cmV0dXJuICR7ZnVuY3Rpb25Cb2R5LnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKi8sICcnKX07YCkpLmJpbmQodGhpcyk7XG59XG5cbmNvbnN0IElTX0VWRU5UX05BTUUgICAgID0gL15vbi87XG5jb25zdCBFVkVOVF9OQU1FX0NBQ0hFICA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuICBpZiAoRVZFTlRfTkFNRV9DQUNIRVt0YWdOYW1lXSlcbiAgICByZXR1cm4gRVZFTlRfTkFNRV9DQUNIRVt0YWdOYW1lXTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEVbdGFnTmFtZV0gPSBldmVudE5hbWVzO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGNvbnRleHQsIGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoaXNQbGFpbk9iamVjdChfY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgID0gX2NhbGxiYWNrLmNhbGxiYWNrO1xuICAgIG9wdGlvbnMgICA9IF9jYWxsYmFjay5vcHRpb25zIHx8IHt9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBfY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayA9IF9jYWxsYmFjaztcbiAgfVxuXG4gIGlmIChpc1R5cGUoY2FsbGJhY2ssICdTdHJpbmcnKSlcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUV2ZW50Q2FsbGJhY2suY2FsbChjb250ZXh0LCBjYWxsYmFjayk7XG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7IGNhbGxiYWNrLCBvcHRpb25zIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaChvYmosIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmIChvYmogPT0gbnVsbCB8fCBPYmplY3QuaXMob2JqLCBOYU4pIHx8IE9iamVjdC5pcyhvYmosIEluZmluaXR5KSB8fCBPYmplY3QuaXMob2JqLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgaWYgKGtleSA9PSBudWxsIHx8IE9iamVjdC5pcyhrZXksIE5hTikgfHwgT2JqZWN0LmlzKGtleSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhrZXksIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBsZXQgcGFydHMgICAgICAgICA9IGtleS5zcGxpdCgvXFwuL2cpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGN1cnJlbnRWYWx1ZSAgPSBvYmo7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gcGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XG4gICAgbGV0IG5leHRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwYXJ0XTtcbiAgICBpZiAobmV4dFZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY3VycmVudFZhbHVlID0gbmV4dFZhbHVlO1xuICB9XG5cbiAgaWYgKGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUgaW5zdGFuY2VvZiBOb2RlICYmIChjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkpXG4gICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5ub2RlVmFsdWU7XG5cbiAgcmV0dXJuIChjdXJyZW50VmFsdWUgPT0gbnVsbCkgPyBkZWZhdWx0VmFsdWUgOiBjdXJyZW50VmFsdWU7XG59XG5cbmNvbnN0IFNDSEVNRV9SRSAgICAgPSAvXltcXHctXSs6XFwvXFwvLztcbmNvbnN0IEhBU19GSUxFTkFNRSAgPSAvXFwuW14vLl0rJC87XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVVJMKGxvY2F0aW9uLCBfdXJsaXNoLCBtYWdpYykge1xuICBsZXQgdXJsaXNoID0gX3VybGlzaDtcbiAgaWYgKCF1cmxpc2gpXG4gICAgdXJsaXNoID0gbmV3IFVSTChsb2NhdGlvbik7XG5cbiAgaWYgKHVybGlzaCBpbnN0YW5jZW9mIExvY2F0aW9uKVxuICAgIHVybGlzaCA9IG5ldyBVUkwodXJsaXNoKTtcblxuICBpZiAoIWlzVHlwZSh1cmxpc2gsICdTdHJpbmcnLCBVUkwpKVxuICAgIHJldHVybjtcblxuICBjb25zdCBpbnRlcm5hbFJlc29sdmUgPSAoX2xvY2F0aW9uLCBfdXJsUGFydCwgbWFnaWMpID0+IHtcbiAgICBsZXQgb3JpZ2luYWxVUkwgPSB1cmxpc2g7XG4gICAgaWYgKFNDSEVNRV9SRS50ZXN0KHVybGlzaCkpXG4gICAgICByZXR1cm4gdXJsaXNoO1xuXG4gICAgLy8gTWFnaWMhXG4gICAgaWYgKG1hZ2ljID09PSB0cnVlICYmICFIQVNfRklMRU5BTUUudGVzdCh1cmxpc2gpKSB7XG4gICAgICBsZXQgcGFydHMgICAgID0gdXJsaXNoLnNwbGl0KCcvJykubWFwKChwYXJ0KSA9PiBwYXJ0LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgbGV0IGxhc3RQYXJ0ICA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGxhc3RQYXJ0KVxuICAgICAgICB1cmxpc2ggPSBgJHt1cmxpc2gucmVwbGFjZSgvXFwvKyQvLCAnJyl9LyR7bGFzdFBhcnR9Lmh0bWxgO1xuICAgIH1cblxuICAgIGxldCBsb2NhdGlvbiA9IG5ldyBVUkwoX2xvY2F0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBuZXcgVVJMKGAke2xvY2F0aW9uLm9yaWdpbn0ke2xvY2F0aW9uLnBhdGhuYW1lfSR7dXJsaXNofWAucmVwbGFjZSgvXFwvezIsfS9nLCAnLycpKSxcbiAgICAgIG9yaWdpbmFsVVJMLFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgb3JpZ2luYWxVUkwsXG4gIH0gPSBpbnRlcm5hbFJlc29sdmUobG9jYXRpb24sIHVybGlzaC50b1N0cmluZygpLCBtYWdpYyk7XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IG5ld1NyYyA9IGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIuY2FsbCh0aGlzLCB7IHNyYzogb3JpZ2luYWxVUkwsIHVybCB9KTtcbiAgICBpZiAobmV3U3JjID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1yZXF1aXJlXCI6IE5vdCBsb2FkaW5nIFwiJHtvcmlnaW5hbFVSTH1cIiBiZWNhdXNlIHRoZSBnbG9iYWwgXCJteXRoaXhVSS51cmxSZXNvbHZlclwiIHJlcXVlc3RlZCBJIG5vdCBkbyBzby5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmV3U3JjICE9PSBvcmlnaW5hbFVSTClcbiAgICAgIHVybCA9IHJlc29sdmVVUkwobG9jYXRpb24sIG5ld1NyYywgbWFnaWMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcblxuZXhwb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZWxlbWVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktcmVxdWlyZS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1zcGlubmVyLmpzJztcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==