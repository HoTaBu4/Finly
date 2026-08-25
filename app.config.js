function normalizeSupabaseUrl(url) {
  if (!url) {
    return undefined;
  }

  return new URL(url).origin;
}

module.exports = ({ config }) => ({
  ...config,
  name: 'Finzelo',
  slug: 'trackfin',
  scheme: 'finzelo',
  version: '1.2.7',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.trackfin.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.trackfin.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router'],
  extra: {
    eas: {
      projectId: '97f4871a-03e3-4ffa-a9ee-b4d1f0ea9f16',
    },
    revenueCatApiKey: process.env.REVENUECAT_API_KEY,
    supabaseUrl: normalizeSupabaseUrl(
      process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    ),
    supabaseAnonKey:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  },
});
