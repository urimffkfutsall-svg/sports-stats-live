const fs = require("fs");
const file = "src/pages/admin/AdminMatches.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);
let fixes = 0;

// 1. Data: kthe type="date" (me calendar picker)
if (s.includes('type="text" placeholder="dd/mm/yyyy"')) {
  s = s.replace('type="text" placeholder="dd/mm/yyyy" value={form.date}', 'type="date" value={form.date}');
  console.log("[OK] data -> type=date (calendar picker)");
  fixes++;
}

// 2. Hiq konvertimin toIsoDate ne handleSubmit (type="date" ruan yyyy-mm-dd direkt)
if (s.includes("toIsoDate(form.date)")) {
  s = s.replace("date: form.date ? toIsoDate(form.date) : undefined,", "date: form.date || undefined,");
  console.log("[OK] handleSubmit: hequr toIsoDate");
  fixes++;
}

// 3. Hiq konvertimin toDisplayDate ne handleEdit
if (s.includes("toDisplayDate(m.date)")) {
  s = s.replace("date: m.date ? toDisplayDate(m.date) : '',", "date: m.date || '',");
  console.log("[OK] handleEdit: hequr toDisplayDate");
  fixes++;
}

// 4. Ora: type="time" -> type="text" placeholder="HH:mm" (24h, pa AM/PM)
if (s.includes('type="time" value={form.time}')) {
  s = s.replace('type="time" value={form.time}', 'type="text" placeholder="HH:mm" value={form.time}');
  console.log("[OK] ora -> type=text HH:mm (24h)");
  fixes++;
}

if (fixes > 0) {
  fs.writeFileSync(file, s, "utf8");
  console.log("\nDone. " + fixes + " ndryshime.");
} else {
  console.log("\nAsnje ndryshim i nevojshem.");
}
