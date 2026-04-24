const fs = require("fs");

// =====================================================
// 1) TYPES — Add Video & News to types/index.ts
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
if (!types.includes("export interface Video")) {
  types += `

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  isFeaturedLanding: boolean;
  createdAt?: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  photo: string;
  isFeaturedLanding: boolean;
  createdAt?: string;
}
`;
  fs.writeFileSync("src/types/index.ts", types, "utf8");
  console.log("[OK] types/index.ts");
}

// =====================================================
// 2) SUPABASE-DB — Add video & news CRUD
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");

// Add snake_case mappings
if (!db.includes("isFeaturedLanding: 'is_featured_landing'")) {
  // Already has it from matches
} 
if (!db.includes("createdAt")) {
  db = db.replace(
    "isHome: 'is_home',",
    "isHome: 'is_home',\n    createdAt: 'created_at',"
  );
  // Also in toCamel
  db = db.replace(
    "is_home: 'isHome',",
    "is_home: 'isHome',\n    created_at: 'createdAt',"
  );
}

// Add video & news DB functions at the end
if (!db.includes("dbVideos")) {
  db += `

// ============ VIDEOS ============
export const dbVideos = {
  async getAll() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('videos').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('videos').delete().eq('id', id);
  }
};

// ============ NEWS ============
export const dbNews = {
  async getAll() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    return (data || []).map(toCamel) as any[];
  },
  async upsert(item: any) {
    const row = toSnake(item);
    const { data, error } = await supabase.from('news').upsert(row).select().single();
    if (error) throw error;
    return toCamel(data);
  },
  async remove(id: string) {
    await supabase.from('news').delete().eq('id', id);
  }
};
`;
  fs.writeFileSync("src/lib/supabase-db.ts", db, "utf8");
  console.log("[OK] supabase-db.ts");
}

// =====================================================
// 3) DATA CONTEXT — Add videos & news state + CRUD
// =====================================================
let ctx = fs.readFileSync("src/context/DataContext.tsx", "utf8");

// Add imports
if (!ctx.includes("Video, News")) {
  ctx = ctx.replace(
    "Decision } from '@/types';",
    "Decision, Video, News } from '@/types';"
  );
}
if (!ctx.includes("dbVideos")) {
  ctx = ctx.replace(
    "subscribeToTable,",
    "subscribeToTable,\n} from '@/lib/supabase-db';\nimport { dbVideos, dbNews"
  );
}

// Add to DataState
if (!ctx.includes("videos: Video[]")) {
  ctx = ctx.replace(
    "decisions: Decision[];",
    "decisions: Decision[];\n  videos: Video[];\n  news: News[];"
  );
}

// Add to initialState
if (!ctx.includes("videos: [],")) {
  ctx = ctx.replace(
    "decisions: [],",
    "decisions: [],\n  videos: [],\n  news: [],"
  );
}

// Add to DataContextType
if (!ctx.includes("addVideo")) {
  ctx = ctx.replace(
    "refreshData",
    "// Videos\n  addVideo: (v: Omit<Video, 'id'>) => string;\n  updateVideo: (v: Video) => void;\n  deleteVideo: (id: string) => void;\n  // News\n  addNews: (n: Omit<News, 'id'>) => string;\n  updateNews: (n: News) => void;\n  deleteNews: (id: string) => void;\n  refreshData"
  );
}

// Add CRUD functions before "const refreshData"
if (!ctx.includes("const addVideo")) {
  const crudCode = `
  // ============ VIDEOS ============
  const addVideo = (v: Omit<Video, 'id'>) => {
    const id = uuidv4();
    const item = { ...v, id } as Video;
    setState(p => ({ ...p, videos: [item, ...p.videos] }));
    dbVideos.upsert(item).catch(console.error);
    return id;
  };
  const updateVideo = (v: Video) => {
    setState(p => ({ ...p, videos: p.videos.map(x => x.id === v.id ? v : x) }));
    dbVideos.upsert(v).catch(console.error);
  };
  const deleteVideo = (id: string) => {
    setState(p => ({ ...p, videos: p.videos.filter(x => x.id !== id) }));
    dbVideos.remove(id).catch(console.error);
  };

  // ============ NEWS ============
  const addNews = (n: Omit<News, 'id'>) => {
    const id = uuidv4();
    const item = { ...n, id } as News;
    setState(p => ({ ...p, news: [item, ...p.news] }));
    dbNews.upsert(item).catch(console.error);
    return id;
  };
  const updateNews = (n: News) => {
    setState(p => ({ ...p, news: p.news.map(x => x.id === n.id ? n : x) }));
    dbNews.upsert(n).catch(console.error);
  };
  const deleteNews = (id: string) => {
    setState(p => ({ ...p, news: p.news.filter(x => x.id !== id) }));
    dbNews.remove(id).catch(console.error);
  };

`;
  ctx = ctx.replace("const refreshData", crudCode + "  const refreshData");
}

