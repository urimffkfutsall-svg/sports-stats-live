const fs = require("fs");

const p2 = `
  const renderSeriesCard = (s: any) => {
    const score = getSeriesScore(s.id);
    const matches = allMatches.filter(m => m.seriesId === s.id);
    const logo1 = getTeamLogo(s.team1Id);
    const logo2 = getTeamLogo(s.team2Id);

    return (
      <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4">
          {/* Teams */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              {logo1 ? <img src={logo1} alt="" className="w-8 h-8 rounded object-contain" /> : <div className="w-8 h-8 rounded bg-gray-100"></div>}
              <div>
                <p className={"text-sm font-bold " + (score.winnerId === s.team1Id ? "text-green-600" : "text-gray-800")}>{getTeamName(s.team1Id)}</p>
                {s.team1Seed > 0 && <p className="text-[10px] text-gray-400">Vendi {s.team1Seed}</p>}
              </div>
            </div>
            <div className="text-center px-3">
              <div className="flex items-center gap-2">
                <span className={"text-xl font-black " + (score.t1Wins > score.t2Wins ? "text-green-600" : "text-gray-400")}>{score.t1Wins}</span>
                <span className="text-gray-300">-</span>
                <span className={"text-xl font-black " + (score.t2Wins > score.t1Wins ? "text-green-600" : "text-gray-400")}>{score.t2Wins}</span>
              </div>
              {score.decided && <p className="text-[9px] font-bold text-green-500 uppercase mt-0.5">Perfunduar</p>}
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="text-right">
                <p className={"text-sm font-bold " + (score.winnerId === s.team2Id ? "text-green-600" : "text-gray-800")}>{getTeamName(s.team2Id)}</p>
                {s.team2Seed > 0 && <p className="text-[10px] text-gray-400">Vendi {s.team2Seed}</p>}
              </div>
              {logo2 ? <img src={logo2} alt="" className="w-8 h-8 rounded object-contain" /> : <div className="w-8 h-8 rounded bg-gray-100"></div>}
            </div>
          </div>

          {/* Matches in this series */}
          {matches.length > 0 && (
            <div className="space-y-1.5 border-t border-gray-100 pt-3">
              {matches.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-3 py-2 text-xs">
                  <span className="font-bold text-gray-500">Ndeshja {m.matchNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">{getTeamName(m.homeTeamId)}</span>
                    {m.status === 'finished' ? (
                      <span className="font-black text-gray-900">{m.homeScore} - {m.awayScore}</span>
                    ) : (
                      <span className="text-gray-400">vs</span>
                    )}
                    <span className="font-bold text-gray-700">{getTeamName(m.awayTeamId)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditMatch(m)} className="text-[#1E6FF2] hover:underline">Edito</button>
                    <button onClick={() => handleDeleteMatch(m.id)} className="text-red-400 hover:text-red-600">Fshi</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button onClick={() => handleDeleteSeries(s.id)} className="text-xs text-red-400 hover:text-red-600">Fshi Serine</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button onClick={() => setPlayoffType('superliga')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (playoffType === 'superliga' ? "bg-[#1E6FF2] text-white shadow-md" : "text-gray-500 hover:text-gray-800")}>PlayOff Superliga</button>
        <button onClick={() => setPlayoffType('liga_pare')} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all " + (playoffType === 'liga_pare' ? "bg-[#1E6FF2] text-white shadow-md" : "text-gray-500 hover:text-gray-800")}>PlayOff Liga e Pare</button>
      </div>

      {/* Add Series Form */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#d0a650] rounded-full"></span>
          {playoffType === 'superliga' ? 'Shto Seri PlayOff' : 'Shto Ndeshje Barrage'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
          {playoffType === 'superliga' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Raundi</label>
              <select value={formRound} onChange={e => setFormRound(e.target.value as PlayoffRound)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="quarter">Cerekfinale (3 vs 6, 4 vs 5)</option>
                <option value="semi">Gjysmefinale</option>
                <option value="final">Finalja</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Skuadra 1</label>
            <select value={formTeam1} onChange={e => setFormTeam1(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
              <option value="">Zgjidh...</option>
              {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Vendi (Seed)</label>
            <input type="number" value={formSeed1} onChange={e => setFormSeed1(e.target.value)} placeholder="3" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Skuadra 2</label>
            <select value={formTeam2} onChange={e => setFormTeam2(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
              <option value="">Zgjidh...</option>
              {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Vendi (Seed)</label>
            <input type="number" value={formSeed2} onChange={e => setFormSeed2(e.target.value)} placeholder="6" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
        </div>
        <button onClick={handleSaveSeries} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingSeriesId ? 'Ruaj' : 'Shto Seri'}</button>
      </div>

      {/* Add Match to Series */}
      {currentSeries.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
            Shto Ndeshje ne Seri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Seria</label>
              <select value={matchSeriesId} onChange={e => {
                setMatchSeriesId(e.target.value);
                const s = currentSeries.find(s => s.id === e.target.value);
                if (s) { setMatchHomeId(s.team1Id); setMatchAwayId(s.team2Id); }
              }} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="">Zgjidh serine...</option>
                {currentSeries.map(s => <option key={s.id} value={s.id}>{getTeamName(s.team1Id)} vs {getTeamName(s.team2Id)} ({s.round})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Ndeshja Nr.</label>
              <select value={matchNumber} onChange={e => setMatchNumber(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="1">Ndeshja 1</option>
                <option value="2">Ndeshja 2</option>
                <option value="3">Ndeshja 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Shtepiak</label>
              <select value={matchHomeId} onChange={e => setMatchHomeId(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="">Zgjidh...</option>
                {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Mysafir</label>
              <select value={matchAwayId} onChange={e => setMatchAwayId(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="">Zgjidh...</option>
                {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Data</label>
              <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Ora</label>
              <input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Statusi</label>
              <select value={matchStatus} onChange={e => setMatchStatus(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <option value="planned">Planifikuar</option>
                <option value="finished">Perfunduar</option>
              </select>
            </div>
            {matchStatus === 'finished' && <>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Gola Shtepiak</label>
                <input type="number" value={matchHomeScore} onChange={e => setMatchHomeScore(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Gola Mysafir</label>
                <input type="number" value={matchAwayScore} onChange={e => setMatchAwayScore(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
              </div>
            </>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveMatch} className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700">{editingMatchId ? 'Ruaj Ndeshjen' : 'Shto Ndeshje'}</button>
            {editingMatchId && <button onClick={() => { setEditingMatchId(''); setMatchSeriesId(''); setMatchNumber('1'); setMatchHomeId(''); setMatchAwayId(''); setMatchDate(''); setMatchTime(''); setMatchVenue(''); setMatchStatus('planned'); setMatchHomeScore(''); setMatchAwayScore(''); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
          </div>
        </div>
      )}
`;

fs.appendFileSync("src/pages/admin/AdminPlayoff.tsx", p2, "utf8");
console.log("[OK] Part 2 - UI forms + series card renderer");
