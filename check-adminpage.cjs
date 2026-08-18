const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");

// Find tabs and imports
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("import Admin") || lines[i].includes("Kombetarja") || lines[i].includes("tabs") || lines[i].includes("'Skuadrat &")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
