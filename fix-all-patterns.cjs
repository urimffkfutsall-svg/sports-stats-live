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

  // Fix 1: {x && } -> remove entire expression (was: condition && <Icon/>)
  s = s.replace(/\{[^{}]*&&\s*\}/g, "{null}");

  // Fix 2: {x && \n} with newlines
  s = s.replace(/&&\s*\}/g, "&& null}");

  // Fix 3: {x ||  } same pattern with ||
  s = s.replace(/\|\|\s*\}/g, "|| null}");

  // Fix 4: empty ternary THEN that previous script missed:  ? :
  s = s.replace(/\?\s*:/g, "? null :");

  // Fix 5: empty ternary ELSE:  : } in ternary context
  s = s.replace(/:\s*\}(?=\s*\n)/g, (match, offset) => {
    const before = s.substring(Math.max(0, offset - 400), offset);
    if (before.includes("?")) return ": null}";
    return match;
  });

  // Fix 6: {x ? null : null} -> {null}
  s = s.replace(/\{[^{}]*\?\s*null\s*:\s*null\s*\}/g, "{null}");

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
