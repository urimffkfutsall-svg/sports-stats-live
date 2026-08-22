import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import { ShortiRubrik, Match } from '@/types';
import { generateRoundRobin } from '@/lib/shorti';
import { v4 as uuidv4 } from 'uuid';
import { Trash2 } from 'lucide-react';

type CompKey = 'superliga' | 'liga_pare';

const COMP_LABEL: Record<CompKey, string> = {
  superliga: 'Superliga',
  liga_pare: 'Liga e Parë',
};

// Superliga luhet me 10 skuadra (9 javë), Liga e Parë me 14 (13 javë).
const DEFAULT_COUNT: Record<CompKey, number> = {
  superliga: 10,
  liga_pare: 14,
};

const makeDefaultRubrikat = (count: number): ShortiRubrik[] =>
  Array.from({ length: count }, (_, i) => ({ id: uuidv4(), number: i + 1, teamId: null }));

const AdminShorti: React.FC = () => {
  const {
    isLoading, teams, competitions, getActiveSeason,
    shortiSuperliga, shortiLigaPare,
    updateShortiSuperliga, updateShortiLigaPare,
    matches, addMatch, deleteMatch,
  } = useData();

  const [activeComp, setActiveComp] = useState<CompKey>('superliga');
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState<string | null>(null);
  const initializedRef = React.useRef<{ superliga: boolean; liga_pare: boolean }>({ superliga: false, liga_pare: false });

  const rubrikat = activeComp === 'superliga' ? shortiSuperliga : shortiLigaPare;
  const setRubrikat = activeComp === 'superliga' ? updateShortiSuperliga : updateShortiLigaPare;

  // Init rubrikat default (1..10 për Superliga, 1..14 për Liga e Parë) vetëm kur
  // të dhënat reale janë ngarkuar dhe janë vërtet bosh — mbron nga fshirja e të
  // dhënave gjatë ngarkimit fillestar nga serveri.
  useEffect(() => {
    if (isLoading) return;
    if (!initializedRef.current.superliga && shortiSuperliga.length === 0) {
      initializedRef.current.superliga = true;
      updateShortiSuperliga(makeDefaultRubrikat(DEFAULT_COUNT.superliga));
    }
    if (!initializedRef.current.liga_pare && shortiLigaPare.length === 0) {
      initializedRef.current.liga_pare = true;
      updateShortiLigaPare(makeDefaultRubrikat(DEFAULT_COUNT.liga_pare));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const activeSeason = getActiveSeason();
  const competition = competitions.find(c => c.type === activeComp && (activeSeason ? c.seasonId === activeSeason.id : true));
  const compTeams = useMemo(
    () => teams.filter(t => competition ? t.competitionId === competition.id : false),
    [teams, competition]
  );

  const usedTeamIds = useMemo(
    () => new Set(rubrikat.filter(r => r.teamId).map(r => r.teamId as string)),
    [rubrikat]
  );

  const sortedRubrikat = useMemo(() => [...rubrikat].sort((a, b) => a.number - b.number), [rubrikat]);

  const handleAssign = (rubrikId: string, teamId: string) => {
    const next = rubrikat.map(r => r.id === rubrikId ? { ...r, teamId: teamId || null } : r);
    setRubrikat(next);
    setGeneratedMsg(null);
  };

  const handleAddRubrik = () => {
    const nextNumber = rubrikat.length > 0 ? Math.max(...rubrikat.map(r => r.number)) + 1 : 1;
    setRubrikat([...rubrikat, { id: uuidv4(), number: nextNumber, teamId: null }]);
  };

  const handleDeleteRubrik = (rubrikId: string) => {
    if (!confirm('A je i sigurt që do ta fshish këtë rubrikë?')) return;
    setRubrikat(rubrikat.filter(r => r.id !== rubrikId));
  };

  const filledRubrikat = sortedRubrikat.filter(r => r.teamId);
  const allFilled = sortedRubrikat.length >= 2 && filledRubrikat.length === sortedRubrikat.length;

  const schedule = useMemo(() => {
    if (!allFilled) return [];
    const teamIds = sortedRubrikat.map(r => r.teamId as string);
    return generateRoundRobin(teamIds);
  }, [allFilled, sortedRubrikat]);

  const getTeam = (id: string | null) => (id ? compTeams.find(t => t.id === id) || teams.find(t => t.id === id) : undefined);

  // Ndeshje ekzistuese (planifikuara, pa rezultat) për këtë kompeticion — nëse ka,
  // e paralajmërojmë admin-in para se t'i fshijmë e t'i rikrijojmë.
  const existingPlannedMatches = useMemo(() => {
    if (!competition) return [];
    return matches.filter(m => m.competitionId === competition.id && m.status === 'planned' && m.homeScore === undefined && m.awayScore === undefined);
  }, [matches, competition]);

  const existingPlayedMatchesCount = useMemo(() => {
    if (!competition) return 0;
    return matches.filter(m => m.competitionId === competition.id && (m.status !== 'planned' || m.homeScore !== undefined || m.awayScore !== undefined)).length;
  }, [matches, competition]);

  const handleGenerateMatches = async () => {
    if (!competition || !activeSeason || schedule.length === 0) return;

    if (existingPlannedMatches.length > 0) {
      const ok = confirm(
        `Ka ${existingPlannedMatches.length} ndeshje të planifikuara (pa rezultat) për ${COMP_LABEL[activeComp]}. Do të fshihen dhe zëvendësohen me ndeshjet e reja nga Shorti. Ndeshjet e luajtura (me rezultat) NUK preken. Vazhdo?`
      );
      if (!ok) return;
    }

    setGenerating(true);
    try {
      // Fshi vetëm ndeshjet e paluajtura ekzistuese për këtë kompeticion (asnjëherë ato me rezultat).
      for (const m of existingPlannedMatches) {
        deleteMatch(m.id);
      }
      // Krijo ndeshjet e reja, java pas jave, sipas shortit.
      schedule.forEach((round, weekIdx) => {
        round.forEach(pair => {
          const newMatch: Omit<Match, 'id'> = {
            competitionId: competition.id,
            seasonId: activeSeason.id,
            week: weekIdx + 1,
            homeTeamId: pair.home,
            awayTeamId: pair.away,
            status: 'planned',
            isFeaturedLanding: false,
          };
          addMatch(newMatch);
        });
      });
      setGeneratedMsg(`U krijuan ${schedule.reduce((n, r) => n + r.length, 0)} ndeshje, nga Java 1 deri te Java ${schedule.length}.`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Superliga / Liga e Parë tabs */}
      <div className="flex gap-1 mb-6">
        {(['superliga', 'liga_pare'] as CompKey[]).map(key => (
          <button
            key={key}
            onClick={() => { setActiveComp(key); setGeneratedMsg(null); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeComp === key
                ? 'bg-[#0f1830] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {COMP_LABEL[key]}
          </button>
        ))}
      </div>

      {!competition && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-4 mb-6">
          Nuk u gjet kompeticion aktiv i tipit "{COMP_LABEL[activeComp]}" për sezonin aktual. Krijoje te tab-i "Cilësimet" fillimisht.
        </div>
      )}

      {/* Rubrikat */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Rubrikat — {COMP_LABEL[activeComp]}</h3>
          <button
            onClick={handleAddRubrik}
            className="px-3 py-1.5 bg-[#0f1830] text-white rounded-lg text-xs font-medium hover:bg-[#0f1830]"
          >
            + Shto Rubrikë
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedRubrikat.map(r => {
            const assignedTeam = getTeam(r.teamId);
            const availableTeams = compTeams.filter(t => t.id === r.teamId || !usedTeamIds.has(t.id));
            return (
              <div key={r.id} className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f1830] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {r.number}
                </div>
                <div className="flex-1 min-w-0">
                  <select
                    value={r.teamId || ''}
                    onChange={e => handleAssign(r.id, e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f1830]/25"
                  >
                    <option value="">— Zgjedh Skuadrën —</option>
                    {availableTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {assignedTeam && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {assignedTeam.logo && (
                        <img src={assignedTeam.logo} alt="" className="w-4 h-4 rounded-full object-cover" />
                      )}
                      <span className="text-xs text-gray-500 truncate">{assignedTeam.name}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteRubrik(r.id)}
                  className="text-gray-400 hover:text-red-600 text-xs font-medium shrink-0"
                  title="Fshij Rubrikën"
                ><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>

        {sortedRubrikat.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Nuk ka rubrika. Kliko "+ Shto Rubrikë" për të filluar.</p>
        )}
      </div>

      {/* Ndeshjet e gjeneruara automatikisht (Berger) */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-semibold text-gray-800">Ndeshjet (Shorti — Berger) — {COMP_LABEL[activeComp]}</h3>
          {allFilled && competition && activeSeason && (
            <button
              onClick={handleGenerateMatches}
              disabled={generating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {generating ? 'Duke krijuar…' : 'Krijo Ndeshjet (Java 1 → Java ' + schedule.length + ')'}
            </button>
          )}
        </div>

        {!allFilled && (
          <p className="text-sm text-gray-400">
            Plotëso çdo rubrikë me nga një skuadër ({filledRubrikat.length}/{sortedRubrikat.length}) që të gjenerohet automatikisht skema e ndeshjeve.
          </p>
        )}

        {allFilled && !activeSeason && (
          <p className="text-sm text-amber-600">Nuk ka sezon aktiv — aktivizoje një sezon te tab-i "Cilësimet" për të krijuar ndeshjet.</p>
        )}

        {generatedMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
            ✓ {generatedMsg} Shiko te faqja publike e {COMP_LABEL[activeComp]} → "Ndeshjet".
          </div>
        )}

        {existingPlayedMatchesCount > 0 && allFilled && (
          <p className="text-xs text-gray-400 mb-3">
            ({existingPlayedMatchesCount} ndeshje të luajtura më parë për këtë kompeticion nuk preken nga rigjenerimi.)
          </p>
        )}

        {allFilled && schedule.length > 0 && (
          <div className="space-y-4">
            {schedule.map((round, idx) => (
              <div key={idx}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Java {idx + 1}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {round.map((pair, pIdx) => {
                    const home = getTeam(pair.home);
                    const away = getTeam(pair.away);
                    return (
                      <div key={pIdx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <span className="font-medium text-gray-700 truncate">{home?.name || '—'}</span>
                        <span className="text-gray-400 mx-2 shrink-0">vs</span>
                        <span className="font-medium text-gray-700 truncate text-right">{away?.name || '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShorti;
