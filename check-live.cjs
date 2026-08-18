const fs = require("fs");
let live = fs.readFileSync("src/pages/LiveMatchPage.tsx", "utf8");
const lines = live.split("\n");
console.log("Lines: " + lines.length);
console.log("=== First 30 ===");
lines.slice(0, 30).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
