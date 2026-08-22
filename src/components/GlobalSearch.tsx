import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Shield, User as UserIcon, Calendar, Newspaper } from 'lucide-react';
import { useData } from '@/context/DataContext';

const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { teams, players, matches, news, getTeamById } = useData();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery('');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < 2) return { teams: [], players: [], matches: [], news: [] };

    const matchedTeams = teams.filter(t => t.name?.toLowerCase().includes(q)).slice(0, 6);

    const matchedPlayers = players
      .filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q))
      .slice(0, 6);

    const matchedMatches = matches
      .filter(m => {
        const home = getTeamById(m.homeTeamId)?.name?.toLowerCase() || '';
        const away = getTeamById(m.awayTeamId)?.name?.toLowerCase() || '';
        return home.includes(q) || away.includes(q);
      })
      .slice(0, 6);

    const matchedNews = (news || []).filter(n => n.title?.toLowerCase().includes(q)).slice(0, 5);

    return { teams: matchedTeams, players: matchedPlayers, matches: matchedMatches, news: matchedNews };
  }, [q, teams, players, matches, news, getTeamById]);

  const hasResults = results.teams.length + results.players.length + results.matches.length + results.news.length > 0;

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        title="Kerko"
        aria-label="Kerko"
      >
        <Search size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Kerko skuadra, lojtare, ndeshje, lajme..."
                className="flex-1 outline-none text-sm text-gray-800"
              />
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {q.length < 2 ? (
                <p className="text-center text-sm text-gray-400 py-10">Shkruaj te pakten 2 shkronja per te kerkuar</p>
              ) : !hasResults ? (
                <p className="text-center text-sm text-gray-400 py-10">Nuk u gjet asnje rezultat per "{query}"</p>
              ) : (
                <div className="py-2">
                  {results.teams.length > 0 && (
                    <div className="px-2 pb-2">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">Skuadrat</p>
                      {results.teams.map(t => (
                        <button key={t.id} onClick={() => go(`/skuadra/${t.id}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left">
                          {t.logo ? <img src={t.logo} alt="" className="w-7 h-7 rounded-full object-cover" /> : <Shield size={18} className="text-gray-400" />}
                          <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.players.length > 0 && (
                    <div className="px-2 pb-2">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">Lojtaret</p>
                      {results.players.map(p => (
                        <button key={p.id} onClick={() => go(`/skuadra/${p.teamId}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left">
                          {p.photo ? <img src={p.photo} alt="" className="w-7 h-7 rounded-full object-cover" /> : <UserIcon size={18} className="text-gray-400" />}
                          <span className="text-sm font-semibold text-gray-800">{p.firstName} {p.lastName}</span>
                          <span className="text-xs text-gray-400 ml-auto">{getTeamById(p.teamId)?.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.matches.length > 0 && (
                    <div className="px-2 pb-2">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">Ndeshjet</p>
                      {results.matches.map(m => (
                        <button key={m.id} onClick={() => go(`/live/${m.id}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left">
                          <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800">
                            {getTeamById(m.homeTeamId)?.name} vs {getTeamById(m.awayTeamId)?.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">{m.date}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.news.length > 0 && (
                    <div className="px-2 pb-2">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">Lajmet</p>
                      {results.news.map(n => (
                        <button key={n.id} onClick={() => go(`/lajme/${n.id}`)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left">
                          <Newspaper size={18} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-800 line-clamp-1">{n.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
