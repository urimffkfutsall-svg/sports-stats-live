const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");
const total = lines.length;

// Show last 20 lines
console.log("=== Last 20 lines ===");
lines.slice(total - 20).forEach((l, i) => console.log((total - 20 + i + 1) + ": " + l.trimEnd()));

// Find ALL }; to see where component ends
console.log("\n=== All }; locations ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '};') {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
