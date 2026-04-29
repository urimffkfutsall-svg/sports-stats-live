const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lines = s.split("\n");
console.log("=== Lines 160-245 ===");
console.log(lines.slice(159, 245).map((l, i) => (i+160) + ": " + l).join("\n"));
