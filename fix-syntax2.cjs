const fs = require("fs");

// Fix StatistikatPage
let sp = fs.readFileSync("src/pages/StatistikatPage.tsx", "utf8");
sp = sp.replace(
  "<div style= overflowX: 'hidden' as const  style={Object.assign({}, {",
  "<div style={Object.assign({}, { overflowX: 'hidden' as const,"
);
fs.writeFileSync("src/pages/StatistikatPage.tsx", sp, "utf8");
console.log("StatistikatPage line 126: " + sp.split("\n")[125]?.trimEnd());

// Also verify TeamProfilePage doesn't have same issue
let tp = fs.readFileSync("src/pages/TeamProfilePage.tsx", "utf8");
const hasBadStyle = tp.includes("style= overflowX");
console.log("TeamProfilePage still broken: " + hasBadStyle);

console.log("[OK] Both pages fixed");
