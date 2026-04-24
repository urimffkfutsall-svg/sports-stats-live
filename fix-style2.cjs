const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");

// Show line 73 raw
console.log("Raw line 73: [" + lines[72] + "]");

// Replace line 73 with proper JSX style
lines[72] = '                    style= transform: "scale(1.5)", transformOrigin: "center center" ';

fs.writeFileSync("src/components/LandingNews.tsx", lines.join("\n"), "utf8");
console.log("Fixed line 73: " + lines[72].trimEnd());
console.log("[OK] Style fixed");
