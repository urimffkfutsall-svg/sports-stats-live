import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Official, PlayerStats } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function loadOfficials(): Official[] {
  try { var s = localStorage.getItem('ffk_officials'); if (s) return JSON.parse(s); } catch(e) {}
  return [];
}
function loadPlayerStats(): PlayerStats[] {
  try { var s = localStorage.getItem('ffk_player_stats'); if (s) return JSON.parse(s); } catch(e) {}
  return [];
}
function savePlayerStats(list: PlayerStats[]) {
  localStorage.setItem('ffk_player_stats', JSON.stringify(list));
}

var AdminTeamsPlayers: React.FC = function() {
  var data = useData();
  var teams = data.teams;
  var players = data.players;
  var competitions = data.competitions;
  var getActiveSeason = data.getActiveSeason;
  var getTeamById = data.getTeamById;
  var activeSeason = getActiveSeason();

  var officials = loadOfficials();
  var _stats = useState<PlayerStats[]>(loadPlayerStats);
  var stats = _stats[0]; var setStats = _stats[1];
  useEffect(function() { savePlayerStats(stats); }, [stats]);

  var _view = useState<'list' | 'team' | 'player'>('list');
  var view = _view[0]; var setView = _view[1];
  var _selectedTeamId = useState('');
  var selectedTeamId = _selectedTeamId[0]; var setSelectedTeamId = _selectedTeamId[1];
  var _selectedPlayerId = useState('');
  var selectedPlayerId = _selectedPlayerId[0]; var setSelectedPlayerId = _selectedPlayerId[1];
  var _compFilter = useState<'all' | 'superliga' | 'liga_pare'>('all');
  var compFilter = _compFilter[0]; var setCompFilter = _compFilter[1];

  var superligaComp = competitions.find(function(c) { return c.type === 'superliga' && (activeSeason ? c.seasonId === activeSeason.id : true); });
  var ligaPareComp = competitions.find(function(c) { return c.type === 'liga_pare' && (activeSeason ? c.seasonId === activeSeason.id : true); });

  var filteredTeams = teams.filter(function(t) {
    if (!activeSeason) return true;
    if (compFilter === 'superliga') return superligaComp ? t.competitionId === superligaComp.id : false;
    if (compFilter === 'liga_pare') return ligaPareComp ? t.competitionId === ligaPareComp.id : false;
    return (superligaComp && t.competitionId === superligaComp.id) || (ligaPareComp && t.competitionId === ligaPareComp.id);
  });

  var selectedTeam = selectedTeamId ? getTeamById(selectedTeamId) : undefined;
  var teamPlayers = players.filter(function(p) { return p.teamId === selectedTeamId && (activeSeason ? p.seasonId === activeSeason.id : true); });
  var teamOfficials = officials.filter(function(o) { return o.teamId === selectedTeamId && (activeSeason ? o.seasonId === activeSeason.id : true); });
  var selectedPlayer = selectedPlayerId ? players.find(function(p) { return p.id === selectedPlayerId; }) : undefined;

  var _sf = useState({ week: 1, competitionId: '', yellowCards: 0, redCards: 0, extraNotes: '' });
  var sf = _sf[0]; var setSf = _sf[1];

  var playerStats = stats.filter(function(s) { return s.playerId === selectedPlayerId; });

  var handleAddStat = function() {
    if (!selectedPlayerId || !sf.competitionId) return null;
    var newStat: PlayerStats = {
      id: uuidv4(),
      playerId: selectedPlayerId,
      teamId: selectedTeamId,
      competitionId: sf.competitionId,
      seasonId: activeSeason ? activeSeason.id : '',
      week: sf.week,
      yellowCards: sf.yellowCards,
      redCards: sf.redCards,
      extraNotes: sf.extraNotes,
    };
    setStats([newStat].concat(stats));
    setSf({ week: sf.week, competitionId: sf.competitionId, yellowCards: 0, redCards: 0, extraNotes: '' });
  };

  var handleDeleteStat = function(id: string) {
    setStats(stats.filter(function(s) { return s.id !== id; }));
  };

  var getCompName = function(compId: string) {
    var comp = competitions.find(function(c) { return c.id === compId; });
    return comp ? comp.name : compId;
  };

  if (view === 'player' && selectedPlayer) {
    return (
      <div className="space-y-6">
        <button onClick={function() { setView('team'); setSelectedPlayerId(''); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E6FF2] transition-colors">
          ← Kthehu te {selectedTeam?.name}
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {selectedPlayer.photo ? <img src={selectedPlayer.photo} alt="" className="w-full h-full object-cover" /> : null}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedPlayer.firstName} {selectedPlayer.lastName}</h2>
            <p className="text-sm text-gray-500">{selectedTeam?.name} {selectedPlayer.position ? '| Nr. ' + selectedPlayer.position : ''}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">+ Shto Statistike</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2] bg-white" value={sf.competitionId} onChange={function(e) { setSf(Object.assign({}, sf, { competitionId: e.target.value })); }}>
              <option value="">-- Kompeticioni --</option>
              {superligaComp && <option value={superligaComp.id}>Superliga</option>}
              {ligaPareComp && <option value={ligaPareComp.id}>Liga e Pare</option>}
            </select>
            <div>
              <input type="number" min="1" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Java" value={sf.week} onChange={function(e) { setSf(Object.assign({}, sf, { week: parseInt(e.target.value) || 1 })); }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-lg">??</span>
              <input type="number" min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Kartona V." value={sf.yellowCards} onChange={function(e) { setSf(Object.assign({}, sf, { yellowCards: parseInt(e.target.value) || 0 })); }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">??</span>
              <input type="number" min="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Kartona K." value={sf.redCards} onChange={function(e) { setSf(Object.assign({}, sf, { redCards: parseInt(e.target.value) || 0 })); }} />
            </div>
            <button onClick={handleAddStat} className="px-5 py-2.5 bg-gradient-to-r from-[#1E6FF2] to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Shto</button>
          </div>
          <input className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Shenime shtese (opsionale)" value={sf.extraNotes} onChange={function(e) { setSf(Object.assign({}, sf, { extraNotes: e.target.value })); }} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Java</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kompeticioni</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">??</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">??</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Shenime</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {playerStats.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Nuk ka statistika</td></tr>
              ) : playerStats.sort(function(a, b) { return a.week - b.week; }).map(function(s) {
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">Java {s.week}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getCompName(s.competitionId)}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-yellow-600">{s.yellowCards}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-red-600">{s.redCards}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.extraNotes || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function() { handleDeleteStat(s.id); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">✗</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'team' && selectedTeam) {
    return (
      <div className="space-y-6">
        <button onClick={function() { setView('list'); setSelectedTeamId(''); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E6FF2] transition-colors">
          ← Kthehu te Skuadrat
        </button>

        <div className="bg-gradient-to-r from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-6 text-white flex items-center gap-4">
          {selectedTeam.logo && <img src={selectedTeam.logo} alt="" className="w-14 h-14 rounded-xl bg-white/10 p-1" />}
          <div>
            <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
            <p className="text-white/70 text-sm">{teamPlayers.length} lojtare | {teamOfficials.length} zyrtare</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800">Lojtaret</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teamPlayers.length === 0 ? (
            <p className="col-span-full text-sm text-gray-400 text-center py-8">Nuk ka lojtare</p>
          ) : teamPlayers.map(function(p) {
            var pStats = stats.filter(function(s) { return s.playerId === p.id; });
            var totalYellow = pStats.reduce(function(sum, s) { return sum + s.yellowCards; }, 0);
            var totalRed = pStats.reduce(function(sum, s) { return sum + s.redCards; }, 0);
            return (
              <div key={p.id} onClick={function() { setSelectedPlayerId(p.id); setView('player'); }} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:border-[#1E6FF2]/30 transition-all cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.firstName} {p.lastName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {p.position && <span className="text-xs text-gray-400">Nr. {p.position}</span>}
                    {totalYellow > 0 && <span className="text-xs text-yellow-600">?? {totalYellow}</span>}
                    {totalRed > 0 && <span className="text-xs text-red-600">?? {totalRed}</span>}
                  </div>
                </div>
                ›
              </div>
            );
          })}
        </div>

        {teamOfficials.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6">Zyrtaret</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamOfficials.map(function(o) {
                return (
                  <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {o.photo ? <img src={o.photo} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{o.firstName} {o.lastName}</p>
                      <p className="text-xs text-gray-500">{o.position}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] rounded-xl flex items-center justify-center shadow-lg">
            
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Skuadrat & Lojtaret</h2>
            <p className="text-sm text-gray-500">Shiko skuadrat, lojtaret dhe shto statistika</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {['all', 'superliga', 'liga_pare'].map(function(f) {
          var label = f === 'all' ? 'Te gjitha' : f === 'superliga' ? 'Superliga' : 'Liga e Pare';
          return (
            <button key={f} onClick={function() { setCompFilter(f as any); }} className={'px-4 py-2 rounded-xl text-sm font-medium transition-all ' + (compFilter === f ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-400 text-sm">Nuk ka skuadra</p>
        ) : filteredTeams.map(function(t) {
          var tPlayers = players.filter(function(p) { return p.teamId === t.id && (activeSeason ? p.seasonId === activeSeason.id : true); });
          var comp = competitions.find(function(c) { return c.id === t.competitionId; });
          return (
            <div key={t.id} onClick={function() { setSelectedTeamId(t.id); setView('team'); }} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-[#1E6FF2]/30 transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                {t.logo ? <img src={t.logo} alt="" className="w-full h-full object-contain" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{comp ? comp.name : ''} | {tPlayers.length} lojtare</p>
              </div>
              ›
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTeamsPlayers;