// Add to fetchAllData / loadData — load videos and news
if (!ctx.includes("dbVideos.getAll")) {
  ctx = ctx.replace(
    "const loadData = async () => {",
    "const loadData = async () => {\n      // will load videos/news below"
  );
  // Find where state is set after fetching
  // Add fetch calls - look for the pattern where all data is fetched
  // We'll add after the existing fetch
  if (ctx.includes("fetchAllData")) {
    ctx = ctx.replace(
      "const data = await fetchAllData();",
      "const data = await fetchAllData();\n        const [videosData, newsData] = await Promise.all([dbVideos.getAll(), dbNews.getAll()]);"
    );
    // Add to setState - find the setState that sets all data
    if (!ctx.includes("videos: videosData")) {
      ctx = ctx.replace(
        /setState\(prev => \(\{[\s\S]*?decisions:/,
        (match) => match.replace("decisions:", "videos: videosData as Video[],\n          news: newsData as News[],\n          decisions:")
      );
    }
  }
}

// Add to value object
if (!ctx.includes("addVideo, updateVideo")) {
  ctx = ctx.replace(
    "refreshData",
    "addVideo, updateVideo, deleteVideo,\n    addNews, updateNews, deleteNews,\n    refreshData"
  );
  // Only replace the LAST occurrence (in value object), avoid replacing interface
  // The above should work since refreshData appears in the value object
}

fs.writeFileSync("src/context/DataContext.tsx", ctx, "utf8");
console.log("[OK] DataContext.tsx");

// =====================================================
// 4) ADMIN VIDEOS PAGE
// =====================================================
const adminVideos = `import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Video } from '@/types';

function getEmbedUrl(url: string): string {
  // YouTube
  let m = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  // Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

const AdminVideos: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData() as any;
  const [form, setForm] = useState({ title: '', description: '', url: '', isFeaturedLanding: false });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.url.trim()) return;
    if (editId) {
      updateVideo({ ...form, id: editId } as Video);
      setEditId(null);
    } else {
      addVideo(form);
    }
    setForm({ title: '', description: '', url: '', isFeaturedLanding: false });
  };

  const startEdit = (v: Video) => {
    setEditId(v.id);
    setForm({ title: v.title, description: v.description, url: v.url, isFeaturedLanding: v.isFeaturedLanding });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Menaxho Videot</h2>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titulli" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Pershkrimi" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="Video URL (YouTube, Facebook, etj.)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLanding} onChange={e => setForm({...form, isFeaturedLanding: e.target.checked})} className="rounded" />
          Shfaq ne Ballina
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors">
            {editId ? 'Ruaj Ndryshimet' : 'Shto Video'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', description: '', url: '', isFeaturedLanding: false }); }} className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Anulo</button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {(videos || []).map((v: Video) => (
          <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">{v.title || 'Pa titull'}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{v.description}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{v.url}</p>
                {v.isFeaturedLanding && <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NE BALLINA</span>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(v)} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Ndrysho</button>
                <button onClick={() => deleteVideo(v.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">Fshij</button>
              </div>
            </div>
            {v.url && (
              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-black">
                <iframe src={getEmbedUrl(v.url)} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
              </div>
            )}
          </div>
        ))}
        {(!videos || videos.length === 0) && <p className="text-gray-400 text-sm text-center py-6">Nuk ka video te shtuara.</p>}
      </div>
    </div>
  );
};

export default AdminVideos;
`;
fs.writeFileSync("src/pages/admin/AdminVideos.tsx", adminVideos, "utf8");
console.log("[OK] AdminVideos.tsx");

// =====================================================
// 5) ADMIN NEWS PAGE
// =====================================================
const adminNews = `import React, { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { News } from '@/types';
import { supabase } from '@/lib/supabase';

const AdminNews: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useData() as any;
  const [form, setForm] = useState({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const name = Date.now() + '.' + ext;
      const { error } = await supabase.storage.from('news-photos').upload(name, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('news-photos').getPublicUrl(name);
      setForm(f => ({ ...f, photo: data.publicUrl }));
    } catch (err) {
      console.error(err);
      alert('Gabim gjate ngarkimit te fotos');
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editId) {
      updateNews({ ...form, id: editId } as News);
      setEditId(null);
    } else {
      addNews(form);
    }
    setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false });
  };

  const startEdit = (n: News) => {
    setEditId(n.id);
    setForm({ title: n.title, description: n.description, content: n.content, photo: n.photo, isFeaturedLanding: n.isFeaturedLanding });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Menaxho Lajmet</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Titulli i lajmit" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Pershkrimi i shkurter" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Permbajtja e plote e lajmit..." rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none resize-y" />
        
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            {uploading ? 'Duke ngarkuar...' : 'Ngarko Foto'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          {form.photo && <img src={form.photo} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLanding} onChange={e => setForm({...form, isFeaturedLanding: e.target.checked})} className="rounded" />
          Shfaq ne Ballina
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors">
            {editId ? 'Ruaj Ndryshimet' : 'Shto Lajmin'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', description: '', content: '', photo: '', isFeaturedLanding: false }); }} className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Anulo</button>}
        </div>
      </div>

      <div className="space-y-3">
        {(news || []).map((n: News) => (
          <div key={n.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-4">
              {n.photo && <img src={n.photo} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                {n.isFeaturedLanding && <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NE BALLINA</span>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(n)} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Ndrysho</button>
                <button onClick={() => deleteNews(n.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">Fshij</button>
              </div>
            </div>
          </div>
        ))}
        {(!news || news.length === 0) && <p className="text-gray-400 text-sm text-center py-6">Nuk ka lajme te shtuara.</p>}
      </div>
    </div>
  );
};

export default AdminNews;
`;
fs.writeFileSync("src/pages/admin/AdminNews.tsx", adminNews, "utf8");
console.log("[OK] AdminNews.tsx");

// =====================================================
// 6) LANDING NEWS — Slideshow above match tabs
// =====================================================
const landingNews = `import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import { News } from '@/types';

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
    <section className="px-4 pt-6 pb-2 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto">
        <div
          onClick={() => navigate('/lajme/' + item.id)}
          className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
          style= height: '260px' 
        >
          {/* Background Image */}
          {item.photo ? (
            <img src={item.photo} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-2.5 py-0.5 bg-[#1E6FF2] text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">Lajm</span>
            <h3 className="text-xl font-bold text-white leading-tight mb-1">{item.title}</h3>
            <p className="text-sm text-white/70 line-clamp-2">{item.description}</p>
          </div>

          {/* Arrows */}
          {featured.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg font-bold">
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg font-bold">
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {featured.length > 1 && (
            <div className="absolute bottom-2 right-4 flex gap-1.5">
              {featured.map((_: any, i: number) => (
                <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }} className={\`w-2 h-2 rounded-full transition-all \${i === current ? 'bg-white w-5' : 'bg-white/40'}\`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingNews;
`;
fs.writeFileSync("src/components/LandingNews.tsx", landingNews, "utf8");
console.log("[OK] LandingNews.tsx");

// =====================================================
// 7) LANDING VIDEOS — Below tables on Ballina
// =====================================================
const landingVideos = `import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Video } from '@/types';

function getEmbedUrl(url: string): string {
  let m = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

function getThumbnail(url: string): string | null {
  let m = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([\\w-]+)/);
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
      <section className="py-10 px-4 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6 text-center">Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((v: Video) => {
              const thumb = getThumbnail(v.url);
              return (
                <div key={v.id} onClick={() => setActiveVideo(v)} className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <div className="relative aspect-video bg-gray-900">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2]">
                        <span className="text-white/50 text-4xl">▶</span>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <span className="text-[#0A1E3C] text-2xl ml-1">▶</span>
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
`;
fs.writeFileSync("src/components/LandingVideos.tsx", landingVideos, "utf8");
console.log("[OK] LandingVideos.tsx");

// =====================================================
// 8) NEWS DETAIL PAGE
// =====================================================
const newsDetail = `import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { News } from '@/types';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { news } = useData() as any;
  const item: News | undefined = (news || []).find((n: News) => n.id === id);

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

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-[#1E6FF2] font-semibold mb-4 hover:underline flex items-center gap-1">
          ← Kthehu
        </button>
        {item.photo && (
          <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
            <img src={item.photo} alt="" className="w-full h-auto max-h-[400px] object-cover" />
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
    </div>
  );
};

export default NewsDetailPage;
`;
fs.writeFileSync("src/pages/NewsDetailPage.tsx", newsDetail, "utf8");
console.log("[OK] NewsDetailPage.tsx");

// =====================================================
// 9) UPDATE ADMIN PAGE — Add Video & News tabs
// =====================================================
let admin = fs.readFileSync("src/pages/AdminPage.tsx", "utf8");

// Add imports
if (!admin.includes("AdminVideos")) {
  admin = admin.replace(
    "import AdminLiveControl from './admin/AdminLiveControl';",
    "import AdminLiveControl from './admin/AdminLiveControl';\nimport AdminVideos from './admin/AdminVideos';\nimport AdminNews from './admin/AdminNews';"
  );
}

// Add tabs
if (!admin.includes("'videos'")) {
  admin = admin.replace(
    "{ key: 'kombetarja', label: 'Kombetarja', icon: null, editorAccess: false },",
    "{ key: 'kombetarja', label: 'Kombetarja', icon: null, editorAccess: false },\n    { key: 'videos', label: 'Video', icon: null, editorAccess: false },\n    { key: 'news', label: 'Lajme', icon: null, editorAccess: false },"
  );
}

// Add tab content
if (!admin.includes("activeTab === 'videos'")) {
  admin = admin.replace(
    "{activeTab === 'kombetarja' && isAdmin && <AdminKombetarja />}",
    "{activeTab === 'kombetarja' && isAdmin && <AdminKombetarja />}\n        {activeTab === 'videos' && isAdmin && <AdminVideos />}\n        {activeTab === 'news' && isAdmin && <AdminNews />}"
  );
}

fs.writeFileSync("src/pages/AdminPage.tsx", admin, "utf8");
console.log("[OK] AdminPage.tsx — tabs added");

// =====================================================
// 10) UPDATE APP LAYOUT — Add LandingNews & LandingVideos
// =====================================================
let layout = fs.readFileSync("src/components/AppLayout.tsx", "utf8");

if (!layout.includes("LandingNews")) {
  layout = layout.replace(
    "import LandingMatches from './LandingMatches';",
    "import LandingMatches from './LandingMatches';\nimport LandingNews from './LandingNews';\nimport LandingVideos from './LandingVideos';"
  );
  // Add LandingNews before LandingMatches
  layout = layout.replace(
    "<LandingMatches />",
    "<LandingNews />\n      <LandingMatches />"
  );
  // Add LandingVideos after DecisionsSection (before Footer)
  layout = layout.replace(
    "<Footer />",
    "<LandingVideos />\n      <Footer />"
  );
}

fs.writeFileSync("src/components/AppLayout.tsx", layout, "utf8");
console.log("[OK] AppLayout.tsx — LandingNews + LandingVideos added");

// =====================================================
// 11) UPDATE APP.TSX — Add news detail route
// =====================================================
let app = fs.readFileSync("src/App.tsx", "utf8");

if (!app.includes("NewsDetailPage")) {
  app = app.replace(
    "import NotFound from './pages/NotFound';",
    "import NotFound from './pages/NotFound';\nimport NewsDetailPage from './pages/NewsDetailPage';"
  );
  app = app.replace(
    '<Route path="/admin"',
    '<Route path="/lajme/:id" element={<NewsDetailPage />} />\n                <Route path="/admin"'
  );
}

fs.writeFileSync("src/App.tsx", app, "utf8");
console.log("[OK] App.tsx — news route added");

console.log("\n========== DONE ==========");
console.log("Krijo edhe storage bucket ne Supabase:");
console.log("  Dashboard > Storage > New Bucket > 'news-photos' (public)");
