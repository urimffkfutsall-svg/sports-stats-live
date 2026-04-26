const fs = require("fs");
// Find admin page file
const files = fs.readdirSync("src/pages");
console.log("Pages:", files.join(", "));
const adminFiles = fs.readdirSync("src/pages/admin");
console.log("Admin:", adminFiles.join(", "));
