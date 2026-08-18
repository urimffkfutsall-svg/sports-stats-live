const fs = require("fs");
let live = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
const lines = live.split("\n");

// Keep logic (lines 1-304), rewrite UI (lines 305-612)
const logic = lines.slice(0, 304).join("\n");

const newUI = `
  // ============ MAIN LIVE CONTROL VIEW ============
  return (
    <div className="space-y-5">
      {/* Live Match Tabs */}
      {liveMatches.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {liveMatches.map(m => {
            const home = teams.find(t => t.id === m.homeTeamId);
            const away = teams.find(t => t.id === m.awayTeamId);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={\`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${
                  selectedMatchId === m.id
                    ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-[#1E6FF2]/30'
                }\`}
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {home?.name} vs {away?.name}
              </button>
            );
          })}
        </div>
      )}

      {plannedMatches.length > 0 && (
        <button onClick={() => setShowStartMatch(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#1E6FF2] bg-[#1E6FF2]/5 border border-[#1E6FF2]/20 rounded-xl font-bold hover:bg-[#1E6FF2]/10 transition-colors">
          + Fillo ndeshje tjetër
        </button>
      )}

      {selectedMatch && (
        <div className="space-y-5">

          {/* ====== SCOREBOARD CARD ====== */}
          <div className="bg-white rounded-2xl border-2 border-[#1E6FF2]/20 shadow-xl shadow-blue-50 overflow-hidden">
            {/* Top bar */}
            <div className="bg-gradient-to-r from-[#1E6FF2] to-[#3B82F6] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span className="text-white text-xs font-black uppercase tracking-[0.15em]">Live Control</span>
              </div>
              <span className="text-white/60 text-xs font-medium">{comp?.name} {selectedMatch.week ? '- Java ' + selectedMatch.week : ''}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center py-4 bg-[#F8FAFC] border-b border-gray-100">
              <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-3 shadow-sm border border-gray-100">
                <button onClick={toggleTimer} className="w-10 h-10 rounded-xl bg-[#1E6FF2]/10 hover:bg-[#1E6FF2]/20 flex items-center justify-center transition-colors text-[#1E6FF2] font-bold text-lg">
                  {timerRunning ? '||' : '\\u25B6'}
                </button>
                <span className="text-4xl font-mono font-black text-gray-900 tracking-wider tabular-nums">{formatTimer(matchTimer)}</span>
                <button onClick={resetTimer} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 font-bold text-sm">
                  RST
                </button>
              </div>
            </div>

            {/* Score with +/- buttons */}
            <div className="flex items-center justify-between px-6 py-8">
              {/* Home */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {homeTeam?.logo && <img src={homeTeam.logo} alt="" className="w-14 h-14 rounded-xl border-2 border-gray-100 p-1 bg-white shadow-sm" />}
                  <span className="font-black text-gray-900 text-lg">{homeTeam?.name}</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => handleUndoGoal('home')} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all text-xl font-bold border border-red-100">-</button>
                  <span className="text-6xl font-black text-[#1E6FF2] tabular-nums">{selectedMatch.homeScore ?? 0}</span>
                  <button onClick={() => handleQuickGoal('home')} className="w-14 h-14 rounded-xl bg-[#1E6FF2] hover:bg-[#1858C8] text-white flex items-center justify-center transition-all shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 text-2xl font-bold">+</button>
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="w-1.5 h-1.5 bg-[#1E6FF2] rounded-full"></div>
                <div className="w-0.5 h-6 bg-gray-200"></div>
                <div className="w-1.5 h-1.5 bg-[#1E6FF2] rounded-full"></div>
              </div>

              {/* Away */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="font-black text-gray-900 text-lg">{awayTeam?.name}</span>
                  {awayTeam?.logo && <img src={awayTeam.logo} alt="" className="w-14 h-14 rounded-xl border-2 border-gray-100 p-1 bg-white shadow-sm" />}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => handleQuickGoal('away')} className="w-14 h-14 rounded-xl bg-[#1E6FF2] hover:bg-[#1858C8] text-white flex items-center justify-center transition-all shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 text-2xl font-bold">+</button>
                  <span className="text-6xl font-black text-[#1E6FF2] tabular-nums">{selectedMatch.awayScore ?? 0}</span>
                  <button onClick={() => handleUndoGoal('away')} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all text-xl font-bold border border-red-100">-</button>
                </div>
              </div>
            </div>
          </div>

          {/* ====== SCORER SELECTION ====== */}
          {scorerTeamSide && (
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg shadow-amber-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-sm">\\u26BD</span>
                  Golashenuesin ({scorerTeamSide === 'home' ? homeTeam?.name : awayTeam?.name})
                </h4>
                <button onClick={() => { setScorerTeamSide(null); setScorerPlayerId(''); }} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">x</button>
              </div>

              {/* Quick player pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(scorerTeamSide === 'home' ? homePlayers : awayPlayers).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setScorerPlayerId(p.id)}
                    className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${
                      scorerPlayerId === p.id
                        ? 'bg-[#1E6FF2] text-white shadow-md shadow-blue-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#1E6FF2]/40'
                    }\`}
                  >
                    {p.firstName.charAt(0)}. {p.lastName}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Lojtari</label>
                  <select value={scorerPlayerId} onChange={e => setScorerPlayerId(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent">
                    <option value="">Zgjedh...</option>
                    {(scorerTeamSide === 'home' ? homePlayers : awayPlayers).map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName} {p.position ? \`(\${p.position})\` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Minuta</label>
                  <input type="number" min="1" value={scorerMinute} onChange={e => setScorerMinute(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#1E6FF2]" placeholder={String(Math.floor(matchTimer / 60) || 1)} />
                </div>
                <div className="flex gap-2 items-end">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2 py-2.5 rounded-xl border border-gray-200">
                    <input type="checkbox" checked={isOwnGoal} onChange={e => setIsOwnGoal(e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-xs font-bold text-gray-600">AG</span>
                  </label>
                  <button onClick={handleAssignScorer} disabled={!scorerPlayerId || !scorerMinute} className="px-5 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200 transition-all">Ruaj</button>
                </div>
              </div>
            </div>
          )}

          {/* ====== ACTION BUTTONS ====== */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSetHalfTime} className="inline-flex items-center gap-2 px-5 py-3 bg-white text-amber-700 border-2 border-amber-200 rounded-xl text-sm font-bold hover:bg-amber-50 transition-colors shadow-sm">
              <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-[10px]">HT</span>
              Pushim (Half-Time)
            </button>
            <button onClick={handleEndMatch} className="inline-flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
              <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px]">FT</span>
              Perfundo Ndeshjen
            </button>
          </div>

          {/* ====== GOALS TIMELINE ====== */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
            <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] text-sm">\\u26BD</span>
              Golat ({matchGoals.length})
            </h4>
            {matchGoals.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <p className="text-sm">Nuk ka gola ende</p>
              </div>
            ) : (
              <div className="space-y-2">
                {matchGoals.sort((a, b) => a.minute - b.minute).map(g => {
                  const player = players.find(p => p.id === g.playerId);
                  const isHome = g.teamId === selectedMatch.homeTeamId;
                  return (
                    <div key={g.id} className={\`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors \${isHome ? 'bg-blue-50/50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}\`}>
                      <span className="text-sm font-black text-[#1E6FF2] w-10 text-center bg-white rounded-lg py-1 border border-gray-100 shadow-sm">{g.minute}'</span>
                      <span className="text-sm">\\u26BD</span>
                      <span className="text-sm font-bold text-gray-800 flex-1">
                        {player ? \`\${player.firstName} \${player.lastName}\` : 'I panjohur'}
                        {g.isOwnGoal && <span className="text-red-500 ml-1 text-xs font-black">(AG)</span>}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{isHome ? homeTeam?.name : awayTeam?.name}</span>
                      <button onClick={() => { if (confirm('Fshi golin?')) { deleteGoal(g.id); if (isHome) { updateMatch({ ...selectedMatch, homeScore: Math.max(0, (selectedMatch.homeScore ?? 0) - 1) }); } else { updateMatch({ ...selectedMatch, awayScore: Math.max(0, (selectedMatch.awayScore ?? 0) - 1) }); } } }} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors text-xs">x</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ====== ROSTERS ====== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
              <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                {homeTeam?.logo && <img src={homeTeam.logo} alt="" className="w-7 h-7 rounded-lg" />}
                {homeTeam?.name} <span className="text-xs text-gray-400 font-medium">({homePlayers.length})</span>
              </h4>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {homePlayers.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5 text-sm text-gray-700 py-1.5 px-2 rounded-lg hover:bg-gray-50">
                    {p.photo ? <img src={p.photo} alt="" className="w-7 h-7 rounded-lg object-cover border border-gray-100" /> : <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>}
                    <span className="font-medium">{p.firstName} {p.lastName}</span>
                    {p.position && <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">({p.position})</span>}
                  </div>
                ))}
                {homePlayers.length === 0 && <p className="text-xs text-gray-300 text-center py-3">Nuk ka lojtare</p>}
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
              <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                {awayTeam?.logo && <img src={awayTeam.logo} alt="" className="w-7 h-7 rounded-lg" />}
                {awayTeam?.name} <span className="text-xs text-gray-400 font-medium">({awayPlayers.length})</span>
              </h4>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {awayPlayers.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5 text-sm text-gray-700 py-1.5 px-2 rounded-lg hover:bg-gray-50">
                    {p.photo ? <img src={p.photo} alt="" className="w-7 h-7 rounded-lg object-cover border border-gray-100" /> : <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>}
                    <span className="font-medium">{p.firstName} {p.lastName}</span>
                    {p.position && <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">({p.position})</span>}
                  </div>
                ))}
                {awayPlayers.length === 0 && <p className="text-xs text-gray-300 text-center py-3">Nuk ka lojtare</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveControl;
`;

fs.writeFileSync("src/pages/admin/AdminLiveControl.tsx", logic + newUI, "utf8");
const final = fs.readFileSync("src/pages/admin/AdminLiveControl.tsx", "utf8");
console.log("[OK] AdminLiveControl - Premium white/blue UI");
console.log("Total lines: " + final.split("\n").length);
console.log("Has export: " + final.includes("export default"));
console.log("Has border-[#1E6FF2]: " + final.includes("border-[#1E6FF2]"));
