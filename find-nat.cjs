const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("dbNationalPlayers") || lines[i].includes("dbNationalMatches") || lines[i].includes("dbNationalStaff")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
console.log("\nTotal lines: " + lines.length);
