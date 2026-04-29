const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");
const lines = app.split("\n");

// Show first 40 lines
console.log("=== App.tsx first 40 lines ===");
lines.slice(0, 40).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
