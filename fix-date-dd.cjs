const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Add helper functions after the component declaration
// Find "const AdminMatches" or the component function
s = s.replace(
  "const resetForm = () => {",
  `// Date format helpers: internal=YYYY-MM-DD, display=DD/MM/YYYY
  const toDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  };
  const toISO = (displayDate: string) => {
    if (!displayDate) return '';
    const parts = displayDate.split('/');
    if (parts.length !== 3) return displayDate;
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  };
  const handleDateInput = (val: string, setter: (v: string) => void) => {
    // Auto-add slashes
    let clean = val.replace(/[^0-9/]/g, '');
    if (clean.length === 2 && !clean.includes('/')) clean += '/';
    if (clean.length === 5 && clean.split('/').length === 2) clean += '/';
    if (clean.length > 10) clean = clean.substring(0, 10);
    setter(clean);
  };

  const resetForm = () => {`
);

// Replace main date input (line 270) - change from type="date" to type="text" with dd/mm/yyyy
s = s.replace(
  '<input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />',
  '<input type="text" placeholder="dd/mm/yyyy" value={toDisplay(form.date)} onChange={e => handleDateInput(e.target.value, (v) => setForm(p => ({ ...p, date: toISO(v) })))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />'
);

// Replace cup legs date inputs
s = s.replace(
  '<input type="date" value={data.date}',
  '<input type="text" placeholder="dd/mm/yyyy" value={toDisplay(data.date)}'
);

// Fix the onChange for cup legs date - replace the exact onChange
s = s.replace(
  "onChange={e => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], date: e.target.value } }))}",
  "onChange={e => handleDateInput(e.target.value, (v) => setCupLegs(prev => ({ ...prev, [leg.key]: { ...prev[leg.key as keyof typeof prev], date: toISO(v) } })))}"
);

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", s, "utf8");
console.log("[OK] Date inputs changed to dd/mm/yyyy format");
console.log("  - Main form date: text input with dd/mm/yyyy");
console.log("  - Cup legs dates: text input with dd/mm/yyyy");
console.log("  - Auto-adds slashes while typing");
console.log("  - Internal storage stays YYYY-MM-DD");
