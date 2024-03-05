/* eslint-disable no-magic-numbers */

import * as BaseUtils from './base-utils.js';
import * as ComponentUtils from './component-utils.js';

import {
  MythixUIComponent,
} from './mythix-ui-component.js';

export class MythixUIDynamicStyle extends MythixUIComponent {
  static tagName = 'mythix-dynamic-style';

  set attr$dataEnabled([ newValue ]) {
    this.handleDataEnabledAttributeChange(newValue);
  }

  createStyleNode() {
    let ownerDocument   = this.ownerDocument || document;
    let initialContent  = this.textContent.trim();
    let href            = this.attr('href');
    let styleNode       = ownerDocument.createElement('style');

    if (BaseUtils.isNotNOE(href)) {
      ComponentUtils.require(href, { ownerDocument }).then(
        async ({ response }) => {
          let content = await response.text();
          styleNode.innerHTML = content;

          this.handleDataEnabledAttributeChange(this.attr('data-enabled'));
        },
        (error) => {
          console.error(`mythix-dynamic-style: Error while attempting to load style "${href}": `, this, error);
        },
      );
    } else if (BaseUtils.isNotNOE(initialContent)) {
      if ((/<style[^>]*>/i).test(initialContent)) {
        let tempDiv = ownerDocument.createElement('div');
        tempDiv.innerHTML = initialContent;

        let tempNode = tempDiv.querySelector('style');
        if (tempNode)
          styleNode = tempNode;
        else
          styleNode.innerHTML = initialContent;
      } else {
        styleNode.innerHTML = initialContent;
      }
    }

    return styleNode;
  }

  mounted() {
    super.mounted();

    this.styleNode = this.createStyleNode();

    this.handleDataEnabledAttributeChange(this.attr('data-enabled'));
  }

  handleDataEnabledAttributeChange(enabled) {
    if (!this.styleNode)
      return;

    if (BaseUtils.isNOE(this.styleNode.textContent))
      return;

    let isEnabled = (/^(true)$/i).test(enabled);
    if (isEnabled)
      this.appendChild(this.styleNode);
    else if (this.contains(this.styleNode))
      this.removeChild(this.styleNode);
  }
}

MythixUIDynamicStyle.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUIDynamicStyle = MythixUIDynamicStyle;
