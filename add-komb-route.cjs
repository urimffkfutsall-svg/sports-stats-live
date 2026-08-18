const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");

// Add kombetarja route before /live
app = app.replace(
  '<Route path="/live" element={<LiveMatchPage />} />',
  '<Route path="/kombetarja" element={<KombetarjaPage />} />\n                <Route path="/live" element={<LiveMatchPage />} />'
);

fs.writeFileSync("src/App.tsx", app, "utf8");

// Verify
const final = fs.readFileSync("src/App.tsx", "utf8");
console.log("Has /kombetarja route: " + final.includes('path="/kombetarja"'));
console.log("[OK] Route added");
