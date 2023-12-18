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

    if (scope.instanceProperties) {
      scope.instanceProperties = scope.instanceProperties.map((item) => {
        let ip = {
          ...item,
          caption:  convert(item.caption),
          desc:     convert(item.desc),
          type:     'Property',
          parent:   scope,
        };

        if (item.name && !Object.prototype.hasOwnProperty.call(ip, 'lineNumber')) {
          let index = source.indexOf(`// @ref:${item.name}`);
          if (index >= 0)
            ip.lineNumber = Parser.getLineNumber(source, index);
        }

        if (!ip.name)
          ip.searchable = false;

        return ip;
      });
    }

    return scope;
  },
  postProcess: ({ data, Parser }) => {
    return data.concat(...data.map((scope) => {
      let result = scope.instanceProperties || [];
      scope.instanceProperties = undefined;
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
