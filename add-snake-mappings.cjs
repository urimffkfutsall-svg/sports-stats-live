const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Add missing mappings to toSnake
db = db.replace(
  "matchId: 'match_id',",
  "matchId: 'match_id',\n    groupId: 'group_id',\n    teamName: 'team_name',\n    teamLogo: 'team_logo',\n    isKosova: 'is_kosova',\n    opponentLogo: 'opponent_logo',"
);

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
console.log("[OK] Added groupId, teamName, teamLogo, isKosova to toSnake");

// Also add to toCamel (reverse mapping)
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("function toCamel") || lines[i].includes("const toCamel")) {
    console.log("\ntoCamel at line " + (i+1) + ":");
    for (let j = i; j < Math.min(i + 20, lines.length); j++) {
      console.log((j+1) + ": " + lines[j].trimEnd());
    }
    break;
  }
}
