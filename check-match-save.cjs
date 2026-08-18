const fs = require("fs");

// Check Match type fields vs what's in the snake_case map
// referee1, referee2, referee3, delegate - these are same in both cases
// BUT possession_home etc in Match type are already snake_case!
// Look at Match type: possession_home?, shots_home? etc - these are ALREADY snake_case in the type!
// So toSnake tries to map them but they're already snake_case

// The real issue: check if Match properties match what Supabase table has
// Let's check what fields are sent when saving a match

let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");
const lines = ctx.split("\n");

console.log("=== Match add/update in DataContext ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("addMatch") || lines[i].includes("updateMatch")) {
    for (let j = i; j < i + 10; j++) {
      console.log((j+1) + ": " + lines[j]?.trimEnd());
    }
    console.log("---");
  }
}

// Check the AdminMatches handleSubmit to see what fields are sent
let admin = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
const aLines = admin.split("\n");
console.log("\n=== AdminMatches handleSubmit (lines 80-130) ===");
aLines.slice(79, 135).forEach((l, i) => console.log((i+80) + ": " + l.trimEnd()));
