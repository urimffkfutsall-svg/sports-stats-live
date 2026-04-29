const fs = require("fs");

// Add live streams management to AdminLiveControl
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = alc.split("\n");
console.log("AdminLiveControl lines: " + lines.length);
console.log("=== First 15 ===");
lines.slice(0, 15).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
console.log("=== Last 10 ===");
lines.slice(-10).forEach((l, i) => console.log((lines.length - 10 + i + 1) + ": " + l.trimEnd()));
