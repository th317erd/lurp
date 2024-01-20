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

/***/ "./lib/components.js":
/*!***************************!*\
  !*** ./lib/components.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MYTHIX_DOCUMENT_INITIALIZED: () => (/* binding */ MYTHIX_DOCUMENT_INITIALIZED),
/* harmony export */   MYTHIX_INTERSECTION_OBSERVERS: () => (/* binding */ MYTHIX_INTERSECTION_OBSERVERS),
/* harmony export */   MYTHIX_UI_COMPONENT_TYPE: () => (/* binding */ MYTHIX_UI_COMPONENT_TYPE),
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   getIdentifier: () => (/* binding */ getIdentifier),
/* harmony export */   getLargestDocumentTabIndex: () => (/* binding */ getLargestDocumentTabIndex),
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




/**
 * type: Namespace
 * name: Components
 * groupName: Components
 * desc: |
 *   `import { Components } from 'mythix-ui-core@1.0';`
 *
 *   Component and framework classes and functionality are found here.
 * properties:
 *   - name: isMythixComponent
 *     dataType: symbol
 *     desc: |
 *       This symbol is used as an instance key for @see MythixUIComponent; instances.
 *
 *       For such instances, accessing this property simply returns `true`, allowing the caller
 *       to know if a specific instance (Element) is a Mythix UI component.
 *   - name: MYTHIX_INTERSECTION_OBSERVERS
 *     dataType: symbol
 *     desc: |
 *       This symbol is used as a @see Utils.metadata; key against elements with a `data-src` attribute.
 *       For elements with this attribute, set an [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is setup.
 *       When the intersection observer reports that the element is visible, then the URL specified by `data-src` is fetched, and dumped into
 *       the element as its children. This allows for dynamic "partials" that are loaded at run-time.
 *
 *       The value stored at this @see Utils.metadata; key is a Map of [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
 *       instances. The keys of this map are the intersection observers themselves. The values are raw objects with the shape
 *       `{ wasVisible: boolean, ratioVisible: float, previousVisibility: boolean, visibility: boolean }`.
 */

const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

const isMythixComponent              = Symbol.for('@mythix/mythix-ui/component/constants/is-mythix-component'); // @ref:Components.isMythixComponent
const MYTHIX_INTERSECTION_OBSERVERS  = Symbol.for('@mythix/mythix-ui/component/constants/intersection-observers'); // @ref:Components.MYTHIX_INTERSECTION_OBSERVERS
const MYTHIX_DOCUMENT_INITIALIZED    = Symbol.for('@mythix/mythix-ui/component/constants/document-initialized'); // @ref:Components.MYTHIX_DOCUMENT_INITIALIZED

const MYTHIX_UI_COMPONENT_TYPE       = Symbol.for('@mythix/mythix-ui/types/MythixUI::MythixUIComponent');

/***
 * groupName: Components
 * desc: |
 *   This the base class of all Mythix UI components. It inherits
 *   from HTMLElement, and so will end up being a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components).
 *
 *   It is strongly recommended that you fully read up and understand
 *   [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components)
 *   if you don't already fully understand them. The core of Mythix UI is the
 *   [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) standard,
 *   so you might end up a little confused if you don't already understand the foundation.
 *
 * properties:
 *   - caption: "... HTMLElement Instance Properties"
 *     desc: "All [HTMLElement Instance Properties](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties) are inherited from [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)"
 *     link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#instance_properties
 *
 *   - name: isMythixComponent
 *     dataType: boolean
 *     caption: "[static MythixUIComponent.isMythixComponent]"
 *     desc: |
 *       Is `true` for Mythix UI components.
 *   - name: sensitiveTagName
 *     dataType: string
 *     caption: sensitiveTagName
 *     desc: |
 *       Works identically to [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) for XML, where case is preserved.
 *       In HTML this works like [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName), but instead of the result
 *       always being UPPERCASE, the tag name will be returned with the casing preserved.
 *   - name: templateID
 *     dataType: string
 *     caption: templateID
 *     desc: |
 *       This is a convenience property that returns the value of `this.constructor.TEMPLATE_ID`
 *   - name: delayTimers
 *     dataType: "Map&lt;string, Promise&gt;"
 *     caption: delayTimers
 *     desc: |
 *       A Map instance that
 *       retains `setTimeout` ids so that @see MythixUIComponent.debounce; can properly function. Keys are @see MythixUIComponent.debounce;
 *       timer ids (of type `string`). Values are Promise instances.
 *       Each promise instance also has a special key `timerID` that contains a `setTimeout` id of a javascript timer.
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *       - |
 *         :eye: @see MythixUIComponent.debounce;
 *   - name: shadow
 *     dataType: "[ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)"
 *     caption: shadow
 *     desc: |
 *       The shadow root of this component (or `null` if none).
 *     notes:
 *       - This is the cached result of calling @see MythixUIComponent.createShadowDOM; when
 *         the component is first initialized.
 *   - name: template
 *     dataType: "[template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)"
 *     caption: template
 *     desc: |
 *       The [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element for this
 *       component, or `null` if there is no template found for the component.
 *     notes:
 *       - This is the cached result of calling @see MythixUIComponent.getComponentTemplate; when
 *         the component is first initialized.
***/

class MythixUIComponent extends HTMLElement {
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === MYTHIX_UI_COMPONENT_TYPE);
    } catch (e) {
      return false;
    }
  }

  // static compileStyleForDocument = compileStyleForDocument;
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

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Called when the component is added to the DOM.
   * arguments:
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationAdded() {}

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Called when the component is removed from the DOM.
   * arguments:
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationRemoved() {}

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Called when an element is added as a child.
   * arguments:
   *   - name: node
   *     dataTypes: Element
   *     desc: |
   *       The child element being added.
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationChildAdded() {}

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Called when a child element is removed.
   * arguments:
   *   - name: node
   *     dataTypes: Element
   *     desc: |
   *       The child element being removed.
   *   - name: mutationRecord
   *     dataTypes: MutationRecord
   *     desc: |
   *       The MutationRecord instance that that caused this method to be called.
   */
  onMutationChildRemoved() {}

  static isMythixComponent = isMythixComponent;

  constructor() {
    super();

    Object.defineProperties(this, {
      [_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        MYTHIX_UI_COMPONENT_TYPE,
      },
      [isMythixComponent]: { // @ref:MythixUIComponent.isMythixComponent
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        isMythixComponent,
      },
    });

    _utils_js__WEBPACK_IMPORTED_MODULE_0__.bindMethods.call(this, this.constructor.prototype /*, [ HTMLElement.prototype ]*/);

    Object.defineProperties(this, {
      'sensitiveTagName': { // @ref:MythixUIComponent.sensitiveTagName
        enumerable:   false,
        configurable: true,
        get:          () => ((this.prefix) ? `${this.prefix}:${this.localName}` : this.localName),
      },
      'templateID': { // @ref:MythixUIComponent.templateID
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        this.constructor.TEMPLATE_ID,
      },
      'delayTimers': { // @ref:MythixUIComponent.delayTimers
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        new Map(),
      },
      'documentInitialized': { // @ref:MythixUIComponent.documentInitialized
        enumerable:   false,
        configurable: true,
        get:          () => _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this.constructor, MYTHIX_DOCUMENT_INITIALIZED),
        set:          (value) => {
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(this.constructor, MYTHIX_DOCUMENT_INITIALIZED, !!value);
        },
      },
    });

    Object.defineProperties(this, {
      'shadow': { // @ref:MythixUIComponent.shadow
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

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   A convenience method for getting and setting attributes. If only one argument is provided
   *   to this method, then it will act as a getter, getting the attribute specified by name.
   *
   *   If however two or more arguments are provided, then this is an attribute setter.
   *
   *   If the provided value is `undefined`, `null`, or `false`, then the attribute will be
   *   removed.
   *
   *   If the provided value is `true`, then the attribute's value will be set to an empty string `''`.
   *
   *   Any other value is converted to a string and set as the attribute's value.
   * arguments:
   *   - name: name
   *     dataTypes: string
   *     desc: |
   *       The name of the attribute to operate on.
   *   - name: value
   *     dataTypes: any
   *     desc: |
   *       If `undefined`, `null`, or `false`, remove the named attribute.
   *       If `true`, set the named attribute's value to an empty string `''`.
   *       For any other value, first convert it into a string, and then set the named attribute's value to the resulting string.
   * return: |
   *   1. @types string; If a single argument is provided, then return the value of the specified named attribute.
   *   2. @types this; If more than one argument is provided, then set the specified attribute to the specified value,
   *      and return `this` (to allow for chaining).
   */
  attr(name, value) {
    if (arguments.length > 1) {
      if (value == null || value === false)
        this.removeAttribute(name);
      else
        this.setAttribute(name, (value === true) ? '' : ('' + value));

      return this;
    }

    return this.getAttribute(name);
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Inject a new style sheet via a `<style>` element dynamically at run-time.
   *
   *   This method allows the caller to inject dynamic styles at run-time.
   *   It will only inject the styles once, no matter how many times the
   *   method is called--as long as the style content itself doesn't change.
   *
   *   The content is hashed via SHA256, and the hash is used as the style sheet id. This
   *   allows you to call the method inside a component's @see MythixUIComponent.mounted;
   *   method, without needing to worry about duplicating the styles over and over again.
   * arguments:
   *   - name: content
   *     dataTypes: string
   *     desc: |
   *       The CSS stylesheet content to inject into a `<style>` element. This content is
   *       used to generate an `id` for the `<style>` element, so that it only gets added
   *       to the `document` once.
   *   - name: media
   *     dataTypes: string
   *     default: "'screen'"
   *     optional: true
   *     desc: |
   *       What to set the `media` attribute of the created `<style>` element to. Defaults
   *       to `'screen'`.
   * notes:
   *   - |
   *     :warning: It is often better to simply add a `<style>` element to your component's HTML template.
   *     However, sometimes truly dynamic styles are needed, where the content won't be known
   *     until runtime. This is the proper use case for this method.
   *   - |
   *     :warning: Please educated yourself (unlike people who love React) and do not overuse dynamic or inline styles.
   *     While the result of this method is certainly a step above inline styles, this method has
   *     [great potential to cause harm](https://worldofdev.info/6-reasons-why-you-shouldnt-style-inline/)
   *     and spread your own ignorance to others. Use with **CARE**!
   * return: |
   *   @types Element; The `<style>` element for the specified style.
   * examples:
   *   - |
   *     ```javascript
   *     import { MythixUIComponent } from 'mythix-ui-core@1.0';
   *
   *     class MyComponent extends MythixUIComponent {
   *       static tagName = 'my-component';
   *
   *       // ...
   *
   *       mounted() {
   *         let { sidebarWidth } = this.loadUserPreferences();
   *         this.injectStyleSheet(`nav.sidebar { width: ${sidebarWidth}px; }`, 'screen');
   *       }
   *     }
   *
   *     MyComponent.register();
   *     ```
   */
  injectStyleSheet(content, media = 'screen') {
    let styleID       = `IDSTYLE${_utils_js__WEBPACK_IMPORTED_MODULE_0__.SHA256(`${this.sensitiveTagName}:${content}:${media}`)}`;
    let ownerDocument = this.ownerDocument || document;
    let styleElement  = ownerDocument.querySelector(`style#${styleID}`);

    if (styleElement)
      return styleElement;

    styleElement = ownerDocument.createElement('style');
    styleElement.setAttribute('data-mythix-for', this.sensitiveTagName);
    styleElement.setAttribute('id', styleID);
    if (media)
      styleElement.setAttribute('media', media);

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

  getChildrenAsFragment(noEmptyResult) {
    let hasContent    = false;
    let ownerDocument = this.ownerDocument || document;
    let template      = ownerDocument.createDocumentFragment();

    if (!this.childNodes.length)
      return (noEmptyResult) ? undefined : template;

    while (this.childNodes.length) {
      let node = this.childNodes[0];
      if (!(node.nodeType === Node.TEXT_NODE && _utils_js__WEBPACK_IMPORTED_MODULE_0__.isNOE(node.nodeValue)))
        hasContent = true;

      template.appendChild(node);
    }

    if (noEmptyResult && !hasContent)
      return;

    return template;
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   Get the parent Node of this element.
   *
   * notes:
   *   - |
   *     :warning: Unlike [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode), this
   *     will also search across Shadow DOM boundaries.
   *   - |
   *     :warning: **Searching across Shadow DOM boundaries only works for Mythix UI components!**
   *   - |
   *     :info: Searching across Shadow DOM boundaries is accomplished via leveraging @see MythixUIComponent.metadata; for
   *     `this` component. When a `null` parent is encountered, `getParentNode` will look for @see MythixUIComponent.metadata?caption=metadata; key @see Utils.MYTHIX_SHADOW_PARENT;
   *     on `this`. If found, the result is considered the [parent Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) of `this` component.
   *   - |
   *     :eye: This is just a wrapper for @see Utils.getParentNode;.
   *
   * return: |
   *   @types Node; The parent node, if there is any, or `null` otherwise.
   */
  getParentNode() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.getParentNode(this);
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   This is a replacement for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   *   with one notable difference: It runs Mythix UI framework specific code after a shadow is attached.
   *
   *   Currently, the method completes the following actions:
   *   1. Call `super.attachShadow(options)` to actually attach a Shadow DOM
   *   2. Assign @see MythixUIComponent.metadata?caption=metadata; to the resulting `shadow`, using the key `Utils.MYTHIX_SHADOW_PARENT`, and value of `this`. @sourceRef _shadowMetadataAssignment; This allows @see getParentNode; to later find the parent of the shadow.
   *   3. `return shadow`
   * arguments:
   *   - name: options
   *     dataTypes: object
   *     desc: |
   *       [options](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options) for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   * notes:
   *   - This is just a wrapper for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) that executes
   *     custom framework functionality after the `super` call.
   * return: |
   *   @types ShadowRoot; The ShadowRoot instance created by [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).
   */
  attachShadow(options) {
    // Check environment support
    if (typeof super.attachShadow !== 'function')
      return;

    let shadow = super.attachShadow(options);
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.metadata(shadow, _utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_SHADOW_PARENT, this); // @ref:_shadowMetadataAssignment

    return shadow;
  }

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   A stub for developers to control the Shadow DOM of the component.
   *
   *   By default, this method will simply call @see MythixUIComponent.attachShadow; in `"open"` `mode`.
   *
   *   Developers can overload this to do nothing (have no Shadow DOM for a specific component for example),
   *   or to do something else, such as specify they would like their component to be in `"closed"` `mode`.
   *
   *   The result of this method is assigned to `this.shadow` inside the `constructor` of the component.
   * arguments:
   *   - name: options
   *     dataTypes: object
   *     desc: |
   *       [options](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options) for [Element.attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
   * notes:
   *   - All this does is call `this.attachShadow`. Its purpose is for the developer to control
   *     what happens with the component's Shadow DOM.
   * return: |
   *   @types ShadowRoot; The ShadowRoot instance created by @see MythixUIComponent.attachShadow;.
   */
  createShadowDOM(options) {
    return this.attachShadow({ mode: 'open', ...(options || {}) });
  }

  mergeChildren(target, ...others) {
    return _elements_js__WEBPACK_IMPORTED_MODULE_2__.mergeChildren(target, ...others);
  }

  getComponentTemplate(nameOrID) {
    if (nameOrID instanceof Node)
      return nameOrID;

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

  getProcessedTemplate(_template) {
    let template = this.getComponentTemplate(_template) || this.template;
    if (!template)
      return;

    return this.processElements((template.content) ? template.content.cloneNode(true) : template.cloneNode(true));
  }

  getRawTemplate(_template) {
    let template = this.getComponentTemplate(_template) || this.template;
    if (!template)
      return;

    return template;
  }

  appendTemplateTo(target, _template) {
    if (!target)
      return;

    let processedTemplate = this.getProcessedTemplate(_template);
    if (processedTemplate) {
      // ensureDocumentStyles.call(this, this.ownerDocument, this.sensitiveTagName, template);

      target.appendChild(processedTemplate);
    }
  }

  appendTemplateToShadowDOM(_template) {
    return this.appendTemplateTo(this.shadow, _template);
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

  /**
   * parent: MythixUIComponent
   * groupName: Components
   * desc: |
   *   A self-resetting timeout. This method expects an `id` argument (or will generate one from the provided
   *   callback method if not provided). It uses this provided `id` to create a timeout. This timeout has a special feature
   *   however that differentiates it from a normal `setTimeout` call: if you call `this.debounce` again with the
   *   same `id` **before** the time runs out, then it will automatically reset the timer. In short, only the last call
   *   to `this.debounce` (given the same id) will take effect (unless the specified timeout is reached between calls).
   * return: |
   *   This method returns a specialized Promise instance. The instance is specialized because the following properties
   *   are injected into it:
   *   1. `resolve(resultValue)` - When called, resolves the promise with the first provided argument
   *   2. `reject(errorValue)` - When called, rejects the promise with the first provided argument
   *   3. `status()` - When called, will return the fulfillment status of the promise, as a `string`, one of: `"pending", "fulfilled"`, or `"rejected"`
   *   4. `id<string>` - A randomly generated ID for this promise
   *
   *   See @see Utils.createResolvable;
   * arguments:
   *   - name: callback
   *     dataTypes: function
   *     desc: |
   *       The method to call when the timeout has been met.
   *   - name: timeMS
   *     dataTypes: number
   *     optional: true
   *     default: 0
   *     desc: |
   *       The number of milliseconds to wait before calling `callback`.
   *   - name: id
   *     dataTypes: string
   *     optional: true
   *     default: "null"
   *     desc: |
   *       The identifier for this debounce timer. If not provided, then one
   *       will be generated for you based on the provided callback.
   * notes:
   *   - Though not required, it is faster and less problematic to provide your own `id` argument
   */
  debounce(callback, timeMS, _id) {
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
    }, timeMS || 0);

    return promise;
  }

  clearDebounce(id) {
    let promise = this.delayTimers.get(id);
    if (!promise)
      return;

    if (promise.timerID)
      clearTimeout(promise.timerID);

    promise.reject('cancelled');

    this.delayTimers.delete(id);
  }

  classes(..._args) {
    let args = _args.flat(Infinity).map((item) => {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, '::String'))
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

// function formatRuleSet(rule, callback) {
//   if (!rule.selectorText)
//     return rule.cssText;

//   let _body   = rule.cssText.substring(rule.selectorText.length).trim();
//   let result  = (callback(rule.selectorText, _body) || []).filter(Boolean);
//   if (!result)
//     return '';

//   return result.join(' ');
// }

// function cssRulesToSource(cssRules, callback) {
//   return Array.from(cssRules || []).map((rule) => {
//     let ruleStr = formatRuleSet(rule, callback);
//     return `${cssRulesToSource(rule.cssRules, callback)}${ruleStr}`;
//   }).join('\n\n');
// }

// function compileStyleForDocument(elementName, styleElement) {
//   const handleHost = (m, type, _content) => {
//     let content = (!_content) ? _content : _content.replace(/^\(/, '').replace(/\)$/, '');

//     if (type === ':host') {
//       if (!content)
//         return elementName;

//       // Element selector?
//       if ((/^[a-zA-Z_]/).test(content))
//         return `${content}[data-mythix-component-name="${elementName}"]`;

//       return `${elementName}${content}`;
//     } else {
//       return `${content} ${elementName}`;
//     }
//   };

//   return cssRulesToSource(
//     styleElement.sheet.cssRules,
//     (_selector, body) => {
//       let selector = _selector;
//       let tags     = [];

//       let updatedSelector = selector.replace(/(['"])(?:\\.|[^\1])+?\1/, (m) => {
//         let index = tags.length;
//         tags.push(m);
//         return `@@@TAG[${index}]@@@`;
//       }).split(',').map((selector) => {
//         let modified = selector.replace(/(:host(?:-context)?)(\(\s*[^)]+?\s*\))?/, handleHost);
//         return (modified === selector) ? null : modified;
//       }).filter(Boolean).join(',').replace(/@@@TAG\[(\d+)\]@@@/, (m, index) => {
//         return tags[+index];
//       });

//       if (!updatedSelector)
//         return;

//       return [ updatedSelector, body ];
//     },
//   );
// }

// export function ensureDocumentStyles(ownerDocument, componentName, template) {
//   let objID             = Utils.getObjectID(template);
//   let templateID        = Utils.SHA256(objID);
//   let templateChildren  = Array.from(template.content.childNodes);
//   let index             = 0;

//   for (let templateChild of templateChildren) {
//     if (!(/^style$/i).test(templateChild.tagName))
//       continue;

//     let styleID = `IDSTYLE${templateID}${++index}`;
//     if (!ownerDocument.head.querySelector(`style#${styleID}`)) {
//       let clonedStyleElement = templateChild.cloneNode(true);
//       ownerDocument.head.appendChild(clonedStyleElement);

//       let newStyleSheet = compileStyleForDocument(componentName, clonedStyleElement);
//       ownerDocument.head.removeChild(clonedStyleElement);

//       let styleNode = ownerDocument.createElement('style');
//       styleNode.setAttribute('data-mythix-for', this.sensitiveTagName);
//       styleNode.setAttribute('id', styleID);
//       styleNode.innerHTML = newStyleSheet;

//       document.head.appendChild(styleNode);
//     }
//   }
// }

function getDescriptorFromPrototypeChain(startProto, descriptorName) {
  let thisProto = startProto;
  let descriptor;

  while (thisProto && !(descriptor = Object.getOwnPropertyDescriptor(thisProto, descriptorName)))
    thisProto = Object.getPrototypeOf(thisProto);

  return descriptor;
}

function resolveURL(rootLocation, _urlish) {
  let urlish = _urlish;
  if (urlish instanceof URL)
    urlish = urlish.toString();

  if (!urlish)
    urlish = '';

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(urlish, '::String'))
    return;

  let url = new URL(urlish, new URL(rootLocation));
  if (typeof globalThis.mythixUI.urlResolver === 'function') {
    let fileName  = '';
    let path      = '/';

    url.pathname.replace(/^(.*\/)([^/]+)$/, (m, first, second) => {
      path = first.replace(/\/+$/, '/');
      if (path.charAt(path.length - 1) !== '/')
        path = `${path}/`;

      fileName = second;
      return m;
    });

    let newSrc = globalThis.mythixUI.urlResolver.call(this, { src: urlish, url, path, fileName });
    if (newSrc === false) {
      console.warn(`"mythix-require": Not loading "${urlish}" because the global "mythixUI.urlResolver" requested I not do so.`);
      return;
    }

    if (newSrc && (newSrc.toString() !== url.toString() && newSrc.toString() !== urlish))
      url = resolveURL.call(this, rootLocation, newSrc);
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

function getLargestDocumentTabIndex(ownerDocument) {
  let largest = -Infinity;

  Array.from((ownerDocument || document).querySelectorAll('[tabindex]')).forEach((element) => {
    let tabIndex = parseInt(element.getAttribute('tabindex'), 10);
    if (!isFinite(tabIndex))
      return;

    if (tabIndex > largest)
      largest = tabIndex;
  });

  return (largest < 0) ? 0 : largest;
}


/***/ }),

/***/ "./lib/elements.js":
/*!*************************!*\
  !*** ./lib/elements.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ELEMENT_DEFINITION_TYPE: () => (/* binding */ ELEMENT_DEFINITION_TYPE),
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


/**
 *  type: Namespace
 *  name: Elements
 *  groupName: Elements
 *  desc: |
 *    `import { Elements } from 'mythix-ui-core@1.0';`
 *
 *    Utility and element building functions for the DOM.
 */

const UNFINISHED_DEFINITION    = Symbol.for('@mythix/mythix-ui/constants/unfinished');
const ELEMENT_DEFINITION_TYPE  = Symbol.for('@mythix/mythix-ui/types/MythixUI::ElementDefinition');

const QUERY_ENGINE_TYPE = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');

const IS_PROP_NAME    = /^prop\$/;
const IS_TARGET_PROP  = /^prototype|constructor$/;

class ElementDefinition {
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE);
    } catch (e) {
      return false;
    }
  }

  constructor(tagName, attributes, children) {
    Object.defineProperties(this, {
      [_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        ELEMENT_DEFINITION_TYPE,
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

  const isValidNodeType = (item) => {
    if (!item)
      return false;

    if (item instanceof Node)
      return true;

    if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE)
      return true;

    if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === QUERY_ENGINE_TYPE)
      return true;

    return false;
  };

  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ATTRIBUTE_NODE) {
    if (!isTemplateEngineDisabled) {
      let result = _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatNodeValue(node, options);
      if ((Array.isArray(result) && result.some(isValidNodeType)) || isValidNodeType(result)) {
        if (!Array.isArray(result))
          result = [ result ];

        let ownerDocument = options.ownerDocument || scope.ownerDocument || node.ownerDocument || document;
        let fragment      = ownerDocument.createDocumentFragment();

        for (let item of result) {
          if (item instanceof Node) {
            fragment.appendChild(item);
          } else if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE) {
            let elements = item.build(ownerDocument, { scope });
            if (!elements)
              continue;

            if (Array.isArray(elements))
              elements.flat(Infinity).forEach((element) => fragment.appendChild(element));
            else
              fragment.appendChild(elements);
          } else if (item[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === QUERY_ENGINE_TYPE) {
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
        console.log('Formatting attribute: ', attributeName, node);
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
  if (!tagName || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(tagName, '::String'))
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

        if (value[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE)
          return value;

        if (value[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === QUERY_ENGINE_TYPE)
          return wrangleChildren(value.getUnderlyingArray());

        if (value instanceof Node)
          return nodeToElementDefinition(value);

        if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(value, '::String', _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty))
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

/**
   * parent: Elements
   * groupName: Elements
   * desc: |
   *   Almost like `Object.assign`, merge all component children into a single node (the `target`).
   *
   *   This is "template intelligent", meaning for `<template>` elements specifically, it will execute
   *   `children = template.content.cloneNode(true).childNodes` to clone all the child nodes, and not
   *   modify the original template. It is also template intelligent by the fact that if the `target` is
   *   a template, it will add the children to `content` properly.
   * arguments:
   *   - name: target
   *     dataTypes: Node
   *     desc: |
   *       The target Node to merge all children into. If this Node is a `<template>` Node, then it will
   *       place all the merged children into `template.content`.
   * notes:
   *   - Any template Node will be cloned, and so the original will not be modified. All other nodes are **NOT**
   *     cloned before the merge, and so will be stripped of their children.
   *   - Make certain you deep clone any element first (except templates) if you don't want the provided elements
   *     to be modified.
   * return: |
   *   @types Node; The provided `target`, with all children merged (added) into it.
   */
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
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");





class MythixUILanguagePack extends _components_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent {
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

class MythixUILanguageProvider extends _components_js__WEBPACK_IMPORTED_MODULE_2__.MythixUIComponent {
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
    super.mounted();

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
      let { response }  = await _components_js__WEBPACK_IMPORTED_MODULE_2__.require.call(this, src, { ownerDocument: this.ownerDocument || document });
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
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");


const IS_TEMPLATE       = /^(template)$/i;
const TEMPLATE_TEMPLATE = /^(\*|\|\*|\*\|)$/;

class MythixUIRequire extends _components_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  async mounted() {
    super.mounted();

    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await _components_js__WEBPACK_IMPORTED_MODULE_0__.require.call(
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
      _components_js__WEBPACK_IMPORTED_MODULE_0__.importIntoDocumentFromSource.call(
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
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");
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

class MythixUISpinner extends _components_js__WEBPACK_IMPORTED_MODULE_0__.MythixUIComponent {
  static tagName = 'mythix-spinner';

  set attr$kind([ newValue ]) {
    this.handleKindAttributeChange(newValue);
  }

  mounted() {
    super.mounted();

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
/* harmony export */   QUERY_ENGINE_TYPE: () => (/* binding */ QUERY_ENGINE_TYPE),
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

const QUERY_ENGINE_TYPE = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');

class QueryEngine {
  static [Symbol.hasInstance](instance) {
    try {
      return (instance && instance[_utils_js__WEBPACK_IMPORTED_MODULE_0__.MYTHIX_TYPE] === QUERY_ENGINE_TYPE);
    } catch (e) {
      return false;
    }
  }

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
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex + 1], '::Function'))
        options.callback = args[1];

      queryEngine = new QueryEngine(args[argIndex], options);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], '::String')) {
      options.selector = args[argIndex++];

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], '::Function'))
        options.callback = args[argIndex++];

      queryEngine = new QueryEngine(root.querySelectorAll(options.selector), options);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(args[argIndex], '::Function')) {
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
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        QUERY_ENGINE_TYPE,
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

      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(item, '::String'))
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
    if (count == null || count === 0 || Object.is(count, NaN) || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(count, '::Number'))
      return this.select([ this._mythixUIElements[0] ]);

    return this.select(this._mythixUIElements.slice(Math.abs(count)));
  }

  last(count) {
    if (count == null || count === 0 || Object.is(count, NaN) || !_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(count, '::Number'))
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
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, '::String'))
      element = this.getRoot().querySelector(selectorOrElement);

    for (let child of this._mythixUIElements)
      element.appendChild(child);
  }

  insertInto(selectorOrElement, referenceNode) {
    if (!this._mythixUIElements.length)
      return this;

    let element = selectorOrElement;
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, '::String'))
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
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.isType(selectorOrElement, '::String'))
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

/*
Many thanks to Geraint Luff for the following

https://github.com/geraintluff/sha256/
*/

/**
 * type: Function
 * name: SHA256
 * groupName: Utils
 * desc: |
 *   SHA256 hashing function
 * arguments:
 *   - name: input
 *     dataType: string
 *     desc: Input string
 * return: |
 *   @types string; The SHA256 hash of the provided `input`.
 * notes:
 *   - |
 *     :warning: This is a custom baked SHA256 hashing function, minimized for size.
 *     It may be incomplete, and it is strongly recommended that you **DO NOT** use this
 *     for anything related to security.
 *   - |
 *     :warning: Read all the notes, and use this method with caution.
 *   - |
 *     :info: This method has been modified slightly from the original to *not* bail when
 *     unicode characters are detected. There is a decent chance that--given certain
 *     input--this method will return an invalid SHA256 hash."
 *   - |
 *     :info: Mythix UI uses this method simply to generate consistent IDs.
 *   - |
 *     :heart: Many thanks to the author [Geraint Luff](https://github.com/geraintluff/sha256/)
 *     for this method!
 */
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
/* harmony export */   DYNAMIC_PROPERTY_TYPE: () => (/* binding */ DYNAMIC_PROPERTY_TYPE),
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
/* harmony export */   getObjectID: () => (/* binding */ getObjectID),
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
/* harmony export */   storage: () => (/* binding */ storage),
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase),
/* harmony export */   toSnakeCase: () => (/* binding */ toSnakeCase),
/* harmony export */   typeOf: () => (/* binding */ typeOf),
/* harmony export */   unregisterDisableTemplateEngineSelector: () => (/* binding */ unregisterDisableTemplateEngineSelector)
/* harmony export */ });
/* harmony import */ var _sha256_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha256.js */ "./lib/sha256.js");


globalThis.mythixUI = (globalThis.mythixUI || {});



/**
 * type: Namespace
 * name: Utils
 * groupName: Utils
 * desc: |
 *   `import { Utils } from 'mythix-ui-core@1.0';`
 *
 *   Misc utility functions and global constants are found within this namespace.
 * properties:
 *   - name: MYTHIX_NAME_VALUE_PAIR_HELPER
 *     dataType: symbol
 *     desc: |
 *       This is used as a @see Utils.metadata?caption=metadata; key by @see Utils.globalStoreNameValuePairHelper;
 *       to store key/value pairs for a single value.
 *
 *       Mythix UI has global store and fetch helpers for setting and fetching dynamic properties. These
 *       methods only accept a single value by design... but sometimes it is desired that a value be set
 *       with a specific key instead. This `MYTHIX_NAME_VALUE_PAIR_HELPER` property assists with this process,
 *       allowing global helpers to still function with a single value set, while in some cases still passing
 *       a key through to the setter. @sourceRef _mythixNameValuePairHelperUsage;
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *   - name: MYTHIX_SHADOW_PARENT
 *     dataType: symbol
 *     desc: |
 *       This is used as a @see Utils.metadata?caption=metadata; key by @see MythixUIComponent; to
 *       store the parent node of a Shadow DOM, so that it can later be traversed by @see Utils.getParentNode;.
 *     notes:
 *       - |
 *         :warning: Use at your own risk. This is Mythix UI internal code that might change in the future.
 *       - |
 *         :eye: @see Utils.getParentNode;.
 *   - name: MYTHIX_TYPE
 *     dataType: symbol
 *     desc: |
 *       This is used for type checking by `instanceof` checks to determine if an instance
 *       is a specific type (even across javascript contexts and library versions). @sourceRef _mythixTypeExample;
 *     notes:
 *       - |
 *         :eye: @see Utils.isType;.
 *   - name: DYNAMIC_PROPERTY_TYPE
 *     dataType: symbol
 *     desc: |
 *       Used for runtime type reflection against @see Utils.DynamicProperty;.
 *     notes:
 *       - |
 *         :eye: @see Utils.DynamicProperty;.
 *       - |
 *         :eye: @see Utils.isType;.
 *       - |
 *         :eye: @see Utils.MYTHIX_TYPE;.
 */

function pad(str, count, char = '0') {
  return str.padStart(count, char);
}

const MYTHIX_NAME_VALUE_PAIR_HELPER  = Symbol.for('@mythix/mythix-ui/constants/name-value-pair-helper'); // @ref:Utils.MYTHIX_NAME_VALUE_PAIR_HELPER
const MYTHIX_SHADOW_PARENT           = Symbol.for('@mythix/mythix-ui/constants/shadow-parent'); // @ref:Utils.MYTHIX_SHADOW_PARENT
const MYTHIX_TYPE                    = Symbol.for('@mythix/mythix-ui/constants/element-definition'); // @ref:Utils.MYTHIX_TYPE

const DYNAMIC_PROPERTY_TYPE          = Symbol.for('@mythix/mythix-ui/types/MythixUI::DynamicProperty'); // @ref:Utils.DYNAMIC_PROPERTY_TYPE

const ELEMENT_DEFINITION_TYPE               = Symbol.for('@mythix/mythix-ui/types/MythixUI::ElementDefinition');
const QUERY_ENGINE_TYPE                     = Symbol.for('@mythix/mythix-ui/types/MythixUI::QueryEngine');

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

const ID_COUNTER_CURRENT_VALUE  = Symbol.for('@mythix/mythix-ui/component/constants/id-counter-current-value');

// eslint-disable-next-line no-magic-numbers
let idCounter = (Object.prototype.hasOwnProperty.call(globalThis.mythixUI, ID_COUNTER_CURRENT_VALUE)) ? globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] : 0n;

/**
 * groupName: Utils
 * desc: |
 *   Generate a partially random unique ID. The id generated will be a `Date.now()`
 *   value with an incrementing BigInt postfixed to it.
 * return: |
 *   @types string; A unique ID.
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log('ID: ', Utils.generateID());
 *     // output -> 'ID17041430271790000000000000000007'
 *     ```
 */
function generateID() {
  idCounter += BigInt(1);
  globalThis.mythixUI[ID_COUNTER_CURRENT_VALUE] = idCounter;

  return `ID${Date.now()}${pad(idCounter.toString(), ID_COUNT_LENGTH)}`;
}

const OBJECT_ID_STORAGE = Symbol.for('@mythix/mythix-ui/component/constants/object-id-storage');
const OBJECT_ID_WEAKMAP = globalThis.mythixUI[OBJECT_ID_STORAGE] = (globalThis.mythixUI[OBJECT_ID_STORAGE]) ? globalThis.mythixUI[OBJECT_ID_STORAGE] : new WeakMap();

/**
 * groupName: Utils
 * desc: |
 *   Get a unique ID for any garbage-collectable reference.
 *
 *   Unique IDs are generated via @see Utils.generateID;.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Any garbage-collectable reference.
 * return: |
 *   @types string; A unique ID for this reference (as a SHA256 hash).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.getObjectID(divElement));
 *     // output -> '17041430271790000000000000000007'
 *     ```
 */
function getObjectID(value) {
  let id = OBJECT_ID_WEAKMAP.get(value);
  if (id == null) {
    let thisID = generateID();

    OBJECT_ID_WEAKMAP.set(value, thisID);

    return thisID;
  }

  return id;
}

/**
 * groupName: Utils
 * desc: |
 *   Create an unresolved specialized Promise instance, with the intent that it will be
 *   resolved later.
 *
 *   The Promise instance is specialized because the following properties are injected into it:
 *   1. `resolve(resultValue)` - When called, resolves the promise with the first provided argument
 *   2. `reject(errorValue)` - When called, rejects the promise with the first provided argument
 *   3. `status()` - When called, will return the fulfillment status of the promise, as a `string`, one of: `"pending", "fulfilled"`, or `"rejected"`
 *   4. `id<string>` - A randomly generated ID for this promise
 * return: |
 *   @types Promise; An unresolved Promise that can be resolved or rejected by calling `promise.resolve(result)` or `promise.reject(error)` respectively.
 */
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

/**
 * groupName: Utils
 * desc: |
 *   Runtime type reflection helper. This is intended to be a more robust replacement for the `typeof` operator.
 *
 *   This method always returns a name (as a `string` type) of the underlying datatype.
 *   The "datatype" is a little loose for primitive types. For example, a
 *   primitive `typeof x === 'number'` type is returned as its corresponding Object (class) type `'Number'`. For `boolean` it will instead
 *   return `'Boolean'`, and for `'string'`, it will instead return `'String'`. This is true of all underlying primitive types.
 *
 *   For internal datatypes, it will return the real class name prefixed by two colons.
 *   For example, `typeOf(new Map())` will return `'::Map'`.
 *
 *   Non-internal types will not be prefixed, allowing custom types with the same name as internal types to also be detected.
 *   For example, `class Test {}; typeOf(new Test())` will result in the non-prefixed result `'Test'`.
 *
 *   For raw `function` types, `typeOf` will check if they are a constructor or not. If a constructor is detected, then
 *   the format `'[Class ${name}]'` will be returned as the type. For internal types the name will
 *   be prefixed, i.e. `[Class ::${internalName}]`, and for non-internal types will instead be non-prefixed, i.e. `[Class ${name}]` .
 *   For example, `typeOf(Map)` will return `'[Class ::Map]'`, whereas `typeOf(Test)` will result in `'[Class Test]'`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: The value whose type you wish to discover.
 * return: |
 *   @types string; The name of the provided type, or an empty string `''` if the provided value has no type.
 * notes:
 *   - This method will look for a [Symbol.toStringTag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)
 *     key on the value provided... and if found, will use it to assist with finding the correct type name.
 *   - If the `value` provided is type-less, i.e. `undefined`, `null`, or `NaN`, then an empty type `''` will be returned.
 *   - Use the `typeof` operator if you want to detect if a type is primitive or not.
 */
function typeOf(value) {
  if (value == null || Object.is(value, NaN))
    return '';

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return '::Number';

  let thisType = typeof value;
  if (thisType === 'bigint')
    return '::BigInt';

  if (thisType === 'symbol')
    return '::Symbol';

  if (thisType !== 'object') {
    if (thisType === 'function') {
      let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (value === typeMeta[1]));
      if (nativeTypeMeta)
        return `[Class ::${nativeTypeMeta[0]}]`;

      if (value.prototype && typeof value.prototype.constructor === 'function' && IS_CLASS.test('' + value.prototype.constructor))
        return `[Class ${value.name}]`;

      if (value.prototype && typeof value.prototype[Symbol.toStringTag] === 'function') {
        let result = value.prototype[Symbol.toStringTag]();
        if (result)
          return `[Class ${result}]`;
      }
    }

    return `::${thisType.charAt(0).toUpperCase()}${thisType.substring(1)}`;
  }

  if (Array.isArray(value))
    return '::Array';

  if (value instanceof String)
    return '::String';

  if (value instanceof Number)
    return '::Number';

  if (value instanceof Boolean)
    return '::Boolean';

  let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => {
    try {
      return (typeMeta[0] !== 'Object' && value instanceof typeMeta[1]);
    } catch (e) {
      return false;
    }
  });
  if (nativeTypeMeta)
    return `::${nativeTypeMeta[0]}`;

  if (typeof Math !== 'undefined' && value === Math)
    return '::Math';

  if (typeof JSON !== 'undefined' && value === JSON)
    return '::JSON';

  if (typeof Atomics !== 'undefined' && value === Atomics)
    return '::Atomics';

  if (typeof Reflect !== 'undefined' && value === Reflect)
    return '::Reflect';

  if (value[Symbol.toStringTag])
    return (typeof value[Symbol.toStringTag] === 'function') ? value[Symbol.toStringTag]() : value[Symbol.toStringTag];

  if (isPlainObject(value))
    return '::Object';

  return value.constructor.name || 'Object';
}

/**
 * groupName: Utils
 * desc: |
 *   Runtime type reflection helper. This is intended to be a more robust replacement for the `instanceof` operator.
 *
 *   This method will return `true` if the provided `value` is *any* of the provided `types`.
 *
 *   The provided `types` can each either be a real raw type (i.e. `String` class), or the name of a type, as a string,
 *   i.e. `'::String'`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: The value whose type you wish to compare.
 *   - name: ...types
 *     dataType: Array<any>
 *     desc: All types you wish to check against. String values compare types by name, function values compare types by `instanceof`.
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` matches any of the provided `types`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 */
function isType(value, ...types) {
  const getInternalTypeName = (type) => {
    let nativeTypeMeta = NATIVE_CLASS_TYPES_META.find((typeMeta) => (type === typeMeta[1]));
    if (nativeTypeMeta)
      return `::${nativeTypeMeta[0]}`;
  };

  let valueType = typeOf(value);
  for (let type of types) {
    try {
      if (typeOf(type, '::String') && valueType === type) {
        return true;
      } else if (typeof type === 'function') {
        if (value instanceof type)
          return true;

        let internalType = getInternalTypeName(type);
        if (internalType && internalType === valueType)
          return true;
      }
    } catch (e) {
      continue;
    }
  }

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Verify that the provided `value` is a `number` type (or `Number` instance), and that
 *   it **is not** `NaN`, `Infinity`, or `-Infinity`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` is a `number` (or `Number` instance) and is also **not** `NaN`, `Infinity`, or `-Infinity`. i.e. `(isNumber(value) && isFinite(value))`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
function isValidNumber(value) {
  return (isType(value, '::Number') && isFinite(value));
}

/**
 * groupName: Utils
 * desc: |
 *   Verify that the provided `value` is a "plain"/"vanilla" Object instance.
 *
 *   This method is intended to help the caller detect if an object is a "raw plain object",
 *   inheriting from `Object.prototype` (or a `null` prototype).
 *
 *   1. `isPlainObject({})` will return `true`.
 *   2. `isPlainObject(new Object())` will return `true`.
 *   3. `isPlainObject(Object.create(null))` will return `true`.
 *   4. `isPlainObject(new CustomClass())` will return `false`.
 *   5. All other invocations should return `false`.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `value` is a "raw"/"plain" Object instance.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
function isPlainObject(value) {
  if (!value)
    return false;

  if (typeof value !== 'object')
    return false;

  if (value.constructor === Object || value.constructor == null)
    return true;

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is a javascript primitive type.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `typeof value` is one of: `string`, `number`, `boolean`, `bigint`, or `symbol`,
 *      *and also* `value` is *not* `NaN`, `Infinity`, `-Infinity`, `undefined`, or `null`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
function isPrimitive(value) {
  if (value == null || Object.is(value, NaN))
    return false;

  if (typeof value === 'symbol')
    return true;

  if (Object.is(value, Infinity) || Object.is(value, -Infinity))
    return true;

  return isType(value, '::String', '::Number', '::Boolean', '::BigInt');
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is garbage collectable.
 *
 *   This method is used to check if any `value` is allowed to be used as a weak reference.
 *
 *   Essentially, this will return `false` for any primitive type, or `null`, `undefined`, `NaN`, `Infinity`, or `-Infinity` values.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if `typeof value` is one of: `string`, `number`, `boolean`, `bigint`, or `symbol`,
 *      *and also* `value` *is not* `NaN`, `Infinity`, `-Infinity`, `undefined`, or `null`.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.typeOf;.
 *   - |
 *     :eye: @see Utils.isType;.
 */
function isCollectable(value) {
  if (value == null || Object.is(value, NaN) || Object.is(Infinity) || Object.is(-Infinity))
    return false;

  if (typeof value === 'symbol')
    return false;

  if (isType(value, '::String', '::Number', '::Boolean', '::BigInt'))
    return false;

  return true;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is "empty" (is **N**ull **O**r **E**mpty).
 *
 *   A value is considered "empty" if any of the following conditions is met:
 *   1. `value` is `undefined`.
 *   2. `value` is `null`.
 *   3. `value` is `''` (an empty string).
 *   4. `value` is not an empty string, but it contains nothing except whitespace (`\t`, `\r`, `\s`, or `\n`).
 *   5. `value` is `NaN`.
 *   6. `value.length` is a `Number` or `number` type, and is equal to `0`.
 *   7. `value` is a @see Utils.isPlainObject?caption=plain+object; and has no iterable keys.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `true` if any of the "empty" conditions above are true.
 *   2. Otherwise, `false` is returned.
 * notes:
 *   - |
 *     :eye: @see Utils.isNotNOE;.
 */
function isNOE(value) {
  if (value == null)
    return true;

  if (Object.is(value, NaN))
    return true;

  if (value === '')
    return true;

  if (isType(value, '::String') && (/^[\t\s\r\n]*$/).test(value))
    return true;

  if (isType(value.length, '::Number'))
    return (value.length === 0);

  if (isPlainObject(value) && Object.keys(value).length === 0)
    return true;

  return false;
}

/**
 * groupName: Utils
 * desc: |
 *   Detect if the provided `value` is **not** "empty" (is not **N**ull **O**r **E**mpty).
 *
 *   A value is considered "empty" if any of the following conditions is met:
 *   1. `value` is `undefined`.
 *   2. `value` is `null`.
 *   3. `value` is `''` (an empty string).
 *   4. `value` is not an empty string, but it contains nothing except whitespace (`\t`, `\r`, `\s`, or `\n`).
 *   5. `value` is `NaN`.
 *   6. `value.length` is a `Number` or `number` type, and is equal to `0`.
 *   7. `value` is a @see Utils.isPlainObject?caption=plain+object; and has no iterable keys.
 * arguments:
 *   - name: value
 *     dataType: any
 *     desc: Value to check
 * return: |
 *   @types boolean;
 *   1. Return `false` if any of the "empty" conditions above are true.
 *   2. Otherwise, `true` is returned.
 * notes:
 *   - |
 *     :info: This is the exact inverse of @see Utils.isNOE;
 *   - |
 *     :eye: @see Utils.isNOE;.
 */
function isNotNOE(value) {
  return !isNOE(value);
}

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 *
 *   The process is roughly as follows:
 *   1. Any non-word characters ([a-zA-Z0-9_]) are stripped from the beginning of the string.
 *   2. Any non-word characters ([a-zA-Z0-9_]) are stripped from the end of the string.
 *   3. Each "word" is capitalized.
 *   4. The first letter is always lower-cased.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to convert into [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 * return: |
 *   @types string; The formatted string in [camelCase](https://en.wikipedia.org/wiki/Letter_case#Camel_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toCamelCase('--test-some_value_@'));
 *     // output -> 'testSomeValue'
 *     ```
 */
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

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 *
 *   The process is roughly as follows:
 *   1. Any capitalized character sequence is prefixed by an underscore.
 *   2. More than one sequential underscores are converted into a single underscore.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to convert into [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 * return: |
 *   @types string; The formatted string in [snake_case](https://en.wikipedia.org/wiki/Letter_case#Snake_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toSnakeCase('ThisIsASentence'));
 *     // output -> 'this_is_a_sentence'
 *     ```
 */
function toSnakeCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `_${m.toLowerCase()}` : m.toLowerCase()))
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * groupName: Utils
 * desc: |
 *   Convert the provided `string` `value` into [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 *
 *   The process is roughly as follows:
 *   1. Any capitalized character sequence is prefixed by a hyphen.
 *   2. More than one sequential hyphens are converted into a single hyphen.
 * arguments:
 *   - name: value
 *     dataType: string
 *     desc: String to turn into [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 * return: |
 *   @types string; The formatted string in [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     console.log(Utils.toCamelCase('ThisIsASentence'));
 *     // output -> 'this-is-a-sentence'
 *     ```
 */
function toKebabCase(value) {
  return ('' + value)
    .replace(/[A-Z]+/g, (m, offset) => ((offset) ? `-${m.toLowerCase()}` : m.toLowerCase()))
    .replace(/-{2,}/g, '-')
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

const METADATA_STORAGE = Symbol.for('@mythix/mythix-ui/component/constants/metadata-storage');
const METADATA_WEAKMAP = globalThis.mythixUI[METADATA_STORAGE] = (globalThis.mythixUI[METADATA_STORAGE]) ? globalThis.mythixUI[METADATA_STORAGE] : new WeakMap();

/**
 * groupName: Utils
 * desc: |
 *   Store and retrieve metadata on any garbage-collectable reference.
 *
 *   This function uses an internal WeakMap to store metadata for any garbage-collectable value.
 *
 *   The number of arguments provided will change the behavior of this function:
 *   1. If only one argument is supplied (a `target`), then a Map of metadata key/value pairs is returned.
 *   2. If only two arguments are supplied, then `metadata` acts as a getter, and the value stored under the specified `key` is returned.
 *   3. If more than two arguments are supplied, then `metadata` acts as a setter, and `target` is returned (for continued chaining).
 * arguments:
 *   - name: target
 *     dataType: any
 *     desc: |
 *       This is the value for which metadata is being stored or retrieved.
 *       This can be any garbage-collectable value (any value that can be used as a key in a WeakMap).
 *   - name: key
 *     dataType: any
 *     optional: true
 *     desc: |
 *       The key used to store or fetch the specified metadata value. This can be any value, as the underlying
 *       storage is a Map.
 *   - name: value
 *     dataType: any
 *     optional: true
 *     desc: |
 *       The value to store on the `target` under the specified `key`.
 * return: |
 *   @types any;
 *   1. If only one argument is provided (a bulk get operation), return a Map containing the metadata for the specified `target`.
 *   2. If two arguments are provided (a get operation), the `target` metadata value stored for the specified `key`.
 *   2. If more than two arguments are provided (a set operation), the provided `target` is returned.
 * examples:
 *   - |
 *     ```javascript
 *     import { Utils } from 'mythix-ui-core@1.0';
 *
 *     // set
 *     Utils.metadata(myElement, 'customCaption', 'Metadata Caption!');
 *
 *     // get
 *     console.log(Utils.metadata(myElement, 'customCaption'));
 *     // output -> 'Metadata Caption!'
 *
 *     // get all
 *     console.log(Utils.metadata(myElement));
 *     // output -> Map(1) { 'customCaption' => 'Metadata Caption!' }
 *     ```
 */
function metadata(target, key, value) {
  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    if (!isCollectable(target))
      throw new Error(`Unable to set metadata on provided object: ${(typeof target === 'symbol') ? target.toString() : target}`);

    data = new Map();
    METADATA_WEAKMAP.set(target, data);
  }

  if (arguments.length === 1)
    return data;

  if (arguments.length === 2)
    return (data) ? data.get(key) : undefined;

  data.set(key, value);

  return target;
}

/**
 * groupName: Utils
 * desc: |
 *   Do our best to emulate [process.nextTick](https://nodejs.org/en/guides/event-loop-timers-and-nexttick/#processnexttick)
 *   in the browser.
 *
 *   In order to try and emulate `process.nextTick`, this function will use `globalThis.requestAnimationFrame(() => callback())` if available,
 *   otherwise it will fallback to using `Promise.resolve().then(callback)`.
 * arguments:
 *   - name: callback
 *     dataType: function
 *     desc: Callback function to call on "nextTick".
 * notes:
 *   - |
 *     :info: This function will prefer and use `process.nextTick` if it is available (i.e. if running on NodeJS).
 *   - |
 *     :warning: This function is unlikely to actually be the next "tick" of the underlying
 *     javascript engine. This method just does its best to emulate "nextTick". Instead of the
 *     actual "next tick", this will instead be "as fast as possible".
 *   - |
 *     :info: This function deliberately attempts to use `requestAnimationFrame` first--even though it likely doesn't
 *     have the fastest turn-around-time--to save battery power. The idea being that "something needs to be done *soon*".
 */
function nextTick(callback) {
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    process.nextTick(callback);
  } else if (typeof globalThis.requestAnimationFrame === 'function') {
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
const DYNAMIC_PROPERTY_IS_SETTING = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/is-setting');
const DYNAMIC_PROPERTY_SET        = Symbol.for('@mythix/mythix-ui/dynamic-property/constants/set');

/**
 * groupName: Utils
 * desc: |
 *   `DynamicProperty` is a simple value storage class wrapped in a Proxy.
 *
 *    It will allow the user to store any desired value. The catch however is that
 *    any value stored can only be set through its special `set` method.
 *
 *    This will allow any listeners to receive the `'update'` event when a value is set.
 *
 *    Since `DynamicProperty` instances are also always wrapped in a Proxy, the user may
 *    "directly" access attributes of the stored value. For example, if a `DynamicProperty`
 *    is storing an Array instance, then one would be able to access the `.length` property
 *    "directly", i.e. `dynamicProp.length`.
 *
 *    `DynamicProperty` has a special `set` method, whose name is a `symbol`, to avoid conflicting
 *    namespaces with the underlying datatype (and the wrapping Proxy).
 *    To set a value on a `DynamicProperty` instance, one must do so as follows: `dynamicProperty[DynamicProperty.set](myNewValue)`.
 *    This will update the internal value, and if the set value differs from the stored value, the `'update'` event will be dispatched to
 *    any listeners.
 *
 *    As `DynamicProperty` is an [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget), one can attach
 *    event listeners to the `'update'` event to listen for updates to the underlying value. The `'update'` event is the only event that is
 *    ever triggered by this class. The received `event` instance in event callbacks will have the following attributes:
 *    1. `updateEvent.originator = this;` - `originator` is the instance of the `DynamicProperty` where the event originated from.
 *    2. `updateEvent.oldValue = currentValue;` - `oldValue` contains the previous value of the `DynamicProperty` before set.
 *    3. `updateEvent.value = newValue;` - `value` contains the current value being set on the `DynamicProperty`.
 *
 *    To retrieve the underlying raw value of a `DynamicProperty`, one may call `valueOf()`: `let rawValue = dynamicProperty.valueOf();`
 * notes:
 *   - |
 *     :warning: `DynamicProperty` instances will internally track when a `set` operation is underway, to prevent
 *     cyclic sets and maximum call stack errors. You are allowed to set the value recursively, however `update` events
 *     will only be dispatched for the first `set` call. Any `set` operation that happens while another `set` operation is
 *     underway will **not** dispatch any `'update'` events.
 *   - |
 *     `'update'` events will be dispatched immediately *after* the internal underlying stored value is updated. Though it is
 *     possible to `stopImmediatePropagation` in an event callback, attempting to "preventDefault" or "stopPropagation" will do nothing.
 * examples:
 *   - |
 *     ```javascript
 *     import { DynamicProperty } from 'mythix-ui-core@1.0';
 *
 *     let dynamicProperty = new DynamicProperty('initial value');
 *
 *     dynamicProperty.addEventListener('update', (event) => {
 *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
 *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
 *     });
 *
 *     dynamicProperty[DynamicProperty.set]('new value');
 *
 *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
 *     // output -> Current Value = 'initial value'
 *     ```
 */
class DynamicProperty extends EventTarget {
  static [Symbol.hasInstance](instance) { // @ref:_mythixTypeExample
    try {
      return (instance && instance[MYTHIX_TYPE] === DYNAMIC_PROPERTY_TYPE);
    } catch (e) {
      return false;
    }
  }

  /**
   * type: Property
   * name: set
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * static: true
   * desc: |
   *   A special `symbol` used to access the `set` method of a `DynamicProperty`.
   * examples:
   *   - |
   *     ```javascript
   *     import { DynamicProperty } from 'mythix-ui-core@1.0';
   *
   *     let dynamicProperty = new DynamicProperty('initial value');
   *
   *     dynamicProperty.addEventListener('update', (event) => {
   *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
   *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
   *     });
   *
   *     dynamicProperty[DynamicProperty.set]('new value');
   *
   *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
   *     // output -> Current Value = 'initial value'
   *     ```
   */
  static set = DYNAMIC_PROPERTY_SET; // @ref:DynamicProperty.set

  /**
   * type: Function
   * name: constructor
   * groupName: DynamicProperty
   * parent: Utils
   * desc: |
   *   Construct a `DynamicProperty`.
   * arguments:
   *   - name: initialValue
   *     dataType: any
   *     desc:
   *       The initial value to store.
   * notes:
   *   - |
   *     :info: This will return a Proxy instance wrapping the `DynamicProperty` instance.
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If `initialValue` is a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  constructor(initialValue) {
    super();

    Object.defineProperties(this, {
      [MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        DYNAMIC_PROPERTY_TYPE,
      },
      [DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        (isType(initialValue, DynamicProperty)) ? initialValue.valueOf() : initialValue,
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

  /**
   * type: Function
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Fetch the underlying raw value stored by this `DynamicProperty`.
   * return: |
   *   @types: any; The underling raw value.
   */
  valueOf() {
    return this[DYNAMIC_PROPERTY_VALUE];
  }

  /**
   * type: Function
   * name: "[DynamicProperty.set]"
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Set the underlying raw value stored by this `DynamicProperty`.
   *
   *   If the current stored value is exactly the same as the provided `value`,
   *   then this method will simply return.
   *
   *   Otherwise, when the underlying value is updated, `this.dispatchEvent` will
   *   be called to dispatch an `'update'` event to notify all listeners that the
   *   underlying value has been changed.
   * arguments:
   *   - name: newValue
   *     dataType: any
   *     desc: |
   *       The new value to set. If this is itself a `DynamicProperty` instance, then
   *       it will be unwrapped to its underlying value, and that will be used as the value instead.
   *   - name: options
   *     optional: true
   *     dataType: object
   *     desc: |
   *       An object to provided options for the operation. The shape of this object is `{ dispatchUpdateEvent: boolean }`.
   *       If `options.dispatchUpdateEvent` equals `false`, then no `'update'` event will be dispatched to listeners.
   * notes:
   *   - |
   *     :info: If the underlying stored value is exactly the same as the value provided,
   *     then nothing will happen, and the method will simply return.
   *   - |
   *     :info: The underlying value is updated *before* dispatching events.
   *   - |
   *     :info: `DynamicProperty` protects against cyclic event callbacks. If an
   *     event callback again sets the underlying `DynamicProperty` value, then
   *     the value will be set, but no event will be dispatched (to prevent event loops).
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If this method receives a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  [DYNAMIC_PROPERTY_SET](_newValue, _options) {
    let newValue = _newValue;
    if (isType(newValue, DynamicProperty))
      newValue = newValue.valueOf();

    if (this[DYNAMIC_PROPERTY_VALUE] === newValue)
      return;

    if (this[DYNAMIC_PROPERTY_IS_SETTING]) {
      this[DYNAMIC_PROPERTY_VALUE] = newValue;
      return;
    }

    let options = _options || {};

    try {
      this[DYNAMIC_PROPERTY_IS_SETTING] = true;

      let oldValue = this[DYNAMIC_PROPERTY_VALUE];
      this[DYNAMIC_PROPERTY_VALUE] = newValue;

      if (options.dispatchUpdateEvent === false)
        return;

      let updateEvent = new Event('update');

      updateEvent.originator = this;
      updateEvent.oldValue = oldValue;
      updateEvent.value = newValue;

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
  ).filter((name) => {
    if (name === 'this')
      return false;

    return VALID_JS_IDENTIFIER.test(name)
  });

  return `{${contextCallArgs.join(',')}}`;
}

/**
 * groupName: Utils
 * desc: |
 *   Get the parent Node of `element`.
 * arguments:
 *   - name: element
 *     dataType: Node
 *     desc: |
 *       The Node whose parent you wish to find.
 * notes:
 *   - |
 *     :warning: Unlike [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode), this
 *     will also search across Shadow DOM boundaries.
 *   - |
 *     :warning: **Searching across Shadow DOM boundaries only works for Mythix UI components!**
 *   - |
 *     :info: Searching across Shadow DOM boundaries is accomplished via leveraging @see MythixUIComponent.metadata; on
 *     `element`. When a `null` parent is encountered, `getParentNode` will look for @see MythixUIComponent.metadata?caption=metadata; key @see Utils.MYTHIX_SHADOW_PARENT;
 *     on `element`. If found, the result is considered the [parent Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) of `element`.
 * return: |
 *   @types Node; The parent node, if there is any, or `null` otherwise.
 */
function getParentNode(element) {
  if (!element)
    return null;

  if (element.parentNode && element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element.parentNode, MYTHIX_SHADOW_PARENT) || null;

  if (!element.parentNode && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    return metadata(element, MYTHIX_SHADOW_PARENT) || null;

  return element.parentNode;
}

/**
 * groupName: Utils
 * desc: |
 *   Create a Proxy that is essentially (functionally) a multi-prototype `object` instance.
 *
 *   A "scope" in Mythix UI might be better called a "context"... however, "scope"
 *   was chosen because it *is* a scope... or might be better described as "multiple scopes in one".
 *   This is specifically a "DOM scope", in that this method is "DOM aware" and will traverse the
 *   DOM looking for the requested data (if any of the specified `targets` is an Element that is).
 *
 *   The way this works is that the caller will provide at least one "target". These targets are
 *   themselves scopes, elements, or other data objects. When the returned Proxy instance is accessed,
 *   the requested key is searched in all provided `targets`, in the order they were provided.
 *
 *   Aside from searching all targets for the desired key, it will also fallback to other data sources
 *   it searches in as well:
 *   1. If any given `target` it is searching is an Element, then it will also search
 *      for the requested key on the element itself.
 *   2. If step #1 has failed, then move to the parent node of the current Element instance, and
 *      repeat the process, starting from step #1.
 *   3. After steps 1-2 are repeated for every given `target` (and all parent nodes of those `targets`... if any),
 *      then this method will finally fallback to searching `globalThis.mythixUI.globalScope` for the requested key.
 *
 *   We aren't quite finished yet though...
 *
 *   If steps 1-3 above all fail, then this method will still fallback to the fallowing hard-coded key/value pairs:
 *   1. A requested key of `'globalScope'` (if not found on a target) will result in `globalThis.mythixUI.globalScope` being returned.
 *   2. A requested key of `'i18n'` (if not found on a target) will result in the built-in `i18n` language term processor being returned.
 *   3. A requested key of `'dynamicPropID'` (if not found on a target) will result in the built-in `dynamicPropID` dynamic property provided. See @see Utils.dynamicPropID;.
 *
 *   Finally, the returned Proxy will also intercept any value [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set) operation,
 *   to set a value on the first target found.
 *
 *   The Proxy also overloads [ownKeys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys) to list **all** keys across **all** `targets`.
 * arguments:
 *   - name: ...targets
 *     dataTypes:
 *       - Object
 *       - Element
 *       - non-primitive
 *     desc: |
 *       The `targets` to be searched, in the order provided. Targets are searched both for get operations, and set operations (the first target found will be the set target).
 * notes:
 *   - |
 *     :warning: Mythix UI will deliberately never directly access `globalThis` from the template engine (for security reasons).
 *     Because of this, Mythix UI automatically provides its own global scope `globalThis.mythixUI.globalScope`.
 *     If you want data to be "globally" visible to Mythix UI, then you need to add your data to this special global scope.
 *   - |
 *     :info: This method is complex because it is intended to be used to provide a "scope" to the Mythix UI templating engine.
 *     The templating engine needs to be DOM aware, and also needs to have access to specialized, scoped data
 *     (i.e. the `mythix-ui-for-each` component will publish scoped data for each iteration, which needs to be both
 *     DOM-aware, and iteration-aware).
 *   - |
 *     :info: Any provided `target` can also be one of these Proxy scopes returned by this method.
 *   - |
 *     :info: It can help to think of the returned "scope" as an plain Object that has an array of prototypes.
 * return: |
 *   @types Proxy; A proxy instance, that is used to get and set keys across multiple `targets`.
 */
function createScope(..._targets) {
  const findPropNameScope = (target, propName) => {
    if (target == null || Object.is(target, NaN))
      return;

    if (propName in target)
      return target;

    if (!(target instanceof Node))
      return;

    const searchParentNodesForKey = (element) => {
      let currentElement = element;
      if (!currentElement)
        return;

      do {
        if (propName in currentElement)
          return currentElement;

        currentElement = getParentNode(currentElement);
      } while (currentElement);
    };

    return searchParentNodesForKey(target);
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
        if (isType(scope[propName], DynamicProperty))
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

/**
 * groupName: Utils
 * desc: |
 *   Create a context-aware function, or "macro", that can be called and used by the template engine.
 *
 *   If you are ever trying to pass methods or dynamic properties across the DOM, then this is the method you want to use, to
 *   properly "parse" and use the attribute value as intended.
 *
 *   This is used for example for event bindings via attributes. If you have for example an `onclick="doSomething"`
 *   attribute on an element, then this will be used to create a context-aware "macro" for the method "doSomething".
 *
 *   The term "macro" is used here because there are special formats "understood" by the template engine. For example,
 *   prefixing an attribute value with a percent sign, i.e. `name="%globalDynamicPropName"` will use @see Utils.dynamicPropID;
 *   to globally fetch property of this name. This is important, because due to the async nature of the DOM, you might
 *   be requesting a dynamic property that hasn't yet been loaded/defined. This is the purpose of @see Utils.dynamicPropID;,
 *   and this specialized template format: to provide dynamic props by id, that will be available when needed.
 *
 *   The template engine also will happily accept rogue method names. For example, in a Mythix UI component you are building,
 *   you might have an element like `<button onclick="onButtonClick">Click Me!<button>`. The templating engine will detect that
 *   this is ONLY an identifier, and so will search for the specified method in the available "scope" (see @see Utils.createScope;),
 *   which includes `this` instance of your component as the first `target`. This pattern is not required, as you can call your
 *   component method directly yourself, as with any attribute event binding in the DOM, i.e: `<button onclick="this.onButtonClick(event)">Click Me!<button>`.
 *
 *   One last thing to mention is that when these "macro" methods are called by Mythix UI, all enumerable keys of the generated
 *   "scope" (see @see Utils.createScope;) are passed into the macro method as arguments. This means that the keys/values of all scope `targets`
 *   are available directly in your javascript scope. i.e. you can do things like `name="componentInstanceProperty(thisAttribute1, otherAttribute)"` without needing to do
 *   `name="this.componentInstanceProperty(this.thisAttribute1, this.otherAttribute)"`. :warning: It is important to keep in mind that direct reference access like this in a macro
 *   will bypass the "scope" (see @see Utils.createScope;) Proxy, and so if the specified key is not found (passed in as an argument to the macro), then an error will be thrown by javascript.
 *
 *   It is absolutely possible for you to receive and send arguments via these generated "macros". `mythix-ui-search` does this for
 *   example when a "filter" method is passed via an attribute. By default no extra arguments are provided when called directly by the templating engine.
 * arguments:
 *   - name: options
 *     dataType: object
 *     desc: |
 *       An object with the shape `{ body: string; prefix?: string; scope: object; }`.
 *
 *       1. `body` is the actual body of the `new Function`.
 *       2. `scope` is the scope (`this`) that you want to bind to the resulting method.
 *          This would generally be a scope created by @see Utils.createScope;
 *       3. `prefix` an optional prefix for the body of the `new Function`. This prefix is added
 *          before any function body code that Mythix UI generates.
 *          See here @sourceRef _createTemplateMacroPrefixForBindEventToElement; for an example use
 *          of `prefix` (notice how `arguments[1]` is used instead of `arguments[0]`, as `arguments[0]` is always reserved
 *          for local variable names "injected" from the created "scope").
 * notes:
 *   - |
 *     :info: Aside for some behind-the-scene modifications and ease-of-use slickness, this essentially just creates a `new Function` and binds a "scope" (see @see Utils.createScope;) to it.
 *   - |
 *     :info: The provided (and optional) `prefix` can be used as the start of the macro `new Function` body code. i.e. @see Utils.bindEventToElement; does exactly this to allow direct scoped
 *     access to the `event` instance. @sourceRef _createTemplateMacroPrefixForBindEventToElement;
 *   - |
 *     :info: The return method is bound by calling `.bind(scope)`. It is not possible to modify `this` at the call-site.
 * return: |
 *   @types function; A function that is "context aware" by being bound to the provided `scope` (see @see Utils.createScope;).
 */
function createTemplateMacro({ prefix, body, scope }) {
  let functionBody = body;
  if (functionBody.charAt(0) === '%' || EVENT_ACTION_JUST_NAME.test(functionBody)) {
    if (functionBody.charAt(0) === '%') {
      functionBody = `(this.dynamicPropID || globalThis.mythixUI.globalScope.dynamicPropID)('${functionBody.substring(1).trim().replace(/'/g, '\\\'')}')`;
    } else {
      functionBody = `(() => {
        try {
          let ____$ = ${functionBody};
          return (typeof ____$ === 'function') ? ____$.apply(this, Array.from(arguments).slice(1)) : ____$;
        } catch (e) {
          return this.${functionBody.replace(/^\s*this\./, '')}.apply(this, Array.from(arguments).slice(1));
        }
      })();`;
    }
  }

  let contextCallArgs = getContextCallArgs(scope, { '__macroSource': null, '__expandedMacroSource': null });

  functionBody = `try { ${(prefix) ? `${prefix};` : ''}return ${(functionBody || '(void 0)').replace(/^\s*return\s+/, '').trim()}; } catch (error) { console.error(\`Error in macro [\${__macroSource}]:\`, error, __expandedMacroSource); throw error; }`;

  let localScope = Object.create(scope);
  localScope.__macroSource = body;
  localScope.__expandedMacroSource = functionBody;

  return (new Function(contextCallArgs, functionBody)).bind(scope || {}, scope);
}

/**
 * groupName: Utils
 * desc: |
 *   Parse a template, and return its parts. A template "part" is one of two types: `'literal'`, or `'macro'`.
 *
 *   Take for example the following template: `'Hello \@@greeting@@!!!'`. This template would result in three "parts" after parsing:
 *   1. `{ type: 'literal', source: 'Hello ', start: 0, end: 6 }`
 *   2. `{ type: 'macro', source: '\@@greeting@@', macro: <function>, start: 6, end: 18 }`
 *   3. `{ type: 'literal', source: '!!!', start: 18, end: 21 }`
 *
 *   Concatenating all `source` properties together will result in the original input.
 *   Concatenating all `source` properties, along with the result of calling all `macro` functions, will result in the output (i.e. `part[0].source + part[1].macro() + part[2].source`).
 *   The `macro` property is the actual macro function for the parsed template part (i.e. in our example `'\@@greeting@@'`).
 *   `start` and `end` are the offsets from the original `text` where the part can be found.
 * arguments:
 *   - name: text
 *     dataType: string
 *     desc: |
 *       The template string to parse.
 *   - name: options
 *     dataType: object
 *     desc: |
 *       Options for the operation. The shape of this object is `{ prefix?: string, scope: object }`.
 *       `scope` defines the scope for macros created by this method (see @see Utils.createScope;).
 *       `prefix` defines a function body prefix to use while creating macros (see @see Utils.createTemplateMacro;).
 * notes:
 *   - |
 *     :info: To skip parsing a specific template part, prefix with a backslash, i.e. `\\\\@@greeting@@`.
 * return: |
 *   @types Array<TemplatePart>; **TemplatePart**: `{ type: 'literal' | 'macro', source: string, start: number, end: number, macro?: function }`. Return all parsed parts of the template.
 */
function parseTemplateParts(text, _options) {
  let options       = _options || {};
  let parts         = [];
  let currentOffset = 0;

  const addLiteral = (startOffset, endOffset) => {
    let source = text.substring(startOffset, endOffset).replace(/\\@@/g, '@@');
    parts.push({ type: 'literal', source, start: startOffset, end: endOffset });
  };

  text.replace(/(?<!\\)(@@)(.+?)\1/g, (m, _, parsedText, offset) => {
    if (currentOffset < offset)
      addLiteral(currentOffset, offset);

    currentOffset = offset + m.length;

    let macro = createTemplateMacro({ ...options, body: parsedText });
    parts.push({ type: 'macro', source: m, macro, start: offset, end: currentOffset });
  });

  if (currentOffset < text.length)
    addLiteral(currentOffset, text.length);

  return parts;
}

const NOOP = (item) => item;

/**
 * groupName: Utils
 * desc: |
 *   Compile the template parts that were parsed by @see Utils.parseTemplateParts;.
 *
 *   It is also possible to provide this method an array of @see Elements.ElementDefinition; instances,
 *   or @see QueryEngine.QueryEngine; instances (that contain @see Elements.ElementDefinition; instances).
 *   If either of these types are found in the input array (even one), then the entire result is returned
 *   as a raw array.
 *
 *   Or, if any of the resulting parts is **not** a @see Utils.parseTemplateParts?caption=TemplatePart; or a `string`,
 *   then return the resulting value raw.
 *
 *   Otherwise, if all resulting parts are a `string`, then the resulting parts are joined, and a `string` is returned.
 * arguments:
 *   - name: parts
 *     dataTypes:
 *       - Array<TemplatePart>
 *       - Array<ElementDefinition>
 *       - Array<QueryEngine>
 *       - Array<any>
 *     desc: |
 *       The template parts to compile together.
 * return: |
 *   @types Array<any>; @types string; Return the result as a string, or an array of raw values, or a raw value.
 */
function compileTemplateFromParts(parts, callback) {
  let result = parts
    .map((part) => {
      if (!part)
        return part;

      if (part[MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE || part[MYTHIX_TYPE] === QUERY_ENGINE_TYPE)
        return part;

      try {
        if (part.type === 'literal')
          return part.source;
        else if (part.type === 'macro')
          return part.macro();

        return part;
      } catch (e) {
        console.error(e);
        return part.source;
      }
    })
    .map(callback || NOOP)
    .filter((item) => (item != null && item !== ''));

  if (result.some((item) => (item[MYTHIX_TYPE] === ELEMENT_DEFINITION_TYPE || item[MYTHIX_TYPE] === QUERY_ENGINE_TYPE)))
    return result;

  if (result.some((item) => isType(item, '::String')))
    return result.join('');

  return (result.length < 2) ? result[0] : result;
}

const FORMAT_TERM_ALLOWABLE_NODES = [ 3, 2 ]; // TEXT_NODE, ATTRIBUTE_NODE

/**
 * groupName: Utils
 * desc: |
 *   Given a Node, take the `.nodeValue` of that node, and if it is a template,
 *   parse that template using @see Utils.parseTemplateParts;, and then
 *   compile that template using @see Utils.compileTemplateFromParts;. The
 *   resulting template parts are then scanned. If any of the `macro()` calls
 *   result in a @see Utils.DynamicProperty?caption=DynamicProperty;, then set up
 *   listeners via `addEventListener('update', ...)` on each to listen for
 *   changes to dynamic properties. When a listener updates, the template parts
 *   are recompiled, and the `.nodeValue` is set again with the new result.
 *
 *   In short, this method formats the value of a Node if the value is a template,
 *   and in doing so binds to dynamic properties for future updates to this node.
 *
 *   If the `.nodeValue` of the Node is detected to **not** be a template, then
 *   the result is a no-operation, and the raw value of the Node is simply returned.
 * arguments:
 *   - name: node
 *     dataType: Node
 *     desc: |
 *       The Node whose value should be formatted. This must be a TEXT_NODE or a ATTRIBUTE_NODE.
 * return: |
 *   @types string; The resulting node value. If a template was successfully compiled, dynamic properties
 *   are also listened to for future updates.
 */
function formatNodeValue(node, _options) {
  if (node.parentNode && (/^(style|script)$/).test(node.parentNode.localName))
    return node.nodeValue;

  if (!node || FORMAT_TERM_ALLOWABLE_NODES.indexOf(node.nodeType) < 0)
    throw new TypeError('"formatNodeValue" unsupported node type provided. Only TEXT_NODE and ATTRIBUTE_NODE types are supported.');

  let options       = _options || {};
  let text          = node.nodeValue;
  let templateParts = parseTemplateParts(text, options);

  // templateParts.forEach(({ type, macro }) => {
  //   if (type !== 'macro')
  //     return;

  //   let result = macro();
  //   if (options.bindToDynamicProperties !== false && isType(result, DynamicProperty)) {
  //     result.addEventListener('update', () => {
  //       let result = ('' + compileTemplateFromParts(templateParts));
  //       if (result !== node.nodeValue)
  //         node.nodeValue = result;
  //     }, { capture: true });
  //   }
  // });

  let result = compileTemplateFromParts(templateParts, (result) => {
    if (result && options.bindToDynamicProperties !== false && isType(result, DynamicProperty)) {
      result.addEventListener('update', () => {
        let result = ('' + compileTemplateFromParts(templateParts));
        if (result !== node.nodeValue)
          node.nodeValue = result;
      }, { capture: true });
    }

    return result;
  });

  if (result == null)
    result = '';

  return (options.disallowHTML === true) ? ('' + result) : result;
}

const IS_TEMPLATE = /(?<!\\)@@/;
function isTemplate(value) {
  if (!isType(value, '::String'))
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

  if (isType(callback, '::String'))
    callback = createTemplateMacro({ prefix: 'let event=arguments[1]', body: callback, scope: this }); // @ref:_createTemplateMacroPrefixForBindEventToElement

  element.addEventListener(eventName, callback, options);

  return { callback, options };
}

function fetchPath(obj, key, defaultValue) {
  if (obj == null || Object.is(obj, NaN) || Object.is(obj, Infinity) || Object.is(obj, -Infinity))
    return defaultValue;

  if (key == null || Object.is(key, NaN) || Object.is(key, Infinity) || Object.is(key, -Infinity))
    return defaultValue;

  let parts         = key.split(/(?<!\\)\./g).filter(Boolean);
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
function dynamicPropID(id, setValue) {
  let prop = DYNAMIC_PROP_REGISTRY.get(id);
  if (prop) {
    if (arguments.length > 1)
      prop[DynamicProperty.set](setValue);

    return prop;
  }

  prop = new DynamicProperty((arguments.length > 1) ? setValue : '');
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
    if (isType(currentValue, DynamicProperty)) {
      globalThis.mythixUI.globalScope[name][DynamicProperty.set](value);
      return currentValue;
    }

    if (isType(value, DynamicProperty)) {
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

  let nameValuePair = (isCollectable(args[0])) ? metadata(
    args[0],                        // context
    MYTHIX_NAME_VALUE_PAIR_HELPER,  // special key
  ) : null; // @ref:_mythixNameValuePairHelperUsage

  if (nameValuePair) {
    let [ name, value ] = nameValuePair;
    setOnGlobal(name, value);
  } else if (args.length > 1 && isType(args[0], '::String')) {
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

class StorageItem {
  constructor(value) {
    this._c = Date.now();
    this._u = Date.now();
    this._v = value;
  }

  getValue() {
    return this._v;
  }

  setValue(value) {
    this._u = Date.now();
    this._v = value;
  }

  toJSON() {
    return {
      $type:  'StorageItem',
      _c:     this._c,
      _u:     this._u,
      _v:     this._v,
    };
  }
}

class Storage {
  _revive(data, _alreadyVisited) {
    if (!data || isPrimitive(data))
      return data;

    let alreadyVisited  = _alreadyVisited || new Set();
    let type            = (data && data.$type);

    if (type) {
      if (type === 'StorageItem') {
        let value = data._v;

        return Object.assign(new StorageItem(), {
          _c: data._c,
          _u: data._u,
          _v: (value && !isPrimitive(value)) ? this._revive(value, alreadyVisited) : value,
        });
      }
    }

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || isPrimitive(value))
        continue;

      if (alreadyVisited.has(value))
        continue;

      alreadyVisited.add(value);
      data[key] = this._revive(value, alreadyVisited);
    }

    return data;
  }

  _raw(data, _alreadyVisited) {
    if (!data || isPrimitive(data))
      return data;

    let alreadyVisited = _alreadyVisited || new Set();
    if (data instanceof StorageItem)
      return this._raw(data.getValue(), alreadyVisited);

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || isPrimitive(value))
        continue;

      if (alreadyVisited.has(value))
        continue;

      alreadyVisited.add(value);
      data[key] = this._raw(value, alreadyVisited);
    }

    return data;
  }

  _getPartsForOperation(type, parts) {
    let pathParts   = (type === 'set') ? parts.slice(0, -1) : parts.slice();
    let path        = pathParts.map((part) => ((typeof part === 'symbol') ? part.toString() : ('' + part)).replace(/\./g, '\\.')).join('.');
    let parsedParts = path.split(/(?<!\\)\./g);
    let storageType = parsedParts[0];
    let data        = (type === 'set') ? parts[parts.length - 1] : undefined;

    // localStorage, or sessionStorage
    let storageEngine = globalThis[storageType];
    if (!storageEngine)
      return;

    let rootData    = {};
    let encodedBase = storageEngine.getItem('mythix-ui');
    if (encodedBase)
      rootData = this._revive(JSON.parse(encodedBase));

    return {
      pathParts,
      path,
      parsedParts,
      storageType,
      data,
      storageEngine,
      encodedBase,
      rootData,
    };
  }

  _getMeta(type, parts) {
    let operation = this._getPartsForOperation(type, parts);
    let {
      parsedParts,
      rootData,
    } = operation;

    let scope        = rootData;
    let parentScope  = null;

    for (let i = 1, il = parsedParts.length; i < il; i++) {
      if (scope instanceof StorageItem) {
        scope = scope.getValue();
        if (!scope)
          break;
      }

      let part = parsedParts[i];
      let subScope = (scope) ? scope[part] : scope;
      if (type === 'set' && !subScope)
        subScope = scope[part] = {};

      if (subScope == null || Object.is(subScope, NaN) || Object.is(subScope, -Infinity) || Object.is(subScope, Infinity))
        break;

      parentScope = scope;
      scope = subScope;
    }

    return {
      operation,
      parentScope,
      scope,
    };
  }

  getMeta(...parts) {
    return this._getMeta('get', parts);
  }

  get(...parts) {
    let { scope } = this._getMeta('get', parts);
    return this._raw(scope);
  }

  set(...parts) {
    let {
      operation,
      parentScope,
      scope,
    } = this._getMeta('set', parts);

    let {
      data,
      parsedParts,
      path,
      rootData,
      storageEngine,
    } = operation;

    if (data === undefined) {
      // Delete
      if (parentScope)
        delete parentScope[parsedParts[parsedParts.length - 1]];
      else
        delete scope[parsedParts[parsedParts.length - 1]];
    } else {
      if (parentScope)
        parentScope[parsedParts[parsedParts.length - 1]] = new StorageItem(data);
      else
        scope[parsedParts[parsedParts.length - 1]] = new StorageItem(data);
    }

    storageEngine.setItem('mythix-ui', JSON.stringify(rootData));

    return path;
  }

}

const storage = new Storage();


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
/* harmony export */   Components: () => (/* reexport module object */ _components_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   DynamicProperty: () => (/* binding */ DynamicProperty),
/* harmony export */   Elements: () => (/* reexport module object */ _elements_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   MythixUIComponent: () => (/* binding */ MythixUIComponent),
/* harmony export */   MythixUILanguagePack: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__.MythixUILanguagePack),
/* harmony export */   MythixUILanguageProvider: () => (/* reexport safe */ _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__.MythixUILanguageProvider),
/* harmony export */   MythixUIRequire: () => (/* reexport safe */ _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__.MythixUIRequire),
/* harmony export */   MythixUISpinner: () => (/* reexport safe */ _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__.MythixUISpinner),
/* harmony export */   QUERY_ENGINE_TYPE: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QUERY_ENGINE_TYPE),
/* harmony export */   QueryEngine: () => (/* reexport safe */ _query_engine_js__WEBPACK_IMPORTED_MODULE_3__.QueryEngine),
/* harmony export */   Utils: () => (/* reexport module object */ _utils_js__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components.js */ "./lib/components.js");
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements.js */ "./lib/elements.js");
/* harmony import */ var _query_engine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-engine.js */ "./lib/query-engine.js");
/* harmony import */ var _mythix_ui_require_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mythix-ui-require.js */ "./lib/mythix-ui-require.js");
/* harmony import */ var _mythix_ui_language_provider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mythix-ui-language-provider.js */ "./lib/mythix-ui-language-provider.js");
/* harmony import */ var _mythix_ui_spinner_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mythix-ui-spinner.js */ "./lib/mythix-ui-spinner.js");
globalThis.mythixUI = (globalThis.mythixUI || {});
globalThis.mythixUI.globalScope = (globalThis.mythixUI.globalScope || {});

if (typeof document !== 'undefined' && !globalThis.mythixUI.globalScope.url)
  globalThis.mythixUI.globalScope.url = new URL(document.location);














const MythixUIComponent = _components_js__WEBPACK_IMPORTED_MODULE_1__.MythixUIComponent;
const DynamicProperty   = _utils_js__WEBPACK_IMPORTED_MODULE_0__.DynamicProperty;



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
globalThis.mythixUI.Components = _components_js__WEBPACK_IMPORTED_MODULE_1__;
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
      _components_js__WEBPACK_IMPORTED_MODULE_1__.visibilityObserver(({ disconnect, element, wasVisible }) => {
        if (wasVisible)
          return;

        disconnect();

        let src = element.getAttribute('data-mythix-src');
        if (!src)
          return;

        _components_js__WEBPACK_IMPORTED_MODULE_1__.loadPartialIntoElement.call(element, src).then(() => {
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
          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.attributeChangedCallback.call(target, mutation.attributeName, oldValue, newValue);
        }
      } else if (mutation.type === 'childList') {
        let disableTemplating = (disableTemplateEngineSelectorStr && target && typeof target.closest === 'function' && target.closest('[data-templates-disable],mythix-for-each'));
        let addedNodes        = mutation.addedNodes;
        for (let j = 0, jl = addedNodes.length; j < jl; j++) {
          let node = addedNodes[j];

          if (node[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationAdded.call(node, mutation) === false)
            continue;

          if (!disableTemplating)
            _elements_js__WEBPACK_IMPORTED_MODULE_2__.processElements(node);

          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
            target.onMutationChildAdded(node, mutation);
        }

        let removedNodes = mutation.removedNodes;
        for (let j = 0, jl = removedNodes.length; j < jl; j++) {
          let node = removedNodes[j];
          if (node[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent] && node.onMutationRemoved.call(node, mutation) === false)
            continue;

          if (target[_components_js__WEBPACK_IMPORTED_MODULE_1__.isMythixComponent])
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
var __webpack_exports__DynamicProperty = __webpack_exports__.DynamicProperty;
var __webpack_exports__Elements = __webpack_exports__.Elements;
var __webpack_exports__MythixUIComponent = __webpack_exports__.MythixUIComponent;
var __webpack_exports__MythixUILanguagePack = __webpack_exports__.MythixUILanguagePack;
var __webpack_exports__MythixUILanguageProvider = __webpack_exports__.MythixUILanguageProvider;
var __webpack_exports__MythixUIRequire = __webpack_exports__.MythixUIRequire;
var __webpack_exports__MythixUISpinner = __webpack_exports__.MythixUISpinner;
var __webpack_exports__QUERY_ENGINE_TYPE = __webpack_exports__.QUERY_ENGINE_TYPE;
var __webpack_exports__QueryEngine = __webpack_exports__.QueryEngine;
var __webpack_exports__Utils = __webpack_exports__.Utils;
export { __webpack_exports__Components as Components, __webpack_exports__DynamicProperty as DynamicProperty, __webpack_exports__Elements as Elements, __webpack_exports__MythixUIComponent as MythixUIComponent, __webpack_exports__MythixUILanguagePack as MythixUILanguagePack, __webpack_exports__MythixUILanguageProvider as MythixUILanguageProvider, __webpack_exports__MythixUIRequire as MythixUIRequire, __webpack_exports__MythixUISpinner as MythixUISpinner, __webpack_exports__QUERY_ENGINE_TYPE as QUERY_ENGINE_TYPE, __webpack_exports__QueryEngine as QueryEngine, __webpack_exports__Utils as Utils };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTRFLElBQUk7QUFDaEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpREFBaUQ7O0FBRWpEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRkE7O0FBRW9EOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyw4QkFBOEIsNkRBQWlCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVO0FBQy9CO0FBQ0E7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLEtBQUs7QUFDdEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsaURB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEtBQTRLO0FBQzVLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJIQUEySDtBQUMzSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtJQUFrSTtBQUNsSTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsK0RBQStELEdBQUc7O0FBRXZHOztBQUVBLFdBQVc7QUFDWDs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87O0FBRVA7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTzs7QUFFUDs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7O0FBRUEsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxRQUFRO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVPOzs7Ozs7O1NDNW5FUDtTQUNBOztTQUVBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBOztTQUVBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBOzs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLGdEQUFnRDtBQUNoRCx3RUFBd0U7O0FBRXhFO0FBQ0E7O0FBRW9DO0FBQ1U7QUFDSjs7QUFFTjs7QUFFRjtBQUNZO0FBQ0o7QUFDSDtBQUNVO0FBQ1Y7O0FBRXZDLDBCQUEwQiw2REFBNEI7QUFDdEQsMEJBQTBCLHNEQUFxQjs7QUFLN0M7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRCw0QkFBNEIsc0NBQUs7QUFDakMsaUNBQWlDLDJDQUFVO0FBQzNDLCtCQUErQix5Q0FBUTtBQUN2Qyw4Q0FBOEMsa0RBQWlCO0FBQy9ELHFEQUFxRCx5REFBd0I7O0FBRTdFO0FBQ0EsU0FBUyxvREFBbUI7QUFDNUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDhEQUE2QixJQUFJLGlDQUFpQztBQUN4RTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLGtFQUFpQztBQUN6QztBQUNBLFNBQVM7QUFDVCxPQUFPLElBQUksVUFBVTs7QUFFckI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBLDJDQUEyQyx1RUFBc0M7QUFDakYsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLGlEQUFnQjtBQUN4QyxvQ0FBb0Msc0RBQXFCLGtCQUFrQixPQUFPLGtEQUFpQiw4QkFBOEI7O0FBRWpJO0FBQ0E7QUFDQSxxQkFBcUIsNkRBQTRCO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLGdEQUFnRCxRQUFRO0FBQ3hEOztBQUVBLG1CQUFtQiw2REFBNEI7QUFDL0M7O0FBRUE7QUFDQSxZQUFZLHlEQUF3Qjs7QUFFcEMscUJBQXFCLDZEQUE0QjtBQUNqRDtBQUNBOztBQUVBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxtQkFBbUIsNkRBQTRCO0FBQy9DOztBQUVBLHFCQUFxQiw2REFBNEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUseURBQXdCO0FBQzFCLEVBQUUseURBQXdCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL2NvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvZWxlbWVudHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1yZXF1aXJlLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL215dGhpeC11aS1zcGlubmVyLmpzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlLy4vbGliL3F1ZXJ5LWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9zaGEyNTYuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvLi9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215dGhpeC11aS1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbXl0aGl4LXVpLWNvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teXRoaXgtdWktY29yZS8uL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBpc01lcmdlYWJsZU9iamVjdCA9IGZ1bmN0aW9uIGlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpXG5cdFx0JiYgIWlzU3BlY2lhbCh2YWx1ZSlcbn07XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuXHR2YXIgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXG5cdHJldHVybiBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblx0XHR8fCBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgRGF0ZV0nXG5cdFx0fHwgaXNSZWFjdEVsZW1lbnQodmFsdWUpXG59XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9iNWFjOTYzZmI3OTFkMTI5OGU3ZjM5NjIzNjM4M2JjOTU1ZjkxNmMxL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxLUwyNVxudmFyIGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBjYW5Vc2VTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG5cbmZ1bmN0aW9uIGVtcHR5VGFyZ2V0KHZhbCkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gKG9wdGlvbnMuY2xvbmUgIT09IGZhbHNlICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodmFsdWUpKVxuXHRcdD8gZGVlcG1lcmdlKGVtcHR5VGFyZ2V0KHZhbHVlKSwgdmFsdWUsIG9wdGlvbnMpXG5cdFx0OiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gdGFyZ2V0LmNvbmNhdChzb3VyY2UpLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKGVsZW1lbnQsIG9wdGlvbnMpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG5cdGlmICghb3B0aW9ucy5jdXN0b21NZXJnZSkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2Vcblx0fVxuXHR2YXIgY3VzdG9tTWVyZ2UgPSBvcHRpb25zLmN1c3RvbU1lcmdlKGtleSk7XG5cdHJldHVybiB0eXBlb2YgY3VzdG9tTWVyZ2UgPT09ICdmdW5jdGlvbicgPyBjdXN0b21NZXJnZSA6IGRlZXBtZXJnZVxufVxuXG5mdW5jdGlvbiBnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc1xuXHRcdD8gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpLmZpbHRlcihmdW5jdGlvbihzeW1ib2wpIHtcblx0XHRcdHJldHVybiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIHN5bWJvbClcblx0XHR9KVxuXHRcdDogW11cbn1cblxuZnVuY3Rpb24gZ2V0S2V5cyh0YXJnZXQpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKHRhcmdldCkuY29uY2F0KGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSlcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlJc09uT2JqZWN0KG9iamVjdCwgcHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gcHJvcGVydHkgaW4gb2JqZWN0XG5cdH0gY2F0Y2goXykge1xuXHRcdHJldHVybiBmYWxzZVxuXHR9XG59XG5cbi8vIFByb3RlY3RzIGZyb20gcHJvdG90eXBlIHBvaXNvbmluZyBhbmQgdW5leHBlY3RlZCBtZXJnaW5nIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4uXG5mdW5jdGlvbiBwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSB7XG5cdHJldHVybiBwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpIC8vIFByb3BlcnRpZXMgYXJlIHNhZmUgdG8gbWVyZ2UgaWYgdGhleSBkb24ndCBleGlzdCBpbiB0aGUgdGFyZ2V0IHlldCxcblx0XHQmJiAhKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSAvLyB1bnNhZmUgaWYgdGhleSBleGlzdCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLFxuXHRcdFx0JiYgT2JqZWN0LnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGFyZ2V0LCBrZXkpKSAvLyBhbmQgYWxzbyB1bnNhZmUgaWYgdGhleSdyZSBub25lbnVtZXJhYmxlLlxufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHR2YXIgZGVzdGluYXRpb24gPSB7fTtcblx0aWYgKG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkge1xuXHRcdGdldEtleXModGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHRhcmdldFtrZXldLCBvcHRpb25zKTtcblx0XHR9KTtcblx0fVxuXHRnZXRLZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAocHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3Qoc291cmNlW2tleV0pKSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGRlc3RpbmF0aW9uXG59XG5cbmZ1bmN0aW9uIGRlZXBtZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlO1xuXHRvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0ID0gb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCB8fCBpc01lcmdlYWJsZU9iamVjdDtcblx0Ly8gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgaXMgYWRkZWQgdG8gYG9wdGlvbnNgIHNvIHRoYXQgY3VzdG9tIGFycmF5TWVyZ2UoKVxuXHQvLyBpbXBsZW1lbnRhdGlvbnMgY2FuIHVzZSBpdC4gVGhlIGNhbGxlciBtYXkgbm90IHJlcGxhY2UgaXQuXG5cdG9wdGlvbnMuY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZDtcblxuXHR2YXIgc291cmNlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoc291cmNlKTtcblx0dmFyIHRhcmdldElzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRhcmdldCk7XG5cdHZhciBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheTtcblxuXHRpZiAoIXNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2gpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2UgaWYgKHNvdXJjZUlzQXJyYXkpIHtcblx0XHRyZXR1cm4gb3B0aW9ucy5hcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fVxufVxuXG5kZWVwbWVyZ2UuYWxsID0gZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5LCBvcHRpb25zKSB7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSBhbiBhcnJheScpXG5cdH1cblxuXHRyZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG5leHQpIHtcblx0XHRyZXR1cm4gZGVlcG1lcmdlKHByZXYsIG5leHQsIG9wdGlvbnMpXG5cdH0sIHt9KVxufTtcblxudmFyIGRlZXBtZXJnZV8xID0gZGVlcG1lcmdlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZXBtZXJnZV8xO1xuIiwiaW1wb3J0ICogYXMgVXRpbHMgICAgICAgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBRdWVyeUVuZ2luZSB9ICBmcm9tICcuL3F1ZXJ5LWVuZ2luZS5qcyc7XG5pbXBvcnQgKiBhcyBFbGVtZW50cyAgICBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuLyoqXG4gKiB0eXBlOiBOYW1lc3BhY2VcbiAqIG5hbWU6IENvbXBvbmVudHNcbiAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgQ29tcG9uZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgQ29tcG9uZW50IGFuZCBmcmFtZXdvcmsgY2xhc3NlcyBhbmQgZnVuY3Rpb25hbGl0eSBhcmUgZm91bmQgaGVyZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogaXNNeXRoaXhDb21wb25lbnRcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhbiBpbnN0YW5jZSBrZXkgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IGluc3RhbmNlcy5cbiAqXG4gKiAgICAgICBGb3Igc3VjaCBpbnN0YW5jZXMsIGFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IHNpbXBseSByZXR1cm5zIGB0cnVlYCwgYWxsb3dpbmcgdGhlIGNhbGxlclxuICogICAgICAgdG8ga25vdyBpZiBhIHNwZWNpZmljIGluc3RhbmNlIChFbGVtZW50KSBpcyBhIE15dGhpeCBVSSBjb21wb25lbnQuXG4gKiAgIC0gbmFtZTogTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlNcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBzeW1ib2wgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBhZ2FpbnN0IGVsZW1lbnRzIHdpdGggYSBgZGF0YS1zcmNgIGF0dHJpYnV0ZS5cbiAqICAgICAgIEZvciBlbGVtZW50cyB3aXRoIHRoaXMgYXR0cmlidXRlLCBzZXQgYW4gW2ludGVyc2VjdGlvbiBvYnNlcnZlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbl9PYnNlcnZlcl9BUEkpIGlzIHNldHVwLlxuICogICAgICAgV2hlbiB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVyIHJlcG9ydHMgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCB0aGVuIHRoZSBVUkwgc3BlY2lmaWVkIGJ5IGBkYXRhLXNyY2AgaXMgZmV0Y2hlZCwgYW5kIGR1bXBlZCBpbnRvXG4gKiAgICAgICB0aGUgZWxlbWVudCBhcyBpdHMgY2hpbGRyZW4uIFRoaXMgYWxsb3dzIGZvciBkeW5hbWljIFwicGFydGlhbHNcIiB0aGF0IGFyZSBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gKlxuICogICAgICAgVGhlIHZhbHVlIHN0b3JlZCBhdCB0aGlzIEBzZWUgVXRpbHMubWV0YWRhdGE7IGtleSBpcyBhIE1hcCBvZiBbaW50ZXJzZWN0aW9uIG9ic2VydmVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpXG4gKiAgICAgICBpbnN0YW5jZXMuIFRoZSBrZXlzIG9mIHRoaXMgbWFwIGFyZSB0aGUgaW50ZXJzZWN0aW9uIG9ic2VydmVycyB0aGVtc2VsdmVzLiBUaGUgdmFsdWVzIGFyZSByYXcgb2JqZWN0cyB3aXRoIHRoZSBzaGFwZVxuICogICAgICAgYHsgd2FzVmlzaWJsZTogYm9vbGVhbiwgcmF0aW9WaXNpYmxlOiBmbG9hdCwgcHJldmlvdXNWaXNpYmlsaXR5OiBib29sZWFuLCB2aXNpYmlsaXR5OiBib29sZWFuIH1gLlxuICovXG5cbmNvbnN0IElTX0FUVFJfTUVUSE9EX05BTUUgICA9IC9eYXR0clxcJCguKikkLztcbmNvbnN0IFJFR0lTVEVSRURfQ09NUE9ORU5UUyA9IG5ldyBTZXQoKTtcblxuZXhwb3J0IGNvbnN0IGlzTXl0aGl4Q29tcG9uZW50ICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbXBvbmVudC9jb25zdGFudHMvaXMtbXl0aGl4LWNvbXBvbmVudCcpOyAvLyBAcmVmOkNvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRcbmV4cG9ydCBjb25zdCBNWVRISVhfSU5URVJTRUNUSU9OX09CU0VSVkVSUyAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL2ludGVyc2VjdGlvbi1vYnNlcnZlcnMnKTsgLy8gQHJlZjpDb21wb25lbnRzLk1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTXG5leHBvcnQgY29uc3QgTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVEICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9kb2N1bWVudC1pbml0aWFsaXplZCcpOyAvLyBAcmVmOkNvbXBvbmVudHMuTVlUSElYX0RPQ1VNRU5UX0lOSVRJQUxJWkVEXG5cbmV4cG9ydCBjb25zdCBNWVRISVhfVUlfQ09NUE9ORU5UX1RZUEUgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6TXl0aGl4VUlDb21wb25lbnQnKTtcblxuLyoqKlxuICogZ3JvdXBOYW1lOiBDb21wb25lbnRzXG4gKiBkZXNjOiB8XG4gKiAgIFRoaXMgdGhlIGJhc2UgY2xhc3Mgb2YgYWxsIE15dGhpeCBVSSBjb21wb25lbnRzLiBJdCBpbmhlcml0c1xuICogICBmcm9tIEhUTUxFbGVtZW50LCBhbmQgc28gd2lsbCBlbmQgdXAgYmVpbmcgYSBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKS5cbiAqXG4gKiAgIEl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91IGZ1bGx5IHJlYWQgdXAgYW5kIHVuZGVyc3RhbmRcbiAqICAgW1dlYiBDb21wb25lbnRzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0NvbXBvbmVudHMpXG4gKiAgIGlmIHlvdSBkb24ndCBhbHJlYWR5IGZ1bGx5IHVuZGVyc3RhbmQgdGhlbS4gVGhlIGNvcmUgb2YgTXl0aGl4IFVJIGlzIHRoZVxuICogICBbV2ViIENvbXBvbmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Db21wb25lbnRzKSBzdGFuZGFyZCxcbiAqICAgc28geW91IG1pZ2h0IGVuZCB1cCBhIGxpdHRsZSBjb25mdXNlZCBpZiB5b3UgZG9uJ3QgYWxyZWFkeSB1bmRlcnN0YW5kIHRoZSBmb3VuZGF0aW9uLlxuICpcbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gY2FwdGlvbjogXCIuLi4gSFRNTEVsZW1lbnQgSW5zdGFuY2UgUHJvcGVydGllc1wiXG4gKiAgICAgZGVzYzogXCJBbGwgW0hUTUxFbGVtZW50IEluc3RhbmNlIFByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudCNpbnN0YW5jZV9wcm9wZXJ0aWVzKSBhcmUgaW5oZXJpdGVkIGZyb20gW0hUTUxFbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQpXCJcbiAqICAgICBsaW5rOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTEVsZW1lbnQjaW5zdGFuY2VfcHJvcGVydGllc1xuICpcbiAqICAgLSBuYW1lOiBpc015dGhpeENvbXBvbmVudFxuICogICAgIGRhdGFUeXBlOiBib29sZWFuXG4gKiAgICAgY2FwdGlvbjogXCJbc3RhdGljIE15dGhpeFVJQ29tcG9uZW50LmlzTXl0aGl4Q29tcG9uZW50XVwiXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgSXMgYHRydWVgIGZvciBNeXRoaXggVUkgY29tcG9uZW50cy5cbiAqICAgLSBuYW1lOiBzZW5zaXRpdmVUYWdOYW1lXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGNhcHRpb246IHNlbnNpdGl2ZVRhZ05hbWVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBXb3JrcyBpZGVudGljYWxseSB0byBbRWxlbWVudC50YWdOYW1lXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC90YWdOYW1lKSBmb3IgWE1MLCB3aGVyZSBjYXNlIGlzIHByZXNlcnZlZC5cbiAqICAgICAgIEluIEhUTUwgdGhpcyB3b3JrcyBsaWtlIFtFbGVtZW50LnRhZ05hbWVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3RhZ05hbWUpLCBidXQgaW5zdGVhZCBvZiB0aGUgcmVzdWx0XG4gKiAgICAgICBhbHdheXMgYmVpbmcgVVBQRVJDQVNFLCB0aGUgdGFnIG5hbWUgd2lsbCBiZSByZXR1cm5lZCB3aXRoIHRoZSBjYXNpbmcgcHJlc2VydmVkLlxuICogICAtIG5hbWU6IHRlbXBsYXRlSURcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgY2FwdGlvbjogdGVtcGxhdGVJRFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlIHZhbHVlIG9mIGB0aGlzLmNvbnN0cnVjdG9yLlRFTVBMQVRFX0lEYFxuICogICAtIG5hbWU6IGRlbGF5VGltZXJzXG4gKiAgICAgZGF0YVR5cGU6IFwiTWFwJmx0O3N0cmluZywgUHJvbWlzZSZndDtcIlxuICogICAgIGNhcHRpb246IGRlbGF5VGltZXJzXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgQSBNYXAgaW5zdGFuY2UgdGhhdFxuICogICAgICAgcmV0YWlucyBgc2V0VGltZW91dGAgaWRzIHNvIHRoYXQgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5kZWJvdW5jZTsgY2FuIHByb3Blcmx5IGZ1bmN0aW9uLiBLZXlzIGFyZSBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAgICAgdGltZXIgaWRzIChvZiB0eXBlIGBzdHJpbmdgKS4gVmFsdWVzIGFyZSBQcm9taXNlIGluc3RhbmNlcy5cbiAqICAgICAgIEVhY2ggcHJvbWlzZSBpbnN0YW5jZSBhbHNvIGhhcyBhIHNwZWNpYWwga2V5IGB0aW1lcklEYCB0aGF0IGNvbnRhaW5zIGEgYHNldFRpbWVvdXRgIGlkIG9mIGEgamF2YXNjcmlwdCB0aW1lci5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmRlYm91bmNlO1xuICogICAtIG5hbWU6IHNoYWRvd1xuICogICAgIGRhdGFUeXBlOiBcIltTaGFkb3dSb290XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2hhZG93Um9vdClcIlxuICogICAgIGNhcHRpb246IHNoYWRvd1xuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBzaGFkb3cgcm9vdCBvZiB0aGlzIGNvbXBvbmVudCAob3IgYG51bGxgIGlmIG5vbmUpLlxuICogICAgIG5vdGVzOlxuICogICAgICAgLSBUaGlzIGlzIHRoZSBjYWNoZWQgcmVzdWx0IG9mIGNhbGxpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5jcmVhdGVTaGFkb3dET007IHdoZW5cbiAqICAgICAgICAgdGhlIGNvbXBvbmVudCBpcyBmaXJzdCBpbml0aWFsaXplZC5cbiAqICAgLSBuYW1lOiB0ZW1wbGF0ZVxuICogICAgIGRhdGFUeXBlOiBcIlt0ZW1wbGF0ZSBlbGVtZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvdGVtcGxhdGUpXCJcbiAqICAgICBjYXB0aW9uOiB0ZW1wbGF0ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBbdGVtcGxhdGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC90ZW1wbGF0ZSkgZWxlbWVudCBmb3IgdGhpc1xuICogICAgICAgY29tcG9uZW50LCBvciBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gdGVtcGxhdGUgZm91bmQgZm9yIHRoZSBjb21wb25lbnQuXG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIFRoaXMgaXMgdGhlIGNhY2hlZCByZXN1bHQgb2YgY2FsbGluZyBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmdldENvbXBvbmVudFRlbXBsYXRlOyB3aGVuXG4gKiAgICAgICAgIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgaW5pdGlhbGl6ZWQuXG4qKiovXG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbVXRpbHMuTVlUSElYX1RZUEVdID09PSBNWVRISVhfVUlfQ09NUE9ORU5UX1RZUEUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBzdGF0aWMgY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQgPSBjb21waWxlU3R5bGVGb3JEb2N1bWVudDtcbiAgc3RhdGljIHJlZ2lzdGVyID0gZnVuY3Rpb24oX25hbWUsIF9LbGFzcykge1xuICAgIGxldCBuYW1lID0gX25hbWUgfHwgdGhpcy50YWdOYW1lO1xuXG4gICAgaWYgKCFjdXN0b21FbGVtZW50cy5nZXQobmFtZSkpIHtcbiAgICAgIGxldCBLbGFzcyA9IF9LbGFzcyB8fCB0aGlzO1xuICAgICAgS2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gS2xhc3MuY29tcGlsZUF0dHJpYnV0ZU1ldGhvZHMoS2xhc3MpO1xuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKG5hbWUsIEtsYXNzKTtcblxuICAgICAgbGV0IHJlZ2lzdGVyRXZlbnQgPSBuZXcgRXZlbnQoJ215dGhpeC1jb21wb25lbnQtcmVnaXN0ZXJlZCcpO1xuICAgICAgcmVnaXN0ZXJFdmVudC5jb21wb25lbnROYW1lID0gbmFtZTtcbiAgICAgIHJlZ2lzdGVyRXZlbnQuY29tcG9uZW50ID0gS2xhc3M7XG5cbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHJlZ2lzdGVyRXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHN0YXRpYyBjb21waWxlQXR0cmlidXRlTWV0aG9kcyA9IGZ1bmN0aW9uKEtsYXNzKSB7XG4gICAgbGV0IHByb3RvID0gS2xhc3MucHJvdG90eXBlO1xuICAgIGxldCBuYW1lcyA9IFV0aWxzLmdldEFsbFByb3BlcnR5TmFtZXMocHJvdG8pXG4gICAgICAuZmlsdGVyKChuYW1lKSA9PiBJU19BVFRSX01FVEhPRF9OQU1FLnRlc3QobmFtZSkpXG4gICAgICAubWFwKChvcmlnaW5hbE5hbWUpID0+IHtcbiAgICAgICAgbGV0IG5hbWUgPSBvcmlnaW5hbE5hbWUubWF0Y2goSVNfQVRUUl9NRVRIT0RfTkFNRSlbMV07XG4gICAgICAgIGlmIChSRUdJU1RFUkVEX0NPTVBPTkVOVFMuaGFzKEtsYXNzKSlcbiAgICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldERlc2NyaXB0b3JGcm9tUHJvdG90eXBlQ2hhaW4ocHJvdG8sIG9yaWdpbmFsTmFtZSk7XG5cbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIFwidmFsdWVcIiB0aGVuIHRoZVxuICAgICAgICAvLyB1c2VyIGRpZCBpdCB3cm9uZy4uLiBzbyBqdXN0XG4gICAgICAgIC8vIG1ha2UgdGhpcyB0aGUgXCJzZXR0ZXJcIlxuICAgICAgICBsZXQgbWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgaWYgKG1ldGhvZClcbiAgICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgICAgICBsZXQgb3JpZ2luYWxHZXQgPSBkZXNjcmlwdG9yLmdldDtcbiAgICAgICAgaWYgKG9yaWdpbmFsR2V0KSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJvdG8sIHtcbiAgICAgICAgICAgIFtuYW1lXToge1xuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGdldDogICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZSAgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCAgICAgICA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICAgICAgICAgICAgY29udGV4dC52YWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxHZXQuY2FsbChjb250ZXh0LCBjdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzZXQ6ICAgICAgICAgIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBVdGlscy50b1NuYWtlQ2FzZShuYW1lKTtcbiAgICAgIH0pO1xuXG4gICAgUkVHSVNURVJFRF9DT01QT05FTlRTLmFkZChLbGFzcyk7XG5cbiAgICByZXR1cm4gbmFtZXM7XG4gIH07XG5cbiAgc2V0IGF0dHIkZGF0YU15dGhpeFNyYyhbIG5ld1ZhbHVlLCBvbGRWYWx1ZSBdKSB7XG4gICAgdGhpcy5hd2FpdEZldGNoU3JjT25WaXNpYmxlKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQgdG8gdGhlIERPTS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkFkZGVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkYXRhVHlwZXM6IE11dGF0aW9uUmVjb3JkXG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBNdXRhdGlvblJlY29yZCBpbnN0YW5jZSB0aGF0IHRoYXQgY2F1c2VkIHRoaXMgbWV0aG9kIHRvIGJlIGNhbGxlZC5cbiAgICovXG4gIG9uTXV0YXRpb25SZW1vdmVkKCkge31cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIENhbGxlZCB3aGVuIGFuIGVsZW1lbnQgaXMgYWRkZWQgYXMgYSBjaGlsZC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbm9kZVxuICAgKiAgICAgZGF0YVR5cGVzOiBFbGVtZW50XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBjaGlsZCBlbGVtZW50IGJlaW5nIGFkZGVkLlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkNoaWxkQWRkZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgQ2FsbGVkIHdoZW4gYSBjaGlsZCBlbGVtZW50IGlzIHJlbW92ZWQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5vZGVcbiAgICogICAgIGRhdGFUeXBlczogRWxlbWVudFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgY2hpbGQgZWxlbWVudCBiZWluZyByZW1vdmVkLlxuICAgKiAgIC0gbmFtZTogbXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRhdGFUeXBlczogTXV0YXRpb25SZWNvcmRcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIE11dGF0aW9uUmVjb3JkIGluc3RhbmNlIHRoYXQgdGhhdCBjYXVzZWQgdGhpcyBtZXRob2QgdG8gYmUgY2FsbGVkLlxuICAgKi9cbiAgb25NdXRhdGlvbkNoaWxkUmVtb3ZlZCgpIHt9XG5cbiAgc3RhdGljIGlzTXl0aGl4Q29tcG9uZW50ID0gaXNNeXRoaXhDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtVdGlscy5NWVRISVhfVFlQRV06IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgTVlUSElYX1VJX0NPTVBPTkVOVF9UWVBFLFxuICAgICAgfSxcbiAgICAgIFtpc015dGhpeENvbXBvbmVudF06IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5pc015dGhpeENvbXBvbmVudFxuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGlzTXl0aGl4Q29tcG9uZW50LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFV0aWxzLmJpbmRNZXRob2RzLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgLyosIFsgSFRNTEVsZW1lbnQucHJvdG90eXBlIF0qLyk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAnc2Vuc2l0aXZlVGFnTmFtZSc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5zZW5zaXRpdmVUYWdOYW1lXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiAoKHRoaXMucHJlZml4KSA/IGAke3RoaXMucHJlZml4fToke3RoaXMubG9jYWxOYW1lfWAgOiB0aGlzLmxvY2FsTmFtZSksXG4gICAgICB9LFxuICAgICAgJ3RlbXBsYXRlSUQnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQudGVtcGxhdGVJRFxuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5URU1QTEFURV9JRCxcbiAgICAgIH0sXG4gICAgICAnZGVsYXlUaW1lcnMnOiB7IC8vIEByZWY6TXl0aGl4VUlDb21wb25lbnQuZGVsYXlUaW1lcnNcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG5ldyBNYXAoKSxcbiAgICAgIH0sXG4gICAgICAnZG9jdW1lbnRJbml0aWFsaXplZCc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5kb2N1bWVudEluaXRpYWxpemVkXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBVdGlscy5tZXRhZGF0YSh0aGlzLmNvbnN0cnVjdG9yLCBNWVRISVhfRE9DVU1FTlRfSU5JVElBTElaRUQpLFxuICAgICAgICBzZXQ6ICAgICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIFV0aWxzLm1ldGFkYXRhKHRoaXMuY29uc3RydWN0b3IsIE1ZVEhJWF9ET0NVTUVOVF9JTklUSUFMSVpFRCwgISF2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgJ3NoYWRvdyc6IHsgLy8gQHJlZjpNeXRoaXhVSUNvbXBvbmVudC5zaGFkb3dcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dET00oKSxcbiAgICAgIH0sXG4gICAgICAndGVtcGxhdGUnOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50VGVtcGxhdGUoKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIGF0dHJpYnV0ZXMuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkXG4gICAqICAgdG8gdGhpcyBtZXRob2QsIHRoZW4gaXQgd2lsbCBhY3QgYXMgYSBnZXR0ZXIsIGdldHRpbmcgdGhlIGF0dHJpYnV0ZSBzcGVjaWZpZWQgYnkgbmFtZS5cbiAgICpcbiAgICogICBJZiBob3dldmVyIHR3byBvciBtb3JlIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQsIHRoZW4gdGhpcyBpcyBhbiBhdHRyaWJ1dGUgc2V0dGVyLlxuICAgKlxuICAgKiAgIElmIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBgdW5kZWZpbmVkYCwgYG51bGxgLCBvciBgZmFsc2VgLCB0aGVuIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZVxuICAgKiAgIHJlbW92ZWQuXG4gICAqXG4gICAqICAgSWYgdGhlIHByb3ZpZGVkIHZhbHVlIGlzIGB0cnVlYCwgdGhlbiB0aGUgYXR0cmlidXRlJ3MgdmFsdWUgd2lsbCBiZSBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqICAgQW55IG90aGVyIHZhbHVlIGlzIGNvbnZlcnRlZCB0byBhIHN0cmluZyBhbmQgc2V0IGFzIHRoZSBhdHRyaWJ1dGUncyB2YWx1ZS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogbmFtZVxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBvcGVyYXRlIG9uLlxuICAgKiAgIC0gbmFtZTogdmFsdWVcbiAgICogICAgIGRhdGFUeXBlczogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIElmIGB1bmRlZmluZWRgLCBgbnVsbGAsIG9yIGBmYWxzZWAsIHJlbW92ZSB0aGUgbmFtZWQgYXR0cmlidXRlLlxuICAgKiAgICAgICBJZiBgdHJ1ZWAsIHNldCB0aGUgbmFtZWQgYXR0cmlidXRlJ3MgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqICAgICAgIEZvciBhbnkgb3RoZXIgdmFsdWUsIGZpcnN0IGNvbnZlcnQgaXQgaW50byBhIHN0cmluZywgYW5kIHRoZW4gc2V0IHRoZSBuYW1lZCBhdHRyaWJ1dGUncyB2YWx1ZSB0byB0aGUgcmVzdWx0aW5nIHN0cmluZy5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgMS4gQHR5cGVzIHN0cmluZzsgSWYgYSBzaW5nbGUgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZW4gcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIG5hbWVkIGF0dHJpYnV0ZS5cbiAgICogICAyLiBAdHlwZXMgdGhpczsgSWYgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhlbiBzZXQgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZSxcbiAgICogICAgICBhbmQgcmV0dXJuIGB0aGlzYCAodG8gYWxsb3cgZm9yIGNoYWluaW5nKS5cbiAgICovXG4gIGF0dHIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSlcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsICh2YWx1ZSA9PT0gdHJ1ZSkgPyAnJyA6ICgnJyArIHZhbHVlKSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgSW5qZWN0IGEgbmV3IHN0eWxlIHNoZWV0IHZpYSBhIGA8c3R5bGU+YCBlbGVtZW50IGR5bmFtaWNhbGx5IGF0IHJ1bi10aW1lLlxuICAgKlxuICAgKiAgIFRoaXMgbWV0aG9kIGFsbG93cyB0aGUgY2FsbGVyIHRvIGluamVjdCBkeW5hbWljIHN0eWxlcyBhdCBydW4tdGltZS5cbiAgICogICBJdCB3aWxsIG9ubHkgaW5qZWN0IHRoZSBzdHlsZXMgb25jZSwgbm8gbWF0dGVyIGhvdyBtYW55IHRpbWVzIHRoZVxuICAgKiAgIG1ldGhvZCBpcyBjYWxsZWQtLWFzIGxvbmcgYXMgdGhlIHN0eWxlIGNvbnRlbnQgaXRzZWxmIGRvZXNuJ3QgY2hhbmdlLlxuICAgKlxuICAgKiAgIFRoZSBjb250ZW50IGlzIGhhc2hlZCB2aWEgU0hBMjU2LCBhbmQgdGhlIGhhc2ggaXMgdXNlZCBhcyB0aGUgc3R5bGUgc2hlZXQgaWQuIFRoaXNcbiAgICogICBhbGxvd3MgeW91IHRvIGNhbGwgdGhlIG1ldGhvZCBpbnNpZGUgYSBjb21wb25lbnQncyBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1vdW50ZWQ7XG4gICAqICAgbWV0aG9kLCB3aXRob3V0IG5lZWRpbmcgdG8gd29ycnkgYWJvdXQgZHVwbGljYXRpbmcgdGhlIHN0eWxlcyBvdmVyIGFuZCBvdmVyIGFnYWluLlxuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjb250ZW50XG4gICAqICAgICBkYXRhVHlwZXM6IHN0cmluZ1xuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgQ1NTIHN0eWxlc2hlZXQgY29udGVudCB0byBpbmplY3QgaW50byBhIGA8c3R5bGU+YCBlbGVtZW50LiBUaGlzIGNvbnRlbnQgaXNcbiAgICogICAgICAgdXNlZCB0byBnZW5lcmF0ZSBhbiBgaWRgIGZvciB0aGUgYDxzdHlsZT5gIGVsZW1lbnQsIHNvIHRoYXQgaXQgb25seSBnZXRzIGFkZGVkXG4gICAqICAgICAgIHRvIHRoZSBgZG9jdW1lbnRgIG9uY2UuXG4gICAqICAgLSBuYW1lOiBtZWRpYVxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIGRlZmF1bHQ6IFwiJ3NjcmVlbidcIlxuICAgKiAgICAgb3B0aW9uYWw6IHRydWVcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgV2hhdCB0byBzZXQgdGhlIGBtZWRpYWAgYXR0cmlidXRlIG9mIHRoZSBjcmVhdGVkIGA8c3R5bGU+YCBlbGVtZW50IHRvLiBEZWZhdWx0c1xuICAgKiAgICAgICB0byBgJ3NjcmVlbidgLlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBJdCBpcyBvZnRlbiBiZXR0ZXIgdG8gc2ltcGx5IGFkZCBhIGA8c3R5bGU+YCBlbGVtZW50IHRvIHlvdXIgY29tcG9uZW50J3MgSFRNTCB0ZW1wbGF0ZS5cbiAgICogICAgIEhvd2V2ZXIsIHNvbWV0aW1lcyB0cnVseSBkeW5hbWljIHN0eWxlcyBhcmUgbmVlZGVkLCB3aGVyZSB0aGUgY29udGVudCB3b24ndCBiZSBrbm93blxuICAgKiAgICAgdW50aWwgcnVudGltZS4gVGhpcyBpcyB0aGUgcHJvcGVyIHVzZSBjYXNlIGZvciB0aGlzIG1ldGhvZC5cbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBQbGVhc2UgZWR1Y2F0ZWQgeW91cnNlbGYgKHVubGlrZSBwZW9wbGUgd2hvIGxvdmUgUmVhY3QpIGFuZCBkbyBub3Qgb3ZlcnVzZSBkeW5hbWljIG9yIGlubGluZSBzdHlsZXMuXG4gICAqICAgICBXaGlsZSB0aGUgcmVzdWx0IG9mIHRoaXMgbWV0aG9kIGlzIGNlcnRhaW5seSBhIHN0ZXAgYWJvdmUgaW5saW5lIHN0eWxlcywgdGhpcyBtZXRob2QgaGFzXG4gICAqICAgICBbZ3JlYXQgcG90ZW50aWFsIHRvIGNhdXNlIGhhcm1dKGh0dHBzOi8vd29ybGRvZmRldi5pbmZvLzYtcmVhc29ucy13aHkteW91LXNob3VsZG50LXN0eWxlLWlubGluZS8pXG4gICAqICAgICBhbmQgc3ByZWFkIHlvdXIgb3duIGlnbm9yYW5jZSB0byBvdGhlcnMuIFVzZSB3aXRoICoqQ0FSRSoqIVxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgRWxlbWVudDsgVGhlIGA8c3R5bGU+YCBlbGVtZW50IGZvciB0aGUgc3BlY2lmaWVkIHN0eWxlLlxuICAgKiBleGFtcGxlczpcbiAgICogICAtIHxcbiAgICogICAgIGBgYGphdmFzY3JpcHRcbiAgICogICAgIGltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAgICpcbiAgICogICAgIGNsYXNzIE15Q29tcG9uZW50IGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICAgKiAgICAgICBzdGF0aWMgdGFnTmFtZSA9ICdteS1jb21wb25lbnQnO1xuICAgKlxuICAgKiAgICAgICAvLyAuLi5cbiAgICpcbiAgICogICAgICAgbW91bnRlZCgpIHtcbiAgICogICAgICAgICBsZXQgeyBzaWRlYmFyV2lkdGggfSA9IHRoaXMubG9hZFVzZXJQcmVmZXJlbmNlcygpO1xuICAgKiAgICAgICAgIHRoaXMuaW5qZWN0U3R5bGVTaGVldChgbmF2LnNpZGViYXIgeyB3aWR0aDogJHtzaWRlYmFyV2lkdGh9cHg7IH1gLCAnc2NyZWVuJyk7XG4gICAqICAgICAgIH1cbiAgICogICAgIH1cbiAgICpcbiAgICogICAgIE15Q29tcG9uZW50LnJlZ2lzdGVyKCk7XG4gICAqICAgICBgYGBcbiAgICovXG4gIGluamVjdFN0eWxlU2hlZXQoY29udGVudCwgbWVkaWEgPSAnc2NyZWVuJykge1xuICAgIGxldCBzdHlsZUlEICAgICAgID0gYElEU1RZTEUke1V0aWxzLlNIQTI1NihgJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9OiR7Y29udGVudH06JHttZWRpYX1gKX1gO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCBzdHlsZUVsZW1lbnQgID0gb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCk7XG5cbiAgICBpZiAoc3R5bGVFbGVtZW50KVxuICAgICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcblxuICAgIHN0eWxlRWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1mb3InLCB0aGlzLnNlbnNpdGl2ZVRhZ05hbWUpO1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVJRCk7XG4gICAgaWYgKG1lZGlhKVxuICAgICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG5cbiAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblxuICAgIHJldHVybiBzdHlsZUVsZW1lbnQ7XG4gIH1cblxuICBwcm9jZXNzRWxlbWVudHMobm9kZSwgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuICAgIGlmICghb3B0aW9ucy5zY29wZSlcbiAgICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIHNjb3BlOiB0aGlzLiQkIH07XG5cbiAgICByZXR1cm4gRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzKG5vZGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW5Bc0ZyYWdtZW50KG5vRW1wdHlSZXN1bHQpIHtcbiAgICBsZXQgaGFzQ29udGVudCAgICA9IGZhbHNlO1xuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgIGxldCB0ZW1wbGF0ZSAgICAgID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICBpZiAoIXRoaXMuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgICByZXR1cm4gKG5vRW1wdHlSZXN1bHQpID8gdW5kZWZpbmVkIDogdGVtcGxhdGU7XG5cbiAgICB3aGlsZSAodGhpcy5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgbGV0IG5vZGUgPSB0aGlzLmNoaWxkTm9kZXNbMF07XG4gICAgICBpZiAoIShub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiBVdGlscy5pc05PRShub2RlLm5vZGVWYWx1ZSkpKVxuICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKG5vRW1wdHlSZXN1bHQgJiYgIWhhc0NvbnRlbnQpXG4gICAgICByZXR1cm47XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEdldCB0aGUgcGFyZW50IE5vZGUgb2YgdGhpcyBlbGVtZW50LlxuICAgKlxuICAgKiBub3RlczpcbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiBVbmxpa2UgW05vZGUucGFyZW50Tm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSksIHRoaXNcbiAgICogICAgIHdpbGwgYWxzbyBzZWFyY2ggYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcy5cbiAgICogICAtIHxcbiAgICogICAgIDp3YXJuaW5nOiAqKlNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIG9ubHkgd29ya3MgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzISoqXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogU2VhcmNoaW5nIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMgaXMgYWNjb21wbGlzaGVkIHZpYSBsZXZlcmFnaW5nIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE7IGZvclxuICAgKiAgICAgYHRoaXNgIGNvbXBvbmVudC4gV2hlbiBhIGBudWxsYCBwYXJlbnQgaXMgZW5jb3VudGVyZWQsIGBnZXRQYXJlbnROb2RlYCB3aWxsIGxvb2sgZm9yIEBzZWUgTXl0aGl4VUlDb21wb25lbnQubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IEBzZWUgVXRpbHMuTVlUSElYX1NIQURPV19QQVJFTlQ7XG4gICAqICAgICBvbiBgdGhpc2AuIElmIGZvdW5kLCB0aGUgcmVzdWx0IGlzIGNvbnNpZGVyZWQgdGhlIFtwYXJlbnQgTm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSkgb2YgYHRoaXNgIGNvbXBvbmVudC5cbiAgICogICAtIHxcbiAgICogICAgIDpleWU6IFRoaXMgaXMganVzdCBhIHdyYXBwZXIgZm9yIEBzZWUgVXRpbHMuZ2V0UGFyZW50Tm9kZTsuXG4gICAqXG4gICAqIHJldHVybjogfFxuICAgKiAgIEB0eXBlcyBOb2RlOyBUaGUgcGFyZW50IG5vZGUsIGlmIHRoZXJlIGlzIGFueSwgb3IgYG51bGxgIG90aGVyd2lzZS5cbiAgICovXG4gIGdldFBhcmVudE5vZGUoKSB7XG4gICAgcmV0dXJuIFV0aWxzLmdldFBhcmVudE5vZGUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpXG4gICAqICAgd2l0aCBvbmUgbm90YWJsZSBkaWZmZXJlbmNlOiBJdCBydW5zIE15dGhpeCBVSSBmcmFtZXdvcmsgc3BlY2lmaWMgY29kZSBhZnRlciBhIHNoYWRvdyBpcyBhdHRhY2hlZC5cbiAgICpcbiAgICogICBDdXJyZW50bHksIHRoZSBtZXRob2QgY29tcGxldGVzIHRoZSBmb2xsb3dpbmcgYWN0aW9uczpcbiAgICogICAxLiBDYWxsIGBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucylgIHRvIGFjdHVhbGx5IGF0dGFjaCBhIFNoYWRvdyBET01cbiAgICogICAyLiBBc3NpZ24gQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyB0byB0aGUgcmVzdWx0aW5nIGBzaGFkb3dgLCB1c2luZyB0aGUga2V5IGBVdGlscy5NWVRISVhfU0hBRE9XX1BBUkVOVGAsIGFuZCB2YWx1ZSBvZiBgdGhpc2AuIEBzb3VyY2VSZWYgX3NoYWRvd01ldGFkYXRhQXNzaWdubWVudDsgVGhpcyBhbGxvd3MgQHNlZSBnZXRQYXJlbnROb2RlOyB0byBsYXRlciBmaW5kIHRoZSBwYXJlbnQgb2YgdGhlIHNoYWRvdy5cbiAgICogICAzLiBgcmV0dXJuIHNoYWRvd2BcbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogb3B0aW9uc1xuICAgKiAgICAgZGF0YVR5cGVzOiBvYmplY3RcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgW29wdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdyNvcHRpb25zKSBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gVGhpcyBpcyBqdXN0IGEgd3JhcHBlciBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpIHRoYXQgZXhlY3V0ZXNcbiAgICogICAgIGN1c3RvbSBmcmFtZXdvcmsgZnVuY3Rpb25hbGl0eSBhZnRlciB0aGUgYHN1cGVyYCBjYWxsLlxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgU2hhZG93Um9vdDsgVGhlIFNoYWRvd1Jvb3QgaW5zdGFuY2UgY3JlYXRlZCBieSBbRWxlbWVudC5hdHRhY2hTaGFkb3ddKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdykuXG4gICAqL1xuICBhdHRhY2hTaGFkb3cob3B0aW9ucykge1xuICAgIC8vIENoZWNrIGVudmlyb25tZW50IHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIHN1cGVyLmF0dGFjaFNoYWRvdyAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBzaGFkb3cgPSBzdXBlci5hdHRhY2hTaGFkb3cob3B0aW9ucyk7XG4gICAgVXRpbHMubWV0YWRhdGEoc2hhZG93LCBVdGlscy5NWVRISVhfU0hBRE9XX1BBUkVOVCwgdGhpcyk7IC8vIEByZWY6X3NoYWRvd01ldGFkYXRhQXNzaWdubWVudFxuXG4gICAgcmV0dXJuIHNoYWRvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJlbnQ6IE15dGhpeFVJQ29tcG9uZW50XG4gICAqIGdyb3VwTmFtZTogQ29tcG9uZW50c1xuICAgKiBkZXNjOiB8XG4gICAqICAgQSBzdHViIGZvciBkZXZlbG9wZXJzIHRvIGNvbnRyb2wgdGhlIFNoYWRvdyBET00gb2YgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogICBCeSBkZWZhdWx0LCB0aGlzIG1ldGhvZCB3aWxsIHNpbXBseSBjYWxsIEBzZWUgTXl0aGl4VUlDb21wb25lbnQuYXR0YWNoU2hhZG93OyBpbiBgXCJvcGVuXCJgIGBtb2RlYC5cbiAgICpcbiAgICogICBEZXZlbG9wZXJzIGNhbiBvdmVybG9hZCB0aGlzIHRvIGRvIG5vdGhpbmcgKGhhdmUgbm8gU2hhZG93IERPTSBmb3IgYSBzcGVjaWZpYyBjb21wb25lbnQgZm9yIGV4YW1wbGUpLFxuICAgKiAgIG9yIHRvIGRvIHNvbWV0aGluZyBlbHNlLCBzdWNoIGFzIHNwZWNpZnkgdGhleSB3b3VsZCBsaWtlIHRoZWlyIGNvbXBvbmVudCB0byBiZSBpbiBgXCJjbG9zZWRcImAgYG1vZGVgLlxuICAgKlxuICAgKiAgIFRoZSByZXN1bHQgb2YgdGhpcyBtZXRob2QgaXMgYXNzaWduZWQgdG8gYHRoaXMuc2hhZG93YCBpbnNpZGUgdGhlIGBjb25zdHJ1Y3RvcmAgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogb3B0aW9uc1xuICAgKiAgICAgZGF0YVR5cGVzOiBvYmplY3RcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgW29wdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dGFjaFNoYWRvdyNvcHRpb25zKSBmb3IgW0VsZW1lbnQuYXR0YWNoU2hhZG93XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cpXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gQWxsIHRoaXMgZG9lcyBpcyBjYWxsIGB0aGlzLmF0dGFjaFNoYWRvd2AuIEl0cyBwdXJwb3NlIGlzIGZvciB0aGUgZGV2ZWxvcGVyIHRvIGNvbnRyb2xcbiAgICogICAgIHdoYXQgaGFwcGVucyB3aXRoIHRoZSBjb21wb25lbnQncyBTaGFkb3cgRE9NLlxuICAgKiByZXR1cm46IHxcbiAgICogICBAdHlwZXMgU2hhZG93Um9vdDsgVGhlIFNoYWRvd1Jvb3QgaW5zdGFuY2UgY3JlYXRlZCBieSBAc2VlIE15dGhpeFVJQ29tcG9uZW50LmF0dGFjaFNoYWRvdzsuXG4gICAqL1xuICBjcmVhdGVTaGFkb3dET00ob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJywgLi4uKG9wdGlvbnMgfHwge30pIH0pO1xuICB9XG5cbiAgbWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycykge1xuICAgIHJldHVybiBFbGVtZW50cy5tZXJnZUNoaWxkcmVuKHRhcmdldCwgLi4ub3RoZXJzKTtcbiAgfVxuXG4gIGdldENvbXBvbmVudFRlbXBsYXRlKG5hbWVPcklEKSB7XG4gICAgaWYgKG5hbWVPcklEIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgIHJldHVybiBuYW1lT3JJRDtcblxuICAgIGlmICghdGhpcy5vd25lckRvY3VtZW50KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKG5hbWVPcklEKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWVPcklEKTtcbiAgICAgIGlmICghcmVzdWx0KVxuICAgICAgICByZXN1bHQgPSB0aGlzLm93bmVyRG9jdW1lbnQucXVlcnlTZWxlY3RvcihgdGVtcGxhdGVbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke25hbWVPcklEfVwiIGldLHRlbXBsYXRlW2RhdGEtZm9yPVwiJHtuYW1lT3JJRH1cIiBpXWApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlbXBsYXRlSUQpXG4gICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRlbXBsYXRlW2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lPVwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCIgaV0sdGVtcGxhdGVbZGF0YS1mb3I9XCIke3RoaXMuc2Vuc2l0aXZlVGFnTmFtZX1cIiBpXWApO1xuICB9XG5cbiAgYXBwZW5kRXh0ZXJuYWxUb1NoYWRvd0RPTSgpIHtcbiAgICBpZiAoIXRoaXMuc2hhZG93KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcbiAgICBsZXQgZWxlbWVudHMgICAgICA9IG93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mb3JdJyk7XG5cbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIEFycmF5LmZyb20oZWxlbWVudHMpKSB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgIGlmIChVdGlscy5pc05PRShzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2hlcyhzZWxlY3RvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICB0aGlzLnNoYWRvdy5hcHBlbmRDaGlsZChlbGVtZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvY2Vzc2VkVGVtcGxhdGUoX3RlbXBsYXRlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5nZXRDb21wb25lbnRUZW1wbGF0ZShfdGVtcGxhdGUpIHx8IHRoaXMudGVtcGxhdGU7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybjtcblxuICAgIHJldHVybiB0aGlzLnByb2Nlc3NFbGVtZW50cygodGVtcGxhdGUuY29udGVudCkgPyB0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSk7XG4gIH1cblxuICBnZXRSYXdUZW1wbGF0ZShfdGVtcGxhdGUpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKF90ZW1wbGF0ZSkgfHwgdGhpcy50ZW1wbGF0ZTtcbiAgICBpZiAoIXRlbXBsYXRlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgYXBwZW5kVGVtcGxhdGVUbyh0YXJnZXQsIF90ZW1wbGF0ZSkge1xuICAgIGlmICghdGFyZ2V0KVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IHByb2Nlc3NlZFRlbXBsYXRlID0gdGhpcy5nZXRQcm9jZXNzZWRUZW1wbGF0ZShfdGVtcGxhdGUpO1xuICAgIGlmIChwcm9jZXNzZWRUZW1wbGF0ZSkge1xuICAgICAgLy8gZW5zdXJlRG9jdW1lbnRTdHlsZXMuY2FsbCh0aGlzLCB0aGlzLm93bmVyRG9jdW1lbnQsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSwgdGVtcGxhdGUpO1xuXG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocHJvY2Vzc2VkVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oX3RlbXBsYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kVGVtcGxhdGVUbyh0aGlzLnNoYWRvdywgX3RlbXBsYXRlKTtcbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKCdkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZScsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG5cbiAgICB0aGlzLmFwcGVuZEV4dGVybmFsVG9TaGFkb3dET00oKTtcbiAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00oKTtcbiAgICB0aGlzLnByb2Nlc3NFbGVtZW50cyh0aGlzKTtcblxuICAgIHRoaXMubW91bnRlZCgpO1xuXG4gICAgdGhpcy5kb2N1bWVudEluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIFV0aWxzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSk7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnVubW91bnRlZCgpO1xuICB9XG5cbiAgYXdhaXRGZXRjaFNyY09uVmlzaWJsZShuZXdTcmMpIHtcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyLnVub2JzZXJ2ZSh0aGlzKTtcbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIW5ld1NyYylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBvYnNlcnZlciA9IHZpc2liaWxpdHlPYnNlcnZlcigoeyB3YXNWaXNpYmxlLCBkaXNjb25uZWN0IH0pID0+IHtcbiAgICAgIGlmICghd2FzVmlzaWJsZSlcbiAgICAgICAgdGhpcy5mZXRjaFNyYyh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJykpO1xuXG4gICAgICBkaXNjb25uZWN0KCk7XG5cbiAgICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbnVsbDtcbiAgICB9LCB7IGVsZW1lbnRzOiBbIHRoaXMgXSB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd2aXNpYmlsaXR5T2JzZXJ2ZXInOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIG9ic2VydmVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayguLi5hcmdzKSB7XG4gICAgbGV0IFtcbiAgICAgIG5hbWUsXG4gICAgICBvbGRWYWx1ZSxcbiAgICAgIG5ld1ZhbHVlLFxuICAgIF0gPSBhcmdzO1xuXG4gICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgbGV0IG1hZ2ljTmFtZSAgID0gYGF0dHIkJHtVdGlscy50b0NhbWVsQ2FzZShuYW1lKX1gO1xuICAgICAgbGV0IGRlc2NyaXB0b3IgID0gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbih0aGlzLCBtYWdpY05hbWUpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIENhbGwgc2V0dGVyXG4gICAgICAgIHRoaXNbbWFnaWNOYW1lXSA9IFsgYXJnc1syXSwgYXJnc1sxXSBdLmNvbmNhdChhcmdzLnNsaWNlKDMpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoLi4uYXJncyk7XG4gIH1cblxuICBhZG9wdGVkQ2FsbGJhY2soLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFkb3B0ZWQoLi4uYXJncyk7XG4gIH1cblxuICBtb3VudGVkKCkge31cbiAgdW5tb3VudGVkKCkge31cbiAgYXR0cmlidXRlQ2hhbmdlZCgpIHt9XG4gIGFkb3B0ZWQoKSB7fVxuXG4gIGdldCAkJCgpIHtcbiAgICByZXR1cm4gVXRpbHMuY3JlYXRlU2NvcGUodGhpcyk7XG4gIH1cblxuICBzZWxlY3QoLi4uYXJncykge1xuICAgIGxldCBhcmdJbmRleCAgICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICAgID0gKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleCsrXSkgOiB7fTtcbiAgICBsZXQgcXVlcnlFbmdpbmUgPSBRdWVyeUVuZ2luZS5mcm9tLmNhbGwodGhpcywgeyByb290OiB0aGlzLCAuLi5vcHRpb25zLCBpbnZva2VDYWxsYmFja3M6IGZhbHNlIH0sIC4uLmFyZ3Muc2xpY2UoYXJnSW5kZXgpKTtcbiAgICBsZXQgc2hhZG93Tm9kZXM7XG5cbiAgICBvcHRpb25zID0gcXVlcnlFbmdpbmUuZ2V0T3B0aW9ucygpO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hhZG93ICE9PSBmYWxzZSAmJiBvcHRpb25zLnNlbGVjdG9yICYmIG9wdGlvbnMucm9vdCA9PT0gdGhpcykge1xuICAgICAgc2hhZG93Tm9kZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBRdWVyeUVuZ2luZS5mcm9tLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICB7IHJvb3Q6IHRoaXMuc2hhZG93IH0sXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3RvcixcbiAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrLFxuICAgICAgICApLnZhbHVlcygpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc2hhZG93Tm9kZXMpXG4gICAgICBxdWVyeUVuZ2luZSA9IHF1ZXJ5RW5naW5lLmFkZChzaGFkb3dOb2Rlcyk7XG5cbiAgICBpZiAob3B0aW9ucy5zbG90dGVkICE9PSB0cnVlKVxuICAgICAgcXVlcnlFbmdpbmUgPSBxdWVyeUVuZ2luZS5zbG90dGVkKGZhbHNlKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChxdWVyeUVuZ2luZS5tYXAob3B0aW9ucy5jYWxsYmFjaykpO1xuXG4gICAgcmV0dXJuIHF1ZXJ5RW5naW5lO1xuICB9XG5cbiAgYnVpbGQoY2FsbGJhY2spIHtcbiAgICBsZXQgcmVzdWx0ID0gWyBjYWxsYmFjayhFbGVtZW50cy5FbGVtZW50R2VuZXJhdG9yLCB7fSkgXS5mbGF0KEluZmluaXR5KS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW1bRWxlbWVudHMuVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgcmV0dXJuIGl0ZW0oKTtcblxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIChyZXN1bHQubGVuZ3RoIDwgMikgPyByZXN1bHRbMF0gOiBuZXcgRWxlbWVudHMuRWxlbWVudERlZmluaXRpb24oJyNmcmFnbWVudCcsIHt9LCByZXN1bHQpO1xuICB9XG5cbiAgJGJ1aWxkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFF1ZXJ5RW5naW5lLmZyb20uY2FsbCh0aGlzLCBbIHRoaXMuYnVpbGQoY2FsbGJhY2spIF0uZmxhdChJbmZpbml0eSkpO1xuICB9XG5cbiAgaXNBdHRyaWJ1dGVUcnV0aHkobmFtZSkge1xuICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUobmFtZSkpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBpZiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAndHJ1ZScpXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldElkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IFV0aWxzLnRvQ2FtZWxDYXNlKHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4gIH1cblxuICBtZXRhZGF0YShrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIFV0aWxzLm1ldGFkYXRhKHRoaXMsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgZHluYW1pY1Byb3AobmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIsIF9jb250ZXh0KSB7XG4gICAgcmV0dXJuIFV0aWxzLmR5bmFtaWNQcm9wLmNhbGwoX2NvbnRleHQgfHwgdGhpcywgbmFtZSwgZGVmYXVsdFZhbHVlLCBzZXR0ZXIpO1xuICB9XG5cbiAgZHluYW1pY0RhdGEob2JqKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGxldCBkYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIFV0aWxzLmR5bmFtaWNQcm9wLmNhbGwoZGF0YSwga2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKipcbiAgICogcGFyZW50OiBNeXRoaXhVSUNvbXBvbmVudFxuICAgKiBncm91cE5hbWU6IENvbXBvbmVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEEgc2VsZi1yZXNldHRpbmcgdGltZW91dC4gVGhpcyBtZXRob2QgZXhwZWN0cyBhbiBgaWRgIGFyZ3VtZW50IChvciB3aWxsIGdlbmVyYXRlIG9uZSBmcm9tIHRoZSBwcm92aWRlZFxuICAgKiAgIGNhbGxiYWNrIG1ldGhvZCBpZiBub3QgcHJvdmlkZWQpLiBJdCB1c2VzIHRoaXMgcHJvdmlkZWQgYGlkYCB0byBjcmVhdGUgYSB0aW1lb3V0LiBUaGlzIHRpbWVvdXQgaGFzIGEgc3BlY2lhbCBmZWF0dXJlXG4gICAqICAgaG93ZXZlciB0aGF0IGRpZmZlcmVudGlhdGVzIGl0IGZyb20gYSBub3JtYWwgYHNldFRpbWVvdXRgIGNhbGw6IGlmIHlvdSBjYWxsIGB0aGlzLmRlYm91bmNlYCBhZ2FpbiB3aXRoIHRoZVxuICAgKiAgIHNhbWUgYGlkYCAqKmJlZm9yZSoqIHRoZSB0aW1lIHJ1bnMgb3V0LCB0aGVuIGl0IHdpbGwgYXV0b21hdGljYWxseSByZXNldCB0aGUgdGltZXIuIEluIHNob3J0LCBvbmx5IHRoZSBsYXN0IGNhbGxcbiAgICogICB0byBgdGhpcy5kZWJvdW5jZWAgKGdpdmVuIHRoZSBzYW1lIGlkKSB3aWxsIHRha2UgZWZmZWN0ICh1bmxlc3MgdGhlIHNwZWNpZmllZCB0aW1lb3V0IGlzIHJlYWNoZWQgYmV0d2VlbiBjYWxscykuXG4gICAqIHJldHVybjogfFxuICAgKiAgIFRoaXMgbWV0aG9kIHJldHVybnMgYSBzcGVjaWFsaXplZCBQcm9taXNlIGluc3RhbmNlLiBUaGUgaW5zdGFuY2UgaXMgc3BlY2lhbGl6ZWQgYmVjYXVzZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXNcbiAgICogICBhcmUgaW5qZWN0ZWQgaW50byBpdDpcbiAgICogICAxLiBgcmVzb2x2ZShyZXN1bHRWYWx1ZSlgIC0gV2hlbiBjYWxsZWQsIHJlc29sdmVzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gICAqICAgMi4gYHJlamVjdChlcnJvclZhbHVlKWAgLSBXaGVuIGNhbGxlZCwgcmVqZWN0cyB0aGUgcHJvbWlzZSB3aXRoIHRoZSBmaXJzdCBwcm92aWRlZCBhcmd1bWVudFxuICAgKiAgIDMuIGBzdGF0dXMoKWAgLSBXaGVuIGNhbGxlZCwgd2lsbCByZXR1cm4gdGhlIGZ1bGZpbGxtZW50IHN0YXR1cyBvZiB0aGUgcHJvbWlzZSwgYXMgYSBgc3RyaW5nYCwgb25lIG9mOiBgXCJwZW5kaW5nXCIsIFwiZnVsZmlsbGVkXCJgLCBvciBgXCJyZWplY3RlZFwiYFxuICAgKiAgIDQuIGBpZDxzdHJpbmc+YCAtIEEgcmFuZG9tbHkgZ2VuZXJhdGVkIElEIGZvciB0aGlzIHByb21pc2VcbiAgICpcbiAgICogICBTZWUgQHNlZSBVdGlscy5jcmVhdGVSZXNvbHZhYmxlO1xuICAgKiBhcmd1bWVudHM6XG4gICAqICAgLSBuYW1lOiBjYWxsYmFja1xuICAgKiAgICAgZGF0YVR5cGVzOiBmdW5jdGlvblxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiB0aGUgdGltZW91dCBoYXMgYmVlbiBtZXQuXG4gICAqICAgLSBuYW1lOiB0aW1lTVNcbiAgICogICAgIGRhdGFUeXBlczogbnVtYmVyXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGVmYXVsdDogMFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2AuXG4gICAqICAgLSBuYW1lOiBpZFxuICAgKiAgICAgZGF0YVR5cGVzOiBzdHJpbmdcbiAgICogICAgIG9wdGlvbmFsOiB0cnVlXG4gICAqICAgICBkZWZhdWx0OiBcIm51bGxcIlxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBUaGUgaWRlbnRpZmllciBmb3IgdGhpcyBkZWJvdW5jZSB0aW1lci4gSWYgbm90IHByb3ZpZGVkLCB0aGVuIG9uZVxuICAgKiAgICAgICB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgeW91IGJhc2VkIG9uIHRoZSBwcm92aWRlZCBjYWxsYmFjay5cbiAgICogbm90ZXM6XG4gICAqICAgLSBUaG91Z2ggbm90IHJlcXVpcmVkLCBpdCBpcyBmYXN0ZXIgYW5kIGxlc3MgcHJvYmxlbWF0aWMgdG8gcHJvdmlkZSB5b3VyIG93biBgaWRgIGFyZ3VtZW50XG4gICAqL1xuICBkZWJvdW5jZShjYWxsYmFjaywgdGltZU1TLCBfaWQpIHtcbiAgICB2YXIgaWQgPSBfaWQ7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBnZXQgYW4gaWQgZnJvbSB0aGUgdXNlciwgdGhlbiBndWVzcyB0aGUgaWQgYnkgdHVybmluZyB0aGUgZnVuY3Rpb25cbiAgICAvLyBpbnRvIGEgc3RyaW5nIChyYXcgc291cmNlKSBhbmQgdXNlIHRoYXQgZm9yIGFuIGlkIGluc3RlYWRcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgaWQgPSAoJycgKyBjYWxsYmFjayk7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc3BpbGVkIGNvZGUsIHRoZW4gYW4gYXN5bmMgZ2VuZXJhdG9yIHdpbGwgYmUgdXNlZCBmb3IgYXN5bmMgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIHdyYXBzIHRoZSByZWFsIGZ1bmN0aW9uLCBhbmQgc28gd2hlbiBjb252ZXJ0aW5nIHRoZSBmdW5jdGlvbiBpbnRvIGEgc3RyaW5nXG4gICAgICAvLyBpdCB3aWxsIE5PVCBiZSB1bmlxdWUgcGVyIGNhbGwtc2l0ZS4gRm9yIHRoaXMgcmVhc29uLCBpZiB3ZSBkZXRlY3QgdGhpcyBpc3N1ZSxcbiAgICAgIC8vIHdlIHdpbGwgZ28gdGhlIFwic2xvd1wiIHJvdXRlIGFuZCBjcmVhdGUgYSBzdGFjayB0cmFjZSwgYW5kIHVzZSB0aGF0IGZvciB0aGUgdW5pcXVlIGlkXG4gICAgICBpZiAoaWQubWF0Y2goL2FzeW5jR2VuZXJhdG9yU3RlcC8pKSB7XG4gICAgICAgIGlkID0gKG5ldyBFcnJvcigpKS5zdGFjaztcbiAgICAgICAgY29uc29sZS53YXJuKCdteXRoaXgtdWkgd2FybmluZzogXCJ0aGlzLmRlbGF5XCIgY2FsbGVkIHdpdGhvdXQgYSBzcGVjaWZpZWQgXCJpZFwiIHBhcmFtZXRlci4gVGhpcyB3aWxsIHJlc3VsdCBpbiBhIHBlcmZvcm1hbmNlIGhpdC4gUGxlYXNlIHNwZWNpZnkgYW5kIFwiaWRcIiBhcmd1bWVudCBmb3IgeW91ciBjYWxsOiBcInRoaXMuZGVsYXkoY2FsbGJhY2ssIG1zLCBcXCdzb21lLWN1c3RvbS1jYWxsLXNpdGUtaWRcXCcpXCInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSAoJycgKyBpZCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmRlbGF5VGltZXJzLmdldChpZCk7XG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICAgIGNsZWFyVGltZW91dChwcm9taXNlLnRpbWVySUQpO1xuXG4gICAgICBwcm9taXNlLnJlamVjdCgnY2FuY2VsbGVkJyk7XG4gICAgfVxuXG4gICAgcHJvbWlzZSA9IFV0aWxzLmNyZWF0ZVJlc29sdmFibGUoKTtcbiAgICB0aGlzLmRlbGF5VGltZXJzLnNldChpZCwgcHJvbWlzZSk7XG5cbiAgICAvLyBMZXQncyBub3QgY29tcGxhaW4gYWJvdXRcbiAgICAvLyB1bmNhdWdodCBlcnJvcnNcbiAgICBwcm9taXNlLmNhdGNoKCgpID0+IHt9KTtcblxuICAgIHByb21pc2UudGltZXJJRCA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgY2FsbGluZyBcImRlbGF5XCIgY2FsbGJhY2s6ICcsIGVycm9yLCBjYWxsYmFjay50b1N0cmluZygpKTtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH0sIHRpbWVNUyB8fCAwKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY2xlYXJEZWJvdW5jZShpZCkge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5kZWxheVRpbWVycy5nZXQoaWQpO1xuICAgIGlmICghcHJvbWlzZSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwcm9taXNlLnRpbWVySUQpXG4gICAgICBjbGVhclRpbWVvdXQocHJvbWlzZS50aW1lcklEKTtcblxuICAgIHByb21pc2UucmVqZWN0KCdjYW5jZWxsZWQnKTtcblxuICAgIHRoaXMuZGVsYXlUaW1lcnMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGNsYXNzZXMoLi4uX2FyZ3MpIHtcbiAgICBsZXQgYXJncyA9IF9hcmdzLmZsYXQoSW5maW5pdHkpLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnOjpTdHJpbmcnKSlcbiAgICAgICAgcmV0dXJuIGl0ZW0udHJpbSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgICBsZXQga2V5cyAgPSBPYmplY3Qua2V5cyhpdGVtKTtcbiAgICAgICAgbGV0IGl0ZW1zID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgbGV0IGtleSAgID0ga2V5c1tpXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaXRlbXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFyZ3MpKS5qb2luKCcgJyk7XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYyhzcmNVUkwpIHtcbiAgICBpZiAoIXNyY1VSTClcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBsb2FkUGFydGlhbEludG9FbGVtZW50LmNhbGwodGhpcywgc3JjVVJMKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFwiJHt0aGlzLnNlbnNpdGl2ZVRhZ05hbWV9XCI6IEZhaWxlZCB0byBsb2FkIHNwZWNpZmllZCByZXNvdXJjZTogJHtzcmNVUkx9IChyZXNvbHZlZCB0bzogJHtlcnJvci51cmx9KWAsIGVycm9yKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElkZW50aWZpZXIodGFyZ2V0KSB7XG4gIGlmICghdGFyZ2V0KVxuICAgIHJldHVybiAndW5kZWZpbmVkJztcblxuICBpZiAodHlwZW9mIHRhcmdldC5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB0YXJnZXQuZ2V0SWRlbnRpZmllci5jYWxsKHRhcmdldCk7XG5cbiAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpXG4gICAgcmV0dXJuIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpIHx8IFV0aWxzLnRvQ2FtZWxDYXNlKHRhcmdldC5sb2NhbE5hbWUpO1xuXG4gIHJldHVybiAndW5kZWZpbmVkJztcbn1cblxuLy8gZnVuY3Rpb24gZm9ybWF0UnVsZVNldChydWxlLCBjYWxsYmFjaykge1xuLy8gICBpZiAoIXJ1bGUuc2VsZWN0b3JUZXh0KVxuLy8gICAgIHJldHVybiBydWxlLmNzc1RleHQ7XG5cbi8vICAgbGV0IF9ib2R5ICAgPSBydWxlLmNzc1RleHQuc3Vic3RyaW5nKHJ1bGUuc2VsZWN0b3JUZXh0Lmxlbmd0aCkudHJpbSgpO1xuLy8gICBsZXQgcmVzdWx0ICA9IChjYWxsYmFjayhydWxlLnNlbGVjdG9yVGV4dCwgX2JvZHkpIHx8IFtdKS5maWx0ZXIoQm9vbGVhbik7XG4vLyAgIGlmICghcmVzdWx0KVxuLy8gICAgIHJldHVybiAnJztcblxuLy8gICByZXR1cm4gcmVzdWx0LmpvaW4oJyAnKTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gY3NzUnVsZXNUb1NvdXJjZShjc3NSdWxlcywgY2FsbGJhY2spIHtcbi8vICAgcmV0dXJuIEFycmF5LmZyb20oY3NzUnVsZXMgfHwgW10pLm1hcCgocnVsZSkgPT4ge1xuLy8gICAgIGxldCBydWxlU3RyID0gZm9ybWF0UnVsZVNldChydWxlLCBjYWxsYmFjayk7XG4vLyAgICAgcmV0dXJuIGAke2Nzc1J1bGVzVG9Tb3VyY2UocnVsZS5jc3NSdWxlcywgY2FsbGJhY2spfSR7cnVsZVN0cn1gO1xuLy8gICB9KS5qb2luKCdcXG5cXG4nKTtcbi8vIH1cblxuLy8gZnVuY3Rpb24gY29tcGlsZVN0eWxlRm9yRG9jdW1lbnQoZWxlbWVudE5hbWUsIHN0eWxlRWxlbWVudCkge1xuLy8gICBjb25zdCBoYW5kbGVIb3N0ID0gKG0sIHR5cGUsIF9jb250ZW50KSA9PiB7XG4vLyAgICAgbGV0IGNvbnRlbnQgPSAoIV9jb250ZW50KSA/IF9jb250ZW50IDogX2NvbnRlbnQucmVwbGFjZSgvXlxcKC8sICcnKS5yZXBsYWNlKC9cXCkkLywgJycpO1xuXG4vLyAgICAgaWYgKHR5cGUgPT09ICc6aG9zdCcpIHtcbi8vICAgICAgIGlmICghY29udGVudClcbi8vICAgICAgICAgcmV0dXJuIGVsZW1lbnROYW1lO1xuXG4vLyAgICAgICAvLyBFbGVtZW50IHNlbGVjdG9yP1xuLy8gICAgICAgaWYgKCgvXlthLXpBLVpfXS8pLnRlc3QoY29udGVudCkpXG4vLyAgICAgICAgIHJldHVybiBgJHtjb250ZW50fVtkYXRhLW15dGhpeC1jb21wb25lbnQtbmFtZT1cIiR7ZWxlbWVudE5hbWV9XCJdYDtcblxuLy8gICAgICAgcmV0dXJuIGAke2VsZW1lbnROYW1lfSR7Y29udGVudH1gO1xuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICByZXR1cm4gYCR7Y29udGVudH0gJHtlbGVtZW50TmFtZX1gO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICByZXR1cm4gY3NzUnVsZXNUb1NvdXJjZShcbi8vICAgICBzdHlsZUVsZW1lbnQuc2hlZXQuY3NzUnVsZXMsXG4vLyAgICAgKF9zZWxlY3RvciwgYm9keSkgPT4ge1xuLy8gICAgICAgbGV0IHNlbGVjdG9yID0gX3NlbGVjdG9yO1xuLy8gICAgICAgbGV0IHRhZ3MgICAgID0gW107XG5cbi8vICAgICAgIGxldCB1cGRhdGVkU2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8oWydcIl0pKD86XFxcXC58W15cXDFdKSs/XFwxLywgKG0pID0+IHtcbi8vICAgICAgICAgbGV0IGluZGV4ID0gdGFncy5sZW5ndGg7XG4vLyAgICAgICAgIHRhZ3MucHVzaChtKTtcbi8vICAgICAgICAgcmV0dXJuIGBAQEBUQUdbJHtpbmRleH1dQEBAYDtcbi8vICAgICAgIH0pLnNwbGl0KCcsJykubWFwKChzZWxlY3RvcikgPT4ge1xuLy8gICAgICAgICBsZXQgbW9kaWZpZWQgPSBzZWxlY3Rvci5yZXBsYWNlKC8oOmhvc3QoPzotY29udGV4dCk/KShcXChcXHMqW14pXSs/XFxzKlxcKSk/LywgaGFuZGxlSG9zdCk7XG4vLyAgICAgICAgIHJldHVybiAobW9kaWZpZWQgPT09IHNlbGVjdG9yKSA/IG51bGwgOiBtb2RpZmllZDtcbi8vICAgICAgIH0pLmZpbHRlcihCb29sZWFuKS5qb2luKCcsJykucmVwbGFjZSgvQEBAVEFHXFxbKFxcZCspXFxdQEBALywgKG0sIGluZGV4KSA9PiB7XG4vLyAgICAgICAgIHJldHVybiB0YWdzWytpbmRleF07XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaWYgKCF1cGRhdGVkU2VsZWN0b3IpXG4vLyAgICAgICAgIHJldHVybjtcblxuLy8gICAgICAgcmV0dXJuIFsgdXBkYXRlZFNlbGVjdG9yLCBib2R5IF07XG4vLyAgICAgfSxcbi8vICAgKTtcbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZURvY3VtZW50U3R5bGVzKG93bmVyRG9jdW1lbnQsIGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlKSB7XG4vLyAgIGxldCBvYmpJRCAgICAgICAgICAgICA9IFV0aWxzLmdldE9iamVjdElEKHRlbXBsYXRlKTtcbi8vICAgbGV0IHRlbXBsYXRlSUQgICAgICAgID0gVXRpbHMuU0hBMjU2KG9iaklEKTtcbi8vICAgbGV0IHRlbXBsYXRlQ2hpbGRyZW4gID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuLy8gICBsZXQgaW5kZXggICAgICAgICAgICAgPSAwO1xuXG4vLyAgIGZvciAobGV0IHRlbXBsYXRlQ2hpbGQgb2YgdGVtcGxhdGVDaGlsZHJlbikge1xuLy8gICAgIGlmICghKC9ec3R5bGUkL2kpLnRlc3QodGVtcGxhdGVDaGlsZC50YWdOYW1lKSlcbi8vICAgICAgIGNvbnRpbnVlO1xuXG4vLyAgICAgbGV0IHN0eWxlSUQgPSBgSURTVFlMRSR7dGVtcGxhdGVJRH0keysraW5kZXh9YDtcbi8vICAgICBpZiAoIW93bmVyRG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKGBzdHlsZSMke3N0eWxlSUR9YCkpIHtcbi8vICAgICAgIGxldCBjbG9uZWRTdHlsZUVsZW1lbnQgPSB0ZW1wbGF0ZUNoaWxkLmNsb25lTm9kZSh0cnVlKTtcbi8vICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjbG9uZWRTdHlsZUVsZW1lbnQpO1xuXG4vLyAgICAgICBsZXQgbmV3U3R5bGVTaGVldCA9IGNvbXBpbGVTdHlsZUZvckRvY3VtZW50KGNvbXBvbmVudE5hbWUsIGNsb25lZFN0eWxlRWxlbWVudCk7XG4vLyAgICAgICBvd25lckRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoY2xvbmVkU3R5bGVFbGVtZW50KTtcblxuLy8gICAgICAgbGV0IHN0eWxlTm9kZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbi8vICAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWZvcicsIHRoaXMuc2Vuc2l0aXZlVGFnTmFtZSk7XG4vLyAgICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuLy8gICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IG5ld1N0eWxlU2hlZXQ7XG5cbi8vICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cblxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRvckZyb21Qcm90b3R5cGVDaGFpbihzdGFydFByb3RvLCBkZXNjcmlwdG9yTmFtZSkge1xuICBsZXQgdGhpc1Byb3RvID0gc3RhcnRQcm90bztcbiAgbGV0IGRlc2NyaXB0b3I7XG5cbiAgd2hpbGUgKHRoaXNQcm90byAmJiAhKGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXNQcm90bywgZGVzY3JpcHRvck5hbWUpKSlcbiAgICB0aGlzUHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpc1Byb3RvKTtcblxuICByZXR1cm4gZGVzY3JpcHRvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVVUkwocm9vdExvY2F0aW9uLCBfdXJsaXNoKSB7XG4gIGxldCB1cmxpc2ggPSBfdXJsaXNoO1xuICBpZiAodXJsaXNoIGluc3RhbmNlb2YgVVJMKVxuICAgIHVybGlzaCA9IHVybGlzaC50b1N0cmluZygpO1xuXG4gIGlmICghdXJsaXNoKVxuICAgIHVybGlzaCA9ICcnO1xuXG4gIGlmICghVXRpbHMuaXNUeXBlKHVybGlzaCwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuO1xuXG4gIGxldCB1cmwgPSBuZXcgVVJMKHVybGlzaCwgbmV3IFVSTChyb290TG9jYXRpb24pKTtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLm15dGhpeFVJLnVybFJlc29sdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGV0IGZpbGVOYW1lICA9ICcnO1xuICAgIGxldCBwYXRoICAgICAgPSAnLyc7XG5cbiAgICB1cmwucGF0aG5hbWUucmVwbGFjZSgvXiguKlxcLykoW14vXSspJC8sIChtLCBmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICBwYXRoID0gZmlyc3QucmVwbGFjZSgvXFwvKyQvLCAnLycpO1xuICAgICAgaWYgKHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJylcbiAgICAgICAgcGF0aCA9IGAke3BhdGh9L2A7XG5cbiAgICAgIGZpbGVOYW1lID0gc2Vjb25kO1xuICAgICAgcmV0dXJuIG07XG4gICAgfSk7XG5cbiAgICBsZXQgbmV3U3JjID0gZ2xvYmFsVGhpcy5teXRoaXhVSS51cmxSZXNvbHZlci5jYWxsKHRoaXMsIHsgc3JjOiB1cmxpc2gsIHVybCwgcGF0aCwgZmlsZU5hbWUgfSk7XG4gICAgaWYgKG5ld1NyYyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtcmVxdWlyZVwiOiBOb3QgbG9hZGluZyBcIiR7dXJsaXNofVwiIGJlY2F1c2UgdGhlIGdsb2JhbCBcIm15dGhpeFVJLnVybFJlc29sdmVyXCIgcmVxdWVzdGVkIEkgbm90IGRvIHNvLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXdTcmMgJiYgKG5ld1NyYy50b1N0cmluZygpICE9PSB1cmwudG9TdHJpbmcoKSAmJiBuZXdTcmMudG9TdHJpbmcoKSAhPT0gdXJsaXNoKSlcbiAgICAgIHVybCA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCByb290TG9jYXRpb24sIG5ld1NyYyk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG5jb25zdCBJU19URU1QTEFURSAgICAgICAgID0gL14odGVtcGxhdGUpJC9pO1xuY29uc3QgSVNfU0NSSVBUICAgICAgICAgICA9IC9eKHNjcmlwdCkkL2k7XG5jb25zdCBSRVFVSVJFX0NBQ0hFICAgICAgID0gbmV3IE1hcCgpO1xuY29uc3QgUkVTT0xWRV9TUkNfRUxFTUVOVCA9IC9ec2NyaXB0fGxpbmt8c3R5bGV8bXl0aGl4LWxhbmd1YWdlLXBhY2t8bXl0aGl4LXJlcXVpcmUkL2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlKG93bmVyRG9jdW1lbnQsIGxvY2F0aW9uLCBfdXJsLCBzb3VyY2VTdHJpbmcsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHVybCAgICAgICA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBsb2NhdGlvbiwgX3VybCwgb3B0aW9ucy5tYWdpYyk7XG4gIGxldCBmaWxlTmFtZTtcbiAgbGV0IGJhc2VVUkwgICA9IG5ldyBVUkwoYCR7dXJsLm9yaWdpbn0ke3VybC5wYXRobmFtZS5yZXBsYWNlKC9bXi9dKyQvLCAobSkgPT4ge1xuICAgIGZpbGVOYW1lID0gbTtcbiAgICByZXR1cm4gJyc7XG4gIH0pfSR7dXJsLnNlYXJjaH0ke3VybC5oYXNofWApO1xuXG4gIGxldCB0ZW1wbGF0ZSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc291cmNlU3RyaW5nO1xuXG4gIGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikuc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCB4ID0gYS50YWdOYW1lO1xuICAgIGxldCB5ID0gYi50YWdOYW1lO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuICAgIGlmICh4ID09IHkpXG4gICAgICByZXR1cm4gMDtcblxuICAgIHJldHVybiAoeCA8IHkpID8gMSA6IC0xO1xuICB9KTtcblxuICBjb25zdCBmaWxlTmFtZVRvRWxlbWVudE5hbWUgPSAoZmlsZU5hbWUpID0+IHtcbiAgICByZXR1cm4gZmlsZU5hbWUudHJpbSgpLnJlcGxhY2UoL1xcLi4qJC8sICcnKS5yZXBsYWNlKC9cXGJbQS1aXXxbXkEtWl1bQS1aXS9nLCAoX20pID0+IHtcbiAgICAgIGxldCBtID0gX20udG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiAobS5sZW5ndGggPCAyKSA/IGAtJHttfWAgOiBgJHttLmNoYXJBdCgwKX0tJHttLmNoYXJBdCgxKX1gO1xuICAgIH0pLnJlcGxhY2UoLy17Mix9L2csICctJykucmVwbGFjZSgvXlteYS16XSovLCAnJykucmVwbGFjZSgvW15hLXpdKiQvLCAnJyk7XG4gIH07XG5cbiAgbGV0IGd1ZXNzZWRFbGVtZW50TmFtZSAgPSBmaWxlTmFtZVRvRWxlbWVudE5hbWUoZmlsZU5hbWUpO1xuICBsZXQgY29udGV4dCAgICAgICAgICAgICA9IHtcbiAgICBndWVzc2VkRWxlbWVudE5hbWUsXG4gICAgY2hpbGRyZW4sXG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB0ZW1wbGF0ZSxcbiAgICB1cmwsXG4gICAgYmFzZVVSTCxcbiAgICBmaWxlTmFtZSxcbiAgfTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMucHJlUHJvY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRlbXBsYXRlID0gY29udGV4dC50ZW1wbGF0ZSA9IG9wdGlvbnMucHJlUHJvY2Vzcy5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKTtcbiAgfVxuXG4gIGxldCBub2RlSGFuZGxlciAgID0gb3B0aW9ucy5ub2RlSGFuZGxlcjtcbiAgbGV0IHRlbXBsYXRlQ291bnQgPSBjaGlsZHJlbi5yZWR1Y2UoKHN1bSwgZWxlbWVudCkgPT4gKChJU19URU1QTEFURS50ZXN0KGVsZW1lbnQudGFnTmFtZSkpID8gKHN1bSArIDEpIDogc3VtKSwgMCk7XG5cbiAgY29udGV4dC50ZW1wbGF0ZUNvdW50ID0gdGVtcGxhdGVDb3VudDtcblxuICBjb25zdCByZXNvbHZlRWxlbWVudFNyY0F0dHJpYnV0ZSA9IChlbGVtZW50LCBiYXNlVVJMKSA9PiB7XG4gICAgLy8gUmVzb2x2ZSBcInNyY1wiIGF0dHJpYnV0ZSwgc2luY2Ugd2UgYXJlXG4gICAgLy8gZ29pbmcgdG8gYmUgbW92aW5nIHRoZSBlbGVtZW50IGFyb3VuZFxuICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgaWYgKHNyYykge1xuICAgICAgc3JjID0gcmVzb2x2ZVVSTC5jYWxsKHRoaXMsIGJhc2VVUkwsIHNyYywgZmFsc2UpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYy50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfTtcblxuICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgIGlmIChvcHRpb25zLm1hZ2ljICYmIFJFU09MVkVfU1JDX0VMRU1FTlQudGVzdChjaGlsZC5sb2NhbE5hbWUpKVxuICAgICAgY2hpbGQgPSByZXNvbHZlRWxlbWVudFNyY0F0dHJpYnV0ZShjaGlsZCwgYmFzZVVSTCk7XG5cbiAgICBpZiAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8dGVtcGxhdGU+XG4gICAgICBpZiAodGVtcGxhdGVDb3VudCA9PT0gMSAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJykgPT0gbnVsbCAmJiBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykgPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYCR7dXJsfTogPHRlbXBsYXRlPiBpcyBtaXNzaW5nIGEgXCJkYXRhLWZvclwiIGF0dHJpYnV0ZSwgbGlua2luZyBpdCB0byBpdHMgb3duZXIgY29tcG9uZW50LiBHdWVzc2luZyBcIiR7Z3Vlc3NlZEVsZW1lbnROYW1lfVwiLmApO1xuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZm9yJywgZ3Vlc3NlZEVsZW1lbnROYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzVGVtcGxhdGU6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKSB8fCBjaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbXl0aGl4LWNvbXBvbmVudC1uYW1lJykpO1xuICAgICAgaWYgKCFvd25lckRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtlbGVtZW50TmFtZX1cIiBpXSxbZGF0YS1teXRoaXgtY29tcG9uZW50LW5hbWU9XCIke2VsZW1lbnROYW1lfVwiIGldYCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmIChJU19TQ1JJUFQudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8c2NyaXB0PlxuICAgICAgbGV0IGNoaWxkQ2xvbmUgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY2hpbGQudGFnTmFtZSk7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIG9mIGNoaWxkLmdldEF0dHJpYnV0ZU5hbWVzKCkpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIGNoaWxkLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSk7XG5cbiAgICAgIGxldCBzcmMgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgaWYgKHNyYykge1xuICAgICAgICBzcmMgPSByZXNvbHZlVVJMLmNhbGwodGhpcywgYmFzZVVSTCwgc3JjLCBmYWxzZSk7XG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZENsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICdtb2R1bGUnKTtcbiAgICAgICAgY2hpbGRDbG9uZS5pbm5lckhUTUwgPSBjaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU2NyaXB0OiB0cnVlLCBpc0hhbmRsZWQ6IHRydWUgfSkgPT09IGZhbHNlKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgbGV0IHN0eWxlSUQgPSBgSUQke1V0aWxzLlNIQTI1NihgJHtndWVzc2VkRWxlbWVudE5hbWV9OiR7Y2hpbGRDbG9uZS5pbm5lckhUTUx9YCl9YDtcbiAgICAgIGlmICghY2hpbGRDbG9uZS5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgICAgIGNoaWxkQ2xvbmUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlSUQpO1xuXG4gICAgICAvLyBhcHBlbmQgdG8gaGVhZFxuICAgICAgaWYgKCFvd25lckRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdCMke3N0eWxlSUR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICB9IGVsc2UgaWYgKCgvXihsaW5rfHN0eWxlKSQvaSkudGVzdChjaGlsZC50YWdOYW1lKSkgeyAvLyA8bGluaz4gJiA8c3R5bGU+XG4gICAgICBsZXQgaXNTdHlsZSA9ICgvXnN0eWxlJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpO1xuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyAmJiBub2RlSGFuZGxlci5jYWxsKHRoaXMsIGNoaWxkLCB7IC4uLmNvbnRleHQsIGlzU3R5bGUsIGlzTGluazogIWlzU3R5bGUsIGlzSGFuZGxlZDogdHJ1ZSB9KSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgaWQgPSBgSUQke1V0aWxzLlNIQTI1NihjaGlsZC5vdXRlckhUTUwpfWA7XG4gICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcblxuICAgICAgLy8gYXBwZW5kIHRvIGhlYWRcbiAgICAgIGlmICghb3duZXJEb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2NoaWxkLnRhZ05hbWV9IyR7aWR9YCkpXG4gICAgICAgIG93bmVyRG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfSBlbHNlIGlmICgoL15tZXRhJC9pKS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDxtZXRhPlxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc01ldGE6IHRydWUsIGlzSGFuZGxlZDogdHJ1ZSB9KTtcblxuICAgICAgLy8gZG8gbm90aGluZyB3aXRoIHRoZXNlIHRhZ3NcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7IC8vIEV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgbGV0IGlzSGFuZGxlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoY2hpbGQubG9jYWxOYW1lID09PSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snKSB7XG4gICAgICAgIGxldCBsYW5nUGFja0lEID0gYElEJHtVdGlscy5TSEEyNTYoYCR7Z3Vlc3NlZEVsZW1lbnROYW1lfToke2NoaWxkLm91dGVySFRNTH1gKX1gO1xuICAgICAgICBpZiAoIWNoaWxkLmdldEF0dHJpYnV0ZSgnaWQnKSlcbiAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgbGFuZ1BhY2tJRCk7XG5cbiAgICAgICAgbGV0IGxhbmd1YWdlUHJvdmlkZXIgPSB0aGlzLmNsb3Nlc3QoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgICAgICBpZiAoIWxhbmd1YWdlUHJvdmlkZXIpXG4gICAgICAgICAgbGFuZ3VhZ2VQcm92aWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuXG4gICAgICAgIGlmIChsYW5ndWFnZVByb3ZpZGVyKSB7XG4gICAgICAgICAgaWYgKCFsYW5ndWFnZVByb3ZpZGVyLnF1ZXJ5U2VsZWN0b3IoYG15dGhpeC1sYW5ndWFnZS1wYWNrIyR7bGFuZ1BhY2tJRH1gKSlcbiAgICAgICAgICAgIGxhbmd1YWdlUHJvdmlkZXIuaW5zZXJ0QmVmb3JlKGNoaWxkLCBsYW5ndWFnZVByb3ZpZGVyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgICAgaXNIYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBlbHNlIGRvIG5vdGhpbmcuLi4gbGV0IGl0IGJlIGR1bXBlZCBpbnRvIHRoZSBkb20gbGF0ZXJcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbm9kZUhhbmRsZXIuY2FsbCh0aGlzLCBjaGlsZCwgeyAuLi5jb250ZXh0LCBpc0hhbmRsZWQgfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLnBvc3RQcm9jZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGVtcGxhdGUgPSBjb250ZXh0LnRlbXBsYXRlID0gb3B0aW9ucy5wb3N0UHJvY2Vzcy5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZSh1cmxPck5hbWUsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBvd25lckRvY3VtZW50ID0gb3B0aW9ucy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICBsZXQgdXJsICAgICAgICAgICA9IHJlc29sdmVVUkwuY2FsbCh0aGlzLCBvd25lckRvY3VtZW50LmxvY2F0aW9uLCB1cmxPck5hbWUsIG9wdGlvbnMubWFnaWMpO1xuICBsZXQgY2FjaGVLZXk7XG5cbiAgaWYgKCEoL14oZmFsc2V8bm8tc3RvcmV8cmVsb2FkfG5vLWNhY2hlKSQvKS50ZXN0KHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdjYWNoZScpKSkge1xuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2FjaGVQYXJhbXMnKSAhPT0gJ3RydWUnKSB7XG4gICAgICBsZXQgY2FjaGVLZXlVUkwgPSBuZXcgVVJMKGAke3VybC5vcmlnaW59JHt1cmwucGF0aG5hbWV9YCk7XG4gICAgICBjYWNoZUtleSA9IGNhY2hlS2V5VVJMLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhY2hlS2V5ID0gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbGV0IGNhY2hlZFJlc3BvbnNlID0gUkVRVUlSRV9DQUNIRS5nZXQoY2FjaGVLZXkpO1xuICAgIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgY2FjaGVkUmVzcG9uc2UgPSBhd2FpdCBjYWNoZWRSZXNwb25zZTtcbiAgICAgIGlmIChjYWNoZWRSZXNwb25zZS5yZXNwb25zZSAmJiBjYWNoZWRSZXNwb25zZS5yZXNwb25zZS5vaylcbiAgICAgICAgcmV0dXJuIHsgdXJsLCByZXNwb25zZTogY2FjaGVkUmVzcG9uc2UucmVzcG9uc2UsIG93bmVyRG9jdW1lbnQsIGNhY2hlZDogdHJ1ZSB9O1xuICAgIH1cbiAgfVxuXG4gIGxldCBwcm9taXNlID0gZ2xvYmFsVGhpcy5mZXRjaCh1cmwsIG9wdGlvbnMuZmV0Y2hPcHRpb25zKS50aGVuKFxuICAgIGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBpZiAoY2FjaGVLZXkpXG4gICAgICAgICAgUkVRVUlSRV9DQUNIRS5kZWxldGUoY2FjaGVLZXkpO1xuXG4gICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihgJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgZXJyb3IudXJsID0gdXJsO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICByZXNwb25zZS50ZXh0ID0gYXN5bmMgKCkgPT4gYm9keTtcbiAgICAgIHJlc3BvbnNlLmpzb24gPSBhc3luYyAoKSA9PiBKU09OLnBhcnNlKGJvZHkpO1xuXG4gICAgICByZXR1cm4geyB1cmwsIHJlc3BvbnNlLCBvd25lckRvY3VtZW50LCBjYWNoZWQ6IGZhbHNlIH07XG4gICAgfSxcbiAgICAoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZyb20gTXl0aGl4IFVJIFwicmVxdWlyZVwiOiAnLCBlcnJvcik7XG5cbiAgICAgIGlmIChjYWNoZUtleSlcbiAgICAgICAgUkVRVUlSRV9DQUNIRS5kZWxldGUoY2FjaGVLZXkpO1xuXG4gICAgICBlcnJvci51cmwgPSB1cmw7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9LFxuICApO1xuXG4gIFJFUVVJUkVfQ0FDSEUuc2V0KGNhY2hlS2V5LCBwcm9taXNlKTtcblxuICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRQYXJ0aWFsSW50b0VsZW1lbnQoc3JjLCBfb3B0aW9ucykge1xuICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gIGxldCB7XG4gICAgb3duZXJEb2N1bWVudCxcbiAgICB1cmwsXG4gICAgcmVzcG9uc2UsXG4gIH0gPSBhd2FpdCByZXF1aXJlLmNhbGwoXG4gICAgdGhpcyxcbiAgICBzcmMsXG4gICAge1xuICAgICAgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgIH0sXG4gICk7XG5cbiAgbGV0IGJvZHkgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gIHdoaWxlICh0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5jaGlsZE5vZGVzWzBdKTtcblxuICBsZXQgc2NvcGVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgdXJsLnNlYXJjaFBhcmFtcy5lbnRyaWVzKCkpXG4gICAgc2NvcGVEYXRhW2tleV0gPSBVdGlscy5jb2VyY2UodmFsdWUpO1xuXG4gIGltcG9ydEludG9Eb2N1bWVudEZyb21Tb3VyY2UuY2FsbChcbiAgICB0aGlzLFxuICAgIG93bmVyRG9jdW1lbnQsXG4gICAgb3duZXJEb2N1bWVudC5sb2NhdGlvbixcbiAgICB1cmwsXG4gICAgYm9keSxcbiAgICB7XG4gICAgICBub2RlSGFuZGxlcjogKG5vZGUsIHsgaXNIYW5kbGVkLCBpc1RlbXBsYXRlIH0pID0+IHtcbiAgICAgICAgaWYgKChpc1RlbXBsYXRlIHx8ICFpc0hhbmRsZWQpICYmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzLmNhbGwoXG4gICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShzY29wZURhdGEsIG9wdGlvbnMuc2NvcGUpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpYmlsaXR5T2JzZXJ2ZXIoY2FsbGJhY2ssIF9vcHRpb25zKSB7XG4gIGNvbnN0IGludGVyc2VjdGlvbkNhbGxiYWNrID0gKGVudHJpZXMpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbnRyeSAgID0gZW50cmllc1tpXTtcbiAgICAgIGxldCBlbGVtZW50ID0gZW50cnkudGFyZ2V0O1xuICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZylcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMpO1xuICAgICAgaWYgKCFlbGVtZW50T2JzZXJ2ZXJzKSB7XG4gICAgICAgIGVsZW1lbnRPYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIFV0aWxzLm1ldGFkYXRhKGVsZW1lbnQsIE1ZVEhJWF9JTlRFUlNFQ1RJT05fT0JTRVJWRVJTLCBlbGVtZW50T2JzZXJ2ZXJzKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRhdGEgPSBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcik7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHsgd2FzVmlzaWJsZTogZmFsc2UsIHJhdGlvVmlzaWJsZTogZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gfTtcbiAgICAgICAgZWxlbWVudE9ic2VydmVycy5zZXQob2JzZXJ2ZXIsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiBkYXRhLnJhdGlvVmlzaWJsZSlcbiAgICAgICAgZGF0YS5yYXRpb1Zpc2libGUgPSBlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbztcblxuICAgICAgZGF0YS5wcmV2aW91c1Zpc2liaWxpdHkgPSAoZGF0YS52aXNpYmlsaXR5ID09PSB1bmRlZmluZWQpID8gZGF0YS52aXNpYmlsaXR5IDogZGF0YS52aXNpYmlsaXR5O1xuICAgICAgZGF0YS52aXNpYmlsaXR5ID0gKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMC4wKTtcblxuICAgICAgY2FsbGJhY2soeyAuLi5kYXRhLCBlbnRyeSwgZWxlbWVudCwgaW5kZXg6IGksIGRpc2Nvbm5lY3Q6ICgpID0+IG9ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KSB9KTtcblxuICAgICAgaWYgKGRhdGEudmlzaWJpbGl0eSAmJiAhZGF0YS53YXNWaXNpYmxlKVxuICAgICAgICBkYXRhLndhc1Zpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHtcbiAgICByb290OiAgICAgICBudWxsLFxuICAgIHRocmVzaG9sZDogIDAuMCxcbiAgICAuLi4oX29wdGlvbnMgfHwge30pLFxuICB9O1xuXG4gIGxldCBvYnNlcnZlciAgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaW50ZXJzZWN0aW9uQ2FsbGJhY2ssIG9wdGlvbnMpO1xuICBsZXQgZWxlbWVudHMgID0gKF9vcHRpb25zIHx8IHt9KS5lbGVtZW50cyB8fCBbXTtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudHNbaV0pO1xuXG4gIHJldHVybiBvYnNlcnZlcjtcbn1cblxuY29uc3QgTk9fT0JTRVJWRVIgPSBPYmplY3QuZnJlZXplKHtcbiAgd2FzVmlzaWJsZTogICAgICAgICBmYWxzZSxcbiAgcmF0aW9WaXNpYmxlOiAgICAgICAwLjAsXG4gIHZpc2liaWxpdHk6ICAgICAgICAgZmFsc2UsXG4gIHByZXZpb3VzVmlzaWJpbGl0eTogZmFsc2UsXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlNZXRhKGVsZW1lbnQsIG9ic2VydmVyKSB7XG4gIGxldCBlbGVtZW50T2JzZXJ2ZXJzID0gVXRpbHMubWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX0lOVEVSU0VDVElPTl9PQlNFUlZFUlMpO1xuICBpZiAoIWVsZW1lbnRPYnNlcnZlcnMpXG4gICAgcmV0dXJuIE5PX09CU0VSVkVSO1xuXG4gIHJldHVybiBlbGVtZW50T2JzZXJ2ZXJzLmdldChvYnNlcnZlcikgfHwgTk9fT0JTRVJWRVI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXJnZXN0RG9jdW1lbnRUYWJJbmRleChvd25lckRvY3VtZW50KSB7XG4gIGxldCBsYXJnZXN0ID0gLUluZmluaXR5O1xuXG4gIEFycmF5LmZyb20oKG93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF0nKSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGxldCB0YWJJbmRleCA9IHBhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpLCAxMCk7XG4gICAgaWYgKCFpc0Zpbml0ZSh0YWJJbmRleCkpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAodGFiSW5kZXggPiBsYXJnZXN0KVxuICAgICAgbGFyZ2VzdCA9IHRhYkluZGV4O1xuICB9KTtcblxuICByZXR1cm4gKGxhcmdlc3QgPCAwKSA/IDAgOiBsYXJnZXN0O1xufVxuIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbi8qKlxuICogIHR5cGU6IE5hbWVzcGFjZVxuICogIG5hbWU6IEVsZW1lbnRzXG4gKiAgZ3JvdXBOYW1lOiBFbGVtZW50c1xuICogIGRlc2M6IHxcbiAqICAgIGBpbXBvcnQgeyBFbGVtZW50cyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7YFxuICpcbiAqICAgIFV0aWxpdHkgYW5kIGVsZW1lbnQgYnVpbGRpbmcgZnVuY3Rpb25zIGZvciB0aGUgRE9NLlxuICovXG5cbmV4cG9ydCBjb25zdCBVTkZJTklTSEVEX0RFRklOSVRJT04gICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvdW5maW5pc2hlZCcpO1xuZXhwb3J0IGNvbnN0IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpFbGVtZW50RGVmaW5pdGlvbicpO1xuXG5jb25zdCBRVUVSWV9FTkdJTkVfVFlQRSA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpRdWVyeUVuZ2luZScpO1xuXG5jb25zdCBJU19QUk9QX05BTUUgICAgPSAvXnByb3BcXCQvO1xuY29uc3QgSVNfVEFSR0VUX1BST1AgID0gL15wcm90b3R5cGV8Y29uc3RydWN0b3IkLztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnREZWZpbml0aW9uIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbVXRpbHMuTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW1V0aWxzLk1ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSxcbiAgICAgIH0sXG4gICAgICAndGFnTmFtZSc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0YWdOYW1lLFxuICAgICAgfSxcbiAgICAgICdhdHRyaWJ1dGVzJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGF0dHJpYnV0ZXMgfHwge30sXG4gICAgICB9LFxuICAgICAgJ2NoaWxkcmVuJzoge1xuICAgICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogICAgICAgIGNoaWxkcmVuIHx8IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB0YWdOYW1lID0gdGhpcy50YWdOYW1lO1xuICAgIGlmICh0YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy52YWx1ZTtcblxuICAgIGxldCBhdHRycyA9ICgoYXR0cmlidXRlcykgPT4ge1xuICAgICAgbGV0IHBhcnRzID0gW107XG5cbiAgICAgIGZvciAobGV0IFsgYXR0cmlidXRlTmFtZSwgdmFsdWUgXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICBpZiAoSVNfUFJPUF9OQU1FLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLnRvRE9NQXR0cmlidXRlTmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgICAgcGFydHMucHVzaChuYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcnRzLnB1c2goYCR7bmFtZX09XCIke2VuY29kZVZhbHVlKHZhbHVlKX1cImApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xuICAgIH0pKHRoaXMuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgY2hpbGRyZW4gPSAoKGNoaWxkcmVuKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IChjaGlsZCAhPSBudWxsICYmIGNoaWxkICE9PSBmYWxzZSAmJiAhT2JqZWN0LmlzKGNoaWxkLCBOYU4pKSlcbiAgICAgICAgLm1hcCgoY2hpbGQpID0+ICgnJyArIGNoaWxkKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIH0pKHRoaXMuY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGA8JHt0YWdOYW1lfSR7KGF0dHJzKSA/IGAgJHthdHRyc31gIDogJyd9PiR7KGlzVm9pZFRhZyh0YWdOYW1lKSkgPyAnJyA6IGAke2NoaWxkcmVufTwvJHt0YWdOYW1lfT5gfWA7XG4gIH1cblxuICB0b0RPTUF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBidWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI2ZyYWdtZW50JylcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGNoaWxkLmJ1aWxkKG93bmVyRG9jdW1lbnQsIHRlbXBsYXRlT3B0aW9ucykpO1xuXG4gICAgbGV0IGF0dHJpYnV0ZXMgICAgPSB0aGlzLmF0dHJpYnV0ZXM7XG4gICAgbGV0IG5hbWVzcGFjZVVSSSAgPSBhdHRyaWJ1dGVzLm5hbWVzcGFjZVVSSTtcbiAgICBsZXQgb3B0aW9ucztcbiAgICBsZXQgZWxlbWVudDtcblxuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaXMpXG4gICAgICBvcHRpb25zID0geyBpczogdGhpcy5hdHRyaWJ1dGVzLmlzIH07XG5cbiAgICBpZiAodGhpcy50YWdOYW1lID09PSAnI3RleHQnKVxuICAgICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKHRoaXMsIG93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXR0cmlidXRlcy52YWx1ZSB8fCAnJyksIHRlbXBsYXRlT3B0aW9ucyk7XG5cbiAgICBpZiAobmFtZXNwYWNlVVJJKVxuICAgICAgZWxlbWVudCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgdGhpcy50YWdOYW1lLCBvcHRpb25zKTtcbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGhpcy50YWdOYW1lKSlcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCB0aGlzLnRhZ05hbWUsIG9wdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy50YWdOYW1lKTtcblxuICAgIGNvbnN0IGV2ZW50TmFtZXMgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChlbGVtZW50KTtcbiAgICBjb25zdCBoYW5kbGVBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgX2F0dHJpYnV0ZVZhbHVlKSA9PiB7XG4gICAgICBsZXQgYXR0cmlidXRlVmFsdWUgICAgICA9IF9hdHRyaWJ1dGVWYWx1ZTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lcy5pbmRleE9mKGxvd2VyQXR0cmlidXRlTmFtZSkgPj0gMCkge1xuICAgICAgICBVdGlscy5iaW5kRXZlbnRUb0VsZW1lbnQuY2FsbChcbiAgICAgICAgICBVdGlscy5jcmVhdGVTY29wZShlbGVtZW50LCB0ZW1wbGF0ZU9wdGlvbnMuc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBsb3dlckF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpLFxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkQXR0cmlidXRlTmFtZSA9IHRoaXMudG9ET01BdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShtb2RpZmllZEF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRHluYW1pYyBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQgZm9yIHByb3BlcnRpZXNcbiAgICBjb25zdCBoYW5kbGVQcm9wZXJ0eSA9IChlbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpID0+IHtcbiAgICAgIGxldCBuYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoSVNfUFJPUF9OQU1FLCAnJyk7XG4gICAgICBlbGVtZW50W25hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICA9IGF0dHJpYnV0ZU5hbWVzW2ldO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgIGlmIChJU19QUk9QX05BTUUudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgaGFuZGxlUHJvcGVydHkoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgZWxzZVxuICAgICAgICBoYW5kbGVBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgbGV0IGNoaWxkICAgICAgICAgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IGNoaWxkRWxlbWVudCAgPSBjaGlsZC5idWlsZChvd25lckRvY3VtZW50LCB0ZW1wbGF0ZU9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWxlbWVudCkpXG4gICAgICAgICAgY2hpbGRFbGVtZW50LmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGNoaWxkKSA9PiBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3NFbGVtZW50cy5jYWxsKFxuICAgICAgdGhpcyxcbiAgICAgIGVsZW1lbnQsXG4gICAgICB7XG4gICAgICAgIC4uLnRlbXBsYXRlT3B0aW9ucyxcbiAgICAgICAgcHJvY2Vzc0V2ZW50Q2FsbGJhY2tzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBJU19IVE1MX1NBRkVfQ0hBUkFDVEVSID0gL15bXFxzYS16QS1aMC05Xy1dJC87XG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLy4vZywgKG0pID0+IHtcbiAgICByZXR1cm4gKElTX0hUTUxfU0FGRV9DSEFSQUNURVIudGVzdChtKSkgPyBtIDogYCYjJHttLmNoYXJDb2RlQXQoMCl9O2A7XG4gIH0pO1xufVxuXG5jb25zdCBJU19WT0lEX1RBRyA9IC9eYXJlYXxiYXNlfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIkL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNWb2lkVGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIElTX1ZPSURfVEFHLnRlc3QodGFnTmFtZS5zcGxpdCgnOicpLnNsaWNlKC0xKVswXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudHMoX25vZGUsIF9vcHRpb25zKSB7XG4gIGxldCBub2RlID0gX25vZGU7XG4gIGlmICghbm9kZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBsZXQgb3B0aW9ucyAgICAgICA9IF9vcHRpb25zIHx8IHt9O1xuICBsZXQgc2NvcGUgICAgICAgICA9IG9wdGlvbnMuc2NvcGU7XG4gIGlmICghc2NvcGUpIHtcbiAgICBzY29wZSA9IFV0aWxzLmNyZWF0ZVNjb3BlKG5vZGUpO1xuICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIHNjb3BlIH07XG4gIH1cblxuICBsZXQgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgPSAob3B0aW9ucy5mb3JjZVRlbXBsYXRlRW5naW5lID09PSB0cnVlKSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMuZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3I7XG4gIGxldCBjaGlsZHJlbiAgICAgICAgICAgICAgICAgICAgICA9IEFycmF5LmZyb20obm9kZS5jaGlsZE5vZGVzKTtcblxuICBpZiAob3B0aW9ucy5mb3JjZVRlbXBsYXRlRW5naW5lICE9PSB0cnVlICYmICFkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3Rvcikge1xuICAgIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yID0gVXRpbHMuZ2V0RGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKTtcbiAgICBvcHRpb25zID0geyAuLi5vcHRpb25zLCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvciB9O1xuICB9XG5cbiAgbGV0IGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCA9IGZhbHNlO1xuICBpZiAoZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IgJiYgVXRpbHMuc3BlY2lhbENsb3Nlc3Qobm9kZSwgZGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IpKVxuICAgIGlzVGVtcGxhdGVFbmdpbmVEaXNhYmxlZCA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmhlbHBlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmhlbHBlci5jYWxsKHRoaXMsIHsgc2NvcGUsIG9wdGlvbnMsIG5vZGUsIGNoaWxkcmVuLCBpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQsIGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yIH0pO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgbm9kZSA9IHJlc3VsdDtcbiAgICBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjb25zdCBpc1ZhbGlkTm9kZVR5cGUgPSAoaXRlbSkgPT4ge1xuICAgIGlmICghaXRlbSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChpdGVtIGluc3RhbmNlb2YgTm9kZSlcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgaWYgKGl0ZW1bVXRpbHMuTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSlcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgaWYgKGl0ZW1bVXRpbHMuTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSB7XG4gICAgaWYgKCFpc1RlbXBsYXRlRW5naW5lRGlzYWJsZWQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUobm9kZSwgb3B0aW9ucyk7XG4gICAgICBpZiAoKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiByZXN1bHQuc29tZShpc1ZhbGlkTm9kZVR5cGUpKSB8fCBpc1ZhbGlkTm9kZVR5cGUocmVzdWx0KSkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgICByZXN1bHQgPSBbIHJlc3VsdCBdO1xuXG4gICAgICAgIGxldCBvd25lckRvY3VtZW50ID0gb3B0aW9ucy5vd25lckRvY3VtZW50IHx8IHNjb3BlLm93bmVyRG9jdW1lbnQgfHwgbm9kZS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgICBsZXQgZnJhZ21lbnQgICAgICA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1bVXRpbHMuTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gaXRlbS5idWlsZChvd25lckRvY3VtZW50LCB7IHNjb3BlIH0pO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50cylcbiAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnRzKSlcbiAgICAgICAgICAgICAgZWxlbWVudHMuZmxhdChJbmZpbml0eSkuZm9yRWFjaCgoZWxlbWVudCkgPT4gZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChlbGVtZW50cyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtW1V0aWxzLk1ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpIHtcbiAgICAgICAgICAgIGl0ZW0uYXBwZW5kVG8oZnJhZ21lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGV4dE5vZGUgPSBvd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCgnJyArIGl0ZW0pKTtcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHRleHROb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnJhZ21lbnQ7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCAhPT0gbm9kZS5ub2RlVmFsdWUpIHtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAgcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFIHx8IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgIGxldCBldmVudE5hbWVzICAgICAgPSBVdGlscy5nZXRBbGxFdmVudE5hbWVzRm9yRWxlbWVudChub2RlKTtcbiAgICBsZXQgYXR0cmlidXRlTmFtZXMgID0gbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXR0cmlidXRlTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgICAgICAgPSBhdHRyaWJ1dGVOYW1lc1tpXTtcbiAgICAgIGxldCBsb3dlckF0dHJpYnV0ZU5hbWUgID0gYXR0cmlidXRlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlICAgICAgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZXMuaW5kZXhPZihsb3dlckF0dHJpYnV0ZU5hbWUpID49IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMucHJvY2Vzc0V2ZW50Q2FsbGJhY2tzICE9PSBmYWxzZSkge1xuICAgICAgICAgIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudC5jYWxsKFxuICAgICAgICAgICAgVXRpbHMuY3JlYXRlU2NvcGUobm9kZSwgc2NvcGUpLCAvLyB0aGlzXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbG93ZXJBdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChVdGlscy5pc1RlbXBsYXRlKGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRm9ybWF0dGluZyBhdHRyaWJ1dGU6ICcsIGF0dHJpYnV0ZU5hbWUsIG5vZGUpO1xuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IG5vZGUuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZU5vZGUpXG4gICAgICAgICAgYXR0cmlidXRlTm9kZS5ub2RlVmFsdWUgPSBVdGlscy5mb3JtYXROb2RlVmFsdWUoYXR0cmlidXRlTm9kZSwgeyAuLi5vcHRpb25zLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvY2Vzc0NoaWxkcmVuID09PSBmYWxzZSlcbiAgICByZXR1cm4gbm9kZTtcblxuICBmb3IgKGxldCBjaGlsZE5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gcHJvY2Vzc0VsZW1lbnRzLmNhbGwodGhpcywgY2hpbGROb2RlLCBvcHRpb25zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgTm9kZSAmJiByZXN1bHQgIT09IGNoaWxkTm9kZSAmJiBoYXNDaGlsZChub2RlLCBjaGlsZE5vZGUpKVxuICAgICAgbm9kZS5yZXBsYWNlQ2hpbGQocmVzdWx0LCBjaGlsZE5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZChwYXJlbnROb2RlLCBjaGlsZE5vZGUpIHtcbiAgaWYgKCFwYXJlbnROb2RlIHx8ICFjaGlsZE5vZGUpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAobGV0IGNoaWxkIG9mIEFycmF5LmZyb20ocGFyZW50Tm9kZS5jaGlsZE5vZGVzKSkge1xuICAgIGlmIChjaGlsZCA9PT0gY2hpbGROb2RlKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgc2NvcGUpIHtcbiAgaWYgKCF0YWdOYW1lIHx8ICFVdGlscy5pc1R5cGUodGFnTmFtZSwgJzo6U3RyaW5nJykpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGNyZWF0ZSBhbiBFbGVtZW50RGVmaW5pdGlvbiB3aXRob3V0IGEgXCJ0YWdOYW1lXCIuJyk7XG5cbiAgY29uc3QgZmluYWxpemVyID0gKC4uLl9jaGlsZHJlbikgPT4ge1xuICAgIGNvbnN0IHdyYW5nbGVDaGlsZHJlbiA9IChjaGlsZHJlbikgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuLmZsYXQoSW5maW5pdHkpLm1hcCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmICh2YWx1ZVtVTkZJTklTSEVEX0RFRklOSVRJT05dKVxuICAgICAgICAgIHJldHVybiB2YWx1ZSgpO1xuXG4gICAgICAgIGlmICh2YWx1ZVtVdGlscy5NWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFKVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWVbVXRpbHMuTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICAgICAgICByZXR1cm4gd3JhbmdsZUNoaWxkcmVuKHZhbHVlLmdldFVuZGVybHlpbmdBcnJheSgpKTtcblxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICAgIHJldHVybiBub2RlVG9FbGVtZW50RGVmaW5pdGlvbih2YWx1ZSk7XG5cbiAgICAgICAgaWYgKCFVdGlscy5pc1R5cGUodmFsdWUsICc6OlN0cmluZycsIFV0aWxzLkR5bmFtaWNQcm9wZXJ0eSkpXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbignI3RleHQnLCB7IHZhbHVlOiAoJycgKyB2YWx1ZSkgfSk7XG4gICAgICB9KS5mbGF0KEluZmluaXR5KS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfTtcblxuICAgIGxldCBjaGlsZHJlbiA9IHdyYW5nbGVDaGlsZHJlbihfY2hpbGRyZW4gfHwgW10pO1xuICAgIHJldHVybiBuZXcgRWxlbWVudERlZmluaXRpb24odGFnTmFtZSwgc2NvcGUsIGNoaWxkcmVuKTtcbiAgfTtcblxuICBsZXQgcm9vdFByb3h5ID0gbmV3IFByb3h5KGZpbmFsaXplciwge1xuICAgIGdldDogKHRhcmdldCwgYXR0cmlidXRlTmFtZSkgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09IFVORklOSVNIRURfREVGSU5JVElPTilcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlTmFtZSA9PT0gJ3N5bWJvbCcgfHwgSVNfVEFSR0VUX1BST1AudGVzdChhdHRyaWJ1dGVOYW1lKSlcbiAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgaWYgKCFzY29wZSkge1xuICAgICAgICBsZXQgc2NvcGVkUHJveHkgPSBidWlsZCh0YWdOYW1lLCBkZWZhdWx0QXR0cmlidXRlcywgT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBkZWZhdWx0QXR0cmlidXRlcyB8fCB7fSkpO1xuICAgICAgICByZXR1cm4gc2NvcGVkUHJveHlbYXR0cmlidXRlTmFtZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJveHkoXG4gICAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSBVTkZJTklTSEVEX0RFRklOSVRJT04pXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZU5hbWUgPT09ICdzeW1ib2wnIHx8IElTX1RBUkdFVF9QUk9QLnRlc3QoYXR0cmlidXRlTmFtZSkpXG4gICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgICAgICAgIHNjb3BlW2F0dHJpYnV0ZU5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByb290UHJveHlbcHJvcE5hbWVdO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiByb290UHJveHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlVG9FbGVtZW50RGVmaW5pdGlvbihub2RlKSB7XG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSlcbiAgICByZXR1cm4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWU6ICgnJyArIG5vZGUubm9kZVZhbHVlKSB9KTtcblxuICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgcmV0dXJuO1xuXG4gIGxldCBhdHRyaWJ1dGVzID0ge307XG4gIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgb2Ygbm9kZS5nZXRBdHRyaWJ1dGVOYW1lcygpKVxuICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcblxuICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykubWFwKG5vZGVUb0VsZW1lbnREZWZpbml0aW9uKTtcbiAgcmV0dXJuIG5ldyBFbGVtZW50RGVmaW5pdGlvbihub2RlLnRhZ05hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKTtcbn1cblxuY29uc3QgSVNfVEVNUExBVEUgPSAvXih0ZW1wbGF0ZSkkL2k7XG5cbi8qKlxuICAgKiBwYXJlbnQ6IEVsZW1lbnRzXG4gICAqIGdyb3VwTmFtZTogRWxlbWVudHNcbiAgICogZGVzYzogfFxuICAgKiAgIEFsbW9zdCBsaWtlIGBPYmplY3QuYXNzaWduYCwgbWVyZ2UgYWxsIGNvbXBvbmVudCBjaGlsZHJlbiBpbnRvIGEgc2luZ2xlIG5vZGUgKHRoZSBgdGFyZ2V0YCkuXG4gICAqXG4gICAqICAgVGhpcyBpcyBcInRlbXBsYXRlIGludGVsbGlnZW50XCIsIG1lYW5pbmcgZm9yIGA8dGVtcGxhdGU+YCBlbGVtZW50cyBzcGVjaWZpY2FsbHksIGl0IHdpbGwgZXhlY3V0ZVxuICAgKiAgIGBjaGlsZHJlbiA9IHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXNgIHRvIGNsb25lIGFsbCB0aGUgY2hpbGQgbm9kZXMsIGFuZCBub3RcbiAgICogICBtb2RpZnkgdGhlIG9yaWdpbmFsIHRlbXBsYXRlLiBJdCBpcyBhbHNvIHRlbXBsYXRlIGludGVsbGlnZW50IGJ5IHRoZSBmYWN0IHRoYXQgaWYgdGhlIGB0YXJnZXRgIGlzXG4gICAqICAgYSB0ZW1wbGF0ZSwgaXQgd2lsbCBhZGQgdGhlIGNoaWxkcmVuIHRvIGBjb250ZW50YCBwcm9wZXJseS5cbiAgICogYXJndW1lbnRzOlxuICAgKiAgIC0gbmFtZTogdGFyZ2V0XG4gICAqICAgICBkYXRhVHlwZXM6IE5vZGVcbiAgICogICAgIGRlc2M6IHxcbiAgICogICAgICAgVGhlIHRhcmdldCBOb2RlIHRvIG1lcmdlIGFsbCBjaGlsZHJlbiBpbnRvLiBJZiB0aGlzIE5vZGUgaXMgYSBgPHRlbXBsYXRlPmAgTm9kZSwgdGhlbiBpdCB3aWxsXG4gICAqICAgICAgIHBsYWNlIGFsbCB0aGUgbWVyZ2VkIGNoaWxkcmVuIGludG8gYHRlbXBsYXRlLmNvbnRlbnRgLlxuICAgKiBub3RlczpcbiAgICogICAtIEFueSB0ZW1wbGF0ZSBOb2RlIHdpbGwgYmUgY2xvbmVkLCBhbmQgc28gdGhlIG9yaWdpbmFsIHdpbGwgbm90IGJlIG1vZGlmaWVkLiBBbGwgb3RoZXIgbm9kZXMgYXJlICoqTk9UKipcbiAgICogICAgIGNsb25lZCBiZWZvcmUgdGhlIG1lcmdlLCBhbmQgc28gd2lsbCBiZSBzdHJpcHBlZCBvZiB0aGVpciBjaGlsZHJlbi5cbiAgICogICAtIE1ha2UgY2VydGFpbiB5b3UgZGVlcCBjbG9uZSBhbnkgZWxlbWVudCBmaXJzdCAoZXhjZXB0IHRlbXBsYXRlcykgaWYgeW91IGRvbid0IHdhbnQgdGhlIHByb3ZpZGVkIGVsZW1lbnRzXG4gICAqICAgICB0byBiZSBtb2RpZmllZC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzIE5vZGU7IFRoZSBwcm92aWRlZCBgdGFyZ2V0YCwgd2l0aCBhbGwgY2hpbGRyZW4gbWVyZ2VkIChhZGRlZCkgaW50byBpdC5cbiAgICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VDaGlsZHJlbih0YXJnZXQsIC4uLm90aGVycykge1xuICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSlcbiAgICByZXR1cm4gdGFyZ2V0O1xuXG4gIGxldCB0YXJnZXRJc1RlbXBsYXRlID0gSVNfVEVNUExBVEUudGVzdCh0YXJnZXQudGFnTmFtZSk7XG4gIGZvciAobGV0IG90aGVyIG9mIG90aGVycykge1xuICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICBjb250aW51ZTtcblxuICAgIGxldCBjaGlsZE5vZGVzID0gKElTX1RFTVBMQVRFLnRlc3Qob3RoZXIudGFnTmFtZSkpID8gb3RoZXIuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2RlcyA6IG90aGVyLmNoaWxkTm9kZXM7XG4gICAgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbShjaGlsZE5vZGVzKSkge1xuICAgICAgbGV0IGNvbnRlbnQgPSAoSVNfVEVNUExBVEUudGVzdChjaGlsZC50YWdOYW1lKSkgPyBjaGlsZC5jb250ZW50LmNsb25lTm9kZSh0cnVlKSA6IGNoaWxkO1xuICAgICAgaWYgKHRhcmdldElzVGVtcGxhdGUpXG4gICAgICAgIHRhcmdldC5jb250ZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgSVNfU1ZHX0VMRU1FTlRfTkFNRSA9IC9eKGFsdGdseXBofGFsdGdseXBoZGVmfGFsdGdseXBoaXRlbXxhbmltYXRlfGFuaW1hdGVDb2xvcnxhbmltYXRlTW90aW9ufGFuaW1hdGVUcmFuc2Zvcm18YW5pbWF0aW9ufGNpcmNsZXxjbGlwUGF0aHxjb2xvclByb2ZpbGV8Y3Vyc29yfGRlZnN8ZGVzY3xkaXNjYXJkfGVsbGlwc2V8ZmVibGVuZHxmZWNvbG9ybWF0cml4fGZlY29tcG9uZW50dHJhbnNmZXJ8ZmVjb21wb3NpdGV8ZmVjb252b2x2ZW1hdHJpeHxmZWRpZmZ1c2VsaWdodGluZ3xmZWRpc3BsYWNlbWVudG1hcHxmZWRpc3RhbnRsaWdodHxmZWRyb3BzaGFkb3d8ZmVmbG9vZHxmZWZ1bmNhfGZlZnVuY2J8ZmVmdW5jZ3xmZWZ1bmNyfGZlZ2F1c3NpYW5ibHVyfGZlaW1hZ2V8ZmVtZXJnZXxmZW1lcmdlbm9kZXxmZW1vcnBob2xvZ3l8ZmVvZmZzZXR8ZmVwb2ludGxpZ2h0fGZlc3BlY3VsYXJsaWdodGluZ3xmZXNwb3RsaWdodHxmZXRpbGV8ZmV0dXJidWxlbmNlfGZpbHRlcnxmb250fGZvbnRGYWNlfGZvbnRGYWNlRm9ybWF0fGZvbnRGYWNlTmFtZXxmb250RmFjZVNyY3xmb250RmFjZVVyaXxmb3JlaWduT2JqZWN0fGd8Z2x5cGh8Z2x5cGhSZWZ8aGFuZGxlcnxoS2VybnxpbWFnZXxsaW5lfGxpbmVhcmdyYWRpZW50fGxpc3RlbmVyfG1hcmtlcnxtYXNrfG1ldGFkYXRhfG1pc3NpbmdHbHlwaHxtUGF0aHxwYXRofHBhdHRlcm58cG9seWdvbnxwb2x5bGluZXxwcmVmZXRjaHxyYWRpYWxncmFkaWVudHxyZWN0fHNldHxzb2xpZENvbG9yfHN0b3B8c3ZnfHN3aXRjaHxzeW1ib2x8dGJyZWFrfHRleHR8dGV4dHBhdGh8dHJlZnx0c3Bhbnx1bmtub3dufHVzZXx2aWV3fHZLZXJuKSQvaTtcbmV4cG9ydCBmdW5jdGlvbiBpc1NWR0VsZW1lbnQodGFnTmFtZSkge1xuICByZXR1cm4gSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHRhZ05hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgVGVybSA9ICh2YWx1ZSkgPT4gbmV3IEVsZW1lbnREZWZpbml0aW9uKCcjdGV4dCcsIHsgdmFsdWUgfSk7XG5leHBvcnQgY29uc3QgRWxlbWVudEdlbmVyYXRvciA9IG5ldyBQcm94eShcbiAge1xuICAgIFRlcm0sXG4gICAgJFRFWFQ6IFRlcm0sXG4gIH0sXG4gIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoSVNfU1ZHX0VMRU1FTlRfTkFNRS50ZXN0KHByb3BOYW1lKSkge1xuICAgICAgICAvLyBTVkcgZWxlbWVudHNcbiAgICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lLCB7IG5hbWVzcGFjZVVSSTogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1aWxkKHByb3BOYW1lKTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBOT09QXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9LFxuKTtcbiIsImltcG9ydCBkZWVwTWVyZ2UgIGZyb20gJ2RlZXBtZXJnZSc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuaW1wb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIHJlcXVpcmUsXG59IGZyb20gJy4vY29tcG9uZW50cy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSUxhbmd1YWdlUGFjayBleHRlbmRzIE15dGhpeFVJQ29tcG9uZW50IHtcbiAgc3RhdGljIHRhZ05hbWUgPSAnbXl0aGl4LWxhbmd1YWdlLXBhY2snO1xuXG4gIGNyZWF0ZVNoYWRvd0RPTSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBzZXQgYXR0ciRkYXRhTXl0aGl4U3JjKFsgdmFsdWUgXSkge1xuICAgIC8vIE5PT1AuLi4gVHJhcCB0aGlzIGJlY2F1c2Ugd2VcbiAgICAvLyBkb24ndCB3YW50IHRvIGxvYWQgYSBwYXJ0aWFsIGhlcmVcbiAgfVxuXG4gIG9uTXV0YXRpb25BZGRlZChtdXRhdGlvbikge1xuICAgIC8vIFdoZW4gYWRkZWQgdG8gdGhlIERPTSwgZW5zdXJlIHRoYXQgd2Ugd2VyZVxuICAgIC8vIGFkZGVkIHRvIHRoZSByb290IG9mIGEgbGFuZ3VhZ2UgcHJvdmlkZXIuLi5cbiAgICAvLyBJZiBub3QsIHRoZW4gbW92ZSBvdXJzZWx2ZXMgdG8gdGhlIHJvb3RcbiAgICAvLyBvZiB0aGUgbGFuZ3VhZ2UgcHJvdmlkZXIuXG4gICAgbGV0IHBhcmVudExhbmd1YWdlUHJvdmlkZXIgPSB0aGlzLmNsb3Nlc3QoJ215dGhpeC1sYW5ndWFnZS1wcm92aWRlcicpO1xuICAgIGlmIChwYXJlbnRMYW5ndWFnZVByb3ZpZGVyICYmIHBhcmVudExhbmd1YWdlUHJvdmlkZXIgIT09IG11dGF0aW9uLnRhcmdldClcbiAgICAgIFV0aWxzLm5leHRUaWNrKCgpID0+IHBhcmVudExhbmd1YWdlUHJvdmlkZXIuaW5zZXJ0QmVmb3JlKHRoaXMsIHBhcmVudExhbmd1YWdlUHJvdmlkZXIuZmlyc3RDaGlsZCkpO1xuICB9XG59XG5cbmNvbnN0IElTX0pTT05fRU5DVFlQRSAgICAgICAgICAgICAgICAgPSAvXmFwcGxpY2F0aW9uXFwvanNvbi9pO1xuY29uc3QgTEFOR1VBR0VfUEFDS19JTlNFUlRfR1JBQ0VfVElNRSA9IDUwO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyIGV4dGVuZHMgTXl0aGl4VUlDb21wb25lbnQge1xuICBzdGF0aWMgdGFnTmFtZSA9ICdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInO1xuXG4gIHNldCBhdHRyJGxhbmcoWyBuZXdWYWx1ZSwgb2xkVmFsdWUgXSkge1xuICAgIHRoaXMubG9hZEFsbExhbmd1YWdlUGFja3NGb3JMYW5ndWFnZShuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgb25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSkge1xuICAgIGlmIChub2RlLmxvY2FsTmFtZSA9PT0gJ215dGhpeC1sYW5ndWFnZS1wYWNrJykge1xuICAgICAgdGhpcy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIC8vIFJlbG9hZCBsYW5ndWFnZSBwYWNrcyBhZnRlciBhZGRpdGlvbnNcbiAgICAgICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrc0Zvckxhbmd1YWdlKHRoaXMuZ2V0Q3VycmVudExvY2FsZSgpKTtcbiAgICAgIH0sIExBTkdVQUdFX1BBQ0tfSU5TRVJUX0dSQUNFX1RJTUUsICdyZWxvYWRMYW5ndWFnZVBhY2tzJyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICd0ZXJtcyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpMThuKF9wYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBsZXQgcGF0aCAgICA9IGBnbG9iYWwuaTE4bi4ke19wYXRofWA7XG4gICAgbGV0IHJlc3VsdCAgPSBVdGlscy5mZXRjaFBhdGgodGhpcy50ZXJtcywgcGF0aCk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwpXG4gICAgICByZXR1cm4gVXRpbHMuZ2V0RHluYW1pY1Byb3BlcnR5Rm9yUGF0aC5jYWxsKHRoaXMsIHBhdGgsIChkZWZhdWx0VmFsdWUgPT0gbnVsbCkgPyAnJyA6IGRlZmF1bHRWYWx1ZSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q3VycmVudExvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KS5jaGlsZE5vZGVzWzFdLmdldEF0dHJpYnV0ZSgnbGFuZycpIHx8ICdlbic7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIHN1cGVyLm1vdW50ZWQoKTtcblxuICAgIGlmICghdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSlcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdsYW5nJywgKHRoaXMub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCkuY2hpbGROb2Rlc1sxXS5nZXRBdHRyaWJ1dGUoJ2xhbmcnKSB8fCAnZW4nKTtcbiAgfVxuXG4gIGNyZWF0ZVNoYWRvd0RPTSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBnZXRDb21wb25lbnRUZW1wbGF0ZSgpIHtcbiAgICAvLyBOT09QXG4gIH1cblxuICBnZXRTb3VyY2VzRm9yTGFuZyhsYW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KGBteXRoaXgtbGFuZ3VhZ2UtcGFja1tsYW5nXj1cIiR7bGFuZy5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyl9XCJdYCk7XG4gIH1cblxuICBsb2FkQWxsTGFuZ3VhZ2VQYWNrc0Zvckxhbmd1YWdlKF9sYW5nKSB7XG4gICAgbGV0IGxhbmcgICAgICAgICAgICA9IF9sYW5nIHx8ICdlbic7XG4gICAgbGV0IHNvdXJjZUVsZW1lbnRzICA9IHRoaXMuZ2V0U291cmNlc0ZvckxhbmcobGFuZykuZmlsdGVyKChzb3VyY2VFbGVtZW50KSA9PiBVdGlscy5pc05vdE5PRShzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpKTtcbiAgICBpZiAoIXNvdXJjZUVsZW1lbnRzIHx8ICFzb3VyY2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogTm8gXCJteXRoaXgtbGFuZ3VhZ2UtcGFja1wiIHRhZyBmb3VuZCBmb3Igc3BlY2lmaWVkIGxhbmd1YWdlIFwiJHtsYW5nfVwiYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cyk7XG4gIH1cblxuICBhc3luYyBsb2FkQWxsTGFuZ3VhZ2VQYWNrcyhsYW5nLCBzb3VyY2VFbGVtZW50cykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgcHJvbWlzZXMgID0gc291cmNlRWxlbWVudHMubWFwKChzb3VyY2VFbGVtZW50KSA9PiB0aGlzLmxvYWRMYW5ndWFnZVBhY2sobGFuZywgc291cmNlRWxlbWVudCkpO1xuICAgICAgbGV0IGFsbFRlcm1zICA9IChhd2FpdCBQcm9taXNlLmFsbFNldHRsZWQocHJvbWlzZXMpKS5tYXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ2Z1bGZpbGxlZCcpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gICAgICB9KS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgIGxldCB0ZXJtcyAgICAgICAgID0gZGVlcE1lcmdlLmFsbChBcnJheS5mcm9tKG5ldyBTZXQoYWxsVGVybXMpKSk7XG4gICAgICBsZXQgY29tcGlsZWRUZXJtcyA9IHRoaXMuY29tcGlsZUxhbmd1YWdlVGVybXMobGFuZywgdGVybXMpO1xuXG4gICAgICB0aGlzLnRlcm1zID0gY29tcGlsZWRUZXJtcztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignXCJteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXJcIjogRmFpbGVkIHRvIGxvYWQgbGFuZ3VhZ2UgcGFja3MnLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZExhbmd1YWdlUGFjayhsYW5nLCBzb3VyY2VFbGVtZW50KSB7XG4gICAgbGV0IHNyYyA9IHNvdXJjZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBpZiAoIXNyYylcbiAgICAgIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgeyByZXNwb25zZSB9ICA9IGF3YWl0IHJlcXVpcmUuY2FsbCh0aGlzLCBzcmMsIHsgb3duZXJEb2N1bWVudDogdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50IH0pO1xuICAgICAgbGV0IHR5cGUgICAgICAgICAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZW5jdHlwZScpIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgIGlmIChJU19KU09OX0VOQ1RZUEUudGVzdCh0eXBlKSkge1xuICAgICAgICAvLyBIYW5kbGUgSlNPTlxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IFR5cGVFcnJvcihgRG9uJ3Qga25vdyBob3cgdG8gbG9hZCBhIGxhbmd1YWdlIHBhY2sgb2YgdHlwZSBcIiR7dHlwZX1cImApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcIm15dGhpeC1sYW5ndWFnZS1wcm92aWRlclwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlTGFuZ3VhZ2VUZXJtcyhsYW5nLCB0ZXJtcykge1xuICAgIGNvbnN0IHdhbGtUZXJtcyA9ICh0ZXJtcywgcmF3S2V5UGF0aCkgPT4ge1xuICAgICAgbGV0IGtleXMgICAgICA9IE9iamVjdC5rZXlzKHRlcm1zKTtcbiAgICAgIGxldCB0ZXJtc0NvcHkgPSB7fTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGlsID0ga2V5cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgICAgICAgICA9IGtleXNbaV07XG4gICAgICAgIGxldCB2YWx1ZSAgICAgICA9IHRlcm1zW2tleV07XG4gICAgICAgIGxldCBuZXdLZXlQYXRoICA9IHJhd0tleVBhdGguY29uY2F0KGtleSk7XG5cbiAgICAgICAgaWYgKFV0aWxzLmlzUGxhaW5PYmplY3QodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgdGVybXNDb3B5W2tleV0gPSB3YWxrVGVybXModmFsdWUsIG5ld0tleVBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eSA9IFV0aWxzLmdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGguY2FsbCh0aGlzLCBuZXdLZXlQYXRoLmpvaW4oJy4nKSwgdmFsdWUpO1xuICAgICAgICAgIHRlcm1zQ29weVtrZXldID0gcHJvcGVydHk7XG4gICAgICAgICAgcHJvcGVydHlbVXRpbHMuRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXJtc0NvcHk7XG4gICAgfTtcblxuICAgIHJldHVybiB3YWxrVGVybXModGVybXMsIFsgJ2dsb2JhbCcsICdpMThuJyBdKTtcbiAgfVxufVxuXG5NeXRoaXhVSUxhbmd1YWdlUGFjay5yZWdpc3RlcigpO1xuTXl0aGl4VUlMYW5ndWFnZVByb3ZpZGVyLnJlZ2lzdGVyKCk7XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5NeXRoaXhVSUxhbmd1YWdlUGFjayA9IE15dGhpeFVJTGFuZ3VhZ2VQYWNrO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5NeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXIgPSBNeXRoaXhVSUxhbmd1YWdlUHJvdmlkZXI7XG4iLCJpbXBvcnQgKiBhcyBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuY29uc3QgSVNfVEVNUExBVEUgICAgICAgPSAvXih0ZW1wbGF0ZSkkL2k7XG5jb25zdCBURU1QTEFURV9URU1QTEFURSA9IC9eKFxcKnxcXHxcXCp8XFwqXFx8KSQvO1xuXG5leHBvcnQgY2xhc3MgTXl0aGl4VUlSZXF1aXJlIGV4dGVuZHMgQ29tcG9uZW50Lk15dGhpeFVJQ29tcG9uZW50IHtcbiAgYXN5bmMgbW91bnRlZCgpIHtcbiAgICBzdXBlci5tb3VudGVkKCk7XG5cbiAgICBsZXQgc3JjID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB7XG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVybCxcbiAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIGNhY2hlZCxcbiAgICAgIH0gPSBhd2FpdCBDb21wb25lbnQucmVxdWlyZS5jYWxsKFxuICAgICAgICB0aGlzLFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICBtYWdpYzogICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBvd25lckRvY3VtZW50OiAgdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50LFxuICAgICAgICB9LFxuICAgICAgKTtcblxuICAgICAgaWYgKGNhY2hlZClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgYm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgIENvbXBvbmVudC5pbXBvcnRJbnRvRG9jdW1lbnRGcm9tU291cmNlLmNhbGwoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG93bmVyRG9jdW1lbnQsXG4gICAgICAgIG93bmVyRG9jdW1lbnQubG9jYXRpb24sXG4gICAgICAgIHVybCxcbiAgICAgICAgYm9keSxcbiAgICAgICAge1xuICAgICAgICAgIG1hZ2ljOiAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBub2RlSGFuZGxlcjogIChub2RlLCB7IGlzSGFuZGxlZCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzSGFuZGxlZCAmJiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSlcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByZVByb2Nlc3M6ICAgKHsgdGVtcGxhdGUsIGNoaWxkcmVuIH0pID0+IHtcbiAgICAgICAgICAgIGxldCBzdGFyVGVtcGxhdGUgPSBjaGlsZHJlbi5maW5kKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICBsZXQgZGF0YUZvciA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpICYmIFRFTVBMQVRFX1RFTVBMQVRFLnRlc3QoZGF0YUZvcikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIGxldCBkYXRhRm9yID0gc3RhclRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS1mb3InKTtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gc3RhclRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIGlmIChJU19URU1QTEFURS50ZXN0KGNoaWxkLnRhZ05hbWUpKSB7IC8vIDx0ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICBsZXQgc3RhckNsb25lID0gc3RhclRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhRm9yID09PSAnKnwnKVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5pbnNlcnRCZWZvcmUoc3RhckNsb25lLCBjaGlsZC5jb250ZW50LmNoaWxkTm9kZXNbMF0gfHwgbnVsbCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGVudC5hcHBlbmRDaGlsZChzdGFyQ2xvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXJUZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0YXJUZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgXCJteXRoaXgtcmVxdWlyZVwiOiBGYWlsZWQgdG8gbG9hZCBzcGVjaWZpZWQgcmVzb3VyY2U6ICR7c3JjfWAsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaFNyYygpIHtcbiAgICAvLyBOT09QXG4gIH1cbn1cblxuKGdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSkpLk15dGhpeFVJUmVxdWlyZSA9IE15dGhpeFVJUmVxdWlyZTtcblxuaWYgKHR5cGVvZiBjdXN0b21FbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgIWN1c3RvbUVsZW1lbnRzLmdldCgnbXl0aGl4LXJlcXVpcmUnKSlcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteXRoaXgtcmVxdWlyZScsIE15dGhpeFVJUmVxdWlyZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1tYWdpYy1udW1iZXJzICovXG5cbmltcG9ydCB7IE15dGhpeFVJQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzLmpzJztcblxuLypcbk1hbnkgdGhhbmtzIHRvIFNhZ2VlIENvbndheSBmb3IgdGhlIGZvbGxvd2luZyBDU1Mgc3Bpbm5lcnNcbmh0dHBzOi8vY29kZXBlbi5pby9zYWNvbndheS9wZW4vdllLWXlyeFxuKi9cblxuY29uc3QgU1RZTEVfU0hFRVQgPVxuYFxuOmhvc3Qge1xuICAtLW15dGhpeC1zcGlubmVyLXNpemU6IDFlbTtcbiAgd2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuOmhvc3QoLnNtYWxsKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2l6ZTogY2FsYygxZW0gKiAwLjc1KTtcbn1cbjpob3N0KC5tZWRpdW0pIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDEuNSk7XG59XG46aG9zdCgubGFyZ2UpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zaXplOiBjYWxjKDFlbSAqIDMpO1xufVxuLnNwaW5uZXItaXRlbSxcbi5zcGlubmVyLWl0ZW06OmJlZm9yZSxcbi5zcGlubmVyLWl0ZW06OmFmdGVyIHtcblx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW0ge1xuICB3aWR0aDogMTElO1xuICBoZWlnaHQ6IDYwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBlYXNlLWluLW91dCBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItYXVkaW8tYW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjI1KTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMyk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwiYXVkaW9cIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAvIDEwICogLTIpO1xufVxuOmhvc3QoW2tpbmQ9XCJhdWRpb1wiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoNCkge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yNCwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpIC8gMTAgKiAtMSk7XG59XG46aG9zdChba2luZD1cImF1ZGlvXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgLyAxMCAqIC0zKTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpICogMC4wNzUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHRvcDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpIC8gMik7XG4gIGxlZnQ6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKSAvIDIpO1xuICBib3JkZXI6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpIHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItbGVmdDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItY2lyY2xlLXRoaWNrbmVzcykgc29saWQgdmFyKC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24ge1xuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJjaXJjbGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLW9mLXR5cGUoMSkge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDEuMCk7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGJvcmRlci10b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWNpcmNsZS10aGlja25lc3MpICogMC4wNzUpIHNvbGlkIHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMSwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLWNpcmNsZS1hbmltYXRpb24gY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjcpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItYm90dG9tOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC44NzUpIGxpbmVhciBpbmZpbml0ZTtcbn1cbjpob3N0KFtraW5kPVwiY2lyY2xlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1vZi10eXBlKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemU6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjQpO1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBib3JkZXItdG9wOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1jaXJjbGUtdGhpY2tuZXNzKSBzb2xpZCB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci1jaXJjbGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMC43NSkgbGluZWFyIGluZmluaXRlO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIHtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAqIDAuMSkpIHJvdGF0ZSg0NWRlZyk7XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplOiBjYWxjKHZhcigtLW15dGhpeC1zcGlubmVyLXNpemUpIC8gMi41KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItaXRlbS1zaXplKTtcbiAgaGVpZ2h0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBib3JkZXI6IGNhbGModmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgKiAwLjEpIHNvbGlkIHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24xIHtcbiAgMCUsIDguMzMlLCAxNi42NiUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMjQuOTklLCAzMy4zMiUsIDQxLjY1JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTAwJSwgMCUpO1xuICB9XG4gIDQ5Ljk4JSwgNTguMzElLCA2Ni42NCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDEwMCUsIDEwMCUpO1xuICB9XG4gIDc0Ljk3JSwgODMuMzAlLCA5MS42MyUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAxMDAlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJwdXp6bGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDIpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjIsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgdG9wOiAwO1xuICBsZWZ0OiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogNS4wKSBsaW5lYXIgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXB1enpsZS1hbmltYXRpb24yIHtcbiAgMCUsIDguMzMlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAlLCAwJSk7XG4gIH1cbiAgMTYuNjYlLCAyNC45OSUsIDMzLjMyJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCUsIDEwMCUpO1xuICB9XG4gIDQxLjY1JSwgNDkuOTglLCA1OC4zMSUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAxMDAlKTtcbiAgfVxuICA2Ni42NCUsIDc0Ljk3JSwgODMuMzAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMTAwJSwgMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cInB1enpsZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICB0b3A6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGxlZnQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMgY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiA1LjApIGxpbmVhciBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgbXl0aGl4LXNwaW5uZXItcHV6emxlLWFuaW1hdGlvbjMge1xuICAwJSwgODMuMzAlLCA5MS42MyUsIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDApO1xuICB9XG4gIDguMzMlLCAxNi42NiUsIDI0Ljk5JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMCUsIDApO1xuICB9XG4gIDMzLjMyJSwgNDEuNjUlLCA0OS45OCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0xMDAlLCAtMTAwJSk7XG4gIH1cbiAgNTguMzElLCA2Ni42NCUsIDc0Ljk3JSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgLTEwMCUpO1xuICB9XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW0ge1xuICAtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZTogY2FsYyh2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDQpO1xuICBtaW4td2lkdGg6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIHdpZHRoOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1pdGVtLXNpemUpO1xuICBoZWlnaHQ6IHZhcigtLW15dGhpeC1zcGlubmVyLWl0ZW0tc2l6ZSk7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYm9yZGVyOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yKTtcbiAgYW5pbWF0aW9uOiBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIGVhc2UtaW4tb3V0IGluZmluaXRlO1xufVxuQGtleWZyYW1lcyBteXRoaXgtc3Bpbm5lci13YXZlLWFuaW1hdGlvbiB7XG4gIDAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNzUlKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNzUlKTtcbiAgfVxufVxuOmhvc3QoW2tpbmQ9XCJ3YXZlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gNiAqIC0xKTtcbn1cbjpob3N0KFtraW5kPVwid2F2ZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDYgKiAtMik7XG59XG46aG9zdChba2luZD1cIndhdmVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDMpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjMsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyA2ICogLTMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgd2lkdGg6IDExJTtcbiAgaGVpZ2h0OiA0MCU7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBhbmltYXRpb246IG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLXBpcGUtYW5pbWF0aW9uIHtcbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgyKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xuICB9XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDEpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjEsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMikge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMiwgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwKTtcbn1cbjpob3N0KFtraW5kPVwicGlwZVwiXSkgLnNwaW5uZXItaXRlbTpudGgtY2hpbGQoMykge1xuICAtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3I6IHZhcigtLXRoZW1lLW15dGhpeC1zcGlubmVyLWNvbG9yMywgdmFyKC0tdGhlbWUtcHJpbWFyeS1jb2xvciwgIzMzMykpO1xuICBhbmltYXRpb24tZGVsYXk6IGNhbGMoY2FsYyh2YXIoLS10aGVtZS1hbmltYXRpb24tZHVyYXRpb24sIDEwMDBtcykgKiAxLjE1KSAvIDEwICogMik7XG59XG46aG9zdChba2luZD1cInBpcGVcIl0pIC5zcGlubmVyLWl0ZW06bnRoLWNoaWxkKDQpIHtcbiAgLS1teXRoaXgtc3Bpbm5lci1zZWdtZW50LWNvbG9yOiB2YXIoLS10aGVtZS1teXRoaXgtc3Bpbm5lci1jb2xvcjQsIHZhcigtLXRoZW1lLXByaW1hcnktY29sb3IsICMzMzMpKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiBjYWxjKGNhbGModmFyKC0tdGhlbWUtYW5pbWF0aW9uLWR1cmF0aW9uLCAxMDAwbXMpICogMS4xNSkgLyAxMCAqIDMpO1xufVxuOmhvc3QoW2tpbmQ9XCJwaXBlXCJdKSAuc3Bpbm5lci1pdGVtOm50aC1jaGlsZCg1KSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3I1LCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDEuMTUpIC8gMTAgKiA0KTtcbn1cbjpob3N0KFtraW5kPVwiZG90XCJdKSAuc3Bpbm5lci1pdGVtIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IGNhbGMoNTAlIC0gdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSkgLyAyKTtcbiAgbGVmdDogY2FsYyg1MCUgLSB2YXIoLS1teXRoaXgtc3Bpbm5lci1zaXplKSAvIDIpO1xuICB3aWR0aDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGhlaWdodDogdmFyKC0tbXl0aGl4LXNwaW5uZXItc2l6ZSk7XG4gIGJhY2tncm91bmQ6IHZhcigtLW15dGhpeC1zcGlubmVyLXNlZ21lbnQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogbXl0aGl4LXNwaW5uZXItZG90LWFuaW1hdGlvbiBjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5Aa2V5ZnJhbWVzIG15dGhpeC1zcGlubmVyLWRvdC1hbmltYXRpb24ge1xuICAwJSwgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjI1KTtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgxKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IxLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG59XG46aG9zdChba2luZD1cImRvdFwiXSkgLnNwaW5uZXItaXRlbTpudGgtb2YtdHlwZSgyKSB7XG4gIC0tbXl0aGl4LXNwaW5uZXItc2VnbWVudC1jb2xvcjogdmFyKC0tdGhlbWUtbXl0aGl4LXNwaW5uZXItY29sb3IyLCB2YXIoLS10aGVtZS1wcmltYXJ5LWNvbG9yLCAjMzMzKSk7XG4gIGFuaW1hdGlvbi1kZWxheTogY2FsYyhjYWxjKHZhcigtLXRoZW1lLWFuaW1hdGlvbi1kdXJhdGlvbiwgMTAwMG1zKSAqIDMuMCkgLyAtMik7XG59XG5gO1xuXG5jb25zdCBLSU5EUyA9IHtcbiAgJ2F1ZGlvJzogIDUsXG4gICdjaXJjbGUnOiAzLFxuICAnZG90JzogICAgMixcbiAgJ3BpcGUnOiAgIDUsXG4gICdwdXp6bGUnOiAzLFxuICAnd2F2ZSc6ICAgMyxcbn07XG5cbmV4cG9ydCBjbGFzcyBNeXRoaXhVSVNwaW5uZXIgZXh0ZW5kcyBNeXRoaXhVSUNvbXBvbmVudCB7XG4gIHN0YXRpYyB0YWdOYW1lID0gJ215dGhpeC1zcGlubmVyJztcblxuICBzZXQgYXR0ciRraW5kKFsgbmV3VmFsdWUgXSkge1xuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShuZXdWYWx1ZSk7XG4gIH1cblxuICBtb3VudGVkKCkge1xuICAgIHN1cGVyLm1vdW50ZWQoKTtcblxuICAgIGlmICghdGhpcy5kb2N1bWVudEluaXRpYWxpemVkKSB7XG4gICAgICAvLyBhcHBlbmQgdGVtcGxhdGVcbiAgICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgdGhpcy4kYnVpbGQoKHsgVEVNUExBVEUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gVEVNUExBVEVcbiAgICAgICAgICAuZGF0YU15dGhpeE5hbWUodGhpcy5zZW5zaXRpdmVUYWdOYW1lKVxuICAgICAgICAgIC5wcm9wJGlubmVySFRNTChgPHN0eWxlPiR7U1RZTEVfU0hFRVR9PC9zdHlsZT5gKTtcbiAgICAgIH0pLmFwcGVuZFRvKG93bmVyRG9jdW1lbnQuYm9keSk7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldENvbXBvbmVudFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLmFwcGVuZFRlbXBsYXRlVG9TaGFkb3dET00odGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGxldCBraW5kID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2tpbmQnKTtcbiAgICBpZiAoIWtpbmQpIHtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgna2luZCcsIGtpbmQpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2luZEF0dHJpYnV0ZUNoYW5nZShraW5kKTtcbiAgfVxuXG4gIGhhbmRsZUtpbmRBdHRyaWJ1dGVDaGFuZ2UoX2tpbmQpIHtcbiAgICBsZXQga2luZCAgICAgICAgPSAoJycgKyBfa2luZCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChLSU5EUywga2luZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgXCJteXRoaXgtc3Bpbm5lclwiIHVua25vd24gXCJraW5kXCIgcHJvdmlkZWQ6IFwiJHtraW5kfVwiLiBTdXBwb3J0ZWQgXCJraW5kXCIgYXR0cmlidXRlIHZhbHVlcyBhcmU6IFwicGlwZVwiLCBcImF1ZGlvXCIsIFwiY2lyY2xlXCIsIFwicHV6emxlXCIsIFwid2F2ZVwiLCBhbmQgXCJkb3RcIi5gKTtcbiAgICAgIGtpbmQgPSAncGlwZSc7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VTcGlubmVyQ2hpbGRyZW4oS0lORFNba2luZF0pO1xuICB9XG5cbiAgYnVpbGRTcGlubmVyQ2hpbGRyZW4oY291bnQpIHtcbiAgICBsZXQgY2hpbGRyZW4gICAgICA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgbGV0IG93bmVyRG9jdW1lbnQgPSAodGhpcy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXItaXRlbScpO1xuXG4gICAgICBjaGlsZHJlbltpXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KGNoaWxkcmVuKTtcbiAgfVxuXG4gIGNoYW5nZVNwaW5uZXJDaGlsZHJlbihjb3VudCkge1xuICAgIHRoaXMuc2VsZWN0KCcuc3Bpbm5lci1pdGVtJykucmVtb3ZlKCk7XG4gICAgdGhpcy5idWlsZFNwaW5uZXJDaGlsZHJlbihjb3VudCkuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBzdHlsZSBhZ2Fpbiwgc29cbiAgICAvLyB0aGF0IGl0IGlzIHRoZSBsYXN0IGNoaWxkLCBhbmRcbiAgICAvLyBkb2Vzbid0IG1lc3Mgd2l0aCBcIm50aC1jaGlsZFwiXG4gICAgLy8gc2VsZWN0b3JzXG4gICAgdGhpcy5zZWxlY3QoJ3N0eWxlJykuYXBwZW5kVG8odGhpcy5zaGFkb3cpO1xuICB9XG59XG5cbk15dGhpeFVJU3Bpbm5lci5yZWdpc3RlcigpO1xuXG4oZ2xvYmFsVGhpcy5teXRoaXhVSSA9IChnbG9iYWxUaGlzLm15dGhpeFVJIHx8IHt9KSkuTXl0aGl4VUlSZXF1aXJlID0gTXl0aGl4VUlTcGlubmVyO1xuIiwiaW1wb3J0ICogYXMgVXRpbHMgICAgIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRWxlbWVudHMgIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50RGVmaW5pdGlvbixcbiAgVU5GSU5JU0hFRF9ERUZJTklUSU9OLFxufSBmcm9tICcuL2VsZW1lbnRzLmpzJztcblxuY29uc3QgSVNfSU5URUdFUiA9IC9eXFxkKyQvO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gV2UgaGF2ZSBhbiBFbGVtZW50IG9yIGEgRG9jdW1lbnRcbiAgaWYgKHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSB8fCB2YWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8IHZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1Nsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xvc2VzdCgnc2xvdCcpO1xufVxuXG5mdW5jdGlvbiBpc05vdFNsb3R0ZWQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICFlbGVtZW50LmNsb3Nlc3QoJ3Nsb3QnKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENsYXNzTmFtZXMoLi4uYXJncykge1xuICBsZXQgY2xhc3NOYW1lcyA9IFtdLmNvbmNhdCguLi5hcmdzKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAubWFwKChwYXJ0KSA9PiAoJycgKyBwYXJ0KS5zcGxpdCgvXFxzKy8pKVxuICAgICAgLmZsYXQoSW5maW5pdHkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBjbGFzc05hbWVzO1xufVxuXG5leHBvcnQgY29uc3QgUVVFUllfRU5HSU5FX1RZUEUgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS90eXBlcy9NeXRoaXhVSTo6UXVlcnlFbmdpbmUnKTtcblxuZXhwb3J0IGNsYXNzIFF1ZXJ5RW5naW5lIHtcbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoaW5zdGFuY2UgJiYgaW5zdGFuY2VbVXRpbHMuTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0VsZW1lbnQgICAgPSBpc0VsZW1lbnQ7XG4gIHN0YXRpYyBpc1Nsb3R0ZWQgICAgPSBpc1Nsb3R0ZWQ7XG4gIHN0YXRpYyBpc05vdFNsb3R0ZWQgPSBpc05vdFNsb3R0ZWQ7XG5cbiAgc3RhdGljIGZyb20gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIG5ldyBRdWVyeUVuZ2luZShbXSwgeyByb290OiAoaXNFbGVtZW50KHRoaXMpKSA/IHRoaXMgOiBkb2N1bWVudCwgY29udGV4dDogdGhpcyB9KTtcblxuICAgIGNvbnN0IGdldE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBsZXQgYmFzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBpZiAoVXRpbHMuaXNQbGFpbk9iamVjdChhcmdzW2FyZ0luZGV4XSkpXG4gICAgICAgIGJhc2UgPSBPYmplY3QuYXNzaWduKGJhc2UsIGFyZ3NbYXJnSW5kZXgrK10pO1xuXG4gICAgICBpZiAoYXJnc1thcmdJbmRleF0gaW5zdGFuY2VvZiBRdWVyeUVuZ2luZSlcbiAgICAgICAgYmFzZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgYXJnc1thcmdJbmRleF0uZ2V0T3B0aW9ucygpIHx8IHt9LCBiYXNlKTtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldFJvb3RFbGVtZW50ID0gKG9wdGlvbnNSb290KSA9PiB7XG4gICAgICBpZiAoaXNFbGVtZW50KG9wdGlvbnNSb290KSlcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNSb290O1xuXG4gICAgICBpZiAoaXNFbGVtZW50KHRoaXMpKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgcmV0dXJuICgodGhpcyAmJiB0aGlzLm93bmVyRG9jdW1lbnQpIHx8IGRvY3VtZW50KTtcbiAgICB9O1xuXG4gICAgbGV0IGFyZ0luZGV4ICA9IDA7XG4gICAgbGV0IG9wdGlvbnMgICA9IGdldE9wdGlvbnMoKTtcbiAgICBsZXQgcm9vdCAgICAgID0gZ2V0Um9vdEVsZW1lbnQob3B0aW9ucy5yb290KTtcbiAgICBsZXQgcXVlcnlFbmdpbmU7XG5cbiAgICBvcHRpb25zLnJvb3QgPSByb290O1xuICAgIG9wdGlvbnMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCB8fCB0aGlzO1xuXG4gICAgaWYgKGFyZ3NbYXJnSW5kZXhdIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICByZXR1cm4gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLnNsaWNlKCksIG9wdGlvbnMpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1thcmdJbmRleF0pKSB7XG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXggKyAxXSwgJzo6RnVuY3Rpb24nKSlcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbMV07XG5cbiAgICAgIHF1ZXJ5RW5naW5lID0gbmV3IFF1ZXJ5RW5naW5lKGFyZ3NbYXJnSW5kZXhdLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6U3RyaW5nJykpIHtcbiAgICAgIG9wdGlvbnMuc2VsZWN0b3IgPSBhcmdzW2FyZ0luZGV4KytdO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGFyZ3NbYXJnSW5kZXhdLCAnOjpGdW5jdGlvbicpKVxuICAgICAgICBvcHRpb25zLmNhbGxiYWNrID0gYXJnc1thcmdJbmRleCsrXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocm9vdC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IpLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKFV0aWxzLmlzVHlwZShhcmdzW2FyZ0luZGV4XSwgJzo6RnVuY3Rpb24nKSkge1xuICAgICAgb3B0aW9ucy5jYWxsYmFjayA9IGFyZ3NbYXJnSW5kZXgrK107XG5cbiAgICAgIGxldCByZXN1bHQgPSBvcHRpb25zLmNhbGxiYWNrLmNhbGwodGhpcywgRWxlbWVudHMuRWxlbWVudEdlbmVyYXRvciwgb3B0aW9ucyk7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzdWx0KSlcbiAgICAgICAgcmVzdWx0ID0gWyByZXN1bHQgXTtcblxuICAgICAgcXVlcnlFbmdpbmUgPSBuZXcgUXVlcnlFbmdpbmUocmVzdWx0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5pbnZva2VDYWxsYmFja3MgIT09IGZhbHNlICYmIHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHF1ZXJ5RW5naW5lLm1hcChvcHRpb25zLmNhbGxiYWNrKTtcblxuICAgIHJldHVybiBxdWVyeUVuZ2luZTtcbiAgfTtcblxuICBnZXRFbmdpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gUXVlcnlFbmdpbmU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgX29wdGlvbnMpIHtcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW1V0aWxzLk1ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBRVUVSWV9FTkdJTkVfVFlQRSxcbiAgICAgIH0sXG4gICAgICAnX215dGhpeFVJT3B0aW9ucyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBvcHRpb25zLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICdfbXl0aGl4VUlFbGVtZW50cyc6IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICB0aGlzLmZpbHRlckFuZENvbnN0cnVjdEVsZW1lbnRzKG9wdGlvbnMuY29udGV4dCwgZWxlbWVudHMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCByb290UHJveHkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wTmFtZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BOYW1lID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQuX215dGhpeFVJRWxlbWVudHMpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzW3Byb3BOYW1lXTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2xlbmd0aCcpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAncHJvdG90eXBlJylcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjb25zdHJ1Y3RvcicpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5jb25zdHJ1Y3RvcjtcblxuICAgICAgICAvLyBJbmRleCBsb29rdXBcbiAgICAgICAgaWYgKElTX0lOVEVHRVIudGVzdChwcm9wTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5fbXl0aGl4VUlFbGVtZW50c1twcm9wTmFtZV07XG5cbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXTtcblxuICAgICAgICAvLyBSZWRpcmVjdCBhbnkgYXJyYXkgbWV0aG9kczpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gXCJtYWdpY1Byb3BOYW1lXCIgaXMgd2hlbiB0aGVcbiAgICAgICAgLy8gZnVuY3Rpb24gbmFtZSBiZWdpbnMgd2l0aCBcIiRcIixcbiAgICAgICAgLy8gaS5lLiBcIiRmaWx0ZXJcIiwgb3IgXCIkbWFwXCIuIElmXG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNhc2UsIHRoZW4gdGhlIHJldHVyblxuICAgICAgICAvLyB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBjb2VyY2VkIGludG9cbiAgICAgICAgLy8gYSBRdWVyeUVuZ2luZS4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICAgICAgIC8vIG9ubHkgYmUgY29lcmNlZCBpbnRvIGEgUXVlcnlFbmdpbmVcbiAgICAgICAgLy8gaWYgRVZFUlkgZWxlbWVudCBpbiB0aGUgcmVzdWx0IGlzXG4gICAgICAgIC8vIGFuIFwiZWxlbWVudHlcIiB0eXBlIHZhbHVlLlxuICAgICAgICBsZXQgbWFnaWNQcm9wTmFtZSA9IChwcm9wTmFtZS5jaGFyQXQoMCkgPT09ICckJykgPyBwcm9wTmFtZS5zdWJzdHJpbmcoMSkgOiBwcm9wTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGVbbWFnaWNQcm9wTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGxldCBhcnJheSAgID0gdGFyZ2V0Ll9teXRoaXhVSUVsZW1lbnRzO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCAgPSBhcnJheVttYWdpY1Byb3BOYW1lXSguLi5hcmdzKTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSAmJiAobWFnaWNQcm9wTmFtZSAhPT0gcHJvcE5hbWUgfHwgcmVzdWx0LmV2ZXJ5KChpdGVtKSA9PiBVdGlscy5pc1R5cGUoaXRlbSwgRWxlbWVudERlZmluaXRpb24sIE5vZGUsIFF1ZXJ5RW5naW5lKSkpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGFyZ2V0LmdldEVuZ2luZUNsYXNzKCk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3MocmVzdWx0LCB0YXJnZXQuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQcm94eTtcbiAgfVxuXG4gIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJT3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRleHQoKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcbiAgICByZXR1cm4gb3B0aW9ucy5jb250ZXh0O1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuICAgIHJldHVybiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICBnZXRVbmRlcmx5aW5nQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX215dGhpeFVJRWxlbWVudHM7XG4gIH1cblxuICBnZXRPd25lckRvY3VtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb3QoKS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICB9XG5cbiAgZmlsdGVyQW5kQ29uc3RydWN0RWxlbWVudHMoY29udGV4dCwgZWxlbWVudHMpIHtcbiAgICBsZXQgZmluYWxFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudHMpLmZsYXQoSW5maW5pdHkpLm1hcCgoX2l0ZW0pID0+IHtcbiAgICAgIGlmICghX2l0ZW0pXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGl0ZW0gPSBfaXRlbTtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgUXVlcnlFbmdpbmUpXG4gICAgICAgIHJldHVybiBpdGVtLmdldFVuZGVybHlpbmdBcnJheSgpO1xuXG4gICAgICBpZiAoVXRpbHMuaXNUeXBlKGl0ZW0sIE5vZGUpKVxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgaWYgKGl0ZW1bVU5GSU5JU0hFRF9ERUZJTklUSU9OXSlcbiAgICAgICAgaXRlbSA9IGl0ZW0oKTtcblxuICAgICAgaWYgKFV0aWxzLmlzVHlwZShpdGVtLCAnOjpTdHJpbmcnKSlcbiAgICAgICAgaXRlbSA9IEVsZW1lbnRzLlRlcm0oaXRlbSk7XG4gICAgICBlbHNlIGlmICghVXRpbHMuaXNUeXBlKGl0ZW0sIEVsZW1lbnREZWZpbml0aW9uKSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoIWNvbnRleHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiY29udGV4dFwiIG9wdGlvbiBmb3IgUXVlcnlFbmdpbmUgaXMgcmVxdWlyZWQgd2hlbiBjb25zdHJ1Y3RpbmcgZWxlbWVudHMuJyk7XG5cbiAgICAgIHJldHVybiBpdGVtLmJ1aWxkKHRoaXMuZ2V0T3duZXJEb2N1bWVudCgpLCB7XG4gICAgICAgIHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZShjb250ZXh0KSxcbiAgICAgIH0pO1xuICAgIH0pLmZsYXQoSW5maW5pdHkpLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZmluYWxFbGVtZW50cykpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgYXJnSW5kZXggID0gMDtcbiAgICBsZXQgb3B0aW9ucyAgID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB0aGlzLmdldE9wdGlvbnMoKSwgKFV0aWxzLmlzUGxhaW5PYmplY3QoYXJnc1thcmdJbmRleF0pKSA/IGFyZ3NbYXJnSW5kZXgrK10gOiB7fSk7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZXh0ICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQuJCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbnRleHQuJC5jYWxsKG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuXG4gICAgY29uc3QgRW5naW5lQ2xhc3MgPSB0aGlzLmdldEVuZ2luZUNsYXNzKCk7XG4gICAgcmV0dXJuIEVuZ2luZUNsYXNzLmZyb20uY2FsbChvcHRpb25zLmNvbnRleHQgfHwgdGhpcywgb3B0aW9ucywgLi4uYXJncy5zbGljZShhcmdJbmRleCkpO1xuICB9XG5cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5fbXl0aGl4VUlFbGVtZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICB5aWVsZChbaSwgZWxlbWVudF0pO1xuICAgIH1cbiAgfVxuXG4gICprZXlzKCkge1xuICAgIGZvciAobGV0IFsga2V5LCBfIF0gb2YgdGhpcy5lbnRyaWVzKCkpXG4gICAgICB5aWVsZCBrZXk7XG4gIH1cblxuICAqdmFsdWVzKCkge1xuICAgIGZvciAobGV0IFsgXywgdmFsdWUgXSBvZiB0aGlzLmVudHJpZXMoKSlcbiAgICAgIHlpZWxkIHZhbHVlO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB5aWVsZCAqdGhpcy52YWx1ZXMoKTtcbiAgfVxuXG4gIGZpcnN0KGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwgfHwgY291bnQgPT09IDAgfHwgT2JqZWN0LmlzKGNvdW50LCBOYU4pIHx8ICFVdGlscy5pc1R5cGUoY291bnQsICc6Ok51bWJlcicpKVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KFsgdGhpcy5fbXl0aGl4VUlFbGVtZW50c1swXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSkpO1xuICB9XG5cbiAgbGFzdChjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsIHx8IGNvdW50ID09PSAwIHx8IE9iamVjdC5pcyhjb3VudCwgTmFOKSB8fCAhVXRpbHMuaXNUeXBlKGNvdW50LCAnOjpOdW1iZXInKSlcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChbIHRoaXMuX215dGhpeFVJRWxlbWVudHNbdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGggLSAxXSBdKTtcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLl9teXRoaXhVSUVsZW1lbnRzLnNsaWNlKE1hdGguYWJzKGNvdW50KSAqIC0xKSk7XG4gIH1cblxuICBhZGQoLi4uZWxlbWVudHMpIHtcbiAgICBjb25zdCBFbmdpbmVDbGFzcyA9IHRoaXMuZ2V0RW5naW5lQ2xhc3MoKTtcbiAgICByZXR1cm4gbmV3IEVuZ2luZUNsYXNzKHRoaXMuc2xpY2UoKS5jb25jYXQoLi4uZWxlbWVudHMpLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gIH1cblxuICBzdWJ0cmFjdCguLi5lbGVtZW50cykge1xuICAgIGxldCBzZXQgPSBuZXcgU2V0KGVsZW1lbnRzKTtcblxuICAgIGNvbnN0IEVuZ2luZUNsYXNzID0gdGhpcy5nZXRFbmdpbmVDbGFzcygpO1xuICAgIHJldHVybiBuZXcgRW5naW5lQ2xhc3ModGhpcy5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiAhc2V0LmhhcyhpdGVtKTtcbiAgICB9KSwgdGhpcy5nZXRPcHRpb25zKCkpO1xuICB9XG5cbiAgb24oZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgIGlmICghaXNFbGVtZW50KHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhcHBlbmRUbyhzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5fbXl0aGl4VUlFbGVtZW50cy5sZW5ndGgpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gIH1cblxuICBpbnNlcnRJbnRvKHNlbGVjdG9yT3JFbGVtZW50LCByZWZlcmVuY2VOb2RlKSB7XG4gICAgaWYgKCF0aGlzLl9teXRoaXhVSUVsZW1lbnRzLmxlbmd0aClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBzZWxlY3Rvck9yRWxlbWVudDtcbiAgICBpZiAoVXRpbHMuaXNUeXBlKHNlbGVjdG9yT3JFbGVtZW50LCAnOjpTdHJpbmcnKSlcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmdldFJvb3QoKS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yT3JFbGVtZW50KTtcblxuICAgIGxldCBvd25lckRvY3VtZW50ID0gdGhpcy5nZXRPd25lckRvY3VtZW50KCk7XG4gICAgbGV0IHNvdXJjZSAgICAgICAgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX215dGhpeFVJRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IGZyYWdtZW50ID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLl9teXRoaXhVSUVsZW1lbnRzKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG5cbiAgICAgIHNvdXJjZSA9IFsgZnJhZ21lbnQgXTtcbiAgICB9XG5cbiAgICBlbGVtZW50Lmluc2VydChzb3VyY2VbMF0sIHJlZmVyZW5jZU5vZGUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXBsYWNlQ2hpbGRyZW5PZihzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgIGxldCBlbGVtZW50ID0gc2VsZWN0b3JPckVsZW1lbnQ7XG4gICAgaWYgKFV0aWxzLmlzVHlwZShzZWxlY3Rvck9yRWxlbWVudCwgJzo6U3RyaW5nJykpXG4gICAgICBlbGVtZW50ID0gdGhpcy5nZXRSb290KCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvck9yRWxlbWVudCk7XG5cbiAgICB3aGlsZSAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZFRvKGVsZW1lbnQpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbXl0aGl4VUlFbGVtZW50cykge1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGFzc0xpc3Qob3BlcmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgbGV0IGNsYXNzTmFtZXMgPSBjb2xsZWN0Q2xhc3NOYW1lcyhhcmdzKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuX215dGhpeFVJRWxlbWVudHMpIHtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICd0b2dnbGUnKVxuICAgICAgICAgIGNsYXNzTmFtZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBub2RlLmNsYXNzTGlzdFtvcGVyYXRpb25dKC4uLmNsYXNzTmFtZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkQ2xhc3MoLi4uY2xhc3NOYW1lcykge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdCgnYWRkJywgLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyguLi5jbGFzc05hbWVzKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0KCdyZW1vdmUnLCAuLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIHRvZ2dsZUNsYXNzKC4uLmNsYXNzTmFtZXMpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QoJ3RvZ2dsZScsIC4uLmNsYXNzTmFtZXMpO1xuICB9XG5cbiAgc2xvdHRlZCh5ZXNObykge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB5ZXNObykgPyBpc1Nsb3R0ZWQgOiBpc05vdFNsb3R0ZWQpO1xuICB9XG5cbiAgc2xvdChzbG90TmFtZSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5zbG90ID09PSBzbG90TmFtZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmIChlbGVtZW50LmNsb3Nlc3QoYHNsb3RbbmFtZT1cIiR7c2xvdE5hbWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbihnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pKS5RdWVyeUVuZ2luZSA9IFF1ZXJ5RW5naW5lO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbWFnaWMtbnVtYmVycyAqL1xuXG4vKlxuTWFueSB0aGFua3MgdG8gR2VyYWludCBMdWZmIGZvciB0aGUgZm9sbG93aW5nXG5cbmh0dHBzOi8vZ2l0aHViLmNvbS9nZXJhaW50bHVmZi9zaGEyNTYvXG4qL1xuXG4vKipcbiAqIHR5cGU6IEZ1bmN0aW9uXG4gKiBuYW1lOiBTSEEyNTZcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgU0hBMjU2IGhhc2hpbmcgZnVuY3Rpb25cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBpbnB1dFxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBJbnB1dCBzdHJpbmdcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgU0hBMjU2IGhhc2ggb2YgdGhlIHByb3ZpZGVkIGBpbnB1dGAuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFRoaXMgaXMgYSBjdXN0b20gYmFrZWQgU0hBMjU2IGhhc2hpbmcgZnVuY3Rpb24sIG1pbmltaXplZCBmb3Igc2l6ZS5cbiAqICAgICBJdCBtYXkgYmUgaW5jb21wbGV0ZSwgYW5kIGl0IGlzIHN0cm9uZ2x5IHJlY29tbWVuZGVkIHRoYXQgeW91ICoqRE8gTk9UKiogdXNlIHRoaXNcbiAqICAgICBmb3IgYW55dGhpbmcgcmVsYXRlZCB0byBzZWN1cml0eS5cbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFJlYWQgYWxsIHRoZSBub3RlcywgYW5kIHVzZSB0aGlzIG1ldGhvZCB3aXRoIGNhdXRpb24uXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBtb2RpZmllZCBzbGlnaHRseSBmcm9tIHRoZSBvcmlnaW5hbCB0byAqbm90KiBiYWlsIHdoZW5cbiAqICAgICB1bmljb2RlIGNoYXJhY3RlcnMgYXJlIGRldGVjdGVkLiBUaGVyZSBpcyBhIGRlY2VudCBjaGFuY2UgdGhhdC0tZ2l2ZW4gY2VydGFpblxuICogICAgIGlucHV0LS10aGlzIG1ldGhvZCB3aWxsIHJldHVybiBhbiBpbnZhbGlkIFNIQTI1NiBoYXNoLlwiXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBNeXRoaXggVUkgdXNlcyB0aGlzIG1ldGhvZCBzaW1wbHkgdG8gZ2VuZXJhdGUgY29uc2lzdGVudCBJRHMuXG4gKiAgIC0gfFxuICogICAgIDpoZWFydDogTWFueSB0aGFua3MgdG8gdGhlIGF1dGhvciBbR2VyYWludCBMdWZmXShodHRwczovL2dpdGh1Yi5jb20vZ2VyYWludGx1ZmYvc2hhMjU2LylcbiAqICAgICBmb3IgdGhpcyBtZXRob2QhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTSEEyNTYoX2lucHV0KSB7XG4gIGxldCBpbnB1dCA9IF9pbnB1dDtcblxuICBsZXQgbWF0aFBvdyA9IE1hdGgucG93O1xuICBsZXQgbWF4V29yZCA9IG1hdGhQb3coMiwgMzIpO1xuICBsZXQgbGVuZ3RoUHJvcGVydHkgPSAnbGVuZ3RoJztcbiAgbGV0IGk7IGxldCBqOyAvLyBVc2VkIGFzIGEgY291bnRlciBhY3Jvc3MgdGhlIHdob2xlIGZpbGVcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIGxldCB3b3JkcyA9IFtdO1xuICBsZXQgYXNjaWlCaXRMZW5ndGggPSBpbnB1dFtsZW5ndGhQcm9wZXJ0eV0gKiA4O1xuXG4gIC8vKiBjYWNoaW5nIHJlc3VsdHMgaXMgb3B0aW9uYWwgLSByZW1vdmUvYWRkIHNsYXNoIGZyb20gZnJvbnQgb2YgdGhpcyBsaW5lIHRvIHRvZ2dsZVxuICAvLyBJbml0aWFsIGhhc2ggdmFsdWU6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgZmlyc3QgOCBwcmltZXNcbiAgLy8gKHdlIGFjdHVhbGx5IGNhbGN1bGF0ZSB0aGUgZmlyc3QgNjQsIGJ1dCBleHRyYSB2YWx1ZXMgYXJlIGp1c3QgaWdub3JlZClcbiAgbGV0IGhhc2ggPSBTSEEyNTYuaCA9IFNIQTI1Ni5oIHx8IFtdO1xuICAvLyBSb3VuZCBjb25zdGFudHM6IGZpcnN0IDMyIGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDY0IHByaW1lc1xuICBsZXQgayA9IFNIQTI1Ni5rID0gU0hBMjU2LmsgfHwgW107XG4gIGxldCBwcmltZUNvdW50ZXIgPSBrW2xlbmd0aFByb3BlcnR5XTtcbiAgLyovXG4gICAgbGV0IGhhc2ggPSBbXSwgayA9IFtdO1xuICAgIGxldCBwcmltZUNvdW50ZXIgPSAwO1xuICAgIC8vKi9cblxuICBsZXQgaXNDb21wb3NpdGUgPSB7fTtcbiAgZm9yIChsZXQgY2FuZGlkYXRlID0gMjsgcHJpbWVDb3VudGVyIDwgNjQ7IGNhbmRpZGF0ZSsrKSB7XG4gICAgaWYgKCFpc0NvbXBvc2l0ZVtjYW5kaWRhdGVdKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgMzEzOyBpICs9IGNhbmRpZGF0ZSlcbiAgICAgICAgaXNDb21wb3NpdGVbaV0gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGhhc2hbcHJpbWVDb3VudGVyXSA9IChtYXRoUG93KGNhbmRpZGF0ZSwgMC41KSAqIG1heFdvcmQpIHwgMDtcbiAgICAgIGtbcHJpbWVDb3VudGVyKytdID0gKG1hdGhQb3coY2FuZGlkYXRlLCAxIC8gMykgKiBtYXhXb3JkKSB8IDA7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQgKz0gJ1xceDgwJzsgLy8gQXBwZW5kIMaHJyBiaXQgKHBsdXMgemVybyBwYWRkaW5nKVxuICB3aGlsZSAoaW5wdXRbbGVuZ3RoUHJvcGVydHldICUgNjQgLSA1NilcbiAgICBpbnB1dCArPSAnXFx4MDAnOyAvLyBNb3JlIHplcm8gcGFkZGluZ1xuXG4gIGZvciAoaSA9IDA7IGkgPCBpbnB1dFtsZW5ndGhQcm9wZXJ0eV07IGkrKykge1xuICAgIGogPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChqID4+IDgpXG4gICAgICByZXR1cm47IC8vIEFTQ0lJIGNoZWNrOiBvbmx5IGFjY2VwdCBjaGFyYWN0ZXJzIGluIHJhbmdlIDAtMjU1XG4gICAgd29yZHNbaSA+PiAyXSB8PSBqIDw8ICgoMyAtIGkpICUgNCkgKiA4O1xuICB9XG5cbiAgd29yZHNbd29yZHNbbGVuZ3RoUHJvcGVydHldXSA9ICgoYXNjaWlCaXRMZW5ndGggLyBtYXhXb3JkKSB8IDApO1xuICB3b3Jkc1t3b3Jkc1tsZW5ndGhQcm9wZXJ0eV1dID0gKGFzY2lpQml0TGVuZ3RoKTtcblxuICAvLyBwcm9jZXNzIGVhY2ggY2h1bmtcbiAgZm9yIChqID0gMDsgaiA8IHdvcmRzW2xlbmd0aFByb3BlcnR5XTspIHtcbiAgICBsZXQgdyA9IHdvcmRzLnNsaWNlKGosIGogKz0gMTYpOyAvLyBUaGUgbWVzc2FnZSBpcyBleHBhbmRlZCBpbnRvIDY0IHdvcmRzIGFzIHBhcnQgb2YgdGhlIGl0ZXJhdGlvblxuICAgIGxldCBvbGRIYXNoID0gaGFzaDtcblxuICAgIC8vIFRoaXMgaXMgbm93IHRoZSB1bmRlZmluZWR3b3JraW5nIGhhc2hcIiwgb2Z0ZW4gbGFiZWxsZWQgYXMgdmFyaWFibGVzIGEuLi5nXG4gICAgLy8gKHdlIGhhdmUgdG8gdHJ1bmNhdGUgYXMgd2VsbCwgb3RoZXJ3aXNlIGV4dHJhIGVudHJpZXMgYXQgdGhlIGVuZCBhY2N1bXVsYXRlXG4gICAgaGFzaCA9IGhhc2guc2xpY2UoMCwgOCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgLy8gRXhwYW5kIHRoZSBtZXNzYWdlIGludG8gNjQgd29yZHNcbiAgICAgIC8vIFVzZWQgYmVsb3cgaWZcbiAgICAgIGxldCB3MTUgPSB3W2kgLSAxNV07IGxldCB3MiA9IHdbaSAtIDJdO1xuXG4gICAgICAvLyBJdGVyYXRlXG4gICAgICBsZXQgYSA9IGhhc2hbMF07IGxldCBlID0gaGFzaFs0XTtcbiAgICAgIGxldCB0ZW1wMSA9IGhhc2hbN11cbiAgICAgICAgICAgICAgICArICgoKGUgPj4+IDYpIHwgKGUgPDwgMjYpKSBeICgoZSA+Pj4gMTEpIHwgKGUgPDwgMjEpKSBeICgoZSA+Pj4gMjUpIHwgKGUgPDwgNykpKSAvLyBTMVxuICAgICAgICAgICAgICAgICsgKChlICYgaGFzaFs1XSkgXiAoKH5lKSAmIGhhc2hbNl0pKSAvLyBjaFxuICAgICAgICAgICAgICAgICsga1tpXVxuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICArICh3W2ldID0gKGkgPCAxNikgPyB3W2ldIDogKFxuICAgICAgICAgICAgICAgICAgd1tpIC0gMTZdXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcxNSA+Pj4gNykgfCAodzE1IDw8IDI1KSkgXiAoKHcxNSA+Pj4gMTgpIHwgKHcxNSA8PCAxNCkpIF4gKHcxNSA+Pj4gMykpIC8vIHMwXG4gICAgICAgICAgICAgICAgICAgICAgICArIHdbaSAtIDddXG4gICAgICAgICAgICAgICAgICAgICAgICArICgoKHcyID4+PiAxNykgfCAodzIgPDwgMTUpKSBeICgodzIgPj4+IDE5KSB8ICh3MiA8PCAxMykpIF4gKHcyID4+PiAxMCkpIC8vIHMxXG4gICAgICAgICAgICAgICAgKSB8IDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgLy8gVGhpcyBpcyBvbmx5IHVzZWQgb25jZSwgc28gKmNvdWxkKiBiZSBtb3ZlZCBiZWxvdywgYnV0IGl0IG9ubHkgc2F2ZXMgNCBieXRlcyBhbmQgbWFrZXMgdGhpbmdzIHVucmVhZGJsZVxuICAgICAgbGV0IHRlbXAyID0gKCgoYSA+Pj4gMikgfCAoYSA8PCAzMCkpIF4gKChhID4+PiAxMykgfCAoYSA8PCAxOSkpIF4gKChhID4+PiAyMikgfCAoYSA8PCAxMCkpKSAvLyBTMFxuICAgICAgICAgICAgICAgICsgKChhICYgaGFzaFsxXSkgXiAoYSAmIGhhc2hbMl0pIF4gKGhhc2hbMV0gJiBoYXNoWzJdKSk7IC8vIG1halxuXG4gICAgICBoYXNoID0gWyh0ZW1wMSArIHRlbXAyKSB8IDBdLmNvbmNhdChoYXNoKTsgLy8gV2UgZG9uJ3QgYm90aGVyIHRyaW1taW5nIG9mZiB0aGUgZXh0cmEgb25lcywgdGhleSdyZSBoYXJtbGVzcyBhcyBsb25nIGFzIHdlJ3JlIHRydW5jYXRpbmcgd2hlbiB3ZSBkbyB0aGUgc2xpY2UoKVxuICAgICAgaGFzaFs0XSA9IChoYXNoWzRdICsgdGVtcDEpIHwgMDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKVxuICAgICAgaGFzaFtpXSA9IChoYXNoW2ldICsgb2xkSGFzaFtpXSkgfCAwO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykge1xuICAgIGZvciAoaiA9IDM7IGogKyAxOyBqLS0pIHtcbiAgICAgIGxldCBiID0gKGhhc2hbaV0gPj4gKGogKiA4KSkgJiAyNTU7XG4gICAgICByZXN1bHQgKz0gKChiIDwgMTYpID8gMCA6ICcnKSArIGIudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgeyBTSEEyNTYgfSBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSB8fCB7fSk7XG5cbmV4cG9ydCB7XG4gIFNIQTI1Nixcbn07XG5cbi8qKlxuICogdHlwZTogTmFtZXNwYWNlXG4gKiBuYW1lOiBVdGlsc1xuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO2BcbiAqXG4gKiAgIE1pc2MgdXRpbGl0eSBmdW5jdGlvbnMgYW5kIGdsb2JhbCBjb25zdGFudHMgYXJlIGZvdW5kIHdpdGhpbiB0aGlzIG5hbWVzcGFjZS5cbiAqIHByb3BlcnRpZXM6XG4gKiAgIC0gbmFtZTogTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVJcbiAqICAgICBkYXRhVHlwZTogc3ltYm9sXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhpcyBpcyB1c2VkIGFzIGEgQHNlZSBVdGlscy5tZXRhZGF0YT9jYXB0aW9uPW1ldGFkYXRhOyBrZXkgYnkgQHNlZSBVdGlscy5nbG9iYWxTdG9yZU5hbWVWYWx1ZVBhaXJIZWxwZXI7XG4gKiAgICAgICB0byBzdG9yZSBrZXkvdmFsdWUgcGFpcnMgZm9yIGEgc2luZ2xlIHZhbHVlLlxuICpcbiAqICAgICAgIE15dGhpeCBVSSBoYXMgZ2xvYmFsIHN0b3JlIGFuZCBmZXRjaCBoZWxwZXJzIGZvciBzZXR0aW5nIGFuZCBmZXRjaGluZyBkeW5hbWljIHByb3BlcnRpZXMuIFRoZXNlXG4gKiAgICAgICBtZXRob2RzIG9ubHkgYWNjZXB0IGEgc2luZ2xlIHZhbHVlIGJ5IGRlc2lnbi4uLiBidXQgc29tZXRpbWVzIGl0IGlzIGRlc2lyZWQgdGhhdCBhIHZhbHVlIGJlIHNldFxuICogICAgICAgd2l0aCBhIHNwZWNpZmljIGtleSBpbnN0ZWFkLiBUaGlzIGBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUmAgcHJvcGVydHkgYXNzaXN0cyB3aXRoIHRoaXMgcHJvY2VzcyxcbiAqICAgICAgIGFsbG93aW5nIGdsb2JhbCBoZWxwZXJzIHRvIHN0aWxsIGZ1bmN0aW9uIHdpdGggYSBzaW5nbGUgdmFsdWUgc2V0LCB3aGlsZSBpbiBzb21lIGNhc2VzIHN0aWxsIHBhc3NpbmdcbiAqICAgICAgIGEga2V5IHRocm91Z2ggdG8gdGhlIHNldHRlci4gQHNvdXJjZVJlZiBfbXl0aGl4TmFtZVZhbHVlUGFpckhlbHBlclVzYWdlO1xuICogICAgIG5vdGVzOlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDp3YXJuaW5nOiBVc2UgYXQgeW91ciBvd24gcmlzay4gVGhpcyBpcyBNeXRoaXggVUkgaW50ZXJuYWwgY29kZSB0aGF0IG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuICogICAtIG5hbWU6IE1ZVEhJWF9TSEFET1dfUEFSRU5UXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBhcyBhIEBzZWUgVXRpbHMubWV0YWRhdGE/Y2FwdGlvbj1tZXRhZGF0YTsga2V5IGJ5IEBzZWUgTXl0aGl4VUlDb21wb25lbnQ7IHRvXG4gKiAgICAgICBzdG9yZSB0aGUgcGFyZW50IG5vZGUgb2YgYSBTaGFkb3cgRE9NLCBzbyB0aGF0IGl0IGNhbiBsYXRlciBiZSB0cmF2ZXJzZWQgYnkgQHNlZSBVdGlscy5nZXRQYXJlbnROb2RlOy5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6d2FybmluZzogVXNlIGF0IHlvdXIgb3duIHJpc2suIFRoaXMgaXMgTXl0aGl4IFVJIGludGVybmFsIGNvZGUgdGhhdCBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIFV0aWxzLmdldFBhcmVudE5vZGU7LlxuICogICAtIG5hbWU6IE1ZVEhJWF9UWVBFXG4gKiAgICAgZGF0YVR5cGU6IHN5bWJvbFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoaXMgaXMgdXNlZCBmb3IgdHlwZSBjaGVja2luZyBieSBgaW5zdGFuY2VvZmAgY2hlY2tzIHRvIGRldGVybWluZSBpZiBhbiBpbnN0YW5jZVxuICogICAgICAgaXMgYSBzcGVjaWZpYyB0eXBlIChldmVuIGFjcm9zcyBqYXZhc2NyaXB0IGNvbnRleHRzIGFuZCBsaWJyYXJ5IHZlcnNpb25zKS4gQHNvdXJjZVJlZiBfbXl0aGl4VHlwZUV4YW1wbGU7XG4gKiAgICAgbm90ZXM6XG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5pc1R5cGU7LlxuICogICAtIG5hbWU6IERZTkFNSUNfUFJPUEVSVFlfVFlQRVxuICogICAgIGRhdGFUeXBlOiBzeW1ib2xcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBVc2VkIGZvciBydW50aW1lIHR5cGUgcmVmbGVjdGlvbiBhZ2FpbnN0IEBzZWUgVXRpbHMuRHluYW1pY1Byb3BlcnR5Oy5cbiAqICAgICBub3RlczpcbiAqICAgICAgIC0gfFxuICogICAgICAgICA6ZXllOiBAc2VlIFV0aWxzLkR5bmFtaWNQcm9wZXJ0eTsuXG4gKiAgICAgICAtIHxcbiAqICAgICAgICAgOmV5ZTogQHNlZSBVdGlscy5pc1R5cGU7LlxuICogICAgICAgLSB8XG4gKiAgICAgICAgIDpleWU6IEBzZWUgVXRpbHMuTVlUSElYX1RZUEU7LlxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIGNvdW50LCBjaGFyID0gJzAnKSB7XG4gIHJldHVybiBzdHIucGFkU3RhcnQoY291bnQsIGNoYXIpO1xufVxuXG5leHBvcnQgY29uc3QgTVlUSElYX05BTUVfVkFMVUVfUEFJUl9IRUxQRVIgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29uc3RhbnRzL25hbWUtdmFsdWUtcGFpci1oZWxwZXInKTsgLy8gQHJlZjpVdGlscy5NWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUlxuZXhwb3J0IGNvbnN0IE1ZVEhJWF9TSEFET1dfUEFSRU5UICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL2NvbnN0YW50cy9zaGFkb3ctcGFyZW50Jyk7IC8vIEByZWY6VXRpbHMuTVlUSElYX1NIQURPV19QQVJFTlRcbmV4cG9ydCBjb25zdCBNWVRISVhfVFlQRSAgICAgICAgICAgICAgICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb25zdGFudHMvZWxlbWVudC1kZWZpbml0aW9uJyk7IC8vIEByZWY6VXRpbHMuTVlUSElYX1RZUEVcblxuZXhwb3J0IGNvbnN0IERZTkFNSUNfUFJPUEVSVFlfVFlQRSAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpEeW5hbWljUHJvcGVydHknKTsgLy8gQHJlZjpVdGlscy5EWU5BTUlDX1BST1BFUlRZX1RZUEVcblxuY29uc3QgRUxFTUVOVF9ERUZJTklUSU9OX1RZUEUgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpFbGVtZW50RGVmaW5pdGlvbicpO1xuY29uc3QgUVVFUllfRU5HSU5FX1RZUEUgICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbC5mb3IoJ0BteXRoaXgvbXl0aGl4LXVpL3R5cGVzL015dGhpeFVJOjpRdWVyeUVuZ2luZScpO1xuXG5jb25zdCBJRF9DT1VOVF9MRU5HVEggICAgICAgICA9IDE5O1xuY29uc3QgSVNfQ0xBU1MgICAgICAgICAgICAgICAgPSAoL15jbGFzcyBcXFMrIFxcey8pO1xuY29uc3QgTkFUSVZFX0NMQVNTX1RZUEVfTkFNRVMgPSBbXG4gICdBZ2dyZWdhdGVFcnJvcicsXG4gICdBcnJheScsXG4gICdBcnJheUJ1ZmZlcicsXG4gICdCaWdJbnQnLFxuICAnQmlnSW50NjRBcnJheScsXG4gICdCaWdVaW50NjRBcnJheScsXG4gICdCb29sZWFuJyxcbiAgJ0RhdGFWaWV3JyxcbiAgJ0RhdGUnLFxuICAnRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGUnLFxuICAnRXJyb3InLFxuICAnRXZhbEVycm9yJyxcbiAgJ0ZpbmFsaXphdGlvblJlZ2lzdHJ5JyxcbiAgJ0Zsb2F0MzJBcnJheScsXG4gICdGbG9hdDY0QXJyYXknLFxuICAnRnVuY3Rpb24nLFxuICAnSW50MTZBcnJheScsXG4gICdJbnQzMkFycmF5JyxcbiAgJ0ludDhBcnJheScsXG4gICdNYXAnLFxuICAnTnVtYmVyJyxcbiAgJ09iamVjdCcsXG4gICdQcm94eScsXG4gICdSYW5nZUVycm9yJyxcbiAgJ1JlZmVyZW5jZUVycm9yJyxcbiAgJ1JlZ0V4cCcsXG4gICdTZXQnLFxuICAnU2hhcmVkQXJyYXlCdWZmZXInLFxuICAnU3RyaW5nJyxcbiAgJ1N5bWJvbCcsXG4gICdTeW50YXhFcnJvcicsXG4gICdUeXBlRXJyb3InLFxuICAnVWludDE2QXJyYXknLFxuICAnVWludDMyQXJyYXknLFxuICAnVWludDhBcnJheScsXG4gICdVaW50OENsYW1wZWRBcnJheScsXG4gICdVUklFcnJvcicsXG4gICdXZWFrTWFwJyxcbiAgJ1dlYWtSZWYnLFxuICAnV2Vha1NldCcsXG5dO1xuXG5jb25zdCBOQVRJVkVfQ0xBU1NfVFlQRVNfTUVUQSA9IE5BVElWRV9DTEFTU19UWVBFX05BTUVTLm1hcCgodHlwZU5hbWUpID0+IHtcbiAgcmV0dXJuIFsgdHlwZU5hbWUsIGdsb2JhbFRoaXNbdHlwZU5hbWVdIF07XG59KS5maWx0ZXIoKG1ldGEpID0+IG1ldGFbMV0pO1xuXG5jb25zdCBJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUUgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvY29tcG9uZW50L2NvbnN0YW50cy9pZC1jb3VudGVyLWN1cnJlbnQtdmFsdWUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbmxldCBpZENvdW50ZXIgPSAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdsb2JhbFRoaXMubXl0aGl4VUksIElEX0NPVU5URVJfQ1VSUkVOVF9WQUxVRSkpID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUVdIDogMG47XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBHZW5lcmF0ZSBhIHBhcnRpYWxseSByYW5kb20gdW5pcXVlIElELiBUaGUgaWQgZ2VuZXJhdGVkIHdpbGwgYmUgYSBgRGF0ZS5ub3coKWBcbiAqICAgdmFsdWUgd2l0aCBhbiBpbmNyZW1lbnRpbmcgQmlnSW50IHBvc3RmaXhlZCB0byBpdC5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRC5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZygnSUQ6ICcsIFV0aWxzLmdlbmVyYXRlSUQoKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICdJRDE3MDQxNDMwMjcxNzkwMDAwMDAwMDAwMDAwMDAwMDA3J1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJRCgpIHtcbiAgaWRDb3VudGVyICs9IEJpZ0ludCgxKTtcbiAgZ2xvYmFsVGhpcy5teXRoaXhVSVtJRF9DT1VOVEVSX0NVUlJFTlRfVkFMVUVdID0gaWRDb3VudGVyO1xuXG4gIHJldHVybiBgSUQke0RhdGUubm93KCl9JHtwYWQoaWRDb3VudGVyLnRvU3RyaW5nKCksIElEX0NPVU5UX0xFTkdUSCl9YDtcbn1cblxuY29uc3QgT0JKRUNUX0lEX1NUT1JBR0UgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL29iamVjdC1pZC1zdG9yYWdlJyk7XG5jb25zdCBPQkpFQ1RfSURfV0VBS01BUCA9IGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdID0gKGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdKSA/IGdsb2JhbFRoaXMubXl0aGl4VUlbT0JKRUNUX0lEX1NUT1JBR0VdIDogbmV3IFdlYWtNYXAoKTtcblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdldCBhIHVuaXF1ZSBJRCBmb3IgYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgcmVmZXJlbmNlLlxuICpcbiAqICAgVW5pcXVlIElEcyBhcmUgZ2VuZXJhdGVkIHZpYSBAc2VlIFV0aWxzLmdlbmVyYXRlSUQ7LlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IEFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHJlZmVyZW5jZS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBBIHVuaXF1ZSBJRCBmb3IgdGhpcyByZWZlcmVuY2UgKGFzIGEgU0hBMjU2IGhhc2gpLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGNvbnNvbGUubG9nKFV0aWxzLmdldE9iamVjdElEKGRpdkVsZW1lbnQpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJzE3MDQxNDMwMjcxNzkwMDAwMDAwMDAwMDAwMDAwMDA3J1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqZWN0SUQodmFsdWUpIHtcbiAgbGV0IGlkID0gT0JKRUNUX0lEX1dFQUtNQVAuZ2V0KHZhbHVlKTtcbiAgaWYgKGlkID09IG51bGwpIHtcbiAgICBsZXQgdGhpc0lEID0gZ2VuZXJhdGVJRCgpO1xuXG4gICAgT0JKRUNUX0lEX1dFQUtNQVAuc2V0KHZhbHVlLCB0aGlzSUQpO1xuXG4gICAgcmV0dXJuIHRoaXNJRDtcbiAgfVxuXG4gIHJldHVybiBpZDtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENyZWF0ZSBhbiB1bnJlc29sdmVkIHNwZWNpYWxpemVkIFByb21pc2UgaW5zdGFuY2UsIHdpdGggdGhlIGludGVudCB0aGF0IGl0IHdpbGwgYmVcbiAqICAgcmVzb2x2ZWQgbGF0ZXIuXG4gKlxuICogICBUaGUgUHJvbWlzZSBpbnN0YW5jZSBpcyBzcGVjaWFsaXplZCBiZWNhdXNlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBhcmUgaW5qZWN0ZWQgaW50byBpdDpcbiAqICAgMS4gYHJlc29sdmUocmVzdWx0VmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZXNvbHZlcyB0aGUgcHJvbWlzZSB3aXRoIHRoZSBmaXJzdCBwcm92aWRlZCBhcmd1bWVudFxuICogICAyLiBgcmVqZWN0KGVycm9yVmFsdWUpYCAtIFdoZW4gY2FsbGVkLCByZWplY3RzIHRoZSBwcm9taXNlIHdpdGggdGhlIGZpcnN0IHByb3ZpZGVkIGFyZ3VtZW50XG4gKiAgIDMuIGBzdGF0dXMoKWAgLSBXaGVuIGNhbGxlZCwgd2lsbCByZXR1cm4gdGhlIGZ1bGZpbGxtZW50IHN0YXR1cyBvZiB0aGUgcHJvbWlzZSwgYXMgYSBgc3RyaW5nYCwgb25lIG9mOiBgXCJwZW5kaW5nXCIsIFwiZnVsZmlsbGVkXCJgLCBvciBgXCJyZWplY3RlZFwiYFxuICogICA0LiBgaWQ8c3RyaW5nPmAgLSBBIHJhbmRvbWx5IGdlbmVyYXRlZCBJRCBmb3IgdGhpcyBwcm9taXNlXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIFByb21pc2U7IEFuIHVucmVzb2x2ZWQgUHJvbWlzZSB0aGF0IGNhbiBiZSByZXNvbHZlZCBvciByZWplY3RlZCBieSBjYWxsaW5nIGBwcm9taXNlLnJlc29sdmUocmVzdWx0KWAgb3IgYHByb21pc2UucmVqZWN0KGVycm9yKWAgcmVzcGVjdGl2ZWx5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVzb2x2YWJsZSgpIHtcbiAgbGV0IHN0YXR1cyA9ICdwZW5kaW5nJztcbiAgbGV0IHJlc29sdmU7XG4gIGxldCByZWplY3Q7XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIF9yZWplY3QpID0+IHtcbiAgICByZXNvbHZlID0gKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgc3RhdHVzID0gJ2Z1bGZpbGxlZCc7XG4gICAgICAgIF9yZXNvbHZlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHJlamVjdCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgIHN0YXR1cyA9ICdyZWplY3RlZCc7XG4gICAgICAgIF9yZWplY3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm9taXNlLCB7XG4gICAgJ3Jlc29sdmUnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIHJlc29sdmUsXG4gICAgfSxcbiAgICAncmVqZWN0Jzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICByZWplY3QsXG4gICAgfSxcbiAgICAnc3RhdHVzJzoge1xuICAgICAgd3JpdGFibGU6ICAgICBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6ICAgICAgICAoKSA9PiBzdGF0dXMsXG4gICAgfSxcbiAgICAnaWQnOiB7XG4gICAgICB3cml0YWJsZTogICAgIGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogICAgICAgIGdlbmVyYXRlSUQoKSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIFJ1bnRpbWUgdHlwZSByZWZsZWN0aW9uIGhlbHBlci4gVGhpcyBpcyBpbnRlbmRlZCB0byBiZSBhIG1vcmUgcm9idXN0IHJlcGxhY2VtZW50IGZvciB0aGUgYHR5cGVvZmAgb3BlcmF0b3IuXG4gKlxuICogICBUaGlzIG1ldGhvZCBhbHdheXMgcmV0dXJucyBhIG5hbWUgKGFzIGEgYHN0cmluZ2AgdHlwZSkgb2YgdGhlIHVuZGVybHlpbmcgZGF0YXR5cGUuXG4gKiAgIFRoZSBcImRhdGF0eXBlXCIgaXMgYSBsaXR0bGUgbG9vc2UgZm9yIHByaW1pdGl2ZSB0eXBlcy4gRm9yIGV4YW1wbGUsIGFcbiAqICAgcHJpbWl0aXZlIGB0eXBlb2YgeCA9PT0gJ251bWJlcidgIHR5cGUgaXMgcmV0dXJuZWQgYXMgaXRzIGNvcnJlc3BvbmRpbmcgT2JqZWN0IChjbGFzcykgdHlwZSBgJ051bWJlcidgLiBGb3IgYGJvb2xlYW5gIGl0IHdpbGwgaW5zdGVhZFxuICogICByZXR1cm4gYCdCb29sZWFuJ2AsIGFuZCBmb3IgYCdzdHJpbmcnYCwgaXQgd2lsbCBpbnN0ZWFkIHJldHVybiBgJ1N0cmluZydgLiBUaGlzIGlzIHRydWUgb2YgYWxsIHVuZGVybHlpbmcgcHJpbWl0aXZlIHR5cGVzLlxuICpcbiAqICAgRm9yIGludGVybmFsIGRhdGF0eXBlcywgaXQgd2lsbCByZXR1cm4gdGhlIHJlYWwgY2xhc3MgbmFtZSBwcmVmaXhlZCBieSB0d28gY29sb25zLlxuICogICBGb3IgZXhhbXBsZSwgYHR5cGVPZihuZXcgTWFwKCkpYCB3aWxsIHJldHVybiBgJzo6TWFwJ2AuXG4gKlxuICogICBOb24taW50ZXJuYWwgdHlwZXMgd2lsbCBub3QgYmUgcHJlZml4ZWQsIGFsbG93aW5nIGN1c3RvbSB0eXBlcyB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgaW50ZXJuYWwgdHlwZXMgdG8gYWxzbyBiZSBkZXRlY3RlZC5cbiAqICAgRm9yIGV4YW1wbGUsIGBjbGFzcyBUZXN0IHt9OyB0eXBlT2YobmV3IFRlc3QoKSlgIHdpbGwgcmVzdWx0IGluIHRoZSBub24tcHJlZml4ZWQgcmVzdWx0IGAnVGVzdCdgLlxuICpcbiAqICAgRm9yIHJhdyBgZnVuY3Rpb25gIHR5cGVzLCBgdHlwZU9mYCB3aWxsIGNoZWNrIGlmIHRoZXkgYXJlIGEgY29uc3RydWN0b3Igb3Igbm90LiBJZiBhIGNvbnN0cnVjdG9yIGlzIGRldGVjdGVkLCB0aGVuXG4gKiAgIHRoZSBmb3JtYXQgYCdbQ2xhc3MgJHtuYW1lfV0nYCB3aWxsIGJlIHJldHVybmVkIGFzIHRoZSB0eXBlLiBGb3IgaW50ZXJuYWwgdHlwZXMgdGhlIG5hbWUgd2lsbFxuICogICBiZSBwcmVmaXhlZCwgaS5lLiBgW0NsYXNzIDo6JHtpbnRlcm5hbE5hbWV9XWAsIGFuZCBmb3Igbm9uLWludGVybmFsIHR5cGVzIHdpbGwgaW5zdGVhZCBiZSBub24tcHJlZml4ZWQsIGkuZS4gYFtDbGFzcyAke25hbWV9XWAgLlxuICogICBGb3IgZXhhbXBsZSwgYHR5cGVPZihNYXApYCB3aWxsIHJldHVybiBgJ1tDbGFzcyA6Ok1hcF0nYCwgd2hlcmVhcyBgdHlwZU9mKFRlc3QpYCB3aWxsIHJlc3VsdCBpbiBgJ1tDbGFzcyBUZXN0XSdgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFRoZSB2YWx1ZSB3aG9zZSB0eXBlIHlvdSB3aXNoIHRvIGRpc2NvdmVyLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBuYW1lIG9mIHRoZSBwcm92aWRlZCB0eXBlLCBvciBhbiBlbXB0eSBzdHJpbmcgYCcnYCBpZiB0aGUgcHJvdmlkZWQgdmFsdWUgaGFzIG5vIHR5cGUuXG4gKiBub3RlczpcbiAqICAgLSBUaGlzIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGEgW1N5bWJvbC50b1N0cmluZ1RhZ10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3ltYm9sL3RvU3RyaW5nVGFnKVxuICogICAgIGtleSBvbiB0aGUgdmFsdWUgcHJvdmlkZWQuLi4gYW5kIGlmIGZvdW5kLCB3aWxsIHVzZSBpdCB0byBhc3Npc3Qgd2l0aCBmaW5kaW5nIHRoZSBjb3JyZWN0IHR5cGUgbmFtZS5cbiAqICAgLSBJZiB0aGUgYHZhbHVlYCBwcm92aWRlZCBpcyB0eXBlLWxlc3MsIGkuZS4gYHVuZGVmaW5lZGAsIGBudWxsYCwgb3IgYE5hTmAsIHRoZW4gYW4gZW1wdHkgdHlwZSBgJydgIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiAgIC0gVXNlIHRoZSBgdHlwZW9mYCBvcGVyYXRvciBpZiB5b3Ugd2FudCB0byBkZXRlY3QgaWYgYSB0eXBlIGlzIHByaW1pdGl2ZSBvciBub3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwgfHwgT2JqZWN0LmlzKHZhbHVlLCBOYU4pKVxuICAgIHJldHVybiAnJztcblxuICBpZiAoT2JqZWN0LmlzKHZhbHVlLCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKHZhbHVlLCAtSW5maW5pdHkpKVxuICAgIHJldHVybiAnOjpOdW1iZXInO1xuXG4gIGxldCB0aGlzVHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHRoaXNUeXBlID09PSAnYmlnaW50JylcbiAgICByZXR1cm4gJzo6QmlnSW50JztcblxuICBpZiAodGhpc1R5cGUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiAnOjpTeW1ib2wnO1xuXG4gIGlmICh0aGlzVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodGhpc1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiAodmFsdWUgPT09IHR5cGVNZXRhWzFdKSk7XG4gICAgICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgICAgIHJldHVybiBgW0NsYXNzIDo6JHtuYXRpdmVUeXBlTWV0YVswXX1dYDtcblxuICAgICAgaWYgKHZhbHVlLnByb3RvdHlwZSAmJiB0eXBlb2YgdmFsdWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIElTX0NMQVNTLnRlc3QoJycgKyB2YWx1ZS5wcm90b3R5cGUuY29uc3RydWN0b3IpKVxuICAgICAgICByZXR1cm4gYFtDbGFzcyAke3ZhbHVlLm5hbWV9XWA7XG5cbiAgICAgIGlmICh2YWx1ZS5wcm90b3R5cGUgJiYgdHlwZW9mIHZhbHVlLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSgpO1xuICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgIHJldHVybiBgW0NsYXNzICR7cmVzdWx0fV1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBgOjoke3RoaXNUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7dGhpc1R5cGUuc3Vic3RyaW5nKDEpfWA7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgcmV0dXJuICc6OkFycmF5JztcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpXG4gICAgcmV0dXJuICc6OlN0cmluZyc7XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyKVxuICAgIHJldHVybiAnOjpOdW1iZXInO1xuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pXG4gICAgcmV0dXJuICc6OkJvb2xlYW4nO1xuXG4gIGxldCBuYXRpdmVUeXBlTWV0YSA9IE5BVElWRV9DTEFTU19UWVBFU19NRVRBLmZpbmQoKHR5cGVNZXRhKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAodHlwZU1ldGFbMF0gIT09ICdPYmplY3QnICYmIHZhbHVlIGluc3RhbmNlb2YgdHlwZU1ldGFbMV0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBpZiAobmF0aXZlVHlwZU1ldGEpXG4gICAgcmV0dXJuIGA6OiR7bmF0aXZlVHlwZU1ldGFbMF19YDtcblxuICBpZiAodHlwZW9mIE1hdGggIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBNYXRoKVxuICAgIHJldHVybiAnOjpNYXRoJztcblxuICBpZiAodHlwZW9mIEpTT04gIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBKU09OKVxuICAgIHJldHVybiAnOjpKU09OJztcblxuICBpZiAodHlwZW9mIEF0b21pY3MgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBBdG9taWNzKVxuICAgIHJldHVybiAnOjpBdG9taWNzJztcblxuICBpZiAodHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBSZWZsZWN0KVxuICAgIHJldHVybiAnOjpSZWZsZWN0JztcblxuICBpZiAodmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSlcbiAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10oKSA6IHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ107XG5cbiAgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgIHJldHVybiAnOjpPYmplY3QnO1xuXG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdPYmplY3QnO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgUnVudGltZSB0eXBlIHJlZmxlY3Rpb24gaGVscGVyLiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbW9yZSByb2J1c3QgcmVwbGFjZW1lbnQgZm9yIHRoZSBgaW5zdGFuY2VvZmAgb3BlcmF0b3IuXG4gKlxuICogICBUaGlzIG1ldGhvZCB3aWxsIHJldHVybiBgdHJ1ZWAgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgKmFueSogb2YgdGhlIHByb3ZpZGVkIGB0eXBlc2AuXG4gKlxuICogICBUaGUgcHJvdmlkZWQgYHR5cGVzYCBjYW4gZWFjaCBlaXRoZXIgYmUgYSByZWFsIHJhdyB0eXBlIChpLmUuIGBTdHJpbmdgIGNsYXNzKSwgb3IgdGhlIG5hbWUgb2YgYSB0eXBlLCBhcyBhIHN0cmluZyxcbiAqICAgaS5lLiBgJzo6U3RyaW5nJ2AuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVGhlIHZhbHVlIHdob3NlIHR5cGUgeW91IHdpc2ggdG8gY29tcGFyZS5cbiAqICAgLSBuYW1lOiAuLi50eXBlc1xuICogICAgIGRhdGFUeXBlOiBBcnJheTxhbnk+XG4gKiAgICAgZGVzYzogQWxsIHR5cGVzIHlvdSB3aXNoIHRvIGNoZWNrIGFnYWluc3QuIFN0cmluZyB2YWx1ZXMgY29tcGFyZSB0eXBlcyBieSBuYW1lLCBmdW5jdGlvbiB2YWx1ZXMgY29tcGFyZSB0eXBlcyBieSBgaW5zdGFuY2VvZmAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBtYXRjaGVzIGFueSBvZiB0aGUgcHJvdmlkZWQgYHR5cGVzYC5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgVXRpbHMudHlwZU9mOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVHlwZSh2YWx1ZSwgLi4udHlwZXMpIHtcbiAgY29uc3QgZ2V0SW50ZXJuYWxUeXBlTmFtZSA9ICh0eXBlKSA9PiB7XG4gICAgbGV0IG5hdGl2ZVR5cGVNZXRhID0gTkFUSVZFX0NMQVNTX1RZUEVTX01FVEEuZmluZCgodHlwZU1ldGEpID0+ICh0eXBlID09PSB0eXBlTWV0YVsxXSkpO1xuICAgIGlmIChuYXRpdmVUeXBlTWV0YSlcbiAgICAgIHJldHVybiBgOjoke25hdGl2ZVR5cGVNZXRhWzBdfWA7XG4gIH07XG5cbiAgbGV0IHZhbHVlVHlwZSA9IHR5cGVPZih2YWx1ZSk7XG4gIGZvciAobGV0IHR5cGUgb2YgdHlwZXMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVPZih0eXBlLCAnOjpTdHJpbmcnKSAmJiB2YWx1ZVR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgbGV0IGludGVybmFsVHlwZSA9IGdldEludGVybmFsVHlwZU5hbWUodHlwZSk7XG4gICAgICAgIGlmIChpbnRlcm5hbFR5cGUgJiYgaW50ZXJuYWxUeXBlID09PSB2YWx1ZVR5cGUpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgVmVyaWZ5IHRoYXQgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBgbnVtYmVyYCB0eXBlIChvciBgTnVtYmVyYCBpbnN0YW5jZSksIGFuZCB0aGF0XG4gKiAgIGl0ICoqaXMgbm90KiogYE5hTmAsIGBJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGBudW1iZXJgIChvciBgTnVtYmVyYCBpbnN0YW5jZSkgYW5kIGlzIGFsc28gKipub3QqKiBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAuIGkuZS4gYChpc051bWJlcih2YWx1ZSkgJiYgaXNGaW5pdGUodmFsdWUpKWAuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIFV0aWxzLnR5cGVPZjsuXG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgVXRpbHMuaXNUeXBlOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIChpc1R5cGUodmFsdWUsICc6Ok51bWJlcicpICYmIGlzRmluaXRlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBWZXJpZnkgdGhhdCB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBhIFwicGxhaW5cIi9cInZhbmlsbGFcIiBPYmplY3QgaW5zdGFuY2UuXG4gKlxuICogICBUaGlzIG1ldGhvZCBpcyBpbnRlbmRlZCB0byBoZWxwIHRoZSBjYWxsZXIgZGV0ZWN0IGlmIGFuIG9iamVjdCBpcyBhIFwicmF3IHBsYWluIG9iamVjdFwiLFxuICogICBpbmhlcml0aW5nIGZyb20gYE9iamVjdC5wcm90b3R5cGVgIChvciBhIGBudWxsYCBwcm90b3R5cGUpLlxuICpcbiAqICAgMS4gYGlzUGxhaW5PYmplY3Qoe30pYCB3aWxsIHJldHVybiBgdHJ1ZWAuXG4gKiAgIDIuIGBpc1BsYWluT2JqZWN0KG5ldyBPYmplY3QoKSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgMy4gYGlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSlgIHdpbGwgcmV0dXJuIGB0cnVlYC5cbiAqICAgNC4gYGlzUGxhaW5PYmplY3QobmV3IEN1c3RvbUNsYXNzKCkpYCB3aWxsIHJldHVybiBgZmFsc2VgLlxuICogICA1LiBBbGwgb3RoZXIgaW52b2NhdGlvbnMgc2hvdWxkIHJldHVybiBgZmFsc2VgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIFwicmF3XCIvXCJwbGFpblwiIE9iamVjdCBpbnN0YW5jZS5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgZmFsc2VgIGlzIHJldHVybmVkLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDpleWU6IEBzZWUgVXRpbHMudHlwZU9mOy5cbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBVdGlscy5pc1R5cGU7LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgYSBqYXZhc2NyaXB0IHByaW1pdGl2ZSB0eXBlLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHR5cGVvZiB2YWx1ZWAgaXMgb25lIG9mOiBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCwgYGJpZ2ludGAsIG9yIGBzeW1ib2xgLFxuICogICAgICAqYW5kIGFsc28qIGB2YWx1ZWAgaXMgKm5vdCogYE5hTmAsIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBgdW5kZWZpbmVkYCwgb3IgYG51bGxgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIFV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIEluZmluaXR5KSB8fCBPYmplY3QuaXModmFsdWUsIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgJzo6TnVtYmVyJywgJzo6Qm9vbGVhbicsICc6OkJpZ0ludCcpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRGV0ZWN0IGlmIHRoZSBwcm92aWRlZCBgdmFsdWVgIGlzIGdhcmJhZ2UgY29sbGVjdGFibGUuXG4gKlxuICogICBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGNoZWNrIGlmIGFueSBgdmFsdWVgIGlzIGFsbG93ZWQgdG8gYmUgdXNlZCBhcyBhIHdlYWsgcmVmZXJlbmNlLlxuICpcbiAqICAgRXNzZW50aWFsbHksIHRoaXMgd2lsbCByZXR1cm4gYGZhbHNlYCBmb3IgYW55IHByaW1pdGl2ZSB0eXBlLCBvciBgbnVsbGAsIGB1bmRlZmluZWRgLCBgTmFOYCwgYEluZmluaXR5YCwgb3IgYC1JbmZpbml0eWAgdmFsdWVzLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIGRlc2M6IFZhbHVlIHRvIGNoZWNrXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGJvb2xlYW47XG4gKiAgIDEuIFJldHVybiBgdHJ1ZWAgaWYgYHR5cGVvZiB2YWx1ZWAgaXMgb25lIG9mOiBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCwgYGJpZ2ludGAsIG9yIGBzeW1ib2xgLFxuICogICAgICAqYW5kIGFsc28qIGB2YWx1ZWAgKmlzIG5vdCogYE5hTmAsIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBgdW5kZWZpbmVkYCwgb3IgYG51bGxgLlxuICogICAyLiBPdGhlcndpc2UsIGBmYWxzZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBVdGlscy50eXBlT2Y7LlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIFV0aWxzLmlzVHlwZTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3RhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IE9iamVjdC5pcyh2YWx1ZSwgTmFOKSB8fCBPYmplY3QuaXMoSW5maW5pdHkpIHx8IE9iamVjdC5pcygtSW5maW5pdHkpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJywgJzo6TnVtYmVyJywgJzo6Qm9vbGVhbicsICc6OkJpZ0ludCcpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIERldGVjdCBpZiB0aGUgcHJvdmlkZWQgYHZhbHVlYCBpcyBcImVtcHR5XCIgKGlzICoqTioqdWxsICoqTyoqciAqKkUqKm1wdHkpLlxuICpcbiAqICAgQSB2YWx1ZSBpcyBjb25zaWRlcmVkIFwiZW1wdHlcIiBpZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIG1ldDpcbiAqICAgMS4gYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqICAgMi4gYHZhbHVlYCBpcyBgbnVsbGAuXG4gKiAgIDMuIGB2YWx1ZWAgaXMgYCcnYCAoYW4gZW1wdHkgc3RyaW5nKS5cbiAqICAgNC4gYHZhbHVlYCBpcyBub3QgYW4gZW1wdHkgc3RyaW5nLCBidXQgaXQgY29udGFpbnMgbm90aGluZyBleGNlcHQgd2hpdGVzcGFjZSAoYFxcdGAsIGBcXHJgLCBgXFxzYCwgb3IgYFxcbmApLlxuICogICA1LiBgdmFsdWVgIGlzIGBOYU5gLlxuICogICA2LiBgdmFsdWUubGVuZ3RoYCBpcyBhIGBOdW1iZXJgIG9yIGBudW1iZXJgIHR5cGUsIGFuZCBpcyBlcXVhbCB0byBgMGAuXG4gKiAgIDcuIGB2YWx1ZWAgaXMgYSBAc2VlIFV0aWxzLmlzUGxhaW5PYmplY3Q/Y2FwdGlvbj1wbGFpbitvYmplY3Q7IGFuZCBoYXMgbm8gaXRlcmFibGUga2V5cy5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiBWYWx1ZSB0byBjaGVja1xuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBib29sZWFuO1xuICogICAxLiBSZXR1cm4gYHRydWVgIGlmIGFueSBvZiB0aGUgXCJlbXB0eVwiIGNvbmRpdGlvbnMgYWJvdmUgYXJlIHRydWUuXG4gKiAgIDIuIE90aGVyd2lzZSwgYGZhbHNlYCBpcyByZXR1cm5lZC5cbiAqIG5vdGVzOlxuICogICAtIHxcbiAqICAgICA6ZXllOiBAc2VlIFV0aWxzLmlzTm90Tk9FOy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTk9FKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmIChPYmplY3QuaXModmFsdWUsIE5hTikpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKHZhbHVlID09PSAnJylcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBpZiAoaXNUeXBlKHZhbHVlLCAnOjpTdHJpbmcnKSAmJiAoL15bXFx0XFxzXFxyXFxuXSokLykudGVzdCh2YWx1ZSkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGlzVHlwZSh2YWx1ZS5sZW5ndGgsICc6Ok51bWJlcicpKVxuICAgIHJldHVybiAodmFsdWUubGVuZ3RoID09PSAwKTtcblxuICBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBEZXRlY3QgaWYgdGhlIHByb3ZpZGVkIGB2YWx1ZWAgaXMgKipub3QqKiBcImVtcHR5XCIgKGlzIG5vdCAqKk4qKnVsbCAqKk8qKnIgKipFKiptcHR5KS5cbiAqXG4gKiAgIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBcImVtcHR5XCIgaWYgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBpcyBtZXQ6XG4gKiAgIDEuIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKiAgIDIuIGB2YWx1ZWAgaXMgYG51bGxgLlxuICogICAzLiBgdmFsdWVgIGlzIGAnJ2AgKGFuIGVtcHR5IHN0cmluZykuXG4gKiAgIDQuIGB2YWx1ZWAgaXMgbm90IGFuIGVtcHR5IHN0cmluZywgYnV0IGl0IGNvbnRhaW5zIG5vdGhpbmcgZXhjZXB0IHdoaXRlc3BhY2UgKGBcXHRgLCBgXFxyYCwgYFxcc2AsIG9yIGBcXG5gKS5cbiAqICAgNS4gYHZhbHVlYCBpcyBgTmFOYC5cbiAqICAgNi4gYHZhbHVlLmxlbmd0aGAgaXMgYSBgTnVtYmVyYCBvciBgbnVtYmVyYCB0eXBlLCBhbmQgaXMgZXF1YWwgdG8gYDBgLlxuICogICA3LiBgdmFsdWVgIGlzIGEgQHNlZSBVdGlscy5pc1BsYWluT2JqZWN0P2NhcHRpb249cGxhaW4rb2JqZWN0OyBhbmQgaGFzIG5vIGl0ZXJhYmxlIGtleXMuXG4gKiBhcmd1bWVudHM6XG4gKiAgIC0gbmFtZTogdmFsdWVcbiAqICAgICBkYXRhVHlwZTogYW55XG4gKiAgICAgZGVzYzogVmFsdWUgdG8gY2hlY2tcbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgYm9vbGVhbjtcbiAqICAgMS4gUmV0dXJuIGBmYWxzZWAgaWYgYW55IG9mIHRoZSBcImVtcHR5XCIgY29uZGl0aW9ucyBhYm92ZSBhcmUgdHJ1ZS5cbiAqICAgMi4gT3RoZXJ3aXNlLCBgdHJ1ZWAgaXMgcmV0dXJuZWQuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgaXMgdGhlIGV4YWN0IGludmVyc2Ugb2YgQHNlZSBVdGlscy5pc05PRTtcbiAqICAgLSB8XG4gKiAgICAgOmV5ZTogQHNlZSBVdGlscy5pc05PRTsuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdE5PRSh2YWx1ZSkge1xuICByZXR1cm4gIWlzTk9FKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBbY2FtZWxDYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNDYW1lbF9jYXNlKS5cbiAqXG4gKiAgIFRoZSBwcm9jZXNzIGlzIHJvdWdobHkgYXMgZm9sbG93czpcbiAqICAgMS4gQW55IG5vbi13b3JkIGNoYXJhY3RlcnMgKFthLXpBLVowLTlfXSkgYXJlIHN0cmlwcGVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nLlxuICogICAyLiBBbnkgbm9uLXdvcmQgY2hhcmFjdGVycyAoW2EtekEtWjAtOV9dKSBhcmUgc3RyaXBwZWQgZnJvbSB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gKiAgIDMuIEVhY2ggXCJ3b3JkXCIgaXMgY2FwaXRhbGl6ZWQuXG4gKiAgIDQuIFRoZSBmaXJzdCBsZXR0ZXIgaXMgYWx3YXlzIGxvd2VyLWNhc2VkLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byBjb252ZXJ0IGludG8gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIHN0cmluZzsgVGhlIGZvcm1hdHRlZCBzdHJpbmcgaW4gW2NhbWVsQ2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjQ2FtZWxfY2FzZSkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IFV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMudG9DYW1lbENhc2UoJy0tdGVzdC1zb21lX3ZhbHVlX0AnKSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+ICd0ZXN0U29tZVZhbHVlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9eXFxXLywgJycpXG4gICAgLnJlcGxhY2UoL1tcXFddKyQvLCAnJylcbiAgICAucmVwbGFjZSgvKFtBLVpdKykvZywgJy0kMScpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxXKyguKS9nLCAobSwgcCkgPT4ge1xuICAgICAgcmV0dXJuIHAudG9VcHBlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9eKC4pKC4qKSQvLCAobSwgZiwgbCkgPT4gYCR7Zi50b0xvd2VyQ2FzZSgpfSR7bH1gKTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENvbnZlcnQgdGhlIHByb3ZpZGVkIGBzdHJpbmdgIGB2YWx1ZWAgaW50byBbc25ha2VfY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU25ha2VfY2FzZSkuXG4gKlxuICogICBUaGUgcHJvY2VzcyBpcyByb3VnaGx5IGFzIGZvbGxvd3M6XG4gKiAgIDEuIEFueSBjYXBpdGFsaXplZCBjaGFyYWN0ZXIgc2VxdWVuY2UgaXMgcHJlZml4ZWQgYnkgYW4gdW5kZXJzY29yZS5cbiAqICAgMi4gTW9yZSB0aGFuIG9uZSBzZXF1ZW50aWFsIHVuZGVyc2NvcmVzIGFyZSBjb252ZXJ0ZWQgaW50byBhIHNpbmdsZSB1bmRlcnNjb3JlLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IHN0cmluZ1xuICogICAgIGRlc2M6IFN0cmluZyB0byBjb252ZXJ0IGludG8gW3NuYWtlX2Nhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1NuYWtlX2Nhc2UpLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIGluIFtzbmFrZV9jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNTbmFrZV9jYXNlKS5cbiAqIGV4YW1wbGVzOlxuICogICAtIHxcbiAqICAgICBgYGBqYXZhc2NyaXB0XG4gKiAgICAgaW1wb3J0IHsgVXRpbHMgfSBmcm9tICdteXRoaXgtdWktY29yZUAxLjAnO1xuICpcbiAqICAgICBjb25zb2xlLmxvZyhVdGlscy50b1NuYWtlQ2FzZSgnVGhpc0lzQVNlbnRlbmNlJykpO1xuICogICAgIC8vIG91dHB1dCAtPiAndGhpc19pc19hX3NlbnRlbmNlJ1xuICogICAgIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUpIHtcbiAgcmV0dXJuICgnJyArIHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bQS1aXSsvZywgKG0sIG9mZnNldCkgPT4gKChvZmZzZXQpID8gYF8ke20udG9Mb3dlckNhc2UoKX1gIDogbS50b0xvd2VyQ2FzZSgpKSlcbiAgICAucmVwbGFjZSgvX3syLH0vZywgJ18nKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29udmVydCB0aGUgcHJvdmlkZWQgYHN0cmluZ2AgYHZhbHVlYCBpbnRvIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqXG4gKiAgIFRoZSBwcm9jZXNzIGlzIHJvdWdobHkgYXMgZm9sbG93czpcbiAqICAgMS4gQW55IGNhcGl0YWxpemVkIGNoYXJhY3RlciBzZXF1ZW5jZSBpcyBwcmVmaXhlZCBieSBhIGh5cGhlbi5cbiAqICAgMi4gTW9yZSB0aGFuIG9uZSBzZXF1ZW50aWFsIGh5cGhlbnMgYXJlIGNvbnZlcnRlZCBpbnRvIGEgc2luZ2xlIGh5cGhlbi5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiB2YWx1ZVxuICogICAgIGRhdGFUeXBlOiBzdHJpbmdcbiAqICAgICBkZXNjOiBTdHJpbmcgdG8gdHVybiBpbnRvIFtrZWJhYi1jYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MZXR0ZXJfY2FzZSNLZWJhYl9jYXNlKS5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgc3RyaW5nOyBUaGUgZm9ybWF0dGVkIHN0cmluZyBpbiBba2ViYWItY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjS2ViYWJfY2FzZSkuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IFV0aWxzIH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAqXG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMudG9DYW1lbENhc2UoJ1RoaXNJc0FTZW50ZW5jZScpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ3RoaXMtaXMtYS1zZW50ZW5jZSdcbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvS2ViYWJDYXNlKHZhbHVlKSB7XG4gIHJldHVybiAoJycgKyB2YWx1ZSlcbiAgICAucmVwbGFjZSgvW0EtWl0rL2csIChtLCBvZmZzZXQpID0+ICgob2Zmc2V0KSA/IGAtJHttLnRvTG93ZXJDYXNlKCl9YCA6IG0udG9Mb3dlckNhc2UoKSkpXG4gICAgLnJlcGxhY2UoLy17Mix9L2csICctJylcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRNZXRob2RzKF9wcm90bywgc2tpcFByb3Rvcykge1xuICBsZXQgcHJvdG8gICAgICAgICAgID0gX3Byb3RvO1xuICBsZXQgYWxyZWFkeVZpc2l0ZWQgID0gbmV3IFNldCgpO1xuXG4gIHdoaWxlIChwcm90bykge1xuICAgIGlmIChwcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvKTtcbiAgICBsZXQga2V5cyAgICAgICAgPSBPYmplY3Qua2V5cyhkZXNjcmlwdG9ycykuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZGVzY3JpcHRvcnMpKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGtleXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InIHx8IGtleSA9PT0gJ3Byb3RvdHlwZScpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBpZiAoYWxyZWFkeVZpc2l0ZWQuaGFzKGtleSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQoa2V5KTtcblxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yc1trZXldO1xuXG4gICAgICAvLyBDYW4gaXQgYmUgY2hhbmdlZD9cbiAgICAgIGlmIChkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBJZiBpcyBnZXR0ZXIsIHRoZW4gc2tpcFxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAnZ2V0JykgfHwgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICdzZXQnKSkge1xuICAgICAgICBsZXQgbmV3RGVzY3JpcHRvciA9IHsgLi4uZGVzY3JpcHRvciB9O1xuICAgICAgICBpZiAobmV3RGVzY3JpcHRvci5nZXQpXG4gICAgICAgICAgbmV3RGVzY3JpcHRvci5nZXQgPSBuZXdEZXNjcmlwdG9yLmdldC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGlmIChuZXdEZXNjcmlwdG9yLnNldClcbiAgICAgICAgICBuZXdEZXNjcmlwdG9yLnNldCA9IG5ld0Rlc2NyaXB0b3Iuc2V0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgbmV3RGVzY3JpcHRvcik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXG4gICAgICAvLyBTa2lwIHByb3RvdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KGtleSkgJiYgT2JqZWN0LnByb3RvdHlwZVtrZXldID09PSB2YWx1ZSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7IC4uLmRlc2NyaXB0b3IsIHZhbHVlOiB2YWx1ZS5iaW5kKHRoaXMpIH0pO1xuICAgIH1cblxuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICBpZiAocHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICBicmVhaztcblxuICAgIGlmIChza2lwUHJvdG9zICYmIHNraXBQcm90b3MuaW5kZXhPZihwcm90bykgPj0gMClcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmNvbnN0IE1FVEFEQVRBX1NUT1JBR0UgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9jb21wb25lbnQvY29uc3RhbnRzL21ldGFkYXRhLXN0b3JhZ2UnKTtcbmNvbnN0IE1FVEFEQVRBX1dFQUtNQVAgPSBnbG9iYWxUaGlzLm15dGhpeFVJW01FVEFEQVRBX1NUT1JBR0VdID0gKGdsb2JhbFRoaXMubXl0aGl4VUlbTUVUQURBVEFfU1RPUkFHRV0pID8gZ2xvYmFsVGhpcy5teXRoaXhVSVtNRVRBREFUQV9TVE9SQUdFXSA6IG5ldyBXZWFrTWFwKCk7XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBTdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEgb24gYW55IGdhcmJhZ2UtY29sbGVjdGFibGUgcmVmZXJlbmNlLlxuICpcbiAqICAgVGhpcyBmdW5jdGlvbiB1c2VzIGFuIGludGVybmFsIFdlYWtNYXAgdG8gc3RvcmUgbWV0YWRhdGEgZm9yIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHZhbHVlLlxuICpcbiAqICAgVGhlIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQgd2lsbCBjaGFuZ2UgdGhlIGJlaGF2aW9yIG9mIHRoaXMgZnVuY3Rpb246XG4gKiAgIDEuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHN1cHBsaWVkIChhIGB0YXJnZXRgKSwgdGhlbiBhIE1hcCBvZiBtZXRhZGF0YSBrZXkvdmFsdWUgcGFpcnMgaXMgcmV0dXJuZWQuXG4gKiAgIDIuIElmIG9ubHkgdHdvIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIHRoZW4gYG1ldGFkYXRhYCBhY3RzIGFzIGEgZ2V0dGVyLCBhbmQgdGhlIHZhbHVlIHN0b3JlZCB1bmRlciB0aGUgc3BlY2lmaWVkIGBrZXlgIGlzIHJldHVybmVkLlxuICogICAzLiBJZiBtb3JlIHRoYW4gdHdvIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQsIHRoZW4gYG1ldGFkYXRhYCBhY3RzIGFzIGEgc2V0dGVyLCBhbmQgYHRhcmdldGAgaXMgcmV0dXJuZWQgKGZvciBjb250aW51ZWQgY2hhaW5pbmcpLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHRhcmdldFxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGlzIGlzIHRoZSB2YWx1ZSBmb3Igd2hpY2ggbWV0YWRhdGEgaXMgYmVpbmcgc3RvcmVkIG9yIHJldHJpZXZlZC5cbiAqICAgICAgIFRoaXMgY2FuIGJlIGFueSBnYXJiYWdlLWNvbGxlY3RhYmxlIHZhbHVlIChhbnkgdmFsdWUgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGtleSBpbiBhIFdlYWtNYXApLlxuICogICAtIG5hbWU6IGtleVxuICogICAgIGRhdGFUeXBlOiBhbnlcbiAqICAgICBvcHRpb25hbDogdHJ1ZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBrZXkgdXNlZCB0byBzdG9yZSBvciBmZXRjaCB0aGUgc3BlY2lmaWVkIG1ldGFkYXRhIHZhbHVlLiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUsIGFzIHRoZSB1bmRlcmx5aW5nXG4gKiAgICAgICBzdG9yYWdlIGlzIGEgTWFwLlxuICogICAtIG5hbWU6IHZhbHVlXG4gKiAgICAgZGF0YVR5cGU6IGFueVxuICogICAgIG9wdGlvbmFsOiB0cnVlXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHZhbHVlIHRvIHN0b3JlIG9uIHRoZSBgdGFyZ2V0YCB1bmRlciB0aGUgc3BlY2lmaWVkIGBrZXlgLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBhbnk7XG4gKiAgIDEuIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkIChhIGJ1bGsgZ2V0IG9wZXJhdGlvbiksIHJldHVybiBhIE1hcCBjb250YWluaW5nIHRoZSBtZXRhZGF0YSBmb3IgdGhlIHNwZWNpZmllZCBgdGFyZ2V0YC5cbiAqICAgMi4gSWYgdHdvIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgKGEgZ2V0IG9wZXJhdGlvbiksIHRoZSBgdGFyZ2V0YCBtZXRhZGF0YSB2YWx1ZSBzdG9yZWQgZm9yIHRoZSBzcGVjaWZpZWQgYGtleWAuXG4gKiAgIDIuIElmIG1vcmUgdGhhbiB0d28gYXJndW1lbnRzIGFyZSBwcm92aWRlZCAoYSBzZXQgb3BlcmF0aW9uKSwgdGhlIHByb3ZpZGVkIGB0YXJnZXRgIGlzIHJldHVybmVkLlxuICogZXhhbXBsZXM6XG4gKiAgIC0gfFxuICogICAgIGBgYGphdmFzY3JpcHRcbiAqICAgICBpbXBvcnQgeyBVdGlscyB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIC8vIHNldFxuICogICAgIFV0aWxzLm1ldGFkYXRhKG15RWxlbWVudCwgJ2N1c3RvbUNhcHRpb24nLCAnTWV0YWRhdGEgQ2FwdGlvbiEnKTtcbiAqXG4gKiAgICAgLy8gZ2V0XG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMubWV0YWRhdGEobXlFbGVtZW50LCAnY3VzdG9tQ2FwdGlvbicpKTtcbiAqICAgICAvLyBvdXRwdXQgLT4gJ01ldGFkYXRhIENhcHRpb24hJ1xuICpcbiAqICAgICAvLyBnZXQgYWxsXG4gKiAgICAgY29uc29sZS5sb2coVXRpbHMubWV0YWRhdGEobXlFbGVtZW50KSk7XG4gKiAgICAgLy8gb3V0cHV0IC0+IE1hcCgxKSB7ICdjdXN0b21DYXB0aW9uJyA9PiAnTWV0YWRhdGEgQ2FwdGlvbiEnIH1cbiAqICAgICBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ldGFkYXRhKHRhcmdldCwga2V5LCB2YWx1ZSkge1xuICBsZXQgZGF0YSA9IE1FVEFEQVRBX1dFQUtNQVAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGF0YSkge1xuICAgIGlmICghaXNDb2xsZWN0YWJsZSh0YXJnZXQpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gc2V0IG1ldGFkYXRhIG9uIHByb3ZpZGVkIG9iamVjdDogJHsodHlwZW9mIHRhcmdldCA9PT0gJ3N5bWJvbCcpID8gdGFyZ2V0LnRvU3RyaW5nKCkgOiB0YXJnZXR9YCk7XG5cbiAgICBkYXRhID0gbmV3IE1hcCgpO1xuICAgIE1FVEFEQVRBX1dFQUtNQVAuc2V0KHRhcmdldCwgZGF0YSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICByZXR1cm4gZGF0YTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMilcbiAgICByZXR1cm4gKGRhdGEpID8gZGF0YS5nZXQoa2V5KSA6IHVuZGVmaW5lZDtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgRG8gb3VyIGJlc3QgdG8gZW11bGF0ZSBbcHJvY2Vzcy5uZXh0VGlja10oaHR0cHM6Ly9ub2RlanMub3JnL2VuL2d1aWRlcy9ldmVudC1sb29wLXRpbWVycy1hbmQtbmV4dHRpY2svI3Byb2Nlc3NuZXh0dGljaylcbiAqICAgaW4gdGhlIGJyb3dzZXIuXG4gKlxuICogICBJbiBvcmRlciB0byB0cnkgYW5kIGVtdWxhdGUgYHByb2Nlc3MubmV4dFRpY2tgLCB0aGlzIGZ1bmN0aW9uIHdpbGwgdXNlIGBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBjYWxsYmFjaygpKWAgaWYgYXZhaWxhYmxlLFxuICogICBvdGhlcndpc2UgaXQgd2lsbCBmYWxsYmFjayB0byB1c2luZyBgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjaylgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGNhbGxiYWNrXG4gKiAgICAgZGF0YVR5cGU6IGZ1bmN0aW9uXG4gKiAgICAgZGVzYzogQ2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCBvbiBcIm5leHRUaWNrXCIuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgZnVuY3Rpb24gd2lsbCBwcmVmZXIgYW5kIHVzZSBgcHJvY2Vzcy5uZXh0VGlja2AgaWYgaXQgaXMgYXZhaWxhYmxlIChpLmUuIGlmIHJ1bm5pbmcgb24gTm9kZUpTKS5cbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IFRoaXMgZnVuY3Rpb24gaXMgdW5saWtlbHkgdG8gYWN0dWFsbHkgYmUgdGhlIG5leHQgXCJ0aWNrXCIgb2YgdGhlIHVuZGVybHlpbmdcbiAqICAgICBqYXZhc2NyaXB0IGVuZ2luZS4gVGhpcyBtZXRob2QganVzdCBkb2VzIGl0cyBiZXN0IHRvIGVtdWxhdGUgXCJuZXh0VGlja1wiLiBJbnN0ZWFkIG9mIHRoZVxuICogICAgIGFjdHVhbCBcIm5leHQgdGlja1wiLCB0aGlzIHdpbGwgaW5zdGVhZCBiZSBcImFzIGZhc3QgYXMgcG9zc2libGVcIi5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgZnVuY3Rpb24gZGVsaWJlcmF0ZWx5IGF0dGVtcHRzIHRvIHVzZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBmaXJzdC0tZXZlbiB0aG91Z2ggaXQgbGlrZWx5IGRvZXNuJ3RcbiAqICAgICBoYXZlIHRoZSBmYXN0ZXN0IHR1cm4tYXJvdW5kLXRpbWUtLXRvIHNhdmUgYmF0dGVyeSBwb3dlci4gVGhlIGlkZWEgYmVpbmcgdGhhdCBcInNvbWV0aGluZyBuZWVkcyB0byBiZSBkb25lICpzb29uKlwiLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGdsb2JhbFRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBEWU5BTUlDX1BST1BFUlRZX1ZBTFVFICAgICAgPSBTeW1ib2wuZm9yKCdAbXl0aGl4L215dGhpeC11aS9keW5hbWljLXByb3BlcnR5L2NvbnN0YW50cy92YWx1ZScpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9JU19TRVRUSU5HID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvaXMtc2V0dGluZycpO1xuY29uc3QgRFlOQU1JQ19QUk9QRVJUWV9TRVQgICAgICAgID0gU3ltYm9sLmZvcignQG15dGhpeC9teXRoaXgtdWkvZHluYW1pYy1wcm9wZXJ0eS9jb25zdGFudHMvc2V0Jyk7XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBgRHluYW1pY1Byb3BlcnR5YCBpcyBhIHNpbXBsZSB2YWx1ZSBzdG9yYWdlIGNsYXNzIHdyYXBwZWQgaW4gYSBQcm94eS5cbiAqXG4gKiAgICBJdCB3aWxsIGFsbG93IHRoZSB1c2VyIHRvIHN0b3JlIGFueSBkZXNpcmVkIHZhbHVlLiBUaGUgY2F0Y2ggaG93ZXZlciBpcyB0aGF0XG4gKiAgICBhbnkgdmFsdWUgc3RvcmVkIGNhbiBvbmx5IGJlIHNldCB0aHJvdWdoIGl0cyBzcGVjaWFsIGBzZXRgIG1ldGhvZC5cbiAqXG4gKiAgICBUaGlzIHdpbGwgYWxsb3cgYW55IGxpc3RlbmVycyB0byByZWNlaXZlIHRoZSBgJ3VwZGF0ZSdgIGV2ZW50IHdoZW4gYSB2YWx1ZSBpcyBzZXQuXG4gKlxuICogICAgU2luY2UgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2VzIGFyZSBhbHNvIGFsd2F5cyB3cmFwcGVkIGluIGEgUHJveHksIHRoZSB1c2VyIG1heVxuICogICAgXCJkaXJlY3RseVwiIGFjY2VzcyBhdHRyaWJ1dGVzIG9mIHRoZSBzdG9yZWQgdmFsdWUuIEZvciBleGFtcGxlLCBpZiBhIGBEeW5hbWljUHJvcGVydHlgXG4gKiAgICBpcyBzdG9yaW5nIGFuIEFycmF5IGluc3RhbmNlLCB0aGVuIG9uZSB3b3VsZCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgYC5sZW5ndGhgIHByb3BlcnR5XG4gKiAgICBcImRpcmVjdGx5XCIsIGkuZS4gYGR5bmFtaWNQcm9wLmxlbmd0aGAuXG4gKlxuICogICAgYER5bmFtaWNQcm9wZXJ0eWAgaGFzIGEgc3BlY2lhbCBgc2V0YCBtZXRob2QsIHdob3NlIG5hbWUgaXMgYSBgc3ltYm9sYCwgdG8gYXZvaWQgY29uZmxpY3RpbmdcbiAqICAgIG5hbWVzcGFjZXMgd2l0aCB0aGUgdW5kZXJseWluZyBkYXRhdHlwZSAoYW5kIHRoZSB3cmFwcGluZyBQcm94eSkuXG4gKiAgICBUbyBzZXQgYSB2YWx1ZSBvbiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCBvbmUgbXVzdCBkbyBzbyBhcyBmb2xsb3dzOiBgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKG15TmV3VmFsdWUpYC5cbiAqICAgIFRoaXMgd2lsbCB1cGRhdGUgdGhlIGludGVybmFsIHZhbHVlLCBhbmQgaWYgdGhlIHNldCB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIHN0b3JlZCB2YWx1ZSwgdGhlIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvXG4gKiAgICBhbnkgbGlzdGVuZXJzLlxuICpcbiAqICAgIEFzIGBEeW5hbWljUHJvcGVydHlgIGlzIGFuIFtFdmVudFRhcmdldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0V2ZW50VGFyZ2V0L0V2ZW50VGFyZ2V0KSwgb25lIGNhbiBhdHRhY2hcbiAqICAgIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgYCd1cGRhdGUnYCBldmVudCB0byBsaXN0ZW4gZm9yIHVwZGF0ZXMgdG8gdGhlIHVuZGVybHlpbmcgdmFsdWUuIFRoZSBgJ3VwZGF0ZSdgIGV2ZW50IGlzIHRoZSBvbmx5IGV2ZW50IHRoYXQgaXNcbiAqICAgIGV2ZXIgdHJpZ2dlcmVkIGJ5IHRoaXMgY2xhc3MuIFRoZSByZWNlaXZlZCBgZXZlbnRgIGluc3RhbmNlIGluIGV2ZW50IGNhbGxiYWNrcyB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzOlxuICogICAgMS4gYHVwZGF0ZUV2ZW50Lm9yaWdpbmF0b3IgPSB0aGlzO2AgLSBgb3JpZ2luYXRvcmAgaXMgdGhlIGluc3RhbmNlIG9mIHRoZSBgRHluYW1pY1Byb3BlcnR5YCB3aGVyZSB0aGUgZXZlbnQgb3JpZ2luYXRlZCBmcm9tLlxuICogICAgMi4gYHVwZGF0ZUV2ZW50Lm9sZFZhbHVlID0gY3VycmVudFZhbHVlO2AgLSBgb2xkVmFsdWVgIGNvbnRhaW5zIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgYmVmb3JlIHNldC5cbiAqICAgIDMuIGB1cGRhdGVFdmVudC52YWx1ZSA9IG5ld1ZhbHVlO2AgLSBgdmFsdWVgIGNvbnRhaW5zIHRoZSBjdXJyZW50IHZhbHVlIGJlaW5nIHNldCBvbiB0aGUgYER5bmFtaWNQcm9wZXJ0eWAuXG4gKlxuICogICAgVG8gcmV0cmlldmUgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAsIG9uZSBtYXkgY2FsbCBgdmFsdWVPZigpYDogYGxldCByYXdWYWx1ZSA9IGR5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCk7YFxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZXMgd2lsbCBpbnRlcm5hbGx5IHRyYWNrIHdoZW4gYSBgc2V0YCBvcGVyYXRpb24gaXMgdW5kZXJ3YXksIHRvIHByZXZlbnRcbiAqICAgICBjeWNsaWMgc2V0cyBhbmQgbWF4aW11bSBjYWxsIHN0YWNrIGVycm9ycy4gWW91IGFyZSBhbGxvd2VkIHRvIHNldCB0aGUgdmFsdWUgcmVjdXJzaXZlbHksIGhvd2V2ZXIgYHVwZGF0ZWAgZXZlbnRzXG4gKiAgICAgd2lsbCBvbmx5IGJlIGRpc3BhdGNoZWQgZm9yIHRoZSBmaXJzdCBgc2V0YCBjYWxsLiBBbnkgYHNldGAgb3BlcmF0aW9uIHRoYXQgaGFwcGVucyB3aGlsZSBhbm90aGVyIGBzZXRgIG9wZXJhdGlvbiBpc1xuICogICAgIHVuZGVyd2F5IHdpbGwgKipub3QqKiBkaXNwYXRjaCBhbnkgYCd1cGRhdGUnYCBldmVudHMuXG4gKiAgIC0gfFxuICogICAgIGAndXBkYXRlJ2AgZXZlbnRzIHdpbGwgYmUgZGlzcGF0Y2hlZCBpbW1lZGlhdGVseSAqYWZ0ZXIqIHRoZSBpbnRlcm5hbCB1bmRlcmx5aW5nIHN0b3JlZCB2YWx1ZSBpcyB1cGRhdGVkLiBUaG91Z2ggaXQgaXNcbiAqICAgICBwb3NzaWJsZSB0byBgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uYCBpbiBhbiBldmVudCBjYWxsYmFjaywgYXR0ZW1wdGluZyB0byBcInByZXZlbnREZWZhdWx0XCIgb3IgXCJzdG9wUHJvcGFnYXRpb25cIiB3aWxsIGRvIG5vdGhpbmcuXG4gKiBleGFtcGxlczpcbiAqICAgLSB8XG4gKiAgICAgYGBgamF2YXNjcmlwdFxuICogICAgIGltcG9ydCB7IER5bmFtaWNQcm9wZXJ0eSB9IGZyb20gJ215dGhpeC11aS1jb3JlQDEuMCc7XG4gKlxuICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gKlxuICogICAgIGR5bmFtaWNQcm9wZXJ0eS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICogICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgVmFsdWUgPSAnJHtkeW5hbWljUHJvcGVydHkudmFsdWVPZigpfSdgKTtcbiAqICAgICB9KTtcbiAqXG4gKiAgICAgZHluYW1pY1Byb3BlcnR5W0R5bmFtaWNQcm9wZXJ0eS5zZXRdKCduZXcgdmFsdWUnKTtcbiAqXG4gKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICogICAgIC8vIG91dHB1dCAtPiBDdXJyZW50IFZhbHVlID0gJ2luaXRpYWwgdmFsdWUnXG4gKiAgICAgYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbWljUHJvcGVydHkgZXh0ZW5kcyBFdmVudFRhcmdldCB7XG4gIHN0YXRpYyBbU3ltYm9sLmhhc0luc3RhbmNlXShpbnN0YW5jZSkgeyAvLyBAcmVmOl9teXRoaXhUeXBlRXhhbXBsZVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGluc3RhbmNlICYmIGluc3RhbmNlW01ZVEhJWF9UWVBFXSA9PT0gRFlOQU1JQ19QUk9QRVJUWV9UWVBFKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHR5cGU6IFByb3BlcnR5XG4gICAqIG5hbWU6IHNldFxuICAgKiBncm91cE5hbWU6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBwYXJlbnQ6IER5bmFtaWNQcm9wZXJ0eVxuICAgKiBzdGF0aWM6IHRydWVcbiAgICogZGVzYzogfFxuICAgKiAgIEEgc3BlY2lhbCBgc3ltYm9sYCB1c2VkIHRvIGFjY2VzcyB0aGUgYHNldGAgbWV0aG9kIG9mIGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGV4YW1wbGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgYGBgamF2YXNjcmlwdFxuICAgKiAgICAgaW1wb3J0IHsgRHluYW1pY1Byb3BlcnR5IH0gZnJvbSAnbXl0aGl4LXVpLWNvcmVAMS4wJztcbiAgICpcbiAgICogICAgIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KCdpbml0aWFsIHZhbHVlJyk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHkuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKGV2ZW50KSA9PiB7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGBEeW5hbWljIFByb3BlcnR5IFVwZGF0ZWQhIE5ldyB2YWx1ZSA9ICcke2V2ZW50LnZhbHVlfScsIFByZXZpb3VzIFZhbHVlID0gJyR7ZXZlbnQub2xkVmFsdWV9J2ApO1xuICAgKiAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCBWYWx1ZSA9ICcke2R5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mKCl9J2ApO1xuICAgKiAgICAgfSk7XG4gICAqXG4gICAqICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oJ25ldyB2YWx1ZScpO1xuICAgKlxuICAgKiAgICAgLy8gb3V0cHV0IC0+IER5bmFtaWMgUHJvcGVydHkgVXBkYXRlZCEgTmV3IHZhbHVlID0gJ25ldyB2YWx1ZScsIE9sZCBWYWx1ZSA9ICdpbml0aWFsIHZhbHVlJ1xuICAgKiAgICAgLy8gb3V0cHV0IC0+IEN1cnJlbnQgVmFsdWUgPSAnaW5pdGlhbCB2YWx1ZSdcbiAgICogICAgIGBgYFxuICAgKi9cbiAgc3RhdGljIHNldCA9IERZTkFNSUNfUFJPUEVSVFlfU0VUOyAvLyBAcmVmOkR5bmFtaWNQcm9wZXJ0eS5zZXRcblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogbmFtZTogY29uc3RydWN0b3JcbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBVdGlsc1xuICAgKiBkZXNjOiB8XG4gICAqICAgQ29uc3RydWN0IGEgYER5bmFtaWNQcm9wZXJ0eWAuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IGluaXRpYWxWYWx1ZVxuICAgKiAgICAgZGF0YVR5cGU6IGFueVxuICAgKiAgICAgZGVzYzpcbiAgICogICAgICAgVGhlIGluaXRpYWwgdmFsdWUgdG8gc3RvcmUuXG4gICAqIG5vdGVzOlxuICAgKiAgIC0gfFxuICAgKiAgICAgOmluZm86IFRoaXMgd2lsbCByZXR1cm4gYSBQcm94eSBpbnN0YW5jZSB3cmFwcGluZyB0aGUgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogWW91IGNhbiBub3Qgc2V0IGEgYER5bmFtaWNQcm9wZXJ0eWAgdG8gYW5vdGhlciBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZS5cbiAgICogICAgIElmIGBpbml0aWFsVmFsdWVgIGlzIGEgYER5bmFtaWNQcm9wZXJ0eWAgaW5zdGFuY2UsIGl0IHdpbGwgdXNlIHRoZSBzdG9yZWQgdmFsdWVcbiAgICogICAgIG9mIHRoYXQgaW5zdGFuY2UgaW5zdGVhZCAoYnkgY2FsbGluZyBAc2VlIER5bmFtaWNQcm9wZXJ0eS52YWx1ZU9mOykuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsVmFsdWUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgW01ZVEhJWF9UWVBFXToge1xuICAgICAgICB3cml0YWJsZTogICAgIHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6ICAgZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6ICAgICAgICBEWU5BTUlDX1BST1BFUlRZX1RZUEUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdOiB7XG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogICBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogICAgICAgIChpc1R5cGUoaW5pdGlhbFZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSA/IGluaXRpYWxWYWx1ZS52YWx1ZU9mKCkgOiBpbml0aWFsVmFsdWUsXG4gICAgICB9LFxuICAgICAgW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR106IHtcbiAgICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAgICAgICAgZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHByb3h5ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogICh0YXJnZXQsIHByb3BOYW1lKSA9PiB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcE5hbWVdO1xuICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLmJpbmQodGFyZ2V0KSA6IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdW3Byb3BOYW1lXTtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgPyB2YWx1ZS5iaW5kKHRhcmdldFtEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSkgOiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6ICAodGFyZ2V0LCBwcm9wTmFtZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHByb3BOYW1lIGluIHRhcmdldClcbiAgICAgICAgICB0YXJnZXRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YXJnZXRbRFlOQU1JQ19QUk9QRVJUWV9WQUxVRV1bcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJylcbiAgICAgIHJldHVybiArdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgICBlbHNlIGlmIChoaW50ID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAoJycgKyB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdHlwZTogRnVuY3Rpb25cbiAgICogZ3JvdXBOYW1lOiBEeW5hbWljUHJvcGVydHlcbiAgICogcGFyZW50OiBEeW5hbWljUHJvcGVydHlcbiAgICogZGVzYzogfFxuICAgKiAgIEZldGNoIHRoZSB1bmRlcmx5aW5nIHJhdyB2YWx1ZSBzdG9yZWQgYnkgdGhpcyBgRHluYW1pY1Byb3BlcnR5YC5cbiAgICogcmV0dXJuOiB8XG4gICAqICAgQHR5cGVzOiBhbnk7IFRoZSB1bmRlcmxpbmcgcmF3IHZhbHVlLlxuICAgKi9cbiAgdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0eXBlOiBGdW5jdGlvblxuICAgKiBuYW1lOiBcIltEeW5hbWljUHJvcGVydHkuc2V0XVwiXG4gICAqIGdyb3VwTmFtZTogRHluYW1pY1Byb3BlcnR5XG4gICAqIHBhcmVudDogRHluYW1pY1Byb3BlcnR5XG4gICAqIGRlc2M6IHxcbiAgICogICBTZXQgdGhlIHVuZGVybHlpbmcgcmF3IHZhbHVlIHN0b3JlZCBieSB0aGlzIGBEeW5hbWljUHJvcGVydHlgLlxuICAgKlxuICAgKiAgIElmIHRoZSBjdXJyZW50IHN0b3JlZCB2YWx1ZSBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIHRoZSBwcm92aWRlZCBgdmFsdWVgLFxuICAgKiAgIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuLlxuICAgKlxuICAgKiAgIE90aGVyd2lzZSwgd2hlbiB0aGUgdW5kZXJseWluZyB2YWx1ZSBpcyB1cGRhdGVkLCBgdGhpcy5kaXNwYXRjaEV2ZW50YCB3aWxsXG4gICAqICAgYmUgY2FsbGVkIHRvIGRpc3BhdGNoIGFuIGAndXBkYXRlJ2AgZXZlbnQgdG8gbm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCB0aGVcbiAgICogICB1bmRlcmx5aW5nIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQuXG4gICAqIGFyZ3VtZW50czpcbiAgICogICAtIG5hbWU6IG5ld1ZhbHVlXG4gICAqICAgICBkYXRhVHlwZTogYW55XG4gICAqICAgICBkZXNjOiB8XG4gICAqICAgICAgIFRoZSBuZXcgdmFsdWUgdG8gc2V0LiBJZiB0aGlzIGlzIGl0c2VsZiBhIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLCB0aGVuXG4gICAqICAgICAgIGl0IHdpbGwgYmUgdW53cmFwcGVkIHRvIGl0cyB1bmRlcmx5aW5nIHZhbHVlLCBhbmQgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHZhbHVlIGluc3RlYWQuXG4gICAqICAgLSBuYW1lOiBvcHRpb25zXG4gICAqICAgICBvcHRpb25hbDogdHJ1ZVxuICAgKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICAgKiAgICAgZGVzYzogfFxuICAgKiAgICAgICBBbiBvYmplY3QgdG8gcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIG9wZXJhdGlvbi4gVGhlIHNoYXBlIG9mIHRoaXMgb2JqZWN0IGlzIGB7IGRpc3BhdGNoVXBkYXRlRXZlbnQ6IGJvb2xlYW4gfWAuXG4gICAqICAgICAgIElmIGBvcHRpb25zLmRpc3BhdGNoVXBkYXRlRXZlbnRgIGVxdWFscyBgZmFsc2VgLCB0aGVuIG5vIGAndXBkYXRlJ2AgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIHRvIGxpc3RlbmVycy5cbiAgICogbm90ZXM6XG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogSWYgdGhlIHVuZGVybHlpbmcgc3RvcmVkIHZhbHVlIGlzIGV4YWN0bHkgdGhlIHNhbWUgYXMgdGhlIHZhbHVlIHByb3ZpZGVkLFxuICAgKiAgICAgdGhlbiBub3RoaW5nIHdpbGwgaGFwcGVuLCBhbmQgdGhlIG1ldGhvZCB3aWxsIHNpbXBseSByZXR1cm4uXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogVGhlIHVuZGVybHlpbmcgdmFsdWUgaXMgdXBkYXRlZCAqYmVmb3JlKiBkaXNwYXRjaGluZyBldmVudHMuXG4gICAqICAgLSB8XG4gICAqICAgICA6aW5mbzogYER5bmFtaWNQcm9wZXJ0eWAgcHJvdGVjdHMgYWdhaW5zdCBjeWNsaWMgZXZlbnQgY2FsbGJhY2tzLiBJZiBhblxuICAgKiAgICAgZXZlbnQgY2FsbGJhY2sgYWdhaW4gc2V0cyB0aGUgdW5kZXJseWluZyBgRHluYW1pY1Byb3BlcnR5YCB2YWx1ZSwgdGhlblxuICAgKiAgICAgdGhlIHZhbHVlIHdpbGwgYmUgc2V0LCBidXQgbm8gZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkICh0byBwcmV2ZW50IGV2ZW50IGxvb3BzKS5cbiAgICogICAtIHxcbiAgICogICAgIDppbmZvOiBZb3UgY2FuIG5vdCBzZXQgYSBgRHluYW1pY1Byb3BlcnR5YCB0byBhbm90aGVyIGBEeW5hbWljUHJvcGVydHlgIGluc3RhbmNlLlxuICAgKiAgICAgSWYgdGhpcyBtZXRob2QgcmVjZWl2ZXMgYSBgRHluYW1pY1Byb3BlcnR5YCBpbnN0YW5jZSwgaXQgd2lsbCB1c2UgdGhlIHN0b3JlZCB2YWx1ZVxuICAgKiAgICAgb2YgdGhhdCBpbnN0YW5jZSBpbnN0ZWFkIChieSBjYWxsaW5nIEBzZWUgRHluYW1pY1Byb3BlcnR5LnZhbHVlT2Y7KS5cbiAgICovXG4gIFtEWU5BTUlDX1BST1BFUlRZX1NFVF0oX25ld1ZhbHVlLCBfb3B0aW9ucykge1xuICAgIGxldCBuZXdWYWx1ZSA9IF9uZXdWYWx1ZTtcbiAgICBpZiAoaXNUeXBlKG5ld1ZhbHVlLCBEeW5hbWljUHJvcGVydHkpKVxuICAgICAgbmV3VmFsdWUgPSBuZXdWYWx1ZS52YWx1ZU9mKCk7XG5cbiAgICBpZiAodGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9PT0gbmV3VmFsdWUpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAodGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddKSB7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdID0gbmV3VmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfSVNfU0VUVElOR10gPSB0cnVlO1xuXG4gICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzW0RZTkFNSUNfUFJPUEVSVFlfVkFMVUVdO1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX1ZBTFVFXSA9IG5ld1ZhbHVlO1xuXG4gICAgICBpZiAob3B0aW9ucy5kaXNwYXRjaFVwZGF0ZUV2ZW50ID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBsZXQgdXBkYXRlRXZlbnQgPSBuZXcgRXZlbnQoJ3VwZGF0ZScpO1xuXG4gICAgICB1cGRhdGVFdmVudC5vcmlnaW5hdG9yID0gdGhpcztcbiAgICAgIHVwZGF0ZUV2ZW50Lm9sZFZhbHVlID0gb2xkVmFsdWU7XG4gICAgICB1cGRhdGVFdmVudC52YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodXBkYXRlRXZlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpc1tEWU5BTUlDX1BST1BFUlRZX0lTX1NFVFRJTkddID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFZBTElEX0pTX0lERU5USUZJRVIgPSAvXlthLXpBLVpfJF1bYS16QS1aMC05XyRdKiQvO1xuZnVuY3Rpb24gZ2V0Q29udGV4dENhbGxBcmdzKGNvbnRleHQsIC4uLmV4dHJhQ29udGV4dHMpIHtcbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IEFycmF5LmZyb20oXG4gICAgbmV3IFNldChnZXRBbGxQcm9wZXJ0eU5hbWVzKGNvbnRleHQpLmNvbmNhdChcbiAgICAgIE9iamVjdC5rZXlzKGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUgfHwge30pLFxuICAgICAgWyAnYXR0cmlidXRlcycsICdjbGFzc0xpc3QnLCAnJCQnLCAnaTE4bicgXSxcbiAgICAgIC4uLmV4dHJhQ29udGV4dHMubWFwKChleHRyYUNvbnRleHQpID0+IE9iamVjdC5rZXlzKGV4dHJhQ29udGV4dCB8fCB7fSkpLFxuICAgICkpLFxuICApLmZpbHRlcigobmFtZSkgPT4ge1xuICAgIGlmIChuYW1lID09PSAndGhpcycpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gVkFMSURfSlNfSURFTlRJRklFUi50ZXN0KG5hbWUpXG4gIH0pO1xuXG4gIHJldHVybiBgeyR7Y29udGV4dENhbGxBcmdzLmpvaW4oJywnKX19YDtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIEdldCB0aGUgcGFyZW50IE5vZGUgb2YgYGVsZW1lbnRgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IGVsZW1lbnRcbiAqICAgICBkYXRhVHlwZTogTm9kZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBOb2RlIHdob3NlIHBhcmVudCB5b3Ugd2lzaCB0byBmaW5kLlxuICogbm90ZXM6XG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiBVbmxpa2UgW05vZGUucGFyZW50Tm9kZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcGFyZW50Tm9kZSksIHRoaXNcbiAqICAgICB3aWxsIGFsc28gc2VhcmNoIGFjcm9zcyBTaGFkb3cgRE9NIGJvdW5kYXJpZXMuXG4gKiAgIC0gfFxuICogICAgIDp3YXJuaW5nOiAqKlNlYXJjaGluZyBhY3Jvc3MgU2hhZG93IERPTSBib3VuZGFyaWVzIG9ubHkgd29ya3MgZm9yIE15dGhpeCBVSSBjb21wb25lbnRzISoqXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBTZWFyY2hpbmcgYWNyb3NzIFNoYWRvdyBET00gYm91bmRhcmllcyBpcyBhY2NvbXBsaXNoZWQgdmlhIGxldmVyYWdpbmcgQHNlZSBNeXRoaXhVSUNvbXBvbmVudC5tZXRhZGF0YTsgb25cbiAqICAgICBgZWxlbWVudGAuIFdoZW4gYSBgbnVsbGAgcGFyZW50IGlzIGVuY291bnRlcmVkLCBgZ2V0UGFyZW50Tm9kZWAgd2lsbCBsb29rIGZvciBAc2VlIE15dGhpeFVJQ29tcG9uZW50Lm1ldGFkYXRhP2NhcHRpb249bWV0YWRhdGE7IGtleSBAc2VlIFV0aWxzLk1ZVEhJWF9TSEFET1dfUEFSRU5UO1xuICogICAgIG9uIGBlbGVtZW50YC4gSWYgZm91bmQsIHRoZSByZXN1bHQgaXMgY29uc2lkZXJlZCB0aGUgW3BhcmVudCBOb2RlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9wYXJlbnROb2RlKSBvZiBgZWxlbWVudGAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIE5vZGU7IFRoZSBwYXJlbnQgbm9kZSwgaWYgdGhlcmUgaXMgYW55LCBvciBgbnVsbGAgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAoZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFKVxuICAgIHJldHVybiBtZXRhZGF0YShlbGVtZW50LnBhcmVudE5vZGUsIE1ZVEhJWF9TSEFET1dfUEFSRU5UKSB8fCBudWxsO1xuXG4gIGlmICghZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSlcbiAgICByZXR1cm4gbWV0YWRhdGEoZWxlbWVudCwgTVlUSElYX1NIQURPV19QQVJFTlQpIHx8IG51bGw7XG5cbiAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZTtcbn1cblxuLyoqXG4gKiBncm91cE5hbWU6IFV0aWxzXG4gKiBkZXNjOiB8XG4gKiAgIENyZWF0ZSBhIFByb3h5IHRoYXQgaXMgZXNzZW50aWFsbHkgKGZ1bmN0aW9uYWxseSkgYSBtdWx0aS1wcm90b3R5cGUgYG9iamVjdGAgaW5zdGFuY2UuXG4gKlxuICogICBBIFwic2NvcGVcIiBpbiBNeXRoaXggVUkgbWlnaHQgYmUgYmV0dGVyIGNhbGxlZCBhIFwiY29udGV4dFwiLi4uIGhvd2V2ZXIsIFwic2NvcGVcIlxuICogICB3YXMgY2hvc2VuIGJlY2F1c2UgaXQgKmlzKiBhIHNjb3BlLi4uIG9yIG1pZ2h0IGJlIGJldHRlciBkZXNjcmliZWQgYXMgXCJtdWx0aXBsZSBzY29wZXMgaW4gb25lXCIuXG4gKiAgIFRoaXMgaXMgc3BlY2lmaWNhbGx5IGEgXCJET00gc2NvcGVcIiwgaW4gdGhhdCB0aGlzIG1ldGhvZCBpcyBcIkRPTSBhd2FyZVwiIGFuZCB3aWxsIHRyYXZlcnNlIHRoZVxuICogICBET00gbG9va2luZyBmb3IgdGhlIHJlcXVlc3RlZCBkYXRhIChpZiBhbnkgb2YgdGhlIHNwZWNpZmllZCBgdGFyZ2V0c2AgaXMgYW4gRWxlbWVudCB0aGF0IGlzKS5cbiAqXG4gKiAgIFRoZSB3YXkgdGhpcyB3b3JrcyBpcyB0aGF0IHRoZSBjYWxsZXIgd2lsbCBwcm92aWRlIGF0IGxlYXN0IG9uZSBcInRhcmdldFwiLiBUaGVzZSB0YXJnZXRzIGFyZVxuICogICB0aGVtc2VsdmVzIHNjb3BlcywgZWxlbWVudHMsIG9yIG90aGVyIGRhdGEgb2JqZWN0cy4gV2hlbiB0aGUgcmV0dXJuZWQgUHJveHkgaW5zdGFuY2UgaXMgYWNjZXNzZWQsXG4gKiAgIHRoZSByZXF1ZXN0ZWQga2V5IGlzIHNlYXJjaGVkIGluIGFsbCBwcm92aWRlZCBgdGFyZ2V0c2AsIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgcHJvdmlkZWQuXG4gKlxuICogICBBc2lkZSBmcm9tIHNlYXJjaGluZyBhbGwgdGFyZ2V0cyBmb3IgdGhlIGRlc2lyZWQga2V5LCBpdCB3aWxsIGFsc28gZmFsbGJhY2sgdG8gb3RoZXIgZGF0YSBzb3VyY2VzXG4gKiAgIGl0IHNlYXJjaGVzIGluIGFzIHdlbGw6XG4gKiAgIDEuIElmIGFueSBnaXZlbiBgdGFyZ2V0YCBpdCBpcyBzZWFyY2hpbmcgaXMgYW4gRWxlbWVudCwgdGhlbiBpdCB3aWxsIGFsc28gc2VhcmNoXG4gKiAgICAgIGZvciB0aGUgcmVxdWVzdGVkIGtleSBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gKiAgIDIuIElmIHN0ZXAgIzEgaGFzIGZhaWxlZCwgdGhlbiBtb3ZlIHRvIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgY3VycmVudCBFbGVtZW50IGluc3RhbmNlLCBhbmRcbiAqICAgICAgcmVwZWF0IHRoZSBwcm9jZXNzLCBzdGFydGluZyBmcm9tIHN0ZXAgIzEuXG4gKiAgIDMuIEFmdGVyIHN0ZXBzIDEtMiBhcmUgcmVwZWF0ZWQgZm9yIGV2ZXJ5IGdpdmVuIGB0YXJnZXRgIChhbmQgYWxsIHBhcmVudCBub2RlcyBvZiB0aG9zZSBgdGFyZ2V0c2AuLi4gaWYgYW55KSxcbiAqICAgICAgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGZpbmFsbHkgZmFsbGJhY2sgdG8gc2VhcmNoaW5nIGBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlYCBmb3IgdGhlIHJlcXVlc3RlZCBrZXkuXG4gKlxuICogICBXZSBhcmVuJ3QgcXVpdGUgZmluaXNoZWQgeWV0IHRob3VnaC4uLlxuICpcbiAqICAgSWYgc3RlcHMgMS0zIGFib3ZlIGFsbCBmYWlsLCB0aGVuIHRoaXMgbWV0aG9kIHdpbGwgc3RpbGwgZmFsbGJhY2sgdG8gdGhlIGZhbGxvd2luZyBoYXJkLWNvZGVkIGtleS92YWx1ZSBwYWlyczpcbiAqICAgMS4gQSByZXF1ZXN0ZWQga2V5IG9mIGAnZ2xvYmFsU2NvcGUnYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiBgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZWAgYmVpbmcgcmV0dXJuZWQuXG4gKiAgIDIuIEEgcmVxdWVzdGVkIGtleSBvZiBgJ2kxOG4nYCAoaWYgbm90IGZvdW5kIG9uIGEgdGFyZ2V0KSB3aWxsIHJlc3VsdCBpbiB0aGUgYnVpbHQtaW4gYGkxOG5gIGxhbmd1YWdlIHRlcm0gcHJvY2Vzc29yIGJlaW5nIHJldHVybmVkLlxuICogICAzLiBBIHJlcXVlc3RlZCBrZXkgb2YgYCdkeW5hbWljUHJvcElEJ2AgKGlmIG5vdCBmb3VuZCBvbiBhIHRhcmdldCkgd2lsbCByZXN1bHQgaW4gdGhlIGJ1aWx0LWluIGBkeW5hbWljUHJvcElEYCBkeW5hbWljIHByb3BlcnR5IHByb3ZpZGVkLiBTZWUgQHNlZSBVdGlscy5keW5hbWljUHJvcElEOy5cbiAqXG4gKiAgIEZpbmFsbHksIHRoZSByZXR1cm5lZCBQcm94eSB3aWxsIGFsc28gaW50ZXJjZXB0IGFueSB2YWx1ZSBbc2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm94eS9Qcm94eS9zZXQpIG9wZXJhdGlvbixcbiAqICAgdG8gc2V0IGEgdmFsdWUgb24gdGhlIGZpcnN0IHRhcmdldCBmb3VuZC5cbiAqXG4gKiAgIFRoZSBQcm94eSBhbHNvIG92ZXJsb2FkcyBbb3duS2V5c10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJveHkvUHJveHkvb3duS2V5cykgdG8gbGlzdCAqKmFsbCoqIGtleXMgYWNyb3NzICoqYWxsKiogYHRhcmdldHNgLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IC4uLnRhcmdldHNcbiAqICAgICBkYXRhVHlwZXM6XG4gKiAgICAgICAtIE9iamVjdFxuICogICAgICAgLSBFbGVtZW50XG4gKiAgICAgICAtIG5vbi1wcmltaXRpdmVcbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgYHRhcmdldHNgIHRvIGJlIHNlYXJjaGVkLCBpbiB0aGUgb3JkZXIgcHJvdmlkZWQuIFRhcmdldHMgYXJlIHNlYXJjaGVkIGJvdGggZm9yIGdldCBvcGVyYXRpb25zLCBhbmQgc2V0IG9wZXJhdGlvbnMgKHRoZSBmaXJzdCB0YXJnZXQgZm91bmQgd2lsbCBiZSB0aGUgc2V0IHRhcmdldCkuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOndhcm5pbmc6IE15dGhpeCBVSSB3aWxsIGRlbGliZXJhdGVseSBuZXZlciBkaXJlY3RseSBhY2Nlc3MgYGdsb2JhbFRoaXNgIGZyb20gdGhlIHRlbXBsYXRlIGVuZ2luZSAoZm9yIHNlY3VyaXR5IHJlYXNvbnMpLlxuICogICAgIEJlY2F1c2Ugb2YgdGhpcywgTXl0aGl4IFVJIGF1dG9tYXRpY2FsbHkgcHJvdmlkZXMgaXRzIG93biBnbG9iYWwgc2NvcGUgYGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVgLlxuICogICAgIElmIHlvdSB3YW50IGRhdGEgdG8gYmUgXCJnbG9iYWxseVwiIHZpc2libGUgdG8gTXl0aGl4IFVJLCB0aGVuIHlvdSBuZWVkIHRvIGFkZCB5b3VyIGRhdGEgdG8gdGhpcyBzcGVjaWFsIGdsb2JhbCBzY29wZS5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoaXMgbWV0aG9kIGlzIGNvbXBsZXggYmVjYXVzZSBpdCBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIHRvIHByb3ZpZGUgYSBcInNjb3BlXCIgdG8gdGhlIE15dGhpeCBVSSB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqICAgICBUaGUgdGVtcGxhdGluZyBlbmdpbmUgbmVlZHMgdG8gYmUgRE9NIGF3YXJlLCBhbmQgYWxzbyBuZWVkcyB0byBoYXZlIGFjY2VzcyB0byBzcGVjaWFsaXplZCwgc2NvcGVkIGRhdGFcbiAqICAgICAoaS5lLiB0aGUgYG15dGhpeC11aS1mb3ItZWFjaGAgY29tcG9uZW50IHdpbGwgcHVibGlzaCBzY29wZWQgZGF0YSBmb3IgZWFjaCBpdGVyYXRpb24sIHdoaWNoIG5lZWRzIHRvIGJlIGJvdGhcbiAqICAgICBET00tYXdhcmUsIGFuZCBpdGVyYXRpb24tYXdhcmUpLlxuICogICAtIHxcbiAqICAgICA6aW5mbzogQW55IHByb3ZpZGVkIGB0YXJnZXRgIGNhbiBhbHNvIGJlIG9uZSBvZiB0aGVzZSBQcm94eSBzY29wZXMgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QuXG4gKiAgIC0gfFxuICogICAgIDppbmZvOiBJdCBjYW4gaGVscCB0byB0aGluayBvZiB0aGUgcmV0dXJuZWQgXCJzY29wZVwiIGFzIGFuIHBsYWluIE9iamVjdCB0aGF0IGhhcyBhbiBhcnJheSBvZiBwcm90b3R5cGVzLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBQcm94eTsgQSBwcm94eSBpbnN0YW5jZSwgdGhhdCBpcyB1c2VkIHRvIGdldCBhbmQgc2V0IGtleXMgYWNyb3NzIG11bHRpcGxlIGB0YXJnZXRzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNjb3BlKC4uLl90YXJnZXRzKSB7XG4gIGNvbnN0IGZpbmRQcm9wTmFtZVNjb3BlID0gKHRhcmdldCwgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgT2JqZWN0LmlzKHRhcmdldCwgTmFOKSlcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwcm9wTmFtZSBpbiB0YXJnZXQpXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuXG4gICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpXG4gICAgICByZXR1cm47XG5cbiAgICBjb25zdCBzZWFyY2hQYXJlbnROb2Rlc0ZvcktleSA9IChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgaWYgKCFjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGlmIChwcm9wTmFtZSBpbiBjdXJyZW50RWxlbWVudClcbiAgICAgICAgICByZXR1cm4gY3VycmVudEVsZW1lbnQ7XG5cbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlYXJjaFBhcmVudE5vZGVzRm9yS2V5KHRhcmdldCk7XG4gIH07XG5cbiAgbGV0IHRhcmdldHMgICAgICAgICA9IF90YXJnZXRzLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZpcnN0RWxlbWVudCAgICA9IHRhcmdldHMuZmluZCgodGFyZ2V0KSA9PiAodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHx8IHRhcmdldHNbMF07XG4gIGxldCBiYXNlQ29udGV4dCAgICAgPSB7fTtcbiAgbGV0IGZhbGxiYWNrQ29udGV4dCA9IHtcbiAgICBnbG9iYWxTY29wZTogIChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpLFxuICAgIGkxOG46ICAgICAgICAgKHBhdGgsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgICAgbGV0IGxhbmd1YWdlUHJvdmlkZXIgPSBzcGVjaWFsQ2xvc2VzdChmaXJzdEVsZW1lbnQsICdteXRoaXgtbGFuZ3VhZ2UtcHJvdmlkZXInKTtcbiAgICAgIGlmICghbGFuZ3VhZ2VQcm92aWRlcilcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgICAgcmV0dXJuIGxhbmd1YWdlUHJvdmlkZXIuaTE4bihwYXRoLCBkZWZhdWx0VmFsdWUpO1xuICAgIH0sXG4gICAgZHluYW1pY1Byb3BJRCxcbiAgfTtcblxuICB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoZmFsbGJhY2tDb250ZXh0KTtcbiAgbGV0IHByb3h5ICAgPSBuZXcgUHJveHkoYmFzZUNvbnRleHQsIHtcbiAgICBvd25LZXlzOiAoKSA9PiB7XG4gICAgICBsZXQgYWxsS2V5cyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cylcbiAgICAgICAgYWxsS2V5cyA9IGFsbEtleXMuY29uY2F0KGdldEFsbFByb3BlcnR5TmFtZXModGFyZ2V0KSk7XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKGdsb2JhbFNjb3BlKVxuICAgICAgICBhbGxLZXlzID0gYWxsS2V5cy5jb25jYXQoT2JqZWN0LmtleXMoZ2xvYmFsU2NvcGUpKTtcblxuICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhbGxLZXlzKSk7XG4gICAgfSxcbiAgICBoYXM6IChfLCBwcm9wTmFtZSkgPT4ge1xuICAgICAgZm9yIChsZXQgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgICAgbGV0IHNjb3BlID0gZmluZFByb3BOYW1lU2NvcGUodGFyZ2V0LCBwcm9wTmFtZSk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gKHByb3BOYW1lIGluIGdsb2JhbFNjb3BlKTtcbiAgICB9LFxuICAgIGdldDogKF8sIHByb3BOYW1lKSA9PiB7XG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gc2NvcGVbcHJvcE5hbWVdO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2xvYmFsU2NvcGUgPSAoZ2xvYmFsVGhpcy5teXRoaXhVSSAmJiBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlKTtcbiAgICAgIGlmICghZ2xvYmFsU2NvcGUpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgcmV0dXJuIGdsb2JhbFNjb3BlW3Byb3BOYW1lXTtcbiAgICB9LFxuICAgIHNldDogKF8sIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgZG9TZXQgPSAoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoaXNUeXBlKHNjb3BlW3Byb3BOYW1lXSwgRHluYW1pY1Byb3BlcnR5KSlcbiAgICAgICAgICBzY29wZVtwcm9wTmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2NvcGVbcHJvcE5hbWVdID0gdmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICBsZXQgc2NvcGUgPSBmaW5kUHJvcE5hbWVTY29wZSh0YXJnZXQsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFzY29wZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICByZXR1cm4gZG9TZXQoc2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBnbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJICYmIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUpO1xuICAgICAgaWYgKCFnbG9iYWxTY29wZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gZG9TZXQoZ2xvYmFsU2NvcGUsIHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgZmFsbGJhY2tDb250ZXh0LiQkID0gcHJveHk7XG5cbiAgcmV0dXJuIHByb3h5O1xufVxuXG5jb25zdCBFVkVOVF9BQ1RJT05fSlVTVF9OQU1FID0gL14lP1tcXHcuJF0rJC87XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBDcmVhdGUgYSBjb250ZXh0LWF3YXJlIGZ1bmN0aW9uLCBvciBcIm1hY3JvXCIsIHRoYXQgY2FuIGJlIGNhbGxlZCBhbmQgdXNlZCBieSB0aGUgdGVtcGxhdGUgZW5naW5lLlxuICpcbiAqICAgSWYgeW91IGFyZSBldmVyIHRyeWluZyB0byBwYXNzIG1ldGhvZHMgb3IgZHluYW1pYyBwcm9wZXJ0aWVzIGFjcm9zcyB0aGUgRE9NLCB0aGVuIHRoaXMgaXMgdGhlIG1ldGhvZCB5b3Ugd2FudCB0byB1c2UsIHRvXG4gKiAgIHByb3Blcmx5IFwicGFyc2VcIiBhbmQgdXNlIHRoZSBhdHRyaWJ1dGUgdmFsdWUgYXMgaW50ZW5kZWQuXG4gKlxuICogICBUaGlzIGlzIHVzZWQgZm9yIGV4YW1wbGUgZm9yIGV2ZW50IGJpbmRpbmdzIHZpYSBhdHRyaWJ1dGVzLiBJZiB5b3UgaGF2ZSBmb3IgZXhhbXBsZSBhbiBgb25jbGljaz1cImRvU29tZXRoaW5nXCJgXG4gKiAgIGF0dHJpYnV0ZSBvbiBhbiBlbGVtZW50LCB0aGVuIHRoaXMgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIGNvbnRleHQtYXdhcmUgXCJtYWNyb1wiIGZvciB0aGUgbWV0aG9kIFwiZG9Tb21ldGhpbmdcIi5cbiAqXG4gKiAgIFRoZSB0ZXJtIFwibWFjcm9cIiBpcyB1c2VkIGhlcmUgYmVjYXVzZSB0aGVyZSBhcmUgc3BlY2lhbCBmb3JtYXRzIFwidW5kZXJzdG9vZFwiIGJ5IHRoZSB0ZW1wbGF0ZSBlbmdpbmUuIEZvciBleGFtcGxlLFxuICogICBwcmVmaXhpbmcgYW4gYXR0cmlidXRlIHZhbHVlIHdpdGggYSBwZXJjZW50IHNpZ24sIGkuZS4gYG5hbWU9XCIlZ2xvYmFsRHluYW1pY1Byb3BOYW1lXCJgIHdpbGwgdXNlIEBzZWUgVXRpbHMuZHluYW1pY1Byb3BJRDtcbiAqICAgdG8gZ2xvYmFsbHkgZmV0Y2ggcHJvcGVydHkgb2YgdGhpcyBuYW1lLiBUaGlzIGlzIGltcG9ydGFudCwgYmVjYXVzZSBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgRE9NLCB5b3UgbWlnaHRcbiAqICAgYmUgcmVxdWVzdGluZyBhIGR5bmFtaWMgcHJvcGVydHkgdGhhdCBoYXNuJ3QgeWV0IGJlZW4gbG9hZGVkL2RlZmluZWQuIFRoaXMgaXMgdGhlIHB1cnBvc2Ugb2YgQHNlZSBVdGlscy5keW5hbWljUHJvcElEOyxcbiAqICAgYW5kIHRoaXMgc3BlY2lhbGl6ZWQgdGVtcGxhdGUgZm9ybWF0OiB0byBwcm92aWRlIGR5bmFtaWMgcHJvcHMgYnkgaWQsIHRoYXQgd2lsbCBiZSBhdmFpbGFibGUgd2hlbiBuZWVkZWQuXG4gKlxuICogICBUaGUgdGVtcGxhdGUgZW5naW5lIGFsc28gd2lsbCBoYXBwaWx5IGFjY2VwdCByb2d1ZSBtZXRob2QgbmFtZXMuIEZvciBleGFtcGxlLCBpbiBhIE15dGhpeCBVSSBjb21wb25lbnQgeW91IGFyZSBidWlsZGluZyxcbiAqICAgeW91IG1pZ2h0IGhhdmUgYW4gZWxlbWVudCBsaWtlIGA8YnV0dG9uIG9uY2xpY2s9XCJvbkJ1dHRvbkNsaWNrXCI+Q2xpY2sgTWUhPGJ1dHRvbj5gLiBUaGUgdGVtcGxhdGluZyBlbmdpbmUgd2lsbCBkZXRlY3QgdGhhdFxuICogICB0aGlzIGlzIE9OTFkgYW4gaWRlbnRpZmllciwgYW5kIHNvIHdpbGwgc2VhcmNoIGZvciB0aGUgc3BlY2lmaWVkIG1ldGhvZCBpbiB0aGUgYXZhaWxhYmxlIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSxcbiAqICAgd2hpY2ggaW5jbHVkZXMgYHRoaXNgIGluc3RhbmNlIG9mIHlvdXIgY29tcG9uZW50IGFzIHRoZSBmaXJzdCBgdGFyZ2V0YC4gVGhpcyBwYXR0ZXJuIGlzIG5vdCByZXF1aXJlZCwgYXMgeW91IGNhbiBjYWxsIHlvdXJcbiAqICAgY29tcG9uZW50IG1ldGhvZCBkaXJlY3RseSB5b3Vyc2VsZiwgYXMgd2l0aCBhbnkgYXR0cmlidXRlIGV2ZW50IGJpbmRpbmcgaW4gdGhlIERPTSwgaS5lOiBgPGJ1dHRvbiBvbmNsaWNrPVwidGhpcy5vbkJ1dHRvbkNsaWNrKGV2ZW50KVwiPkNsaWNrIE1lITxidXR0b24+YC5cbiAqXG4gKiAgIE9uZSBsYXN0IHRoaW5nIHRvIG1lbnRpb24gaXMgdGhhdCB3aGVuIHRoZXNlIFwibWFjcm9cIiBtZXRob2RzIGFyZSBjYWxsZWQgYnkgTXl0aGl4IFVJLCBhbGwgZW51bWVyYWJsZSBrZXlzIG9mIHRoZSBnZW5lcmF0ZWRcbiAqICAgXCJzY29wZVwiIChzZWUgQHNlZSBVdGlscy5jcmVhdGVTY29wZTspIGFyZSBwYXNzZWQgaW50byB0aGUgbWFjcm8gbWV0aG9kIGFzIGFyZ3VtZW50cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBrZXlzL3ZhbHVlcyBvZiBhbGwgc2NvcGUgYHRhcmdldHNgXG4gKiAgIGFyZSBhdmFpbGFibGUgZGlyZWN0bHkgaW4geW91ciBqYXZhc2NyaXB0IHNjb3BlLiBpLmUuIHlvdSBjYW4gZG8gdGhpbmdzIGxpa2UgYG5hbWU9XCJjb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXNBdHRyaWJ1dGUxLCBvdGhlckF0dHJpYnV0ZSlcImAgd2l0aG91dCBuZWVkaW5nIHRvIGRvXG4gKiAgIGBuYW1lPVwidGhpcy5jb21wb25lbnRJbnN0YW5jZVByb3BlcnR5KHRoaXMudGhpc0F0dHJpYnV0ZTEsIHRoaXMub3RoZXJBdHRyaWJ1dGUpXCJgLiA6d2FybmluZzogSXQgaXMgaW1wb3J0YW50IHRvIGtlZXAgaW4gbWluZCB0aGF0IGRpcmVjdCByZWZlcmVuY2UgYWNjZXNzIGxpa2UgdGhpcyBpbiBhIG1hY3JvXG4gKiAgIHdpbGwgYnlwYXNzIHRoZSBcInNjb3BlXCIgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykgUHJveHksIGFuZCBzbyBpZiB0aGUgc3BlY2lmaWVkIGtleSBpcyBub3QgZm91bmQgKHBhc3NlZCBpbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgbWFjcm8pLCB0aGVuIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duIGJ5IGphdmFzY3JpcHQuXG4gKlxuICogICBJdCBpcyBhYnNvbHV0ZWx5IHBvc3NpYmxlIGZvciB5b3UgdG8gcmVjZWl2ZSBhbmQgc2VuZCBhcmd1bWVudHMgdmlhIHRoZXNlIGdlbmVyYXRlZCBcIm1hY3Jvc1wiLiBgbXl0aGl4LXVpLXNlYXJjaGAgZG9lcyB0aGlzIGZvclxuICogICBleGFtcGxlIHdoZW4gYSBcImZpbHRlclwiIG1ldGhvZCBpcyBwYXNzZWQgdmlhIGFuIGF0dHJpYnV0ZS4gQnkgZGVmYXVsdCBubyBleHRyYSBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIHdoZW4gY2FsbGVkIGRpcmVjdGx5IGJ5IHRoZSB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIEFuIG9iamVjdCB3aXRoIHRoZSBzaGFwZSBgeyBib2R5OiBzdHJpbmc7IHByZWZpeD86IHN0cmluZzsgc2NvcGU6IG9iamVjdDsgfWAuXG4gKlxuICogICAgICAgMS4gYGJvZHlgIGlzIHRoZSBhY3R1YWwgYm9keSBvZiB0aGUgYG5ldyBGdW5jdGlvbmAuXG4gKiAgICAgICAyLiBgc2NvcGVgIGlzIHRoZSBzY29wZSAoYHRoaXNgKSB0aGF0IHlvdSB3YW50IHRvIGJpbmQgdG8gdGhlIHJlc3VsdGluZyBtZXRob2QuXG4gKiAgICAgICAgICBUaGlzIHdvdWxkIGdlbmVyYWxseSBiZSBhIHNjb3BlIGNyZWF0ZWQgYnkgQHNlZSBVdGlscy5jcmVhdGVTY29wZTtcbiAqICAgICAgIDMuIGBwcmVmaXhgIGFuIG9wdGlvbmFsIHByZWZpeCBmb3IgdGhlIGJvZHkgb2YgdGhlIGBuZXcgRnVuY3Rpb25gLiBUaGlzIHByZWZpeCBpcyBhZGRlZFxuICogICAgICAgICAgYmVmb3JlIGFueSBmdW5jdGlvbiBib2R5IGNvZGUgdGhhdCBNeXRoaXggVUkgZ2VuZXJhdGVzLlxuICogICAgICAgICAgU2VlIGhlcmUgQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDsgZm9yIGFuIGV4YW1wbGUgdXNlXG4gKiAgICAgICAgICBvZiBgcHJlZml4YCAobm90aWNlIGhvdyBgYXJndW1lbnRzWzFdYCBpcyB1c2VkIGluc3RlYWQgb2YgYGFyZ3VtZW50c1swXWAsIGFzIGBhcmd1bWVudHNbMF1gIGlzIGFsd2F5cyByZXNlcnZlZFxuICogICAgICAgICAgZm9yIGxvY2FsIHZhcmlhYmxlIG5hbWVzIFwiaW5qZWN0ZWRcIiBmcm9tIHRoZSBjcmVhdGVkIFwic2NvcGVcIikuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IEFzaWRlIGZvciBzb21lIGJlaGluZC10aGUtc2NlbmUgbW9kaWZpY2F0aW9ucyBhbmQgZWFzZS1vZi11c2Ugc2xpY2tuZXNzLCB0aGlzIGVzc2VudGlhbGx5IGp1c3QgY3JlYXRlcyBhIGBuZXcgRnVuY3Rpb25gIGFuZCBiaW5kcyBhIFwic2NvcGVcIiAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KSB0byBpdC5cbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSBwcm92aWRlZCAoYW5kIG9wdGlvbmFsKSBgcHJlZml4YCBjYW4gYmUgdXNlZCBhcyB0aGUgc3RhcnQgb2YgdGhlIG1hY3JvIGBuZXcgRnVuY3Rpb25gIGJvZHkgY29kZS4gaS5lLiBAc2VlIFV0aWxzLmJpbmRFdmVudFRvRWxlbWVudDsgZG9lcyBleGFjdGx5IHRoaXMgdG8gYWxsb3cgZGlyZWN0IHNjb3BlZFxuICogICAgIGFjY2VzcyB0byB0aGUgYGV2ZW50YCBpbnN0YW5jZS4gQHNvdXJjZVJlZiBfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudDtcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRoZSByZXR1cm4gbWV0aG9kIGlzIGJvdW5kIGJ5IGNhbGxpbmcgYC5iaW5kKHNjb3BlKWAuIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBtb2RpZnkgYHRoaXNgIGF0IHRoZSBjYWxsLXNpdGUuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIGZ1bmN0aW9uOyBBIGZ1bmN0aW9uIHRoYXQgaXMgXCJjb250ZXh0IGF3YXJlXCIgYnkgYmVpbmcgYm91bmQgdG8gdGhlIHByb3ZpZGVkIGBzY29wZWAgKHNlZSBAc2VlIFV0aWxzLmNyZWF0ZVNjb3BlOykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4LCBib2R5LCBzY29wZSB9KSB7XG4gIGxldCBmdW5jdGlvbkJvZHkgPSBib2R5O1xuICBpZiAoZnVuY3Rpb25Cb2R5LmNoYXJBdCgwKSA9PT0gJyUnIHx8IEVWRU5UX0FDVElPTl9KVVNUX05BTUUudGVzdChmdW5jdGlvbkJvZHkpKSB7XG4gICAgaWYgKGZ1bmN0aW9uQm9keS5jaGFyQXQoMCkgPT09ICclJykge1xuICAgICAgZnVuY3Rpb25Cb2R5ID0gYCh0aGlzLmR5bmFtaWNQcm9wSUQgfHwgZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5keW5hbWljUHJvcElEKSgnJHtmdW5jdGlvbkJvZHkuc3Vic3RyaW5nKDEpLnRyaW0oKS5yZXBsYWNlKC8nL2csICdcXFxcXFwnJyl9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdW5jdGlvbkJvZHkgPSBgKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgX19fXyQgPSAke2Z1bmN0aW9uQm9keX07XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgX19fXyQgPT09ICdmdW5jdGlvbicpID8gX19fXyQuYXBwbHkodGhpcywgQXJyYXkuZnJvbShhcmd1bWVudHMpLnNsaWNlKDEpKSA6IF9fX18kO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuJHtmdW5jdGlvbkJvZHkucmVwbGFjZSgvXlxccyp0aGlzXFwuLywgJycpfS5hcHBseSh0aGlzLCBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICB9KSgpO2A7XG4gICAgfVxuICB9XG5cbiAgbGV0IGNvbnRleHRDYWxsQXJncyA9IGdldENvbnRleHRDYWxsQXJncyhzY29wZSwgeyAnX19tYWNyb1NvdXJjZSc6IG51bGwsICdfX2V4cGFuZGVkTWFjcm9Tb3VyY2UnOiBudWxsIH0pO1xuXG4gIGZ1bmN0aW9uQm9keSA9IGB0cnkgeyAkeyhwcmVmaXgpID8gYCR7cHJlZml4fTtgIDogJyd9cmV0dXJuICR7KGZ1bmN0aW9uQm9keSB8fCAnKHZvaWQgMCknKS5yZXBsYWNlKC9eXFxzKnJldHVyblxccysvLCAnJykudHJpbSgpfTsgfSBjYXRjaCAoZXJyb3IpIHsgY29uc29sZS5lcnJvcihcXGBFcnJvciBpbiBtYWNybyBbXFwke19fbWFjcm9Tb3VyY2V9XTpcXGAsIGVycm9yLCBfX2V4cGFuZGVkTWFjcm9Tb3VyY2UpOyB0aHJvdyBlcnJvcjsgfWA7XG5cbiAgbGV0IGxvY2FsU2NvcGUgPSBPYmplY3QuY3JlYXRlKHNjb3BlKTtcbiAgbG9jYWxTY29wZS5fX21hY3JvU291cmNlID0gYm9keTtcbiAgbG9jYWxTY29wZS5fX2V4cGFuZGVkTWFjcm9Tb3VyY2UgPSBmdW5jdGlvbkJvZHk7XG5cbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oY29udGV4dENhbGxBcmdzLCBmdW5jdGlvbkJvZHkpKS5iaW5kKHNjb3BlIHx8IHt9LCBzY29wZSk7XG59XG5cbi8qKlxuICogZ3JvdXBOYW1lOiBVdGlsc1xuICogZGVzYzogfFxuICogICBQYXJzZSBhIHRlbXBsYXRlLCBhbmQgcmV0dXJuIGl0cyBwYXJ0cy4gQSB0ZW1wbGF0ZSBcInBhcnRcIiBpcyBvbmUgb2YgdHdvIHR5cGVzOiBgJ2xpdGVyYWwnYCwgb3IgYCdtYWNybydgLlxuICpcbiAqICAgVGFrZSBmb3IgZXhhbXBsZSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOiBgJ0hlbGxvIFxcQEBncmVldGluZ0BAISEhJ2AuIFRoaXMgdGVtcGxhdGUgd291bGQgcmVzdWx0IGluIHRocmVlIFwicGFydHNcIiBhZnRlciBwYXJzaW5nOlxuICogICAxLiBgeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZTogJ0hlbGxvICcsIHN0YXJ0OiAwLCBlbmQ6IDYgfWBcbiAqICAgMi4gYHsgdHlwZTogJ21hY3JvJywgc291cmNlOiAnXFxAQGdyZWV0aW5nQEAnLCBtYWNybzogPGZ1bmN0aW9uPiwgc3RhcnQ6IDYsIGVuZDogMTggfWBcbiAqICAgMy4gYHsgdHlwZTogJ2xpdGVyYWwnLCBzb3VyY2U6ICchISEnLCBzdGFydDogMTgsIGVuZDogMjEgfWBcbiAqXG4gKiAgIENvbmNhdGVuYXRpbmcgYWxsIGBzb3VyY2VgIHByb3BlcnRpZXMgdG9nZXRoZXIgd2lsbCByZXN1bHQgaW4gdGhlIG9yaWdpbmFsIGlucHV0LlxuICogICBDb25jYXRlbmF0aW5nIGFsbCBgc291cmNlYCBwcm9wZXJ0aWVzLCBhbG9uZyB3aXRoIHRoZSByZXN1bHQgb2YgY2FsbGluZyBhbGwgYG1hY3JvYCBmdW5jdGlvbnMsIHdpbGwgcmVzdWx0IGluIHRoZSBvdXRwdXQgKGkuZS4gYHBhcnRbMF0uc291cmNlICsgcGFydFsxXS5tYWNybygpICsgcGFydFsyXS5zb3VyY2VgKS5cbiAqICAgVGhlIGBtYWNyb2AgcHJvcGVydHkgaXMgdGhlIGFjdHVhbCBtYWNybyBmdW5jdGlvbiBmb3IgdGhlIHBhcnNlZCB0ZW1wbGF0ZSBwYXJ0IChpLmUuIGluIG91ciBleGFtcGxlIGAnXFxAQGdyZWV0aW5nQEAnYCkuXG4gKiAgIGBzdGFydGAgYW5kIGBlbmRgIGFyZSB0aGUgb2Zmc2V0cyBmcm9tIHRoZSBvcmlnaW5hbCBgdGV4dGAgd2hlcmUgdGhlIHBhcnQgY2FuIGJlIGZvdW5kLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IHRleHRcbiAqICAgICBkYXRhVHlwZTogc3RyaW5nXG4gKiAgICAgZGVzYzogfFxuICogICAgICAgVGhlIHRlbXBsYXRlIHN0cmluZyB0byBwYXJzZS5cbiAqICAgLSBuYW1lOiBvcHRpb25zXG4gKiAgICAgZGF0YVR5cGU6IG9iamVjdFxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIE9wdGlvbnMgZm9yIHRoZSBvcGVyYXRpb24uIFRoZSBzaGFwZSBvZiB0aGlzIG9iamVjdCBpcyBgeyBwcmVmaXg/OiBzdHJpbmcsIHNjb3BlOiBvYmplY3QgfWAuXG4gKiAgICAgICBgc2NvcGVgIGRlZmluZXMgdGhlIHNjb3BlIGZvciBtYWNyb3MgY3JlYXRlZCBieSB0aGlzIG1ldGhvZCAoc2VlIEBzZWUgVXRpbHMuY3JlYXRlU2NvcGU7KS5cbiAqICAgICAgIGBwcmVmaXhgIGRlZmluZXMgYSBmdW5jdGlvbiBib2R5IHByZWZpeCB0byB1c2Ugd2hpbGUgY3JlYXRpbmcgbWFjcm9zIChzZWUgQHNlZSBVdGlscy5jcmVhdGVUZW1wbGF0ZU1hY3JvOykuXG4gKiBub3RlczpcbiAqICAgLSB8XG4gKiAgICAgOmluZm86IFRvIHNraXAgcGFyc2luZyBhIHNwZWNpZmljIHRlbXBsYXRlIHBhcnQsIHByZWZpeCB3aXRoIGEgYmFja3NsYXNoLCBpLmUuIGBcXFxcXFxcXEBAZ3JlZXRpbmdAQGAuXG4gKiByZXR1cm46IHxcbiAqICAgQHR5cGVzIEFycmF5PFRlbXBsYXRlUGFydD47ICoqVGVtcGxhdGVQYXJ0Kio6IGB7IHR5cGU6ICdsaXRlcmFsJyB8ICdtYWNybycsIHNvdXJjZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgbWFjcm8/OiBmdW5jdGlvbiB9YC4gUmV0dXJuIGFsbCBwYXJzZWQgcGFydHMgb2YgdGhlIHRlbXBsYXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZVBhcnRzKHRleHQsIF9vcHRpb25zKSB7XG4gIGxldCBvcHRpb25zICAgICAgID0gX29wdGlvbnMgfHwge307XG4gIGxldCBwYXJ0cyAgICAgICAgID0gW107XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcblxuICBjb25zdCBhZGRMaXRlcmFsID0gKHN0YXJ0T2Zmc2V0LCBlbmRPZmZzZXQpID0+IHtcbiAgICBsZXQgc291cmNlID0gdGV4dC5zdWJzdHJpbmcoc3RhcnRPZmZzZXQsIGVuZE9mZnNldCkucmVwbGFjZSgvXFxcXEBAL2csICdAQCcpO1xuICAgIHBhcnRzLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIHNvdXJjZSwgc3RhcnQ6IHN0YXJ0T2Zmc2V0LCBlbmQ6IGVuZE9mZnNldCB9KTtcbiAgfTtcblxuICB0ZXh0LnJlcGxhY2UoLyg/PCFcXFxcKShAQCkoLis/KVxcMS9nLCAobSwgXywgcGFyc2VkVGV4dCwgb2Zmc2V0KSA9PiB7XG4gICAgaWYgKGN1cnJlbnRPZmZzZXQgPCBvZmZzZXQpXG4gICAgICBhZGRMaXRlcmFsKGN1cnJlbnRPZmZzZXQsIG9mZnNldCk7XG5cbiAgICBjdXJyZW50T2Zmc2V0ID0gb2Zmc2V0ICsgbS5sZW5ndGg7XG5cbiAgICBsZXQgbWFjcm8gPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgLi4ub3B0aW9ucywgYm9keTogcGFyc2VkVGV4dCB9KTtcbiAgICBwYXJ0cy5wdXNoKHsgdHlwZTogJ21hY3JvJywgc291cmNlOiBtLCBtYWNybywgc3RhcnQ6IG9mZnNldCwgZW5kOiBjdXJyZW50T2Zmc2V0IH0pO1xuICB9KTtcblxuICBpZiAoY3VycmVudE9mZnNldCA8IHRleHQubGVuZ3RoKVxuICAgIGFkZExpdGVyYWwoY3VycmVudE9mZnNldCwgdGV4dC5sZW5ndGgpO1xuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuY29uc3QgTk9PUCA9IChpdGVtKSA9PiBpdGVtO1xuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgQ29tcGlsZSB0aGUgdGVtcGxhdGUgcGFydHMgdGhhdCB3ZXJlIHBhcnNlZCBieSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0czsuXG4gKlxuICogICBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHByb3ZpZGUgdGhpcyBtZXRob2QgYW4gYXJyYXkgb2YgQHNlZSBFbGVtZW50cy5FbGVtZW50RGVmaW5pdGlvbjsgaW5zdGFuY2VzLFxuICogICBvciBAc2VlIFF1ZXJ5RW5naW5lLlF1ZXJ5RW5naW5lOyBpbnN0YW5jZXMgKHRoYXQgY29udGFpbiBAc2VlIEVsZW1lbnRzLkVsZW1lbnREZWZpbml0aW9uOyBpbnN0YW5jZXMpLlxuICogICBJZiBlaXRoZXIgb2YgdGhlc2UgdHlwZXMgYXJlIGZvdW5kIGluIHRoZSBpbnB1dCBhcnJheSAoZXZlbiBvbmUpLCB0aGVuIHRoZSBlbnRpcmUgcmVzdWx0IGlzIHJldHVybmVkXG4gKiAgIGFzIGEgcmF3IGFycmF5LlxuICpcbiAqICAgT3IsIGlmIGFueSBvZiB0aGUgcmVzdWx0aW5nIHBhcnRzIGlzICoqbm90KiogYSBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0cz9jYXB0aW9uPVRlbXBsYXRlUGFydDsgb3IgYSBgc3RyaW5nYCxcbiAqICAgdGhlbiByZXR1cm4gdGhlIHJlc3VsdGluZyB2YWx1ZSByYXcuXG4gKlxuICogICBPdGhlcndpc2UsIGlmIGFsbCByZXN1bHRpbmcgcGFydHMgYXJlIGEgYHN0cmluZ2AsIHRoZW4gdGhlIHJlc3VsdGluZyBwYXJ0cyBhcmUgam9pbmVkLCBhbmQgYSBgc3RyaW5nYCBpcyByZXR1cm5lZC5cbiAqIGFyZ3VtZW50czpcbiAqICAgLSBuYW1lOiBwYXJ0c1xuICogICAgIGRhdGFUeXBlczpcbiAqICAgICAgIC0gQXJyYXk8VGVtcGxhdGVQYXJ0PlxuICogICAgICAgLSBBcnJheTxFbGVtZW50RGVmaW5pdGlvbj5cbiAqICAgICAgIC0gQXJyYXk8UXVlcnlFbmdpbmU+XG4gKiAgICAgICAtIEFycmF5PGFueT5cbiAqICAgICBkZXNjOiB8XG4gKiAgICAgICBUaGUgdGVtcGxhdGUgcGFydHMgdG8gY29tcGlsZSB0b2dldGhlci5cbiAqIHJldHVybjogfFxuICogICBAdHlwZXMgQXJyYXk8YW55PjsgQHR5cGVzIHN0cmluZzsgUmV0dXJuIHRoZSByZXN1bHQgYXMgYSBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIHJhdyB2YWx1ZXMsIG9yIGEgcmF3IHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHBhcnRzLCBjYWxsYmFjaykge1xuICBsZXQgcmVzdWx0ID0gcGFydHNcbiAgICAubWFwKChwYXJ0KSA9PiB7XG4gICAgICBpZiAoIXBhcnQpXG4gICAgICAgIHJldHVybiBwYXJ0O1xuXG4gICAgICBpZiAocGFydFtNWVRISVhfVFlQRV0gPT09IEVMRU1FTlRfREVGSU5JVElPTl9UWVBFIHx8IHBhcnRbTVlUSElYX1RZUEVdID09PSBRVUVSWV9FTkdJTkVfVFlQRSlcbiAgICAgICAgcmV0dXJuIHBhcnQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwYXJ0LnR5cGUgPT09ICdsaXRlcmFsJylcbiAgICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICAgIGVsc2UgaWYgKHBhcnQudHlwZSA9PT0gJ21hY3JvJylcbiAgICAgICAgICByZXR1cm4gcGFydC5tYWNybygpO1xuXG4gICAgICAgIHJldHVybiBwYXJ0O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICByZXR1cm4gcGFydC5zb3VyY2U7XG4gICAgICB9XG4gICAgfSlcbiAgICAubWFwKGNhbGxiYWNrIHx8IE5PT1ApXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gKGl0ZW0gIT0gbnVsbCAmJiBpdGVtICE9PSAnJykpO1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gKGl0ZW1bTVlUSElYX1RZUEVdID09PSBFTEVNRU5UX0RFRklOSVRJT05fVFlQRSB8fCBpdGVtW01ZVEhJWF9UWVBFXSA9PT0gUVVFUllfRU5HSU5FX1RZUEUpKSlcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIGlmIChyZXN1bHQuc29tZSgoaXRlbSkgPT4gaXNUeXBlKGl0ZW0sICc6OlN0cmluZycpKSlcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuXG4gIHJldHVybiAocmVzdWx0Lmxlbmd0aCA8IDIpID8gcmVzdWx0WzBdIDogcmVzdWx0O1xufVxuXG5jb25zdCBGT1JNQVRfVEVSTV9BTExPV0FCTEVfTk9ERVMgPSBbIDMsIDIgXTsgLy8gVEVYVF9OT0RFLCBBVFRSSUJVVEVfTk9ERVxuXG4vKipcbiAqIGdyb3VwTmFtZTogVXRpbHNcbiAqIGRlc2M6IHxcbiAqICAgR2l2ZW4gYSBOb2RlLCB0YWtlIHRoZSBgLm5vZGVWYWx1ZWAgb2YgdGhhdCBub2RlLCBhbmQgaWYgaXQgaXMgYSB0ZW1wbGF0ZSxcbiAqICAgcGFyc2UgdGhhdCB0ZW1wbGF0ZSB1c2luZyBAc2VlIFV0aWxzLnBhcnNlVGVtcGxhdGVQYXJ0czssIGFuZCB0aGVuXG4gKiAgIGNvbXBpbGUgdGhhdCB0ZW1wbGF0ZSB1c2luZyBAc2VlIFV0aWxzLmNvbXBpbGVUZW1wbGF0ZUZyb21QYXJ0czsuIFRoZVxuICogICByZXN1bHRpbmcgdGVtcGxhdGUgcGFydHMgYXJlIHRoZW4gc2Nhbm5lZC4gSWYgYW55IG9mIHRoZSBgbWFjcm8oKWAgY2FsbHNcbiAqICAgcmVzdWx0IGluIGEgQHNlZSBVdGlscy5EeW5hbWljUHJvcGVydHk/Y2FwdGlvbj1EeW5hbWljUHJvcGVydHk7LCB0aGVuIHNldCB1cFxuICogICBsaXN0ZW5lcnMgdmlhIGBhZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAuLi4pYCBvbiBlYWNoIHRvIGxpc3RlbiBmb3JcbiAqICAgY2hhbmdlcyB0byBkeW5hbWljIHByb3BlcnRpZXMuIFdoZW4gYSBsaXN0ZW5lciB1cGRhdGVzLCB0aGUgdGVtcGxhdGUgcGFydHNcbiAqICAgYXJlIHJlY29tcGlsZWQsIGFuZCB0aGUgYC5ub2RlVmFsdWVgIGlzIHNldCBhZ2FpbiB3aXRoIHRoZSBuZXcgcmVzdWx0LlxuICpcbiAqICAgSW4gc2hvcnQsIHRoaXMgbWV0aG9kIGZvcm1hdHMgdGhlIHZhbHVlIG9mIGEgTm9kZSBpZiB0aGUgdmFsdWUgaXMgYSB0ZW1wbGF0ZSxcbiAqICAgYW5kIGluIGRvaW5nIHNvIGJpbmRzIHRvIGR5bmFtaWMgcHJvcGVydGllcyBmb3IgZnV0dXJlIHVwZGF0ZXMgdG8gdGhpcyBub2RlLlxuICpcbiAqICAgSWYgdGhlIGAubm9kZVZhbHVlYCBvZiB0aGUgTm9kZSBpcyBkZXRlY3RlZCB0byAqKm5vdCoqIGJlIGEgdGVtcGxhdGUsIHRoZW5cbiAqICAgdGhlIHJlc3VsdCBpcyBhIG5vLW9wZXJhdGlvbiwgYW5kIHRoZSByYXcgdmFsdWUgb2YgdGhlIE5vZGUgaXMgc2ltcGx5IHJldHVybmVkLlxuICogYXJndW1lbnRzOlxuICogICAtIG5hbWU6IG5vZGVcbiAqICAgICBkYXRhVHlwZTogTm9kZVxuICogICAgIGRlc2M6IHxcbiAqICAgICAgIFRoZSBOb2RlIHdob3NlIHZhbHVlIHNob3VsZCBiZSBmb3JtYXR0ZWQuIFRoaXMgbXVzdCBiZSBhIFRFWFRfTk9ERSBvciBhIEFUVFJJQlVURV9OT0RFLlxuICogcmV0dXJuOiB8XG4gKiAgIEB0eXBlcyBzdHJpbmc7IFRoZSByZXN1bHRpbmcgbm9kZSB2YWx1ZS4gSWYgYSB0ZW1wbGF0ZSB3YXMgc3VjY2Vzc2Z1bGx5IGNvbXBpbGVkLCBkeW5hbWljIHByb3BlcnRpZXNcbiAqICAgYXJlIGFsc28gbGlzdGVuZWQgdG8gZm9yIGZ1dHVyZSB1cGRhdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Tm9kZVZhbHVlKG5vZGUsIF9vcHRpb25zKSB7XG4gIGlmIChub2RlLnBhcmVudE5vZGUgJiYgKC9eKHN0eWxlfHNjcmlwdCkkLykudGVzdChub2RlLnBhcmVudE5vZGUubG9jYWxOYW1lKSlcbiAgICByZXR1cm4gbm9kZS5ub2RlVmFsdWU7XG5cbiAgaWYgKCFub2RlIHx8IEZPUk1BVF9URVJNX0FMTE9XQUJMRV9OT0RFUy5pbmRleE9mKG5vZGUubm9kZVR5cGUpIDwgMClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImZvcm1hdE5vZGVWYWx1ZVwiIHVuc3VwcG9ydGVkIG5vZGUgdHlwZSBwcm92aWRlZC4gT25seSBURVhUX05PREUgYW5kIEFUVFJJQlVURV9OT0RFIHR5cGVzIGFyZSBzdXBwb3J0ZWQuJyk7XG5cbiAgbGV0IG9wdGlvbnMgICAgICAgPSBfb3B0aW9ucyB8fCB7fTtcbiAgbGV0IHRleHQgICAgICAgICAgPSBub2RlLm5vZGVWYWx1ZTtcbiAgbGV0IHRlbXBsYXRlUGFydHMgPSBwYXJzZVRlbXBsYXRlUGFydHModGV4dCwgb3B0aW9ucyk7XG5cbiAgLy8gdGVtcGxhdGVQYXJ0cy5mb3JFYWNoKCh7IHR5cGUsIG1hY3JvIH0pID0+IHtcbiAgLy8gICBpZiAodHlwZSAhPT0gJ21hY3JvJylcbiAgLy8gICAgIHJldHVybjtcblxuICAvLyAgIGxldCByZXN1bHQgPSBtYWNybygpO1xuICAvLyAgIGlmIChvcHRpb25zLmJpbmRUb0R5bmFtaWNQcm9wZXJ0aWVzICE9PSBmYWxzZSAmJiBpc1R5cGUocmVzdWx0LCBEeW5hbWljUHJvcGVydHkpKSB7XG4gIC8vICAgICByZXN1bHQuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlJywgKCkgPT4ge1xuICAvLyAgICAgICBsZXQgcmVzdWx0ID0gKCcnICsgY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHRlbXBsYXRlUGFydHMpKTtcbiAgLy8gICAgICAgaWYgKHJlc3VsdCAhPT0gbm9kZS5ub2RlVmFsdWUpXG4gIC8vICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSByZXN1bHQ7XG4gIC8vICAgICB9LCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gIC8vICAgfVxuICAvLyB9KTtcblxuICBsZXQgcmVzdWx0ID0gY29tcGlsZVRlbXBsYXRlRnJvbVBhcnRzKHRlbXBsYXRlUGFydHMsIChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ICYmIG9wdGlvbnMuYmluZFRvRHluYW1pY1Byb3BlcnRpZXMgIT09IGZhbHNlICYmIGlzVHlwZShyZXN1bHQsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIHJlc3VsdC5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSAoJycgKyBjb21waWxlVGVtcGxhdGVGcm9tUGFydHModGVtcGxhdGVQYXJ0cykpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBub2RlLm5vZGVWYWx1ZSlcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHJlc3VsdDtcbiAgICAgIH0sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcblxuICBpZiAocmVzdWx0ID09IG51bGwpXG4gICAgcmVzdWx0ID0gJyc7XG5cbiAgcmV0dXJuIChvcHRpb25zLmRpc2FsbG93SFRNTCA9PT0gdHJ1ZSkgPyAoJycgKyByZXN1bHQpIDogcmVzdWx0O1xufVxuXG5jb25zdCBJU19URU1QTEFURSA9IC8oPzwhXFxcXClAQC87XG5leHBvcnQgZnVuY3Rpb24gaXNUZW1wbGF0ZSh2YWx1ZSkge1xuICBpZiAoIWlzVHlwZSh2YWx1ZSwgJzo6U3RyaW5nJykpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBJU19URU1QTEFURS50ZXN0KHZhbHVlKTtcbn1cblxuY29uc3QgSVNfRVZFTlRfTkFNRSAgICAgPSAvXm9uLztcbmNvbnN0IEVWRU5UX05BTUVfQ0FDSEUgID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRXZlbnROYW1lc0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgdGFnTmFtZSA9ICghZWxlbWVudC50YWdOYW1lKSA/IGVsZW1lbnQgOiBlbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKTtcbiAgbGV0IGNhY2hlICAgPSBFVkVOVF9OQU1FX0NBQ0hFLmdldCh0YWdOYW1lKTtcbiAgaWYgKGNhY2hlKVxuICAgIHJldHVybiBjYWNoZTtcblxuICBsZXQgZXZlbnROYW1lcyA9IFtdO1xuXG4gIGZvciAobGV0IGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGtleS5sZW5ndGggPiAyICYmIElTX0VWRU5UX05BTUUudGVzdChrZXkpKVxuICAgICAgZXZlbnROYW1lcy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgfVxuXG4gIEVWRU5UX05BTUVfQ0FDSEUuc2V0KHRhZ05hbWUsIGV2ZW50TmFtZXMpO1xuXG4gIHJldHVybiBldmVudE5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgX2NhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0ge307XG4gIGxldCBjYWxsYmFjaztcblxuICBpZiAoaXNQbGFpbk9iamVjdChfY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgID0gX2NhbGxiYWNrLmNhbGxiYWNrO1xuICAgIG9wdGlvbnMgICA9IF9jYWxsYmFjay5vcHRpb25zIHx8IHt9O1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gX2NhbGxiYWNrO1xuICB9XG5cbiAgaWYgKGlzVHlwZShjYWxsYmFjaywgJzo6U3RyaW5nJykpXG4gICAgY2FsbGJhY2sgPSBjcmVhdGVUZW1wbGF0ZU1hY3JvKHsgcHJlZml4OiAnbGV0IGV2ZW50PWFyZ3VtZW50c1sxXScsIGJvZHk6IGNhbGxiYWNrLCBzY29wZTogdGhpcyB9KTsgLy8gQHJlZjpfY3JlYXRlVGVtcGxhdGVNYWNyb1ByZWZpeEZvckJpbmRFdmVudFRvRWxlbWVudFxuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKTtcblxuICByZXR1cm4geyBjYWxsYmFjaywgb3B0aW9ucyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQYXRoKG9iaiwga2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKG9iaiA9PSBudWxsIHx8IE9iamVjdC5pcyhvYmosIE5hTikgfHwgT2JqZWN0LmlzKG9iaiwgSW5maW5pdHkpIHx8IE9iamVjdC5pcyhvYmosIC1JbmZpbml0eSkpXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICBpZiAoa2V5ID09IG51bGwgfHwgT2JqZWN0LmlzKGtleSwgTmFOKSB8fCBPYmplY3QuaXMoa2V5LCBJbmZpbml0eSkgfHwgT2JqZWN0LmlzKGtleSwgLUluZmluaXR5KSlcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuXG4gIGxldCBwYXJ0cyAgICAgICAgID0ga2V5LnNwbGl0KC8oPzwhXFxcXClcXC4vZykuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgY3VycmVudFZhbHVlICA9IG9iajtcblxuICBmb3IgKGxldCBpID0gMCwgaWwgPSBwYXJ0cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgbGV0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBsZXQgbmV4dFZhbHVlID0gY3VycmVudFZhbHVlW3BhcnRdO1xuICAgIGlmIChuZXh0VmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cbiAgICBjdXJyZW50VmFsdWUgPSBuZXh0VmFsdWU7XG4gIH1cblxuICBpZiAoZ2xvYmFsVGhpcy5Ob2RlICYmIGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUgaW5zdGFuY2VvZiBnbG9iYWxUaGlzLk5vZGUgJiYgKGN1cnJlbnRWYWx1ZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHwgY3VycmVudFZhbHVlLm5vZGVUeXBlID09PSBOb2RlLkFUVFJJQlVURV9OT0RFKSlcbiAgICByZXR1cm4gY3VycmVudFZhbHVlLm5vZGVWYWx1ZTtcblxuICByZXR1cm4gKGN1cnJlbnRWYWx1ZSA9PSBudWxsKSA/IGRlZmF1bHRWYWx1ZSA6IGN1cnJlbnRWYWx1ZTtcbn1cblxuY29uc3QgSVNfTlVNQkVSID0gL14oWy0rXT8pKFxcZCooPzpcXC5cXGQrKT8pKGVbLStdXFxkKyk/JC87XG5jb25zdCBJU19CT09MRUFOID0gL14odHJ1ZXxmYWxzZSkkLztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvZXJjZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09ICdudWxsJylcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgaWYgKHZhbHVlID09PSAnTmFOJylcbiAgICByZXR1cm4gTmFOO1xuXG4gIGlmICh2YWx1ZSA9PT0gJ0luZmluaXR5JyB8fCB2YWx1ZSA9PT0gJytJbmZpbml0eScpXG4gICAgcmV0dXJuIEluZmluaXR5O1xuXG4gIGlmICh2YWx1ZSA9PT0gJy1JbmZpbml0eScpXG4gICAgcmV0dXJuIC1JbmZpbml0eTtcblxuICBpZiAoSVNfTlVNQkVSLnRlc3QodmFsdWUpKVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUsIDEwKTtcblxuICBpZiAoSVNfQk9PTEVBTi50ZXN0KHZhbHVlKSlcbiAgICByZXR1cm4gKHZhbHVlID09PSAndHJ1ZScpO1xuXG4gIHJldHVybiAoJycgKyB2YWx1ZSk7XG59XG5cbmNvbnN0IENBQ0hFRF9QUk9QRVJUWV9OQU1FUyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBTS0lQX1BST1RPVFlQRVMgICAgICAgPSBbXG4gIGdsb2JhbFRoaXMuSFRNTEVsZW1lbnQsXG4gIGdsb2JhbFRoaXMuTm9kZSxcbiAgZ2xvYmFsVGhpcy5FbGVtZW50LFxuICBnbG9iYWxUaGlzLk9iamVjdCxcbiAgZ2xvYmFsVGhpcy5BcnJheSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxQcm9wZXJ0eU5hbWVzKF9vYmopIHtcbiAgaWYgKCFpc0NvbGxlY3RhYmxlKF9vYmopKVxuICAgIHJldHVybiBbXTtcblxuICBsZXQgY2FjaGVkTmFtZXMgPSBDQUNIRURfUFJPUEVSVFlfTkFNRVMuZ2V0KF9vYmopO1xuICBpZiAoY2FjaGVkTmFtZXMpXG4gICAgcmV0dXJuIGNhY2hlZE5hbWVzO1xuXG4gIGxldCBvYmogICA9IF9vYmo7XG4gIGxldCBuYW1lcyA9IG5ldyBTZXQoKTtcblxuICB3aGlsZSAob2JqKSB7XG4gICAgbGV0IG9iak5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBvYmpOYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgICAgbmFtZXMuYWRkKG9iak5hbWVzW2ldKTtcblxuICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIGlmIChvYmogJiYgU0tJUF9QUk9UT1RZUEVTLmluZGV4T2Yob2JqLmNvbnN0cnVjdG9yKSA+PSAwKVxuICAgICAgYnJlYWs7XG4gIH1cblxuICBsZXQgZmluYWxOYW1lcyA9IEFycmF5LmZyb20obmFtZXMpO1xuICBDQUNIRURfUFJPUEVSVFlfTkFNRVMuc2V0KF9vYmosIGZpbmFsTmFtZXMpO1xuXG4gIHJldHVybiBmaW5hbE5hbWVzO1xufVxuXG5jb25zdCBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUgPSBuZXcgV2Vha01hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldER5bmFtaWNQcm9wZXJ0eUZvclBhdGgoa2V5UGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIGxldCBpbnN0YW5jZUNhY2hlID0gTEFOR19QUk9WSURFUl9EWU5BTUlDX1BST1BFUlRZX0NBQ0hFLmdldCh0aGlzKTtcbiAgaWYgKCFpbnN0YW5jZUNhY2hlKSB7XG4gICAgaW5zdGFuY2VDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICBMQU5HX1BST1ZJREVSX0RZTkFNSUNfUFJPUEVSVFlfQ0FDSEUuc2V0KHRoaXMsIGluc3RhbmNlQ2FjaGUpO1xuICB9XG5cbiAgbGV0IHByb3BlcnR5ID0gaW5zdGFuY2VDYWNoZS5nZXQoa2V5UGF0aCk7XG4gIGlmICghcHJvcGVydHkpIHtcbiAgICBwcm9wZXJ0eSA9IG5ldyBEeW5hbWljUHJvcGVydHkoZGVmYXVsdFZhbHVlKTtcbiAgICBpbnN0YW5jZUNhY2hlLnNldChrZXlQYXRoLCBwcm9wZXJ0eSk7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGVjaWFsQ2xvc2VzdChub2RlLCBzZWxlY3Rvcikge1xuICBpZiAoIW5vZGUgfHwgIXNlbGVjdG9yKVxuICAgIHJldHVybjtcblxuICBsZXQgY3VycmVudE5vZGUgPSBub2RlO1xuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgKHR5cGVvZiBjdXJyZW50Tm9kZS5tYXRjaGVzICE9PSAnZnVuY3Rpb24nIHx8ICFjdXJyZW50Tm9kZS5tYXRjaGVzKHNlbGVjdG9yKSkpXG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcblxuICByZXR1cm4gY3VycmVudE5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGVlcChtcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zIHx8IDApO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNQcm9wKG5hbWUsIGRlZmF1bHRWYWx1ZSwgc2V0dGVyKSB7XG4gIGxldCBkeW5hbWljUHJvcGVydHkgPSBuZXcgRHluYW1pY1Byb3BlcnR5KGRlZmF1bHRWYWx1ZSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgIFtuYW1lXToge1xuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBkeW5hbWljUHJvcGVydHksXG4gICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHNldHRlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0oc2V0dGVyKG5ld1ZhbHVlKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkeW5hbWljUHJvcGVydHlbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gZHluYW1pY1Byb3BlcnR5O1xufVxuXG5jb25zdCBEWU5BTUlDX1BST1BfUkVHSVNUUlkgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY1Byb3BJRChpZCwgc2V0VmFsdWUpIHtcbiAgbGV0IHByb3AgPSBEWU5BTUlDX1BST1BfUkVHSVNUUlkuZ2V0KGlkKTtcbiAgaWYgKHByb3ApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXG4gICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHNldFZhbHVlKTtcblxuICAgIHJldHVybiBwcm9wO1xuICB9XG5cbiAgcHJvcCA9IG5ldyBEeW5hbWljUHJvcGVydHkoKGFyZ3VtZW50cy5sZW5ndGggPiAxKSA/IHNldFZhbHVlIDogJycpO1xuICBEWU5BTUlDX1BST1BfUkVHSVNUUlkuc2V0KGlkLCBwcm9wKTtcblxuICByZXR1cm4gcHJvcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JhbFN0b3JlTmFtZVZhbHVlUGFpckhlbHBlcih0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gIG1ldGFkYXRhKFxuICAgIHRhcmdldCxcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUixcbiAgICBbIG5hbWUsIHZhbHVlIF0sXG4gICk7XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuY29uc3QgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUyA9IG5ldyBTZXQoWyAnW2RhdGEtdGVtcGxhdGVzLWRpc2FibGVdJywgJ215dGhpeC1mb3ItZWFjaCcgXSk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3IoKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMpLmpvaW4oJywnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzYWJsZVRlbXBsYXRlRW5naW5lU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgUkVHSVNURVJFRF9ESVNBQkxFX1RFTVBMQVRFX1NFTEVDVE9SUy5hZGQoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlckRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIFJFR0lTVEVSRURfRElTQUJMRV9URU1QTEFURV9TRUxFQ1RPUlMuZGVsZXRlKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gZ2xvYmFsU3RvcmVIZWxwZXIoZHluYW1pYywgYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuO1xuXG4gIGNvbnN0IHNldE9uR2xvYmFsID0gKG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZSA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV07XG4gICAgaWYgKGlzVHlwZShjdXJyZW50VmFsdWUsIER5bmFtaWNQcm9wZXJ0eSkpIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV1bRHluYW1pY1Byb3BlcnR5LnNldF0odmFsdWUpO1xuICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNUeXBlKHZhbHVlLCBEeW5hbWljUHJvcGVydHkpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLCB7XG4gICAgICAgIFtuYW1lXToge1xuICAgICAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVbRHluYW1pY1Byb3BlcnR5LnNldF0obmV3VmFsdWUpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgbGV0IHByb3AgPSBkeW5hbWljUHJvcElEKG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSwge1xuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiAgIHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gcHJvcCxcbiAgICAgICAgICBzZXQ6ICAgICAgICAgIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgcHJvcFtEeW5hbWljUHJvcGVydHkuc2V0XShuZXdWYWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBwcm9wW0R5bmFtaWNQcm9wZXJ0eS5zZXRdKHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHByb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IG5hbWVWYWx1ZVBhaXIgPSAoaXNDb2xsZWN0YWJsZShhcmdzWzBdKSkgPyBtZXRhZGF0YShcbiAgICBhcmdzWzBdLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRleHRcbiAgICBNWVRISVhfTkFNRV9WQUxVRV9QQUlSX0hFTFBFUiwgIC8vIHNwZWNpYWwga2V5XG4gICkgOiBudWxsOyAvLyBAcmVmOl9teXRoaXhOYW1lVmFsdWVQYWlySGVscGVyVXNhZ2VcblxuICBpZiAobmFtZVZhbHVlUGFpcikge1xuICAgIGxldCBbIG5hbWUsIHZhbHVlIF0gPSBuYW1lVmFsdWVQYWlyO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA+IDEgJiYgaXNUeXBlKGFyZ3NbMF0sICc6OlN0cmluZycpKSB7XG4gICAgbGV0IG5hbWUgID0gYXJnc1swXTtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzFdO1xuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdmFsdWUgPSBhcmdzWzBdO1xuICAgIGxldCBuYW1lICA9ICh0eXBlb2YgdGhpcy5nZXRJZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSA/IHRoaXMuZ2V0SWRlbnRpZmllcigpIDogKHRoaXMuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHRoaXMuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIGlmICghbmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJteXRoaXhVSS5nbG9iYWxTdG9yZVwiOiBcIm5hbWVcIiBpcyB1bmtub3duLCBzbyB1bmFibGUgdG8gc3RvcmUgdmFsdWUnKTtcblxuICAgIHNldE9uR2xvYmFsKG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsU3RvcmUoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCBmYWxzZSwgYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iYWxTdG9yZUR5bmFtaWMoLi4uYXJncykge1xuICByZXR1cm4gZ2xvYmFsU3RvcmVIZWxwZXIuY2FsbCh0aGlzLCB0cnVlLCBhcmdzKTtcbn1cblxuY2xhc3MgU3RvcmFnZUl0ZW0ge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHRoaXMuX2MgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3UgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMuX3YgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92O1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl91ID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLl92ID0gdmFsdWU7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICR0eXBlOiAgJ1N0b3JhZ2VJdGVtJyxcbiAgICAgIF9jOiAgICAgdGhpcy5fYyxcbiAgICAgIF91OiAgICAgdGhpcy5fdSxcbiAgICAgIF92OiAgICAgdGhpcy5fdixcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIFN0b3JhZ2Uge1xuICBfcmV2aXZlKGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBpc1ByaW1pdGl2ZShkYXRhKSlcbiAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgbGV0IGFscmVhZHlWaXNpdGVkICA9IF9hbHJlYWR5VmlzaXRlZCB8fCBuZXcgU2V0KCk7XG4gICAgbGV0IHR5cGUgICAgICAgICAgICA9IChkYXRhICYmIGRhdGEuJHR5cGUpO1xuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09PSAnU3RvcmFnZUl0ZW0nKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGEuX3Y7XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFN0b3JhZ2VJdGVtKCksIHtcbiAgICAgICAgICBfYzogZGF0YS5fYyxcbiAgICAgICAgICBfdTogZGF0YS5fdSxcbiAgICAgICAgICBfdjogKHZhbHVlICYmICFpc1ByaW1pdGl2ZSh2YWx1ZSkpID8gdGhpcy5fcmV2aXZlKHZhbHVlLCBhbHJlYWR5VmlzaXRlZCkgOiB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgWyBrZXksIHZhbHVlIF0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcbiAgICAgIGlmICghdmFsdWUgfHwgaXNQcmltaXRpdmUodmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKGFscmVhZHlWaXNpdGVkLmhhcyh2YWx1ZSkpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBhbHJlYWR5VmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgZGF0YVtrZXldID0gdGhpcy5fcmV2aXZlKHZhbHVlLCBhbHJlYWR5VmlzaXRlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfcmF3KGRhdGEsIF9hbHJlYWR5VmlzaXRlZCkge1xuICAgIGlmICghZGF0YSB8fCBpc1ByaW1pdGl2ZShkYXRhKSlcbiAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgbGV0IGFscmVhZHlWaXNpdGVkID0gX2FscmVhZHlWaXNpdGVkIHx8IG5ldyBTZXQoKTtcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFN0b3JhZ2VJdGVtKVxuICAgICAgcmV0dXJuIHRoaXMuX3JhdyhkYXRhLmdldFZhbHVlKCksIGFscmVhZHlWaXNpdGVkKTtcblxuICAgIGZvciAobGV0IFsga2V5LCB2YWx1ZSBdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICBpZiAoIXZhbHVlIHx8IGlzUHJpbWl0aXZlKHZhbHVlKSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChhbHJlYWR5VmlzaXRlZC5oYXModmFsdWUpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgYWxyZWFkeVZpc2l0ZWQuYWRkKHZhbHVlKTtcbiAgICAgIGRhdGFba2V5XSA9IHRoaXMuX3Jhdyh2YWx1ZSwgYWxyZWFkeVZpc2l0ZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2dldFBhcnRzRm9yT3BlcmF0aW9uKHR5cGUsIHBhcnRzKSB7XG4gICAgbGV0IHBhdGhQYXJ0cyAgID0gKHR5cGUgPT09ICdzZXQnKSA/IHBhcnRzLnNsaWNlKDAsIC0xKSA6IHBhcnRzLnNsaWNlKCk7XG4gICAgbGV0IHBhdGggICAgICAgID0gcGF0aFBhcnRzLm1hcCgocGFydCkgPT4gKCh0eXBlb2YgcGFydCA9PT0gJ3N5bWJvbCcpID8gcGFydC50b1N0cmluZygpIDogKCcnICsgcGFydCkpLnJlcGxhY2UoL1xcLi9nLCAnXFxcXC4nKSkuam9pbignLicpO1xuICAgIGxldCBwYXJzZWRQYXJ0cyA9IHBhdGguc3BsaXQoLyg/PCFcXFxcKVxcLi9nKTtcbiAgICBsZXQgc3RvcmFnZVR5cGUgPSBwYXJzZWRQYXJ0c1swXTtcbiAgICBsZXQgZGF0YSAgICAgICAgPSAodHlwZSA9PT0gJ3NldCcpID8gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBsb2NhbFN0b3JhZ2UsIG9yIHNlc3Npb25TdG9yYWdlXG4gICAgbGV0IHN0b3JhZ2VFbmdpbmUgPSBnbG9iYWxUaGlzW3N0b3JhZ2VUeXBlXTtcbiAgICBpZiAoIXN0b3JhZ2VFbmdpbmUpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgcm9vdERhdGEgICAgPSB7fTtcbiAgICBsZXQgZW5jb2RlZEJhc2UgPSBzdG9yYWdlRW5naW5lLmdldEl0ZW0oJ215dGhpeC11aScpO1xuICAgIGlmIChlbmNvZGVkQmFzZSlcbiAgICAgIHJvb3REYXRhID0gdGhpcy5fcmV2aXZlKEpTT04ucGFyc2UoZW5jb2RlZEJhc2UpKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwYXRoUGFydHMsXG4gICAgICBwYXRoLFxuICAgICAgcGFyc2VkUGFydHMsXG4gICAgICBzdG9yYWdlVHlwZSxcbiAgICAgIGRhdGEsXG4gICAgICBzdG9yYWdlRW5naW5lLFxuICAgICAgZW5jb2RlZEJhc2UsXG4gICAgICByb290RGF0YSxcbiAgICB9O1xuICB9XG5cbiAgX2dldE1ldGEodHlwZSwgcGFydHMpIHtcbiAgICBsZXQgb3BlcmF0aW9uID0gdGhpcy5fZ2V0UGFydHNGb3JPcGVyYXRpb24odHlwZSwgcGFydHMpO1xuICAgIGxldCB7XG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHJvb3REYXRhLFxuICAgIH0gPSBvcGVyYXRpb247XG5cbiAgICBsZXQgc2NvcGUgICAgICAgID0gcm9vdERhdGE7XG4gICAgbGV0IHBhcmVudFNjb3BlICA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMSwgaWwgPSBwYXJzZWRQYXJ0cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBpZiAoc2NvcGUgaW5zdGFuY2VvZiBTdG9yYWdlSXRlbSkge1xuICAgICAgICBzY29wZSA9IHNjb3BlLmdldFZhbHVlKCk7XG4gICAgICAgIGlmICghc2NvcGUpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBwYXJ0ID0gcGFyc2VkUGFydHNbaV07XG4gICAgICBsZXQgc3ViU2NvcGUgPSAoc2NvcGUpID8gc2NvcGVbcGFydF0gOiBzY29wZTtcbiAgICAgIGlmICh0eXBlID09PSAnc2V0JyAmJiAhc3ViU2NvcGUpXG4gICAgICAgIHN1YlNjb3BlID0gc2NvcGVbcGFydF0gPSB7fTtcblxuICAgICAgaWYgKHN1YlNjb3BlID09IG51bGwgfHwgT2JqZWN0LmlzKHN1YlNjb3BlLCBOYU4pIHx8IE9iamVjdC5pcyhzdWJTY29wZSwgLUluZmluaXR5KSB8fCBPYmplY3QuaXMoc3ViU2NvcGUsIEluZmluaXR5KSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIHBhcmVudFNjb3BlID0gc2NvcGU7XG4gICAgICBzY29wZSA9IHN1YlNjb3BlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBvcGVyYXRpb24sXG4gICAgICBwYXJlbnRTY29wZSxcbiAgICAgIHNjb3BlLFxuICAgIH07XG4gIH1cblxuICBnZXRNZXRhKC4uLnBhcnRzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldE1ldGEoJ2dldCcsIHBhcnRzKTtcbiAgfVxuXG4gIGdldCguLi5wYXJ0cykge1xuICAgIGxldCB7IHNjb3BlIH0gPSB0aGlzLl9nZXRNZXRhKCdnZXQnLCBwYXJ0cyk7XG4gICAgcmV0dXJuIHRoaXMuX3JhdyhzY29wZSk7XG4gIH1cblxuICBzZXQoLi4ucGFydHMpIHtcbiAgICBsZXQge1xuICAgICAgb3BlcmF0aW9uLFxuICAgICAgcGFyZW50U2NvcGUsXG4gICAgICBzY29wZSxcbiAgICB9ID0gdGhpcy5fZ2V0TWV0YSgnc2V0JywgcGFydHMpO1xuXG4gICAgbGV0IHtcbiAgICAgIGRhdGEsXG4gICAgICBwYXJzZWRQYXJ0cyxcbiAgICAgIHBhdGgsXG4gICAgICByb290RGF0YSxcbiAgICAgIHN0b3JhZ2VFbmdpbmUsXG4gICAgfSA9IG9wZXJhdGlvbjtcblxuICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIERlbGV0ZVxuICAgICAgaWYgKHBhcmVudFNjb3BlKVxuICAgICAgICBkZWxldGUgcGFyZW50U2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dO1xuICAgICAgZWxzZVxuICAgICAgICBkZWxldGUgc2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGFyZW50U2NvcGUpXG4gICAgICAgIHBhcmVudFNjb3BlW3BhcnNlZFBhcnRzW3BhcnNlZFBhcnRzLmxlbmd0aCAtIDFdXSA9IG5ldyBTdG9yYWdlSXRlbShkYXRhKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2NvcGVbcGFyc2VkUGFydHNbcGFyc2VkUGFydHMubGVuZ3RoIC0gMV1dID0gbmV3IFN0b3JhZ2VJdGVtKGRhdGEpO1xuICAgIH1cblxuICAgIHN0b3JhZ2VFbmdpbmUuc2V0SXRlbSgnbXl0aGl4LXVpJywgSlNPTi5zdHJpbmdpZnkocm9vdERhdGEpKTtcblxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbn1cblxuZXhwb3J0IGNvbnN0IHN0b3JhZ2UgPSBuZXcgU3RvcmFnZSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJnbG9iYWxUaGlzLm15dGhpeFVJID0gKGdsb2JhbFRoaXMubXl0aGl4VUkgfHwge30pO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZSA9IChnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlIHx8IHt9KTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIWdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUudXJsKVxuICBnbG9iYWxUaGlzLm15dGhpeFVJLmdsb2JhbFNjb3BlLnVybCA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pO1xuXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIENvbXBvbmVudHMgZnJvbSAnLi9jb21wb25lbnRzLmpzJztcbmltcG9ydCAqIGFzIEVsZW1lbnRzIGZyb20gJy4vZWxlbWVudHMuanMnO1xuXG5leHBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1lbmdpbmUuanMnO1xuZXhwb3J0ICogYXMgQ29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudHMuanMnO1xuZXhwb3J0ICogYXMgRWxlbWVudHMgZnJvbSAnLi9lbGVtZW50cy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL215dGhpeC11aS1yZXF1aXJlLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLWxhbmd1YWdlLXByb3ZpZGVyLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbXl0aGl4LXVpLXNwaW5uZXIuanMnO1xuXG5jb25zdCBNeXRoaXhVSUNvbXBvbmVudCA9IENvbXBvbmVudHMuTXl0aGl4VUlDb21wb25lbnQ7XG5jb25zdCBEeW5hbWljUHJvcGVydHkgICA9IFV0aWxzLkR5bmFtaWNQcm9wZXJ0eTtcblxuZXhwb3J0IHtcbiAgTXl0aGl4VUlDb21wb25lbnQsXG4gIER5bmFtaWNQcm9wZXJ0eSxcbn07XG5cbmxldCBfbXl0aGl4SXNSZWFkeSA9IGZhbHNlO1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAnb25teXRoaXhyZWFkeSc6IHtcbiAgICBlbnVtZXJhYmxlOiAgIGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICAgICAgICAgICgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2V0OiAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgIGlmIChfbXl0aGl4SXNSZWFkeSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGNhbGxiYWNrKG5ldyBFdmVudCgnbXl0aGl4LXJlYWR5JykpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdteXRoaXgtcmVhZHknLCBjYWxsYmFjayk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5nbG9iYWxUaGlzLm15dGhpeFVJLlV0aWxzID0gVXRpbHM7XG5nbG9iYWxUaGlzLm15dGhpeFVJLkNvbXBvbmVudHMgPSBDb21wb25lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5FbGVtZW50cyA9IEVsZW1lbnRzO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZSA9IFV0aWxzLmdsb2JhbFN0b3JlO1xuZ2xvYmFsVGhpcy5teXRoaXhVSS5nbG9iYWxTY29wZS5nbG9iYWxTdG9yZUR5bmFtaWMgPSBVdGlscy5nbG9iYWxTdG9yZUR5bmFtaWM7XG5cbmdsb2JhbFRoaXMubXl0aGl4VUkuZ2xvYmFsU2NvcGUuZHluYW1pY1Byb3BJRCA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiBVdGlscy5keW5hbWljUHJvcElEKGlkKTtcbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGxldCBkaWRWaXNpYmlsaXR5T2JzZXJ2ZXJzID0gZmFsc2U7XG5cbiAgY29uc3Qgb25Eb2N1bWVudFJlYWR5ID0gKCkgPT4ge1xuICAgIGlmICghZGlkVmlzaWJpbGl0eU9ic2VydmVycykge1xuICAgICAgbGV0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1teXRoaXgtc3JjXScpKTtcbiAgICAgIENvbXBvbmVudHMudmlzaWJpbGl0eU9ic2VydmVyKCh7IGRpc2Nvbm5lY3QsIGVsZW1lbnQsIHdhc1Zpc2libGUgfSkgPT4ge1xuICAgICAgICBpZiAod2FzVmlzaWJsZSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGxldCBzcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1teXRoaXgtc3JjJyk7XG4gICAgICAgIGlmICghc3JjKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBDb21wb25lbnRzLmxvYWRQYXJ0aWFsSW50b0VsZW1lbnQuY2FsbChlbGVtZW50LCBzcmMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXl0aGl4LXJlYWR5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgeyBlbGVtZW50cyB9KTtcblxuICAgICAgZGlkVmlzaWJpbGl0eU9ic2VydmVycyA9IHRydWU7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdteXRoaXgtcmVhZHknKTtcblxuICAgIGlmIChfbXl0aGl4SXNSZWFkeSlcbiAgICAgIHJldHVybjtcblxuICAgIF9teXRoaXhJc1JlYWR5ID0gdHJ1ZTtcblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdteXRoaXgtcmVhZHknKSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2xvYmFsVGhpcywge1xuICAgICckJzoge1xuICAgICAgd3JpdGFibGU6ICAgICB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogICB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6ICAgICAgICAoLi4uYXJncykgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvciguLi5hcmdzKSxcbiAgICB9LFxuICAgICckJCc6IHtcbiAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6ICAgdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiAgICAgICAgKC4uLmFyZ3MpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoLi4uYXJncyksXG4gICAgfSxcbiAgfSk7XG5cbiAgbGV0IGRvY3VtZW50TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbFRoaXMubXl0aGl4VUkuZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciA9IFV0aWxzLmdldERpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gbXV0YXRpb25zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgIGxldCBtdXRhdGlvbiAgPSBtdXRhdGlvbnNbaV07XG4gICAgICBsZXQgdGFyZ2V0ICAgID0gbXV0YXRpb24udGFyZ2V0O1xuXG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnKSB7XG4gICAgICAgIGlmIChkaXNhYmxlVGVtcGxhdGVFbmdpbmVTZWxlY3RvclN0ciAmJiB0YXJnZXQucGFyZW50Tm9kZSAmJiB0eXBlb2YgdGFyZ2V0LnBhcmVudE5vZGUuY2xvc2VzdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXJnZXQucGFyZW50Tm9kZS5jbG9zZXN0KGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGVOb2RlKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWUgICAgICA9IChhdHRyaWJ1dGVOb2RlKSA/IGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlIDogbnVsbDtcbiAgICAgICAgbGV0IG9sZFZhbHVlICAgICAgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcblxuICAgICAgICBpZiAob2xkVmFsdWUgPT09IG5ld1ZhbHVlKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiBVdGlscy5pc1RlbXBsYXRlKG5ld1ZhbHVlKSlcbiAgICAgICAgICBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZSA9IFV0aWxzLmZvcm1hdE5vZGVWYWx1ZShhdHRyaWJ1dGVOb2RlLCB7IHNjb3BlOiBVdGlscy5jcmVhdGVTY29wZSh0YXJnZXQpLCBkaXNhbGxvd0hUTUw6IHRydWUgfSk7XG5cbiAgICAgICAgbGV0IG9ic2VydmVkQXR0cmlidXRlcyA9IHRhcmdldC5jb25zdHJ1Y3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIGlmIChvYnNlcnZlZEF0dHJpYnV0ZXMgJiYgb2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YobXV0YXRpb24uYXR0cmlidXRlTmFtZSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbCh0YXJnZXQsIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgbGV0IGRpc2FibGVUZW1wbGF0aW5nID0gKGRpc2FibGVUZW1wbGF0ZUVuZ2luZVNlbGVjdG9yU3RyICYmIHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LmNsb3Nlc3QgPT09ICdmdW5jdGlvbicgJiYgdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXRlbXBsYXRlcy1kaXNhYmxlXSxteXRoaXgtZm9yLWVhY2gnKSk7XG4gICAgICAgIGxldCBhZGRlZE5vZGVzICAgICAgICA9IG11dGF0aW9uLmFkZGVkTm9kZXM7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBqbCA9IGFkZGVkTm9kZXMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgIGxldCBub2RlID0gYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIGlmIChub2RlW0NvbXBvbmVudHMuaXNNeXRoaXhDb21wb25lbnRdICYmIG5vZGUub25NdXRhdGlvbkFkZGVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCFkaXNhYmxlVGVtcGxhdGluZylcbiAgICAgICAgICAgIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhub2RlKTtcblxuICAgICAgICAgIGlmICh0YXJnZXRbQ29tcG9uZW50cy5pc015dGhpeENvbXBvbmVudF0pXG4gICAgICAgICAgICB0YXJnZXQub25NdXRhdGlvbkNoaWxkQWRkZWQobm9kZSwgbXV0YXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlbW92ZWROb2RlcyA9IG11dGF0aW9uLnJlbW92ZWROb2RlcztcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpsID0gcmVtb3ZlZE5vZGVzLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICBsZXQgbm9kZSA9IHJlbW92ZWROb2Rlc1tqXTtcbiAgICAgICAgICBpZiAobm9kZVtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSAmJiBub2RlLm9uTXV0YXRpb25SZW1vdmVkLmNhbGwobm9kZSwgbXV0YXRpb24pID09PSBmYWxzZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKHRhcmdldFtDb21wb25lbnRzLmlzTXl0aGl4Q29tcG9uZW50XSlcbiAgICAgICAgICAgIHRhcmdldC5vbk11dGF0aW9uQ2hpbGRSZW1vdmVkKG5vZGUsIG11dGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnRNdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBzdWJ0cmVlOiAgICAgICAgICAgIHRydWUsXG4gICAgY2hpbGRMaXN0OiAgICAgICAgICB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6ICAgICAgICAgdHJ1ZSxcbiAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogIHRydWUsXG4gIH0pO1xuXG4gIEVsZW1lbnRzLnByb2Nlc3NFbGVtZW50cyhkb2N1bWVudC5oZWFkKTtcbiAgRWxlbWVudHMucHJvY2Vzc0VsZW1lbnRzKGRvY3VtZW50LmJvZHkpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKVxuICAgICAgb25Eb2N1bWVudFJlYWR5KCk7XG4gICAgZWxzZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uRG9jdW1lbnRSZWFkeSk7XG4gIH0sIDI1MCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkRvY3VtZW50UmVhZHkpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9