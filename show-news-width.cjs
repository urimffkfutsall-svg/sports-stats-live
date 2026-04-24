const fs = require("fs");
let s = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = s.split("\n");
console.log("LandingNews.tsx - " + lines.length + " lines");
// Show width/max-width related lines
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("max-w") || lines[i].includes("width") || lines[i].includes("w-full") || lines[i].includes("max-w-") || lines[i].includes("px-") && lines[i].includes("section") || lines[i].includes("mx-auto")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
