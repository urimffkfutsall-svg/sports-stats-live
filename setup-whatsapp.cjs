const fs = require("fs");

// 1) Set WhatsApp number
let wa = fs.readFileSync("src/components/WhatsAppButton.tsx", "utf8");
wa = wa.replace("38344123456", "38345278279");
// Also make it read from settings context
wa = wa.replace(
  "const WHATSAPP_NUMBER = '38345278279'; // Ndrysho numrin ketu\n\nconst WhatsAppButton: React.FC = () => {",
  "const WhatsAppButton: React.FC = () => {"
);
// Add useData import and get number from settings
wa = wa.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { useData } from '@/context/DataContext';"
);
wa = wa.replace(
  "const WhatsAppButton: React.FC = () => {\n  const [showPopup, setShowPopup] = useState(false);",
  "const WhatsAppButton: React.FC = () => {\n  const { settings } = useData() as any;\n  const WHATSAPP_NUMBER = ((settings as any).whatsappNumber || '38345278279').replace(/[^0-9]/g, '');\n  const [showPopup, setShowPopup] = useState(false);"
);
fs.writeFileSync("src/components/WhatsAppButton.tsx", wa, "utf8");
console.log("[OK] WhatsApp number set to +38345278279, reads from settings");

// 2) Add whatsappNumber to AppSettings type
let types = fs.readFileSync("src/types/index.ts", "utf8");
if (!types.includes("whatsappNumber")) {
  types = types.replace(
    "export interface AppSettings {",
    "export interface AppSettings {\n  whatsappNumber?: string;"
  );
  fs.writeFileSync("src/types/index.ts", types, "utf8");
  console.log("[OK] AppSettings - whatsappNumber added");
}

// 3) Add whatsappNumber to supabase-db mapping
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
if (!db.includes("whatsappNumber")) {
  db = db.replace(
    "videoUrl: 'video_url',",
    "videoUrl: 'video_url',\n    whatsappNumber: 'whatsapp_number',"
  );
  db = db.replace(
    "video_url: 'videoUrl',",
    "video_url: 'videoUrl',\n    whatsapp_number: 'whatsappNumber',"
  );
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] supabase-db - whatsappNumber mapping added");
}

// 4) Add WhatsApp field to AdminSettings
let adminSettings = fs.readFileSync("src/pages/admin/AdminSettings.tsx", "utf8");
console.log("\nAdminSettings lines: " + adminSettings.split("\n").length);
// Find form fields
const asLines = adminSettings.split("\n");
for (let i = 0; i < asLines.length; i++) {
  if (asLines[i].includes("contact") || asLines[i].includes("Contact") || asLines[i].includes("kontakt") || asLines[i].includes("Kontakt") || asLines[i].includes("settings")) {
    console.log((i+1) + ": " + asLines[i].trimEnd());
  }
}
