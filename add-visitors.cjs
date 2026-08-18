const fs = require("fs");

// =====================================================
// STEP 1: Add visitor tracking function in supabase-db.ts
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

if (!db.includes("dbVisitors")) {
  db += `

// ============ VISITORS ============
export const dbVisitors = {
  async track() {
    try {
      // Get IP and city from free API
      const res = await fetch('https://ipapi.co/json/');
      const geo = await res.json();
      const visitor = {
        ip: geo.ip || 'unknown',
        city: geo.city || 'unknown',
        region: geo.region || '',
        country: geo.country_name || '',
        visited_at: new Date().toISOString(),
        user_agent: navigator.userAgent.substring(0, 200),
      };
      await supabase.from('visitors').insert(visitor);
    } catch (e) {
      console.error('Visitor tracking failed:', e);
    }
  },
  async getAll() {
    const { data } = await supabase.from('visitors').select('*').order('visited_at', { ascending: false }).limit(200);
    return data || [];
  },
  async getStats() {
    const { data } = await supabase.from('visitors').select('*');
    const all = data || [];
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = all.filter((v: any) => v.visited_at?.startsWith(today));
    const uniqueIPs = new Set(all.map((v: any) => v.ip));
    const uniqueToday = new Set(todayVisitors.map((v: any) => v.ip));
    return {
      total: all.length,
      unique: uniqueIPs.size,
      today: todayVisitors.length,
      uniqueToday: uniqueToday.size,
      recent: all.slice(0, 50),
    };
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] supabase-db.ts - visitor tracking functions added");
}

// =====================================================
// STEP 2: Add visitor tracking call in App.tsx (on first load)
// =====================================================
let app = fs.readFileSync("src/App.tsx", "utf8");

if (!app.includes("dbVisitors")) {
  // Add import
  app = app.replace(
    "import { ",
    "import { dbVisitors } from '@/lib/supabase-db';\nimport { "
  );
  // If that doubled, fix
  if (app.split("import { dbVisitors").length > 2) {
    app = app.replace("import { dbVisitors } from '@/lib/supabase-db';\n", "");
  }

  // Add tracking useEffect
  if (app.includes("function App()")) {
    app = app.replace(
      "function App() {",
      `function App() {
  // Track visitor on first load
  React.useEffect(() => {
    const tracked = sessionStorage.getItem('visitor_tracked');
    if (!tracked) {
      dbVisitors.track();
      sessionStorage.setItem('visitor_tracked', '1');
    }
  }, []);
`
    );
  } else if (app.includes("const App")) {
    app = app.replace(
      /const App[^=]*=\s*\(\)\s*=>\s*\{/,
      (match) => match + `
  // Track visitor on first load
  React.useEffect(() => {
    const tracked = sessionStorage.getItem('visitor_tracked');
    if (!tracked) {
      dbVisitors.track();
      sessionStorage.setItem('visitor_tracked', '1');
    }
  }, []);
`
    );
  }

  // Make sure React is imported
  if (!app.includes("import React")) {
    app = "import React from 'react';\n" + app;
  }

  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[OK] App.tsx - visitor tracking on load added");
}

// =====================================================
// STEP 3: Add Visitors section in AdminPage dashboard
// =====================================================
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Add import for dbVisitors and useState/useEffect
if (!admin.includes("dbVisitors")) {
  admin = admin.replace(
    "import { useData } from",
    "import { dbVisitors } from '@/lib/supabase-db';\nimport { useData } from"
  );

  // Add visitor state and effect inside the component
  // Find the component body - look for the first useState
  admin = admin.replace(
    "const [activeTab, setActiveTab]",
    `const [visitorStats, setVisitorStats] = useState<any>(null);
  
  useEffect(() => {
    if (activeTab === 'dashboard') {
      dbVisitors.getStats().then(setVisitorStats);
    }
  }, [activeTab]);

  const [activeTab, setActiveTab]`
  );

  // But we need to fix - activeTab is not yet defined when used in useEffect
  // Move useEffect after activeTab definition
  // Actually let's use a separate approach - trigger on dashboard tab click
  
  // Remove the incorrectly placed code
  admin = admin.replace(
    `const [visitorStats, setVisitorStats] = useState<any>(null);
  
  useEffect(() => {
    if (activeTab === 'dashboard') {
      dbVisitors.getStats().then(setVisitorStats);
    }
  }, [activeTab]);

  const [activeTab, setActiveTab]`,
    "const [activeTab, setActiveTab]"
  );

  // Find the line after all useState declarations and add there
  // Add after the DashCard component or before the return
  admin = admin.replace(
    "const DashCard",
    `const [visitorStats, setVisitorStats] = useState<any>(null);
  
  useEffect(() => {
    dbVisitors.getStats().then(setVisitorStats);
  }, []);

  const DashCard`
  );

  // Add visitor section in dashboard tab - after the DashCards grid (line 126)
  admin = admin.replace(
    '            </div>\n\n            {liveMatches.length > 0 && (',
    `            </div>

            {/* Visitor Stats */}
            {visitorStats && (
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <DashCard label="Vizita Totale" value={visitorStats.total} color="bg-indigo-50 text-indigo-600" />
                  <DashCard label="IP Unike" value={visitorStats.unique} color="bg-cyan-50 text-cyan-600" />
                  <DashCard label="Vizita Sot" value={visitorStats.today} color="bg-amber-50 text-amber-600" />
                  <DashCard label="Unike Sot" value={visitorStats.uniqueToday} color="bg-rose-50 text-rose-600" />
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Vizitoret e Fundit
                  </h3>
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">#</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">IP</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Qyteti</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Shteti</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Koha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitorStats.recent.map((v: any, i: number) => (
                          <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2 font-mono text-xs">{v.ip}</td>
                            <td className="px-3 py-2">{v.city}{v.region ? ', ' + v.region : ''}</td>
                            <td className="px-3 py-2">{v.country}</td>
                            <td className="px-3 py-2 text-gray-400 text-xs">{v.visited_at ? new Date(v.visited_at).toLocaleString('sq-AL') : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {liveMatches.length > 0 && (`
  );

  fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");
  console.log("[OK] AdminPage - visitor stats dashboard added");
}

// =====================================================
// SQL for Supabase
// =====================================================
console.log("\n========================================");
console.log("Run this SQL in Supabase SQL Editor:");
console.log("========================================");
console.log(`CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but allow inserts from anyone
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON visitors FOR SELECT USING (true);`);
console.log("========================================");
