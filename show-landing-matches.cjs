const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lines = s.split("\n");
console.log("LandingMatches.tsx - " + lines.length + " lines");
// Show lines with match card rendering (around where team names and scores appear)
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes("week") || l.includes("java") || l.includes("Java") || l.includes("Week") || l.includes("homeTeam") || l.includes("awayTeam") || l.includes("Score") || l.includes("score") || l.includes("className") && l.includes("match")) {
    console.log((i+1) + ": " + l.trimEnd());
  }
}
console.log("\n=== First 80 lines ===");
console.log(lines.slice(0, 80).join("\n"));
