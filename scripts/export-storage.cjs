const dns = require("dns"); dns.setServers(["1.1.1.1","8.8.8.8"]);
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const BUCKETS = ["team-logos","player-photos","news-photos"];

(async () => {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  for (const b of BUCKETS) {
    const dir = path.join("exports/storage", b);
    fs.mkdirSync(dir, { recursive: true });
    const { data: files, error } = await supabase.storage.from(b).list("", { limit: 1000 });
    if (error) { console.log(`${b}: ${error.message}`); continue; }
    console.log(`\n  ${b}: ${files.length} file-a`);
    for (const f of files) {
      if (!f.name) continue;
      const { data, error: dErr } = await supabase.storage.from(b).download(f.name);
      if (dErr) { console.log(`    x ${f.name}: ${dErr.message}`); continue; }
      const buf = Buffer.from(await data.arrayBuffer());
      fs.writeFileSync(path.join(dir, f.name), buf);
      process.stdout.write(".");
    }
  }
  console.log("\n  DONE");
})();
