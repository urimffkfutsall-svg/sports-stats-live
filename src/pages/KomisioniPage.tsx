import React from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const KomisioniPage: React.FC = () => {
  const { decisions, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();

  const filtered = activeSeason ? decisions.filter(d => d.seasonId === activeSeason.id) : decisions;
  const sorted = [...filtered].sort((a, b) => b.week - a.week);

  const grouped: Record<number, typeof sorted> = {};
  sorted.forEach(d => {
    if (!grouped[d.week]) grouped[d.week] = [];
    grouped[d.week].push(d);
  });

  const weeks = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2a499a]/5 rounded-full mb-3">
            
            <span className="text-xs font-semibold text-[#2a499a] uppercase tracking-wider">Komisioni</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Komisioni i Garave</h1>
          <p className="text-gray-400 text-sm mt-1">Vendimet zyrtare sipas javeve - Sezoni {activeSeason?.name || ''}</p>
        </div>

        {weeks.length === 0 ? (
          <p className="text-gray-400 text-center py-12 bg-white rounded-2xl border border-gray-100">Nuk ka vendime te publikuara.</p>
        ) : (
          <div className="space-y-8">
            {weeks.map(week => (
              <div key={week}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a499a] to-[#1E6FF2] flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-black">{week}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Java {week}</h2>
                    <p className="text-[11px] text-gray-400">{grouped[week].length} vendim{grouped[week].length > 1 ? 'e' : ''}</p>
                  </div>
                </div>
                <div className="space-y-3 ml-5 border-l-2 border-[#1E6FF2]/20 pl-6">
                  {grouped[week].map(d => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1E6FF2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">{d.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{d.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KomisioniPage;