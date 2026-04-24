const fs = require("fs");

// 1) Check index.html for title and favicon
let html = fs.readFileSync("index.html", "utf8");
console.log("=== index.html ===");
console.log(html);

// 2) Check manifest.json
let manifest = fs.readFileSync("public/manifest.json", "utf8");
console.log("\n=== manifest.json ===");
console.log(manifest);
