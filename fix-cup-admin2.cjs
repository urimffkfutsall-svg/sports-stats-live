const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Find the line with "const weeks =" and add cup helpers right after it
const weeksLine = "const weeks = [...new Set(matches.filter(m => activeSeason ? m.seasonId === activeSeason.id : true).map(m => m.week))].sort((a, b) => a - b);";
const cupHelpers = `

  const cupRounds = { 1: 'Raundi 1', 2: 'Cerekfinalet', 3: 'Gjysmefinalet', 4: 'Finalja' };
  const isCupComp = (cid) => competitions.find(c => c.id === cid)?.type === 'kupa';
  const selectedIsCup = isCupComp(form.competitionId);
  const filterIsCup = isCupComp(filterComp);`;

if (s.includes(weeksLine)) {
  s = s.replace(weeksLine, weeksLine + cupHelpers);
  console.log("[OK] Added cup helpers after weeks declaration");
} else {
  // Try partial match
  const idx = s.indexOf("const weeks =");
  if (idx > -1) {
    const lineEnd = s.indexOf(";", idx);
    const orig = s.substring(idx, lineEnd + 1);
    s = s.replace(orig, orig + cupHelpers);
    console.log("[OK] Added cup helpers (partial match)");
  } else {
    console.log("[ERR] Could not find weeks declaration");
  }
}

// 2) Replace week filter dropdown to show round names for cup
s = s.replace(
  "{weeks.map(w => <option key={w} value={w}>Java {w}</option>)}",
  "{weeks.map(w => <option key={w} value={w}>{filterIsCup ? (cupRounds[w] || `Raundi ${w}`) : `Java ${w}`}</option>)}"
);

// 3) Replace "Java *" label and input with conditional for cup
const oldWeekInput = `<label className="block text-xs font-medium text-gray-600 mb-1">Java *</label>
                <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />`;

const newWeekInput = `<label className="block text-xs font-medium text-gray-600 mb-1">{selectedIsCup ? 'Raundi *' : 'Java *'}</label>
                {selectedIsCup ? (
                  <select value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" required>
                    <option value={1}>Raundi 1</option>
                    <option value={2}>Cerekfinalet</option>
                    <option value={3}>Gjysmefinalet</option>
                    <option value={4}>Finalja</option>
                  </select>
                ) : (
                  <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                )}`;

if (s.includes(oldWeekInput)) {
  s = s.replace(oldWeekInput, newWeekInput);
  console.log("[OK] Replaced week input with cup dropdown");
} else {
  console.log("[WARN] Could not find week input to replace");
}

// 4) Replace "J{m.week}" in match list with round name for cup
s = s.replace(
  "<span>J{m.week}</span>",
  "<span>{isCupComp(m.competitionId) ? (cupRounds[m.week] || `R${m.week}`) : `J${m.week}`}</span>"
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");

// Verify
const final = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
console.log("\nVerification:");
console.log("  Has cupRounds: " + final.includes("cupRounds"));
console.log("  Has isCupComp: " + final.includes("isCupComp"));
console.log("  Has selectedIsCup: " + final.includes("selectedIsCup"));
console.log("  cupRounds after form: " + (final.indexOf("cupRounds") > final.indexOf("const [form,")));
console.log("  Total lines: " + final.split("\n").length);
