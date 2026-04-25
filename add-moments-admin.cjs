const fs = require("fs");
let ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Add import
ant = ant.replace(
  "dbNtActivities } from '@/lib/supabase-db';",
  "dbNtActivities, dbFfkMoments } from '@/lib/supabase-db';"
);

// Add state
ant = ant.replace(
  "const [editingActId, setEditingActId] = useState('');",
  "const [editingActId, setEditingActId] = useState('');\n  const [moments, setMoments] = useState<any[]>([]);\n  const [momentPhoto, setMomentPhoto] = useState('');\n  const [momentCaption, setMomentCaption] = useState('');\n  const [momentOrder, setMomentOrder] = useState('0');\n  const [editingMomentId, setEditingMomentId] = useState('');"
);

// Add to load
ant = ant.replace(
  "dbNtActivities.getAll().catch(() => []),",
  "dbNtActivities.getAll().catch(() => []),\n        dbFfkMoments.getAll().catch(() => []),"
);
ant = ant.replace(
  "const [c, g, gt, gm, acts] = await Promise.all([",
  "const [c, g, gt, gm, acts, moms] = await Promise.all(["
);
ant = ant.replace(
  "setActivities(acts);",
  "setActivities(acts);\n      setMoments(moms);"
);

// Add moment handlers before getRanking
ant = ant.replace(
  "const handleSaveActivity = async",
  `const handleSaveMoment = async () => {
    if (!momentPhoto.trim()) { alert('Shto nje foto'); return; }
    try {
      await dbFfkMoments.upsert({
        id: editingMomentId || crypto.randomUUID(),
        photo: momentPhoto.trim(),
        caption: momentCaption.trim() || null,
        sortOrder: parseInt(momentOrder) || 0,
      });
      setMomentPhoto(''); setMomentCaption(''); setMomentOrder('0'); setEditingMomentId('');
      load();
    } catch (err) {
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleEditMoment = (m: any) => {
    setEditingMomentId(m.id);
    setMomentPhoto(m.photo || '');
    setMomentCaption(m.caption || '');
    setMomentOrder(String(m.sortOrder || 0));
  };

  const handleDeleteMoment = async (id: string) => {
    if (!confirm('Fshi momentin?')) return;
    await dbFfkMoments.remove(id);
    load();
  };

  const handleMomentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setMomentPhoto(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSaveActivity = async`
);

// Add Moments UI section after activities section, before closing
ant = ant.replace(
  "    </div>\n  );\n};\n\nexport default AdminNationalTeam;",
  `
      {/* ====== FFK FUTSAL MOMENTS ====== */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm mt-8">
        <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#1E6FF2] rounded-full"></span>
          FFK Futsal Moments
        </h3>
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Foto</label>
              <input type="file" accept="image/*" onChange={handleMomentPhotoUpload} className="w-full text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Caption (opsional)</label>
              <input value={momentCaption} onChange={e => setMomentCaption(e.target.value)} placeholder="Pershkrim i shkurter" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Renditja</label>
              <input type="number" value={momentOrder} onChange={e => setMomentOrder(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          {momentPhoto && <img src={momentPhoto} alt="" className="w-24 h-32 rounded-lg object-cover border border-gray-200" />}
          <div className="flex gap-2">
            <button onClick={handleSaveMoment} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingMomentId ? 'Ruaj' : 'Shto Moment'}</button>
            {editingMomentId && <button onClick={() => { setEditingMomentId(''); setMomentPhoto(''); setMomentCaption(''); setMomentOrder('0'); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
          </div>
        </div>

        {/* Moments Grid */}
        {moments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 border-t border-gray-100 pt-4">
            {moments.map(m => (
              <div key={m.id} className="relative group">
                {m.photo && <img src={m.photo} alt="" className="w-full aspect-[3/4] rounded-lg object-cover border border-gray-200" />}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button onClick={() => handleEditMoment(m)} className="text-xs text-white bg-[#1E6FF2] px-2 py-1 rounded">Edito</button>
                  <button onClick={() => handleDeleteMoment(m.id)} className="text-xs text-white bg-red-500 px-2 py-1 rounded">Fshi</button>
                </div>
                {m.caption && <p className="text-[10px] text-gray-500 mt-1 truncate">{m.caption}</p>}
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

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", ant, "utf8");
console.log("[OK] FFK Moments admin UI added");
console.log("Has dbFfkMoments: " + ant.includes("dbFfkMoments"));
console.log("Has handleSaveMoment: " + ant.includes("handleSaveMoment"));
console.log("Has moments grid: " + ant.includes("moments.map"));
