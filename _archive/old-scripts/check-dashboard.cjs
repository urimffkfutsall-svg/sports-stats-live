const fs = require("fs");

// Check AdminPage for dashboard tab
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");
console.log("=== AdminPage - dashboard render ===");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("dashboard") || lines[i].includes("Dashboard")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Check if there's a separate AdminDashboard component
const adminDir = fs.readdirSync("src/pages/admin");
console.log("\n=== admin directory ===");
adminDir.forEach(f => console.log(f));
