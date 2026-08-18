import React from 'react';
import { useData } from '@/context/DataContext';

const LiveMatchBanner: React.FC = () => {
  const { matches, teams } = useData();
  const liveMatches = matches.filter(m => m.status === 'live');

  if (liveMatches.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">LIVE</span>
        </div>
        <div className="flex items-center gap-6">
          {liveMatches.map(m => {
            const home = teams.find(t => t.id === m.homeTeamId);
            const away = teams.find(t => t.id === m.awayTeamId);
            return (
              <div key={m.id} className="flex items-center gap-2 text-sm whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {home?.logo && <img src={home.logo} alt="" className="w-5 h-5 rounded-full bg-white/20" />}
                  <span className="font-medium">{home?.name || '?'}</span>
                </div>
                <span className="font-bold text-yellow-200">{m.homeScore ?? 0} - {m.awayScore ?? 0}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{away?.name || '?'}</span>
                  {away?.logo && <img src={away.logo} alt="" className="w-5 h-5 rounded-full bg-white/20" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchBanner;
