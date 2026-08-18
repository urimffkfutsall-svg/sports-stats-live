const fs = require("fs");
const path = require("path");

function searchFiles(dir, term) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !f.includes("node_modules") && !f.includes(".git")) {
      searchFiles(full, term);
    } else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("Lajmet") || content.includes("featuredNews") || content.includes("newsSection")) {
        console.log(full);
      }
    }
  });
}

searchFiles("src", "Lajmet");
