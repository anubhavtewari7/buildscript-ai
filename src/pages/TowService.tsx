import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Truck, MapPin, Star, Phone, Navigation,
  CheckCircle, AlertTriangle, Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TowResult {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  opening_hours?: { open_now?: boolean };
  geometry: { location: { lat: number; lng: number } };
}

type PageStep = 'form' | 'locating' | 'results' | 'maps_opened' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDistanceMiles = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): string => {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 0.1 ? 'Nearby' : d < 1 ? `${(d * 5280).toFixed(0)} ft` : `${d.toFixed(1)} mi`;
};

const openMapsSearch = (lat: number, lng: number) => {
  window.open(
    `https://www.google.com/maps/search/towing+service/@${lat},${lng},13z`,
    '_blank',
  );
};

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all';

interface AAACardProps {
  compact?: boolean;
}
const AAACard: React.FC<AAACardProps> = ({ compact }) => (
  <div
    className={`bg-amber-950/60 border border-amber-700/50 rounded-2xl ${compact ? 'p-4' : 'p-5'} flex items-center gap-4`}
  >
    <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <Phone size={22} className="text-amber-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-black text-amber-300">AAA Roadside Assistance</p>
      <p className="text-xs text-amber-400/70 mt-0.5">AAA Member? Get priority help</p>
    </div>
    <a
      href="tel:18002224357"
      className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black px-3 py-2 rounded-xl transition-all"
    >
      Call Now
    </a>
  </div>
);

