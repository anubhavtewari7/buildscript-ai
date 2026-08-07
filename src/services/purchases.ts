import { SubscriptionTier } from '../types';

// RevenueCat billing is disabled in this build (API key not yet configured).
// Replace this stub with the full RevenueCat integration before public launch.

export const PRODUCT_IDS = {
  pro: 'buildscript_pro_monthly',
  premium: 'buildscript_premium_monthly',
};

export const ENTITLEMENT_IDS = {
  pro: 'pro',
  premium: 'premium',
};

export const initializePurchases = async (_userId: string): Promise<void> => {
  // No-op until RevenueCat is configured
};

export const getCurrentSubscriptionTier = async (): Promise<SubscriptionTier> => {
  return 'free';
};

export const purchaseSubscription = async (_tier: 'pro' | 'premium'): Promise<boolean> => {
  throw new Error('PAYMENTS_NOT_CONFIGURED');
};

export const restorePurchases = async (): Promise<SubscriptionTier> => {
  return 'free';
};

