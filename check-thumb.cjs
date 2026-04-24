const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");

// Find the background image section
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Background") || lines[i].includes("getPhotos(item.photo)") || lines[i].includes("gradient-to-br") || lines[i].includes("getVideoThumbnail")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
