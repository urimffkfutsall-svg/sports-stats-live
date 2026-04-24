const fs = require("fs");

// 1) LandingMatches.tsx — remove "Ndeshjet" title and subtitle
let lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
// Remove the title block: <div className="text-center mb-8">...<h2>Ndeshjet</h2>...<p>Superliga...</p>...</div>
lm = lm.replace(/<div className="text-center mb-8">[\s\S]*?<\/div>\s*\n/m, "");
fs.writeFileSync("src/components/LandingMatches.tsx", lm, "utf8");
console.log("[OK] LandingMatches.tsx — larguar 'Ndeshjet' dhe 'Superliga e Kosoves dhe Liga e Pare'");

// 2) AppLayout.tsx — remove InstallAppBanner
let al = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
// Remove import
al = al.replace(/import InstallAppBanner.*?\n/g, "");
// Remove usage
al = al.replace(/<InstallAppBanner\s*\/?\s*>/g, "");
al = al.replace(/<InstallAppBanner[^>]*\/>/g, "");
fs.writeFileSync("src/components/AppLayout.tsx", al, "utf8");
console.log("[OK] AppLayout.tsx — larguar InstallAppBanner");

console.log("\nDone!");
