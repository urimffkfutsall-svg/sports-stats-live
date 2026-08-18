import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { News } from '@/types';

function getPhotos(photo: string): string[] {
  if (!photo) return [];
  try { const arr = JSON.parse(photo); if (Array.isArray(arr)) return arr; } catch {}
  return photo ? [photo] : [];
}

function getEmbedUrl(url: string): string {
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { news } = useData() as any;
  const item: News | undefined = (news || []).find((n: News) => n.id === id);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F1F5F9]">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg">Lajmi nuk u gjet.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold">Kthehu ne Ballina</button>
        </div>
        <Footer />
      </div>
    );
  }

  const photos = getPhotos(item.photo);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-[#1E6FF2] font-semibold mb-4 hover:underline flex items-center gap-1">
          ← Kthehu
        </button>

        {/* Photo Collage */}
        {photos.length > 0 && (
          <div className="mb-6">
            {photos.length === 1 && (
              <div className="rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={() => setLightbox(photos[0])}>
                <img src={photos[0]} alt="" className="w-full h-auto max-h-[400px] object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            {photos.length === 2 && (
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-lg">
                {photos.map((p, i) => (
                  <div key={i} className="cursor-pointer overflow-hidden" onClick={() => setLightbox(p)}>
                    <img src={p} alt="" className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
            {photos.length === 3 && (
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-lg">
                <div className="row-span-2 cursor-pointer overflow-hidden" onClick={() => setLightbox(photos[0])}>
                  <img src={photos[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                {photos.slice(1).map((p, i) => (
                  <div key={i} className="cursor-pointer overflow-hidden" onClick={() => setLightbox(p)}>
                    <img src={p} alt="" className="w-full h-[180px] object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
            {photos.length >= 4 && (
              <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden shadow-lg">
                <div className="col-span-2 row-span-2 cursor-pointer overflow-hidden" onClick={() => setLightbox(photos[0])}>
                  <img src={photos[0]} alt="" className="w-full h-full min-h-[300px] object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                {photos.slice(1, 3).map((p, i) => (
                  <div key={i} className="cursor-pointer overflow-hidden" onClick={() => setLightbox(p)}>
                    <img src={p} alt="" className="w-full h-[148px] object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
                {photos.length > 3 && (
                  <div className="relative cursor-pointer overflow-hidden col-span-1" onClick={() => setLightbox(photos[3])}>
                    <img src={photos[3]} alt="" className="w-full h-[148px] object-cover" />
                    {photos.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-black">+{photos.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Extra photos below collage */}
            {photos.length > 4 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {photos.slice(4).map((p, i) => (
                  <img key={i} src={p} alt="" onClick={() => setLightbox(p)} className="w-20 h-20 rounded-xl object-cover cursor-pointer border-2 border-gray-200 hover:border-[#1E6FF2] transition-colors flex-shrink-0" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video */}
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

        <span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-3">Lajm</span>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">{item.title}</h1>
        {item.description && <p className="text-lg text-gray-500 mb-6">{item.description}</p>}
        <div className="prose prose-gray max-w-none">
          {item.content.split('\n').map((p: string, i: number) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </article>
      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative z-10 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-lg font-bold">
              ×
            </button>
            <img src={lightbox} alt="" className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            {/* Photo navigation dots */}
            {photos.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(p)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${lightbox === p ? 'border-[#1E6FF2] scale-110 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={p} alt="" className="w-14 h-14 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
