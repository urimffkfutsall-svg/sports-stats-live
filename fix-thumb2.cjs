const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");

// Find the exact lines to replace (54-58)
// Line 54: {/* Background Image */}
// Line 55: {getPhotos(item.photo)[0] ? (
// Line 56: <img src=...
// Line 57: ) : (
// Line 58: <div className="absolute inset-0 bg-gradient...
// Line 59: )}

// Show lines 54-60
console.log("=== Lines 54-60 ===");
lines.slice(53, 60).forEach((l, i) => console.log((i+54) + ": " + l.trimEnd()));

// Replace lines 54-59 with new version
const newBg = [
  '          {/* Background Image or Video Thumbnail */}',
  '          {getPhotos(item.photo)[0] ? (',
  '            <img src={getPhotos(item.photo)[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />',
  '          ) : getVideoThumbnail((item as any).videoUrl || \'\') ? (',
  '            <>',
  '              <img src={getVideoThumbnail((item as any).videoUrl || \'\')!} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />',
  '              <div className="absolute inset-0 flex items-center justify-center z-10">',
  '                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">',
  '                  <svg className="w-7 h-7 text-[#1E6FF2] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  '                </div>',
  '              </div>',
  '            </>',
  '          ) : (',
  '            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />',
  '          )}',
];

// Remove old lines 54-59 (indices 53-58) and insert new
lines.splice(53, 6, ...newBg);

fs.writeFileSync("src/components/LandingNews.tsx", lines.join("\n"), "utf8");

const final = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
console.log("\nHas getVideoThumbnail call: " + final.includes("getVideoThumbnail((item as any)"));
console.log("Has play button: " + final.includes("w-16 h-16 rounded-full"));
console.log("[OK] Video thumbnail with play button added");
