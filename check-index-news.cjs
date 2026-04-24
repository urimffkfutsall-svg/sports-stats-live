const fs = require("fs");

// Check Index page for news section
let idx = fs.readFileSync("src/pages/Index.tsx", "utf8");
const lines = idx.split("\n");
console.log("=== Index - News/Lajme section ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("news") || lines[i].includes("News") || lines[i].includes("lajm") || lines[i].includes("Lajm")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
