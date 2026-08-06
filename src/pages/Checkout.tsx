import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, CreditCard, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { updateSubscriptionTier } from '../services/db';
import { SubscriptionTier } from '../types';

interface SavedCard {
  id: string;
  last4: string;
  expiry: string;
  name: string;
  network: 'VISA' | 'MC' | 'AMEX';
  cardColor: string;
}

interface CheckoutProps {
  uid: string;
  onProfileUpdate: (updated: { subscriptionTier: SubscriptionTier }) => void;
}

const PLAN_INFO: Record<string, { name: string; price: string; amount: number; tier: SubscriptionTier; billing: string }> = {
  pro:      { name: 'BuildScript Pro',     price: '$3.99',   amount: 3.99,   tier: 'pro',     billing: 'Billed monthly. Cancel anytime.' },
  premium:  { name: 'BuildScript Premium', price: '$9.99',   amount: 9.99,   tier: 'premium', billing: 'Billed monthly. Cancel anytime.' },
  lifetime: { name: 'BuildScript Lifetime', price: '$149.99', amount: 149.99, tier: 'premium', billing: 'One-time payment. No subscription.' },
};

const Checkout: React.FC<CheckoutProps> = ({ uid, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planKey = params.get('plan') || 'pro';
  const plan = PLAN_INFO[planKey] || PLAN_INFO.pro;

  // Load saved cards from Profile's localStorage store
  const savedCards: SavedCard[] = (() => {
    try { return JSON.parse(localStorage.getItem('bs_cards') || '[]'); } catch { return []; }
  })();
  const [selectedSavedCard, setSelectedSavedCard] = useState<SavedCard | null>(savedCards[0] ?? null);

  const [name, setName] = useState(savedCards[0]?.name ?? '');
  const [cardNumber, setCardNumber] = useState(savedCards[0] ? `•••• •••• •••• ${savedCards[0].last4}` : '');
  const [expiry, setExpiry] = useState(savedCards[0]?.expiry ?? '');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const applySavedCard = (card: SavedCard | null) => {
    setSelectedSavedCard(card);
    if (card) {
      setName(card.name);
      setCardNumber(`•••• •••• •••• ${card.last4}`);
      setExpiry(card.expiry);
      setCvc('');
    } else {
      setName(''); setCardNumber(''); setExpiry(''); setCvc('');
    }
  };

  const formatCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g,'').slice(0,4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { setError('Please enter the name on your card.'); return; }
    const rawCard = cardNumber.replace(/[\s•]/g,'');
    if (rawCard.length < 4) { setError('Please enter a valid card number.'); return; }
    if (expiry.length < 5) { setError('Please enter a valid expiry date.'); return; }
    if (cvc.length < 3) { setError('Please enter a valid CVC.'); return; }

    setLoading(true); setError('');
    try {
      await updateSubscriptionTier(uid, plan.tier);
      onProfileUpdate({ subscriptionTier: plan.tier });
      navigate(`/payment-success?plan=${planKey}&name=${encodeURIComponent(plan.name)}&price=${plan.price}`);
    } catch (err: any) {
      setError(err?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all';

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24" style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white active:scale-90 transition-all">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-blue-400">Secure Checkout</h1>
      </div>

      <div className="px-5 space-y-5">
        {/* Order Summary */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <h3 className="font-black text-white text-sm mb-4">Order Summary</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-white">{plan.name}</span>
            <span className="font-black text-white">{plan.price}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={14} />
            <span className="text-xs font-semibold">30-Day Money Back Guarantee applied</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-2">{plan.billing}</p>
        </div>

        {/* Saved Cards Quick-Select */}
        {savedCards.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Saved Cards</p>
            <div className="space-y-2">
              {savedCards.map(card => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => applySavedCard(selectedSavedCard?.id === card.id ? null : card)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedSavedCard?.id === card.id
                      ? 'bg-blue-500/10 border-blue-500/50 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <CreditCard size={16} className={selectedSavedCard?.id === card.id ? 'text-blue-400' : 'text-slate-500'} />
                  <span className="font-bold text-sm flex-1">{card.network} •••• {card.last4}</span>
                  <span className="text-xs text-slate-500">{card.expiry}</span>
                  {selectedSavedCard?.id === card.id && <CheckCircle2 size={14} className="text-blue-400 shrink-0" />}
                </button>
              ))}
              {selectedSavedCard && (
                <button type="button" onClick={() => applySavedCard(null)} className="text-xs text-slate-500 hover:text-slate-300 underline mt-1">
                  Use a different card
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handlePay} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className="text-slate-400" />
            <p className="text-xs text-slate-400 font-semibold">Payments are secure and encrypted</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-3 rounded-xl">{error}</div>
          )}

          {!selectedSavedCard && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Name on Card</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputCls} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Card Number</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" className={`${inputCls} pl-11`} inputMode="numeric" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Expiry Date</label>
                  <input type="text" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className={inputCls} inputMode="numeric" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">CVC</label>
                  <input type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" className={inputCls} inputMode="numeric" />
                </div>
              </div>
            </>
          )}

          {selectedSavedCard && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
                <CreditCard size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-white flex-1">{selectedSavedCard.network} •••• {selectedSavedCard.last4}</span>
                <span className="text-xs text-slate-400">{selectedSavedCard.expiry}</span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">CVC</label>
                <input type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" className={inputCls} inputMode="numeric" autoFocus />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-[0.97] shadow-xl shadow-blue-900/40 mt-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : `Pay ${plan.price}`}
          </button>
        </form>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 pb-4">
          {['256-bit SSL','PCI Compliant','Encrypted'].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck size={12} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