interface TowCardProps {
  result: TowResult;
  userLat: number;
  userLng: number;
}
const TowCard: React.FC<TowCardProps> = ({ result, userLat, userLng }) => {
  const isOpen = result.opening_hours?.open_now;
  const hasPhone = !!result.formatted_phone_number;
  const distance = getDistanceMiles(
    userLat,
    userLng,
    result.geometry.location.lat,
    result.geometry.location.lng,
  );

  const handleDirections = () => {
    const encoded = encodeURIComponent(result.vicinity);
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
      window.open(`maps://maps.apple.com/?daddr=${encoded}&dirflg=d`, '_blank');
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`,
        '_blank',
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
      {/* Row 1: name + open/closed */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-black text-white text-base leading-tight flex-1">{result.name}</h3>
        {result.opening_hours !== undefined && (
          <span
            className={`flex-shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full ${
              isOpen
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        )}
      </div>

      {/* Row 2: address */}
      <div className="flex items-start gap-1.5 text-slate-400">
        <MapPin size={13} className="mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-snug">{result.vicinity}</p>
      </div>

      {/* Row 3: rating + distance */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {result.rating !== undefined && (
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" fill="currentColor" />
            <span className="font-semibold text-slate-300">{result.rating.toFixed(1)}</span>
            {result.user_ratings_total !== undefined && (
              <span>({result.user_ratings_total.toLocaleString()} reviews)</span>
            )}
          </span>
        )}
        <span className="ml-auto font-semibold text-slate-300">{distance}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        {hasPhone ? (
          <a
            href={`tel:${result.formatted_phone_number!.replace(/\D/g, '')}`}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-black py-3 rounded-xl transition-all"
          >
            <Phone size={15} />
            Call Now
          </a>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 text-slate-500 text-sm font-black py-3 rounded-xl cursor-not-allowed"
          >
            <Phone size={15} />
            No number listed
          </button>
        )}
        <button
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-sm font-black py-3 rounded-xl transition-all"
        >
          <Navigation size={15} />
          Directions
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TowService: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locationNote, setLocationNote] = useState('');

  // Flow state
  const [step, setStep] = useState<PageStep>('form');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<TowResult[]>([]);
  const [gpsError, setGpsError] = useState('');

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  // ── API helpers ────────────────────────────────────────────────────────────

  const fetchPlaceDetails = async (
    placeId: string,
  ): Promise<Partial<TowResult>> => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,vicinity,rating,user_ratings_total,opening_hours,geometry&key=${MAPS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Places API error: ${res.status}`);
    const data = await res.json();
    if (data.status && data.status !== 'OK') return {};
    return data.result ?? {};
  };

  const fetchNearbyTowing = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=towing+roadside+assistance+tow+truck&key=${MAPS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Places API error: ${res.status}`);
    const data = await res.json();
    if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API status: ${data.status}`);
    }
    const topSix: TowResult[] = (data.results ?? []).slice(0, 6);

    // Enrich each with phone number from details endpoint
    const enriched = await Promise.all(
      topSix.map(async (place) => {
        try {
          const details = await fetchPlaceDetails(place.place_id);
          return { ...place, ...details } as TowResult;
        } catch {
          return place;
        }
      }),
    );

    return enriched;
  };

  // ── Main flow trigger ──────────────────────────────────────────────────────

  const handleFindTowing = () => {
    setStep('locating');
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported on this device. Please try on a mobile browser.');
      setStep('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        // If no API key or we expect CORS to fail on web, fall back immediately
        if (!MAPS_API_KEY) {
          openMapsSearch(lat, lng);
          setStep('maps_opened');
          return;
        }

        try {
          const towResults = await fetchNearbyTowing(lat, lng);
          setResults(towResults);
          setStep('results');
        } catch {
          // CORS / network failure → open Maps as fallback
          openMapsSearch(lat, lng);
          setStep('maps_opened');
        }
      },
      (err) => {
        let msg = 'Unable to retrieve your location.';
        if (err.code === err.PERMISSION_DENIED) msg = 'Location permission denied. Please enable location access in your device settings.';
        else if (err.code === err.TIMEOUT) msg = 'Location request timed out. Please try again.';
        else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Location information is unavailable right now.';
        setGpsError(msg);
        setStep('error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">

      {/* ── Emergency Banner ── */}
      <div className="bg-red-700 px-4 py-2.5 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-white tracking-wide">🚨 EMERGENCY? Call 911 immediately</p>
        <a
          href="tel:911"
          className="flex-shrink-0 bg-white text-red-700 text-xs font-black px-3 py-1.5 rounded-lg active:scale-95 transition-all"
        >
          Call 911
        </a>
      </div>

      {/* ── Header ── */}
      <div
        className="bg-slate-950 px-5 pb-4 pt-safe"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}
      >
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-white active:scale-90 transition-all"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Tow Services</h1>
            <p className="text-xs text-slate-400 font-medium">Get help fast</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: form
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'form' && (
        <div className="px-5 space-y-5">

          {/* Contact info card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-black text-white">Your Contact Info</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tow services will use this to reach you</p>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Full Name
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                className={inputCls}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            {/* Email (optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Email Address{' '}
                <span className="normal-case text-slate-500 font-semibold">(optional)</span>
              </label>
              <input
                type="email"
                className={inputCls}
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Location notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Location Notes{' '}
                <span className="normal-case text-slate-500 font-semibold">(optional)</span>
              </label>
              <textarea
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="e.g. Highway 101 near exit 42, blue Honda Civic"
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
              />
            </div>
          </div>

          {/* Quick-call AAA card */}
          <AAACard />

          {/* Info note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <Phone size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Your contact info will be ready to share with the tow company you choose. We never send it automatically.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleFindTowing}
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 ${
              canSubmit
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Truck size={20} />
            Find Tow Services Near Me
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: locating
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'locating' && (
        <div className="flex flex-col items-center justify-center px-8 pt-24 space-y-6">
          {/* Animated pulse ring */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-28 h-28 rounded-full bg-red-500/20 animate-ping" />
            <span className="absolute w-20 h-20 rounded-full bg-red-500/30 animate-pulse" />
            <div className="relative z-10 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-900/50">
              <Truck size={28} className="text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-black text-white">Finding your location...</p>
            <p className="text-sm text-slate-400">Searching for towing services nearby...</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Loader2 size={16} className="text-red-400 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">This may take a moment</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: results
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'results' && coords && (
        <div className="px-5 space-y-4">

          {/* Location found banner */}
          <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-emerald-300 leading-snug">
              📍 Location found · Showing towing services near you
            </p>
            <button
              onClick={() => openMapsSearch(coords.lat, coords.lng)}
              className="flex-shrink-0 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-600/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              Open All in Maps
            </button>
          </div>

          {/* User info summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 space-y-2">
            <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
              Your contact info is ready to share
            </p>
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-[10px] text-slate-500">Name</p>
                <p className="text-sm font-black text-white">{name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Phone</p>
                <p className="text-sm font-black text-white">{phone}</p>
              </div>
              {email && (
                <div>
                  <p className="text-[10px] text-slate-500">Email</p>
                  <p className="text-sm font-black text-white">{email}</p>
                </div>
              )}
            </div>
            {locationNote ? (
              <p className="text-xs text-slate-400 italic">"{locationNote}"</p>
            ) : null}
          </div>

          {/* Results list */}
          {results.length > 0 ? (
            results.map((r) => (
              <TowCard
                key={r.place_id}
                result={r}
                userLat={coords.lat}
                userLng={coords.lng}
              />
            ))
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-slate-400 text-sm">No results found nearby.</p>
              <button
                onClick={() => openMapsSearch(coords.lat, coords.lng)}
                className="text-red-400 text-sm font-black underline"
              >
                Search Google Maps instead
              </button>
            </div>
          )}

          {/* AAA fallback */}
          <AAACard />

          {/* Back to form */}
          <button
            onClick={() => setStep('form')}
            className="w-full text-slate-500 text-sm font-semibold py-3 active:scale-95 transition-all"
          >
            ← Back to form
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: maps_opened
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'maps_opened' && (
        <div className="px-5 space-y-5 pt-4">

          {/* Success card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Google Maps Opened</h2>
                <p className="text-xs text-slate-400 mt-0.5">Towing services shown on map</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              We've opened Google Maps with towing services near you. Call the one closest to you and share your contact info:
            </p>

            <div className="bg-slate-800 rounded-2xl px-4 py-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-base">👤</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Name</p>
                  <p className="text-base font-black text-white">{name}</p>
                </div>
              </div>
              <div className="h-px bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Phone</p>
                  <p className="text-base font-black text-white">{phone}</p>
                </div>
              </div>
            </div>

            {coords && (
              <button
                onClick={() => openMapsSearch(coords.lat, coords.lng)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-black py-3.5 rounded-xl transition-all"
              >
                <MapPin size={16} />
                Reopen Google Maps Search
              </button>
            )}
          </div>

          <AAACard />

          <button
            onClick={() => setStep('form')}
            className="w-full text-slate-500 text-sm font-semibold py-3 active:scale-95 transition-all"
          >
            ← Back to form
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: error
         ══════════════════════════════════════════════════════════════════════ */}
      {step === 'error' && (
        <div className="px-5 space-y-5 pt-4">

          {/* Error card */}
          <div className="bg-slate-900 border border-red-800/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Location Error</h2>
                <p className="text-xs text-slate-400 mt-0.5">We couldn't get your GPS position</p>
              </div>
            </div>

            <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 leading-relaxed">
              {gpsError}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              You can still find nearby towing services by searching Google Maps:
            </p>

            <a
              href="https://www.google.com/maps/search/towing+service+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-black py-4 rounded-xl transition-all"
            >
              <MapPin size={16} />
              Search Towing on Google Maps
            </a>
          </div>

          <AAACard />

          <button
            onClick={() => {
              setGpsError('');
              setStep('form');
            }}
            className="w-full text-slate-500 text-sm font-semibold py-3 active:scale-95 transition-all"
          >
            ← Back to form
          </button>
        </div>
      )}
    </div>
  );
};

export default TowService;
