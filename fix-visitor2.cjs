const fs = require("fs");

// Add visitor tracking in DataContext's loadData useEffect
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// Add dbVisitors to import
if (!ctx.includes("dbVisitors")) {
  ctx = ctx.replace(
    "import {\n  fetchAllData,\n  dbSeasons, dbCompetitions, dbTeams, dbPlayers, dbMatches, dbGoals, dbScorers, dbPlayerOfWeek, dbUsers, dbSettings, dbDecisions,\n  subscribeToMatches, subscribeToGoals, subscribeToTable,\n} from '@/lib/supabase-db';",
    "import {\n  fetchAllData,\n  dbSeasons, dbCompetitions, dbTeams, dbPlayers, dbMatches, dbGoals, dbScorers, dbPlayerOfWeek, dbUsers, dbSettings, dbDecisions,\n  subscribeToMatches, subscribeToGoals, subscribeToTable,\n  dbVisitors,\n} from '@/lib/supabase-db';"
  );
}

// Add visitor tracking after the loadData useEffect (line 240-242)
if (!ctx.includes("visitor_tracked")) {
  ctx = ctx.replace(
    "  useEffect(() => {\n    loadData();\n  }, [loadData]);",
    `  useEffect(() => {
    loadData();
  }, [loadData]);

  // Track visitor once per session
  useEffect(() => {
    const tracked = sessionStorage.getItem('visitor_tracked');
    if (!tracked) {
      dbVisitors.track();
      sessionStorage.setItem('visitor_tracked', '1');
    }
  }, []);`
  );
}

fs.writeFileSync("src/context/DataContext.tsx", ctx, "utf8");
console.log("[OK] DataContext - visitor tracking added");
console.log("Has dbVisitors import: " + ctx.includes("dbVisitors"));
console.log("Has visitor_tracked: " + ctx.includes("visitor_tracked"));
