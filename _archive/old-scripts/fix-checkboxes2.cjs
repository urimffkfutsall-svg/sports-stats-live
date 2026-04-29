const fs = require("fs");
let av = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");
const lines = av.split("\n");

// Insert after line 49 (</label>) - add 2 new checkboxes
const newLines = [
  '        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">',
  '          <input type="checkbox" checked={form.isFeaturedSuperliga} onChange={e => setForm({...form, isFeaturedSuperliga: e.target.checked})} className="rounded" />',
  '          Shfaq te Superliga',
  '        </label>',
  '        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">',
  '          <input type="checkbox" checked={form.isFeaturedLigaPare} onChange={e => setForm({...form, isFeaturedLigaPare: e.target.checked})} className="rounded" />',
  '          Shfaq te Liga e Pare',
  '        </label>',
];

lines.splice(49, 0, ...newLines);
fs.writeFileSync("src/pages/admin/AdminVideos.tsx", lines.join("\n"), "utf8");

// Verify
const final = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");
console.log("Has 'Shfaq te Superliga': " + final.includes("Shfaq te Superliga"));
console.log("Has 'Shfaq te Liga e Pare': " + final.includes("Shfaq te Liga e Pare"));
console.log("[OK] Checkboxes inserted after line 49");
