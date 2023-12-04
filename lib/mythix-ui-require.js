import * as Utils from './utils.js';
import { MythixUIComponent as _MythixUIComponent } from './component.js';

const IS_TEMPLATE = /^(template)$/i;
const IS_SCRIPT   = /^(script)$/i;

export function importIntoDocumentFromSource(ownerDocument, location, _url, sourceString, _options) {
  let options   = _options || {};
  let url       = Utils.resolveURL(location, _url, options.magic);
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
        src = Utils.resolveURL(baseURL, src, false);
        childClone.setAttribute('src', src.toString());
      } else {
        childClone.setAttribute('type', 'module');
        childClone.innerHTML = child.textContent;
      }

      if (typeof nodeHandler === 'function' && nodeHandler.call(this, child, { ...context, isScript: true, isHandled: true }) === false)
        continue;

      let styleID = Utils.SHA256(`IDSTYLE${guessedElementName}:${childClone.innerHTML}`);
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

class Require extends _MythixUIComponent {
  static CACHE = new Map();

  static async require(ownerDocument, urlOrName, _options) {
    let options   = _options || {};
    let url       = Utils.resolveURL(ownerDocument.location, urlOrName, options.magic);
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
