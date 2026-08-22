import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const KomisioniPage: React.FC = () => {
  const { decisions, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();
  const [selected, setSelected] = useState<typeof decisions[0] | null>(null);

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1830]/5 rounded-full mb-3">
            <span className="text-xs font-semibold text-[#0f1830] uppercase tracking-wider">Komisioni</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Komisioni i Garave</h1>
          <p className="text-gray-400 text-sm mt-1">
            Vendimet zyrtare sipas javeve - Sezoni {activeSeason?.name || ''}
          </p>
        </div>

        {weeks.length === 0 ? (
          <p className="text-gray-400 text-center py-12 bg-white rounded-2xl border border-gray-100">
            Nuk ka vendime te publikuara.
          </p>
        ) : (
          <div className="space-y-8">
            {weeks.map(week => (
              <div key={week}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f1830] to-[#0f1830] flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">{week}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Java {week}</h2>
                    <p className="text-[11px] text-gray-400">
                      {grouped[week].length} vendim{grouped[week].length > 1 ? 'e' : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 ml-5 border-l-2 border-[#0f1830]/20 pl-6">
                  {grouped[week].map(d => (
                    <div
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#0f1830]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0f1830]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#0f1830] text-xs font-bold">V</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#0f1830] transition-colors">
                            {d.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{d.description}</p>
                        </div>
                        <span className="text-xs text-[#0f1830] font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mt-1">
                          Lexo →
                        </span>
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

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0f1830] uppercase tracking-wider">
                  Java {selected.week}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{selected.title}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-700"
              >
                X
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendimi</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
              </div>
              {(selected as any).content && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detajet e Plota</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {(selected as any).content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KomisioniPage;