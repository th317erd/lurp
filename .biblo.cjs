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

function convert(content) {
  if (!content)
    return;

  let result = converter.makeHtml(content);
  if (result.startsWith('<p>'))
    result = result.substring(3, result.length - 4);

  return result;
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
    if (scope.desc)
      scope.desc = convert(scope.desc);

    if (scope.examples)
      scope.examples = scope.examples.map(convert);

    if (scope.arguments) {
      scope.arguments = scope.arguments.map((item) => {
        let argument = {
          ...item,
          caption:    convert(item.caption),
          desc:       convert(item.desc),
          type:       'Argument',
          parent:     `id:${scope.id}`,
          searchable: false,
        };

        if (item.name && !Object.prototype.hasOwnProperty.call(argument, 'lineNumber'))
          item.lineNumber = scope.lineNumber;

        return argument;
      });
    }

    if (scope.instanceProperties) {
      scope.instanceProperties = scope.instanceProperties.map((item) => {
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

        return property;
      });
    }

    return scope;
  },
  postProcess: ({ scopes, Parser, Utils }) => {
    return scopes.concat(...scopes.map((scope) => {
      if (Utils.isType(scope.parent, 'String') && scope.parent) {
        let [ key, value ] = getKeyValue(scope.parent);
        let parent = scopes.find((scope) => (scope[key] === value));

        if (parent)
          scope.parent = `id:${parent.id}`;
      }

      return scope;
    }).map((block) => {
      let result = block.instanceProperties || [];
      block.instanceProperties = undefined;
      return result.map((ip) => {
        let block = {
          ...ip,
        };

        block.id = Parser.calculateBlockID(block);

        return block;
      });
    }));
  },
};
