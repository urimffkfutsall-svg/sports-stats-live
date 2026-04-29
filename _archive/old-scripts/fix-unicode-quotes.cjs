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

// All Unicode replacements from remove-all-icons.cjs
const syms = ["✕","✎","✗","◉","◎","›","‹","▾","▴","←","→","↗","↘","✓","▲","○","☰","⊕","⊗","⬆","⬇","◆","●","■","▪","◻","☆","★","⟳","⚙","📋","🔔","⏱","⌛"];
// Escape for regex
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const symPat = syms.map(esc).join("|");

const files = walk("src");
let count = 0;

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  // Fix 1: ternary THEN — {cond ? ○ : ...}  ->  {cond ? "○" : ...}
  const r1 = new RegExp(`(\\?\\s*)(${symPat})(\\s*:)`, "g");
  s = s.replace(r1, '$1"$2"$3');

  // Fix 2: ternary ELSE — {cond ? ... : ○}  ->  {cond ? ... : "○"}
  const r2 = new RegExp(`(:\\s*)(${symPat})(\\s*})`, "g");
  s = s.replace(r2, '$1"$2"$3');

  // Fix 3: standalone — {○}  ->  {"○"}
  const r3 = new RegExp(`({\\s*)(${symPat})(\\s*})`, "g");
  s = s.replace(r3, '$1"$2"$3');

  // Fix 4: after && — {cond && ○}  ->  {cond && "○"}
  const r4 = new RegExp(`(&&\\s*)(${symPat})(\\s*})`, "g");
  s = s.replace(r4, '$1"$2"$3');

  // Fix 5: after || — {cond || ○}  ->  {cond || "○"}
  const r5 = new RegExp(`(\\|\\|\\s*)(${symPat})(\\s*})`, "g");
  s = s.replace(r5, '$1"$2"$3');

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
