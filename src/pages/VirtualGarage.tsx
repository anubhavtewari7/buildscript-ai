import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle, SubscriptionTier } from '../types';
import {
  ArrowLeft, Zap, TrendingUp, X, ShoppingCart, ExternalLink, AlertTriangle, CheckSquare, Square,
  Settings2, Activity, ChevronRight, Lock, Crown,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Mod {
  id: string;
  name: string;
  hpMin: number; hpMax: number;
  tqMin: number; tqMax: number;
  cost: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  overview: string;
  parts: { name: string; price: string; link: string }[];
  tools: string[];
  steps: { title: string; desc: string }[];
}

// ─── Mod Database ─────────────────────────────────────────────────────────────
const MODS_TURBO: Mod[] = [
  {
    id: 'stage1-tune', name: 'Stage 1 ECU Tune', hpMin: 40, hpMax: 80, tqMin: 50, tqMax: 90,
    cost: '$800-$1,500', difficulty: 'Beginner', time: '30 Minutes',
    overview: 'An ECU Tune is like updating the operating system of your car. The factory detunes engines for fuel economy or insurance reasons. A Stage 1 tune optimizes the software to safely increase boost and timing, unlocking free horsepower without getting your hands dirty.',
    parts: [{ name: 'COBB Accessport V3', price: '$675.00', link: 'https://www.amazon.com/s?k=COBB+Accessport+V3' }, { name: 'Battery Charger', price: '$45.00', link: 'https://www.amazon.com/s?k=car+battery+charger' }],
    tools: ['OBD-II Tuner (The Device)', 'Battery Charger (Highly Recommended)'],
    steps: [
      { title: 'Hook Up Power', desc: 'Flashing the computer takes 10-20 minutes, and the ignition must be ON (engine off). If your battery dies during this, it can brick your car\'s computer. Connect a battery charger to your car battery terminals just to be safe.' },
      { title: 'Plug It In', desc: 'Locate the OBD-II port. It\'s almost always under the driver\'s side dashboard, near where your knees would be. Plug the tuning device cable into this port.' },
      { title: 'Save Your Stock File', desc: 'Turn the ignition key two clicks to "ON" (dash lights on, engine off). The device will wake up. Select "Install" → "Save Stock Map". This backs up your car\'s original brain so you can always revert later.' },
      { title: 'Choose Your Tune', desc: 'Choose the map that matches your fuel (91 or 93 Octane). The device will upload the new data.' },
      { title: 'Flash the Car', desc: 'Press OK to begin. You will see progress bars. Lights on the dash might flash and warnings might beep — this is normal. Do not unplug the device or turn off the key.' },
      { title: 'Finish Up', desc: 'When it says "Success", turn the ignition OFF. Wait 10 seconds. Unplug the device. Start the car and take it for a drive to feel the difference!' },
    ],
  },
  {
    id: 'intake', name: 'Carbon Fiber Intake', hpMin: 10, hpMax: 20, tqMin: 8, tqMax: 15,
    cost: '$600-$1,200', difficulty: 'Beginner', time: '45 Minutes',
    overview: 'A performance intake replaces the restrictive factory air box with a high-flow filter and wider tubing. More air means better combustion. The carbon fiber version also looks incredible under the hood.',
    parts: [{ name: 'AFE Momentum Carbon Fiber Intake', price: '$650.00', link: 'https://www.amazon.com/s?k=AFE+carbon+fiber+intake' }, { name: 'Intake Silicone Couplers', price: '$35.00', link: 'https://www.amazon.com/s?k=intake+silicone+coupler' }],
    tools: ['Flat-head screwdriver', '10mm socket', 'Pliers'],
    steps: [
      { title: 'Disconnect Battery', desc: 'Always disconnect the negative battery terminal before working near the intake. Safety first.' },
      { title: 'Remove Airbox', desc: 'Unclip the factory air box lid, disconnect the MAF sensor connector, and loosen the clamp connecting the airbox to the throttle body.' },
      { title: 'Pull Out Stock Box', desc: 'Remove all mounting hardware and lift out the entire factory air box assembly.' },
      { title: 'Install New Intake', desc: 'Mount the new intake tube using the provided hardware. Make sure it aligns with the throttle body and MAF sensor positions.' },
      { title: 'Connect MAF Sensor', desc: 'Plug in your MAF sensor to the new intake. Tighten all clamps — no boost leaks!' },
      { title: 'Reconnect Battery & Test', desc: 'Reconnect battery, start the car, and let it idle for 5 minutes. Check for any air leaks (hissing noise). Clear any MAF codes if present.' },
    ],
  },
  {
    id: 'intercooler', name: 'Performance Intercooler', hpMin: 15, hpMax: 25, tqMin: 12, tqMax: 20,
    cost: '$900-$1,600', difficulty: 'Intermediate', time: '3 Hours',
    overview: 'The factory intercooler gets heat-soaked quickly under hard driving, causing power drops. An upgraded unit keeps intake temps lower for longer, giving you consistent power especially on back-to-back runs.',
    parts: [{ name: 'Wagner Competition Intercooler', price: '$1,100.00', link: 'https://www.amazon.com/s?k=wagner+intercooler' }, { name: 'Intercooler Silicone Hose Kit', price: '$150.00', link: 'https://www.amazon.com/s?k=intercooler+hose+kit' }],
    tools: ['Socket set (8mm-17mm)', 'Torx T25', 'Flat screwdriver', 'Torque wrench'],
    steps: [
      { title: 'Cool Engine Down', desc: 'Work only on a fully cold engine. Hot coolant under pressure is dangerous.' },
      { title: 'Remove Front Bumper', desc: 'The intercooler is behind the front bumper. Remove the splash guards and lower the front fascia to access it.' },
      { title: 'Disconnect Charge Pipes', desc: 'Loosen the hose clamps on both sides of the intercooler and disconnect the intake and outlet charge pipes.' },
      { title: 'Remove Stock Intercooler', desc: 'Unbolt the intercooler mounting brackets and slide out the stock unit.' },
      { title: 'Install Upgrade', desc: 'Position the new intercooler, bolt in the brackets, and connect the silicone hoses. Torque to spec.' },
      { title: 'Reassemble & Check for Leaks', desc: 'Reinstall bumper, start car, and boost it gently. Listen for air leaks at all charge pipe connections.' },
    ],
  },
  {
    id: 'downpipe', name: 'High-Flow Downpipe', hpMin: 20, hpMax: 30, tqMin: 18, tqMax: 25,
    cost: '$800-$1,500', difficulty: 'Intermediate', time: '2 Hours',
    overview: 'The downpipe connects the turbo to the exhaust system. The factory unit has a restrictive catalytic converter right at the turbo outlet. A high-flow unit lets exhaust gases escape faster, reducing turbo lag and increasing power.',
    parts: [{ name: '3" High-Flow Catted Downpipe', price: '$550.00', link: 'https://www.amazon.com/s?k=high+flow+downpipe+catted' }, { name: 'Downpipe Gaskets', price: '$25.00', link: 'https://www.amazon.com/s?k=downpipe+gasket' }],
    tools: ['Socket set', '17mm wrench', 'Penetrating oil', 'Jack stands', 'Heat shield'],
    steps: [
      { title: 'Soak Bolts', desc: 'Spray penetrating oil on all downpipe flange bolts a day before. They are often seized from heat.' },
      { title: 'Raise & Support Vehicle', desc: 'Jack up the front of the car and support on stands. You need clearance under the car.' },
      { title: 'Remove Heat Shields', desc: 'Remove the heat shields near the turbo outlet to access the downpipe flange.' },
      { title: 'Unbolt Stock Downpipe', desc: 'Remove the flange bolts at both ends (turbo outlet and midpipe connection). Use an impact gun if available.' },
      { title: 'Install New Downpipe', desc: 'Use new gaskets on both flanges, insert the new downpipe, and hand-tighten all bolts before torquing to spec.' },
      { title: 'Clear Codes', desc: 'The new downpipe may trigger a cat efficiency code (P0420). Clear it with an OBD scanner after a few heat cycles.' },
    ],
  },
  {
    id: 'exhaust', name: 'Valved Exhaust System', hpMin: 15, hpMax: 30, tqMin: 10, tqMax: 20,
    cost: '$2,500-$5,000', difficulty: 'Intermediate', time: '3 Hours',
    overview: 'A cat-back exhaust replaces everything from the catalytic converter back. Valved systems let you switch between quiet (daily mode) and aggressive (track mode) at the push of a button.',
    parts: [{ name: 'Akrapovic Evolution Exhaust', price: '$3,200.00', link: 'https://www.amazon.com/s?k=Akrapovic+exhaust' }, { name: 'Exhaust Hangers', price: '$40.00', link: 'https://www.amazon.com/s?k=exhaust+hangers' }],
    tools: ['Socket set', 'Exhaust hanger pliers', 'Jack and stands', 'Penetrating oil'],
    steps: [
      { title: 'Raise Vehicle', desc: 'Lift the car and support it on all four corners to access the entire underside exhaust run.' },
      { title: 'Soak All Clamps', desc: 'Apply penetrating oil to all exhaust clamps and flex pipe connections. Wait 15 minutes.' },
      { title: 'Remove Rear Section First', desc: 'Work from the back. Pop off the rubber exhaust hangers (pry them off with a screwdriver or hanger pliers). Remove mufflers.' },
      { title: 'Remove Midpipe', desc: 'Disconnect the midpipe from the catalytic converter outlet. This is usually the tightest connection.' },
      { title: 'Install New System', desc: 'Hang the new exhaust using the provided hangers. Connect from front to back, leaving all clamps loose until everything is aligned.' },
      { title: 'Align & Torque', desc: 'With everything hung, adjust so tips are centered. Tighten all clamps and check clearance from the floor, fuel tank, and spare tire well.' },
    ],
  },
];

const MODS_NA: Mod[] = [
  {
    id: 'cai', name: 'Cold Air Intake', hpMin: 5, hpMax: 15, tqMin: 4, tqMax: 10,
    cost: '$200-$500', difficulty: 'Beginner', time: '30 Minutes',
    overview: 'Draws cooler outside air into the engine instead of the warm underhood air. More dense, cooler air = better combustion = small HP gain and better throttle response.',
    parts: [{ name: 'K&N Cold Air Intake', price: '$280.00', link: 'https://www.amazon.com/s?k=K%26N+cold+air+intake' }],
    tools: ['Screwdrivers','Socket set'],
    steps: [
      { title: 'Remove Stock Airbox', desc: 'Disconnect the IAT sensor and MAF sensor, then remove the factory air box.' },
      { title: 'Install Cold Air Tube', desc: 'Route the new intake tube from the throttle body down toward the front of the engine bay for cooler air.' },
      { title: 'Mount Filter', desc: 'Connect the high-flow filter at the end of the tube, routing it below the headlight for coldest air.' },
      { title: 'Reconnect Sensors', desc: 'Plug in MAF and IAT sensors. Tighten all clamps and test drive.' },
    ],
  },
  {
    id: 'headers', name: 'Performance Headers', hpMin: 15, hpMax: 30, tqMin: 12, tqMax: 22,
    cost: '$400-$1,200', difficulty: 'Advanced', time: '4 Hours',
    overview: 'Replace the factory exhaust manifolds with equal-length headers that allow exhaust gases to exit each cylinder at the same rate, dramatically improving scavenging efficiency.',
    parts: [{ name: 'Long-Tube Headers', price: '$600.00', link: 'https://www.amazon.com/s?k=long+tube+headers' }, { name: 'Header Gaskets', price: '$40.00', link: 'https://www.amazon.com/s?k=exhaust+header+gaskets' }],
    tools: ['Socket set', 'Breaker bar', 'Header torque wrench', 'Jack stands'],
    steps: [
      { title: 'Soak Exhaust Manifold Bolts', desc: 'Let penetrating oil sit overnight on all manifold-to-head bolts. They may require a breaker bar.' },
      { title: 'Remove O2 Sensors', desc: 'Unscrew all O2 sensors from the factory manifolds and set aside.' },
      { title: 'Remove Factory Manifold', desc: 'With the engine cold, remove all manifold bolts and pull the manifolds out.' },
      { title: 'Install Headers', desc: 'Use new gaskets, carefully position headers, and thread in all bolts by hand before torquing in a star pattern to spec.' },
      { title: 'Reinstall O2 Sensors', desc: 'Transfer O2 sensors to the new headers.' },
      { title: 'Heat Cycle', desc: 'Start car and let it reach operating temp. Check for leaks at all gasket surfaces.' },
    ],
  },
  {
    id: 'exhaust-na', name: 'Cat-Back Exhaust', hpMin: 10, hpMax: 20, tqMin: 8, tqMax: 15,
    cost: '$600-$1,800', difficulty: 'Intermediate', time: '2 Hours',
    overview: 'Replaces the factory exhaust from the catalytic converter back with larger diameter piping and a performance muffler for better flow, sound, and a small power increase.',
    parts: [{ name: 'Borla Cat-Back Exhaust', price: '$900.00', link: 'https://www.amazon.com/s?k=Borla+cat-back+exhaust' }],
    tools: ['Socket set', 'Exhaust hanger pliers', 'Penetrating oil', 'Jack stands'],
    steps: [
      { title: 'Raise Vehicle', desc: 'Safely jack up the car and support it on stands.' },
      { title: 'Remove Old Exhaust', desc: 'Pop off rubber hangers, disconnect at the midpipe flex point, and slide out the old cat-back.' },
      { title: 'Install New Cat-Back', desc: 'Slide in the new exhaust and hand-attach all hangers before tightening any clamps.' },
      { title: 'Align Tips', desc: 'Adjust so the tips are centered in the rear bumper cutouts, then torque clamps.' },
    ],
  },
  {
    id: 'cam', name: 'Performance Camshafts', hpMin: 25, hpMax: 50, tqMin: 15, tqMax: 30,
    cost: '$1,200-$3,000', difficulty: 'Advanced', time: '8 Hours',
    overview: 'Aftermarket camshafts with increased lift and duration allow more air/fuel mixture into the cylinders, unlocking significant power gains. Best combined with other bolt-on mods.',
    parts: [{ name: 'Comp Cams Stage 2 Camshafts', price: '$800.00', link: 'https://www.amazon.com/s?k=comp+cams+performance' }, { name: 'Cam Phaser Lock', price: '$120.00', link: 'https://www.amazon.com/s?k=cam+phaser+lock' }],
    tools: ['Cam phaser tool', 'Torque wrench', 'Socket set', 'Valve spring compressor'],
    steps: [
      { title: 'Remove Valve Covers', desc: 'Remove all valve cover bolts and lift off the covers. Clean all old gasket material.' },
      { title: 'Lock Timing', desc: 'Set the engine to TDC on cylinder 1 and lock the cam phasers to prevent movement.' },
      { title: 'Remove Old Cams', desc: 'Loosen cam bearing caps in sequence per the factory service manual to avoid warping.' },
      { title: 'Install New Cams', desc: 'Lubricate new cam lobes with assembly lube and install in correct position per timing marks.' },
      { title: 'Reinstall & Torque', desc: 'Replace bearing caps in reverse sequence, torquing to spec.' },
      { title: 'Verify Timing', desc: 'Triple-check all timing marks before starting. One tooth off will cause serious engine damage.' },
    ],
  },
];

const MODS_EV: Mod[] = [
  {
    id: 'suspension', name: 'Coilover Suspension', hpMin: 0, hpMax: 0, tqMin: 0, tqMax: 0,
    cost: '$1,200-$3,000', difficulty: 'Intermediate', time: '4 Hours',
    overview: 'Lower the center of gravity and improve cornering with adjustable coilovers. Better handling makes your EV feel more connected to the road, and you can tune the ride height and stiffness.',
    parts: [{ name: 'BC Racing BR Series Coilovers', price: '$1,600.00', link: 'https://www.amazon.com/s?k=BC+Racing+coilovers' }],
    tools: ['Jack and stands', 'Spring compressor', 'Socket set', 'Torque wrench'],
    steps: [
      { title: 'Raise Vehicle', desc: 'Safely lift and support the car. Work one corner at a time.' },
      { title: 'Remove Wheel', desc: 'Remove the wheel to access the suspension strut assembly.' },
      { title: 'Disconnect Sway Bar', desc: 'Disconnect the sway bar end link from the strut to give clearance.' },
      { title: 'Remove Strut Assembly', desc: 'Unbolt the top strut mounts and the bottom pinch bolt, then pull out the entire assembly.' },
      { title: 'Install Coilover', desc: 'Set your desired ride height on the coilover before installation. Insert and torque all mounting points.' },
      { title: 'Alignment Required', desc: 'After installing coilovers, a 4-wheel alignment is mandatory. Budget $80-150 for this.' },
    ],
  },
  {
    id: 'brakes', name: 'Big Brake Kit', hpMin: 0, hpMax: 0, tqMin: 0, tqMax: 0,
    cost: '$2,000-$5,000', difficulty: 'Advanced', time: '4 Hours',
    overview: 'Larger rotors and calipers dramatically improve stopping power and heat resistance. Essential if you plan to track your EV.',
    parts: [{ name: 'Brembo Performance Brake Kit', price: '$2,800.00', link: 'https://www.amazon.com/s?k=Brembo+performance+brake+kit' }],
    tools: ['Brake caliper tool', 'Socket set', 'Torque wrench', 'Brake line wrench'],
    steps: [
      { title: 'Remove Wheels', desc: 'Take off all four wheels.' },
      { title: 'Remove Old Calipers & Rotors', desc: 'Unbolt calipers, slide off rotors. Hang calipers with wire — never let them hang by the brake hose.' },
      { title: 'Install New Rotors', desc: 'Slide on the larger rotors. The kit includes brackets for the new caliper spacing.' },
      { title: 'Install Caliper Brackets', desc: 'Mount the new caliper mounting brackets — these space the larger calipers correctly.' },
      { title: 'Install New Calipers', desc: 'Bolt on the new calipers and bleed the brakes thoroughly to remove all air.' },
      { title: 'Bed the Brakes', desc: '10 stops from 60mph to 10mph with 30 seconds between each. This seats the pads to the new rotors.' },
    ],
  },
  {
    id: 'tires', name: 'Performance Tire Upgrade', hpMin: 0, hpMax: 0, tqMin: 0, tqMax: 0,
    cost: '$800-$2,000', difficulty: 'Beginner', time: '1 Hour',
    overview: 'Tires are the single most impactful upgrade for an EV. A stickier tire translates the instant torque to the ground, dramatically improving 0-60 and cornering grip.',
    parts: [{ name: 'Michelin Pilot Sport 4S (set of 4)', price: '$1,200.00', link: 'https://www.amazon.com/s?k=Michelin+Pilot+Sport+4S' }],
    tools: ['None — have a shop mount and balance them'],
    steps: [
      { title: 'Choose the Right Size', desc: 'Verify your wheel size and consult the manufacturer\'s spec sheet. Wider tires improve grip but can affect range.' },
      { title: 'Order Tires', desc: 'Have tires shipped to a local shop for mounting, or order directly through a tire shop.' },
      { title: 'Mount & Balance', desc: 'Have the shop mount and balance the tires on your existing wheels.' },
      { title: 'Enjoy Grip', desc: 'EV performance tires can transform the driving experience. Allow 200 miles of gentle driving to heat-cycle the compound.' },
    ],
  },
];

const getMods = (vehicle: { make: string; fuelType?: string }): Mod[] => {
  const ft = vehicle.fuelType || 'gas';
  if (ft === 'electric') return MODS_EV;
  const turboBrands = ['BMW','Audi','Volkswagen','Ford','Subaru','Mitsubishi','Volvo','Cadillac','Buick','Chevrolet'];
  const isTurbo = turboBrands.some(b => vehicle.make?.toLowerCase().includes(b.toLowerCase()));
  return isTurbo ? MODS_TURBO : MODS_NA;
};

// ─── Stock specs estimator ─────────────────────────────────────────────────────
const estimateStockSpecs = (make: string, model: string, year: number) => {
  const m = make.toLowerCase();
  const mo = model.toLowerCase();
  if (m.includes('bmw')) { if (mo.includes('m3') || mo.includes('m4')) return { hp: 503, tq: 479, weight: 3600, zero60: 3.5, quarter: 11.9 }; if (mo.includes('335') || mo.includes('340')) return { hp: 320, tq: 330, weight: 3600, zero60: 4.6, quarter: 13.2 }; return { hp: 248, tq: 258, weight: 3550, zero60: 5.3, quarter: 13.9 }; }
  if (m.includes('subaru') && (mo.includes('wrx') || mo.includes('sti'))) return { hp: mo.includes('sti') ? 310 : 271, tq: mo.includes('sti') ? 290 : 258, weight: 3300, zero60: mo.includes('sti') ? 4.7 : 5.1, quarter: mo.includes('sti') ? 13.3 : 13.7 };
  if (m.includes('ford') && mo.includes('mustang')) { if (mo.includes('gt500')) return { hp: 760, tq: 625, weight: 4000, zero60: 3.3, quarter: 11.4 }; return { hp: 450, tq: 420, weight: 3830, zero60: 4.2, quarter: 12.4 }; }
  if (m.includes('chevrolet') && (mo.includes('corvette') || mo.includes('camaro'))) return { hp: mo.includes('z06') ? 650 : 455, tq: mo.includes('z06') ? 650 : 455, weight: 3400, zero60: mo.includes('z06') ? 2.9 : 4.0, quarter: mo.includes('z06') ? 10.6 : 12.1 };
  if (m.includes('honda') && mo.includes('civic')) return { hp: mo.includes('type') ? 315 : 158, tq: mo.includes('type') ? 310 : 138, weight: 2800, zero60: mo.includes('type') ? 4.9 : 8.2, quarter: mo.includes('type') ? 13.4 : 16.1 };
  if (m.includes('toyota') && mo.includes('supra')) return { hp: 382, tq: 368, weight: 3400, zero60: 4.1, quarter: 12.6 };
  if (m.includes('tesla')) { if (mo.includes('model s') || mo.includes('plaid')) return { hp: 1020, tq: 1050, weight: 4600, zero60: 1.99, quarter: 9.2 }; return { hp: 670, tq: 700, weight: 4600, zero60: 3.1, quarter: 11.5 }; }
  return { hp: 250, tq: 250, weight: 3400, zero60: 6.2, quarter: 14.8 };
};

// ─── Car SVG ──────────────────────────────────────────────────────────────────
const Car3DModel: React.FC<{ make: string; color: string }> = ({ make, color }) => (
  <div className="relative w-full h-48 flex items-center justify-center overflow-hidden" style={{ perspective: '800px' }}>
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full blur-2xl" style={{ background: color + '40' }} />
    </div>
    <div style={{ transform: 'rotateY(-12deg) rotateX(4deg)', transformStyle: 'preserve-3d', transition: 'transform 0.5s ease' }}>
      <svg viewBox="0 0 400 180" className="w-72 h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <path d="M60 120 L60 100 Q65 80 100 70 L140 50 Q170 35 220 32 Q270 30 300 45 L340 65 Q360 75 368 90 L375 120 Z" fill={color} opacity="0.9" />
        {/* Roof */}
        <path d="M130 70 L155 48 Q175 35 215 32 Q255 30 280 42 L310 60 L300 70 Z" fill={color} opacity="0.7" />
        {/* Windows */}
        <path d="M155 68 L165 52 Q180 40 210 38 Q240 36 260 44 L275 55 L270 68 Z" fill="#1e293b" opacity="0.8" />
        <path d="M278 68 L280 55 L310 62 L308 68 Z" fill="#1e293b" opacity="0.7" />
        {/* Accent line */}
        <path d="M80 100 L340 100" stroke={color} strokeWidth="1.5" opacity="0.4" />
        {/* Underbody */}
        <rect x="60" y="120" width="315" height="12" rx="4" fill={color} opacity="0.5" />
        {/* Front wheel */}
        <circle cx="130" cy="135" r="22" fill="#1e293b" />
        <circle cx="130" cy="135" r="14" fill="#334155" />
        <circle cx="130" cy="135" r="6" fill={color} opacity="0.6" />
        {/* Rear wheel */}
        <circle cx="300" cy="135" r="22" fill="#1e293b" />
        <circle cx="300" cy="135" r="14" fill="#334155" />
        <circle cx="300" cy="135" r="6" fill={color} opacity="0.6" />
        {/* Headlight */}
        <ellipse cx="368" cy="98" rx="8" ry="6" fill="#93c5fd" opacity="0.6" />
        <ellipse cx="368" cy="98" rx="4" ry="3" fill="white" opacity="0.5" />
        {/* Taillight */}
        <rect x="62" y="92" width="10" height="12" rx="2" fill="#ef4444" opacity="0.7" />
        {/* Grill */}
        <path d="M362 105 L375 105 L375 115 L362 115 Z" fill="#0f172a" opacity="0.5" />
        {/* Door lines */}
        <line x1="195" y1="72" x2="185" y2="120" stroke="white" strokeWidth="0.8" opacity="0.15" />
        <line x1="255" y1="72" x2="250" y2="120" stroke="white" strokeWidth="0.8" opacity="0.15" />
      </svg>
    </div>
    <div className="absolute bottom-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">3D Vehicle Model</div>
  </div>
);

// ─── Dyno Chart Data ──────────────────────────────────────────────────────────
const buildDynoData = (peakHp: number, peakTq: number) => {
  const rpms = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000];
  return rpms.map(rpm => {
    const hpPct = Math.min(1, Math.pow(rpm / 6500, 0.7));
    const tqPct = rpm < 3500 ? Math.min(1, rpm / 2800) : Math.max(0.6, 1 - (rpm - 3500) / 8000);
    return { rpm, hp: Math.round(peakHp * hpPct), tq: Math.round(peakTq * tqPct) };
  });
};

