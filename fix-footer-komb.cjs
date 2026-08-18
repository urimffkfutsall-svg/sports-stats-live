const fs = require("fs");

// =====================================================
// 1) Fix Footer logo - use settings.logo (which works) as fallback
// =====================================================
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
footer = footer.replace(
  '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Football_Federation_of_Kosovo_logo.svg/200px-Football_Federation_of_Kosovo_logo.svg.png" alt="FFK" className="h-16 w-auto" />',
  '{settings.logo && <img src={settings.logo} alt="FFK" className="h-16 w-auto" />}'
);
fs.writeFileSync("src/components/Footer.tsx", footer, "utf8");
console.log("[OK] Footer logo - uses settings.logo");

// =====================================================
// 2) Add Kombetarja route back in App.tsx
// =====================================================
let app = fs.readFileSync("src/App.tsx", "utf8");
if (!app.includes("KombetarjaPage")) {
  app = app.replace(
    'import LiveMatchPage from "./pages/LiveMatchPage";',
    'import LiveMatchPage from "./pages/LiveMatchPage";\nimport KombetarjaPage from "./pages/KombetarjaPage";'
  );
  app = app.replace(
    '<Route path="/live"',
    '<Route path="/kombetarja" element={<KombetarjaPage />} />\n                <Route path="/live"'
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[OK] Kombetarja route added");
}

// =====================================================
// 3) Add Kombetarja link in Header
// =====================================================
let header = fs.readFileSync("src/components/Header.tsx", "utf8");
if (!header.includes("kombetarja")) {
  header = header.replace(
    "{ path: '/statistikat', label: 'Statistikat' },",
    "{ path: '/statistikat', label: 'Statistikat' },\n    { path: '/kombetarja', label: 'Kombetarja' },"
  );
  fs.writeFileSync("src/components/Header.tsx", header, "utf8");
  console.log("[OK] Kombetarja link added in Header");
}

console.log("\n[DONE] Footer fixed + Kombetarja visible for visitors");
console.log("Now tell me what changes you want on KombetarjaPage!");
