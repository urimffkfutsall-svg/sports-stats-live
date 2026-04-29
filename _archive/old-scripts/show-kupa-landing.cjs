const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lines = s.split("\n");

// Find MatchGrid for kupa and how title/week is shown
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Kupa") || lines[i].includes("kupaMatches") || lines[i].includes("kupaData") || lines[i].includes("MatchGrid") || lines[i].includes("title}") || lines[i].includes("weekLabel")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
