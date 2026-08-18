const fs = require("fs");
const path = require("path");

function search(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && !f.includes("node_modules") && !f.includes(".git")) search(full);
    else if (f.endsWith(".tsx")) {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes("slideshow") || c.includes("Slideshow") || c.includes("slider") || c.includes("Slider") || c.includes("carousel") || c.includes("Carousel") || c.includes("Swiper") || c.includes("slide")) {
        console.log("Found: " + full);
      }
    }
  });
}
search("src");

// Also search for news in Index.tsx with broader terms
let idx = fs.readFileSync("src/pages/Index.tsx", "utf8");
const lines = idx.split("\n");
console.log("\n=== Index.tsx - photo/thumbnail/slide/featured lines ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("photo") || lines[i].includes("thumbnail") || lines[i].includes("slide") || lines[i].includes("featured") || lines[i].includes("getPhotos") || lines[i].includes("lajm") || lines[i].includes("/lajme")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
