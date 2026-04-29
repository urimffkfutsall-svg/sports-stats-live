const fs = require("fs");
const p2 = `
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
`;
fs.appendFileSync("src/pages/LiveMatchPage.tsx", p2, "utf8");
console.log("[OK] Part 2 - LiveCard written");
