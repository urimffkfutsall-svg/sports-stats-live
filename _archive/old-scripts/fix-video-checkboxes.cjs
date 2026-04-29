const fs = require("fs");
let av = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");

// The checkboxes for superliga/liga pare were supposed to be added after "Shfaq ne Ballina"
// but the replace didn't work. Let's add them manually.

av = av.replace(
  `Shfaq ne Ballina
      </label>
      <div className="flex gap-2">`,
  `Shfaq ne Ballina
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" checked={form.isFeaturedSuperliga} onChange={e => setForm({...form, isFeaturedSuperliga: e.target.checked})} className="rounded" />
        Shfaq te Superliga
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" checked={form.isFeaturedLigaPare} onChange={e => setForm({...form, isFeaturedLigaPare: e.target.checked})} className="rounded" />
        Shfaq te Liga e Pare
      </label>
      <div className="flex gap-2">`
);

// Also add badges for superliga/liga pare in the video list
av = av.replace(
  '{v.isFeaturedLanding && <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NE BALLINA</span>}',
  `{v.isFeaturedLanding && <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NE BALLINA</span>}
                {(v as any).isFeaturedSuperliga && <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SUPERLIGA</span>}
                {(v as any).isFeaturedLigaPare && <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">LIGA E PARE</span>}`
);

fs.writeFileSync("src/pages/admin/AdminVideos.tsx", av, "utf8");

// Verify
const final = fs.readFileSync("src/pages/admin/AdminVideos.tsx", "utf8");
console.log("Has 'Shfaq te Superliga': " + final.includes("Shfaq te Superliga"));
console.log("Has 'Shfaq te Liga e Pare': " + final.includes("Shfaq te Liga e Pare"));
console.log("Has SUPERLIGA badge: " + final.includes("SUPERLIGA</span>"));
console.log("Has LIGA E PARE badge: " + final.includes("LIGA E PARE</span>"));
console.log("[OK] AdminVideos — checkboxes and badges added");
