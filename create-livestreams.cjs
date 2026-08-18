const fs = require("fs");

// 1) Create LiveStreamsPage - standalone page for watching streams
const page = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dbLiveStreams } from '@/lib/supabase-db';

function getEmbedUrl(url: string) {
  if (!url) return '';
  // YouTube
  const ytMatch = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/|youtube\\.com\\/live\\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1';
  // Facebook
  if (url.includes('facebook.com')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&autoplay=1&width=800';
  }
  return url;
}

export default function LiveStreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbLiveStreams.getAll().then(all => {
      const live = all.filter((s: any) => s.isLive);
      setStreams(live);
      if (live.length > 0) setSelectedStream(live[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 rounded-full border-4 border-[#1E6FF2]/20 border-t-[#1E6FF2] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-400 text-sm font-black uppercase tracking-wider">LIVE</span>
            </div>
            <h1 className="text-2xl font-black text-white">Ndeshje Live</h1>
          </div>
          <Link to="/live" className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Kthehu</Link>
        </div>

        {streams.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-3xl">📺</span>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Nuk ka transmetim live</h2>
            <p className="text-gray-500">Momentalisht nuk ka asnje ndeshje qe trasmetohet live</p>
            <Link to="/live" className="inline-block mt-6 px-6 py-2.5 bg-[#1E6FF2] text-white rounded-xl font-bold text-sm hover:bg-[#1858C8]">Shiko ndeshjet</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Player */}
            <div className="lg:col-span-3">
              {selectedStream && (
                <div>
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                    <iframe
                      src={getEmbedUrl(selectedStream.streamUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-red-500/20 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-red-400 text-xs font-bold">LIVE</span>
                    </div>
                    <h2 className="text-lg font-black text-white">{selectedStream.matchTitle}</h2>
                  </div>
                </div>
              )}
            </div>

            {/* Stream List Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">Transmetimet Live</h3>
              <div className="space-y-3">
                {streams.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStream(s)}
                    className={"w-full text-left rounded-xl border p-3 transition-all " + (selectedStream?.id === s.id ? "bg-[#1E6FF2]/10 border-[#1E6FF2]/40" : "bg-gray-900/50 border-gray-800 hover:border-gray-700")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-bold text-red-400">LIVE</span>
                    </div>
                    <p className={"text-sm font-bold " + (selectedStream?.id === s.id ? "text-white" : "text-gray-300")}>{s.matchTitle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
`;
fs.writeFileSync("src/pages/LiveStreamsPage.tsx", page, "utf8");
console.log("[OK] LiveStreamsPage created");

// 2) Add route
let app = fs.readFileSync("src/App.tsx", "utf8");
if (!app.includes("LiveStreamsPage")) {
  app = app.replace(
    'import LiveMatchPage from "./pages/LiveMatchPage";',
    'import LiveMatchPage from "./pages/LiveMatchPage";\nimport LiveStreamsPage from "./pages/LiveStreamsPage";'
  );
  app = app.replace(
    '<Route path="/live" element={<LiveMatchPage />} />',
    '<Route path="/live" element={<LiveMatchPage />} />\n                <Route path="/live/streams" element={<LiveStreamsPage />} />'
  );
  fs.writeFileSync("src/App.tsx", app, "utf8");
  console.log("[OK] Route /live/streams added");
}

// 3) Add button to LiveMatchPage
let lp = fs.readFileSync("src/pages/LiveMatchPage.tsx", "utf8");
if (!lp.includes("Shiko Ndeshje Live")) {
  // Add Link import if not present
  if (!lp.includes("import { Link")) {
    lp = lp.replace(
      "import React, { useState, useMemo } from 'react';",
      "import React, { useState, useMemo } from 'react';\nimport { Link } from 'react-router-dom';"
    );
  }
  // Add button after Header
  lp = lp.replace(
    "<Header />",
    `<Header />
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link to="/live/streams" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-105">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
          Shiko Ndeshje Live
        </Link>
      </div>`
  );
  fs.writeFileSync("src/pages/LiveMatchPage.tsx", lp, "utf8");
  console.log("[OK] 'Shiko Ndeshje Live' button added to LiveMatchPage");
}

console.log("\n[DONE] Live streams frontend ready");
