const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
const lines = s.split("\n");

// Show lines related to team selection
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes("compTeams") || l.includes("homeTeamId") || l.includes("awayTeamId") || l.includes("teams.filter") || l.includes("teamOptions") || l.includes("getTeams") || l.includes("comp.") && l.includes("team")) {
    console.log((i+1) + ": " + l.trimEnd());
  }
}

// Show lines 150-210 (form area with team selects)
console.log("\n=== Lines 150-220 ===");
lines.slice(149, 220).forEach((l, i) => console.log((i+150) + ": " + l));
