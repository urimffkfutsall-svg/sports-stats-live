import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Video } from '@/types';

function getEmbedUrl(url: string): string {
  // YouTube
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (m) return 'https://www.youtube.com/embed/' + m[1];
  // Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false';
  }
  return url;
}

const AdminVideos: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData() as any;
  const [form, setForm] = useState({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.url.trim()) return;
    if (editId) {
      updateVideo({ ...form, id: editId } as Video);
      setEditId(null);
    } else {
      addVideo(form);
    }
    setForm({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false });
  };

  const startEdit = (v: Video) => {
    setEditId(v.id);
    setForm({ title: v.title, description: v.description, url: v.url, isFeaturedLanding: v.isFeaturedLanding, isFeaturedSuperliga: (v as any).isFeaturedSuperliga || false, isFeaturedLigaPare: (v as any).isFeaturedLigaPare || false });
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
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedSuperliga} onChange={e => setForm({...form, isFeaturedSuperliga: e.target.checked})} className="rounded" />
          Shfaq te Superliga
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLigaPare} onChange={e => setForm({...form, isFeaturedLigaPare: e.target.checked})} className="rounded" />
          Shfaq te Liga e Pare
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors">
            {editId ? 'Ruaj Ndryshimet' : 'Shto Video'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', description: '', url: '', isFeaturedLanding: false, isFeaturedSuperliga: false, isFeaturedLigaPare: false }); }} className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Anulo</button>}
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
                {(v as any).isFeaturedSuperliga && <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">SUPERLIGA</span>}
                {(v as any).isFeaturedLigaPare && <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">LIGA E PARE</span>}
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
