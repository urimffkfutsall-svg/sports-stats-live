const fs = require("fs");
let lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lines = lm.split("\n");
console.log("=== LandingMatches lines 78-170 ===");
lines.slice(77, 170).forEach((l, i) => console.log((i+78) + ": " + l.trimEnd()));
