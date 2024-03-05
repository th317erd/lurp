import * as ComponentUtils from './component-utils.js';
import { MythixUIComponent } from './mythix-ui-component.js';

const IS_TEMPLATE       = /^(template)$/i;
const TEMPLATE_TEMPLATE = /^(\*|\|\*|\*\|)$/;

/**
 * type: MythixElement
 * name: MythixUIRequire
 * groupName: MythixElements
 * desc: |
 *   ```javascript
 *   import { MythixElements } from 'mythix-ui-core@1.0';
 *
 *   const {
 *     MythixUIRequire,
 *   } = MythixElements;
 *   ```
 *
 *   MythixUIRequire is an Element that will load other resources. It is inspired by and named after `require` in Node. It works very similarly as well, so not too much needs to be explained about it.
 *
 *   Except Mythix UI standard component file structure maybe... Yeah, maybe we should discuss that.
 *
 *   The `<mythix-require src="./components/widget.html">` tag allows you to load other resources simply by specifying a path. This path can be relative, or absolute. The path can contain query parameters.
 *
 *   You may have noticed that the tag name doesn't quite match the class name, `MythixUIRequire`, vs `<mythix-require>`. This deviation was chosen by the Mythix development team because Mythix is an entire ecosystem, not just a UI framework. For this reason, and in part to avoid future naming collisions, we have decided that in code, the class name should contain the `UI` part to delimit it from other Mythix technologies. Next, we felt constantly typing `<mythix-ui-require>` in HTML, vs the nicer `<mythix-require>` was kinda silly. Besides, in HTML, you ARE in the UI context, so why repeat ourselves? Anyhow, this is just a little note to keep in mind. The Element class names do not match the Element `tagName` for Mythix UI standard components.
 *
 *   If `<mythix-require>` is used to fetch a JavaScript resource, then it behaves almost identically to a `<script>` tag. If however it is being used to fetch another type of known resource, such as text/html, then it will behave differently.
 *
 *   When an HTML file is fetched by a `<mythix-require>` element, then any internal `<script>`, `<style>`, or other tag that belongs in the `<head>` tag will be placed in the `<head>` tag of the document. Duplicate inserts are prevented by use of tag ids. If a tag in the `<head>` of the document already has the same id as one MythixUIRequire is trying to insert, then MythixUIRequire will abort, and it won't duplicate inserting said element.
 *
 *   Other elements are treated specially as well when encountered in the loaded HTML file. Below is a table of special cases:
 *
 *   | Elements | Notes |
 *   |------|-------|
 *   | `<link>`, `<style>`, `<meta>` | Are appended to the `<head>` of the document. |
 *   | `<script>` | Is appended to the `<head>` of the document after the `src` attribute is fully resolved. |
 *   | `<template>` | Is appended to the bottom of the `<body>` of the document. |
 *   | `<base>`, `<noscript>`, `<title>` | Are deliberately discarded. |
 *   | All others | Are appended to the `<body>` of the document. |
 *
 * notes:
 *   - |
 *     :info: `globalThis.mythixUI.urlResolver: (context: { src: string | URL, url: URL, path: string, fileName: string }) => string | URL` is a method that can be defined by the user. When defined, it will be called every time @see ComponentUtils.resolveURL; is called. `MythixUIRequire` calls @see ComponentUtils.resolveURL; to resolve URLs, including in sub `<script>` tag `src` attributes loaded from resources. It is the intent of this method that it will globally resolve all URLs internal to the Mythix UI framework. Obviously it won't resolve URLs directly from static `import` or dynamic `import()` statements in JavaScript. Those are handled by the [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) you setup, remember?.
 * examples:
 *   - |
 *     Another component can be loaded dynamically--usually by loading its corresponding HTML file (which will generally then load the `<script>` require by the component). In the example below we are loading the standard modal component provided by Mythix UI:
 *     ```html
 *     <mythix-require src="@cdn/mythix-ui-modal@${{majorVersion}}/dist/mythix-ui-modal.html"></mythix-require>
 *     ```
 */

let REQUIRE_HANDLERS = [];

function registerRequireHandler(pattern, callback) {
  REQUIRE_HANDLERS.unshift({
    pattern,
    callback,
  });
}

registerRequireHandler(/\.html$/i, async function({ url, ownerDocument }) {
  let {
    response,
    cached,
  } = await ComponentUtils.require.call(
    this,
    url,
    {
      magic:          false,
      ownerDocument:  ownerDocument || document,
    },
  );

  if (cached)
    return true;

  let body = await response.text();
  ComponentUtils.importIntoDocumentFromSource.call(
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

  return true;
});

registerRequireHandler(/\.js$/i, async function({ url, ownerDocument }) {
  let result = ComponentUtils.insertScriptIntoHead(url, { ownerDocument });
  console.log({ scriptElement: result });
  return true;
});

export class MythixUIRequire extends MythixUIComponent {
  static registerHandler = registerRequireHandler;

  async mounted() {
    super.mounted();

    let src = this.getAttribute('src');

    try {
      let ownerDocument = this.ownerDocument || document;
      let url           = ComponentUtils.resolveURL.call(this, ownerDocument.location, src, { magic: true });

      for (let [ index, handler ] of REQUIRE_HANDLERS.entries()) {
        let {
          pattern,
          callback,
        } = handler;

        if (pattern.test(url)) {
          let result = await callback.call(this, { src, url, index, ownerDocument });
          if (result === true)
            break;
        }
      }
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
