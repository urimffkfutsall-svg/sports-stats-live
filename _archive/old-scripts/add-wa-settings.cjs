const fs = require("fs");
let as_ = fs.readFileSync("src/pages/admin/AdminSettings.tsx", "utf8");

// Add WhatsApp input after contact field
as_ = as_.replace(
  `<label className="block text-xs font-medium text-gray-600 mb-1">Kontakti</label>
              <input value={settings.contact} onChange={e => updateSettings({ ...settings, contact: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />`,
  `<label className="block text-xs font-medium text-gray-600 mb-1">Kontakti</label>
              <input value={settings.contact} onChange={e => updateSettings({ ...settings, contact: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Numri WhatsApp (me +383)</label>
              <input value={(settings as any).whatsappNumber || ''} onChange={e => updateSettings({ ...settings, whatsappNumber: e.target.value } as any)} placeholder="+38345278279" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />`
);

fs.writeFileSync("src/pages/admin/AdminSettings.tsx", as_, "utf8");

const final = fs.readFileSync("src/pages/admin/AdminSettings.tsx", "utf8");
console.log("Has whatsappNumber input: " + final.includes("whatsappNumber"));
console.log("[OK] AdminSettings - WhatsApp field added");

// SQL needed
console.log("\n========================================");
console.log("Run this SQL in Supabase:");
console.log("========================================");
console.log("ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;");
console.log("========================================");
