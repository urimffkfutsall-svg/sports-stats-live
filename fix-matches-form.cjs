const fs = require("fs");
const file = "src/pages/admin/AdminMatches.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);

// --- 1. Shto helper functions per konvertimin e dates ---
if (!s.includes("toDisplayDate")) {
  s = s.replace(
    "const AdminMatches: React.FC = () => {",
    [
      "// Konvertim datash: DB = yyyy-mm-dd, UI = dd/mm/yyyy",
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
  console.log("[OK] helper functions toDisplayDate / toIsoDate");
}

// --- 2. Data input: type="date" -> type="text" placeholder="dd/mm/yyyy" ---
if (s.includes('type="date" value={form.date}')) {
  s = s.replace(
    'type="date" value={form.date}',
    'type="text" placeholder="dd/mm/yyyy" value={form.date}'
  );
  console.log("[OK] date input -> text dd/mm/yyyy");
}

// --- 3. handleSubmit: konverto dd/mm/yyyy -> yyyy-mm-dd per DB ---
if (!s.includes("toIsoDate(form.date)")) {
  s = s.replace(
    "date: form.date || undefined,",
    "date: form.date ? toIsoDate(form.date) : undefined,"
  );
  console.log("[OK] handleSubmit: toIsoDate");
}

// --- 4. handleEdit: konverto yyyy-mm-dd -> dd/mm/yyyy per UI ---
if (!s.includes("toDisplayDate(m.date)")) {
  s = s.replace(
    "date: m.date || '',",
    "date: m.date ? toDisplayDate(m.date) : '',"
  );
  console.log("[OK] handleEdit: toDisplayDate");
}

// --- 5. Fsheh rezultatin kur status = "planned" ---
if (!s.includes('form.status !== "planned"') && !s.includes("form.status !== 'planned'")) {
  const lines = s.split("\n");

  function wrapScoreDiv(lines, labelAnchor) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(labelAnchor) && lines[i].includes("label")) {
        let start = i - 1;
        while (start >= 0 && !lines[start].trim().startsWith("<div>")) start--;
        let end = i + 1;
        while (end < lines.length && !lines[end].trim().startsWith("</div>")) end++;
        if (start >= 0 && end < lines.length) {
          const indent = lines[start].match(/^(\s*)/)[1];
          lines[start] = indent + '{form.status !== "planned" && (' + lines[start].trimStart();
          lines[end] = lines[end] + ")}";
          console.log("[OK] fshehur " + labelAnchor + " kur planned");
          return true;
        }
      }
    }
    console.log("[!] nuk u gjet: " + labelAnchor);
    return false;
  }

  wrapScoreDiv(lines, "Rezultati Sht");
  wrapScoreDiv(lines, "Rezultati Jasht");
  s = lines.join("\n");
}

fs.writeFileSync(file, s, "utf8");
console.log("\nDone.");
