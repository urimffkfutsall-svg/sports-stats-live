const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");
const total = lines.length;

// Show last 60 lines to see where video section ended up
console.log("=== Last 60 lines ===");
lines.slice(total - 60).forEach((l, i) => console.log((total - 60 + i + 1) + ": " + l.trimEnd()));
