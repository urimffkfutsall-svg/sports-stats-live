const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Add to toCamel
db = db.replace(
  "match_id: 'matchId',",
  "match_id: 'matchId',\n    group_id: 'groupId',\n    team_name: 'teamName',\n    team_logo: 'teamLogo',\n    is_kosova: 'isKosova',\n    opponent_logo: 'opponentLogo',\n    home_team_id: 'homeTeamId',\n    away_team_id: 'awayTeamId',"
);

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");

// Verify
const final = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
console.log("toSnake has groupId: " + final.includes("groupId: 'group_id'"));
console.log("toCamel has group_id: " + final.includes("group_id: 'groupId'"));
console.log("toCamel has team_name: " + final.includes("team_name: 'teamName'"));
console.log("toCamel has is_kosova: " + final.includes("is_kosova: 'isKosova'"));
console.log("[OK] All mappings added");
