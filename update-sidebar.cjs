const fs = require("fs");
let s = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");

// =====================================================
// 1) Replace ScorerModal with gray+blue premium design
// =====================================================
const oldModalStart = "const ScorerModal: React.FC";
const oldModalEnd = "const LeagueTablesSection";

const modalIdx = s.indexOf(oldModalStart);
const tableIdx = s.indexOf(oldModalEnd);

if (modalIdx > -1 && tableIdx > -1) {
  const before = s.substring(0, modalIdx);
  const after = s.substring(tableIdx);

  const newModal = `const ScorerModal: React.FC<{ scorer: ScorerModalData; onClose: () => void }> = ({ scorer, onClose }) => {
  const { getTeamById, matches, getActiveSeason } = useData();
  const team = getTeamById(scorer.teamId);
  const activeSeason = getActiveSeason();

  const seasonMatches = useMemo(() =>
    activeSeason ? matches.filter(m => m.seasonId === activeSeason.id && m.status === 'finished') : matches.filter(m => m.status === 'finished'),
    [matches, activeSeason]
  );

  const matchesPlayed = useMemo(() =>
    seasonMatches.filter(m => m.homeTeamId === scorer.teamId || m.awayTeamId === scorer.teamId).length,
    [seasonMatches, scorer.teamId]
  );

  const goalsPerMatch = matchesPlayed > 0 ? (scorer.goals / matchesPlayed).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" onClick={onClose} />
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-[#1E6FF2]/40 shadow-[0_0_60px_-10px_rgba(30,111,242,0.3)]"
        style={Object.assign({}, { background: 'linear-gradient(145deg, #F0F2F5 0%, #E8EBF0 50%, #F0F2F5 100%)' })}
        onClick={e => e.stopPropagation()}
      >
        {/* Top blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-[#1E6FF2]/5 blur-2xl" />

        {/* Close */}
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all text-gray-500 hover:text-red-500 text-lg font-bold shadow-md">
          \\u00D7
        </button>

        {/* Player Header */}
        <div className="px-6 pt-6 pb-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#1E6FF2]/15 rounded-lg mb-4 shadow-sm">
            <span className="text-[10px] font-bold text-[#1E6FF2] uppercase tracking-wider">Golashenues</span>
          </div>
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#1E6FF2]/20 to-[#1E6FF2]/5 rounded-2xl blur-sm" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#1E6FF2]/20 shadow-xl bg-white">
              {scorer.photo ? <img src={scorer.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{scorer.firstName.charAt(0)}{scorer.lastName.charAt(0)}</div>}
            </div>
          </div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">{scorer.firstName} {scorer.lastName}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            {team?.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-full border border-gray-200" />}
            <span className="text-sm text-gray-500 font-medium">{team?.name || '-'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-5 pb-5 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-3.5 text-center border border-[#1E6FF2]/15 shadow-sm">
              <span className="block text-2xl font-black text-[#1E6FF2]">{scorer.goals}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Gola</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 text-center border border-gray-200 shadow-sm">
              <span className="block text-2xl font-black text-gray-700">{matchesPlayed}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Ndeshje</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 text-center border border-gray-200 shadow-sm">
              <span className="block text-2xl font-black text-gray-700">{goalsPerMatch}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Mesatare</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-600">Progresi i Golave</span>
              <span className="text-xs font-black text-[#1E6FF2]">{scorer.goals} gola</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#1E6FF2] to-[#3B82F6] rounded-full transition-all duration-700" style={Object.assign({}, { width: \`\${Math.min((scorer.goals / Math.max(scorer.goals + 5, 20)) * 100, 100)}%\` })} />
            </div>
          </div>

          {/* Team Card */}
          {team && (
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#1E6FF2]/15 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                {team.logo ? <img src={team.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-gray-400 text-xs font-bold">{team.name?.charAt(0)}</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{team.name}</p>
                <p className="text-[11px] text-gray-400">Skuadra aktuale</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom blue glow */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2]/40 to-transparent" />
      </div>
    </div>
  );
};

`;

  s = before + newModal + after;
}

