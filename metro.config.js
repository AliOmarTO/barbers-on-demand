const { getDefaultConfig } = require('@expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { withNativeWind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Required by some libraries that use `.cjs` (like `tailwindcss`)
config.resolver.sourceExts.push('cjs');

// Fix for expo + nativewind
config.resolver.unstable_enablePackageExports = false;

// Wrap with Reanimated first, then NativeWind
config = wrapWithReanimatedMetroConfig(config);
config = withNativeWind(config, { input: './global.css' });

module.exports = config;
