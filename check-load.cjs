const fs = require("fs");
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");
const lines = ctx.split("\n");

// Show first 15 lines (imports)
console.log("=== IMPORTS (first 15 lines) ===");
lines.slice(0, 15).forEach((l, i) => console.log((i+1) + ": " + l));

// Show around line 165-180 (data loading / setState)
console.log("\n=== LOAD DATA area ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("fetchAllData") || lines[i].includes("videosData") || lines[i].includes("newsData") || lines[i].includes("setState(prev")) {
    // Show context: 3 lines before and 10 after
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length, i + 12);
    for (let j = start; j < end; j++) {
      console.log((j+1) + ": " + lines[j]);
    }
    console.log("---");
  }
}
