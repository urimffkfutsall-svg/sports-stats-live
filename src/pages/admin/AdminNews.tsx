import React, { useState, useRef } from 'react';
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
  const [form, setForm] = useState({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false });
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
      updateNews({ ...form, photo: photoJson, videoUrl: form.videoUrl || undefined, id: editId } as News);
      setEditId(null);
    } else {
      addNews({ ...form, photo: photoJson, videoUrl: form.videoUrl || undefined });
    }
    setForm({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false });
    setPhotos([]);
  };

  const startEdit = (n: News) => {
    setEditId(n.id);
    setForm({ title: n.title, description: n.description, content: n.content, photo: n.photo, videoUrl: (n as any).videoUrl || '', isFeaturedLanding: n.isFeaturedLanding });
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

        {/* Video URL */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Video URL (YouTube ose Facebook)</label>
          <input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="https://youtube.com/watch?v=... ose https://facebook.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.isFeaturedLanding} onChange={e => setForm({...form, isFeaturedLanding: e.target.checked})} className="rounded" />
          Shfaq ne Ballina
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors">
            {editId ? 'Ruaj Ndryshimet' : 'Shto Lajmin'}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', description: '', content: '', photo: '', videoUrl: '', isFeaturedLanding: false }); setPhotos([]); }} className="px-5 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Anulo</button>}
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
                    {(n as any).videoUrl && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">VIDEO</span>}
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
