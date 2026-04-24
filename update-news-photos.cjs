const fs = require("fs");

// =====================================================
// 1) ADMIN NEWS — Multiple photo upload
// =====================================================
const adminNews = `import React, { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { News } from '@/types';
import { supabase } from '@/lib/supabase';

function getPhotos(photo: string): string[] {
  if (!photo) return [];
  try { const arr = JSON.parse(photo); if (Array.isArray(arr)) return arr; } catch {}
  return photo ? [photo] : [];
}

const AdminNews: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useData() as any;
  const [form, setForm] = useState({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });
  const [photos, setPhotos] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newPhotos = [...photos];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const name = Date.now() + '_' + i + '.' + ext;
        const { error } = await supabase.storage.from('news-photos').upload(name, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('news-photos').getPublicUrl(name);
        newPhotos.push(data.publicUrl);
      }
      setPhotos(newPhotos);
    } catch (err) {
      console.error(err);
      alert('Gabim gjate ngarkimit te fotos');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const photoJson = photos.length > 0 ? JSON.stringify(photos) : '';
    if (editId) {
      updateNews({ ...form, photo: photoJson, id: editId } as News);
      setEditId(null);
    } else {
      addNews({ ...form, photo: photoJson });
    }
    setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });
    setPhotos([]);
  };

  const startEdit = (n: News) => {
    setEditId(n.id);
    setForm({ title: n.title, description: n.description, content: n.content, photo: n.photo, isFeaturedLanding: n.isFeaturedLanding });
    setPhotos(getPhotos(n.photo));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Menaxho Lajmet</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titulli i lajmit" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Pershkrimi i shkurter" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Permbajtja e plote e lajmit..." rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none resize-y" />

        {/* Photo upload */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              {uploading ? 'Duke ngarkuar...' : 'Ngarko Foto'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <span className="text-xs text-gray-400">{photos.length} foto te zgjedhura</span>
          </div>
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative group">
                  <img src={p} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  <button onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">x</button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#1E6FF2]/80 text-white text-[8px] font-bold text-center py-0.5 rounded-b-lg">KRYESORE</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLanding} onChange={e => setForm({...form, isFeaturedLanding: e.target.checked})} className="rounded" />
          Shfaq ne Ballina
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors">
            {editId ? 'Ruaj Ndryshimet' : 'Shto Lajmin'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false }); setPhotos([]); }} className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Anulo</button>}
        </div>
      </div>

      <div className="space-y-3">
        {(news || []).map((n: News) => {
          const np = getPhotos(n.photo);
          return (
            <div key={n.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                {np.length > 0 && (
                  <div className="flex gap-1 flex-shrink-0">
                    {np.slice(0, 3).map((p: string, i: number) => (
                      <img key={i} src={p} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                    ))}
                    {np.length > 3 && <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">+{np.length - 3}</div>}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {n.isFeaturedLanding && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NE BALLINA</span>}
                    {np.length > 0 && <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{np.length} foto</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(n)} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Ndrysho</button>
                  <button onClick={() => deleteNews(n.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">Fshij</button>
                </div>
              </div>
            </div>
          );
        })}
        {(!news || news.length === 0) && <p className="text-gray-400 text-sm text-center py-6">Nuk ka lajme te shtuara.</p>}
      </div>
    </div>
  );
};

export default AdminNews;
`;
fs.writeFileSync("src/pages/admin/AdminNews.tsx", adminNews, "utf8");
console.log("[OK] AdminNews.tsx — multi-photo upload");

// =====================================================
// 2) NEWS DETAIL PAGE — Collage + Lightbox
// =====================================================
const newsDetail = `import React, { useState } from 'react';
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
          \\u2190 Kthehu
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

        <span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-3">Lajm</span>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">{item.title}</h1>
        {item.description && <p className="text-lg text-gray-500 mb-6">{item.description}</p>}
        <div className="prose prose-gray max-w-none">
          {item.content.split('\\n').map((p: string, i: number) => (
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
              \\u00D7
            </button>
            <img src={lightbox} alt="" className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            {/* Photo navigation dots */}
            {photos.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(p)}
                    className={\`rounded-lg overflow-hidden border-2 transition-all \${lightbox === p ? 'border-[#1E6FF2] scale-110 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'}\`}
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
`;
fs.writeFileSync("src/pages/NewsDetailPage.tsx", newsDetail, "utf8");
console.log("[OK] NewsDetailPage.tsx — collage + lightbox");

// =====================================================
// 3) LANDING NEWS — Use first photo from array
// =====================================================
let landing = fs.readFileSync("src/components/LandingNews.tsx", "utf8");

// Add getPhotos helper
if (!landing.includes("function getPhotos")) {
  landing = landing.replace(
    "const LandingNews: React.FC",
    `function getPhotos(photo: string): string[] {
  if (!photo) return [];
  try { const arr = JSON.parse(photo); if (Array.isArray(arr)) return arr; } catch {}
  return photo ? [photo] : [];
}

const LandingNews: React.FC`
  );
}

// Replace item.photo with getPhotos(item.photo)[0]
landing = landing.replace(
  "item.photo ? (",
  "getPhotos(item.photo)[0] ? ("
);
landing = landing.replace(
  '<img src={item.photo} alt=""',
  '<img src={getPhotos(item.photo)[0]} alt=""'
);

fs.writeFileSync("src/components/LandingNews.tsx", landing, "utf8");
console.log("[OK] LandingNews.tsx — uses first photo from array");

console.log("\nDone! Multi-photo news with collage and lightbox ready.");
