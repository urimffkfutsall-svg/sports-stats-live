const fs = require("fs");
let s = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
s = s.replace(/style=.*height.*260.*/g, 'style= height: "260px" ');
fs.writeFileSync("src/components/LandingNews.tsx", s, "utf8");
console.log("[OK] LandingNews.tsx fixed");
