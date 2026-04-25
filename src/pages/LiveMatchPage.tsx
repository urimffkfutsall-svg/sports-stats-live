import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchDetailModal from '@/components/MatchDetailModal';
import { Match } from '@/types';

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

const LiveMatchPage = () => {
  const { matches, teams, competitions, getActiveSeason, getGoalsByMatch, players, getTeamById } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const liveMatches = useMemo(() =>
    matches.filter(m => m.status === 'live' && (activeSeason ? m.seasonId === activeSeason.id : true)),
    [matches, activeSeason]
  );
  const seasonMatches = useMemo(() =>
    activeSeason ? matches.filter(m => m.seasonId === activeSeason.id) : matches,
    [matches, activeSeason]
  );
  const superligaComp = competitions.find(c => c.type === 'superliga' && (activeSeason ? c.seasonId === activeSeason.id : true));
  const ligaPareComp = competitions.find(c => c.type === 'liga_pare' && (activeSeason ? c.seasonId === activeSeason.id : true));
  const kupaComp = competitions.find(c => c.type === 'kupa' && (activeSeason ? c.seasonId === activeSeason.id : true));

  const getRecent = (compId) => {
    if (!compId) return [];
    return seasonMatches.filter(m => m.competitionId === compId && m.status === 'finished')
      .sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4);
  };
  const getUpcoming = (compId) => {
    if (!compId) return [];
    return seasonMatches.filter(m => m.competitionId === compId && m.status === 'planned')
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 4);
  };

  const LiveCard = ({ match }) => {
    const home = getTeamById(match.homeTeamId);
    const away = getTeamById(match.awayTeamId);
    const comp = competitions.find(c => c.id === match.competitionId);
    const matchGoals = getGoalsByMatch(match.id);
    const homeGoals = matchGoals.filter(g => g.teamId === match.homeTeamId);
    const awayGoals = matchGoals.filter(g => g.teamId === match.awayTeamId);
    return (
      <div onClick={() => setSelectedMatch(match)} className="relative bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 border-[#1E6FF2]/30 shadow-lg shadow-blue-100">
        <div className="bg-gradient-to-r from-[#1E6FF2] to-[#3B82F6] px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span></span>
            <span className="text-white text-xs font-black uppercase tracking-[0.15em]">Live</span>
          </div>
          <div className="flex items-center gap-3">
            {comp && <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{comp.name}</span>}
            {match.week && <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Java {match.week}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-b from-gray-50 to-white border-2 border-gray-100 flex items-center justify-center overflow-hidden p-2">
              {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-gray-300 text-2xl font-black">{home?.name?.charAt(0)}</span>}
            </div>
            <span className="text-gray-800 text-sm font-bold text-center leading-tight">{home?.name || 'TBD'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-4">
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-[#1E6FF2] tabular-nums">{match.homeScore ?? 0}</span>
              <div className="flex flex-col items-center"><span className="w-1.5 h-1.5 bg-[#1E6FF2] rounded-full"></span><span className="w-0.5 h-3 bg-gray-200"></span><span className="w-1.5 h-1.5 bg-[#1E6FF2] rounded-full"></span></div>
              <span className="text-5xl font-black text-[#1E6FF2] tabular-nums">{match.awayScore ?? 0}</span>
            </div>
            {match.venue && <span className="text-gray-400 text-[10px] font-medium">{match.venue}</span>}
          </div>
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-b from-gray-50 to-white border-2 border-gray-100 flex items-center justify-center overflow-hidden p-2">
              {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-gray-300 text-2xl font-black">{away?.name?.charAt(0)}</span>}
            </div>
            <span className="text-gray-800 text-sm font-bold text-center leading-tight">{away?.name || 'TBD'}</span>
          </div>
        </div>
        {(homeGoals.length > 0 || awayGoals.length > 0) && (
          <div className="px-5 pb-4">
            <div className="bg-[#F8FAFC] rounded-xl border border-gray-100 px-4 py-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  {homeGoals.map((g, i) => { const p = players.find(pl => pl.id === g.playerId); return (<div key={i} className="flex items-center gap-1.5 text-gray-600 text-xs"><span className="text-[10px]">{String.fromCharCode(9917)}</span><span className="font-medium">{p ? p.firstName.charAt(0)+'. '+p.lastName : '?'}</span><span className="text-gray-300 text-[10px]">{g.minute}'</span></div>); })}
                </div>
                <div className="space-y-1.5 text-right">
                  {awayGoals.map((g, i) => { const p = players.find(pl => pl.id === g.playerId); return (<div key={i} className="flex items-center gap-1.5 text-gray-600 text-xs justify-end"><span className="text-gray-300 text-[10px]">{g.minute}'</span><span className="font-medium">{p ? p.firstName.charAt(0)+'. '+p.lastName : '?'}</span><span className="text-[10px]">{String.fromCharCode(9917)}</span></div>); })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="px-5 pb-4"><div className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#1E6FF2]/5 hover:bg-[#1E6FF2]/10 text-[#1E6FF2] text-[11px] font-bold rounded-lg transition-colors border border-[#1E6FF2]/10">SHIKO DETAJET</div></div>
      </div>
    );
  };

  const SmallCard = ({ match, type }) => {
    const home = getTeamById(match.homeTeamId);
    const away = getTeamById(match.awayTeamId);
    return (
      <div onClick={() => setSelectedMatch(match)} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#1E6FF2]/20 transition-all cursor-pointer">
        <div className="px-3 py-2.5 flex items-center justify-between">
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
        {type === 'planned' && match.date && (<div className="px-3 pb-2 text-[10px] text-gray-400 text-center">{formatDate(match.date)}</div>)}
      </div>
    );
  };

  const CompSection = ({ name, compId }) => {
    const recent = getRecent(compId);
    const upcoming = getUpcoming(compId);
    if (recent.length === 0 && upcoming.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#1E6FF2] rounded-full"></span>{name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recent.length > 0 && (<div><h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Rezultatet e Fundit</h3><div className="space-y-2">{recent.map(m => <SmallCard key={m.id} match={m} type="finished" />)}</div></div>)}
          {upcoming.length > 0 && (<div><h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-[#1E6FF2] rounded-full"></span>Ndeshjet e Ardhshme</h3><div className="space-y-2">{upcoming.map(m => <SmallCard key={m.id} match={m} type="planned" />)}</div></div>)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1E6FF2]/10 rounded-full mb-3">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E6FF2] opacity-50"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1E6FF2]"></span></span>
            <span className="text-[#1E6FF2] text-xs font-black uppercase tracking-[0.15em]">Live</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Rezultatet Live</h1>
          <p className="text-gray-400 text-sm mt-1">Ndiq ndeshjet ne kohe reale</p>
        </div>

        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {liveMatches.map(m => <LiveCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14 mb-10">
            <div className="w-16 h-16 bg-[#1E6FF2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#1E6FF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">Nuk ka ndeshje live momentalisht</h3>
            <p className="text-sm text-gray-400">Ndeshjet live do te shfaqen ketu automatikisht</p>
          </div>
        )}

        <CompSection name="Superliga e Kosoves" compId={superligaComp?.id} />
        <CompSection name="Liga e Pare" compId={ligaPareComp?.id} />
        <CompSection name="Kupa e Kosoves" compId={kupaComp?.id} />
      </div>
      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
      <Footer />
    </div>
  );
};

export default LiveMatchPage;
