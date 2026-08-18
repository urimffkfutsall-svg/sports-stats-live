const fs = require("fs");
let s = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

s = s.replace(
  ">Agregati</span>",
  ">Rezultati Final</span>"
);

fs.writeFileSync("src/pages/KupaPage.tsx", s, "utf8");
console.log("[OK] 'Agregati' -> 'Rezultati Final'");
