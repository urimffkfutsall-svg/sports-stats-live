import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

var SkuadratPage: React.FC = function() {
  var data = useData();
  var auth = useAuth();
  var navigate = useNavigate();
  var teams = data.teams;
  var competitions = data.competitions;
  var getActiveSeason = data.getActiveSeason;
  var activeSeason = getActiveSeason();

  if (!auth.isAdmin) return <Navigate to="/" replace />;

  var _tab = useState<'superliga' | 'liga_pare'>('superliga');
  var tab = _tab[0]; var setTab = _tab[1];

  var superligaComp = competitions.find(function(c) { return c.type === 'superliga' && (activeSeason ? c.seasonId === activeSeason.id : true); });
  var ligaPareComp = competitions.find(function(c) { return c.type === 'liga_pare' && (activeSeason ? c.seasonId === activeSeason.id : true); });

  var displayTeams = teams.filter(function(t) {
    if (tab === 'superliga') return superligaComp ? t.competitionId === superligaComp.id : false;
    return ligaPareComp ? t.competitionId === ligaPareComp.id : false;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] rounded-xl flex items-center justify-center shadow-lg">
            
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Skuadrat</h1>
            <p className="text-sm text-gray-500">Te gjitha skuadrat e sezonit aktiv</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={function() { setTab('superliga'); }} className={'px-5 py-2.5 rounded-xl text-sm font-medium transition-all ' + (tab === 'superliga' ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
            Superliga
          </button>
          <button onClick={function() { setTab('liga_pare'); }} className={'px-5 py-2.5 rounded-xl text-sm font-medium transition-all ' + (tab === 'liga_pare' ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
            Liga e Pare
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayTeams.length === 0 ? (
            <p className="col-span-full text-center py-16 text-gray-400">Nuk ka skuadra</p>
          ) : displayTeams.map(function(t) {
            var tPlayers = data.players.filter(function(p) { return p.teamId === t.id && (activeSeason ? p.seasonId === activeSeason.id : true); });
            return (
              <div key={t.id} onClick={function() { navigate('/skuadra/' + t.id); }} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl hover:border-[#1E6FF2]/30 transition-all cursor-pointer group">
                <div className="w-20 h-20 mx-auto rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden p-2 mb-4 group-hover:scale-105 transition-transform">
                  {t.logo ? <img src={t.logo} alt="" className="w-full h-full object-contain" /> : null}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{t.name}</h3>
                <p className="text-xs text-gray-400">{tPlayers.length} lojtare</p>
                {t.city && <p className="text-xs text-gray-400 mt-0.5">{t.city}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkuadratPage;
