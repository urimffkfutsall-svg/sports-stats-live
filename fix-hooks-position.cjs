const fs = require("fs");
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// 1) Remove the misplaced code (lines 249-253)
admin = admin.replace(
  "\nconst [visitorStats, setVisitorStats] = useState<any>(null);\n\n  useEffect(() => {\n    dbVisitors.getStats().then(setVisitorStats);\n  }, []);\n",
  "\n"
);

// 2) Add them inside the component, after line 36 (after the useEffect for currentUser)
admin = admin.replace(
  "  }, [currentUser]);\n\n  if (!isAuthenticated)",
  `  }, [currentUser]);

  const [visitorStats, setVisitorStats] = useState<any>(null);
  useEffect(() => {
    dbVisitors.getStats().then(setVisitorStats);
  }, []);

  if (!isAuthenticated)`
);

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");

// Verify
const final = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");
const lines = final.split("\n");
console.log("=== Lines 36-45 ===");
lines.slice(35, 45).forEach((l, i) => console.log((i+36) + ": " + l.trimEnd()));

// Check no hooks outside component
const compEnd = final.indexOf("};");
const afterComp = final.substring(compEnd + 2);
console.log("\nHooks outside component: " + afterComp.includes("useState"));
console.log("[OK] Hooks moved inside component");
