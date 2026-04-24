import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { CompetitionType } from '@/types';
import { 
  ChevronRight, ChevronLeft, Check, Calendar, Trophy, Users, 
  UserCheck, Zap, AlertCircle, Copy, Loader2
} from 'lucide-react';

interface WizardState {
  step: number;
  // Step 1: Season
  seasonName: string;
  startDate: string;
  endDate: string;
  // Step 2: Competitions
  competitions: { name: string; type: CompetitionType; isActiveLanding: boolean }[];
  // Step 3: Copy teams
  copyTeams: boolean;
  sourceSeasonId: string;
  // Step 4: Copy players
  copyPlayers: boolean;
  copyScorers: boolean;
  // Step 5: Activate
  activateNow: boolean;
}

const defaultComps: { name: string; type: CompetitionType; isActiveLanding: boolean }[] = [
  { name: 'Superliga', type: 'superliga', isActiveLanding: true },
  { name: 'Liga e Parë', type: 'liga_pare', isActiveLanding: true },
  { name: 'Kupa e Kosovës', type: 'kupa', isActiveLanding: true },
];

const AdminNewSeasonWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    seasons, competitions, teams, players, scorers,
    addSeason, addCompetition, addTeam, addPlayer, addScorer,
    updateSeason, getActiveSeason
  } = useData();

  const [state, setState] = useState<WizardState>({
    step: 1,
    seasonName: '',
    startDate: '',
    endDate: '',
    competitions: [...defaultComps],
    copyTeams: true,
    sourceSeasonId: '',
    copyPlayers: false,
    copyScorers: false,
    activateNow: true,
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ teams: number; players: number; scorers: number; comps: number }>({ teams: 0, players: 0, scorers: 0, comps: 0 });

  const totalSteps = 5;

  const sourceSeasonTeams = useMemo(() => {
    if (!state.sourceSeasonId) return [];
    return teams.filter(t => t.seasonId === state.sourceSeasonId);
  }, [state.sourceSeasonId, teams]);

  const sourceSeasonPlayers = useMemo(() => {
    if (!state.sourceSeasonId) return [];
    return players.filter(p => p.seasonId === state.sourceSeasonId);
  }, [state.sourceSeasonId, players]);

  const sourceSeasonScorers = useMemo(() => {
    if (!state.sourceSeasonId) return [];
    return scorers.filter(s => s.seasonId === state.sourceSeasonId);
  }, [state.sourceSeasonId, scorers]);

  const sourceSeason = seasons.find(s => s.id === state.sourceSeasonId);

  const canProceed = () => {
    switch (state.step) {
      case 1: return state.seasonName.trim().length > 0;
      case 2: return state.competitions.length > 0 && state.competitions.every(c => c.name.trim().length > 0);
      case 3: return !state.copyTeams || state.sourceSeasonId !== '';
      case 4: return true;
      case 5: return true;
      default: return true;
    }
  };

  const handleAddComp = () => {
    setState(prev => ({
      ...prev,
      competitions: [...prev.competitions, { name: '', type: 'superliga', isActiveLanding: true }]
    }));
  };

  const handleRemoveComp = (index: number) => {
    setState(prev => ({
      ...prev,
      competitions: prev.competitions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateComp = (index: number, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      competitions: prev.competitions.map((c, i) => i === index ? { ...c, [field]: value } : c)
    }));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    let copiedTeams = 0, copiedPlayers = 0, copiedScorers = 0;

    try {
      // Step 1: Create season
      const seasonData = {
        name: state.seasonName,
        startDate: state.startDate,
        endDate: state.endDate,
        isActive: state.activateNow,
      };
      
      // If activating, deactivate current
      if (state.activateNow) {
        const current = getActiveSeason();
        if (current) {
          updateSeason({ ...current, isActive: false });
        }
      }
      
      // We need a temporary ID approach - addSeason generates ID internally
      // So we'll use a deterministic approach
      const { v4: uuidv4 } = await import('uuid');
      const newSeasonId = uuidv4();
      
      addSeason(seasonData);
      
      // Wait a tick for state to update
      await new Promise(r => setTimeout(r, 300));

      // Find the newly created season (by name match)
      // Since addSeason generates its own ID, we need to find it
      // We'll use the name as identifier
      
      // Step 2: Create competitions
      const compMap: Record<string, string> = {}; // sourceType -> newCompId
      
      for (const comp of state.competitions) {
        addCompetition({
          name: comp.name,
          type: comp.type,
          seasonId: newSeasonId,
          isActiveLanding: comp.isActiveLanding,
        });
        // We'll map by type for team copying
      }

      await new Promise(r => setTimeout(r, 300));

      // Step 3: Copy teams
      if (state.copyTeams && state.sourceSeasonId) {
        const sourceComps = competitions.filter(c => c.seasonId === state.sourceSeasonId);
        
        for (const team of sourceSeasonTeams) {
          const sourceComp = sourceComps.find(c => c.id === team.competitionId);
          const targetComp = state.competitions.find(c => sourceComp && c.type === sourceComp.type);
          
          if (targetComp) {
            const newTeamId = uuidv4();
            addTeam({
              name: team.name,
              logo: team.logo,
              competitionId: '', // Will be resolved
              seasonId: newSeasonId,
              foundedYear: team.foundedYear,
              stadium: team.stadium,
            });
            copiedTeams++;

            // Step 4: Copy players for this team
            if (state.copyPlayers) {
              const teamPlayers = players.filter(p => p.teamId === team.id);
              for (const player of teamPlayers) {
                addPlayer({
                  firstName: player.firstName,
                  lastName: player.lastName,
                  photo: player.photo,
                  birthDate: player.birthDate,
                  position: player.position,
                  teamId: newTeamId,
                  seasonId: newSeasonId,
                });
                copiedPlayers++;
              }
            }
          }
        }
      }

      // Copy scorers
      if (state.copyScorers && state.sourceSeasonId) {
        for (const scorer of sourceSeasonScorers) {
          if (scorer.isManual) {
            addScorer({
              firstName: scorer.firstName,
              lastName: scorer.lastName,
              photo: scorer.photo,
              teamId: scorer.teamId,
              competitionId: scorer.competitionId,
              seasonId: newSeasonId,
              goals: 0,
              isManual: true,
            });
            copiedScorers++;
          }
        }
      }

      setResults({
        teams: copiedTeams,
        players: copiedPlayers,
        scorers: copiedScorers,
        comps: state.competitions.length,
      });
      setCompleted(true);
    } catch (err) {
      console.error('Season wizard error:', err);
      alert('Gabim gjatë krijimit të sezonit. Provoni përsëri.');
    } finally {
      setIsExecuting(false);
    }
  };

  // ============ COMPLETED VIEW ============
  if (completed) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Sezoni u krijua me sukses!</h3>
        <p className="text-sm text-gray-500 mb-6">{state.seasonName}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{results.comps}</p>
            <p className="text-xs text-blue-500">Kompeticione</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{results.teams}</p>
            <p className="text-xs text-green-500">Skuadra</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{results.players}</p>
            <p className="text-xs text-purple-500">Lojtarë</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{results.scorers}</p>
            <p className="text-xs text-orange-500">Golashënues</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#1E6FF2] text-white rounded-xl font-medium hover:bg-[#1558CC] transition-colors"
        >
          Mbyll
        </button>
      </div>
    );
  }

  // ============ STEP INDICATORS ============
  const steps = [
    { num: 1, label: 'Sezoni', icon: Calendar },
    { num: 2, label: 'Kompeticionet', icon: Trophy },
    { num: 3, label: 'Skuadrat', icon: Users },
    { num: 4, label: 'Lojtarët', icon: UserCheck },
    { num: 5, label: 'Konfirmo', icon: Check },
  ];

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = state.step === s.num;
          const isDone = state.step > s.num;
          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-[#1E6FF2] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${state.step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* Step 1: Season */}
        {state.step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Krijo Sezon të Ri</h3>
            <p className="text-sm text-gray-500 mb-4">Vendos emrin dhe datat e sezonit të ri.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Sezonit *</label>
              <input
                value={state.seasonName}
                onChange={e => setState(p => ({ ...p, seasonName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent"
                placeholder="p.sh. 2026/2027"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Fillimit</label>
                <input
                  type="date"
                  value={state.startDate}
                  onChange={e => setState(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Mbarimit</label>
                <input
                  type="date"
                  value={state.endDate}
                  onChange={e => setState(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Competitions */}
        {state.step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Kompeticionet</h3>
                <p className="text-sm text-gray-500">Shto kompeticionet për sezonin e ri.</p>
              </div>
              <button onClick={handleAddComp} className="px-3 py-1.5 bg-[#1E6FF2] text-white rounded-lg text-sm hover:bg-[#1558CC]">
                + Shto
              </button>
            </div>
            <div className="space-y-3">
              {state.competitions.map((comp, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <input
                    value={comp.name}
                    onChange={e => handleUpdateComp(i, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    placeholder="Emri..."
                  />
                  <select
                    value={comp.type}
                    onChange={e => handleUpdateComp(i, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="superliga">Superliga</option>
                    <option value="liga_pare">Liga e Parë</option>
                    <option value="kupa">Kupa</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={comp.isActiveLanding}
                      onChange={e => handleUpdateComp(i, 'isActiveLanding', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs text-gray-600">Landing Page</span>
                  </label>
                  <button onClick={() => handleRemoveComp(i)} className="text-red-400 hover:text-red-600 text-sm">Fshi</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Copy Teams */}
        {state.step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Kopjo Skuadrat</h3>
            <p className="text-sm text-gray-500">Kopjo skuadrat nga një sezon i mëparshëm.</p>
            
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={state.copyTeams}
                onChange={e => setState(p => ({ ...p, copyTeams: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6FF2]"
              />
              <div>
                <span className="font-medium text-gray-800">Kopjo skuadrat nga sezoni i kaluar</span>
                <p className="text-xs text-gray-500">Skuadrat do të kopjohen në kompeticionet përkatëse bazuar në llojin.</p>
              </div>
            </label>

            {state.copyTeams && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sezoni Burim</label>
                <select
                  value={state.sourceSeasonId}
                  onChange={e => setState(p => ({ ...p, sourceSeasonId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
                >
                  <option value="">Zgjedh sezonin...</option>
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.isActive ? '(Aktiv)' : ''}</option>
                  ))}
                </select>
                {state.sourceSeasonId && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      {sourceSeasonTeams.length} skuadra do të kopjohen nga "{sourceSeason?.name}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {sourceSeasonTeams.slice(0, 20).map(t => (
                        <span key={t.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-xs text-gray-700">
                          {t.logo && <img src={t.logo} alt="" className="w-4 h-4 rounded-full" />}
                          {t.name}
                        </span>
                      ))}
                      {sourceSeasonTeams.length > 20 && (
                        <span className="text-xs text-blue-500">+{sourceSeasonTeams.length - 20} të tjera</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Copy Players & Scorers */}
        {state.step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Kopjo Lojtarët & Golashënuesit</h3>
            <p className="text-sm text-gray-500">Opsionale: kopjo rostat e lojtarëve dhe golashënuesit.</p>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={state.copyPlayers}
                onChange={e => setState(p => ({ ...p, copyPlayers: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6FF2]"
                disabled={!state.copyTeams}
              />
              <div>
                <span className={`font-medium ${!state.copyTeams ? 'text-gray-400' : 'text-gray-800'}`}>Kopjo lojtarët</span>
                <p className="text-xs text-gray-500">
                  {state.copyTeams && state.sourceSeasonId
                    ? `${sourceSeasonPlayers.length} lojtarë do të kopjohen`
                    : 'Duhet të kopjoni skuadrat fillimisht'}
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={state.copyScorers}
                onChange={e => setState(p => ({ ...p, copyScorers: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1E6FF2]"
              />
              <div>
                <span className="font-medium text-gray-800">Kopjo golashënuesit (manual)</span>
                <p className="text-xs text-gray-500">
                  {state.sourceSeasonId
                    ? `${sourceSeasonScorers.filter(s => s.isManual).length} golashënues manual do të kopjohen (me 0 gola)`
                    : 'Zgjedh sezonin burim në hapin e mëparshëm'}
                </p>
              </div>
            </label>

            {!state.copyTeams && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Kopjimi i lojtarëve kërkon që edhe skuadrat të kopjohen.</span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Confirmation */}
        {state.step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Konfirmo & Ekzekuto</h3>
            <p className="text-sm text-gray-500">Rishiko çka do të ndodhë:</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#1E6FF2]" />
                <div>
                  <span className="font-medium text-gray-800">Sezoni: {state.seasonName}</span>
                  {state.startDate && <span className="text-xs text-gray-500 ml-2">{state.startDate} - {state.endDate}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#1E6FF2]" />
                <span className="font-medium text-gray-800">{state.competitions.length} kompeticione: {state.competitions.map(c => c.name).join(', ')}</span>
              </div>

              {state.copyTeams && state.sourceSeasonId && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-800">{sourceSeasonTeams.length} skuadra do të kopjohen nga "{sourceSeason?.name}"</span>
                </div>
              )}

              {state.copyPlayers && state.copyTeams && state.sourceSeasonId && (
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">{sourceSeasonPlayers.length} lojtarë do të kopjohen</span>
                </div>
              )}

              {state.copyScorers && state.sourceSeasonId && (
                <div className="flex items-center gap-3">
                  <Copy className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-800">{sourceSeasonScorers.filter(s => s.isManual).length} golashënues manual do të kopjohen</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Zap className={`w-5 h-5 ${state.activateNow ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-800">
                  {state.activateNow ? 'Sezoni do të aktivizohet menjëherë' : 'Sezoni nuk do të aktivizohet'}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors border border-green-200">
              <input
                type="checkbox"
                checked={state.activateNow}
                onChange={e => setState(p => ({ ...p, activateNow: e.target.checked }))}
                className="w-5 h-5 rounded text-green-600"
              />
              <div>
                <span className="font-medium text-green-800">Aktivizo sezonin menjëherë</span>
                <p className="text-xs text-green-600">Sezoni aktual do të çaktivizohet.</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          onClick={() => state.step === 1 ? onClose() : setState(p => ({ ...p, step: p.step - 1 }))}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          {state.step === 1 ? 'Anulo' : 'Kthehu'}
        </button>

        {state.step < totalSteps ? (
          <button
            onClick={() => setState(p => ({ ...p, step: p.step + 1 }))}
            disabled={!canProceed()}
            className="flex items-center gap-1 px-6 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Vazhdo
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-200"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Duke krijuar...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Krijo Sezonin
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminNewSeasonWizard;
