const { MythixUIComponent: _MythixUIComponent } = await import('./component.js');

const IS_TEMPLATE = /^(template)$/i;
const IS_SCRIPT   = /^(script)$/i;

export function loadComponentFromSource(ownerDocument, url, sourceString) {
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
    } else {
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
