const fs = require("fs");
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = alc.split("\n");

// Show lines 270-300 to see the "no live matches" return
console.log("=== Lines 270-300 ===");
for (let i = 269; i < 300; i++) {
  console.log((i+1) + ": " + lines[i].trimEnd());
}
