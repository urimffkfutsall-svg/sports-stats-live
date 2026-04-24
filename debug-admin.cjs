const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");
console.log("Total lines: " + lines.length);

// Show lines 19-25 (component start)
console.log("=== Component start ===");
lines.slice(18, 25).forEach((l, i) => console.log((i+19) + ": " + l.trimEnd()));

// Find DashCard
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("DashCard")) {
    console.log("DashCard at " + (i+1) + ": " + lines[i].trimEnd());
  }
}

// Check for any syntax issues around DashCard definition
for (let i = 45; i < 55; i++) {
  console.log((i+1) + ": " + lines[i]?.trimEnd());
}

// Check export
console.log("\n=== Last 5 lines ===");
lines.slice(-5).forEach((l, i) => console.log((lines.length - 5 + i + 1) + ": " + l.trimEnd()));

// Check for backtick template literal issues
const dashIdx = admin.indexOf("const DashCard");
if (dashIdx > -1) {
  console.log("\n=== DashCard definition (50 chars) ===");
  console.log(admin.substring(dashIdx, dashIdx + 300));
}
