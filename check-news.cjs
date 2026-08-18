const fs = require("fs");

// Check News type
let types = fs.readFileSync("src/types/index.ts", "utf8");
const tLines = types.split("\n");
console.log("=== News type ===");
let inNews = false;
for (let i = 0; i < tLines.length; i++) {
  if (tLines[i].includes("interface News")) inNews = true;
  if (inNews) {
    console.log((i+1) + ": " + tLines[i].trimEnd());
    if (tLines[i].trim() === '}') { inNews = false; break; }
  }
}

// Check AdminNews
let an = fs.readFileSync("src/pages/admin/AdminNews.tsx", "utf8");
console.log("\nAdminNews lines: " + an.split("\n").length);
console.log(an.substring(0, 3000));
