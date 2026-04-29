const fs = require("fs");
const p2 = `
        {/* Competition Selector */}
        {competitions.length > 1 && (
          <div className="flex gap-2 bg-white rounded-xl p-1 mb-6 border border-gray-100 shadow-sm overflow-x-auto">
            {competitions.map(c => (
              <button key={c.id} onClick={() => setSelectedCompId(c.id)} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap " + (selectedCompId === c.id ? "bg-[#1E6FF2] text-white shadow-md shadow-blue-200" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50")}>
                {c.name} {c.year && '(' + c.year + ')'}
              </button>
            ))}
          </div>
        )}

        {/* Groups */}
        {selectedGroups.map(g => {
          const ranking = getRanking(g.id);
          const matches = groupMatches.filter(m => m.groupId === g.id);
          const finishedM = matches.filter(m => m.status === 'finished');
          const upcomingM = matches.filter(m => m.status === 'planned');

          return (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              {/* Group Header */}
              <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] px-5 py-3">
                <h2 className="text-white font-black text-lg">{g.name}</h2>
              </div>

              {/* Ranking Table */}
              {ranking.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left py-3 px-3 w-8">#</th>
                        <th className="text-left py-3">Skuadra</th>
                        <th className="text-center py-3 px-2">ND</th>
                        <th className="text-center py-3 px-2">F</th>
                        <th className="text-center py-3 px-2">B</th>
                        <th className="text-center py-3 px-2">H</th>
                        <th className="text-center py-3 px-2">GS</th>
                        <th className="text-center py-3 px-2">GP</th>
                        <th className="text-center py-3 px-2">DG</th>
                        <th className="text-center py-3 px-3 font-black">P</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((t, i) => (
                        <tr key={t.id} className={"border-b border-gray-50 hover:bg-gray-50/50 transition-colors " + (t.isKosova ? "bg-blue-50/40" : "")}>
                          <td className="py-3 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              {t.teamLogo ? <img src={t.teamLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{t.teamName?.charAt(0)}</div>}
                              <span className={"text-sm " + (t.isKosova ? "font-black text-[#1E6FF2]" : "font-semibold text-gray-800")}>{t.teamName}</span>
                            </div>
                          </td>
                          <td className="text-center text-xs font-medium text-gray-600">{t.played}</td>
                          <td className="text-center text-xs font-bold text-green-600">{t.w}</td>
                          <td className="text-center text-xs font-bold text-amber-500">{t.d}</td>
                          <td className="text-center text-xs font-bold text-red-500">{t.l}</td>
                          <td className="text-center text-xs text-gray-600">{t.gf}</td>
                          <td className="text-center text-xs text-gray-600">{t.ga}</td>
                          <td className="text-center text-xs font-semibold">{t.gd > 0 ? '+' : ''}{t.gd}</td>
                          <td className="text-center text-sm font-black text-[#1E6FF2]">{t.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Matches Section */}
              <div className="p-5 space-y-4">
                {/* Upcoming */}
                {upcomingM.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#1E6FF2] rounded-full"></span>Ndeshjet e Ardhshme
                    </h3>
                    <div className="space-y-2">
                      {upcomingM.map(m => {
                        const homeLogo = getTeamLogo(m.homeTeamId);
                        const awayLogo = getTeamLogo(m.awayTeamId);
                        return (
                          <div key={m.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                            <div className="flex items-center gap-2 flex-1">
                              {homeLogo ? <img src={homeLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.homeTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.homeTeamId)}</span>
                            </div>
                            <div className="text-center px-4">
                              <span className="text-xs text-gray-400 font-bold">vs</span>
                              {m.date && <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(m.date)} {m.time || ''}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.awayTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.awayTeamId)}</span>
                              {awayLogo ? <img src={awayLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Finished */}
                {finishedM.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-green-500 rounded-full"></span>Rezultatet
                    </h3>
                    <div className="space-y-2">
                      {finishedM.map(m => {
                        const homeLogo = getTeamLogo(m.homeTeamId);
                        const awayLogo = getTeamLogo(m.awayTeamId);
                        const homeWin = (m.homeScore || 0) > (m.awayScore || 0);
                        const awayWin = (m.awayScore || 0) > (m.homeScore || 0);
                        return (
                          <div key={m.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                            <div className="flex items-center gap-2 flex-1">
                              {homeLogo ? <img src={homeLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.homeTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.homeTeamId)}</span>
                            </div>
                            <div className="text-center px-4">
                              <div className="flex items-center gap-2">
                                <span className={"text-xl font-black " + (homeWin ? "text-green-600" : "text-gray-800")}>{m.homeScore ?? 0}</span>
                                <span className="text-gray-300">:</span>
                                <span className={"text-xl font-black " + (awayWin ? "text-green-600" : "text-gray-800")}>{m.awayScore ?? 0}</span>
                              </div>
                              {m.date && <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(m.date)}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.awayTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.awayTeamId)}</span>
                              {awayLogo ? <img src={awayLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p2, "utf8");
console.log("[OK] Part 2 - Groups + Ranking + Matches");
