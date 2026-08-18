import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Match, Player } from '@/types';
import { broadcastNotification } from '@/lib/supabase-db';
import { 
  Play, Square, Plus, Minus, Clock, Target, Users, 
  ChevronDown, ChevronUp, Zap, Trophy, AlertCircle, Timer, X
} from 'lucide-react';

const AdminLiveControl: React.FC = () => {
  const { 
    matches, teams, players, competitions, goals,
    getActiveSeason, updateMatch, addGoal, deleteGoal, getGoalsByMatch 
  } = useData();
  const activeSeason = getActiveSeason();

  // Get all live matches + planned matches that can be started
  const liveMatches = matches.filter(m => m.status === 'live' && (activeSeason ? m.seasonId === activeSeason.id : true));
  const plannedMatches = matches.filter(m => m.status === 'planned' && (activeSeason ? m.seasonId === activeSeason.id : true));

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [scorerTeamSide, setScorerTeamSide] = useState<'home' | 'away' | null>(null);
  const [scorerPlayerId, setScorerPlayerId] = useState<string>('');
  const [scorerMinute, setScorerMinute] = useState<string>('');
  const [isOwnGoal, setIsOwnGoal] = useState(false);
  const [showStartMatch, setShowStartMatch] = useState(false);

  // Auto-select first live match
  useEffect(() => {
    if (!selectedMatchId && liveMatches.length > 0) {
      setSelectedMatchId(liveMatches[0].id);
    }
  }, [liveMatches, selectedMatchId]);

  const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) : null;
  const homeTeam = selectedMatch ? teams.find(t => t.id === selectedMatch.homeTeamId) : null;
  const awayTeam = selectedMatch ? teams.find(t => t.id === selectedMatch.awayTeamId) : null;
  const matchGoals = selectedMatch ? getGoalsByMatch(selectedMatch.id) : [];
  const comp = selectedMatch ? competitions.find(c => c.id === selectedMatch.competitionId) : null;

  const homePlayers = selectedMatch ? players.filter(p => p.teamId === selectedMatch.homeTeamId) : [];
  const awayPlayers = selectedMatch ? players.filter(p => p.teamId === selectedMatch.awayTeamId) : [];

  // ============ MATCH TIMER ============
  const [matchTimer, setMatchTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer from localStorage
  useEffect(() => {
    if (selectedMatchId) {
      const saved = localStorage.getItem(`match_timer_${selectedMatchId}`);
      const savedStart = localStorage.getItem(`match_timer_start_${selectedMatchId}`);
      if (saved && savedStart) {
        const elapsed = Math.floor((Date.now() - Number(savedStart)) / 1000);
        setMatchTimer(Number(saved) + elapsed);
        setTimerRunning(true);
      } else if (saved) {
        setMatchTimer(Number(saved));
        setTimerRunning(false);
      } else {
        setMatchTimer(0);
        setTimerRunning(false);
      }
    }
  }, [selectedMatchId]);

  useEffect(() => {
    if (timerRunning && selectedMatchId) {
      timerRef.current = setInterval(() => {
        setMatchTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, selectedMatchId]);

  const toggleTimer = () => {
    if (!selectedMatchId) return;
    if (timerRunning) {
      localStorage.setItem(`match_timer_${selectedMatchId}`, String(matchTimer));
      localStorage.removeItem(`match_timer_start_${selectedMatchId}`);
      setTimerRunning(false);
    } else {
      localStorage.setItem(`match_timer_${selectedMatchId}`, String(matchTimer));
      localStorage.setItem(`match_timer_start_${selectedMatchId}`, String(Date.now()));
      setTimerRunning(true);
    }
  };

  const resetTimer = () => {
    if (!selectedMatchId) return;
    setMatchTimer(0);
    setTimerRunning(false);
    localStorage.removeItem(`match_timer_${selectedMatchId}`);
    localStorage.removeItem(`match_timer_start_${selectedMatchId}`);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ============ QUICK GOAL ============
  const handleQuickGoal = (side: 'home' | 'away') => {
    if (!selectedMatch) return;
    const newHomeScore = side === 'home' ? (selectedMatch.homeScore ?? 0) + 1 : (selectedMatch.homeScore ?? 0);
    const newAwayScore = side === 'away' ? (selectedMatch.awayScore ?? 0) + 1 : (selectedMatch.awayScore ?? 0);
    
    updateMatch({
      ...selectedMatch,
      homeScore: newHomeScore,
      awayScore: newAwayScore,
    });

    // Open scorer selection
    setScorerTeamSide(side);
    setScorerMinute(String(Math.floor(matchTimer / 60) || 1));

    // Broadcast notification
    broadcastNotification('goal', {
      matchId: selectedMatch.id,
      homeTeam: homeTeam?.name,
      awayTeam: awayTeam?.name,
      homeScore: newHomeScore,
      awayScore: newAwayScore,
      side,
      timestamp: Date.now(),
    });
  };

  const handleUndoGoal = (side: 'home' | 'away') => {
    if (!selectedMatch) return;
    const currentScore = side === 'home' ? (selectedMatch.homeScore ?? 0) : (selectedMatch.awayScore ?? 0);
    if (currentScore <= 0) return;
    
    updateMatch({
      ...selectedMatch,
      homeScore: side === 'home' ? currentScore - 1 : (selectedMatch.homeScore ?? 0),
      awayScore: side === 'away' ? currentScore - 1 : (selectedMatch.awayScore ?? 0),
    });
  };

  const handleAssignScorer = () => {
    if (!selectedMatch || !scorerPlayerId || !scorerMinute || !scorerTeamSide) return;
    const teamId = scorerTeamSide === 'home' ? selectedMatch.homeTeamId : selectedMatch.awayTeamId;
    addGoal({
      matchId: selectedMatch.id,
      playerId: scorerPlayerId,
      teamId,
      minute: Number(scorerMinute),
      isOwnGoal,
    });

    const player = players.find(p => p.id === scorerPlayerId);
    broadcastNotification('goal_scorer', {
      matchId: selectedMatch.id,
      scorerName: player ? `${player.firstName} ${player.lastName}` : 'Unknown',
      minute: Number(scorerMinute),
      homeTeam: homeTeam?.name,
      awayTeam: awayTeam?.name,
      homeScore: selectedMatch.homeScore ?? 0,
      awayScore: selectedMatch.awayScore ?? 0,
      timestamp: Date.now(),
    });

    setScorerTeamSide(null);
    setScorerPlayerId('');
    setScorerMinute('');
    setIsOwnGoal(false);
  };

  // ============ START / END MATCH ============
  const handleStartMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    updateMatch({
      ...match,
      status: 'live',
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
    });
    setSelectedMatchId(matchId);
    setShowStartMatch(false);

    const home = teams.find(t => t.id === match.homeTeamId);
    const away = teams.find(t => t.id === match.awayTeamId);
    broadcastNotification('match_start', {
      matchId,
      homeTeam: home?.name,
      awayTeam: away?.name,
      timestamp: Date.now(),
    });
  };

  const handleEndMatch = () => {
    if (!selectedMatch) return;
    if (!confirm(`Përfundo ndeshjen ${homeTeam?.name} ${selectedMatch.homeScore ?? 0} - ${selectedMatch.awayScore ?? 0} ${awayTeam?.name}?`)) return;
    
    updateMatch({
      ...selectedMatch,
      status: 'finished',
    });

    // Clean up timer
    localStorage.removeItem(`match_timer_${selectedMatch.id}`);
    localStorage.removeItem(`match_timer_start_${selectedMatch.id}`);
    setTimerRunning(false);
    setMatchTimer(0);

    broadcastNotification('match_end', {
      matchId: selectedMatch.id,
      homeTeam: homeTeam?.name,
      awayTeam: awayTeam?.name,
      homeScore: selectedMatch.homeScore ?? 0,
      awayScore: selectedMatch.awayScore ?? 0,
      timestamp: Date.now(),
    });

    setSelectedMatchId(null);
  };

  const handleSetHalfTime = () => {
    if (!selectedMatch) return;
    broadcastNotification('half_time', {
      matchId: selectedMatch.id,
      homeTeam: homeTeam?.name,
      awayTeam: awayTeam?.name,
      homeScore: selectedMatch.homeScore ?? 0,
      awayScore: selectedMatch.awayScore ?? 0,
      timestamp: Date.now(),
    });
  };

  // ============ NO LIVE MATCHES VIEW ============
  if (liveMatches.length === 0 && !showStartMatch) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Nuk ka ndeshje LIVE</h3>
        <p className="text-sm text-gray-500 mb-6">Fillo një ndeshje të planifikuar për të përdorur kontrollin LIVE.</p>
        {plannedMatches.length > 0 ? (
          <button
            onClick={() => setShowStartMatch(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
          >
            <Play className="w-5 h-5" />
            Fillo Ndeshje ({plannedMatches.length} të planifikuara)
          </button>
        ) : (
          <p className="text-sm text-gray-400">Nuk ka ndeshje të planifikuara. Shto ndeshje nga tab-i "Ndeshjet".</p>
        )}
      </div>
    );
  }

  // ============ START MATCH SELECTION ============
  if (showStartMatch) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Fillo Ndeshje</h2>
          <button onClick={() => setShowStartMatch(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedMatches.map(m => {
            const home = teams.find(t => t.id === m.homeTeamId);
            const away = teams.find(t => t.id === m.awayTeamId);
            const c = competitions.find(c => c.id === m.competitionId);
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all">
                <div className="text-xs text-gray-400 mb-2">{c?.name} - Java {m.week} {m.date && `| ${m.date}`}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {home?.logo ? <img src={home.logo} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
                    <span className="font-semibold text-gray-800">{home?.name || '?'}</span>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{away?.name || '?'}</span>
                    {away?.logo ? <img src={away.logo} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
                  </div>
                </div>
                <button
                  onClick={() => handleStartMatch(m.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Fillo LIVE
                </button>
              </div>
            );
          })}
        </div>
        {plannedMatches.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nuk ka ndeshje të planifikuara.</p>
        )}
      </div>
    );
  }

  // ============ MAIN LIVE CONTROL VIEW ============
  return (
    <div>
      {/* Live Match Tabs */}
      {liveMatches.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {liveMatches.map(m => {
            const home = teams.find(t => t.id === m.homeTeamId);
            const away = teams.find(t => t.id === m.awayTeamId);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedMatchId === m.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-200'
                }`}
              >
                <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                {home?.name} vs {away?.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Start another match button */}
      {plannedMatches.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowStartMatch(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Fillo ndeshje tjetër
          </button>
        </div>
      )}

      {selectedMatch && (
        <div className="space-y-4">
          {/* Match Header */}
          <div className="bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">LIVE</span>
              </div>
              <span className="text-xs text-white/60">{comp?.name} - Java {selectedMatch.week}</span>
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-black/20 rounded-xl px-6 py-3">
                <button onClick={toggleTimer} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  {timerRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-4xl font-mono font-bold tracking-wider">{formatTimer(matchTimer)}</span>
                <button onClick={resetTimer} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Timer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Display with +1 Buttons */}
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Home Team */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {homeTeam?.logo && <img src={homeTeam.logo} alt="" className="w-12 h-12 rounded-full bg-white/10 p-0.5" />}
                  <span className="font-bold text-lg">{homeTeam?.name}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleUndoGoal('home')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Hiq gol"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-6xl font-bold tabular-nums">{selectedMatch.homeScore ?? 0}</span>
                  <button
                    onClick={() => handleQuickGoal('home')}
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95"
                    title="Shto gol"
                  >
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-light text-white/30">-</div>

              {/* Away Team */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-bold text-lg">{awayTeam?.name}</span>
                  {awayTeam?.logo && <img src={awayTeam.logo} alt="" className="w-12 h-12 rounded-full bg-white/10 p-0.5" />}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleQuickGoal('away')}
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95"
                    title="Shto gol"
                  >
                    <Plus className="w-7 h-7" />
                  </button>
                  <span className="text-6xl font-bold tabular-nums">{selectedMatch.awayScore ?? 0}</span>
                  <button
                    onClick={() => handleUndoGoal('away')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Hiq gol"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scorer Selection Modal */}
          {scorerTeamSide && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Zgjedh golashënuesin ({scorerTeamSide === 'home' ? homeTeam?.name : awayTeam?.name})
                </h4>
                <button onClick={() => { setScorerTeamSide(null); setScorerPlayerId(''); }} className="text-yellow-600 hover:text-yellow-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-yellow-700 mb-1">Lojtari</label>
                  <select
                    value={scorerPlayerId}
                    onChange={e => setScorerPlayerId(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Zgjedh lojtarin...</option>
                    {(scorerTeamSide === 'home' ? homePlayers : awayPlayers).map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName} {p.position ? `(${p.position})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-yellow-700 mb-1">Minuta</label>
                  <input
                    type="number"
                    min="1"
                    value={scorerMinute}
                    onChange={e => setScorerMinute(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm bg-white"
                    placeholder={String(Math.floor(matchTimer / 60) || 1)}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isOwnGoal} onChange={e => setIsOwnGoal(e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-xs text-yellow-700">AG</span>
                  </label>
                  <button
                    onClick={handleAssignScorer}
                    disabled={!scorerPlayerId || !scorerMinute}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ruaj
                  </button>
                </div>
              </div>

              {/* Quick player buttons */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(scorerTeamSide === 'home' ? homePlayers : awayPlayers).slice(0, 12).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setScorerPlayerId(p.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      scorerPlayerId === p.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    {p.firstName.charAt(0)}. {p.lastName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSetHalfTime}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Pushim (Half-Time)
            </button>
            <button
              onClick={handleEndMatch}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <Square className="w-4 h-4" />
              Përfundo Ndeshjen
            </button>
          </div>

          {/* Goals Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Golat ({matchGoals.length})
            </h4>
            {matchGoals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nuk ka gola ende.</p>
            ) : (
              <div className="space-y-2">
                {matchGoals.sort((a, b) => a.minute - b.minute).map(g => {
                  const player = players.find(p => p.id === g.playerId);
                  const isHome = g.teamId === selectedMatch.homeTeamId;
                  return (
                    <div
                      key={g.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${isHome ? 'bg-blue-50' : 'bg-gray-50'}`}
                    >
                      <span className="text-xs font-bold text-gray-500 w-8">{g.minute}'</span>
                      <Target className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800 flex-1">
                        {player ? `${player.firstName} ${player.lastName}` : 'I panjohur'}
                        {g.isOwnGoal && <span className="text-red-500 ml-1">(AG)</span>}
                      </span>
                      <span className="text-xs text-gray-400">{isHome ? homeTeam?.name : awayTeam?.name}</span>
                      <button
                        onClick={() => {
                          if (confirm('Fshi golin?')) {
                            deleteGoal(g.id);
                            // Also update score
                            if (isHome) {
                              updateMatch({ ...selectedMatch, homeScore: Math.max(0, (selectedMatch.homeScore ?? 0) - 1) });
                            } else {
                              updateMatch({ ...selectedMatch, awayScore: Math.max(0, (selectedMatch.awayScore ?? 0) - 1) });
                            }
                          }
                        }}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Team Rosters Quick View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                {homeTeam?.name} ({homePlayers.length})
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {homePlayers.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                    {p.photo ? (
                      <img src={p.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>
                    )}
                    <span>{p.firstName} {p.lastName}</span>
                    {p.position && <span className="text-xs text-gray-400">({p.position})</span>}
                  </div>
                ))}
                {homePlayers.length === 0 && <p className="text-xs text-gray-400">Nuk ka lojtarë të regjistruar.</p>}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                {awayTeam?.name} ({awayPlayers.length})
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {awayPlayers.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm text-gray-600 py-1">
                    {p.photo ? (
                      <img src={p.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>
                    )}
                    <span>{p.firstName} {p.lastName}</span>
                    {p.position && <span className="text-xs text-gray-400">({p.position})</span>}
                  </div>
                ))}
                {awayPlayers.length === 0 && <p className="text-xs text-gray-400">Nuk ka lojtarë të regjistruar.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiveControl;
