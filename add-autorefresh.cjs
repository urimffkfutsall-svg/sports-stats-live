const fs = require("fs");
let page = fs.readFileSync("src/pages/LiveStreamsPage.tsx", "utf8");

// Add auto-refresh every 15 seconds to check if streams are still live
page = page.replace(
  `useEffect(() => {
    dbLiveStreams.getAll().then(all => {
      const live = all.filter((s: any) => s.isLive);
      setStreams(live);
      if (live.length > 0) setSelectedStream(live[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);`,
  `useEffect(() => {
    const loadStreams = () => {
      dbLiveStreams.getAll().then(all => {
        const live = all.filter((s: any) => s.isLive);
        setStreams(prev => {
          // If selected stream is no longer live, deselect
          if (live.length === 0) {
            setSelectedStream(null);
          } else {
            setSelectedStream(current => {
              if (!current || !live.find((s: any) => s.id === current.id)) {
                return live[0];
              }
              return current;
            });
          }
          return live;
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    loadStreams();
    const interval = setInterval(loadStreams, 15000);
    return () => clearInterval(interval);
  }, []);`
);

fs.writeFileSync("src/pages/LiveStreamsPage.tsx", page, "utf8");
console.log("[OK] Auto-refresh every 15s added to LiveStreamsPage");
console.log("Has setInterval: " + page.includes("setInterval"));
console.log("Has clearInterval: " + page.includes("clearInterval"));
