const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Remove the wrongly placed cup round code (added before form was declared)
s = s.replace(
  `const cupRoundNames: Record<number, string> = { 1: 'Raundi 1', 2: 'Cerekfinalet', 3: 'Gjysmefinalet', 4: 'Finalja' };
  const isCupComp = (compId: string) => {
    return competitions.find(c => c.id === compId)?.type === 'kupa';
  };
  const selectedIsCup = isCupComp(form.competitionId);
  const filterIsCup = isCupComp(filterComp);
  const getRoundLabel = (week: number, compId: string) => isCupComp(compId) ? (cupRoundNames[week] || \`Raundi \${week}\`) : \`Java \${week}\`;`,
  ""
);

// Find where 'form' is declared and add the cup code AFTER it
// Look for the filteredMatches useMemo (which uses filterComp, form is already declared by then)
s = s.replace(
  "const filteredMatches = useMemo",
  `const cupRoundNames: Record<number, string> = { 1: 'Raundi 1', 2: 'Cerekfinalet', 3: 'Gjysmefinalet', 4: 'Finalja' };
  const isCupComp = (compId: string) => {
    return competitions.find(c => c.id === compId)?.type === 'kupa';
  };
  const selectedIsCup = isCupComp(form.competitionId);
  const filterIsCup = isCupComp(filterComp);

  const filteredMatches = useMemo`
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");
console.log("[OK] Fixed - cup code moved after form declaration");
