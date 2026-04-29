const fs = require("fs");
let al = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
const lines = al.split("\n");
console.log("Total lines: " + lines.length);

// Find news/lajme/slideshow sections
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("news") || lines[i].includes("lajm") || lines[i].includes("/lajme") || lines[i].includes("getPhotos") || lines[i].includes("photo") || lines[i].includes("slide") || lines[i].includes("autoplay") || lines[i].includes("interval") || lines[i].includes("current")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
