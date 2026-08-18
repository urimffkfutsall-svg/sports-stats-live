const fs = require("fs");
let s = fs.readFileSync("src/components/LandingVideos.tsx", "utf8");

// Replace the entire video card rendering to handle Facebook with iframe preview
const oldCardContent = `const thumb = getThumbnail(v.url);
              return (
                <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <div className="relative aspect-video bg-gray-900">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (`;

const newCardContent = `const thumb = getThumbnail(v.url);
              const isFacebook = v.url.includes('facebook.com') || v.url.includes('fb.watch');
              const embedUrl = getEmbedUrl(v.url);
              return (
                <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <div className="relative aspect-video bg-gray-900">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : isFacebook ? (
                      <div className="w-full h-full relative pointer-events-none">
                        <iframe src={embedUrl} className="w-full h-full" style=border: 'none' scrolling="no" allowFullScreen />
                        <div className="absolute inset-0 bg-transparent" />
                      </div>
                    ) : (`;

s = s.replace(oldCardContent, newCardContent);

fs.writeFileSync("src/components/LandingVideos.tsx", s, "utf8");
console.log("[OK] LandingVideos.tsx - Facebook videos now show iframe preview");
