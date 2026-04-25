const fs = require("fs");
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = alc.split("\n");

// Show lines around the main return structure - find the "Nuk ka ndeshje LIVE" section
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Nuk ka ndeshje") || lines[i].includes("Fillo Ndeshje") || lines[i].includes("return (")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Show lines 100-130 to see the conditional structure
console.log("\n=== Lines 95-140 ===");
for (let i = 94; i < Math.min(140, lines.length); i++) {
  console.log((i+1) + ": " + lines[i].trimEnd());
}
