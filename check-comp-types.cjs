const fs = require("fs");

// Check competition types in the database setup
let supaDb = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = supaDb.split("\n");

// Find CompetitionType or competition related code
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("competition") && (lines[i].includes("type") || lines[i].includes("kupa"))) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Check types
let types = fs.readFileSync("src/types/index.ts", "utf8");
const ctMatch = types.match(/type CompetitionType\s*=\s*[^;]+;/);
if (ctMatch) console.log("\n" + ctMatch[0]);

// Check if there's a competition creation for kupa in admin
let adminFiles = fs.readdirSync("src/pages/admin");
let newSeason = "";
try { newSeason = fs.readFileSync("src/pages/admin/AdminNewSeasonWizard.tsx", "utf8"); } catch {}
if (newSeason.includes("kupa")) {
  console.log("\nAdminNewSeasonWizard has kupa: true");
} else {
  console.log("\nAdminNewSeasonWizard has kupa: false");
}

// Check AdminSettings for competition creation
let settings = "";
try { settings = fs.readFileSync("src/pages/admin/AdminSettings.tsx", "utf8"); } catch {}
if (settings.includes("kupa")) {
  console.log("AdminSettings has kupa: true");
} else {
  console.log("AdminSettings has kupa: false");
}

// Show competition type definition
const compIdx = types.indexOf("export interface Competition");
if (compIdx > -1) {
  const compEnd = types.indexOf("}", compIdx) + 1;
  console.log("\n" + types.substring(compIdx, compEnd));
}
