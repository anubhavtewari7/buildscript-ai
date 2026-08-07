import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Zap, Crown, Infinity, AlertCircle
} from 'lucide-react';
import { updateSubscriptionTier } from '../services/db';
import { purchaseSubscription, getCurrentSubscriptionTier } from '../services/purchases';
import { SubscriptionTier } from '../types';
import { Capacitor } from '@capacitor/core';

interface CheckoutProps {
  uid: string;
  onProfileUpdate: (updated: { subscriptionTier: SubscriptionTier }) => void;
}

const PLANS = [
  {
    key: 'pro' as const,
    name: 'BuildScript Pro',
    price: '$3.99',
    period: '/month',
    icon: Zap,
    color: 'blue',
    description: 'For the serious enthusiast',
    features: [
      'Modifications & Stage Build Plans',
      'Virtual Garage',
      'Maintenance Tracker',
      'OBD Diagnostics (free)',
      'OBD Port Locator (free)',
      'Tow Services (free)',
      'Find Shops Near Me (free)',
    ],
  },
  {
    key: 'premium' as const,
    name: 'BuildScript Premium',
    price: '$9.99',
    period: '/month',
    icon: Crown,
    color: 'violet',
    description: 'Everything, unlocked',
    badge: 'Most Popular',
    features: [
      'Everything in Pro',
      'AI Chat (coming soon)',
      'Priority support',
    ],
  },
  {
    key: 'lifetime' as const,
    name: 'BuildScript Lifetime',
    price: '$149.99',
    period: ' one-time',
    icon: Infinity,
    color: 'amber',
    description: 'Pay once, own it forever',
    features: [
      'Everything in Premium',
      'All future features included',
      'Never pay again',
    ],
  },
];

const colorMap = {
  blue:   { ring: 'ring-blue-500',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40',   badge: 'bg-blue-500/20 text-blue-300' },
  violet: { ring: 'ring-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/40', badge: 'bg-violet-500/20 text-violet-300' },
  amber:  { ring: 'ring-amber-500',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40',  badge: 'bg-amber-500/20 text-amber-300' },
};

const Checkout: React.FC<CheckoutProps> = ({ uid, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    getCurrentSubscriptionTier().then(setCurrentTier);
  }, []);

  const handlePurchase = async (planKey: 'pro' | 'premium' | 'lifetime') => {
    setError('');
    setLoadingPlan(planKey);
    try {
      if (!isNative) {
        setError('In-app purchases are only available on the installed Android/iOS app.');
        setLoadingPlan(null);
        return;
      }
      const tier = planKey === 'lifetime' ? 'premium' : planKey;
      const rcKey = planKey === 'lifetime' ? 'premium' : planKey;
      const success = await purchaseSubscription(rcKey as 'pro' | 'premium');
      if (success) {
        await updateSubscriptionTier(uid, tier as SubscriptionTier);
        onProfileUpdate({ subscriptionTier: tier as SubscriptionTier });
        navigate(`/payment-success?plan=${planKey}&name=${encodeURIComponent(
          PLANS.find(p => p.key === planKey)!.name
        )}&price=${PLANS.find(p => p.key === planKey)!.price}`);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (!msg.toLowerCase().includes('cancel') && !err?.userCancelled) {
        setError('Purchase failed. Please try again or contact support.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28" style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-xl font-black text-white">Upgrade BuildScript</h1>
          <p className="text-xs text-slate-400 font-medium">Paid via Google Play · Cancel anytime</p>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold p-4 rounded-2xl">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {PLANS.map(plan => {
          const c = colorMap[plan.color as keyof typeof colorMap];
          const Icon = plan.icon;
          const isActive = currentTier === (plan.key === 'lifetime' ? 'premium' : plan.key);
          const isLoading = loadingPlan === plan.key;

          return (
            <div key={plan.key} className={`rounded-2xl border p-5 transition-all ${
              plan.badge ? `${c.ring} ring-1 bg-slate-900 border-slate-700` : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <Icon size={20} className={c.text} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-sm">{plan.name}</h3>
                      {plan.badge && (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black ${c.text}`}>{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <CheckCircle2 size={12} className={c.text} />
                    {f}
                  </li>
                ))}
              </ul>

              {isActive ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} />
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(plan.key)}
                  disabled={!!loadingPlan}
                  className={`w-full ${c.btn} text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.97] shadow-xl`}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : `Get ${plan.name.split(' ').pop()}`}
                </button>
              )}
            </div>
          );
        })}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck size={16} className="text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-black text-white mb-0.5">Secure payments via Google Play</p>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Your payment is processed by Google Play Billing. BuildScript never sees your card details.
              Cancel or manage your subscription anytime in Google Play → Subscriptions.
            </p>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="text-[11px] text-slate-500 font-medium">
            30-day money-back guarantee · Cancel anytime · No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
