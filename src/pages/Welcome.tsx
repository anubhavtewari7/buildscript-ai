import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Mail, User as UserIcon, ArrowLeft, Loader2, AlertCircle, Lock, Car, Search, Wrench, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { LogoMark, LogoWordmark } from '../components/Logo';
import { registerUser, loginUser } from '../services/auth';
import { Vehicle } from '../types';

interface WelcomeProps { onAuthComplete: () => void; }
type Mode = 'onboarding' | 'signup' | 'login';
type SignupStep = 1 | 2;

// ─── Onboarding slides data ───────────────────────────────────────────────────
const SLIDES = [
  {
    bg: ['#020617', '#0c1a3a', '#020617'],
    accent: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.25)',
    Icon: Car,
    title: 'Your Car,',
    titleAccent: 'Reinvented',
    subtitle: "Unlock your vehicle's true potential with professional diagnostics and custom builds.",
    tags: ['OBD-II', 'AI Powered', 'Real-time'],
    dotColor: '#3b82f6',
  },
  {
    bg: ['#0a0415', '#1e0a4a', '#0a0415'],
    accent: '#a855f7',
    glowColor: 'rgba(168,85,247,0.25)',
    Icon: Search,
    title: 'Smart',
    titleAccent: 'Diagnostics',
    subtitle: 'Understand every check engine light instantly. No more guessing games.',
    tags: ['P0420', 'O2 Sensor', 'Instant'],
    dotColor: '#a855f7',
  },
  {
    bg: ['#150502', '#3a0e02', '#150502'],
    accent: '#f97316',
    glowColor: 'rgba(249,115,22,0.22)',
    Icon: Wrench,
    title: 'Custom',
    titleAccent: 'Build Plans',
    subtitle: 'From Stage 1 tunes to drift builds — step-by-step guides for your exact model.',
    tags: ['Stage 1', 'Tune', 'Performance'],
    dotColor: '#f97316',
  },
  {
    bg: ['#021408', '#032b12', '#021408'],
    accent: '#10b981',
    glowColor: 'rgba(16,185,129,0.22)',
    Icon: ShoppingCart,
    title: 'Verified',
    titleAccent: 'Parts',
    subtitle: 'One-click purchasing for parts guaranteed to fit your exact build.',
    tags: ['Fit Verified', 'Fast Ship', '1-Click'],
    dotColor: '#10b981',
  },
];

