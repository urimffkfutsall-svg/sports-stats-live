const fs = require("fs");

// Check if App.tsx still has issues
let app = fs.readFileSync("src/App.tsx", "utf8");
const lines = app.split("\n");
console.log("=== App.tsx lines 1-35 ===");
lines.slice(0, 35).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));

// Check AdminPage for useState import
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const aLines = admin.split("\n");

// Check imports
console.log("\n=== AdminPage imports ===");
aLines.slice(0, 15).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));

// Check visitorStats
console.log("\n=== AdminPage visitorStats ===");
for (let i = 0; i < aLines.length; i++) {
  if (aLines[i].includes("visitorStats") || aLines[i].includes("dbVisitors") || aLines[i].includes("useEffect")) {
    console.log((i+1) + ": " + aLines[i].trimEnd());
  }
}
