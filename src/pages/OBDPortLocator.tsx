import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const MAKES = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Pontiac','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo'];
const YEARS = Array.from({length: 30}, (_, i) => (2026 - i).toString());

interface LocationResult {
  primary: string;
  description: string;
  tip: string;
  percentage: string;
  image: string;
}

const PORT_LOCATIONS: Record<string, LocationResult[]> = {
  default: [
    { primary: 'Under the dashboard, driver\'s side', description: 'Most common location — look below the steering column, near your left knee. It\'s usually a 16-pin trapezoid-shaped port.', tip: 'Use your phone flashlight. The port is typically black or grey.', percentage: '85%', image: '🚗' },
    { primary: 'Under the steering wheel column', description: 'Hidden behind a small panel or plastic cover on the steering column. May need to feel around the underside.', tip: 'Sometimes there\'s a small door or panel that snaps open.', percentage: '60%', image: '🔧' },
    { primary: 'Near the center console', description: 'Between the driver and front passenger seats, usually at the base of the center console or in a small cubby.', tip: 'Check both sides of the center console near floor level.', percentage: '40%', image: '🪑' },
    { primary: 'Glove compartment area', description: 'Less common but some vehicles have the port inside or directly under the glove box.', tip: 'Look on the passenger side under the dash as well.', percentage: '20%', image: '📦' },
  ],
  BMW: [
    { primary: 'Under the dashboard, left of center', description: 'BMW typically places the OBD port on the left side of the dashboard, sometimes behind a small cover near the footwell.', tip: 'Look for a small panel that pops open near the driver\'s left knee.', percentage: '95%', image: '🏎️' },
    { primary: 'In the center console', description: 'Some older BMWs have the port in the center console area.', tip: 'Check the armrest compartment on older models.', percentage: '15%', image: '🚗' },
  ],
  'Mercedes-Benz': [
    { primary: 'Left side of dashboard, lower panel', description: 'Mercedes usually places the OBD port behind a small panel on the left side of the dashboard near the fuse box access.', tip: 'There may be a small flip-down cover panel.', percentage: '90%', image: '🏎️' },
  ],
  Jeep: [
    { primary: 'Under dashboard, driver\'s side', description: 'Jeep OBD ports are typically located under the driver\'s side dashboard, near the hood release lever.', tip: 'Look near the hood release handle on the left side.', percentage: '92%', image: '🚙' },
  ],
  Ford: [
    { primary: 'Under the dashboard, left of steering column', description: 'Ford typically places the OBD-II port under the driver\'s side dash, slightly to the left.', tip: 'Should be visible without removing any panels on most Ford models.', percentage: '90%', image: '🚗' },
  ],
  Toyota: [
    { primary: 'Under the dashboard, driver\'s side left', description: 'Toyota OBD ports are usually easy to access — located under the dash to the left of the steering column.', tip: 'No cover panel needed on most Toyotas — just plug straight in.', percentage: '95%', image: '🚗' },
  ],
  Honda: [
    { primary: 'Under the dashboard, driver\'s side', description: 'Honda places the port below the steering column, typically pointing downward and easily accessible.', tip: 'On Civics, look directly below the steering wheel near the pedals.', percentage: '95%', image: '🚗' },
  ],
  Chevrolet: [
    { primary: 'Under the dashboard, driver\'s side', description: 'Chevrolet (and most GM vehicles) place the OBD port under the driver\'s side dash, usually near the firewall.', tip: 'May be pointing down at an angle on some Silverado/Tahoe models.', percentage: '90%', image: '🚗' },
  ],
};

const COMMON_LOCATIONS = [
  { label: 'Under driver\'s dashboard', pct: '85% of vehicles', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { label: 'Under the steering wheel', pct: '60% of vehicles', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Near center console', pct: '40% of vehicles', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { label: 'Under the hood near engine', pct: '15% of vehicles', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const OBDPortLocator: React.FC = () => {
  const navigate = useNavigate();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [locations, setLocations] = useState<LocationResult[] | null>(null);

  const handleFind = () => {
    if (!make) return;
    const result = PORT_LOCATIONS[make] || PORT_LOCATIONS['default'];
    setLocations(result);
  };

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all';

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="px-5 pb-5" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <div className="flex items-center gap-3 mb-1 pt-2">
          <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white active:scale-90 transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">OBD Port Locator</h1>
            <p className="text-xs text-slate-400 font-medium">Find where to plug in your scanner</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Vehicle selector */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">🚗</span>
            <h2 className="font-black text-white text-sm">Select Your Vehicle</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Make *</label>
              <select value={make} onChange={e => setMake(e.target.value)} className={inputCls} style={{ appearance: 'none' }}>
                <option value="">Select vehicle make</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Model (Optional)</label>
              <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Enter vehicle model" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Year *</label>
              <select value={year} onChange={e => setYear(e.target.value)} className={inputCls} style={{ appearance: 'none' }}>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={handleFind} disabled={!make}
              className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 transition-all active:scale-[0.97] mt-2 shadow-lg shadow-amber-900/30">
              <Search size={18} />
              Find OBD Port Location
            </button>
          </div>
        </div>

        {/* Results */}
        {locations && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-indigo-600/20 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-400" />
                <p className="font-black text-indigo-300 text-sm uppercase tracking-wider">Found for {make} {model} {year}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {locations.map((loc, i) => (
                <div key={i} className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <p className="font-black text-white text-sm mb-1">{loc.primary}</p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{loc.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <AlertCircle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-300 font-semibold leading-relaxed">{loc.tip}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Likelihood</span>
                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-900/40 px-2 py-1 rounded-lg">{loc.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common locations (always shown) */}
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-widest px-1 mb-3">Common OBD Port Locations</h3>
          <div className="space-y-3">
            {COMMON_LOCATIONS.map((loc, i) => (
              <div key={i} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{loc.label}</p>
                  <span className={`mt-1.5 inline-block text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${loc.color}`}>{loc.pct}</span>
                </div>
                <MapPin size={16} className="text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Pro tip */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-indigo-400" />
            <h4 className="font-black text-white text-xs uppercase tracking-widest">What the port looks like</h4>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            The OBD-II port is a <span className="text-white font-bold">16-pin trapezoid-shaped connector</span> about 1 inch wide. It's similar in shape to an old printer port. Since 1996, all cars sold in the US are required by law to have one.
          </p>
          <div className="mt-4 flex gap-3">
            {['16-pin connector','~1 inch wide','Trapezoid shape','No cover needed'].map((t,i) => (
              <div key={i} className="flex-1 bg-slate-800 rounded-xl p-2 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-tight">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OBDPortLocator;
