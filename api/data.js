import { supabase, getAppData, DEFAULT_BLOB, invalidateCache } from './_supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await getAppData();
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json({ ...DEFAULT_BLOB, ...data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { error } = await supabase.from('app_data').upsert(
        { key: 'main', data: req.body, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      if (error) throw error;
      invalidateCache();
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
