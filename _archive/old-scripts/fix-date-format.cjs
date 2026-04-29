const fs = require("fs");
const file = "src/pages/admin/AdminMatches.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);
let fixes = 0;

// 1. Add date helpers if missing
if (!s.includes("toDisplayDate")) {
  s = s.replace(
    "const AdminMatches: React.FC = () => {",
    [
      "function toDisplayDate(iso: string): string {",
      '  if (!iso) return "";',
      '  const p = iso.split("-");',
      "  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : iso;",
      "}",
      "function toIsoDate(dd: string): string {",
      '  if (!dd) return "";',
      '  const p = dd.split("/");',
      "  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : dd;",
      "}",
      "",
      "const AdminMatches: React.FC = () => {"
    ].join("\n")
  );
  console.log("[OK] helper functions");
  fixes++;
}

// 2. Date input -> text dd/mm/yyyy
if (s.includes('type="date" value={form.date}')) {
  s = s.replace('type="date" value={form.date}', 'type="text" placeholder="dd/mm/yyyy" value={form.date}');
  console.log("[OK] input -> text dd/mm/yyyy");
  fixes++;
}

// 3. handleSubmit: convert dd/mm/yyyy -> yyyy-mm-dd
if (s.includes("date: form.date || undefined,") && !s.includes("toIsoDate(form.date)")) {
  s = s.replace("date: form.date || undefined,", "date: form.date ? toIsoDate(form.date) : undefined,");
  console.log("[OK] handleSubmit -> toIsoDate");
  fixes++;
}

// 4. handleEdit: convert yyyy-mm-dd -> dd/mm/yyyy
if (s.includes("date: m.date || '',") && !s.includes("toDisplayDate(m.date)")) {
  s = s.replace("date: m.date || '',", "date: m.date ? toDisplayDate(m.date) : '',");
  console.log("[OK] handleEdit -> toDisplayDate");
  fixes++;
}

if (fixes > 0) {
  fs.writeFileSync(file, s, "utf8");
  console.log("\nDone. " + fixes + " ndryshime.");
} else {
  console.log("\nAsnje ndryshim (ndoshta jane bere tashme).");
}
