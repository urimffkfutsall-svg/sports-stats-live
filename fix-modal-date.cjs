const fs = require("fs");
const file = "src/components/MatchDetailModal.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);
let fixes = 0;

// 1. Add formatDate helper after imports
if (!s.includes("formatDate")) {
  s = s.replace(
    "interface Props {",
    [
      "function formatDate(iso?: string): string {",
      '  if (!iso) return "";',
      '  const p = iso.split("-");',
      "  if (p.length !== 3) return iso;",
      "  return `${Number(p[2])}/${Number(p[1])}/${p[0]}`;",
      "}",
      "",
      "interface Props {"
    ].join("\n")
  );
  console.log("[OK] formatDate helper shtuar");
  fixes++;
}

// 2. Replace {match.date} with {formatDate(match.date)}
if (s.includes("{match.date}") && !s.includes("formatDate(match.date)")) {
  s = s.replace("{match.date}", "{formatDate(match.date)}");
  console.log("[OK] data -> d/m/yyyy");
  fixes++;
}

if (fixes > 0) {
  fs.writeFileSync(file, s, "utf8");
  console.log("\nDone. " + fixes + " ndryshime.");
} else {
  console.log("\nAsnje ndryshim.");
}
