const fs = require("fs");

const modal = `import React, { useState } from 'react';
import { Match } from '@/types';
import { useData } from '@/context/DataContext';

function formatDate(iso?: string): string {
  if (!iso) return "";
  const p = iso.split("-");
  if (p.length !== 3) return iso;
  return \`\${Number(p[2])}/\${Number(p[1])}/\${p[0]}\`;
}

interface Props {
  match: Match | null;
  onClose: () => void;
}

const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const { getTeamById, getGoalsByMatch, players, competitions } = useData();
  const [activeSection, setActiveSection] = useState<'goals' | 'stats' | 'officials'>('goals');

  if (!match) return null;

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const goals = getGoalsByMatch(match.id);
  const comp = competitions.find(c => c.id === match.competitionId);

  const getPlayerName = (playerId: string) => {
    const p = players.find(pl => pl.id === playerId);
    return p ? \`\${p.firstName} \${p.lastName}\` : 'I panjohur';
  };

  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const isPlanned = match.status === 'planned';

  const hasStats = match.possession_home != null || match.shots_home != null || match.fouls_home != null;
  const hasOfficials = match.referee1 || match.referee2 || match.referee3 || match.delegate;

  const sections = [
    { key: 'goals' as const, label: 'Golat', count: goals.length },
    ...(hasStats ? [{ key: 'stats' as const, label: 'Statistikat', count: 0 }] : []),
    ...(hasOfficials ? [{ key: 'officials' as const, label: 'Zyrtaret', count: 0 }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={function(e) { e.stopPropagation(); }}
      >
        {/* === HERO HEADER === */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#070E1A] via-[#0A1E3C] to-[#1E6FF2]" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E6FF2]/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#3B82F6]/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1E6FF2]/5 rounded-full blur-3xl" />
          </div>

          {/* Close & Drag indicator */}
          <div className="relative z-20 flex items-center justify-between px-5 pt-4">
            <div className="w-9" />
            <div className="w-10 h-1 rounded-full bg-white/20" />
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all text-white/80 hover:text-white text-sm font-bold">
              ✕
            </button>
          </div>

          <div className="relative z-10 px-6 pt-3 pb-7">
            {/* Competition Badge */}
            {comp && (
              <div className="flex justify-center mb-5">
                <span className="px-4 py-1.5 bg-white/8 backdrop-blur-md rounded-full text-[10px] font-bold text-white/80 uppercase tracking-[0.15em] border border-white/10">
                  {comp.name} \\u2022 Java {match.week}
                </span>
              </div>
            )}

            {/* Teams & Score */}
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md scale-110" />
                  <div className="relative w-[72px] h-[72px] rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center overflow-hidden shadow-xl">
                    {homeTeam?.logo ? (
                      <img src={homeTeam.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/40 text-2xl font-black">{homeTeam?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                </div>
                <span className="text-[13px] font-bold text-white text-center leading-tight max-w-[110px]">{homeTeam?.name || 'TBD'}</span>
              </div>

              {/* Score Center */}
              <div className="flex flex-col items-center px-3">
                {isLive && (
                  <div className="flex items-center gap-1.5 mb-2.5 px-3.5 py-1 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/20">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em]">Live</span>
                  </div>
                )}
                {isFinished && (
                  <div className="flex items-center gap-1.5 mb-2.5 px-3 py-1 bg-emerald-500/15 backdrop-blur-sm rounded-full border border-emerald-500/15">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Perfunduar</span>
                  </div>
                )}
                {isPlanned && (
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5">E Ardhshme</span>
                )}
                <div className="flex items-center">
                  <span className="text-[52px] font-black text-white tabular-nums leading-none tracking-tight">{isPlanned ? '-' : (match.homeScore ?? 0)}</span>
                  <div className="flex flex-col items-center gap-1 mx-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                  </div>
                  <span className="text-[52px] font-black text-white tabular-nums leading-none tracking-tight">{isPlanned ? '-' : (match.awayScore ?? 0)}</span>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md scale-110" />
                  <div className="relative w-[72px] h-[72px] rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center overflow-hidden shadow-xl">
                    {awayTeam?.logo ? (
                      <img src={awayTeam.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/40 text-2xl font-black">{awayTeam?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                </div>
                <span className="text-[13px] font-bold text-white text-center leading-tight max-w-[110px]">{awayTeam?.name || 'TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === MATCH INFO STRIP === */}
        <div className="flex items-center justify-center gap-4 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-100">
          {match.date && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
              <span className="w-4 h-4 rounded-md bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] text-[8px] font-black">D</span>
              {formatDate(match.date)}
            </span>
          )}
          {match.time && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
              <span className="w-4 h-4 rounded-md bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] text-[8px] font-black">T</span>
              {match.time}
            </span>
          )}
          {match.venue && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
              <span className="w-4 h-4 rounded-md bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] text-[8px] font-black">S</span>
              {match.venue}
            </span>
          )}
        </div>

        {/* === TAB NAVIGATION === */}
        {sections.length > 0 && (
          <div className="flex border-b border-gray-100">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={\`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all relative \${
                  activeSection === s.key
                    ? 'text-[#1E6FF2]'
                    : 'text-gray-400 hover:text-gray-600'
                }\`}
              >
                {s.label}
                {s.count > 0 && (
                  <span className={\`ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black \${
                    activeSection === s.key ? 'bg-[#1E6FF2] text-white' : 'bg-gray-100 text-gray-400'
                  }\`}>{s.count}</span>
                )}
                {activeSection === s.key && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#1E6FF2] rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* === CONTENT BODY === */}
        <div className="overflow-y-auto max-h-[calc(95vh-340px)]">
          <div className="px-6 py-5">

            {/* Goals */}
            {activeSection === 'goals' && (
              goals.length > 0 ? (
                <div className="space-y-0">
                  {goals
                    .sort((a, b) => (a.minute || 0) - (b.minute || 0))
                    .map((g, gi) => {
                      const isHome = g.teamId === match.homeTeamId;
                      const team = isHome ? homeTeam : awayTeam;
                      return (
                        <div key={g.id} className="relative">
                          {gi > 0 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-gray-200" />}
                          <div className={\`flex items-center gap-3 py-3 \${isHome ? '' : 'flex-row-reverse'}\`}>
                            <div className={\`flex items-center gap-3 flex-1 min-w-0 \${isHome ? '' : 'flex-row-reverse'}\`}>
                              <div className={\`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm \${
                                g.isOwnGoal
                                  ? 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
                                  : 'bg-gradient-to-br from-[#1E6FF2]/5 to-[#1E6FF2]/15 border border-[#1E6FF2]/20'
                              }\`}>
                                <span className={\`text-[10px] font-black \${g.isOwnGoal ? 'text-red-500' : 'text-[#1E6FF2]'}\`}>{g.minute}'</span>
                              </div>
                              <div className={\`flex-1 min-w-0 \${isHome ? '' : 'text-right'}\`}>
                                <p className="text-sm font-bold text-gray-800 truncate">{getPlayerName(g.playerId)}</p>
                                <p className={\`text-[10px] font-medium \${g.isOwnGoal ? 'text-red-400' : 'text-gray-400'}\`}>
                                  {g.isOwnGoal ? 'Autogol' : 'Gol'}
                                  {team?.name ? \` \\u2022 \${team.name}\` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                          {gi < goals.length - 1 && <div className="border-b border-gray-50" />}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-gray-300">0</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{isPlanned ? 'Ndeshja nuk ka filluar ende' : 'Nuk ka gola ne kete ndeshje'}</p>
                </div>
              )
            )}

            {/* Stats */}
            {activeSection === 'stats' && hasStats && (
              <div className="space-y-5">
                {match.possession_home != null && (
                  <StatBarPremium label="Posedimi" home={match.possession_home} away={match.possession_away ?? 0} suffix="%" />
                )}
                {match.shots_home != null && (
                  <StatBarPremium label="Goditjet" home={match.shots_home} away={match.shots_away ?? 0} />
                )}
                {match.fouls_home != null && (
                  <StatBarPremium label="Faull-et" home={match.fouls_home} away={match.fouls_away ?? 0} />
                )}
              </div>
            )}

            {/* Officials */}
            {activeSection === 'officials' && hasOfficials && (
              <div className="space-y-2.5">
                {[
                  { key: 'referee1', label: 'Gjyqtari 1', abbr: 'G1', color: 'bg-[#0A1E3C]', value: match.referee1 },
                  { key: 'referee2', label: 'Gjyqtari 2', abbr: 'G2', color: 'bg-[#0A1E3C]', value: match.referee2 },
                  { key: 'referee3', label: 'Gjyqtari 3', abbr: 'G3', color: 'bg-[#0A1E3C]', value: match.referee3 },
                  { key: 'delegate', label: 'Delegati', abbr: 'D', color: 'bg-[#1E6FF2]', value: match.delegate },
                ].filter(o => o.value).map(o => (
                  <div key={o.key} className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className={\`w-9 h-9 rounded-xl \${o.color} flex items-center justify-center flex-shrink-0 shadow-sm\`}>
                      <span className="text-white text-[10px] font-black">{o.abbr}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{o.label}</p>
                      <p className="text-sm font-bold text-gray-800">{o.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBarPremium: React.FC<{ label: string; home: number; away: number; suffix?: string }> = ({ label, home, away, suffix }) => {
  const total = home + away || 1;
  const homePercent = Math.round((home / total) * 100);
  const awayPercent = 100 - homePercent;
  const homeWins = home > away;
  const awayWins = away > home;

  return (
    <div className="bg-gray-50/80 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={\`text-lg font-black tabular-nums \${homeWins ? 'text-[#1E6FF2]' : 'text-gray-700'}\`}>{home}{suffix || ''}</span>
          {homeWins && <span className="w-1.5 h-1.5 rounded-full bg-[#1E6FF2]" />}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{label}</span>
        <div className="flex items-center gap-2">
          {awayWins && <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />}
          <span className={\`text-lg font-black tabular-nums \${awayWins ? 'text-[#F97316]' : 'text-gray-700'}\`}>{away}{suffix || ''}</span>
        </div>
      </div>
      <div className="flex gap-1.5 h-2.5 rounded-full overflow-hidden bg-gray-200">
        <div
          className={\`rounded-full transition-all duration-700 ease-out \${homeWins ? 'bg-gradient-to-r from-[#1E6FF2] to-[#3B82F6]' : 'bg-[#1E6FF2]/50'}\`}
          style={Object.assign({}, { width: \`\${homePercent}%\` })}
        />
        <div
          className={\`rounded-full transition-all duration-700 ease-out \${awayWins ? 'bg-gradient-to-r from-[#F97316] to-[#FB923C]' : 'bg-[#F97316]/50'}\`}
          style={Object.assign({}, { width: \`\${awayPercent}%\` })}
        />
      </div>
    </div>
  );
};

export default MatchDetailModal;
`;

fs.writeFileSync("src/components/MatchDetailModal.tsx", modal, "utf8");
console.log("[OK] MatchDetailModal.tsx — komplet redizajnuar me dizajn ultra-modern");