// ─── Onboarding Component ─────────────────────────────────────────────────────
const Onboarding: React.FC<{ onDone: () => void; onSkip: () => void }> = ({ onDone, onSkip }) => {
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [displayIdx, setDisplayIdx] = useState(0);
  const touchStartX = useRef(0);

  const goTo = (next: number) => {
    if (animState !== 'idle' || next === current) return;
    setAnimState('exit');
    setTimeout(() => {
      setDisplayIdx(next);
      setCurrent(next);
      setAnimState('enter');
      setTimeout(() => setAnimState('idle'), 600);
    }, 350);
  };

  const handleNext = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else onDone();
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && current < SLIDES.length - 1) goTo(current + 1);
    else if (diff < -50 && current > 0) goTo(current - 1);
  };

  const slide = SLIDES[displayIdx];
  const isLast = current === SLIDES.length - 1;

  // 3D card transform based on anim state
  const cardStyle: React.CSSProperties = {
    transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease',
    transformStyle: 'preserve-3d',
    transform: animState === 'exit'
      ? 'perspective(1000px) rotateY(-40deg) translateX(-60px) scale(0.88)'
      : animState === 'enter'
      ? 'perspective(1000px) rotateY(30deg) translateX(40px) scale(0.92)'
      : 'perspective(1000px) rotateY(0deg) translateX(0) scale(1)',
    opacity: animState === 'exit' ? 0 : animState === 'enter' ? 0.6 : 1,
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: `radial-gradient(ellipse at 50% 30%, ${slide.bg[1]}, ${slide.bg[0]} 70%)`, transition: 'background 0.6s ease' }}
    >
      {/* Top bar: logo mark + skip */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} lightGrad={true} />
          <span style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
            fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff',
          }}>Build<span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>Script</span></span>
        </div>
        <button onClick={onSkip} className="bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-90">
          Skip Intro
        </button>
      </div>

      {/* Central card */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative" style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
        {/* Glow behind icon */}
        <div className="absolute rounded-full blur-3xl pointer-events-none"
          style={{ width: 280, height: 280, background: slide.glowColor, transition: 'background 0.6s ease' }} />

        {/* 3D animated content block */}
        <div style={cardStyle} className="flex flex-col items-center w-full">
          {/* Floating icon with rings */}
          <div className="relative flex items-center justify-center mb-10">
            {/* Outer ring */}
            <div className="absolute w-48 h-48 rounded-full border opacity-20 animate-spin"
              style={{ borderColor: slide.accent, animationDuration: '12s' }} />
            {/* Middle ring */}
            <div className="absolute w-36 h-36 rounded-full border opacity-30 animate-spin"
              style={{ borderColor: slide.accent, animationDuration: '8s', animationDirection: 'reverse' }} />
            {/* Icon container */}
            <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10"
              style={{ background: `linear-gradient(135deg, ${slide.accent}33, ${slide.accent}11)`, border: `1.5px solid ${slide.accent}40` }}>
              {/* Floating tags */}
              {slide.tags.map((tag, i) => {
                const positions = [
                  { top: '-20px', left: '-60px' },
                  { top: '-20px', right: '-55px' },
                  { bottom: '-15px', left: '-50px' },
                ];
                return (
                  <div key={tag} className="absolute text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl backdrop-blur-sm"
                    style={{ ...positions[i], background: `${slide.accent}22`, border: `1px solid ${slide.accent}40`, color: slide.accent }}>
                    {tag}
                  </div>
                );
              })}
              <slide.Icon size={44} color={slide.accent} strokeWidth={1.5} />
            </div>
            {/* Shadow glow underneath */}
            <div className="absolute -bottom-4 w-24 h-4 rounded-full blur-lg opacity-60"
              style={{ background: slide.accent }} />
          </div>

          {/* Text */}
          <h1 className="text-4xl font-black text-white text-center leading-tight mb-1">
            {slide.title}
          </h1>
          <h1 className="text-4xl font-black text-center leading-tight mb-5"
            style={{ color: slide.accent }}>
            {slide.titleAccent}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed text-center max-w-[280px] font-medium">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-12 space-y-6" style={{ paddingBottom: 'max(48px, env(safe-area-inset-bottom, 48px))' }}>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: current === i ? 24 : 6,
                height: 6,
                background: current === i ? s.dotColor : 'rgba(255,255,255,0.2)',
              }} />
          ))}
        </div>

        {/* Continue / Get Started */}
        <button onClick={handleNext}
          className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-2xl"
          style={{ background: '#ffffff', color: '#0f172a' }}>
          {isLast ? 'Get Started' : 'Continue'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── Auth Screens ─────────────────────────────────────────────────────────────
const Welcome: React.FC<WelcomeProps> = ({ onAuthComplete }) => {
  const isReturning = !!sessionStorage.getItem('bs_onboarded');
  const [mode, setMode] = useState<Mode>(isReturning ? 'login' : 'onboarding');
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carYear, setCarYear] = useState('2022');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carMiles, setCarMiles] = useState('');
  const [fuelType, setFuelType] = useState<'gas' | 'diesel' | 'electric' | 'hybrid'>('gas');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'onboarding') {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [mode]);

  const handleOnboardingDone = () => {
    sessionStorage.setItem('bs_onboarded', '1');
    setMode('signup');
    setTimeout(() => setVisible(true), 50);
  };

  const handleOnboardingSkip = () => {
    sessionStorage.setItem('bs_onboarded', '1');
    setMode('login');
    setTimeout(() => setVisible(true), 50);
  };

  const handleBack = () => {
    if (mode === 'signup' && signupStep === 2) { setSignupStep(1); return; }
    setError(null);
    sessionStorage.removeItem('bs_onboarded');
    setMode('onboarding');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === 1) {
      if (!name || !email || !password) { setError('All fields required.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      setError(null); setSignupStep(2); return;
    }
    if (!carMake || !carModel) { setError('Please enter your vehicle details.'); return; }
    setLoading(true); setError(null);
    try {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        year: parseInt(carYear) || 2022,
        make: carMake.trim(), model: carModel.trim(),
        mileage: parseInt(carMiles) || 0, fuelType,
      };
      await registerUser(name.trim(), email.trim(), password, vehicle);
      onAuthComplete();
    } catch (err: any) {
      const msgs: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
      };
      setError(msgs[err?.code] || err?.message || 'Sign up failed.');
    } finally { setLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setError('Enter your email and password.'); return; }
    setLoading(true); setError(null);
    try {
      await loginUser(loginEmail.trim(), loginPassword);
      onAuthComplete();
    } catch (err: any) {
      const msgs: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      };
      setError(msgs[err?.code] || err?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { setError('Enter your email address.'); return; }
    setResetLoading(true); setError(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err: any) {
      const msgs: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setError(msgs[err?.code] || 'Failed to send reset email.');
    } finally { setResetLoading(false); }
  };

  if (mode === 'onboarding') {
    return <Onboarding onDone={handleOnboardingDone} onSkip={handleOnboardingSkip} />;
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all';

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden relative transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-[-15%] right-[-25%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-25%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />

      <div className="relative z-10 flex flex-col flex-1 px-8" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <button onClick={handleBack} className="mt-6 self-start p-2 text-slate-400 hover:text-white transition-colors active:scale-90">
          <ArrowLeft size={24} />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mt-4 mb-8">
          <LogoWordmark size={48} theme="dark-bg" />
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle size={16} className="shrink-0" />{error}
          </div>
        )}

        {/* Sign Up */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="flex-1 flex flex-col space-y-4">
            {signupStep === 1 ? (
              <>
                <div className="mb-1">
                  <h2 className="text-2xl font-black">Create Account</h2>
                  <p className="text-slate-400 text-sm mt-1">Set up your driver profile.</p>
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type={showSignupPassword ? 'text' : 'password'} placeholder="Password (6+ characters)" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  <button type="button" onClick={() => setShowSignupPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-1">
                  <h2 className="text-2xl font-black">Your Vehicle</h2>
                  <p className="text-slate-400 text-sm mt-1">Register your primary vehicle.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Year" value={carYear} onChange={e => setCarYear(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  <input type="text" placeholder="Make" value={carMake} onChange={e => setCarMake(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <input type="text" placeholder="Model (e.g. Camry)" value={carModel} onChange={e => setCarModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <input type="number" placeholder="Current Mileage" value={carMiles} onChange={e => setCarMiles(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fuel Type</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['gas', 'diesel', 'electric', 'hybrid'] as const).map(ft => (
                      <button key={ft} type="button" onClick={() => setFuelType(ft)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${fuelType === ft ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {ft}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <button type="button" onClick={() => { setMode('login'); setError(null); }}
              className="text-center text-slate-500 text-xs font-semibold py-2 hover:text-slate-300 transition-colors">
              Already have an account? <span className="text-indigo-400">Sign in</span>
            </button>
            <div className="flex-1" />
            <button type="submit" disabled={loading}
              className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95 shadow-2xl">
              {loading ? <Loader2 size={20} className="animate-spin" /> : (signupStep === 1 ? <>Next <ChevronRight size={16} /></> : 'Launch BuildScript')}
            </button>
          </form>
        )}

        {/* Login */}
        {mode === 'login' && !forgotMode && (
          <form onSubmit={handleLogin} className="flex-1 flex flex-col space-y-4">
            <div className="mb-1">
              <h2 className="text-2xl font-black">Welcome Back</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to your account.</p>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" placeholder="Email Address" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputCls} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type={showLoginPassword ? 'text' : 'password'} placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              <button type="button" onClick={() => setShowLoginPassword(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="button" onClick={() => { setForgotMode(true); setResetEmail(loginEmail); setError(null); setResetSent(false); }}
              className="text-right text-indigo-400 text-xs font-semibold hover:text-indigo-300 transition-colors -mt-2">
              Forgot password?
            </button>
            <button type="button" onClick={() => { setMode('signup'); setError(null); setSignupStep(1); }}
              className="text-center text-slate-500 text-xs font-semibold py-1 hover:text-slate-300 transition-colors">
              Don't have an account? <span className="text-indigo-400">Create one</span>
            </button>
            <div className="flex-1" />
            <button type="submit" disabled={loading}
              className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'login' && forgotMode && (
          <form onSubmit={handleForgotPassword} className="flex-1 flex flex-col space-y-4">
            <div className="mb-1">
              <h2 className="text-2xl font-black">Reset Password</h2>
              <p className="text-slate-400 text-sm mt-1">We'll send a reset link to your email.</p>
            </div>
            {resetSent ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold p-4 rounded-2xl text-center">
                ✓ Reset email sent! Check your inbox.
              </div>
            ) : (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" placeholder="Email Address" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} className={inputCls} />
              </div>
            )}
            <div className="flex-1" />
            {!resetSent && (
              <button type="submit" disabled={resetLoading}
                className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95">
                {resetLoading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
              </button>
            )}
            <button type="button" onClick={() => { setForgotMode(false); setError(null); }}
              className="text-center text-slate-500 text-xs font-semibold py-2 hover:text-slate-300 transition-colors">
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Welcome;

