const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const lines = f.split("\n");
// Replace line 185 with correct JSX style using char codes
const ob = String.fromCharCode(123);
const cb = String.fromCharCode(125);
lines[184] = '                  <div className="bg-[#1E6FF2] h-full rounded-full" style=' + ob + ob + ' width: (goalsFor + goalsAgainst > 0 ? (goalsFor / (goalsFor + goalsAgainst) * 100) : 50) + "%" ' + cb + cb + '></div>';
fs.writeFileSync("src/pages/KombetarjaPage.tsx", lines.join("\n"), "utf8");
console.log("Line 185: " + lines[184].trim());
console.log("[OK]");
