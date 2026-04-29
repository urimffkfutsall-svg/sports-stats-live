const fs = require("fs");
const file = "src/components/LandingMatches.tsx";
let s = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + ".bak-" + ts);

// Replace getCompMatches to only show isFeaturedLanding matches
const oldFn = `const getCompMatches = (compId: string | undefined, status: string) => {
    if (!compId) return [];
    const filtered = seasonMatches.filter(m => m.competitionId === compId);
    if (status === 'finished') {
      const featured = filtered.filter(m => m.status === 'finished' && m.isFeaturedLanding);
      if (featured.length > 0) return featured.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      return filtered.filter(m => m.status === 'finished').sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4);
    }
    if (status === 'planned') return filtered.filter(m => m.status === 'planned').sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 4);
    if (status === 'live') return filtered.filter(m => m.status === 'live').slice(0, 4);
    return [];
  };`;

const newFn = `const getCompMatches = (compId: string | undefined, status: string) => {
    if (!compId) return [];
    // Vetem ndeshjet e selektuara nga admini (isFeaturedLanding)
    const filtered = seasonMatches.filter(m => m.competitionId === compId && m.isFeaturedLanding);
    if (status === 'finished') return filtered.filter(m => m.status === 'finished').sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (status === 'planned') return filtered.filter(m => m.status === 'planned').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (status === 'live') return filtered.filter(m => m.status === 'live');
    return [];
  };`;

if (s.includes(oldFn)) {
  s = s.replace(oldFn, newFn);
  fs.writeFileSync(file, s, "utf8");
  console.log("[OK] Tani vetem ndeshjet me 'Shfaq ne Landing Page' shfaqen ne Ballina");
} else {
  console.log("[!] Nuk u gjet funksioni getCompMatches - kontrolloje manualisht");
}
