const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const runtimeStub = path.resolve(__dirname, 'react-compiler-runtime-stub.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react/compiler-runtime') {
    return { type: 'sourceFile', filePath: runtimeStub };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
