import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches } from '@/lib/supabase-db';

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

export default function KombetarjaPage() {
  const [competitions, setCompetitions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupTeams, setGroupTeams] = useState([]);
  const [groupMatches, setGroupMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompId, setSelectedCompId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [c, g, gt, gm] = await Promise.all([
          dbNtCompetitions.getAll().catch(() => []),
          dbNtGroups.getAll().catch(() => []),
          dbNtGroupTeams.getAll().catch(() => []),
          dbNtGroupMatches.getAll().catch(() => []),
        ]);
        setCompetitions(c);
        setGroups(g);
        setGroupTeams(gt);
        setGroupMatches(gm);
        if (c.length > 0) setSelectedCompId(c[0].id);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const getRanking = (gId) => {
    const teams = groupTeams.filter(t => t.groupId === gId);
    const matches = groupMatches.filter(m => m.groupId === gId && m.status === 'finished');
    return teams.map(t => {
      const played = matches.filter(m => m.homeTeamId === t.id || m.awayTeamId === t.id);
      let w = 0, d = 0, l = 0, gf = 0, ga = 0;
      played.forEach(m => {
        const isHome = m.homeTeamId === t.id;
        const hs = m.homeScore || 0, as_ = m.awayScore || 0;
        const myGoals = isHome ? hs : as_;
        const theirGoals = isHome ? as_ : hs;
        gf += myGoals; ga += theirGoals;
        if (myGoals > theirGoals) w++;
        else if (myGoals === theirGoals) d++;
        else l++;
      });
      return { ...t, played: played.length, w, d, l, gf, ga, gd: gf - ga, pts: w * 3 + d };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  };

  const getTeamName = (id) => groupTeams.find(t => t.id === id)?.teamName || '?';
  const getTeamLogo = (id) => groupTeams.find(t => t.id === id)?.teamLogo || '';
  const isKosovaTeam = (id) => groupTeams.find(t => t.id === id)?.isKosova || false;

  const selectedGroups = groups.filter(g => g.competitionId === selectedCompId);
  const allFinishedMatches = groupMatches.filter(m => m.status === 'finished');

  // Kosova stats
  const kosovaTeamIds = groupTeams.filter(t => t.isKosova).map(t => t.id);
  const kosovaMatches = allFinishedMatches.filter(m => kosovaTeamIds.includes(m.homeTeamId) || kosovaTeamIds.includes(m.awayTeamId));
  let kWins = 0, kDraws = 0, kLosses = 0, kGF = 0, kGA = 0;
  kosovaMatches.forEach(m => {
    const isHome = kosovaTeamIds.includes(m.homeTeamId);
    const myGoals = isHome ? (m.homeScore || 0) : (m.awayScore || 0);
    const theirGoals = isHome ? (m.awayScore || 0) : (m.homeScore || 0);
    kGF += myGoals; kGA += theirGoals;
    if (myGoals > theirGoals) kWins++;
    else if (myGoals === theirGoals) kDraws++;
    else kLosses++;
  });

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
          {/* Quick Stats */}
          <div className="relative z-10 flex gap-4 mt-6 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Ndeshje</p>
              <p className="text-2xl font-black">{kosovaMatches.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Fitore</p>
              <p className="text-2xl font-black text-green-300">{kWins}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Barazime</p>
              <p className="text-2xl font-black text-amber-300">{kDraws}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Humbje</p>
              <p className="text-2xl font-black text-red-300">{kLosses}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Gola</p>
              <p className="text-2xl font-black">{kGF} : {kGA}</p>
            </div>
          </div>
        </div>

        {/* Competition Selector */}
        {competitions.length > 1 && (
          <div className="flex gap-2 bg-white rounded-xl p-1 mb-6 border border-gray-100 shadow-sm overflow-x-auto">
            {competitions.map(c => (
              <button key={c.id} onClick={() => setSelectedCompId(c.id)} className={"flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap " + (selectedCompId === c.id ? "bg-[#1E6FF2] text-white shadow-md shadow-blue-200" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50")}>
                {c.name} {c.year && '(' + c.year + ')'}
              </button>
            ))}
          </div>
        )}

        {/* Groups */}
        {selectedGroups.map(g => {
          const ranking = getRanking(g.id);
          const matches = groupMatches.filter(m => m.groupId === g.id);
          const finishedM = matches.filter(m => m.status === 'finished');
          const upcomingM = matches.filter(m => m.status === 'planned');

          return (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              {/* Group Header */}
              <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] px-5 py-3">
                <h2 className="text-white font-black text-lg">{g.name}</h2>
              </div>

              {/* Ranking Table */}
              {ranking.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left py-3 px-3 w-8">#</th>
                        <th className="text-left py-3">Skuadra</th>
                        <th className="text-center py-3 px-2">ND</th>
                        <th className="text-center py-3 px-2">F</th>
                        <th className="text-center py-3 px-2">B</th>
                        <th className="text-center py-3 px-2">H</th>
                        <th className="text-center py-3 px-2">GS</th>
                        <th className="text-center py-3 px-2">GP</th>
                        <th className="text-center py-3 px-2">DG</th>
                        <th className="text-center py-3 px-3 font-black">P</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((t, i) => (
                        <tr key={t.id} className={"border-b border-gray-50 hover:bg-gray-50/50 transition-colors " + (t.isKosova ? "bg-blue-50/40" : "")}>
                          <td className="py-3 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              {t.teamLogo ? <img src={t.teamLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{t.teamName?.charAt(0)}</div>}
                              <span className={"text-sm " + (t.isKosova ? "font-black text-[#1E6FF2]" : "font-semibold text-gray-800")}>{t.teamName}</span>
                            </div>
                          </td>
                          <td className="text-center text-xs font-medium text-gray-600">{t.played}</td>
                          <td className="text-center text-xs font-bold text-green-600">{t.w}</td>
                          <td className="text-center text-xs font-bold text-amber-500">{t.d}</td>
                          <td className="text-center text-xs font-bold text-red-500">{t.l}</td>
                          <td className="text-center text-xs text-gray-600">{t.gf}</td>
                          <td className="text-center text-xs text-gray-600">{t.ga}</td>
                          <td className="text-center text-xs font-semibold">{t.gd > 0 ? '+' : ''}{t.gd}</td>
                          <td className="text-center text-sm font-black text-[#1E6FF2]">{t.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Matches Section */}
              <div className="p-5 space-y-4">
                {/* Upcoming */}
                {upcomingM.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#1E6FF2] rounded-full"></span>Ndeshjet e Ardhshme
                    </h3>
                    <div className="space-y-2">
                      {upcomingM.map(m => {
                        const homeLogo = getTeamLogo(m.homeTeamId);
                        const awayLogo = getTeamLogo(m.awayTeamId);
                        return (
                          <div key={m.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                            <div className="flex items-center gap-2 flex-1">
                              {homeLogo ? <img src={homeLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.homeTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.homeTeamId)}</span>
                            </div>
                            <div className="text-center px-4">
                              <span className="text-xs text-gray-400 font-bold">vs</span>
                              {m.date && <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(m.date)} {m.time || ''}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.awayTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.awayTeamId)}</span>
                              {awayLogo ? <img src={awayLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Finished */}
                {finishedM.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-green-500 rounded-full"></span>Rezultatet
                    </h3>
                    <div className="space-y-2">
                      {finishedM.map(m => {
                        const homeLogo = getTeamLogo(m.homeTeamId);
                        const awayLogo = getTeamLogo(m.awayTeamId);
                        const homeWin = (m.homeScore || 0) > (m.awayScore || 0);
                        const awayWin = (m.awayScore || 0) > (m.homeScore || 0);
                        return (
                          <div key={m.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                            <div className="flex items-center gap-2 flex-1">
                              {homeLogo ? <img src={homeLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.homeTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.homeTeamId)}</span>
                            </div>
                            <div className="text-center px-4">
                              <div className="flex items-center gap-2">
                                <span className={"text-xl font-black " + (homeWin ? "text-green-600" : "text-gray-800")}>{m.homeScore ?? 0}</span>
                                <span className="text-gray-300">:</span>
                                <span className={"text-xl font-black " + (awayWin ? "text-green-600" : "text-gray-800")}>{m.awayScore ?? 0}</span>
                              </div>
                              {m.date && <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(m.date)}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className={"text-sm font-bold " + (isKosovaTeam(m.awayTeamId) ? "text-[#1E6FF2]" : "text-gray-800")}>{getTeamName(m.awayTeamId)}</span>
                              {awayLogo ? <img src={awayLogo} alt="" className="w-6 h-6 rounded object-contain" /> : <div className="w-6 h-6 rounded bg-gray-200"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Kosova Statistics */}
        {kosovaMatches.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2a499a] to-[#1E6FF2] px-5 py-3">
              <h2 className="text-white font-black text-lg">Statistikat e Kosoves</h2>
            </div>
            <div className="p-5 space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-[#1E6FF2]">{kosovaMatches.length}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Ndeshje</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-green-500">{kWins}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Fitore</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-amber-500">{kDraws}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Barazime</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-red-500">{kLosses}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Humbje</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-gray-100">
                  <p className="text-3xl font-black text-gray-800">{kGF} : {kGA}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Gola</p>
                </div>
              </div>

              {/* Goals Bar + Win Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Gola</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#1E6FF2]">{kGF}</p>
                      <p className="text-xs text-gray-400 mt-1">Te shenuar</p>
                    </div>
                    <div className="text-2xl font-light text-gray-200">-</div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-red-400">{kGA}</p>
                      <p className="text-xs text-gray-400 mt-1">Te pesuar</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#1E6FF2] h-full rounded-full" style={{ width: (kGF + kGA > 0 ? (kGF / (kGF + kGA) * 100) : 50) + '%' }}></div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-4 text-sm">Perqindja e Fitoreve</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#1E6FF2" strokeWidth="10" strokeDasharray="264" strokeDashoffset={kosovaMatches.length > 0 ? 264 - (kWins / kosovaMatches.length * 264) : 264} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-gray-900">{kosovaMatches.length > 0 ? Math.round(kWins / kosovaMatches.length * 100) : 0}%</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span><span className="text-sm text-gray-600">Fitore: {kWins}</span></div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span><span className="text-sm text-gray-600">Barazime: {kDraws}</span></div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span><span className="text-sm text-gray-600">Humbje: {kLosses}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {competitions.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
            <p className="text-gray-400">Nuk ka kompeticion te regjistruar ende</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
