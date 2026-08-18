const fs = require("fs");
let s = fs.readFileSync("src/context/DataContext.tsx", "utf8");
const lines = s.split("\n");

// Show lines 155-210 (the loading/fetch area)
console.log("=== Lines 155-210 (fetch area) ===");
lines.slice(154, 210).forEach((l, i) => console.log((i+155) + ": " + l));

// Show lines 1-20 (imports)
console.log("\n=== Lines 1-20 (imports) ===");
lines.slice(0, 20).forEach((l, i) => console.log((i+1) + ": " + l));

// Check if there's a loading state
console.log("\n=== Loading state ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("loading") || lines[i].includes("isLoading") || lines[i].includes("setLoading")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
