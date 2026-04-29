const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");

// Show lines 160-170 to see the main component's useData
console.log("=== Lines 160-170 ===");
lines.slice(159, 170).forEach((l, i) => console.log((i+160) + ": " + l.trimEnd()));

// Show lines 108-120 to see where video section was inserted
console.log("\n=== Lines 108-125 ===");
lines.slice(107, 125).forEach((l, i) => console.log((i+108) + ": " + l.trimEnd()));

// Show where the main component starts
for (let i = 150; i < 175; i++) {
  console.log((i+1) + ": " + lines[i]?.trimEnd());
}
