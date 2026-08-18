const fs = require("fs");

// Fix TeamProfilePage responsive grids
let tp = fs.readFileSync("src/pages/TeamProfilePage.tsx", "utf8");

// 1) Stats cards: repeat(5, 1fr) -> responsive
tp = tp.replace(
  "gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px'",
  "gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px'"
);

// 2) Main layout: 5fr 3fr -> stack on mobile
tp = tp.replace(
  "gridTemplateColumns: '5fr 3fr', gap: '20px'",
  "gridTemplateColumns: '1fr', gap: '16px'"
);

// 3) Three column: 1fr 1fr 1fr -> responsive
tp = tp.replace(
  "gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'",
  "gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'"
);

// 4) Two column: 2fr 3fr -> stack on mobile
tp = tp.replace(
  "gridTemplateColumns: '2fr 3fr', gap: '20px'",
  "gridTemplateColumns: '1fr', gap: '16px'"
);

// 5) Fix header padding for mobile
tp = tp.replace(
  "padding: '32px 32px 40px'",
  "padding: '20px 16px 32px'"
);

// 6) Add overflow-x hidden to prevent horizontal scroll
tp = tp.replace(
  /return\s*\(\s*\n\s*<div/,
  'return (\n    <div style= overflowX: "hidden" as const '
);

// If that didn't work, try simpler approach
if (!tp.includes('overflowX: "hidden"')) {
  // Find the first <div in the return
  const returnIdx = tp.indexOf('return (');
  if (returnIdx > -1) {
    const divIdx = tp.indexOf('<div', returnIdx);
    if (divIdx > -1) {
      const closeIdx = tp.indexOf('>', divIdx);
      // Check if it has style
      const divContent = tp.substring(divIdx, closeIdx + 1);
      if (divContent.includes('style')) {
        // Already has style, skip
      } else {
        tp = tp.substring(0, divIdx) + '<div style= overflowX: "hidden" as const, maxWidth: "100vw" ' + tp.substring(divIdx + 4);
      }
    }
  }
}

fs.writeFileSync("src/pages/TeamProfilePage.tsx", tp, "utf8");
console.log("[OK] TeamProfilePage - mobile responsive fixed");
console.log("  - Stats cards: auto-fit minmax grid");
console.log("  - Main layouts: stacked on mobile");
console.log("  - Padding reduced for mobile");
console.log("  - Overflow-x hidden");

// Also add a CSS media query approach for both pages
// Add responsive override in index.css
let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes("stats-responsive")) {
  css += `
/* Stats page mobile responsive */
@media (max-width: 640px) {
  .stats-responsive {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
}
`;
  fs.writeFileSync("src/index.css", css, "utf8");
  console.log("[OK] Added mobile CSS overrides");
}
