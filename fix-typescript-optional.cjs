const fs = require("fs");
const path = require("path");

function walk(dir) {
  let r = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!["node_modules","dist",".git",".vercel"].includes(f)) r = r.concat(walk(p));
    } else if (/\.tsx?$/.test(f)) r.push(p);
  }
  return r;
}

const files = walk("src");
let count = 0;

// TypeScript types that appear after ?: in params/props
const tsTypes = "any|string|number|boolean|void|never|unknown|undefined|object|null|React\\.\\w+|Array|Record|Map|Set|Promise|Match|MatchStatus|Goal|ScorerModalData|TabType|Competition|Team|Player|Season|CompetitionType|StandingsRow|CupRound|AppSettings|Decision|Editor|Official|PlayerStats|NationalPlayer|NationalMatch|User|PlayerOfWeek|Scorer";

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  // Fix 1: Restore TypeScript optional params/props broken by ternary fix
  // Pattern: word? null : TypeName -> word?: TypeName
  // Match common TS primitives
  const tsRe = new RegExp("(\\w)\\?\\s*null\\s*:\\s*(" + tsTypes + ")\\b", "g");
  s = s.replace(tsRe, "$1?: $2");

  // Fix 2: Also catch word? null : { (object type)
  s = s.replace(/(\w)\?\s*null\s*:\s*\{/g, "$1?: {");

  // Fix 3: word? null : Type[] (array types)
  s = s.replace(/(\w)\?\s*null\s*:\s*(\w+)\[\]/g, "$1?: $2[]");

  // Fix 4: word? null : Type<  (generic types like Array<string>)
  s = s.replace(/(\w)\?\s*null\s*:\s*(\w+)</g, "$1?: $2<");

  // Fix 5: word? null : (Type | Type) (union in parens)
  s = s.replace(/(\w)\?\s*null\s*:\s*\(/g, "$1?: (");

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
