const fs = require("fs");

// 1) Create NtActivitiesSection component
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
      setActivities(all.filter((a: any) => a.showOnHome));
    }).catch(() => {});
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-7 bg-[#d0a650] rounded-full"></span>
          Aktivitetet e Kombetares
        </h2>
        <Link to="/kombetarja" className="text-sm font-bold text-[#1E6FF2] hover:underline">
          Shiko te gjitha &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activities.slice(0, 3).map((a: any) => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            {a.photo && (
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={a.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-[10px] font-bold text-white/80 bg-[#1E6FF2] px-2 py-0.5 rounded-full uppercase">Kombetarja</span>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{a.title}</p>
              {a.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{a.description}</p>}
              {a.date && <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatDate(a.date)}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NtActivitiesSection;
`;
fs.writeFileSync("src/components/NtActivitiesSection.tsx", comp, "utf8");
console.log("[OK] NtActivitiesSection component created");

// 2) Add to AppLayout before Footer
let layout = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
if (!layout.includes("NtActivitiesSection")) {
  layout = layout.replace(
    "import Footer from './Footer';",
    "import Footer from './Footer';\nimport NtActivitiesSection from './NtActivitiesSection';"
  );
  layout = layout.replace(
    "<Footer />",
    "<NtActivitiesSection />\n      <Footer />"
  );
  fs.writeFileSync("src/components/AppLayout.tsx", layout, "utf8");
  console.log("[OK] NtActivitiesSection added to AppLayout (before Footer)");
}

console.log("[DONE] Activities on Ballina ready!");
