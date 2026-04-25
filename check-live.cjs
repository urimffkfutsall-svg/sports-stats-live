const fs = require("fs");

// Check AdminLiveControl
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
console.log("AdminLiveControl lines: " + live.split("\n").length);

// Check LiveMatchBanner
let banner = fs.readFileSync("src/components/LiveMatchBanner.tsx", "utf8");
console.log("LiveMatchBanner lines: " + banner.split("\n").length);

// Show first 50 lines of each
console.log("\n=== AdminLiveControl (first 50) ===");
live.split("\n").slice(0, 50).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));

console.log("\n=== LiveMatchBanner (first 50) ===");
banner.split("\n").slice(0, 50).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
