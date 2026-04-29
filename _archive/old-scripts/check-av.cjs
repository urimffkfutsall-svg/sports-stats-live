const fs = require("fs");
let av = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");

// Check if checkboxes exist
console.log("Has isFeaturedSuperliga checkbox: " + av.includes("isFeaturedSuperliga"));
console.log("Has isFeaturedLigaPare checkbox: " + av.includes("isFeaturedLigaPare"));
console.log("Has 'Shfaq te Superliga': " + av.includes("Shfaq te Superliga"));

// Show the form area
const lines = av.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Shfaq") || lines[i].includes("checkbox") || lines[i].includes("isFeatured")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
