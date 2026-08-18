const fs = require("fs");
const p1 = `import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbNationalPlayers, dbNationalMatches, dbNationalStaff } from '@/lib/supabase-db';
import { useData } from '@/context/DataContext';

type Tab = 'squad' | 'matches' | 'stats' | 'staff' | 'news';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

export default function KombetarjaPage() {
  const { news } = useData() as any;
  const [tab, setTab] = useState<Tab>('squad');
  const [ntPlayers, setNtPlayers] = useState<any[]>([]);
  const [ntMatches, setNtMatches] = useState<any[]>([]);
  const [ntStaff, setNtStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pl, ma, st] = await Promise.all([
          dbNationalPlayers.getAll().catch(() => []),
          dbNationalMatches.getAll().catch(() => []),
          dbNationalStaff.getAll().catch(() => []),
        ]);
        setNtPlayers(pl);
        setNtMatches(ma);
        setNtStaff(st);
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

  const tabs: { key: Tab; label: string }[] = [
    { key: 'squad', label: 'Skuadra' },
    { key: 'matches', label: 'Ndeshjet' },
    { key: 'stats', label: 'Statistikat' },
    { key: 'staff', label: 'Stafi' },
    { key: 'news', label: 'Lajme' },
  ];
`;
fs.writeFileSync("src/pages/KombetarjaPage.tsx", p1, "utf8");
console.log("[OK] Part 1 written");
