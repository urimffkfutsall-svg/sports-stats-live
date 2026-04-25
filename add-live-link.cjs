const fs = require("fs");
let header = fs.readFileSync("src/components/Header.tsx", "utf8");

// Add Live link after Ballina
header = header.replace(
  "{ path: '/', label: 'Ballina' },",
  "{ path: '/', label: 'Ballina' },\n    { path: '/live', label: 'Live' },"
);

fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Added Live link in Header");

// Verify
const final = fs.readFileSync("src/components/Header.tsx", "utf8");
console.log("Has /live: " + final.includes("/live"));
