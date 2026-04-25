const fs = require("fs");
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");
console.log(footer);
