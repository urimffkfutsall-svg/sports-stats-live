const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Add import
admin = admin.replace(
  "import AdminNews from './admin/AdminNews';",
  "import AdminNews from './admin/AdminNews';\nimport AdminPlayoff from './admin/AdminPlayoff';"
);

// Add tab
admin = admin.replace(
  "{ key: 'kombetarja', label: 'Kombetarja', icon: null, editorAccess: false },",
  "{ key: 'kombetarja', label: 'Kombetarja', icon: null, editorAccess: false },\n    { key: 'playoff', label: 'PlayOff', icon: null, editorAccess: false },"
);

// Add render
admin = admin.replace(
  "{activeTab === 'kombetarja' && isAdmin && <AdminKombetarja />}",
  "{activeTab === 'kombetarja' && isAdmin && <AdminKombetarja />}\n        {activeTab === 'playoff' && isAdmin && <AdminPlayoff />}"
);

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");
console.log("[OK] AdminPlayoff tab added");
console.log("Has import: " + admin.includes("AdminPlayoff"));
console.log("Has tab: " + admin.includes("key: 'playoff'"));
console.log("Has render: " + admin.includes("<AdminPlayoff />"));
