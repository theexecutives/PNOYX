const path = require('path');

module.exports = function (api) {
  api.cache(false);

  // Resolve the hermes-parser stub so babel-plugin-syntax-hermes-parser
  // can find it in both native and web bundling environments.
  process.env.BABEL_HERMES_PARSER_PLUGIN =
    path.resolve(__dirname, 'stubs/hermes-parser-plugin.js');

  return {
    presets: ['babel-preset-expo'],
  };
};
