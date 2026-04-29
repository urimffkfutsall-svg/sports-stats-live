const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Fix broken comment dashes
s = s.replace('date + venue â€" compact', 'date + venue - compact');
s = s.replace('home â€" score â€" away', 'home - score - away');

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");

// Verify zero bad chars
const check = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const bad = (check.match(/â€/g) || []).length;
console.log("[OK] Fixed. Remaining bad chars: " + bad);

// Also check Java badge was added
console.log("Has Java badge: " + check.includes("Java {match.week}"));
