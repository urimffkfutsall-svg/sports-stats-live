const fs = require("fs");
const path = require("path");

// Find AdminPage
function walk(dir) {
  let r = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules","dist",".git",".vercel"].includes(f)) r = r.concat(walk(p));
    } else r.push(p);
  }
  return r;
}
const all = walk("src");
const adminPage = all.find(f => f.includes("AdminPage"));
console.log("AdminPage location: " + (adminPage || "NOT FOUND"));
if (adminPage) {
  const c = fs.readFileSync(adminPage, "utf8");
  console.log("\n========== " + adminPage + " (" + c.split("\n").length + " lines) ==========");
  console.log(c);
}

// supabase-db.ts
const dbFile = all.find(f => f.includes("supabase-db"));
if (dbFile) {
  const c = fs.readFileSync(dbFile, "utf8");
  const lines = c.split("\n");
  console.log("\n========== " + dbFile + " (" + lines.length + " lines) ==========");
  // Show first 60 lines to see the pattern
  console.log(lines.slice(0, 60).join("\n"));
  console.log("\n... [rest hidden] ...");
}

// AppLayout.tsx
const layout = all.find(f => f.includes("AppLayout"));
if (layout) {
  console.log("\n========== " + layout + " ==========");
  console.log(fs.readFileSync(layout, "utf8"));
}
