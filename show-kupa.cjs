const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");
console.log("KupaPage.tsx - " + kupa.split("\n").length + " lines");
console.log(kupa);
