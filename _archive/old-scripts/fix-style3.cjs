const fs = require("fs");
let s = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = s.split("\n");
const open = String.fromCharCode(123);
const close = String.fromCharCode(125);
const correct = "          style=" + open + open + " height: '260px' " + close + close;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("style=") && (lines[i].includes("height") || lines[i].includes("260"))) {
    lines[i] = correct;
  }
}
s = lines.join("\n");
fs.writeFileSync("src/components/LandingNews.tsx", s, "utf8");
console.log("[OK] style=" + open + open + " height: '260px' " + close + close);
