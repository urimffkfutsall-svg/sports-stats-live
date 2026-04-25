const fs = require("fs");

// 1) Add activities to KombetarjaPage
let kp = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");

// Add import
kp = kp.replace(
  "import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches } from '@/lib/supabase-db';",
  "import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches, dbNtActivities } from '@/lib/supabase-db';"
);

// Add state
kp = kp.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [activities, setActivities] = useState([]);"
);

// Add to load
kp = kp.replace(
  "dbNtGroupMatches.getAll().catch(() => []),",
  "dbNtGroupMatches.getAll().catch(() => []),\n          dbNtActivities.getAll().catch(() => []),"
);
kp = kp.replace(
  "const [c, g, gt, gm] = await Promise.all([",
  "const [c, g, gt, gm, acts] = await Promise.all(["
);
kp = kp.replace(
  "if (c.length > 0) setSelectedCompId(c[0].id);",
  "setActivities(acts);\n        if (c.length > 0) setSelectedCompId(c[0].id);"
);

// Add activities section before stats section
kp = kp.replace(
  "{/* Kosova Statistics */}",
  `{/* Aktivitetet e Kombetares */}
        {activities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#d0a650] rounded-full"></span>Aktivitetet e Kombetares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activities.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  {a.photo && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={a.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2">{a.title}</p>
                    {a.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>}
                    {a.date && <p className="text-[10px] text-gray-400 mt-2">{formatDate(a.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kosova Statistics */}`
);

fs.writeFileSync("src/pages/KombetarjaPage.tsx", kp, "utf8");
console.log("[OK] Activities added to KombetarjaPage");

// 2) Add activities to Ballina (Index page)
let idx = fs.readFileSync("src/pages/Index.tsx", "utf8");
const lines = idx.split("\n");
console.log("\nIndex.tsx lines: " + lines.length);
// Check if it imports from supabase-db
console.log("Has supabase-db import: " + idx.includes("supabase-db"));
console.log("Has dbNtActivities: " + idx.includes("dbNtActivities"));

// Show first 30 lines
console.log("\n=== First 20 lines ===");
lines.slice(0, 20).forEach((l, i) => console.log((i+1) + ": " + l.trimEnd()));
