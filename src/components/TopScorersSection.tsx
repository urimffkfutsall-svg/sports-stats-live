import React from 'react';
import { useData } from '@/context/DataContext';
const TopScorersSection: React.FC = () => {
  const { getAggregatedScorers, getTeamById } = useData();
  const scorers = getAggregatedScorers().slice(0, 10);

  if (scorers.length === 0) return null;

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2a499a]/5 rounded-full mb-3">
            ◎
            <span className="text-xs font-semibold text-[#2a499a] uppercase tracking-wider">Golashenuesit</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Golashenuesit Kryesore</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-5 py-3.5 bg-[#2a499a] text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
            <span>#</span>
            <span></span>
            <span>Lojtari</span>
            <span>Skuadra</span>
            <span className="text-right">Gola</span>
          </div>

          {scorers.map((s, i) => {
            const team = getTeamById(s.teamId);
            return (
              <div
                key={s.id}
                className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-5 py-3.5 items-center border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
              >
                <span className={`text-sm font-bold ${i < 3 ? '' : 'text-gray-400'}`}>
                  {i < 3 ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold ${
                      i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
                    }`}>
                      {i + 1}
                    </span>
                  ) : (i + 1)}
                </span>
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  {s.photo ? (
                    <img src={s.photo} alt={s.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                      {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {s.firstName} {s.lastName}
                </span>
                <div className="flex items-center gap-2">
                  {team?.logo && <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full border border-gray-200" />}
                  <span className="text-xs text-gray-500 hidden sm:inline font-medium">{team?.name || '-'}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E6FF2]/10 text-[#1E6FF2] font-bold text-sm">
                    {s.goals}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopScorersSection;