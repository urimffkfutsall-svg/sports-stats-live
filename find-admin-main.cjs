const fs = require("fs");
// Find the main admin file that has tabs
const check = ["src/pages/admin/EditorPanel.tsx", "src/pages/admin/AdminKombetarja.tsx"];
check.forEach(f => {
  try {
    const c = fs.readFileSync(f, "utf8");
    if (c.includes("activeTab") || c.includes("tabs")) {
      console.log(f + " has tabs logic");
    }
    if (c.includes("AdminLiveControl")) {
      console.log(f + " imports AdminLiveControl");
    }
  } catch {}
});

// Check App.tsx for admin route
let app = fs.readFileSync("src/App.tsx", "utf8");
const lines = app.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("admin") || lines[i].includes("Admin")) {
    console.log("App.tsx " + (i+1) + ": " + lines[i].trimEnd());
  }
}
