const fs = require("fs");
let s = fs.readFileSync("src/components/LandingVideos.tsx", "utf8");
const o = String.fromCharCode(123);
const c = String.fromCharCode(125);
// Fix the broken style attribute
s = s.replace(
  /style=border: 'none'/g,
  "style=" + o + o + " border: 'none' " + c + c
);
fs.writeFileSync("src/components/LandingVideos.tsx", s, "utf8");
console.log("[OK] style fixed: style=" + o + o + " border: 'none' " + c + c);
