const fs = require("fs");

const page = `import React, { useState, useEffect } from 'react';
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
`;
fs.writeFileSync("src/pages/KombetarjaPage.tsx", page, "utf8");
console.log("[OK] Part 1 - Hero + data loading");
