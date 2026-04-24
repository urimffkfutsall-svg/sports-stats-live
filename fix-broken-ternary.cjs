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
  let fixes = 0;

  // Fix 1: empty THEN branch  —  {x ?  : y}  ->  {x ? null : y}
  const r1 = s.replace(/\?\s*:/g, "? null :");
  if (r1 !== s) { s = r1; fixes++; }

  // Fix 2: empty ELSE branch  —  {x ? y : }  ->  {x ? y : null}
  // :  followed by } or ) with only whitespace between
  const r2 = s.replace(/:\s*null\s*:\s*/g, ": null : "); // avoid double null from Fix1+Fix2
  s = r2;
  // Now fix actual empty else: ": }" where previous was a ternary
  const r3 = s.replace(/:\s*\}/g, (match, offset) => {
    const before = s.substring(Math.max(0, offset - 300), offset);
    if (before.includes("?")) return ": null}";
    return match;
  });
  if (r3 !== s) { s = r3; fixes++; }

  // Fix 3: {x ? null : null} -> simplify to {null} (both branches empty = nothing)
  s = s.replace(/\{[^{}]*\?\s*null\s*:\s*null\s*\}/g, "{null}");

  // Fix 4: completely empty JSX expressions {} in JSX context
  s = s.replace(/>\s*\{\s*\}\s*</g, ">{null}<");

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    totalFixes++;
  }
}

console.log("\n" + totalFixes + " file te rregulluara");
