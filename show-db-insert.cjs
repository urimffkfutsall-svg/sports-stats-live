const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Show dbInsert and dbUpdate functions
const lines = db.split("\n");
console.log("=== dbInsert / dbUpdate ===");
for (let i = 100; i < 220; i++) {
  if (lines[i]?.includes("dbInsert") || lines[i]?.includes("dbUpdate") || lines[i]?.includes("dbDelete") || lines[i]?.includes("async function") || lines[i]?.includes("toSnake")) {
    for (let j = i; j < i + 10; j++) {
      console.log((j+1) + ": " + lines[j]?.trimEnd());
    }
    console.log("---");
    break;
  }
}

// Find generic insert/update
for (let i = 0; i < lines.length; i++) {
  if ((lines[i].includes("function dbInsert") || lines[i].includes("const dbInsert") || lines[i].includes("async function dbInsert"))) {
    for (let j = i; j < i + 12; j++) console.log((j+1) + ": " + lines[j]?.trimEnd());
    console.log("---");
  }
  if ((lines[i].includes("function dbUpdate") || lines[i].includes("const dbUpdate") || lines[i].includes("async function dbUpdate"))) {
    for (let j = i; j < i + 12; j++) console.log((j+1) + ": " + lines[j]?.trimEnd());
    console.log("---");
  }
}
