const fs = require("fs");
const p2 = `
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#d0a650] rounded-full"></span>
              Kombetarja e Kosoves
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Futsall Kosova</h1>
            <p className="text-white/60 text-sm">Perfaqesuesja zyrtare e Kosoves ne Futsall</p>
          </div>
          {/* Quick Stats */}
          <div className="relative z-10 flex gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Lojtare</p>
              <p className="text-2xl font-black">{ntPlayers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Ndeshje</p>
              <p className="text-2xl font-black">{finishedMatches.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Fitore</p>
              <p className="text-2xl font-black">{wins}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Gola</p>
              <p className="text-2xl font-black">{goalsFor}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-8 border border-gray-100 shadow-sm overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={\`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap \${
                tab === t.key
                  ? 'bg-[#1E6FF2] text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }\`}
            >
              {t.label}
            </button>
          ))}
        </div>
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p2, "utf8");
console.log("[OK] Part 2 written - hero + tabs");
