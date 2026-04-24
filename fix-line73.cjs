const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");
// Replace line 73 with proper JSX style using double curly braces
lines[72] = "                    style= transform: 'scale(1.5)', transformOrigin: 'center center' ";
fs.writeFileSync("src/components/LandingNews.tsx", lines.join("\n"), "utf8");
console.log("Line 73:", lines[72].trim());
