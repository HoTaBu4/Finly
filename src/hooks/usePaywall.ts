import { useCallback } from 'react';

// TODO: Restore real implementation when react-native-purchases is installed
// and App Store Connect products are configured.
// Real implementation uses:
//   import { checkIsConnected } from '../utils/checkIsConnected';
//   import { presentPaywall } from '../services/revenueCat';

export function usePaywall() {
  return {
    isOfflinePaywallVisible: false,
    showPaywall: useCallback(() => {}, []),
    handleOfflinePurchaseAttempt: useCallback((_plan?: string) => {}, []),
    closeOfflinePaywall: useCallback(() => {}, []),
  };
}


// import { useState, useCallback } from 'react';
// import { Alert } from 'react-native';
// import { usePremium } from '../state/usePremium';
// import { translations } from '../translations';
//
// async function checkIsConnected(): Promise<boolean> {
//   try {
//     const NetInfo = await import('@react-native-community/netinfo');
//     const networkState = await NetInfo.default.fetch();
//     return networkState.isConnected ?? true;
//   } catch {
//     // NetInfo unavailable — assume connected
//     return true;
//   }
// }
//
// export function usePaywall() {
//   const [isOfflinePaywallVisible, setOfflinePaywallVisible] = useState(false);
//   const { syncPremiumStatus } = usePremium();
//
//   const showPaywall = useCallback(async () => {
//     const isConnected = await checkIsConnected();
//
//     if (isConnected) {
//       try {
//         const { presentPaywall } = await import('../services/revenueCat');
//         const purchased = await presentPaywall();
//         if (purchased) {
//           await syncPremiumStatus();
//         }
//       } catch {
//         setOfflinePaywallVisible(true);
//       }
//     } else {
//       setOfflinePaywallVisible(true);
//     }
//   }, [syncPremiumStatus]);
//
//   const handleOfflinePurchaseAttempt = useCallback(async (_plan?: string) => {
//     const isConnected = await checkIsConnected();
//
//     if (isConnected) {
//       setOfflinePaywallVisible(false);
//       try {
//         const { presentPaywall } = await import('../services/revenueCat');
//         const purchased = await presentPaywall();
//         if (purchased) {
//           await syncPremiumStatus();
//         }
//       } catch {
//         Alert.alert(translations.alerts.noInternet.title, translations.alerts.noInternet.message);
//       }
//     } else {
//       Alert.alert(translations.alerts.noInternet.title, translations.alerts.noInternet.message);
//     }
//   }, [syncPremiumStatus]);
//
//   const closeOfflinePaywall = useCallback(() => {
//     setOfflinePaywallVisible(false);
//   }, []);
//
//   return {
//     isOfflinePaywallVisible,
//     showPaywall,
//     handleOfflinePurchaseAttempt,
//     closeOfflinePaywall,
//   };
// }

// Mock for review build