import React, { useState, useEffect } from 'react';
import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches, dbNtActivities, dbFfkMoments } from '@/lib/supabase-db';

const AdminNationalTeam: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [groupTeams, setGroupTeams] = useState<any[]>([]);
  const [groupMatches, setGroupMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actPhoto, setActPhoto] = useState('');
  const [actDate, setActDate] = useState('');
  const [actShowHome, setActShowHome] = useState(false);
  const [editingActId, setEditingActId] = useState('');
  const [actSortOrder, setActSortOrder] = useState('0');
  const [moments, setMoments] = useState<any[]>([]);
  const [momentPhoto, setMomentPhoto] = useState('');
  const [momentCaption, setMomentCaption] = useState('');
  const [momentOrder, setMomentOrder] = useState('0');
  const [editingMomentId, setEditingMomentId] = useState('');

  // Forms
  const [compName, setCompName] = useState('');
  const [compYear, setCompYear] = useState('');
  const [selectedCompId, setSelectedCompId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [isKosova, setIsKosova] = useState(false);

  // Match form
  const [matchHomeId, setMatchHomeId] = useState('');
  const [matchAwayId, setMatchAwayId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchVenue, setMatchVenue] = useState('');
  const [matchHomeScore, setMatchHomeScore] = useState('');
  const [matchAwayScore, setMatchAwayScore] = useState('');
  const [matchStatus, setMatchStatus] = useState('planned');
  const [editingMatchId, setEditingMatchId] = useState('');
  const [editingTeamId, setEditingTeamId] = useState('');

  const load = async () => {
    try {
      const [c, g, gt, gm, acts, moms] = await Promise.all([
        dbNtCompetitions.getAll().catch(() => []),
        dbNtGroups.getAll().catch(() => []),
        dbNtGroupTeams.getAll().catch(() => []),
        dbNtGroupMatches.getAll().catch(() => []),
        dbNtActivities.getAll().catch(() => []),
        dbFfkMoments.getAll().catch(() => []),
      ]);
      setCompetitions(c);
      setGroups(g);
      setGroupTeams(gt);
      setGroupMatches(gm);
      setActivities(acts);
      setMoments(moms);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddComp = async () => {
    if (!compName.trim()) return;
    try {
      await dbNtCompetitions.upsert({ id: crypto.randomUUID(), name: compName.trim(), year: compYear.trim() });
      setCompName(''); setCompYear('');
      load();
    } catch (err) {
      console.error('Add comp error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleDeleteComp = async (id: string) => {
    if (!confirm('Fshi kompeticionin?')) return;
    await dbNtCompetitions.remove(id);
    load();
  };

  const handleAddGroup = async () => {
    if (!groupName.trim() || !selectedCompId) return;
    try {
      await dbNtGroups.upsert({ id: crypto.randomUUID(), competitionId: selectedCompId, name: groupName.trim() });
      setGroupName('');
      load();
    } catch (err) {
      console.error('Add group error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Fshi grupin?')) return;
    await dbNtGroups.remove(id);
    load();
  };

  const handleSaveTeam = async () => {
    if (!teamName.trim() || !selectedGroupId) { alert('Ploteso emrin dhe zgjidh grupin'); return; }
    try {
      const teamData: any = {
        id: editingTeamId || crypto.randomUUID(),
        groupId: selectedGroupId,
        teamName: teamName.trim(),
        isKosova
      };
      if (teamLogo.trim()) teamData.teamLogo = teamLogo.trim();
      else if (editingTeamId) {
        const existing = groupTeams.find(t => t.id === editingTeamId);
        if (existing?.teamLogo) teamData.teamLogo = existing.teamLogo;
      }
      await dbNtGroupTeams.upsert(teamData);
      setTeamName(''); setTeamLogo(''); setIsKosova(false); setEditingTeamId('');
      load();
    } catch (err) {
      console.error('Save team error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleEditTeam = (t: any) => {
    setEditingTeamId(t.id);
    setTeamName(t.teamName || '');
    setTeamLogo(t.teamLogo || '');
    setIsKosova(t.isKosova || false);
    setSelectedGroupId(t.groupId);
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Fshi skuadren?')) return;
    await dbNtGroupTeams.remove(id);
    load();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setTeamLogo(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSaveMatch = async () => {
    if (!matchHomeId || !matchAwayId || !selectedGroupId) return;
    const m: any = {
      id: editingMatchId || crypto.randomUUID(),
      groupId: selectedGroupId,
      homeTeamId: matchHomeId,
      awayTeamId: matchAwayId,
      date: matchDate,
      time: matchTime,
      venue: matchVenue,
      status: matchStatus,
    };
    if (matchStatus === 'finished') {
      m.homeScore = parseInt(matchHomeScore) || 0;
      m.awayScore = parseInt(matchAwayScore) || 0;
    }
    await dbNtGroupMatches.upsert(m);
    setMatchHomeId(''); setMatchAwayId(''); setMatchDate(''); setMatchTime('');
    setMatchVenue(''); setMatchHomeScore(''); setMatchAwayScore('');
    setMatchStatus('planned'); setEditingMatchId('');
    load();
  };

  const handleEditMatch = (m: any) => {
    setEditingMatchId(m.id);
    setSelectedGroupId(m.groupId);
    setMatchHomeId(m.homeTeamId);
    setMatchAwayId(m.awayTeamId);
    setMatchDate(m.date || '');
    setMatchTime(m.time || '');
    setMatchVenue(m.venue || '');
    setMatchHomeScore(String(m.homeScore ?? ''));
    setMatchAwayScore(String(m.awayScore ?? ''));
    setMatchStatus(m.status || 'planned');
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('Fshi ndeshjen?')) return;
    await dbNtGroupMatches.remove(id);
    load();
  };

  const selectedCompGroups = groups.filter(g => g.competitionId === selectedCompId);
  const selectedGroupTeamsList = groupTeams.filter(t => t.groupId === selectedGroupId);
  const selectedGroupMatchesList = groupMatches.filter(m => m.groupId === selectedGroupId);

  const getTeamName = (id: string) => groupTeams.find(t => t.id === id)?.teamName || '?';
  const getTeamLogo = (id: string) => groupTeams.find(t => t.id === id)?.teamLogo || '';

  const handleSaveMoment = async () => {
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

  const handleSaveActivity = async () => {
    if (!actTitle.trim()) return;
    try {
      await dbNtActivities.upsert({
        id: editingActId || crypto.randomUUID(),
        title: actTitle.trim(),
        description: actDesc.trim(),
        photo: actPhoto.trim() || null,
        date: actDate || null,
        showOnHome: actShowHome,
        sortOrder: parseInt(actSortOrder) || 0,
      });
      setActTitle(''); setActDesc(''); setActPhoto(''); setActDate(''); setActShowHome(false); setActSortOrder('0'); setEditingActId('');
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
    setActSortOrder(String(a.sortOrder || 0));
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

  // ============ RANKING TABLE ============
  const getRanking = (gId: string) => {
    const teams = groupTeams.filter(t => t.groupId === gId);
    const matches = groupMatches.filter(m => m.groupId === gId && m.status === 'finished');
    return teams.map(t => {
      const played = matches.filter(m => m.homeTeamId === t.id || m.awayTeamId === t.id);
      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      played.forEach(m => {
        const isHome = m.homeTeamId === t.id;
        const hs = m.homeScore || 0, as_ = m.awayScore || 0;
        const myGoals = isHome ? hs : as_;
        const theirGoals = isHome ? as_ : hs;
        gf += myGoals; ga += theirGoals;
        if (myGoals > theirGoals) w++;
        else if (myGoals === theirGoals) d++;
        else l++;
      });
      return { ...t, played: played.length, w, d, l, gf, ga, gd: gf - ga, pts: w * 3 + d };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Duke u ngarkuar...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-gray-900">Kombetarja - Kompeticionet</h2>

      {/* ====== ADD COMPETITION ====== */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Shto Kompeticion</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1">Emri</label>
            <input value={compName} onChange={e => setCompName(e.target.value)} placeholder="Euro 2028 Qualifiers" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-gray-500 mb-1">Viti</label>
            <input value={compYear} onChange={e => setCompYear(e.target.value)} placeholder="2028" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
          </div>
          <button onClick={handleAddComp} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8] shadow-md">Shto</button>
        </div>
      </div>

      {/* ====== COMPETITIONS LIST ====== */}
      {competitions.map(c => (
        <div key={c.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#1E6FF2] rounded-full"></span>
              <h3 className="font-black text-gray-900">{c.name} {c.year && <span className="text-gray-400 text-sm font-medium">({c.year})</span>}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedCompId(c.id); setSelectedGroupId(''); }} className={"px-3 py-1 rounded-lg text-xs font-bold " + (selectedCompId === c.id ? "bg-[#1E6FF2] text-white" : "bg-gray-100 text-gray-600")}>Menaxho</button>
              <button onClick={() => handleDeleteComp(c.id)} className="px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100">Fshi</button>
            </div>
          </div>

          {selectedCompId === c.id && (
            <div className="space-y-4 mt-4 border-t border-gray-100 pt-4">
              {/* Add Group */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Emri i Grupit</label>
                  <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Grupi A" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
                </div>
                <button onClick={handleAddGroup} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">Shto Grup</button>
              </div>

              {/* Groups */}
              {selectedCompGroups.map(g => (
                <div key={g.id} className="bg-[#F8FAFC] rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800">{g.name}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedGroupId(g.id)} className={"px-3 py-1 rounded-lg text-xs font-bold " + (selectedGroupId === g.id ? "bg-[#1E6FF2] text-white" : "bg-white text-gray-600 border border-gray-200")}>Menaxho</button>
                      <button onClick={() => handleDeleteGroup(g.id)} className="px-2 py-1 rounded-lg text-xs text-red-400 hover:text-red-600">x</button>
                    </div>
                  </div>

                  {/* Ranking Table */}
                  {groupTeams.filter(t => t.groupId === g.id).length > 0 && (
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-gray-400 border-b border-gray-200">
                            <th className="text-left py-2 px-1">#</th>
                            <th className="text-left py-2">Skuadra</th>
                            <th className="text-center py-2 px-1">ND</th>
                            <th className="text-center py-2 px-1">F</th>
                            <th className="text-center py-2 px-1">B</th>
                            <th className="text-center py-2 px-1">H</th>
                            <th className="text-center py-2 px-1">GS</th>
                            <th className="text-center py-2 px-1">GP</th>
                            <th className="text-center py-2 px-1">DG</th>
                            <th className="text-center py-2 px-1 font-black">P</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getRanking(g.id).map((t, i) => (
                            <tr key={t.id} className={"border-b border-gray-100 " + (t.isKosova ? "bg-blue-50/50" : "")}>
                              <td className="py-2 px-1 text-xs font-bold text-gray-400">{i+1}</td>
                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  {t.teamLogo && <img src={t.teamLogo} alt="" className="w-5 h-5 rounded object-contain" />}
                                  <span className={"text-sm " + (t.isKosova ? "font-black text-[#1E6FF2]" : "font-medium text-gray-800")}>{t.teamName}</span>
                                </div>
                              </td>
                              <td className="text-center text-xs">{t.played}</td>
                              <td className="text-center text-xs text-green-600">{t.w}</td>
                              <td className="text-center text-xs text-amber-600">{t.d}</td>
                              <td className="text-center text-xs text-red-500">{t.l}</td>
                              <td className="text-center text-xs">{t.gf}</td>
                              <td className="text-center text-xs">{t.ga}</td>
                              <td className="text-center text-xs font-medium">{t.gd > 0 ? '+' : ''}{t.gd}</td>
                              <td className="text-center text-sm font-black text-[#1E6FF2]">{t.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

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
                        <button onClick={handleSaveTeam} className="px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingTeamId ? 'Ruaj' : 'Shto'}</button>
                        {editingTeamId && <button onClick={() => { setEditingTeamId(''); setTeamName(''); setTeamLogo(''); setIsKosova(false); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
                      </div>

                      {/* Teams list */}
                      <div className="flex flex-wrap gap-2">
                        {selectedGroupTeamsList.filter(t => t.groupId === g.id).map(t => (
                          <div key={t.id} className={"flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border " + (t.isKosova ? "bg-blue-50 border-blue-200 text-[#1E6FF2]" : "bg-white border-gray-200 text-gray-700")}>
                            {t.teamLogo && <img src={t.teamLogo} alt="" className="w-4 h-4 rounded object-contain" />}
                            {t.teamName}
                            <button onClick={() => handleEditTeam(t)} className="text-blue-400 hover:text-blue-600 ml-1" title="Edito">&#9998;</button>
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
            <div className="w-20">
              <label className="block text-xs font-bold text-gray-500 mb-1">Renditja</label>
              <input type="number" value={actSortOrder} onChange={e => setActSortOrder(e.target.value)} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveActivity} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-bold hover:bg-[#1858C8]">{editingActId ? 'Ruaj' : 'Shto Aktivitet'}</button>
            {editingActId && <button onClick={() => { setEditingActId(''); setActTitle(''); setActDesc(''); setActPhoto(''); setActDate(''); setActShowHome(false); setActSortOrder('0'); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}
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

export default AdminNationalTeam;
