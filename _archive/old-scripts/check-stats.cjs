const fs = require("fs");

// Check StatistikatPage
let stat = fs.readFileSync("src/pages/StatistikatPage.tsx", "utf8");
console.log("StatistikatPage lines: " + stat.split("\n").length);

// Check TeamProfilePage
let team = fs.readFileSync("src/pages/TeamProfilePage.tsx", "utf8");
console.log("TeamProfilePage lines: " + team.split("\n").length);

// Show the team stats popup/modal area in StatistikatPage
const sLines = stat.split("\n");
console.log("\n=== StatistikatPage - team click/modal area ===");
for (let i = 0; i < sLines.length; i++) {
  if (sLines[i].includes("modal") || sLines[i].includes("Modal") || sLines[i].includes("popup") || sLines[i].includes("Popup") || sLines[i].includes("selectedTeam") || sLines[i].includes("teamStats") || sLines[i].includes("onClick") || sLines[i].includes("grid") || sLines[i].includes("flex") || sLines[i].includes("overflow")) {
    console.log((i+1) + ": " + sLines[i].trimEnd());
  }
}
