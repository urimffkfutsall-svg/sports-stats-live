const fs = require("fs");
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
const lines = header.split("\n");
console.log("=== First 40 lines ===");
lines.slice(0, 40).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
