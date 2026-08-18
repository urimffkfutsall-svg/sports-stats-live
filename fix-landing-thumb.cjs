const fs = require("fs");
let ln = fs.readFileSync("src/components/LandingNews.tsx", "utf8");

// Add function to get video thumbnail
ln = ln.replace(
  "const LandingNews: React.FC = () => {",
  `function getVideoThumbnail(url: string): string | null {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
  if (yt) return 'https://img.youtube.com/vi/' + yt[1] + '/hqdefault.jpg';
  // Facebook - no easy thumbnail, return null
  return null;
}

const LandingNews: React.FC = () => {`
);

// Update the background image section to also check for video thumbnail
ln = ln.replace(
  `{/* Background Image */}
{getPhotos(item.photo)[0] ? (
<img src={getPhotos(item.photo)[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
) : (
<div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />
)}`,
  `{/* Background Image or Video Thumbnail */}
{getPhotos(item.photo)[0] ? (
<img src={getPhotos(item.photo)[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
) : getVideoThumbnail((item as any).videoUrl || '') ? (
<>
<img src={getVideoThumbnail((item as any).videoUrl || '')!} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
<div className="absolute inset-0 flex items-center justify-center z-10">
  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
    <svg className="w-7 h-7 text-[#1E6FF2] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
  </div>
</div>
</>
) : (
<div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />
)}`
);

// Also add a video icon badge when news has video
ln = ln.replace(
  `<span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">Lajm</span>`,
  `<div className="flex items-center gap-2 mb-2">
<span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">Lajm</span>
{(item as any).videoUrl && <span className="inline-block px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">▶ Video</span>}
</div>`
);

fs.writeFileSync("src/components/LandingNews.tsx", ln, "utf8");

const final = fs.readFileSync("src/components/LandingNews.tsx", "utf8");
console.log("Has getVideoThumbnail: " + final.includes("getVideoThumbnail"));
console.log("Has video play button: " + final.includes("w-16 h-16 rounded-full"));
console.log("Has VIDEO badge: " + final.includes("▶ Video"));
console.log("[OK] LandingNews - video thumbnail and play icon added");
