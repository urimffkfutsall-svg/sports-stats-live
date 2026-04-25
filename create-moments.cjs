const fs = require("fs");

// 1) Create SQL note
console.log("--- Run SQL in Supabase ---");
console.log("CREATE TABLE IF NOT EXISTS ffk_moments (");
console.log("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,");
console.log("  photo TEXT,");
console.log("  caption TEXT,");
console.log("  sort_order INTEGER DEFAULT 0,");
console.log("  created_at TIMESTAMPTZ DEFAULT now()");
console.log(");");

// 2) Add DB function
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("dbFfkMoments")) {
  db += `
// ============ FFK FUTSAL MOMENTS ============
export const dbFfkMoments = {
  async getAll() {
    const { data } = await supabase.from('ffk_moments').select('*').order('sort_order', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('ffk_moments').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('ffk_moments').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] dbFfkMoments added");
}

// Add sortOrder to toSnake/toCamel
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("sortOrder: 'sort_order'")) {
  db = db.replace("showOnHome: 'show_on_home',", "showOnHome: 'show_on_home',\n    sortOrder: 'sort_order',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] sortOrder added to toSnake");
}
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("sort_order: 'sortOrder'")) {
  db = db.replace("show_on_home: 'showOnHome',", "show_on_home: 'showOnHome',\n    sort_order: 'sortOrder',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] sortOrder added to toCamel");
}

// 3) Create FfkMomentsSection component
const ob = String.fromCharCode(123);
const cb = String.fromCharCode(125);
const comp = `import React, ${ ob }useState, useEffect${ cb } from 'react';
import ${ ob }dbFfkMoments${ cb } from '@/lib/supabase-db';

const FfkMomentsSection: React.FC = () => ${ ob }
  const [moments, setMoments] = useState<any[]>([]);
  const [bgPhoto, setBgPhoto] = useState('');

  useEffect(() => ${ ob }
    dbFfkMoments.getAll().then(all => ${ ob }
      setMoments(all);
      if (all.length > 0) setBgPhoto(all[0].photo || '');
    ${ cb }).catch(() => ${ ob }${ cb });
  ${ cb }, []);

  if (moments.length === 0) return null;

  const doubled = [...moments, ...moments];

  return (
    <div className="relative py-12 overflow-hidden">
      ${ ob }/* Background Photo with Overlay */${ cb }
      <div className="absolute inset-0">
        ${ ob }bgPhoto && <img src=${ ob }bgPhoto${ cb } alt="" className="w-full h-full object-cover" />${ cb }
        <div className="absolute inset-0 bg-[#0a1628]/85"></div>
      </div>

      <div className="relative z-10">
        ${ ob }/* Title */${ cb }
        <h2 className="text-center mb-8">
          <span className="text-white text-2xl md:text-3xl font-black tracking-wider">FFK </span>
          <span className="text-[#d0a650] text-2xl md:text-3xl italic font-light tracking-wider">FUTSAL MOMENTS</span>
        </h2>

        ${ ob }/* Scrolling Photos */${ cb }
        <div className="relative">
          <div className="flex animate-moments-marquee gap-6 items-center" style=${ ob }${ ob } width: 'max-content' ${ cb }${ cb }>
            ${ ob }doubled.map((m: any, i: number) => (
              <div key=${ ob }m.id + '-' + i${ cb } className="flex-shrink-0 group cursor-pointer">
                <div className="w-48 h-64 md:w-56 md:h-72 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl group-hover:border-[#d0a650]/50 transition-all duration-300 group-hover:scale-105">
                  ${ ob }m.photo && <img src=${ ob }m.photo${ cb } alt=${ ob }m.caption || ''${ cb } className="w-full h-full object-cover" />${ cb }
                </div>
                ${ ob }m.caption && <p className="text-white/50 text-xs text-center mt-2 group-hover:text-white/80 transition-colors">${ ob }m.caption${ cb }</p>${ cb }
              </div>
            ))${ cb }
          </div>
        </div>
      </div>
    </div>
  );
${ cb };

export default FfkMomentsSection;
`;
fs.writeFileSync("src/components/FfkMomentsSection.tsx", comp, "utf8");
console.log("[OK] FfkMomentsSection component created");

// 4) Add animation CSS
let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes("@keyframes moments-marquee")) {
  css += `
/* FFK Moments Animation */
@keyframes moments-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-moments-marquee {
  animation: moments-marquee 40s linear infinite;
}
.animate-moments-marquee:hover {
  animation-play-state: paused;
}
`;
  fs.writeFileSync("src/index.css", css, "utf8");
  console.log("[OK] Moments animation CSS added");
}

// 5) Add to AppLayout (above videos/TeamMarquee/Footer)
let layout = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
if (!layout.includes("FfkMomentsSection")) {
  layout = layout.replace(
    "import NtActivitiesSection from './NtActivitiesSection';",
    "import NtActivitiesSection from './NtActivitiesSection';\nimport FfkMomentsSection from './FfkMomentsSection';"
  );
  layout = layout.replace(
    "<NtActivitiesSection />",
    "<NtActivitiesSection />\n      <FfkMomentsSection />"
  );
  fs.writeFileSync("src/components/AppLayout.tsx", layout, "utf8");
  console.log("[OK] FfkMomentsSection added to AppLayout");
}

console.log("\n[DONE] FFK FUTSAL MOMENTS ready!");
