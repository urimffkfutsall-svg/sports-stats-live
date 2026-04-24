const fs = require("fs");

// Scan all TSX files for broken unicode escape sequences and weird characters
const dirs = ['src/components', 'src/pages', 'src/pages/admin'];
const issues = [];

dirs.forEach(dir => {
  try {
    fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).forEach(f => {
      const path = dir + '/' + f;
      const content = fs.readFileSync(path, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Check for escaped unicode that renders as literal text
        if (line.includes('\\u') || line.includes('\\x') || line.includes('â€') || line.includes('Ã«') || line.includes('Ã§') || line.includes('&#')) {
          issues.push({ file: path, line: i+1, text: line.trim().substring(0, 120) });
        }
      });
    });
  } catch {}
});

console.log("Found " + issues.length + " potential issues:");
issues.forEach(i => console.log(i.file + ":" + i.line + " => " + i.text));

// Also show the MatchRow from LandingMatches specifically
console.log("\n=== LandingMatches MatchRow area ===");
const lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");
const lmLines = lm.split("\n");
for (let i = 60; i < 160; i++) {
  if (lmLines[i] && (lmLines[i].includes("Shiko") || lmLines[i].includes("detaj") || lmLines[i].includes("›") || lmLines[i].includes("match.week") || lmLines[i].includes("date") || lmLines[i].includes("formatDate"))) {
    console.log((i+1) + ": " + lmLines[i].trimEnd());
  }
}
