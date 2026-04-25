const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const lines = f.split("\n");
// Line 272 (index 271) - fix style syntax
const q = String.fromCharCode(34);
const o = String.fromCharCode(123);
const c = String.fromCharCode(125);
const pct = String.fromCharCode(37);
const newLine = '                  <div className=' + q + 'bg-[#1E6FF2] h-full rounded-full' + q + ' style=' + o + o + ' width: (goalsFor + goalsAgainst > 0 ? (goalsFor / (goalsFor + goalsAgainst) * 100) : 50) + ' + q + pct + q + ' ' + c + c + '></div>';
lines[271] = newLine;
fs.writeFileSync("src/pages/KombetarjaPage.tsx", lines.join("\n"), "utf8");
console.log("Fixed line 272:");
console.log(lines[271].trim());
