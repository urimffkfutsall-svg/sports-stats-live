import React from 'react';
import { useData } from '@/context/DataContext';
import { NormativeAct } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AktetNormativePage: React.FC = () => {
  const { normativeActs } = useData() as any;

  const openPdf = (url: string) => {
    if (url.startsWith('data:')) {
      fetch(url).then(r => r.blob()).then(blob => {
        window.open(URL.createObjectURL(blob), '_blank');
      });
    } else {
      window.open(url, '_blank');
    }
  };

  const sorted = [...(normativeActs || [])].sort((a: NormativeAct, b: NormativeAct) =>
    new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1830]/5 rounded-full mb-3">
            <span className="text-xs font-semibold text-[#0f1830] uppercase tracking-wider">Dokumentet Zyrtare</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Aktet Normative</h1>
          <p className="text-gray-400 text-sm mt-1">Dokumentet dhe rregulloret zyrtare te FFK Futsall</p>
        </div>

        {sorted.length === 0 ? (
          <p className="text-gray-400 text-center py-12 bg-white rounded-2xl border border-gray-100">
            Nuk ka akte normative te publikuara.
          </p>
        ) : (
          <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {sorted.map((a: NormativeAct, i: number) => (
              <div
                key={a.id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-[#b8901e]/30 last:border-0"
                style={{ backgroundColor: '#C9A227' }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-white font-bold text-sm flex-shrink-0">{i + 1}.</span>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{a.title}</p>
                    {a.description && (
                      <p className="text-white/70 text-xs truncate">{a.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => openPdf(a.pdfUrl)}
                  className="ml-4 flex-shrink-0 text-white text-xs font-semibold underline underline-offset-2 hover:text-white/80 transition-colors whitespace-nowrap"
                >
                  Lexo Dokumentin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto"><Footer /></div>
    </div>
  );
};

export default AktetNormativePage;

