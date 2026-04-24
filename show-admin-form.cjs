const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
const lines = s.split("\n");
console.log("=== Lines 55-110 (form state + submit) ===");
lines.slice(54, 110).forEach((l, i) => console.log((i+55) + ": " + l));
console.log("\n=== Lines 230-300 (rest of form + stats) ===");
lines.slice(229, 300).forEach((l, i) => console.log((i+230) + ": " + l));
