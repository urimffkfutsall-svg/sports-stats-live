const fs = require("fs");
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = live.split("\n");
console.log("=== Lines 400-613 ===");
lines.slice(399, 613).forEach((l, i) => console.log((i+400) + ": " + l.trimEnd()));
