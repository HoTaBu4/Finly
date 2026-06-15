import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Constants from 'expo-constants';

export function initRevenueCat() {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  const apiKey = Constants.expoConfig?.extra?.revenueCatApiKey;

  if (apiKey) {
    Purchases.configure({ apiKey });
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}

export async function presentPaywall(): Promise<boolean> {
  try {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
}
