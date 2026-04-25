const fs = require("fs");
const path = require("path");

// Find all files using #0A1E3C or from-[#0A1E3C] or similar dark blue colors
function search(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && !f.includes("node_modules") && !f.includes(".git")) search(full);
    else if (f.endsWith(".tsx") || f.endsWith(".ts") || f.endsWith(".css")) {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes("0A1E3C") || c.includes("0a1e3c")) {
        const count = (c.match(/0A1E3C/gi) || []).length;
        console.log(full + " (" + count + " occurrences)");
      }
    }
  });
}
search("src");
