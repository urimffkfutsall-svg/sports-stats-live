const fs = require("fs");
let an = fs.readFileSync("src/pages/admin/AdminNews.tsx", "utf8");
// Show the rest of the file (from line 70 onwards)
const lines = an.split("\n");
console.log("=== Lines 70-147 ===");
lines.slice(69).forEach((l, i) => console.log((i+70) + ": " + l.trimEnd()));
