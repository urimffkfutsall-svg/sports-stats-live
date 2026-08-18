const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// 1) Change MatchGrid to accept optional week number
s = s.replace(
  "const MatchGrid: React.FC<{ matchList: Match[]; title: string }> = ({ matchList, title }) => {",
  "const MatchGrid: React.FC<{ matchList: Match[]; title: string; week?: number }> = ({ matchList, title, week }) => {"
);

// 2) Add "Java X" badge next to title in both empty and filled versions
// Filled version - add week badge after title
s = s.replace(
  `<span className="w-1 h-5 bg-[#1E6FF2] rounded-full" />
            {title}
          </h3>
          <p className="text-gray-400 text-xs text-center py-6 bg-white rounded-xl border border-gray-100">`,
  `<span className="w-1 h-5 bg-[#1E6FF2] rounded-full" />
            {title}
            {week && <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2.5 py-0.5 rounded-full border border-[#1E6FF2]/15">Java {week}</span>}
          </h3>
          <p className="text-gray-400 text-xs text-center py-6 bg-white rounded-xl border border-gray-100">`
);

// Main title with matches
s = s.replace(
  `<span className="w-1 h-5 bg-[#1E6FF2] rounded-full" />
            {title}
            <span className="ml-auto text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">{matchList.length}</span>`,
  `<span className="w-1 h-5 bg-[#1E6FF2] rounded-full" />
            {title}
            {week && <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2.5 py-0.5 rounded-full border border-[#1E6FF2]/15">Java {week}</span>}
            <span className="ml-auto text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">{matchList.length}</span>`
);

// 3) Change getCompMatches to also return the week number
// Replace the function to return { matches, week }
s = s.replace(
  `const getCompMatches = (compId: string | undefined, status: string) => {
    if (!compId) return [];
    const filtered = seasonMatches.filter(m => m.competitionId === compId && m.isFeaturedLanding);
    if (status === 'finished') {
      const fin = filtered.filter(m => m.status === 'finished');
      if (fin.length === 0) return [];
      const maxWeek = Math.max(...fin.map(m => m.week || 0));
      return fin.filter(m => m.week === maxWeek).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }
    if (status === 'planned') return filtered.filter(m => m.status === 'planned').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (status === 'live') return filtered.filter(m => m.status === 'live');
    return [];
  };`,
  `const getCompMatches = (compId: string | undefined, status: string): { matches: Match[]; week?: number } => {
    if (!compId) return { matches: [] };
    const filtered = seasonMatches.filter(m => m.competitionId === compId && m.isFeaturedLanding);
    if (status === 'finished') {
      const fin = filtered.filter(m => m.status === 'finished');
      if (fin.length === 0) return { matches: [] };
      const maxWeek = Math.max(...fin.map(m => m.week || 0));
      return { matches: fin.filter(m => m.week === maxWeek).sort((a, b) => (b.date || '').localeCompare(a.date || '')), week: maxWeek };
    }
    if (status === 'planned') {
      const pl = filtered.filter(m => m.status === 'planned').sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      const minWeek = pl.length > 0 ? Math.min(...pl.map(m => m.week || 0)) : undefined;
      return { matches: pl, week: minWeek };
    }
    if (status === 'live') return { matches: filtered.filter(m => m.status === 'live') };
    return { matches: [] };
  };`
);

// 4) Update the variables that use getCompMatches
s = s.replace(
  `const superligaMatches = getCompMatches(superligaComp?.id, currentStatus);
  const ligaPareMatches = getCompMatches(ligaPareComp?.id, currentStatus);
  const hasAny = superligaMatches.length > 0 || ligaPareMatches.length > 0;`,
  `const superligaData = getCompMatches(superligaComp?.id, currentStatus);
  const ligaPareData = getCompMatches(ligaPareComp?.id, currentStatus);
  const superligaMatches = superligaData.matches;
  const ligaPareMatches = ligaPareData.matches;
  const hasAny = superligaMatches.length > 0 || ligaPareMatches.length > 0;`
);

// 5) Pass week to MatchGrid
s = s.replace(
  '<MatchGrid matchList={superligaMatches} title="Superliga e Kosoves" />',
  '<MatchGrid matchList={superligaMatches} title="Superliga e Kosoves" week={superligaData.week} />'
);
s = s.replace(
  '<MatchGrid matchList={ligaPareMatches} title="Liga e Pare" />',
  '<MatchGrid matchList={ligaPareMatches} title="Liga e Pare" week={ligaPareData.week} />'
);

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");
console.log("[OK] LandingMatches.tsx — Java X badge added to match sections");
