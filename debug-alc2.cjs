const fs = require("fs");
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = alc.split("\n");

// Find where "Transmetimet Live" section starts
let streamStart = -1;
let streamEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("LIVE STREAMS") || lines[i].includes("Transmetimet Live")) {
    streamStart = i;
    console.log("Stream section starts at line: " + (i+1));
  }
}

// Show 10 lines before stream section to see the context
if (streamStart > 0) {
  console.log("\n=== 15 lines BEFORE stream section ===");
  for (let i = Math.max(0, streamStart - 15); i < streamStart; i++) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Show last 30 lines
console.log("\n=== Last 30 lines ===");
for (let i = Math.max(0, lines.length - 30); i < lines.length; i++) {
  console.log((i+1) + ": " + lines[i].trimEnd());
}
