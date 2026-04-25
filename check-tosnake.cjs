const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
// Find toSnake function
const lines = db.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("toSnake") && !lines[i].includes("//")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Also check the camelToSnake mapping
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const camelToSnake") || lines[i].includes("function toSnake") || lines[i].includes("const toSnake")) {
    console.log("\ntoSnake definition at line " + (i+1) + ":");
    for (let j = i; j < Math.min(i + 20, lines.length); j++) {
      console.log((j+1) + ": " + lines[j].trimEnd());
    }
    break;
  }
}
