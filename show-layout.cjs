const fs = require("fs");
let layout = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
const lines = layout.split("\n");
console.log("=== AppLayout ===");
lines.forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
