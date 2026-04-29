const fs = require("fs");
let s = fs.readFileSync("src/components/MatchDetailModal.tsx", "utf8");

// Remove goals from sections array - change default tab to stats or officials
s = s.replace(
  "const [activeSection, setActiveSection] = useState<'goals' | 'stats' | 'officials'>('goals');",
  "const [activeSection, setActiveSection] = useState<'stats' | 'officials'>('stats');"
);

// Remove goals section from sections array
s = s.replace(
  "{ key: 'goals' as const, label: 'Golat', count: goals.length },",
  ""
);

// Remove the entire goals tab content
s = s.replace(
  /\{\/\* Goals \*\/\}\s*\{activeSection === 'goals'[\s\S]*?\)\s*\)}\s*\)/,
  ""
);

fs.writeFileSync("src/components/MatchDetailModal.tsx", s, "utf8");
console.log("[OK] Golat tab removed from MatchDetailModal");
