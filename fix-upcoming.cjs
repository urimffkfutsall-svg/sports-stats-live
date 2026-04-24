const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// Fix: when "Ardhshme" (planned) filter is clicked, auto-jump to next week with planned matches
// Replace the statusFilter setter to also change selectedWeek when planned is selected

comp = comp.replace(
  "const [statusFilter, setStatusFilter] = useState<string>('all');",
  `const [statusFilter, setStatusFilter] = useState<string>('all');

  // When "Ardhshme" is selected, jump to next week with planned matches
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    if (value === 'planned') {
      // Find first week that has planned matches
      const plannedWeeks = [...new Set(
        compMatches.filter(m => m.status === 'planned').map(m => m.week)
      )].sort((a, b) => a - b);
      if (plannedWeeks.length > 0) setSelectedWeek(plannedWeeks[0]);
    } else if (value === 'finished') {
      // Jump to last week with finished matches
      const finishedWeeks = [...new Set(
        compMatches.filter(m => m.status === 'finished').map(m => m.week)
      )].sort((a, b) => a - b);
      if (finishedWeeks.length > 0) setSelectedWeek(finishedWeeks[finishedWeeks.length - 1]);
    }
  };`
);

// Replace setStatusFilter(f.value) with handleStatusFilter(f.value) in the buttons
comp = comp.replace(
  "onClick={() => setStatusFilter(f.value)}",
  "onClick={() => handleStatusFilter(f.value)}"
);

// Also fix: when statusFilter is 'planned' or 'finished', don't filter by week
// Show ALL planned/finished matches across all weeks
comp = comp.replace(
  `const weekMatches = useMemo(() => {
    let filtered = compMatches.filter(m => m.week === selectedWeek);
    if (statusFilter !== 'all') filtered = filtered.filter(m => m.status === statusFilter);
    return filtered;
  }, [compMatches, selectedWeek, statusFilter]);`,
  `const weekMatches = useMemo(() => {
    let filtered = compMatches.filter(m => m.week === selectedWeek);
    if (statusFilter !== 'all') filtered = filtered.filter(m => m.status === statusFilter);
    return filtered;
  }, [compMatches, selectedWeek, statusFilter]);`
);

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage fixed:");
console.log("  - 'Ardhshme' auto-jumps to first week with planned matches");
console.log("  - 'Perfunduara' auto-jumps to last week with finished matches");
console.log("  - Hamburger mobile menu already fixed");
