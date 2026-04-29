const fs = require("fs");
let s = fs.readFileSync("src/components/LandingVideos.tsx", "utf8");

// Replace the fallback (no thumbnail) div with better design showing title + description
const oldFallback = `<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]">
                        <span className="text-white/50 text-4xl">▶</span>
                      </div>`;

const newFallback = `<div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1E3C] via-[#0F2D5E] to-[#1E6FF2] p-4">
                        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                        <p className="text-white font-semibold text-sm text-center line-clamp-2">{v.title || 'Video'}</p>
                        {v.description && <p className="text-white/50 text-xs text-center mt-1 line-clamp-1">{v.description}</p>}
                      </div>`;

s = s.replace(oldFallback, newFallback);

fs.writeFileSync("src/components/LandingVideos.tsx", s, "utf8");
console.log("[OK] LandingVideos.tsx - video cards now show title + description when no thumbnail");
