import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(express.json({ limit: '15mb' }));

const DEFAULT_BLOB = {
  seasons: [], competitions: [], teams: [], players: [], matches: [], goals: [],
  scorers: [], playersOfWeek: [], users: [], decisions: [], videos: [], news: [],
  settings: { appName: 'FFK Futsall', logo: '', contact: 'info@ffk-futsall.com' },
  shortiSuperliga: [], shortiLigaPare: [],
  nationalPlayers: [], nationalMatches: [], nationalStaff: [],
  ntCompetitions: [], ntGroups: [], ntGroupTeams: [], ntGroupMatches: [], ntActivities: [],
  ffkMoments: [], liveStreams: [], playoffSeries: [], playoffMatches: [],
};

app.get('/api/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_data').select('data').eq('key', 'main').single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ ...DEFAULT_BLOB, ...(data?.data || {}) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/data', async (req, res) => {
  try {
    const { error } = await supabase.from('app_data').upsert(
      { key: 'main', data: req.body, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) throw error;
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const LIGHT_FIELDS = new Set(['matches','goals','seasons','competitions','scorers','playersOfWeek','users','decisions']);
app.get('/api/live', async (req, res) => {
  const field = String(req.query.field || 'matches');
  if (!LIGHT_FIELDS.has(field)) return res.status(400).json({ error: `Fusha "${field}" nuk lejohet` });
  try {
    const { data, error } = await supabase
      .from('app_data').select('data').eq('key', 'main').single();
    if (error && error.code !== 'PGRST116') throw error;
    res.set('Cache-Control', 'no-store');
    res.status(200).json(data?.data?.[field] || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const { error } = await supabase.from('visitors')
      .insert({ ...req.body, visited_at: req.body.visited_at || new Date().toISOString() });
    if (error) throw error;
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/visitors', async (req, res) => {
  try {
    const { data: all, error } = await supabase
      .from('visitors').select('*').order('visited_at', { ascending: false }).limit(500);
    if (error) throw error;
    if (req.query.stats) {
      const today = new Date().toISOString().split('T')[0];
      const todayV = all.filter(v => (v.visited_at || '').startsWith(today));
      const uniqueIPs = new Set(all.map(v => v.ip));
      const uniqueToday = new Set(todayV.map(v => v.ip));
      return res.status(200).json({
        total: all.length, unique: uniqueIPs.size,
        today: todayV.length, uniqueToday: uniqueToday.size,
        recent: all.slice(0, 50),
      });
    }
    res.status(200).json(all);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const NOTIF_MAX_AGE_MS = 2 * 60 * 60 * 1000;
app.post('/api/notifications', async (req, res) => {
  const { event, payload } = req.body || {};
  if (!event) return res.status(400).json({ error: 'Mungon "event"' });
  try {
    const { error } = await supabase.from('notifications')
      .insert({ event, payload: payload || {}, created_at: new Date().toISOString() });
    if (error) throw error;
    const cutoff = new Date(Date.now() - NOTIF_MAX_AGE_MS).toISOString();
    supabase.from('notifications').delete().lt('created_at', cutoff).then(() => {});
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const since = req.query.since || new Date(0).toISOString();
    const { data: docs, error } = await supabase.from('notifications')
      .select('event, payload, created_at')
      .gt('created_at', since).order('created_at', { ascending: true }).limit(100);
    if (error) throw error;
    res.status(200).json(docs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server po degjon ne portin ${PORT}`));
