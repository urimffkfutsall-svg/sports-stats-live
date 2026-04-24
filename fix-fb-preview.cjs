const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
const lines = ln.split("\n");

// Replace lines 54-68 with new version that embeds video for Facebook
const newBg = [
  '          {/* Background Image or Video */}',
  '          {getPhotos(item.photo)[0] ? (',
  '            <img src={getPhotos(item.photo)[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />',
  '          ) : (item as any).videoUrl ? (',
  '            <>',
  '              {(() => {',
  '                const vUrl = (item as any).videoUrl || "";',
  '                const ytMatch = vUrl.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);',
  '                if (ytMatch) {',
  '                  return <img src={"https://img.youtube.com/vi/" + ytMatch[1] + "/maxresdefault.jpg"} alt="" className="absolute inset-0 w-full h-full object-cover" />;',
  '                }',
  '                // Facebook or other: embed as iframe background',
  '                const fbSrc = vUrl.includes("facebook.com") || vUrl.includes("fb.watch")',
  '                  ? "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(vUrl) + "&show_text=false&mute=1"',
  '                  : vUrl;',
  '                return (',
  '                  <iframe',
  '                    src={fbSrc}',
  '                    className="absolute inset-0 w-full h-full pointer-events-none"',
  '                    style= transform: "scale(1.5)", transformOrigin: "center center" ',
  '                    allow="autoplay; encrypted-media"',
  '                    allowFullScreen',
  '                  />',
  '                );',
  '              })()}',
  '              <div className="absolute inset-0 flex items-center justify-center z-10">',
  '                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">',
  '                  <svg className="w-7 h-7 text-[#1E6FF2] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  '                </div>',
  '              </div>',
  '            </>',
  '          ) : (',
  '            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />',
  '          )}',
];

// Remove old lines 54-68 (indices 53-67) and insert new
lines.splice(53, 15, ...newBg);

fs.writeFileSync("src/components/LandingNews.tsx", lines.join("\n"), "utf8");

const final = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
console.log("Has Facebook embed: " + final.includes("facebook.com/plugins/video"));
console.log("Has YouTube maxres: " + final.includes("maxresdefault"));
console.log("Has play button: " + final.includes("w-16 h-16 rounded-full"));
console.log("Has scale transform: " + final.includes("scale(1.5)"));
console.log("[OK] Slideshow now shows video preview (Facebook embed + YouTube thumbnail)");
