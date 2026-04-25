const fs = require("fs");

const p1 = `import React, { useState, useEffect } from 'react';
import { dbNtCompetitions, dbNtGroups, dbNtGroupTeams, dbNtGroupMatches } from '@/lib/supabase-db';
import { v4 as uuidv4 } from 'uuid';

const AdminNationalTeam: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [groupTeams, setGroupTeams] = useState<any[]>([]);
  const [groupMatches, setGroupMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [compName, setCompName] = useState('');
  const [compYear, setCompYear] = useState('');
  const [selectedCompId, setSelectedCompId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [isKosova, setIsKosova] = useState(false);

  // Match form
  const [matchHomeId, setMatchHomeId] = useState('');
  const [matchAwayId, setMatchAwayId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchVenue, setMatchVenue] = useState('');
  const [matchHomeScore, setMatchHomeScore] = useState('');
  const [matchAwayScore, setMatchAwayScore] = useState('');
  const [matchStatus, setMatchStatus] = useState('planned');
  const [editingMatchId, setEditingMatchId] = useState('');

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
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddComp = async () => {
    if (!compName.trim()) return;
    await dbNtCompetitions.upsert({ id: uuidv4(), name: compName.trim(), year: compYear.trim() });
    setCompName(''); setCompYear('');
    load();
  };

  const handleDeleteComp = async (id: string) => {
    if (!confirm('Fshi kompeticionin?')) return;
    await dbNtCompetitions.remove(id);
    load();
  };

  const handleAddGroup = async () => {
    if (!groupName.trim() || !selectedCompId) return;
    await dbNtGroups.upsert({ id: uuidv4(), competitionId: selectedCompId, name: groupName.trim() });
    setGroupName('');
    load();
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Fshi grupin?')) return;
    await dbNtGroups.remove(id);
    load();
  };

  const handleAddTeam = async () => {
    if (!teamName.trim() || !selectedGroupId) return;
    await dbNtGroupTeams.upsert({ id: uuidv4(), groupId: selectedGroupId, teamName: teamName.trim(), teamLogo: teamLogo.trim(), isKosova });
    setTeamName(''); setTeamLogo(''); setIsKosova(false);
    load();
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Fshi skuadren?')) return;
    await dbNtGroupTeams.remove(id);
    load();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setTeamLogo(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSaveMatch = async () => {
    if (!matchHomeId || !matchAwayId || !selectedGroupId) return;
    const m: any = {
      id: editingMatchId || uuidv4(),
      groupId: selectedGroupId,
      homeTeamId: matchHomeId,
      awayTeamId: matchAwayId,
      date: matchDate,
      time: matchTime,
      venue: matchVenue,
      status: matchStatus,
    };
    if (matchStatus === 'finished') {
      m.homeScore = parseInt(matchHomeScore) || 0;
      m.awayScore = parseInt(matchAwayScore) || 0;
    }
    await dbNtGroupMatches.upsert(m);
    setMatchHomeId(''); setMatchAwayId(''); setMatchDate(''); setMatchTime('');
    setMatchVenue(''); setMatchHomeScore(''); setMatchAwayScore('');
    setMatchStatus('planned'); setEditingMatchId('');
    load();
  };

  const handleEditMatch = (m: any) => {
    setEditingMatchId(m.id);
    setSelectedGroupId(m.groupId);
    setMatchHomeId(m.homeTeamId);
    setMatchAwayId(m.awayTeamId);
    setMatchDate(m.date || '');
    setMatchTime(m.time || '');
    setMatchVenue(m.venue || '');
    setMatchHomeScore(String(m.homeScore ?? ''));
    setMatchAwayScore(String(m.awayScore ?? ''));
    setMatchStatus(m.status || 'planned');
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('Fshi ndeshjen?')) return;
    await dbNtGroupMatches.remove(id);
    load();
  };

  const selectedCompGroups = groups.filter(g => g.competitionId === selectedCompId);
  const selectedGroupTeamsList = groupTeams.filter(t => t.groupId === selectedGroupId);
  const selectedGroupMatchesList = groupMatches.filter(m => m.groupId === selectedGroupId);

  const getTeamName = (id: string) => groupTeams.find(t => t.id === id)?.teamName || '?';
  const getTeamLogo = (id: string) => groupTeams.find(t => t.id === id)?.teamLogo || '';
`;

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", p1, "utf8");
console.log("[OK] Part 1 - AdminNationalTeam logic");
