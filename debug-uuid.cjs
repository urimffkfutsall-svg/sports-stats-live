const fs = require("fs");

// Check if uuid is in package.json
let pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
console.log("uuid in dependencies: " + !!pkg.dependencies?.uuid);
console.log("uuid in devDependencies: " + !!pkg.devDependencies?.uuid);

// Check AdminNationalTeam imports
let ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");
console.log("\nHas uuid import: " + ant.includes("import { v4 as uuidv4 }"));

// Check how other files generate IDs
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (db.includes("crypto.randomUUID")) console.log("Uses crypto.randomUUID");
if (db.includes("uuidv4")) console.log("Uses uuidv4");

// Check how DataContext or other admin pages generate IDs
const adminFiles = ["AdminMatches.tsx", "AdminTeams.tsx", "AdminPlayers.tsx"];
adminFiles.forEach(f => {
  try {
    const c = fs.readFileSync("src/pages/admin/" + f, "utf8");
    const lines = c.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("uuid") || lines[i].includes("randomUUID") || lines[i].includes("crypto") || lines[i].includes("id:")) {
        if (lines[i].includes("import") || lines[i].includes("id: ")) {
          console.log(f + " L" + (i+1) + ": " + lines[i].trimEnd());
        }
      }
    }
  } catch {}
});
