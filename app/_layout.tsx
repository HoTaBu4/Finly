import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// TODO: Re-enable when App Store Connect products are configured
// import { useEffect } from 'react';
// import { initRevenueCat } from '../src/services/revenueCat';

export default function RootLayout() {
  // useEffect(() => {
  //   initRevenueCat();
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
