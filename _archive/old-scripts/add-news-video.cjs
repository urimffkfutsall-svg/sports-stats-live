const fs = require("fs");

// =====================================================
// 1) Add videoUrl to News type
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
types = types.replace(
  "export interface News {\n  id: string;\n  title: string;\n  description: string;\n  content: string;\n  photo: string;\n  isFeaturedLanding: boolean;\n  createdAt?: string;\n}",
  "export interface News {\n  id: string;\n  title: string;\n  description: string;\n  content: string;\n  photo: string;\n  videoUrl?: string;\n  isFeaturedLanding: boolean;\n  createdAt?: string;\n}"
);
fs.writeFileSync("src/types/index.ts", types, "utf8");
console.log("[OK] News type - videoUrl added");

// =====================================================
// 2) Update AdminNews - add videoUrl input
// =====================================================
let an = fs.readFileSync("src/pages/admin/AdminNews.tsx", "utf8");

// Add videoUrl to form state
an = an.replace(
  "const [form, setForm] = useState({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });",
  "const [form, setForm] = useState({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false });"
);

// Add videoUrl to handleSubmit
an = an.replace(
  "updateNews({ ...form, photo: photoJson, id: editId } as News);",
  "updateNews({ ...form, photo: photoJson, videoUrl: form.videoUrl || undefined, id: editId } as News);"
);
an = an.replace(
  "addNews({ ...form, photo: photoJson });",
  "addNews({ ...form, photo: photoJson, videoUrl: form.videoUrl || undefined });"
);

// Reset form - update all occurrences
an = an.replace(
  "setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });",
  "setForm({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false });"
);
an = an.replace(
  "setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });",
  "setForm({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false });"
);

// startEdit - add videoUrl
an = an.replace(
  "setForm({ title: n.title, description: n.description, content: n.content, photo: n.photo, isFeaturedLanding: n.isFeaturedLanding });",
  "setForm({ title: n.title, description: n.description, content: n.content, photo: n.photo, videoUrl: (n as any).videoUrl || '', isFeaturedLanding: n.isFeaturedLanding });"
);

// Add video URL input after photo upload section (after line 96 </div>)
an = an.replace(
  "        </div>\n\n        <label className=\"flex items-center gap-2 text-sm text-gray-600 cursor-pointer\">\n          <input type=\"checkbox\" checked={form.isFeaturedLanding}",
  `        </div>

        {/* Video URL */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Video URL (YouTube ose Facebook)</label>
          <input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=... ose https://facebook.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLanding}`
);

// Add video badge in news list
an = an.replace(
  "{np.length > 0 && <span className=\"text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full\">{np.length} foto</span>}",
  `{np.length > 0 && <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{np.length} foto</span>}
                    {(n as any).videoUrl && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">VIDEO</span>}`
);

fs.writeFileSync("src/pages/admin/AdminNews.tsx", an, "utf8");
console.log("[OK] AdminNews - videoUrl input added");

// =====================================================
// 3) Update supabase-db mapping
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Add videoUrl to toSnake map
if (!db.includes("videoUrl: 'video_url'")) {
  db = db.replace(
    "    dayOfWeek: 'day_of_week',\n  };",
    "    dayOfWeek: 'day_of_week',\n    videoUrl: 'video_url',\n  };"
  );
}
// Add video_url to toCamel map
if (!db.includes("video_url: 'videoUrl'")) {
  db = db.replace(
    "    day_of_week: 'dayOfWeek',\n  };",
    "    day_of_week: 'dayOfWeek',\n    video_url: 'videoUrl',\n  };"
  );
}

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
console.log("[OK] supabase-db - videoUrl mapping added");

// =====================================================
// 4) Check NewsDetailPage for video display
// =====================================================
let ndp = fs.readFileSync("src/pages/NewsDetailPage.tsx", "utf8");
console.log("\nNewsDetailPage lines: " + ndp.split("\n").length);
console.log("Has videoUrl: " + ndp.includes("videoUrl"));

// =====================================================
// SQL
// =====================================================
console.log("\n========================================");
console.log("Run this SQL in Supabase SQL Editor:");
console.log("========================================");
console.log("ALTER TABLE news ADD COLUMN IF NOT EXISTS video_url TEXT;");
console.log("========================================");
