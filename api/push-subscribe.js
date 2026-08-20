import { supabase } from './_supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { endpoint, keys, userAgent } = req.body || {};
      if (!endpoint || !keys?.p256dh || !keys?.auth) {
        res.status(400).json({ error: 'Mungon endpoint ose keys (p256dh/auth)' });
        return;
      }
      const { error } = await supabase.from('push_subscriptions').upsert(
        {
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: userAgent || '',
        },
        { onConflict: 'endpoint' }
      );
      if (error) throw error;
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const { endpoint } = req.body || {};
      if (!endpoint) {
        res.status(400).json({ error: 'Mungon endpoint' });
        return;
      }
      const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
      if (error) throw error;
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
