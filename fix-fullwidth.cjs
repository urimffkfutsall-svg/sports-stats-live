const fs = require("fs");

// 1) Fix LandingNews slideshow - full width
let news = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
news = news.replace(
  'className="px-4 pt-6 pb-4 bg-[#F1F5F9]"',
  'className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-4 bg-[#F1F5F9]"'
);
news = news.replace(
  '<div className="max-w-7xl mx-auto">',
  '<div className="w-full">'
);
fs.writeFileSync("src/components/LandingNews.tsx", news, "utf8");
console.log("[OK] LandingNews — full width slideshow");

// 2) Fix LandingMatches - full width
let matches = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
matches = matches.replace(
  '<div className="max-w-7xl mx-auto">',
  '<div className="w-full">'
);
matches = matches.replace(
  'className="py-10 px-4 bg-[#F1F5F9]"',
  'className="py-10 px-3 sm:px-4 md:px-6 lg:px-8 bg-[#F1F5F9]"'
);
fs.writeFileSync("src/components/LandingMatches.tsx", matches, "utf8");
console.log("[OK] LandingMatches — full width");

// 3) Also check if there's a landing page wrapper with max-w
let files = ['src/pages/Landing.tsx', 'src/pages/LandingPage.tsx', 'src/pages/HomePage.tsx'];
files.forEach(f => {
  try {
    let content = fs.readFileSync(f, "utf8");
    if (content.includes("max-w-7xl") || content.includes("max-w-6xl")) {
      content = content.replace(/max-w-7xl/g, 'w-full');
      content = content.replace(/max-w-6xl/g, 'w-full');
      fs.writeFileSync(f, content, "utf8");
      console.log("[OK] " + f + " — removed max-width constraint");
    }
  } catch {}
});

// 4) Check LeagueTablesSection for the main layout wrapper
try {
  let league = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");
  // Find the main section wrapper
  const lines = league.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("max-w-7xl") && i < 20) {
      console.log("LeagueTablesSection line " + (i+1) + ": " + lines[i].trimEnd());
    }
  }
} catch {}
