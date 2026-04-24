const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Show the cupMatches filter
const lines = kupa.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("cupMatches") || lines[i].includes("comp.id") || lines[i].includes("competitionId") || lines[i].includes("c.type")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Check if there's any isFeaturedLanding filter
console.log("\nHas isFeaturedLanding filter: " + kupa.includes("isFeaturedLanding"));

// Show the comp detection
const compIdx = kupa.indexOf("const comp = useMemo");
const compEnd = kupa.indexOf(");", compIdx) + 2;
console.log("\nComp detection:");
console.log(kupa.substring(compIdx, compEnd));
