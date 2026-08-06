import React, { useState } from 'react';
import { Vehicle } from '../types';
import { lookupOBDCode, isSmartDecodedEntry, OBDEntry } from '../data/obdCodes';
import {
  Search, AlertTriangle, ShieldCheck, AlertCircle,
  XCircle, ChevronDown, ChevronUp, Wrench, DollarSign, Info, ExternalLink,
  Truck, MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface DiagnosticToolProps { vehicle: Vehicle; }

const COMMON_CODES = ['P0300', 'P0420', 'P0171', 'P0455', 'P0128', 'P0401', 'P0442', 'C0031'];

const severityConfig = {
  low: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <ShieldCheck size={20} className="text-emerald-600" />, label: 'Low' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={20} className="text-amber-600" />, label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: <AlertCircle size={20} className="text-orange-600" />, label: 'High' },
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={20} className="text-red-600" />, label: 'Critical' },
};

const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<OBDEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState('');
  const [showDIY, setShowDIY] = useState(false);
  const [isDecoded, setIsDecoded] = useState(false);

  const handleScan = async (codeToScan?: string) => {
    const target = (codeToScan || code).trim().toUpperCase();
    if (!target) return;

    if (Capacitor.isNativePlatform()) await Haptics.impact({ style: ImpactStyle.Medium });

    setShowDIY(false);
    setSearched(target);

    const found = lookupOBDCode(target);
    if (found) {
      setResult(found);
      setIsDecoded(isSmartDecodedEntry(target));
      setNotFound(false);
      if (Capacitor.isNativePlatform()) await Haptics.impact({ style: ImpactStyle.Light });
    } else {
      setResult(null);
      setIsDecoded(false);
      setNotFound(true);
    }
  };

  const sev = result ? severityConfig[result.severity] : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 mb-0.5">OBD-II Diagnostics</h1>
        <p className="text-xs text-slate-400 font-medium">{vehicle.year} {vehicle.make} {vehicle.model} · Free for everyone</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Input */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Enter Fault Code</label>
          <div className="flex gap-3 w-full">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="e.g. P0300"
              maxLength={6}
              className="min-w-0 flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-black text-lg text-center tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button onClick={() => handleScan()} disabled={!code.trim()}
              className="shrink-0 w-14 bg-indigo-600 text-white rounded-2xl font-black disabled:opacity-40 transition-all active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>

          {/* Common codes */}
          <div className="mt-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Common Codes — Tap to Look Up</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_CODES.map(c => (
                <button key={c} onClick={() => { setCode(c); handleScan(c); }}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all active:scale-95">
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">174 explicit codes + universal decoder · Always free</p>
          </div>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle size={18} className="shrink-0" />
              <p className="font-black text-sm">Code "{searched}" not in local database</p>
            </div>
            <p className="text-xs text-amber-600 font-medium leading-relaxed">
              "{searched}" doesn't match the standard OBD-II format (P/B/C/U + 4 hex digits). Double-check the code on your scanner.
            </p>
            <a
              href={`https://www.google.com/search?q=${searched}+OBD-II+code+meaning+${vehicle.year}+${vehicle.make}+${vehicle.model}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all w-fit">
              <ExternalLink size={14} />
              Search "{searched}" Online
            </a>
          </div>
        )}

        {/* Result */}
        {result && sev && (
          <div className="space-y-4">
            {/* Main card */}
            <div className={`rounded-3xl p-6 border ${sev.bg} ${sev.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {sev.icon}
                  <div>
                    <span className="font-black text-slate-900 text-lg">{result.code}</span>
                    <span className={`ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${sev.bg} ${sev.color} border ${sev.border}`}>
                      {sev.label} Severity
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${result.canDrive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {result.canDrive ? '✓ Safe to Drive' : '✗ Do Not Drive'}
                </div>
              </div>
              <h3 className="font-black text-slate-900 text-base mb-2">{result.title}</h3>
              {isDecoded && (
                <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-xl w-fit">
                  <Info size={11} className="text-indigo-500 shrink-0" />
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Decoded from code structure · Search online for full details</span>
                </div>
              )}
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{result.description}</p>
            </div>

            {/* Likely Causes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-indigo-600" />
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Likely Causes</h4>
              </div>
              <ul className="space-y-2">
                {result.likelyCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</span>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-emerald-600" />
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Repair Estimate</h4>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-4">{result.estimatedRepairCost}</div>
              {result.partsNeeded.length > 0 && (
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Parts Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {result.partsNeeded.map((part, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600">{part}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DIY Guide */}
            {result.diyInstructions && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <button onClick={() => setShowDIY(!showDIY)}
                  className="w-full flex items-center justify-between p-6 text-left active:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-amber-600" />
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">DIY Repair Guide</h4>
                    <span className="text-[8px] bg-amber-100 text-amber-700 font-black uppercase px-2 py-0.5 rounded-lg tracking-wider">Save {result.diyInstructions.savings}</span>
                  </div>
                  {showDIY ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {showDIY && (
                  <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600 font-medium">{result.diyInstructions.feasibility}</p>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tools Needed</p>
                      <div className="flex flex-wrap gap-2">
                        {result.diyInstructions.tools.map((tool, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">{tool}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Steps</p>
                      <ol className="space-y-3">
                        {result.diyInstructions.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                            <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons — Tow & Shops */}
            <div className="space-y-3 pt-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Need immediate help?</p>
              <button
                onClick={() => navigate('/tow-service')}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-900/30 active:scale-[0.98] transition-all"
              >
                <Truck size={18} />
                Call Tow Services
              </button>
              <button
                onClick={() => navigate('/nearby-shops')}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-900/30 active:scale-[0.98] transition-all"
              >
                <MapPin size={18} />
                Find Shops Near Me
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticTool;
