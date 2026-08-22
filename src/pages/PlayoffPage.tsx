import React, { useState, useEffect } from 'react';
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
    const matches = allMatches.filter(m => m.seriesId === seriesId && m.status === 'finished').sort((a, b) => (a.matchNumber || 1) - (b.matchNumber || 1));
    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return { t1Wins: 0, t2Wins: 0, t1Agg: 0, t2Agg: 0, decided: false, winnerId: null, needsGame3: false };
    
    let t1Agg = 0, t2Agg = 0;
    matches.forEach(m => {
      const hs = m.homeScore ?? 0, as_ = m.awayScore ?? 0;
      if (m.homeTeamId === series.team1Id) { t1Agg += hs; t2Agg += as_; }
      else { t2Agg += hs; t1Agg += as_; }
    });

    // After 2 matches check aggregate
    const game1 = matches.find(m => m.matchNumber === 1);
    const game2 = matches.find(m => m.matchNumber === 2);
    const game3 = matches.find(m => m.matchNumber === 3);
    
    let decided = false, winnerId = null, needsGame3 = false;
    
    if (game1 && game2 && !game3) {
      // Two matches played - check aggregate
      if (t1Agg > t2Agg) { decided = true; winnerId = series.team1Id; }
      else if (t2Agg > t1Agg) { decided = true; winnerId = series.team2Id; }
      else { needsGame3 = true; } // Aggregate tied, need game 3
    } else if (game3) {
      // Game 3 played - winner of game 3 goes through
      const g3hs = game3.homeScore ?? 0, g3as = game3.awayScore ?? 0;
      // Recalculate full aggregate with all 3 games
      if (t1Agg > t2Agg) { decided = true; winnerId = series.team1Id; }
      else if (t2Agg > t1Agg) { decided = true; winnerId = series.team2Id; }
    }

    return { t1Wins: 0, t2Wins: 0, t1Agg, t2Agg, decided, winnerId, needsGame3, matchesPlayed: matches.length };
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
                <span className={"text-3xl font-black " + (score.t1Agg > score.t2Agg ? "text-green-600" : "text-gray-300")}>{score.t1Agg}</span>
                <span className="text-gray-200 text-xl">-</span>
                <span className={"text-3xl font-black " + (score.t2Agg > score.t1Agg ? "text-green-600" : "text-gray-300")}>{score.t2Agg}</span>
              </div>
              {isDecided ? (
                <p className="text-[10px] font-black text-green-500 uppercase mt-1">Kalon {getTeamName(score.winnerId)}</p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">{score.needsGame3 ? "Barazim - Ndeshja 3 vendimtare" : "Golaverazhi"}</p>
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
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <div className="flex items-center justify-center py-32"><div className="w-12 h-12 rounded-full border-4 border-[#0f1830]/20 border-t-[#0f1830] animate-spin" /></div>
      <div className="mt-auto"><Footer /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#0f1830] to-[#0f1830] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
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
          <button onClick={() => setTab('superliga')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (tab === 'superliga' ? "bg-[#0f1830] text-white shadow-md shadow-[#0f1830]/25" : "text-gray-500 hover:text-gray-800")}>PlayOff Superliga</button>
          <button onClick={() => setTab('liga_pare')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (tab === 'liga_pare' ? "bg-[#0f1830] text-white shadow-md shadow-[#0f1830]/25" : "text-gray-500 hover:text-gray-800")}>PlayOff Liga e Pare</button>
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
                  <span className="w-1.5 h-6 bg-[#0f1830]/100 rounded-full"></span>Gjysmefinale
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
      <div className="mt-auto"><Footer /></div>
    </div>
  );
}


