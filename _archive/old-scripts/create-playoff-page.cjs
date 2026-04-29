const fs = require("fs");

// 1) Create PlayoffPage (public)
const page = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbPlayoffSeries, dbPlayoffMatches } from '@/lib/supabase-db';

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

export default function PlayoffPage() {
  const { teams, competitions, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();
  const [tab, setTab] = useState('superliga');
  const [allSeries, setAllSeries] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dbPlayoffSeries.getAll().catch(() => []),
      dbPlayoffMatches.getAll().catch(() => []),
    ]).then(([s, m]) => {
      setAllSeries(s);
      setAllMatches(m);
      setLoading(false);
    });
  }, []);

  const getTeamName = (id) => teams.find(t => t.id === id)?.name || '?';
  const getTeamLogo = (id) => teams.find(t => t.id === id)?.logo || '';

  const currentSeries = allSeries.filter(s => s.type === tab && (activeSeason ? s.seasonId === activeSeason.id : true));
  const quarterSeries = currentSeries.filter(s => s.round === 'quarter');
  const semiSeries = currentSeries.filter(s => s.round === 'semi');
  const finalSeries = currentSeries.filter(s => s.round === 'final');

  const getSeriesScore = (seriesId) => {
    const matches = allMatches.filter(m => m.seriesId === seriesId && m.status === 'finished');
    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return { t1Wins: 0, t2Wins: 0, decided: false, winnerId: null };
    let t1Wins = 0, t2Wins = 0;
    matches.forEach(m => {
      const hs = m.homeScore ?? 0, as_ = m.awayScore ?? 0;
      if (hs > as_) { if (m.homeTeamId === series.team1Id) t1Wins++; else t2Wins++; }
      else if (as_ > hs) { if (m.awayTeamId === series.team1Id) t1Wins++; else t2Wins++; }
    });
    return { t1Wins, t2Wins, decided: t1Wins >= 2 || t2Wins >= 2, winnerId: t1Wins >= 2 ? series.team1Id : t2Wins >= 2 ? series.team2Id : null };
  };

  const renderSeries = (s) => {
    const score = getSeriesScore(s.id);
    const matches = allMatches.filter(m => m.seriesId === s.id);
    const logo1 = getTeamLogo(s.team1Id);
    const logo2 = getTeamLogo(s.team2Id);
    const isDecided = score.decided;

    return (
      <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Teams Header */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {logo1 ? <img src={logo1} alt="" className="w-12 h-12 rounded-lg object-contain border border-gray-100" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">{getTeamName(s.team1Id).charAt(0)}</div>}
              <div>
                <p className={"font-black text-base " + (score.winnerId === s.team1Id ? "text-green-600" : "text-gray-800")}>{getTeamName(s.team1Id)}</p>
                {s.team1Seed > 0 && <p className="text-[10px] text-gray-400 font-medium">Vendi {s.team1Seed}</p>}
              </div>
            </div>
            <div className="text-center px-6">
              <div className="flex items-center gap-3">
                <span className={"text-3xl font-black " + (score.t1Wins > score.t2Wins ? "text-green-600" : "text-gray-300")}>{score.t1Wins}</span>
                <span className="text-gray-200 text-xl">-</span>
                <span className={"text-3xl font-black " + (score.t2Wins > score.t1Wins ? "text-green-600" : "text-gray-300")}>{score.t2Wins}</span>
              </div>
              {isDecided ? (
                <p className="text-[10px] font-black text-green-500 uppercase mt-1">Kalon {getTeamName(score.winnerId)}</p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">Dy fitore per te kaluar</p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                <p className={"font-black text-base " + (score.winnerId === s.team2Id ? "text-green-600" : "text-gray-800")}>{getTeamName(s.team2Id)}</p>
                {s.team2Seed > 0 && <p className="text-[10px] text-gray-400 font-medium">Vendi {s.team2Seed}</p>}
              </div>
              {logo2 ? <img src={logo2} alt="" className="w-12 h-12 rounded-lg object-contain border border-gray-100" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">{getTeamName(s.team2Id).charAt(0)}</div>}
            </div>
          </div>
        </div>

        {/* Individual Matches */}
        {matches.length > 0 && (
          <div className="border-t border-gray-100 divide-y divide-gray-50">
            {matches.map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs font-bold text-gray-400 w-20">Ndeshja {m.matchNumber}</span>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <span className="text-sm font-bold text-gray-700">{getTeamName(m.homeTeamId)}</span>
                  {m.status === 'finished' ? (
                    <div className="bg-[#F1F5F9] rounded-lg px-3 py-1">
                      <span className={"text-base font-black " + ((m.homeScore ?? 0) > (m.awayScore ?? 0) ? "text-green-600" : "text-gray-600")}>{m.homeScore}</span>
                      <span className="text-gray-300 mx-1">-</span>
                      <span className={"text-base font-black " + ((m.awayScore ?? 0) > (m.homeScore ?? 0) ? "text-green-600" : "text-gray-600")}>{m.awayScore}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">vs</span>
                  )}
                  <span className="text-sm font-bold text-gray-700">{getTeamName(m.awayTeamId)}</span>
                </div>
                <span className="text-[10px] text-gray-400 w-20 text-right">{m.date ? formatDate(m.date) : ''} {m.time || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const roundLabel = (r) => ({ quarter: 'Cerekfinale', semi: 'Gjysmefinale', final: 'Finalja' }[r] || r);

  if (loading) return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="flex items-center justify-center py-32"><div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" /></div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" /></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#d0a650] rounded-full"></span>PlayOff
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">PlayOff {activeSeason?.name || ''}</h1>
            <p className="text-white/60 text-sm">Faza eliminatore - Dy fitore per te kaluar ne raundin tjeter</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-white rounded-xl p-1 mb-8 border border-gray-100 shadow-sm">
          <button onClick={() => setTab('superliga')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (tab === 'superliga' ? "bg-[#1E6FF2] text-white shadow-md shadow-blue-200" : "text-gray-500 hover:text-gray-800")}>PlayOff Superliga</button>
          <button onClick={() => setTab('liga_pare')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (tab === 'liga_pare' ? "bg-[#1E6FF2] text-white shadow-md shadow-blue-200" : "text-gray-500 hover:text-gray-800")}>PlayOff Liga e Pare</button>
        </div>

        {tab === 'superliga' ? (
          <div className="space-y-8">
            {quarterSeries.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>Cerekfinale
                  <span className="text-xs text-gray-400 font-normal ml-2">Vendi 3 vs 6 &bull; Vendi 4 vs 5</span>
                </h2>
                <div className="space-y-4">{quarterSeries.map(s => renderSeries(s))}</div>
              </div>
            )}
            {semiSeries.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>Gjysmefinale
                  <span className="text-xs text-gray-400 font-normal ml-2">Vendi 1 & 2 presin fituesit</span>
                </h2>
                <div className="space-y-4">{semiSeries.map(s => renderSeries(s))}</div>
              </div>
            )}
            {finalSeries.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#d0a650] rounded-full"></span>Finalja
                </h2>
                <div className="space-y-4">{finalSeries.map(s => renderSeries(s))}</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {currentSeries.length > 0 ? (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>Barrage
                  <span className="text-xs text-gray-400 font-normal ml-2">Vendi 8 Superliga vs Vendi 3 Liga e Pare</span>
                </h2>
                <div className="space-y-4">{currentSeries.map(s => renderSeries(s))}</div>
              </div>
            ) : null}
          </div>
        )}

        {currentSeries.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
            <p className="text-gray-400">Nuk ka ndeshje playoff te shtuara</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
`;
fs.writeFileSync("src/pages/PlayoffPage.tsx", page, "utf8");
console.log("[OK] PlayoffPage created (" + page.split("\n").length + " lines)");

// 2) Add route
let app = fs.readFileSync("src/App.tsx", "utf8");
if (!app.includes("PlayoffPage")) {
  app = app.replace(
    'import KombetarjaPage from "./pages/KombetarjaPage";',
    'import KombetarjaPage from "./pages/KombetarjaPage";\nimport PlayoffPage from "./pages/PlayoffPage";'
  );
  app = app.replace(
    '<Route path="/kombetarja" element={<KombetarjaPage />} />',
    '<Route path="/kombetarja" element={<KombetarjaPage />} />\n                <Route path="/playoff" element={<PlayoffPage />} />'
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[OK] Route /playoff added");
}

// 3) Add to Header nav
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
if (!header.includes("playoff")) {
  header = header.replace(
    "{ path: '/kombetarja', label: 'Kombetarja' },",
    "{ path: '/kombetarja', label: 'Kombetarja' },\n    { path: '/playoff', label: 'PlayOff' },"
  );
  fs.writeFileSync("src/components/Header.tsx", header, "utf8");
  console.log("[OK] PlayOff added to nav");
}

// 4) Add AdminPlayoff to admin panel tabs
let adminPage = fs.readFileSync("src/pages/Admin.tsx", "utf8");
if (!adminPage.includes("AdminPlayoff")) {
  // Check current admin structure
  const lines = adminPage.split("\n");
  console.log("\n=== Admin.tsx first 20 lines ===");
  lines.slice(0, 20).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
}

console.log("\n[DONE] PlayoffPage + routes + nav");
