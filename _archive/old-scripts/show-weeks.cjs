const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");

// Show lines related to week selection and tab "ndeshjet"
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].toLowerCase();
  if (l.includes("week") || l.includes("java") || l.includes("ndeshjet") || l.includes("selectedweek") || l.includes("activetab")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
