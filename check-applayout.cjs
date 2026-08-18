const fs = require("fs");
let app = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
const lines = app.split("\n");
console.log("Lines: " + lines.length);
// Find where sections are rendered
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Superliga") || lines[i].includes("section") || lines[i].includes("Section") || lines[i].includes("News") || lines[i].includes("lajme") || lines[i].includes("Footer")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
