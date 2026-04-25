const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const lines = f.split("\n");
// Find the style line for goals bar
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("goalsFor") && lines[i].includes("style")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
    // Fix it
    lines[i] = '                  <div className="bg-[#1E6FF2] h-full rounded-full" style= width: (goalsFor + goalsAgainst > 0 ? (goalsFor / (goalsFor + goalsAgainst) * 100) : 50) + "%" ></div>';
    console.log("FIXED: " + lines[i].trimEnd());
  }
}
fs.writeFileSync("src/pages/KombetarjaPage.tsx", lines.join("\n"), "utf8");
console.log("[OK] Style fixed");
