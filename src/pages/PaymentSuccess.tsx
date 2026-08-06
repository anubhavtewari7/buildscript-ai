import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planName = params.get('name') || 'BuildScript Premium';
  const price = params.get('price') || '';
  const [count, setCount] = useState(3);
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    const visTimer = setTimeout(() => setCheckVisible(true), 100);
    const interval = setInterval(() => setCount(c => c - 1), 1000);
    const redirect = setTimeout(() => navigate('/garage'), 3200);
    return () => { clearInterval(interval); clearTimeout(redirect); clearTimeout(visTimer); };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center px-8 text-center">
      {/* Animated checkmark */}
      <div className={`transition-all duration-700 ${checkVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <path d="M8 20 L16 28 L32 12" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-all duration-500 delay-300 ${checkVisible ? 'opacity-100' : 'opacity-0'}`} />
            </svg>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-700 delay-200 ${checkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-black text-white mb-3">Payment Successful!</h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto mb-2">
          Welcome to {planName}. You now have full access to the Virtual Garage and all premium features.
        </p>
        {price && <p className="text-emerald-400 text-xs font-bold mb-8">{price} charged successfully</p>}

        <div className={`transition-all duration-500 delay-500 ${checkVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-slate-500 text-xs font-medium">Redirecting to Virtual Garage in {count}s...</p>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto mt-3">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${((3 - count) / 3) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
