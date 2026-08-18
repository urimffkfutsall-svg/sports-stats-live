const fs = require("fs");
const p2 = `
  // ============ RANKING TABLE ============
  const getRanking = (gId: string) => {
    const teams = groupTeams.filter(t => t.groupId === gId);
    const matches = groupMatches.filter(m => m.groupId === gId && m.status === 'finished');
    return teams.map(t => {
      const played = matches.filter(m => m.homeTeamId === t.id || m.awayTeamId === t.id);
      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      played.forEach(m => {
        const isHome = m.homeTeamId === t.id;
        const hs = m.homeScore || 0, as_ = m.awayScore || 0;
        const myGoals = isHome ? hs : as_;
        const theirGoals = isHome ? as_ : hs;
        gf += myGoals; ga += theirGoals;
        if (myGoals > theirGoals) w++;
        else if (myGoals === theirGoals) d++;
        else l++;
      });
      return { ...t, played: played.length, w, d, l, gf, ga, gd: gf - ga, pts: w * 3 + d };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Duke u ngarkuar...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-gray-900">Kombetarja - Kompeticionet</h2>

      {/* ====== ADD COMPETITION ====== */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Shto Kompeticion</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1">Emri</label>
            <input value={compName} onChange={e => setCompName(e.target.value)} placeholder="Euro 2028 Qualifiers" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-gray-500 mb-1">Viti</label>
            <input value={compYear} onChange={e => setCompYear(e.target.value)} placeholder="2028" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <button onClick={handleAddComp} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8] shadow-md">Shto</button>
        </div>
      </div>

      {/* ====== COMPETITIONS LIST ====== */}
      {competitions.map(c => (
        <div key={c.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#1E6FF2] rounded-full"></span>
              <h3 className="font-black text-gray-900">{c.name} {c.year && <span className="text-gray-400 text-sm font-medium">({c.year})</span>}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedCompId(c.id); setSelectedGroupId(''); }} className={"px-3 py-1 rounded-lg text-xs font-bold " + (selectedCompId === c.id ? "bg-[#1E6FF2] text-white" : "bg-gray-100 text-gray-600")}>Menaxho</button>
              <button onClick={() => handleDeleteComp(c.id)} className="px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100">Fshi</button>
            </div>
          </div>

          {selectedCompId === c.id && (
            <div className="space-y-4 mt-4 border-t border-gray-100 pt-4">
              {/* Add Group */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Emri i Grupit</label>
                  <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Grupi A" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                </div>
                <button onClick={handleAddGroup} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">Shto Grup</button>
              </div>

              {/* Groups */}
              {selectedCompGroups.map(g => (
                <div key={g.id} className="bg-[#F8FAFC] rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800">{g.name}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedGroupId(g.id)} className={"px-3 py-1 rounded-lg text-xs font-bold " + (selectedGroupId === g.id ? "bg-[#1E6FF2] text-white" : "bg-white text-gray-600 border border-gray-200")}>Menaxho</button>
                      <button onClick={() => handleDeleteGroup(g.id)} className="px-2 py-1 rounded-lg text-xs text-red-400 hover:text-red-600">x</button>
                    </div>
                  </div>

                  {/* Ranking Table */}
                  {groupTeams.filter(t => t.groupId === g.id).length > 0 && (
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-gray-400 border-b border-gray-200">
                            <th className="text-left py-2 px-1">#</th>
                            <th className="text-left py-2">Skuadra</th>
                            <th className="text-center py-2 px-1">ND</th>
                            <th className="text-center py-2 px-1">F</th>
                            <th className="text-center py-2 px-1">B</th>
                            <th className="text-center py-2 px-1">H</th>
                            <th className="text-center py-2 px-1">GS</th>
                            <th className="text-center py-2 px-1">GP</th>
                            <th className="text-center py-2 px-1">DG</th>
                            <th className="text-center py-2 px-1 font-black">P</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getRanking(g.id).map((t, i) => (
                            <tr key={t.id} className={"border-b border-gray-100 " + (t.isKosova ? "bg-blue-50/50" : "")}>
                              <td className="py-2 px-1 text-xs font-bold text-gray-400">{i+1}</td>
                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  {t.teamLogo && <img src={t.teamLogo} alt="" className="w-5 h-5 rounded object-contain" />}
                                  <span className={"text-sm " + (t.isKosova ? "font-black text-[#1E6FF2]" : "font-medium text-gray-800")}>{t.teamName}</span>
                                </div>
                              </td>
                              <td className="text-center text-xs">{t.played}</td>
                              <td className="text-center text-xs text-green-600">{t.w}</td>
                              <td className="text-center text-xs text-amber-600">{t.d}</td>
                              <td className="text-center text-xs text-red-500">{t.l}</td>
                              <td className="text-center text-xs">{t.gf}</td>
                              <td className="text-center text-xs">{t.ga}</td>
                              <td className="text-center text-xs font-medium">{t.gd > 0 ? '+' : ''}{t.gd}</td>
                              <td className="text-center text-sm font-black text-[#1E6FF2]">{t.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
`;
fs.appendFileSync("src/pages/admin/AdminNationalTeam.tsx", p2, "utf8");
console.log("[OK] Part 2 - Competition/Group/Ranking UI");
