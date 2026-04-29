const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");

// Check useData destructuring
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("useData")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Check video section
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("video") || lines[i].includes("Video") || lines[i].includes("getEmbedUrl") || lines[i].includes("isFeaturedSuperliga") || lines[i].includes("isFeaturedLigaPare") || lines[i].includes("compVideos")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
