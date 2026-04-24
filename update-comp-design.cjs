const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// =====================================================
// 1) Replace the STANDINGS TABLE section
// =====================================================

// Replace getRowStyle function with getRowBorder + getRowBg (like Ballina)
comp = comp.replace(
  /const getRowStyle = \(pos: number\) => \{[\s\S]*?return '';\s*\};/,
  `const getRowBorder = (pos: number) => {
    if (isSuperliga) {
      if (pos <= 2) return '#22C55E';
      if (pos <= 6) return '#F59E0B';
      if (pos === 7) return '#D1D5DB';
      if (pos === 8) return '#EAB308';
      if (pos >= 9) return '#EF4444';
    } else {
      if (pos <= 2) return '#22C55E';
      if (pos === 3) return '#F59E0B';
    }
    return '#E5E7EB';
  };

  const getRowBg = (pos: number) => {
    if (isSuperliga) {
      if (pos <= 2) return 'bg-emerald-50/40';
      if (pos <= 6) return 'bg-amber-50/30';
      if (pos === 8) return 'bg-yellow-50/30';
      if (pos >= 9) return 'bg-red-50/30';
    } else {
      if (pos <= 2) return 'bg-emerald-50/40';
      if (pos === 3) return 'bg-amber-50/30';
    }
    return '';
  };`
);

// Replace the entire standings tab content
const oldStandingsStart = `{activeTab === 'tabela' && (`;
const oldStandingsEnd = `</div>
      )}`;

// Find and replace the tabela section entirely
const tabelaStartIdx = comp.indexOf("{activeTab === 'tabela'");
if (tabelaStartIdx > -1) {
  // Find matching closing for this section - look for the next activeTab
  const nextTabIdx = comp.indexOf("{activeTab === 'golashenuesit'");
  if (nextTabIdx > -1) {
    const tabelaSection = comp.substring(tabelaStartIdx, nextTabIdx);
    
    const newTabela = `{activeTab === 'tabela' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {standings.length === 0 ? <p className="text-gray-400 text-center py-8">Nuk ka te dhena per tabelen.</p> : (
              <>
                <div className="bg-[#0A1E3C] px-5 py-3.5 flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{title}</span>
                  <span className="ml-auto text-[10px] text-gray-400 font-medium uppercase tracking-wider">Sezoni {activeSeason?.name}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Skuadra</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-9">ND</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-9">F</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-9">B</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-9">H</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-14">G</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-10">DG</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-11">P</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Forma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, i) => (
                        <tr key={row.teamId} className={\`\${getRowBg(i + 1)} hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0\`}>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center">
                              <span className="w-1 h-6 rounded-sm mr-2 flex-shrink-0" style={Object.assign({}, { backgroundColor: getRowBorder(i + 1) })} />
                              <span className={\`text-xs font-bold \${i < 3 ? 'text-[#1E6FF2]' : 'text-gray-400'}\`}>{i + 1}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <Link to={\`/skuadra/\${row.teamId}\`} className="flex items-center gap-2 hover:text-[#1E6FF2] transition-colors group">
                              <div className="w-7 h-7 rounded-md bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-200 group-hover:border-[#1E6FF2]/30 transition-colors">
                                {row.teamLogo ? <img src={row.teamLogo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[9px] text-gray-400 font-bold">{row.teamName.charAt(0)}</span>}
                              </div>
                              <span className="font-semibold text-gray-800 group-hover:text-[#1E6FF2] truncate text-[13px]">{row.teamName}</span>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 text-center text-gray-600 font-medium">{row.played}</td>
                          <td className="px-3 py-2.5 text-center text-emerald-600 font-semibold">{row.won}</td>
                          <td className="px-3 py-2.5 text-center text-gray-400">{row.drawn}</td>
                          <td className="px-3 py-2.5 text-center text-red-500 font-semibold">{row.lost}</td>
                          <td className="px-3 py-2.5 text-center text-gray-500 text-xs font-medium">{row.goalsFor}:{row.goalsAgainst}</td>
                          <td className="px-3 py-2.5 text-center font-bold text-xs" style={Object.assign({}, { color: row.goalDifference > 0 ? '#22C55E' : row.goalDifference < 0 ? '#EF4444' : '#9CA3AF' })}>{row.goalDifference > 0 ? '+' : ''}{row.goalDifference}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-7 rounded-md bg-[#0A1E3C] text-white font-bold text-xs">{row.points}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center hidden md:table-cell">
                            <div className="flex justify-center gap-0.5">
                              {row.form.map((f, fi) => (
                                <span key={fi} className={\`w-5 h-5 rounded-sm text-[9px] font-bold flex items-center justify-center text-white \${f === 'W' ? 'bg-emerald-500' : f === 'L' ? 'bg-red-500' : 'bg-gray-400'}\`}>
                                  {f === 'W' ? 'F' : f === 'L' ? 'H' : 'B'}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50 flex flex-wrap gap-4 text-[10px] text-gray-500 font-medium">
                  {isSuperliga ? (
                    <>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-emerald-500" /> Gjysme finale Playoff</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-amber-500" /> Playoff</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-yellow-500" /> Playoff Renie/Ngritje</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-red-500" /> Bie ne Ligen e Pare</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-emerald-500" /> Promovohen ne Superlige</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-4 rounded-sm bg-amber-500" /> Playoff Renie/Ngritje</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        `;
    
    comp = comp.substring(0, tabelaStartIdx) + newTabela + comp.substring(nextTabIdx);
  }
}

