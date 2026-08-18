const fs = require("fs");

// Check the toSnake/toCamel mapping for matches
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");

// Show the camelToSnake and snakeToCamel maps
console.log("=== camelToSnake map ===");
let inMap = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("camelToSnake") && lines[i].includes("{")) inMap = true;
  if (inMap) {
    console.log((i+1) + ": " + lines[i].trimEnd());
    if (lines[i].includes("};")) { inMap = false; }
  }
}

// Show dbMatches upsert
console.log("\n=== dbMatches ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("dbMatches")) {
    // Show 15 lines from here
    for (let j = i; j < i + 20 && j < lines.length; j++) {
      console.log((j+1) + ": " + lines[j].trimEnd());
    }
    break;
  }
}

// Show the mapRealtimeRow function
console.log("\n=== mapRealtimeRow ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("mapRealtimeRow")) {
    for (let j = i; j < i + 30 && j < lines.length; j++) {
      console.log((j+1) + ": " + lines[j].trimEnd());
    }
    break;
  }
}
