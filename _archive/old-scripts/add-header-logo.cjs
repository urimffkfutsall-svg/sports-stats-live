const fs = require("fs");
let header = fs.readFileSync("src/components/Header.tsx", "utf8");

// Add FFK logo before NotificationPanel on desktop
header = header.replace(
  '<div className="hidden lg:flex items-center gap-1">\n            <NotificationPanel />',
  '<div className="hidden lg:flex items-center gap-2">\n            {settings.logo && <img src={settings.logo} alt="FFK" className="h-9 w-9 object-contain" />}\n            <NotificationPanel />'
);

// Also add on mobile
header = header.replace(
  '<div className="lg:hidden flex items-center gap-1">\n            <NotificationPanel />',
  '<div className="lg:hidden flex items-center gap-2">\n            {settings.logo && <img src={settings.logo} alt="FFK" className="h-8 w-8 object-contain" />}\n            <NotificationPanel />'
);

fs.writeFileSync("src/components/Header.tsx", header, "utf8");
console.log("[OK] FFK logo added to header right side");

// Verify
const final = fs.readFileSync("src/components/Header.tsx", "utf8");
console.log("Has settings.logo img: " + (final.match(/settings\.logo/g) || []).length + " times");
