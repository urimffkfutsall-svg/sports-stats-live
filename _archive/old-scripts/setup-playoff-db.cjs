const fs = require("fs");

// 1) SQL for playoff tables
console.log("--- Run SQL in Supabase ---");
console.log(`
CREATE TABLE IF NOT EXISTS playoff_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'superliga',
  round TEXT NOT NULL DEFAULT 'quarter',
  team1_id TEXT,
  team2_id TEXT,
  team1_seed INTEGER,
  team2_seed INTEGER,
  winner_id TEXT,
  season_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS playoff_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES playoff_series(id) ON DELETE CASCADE,
  match_number INTEGER DEFAULT 1,
  home_team_id TEXT,
  away_team_id TEXT,
  home_score INTEGER,
  away_score INTEGER,
  date TEXT,
  time TEXT,
  venue TEXT,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE playoff_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE playoff_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read playoff_series" ON playoff_series FOR SELECT USING (true);
CREATE POLICY "Full access playoff_series" ON playoff_series FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read playoff_matches" ON playoff_matches FOR SELECT USING (true);
CREATE POLICY "Full access playoff_matches" ON playoff_matches FOR ALL USING (true) WITH CHECK (true);
`);

// 2) DB functions
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

if (!db.includes("dbPlayoffSeries")) {
  // Add mappings first
  if (!db.includes("team1Id: 'team1_id'")) {
    db = db.replace("expiresAt: 'expires_at',", "expiresAt: 'expires_at',\n    team1Id: 'team1_id',\n    team2Id: 'team2_id',\n    team1Seed: 'team1_seed',\n    team2Seed: 'team2_seed',\n    winnerId: 'winner_id',\n    seriesId: 'series_id',\n    matchNumber: 'match_number',");
  }
  if (!db.includes("team1_id: 'team1Id'")) {
    db = db.replace("expires_at: 'expiresAt',", "expires_at: 'expiresAt',\n    team1_id: 'team1Id',\n    team2_id: 'team2Id',\n    team1_seed: 'team1Seed',\n    team2_seed: 'team2Seed',\n    winner_id: 'winnerId',\n    series_id: 'seriesId',\n    match_number: 'matchNumber',");
  }

  db += `
// ============ PLAYOFF ============
export const dbPlayoffSeries = {
  async getAll() {
    const { data } = await supabase.from('playoff_series').select('*').order('created_at', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('playoff_series').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('playoff_series').delete().eq('id', id);
  }
};

export const dbPlayoffMatches = {
  async getAll() {
    const { data } = await supabase.from('playoff_matches').select('*').order('match_number', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('playoff_matches').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('playoff_matches').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] Playoff DB functions + mappings added");
} else {
  console.log("[SKIP] Already exists");
}

console.log("[DONE] DB setup complete");
