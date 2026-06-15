import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { presentPaywall } from '../services/revenueCat';
import { usePremium } from '../state/usePremium';

export function usePaywall() {
  const [isOfflinePaywallVisible, setOfflinePaywallVisible] = useState(false);
  const { syncPremiumStatus } = usePremium();

  const showPaywall = useCallback(async () => {
    const networkState = await NetInfo.fetch();

    if (networkState.isConnected) {
      const purchased = await presentPaywall();
      if (purchased) {
        await syncPremiumStatus();
      }
    } else {
      setOfflinePaywallVisible(true);
    }
  }, [syncPremiumStatus]);

  const handleOfflinePurchaseAttempt = useCallback(async (_plan?: string) => {
    const networkState = await NetInfo.fetch();

    if (networkState.isConnected) {
      setOfflinePaywallVisible(false);
      const purchased = await presentPaywall();
      if (purchased) {
        await syncPremiumStatus();
      }
    } else {
      Alert.alert('No internet', 'Connect to the internet to purchase.');
    }
  }, [syncPremiumStatus]);

  const closeOfflinePaywall = useCallback(() => {
    setOfflinePaywallVisible(false);
  }, []);

  return {
    isOfflinePaywallVisible,
    showPaywall,
    handleOfflinePurchaseAttempt,
    closeOfflinePaywall,
  };
}
