const fs = require("fs");

// Show AdminLiveControl lines 150-250 (UI part)
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = live.split("\n");
console.log("=== AdminLiveControl lines 150-250 ===");
lines.slice(149, 250).forEach((l, i) => console.log((i+150) + ": " + l.trimEnd()));
