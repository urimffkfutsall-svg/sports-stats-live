const fs = require("fs");

// Show NewsDetailPage to find where to add video
let ndp = fs.readFileSync("src/pages/NewsDetailPage.tsx", "utf8");
const lines = ndp.split("\n");
console.log("=== NewsDetailPage ===");
lines.forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
