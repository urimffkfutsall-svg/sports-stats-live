const fs = require("fs");
let comp = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");

// 1) Remove the video section from the wrong component (lines 112-150 area)
// Remove everything between {/* Video Section */} and the closing of that IIFE
comp = comp.replace(
  /\n\s*\{\/\* Video Section \*\/\}[\s\S]*?\}\)\(\)\}/,
  ''
);

// 2) Add videos to the main CompetitionPage useData
comp = comp.replace(
  "const { competitions, matches, getActiveSeason, calculateStandings, getAggregatedScorers, getTeamById } = useData();",
  "const { competitions, matches, getActiveSeason, calculateStandings, getAggregatedScorers, getTeamById, videos } = useData() as any;"
);

// 3) Find the end of the main CompetitionPage JSX return - add video section before last closing divs
// Find the pattern "      </div>\n    </div>\n  );\n};" at the end of CompetitionPage
const endPattern = "      </div>\n    </div>\n  );\n};";

const videoSection = `
        {/* Video Section */}
        {(() => {
          const compVideos = (videos || []).filter((v: any) =>
            type === 'superliga' ? v.isFeaturedSuperliga : type === 'liga_pare' ? v.isFeaturedLigaPare : false
          );
          if (compVideos.length === 0) return null;
          return (
            <div className="mt-8 px-3 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"></span>
                <h2 className="text-lg font-bold text-gray-800">Video</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compVideos.map((v: any) => (
                  <div key={v.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video">
                      <iframe
                        src={getEmbedUrl(v.url)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                        title={v.title}
                      />
                    </div>
                    {v.title && (
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-800">{v.title}</h3>
                        {v.description && <p className="text-xs text-gray-500 mt-1">{v.description}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
`;

// Find the last occurrence of the end pattern in CompetitionPage
const lastEndIdx = comp.lastIndexOf(endPattern);
if (lastEndIdx > -1) {
  comp = comp.substring(0, lastEndIdx) + videoSection + endPattern + comp.substring(lastEndIdx + endPattern.length);
  console.log("[OK] Video section moved inside CompetitionPage");
} else {
  // Try alternative end pattern
  const altEnd = "    </div>\n  );\n};";
  const altIdx = comp.lastIndexOf(altEnd);
  if (altIdx > -1) {
    comp = comp.substring(0, altIdx) + videoSection + altEnd + comp.substring(altIdx + altEnd.length);
    console.log("[OK] Video section added (alt pattern)");
  } else {
    console.log("[WARN] Could not find end pattern");
  }
}

fs.writeFileSync("src/pages/CompetitionPage.tsx", comp, "utf8");

// Verify
const final = fs.readFileSync("src/pages/CompetitionPage.tsx", "utf8");
const mainComp = final.substring(final.indexOf("const CompetitionPage"));
console.log("Videos in main component: " + mainComp.includes("compVideos"));
console.log("videos in useData: " + mainComp.includes("videos"));
console.log("getEmbedUrl used: " + mainComp.includes("getEmbedUrl"));
