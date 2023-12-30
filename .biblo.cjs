const showdown  = require('showdown');
const converter = new showdown.Converter({
  ghCompatibleHeaderId:     true,
  parseImgDimensions:       true,
  strikethrough:            true,
  tables:                   true,
  tablesHeaderId:           true,
  tasklists:                true,
  openLinksInNewWindow:     true,
  backslashEscapesHTMLTags: true,
  emoji:                    true,
});

const htmlparser2 = require('htmlparser2');
const renderHTML = require('dom-serializer').default;

const entities = require('entities');

const RENDER_HTML_OPTIONS = {
  encodeEntities:   false,
  decodeEntities:   false,
  emptyAttrs:       false,
  selfClosingTags:  false,
  xmlMode:          false,
};

const HTML_PARSER_OPTIONS = {
  lowerCaseTags:  true,
  decodeEntities: false,
};

function cleanHTML(htmlStr) {
  const compileNode = (node) => {
    if (node.children) {
      node.children = node.children.map((child) => {
        return compileNode(child);
      }).flat(Infinity).filter(Boolean);
    }

    // if (node.type === 'text') {
    //   console.log('ENCODING: ', node.data);
    //   node.data = entities.encodeHTML(node.data);
    // }

    return node;
  };

  const dom = compileNode(htmlparser2.parseDocument(htmlStr, HTML_PARSER_OPTIONS));
  // console.log(dom.children[0].children[0]);
  if (dom.children && dom.children.length === 1 && dom.children[0].name === 'p')
    return renderHTML(dom.children[0].children, RENDER_HTML_OPTIONS);

  return renderHTML(dom, RENDER_HTML_OPTIONS);
}

const IS_HTML_SAFE_CHARACTER = /^[\sa-zA-Z0-9_-]$/;
function encodeValue(value) {
  return value.replace(/./g, (m) => {
    return (IS_HTML_SAFE_CHARACTER.test(m)) ? m : `&#${m.charCodeAt(0)};`;
  });
}

function _convert({ scope }, _content) {
  let content = _content;
  if (!content)
    return;

  let tags = [];

  const addTag = (original, props) => {
    let tag = `@@@@${tags.length}@@@@`;
    tags.push({ tag, original, ...(props || {}) });
    return tag;
  };

  const expand = (str) => {
    if (str.indexOf('@@@@') < 0)
      return str;

    return expand(str.replace(/@@@@(\d+)@@@@/g, (m, index) => {
      let tag = tags[+index];
      return tag.original;
    }));
  };

  const mdnReferences = (content) => {
    return content
      .replace(/\[(.+)\]\(([^)]+)\)/g, (m, caption, url) => addTag(m, { caption, url }))
      // .replace(/[^\sa-zA-Z0-9_-]/g, (m) => addTag(m))
      .replace(/\b(Promise|Map)\b/g, (m, p) => {
        return `[${p}](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${p})`;
      })
      .replace(/\bMutationRecord\b/g, '[MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord)')
      .replace(/\bElement\b/g, '[Element](https://developer.mozilla.org/en-US/docs/Web/API/element)');
  };

  const helpers = (content) => {
    return content.replace(/@see\s+([^;]+);/g, (m, p) => {
      let value = p.trim();
      return `[\`${value}\`](/?search=${encodeURIComponent(`name:${value}`)})`;
    });
  };

  content = mdnReferences(helpers(content));

  let result = converter.makeHtml(expand(content));
  return cleanHTML(result);
}

function getKeyValue(str) {
  let key   = 'name';
  let value = str;

  let index = str.indexOf(':');
  if (index >= 0) {
    key = str.substring(0, index);
    value = str.substring(index + 1);
  }

  return [ key, value ];
}

function findScope(scopes, query) {
  let [ key, value ] = getKeyValue(query);
  let names = value.split('.');

  return scopes.find((scope) => {
    if (names.length < 2) {
      return (scope[key] === names[0]);
    } else {
      let parent = findScope(scopes, `name:${names[0]}`);
      if (!parent || parent.name !== names[0])
        return;

      return (scope[key] === names[1]);
    }
  });
}

function findReferenceID(scopes, query) {
  let scope = findScope(scopes, query);
  if (scope)
    return `id:${scope.id}`;
}

