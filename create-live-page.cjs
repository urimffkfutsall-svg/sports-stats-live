const fs = require("fs");

// =====================================================
// STEP 1: Remove LiveMatchBanner from AppLayout
// =====================================================
let al = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
al = al.replace("import LiveMatchBanner from './LiveMatchBanner';\n", "");
al = al.replace("<LiveMatchBanner />\n", "");
fs.writeFileSync("src/components/AppLayout.tsx", al, "utf8");
console.log("[OK] Removed LiveMatchBanner from AppLayout");

// =====================================================
// STEP 2: Create premium LiveMatchPage for visitors
// =====================================================
const liveMatchPage = `import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchDetailModal from '@/components/MatchDetailModal';
import { Match } from '@/types';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

const LiveMatchPage: React.FC = () => {
  const { matches, teams, competitions, getActiveSeason, getGoalsByMatch, players, getTeamById } = useData();
  const navigate = useNavigate();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(t);
  }, []);

  const liveMatches = useMemo(() =>
    matches.filter(m => m.status === 'live' && (activeSeason ? m.seasonId === activeSeason.id : true)),
    [matches, activeSeason]
  );

  const recentFinished = useMemo(() =>
    matches
      .filter(m => m.status === 'finished' && (activeSeason ? m.seasonId === activeSeason.id : true))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 6),
    [matches, activeSeason]
  );

  const upcomingMatches = useMemo(() =>
    matches
      .filter(m => m.status === 'planned' && (activeSeason ? m.seasonId === activeSeason.id : true))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .slice(0, 6),
    [matches, activeSeason]
  );

  const LiveCard: React.FC<{ match: Match }> = ({ match }) => {
    const home = getTeamById(match.homeTeamId);
    const away = getTeamById(match.awayTeamId);
    const comp = competitions.find(c => c.id === match.competitionId);
    const matchGoals = getGoalsByMatch(match.id);
    const homeGoals = matchGoals.filter(g => g.teamId === match.homeTeamId);
    const awayGoals = matchGoals.filter(g => g.teamId === match.awayTeamId);

    return (
      <div
        onClick={() => setSelectedMatch(match)}
        className="relative bg-gradient-to-br from-[#0A1E3C] via-[#122D56] to-[#1E6FF2] rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.01] transition-all duration-300 shadow-2xl"
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* LIVE badge */}
        <div className="flex items-center justify-between px-5 pt-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-xs font-black uppercase tracking-[0.2em]">Live</span>
          </div>
          {comp && <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{comp.name}</span>}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between px-5 py-6 relative z-10">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden p-2 group-hover:bg-white/15 transition-colors">
              {home?.logo ? (
                <img src={home.logo} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-white/50 text-2xl font-black">{home?.name?.charAt(0)}</span>
              )}
            </div>
            <span className="text-white text-sm font-bold text-center leading-tight">{home?.name || 'TBD'}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{match.homeScore ?? 0}</span>
              <span className="text-2xl font-light text-white/30">:</span>
              <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{match.awayScore ?? 0}</span>
            </div>
            {match.venue && <span className="text-white/30 text-[10px] font-medium mt-1">{match.venue}</span>}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden p-2 group-hover:bg-white/15 transition-colors">
              {away?.logo ? (
                <img src={away.logo} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-white/50 text-2xl font-black">{away?.name?.charAt(0)}</span>
              )}
            </div>
            <span className="text-white text-sm font-bold text-center leading-tight">{away?.name || 'TBD'}</span>
          </div>
        </div>

        {/* Goal scorers */}
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="px-5 pb-4 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {homeGoals.map((g, i) => {
                    const p = players.find(pl => pl.id === g.playerId);
                    return (
                      <div key={i} className="flex items-center gap-1.5 text-white/70 text-xs">
                        <span className="text-[10px]">\\u26BD</span>
                        <span>{p ? p.firstName.charAt(0) + '. ' + p.lastName : '?'}</span>
                        <span className="text-white/30">{g.minute}'</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1 text-right">
                  {awayGoals.map((g, i) => {
                    const p = players.find(pl => pl.id === g.playerId);
                    return (
                      <div key={i} className="flex items-center gap-1.5 text-white/70 text-xs justify-end">
                        <span className="text-white/30">{g.minute}'</span>
                        <span>{p ? p.firstName.charAt(0) + '. ' + p.lastName : '?'}</span>
                        <span className="text-[10px]">\\u26BD</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SmallCard: React.FC<{ match: Match; type: 'finished' | 'planned' }> = ({ match, type }) => {
    const home = getTeamById(match.homeTeamId);
    const away = getTeamById(match.awayTeamId);

    return (
      <div
        onClick={() => setSelectedMatch(match)}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
      >
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs font-bold">{home?.name?.charAt(0)}</span>}
            </div>
            <span className="text-xs font-bold text-gray-800 truncate">{home?.name || 'TBD'}</span>
          </div>
          <div className="px-2 min-w-[50px] text-center">
            {type === 'finished' ? (
              <span className="text-sm font-black text-gray-900">{match.homeScore ?? 0} : {match.awayScore ?? 0}</span>
            ) : (
              <span className="text-xs font-bold text-[#1E6FF2]">{match.time || 'VS'}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-xs font-bold text-gray-800 truncate text-right">{away?.name || 'TBD'}</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs font-bold">{away?.name?.charAt(0)}</span>}
            </div>
          </div>
        </div>
        {type === 'planned' && match.date && (
          <div className="px-3 pb-2 text-[10px] text-gray-400 text-center">{formatDate(match.date)}</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 rounded-full mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-red-600 text-xs font-black uppercase tracking-[0.15em]">Ndeshje Live</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Rezultatet Live</h1>
          <p className="text-gray-400 text-sm mt-1">Ndiq ndeshjet ne kohe reale</p>
        </div>

        {/* Live Matches */}
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {liveMatches.map(m => <LiveCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="text-center py-16 mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">Nuk ka ndeshje live momentalisht</h3>
            <p className="text-sm text-gray-400">Ndeshjet live do te shfaqen ketu automatikisht</p>
          </div>
        )}

        {/* Recent Results & Upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentFinished.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                Rezultatet e Fundit
              </h2>
              <div className="space-y-2">
                {recentFinished.map(m => <SmallCard key={m.id} match={m} type="finished" />)}
              </div>
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"></span>
                Ndeshjet e Ardhshme
              </h2>
              <div className="space-y-2">
                {upcomingMatches.map(m => <SmallCard key={m.id} match={m} type="planned" />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
      <Footer />
    </div>
  );
};

export default LiveMatchPage;
`;

fs.writeFileSync("src/pages/LiveMatchPage.tsx", liveMatchPage, "utf8");
console.log("[OK] Created LiveMatchPage.tsx - premium live page");

// =====================================================
// STEP 3: Add route in App.tsx
// =====================================================
let app = fs.readFileSync("src/App.tsx", "utf8");

// Add import
if (!app.includes("LiveMatchPage")) {
  app = app.replace(
    "import NotFound from \"./pages/NotFound\";",
    "import LiveMatchPage from \"./pages/LiveMatchPage\";\nimport NotFound from \"./pages/NotFound\";"
  );
  // Add route before admin
  app = app.replace(
    '<Route path="/admin"',
    '<Route path="/live" element={<LiveMatchPage />} />\n                <Route path="/admin"'
  );
}

fs.writeFileSync("src/App.tsx", app, "utf8");
console.log("[OK] Added /live route");

// =====================================================
// STEP 4: Add Live link in Header
// =====================================================
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
const hLines = header.split("\n");
console.log("\n=== Header nav links ===");
for (let i = 0; i < hLines.length; i++) {
  if (hLines[i].includes("path:") && hLines[i].includes("label:")) {
    console.log((i+1) + ": " + hLines[i].trimEnd());
  }
}
