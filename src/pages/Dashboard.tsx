import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LogoMark } from '../components/Logo';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';
import {
  Activity, CheckCircle2, Droplets, Gauge, ShieldCheck, Zap,
  ChevronRight, Cpu, Plus, X, Navigation, Camera, Sparkles,
  ShoppingCart, MapPin, Search, Wrench,
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  vehicle: Vehicle;
  onUpdateVehicle: (v: Vehicle) => void;
}

type LogType = 'oil' | 'tire' | 'charge' | 'mileage' | null;

const Dashboard: React.FC<DashboardProps> = ({ vehicle, onUpdateVehicle }) => {
  const [activeLogType, setActiveLogType] = useState<LogType>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logValue, setLogValue] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [chargeStart, setChargeStart] = useState('10');
  const [chargeEnd, setChargeEnd] = useState('80');
  const [chargeDuration, setChargeDuration] = useState('45');
  const [newMileage, setNewMileage] = useState(vehicle.mileage.toString());

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending success-toast timer on unmount
  useEffect(() => () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); }, []);

  const isEV = vehicle.fuelType === 'electric' || vehicle.fuelType === 'hybrid';
  const hasNoLogs = !vehicle.logs || Object.keys(vehicle.logs).length === 0;

  const { oilLifeRemaining, lastTireVal, lastCharge } = useMemo(() => {
    const lastOilMileage = vehicle.logs?.lastOilChangeMileage || 0;
    const lastOilDateStr = vehicle.logs?.lastOilChangeDate;

    let oilLife = 100;
    if (lastOilMileage > 0) {
      const mileageDelta = Math.max(0, vehicle.mileage - lastOilMileage);
      const mileagePct = Math.max(0, 100 - Math.round((mileageDelta / 5000) * 100));
      let timePct = 100;
      if (lastOilDateStr) {
        const days = (Date.now() - new Date(lastOilDateStr).getTime()) / 86400000;
        timePct = Math.max(0, 100 - Math.round((days / 180) * 100));
      }
      oilLife = Math.min(mileagePct, timePct);
    }

    return {
      oilLifeRemaining: oilLife,
      lastTireVal: vehicle.logs?.lastTirePressureValue || 32,
      lastCharge: vehicle.logs?.evChargingHistory?.slice(-1)[0],
    };
  }, [vehicle]);

  const handleSaveLog = () => {
    const v = { ...vehicle, logs: { ...vehicle.logs } };

    if (activeLogType === 'oil') {
      v.logs.lastOilChangeMileage = vehicle.mileage;
      v.logs.lastOilChangeDate = logDate;
    } else if (activeLogType === 'tire') {
      v.logs.lastTirePressureValue = parseInt(logValue) || 32;
      v.logs.lastTirePressureCheckDate = logDate;
    } else if (activeLogType === 'charge') {
      if (!v.logs.evChargingHistory) v.logs.evChargingHistory = [];
      v.logs.evChargingHistory.push({
        date: logDate,
        durationMinutes: parseInt(chargeDuration) || 0,
        startPercentage: parseInt(chargeStart) || 0,
        endPercentage: parseInt(chargeEnd) || 0,
      });
    } else if (activeLogType === 'mileage') {
      v.mileage = parseInt(newMileage) || vehicle.mileage;
    }

    onUpdateVehicle(v);
    setActiveLogType(null);
    setLogValue('');
    setShowSuccess(true);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
  };

  const healthScore = Math.min(100, isEV ? 95 : Math.min(100, oilLifeRemaining + 15));

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="p-6">
        {/* Header */}
        <header className="mb-8 flex justify-between items-start pt-safe">
          <div>
            <div className="mb-2"><LogoMark size={28} lightGrad={false} /></div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {vehicle.year} {vehicle.make}
              <br /><span className="text-slate-400 font-bold">{vehicle.model}</span>
            </h1>
          </div>
          <button onClick={() => { setNewMileage(vehicle.mileage.toString()); setActiveLogType('mileage'); }}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center active:scale-95 transition-all">
            <Navigation size={16} className="text-indigo-600 mb-1" />
            <span className="text-[10px] font-black text-slate-900">{vehicle.mileage.toLocaleString()}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase">mi</span>
          </button>
        </header>

        {/* Success toast */}
        {showSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={16} /> Saved
          </div>
        )}

        {/* Setup prompt */}
        {hasNoLogs && (
          <div className="mb-6 bg-indigo-50 border border-indigo-100 p-5 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Calibration Required</p>
                <p className="text-[10px] text-slate-500 font-medium">Log your first service to activate AI analytics</p>
              </div>
            </div>
            <div className="space-y-2">
              {!isEV && (
                <button onClick={() => setActiveLogType('oil')} className="w-full flex justify-between items-center p-4 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 transition-all active:scale-[0.98]">
                  <span>Log Last Oil Change</span><Plus size={14} />
                </button>
              )}
              <button onClick={() => setActiveLogType('tire')} className="w-full flex justify-between items-center p-4 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 transition-all active:scale-[0.98]">
                <span>Log Tire Pressure</span><Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Health card */}
        <div className="bg-indigo-900 rounded-3xl p-6 shadow-2xl mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu size={120} /></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">Build Integrity</p>
              <div className="text-5xl font-black tracking-tighter mb-3">{healthScore}%</div>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full w-fit">
                <CheckCircle2 size={13} />
                <span className="text-[9px] font-black uppercase tracking-wide">Systems Nominal</span>
              </div>
            </div>
            <div className="w-28 h-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8}
                  data={[{ value: healthScore }]} startAngle={90} endAngle={450}>
                  <RadialBar background dataKey="value" cornerRadius={10}>
                    <Cell fill="#818cf8" />
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={24} className="text-indigo-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              type: 'oil', label: 'Oil Life', hidden: isEV,
              value: hasNoLogs ? 'Add Log' : `${oilLifeRemaining}%`,
              icon: <Droplets className="text-blue-500" size={20} />,
              status: oilLifeRemaining < 20 ? 'Service' : 'Good',
              statusColor: oilLifeRemaining < 20 ? 'text-orange-500' : 'text-emerald-500',
            },
            {
              type: 'charge', label: isEV ? 'Last Charge' : 'Battery',
              value: lastCharge ? `${lastCharge.endPercentage}%` : (isEV ? 'Log It' : '12.8V'),
              icon: <Zap className="text-emerald-500" size={20} />,
              status: 'Good', statusColor: 'text-emerald-500',
            },
            {
              type: 'tire', label: 'Tire PSI',
              value: `${lastTireVal} psi`,
              icon: <Gauge className="text-emerald-500" size={20} />,
              status: lastTireVal < 28 || lastTireVal > 40 ? 'Check' : 'Good',
              statusColor: lastTireVal < 28 || lastTireVal > 40 ? 'text-orange-500' : 'text-emerald-500',
            },
            {
              type: 'system', label: 'System',
              value: 'Active',
              icon: <ShieldCheck className="text-indigo-500" size={20} />,
              status: 'Safe', statusColor: 'text-emerald-500',
            },
          ].filter(s => !s.hidden).map((stat, i) => (
            <button key={i} onClick={() => stat.type !== 'system' && setActiveLogType(stat.type as LogType)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-left transition-all hover:border-indigo-200 active:scale-95 h-32 flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-slate-50 rounded-xl">{stat.icon}</div>
                {stat.type !== 'system' && <Plus size={12} className="text-slate-300 group-hover:text-indigo-500 transition-colors mt-1" />}
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 leading-none mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center justify-between">
                  {stat.label}
                  <span className={`text-[8px] font-black ${stat.statusColor}`}>{stat.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick actions */}
        <div className="space-y-3 mb-6">
          <Link to="/ai-chat" className="flex items-center justify-between bg-indigo-600 rounded-2xl p-5 text-white group active:scale-[0.98] transition-all shadow-lg shadow-indigo-900/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><Camera size={22} /></div>
              <div>
                <span className="font-black text-sm block">Visual AI Scan</span>
                <span className="text-[9px] font-bold uppercase opacity-60">Photo Analysis</span>
              </div>
            </div>
            <ChevronRight size={18} className="opacity-50" />
          </Link>
        </div>

        {/* Feature cards — dark style */}
        <div className="mb-2">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Tools & Resources</p>
          <div className="space-y-3">
            {[
              {
                to: '/tools',
                icon: <ShoppingCart size={20} />,
                iconBg: 'bg-emerald-500',
                title: 'Buy OBD Scanner for Under $20',
                sub: 'Essential diagnostic tool',
                subColor: 'text-emerald-400',
                desc: 'Get the tool you need to read your car\'s error codes from trusted retailers.',
              },
              {
                to: '/obd-locator',
                icon: <MapPin size={20} />,
                iconBg: 'bg-amber-500',
                title: 'Locate My OBD Scanner',
                sub: 'Step-by-step location guide',
                subColor: 'text-amber-400',
                desc: 'Learn where to find the OBD port in your specific vehicle make and model.',
              },
              {
                to: '/diagnostics',
                icon: <Search size={20} />,
                iconBg: 'bg-blue-500',
                title: 'Diagnose OBD Codes',
                sub: 'Free for everyone to use',
                subColor: 'text-blue-400',
                desc: 'Your engine is warning you something is wrong. Let\'s find out what and fix it.',
              },
              {
                to: '/garage',
                icon: <Wrench size={20} />,
                iconBg: 'bg-purple-500',
                title: 'Get Custom Build Plans',
                sub: 'Performance, Off-road, Drift & more',
                subColor: 'text-purple-400',
                desc: 'Turn your regular ride into a masterpiece based on what you want to achieve.',
              },
            ].map((card, i) => (
              <Link key={i} to={card.to}
                className="flex items-start gap-4 bg-slate-900 rounded-2xl p-5 border border-slate-800 active:scale-[0.98] transition-all hover:border-slate-700 group">
                <div className={`${card.iconBg} p-3 rounded-2xl shrink-0 text-white shadow-lg`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-sm mb-0.5">{card.title}</p>
                  <p className={`text-[10px] font-black uppercase tracking-wider mb-1.5 ${card.subColor}`}>{card.sub}</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{card.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 shrink-0 mt-1 group-hover:text-slate-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Log modal */}
      {activeLogType && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setActiveLogType(null)} />
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {activeLogType === 'oil' && 'Oil Change'}
                {activeLogType === 'tire' && 'Tire Pressure'}
                {activeLogType === 'charge' && 'EV Charge'}
                {activeLogType === 'mileage' && 'Update Mileage'}
              </h3>
              <button onClick={() => setActiveLogType(null)} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              {activeLogType === 'oil' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Service Date</label>
                  <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-center" />
                  <p className="text-[10px] text-slate-400 font-medium mt-2 text-center">Current mileage ({vehicle.mileage.toLocaleString()} mi) will be recorded</p>
                </div>
              )}
              {activeLogType === 'tire' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Average PSI</label>
                  <input type="number" value={logValue} onChange={e => setLogValue(e.target.value)} placeholder="32"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-center" />
                </div>
              )}
              {activeLogType === 'charge' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Start %</label>
                      <input type="number" value={chargeStart} onChange={e => setChargeStart(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">End %</label>
                      <input type="number" value={chargeEnd} onChange={e => setChargeEnd(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Duration (minutes)</label>
                    <input type="number" value={chargeDuration} onChange={e => setChargeDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                  </div>
                </div>
              )}
              {activeLogType === 'mileage' && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Current Mileage</label>
                  <input type="number" value={newMileage} onChange={e => setNewMileage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-black text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-center" />
                </div>
              )}

              <button onClick={handleSaveLog}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all mt-2">
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
