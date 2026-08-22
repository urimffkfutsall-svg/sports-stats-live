import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Settings, Menu, X } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import SettingsPage from './SettingsPage';
import GlobalSearch from './GlobalSearch';

const Header: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useData();

  const isActive = (path: string) => location.pathname === path;

  const allNavLinks = [
    { path: '/', label: 'Ballina' },
    { path: '/live', label: 'Live' },
    { path: '/superliga', label: 'Superliga' },
    { path: '/liga-pare', label: 'Liga e Pare' },
    { path: '/kupa', label: 'Kupa e Kosoves' },
    { path: '/lojtari-javes', label: 'Lojtari i Javes' },
    { path: '/statistikat', label: 'Statistikat' },
    { path: '/kalendari', label: 'Kalendari' },
    { path: '/komisioni', label: 'Komisioni' },
    { path: '/aktet-normative', label: 'Aktet Normative' },
    { path: '/kombetarja', label: 'Kombetarja' },
    { path: '/playoff', label: 'PlayOff' },
  ];
  const hiddenPaths = (settings as any)?.hiddenNavPaths || [];
  const navLinks = allNavLinks.filter(l => !hiddenPaths.includes(l.path));

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  if (settingsOpen) {
    return <SettingsPage onBack={() => setSettingsOpen(false)} />;
  }

  return (
    <>
      <header className="bg-[#0f1830] text-white sticky top-0 z-50 shadow-lg">
        {/* Top row: logo + utility icons */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/ffk-logo-512.png" alt="FFK Futsall" className="w-10 h-10 object-contain" />
              <span className="hidden sm:block font-bold text-lg tracking-wide">FFK Futsall</span>
            </Link>

            <div className="flex items-center gap-1">
              <GlobalSearch />
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
                  <Link to="/admin" className="hidden sm:flex items-center gap-1 px-3 py-2 bg-[#0f1830] rounded-lg text-sm font-medium hover:bg-[#1c3570] transition-colors">
                    Admin
                  </Link>
                  <button onClick={logout} className="hidden sm:flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white text-sm transition-colors">
                    Dil
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-3 py-1.5 border border-[#d0a650]/50 text-[#d0a650] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#d0a650]/10 transition-colors whitespace-nowrap">
                  Kyçu
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row: gold Menu button + horizontal nav (desktop) */}
        <div className="hidden lg:block bg-[#0f1830]">
          <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 h-12 px-5 bg-[#d0a650] text-[#0f1830] font-bold text-sm uppercase tracking-wide hover:bg-[#e0b660] transition-colors"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
                Menu
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-b-lg shadow-2xl border border-gray-100 py-2 z-50">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                        isActive(link.path) ? 'bg-[#0f1830]/10 text-[#0f1830]' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop inline nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4 overflow-x-auto">
              {navLinks.filter(l => ['/', '/superliga', '/liga-pare'].includes(l.path)).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    isActive(link.path) ? 'bg-[#0f1830] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;