// =====================================================
// 2) Replace Player of Week sidebar card
// =====================================================
s = s.replace(
  /\{\/\* Player of the Week \*\/\}\s*\{pow && \(\s*<Link[\s\S]*?<\/Link>\s*\)\}/,
  `{/* Player of the Week */}
        {pow && (
          <Link to="/lojtari-javes" className="block group">
            <div className="rounded-xl overflow-hidden border-2 border-[#1E6FF2]/30 shadow-[0_0_30px_-8px_rgba(30,111,242,0.2)] hover:shadow-[0_0_40px_-5px_rgba(30,111,242,0.3)] transition-all duration-300 hover:-translate-y-1" style={Object.assign({}, { background: 'linear-gradient(145deg, #F0F2F5 0%, #E8EBF0 100%)' })}>
              {/* Top blue glow */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2] to-transparent" />
              <div className="px-5 pt-5 pb-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#1E6FF2]/15 rounded-lg shadow-sm">
                  <span className="text-[10px] font-bold text-[#1E6FF2] uppercase tracking-wider">Lojtari i Javes</span>
                </div>
              </div>
              <div className="flex justify-center py-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#1E6FF2]/20 to-[#1E6FF2]/5 rounded-2xl blur-sm" />
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-[#1E6FF2]/20 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    {pow.photo ? <img src={pow.photo} alt={pow.firstName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-black">{pow.firstName.charAt(0)}{pow.lastName.charAt(0)}</div>}
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#1E6FF2]/10 rounded-md text-[10px] font-bold text-[#1E6FF2] uppercase tracking-wider mb-2 border border-[#1E6FF2]/10">Java {pow.week}</span>
                <h3 className="text-lg font-black text-gray-800 mb-2">{pow.firstName} {pow.lastName}</h3>
                <div className="flex items-center justify-center gap-2">
                  {powTeam?.logo && <img src={powTeam.logo} alt={powTeam.name} className="w-5 h-5 rounded-full border border-gray-200" />}
                  <span className="text-sm text-gray-500 font-medium">{powTeam?.name || '-'}</span>
                </div>
                {pow.isScorer && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#1E6FF2]/15 rounded-lg shadow-sm">
                    <span className="text-xs font-bold text-[#1E6FF2]">{pow.goalsCount} Gola</span>
                  </div>
                )}
              </div>
              {/* Bottom blue glow */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2]/30 to-transparent" />
            </div>
          </Link>
        )}`
);

// =====================================================
// 3) Replace Top Scorers sidebar card
// =====================================================
s = s.replace(
  /\{\/\* Top Scorers \*\/\}\s*\{topScorers\.length > 0 && \(\s*<div className="bg-white[\s\S]*?<\/div>\s*\)\}/,
  `{/* Top Scorers */}
        {topScorers.length > 0 && (
          <div className="rounded-xl overflow-hidden border-2 border-[#1E6FF2]/25 shadow-[0_0_30px_-8px_rgba(30,111,242,0.15)]" style={Object.assign({}, { background: 'linear-gradient(145deg, #F0F2F5 0%, #E8EBF0 100%)' })}>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2] to-transparent" />
            <div className="px-5 py-3.5 flex items-center gap-2 border-b border-gray-200/60">
              <span className="text-sm font-bold text-gray-800">Top Golashenuesit</span>
              <span className="ml-auto text-[10px] font-bold text-[#1E6FF2] bg-white px-2 py-0.5 rounded-md border border-[#1E6FF2]/15">TOP 3</span>
            </div>
            <div className="p-3 space-y-2">
              {topScorers.map((s, i) => {
                const team = getTeamById(s.teamId);
                const rankColors = ['border-[#1E6FF2]/30 bg-white shadow-md', 'border-gray-200 bg-white shadow-sm', 'border-gray-200 bg-white shadow-sm'];
                const numColors = ['bg-gradient-to-br from-[#1E6FF2] to-[#3B82F6] text-white', 'bg-gray-200 text-gray-500', 'bg-gray-200 text-gray-500'];
                return (
                  <div key={s.id} onClick={() => setSelectedScorer(s)} className={\`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#1E6FF2]/30 \${rankColors[i]}\`}>
                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 \${numColors[i]}\`}>
                      <span className="text-sm font-black">{i + 1}</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-50 border-2 border-white shadow-md flex-shrink-0">
                      {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-gray-400 text-xs font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{s.firstName} {s.lastName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {team?.logo && <img src={team.logo} alt="" className="w-4 h-4 rounded-full" />}
                        <span className="text-[11px] text-gray-400 font-medium">{team?.name || '-'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-[#1E6FF2]">{s.goals}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Gola</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E6FF2]/30 to-transparent" />
          </div>
        )}`
);

fs.writeFileSync("src/components/LeagueTablesSection.tsx", s, "utf8");
console.log("[OK] LeagueTablesSection.tsx - Player of Week, Top Scorers, ScorerModal all redesigned");
