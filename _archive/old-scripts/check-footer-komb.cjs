const fs = require("fs");

// 1) Fix Footer logo - check what's there
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
const fLines = footer.split("\n");
console.log("=== Footer logo section ===");
for (let i = 0; i < fLines.length; i++) {
  if (fLines[i].includes("img") || fLines[i].includes("logo") || fLines[i].includes("Logo")) {
    console.log((i+1) + ": " + fLines[i].trimEnd());
  }
}

// 2) Check KombetarjaPage
let kp = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
console.log("\n=== KombetarjaPage ===");
console.log("Lines: " + kp.split("\n").length);
console.log(kp.substring(0, 2000));
