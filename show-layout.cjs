const fs = require("fs");

// Check AppLayout to see where LiveMatchBanner is
let al = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
console.log("=== AppLayout ===");
console.log(al);

// Check LandingMatches to understand how matches show in ballina
let lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lines = lm.split("\n");
console.log("\n=== LandingMatches first 80 lines ===");
lines.slice(0, 80).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
console.log("\nTotal LandingMatches lines: " + lines.length);
