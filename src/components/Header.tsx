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
            
    </>
  );
};

export default Header;