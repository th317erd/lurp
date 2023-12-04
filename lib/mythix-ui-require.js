import * as Utils from './utils.js';
import { MythixUIComponent as _MythixUIComponent } from './component.js';

export class MythixUIRequire extends _MythixUIComponent {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await Utils.require.call(
        this,
        this.ownerDocument || document,
        src,
        {
          magic: true,
        },
      );

      if (cached)
        return;

      let body = await response.text();
      Utils.importIntoDocumentFromSource.call(
        this,
        ownerDocument,
        ownerDocument.location,
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

  async fetchSrc() {
    // NOOP
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('mythix-require'))
  customElements.define('mythix-require', MythixUIRequire);

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', (event) => {
    Array.from(document.querySelectorAll('[data-mythix-src]')).forEach(async (element) => {
      let src = element.getAttribute('data-mythix-src');

      try {
        Utils.loadPartialIntoElement.call(element, src);
      } catch (error) {
        console.error(`"DOMContentLoaded": Failed to load specified resource: ${src} (resolved to: ${error.url})`, error);
      }
    });
  });
}
