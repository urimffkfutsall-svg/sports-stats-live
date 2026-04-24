const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
let ballina = fs.readFileSync("src/components/LeagueTablesSection.tsx", "utf8");

console.log("========== LeagueTablesSection.tsx (Ballina tabela) - " + ballina.split("\n").length + " lines ==========");
console.log(ballina);
