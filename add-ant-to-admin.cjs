const fs = require("fs");
let admin = fs.readFileSync("src/pages/admin/AdminPage.tsx", "utf8");

// Check if already imported
if (!admin.includes("AdminNationalTeam")) {
  // Add import
  admin = admin.replace(
    "import AdminLiveControl from './AdminLiveControl';",
    "import AdminLiveControl from './AdminLiveControl';\nimport AdminNationalTeam from './AdminNationalTeam';"
  );

  // Find tabs array and add Kombetarja tab
  admin = admin.replace(
    "{ key: 'live', label: 'LIVE Control' }",
    "{ key: 'live', label: 'LIVE Control' },\n    { key: 'kombetarja', label: 'Kombetarja' }"
  );

  // Add tab content rendering
  admin = admin.replace(
    "{activeTab === 'live' && <AdminLiveControl />}",
    "{activeTab === 'live' && <AdminLiveControl />}\n          {activeTab === 'kombetarja' && <AdminNationalTeam />}"
  );

  fs.writeFileSync("src/pages/admin/AdminPage.tsx", admin, "utf8");
  console.log("[OK] AdminNationalTeam added to AdminPage");
} else {
  console.log("[SKIP] Already in AdminPage");
}

// Also update KombetarjaPage to show competitions/groups/ranking
console.log("\nNow update KombetarjaPage to display competitions...");
