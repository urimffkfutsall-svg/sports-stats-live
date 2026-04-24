import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import { News } from '@/types';

function getPhotos(photo: string): string[] {
  if (!photo) return [];
  try { const arr = JSON.parse(photo); if (Array.isArray(arr)) return arr; } catch {}
  return photo ? [photo] : [];
}

function getVideoThumbnail(url: string): string | null {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return 'https://img.youtube.com/vi/' + yt[1] + '/hqdefault.jpg';
  // Facebook - no easy thumbnail, return null
  return null;
}

const LandingNews: React.FC = () => {
  const { news } = useData() as any;
  const navigate = useNavigate();
  const featured: News[] = (news || []).filter((n: News) => n.isFeaturedLanding);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + featured.length) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [featured.length, next]);

  if (featured.length === 0) return null;

  const item = featured[current];
  if (!item) return null;

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-4 bg-[#F1F5F9]">
      <div className="w-full">
        <div
          onClick={() => navigate('/lajme/' + item.id)}
          className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
          style={{ height: '380px' }}
        >
          {/* Background Image or Video */}
          {getPhotos(item.photo)[0] ? (
            <img src={getPhotos(item.photo)[0]} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (item as any).videoUrl ? (
            <>
              {(() => {
                const vUrl = (item as any).videoUrl || "";
                const ytMatch = vUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                if (ytMatch) {
                  return <img src={"https://img.youtube.com/vi/" + ytMatch[1] + "/maxresdefault.jpg"} alt="" className="absolute inset-0 w-full h-full object-cover" />;
                }
                // Facebook or other: embed as iframe background
                const fbSrc = vUrl.includes("facebook.com") || vUrl.includes("fb.watch")
                  ? "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(vUrl) + "&show_text=false&mute=1"
                  : vUrl;
                return (
                  <iframe
                    src={fbSrc}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ transform: 'scale(1.5)', transformOrigin: 'center center' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                );
              })()}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#1E6FF2] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
<span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">Lajm</span>
{(item as any).videoUrl && <span className="inline-block px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">▶ Video</span>}
</div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">{item.title}</h3>
            <p className="text-sm md:text-base text-white/70 line-clamp-2">{item.description}</p>
          </div>

          {/* Arrows */}
          {featured.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg font-bold">
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg font-bold">
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {featured.length > 1 && (
            <div className="absolute bottom-2 right-4 flex gap-1.5">
              {featured.map((_: any, i: number) => (
                <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingNews;
