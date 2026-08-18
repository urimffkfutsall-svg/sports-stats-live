const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const lines = f.split("\n");

// Remove extra lines 249-250 (index 248-249)
// Line 248: empty
// Line 249: </div> (extra)
// Line 250: )} (extra)
lines.splice(248, 3); // Remove lines 249, 250, 251 (empty + </div> + )})

fs.writeFileSync("src/pages/KombetarjaPage.tsx", lines.join("\n"), "utf8");

const final = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
const fl = final.split("\n");
console.log("=== Lines 245-255 ===");
fl.slice(244, 255).forEach((l, i) => console.log((i+245) + ": " + l.trimEnd()));
console.log("Total lines: " + fl.length);
