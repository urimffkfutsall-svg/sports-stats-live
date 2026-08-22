import React from 'react';
import Header from './Header';
import LandingMatches from './LandingMatches';
import LandingNews from './LandingNews';
import LandingVideos from './LandingVideos';
import LeagueTablesSection from './LeagueTablesSection';
import Footer from './Footer';
import NtActivitiesSection from './NtActivitiesSection';
import FfkMomentsSection from './FfkMomentsSection';
import DecisionsSection from './DecisionsSection';
import { useData } from '@/context/DataContext';

var AppLayout: React.FC = function() {
  var _data = useData();
  var isLoading = _data.isLoading;

  if (isLoading) {
    const dots = Array.from({ length: 8 });
    return (
      <div style={{ minHeight: '100vh', background: '#0f1830', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes ffkDot {
            0%, 80%, 100% { transform: translate(-50%,-50%) scale(0.4); opacity: 0.25; }
            40% { transform: translate(-50%,-50%) scale(1.1); opacity: 1; }
          }
        `}</style>
        <div style={{ position: 'relative', width: '72px', height: '72px' }}>
          {dots.map((_, i) => {
            const angle = i * 45;
            const rad = (angle * Math.PI) / 180;
            const r = 28;
            const x = 36 + r * Math.sin(rad);
            const y = 36 - r * Math.cos(rad);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '11px',
                  height: '11px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%,-50%)',
                  animation: `ffkDot 1.2s ease-in-out ${(i * 0.15).toFixed(2)}s infinite`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 lg:pb-0">
      <Header />
      <LandingNews />
      <LandingMatches />
      <LeagueTablesSection />
      <DecisionsSection />
      <NtActivitiesSection />
      <FfkMomentsSection />
      <LandingVideos />
      <Footer />
    </div>
  );
};

export default AppLayout;