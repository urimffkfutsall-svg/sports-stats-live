const fs = require("fs");

// Check if dbNationalPlayers is also imported/used in DataContext
let dc = fs.readFileSync("src/context/DataContext.tsx", "utf8");
console.log("DataContext has dbNationalPlayers: " + dc.includes("dbNationalPlayers"));

// Check supabase-db end
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
console.log("\nLast 20 lines of supabase-db:");
lines.slice(-20).forEach((l, i) => console.log((lines.length - 20 + i + 1) + ": " + l.trimEnd()));

// Also check if there's duplicate export
const exports = db.match(/export const dbNational/g);
console.log("\nexport const dbNational count: " + (exports || []).length);
