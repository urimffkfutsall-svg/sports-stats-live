const fs = require("fs");
let ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Remove uuid import
ant = ant.replace("import { v4 as uuidv4 } from 'uuid';\n", "");

// Replace all uuidv4() with crypto.randomUUID()
ant = ant.replace(/uuidv4\(\)/g, "crypto.randomUUID()");

// Also the issue might be that supabase needs us to NOT send id if we want auto-gen
// Actually let's keep crypto.randomUUID() since it generates proper UUIDs

// The real issue is likely that handleAddTeam checks selectedGroupId
// but the filter shows teams from selectedGroupTeamsList which might not match
// Let me check the flow more carefully

// Also possible: teamLogo as base64 is too large for TEXT column
// Fix: skip logo if empty, don't send empty string
ant = ant.replace(
  "teamLogo: teamLogo.trim()",
  "...(teamLogo.trim() ? { teamLogo: teamLogo.trim() } : {})"
);

// Wait, that won't work in an object spread like that. Let me fix properly
// Revert and handle differently
ant = ant.replace(
  "...(teamLogo.trim() ? { teamLogo: teamLogo.trim() } : {})",
  "teamLogo: teamLogo.trim() || null"
);

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", ant, "utf8");
console.log("[OK] Fixed: crypto.randomUUID + teamLogo null handling");

// Now let's also add error logging to see what fails
ant = fs.readFileSync("src/pages/admin/AdminNationalTeam.tsx", "utf8");

// Add try-catch with alert to handleAddTeam
ant = ant.replace(
  `const handleAddTeam = async () => {
    if (!teamName.trim() || !selectedGroupId) return;
    await dbNtGroupTeams.upsert({ id: crypto.randomUUID(), groupId: selectedGroupId, teamName: teamName.trim(), teamLogo: teamLogo.trim() || null, isKosova });
    setTeamName(''); setTeamLogo(''); setIsKosova(false);
    load();
  };`,
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
  };`
);

// Same for handleAddComp
ant = ant.replace(
  `const handleAddComp = async () => {
    if (!compName.trim()) return;
    await dbNtCompetitions.upsert({ id: crypto.randomUUID(), name: compName.trim(), year: compYear.trim() });
    setCompName(''); setCompYear('');
    load();
  };`,
  `const handleAddComp = async () => {
    if (!compName.trim()) return;
    try {
      await dbNtCompetitions.upsert({ id: crypto.randomUUID(), name: compName.trim(), year: compYear.trim() });
      setCompName(''); setCompYear('');
      load();
    } catch (err) {
      console.error('Add comp error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };`
);

// Same for handleAddGroup
ant = ant.replace(
  `const handleAddGroup = async () => {
    if (!groupName.trim() || !selectedCompId) return;
    await dbNtGroups.upsert({ id: crypto.randomUUID(), competitionId: selectedCompId, name: groupName.trim() });
    setGroupName('');
    load();
  };`,
  `const handleAddGroup = async () => {
    if (!groupName.trim() || !selectedCompId) return;
    try {
      await dbNtGroups.upsert({ id: crypto.randomUUID(), competitionId: selectedCompId, name: groupName.trim() });
      setGroupName('');
      load();
    } catch (err) {
      console.error('Add group error:', err);
      alert('Gabim: ' + (err as any)?.message);
    }
  };`
);

fs.writeFileSync("src/pages/admin/AdminNationalTeam.tsx", ant, "utf8");
console.log("[OK] Added error handling with alerts");
