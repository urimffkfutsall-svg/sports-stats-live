const fs = require("fs");
let alc = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");

// Replace the "no live matches" return to include live streams section
alc = alc.replace(
  `      </div>
    );
  }

  // ============ START MATCH SELECTION ============`,
  `      {/* ====== LIVE STREAMS (shown always) ====== */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm mt-8 text-left">
        <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          Transmetimet Live (YouTube / Facebook)
        </h3>
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Titulli i Ndeshjes</label>
              <input value={streamTitle} onChange={e => setStreamTitle(e.target.value)} placeholder="Prishtina vs Drenica" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Linku (YouTube / Facebook)</label>
              <input value={streamUrl} onChange={e => setStreamUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveStream} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">{editingStreamId ? 'Ruaj' : 'Shto Transmetim'}</button>
            {editingStreamId && <button onClick={() => { setEditingStreamId(''); setStreamTitle(''); setStreamUrl(''); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
          </div>
        </div>
        {liveStreams.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {liveStreams.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={"w-2.5 h-2.5 rounded-full " + (s.isLive ? "bg-red-500 animate-pulse" : "bg-gray-300")}></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.matchTitle}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[300px]">{s.streamUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleStream(s)} className={"text-xs font-bold px-3 py-1 rounded-full " + (s.isLive ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600")}>{s.isLive ? 'Ndale' : 'Aktivizo'}</button>
                  <button onClick={() => { setEditingStreamId(s.id); setStreamTitle(s.matchTitle || ''); setStreamUrl(s.streamUrl || ''); }} className="text-xs text-[#1E6FF2] hover:underline">Edito</button>
                  <button onClick={() => handleDeleteStream(s.id)} className="text-xs text-red-400 hover:text-red-600">Fshi</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    );
  }

  // ============ START MATCH SELECTION ============`
);

fs.writeFileSync("src/pages/admin/AdminLiveControl.tsx", alc, "utf8");
console.log("[OK] Live streams section added to 'no matches' view");
console.log("Transmetimet count: " + (alc.match(/Transmetimet Live/g) || []).length);
