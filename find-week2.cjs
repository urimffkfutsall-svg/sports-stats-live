const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Find where week badge shows for kupa matches
const lines = s.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("match.week") || lines[i].includes("Java {match") || lines[i].includes("weekLabel") || lines[i].includes("isKupa")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
