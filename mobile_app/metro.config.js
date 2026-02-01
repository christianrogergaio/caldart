const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Windows "node:sea" invalid path issue
// We redirect these Node.js built-ins to an empty module so Metro doesn't try to cache them with invalid filenames
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'node:sea': require.resolve('./empty-module.js'),
    'node:crypto': require.resolve('./empty-module.js'),
    'node:buffer': require.resolve('./empty-module.js'),
    'node:stream': require.resolve('./empty-module.js'),
};

module.exports = config;
