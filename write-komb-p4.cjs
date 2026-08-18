const fs = require("fs");
const p4 = `
        {/* ====== STATS TAB ====== */}
        {tab === 'stats' && (
          <div className="space-y-6">
            {/* Overview */}
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

            {/* Goals */}
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
                  <div className="bg-[#1E6FF2] h-full rounded-full" style= width: (goalsFor + goalsAgainst > 0 ? (goalsFor / (goalsFor + goalsAgainst) * 100) : 50) + '%' ></div>
                </div>
              </div>

              {/* Top Scorers */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Golashenuesit Kryesor</h3>
                {ntPlayers.filter(p => p.goals > 0).sort((a, b) => (b.goals || 0) - (a.goals || 0)).length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Nuk ka te dhena</p>
                ) : (
                  <div className="space-y-2">
                    {ntPlayers.filter(p => p.goals > 0).sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 5).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 py-2">
                        <span className="w-6 h-6 rounded-lg bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] text-xs font-black">{i + 1}</span>
                        {p.photo ? <img src={p.photo} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{p.firstName?.charAt(0)}{p.lastName?.charAt(0)}</div>}
                        <span className="text-sm font-bold text-gray-800 flex-1">{p.firstName} {p.lastName}</span>
                        <span className="text-sm font-black text-[#1E6FF2]">{p.goals}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Win rate */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">Perqindja e Fitoreve</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1E6FF2" strokeWidth="10" strokeDasharray={264} strokeDashoffset={finishedMatches.length > 0 ? 264 - (wins / finishedMatches.length * 264) : 264} strokeLinecap="round" />
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
        )}

        {/* ====== STAFF TAB ====== */}
        {tab === 'staff' && (
          <div>
            {ntStaff.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
                <p className="text-gray-400">Nuk ka staf te regjistruar ende</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ntStaff.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    {s.photo ? (
                      <img src={s.photo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center text-xl font-black text-gray-300">{s.name?.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-black text-gray-900">{s.name}</p>
                      <span className="text-xs font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2 py-0.5 rounded-full">{s.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== NEWS TAB ====== */}
        {tab === 'news' && (
          <div>
            <p className="text-gray-400 text-sm mb-4">Lajmet e fundit rreth kombetares</p>
            {(news || []).length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
                <p className="text-gray-400">Nuk ka lajme ende</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(news || []).slice(0, 6).map((n: any) => {
                  let thumb = '';
                  try { const arr = JSON.parse(n.photo); if (Array.isArray(arr) && arr[0]) thumb = arr[0]; } catch { if (n.photo) thumb = n.photo; }
                  return (
                    <a key={n.id} href={'/lajme/' + n.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all flex gap-3">
                      {thumb && <img src={thumb} alt="" className="w-28 h-24 object-cover flex-shrink-0" />}
                      <div className="p-3 flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm line-clamp-2">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p4, "utf8");
const final = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
console.log("[OK] Part 4 - Stats, Staff, News tabs + closing");
console.log("Total lines: " + final.split("\n").length);
console.log("Has export: " + final.includes("export default"));
console.log("Has all tabs: " + final.includes("squad") + " " + final.includes("matches") + " " + final.includes("stats") + " " + final.includes("staff") + " " + final.includes("news"));
