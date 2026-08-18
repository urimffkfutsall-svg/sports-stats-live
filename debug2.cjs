const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
console.log("Last 20 lines:");
lines.slice(-20).forEach((l, i) => console.log((lines.length - 20 + i + 1) + ": " + l.trimEnd()));
const exps = db.match(/export const dbNational/g);
console.log("\nexport const dbNational count: " + (exps || []).length);
