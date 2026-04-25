const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
console.log("=== Lines 391-507 ===");
lines.slice(390, 507).forEach((l, i) => console.log((i+391) + ": " + l.trimEnd()));
