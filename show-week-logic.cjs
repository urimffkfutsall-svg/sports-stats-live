const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");

// Show lines 120-170 where weekMatches and selectedWeek are defined
console.log("=== Lines 120-175 ===");
lines.slice(119, 175).forEach((l, i) => console.log((i+120) + ": " + l.trimEnd()));
