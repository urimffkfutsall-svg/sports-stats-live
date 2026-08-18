const fs = require("fs");
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// Add videos and news to the setState in loadData
// Find "decisions: data.decisions || []," and add videos/news after it
if (!ctx.includes("videos: videosData")) {
  ctx = ctx.replace(
    "decisions: data.decisions || [],",
    "decisions: data.decisions || [],\n        videos: (videosData || []) as Video[],\n        news: (newsData || []) as News[],"
  );
}

fs.writeFileSync("src/context/DataContext.tsx", ctx, "utf8");

// Verify
const has = ctx.includes("videos: (videosData");
console.log("setState now includes videos/news: " + has);
console.log("[OK] DataContext.tsx fixed");
