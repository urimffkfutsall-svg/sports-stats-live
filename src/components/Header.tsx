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
  const moreRef = useRef<HTMLDivElement>(null);
  // Auto-close dropdown on navigation
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useData();
  const location = useLocation();

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

  const mobileMain = [
    { path: '/', label: 'Ballina', emoji: '≡ƒÅá' },
    { path: '/live', label: 'Live', emoji: '≡ƒôí' },
    { path: '/superliga', label: 'Superliga', emoji: '≡ƒÅå' },
    { path: '/liga-pare', label: 'Liga I', emoji: 'Γ¡É' },
  ];

  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
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
      {/* ===== TOP HEADER ===== */}
      <header className="bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg border-b-[3px] border-[#d0a650]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative" ref={moreRef}>
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
              <div className="flex items-center gap-1">
                <NotificationPanel />
                <button onClick={() => setSettingsOpen(true)} className="p-2 text-gray-300 hover:text-white transition-colors" title="Cilesimet">
                  <Settings size={20} />
                </button>
                {isAuthenticated && (
                  <Link to="/admin" className="px-2 py-1 bg-[#1E6FF2] rounded-lg text-xs font-medium">
                    Admin
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          style={{
            background: 'white',
            borderRadius: '28px 28px 0 0',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.13)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingBottom: '10px',
            paddingTop: '6px',
          }}
        >
          {mobileMain.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '60px',
                  transform: active ? 'translateY(-18px)' : 'translateY(0)',
                  transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: active ? '58px' : '44px',
                    height: active ? '58px' : '44px',
                    borderRadius: '50%',
                    background: active ? '#1E6FF2' : 'transparent',
                    boxShadow: active ? '0 6px 20px rgba(30,111,242,0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                  }}
                >
                  <span style={{ fontSize: active ? '26px' : '22px', filter: active ? 'none' : 'grayscale(1) opacity(0.4)', transition: 'all 0.2s' }}>
                    {item.emoji}
                  </span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '5px', color: active ? '#1E6FF2' : '#9CA3AF', transition: 'color 0.2s' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(o => !o)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transform: isMoreActive ? 'translateY(-18px)' : 'translateY(0)',
                transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
              }}
            >
              <div
                style={{
                  width: isMoreActive ? '58px' : '44px',
                  height: isMoreActive ? '58px' : '44px',
                  borderRadius: '50%',
                  background: isMoreActive ? '#1E6FF2' : 'transparent',
                  boxShadow: isMoreActive ? '0 6px 20px rgba(30,111,242,0.5)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                }}
              >
                <span style={{ fontSize: isMoreActive ? '26px' : '22px', filter: isMoreActive ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                  Γÿ░
                </span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '5px', color: isMoreActive ? '#1E6FF2' : '#9CA3AF' }}>
                Me shume
              </span>
            </button>
            {moreOpen && (
              <div className="absolute bottom-full mb-3 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                {moreLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(link.path) ? 'bg-[#1E6FF2]/10 text-[#1E6FF2]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {isAuthenticated ? (
                    <>
                      <Link to="/admin" onClick={() => setMoreOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                      <button onClick={() => { logout(); setMoreOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">Dil</button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setMoreOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Hyr</Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
