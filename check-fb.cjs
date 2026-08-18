const fs = require("fs");

// The issue: Facebook videos don't have easy thumbnails like YouTube
// Solution: Embed the video directly as background instead of an image
// Show a mini video preview in the slideshow

let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");

// Find the video thumbnail section we just added
console.log("=== Video thumbnail section ===");
for (let i = 50; i < 75; i++) {
  console.log((i+1) + ": " + lines[i]?.trimEnd());
}
