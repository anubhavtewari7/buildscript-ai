import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Navigation,
  Map,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShopResult {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  opening_hours?: { open_now?: boolean };
  geometry: { location: { lat: number; lng: number } };
  types?: string[];
}

type PageState = 'loading' | 'results' | 'maps_fallback' | 'error';
type FilterType = 'all' | 'mechanic' | 'tire' | 'body';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

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
  if (d < 0.1) return 'Very close';
  if (d < 1) return `${(d * 5280).toFixed(0)} ft away`;
  return `${d.toFixed(1)} mi away`;
};

const openDirections = (address: string) => {
  const encoded = encodeURIComponent(address);
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

const filterShops = (shops: ShopResult[], filter: FilterType): ShopResult[] => {
  if (filter === 'all') return shops;
  return shops.filter((s) => {
    const name = s.name.toLowerCase();
    const types = s.types ?? [];
    if (filter === 'mechanic') {
      return (
        types.includes('car_repair') ||
        /mechanic|auto|repair|service/.test(name)
      );
    }
    if (filter === 'tire') {
      return /tire|tires/.test(name);
    }
    if (filter === 'body') {
      return /body|collision|paint/.test(name);
    }
    return true;
  });
};

const filterLabel: Record<FilterType, string> = {
  all: 'All',
  mechanic: 'Mechanic',
  tire: 'Tire Shop',
  body: 'Body Shop',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const PulseMapPin: React.FC<{ color?: string }> = ({ color = 'text-indigo-400' }) => (
  <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
    {/* Pulse rings */}
    <span
      className="absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping"
      style={{ backgroundColor: 'rgba(99,102,241,0.4)' }}
    />
    <span
      className="absolute inline-flex h-14 w-14 rounded-full opacity-20 animate-ping"
      style={{ backgroundColor: 'rgba(99,102,241,0.4)', animationDelay: '0.3s' }}
    />
    <MapPin className={`relative z-10 ${color}`} size={36} />
  </div>
);

interface HoursBadgeProps {
  openNow?: boolean;
}
const HoursBadge: React.FC<HoursBadgeProps> = ({ openNow }) => {
  if (openNow === undefined) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600 whitespace-nowrap">
        Hours unknown
      </span>
    );
  }
  if (openNow) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
        OPEN
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">
      CLOSED
    </span>
  );
};

