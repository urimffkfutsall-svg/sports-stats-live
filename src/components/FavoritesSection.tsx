import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Settings2, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { getFavoriteTeamIds, toggleFavoriteTeam, FAVORITES_EVENT } from '@/lib/favorites';

const FavoritesSection: React.FC = () => {
  const navigate = useNavigate();
  const { teams, matches, getActiveSeason } = useData();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const activeSeason = getActiveSeason();

  useEffect(() => {
    setFavoriteIds(getFavoriteTeamIds());
    const onChange = () => setFavoriteIds(getFavoriteTeamIds());
    window.addEventListener(FAVORITES_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const seasonTeams = useMemo(
    () => teams.filter(t => (activeSeason ? t.seasonId === activeSeason.id : true)),
    [teams, activeSeason]
  );

  const favoriteTeams = useMemo(
    () => favoriteIds.map(id => teams.find(t => t.id === id)).filter(Boolean) as typeof teams,
    [favoriteIds, teams]
  );

  const nextMatchForTeam = (teamId: string) => {
    const upcoming = matches
      .filter(m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.status !== 'finished' && m.status !== 'cancelled')
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (upcoming.length > 0) return { match: upcoming[0], isNext: true };
    const finished = matches
      .filter(m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.status === 'finished')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return finished.length > 0 ? { match: finished[0], isNext: false } : null;
  };

  if (favoriteTeams.length === 0 && !manageOpen) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-red-500" fill="currentColor" />
          <h2 className="text-lg font-bold text-gray-800">Skuadrat e Mia</h2>
        </div>
        <button onClick={() => setManageOpen(o => !o)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#0f1830]">
          <Settings2 size={14} /> {manageOpen ? 'Mbyll' : 'Menaxho'}
        </button>
      </div>

      {manageOpen && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {seasonTeams.map(t => {
              const isFav = favoriteIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setFavoriteIds(prev => {
                    toggleFavoriteTeam(t.id);
                    return prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id];
                  })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors text-left ${isFav ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {t.logo ? <img src={t.logo} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" /> : null}
                  <span className="truncate">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {favoriteTeams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {favoriteTeams.map(team => {
            const info = nextMatchForTeam(team.id);
            return (
              <div
                key={team.id}
                onClick={() => navigate(`/skuadra/${team.id}`)}
                className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all relative"
              >
                <button
                  onClick={e => { e.stopPropagation(); toggleFavoriteTeam(team.id); setFavoriteIds(getFavoriteTeamIds()); }}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  aria-label="Hiq nga favoritet"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  {team.logo ? <img src={team.logo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-100" />}
                  <span className="font-bold text-gray-800 text-sm">{team.name}</span>
                </div>
                {info ? (
                  <p className="text-xs text-gray-500">
                    {info.isNext ? 'Ndeshja e ardhshme: ' : 'Rezultati i fundit: '}
                    <span className="font-semibold text-gray-700">
                      {info.match.date || ''} {info.match.status === 'finished' ? `${info.match.homeScore ?? 0} - ${info.match.awayScore ?? 0}` : ''}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Nuk ka ndeshje te disponueshme</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;

