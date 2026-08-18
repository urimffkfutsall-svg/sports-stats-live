const fs = require("fs");

// Check if dbNews uses mappers or generic toCamel
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");

console.log("=== dbNews ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("dbNews")) {
    for (let j = i; j < i + 15 && j < lines.length; j++) {
      console.log((j+1) + ": " + lines[j]?.trimEnd());
    }
    break;
  }
}

// Check fetchAllData for news
console.log("\n=== fetchAllData - news ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("news") && (lines[i].includes("from(") || lines[i].includes("Res") || lines[i].includes("map"))) {
    console.log((i+1) + ": " + lines[i]?.trimEnd());
  }
}

// Check toCamel for video_url
console.log("\n=== toCamel has video_url: " + db.includes("video_url: 'videoUrl'"));

// Also check: did the SQL get executed?
console.log("SQL needed: ALTER TABLE news ADD COLUMN IF NOT EXISTS video_url TEXT;");
