const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");

// Show lines 25-40 to see where hooks should be
console.log("=== Lines 25-45 ===");
lines.slice(24, 45).forEach((l, i) => console.log((i+25) + ": " + l.trimEnd()));

// Show lines 245-260 where the misplaced hooks are
console.log("\n=== Lines 245-260 ===");
lines.slice(244, 260).forEach((l, i) => console.log((i+245) + ": " + l.trimEnd()));
