import { supabase } from './supabase';
import { Season, Competition, Team, Player, Match, Goal, Scorer, PlayerOfWeek, User, AppSettings, Decision } from '@/types';

// ============ COLUMN MAPPING ============

function toSnake(obj: Record<string, any>): Record<string, any> {
  const map: Record<string, string> = {
    startDate: 'start_date',
    endDate: 'end_date',
    isActive: 'is_active',
    seasonId: 'season_id',
    isActiveLanding: 'is_active_landing',
    competitionId: 'competition_id',
    foundedYear: 'founded_year',
    teamId: 'team_id',
    firstName: 'first_name',
    lastName: 'last_name',
    birthDate: 'birth_date',
    homeTeamId: 'home_team_id',
    awayTeamId: 'away_team_id',
    homeScore: 'home_score',
    awayScore: 'away_score',
    isFeaturedLanding: 'is_featured_landing',
    isFeatured: 'is_featured',
    matchId: 'match_id',
    playerId: 'player_id',
    isOwnGoal: 'is_own_goal',
    isManual: 'is_manual',
    isScorer: 'is_scorer',
    goalsCount: 'goals_count',
    possessionHome: 'possession_home',
    possessionAway: 'possession_away',
    shotsHome: 'shots_home',
    shotsAway: 'shots_away',
    foulsHome: 'fouls_home',
    foulsAway: 'fouls_away',
    opponentLogo: 'opponent_logo',
    isHome: 'is_home',
    createdAt: 'created_at',
    liveUrl: 'live_url',
  };
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'created_at') continue;
    const snakeKey = map[key] || key;
    result[snakeKey] = val;
  }
  return result;
}

function toCamel(obj: Record<string, any>): Record<string, any> {
  const map: Record<string, string> = {
    start_date: 'startDate',
    end_date: 'endDate',
    is_active: 'isActive',
    season_id: 'seasonId',
    is_active_landing: 'isActiveLanding',
    competition_id: 'competitionId',
    founded_year: 'foundedYear',
    team_id: 'teamId',
    first_name: 'firstName',
    last_name: 'lastName',
    birth_date: 'birthDate',
    home_team_id: 'homeTeamId',
    away_team_id: 'awayTeamId',
    home_score: 'homeScore',
    away_score: 'awayScore',
    is_featured_landing: 'isFeaturedLanding',
    is_featured: 'isFeatured',
    match_id: 'matchId',
    player_id: 'playerId',
    is_own_goal: 'isOwnGoal',
    is_manual: 'isManual',
    is_scorer: 'isScorer',
    goals_count: 'goalsCount',
    possession_home: 'possessionHome',
    possession_away: 'possessionAway',
    shots_home: 'shotsHome',
    shots_away: 'shotsAway',
    fouls_home: 'foulsHome',
    fouls_away: 'foulsAway',
    opponent_logo: 'opponentLogo',
    is_home: 'isHome',
    created_at: 'createdAt',
    live_url: 'liveUrl',
  };
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'created_at') continue;
    const camelKey = map[key] || key;
    result[camelKey] = val;
  }
  return result;
}

function mapRows<T>(rows: any[]): T[] {
  return (rows || []).map(r => toCamel(r) as T);
}

// ============ FETCH ALL DATA ============

