const fs = require("fs");

// 1) Remove from Header navigation
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
header = header.replace("    { path: '/komisioni', label: 'Komisioni' },\n", "");
header = header.replace("    { path: '/kombetarja', label: 'Kombetarja' },\n", "");
fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Header - removed Komisioni/Kombetarja links");

// 2) Remove routes from App.tsx
let app = fs.readFileSync("src/App.tsx", "utf8");
app = app.replace("import KomisioniPage from \"./pages/KomisioniPage\";\n", "");
app = app.replace("import KombetarjaPage from \"./pages/KombetarjaPage\";\n", "");
app = app.replace(/\s*<Route path="\/komisioni"[^/]*\/>\n?/, "\n");
app = app.replace(/\s*<Route path="\/kombetarja"[^/]*\/>\n?/, "\n");
fs.writeFileSync("src/App.tsx", app, "utf8");
console.log("[OK] App.tsx - removed Komisioni/Kombetarja routes");

// Verify
const finalHeader = fs.readFileSync("src/components/Header.tsx", "utf8");
const finalApp = fs.readFileSync("src/App.tsx", "utf8");
console.log("Header has Komisioni: " + finalHeader.includes("komisioni"));
console.log("Header has Kombetarja: " + finalHeader.includes("kombetarja"));
console.log("App has Komisioni route: " + finalApp.includes("komisioni"));
console.log("App has Kombetarja route: " + finalApp.includes("kombetarja"));
