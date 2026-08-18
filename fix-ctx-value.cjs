const fs = require("fs");
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// Find the value object and add the missing functions before refreshData
ctx = ctx.replace(
  /const value: DataContextType = \{[\s\S]*?refreshData/,
  (match) => {
    if (match.includes("addVideo")) return match; // already there
    return match.replace(
      "refreshData",
      "addVideo, updateVideo, deleteVideo,\n    addNews, updateNews, deleteNews,\n    refreshData"
    );
  }
);

fs.writeFileSync("src/context/DataContext.tsx", ctx, "utf8");

// Verify
const valueMatch = ctx.match(/const value: DataContextType = \{[\s\S]*?\};/);
console.log("Value now has addVideo: " + valueMatch[0].includes("addVideo"));
console.log("Value now has addNews: " + valueMatch[0].includes("addNews"));
console.log("[OK] DataContext.tsx fixed");
