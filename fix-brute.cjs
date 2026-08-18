const fs = require("fs");
let buf = fs.readFileSync("src/components/LandingMatches.tsx");
let s = buf.toString("utf8");

// Replace all occurrences of the 3-byte sequence for â€" (broken em-dash)
// â = 0xC3 0xA2, € = 0xE2 0x82 0xAC, " = various
// Just do string replace on the actual broken text
const before = s;
s = s.split('\u00E2\u20AC\u201C').join('-');  // â€"
s = s.split('\u00E2\u20AC\u201D').join('-');  // â€"
s = s.split('\u00E2\u20AC\u00BA').join('>');  // â€º

// Brute force: find and replace any remaining non-ASCII sequences in comments
const lines = s.split('\n');
for (let i = 0; i < lines.length; i++) {
  // Replace any line that has broken chars in a comment
  if (lines[i].includes('/*') && lines[i].includes('*/')) {
    // Clean the comment - keep only ASCII
    lines[i] = lines[i].replace(/[^\x00-\x7F]+/g, '-');
  }
}
s = lines.join('\n');

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");

// Verify
const final = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
let badCount = 0;
final.split('\n').forEach((line, i) => {
  for (let c = 0; c < line.length; c++) {
    if (line.charCodeAt(c) > 127 && line.charCodeAt(c) < 256) {
      badCount++;
    }
  }
});
console.log("[OK] Remaining high-byte chars: " + badCount);
console.log("Has Java badge: " + final.includes("Java {match.week}"));
