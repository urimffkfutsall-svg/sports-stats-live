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

// Ikona qe perdoren si buton i vetem - zevendesim me tekst
const txtMap = {
  X: "\u2715",
  Plus: "+",
  Pencil: "\u270E",
  Trash2: "\u2717",
  Eye: "\u25CB",
  Target: "\u25CE",
  ChevronRight: "\u203A",
  ChevronLeft: "\u2039",
  ChevronDown: "\u25BE",
  ChevronUp: "\u25B4",
  ArrowLeft: "\u2190",
  ArrowRight: "\u2192",
  ArrowUpRight: "\u2197",
  ArrowDownRight: "\u2198",
  Search: "\u26B2",
  Check: "\u2713",
  LogOut: "\u2192",
  Save: "\u2713",
  Upload: "\u25B2",
};

const files = walk("src");
let count = 0;

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");

  // Check for lucide import
  const im = s.match(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?/);
  if (!im) continue;

  const orig = s;
  const names = im[1].split(",").map(n => n.trim()).filter(Boolean);

  // 1. Remove import line
  s = s.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?\s*\n?/g, "");

  // 2. Remove/replace each icon JSX element
  for (const name of names) {
    const rep = txtMap[name] || "";
    // Self-closing with attributes: <Name ... />
    s = s.replace(new RegExp("<" + name + "\\s+[^>]*?/>", "g"), rep);
    // Self-closing no attributes: <Name />
    s = s.replace(new RegExp("<" + name + "\\s*/>", "g"), rep);
  }

  // 3. Dynamic icons: <s.icon .../>, <item.icon .../>, etc
  s = s.replace(/<[a-z][a-zA-Z]*\.icon\b[^>]*\/>/g, "");

  // 4. icon: IconName in objects -> icon: null
  for (const name of names) {
    s = s.replace(new RegExp("icon:\\s*" + name + "(?=[,\\s}\\n\\r])", "g"), "icon: null");
  }

  // 5. const Icon = ... variable assignments
  s = s.replace(/const\s+Icon\s*=[^;]*;\s*\n?/g, "");
  s = s.replace(/<Icon\b[^>]*\/>/g, "");

  // 6. Clean empty className wrappers left behind (optional, cosmetic)
  // Remove lines that are just whitespace after icon removal
  s = s.replace(/\n\s*\n\s*\n/g, "\n\n");

  if (s !== orig) {
    fs.copyFileSync(file, file + ".ico-bak");
    fs.writeFileSync(file, s, "utf8");
    console.log("[OK] " + path.relative("src", file) + " (" + names.length + " ikona)");
    count++;
  }
}

console.log("\n" + count + " file te ndryshuara nga " + files.length + " total");
