import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserProfile, SubscriptionTier } from '../types';
import { logoutUser } from '../services/auth';
import { updateSubscriptionTier, updateUserProfile } from '../services/db';
import {
  ChevronRight, ArrowLeft, User, Edit3, CreditCard, MessageCircle,
  FileText, RefreshCw, XCircle, LogOut, Loader2, Plus, X, Upload,
  Crown, Wallet, CheckCircle2, Zap, RefreshCcw, Trash2,
  Car, Shield, BookOpen, File,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileProps {
  profile: UserProfile;
  onProfileUpdate: (updated: Partial<UserProfile>) => void;
}

type ProfileView = 'settings' | 'account' | 'edit' | 'payments';

interface SavedCard {
  id: string;
  last4: string;
  expiry: string;
  name: string;
  network: 'VISA' | 'MC' | 'AMEX';
  cardColor: string;
}

type DocCategory = 'license' | 'insurance' | 'registration' | 'other';

interface SavedDoc {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
  category: DocCategory;
}

const DOC_TYPES: { category: DocCategory; label: string; sub: string; icon: React.ReactNode; gradient: string; accent: string }[] = [
  {
    category: 'license',
    label: "Driver's License",
    sub: 'State ID or mDL',
    icon: <User size={20} />,
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7, #075985)',
    accent: '#38bdf8',
  },
  {
    category: 'insurance',
    label: 'Insurance Card',
    sub: 'Auto insurance policy',
    icon: <Shield size={20} />,
    gradient: 'linear-gradient(135deg, #10b981, #059669, #065f46)',
    accent: '#34d399',
  },
  {
    category: 'registration',
    label: 'Vehicle Registration',
    sub: 'DMV registration',
    icon: <Car size={20} />,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706, #92400e)',
    accent: '#fbbf24',
  },
  {
    category: 'other',
    label: 'Other Document',
    sub: 'Warranty, receipt, etc.',
    icon: <File size={20} />,
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #4c1d95)',
    accent: '#a78bfa',
  },
];

// ─── Card Visual Component ────────────────────────────────────────────────────
const CreditCardVisual: React.FC<{ card: SavedCard; onRemove: () => void }> = ({ card, onRemove }) => (
  <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '1.586' }}>
    {/* Background */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d0221 0%, #1a0533 25%, #2d1060 55%, #1e0a4a 80%, #0a0a1a 100%)' }} />
    {/* Glowing orb */}
    <div className="absolute inset-0 flex items-center justify-end pr-8">
      <div className="w-32 h-32 rounded-full blur-2xl opacity-50" style={{ background: 'radial-gradient(circle, #a855f7, #ec4899, #f97316)' }} />
    </div>
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

    {/* Card content */}
    <div className="relative h-full flex flex-col justify-between p-5">
      <div className="flex justify-between items-start">
        <span className="font-black text-white text-xs tracking-[0.2em] uppercase opacity-90">BuildScript</span>
        <span className="font-black text-white/60 text-xs tracking-widest">{card.network}</span>
      </div>

      {/* Chip */}
      <div className="w-9 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
        <div className="grid grid-cols-2 gap-0.5 opacity-60">
          {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1.5 bg-amber-900 rounded-[1px]" />)}
        </div>
      </div>

      {/* Card number */}
      <p className="font-mono text-white tracking-[0.2em] text-sm">
        •••• &nbsp;•••• &nbsp;•••• &nbsp;{card.last4}
      </p>

      {/* Bottom row */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-white/40 text-[7px] uppercase tracking-widest mb-0.5">VALID THRU</p>
          <p className="text-white font-bold text-xs">{card.expiry}</p>
        </div>
        <div>
          <p className="text-white/40 text-[7px] uppercase tracking-widest mb-0.5">CARDHOLDER</p>
          <p className="text-white font-bold text-xs uppercase">{card.name}</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[7px] uppercase mb-0.5">DEBIT</p>
          <p className="font-black text-white italic text-base">{card.network}</p>
        </div>
      </div>
    </div>

    {/* Remove button */}
    <button onClick={onRemove} className="absolute top-3 right-3 bg-red-500/80 text-white p-1 rounded-full backdrop-blur-sm hover:bg-red-500 transition-colors">
      <X size={10} />
    </button>
  </div>
);

// ─── Document Card ─────────────────────────────────────────────────────────────
const DocCard: React.FC<{ doc: SavedDoc; onRemove: () => void; onView: () => void }> = ({ doc, onRemove, onView }) => {
  const cfg = DOC_TYPES.find(d => d.category === doc.category) || DOC_TYPES[3];
  const isImage = doc.mimeType?.includes('image');
  const isPdf = doc.mimeType?.includes('pdf') || doc.name?.toLowerCase().endsWith('.pdf');

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-lg">
      {/* Header band */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: cfg.gradient }}>
        <div className="flex items-center gap-2.5">
          <div className="text-white/90">{cfg.icon}</div>
          <div>
            <p className="text-white font-black text-xs uppercase tracking-widest">{cfg.label}</p>
            <p className="text-white/60 text-[9px] font-medium">{cfg.sub}</p>
          </div>
        </div>
        <button onClick={onRemove} className="bg-black/20 text-white/70 p-1 rounded-full hover:bg-black/40 transition-colors">
          <X size={12} />
        </button>
      </div>

      {/* Document preview — tappable to open viewer */}
      <button onClick={onView} className="w-full text-left active:opacity-80 transition-opacity">
        {isImage ? (
          <img src={doc.dataUrl} alt={doc.name} className="w-full h-32 object-cover" />
        ) : (
          <div className="h-24 flex flex-col items-center justify-center gap-2" style={{ background: '#0f172a' }}>
            <FileText size={26} style={{ color: cfg.accent }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.accent }}>
              {isPdf ? 'PDF Document' : 'Document'}
            </p>
            <p className="text-slate-600 text-[9px]">Tap to view</p>
          </div>
        )}
      </button>

      {/* Footer */}
      <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.accent }} />
        <p className="text-slate-300 text-[10px] font-bold truncate flex-1">{doc.name}</p>
      </div>
    </div>
  );
};

