const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Add a debug display to show comp and matches count
kupa = kupa.replace(
  '<p className="text-gray-400 text-sm mt-1">Sezoni {activeSeason?.name || \'\'}</p>',
  `<p className="text-gray-400 text-sm mt-1">Sezoni {activeSeason?.name || ''}</p>
          <p className="text-[10px] text-gray-300 mt-0.5">Debug: Comp={comp?.id ? 'found' : 'NOT FOUND'} | Type={comp?.type} | Matches={cupMatches.length} | AllComps={competitions.filter(c => c.type === 'kupa').length} | SeasonComps={competitions.filter(c => activeSeason ? c.seasonId === activeSeason.id : true).map(c => c.type).join(',')}</p>`
);

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] Debug info added to KupaPage - check localhost:8080/kupa");
