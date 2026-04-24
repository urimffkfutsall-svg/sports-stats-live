import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Season, Competition, Team, Player, Match, Goal, Scorer, PlayerOfWeek, User, StandingsRow, AppSettings, Decision, Video, News } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchAllData,
  dbSeasons, dbCompetitions, dbTeams, dbPlayers, dbMatches, dbGoals, dbScorers, dbPlayerOfWeek, dbUsers, dbSettings, dbDecisions,
  subscribeToMatches, subscribeToGoals, subscribeToTable,
  dbVisitors,
} from '@/lib/supabase-db';
import { dbVideos, dbNews
} from '@/lib/supabase-db';

interface DataState {
  seasons: Season[];
  competitions: Competition[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  goals: Goal[];
  scorers: Scorer[];
  playersOfWeek: PlayerOfWeek[];
  users: User[];
  decisions: Decision[];
  videos: Video[];
  news: News[];
  settings: AppSettings;
}

const defaultSettings: AppSettings = {
  appName: 'FFK Futsall',
  logo: 'https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png',
  contact: 'info@ffk-futsall.com'
};

const initialState: DataState = {
  seasons: [],
  competitions: [],
  teams: [],
  players: [],
  matches: [],
  goals: [],
  scorers: [],
  playersOfWeek: [],
  users: [],
  decisions: [],
  videos: [],
  news: [],
  settings: defaultSettings
};

// Helper to map a realtime payload row from snake_case to camelCase
function mapRealtimeRow(row: any): any {
  if (!row) return row;
  const map: Record<string, string> = {
    start_date: 'startDate', end_date: 'endDate', is_active: 'isActive',
    season_id: 'seasonId', is_active_landing: 'isActiveLanding', competition_id: 'competitionId',
    founded_year: 'foundedYear', team_id: 'teamId', first_name: 'firstName', last_name: 'lastName',
    birth_date: 'birthDate', home_team_id: 'homeTeamId', away_team_id: 'awayTeamId',
    home_score: 'homeScore', away_score: 'awayScore', is_featured_landing: 'isFeaturedLanding',
    match_id: 'matchId', player_id: 'playerId', is_own_goal: 'isOwnGoal', is_manual: 'isManual',
    is_scorer: 'isScorer', goals_count: 'goalsCount', possession_home: 'possessionHome',
    possession_away: 'possessionAway', shots_home: 'shotsHome', shots_away: 'shotsAway',
    fouls_home: 'foulsHome', fouls_away: 'foulsAway',
  };
  const result: any = {};
  for (const [key, val] of Object.entries(row)) {
    if (key === 'created_at') continue;
    result[map[key] || key] = val;
  }
  return result;
}

interface DataContextType extends DataState {
  isLoading: boolean;
  // Seasons
  addSeason: (s: Omit<Season, 'id'>) => string;
  updateSeason: (s: Season) => void;
  deleteSeason: (id: string) => void;
  getActiveSeason: () => Season | undefined;
  // Competitions
  addCompetition: (c: Omit<Competition, 'id'>) => string;
  updateCompetition: (c: Competition) => void;
  deleteCompetition: (id: string) => void;
  // Teams
  addTeam: (t: Omit<Team, 'id'>) => string;
  updateTeam: (t: Team) => void;
  deleteTeam: (id: string) => void;
  getTeamById: (id: string) => Team | undefined;
  getTeamsByCompetition: (compId: string) => Team[];
  // Players
  addPlayer: (p: Omit<Player, 'id'>) => string;
  updatePlayer: (p: Player) => void;
  deletePlayer: (id: string) => void;
  getPlayersByTeam: (teamId: string) => Player[];
  // Matches
  addMatch: (m: Omit<Match, 'id'>) => string;
  updateMatch: (m: Match) => void;
  deleteMatch: (id: string) => void;
  getMatchesByCompetition: (compId: string) => Match[];
  getMatchesByWeek: (compId: string, week: number) => Match[];
  getFeaturedMatches: () => Match[];
  // Goals
  addGoal: (g: Omit<Goal, 'id'>) => string;
  deleteGoal: (id: string) => void;
  getGoalsByMatch: (matchId: string) => Goal[];
  // Scorers
  addScorer: (s: Omit<Scorer, 'id'>) => string;
  updateScorer: (s: Scorer) => void;
  deleteScorer: (id: string) => void;
  getTopScorers: (compId?: string, limit?: number) => Scorer[];
  // Player of Week
  addPlayerOfWeek: (p: Omit<PlayerOfWeek, 'id'>) => void;
  updatePlayerOfWeek: (p: PlayerOfWeek) => void;
  deletePlayerOfWeek: (id: string) => void;
  getLatestPlayerOfWeek: () => PlayerOfWeek | undefined;
  // Users
  addUser: (u: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (u: User) => void;
  // Decisions
  addDecision: (d: Omit<Decision, 'id'>) => void;
  updateDecision: (d: Decision) => void;
  deleteDecision: (id: string) => void;
  // Settings
  updateSettings: (s: AppSettings) => void;
  // Standings
  calculateStandings: (compId: string) => StandingsRow[];
  // Aggregated scorers
  getAggregatedScorers: (compId?: string) => { firstName: string; lastName: string; photo: string; teamId: string; goals: number; id: string; competitionId: string }[];
  // Head to head
  getHeadToHead: (teamAId: string, teamBId: string) => { matches: Match[]; teamAWins: number; teamBWins: number; draws: number; teamAGoals: number; teamBGoals: number };
  // Refresh
  // Videos
  addVideo: (v: Omit<Video, 'id'>) => string;
  updateVideo: (v: Video) => void;
  deleteVideo: (id: string) => void;
  // News
  addNews: (n: Omit<News, 'id'>) => string;
  updateNews: (n: News) => void;
  deleteNews: (id: string) => void;
  addVideo, updateVideo, deleteVideo,
    addNews, updateNews, deleteNews,
    refreshData: () => Promise<void>;
}


const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DataState>(initialState);
  const [isLoading, setIsLoading] = useState(() => {
    // Try to load from cache instantly
    try {
      const cached = localStorage.getItem('ffk_cache_v2');
      if (cached) return false; // Don't show loading if we have cache
    } catch {}
    return true;
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const update = useCallback((fn: (prev: DataState) => DataState) => {
    setState(prev => fn(prev));
  }, []);

  // ============ CACHE HYDRATION ============
  useEffect(() => {
    try {
      const cached = localStorage.getItem('ffk_cache_v2');
      if (cached) {
        const d = JSON.parse(cached);
        setState(prev => ({
          ...prev,
          seasons: d.seasons || prev.seasons,
          competitions: d.competitions || prev.competitions,
          teams: d.teams || prev.teams,
          players: d.players || prev.players,
          matches: d.matches || prev.matches,
          goals: d.goals || prev.goals,
          scorers: d.scorers || prev.scorers,
          playersOfWeek: d.playersOfWeek || prev.playersOfWeek,
          decisions: d.decisions || prev.decisions,
          settings: d.settings || prev.settings,
          videos: d.videos || prev.videos,
          news: d.news || prev.news,
        }));
        setIsLoading(false);
      }
    } catch {}
  }, []);

  // ============ INITIAL LOAD ============
  const loadData = useCallback(async () => {
    try {
      const [data, videosData, newsData] = await Promise.all([
        fetchAllData(),
        dbVideos.getAll(),
        dbNews.getAll(),
      ]);
      setState({
        seasons: data.seasons,
        competitions: data.competitions,
        teams: data.teams,
        players: data.players,
        matches: data.matches,
        goals: data.goals,
        scorers: data.scorers,
        playersOfWeek: data.playersOfWeek,
        users: data.users.length > 0 ? [...data.users.filter((u: any) => u.username !== 'urimi1806'), { id: 'admin-main', username: 'urimi1806', password: '1806', role: 'admin' }] : [{ id: 'admin-main', username: 'urimi1806', password: '1806', role: 'admin' }],
        decisions: data.decisions || [],
        videos: (videosData || []) as Video[],
        news: (newsData || []) as News[],
        settings: data.settings,
      });
    // Cache data for faster next load
      try { localStorage.setItem('ffk_cache_v2', JSON.stringify({
        seasons: data.seasons, competitions: data.competitions, teams: data.teams,
        players: data.players, matches: data.matches, goals: data.goals,
        scorers: data.scorers, playersOfWeek: data.playersOfWeek,
        decisions: data.decisions || [], settings: data.settings,
        videos: videosData || [], news: newsData || [],
      })); } catch {}
    } catch (err) {
      console.error('Failed to load data from Supabase:', err);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('ffk_futsall_data');
        if (saved) setState(JSON.parse(saved));
      } catch { /* ignore */ }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Track visitor once per session
  useEffect(() => {
    try {
      const tracked = sessionStorage.getItem('visitor_tracked');
      if (!tracked) {
        dbVisitors.track().catch(() => {});
        sessionStorage.setItem('visitor_tracked', '1');
      }
    } catch {}
  }, []);

  // ============ REAL-TIME SUBSCRIPTIONS ============
  useEffect(() => {
    // Subscribe to matches for live updates
    const matchChannel = subscribeToMatches((payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      const mapped = newRow ? mapRealtimeRow(newRow) : null;
      
      setState(prev => {
        if (eventType === 'INSERT' && mapped) {
          // Only add if not already present (avoid duplicates from optimistic UI)
          if (prev.matches.find(m => m.id === mapped.id)) return prev;
          return { ...prev, matches: [...prev.matches, mapped as Match] };
        }
        if (eventType === 'UPDATE' && mapped) {
          return { ...prev, matches: prev.matches.map(m => m.id === mapped.id ? { ...m, ...mapped } as Match : m) };
        }
        if (eventType === 'DELETE' && oldRow) {
          return { ...prev, matches: prev.matches.filter(m => m.id !== oldRow.id) };
        }
        return prev;
      });
    });

    // Subscribe to goals for live updates
    const goalChannel = subscribeToGoals((payload) => {
      const { eventType, new: newRow, old: oldRow } = payload;
      const mapped = newRow ? mapRealtimeRow(newRow) : null;
      
      setState(prev => {
        if (eventType === 'INSERT' && mapped) {
          if (prev.goals.find(g => g.id === mapped.id)) return prev;
          return { ...prev, goals: [...prev.goals, mapped as Goal] };
        }
        if (eventType === 'UPDATE' && mapped) {
          return { ...prev, goals: prev.goals.map(g => g.id === mapped.id ? { ...g, ...mapped } as Goal : g) };
        }
        if (eventType === 'DELETE' && oldRow) {
          return { ...prev, goals: prev.goals.filter(g => g.id !== oldRow.id) };
        }
        return prev;
      });
    });

    // Subscribe to other tables
    const tables = ['seasons', 'competitions', 'teams', 'players', 'scorers', 'player_of_week', 'users', 'decisions'];
    const stateKeys: Record<string, keyof DataState> = {
      seasons: 'seasons', competitions: 'competitions', teams: 'teams', players: 'players',
      scorers: 'scorers', player_of_week: 'playersOfWeek', users: 'users', decisions: 'decisions',
    };
    
    const channels = tables.map(table => {
      return subscribeToTable(table, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        const mapped = newRow ? mapRealtimeRow(newRow) : null;
        const key = stateKeys[table];
        if (!key) return null;
        
        setState(prev => {
          const arr = prev[key] as any[];
          if (eventType === 'INSERT' && mapped) {
            if (arr.find((item: any) => item.id === mapped.id)) return prev;
            return { ...prev, [key]: [...arr, mapped] };
          }
          if (eventType === 'UPDATE' && mapped) {
            return { ...prev, [key]: arr.map((item: any) => item.id === mapped.id ? { ...item, ...mapped } : item) };
          }
          if (eventType === 'DELETE' && oldRow) {
            return { ...prev, [key]: arr.filter((item: any) => item.id !== oldRow.id) };
          }
          return prev;
        });
      });
    });

    return () => {
      matchChannel.unsubscribe();
      goalChannel.unsubscribe();
      channels.forEach(ch => ch.unsubscribe());
    };
  }, []);

  // ============ SEASONS ============
  const addSeason = (s: Omit<Season, 'id'>): string => {
    const newSeason: Season = { ...s, id: uuidv4() };
    update(prev => {
      let seasons = s.isActive
        ? prev.seasons.map(x => ({ ...x, isActive: false }))
        : [...prev.seasons];
      if (s.isActive) {
        dbSeasons.deactivateAll();
      }
      return { ...prev, seasons: [...(s.isActive ? seasons : prev.seasons), newSeason] };
    });
    dbSeasons.add(newSeason);
    return newSeason.id;
  };


  const updateSeason = (s: Season) => {
    update(prev => {
      let seasons = prev.seasons.map(x => x.id === s.id ? s : x);
      if (s.isActive) {
        seasons = seasons.map(x => x.id === s.id ? x : { ...x, isActive: false });
        dbSeasons.deactivateAll();
      }
      return { ...prev, seasons };
    });
    dbSeasons.update(s);
  };

  const deleteSeason = (id: string) => {
    update(prev => ({ ...prev, seasons: prev.seasons.filter(x => x.id !== id) }));
    dbSeasons.delete(id);
  };

  const getActiveSeason = () => state.seasons.find(s => s.isActive);

  // ============ COMPETITIONS ============
  const addCompetition = (c: Omit<Competition, 'id'>): string => {
    const newComp: Competition = { ...c, id: uuidv4() };
    update(prev => ({ ...prev, competitions: [...prev.competitions, newComp] }));
    dbCompetitions.add(newComp);
    return newComp.id;
  };

  const updateCompetition = (c: Competition) => {
    update(prev => ({ ...prev, competitions: prev.competitions.map(x => x.id === c.id ? c : x) }));
    dbCompetitions.update(c);
  };

  const deleteCompetition = (id: string) => {
    update(prev => ({ ...prev, competitions: prev.competitions.filter(x => x.id !== id) }));
    dbCompetitions.delete(id);
  };

  // ============ TEAMS ============
  const addTeam = (t: Omit<Team, 'id'>): string => {
    const newTeam: Team = { ...t, id: uuidv4() };
    update(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
    dbTeams.add(newTeam);
    return newTeam.id;
  };

  const updateTeam = (t: Team) => {
    update(prev => ({ ...prev, teams: prev.teams.map(x => x.id === t.id ? t : x) }));
    dbTeams.update(t);
  };

  const deleteTeam = (id: string) => {
    update(prev => ({ ...prev, teams: prev.teams.filter(x => x.id !== id) }));
    dbTeams.delete(id);
  };

  const getTeamById = (id: string) => state.teams.find(t => t.id === id);
  const getTeamsByCompetition = (compId: string) => state.teams.filter(t => t.competitionId === compId);

  // ============ PLAYERS ============
  const addPlayer = (p: Omit<Player, 'id'>): string => {
    const newPlayer: Player = { ...p, id: uuidv4() };
    update(prev => ({ ...prev, players: [...prev.players, newPlayer] }));
    dbPlayers.add(newPlayer);
    return newPlayer.id;
  };

  const updatePlayer = (p: Player) => {
    update(prev => ({ ...prev, players: prev.players.map(x => x.id === p.id ? p : x) }));
    dbPlayers.update(p);
  };

  const deletePlayer = (id: string) => {
    update(prev => ({ ...prev, players: prev.players.filter(x => x.id !== id) }));
    dbPlayers.delete(id);
  };

  const getPlayersByTeam = (teamId: string) => state.players.filter(p => p.teamId === teamId);

  // ============ MATCHES ============
  const addMatch = (m: Omit<Match, 'id'>): string => {
    const newMatch: Match = { ...m, id: uuidv4() };
    update(prev => ({ ...prev, matches: [...prev.matches, newMatch] }));
    dbMatches.add(newMatch);
    return newMatch.id;
  };

  const updateMatch = (m: Match) => {
    update(prev => ({ ...prev, matches: prev.matches.map(x => x.id === m.id ? m : x) }));
    dbMatches.update(m);
  };

  const deleteMatch = (id: string) => {
    update(prev => ({ ...prev, matches: prev.matches.filter(x => x.id !== id) }));
    dbMatches.delete(id);
  };

  const getMatchesByCompetition = (compId: string) => state.matches.filter(m => m.competitionId === compId);
  const getMatchesByWeek = (compId: string, week: number) => state.matches.filter(m => m.competitionId === compId && m.week === week);
  const getFeaturedMatches = () => state.matches.filter(m => m.isFeaturedLanding);

  // ============ GOALS ============
  const addGoal = (g: Omit<Goal, 'id'>): string => {
    const newGoal: Goal = { ...g, id: uuidv4() };
    update(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    dbGoals.add(newGoal);
    return newGoal.id;
  };

  const deleteGoal = (id: string) => {
    update(prev => ({ ...prev, goals: prev.goals.filter(x => x.id !== id) }));
    dbGoals.delete(id);
  };

  const getGoalsByMatch = (matchId: string) => state.goals.filter(g => g.matchId === matchId);

  // ============ SCORERS ============
  const addScorer = (s: Omit<Scorer, 'id'>): string => {
    const newScorer: Scorer = { ...s, id: uuidv4() };
    update(prev => ({ ...prev, scorers: [...prev.scorers, newScorer] }));
    dbScorers.add(newScorer);
    return newScorer.id;
  };


  const updateScorer = (s: Scorer) => {
    update(prev => ({ ...prev, scorers: prev.scorers.map(x => x.id === s.id ? s : x) }));
    dbScorers.update(s);
  };

  const deleteScorer = (id: string) => {
    update(prev => ({ ...prev, scorers: prev.scorers.filter(x => x.id !== id) }));
    dbScorers.delete(id);
  };

  const getTopScorers = (compId?: string, limit?: number) => {
    let list = state.scorers;
    if (compId) list = list.filter(s => s.competitionId === compId);
    list = [...list].sort((a, b) => b.goals - a.goals);
    if (limit) list = list.slice(0, limit);
    return list;
  };

  // Aggregated scorers from goals + manual scorers
  const getAggregatedScorers = (compId?: string) => {
    const goalMap: Record<string, { firstName: string; lastName: string; photo: string; teamId: string; goals: number; competitionId: string }> = {};
    
    state.goals.forEach(g => {
      if (g.isOwnGoal) return null;
      const player = state.players.find(p => p.id === g.playerId);
      if (!player) return null;
      const match = state.matches.find(m => m.id === g.matchId);
      if (!match) return null;
      if (compId && match.competitionId !== compId) return null;
      const key = `goal_${g.playerId}_${match.competitionId}`;
      if (!goalMap[key]) {
        goalMap[key] = { firstName: player.firstName, lastName: player.lastName, photo: player.photo, teamId: player.teamId, goals: 0, competitionId: match.competitionId };
      }
      goalMap[key].goals++;
    });

    let manualScorers = state.scorers.filter(s => s.isManual);
    if (compId) manualScorers = manualScorers.filter(s => s.competitionId === compId);

    const result: { firstName: string; lastName: string; photo: string; teamId: string; goals: number; id: string; competitionId: string }[] = [];
    
    Object.entries(goalMap).forEach(([key, val]) => {
      result.push({ ...val, id: key });
    });

    manualScorers.forEach(s => {
      const existing = result.find(r => r.firstName === s.firstName && r.lastName === s.lastName && r.teamId === s.teamId && r.competitionId === s.competitionId);
      if (existing) {
        existing.goals += s.goals;
      } else {
        result.push({ firstName: s.firstName, lastName: s.lastName, photo: s.photo, teamId: s.teamId, goals: s.goals, id: s.id, competitionId: s.competitionId });
      }
    });

    return result.sort((a, b) => b.goals - a.goals);
  };

  // ============ PLAYER OF WEEK ============
  const addPlayerOfWeek = (p: Omit<PlayerOfWeek, 'id'>) => {
    const newPow: PlayerOfWeek = { ...p, id: uuidv4() };
    update(prev => ({ ...prev, playersOfWeek: [...prev.playersOfWeek, newPow] }));
    dbPlayerOfWeek.add(newPow);
  };

  const updatePlayerOfWeek = (p: PlayerOfWeek) => {
    update(prev => ({ ...prev, playersOfWeek: prev.playersOfWeek.map(x => x.id === p.id ? p : x) }));
    dbPlayerOfWeek.update(p);
  };

  const deletePlayerOfWeek = (id: string) => {
    update(prev => ({ ...prev, playersOfWeek: prev.playersOfWeek.filter(x => x.id !== id) }));
    dbPlayerOfWeek.delete(id);
  };

  const getLatestPlayerOfWeek = () => {
    const activeSeason = state.seasons.find(s => s.isActive);
    if (!activeSeason) return state.playersOfWeek.sort((a, b) => b.week - a.week)[0];
    const filtered = state.playersOfWeek.filter(p => p.seasonId === activeSeason.id);
    return filtered.sort((a, b) => b.week - a.week)[0];
  };

  // ============ USERS ============
  const addUser = (u: Omit<User, 'id'>) => {
    const newUser: User = { ...u, id: uuidv4() };
    update(prev => ({ ...prev, users: [...prev.users, newUser] }));
    dbUsers.add(newUser);
  };

  const deleteUser = (id: string) => {
    update(prev => ({ ...prev, users: prev.users.filter(x => x.id !== id) }));
    dbUsers.delete(id);
  };

  const updateUser = (u: User) => {
    update(prev => ({ ...prev, users: prev.users.map(x => x.id === u.id ? u : x) }));
    dbUsers.update(u);
  };

    // ============ DECISIONS ============
  const addDecision = (d: Omit<Decision, 'id'>) => {
    const newDec: Decision = { ...d, id: uuidv4() };
    update(prev => ({ ...prev, decisions: [...prev.decisions, newDec] }));
    dbDecisions.add(newDec);
  };

  const updateDecision = (d: Decision) => {
    update(prev => ({ ...prev, decisions: prev.decisions.map(x => x.id === d.id ? d : x) }));
    dbDecisions.update(d);
  };

  const deleteDecision = (id: string) => {
    update(prev => ({ ...prev, decisions: prev.decisions.filter(x => x.id !== id) }));
    dbDecisions.delete(id);
  };

  // ============ SETTINGS ============
  const updateSettings = (s: AppSettings) => {
    update(prev => ({ ...prev, settings: s }));
    dbSettings.update(s);
  };

  // ============ STANDINGS ============
  const calculateStandings = (compId: string): StandingsRow[] => {
    const teams = state.teams.filter(t => t.competitionId === compId);
    const matches = state.matches.filter(m => m.competitionId === compId && m.status === 'finished');
    
    const rows: StandingsRow[] = teams.map(t => ({
      teamId: t.id,
      teamName: t.name,
      teamLogo: t.logo,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: []
    }));

    matches.forEach(m => {
      const home = rows.find(r => r.teamId === m.homeTeamId);
      const away = rows.find(r => r.teamId === m.awayTeamId);
      if (!home || !away) return null;
      const hs = m.homeScore ?? 0;
      const as_ = m.awayScore ?? 0;
      
      home.played++; away.played++;
      home.goalsFor += hs; home.goalsAgainst += as_;
      away.goalsFor += as_; away.goalsAgainst += hs;

      if (hs > as_) {
        home.won++; home.points += 3; away.lost++;
        home.form.push('W'); away.form.push('L');
      } else if (hs < as_) {
        away.won++; away.points += 3; home.lost++;
        home.form.push('L'); away.form.push('W');
      } else {
        home.drawn++; away.drawn++; home.points++; away.points++;
        home.form.push('D'); away.form.push('D');
      }
    });

    rows.forEach(r => {
      r.goalDifference = r.goalsFor - r.goalsAgainst;
      r.form = r.form.slice(-5);
    });

    return rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });
  };

  // ============ HEAD TO HEAD ============
  const getHeadToHead = (teamAId: string, teamBId: string) => {
    const h2hMatches = state.matches.filter(m =>
      m.status === 'finished' &&
      ((m.homeTeamId === teamAId && m.awayTeamId === teamBId) ||
       (m.homeTeamId === teamBId && m.awayTeamId === teamAId))
    );
    let teamAWins = 0, teamBWins = 0, draws = 0, teamAGoals = 0, teamBGoals = 0;
    h2hMatches.forEach(m => {
      const hs = m.homeScore ?? 0;
      const as_ = m.awayScore ?? 0;
      if (m.homeTeamId === teamAId) {
        teamAGoals += hs; teamBGoals += as_;
        if (hs > as_) teamAWins++;
        else if (hs < as_) teamBWins++;
        else draws++;
      } else {
        teamAGoals += as_; teamBGoals += hs;
        if (as_ > hs) teamAWins++;
        else if (as_ < hs) teamBWins++;
        else draws++;
      }
    });
    return { matches: h2hMatches, teamAWins, teamBWins, draws, teamAGoals, teamBGoals };
  };

  
  // ============ VIDEOS ============
  const addVideo = (v: Omit<Video, 'id'>) => {
    const id = uuidv4();
    const item = { ...v, id } as Video;
    setState(p => ({ ...p, videos: [item, ...p.videos] }));
    dbVideos.upsert(item).catch(console.error);
    return id;
  };
  const updateVideo = (v: Video) => {
    setState(p => ({ ...p, videos: p.videos.map(x => x.id === v.id ? v : x) }));
    dbVideos.upsert(v).catch(console.error);
  };
  const deleteVideo = (id: string) => {
    setState(p => ({ ...p, videos: p.videos.filter(x => x.id !== id) }));
    dbVideos.remove(id).catch(console.error);
  };

  // ============ NEWS ============
  const addNews = (n: Omit<News, 'id'>) => {
    const id = uuidv4();
    const item = { ...n, id } as News;
    setState(p => ({ ...p, news: [item, ...p.news] }));
    dbNews.upsert(item).catch(console.error);
    return id;
  };
  const updateNews = (n: News) => {
    setState(p => ({ ...p, news: p.news.map(x => x.id === n.id ? n : x) }));
    dbNews.upsert(n).catch(console.error);
  };
  const deleteNews = (id: string) => {
    setState(p => ({ ...p, news: p.news.filter(x => x.id !== id) }));
    dbNews.remove(id).catch(console.error);
  };

  const refreshData = loadData;

  const value: DataContextType = {
    ...state,
    isLoading,
    addSeason, updateSeason, deleteSeason, getActiveSeason,
    addCompetition, updateCompetition, deleteCompetition,
    addTeam, updateTeam, deleteTeam, getTeamById, getTeamsByCompetition,
    addPlayer, updatePlayer, deletePlayer, getPlayersByTeam,
    addMatch, updateMatch, deleteMatch, getMatchesByCompetition, getMatchesByWeek, getFeaturedMatches,
    addGoal, deleteGoal, getGoalsByMatch,
    addScorer, updateScorer, deleteScorer, getTopScorers,
    getAggregatedScorers,
    addPlayerOfWeek, updatePlayerOfWeek, deletePlayerOfWeek, getLatestPlayerOfWeek,
    addUser, deleteUser, updateUser,
    addDecision, updateDecision, deleteDecision,
    updateSettings,
    calculateStandings,
    getHeadToHead,
    addVideo, updateVideo, deleteVideo,
    addNews, updateNews, deleteNews,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
