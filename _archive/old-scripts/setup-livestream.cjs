const fs = require("fs");

// 1) DB function for live streams
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("dbLiveStreams")) {
  db += `
// ============ LIVE STREAMS ============
export const dbLiveStreams = {
  async getAll() {
    const { data } = await supabase.from('live_streams').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('live_streams').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('live_streams').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] dbLiveStreams added");
}

// Add mappings
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("streamUrl: 'stream_url'")) {
  db = db.replace("sortOrder: 'sort_order',", "sortOrder: 'sort_order',\n    streamUrl: 'stream_url',\n    isLive: 'is_live',\n    matchTitle: 'match_title',\n    thumbnailUrl: 'thumbnail_url',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] stream mappings added to toSnake");
}
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("stream_url: 'streamUrl'")) {
  db = db.replace("sort_order: 'sortOrder',", "sort_order: 'sortOrder',\n    stream_url: 'streamUrl',\n    is_live: 'isLive',\n    match_title: 'matchTitle',\n    thumbnail_url: 'thumbnailUrl',");
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] stream mappings added to toCamel");
}

console.log("\n--- Run SQL in Supabase ---");
console.log(`CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_title TEXT,
  stream_url TEXT,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read live_streams" ON live_streams FOR SELECT USING (true);
CREATE POLICY "Full access live_streams" ON live_streams FOR ALL USING (true) WITH CHECK (true);`);

console.log("\n[DONE] DB ready");
