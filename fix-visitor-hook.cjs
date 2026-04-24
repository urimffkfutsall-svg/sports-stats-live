const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");

// Remove the broken useEffect that was added (it wasn't actually added since it's () => ( not () => {)
// The tracking needs to go in a wrapper component instead

// Remove the dbVisitors import from App.tsx since we can't use hooks there
app = app.replace("import { dbVisitors } from '@/lib/supabase-db';\n", "");
app = app.replace("import React from 'react';\n", "");

// Instead, add tracking inside DataProvider's useEffect (which already runs on load)
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

if (!ctx.includes("dbVisitors")) {
  // Add import
  ctx = ctx.replace(
    "import { dbVideos, dbNews",
    "import { dbVisitors, dbVideos, dbNews"
  );

  // Add tracking call inside the initial data fetch useEffect
  // Find where data is fetched on mount
  const lines = ctx.split("\n");
  console.log("=== Looking for initial useEffect ===");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("useEffect") && i < 250) {
      for (let j = i; j < i + 8 && j < lines.length; j++) {
        console.log((j+1) + ": " + lines[j]?.trimEnd());
      }
      console.log("---");
    }
  }
}

fs.writeFileSync("src/App.tsx", app, "utf8");
console.log("[OK] Removed broken imports from App.tsx");