export async function fetchAllData() {
  const [
    seasonsRes,
    competitionsRes,
    teamsRes,
    playersRes,
    matchesRes,
    goalsRes,
    scorersRes,
    powRes,
    usersRes,
    settingsRes,
    decisionsRes,
    nationalPlayersRes,
    nationalMatchesRes,
  ] = await Promise.all([
    supabase.from('seasons').select('*').order('created_at', { ascending: false }),
    supabase.from('competitions').select('*').order('created_at', { ascending: true }),
    supabase.from('teams').select('*').order('name', { ascending: true }),
    supabase.from('players').select('*').order('last_name', { ascending: true }),
    supabase.from('matches').select('*').order('created_at', { ascending: true }),
    supabase.from('goals').select('*').order('minute', { ascending: true }),
    supabase.from('scorers').select('*').order('goals', { ascending: false }),
    supabase.from('player_of_week').select('*').order('week', { ascending: false }),
    supabase.from('users').select('*'),
    supabase.from('app_settings').select('*'),
    supabase.from('decisions').select('*').order('week', { ascending: false }),
    supabase.from('national_team_players').select('*').order('last_name', { ascending: true }),
    supabase.from('national_team_matches').select('*').order('date', { ascending: false }),
  ]);

  const settings: AppSettings = {
    appName: 'FFK Futsall',
    logo: 'https://d64gsuwffb70l.cloudfront.net/69b1c5d3aa33715dda5ad3a9_1773258315744_b173e8af.png',
    contact: 'info@ffk-futsall.com',
  };
  (settingsRes.data || []).forEach((s: any) => {
    if (s.key === 'appName') settings.appName = s.value;
    if (s.key === 'logo') settings.logo = s.value;
    if (s.key === 'contact') settings.contact = s.value;
  });

  return {
    seasons: mapRows<Season>(seasonsRes.data || []),
    competitions: mapRows<Competition>(competitionsRes.data || []),
    teams: mapRows<Team>(teamsRes.data || []),
    players: mapRows<Player>(playersRes.data || []),
    matches: mapRows<Match>(matchesRes.data || []),
    goals: mapRows<Goal>(goalsRes.data || []),
    scorers: mapRows<Scorer>(scorersRes.data || []),
    playersOfWeek: mapRows<PlayerOfWeek>(powRes.data || []),
    users: mapRows<User>(usersRes.data || []),
    decisions: mapRows<Decision>(decisionsRes?.data || []),
    settings,
    nationalPlayers: mapRows<any>(nationalPlayersRes.data || []),
    nationalMatches: mapRows<any>(nationalMatchesRes.data || []),
  };
}

// ============ CRUD OPERATIONS ============

// Generic insert
async function dbInsert(table: string, data: Record<string, any>) {
  const snakeData = toSnake(data);
  const { error } = await supabase.from(table).insert(snakeData);
  if (error) console.error(`Insert ${table} error:`, error);
  return !error;
}

// Generic update
async function dbUpdate(table: string, id: string, data: Record<string, any>) {
  const snakeData = toSnake(data);
  delete snakeData.id;
  const { error } = await supabase.from(table).update(snakeData).eq('id', id);
  if (error) console.error(`Update ${table} error:`, error);
  return !error;
}

// Generic delete
async function dbDelete(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) console.error(`Delete ${table} error:`, error);
  return !error;
}

// ============ SEASONS ============
export const dbSeasons = {
  add: (s: Season) => dbInsert('seasons', s),
  update: (s: Season) => dbUpdate('seasons', s.id, s),
  delete: (id: string) => dbDelete('seasons', id),
  deactivateAll: async () => {
    const { error } = await supabase.from('seasons').update({ is_active: false }).eq('is_active', true);
    if (error) console.error('Deactivate seasons error:', error);
  },
};

// ============ COMPETITIONS ============
export const dbCompetitions = {
  add: (c: Competition) => dbInsert('competitions', c),
  update: (c: Competition) => dbUpdate('competitions', c.id, c),
  delete: (id: string) => dbDelete('competitions', id),
};

// ============ TEAMS ============
export const dbTeams = {
  add: (t: Team) => dbInsert('teams', t),
  update: (t: Team) => dbUpdate('teams', t.id, t),
  delete: (id: string) => dbDelete('teams', id),
};

// ============ PLAYERS ============
export const dbPlayers = {
  add: (p: Player) => dbInsert('players', p),
  update: (p: Player) => dbUpdate('players', p.id, p),
  delete: (id: string) => dbDelete('players', id),
};

// ============ MATCHES ============
export const dbMatches = {
  add: (m: Match) => dbInsert('matches', m),
  update: (m: Match) => dbUpdate('matches', m.id, m),
  delete: (id: string) => dbDelete('matches', id),
};

// ============ GOALS ============
export const dbGoals = {
  add: (g: Goal) => dbInsert('goals', g),
  delete: (id: string) => dbDelete('goals', id),
};

// ============ SCORERS ============
export const dbScorers = {
  add: (s: Scorer) => dbInsert('scorers', s),
  update: (s: Scorer) => dbUpdate('scorers', s.id, s),
  delete: (id: string) => dbDelete('scorers', id),
};

