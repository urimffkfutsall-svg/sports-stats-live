const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2] || "exports/all-data-raw";
if (!fs.existsSync(inputFile)) { console.error(`Mungon: ${inputFile}`); process.exit(1); }

const raw = fs.readFileSync(inputFile, "utf8").replace(/^\uFEFF/, "").trim();
let payload;

try {
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) payload = parsed[0]?.export_data || parsed[0];
  else if (parsed.export_data) payload = parsed.export_data;
  else payload = parsed;
  console.log("  Format: JSON");
} catch (e) {
  const lines = raw.split(/\r?\n/).filter(l => l.length);
  let body = lines.slice(1).join("\n").trim();
  if (body.startsWith('"')) body = body.replace(/^"/, "").replace(/"$/, "").replace(/""/g, '"');
  try {
    payload = JSON.parse(body);
    if (payload.export_data) payload = payload.export_data;
    console.log("  Format: CSV (parsed)");
  } catch (e2) {
    console.error("DESHTOI parsimi:", e2.message);
    console.error("Fillimi:", raw.slice(0, 300));
    process.exit(1);
  }
}

fs.mkdirSync("exports/data", { recursive: true });
let total = 0, tabs = 0;
for (const [table, rows] of Object.entries(payload)) {
  const arr = Array.isArray(rows) ? rows : [];
  fs.writeFileSync(path.join("exports/data", `${table}.json`), JSON.stringify(arr, null, 2));
  console.log(`  ${table.padEnd(28)} ... ${(arr.length+"").padStart(5)} rreshta`);
  total += arr.length;
  tabs++;
}
console.log(`\n  TOTAL: ${total} rreshta ne ${tabs} tabela`);
