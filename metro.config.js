const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Provide the stub that babel-plugin-syntax-hermes-parser requires
// when bundling for web in this environment.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '/tmp/projects/project1/stubs/hermes-parser-plugin.js': path.resolve(
    __dirname,
    'stubs/hermes-parser-plugin.js'
  ),
};

// Also alias by the bare path pattern the plugin looks for
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.endsWith('stubs/hermes-parser-plugin.js')) {
    return {
      filePath: path.resolve(__dirname, 'stubs/hermes-parser-plugin.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
