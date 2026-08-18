const fs = require("fs");

const kupa = `import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Match } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchDetailModal from '@/components/MatchDetailModal';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return \`\${p[2]}/\${p[1]}/\${p[0]}\`;
  return iso;
}

interface Tie {
  teamA: string;
  teamB: string;
  leg1?: Match;
  leg2?: Match;
  aggA: number;
  aggB: number;
  isComplete: boolean;
  winner?: string;
}

const KupaPage: React.FC = () => {
  const { competitions, matches, getActiveSeason, getTeamById, getAggregatedScorers, getGoalsByMatch } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'bracket' | 'golashenuesit'>('bracket');

  const comp = useMemo(() =>
    competitions.find(c => c.type === 'kupa' && (activeSeason ? c.seasonId === activeSeason.id : true)),
    [competitions, activeSeason]
  );

  const cupMatches = useMemo(() =>
    comp ? matches.filter(m => m.competitionId === comp.id) : [],
    [comp, matches]
  );

  // Group matches into ties (two legs between same teams)
  const rounds = useMemo(() => {
    const roundMap: Record<number, Match[]> = {};
    cupMatches.forEach(m => {
      if (!roundMap[m.week]) roundMap[m.week] = [];
      roundMap[m.week].push(m);
    });

    return Object.entries(roundMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([round, ms]) => {
        // Group into ties
        const ties: Tie[] = [];
        const used = new Set<string>();

        ms.forEach(m => {
          if (used.has(m.id)) return;
          // Find the other leg (same teams, reversed home/away)
          const otherLeg = ms.find(m2 =>
            m2.id !== m.id &&
            !used.has(m2.id) &&
            ((m2.homeTeamId === m.awayTeamId && m2.awayTeamId === m.homeTeamId) ||
             (m2.homeTeamId === m.homeTeamId && m2.awayTeamId === m.awayTeamId))
          );

          used.add(m.id);

          let leg1 = m;
          let leg2 = otherLeg || undefined;

          if (otherLeg) {
            used.add(otherLeg.id);
            // Sort by date so leg1 is first
            if (leg2 && leg2.date && leg1.date && leg2.date < leg1.date) {
              [leg1, leg2] = [leg2, leg1];
            }
          }

          const teamA = leg1.homeTeamId;
          const teamB = leg1.awayTeamId;

          // Calculate aggregate
          let aggA = 0;
          let aggB = 0;

          if (leg1.status === 'finished') {
            aggA += leg1.homeScore ?? 0;
            aggB += leg1.awayScore ?? 0;
          }
          if (leg2 && leg2.status === 'finished') {
            // In leg2, teamA might be away
            if (leg2.homeTeamId === teamA) {
              aggA += leg2.homeScore ?? 0;
              aggB += leg2.awayScore ?? 0;
            } else {
              aggA += leg2.awayScore ?? 0;
              aggB += leg2.homeScore ?? 0;
            }
          }

          const bothFinished = leg1.status === 'finished' && (!leg2 || leg2.status === 'finished');
          const winner = bothFinished ? (aggA > aggB ? teamA : aggB > aggA ? teamB : undefined) : undefined;

          ties.push({ teamA, teamB, leg1, leg2, aggA, aggB, isComplete: bothFinished, winner });
        });

        return { round: Number(round), ties };
      });
  }, [cupMatches]);

  const roundNames: Record<number, string> = {
    1: 'Raundi 1',
    2: 'Cerekfinalet',
    3: 'Gjysme finalet',
    4: 'Finalja',
  };

  const scorers = useMemo(() => comp ? getAggregatedScorers(comp.id).slice(0, 20) : [], [comp, getAggregatedScorers]);

  const tabItems = [
    { key: 'bracket' as const, label: 'Bracket' },
    { key: 'golashenuesit' as const, label: 'Golashenuesit' },
  ];

  // Mini match row inside a tie card
  const LegRow: React.FC<{ match: Match; legLabel: string }> = ({ match, legLabel }) => {
    const home = getTeamById(match.homeTeamId);
    const away = getTeamById(match.awayTeamId);
    const isFinished = match.status === 'finished';
    const isLive = match.status === 'live';
    const goals = getGoalsByMatch(match.id);

    const homeGoals = goals.filter(g => g.teamId === match.homeTeamId);
    const awayGoals = goals.filter(g => g.teamId === match.awayTeamId);

    const getPlayerName = (playerId: string) => {
      const pl = (window as any).__players || [];
      return '';
    };

    return (
      <div
        className={\`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md \${isLive ? 'border-red-200 shadow-sm shadow-red-50' : 'border-gray-100 hover:border-[#1E6FF2]/20'}\`}
        onClick={() => setSelectedMatch(match)}
      >
        {/* Leg label + date */}
        <div className={\`flex items-center justify-between px-3 py-1.5 border-b \${isLive ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'}\`}>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{legLabel}</span>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
              </span>
            )}
            {match.date && <span className="text-[10px] text-gray-400">{formatDate(match.date)}</span>}
            {match.time && <span className="text-[10px] text-gray-400">{match.time}</span>}
          </div>
        </div>

        <div className="px-3 py-2.5">
          {/* Home */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 font-bold">{home?.name?.charAt(0)}</span>}
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">{home?.name || 'TBD'}</span>
            </div>
            <span className={\`text-lg font-black tabular-nums \${isFinished || isLive ? 'text-gray-900' : 'text-gray-300'}\`}>
              {isFinished || isLive ? (match.homeScore ?? 0) : '-'}
            </span>
          </div>
          {/* Away */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 font-bold">{away?.name?.charAt(0)}</span>}
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">{away?.name || 'TBD'}</span>
            </div>
            <span className={\`text-lg font-black tabular-nums \${isFinished || isLive ? 'text-gray-900' : 'text-gray-300'}\`}>
              {isFinished || isLive ? (match.awayScore ?? 0) : '-'}
            </span>
          </div>

          {/* Goal scorers */}
          {goals.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-50">
              <div className="flex gap-4">
                {homeGoals.length > 0 && (
                  <div className="flex-1">
                    {homeGoals.sort((a, b) => (a.minute || 0) - (b.minute || 0)).map(g => {
                      const pl = (useData as any).getState?.()?.players?.find?.((p: any) => p.id === g.playerId);
                      return (
                        <p key={g.id} className="text-[10px] text-gray-500">{g.minute}' <span className="font-medium text-gray-600">{g.playerName || ''}</span>{g.isOwnGoal ? ' (AG)' : ''}</p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-2 text-center">
            <span className="text-[10px] text-[#1E6FF2] font-semibold cursor-pointer hover:underline">Shiko te dhenat \\u203A</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kupa e Kosoves</h1>
          <p className="text-gray-400 text-sm mt-1">Sezoni {activeSeason?.name || ''}</p>
        </div>

        <div className="flex gap-2 mb-8">
          {tabItems.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={\`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 \${
                activeTab === t.key
                  ? 'bg-[#0A1E3C] text-white shadow-lg'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }\`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'bracket' && (
          rounds.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nuk ka ndeshje te regjistruara ne Kupe.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-max pb-4">
                {rounds.map(r => (
                  <div key={r.round} className="min-w-[380px]">
                    <div className="flex items-center gap-2 mb-5 justify-center">
                      <span className="w-1 h-5 bg-[#1E6FF2] rounded-full" />
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                        {roundNames[r.round] || \`Raundi \${r.round}\`}
                      </h3>
                    </div>
                    <div className="space-y-5">
                      {r.ties.map((tie, ti) => {
                        const teamA = getTeamById(tie.teamA);
                        const teamB = getTeamById(tie.teamB);
                        const hasTwoLegs = !!tie.leg2;

                        return (
                          <div key={ti} className="rounded-2xl border-2 border-[#1E6FF2]/15 overflow-hidden" style={Object.assign({}, { background: 'linear-gradient(145deg, #F7F8FA 0%, #EEF0F4 100%)' })}>
                            {/* Aggregate Header */}
                            {hasTwoLegs && (
                              <div className="px-4 py-3 border-b border-[#1E6FF2]/10">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                      {teamA?.logo ? <img src={teamA.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 font-bold">{teamA?.name?.charAt(0)}</span>}
                                    </div>
                                    <span className={\`text-sm font-bold truncate \${tie.winner === tie.teamA ? 'text-[#1E6FF2]' : 'text-gray-700'}\`}>{teamA?.name || 'TBD'}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mx-3">
                                    <span className={\`text-xl font-black tabular-nums \${tie.winner === tie.teamA ? 'text-[#1E6FF2]' : 'text-gray-800'}\`}>{tie.aggA}</span>
                                    <span className="text-gray-300 font-light mx-0.5">:</span>
                                    <span className={\`text-xl font-black tabular-nums \${tie.winner === tie.teamB ? 'text-[#1E6FF2]' : 'text-gray-800'}\`}>{tie.aggB}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                                    <span className={\`text-sm font-bold truncate \${tie.winner === tie.teamB ? 'text-[#1E6FF2]' : 'text-gray-700'}\`}>{teamB?.name || 'TBD'}</span>
                                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                      {teamB?.logo ? <img src={teamB.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 font-bold">{teamB?.name?.charAt(0)}</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center mt-1.5 gap-2">
                                  <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2.5 py-0.5 rounded-full border border-[#1E6FF2]/10">AGREGATI</span>
                                  {tie.isComplete && tie.winner && (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                      Kalon: {tie.winner === tie.teamA ? teamA?.name : teamB?.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Legs */}
                            <div className={\`p-3 space-y-2 \${hasTwoLegs ? '' : ''}\`}>
                              {tie.leg1 && <LegRow match={tie.leg1} legLabel={hasTwoLegs ? "Ndeshja e 1-re" : (roundNames[r.round] === 'Finalja' ? 'Finalja' : 'Ndeshja')} />}
                              {tie.leg2 && <LegRow match={tie.leg2} legLabel="Ndeshja e 2-te" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {activeTab === 'golashenuesit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
            {scorers.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nuk ka golashenues te regjistruar.</p>
            ) : (
              <>
                <div className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3.5 bg-[#0A1E3C] text-xs font-semibold text-gray-300 uppercase">
                  <span>#</span><span></span><span>Lojtari</span><span>Skuadra</span><span className="text-right">Gola</span>
                </div>
                {scorers.map((s, i) => {
                  const team = getTeamById(s.teamId);
                  return (
                    <div key={s.id} className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3 items-center border-t border-gray-50 hover:bg-gray-50/80 transition-colors">
                      <span className={\`text-sm font-bold \${i < 3 ? 'text-[#1E6FF2]' : 'text-gray-400'}\`}>{i + 1}</span>
                      <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                        {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{s.firstName} {s.lastName}</span>
                      <div className="flex items-center gap-1.5">
                        {team?.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-full" />}
                        <span className="text-xs text-gray-500 hidden sm:inline">{team?.name || '-'}</span>
                      </div>
                      <span className="text-right text-sm font-bold text-[#1E6FF2]">{s.goals}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};

export default KupaPage;
`;

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] KupaPage.tsx — Two legs + aggregate score redesigned");
