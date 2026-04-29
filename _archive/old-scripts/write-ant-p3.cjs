const fs = require("fs");
const p3 = `
                  {/* Add Team (when group selected) */}
                  {selectedGroupId === g.id && (
                    <div className="space-y-3">
                      <div className="flex gap-2 items-end flex-wrap">
                        <div className="flex-1 min-w-[150px]">
                          <label className="block text-xs font-bold text-gray-500 mb-1">Emri i Skuadres</label>
                          <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Shqiperia" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div className="w-40">
                          <label className="block text-xs font-bold text-gray-500 mb-1">Logo</label>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-xs" />
                        </div>
                        <label className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border-2 border-gray-200 cursor-pointer">
                          <input type="checkbox" checked={isKosova} onChange={e => setIsKosova(e.target.checked)} className="w-4 h-4 rounded" />
                          <span className="text-xs font-bold text-gray-600">Kosova</span>
                        </label>
                        <button onClick={handleAddTeam} className="px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">Shto</button>
                      </div>

                      {/* Teams list */}
                      <div className="flex flex-wrap gap-2">
                        {selectedGroupTeamsList.filter(t => t.groupId === g.id).map(t => (
                          <div key={t.id} className={"flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border " + (t.isKosova ? "bg-blue-50 border-blue-200 text-[#1E6FF2]" : "bg-white border-gray-200 text-gray-700")}>
                            {t.teamLogo && <img src={t.teamLogo} alt="" className="w-4 h-4 rounded object-contain" />}
                            {t.teamName}
                            <button onClick={() => handleDeleteTeam(t.id)} className="text-red-400 hover:text-red-600 ml-1">x</button>
                          </div>
                        ))}
                      </div>

                      {/* Add Match */}
                      {selectedGroupTeamsList.filter(t => t.groupId === g.id).length >= 2 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-3">
                          <h5 className="font-bold text-gray-800 text-sm mb-3">{editingMatchId ? 'Edito Ndeshjen' : 'Shto Ndeshje'}</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Shtepiak</label>
                              <select value={matchHomeId} onChange={e => setMatchHomeId(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm">
                                <option value="">Zgjedh...</option>
                                {groupTeams.filter(t => t.groupId === g.id).map(t => <option key={t.id} value={t.id}>{t.teamName}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Mysafir</label>
                              <select value={matchAwayId} onChange={e => setMatchAwayId(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm">
                                <option value="">Zgjedh...</option>
                                {groupTeams.filter(t => t.groupId === g.id).map(t => <option key={t.id} value={t.id}>{t.teamName}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Data</label>
                              <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Ora</label>
                              <input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Vendi</label>
                              <input value={matchVenue} onChange={e => setMatchVenue(e.target.value)} placeholder="Prishtina" className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Statusi</label>
                              <select value={matchStatus} onChange={e => setMatchStatus(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm">
                                <option value="planned">E planifikuar</option>
                                <option value="finished">E perfunduar</option>
                              </select>
                            </div>
                            {matchStatus === 'finished' && (
                              <>
                                <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Gola Shtepiak</label>
                                  <input type="number" min="0" value={matchHomeScore} onChange={e => setMatchHomeScore(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Gola Mysafir</label>
                                  <input type="number" min="0" value={matchAwayScore} onChange={e => setMatchAwayScore(e.target.value)} className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleSaveMatch} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingMatchId ? 'Ruaj' : 'Shto Ndeshje'}</button>
                            {editingMatchId && <button onClick={() => { setEditingMatchId(''); setMatchHomeId(''); setMatchAwayId(''); setMatchStatus('planned'); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
                          </div>
                        </div>
                      )}

                      {/* Matches list */}
                      {selectedGroupMatchesList.filter(m => m.groupId === g.id).length > 0 && (
                        <div className="space-y-2 mt-3">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ndeshjet</h5>
                          {groupMatches.filter(m => m.groupId === g.id).map(m => (
                            <div key={m.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-800">{getTeamName(m.homeTeamId)}</span>
                                {m.status === 'finished' ? (
                                  <span className="font-black text-[#1E6FF2]">{m.homeScore} : {m.awayScore}</span>
                                ) : (
                                  <span className="text-gray-400 text-xs">vs</span>
                                )}
                                <span className="font-medium text-gray-800">{getTeamName(m.awayTeamId)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (m.status === 'finished' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600")}>{m.status === 'finished' ? 'Perfunduar' : 'Planifikuar'}</span>
                                <button onClick={() => handleEditMatch(m)} className="text-xs text-[#1E6FF2] hover:underline">Edito</button>
                                <button onClick={() => handleDeleteMatch(m.id)} className="text-xs text-red-400 hover:text-red-600">Fshi</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminNationalTeam;
`;
fs.appendFileSync("src/pages/admin/AdminNationalTeam.tsx", p3, "utf8");
const final = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");
console.log("[OK] Part 3 - Teams + Matches + closing");
console.log("Total lines: " + final.split("\n").length);
console.log("Has export: " + final.includes("export default"));
