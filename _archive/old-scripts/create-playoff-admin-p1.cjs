const fs = require("fs");

const adminPlayoff = `import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { dbPlayoffSeries, dbPlayoffMatches } from '@/lib/supabase-db';

type PlayoffType = 'superliga' | 'liga_pare';
type PlayoffRound = 'quarter' | 'semi' | 'final';

const AdminPlayoff: React.FC = () => {
  const { teams, competitions, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();

  const [playoffType, setPlayoffType] = useState<PlayoffType>('superliga');
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formRound, setFormRound] = useState<PlayoffRound>('quarter');
  const [formTeam1, setFormTeam1] = useState('');
  const [formTeam2, setFormTeam2] = useState('');
  const [formSeed1, setFormSeed1] = useState('');
  const [formSeed2, setFormSeed2] = useState('');
  const [editingSeriesId, setEditingSeriesId] = useState('');

  // Match form
  const [matchSeriesId, setMatchSeriesId] = useState('');
  const [matchNumber, setMatchNumber] = useState('1');
  const [matchHomeId, setMatchHomeId] = useState('');
  const [matchAwayId, setMatchAwayId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchVenue, setMatchVenue] = useState('');
  const [matchStatus, setMatchStatus] = useState('planned');
  const [matchHomeScore, setMatchHomeScore] = useState('');
  const [matchAwayScore, setMatchAwayScore] = useState('');
  const [editingMatchId, setEditingMatchId] = useState('');

  const load = async () => {
    try {
      const [s, m] = await Promise.all([
        dbPlayoffSeries.getAll().catch(() => []),
        dbPlayoffMatches.getAll().catch(() => []),
      ]);
      setAllSeries(s);
      setAllMatches(m);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Filter teams based on playoff type
  const superligaComp = competitions.find(c => c.type === 'superliga' && (activeSeason ? c.seasonId === activeSeason.id : true));
  const ligaPareComp = competitions.find(c => c.type === 'liga_pare' && (activeSeason ? c.seasonId === activeSeason.id : true));

  const availableTeams = playoffType === 'superliga'
    ? teams.filter(t => superligaComp ? t.competitionId === superligaComp.id : false)
    : teams.filter(t => (superligaComp ? t.competitionId === superligaComp.id : false) || (ligaPareComp ? t.competitionId === ligaPareComp.id : false));

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || '?';
  const getTeamLogo = (id: string) => teams.find(t => t.id === id)?.logo || '';

  // Series for current type
  const currentSeries = allSeries.filter(s => s.type === playoffType && (activeSeason ? s.seasonId === activeSeason.id : true));
  const quarterSeries = currentSeries.filter(s => s.round === 'quarter');
  const semiSeries = currentSeries.filter(s => s.round === 'semi');
  const finalSeries = currentSeries.filter(s => s.round === 'final');

  // Calculate series winner (best of 3 = 2 wins needed)
  const getSeriesScore = (seriesId: string) => {
    const matches = allMatches.filter(m => m.seriesId === seriesId && m.status === 'finished');
    let t1Wins = 0, t2Wins = 0;
    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return { t1Wins: 0, t2Wins: 0, decided: false };
    matches.forEach(m => {
      const hs = m.homeScore ?? 0;
      const as_ = m.awayScore ?? 0;
      if (hs > as_) {
        if (m.homeTeamId === series.team1Id) t1Wins++; else t2Wins++;
      } else if (as_ > hs) {
        if (m.awayTeamId === series.team1Id) t1Wins++; else t2Wins++;
      }
    });
    return { t1Wins, t2Wins, decided: t1Wins >= 2 || t2Wins >= 2, winnerId: t1Wins >= 2 ? series.team1Id : t2Wins >= 2 ? series.team2Id : null };
  };

  const handleSaveSeries = async () => {
    if (!formTeam1 || !formTeam2) { alert('Zgjidh dy skuadra'); return; }
    try {
      await dbPlayoffSeries.upsert({
        id: editingSeriesId || crypto.randomUUID(),
        type: playoffType,
        round: playoffType === 'liga_pare' ? 'final' : formRound,
        team1Id: formTeam1,
        team2Id: formTeam2,
        team1Seed: parseInt(formSeed1) || 0,
        team2Seed: parseInt(formSeed2) || 0,
        seasonId: activeSeason?.id || '',
      });
      setFormTeam1(''); setFormTeam2(''); setFormSeed1(''); setFormSeed2(''); setEditingSeriesId('');
      load();
    } catch (err) { alert('Gabim: ' + (err as any)?.message); }
  };

  const handleDeleteSeries = async (id: string) => {
    if (!confirm('Fshi serine dhe ndeshjet?')) return;
    await dbPlayoffSeries.remove(id);
    load();
  };

  const handleSaveMatch = async () => {
    if (!matchSeriesId || !matchHomeId || !matchAwayId) { alert('Ploteso fushat'); return; }
    try {
      const mData: any = {
        id: editingMatchId || crypto.randomUUID(),
        seriesId: matchSeriesId,
        matchNumber: parseInt(matchNumber) || 1,
        homeTeamId: matchHomeId,
        awayTeamId: matchAwayId,
        date: matchDate || null,
        time: matchTime || null,
        venue: matchVenue || null,
        status: matchStatus,
      };
      if (matchStatus === 'finished') {
        mData.homeScore = parseInt(matchHomeScore) || 0;
        mData.awayScore = parseInt(matchAwayScore) || 0;
      }
      await dbPlayoffMatches.upsert(mData);
      setMatchSeriesId(''); setMatchNumber('1'); setMatchHomeId(''); setMatchAwayId('');
      setMatchDate(''); setMatchTime(''); setMatchVenue(''); setMatchStatus('planned');
      setMatchHomeScore(''); setMatchAwayScore(''); setEditingMatchId('');
      load();
    } catch (err) { alert('Gabim: ' + (err as any)?.message); }
  };

  const handleEditMatch = (m: any) => {
    setEditingMatchId(m.id);
    setMatchSeriesId(m.seriesId);
    setMatchNumber(String(m.matchNumber || 1));
    setMatchHomeId(m.homeTeamId);
    setMatchAwayId(m.awayTeamId);
    setMatchDate(m.date || '');
    setMatchTime(m.time || '');
    setMatchVenue(m.venue || '');
    setMatchStatus(m.status || 'planned');
    setMatchHomeScore(String(m.homeScore ?? ''));
    setMatchAwayScore(String(m.awayScore ?? ''));
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('Fshi ndeshjen?')) return;
    await dbPlayoffMatches.remove(id);
    load();
  };
`;
fs.writeFileSync("src/pages/admin/AdminPlayoff.tsx", adminPlayoff, "utf8");
console.log("[OK] AdminPlayoff Part 1 - Logic + handlers");
