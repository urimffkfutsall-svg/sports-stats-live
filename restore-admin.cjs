const fs = require("fs");

// Try to restore from most recent backup
const backups = fs.readdirSync("src/pages/admin").filter(f => f.startsWith("AdminMatches.tsx.bak"));
console.log("Backups:", backups);

// Use the latest backup
if (backups.length > 0) {
  const latest = backups.sort().reverse()[0];
  console.log("Restoring from: " + latest);
  fs.copyFileSync("src/pages/admin/" + latest, "src/pages/admin/AdminMatches.tsx");
  console.log("[OK] Restored");
}

// Now read the clean file
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Show key positions
const formIdx = s.indexOf("const [form,");
const filteredIdx = s.indexOf("const filteredMatches");
const weeksIdx = s.indexOf("const weeks =");
console.log("\nClean file positions:");
console.log("  form at: " + formIdx);
console.log("  filteredMatches at: " + filteredIdx);
console.log("  weeks at: " + weeksIdx);
console.log("  total lines: " + s.split("\n").length);
