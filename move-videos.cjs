const fs = require("fs");
let layout = fs.readFileSync("src/components/AppLayout.tsx", "utf8");

// Remove LandingVideos from current position
layout = layout.replace("<LandingVideos />\n", "");

// Add after FfkMomentsSection
layout = layout.replace(
  "<FfkMomentsSection />",
  "<FfkMomentsSection />\n      <LandingVideos />"
);

fs.writeFileSync("src/components/AppLayout.tsx", layout, "utf8");
console.log("[OK] LandingVideos moved after FfkMomentsSection");

// Verify order
const final = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
const lines = final.split("\n");
lines.forEach((l, i) => {
  if (l.includes("<") && l.includes("/>") && !l.includes("div") && !l.includes("//")) {
    console.log((i+1) + ": " + l.trimEnd());
  }
});