// ============ PLAYER OF WEEK ============
export const dbPlayerOfWeek = {
  add: (p: PlayerOfWeek) => dbInsert('player_of_week', p),
  update: (p: PlayerOfWeek) => dbUpdate('player_of_week', p.id, p),
  delete: (id: string) => dbDelete('player_of_week', id),
};

// ============ USERS ============
export const dbUsers = {
  add: (u: User) => dbInsert('users', u),
  update: (u: User) => dbUpdate('users', u.id, u),
  delete: (id: string) => dbDelete('users', id),
};

// ============ DECISIONS ============
export const dbDecisions = {
  add: (d: Decision) => dbInsert('decisions', d),
  update: (d: Decision) => dbUpdate('decisions', d.id, d),
  delete: (id: string) => dbDelete('decisions', id),
};

// ============ SETTINGS ============
export const dbSettings = {
  update: async (settings: AppSettings) => {
    const entries = [
      { key: 'appName', value: settings.appName },
      { key: 'logo', value: settings.logo },
      { key: 'contact', value: settings.contact },
    ];
    for (const entry of entries) {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: entry.key, value: entry.value }, { onConflict: 'key' });
      if (error) console.error('Settings update error:', error);
    }
  },
};

// ============ FILE UPLOAD ============

export async function uploadTeamLogo(file: File, teamId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${teamId}.${ext}`;
  
  // Remove old file if exists
  await supabase.storage.from('team-logos').remove([path]);
  
  const { error } = await supabase.storage.from('team-logos').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  
  if (error) {
    console.error('Logo upload error:', error);
    // Fallback: convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsDataURL(file);
    });
  }
  
  const { data } = supabase.storage.from('team-logos').getPublicUrl(path);
  return data.publicUrl + '?t=' + Date.now();
}

export async function uploadPlayerPhoto(file: File, playerId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${playerId}.${ext}`;
  
  await supabase.storage.from('player-photos').remove([path]);
  
  const { error } = await supabase.storage.from('player-photos').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  
  if (error) {
    console.error('Photo upload error:', error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsDataURL(file);
    });
  }
  
  const { data } = supabase.storage.from('player-photos').getPublicUrl(path);
  return data.publicUrl + '?t=' + Date.now();
}

// ============ REAL-TIME SUBSCRIPTION ============

export function subscribeToMatches(callback: (payload: any) => void) {
  const channel = supabase
    .channel('matches-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, callback)
    .subscribe();
  return channel;
}

export function subscribeToGoals(callback: (payload: any) => void) {
  const channel = supabase
    .channel('goals-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, callback)
    .subscribe();
  return channel;
}

export function subscribeToTable(table: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`${table}-realtime`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
  return channel;
}

// ============ BROADCAST CHANNEL (Notifications) ============

let notificationChannel: any = null;

export function getNotificationChannel() {
  if (!notificationChannel) {
    notificationChannel = supabase.channel('notifications-broadcast');
    notificationChannel.subscribe();
  }
  return notificationChannel;
}

export function broadcastNotification(event: string, payload: any) {
  const channel = getNotificationChannel();
  channel.send({
    type: 'broadcast',
    event,
    payload,
  });
}

export function onNotification(event: string, callback: (payload: any) => void) {
  const channel = getNotificationChannel();
  channel.on('broadcast', { event }, (msg: any) => {
    callback(msg.payload);
  });
  return channel;
}

// ============ NATIONAL TEAM PLAYERS ============
export const dbNationalPlayers = {
  add: (p: any) => dbInsert('national_team_players', p),
  update: (p: any) => dbUpdate('national_team_players', p.id, p),
  delete: (id: string) => dbDelete('national_team_players', id),
};

// ============ NATIONAL TEAM MATCHES ============
export const dbNationalMatches = {
  add: (m: any) => dbInsert('national_team_matches', m),
  update: (m: any) => dbUpdate('national_team_matches', m.id, m),
  delete: (id: string) => dbDelete('national_team_matches', id),
};







// ============ VIDEOS ============
export const dbVideos = {
  async getAll() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('videos').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('videos').delete().eq('id', id);
  }
};

// ============ NEWS ============
export const dbNews = {
  async getAll() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('news').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('news').delete().eq('id', id);
  }
};
