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
    return _query_engine_js__WEBPACK_IMPORTED_MODULE_1__.QueryEngine.from.call(this, this.build(callback));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLDhCQUE4Qiw0REFBaUI7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBLG9DQUFvQyxZQUFZO0FBQ2hELE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTzs7QUFFUDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPOztBQUVQOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7Ozs7OztTQzFnQ0E7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTs7U0FFQTtTQUNBOztTQUVBO1NBQ0E7U0FDQTs7Ozs7VUN0QkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsZ0RBQWdEO0FBQ2hELHdFQUF3RTs7QUFFeEU7QUFDQTs7QUFFb0M7QUFDUztBQUNIOztBQUVOOztBQUVGO0FBQ1c7QUFDSDtBQUNIO0FBQ1U7QUFDVjs7QUFFdkMsMEJBQTBCLDREQUE0Qjs7QUFJcEQ7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRCw0QkFBNEIsc0NBQUs7QUFDakMsaUNBQWlDLDBDQUFVO0FBQzNDLCtCQUErQix5Q0FBUTtBQUN2Qyw4Q0FBOEMsa0RBQWlCO0FBQy9ELHFEQUFxRCx5REFBd0I7O0FBRTdFO0FBQ0EsU0FBUyxvREFBbUI7QUFDNUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDZEQUE2QixJQUFJLGlDQUFpQztBQUN4RTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLGlFQUFpQztBQUN6QztBQUNBLFNBQVM7QUFDVCxPQUFPLElBQUksVUFBVTs7QUFFckI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBLDJDQUEyQyx1RUFBc0M7QUFDakYsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLGlEQUFnQjtBQUN4QyxvQ0FBb0Msc0RBQXFCLGtCQUFrQixPQUFPLGtEQUFpQiw4QkFBOEI7O0FBRWpJO0FBQ0E7QUFDQSxxQkFBcUIsNERBQTRCO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLGdEQUFnRCxRQUFRO0FBQ3hEOztBQUVBLG1CQUFtQiw0REFBNEI7QUFDL0M7O0FBRUE7QUFDQSxZQUFZLHlEQUF3Qjs7QUFFcEMscUJBQXFCLDREQUE0QjtBQUNqRDtBQUNBOztBQUVBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxtQkFBbUIsNERBQTRCO0FBQy9DOztBQUVBLHFCQUFxQiw0REFBNEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUseURBQXdCO0FBQzFCLEVBQUUseURBQXdCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9lbGVtZW50cy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9teXRoaXgtdWktbGFuZ3VhZ2UtcHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXJlcXVpcmUuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLXNwaW5uZXIuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvcXVlcnktZW5naW5lLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3NoYTI1Ni5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwgc3ltYm9sKVxuXHRcdH0pXG5cdFx0OiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHR0cnkge1xuXHRcdHJldHVybiBwcm9wZXJ0eSBpbiBvYmplY3Rcblx0fSBjYXRjaChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcblx0cmV0dXJuIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuXHRcdCYmICEoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG5cdFx0XHQmJiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSkpIC8vIGFuZCBhbHNvIHVuc2FmZSBpZiB0aGV5J3JlIG5vbmVudW1lcmFibGUuXG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHZhciBkZXN0aW5hdGlvbiA9IHt9O1xuXHRpZiAob3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSB7XG5cdFx0Z2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG5cdGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZGVzdGluYXRpb25cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2U7XG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGlzTWVyZ2VhYmxlT2JqZWN0O1xuXHQvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG5cdC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cblx0b3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkO1xuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuXHR2YXIgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcblx0dmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59O1xuXG52YXIgZGVlcG1lcmdlXzEgPSBkZWVwbWVyZ2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXzE7XG4iLCJpbXBvcnQgKiBhcyBVdGlscyAgICAgICBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFF1ZXJ5RW5naW5lIH0gIGZyb20gJy4vcXVlcnktZW5naW5lLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzICAgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19BVFRSX01FVEhPRF9OQU1FICAgPSAvXmF0dHJcXCQoLiopJC87XG5jb25zdCBSRUdJU1RFUkVEX0NPTVBPTkVOVFMgPSBuZXcgU2V0KCk7XG5cbmV4cG9ydCBjb25zdCBpc015dGhpeENvbXBvbmVudCA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaXMtbXl0aGl4LWNvbXBvbmVudCcpO1xuZXhwb3J0IGNvbnN0IE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pbnRlcnNlY3Rpb24tb2JzZXJ2ZXJzJyk7XG5cbi8qKipcbiAqICBncm91cE5hbWU6IENvbXBvbmVudHNcbiAqICBkZXNjOiB8XG4gKiAgICBUaGlzIHRoZSBiYXNlIGNsYXNzIG9mIGFsbCBNeXRoaXggVUkgY29tcG9uZW50cy4gSXQgaW5oZXJpdHNcbiAqICAgIGZyb20gSFRNTEVsZW1lbnQsIGFuZCBzbyB3aWxsIGVuZCB1cCBiZWluZyBhIFtXZWIgQ29tcG9uZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpLlxuICpcbiAqICAgIEl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91IGZ1bGx5IHJlYWQgdXAgYW5kIHVuZGVyc3RhbmRcbiAqICAgIFtXZWIgQ29tcG9uZW50c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKVxuICogICAgaWYgeW91IGRvbid0IGFscmVhZHkgZnVsbHkgdW5kZXJzdGFuZCB0aGVtLiBUaGUgY29yZSBvZiBNeXRoaXggVUkgaXMgdGhlXG4gKiAgICBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKSBzdGFuZGFyZCxcbiAqICAgIHNvIHlvdSBtaWdodCBlbmQgdXAgYSBsaXR0bGUgY29uZnVzZWQgaWYgeW91IGRvbid0IGFscmVhZHkgdW5kZXJzdGFuZCB0aGUgZm91bmRhdGlvbi5cbiAqXG4gKiAgaW5zdGFuY2VQcm9wZXJ0aWVzOlxuICogICAgLSBjYXB0aW9uOiBcIi4uLiBIVE1MRWxlbWVudCBJbnN0YW5jZSBQcm9wZXJ0aWVzXCJcbiAqICAgICAgZGVzYzogXCJBbGwgW0hUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzKSBhcmUgaW5oZXJpdGVkIGZyb20gW0hUTUxFbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQpXCJcbiAqICAgICAgbGluazogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxFbGVtZW50I2luc3RhbmNlX3Byb3BlcnRpZXNcbiAqICAgIC0gbmFtZTogc2Vuc2l0aXZlVGFnTmFtZVxuICogICAgICBjYXB0aW9uOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgIGRlc2M6IHxcbiAqICAgICAgICBXb3JrcyBpZGVudGljYWxseSB0byBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSBmb3IgWE1MLCB3aGVyZSBjYXNlIGlzIHByZXNlcnZlZC5cbiAqICAgICAgICBJbiBIVE1MIHRoaXMgd29ya3MgbGlrZSBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSwgYnV0IGluc3RlYWQgb2YgdGhlIHJlc3VsdFxuICogICAgICAgIGFsd2F5cyBiZWluZyBVUFBFUkNBU0UsIHRoZSB0YWcgbmFtZSB3aWxsIGJlIHJldHVybmVkIHdpdGggdGhlIGNhc2luZyBwcmVzZXJ2ZWQuXG4qKiovXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBjb21waWxlU3R5bGVGb3JEb2N1bWVudCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50O1xuICBzdGF0aWMgcmVnaXN0ZXIgPSBmdW5jdGlvbihfbmFtZSwgX0tsYXNzKSB7XG4gICAgbGV0IG5hbWUgPSBfbmFtZSB8fCB0aGlzLnRhZ05hbWU7XG5cbiAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldChuYW1lKSkge1xuICAgICAgbGV0IEtsYXNzID0gX0tsYXNzIHx8IHRoaXM7XG4gICAgICBLbGFzcy5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBLbGFzcy5jb21waWxlQXR0cmlidXRlTWV0aG9kcyhLbGFzcyk7XG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgS2xhc3MpO1xuXG4gICAgICBsZXQgcmVnaXN0ZXJFdmVudCA9IG5ldyBFdmVudCgnbXl0aGl4LWNvbXBvbmVudC1yZWdpc3RlcmVkJyk7XG4gICAgICByZWdpc3RlckV2ZW50LmNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnQgPSBLbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVnaXN0ZXJFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgc3RhdGljIGNvbXBpbGVBdHRyaWJ1dGVNZXRob2RzID0gZnVuY3Rpb24oS2xhc3MpIHtcbiAgICBsZXQgcHJvdG8gPSBLbGFzcy5wcm90b3R5cGU7XG4gICAgbGV0IG5hbWVzID0gVXRpbHMuZ2V0QWxsUHJvcGVydHlOYW1lcyhwcm90bylcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IElTX0FUVFJfTUVUSE9EX05BTUUudGVzdChuYW1lKSlcbiAgICAgIC5tYXAoKG9yaWdpbmFsTmFtZSkgPT4ge1xuICAgICAgICBsZXQgbmFtZSA9IG9yaWdpbmFsTmFtZS5tYXRjaChJU19BVFRSX01FVEhPRF9OQU1FKVsxXTtcbiAgICAgICAgaWYgKFJFR0lTVEVSRURfQ09NUE9ORU5UUy5oYXMoS2xhc3MpKVxuICAgICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgICAgIGxldCBkZXNjcmlwdG9yID0gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihwcm90bywgb3JpZ2luYWxOYW1lKTtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgXCJ2YWx1ZVwiIHRoZW4gdGhlXG4gICAgICAgIC8vIHVzZXIgZGlkIGl0IHdyb25nLi4uIHNvIGp1c3RcbiAgICAgICAgLy8gbWFrZSB0aGlzIHRoZSBcInNldHRlclwiXG4gICAgICAgIGxldCBtZXRob2QgPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICBpZiAobWV0aG9kKVxuICAgICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgICAgIGxldCBvcmlnaW5hbEdldCA9IGRlc2NyaXB0b3IuZ2V0O1xuICAgICAgICBpZiAob3JpZ2luYWxHZXQpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm90bywge1xuICAgICAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZ2V0OiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlICA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ICAgICAgID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnZhbHVlID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEdldC5jYWxsKGNvbnRleHQsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNldDogICAgICAgICAgZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFV0aWxzLnRvU25ha2VDYXNlKG5hbWUpO1xuICAgICAgfSk7XG5cbiAgICBSRUdJU1RFUkVEX0NPTVBPTkVOVFMuYWRkKEtsYXNzKTtcblxuICAgIHJldHVybiBuYW1lcztcbiAgfTtcblxuICBzZXQgYXR0ciRkYXRhTXl0aGl4U3JjKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIG9uTXV0YXRpb25BZGRlZCgpIHt9XG4gIG9uTXV0YXRpb25SZW1vdmVkKCkge31cbiAgb25NdXRhdGlvbkNoaWxkQWRkZWQoKSB7fVxuICBvbk11dGF0aW9uQ2hpbGRSZW1vdmVkKCkge31cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW2lzTXl0aGl4Q29tcG9uZW50XToge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGlzTXl0aGl4Q29tcG9uZW50LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgLyosIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0qLyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHsgLy8gQHJlZjpzZW5zaXRpdmVUYWdOYW1lXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lELFxuICAgICAgfSxcbiAgICAgICdkZWxheVRpbWVycyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgICAnZG9jdW1lbnRJbml0aWFsaXplZCc6IHtcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsICdfbXl0aGl4VUlEb2N1bWVudEluaXRpYWxpemVkJyksXG4gICAgICAgIHNldDogICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgVXRpbHMubWV0YWRhdGEodGhpcy5jb25zdHJ1Y3RvciwgJ19teXRoaXhVSURvY3VtZW50SW5pdGlhbGl6ZWQnLCAhIXZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2hhZG93Jzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd0RPTSgpLFxuICAgICAgfSxcbiAgICAgICd0ZW1wbGF0ZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGF0dHIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIGluamVjdFN0eWxlU2hlZXQoY29udGVudCkge1xuICAgIGxldCBzdHlsZUlEICAgICAgID0gYElEU1RZTEUke1V0aWxzLlNIQTI1NihgJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9OiR7Y29udGVudH1gKX1gO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBzdHlsZUVsZW1lbnQgID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCk7XG5cbiAgICBpZiAoc3R5bGVFbGVtZW50KVxuICAgICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcblxuICAgIHN0eWxlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cbiAgICByZXR1cm4gc3R5bGVFbGVtZW50O1xuICB9XG5cbiAgcHJvY2Vzc0VsZW1lbnRzKG5vZGUsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoIW9wdGlvbnMuc2NvcGUpXG4gICAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZTogdGhpcy4kJCB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldFBhcmVudE5vZGUoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmdldFBhcmVudE5vZGUodGhpcyk7XG4gIH1cblxuICBhdHRhY2hTaGFkb3cob3B0aW9ucykge1xuICAgIC8vIENoZWNrIGVudmlyb25tZW50IHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIHN1cGVyLmF0dGFjaFNoYWRvdyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucyk7XG4gICAgVXRpbHMubWV0YWRhdGEoc2hhZG93LCBVdGlscy5NWVRISVhfU0hBRE9XX1BBUkVOVCwgdGhpcyk7XG5cbiAgICByZXR1cm4gc2hhZG93O1xuICB9XG5cbiAgY3JlYXRlU2hhZG93RE9NKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicsIC4uLihvcHRpb25zIHx8IHt9KSB9KTtcbiAgfVxuXG4gIG1lcmdlQ2hpbGRyZW4odGFyZ2V0LCAuLi5vdGhlcnMpIHtcbiAgICByZXR1cm4gRWxlbWVudHMubWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycyk7XG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZShuYW1lT3JJRCkge1xuICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKG5hbWVPcklEKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVPcklEKTtcbiAgICAgIGlmICghcmVzdWx0KVxuICAgICAgICByZXN1bHQgPSB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke25hbWVPcklEfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHtuYW1lT3JJRH1cIiBpXWApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mb3JdJyk7XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIEFycmF5LmZyb20oZWxlbWVudHMpKSB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgIGlmIChVdGlscy5pc05PRShzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2hlcyhzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTShfdGVtcGxhdGUpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gX3RlbXBsYXRlIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICBlbnN1cmVEb2N1bWVudFN0eWxlcy5jYWxsKHRoaXMsIHRoaXMub3duZXJEb2N1bWVudCwgdGhpcy5zZW5zaXRpdmVUYWdOYW1lLCB0ZW1wbGF0ZSk7XG5cbiAgICAgIGxldCBmb3JtYXR0ZWRUZW1wbGF0ZSA9IHRoaXMucHJvY2Vzc0VsZW1lbnRzKHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIHRoaXMuc2hhZG93LmFwcGVuZENoaWxkKGZvcm1hdHRlZFRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWUnLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuXG4gICAgdGhpcy5hcHBlbmRFeHRlcm5hbFRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5hcHBlbmRUZW1wbGF0ZVRvU2hhZG93RE9NKCk7XG4gICAgdGhpcy5wcm9jZXNzRWxlbWVudHModGhpcyk7XG5cbiAgICB0aGlzLm1vdW50ZWQoKTtcblxuICAgIHRoaXMuZG9jdW1lbnRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBVdGlscy5uZXh0VGljaygoKSA9PiB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51bm1vdW50ZWQoKTtcbiAgfVxuXG4gIGF3YWl0RmV0Y2hTcmNPblZpc2libGUobmV3U3JjKSB7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci51bm9ic2VydmUodGhpcyk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFuZXdTcmMpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgb2JzZXJ2ZXIgPSB2aXNpYmlsaXR5T2JzZXJ2ZXIoKHsgd2FzVmlzaWJsZSwgZGlzY29ubmVjdCB9KSA9PiB7XG4gICAgICBpZiAoIXdhc1Zpc2libGUpXG4gICAgICAgIHRoaXMuZmV0Y2hTcmModGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LXNyYycpKTtcblxuICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG51bGw7XG4gICAgfSwgeyBlbGVtZW50czogWyB0aGlzIF0gfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndmlzaWJpbGl0eU9ic2VydmVyJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvYnNlcnZlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIGxldCBbXG4gICAgICBuYW1lLFxuICAgICAgb2xkVmFsdWUsXG4gICAgICBuZXdWYWx1ZSxcbiAgICBdID0gYXJncztcblxuICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGxldCBtYWdpY05hbWUgICA9IGBhdHRyJCR7VXRpbHMudG9DYW1lbENhc2UobmFtZSl9YDtcbiAgICAgIGxldCBkZXNjcmlwdG9yICA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4odGhpcywgbWFnaWNOYW1lKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBDYWxsIHNldHRlclxuICAgICAgICB0aGlzW21hZ2ljTmFtZV0gPSBbIGFyZ3NbMl0sIGFyZ3NbMV0gXS5jb25jYXQoYXJncy5zbGljZSgzKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKC4uLmFyZ3MpO1xuICB9XG5cbiAgYWRvcHRlZENhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hZG9wdGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbW91bnRlZCgpIHt9XG4gIHVubW91bnRlZCgpIHt9XG4gIGF0dHJpYnV0ZUNoYW5nZWQoKSB7fVxuICBhZG9wdGVkKCkge31cblxuICBnZXQgJCQoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmNyZWF0ZVNjb3BlKHRoaXMpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggICAgPSAwO1xuICAgIGxldCBvcHRpb25zICAgICA9IChVdGlscy5pc1BsYWluT2JqZWN0KGFyZ3NbYXJnSW5kZXhdKSkgPyBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGFyZ3NbYXJnSW5kZXgrK10pIDoge307XG4gICAgbGV0IHF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmUuZnJvbS5jYWxsKHRoaXMsIHsgcm9vdDogdGhpcywgLi4ub3B0aW9ucywgaW52b2tlQ2FsbGJhY2tzOiBmYWxzZSB9LCAuLi5hcmdzLnNsaWNlKGFyZ0luZGV4KSk7XG4gICAgbGV0IHNoYWRvd05vZGVzO1xuXG4gICAgb3B0aW9ucyA9IHF1ZXJ5RW5naW5lLmdldE9wdGlvbnMoKTtcblxuICAgIGlmIChvcHRpb25zLnNoYWRvdyAhPT0gZmFsc2UgJiYgb3B0aW9ucy5zZWxlY3RvciAmJiBvcHRpb25zLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgIHNoYWRvd05vZGVzID0gQXJyYXkuZnJvbShcbiAgICAgICAgUXVlcnlFbmdpbmUuZnJvbS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgeyByb290OiB0aGlzLnNoYWRvdyB9LFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0b3IsXG4gICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayxcbiAgICAgICAgKS52YWx1ZXMoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRvd05vZGVzKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5hZGQoc2hhZG93Tm9kZXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2xvdHRlZCAhPT0gdHJ1ZSlcbiAgICAgIHF1ZXJ5RW5naW5lID0gcXVlcnlFbmdpbmUuc2xvdHRlZChmYWxzZSk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QocXVlcnlFbmdpbmUubWFwKG9wdGlvbnMuY2FsbGJhY2spKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfVxuXG4gIGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdCA9IFsgY2FsbGJhY2soRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwge30pIF0uZmxhdChJbmZpbml0eSkubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtW0VsZW1lbnRzLlVORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgIHJldHVybiBpdGVtKCk7XG5cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogbmV3IEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uKCcjZnJhZ21lbnQnLCB7fSwgcmVzdWx0KTtcbiAgfVxuXG4gICRidWlsZChjYWxsYmFjaykge1xuICAgIHJldHVybiBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgdGhpcy5idWlsZChjYWxsYmFjaykpO1xuICB9XG5cbiAgaXNBdHRyaWJ1dGVUcnV0aHkobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldElkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IFV0aWxzLnRvQ2FtZWxDYXNlKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gIH1cblxuICBtZXRhZGF0YShrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIFV0aWxzLm1ldGFkYXRhKHRoaXMsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgZHluYW1pY1Byb3AobmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIsIF9jb250ZXh0KSB7XG4gICAgcmV0dXJuIFV0aWxzLmR5bmFtaWNQcm9wLmNhbGwoX2NvbnRleHQgfHwgdGhpcywgbmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIpO1xuICB9XG5cbiAgZHluYW1pY0RhdGEob2JqKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGxldCBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIFV0aWxzLmR5bmFtaWNQcm9wLmNhbGwoZGF0YSwga2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBkZWJvdW5jZShjYWxsYmFjaywgbXMsIF9pZCkge1xuICAgIHZhciBpZCA9IF9pZDtcblxuICAgIC8vIElmIHdlIGRvbid0IGdldCBhbiBpZCBmcm9tIHRoZSB1c2VyLCB0aGVuIGd1ZXNzIHRoZSBpZCBieSB0dXJuaW5nIHRoZSBmdW5jdGlvblxuICAgIC8vIGludG8gYSBzdHJpbmcgKHJhdyBzb3VyY2UpIGFuZCB1c2UgdGhhdCBmb3IgYW4gaWQgaW5zdGVhZFxuICAgIGlmIChpZCA9PSBudWxsKSB7XG4gICAgICBpZCA9ICgnJyArIGNhbGxiYWNrKTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhIHRyYW5zcGlsZWQgY29kZSwgdGhlbiBhbiBhc3luYyBnZW5lcmF0b3Igd2lsbCBiZSB1c2VkIGZvciBhc3luYyBmdW5jdGlvbnNcbiAgICAgIC8vIFRoaXMgd3JhcHMgdGhlIHJlYWwgZnVuY3Rpb24sIGFuZCBzbyB3aGVuIGNvbnZlcnRpbmcgdGhlIGZ1bmN0aW9uIGludG8gYSBzdHJpbmdcbiAgICAgIC8vIGl0IHdpbGwgTk9UIGJlIHVuaXF1ZSBwZXIgY2FsbC1zaXRlLiBGb3IgdGhpcyByZWFzb24sIGlmIHdlIGRldGVjdCB0aGlzIGlzc3VlLFxuICAgICAgLy8gd2Ugd2lsbCBnbyB0aGUgXCJzbG93XCIgcm91dGUgYW5kIGNyZWF0ZSBhIHN0YWNrIHRyYWNlLCBhbmQgdXNlIHRoYXQgZm9yIHRoZSB1bmlxdWUgaWRcbiAgICAgIGlmIChpZC5tYXRjaCgvYXN5bmNHZW5lcmF0b3JTdGVwLykpIHtcbiAgICAgICAgaWQgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgICAgICBjb25zb2xlLndhcm4oJ215dGhpeC11aSB3YXJuaW5nOiBcInRoaXMuZGVsYXlcIiBjYWxsZWQgd2l0aG91dCBhIHNwZWNpZmllZCBcImlkXCIgcGFyYW1ldGVyLiBUaGlzIHdpbGwgcmVzdWx0IGluIGEgcGVyZm9ybWFuY2UgaGl0LiBQbGVhc2Ugc3BlY2lmeSBhbmQgXCJpZFwiIGFyZ3VtZW50IGZvciB5b3VyIGNhbGw6IFwidGhpcy5kZWxheShjYWxsYmFjaywgbXMsIFxcJ3NvbWUtY3VzdG9tLWNhbGwtc2l0ZS1pZFxcJylcIicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZCA9ICgnJyArIGlkKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuZGVsYXlUaW1lcnMuZ2V0KGlkKTtcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UudGltZXJJRClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHByb21pc2UudGltZXJJRCk7XG5cbiAgICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcbiAgICB9XG5cbiAgICBwcm9taXNlID0gVXRpbHMuY3JlYXRlUmVzb2x2YWJsZSgpO1xuICAgIHRoaXMuZGVsYXlUaW1lcnMuc2V0KGlkLCBwcm9taXNlKTtcblxuICAgIC8vIExldCdzIG5vdCBjb21wbGFpbiBhYm91dFxuICAgIC8vIHVuY2F1Z2h0IGVycm9yc1xuICAgIHByb21pc2UuY2F0Y2goKCkgPT4ge30pO1xuXG4gICAgcHJvbWlzZS50aW1lcklEID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbmNvdW50ZXJlZCB3aGlsZSBjYWxsaW5nIFwiZGVsYXlcIiBjYWxsYmFjazogJywgZXJyb3IsIGNhbGxiYWNrLnRvU3RyaW5nKCkpO1xuICAgICAgICBwcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgfSwgbXMgfHwgMCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNsYXNzZXMoLi4uX2FyZ3MpIHtcbiAgICBsZXQgYXJncyA9IF9hcmdzLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnU3RyaW5nJykpXG4gICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QoaXRlbSkpIHtcbiAgICAgICAgbGV0IGtleXMgID0gT2JqZWN0LmtleXMoaXRlbSk7XG4gICAgICAgIGxldCBpdGVtcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgIGxldCBrZXkgICA9IGtleXNbaV07XG4gICAgICAgICAgbGV0IHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgIGl0ZW1zLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSkuZmxhdChJbmZpbml0eSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhcmdzKSkuam9pbignICcpO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hTcmMoc3JjVVJMKSB7XG4gICAgaWYgKCFzcmNVUkwpXG4gICAgICByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbG9hZFBhcnRpYWxJbnRvRWxlbWVudC5jYWxsKHRoaXMsIHNyY1VSTCk7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ215dGhpeC1yZWFkeScpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIiR7dGhpcy5zZW5zaXRpdmVUYWdOYW1lfVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjVVJMfSAocmVzb2x2ZWQgdG86ICR7ZXJyb3IudXJsfSlgLCBlcnJvcik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZGVudGlmaWVyKHRhcmdldCkge1xuICBpZiAoIXRhcmdldClcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKHR5cGVvZiB0YXJnZXQuZ2V0SWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdGFyZ2V0LmdldElkZW50aWZpZXIuY2FsbCh0YXJnZXQpO1xuXG4gIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KVxuICAgIHJldHVybiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKSB8fCBVdGlscy50b0NhbWVsQ2FzZSh0YXJnZXQubG9jYWxOYW1lKTtcblxuICByZXR1cm4gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFydWxlLnNlbGVjdG9yVGV4dClcbiAgICByZXR1cm4gcnVsZS5jc3NUZXh0O1xuXG4gIGxldCBfYm9keSAgID0gcnVsZS5jc3NUZXh0LnN1YnN0cmluZyhydWxlLnNlbGVjdG9yVGV4dC5sZW5ndGgpLnRyaW0oKTtcbiAgbGV0IHJlc3VsdCAgPSAoY2FsbGJhY2socnVsZS5zZWxlY3RvclRleHQsIF9ib2R5KSB8fCBbXSkuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAoIXJlc3VsdClcbiAgICByZXR1cm4gJyc7XG5cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGNzc1J1bGVzVG9Tb3VyY2UoY3NzUnVsZXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGNzc1J1bGVzIHx8IFtdKS5tYXAoKHJ1bGUpID0+IHtcbiAgICBsZXQgcnVsZVN0ciA9IGZvcm1hdFJ1bGVTZXQocnVsZSwgY2FsbGJhY2spO1xuICAgIHJldHVybiBgJHtjc3NSdWxlc1RvU291cmNlKHJ1bGUuY3NzUnVsZXMsIGNhbGxiYWNrKX0ke3J1bGVTdHJ9YDtcbiAgfSkuam9pbignXFxuXFxuJyk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGVsZW1lbnROYW1lLCBzdHlsZUVsZW1lbnQpIHtcbiAgY29uc3QgaGFuZGxlSG9zdCA9IChtLCB0eXBlLCBfY29udGVudCkgPT4ge1xuICAgIGxldCBjb250ZW50ID0gKCFfY29udGVudCkgPyBfY29udGVudCA6IF9jb250ZW50LnJlcGxhY2UoL15cXCgvLCAnJykucmVwbGFjZSgvXFwpJC8sICcnKTtcblxuICAgIGlmICh0eXBlID09PSAnOmhvc3QnKSB7XG4gICAgICBpZiAoIWNvbnRlbnQpXG4gICAgICAgIHJldHVybiBlbGVtZW50TmFtZTtcblxuICAgICAgLy8gRWxlbWVudCBzZWxlY3Rvcj9cbiAgICAgIGlmICgoL15bYS16QS1aX10vKS50ZXN0KGNvbnRlbnQpKVxuICAgICAgICByZXR1cm4gYCR7Y29udGVudH1bZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiXWA7XG5cbiAgICAgIHJldHVybiBgJHtlbGVtZW50TmFtZX0ke2NvbnRlbnR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbnRlbnR9ICR7ZWxlbWVudE5hbWV9YDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGNzc1J1bGVzVG9Tb3VyY2UoXG4gICAgc3R5bGVFbGVtZW50LnNoZWV0LmNzc1J1bGVzLFxuICAgIChfc2VsZWN0b3IsIGJvZHkpID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IF9zZWxlY3RvcjtcbiAgICAgIGxldCB0YWdzICAgICA9IFtdO1xuXG4gICAgICBsZXQgdXBkYXRlZFNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFsnXCJdKSg/OlxcXFwufFteXFwxXSkrP1xcMS8sIChtKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhZ3MubGVuZ3RoO1xuICAgICAgICB0YWdzLnB1c2gobSk7XG4gICAgICAgIHJldHVybiBgQEBAVEFHWyR7aW5kZXh9XUBAQGA7XG4gICAgICB9KS5zcGxpdCgnLCcpLm1hcCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmaWVkID0gc2VsZWN0b3IucmVwbGFjZSgvKDpob3N0KD86LWNvbnRleHQpPykoXFwoXFxzKlteKV0rP1xccypcXCkpPy8sIGhhbmRsZUhvc3QpO1xuICAgICAgICByZXR1cm4gKG1vZGlmaWVkID09PSBzZWxlY3RvcikgPyBudWxsIDogbW9kaWZpZWQ7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpLnJlcGxhY2UoL0BAQFRBR1xcWyhcXGQrKVxcXUBAQC8sIChtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGFnc1sraW5kZXhdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghdXBkYXRlZFNlbGVjdG9yKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHJldHVybiBbIHVwZGF0ZWRTZWxlY3RvciwgYm9keSBdO1xuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVEb2N1bWVudFN0eWxlcyhvd25lckRvY3VtZW50LCBjb21wb25lbnROYW1lLCB0ZW1wbGF0ZSkge1xuICBsZXQgb2JqSUQgICAgICAgICAgICAgPSBVdGlscy5nZXRPYmpJRCh0ZW1wbGF0ZSk7XG4gIGxldCB0ZW1wbGF0ZUlEICAgICAgICA9IFV0aWxzLlNIQTI1NihvYmpJRCk7XG4gIGxldCB0ZW1wbGF0ZUNoaWxkcmVuICA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzKTtcbiAgbGV0IGluZGV4ICAgICAgICAgICAgID0gMDtcblxuICBmb3IgKGxldCB0ZW1wbGF0ZUNoaWxkIG9mIHRlbXBsYXRlQ2hpbGRyZW4pIHtcbiAgICBpZiAoISgvXnN0eWxlJC9pKS50ZXN0KHRlbXBsYXRlQ2hpbGQudGFnTmFtZSkpXG4gICAgICBjb250aW51ZTtcblxuICAgIGxldCBzdHlsZUlEID0gYElEU1RZTEUke3RlbXBsYXRlSUR9JHsrK2luZGV4fWA7XG4gICAgaWYgKCFvd25lckRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3Rvcihgc3R5bGUjJHtzdHlsZUlEfWApKSB7XG4gICAgICBsZXQgY2xvbmVkU3R5bGVFbGVtZW50ID0gdGVtcGxhdGVDaGlsZC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBvd25lckRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuICAgICAgbGV0IG5ld1N0eWxlU2hlZXQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudChjb21wb25lbnROYW1lLCBjbG9uZWRTdHlsZUVsZW1lbnQpO1xuICAgICAgb3duZXJEb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGNsb25lZFN0eWxlRWxlbWVudCk7XG5cbiAgICAgIGxldCBzdHlsZU5vZGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZUlEKTtcbiAgICAgIHN0eWxlTm9kZS5pbm5lckhUTUwgPSBuZXdTdHlsZVNoZWV0O1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4oc3RhcnRQcm90bywgZGVzY3JpcHRvck5hbWUpIHtcbiAgbGV0IHRoaXNQcm90byA9IHN0YXJ0UHJvdG87XG4gIGxldCBkZXNjcmlwdG9yO1xuXG4gIHdoaWxlICh0aGlzUHJvdG8gJiYgIShkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzUHJvdG8sIGRlc2NyaXB0b3JOYW1lKSkpXG4gICAgdGhpc1Byb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXNQcm90byk7XG5cbiAgcmV0dXJuIGRlc2NyaXB0b3I7XG59XG5cbmNvbnN0IFNDSEVNRV9SRSAgICAgPSAvXltcXHctXSs6XFwvXFwvLztcbmNvbnN0IEhBU19GSUxFTkFNRSAgPSAvXFwuW14vLl0rJC87XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVVJMKHJvb3RMb2NhdGlvbiwgX3VybGlzaCwgbWFnaWMpIHtcbiAgbGV0IHVybGlzaCA9IF91cmxpc2g7XG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBVUkwpXG4gICAgcmV0dXJuIHVybGlzaDtcblxuICBpZiAoIXVybGlzaClcbiAgICByZXR1cm4gbmV3IFVSTChyb290TG9jYXRpb24pO1xuXG4gIGlmICh1cmxpc2ggaW5zdGFuY2VvZiBMb2NhdGlvbilcbiAgICByZXR1cm4gbmV3IFVSTCh1cmxpc2gpO1xuXG4gIGlmICghVXRpbHMuaXNUeXBlKHVybGlzaCwgJ1N0cmluZycpKVxuICAgIHJldHVybjtcblxuICBjb25zdCBpbnRlcm5hbFJlc29sdmUgPSAoX2xvY2F0aW9uLCBfdXJsUGFydCwgbWFnaWMpID0+IHtcbiAgICBsZXQgb3JpZ2luYWxVUkwgPSB1cmxpc2g7XG4gICAgaWYgKFNDSEVNRV9SRS50ZXN0KHVybGlzaCkpXG4gICAgICByZXR1cm4geyB1cmw6IG5ldyBVUkwodXJsaXNoKSwgb3JpZ2luYWxVUkw6IHVybGlzaCB9O1xuXG4gICAgLy8gTWFnaWMhXG4gICAgaWYgKG1hZ2ljID09PSB0cnVlICYmICFIQVNfRklMRU5BTUUudGVzdCh1cmxpc2gpKSB7XG4gICAgICBsZXQgcGFydHMgICAgID0gdXJsaXNoLnNwbGl0KCcvJykubWFwKChwYXJ0KSA9PiBwYXJ0LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgbGV0IGxhc3RQYXJ0ICA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGxhc3RQYXJ0KVxuICAgICAgICB1cmxpc2ggPSBgJHt1cmxpc2gucmVwbGFjZSgvXFwvKyQvLCAnJyl9LyR7bGFzdFBhcnR9Lmh0bWxgO1xuICAgIH1cblxuICAgIGxldCBsb2NhdGlvbiA9IG5ldyBVUkwoX2xvY2F0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBuZXcgVVJMKGAke2xvY2F0aW9uLm9yaWdpbn0ke2xvY2F0aW9uLnBhdGhuYW1lfSR7dXJsaXNofWAucmVwbGFjZSgvXFwvezIsfS9nLCAnLycpKSxcbiAgICAgIG9yaWdpbmFsVVJMLFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgb3JpZ2luYWxVUkwsXG4gIH0gPSBpbnRlcm5hbFJlc29sdmUocm9vdExvY2F0aW9uLCB1cmxpc2gudG9TdHJpbmcoKSwgbWFnaWMpO1xuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCBmaWxlTmFtZTtcbiAgICBsZXQgcGF0aDtcblxuICAgIHVybC5wYXRobmFtZS5yZXBsYWNlKC9eKC4qXFwvKShbXi9dKykkLywgKG0sIGZpcnN0LCBzZWNvbmQpID0+IHtcbiAgICAgIHBhdGggPSBmaXJzdC5yZXBsYWNlKC9cXC8rJC8sICcvJyk7XG4gICAgICBpZiAocGF0aC5jaGFyQXQocGF0aC5sZW5ndGggLSAxKSAhPT0gJy8nKVxuICAgICAgICBwYXRoID0gYCR7cGF0aH0vYDtcblxuICAgICAgZmlsZU5hbWUgPSBzZWNvbmQ7XG4gICAgICByZXR1cm4gbTtcbiAgICB9KTtcblxuICAgIGxldCBuZXdTcmMgPSBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyLmNhbGwodGhpcywgeyBzcmM6IG9yaWdpbmFsVVJMLCB1cmwsIHBhdGgsIGZpbGVOYW1lIH0pO1xuICAgIGlmIChuZXdTcmMgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LXJlcXVpcmVcIjogTm90IGxvYWRpbmcgXCIke29yaWdpbmFsVVJMfVwiIGJlY2F1c2UgdGhlIGdsb2JhbCBcIm15dGhpeFVJLnVybFJlc29sdmVyXCIgcmVxdWVzdGVkIEkgbm90IGRvIHNvLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdTcmMgIT09IG9yaWdpbmFsVVJMKVxuICAgICAgdXJsID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIHJvb3RMb2NhdGlvbiwgbmV3U3JjLCBtYWdpYyk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG5jb25zdCBJU19URU1QTEFURSAgICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgSVNfU0NSSVBUICAgICAgICAgICA9IC9eKHNjcmlwdCkkL2k7XG5jb25zdCBSRVFVSVJFX0NBQ0hFICAgICAgID0gbmV3IE1hcCgpO1xuY29uc3QgUkVTT0xWRV9TUkNfRUxFTUVOVCA9IC9ec2NyaXB0fGxpbmt8c3R5bGV8bXl0aGl4LWxhbmd1YWdlLXBhY2t8bXl0aGl4LXJlcXVpcmUkL2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBsb2NhdGlvbiwgX3VybCwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBmaWxlTmFtZTtcbiAgbGV0IGJhc2VVUkwgICA9IG5ldyBVUkwoYCR7dXJsLm9yaWdpbn0ke3VybC5wYXRobmFtZS5yZXBsYWNlKC9bXi9dKyQvLCAobSkgPT4ge1xuICAgIGZpbGVOYW1lID0gbTtcbiAgICByZXR1cm4gJyc7XG4gIH0pfSR7dXJsLnNlYXJjaH0ke3VybC5oYXNofWApO1xuXG4gIGxldCB0ZW1wbGF0ZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlU3RyaW5nO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCB4ID0gYS50YWdOYW1lO1xuICAgIGxldCB5ID0gYi50YWdOYW1lO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuICAgIGlmICh4ID09IHkpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHJldHVybiAoeCA8IHkpID8gMSA6IC0xO1xuICB9KTtcblxuICBjb25zdCBmaWxlTmFtZVRvRWxlbWVudE5hbWUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICByZXR1cm4gZmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLi4qJC8sICcnKS5yZXBsYWNlKC9cXGJbQS1aXXxbXkEtWl1bQS1aXS9nLCAoX20pID0+IHtcbiAgICAgIGxldCBtID0gX20udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiAobS5sZW5ndGggPCAyKSA/IGAtJHttfWAgOiBgJHttLmNoYXJBdCgwKX0tJHttLmNoYXJBdCgxKX1gO1xuICAgIH0pLnJlcGxhY2UoLy17Mix9L2csICctJykucmVwbGFjZSgvXlteYS16XSovLCAnJykucmVwbGFjZSgvW15hLXpdKiQvLCAnJyk7XG4gIH07XG5cbiAgbGV0IGd1ZXNzZWRFbGVtZW50TmFtZSAgPSBmaWxlTmFtZVRvRWxlbWVudE5hbWUoZmlsZU5hbWUpO1xuICBsZXQgY29udGV4dCAgICAgICAgICAgICA9IHtcbiAgICBndWVzc2VkRWxlbWVudE5hbWUsXG4gICAgY2hpbGRyZW4sXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB0ZW1wbGF0ZSxcbiAgICB1cmwsXG4gICAgYmFzZVVSTCxcbiAgICBmaWxlTmFtZSxcbiAgfTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMucHJlUHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucHJlUHJvY2Vzcy5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKTtcbiAgfVxuXG4gIGxldCBub2RlSGFuZGxlciAgID0gb3B0aW9ucy5ub2RlSGFuZGxlcjtcbiAgbGV0IHRlbXBsYXRlQ291bnQgPSBjaGlsZHJlbi5yZWR1Y2UoKHN1bSwgZWxlbWVudCkgPT4gKChJU19URU1QTEFURS50ZXN0KGVsZW1lbnQudGFnTmFtZSkpID8gKHN1bSArIDEpIDogc3VtKSwgMCk7XG5cbiAgY29udGV4dC50ZW1wbGF0ZUNvdW50ID0gdGVtcGxhdGVDb3VudDtcblxuICBjb25zdCByZXNvbHZlRWxlbWVudFNyY0F0dHJpYnV0ZSA9IChlbGVtZW50LCBiYXNlVVJMKSA9PiB7XG4gICAgLy8gUmVzb2x2ZSBcInNyY1wiIGF0dHJpYnV0ZSwgc2luY2Ugd2UgYXJlXG4gICAgLy8gZ29pbmcgdG8gYmUgbW92aW5nIHRoZSBlbGVtZW50IGFyb3VuZFxuICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgaWYgKHNyYykge1xuICAgICAgc3JjID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGJhc2VVUkwsIHNyYywgZmFsc2UpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChvcHRpb25zLm1hZ2ljICYmIFJFU09MVkVfU1JDX0VMRU1FTlQudGVzdChjaGlsZC5sb2NhbE5hbWUpKVxuICAgICAgY2hpbGQgPSByZXNvbHZlRWxlbWVudFNyY0F0dHJpYnV0ZShjaGlsZCwgYmFzZVVSTCk7XG5cbiAgICBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICBpZiAodGVtcGxhdGVDb3VudCA9PT0gMSAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgPT0gbnVsbCAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiIGldYCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmIChJU19TQ1JJUFQudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8c2NyaXB0PlxuICAgICAgbGV0IGNoaWxkQ2xvbmUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY2hpbGQudGFnTmFtZSk7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIG9mIGNoaWxkLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGNoaWxkLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSk7XG5cbiAgICAgIGxldCBzcmMgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgaWYgKHNyYykge1xuICAgICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBgSUQke1V0aWxzLlNIQTI1NihgJHtndWVzc2VkRWxlbWVudE5hbWV9OiR7Y2hpbGRDbG9uZS5pbm5lckhUTUx9YCl9YDtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdCMke3N0eWxlSUR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKCgvXihsaW5rfHN0eWxlKSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8bGluaz4gJiA8c3R5bGU+XG4gICAgICBsZXQgaXNTdHlsZSA9ICgvXnN0eWxlJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU3R5bGUsIGlzTGluazogIWlzU3R5bGUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgaWQgPSBgSUQke1V0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxtZXRhPlxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc01ldGE6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KTtcblxuICAgICAgLy8gZG8gbm90aGluZyB3aXRoIHRoZXNlIHRhZ3NcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7IC8vIEV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgbGV0IGlzSGFuZGxlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICAgIGxldCBsYW5nUGFja0lEID0gYElEJHtVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke2NoaWxkLm91dGVySFRNTH1gKX1gO1xuICAgICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgbGFuZ1BhY2tJRCk7XG5cbiAgICAgICAgbGV0IGxhbmd1YWdlUHJvdmlkZXIgPSB0aGlzLmNsb3Nlc3QoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgICAgICBpZiAoIWxhbmd1YWdlUHJvdmlkZXIpXG4gICAgICAgICAgbGFuZ3VhZ2VQcm92aWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuXG4gICAgICAgIGlmIChsYW5ndWFnZVByb3ZpZGVyKSB7XG4gICAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyLnF1ZXJ5U2VsZWN0b3IoYG15dGhpeC1sYW5ndWFnZS1wYWNrIyR7bGFuZ1BhY2tJRH1gKSlcbiAgICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIuaW5zZXJ0QmVmb3JlKGNoaWxkLCBsYW5ndWFnZVByb3ZpZGVyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgICAgaXNIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBlbHNlIGRvIG5vdGhpbmcuLi4gbGV0IGl0IGJlIGR1bXBlZCBpbnRvIHRoZSBkb20gbGF0ZXJcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc0hhbmRsZWQgfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnBvc3RQcm9jZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGVtcGxhdGUgPSBjb250ZXh0LnRlbXBsYXRlID0gb3B0aW9ucy5wb3N0UHJvY2Vzcy5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZSh1cmxPck5hbWUsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBvd25lckRvY3VtZW50ID0gb3B0aW9ucy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICBsZXQgdXJsICAgICAgICAgICA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmxvY2F0aW9uLCB1cmxPck5hbWUsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgY2FjaGVLZXk7XG5cbiAgaWYgKCEoL14oZmFsc2V8bm8tc3RvcmV8cmVsb2FkfG5vLWNhY2hlKSQvKS50ZXN0KHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdjYWNoZScpKSkge1xuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGVQYXJhbXMnKSAhPT0gJ3RydWUnKSB7XG4gICAgICBsZXQgY2FjaGVLZXlVUkwgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWV9YCk7XG4gICAgICBjYWNoZUtleSA9IGNhY2hlS2V5VVJMLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhY2hlS2V5ID0gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbGV0IGNhY2hlZFJlc3BvbnNlID0gUkVRVUlSRV9DQUNIRS5nZXQoY2FjaGVLZXkpO1xuICAgIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgY2FjaGVkUmVzcG9uc2UgPSBhd2FpdCBjYWNoZWRSZXNwb25zZTtcbiAgICAgIGlmIChjYWNoZWRSZXNwb25zZS5yZXNwb25zZSAmJiBjYWNoZWRSZXNwb25zZS5yZXNwb25zZS5vaylcbiAgICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZTogY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogdHJ1ZSB9O1xuICAgIH1cbiAgfVxuXG4gIGxldCBwcm9taXNlID0gZ2xvYmFsVGhpcy5mZXRjaCh1cmwsIG9wdGlvbnMuZmV0Y2hPcHRpb25zKS50aGVuKFxuICAgIGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgICAgUkVRVUlSRV9DQUNIRS5kZWxldGUoY2FjaGVLZXkpO1xuXG4gICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihgJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICByZXNwb25zZS50ZXh0ID0gYXN5bmMgKCkgPT4gYm9keTtcbiAgICAgIHJlc3BvbnNlLmpzb24gPSBhc3luYyAoKSA9PiBKU09OLnBhcnNlKGJvZHkpO1xuXG4gICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IGZhbHNlIH07XG4gICAgfSxcbiAgICAoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZyb20gTXl0aGl4IFVJIFwicmVxdWlyZVwiOiAnLCBlcnJvcik7XG5cbiAgICAgIGlmIChjYWNoZUtleSlcbiAgICAgICAgUkVRVUlSRV9DQUNIRS5kZWxldGUoY2FjaGVLZXkpO1xuXG4gICAgICBlcnJvci51cmwgPSB1cmw7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9LFxuICApO1xuXG4gIFJFUVVJUkVfQ0FDSEUuc2V0KGNhY2hlS2V5LCBwcm9taXNlKTtcblxuICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQoc3JjLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gIGxldCB7XG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB1cmwsXG4gICAgcmVzcG9uc2UsXG4gIH0gPSBhd2FpdCByZXF1aXJlLmNhbGwoXG4gICAgdGhpcyxcbiAgICBzcmMsXG4gICAge1xuICAgICAgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgIH0sXG4gICk7XG5cbiAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5jaGlsZE5vZGVzWzBdKTtcblxuICBsZXQgc2NvcGVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgdXJsLnNlYXJjaFBhcmFtcy5lbnRyaWVzKCkpXG4gICAgc2NvcGVEYXRhW2tleV0gPSBVdGlscy5jb2VyY2UodmFsdWUpO1xuXG4gIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICB0aGlzLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICB1cmwsXG4gICAgYm9keSxcbiAgICB7XG4gICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkLCBpc1RlbXBsYXRlIH0pID0+IHtcbiAgICAgICAgaWYgKChpc1RlbXBsYXRlIHx8ICFpc0hhbmRsZWQpICYmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzLmNhbGwoXG4gICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShzY29wZURhdGEsIG9wdGlvbnMuc2NvcGUpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpYmlsaXR5T2JzZXJ2ZXIoY2FsbGJhY2ssIF9vcHRpb25zKSB7XG4gIGNvbnN0IGludGVyc2VjdGlvbkNhbGxiYWNrID0gKGVudHJpZXMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbnRyeSAgID0gZW50cmllc1tpXTtcbiAgICAgIGxldCBlbGVtZW50ID0gZW50cnkudGFyZ2V0O1xuICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMpO1xuICAgICAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKSB7XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTLCBlbGVtZW50T2JzZXJ2ZXJzKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRhdGEgPSBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcik7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHsgd2FzVmlzaWJsZTogZmFsc2UsIHJhdGlvVmlzaWJsZTogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gfTtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycy5zZXQob2JzZXJ2ZXIsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiBkYXRhLnJhdGlvVmlzaWJsZSlcbiAgICAgICAgZGF0YS5yYXRpb1Zpc2libGUgPSBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbztcblxuICAgICAgZGF0YS5wcmV2aW91c1Zpc2liaWxpdHkgPSAoZGF0YS52aXNpYmlsaXR5ID09PSB1bmRlZmluZWQpID8gZGF0YS52aXNpYmlsaXR5IDogZGF0YS52aXNpYmlsaXR5O1xuICAgICAgZGF0YS52aXNpYmlsaXR5ID0gKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMC4wKTtcblxuICAgICAgY2FsbGJhY2soeyAuLi5kYXRhLCBlbnRyeSwgZWxlbWVudCwgaW5kZXg6IGksIGRpc2Nvbm5lY3Q6ICgpID0+IG9ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KSB9KTtcblxuICAgICAgaWYgKGRhdGEudmlzaWJpbGl0eSAmJiAhZGF0YS53YXNWaXNpYmxlKVxuICAgICAgICBkYXRhLndhc1Zpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHtcbiAgICByb290OiAgICAgICBudWxsLFxuICAgIHRocmVzaG9sZDogIDAuMCxcbiAgICAuLi4oX29wdGlvbnMgfHwge30pLFxuICB9O1xuXG4gIGxldCBvYnNlcnZlciAgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaW50ZXJzZWN0aW9uQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICBsZXQgZWxlbWVudHMgID0gKF9vcHRpb25zIHx8IHt9KS5lbGVtZW50cyB8fCBbXTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudHNbaV0pO1xuXG4gIHJldHVybiBvYnNlcnZlcjtcbn1cblxuY29uc3QgTk9fT0JTRVJWRVIgPSBPYmplY3QuZnJlZXplKHtcbiAgd2FzVmlzaWJsZTogICAgICAgICBmYWxzZSxcbiAgcmF0aW9WaXNpYmxlOiAgICAgICAwLjAsXG4gIHZpc2liaWxpdHk6ICAgICAgICAgZmFsc2UsXG4gIHByZXZpb3VzVmlzaWJpbGl0eTogZmFsc2UsXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlNZXRhKGVsZW1lbnQsIG9ic2VydmVyKSB7XG4gIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMpO1xuICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpXG4gICAgcmV0dXJuIE5PX09CU0VSVkVSO1xuXG4gIHJldHVybiBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcikgfHwgTk9fT0JTRVJWRVI7XG59XG4iLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGNvbnN0IFVORklOSVNIRURfREVGSU5JVElPTiA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy91bmZpbmlzaGVkJyk7XG5cbmNvbnN0IElTX1BST1BfTkFNRSAgICA9IC9ecHJvcFxcJC87XG5jb25zdCBJU19UQVJHRVRfUFJPUCAgPSAvXnByb3RvdHlwZXxjb25zdHJ1Y3RvciQvO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtVdGlscy5NWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICAnRWxlbWVudERlZmluaXRpb24nLFxuICAgICAgfSxcbiAgICAgICd0YWdOYW1lJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRhZ05hbWUsXG4gICAgICB9LFxuICAgICAgJ2F0dHJpYnV0ZXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH0sXG4gICAgICAnY2hpbGRyZW4nOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiAgICAgICAgY2hpbGRyZW4gfHwgW10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHRhZ05hbWUgPSB0aGlzLnRhZ05hbWU7XG4gICAgaWYgKHRhZ05hbWUgPT09ICcjdGV4dCcpXG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLnZhbHVlO1xuXG4gICAgbGV0IGF0dHJzID0gKChhdHRyaWJ1dGVzKSA9PiB7XG4gICAgICBsZXQgcGFydHMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgWyBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSBdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgbmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgICBwYXJ0cy5wdXNoKG5hbWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFydHMucHVzaChgJHtuYW1lfT1cIiR7ZW5jb2RlVmFsdWUodmFsdWUpfVwiYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcgJyk7XG4gICAgfSkodGhpcy5hdHRyaWJ1dGVzKTtcblxuICAgIGxldCBjaGlsZHJlbiA9ICgoY2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChjaGlsZCkgPT4gKGNoaWxkICE9IG51bGwgJiYgY2hpbGQgIT09IGZhbHNlICYmICFPYmplY3QuaXMoY2hpbGQsIE5hTikpKVxuICAgICAgICAubWFwKChjaGlsZCkgPT4gKCcnICsgY2hpbGQpKVxuICAgICAgICAuam9pbignJyk7XG4gICAgfSkodGhpcy5jaGlsZHJlbik7XG5cbiAgICByZXR1cm4gYDwke3RhZ05hbWV9JHsoYXR0cnMpID8gYCAke2F0dHJzfWAgOiAnJ30+JHsoaXNWb2lkVGFnKHRhZ05hbWUpKSA/ICcnIDogYCR7Y2hpbGRyZW59PC8ke3RhZ05hbWV9PmB9YDtcbiAgfVxuXG4gIHRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZU5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykge1xuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjZnJhZ21lbnQnKVxuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQuYnVpbGQob3duZXJEb2N1bWVudCwgdGVtcGxhdGVPcHRpb25zKSk7XG5cbiAgICBsZXQgYXR0cmlidXRlcyAgICA9IHRoaXMuYXR0cmlidXRlcztcbiAgICBsZXQgbmFtZXNwYWNlVVJJICA9IGF0dHJpYnV0ZXMubmFtZXNwYWNlVVJJO1xuICAgIGxldCBvcHRpb25zO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5pcylcbiAgICAgIG9wdGlvbnMgPSB7IGlzOiB0aGlzLmF0dHJpYnV0ZXMuaXMgfTtcblxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICcjdGV4dCcpXG4gICAgICByZXR1cm4gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgb3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhdHRyaWJ1dGVzLnZhbHVlIHx8ICcnKSwgdGVtcGxhdGVPcHRpb25zKTtcblxuICAgIGlmIChuYW1lc3BhY2VVUkkpXG4gICAgICBlbGVtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2UgaWYgKGlzU1ZHRWxlbWVudCh0aGlzLnRhZ05hbWUpKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHRoaXMudGFnTmFtZSwgb3B0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnRhZ05hbWUpO1xuXG4gICAgY29uc3QgZXZlbnROYW1lcyA9IFV0aWxzLmdldEFsbEV2ZW50TmFtZXNGb3JFbGVtZW50KGVsZW1lbnQpO1xuICAgIGNvbnN0IGhhbmRsZUF0dHJpYnV0ZSA9IChlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBfYXR0cmlidXRlVmFsdWUpID0+IHtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gX2F0dHJpYnV0ZVZhbHVlO1xuICAgICAgbGV0IGxvd2VyQXR0cmlidXRlTmFtZSAgPSBhdHRyaWJ1dGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgIFV0aWxzLmNyZWF0ZVNjb3BlKGVsZW1lbnQsIHRlbXBsYXRlT3B0aW9ucy5zY29wZSksIC8vIHRoaXNcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksXG4gICAgICAgICAgYXR0cmlidXRlVmFsdWUsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbW9kaWZpZWRBdHRyaWJ1dGVOYW1lID0gdGhpcy50b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG1vZGlmaWVkQXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBEeW5hbWljIGJpbmRpbmdzIGFyZSBub3QgYWxsb3dlZCBmb3IgcHJvcGVydGllc1xuICAgIGNvbnN0IGhhbmRsZVByb3BlcnR5ID0gKGVsZW1lbnQsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSkgPT4ge1xuICAgICAgbGV0IG5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZShJU19QUk9QX05BTUUsICcnKTtcbiAgICAgIGVsZW1lbnRbbmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgIH07XG5cbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBhdHRyaWJ1dGVOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBsZXQgYXR0cmlidXRlTmFtZSAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKElTX1BST1BfTkFNRS50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICBoYW5kbGVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQgY2hpbGQgICAgICAgICA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBsZXQgY2hpbGRFbGVtZW50ICA9IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRFbGVtZW50KSlcbiAgICAgICAgICBjaGlsZEVsZW1lbnQuZmxhdChJbmZpbml0eSkuZm9yRWFjaCgoY2hpbGQpID0+IGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvY2Vzc0VsZW1lbnRzLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgZWxlbWVudCxcbiAgICAgIHtcbiAgICAgICAgLi4udGVtcGxhdGVPcHRpb25zLFxuICAgICAgICBwcm9jZXNzRXZlbnRDYWxsYmFja3M6IGZhbHNlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG59XG5cbmNvbnN0IElTX0hUTUxfU0FGRV9DSEFSQUNURVIgPSAvXltcXHNhLXpBLVowLTlfLV0kLztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZVZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8uL2csIChtKSA9PiB7XG4gICAgcmV0dXJuIChJU19IVE1MX1NBRkVfQ0hBUkFDVEVSLnRlc3QobSkpID8gbSA6IGAmIyR7bS5jaGFyQ29kZUF0KDApfTtgO1xuICB9KTtcbn1cblxuY29uc3QgSVNfVk9JRF9UQUcgPSAvXmFyZWF8YmFzZXxicnxjb2x8ZW1iZWR8aHJ8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyJC9pO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVm9pZFRhZyh0YWdOYW1lKSB7XG4gIHJldHVybiBJU19WT0lEX1RBRy50ZXN0KHRhZ05hbWUuc3BsaXQoJzonKS5zbGljZSgtMSlbMF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0VsZW1lbnRzKF9ub2RlLCBfb3B0aW9ucykge1xuICBsZXQgbm9kZSA9IF9ub2RlO1xuICBpZiAoIW5vZGUpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHNjb3BlICAgICAgICAgPSBvcHRpb25zLnNjb3BlO1xuICBpZiAoIXNjb3BlKSB7XG4gICAgc2NvcGUgPSBVdGlscy5jcmVhdGVTY29wZShub2RlKTtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBzY29wZSB9O1xuICB9XG5cbiAgbGV0IGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yID0gKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSA9PT0gdHJ1ZSkgPyB1bmRlZmluZWQgOiBvcHRpb25zLmRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yO1xuICBsZXQgY2hpbGRyZW4gICAgICAgICAgICAgICAgICAgICAgPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG5cbiAgaWYgKG9wdGlvbnMuZm9yY2VUZW1wbGF0ZUVuZ2luZSAhPT0gdHJ1ZSAmJiAhZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IpIHtcbiAgICBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucywgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgfTtcbiAgfVxuXG4gIGxldCBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSBmYWxzZTtcbiAgaWYgKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yICYmIFV0aWxzLnNwZWNpYWxDbG9zZXN0KG5vZGUsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKSlcbiAgICBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5oZWxwZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5oZWxwZXIuY2FsbCh0aGlzLCB7IHNjb3BlLCBvcHRpb25zLCBub2RlLCBjaGlsZHJlbiwgaXNUZW1wbGF0ZUVuZ2luZURpc2FibGVkLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciB9KTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSlcbiAgICAgIG5vZGUgPSByZXN1bHQ7XG4gICAgZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuQVRUUklCVVRFX05PREUpIHtcbiAgICBpZiAoIWlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCkge1xuICAgICAgbGV0IHJlc3VsdCA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShub2RlLCBvcHRpb25zKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkgJiYgcmVzdWx0LnNvbWUoKGl0ZW0pID0+IChpdGVtW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ0VsZW1lbnREZWZpbml0aW9uJyB8fCBpdGVtW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ1F1ZXJ5RW5naW5lJykpKSB7XG4gICAgICAgIGxldCBvd25lckRvY3VtZW50ID0gb3B0aW9ucy5vd25lckRvY3VtZW50IHx8IHNjb3BlLm93bmVyRG9jdW1lbnQgfHwgbm9kZS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgICBsZXQgZnJhZ21lbnQgICAgICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGl0ZW1bVXRpbHMuTVlUSElYX1RZUEVdID09PSAnRWxlbWVudERlZmluaXRpb24nKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBpdGVtLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHsgc2NvcGUgfSk7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnRzKVxuICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudHMpKVxuICAgICAgICAgICAgICBlbGVtZW50cy5mbGF0KEluZmluaXR5KS5mb3JFYWNoKChlbGVtZW50KSA9PiBmcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVsZW1lbnRzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bVXRpbHMuTVlUSElYX1RZUEVdID09PSAnUXVlcnlFbmdpbmUnKSB7XG4gICAgICAgICAgICBpdGVtLmFwcGVuZFRvKGZyYWdtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gb3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoJycgKyBpdGVtKSk7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgIG5vZGUubm9kZVZhbHVlID0gIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUpIHtcbiAgICBsZXQgZXZlbnROYW1lcyAgICAgID0gVXRpbHMuZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQobm9kZSk7XG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzICA9IG5vZGUuZ2V0QXR0cmlidXRlTmFtZXMoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGF0dHJpYnV0ZU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBhdHRyaWJ1dGVOYW1lICAgICAgID0gYXR0cmlidXRlTmFtZXNbaV07XG4gICAgICBsZXQgbG93ZXJBdHRyaWJ1dGVOYW1lICA9IGF0dHJpYnV0ZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGxldCBhdHRyaWJ1dGVWYWx1ZSAgICAgID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG5cbiAgICAgIGlmIChldmVudE5hbWVzLmluZGV4T2YobG93ZXJBdHRyaWJ1dGVOYW1lKSA+PSAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnByb2Nlc3NFdmVudENhbGxiYWNrcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICAgIFV0aWxzLmNyZWF0ZVNjb3BlKG5vZGUsIHNjb3BlKSwgLy8gdGhpc1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGxvd2VyQXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMiksXG4gICAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNUZW1wbGF0ZShhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGUgPSBub2RlLmdldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVOb2RlKVxuICAgICAgICAgIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlID0gVXRpbHMuZm9ybWF0Tm9kZVZhbHVlKGF0dHJpYnV0ZU5vZGUsIHsgLi4ub3B0aW9ucywgZGlzYWxsb3dIVE1MOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2Nlc3NDaGlsZHJlbiA9PT0gZmFsc2UpXG4gICAgcmV0dXJuIG5vZGU7XG5cbiAgZm9yIChsZXQgY2hpbGROb2RlIG9mIGNoaWxkcmVuKSB7XG4gICAgbGV0IHJlc3VsdCA9IHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgb3B0aW9ucyk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE5vZGUgJiYgcmVzdWx0ICE9PSBjaGlsZE5vZGUgJiYgaGFzQ2hpbGQobm9kZSwgY2hpbGROb2RlKSlcbiAgICAgIG5vZGUucmVwbGFjZUNoaWxkKHJlc3VsdCwgY2hpbGROb2RlKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ2hpbGQocGFyZW50Tm9kZSwgY2hpbGROb2RlKSB7XG4gIGlmICghcGFyZW50Tm9kZSB8fCAhY2hpbGROb2RlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKHBhcmVudE5vZGUuY2hpbGROb2RlcykpIHtcbiAgICBpZiAoY2hpbGQgPT09IGNoaWxkTm9kZSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGQodGFnTmFtZSwgZGVmYXVsdEF0dHJpYnV0ZXMsIHNjb3BlKSB7XG4gIGlmICghdGFnTmFtZSB8fCAhVXRpbHMuaXNUeXBlKHRhZ05hbWUsICdTdHJpbmcnKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGFuIEVsZW1lbnREZWZpbml0aW9uIHdpdGhvdXQgYSBcInRhZ05hbWVcIi4nKTtcblxuICBjb25zdCBmaW5hbGl6ZXIgPSAoLi4uX2NoaWxkcmVuKSA9PiB7XG4gICAgY29uc3Qgd3JhbmdsZUNoaWxkcmVuID0gKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW4uZmxhdChJbmZpbml0eSkubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHZhbHVlW1VORklOSVNIRURfREVGSU5JVElPTl0pXG4gICAgICAgICAgcmV0dXJuIHZhbHVlKCk7XG5cbiAgICAgICAgaWYgKHZhbHVlW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ0VsZW1lbnREZWZpbml0aW9uJylcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gJ1F1ZXJ5RW5naW5lJylcbiAgICAgICAgICByZXR1cm4gd3JhbmdsZUNoaWxkcmVuKHZhbHVlLmdldFVuZGVybHlpbmdBcnJheSgpKTtcblxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICAgIHJldHVybiBub2RlVG9FbGVtZW50RGVmaW5pdGlvbih2YWx1ZSk7XG5cbiAgICAgICAgaWYgKCFVdGlscy5pc1R5cGUodmFsdWUsICdTdHJpbmcnLCBVdGlscy5EeW5hbWljUHJvcGVydHksICdEeW5hbWljUHJvcGVydHknKSlcbiAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIHZhbHVlKSB9KTtcbiAgICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcbiAgICB9O1xuXG4gICAgbGV0IGNoaWxkcmVuID0gd3JhbmdsZUNoaWxkcmVuKF9jaGlsZHJlbiB8fCBbXSk7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbih0YWdOYW1lLCBzY29wZSwgY2hpbGRyZW4pO1xuICB9O1xuXG4gIGxldCByb290UHJveHkgPSBuZXcgUHJveHkoZmluYWxpemVyLCB7XG4gICAgZ2V0OiAodGFyZ2V0LCBhdHRyaWJ1dGVOYW1lKSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gVU5GSU5JU0hFRF9ERUZJTklUSU9OKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVOYW1lID09PSAnc3ltYm9sJyB8fCBJU19UQVJHRVRfUFJPUC50ZXN0KGF0dHJpYnV0ZU5hbWUpKVxuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZU5hbWVdO1xuXG4gICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgIGxldCBzY29wZWRQcm94eSA9IGJ1aWxkKHRhZ05hbWUsIGRlZmF1bHRBdHRyaWJ1dGVzLCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIGRlZmF1bHRBdHRyaWJ1dGVzIHx8IHt9KSk7XG4gICAgICAgIHJldHVybiBzY29wZWRQcm94eVthdHRyaWJ1dGVOYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eShcbiAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gcm9vdFByb3h5O1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICAgICAgc2NvcGVbYXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm94eVtwcm9wTmFtZV07XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RQcm94eTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKG5vZGUpIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKVxuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZTogKCcnICsgbm9kZS5ub2RlVmFsdWUpIH0pO1xuXG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSlcbiAgICByZXR1cm47XG5cbiAgbGV0IGF0dHJpYnV0ZXMgPSB7fTtcbiAgZm9yIChsZXQgYXR0cmlidXRlTmFtZSBvZiBub2RlLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKS5tYXAobm9kZVRvRWxlbWVudERlZmluaXRpb24pO1xuICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKG5vZGUudGFnTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pO1xufVxuXG5jb25zdCBJU19URU1QTEFURSA9IC9eKHRlbXBsYXRlKSQvaTtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUNoaWxkcmVuKHRhcmdldCwgLi4ub3RoZXJzKSB7XG4gIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKVxuICAgIHJldHVybiB0YXJnZXQ7XG5cbiAgbGV0IHRhcmdldElzVGVtcGxhdGUgPSBJU19URU1QTEFURS50ZXN0KHRhcmdldC50YWdOYW1lKTtcbiAgZm9yIChsZXQgb3RoZXIgb2Ygb3RoZXJzKSB7XG4gICAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgbGV0IGNoaWxkTm9kZXMgPSAoSVNfVEVNUExBVEUudGVzdChvdGhlci50YWdOYW1lKSkgPyBvdGhlci5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzIDogb3RoZXIuY2hpbGROb2RlcztcbiAgICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKGNoaWxkTm9kZXMpKSB7XG4gICAgICBsZXQgY29udGVudCA9IChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSA/IGNoaWxkLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpIDogY2hpbGQ7XG4gICAgICBpZiAodGFyZ2V0SXNUZW1wbGF0ZSlcbiAgICAgICAgdGFyZ2V0LmNvbnRlbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICBlbHNlXG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBJU19TVkdfRUxFTUVOVF9OQU1FID0gL14oYWx0Z2x5cGh8YWx0Z2x5cGhkZWZ8YWx0Z2x5cGhpdGVtfGFuaW1hdGV8YW5pbWF0ZUNvbG9yfGFuaW1hdGVNb3Rpb258YW5pbWF0ZVRyYW5zZm9ybXxhbmltYXRpb258Y2lyY2xlfGNsaXBQYXRofGNvbG9yUHJvZmlsZXxjdXJzb3J8ZGVmc3xkZXNjfGRpc2NhcmR8ZWxsaXBzZXxmZWJsZW5kfGZlY29sb3JtYXRyaXh8ZmVjb21wb25lbnR0cmFuc2ZlcnxmZWNvbXBvc2l0ZXxmZWNvbnZvbHZlbWF0cml4fGZlZGlmZnVzZWxpZ2h0aW5nfGZlZGlzcGxhY2VtZW50bWFwfGZlZGlzdGFudGxpZ2h0fGZlZHJvcHNoYWRvd3xmZWZsb29kfGZlZnVuY2F8ZmVmdW5jYnxmZWZ1bmNnfGZlZnVuY3J8ZmVnYXVzc2lhbmJsdXJ8ZmVpbWFnZXxmZW1lcmdlfGZlbWVyZ2Vub2RlfGZlbW9ycGhvbG9neXxmZW9mZnNldHxmZXBvaW50bGlnaHR8ZmVzcGVjdWxhcmxpZ2h0aW5nfGZlc3BvdGxpZ2h0fGZldGlsZXxmZXR1cmJ1bGVuY2V8ZmlsdGVyfGZvbnR8Zm9udEZhY2V8Zm9udEZhY2VGb3JtYXR8Zm9udEZhY2VOYW1lfGZvbnRGYWNlU3JjfGZvbnRGYWNlVXJpfGZvcmVpZ25PYmplY3R8Z3xnbHlwaHxnbHlwaFJlZnxoYW5kbGVyfGhLZXJufGltYWdlfGxpbmV8bGluZWFyZ3JhZGllbnR8bGlzdGVuZXJ8bWFya2VyfG1hc2t8bWV0YWRhdGF8bWlzc2luZ0dseXBofG1QYXRofHBhdGh8cGF0dGVybnxwb2x5Z29ufHBvbHlsaW5lfHByZWZldGNofHJhZGlhbGdyYWRpZW50fHJlY3R8c2V0fHNvbGlkQ29sb3J8c3RvcHxzdmd8c3dpdGNofHN5bWJvbHx0YnJlYWt8dGV4dHx0ZXh0cGF0aHx0cmVmfHRzcGFufHVua25vd258dXNlfHZpZXd8dktlcm4pJC9pO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU1ZHRWxlbWVudCh0YWdOYW1lKSB7XG4gIHJldHVybiBJU19TVkdfRUxFTUVOVF9OQU1FLnRlc3QodGFnTmFtZSk7XG59XG5cbmV4cG9ydCBjb25zdCBUZXJtID0gKHZhbHVlKSA9PiBuZXcgRWxlbWVudERlZmluaXRpb24oJyN0ZXh0JywgeyB2YWx1ZSB9KTtcbmV4cG9ydCBjb25zdCBFbGVtZW50R2VuZXJhdG9yID0gbmV3IFByb3h5KFxuICB7XG4gICAgVGVybSxcbiAgICAkVEVYVDogVGVybSxcbiAgfSxcbiAge1xuICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBwcm9wTmFtZSkge1xuICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG5cbiAgICAgIGlmIChJU19TVkdfRUxFTUVOVF9OQU1FLnRlc3QocHJvcE5hbWUpKSB7XG4gICAgICAgIC8vIFNWRyBlbGVtZW50c1xuICAgICAgICByZXR1cm4gYnVpbGQocHJvcE5hbWUsIHsgbmFtZXNwYWNlVVJJOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVpbGQocHJvcE5hbWUpO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIE5PT1BcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0sXG4pO1xuIiwiaW1wb3J0IGRlZXBNZXJnZSAgZnJvbSAnZGVlcG1lcmdlJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQge1xuICBNeXRoaXhVSUNvbXBvbmVudCxcbiAgcmVxdWlyZSxcbn0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlMYW5ndWFnZVBhY2sgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1sYW5ndWFnZS1wYWNrJztcblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgc2V0IGF0dHIkZGF0YU15dGhpeFNyYyhbIHZhbHVlIF0pIHtcbiAgICAvLyBOT09QLi4uIFRyYXAgdGhpcyBiZWNhdXNlIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBsb2FkIGEgcGFydGlhbCBoZXJlXG4gIH1cblxuICBvbk11dGF0aW9uQWRkZWQobXV0YXRpb24pIHtcbiAgICAvLyBXaGVuIGFkZGVkIHRvIHRoZSBET00sIGVuc3VyZSB0aGF0IHdlIHdlcmVcbiAgICAvLyBhZGRlZCB0byB0aGUgcm9vdCBvZiBhIGxhbmd1YWdlIHByb3ZpZGVyLi4uXG4gICAgLy8gSWYgbm90LCB0aGVuIG1vdmUgb3Vyc2VsdmVzIHRvIHRoZSByb290XG4gICAgLy8gb2YgdGhlIGxhbmd1YWdlIHByb3ZpZGVyLlxuICAgIGxldCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyID0gdGhpcy5jbG9zZXN0KCdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICBpZiAocGFyZW50TGFuZ3VhZ2VQcm92aWRlciAmJiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICE9PSBtdXRhdGlvbi50YXJnZXQpXG4gICAgICBVdGlscy5uZXh0VGljaygoKSA9PiBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmluc2VydEJlZm9yZSh0aGlzLCBwYXJlbnRMYW5ndWFnZVByb3ZpZGVyLmZpcnN0Q2hpbGQpKTtcbiAgfVxufVxuXG5jb25zdCBJU19KU09OX0VOQ1RZUEUgICAgICAgICAgICAgICAgID0gL15hcHBsaWNhdGlvblxcL2pzb24vaTtcbmNvbnN0IExBTkdVQUdFX1BBQ0tfSU5TRVJUX0dSQUNFX1RJTUUgPSA1MDtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyJztcblxuICBzZXQgYXR0ciRsYW5nKFsgbmV3VmFsdWUsIG9sZFZhbHVlIF0pIHtcbiAgICB0aGlzLmxvYWRBbGxMYW5ndWFnZVBhY2tzRm9yTGFuZ3VhZ2UobmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIG9uTXV0YXRpb25DaGlsZEFkZGVkKG5vZGUpIHtcbiAgICBpZiAobm9kZS5sb2NhbE5hbWUgPT09ICdteXRoaXgtbGFuZ3VhZ2UtcGFjaycpIHtcbiAgICAgIHRoaXMuZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAvLyBSZWxvYWQgbGFuZ3VhZ2UgcGFja3MgYWZ0ZXIgYWRkaXRpb25zXG4gICAgICAgIHRoaXMubG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZSh0aGlzLmdldEN1cnJlbnRMb2NhbGUoKSk7XG4gICAgICB9LCBMQU5HVUFHRV9QQUNLX0lOU0VSVF9HUkFDRV9USU1FLCAncmVsb2FkTGFuZ3VhZ2VQYWNrcycpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAndGVybXMnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgaTE4bihfcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgbGV0IHBhdGggICAgPSBgZ2xvYmFsLmkxOG4uJHtfcGF0aH1gO1xuICAgIGxldCByZXN1bHQgID0gVXRpbHMuZmV0Y2hQYXRoKHRoaXMudGVybXMsIHBhdGgpO1xuXG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgICAgcmV0dXJuIFV0aWxzLmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbCh0aGlzLCBwYXRoLCAoZGVmYXVsdFZhbHVlID09IG51bGwpID8gJycgOiBkZWZhdWx0VmFsdWUpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkuY2hpbGROb2Rlc1sxXS5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAnZW4nO1xuICB9XG5cbiAgbW91bnRlZCgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0QXR0cmlidXRlKCdsYW5nJykpXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnbGFuZycsICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLmNoaWxkTm9kZXNbMV0uZ2V0QXR0cmlidXRlKCdsYW5nJykgfHwgJ2VuJyk7XG4gIH1cblxuICBjcmVhdGVTaGFkb3dET00oKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSB7XG4gICAgLy8gTk9PUFxuICB9XG5cbiAgZ2V0U291cmNlc0ZvckxhbmcobGFuZykge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdChgbXl0aGl4LWxhbmd1YWdlLXBhY2tbbGFuZ149XCIke2xhbmcucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApO1xuICB9XG5cbiAgbG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZShfbGFuZykge1xuICAgIGxldCBsYW5nICAgICAgICAgICAgPSBfbGFuZyB8fCAnZW4nO1xuICAgIGxldCBzb3VyY2VFbGVtZW50cyAgPSB0aGlzLmdldFNvdXJjZXNGb3JMYW5nKGxhbmcpLmZpbHRlcigoc291cmNlRWxlbWVudCkgPT4gVXRpbHMuaXNOb3ROT0Uoc291cmNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSk7XG4gICAgaWYgKCFzb3VyY2VFbGVtZW50cyB8fCAhc291cmNlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFwibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IE5vIFwibXl0aGl4LWxhbmd1YWdlLXBhY2tcIiB0YWcgZm91bmQgZm9yIHNwZWNpZmllZCBsYW5ndWFnZSBcIiR7bGFuZ31cImApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubG9hZEFsbExhbmd1YWdlUGFja3MobGFuZywgc291cmNlRWxlbWVudHMpO1xuICB9XG5cbiAgYXN5bmMgbG9hZEFsbExhbmd1YWdlUGFja3MobGFuZywgc291cmNlRWxlbWVudHMpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IHByb21pc2VzICA9IHNvdXJjZUVsZW1lbnRzLm1hcCgoc291cmNlRWxlbWVudCkgPT4gdGhpcy5sb2FkTGFuZ3VhZ2VQYWNrKGxhbmcsIHNvdXJjZUVsZW1lbnQpKTtcbiAgICAgIGxldCBhbGxUZXJtcyAgPSAoYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKHByb21pc2VzKSkubWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgIT09ICdmdWxmaWxsZWQnKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICAgICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICBsZXQgdGVybXMgICAgICAgICA9IGRlZXBNZXJnZS5hbGwoQXJyYXkuZnJvbShuZXcgU2V0KGFsbFRlcm1zKSkpO1xuICAgICAgbGV0IGNvbXBpbGVkVGVybXMgPSB0aGlzLmNvbXBpbGVMYW5ndWFnZVRlcm1zKGxhbmcsIHRlcm1zKTtcblxuICAgICAgdGhpcy50ZXJtcyA9IGNvbXBpbGVkVGVybXM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1wibXl0aGl4LWxhbmd1YWdlLXByb3ZpZGVyXCI6IEZhaWxlZCB0byBsb2FkIGxhbmd1YWdlIHBhY2tzJywgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWRMYW5ndWFnZVBhY2sobGFuZywgc291cmNlRWxlbWVudCkge1xuICAgIGxldCBzcmMgPSBzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgaWYgKCFzcmMpXG4gICAgICByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgbGV0IHsgcmVzcG9uc2UgfSAgPSBhd2FpdCByZXF1aXJlLmNhbGwodGhpcywgc3JjLCB7IG93bmVyRG9jdW1lbnQ6IHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCB9KTtcbiAgICAgIGxldCB0eXBlICAgICAgICAgID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2VuY3R5cGUnKSB8fCAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICBpZiAoSVNfSlNPTl9FTkNUWVBFLnRlc3QodHlwZSkpIHtcbiAgICAgICAgLy8gSGFuZGxlIEpTT05cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ldyBUeXBlRXJyb3IoYERvbid0IGtub3cgaG93IHRvIGxvYWQgYSBsYW5ndWFnZSBwYWNrIG9mIHR5cGUgXCIke3R5cGV9XCJgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgc3BlY2lmaWVkIHJlc291cmNlOiAke3NyY31gLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpIHtcbiAgICBjb25zdCB3YWxrVGVybXMgPSAodGVybXMsIHJhd0tleVBhdGgpID0+IHtcbiAgICAgIGxldCBrZXlzICAgICAgPSBPYmplY3Qua2V5cyh0ZXJtcyk7XG4gICAgICBsZXQgdGVybXNDb3B5ID0ge307XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICBsZXQga2V5ICAgICAgICAgPSBrZXlzW2ldO1xuICAgICAgICBsZXQgdmFsdWUgICAgICAgPSB0ZXJtc1trZXldO1xuICAgICAgICBsZXQgbmV3S2V5UGF0aCAgPSByYXdLZXlQYXRoLmNvbmNhdChrZXkpO1xuXG4gICAgICAgIGlmIChVdGlscy5pc1BsYWluT2JqZWN0KHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gd2Fsa1Rlcm1zKHZhbHVlLCBuZXdLZXlQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSBVdGlscy5nZXREeW5hbWljUHJvcGVydHlGb3JQYXRoLmNhbGwodGhpcywgbmV3S2V5UGF0aC5qb2luKCcuJyksIHZhbHVlKTtcbiAgICAgICAgICB0ZXJtc0NvcHlba2V5XSA9IHByb3BlcnR5O1xuICAgICAgICAgIHByb3BlcnR5W1V0aWxzLkR5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVybXNDb3B5O1xuICAgIH07XG5cbiAgICByZXR1cm4gd2Fsa1Rlcm1zKHRlcm1zLCBbICdnbG9iYWwnLCAnaTE4bicgXSk7XG4gIH1cbn1cblxuTXl0aGl4VUlMYW5ndWFnZVBhY2sucmVnaXN0ZXIoKTtcbk15dGhpeFVJTGFuZ3VhZ2VQcm92aWRlci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlMYW5ndWFnZVBhY2sgPSBNeXRoaXhVSUxhbmd1YWdlUGFjaztcbmdsb2JhbFRoaXMubXl0aGl4VUkuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyID0gTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyO1xuIiwiaW1wb3J0ICogYXMgQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50LmpzJztcblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBURU1QTEFURV9URU1QTEFURSA9IC9eKFxcKnxcXHxcXCp8XFwqXFx8KSQvO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlSZXF1aXJlIGV4dGVuZHMgQ29tcG9uZW50Lk15dGhpeFVJQ29tcG9uZW50IHtcbiAgYXN5bmMgbW91bnRlZCgpIHtcbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7XG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVybCxcbiAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIGNhY2hlZCxcbiAgICAgIH0gPSBhd2FpdCBDb21wb25lbnQucmVxdWlyZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBvd25lckRvY3VtZW50OiAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICB9LFxuICAgICAgKTtcblxuICAgICAgaWYgKGNhY2hlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIENvbXBvbmVudC5pbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlLmNhbGwoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIG93bmVyRG9jdW1lbnQubG9jYXRpb24sXG4gICAgICAgIHVybCxcbiAgICAgICAgYm9keSxcbiAgICAgICAge1xuICAgICAgICAgIG1hZ2ljOiAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBub2RlSGFuZGxlcjogIChub2RlLCB7IGlzSGFuZGxlZCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzSGFuZGxlZCAmJiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSlcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByZVByb2Nlc3M6ICAgKHsgdGVtcGxhdGUsIGNoaWxkcmVuIH0pID0+IHtcbiAgICAgICAgICAgIGxldCBzdGFyVGVtcGxhdGUgPSBjaGlsZHJlbi5maW5kKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICBsZXQgZGF0YUZvciA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpICYmIFRFTVBMQVRFX1RFTVBMQVRFLnRlc3QoZGF0YUZvcikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIGxldCBkYXRhRm9yID0gc3RhclRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICBsZXQgc3RhckNsb25lID0gc3RhclRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhRm9yID09PSAnKnwnKVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5pbnNlcnRCZWZvcmUoc3RhckNsb25lLCBjaGlsZC5jb250ZW50LmNoaWxkTm9kZXNbMF0gfHwgbnVsbCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5hcHBlbmRDaGlsZChzdGFyQ2xvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJUZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtcmVxdWlyZVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICAvLyBOT09QXG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJUmVxdWlyZTtcblxuaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIE15dGhpeFVJUmVxdWlyZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQuanMnO1xuXG4vKlxuTWFueSB0aGFua3MgdG8gU2FnZWUgQ29ud2F5IGZvciB0aGUgZm9sbG93aW5nIENTUyBzcGlubmVyc1xuaHR0cHM6Ly9jb2RlcGVuLmlvL3NhY29ud2F5L3Blbi92WUtZeXJ4XG4qL1xuXG5jb25zdCBTVFlMRV9TSEVFVCA9XG5gXG46aG9zdCB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogMWVtO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG46aG9zdCguc21hbGwpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDAuNzUpO1xufVxuOmhvc3QoLm1lZGl1bSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMS41KTtcbn1cbjpob3N0KC5sYXJnZSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IGNhbGMoMWVtICogMyk7XG59XG4uc3Bpbm5lci1pdGVtLFxuLnNwaW5uZXItaXRlbTo6YmVmb3JlLFxuLnNwaW5uZXItaXRlbTo6YWZ0ZXIge1xuXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbSB7XG4gIHdpZHRoOiAxMSU7XG4gIGhlaWdodDogNjAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1hdWRpby1hbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMjUpO1xuICB9XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMik7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg0KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I0LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3M6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjA3NSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgdG9wOiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGJvcmRlcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1sZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG46aG9zdChba2luZD1cImNpcmNsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMS4wKTtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYm9yZGVyLXRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgKiAwLjA3NSkgc29saWQgdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItY2lyY2xlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMCkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMikge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNyk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci1ib3R0b206IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjg3NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMykge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuNCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAwLjc1KSBsaW5lYXIgaW5maW5pdGU7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4xKSkgcm90YXRlKDQ1ZGVnKTtcbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyLjUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlcjogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjEge1xuICAwJSwgOC4zMyUsIDE2LjY2JSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAyNC45OSUsIDMzLjMyJSwgNDEuNjUlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMDAlLCAwJSk7XG4gIH1cbiAgNDkuOTglLCA1OC4zMSUsIDY2LjY0JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMTAwJSk7XG4gIH1cbiAgNzQuOTclLCA4My4zMCUsIDkxLjYzJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IDA7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjIge1xuICAwJSwgOC4zMyUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDAlKTtcbiAgfVxuICAxNi42NiUsIDI0Ljk5JSwgMzMuMzIlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwJSwgMTAwJSk7XG4gIH1cbiAgNDEuNjUlLCA0OS45OCUsIDU4LjMxJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDEwMCUpO1xuICB9XG4gIDY2LjY0JSwgNzQuOTclLCA4My4zMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicHV6emxlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIHRvcDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDUuMCkgbGluZWFyIGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci1wdXp6bGUtYW5pbWF0aW9uMyB7XG4gIDAlLCA4My4zMCUsIDkxLjYzJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCk7XG4gIH1cbiAgOC4zMyUsIDE2LjY2JSwgMjQuOTklIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCk7XG4gIH1cbiAgMzMuMzIlLCA0MS42NSUsIDQ5Ljk4JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIC0xMDAlKTtcbiAgfVxuICA1OC4zMSUsIDY2LjY0JSwgNzQuOTclIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAtMTAwJSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gNCk7XG4gIG1pbi13aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXdhdmUtYW5pbWF0aW9uIHtcbiAgMCUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg3NSUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03NSUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTEpO1xufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0yKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDQwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcGlwZS1hbmltYXRpb24ge1xuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDIpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTApO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgzKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IzLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiAyKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMyk7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDUpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjUsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDQpO1xufVxuOmhvc3QoW2tpbmQ9XCJkb3RcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICBsZWZ0OiBjYWxjKDUwJSAtIHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMik7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1kb3QtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMy4wKSAvIC0yKTtcbn1cbmA7XG5cbmNvbnN0IEtJTkRTID0ge1xuICAnYXVkaW8nOiAgNSxcbiAgJ2NpcmNsZSc6IDMsXG4gICdkb3QnOiAgICAyLFxuICAncGlwZSc6ICAgNSxcbiAgJ3B1enpsZSc6IDMsXG4gICd3YXZlJzogICAzLFxufTtcblxuZXhwb3J0IGNsYXNzIE15dGhpeFVJU3Bpbm5lciBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LXNwaW5uZXInO1xuXG4gIHNldCBhdHRyJGtpbmQoWyBuZXdWYWx1ZSBdKSB7XG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIG1vdW50ZWQoKSB7XG4gICAgaWYgKCF0aGlzLmRvY3VtZW50SW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIGFwcGVuZCB0ZW1wbGF0ZVxuICAgICAgbGV0IG93bmVyRG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICB0aGlzLiRidWlsZCgoeyBURU1QTEFURSB9KSA9PiB7XG4gICAgICAgIHJldHVybiBURU1QTEFURVxuICAgICAgICAgIC5kYXRhTXl0aGl4TmFtZSh0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpXG4gICAgICAgICAgLnByb3AkaW5uZXJIVE1MKGA8c3R5bGU+JHtTVFlMRV9TSEVFVH08L3N0eWxlPmApO1xuICAgICAgfSkuYXBwZW5kVG8ob3duZXJEb2N1bWVudC5ib2R5KTtcblxuICAgICAgbGV0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKTtcbiAgICAgIHRoaXMuYXBwZW5kVGVtcGxhdGVUb1NoYWRvd0RPTSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgbGV0IGtpbmQgPSB0aGlzLmdldEF0dHJpYnV0ZSgna2luZCcpO1xuICAgIGlmICgha2luZCkge1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdraW5kJywga2luZCk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLaW5kQXR0cmlidXRlQ2hhbmdlKGtpbmQpO1xuICB9XG5cbiAgaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShfa2luZCkge1xuICAgIGxldCBraW5kICAgICAgICA9ICgnJyArIF9raW5kKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKEtJTkRTLCBraW5kKSkge1xuICAgICAgY29uc29sZS53YXJuKGBcIm15dGhpeC1zcGlubmVyXCIgdW5rbm93biBcImtpbmRcIiBwcm92aWRlZDogXCIke2tpbmR9XCIuIFN1cHBvcnRlZCBcImtpbmRcIiBhdHRyaWJ1dGUgdmFsdWVzIGFyZTogXCJwaXBlXCIsIFwiYXVkaW9cIiwgXCJjaXJjbGVcIiwgXCJwdXp6bGVcIiwgXCJ3YXZlXCIsIGFuZCBcImRvdFwiLmApO1xuICAgICAga2luZCA9ICdwaXBlJztcbiAgICB9XG5cbiAgICB0aGlzLmNoYW5nZVNwaW5uZXJDaGlsZHJlbihLSU5EU1traW5kXSk7XG4gIH1cblxuICBidWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIGxldCBjaGlsZHJlbiAgICAgID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgb3duZXJEb2N1bWVudCA9ICh0aGlzLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3Bpbm5lci1pdGVtJyk7XG5cbiAgICAgIGNoaWxkcmVuW2ldID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3QoY2hpbGRyZW4pO1xuICB9XG5cbiAgY2hhbmdlU3Bpbm5lckNoaWxkcmVuKGNvdW50KSB7XG4gICAgdGhpcy5zZWxlY3QoJy5zcGlubmVyLWl0ZW0nKS5yZW1vdmUoKTtcbiAgICB0aGlzLmJ1aWxkU3Bpbm5lckNoaWxkcmVuKGNvdW50KS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG5cbiAgICAvLyBBbHdheXMgYXBwZW5kIHN0eWxlIGFnYWluLCBzb1xuICAgIC8vIHRoYXQgaXQgaXMgdGhlIGxhc3QgY2hpbGQsIGFuZFxuICAgIC8vIGRvZXNuJ3QgbWVzcyB3aXRoIFwibnRoLWNoaWxkXCJcbiAgICAvLyBzZWxlY3RvcnNcbiAgICB0aGlzLnNlbGVjdCgnc3R5bGUnKS5hcHBlbmRUbyh0aGlzLnNoYWRvdyk7XG4gIH1cbn1cblxuTXl0aGl4VUlTcGlubmVyLnJlZ2lzdGVyKCk7XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSVJlcXVpcmUgPSBNeXRoaXhVSVNwaW5uZXI7XG4iLCJpbXBvcnQgKiBhcyBVdGlscyAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmltcG9ydCB7XG4gIEVsZW1lbnREZWZpbml0aW9uLFxuICBVTkZJTklTSEVEX0RFRklOSVRJT04sXG59IGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5jb25zdCBJU19JTlRFR0VSID0gL15cXGQrJC87XG5cbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBXZSBoYXZlIGFuIEVsZW1lbnQgb3IgYSBEb2N1bWVudFxuICBpZiAodmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHwgdmFsdWUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzU2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gZWxlbWVudC5jbG9zZXN0KCdzbG90Jyk7XG59XG5cbmZ1bmN0aW9uIGlzTm90U2xvdHRlZChlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gIWVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2xhc3NOYW1lcyguLi5hcmdzKSB7XG4gIGxldCBjbGFzc05hbWVzID0gW10uY29uY2F0KC4uLmFyZ3MpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5tYXAoKHBhcnQpID0+ICgnJyArIHBhcnQpLnNwbGl0KC9cXHMrLykpXG4gICAgICAuZmxhdChJbmZpbml0eSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcmV0dXJuIGNsYXNzTmFtZXM7XG59XG5cbmV4cG9ydCBjbGFzcyBRdWVyeUVuZ2luZSB7XG4gIHN0YXRpYyBpc0VsZW1lbnQgICAgPSBpc0VsZW1lbnQ7XG4gIHN0YXRpYyBpc1Nsb3R0ZWQgICAgPSBpc1Nsb3R0ZWQ7XG4gIHN0YXRpYyBpc05vdFNsb3R0ZWQgPSBpc05vdFNsb3R0ZWQ7XG5cbiAgc3RhdGljIGZyb20gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShbXSwgeyByb290OiAoaXNFbGVtZW50KHRoaXMpKSA/IHRoaXMgOiBkb2N1bWVudCwgY29udGV4dDogdGhpcyB9KTtcblxuICAgIGNvbnN0IGdldE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBsZXQgYmFzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKGJhc2UsIGFyZ3NbYXJnSW5kZXgrK10pO1xuXG4gICAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleF0uZ2V0T3B0aW9ucygpIHx8IHt9LCBiYXNlKTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJvb3RFbGVtZW50ID0gKG9wdGlvbnNSb290KSA9PiB7XG4gICAgICBpZiAoaXNFbGVtZW50KG9wdGlvbnNSb290KSlcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNSb290O1xuXG4gICAgICBpZiAoaXNFbGVtZW50KHRoaXMpKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgcmV0dXJuICgodGhpcyAmJiB0aGlzLm93bmVyRG9jdW1lbnQpIHx8IGRvY3VtZW50KTtcbiAgICB9O1xuXG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IGdldE9wdGlvbnMoKTtcbiAgICBsZXQgcm9vdCAgICAgID0gZ2V0Um9vdEVsZW1lbnQob3B0aW9ucy5yb290KTtcbiAgICBsZXQgcXVlcnlFbmdpbmU7XG5cbiAgICBvcHRpb25zLnJvb3QgPSByb290O1xuICAgIG9wdGlvbnMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCB8fCB0aGlzO1xuXG4gICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLnNsaWNlKCksIG9wdGlvbnMpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1thcmdJbmRleF0pKSB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXggKyAxXSwgJ0Z1bmN0aW9uJykpXG4gICAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzWzFdO1xuXG4gICAgICBxdWVyeUVuZ2luZSA9IG5ldyBRdWVyeUVuZ2luZShhcmdzW2FyZ0luZGV4XSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdTdHJpbmcnKSkge1xuICAgICAgb3B0aW9ucy5zZWxlY3RvciA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoYXJnc1thcmdJbmRleF0sICdGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocm9vdC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJ0Z1bmN0aW9uJykpIHtcbiAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBsZXQgcmVzdWx0ID0gb3B0aW9ucy5jYWxsYmFjay5jYWxsKHRoaXMsIEVsZW1lbnRzLkVsZW1lbnRHZW5lcmF0b3IsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkpXG4gICAgICAgIHJlc3VsdCA9IFsgcmVzdWx0IF07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKHJlc3VsdCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaW52b2tlQ2FsbGJhY2tzICE9PSBmYWxzZSAmJiB0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjayk7XG5cbiAgICByZXR1cm4gcXVlcnlFbmdpbmU7XG4gIH07XG5cbiAgZ2V0RW5naW5lQ2xhc3MoKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIF9vcHRpb25zKSB7XG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtVdGlscy5NWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICAnUXVlcnlFbmdpbmUnLFxuICAgICAgfSxcbiAgICAgICdfbXl0aGl4VUlPcHRpb25zJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ19teXRoaXhVSUVsZW1lbnRzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMob3B0aW9ucy5jb250ZXh0LCBlbGVtZW50cyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvb3RQcm94eSA9IG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lIGluIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnbGVuZ3RoJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICAgIHJldHVybiB0YXJnZXQucHJvdG90eXBlO1xuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIC8vIEluZGV4IGxvb2t1cFxuICAgICAgICBpZiAoSVNfSU5URUdFUi50ZXN0KHByb3BOYW1lKSlcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICAgIC8vIFJlZGlyZWN0IGFueSBhcnJheSBtZXRob2RzOlxuICAgICAgICAvL1xuICAgICAgICAvLyBcIm1hZ2ljUHJvcE5hbWVcIiBpcyB3aGVuIHRoZVxuICAgICAgICAvLyBmdW5jdGlvbiBuYW1lIGJlZ2lucyB3aXRoIFwiJFwiLFxuICAgICAgICAvLyBpLmUuIFwiJGZpbHRlclwiLCBvciBcIiRtYXBcIi4gSWZcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY2FzZSwgdGhlbiB0aGUgcmV0dXJuXG4gICAgICAgIC8vIHZhbHVlIHdpbGwgYWx3YXlzIGJlIGNvZXJjZWQgaW50b1xuICAgICAgICAvLyBhIFF1ZXJ5RW5naW5lLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICAgICAgLy8gb25seSBiZSBjb2VyY2VkIGludG8gYSBRdWVyeUVuZ2luZVxuICAgICAgICAvLyBpZiBFVkVSWSBlbGVtZW50IGluIHRoZSByZXN1bHQgaXNcbiAgICAgICAgLy8gYW4gXCJlbGVtZW50eVwiIHR5cGUgdmFsdWUuXG4gICAgICAgIGxldCBtYWdpY1Byb3BOYW1lID0gKHByb3BOYW1lLmNoYXJBdCgwKSA9PT0gJyQnKSA/IHByb3BOYW1lLnN1YnN0cmluZygxKSA6IHByb3BOYW1lO1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZVttYWdpY1Byb3BOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbGV0IGFycmF5ICAgPSB0YXJnZXQuX215dGhpeFVJRWxlbWVudHM7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ICA9IGFycmF5W21hZ2ljUHJvcE5hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpICYmIChtYWdpY1Byb3BOYW1lICE9PSBwcm9wTmFtZSB8fCByZXN1bHQuZXZlcnkoKGl0ZW0pID0+IFV0aWxzLmlzVHlwZShpdGVtLCBFbGVtZW50RGVmaW5pdGlvbiwgTm9kZSwgUXVlcnlFbmdpbmUpKSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0YXJnZXQuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyhyZXN1bHQsIHRhcmdldC5nZXRPcHRpb25zKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm9vdFByb3h5O1xuICB9XG5cbiAgZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlPcHRpb25zO1xuICB9XG5cbiAgZ2V0Q29udGV4dCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQ7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgcmV0dXJuIG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudDtcbiAgfVxuXG4gIGdldFVuZGVybHlpbmdBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcbiAgfVxuXG4gIGdldE93bmVyRG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um9vdCgpLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBmaWx0ZXJBbmRDb25zdHJ1Y3RFbGVtZW50cyhjb250ZXh0LCBlbGVtZW50cykge1xuICAgIGxldCBmaW5hbEVsZW1lbnRzID0gQXJyYXkuZnJvbShlbGVtZW50cykuZmxhdChJbmZpbml0eSkubWFwKChfaXRlbSkgPT4ge1xuICAgICAgaWYgKCFfaXRlbSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgaXRlbSA9IF9pdGVtO1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0VW5kZXJseWluZ0FycmF5KCk7XG5cbiAgICAgIGlmIChVdGlscy5pc1R5cGUoaXRlbSwgTm9kZSkpXG4gICAgICAgIHJldHVybiBpdGVtO1xuXG4gICAgICBpZiAoaXRlbVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICBpdGVtID0gaXRlbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sICdTdHJpbmcnKSlcbiAgICAgICAgaXRlbSA9IEVsZW1lbnRzLlRlcm0oaXRlbSk7XG4gICAgICBlbHNlIGlmICghVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoIWNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiY29udGV4dFwiIG9wdGlvbiBmb3IgUXVlcnlFbmdpbmUgaXMgcmVxdWlyZWQgd2hlbiBjb25zdHJ1Y3RpbmcgZWxlbWVudHMuJyk7XG5cbiAgICAgIHJldHVybiBpdGVtLmJ1aWxkKHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpLCB7XG4gICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShjb250ZXh0KSxcbiAgICAgIH0pO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IGFyZ3NbYXJnSW5kZXgrK10gOiB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZXh0ICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQuJCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQuJC5jYWxsKG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIEVuZ2luZUNsYXNzLmZyb20uY2FsbChvcHRpb25zLmNvbnRleHQgfHwgdGhpcywgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICB9XG5cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICB5aWVsZChbaSwgZWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gICprZXlzKCkge1xuICAgIGZvciAobGV0IFsga2V5LCBfIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCBrZXk7XG4gIH1cblxuICAqdmFsdWVzKCkge1xuICAgIGZvciAobGV0IFsgXywgdmFsdWUgXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIHZhbHVlO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB5aWVsZCAqdGhpcy52YWx1ZXMoKTtcbiAgfVxuXG4gIGZpcnN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICdOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbMF0gXSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5fbXl0aGl4VUlFbGVtZW50cy5zbGljZShNYXRoLmFicyhjb3VudCkpKTtcbiAgfVxuXG4gIGxhc3QoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCB8fCBjb3VudCA9PT0gMCB8fCBPYmplY3QuaXMoY291bnQsIE5hTikgfHwgIVV0aWxzLmlzVHlwZShjb3VudCwgJ051bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1t0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCAtIDFdIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuX215dGhpeFVJRWxlbWVudHMuc2xpY2UoTWF0aC5hYnMoY291bnQpICogLTEpKTtcbiAgfVxuXG4gIGFkZCguLi5lbGVtZW50cykge1xuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5zbGljZSgpLmNvbmNhdCguLi5lbGVtZW50cyksIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgfVxuXG4gIHN1YnRyYWN0KC4uLmVsZW1lbnRzKSB7XG4gICAgbGV0IHNldCA9IG5ldyBTZXQoZWxlbWVudHMpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIG5ldyBFbmdpbmVDbGFzcyh0aGlzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuICFzZXQuaGFzKGl0ZW0pO1xuICAgIH0pLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdGhpcy52YWx1ZXMoKSkge1xuICAgICAgaWYgKCFpc0VsZW1lbnQodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgdmFsdWUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFwcGVuZFRvKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gIH1cblxuICBpbnNlcnRJbnRvKHNlbGVjdG9yT3JFbGVtZW50LCByZWZlcmVuY2VOb2RlKSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnU3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBsZXQgb3duZXJEb2N1bWVudCA9IHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpO1xuICAgIGxldCBzb3VyY2UgICAgICAgID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxldCBmcmFnbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cylcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuXG4gICAgICBzb3VyY2UgPSBbIGZyYWdtZW50IF07XG4gICAgfVxuXG4gICAgZWxlbWVudC5pbnNlcnQoc291cmNlWzBdLCByZWZlcmVuY2VOb2RlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVwbGFjZUNoaWxkcmVuT2Yoc2VsZWN0b3JPckVsZW1lbnQpIHtcbiAgICBsZXQgZWxlbWVudCA9IHNlbGVjdG9yT3JFbGVtZW50O1xuICAgIGlmIChVdGlscy5pc1R5cGUoc2VsZWN0b3JPckVsZW1lbnQsICdTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIHdoaWxlIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVG8oZWxlbWVudCk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsYXNzTGlzdChvcGVyYXRpb24sIC4uLmFyZ3MpIHtcbiAgICBsZXQgY2xhc3NOYW1lcyA9IGNvbGxlY3RDbGFzc05hbWVzKGFyZ3MpO1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jbGFzc0xpc3QpIHtcbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJ3RvZ2dsZScpXG4gICAgICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKChjbGFzc05hbWUpID0+IG5vZGUuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5vZGUuY2xhc3NMaXN0W29wZXJhdGlvbl0oLi4uY2xhc3NOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdhZGQnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3JlbW92ZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgdG9nZ2xlQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgndG9nZ2xlJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICBzbG90dGVkKHllc05vKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHllc05vKSA/IGlzU2xvdHRlZCA6IGlzTm90U2xvdHRlZCk7XG4gIH1cblxuICBzbG90KHNsb3ROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnNsb3QgPT09IHNsb3ROYW1lKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgaWYgKGVsZW1lbnQuY2xvc2VzdChgc2xvdFtuYW1lPVwiJHtzbG90TmFtZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyl9XCJdYCkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLlF1ZXJ5RW5naW5lID0gUXVlcnlFbmdpbmU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBTSEEyNTYoX2lucHV0KSB7XG4gIGxldCBpbnB1dCA9IF9pbnB1dDtcblxuICBsZXQgbWF0aFBvdyA9IE1hdGgucG93O1xuICBsZXQgbWF4V29yZCA9IG1hdGhQb3coMiwgMzIpO1xuICBsZXQgbGVuZ3RoUHJvcGVydHkgPSAnbGVuZ3RoJztcbiAgbGV0IGk7IGxldCBqOyAvLyBVc2VkIGFzIGEgY291bnRlciBhY3Jvc3MgdGhlIHdob2xlIGZpbGVcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIGxldCB3b3JkcyA9IFtdO1xuICBsZXQgYXNjaWlCaXRMZW5ndGggPSBpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gKiA4O1xuXG4gIC8vKiBjYWNoaW5nIHJlc3VsdHMgaXMgb3B0aW9uYWwgLSByZW1vdmUvYWRkIHNsYXNoIGZyb20gZnJvbnQgb2YgdGhpcyBsaW5lIHRvIHRvZ2dsZVxuICAvLyBJbml0aWFsIGhhc2ggdmFsdWU6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgZmlyc3QgOCBwcmltZXNcbiAgLy8gKHdlIGFjdHVhbGx5IGNhbGN1bGF0ZSB0aGUgZmlyc3QgNjQsIGJ1dCBleHRyYSB2YWx1ZXMgYXJlIGp1c3QgaWdub3JlZClcbiAgbGV0IGhhc2ggPSBTSEEyNTYuaCA9IFNIQTI1Ni5oIHx8IFtdO1xuICAvLyBSb3VuZCBjb25zdGFudHM6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDY0IHByaW1lc1xuICBsZXQgayA9IFNIQTI1Ni5rID0gU0hBMjU2LmsgfHwgW107XG4gIGxldCBwcmltZUNvdW50ZXIgPSBrW2xlbmd0aFByb3BlcnR5XTtcbiAgLyovXG4gICAgbGV0IGhhc2ggPSBbXSwgayA9IFtdO1xuICAgIGxldCBwcmltZUNvdW50ZXIgPSAwO1xuICAgIC8vKi9cblxuICBsZXQgaXNDb21wb3NpdGUgPSB7fTtcbiAgZm9yIChsZXQgY2FuZGlkYXRlID0gMjsgcHJpbWVDb3VudGVyIDwgNjQ7IGNhbmRpZGF0ZSsrKSB7XG4gICAgaWYgKCFpc0NvbXBvc2l0ZVtjYW5kaWRhdGVdKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMzEzOyBpICs9IGNhbmRpZGF0ZSlcbiAgICAgICAgaXNDb21wb3NpdGVbaV0gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGhhc2hbcHJpbWVDb3VudGVyXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMC41KSAqIG1heFdvcmQpIHwgMDtcbiAgICAgIGtbcHJpbWVDb3VudGVyKytdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAxIC8gMykgKiBtYXhXb3JkKSB8IDA7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQgKz0gJ1xceDgwJzsgLy8gQXBwZW5kIMaHJyBiaXQgKHBsdXMgemVybyBwYWRkaW5nKVxuICB3aGlsZSAoaW5wdXRbbGVuZ3RoUHJvcGVydHldICUgNjQgLSA1NilcbiAgICBpbnB1dCArPSAnXFx4MDAnOyAvLyBNb3JlIHplcm8gcGFkZGluZ1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbnB1dFtsZW5ndGhQcm9wZXJ0eV07IGkrKykge1xuICAgIGogPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChqID4+IDgpXG4gICAgICByZXR1cm47IC8vIEFTQ0lJIGNoZWNrOiBvbmx5IGFjY2VwdCBjaGFyYWN0ZXJzIGluIHJhbmdlIDAtMjU1XG4gICAgd29yZHNbaSA+PiAyXSB8PSBqIDw8ICgoMyAtIGkpICUgNCkgKiA4O1xuICB9XG5cbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9ICgoYXNjaWlCaXRMZW5ndGggLyBtYXhXb3JkKSB8IDApO1xuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKGFzY2lpQml0TGVuZ3RoKTtcblxuICAvLyBwcm9jZXNzIGVhY2ggY2h1bmtcbiAgZm9yIChqID0gMDsgaiA8IHdvcmRzW2xlbmd0aFByb3BlcnR5XTspIHtcbiAgICBsZXQgdyA9IHdvcmRzLnNsaWNlKGosIGogKz0gMTYpOyAvLyBUaGUgbWVzc2FnZSBpcyBleHBhbmRlZCBpbnRvIDY0IHdvcmRzIGFzIHBhcnQgb2YgdGhlIGl0ZXJhdGlvblxuICAgIGxldCBvbGRIYXNoID0gaGFzaDtcblxuICAgIC8vIFRoaXMgaXMgbm93IHRoZSB1bmRlZmluZWR3b3JraW5nIGhhc2hcIiwgb2Z0ZW4gbGFiZWxsZWQgYXMgdmFyaWFibGVzIGEuLi5nXG4gICAgLy8gKHdlIGhhdmUgdG8gdHJ1bmNhdGUgYXMgd2VsbCwgb3RoZXJ3aXNlIGV4dHJhIGVudHJpZXMgYXQgdGhlIGVuZCBhY2N1bXVsYXRlXG4gICAgaGFzaCA9IGhhc2guc2xpY2UoMCwgOCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIGludG8gNjQgd29yZHNcbiAgICAgIC8vIFVzZWQgYmVsb3cgaWZcbiAgICAgIGxldCB3MTUgPSB3W2kgLSAxNV07IGxldCB3MiA9IHdbaSAtIDJdO1xuXG4gICAgICAvLyBJdGVyYXRlXG4gICAgICBsZXQgYSA9IGhhc2hbMF07IGxldCBlID0gaGFzaFs0XTtcbiAgICAgIGxldCB0ZW1wMSA9IGhhc2hbN11cbiAgICAgICAgICAgICAgICArICgoKGUgPj4+IDYpIHwgKGUgPDwgMjYpKSBeICgoZSA+Pj4gMTEpIHwgKGUgPDwgMjEpKSBeICgoZSA+Pj4gMjUpIHwgKGUgPDwgNykpKSAvLyBTMVxuICAgICAgICAgICAgICAgICsgKChlICYgaGFzaFs1XSkgXiAoKH5lKSAmIGhhc2hbNl0pKSAvLyBjaFxuICAgICAgICAgICAgICAgICsga1tpXVxuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICArICh3W2ldID0gKGkgPCAxNikgPyB3W2ldIDogKFxuICAgICAgICAgICAgICAgICAgd1tpIC0gMTZdXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcxNSA+Pj4gNykgfCAodzE1IDw8IDI1KSkgXiAoKHcxNSA+Pj4gMTgpIHwgKHcxNSA8PCAxNCkpIF4gKHcxNSA+Pj4gMykpIC8vIHMwXG4gICAgICAgICAgICAgICAgICAgICAgICArIHdbaSAtIDddXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcyID4+PiAxNykgfCAodzIgPDwgMTUpKSBeICgodzIgPj4+IDE5KSB8ICh3MiA8PCAxMykpIF4gKHcyID4+PiAxMCkpIC8vIHMxXG4gICAgICAgICAgICAgICAgKSB8IDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgLy8gVGhpcyBpcyBvbmx5IHVzZWQgb25jZSwgc28gKmNvdWxkKiBiZSBtb3ZlZCBiZWxvdywgYnV0IGl0IG9ubHkgc2F2ZXMgNCBieXRlcyBhbmQgbWFrZXMgdGhpbmdzIHVucmVhZGJsZVxuICAgICAgbGV0IHRlbXAyID0gKCgoYSA+Pj4gMikgfCAoYSA8PCAzMCkpIF4gKChhID4+PiAxMykgfCAoYSA8PCAxOSkpIF4gKChhID4+PiAyMikgfCAoYSA8PCAxMCkpKSAvLyBTMFxuICAgICAgICAgICAgICAgICsgKChhICYgaGFzaFsxXSkgXiAoYSAmIGhhc2hbMl0pIF4gKGhhc2hbMV0gJiBoYXNoWzJdKSk7IC8vIG1halxuXG4gICAgICBoYXNoID0gWyh0ZW1wMSArIHRlbXAyKSB8IDBdLmNvbmNhdChoYXNoKTsgLy8gV2UgZG9uJ3QgYm90aGVyIHRyaW1taW5nIG9mZiB0aGUgZXh0cmEgb25lcywgdGhleSdyZSBoYXJtbGVzcyBhcyBsb25nIGFzIHdlJ3JlIHRydW5jYXRpbmcgd2hlbiB3ZSBkbyB0aGUgc2xpY2UoKVxuICAgICAgaGFzaFs0XSA9IChoYXNoWzRdICsgdGVtcDEpIHwgMDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKVxuICAgICAgaGFzaFtpXSA9IChoYXNoW2ldICsgb2xkSGFzaFtpXSkgfCAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIGZvciAoaiA9IDM7IGogKyAxOyBqLS0pIHtcbiAgICAgIGxldCBiID0gKGhhc2hbaV0gPj4gKGogKiA4KSkgJiAyNTU7XG4gICAgICByZXN1bHQgKz0gKChiIDwgMTYpID8gMCA6ICcnKSArIGIudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5leHBvcnQgY29uc3QgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL25hbWUtdmFsdWUtcGFpci1oZWxwZXInKTtcbmV4cG9ydCBjb25zdCBNWVRISVhfU0hBRE9XX1BBUkVOVCAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvc2hhZG93LXBhcmVudCcpO1xuZXhwb3J0IGNvbnN0IE1ZVEhJWF9UWVBFICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9lbGVtZW50LWRlZmluaXRpb24nKTtcblxuY29uc3QgSURfQ09VTlRfTEVOR1RIICAgICAgICAgPSAxOTtcbmNvbnN0IElTX0NMQVNTICAgICAgICAgICAgICAgID0gKC9eY2xhc3MgXFxTKyBcXHsvKTtcbmNvbnN0IE5BVElWRV9DTEFTU19UWVBFX05BTUVTID0gW1xuICAnQWdncmVnYXRlRXJyb3InLFxuICAnQXJyYXknLFxuICAnQXJyYXlCdWZmZXInLFxuICAnQmlnSW50JyxcbiAgJ0JpZ0ludDY0QXJyYXknLFxuICAnQmlnVWludDY0QXJyYXknLFxuICAnQm9vbGVhbicsXG4gICdEYXRhVmlldycsXG4gICdEYXRlJyxcbiAgJ0RlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlJyxcbiAgJ0Vycm9yJyxcbiAgJ0V2YWxFcnJvcicsXG4gICdGaW5hbGl6YXRpb25SZWdpc3RyeScsXG4gICdGbG9hdDMyQXJyYXknLFxuICAnRmxvYXQ2NEFycmF5JyxcbiAgJ0Z1bmN0aW9uJyxcbiAgJ0ludDE2QXJyYXknLFxuICAnSW50MzJBcnJheScsXG4gICdJbnQ4QXJyYXknLFxuICAnTWFwJyxcbiAgJ051bWJlcicsXG4gICdPYmplY3QnLFxuICAnUHJveHknLFxuICAnUmFuZ2VFcnJvcicsXG4gICdSZWZlcmVuY2VFcnJvcicsXG4gICdSZWdFeHAnLFxuICAnU2V0JyxcbiAgJ1NoYXJlZEFycmF5QnVmZmVyJyxcbiAgJ1N0cmluZycsXG4gICdTeW1ib2wnLFxuICAnU3ludGF4RXJyb3InLFxuICAnVHlwZUVycm9yJyxcbiAgJ1VpbnQxNkFycmF5JyxcbiAgJ1VpbnQzMkFycmF5JyxcbiAgJ1VpbnQ4QXJyYXknLFxuICAnVWludDhDbGFtcGVkQXJyYXknLFxuICAnVVJJRXJyb3InLFxuICAnV2Vha01hcCcsXG4gICdXZWFrUmVmJyxcbiAgJ1dlYWtTZXQnLFxuXTtcblxuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEgPSBOQVRJVkVfQ0xBU1NfVFlQRV9OQU1FUy5tYXAoKHR5cGVOYW1lKSA9PiB7XG4gIHJldHVybiBbIHR5cGVOYW1lLCBnbG9iYWxUaGlzW3R5cGVOYW1lXSBdO1xufSkuZmlsdGVyKChtZXRhKSA9PiBtZXRhWzFdKTtcblxubGV0IGlkQ291bnRlciA9IDBuO1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSUQoKSB7XG4gIGlkQ291bnRlciArPSBCaWdJbnQoMSk7XG4gIHJldHVybiBgJHtEYXRlLm5vdygpfSR7cGFkKGlkQ291bnRlci50b1N0cmluZygpLCBJRF9DT1VOVF9MRU5HVEgpfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXNvbHZhYmxlKCkge1xuICBsZXQgc3RhdHVzID0gJ3BlbmRpbmcnO1xuICBsZXQgcmVzb2x2ZTtcbiAgbGV0IHJlamVjdDtcblxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChfcmVzb2x2ZSwgX3JlamVjdCkgPT4ge1xuICAgIHJlc29sdmUgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmIChzdGF0dXMgPT09ICdwZW5kaW5nJykge1xuICAgICAgICBzdGF0dXMgPSAnZnVsZmlsbGVkJztcbiAgICAgICAgX3Jlc29sdmUodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgcmVqZWN0ID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ3JlamVjdGVkJztcbiAgICAgICAgX3JlamVjdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHByb21pc2UsIHtcbiAgICAncmVzb2x2ZSc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgcmVzb2x2ZSxcbiAgICB9LFxuICAgICdyZWplY3QnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlamVjdCxcbiAgICB9LFxuICAgICdzdGF0dXMnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgICgpID0+IHN0YXR1cyxcbiAgICB9LFxuICAgICdpZCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAgICAgICAgZ2VuZXJhdGVJRCgpLFxuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZU9mKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSlcbiAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gJ051bWJlcic7XG5cbiAgbGV0IHRoaXNUeXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodGhpc1R5cGUgPT09ICdiaWdpbnQnKVxuICAgIHJldHVybiAnQmlnSW50JztcblxuICBpZiAodGhpc1R5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHRoaXNUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsZXQgbmF0aXZlVHlwZU1ldGEgPSBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQS5maW5kKCh0eXBlTWV0YSkgPT4gKHZhbHVlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgICAgaWYgKG5hdGl2ZVR5cGVNZXRhKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke25hdGl2ZVR5cGVNZXRhWzBdfV1gO1xuXG4gICAgICBpZiAodmFsdWUucHJvdG90eXBlICYmIHR5cGVvZiB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgSVNfQ0xBU1MudGVzdCgnJyArIHZhbHVlLnByb3RvdHlwZS5jb25zdHJ1Y3RvcikpXG4gICAgICAgIHJldHVybiBgW0NsYXNzICR7dmFsdWUubmFtZX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG4gICAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgICAgcmV0dXJuIGBbQ2xhc3MgJHtyZXN1bHR9XWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXNUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7dGhpc1R5cGUuc3Vic3RyaW5nKDEpfWA7XG4gIH1cblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpXG4gICAgcmV0dXJuICdTdHJpbmcnO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE51bWJlcilcbiAgICByZXR1cm4gJ051bWJlcic7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbilcbiAgICByZXR1cm4gJ0Jvb2xlYW4nO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgICByZXR1cm4gJ09iamVjdCc7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKCk7XG5cbiAgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ09iamVjdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGUodmFsdWUsIC4uLnR5cGVzKSB7XG4gIGxldCB2YWx1ZVR5cGUgPSB0eXBlT2YodmFsdWUpO1xuICBpZiAodHlwZXMuaW5kZXhPZih2YWx1ZVR5cGUpID49IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIHR5cGVzLnNvbWUoKHR5cGUpID0+ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIodmFsdWUpIHtcbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1R5cGUodmFsdWUsICdOdW1iZXInKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09IG51bGwpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKE9iamVjdC5pcyh2YWx1ZSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyh2YWx1ZSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJ1N0cmluZycsICdOdW1iZXInLCAnQm9vbGVhbicsICdCaWdJbnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29sbGVjdGFibGUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pIHx8IE9iamVjdC5pcyhJbmZpbml0eSkgfHwgT2JqZWN0LmlzKC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJywgJ051bWJlcicsICdCb29sZWFuJywgJ0JpZ0ludCcpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnU3RyaW5nJykgJiYgKC9eW1xcc1xcclxcbl0qJC8pLnRlc3QodmFsdWUpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChpc1R5cGUodmFsdWUubGVuZ3RoLCAnTnVtYmVyJykpXG4gICAgcmV0dXJuICh2YWx1ZS5sZW5ndGggPT09IDApO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KHZhbHVlKSAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm90Tk9FKHZhbHVlKSB7XG4gIHJldHVybiAhaXNOT0UodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9eXFxXLywgJycpXG4gICAgLnJlcGxhY2UoL1tcXFddKyQvLCAnJylcbiAgICAucmVwbGFjZSgvKFtBLVpdKykvZywgJy0kMScpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxXKyguKS9nLCAobSwgcCkgPT4ge1xuICAgICAgcmV0dXJuIHAudG9VcHBlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9eKC4pKC4qKSQvLCAobSwgZiwgbCkgPT4gYCR7Zi50b0xvd2VyQ2FzZSgpfSR7bH1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU25ha2VDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvW0EtWl0rL2csIChtLCBvZmZzZXQpID0+ICgob2Zmc2V0KSA/IGAtJHttLnRvTG93ZXJDYXNlKCl9YCA6IG0udG9Mb3dlckNhc2UoKSkpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTWV0aG9kcyhfcHJvdG8sIHNraXBQcm90b3MpIHtcbiAgbGV0IHByb3RvICAgICAgICAgICA9IF9wcm90bztcbiAgbGV0IGFscmVhZHlWaXNpdGVkICA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAocHJvdG8pIHtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90byk7XG4gICAgbGV0IGtleXMgICAgICAgID0gT2JqZWN0LmtleXMoZGVzY3JpcHRvcnMpLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGRlc2NyaXB0b3JzKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBrZXlzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyB8fCBrZXkgPT09ICdwcm90b3R5cGUnKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyhrZXkpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKGtleSk7XG5cbiAgICAgIGxldCBkZXNjcmlwdG9yID0gZGVzY3JpcHRvcnNba2V5XTtcblxuICAgICAgLy8gQ2FuIGl0IGJlIGNoYW5nZWQ/XG4gICAgICBpZiAoZGVzY3JpcHRvci5jb25maWd1cmFibGUgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gSWYgaXMgZ2V0dGVyLCB0aGVuIHNraXBcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ2dldCcpIHx8IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnc2V0JykpIHtcbiAgICAgICAgbGV0IG5ld0Rlc2NyaXB0b3IgPSB7IC4uLmRlc2NyaXB0b3IgfTtcbiAgICAgICAgaWYgKG5ld0Rlc2NyaXB0b3IuZ2V0KVxuICAgICAgICAgIG5ld0Rlc2NyaXB0b3IuZ2V0ID0gbmV3RGVzY3JpcHRvci5nZXQuYmluZCh0aGlzKTtcblxuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5zZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5zZXQgPSBuZXdEZXNjcmlwdG9yLnNldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIG5ld0Rlc2NyaXB0b3IpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcblxuICAgICAgLy8gU2tpcCBwcm90b3R5cGUgb2YgT2JqZWN0XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIE9iamVjdC5wcm90b3R5cGVba2V5XSA9PT0gdmFsdWUpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgeyAuLi5kZXNjcmlwdG9yLCB2YWx1ZTogdmFsdWUuYmluZCh0aGlzKSB9KTtcbiAgICB9XG5cbiAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgaWYgKHByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgYnJlYWs7XG5cbiAgICBpZiAoc2tpcFByb3RvcyAmJiBza2lwUHJvdG9zLmluZGV4T2YocHJvdG8pID49IDApXG4gICAgICBicmVhaztcbiAgfVxufVxuXG5jb25zdCBNRVRBREFUQV9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ldGFkYXRhKHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICBsZXQgZGF0YSA9IE1FVEFEQVRBX1dFQUtNQVAuZ2V0KHRhcmdldCk7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKVxuICAgIHJldHVybiBkYXRhO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKVxuICAgIHJldHVybiAoZGF0YSkgPyBkYXRhLmdldChrZXkpIDogdW5kZWZpbmVkO1xuXG4gIGlmICghZGF0YSkge1xuICAgIGlmICghaXNDb2xsZWN0YWJsZSh0YXJnZXQpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmNvbnN0IE9CSl9JRF9XRUFLTUFQID0gbmV3IFdlYWtNYXAoKTtcbmxldCBpZENvdW50ID0gMW47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmpJRChvYmopIHtcbiAgbGV0IGlkID0gT0JKX0lEX1dFQUtNQVAuZ2V0KG9iaik7XG4gIGlmIChpZCA9PSBudWxsKSB7XG4gICAgbGV0IHRoaXNJRCA9IGAke2lkQ291bnQrK31gO1xuICAgIE9CSl9JRF9XRUFLTUFQLnNldChvYmosIHRoaXNJRCk7XG5cbiAgICByZXR1cm4gdGhpc0lEO1xuICB9XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy92YWx1ZScpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9DTVQgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvY2xlYW4tbWVtb3J5LXRpbWVyJyk7XG5jb25zdCBEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkcgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9pcy1zZXR0aW5nJyk7XG5jb25zdCBEWU5BTUlDX1BST1BFUlRZX1NFVCAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy9zZXQnKTtcblxuZXhwb3J0IGNsYXNzIER5bmFtaWNQcm9wZXJ0eSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcbiAgc3RhdGljIHNldCA9IERZTkFNSUNfUFJPUEVSVFlfU0VUO1xuXG4gIGNvbnN0cnVjdG9yKGRlZmF1bHRWYWx1ZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgfSxcbiAgICAgIFtEWU5BTUlDX1BST1BFUlRZX0NNVF06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgbnVsbCxcbiAgICAgIH0sXG4gICAgICBbRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBsZXQgcHJveHkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAgKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldCkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IHRhcmdldFtwcm9wTmFtZV07XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpID8gdmFsdWUuYmluZCh0YXJnZXQpIDogdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdO1xuICAgICAgICByZXR1cm4gKHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdKSA6IHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogICh0YXJnZXQsIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgICAgIHRhcmdldFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXVtwcm9wTmFtZV0gPSB2YWx1ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJveHk7XG4gIH1cblxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKVxuICAgICAgcmV0dXJuICt0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIGVsc2UgaWYgKGhpbnQgPT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcblxuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpID8gdmFsdWUudG9TdHJpbmcoKSA6ICgnJyArIHZhbHVlKTtcbiAgfVxuXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXNbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV07XG4gIH1cblxuICBbRFlOQU1JQ19QUk9QRVJUWV9TRVRdKF9uZXdWYWx1ZSkge1xuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10pXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgbmV3VmFsdWUgPSBfbmV3VmFsdWU7XG4gICAgaWYgKGlzVHlwZShuZXdWYWx1ZSwgRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpXG4gICAgICBuZXdWYWx1ZSA9IG5ld1ZhbHVlLnZhbHVlT2YoKTtcblxuICAgIGlmICh0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID09PSBuZXdWYWx1ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10gPSB0cnVlO1xuXG4gICAgICBsZXQgb2xkVmFsdWUgICAgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgICAgbGV0IHVwZGF0ZUV2ZW50ID0gbmV3IEV2ZW50KCd1cGRhdGUnKTtcblxuICAgICAgdXBkYXRlRXZlbnQub3JpZ2luYXRvciA9IHRoaXM7XG4gICAgICB1cGRhdGVFdmVudC5vbGRWYWx1ZSA9IG9sZFZhbHVlO1xuICAgICAgdXBkYXRlRXZlbnQudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodXBkYXRlRXZlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFZBTElEX0pTX0lERU5USUZJRVIgPSAvXlthLXpBLVpfJF1bYS16QS1aMC05XyRdKiQvO1xuZnVuY3Rpb24gZ2V0Q29udGV4dENhbGxBcmdzKGNvbnRleHQsIC4uLmV4dHJhQ29udGV4dHMpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IEFycmF5LmZyb20oXG4gICAgbmV3IFNldChnZXRBbGxQcm9wZXJ0eU5hbWVzKGNvbnRleHQpLmNvbmNhdChcbiAgICAgIE9iamVjdC5rZXlzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pLFxuICAgICAgWyAnYXR0cmlidXRlcycsICdjbGFzc0xpc3QnLCAnJCQnLCAnaTE4bicgXSxcbiAgICAgIC4uLmV4dHJhQ29udGV4dHMubWFwKChleHRyYUNvbnRleHQpID0+IE9iamVjdC5rZXlzKGV4dHJhQ29udGV4dCB8fCB7fSkpLFxuICAgICkpLFxuICApLmZpbHRlcigobmFtZSkgPT4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpKTtcblxuICByZXR1cm4gYHske2NvbnRleHRDYWxsQXJncy5qb2luKCcsJyl9fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKCFlbGVtZW50KVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmIChlbGVtZW50LnBhcmVudE5vZGUgJiYgZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIG1ldGFkYXRhKGVsZW1lbnQucGFyZW50Tm9kZSwgTVlUSElYX1NIQURPV19QQVJFTlQpO1xuXG4gIGlmICghZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gbWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX1NIQURPV19QQVJFTlQpO1xuXG4gIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTY29wZSguLi5fdGFyZ2V0cykge1xuICBjb25zdCBmaW5kUHJvcE5hbWVTY29wZSA9ICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHRhcmdldCA9PSBudWxsIHx8IE9iamVjdC5pcyh0YXJnZXQsIE5hTikpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAocHJvcE5hbWUgaW4gdGFyZ2V0KVxuICAgICAgcmV0dXJuIHRhcmdldDtcblxuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgZmV0Y2hQdWJsaXNoQ29udGV4dCA9IChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgaWYgKCFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgY29tcG9uZW50UHVibGlzaENvbnRleHQ7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiBjdXJyZW50RWxlbWVudClcbiAgICAgICAgICByZXR1cm4gY3VycmVudEVsZW1lbnQ7XG5cbiAgICAgICAgY29tcG9uZW50UHVibGlzaENvbnRleHQgPSBjdXJyZW50RWxlbWVudC5wdWJsaXNoQ29udGV4dDtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnRQdWJsaXNoQ29udGV4dCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQpO1xuXG4gICAgICBpZiAoIWNvbXBvbmVudFB1Ymxpc2hDb250ZXh0IHx8ICFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgcHVibGlzaGVkQ29udGV4dCA9IGNvbXBvbmVudFB1Ymxpc2hDb250ZXh0LmNhbGwoY3VycmVudEVsZW1lbnQpO1xuICAgICAgaWYgKCFwdWJsaXNoZWRDb250ZXh0IHx8ICEocHJvcE5hbWUgaW4gcHVibGlzaGVkQ29udGV4dCkpXG4gICAgICAgIHJldHVybiBmZXRjaFB1Ymxpc2hDb250ZXh0KGdldFBhcmVudE5vZGUoY3VycmVudEVsZW1lbnQpKTtcblxuICAgICAgcmV0dXJuIHB1Ymxpc2hlZENvbnRleHQ7XG4gICAgfTtcblxuICAgIHJldHVybiBmZXRjaFB1Ymxpc2hDb250ZXh0KHRhcmdldCk7XG4gIH07XG5cbiAgbGV0IHRhcmdldHMgICAgICAgICA9IF90YXJnZXRzLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZpcnN0RWxlbWVudCAgICA9IHRhcmdldHMuZmluZCgodGFyZ2V0KSA9PiAodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHx8IHRhcmdldHNbMF07XG4gIGxldCBiYXNlQ29udGV4dCAgICAgPSB7fTtcbiAgbGV0IGZhbGxiYWNrQ29udGV4dCA9IHtcbiAgICBnbG9iYWxTY29wZTogIChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpLFxuICAgIGkxOG46ICAgICAgICAgKHBhdGgsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGxhbmd1YWdlUHJvdmlkZXIgPSBzcGVjaWFsQ2xvc2VzdChmaXJzdEVsZW1lbnQsICdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlcilcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgICAgcmV0dXJuIGxhbmd1YWdlUHJvdmlkZXIuaTE4bihwYXRoLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0sXG4gICAgZHluYW1pY1Byb3BJRCxcbiAgfTtcblxuICB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoZmFsbGJhY2tDb250ZXh0KTtcbiAgbGV0IHByb3h5ICAgPSBuZXcgUHJveHkoYmFzZUNvbnRleHQsIHtcbiAgICBvd25LZXlzOiAoKSA9PiB7XG4gICAgICBsZXQgYWxsS2V5cyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cylcbiAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KGdldEFsbFByb3BlcnR5TmFtZXModGFyZ2V0KSk7XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKGdsb2JhbFNjb3BlKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoT2JqZWN0LmtleXMoZ2xvYmFsU2NvcGUpKTtcblxuICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhbGxLZXlzKSk7XG4gICAgfSxcbiAgICBoYXM6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gKHByb3BOYW1lIGluIGdsb2JhbFNjb3BlKTtcbiAgICB9LFxuICAgIGdldDogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gc2NvcGVbcHJvcE5hbWVdO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIGdsb2JhbFNjb3BlW3Byb3BOYW1lXTtcbiAgICB9LFxuICAgIHNldDogKF8sIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgZG9TZXQgPSAoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoaXNUeXBlKHNjb3BlW3Byb3BOYW1lXSwgRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNjb3BlW3Byb3BOYW1lXSA9IHZhbHVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcblxuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIGRvU2V0KHNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgcmV0dXJuIGRvU2V0KGdsb2JhbFNjb3BlLCBwcm9wTmFtZSwgdmFsdWUpO1xuICAgIH0sXG4gIH0pO1xuXG4gIGZhbGxiYWNrQ29udGV4dC4kJCA9IHByb3h5O1xuXG4gIHJldHVybiBwcm94eTtcbn1cblxuY29uc3QgRVZFTlRfQUNUSU9OX0pVU1RfTkFNRSA9IC9eJT9bXFx3LiRdKyQvO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlTWFjcm8oeyBwcmVmaXgsIGJvZHksIHNjb3BlIH0pIHtcbiAgbGV0IGZ1bmN0aW9uQm9keSA9IGJvZHk7XG4gIGlmIChFVkVOVF9BQ1RJT05fSlVTVF9OQU1FLnRlc3QoZnVuY3Rpb25Cb2R5KSkge1xuICAgIGlmIChmdW5jdGlvbkJvZHkuY2hhckF0KDApID09PSAnJScpIHtcbiAgICAgIGZ1bmN0aW9uQm9keSA9IGAodGhpcy5keW5hbWljUHJvcElEIHx8IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCkoJyR7ZnVuY3Rpb25Cb2R5LnN1YnN0cmluZygxKS50cmltKCkucmVwbGFjZSgvW15cXHckXS9nLCAnJyl9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgX19fXyQgPSAke2Z1bmN0aW9uQm9keX07XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgX19fXyQgPT09ICdmdW5jdGlvbicpID8gX19fXyQuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKSA6IF9fX18kO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJHtmdW5jdGlvbkJvZHl9LmFwcGx5KHRoaXMsIEFycmF5LmZyb20oYXJndW1lbnRzKS5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgIH0pKCk7YDtcbiAgICB9XG4gIH1cblxuICBsZXQgY29udGV4dENhbGxBcmdzID0gZ2V0Q29udGV4dENhbGxBcmdzKHNjb3BlKTtcblxuICBmdW5jdGlvbkJvZHkgPSBgJHsocHJlZml4KSA/IGAke3ByZWZpeH07YCA6ICcnfXJldHVybiAkeyhmdW5jdGlvbkJvZHkgfHwgJyh2b2lkIDApJykucmVwbGFjZSgvXlxccypyZXR1cm5cXHMrLywgJycpLnRyaW0oKX07YDtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKHNjb3BlLCBzY29wZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlUGFydHModGV4dCwgX29wdGlvbnMpIHtcbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHNjb3BlICAgICAgICAgPSBvcHRpb25zLnNjb3BlO1xuICBsZXQgcGFydHMgICAgICAgICA9IFtdO1xuICBsZXQgY3VycmVudE9mZnNldCA9IDA7XG5cbiAgdGV4dC5yZXBsYWNlKC8oPzwhXFxcXCkoQEApKC4rPylcXDEvZywgKG0sIHN0YXJ0LCBtYWNybywgb2Zmc2V0KSA9PiB7XG4gICAgaWYgKGN1cnJlbnRPZmZzZXQgPCBvZmZzZXQpXG4gICAgICBwYXJ0cy5wdXNoKHsgdHlwZTogJ2xpdGVyYWwnLCB2YWx1ZTogdGV4dC5zdWJzdHJpbmcoY3VycmVudE9mZnNldCwgb2Zmc2V0KSB9KTtcblxuICAgIGN1cnJlbnRPZmZzZXQgPSBvZmZzZXQgKyBtLmxlbmd0aDtcblxuICAgIGxldCBtZXRob2QgID0gY3JlYXRlVGVtcGxhdGVNYWNybyh7IGJvZHk6IG1hY3JvLCBzY29wZSB9KTtcbiAgICBsZXQgdmFsdWUgICA9IG1ldGhvZCgpO1xuXG4gICAgcGFydHMucHVzaCh7IHR5cGU6ICdtYWNybycsIHZhbHVlLCBtZXRob2QgfSk7XG4gIH0pO1xuXG4gIGlmIChjdXJyZW50T2Zmc2V0IDwgdGV4dC5sZW5ndGgpXG4gICAgcGFydHMucHVzaCh7IHR5cGU6ICdsaXRlcmFsJywgdmFsdWU6IHRleHQuc3Vic3RyaW5nKGN1cnJlbnRPZmZzZXQpIH0pO1xuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyhwYXJ0cykge1xuICBsZXQgcmVzdWx0ID0gcGFydHNcbiAgICAubWFwKChwYXJ0KSA9PiBwYXJ0LnZhbHVlKVxuICAgIC5maWx0ZXIoKGl0ZW0pID0+IChpdGVtICE9IG51bGwgJiYgaXRlbSAhPT0gJycpKTtcblxuICBpZiAocmVzdWx0LnNvbWUoKGl0ZW0pID0+IChpdGVtW01ZVEhJWF9UWVBFXSA9PT0gJ0VsZW1lbnREZWZpbml0aW9uJyB8fCBpdGVtW01ZVEhJWF9UWVBFXSA9PT0gJ1F1ZXJ5RW5naW5lJykpKVxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgaWYgKHJlc3VsdC5zb21lKChpdGVtKSA9PiBpc1R5cGUoaXRlbSwgJ1N0cmluZycpKSlcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuXG4gIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogcmVzdWx0O1xufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE5vZGVWYWx1ZShub2RlLCBfb3B0aW9ucykge1xuICBpZiAobm9kZS5wYXJlbnROb2RlICYmICgvXihzdHlsZXxzY3JpcHQpJC8pLnRlc3Qobm9kZS5wYXJlbnROb2RlLmxvY2FsTmFtZSkpXG4gICAgcmV0dXJuIG5vZGUubm9kZVZhbHVlO1xuXG4gIGlmICghbm9kZSB8fCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMuaW5kZXhPZihub2RlLm5vZGVUeXBlKSA8IDApXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJmb3JtYXROb2RlVmFsdWVcIiB1bnN1cHBvcnRlZCBub2RlIHR5cGUgcHJvdmlkZWQuIE9ubHkgVEVYVF9OT0RFIGFuZCBBVFRSSUJVVEVfTk9ERSB0eXBlcyBhcmUgc3VwcG9ydGVkLicpO1xuXG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCB0ZXh0ICAgICAgICAgID0gbm9kZS5ub2RlVmFsdWU7XG4gIGxldCB0ZW1wbGF0ZVBhcnRzID0gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIG9wdGlvbnMpO1xuXG4gIHRlbXBsYXRlUGFydHMuZm9yRWFjaCgoeyB2YWx1ZSB9KSA9PiB7XG4gICAgaWYgKG9wdGlvbnMuYmluZFRvRHluYW1pY1Byb3BlcnRpZXMgIT09IGZhbHNlICYmIGlzVHlwZSh2YWx1ZSwgRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpIHtcbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICgnJyArIGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKSk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG5vZGUubm9kZVZhbHVlKVxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcmVzdWx0O1xuICAgICAgfSwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IHJlc3VsdCA9IGNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0cyh0ZW1wbGF0ZVBhcnRzKTtcbiAgaWYgKHJlc3VsdCA9PSBudWxsKVxuICAgIHJlc3VsdCA9ICcnO1xuXG4gIHJldHVybiAob3B0aW9ucy5kaXNhbGxvd0hUTUwgPT09IHRydWUpID8gKCcnICsgcmVzdWx0KSA6IHJlc3VsdDtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgPSAvKD88IVxcXFwpQEAvO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVGVtcGxhdGUodmFsdWUpIHtcbiAgaWYgKCFpc1R5cGUodmFsdWUsICdTdHJpbmcnKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIElTX1RFTVBMQVRFLnRlc3QodmFsdWUpO1xufVxuXG5jb25zdCBJU19FVkVOVF9OQU1FICAgICA9IC9eb24vO1xuY29uc3QgRVZFTlRfTkFNRV9DQUNIRSAgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KSB7XG4gIGxldCB0YWdOYW1lID0gKCFlbGVtZW50LnRhZ05hbWUpID8gZWxlbWVudCA6IGVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuICBsZXQgY2FjaGUgICA9IEVWRU5UX05BTUVfQ0FDSEUuZ2V0KHRhZ05hbWUpO1xuICBpZiAoY2FjaGUpXG4gICAgcmV0dXJuIGNhY2hlO1xuXG4gIGxldCBldmVudE5hbWVzID0gW107XG5cbiAgZm9yIChsZXQga2V5IGluIGVsZW1lbnQpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDIgJiYgSVNfRVZFTlRfTkFNRS50ZXN0KGtleSkpXG4gICAgICBldmVudE5hbWVzLnB1c2goa2V5LnRvTG93ZXJDYXNlKCkpO1xuICB9XG5cbiAgRVZFTlRfTkFNRV9DQUNIRS5zZXQodGFnTmFtZSwgZXZlbnROYW1lcyk7XG5cbiAgcmV0dXJuIGV2ZW50TmFtZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRUb0VsZW1lbnQoZWxlbWVudCwgZXZlbnROYW1lLCBfY2FsbGJhY2spIHtcbiAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgbGV0IGNhbGxiYWNrO1xuXG4gIGlmIChpc1BsYWluT2JqZWN0KF9jYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayAgPSBfY2FsbGJhY2suY2FsbGJhY2s7XG4gICAgb3B0aW9ucyAgID0gX2NhbGxiYWNrLm9wdGlvbnMgfHwge307XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBfY2FsbGJhY2s7XG4gIH1cblxuICBpZiAoaXNUeXBlKGNhbGxiYWNrLCAnU3RyaW5nJykpXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4OiAnbGV0IGV2ZW50PWFyZ3VtZW50c1sxXScsIGJvZHk6IGNhbGxiYWNrLCBzY29wZTogdGhpcyB9KTtcblxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHsgY2FsbGJhY2ssIG9wdGlvbnMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUGF0aChvYmosIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmIChvYmogPT0gbnVsbCB8fCBPYmplY3QuaXMob2JqLCBOYU4pIHx8IE9iamVjdC5pcyhvYmosIEluZmluaXR5KSB8fCBPYmplY3QuaXMob2JqLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgaWYgKGtleSA9PSBudWxsIHx8IE9iamVjdC5pcyhrZXksIE5hTikgfHwgT2JqZWN0LmlzKGtleSwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhrZXksIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBsZXQgcGFydHMgICAgICAgICA9IGtleS5zcGxpdCgvXFwuL2cpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGN1cnJlbnRWYWx1ZSAgPSBvYmo7XG5cbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gcGFydHMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgIGxldCBwYXJ0ID0gcGFydHNbaV07XG4gICAgbGV0IG5leHRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwYXJ0XTtcbiAgICBpZiAobmV4dFZhbHVlID09IG51bGwpXG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gICAgY3VycmVudFZhbHVlID0gbmV4dFZhbHVlO1xuICB9XG5cbiAgaWYgKGdsb2JhbFRoaXMuTm9kZSAmJiBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlIGluc3RhbmNlb2YgZ2xvYmFsVGhpcy5Ob2RlICYmIChjdXJyZW50VmFsdWUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5BVFRSSUJVVEVfTk9ERSkpXG4gICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5ub2RlVmFsdWU7XG5cbiAgcmV0dXJuIChjdXJyZW50VmFsdWUgPT0gbnVsbCkgPyBkZWZhdWx0VmFsdWUgOiBjdXJyZW50VmFsdWU7XG59XG5cbmNvbnN0IElTX05VTUJFUiA9IC9eKFstK10/KShcXGQqKD86XFwuXFxkKyk/KShlWy0rXVxcZCspPyQvO1xuY29uc3QgSVNfQk9PTEVBTiA9IC9eKHRydWV8ZmFsc2UpJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ05hTicpXG4gICAgcmV0dXJuIE5hTjtcblxuICBpZiAodmFsdWUgPT09ICdJbmZpbml0eScgfHwgdmFsdWUgPT09ICcrSW5maW5pdHknKVxuICAgIHJldHVybiBJbmZpbml0eTtcblxuICBpZiAodmFsdWUgPT09ICctSW5maW5pdHknKVxuICAgIHJldHVybiAtSW5maW5pdHk7XG5cbiAgaWYgKElTX05VTUJFUi50ZXN0KHZhbHVlKSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG5cbiAgaWYgKElTX0JPT0xFQU4udGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuICh2YWx1ZSA9PT0gJ3RydWUnKTtcblxuICByZXR1cm4gKCcnICsgdmFsdWUpO1xufVxuXG5jb25zdCBDQUNIRURfUFJPUEVSVFlfTkFNRVMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgU0tJUF9QUk9UT1RZUEVTICAgICAgID0gW1xuICBnbG9iYWxUaGlzLkhUTUxFbGVtZW50LFxuICBnbG9iYWxUaGlzLk5vZGUsXG4gIGdsb2JhbFRoaXMuRWxlbWVudCxcbiAgZ2xvYmFsVGhpcy5PYmplY3QsXG4gIGdsb2JhbFRoaXMuQXJyYXksXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvcGVydHlOYW1lcyhfb2JqKSB7XG4gIGlmICghaXNDb2xsZWN0YWJsZShfb2JqKSlcbiAgICByZXR1cm4gW107XG5cbiAgbGV0IGNhY2hlZE5hbWVzID0gQ0FDSEVEX1BST1BFUlRZX05BTUVTLmdldChfb2JqKTtcbiAgaWYgKGNhY2hlZE5hbWVzKVxuICAgIHJldHVybiBjYWNoZWROYW1lcztcblxuICBsZXQgb2JqICAgPSBfb2JqO1xuICBsZXQgbmFtZXMgPSBuZXcgU2V0KCk7XG5cbiAgd2hpbGUgKG9iaikge1xuICAgIGxldCBvYmpOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gb2JqTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgIG5hbWVzLmFkZChvYmpOYW1lc1tpXSk7XG5cbiAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAob2JqICYmIFNLSVBfUFJPVE9UWVBFUy5pbmRleE9mKG9iai5jb25zdHJ1Y3RvcikgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgbGV0IGZpbmFsTmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKTtcbiAgQ0FDSEVEX1BST1BFUlRZX05BTUVTLnNldChfb2JqLCBmaW5hbE5hbWVzKTtcblxuICByZXR1cm4gZmluYWxOYW1lcztcbn1cblxuY29uc3QgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXREeW5hbWljUHJvcGVydHlGb3JQYXRoKGtleVBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICBsZXQgaW5zdGFuY2VDYWNoZSA9IExBTkdfUFJPVklERVJfRFlOQU1JQ19QUk9QRVJUWV9DQUNIRS5nZXQodGhpcyk7XG4gIGlmICghaW5zdGFuY2VDYWNoZSkge1xuICAgIGluc3RhbmNlQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLnNldCh0aGlzLCBpbnN0YW5jZUNhY2hlKTtcbiAgfVxuXG4gIGxldCBwcm9wZXJ0eSA9IGluc3RhbmNlQ2FjaGUuZ2V0KGtleVBhdGgpO1xuICBpZiAoIXByb3BlcnR5KSB7XG4gICAgcHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG4gICAgaW5zdGFuY2VDYWNoZS5zZXQoa2V5UGF0aCwgcHJvcGVydHkpO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BlY2lhbENsb3Nlc3Qobm9kZSwgc2VsZWN0b3IpIHtcbiAgaWYgKCFub2RlIHx8ICFzZWxlY3RvcilcbiAgICByZXR1cm47XG5cbiAgbGV0IGN1cnJlbnROb2RlID0gbm9kZTtcbiAgd2hpbGUgKGN1cnJlbnROb2RlICYmICh0eXBlb2YgY3VycmVudE5vZGUubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJyB8fCAhY3VycmVudE5vZGUubWF0Y2hlcyhzZWxlY3RvcikpKVxuICAgIGN1cnJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShjdXJyZW50Tm9kZSk7XG5cbiAgcmV0dXJuIGN1cnJlbnROb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyB8fCAwKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljUHJvcChuYW1lLCBkZWZhdWx0VmFsdWUsIHNldHRlcikge1xuICBsZXQgZHluYW1pY1Byb3BlcnR5ID0gbmV3IER5bmFtaWNQcm9wZXJ0eShkZWZhdWx0VmFsdWUpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICBbbmFtZV06IHtcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogICAgICAgICAgKCkgPT4gZHluYW1pY1Byb3BlcnR5LFxuICAgICAgc2V0OiAgICAgICAgICAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0ZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHNldHRlcihuZXdWYWx1ZSkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIGR5bmFtaWNQcm9wZXJ0eTtcbn1cblxuY29uc3QgRFlOQU1JQ19QUk9QX1JFR0lTVFJZID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNQcm9wSUQoaWQpIHtcbiAgbGV0IHByb3AgPSBEWU5BTUlDX1BST1BfUkVHSVNUUlkuZ2V0KGlkKTtcbiAgaWYgKHByb3ApXG4gICAgcmV0dXJuIHByb3A7XG5cbiAgcHJvcCA9IG5ldyBEeW5hbWljUHJvcGVydHkoJycpO1xuICBEWU5BTUlDX1BST1BfUkVHSVNUUlkuc2V0KGlkLCBwcm9wKTtcblxuICByZXR1cm4gcHJvcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlTmFtZVZhbHVlUGFpckhlbHBlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIG1ldGFkYXRhKFxuICAgIHRhcmdldCxcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUixcbiAgICBbIG5hbWUsIHZhbHVlIF0sXG4gICk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUyA9IG5ldyBTZXQoWyAnW2RhdGEtdGVtcGxhdGVzLWRpc2FibGVdJywgJ215dGhpeC1mb3ItZWFjaCcgXSk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMpLmpvaW4oJywnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5hZGQoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuZGVsZXRlKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gZ2xvYmFsU3RvcmVIZWxwZXIoZHluYW1pYywgYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IHNldE9uR2xvYmFsID0gKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV07XG4gICAgaWYgKGlzVHlwZShjdXJyZW50VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSwgJ0R5bmFtaWNQcm9wZXJ0eScpKSB7XG4gICAgICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlW25hbWVdW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcbiAgICAgIHJldHVybiBjdXJyZW50VmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGlzVHlwZSh2YWx1ZSwgRHluYW1pY1Byb3BlcnR5LCAnRHluYW1pY1Byb3BlcnR5JykpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUsIHtcbiAgICAgICAgW25hbWVdOiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgICgpID0+IHZhbHVlLFxuICAgICAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZVtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICBsZXQgcHJvcCA9IGR5bmFtaWNQcm9wSUQobmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBwcm9wLFxuICAgICAgICAgIHNldDogICAgICAgICAgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG5ld1ZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHByb3BbRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuXG4gICAgICByZXR1cm4gcHJvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgbmFtZVZhbHVlUGFpciA9IG1ldGFkYXRhKGFyZ3NbMF0sIE1ZVEhJWF9OQU1FX1ZBTFVFX1BBSVJfSEVMUEVSKTtcbiAgaWYgKG5hbWVWYWx1ZVBhaXIpIHtcbiAgICBsZXQgWyBuYW1lLCB2YWx1ZSBdID0gbmFtZVZhbHVlUGFpcjtcbiAgICBzZXRPbkdsb2JhbChuYW1lLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPiAxICYmIGlzVHlwZShhcmdzWzBdLCAnU3RyaW5nJykpIHtcbiAgICBsZXQgbmFtZSAgPSBhcmdzWzBdO1xuICAgIGxldCB2YWx1ZSA9IGFyZ3NbMV07XG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGxldCB2YWx1ZSA9IGFyZ3NbMF07XG4gICAgbGV0IG5hbWUgID0gKHR5cGVvZiB0aGlzLmdldElkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpID8gdGhpcy5nZXRJZGVudGlmaWVyKCkgOiAodGhpcy5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ25hbWUnKSk7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIm15dGhpeFVJLmdsb2JhbFN0b3JlXCI6IFwibmFtZVwiIGlzIHVua25vd24sIHNvIHVuYWJsZSB0byBzdG9yZSB2YWx1ZScpO1xuXG4gICAgc2V0T25HbG9iYWwobmFtZSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZSguLi5hcmdzKSB7XG4gIHJldHVybiBnbG9iYWxTdG9yZUhlbHBlci5jYWxsKHRoaXMsIGZhbHNlLCBhcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlRHluYW1pYyguLi5hcmdzKSB7XG4gIHJldHVybiBnbG9iYWxTdG9yZUhlbHBlci5jYWxsKHRoaXMsIHRydWUsIGFyZ3MpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIWdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUudXJsKVxuICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLnVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pO1xuXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIENvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnQuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5cbmV4cG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgKiBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5leHBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gJy4vY29tcG9uZW50LmpzJztcbmV4cG9ydCAqIGFzIEVsZW1lbnRzIGZyb20gJy4vZWxlbWVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9teXRoaXgtdWktcmVxdWlyZS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1sYW5ndWFnZS1wcm92aWRlci5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1zcGlubmVyLmpzJztcblxuY29uc3QgTXl0aGl4VUlDb21wb25lbnQgPSBDb21wb25lbnRzLk15dGhpeFVJQ29tcG9uZW50O1xuXG5leHBvcnQge1xuICBNeXRoaXhVSUNvbXBvbmVudCxcbn07XG5cbmxldCBfbXl0aGl4SXNSZWFkeSA9IGZhbHNlO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAnb25teXRoaXhyZWFkeSc6IHtcbiAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICAgICAgICAgICgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2V0OiAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgIGlmIChfbXl0aGl4SXNSZWFkeSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGNhbGxiYWNrKG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdteXRoaXgtcmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLlV0aWxzID0gVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkNvbXBvbmVudHMgPSBDb21wb25lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5FbGVtZW50cyA9IEVsZW1lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZSA9IFV0aWxzLmdsb2JhbFN0b3JlO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZUR5bmFtaWMgPSBVdGlscy5nbG9iYWxTdG9yZUR5bmFtaWM7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiBVdGlscy5keW5hbWljUHJvcElEKGlkKTtcbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxldCBkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzID0gZmFsc2U7XG5cbiAgY29uc3Qgb25Eb2N1bWVudFJlYWR5ID0gKCkgPT4ge1xuICAgIGlmICghZGlkVmlzaWJpbGl0eU9ic2VydmVycykge1xuICAgICAgbGV0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1teXRoaXgtc3JjXScpKTtcbiAgICAgIENvbXBvbmVudHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IGRpc2Nvbm5lY3QsIGVsZW1lbnQsIHdhc1Zpc2libGUgfSkgPT4ge1xuICAgICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJyk7XG4gICAgICAgIGlmICghc3JjKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBDb21wb25lbnRzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgeyBlbGVtZW50cyB9KTtcblxuICAgICAgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IHRydWU7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcblxuICAgIGlmIChfbXl0aGl4SXNSZWFkeSlcbiAgICAgIHJldHVybjtcblxuICAgIF9teXRoaXhJc1JlYWR5ID0gdHJ1ZTtcblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAgICckJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciguLi5hcmdzKSxcbiAgICB9LFxuICAgICckJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoLi4uYXJncyksXG4gICAgfSxcbiAgfSk7XG5cbiAgbGV0IGRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiAgPSBtdXRhdGlvbnNbaV07XG4gICAgICBsZXQgdGFyZ2V0ICAgID0gbXV0YXRpb24udGFyZ2V0O1xuXG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0eXBlb2YgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IChhdHRyaWJ1dGVOb2RlKSA/IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlIDogbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5pc1RlbXBsYXRlKG5ld1ZhbHVlKSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZSh0YXJnZXQpLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG5cbiAgICAgICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcyA9IHRhcmdldC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMgJiYgb2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobXV0YXRpb24uYXR0cmlidXRlTmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbCh0YXJnZXQsIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgbGV0IGRpc2FibGVUZW1wbGF0aW5nID0gKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyICYmIHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXSxteXRoaXgtZm9yLWVhY2gnKSk7XG4gICAgICAgIGxldCBhZGRlZE5vZGVzICAgICAgICA9IG11dGF0aW9uLmFkZGVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IGFkZGVkTm9kZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIGxldCBub2RlID0gYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIGlmIChub2RlW0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdICYmIG5vZGUub25NdXRhdGlvbkFkZGVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCFkaXNhYmxlVGVtcGxhdGluZylcbiAgICAgICAgICAgIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlKTtcblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbW92ZWROb2RlcyA9IG11dGF0aW9uLnJlbW92ZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IHJlbW92ZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25SZW1vdmVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5vbk11dGF0aW9uQ2hpbGRSZW1vdmVkKG5vZGUsIG11dGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBzdWJ0cmVlOiAgICAgICAgICAgIHRydWUsXG4gICAgY2hpbGRMaXN0OiAgICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6ICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogIHRydWUsXG4gIH0pO1xuXG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5oZWFkKTtcbiAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzKGRvY3VtZW50LmJvZHkpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKVxuICAgICAgb25Eb2N1bWVudFJlYWR5KCk7XG4gICAgZWxzZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG4gIH0sIDI1MCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkRvY3VtZW50UmVhZHkpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9