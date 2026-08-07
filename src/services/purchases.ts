import { Capacitor } from '@capacitor/core';
import { SubscriptionTier } from '../types';

// Product IDs — must match exactly what you set up in App Store Connect & Google Play Console
export const PRODUCT_IDS = {
  pro: 'buildscript_pro_monthly',
  premium: 'buildscript_premium_monthly',
};

// RevenueCat entitlement IDs — set these in your RevenueCat dashboard
export const ENTITLEMENT_IDS = {
  pro: 'pro',
  premium: 'premium',
};

let Purchases: any = null;

const loadPurchases = async () => {
  if (!Purchases) {
    const mod = await import('@revenuecat/purchases-capacitor');
    Purchases = mod.Purchases;
  }
  return Purchases;
};

export const initializePurchases = async (userId: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const apiKey = Capacitor.getPlatform() === 'ios'
      ? import.meta.env.VITE_REVENUECAT_APPLE_KEY
      : import.meta.env.VITE_REVENUECAT_GOOGLE_KEY;

    if (!apiKey) {
      console.warn('RevenueCat: API key not set. Purchases disabled.');
      return;
    }

    const RC = await loadPurchases();
    await RC.configure({ apiKey });
    await RC.logIn({ appUserID: userId });
  } catch (err) {
    console.warn('RevenueCat init failed:', err);
  }
};

export const getCurrentSubscriptionTier = async (): Promise<SubscriptionTier> => {
  if (!Capacitor.isNativePlatform()) return 'free';
  try {
    const RC = await loadPurchases();
    const { customerInfo } = await RC.getCustomerInfo();
    if (customerInfo.entitlements.active[ENTITLEMENT_IDS.premium]) return 'premium';
    if (customerInfo.entitlements.active[ENTITLEMENT_IDS.pro]) return 'pro';
    return 'free';
  } catch {
    return 'free';
  }
};

export const purchaseSubscription = async (tier: 'pro' | 'premium'): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('In-app purchases only work on native platforms (iOS/Android).');
    return false;
  }

  const apiKey = Capacitor.getPlatform() === 'ios'
    ? import.meta.env.VITE_REVENUECAT_APPLE_KEY
    : import.meta.env.VITE_REVENUECAT_GOOGLE_KEY;

  if (!apiKey) {
    throw new Error('PAYMENTS_NOT_CONFIGURED');
  }

  try {
    const RC = await loadPurchases();
    const offerings = await RC.getOfferings();
    const pkg = offerings.current?.availablePackages?.find(
      (p: any) => p.product.identifier === PRODUCT_IDS[tier]
    );
    if (!pkg) throw new Error('Package not found');
    const { customerInfo } = await RC.purchasePackage({ aPackage: pkg });
    return !!customerInfo.entitlements.active[ENTITLEMENT_IDS[tier]];
  } catch (err: any) {
    // user cancelled — code can be numeric 1 or string '1' depending on platform/plugin version
    if (err?.code === 1 || err?.code === '1' || err?.userCancelled === true || err?.message?.toLowerCase?.().includes('cancel')) return false;
    throw err;
  }
};

export const restorePurchases = async (): Promise<SubscriptionTier> => {
  if (!Capacitor.isNativePlatform()) return 'free';
  try {
    const RC = await loadPurchases();
    const { customerInfo } = await RC.restorePurchases();
    if (customerInfo.entitlements.active[ENTITLEMENT_IDS.premium]) return 'premium';
    if (customerInfo.entitlements.active[ENTITLEMENT_IDS.pro]) return 'pro';
    return 'free';
  } catch {
    return 'free';
  }
};

