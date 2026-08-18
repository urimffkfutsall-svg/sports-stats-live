const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const lines = f.split("\n");
console.log("=== Lines 240-257 ===");
lines.slice(239, 257).forEach((l, i) => console.log((i+240) + ": " + l.trimEnd()));
