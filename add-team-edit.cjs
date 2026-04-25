const fs = require("fs");
let ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Add editing state
ant = ant.replace(
  "const [editingMatchId, setEditingMatchId] = useState('');",
  "const [editingMatchId, setEditingMatchId] = useState('');\n  const [editingTeamId, setEditingTeamId] = useState('');"
);

// Replace handleAddTeam with handleSaveTeam that supports edit
ant = ant.replace(
  `const handleAddTeam = async () => {
    if (!teamName.trim() || !selectedGroupId) { alert('Ploteso emrin dhe zgjidh grupin'); return; }
    try {
      await dbNtGroupTeams.upsert({ id: crypto.randomUUID(), groupId: selectedGroupId, teamName: teamName.trim(), teamLogo: teamLogo.trim() || null, isKosova });
      setTeamName(''); setTeamLogo(''); setIsKosova(false);
      load();
    } catch (err) {
      console.error('Add team error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };`,
  `const handleSaveTeam = async () => {
    if (!teamName.trim() || !selectedGroupId) { alert('Ploteso emrin dhe zgjidh grupin'); return; }
    try {
      const teamData: any = {
        id: editingTeamId || crypto.randomUUID(),
        groupId: selectedGroupId,
        teamName: teamName.trim(),
        isKosova
      };
      if (teamLogo.trim()) teamData.teamLogo = teamLogo.trim();
      else if (editingTeamId) {
        const existing = groupTeams.find(t => t.id === editingTeamId);
        if (existing?.teamLogo) teamData.teamLogo = existing.teamLogo;
      }
      await dbNtGroupTeams.upsert(teamData);
      setTeamName(''); setTeamLogo(''); setIsKosova(false); setEditingTeamId('');
      load();
    } catch (err) {
      console.error('Save team error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };

  const handleEditTeam = (t: any) => {
    setEditingTeamId(t.id);
    setTeamName(t.teamName || '');
    setTeamLogo(t.teamLogo || '');
    setIsKosova(t.isKosova || false);
    setSelectedGroupId(t.groupId);
  };`
);

// Replace onClick={handleAddTeam} with handleSaveTeam
ant = ant.replace('onClick={handleAddTeam}', 'onClick={handleSaveTeam}');

// Change button text to show Edit/Add
ant = ant.replace(
  '>Shto</button>\n                      </div>',
  '>{editingTeamId ? \'Ruaj\' : \'Shto\'}</button>\n                        {editingTeamId && <button onClick={() => { setEditingTeamId(\'\'); setTeamName(\'\'); setTeamLogo(\'\'); setIsKosova(false); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Anulo</button>}\n                      </div>'
);

// Add edit button to each team chip
ant = ant.replace(
  '<button onClick={() => handleDeleteTeam(t.id)} className="text-red-400 hover:text-red-600 ml-1">x</button>',
  '<button onClick={() => handleEditTeam(t)} className="text-blue-400 hover:text-blue-600 ml-1" title="Edito">&#9998;</button>\n                            <button onClick={() => handleDeleteTeam(t.id)} className="text-red-400 hover:text-red-600 ml-1">x</button>'
);

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", ant, "utf8");
console.log("[OK] Team edit functionality added");
console.log("Has handleEditTeam: " + ant.includes("handleEditTeam"));
console.log("Has handleSaveTeam: " + ant.includes("handleSaveTeam"));
console.log("Has editingTeamId: " + ant.includes("editingTeamId"));
