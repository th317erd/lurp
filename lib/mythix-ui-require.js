import * as Component from './component.js';

export class MythixUIRequire extends Component.MythixUIComponent {
  async mounted() {
    let src = this.getAttribute('src');

    try {
      let {
        ownerDocument,
        url,
        response,
        cached,
      } = await Component.require.call(
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
      Component.importIntoDocumentFromSource.call(
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

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIRequire = MythixUIRequire;

if (typeof customElements !== 'undefined' && !customElements.get('mythix-require'))
  customElements.define('mythix-require', MythixUIRequire);

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    let elements = Array.from(document.querySelectorAll('[data-mythix-src]'));
    Component.visibilityObserver(({ disconnect, element, wasVisible }) => {
      if (wasVisible)
        return;

      let src = element.getAttribute('data-mythix-src');
      if (!src)
        return;

      disconnect();

      console.log('Fetching Resource (for native element): ', src);
      Component.loadPartialIntoElement.call(element, src);
    }, { elements });
  });
}
