const fs = require("fs");
let tp = fs.readFileSync("src/pages/TeamProfilePage.tsx", "utf8");

// Fix the broken line 129 - remove the bad style insertion
tp = tp.replace(
  '<div style= overflowX: "hidden" as const  style={Object.assign({}, {',
  '<div style={Object.assign({}, { overflowX: "hidden" as const,'
);

fs.writeFileSync("src/pages/TeamProfilePage.tsx", tp, "utf8");

// Verify line 129
const lines = tp.split("\n");
console.log("Line 129: " + lines[128]?.trimEnd());
console.log("[OK] Fixed syntax error");
