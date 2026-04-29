const fs = require("fs");

// =====================================================
// 1) Fix MatchCard.tsx — "Shiko te dhenat" encoding + X button
// =====================================================
let matchCard = fs.readFileSync("src/components/MatchCard.tsx", "utf8");
// Fix any broken unicode in MatchCard
matchCard = matchCard.replace(/Shiko te dhenat/g, 'Shiko detajet');
fs.writeFileSync("src/components/MatchCard.tsx", matchCard, "utf8");
console.log("[OK] MatchCard.tsx fixed");

// =====================================================
// 2) Fix MatchDetailModal.tsx — X button + text
// =====================================================
let modal = fs.readFileSync("src/components/MatchDetailModal.tsx", "utf8");

// Fix X button - replace any unicode X with HTML entity ×
modal = modal.replace(/\\u00D7/g, String.fromCharCode(215));
modal = modal.replace(/\\u2715/g, String.fromCharCode(215));
// Also replace literal text "×" button content if it's showing wrong
// Make sure close button uses a proper × symbol
modal = modal.replace(/>\s*×\s*<\/button>/g, '>' + String.fromCharCode(215) + '</button>');

// Fix "Shiko te dhenat" and other broken text
modal = modal.replace(/Shiko te dhenat/g, 'Shiko detajet');
modal = modal.replace(/te dhenat/g, 'detajet');

fs.writeFileSync("src/components/MatchDetailModal.tsx", modal, "utf8");
console.log("[OK] MatchDetailModal.tsx — X button + text fixed");

// =====================================================
// 3) Fix KupaPage.tsx — "Shiko te dhenat" text
// =====================================================
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");
kupa = kupa.replace(/Shiko te dhenat/g, 'Shiko detajet');
// Fix X in kupa
kupa = kupa.replace(/\\u00D7/g, String.fromCharCode(215));
fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] KupaPage.tsx — text fixed");

// =====================================================
// 4) Fix LandingMatches.tsx — Add week badge to match rows
// =====================================================
let landing = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Fix any broken text
landing = landing.replace(/Shiko te dhenat/g, 'Shiko detajet');

// Add Java X badge to the MatchRow component
// Find where date/venue is shown in the compact top bar and add week
if (!landing.includes("Java {match.week}") || !landing.includes('match.week}')) {
  // Find the top bar in MatchRow where date and venue show
  // Add week badge after the date
  landing = landing.replace(
    '{match.date && <span>{formatDate(match.date)}</span>}',
    '{match.date && <span>{formatDate(match.date)}</span>}{match.week && <span className="font-semibold text-[#1E6FF2]">Java {match.week}</span>}'
  );
}

fs.writeFileSync("src/components/LandingMatches.tsx", landing, "utf8");
console.log("[OK] LandingMatches.tsx — week badge added + text fixed");

// =====================================================
// 5) Fix CompetitionPage.tsx — Add week to match cards
// =====================================================
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
comp = comp.replace(/Shiko te dhenat/g, 'Shiko detajet');
fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage.tsx — text fixed");

// =====================================================
// 6) Fix LeagueTablesSection.tsx — broken text
// =====================================================
let league = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");
league = league.replace(/Shiko te dhenat/g, 'Shiko detajet');
league = league.replace(/\\u00D7/g, String.fromCharCode(215));
fs.writeFileSync("src/components/LeagueTablesSection.tsx", league, "utf8");
console.log("[OK] LeagueTablesSection.tsx — text fixed");

// =====================================================
// 7) Fix ALL files for broken characters
// =====================================================
const allFiles = [
  'src/components/MatchCard.tsx',
  'src/components/MatchDetailModal.tsx',
  'src/components/LandingMatches.tsx',
  'src/components/LandingNews.tsx',
  'src/components/LeagueTablesSection.tsx',
  'src/pages/KupaPage.tsx',
  'src/pages/CompetitionPage.tsx',
  'src/pages/NewsDetailPage.tsx',
];

allFiles.forEach(f => {
  try {
    let content = fs.readFileSync(f, "utf8");
    let changed = false;

    // Fix broken escape sequences that show as literal text
    if (content.includes('\\u203A')) {
      content = content.replace(/\\u203A/g, String.fromCharCode(8250)); // ›
      changed = true;
    }
    if (content.includes('\\u2190')) {
      content = content.replace(/\\u2190/g, String.fromCharCode(8592)); // ←
      changed = true;
    }
    if (content.includes('\\u00D7')) {
      content = content.replace(/\\u00D7/g, String.fromCharCode(215)); // ×
      changed = true;
    }
    if (content.includes('\\u2715')) {
      content = content.replace(/\\u2715/g, String.fromCharCode(215)); // ×
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(f, content, "utf8");
      console.log("[OK] " + f + " — unicode escapes fixed");
    }
  } catch {}
});

console.log("\n[DONE] All fixes applied!");
