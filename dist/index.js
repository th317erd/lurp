/******/ var __webpack_modules__ = ({

/***/ "./node_modules/deepmerge/dist/cjs.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/cjs.js ***!
  \********************************************/
/***/ ((module) => {



var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "./lib/component.js":
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MYTHIX_INTERSECTION_OBSERVERS: () => (/* binding */ MYTHIX_INTERSECTION_OBSERVERS),
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   ensureDocumentStyles: () => (/* binding */ ensureDocumentStyles),
/* harmony export */   getIdentifier: () => (/* binding */ getIdentifier),
/* harmony export */   getVisibilityMeta: () => (/* binding */ getVisibilityMeta),
/* harmony export */   importIntoDocumentFromSource: () => (/* binding */ importIntoDocumentFromSource),
/* harmony export */   isMythixComponent: () => (/* binding */ isMythixComponent),
/* harmony export */   loadPartialIntoElement: () => (/* binding */ loadPartialIntoElement),
/* harmony export */   require: () => (/* binding */ require),
/* harmony export */   resolveURL: () => (/* binding */ resolveURL),
/* harmony export */   visibilityObserver: () => (/* binding */ visibilityObserver)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");




const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

const isMythixComponent = Symbol.for('@mythix/mythix-ui/component/constants/is-mythix-component');
const MYTHIX_INTERSECTION_OBSERVERS = Symbol.for('@mythix/mythix-ui/component/constants/intersection-observers');

/***
 *  groupName: Components
 *  desc: |
 *    This the base class of all Mythix UI components. It inherits
 *    from HTMLElement, and so will end up being a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components).
 *
 *    It is strongly recommended that you fully read up and understand
 *    [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)
 *    if you don't already fully understand them. The core of Mythix UI is the
 *    [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) standard,
 *    so you might end up a little confused if you don't already understand the foundation.
 *
 *  instanceProperties:
 *    - caption: "... HTMLElement Instance Properties"
 *      desc: "All [HTMLElement Instance Properties](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties) are inherited from [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)"
 *      link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties
 *    - name: sensitiveTagName
 *      caption: sensitiveTagName
 *      desc: |
 *        Works identically to [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) for XML, where case is preserved.
 *        In HTML this works like [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName), but instead of the result
 *        always being UPPERCASE, the tag name will be returned with the casing preserved.
***/
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

      if (typeof document !== 'undefined')
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

  onMutationAdded() {}
  onMutationRemoved() {}
  onMutationChildAdded() {}
  onMutationChildRemoved() {}

  constructor() {
    super();

    Object.defineProperties(this, {
      [isMythixComponent]: {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        isMythixComponent,
      },
    });

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindMethods.call(this, this.constructor.prototype /*, [ HTMLElement.prototype ]*/);

    Object.defineProperties(this, {
      'sensitiveTagName': { // @ref:sensitiveTagName
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
    let options = _options || {};
    if (!options.scope)
      options = { ...options, scope: this.$$ };

    return _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(node, options);
  }

  getParentNode() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.getParentNode(this);
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

  mergeChildren(target, ...others) {
    return _elements_js__WEBPACK_IMPORTED_MODULE_2__.mergeChildren(target, ...others);
  }

  getComponentTemplate(nameOrID) {
    if (!this.ownerDocument)
      return;

    if (nameOrID) {
      let result = this.ownerDocument.getElementById(nameOrID);
      if (!result)
        result = this.ownerDocument.querySelector(`template[data-mythix-component-name="${nameOrID}" i],template[data-for="${nameOrID}" i]`);

      return result;
    }

    if (this.templateID)
      return this.ownerDocument.getElementById(this.templateID);

    return this.ownerDocument.querySelector(`template[data-mythix-component-name="${this.sensitiveTagName}" i],template[data-for="${this.sensitiveTagName}" i]`);
  }

  appendExternalToShadowDOM() {
    if (!this.shadow)
      return;

    let ownerDocument = (this.ownerDocument || document);
    let elements      = ownerDocument.head.querySelectorAll('[data-for]');

    for (let element of Array.from(elements)) {
      let selector = element.getAttribute('data-for');
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isNOE(selector))
        continue;

      if (!this.matches(selector))
        continue;

      this.shadow.appendChild(element.cloneNode(true));
    }
  }

  appendTemplateToShadowDOM(_template) {
    if (!this.shadow)
      return;

    let template = _template || this.template;
    if (template) {
      ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      let formattedTemplate = this.processElements(template.content.cloneNode(true));
      this.shadow.appendChild(formattedTemplate);
    }
  }

  connectedCallback() {
    this.setAttribute('data-mythix-component-name', this.sensitiveTagName);

    this.appendExternalToShadowDOM();
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
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(this);
  }

  select(...args) {
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
      return this.select(queryEngine.map(options.callback));

    return queryEngine;
  }

  build(callback) {
    let result = [ callback(_elements_js__WEBPACK_IMPORTED_MODULE_2__.ElementGenerator, {}) ].flat(Infinity).map((item) => {
      if (item && item[_elements_js__WEBPACK_IMPORTED_MODULE_2__.UNFINISHED_DEFINITION])
        return item();

      return item;
    }).filter(Boolean);

    return (result.length < 2) ? result[0] : new _elements_js__WEBPACK_IMPORTED_MODULE_2__.ElementDefinition('#fragment', {}, result);
  }

  $build(callback) {
    return _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(this, [ this.build(callback) ].flat(Infinity));
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

function resolveURL(rootLocation, _urlish, magic) {
  let urlish = _urlish;
  if (urlish instanceof URL)
    return urlish;

  if (!urlish)
    return new URL(rootLocation);

  if (urlish instanceof Location)
    return new URL(urlish);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(urlish, 'String'))
    return;

  const internalResolve = (_location, _urlPart, magic) => {
    let originalURL = urlish;
    if (SCHEME_RE.test(urlish))
      return { url: new URL(urlish), originalURL: urlish };

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
  } = internalResolve(rootLocation, urlish.toString(), magic);

  if (typeof globalThis.mythixUI.urlResolver === 'function') {
    let fileName;
    let path;

    url.pathname.replace(/^(.*\/)([^/]+)$/, (m, first, second) => {
      path = first.replace(/\/+$/, '/');
      if (path.charAt(path.length - 1) !== '/')
        path = `${path}/`;

      fileName = second;
      return m;
    });

    let newSrc = globalThis.mythixUI.urlResolver.call(this, { src: originalURL, url, path, fileName });
    if (newSrc === false) {
      console.warn(`"mythix-require": Not loading "${originalURL}" because the global "mythixUI.urlResolver" requested I not do so.`);
      return;
    }

    if (newSrc !== originalURL)
      url = resolveURL.call(this, rootLocation, newSrc, magic);
  }

  return url;
}

const IS_TEMPLATE         = /^(template)$/i;
const IS_SCRIPT           = /^(script)$/i;
const REQUIRE_CACHE       = new Map();
const RESOLVE_SRC_ELEMENT = /^script|link|style|mythix-language-pack|mythix-require$/i;

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

  const resolveElementSrcAttribute = (element, baseURL) => {
    // Resolve "src" attribute, since we are
    // going to be moving the element around
    let src = element.getAttribute('src');
    if (src) {
      src = resolveURL.call(this, baseURL, src, false);
      element.setAttribute('src', src.toString());
    }

    return element;
  };

  for (let child of children) {
    if (options.magic && RESOLVE_SRC_ELEMENT.test(child.localName))
      child = resolveElementSrcAttribute(child, baseURL);

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
    } else if ((/^(link|style)$/i).test(child.tagName)) { // <link> & <style>
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      let id = `ID${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(child.outerHTML)}`;
      if (!child.getAttribute('id'))
        child.setAttribute('id', id);

      // append to head
      if (!ownerDocument.querySelector(`${child.tagName}#${id}`))
        ownerDocument.head.appendChild(child);
    } else if ((/^meta$/i).test(child.tagName)) { // <meta>
      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isMeta: true, isHandled: true });

      // do nothing with these tags
      continue;
    } else { // Everything else
      let isHandled = false;

      if (child.localName === 'mythix-language-pack') {
        let langPackID = `ID${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`${guessedElementName}:${child.outerHTML}`)}`;
        if (!child.getAttribute('id'))
          child.setAttribute('id', langPackID);

        let languageProvider = this.closest('mythix-language-provider');
        if (!languageProvider)
          languageProvider = document.querySelector('mythix-language-provider');

        if (languageProvider) {
          if (!languageProvider.querySelector(`mythix-language-pack#${langPackID}`))
            languageProvider.insertBefore(child, languageProvider.firstChild);

          isHandled = true;
        } // else do nothing... let it be dumped into the dom later
      }

      if (typeof nodeHandler === 'function')
        nodeHandler.call(this, child, { ...context, isHandled });
    }
  }

  if (typeof options.postProcess === 'function') {
    template = context.template = options.postProcess.call(this, context);
    children = Array.from(template.content.children);
  }

  return context;
}

async function require(urlOrName, _options) {
  let options       = _options || {};
  let ownerDocument = options.ownerDocument || document;
  let url           = resolveURL.call(this, ownerDocument.location, urlOrName, options.magic);
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
    src,
    {
      ownerDocument: this.ownerDocument || document,
    },
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
        if ((isTemplate || !isHandled) && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE)) {
          this.appendChild(
            _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements.call(
              this,
              node,
              {
                ...options,
                scope: _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(scopeData, options.scope),
              },
            ),
          );
        }
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

      let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, MYTHIX_INTERSECTION_OBSERVERS);
      if (!elementObservers) {
        elementObservers = new Map();
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, MYTHIX_INTERSECTION_OBSERVERS, elementObservers);
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
  let elementObservers = _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(element, MYTHIX_INTERSECTION_OBSERVERS);
  if (!elementObservers)
    return NO_OBSERVER;

  return elementObservers.get(observer) || NO_OBSERVER;
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
/* harmony export */   encodeValue: () => (/* binding */ encodeValue),
/* harmony export */   hasChild: () => (/* binding */ hasChild),
/* harmony export */   isSVGElement: () => (/* binding */ isSVGElement),
/* harmony export */   isVoidTag: () => (/* binding */ isVoidTag),
/* harmony export */   mergeChildren: () => (/* binding */ mergeChildren),
/* harmony export */   nodeToElementDefinition: () => (/* binding */ nodeToElementDefinition),
/* harmony export */   processElements: () => (/* binding */ processElements)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");


const UNFINISHED_DEFINITION = Symbol.for('@mythix/mythix-ui/constants/unfinished');

const IS_PROP_NAME    = /^prop\$/;
const IS_TARGET_PROP  = /^prototype|constructor$/;

class ElementDefinition {
  constructor(tagName, attributes, children) {
    Object.defineProperties(this, {
      [_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        'ElementDefinition',
      },
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

  toString() {
    let tagName = this.tagName;
    if (tagName === '#text')
      return this.attributes.value;

    let attrs = ((attributes) => {
      let parts = [];

      for (let [ attributeName, value ] of Object.entries(attributes)) {
        if (IS_PROP_NAME.test(attributeName))
          continue;

        let name = this.toDOMAttributeName(attributeName);
        if (value == null)
          parts.push(name);
        else
          parts.push(`${name}="${encodeValue(value)}"`);
      }

      return parts.join(' ');
    })(this.attributes);

    let children = ((children) => {
      return children
        .filter((child) => (child != null && child !== false && !Object.is(child, NaN)))
        .map((child) => ('' + child))
        .join('');
    })(this.children);

    return `<${tagName}${(attrs) ? ` ${attrs}` : ''}>${(isVoidTag(tagName)) ? '' : `${children}</${tagName}>`}`;
  }

  toDOMAttributeName(attributeName) {
    return attributeName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  build(ownerDocument, templateOptions) {
    if (this.tagName === '#fragment')
      return this.children.map((child) => child.build(ownerDocument, templateOptions));

    let attributes    = this.attributes;
    let namespaceURI  = attributes.namespaceURI;
    let options;
    let element;

    if (this.attributes.is)
      options = { is: this.attributes.is };

    if (this.tagName === '#text')
      return processElements.call(this, ownerDocument.createTextNode(attributes.value || ''), templateOptions);

    if (namespaceURI)
      element = ownerDocument.createElementNS(namespaceURI, this.tagName, options);
    else if (isSVGElement(this.tagName))
      element = ownerDocument.createElementNS('http://www.w3.org/2000/svg', this.tagName, options);
    else
      element = ownerDocument.createElement(this.tagName);

    const eventNames = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(element);
    const handleAttribute = (element, attributeName, _attributeValue) => {
      let attributeValue      = _attributeValue;
      let lowerAttributeName  = attributeName.toLowerCase();

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement.call(
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(element, templateOptions.scope), // this
          element,
          lowerAttributeName.substring(2),
          attributeValue,
        );
      } else {
        let modifiedAttributeName = this.toDOMAttributeName(attributeName);
        element.setAttribute(modifiedAttributeName, attributeValue);
      }
    };

    // Dynamic bindings are not allowed for properties
    const handleProperty = (element, propertyName, propertyValue) => {
      let name = propertyName.replace(IS_PROP_NAME, '');
      element[name] = propertyValue;
    };

    let attributeNames = Object.keys(attributes);
    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName   = attributeNames[i];
      let attributeValue  = attributes[attributeName];

      if (IS_PROP_NAME.test(attributeName))
        handleProperty(element, attributeName, attributeValue);
      else
        handleAttribute(element, attributeName, attributeValue);
    }

    let children = this.children;
    if (children.length > 0) {
      for (let i = 0, il = children.length; i < il; i++) {
        let child         = children[i];
        let childElement  = child.build(ownerDocument, templateOptions);

        if (Array.isArray(childElement))
          childElement.flat(Infinity).forEach((child) => element.appendChild(child));
        else
          element.appendChild(childElement);
      }
    }

    return processElements.call(
      this,
      element,
      {
        ...templateOptions,
        processEventCallbacks: false,
      },
    );
  }
}

const IS_HTML_SAFE_CHARACTER = /^[\sa-zA-Z0-9_-]$/;

function encodeValue(value) {
  return value.replace(/./g, (m) => {
    return (IS_HTML_SAFE_CHARACTER.test(m)) ? m : `&#${m.charCodeAt(0)};`;
  });
}

const IS_VOID_TAG = /^area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr$/i;
function isVoidTag(tagName) {
  return IS_VOID_TAG.test(tagName.split(':').slice(-1)[0]);
}

function processElements(_node, _options) {
  let node = _node;
  if (!node)
    return node;

  let options       = _options || {};
  let scope         = options.scope;
  if (!scope) {
    scope = _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(node);
    options = { ...options, scope };
  }

  let disableTemplateEngineSelector = (options.forceTemplateEngine === true) ? undefined : options.disableTemplateEngineSelector;
  let children                      = Array.from(node.childNodes);

  if (options.forceTemplateEngine !== true && !disableTemplateEngineSelector) {
    disableTemplateEngineSelector = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getDisableTemplateEngineSelector();
    options = { ...options, disableTemplateEngineSelector };
  }

  let isTemplateEngineDisabled = false;
  if (disableTemplateEngineSelector && _utils_js__WEBPACK_IMPORTED_MODULE_0__.specialClosest(node, disableTemplateEngineSelector))
    isTemplateEngineDisabled = true;

  if (typeof options.helper === 'function') {
    let result = options.helper.call(this, { scope, options, node, children, isTemplateEngineDisabled, disableTemplateEngineSelector });
    if (result instanceof Node)
      node = result;
    else if (result === false)
      return node;
  }

  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ATTRIBUTE_NODE) {
    if (!isTemplateEngineDisabled) {
      let result = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatNodeValue(node, options);
      if (Array.isArray(result) && result.some((item) => (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'ElementDefinition' || item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'QueryEngine'))) {
        let ownerDocument = options.ownerDocument || scope.ownerDocument || node.ownerDocument || document;
        let fragment      = ownerDocument.createDocumentFragment();

        for (let item of result) {
          if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'ElementDefinition') {
            let elements = item.build(ownerDocument, { scope });
            if (!elements)
              continue;

            if (Array.isArray(elements))
              elements.flat(Infinity).forEach((element) => fragment.appendChild(element));
            else
              fragment.appendChild(elements);
          } else if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'QueryEngine') {
            item.appendTo(fragment);
          } else {
            let textNode = ownerDocument.createTextNode(('' + item));
            fragment.appendChild(textNode);
          }
        }

        return fragment;
      } else if (result !== node.nodeValue) {
        node.nodeValue =  result;
      }
    }

    return node;
  } else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_NODE) {
    let eventNames      = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getAllEventNamesForElement(node);
    let attributeNames  = node.getAttributeNames();

    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName       = attributeNames[i];
      let lowerAttributeName  = attributeName.toLowerCase();
      let attributeValue      = node.getAttribute(attributeName);

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        if (options.processEventCallbacks !== false) {
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindEventToElement.call(
            _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(node, scope), // this
            node,
            lowerAttributeName.substring(2),
            attributeValue,
          );

          node.removeAttribute(attributeName);
        }
      } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isTemplate(attributeValue)) {
        let attributeNode = node.getAttributeNode(attributeName);
        if (attributeNode)
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatNodeValue(attributeNode, { ...options, disallowHTML: true });
      }
    }
  }

  if (options.processChildren === false)
    return node;

  for (let childNode of children) {
    let result = processElements.call(this, childNode, options);
    if (result instanceof Node && result !== childNode && hasChild(node, childNode))
      node.replaceChild(result, childNode);
  }

  return node;
}

function hasChild(parentNode, childNode) {
  if (!parentNode || !childNode)
    return false;

  for (let child of Array.from(parentNode.childNodes)) {
    if (child === childNode)
      return true;
  }

  return false;
}

function build(tagName, defaultAttributes, scope) {
  if (!tagName || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(tagName, 'String'))
    throw new Error('Can not create an ElementDefinition without a "tagName".');

  const finalizer = (..._children) => {
    const wrangleChildren = (children) => {
      return children.flat(Infinity).map((value) => {
        if (value == null || Object.is(value, NaN))
          return null;

        if (typeof value === 'symbol')
          return null;

        if (value[UNFINISHED_DEFINITION])
          return value();

        if (value[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'ElementDefinition')
          return value;

        if (value[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === 'QueryEngine')
          return wrangleChildren(value.getUnderlyingArray());

        if (value instanceof Node)
          return nodeToElementDefinition(value);

        if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(value, 'String', _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty, 'DynamicProperty'))
          return null;

        return new ElementDefinition('#text', { value: ('' + value) });
      }).flat(Infinity).filter(Boolean);
    };

    let children = wrangleChildren(_children || []);
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

function nodeToElementDefinition(node) {
  if (node.nodeType === Node.TEXT_NODE)
    return new ElementDefinition('#text', { value: ('' + node.nodeValue) });

  if (node.nodeType !== Node.ELEMENT_NODE)
    return;

  let attributes = {};
  for (let attributeName of node.getAttributeNames())
    attributes[attributeName] = node.getAttribute(attributeName);

  let children = Array.from(node.childNodes).map(nodeToElementDefinition);
  return new ElementDefinition(node.tagName, attributes, children);
}

const IS_TEMPLATE = /^(template)$/i;
function mergeChildren(target, ...others) {
  if (!(target instanceof Node))
    return target;

  let targetIsTemplate = IS_TEMPLATE.test(target.tagName);
  for (let other of others) {
    if (!(other instanceof Node))
      continue;

    let childNodes = (IS_TEMPLATE.test(other.tagName)) ? other.content.cloneNode(true).childNodes : other.childNodes;
    for (let child of Array.from(childNodes)) {
      let content = (IS_TEMPLATE.test(child.tagName)) ? child.content.cloneNode(true) : child;
      if (targetIsTemplate)
        target.content.appendChild(content);
      else
        target.appendChild(content);
    }
  }

  return target;
}

const IS_SVG_ELEMENT_NAME = /^(altglyph|altglyphdef|altglyphitem|animate|animateColor|animateMotion|animateTransform|animation|circle|clipPath|colorProfile|cursor|defs|desc|discard|ellipse|feblend|fecolormatrix|fecomponenttransfer|fecomposite|feconvolvematrix|fediffuselighting|fedisplacementmap|fedistantlight|fedropshadow|feflood|fefunca|fefuncb|fefuncg|fefuncr|fegaussianblur|feimage|femerge|femergenode|femorphology|feoffset|fepointlight|fespecularlighting|fespotlight|fetile|feturbulence|filter|font|fontFace|fontFaceFormat|fontFaceName|fontFaceSrc|fontFaceUri|foreignObject|g|glyph|glyphRef|handler|hKern|image|line|lineargradient|listener|marker|mask|metadata|missingGlyph|mPath|path|pattern|polygon|polyline|prefetch|radialgradient|rect|set|solidColor|stop|svg|switch|symbol|tbreak|text|textpath|tref|tspan|unknown|use|view|vKern)$/i;
function isSVGElement(tagName) {
  return IS_SVG_ELEMENT_NAME.test(tagName);
}

const Term = (value) => new ElementDefinition('#text', { value });
const ElementGenerator = new Proxy(
  {
    Term,
    $TEXT: Term,
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
/* harmony export */   MythixUILanguagePack: () => (/* binding */ MythixUILanguagePack),
/* harmony export */   MythixUILanguageProvider: () => (/* binding */ MythixUILanguageProvider)
/* harmony export */ });
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component.js */ "./lib/component.js");





class MythixUILanguagePack extends _component_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent {
  static tagName = 'mythix-language-pack';

  createShadowDOM() {
    // NOOP
  }

  getComponentTemplate() {
    // NOOP
  }

  set attr$dataMythixSrc([ value ]) {
    // NOOP... Trap this because we
    // don't want to load a partial here
  }

  onMutationAdded(mutation) {
    // When added to the DOM, ensure that we were
    // added to the root of a language provider...
    // If not, then move ourselves to the root
    // of the language provider.
    let parentLanguageProvider = this.closest('mythix-language-provider');
    if (parentLanguageProvider && parentLanguageProvider !== mutation.target)
      _utils_js__WEBPACK_IMPORTED_MODULE_1__.nextTick(() => parentLanguageProvider.insertBefore(this, parentLanguageProvider.firstChild));
  }
}

const IS_JSON_ENCTYPE                 = /^application\/json/i;
const LANGUAGE_PACK_INSERT_GRACE_TIME = 50;

class MythixUILanguageProvider extends _component_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent {
  static tagName = 'mythix-language-provider';

  set attr$lang([ newValue, oldValue ]) {
    this.loadAllLanguagePacksForLanguage(newValue, oldValue);
  }

  onMutationChildAdded(node) {
    if (node.localName === 'mythix-language-pack') {
      this.debounce(() => {
        // Reload language packs after additions
        this.loadAllLanguagePacksForLanguage(this.getCurrentLocale());
      }, LANGUAGE_PACK_INSERT_GRACE_TIME, 'reloadLanguagePacks');
    }
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

  i18n(_path, defaultValue) {
    let path    = `global.i18n.${_path}`;
    let result  = _utils_js__WEBPACK_IMPORTED_MODULE_1__.fetchPath(this.terms, path);

    if (result == null)
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__.getDynamicPropertyForPath.call(this, path, (defaultValue == null) ? '' : defaultValue);

    return result;
  }

  getCurrentLocale() {
    return this.getAttribute('lang') || (this.ownerDocument || document).childNodes[1].getAttribute('lang') || 'en';
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

  getSourcesForLang(lang) {
    return this.select(`mythix-language-pack[lang^="${lang.replace(/"/g, '\\"')}"]`);
  }

  loadAllLanguagePacksForLanguage(_lang) {
    let lang            = _lang || 'en';
    let sourceElements  = this.getSourcesForLang(lang).filter((sourceElement) => _utils_js__WEBPACK_IMPORTED_MODULE_1__.isNotNOE(sourceElement.getAttribute('src')));
    if (!sourceElements || !sourceElements.length) {
      console.warn(`"mythix-language-provider": No "mythix-language-pack" tag found for specified language "${lang}"`);
      return;
    }

    this.loadAllLanguagePacks(lang, sourceElements);
  }

  async loadAllLanguagePacks(lang, sourceElements) {
    try {
      let promises  = sourceElements.map((sourceElement) => this.loadLanguagePack(lang, sourceElement));
      let allTerms  = (await Promise.allSettled(promises)).map((result) => {
        if (result.status !== 'fulfilled')
          return;

        return result.value;
      }).filter(Boolean);

      let terms         = deepmerge__WEBPACK_IMPORTED_MODULE_0__.all(Array.from(new Set(allTerms)));
      let compiledTerms = this.compileLanguageTerms(lang, terms);

      this.terms = compiledTerms;
    } catch (error) {
      console.error('"mythix-language-provider": Failed to load language packs', error);
    }
  }

  async loadLanguagePack(lang, sourceElement) {
    let src = sourceElement.getAttribute('src');
    if (!src)
      return;

    try {
      let { response }  = await _component_js__WEBPACK_IMPORTED_MODULE_2__.require.call(this, src, { ownerDocument: this.ownerDocument || document });
      let type          = this.getAttribute('enctype') || 'application/json';
      if (IS_JSON_ENCTYPE.test(type)) {
        // Handle JSON
        return response.json();
      } else {
        new TypeError(`Don't know how to load a language pack of type "${type}"`);
      }
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

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject(value) || Array.isArray(value)) {
          termsCopy[key] = walkTerms(value, newKeyPath);
        } else {
          let property = _utils_js__WEBPACK_IMPORTED_MODULE_1__.getDynamicPropertyForPath.call(this, newKeyPath.join('.'), value);
          termsCopy[key] = property;
          property[_utils_js__WEBPACK_IMPORTED_MODULE_1__.DynamicProperty.set](value);
        }
      }

      return termsCopy;
    };

    return walkTerms(terms, [ 'global', 'i18n' ]);
  }
}

MythixUILanguagePack.register();
MythixUILanguageProvider.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUILanguagePack = MythixUILanguagePack;
globalThis.mythixUI.MythixUILanguageProvider = MythixUILanguageProvider;


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
        src,
        {
          magic:          true,
          ownerDocument:  this.ownerDocument || document,
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
          magic:        true,
          nodeHandler:  (node, { isHandled }) => {
            if (!isHandled && node.nodeType === Node.ELEMENT_NODE)
              document.body.appendChild(node);
          },
          preProcess:   ({ template, children }) => {
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
      this.$build(({ TEMPLATE }) => {
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

    return this.select(children);
  }

  changeSpinnerChildren(count) {
    this.select('.spinner-item').remove();
    this.buildSpinnerChildren(count).appendTo(this.shadow);

    // Always append style again, so
    // that it is the last child, and
    // doesn't mess with "nth-child"
    // selectors
    this.select('style').appendTo(this.shadow);
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
      [_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        'QueryEngine',
      },
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

      return item.build(this.getOwnerDocument(), {
        scope: _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(context),
      });
    }).flat(Infinity).filter(Boolean);

    return Array.from(new Set(finalElements));
  }

  select(...args) {
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
      return this.select([ this._mythixUIElements[0] ]);

    return this.select(this._mythixUIElements.slice(Math.abs(count)));
  }

  last(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(count, 'Number'))
      return this.select([ this._mythixUIElements[this._mythixUIElements.length - 1] ]);

    return this.select(this._mythixUIElements.slice(Math.abs(count) * -1));
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
/* harmony export */   MYTHIX_TYPE: () => (/* binding */ MYTHIX_TYPE),
/* harmony export */   SHA256: () => (/* reexport safe */ _sha256_js__WEBPACK_IMPORTED_MODULE_0__.SHA256),
/* harmony export */   bindEventToElement: () => (/* binding */ bindEventToElement),
/* harmony export */   bindMethods: () => (/* binding */ bindMethods),
/* harmony export */   coerce: () => (/* binding */ coerce),
/* harmony export */   compileTemplateFromParts: () => (/* binding */ compileTemplateFromParts),
/* harmony export */   createResolvable: () => (/* binding */ createResolvable),
/* harmony export */   createScope: () => (/* binding */ createScope),
/* harmony export */   createTemplateMacro: () => (/* binding */ createTemplateMacro),
/* harmony export */   dynamicProp: () => (/* binding */ dynamicProp),
/* harmony export */   dynamicPropID: () => (/* binding */ dynamicPropID),
/* harmony export */   fetchPath: () => (/* binding */ fetchPath),
/* harmony export */   formatNodeValue: () => (/* binding */ formatNodeValue),
/* harmony export */   generateID: () => (/* binding */ generateID),
/* harmony export */   getAllEventNamesForElement: () => (/* binding */ getAllEventNamesForElement),
/* harmony export */   getAllPropertyNames: () => (/* binding */ getAllPropertyNames),
/* harmony export */   getDisableTemplateEngineSelector: () => (/* binding */ getDisableTemplateEngineSelector),
/* harmony export */   getDynamicPropertyForPath: () => (/* binding */ getDynamicPropertyForPath),
/* harmony export */   getObjID: () => (/* binding */ getObjID),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   globalStore: () => (/* binding */ globalStore),
/* harmony export */   globalStoreDynamic: () => (/* binding */ globalStoreDynamic),
/* harmony export */   globalStoreNameValuePairHelper: () => (/* binding */ globalStoreNameValuePairHelper),
/* harmony export */   isCollectable: () => (/* binding */ isCollectable),
/* harmony export */   isNOE: () => (/* binding */ isNOE),
/* harmony export */   isNotNOE: () => (/* binding */ isNotNOE),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPrimitive: () => (/* binding */ isPrimitive),
/* harmony export */   isTemplate: () => (/* binding */ isTemplate),
/* harmony export */   isType: () => (/* binding */ isType),
/* harmony export */   isValidNumber: () => (/* binding */ isValidNumber),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   parseTemplateParts: () => (/* binding */ parseTemplateParts),
/* harmony export */   registerDisableTemplateEngineSelector: () => (/* binding */ registerDisableTemplateEngineSelector),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   specialClosest: () => (/* binding */ specialClosest),
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
/* harmony export */   toSnakeCase: () => (/* binding */ toSnakeCase),
/* harmony export */   typeOf: () => (/* binding */ typeOf),
/* harmony export */   unregisterDisableTemplateEngineSelector: () => (/* binding */ unregisterDisableTemplateEngineSelector)
/* harmony export */ });
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256.js */ "./lib/sha256.js");




