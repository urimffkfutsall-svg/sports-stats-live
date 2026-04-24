const fs = require("fs");

// 1) Check Header for mobile menu
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
const hLines = header.split("\n");
console.log("=== HEADER - mobile menu ===");
for (let i = 0; i < hLines.length; i++) {
  if (hLines[i].includes("menu") || hLines[i].includes("hamburger") || hLines[i].includes("mobile") || hLines[i].includes("isOpen") || hLines[i].includes("setOpen") || hLines[i].includes("setMenu") || hLines[i].includes("md:hidden") || hLines[i].includes("lg:hidden") || hLines[i].includes("three") || hLines[i].includes("bar") || hLines[i].includes("svg") || hLines[i].includes("onClick")) {
    console.log((i+1) + ": " + hLines[i].trimEnd());
  }
}

// 2) Check CompetitionPage for "Te ardheshme" tab logic
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const cLines = comp.split("\n");
console.log("\n=== COMPETITION PAGE - upcoming tab ===");
for (let i = 0; i < cLines.length; i++) {
  if (cLines[i].includes("ardheshme") || cLines[i].includes("upcoming") || cLines[i].includes("planned") || cLines[i].includes("currentWeek") || cLines[i].includes("nextWeek") || cLines[i].includes("tab") || cLines[i].includes("filterWeek") || cLines[i].includes("weekFilter")) {
    console.log((i+1) + ": " + cLines[i].trimEnd());
  }
}
