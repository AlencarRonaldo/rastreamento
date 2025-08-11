const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add more file extensions to be served by the bundler
config.resolver.assetExts.push('bin', 'txt', 'jpg', 'png', 'json', 'woff', 'woff2');

// Add support for TypeScript
config.resolver.sourceExts.push('jsx', 'ts', 'tsx');

// Configure transformer for react-native-svg
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;