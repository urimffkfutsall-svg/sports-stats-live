const fs = require("fs");
const ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Check what's imported
console.log("Has dbNtActivities: " + ant.includes("dbNtActivities"));

// Add activities section to AdminNationalTeam
let code = ant;

// Add import
if (!code.includes("dbNtActivities")) {
  code = code.replace(
    "import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches } from '@/lib/supabase-db';",
    "import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches, dbNtActivities } from '@/lib/supabase-db';"
  );
}

// Add state for activities
code = code.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [activities, setActivities] = useState<any[]>([]);\n  const [actTitle, setActTitle] = useState('');\n  const [actDesc, setActDesc] = useState('');\n  const [actPhoto, setActPhoto] = useState('');\n  const [actDate, setActDate] = useState('');\n  const [actShowHome, setActShowHome] = useState(false);\n  const [editingActId, setEditingActId] = useState('');"
);

// Add activities to load
code = code.replace(
  "dbNtGroupMatches.getAll().catch(() => []),",
  "dbNtGroupMatches.getAll().catch(() => []),\n        dbNtActivities.getAll().catch(() => []),"
);
code = code.replace(
  "const [c, g, gt, gm] = await Promise.all([",
  "const [c, g, gt, gm, acts] = await Promise.all(["
);
code = code.replace(
  "setGroupMatches(gm);",
  "setGroupMatches(gm);\n      setActivities(acts);"
);

// Add activity handlers before getRanking
code = code.replace(
  "// ============ RANKING TABLE ============",
  `const handleSaveActivity = async () => {
    if (!actTitle.trim()) return;
    try {
      await dbNtActivities.upsert({
        id: editingActId || crypto.randomUUID(),
        title: actTitle.trim(),
        description: actDesc.trim(),
        photo: actPhoto.trim() || null,
        date: actDate || null,
        showOnHome: actShowHome,
      });
      setActTitle(''); setActDesc(''); setActPhoto(''); setActDate(''); setActShowHome(false); setEditingActId('');
      load();
    } catch (err) {
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleEditActivity = (a: any) => {
    setEditingActId(a.id);
    setActTitle(a.title || '');
    setActDesc(a.description || '');
    setActPhoto(a.photo || '');
    setActDate(a.date || '');
    setActShowHome(a.showOnHome || false);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Fshi aktivitetin?')) return;
    await dbNtActivities.remove(id);
    load();
  };

  const handleActPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setActPhoto(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  // ============ RANKING TABLE ============`
);

// Add activities UI before closing </div> of return
code = code.replace(
  "    </div>\n  );\n};\n\nexport default AdminNationalTeam;",
  `
      {/* ====== AKTIVITETET E KOMBETARES ====== */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm mt-8">
        <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#d0a650] rounded-full"></span>
          Aktivitetet e Kombetares
        </h3>
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Titulli</label>
              <input value={actTitle} onChange={e => setActTitle(e.target.value)} placeholder="Kosova U16 mposht..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Data</label>
              <input type="date" value={actDate} onChange={e => setActDate(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Pershkrimi</label>
            <textarea value={actDesc} onChange={e => setActDesc(e.target.value)} rows={3} placeholder="Pershkruaj aktivitetin..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Foto</label>
              <input type="file" accept="image/*" onChange={handleActPhotoUpload} className="w-full text-xs" />
            </div>
            {actPhoto && <img src={actPhoto} alt="" className="w-16 h-12 rounded-lg object-cover border border-gray-200" />}
            <label className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border-2 border-gray-200 cursor-pointer">
              <input type="checkbox" checked={actShowHome} onChange={e => setActShowHome(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-xs font-bold text-gray-600">Shfaq ne Ballina</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveActivity} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingActId ? 'Ruaj' : 'Shto Aktivitet'}</button>
            {editingActId && <button onClick={() => { setEditingActId(''); setActTitle(''); setActDesc(''); setActPhoto(''); setActDate(''); setActShowHome(false); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
          </div>
        </div>

        {/* Activities List */}
        {activities.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            {activities.map(a => (
              <div key={a.id} className="flex items-start gap-3 bg-[#F8FAFC] rounded-xl border border-gray-100 p-3">
                {a.photo && <img src={a.photo} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm truncate">{a.title}</p>
                    {a.showOnHome && <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">BALLINA</span>}
                  </div>
                  {a.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</p>}
                  {a.date && <p className="text-[10px] text-gray-400 mt-0.5">{a.date}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEditActivity(a)} className="text-xs text-[#1E6FF2] hover:underline">Edito</button>
                  <button onClick={() => handleDeleteActivity(a.id)} className="text-xs text-red-400 hover:text-red-600">Fshi</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNationalTeam;`
);

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", code, "utf8");
console.log("[OK] Activities section added to AdminNationalTeam");
console.log("Has dbNtActivities import: " + code.includes("dbNtActivities"));
console.log("Has handleSaveActivity: " + code.includes("handleSaveActivity"));
console.log("Has activities list UI: " + code.includes("activities.map"));
