import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const DEFAULT_BLOB = {
  seasons: [], competitions: [], teams: [], players: [], matches: [], goals: [],
  scorers: [], playersOfWeek: [], users: [], decisions: [], videos: [], news: [],
  settings: { appName: 'FFK Futsall', logo: '', contact: 'info@ffk-futsall.com' },
  shortiSuperliga: [], shortiLigaPare: [],
  nationalPlayers: [], nationalMatches: [], nationalStaff: [],
  ntCompetitions: [], ntGroups: [], ntGroupTeams: [], ntGroupMatches: [], ntActivities: [],
  ffkMoments: [], liveStreams: [], playoffSeries: [], playoffMatches: [],
};
