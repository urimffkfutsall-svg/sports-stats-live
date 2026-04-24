const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Add DashCard after activeTeams line (line 49), before tabs
admin = admin.replace(
  "  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);\n\n  const tabs = [",
  `  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);

  const DashCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className={\`rounded-xl p-4 \${color}\`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );

  const tabs = [`
);

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");

const final = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
console.log("DashCard defined: " + final.includes("const DashCard"));
console.log("[OK] DashCard added inside component");
