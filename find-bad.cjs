const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Show remaining bad characters with context
const lines = s.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ]/)) {
    // Check if it's mojibake vs normal albanian
    if (lines[i].includes('â') || lines[i].includes('Ã')) {
      console.log((i+1) + ": " + lines[i].trimEnd());
    }
  }
}
