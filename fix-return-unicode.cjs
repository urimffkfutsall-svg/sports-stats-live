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

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  // Fix 1: "return ◎;" -> "return \"◎\";" (bare unicode in return)
  // Match: return <unicode_char>; where char is non-ASCII non-quote non-paren
  s = s.replace(/return\s+([^\s;'"(){}<>a-zA-Z0-9_$\\\/\[\]]+)\s*;/g, 'return "$1";');

  // Fix 2: "return ;" (empty return where icon was removed) -> "return null;"
  s = s.replace(/return\s*;/g, "return null;");

  // Fix 3: bare unicode as argument: someFunc(◎) -> someFunc("◎")
  s = s.replace(/\(([✕✎✗◉◎›‹▾▴←→↗↘✓▲○☰⊕⊗⬆⬇◆●■▪◻☆★⟳⚙📋🔔⏱⌛]+)\)/g, '("$1")');

  // Fix 4: bare unicode in array: [◎, ✓] -> ["◎", "✓"]
  s = s.replace(/(?<=[\[,]\s*)([✕✎✗◉◎›‹▾▴←→↗↘✓▲○☰⊕⊗⬆⬇◆●■▪◻☆★⟳⚙📋🔔⏱⌛]+)(?=\s*[,\]])/g, '"$1"');

  // Fix 5: variable assignment: const x = ◎; -> const x = "◎";
  s = s.replace(/=\s+([✕✎✗◉◎›‹▾▴←→↗↘✓▲○☰⊕⊗⬆⬇◆●■▪◻☆★⟳⚙📋🔔⏱⌛]+)\s*;/g, '= "$1";');

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
