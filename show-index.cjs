const fs = require("fs");
let idx = fs.readFileSync("src/pages/Index.tsx", "utf8");
const lines = idx.split("\n");
console.log("Total lines: " + lines.length);
console.log("=== First 80 lines ===");
lines.slice(0, 80).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
