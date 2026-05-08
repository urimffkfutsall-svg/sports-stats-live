const dns = require("dns"); dns.setServers(["1.1.1.1","8.8.8.8"]);
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  console.log(`  Lidhur me: ${process.env.MONGODB_DB}\n`);

  const dir = "exports/data";
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  let total = 0;

  for (const f of files) {
    const name = f.replace(".json","");
    const docs = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    process.stdout.write(`  ${name.padEnd(28)} ... `);
    if (!docs.length) { console.log("bosh"); continue; }
    await db.collection(name).deleteMany({});
    await db.collection(name).insertMany(docs);
    console.log(`${(docs.length+"").padStart(5)} rreshta`);
    total += docs.length;
  }

  console.log("\n  Krijoj indekse...");
  await db.collection("matches").createIndex({ created_at: -1 });
  await db.collection("players").createIndex({ last_name: 1 });
  await db.collection("teams").createIndex({ name: 1 });
  await db.collection("scorers").createIndex({ goals: -1 });
  try { await db.collection("users").createIndex({ email: 1 }, { unique: true }); } catch {}
  console.log("  Indekset u krijuan");

  await client.close();
  console.log(`\n  TOTAL: ${total} rreshta u importuan`);
})();
