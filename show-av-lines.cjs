const fs = require("fs");
let av = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");
const lines = av.split("\n");

// Show lines 44-56
console.log("=== Lines 44-56 ===");
lines.slice(43, 56).forEach((l, i) => console.log((i+44) + ": " + l));
