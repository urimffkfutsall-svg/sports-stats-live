const fs = require("fs");
let f = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");

// Remove tabs: squad, staff, news - keep only matches and stats
// Remove from tabs array
f = f.replace(
  "{ key: 'squad', label: 'Skuadra' },",
  ""
);
f = f.replace(
  "{ key: 'staff', label: 'Stafi' },",
  ""
);
f = f.replace(
  "{ key: 'news', label: 'Lajme' },",
  ""
);

// Change default tab to matches
f = f.replace(
  "const [tab, setTab] = useState<Tab>('squad');",
  "const [tab, setTab] = useState<Tab>('matches');"
);

// Remove hero quick stats (Lojtare, Ndeshje, Fitore, Gola)
f = f.replace(
  /\{\/\* Quick Stats \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  '</div>\n        </div>'
);

// Remove squad tab content
f = f.replace(
  /\{\/\* ====== SQUAD TAB ====== \*\/\}[\s\S]*?\{\/\* ====== MATCHES TAB/,
  '{/* ====== MATCHES TAB'
);

// Remove staff tab content  
f = f.replace(
  /\{\/\* ====== STAFF TAB ====== \*\/\}[\s\S]*?\{\/\* ====== NEWS TAB/,
  '{/* ====== NEWS TAB'
);

// Remove news tab content
f = f.replace(
  /\{\/\* ====== NEWS TAB ====== \*\/\}[\s\S]*?<\/div>\s*\)\}\s*<\/div>/,
  '</div>'
);

// Remove unused type options
f = f.replace(
  "type Tab = 'squad' | 'matches' | 'stats' | 'staff' | 'news';",
  "type Tab = 'matches' | 'stats';"
);

// Remove unused imports
f = f.replace("import { dbNationalPlayers, dbNationalMatches, dbNationalStaff } from '@/lib/supabase-db';", "import { dbNationalMatches } from '@/lib/supabase-db';");

// Remove ntPlayers and ntStaff state
f = f.replace("const [ntPlayers, setNtPlayers] = useState<any[]>([]);", "");
f = f.replace("const [ntStaff, setNtStaff] = useState<any[]>([]);", "");

// Fix loading
f = f.replace(
  "const [pl, ma, st] = await Promise.all([\n          dbNationalPlayers.getAll().catch(() => []),\n          dbNationalMatches.getAll().catch(() => []),\n          dbNationalStaff.getAll().catch(() => []),\n        ]);\n        setNtPlayers(pl);\n        setNtMatches(ma);\n        setNtStaff(st);",
  "const ma = await dbNationalMatches.getAll().catch(() => []);\n        setNtMatches(ma);"
);

// Remove news from useData
f = f.replace("const { news } = useData() as any;", "");

// Remove unused useData import if no longer needed
if (!f.includes("useData()")) {
  f = f.replace("import { useData } from '@/context/DataContext';\n", "");
}

fs.writeFileSync("src/pages/KombetarjaPage.tsx", f, "utf8");
console.log("[OK] Removed: Skuadra, Stafi, Lajme tabs + hero stats");
console.log("Lines: " + f.split("\n").length);
