import React, { useState, useEffect } from 'react';
import { Vehicle, Modification, SubscriptionTier } from '../types';
import { getModifications } from '../services/gemini';
import { Loader2, Zap, Lock, ChevronDown, ChevronUp, Wrench, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface ModificationsProps {
  vehicle: Vehicle;
  subscriptionTier: SubscriptionTier;
  onUpgrade: () => void;
}

const difficultyConfig = {
  easy: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Easy' },
  moderate: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Moderate' },
  advanced: { color: 'text-red-600', bg: 'bg-red-50', label: 'Advanced' },
};

const Modifications: React.FC<ModificationsProps> = ({ vehicle, subscriptionTier, onUpgrade }) => {
  const [mods, setMods] = useState<Modification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const canAccess = subscriptionTier !== 'free';

  const fetchMods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModifications(vehicle);
      setMods(data);
    } catch {
      setError('Failed to load modifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (canAccess && mods.length === 0) fetchMods();
  }, [canAccess]); // intentionally omit fetchMods/mods.length — guard prevents double-fetch

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="px-6 pt-6 pb-4 pt-safe bg-white border-b border-slate-100">
          <h1 className="text-2xl font-black text-slate-900">Performance Mods</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 border border-amber-100">
            <Lock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Premium Feature</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mb-8">
            AI-powered modification suggestions with performance impact data are available on Builder plan and above.
          </p>
          <button onClick={onUpgrade}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2">
            <Zap size={16} /> View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="px-6 pt-6 pb-4 pt-safe bg-white border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-900">Performance Mods</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
      </div>

      <div className="p-6 space-y-4">
        {loading && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Loader2 size={28} className="text-indigo-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Analyzing Your Build</p>
              <p className="text-slate-400 text-xs font-medium mt-1">Generating custom mod suggestions...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-semibold flex justify-between items-center">
            {error}
            <button onClick={fetchMods} className="text-xs underline font-bold">Retry</button>
          </div>
        )}

        {mods.map(mod => {
          const diff = difficultyConfig[mod.difficulty];
          const isExpanded = expandedId === mod.id;

          return (
            <div key={mod.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <button onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                className="w-full p-6 text-left active:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg">{mod.category}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${diff.bg} ${diff.color}`}>{diff.label}</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-base">{mod.name}</h3>
                    <p className="text-slate-500 text-xs font-medium mt-1 line-clamp-2">{mod.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-slate-900 text-sm">{mod.costEstimate}</p>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400 ml-auto mt-1" /> : <ChevronDown size={16} className="text-slate-400 ml-auto mt-1" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-5 border-t border-slate-100 pt-4">
                  {/* Performance chart */}
                  {mod.performanceImpact.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={14} className="text-indigo-600" />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Performance Impact</p>
                      </div>
                      <div className="space-y-3">
                        {mod.performanceImpact.map((impact, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-600">{impact.label}</span>
                              <span className="text-xs font-black text-indigo-600">
                                {impact.stock} → {impact.modded} {impact.unit}
                              </span>
                            </div>
                            <div className="h-5">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[{ stock: impact.stock, modded: impact.modded }]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                  <XAxis type="number" hide domain={[0, Math.max(impact.stock, impact.modded) * 1.2]} />
                                  <YAxis type="category" hide />
                                  <Bar dataKey="stock" barSize={8} radius={4}><Cell fill="#e2e8f0" /></Bar>
                                  <Bar dataKey="modded" barSize={8} radius={4}><Cell fill="#4f46e5" /></Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench size={14} className="text-amber-600" />
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Required Tools</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mod.requiredTools.map((tool, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600">{tool}</span>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign size={14} className="text-emerald-600" />
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Installation Steps</p>
                    </div>
                    <ol className="space-y-2.5">
                      {mod.installationSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {mods.length > 0 && (
          <button onClick={fetchMods} disabled={loading}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-[0.98]">
            Regenerate Suggestions
          </button>
        )}
      </div>
    </div>
  );
};

export default Modifications;
