const fs = require("fs");
const files = [
  "src/types/index.ts",
  "src/App.tsx",
  "src/pages/admin/AdminPage.tsx",
  "src/context/DataContext.tsx"
];
for (const f of files) {
  try {
    const c = fs.readFileSync(f, "utf8");
    const lines = c.split("\n");
    console.log("\n========== " + f + " (" + lines.length + " lines) ==========");
    // For large files show first 80 and last 30 lines
    if (lines.length > 150) {
      console.log(lines.slice(0, 80).join("\n"));
      console.log("\n... [" + (lines.length - 110) + " lines hidden] ...\n");
      console.log(lines.slice(-30).join("\n"));
    } else {
      console.log(c);
    }
  } catch(e) {
    console.log("\n[MISSING] " + f);
  }
}
