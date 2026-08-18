const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// Replace the initial selectedWeek state to start at the last finished week
comp = comp.replace(
  "const [selectedWeek, setSelectedWeek] = useState<number>(1);",
  `const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    // Find last week with finished matches
    const finishedWeeks = compMatches
      .filter(m => m.status === 'finished')
      .map(m => m.week);
    if (finishedWeeks.length > 0) return Math.max(...finishedWeeks);
    // Fallback to last week with any matches
    const allWeeks = [...new Set(compMatches.map(m => m.week))].sort((a, b) => a - b);
    return allWeeks.length > 0 ? allWeeks[allWeeks.length - 1] : 1;
  });`
);

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage.tsx — default week = last finished week");
