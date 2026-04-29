const fs = require("fs");

function patch(file, transform) {
  const orig = fs.readFileSync(file, "utf8");
  const out = transform(orig);
  if (out !== orig) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(file, `${file}.bak-${ts}`);
    fs.writeFileSync(file, out, "utf8");
    console.log("[OK] patched", file);
  } else {
    console.log("[=]  no change", file);
  }
}

// ============ FIX 1: types/index.ts — shto dayOfWeek ============
patch("src/types/index.ts", (s) => {
  if (s.includes("dayOfWeek?:")) return s;
  return s.replace(/(delegate\?: string;\n)/, "$1  dayOfWeek?: string;\n");
});

// ============ FIX 2: AdminMatches.tsx ============
patch("src/pages/admin/AdminMatches.tsx", (s) => {
  let out = s;

  // 2a. emptyForm
  if (!out.includes("dayOfWeek: ''")) {
    out = out.replace(
      "competitionId: '', week: 1, date: '', time: '', venue: '',",
      "competitionId: '', week: 1, date: '', time: '', venue: '', dayOfWeek: '',"
    );
  }

  // 2b. handleSubmit
  if (!out.includes("dayOfWeek: form.dayOfWeek")) {
    out = out.replace(
      "venue: form.venue || undefined,",
      "venue: form.venue || undefined,\n      dayOfWeek: form.dayOfWeek || undefined,"
    );
  }

  // 2c. handleEdit
  if (!out.includes("dayOfWeek: m.dayOfWeek")) {
    out = out.replace(
      "venue: m.venue || '',",
      "venue: m.venue || '', dayOfWeek: m.dayOfWeek || '',"
    );
  }

  // 2d. Rename "Vendi" -> "Palestra"
  out = out.replace(">Vendi</label>", ">Palestra</label>");

  // 2e. Shto Dita dropdown + ndrysho grid-cols-2 -> grid-cols-3
  if (!out.includes("dayOfWeek: e.target.value")) {
    const dita = `              <div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Dita</label>\n                <select value={form.dayOfWeek} onChange={e => setForm(p => ({ ...p, dayOfWeek: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">\n                  <option value="">Zgjedh...</option>\n                  <option value="E Hene">E Hene</option>\n                  <option value="E Marte">E Marte</option>\n                  <option value="E Merkure">E Merkure</option>\n                  <option value="E Enjte">E Enjte</option>\n                  <option value="E Premte">E Premte</option>\n                  <option value="E Shtune">E Shtune</option>\n                  <option value="E Diele">E Diele</option>\n                </select>\n              </div>\n`;
    out = out.replace(
      /<div className="grid grid-cols-1 md:grid-cols-2 gap-3">\s*<div>\s*<label className="block text-xs font-medium text-gray-600 mb-1">Palestra<\/label>/,
      `<div className="grid grid-cols-1 md:grid-cols-3 gap-3">\n${dita}              <div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Palestra</label>`
    );
  }
  return out;
});

// ============ FIX 3: StatistikatPage — Sulmi/Mbrojtja me e mire per liga ============
patch("src/pages/StatistikatPage.tsx", (s) => {
  if (s.includes("Sulmi me i mire")) return s;
  const anchor = "{/* Head to Head CTA */}";
  if (!s.includes(anchor)) return s;

  const block = `{/* Sulmi/Mbrojtja me e mire per liga */}
        <div style={Object.assign({}, { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "20px" })}>
          {activeComps.filter(c => c.type !== "kupa").map(comp => {
            const cm = matches.filter(m => m.competitionId === comp.id && m.status === "finished" && (activeSeason ? m.seasonId === activeSeason.id : true));
            const ct = teams.filter(t => t.competitionId === comp.id);
            const stats: Record<string, { name: string; logo: string; gf: number; ga: number; played: number }> = {};
            ct.forEach(t => { stats[t.id] = { name: t.name, logo: t.logo, gf: 0, ga: 0, played: 0 }; });
            cm.forEach(m => {
              const hs = m.homeScore ?? 0; const as_ = m.awayScore ?? 0;
              if (stats[m.homeTeamId]) { stats[m.homeTeamId].gf += hs; stats[m.homeTeamId].ga += as_; stats[m.homeTeamId].played++; }
              if (stats[m.awayTeamId]) { stats[m.awayTeamId].gf += as_; stats[m.awayTeamId].ga += hs; stats[m.awayTeamId].played++; }
            });
            const arr = Object.values(stats).filter(x => x.played > 0);
            const bestAtk = arr.slice().sort((a, b) => b.gf - a.gf)[0];
            const bestDef = arr.slice().sort((a, b) => a.ga - b.ga)[0];
            return (
              <div key={comp.id} style={card()}>
                <h3 style={Object.assign({}, { fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px 0" })}>{comp.name}</h3>
                <div style={Object.assign({}, { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" })}>
                  <div style={Object.assign({}, { padding: "12px", background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", borderRadius: "12px" })}>
                    <p style={Object.assign({}, { fontSize: "10px", color: "#92400E", textTransform: "uppercase" as const, letterSpacing: "0.5px", fontWeight: 700, margin: 0 })}>Sulmi me i mire</p>
                    {bestAtk ? (<><p style={Object.assign({}, { fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: "6px 0 2px 0" })}>{bestAtk.name}</p><p style={Object.assign({}, { fontSize: "18px", fontWeight: 800, color: "#D97706", margin: 0 })}>{bestAtk.gf} <span style={Object.assign({}, { fontSize: "10px", fontWeight: 500, color: "#92400E" })}>gola</span></p></>) : <p style={Object.assign({}, { fontSize: "12px", color: "#92400E", margin: "6px 0 0 0" })}>Ska te dhena</p>}
                  </div>
                  <div style={Object.assign({}, { padding: "12px", background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)", borderRadius: "12px" })}>
                    <p style={Object.assign({}, { fontSize: "10px", color: "#1E40AF", textTransform: "uppercase" as const, letterSpacing: "0.5px", fontWeight: 700, margin: 0 })}>Mbrojtja me e mire</p>
                    {bestDef ? (<><p style={Object.assign({}, { fontSize: "13px", fontWeight: 700, color: "#0F172A", margin: "6px 0 2px 0" })}>{bestDef.name}</p><p style={Object.assign({}, { fontSize: "18px", fontWeight: 800, color: "#2563EB", margin: 0 })}>{bestDef.ga} <span style={Object.assign({}, { fontSize: "10px", fontWeight: 500, color: "#1E40AF" })}>gola te pranuara</span></p></>) : <p style={Object.assign({}, { fontSize: "12px", color: "#1E40AF", margin: "6px 0 0 0" })}>Ska te dhena</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        `;
  return s.replace(anchor, block + anchor);
});

console.log("\nDone. Vite HMR duhet ta kape automatikisht.");
