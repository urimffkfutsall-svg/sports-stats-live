const fs = require("fs");

// Add TeamMarquee to Footer.tsx (above the footer element)
let footer = fs.readFileSync("src/components/Footer.tsx", "utf8");

if (!footer.includes("TeamMarquee")) {
  // Add import
  footer = footer.replace(
    "import { useData } from '@/context/DataContext';",
    "import { useData } from '@/context/DataContext';\nimport TeamMarquee from './TeamMarquee';"
  );

  // Add TeamMarquee before <footer>
  footer = footer.replace(
    '<footer className="bg-[#2a499a]',
    '<TeamMarquee />\n    <footer className="bg-[#2a499a]'
  );

  // Wrap in fragment since we now have 2 root elements
  footer = footer.replace(
    'return (\n    <TeamMarquee />',
    'return (\n    <>\n    <TeamMarquee />'
  );
  footer = footer.replace(
    '</footer>\n  );\n};',
    '</footer>\n    </>\n  );\n};'
  );

  fs.writeFileSync("src/components/Footer.tsx", footer, "utf8");
  console.log("[OK] TeamMarquee added above Footer");
} else {
  console.log("[SKIP] Already exists");
}

// Verify
const final = fs.readFileSync("src/components/Footer.tsx", "utf8");
console.log("Has TeamMarquee: " + final.includes("TeamMarquee"));
console.log("Has fragment: " + final.includes("<>"));
