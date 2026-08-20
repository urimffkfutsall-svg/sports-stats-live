import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Settings } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import SettingsPage from './SettingsPage';

const Header: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRefDesktop = useRef<HTMLDivElement>(null);
  const moreRefMobile = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useData();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Ballina' },
    { path: '/live', label: 'Live' },
    { path: '/superliga', label: 'Superliga' },
    { path: '/liga-pare', label: 'Liga e Pare' },
    { path: '/kupa', label: 'Kupa e Kosoves' },
    { path: '/lojtari-javes', label: 'Lojtari i Javes' },
    { path: '/statistikat', label: 'Statistikat' },
    { path: '/komisioni', label: 'Komisioni' },
    { path: '/aktet-normative', label: 'Aktet Normative' },
    { path: '/kombetarja', label: 'Kombetarja' },
    { path: '/playoff', label: 'PlayOff' },
  ];

  const mainPaths = ['/', '/superliga', '/liga-pare'];
  const mainLinks = navLinks.filter(l => mainPaths.includes(l.path));
  const moreLinks = navLinks.filter(l => !mainPaths.includes(l.path));
  const isMoreActive = moreLinks.some(l => isActive(l.path));

  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreRefDesktop.current && !moreRefDesktop.current.contains(e.target as Node) &&
        moreRefMobile.current && !moreRefMobile.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  if (settingsOpen) {
    return <SettingsPage onBack={() => setSettingsOpen(false)} />;
  }

  return (
    <>
      <header className="bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg border-b-[3px] border-[#d0a650]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative" ref={moreRefDesktop}>
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    isMoreActive ? 'bg-[#1E6FF2] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title="Me shume"
                >
                  <div className="space-y-1">
                    <span className="block w-5 h-0.5 bg-current rounded-full"></span>
                    <span className="block w-5 h-0.5 bg-current rounded-full"></span>
                    <span className="block w-5 h-0.5 bg-current rounded-full"></span>
                  </div>
                </button>
                {moreOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50">
                    {moreLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2 text-sm font-medium transition-colors ${
                          isActive(link.path) ? 'bg-[#1E6FF2]/10 text-[#1E6FF2]' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {mainLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path) ? 'bg-[#1E6FF2] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-2">
              <NotificationPanel />
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                title="Cilesimet"
              >
                <Settings size={20} />
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="flex items-center gap-1 px-3 py-2 bg-[#1E6FF2] rounded-lg text-sm font-medium hover:bg-[#1558CC] transition-colors">
                    Admin
                  </Link>
                  <button onClick={logout} className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white text-sm transition-colors">
                    Dil
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white text-sm transition-colors">
                  <span>Hyr</span>
                </Link>
              )}
            </div>

            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <Link to="/" className="text-white font-bold text-base tracking-wide">
                FFK Futsall
              </Link>
              <div className="flex items-center gap-1" ref={moreRefMobile}>
                <NotificationPanel />
                <button onClick={() => setSettingsOpen(true)} className="p-2 text-gray-300 hover:text-white transition-colors" title="Cilesimet">
                  <Settings size={20} />
                </button>
                {isAuthenticated ? (
                  <Link to="/admin" className="px-2 py-1 bg-[#1E6FF2] rounded-lg text-xs font-medium whitespace-nowrap">
                    Admin
                  </Link>
                ) : (
                  <Link to="/login" className="px-2 py-1 border border-white/30 rounded-lg text-xs font-medium text-white whitespace-nowrap">
                    Kyçu
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
