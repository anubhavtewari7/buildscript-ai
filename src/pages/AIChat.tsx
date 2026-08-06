import React, { useState } from 'react';
import { Vehicle } from '../types';
import {
  Sparkles,
  Camera,
  MessageSquare,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { useNavigate } from 'react-router-dom';

interface AIChatProps { vehicle: Vehicle; }

const FEATURES = [
  {
    icon: <MessageSquare size={16} className="text-indigo-400" />,
    title: 'Natural Language Q&A',
    desc: 'Ask anything about your car in plain English — get clear, expert answers.',
  },
  {
    icon: <Camera size={16} className="text-indigo-400" />,
    title: 'Photo Diagnostics',
    desc: 'Snap a photo of a warning light or part — AI identifies the problem instantly.',
  },
  {
    icon: <ShieldCheck size={16} className="text-indigo-400" />,
    title: 'Predictive Maintenance',
    desc: 'AI learns your driving patterns and alerts you before issues become expensive.',
  },
  {
    icon: <Wrench size={16} className="text-indigo-400" />,
    title: 'Repair Guidance',
    desc: 'Step-by-step AI-guided fixes tailored to your exact vehicle trim and mileage.',
  },
];

const AIChat: React.FC<AIChatProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);

  return (
    <div className="flex flex-col bg-slate-950 min-h-screen pb-28">

      {/* Header */}
      <div className="bg-slate-950/95 border-b border-slate-800 px-5 py-4 flex items-center gap-3">
        <LogoMark size={36} lightGrad={true} />
        <div>
          <p className="font-black text-white text-sm">BuildScript AI</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Coming Soon · {vehicle.year} {vehicle.make}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-10 space-y-8">

        {/* Hero */}
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Animated glow ring */}
          <div className="relative flex items-center justify-center w-28 h-28">
            <span className="absolute inline-flex w-full h-full rounded-full bg-indigo-600/20 animate-ping" style={{ animationDuration: '2.5s' }} />
            <span className="absolute inline-flex w-20 h-20 rounded-full bg-indigo-600/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
            <div className="relative w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-2xl shadow-indigo-900/40">
              <Sparkles size={32} className="text-indigo-400" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">In Development</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              AI Chat is<br />
              <span className="text-indigo-400">Coming Soon</span>
            </h1>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
              We're building a world-class AI mechanic experience. It'll be worth the wait.
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="w-full space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">
            What's Coming
          </p>
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="text-white font-black text-sm">{f.title}</p>
                <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notify + Diagnostics CTA */}
        <div className="w-full space-y-3 pb-4">
          <button
            onClick={() => setNotified(true)}
            disabled={notified}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
              notified
                ? 'bg-emerald-600/20 border border-emerald-600/40 text-emerald-400'
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40'
            }`}
          >
            <Bell size={16} />
            {notified ? 'You\'ll be notified when it launches!' : 'Notify Me at Launch'}
          </button>

          <button
            onClick={() => navigate('/diagnostics')}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-800 text-slate-300 active:bg-slate-700 transition-all"
          >
            Try OBD Diagnostics <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
