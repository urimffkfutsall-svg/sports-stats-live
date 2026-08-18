const fs = require("fs");
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// Check if functions exist
console.log("Has addVideo func: " + ctx.includes("const addVideo"));
console.log("Has addNews func: " + ctx.includes("const addNews"));
console.log("Has videos in state: " + ctx.includes("videos: Video[]"));
console.log("Has news in state: " + ctx.includes("news: News[]"));
console.log("Has Video import: " + ctx.includes("Video"));
console.log("Has News import: " + ctx.includes("News"));

// Check value object
const valueMatch = ctx.match(/const value: DataContextType = \{[\s\S]*?\};/);
if (valueMatch) {
  console.log("\nValue object includes addVideo: " + valueMatch[0].includes("addVideo"));
  console.log("Value object includes addNews: " + valueMatch[0].includes("addNews"));
}

// Check interface
console.log("\nInterface has addVideo: " + ctx.includes("addVideo:"));
console.log("Interface has addNews: " + ctx.includes("addNews:"));

// Check loadData
console.log("\nloadData has dbVideos: " + ctx.includes("dbVideos.getAll"));
console.log("loadData has dbNews: " + ctx.includes("dbNews.getAll"));

// Show lines around addVideo
const lines = ctx.split("\n");
lines.forEach((l, i) => {
  if (l.includes("addVideo") || l.includes("addNews") || l.includes("dbVideos") || l.includes("dbNews")) {
    console.log("L" + (i+1) + ": " + l.trim());
  }
});