interface ShopCardProps {
  shop: ShopResult;
  userLat: number;
  userLng: number;
}
const ShopCard: React.FC<ShopCardProps> = ({ shop, userLat, userLng }) => {
  const distance = getDistanceMiles(
    userLat,
    userLng,
    shop.geometry.location.lat,
    shop.geometry.location.lng,
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
      {/* Row 1: Name + badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-black text-white text-base leading-snug flex-1">
          {shop.name}
        </h3>
        <HoursBadge openNow={shop.opening_hours?.open_now} />
      </div>

      {/* Row 2: Address */}
      <div className="flex items-center gap-1 mb-2">
        <MapPin size={12} className="text-slate-500 flex-shrink-0" />
        <p className="text-slate-400 text-xs leading-snug">{shop.vicinity}</p>
      </div>

      {/* Row 3: Rating + distance */}
      <div className="flex items-center gap-2 mb-3">
        {shop.rating != null && (
          <>
            <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
            <span className="text-white text-xs font-semibold">{shop.rating.toFixed(1)}</span>
            {shop.user_ratings_total != null && (
              <span className="text-slate-500 text-xs">
                ({shop.user_ratings_total.toLocaleString()} reviews)
              </span>
            )}
            <span className="text-slate-600 text-xs">·</span>
          </>
        )}
        <span className="text-slate-400 text-xs">{distance}</span>
      </div>

      {/* Row 4: Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => openDirections(shop.vicinity)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 active:bg-indigo-700 rounded-xl py-3 font-black text-white text-xs uppercase tracking-widest transition-colors"
        >
          <Navigation size={13} />
          Get Directions
        </button>

        {shop.formatted_phone_number ? (
          <a
            href={`tel:${shop.formatted_phone_number!.replace(/\D/g, '')}`}
            className="w-20 flex items-center justify-center gap-1 bg-slate-700 active:bg-slate-600 rounded-xl py-3 font-black text-white text-xs uppercase tracking-widest transition-colors"
          >
            <Phone size={13} />
            Call
          </a>
        ) : (
          <button
            disabled
            className="w-20 flex items-center justify-center gap-1 bg-slate-700 rounded-xl py-3 font-black text-slate-400 text-xs uppercase tracking-widest opacity-40 cursor-not-allowed"
          >
            <Phone size={13} />
            No #
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const NearbyShops: React.FC = () => {
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [shops, setShops] = useState<ShopResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [error, setError] = useState('');
  const [mapsFallbackDone, setMapsFallbackDone] = useState(false);

  // ── Fetch shop details (phone, hours) ──
  const fetchShopDetails = useCallback(
    async (placeId: string): Promise<Partial<ShopResult>> => {
      if (!GOOGLE_API_KEY) return {};
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,vicinity,rating,user_ratings_total,opening_hours,geometry,types&key=${GOOGLE_API_KEY}`,
        );
        const data = await res.json();
        return data.result ?? {};
      } catch {
        return {};
      }
    },
    [],
  );

  // ── Main fetch flow ──
  const fetchNearbyShops = useCallback(
    async (lat: number, lng: number) => {
      if (!GOOGLE_API_KEY) {
        // No key — go straight to maps fallback
        setCoords({ lat, lng });
        setPageState('maps_fallback');
        window.open(
          `https://www.google.com/maps/search/auto+repair/@${lat},${lng},13z`,
          '_blank',
        );
        setMapsFallbackDone(true);
        return;
      }

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=16000&type=car_repair&key=${GOOGLE_API_KEY}`,
        );
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          setShops([]);
          setPageState('results');
          return;
        }

        const top20: ShopResult[] = data.results.slice(0, 20);

        // Fetch details for each concurrently
        const withDetails = await Promise.all(
          top20.map(async (shop) => {
            const details = await fetchShopDetails(shop.place_id);
            return { ...shop, ...details } as ShopResult;
          }),
        );

        setShops(withDetails);
        setPageState('results');
      } catch {
        // CORS or network error — open Google Maps as fallback
        setCoords({ lat, lng });
        setPageState('maps_fallback');
        window.open(
          `https://www.google.com/maps/search/auto+repair/@${lat},${lng},13z`,
          '_blank',
        );
        setMapsFallbackDone(true);
      }
    },
    [fetchShopDetails],
  );

  // ── Geolocation on mount ──
  const startLocationFlow = useCallback(() => {
    setPageState('loading');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setPageState('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        fetchNearbyShops(lat, lng);
      },
      (err) => {
        if (err.code === 1) {
          setError('permission_denied');
        } else {
          setError('Unable to determine your location. Please try again.');
        }
        setPageState('error');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, [fetchNearbyShops]);

  useEffect(() => {
    startLocationFlow();
  }, [startLocationFlow]);

  // ── Filtered list ──
  const filteredShops = filterShops(shops, activeFilter);

  // ── Map URL helper ──
  const googleMapsUrl = coords
    ? `https://www.google.com/maps/search/auto+repair/@${coords.lat},${coords.lng},13z`
    : `https://www.google.com/maps/search/auto+repair/`;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: Loading
  // ─────────────────────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
        <PulseMapPin />
        <p className="mt-6 text-white font-black text-lg tracking-tight">
          Getting your location...
        </p>
        <p className="mt-2 text-slate-400 text-sm text-center">
          Finding repair shops nearby...
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: Error
  // ─────────────────────────────────────────────────────────────────────────────
  if (pageState === 'error') {
    const isPermission = error === 'permission_denied';
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-4 pt-safe">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 active:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Shops Near Me</h1>
              <p className="text-slate-500 text-xs mt-0.5">Find auto repair shops</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="text-red-400" size={30} />
            </div>
            <h2 className="text-white font-black text-xl mb-3">
              {isPermission ? 'Location Access Needed' : 'Location Error'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {isPermission
                ? 'BuildScript needs your location to find nearby shops. Please allow location access in your phone settings.'
                : error}
            </p>

            {isPermission && (
              <div className="bg-slate-800 rounded-2xl px-4 py-3 mb-6 text-left">
                <p className="text-slate-300 text-xs font-semibold mb-1">How to enable:</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Settings → Privacy → Location Services → BuildScript → Allow
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  window.open('https://www.google.com/maps/search/auto+repair/', '_blank')
                }
                className="w-full py-3.5 bg-indigo-600 active:bg-indigo-700 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-colors"
              >
                Open Maps Manually
              </button>
              <button
                onClick={startLocationFlow}
                className="w-full py-3.5 bg-slate-800 active:bg-slate-700 rounded-2xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: Maps fallback
  // ─────────────────────────────────────────────────────────────────────────────
  if (pageState === 'maps_fallback') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-4 pt-safe">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 active:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Shops Near Me</h1>
              <p className="text-slate-500 text-xs mt-0.5">Within 10 miles</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm text-center">
            <PulseMapPin />
            <h2 className="mt-5 text-white font-black text-xl">
              {mapsFallbackDone ? 'Maps Opened!' : 'Opening Google Maps...'}
            </h2>

            {mapsFallbackDone && (
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Google Maps has been opened with car repair shops near you. Tap any shop in
                Maps to get directions.
              </p>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  window.open(googleMapsUrl, '_blank');
                  setMapsFallbackDone(true);
                }}
                className="w-full py-3.5 bg-indigo-600 active:bg-indigo-700 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Map size={15} />
                Open Maps Again
              </button>
              <button
                onClick={startLocationFlow}
                className="w-full py-3.5 bg-slate-800 active:bg-slate-700 rounded-2xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: Results
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-4 pt-safe">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-800 active:bg-slate-700 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-lg leading-none truncate">
              Shops Near Me
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 truncate">Within 10 miles</p>
          </div>

          <button
            onClick={() => window.open(googleMapsUrl, '_blank')}
            className="flex-shrink-0 flex items-center gap-1.5 bg-slate-800 active:bg-slate-700 px-3 py-2 rounded-xl transition-colors"
          >
            <Map size={14} className="text-slate-300" />
            <span className="text-slate-300 text-xs font-semibold whitespace-nowrap">
              View on Map
            </span>
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mt-3 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {(['all', 'mechanic', 'tire', 'body'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  activeFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 active:bg-slate-700'
                }`}
              >
                {filterLabel[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop list ── */}
      <div className="flex-1 px-4 pt-4 pb-32 space-y-3">
        {filteredShops.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <MapPin className="text-slate-500" size={28} />
            </div>
            <h3 className="text-white font-black text-lg mb-2">
              No {activeFilter !== 'all' ? filterLabel[activeFilter] : ''} shops found nearby
            </h3>
            {activeFilter !== 'all' && (
              <p className="text-slate-500 text-sm">
                Try switching to{' '}
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-indigo-400 font-semibold underline"
                >
                  All
                </button>{' '}
                to see every shop.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Result count */}
            <p className="text-slate-500 text-xs px-1 pb-1">
              {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
            </p>

            {coords && filteredShops.map((shop) => (
              <ShopCard
                key={shop.place_id}
                shop={shop}
                userLat={coords.lat}
                userLng={coords.lng}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;
