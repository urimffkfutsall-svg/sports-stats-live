import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, PlayCircle, BarChart3, Menu, X } from 'lucide-react';

const MORE_LINKS = [
  { path: '/liga-pare', label: 'Liga e Parë' },
  { path: '/kupa', label: 'Kupa e Kosovës' },
  { path: '/lojtari-javes', label: 'Lojtari i Javës' },
  { path: '/kombetarja', label: 'Kombëtarja' },
  { path: '/playoff', label: 'PlayOff' },
  { path: '/skuadrat', label: 'Skuadrat' },
  { path: '/live/streams', label: 'Live Streams' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const items = [
    { path: '/', label: 'Ballina', icon: Home },
    { path: '/superliga', label: 'Superliga', icon: Trophy },
    { path: '/live', label: 'Live', icon: PlayCircle },
    { path: '/statistikat', label: 'Stat.', icon: BarChart3 },
  ];

  const isMoreActive = MORE_LINKS.some(l => isActive(l.path));

  return (
    <>
      {/* "Më shumë" panel */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[95]" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 right-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {MORE_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMoreOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.path) ? 'bg-[#1E6FF2]/10 text-[#1E6FF2]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[96] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0"
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
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    active ? 'bg-[#1E6FF2] shadow-md shadow-[#1E6FF2]/30 scale-105' : ''
                  }`}
                >
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
            <span
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                moreOpen || isMoreActive ? 'bg-[#1E6FF2] shadow-md shadow-[#1E6FF2]/30 scale-105' : ''
              }`}
            >
              {moreOpen ? (
                <X className="w-[19px] h-[19px] text-white" strokeWidth={2.2} />
              ) : (
                <Menu className={`w-[19px] h-[19px] ${isMoreActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.2} />
              )}
            </span>
            <span className={`text-[10px] font-semibold ${moreOpen || isMoreActive ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>Më shumë</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
