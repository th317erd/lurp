import * as Utils from './utils.js';
import {
  MythixUIComponent,
  require,
} from './component.js';

export class MythixUILanguageProvider extends MythixUIComponent {
  static tagName = 'mythix-language-provider';

  set attr$lang([ oldValue, newValue ]) {
    this.handleLangAttributeChange(newValue, oldValue);
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

  publishContext() {
    return {
      i18n: (_path, defaultValue) => {
        let path    = `global.i18n.${_path}`;
        let result  = Utils.fetchPath(this.terms, path);

        if (result == null)
          return Utils.getDynamicPropertyForPath.call(this, path, (defaultValue == null) ? '' : defaultValue);

        return result;
      },
    };
  }

  getSourceForLang(lang) {
    return this.$(`source[type^="lang/" i][lang^="${lang.replace(/"/g, '\\"')}"]`)[0];
  }

  handleLangAttributeChange(_lang) {
    let lang          = _lang || 'en';
    let sourceElement = this.getSourceForLang(lang);
    if (!sourceElement || !sourceElement.getAttribute('src')) {
      console.warn(`"mythix-language-provider": No "source" tag found for specified language "${lang}"`);
      return;
    }

    this.loadLanguageTerms(lang, sourceElement);
  }

  async loadLanguageTerms(lang, sourceElement, _options) {
    let src = sourceElement.getAttribute('src');
    if (!src)
      return;

    try {
      let { response }  = await require.call(this, this.ownerDocument || document, src);
      let compiledTerms = this.compileLanguageTerms(lang, await response.json());

      console.log('Compiled terms: ', compiledTerms);

      this.terms = compiledTerms;
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

        if (Utils.isPlainObject(value) || Array.isArray(value)) {
          termsCopy[key] = walkTerms(value, newKeyPath);
        } else {
          let property = Utils.getDynamicPropertyForPath.call(this, newKeyPath.join('.'), value);
          termsCopy[key] = property;
          property.set(value);
        }
      }

      return termsCopy;
    };

    return walkTerms(terms, [ 'global', 'i18n' ]);
  }
}

MythixUILanguageProvider.register();

(globalThis.mythixUI = (globalThis.mythixUI || {})).MythixUILanguageProvider = MythixUILanguageProvider;