module.exports = {
  root: "./",
  include: [
    "**/lib/**/*.js",
  ],
  exclude: [
    "**/node_modules/**",
    "**/spec/**",
    "**/dist/**",
  ],
  outputFormat: "json",
  output:       "./dist/docs/mythix-ui-core.json",
  props: {
    repo: "https://github.com/th317erd/mythix-ui-core",
  },
  blockProcessor: ({ scope, source, Parser }) => {
    const convert = (content) => {
      return _convert({ scope }, content);
    };

    const convertDesc = (desc) => {
      return convert(desc);
    };

    const convertExamples = (examples) => {
      return examples.map(convert);
    };

    const convertReturn = (retVal) => {
      return convert(retVal);
    };

    const convertNotes = (notes) => {
      return notes.map((note) => {
        return convert(note);
      });
    };

    const convertDataTypes = (_dataTypes) => {
      let dataTypes = _dataTypes;
      if (dataTypes && !Array.isArray(dataTypes))
        dataTypes = [ dataTypes ];

      return dataTypes.map((dataType) => {
        return convert(dataType);
      });
    };

    const convertArguments = (args) => {
      return args.map((arg) => {
        let argument = {
          ...arg,
          caption:    convert(arg.caption),
          desc:       convert(arg.desc),
          type:       'Argument',
          parent:     `id:${scope.id}`,
          searchable: false,
        };

        if (argument.name && !Object.prototype.hasOwnProperty.call(argument, 'lineNumber'))
          argument.lineNumber = scope.lineNumber;

        if (argument.dataType)
          argument.dataTypes = convertDataTypes(argument.dataType);
        else if (argument.dataTypes)
          argument.dataTypes = convertDataTypes(argument.dataTypes);

        if (argument.notes)
          argument.notes = convertNotes(argument.notes);

        return argument;
      });
    };

    const convertInstanceProperties = (instanceProperties) => {
      return instanceProperties.map((item) => {
        let property = {
          ...item,
          caption:  convert(item.caption),
          desc:     convert(item.desc),
          type:     'Property',
          parent:   `id:${scope.id}`,
        };

        if (item.name && !Object.prototype.hasOwnProperty.call(property, 'lineNumber')) {
          let index = source.indexOf(`// @ref:${item.name}`);
          if (index >= 0)
            property.lineNumber = Parser.getLineNumber(source, index);
        }

        if (!property.name)
          property.searchable = false;

        if (property.dataType)
          property.dataTypes = convertDataTypes(property.dataType);
        else if (property.dataTypes)
          property.dataTypes = convertDataTypes(property.dataTypes);

        if (property.notes)
          property.notes = convertNotes(property.notes);

        return property;
      });
    };

    if (scope.desc)
      scope.desc = convertDesc(scope.desc);

    if (scope.examples)
      scope.examples = convertExamples(scope.examples);

    if (scope.arguments)
      scope.arguments = convertArguments(scope.arguments);

    if (scope.notes)
      scope.notes = convertNotes(scope.notes);

    if (scope.instanceProperties)
      scope.instanceProperties = convertInstanceProperties(scope.instanceProperties);

    if (scope.return)
      scope.return = convertReturn(scope.return);

    return scope;
  },
  postProcess: ({ scopes, Parser, Utils }) => {
    return scopes.concat(...scopes.map((scope) => {
      // Non-property scopes
      if (Utils.isType(scope.parent, 'String') && scope.parent) {
        let referenceID = findReferenceID(scopes, scope.parent)
        if (referenceID)
          scope.parent = referenceID;
      }

      return scope;
    }).map((scope) => {
      // Property scopes
      let properties = scope.instanceProperties || [];
      scope.instanceProperties = undefined;

      return properties.map((ip) => {
        let block = {
          ...ip,
        };

        block.id = Parser.calculateBlockID(block);

        return block;
      });
    })).flat(Infinity).map((scope) => {
      // All scopes
      if (Utils.isNotNOE(scope.see)) {
        scope.see = ([].concat(scope.see).filter(Boolean).flat(Infinity).map((seeRef) => {
          return findReferenceID(scopes, seeRef);
        })).filter(Boolean);
      }

      return scope;
    }).filter(Boolean);
  },
};
