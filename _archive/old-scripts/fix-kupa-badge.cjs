const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Fix weekLabel for kupa - show round name instead of empty
s = s.replace(
  "const weekLabel = isKupa ? '' : week ? `Java ${week}` : '';",
  "const weekLabel = isKupa && week ? (kupaRoundNames[week] || `Raundi ${week}`) : !isKupa && week ? `Java ${week}` : '';"
);

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");

// Verify
const final = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
console.log("Has kupaRoundNames: " + final.includes("kupaRoundNames"));
console.log("weekLabel line: " + final.split("\n").find(l => l.includes("const weekLabel")));
console.log("[OK] Kupa now shows: Cerekfinalet / Gjysmefinalet / Finalja badge");
