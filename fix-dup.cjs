const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Check how many times dbNationalPlayers appears
const count = (db.match(/dbNationalPlayers/g) || []).length;
console.log("dbNationalPlayers count: " + count);

if (count > 2) {
  // Find and remove duplicate national team section
  const firstIdx = db.indexOf("// ============ NATIONAL TEAM ============");
  const secondIdx = db.indexOf("// ============ NATIONAL TEAM ============", firstIdx + 1);
  if (secondIdx > -1) {
    // Remove everything from second occurrence to end, then add back closing
    db = db.substring(0, secondIdx);
    fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
    console.log("[OK] Removed duplicate national team section");
  }
}

const finalCount = (fs.readFileSync("src/lib/supabase-db.ts", "utf8").match(/dbNationalPlayers/g) || []).length;
console.log("After fix count: " + finalCount);
