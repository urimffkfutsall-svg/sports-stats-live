import React, { useState, useEffect } from 'react';

interface MatchVoteWidgetProps {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
}

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || '/api';

function getVoterId(): string {
  const key = 'ffk_voter_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

const MatchVoteWidget: React.FC<MatchVoteWidgetProps> = ({ matchId, homeTeamName, awayTeamName }) => {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<{ home: number; draw: number; away: number } | null>(null);
  const [myChoice, setMyChoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`ffk_vote_${matchId}`);
    if (saved) setMyChoice(saved);
  }, [matchId]);

  const loadCounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/votes?matchId=${encodeURIComponent(matchId)}`);
      if (res.ok) setCounts(await res.json());
    } catch {}
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(o => !o);
    if (!counts) loadCounts();
  };

  const handleVote = async (choice: 'home' | 'draw' | 'away', e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const voterId = getVoterId();
      const res = await fetch(`${API_BASE}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, choice, voterId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts);
        setMyChoice(choice);
        localStorage.setItem(`ffk_vote_${matchId}`, choice);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const total = counts ? counts.home + counts.draw + counts.away : 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-center gap-1 py-1.5 mt-1.5 bg-[#d0a650]/10 hover:bg-[#d0a650]/20 text-[#a97e2f] text-[10px] font-bold rounded-lg transition-colors uppercase tracking-wider"
      >
        Kush mendon se fiton?
      </button>

      {open && (
        <div className="mt-2 space-y-1.5">
          {!myChoice ? (
            <>
              <button
                onClick={e => handleVote('home', e)}
                disabled={loading}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#2a499a] hover:bg-[#2a499a]/10 transition-colors disabled:opacity-50"
              >
                <span className="truncate">{homeTeamName}</span>
                <span className="text-gray-300">circ</span>
              </button>
              <button
                onClick={e => handleVote('draw', e)}
                disabled={loading}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#2a499a] hover:bg-[#2a499a]/10 transition-colors disabled:opacity-50"
              >
                <span>Barazim</span>
                <span className="text-gray-300">circ</span>
              </button>
              <button
                onClick={e => handleVote('away', e)}
                disabled={loading}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#2a499a] hover:bg-[#2a499a]/10 transition-colors disabled:opacity-50"
              >
                <span className="truncate">{awayTeamName}</span>
                <span className="text-gray-300">circ</span>
              </button>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] w-16 truncate text-gray-500">{homeTeamName}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${myChoice === 'home' ? 'bg-[#2a499a]' : 'bg-gray-300'}`} style={{ width: `${pct(counts?.home || 0)}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 w-8 text-right">{pct(counts?.home || 0)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] w-16 truncate text-gray-500">Barazim</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${myChoice === 'draw' ? 'bg-[#2a499a]' : 'bg-gray-300'}`} style={{ width: `${pct(counts?.draw || 0)}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 w-8 text-right">{pct(counts?.draw || 0)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] w-16 truncate text-gray-500">{awayTeamName}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${myChoice === 'away' ? 'bg-[#2a499a]' : 'bg-gray-300'}`} style={{ width: `${pct(counts?.away || 0)}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 w-8 text-right">{pct(counts?.away || 0)}%</span>
              </div>
              <p className="text-[9px] text-gray-400 text-center pt-0.5">{total} vota gjithsej</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchVoteWidget;
