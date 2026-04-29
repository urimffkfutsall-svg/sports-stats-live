const fs = require("fs");

// 1) Fix LeagueTablesSection
let league = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");
// Replace max-w-7xl with w-full
league = league.replace(/max-w-7xl mx-auto/g, 'w-full');
// Fix padding if needed
league = league.replace(/px-4 py-/g, 'px-3 sm:px-4 md:px-6 lg:px-8 py-');
fs.writeFileSync("src/components/LeagueTablesSection.tsx", league, "utf8");
console.log("[OK] LeagueTablesSection — full width");

// 2) Fix Video section
let videoFiles = ['src/components/LandingVideos.tsx', 'src/components/VideoSection.tsx', 'src/components/Videos.tsx'];
videoFiles.forEach(f => {
  try {
    let content = fs.readFileSync(f, "utf8");
    if (content.includes("max-w-7xl") || content.includes("max-w-6xl") || content.includes("max-w-5xl") || content.includes("max-w-4xl")) {
      content = content.replace(/max-w-7xl mx-auto/g, 'w-full');
      content = content.replace(/max-w-6xl mx-auto/g, 'w-full');
      content = content.replace(/max-w-5xl mx-auto/g, 'w-full');
      content = content.replace(/max-w-4xl mx-auto/g, 'w-full');
      // Fix padding
      if (content.includes('px-4') && !content.includes('sm:px-4')) {
        content = content.replace(/className="([^"]*?)px-4([^"]*?)"/g, function(match, before, after) {
          if (before.includes('px-3') || after.includes('sm:px-4')) return match;
          return 'className="' + before + 'px-3 sm:px-4 md:px-6 lg:px-8' + after + '"';
        });
      }
      fs.writeFileSync(f, content, "utf8");
      console.log("[OK] " + f + " — full width");
    } else {
      console.log("[SKIP] " + f + " — no max-w found");
    }
  } catch(e) {
    console.log("[NOT FOUND] " + f);
  }
});

// 3) Check all landing components for max-w constraints
let srcComponents = fs.readdirSync("src/components");
srcComponents.forEach(f => {
  if (!f.endsWith('.tsx')) return;
  try {
    let content = fs.readFileSync("src/components/" + f, "utf8");
    if (content.includes("max-w-7xl mx-auto") && f.includes("Landing")) {
      content = content.replace(/max-w-7xl mx-auto/g, 'w-full');
      fs.writeFileSync("src/components/" + f, content, "utf8");
      console.log("[OK] src/components/" + f + " — fixed max-w");
    }
  } catch {}
});

// 4) Check pages for wrapper max-w
let srcPages = fs.readdirSync("src/pages");
srcPages.forEach(f => {
  if (!f.endsWith('.tsx')) return;
  try {
    let content = fs.readFileSync("src/pages/" + f, "utf8");
    if (f.toLowerCase().includes("landing") || f.toLowerCase().includes("home")) {
      if (content.includes("max-w-7xl mx-auto")) {
        content = content.replace(/max-w-7xl mx-auto/g, 'w-full');
        fs.writeFileSync("src/pages/" + f, content, "utf8");
        console.log("[OK] src/pages/" + f + " — fixed max-w");
      }
    }
  } catch {}
});

console.log("\n[DONE] All landing sections now full width");
