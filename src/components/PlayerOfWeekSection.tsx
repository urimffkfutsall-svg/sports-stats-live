import React from 'react';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';

const PlayerOfWeekSection: React.FC = () => {
  const { getLatestPlayerOfWeek, getTeamById } = useData();
  const pow = getLatestPlayerOfWeek();

  if (!pow) return null;

  const team = getTeamById(pow.teamId);

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lojtari i Javës</h2>
        <div className="max-w-md mx-auto">
          <Link to="/lojtari-javes" className="block">
            <div className="bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  {pow.photo ? (
                    <img src={pow.photo} alt={pow.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-3xl font-bold">
                      {pow.firstName.charAt(0)}{pow.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#1E6FF2]/80 font-medium uppercase tracking-wider mb-1">Java {pow.week}</p>
                  <h3 className="text-xl font-bold">{pow.firstName} {pow.lastName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {team?.logo && <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />}
                    <span className="text-sm text-gray-300">{team?.name || '-'}</span>
                  </div>
                  {pow.isScorer && (
                    <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                      Golashënues - {pow.goalsCount} gola
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlayerOfWeekSection;
