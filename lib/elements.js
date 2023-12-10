import * as Utils from './utils.js';

export const UNFINISHED_DEFINITION = Symbol.for('@mythix/mythix-ui/constants/unfinished');

const IS_PROP_NAME = /^prop\$/;

/*
*/
export class ElementDefinition {
  constructor(tagName, attributes, children) {
    Object.defineProperties(this, {
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

  toDOMAttributeName(attributeName) {
    return attributeName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  bindEventToElement(...args) {
    return Utils.bindEventToElement(...args);
  }

  build(document, context) {
    let attributes    = this.attributes;
    let namespaceURI  = attributes.namespaceURI;
    let options;
    let element;

    if (this.attributes.is)
      options = { is: this.attributes.is };

    if (this.tagName === '#text') {
      let textNode = document.createTextNode(attributes.value || '');
      textNode.nodeValue = Utils.formatTerm(textNode, context);
      return textNode;
    }

    if (namespaceURI)
      element = document.createElementNS(namespaceURI, this.tagName, options);
    else if (isSVGElement(this.tagName))
      element = document.createElementNS('http://www.w3.org/2000/svg', this.tagName, options);
    else
      element = document.createElement(this.tagName);

    const handleAttribute = (element, attributeName, _attributeValue) => {
      let attributeValue      = _attributeValue;
      let lowerAttributeName  = attributeName.toLowerCase();

      if (eventNames.indexOf(lowerAttributeName) >= 0) {
        this.bindEventToElement(element, lowerAttributeName.substring(2), attributeValue, context);
      } else {
        let modifiedAttributeName = this.toDOMAttributeName(attributeName);

        if (Utils.stringIsDynamicBindingTemplate(attributeValue)) {
          // Create attribute
          element.setAttribute(modifiedAttributeName, attributeValue);

          // Get attribute node just created
          let attributeNode = element.getAttributeNode(modifiedAttributeName);
          attributeValue = Utils.formatTerm(attributeNode, context);
        }

        element.setAttribute(modifiedAttributeName, attributeValue);
      }
    };

    // Dynamic bindings are not allowed for properties
    const handleProperty = (element, propertyName, propertyValue) => {
      let name = propertyName.replace(IS_PROP_NAME, '');
      element[name] = propertyValue;
    };

    let eventNames      = Utils.getAllEventNamesForElement(element);
    let attributeNames  = Object.keys(attributes);
    for (let i = 0, il = attributeNames.length; i < il; i++) {
      let attributeName       = attributeNames[i];
      let attributeValue      = attributes[attributeName];

      if (IS_PROP_NAME.test(attributeName))
        handleProperty(element, attributeName, attributeValue);
      else
        handleAttribute(element, attributeName, attributeValue);
    }

    let children = this.children;
    if (children.length > 0) {
      for (let i = 0, il = children.length; i < il; i++) {
        let child         = children[i];
        let childElement  = child.build(document, context);

        element.appendChild(childElement);
      }
    }

    return element;
  }
}

const IS_TARGET_PROP = /^prototype|constructor$/;

export function build(tagName, defaultAttributes, scope) {
  if (!tagName || !Utils.isType(tagName, 'String'))
    throw new Error('Can not create an ElementDefinition without a "tagName".');

  const finalizer = (..._children) => {
    let children = _children.map((value) => {
      if (value == null || Object.is(value, NaN))
        return null;

      if (typeof value === 'symbol')
        return null;

      if (value[UNFINISHED_DEFINITION])
        return value();

      if (value instanceof ElementDefinition)
        return value;

      if (!Utils.isType(value, 'String'))
        return null;

      return new ElementDefinition('#text', { value: ('' + value) });
    }).filter(Boolean);

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

export const Term = (value) => new ElementDefinition('#text', { value });

export const ELEMENT_NAMES = [];
const E = (tagName, defaultAttributes) => {
  ELEMENT_NAMES.push(tagName);
  return build(tagName, defaultAttributes);
};

export const A          = E('a');
export const ABBR       = E('abbr');
export const ADDRESS    = E('address');
export const AREA       = E('area');
export const ARTICLE    = E('article');
export const ASIDE      = E('aside');
export const AUDIO      = E('audio');
export const B          = E('b');
export const BASE       = E('base');
export const BDI        = E('bdi');
export const BDO        = E('bdo');
export const BLOCKQUOTE = E('blockquote');
export const BR         = E('br');
export const BUTTON     = E('button');
export const CANVAS     = E('canvas');
export const CAPTION    = E('caption');
export const CITE       = E('cite');
export const CODE       = E('code');
export const COL        = E('col');
export const COLGROUP   = E('colgroup');
export const DATA       = E('data');
export const DATALIST   = E('datalist');
export const DD         = E('dd');
export const DEL        = E('del');
export const DETAILS    = E('details');
export const DFN        = E('dfn');
export const DIALOG     = E('dialog');
export const DIV        = E('div');
export const DL         = E('dl');
export const DT         = E('dt');
export const EM         = E('em');
export const EMBED      = E('embed');
export const FIELDSET   = E('fieldset');
export const FIGCAPTION = E('figcaption');
export const FIGURE     = E('figure');
export const FOOTER     = E('footer');
export const FORM       = E('form');
export const H1         = E('h1');
export const H2         = E('h2');
export const H3         = E('h3');
export const H4         = E('h4');
export const H5         = E('h5');
export const H6         = E('h6');
export const HEADER     = E('header');
export const HGROUP     = E('hgroup');
export const HR         = E('hr');
export const I          = E('i');
export const IFRAME     = E('iframe');
export const IMG        = E('img');
export const INPUT      = E('input');
export const INS        = E('ins');
export const KBD        = E('kbd');
export const LABEL      = E('label');
export const LEGEND     = E('legend');
export const LI         = E('li');
export const LINK       = E('link');
export const MAIN       = E('main');
export const MAP        = E('map');
export const MARK       = E('mark');
export const MENU       = E('menu');
export const META       = E('meta');
export const METER      = E('meter');
export const NAV        = E('nav');
export const NOSCRIPT   = E('noscript');
export const OBJECT     = E('object');
export const OL         = E('ol');
export const OPTGROUP   = E('optgroup');
export const OPTION     = E('option');
export const OUTPUT     = E('output');
export const P          = E('p');
export const PICTURE    = E('picture');
export const PRE        = E('pre');
export const PROGRESS   = E('progress');
export const Q          = E('q');
export const RP         = E('rp');
export const RT         = E('rt');
export const RUBY       = E('ruby');
export const S          = E('s');
export const SAMP       = E('samp');
export const SCRIPT     = E('script');
export const SECTION    = E('section');
export const SELECT     = E('select');
export const SLOT       = E('slot');
export const SMALL      = E('small');
export const SOURCE     = E('source');
export const SPAN       = E('span');
export const STRONG     = E('strong');
export const STYLE      = E('style');
export const SUB        = E('sub');
export const SUMMARY    = E('summary');
export const SUP        = E('sup');
export const TABLE      = E('table');
export const TBODY      = E('tbody');
export const TD         = E('td');
export const TEMPLATE   = E('template');
export const TEXTAREA   = E('textarea');
export const TFOOT      = E('tfoot');
export const TH         = E('th');
export const THEAD      = E('thead');
export const TIME       = E('time');
export const TITLE      = E('title');
export const TR         = E('tr');
export const TRACK      = E('track');
export const U          = E('u');
export const UL         = E('ul');
export const VAR        = E('var');
export const VIDEO      = E('video');
export const WBR        = E('wbr');

export const SVG_ELEMENT_NAMES = [];

const SE = (tagName, defaultAttributes) => {
  SVG_ELEMENT_NAMES.push(tagName);
  return build(tagName, defaultAttributes);
};

// SVG element names
export const ALTGLYPH             = SE('altglyph');
export const ALTGLYPHDEF          = SE('altglyphdef');
export const ALTGLYPHITEM         = SE('altglyphitem');
export const ANIMATE              = SE('animate');
export const ANIMATECOLOR         = SE('animateColor');
export const ANIMATEMOTION        = SE('animateMotion');
export const ANIMATETRANSFORM     = SE('animateTransform');
export const ANIMATION            = SE('animation');
export const CIRCLE               = SE('circle');
export const CLIPPATH             = SE('clipPath');
export const COLORPROFILE         = SE('colorProfile');
export const CURSOR               = SE('cursor');
export const DEFS                 = SE('defs');
export const DESC                 = SE('desc');
export const DISCARD              = SE('discard');
export const ELLIPSE              = SE('ellipse');
export const FEBLEND              = SE('feblend');
export const FECOLORMATRIX        = SE('fecolormatrix');
export const FECOMPONENTTRANSFER  = SE('fecomponenttransfer');
export const FECOMPOSITE          = SE('fecomposite');
export const FECONVOLVEMATRIX     = SE('feconvolvematrix');
export const FEDIFFUSELIGHTING    = SE('fediffuselighting');
export const FEDISPLACEMENTMAP    = SE('fedisplacementmap');
export const FEDISTANTLIGHT       = SE('fedistantlight');
export const FEDROPSHADOW         = SE('fedropshadow');
export const FEFLOOD              = SE('feflood');
export const FEFUNCA              = SE('fefunca');
export const FEFUNCB              = SE('fefuncb');
export const FEFUNCG              = SE('fefuncg');
export const FEFUNCR              = SE('fefuncr');
export const FEGAUSSIANBLUR       = SE('fegaussianblur');
export const FEIMAGE              = SE('feimage');
export const FEMERGE              = SE('femerge');
export const FEMERGENODE          = SE('femergenode');
export const FEMORPHOLOGY         = SE('femorphology');
export const FEOFFSET             = SE('feoffset');
export const FEPOINTLIGHT         = SE('fepointlight');
export const FESPECULARLIGHTING   = SE('fespecularlighting');
export const FESPOTLIGHT          = SE('fespotlight');
export const FETILE               = SE('fetile');
export const FETURBULENCE         = SE('feturbulence');
export const FILTER               = SE('filter');
export const FONT                 = SE('font');
export const FONTFACE             = SE('fontFace');
export const FONTFACEFORMAT       = SE('fontFaceFormat');
export const FONTFACENAME         = SE('fontFaceName');
export const FONTFACESRC          = SE('fontFaceSrc');
export const FONTFACEURI          = SE('fontFaceUri');
export const FOREIGNOBJECT        = SE('foreignObject');
export const G                    = SE('g');
export const GLYPH                = SE('glyph');
export const GLYPHREF             = SE('glyphRef');
export const HANDLER              = SE('handler');
export const HKERN                = SE('hKern');
export const IMAGE                = SE('image');
export const LINE                 = SE('line');
export const LINEARGRADIENT       = SE('lineargradient');
export const LISTENER             = SE('listener');
export const MARKER               = SE('marker');
export const MASK                 = SE('mask');
export const METADATA             = SE('metadata');
export const MISSINGGLYPH         = SE('missingGlyph');
export const MPATH                = SE('mPath');
export const PATH                 = SE('path');
export const PATTERN              = SE('pattern');
export const POLYGON              = SE('polygon');
export const POLYLINE             = SE('polyline');
export const PREFETCH             = SE('prefetch');
export const RADIALGRADIENT       = SE('radialgradient');
export const RECT                 = SE('rect');
export const SET                  = SE('set');
export const SOLIDCOLOR           = SE('solidColor');
export const STOP                 = SE('stop');
export const SVG                  = SE('svg');
export const SWITCH               = SE('switch');
export const SYMBOL               = SE('symbol');
export const TBREAK               = SE('tbreak');
export const TEXT                 = SE('text');
export const TEXTPATH             = SE('textpath');
export const TREF                 = SE('tref');
export const TSPAN                = SE('tspan');
export const UNKNOWN              = SE('unknown');
export const USE                  = SE('use');
export const VIEW                 = SE('view');
export const VKERN                = SE('vKern');

const SVG_RE = new RegExp(`^(${SVG_ELEMENT_NAMES.join('|')})$`, 'i');

export function isSVGElement(tagName) {
  return SVG_RE.test(tagName);
}
