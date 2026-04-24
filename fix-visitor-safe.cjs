const fs = require("fs");

// Make visitor tracking non-blocking / error-safe
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

ctx = ctx.replace(
  `  // Track visitor once per session
  useEffect(() => {
    const tracked = sessionStorage.getItem('visitor_tracked');
    if (!tracked) {
      dbVisitors.track();
      sessionStorage.setItem('visitor_tracked', '1');
    }
  }, []);`,
  `  // Track visitor once per session
  useEffect(() => {
    try {
      const tracked = sessionStorage.getItem('visitor_tracked');
      if (!tracked) {
        dbVisitors.track().catch(() => {});
        sessionStorage.setItem('visitor_tracked', '1');
      }
    } catch {}
  }, []);`
);

fs.writeFileSync("src/context/DataContext.tsx", ctx, "utf8");

// Also make AdminPage visitor stats non-blocking
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
admin = admin.replace(
  "dbVisitors.getStats().then(setVisitorStats);",
  "dbVisitors.getStats().then(setVisitorStats).catch(() => {});"
);

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");
console.log("[OK] Made visitor tracking error-safe (non-blocking)");
