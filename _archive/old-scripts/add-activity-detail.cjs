const fs = require("fs");

// 1) Create ActivityDetailPage
const detailPage = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbNtActivities } from '@/lib/supabase-db';

function formatDate(iso: string) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState<any>(null);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbNtActivities.getAll().then(all => {
      setAllActivities(all);
      const found = all.find((a: any) => a.id === id);
      setActivity(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Aktiviteti nuk u gjet</h1>
          <Link to="/kombetarja" className="text-[#1E6FF2] font-bold hover:underline">Kthehu te Kombetarja</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const others = allActivities.filter(a => a.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#1E6FF2]">Ballina</Link>
          <span>/</span>
          <Link to="/kombetarja" className="hover:text-[#1E6FF2]">Kombetarja</Link>
          <span>/</span>
          <span className="text-gray-600">{activity.title}</span>
        </div>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {activity.photo && (
            <div className="aspect-[16/8] overflow-hidden">
              <img src={activity.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold text-white bg-[#1E6FF2] px-2.5 py-1 rounded-full uppercase">Kombetarja</span>
              {activity.date && <span className="text-xs text-gray-400">{formatDate(activity.date)}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">{activity.title}</h1>
            {activity.description && (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {activity.description}
              </div>
            )}
          </div>
        </article>

        {/* Related Activities */}
        {others.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-black text-gray-900 mb-4">Aktivitete te tjera</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {others.map(a => (
                <Link key={a.id} to={'/aktivitet/' + a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  {a.photo && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={a.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2">{a.title}</p>
                    {a.date && <p className="text-[10px] text-gray-400 mt-1">{formatDate(a.date)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
`;
fs.writeFileSync("src/pages/ActivityDetailPage.tsx", detailPage, "utf8");
console.log("[OK] ActivityDetailPage created");

// 2) Add route to App.tsx
let app = fs.readFileSync("src/App.tsx", "utf8");
if (!app.includes("ActivityDetailPage")) {
  app = app.replace(
    'import KombetarjaPage from "./pages/KombetarjaPage";',
    'import KombetarjaPage from "./pages/KombetarjaPage";\nimport ActivityDetailPage from "./pages/ActivityDetailPage";'
  );
  app = app.replace(
    '<Route path="/kombetarja" element={<KombetarjaPage />} />',
    '<Route path="/kombetarja" element={<KombetarjaPage />} />\n                <Route path="/aktivitet/:id" element={<ActivityDetailPage />} />'
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[OK] Route /aktivitet/:id added");
}

// 3) Make activities clickable in KombetarjaPage
let kp = fs.readFileSync("src/pages/KombetarjaPage.tsx", "utf8");
if (!kp.includes("import { Link")) {
  kp = kp.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { Link } from 'react-router-dom';"
  );
}
// Wrap activity cards in Link
kp = kp.replace(
  '<div key={a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">',
  '<Link key={a.id} to={\'/aktivitet/\' + a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">'
);
// Find the closing div for the activity card
kp = kp.replace(
  '{a.date && <p className="text-[10px] text-gray-400 mt-2">{formatDate(a.date)}</p>}\n                  </div>\n                </div>',
  '{a.date && <p className="text-[10px] text-gray-400 mt-2">{formatDate(a.date)}</p>}\n                  </div>\n                </Link>'
);
fs.writeFileSync("src/pages/KombetarjaPage.tsx", kp, "utf8");
console.log("[OK] Activities now clickable in KombetarjaPage");

// 4) Make activities clickable in NtActivitiesSection (Ballina)
let nas = fs.readFileSync("src/components/NtActivitiesSection.tsx", "utf8");
nas = nas.replace(
  '<div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">',
  '<Link key={a.id} to={\'/aktivitet/\' + a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">'
);
nas = nas.replace(
  '{a.date && <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatDate(a.date)}</p>}\n            </div>\n          </div>',
  '{a.date && <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatDate(a.date)}</p>}\n            </div>\n          </Link>'
);
fs.writeFileSync("src/components/NtActivitiesSection.tsx", nas, "utf8");
console.log("[OK] Activities clickable in Ballina");

console.log("\n[DONE] Activity detail page + clickable cards");
