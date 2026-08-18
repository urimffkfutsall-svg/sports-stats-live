const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");

// Show toSnake, toCamel, dbInsert, dbUpdate functions
console.log("=== First 100 lines ===");
lines.slice(0, 100).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
