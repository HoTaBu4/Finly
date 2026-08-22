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
