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
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 right-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-bottom-4 duration-200"
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

      {/* Bottom nav bar — floating blue pill, active tab expands to white pill w/ label */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[96] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0">
        <div className="mx-auto max-w-md bg-[#1E6FF2] rounded-full shadow-[0_10px_35px_-8px_rgba(30,111,242,0.55)] flex items-center gap-1 px-2 py-2">
          {items.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMoreOpen(false)}
                className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out overflow-hidden ${
                  active
                    ? 'flex-1 bg-white gap-1.5 px-3 py-2.5 shadow-sm'
                    : 'w-10 h-10 flex-shrink-0'
                }`}
              >
                <Icon
                  className={`w-[19px] h-[19px] flex-shrink-0 transition-colors ${
                    active ? 'text-[#1E6FF2]' : 'text-white/75'
                  }`}
                  strokeWidth={2.3}
                />
                <span
                  className={`text-[12px] font-bold text-[#1E6FF2] whitespace-nowrap transition-all duration-300 ${
                    active ? 'max-w-[6rem] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(v => !v)}
            className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out overflow-hidden ${
              moreOpen || isMoreActive
                ? 'flex-1 bg-white gap-1.5 px-3 py-2.5 shadow-sm'
                : 'w-10 h-10 flex-shrink-0'
            }`}
          >
            {moreOpen ? (
              <X className={`w-[19px] h-[19px] flex-shrink-0 ${moreOpen || isMoreActive ? 'text-[#1E6FF2]' : 'text-white/75'}`} strokeWidth={2.3} />
            ) : (
              <Menu className={`w-[19px] h-[19px] flex-shrink-0 ${isMoreActive ? 'text-[#1E6FF2]' : 'text-white/75'}`} strokeWidth={2.3} />
            )}
            <span
              className={`text-[12px] font-bold text-[#1E6FF2] whitespace-nowrap transition-all duration-300 ${
                moreOpen || isMoreActive ? 'max-w-[6rem] opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              Më shumë
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
