import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Match, MatchStatus, Goal } from '@/types';
import { Plus, Pencil, Trash2, X, Eye, Target } from 'lucide-react';

const AdminMatches: React.FC = () => {
  const { matches, teams, competitions, players, goals, getActiveSeason, addMatch, updateMatch, deleteMatch, addGoal, deleteGoal, getGoalsByMatch } = useData();
  const activeSeason = getActiveSeason();
  const [filterComp, setFilterComp] = useState<string>('all');
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [goalsMatchId, setGoalsMatchId] = useState<string | null>(null);

  const emptyForm = {
    competitionId: '', week: 1, date: '', time: '', venue: '',
    homeTeamId: '', awayTeamId: '', homeScore: '', awayScore: '',
    status: 'planned' as MatchStatus, isFeaturedLanding: false,
    referee1: '', referee2: '', referee3: '', delegate: '',
    possession_home: '', possession_away: '', shots_home: '', shots_away: '', fouls_home: '', fouls_away: ''
  };
  const [form, setForm] = useState(emptyForm);

  // Goal form
  const [goalForm, setGoalForm] = useState({ playerId: '', teamId: '', minute: '', isOwnGoal: false });

  const activeComps = competitions.filter(c => activeSeason ? c.seasonId === activeSeason.id : true);
  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);

  const filtered = useMemo(() => {
    let m = matches.filter(m => activeSeason ? m.seasonId === activeSeason.id : true);
    if (filterComp !== 'all') m = m.filter(x => x.competitionId === filterComp);
    if (filterWeek !== 'all') m = m.filter(x => x.week === Number(filterWeek));
    return m.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return b.week - a.week;
    });
  }, [matches, activeSeason, filterComp, filterWeek]);

  const weeks = [...new Set(matches.filter(m => activeSeason ? m.seasonId === activeSeason.id : true).map(m => m.week))].sort((a, b) => a - b);

  const compTeams = (compId: string) => activeTeams.filter(t => t.competitionId === compId);

  const resetForm = () => { setForm(emptyForm); setEditId(null); setShowForm(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.competitionId || !form.homeTeamId || !form.awayTeamId) return;
    const matchData = {
      competitionId: form.competitionId,
      seasonId: activeSeason?.id || '',
      week: form.week,
      date: form.date || undefined,
      time: form.time || undefined,
      venue: form.venue || undefined,
      homeTeamId: form.homeTeamId,
      awayTeamId: form.awayTeamId,
      homeScore: form.homeScore !== '' ? Number(form.homeScore) : undefined,
      awayScore: form.awayScore !== '' ? Number(form.awayScore) : undefined,
      status: form.status,
      isFeaturedLanding: form.isFeaturedLanding,
      referee1: form.referee1 || undefined,
      referee2: form.referee2 || undefined,
      referee3: form.referee3 || undefined,
      delegate: form.delegate || undefined,
      possession_home: form.possession_home !== '' ? Number(form.possession_home) : undefined,
      possession_away: form.possession_away !== '' ? Number(form.possession_away) : undefined,
      shots_home: form.shots_home !== '' ? Number(form.shots_home) : undefined,
      shots_away: form.shots_away !== '' ? Number(form.shots_away) : undefined,
      fouls_home: form.fouls_home !== '' ? Number(form.fouls_home) : undefined,
      fouls_away: form.fouls_away !== '' ? Number(form.fouls_away) : undefined,
    };
    if (editId) {
      updateMatch({ id: editId, ...matchData } as Match);
    } else {
      addMatch(matchData);
    }
    resetForm();
  };

  const handleEdit = (m: Match) => {
    setForm({
      competitionId: m.competitionId, week: m.week, date: m.date || '', time: m.time || '', venue: m.venue || '',
      homeTeamId: m.homeTeamId, awayTeamId: m.awayTeamId,
      homeScore: m.homeScore != null ? String(m.homeScore) : '', awayScore: m.awayScore != null ? String(m.awayScore) : '',
      status: m.status, isFeaturedLanding: m.isFeaturedLanding,
      referee1: m.referee1 || '', referee2: m.referee2 || '', referee3: m.referee3 || '', delegate: m.delegate || '',
      possession_home: m.possession_home != null ? String(m.possession_home) : '',
      possession_away: m.possession_away != null ? String(m.possession_away) : '',
      shots_home: m.shots_home != null ? String(m.shots_home) : '',
      shots_away: m.shots_away != null ? String(m.shots_away) : '',
      fouls_home: m.fouls_home != null ? String(m.fouls_home) : '',
      fouls_away: m.fouls_away != null ? String(m.fouls_away) : '',
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.playerId || !goalForm.minute || !goalsMatchId) return;
    addGoal({
      matchId: goalsMatchId,
      playerId: goalForm.playerId,
      teamId: goalForm.teamId,
      minute: Number(goalForm.minute),
      isOwnGoal: goalForm.isOwnGoal
    });
    setGoalForm({ playerId: '', teamId: '', minute: '', isOwnGoal: false });
  };

  const goalsMatch = goalsMatchId ? matches.find(m => m.id === goalsMatchId) : null;
  const matchGoals = goalsMatchId ? getGoalsByMatch(goalsMatchId) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Ndeshjet</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 px-4 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-medium hover:bg-[#1558CC]">
          <Plus className="w-4 h-4" /> Shto Ndeshje
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={filterComp} onChange={e => setFilterComp(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Të gjitha</option>
          {activeComps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterWeek} onChange={e => setFilterWeek(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Të gjitha javët</option>
          {weeks.map(w => <option key={w} value={w}>Java {w}</option>)}
        </select>
      </div>

      {/* Match Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">{editId ? 'Edito Ndeshjen' : 'Shto Ndeshje të Re'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kompeticioni *</label>
                <select value={form.competitionId} onChange={e => setForm(p => ({ ...p, competitionId: e.target.value, homeTeamId: '', awayTeamId: '' }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" required>
                  <option value="">Zgjedh...</option>
                  {activeComps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Java *</label>
                <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Statusi</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as MatchStatus }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="planned">I planifikuar</option>
                  <option value="live">Në vazhdim (LIVE)</option>
                  <option value="finished">I përfunduar</option>
                  <option value="cancelled">I anuluar</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Skuadra Vendase *</label>
                <select value={form.homeTeamId} onChange={e => setForm(p => ({ ...p, homeTeamId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" required>
                  <option value="">Zgjedh...</option>
                  {(form.competitionId ? compTeams(form.competitionId) : activeTeams).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {form.homeTeamId && (() => {
                  const t = activeTeams.find(x => x.id === form.homeTeamId);
                  return t ? (
                    <div className="flex items-center gap-2 mt-1">
                      {t.logo && <img src={t.logo} alt="" className="w-6 h-6 rounded-full" />}
                      <span className="text-xs text-gray-600">{t.name}</span>
                    </div>
                  ) : null;
                })()}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Skuadra Mysafire *</label>
                <select value={form.awayTeamId} onChange={e => setForm(p => ({ ...p, awayTeamId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" required>
                  <option value="">Zgjedh...</option>
                  {(form.competitionId ? compTeams(form.competitionId) : activeTeams).filter(t => t.id !== form.homeTeamId).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {form.awayTeamId && (() => {
                  const t = activeTeams.find(x => x.id === form.awayTeamId);
                  return t ? (
                    <div className="flex items-center gap-2 mt-1">
                      {t.logo && <img src={t.logo} alt="" className="w-6 h-6 rounded-full" />}
                      <span className="text-xs text-gray-600">{t.name}</span>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ora</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Shtëpi</label>
                <input type="number" min="0" value={form.homeScore} onChange={e => setForm(p => ({ ...p, homeScore: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Jashtë</label>
                <input type="number" min="0" value={form.awayScore} onChange={e => setForm(p => ({ ...p, awayScore: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendi</label>
                <input value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeaturedLanding} onChange={e => setForm(p => ({ ...p, isFeaturedLanding: e.target.checked }))} className="w-4 h-4 text-[#1E6FF2] rounded" />
                  <span className="text-sm text-gray-700">Shfaq në Landing Page</span>
                </label>
              </div>
            </div>
            {/* Officials */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gjyqtari 1</label>
                <input value={form.referee1} onChange={e => setForm(p => ({ ...p, referee1: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gjyqtari 2</label>
                <input value={form.referee2} onChange={e => setForm(p => ({ ...p, referee2: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gjyqtari 3</label>
                <input value={form.referee3} onChange={e => setForm(p => ({ ...p, referee3: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Delegati</label>
                <input value={form.delegate} onChange={e => setForm(p => ({ ...p, delegate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            {/* Stats */}
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 font-medium">Statistikat e Ndeshjes (opsionale)</summary>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                <div><label className="block text-xs text-gray-600 mb-1">Posedimi Shtëpi %</label><input type="number" min="0" max="100" value={form.possession_home} onChange={e => setForm(p => ({ ...p, possession_home: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Posedimi Jashtë %</label><input type="number" min="0" max="100" value={form.possession_away} onChange={e => setForm(p => ({ ...p, possession_away: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Goditjet Shtëpi</label><input type="number" min="0" value={form.shots_home} onChange={e => setForm(p => ({ ...p, shots_home: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Goditjet Jashtë</label><input type="number" min="0" value={form.shots_away} onChange={e => setForm(p => ({ ...p, shots_away: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Faull-et Shtëpi</label><input type="number" min="0" value={form.fouls_home} onChange={e => setForm(p => ({ ...p, fouls_home: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Faull-et Jashtë</label><input type="number" min="0" value={form.fouls_away} onChange={e => setForm(p => ({ ...p, fouls_away: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
              </div>
            </details>
            <button type="submit" className="px-4 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-medium hover:bg-[#1558CC]">
              {editId ? 'Ruaj Ndryshimet' : 'Shto Ndeshjen'}
            </button>
          </form>
        </div>
      )}

      {/* Goals Modal */}
      {goalsMatchId && goalsMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setGoalsMatchId(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Golat e Ndeshjes</h3>
              <button onClick={() => setGoalsMatchId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {/* Existing goals */}
            {matchGoals.length > 0 && (
              <div className="mb-4 space-y-2">
                {matchGoals.map(g => {
                  const p = players.find(pl => pl.id === g.playerId);
                  return (
                    <div key={g.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm">{p ? `${p.firstName} ${p.lastName}` : 'I panjohur'} - {g.minute}' {g.isOwnGoal ? '(AG)' : ''}</span>
                      <button onClick={() => deleteGoal(g.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Add goal form */}
            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Skuadra</label>
                <select value={goalForm.teamId} onChange={e => setGoalForm(p => ({ ...p, teamId: e.target.value, playerId: '' }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">Zgjedh...</option>
                  <option value={goalsMatch.homeTeamId}>{activeTeams.find(t => t.id === goalsMatch.homeTeamId)?.name || 'Shtëpi'}</option>
                  <option value={goalsMatch.awayTeamId}>{activeTeams.find(t => t.id === goalsMatch.awayTeamId)?.name || 'Jashtë'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lojtari</label>
                <select value={goalForm.playerId} onChange={e => setGoalForm(p => ({ ...p, playerId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">Zgjedh...</option>
                  {players.filter(p => p.teamId === goalForm.teamId).map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Minuta</label>
                  <input type="number" min="1" value={goalForm.minute} onChange={e => setGoalForm(p => ({ ...p, minute: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={goalForm.isOwnGoal} onChange={e => setGoalForm(p => ({ ...p, isOwnGoal: e.target.checked }))} className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700">Autogol</span>
                  </label>
                </div>
              </div>
              <button type="submit" className="px-4 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-medium hover:bg-[#1558CC]">
                Shto Gol
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Match List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">Nuk ka ndeshje.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(m => {
              const home = activeTeams.find(t => t.id === m.homeTeamId);
              const away = activeTeams.find(t => t.id === m.awayTeamId);
              const comp = activeComps.find(c => c.id === m.competitionId);
              return (
                <div key={m.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400">{home?.name?.charAt(0)}</span>}
                      </div>
                      <span className="text-sm font-medium text-gray-800 truncate">{home?.name || '?'}</span>
                      <span className="text-sm text-gray-400 mx-1">
                        {m.status === 'finished' ? `${m.homeScore ?? 0} - ${m.awayScore ?? 0}` : 'vs'}
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate">{away?.name || '?'}</span>
                      <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400">{away?.name?.charAt(0)}</span>}
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 ml-2">
                      <span>{comp?.name}</span>
                      <span>J{m.week}</span>
                      {m.date && <span>{m.date}</span>}
                      {m.status === 'live' && <span className="text-red-500 font-bold">LIVE</span>}
                      {m.isFeaturedLanding && <span className="text-[#1E6FF2]">LP</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setGoalsMatchId(m.id)} className="p-1.5 text-gray-400 hover:text-green-600" title="Golat"><Target className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(m)} className="p-1.5 text-gray-400 hover:text-[#1E6FF2]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm('Fshi ndeshjen?')) deleteMatch(m.id); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMatches;
