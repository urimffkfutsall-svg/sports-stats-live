const fs = require("fs");
const file = "src/components/LandingMatches.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);

const oldLine = `if (status === 'finished') return filtered.filter(m => m.status === 'finished').sort((a, b) => (b.date || '').localeCompare(a.date || ''));`;

const newLine = `if (status === 'finished') {
      const fin = filtered.filter(m => m.status === 'finished');
      if (fin.length === 0) return [];
      const maxWeek = Math.max(...fin.map(m => m.week || 0));
      return fin.filter(m => m.week === maxWeek).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }`;

if (s.includes(oldLine)) {
  s = s.replace(oldLine, newLine);
  fs.writeFileSync(file, s, "utf8");
  console.log("[OK] Te luajtura: vetem java e fundit me rezultate");
} else {
  console.log("[!] Nuk u gjet rreshti - kontrolloje manualisht");
}
