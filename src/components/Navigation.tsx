import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Activity, User, Hammer } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/diagnostics', icon: Activity, label: 'Scan' },
  { to: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/garage', icon: Hammer, label: 'Build Guide' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Navigation: React.FC = () => (
  <nav
    className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white border-t border-slate-100 shadow-2xl shadow-slate-900/10"
    style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}
  >
    <div className="flex items-center justify-around px-2 pt-2 pb-1">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-90 ${
              isActive
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-400 hover:text-slate-600'
            }`
          }>
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Navigation;

