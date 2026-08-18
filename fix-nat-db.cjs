const fs = require("fs");
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Remove old national team block (lines 391-402 area) 
// Old format uses dbInsert/dbUpdate/dbDelete
db = db.replace(
  /export const dbNationalPlayers = \{\s*add:.*?\n.*?\n.*?\n\};\s*\/\/ ============ NATIONAL TEAM MATCHES ============\s*export const dbNationalMatches = \{\s*add:.*?\n.*?\n.*?\n\};/s,
  ''
);

// Now append new proper versions at end
db += `
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

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");

const finalDb = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const cnt = (finalDb.match(/export const dbNational/g) || []).length;
console.log("export const dbNational count: " + cnt);
console.log("Has dbNationalStaff: " + finalDb.includes("dbNationalStaff"));
console.log("Has national_players table: " + finalDb.includes("national_players"));
console.log("[OK] Fixed national team DB functions");