// ─── Document Viewer Modal ─────────────────────────────────────────────────────
const DocViewer: React.FC<{ doc: SavedDoc; onClose: () => void }> = ({ doc, onClose }) => {
  const cfg = DOC_TYPES.find(d => d.category === doc.category) || DOC_TYPES[3];
  const isImage = doc.mimeType?.includes('image');
  const isPdf = doc.mimeType?.includes('pdf') || doc.name?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ background: cfg.gradient }}>
        <div className="flex items-center gap-3">
          <div className="text-white">{cfg.icon}</div>
          <div>
            <p className="text-white font-black text-sm uppercase tracking-widest">{cfg.label}</p>
            <p className="text-white/60 text-[10px] font-medium truncate max-w-[220px]">{doc.name}</p>
          </div>
        </div>
        <button onClick={onClose} className="bg-black/30 text-white p-2 rounded-full active:scale-90 transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isImage ? (
          <img src={doc.dataUrl} alt={doc.name} className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl" />
        ) : isPdf ? (
          <iframe
            src={doc.dataUrl}
            title={doc.name}
            className="w-full rounded-xl border border-slate-700 bg-white"
            style={{ height: 'calc(100dvh - 140px)' }}
          />
        ) : (
          <div className="text-center">
            <FileText size={64} className="mx-auto mb-4" style={{ color: cfg.accent }} />
            <p className="text-white font-black text-lg mb-2">{doc.name}</p>
            <p className="text-slate-400 text-sm">Preview not available for this file type.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Plan Picker Sheet ─────────────────────────────────────────────────────────
const PLAN_TIERS = [
  { key: 'free',     name: 'Standard',  price: '$0',       sub: 'Free forever', badge: null,         features: ['Basic Diagnostics', '1 Vehicle Profile', 'OBD-II Lookup', 'AI Chat'] },
  { key: 'pro',      name: 'Builder',   price: '$3.99/mo', sub: 'Most popular',  badge: 'POPULAR',    features: ['Everything in Standard', '3 Vehicles', 'Virtual Garage', 'Mod Tutorials'] },
  { key: 'premium',  name: 'Pro',       price: '$9.99/mo', sub: 'Full access',   badge: null,         features: ['Everything in Builder', 'Unlimited Vehicles', 'Performance Sims', 'Priority Support'] },
  { key: 'lifetime', name: 'Lifetime',  price: '$149.99',  sub: 'One-time',      badge: 'BEST VALUE', features: ['Everything in Pro', 'All Future Features', 'No Monthly Fees', 'Lifetime Updates'] },
];

const PlanPickerSheet: React.FC<{ currentTier: SubscriptionTier; onSelect: (key: string) => void; onClose: () => void }> = ({ currentTier, onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-slate-900 w-full max-w-md rounded-t-3xl border-t border-slate-700 overflow-hidden" style={{ maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-slate-900 px-5 pt-5 pb-3 border-b border-slate-800 z-10">
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-black text-base">Choose Your Plan</p>
            <p className="text-slate-400 text-xs mt-0.5">Unlock the full potential of BuildScript.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 p-1 hover:text-white"><X size={20} /></button>
        </div>
      </div>
      <div className="p-4 space-y-3 pb-8">
        {PLAN_TIERS.map(tier => {
          const isActive = (tier.key === 'free' && currentTier === 'free') || (tier.key !== 'free' && tier.key !== 'lifetime' && currentTier === tier.key);
          const isFree = tier.key === 'free';
          return (
            <div key={tier.key} className={`relative rounded-2xl border-2 p-5 ${isActive ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 bg-slate-800/50'}`}>
              {tier.badge && (
                <span className={`absolute -top-2.5 right-4 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${tier.badge === 'POPULAR' ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white'}`}>
                  {tier.badge}
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-black text-base">{tier.name}</p>
                  <p className="text-slate-500 text-[10px] font-medium">{tier.sub}</p>
                </div>
                <p className="text-white font-black text-lg">{tier.price}</p>
              </div>
              <div className="space-y-1 mb-4">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                    <p className="text-slate-400 text-[10px] font-medium">{f}</p>
                  </div>
                ))}
              </div>
              {isActive ? (
                <div className="w-full text-center py-3 rounded-xl border border-blue-500/40 text-blue-400 text-xs font-black uppercase tracking-widest">Current Plan</div>
              ) : isFree ? (
                <button onClick={() => onSelect('free')} className="w-full py-3 rounded-xl border border-slate-600 text-slate-400 text-xs font-black uppercase tracking-widest active:scale-[0.97] transition-all">
                  Select Standard
                </button>
              ) : (
                <button onClick={() => onSelect(tier.key)} className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest active:scale-[0.97] transition-all">
                  Select {tier.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ─── Doc Picker Sheet ──────────────────────────────────────────────────────────
const DocPickerSheet: React.FC<{ onSelect: (cat: DocCategory) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-slate-900 w-full max-w-md rounded-t-3xl p-5 border-t border-slate-700" onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />
      <p className="text-white font-black text-sm uppercase tracking-widest mb-4 px-1">What type of document?</p>
      <div className="space-y-2 pb-4">
        {DOC_TYPES.map(dt => (
          <button key={dt.category} onClick={() => onSelect(dt.category)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-800/50 active:scale-[0.98] transition-all text-left hover:border-slate-600">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: dt.gradient }}>
              <span className="text-white">{dt.icon}</span>
            </div>
            <div>
              <p className="text-white font-black text-sm">{dt.label}</p>
              <p className="text-slate-500 text-[10px] font-medium">{dt.sub}</p>
            </div>
            <ChevronRight size={16} className="text-slate-600 ml-auto" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Profile: React.FC<ProfileProps> = ({ profile, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Navigation
  const [view, setView] = useState<ProfileView>('settings');

  // Edit profile
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Payment methods — persisted to localStorage
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    try { return JSON.parse(localStorage.getItem('bs_cards') || '[]'); } catch { return []; }
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardZip, setCardZip] = useState('');

  // Documents — persisted to localStorage
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>(() => {
    try { return JSON.parse(localStorage.getItem('bs_docs') || '[]'); } catch { return []; }
  });
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [pendingDocCategory, setPendingDocCategory] = useState<DocCategory>('other');
  const [viewingDoc, setViewingDoc] = useState<SavedDoc | null>(null);

  // Plan picker + subscription modal
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  // Persist cards + docs on change
  useEffect(() => { localStorage.setItem('bs_cards', JSON.stringify(savedCards)); }, [savedCards]);
  useEffect(() => { try { localStorage.setItem('bs_docs', JSON.stringify(savedDocs)); } catch {} }, [savedDocs]);

  // Auto-open plan picker if navigated with ?plans=1
  useEffect(() => {
    if (searchParams.get('plans') === '1') {
      setShowPlanPicker(true);
    }
  }, [searchParams]);

  // Misc
  const [loggingOut, setLoggingOut] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending save-confirmation timer on unmount
  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  const CARD_COLORS = ['#1a0533', '#0d2133', '#1a1a0d', '#1a0d0d'];

  const handleSaveProfile = useCallback(async () => {
    setSavingProfile(true);
    try {
      await updateUserProfile(profile.uid, { name: editName, phone: editPhone || undefined });
      onProfileUpdate({ name: editName, phone: editPhone || undefined });
      setProfileSaved(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => { setProfileSaved(false); setView('settings'); }, 1200);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSavingProfile(false);
    }
  }, [profile.uid, editName, editPhone, onProfileUpdate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setLoggingOut(false);
    }
  };

  const handleRestartOnboarding = () => {
    sessionStorage.removeItem('bs_onboarded');
    logoutUser();
  };

  const handleSwitchToFree = async () => {
    try {
      await updateSubscriptionTier(profile.uid, 'free');
      onProfileUpdate({ subscriptionTier: 'free' });
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Failed to downgrade:', err);
    }
  };

  const formatCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

  const handleAddCard = () => {
    if (!cardNum || !cardExpiry || !cardCvc || !cardName) return;
    const rawNum = cardNum.replace(/\s/g,'');
    const net = rawNum.startsWith('4') ? 'VISA' : rawNum.startsWith('5') ? 'MC' : 'AMEX';
    const newCard: SavedCard = {
      id: Date.now().toString(),
      last4: rawNum.slice(-4),
      expiry: cardExpiry,
      name: cardName,
      network: net,
      cardColor: CARD_COLORS[savedCards.length % CARD_COLORS.length],
    };
    setSavedCards(p => [...p, newCard]);
    setCardNum(''); setCardExpiry(''); setCardCvc(''); setCardName(''); setCardZip('');
    setShowAddCard(false);
  };

  const handleDocTypeSelect = (cat: DocCategory) => {
    setPendingDocCategory(cat);
    setShowDocPicker(false);
    setTimeout(() => docInputRef.current?.click(), 50);
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSavedDocs(p => [...p, {
        id: Date.now().toString(),
        name: file.name,
        dataUrl: reader.result as string,
        mimeType: file.type,
        category: pendingDocCategory,
      }]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const inputCls = 'w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all';

  // ── Purple page header ────────────────────────────────────────────────────
  const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
      <button onClick={onBack} className="text-white/80 hover:text-white transition-colors active:scale-90">
        <ArrowLeft size={22} />
      </button>
      <h1 className="text-white font-black text-base uppercase tracking-widest">{title}</h1>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SETTINGS VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'settings') {
    const menuItems = [
      { icon: <User size={18} className="text-blue-400" />, iconBg: 'bg-blue-900/60', label: 'MY ACCOUNT', sub: 'Manage your account settings', action: () => setView('account') },
      { icon: <Edit3 size={18} className="text-emerald-400" />, iconBg: 'bg-emerald-900/60', label: 'EDIT PROFILE', sub: 'Update your personal information', action: () => { setEditName(profile.name); setView('edit'); } },
      { icon: <CreditCard size={18} className="text-amber-400" />, iconBg: 'bg-amber-900/60', label: 'PAYMENT METHODS', sub: 'Manage your payment options', action: () => setView('payments') },
      { icon: <MessageCircle size={18} className="text-purple-400" />, iconBg: 'bg-purple-900/60', label: 'CONTACT SUPPORT', sub: 'Get help with any issues', action: () => window.open('mailto:support@buildscript.app') },
      { icon: <FileText size={18} className="text-slate-400" />, iconBg: 'bg-slate-700/60', label: 'TERMS & PRIVACY', sub: 'View our terms of service and privacy policy', action: () => navigate('/terms') },
      { icon: <RefreshCcw size={18} className="text-emerald-400" />, iconBg: 'bg-emerald-900/60', label: 'RESTART ONBOARDING', sub: 'View the intro slides again', action: handleRestartOnboarding },
      { icon: <XCircle size={18} className="text-red-400" />, iconBg: 'bg-red-900/40', label: 'CANCEL SUBSCRIPTION', sub: 'Manage your subscription', labelColor: 'text-red-400', action: () => setShowCancelConfirm(true), danger: true },
    ];

    return (
      <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
        {/* Header */}
        <div className="px-5 py-5" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', paddingTop: 'max(20px, env(safe-area-inset-top, 20px))' }}>
          <h1 className="text-white font-black text-xl tracking-widest">Settings</h1>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2.5">
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-slate-800 active:scale-[0.98] transition-all text-left"
              style={{ background: '#12121a' }}>
              <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className={`font-black text-xs uppercase tracking-widest ${item.danger ? 'text-red-400' : 'text-white'}`}>{item.label}</p>
                <p className="text-slate-500 text-[10px] font-medium mt-0.5">{item.sub}</p>
              </div>
              <ChevronRight size={16} className={item.danger ? 'text-red-400/60' : 'text-slate-600'} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8 space-y-1">
          <p className="text-slate-600 text-xs font-bold">BuildScript</p>
          <p className="text-slate-700 text-[10px]">Version 1.0.0</p>
          <p className="text-slate-700 text-[10px]">© 2026 BuildScript. All rights reserved.</p>
        </div>

        {/* Cancel subscription confirm */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)}>
            <div className="bg-slate-900 w-full max-w-md rounded-t-3xl p-6 border-t border-red-900/40" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-900/40 rounded-xl flex items-center justify-center">
                  <XCircle size={20} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">Cancel Subscription?</h3>
                  <p className="text-slate-400 text-xs">You'll lose access to premium features.</p>
                </div>
              </div>
              <button onClick={handleSwitchToFree}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mb-3 active:scale-[0.97] transition-all">
                Confirm — Switch to Free
              </button>
              <button onClick={() => setShowCancelConfirm(false)}
                className="w-full border border-slate-700 text-slate-400 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.97] transition-all">
                Keep Subscription
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MY ACCOUNT VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'account') {
    const isPremium = profile.subscriptionTier !== 'free';
    const planLabel = profile.subscriptionTier === 'premium' ? 'PREMIUM' : profile.subscriptionTier === 'pro' ? 'PRO' : 'FREE';
    const planPrice = profile.subscriptionTier === 'premium' ? '$9.99/mo' : profile.subscriptionTier === 'pro' ? '$3.99/mo' : null;

    return (
      <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
        <PageHeader title="MY ACCOUNT" onBack={() => setView('settings')} />

        <div className="px-4 pt-5 space-y-4">
          {/* Avatar + info */}
          <div className="rounded-2xl border border-slate-800 p-6 text-center" style={{ background: '#12121a' }}>
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-3 text-3xl font-black text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-white font-black text-lg">{profile.name}</h2>
            <p className="text-slate-400 text-xs font-medium mt-0.5">{profile.email}</p>
            <p className="text-slate-600 text-[10px] mt-0.5">{profile.phone || 'No phone number added'}</p>
          </div>

          {/* Current Plan */}
          <div className="rounded-2xl border border-slate-800 p-4" style={{ background: '#12121a' }}>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCcw size={15} className="text-emerald-400" />
              <p className="font-black text-white text-xs uppercase tracking-widest">Current Plan</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-white text-xl">{planLabel}</p>
                {planPrice
                  ? <p className="text-slate-400 text-[10px] mt-0.5">Next billing date: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
                  : <p className="text-slate-400 text-[10px] mt-0.5">Upgrade to unlock all features</p>
                }
              </div>
              {isPremium
                ? <button onClick={() => setShowCancelConfirm(true)} className="border border-blue-500/50 text-blue-400 text-xs font-black px-4 py-2 rounded-xl">Switch to Free</button>
                : <button onClick={() => setShowPlanPicker(true)} className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-xl">View Plans</button>
              }
            </div>
          </div>

          {/* Digital Wallet */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden" style={{ background: '#12121a' }}>
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-800">
              <Wallet size={15} className="text-amber-400" />
              <p className="font-black text-white text-xs uppercase tracking-widest">Digital Wallet</p>
            </div>

            <div className="p-4 space-y-5">
              {/* Payment methods */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-xs font-semibold">Payment Methods</p>
                  <button onClick={() => setView('payments')} className="text-blue-400 text-xs font-black">+ Add Card</button>
                </div>
                {savedCards.length === 0 ? (
                  <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center">
                    <CreditCard size={24} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-semibold">No cards saved</p>
                    <button onClick={() => setView('payments')}
                      className="mt-3 border border-blue-500/50 text-blue-400 text-xs font-black px-5 py-2 rounded-xl">
                      Add New Card
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedCards.map(card => (
                      <CreditCardVisual key={card.id} card={card} onRemove={() => setSavedCards(p => p.filter(c => c.id !== card.id))} />
                    ))}
                    <button onClick={() => setView('payments')} className="w-full border border-blue-500/30 text-blue-400 text-xs font-black py-3 rounded-xl">
                      + Add Another Card
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-800" />

              {/* My Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-xs font-semibold">My Documents</p>
                  <button onClick={() => setShowDocPicker(true)} className="flex items-center gap-1 text-blue-400 text-xs font-black">
                    <Upload size={12} /> Add
                  </button>
                </div>
                <input ref={docInputRef} type="file" hidden accept="image/*,.pdf" onChange={handleDocUpload} />
                <div className="space-y-3">
                  {savedDocs.map(doc => (
                    <DocCard key={doc.id} doc={doc} onRemove={() => setSavedDocs(p => p.filter(d => d.id !== doc.id))} onView={() => setViewingDoc(doc)} />
                  ))}
                  <button onClick={() => setShowDocPicker(true)}
                    className="w-full border border-dashed border-slate-700 rounded-xl p-5 flex flex-col items-center gap-2 transition-colors hover:border-slate-500 active:scale-[0.98]">
                    <Upload size={22} className="text-slate-600" />
                    <p className="text-slate-500 text-xs font-black">Upload Document</p>
                    <p className="text-slate-700 text-[10px]">License · Insurance · Registration · Other</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Log out */}
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-red-900/50 text-red-400 active:scale-95 transition-all disabled:opacity-60"
            style={{ background: 'rgba(239,68,68,0.05)' }}>
            {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            Log Out
          </button>
        </div>

        {/* Overlays */}
        {showDocPicker && (
          <DocPickerSheet onSelect={handleDocTypeSelect} onClose={() => setShowDocPicker(false)} />
        )}
        {viewingDoc && (
          <DocViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
        )}
        {showPlanPicker && (
          <PlanPickerSheet
            currentTier={profile.subscriptionTier}
            onSelect={key => {
              setShowPlanPicker(false);
              if (key === 'free') {
                handleSwitchToFree();
              } else {
                navigate(`/checkout?plan=${key}`);
              }
            }}
            onClose={() => setShowPlanPicker(false)}
          />
        )}

        {/* Cancel confirm */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5">
            <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-red-900/40">
              <p className="font-black text-white text-center mb-2">Switch to Free Plan?</p>
              <p className="text-slate-400 text-xs text-center mb-5">You'll lose access to premium features immediately.</p>
              <button onClick={handleSwitchToFree} className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest mb-2">Confirm — Switch to Free</button>
              <button onClick={() => setShowCancelConfirm(false)} className="w-full border border-slate-700 text-slate-400 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest">Keep My Plan</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EDIT PROFILE VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'edit') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
        <PageHeader title="EDIT PROFILE" onBack={() => setView('settings')} />

        <div className="p-4 pt-5">
          <div className="rounded-2xl border border-slate-800 p-5 space-y-4" style={{ background: '#12121a' }}>
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className={inputCls}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="123 456 7890"
                className={inputCls}
                inputMode="tel"
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className={`${inputCls} opacity-40 cursor-not-allowed`}
              />
            </div>

            <button onClick={handleSaveProfile} disabled={savingProfile || profileSaved}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.97] mt-2
                ${profileSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
              {savingProfile ? <Loader2 size={18} className="animate-spin" />
                : profileSaved ? <><CheckCircle2 size={18} /> Saved!</>
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAYMENT METHODS VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === 'payments') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
        <PageHeader title="PAYMENT METHODS" onBack={() => setView('settings')} />

        <div className="p-4 pt-5 space-y-4">
          {/* Saved cards */}
          {savedCards.length > 0 && (
            <div className="rounded-2xl border border-slate-800 p-4" style={{ background: '#12121a' }}>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Saved Cards</p>
              <div className="space-y-3">
                {savedCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-3 border border-slate-700 rounded-xl bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="bg-white rounded px-1.5 py-0.5">
                        <span className="text-slate-900 font-black text-[9px] uppercase">{card.network}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-widest">•••• •••• •••• {card.last4}</p>
                        <p className="text-slate-500 text-[10px]">Expires {card.expiry}</p>
                      </div>
                    </div>
                    <button onClick={() => setSavedCards(p => p.filter(c => c.id !== card.id))} className="text-red-400 text-xs font-black">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add card form / empty state */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden" style={{ background: '#12121a' }}>
            {!showAddCard && savedCards.length === 0 ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <CreditCard size={36} className="text-slate-600" />
                <p className="text-slate-400 text-sm font-semibold">No payment methods saved.</p>
                <button onClick={() => setShowAddCard(true)}
                  className="border border-blue-500/50 text-blue-400 font-black text-xs px-6 py-3 rounded-xl mt-1">
                  Add New Card
                </button>
              </div>
            ) : showAddCard ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-black text-white text-sm">Add New Card</p>
                  <button onClick={() => setShowAddCard(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Card Number</label>
                  <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} placeholder="1234 1234 1234 1234" className={inputCls} inputMode="numeric" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Expiry Date</label>
                    <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className={inputCls} inputMode="numeric" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">CVC</label>
                    <input value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" className={inputCls} inputMode="numeric" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Cardholder Name</label>
                  <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" className={inputCls} />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-2">Billing ZIP Code</label>
                  <input value={cardZip} onChange={e => setCardZip(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="92881" className={inputCls} inputMode="numeric" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={handleAddCard} disabled={!cardNum || !cardExpiry || !cardCvc || !cardName}
                    className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-40 active:scale-[0.97] transition-all">
                    Save Card
                  </button>
                  <button onClick={() => setShowAddCard(false)}
                    className="border border-slate-700 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.97] transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <button onClick={() => setShowAddCard(true)}
                  className="w-full border border-blue-500/40 text-blue-400 font-black text-xs py-4 rounded-xl uppercase tracking-widest">
                  Add Another Card
                </button>
              </div>
            )}
          </div>

          {/* Card preview */}
          {savedCards.length > 0 && (
            <div className="space-y-3">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest px-1">Card Preview</p>
              {savedCards.slice(-1).map(card => (
                <CreditCardVisual key={card.id} card={card} onRemove={() => setSavedCards(p => p.filter(c => c.id !== card.id))} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Profile;
