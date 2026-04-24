const fs = require("fs");
let s = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
// Find the broken style line and replace with correct JSX
const lines = s.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("style=") && lines[i].includes("height") && lines[i].includes("260")) {
    lines[i] = '          style= height: "260px" ';
  }
}
s = lines.join("\n");
fs.writeFileSync("src/components/LandingNews.tsx", s, "utf8");
console.log("[OK] style fixed properly");
