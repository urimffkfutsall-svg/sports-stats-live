const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// 1) Add cup round names map after the component declaration
s = s.replace(
  "const [filterWeek, setFilterWeek] = useState<string>('all');",
  `const [filterWeek, setFilterWeek] = useState<string>('all');

  const cupRoundNames: Record<number, string> = { 1: 'Raundi 1', 2: 'Cerekfinalet', 3: 'Gjysmefinalet', 4: 'Finalja' };
  const isCupComp = (compId: string) => {
    return competitions.find(c => c.id === compId)?.type === 'kupa';
  };
  const selectedIsCup = isCupComp(form.competitionId);
  const filterIsCup = isCupComp(filterComp);
  const getRoundLabel = (week: number, compId: string) => isCupComp(compId) ? (cupRoundNames[week] || \`Raundi \${week}\`) : \`Java \${week}\`;`
);

// 2) Replace the week filter dropdown to show round names for cup
s = s.replace(
  "{weeks.map(w => <option key={w} value={w}>Java {w}</option>)}",
  "{weeks.map(w => <option key={w} value={w}>{filterIsCup ? (cupRoundNames[w] || `Raundi ${w}`) : `Java ${w}`}</option>)}"
);

// 3) Replace the "Java *" label and input with conditional select for cup
s = s.replace(
  `<label className="block text-xs font-medium text-gray-600 mb-1">Java *</label>
                <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />`,
  `<label className="block text-xs font-medium text-gray-600 mb-1">{selectedIsCup ? 'Raundi *' : 'Java *'}</label>
                {selectedIsCup ? (
                  <select value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" required>
                    <option value={1}>Raundi 1</option>
                    <option value={2}>Cerekfinalet</option>
                    <option value={3}>Gjysmefinalet</option>
                    <option value={4}>Finalja</option>
                  </select>
                ) : (
                  <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                )}`
);

// 4) Replace "J{m.week}" in the match list with round name for cup matches
s = s.replace(
  "<span>J{m.week}</span>",
  "<span>{isCupComp(m.competitionId) ? (cupRoundNames[m.week] || `R${m.week}`) : `J${m.week}`}</span>"
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");
console.log("[OK] AdminMatches.tsx — Cup rounds: Raundi 1, Cerekfinale, Gjysmefinale, Finale");
