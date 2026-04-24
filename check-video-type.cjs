const fs = require("fs");

// =====================================================
// Check types/index.ts for Video type
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
const videoLines = [];
let inVideo = false;
types.split("\n").forEach((l, i) => {
  if (l.includes("Video") && (l.includes("interface") || l.includes("type"))) inVideo = true;
  if (inVideo) {
    videoLines.push((i+1) + ": " + l.trimEnd());
    if (l.includes("}") && !l.includes("{")) inVideo = false;
  }
});
console.log("=== Video type ===");
console.log(videoLines.join("\n"));

// Check supabase-db.ts for dbVideos
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const dbLines = db.split("\n");
console.log("\n=== dbVideos in supabase-db ===");
for (let i = 0; i < dbLines.length; i++) {
  if (dbLines[i].includes("dbVideos") || dbLines[i].includes("videos")) {
    console.log((i+1) + ": " + dbLines[i].trimEnd());
  }
}

// Check AdminPage tabs
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const aLines = admin.split("\n");
console.log("\n=== AdminPage tabs ===");
for (let i = 0; i < aLines.length; i++) {
  if (aLines[i].includes("key:") && aLines[i].includes("label:")) {
    console.log((i+1) + ": " + aLines[i].trimEnd());
  }
}
