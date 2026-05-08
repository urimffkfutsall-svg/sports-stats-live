const dns = require("dns"); dns.setServers(["1.1.1.1","8.8.8.8"]);
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const TABLES = [
  "seasons","competitions","teams","players","matches","goals",
  "scorers","player_of_week","users","app_settings","decisions",
  "national_team_players","national_team_matches",
  "videos","news","visitors",
  "national_players","national_matches","national_staff",
  "nt_competitions","nt_groups","nt_group_teams","nt_group_matches",
  "nt_activities","ffk_moments","live_streams",
  "playoff_series","playoff_matches"
];

(async () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) { console.error("Mungon VITE_SUPABASE_URL/ANON_KEY"); process.exit(1); }
  const supabase = createClient(url, key);
  fs.mkdirSync("exports/data", { recursive: true });

  let total = 0, errors = 0;
  for (const t of TABLES) {
    process.stdout.write(`  ${t.padEnd(28)} ... `);
    const { data, error } = await supabase.from(t).select("*");
    if (error) { console.log(`ERROR: ${error.message}`); errors++; continue; }
    fs.writeFileSync(path.join("exports/data", `${t}.json`), JSON.stringify(data, null, 2));
    console.log(`${(data.length+"").padStart(5)} rreshta`);
    total += data.length;
  }
  console.log(`\n  TOTAL: ${total} rreshta nga ${TABLES.length-errors}/${TABLES.length} tabela`);
})();
