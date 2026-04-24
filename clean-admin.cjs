const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = admin.split("\n");

// Remove lines 253-265 (the duplicate code outside component)
// Keep line 252 (};) and line 267 (export default)
const newLines = [
  ...lines.slice(0, 252),  // lines 1-252 (component end)
  '',
  'export default AdminPage;',
  '',
];

fs.writeFileSync("src/pages/AdminPage.tsx", newLines.join("\n"), "utf8");

// Verify
const final = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const fLines = final.split("\n");
console.log("Total lines: " + fLines.length);
console.log("=== Last 5 lines ===");
fLines.slice(-5).forEach((l, i) => console.log((fLines.length - 5 + i + 1) + ": " + l.trimEnd()));

const compEnd = final.lastIndexOf("};");
const afterComp = final.substring(compEnd + 2);
console.log("\nHooks outside: " + (afterComp.includes("useState") || afterComp.includes("useEffect")));
console.log("DashCard inside: " + final.substring(0, compEnd).includes("DashCard"));
console.log("[OK] Cleaned up");
