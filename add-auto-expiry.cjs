const fs = require("fs");

// 1) Add auto-expiry to live_streams - add duration_hours column
console.log("--- Run SQL ---");
console.log("ALTER TABLE live_streams ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;");

// 2) Add expiresAt mapping
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("expiresAt: 'expires_at'")) {
  db = db.replace("thumbnailUrl: 'thumbnail_url',", "thumbnailUrl: 'thumbnail_url',\n    expiresAt: 'expires_at',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] expiresAt added to toSnake");
}
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("expires_at: 'expiresAt'")) {
  db = db.replace("thumbnail_url: 'thumbnailUrl',", "thumbnail_url: 'thumbnailUrl',\n    expires_at: 'expiresAt',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] expiresAt added to toCamel");
}

// 3) Update LiveStreamsPage to auto-filter expired streams
let page = fs.readFileSync("src/pages/LiveStreamsPage.tsx", "utf8");

// Update filter to also check expires_at
page = page.replace(
  "const live = all.filter((s: any) => s.isLive);",
  "const now = new Date().toISOString();\n        const live = all.filter((s: any) => s.isLive && (!s.expiresAt || s.expiresAt > now));"
);

fs.writeFileSync("src/pages/LiveStreamsPage.tsx", page, "utf8");
console.log("[OK] LiveStreamsPage filters expired streams");

// 4) Update Admin to add duration option
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");

// Add duration state
alc = alc.replace(
  "const [editingStreamId, setEditingStreamId] = useState('');",
  "const [editingStreamId, setEditingStreamId] = useState('');\n  const [streamDuration, setStreamDuration] = useState('3');"
);

// Update handleSaveStream to set expires_at
alc = alc.replace(
  `await dbLiveStreams.upsert({
        id: editingStreamId || crypto.randomUUID(),
        matchTitle: streamTitle.trim(),
        streamUrl: streamUrl.trim(),
        isLive: true,
      });
      setStreamTitle(''); setStreamUrl(''); setEditingStreamId('');`,
  `const hours = parseInt(streamDuration) || 3;
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      await dbLiveStreams.upsert({
        id: editingStreamId || crypto.randomUUID(),
        matchTitle: streamTitle.trim(),
        streamUrl: streamUrl.trim(),
        isLive: true,
        expiresAt,
      });
      setStreamTitle(''); setStreamUrl(''); setEditingStreamId(''); setStreamDuration('3');`
);

// Add duration input to BOTH admin forms (the one in no-match view and main view)
// Find all stream form sections and add duration after the URL input
const durationHtml = `            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Kohezgjatja (ore)</label>
              <select value={streamDuration} onChange={e => setStreamDuration(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="1">1 ore</option>
                <option value="2">2 ore</option>
                <option value="3">3 ore</option>
                <option value="4">4 ore</option>
                <option value="5">5 ore</option>
                <option value="6">6 ore</option>
              </select>
            </div>`;

// Replace grid-cols-2 with grid-cols-3 and add duration
alc = alc.replace(
  /(<div className="grid grid-cols-1 md:grid-cols-2 gap-3">\s*<div>\s*<label className="block text-xs font-bold text-gray-500 mb-1">Titulli i Ndeshjes<\/label>[\s\S]*?<label className="block text-xs font-bold text-gray-500 mb-1">Linku \(YouTube \/ Facebook\)<\/label>\s*<input value=\{streamUrl\}[^>]*\/>\s*<\/div>\s*<\/div>)/g,
  (match) => {
    return match
      .replace('grid-cols-1 md:grid-cols-2', 'grid-cols-1 md:grid-cols-3')
      .replace('</div>\n          </div>', '</div>\n' + durationHtml + '\n          </div>');
  }
);

fs.writeFileSync("src/pages/admin/AdminLiveControl.tsx", alc, "utf8");
console.log("[OK] Duration/expiry added to admin");
console.log("Has expiresAt: " + alc.includes("expiresAt"));
console.log("Has streamDuration: " + alc.includes("streamDuration"));

console.log("\n[DONE] Auto-expiry system ready!");
