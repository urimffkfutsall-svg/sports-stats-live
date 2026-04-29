const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");

// Find }; (component end) and DashCard
for (let i = 240; i < lines.length; i++) {
  console.log((i+1) + ": " + lines[i]?.trimEnd());
}
