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

let cache = { data: null, ts: 0 };
const TTL_MS = 5000;

export async function getAppData() {
  const now = Date.now();
  if (cache.data && (now - cache.ts) < TTL_MS) {
    return cache.data;
  }
  const { data, error } = await supabase
    .from('app_data').select('data').eq('key', 'main').single();
  if (error && error.code !== 'PGRST116') throw error;
  const result = data?.data || {};
  cache = { data: result, ts: now };
  return result;
}

export function invalidateCache() {
  cache = { data: null, ts: 0 };
}
