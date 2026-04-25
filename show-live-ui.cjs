const fs = require("fs");
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = live.split("\n");
console.log("=== Lines 250-400 ===");
lines.slice(249, 400).forEach((l, i) => console.log((i+250) + ": " + l.trimEnd()));
