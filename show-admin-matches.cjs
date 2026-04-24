const fs = require("fs");
let admin = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");
const lines = admin.split("\n");
console.log("AdminMatches.tsx - " + lines.length + " lines");

// Show lines related to week/java selection and cup
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].toLowerCase();
  if (l.includes("week") || l.includes("java") || l.includes("kupa") || l.includes("cup") || l.includes("round")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Show the week input field area
console.log("\n=== Looking for week input ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("week") && (lines[i].includes("input") || lines[i].includes("select") || lines[i].includes("onChange") || lines[i].includes("value"))) {
    const start = Math.max(0, i - 3);
    const end = Math.min(lines.length, i + 5);
    for (let j = start; j < end; j++) {
      console.log((j+1) + ": " + lines[j]);
    }
    console.log("---");
  }
}
