const fs = require("fs");
const p3 = `
        {/* ====== SQUAD TAB ====== */}
        {tab === 'squad' && (
          <div>
            {ntPlayers.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
                <p className="text-gray-400">Nuk ka lojtare te regjistruar ende</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ntPlayers.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1E6FF2]/20 transition-all group">
                    <div className="aspect-[3/4] bg-gradient-to-b from-gray-100 to-gray-50 relative overflow-hidden">
                      {p.photo ? (
                        <img src={p.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-black text-gray-200">{(p.firstName || '?').charAt(0)}{(p.lastName || '?').charAt(0)}</span>
                        </div>
                      )}
                      {p.number && (
                        <span className="absolute top-2 left-2 w-8 h-8 bg-[#2a499a] text-white rounded-lg flex items-center justify-center text-sm font-black shadow-md">{p.number}</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-black text-gray-900 text-sm truncate">{p.firstName} {p.lastName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {p.position && <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2 py-0.5 rounded-full">{p.position}</span>}
                        {p.club && <span className="text-[10px] text-gray-400 truncate">{p.club}</span>}
                      </div>
                      {(p.appearances || p.goals) && (
                        <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                          {p.appearances && <span>{p.appearances} ndeshje</span>}
                          {p.goals && <span>{p.goals} gola</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== MATCHES TAB ====== */}
        {tab === 'matches' && (
          <div className="space-y-8">
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1E6FF2] rounded-full"></span>Ndeshjet e Ardhshme
                </h2>
                <div className="space-y-3">
                  {upcomingMatches.map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] font-black text-sm">
                          {m.isHome ? 'H' : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{m.isHome ? 'Kosova' : m.opponent} vs {m.isHome ? m.opponent : 'Kosova'}</p>
                          <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                            {m.date && <span>{formatDate(m.date)}</span>}
                            {m.time && <span>{m.time}</span>}
                            {m.venue && <span>{m.venue}</span>}
                          </div>
                        </div>
                      </div>
                      {m.type && <span className="text-[10px] font-bold text-white bg-[#1E6FF2] px-2.5 py-1 rounded-full uppercase">{m.type === 'friendly' ? 'Miqesore' : m.type === 'qualifier' ? 'Kualifikuese' : m.type}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {finishedMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>Rezultatet
                </h2>
                <div className="space-y-3">
                  {finishedMatches.map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        {m.opponentLogo && <img src={m.opponentLogo} alt="" className="w-10 h-10 rounded-lg object-contain" />}
                        <div>
                          <p className="font-bold text-gray-900">{m.isHome ? 'Kosova' : m.opponent} vs {m.isHome ? m.opponent : 'Kosova'}</p>
                          <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                            {m.date && <span>{formatDate(m.date)}</span>}
                            {m.venue && <span>{m.venue}</span>}
                            {m.type && <span className="uppercase">{m.type === 'friendly' ? 'Miqesore' : m.type === 'qualifier' ? 'Kualifikuese' : m.type}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-black text-gray-900">{m.homeScore ?? 0} : {m.awayScore ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ntMatches.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
                <p className="text-gray-400">Nuk ka ndeshje te regjistruara ende</p>
              </div>
            )}
          </div>
        )}
`;
fs.appendFileSync("src/pages/KombetarjaPage.tsx", p3, "utf8");
console.log("[OK] Part 3 - Squad + Matches tabs");
