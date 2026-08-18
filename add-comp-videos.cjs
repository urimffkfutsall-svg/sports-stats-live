const fs = require("fs");

// =====================================================
// 1) Update Video type - add competitionType
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
types = types.replace(
  "export interface Video {\n  id: string;\n  title: string;\n  description: string;\n  url: string;\n  isFeaturedLanding: boolean;\n  createdAt?: string;\n}",
  "export interface Video {\n  id: string;\n  title: string;\n  description: string;\n  url: string;\n  isFeaturedLanding: boolean;\n  isFeaturedSuperliga?: boolean;\n  isFeaturedLigaPare?: boolean;\n  createdAt?: string;\n}"
);
fs.writeFileSync("src/types/index.ts", types, "utf8");
console.log("[OK] Video type updated with isFeaturedSuperliga/LigaPare");

// =====================================================
// 2) Update AdminVideos - add checkboxes for superliga/liga pare
// =====================================================
let av = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");

// Update form state
av = av.replace(
  "const [form, setForm] = useState({ title: '', description: '', url: '', isFeaturedLanding: false });",
  "const [form, setForm] = useState({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false });"
);

// Update reset form
av = av.replace(
  "setForm({ title: '', description: '', url: '', isFeaturedLanding: false });",
  "setForm({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false });"
);
// Second occurrence (after edit cancel)
av = av.replace(
  "setForm({ title: '', description: '', url: '', isFeaturedLanding: false });",
  "setForm({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false });"
);

// Update startEdit
av = av.replace(
  "setForm({ title: v.title, description: v.description, url: v.url, isFeaturedLanding: v.isFeaturedLanding });",
  "setForm({ title: v.title, description: v.description, url: v.url, isFeaturedLanding: v.isFeaturedLanding, isFeaturedSuperliga: (v as any).isFeaturedSuperliga || false, isFeaturedLigaPare: (v as any).isFeaturedLigaPare || false });"
);

// Add checkboxes after "Shfaq ne Ballina"
av = av.replace(
  `Shfaq ne Ballina
      </label>`,
  `Shfaq ne Ballina
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" checked={form.isFeaturedSuperliga} onChange={e => setForm({...form, isFeaturedSuperliga: e.target.checked})} className="rounded" />
        Shfaq te Superliga
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" checked={form.isFeaturedLigaPare} onChange={e => setForm({...form, isFeaturedLigaPare: e.target.checked})} className="rounded" />
        Shfaq te Liga e Pare
      </label>`
);

fs.writeFileSync("src/pages/admin/AdminVideos.tsx", av, "utf8");
console.log("[OK] AdminVideos updated with Superliga/Liga Pare checkboxes");

// =====================================================
// 3) Update supabase-db.ts - map the new fields
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Check if mapRealtimeRow exists for video fields
// The videos use dbVideos.upsert which sends the row directly
// Need to make sure the fields are mapped in snake_case for Supabase

// Add snake_case mapping in dbVideos.upsert
if (!db.includes("is_featured_superliga")) {
  db = db.replace(
    "export const dbVideos = {",
    `const mapVideoToRow = (v: any) => ({
  id: v.id,
  title: v.title,
  description: v.description,
  url: v.url,
  is_featured_landing: v.isFeaturedLanding || false,
  is_featured_superliga: v.isFeaturedSuperliga || false,
  is_featured_liga_pare: v.isFeaturedLigaPare || false,
});
const mapVideoFromRow = (r: any) => ({
  id: r.id,
  title: r.title || '',
  description: r.description || '',
  url: r.url || '',
  isFeaturedLanding: r.is_featured_landing || false,
  isFeaturedSuperliga: r.is_featured_superliga || false,
  isFeaturedLigaPare: r.is_featured_liga_pare || false,
  createdAt: r.created_at,
});

export const dbVideos = {`
  );

  // Update getAll to use mapVideoFromRow
  db = db.replace(
    "const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });\n    return (data || []) as Video[];",
    "const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });\n    return (data || []).map(mapVideoFromRow) as Video[];"
  );

  // Update upsert to use mapVideoToRow
  db = db.replace(
    "const { data, error } = await supabase.from('videos').upsert(row).select().single();",
    "const { data, error } = await supabase.from('videos').upsert(mapVideoToRow(row)).select().single();"
  );
}

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
console.log("[OK] supabase-db.ts updated with video field mapping");

// =====================================================
// 4) Add Video section to CompetitionPage
// =====================================================
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// Add getEmbedUrl helper at top (after imports)
if (!comp.includes("getEmbedUrl")) {
  comp = comp.replace(
    "const CompetitionPage",
    `function getEmbedUrl(url: string): string {
  let m = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

const CompetitionPage`
  );
}

// Add videos from context
if (!comp.includes("videos")) {
  comp = comp.replace(
    "} = useData();",
    ", videos } = useData() as any;"
  );
  // Remove the old closing if it breaks
  comp = comp.replace("} = useData() as any; as any;", "} = useData() as any;");
}

// Add video section after the matches/standings tabs - before closing div
// Find where the component ends and add video section
const videoSection = `
        {/* Video Section */}
        {(() => {
          const compVideos = (videos || []).filter((v: any) =>
            type === 'superliga' ? v.isFeaturedSuperliga : type === 'liga_pare' ? v.isFeaturedLigaPare : false
          );
          if (compVideos.length === 0) return null;
          return (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"></span>
                <h2 className="text-lg font-bold text-gray-800">Video</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compVideos.map((v: any) => (
                  <div key={v.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video">
                      <iframe
                        src={getEmbedUrl(v.url)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                        title={v.title}
                      />
                    </div>
                    {v.title && (
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-800">{v.title}</h3>
                        {v.description && <p className="text-xs text-gray-500 mt-1">{v.description}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}`;

// Insert before the last closing divs
comp = comp.replace(
  "      </div>\n    </div>\n  );\n};",
  videoSection + "\n      </div>\n    </div>\n  );\n};"
);

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");
console.log("[OK] CompetitionPage — video section added for Superliga/Liga Pare");

// =====================================================
// 5) Add columns to Supabase (SQL to run)
// =====================================================
console.log("\n========================================");
console.log("IMPORTANT: Run this SQL in Supabase SQL Editor:");
console.log("========================================");
console.log("ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_featured_superliga BOOLEAN DEFAULT false;");
console.log("ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_featured_liga_pare BOOLEAN DEFAULT false;");
console.log("========================================");

console.log("\n[DONE] All changes applied!");
console.log("  1. Video type: added isFeaturedSuperliga, isFeaturedLigaPare");
console.log("  2. AdminVideos: 2 new checkboxes (Shfaq te Superliga, Shfaq te Liga e Pare)");
console.log("  3. supabase-db: proper snake_case mapping");
console.log("  4. CompetitionPage: video grid section at bottom");
console.log("  5. SQL: run the ALTER TABLE commands in Supabase");
