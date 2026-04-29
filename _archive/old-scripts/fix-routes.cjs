const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");

// Remove the broken lines "} />"
app = app.replace(/\n} \/>\n/g, "\n");

fs.writeFileSync("src/App.tsx", app, "utf8");

// Verify
const lines = app.split("\n");
console.log("=== Lines 40-52 ===");
lines.slice(39, 52).forEach((l, i) => console.log((i+40) + ": " + l.trimEnd()));
console.log("[OK] Fixed broken routes");
