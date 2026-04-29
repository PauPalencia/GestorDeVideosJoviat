const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const reactCompilerRuntime = path.resolve(__dirname, 'node_modules/react-compiler-runtime/dist/index.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react/compiler-runtime') {
    return { type: 'sourceFile', filePath: reactCompilerRuntime };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
