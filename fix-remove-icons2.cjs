const fs = require("fs");
const file = "src/components/LeagueTablesSection.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);

// Remove "const Icon = ..." line
s = s.replace(/\s*const Icon = c\.type[^;]*;/g, '');
console.log("[OK] hequr const Icon");

// Remove <Icon .../> element
s = s.replace(/<Icon[^/]*\/>\s*/g, '');
console.log("[OK] hequr <Icon /> nga butonat");

// Clean Shield from import if unused
if (!s.includes("<Shield")) {
  s = s.replace(/, Shield/g, '');
  console.log("[OK] hequr Shield nga import");
}

fs.writeFileSync(file, s, "utf8");
console.log("\nDone.");
