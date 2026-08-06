import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
    <div className="relative mb-8">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-900">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
    <h1 className="text-white font-black text-2xl tracking-tight mb-2">BuildScript</h1>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Starting engine...</p>
  </div>
);

export default LoadingScreen;
