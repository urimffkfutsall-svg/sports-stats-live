const fs = require("fs");
const p3 = `
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
`;
fs.appendFileSync("src/pages/LiveMatchPage.tsx", p3, "utf8");
const final = fs.readFileSync("src/pages/LiveMatchPage.tsx", "utf8");
console.log("[OK] Part 3 written. Total lines: " + final.split("\n").length);
console.log("Has CompSection: " + final.includes("CompSection"));
console.log("Has liga_pare: " + final.includes("liga_pare"));
console.log("Has export: " + final.includes("export default"));
