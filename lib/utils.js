import {
  MYTHIX_NAME_VALUE_PAIR_HELPER,
  MYTHIX_SHADOW_PARENT,
  MYTHIX_TYPE,
  ELEMENT_DEFINITION_TYPE,
  QUERY_ENGINE_TYPE,
} from './constants.js';

import * as BaseUtils from './base-utils.js';

import { DynamicProperty } from './dynamic-property.js';

/**
 * type: Namespace
 * name: Utils
 * groupName: Utils
 * desc: |
 *   `import { Utils } from 'mythix-ui-core@1.0';`
 *
 *   Misc utility functions are found within this namespace.
 */

export function bindMethods(_proto, skipProtos) {
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

export function getDescriptorFromPrototypeChain(startProto, descriptorName) {
  let thisProto = startProto;
  let descriptor;

  while (thisProto && !(descriptor = Object.getOwnPropertyDescriptor(thisProto, descriptorName)))
    thisProto = Object.getPrototypeOf(thisProto);

  return { prototype: thisProto, descriptor };
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
export function metadata(target, key, value) {
  let data = METADATA_WEAKMAP.get(target);
  if (!data) {
    if (!BaseUtils.isCollectable(target))
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

const VALID_JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const RESERVED_IDENTIFIER = /^(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|let|static|yield)$/;

function getContextCallArgs(context, ...extraContexts) {
  let contextCallArgs = Array.from(
    new Set(getAllPropertyNames(context).concat(
      Object.keys(globalThis.mythixUI.globalScope || {}),
      [ 'attributes', 'classList', '$$', 'i18n' ],
      ...extraContexts.map((extraContext) => Object.keys(extraContext || {})),
    )),
  ).filter((name) => {
    if (RESERVED_IDENTIFIER.test(name))
      return false;

    return VALID_JS_IDENTIFIER.test(name);
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
 *     `element`. When a `null` parent is encountered, `getParentNode` will look for @see MythixUIComponent.metadata?caption=metadata; key @see Constants.MYTHIX_SHADOW_PARENT;
 *     on `element`. If found, the result is considered the [parent Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) of `element`.
 * return: |
 *   @types Node; The parent node, if there is any, or `null` otherwise.
 */
export function getParentNode(element) {
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
export function createScope(..._targets) {
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
        if (BaseUtils.isType(scope[propName], DynamicProperty))
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
export function createTemplateMacro({ prefix, body, scope }) {
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
export function parseTemplateParts(text, _options) {
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
export function compileTemplateFromParts(parts, callback) {
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

  if (result.some((item) => BaseUtils.isType(item, '::String')))
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
 *   result in a @see DynamicProperty?caption=DynamicProperty;, then set up
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
export function formatNodeValue(node, _options) {
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
    if (result && options.bindToDynamicProperties !== false && BaseUtils.isType(result, DynamicProperty)) {
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
export function isTemplate(value) {
  if (!BaseUtils.isType(value, '::String'))
    return false;

  return IS_TEMPLATE.test(value);
}

const IS_EVENT_NAME     = /^on/;
const EVENT_NAME_CACHE  = new Map();

export function getAllEventNamesForElement(element) {
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

export function bindEventToElement(element, eventName, _callback) {
  let options = {};
  let callback;

  if (BaseUtils.isPlainObject(_callback)) {
    callback  = _callback.callback;
    options   = _callback.options || {};
  } else {
    callback = _callback;
  }

  if (BaseUtils.isType(callback, '::String'))
    callback = createTemplateMacro({ prefix: 'let event=arguments[1]', body: callback, scope: this }); // @ref:_createTemplateMacroPrefixForBindEventToElement

  element.addEventListener(eventName, callback, options);

  return { callback, options };
}

export function fetchPath(obj, key, defaultValue) {
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

const CACHED_PROPERTY_NAMES = new WeakMap();
const SKIP_PROTOTYPES       = [
  globalThis.HTMLElement,
  globalThis.Node,
  globalThis.Element,
  globalThis.Object,
  globalThis.Array,
];

export function getAllPropertyNames(_obj) {
  if (!BaseUtils.isCollectable(_obj))
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
export function getDynamicPropertyForPath(keyPath, defaultValue) {
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

export function specialClosest(node, selector) {
  if (!node || !selector)
    return;

  let currentNode = node;
  while (currentNode && (typeof currentNode.matches !== 'function' || !currentNode.matches(selector)))
    currentNode = getParentNode(currentNode);

  return currentNode;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 0);
  });
}

export function dynamicProp(name, defaultValue, setter) {
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
export function dynamicPropID(id, setValue) {
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

export function globalStoreNameValuePairHelper(target, name, value) {
  metadata(
    target,
    MYTHIX_NAME_VALUE_PAIR_HELPER,
    [ name, value ],
  );

  return target;
}

const REGISTERED_DISABLE_TEMPLATE_SELECTORS = new Set([ '[data-templates-disable]', 'mythix-for-each' ]);
export function getDisableTemplateEngineSelector() {
  return Array.from(REGISTERED_DISABLE_TEMPLATE_SELECTORS).join(',');
}

export function registerDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.add(selector);
}

export function unregisterDisableTemplateEngineSelector(selector) {
  REGISTERED_DISABLE_TEMPLATE_SELECTORS.delete(selector);
}

function globalStoreHelper(dynamic, args) {
  if (args.length === 0)
    return;

  const setOnGlobal = (name, value) => {
    let currentValue = globalThis.mythixUI.globalScope[name];
    if (BaseUtils.isType(currentValue, DynamicProperty)) {
      globalThis.mythixUI.globalScope[name][DynamicProperty.set](value);
      return currentValue;
    }

    if (BaseUtils.isType(value, DynamicProperty)) {
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

  let nameValuePair = (BaseUtils.isCollectable(args[0])) ? metadata(
    args[0],                        // context
    MYTHIX_NAME_VALUE_PAIR_HELPER,  // special key
  ) : null; // @ref:_mythixNameValuePairHelperUsage

  if (nameValuePair) {
    let [ name, value ] = nameValuePair;
    setOnGlobal(name, value);
  } else if (args.length > 1 && BaseUtils.isType(args[0], '::String')) {
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

export function globalStore(...args) {
  return globalStoreHelper.call(this, false, args);
}

export function globalStoreDynamic(...args) {
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
    if (!data || BaseUtils.isPrimitive(data))
      return data;

    let alreadyVisited  = _alreadyVisited || new Set();
    let type            = (data && data.$type);

    if (type) {
      if (type === 'StorageItem') {
        let value = data._v;

        return Object.assign(new StorageItem(), {
          _c: data._c,
          _u: data._u,
          _v: (value && !BaseUtils.isPrimitive(value)) ? this._revive(value, alreadyVisited) : value,
        });
      }
    }

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || BaseUtils.isPrimitive(value))
        continue;

      if (alreadyVisited.has(value))
        continue;

      alreadyVisited.add(value);
      data[key] = this._revive(value, alreadyVisited);
    }

    return data;
  }

  _raw(data, _alreadyVisited) {
    if (!data || BaseUtils.isPrimitive(data))
      return data;

    let alreadyVisited = _alreadyVisited || new Set();
    if (data instanceof StorageItem)
      return this._raw(data.getValue(), alreadyVisited);

    for (let [ key, value ] of Object.entries(data)) {
      if (!value || BaseUtils.isPrimitive(value))
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

export const storage = new Storage();
