const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const lines = comp.split("\n");

// Insert video section after line 484 (empty line after closing }))
// Before line 485 (</div>) which is before <Footer />
const videoLines = [
  '',
  '        {/* Video Section */}',
  '        {(() => {',
  '          const compVideos = (videos || []).filter((v: any) =>',
  "            type === 'superliga' ? v.isFeaturedSuperliga : type === 'liga_pare' ? v.isFeaturedLigaPare : false",
  '          );',
  '          if (compVideos.length === 0) return null;',
  '          return (',
  '            <div className="mt-8">',
  '              <div className="flex items-center gap-2 mb-4">',
  '                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"></span>',
  '                <h2 className="text-lg font-bold text-gray-800">Video</h2>',
  '              </div>',
  '              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">',
  '                {compVideos.map((v: any) => (',
  '                  <div key={v.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">',
  '                    <div className="aspect-video">',
  '                      <iframe',
  '                        src={getEmbedUrl(v.url)}',
  '                        className="w-full h-full"',
  '                        allowFullScreen',
  '                        allow="autoplay; encrypted-media"',
  '                        title={v.title}',
  '                      />',
  '                    </div>',
  '                    {v.title && (',
  '                      <div className="p-3">',
  '                        <h3 className="font-semibold text-sm text-gray-800">{v.title}</h3>',
  '                        {v.description && <p className="text-xs text-gray-500 mt-1">{v.description}</p>}',
  '                      </div>',
  '                    )}',
  '                  </div>',
  '                ))}',
  '              </div>',
  '            </div>',
  '          );',
  '        })()}',
];

// Insert at line 484 (index 484, before </div> at line 485)
lines.splice(484, 0, ...videoLines);

fs.writeFileSync("src/pages/CompetitionPage.tsx", lines.join("\n"), "utf8");

// Verify
const final = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const mainComp = final.substring(final.indexOf("const CompetitionPage"));
console.log("compVideos in main: " + mainComp.includes("compVideos"));
console.log("getEmbedUrl in main: " + mainComp.includes("getEmbedUrl"));
console.log("videos in useData: " + mainComp.includes("videos"));
console.log("[OK] Video section inserted inside CompetitionPage");
