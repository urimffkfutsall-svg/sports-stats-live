const fs = require("fs");

// Check if NewsDetailPage.tsx exists
const exists = fs.existsSync("src/pages/NewsDetailPage.tsx");
console.log("NewsDetailPage.tsx exists: " + exists);

// Check App.tsx import
let app = fs.readFileSync("src/App.tsx", "utf8");
console.log("\nApp.tsx imports:");
app.split("\n").filter(l => l.includes("import")).forEach(l => console.log("  " + l.trim()));

console.log("\nApp.tsx routes:");
app.split("\n").filter(l => l.includes("Route")).forEach(l => console.log("  " + l.trim()));

// Fix if import is missing or malformed
if (!app.includes("import NewsDetailPage")) {
  app = app.replace(
    "import NotFound",
    "import NewsDetailPage from './pages/NewsDetailPage';\nimport NotFound"
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("\n[FIXED] Added missing import");
}

// Fix if route is missing
if (!app.includes("/lajme/:id")) {
  app = fs.readFileSync("src/App.tsx", "utf8");
  app = app.replace(
    '<Route path="/admin"',
    '<Route path="/lajme/:id" element={<NewsDetailPage />} />\n                <Route path="/admin"'
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[FIXED] Added missing route");
}

console.log("\nDone - check localhost again");
