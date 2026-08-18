const fs = require("fs");

// 1) Update NtActivitiesSection - show 4, full width
const comp = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbNtActivities } from '@/lib/supabase-db';

function formatDate(iso: string) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

const NtActivitiesSection: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    dbNtActivities.getAll().then(all => {
      const home = all.filter((a: any) => a.showOnHome);
      home.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setActivities(home);
    }).catch(() => {});
  }, []);

  if (activities.length === 0) return null;

  const items = activities.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-7 bg-[#d0a650] rounded-full"></span>
          Aktivitetet e Kombetares
        </h2>
        <Link to="/kombetarja" className="text-sm font-bold text-[#1E6FF2] hover:underline">
          Shiko te gjitha &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((a: any) => (
          <Link key={a.id} to={'/aktivitet/' + a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            {a.photo && (
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={a.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-[10px] font-bold text-white/80 bg-[#1E6FF2] px-2 py-0.5 rounded-full uppercase">Kombetarja</span>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{a.title}</p>
              {a.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{a.description}</p>}
              {a.date && <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatDate(a.date)}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NtActivitiesSection;
`;
fs.writeFileSync("src/components/NtActivitiesSection.tsx", comp, "utf8");
console.log("[OK] NtActivitiesSection updated - 4 items, full width, sorted");

// 2) Add sortOrder to activities in Admin
let ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Add sortOrder state
if (!ant.includes("actSortOrder")) {
  ant = ant.replace(
    "const [editingActId, setEditingActId] = useState('');",
    "const [editingActId, setEditingActId] = useState('');\n  const [actSortOrder, setActSortOrder] = useState('0');"
  );

  // Add sortOrder to save
  ant = ant.replace(
    "showOnHome: actShowHome,\n      });",
    "showOnHome: actShowHome,\n        sortOrder: parseInt(actSortOrder) || 0,\n      });"
  );

  // Reset sortOrder
  ant = ant.replace(
    "setActShowHome(false); setEditingActId('');",
    "setActShowHome(false); setActSortOrder('0'); setEditingActId('');"
  );

  // Set sortOrder on edit
  ant = ant.replace(
    "setActShowHome(a.showOnHome || false);",
    "setActShowHome(a.showOnHome || false);\n    setActSortOrder(String(a.sortOrder || 0));"
  );

  // Reset on cancel
  ant = ant.replace(
    "setActShowHome(false); }} className",
    "setActShowHome(false); setActSortOrder('0'); }} className"
  );

  // Add sortOrder input to form - after showOnHome checkbox
  ant = ant.replace(
    '<span className="text-xs font-bold text-gray-600">Shfaq ne Ballina</span>\n            </label>',
    '<span className="text-xs font-bold text-gray-600">Shfaq ne Ballina</span>\n            </label>\n            <div className="w-20">\n              <label className="block text-xs font-bold text-gray-500 mb-1">Renditja</label>\n              <input type="number" value={actSortOrder} onChange={e => setActSortOrder(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />\n            </div>'
  );

  fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", ant, "utf8");
  console.log("[OK] SortOrder added to activities admin");
}

// 3) Add sortOrder mapping
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
// Already added in moments step, verify
console.log("Has sortOrder in toSnake: " + db.includes("sortOrder: 'sort_order'"));
console.log("Has sort_order in toCamel: " + db.includes("sort_order: 'sortOrder'"));

// 4) Add sort_order column to nt_activities if missing
console.log("\n--- Run SQL if needed ---");
console.log("ALTER TABLE nt_activities ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;");

console.log("\n[DONE] Activities: 4 items, full width, with sort order");
