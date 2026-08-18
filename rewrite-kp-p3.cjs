const fs = require("fs");
const ob = String.fromCharCode(123);
const cb = String.fromCharCode(125);
const p3 = `
        {/* Kosova Statistics */}
        {kosovaMatches.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] px-5 py-3">
              <h2 className="text-white font-black text-lg">Statistikat e Kosoves</h2>
            </div>
            <div className="p-5 space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-[#1E6FF2]">${ob}kosovaMatches.length${cb}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Ndeshje</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-green-500">${ob}kWins${cb}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Fitore</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-amber-500">${ob}kDraws${cb}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Barazime</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-red-500">${ob}kLosses${cb}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Humbje</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-gray-800">${ob}kGF${cb} : ${ob}kGA${cb}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Gola</p>
                </div>
              </div>

              {/* Goals Bar + Win Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Gola</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#1E6FF2]">${ob}kGF${cb}</p>
                      <p className="text-xs text-gray-400 mt-1">Te shenuar</p>
                    </div>
                    <div className="text-2xl font-light text-gray-200">-</div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-red-400">${ob}kGA${cb}</p>
                      <p className="text-xs text-gray-400 mt-1">Te pesuar</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#1E6FF2] h-full rounded-full" style=${ob}${ob} width: (kGF + kGA > 0 ? (kGF / (kGF + kGA) * 100) : 50) + '%' ${cb}${cb}></div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Perqindja e Fitoreve</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#1E6FF2" strokeWidth="10" strokeDasharray="264" strokeDashoffset=${ob}kosovaMatches.length > 0 ? 264 - (kWins / kosovaMatches.length * 264) : 264${cb} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-900">${ob}kosovaMatches.length > 0 ? Math.round(kWins / kosovaMatches.length * 100) : 0${cb}%</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span className="text-sm text-gray-600">Fitore: ${ob}kWins${cb}</span></div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span><span className="text-sm text-gray-600">Barazime: ${ob}kDraws${cb}</span></div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span><span className="text-sm text-gray-600">Humbje: ${ob}kLosses${cb}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {competitions.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
            <p className="text-gray-400">Nuk ka kompeticion te regjistruar ende</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p3, "utf8");
const final = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
console.log("[OK] Part 3 - Stats + closing");
console.log("Total lines: " + final.split("\n").length);
console.log("Has export: " + final.includes("export default"));
