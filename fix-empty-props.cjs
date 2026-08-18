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

  // Fix 1: "icon:  }," or "icon:  }" -> "icon: null }," / "icon: null }"
  // Object property with empty value after icon removal
  s = s.replace(/(icon:\s*)(},|}\s*$|\))/gm, "$1null $2");
  s = s.replace(/(icon:\s*),/g, "$1null,");

  // Fix 2: any property ending with ": }," or ": }" where value is missing
  // More general: key: <whitespace only> followed by }, or ,
  s = s.replace(/:\s+\}/g, (match, offset) => {
    // Only fix if looks like object property (check for key before :)
    const before = s.substring(Math.max(0, offset - 40), offset);
    if (/\w\s*$/.test(before)) return ": null }";
    return match;
  });

  // Fix 3: "key: ," (empty value before comma)
  s = s.replace(/(\w'?\s*:\s*),/g, "$1 null,");

  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file));
    count++;
  }
}

console.log("\n" + count + " file te rregulluara");
