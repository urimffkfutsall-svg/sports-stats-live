const fs = require("fs");
let header = fs.readFileSync("src/components/Header.tsx", "utf8");

// Add FFK logo on the right side, before the admin/login buttons
// First let's see what's on the right side
const lines = header.split("\n");
console.log("=== Lines 40-80 ===");
lines.slice(39, 80).forEach((l, i) => console.log((i+40) + ": " + l.trimEnd()));