// ─── Main Component ────────────────────────────────────────────────────────────
interface VirtualGarageProps {
  vehicle: Vehicle;
  subscriptionTier: SubscriptionTier;
}

type GView = 'select' | 'garage' | 'guide';

const VirtualGarage: React.FC<VirtualGarageProps> = ({ vehicle: defaultVehicle, subscriptionTier }) => {
  const navigate = useNavigate();
  const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'premium';

  const [view, setView] = useState<GView>('select');
  const [garageVehicle, setGarageVehicle] = useState({ year: defaultVehicle.year.toString(), make: defaultVehicle.make, model: defaultVehicle.model });
  const [selectedMods, setSelectedMods] = useState<Set<string>>(new Set());
  const [showDyno, setShowDyno] = useState(false);
  const [showSimulate, setShowSimulate] = useState(false);
  const [activeMod, setActiveMod] = useState<Mod | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [carColor] = useState('#3b82f6');

  const stockSpecs = useMemo(() => estimateStockSpecs(garageVehicle.make, garageVehicle.model, parseInt(garageVehicle.year) || 2020), [garageVehicle]);
  const mods = useMemo(() => getMods({ make: garageVehicle.make, fuelType: defaultVehicle.fuelType }), [garageVehicle, defaultVehicle.fuelType]);
  const dynoData = useMemo(() => buildDynoData(stockSpecs.hp, stockSpecs.tq), [stockSpecs]);

  const totalHpGain = useMemo(() => Array.from(selectedMods).reduce((acc, id) => { const m = mods.find(m => m.id === id); return acc + (m ? Math.round((m.hpMin + m.hpMax) / 2) : 0); }, 0), [selectedMods, mods]);
  const totalTqGain = useMemo(() => Array.from(selectedMods).reduce((acc, id) => { const m = mods.find(m => m.id === id); return acc + (m ? Math.round((m.tqMin + m.tqMax) / 2) : 0); }, 0), [selectedMods, mods]);

  const projHp = stockSpecs.hp + totalHpGain;
  const projTq = stockSpecs.tq + totalTqGain;
  const projZero60 = Math.max(1.9, stockSpecs.zero60 - (totalHpGain / 80));
  const projQuarter = Math.max(9.0, stockSpecs.quarter - (totalHpGain / 70));

  const toggleMod = (id: string) => setSelectedMods(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const inputCls = 'bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all';

  // ── Premium gate ───────────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-8 text-center pb-24">
        <div className="w-16 h-16 bg-indigo-900/50 rounded-3xl flex items-center justify-center mb-6 border border-indigo-700/50">
          <Lock size={28} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Virtual Garage</h2>
        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-[280px]">
          Unlock the full Virtual Garage — build simulation, dyno charts, and step-by-step guides for your exact car.
        </p>
        <button onClick={() => navigate('/profile?plans=1')} className="bg-indigo-600 text-white py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-indigo-900/40 active:scale-95 transition-all">
          <Crown size={16} /> Upgrade to Unlock
        </button>
      </div>
    );
  }

  // ── Select Vehicle ─────────────────────────────────────────────────────────
  if (view === 'select') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Settings2 size={28} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Select Project Vehicle</h2>
            <p className="text-slate-400 text-sm font-medium">Choose the car you want to work on in your Virtual Garage.</p>
          </div>
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400 text-sm">🚗</span>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Vehicle Details</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="Year" value={garageVehicle.year} onChange={e => setGarageVehicle(v => ({...v, year: e.target.value}))} className={inputCls} />
              <input type="text" placeholder="Make" value={garageVehicle.make} onChange={e => setGarageVehicle(v => ({...v, make: e.target.value}))} className={inputCls} />
              <input type="text" placeholder="Model" value={garageVehicle.model} onChange={e => setGarageVehicle(v => ({...v, model: e.target.value}))} className={inputCls} />
            </div>
            <button onClick={() => setView('garage')} disabled={!garageVehicle.make || !garageVehicle.model}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 transition-all active:scale-[0.97] mt-2">
              Enter Garage <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Build Guide ────────────────────────────────────────────────────────────
  if (view === 'guide' && activeMod) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pb-24">
        {/* Header accent */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <div className="px-6 pt-safe pt-5 pb-6" style={{ paddingTop: 'max(20px, env(safe-area-inset-top, 20px))' }}>
            <button onClick={() => { setView('garage'); setCheckedSteps(new Set()); }} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 active:scale-90 transition-all">
              <ArrowLeft size={18} /><span className="text-xs font-bold uppercase tracking-wider">Back to Garage</span>
            </button>
            <h1 className="text-2xl font-black text-white leading-tight mb-1">{activeMod.name} Build Guide</h1>
            <p className="text-blue-400 text-xs font-semibold mb-4">For {garageVehicle.year} {garageVehicle.make} {garageVehicle.model}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <span className="text-emerald-400">⏱</span> Estimated Time: {activeMod.time}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <span className="text-amber-400">🔧</span> Difficulty: {activeMod.difficulty}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Overview */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h3 className="font-black text-white text-sm mb-3">Overview</h3>
            <div className="w-full h-px bg-slate-800 mb-3" />
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{activeMod.overview}</p>
          </div>

          {/* Parts Required */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={16} className="text-slate-400" />
              <h3 className="font-black text-white text-sm">Parts Required</h3>
            </div>
            <div className="w-full h-px bg-slate-800 mb-3" />
            {activeMod.parts.map((p, i) => (
              <div key={i} className={`flex items-center justify-between py-3 ${i < activeMod.parts.length - 1 ? 'border-b border-slate-800' : ''}`}>
                <div>
                  <p className="font-black text-white text-sm">{p.name}</p>
                  <p className="text-amber-400 text-xs font-bold">{p.price}</p>
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors">
                  Buy Now <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-400">🔧</span>
              <h3 className="font-black text-white text-sm">Tools Needed</h3>
            </div>
            <div className="w-full h-px bg-slate-800 mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {activeMod.tools.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 mt-0.5">•</span>
                  <span className="text-xs text-slate-400 font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-5 pt-5 pb-3">
              <h3 className="font-black text-white text-sm">Installation Instructions</h3>
            </div>
            {/* Disclaimer */}
            <div className="mx-5 mb-4 bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-300 font-semibold leading-relaxed">
                <span className="font-black">Disclaimer:</span> This is a generic guide. Always consult your vehicle's service manual and the instructions that came with your parts. Safety is your responsibility.
              </p>
            </div>
            <div className="px-5 pb-5 space-y-4">
              {activeMod.steps.map((step, i) => {
                const done = checkedSteps.has(i);
                return (
                  <div key={i} className={`flex gap-4 transition-opacity ${done ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 font-black text-blue-400 text-sm">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-black text-sm mb-1 ${done ? 'line-through text-slate-600' : 'text-white'}`}>{step.title}</p>
                        <button onClick={() => setCheckedSteps(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })} className="mt-0.5 shrink-0">
                          {done ? <CheckSquare size={18} className="text-emerald-400" /> : <Square size={18} className="text-slate-600" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Garage ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="px-5 pt-safe pb-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <div className="flex items-start justify-between mb-3 pt-2">
          <div>
            <h1 className="text-2xl font-black" style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Virtual Garage
            </h1>
            <p className="text-slate-400 text-xs font-medium">{garageVehicle.year} {garageVehicle.make} {garageVehicle.model}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('select')} className="bg-slate-800 border border-slate-700 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl active:scale-90 transition-all">
              Change Car
            </button>
            <button onClick={() => setShowDyno(true)} className="bg-slate-800 border border-slate-700 text-[10px] font-black uppercase px-3 py-2 rounded-xl flex items-center gap-1.5 active:scale-90 transition-all">
              <Activity size={12} className="text-blue-400" /> Stock Dyno
            </button>
          </div>
        </div>
      </div>

      {/* 3D Car */}
      <div className="mx-5 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-4">
        <Car3DModel make={garageVehicle.make} color={carColor} />
      </div>

      {/* Projected Performance */}
      <div className="mx-5 bg-slate-900 rounded-3xl p-5 border border-slate-800 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-emerald-400" />
          <h3 className="font-black text-white text-sm">Projected Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">Horsepower</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{projHp}</span>
              {totalHpGain > 0 && <span className="text-emerald-400 text-sm font-black">+{totalHpGain}</span>}
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">Torque</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{projTq}</span>
              {totalTqGain > 0 && <span className="text-emerald-400 text-sm font-black">+{totalTqGain}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Available Mods */}
      <div className="mx-5 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
          <Settings2 size={16} className="text-slate-400" />
          <h3 className="font-black text-white text-sm">Available Mods</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {mods.map(mod => {
            const selected = selectedMods.has(mod.id);
            return (
              <div key={mod.id} onClick={() => toggleMod(mod.id)}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all active:bg-slate-800/50 ${selected ? 'bg-blue-900/20 border-l-2 border-blue-500' : ''}`}>
                <div>
                  <p className={`font-black text-sm ${selected ? 'text-white' : 'text-slate-300'}`}>{mod.name}</p>
                  <p className="text-slate-500 text-xs font-medium">{mod.cost}</p>
                </div>
                <div className="flex items-center gap-3">
                  {mod.hpMin > 0 && (
                    <span className="text-xs font-black text-emerald-400">+{mod.hpMin}-{mod.hpMax} HP</span>
                  )}
                  <button onClick={e => { e.stopPropagation(); setActiveMod(mod); setView('guide'); setCheckedSteps(new Set()); }}
                    className="text-[9px] font-black text-blue-400 bg-blue-900/30 border border-blue-700/30 px-2 py-1 rounded-lg uppercase tracking-wider hover:bg-blue-800/40 transition-all">
                    Guide
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulate button */}
        {selectedMods.size > 0 && (
          <div className="px-5 pb-5 pt-3">
            <button onClick={() => setShowSimulate(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 active:scale-[0.97] transition-all">
              <Zap size={18} /> Simulate Build
            </button>
          </div>
        )}
      </div>

      {/* ── Dyno Modal ────────────────────────────────────────────────────── */}
      {showDyno && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDyno(false)}>
          <div className="bg-slate-900 w-full max-w-md rounded-t-3xl p-6 border-t border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-900/40 border border-blue-700/40 rounded-xl flex items-center justify-center">
                  <Activity size={16} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-black text-white">Stock Performance</h3>
                  <p className="text-slate-400 text-xs">{garageVehicle.year} {garageVehicle.make} {garageVehicle.model}</p>
                </div>
              </div>
              <button onClick={() => setShowDyno(false)} className="text-slate-500 p-1 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{ label: 'Horsepower', val: stockSpecs.hp, color: 'text-red-400' }, { label: 'Torque', val: stockSpecs.tq, color: 'text-blue-400' }, { label: 'Weight', val: `${stockSpecs.weight} lbs`, color: 'text-white' }].map(s => (
                <div key={s.label} className="bg-slate-800 rounded-2xl p-3 text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] font-bold text-slate-400">HP</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[10px] font-bold text-slate-400">TQ</span></div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={dynoData}>
                <defs>
                  <linearGradient id="hpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="rpm" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: 'white', fontSize: 11 }} />
                <Area type="monotone" dataKey="hp" stroke="#ef4444" fill="url(#hpGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="tq" stroke="#3b82f6" fill="url(#tqGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-center text-[9px] text-slate-600 font-medium mt-3">*Charts are simulated approximations based on factory specifications.</p>
          </div>
        </div>
      )}

      {/* ── Simulation Modal ──────────────────────────────────────────────── */}
      {showSimulate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-5">
          <div className="bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-blue-700/40 shadow-2xl shadow-blue-900/30">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap size={24} className="text-amber-400" />
              </div>
              <h3 className="font-black text-white text-lg">Simulation Complete</h3>
              <p className="text-slate-400 text-xs font-medium mt-1">Results for {selectedMods.size} mod{selectedMods.size > 1 ? 's' : ''} installed</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Horsepower', val: `${projHp}`, unit: 'HP', delta: `+${totalHpGain}.0 HP`, color: 'text-emerald-400' },
                { label: 'Torque', val: `${projTq}`, unit: 'lb-ft', delta: `+${totalTqGain}.0 lb-ft`, color: 'text-emerald-400' },
                { label: '0-60 mph', val: projZero60.toFixed(1), unit: 's', delta: `-${(stockSpecs.zero60 - projZero60).toFixed(1)} s`, color: 'text-emerald-400' },
                { label: '1/4 Mile', val: projQuarter.toFixed(1), unit: 's', delta: `-${(stockSpecs.quarter - projQuarter).toFixed(1)} s`, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800 rounded-2xl p-4">
                  <p className="text-slate-500 text-[10px] font-semibold mb-1">{s.label}</p>
                  <p className="text-white font-black text-2xl leading-none">{s.val} <span className="text-sm font-semibold text-slate-400">{s.unit}</span></p>
                  {totalHpGain > 0 && <p className={`text-xs font-black mt-1 ${s.color}`}>{s.delta}</p>}
                </div>
              ))}
            </div>
            <button onClick={() => { setShowSimulate(false); const first = mods.find(m => selectedMods.has(m.id)); if (first) { setActiveMod(first); setView('guide'); } }}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest mb-3 active:scale-[0.97] transition-all">
              Confirm and Start Build
            </button>
            <button onClick={() => setShowSimulate(false)}
              className="w-full border border-blue-500/40 text-blue-400 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-[0.97] transition-all">
              Close Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualGarage;
