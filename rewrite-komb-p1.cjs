const fs = require("fs");

const page = `import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbNationalMatches } from '@/lib/supabase-db';

type Tab = 'matches' | 'stats';

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

export default function KombetarjaPage() {
  const [tab, setTab] = useState('matches');
  const [ntMatches, setNtMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ma = await dbNationalMatches.getAll().catch(() => []);
        setNtMatches(ma);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const finishedMatches = ntMatches.filter(m => m.status === 'finished');
  const upcomingMatches = ntMatches.filter(m => m.status === 'planned');
  const wins = finishedMatches.filter(m => m.isHome ? (m.homeScore > m.awayScore) : (m.awayScore > m.homeScore)).length;
  const draws = finishedMatches.filter(m => m.homeScore === m.awayScore).length;
  const losses = finishedMatches.length - wins - draws;
  const goalsFor = finishedMatches.reduce((s, m) => s + (m.isHome ? (m.homeScore || 0) : (m.awayScore || 0)), 0);
  const goalsAgainst = finishedMatches.reduce((s, m) => s + (m.isHome ? (m.awayScore || 0) : (m.homeScore || 0)), 0);

  const tabs = [
    { key: 'matches', label: 'Ndeshjet' },
    { key: 'stats', label: 'Statistikat' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#d0a650] rounded-full"></span>
              Kombetarja e Kosoves
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Futsall Kosova</h1>
            <p className="text-white/60 text-sm">Perfaqesuesja zyrtare e Kosoves ne Futsall</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-8 border border-gray-100 shadow-sm">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap " + (tab === t.key ? "bg-[#1E6FF2] text-white shadow-md shadow-blue-200" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50")}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MATCHES TAB */}
        {tab === 'matches' && (
          <div className="space-y-8">
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1E6FF2] rounded-full"></span>Ndeshjet e Ardhshme
                </h2>
                <div className="space-y-3">
                  {upcomingMatches.map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1E6FF2]/10 flex items-center justify-center text-[#1E6FF2] font-black text-sm">
                          {m.isHome ? 'H' : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{m.isHome ? 'Kosova' : m.opponent} vs {m.isHome ? m.opponent : 'Kosova'}</p>
                          <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                            {m.date && <span>{formatDate(m.date)}</span>}
                            {m.time && <span>{m.time}</span>}
                            {m.venue && <span>{m.venue}</span>}
                          </div>
                        </div>
                      </div>
                      {m.type && <span className="text-[10px] font-bold text-white bg-[#1E6FF2] px-2.5 py-1 rounded-full uppercase">{m.type === 'friendly' ? 'Miqesore' : m.type === 'qualifier' ? 'Kualifikuese' : m.type}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {finishedMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>Rezultatet
                </h2>
                <div className="space-y-3">
                  {finishedMatches.map(m => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        {m.opponentLogo && <img src={m.opponentLogo} alt="" className="w-10 h-10 rounded-lg object-contain" />}
                        <div>
                          <p className="font-bold text-gray-900">{m.isHome ? 'Kosova' : m.opponent} vs {m.isHome ? m.opponent : 'Kosova'}</p>
                          <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                            {m.date && <span>{formatDate(m.date)}</span>}
                            {m.venue && <span>{m.venue}</span>}
                            {m.type && <span className="uppercase">{m.type === 'friendly' ? 'Miqesore' : m.type === 'qualifier' ? 'Kualifikuese' : m.type}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-gray-900">{m.homeScore ?? 0} : {m.awayScore ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ntMatches.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
                <p className="text-gray-400">Nuk ka ndeshje te regjistruara ende</p>
              </div>
            )}
          </div>
        )}
`;
fs.writeFileSync("src/pages/KombetarjaPage.tsx", page, "utf8");
console.log("[OK] Part 1 rewritten");
