const dns = require("dns"); dns.setServers(["1.1.1.1","8.8.8.8"]);
const { Client } = require("pg");
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
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) { console.error("Mungon SUPABASE_DB_PASSWORD"); process.exit(1); }

  // Lidhja DIREKT (jo pooler) - port 5432
  const conn = `postgresql://postgres:${encodeURIComponent(password)}@db.agzbkdinigtbadhdigig.supabase.co:5432/postgres`;

  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const r = await client.query("SELECT current_database(), current_user, version()");
    console.log("OK lidhur:", r.rows[0].current_database, "as", r.rows[0].current_user);
    console.log("");
  } catch (e) {
    console.error("DESHTOI:", e.message);
    process.exit(1);
  }

  fs.mkdirSync("exports/data", { recursive: true });
  let total = 0, ok = 0;
  for (const t of TABLES) {
    process.stdout.write(`  ${t.padEnd(28)} ... `);
    try {
      const r = await client.query(`SELECT * FROM "${t}"`);
      fs.writeFileSync(path.join("exports/data", `${t}.json`), JSON.stringify(r.rows, null, 2));
      console.log(`${(r.rows.length+"").padStart(5)} rreshta`);
      total += r.rows.length;
      ok++;
    } catch (e) {
      console.log(`SKIP: ${e.message.split("\n")[0]}`);
    }
  }
  await client.end();
  console.log(`\n  TOTAL: ${total} rreshta nga ${ok}/${TABLES.length} tabela`);
})();
