const fs = require("fs");
const p2 = `
        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-[#1E6FF2]">{finishedMatches.length}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Ndeshje</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-green-500">{wins}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Fitore</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-amber-500">{draws}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Barazime</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-red-500">{losses}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Humbje</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Gola</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-4xl font-black text-[#1E6FF2]">{goalsFor}</p>
                    <p className="text-xs text-gray-400 mt-1">Te shenuar</p>
                  </div>
                  <div className="text-2xl font-light text-gray-200">-</div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-red-400">{goalsAgainst}</p>
                    <p className="text-xs text-gray-400 mt-1">Te pesuar</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#1E6FF2] h-full rounded-full" style={${String.fromCharCode(123)} width: (goalsFor + goalsAgainst > 0 ? (goalsFor / (goalsFor + goalsAgainst) * 100) : 50) + '%' ${String.fromCharCode(125)}}></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Perqindja e Fitoreve</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#1E6FF2" strokeWidth="10" strokeDasharray="264" strokeDashoffset={finishedMatches.length > 0 ? 264 - (wins / finishedMatches.length * 264) : 264} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-900">{finishedMatches.length > 0 ? Math.round(wins / finishedMatches.length * 100) : 0}%</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span className="text-sm text-gray-600">Fitore: {wins}</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span><span className="text-sm text-gray-600">Barazime: {draws}</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span><span className="text-sm text-gray-600">Humbje: {losses}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p2, "utf8");
console.log("[OK] Part 2 - Stats + closing");
console.log("Total lines: " + fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8").split("\n").length);
