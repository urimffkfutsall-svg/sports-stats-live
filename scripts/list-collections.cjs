const dns = require("dns");
try { dns.setServers(["1.1.1.1", "8.8.8.8"]); } catch {}
const {MongoClient} = require("mongodb");
(async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "sportsstats";
  if (!uri) { console.error("MONGODB_URI mungon"); process.exit(1); }
  const c = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await c.connect();
  const db = c.db(dbName);
  const colls = await db.listCollections().toArray();
  const sorted = colls.sort((a,b) => a.name.localeCompare(b.name));
  console.log("=== Koleksionet ne MongoDB (" + dbName + ") ===");
  let total = 0;
  for (const x of sorted) {
    const n = await db.collection(x.name).countDocuments();
    total += n;
    console.log("  " + x.name.padEnd(35) + " " + n + " rreshta");
  }
  console.log("=== TOTAL: " + total + " rreshta ne " + sorted.length + " koleksione ===");
  await c.close();
})().catch(e => { console.error("Error:", e.message); process.exit(1); });