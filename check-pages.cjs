const fs = require("fs");

// Check Header for Komisioni/Kombetarja links
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
const hLines = header.split("\n");
console.log("=== Header - Komisioni/Kombetarja ===");
for (let i = 0; i < hLines.length; i++) {
  if (hLines[i].includes("komisioni") || hLines[i].includes("Komisioni") || hLines[i].includes("kombetarja") || hLines[i].includes("Kombetarja") || hLines[i].includes("kombetarj")) {
    console.log((i+1) + ": " + hLines[i].trimEnd());
  }
}

// Check App.tsx for routes
let app = fs.readFileSync("src/App.tsx", "utf8");
const aLines = app.split("\n");
console.log("\n=== App.tsx - routes ===");
for (let i = 0; i < aLines.length; i++) {
  if (aLines[i].includes("komisioni") || aLines[i].includes("Komisioni") || aLines[i].includes("kombetarja") || aLines[i].includes("Kombetarja")) {
    console.log((i+1) + ": " + aLines[i].trimEnd());
  }
}
