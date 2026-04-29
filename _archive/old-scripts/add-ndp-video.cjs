const fs = require("fs");
let ndp = fs.readFileSync("src/pages/NewsDetailPage.tsx", "utf8");

// Add getEmbedUrl function after getPhotos
ndp = ndp.replace(
  "const NewsDetailPage: React.FC = () => {",
  `function getEmbedUrl(url: string): string {
  let m = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

const NewsDetailPage: React.FC = () => {`
);

// Add video section after photos and before the "Lajm" badge (line 106)
ndp = ndp.replace(
  "        <span className=\"inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-3\">Lajm</span>",
  `        {/* Video */}
        {(item as any).videoUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl((item as any).videoUrl)}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={item.title}
              />
            </div>
          </div>
        )}

        <span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-3">Lajm</span>`
);

fs.writeFileSync("src/pages/NewsDetailPage.tsx", ndp, "utf8");

const final = fs.readFileSync("src/pages/NewsDetailPage.tsx", "utf8");
console.log("Has getEmbedUrl: " + final.includes("getEmbedUrl"));
console.log("Has videoUrl display: " + final.includes("item as any).videoUrl"));
console.log("[OK] NewsDetailPage - video section added");
