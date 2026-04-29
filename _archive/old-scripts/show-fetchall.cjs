const fs = require("fs");
let s = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = s.split("\n");

// Find fetchAllData function
let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("fetchAllData") && (lines[i].includes("export") || lines[i].includes("async"))) {
    start = i;
  }
  if (start > -1 && end === -1 && i > start + 5 && lines[i].match(/^};?\s*$/)) {
    end = i;
    break;
  }
}

if (start > -1) {
  console.log("=== fetchAllData (lines " + (start+1) + "-" + (end+1) + ") ===");
  lines.slice(start, end + 1).forEach((l, i) => console.log((start+i+1) + ": " + l));
}
