import React, { useState, useEffect } from 'react';
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
  const { isAuthenticated, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

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
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.path) ? 'bg-[#2a499a]/10 text-[#2a499a]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="text-[#2a499a]" />
                  Kyçu
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-[#2a499a]" />
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

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[96] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0">
        <div className="mx-auto max-w-md bg-white rounded-[28px] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.25)] border border-gray-100 flex items-end justify-around px-1.5 pt-3 pb-2 overflow-visible">
          {items.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMoreOpen(false)}
                className="relative flex flex-col items-center justify-end min-w-[3.5rem]"
                style={{ transform: active ? 'translateY(-16px)' : 'translateY(0)', transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)' }}
              >
                <span
                  className={`flex items-center justify-center rounded-full transition-all ${active ? 'bg-[#2a499a] shadow-lg shadow-[#2a499a]/40' : ''}`}
                  style={{ width: active ? '52px' : '38px', height: active ? '52px' : '38px', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)' }}
                >
                  <Icon className={active ? 'w-6 h-6 text-white' : 'w-[18px] h-[18px] text-gray-400'} strokeWidth={2.2} />
                </span>
                <span className={`text-[10px] font-semibold mt-1 ${active ? 'text-[#2a499a]' : 'text-gray-400'}`}>{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(v => !v)}
            className="relative flex flex-col items-center justify-end min-w-[3.5rem]"
            style={{ transform: (moreOpen || isMoreActive) ? 'translateY(-16px)' : 'translateY(0)', transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)' }}
          >
            <span
              className={`flex items-center justify-center rounded-full transition-all ${(moreOpen || isMoreActive) ? 'bg-[#2a499a] shadow-lg shadow-[#2a499a]/40' : ''}`}
              style={{ width: (moreOpen || isMoreActive) ? '52px' : '38px', height: (moreOpen || isMoreActive) ? '52px' : '38px', transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)' }}
            >
              {moreOpen
                ? <X className="w-6 h-6 text-white" strokeWidth={2.2} />
                : <Menu className={(moreOpen || isMoreActive) ? 'w-6 h-6 text-white' : 'w-[18px] h-[18px] text-gray-400'} strokeWidth={2.2} />}
            </span>
            <span className={`text-[10px] font-semibold mt-1 ${(moreOpen || isMoreActive) ? 'text-[#2a499a]' : 'text-gray-400'}`}>Me shume</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
