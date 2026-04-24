const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Find the date input line
const lines = s.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type="date"') && lines[i].includes('form.date')) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Also find the cup legs date inputs
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type="date"') && lines[i].includes('data.date')) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}

// Check how form.date is used in handleSubmit
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('form.date') || lines[i].includes('date:')) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
