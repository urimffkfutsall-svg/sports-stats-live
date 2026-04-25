const fs = require("fs");

// =====================================================
// 1) Header - add gold bottom border
// =====================================================
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
header = header.replace(
  'bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg"',
  'bg-[#2a499a] text-white sticky top-0 z-50 shadow-lg border-b-[3px] border-[#d0a650]"'
);
fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Header - gold bottom border");

// =====================================================
// 2) Footer - add gold top border
// =====================================================
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
const fLines = footer.split("\n");
for (let i = 0; i < fLines.length; i++) {
  if (fLines[i].includes("bg-[#2a499a]") || fLines[i].includes("bg-gradient") && fLines[i].includes("2a499a")) {
    console.log("Footer line " + (i+1) + ": " + fLines[i].trimEnd());
  }
}

// Add gold top border to footer
if (footer.includes("bg-[#2a499a]") && !footer.includes("border-[#d0a650]")) {
  footer = footer.replace(
    /bg-\[#2a499a\]([^"]*")/,
    'bg-[#2a499a]$1'.replace('"', ' border-t-[3px] border-[#d0a650]"')
  );
}
// Try simpler approach
footer = footer.replace(
  'bg-[#2a499a]',
  'bg-[#2a499a] border-t-[3px] border-[#d0a650]'
);
fs.writeFileSync("src/components/Footer.tsx", footer, "utf8");
console.log("[OK] Footer - gold top border");

// =====================================================
// 3) Active nav link - gold underline
// =====================================================
header = fs.readFileSync("src/components/Header.tsx", "utf8");
// Find active link style
const hLines = header.split("\n");
for (let i = 0; i < hLines.length; i++) {
  if (hLines[i].includes("isActive") || hLines[i].includes("active")) {
    console.log("Active link " + (i+1) + ": " + hLines[i].trimEnd());
  }
}

// =====================================================
// 4) LandingMatches - gold accent on tab bar headers
// =====================================================
let lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
// Add gold line under competition headers
if (!lm.includes("d0a650")) {
  // Find Superliga header
  lm = lm.replace(
    /bg-gradient-to-r from-\[#2a499a\] to-\[#1E6FF2\]/g,
    'bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] border-l-[3px] border-[#d0a650]'
  );
}
fs.writeFileSync("src/components/LandingMatches.tsx", lm, "utf8");
console.log("[OK] LandingMatches - gold accent on match headers");

// =====================================================
// 5) LeagueTablesSection - gold accent
// =====================================================
let lt = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");
if (!lt.includes("d0a650")) {
  lt = lt.replace(
    /bg-gradient-to-r from-\[#2a499a\]/g,
    'bg-gradient-to-r from-[#2a499a] border-l-[3px] border-[#d0a650]'
  );
}
fs.writeFileSync("src/components/LeagueTablesSection.tsx", lt, "utf8");
console.log("[OK] LeagueTablesSection - gold accent");

console.log("\n[DONE] All gold accents added!");
console.log("Header: gold bottom border");
console.log("Footer: gold top border");
console.log("Match headers: gold left border");
console.log("League tables: gold left border");