// =====================================================
// 2) Replace the SCORERS section with premium design
// =====================================================

const scorersStartIdx = comp.indexOf("{activeTab === 'golashenuesit'");
if (scorersStartIdx > -1) {
  // Find end - it's before the closing </div> of the main content area, before <Footer
  const footerIdx = comp.indexOf("<Footer", scorersStartIdx);
  if (footerIdx > -1) {
    // Go back to find the closing of the golashenuesit section
    const scorersEnd = comp.lastIndexOf("</div>", footerIdx);
    
    const newScorers = `{activeTab === 'golashenuesit' && (
          <div>
            {scorers.length === 0 ? <p className="text-gray-400 text-center py-8">Nuk ka golashenues te regjistruar.</p> : (
              <>
                {/* #1 Top Scorer - Hero Card */}
                {scorers[0] && (() => {
                  const s = scorers[0];
                  const team = getTeamById(s.teamId);
                  return (
                    <div onClick={() => setSelectedScorer(s)} className="cursor-pointer mb-6 group">
                      <div className="bg-gradient-to-br from-[#0A1E3C] via-[#0F2D5E] to-[#1E6FF2] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                        <div className="absolute inset-0"><div className="absolute -top-20 -right-20 w-60 h-60 bg-[#1E6FF2]/20 rounded-full blur-3xl" /><div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0066CC]/15 rounded-full blur-3xl" /></div>
                        <div className="relative z-10 flex items-center gap-6">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg z-10"><span className="text-white text-sm font-black">1</span></div>
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shadow-xl group-hover:scale-105 transition-transform">
                              {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/40 text-3xl font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/20 rounded-full mb-2">
                              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Golashenuesi #1</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1">{s.firstName} {s.lastName}</h3>
                            <div className="flex items-center gap-2">
                              {team?.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-full border border-white/20" />}
                              <span className="text-sm text-gray-300">{team?.name || '-'}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="block text-5xl font-black text-white">{s.goals}</span>
                            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Gola</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Rest of scorers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#0A1E3C] px-5 py-3.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Golashenuesit</span>
                    <span className="text-[10px] text-gray-400 ml-auto">Kliko per detaje</span>
                  </div>
                  {scorers.slice(1).map((s, idx) => {
                    const i = idx + 1;
                    const team = getTeamById(s.teamId);
                    return (
                      <div key={s.id} onClick={() => setSelectedScorer(s)} className="flex items-center gap-4 px-5 py-3.5 border-t border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer group">
                        <span className={\`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 \${i < 3 ? 'bg-gradient-to-br ' + medalColors[i] + ' text-white shadow-sm' : 'bg-gray-100 text-gray-400'}\`}>{i + 1}</span>
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#1E6FF2] transition-colors">{s.firstName} {s.lastName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {team?.logo && <img src={team.logo} alt="" className="w-4 h-4 rounded-full" />}
                            <span className="text-[11px] text-gray-400">{team?.name || '-'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-gradient-to-r from-[#1E6FF2] to-[#3B82F6] rounded-full" style={Object.assign({}, { width: \`\${Math.min((s.goals / (scorers[0]?.goals || 1)) * 100, 100)}%\` })} />
                          </div>
                          <span className="text-base font-black text-[#1E6FF2] w-8 text-right">{s.goals}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        `;
    
    // Find the exact end of golashenuesit section
    // Count brackets to find proper closing
    let depth = 0;
    let endIdx = scorersStartIdx;
    for (let ci = scorersStartIdx; ci < comp.length; ci++) {
      if (comp[ci] === '{') depth++;
      if (comp[ci] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = ci + 1;
          break;
        }
      }
    }
    
    comp = comp.substring(0, scorersStartIdx) + newScorers + comp.substring(endIdx);
  }
}

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage.tsx - tabela dhe golashenuesit redizajnuar si Ballina");
