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

function getDescriptorFromPrototypeChain(startProto, descriptorName) {
  let thisProto = startProto;
  let descriptor;

  while (thisProto && !(descriptor = Object.getOwnPropertyDescriptor(thisProto, descriptorName)))
    thisProto = Object.getPrototypeOf(thisProto);

  return descriptor;
}

const IS_ATTR_METHOD_NAME   = /^attr\$(.*)$/;
const REGISTERED_COMPONENTS = new Set();

export class MythixUIComponent extends HTMLElement {
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
    let names = Utils.getAllPropertyNames(proto)
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

        return Utils.toSnakeCase(name);
      });

    REGISTERED_COMPONENTS.add(Klass);

    return names;
  };

  set attr$dataMythixSrc([ oldValue, newValue ]) {
    this.awaitFetchSrcOnVisible(newValue, oldValue);
  }

  constructor() {
    super();

    Utils.bindMethods.call(this, this.constructor.prototype, [ HTMLElement.prototype ]);

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
    let styleID       = `IDSTYLE${Utils.SHA256(`${this.sensitiveTagName}:${content}`)}`;
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
        childNode.nodeValue = Utils.formatTerm(this, childNode);
      } else if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType >= Node.DOCUMENT_NODE) {
        childNode = this.processElements(childNode);

        let eventNames      = Utils.getAllEventNamesForElement(childNode);
        let attributeNames  = childNode.getAttributeNames();
        for (let i = 0, il = attributeNames.length; i < il; i++) {
          let attributeName       = attributeNames[i];
          let lowerAttributeName  = attributeName.toLowerCase();
          let attributeValue      = childNode.getAttribute(attributeName);

          if (eventNames.indexOf(lowerAttributeName) >= 0) {
            Utils.bindEventToElement(childNode, childNode, lowerAttributeName.substring(2), attributeValue);
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

  attachShadow(options) {
    // Check environment support
    if (typeof super.attachShadow !== 'function')
      return;

    let shadow = super.attachShadow(options);
    Utils.metadata(shadow, '_mythixUIShadowParent', this);

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
      let magicName   = `attr$${Utils.toCamelCase(name)}`;
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

    return Utils.createProxyContext(this, context);
  }

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

  isAttributeTruthy(name) {
    if (!this.hasAttribute(name))
      return false;

    let value = this.getAttribute(name);
    if (value === '' || value === 'true')
      return true;

    return false;
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

    let dynamicProperty = new Utils.DynamicProperty(getter, setter);
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

export function resolveURL(location, _urlish, magic) {
  let urlish = _urlish;
  if (urlish instanceof URL)
    return urlish;

  if (!urlish)
    return new URL(location);

  if (urlish instanceof Location)
    return new URL(urlish);

  if (!Utils.isType(urlish, 'String'))
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

export function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
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

      let styleID = `ID${Utils.SHA256(`${guessedElementName}:${childClone.innerHTML}`)}`;
      if (!childClone.getAttribute('id'))
        childClone.setAttribute('id', styleID);

      // append to head
      if (!ownerDocument.querySelector(`script#${styleID}`))
        ownerDocument.head.appendChild(childClone);
    } else if ((/^(link|style)$/i).test(child.tagName)) {
      let isStyle = (/^style$/i).test(child.tagName);
      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isStyle, isLink: !isStyle, isHandled: true }) === false)
        continue;

      let id = `ID${Utils.SHA256(child.outerHTML)}`;
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

export async function require(ownerDocument, urlOrName, _options) {
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

export async function loadPartialIntoElement(src) {
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
    scopeData[key] = Utils.coerce(value);

  let context = Utils.createProxyContext(this, scopeData);
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

export function visibilityObserver(callback, _options) {
  const intersectionCallback = (entries) => {
    for (let i = 0, il = entries.length; i < il; i++) {
      let entry   = entries[i];
      let element = entry.target;
      if (!entry.isIntersecting)
        continue;

      let elementObservers = Utils.metadata(element, '_mythixUIIntersectionObservers');
      if (!elementObservers) {
        elementObservers = new Map();
        Utils.metadata(element, '_mythixUIIntersectionObservers', elementObservers);
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

export function getVisibilityMeta(element, observer) {
  let elementObservers = Utils.metadata(element, '_mythixUIIntersectionObservers');
  if (!elementObservers)
    return NO_OBSERVER;

  return elementObservers.get(observer) || NO_OBSERVER;
}

export function remapNodeTree(node, callback, _index) {
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

export function recursivelyBindDynamicData(context, node) {
  return remapNodeTree(node, (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let nodeValue = node.nodeValue;
      if (nodeValue && Utils.stringIsDynamicBindingTemplate(nodeValue))
        node.nodeValue = Utils.formatTerm(context, node);
    } else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType >= Node.DOCUMENT_NODE) {
      let eventNames      = Utils.getAllEventNamesForElement(node);
      let attributeNames  = node.getAttributeNames();
      for (let i = 0, il = attributeNames.length; i < il; i++) {
        let attributeName       = attributeNames[i];
        let lowerAttributeName  = attributeName.toLowerCase();
        if (eventNames.indexOf(lowerAttributeName) >= 0)
          continue;

        let attributeValue = node.getAttribute(attributeName);
        if (attributeValue && Utils.stringIsDynamicBindingTemplate(attributeValue)) {
          let attributeNode = node.getAttributeNode(attributeName);
          attributeNode.nodeValue = Utils.formatTerm(context, attributeNode);
        }
      }
    }

    return node;
  });
}
