import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Video } from '@/types';

function getEmbedUrl(url: string): string {
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

function getThumbnail(url: string): string | null {
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (m) return 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg';
  return null;
}

const LandingVideos: React.FC = () => {
  const { videos } = useData() as any;
  const featured: Video[] = (videos || []).filter((v: Video) => v.isFeaturedLanding);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  if (featured.length === 0) return null;

  return (
    <>
      <section className="py-10 px-3 sm:px-4 md:px-6 lg:px-8 bg-[#F1F5F9]">
        <div className="w-full">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6 text-center">Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((v: Video) => {
              const thumb = getThumbnail(v.url);
              const isFacebook = v.url.includes('facebook.com') || v.url.includes('fb.watch');
              const embedUrl = getEmbedUrl(v.url);
              return (
                <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <div className="relative aspect-video bg-gray-900">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : isFacebook ? (
                      <div className="w-full h-full relative pointer-events-none">
                        <iframe src={embedUrl} className="w-full h-full" style={{ border: 'none' }} scrolling="no" allowFullScreen />
                        <div className="absolute inset-0 bg-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2a499a] via-[#0F2D5E] to-[#1E6FF2] p-4">
                        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                        <p className="text-white font-semibold text-sm text-center line-clamp-2">{v.title || 'Video'}</p>
                        {v.description && <p className="text-white/50 text-xs text-center mt-1 line-clamp-1">{v.description}</p>}
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <span className="text-[#2a499a] text-2xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{v.title || 'Video'}</h3>
                    {v.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{v.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-lg font-bold">
              ✕
            </button>
            <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              <iframe src={getEmbedUrl(activeVideo.url) + (getEmbedUrl(activeVideo.url).includes('youtube') ? '?autoplay=1' : '')} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
            {activeVideo.title && (
              <div className="mt-3">
                <h3 className="text-lg font-bold text-white">{activeVideo.title}</h3>
                {activeVideo.description && <p className="text-sm text-white/60 mt-1">{activeVideo.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LandingVideos;
