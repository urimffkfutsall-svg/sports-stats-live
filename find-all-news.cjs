const fs = require("fs");

// Show AppLayout content
let al = fs.readFileSync("src/components/AppLayout.tsx", "utf8");
console.log("=== AppLayout ===");
console.log(al);

// Search ALL tsx files for "lajme" or "news" display
const path = require("path");
function search(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && !f.includes("node_modules") && !f.includes(".git")) search(full);
    else if (f.endsWith(".tsx") && !f.includes("Admin")) {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes("news") && (c.includes("map") || c.includes("filter"))) {
        console.log("\nFound news rendering: " + full);
      }
    }
  });
}
search("src");
