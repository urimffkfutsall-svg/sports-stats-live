const fs = require("fs");
let header = fs.readFileSync("src/components/Header.tsx", "utf8");

// Remove FFK logo from desktop
header = header.replace(
  '{settings.logo && <img src={settings.logo} alt="FFK" className="h-9 w-9 object-contain" />}\n            ',
  ''
);

// Remove FFK logo from mobile
header = header.replace(
  '{settings.logo && <img src={settings.logo} alt="FFK" className="h-8 w-8 object-contain" />}\n            ',
  ''
);

fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] Logo removed from header");
