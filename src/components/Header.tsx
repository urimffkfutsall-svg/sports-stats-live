import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Settings } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import SettingsPage from './SettingsPage';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, logout, currentUser } = useAuth();
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
    <header className="bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg border-b-[3px] border-[#d0a650]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(o => !o)}
                className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                  isMoreActive
                    ? 'bg-[#1E6FF2] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Më shumë"
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
                        isActive(link.path)
                          ? 'bg-[#1E6FF2]/10 text-[#1E6FF2]'
                          : 'text-gray-700 hover:bg-gray-50'
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
                  isActive(link.path)
                    ? 'bg-[#1E6FF2] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

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
                <Link
                  to="/admin"
                  className="flex items-center gap-1 px-3 py-2 bg-[#1E6FF2] rounded-lg text-sm font-medium hover:bg-[#1558CC] transition-colors"
                >
                  
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Dil
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white text-sm transition-colors"
              >
                
                <span>Hyr</span>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <NotificationPanel />
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Cilesimet"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {menuOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 mt-2 pt-2">
            {mainLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path) ? 'bg-[#1E6FF2] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="block px-3 py-1 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Më shumë</span>
              {moreLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path) ? 'bg-[#1E6FF2] text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">
                    Admin Panel
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="block px-3 py-2 text-sm text-gray-300 hover:text-white w-full text-left">
                    Dil
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white">
                  Hyr
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
