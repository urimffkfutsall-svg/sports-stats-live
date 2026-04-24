const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Add more debug to show all rounds and their matches
kupa = kupa.replace(
  "Debug: Comp={comp?.id ? 'found' : 'NOT FOUND'}",
  "Debug: Comp={comp?.id ? 'found' : 'NOT FOUND'} | Rounds={rounds.map(r => `R${r.round}:${r.ties.length}ties`).join(', ')} | CupMatchWeeks={cupMatches.map(m => m.week).join(',')}"
);

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] More debug info added");
