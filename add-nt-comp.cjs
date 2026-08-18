const fs = require("fs");

// =====================================================
// 1) Add types
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
if (!types.includes("NtCompetition")) {
  types += `
export interface NtCompetition {
  id: string;
  name: string;
  year?: string;
}

export interface NtGroup {
  id: string;
  competitionId: string;
  name: string;
}

export interface NtGroupTeam {
  id: string;
  groupId: string;
  teamName: string;
  teamLogo?: string;
  isKosova?: boolean;
}

export interface NtGroupMatch {
  id: string;
  groupId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  time?: string;
  venue?: string;
  status?: string;
}
`;
  fs.writeFileSync("src/types/index.ts", types, "utf8");
  console.log("[OK] Types added");
}

// =====================================================
// 2) Add DB functions
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("dbNtCompetitions")) {
  db += `
// ============ NT COMPETITIONS & GROUPS ============
export const dbNtCompetitions = {
  async getAll() {
    const { data } = await supabase.from('nt_competitions').select('*').order('year', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('nt_competitions').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('nt_competitions').delete().eq('id', id);
  }
};

export const dbNtGroups = {
  async getAll() {
    const { data } = await supabase.from('nt_groups').select('*').order('name', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('nt_groups').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('nt_groups').delete().eq('id', id);
  }
};

export const dbNtGroupTeams = {
  async getAll() {
    const { data } = await supabase.from('nt_group_teams').select('*').order('team_name', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('nt_group_teams').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('nt_group_teams').delete().eq('id', id);
  }
};

export const dbNtGroupMatches = {
  async getAll() {
    const { data } = await supabase.from('nt_group_matches').select('*').order('date', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('nt_group_matches').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('nt_group_matches').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] DB functions added");
}

console.log("\n[DONE] Types + DB ready");
console.log("\nRun this SQL in Supabase:");
console.log("=".repeat(50));
