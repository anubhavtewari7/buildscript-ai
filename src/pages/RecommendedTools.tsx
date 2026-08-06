import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, ExternalLink, Zap, Shield, Cpu } from 'lucide-react';

const TOOLS = [
  {
    name: 'FIXD OBD-II Sensor',
    tagline: 'Best for Beginners',
    price: '$19.99',
    rating: 4.7,
    reviews: '42K',
    description: 'Plain-English translations of every check engine light. Links directly to a smartphone app — perfect if you\'re new to car diagnostics.',
    badge: 'Under $20',
    badgeColor: 'bg-emerald-500',
    accentColor: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    link: 'https://www.amazon.com/s?k=FIXD+OBD2+scanner',
    pros: ['App translates codes simply','Real-time data','Maintenance alerts'],
  },
  {
    name: 'Veepeak Mini OBD-II',
    tagline: 'Budget Pick',
    price: '$17.99',
    rating: 4.5,
    reviews: '28K',
    description: 'Tiny Bluetooth dongle that works with free apps like Torque Pro or OBD Fusion. Stays plugged in permanently without draining your battery.',
    badge: 'Popular',
    badgeColor: 'bg-blue-500',
    accentColor: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    link: 'https://www.amazon.com/s?k=Veepeak+Mini+OBD2+Bluetooth',
    pros: ['Always connected','Tiny size','Works with free apps'],
  },
  {
    name: 'BlueDriver Bluetooth Pro',
    tagline: 'DIY Enthusiasts',
    price: '$119.95',
    rating: 4.7,
    reviews: '35K',
    description: 'Wireless OBDII scanner that connects to your iPhone or Android. Features full repair reports — includes likely fixes specific to your exact car.',
    badge: 'Best Value',
    badgeColor: 'bg-indigo-500',
    accentColor: 'bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    link: 'https://www.amazon.com/s?k=BlueDriver+Bluetooth+Pro+OBD2',
    pros: ['Repair reports','Wireless','Live sensor data'],
  },
  {
    name: 'Innova 3100j',
    tagline: 'Handheld Standalone',
    price: '$59.99',
    rating: 4.6,
    reviews: '18K',
    description: 'Standalone scanner with a built-in screen — no phone needed. Reads and clears codes, checks battery and alternator health. Great for the garage.',
    badge: 'No Phone Needed',
    badgeColor: 'bg-amber-500',
    accentColor: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    link: 'https://www.amazon.com/s?k=Innova+3100j+OBD2+scanner',
    pros: ['No app required','Battery test','Built-in screen'],
  },
  {
    name: 'Innova 5610 Pro',
    tagline: 'Pro Mechanics',
    price: '$329.99',
    rating: 4.8,
    reviews: '9K',
    description: 'Professional-grade OBD2 scanner with bidirectional control and reset functions. Can perform active tests and reset service lights on most makes.',
    badge: 'Pro Grade',
    badgeColor: 'bg-purple-500',
    accentColor: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    link: 'https://www.amazon.com/s?k=Innova+5610+Pro+OBD2',
    pros: ['Bidirectional control','Service resets','All systems'],
  },
];

const RecommendedTools: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Under $20', 'Under $100', 'Pro'];

  const filtered = TOOLS.filter(t => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Under $20') return parseFloat(t.price.replace('$','').replace(',','')) < 20;
    if (activeFilter === 'Under $100') return parseFloat(t.price.replace('$','').replace(',','')) < 100;
    if (activeFilter === 'Pro') return t.tagline.includes('Pro') || t.tagline.includes('Mechanic');
    return true;
  });

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={10} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-5 pb-4 pt-safe" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-slate-700 active:scale-90 transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">Recommended Tools</h1>
            <p className="text-xs text-slate-400 font-medium">Curated selection of the best scanners</p>
          </div>
        </div>
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mx-5 mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-1.5 bg-indigo-600 rounded-lg shrink-0"><Shield size={14} className="text-white" /></div>
        <div>
          <p className="text-xs font-black text-slate-900 mb-0.5">Not paid recommendations</p>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">These are curated picks based on community reviews. Amazon affiliate links — prices may vary.</p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="px-5 mt-5 space-y-4">
        {filtered.map((tool, i) => (
          <div key={i} className={`bg-white rounded-3xl border overflow-hidden shadow-sm ${tool.accentColor}`}>
            {/* Card header band */}
            <div className={`${tool.iconBg} px-6 py-4 flex items-center justify-between border-b ${tool.accentColor.split(' ')[1]}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tool.iconBg}`}>
                  <Cpu size={20} className={tool.iconColor} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{tool.name}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${tool.iconColor}`}>{tool.tagline}</p>
                </div>
              </div>
              <span className={`${tool.badgeColor} text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider`}>
                {tool.badge}
              </span>
            </div>

            <div className="p-6">
              {/* Rating + Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {renderStars(tool.rating)}
                  <span className="text-xs font-bold text-slate-500">{tool.rating} · {tool.reviews} reviews</span>
                </div>
                <span className={`text-lg font-black ${tool.iconColor}`}>{tool.price}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">{tool.description}</p>

              {/* Pros */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tool.pros.map((p, j) => (
                  <span key={j} className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                    <Zap size={8} className={tool.iconColor} />{p}
                  </span>
                ))}
              </div>

              {/* Buy button */}
              <a href={tool.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-[0.97] transition-all">
                <ShoppingCart size={16} />
                Buy on Amazon
                <ExternalLink size={12} className="opacity-60" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-slate-400 font-medium px-8 mt-6 mb-4">
        Prices are approximate and may vary. Always verify before purchasing.
      </p>
    </div>
  );
};

export default RecommendedTools;
