import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Editor, Player, Official } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { uploadPlayerPhoto } from '@/lib/supabase-db';

function loadOfficials(): Official[] {
  try { var s = localStorage.getItem('ffk_officials'); if (s) return JSON.parse(s); } catch(e) {}
  return [];
}
function saveOfficials(list: Official[]) {
  localStorage.setItem('ffk_officials', JSON.stringify(list));
}

var EditorPanel: React.FC = function() {
  var auth = useAuth();
  var data = useData();
  var currentUser = auth.currentUser;
  var getTeamById = data.getTeamById;
  var getActiveSeason = data.getActiveSeason;
  var activeSeason = getActiveSeason();

  // Try to get teamId from user object first, then fallback to editors localStorage
  var teamId = (currentUser as any)?.teamId || '';
  if (!teamId) {
    try {
      var eds = JSON.parse(localStorage.getItem('ffk_editors') || '[]');
      var edProfile = eds.find(function(ed: any) { return currentUser && ed.username === currentUser.username; });
      if (edProfile) teamId = edProfile.teamId;
    } catch(e) {}
  }
  var team = teamId ? getTeamById(teamId) : undefined;

  var _tab = useState<'players' | 'officials'>('players');
  var tab = _tab[0]; var setTab = _tab[1];

  var teamPlayers = data.players.filter(function(p) { return p.teamId === teamId && (activeSeason ? p.seasonId === activeSeason.id : true); });

  var _officials = useState<Official[]>(loadOfficials);
  var officials = _officials[0]; var setOfficials = _officials[1];
  var teamOfficials = officials.filter(function(o) { return o.teamId === teamId && (activeSeason ? o.seasonId === activeSeason.id : true); });

  useEffect(function() { saveOfficials(officials); }, [officials]);

  var _showPlayerForm = useState(false);
  var showPlayerForm = _showPlayerForm[0]; var setShowPlayerForm = _showPlayerForm[1];
  var _pf = useState({ firstName: '', lastName: '', jerseyNumber: '', photo: '' });
  var pf = _pf[0]; var setPf = _pf[1];
  var _playerFile = useState<File | null>(null);
  var playerFile = _playerFile[0]; var setPlayerFile = _playerFile[1];
  var _playerUploading = useState(false);
  var playerUploading = _playerUploading[0]; var setPlayerUploading = _playerUploading[1];

  var _showOfficialForm = useState(false);
  var showOfficialForm = _showOfficialForm[0]; var setShowOfficialForm = _showOfficialForm[1];
  var _of = useState({ firstName: '', lastName: '', position: '', photo: '' });
  var of_ = _of[0]; var setOf = _of[1];
  var _officialFile = useState<File | null>(null);
  var officialFile = _officialFile[0]; var setOfficialFile = _officialFile[1];
  var _officialUploading = useState(false);
  var officialUploading = _officialUploading[0]; var setOfficialUploading = _officialUploading[1];

  var handleAddPlayer = async function() {
    if (!pf.firstName || !pf.lastName) return null;
    setPlayerUploading(true);
    var photoUrl = pf.photo;
    if (playerFile) {
      var tempId = uuidv4();
      photoUrl = await uploadPlayerPhoto(playerFile, tempId);
    }
    data.addPlayer({
      firstName: pf.firstName,
      lastName: pf.lastName,
      photo: photoUrl || '',
      teamId: teamId,
      seasonId: activeSeason ? activeSeason.id : '',
      position: pf.jerseyNumber || '',
    });
    setPf({ firstName: '', lastName: '', jerseyNumber: '', photo: '' });
    setPlayerFile(null);
    setShowPlayerForm(false);
    setPlayerUploading(false);
  };

  var handleDeletePlayer = function(id: string) {
    data.deletePlayer(id);
  };

  var handleAddOfficial = async function() {
    if (!of_.firstName || !of_.lastName || !of_.position) return null;
    setOfficialUploading(true);
    var photoUrl = of_.photo;
    if (officialFile) {
      var tempId = uuidv4();
      photoUrl = await uploadPlayerPhoto(officialFile, tempId);
    }
    var newOff: Official = {
      id: uuidv4(),
      firstName: of_.firstName,
      lastName: of_.lastName,
      position: of_.position,
      photo: photoUrl || '',
      teamId: teamId,
      seasonId: activeSeason ? activeSeason.id : '',
      addedByEditorId: currentUser ? (currentUser as any).id : '',
    };
    setOfficials([newOff].concat(officials));
    setOf({ firstName: '', lastName: '', position: '', photo: '' });
    setOfficialFile(null);
    setShowOfficialForm(false);
    setOfficialUploading(false);
  };

  var handleDeleteOfficial = function(id: string) {
    setOfficials(officials.filter(function(o) { return o.id !== id; }));
  };

  var FileUploadField: React.FC<{ file: File | null; setFile: (f: File | null) => void; photoUrl: string; setPhotoUrl: (url: string) => void }> = function(props) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Foto (opsionale)</label>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm cursor-pointer hover:bg-gray-50 transition-colors flex-1">
            ▲
            <span className="text-gray-500 truncate">{props.file ? props.file.name : 'Ngarko foto nga PC'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={function(e) { if (e.target.files && e.target.files[0]) { props.setFile(e.target.files[0]); props.setPhotoUrl(''); } }} />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">ose</span>
        </div>
        <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="URL e fotos" value={props.photoUrl} onChange={function(e) { props.setPhotoUrl(e.target.value); props.setFile(null); }} />
        {props.file && (
          <div className="flex items-center gap-2">
            <img src={URL.createObjectURL(props.file)} alt="" className="w-10 h-10 rounded-full object-cover border" />
            <button onClick={function() { props.setFile(null); }} className="text-xs text-red-500 hover:underline">Largo</button>
          </div>
        )}
      </div>
    );
  };

  if (!team) {
    return (
      <div className="text-center py-16 text-gray-500">
        
        <p className="text-lg font-medium">Nuk u gjet skuadra juaj</p>
        <p className="text-sm mt-2">Kontaktoni administratorin per ta zgjidhur kete problem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-6 text-white flex items-center gap-4">
        {team.logo && <img src={team.logo} alt="" className="w-16 h-16 rounded-xl bg-white/10 p-1" />}
        <div>
          <h2 className="text-xl font-bold">{team.name}</h2>
          <p className="text-white/70 text-sm mt-1">Editor Panel - Menaxho lojtaret dhe zyrtaret e skuadres</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={function() { setTab('players'); }} className={'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ' + (tab === 'players' ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
           Lojtaret ({teamPlayers.length})
        </button>
        <button onClick={function() { setTab('officials'); }} className={'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ' + (tab === 'officials' ? 'bg-[#1E6FF2] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
           Zyrtaret ({teamOfficials.length})
        </button>
      </div>

      {tab === 'players' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Lojtaret e Skuadres</h3>
            <button onClick={function() { setShowPlayerForm(!showPlayerForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors">
               Shto Lojtar
            </button>
          </div>

          {showPlayerForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Lojtar i Ri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Emri" value={pf.firstName} onChange={function(e) { setPf(Object.assign({}, pf, { firstName: e.target.value })); }} />
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Mbiemri" value={pf.lastName} onChange={function(e) { setPf(Object.assign({}, pf, { lastName: e.target.value })); }} />
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Nr. Fanelles" value={pf.jerseyNumber} onChange={function(e) { setPf(Object.assign({}, pf, { jerseyNumber: e.target.value })); }} />
                <FileUploadField file={playerFile} setFile={setPlayerFile} photoUrl={pf.photo} setPhotoUrl={function(url) { setPf(Object.assign({}, pf, { photo: url })); }} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddPlayer} disabled={playerUploading} className="px-5 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors disabled:opacity-50">
                  {playerUploading ? 'Duke ngarkuar...' : 'Ruaj Lojtarin'}
                </button>
                <button onClick={function() { setShowPlayerForm(false); setPlayerFile(null); }} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Anulo</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamPlayers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                
                <p className="text-sm">Nuk ka lojtare te regjistruar</p>
              </div>
            ) : teamPlayers.map(function(p) {
              return (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.firstName} {p.lastName}</p>
                    {p.position && <p className="text-xs text-gray-500">Nr. {p.position}</p>}
                  </div>
                  <button onClick={function() { handleDeletePlayer(p.id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    ✗
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'officials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Zyrtaret e Skuadres</h3>
            <button onClick={function() { setShowOfficialForm(!showOfficialForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors">
               Shto Zyrtar
            </button>
          </div>

          {showOfficialForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Zyrtar i Ri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Emri" value={of_.firstName} onChange={function(e) { setOf(Object.assign({}, of_, { firstName: e.target.value })); }} />
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Mbiemri" value={of_.lastName} onChange={function(e) { setOf(Object.assign({}, of_, { lastName: e.target.value })); }} />
                <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]" placeholder="Pozita (Trajner, Asistent, etj.)" value={of_.position} onChange={function(e) { setOf(Object.assign({}, of_, { position: e.target.value })); }} />
                <FileUploadField file={officialFile} setFile={setOfficialFile} photoUrl={of_.photo} setPhotoUrl={function(url) { setOf(Object.assign({}, of_, { photo: url })); }} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddOfficial} disabled={officialUploading} className="px-5 py-2.5 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors disabled:opacity-50">
                  {officialUploading ? 'Duke ngarkuar...' : 'Ruaj Zyrtarin'}
                </button>
                <button onClick={function() { setShowOfficialForm(false); setOfficialFile(null); }} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Anulo</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamOfficials.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                
                <p className="text-sm">Nuk ka zyrtare te regjistruar</p>
              </div>
            ) : teamOfficials.map(function(o) {
              return (
                <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {o.photo ? <img src={o.photo} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{o.firstName} {o.lastName}</p>
                    <p className="text-xs text-gray-500">{o.position}</p>
                  </div>
                  <button onClick={function() { handleDeleteOfficial(o.id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    ✗
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
