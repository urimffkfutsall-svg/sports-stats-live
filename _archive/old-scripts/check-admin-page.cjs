const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Check structure
const lines = admin.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("AdminLiveControl") || lines[i].includes("AdminKombetarja") || lines[i].includes("activeTab") || lines[i].includes("live")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
console.log("\nTotal lines: " + lines.length);
