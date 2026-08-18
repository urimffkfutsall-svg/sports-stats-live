const fs = require("fs");

// =====================================================
// 1) LANDING MATCHES — Add Kupa section
// =====================================================
let landing = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Add kupa competition detection
if (!landing.includes("kupaComp")) {
  landing = landing.replace(
    "const ligaPareComp = useMemo",
    `const kupaComp = useMemo(() =>
    competitions.find(c => c.type === 'kupa' && (activeSeason ? c.seasonId === activeSeason.id : true)),
    [competitions, activeSeason]
  );

  const ligaPareComp = useMemo`
  );

  // Add kupa matches
  landing = landing.replace(
    "const superligaMatches = superligaData.matches;",
    `const kupaData = getCompMatches(kupaComp?.id, currentStatus);
  const superligaMatches = superligaData.matches;`
  );

  landing = landing.replace(
    "const ligaPareMatches = ligaPareData.matches;",
    `const ligaPareMatches = ligaPareData.matches;
  const kupaMatches = kupaData.matches;`
  );

  // Update hasAny to include kupa
  landing = landing.replace(
    "const hasAny = superligaMatches.length > 0 || ligaPareMatches.length > 0;",
    "const hasAny = superligaMatches.length > 0 || ligaPareMatches.length > 0 || kupaMatches.length > 0;"
  );

  // Add kupa MatchGrid after liga pare
  landing = landing.replace(
    '<MatchGrid matchList={ligaPareMatches} title="Liga e Pare" week={ligaPareData.week} />',
    `<MatchGrid matchList={ligaPareMatches} title="Liga e Pare" week={ligaPareData.week} />
        <MatchGrid matchList={kupaMatches} title="Kupa e Kosoves" week={kupaData.week} />`
  );
}

fs.writeFileSync("src/components/LandingMatches.tsx", landing, "utf8");
console.log("[OK] LandingMatches.tsx — Kupa section added to landing");

// =====================================================
// 2) Verify KupaPage loads correctly (check comp filter)
// =====================================================
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Make sure it's using the correct comp type
const hasKupaFilter = kupa.includes("c.type === 'kupa'");
console.log("KupaPage has kupa filter: " + hasKupaFilter);

// Check if getGoalsByMatch is being used (it was in the previous version)
const hasGetGoals = kupa.includes("getGoalsByMatch");
console.log("KupaPage has getGoalsByMatch: " + hasGetGoals);

// =====================================================
// 3) Fix LandingMatches week label for kupa rounds
// =====================================================
landing = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// In MatchGrid, the week badge shows "Java X" - for kupa it should show round names
// Add round name detection in MatchGrid
if (!landing.includes("kupaRoundNames")) {
  landing = landing.replace(
    "const MatchGrid: React.FC<{ matchList: Match[]; title: string; week?: number }> = ({ matchList, title, week }) => {",
    `const kupaRoundNames: Record<number, string> = { 1: 'Raundi 1', 2: 'Cerekfinalet', 3: 'Gjysmefinalet', 4: 'Finalja' };
  const MatchGrid: React.FC<{ matchList: Match[]; title: string; week?: number; isKupa?: boolean }> = ({ matchList, title, week, isKupa }) => {
    const weekLabel = isKupa && week ? (kupaRoundNames[week] || \`Raundi \${week}\`) : week ? \`Java \${week}\` : '';`
  );

  // Replace {week && badge with weekLabel
  // There are two instances of the week badge
  const weekBadge = '{week && <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2.5 py-0.5 rounded-full border border-[#1E6FF2]/15">Java {week}</span>}';
  const newWeekBadge = '{weekLabel && <span className="text-[10px] font-bold text-[#1E6FF2] bg-[#1E6FF2]/10 px-2.5 py-0.5 rounded-full border border-[#1E6FF2]/15">{weekLabel}</span>}';
  
  // Replace all occurrences
  while (landing.includes(weekBadge)) {
    landing = landing.replace(weekBadge, newWeekBadge);
  }

  // Pass isKupa prop to kupa MatchGrid
  landing = landing.replace(
    '<MatchGrid matchList={kupaMatches} title="Kupa e Kosoves" week={kupaData.week} />',
    '<MatchGrid matchList={kupaMatches} title="Kupa e Kosoves" week={kupaData.week} isKupa />'
  );
}

fs.writeFileSync("src/components/LandingMatches.tsx", landing, "utf8");
console.log("[OK] LandingMatches.tsx — Kupa shows round names instead of Java X");

// =====================================================
// 4) Check competitions types in supabase-db
// =====================================================
// Check that 'kupa' type exists
let typesFile = fs.readFileSync("src/types/index.ts", "utf8");
if (typesFile.includes("CompetitionType")) {
  const ctIdx = typesFile.indexOf("CompetitionType");
  const ctEnd = typesFile.indexOf(";", ctIdx);
  console.log("\nCompetitionType: " + typesFile.substring(ctIdx, ctEnd));
}

console.log("\nAll fixes applied successfully!");
