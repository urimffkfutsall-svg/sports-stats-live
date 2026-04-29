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
let totalFixes = 0;

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  // Fix 1: empty ternary else — ": }" or ":  }" -> ": null}"
  // Pattern: (? something :) followed by whitespace then } or )
  s = s.replace(/:\s*\}/g, (match, offset) => {
    // Check if this is inside a ternary (look back for ?)
    const before = s.substring(Math.max(0, offset - 200), offset);
    if (before.includes("?")) {
      return ": null}";
    }
    return match;
  });

  // Fix 2: empty ternary with closing paren — ": )" 
  s = s.replace(/:\s*\)/g, (match, offset) => {
    const before = s.substring(Math.max(0, offset - 200), offset);
    if (before.includes("?") && !before.includes("=>")) {
      return ": null)";
    }
    return match;
  });

  // Fix 3: empty JSX expression — {  } (just whitespace between braces in JSX)
  // This can happen when icon was sole content: <div>{<Icon/>}</div> -> <div>{}</div>
  s = s.replace(/\{\s*\}/g, (match, offset) => {
    // Only fix if in JSX context (not destructuring/objects)
    const before = s.substring(Math.max(0, offset - 5), offset).trim();
    if (before.endsWith(">") || before.endsWith("\n")) {
      return "{null}";
    }
    return match;
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    const fixes = (orig.length - orig.replace(/:\s*[}\)]/g, "").length) - (s.length - s.replace(/:\s*null[}\)]/g, "").length);
    console.log("[OK] " + path.relative("src", file));
    totalFixes++;
  }
}

console.log("\n" + totalFixes + " file te rregulluara");
