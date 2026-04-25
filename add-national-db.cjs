const fs = require("fs");

// =====================================================
// Add national team DB functions to supabase-db.ts
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

const ntDb = `

// ============ NATIONAL TEAM ============
export const dbNationalPlayers = {
  async getAll() {
    const { data } = await supabase.from('national_players').select('*').order('number', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('national_players').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('national_players').delete().eq('id', id);
  }
};

export const dbNationalMatches = {
  async getAll() {
    const { data } = await supabase.from('national_matches').select('*').order('date', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('national_matches').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('national_matches').delete().eq('id', id);
  }
};

export const dbNationalStaff = {
  async getAll() {
    const { data } = await supabase.from('national_staff').select('*').order('name', { ascending: true });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('national_staff').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('national_staff').delete().eq('id', id);
  }
};
`;

db += ntDb;
fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
console.log("[OK] National team DB functions added");
