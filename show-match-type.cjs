const fs = require("fs");

// Show Match type
let types = fs.readFileSync("src/types/index.ts", "utf8");
const matchStart = types.indexOf("export interface Match");
const matchEnd = types.indexOf("}", matchStart) + 1;
console.log("=== Match Type ===");
console.log(types.substring(matchStart, matchEnd));

// Show MatchCard
console.log("\n=== MatchCard.tsx ===");
console.log(fs.readFileSync("src/components/MatchCard.tsx", "utf8"));

// Show AdminMatches to see how cup matches are added
let adminFiles = fs.readdirSync("src/pages/admin");
console.log("\nAdmin files:", adminFiles.join(", "));
