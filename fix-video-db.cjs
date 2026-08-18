const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// FIX 1: upsert - remove double conversion (toSnake then mapVideoToRow)
// mapVideoToRow already does the conversion, so don't use toSnake first
db = db.replace(
  "async upsert(item: any) {\n    const row = toSnake(item);\n    const { data, error } = await supabase.from('videos').upsert(mapVideoToRow(row)).select().single();",
  "async upsert(item: any) {\n    const row = mapVideoToRow(item);\n    const { data, error } = await supabase.from('videos').upsert(row).select().single();"
);

// FIX 2: getAll - use mapVideoFromRow instead of toCamel (toCamel doesn't know about new fields)
db = db.replace(
  "return (data || []).map(toCamel) as any[];",
  "return (data || []).map(mapVideoFromRow) as any[];"
);

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");

// Verify
const final = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const dbLines = final.split("\n");
console.log("=== Fixed dbVideos ===");
for (let i = 424; i < 440; i++) {
  console.log((i+1) + ": " + dbLines[i]?.trimEnd());
}
console.log("\n[OK] Fixed:");
console.log("  1. upsert: uses mapVideoToRow directly (no double conversion)");
console.log("  2. getAll: uses mapVideoFromRow (reads isFeaturedSuperliga/LigaPare correctly)");
