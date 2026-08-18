const fs = require("fs");
// Part 1 of LiveMatchPage
const p1 = `import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchDetailModal from '@/components/MatchDetailModal';
import { Match } from '@/types';

function formatDate(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

const LiveMatchPage = () => {
  const { matches, teams, competitions, getActiveSeason, getGoalsByMatch, players, getTeamById } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const liveMatches = useMemo(() =>
    matches.filter(m => m.status === 'live' && (activeSeason ? m.seasonId === activeSeason.id : true)),
    [matches, activeSeason]
  );
  const seasonMatches = useMemo(() =>
    activeSeason ? matches.filter(m => m.seasonId === activeSeason.id) : matches,
    [matches, activeSeason]
  );
  const superligaComp = competitions.find(c => c.type === 'superliga' && (activeSeason ? c.seasonId === activeSeason.id : true));
  const ligaPareComp = competitions.find(c => c.type === 'liga_pare' && (activeSeason ? c.seasonId === activeSeason.id : true));
  const kupaComp = competitions.find(c => c.type === 'kupa' && (activeSeason ? c.seasonId === activeSeason.id : true));

  const getRecent = (compId) => {
    if (!compId) return [];
    return seasonMatches.filter(m => m.competitionId === compId && m.status === 'finished')
      .sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4);
  };
  const getUpcoming = (compId) => {
    if (!compId) return [];
    return seasonMatches.filter(m => m.competitionId === compId && m.status === 'planned')
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 4);
  };
`;
fs.writeFileSync("src/pages/LiveMatchPage.tsx", p1, "utf8");
console.log("[OK] Part 1 written");