function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

const MYTHIX_NAME_VALUE_PAIR_HELPER  = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper');
const MYTHIX_SHADOW_PARENT           = Symbol.for('@mythix/mythix-ui/constants/shadow-parent');
const MYTHIX_TYPE                    = Symbol.for('@mythix/mythix-ui/constants/element-definition');

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

function isNOE(value) {
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

function isNotNOE(value) {
  return !isNOE(value);
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

const DYNAMIC_PROPERTY_VALUE      = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/value');
const DYNAMIC_PROPERTY_CMT        = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/clean-memory-timer');
const DYNAMIC_PROPERTY_IS_SETTING = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');
const DYNAMIC_PROPERTY_SET        = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/set');

class DynamicProperty extends EventTarget {
  static set = DYNAMIC_PROPERTY_SET;

  constructor(defaultValue) {
    super();

    Object.defineProperties(this, {
      [DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        defaultValue,
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

  [DYNAMIC_PROPERTY_SET](_newValue) {
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

      this[DYNAMIC_PROPERTY_VALUE] = newValue;

      this.dispatchEvent(updateEvent);
    } catch (error) {
      console.error(error);
    } finally {
      this[DYNAMIC_PROPERTY_IS_SETTING] = false;
    }
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

function getParentNode(element) {
  if (!element)
    return null;

  if (element.parentNode && element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element.parentNode, MYTHIX_SHADOW_PARENT);

  if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element, MYTHIX_SHADOW_PARENT);

  return element.parentNode;
}

function createScope(..._targets) {
  const findPropNameScope = (target, propName) => {
    if (target == null || Object.is(target, NaN))
      return;

    if (propName in target)
      return target;

    if (!(target instanceof Node))
      return;

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
    globalScope:  (globalThis.mythixUI && globalThis.mythixUI.globalScope),
    i18n:         (path, defaultValue) => {
      let languageProvider = specialClosest(firstElement, 'mythix-language-provider');
      if (!languageProvider)
        return defaultValue;

      return languageProvider.i18n(path, defaultValue);
    },
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
    has: (_, propName) => {
      for (let target of targets) {
        let scope = findPropNameScope(target, propName);
        if (!scope)
          continue;

        return true;
      }

      let globalScope = (globalThis.mythixUI && globalThis.mythixUI.globalScope);
      if (!globalScope)
        return false;

      return (propName in globalScope);
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
          scope[propName][DynamicProperty.set](value);
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

const EVENT_ACTION_JUST_NAME = /^%?[\w.$]+$/;
function createTemplateMacro({ prefix, body, scope }) {
  let functionBody = body;
  if (EVENT_ACTION_JUST_NAME.test(functionBody)) {
    if (functionBody.charAt(0) === '%') {
      functionBody = `(this.dynamicPropID || globalThis.mythixUI.globalScope.dynamicPropID)('${functionBody.substring(1).trim().replace(/[^\w$]/g, '')}')`;
    } else {
      functionBody = `(() => {
        try {
          let ____$ = ${functionBody};
          return (typeof ____$ === 'function') ? ____$.apply(this, Array.from(arguments).slice(1)) : ____$;
        } catch (e) {
          return this.${functionBody}.apply(this, Array.from(arguments).slice(1));
        }
      })();`;
    }
  }

  let contextCallArgs = getContextCallArgs(scope);

  functionBody = `${(prefix) ? `${prefix};` : ''}return ${(functionBody || '(void 0)').replace(/^\s*return\s+/, '').trim()};`;
  return (new Function(contextCallArgs, functionBody)).bind(scope, scope);
}

function parseTemplateParts(text, _options) {
  let options       = _options || {};
  let scope         = options.scope;
  let parts         = [];
  let currentOffset = 0;

  text.replace(/(?<!\\)(@@)(.+?)\1/g, (m, start, macro, offset) => {
    if (currentOffset < offset)
      parts.push({ type: 'literal', value: text.substring(currentOffset, offset) });

    currentOffset = offset + m.length;

    let method  = createTemplateMacro({ body: macro, scope });
    let value   = method();

    parts.push({ type: 'macro', value, method });
  });

  if (currentOffset < text.length)
    parts.push({ type: 'literal', value: text.substring(currentOffset) });

  return parts;
}

function compileTemplateFromParts(parts) {
  let result = parts
    .map((part) => part.value)
    .filter((item) => (item != null && item !== ''));

  if (result.some((item) => (item[MYTHIX_TYPE] === 'ElementDefinition' || item[MYTHIX_TYPE] === 'QueryEngine')))
    return result;

  if (result.some((item) => isType(item, 'String')))
    return result.join('');

  return (result.length < 2) ? result[0] : result;
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE
function formatNodeValue(node, _options) {
  if (node.parentNode && (/^(style|script)$/).test(node.parentNode.localName))
    return node.nodeValue;

  if (!node || FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
    throw new TypeError('"formatNodeValue" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

  let options       = _options || {};
  let text          = node.nodeValue;
  let templateParts = parseTemplateParts(text, options);

  templateParts.forEach(({ value }) => {
    if (options.bindToDynamicProperties !== false && isType(value, DynamicProperty, 'DynamicProperty')) {
      value.addEventListener('update', () => {
        let result = ('' + compileTemplateFromParts(templateParts));
        if (result !== node.nodeValue)
          node.nodeValue = result;
      }, { capture: true });
    }
  });

  let result = compileTemplateFromParts(templateParts);
  if (result == null)
    result = '';

  return (options.disallowHTML === true) ? ('' + result) : result;
}

const IS_TEMPLATE = /(?<!\\)@@/;
function isTemplate(value) {
  if (!isType(value, 'String'))
    return false;

  return IS_TEMPLATE.test(value);
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

function bindEventToElement(element, eventName, _callback) {
  let options = {};
  let callback;

  if (isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else {
    callback = _callback;
  }

  if (isType(callback, 'String'))
    callback = createTemplateMacro({ prefix: 'let event=arguments[1]', body: callback, scope: this });

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

  let currentNode = node;
  while (currentNode && (typeof currentNode.matches !== 'function' || !currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return currentNode;
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
          dynamicProperty[DynamicProperty.set](setter(newValue));
        else
          dynamicProperty[DynamicProperty.set](newValue);
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
function getDisableTemplateEngineSelector() {
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
      globalThis.mythixUI.globalScope[name][DynamicProperty.set](value);
      return currentValue;
    }

    if (isType(value, DynamicProperty, 'DynamicProperty')) {
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => value,
          set:          (newValue) => {
            value[DynamicProperty.set](newValue);
          },
        },
      });

      return value;
    } else if (dynamic) {
      let prop = dynamicPropID(name);
      Object.defineProperties(globalThis.mythixUI.globalScope, {
        [name]: {
          enumerable:   true,
          configurable: true,
          get:          () => prop,
          set:          (newValue) => {
            prop[DynamicProperty.set](newValue);
          },
        },
      });

      prop[DynamicProperty.set](value);

      return prop;
    } else {
      globalThis.mythixUI.globalScope[name] = value;
      return value;
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
/* harmony export */   MythixUILanguagePack: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__.MythixUILanguagePack),
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

if (typeof document !== 'undefined' && !globalThis.mythixUI.globalScope.url)
  globalThis.mythixUI.globalScope.url = new URL(document.location);














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

        disconnect();

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

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
    let disableTemplateEngineSelectorStr = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getDisableTemplateEngineSelector();
    for (let i = 0, il = mutations.length; i < il; i++) {
      let mutation  = mutations[i];
      let target    = mutation.target;

      if (mutation.type === 'attributes') {
        if (disableTemplateEngineSelectorStr && target.parentNode && typeof target.parentNode.closest === 'function' && target.parentNode.closest(disableTemplateEngineSelectorStr))
          continue;

        let attributeNode = target.getAttributeNode(mutation.attributeName);
        let newValue      = (attributeNode) ? attributeNode.nodeValue : null;
        let oldValue      = mutation.oldValue;

        if (oldValue === newValue)
          continue;

        if (newValue && _utils_js__WEBPACK_IMPORTED_MODULE_0__.isTemplate(newValue))
          attributeNode.nodeValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatNodeValue(attributeNode, { scope: _utils_js__WEBPACK_IMPORTED_MODULE_0__.createScope(target), disallowHTML: true });

        let observedAttributes = target.constructor.observedAttributes;
        if (observedAttributes && observedAttributes.indexOf(mutation.attributeName) < 0) {
          if (target[_component_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.attributeChangedCallback.call(target, mutation.attributeName, oldValue, newValue);
        }
      } else if (mutation.type === 'childList') {
        let disableTemplating = (disableTemplateEngineSelectorStr && target && typeof target.closest === 'function' && target.closest('[data-templates-disable],mythix-for-each'));
        let addedNodes        = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];

          if (node[_component_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationAdded.call(node, mutation) === false)
            continue;

          if (!disableTemplating)
            _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(node);

          if (target[_component_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[_component_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

          if (target[_component_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.onMutationChildRemoved(node, mutation);
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

  _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(document.head);
  _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(document.body);

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
var __webpack_exports__MythixUILanguagePack = __webpack_exports__.MythixUILanguagePack;
var __webpack_exports__MythixUILanguageProvider = __webpack_exports__.MythixUILanguageProvider;
var __webpack_exports__MythixUIRequire = __webpack_exports__.MythixUIRequire;
var __webpack_exports__MythixUISpinner = __webpack_exports__.MythixUISpinner;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
export { __webpack_exports__Components as Components, __webpack_exports__Elements as Elements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUILanguagePack as MythixUILanguagePack, __webpack_exports__MythixUILanguageProvider as MythixUILanguageProvider, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFLElBQUk7QUFDTjs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BJMEM7QUFDTztBQUNKOztBQUU3QztBQUNBOztBQUVPO0FBQ0E7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLDBEQUF5QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsYUFBYTtBQUNiLFdBQVc7QUFDWDs7QUFFQSxlQUFlLGtEQUFpQjtBQUNoQyxPQUFPOztBQUVQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUwsSUFBSSxrREFBaUI7O0FBRXJCO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQSxnREFBZ0QsWUFBWSxHQUFHLGVBQWU7QUFDOUUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsK0NBQWM7QUFDMUM7QUFDQSxVQUFVLCtDQUFjO0FBQ3hCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQyw2Q0FBWSxJQUFJLHNCQUFzQixHQUFHLFFBQVEsR0FBRztBQUN0RjtBQUNBLDZEQUE2RCxRQUFROztBQUVyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOztBQUVsQixXQUFXLHlEQUF3QjtBQUNuQzs7QUFFQTtBQUNBLFdBQVcsb0RBQW1CO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSwrQ0FBYyxTQUFTLDJEQUEwQjs7QUFFckQ7QUFDQTs7QUFFQTtBQUNBLCtCQUErQiwrQkFBK0IsR0FBRztBQUNqRTs7QUFFQTtBQUNBLFdBQVcsdURBQXNCO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsU0FBUywwQkFBMEIsU0FBUzs7QUFFdEk7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9GQUFvRixzQkFBc0IsMEJBQTBCLHNCQUFzQjtBQUMxSjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSw0Q0FBVztBQUNyQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLElBQUksK0NBQWM7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx5Q0FBeUMsd0JBQXdCO0FBQ2pFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLLElBQUksb0JBQW9COztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxrREFBaUIsT0FBTztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsa0RBQWlCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsb0RBQW1CO0FBQzFDLHNCQUFzQix5REFBVyxtQkFBbUIsZ0RBQWdEO0FBQ3BHOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLHlEQUFXO0FBQ25CO0FBQ0EsWUFBWSxtQkFBbUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLDBEQUF5QixJQUFJO0FBQ3pELHVCQUF1QiwrREFBOEI7QUFDckQ7O0FBRUE7QUFDQSxLQUFLOztBQUVMLGlEQUFpRCwyREFBMEIsZ0JBQWdCO0FBQzNGOztBQUVBO0FBQ0EsV0FBVyx5REFBVztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxR0FBcUcsa0RBQWlCO0FBQ3RIOztBQUVBO0FBQ0EsV0FBVywrQ0FBYztBQUN6Qjs7QUFFQTtBQUNBLFdBQVcsa0RBQWlCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNLGtEQUFpQjtBQUN2Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsY0FBYyx1REFBc0I7QUFDcEM7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLDZDQUFZO0FBQ3RCOztBQUVBLFVBQVUsb0RBQW1CO0FBQzdCO0FBQ0E7O0FBRUEsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sd0JBQXdCLHNCQUFzQix3Q0FBd0MsUUFBUSxnQkFBZ0IsVUFBVTtBQUN4SDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyR0FBMkcsa0RBQWlCOztBQUU1SDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMENBQTBDLEVBQUUsUUFBUTtBQUNsRSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLFFBQVEsK0JBQStCLFlBQVk7O0FBRXJFLGdCQUFnQixZQUFZLEVBQUUsUUFBUTtBQUN0QyxNQUFNO0FBQ04sZ0JBQWdCLFNBQVMsRUFBRSxZQUFZO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsTUFBTTtBQUMvQixPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVPO0FBQ1AsMEJBQTBCLCtDQUFjO0FBQ3hDLDBCQUEwQiw2Q0FBWTtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsV0FBVyxFQUFFLFFBQVE7QUFDakQsbURBQW1ELFFBQVE7QUFDM0Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsT0FBTyw2Q0FBWTtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMkJBQTJCLEdBQUcsU0FBUztBQUMzRDs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLE9BQU8sY0FBYyxHQUFHO0FBQ3BGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsS0FBSzs7QUFFdkI7QUFDQTtBQUNBLEtBQUs7O0FBRUwsOERBQThELHVDQUF1QztBQUNyRztBQUNBLHFEQUFxRCxZQUFZO0FBQ2pFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVyxFQUFFO0FBQzFDO0FBQ0E7QUFDQSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUzs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsRUFBRSxPQUFPLFlBQVksR0FBRyxZQUFZO0FBQ3RFLEtBQUssYUFBYSxHQUFHO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQ0FBMkM7QUFDM0M7QUFDQSx3QkFBd0IsSUFBSSwrRkFBK0YsbUJBQW1CO0FBQzlJO0FBQ0E7O0FBRUEsK0VBQStFLCtDQUErQztBQUM5SDs7QUFFQTtBQUNBO0FBQ0EsMERBQTBELFlBQVksb0NBQW9DLFlBQVk7QUFDdEg7QUFDQSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBLCtFQUErRSw2Q0FBNkM7QUFDNUg7O0FBRUEseUJBQXlCLDZDQUFZLElBQUksbUJBQW1CLEdBQUcscUJBQXFCLEdBQUc7QUFDdkY7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCxRQUFRO0FBQ3pEO0FBQ0EsTUFBTSxvREFBb0Q7QUFDMUQ7QUFDQSwrRUFBK0Usd0RBQXdEO0FBQ3ZJOztBQUVBLG9CQUFvQiw2Q0FBWSxrQkFBa0I7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQyxjQUFjLEdBQUcsR0FBRztBQUM5RDtBQUNBLE1BQU0sNENBQTRDO0FBQ2xEO0FBQ0Esd0NBQXdDLDJDQUEyQzs7QUFFbkY7QUFDQTtBQUNBLE1BQU0sT0FBTztBQUNiOztBQUVBO0FBQ0EsOEJBQThCLDZDQUFZLElBQUksbUJBQW1CLEdBQUcsZ0JBQWdCLEdBQUc7QUFDdkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzRUFBc0UsV0FBVztBQUNqRjs7QUFFQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBLHdDQUF3Qyx1QkFBdUI7QUFDL0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQyxXQUFXLEVBQUUsYUFBYTtBQUM3RDtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsaUJBQWlCLEVBQUUsb0JBQW9CO0FBQ3hFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsNkNBQVk7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHVCQUF1QjtBQUNuRDtBQUNBO0FBQ0EsWUFBWSx5REFBd0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0RBQWlCO0FBQ3hDLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRU87QUFDUDtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QiwrQ0FBYztBQUMzQztBQUNBO0FBQ0EsUUFBUSwrQ0FBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixrRkFBa0Y7O0FBRW5HO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTtBQUNBLGlDQUFpQzs7QUFFakMsd0NBQXdDLFFBQVE7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTTtBQUNQLHlCQUF5QiwrQ0FBYztBQUN2QztBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNnQ29DOztBQUU3Qjs7QUFFUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLE9BQU8sa0RBQWlCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEMsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLEtBQUssSUFBSSxtQkFBbUI7QUFDcEQ7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLGVBQWUsUUFBUSxFQUFFLGNBQWMsTUFBTSxPQUFPLEdBQUcsK0JBQStCLFNBQVMsSUFBSSxRQUFRLEdBQUc7QUFDOUc7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLGlFQUFnQztBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHlEQUF3QjtBQUNoQyxVQUFVLGtEQUFpQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsUUFBUTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVPO0FBQ1A7QUFDQSx1REFBdUQsaUJBQWlCO0FBQ3hFLEdBQUc7QUFDSDs7QUFFQTtBQUNPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGtEQUFpQjtBQUM3QixnQkFBZ0I7QUFDaEI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyx1RUFBc0M7QUFDMUUsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0EsdUNBQXVDLHFEQUFvQjtBQUMzRDs7QUFFQTtBQUNBLDZDQUE2Qyx5RkFBeUY7QUFDdEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHNEQUFxQjtBQUN4QywrREFBK0Qsa0RBQWlCLGtDQUFrQyxrREFBaUI7QUFDbkk7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixrREFBaUI7QUFDcEMsdURBQXVELE9BQU87QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYyxrREFBaUI7QUFDM0M7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKLDBCQUEwQixpRUFBZ0M7QUFDMUQ7O0FBRUEsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLHlEQUF3QjtBQUNsQyxZQUFZLGtEQUFpQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxTQUFTLGlEQUFnQjtBQUNqQztBQUNBO0FBQ0Esb0NBQW9DLHNEQUFxQixrQkFBa0IsZ0NBQWdDO0FBQzNHO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQLG1CQUFtQiw2Q0FBWTtBQUMvQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0Isa0RBQWlCO0FBQ25DOztBQUVBLGtCQUFrQixrREFBaUI7QUFDbkM7O0FBRUE7QUFDQTs7QUFFQSxhQUFhLDZDQUFZLGtCQUFrQixzREFBcUI7QUFDaEU7O0FBRUEsZ0RBQWdELHFCQUFxQjtBQUNyRSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzSEFBc0g7QUFDdEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFTztBQUNQO0FBQ0EsNENBQTRDLDhCQUE4Qjs7QUFFMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBOztBQUVPLHlEQUF5RCxPQUFPO0FBQ2hFO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQ0FBaUMsNENBQTRDO0FBQzdFOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0YW1DO0FBQ0M7O0FBS1o7O0FBRWpCLG1DQUFtQyw0REFBaUI7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sK0NBQWM7QUFDcEI7QUFDQTs7QUFFQTtBQUNBOztBQUVPLHVDQUF1Qyw0REFBaUI7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxpQ0FBaUMsTUFBTTtBQUN2QyxrQkFBa0IsZ0RBQWU7O0FBRWpDO0FBQ0EsYUFBYSxnRUFBK0I7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzREFBc0QsMEJBQTBCO0FBQ2hGOztBQUVBO0FBQ0E7QUFDQSxpRkFBaUYsK0NBQWM7QUFDL0Y7QUFDQSw4R0FBOEcsS0FBSztBQUNuSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUCwwQkFBMEIsMENBQWE7QUFDdkM7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSxZQUFZLFFBQVEsa0RBQU8sbUJBQW1CLCtDQUErQztBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUix5RUFBeUUsS0FBSztBQUM5RTtBQUNBLE1BQU07QUFDTixzRkFBc0YsSUFBSTtBQUMxRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLG9EQUFtQjtBQUMvQjtBQUNBLFVBQVU7QUFDVix5QkFBeUIsZ0VBQStCO0FBQ3hEO0FBQ0EsbUJBQW1CLHNEQUFxQjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEOzs7Ozs7Ozs7Ozs7Ozs7O0FDakw0Qzs7QUFFNUM7QUFDQTs7QUFFTyw4QkFBOEIsNERBQTJCO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxRQUFRLGtEQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLHVFQUFzQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxXQUFXO0FBQzVDO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsMkJBQTJCLG9CQUFvQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTiw0RUFBNEUsSUFBSTtBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDs7QUFFakQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLDhCQUE4Qiw0REFBaUI7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBLG9DQUFvQyxZQUFZO0FBQ2hELE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTzs7QUFFUDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPOztBQUVQOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7Ozs7OztTQzFnQ0E7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsZ0RBQWdEO0FBQ2hELHdFQUF3RTs7QUFFeEU7QUFDQTs7QUFFb0M7QUFDUztBQUNIOztBQUVOOztBQUVGO0FBQ1c7QUFDSDtBQUNIO0FBQ1U7QUFDVjs7QUFFdkMsMEJBQTBCLDREQUE0Qjs7QUFJcEQ7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRCw0QkFBNEIsc0NBQUs7QUFDakMsaUNBQWlDLDBDQUFVO0FBQzNDLCtCQUErQix5Q0FBUTtBQUN2Qyw4Q0FBOEMsa0RBQWlCO0FBQy9ELHFEQUFxRCx5REFBd0I7O0FBRTdFO0FBQ0EsU0FBUyxvREFBbUI7QUFDNUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDZEQUE2QixJQUFJLGlDQUFpQztBQUN4RTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLGlFQUFpQztBQUN6QztBQUNBLFNBQVM7QUFDVCxPQUFPLElBQUksVUFBVTs7QUFFckI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBLDJDQUEyQyx1RUFBc0M7QUFDakYsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLGlEQUFnQjtBQUN4QyxvQ0FBb0Msc0RBQXFCLGtCQUFrQixPQUFPLGtEQUFpQiw4QkFBOEI7O0FBRWpJO0FBQ0E7QUFDQSxxQkFBcUIsNERBQTRCO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLGdEQUFnRCxRQUFRO0FBQ3hEOztBQUVBLG1CQUFtQiw0REFBNEI7QUFDL0M7O0FBRUE7QUFDQSxZQUFZLHlEQUF3Qjs7QUFFcEMscUJBQXFCLDREQUE0QjtBQUNqRDtBQUNBOztBQUVBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxtQkFBbUIsNERBQTRCO0FBQy9DOztBQUVBLHFCQUFxQiw0REFBNEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUseURBQXdCO0FBQzFCLEVBQUUseURBQXdCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwgc3ltYm9sKVxuXHRcdH0pXG5cdFx0OiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHR0cnkge1xuXHRcdHJldHVybiBwcm9wZXJ0eSBpbiBvYmplY3Rcblx0fSBjYXRjaChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcblx0cmV0dXJuIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuXHRcdCYmICEoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG5cdFx0XHQmJiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSkpIC8vIGFuZCBhbHNvIHVuc2FmZSBpZiB0aGV5J3JlIG5vbmVudW1lcmFibGUuXG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHZhciBkZXN0aW5hdGlvbiA9IHt9O1xuXHRpZiAob3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSB7XG5cdFx0Z2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG5cdGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZGVzdGluYXRpb25cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2U7XG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGlzTWVyZ2VhYmxlT2JqZWN0O1xuXHQvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG5cdC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cblx0b3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkO1xuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuXHR2YXIgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcblx0dmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59O1xuXG52YXIgZGVlcG1lcmdlXzEgPSBkZWVwbWVyZ2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXzE7XG4iLCJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19BVFRSX01FVEhPRF9OQU1FICAgPSAvXmF0dHJcXCQoLiopJC87XG5jb25zdCBSRUdJU1RFUkVEX0NPTVBPTkVOVFMgPSBuZXcgU2V0KCk7XG5cbmV4cG9ydCBjb25zdCBpc015dGhpeENvbXBvbmVudCA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaXMtbXl0aGl4LWNvbXBvbmVudCcpO1xuZXhwb3J0IGNvbnN0IE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pbnRlcnNlY3Rpb24tb2JzZXJ2ZXJzJyk7XG5cbi8qKipcbiAqICBncm91cE5hbWU6IENvbXBvbmVudHNcbiAqICBkZXNjOiB8XG4gKiAgICBUaGlzIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBNeXRoaXggVUkgY29tcG9uZW50cy4gSXQgaW5oZXJpdHNcbiAqICAgIGZyb20gSFRNTEVsZW1lbnQsIGFuZCBzbyB3aWxsIGVuZCB1cCBiZWluZyBhIFtXZWIgQ29tcG9uZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpLlxuICpcbiAqICAgIEl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91IGZ1bGx5IHJlYWQgdXAgYW5kIHVuZGVyc3RhbmRcbiAqICAgIFtXZWIgQ29tcG9uZW50c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKVxuICogICAgaWYgeW91IGRvbid0IGFscmVhZHkgZnVsbHkgdW5kZXJzdGFuZCB0aGVtLiBUaGUgY29yZSBvZiBNeXRoaXggVUkgaXMgdGhlXG4gKiAgICBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKSBzdGFuZGFyZCxcbiAqICAgIHNvIHlvdSBtaWdodCBlbmQgdXAgYSBsaXR0bGUgY29uZnVzZWQgaWYgeW91IGRvbid0IGFscmVhZHkgdW5kZXJzdGFuZCB0aGUgZm91bmRhdGlvbi5cbiAqXG4gKiAgaW5zdGFuY2VQcm9wZXJ0aWVzOlxuICogICAgLSBjYXB0aW9uOiBcIi4uLiBIVE1MRWxlbWVudCBJbnN0YW5jZSBQcm9wZXJ0aWVzXCJcbiAqICAgICAgZGVzYzogXCJBbGwgW0hUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzKSBhcmUgaW5oZXJpdGVkIGZyb20gW0hUTUxFbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQpXCJcbiAqICAgICAgbGluazogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50I2luc3RhbmNlX3Byb3BlcnRpZXNcbiAqICAgIC0gbmFtZTogc2Vuc2l0aXZlVGFnTmFtZVxuICogICAgICBjYXB0aW9uOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgIGRlc2M6IHxcbiAqICAgICAgICBXb3JrcyBpZGVudGljYWxseSB0byBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSBmb3IgWE1MLCB3aGVyZSBjYXNlIGlzIHByZXNlcnZlZC5cbiAqICAgICAgICBJbiBIVE1MIHRoaXMgd29ya3MgbGlrZSBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSwgYnV0IGluc3RlYWQgb2YgdGhlIHJlc3VsdFxuICogICAgICAgIGFsd2F5cyBiZWluZyBVUFBFUkNBU0UsIHRoZSB0YWcgbmFtZSB3aWxsIGJlIHJldHVybmVkIHdpdGggdGhlIGNhc2luZyBwcmVzZXJ2ZWQuXG4qKiovXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgX0tsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG5cbiAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSkge1xuICAgICAgbGV0IEtsYXNzID0gX0tsYXNzIHx8IHRoaXM7XG4gICAgICBLbGFzcy5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBLbGFzcy5jb21waWxlQXR0cmlidXRlTWV0aG9kcyhLbGFzcyk7XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVnaXN0ZXJFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc3RhdGljIGNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24oS2xhc3MpIHtcbiAgICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XG4gICAgbGV0IG5hbWVzID0gVXRpbHMuZ2V0QWxsUHJvcGVydHlOYW1lcyhwcm90bylcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IElTX0FUVFJfTUVUSE9EX05BTUUudGVzdChuYW1lKSlcbiAgICAgIC5tYXAoKG9yaWdpbmFsTmFtZSkgPT4ge1xuICAgICAgICBsZXQgbmFtZSA9IG9yaWdpbmFsTmFtZS5tYXRjaChJU19BVFRSX01FVEhPRF9OQU1FKVsxXTtcbiAgICAgICAgaWYgKFJFR0lTVEVSRURfQ09NUE9ORU5UUy5oYXMoS2xhc3MpKVxuICAgICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihwcm90bywgb3JpZ2luYWxOYW1lKTtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgXCJ2YWx1ZVwiIHRoZW4gdGhlXG4gICAgICAgIC8vIHVzZXIgZGlkIGl0IHdyb25nLi4uIHNvIGp1c3RcbiAgICAgICAgLy8gbWFrZSB0aGlzIHRoZSBcInNldHRlclwiXG4gICAgICAgIGxldCBtZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICBpZiAobWV0aG9kKVxuICAgICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgICAgIGxldCBvcmlnaW5hbEdldCA9IGRlc2NyaXB0b3IuZ2V0O1xuICAgICAgICBpZiAob3JpZ2luYWxHZXQpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm90bywge1xuICAgICAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZ2V0OiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlICA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ICAgICAgID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnZhbHVlID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEdldC5jYWxsKGNvbnRleHQsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNldDogICAgICAgICAgZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFV0aWxzLnRvU25ha2VDYXNlKG5hbWUpO1xuICAgICAgfSk7XG5cbiAgICBSRUdJU1RFUkVEX0NPTVBPTkVOVFMuYWRkKEtsYXNzKTtcblxuICAgIHJldHVybiBuYW1lcztcbiAgfTtcblxuICBzZXQgYXR0ciRkYXRhTXl0aGl4U3JjKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIG9uTXV0YXRpb25BZGRlZCgpIHt9XG4gIG9uTXV0YXRpb25SZW1vdmVkKCkge31cbiAgb25NdXRhdGlvbkNoaWxkQWRkZWQoKSB7fVxuICBvbk11dGF0aW9uQ2hpbGRSZW1vdmVkKCkge31cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW2lzTXl0aGl4Q29tcG9uZW50XToge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGlzTXl0aGl4Q29tcG9uZW50LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgLyosIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0qLyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHsgLy8gQHJlZjpzZW5zaXRpdmVUYWdOYW1lXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lELFxuICAgICAgfSxcbiAgICAgICdkZWxheVRpbWVycyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgICAnZG9jdW1lbnRJbml0aWFsaXplZCc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsICdfbXl0aGl4VUlEb2N1bWVudEluaXRpYWxpemVkJyksXG4gICAgICAgIHNldDogICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnLCAhIXZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2hhZG93Jzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd0RPTSgpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGF0dHIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIGluamVjdFN0eWxlU2hlZXQoY29udGVudCkge1xuICAgIGxldCBzdHlsZUlEICAgICAgID0gYElEU1RZTEUke1V0aWxzLlNIQTI1NihgJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9OiR7Y29udGVudH1gKX1gO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBzdHlsZUVsZW1lbnQgID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCk7XG5cbiAgICBpZiAoc3R5bGVFbGVtZW50KVxuICAgICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcblxuICAgIHN0eWxlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuICB9XG5cbiAgcHJvY2Vzc0VsZW1lbnRzKG5vZGUsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoIW9wdGlvbnMuc2NvcGUpXG4gICAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZTogdGhpcy4kJCB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldFBhcmVudE5vZGUoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmdldFBhcmVudE5vZGUodGhpcyk7XG4gIH1cblxuICBhdHRhY2hTaGFkb3cob3B0aW9ucykge1xuICAgIC8vIENoZWNrIGVudmlyb25tZW50IHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIHN1cGVyLmF0dGFjaFNoYWRvdyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucyk7XG4gICAgVXRpbHMubWV0YWRhdGEoc2hhZG93LCBVdGlscy5NWVRISVhfU0hBRE9XX1BBUkVOVCwgdGhpcyk7XG5cbiAgICByZXR1cm4gc2hhZG93O1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgICByZXR1cm4gRWxlbWVudHMubWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycyk7XG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZShuYW1lT3JJRCkge1xuICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKG5hbWVPcklEKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVPcklEKTtcbiAgICAgIGlmICghcmVzdWx0KVxuICAgICAgICByZXN1bHQgPSB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke25hbWVPcklEfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHtuYW1lT3JJRH1cIiBpXWApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mb3JdJyk7XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIEFycmF5LmZyb20oZWxlbWVudHMpKSB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgIGlmIChVdGlscy5pc05PRShzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2hlcyhzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTShfdGVtcGxhdGUpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gX3RlbXBsYXRlIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBlbnN1cmVEb2N1bWVudFN0eWxlcy5jYWxsKHRoaXMsIHRoaXMub3duZXJEb2N1bWVudCwgdGhpcy5zZW5zaXRpdmVUYWdOYW1lLCB0ZW1wbGF0ZSk7XG5cbiAgICAgIGxldCBmb3JtYXR0ZWRUZW1wbGF0ZSA9IHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKGZvcm1hdHRlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRFeHRlcm5hbFRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBVdGlscy5uZXh0VGljaygoKSA9PiB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51bm1vdW50ZWQoKTtcbiAgfVxuXG4gIGF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3U3JjKSB7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci51bm9ic2VydmUodGhpcyk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTcmMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb2JzZXJ2ZXIgPSB2aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgd2FzVmlzaWJsZSwgZGlzY29ubmVjdCB9KSA9PiB7XG4gICAgICBpZiAoIXdhc1Zpc2libGUpXG4gICAgICAgIHRoaXMuZmV0Y2hTcmModGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpKTtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfSwgeyBlbGVtZW50czogWyB0aGlzIF0gfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmlzaWJpbGl0eU9ic2VydmVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvYnNlcnZlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIGxldCBbXG4gICAgICBuYW1lLFxuICAgICAgb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZSxcbiAgICBdID0gYXJncztcblxuICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGxldCBtYWdpY05hbWUgICA9IGBhdHRyJCR7VXRpbHMudG9DYW1lbENhc2UobmFtZSl9YDtcbiAgICAgIGxldCBkZXNjcmlwdG9yICA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBDYWxsIHNldHRlclxuICAgICAgICB0aGlzW21hZ2ljTmFtZV0gPSBbIGFyZ3NbMl0sIGFyZ3NbMV0gXS5jb25jYXQoYXJncy5zbGljZSgzKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICBnZXQgJCQoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmNyZWF0ZVNjb3BlKHRoaXMpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2soRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwge30pIF0uZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtW0VsZW1lbnRzLlVORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiBpdGVtKCk7XG5cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogbmV3IEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uKCcjZnJhZ21lbnQnLCB7fSwgcmVzdWx0KTtcbiAgfVxuXG4gICRidWlsZChjYWxsYmFjaykge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgWyB0aGlzLmJ1aWxkKGNhbGxiYWNrKSBdLmZsYXQoSW5maW5pdHkpKTtcbiAgfVxuXG4gIGlzQXR0cmlidXRlVHJ1dGh5KG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzQXR0cmlidXRlKG5hbWUpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgaWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJ3RydWUnKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBVdGlscy50b0NhbWVsQ2FzZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICB9XG5cbiAgbWV0YWRhdGEoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBVdGlscy5tZXRhZGF0YSh0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIGR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyLCBfY29udGV4dCkge1xuICAgIHJldHVybiBVdGlscy5keW5hbWljUHJvcC5jYWxsKF9jb250ZXh0IHx8IHRoaXMsIG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKTtcbiAgfVxuXG4gIGR5bmFtaWNEYXRhKG9iaikge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBsZXQgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBVdGlscy5keW5hbWljUHJvcC5jYWxsKGRhdGEsIGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZGVib3VuY2UoY2FsbGJhY2ssIG1zLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IFV0aWxzLmNyZWF0ZVJlc29sdmFibGUoKTtcbiAgICB0aGlzLmRlbGF5VGltZXJzLnNldChpZCwgcHJvbWlzZSk7XG5cbiAgICAvLyBMZXQncyBub3QgY29tcGxhaW4gYWJvdXRcbiAgICAvLyB1bmNhdWdodCBlcnJvcnNcbiAgICBwcm9taXNlLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIHByb21pc2UudGltZXJJRCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgY2FsbGluZyBcImRlbGF5XCIgY2FsbGJhY2s6ICcsIGVycm9yLCBjYWxsYmFjay50b1N0cmluZygpKTtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH0sIG1zIHx8IDApO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBjbGFzc2VzKC4uLl9hcmdzKSB7XG4gICAgbGV0IGFyZ3MgPSBfYXJncy5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgJ1N0cmluZycpKVxuICAgICAgICByZXR1cm4gaXRlbS50cmltKCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgIGxldCBrZXlzICA9IE9iamVjdC5rZXlzKGl0ZW0pO1xuICAgICAgICBsZXQgaXRlbXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBsZXQga2V5ICAgPSBrZXlzW2ldO1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICBpdGVtcy5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYXJncykpLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoU3JjKHNyY1VSTCkge1xuICAgIGlmICghc3JjVVJMKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbCh0aGlzLCBzcmNVUkwpO1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY1VSTH0gKHJlc29sdmVkIHRvOiAke2Vycm9yLnVybH0pYCwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SWRlbnRpZmllcih0YXJnZXQpIHtcbiAgaWYgKCF0YXJnZXQpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0LmdldElkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRJZGVudGlmaWVyLmNhbGwodGFyZ2V0KTtcblxuICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudClcbiAgICByZXR1cm4gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJykgfHwgVXRpbHMudG9DYW1lbENhc2UodGFyZ2V0LmxvY2FsTmFtZSk7XG5cbiAgcmV0dXJuICd1bmRlZmluZWQnO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKSB7XG4gIGlmICghcnVsZS5zZWxlY3RvclRleHQpXG4gICAgcmV0dXJuIHJ1bGUuY3NzVGV4dDtcblxuICBsZXQgX2JvZHkgICA9IHJ1bGUuY3NzVGV4dC5zdWJzdHJpbmcocnVsZS5zZWxlY3RvclRleHQubGVuZ3RoKS50cmltKCk7XG4gIGxldCByZXN1bHQgID0gKGNhbGxiYWNrKHJ1bGUuc2VsZWN0b3JUZXh0LCBfYm9keSkgfHwgW10pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKCFyZXN1bHQpXG4gICAgcmV0dXJuICcnO1xuXG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBjc3NSdWxlc1RvU291cmNlKGNzc1J1bGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gQXJyYXkuZnJvbShjc3NSdWxlcyB8fCBbXSkubWFwKChydWxlKSA9PiB7XG4gICAgbGV0IHJ1bGVTdHIgPSBmb3JtYXRSdWxlU2V0KHJ1bGUsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gYCR7Y3NzUnVsZXNUb1NvdXJjZShydWxlLmNzc1J1bGVzLCBjYWxsYmFjayl9JHtydWxlU3RyfWA7XG4gIH0pLmpvaW4oJ1xcblxcbicpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVGb3JEb2N1bWVudChlbGVtZW50TmFtZSwgc3R5bGVFbGVtZW50KSB7XG4gIGNvbnN0IGhhbmRsZUhvc3QgPSAobSwgdHlwZSwgX2NvbnRlbnQpID0+IHtcbiAgICBsZXQgY29udGVudCA9ICghX2NvbnRlbnQpID8gX2NvbnRlbnQgOiBfY29udGVudC5yZXBsYWNlKC9eXFwoLywgJycpLnJlcGxhY2UoL1xcKSQvLCAnJyk7XG5cbiAgICBpZiAodHlwZSA9PT0gJzpob3N0Jykge1xuICAgICAgaWYgKCFjb250ZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudE5hbWU7XG5cbiAgICAgIC8vIEVsZW1lbnQgc2VsZWN0b3I/XG4gICAgICBpZiAoKC9eW2EtekEtWl9dLykudGVzdChjb250ZW50KSlcbiAgICAgICAgcmV0dXJuIGAke2NvbnRlbnR9W2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIl1gO1xuXG4gICAgICByZXR1cm4gYCR7ZWxlbWVudE5hbWV9JHtjb250ZW50fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHtjb250ZW50fSAke2VsZW1lbnROYW1lfWA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBjc3NSdWxlc1RvU291cmNlKFxuICAgIHN0eWxlRWxlbWVudC5zaGVldC5jc3NSdWxlcyxcbiAgICAoX3NlbGVjdG9yLCBib2R5KSA9PiB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBfc2VsZWN0b3I7XG4gICAgICBsZXQgdGFncyAgICAgPSBbXTtcblxuICAgICAgbGV0IHVwZGF0ZWRTZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyhbJ1wiXSkoPzpcXFxcLnxbXlxcMV0pKz9cXDEvLCAobSkgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSB0YWdzLmxlbmd0aDtcbiAgICAgICAgdGFncy5wdXNoKG0pO1xuICAgICAgICByZXR1cm4gYEBAQFRBR1ske2luZGV4fV1AQEBgO1xuICAgICAgfSkuc3BsaXQoJywnKS5tYXAoKHNlbGVjdG9yKSA9PiB7XG4gICAgICAgIGxldCBtb2RpZmllZCA9IHNlbGVjdG9yLnJlcGxhY2UoLyg6aG9zdCg/Oi1jb250ZXh0KT8pKFxcKFxccypbXildKz9cXHMqXFwpKT8vLCBoYW5kbGVIb3N0KTtcbiAgICAgICAgcmV0dXJuIChtb2RpZmllZCA9PT0gc2VsZWN0b3IpID8gbnVsbCA6IG1vZGlmaWVkO1xuICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywnKS5yZXBsYWNlKC9AQEBUQUdcXFsoXFxkKylcXF1AQEAvLCAobSwgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRhZ3NbK2luZGV4XTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXVwZGF0ZWRTZWxlY3RvcilcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICByZXR1cm4gWyB1cGRhdGVkU2VsZWN0b3IsIGJvZHkgXTtcbiAgICB9LFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlRG9jdW1lbnRTdHlsZXMob3duZXJEb2N1bWVudCwgY29tcG9uZW50TmFtZSwgdGVtcGxhdGUpIHtcbiAgbGV0IG9iaklEICAgICAgICAgICAgID0gVXRpbHMuZ2V0T2JqSUQodGVtcGxhdGUpO1xuICBsZXQgdGVtcGxhdGVJRCAgICAgICAgPSBVdGlscy5TSEEyNTYob2JqSUQpO1xuICBsZXQgdGVtcGxhdGVDaGlsZHJlbiAgPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG4gIGxldCBpbmRleCAgICAgICAgICAgICA9IDA7XG5cbiAgZm9yIChsZXQgdGVtcGxhdGVDaGlsZCBvZiB0ZW1wbGF0ZUNoaWxkcmVuKSB7XG4gICAgaWYgKCEoL15zdHlsZSQvaSkudGVzdCh0ZW1wbGF0ZUNoaWxkLnRhZ05hbWUpKVxuICAgICAgY29udGludWU7XG5cbiAgICBsZXQgc3R5bGVJRCA9IGBJRFNUWUxFJHt0ZW1wbGF0ZUlEfSR7KytpbmRleH1gO1xuICAgIGlmICghb3duZXJEb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoYHN0eWxlIyR7c3R5bGVJRH1gKSkge1xuICAgICAgbGV0IGNsb25lZFN0eWxlRWxlbWVudCA9IHRlbXBsYXRlQ2hpbGQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgb3duZXJEb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbiAgICAgIGxldCBuZXdTdHlsZVNoZWV0ID0gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQoY29tcG9uZW50TmFtZSwgY2xvbmVkU3R5bGVFbGVtZW50KTtcbiAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4gICAgICBsZXQgc3R5bGVOb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtZm9yJywgdGhpcy5zZW5zaXRpdmVUYWdOYW1lKTtcbiAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gbmV3U3R5bGVTaGVldDtcblxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZXNjcmlwdG9yRnJvbVByb3RvdHlwZUNoYWluKHN0YXJ0UHJvdG8sIGRlc2NyaXB0b3JOYW1lKSB7XG4gIGxldCB0aGlzUHJvdG8gPSBzdGFydFByb3RvO1xuICBsZXQgZGVzY3JpcHRvcjtcblxuICB3aGlsZSAodGhpc1Byb3RvICYmICEoZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpc1Byb3RvLCBkZXNjcmlwdG9yTmFtZSkpKVxuICAgIHRoaXNQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzUHJvdG8pO1xuXG4gIHJldHVybiBkZXNjcmlwdG9yO1xufVxuXG5jb25zdCBTQ0hFTUVfUkUgICAgID0gL15bXFx3LV0rOlxcL1xcLy87XG5jb25zdCBIQVNfRklMRU5BTUUgID0gL1xcLlteLy5dKyQvO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVVSTChyb290TG9jYXRpb24sIF91cmxpc2gsIG1hZ2ljKSB7XG4gIGxldCB1cmxpc2ggPSBfdXJsaXNoO1xuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgVVJMKVxuICAgIHJldHVybiB1cmxpc2g7XG5cbiAgaWYgKCF1cmxpc2gpXG4gICAgcmV0dXJuIG5ldyBVUkwocm9vdExvY2F0aW9uKTtcblxuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgTG9jYXRpb24pXG4gICAgcmV0dXJuIG5ldyBVUkwodXJsaXNoKTtcblxuICBpZiAoIVV0aWxzLmlzVHlwZSh1cmxpc2gsICdTdHJpbmcnKSlcbiAgICByZXR1cm47XG5cbiAgY29uc3QgaW50ZXJuYWxSZXNvbHZlID0gKF9sb2NhdGlvbiwgX3VybFBhcnQsIG1hZ2ljKSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsVVJMID0gdXJsaXNoO1xuICAgIGlmIChTQ0hFTUVfUkUudGVzdCh1cmxpc2gpKVxuICAgICAgcmV0dXJuIHsgdXJsOiBuZXcgVVJMKHVybGlzaCksIG9yaWdpbmFsVVJMOiB1cmxpc2ggfTtcblxuICAgIC8vIE1hZ2ljIVxuICAgIGlmIChtYWdpYyA9PT0gdHJ1ZSAmJiAhSEFTX0ZJTEVOQU1FLnRlc3QodXJsaXNoKSkge1xuICAgICAgbGV0IHBhcnRzICAgICA9IHVybGlzaC5zcGxpdCgnLycpLm1hcCgocGFydCkgPT4gcGFydC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGxldCBsYXN0UGFydCAgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChsYXN0UGFydClcbiAgICAgICAgdXJsaXNoID0gYCR7dXJsaXNoLnJlcGxhY2UoL1xcLyskLywgJycpfS8ke2xhc3RQYXJ0fS5odG1sYDtcbiAgICB9XG5cbiAgICBsZXQgbG9jYXRpb24gPSBuZXcgVVJMKF9sb2NhdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogbmV3IFVSTChgJHtsb2NhdGlvbi5vcmlnaW59JHtsb2NhdGlvbi5wYXRobmFtZX0ke3VybGlzaH1gLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKSksXG4gICAgICBvcmlnaW5hbFVSTCxcbiAgICB9O1xuICB9O1xuXG4gIGxldCB7XG4gICAgdXJsLFxuICAgIG9yaWdpbmFsVVJMLFxuICB9ID0gaW50ZXJuYWxSZXNvbHZlKHJvb3RMb2NhdGlvbiwgdXJsaXNoLnRvU3RyaW5nKCksIG1hZ2ljKTtcblxuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMubXl0aGl4VUkudXJsUmVzb2x2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsZXQgZmlsZU5hbWU7XG4gICAgbGV0IHBhdGg7XG5cbiAgICB1cmwucGF0aG5hbWUucmVwbGFjZSgvXiguKlxcLykoW14vXSspJC8sIChtLCBmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICBwYXRoID0gZmlyc3QucmVwbGFjZSgvXFwvKyQvLCAnLycpO1xuICAgICAgaWYgKHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJylcbiAgICAgICAgcGF0aCA9IGAke3BhdGh9L2A7XG5cbiAgICAgIGZpbGVOYW1lID0gc2Vjb25kO1xuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbiAgICBsZXQgbmV3U3JjID0gZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlci5jYWxsKHRoaXMsIHsgc3JjOiBvcmlnaW5hbFVSTCwgdXJsLCBwYXRoLCBmaWxlTmFtZSB9KTtcbiAgICBpZiAobmV3U3JjID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1yZXF1aXJlXCI6IE5vdCBsb2FkaW5nIFwiJHtvcmlnaW5hbFVSTH1cIiBiZWNhdXNlIHRoZSBnbG9iYWwgXCJteXRoaXhVSS51cmxSZXNvbHZlclwiIHJlcXVlc3RlZCBJIG5vdCBkbyBzby5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmV3U3JjICE9PSBvcmlnaW5hbFVSTClcbiAgICAgIHVybCA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCByb290TG9jYXRpb24sIG5ld1NyYywgbWFnaWMpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgICA9IC9eKHRlbXBsYXRlKSQvaTtcbmNvbnN0IElTX1NDUklQVCAgICAgICAgICAgPSAvXihzY3JpcHQpJC9pO1xuY29uc3QgUkVRVUlSRV9DQUNIRSAgICAgICA9IG5ldyBNYXAoKTtcbmNvbnN0IFJFU09MVkVfU1JDX0VMRU1FTlQgPSAvXnNjcmlwdHxsaW5rfHN0eWxlfG15dGhpeC1sYW5ndWFnZS1wYWNrfG15dGhpeC1yZXF1aXJlJC9pO1xuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZShvd25lckRvY3VtZW50LCBsb2NhdGlvbiwgX3VybCwgc291cmNlU3RyaW5nLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB1cmwgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgbG9jYXRpb24sIF91cmwsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgZmlsZU5hbWU7XG4gIGxldCBiYXNlVVJMICAgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWUucmVwbGFjZSgvW14vXSskLywgKG0pID0+IHtcbiAgICBmaWxlTmFtZSA9IG07XG4gICAgcmV0dXJuICcnO1xuICB9KX0ke3VybC5zZWFyY2h9JHt1cmwuaGFzaH1gKTtcblxuICBsZXQgdGVtcGxhdGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IHNvdXJjZVN0cmluZztcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pLnNvcnQoKGEsIGIpID0+IHtcbiAgICBsZXQgeCA9IGEudGFnTmFtZTtcbiAgICBsZXQgeSA9IGIudGFnTmFtZTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAoeCA9PSB5KVxuICAgICAgcmV0dXJuIDA7XG5cbiAgICByZXR1cm4gKHggPCB5KSA/IDEgOiAtMTtcbiAgfSk7XG5cbiAgY29uc3QgZmlsZU5hbWVUb0VsZW1lbnROYW1lID0gKGZpbGVOYW1lKSA9PiB7XG4gICAgcmV0dXJuIGZpbGVOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXC4uKiQvLCAnJykucmVwbGFjZSgvXFxiW0EtWl18W15BLVpdW0EtWl0vZywgKF9tKSA9PiB7XG4gICAgICBsZXQgbSA9IF9tLnRvTG93ZXJDYXNlKCk7XG4gICAgICByZXR1cm4gKG0ubGVuZ3RoIDwgMikgPyBgLSR7bX1gIDogYCR7bS5jaGFyQXQoMCl9LSR7bS5jaGFyQXQoMSl9YDtcbiAgICB9KS5yZXBsYWNlKC8tezIsfS9nLCAnLScpLnJlcGxhY2UoL15bXmEtel0qLywgJycpLnJlcGxhY2UoL1teYS16XSokLywgJycpO1xuICB9O1xuXG4gIGxldCBndWVzc2VkRWxlbWVudE5hbWUgID0gZmlsZU5hbWVUb0VsZW1lbnROYW1lKGZpbGVOYW1lKTtcbiAgbGV0IGNvbnRleHQgICAgICAgICAgICAgPSB7XG4gICAgZ3Vlc3NlZEVsZW1lbnROYW1lLFxuICAgIGNoaWxkcmVuLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdGVtcGxhdGUsXG4gICAgdXJsLFxuICAgIGJhc2VVUkwsXG4gICAgZmlsZU5hbWUsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnByZVByb2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0ZW1wbGF0ZSA9IGNvbnRleHQudGVtcGxhdGUgPSBvcHRpb25zLnByZVByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICBsZXQgbm9kZUhhbmRsZXIgICA9IG9wdGlvbnMubm9kZUhhbmRsZXI7XG4gIGxldCB0ZW1wbGF0ZUNvdW50ID0gY2hpbGRyZW4ucmVkdWNlKChzdW0sIGVsZW1lbnQpID0+ICgoSVNfVEVNUExBVEUudGVzdChlbGVtZW50LnRhZ05hbWUpKSA/IChzdW0gKyAxKSA6IHN1bSksIDApO1xuXG4gIGNvbnRleHQudGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnQ7XG5cbiAgY29uc3QgcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYmFzZVVSTCkgPT4ge1xuICAgIC8vIFJlc29sdmUgXCJzcmNcIiBhdHRyaWJ1dGUsIHNpbmNlIHdlIGFyZVxuICAgIC8vIGdvaW5nIHRvIGJlIG1vdmluZyB0aGUgZWxlbWVudCBhcm91bmRcbiAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmIChzcmMpIHtcbiAgICAgIHNyYyA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBiYXNlVVJMLCBzcmMsIGZhbHNlKTtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH07XG5cbiAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICBpZiAob3B0aW9ucy5tYWdpYyAmJiBSRVNPTFZFX1NSQ19FTEVNRU5ULnRlc3QoY2hpbGQubG9jYWxOYW1lKSlcbiAgICAgIGNoaWxkID0gcmVzb2x2ZUVsZW1lbnRTcmNBdHRyaWJ1dGUoY2hpbGQsIGJhc2VVUkwpO1xuXG4gICAgaWYgKElTX1RFTVBMQVRFLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHRlbXBsYXRlPlxuICAgICAgaWYgKHRlbXBsYXRlQ291bnQgPT09IDEgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZvcicpID09IG51bGwgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGAke3VybH06IDx0ZW1wbGF0ZT4gaXMgbWlzc2luZyBhIFwiZGF0YS1mb3JcIiBhdHRyaWJ1dGUsIGxpbmtpbmcgaXQgdG8gaXRzIG93bmVyIGNvbXBvbmVudC4gR3Vlc3NpbmcgXCIke2d1ZXNzZWRFbGVtZW50TmFtZX1cIi5gKTtcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWZvcicsIGd1ZXNzZWRFbGVtZW50TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1RlbXBsYXRlOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IChjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgfHwgY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScpKTtcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWZvcj1cIiR7ZWxlbWVudE5hbWV9XCIgaV0sW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHtlbGVtZW50TmFtZX1cIiBpXWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoSVNfU0NSSVBULnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPHNjcmlwdD5cbiAgICAgIGxldCBjaGlsZENsb25lID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBjaGlsZC5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBjaGlsZC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpO1xuXG4gICAgICBsZXQgc3JjID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgc3JjID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGJhc2VVUkwsIHNyYywgZmFsc2UpO1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjLnRvU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRDbG9uZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG4gICAgICAgIGNoaWxkQ2xvbmUuaW5uZXJIVE1MID0gY2hpbGQudGV4dENvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1NjcmlwdDogdHJ1ZSwgaXNIYW5kbGVkOiB0cnVlIH0pID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBzdHlsZUlEID0gYElEJHtVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke2NoaWxkQ2xvbmUuaW5uZXJIVE1MfWApfWA7XG4gICAgICBpZiAoIWNoaWxkQ2xvbmUuZ2V0QXR0cmlidXRlKCdpZCcpKVxuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHQjJHtzdHlsZUlEfWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2hpbGRDbG9uZSk7XG4gICAgfSBlbHNlIGlmICgoL14obGlua3xzdHlsZSkkL2kpLnRlc3QoY2hpbGQudGFnTmFtZSkpIHsgLy8gPGxpbms+ICYgPHN0eWxlPlxuICAgICAgbGV0IGlzU3R5bGUgPSAoL15zdHlsZSQvaSkudGVzdChjaGlsZC50YWdOYW1lKTtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicgJiYgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc1N0eWxlLCBpc0xpbms6ICFpc1N0eWxlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IGlkID0gYElEJHtVdGlscy5TSEEyNTYoY2hpbGQub3V0ZXJIVE1MKX1gO1xuICAgICAgaWYgKCFjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG5cbiAgICAgIC8vIGFwcGVuZCB0byBoZWFkXG4gICAgICBpZiAoIW93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtjaGlsZC50YWdOYW1lfSMke2lkfWApKVxuICAgICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH0gZWxzZSBpZiAoKC9ebWV0YSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8bWV0YT5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNNZXRhOiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSk7XG5cbiAgICAgIC8vIGRvIG5vdGhpbmcgd2l0aCB0aGVzZSB0YWdzXG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2UgeyAvLyBFdmVyeXRoaW5nIGVsc2VcbiAgICAgIGxldCBpc0hhbmRsZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGNoaWxkLmxvY2FsTmFtZSA9PT0gJ215dGhpeC1sYW5ndWFnZS1wYWNrJykge1xuICAgICAgICBsZXQgbGFuZ1BhY2tJRCA9IGBJRCR7VXRpbHMuU0hBMjU2KGAke2d1ZXNzZWRFbGVtZW50TmFtZX06JHtjaGlsZC5vdXRlckhUTUx9YCl9YDtcbiAgICAgICAgaWYgKCFjaGlsZC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGxhbmdQYWNrSUQpO1xuXG4gICAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyKVxuICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcblxuICAgICAgICBpZiAobGFuZ3VhZ2VQcm92aWRlcikge1xuICAgICAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlci5xdWVyeVNlbGVjdG9yKGBteXRoaXgtbGFuZ3VhZ2UtcGFjayMke2xhbmdQYWNrSUR9YCkpXG4gICAgICAgICAgICBsYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZShjaGlsZCwgbGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKTtcblxuICAgICAgICAgIGlzSGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH0gLy8gZWxzZSBkbyBub3RoaW5nLi4uIGxldCBpdCBiZSBkdW1wZWQgaW50byB0aGUgZG9tIGxhdGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygbm9kZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIG5vZGVIYW5kbGVyLmNhbGwodGhpcywgY2hpbGQsIHsgLi4uY29udGV4dCwgaXNIYW5kbGVkIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5wb3N0UHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucG9zdFByb2Nlc3MuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmUodXJsT3JOYW1lLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgbGV0IHVybCAgICAgICAgICAgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5sb2NhdGlvbiwgdXJsT3JOYW1lLCBvcHRpb25zLm1hZ2ljKTtcbiAgbGV0IGNhY2hlS2V5O1xuXG4gIGlmICghKC9eKGZhbHNlfG5vLXN0b3JlfHJlbG9hZHxuby1jYWNoZSkkLykudGVzdCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGUnKSkpIHtcbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5nZXQoJ2NhY2hlUGFyYW1zJykgIT09ICd0cnVlJykge1xuICAgICAgbGV0IGNhY2hlS2V5VVJMID0gbmV3IFVSTChgJHt1cmwub3JpZ2lufSR7dXJsLnBhdGhuYW1lfWApO1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleVVSTC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWNoZUtleSA9IHVybC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZWRSZXNwb25zZSA9IFJFUVVJUkVfQ0FDSEUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICBpZiAoY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UgJiYgY2FjaGVkUmVzcG9uc2UucmVzcG9uc2Uub2spXG4gICAgICAgIHJldHVybiB7IHVybCwgcmVzcG9uc2U6IGNhY2hlZFJlc3BvbnNlLnJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IHRydWUgfTtcbiAgICB9XG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGdsb2JhbFRoaXMuZmV0Y2godXJsLCBvcHRpb25zLmZldGNoT3B0aW9ucykudGhlbihcbiAgICBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgaWYgKGNhY2hlS2V5KVxuICAgICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIGVycm9yLnVybCA9IHVybDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgcmVzcG9uc2UudGV4dCA9IGFzeW5jICgpID0+IGJvZHk7XG4gICAgICByZXNwb25zZS5qc29uID0gYXN5bmMgKCkgPT4gSlNPTi5wYXJzZShib2R5KTtcblxuICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZSwgb3duZXJEb2N1bWVudCwgY2FjaGVkOiBmYWxzZSB9O1xuICAgIH0sXG4gICAgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmcm9tIE15dGhpeCBVSSBcInJlcXVpcmVcIjogJywgZXJyb3IpO1xuXG4gICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgIFJFUVVJUkVfQ0FDSEUuZGVsZXRlKGNhY2hlS2V5KTtcblxuICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSxcbiAgKTtcblxuICBSRVFVSVJFX0NBQ0hFLnNldChjYWNoZUtleSwgcHJvbWlzZSk7XG5cbiAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFydGlhbEludG9FbGVtZW50KHNyYywgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICBsZXQge1xuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgdXJsLFxuICAgIHJlc3BvbnNlLFxuICB9ID0gYXdhaXQgcmVxdWlyZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgc3JjLFxuICAgIHtcbiAgICAgIG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICB9LFxuICApO1xuXG4gIGxldCBib2R5ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGROb2Rlc1swXSk7XG5cbiAgbGV0IHNjb3BlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIHVybC5zZWFyY2hQYXJhbXMuZW50cmllcygpKVxuICAgIHNjb3BlRGF0YVtrZXldID0gVXRpbHMuY29lcmNlKHZhbHVlKTtcblxuICBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlLmNhbGwoXG4gICAgdGhpcyxcbiAgICBvd25lckRvY3VtZW50LFxuICAgIG93bmVyRG9jdW1lbnQubG9jYXRpb24sXG4gICAgdXJsLFxuICAgIGJvZHksXG4gICAge1xuICAgICAgbm9kZUhhbmRsZXI6IChub2RlLCB7IGlzSGFuZGxlZCwgaXNUZW1wbGF0ZSB9KSA9PiB7XG4gICAgICAgIGlmICgoaXNUZW1wbGF0ZSB8fCAhaXNIYW5kbGVkKSAmJiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cy5jYWxsKFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUoc2NvcGVEYXRhLCBvcHRpb25zLnNjb3BlKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaWJpbGl0eU9ic2VydmVyKGNhbGxiYWNrLCBfb3B0aW9ucykge1xuICBjb25zdCBpbnRlcnNlY3Rpb25DYWxsYmFjayA9IChlbnRyaWVzKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gZW50cmllcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZW50cnkgICA9IGVudHJpZXNbaV07XG4gICAgICBsZXQgZWxlbWVudCA9IGVudHJ5LnRhcmdldDtcbiAgICAgIGlmICghZW50cnkuaXNJbnRlcnNlY3RpbmcpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgZWxlbWVudE9ic2VydmVycyA9IFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTKTtcbiAgICAgIGlmICghZWxlbWVudE9ic2VydmVycykge1xuICAgICAgICBlbGVtZW50T2JzZXJ2ZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICBVdGlscy5tZXRhZGF0YShlbGVtZW50LCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUywgZWxlbWVudE9ic2VydmVycyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBkYXRhID0gZWxlbWVudE9ic2VydmVycy5nZXQob2JzZXJ2ZXIpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSB7IHdhc1Zpc2libGU6IGZhbHNlLCByYXRpb1Zpc2libGU6IGVudHJ5LmludGVyc2VjdGlvblJhdGlvIH07XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMuc2V0KG9ic2VydmVyLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gZGF0YS5yYXRpb1Zpc2libGUpXG4gICAgICAgIGRhdGEucmF0aW9WaXNpYmxlID0gZW50cnkuaW50ZXJzZWN0aW9uUmF0aW87XG5cbiAgICAgIGRhdGEucHJldmlvdXNWaXNpYmlsaXR5ID0gKGRhdGEudmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkKSA/IGRhdGEudmlzaWJpbGl0eSA6IGRhdGEudmlzaWJpbGl0eTtcbiAgICAgIGRhdGEudmlzaWJpbGl0eSA9IChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA+IDAuMCk7XG5cbiAgICAgIGNhbGxiYWNrKHsgLi4uZGF0YSwgZW50cnksIGVsZW1lbnQsIGluZGV4OiBpLCBkaXNjb25uZWN0OiAoKSA9PiBvYnNlcnZlci51bm9ic2VydmUoZWxlbWVudCkgfSk7XG5cbiAgICAgIGlmIChkYXRhLnZpc2liaWxpdHkgJiYgIWRhdGEud2FzVmlzaWJsZSlcbiAgICAgICAgZGF0YS53YXNWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG9wdGlvbnMgPSB7XG4gICAgcm9vdDogICAgICAgbnVsbCxcbiAgICB0aHJlc2hvbGQ6ICAwLjAsXG4gICAgLi4uKF9vcHRpb25zIHx8IHt9KSxcbiAgfTtcblxuICBsZXQgb2JzZXJ2ZXIgID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGludGVyc2VjdGlvbkNhbGxiYWNrLCBvcHRpb25zKTtcbiAgbGV0IGVsZW1lbnRzICA9IChfb3B0aW9ucyB8fCB7fSkuZWxlbWVudHMgfHwgW107XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnRzW2ldKTtcblxuICByZXR1cm4gb2JzZXJ2ZXI7XG59XG5cbmNvbnN0IE5PX09CU0VSVkVSID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHdhc1Zpc2libGU6ICAgICAgICAgZmFsc2UsXG4gIHJhdGlvVmlzaWJsZTogICAgICAgMC4wLFxuICB2aXNpYmlsaXR5OiAgICAgICAgIGZhbHNlLFxuICBwcmV2aW91c1Zpc2liaWxpdHk6IGZhbHNlLFxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWaXNpYmlsaXR5TWV0YShlbGVtZW50LCBvYnNlcnZlcikge1xuICBsZXQgZWxlbWVudE9ic2VydmVycyA9IFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTKTtcbiAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKVxuICAgIHJldHVybiBOT19PQlNFUlZFUjtcblxuICByZXR1cm4gZWxlbWVudE9ic2VydmVycy5nZXQob2JzZXJ2ZXIpIHx8IE5PX09CU0VSVkVSO1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjb25zdCBVTkZJTklTSEVEX0RFRklOSVRJT04gPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvdW5maW5pc2hlZCcpO1xuXG5jb25zdCBJU19QUk9QX05BTUUgICAgPSAvXnByb3BcXCQvO1xuY29uc3QgSVNfVEFSR0VUX1BST1AgID0gL15wcm90b3R5cGV8Y29uc3RydWN0b3IkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IodGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbVXRpbHMuTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgJ0VsZW1lbnREZWZpbml0aW9uJyxcbiAgICAgIH0sXG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB0YWdOYW1lID0gdGhpcy50YWdOYW1lO1xuICAgIGlmICh0YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy52YWx1ZTtcblxuICAgIGxldCBhdHRycyA9ICgoYXR0cmlidXRlcykgPT4ge1xuICAgICAgbGV0IHBhcnRzID0gW107XG5cbiAgICAgIGZvciAobGV0IFsgYXR0cmlidXRlTmFtZSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLnRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgICAgcGFydHMucHVzaChuYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcnRzLnB1c2goYCR7bmFtZX09XCIke2VuY29kZVZhbHVlKHZhbHVlKX1cImApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xuICAgIH0pKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgY2hpbGRyZW4gPSAoKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9PSBmYWxzZSAmJiAhT2JqZWN0LmlzKGNoaWxkLCBOYU4pKSlcbiAgICAgICAgLm1hcCgoY2hpbGQpID0+ICgnJyArIGNoaWxkKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH0pKHRoaXMuY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGA8JHt0YWdOYW1lfSR7KGF0dHJzKSA/IGAgJHthdHRyc31gIDogJyd9PiR7KGlzVm9pZFRhZyh0YWdOYW1lKSkgPyAnJyA6IGAke2NoaWxkcmVufTwvJHt0YWdOYW1lfT5gfWA7XG4gIH1cblxuICB0b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBidWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI2ZyYWdtZW50JylcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykpO1xuXG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0cmlidXRlcy52YWx1ZSB8fCAnJyksIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICBpZiAobmFtZXNwYWNlVVJJKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy50YWdOYW1lKTtcblxuICAgIGNvbnN0IGV2ZW50TmFtZXMgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICBVdGlscy5jcmVhdGVTY29wZShlbGVtZW50LCB0ZW1wbGF0ZU9wdGlvbnMuc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLFxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgaGFuZGxlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgZWxzZVxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGNoaWxkICAgICAgICAgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IGNoaWxkRWxlbWVudCAgPSBjaGlsZC5idWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWxlbWVudCkpXG4gICAgICAgICAgY2hpbGRFbGVtZW50LmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGNoaWxkKSA9PiBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKFxuICAgICAgdGhpcyxcbiAgICAgIGVsZW1lbnQsXG4gICAgICB7XG4gICAgICAgIC4uLnRlbXBsYXRlT3B0aW9ucyxcbiAgICAgICAgcHJvY2Vzc0V2ZW50Q2FsbGJhY2tzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBJU19IVE1MX1NBRkVfQ0hBUkFDVEVSID0gL15bXFxzYS16QS1aMC05Xy1dJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvLi9nLCAobSkgPT4ge1xuICAgIHJldHVybiAoSVNfSFRNTF9TQUZFX0NIQVJBQ1RFUi50ZXN0KG0pKSA/IG0gOiBgJiMke20uY2hhckNvZGVBdCgwKX07YDtcbiAgfSk7XG59XG5cbmNvbnN0IElTX1ZPSURfVEFHID0gL15hcmVhfGJhc2V8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW18c291cmNlfHRyYWNrfHdiciQvaTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZvaWRUYWcodGFnTmFtZSkge1xuICByZXR1cm4gSVNfVk9JRF9UQUcudGVzdCh0YWdOYW1lLnNwbGl0KCc6Jykuc2xpY2UoLTEpWzBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NFbGVtZW50cyhfbm9kZSwgX29wdGlvbnMpIHtcbiAgbGV0IG5vZGUgPSBfbm9kZTtcbiAgaWYgKCFub2RlKVxuICAgIHJldHVybiBub2RlO1xuXG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBzY29wZSAgICAgICAgID0gb3B0aW9ucy5zY29wZTtcbiAgaWYgKCFzY29wZSkge1xuICAgIHNjb3BlID0gVXRpbHMuY3JlYXRlU2NvcGUobm9kZSk7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgc2NvcGUgfTtcbiAgfVxuXG4gIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciA9IChvcHRpb25zLmZvcmNlVGVtcGxhdGVFbmdpbmUgPT09IHRydWUpID8gdW5kZWZpbmVkIDogb3B0aW9ucy5kaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcjtcbiAgbGV0IGNoaWxkcmVuICAgICAgICAgICAgICAgICAgICAgID0gQXJyYXkuZnJvbShub2RlLmNoaWxkTm9kZXMpO1xuXG4gIGlmIChvcHRpb25zLmZvcmNlVGVtcGxhdGVFbmdpbmUgIT09IHRydWUgJiYgIWRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKSB7XG4gICAgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgPSBVdGlscy5nZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpO1xuICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yIH07XG4gIH1cblxuICBsZXQgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkID0gZmFsc2U7XG4gIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciAmJiBVdGlscy5zcGVjaWFsQ2xvc2VzdChub2RlLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcikpXG4gICAgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaGVscGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuaGVscGVyLmNhbGwodGhpcywgeyBzY29wZSwgb3B0aW9ucywgbm9kZSwgY2hpbGRyZW4sIGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCwgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgfSk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICBub2RlID0gcmVzdWx0O1xuICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSB7XG4gICAgaWYgKCFpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUobm9kZSwgb3B0aW9ucyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5zb21lKChpdGVtKSA9PiAoaXRlbVtVdGlscy5NWVRISVhfVFlQRV0gPT09ICdFbGVtZW50RGVmaW5pdGlvbicgfHwgaXRlbVtVdGlscy5NWVRISVhfVFlQRV0gPT09ICdRdWVyeUVuZ2luZScpKSkge1xuICAgICAgICBsZXQgb3duZXJEb2N1bWVudCA9IG9wdGlvbnMub3duZXJEb2N1bWVudCB8fCBzY29wZS5vd25lckRvY3VtZW50IHx8IG5vZGUub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgICAgbGV0IGZyYWdtZW50ICAgICAgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICAgIGlmIChpdGVtW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ0VsZW1lbnREZWZpbml0aW9uJykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gaXRlbS5idWlsZChvd25lckRvY3VtZW50LCB7IHNjb3BlIH0pO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50cylcbiAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnRzKSlcbiAgICAgICAgICAgICAgZWxlbWVudHMuZmxhdChJbmZpbml0eSkuZm9yRWFjaCgoZWxlbWVudCkgPT4gZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50cyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ1F1ZXJ5RW5naW5lJykge1xuICAgICAgICAgICAgaXRlbS5hcHBlbmRUbyhmcmFnbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoKCcnICsgaXRlbSkpO1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmcmFnbWVudDtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSkge1xuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9ICByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFKSB7XG4gICAgbGV0IGV2ZW50TmFtZXMgICAgICA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KG5vZGUpO1xuICAgIGxldCBhdHRyaWJ1dGVOYW1lcyAgPSBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgICAgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5wcm9jZXNzRXZlbnRDYWxsYmFja3MgIT09IGZhbHNlKSB7XG4gICAgICAgICAgVXRpbHMuYmluZEV2ZW50VG9FbGVtZW50LmNhbGwoXG4gICAgICAgICAgICBVdGlscy5jcmVhdGVTY29wZShub2RlLCBzY29wZSksIC8vIHRoaXNcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLFxuICAgICAgICAgICAgYXR0cmlidXRlVmFsdWUsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVGVtcGxhdGUoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlID0gbm9kZS5nZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlTm9kZSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IC4uLm9wdGlvbnMsIGRpc2FsbG93SFRNTDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAob3B0aW9ucy5wcm9jZXNzQ2hpbGRyZW4gPT09IGZhbHNlKVxuICAgIHJldHVybiBub2RlO1xuXG4gIGZvciAobGV0IGNoaWxkTm9kZSBvZiBjaGlsZHJlbikge1xuICAgIGxldCByZXN1bHQgPSBwcm9jZXNzRWxlbWVudHMuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIG9wdGlvbnMpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBOb2RlICYmIHJlc3VsdCAhPT0gY2hpbGROb2RlICYmIGhhc0NoaWxkKG5vZGUsIGNoaWxkTm9kZSkpXG4gICAgICBub2RlLnJlcGxhY2VDaGlsZChyZXN1bHQsIGNoaWxkTm9kZSk7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NoaWxkKHBhcmVudE5vZGUsIGNoaWxkTm9kZSkge1xuICBpZiAoIXBhcmVudE5vZGUgfHwgIWNoaWxkTm9kZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbShwYXJlbnROb2RlLmNoaWxkTm9kZXMpKSB7XG4gICAgaWYgKGNoaWxkID09PSBjaGlsZE5vZGUpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBzY29wZSkge1xuICBpZiAoIXRhZ05hbWUgfHwgIVV0aWxzLmlzVHlwZSh0YWdOYW1lLCAnU3RyaW5nJykpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGNyZWF0ZSBhbiBFbGVtZW50RGVmaW5pdGlvbiB3aXRob3V0IGEgXCJ0YWdOYW1lXCIuJyk7XG5cbiAgY29uc3QgZmluYWxpemVyID0gKC4uLl9jaGlsZHJlbikgPT4ge1xuICAgIGNvbnN0IHdyYW5nbGVDaGlsZHJlbiA9IChjaGlsZHJlbikgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpLm1hcCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmICh2YWx1ZVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICAgIHJldHVybiB2YWx1ZSgpO1xuXG4gICAgICAgIGlmICh2YWx1ZVtVdGlscy5NWVRISVhfVFlQRV0gPT09ICdFbGVtZW50RGVmaW5pdGlvbicpXG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgIGlmICh2YWx1ZVtVdGlscy5NWVRISVhfVFlQRV0gPT09ICdRdWVyeUVuZ2luZScpXG4gICAgICAgICAgcmV0dXJuIHdyYW5nbGVDaGlsZHJlbih2YWx1ZS5nZXRVbmRlcmx5aW5nQXJyYXkoKSk7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgICAgICByZXR1cm4gbm9kZVRvRWxlbWVudERlZmluaXRpb24odmFsdWUpO1xuXG4gICAgICAgIGlmICghVXRpbHMuaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgVXRpbHMuRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlOiAoJycgKyB2YWx1ZSkgfSk7XG4gICAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfTtcblxuICAgIGxldCBjaGlsZHJlbiA9IHdyYW5nbGVDaGlsZHJlbihfY2hpbGRyZW4gfHwgW10pO1xuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24odGFnTmFtZSwgc2NvcGUsIGNoaWxkcmVuKTtcbiAgfTtcblxuICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KGZpbmFsaXplciwge1xuICAgIGdldDogKHRhcmdldCwgYXR0cmlidXRlTmFtZSkgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKCFzY29wZSkge1xuICAgICAgICBsZXQgc2NvcGVkUHJveHkgPSBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBkZWZhdWx0QXR0cmlidXRlcyB8fCB7fSkpO1xuICAgICAgICByZXR1cm4gc2NvcGVkUHJveHlbYXR0cmlidXRlTmFtZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJveHkoXG4gICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByb290UHJveHlbcHJvcE5hbWVdO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiByb290UHJveHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlVG9FbGVtZW50RGVmaW5pdGlvbihub2RlKSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSlcbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIG5vZGUubm9kZVZhbHVlKSB9KTtcblxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG4gIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2Ygbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbihub2RlLnRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKTtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgPSAvXih0ZW1wbGF0ZSkkL2k7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycykge1xuICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICByZXR1cm4gdGFyZ2V0O1xuXG4gIGxldCB0YXJnZXRJc1RlbXBsYXRlID0gSVNfVEVNUExBVEUudGVzdCh0YXJnZXQudGFnTmFtZSk7XG4gIGZvciAobGV0IG90aGVyIG9mIG90aGVycykge1xuICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICBjb250aW51ZTtcblxuICAgIGxldCBjaGlsZE5vZGVzID0gKElTX1RFTVBMQVRFLnRlc3Qob3RoZXIudGFnTmFtZSkpID8gb3RoZXIuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2RlcyA6IG90aGVyLmNoaWxkTm9kZXM7XG4gICAgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbShjaGlsZE5vZGVzKSkge1xuICAgICAgbGV0IGNvbnRlbnQgPSAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgPyBjaGlsZC5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IGNoaWxkO1xuICAgICAgaWYgKHRhcmdldElzVGVtcGxhdGUpXG4gICAgICAgIHRhcmdldC5jb250ZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgSVNfU1ZHX0VMRU1FTlRfTkFNRSA9IC9eKGFsdGdseXBofGFsdGdseXBoZGVmfGFsdGdseXBoaXRlbXxhbmltYXRlfGFuaW1hdGVDb2xvcnxhbmltYXRlTW90aW9ufGFuaW1hdGVUcmFuc2Zvcm18YW5pbWF0aW9ufGNpcmNsZXxjbGlwUGF0aHxjb2xvclByb2ZpbGV8Y3Vyc29yfGRlZnN8ZGVzY3xkaXNjYXJkfGVsbGlwc2V8ZmVibGVuZHxmZWNvbG9ybWF0cml4fGZlY29tcG9uZW50dHJhbnNmZXJ8ZmVjb21wb3NpdGV8ZmVjb252b2x2ZW1hdHJpeHxmZWRpZmZ1c2VsaWdodGluZ3xmZWRpc3BsYWNlbWVudG1hcHxmZWRpc3RhbnRsaWdodHxmZWRyb3BzaGFkb3d8ZmVmbG9vZHxmZWZ1bmNhfGZlZnVuY2J8ZmVmdW5jZ3xmZWZ1bmNyfGZlZ2F1c3NpYW5ibHVyfGZlaW1hZ2V8ZmVtZXJnZXxmZW1lcmdlbm9kZXxmZW1vcnBob2xvZ3l8ZmVvZmZzZXR8ZmVwb2ludGxpZ2h0fGZlc3BlY3VsYXJsaWdodGluZ3xmZXNwb3RsaWdodHxmZXRpbGV8ZmV0dXJidWxlbmNlfGZpbHRlcnxmb250fGZvbnRGYWNlfGZvbnRGYWNlRm9ybWF0fGZvbnRGYWNlTmFtZXxmb250RmFjZVNyY3xmb250RmFjZVVyaXxmb3JlaWduT2JqZWN0fGd8Z2x5cGh8Z2x5cGhSZWZ8aGFuZGxlcnxoS2VybnxpbWFnZXxsaW5lfGxpbmVhcmdyYWRpZW50fGxpc3RlbmVyfG1hcmtlcnxtYXNrfG1ldGFkYXRhfG1pc3NpbmdHbHlwaHxtUGF0aHxwYXRofHBhdHRlcm58cG9seWdvbnxwb2x5bGluZXxwcmVmZXRjaHxyYWRpYWxncmFkaWVudHxyZWN0fHNldHxzb2xpZENvbG9yfHN0b3B8c3ZnfHN3aXRjaHxzeW1ib2x8dGJyZWFrfHRleHR8dGV4dHBhdGh8dHJlZnx0c3Bhbnx1bmtub3dufHVzZXx2aWV3fHZLZXJuKSQvaTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHRhZ05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5leHBvcnQgY29uc3QgRWxlbWVudEdlbmVyYXRvciA9IG5ldyBQcm94eShcbiAge1xuICAgIFRlcm0sXG4gICAgJFRFWFQ6IFRlcm0sXG4gIH0sXG4gIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHByb3BOYW1lKSkge1xuICAgICAgICAvLyBTVkcgZWxlbWVudHNcbiAgICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lLCB7IG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lKTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBOT09QXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9LFxuKTtcbiIsImltcG9ydCBkZWVwTWVyZ2UgIGZyb20gJ2RlZXBtZXJnZSc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuaW1wb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIHJlcXVpcmUsXG59IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJTGFuZ3VhZ2VQYWNrIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgdGFnTmFtZSA9ICdteXRoaXgtbGFuZ3VhZ2UtcGFjayc7XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIHNldCBhdHRyJGRhdGFNeXRoaXhTcmMoWyB2YWx1ZSBdKSB7XG4gICAgLy8gTk9PUC4uLiBUcmFwIHRoaXMgYmVjYXVzZSB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gbG9hZCBhIHBhcnRpYWwgaGVyZVxuICB9XG5cbiAgb25NdXRhdGlvbkFkZGVkKG11dGF0aW9uKSB7XG4gICAgLy8gV2hlbiBhZGRlZCB0byB0aGUgRE9NLCBlbnN1cmUgdGhhdCB3ZSB3ZXJlXG4gICAgLy8gYWRkZWQgdG8gdGhlIHJvb3Qgb2YgYSBsYW5ndWFnZSBwcm92aWRlci4uLlxuICAgIC8vIElmIG5vdCwgdGhlbiBtb3ZlIG91cnNlbHZlcyB0byB0aGUgcm9vdFxuICAgIC8vIG9mIHRoZSBsYW5ndWFnZSBwcm92aWRlci5cbiAgICBsZXQgcGFyZW50TGFuZ3VhZ2VQcm92aWRlciA9IHRoaXMuY2xvc2VzdCgnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJyk7XG4gICAgaWYgKHBhcmVudExhbmd1YWdlUHJvdmlkZXIgJiYgcGFyZW50TGFuZ3VhZ2VQcm92aWRlciAhPT0gbXV0YXRpb24udGFyZ2V0KVxuICAgICAgVXRpbHMubmV4dFRpY2soKCkgPT4gcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5pbnNlcnRCZWZvcmUodGhpcywgcGFyZW50TGFuZ3VhZ2VQcm92aWRlci5maXJzdENoaWxkKSk7XG4gIH1cbn1cblxuY29uc3QgSVNfSlNPTl9FTkNUWVBFICAgICAgICAgICAgICAgICA9IC9eYXBwbGljYXRpb25cXC9qc29uL2k7XG5jb25zdCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcic7XG5cbiAgc2V0IGF0dHIkbGFuZyhbIG5ld1ZhbHVlLCBvbGRWYWx1ZSBdKSB7XG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrc0Zvckxhbmd1YWdlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBvbk11dGF0aW9uQ2hpbGRBZGRlZChub2RlKSB7XG4gICAgaWYgKG5vZGUubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICB0aGlzLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgLy8gUmVsb2FkIGxhbmd1YWdlIHBhY2tzIGFmdGVyIGFkZGl0aW9uc1xuICAgICAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UodGhpcy5nZXRDdXJyZW50TG9jYWxlKCkpO1xuICAgICAgfSwgTEFOR1VBR0VfUEFDS19JTlNFUlRfR1JBQ0VfVElNRSwgJ3JlbG9hZExhbmd1YWdlUGFja3MnKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3Rlcm1zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGkxOG4oX3BhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGxldCBwYXRoICAgID0gYGdsb2JhbC5pMThuLiR7X3BhdGh9YDtcbiAgICBsZXQgcmVzdWx0ICA9IFV0aWxzLmZldGNoUGF0aCh0aGlzLnRlcm1zLCBwYXRoKTtcblxuICAgIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICAgIHJldHVybiBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgcGF0aCwgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKSA/ICcnIDogZGVmYXVsdFZhbHVlKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDdXJyZW50TG9jYWxlKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJztcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmdldEF0dHJpYnV0ZSgnbGFuZycpKVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbicpO1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKCkge1xuICAgIC8vIE5PT1BcbiAgfVxuXG4gIGdldFNvdXJjZXNGb3JMYW5nKGxhbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoYG15dGhpeC1sYW5ndWFnZS1wYWNrW2xhbmdePVwiJHtsYW5nLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cIl1gKTtcbiAgfVxuXG4gIGxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UoX2xhbmcpIHtcbiAgICBsZXQgbGFuZyAgICAgICAgICAgID0gX2xhbmcgfHwgJ2VuJztcbiAgICBsZXQgc291cmNlRWxlbWVudHMgID0gdGhpcy5nZXRTb3VyY2VzRm9yTGFuZyhsYW5nKS5maWx0ZXIoKHNvdXJjZUVsZW1lbnQpID0+IFV0aWxzLmlzTm90Tk9FKHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSkpO1xuICAgIGlmICghc291cmNlRWxlbWVudHMgfHwgIXNvdXJjZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBObyBcIm15dGhpeC1sYW5ndWFnZS1wYWNrXCIgdGFnIGZvdW5kIGZvciBzcGVjaWZpZWQgbGFuZ3VhZ2UgXCIke2xhbmd9XCJgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzKGxhbmcsIHNvdXJjZUVsZW1lbnRzKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRBbGxMYW5ndWFnZVBhY2tzKGxhbmcsIHNvdXJjZUVsZW1lbnRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBwcm9taXNlcyAgPSBzb3VyY2VFbGVtZW50cy5tYXAoKHNvdXJjZUVsZW1lbnQpID0+IHRoaXMubG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSk7XG4gICAgICBsZXQgYWxsVGVybXMgID0gKGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChwcm9taXNlcykpLm1hcCgocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9PSAnZnVsZmlsbGVkJylcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgbGV0IHRlcm1zICAgICAgICAgPSBkZWVwTWVyZ2UuYWxsKEFycmF5LmZyb20obmV3IFNldChhbGxUZXJtcykpKTtcbiAgICAgIGxldCBjb21waWxlZFRlcm1zID0gdGhpcy5jb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcyk7XG5cbiAgICAgIHRoaXMudGVybXMgPSBjb21waWxlZFRlcm1zO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBsYW5ndWFnZSBwYWNrcycsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkTGFuZ3VhZ2VQYWNrKGxhbmcsIHNvdXJjZUVsZW1lbnQpIHtcbiAgICBsZXQgc3JjID0gc291cmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIGlmICghc3JjKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7IHJlc3BvbnNlIH0gID0gYXdhaXQgcmVxdWlyZS5jYWxsKHRoaXMsIHNyYywgeyBvd25lckRvY3VtZW50OiB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQgfSk7XG4gICAgICBsZXQgdHlwZSAgICAgICAgICA9IHRoaXMuZ2V0QXR0cmlidXRlKCdlbmN0eXBlJykgfHwgJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgaWYgKElTX0pTT05fRU5DVFlQRS50ZXN0KHR5cGUpKSB7XG4gICAgICAgIC8vIEhhbmRsZSBKU09OXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXcgVHlwZUVycm9yKGBEb24ndCBrbm93IGhvdyB0byBsb2FkIGEgbGFuZ3VhZ2UgcGFjayBvZiB0eXBlIFwiJHt0eXBlfVwiYCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmN9YCwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBpbGVMYW5ndWFnZVRlcm1zKGxhbmcsIHRlcm1zKSB7XG4gICAgY29uc3Qgd2Fsa1Rlcm1zID0gKHRlcm1zLCByYXdLZXlQYXRoKSA9PiB7XG4gICAgICBsZXQga2V5cyAgICAgID0gT2JqZWN0LmtleXModGVybXMpO1xuICAgICAgbGV0IHRlcm1zQ29weSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGtleSAgICAgICAgID0ga2V5c1tpXTtcbiAgICAgICAgbGV0IHZhbHVlICAgICAgID0gdGVybXNba2V5XTtcbiAgICAgICAgbGV0IG5ld0tleVBhdGggID0gcmF3S2V5UGF0aC5jb25jYXQoa2V5KTtcblxuICAgICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdCh2YWx1ZSkgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHdhbGtUZXJtcyh2YWx1ZSwgbmV3S2V5UGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIG5ld0tleVBhdGguam9pbignLicpLCB2YWx1ZSk7XG4gICAgICAgICAgdGVybXNDb3B5W2tleV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgICBwcm9wZXJ0eVtVdGlscy5EeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRlcm1zQ29weTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHdhbGtUZXJtcyh0ZXJtcywgWyAnZ2xvYmFsJywgJ2kxOG4nIF0pO1xuICB9XG59XG5cbk15dGhpeFVJTGFuZ3VhZ2VQYWNrLnJlZ2lzdGVyKCk7XG5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIucmVnaXN0ZXIoKTtcblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJTGFuZ3VhZ2VQYWNrID0gTXl0aGl4VUlMYW5ndWFnZVBhY2s7XG5nbG9iYWxUaGlzLm15dGhpeFVJLk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciA9IE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlcjtcbiIsImltcG9ydCAqIGFzIENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5cbmNvbnN0IElTX1RFTVBMQVRFICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgVEVNUExBVEVfVEVNUExBVEUgPSAvXihcXCp8XFx8XFwqfFxcKlxcfCkkLztcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJUmVxdWlyZSBleHRlbmRzIENvbXBvbmVudC5NeXRoaXhVSUNvbXBvbmVudCB7XG4gIGFzeW5jIG1vdW50ZWQoKSB7XG4gICAgbGV0IHNyYyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQge1xuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICB1cmwsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICBjYWNoZWQsXG4gICAgICB9ID0gYXdhaXQgQ29tcG9uZW50LnJlcXVpcmUuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgc3JjLFxuICAgICAgICB7XG4gICAgICAgICAgbWFnaWM6ICAgICAgICAgIHRydWUsXG4gICAgICAgICAgb3duZXJEb2N1bWVudDogIHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChjYWNoZWQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBDb21wb25lbnQuaW1wb3J0SW50b0RvY3VtZW50RnJvbVNvdXJjZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBvd25lckRvY3VtZW50LFxuICAgICAgICBvd25lckRvY3VtZW50LmxvY2F0aW9uLFxuICAgICAgICB1cmwsXG4gICAgICAgIGJvZHksXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogICAgICAgIHRydWUsXG4gICAgICAgICAgbm9kZUhhbmRsZXI6ICAobm9kZSwgeyBpc0hhbmRsZWQgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0hhbmRsZWQgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmVQcm9jZXNzOiAgICh7IHRlbXBsYXRlLCBjaGlsZHJlbiB9KSA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhclRlbXBsYXRlID0gY2hpbGRyZW4uZmluZCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgbGV0IGRhdGFGb3IgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJyk7XG4gICAgICAgICAgICAgIHJldHVybiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSAmJiBURU1QTEFURV9URU1QTEFURS50ZXN0KGRhdGFGb3IpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXN0YXJUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuXG4gICAgICAgICAgICBsZXQgZGF0YUZvciA9IHN0YXJUZW1wbGF0ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJyk7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgICAgICBpZiAoY2hpbGQgPT09IHN0YXJUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJDbG9uZSA9IHN0YXJUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUZvciA9PT0gJyp8JylcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRlbnQuaW5zZXJ0QmVmb3JlKHN0YXJDbG9uZSwgY2hpbGQuY29udGVudC5jaGlsZE5vZGVzWzBdIHx8IG51bGwpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRlbnQuYXBwZW5kQ2hpbGQoc3RhckNsb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGFyVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdGFyVGVtcGxhdGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwibXl0aGl4LXJlcXVpcmVcIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY31gLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2hTcmMoKSB7XG4gICAgLy8gTk9PUFxuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVJlcXVpcmU7XG5cbmlmICh0eXBlb2YgY3VzdG9tRWxlbWVudHMgIT09ICd1bmRlZmluZWQnICYmICFjdXN0b21FbGVtZW50cy5nZXQoJ215dGhpeC1yZXF1aXJlJykpXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgnbXl0aGl4LXJlcXVpcmUnLCBNeXRoaXhVSVJlcXVpcmUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5pbXBvcnQgeyBNeXRoaXhVSUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuLypcbk1hbnkgdGhhbmtzIHRvIFNhZ2VlIENvbndheSBmb3IgdGhlIGZvbGxvd2luZyBDU1Mgc3Bpbm5lcnNcbmh0dHBzOi8vY29kZXBlbi5pby9zYWNvbndheS9wZW4vdllLWXlyeFxuKi9cblxuY29uc3QgU1RZTEVfU0hFRVQgPVxuYFxuOmhvc3Qge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IDFlbTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuOmhvc3QoLnNtYWxsKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAwLjc1KTtcbn1cbjpob3N0KC5tZWRpdW0pIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDEuNSk7XG59XG46aG9zdCgubGFyZ2UpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDMpO1xufVxuLnNwaW5uZXItaXRlbSxcbi5zcGlubmVyLWl0ZW06OmJlZm9yZSxcbi5zcGlubmVyLWl0ZW06OmFmdGVyIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDYwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjI1KTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4wNzUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBib3JkZXI6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24ge1xuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDEuMCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpICogMC4wNzUpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjcpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItYm90dG9tOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC44NzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjQpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC43NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkpIHJvdGF0ZSg0NWRlZyk7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMi41KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXI6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIHtcbiAgMCUsIDguMzMlLCAxNi42NiUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMjQuOTklLCAzMy4zMiUsIDQxLjY1JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMCUpO1xuICB9XG4gIDQ5Ljk4JSwgNTguMzElLCA2Ni42NCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDEwMCUpO1xuICB9XG4gIDc0Ljk3JSwgODMuMzAlLCA5MS42MyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIHtcbiAgMCUsIDguMzMlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMTYuNjYlLCAyNC45OSUsIDMzLjMyJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG4gIDQxLjY1JSwgNDkuOTglLCA1OC4zMSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAxMDAlKTtcbiAgfVxuICA2Ni42NCUsIDc0Ljk3JSwgODMuMzAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMge1xuICAwJSwgODMuMzAlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDApO1xuICB9XG4gIDguMzMlLCAxNi42NiUsIDI0Ljk5JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDApO1xuICB9XG4gIDMzLjMyJSwgNDEuNjUlLCA0OS45OCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAtMTAwJSk7XG4gIH1cbiAgNTguMzElLCA2Ni42NCUsIDc0Ljk3JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDQpO1xuICBtaW4td2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYm9yZGVyOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNzUlKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNzUlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMik7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA0MCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIHtcbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgyKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xuICB9XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMik7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiA0KTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI1KTtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgLyAtMik7XG59XG5gO1xuXG5jb25zdCBLSU5EUyA9IHtcbiAgJ2F1ZGlvJzogIDUsXG4gICdjaXJjbGUnOiAzLFxuICAnZG90JzogICAgMixcbiAgJ3BpcGUnOiAgIDUsXG4gICdwdXp6bGUnOiAzLFxuICAnd2F2ZSc6ICAgMyxcbn07XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSVNwaW5uZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1zcGlubmVyJztcblxuICBzZXQgYXR0ciRraW5kKFsgbmV3VmFsdWUgXSkge1xuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShuZXdWYWx1ZSk7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIGlmICghdGhpcy5kb2N1bWVudEluaXRpYWxpemVkKSB7XG4gICAgICAvLyBhcHBlbmQgdGVtcGxhdGVcbiAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgdGhpcy4kYnVpbGQoKHsgVEVNUExBVEUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gVEVNUExBVEVcbiAgICAgICAgICAuZGF0YU15dGhpeE5hbWUodGhpcy5zZW5zaXRpdmVUYWdOYW1lKVxuICAgICAgICAgIC5wcm9wJGlubmVySFRNTChgPHN0eWxlPiR7U1RZTEVfU0hFRVR9PC9zdHlsZT5gKTtcbiAgICAgIH0pLmFwcGVuZFRvKG93bmVyRG9jdW1lbnQuYm9keSk7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00odGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGxldCBraW5kID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2tpbmQnKTtcbiAgICBpZiAoIWtpbmQpIHtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgna2luZCcsIGtpbmQpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShraW5kKTtcbiAgfVxuXG4gIGhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UoX2tpbmQpIHtcbiAgICBsZXQga2luZCAgICAgICAgPSAoJycgKyBfa2luZCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChLSU5EUywga2luZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtc3Bpbm5lclwiIHVua25vd24gXCJraW5kXCIgcHJvdmlkZWQ6IFwiJHtraW5kfVwiLiBTdXBwb3J0ZWQgXCJraW5kXCIgYXR0cmlidXRlIHZhbHVlcyBhcmU6IFwicGlwZVwiLCBcImF1ZGlvXCIsIFwiY2lyY2xlXCIsIFwicHV6emxlXCIsIFwid2F2ZVwiLCBhbmQgXCJkb3RcIi5gKTtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VTcGlubmVyQ2hpbGRyZW4oS0lORFNba2luZF0pO1xuICB9XG5cbiAgYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICBsZXQgY2hpbGRyZW4gICAgICA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXItaXRlbScpO1xuXG4gICAgICBjaGlsZHJlbltpXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KGNoaWxkcmVuKTtcbiAgfVxuXG4gIGNoYW5nZVNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIHRoaXMuc2VsZWN0KCcuc3Bpbm5lci1pdGVtJykucmVtb3ZlKCk7XG4gICAgdGhpcy5idWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBzdHlsZSBhZ2Fpbiwgc29cbiAgICAvLyB0aGF0IGl0IGlzIHRoZSBsYXN0IGNoaWxkLCBhbmRcbiAgICAvLyBkb2Vzbid0IG1lc3Mgd2l0aCBcIm50aC1jaGlsZFwiXG4gICAgLy8gc2VsZWN0b3JzXG4gICAgdGhpcy5zZWxlY3QoJ3N0eWxlJykuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuICB9XG59XG5cbk15dGhpeFVJU3Bpbm5lci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlTcGlubmVyO1xuIiwiaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuY29uc3QgSVNfSU5URUdFUiA9IC9eXFxkKyQvO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gV2UgaGF2ZSBhbiBFbGVtZW50IG9yIGEgRG9jdW1lbnRcbiAgaWYgKHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1Nsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBpc05vdFNsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICFlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENsYXNzTmFtZXMoLi4uYXJncykge1xuICBsZXQgY2xhc3NOYW1lcyA9IFtdLmNvbmNhdCguLi5hcmdzKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAubWFwKChwYXJ0KSA9PiAoJycgKyBwYXJ0KS5zcGxpdCgvXFxzKy8pKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBjbGFzc05hbWVzO1xufVxuXG5leHBvcnQgY2xhc3MgUXVlcnlFbmdpbmUge1xuICBzdGF0aWMgaXNFbGVtZW50ICAgID0gaXNFbGVtZW50O1xuICBzdGF0aWMgaXNTbG90dGVkICAgID0gaXNTbG90dGVkO1xuICBzdGF0aWMgaXNOb3RTbG90dGVkID0gaXNOb3RTbG90dGVkO1xuXG4gIHN0YXRpYyBmcm9tID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBuZXcgUXVlcnlFbmdpbmUoW10sIHsgcm9vdDogKGlzRWxlbWVudCh0aGlzKSkgPyB0aGlzIDogZG9jdW1lbnQsIGNvbnRleHQ6IHRoaXMgfSk7XG5cbiAgICBjb25zdCBnZXRPcHRpb25zID0gKCkgPT4ge1xuICAgICAgbGV0IGJhc2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKVxuICAgICAgICBiYXNlID0gT2JqZWN0LmFzc2lnbihiYXNlLCBhcmdzW2FyZ0luZGV4KytdKTtcblxuICAgICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXhdLmdldE9wdGlvbnMoKSB8fCB7fSwgYmFzZSk7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRSb290RWxlbWVudCA9IChvcHRpb25zUm9vdCkgPT4ge1xuICAgICAgaWYgKGlzRWxlbWVudChvcHRpb25zUm9vdCkpXG4gICAgICAgIHJldHVybiBvcHRpb25zUm9vdDtcblxuICAgICAgaWYgKGlzRWxlbWVudCh0aGlzKSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHJldHVybiAoKHRoaXMgJiYgdGhpcy5vd25lckRvY3VtZW50KSB8fCBkb2N1bWVudCk7XG4gICAgfTtcblxuICAgIGxldCBhcmdJbmRleCAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgPSBnZXRPcHRpb25zKCk7XG4gICAgbGV0IHJvb3QgICAgICA9IGdldFJvb3RFbGVtZW50KG9wdGlvbnMucm9vdCk7XG4gICAgbGV0IHF1ZXJ5RW5naW5lO1xuXG4gICAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgdGhpcztcblxuICAgIGlmIChhcmdzW2FyZ0luZGV4XSBpbnN0YW5jZW9mIFF1ZXJ5RW5naW5lKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XS5zbGljZSgpLCBvcHRpb25zKTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbYXJnSW5kZXhdKSkge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4ICsgMV0sICdGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1sxXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUoYXJnc1thcmdJbmRleF0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnU3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnRnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJvb3QucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLnNlbGVjdG9yKSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdGdW5jdGlvbicpKSB7XG4gICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgbGV0IHJlc3VsdCA9IG9wdGlvbnMuY2FsbGJhY2suY2FsbCh0aGlzLCBFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCBvcHRpb25zKTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShyZXN1bHQpKVxuICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShyZXN1bHQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmludm9rZUNhbGxiYWNrcyAhPT0gZmFsc2UgJiYgdHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gcXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9O1xuXG4gIGdldEVuZ2luZUNsYXNzKCkge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBfb3B0aW9ucykge1xuICAgIGxldCBvcHRpb25zID0gX29wdGlvbnMgfHwge307XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbVXRpbHMuTVlUSElYX1RZUEVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgJ1F1ZXJ5RW5naW5lJyxcbiAgICAgIH0sXG4gICAgICAnX215dGhpeFVJT3B0aW9ucyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvcHRpb25zLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlFbGVtZW50cyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKG9wdGlvbnMuY29udGV4dCwgZWxlbWVudHMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCByb290UHJveHkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BOYW1lID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2xlbmd0aCcpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAncHJvdG90eXBlJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjb25zdHJ1Y3RvcicpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5jb25zdHJ1Y3RvcjtcblxuICAgICAgICAvLyBJbmRleCBsb29rdXBcbiAgICAgICAgaWYgKElTX0lOVEVHRVIudGVzdChwcm9wTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgICAvLyBSZWRpcmVjdCBhbnkgYXJyYXkgbWV0aG9kczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gXCJtYWdpY1Byb3BOYW1lXCIgaXMgd2hlbiB0aGVcbiAgICAgICAgLy8gZnVuY3Rpb24gbmFtZSBiZWdpbnMgd2l0aCBcIiRcIixcbiAgICAgICAgLy8gaS5lLiBcIiRmaWx0ZXJcIiwgb3IgXCIkbWFwXCIuIElmXG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2UsIHRoZW4gdGhlIHJldHVyblxuICAgICAgICAvLyB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBjb2VyY2VkIGludG9cbiAgICAgICAgLy8gYSBRdWVyeUVuZ2luZS4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICAgICAgIC8vIG9ubHkgYmUgY29lcmNlZCBpbnRvIGEgUXVlcnlFbmdpbmVcbiAgICAgICAgLy8gaWYgRVZFUlkgZWxlbWVudCBpbiB0aGUgcmVzdWx0IGlzXG4gICAgICAgIC8vIGFuIFwiZWxlbWVudHlcIiB0eXBlIHZhbHVlLlxuICAgICAgICBsZXQgbWFnaWNQcm9wTmFtZSA9IChwcm9wTmFtZS5jaGFyQXQoMCkgPT09ICckJykgPyBwcm9wTmFtZS5zdWJzdHJpbmcoMSkgOiBwcm9wTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGVbbWFnaWNQcm9wTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGxldCBhcnJheSAgID0gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCAgPSBhcnJheVttYWdpY1Byb3BOYW1lXSguLi5hcmdzKTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiAobWFnaWNQcm9wTmFtZSAhPT0gcHJvcE5hbWUgfHwgcmVzdWx0LmV2ZXJ5KChpdGVtKSA9PiBVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24sIE5vZGUsIFF1ZXJ5RW5naW5lKSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sIE5vZGUpKVxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgaWYgKGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgaXRlbSA9IGl0ZW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIGl0ZW0gPSBFbGVtZW50cy5UZXJtKGl0ZW0pO1xuICAgICAgZWxzZSBpZiAoIVV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbikpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgaWYgKCFjb250ZXh0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImNvbnRleHRcIiBvcHRpb24gZm9yIFF1ZXJ5RW5naW5lIGlzIHJlcXVpcmVkIHdoZW4gY29uc3RydWN0aW5nIGVsZW1lbnRzLicpO1xuXG4gICAgICByZXR1cm4gaXRlbS5idWlsZCh0aGlzLmdldE93bmVyRG9jdW1lbnQoKSwge1xuICAgICAgICBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUoY29udGV4dCksXG4gICAgICB9KTtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGZpbmFsRWxlbWVudHMpKTtcbiAgfVxuXG4gIHNlbGVjdCguLi5hcmdzKSB7XG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgdGhpcy5nZXRPcHRpb25zKCksIChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBhcmdzW2FyZ0luZGV4KytdIDoge30pO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0LiQgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0LiQuY2FsbChvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBFbmdpbmVDbGFzcy5mcm9tLmNhbGwob3B0aW9ucy5jb250ZXh0IHx8IHRoaXMsIG9wdGlvbnMsIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgfVxuXG4gICplbnRyaWVzKCkge1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgeWllbGQoW2ksIGVsZW1lbnRdKTtcbiAgICB9XG4gIH1cblxuICAqa2V5cygpIHtcbiAgICBmb3IgKGxldCBbIGtleSwgXyBdIG9mIHRoaXMuZW50cmllcygpKVxuICAgICAgeWllbGQga2V5O1xuICB9XG5cbiAgKnZhbHVlcygpIHtcbiAgICBmb3IgKGxldCBbIF8sIHZhbHVlIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4geWllbGQgKnRoaXMudmFsdWVzKCk7XG4gIH1cblxuICBmaXJzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnTnVtYmVyJykpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoWyB0aGlzLl9teXRoaXhVSUVsZW1lbnRzWzBdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpKSk7XG4gIH1cblxuICBsYXN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICdOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9XG5cbiAgaW5zZXJ0SW50byhzZWxlY3Rvck9yRWxlbWVudCwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJ1N0cmluZycpKVxuICAgICAgZWxlbWVudCA9IHRoaXMuZ2V0Um9vdCgpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JPckVsZW1lbnQpO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLmdldE93bmVyRG9jdW1lbnQoKTtcbiAgICBsZXQgc291cmNlICAgICAgICA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgZnJhZ21lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcblxuICAgICAgc291cmNlID0gWyBmcmFnbWVudCBdO1xuICAgIH1cblxuICAgIGVsZW1lbnQuaW5zZXJ0KHNvdXJjZVswXSwgcmVmZXJlbmNlTm9kZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlcGxhY2VDaGlsZHJlbk9mKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG5cbiAgc2xvdChzbG90TmFtZSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5zbG90ID09PSBzbG90TmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmIChlbGVtZW50LmNsb3Nlc3QoYHNsb3RbbmFtZT1cIiR7c2xvdE5hbWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5RdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gU0hBMjU2KF9pbnB1dCkge1xuICBsZXQgaW5wdXQgPSBfaW5wdXQ7XG5cbiAgbGV0IG1hdGhQb3cgPSBNYXRoLnBvdztcbiAgbGV0IG1heFdvcmQgPSBtYXRoUG93KDIsIDMyKTtcbiAgbGV0IGxlbmd0aFByb3BlcnR5ID0gJ2xlbmd0aCc7XG4gIGxldCBpOyBsZXQgajsgLy8gVXNlZCBhcyBhIGNvdW50ZXIgYWNyb3NzIHRoZSB3aG9sZSBmaWxlXG4gIGxldCByZXN1bHQgPSAnJztcblxuICBsZXQgd29yZHMgPSBbXTtcbiAgbGV0IGFzY2lpQml0TGVuZ3RoID0gaW5wdXRbbGVuZ3RoUHJvcGVydHldICogODtcblxuICAvLyogY2FjaGluZyByZXN1bHRzIGlzIG9wdGlvbmFsIC0gcmVtb3ZlL2FkZCBzbGFzaCBmcm9tIGZyb250IG9mIHRoaXMgbGluZSB0byB0b2dnbGVcbiAgLy8gSW5pdGlhbCBoYXNoIHZhbHVlOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBzcXVhcmUgcm9vdHMgb2YgdGhlIGZpcnN0IDggcHJpbWVzXG4gIC8vICh3ZSBhY3R1YWxseSBjYWxjdWxhdGUgdGhlIGZpcnN0IDY0LCBidXQgZXh0cmEgdmFsdWVzIGFyZSBqdXN0IGlnbm9yZWQpXG4gIGxldCBoYXNoID0gU0hBMjU2LmggPSBTSEEyNTYuaCB8fCBbXTtcbiAgLy8gUm91bmQgY29uc3RhbnRzOiBmaXJzdCAzMiBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBjdWJlIHJvb3RzIG9mIHRoZSBmaXJzdCA2NCBwcmltZXNcbiAgbGV0IGsgPSBTSEEyNTYuayA9IFNIQTI1Ni5rIHx8IFtdO1xuICBsZXQgcHJpbWVDb3VudGVyID0ga1tsZW5ndGhQcm9wZXJ0eV07XG4gIC8qL1xuICAgIGxldCBoYXNoID0gW10sIGsgPSBbXTtcbiAgICBsZXQgcHJpbWVDb3VudGVyID0gMDtcbiAgICAvLyovXG5cbiAgbGV0IGlzQ29tcG9zaXRlID0ge307XG4gIGZvciAobGV0IGNhbmRpZGF0ZSA9IDI7IHByaW1lQ291bnRlciA8IDY0OyBjYW5kaWRhdGUrKykge1xuICAgIGlmICghaXNDb21wb3NpdGVbY2FuZGlkYXRlXSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IDMxMzsgaSArPSBjYW5kaWRhdGUpXG4gICAgICAgIGlzQ29tcG9zaXRlW2ldID0gY2FuZGlkYXRlO1xuXG4gICAgICBoYXNoW3ByaW1lQ291bnRlcl0gPSAobWF0aFBvdyhjYW5kaWRhdGUsIDAuNSkgKiBtYXhXb3JkKSB8IDA7XG4gICAgICBrW3ByaW1lQ291bnRlcisrXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMSAvIDMpICogbWF4V29yZCkgfCAwO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0ICs9ICdcXHg4MCc7IC8vIEFwcGVuZCDGhycgYml0IChwbHVzIHplcm8gcGFkZGluZylcbiAgd2hpbGUgKGlucHV0W2xlbmd0aFByb3BlcnR5XSAlIDY0IC0gNTYpXG4gICAgaW5wdXQgKz0gJ1xceDAwJzsgLy8gTW9yZSB6ZXJvIHBhZGRpbmdcblxuICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRbbGVuZ3RoUHJvcGVydHldOyBpKyspIHtcbiAgICBqID0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaiA+PiA4KVxuICAgICAgcmV0dXJuOyAvLyBBU0NJSSBjaGVjazogb25seSBhY2NlcHQgY2hhcmFjdGVycyBpbiByYW5nZSAwLTI1NVxuICAgIHdvcmRzW2kgPj4gMl0gfD0gaiA8PCAoKDMgLSBpKSAlIDQpICogODtcbiAgfVxuXG4gIHdvcmRzW3dvcmRzW2xlbmd0aFByb3BlcnR5XV0gPSAoKGFzY2lpQml0TGVuZ3RoIC8gbWF4V29yZCkgfCAwKTtcbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9IChhc2NpaUJpdExlbmd0aCk7XG5cbiAgLy8gcHJvY2VzcyBlYWNoIGNodW5rXG4gIGZvciAoaiA9IDA7IGogPCB3b3Jkc1tsZW5ndGhQcm9wZXJ0eV07KSB7XG4gICAgbGV0IHcgPSB3b3Jkcy5zbGljZShqLCBqICs9IDE2KTsgLy8gVGhlIG1lc3NhZ2UgaXMgZXhwYW5kZWQgaW50byA2NCB3b3JkcyBhcyBwYXJ0IG9mIHRoZSBpdGVyYXRpb25cbiAgICBsZXQgb2xkSGFzaCA9IGhhc2g7XG5cbiAgICAvLyBUaGlzIGlzIG5vdyB0aGUgdW5kZWZpbmVkd29ya2luZyBoYXNoXCIsIG9mdGVuIGxhYmVsbGVkIGFzIHZhcmlhYmxlcyBhLi4uZ1xuICAgIC8vICh3ZSBoYXZlIHRvIHRydW5jYXRlIGFzIHdlbGwsIG90aGVyd2lzZSBleHRyYSBlbnRyaWVzIGF0IHRoZSBlbmQgYWNjdW11bGF0ZVxuICAgIGhhc2ggPSBoYXNoLnNsaWNlKDAsIDgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBpbnRvIDY0IHdvcmRzXG4gICAgICAvLyBVc2VkIGJlbG93IGlmXG4gICAgICBsZXQgdzE1ID0gd1tpIC0gMTVdOyBsZXQgdzIgPSB3W2kgLSAyXTtcblxuICAgICAgLy8gSXRlcmF0ZVxuICAgICAgbGV0IGEgPSBoYXNoWzBdOyBsZXQgZSA9IGhhc2hbNF07XG4gICAgICBsZXQgdGVtcDEgPSBoYXNoWzddXG4gICAgICAgICAgICAgICAgKyAoKChlID4+PiA2KSB8IChlIDw8IDI2KSkgXiAoKGUgPj4+IDExKSB8IChlIDw8IDIxKSkgXiAoKGUgPj4+IDI1KSB8IChlIDw8IDcpKSkgLy8gUzFcbiAgICAgICAgICAgICAgICArICgoZSAmIGhhc2hbNV0pIF4gKCh+ZSkgJiBoYXNoWzZdKSkgLy8gY2hcbiAgICAgICAgICAgICAgICArIGtbaV1cbiAgICAgICAgICAgICAgICAvLyBFeHBhbmQgdGhlIG1lc3NhZ2Ugc2NoZWR1bGUgaWYgbmVlZGVkXG4gICAgICAgICAgICAgICAgKyAod1tpXSA9IChpIDwgMTYpID8gd1tpXSA6IChcbiAgICAgICAgICAgICAgICAgIHdbaSAtIDE2XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MTUgPj4+IDcpIHwgKHcxNSA8PCAyNSkpIF4gKCh3MTUgPj4+IDE4KSB8ICh3MTUgPDwgMTQpKSBeICh3MTUgPj4+IDMpKSAvLyBzMFxuICAgICAgICAgICAgICAgICAgICAgICAgKyB3W2kgLSA3XVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAoKCh3MiA+Pj4gMTcpIHwgKHcyIDw8IDE1KSkgXiAoKHcyID4+PiAxOSkgfCAodzIgPDwgMTMpKSBeICh3MiA+Pj4gMTApKSAvLyBzMVxuICAgICAgICAgICAgICAgICkgfCAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgIC8vIFRoaXMgaXMgb25seSB1c2VkIG9uY2UsIHNvICpjb3VsZCogYmUgbW92ZWQgYmVsb3csIGJ1dCBpdCBvbmx5IHNhdmVzIDQgYnl0ZXMgYW5kIG1ha2VzIHRoaW5ncyB1bnJlYWRibGVcbiAgICAgIGxldCB0ZW1wMiA9ICgoKGEgPj4+IDIpIHwgKGEgPDwgMzApKSBeICgoYSA+Pj4gMTMpIHwgKGEgPDwgMTkpKSBeICgoYSA+Pj4gMjIpIHwgKGEgPDwgMTApKSkgLy8gUzBcbiAgICAgICAgICAgICAgICArICgoYSAmIGhhc2hbMV0pIF4gKGEgJiBoYXNoWzJdKSBeIChoYXNoWzFdICYgaGFzaFsyXSkpOyAvLyBtYWpcblxuICAgICAgaGFzaCA9IFsodGVtcDEgKyB0ZW1wMikgfCAwXS5jb25jYXQoaGFzaCk7IC8vIFdlIGRvbid0IGJvdGhlciB0cmltbWluZyBvZmYgdGhlIGV4dHJhIG9uZXMsIHRoZXkncmUgaGFybWxlc3MgYXMgbG9uZyBhcyB3ZSdyZSB0cnVuY2F0aW5nIHdoZW4gd2UgZG8gdGhlIHNsaWNlKClcbiAgICAgIGhhc2hbNF0gPSAoaGFzaFs0XSArIHRlbXAxKSB8IDA7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IDg7IGkrKylcbiAgICAgIGhhc2hbaV0gPSAoaGFzaFtpXSArIG9sZEhhc2hbaV0pIHwgMDtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICBmb3IgKGogPSAzOyBqICsgMTsgai0tKSB7XG4gICAgICBsZXQgYiA9IChoYXNoW2ldID4+IChqICogOCkpICYgMjU1O1xuICAgICAgcmVzdWx0ICs9ICgoYiA8IDE2KSA/IDAgOiAnJykgKyBiLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgU0hBMjU2IH0gZnJvbSAnLi9zaGEyNTYuanMnO1xuXG5leHBvcnQge1xuICBTSEEyNTYsXG59O1xuXG5mdW5jdGlvbiBwYWQoc3RyLCBjb3VudCwgY2hhciA9ICcwJykge1xuICByZXR1cm4gc3RyLnBhZFN0YXJ0KGNvdW50LCBjaGFyKTtcbn1cblxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9uYW1lLXZhbHVlLXBhaXItaGVscGVyJyk7XG5leHBvcnQgY29uc3QgTVlUSElYX1NIQURPV19QQVJFTlQgICAgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL3NoYWRvdy1wYXJlbnQnKTtcbmV4cG9ydCBjb25zdCBNWVRISVhfVFlQRSAgICAgICAgICAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvZWxlbWVudC1kZWZpbml0aW9uJyk7XG5cbmNvbnN0IElEX0NPVU5UX0xFTkdUSCAgICAgICAgID0gMTk7XG5jb25zdCBJU19DTEFTUyAgICAgICAgICAgICAgICA9ICgvXmNsYXNzIFxcUysgXFx7Lyk7XG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUyA9IFtcbiAgJ0FnZ3JlZ2F0ZUVycm9yJyxcbiAgJ0FycmF5JyxcbiAgJ0FycmF5QnVmZmVyJyxcbiAgJ0JpZ0ludCcsXG4gICdCaWdJbnQ2NEFycmF5JyxcbiAgJ0JpZ1VpbnQ2NEFycmF5JyxcbiAgJ0Jvb2xlYW4nLFxuICAnRGF0YVZpZXcnLFxuICAnRGF0ZScsXG4gICdEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZScsXG4gICdFcnJvcicsXG4gICdFdmFsRXJyb3InLFxuICAnRmluYWxpemF0aW9uUmVnaXN0cnknLFxuICAnRmxvYXQzMkFycmF5JyxcbiAgJ0Zsb2F0NjRBcnJheScsXG4gICdGdW5jdGlvbicsXG4gICdJbnQxNkFycmF5JyxcbiAgJ0ludDMyQXJyYXknLFxuICAnSW50OEFycmF5JyxcbiAgJ01hcCcsXG4gICdOdW1iZXInLFxuICAnT2JqZWN0JyxcbiAgJ1Byb3h5JyxcbiAgJ1JhbmdlRXJyb3InLFxuICAnUmVmZXJlbmNlRXJyb3InLFxuICAnUmVnRXhwJyxcbiAgJ1NldCcsXG4gICdTaGFyZWRBcnJheUJ1ZmZlcicsXG4gICdTdHJpbmcnLFxuICAnU3ltYm9sJyxcbiAgJ1N5bnRheEVycm9yJyxcbiAgJ1R5cGVFcnJvcicsXG4gICdVaW50MTZBcnJheScsXG4gICdVaW50MzJBcnJheScsXG4gICdVaW50OEFycmF5JyxcbiAgJ1VpbnQ4Q2xhbXBlZEFycmF5JyxcbiAgJ1VSSUVycm9yJyxcbiAgJ1dlYWtNYXAnLFxuICAnV2Vha1JlZicsXG4gICdXZWFrU2V0Jyxcbl07XG5cbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFU19NRVRBID0gTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMubWFwKCh0eXBlTmFtZSkgPT4ge1xuICByZXR1cm4gWyB0eXBlTmFtZSwgZ2xvYmFsVGhpc1t0eXBlTmFtZV0gXTtcbn0pLmZpbHRlcigobWV0YSkgPT4gbWV0YVsxXSk7XG5cbmxldCBpZENvdW50ZXIgPSAwbjtcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlEKCkge1xuICBpZENvdW50ZXIgKz0gQmlnSW50KDEpO1xuICByZXR1cm4gYCR7RGF0ZS5ub3coKX0ke3BhZChpZENvdW50ZXIudG9TdHJpbmcoKSwgSURfQ09VTlRfTEVOR1RIKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVzb2x2YWJsZSgpIHtcbiAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgbGV0IHJlc29sdmU7XG4gIGxldCByZWplY3Q7XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICByZXNvbHZlID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ2Z1bGZpbGxlZCc7XG4gICAgICAgIF9yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHJlamVjdCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgIF9yZWplY3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm9taXNlLCB7XG4gICAgJ3Jlc29sdmUnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlc29sdmUsXG4gICAgfSxcbiAgICAncmVqZWN0Jzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZWplY3QsXG4gICAgfSxcbiAgICAnc3RhdHVzJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICAoKSA9PiBzdGF0dXMsXG4gICAgfSxcbiAgICAnaWQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIGdlbmVyYXRlSUQoKSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGxldCB0aGlzVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHRoaXNUeXBlID09PSAnYmlnaW50JylcbiAgICByZXR1cm4gJ0JpZ0ludCc7XG5cbiAgaWYgKHRoaXNUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIGlmICh0aGlzVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh2YWx1ZSA9PT0gdHlwZU1ldGFbMV0pKTtcbiAgICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtuYXRpdmVUeXBlTWV0YVswXX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIElTX0NMQVNTLnRlc3QoJycgKyB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IpKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke3ZhbHVlLm5hbWV9XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgIHJldHVybiBgW0NsYXNzICR7cmVzdWx0fV1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzVHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke3RoaXNUeXBlLnN1YnN0cmluZygxKX1gO1xuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nKVxuICAgIHJldHVybiAnU3RyaW5nJztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOdW1iZXIpXG4gICAgcmV0dXJuICdOdW1iZXInO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgcmV0dXJuICdCb29sZWFuJztcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgcmV0dXJuICdPYmplY3QnO1xuXG4gIGlmICh0eXBlb2YgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuXG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlKHZhbHVlLCAuLi50eXBlcykge1xuICBsZXQgdmFsdWVUeXBlID0gdHlwZU9mKHZhbHVlKTtcbiAgaWYgKHR5cGVzLmluZGV4T2YodmFsdWVUeXBlKSA+PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiB0eXBlcy5zb21lKCh0eXBlKSA9PiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkTnVtYmVyKHZhbHVlKSB7XG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikgfHwgT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNUeXBlKHZhbHVlLCAnTnVtYmVyJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0Jvb2xlYW4nLCAnQmlnSW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3RhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXMoSW5maW5pdHkpIHx8IE9iamVjdC5pcygtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycsICdOdW1iZXInLCAnQm9vbGVhbicsICdCaWdJbnQnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05PRSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycpICYmICgvXltcXHNcXHJcXG5dKiQvKS50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLmxlbmd0aCwgJ051bWJlcicpKVxuICAgIHJldHVybiAodmFsdWUubGVuZ3RoID09PSAwKTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIWlzTk9FKHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvXlxcVy8sICcnKVxuICAgIC5yZXBsYWNlKC9bXFxXXSskLywgJycpXG4gICAgLnJlcGxhY2UoLyhbQS1aXSspL2csICctJDEnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL1xcVysoLikvZywgKG0sIHApID0+IHtcbiAgICAgIHJldHVybiBwLnRvVXBwZXJDYXNlKCk7XG4gICAgfSlcbiAgICAucmVwbGFjZSgvXiguKSguKikkLywgKG0sIGYsIGwpID0+IGAke2YudG9Mb3dlckNhc2UoKX0ke2x9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSkge1xuICByZXR1cm4gKCcnICsgdmFsdWUpXG4gICAgLnJlcGxhY2UoL1tBLVpdKy9nLCAobSwgb2Zmc2V0KSA9PiAoKG9mZnNldCkgPyBgLSR7bS50b0xvd2VyQ2FzZSgpfWAgOiBtLnRvTG93ZXJDYXNlKCkpKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZE1ldGhvZHMoX3Byb3RvLCBza2lwUHJvdG9zKSB7XG4gIGxldCBwcm90byAgICAgICAgICAgPSBfcHJvdG87XG4gIGxldCBhbHJlYWR5VmlzaXRlZCAgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKHByb3RvKSB7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG8pO1xuICAgIGxldCBrZXlzICAgICAgICA9IE9iamVjdC5rZXlzKGRlc2NyaXB0b3JzKS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhkZXNjcmlwdG9ycykpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgfHwga2V5ID09PSAncHJvdG90eXBlJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXMoa2V5KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGFscmVhZHlWaXNpdGVkLmFkZChrZXkpO1xuXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JzW2tleV07XG5cbiAgICAgIC8vIENhbiBpdCBiZSBjaGFuZ2VkP1xuICAgICAgaWYgKGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID09PSBmYWxzZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIC8vIElmIGlzIGdldHRlciwgdGhlbiBza2lwXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdnZXQnKSB8fCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ3NldCcpKSB7XG4gICAgICAgIGxldCBuZXdEZXNjcmlwdG9yID0geyAuLi5kZXNjcmlwdG9yIH07XG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLmdldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLmdldCA9IG5ld0Rlc2NyaXB0b3IuZ2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3Iuc2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3Iuc2V0ID0gbmV3RGVzY3JpcHRvci5zZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBuZXdEZXNjcmlwdG9yKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB2YWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cbiAgICAgIC8vIFNraXAgcHJvdG90eXBlIG9mIE9iamVjdFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBPYmplY3QucHJvdG90eXBlW2tleV0gPT09IHZhbHVlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHsgLi4uZGVzY3JpcHRvciwgdmFsdWU6IHZhbHVlLmJpbmQodGhpcykgfSk7XG4gICAgfVxuXG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIGJyZWFrO1xuXG4gICAgaWYgKHNraXBQcm90b3MgJiYgc2tpcFByb3Rvcy5pbmRleE9mKHByb3RvKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuY29uc3QgTUVUQURBVEFfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXRhZGF0YSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgbGV0IGRhdGEgPSBNRVRBREFUQV9XRUFLTUFQLmdldCh0YXJnZXQpO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gKGRhdGEpID8gZGF0YS5nZXQoa2V5KSA6IHVuZGVmaW5lZDtcblxuICBpZiAoIWRhdGEpIHtcbiAgICBpZiAoIWlzQ29sbGVjdGFibGUodGFyZ2V0KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHNldCBtZXRhZGF0YSBvbiBwcm92aWRlZCBvYmplY3Q6ICR7KHR5cGVvZiB0YXJnZXQgPT09ICdzeW1ib2wnKSA/IHRhcmdldC50b1N0cmluZygpIDogdGFyZ2V0fWApO1xuXG4gICAgZGF0YSA9IG5ldyBNYXAoKTtcbiAgICBNRVRBREFUQV9XRUFLTUFQLnNldCh0YXJnZXQsIGRhdGEpO1xuICB9XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5jb25zdCBPQkpfSURfV0VBS01BUCA9IG5ldyBXZWFrTWFwKCk7XG5sZXQgaWRDb3VudCA9IDFuO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqSUQob2JqKSB7XG4gIGxldCBpZCA9IE9CSl9JRF9XRUFLTUFQLmdldChvYmopO1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIGxldCB0aGlzSUQgPSBgJHtpZENvdW50Kyt9YDtcbiAgICBPQkpfSURfV0VBS01BUC5zZXQob2JqLCB0aGlzSUQpO1xuXG4gICAgcmV0dXJuIHRoaXNJRDtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIChuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pKS50aGVuKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9WQUxVRSAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvdmFsdWUnKTtcbmNvbnN0IERZTkFNSUNfUFJPUEVSVFlfQ01UICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2R5bmFtaWMtcHJvcGVydHkvY29uc3RhbnRzL2NsZWFuLW1lbW9yeS10aW1lcicpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvaXMtc2V0dGluZycpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9TRVQgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvc2V0Jyk7XG5cbmV4cG9ydCBjbGFzcyBEeW5hbWljUHJvcGVydHkgZXh0ZW5kcyBFdmVudFRhcmdldCB7XG4gIHN0YXRpYyBzZXQgPSBEWU5BTUlDX1BST1BFUlRZX1NFVDtcblxuICBjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGRlZmF1bHRWYWx1ZSxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9DTVRdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG51bGwsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR106IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0KSA6IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSkgOiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJylcbiAgICAgIHJldHVybiArdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICBlbHNlIGlmIChoaW50ID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICB2YWx1ZU9mKCkge1xuICAgIHJldHVybiB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICB9XG5cbiAgW0RZTkFNSUNfUFJPUEVSVFlfU0VUXShfbmV3VmFsdWUpIHtcbiAgICBpZiAodGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG5ld1ZhbHVlID0gX25ld1ZhbHVlO1xuICAgIGlmIChpc1R5cGUobmV3VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKVxuICAgICAgbmV3VmFsdWUgPSBuZXdWYWx1ZS52YWx1ZU9mKCk7XG5cbiAgICBpZiAodGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9PT0gbmV3VmFsdWUpXG4gICAgICByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gdHJ1ZTtcblxuICAgICAgbGV0IG9sZFZhbHVlICAgID0gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICAgIGxldCB1cGRhdGVFdmVudCA9IG5ldyBFdmVudCgndXBkYXRlJyk7XG5cbiAgICAgIHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO1xuICAgICAgdXBkYXRlRXZlbnQub2xkVmFsdWUgPSBvbGRWYWx1ZTtcbiAgICAgIHVwZGF0ZUV2ZW50LnZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV0gPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHVwZGF0ZUV2ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBWQUxJRF9KU19JREVOVElGSUVSID0gL15bYS16QS1aXyRdW2EtekEtWjAtOV8kXSokLztcbmZ1bmN0aW9uIGdldENvbnRleHRDYWxsQXJncyhjb250ZXh0LCAuLi5leHRyYUNvbnRleHRzKSB7XG4gIGxldCBjb250ZXh0Q2FsbEFyZ3MgPSBBcnJheS5mcm9tKFxuICAgIG5ldyBTZXQoZ2V0QWxsUHJvcGVydHlOYW1lcyhjb250ZXh0KS5jb25jYXQoXG4gICAgICBPYmplY3Qua2V5cyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KSxcbiAgICAgIFsgJ2F0dHJpYnV0ZXMnLCAnY2xhc3NMaXN0JywgJyQkJywgJ2kxOG4nIF0sXG4gICAgICAuLi5leHRyYUNvbnRleHRzLm1hcCgoZXh0cmFDb250ZXh0KSA9PiBPYmplY3Qua2V5cyhleHRyYUNvbnRleHQgfHwge30pKSxcbiAgICApKSxcbiAgKS5maWx0ZXIoKG5hbWUpID0+IFZBTElEX0pTX0lERU5USUZJRVIudGVzdChuYW1lKSk7XG5cbiAgcmV0dXJuIGB7JHtjb250ZXh0Q2FsbEFyZ3Muam9pbignLCcpfX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAoZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiBtZXRhZGF0YShlbGVtZW50LnBhcmVudE5vZGUsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKTtcblxuICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKTtcblxuICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2NvcGUoLi4uX3RhcmdldHMpIHtcbiAgY29uc3QgZmluZFByb3BOYW1lU2NvcGUgPSAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmICh0YXJnZXQgPT0gbnVsbCB8fCBPYmplY3QuaXModGFyZ2V0LCBOYU4pKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgIHJldHVybiB0YXJnZXQ7XG5cbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICAgIHJldHVybjtcblxuICAgIGNvbnN0IGZldGNoUHVibGlzaENvbnRleHQgPSAoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGlmICghY3VycmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0O1xuICAgICAgZG8ge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gY3VycmVudEVsZW1lbnQpXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRFbGVtZW50O1xuXG4gICAgICAgIGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0ID0gY3VycmVudEVsZW1lbnQucHVibGlzaENvbnRleHQ7XG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50UHVibGlzaENvbnRleHQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50KTtcblxuICAgICAgaWYgKCFjb21wb25lbnRQdWJsaXNoQ29udGV4dCB8fCAhY3VycmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IHB1Ymxpc2hlZENvbnRleHQgPSBjb21wb25lbnRQdWJsaXNoQ29udGV4dC5jYWxsKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgIGlmICghcHVibGlzaGVkQ29udGV4dCB8fCAhKHByb3BOYW1lIGluIHB1Ymxpc2hlZENvbnRleHQpKVxuICAgICAgICByZXR1cm4gZmV0Y2hQdWJsaXNoQ29udGV4dChnZXRQYXJlbnROb2RlKGN1cnJlbnRFbGVtZW50KSk7XG5cbiAgICAgIHJldHVybiBwdWJsaXNoZWRDb250ZXh0O1xuICAgIH07XG5cbiAgICByZXR1cm4gZmV0Y2hQdWJsaXNoQ29udGV4dCh0YXJnZXQpO1xuICB9O1xuXG4gIGxldCB0YXJnZXRzICAgICAgICAgPSBfdGFyZ2V0cy5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmaXJzdEVsZW1lbnQgICAgPSB0YXJnZXRzLmZpbmQoKHRhcmdldCkgPT4gKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKSB8fCB0YXJnZXRzWzBdO1xuICBsZXQgYmFzZUNvbnRleHQgICAgID0ge307XG4gIGxldCBmYWxsYmFja0NvbnRleHQgPSB7XG4gICAgZ2xvYmFsU2NvcGU6ICAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKSxcbiAgICBpMThuOiAgICAgICAgIChwYXRoLCBkZWZhdWx0VmFsdWUpID0+IHtcbiAgICAgIGxldCBsYW5ndWFnZVByb3ZpZGVyID0gc3BlY2lhbENsb3Nlc3QoZmlyc3RFbGVtZW50LCAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJyk7XG4gICAgICBpZiAoIWxhbmd1YWdlUHJvdmlkZXIpXG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICAgIHJldHVybiBsYW5ndWFnZVByb3ZpZGVyLmkxOG4ocGF0aCwgZGVmYXVsdFZhbHVlKTtcbiAgICB9LFxuICAgIGR5bmFtaWNQcm9wSUQsXG4gIH07XG5cbiAgdGFyZ2V0cyA9IHRhcmdldHMuY29uY2F0KGZhbGxiYWNrQ29udGV4dCk7XG4gIGxldCBwcm94eSAgID0gbmV3IFByb3h5KGJhc2VDb250ZXh0LCB7XG4gICAgb3duS2V5czogKCkgPT4ge1xuICAgICAgbGV0IGFsbEtleXMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpXG4gICAgICAgIGFsbEtleXMgPSBhbGxLZXlzLmNvbmNhdChnZXRBbGxQcm9wZXJ0eU5hbWVzKHRhcmdldCkpO1xuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmIChnbG9iYWxTY29wZSlcbiAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KE9iamVjdC5rZXlzKGdsb2JhbFNjb3BlKSk7XG5cbiAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoYWxsS2V5cykpO1xuICAgIH0sXG4gICAgaGFzOiAoXywgcHJvcE5hbWUpID0+IHtcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgcmV0dXJuIChwcm9wTmFtZSBpbiBnbG9iYWxTY29wZSk7XG4gICAgfSxcbiAgICBnZXQ6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIHNjb3BlW3Byb3BOYW1lXTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBnbG9iYWxTY29wZVtwcm9wTmFtZV07XG4gICAgfSxcbiAgICBzZXQ6IChfLCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IGRvU2V0ID0gKHNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGlzVHlwZShzY29wZVtwcm9wTmFtZV0sIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKVxuICAgICAgICAgIHNjb3BlW3Byb3BOYW1lXVtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzY29wZVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0YXJnZXRzKSB7XG4gICAgICAgIGxldCBzY29wZSA9IGZpbmRQcm9wTmFtZVNjb3BlKHRhcmdldCwgcHJvcE5hbWUpO1xuICAgICAgICBpZiAoIXNjb3BlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBkb1NldChzY29wZSwgcHJvcE5hbWUsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGdsb2JhbFNjb3BlID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgJiYgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSk7XG4gICAgICBpZiAoIWdsb2JhbFNjb3BlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiBkb1NldChnbG9iYWxTY29wZSwgcHJvcE5hbWUsIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcblxuICBmYWxsYmFja0NvbnRleHQuJCQgPSBwcm94eTtcblxuICByZXR1cm4gcHJveHk7XG59XG5cbmNvbnN0IEVWRU5UX0FDVElPTl9KVVNUX05BTUUgPSAvXiU/W1xcdy4kXSskLztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4LCBib2R5LCBzY29wZSB9KSB7XG4gIGxldCBmdW5jdGlvbkJvZHkgPSBib2R5O1xuICBpZiAoRVZFTlRfQUNUSU9OX0pVU1RfTkFNRS50ZXN0KGZ1bmN0aW9uQm9keSkpIHtcbiAgICBpZiAoZnVuY3Rpb25Cb2R5LmNoYXJBdCgwKSA9PT0gJyUnKSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKHRoaXMuZHluYW1pY1Byb3BJRCB8fCBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQpKCcke2Z1bmN0aW9uQm9keS5zdWJzdHJpbmcoMSkudHJpbSgpLnJlcGxhY2UoL1teXFx3JF0vZywgJycpfScpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVuY3Rpb25Cb2R5ID0gYCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IF9fX18kID0gJHtmdW5jdGlvbkJvZHl9O1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIF9fX18kID09PSAnZnVuY3Rpb24nKSA/IF9fX18kLmFwcGx5KHRoaXMsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgxKSkgOiBfX19fJDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiR7ZnVuY3Rpb25Cb2R5fS5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICB9KSgpO2A7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldENvbnRleHRDYWxsQXJncyhzY29wZSk7XG5cbiAgZnVuY3Rpb25Cb2R5ID0gYCR7KHByZWZpeCkgPyBgJHtwcmVmaXh9O2AgOiAnJ31yZXR1cm4gJHsoZnVuY3Rpb25Cb2R5IHx8ICcodm9pZCAwKScpLnJlcGxhY2UoL15cXHMqcmV0dXJuXFxzKy8sICcnKS50cmltKCl9O2A7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKGNvbnRleHRDYWxsQXJncywgZnVuY3Rpb25Cb2R5KSkuYmluZChzY29wZSwgc2NvcGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBzY29wZSAgICAgICAgID0gb3B0aW9ucy5zY29wZTtcbiAgbGV0IHBhcnRzICAgICAgICAgPSBbXTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSAwO1xuXG4gIHRleHQucmVwbGFjZSgvKD88IVxcXFwpKEBAKSguKz8pXFwxL2csIChtLCBzdGFydCwgbWFjcm8sIG9mZnNldCkgPT4ge1xuICAgIGlmIChjdXJyZW50T2Zmc2V0IDwgb2Zmc2V0KVxuICAgICAgcGFydHMucHVzaCh7IHR5cGU6ICdsaXRlcmFsJywgdmFsdWU6IHRleHQuc3Vic3RyaW5nKGN1cnJlbnRPZmZzZXQsIG9mZnNldCkgfSk7XG5cbiAgICBjdXJyZW50T2Zmc2V0ID0gb2Zmc2V0ICsgbS5sZW5ndGg7XG5cbiAgICBsZXQgbWV0aG9kICA9IGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyBib2R5OiBtYWNybywgc2NvcGUgfSk7XG4gICAgbGV0IHZhbHVlICAgPSBtZXRob2QoKTtcblxuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbWFjcm8nLCB2YWx1ZSwgbWV0aG9kIH0pO1xuICB9KTtcblxuICBpZiAoY3VycmVudE9mZnNldCA8IHRleHQubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIHZhbHVlOiB0ZXh0LnN1YnN0cmluZyhjdXJyZW50T2Zmc2V0KSB9KTtcblxuICByZXR1cm4gcGFydHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVGVtcGxhdGVGcm9tUGFydHMocGFydHMpIHtcbiAgbGV0IHJlc3VsdCA9IHBhcnRzXG4gICAgLm1hcCgocGFydCkgPT4gcGFydC52YWx1ZSlcbiAgICAuZmlsdGVyKChpdGVtKSA9PiAoaXRlbSAhPSBudWxsICYmIGl0ZW0gIT09ICcnKSk7XG5cbiAgaWYgKHJlc3VsdC5zb21lKChpdGVtKSA9PiAoaXRlbVtNWVRISVhfVFlQRV0gPT09ICdFbGVtZW50RGVmaW5pdGlvbicgfHwgaXRlbVtNWVRISVhfVFlQRV0gPT09ICdRdWVyeUVuZ2luZScpKSlcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSkpXG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcblxuICByZXR1cm4gKHJlc3VsdC5sZW5ndGggPCAyKSA/IHJlc3VsdFswXSA6IHJlc3VsdDtcbn1cblxuY29uc3QgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTID0gWyAzLCAyIF07IC8vIFRFWFRfTk9ERSwgQVRUUklCVVRFX05PREVcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXROb2RlVmFsdWUobm9kZSwgX29wdGlvbnMpIHtcbiAgaWYgKG5vZGUucGFyZW50Tm9kZSAmJiAoL14oc3R5bGV8c2NyaXB0KSQvKS50ZXN0KG5vZGUucGFyZW50Tm9kZS5sb2NhbE5hbWUpKVxuICAgIHJldHVybiBub2RlLm5vZGVWYWx1ZTtcblxuICBpZiAoIW5vZGUgfHwgRk9STUFUX1RFUk1fQUxMT1dBQkxFX05PREVTLmluZGV4T2Yobm9kZS5ub2RlVHlwZSkgPCAwKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZm9ybWF0Tm9kZVZhbHVlXCIgdW5zdXBwb3J0ZWQgbm9kZSB0eXBlIHByb3ZpZGVkLiBPbmx5IFRFWFRfTk9ERSBhbmQgQVRUUklCVVRFX05PREUgdHlwZXMgYXJlIHN1cHBvcnRlZC4nKTtcblxuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgdGV4dCAgICAgICAgICA9IG5vZGUubm9kZVZhbHVlO1xuICBsZXQgdGVtcGxhdGVQYXJ0cyA9IHBhcnNlVGVtcGxhdGVQYXJ0cyh0ZXh0LCBvcHRpb25zKTtcblxuICB0ZW1wbGF0ZVBhcnRzLmZvckVhY2goKHsgdmFsdWUgfSkgPT4ge1xuICAgIGlmIChvcHRpb25zLmJpbmRUb0R5bmFtaWNQcm9wZXJ0aWVzICE9PSBmYWxzZSAmJiBpc1R5cGUodmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICB2YWx1ZS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSAoJycgKyBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cykpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSlcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHJlc3VsdDtcbiAgICAgIH0sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCByZXN1bHQgPSBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cyk7XG4gIGlmIChyZXN1bHQgPT0gbnVsbClcbiAgICByZXN1bHQgPSAnJztcblxuICByZXR1cm4gKG9wdGlvbnMuZGlzYWxsb3dIVE1MID09PSB0cnVlKSA/ICgnJyArIHJlc3VsdCkgOiByZXN1bHQ7XG59XG5cbmNvbnN0IElTX1RFTVBMQVRFID0gLyg/PCFcXFxcKUBALztcbmV4cG9ydCBmdW5jdGlvbiBpc1RlbXBsYXRlKHZhbHVlKSB7XG4gIGlmICghaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBJU19URU1QTEFURS50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9ICghZWxlbWVudC50YWdOYW1lKSA/IGVsZW1lbnQgOiBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgbGV0IGNhY2hlICAgPSBFVkVOVF9OQU1FX0NBQ0hFLmdldCh0YWdOYW1lKTtcbiAgaWYgKGNhY2hlKVxuICAgIHJldHVybiBjYWNoZTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEUuc2V0KHRhZ05hbWUsIGV2ZW50TmFtZXMpO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoaXNQbGFpbk9iamVjdChfY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgID0gX2NhbGxiYWNrLmNhbGxiYWNrO1xuICAgIG9wdGlvbnMgICA9IF9jYWxsYmFjay5vcHRpb25zIHx8IHt9O1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9XG5cbiAgaWYgKGlzVHlwZShjYWxsYmFjaywgJ1N0cmluZycpKVxuICAgIGNhbGxiYWNrID0gY3JlYXRlVGVtcGxhdGVNYWNybyh7IHByZWZpeDogJ2xldCBldmVudD1hcmd1bWVudHNbMV0nLCBib2R5OiBjYWxsYmFjaywgc2NvcGU6IHRoaXMgfSk7XG5cbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7IGNhbGxiYWNrLCBvcHRpb25zIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFBhdGgob2JqLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAob2JqID09IG51bGwgfHwgT2JqZWN0LmlzKG9iaiwgTmFOKSB8fCBPYmplY3QuaXMob2JqLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKG9iaiwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGlmIChrZXkgPT0gbnVsbCB8fCBPYmplY3QuaXMoa2V5LCBOYU4pIHx8IE9iamVjdC5pcyhrZXksIEluZmluaXR5KSB8fCBPYmplY3QuaXMoa2V5LCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgbGV0IHBhcnRzICAgICAgICAgPSBrZXkuc3BsaXQoL1xcLi9nKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBjdXJyZW50VmFsdWUgID0gb2JqO1xuXG4gIGZvciAobGV0IGkgPSAwLCBpbCA9IHBhcnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBsZXQgcGFydCA9IHBhcnRzW2ldO1xuICAgIGxldCBuZXh0VmFsdWUgPSBjdXJyZW50VmFsdWVbcGFydF07XG4gICAgaWYgKG5leHRWYWx1ZSA9PSBudWxsKVxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIGN1cnJlbnRWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChnbG9iYWxUaGlzLk5vZGUgJiYgY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSBpbnN0YW5jZW9mIGdsb2JhbFRoaXMuTm9kZSAmJiAoY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpKVxuICAgIHJldHVybiBjdXJyZW50VmFsdWUubm9kZVZhbHVlO1xuXG4gIHJldHVybiAoY3VycmVudFZhbHVlID09IG51bGwpID8gZGVmYXVsdFZhbHVlIDogY3VycmVudFZhbHVlO1xufVxuXG5jb25zdCBJU19OVU1CRVIgPSAvXihbLStdPykoXFxkKig/OlxcLlxcZCspPykoZVstK11cXGQrKT8kLztcbmNvbnN0IElTX0JPT0xFQU4gPSAvXih0cnVlfGZhbHNlKSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gY29lcmNlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gJ251bGwnKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBpZiAodmFsdWUgPT09ICdOYU4nKVxuICAgIHJldHVybiBOYU47XG5cbiAgaWYgKHZhbHVlID09PSAnSW5maW5pdHknIHx8IHZhbHVlID09PSAnK0luZmluaXR5JylcbiAgICByZXR1cm4gSW5maW5pdHk7XG5cbiAgaWYgKHZhbHVlID09PSAnLUluZmluaXR5JylcbiAgICByZXR1cm4gLUluZmluaXR5O1xuXG4gIGlmIChJU19OVU1CRVIudGVzdCh2YWx1ZSkpXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSwgMTApO1xuXG4gIGlmIChJU19CT09MRUFOLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiAodmFsdWUgPT09ICd0cnVlJyk7XG5cbiAgcmV0dXJuICgnJyArIHZhbHVlKTtcbn1cblxuY29uc3QgQ0FDSEVEX1BST1BFUlRZX05BTUVTID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IFNLSVBfUFJPVE9UWVBFUyAgICAgICA9IFtcbiAgZ2xvYmFsVGhpcy5IVE1MRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5Ob2RlLFxuICBnbG9iYWxUaGlzLkVsZW1lbnQsXG4gIGdsb2JhbFRoaXMuT2JqZWN0LFxuICBnbG9iYWxUaGlzLkFycmF5LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFByb3BlcnR5TmFtZXMoX29iaikge1xuICBpZiAoIWlzQ29sbGVjdGFibGUoX29iaikpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGxldCBjYWNoZWROYW1lcyA9IENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5nZXQoX29iaik7XG4gIGlmIChjYWNoZWROYW1lcylcbiAgICByZXR1cm4gY2FjaGVkTmFtZXM7XG5cbiAgbGV0IG9iaiAgID0gX29iajtcbiAgbGV0IG5hbWVzID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChvYmopIHtcbiAgICBsZXQgb2JqTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG9iak5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgICBuYW1lcy5hZGQob2JqTmFtZXNbaV0pO1xuXG4gICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKG9iaiAmJiBTS0lQX1BST1RPVFlQRVMuaW5kZXhPZihvYmouY29uc3RydWN0b3IpID49IDApXG4gICAgICBicmVhaztcbiAgfVxuXG4gIGxldCBmaW5hbE5hbWVzID0gQXJyYXkuZnJvbShuYW1lcyk7XG4gIENBQ0hFRF9QUk9QRVJUWV9OQU1FUy5zZXQoX29iaiwgZmluYWxOYW1lcyk7XG5cbiAgcmV0dXJuIGZpbmFsTmFtZXM7XG59XG5cbmNvbnN0IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRSA9IG5ldyBXZWFrTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aChrZXlQYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgbGV0IGluc3RhbmNlQ2FjaGUgPSBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuZ2V0KHRoaXMpO1xuICBpZiAoIWluc3RhbmNlQ2FjaGUpIHtcbiAgICBpbnN0YW5jZUNhY2hlID0gbmV3IE1hcCgpO1xuICAgIExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5zZXQodGhpcywgaW5zdGFuY2VDYWNoZSk7XG4gIH1cblxuICBsZXQgcHJvcGVydHkgPSBpbnN0YW5jZUNhY2hlLmdldChrZXlQYXRoKTtcbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIHByb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuICAgIGluc3RhbmNlQ2FjaGUuc2V0KGtleVBhdGgsIHByb3BlcnR5KTtcbiAgfVxuXG4gIHJldHVybiBwcm9wZXJ0eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwZWNpYWxDbG9zZXN0KG5vZGUsIHNlbGVjdG9yKSB7XG4gIGlmICghbm9kZSB8fCAhc2VsZWN0b3IpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBjdXJyZW50Tm9kZSA9IG5vZGU7XG4gIHdoaWxlIChjdXJyZW50Tm9kZSAmJiAodHlwZW9mIGN1cnJlbnROb2RlLm1hdGNoZXMgIT09ICdmdW5jdGlvbicgfHwgIWN1cnJlbnROb2RlLm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoY3VycmVudE5vZGUpO1xuXG4gIHJldHVybiBjdXJyZW50Tm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMgfHwgMCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY1Byb3AobmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIpIHtcbiAgbGV0IGR5bmFtaWNQcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoZGVmYXVsdFZhbHVlKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgW25hbWVdOiB7XG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6ICAgICAgICAgICgpID0+IGR5bmFtaWNQcm9wZXJ0eSxcbiAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGVyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShzZXR0ZXIobmV3VmFsdWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGR5bmFtaWNQcm9wZXJ0eVtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBkeW5hbWljUHJvcGVydHk7XG59XG5cbmNvbnN0IERZTkFNSUNfUFJPUF9SRUdJU1RSWSA9IG5ldyBNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljUHJvcElEKGlkKSB7XG4gIGxldCBwcm9wID0gRFlOQU1JQ19QUk9QX1JFR0lTVFJZLmdldChpZCk7XG4gIGlmIChwcm9wKVxuICAgIHJldHVybiBwcm9wO1xuXG4gIHByb3AgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCcnKTtcbiAgRFlOQU1JQ19QUk9QX1JFR0lTVFJZLnNldChpZCwgcHJvcCk7XG5cbiAgcmV0dXJuIHByb3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZU5hbWVWYWx1ZVBhaXJIZWxwZXIodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICBtZXRhZGF0YShcbiAgICB0YXJnZXQsXG4gICAgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIsXG4gICAgWyBuYW1lLCB2YWx1ZSBdLFxuICApO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMgPSBuZXcgU2V0KFsgJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXScsICdteXRoaXgtZm9yLWVhY2gnIF0pO1xuZXhwb3J0IGZ1bmN0aW9uIGdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbShSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTKS5qb2luKCcsJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuYWRkKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJEaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcihzZWxlY3Rvcikge1xuICBSRUdJU1RFUkVEX0RJU0FCTEVfVEVNUExBVEVfU0VMRUNUT1JTLmRlbGV0ZShzZWxlY3Rvcik7XG59XG5cbmZ1bmN0aW9uIGdsb2JhbFN0b3JlSGVscGVyKGR5bmFtaWMsIGFyZ3MpIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgIHJldHVybjtcblxuICBjb25zdCBzZXRPbkdsb2JhbCA9IChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBjdXJyZW50VmFsdWUgPSBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdO1xuICAgIGlmIChpc1R5cGUoY3VycmVudFZhbHVlLCBEeW5hbWljUHJvcGVydHksICdEeW5hbWljUHJvcGVydHknKSkge1xuICAgICAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXVtEeW5hbWljUHJvcGVydHkuc2V0XSh2YWx1ZSk7XG4gICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgIH1cblxuICAgIGlmIChpc1R5cGUodmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgbGV0IHByb3AgPSBkeW5hbWljUHJvcElEKG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gcHJvcCxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHByb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG5hbWVWYWx1ZVBhaXIgPSBtZXRhZGF0YShhcmdzWzBdLCBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUik7XG4gIGlmIChuYW1lVmFsdWVQYWlyKSB7XG4gICAgbGV0IFsgbmFtZSwgdmFsdWUgXSA9IG5hbWVWYWx1ZVBhaXI7XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiBpc1R5cGUoYXJnc1swXSwgJ1N0cmluZycpKSB7XG4gICAgbGV0IG5hbWUgID0gYXJnc1swXTtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzFdO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzBdO1xuICAgIGxldCBuYW1lICA9ICh0eXBlb2YgdGhpcy5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSA/IHRoaXMuZ2V0SWRlbnRpZmllcigpIDogKHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIGlmICghbmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJteXRoaXhVSS5nbG9iYWxTdG9yZVwiOiBcIm5hbWVcIiBpcyB1bmtub3duLCBzbyB1bmFibGUgdG8gc3RvcmUgdmFsdWUnKTtcblxuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmUoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCBmYWxzZSwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZUR5bmFtaWMoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCB0cnVlLCBhcmdzKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSB8fCB7fSk7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLnVybClcbiAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS51cmwgPSBuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uKTtcblxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5leHBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuZXhwb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudC5qcyc7XG5leHBvcnQgKiBhcyBFbGVtZW50cyBmcm9tICcuL2VsZW1lbnRzLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXJlcXVpcmUuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktc3Bpbm5lci5qcyc7XG5cbmNvbnN0IE15dGhpeFVJQ29tcG9uZW50ID0gQ29tcG9uZW50cy5NeXRoaXhVSUNvbXBvbmVudDtcblxuZXhwb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG59O1xuXG5sZXQgX215dGhpeElzUmVhZHkgPSBmYWxzZTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgJ29ubXl0aGl4cmVhZHknOiB7XG4gICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiAgICAgICAgICAoKSA9PiB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHNldDogICAgICAgICAgKGNhbGxiYWNrKSA9PiB7XG4gICAgICBpZiAoX215dGhpeElzUmVhZHkpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBjYWxsYmFjayhuZXcgRXZlbnQoJ215dGhpeC1yZWFkeScpKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXl0aGl4LXJlYWR5JywgY2FsbGJhY2spO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZ2xvYmFsVGhpcy5teXRoaXhVSS5VdGlscyA9IFV0aWxzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5Db21wb25lbnRzID0gQ29tcG9uZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuRWxlbWVudHMgPSBFbGVtZW50cztcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmUgPSBVdGlscy5nbG9iYWxTdG9yZTtcbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZ2xvYmFsU3RvcmVEeW5hbWljID0gVXRpbHMuZ2xvYmFsU3RvcmVEeW5hbWljO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLmR5bmFtaWNQcm9wSUQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gVXRpbHMuZHluYW1pY1Byb3BJRChpZCk7XG59O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBsZXQgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IGZhbHNlO1xuXG4gIGNvbnN0IG9uRG9jdW1lbnRSZWFkeSA9ICgpID0+IHtcbiAgICBpZiAoIWRpZFZpc2liaWxpdHlPYnNlcnZlcnMpIHtcbiAgICAgIGxldCBlbGVtZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbXl0aGl4LXNyY10nKSk7XG4gICAgICBDb21wb25lbnRzLnZpc2liaWxpdHlPYnNlcnZlcigoeyBkaXNjb25uZWN0LCBlbGVtZW50LCB3YXNWaXNpYmxlIH0pID0+IHtcbiAgICAgICAgaWYgKHdhc1Zpc2libGUpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGRpc2Nvbm5lY3QoKTtcblxuICAgICAgICBsZXQgc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpO1xuICAgICAgICBpZiAoIXNyYylcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgQ29tcG9uZW50cy5sb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwoZWxlbWVudCwgc3JjKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIHsgZWxlbWVudHMgfSk7XG5cbiAgICAgIGRpZFZpc2liaWxpdHlPYnNlcnZlcnMgPSB0cnVlO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG5cbiAgICBpZiAoX215dGhpeElzUmVhZHkpXG4gICAgICByZXR1cm47XG5cbiAgICBfbXl0aGl4SXNSZWFkeSA9IHRydWU7XG5cbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMsIHtcbiAgICAnJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoLi4uYXJncyksXG4gICAgfSxcbiAgICAnJCQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogICAgICAgICguLi5hcmdzKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKC4uLmFyZ3MpLFxuICAgIH0sXG4gIH0pO1xuXG4gIGxldCBkb2N1bWVudE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxUaGlzLm15dGhpeFVJLmRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBsZXQgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgPSBVdGlscy5nZXREaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvcigpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IG11dGF0aW9ucy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgbXV0YXRpb24gID0gbXV0YXRpb25zW2ldO1xuICAgICAgbGV0IHRhcmdldCAgICA9IG11dGF0aW9uLnRhcmdldDtcblxuICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJykge1xuICAgICAgICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3JTdHIgJiYgdGFyZ2V0LnBhcmVudE5vZGUgJiYgdHlwZW9mIHRhcmdldC5wYXJlbnROb2RlLmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0cikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlTm9kZShtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlICAgICAgPSAoYXR0cmlidXRlTm9kZSkgPyBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA6IG51bGw7XG4gICAgICAgIGxldCBvbGRWYWx1ZSAgICAgID0gbXV0YXRpb24ub2xkVmFsdWU7XG5cbiAgICAgICAgaWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAobmV3VmFsdWUgJiYgVXRpbHMuaXNUZW1wbGF0ZShuZXdWYWx1ZSkpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyBzY29wZTogVXRpbHMuY3JlYXRlU2NvcGUodGFyZ2V0KSwgZGlzYWxsb3dIVE1MOiB0cnVlIH0pO1xuXG4gICAgICAgIGxldCBvYnNlcnZlZEF0dHJpYnV0ZXMgPSB0YXJnZXQuY29uc3RydWN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuICAgICAgICBpZiAob2JzZXJ2ZWRBdHRyaWJ1dGVzICYmIG9ic2VydmVkQXR0cmlidXRlcy5pbmRleE9mKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpIDwgMCkge1xuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwodGFyZ2V0LCBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGxldCBkaXNhYmxlVGVtcGxhdGluZyA9IChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5jbG9zZXN0ID09PSAnZnVuY3Rpb24nICYmIHRhcmdldC5jbG9zZXN0KCdbZGF0YS10ZW1wbGF0ZXMtZGlzYWJsZV0sbXl0aGl4LWZvci1lYWNoJykpO1xuICAgICAgICBsZXQgYWRkZWROb2RlcyAgICAgICAgPSBtdXRhdGlvbi5hZGRlZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgamwgPSBhZGRlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IGFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25BZGRlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICghZGlzYWJsZVRlbXBsYXRpbmcpXG4gICAgICAgICAgICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMobm9kZSk7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0W0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdKVxuICAgICAgICAgICAgdGFyZ2V0Lm9uTXV0YXRpb25DaGlsZEFkZGVkKG5vZGUsIG11dGF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZW1vdmVkTm9kZXMgPSBtdXRhdGlvbi5yZW1vdmVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IHJlbW92ZWROb2Rlcy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgbGV0IG5vZGUgPSByZW1vdmVkTm9kZXNbal07XG4gICAgICAgICAgaWYgKG5vZGVbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0gJiYgbm9kZS5vbk11dGF0aW9uUmVtb3ZlZC5jYWxsKG5vZGUsIG11dGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkUmVtb3ZlZChub2RlLCBtdXRhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50TXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgc3VidHJlZTogICAgICAgICAgICB0cnVlLFxuICAgIGNoaWxkTGlzdDogICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiAgICAgICAgIHRydWUsXG4gICAgYXR0cmlidXRlT2xkVmFsdWU6ICB0cnVlLFxuICB9KTtcblxuICBFbGVtZW50cy5wcm9jZXNzRWxlbWVudHMoZG9jdW1lbnQuaGVhZCk7XG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5ib2R5KTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJylcbiAgICAgIG9uRG9jdW1lbnRSZWFkeSgpO1xuICAgIGVsc2VcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbkRvY3VtZW50UmVhZHkpO1xuICB9LCAyNTApO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Eb2N1bWVudFJlYWR5KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==