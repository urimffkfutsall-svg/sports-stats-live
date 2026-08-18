const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// 1) Add cup legs state after the existing state declarations
s = s.replace(
  "const [showForm, setShowForm] = useState(false);",
  `const [showForm, setShowForm] = useState(false);
  const [cupLegs, setCupLegs] = useState<{
    leg1: { enabled: boolean; homeScore: string; awayScore: string; date: string; time: string };
    leg2: { enabled: boolean; homeScore: string; awayScore: string; date: string; time: string };
    leg3: { enabled: boolean; homeScore: string; awayScore: string; date: string; time: string };
  }>({
    leg1: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
    leg2: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
    leg3: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
  });`
);

// 2) Update resetForm to also reset cupLegs
s = s.replace(
  "const resetForm = () => { setForm(emptyForm); setEditId(null); setShowForm(false); };",
  `const resetForm = () => {
    setForm(emptyForm); setEditId(null); setShowForm(false);
    setCupLegs({
      leg1: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
      leg2: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
      leg3: { enabled: false, homeScore: '', awayScore: '', date: '', time: '' },
    });
  };`
);

// 3) Update handleSubmit to create multiple matches for cup legs
s = s.replace(
  `if (editId) {
      updateMatch({ id: editId, ...matchData } as Match);
    } else {
      addMatch(matchData);
    }
    resetForm();`,
  `if (editId) {
      updateMatch({ id: editId, ...matchData } as Match);
      resetForm();
    } else if (selectedIsCup && (cupLegs.leg1.enabled || cupLegs.leg2.enabled || cupLegs.leg3.enabled)) {
      // Create multiple cup leg matches
      const legs = [cupLegs.leg1, cupLegs.leg2, cupLegs.leg3];
      legs.forEach((leg, idx) => {
        if (!leg.enabled) return;
        const isReversed = idx === 1; // Leg 2 has reversed home/away
        const legMatch = {
          ...matchData,
          homeTeamId: isReversed ? form.awayTeamId : form.homeTeamId,
          awayTeamId: isReversed ? form.homeTeamId : form.awayTeamId,
          homeScore: leg.homeScore !== '' ? Number(leg.homeScore) : undefined,
          awayScore: leg.awayScore !== '' ? Number(leg.awayScore) : undefined,
          date: leg.date || matchData.date,
          time: leg.time || matchData.time,
          status: (leg.homeScore !== '' && leg.awayScore !== '') ? 'finished' as const : matchData.status,
        };
        addMatch(legMatch);
      });
      resetForm();
    } else {
      addMatch(matchData);
      resetForm();
    }`
);

// 4) Add Cup Legs UI section after the scores section (line 248: </div>)
// Insert after the date/time/score grid and before the day/venue grid
const cupLegsUI = `
            {/* === CUP MULTI-LEG SECTION === */}
            {selectedIsCup && !editId && (
              <div className="bg-[#1E6FF2]/5 border border-[#1E6FF2]/15 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#1E6FF2]">Ndeshjet e Kupes</span>
                  <span className="text-[10px] text-gray-400">Aktivizo ndeshjet qe deshiron te shtosh</span>
                </div>
                {[
                  { key: 'leg1', label: 'Ndeshja e 1-re', sub: '(Vendas - Mysafir)' },
                  { key: 'leg2', label: 'Ndeshja e 2-te', sub: '(Mysafir - Vendas)' },
                  { key: 'leg3', label: 'Ndeshja e 3-te', sub: '(Vendas - Mysafir)' },
                ].map(leg => {
                  const data = cupLegs[leg.key as keyof typeof cupLegs];
                  return (
                    <div key={leg.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={data.enabled}
                          onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], enabled: e.target.checked } }))}
                          className="w-4 h-4 text-[#1E6FF2] rounded"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-800">{leg.label}</span>
                          <span className="text-[10px] text-gray-400 ml-2">{leg.sub}</span>
                        </div>
                      </label>
                      {data.enabled && (
                        <div className="px-4 pb-3 pt-1 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Rezultati Shtëpi</label>
                            <input type="number" min="0" value={data.homeScore}
                              onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], homeScore: e.target.value } }))}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="-" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Rezultati Jashtë</label>
                            <input type="number" min="0" value={data.awayScore}
                              onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], awayScore: e.target.value } }))}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" placeholder="-" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Data</label>
                            <input type="date" value={data.date}
                              onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], date: e.target.value } }))}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Ora</label>
                            <input type="text" placeholder="HH:mm" value={data.time}
                              onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], time: e.target.value } }))}
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}`;

// Insert after the scores grid (after line 248 which is </div> closing the date/scores grid)
// Find the closing of the date/time/score grid
s = s.replace(
  `{form.status !== "planned" && (<div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Jashtë</label>
                <input type="number" min="0" value={form.awayScore} onChange={e => setForm(p => ({ ...p, awayScore: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>)}
            </div>`,
  `{form.status !== "planned" && !selectedIsCup && (<div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Jashtë</label>
                <input type="number" min="0" value={form.awayScore} onChange={e => setForm(p => ({ ...p, awayScore: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>)}
            </div>${cupLegsUI}`
);

// Also hide the home score for cup
s = s.replace(
  `{form.status !== "planned" && (<div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Shtëpi</label>`,
  `{form.status !== "planned" && !selectedIsCup && (<div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Shtëpi</label>`
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");
console.log("[OK] AdminMatches.tsx — Cup multi-leg UI added");
console.log("  - 3 checkboxes: Ndeshja 1, 2, 3");
console.log("  - Each with score + date + time");
console.log("  - Leg 2 auto-reverses home/away");
console.log("  - Creates separate matches for each enabled leg");
