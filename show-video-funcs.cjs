const fs = require("fs");
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");
const lines = ctx.split("\n");

// Show addVideo and updateVideo functions (lines 665-680)
console.log("=== addVideo/updateVideo (lines 663-680) ===");
lines.slice(662, 680).forEach((l, i) => console.log((i+663) + ": " + l.trimEnd()));

// Also check getAll return mapping
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const dbLines = db.split("\n");
console.log("\n=== dbVideos.getAll (lines 425-435) ===");
dbLines.slice(424, 435).forEach((l, i) => console.log((i+425) + ": " + l.trimEnd()));
