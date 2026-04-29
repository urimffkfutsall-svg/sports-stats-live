const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");
// Fix the broken line with \`n
app = app.replace(/\/>\s*`n\s*<Route/g, '/>\n                <Route');
fs.writeFileSync("src/App.tsx", app, "utf8");
console.log("[OK] Fixed broken line in App.tsx");

// Verify
const lines = app.split("\n").filter(l => l.includes("Route") || l.includes("import News"));
lines.forEach(l => console.log("  " + l.trim()));
