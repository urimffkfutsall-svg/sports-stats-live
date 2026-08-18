import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

const TeamMarquee: React.FC = () => {
  const { teams } = useData();

  const allTeams = (teams || []).filter((t: any) => t.logo);
  if (allTeams.length === 0) return null;

  // Double the array for seamless loop
  const doubled = [...allTeams, ...allTeams];

  return (
    <div className="bg-white border-t border-b border-gray-100 py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <h3 className="text-center text-sm font-black uppercase tracking-[0.2em] text-gray-400">Skuadrat</h3>
      </div>
      <div className="relative">
        <div className="flex animate-marquee gap-12 items-center" style={{ width: 'max-content' }}>
          {doubled.map((t: any, i: number) => (
            <Link
              key={t.id + '-' + i}
              to={'/skuadra/' + t.id}
              className="flex-shrink-0 group"
              title={t.name}
            >
              <img
                src={t.logo}
                alt={t.name}
                className="h-14 w-14 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMarquee;
