const fs = require("fs");

// 1) Check DataContext addVideo/updateVideo
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");
const lines = ctx.split("\n");
console.log("=== DataContext - addVideo/updateVideo ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("addVideo") || lines[i].includes("updateVideo") || lines[i].includes("deleteVideo") || lines[i].includes("dbVideos")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// 2) Check supabase-db mapVideoToRow and mapVideoFromRow
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const dbLines = db.split("\n");
console.log("\n=== supabase-db - video mapping ===");
for (let i = 0; i < dbLines.length; i++) {
  if (dbLines[i].includes("mapVideo") || dbLines[i].includes("is_featured") || dbLines[i].includes("isFeatured") || dbLines[i].includes("dbVideos")) {
    console.log((i+1) + ": " + dbLines[i].trimEnd());
  }
}
