const fs = require("fs");
const path = require("path");

const files = [
  "src/components/Footer.tsx",
  "src/components/Header.tsx",
  "src/components/HeroSection.tsx",
  "src/components/InstallAppBanner.tsx",
  "src/components/LandingMatches.tsx",
  "src/components/LandingNews.tsx",
  "src/components/LandingVideos.tsx",
  "src/components/LeagueTablesSection.tsx",
  "src/components/MatchCard.tsx",
  "src/components/PlayerOfWeekSection.tsx",
  "src/components/TopScorersSection.tsx",
  "src/pages/admin/AdminTeamsPlayers.tsx",
  "src/pages/admin/EditorPanel.tsx",
  "src/pages/CompetitionPage.tsx",
  "src/pages/HeadToHeadPage.tsx",
  "src/pages/KomisioniPage.tsx",
  "src/pages/KupaPage.tsx",
  "src/pages/PlayerOfWeekPage.tsx",
  "src/pages/SkuadratPage.tsx",
  "src/pages/TeamProfilePage.tsx",
];

let totalChanged = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, "utf8");
    const before = content;
    // Replace #0A1E3C with #2a499a (case insensitive)
    content = content.replace(/0A1E3C/g, "2a499a");
    content = content.replace(/0a1e3c/g, "2a499a");
    if (content !== before) {
      fs.writeFileSync(file, content, "utf8");
      const count = (before.match(/0A1E3C/gi) || []).length;
      console.log("[OK] " + file + " (" + count + " replaced)");
      totalChanged += count;
    }
  } catch (e) {
    console.log("[SKIP] " + file + " - " + e.message);
  }
});

console.log("\nTotal replacements: " + totalChanged);

// Now also check for #1E6FF2 in key gradient spots and add gold accents
// Add gold accent to Header, Footer, and key borders
console.log("\n=== Adding gold #d0a650 accents ===");

// Header - add gold bottom border
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
const hLines = header.split("\n");
console.log("Header nav container:");
for (let i = 0; i < hLines.length; i++) {
  if (hLines[i].includes("bg-") && (hLines[i].includes("nav") || hLines[i].includes("header") || hLines[i].includes("sticky") || hLines[i].includes("fixed"))) {
    console.log((i+1) + ": " + hLines[i].trimEnd());
  }
}
