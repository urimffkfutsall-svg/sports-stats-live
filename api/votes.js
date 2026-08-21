import { supabase } from './_supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { matchId } = req.query;
      if (!matchId) {
        res.status(400).json({ error: 'Mungon matchId' });
        return;
      }
      const { data, error } = await supabase
        .from('match_votes')
        .select('choice')
        .eq('match_id', matchId);
      if (error) throw error;

      const counts = { home: 0, draw: 0, away: 0 };
      (data || []).forEach((row) => {
        if (counts[row.choice] !== undefined) counts[row.choice]++;
      });
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json(counts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { matchId, choice, voterId } = req.body || {};
      if (!matchId || !choice || !voterId) {
        res.status(400).json({ error: 'Mungon matchId, choice ose voterId' });
        return;
      }
      if (!['home', 'draw', 'away'].includes(choice)) {
        res.status(400).json({ error: 'choice duhet te jete home, draw ose away' });
        return;
      }

      const { error } = await supabase.from('match_votes').upsert(
        { match_id: matchId, choice, voter_id: voterId },
        { onConflict: 'match_id,voter_id' }
      );
      if (error) throw error;

      const { data, error: countErr } = await supabase
        .from('match_votes')
        .select('choice')
        .eq('match_id', matchId);
      if (countErr) throw countErr;

      const counts = { home: 0, draw: 0, away: 0 };
      (data || []).forEach((row) => {
        if (counts[row.choice] !== undefined) counts[row.choice]++;
      });
      res.status(200).json({ ok: true, counts });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
