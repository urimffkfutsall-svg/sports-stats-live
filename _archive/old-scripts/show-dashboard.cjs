const fs = require("fs");

// Show AdminPage dashboard section (lines 118-140)
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");
console.log("=== Dashboard section ===");
lines.slice(117, 160).forEach((l, i) => console.log((i+118) + ": " + l.trimEnd()));
