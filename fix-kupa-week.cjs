const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// 1) In the MatchRow (line 112) - the week badge shows for ALL matches
// Need to pass isKupa info to MatchRow. But MatchRow doesn't have it.
// Easiest fix: check competition type inside MatchRow
// Add a check - get competition type from match.competitionId

// Replace the individual match week badge to check if it's not kupa
s = s.replace(
  '{match.week && (<span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold"><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Java {match.week}</span></span>)}',
  '{match.week && !competitions.find(c => c.id === match.competitionId && c.type === "kupa") && (<span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold"><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Java {match.week}</span></span>)}'
);

// 2) In the MatchGrid header - weekLabel for kupa already shows round name
// Change it to show nothing for kupa
s = s.replace(
  "const weekLabel = isKupa && week ? (kupaRoundNames[week]",
  "const weekLabel = isKupa ? '' : week ? `Java ${week}` : ''; // was: isKupa && week ? (kupaRoundNames[week]"
);

// Check if competitions is available in MatchRow scope
if (!s.includes("const { competitions") && !s.includes("competitions,")) {
  // Need to check how data is accessed
  const hasUseData = s.includes("useData");
  console.log("Has useData: " + hasUseData);
}

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");
console.log("[OK] Removed Java badge for Kupa matches");

// Verify
const final = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
console.log("Still has competitions check: " + final.includes('c.type === "kupa"'));
