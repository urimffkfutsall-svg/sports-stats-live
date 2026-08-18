const fs = require("fs");

// =====================================================
// 1) FIX HEADER - Mobile hamburger missing 3 bars
// =====================================================
let header = fs.readFileSync("src/components/Header.tsx", "utf8");

// Line 83: {menuOpen ? "✕" : null} — null means nothing shows when closed!
// Replace with 3-bar hamburger icon
header = header.replace(
  '{menuOpen ? "\u2715" : null}',
  `{menuOpen ? (
                <span className="text-xl font-bold">\u2715</span>
              ) : (
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                </div>
              )}`
);

fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Header — hamburger 3-bar icon added for mobile");

// =====================================================
// 2) FIX CompetitionPage - "Te ardheshme" shows next week
// =====================================================
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// Need to see how weekMatches and plannedMatches work
// Show lines around 180-200
const cLines = comp.split("\n");
console.log("\n=== CompetitionPage lines 175-200 ===");
cLines.slice(174, 200).forEach((l, i) => console.log((i+175) + ": " + l.trimEnd()));

// Show lines 240-260 for the filter
console.log("\n=== CompetitionPage lines 240-260 ===");
cLines.slice(239, 260).forEach((l, i) => console.log((i+240) + ": " + l.trimEnd()));
