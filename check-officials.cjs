const fs = require("fs");

// 1) Check Match type for officials fields
let types = fs.readFileSync("src/types/index.ts", "utf8");
const tLines = types.split("\n");
console.log("=== Match type ===");
let inMatch = false;
for (let i = 0; i < tLines.length; i++) {
  if (tLines[i].includes("interface Match") || tLines[i].includes("type Match")) inMatch = true;
  if (inMatch) {
    console.log((i+1) + ": " + tLines[i].trimEnd());
    if (tLines[i].trim() === '}') { inMatch = false; break; }
  }
}

// 2) Check supabase-db.ts for match field mapping (toSnake/toCamel)
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const dbLines = db.split("\n");
console.log("\n=== supabase-db camelToSnake mapping ===");
for (let i = 0; i < 80; i++) {
  if (dbLines[i]?.includes("referee") || dbLines[i]?.includes("official") || dbLines[i]?.includes("delegate") || dbLines[i]?.includes("commissioner") || dbLines[i]?.includes("zyrtare")) {
    console.log((i+1) + ": " + dbLines[i].trimEnd());
  }
}

// 3) Check AdminMatches for officials form fields
let admin = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
const aLines = admin.split("\n");
console.log("\n=== AdminMatches - officials fields ===");
for (let i = 0; i < aLines.length; i++) {
  if (aLines[i].includes("referee") || aLines[i].includes("official") || aLines[i].includes("delegate") || aLines[i].includes("commissioner") || aLines[i].includes("zyrtare") || aLines[i].includes("Gjyqtar") || aLines[i].includes("gjyqtar")) {
    console.log((i+1) + ": " + aLines[i].trimEnd());
  }
}
