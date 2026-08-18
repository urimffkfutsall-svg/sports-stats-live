const fs = require("fs");

// Show AdminLiveControl full (lines 50-150 for timer and goal features)
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = live.split("\n");
console.log("=== AdminLiveControl lines 50-150 ===");
lines.slice(49, 150).forEach((l, i) => console.log((i+50) + ": " + l.trimEnd()));
