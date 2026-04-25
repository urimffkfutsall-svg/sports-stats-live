const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Find all positions of "export const dbNationalPlayers"
let pos = 0;
let positions = [];
while (true) {
  const idx = db.indexOf("export const dbNationalPlayers", pos);
  if (idx === -1) break;
  positions.push(idx);
  pos = idx + 1;
}
console.log("dbNationalPlayers positions: " + positions.length + " at chars: " + positions.join(", "));

// Keep only the first national team block
// Find first "// ============ NATIONAL TEAM" 
const firstNT = db.indexOf("// ============ NATIONAL TEAM ============");
console.log("First NATIONAL TEAM at char: " + firstNT);

// Find if there's content before it that also has dbNational
const beforeNT = db.substring(0, firstNT);
const hasDbNatBefore = beforeNT.includes("dbNationalPlayers");
console.log("Has dbNational before NATIONAL TEAM section: " + hasDbNatBefore);

if (hasDbNatBefore) {
  // The first occurrence is before the comment, remove the commented section
  db = db.substring(0, firstNT);
} else {
  // Find second NATIONAL TEAM section if exists
  const secondNT = db.indexOf("// ============ NATIONAL TEAM ============", firstNT + 1);
  if (secondNT > -1) {
    db = db.substring(0, secondNT);
  }
}

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
const finalDb = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const finalCount = (finalDb.match(/export const dbNational/g) || []).length;
console.log("After cleanup - export const dbNational count: " + finalCount);
