import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import NotificationPanel from './NotificationPanel';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
    { path: '/kombetarja', label: 'Kombetarja' },
  ];

  return (
    <header className="bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg border-b-[3px] border-[#d0a650]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
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
                  →
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
            {navLinks.map(link => (
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
