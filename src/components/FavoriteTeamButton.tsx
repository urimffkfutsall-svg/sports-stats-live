import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { isFavoriteTeam, toggleFavoriteTeam, FAVORITES_EVENT } from '@/lib/favorites';

interface Props {
  teamId: string;
  size?: number;
  className?: string;
}

const FavoriteTeamButton: React.FC<Props> = ({ teamId, size = 20, className = '' }) => {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavoriteTeam(teamId));
    const onChange = () => setFav(isFavoriteTeam(teamId));
    window.addEventListener(FAVORITES_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [teamId]);

  return (
    <button
      type="button"
      aria-label={fav ? 'Hiq nga favoritet' : 'Shto te favoritet'}
      title={fav ? 'Hiq nga favoritet' : 'Shto te favoritet'}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        setFav(toggleFavoriteTeam(teamId));
      }}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${fav ? 'text-red-500' : 'text-white hover:text-red-400'} ${className}`}
    >
      <Heart size={size} fill={fav ? 'currentColor' : 'none'} strokeWidth={2} />
    </button>
  );
};

export default FavoriteTeamButton;
