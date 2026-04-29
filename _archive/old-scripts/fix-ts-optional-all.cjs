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

  // Broad fix: any "word? null : SomeType" where SomeType ends with ; or } or , or )
  // This catches ALL TypeScript optional syntax that was broken
  // Pattern: identifier? null : Type;  or  identifier? null : Type}  etc.
  s = s.replace(/(\w)\?\s*null\s*:\s*(\w[\w.<>,\[\] |&()"']*)\s*;/g, (match, pre, type) => {
    // This is TypeScript if it ends with ; (property/param declaration)
    return pre + "?: " + type.trim() + ";";
  });

  // Also catch in function params: (param? null : Type) or (param? null : Type,
  s = s.replace(/(\w)\?\s*null\s*:\s*(\w[\w.<>,\[\] |&()"']*)\s*,/g, (match, pre, type) => {
    return pre + "?: " + type.trim() + ",";
  });

  s = s.replace(/(\w)\?\s*null\s*:\s*(\w[\w.<>,\[\] |&()"']*)\s*\)/g, (match, pre, type) => {
    return pre + "?: " + type.trim() + ")";
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
