const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// The week badge in MatchGrid shows for all competitions
// Need to hide it for kupa - the MatchGrid already has isKupa prop
// Change the weekLabel to return empty for kupa
s = s.replace(
  "const weekLabel = isKupa && week ? (kupaRoundNames[week]",
  "const weekLabel = isKupa ? '' : week ? `Java ${week}` : ''; // old: isKupa && week ? (kupaRoundNames[week]"
);

// Actually that might break - let me check what the current code looks like
const hasWeekLabel = s.includes("const weekLabel");
console.log("Has weekLabel: " + hasWeekLabel);

if (!hasWeekLabel) {
  // The week badge might be directly in JSX - find it
  if (s.includes("match.week")) {
    console.log("Found match.week references:");
    s.split("\n").forEach((l, i) => {
      if (l.includes("match.week")) console.log((i+1) + ": " + l.trimEnd());
    });
  }
}
