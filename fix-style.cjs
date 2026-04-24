const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");

// Fix the broken style line
ln = ln.replace(
  'style= transform: "scale(1.5)", transformOrigin: "center center" ',
  'style= transform: "scale(1.5)", transformOrigin: "center center" '
);

fs.writeFileSync("src/components/LandingNews.tsx", ln, "utf8");

const final = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = final.split("\n");
console.log("Line 73: " + lines[72]?.trimEnd());
console.log("[OK] Style syntax fixed");
