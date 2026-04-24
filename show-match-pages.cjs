const fs = require("fs");

const files = [
  "src/components/MatchCard.tsx",
  "src/pages/CompetitionPage.tsx",
  "src/pages/KupaPage.tsx"
];

for (const f of files) {
  try {
    const content = fs.readFileSync(f, "utf8");
    console.log("\n========== " + f + " (" + content.split("\n").length + " lines) ==========");
    console.log(content);
  } catch(e) {
    console.log("\n[MISSING] " + f);
  }
}
