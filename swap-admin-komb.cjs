const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Replace import
admin = admin.replace(
  "import AdminKombetarja from './admin/AdminKombetarja';",
  "import AdminKombetarja from './admin/AdminNationalTeam';"
);

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");
console.log("[OK] AdminKombetarja now points to AdminNationalTeam");

// Verify
const final = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
console.log("Has AdminNationalTeam import: " + final.includes("AdminNationalTeam"));
