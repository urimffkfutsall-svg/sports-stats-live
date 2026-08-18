const fs = require("fs");
const file = "src/types/index.ts";
let s = fs.readFileSync(file, "utf8");
if (s.includes("dayOfWeek?:")) {
  console.log("[=] dayOfWeek already exists");
} else if (s.includes("delegate?: string;")) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(file, `${file}.bak-${ts}`);
  s = s.replace("delegate?: string;", "delegate?: string;\n  dayOfWeek?: string;");
  fs.writeFileSync(file, s, "utf8");
  console.log("[OK] added dayOfWeek to Match");
} else {
  console.log("[!] could not find delegate?: string; anchor");
}
