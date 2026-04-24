const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");

// Show lines 35-55 to see hook order vs early return
console.log("=== Lines 35-55 ===");
lines.slice(34, 55).forEach((l, i) => console.log((i+35) + ": " + l.trimEnd()));

// Show where DashCard is defined
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const DashCard")) {
    console.log("\nDashCard at line " + (i+1));
    console.log(lines[i].trimEnd());
  }
}

// Check the component function declaration
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const AdminPage") || lines[i].includes("function AdminPage")) {
    console.log("\nComponent at line " + (i+1) + ": " + lines[i].trimEnd());
  }
}

// Check export
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("export default")) {
    console.log("Export at line " + (i+1) + ": " + lines[i].trimEnd());
  }
}
