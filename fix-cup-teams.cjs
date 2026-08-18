const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Replace team selection for home team - show all teams when cup is selected
s = s.replace(
  "{(form.competitionId ? compTeams(form.competitionId) : activeTeams).map(t => (",
  "{(selectedIsCup ? activeTeams : form.competitionId ? compTeams(form.competitionId) : activeTeams).map(t => ("
);

// Replace team selection for away team - show all teams when cup is selected
s = s.replace(
  "{(form.competitionId ? compTeams(form.competitionId) : activeTeams).filter(t => t.id !== form.homeTeamId).map(t => (",
  "{(selectedIsCup ? activeTeams : form.competitionId ? compTeams(form.competitionId) : activeTeams).filter(t => t.id !== form.homeTeamId).map(t => ("
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");

// Verify
const final = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
console.log("Home select has selectedIsCup: " + final.includes("selectedIsCup ? activeTeams : form.competitionId ? compTeams"));
console.log("Away select has selectedIsCup: " + (final.match(/selectedIsCup \? activeTeams/g) || []).length === 2);
console.log("[OK] Cup now shows ALL teams");
