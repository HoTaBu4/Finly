import { ExpoConfig, ConfigContext } from 'expo/config';

function normalizeSupabaseUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  return new URL(url).origin;
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Trackfin',
  slug: 'trackfin',
  scheme: 'trackfin',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.trackfin.app',
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
    revenueCatApiKey: process.env.REVENUECAT_API_KEY,
    supabaseUrl: normalizeSupabaseUrl(
      process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    ),
    supabaseAnonKey:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY,
  },
});
