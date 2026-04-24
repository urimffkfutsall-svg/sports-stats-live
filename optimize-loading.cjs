const fs = require("fs");
let s = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// 1) Move videos + news into the main Promise.all (fetchAllData)
// Currently: fetchAllData() then Promise.all([dbVideos, dbNews])
// Fix: run all together

s = s.replace(
  `const data = await fetchAllData();
        const [videosData, newsData] = await Promise.all([dbVideos.getAll(), dbNews.getAll()]);`,
  `const [data, videosData, newsData] = await Promise.all([
        fetchAllData(),
        dbVideos.getAll(),
        dbNews.getAll(),
      ]);`
);

// 2) Add localStorage cache - show cached data instantly, then refresh in background
// Add cache save after setState
const cacheKey = 'ffk_cache_v2';

// After setState in loadData, save to localStorage
s = s.replace(
  `} catch (err) {
      console.error('Failed to load data from Supabase:', err);`,
  `// Cache data for faster next load
      try { localStorage.setItem('${cacheKey}', JSON.stringify({
        seasons: data.seasons, competitions: data.competitions, teams: data.teams,
        players: data.players, matches: data.matches, goals: data.goals,
        scorers: data.scorers, playersOfWeek: data.playersOfWeek,
        decisions: data.decisions || [], settings: data.settings,
        videos: videosData || [], news: newsData || [],
      })); } catch {}
    } catch (err) {
      console.error('Failed to load data from Supabase:', err);`
);

// 3) Add instant cache load BEFORE the async fetch
// Show cached data immediately, then overwrite with fresh data
s = s.replace(
  `const [isLoading, setIsLoading] = useState(true);`,
  `const [isLoading, setIsLoading] = useState(() => {
    // Try to load from cache instantly
    try {
      const cached = localStorage.getItem('${cacheKey}');
      if (cached) return false; // Don't show loading if we have cache
    } catch {}
    return true;
  });`
);

// Add cache hydration before loadData
s = s.replace(
  `// ============ INITIAL LOAD ============
  const loadData = useCallback(async () => {`,
  `// ============ CACHE HYDRATION ============
  useEffect(() => {
    try {
      const cached = localStorage.getItem('${cacheKey}');
      if (cached) {
        const d = JSON.parse(cached);
        setState(prev => ({
          ...prev,
          seasons: d.seasons || prev.seasons,
          competitions: d.competitions || prev.competitions,
          teams: d.teams || prev.teams,
          players: d.players || prev.players,
          matches: d.matches || prev.matches,
          goals: d.goals || prev.goals,
          scorers: d.scorers || prev.scorers,
          playersOfWeek: d.playersOfWeek || prev.playersOfWeek,
          decisions: d.decisions || prev.decisions,
          settings: d.settings || prev.settings,
          videos: d.videos || prev.videos,
          news: d.news || prev.news,
        }));
        setIsLoading(false);
      }
    } catch {}
  }, []);

  // ============ INITIAL LOAD ============
  const loadData = useCallback(async () => {`
);

fs.writeFileSync("src/context/DataContext.tsx", s, "utf8");
console.log("[OK] DataContext optimized:");
console.log("  1. Videos + News load in parallel with main data");
console.log("  2. Cached data loads instantly from localStorage");
console.log("  3. Fresh data loads in background and overwrites cache");
console.log("  4. Loading spinner only shows on first ever visit");
