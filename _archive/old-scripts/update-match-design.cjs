const fs = require("fs");

// ========== 1) CompetitionPage.tsx — use MatchCard instead of MatchRow ==========
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// Add MatchCard import after MatchDetailModal import
if (!comp.includes("import MatchCard")) {
  comp = comp.replace(
    "import MatchDetailModal from '@/components/MatchDetailModal';",
    "import MatchDetailModal from '@/components/MatchDetailModal';\nimport MatchCard from '@/components/MatchCard';"
  );
}

// Remove the entire MatchRow component (from "const MatchRow:" to the end of its return's closing "};")
comp = comp.replace(
  /const MatchRow: React\.FC<\{ match: Match \}> = \(\{ match \}\) => \{[\s\S]*?\n  \};\n/,
  ""
);

// Replace MatchSection to use MatchCard instead of MatchRow
comp = comp.replace(
  /\{matchList\.map\(m => <div key=\{m\.id\}[^>]*><MatchRow match=\{m\} \/><\/div>\)\}/g,
  "{matchList.map(m => <div key={m.id} className={ring ? 'ring-2 ring-red-300 rounded-2xl' : ''}><MatchCard match={m} onClick={() => setSelectedMatch(m)} /></div>)}"
);

// Also fix if there's a different pattern
comp = comp.replace(
  /<MatchRow match=\{m\} \/>/g,
  "<MatchCard match={m} onClick={() => setSelectedMatch(m)} />"
);

// Update MatchSection props — remove ring from div wrapper since we handle it in section
comp = comp.replace(
  /const MatchSection: React\.FC<\{ title: string; matchList: Match\[\]; dot: string; ring\?: boolean \}> = \(\{ title: t, matchList, dot, ring \}\)/,
  "const MatchSection: React.FC<{ title: string; matchList: Match[]; dot: string; ring?: boolean }> = ({ title: t, matchList, dot, ring })"
);

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage.tsx — MatchCard imported, MatchRow replaced");

// ========== 2) KupaPage.tsx — use MatchCard instead of BracketMatch ==========
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Add MatchCard import
if (!kupa.includes("import MatchCard")) {
  kupa = kupa.replace(
    "import MatchDetailModal from '@/components/MatchDetailModal';",
    "import MatchDetailModal from '@/components/MatchDetailModal';\nimport MatchCard from '@/components/MatchCard';"
  );
}

// Remove the entire BracketMatch component
kupa = kupa.replace(
  /const BracketMatch: React\.FC<\{ match: Match \}> = \(\{ match \}\) => \{[\s\S]*?\n  \};\n/,
  ""
);

// Replace <BracketMatch> usage with <MatchCard>
kupa = kupa.replace(
  /<BracketMatch key=\{m\.id\} match=\{m\} \/>/g,
  "<MatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />"
);

kupa = kupa.replace(
  /<BracketMatch match=\{m\} \/>/g,
  "<MatchCard match={m} onClick={() => setSelectedMatch(m)} />"
);

// Update the bracket grid layout for better card display
kupa = kupa.replace(
  '<div className="space-y-4">',
  '<div className="space-y-4">'
);

// Change min-w for bracket columns to be wider for the card design
kupa = kupa.replace(
  /min-w-\[280px\]/g,
  "min-w-[340px]"
);

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] KupaPage.tsx — MatchCard imported, BracketMatch replaced");

console.log("\nDone! Both pages now use the same MatchCard design as Ballina.");
