import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, PlayCircle, BarChart3, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ALL_NAV_LINKS = [
  { path: '/live', label: 'Live' },
  { path: '/liga-pare', label: 'Liga e Pare' },
  { path: '/kupa', label: 'Kupa e Kosoves' },
  { path: '/lojtari-javes', label: 'Lojtari i Javes' },
  { path: '/statistikat', label: 'Statistikat' },
  { path: '/komisioni', label: 'Komisioni' },
  { path: '/aktet-normative', label: 'Aktet Normative' },
  { path: '/kombetarja', label: 'Kombetarja' },
  { path: '/playoff', label: 'PlayOff' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isAuthenticated, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  // Hide on scroll down, show on scroll up (si Facebook)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 50) { setVisible(true); }
      else if (y > lastScrollY.current + 5) { setVisible(false); setMoreOpen(false); }
      else if (y < lastScrollY.current - 5) { setVisible(true); }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  const items = [
    { path: '/', label: 'Ballina', icon: Home },
    { path: '/superliga', label: 'Superliga', icon: Trophy },
    { path: '/live', label: 'Live', icon: PlayCircle },
    { path: '/statistikat', label: 'Stat.', icon: BarChart3 },
  ];

  const isMoreActive = ALL_NAV_LINKS.some(l => isActive(l.path));

  return (
    <>
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[95]" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 right-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {ALL_NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMoreOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.path) ? 'bg-[#1E6FF2]/10 text-[#1E6FF2]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-[#1E6FF2]" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => { logout(); setMoreOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Dilni (Logout)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[96] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0 transition-transform duration-300"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
      >
        <div className="mx-auto max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_-6px_rgba(0,0,0,0.25)] border border-gray-100 flex items-center justify-around px-1.5 py-2">
          {items.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMoreOpen(false)}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 rounded-xl transition-all"
              >
                <span className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${active ? 'bg-[#1E6FF2] shadow-md shadow-[#1E6FF2]/30 scale-105' : ''}`}>
                  <Icon className={`w-[19px] h-[19px] ${active ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.2} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(v => !v)}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 rounded-xl transition-all"
          >
            <span className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${moreOpen || isMoreActive ? 'bg-[#1E6FF2] shadow-md shadow-[#1E6FF2]/30 scale-105' : ''}`}>
              {moreOpen
                ? <X className="w-[19px] h-[19px] text-white" strokeWidth={2.2} />
                : <Menu className={`w-[19px] h-[19px] ${isMoreActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.2} />}
            </span>
            <span className={`text-[10px] font-semibold ${moreOpen || isMoreActive ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>Me shume</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
