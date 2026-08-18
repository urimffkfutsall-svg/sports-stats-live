const fs = require("fs");
let app = fs.readFileSync("src/App.tsx", "utf8");
const lines = app.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Route") || lines[i].includes("ombetarja") || lines[i].includes("kombetarja")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
