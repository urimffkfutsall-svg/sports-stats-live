const fs = require("fs");

// 1) Remove logo from header (in case previous script didn't run)
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
header = header.replace(/{settings\.logo && <img src={settings\.logo} alt="FFK" className="h-9 w-9 object-contain" \/>}\s*\n\s*/g, '');
header = header.replace(/{settings\.logo && <img src={settings\.logo} alt="FFK" className="h-8 w-8 object-contain" \/>}\s*\n\s*/g, '');
fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Logo removed from header");
console.log("settings.logo count: " + (header.match(/settings\.logo/g) || []).length);

// 2) Create SQL note
console.log("\n--- Run this SQL in Supabase ---");
console.log("CREATE TABLE IF NOT EXISTS nt_activities (");
console.log("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,");
console.log("  title TEXT,");
console.log("  description TEXT,");
console.log("  photo TEXT,");
console.log("  date TEXT,");
console.log("  show_on_home BOOLEAN DEFAULT false,");
console.log("  created_at TIMESTAMPTZ DEFAULT now()");
console.log(");");

// 3) Add DB function
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("dbNtActivities")) {
  db += `
// ============ NT ACTIVITIES ============
export const dbNtActivities = {
  async getAll() {
    const { data } = await supabase.from('nt_activities').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('nt_activities').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('nt_activities').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] dbNtActivities added to DB");
}

// 4) Add toSnake/toCamel mappings
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("showOnHome: 'show_on_home'")) {
  db = db.replace(
    "opponentLogo: 'opponent_logo',",
    "opponentLogo: 'opponent_logo',\n    showOnHome: 'show_on_home',"
  );
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] showOnHome added to toSnake");
}
db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("show_on_home: 'showOnHome'")) {
  db = db.replace(
    "opponent_logo: 'opponentLogo',",
    "opponent_logo: 'opponentLogo',\n    show_on_home: 'showOnHome',"
  );
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] showOnHome added to toCamel");
}

console.log("\n[DONE] DB ready for activities");
