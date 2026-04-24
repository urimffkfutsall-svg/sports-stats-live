const fs = require("fs");

// The issue might be that referee columns don't exist in Supabase matches table
// OR the data is saved but toCamel doesn't pass them through correctly
// OR fetchAllData reads them but mapRows strips unknown fields

// Let's check: does toCamel skip fields not in its map?
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// toCamel line 88-91: it iterates ALL entries and uses map[key] || key
// So unknown keys pass through as-is. This should be fine.

// The real issue: check if the Supabase 'matches' table has these columns
// Since we can't query Supabase schema, let's just make sure the columns exist
// by providing SQL

console.log("========================================");
console.log("Run this SQL in Supabase SQL Editor:");
console.log("========================================");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee1 TEXT;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee2 TEXT;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS referee3 TEXT;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS delegate TEXT;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS day_of_week TEXT;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS possession_home INTEGER;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS possession_away INTEGER;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS shots_home INTEGER;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS shots_away INTEGER;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS fouls_home INTEGER;");
console.log("ALTER TABLE matches ADD COLUMN IF NOT EXISTS fouls_away INTEGER;");
console.log("========================================");

// Also fix: dayOfWeek mapping is missing in toSnake/toCamel
if (!db.includes("dayOfWeek: 'day_of_week'")) {
  db = db.replace(
    "liveUrl: 'live_url',\n  };",
    "liveUrl: 'live_url',\n    dayOfWeek: 'day_of_week',\n  };"
  );
  console.log("[OK] Added dayOfWeek to toSnake map");
}

if (!db.includes("day_of_week: 'dayOfWeek'")) {
  db = db.replace(
    "live_url: 'liveUrl',\n  };",
    "live_url: 'liveUrl',\n    day_of_week: 'dayOfWeek',\n  };"
  );
  console.log("[OK] Added day_of_week to toCamel map");
}

fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
console.log("\n[DONE] Mapping updated. Run the SQL above in Supabase!");
