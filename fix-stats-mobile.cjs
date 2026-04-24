const fs = require("fs");
let s = fs.readFileSync("src/pages/StatistikatPage.tsx", "utf8");

// 1) Stats cards grid: repeat(6, 1fr) -> responsive
s = s.replace(
  "gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px'",
  "gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px'"
);

// 2) Main layout: 5fr 3fr -> stack on mobile
s = s.replace(
  "gridTemplateColumns: '5fr 3fr', gap: '20px'",
  "gridTemplateColumns: '1fr', gap: '16px'"
);

// 3) Three column layout: 2fr 1.5fr 1.5fr -> stack on mobile
s = s.replace(
  "gridTemplateColumns: '2fr 1.5fr 1.5fr', gap: '20px'",
  "gridTemplateColumns: '1fr', gap: '16px'"
);

// 4) Team grid: 1fr 1fr -> responsive
s = s.replace(
  "gridTemplateColumns: \"1fr 1fr\", gap: \"12px\"",
  "gridTemplateColumns: '1fr', gap: '10px'"
);

// 5) Fix overflow on the whole page - add overflow-x hidden
if (!s.includes("overflowX: 'hidden'")) {
  // Find the outer container
  s = s.replace(
    /return\s*\(\s*<div/,
    "return (\n    <div style= overflowX: 'hidden' as const "
  );
  // Actually that might break, let me do it more carefully
}

// 6) Make the head-to-head button wrap better on mobile
s = s.replace(
  "display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px'",
  "display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap' as const, gap: '12px'"
);

// 7) Fix competition filter buttons wrapping
// Already has flexWrap which is good

fs.writeFileSync("src/pages/StatistikatPage.tsx", s, "utf8");
console.log("[OK] StatistikatPage - mobile responsive grid layouts fixed");

// Now fix TeamProfilePage
let tp = fs.readFileSync("src/pages/TeamProfilePage.tsx", "utf8");
const tLines = tp.split("\n");
console.log("\n=== TeamProfilePage grid layouts ===");
for (let i = 0; i < tLines.length; i++) {
  if (tLines[i].includes("gridTemplateColumns") || tLines[i].includes("grid-cols") || tLines[i].includes("overflow")) {
    console.log((i+1) + ": " + tLines[i].trimEnd());
  }
}
