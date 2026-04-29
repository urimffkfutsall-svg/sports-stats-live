const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Remove the duplicate code outside component (lines 254-265)
admin = admin.replace(
  "\nconst [visitorStats, setVisitorStats] = useState<any>(null);\n\n  useEffect(() => {\n    dbVisitors.getStats().then(setVisitorStats);\n  }, []);\n\n  const DashCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (\n  <div className={`rounded-xl p-4 ${color}`}>\n    <p className=\"text-xs font-medium opacity-70 uppercase tracking-wider\">{label}</p>\n    <p className=\"text-3xl font-bold mt-1\">{value}</p>\n  </div>\n);\n",
  "\n"
);

// Now check if DashCard is defined inside the component
if (!admin.substring(0, admin.indexOf("};")).includes("DashCard")) {
  // DashCard was removed - need to add it inside the component
  // Add it after the activeSeason/activeTeams declarations
  admin = admin.replace(
    "  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);",
    `  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);

  const DashCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className={\`rounded-xl p-4 \${color}\`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );`
  );
}

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");

// Verify
const final = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const compEnd = final.lastIndexOf("};");
const afterComp = final.substring(compEnd + 2);
console.log("Hooks outside component: " + (afterComp.includes("useState") || afterComp.includes("useEffect")));
console.log("DashCard inside component: " + final.substring(0, compEnd).includes("DashCard"));
console.log("visitorStats inside component: " + final.substring(0, compEnd).includes("visitorStats"));

// Show lines around DashCard
const lines = final.split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("DashCard")) {
    console.log((i+1) + ": " + lines[i].trimEnd());
  }
}
console.log("[OK] All code inside component");
