import React, { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { NormativeAct } from '@/types';

const AdminNormativeActs: React.FC = () => {
  const { normativeActs, addNormativeAct, updateNormativeAct, deleteNormativeAct } = useData() as any;
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pdfData, setPdfData] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('PDF shumë i madh (max 10MB)'); return; }
    setUploading(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPdfData(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const openPdf = (url: string) => {
    if (url.startsWith('data:')) {
      fetch(url).then(r => r.blob()).then(blob => {
        window.open(URL.createObjectURL(blob), '_blank');
      });
    } else {
      window.open(url, '_blank');
    }
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { alert('Shto titullin'); return; }
    if (!editId && !pdfData) { alert('Zgjedh PDF'); return; }
    if (editId) {
      const existing = normativeActs.find((a: NormativeAct) => a.id === editId);
      updateNormativeAct({ ...existing, ...form, pdfUrl: pdfData || existing.pdfUrl });
      setEditId(null);
    } else {
      addNormativeAct({ ...form, pdfUrl: pdfData });
    }
    setForm({ title: '', description: '' });
    setPdfData('');
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (a: NormativeAct) => {
    setEditId(a.id);
    setForm({ title: a.title, description: a.description || '' });
    setPdfData('');
    setFileName('');
  };

  const cancel = () => {
    setEditId(null);
    setForm({ title: '', description: '' });
    setPdfData('');
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const sorted = [...(normativeActs || [])].sort((a: NormativeAct, b: NormativeAct) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Aktet Normative</h2>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Titulli i aktit normativ"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none"
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Pershkrimi i shkurter (opsional)"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none"
        />
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            {editId ? 'Nderro PDF (opsional)' : 'Ngarko PDF *'}
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E6FF2] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#1858C8]"
          />
          {uploading && <p className="text-xs text-blue-500 mt-1">Duke ngarkuar...</p>}
          {fileName && !uploading && <p className="text-xs text-green-600 mt-1">✓ {fileName}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#1E6FF2] text-white rounded-lg text-sm font-semibold hover:bg-[#1858C8] transition-colors"
          >
            {editId ? 'Ruaj Ndryshimet' : 'Shto Aktin'}
          </button>
          {editId && (
            <button onClick={cancel} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-gray-400 text-center py-8 bg-white rounded-xl border border-gray-100">Nuk ka akte normative.</p>
        ) : sorted.map((a: NormativeAct, i: number) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#2a499a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{a.title}</p>
              {a.description && <p className="text-xs text-gray-400 truncate">{a.description}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openPdf(a.pdfUrl)}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100"
              >
                Shiko
              </button>
              <button
                onClick={() => startEdit(a)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100"
              >
                Ndrysho
              </button>
              <button
                onClick={() => { if (confirm('Fshij?')) deleteNormativeAct(a.id); }}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100"
              >
                Fshij
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNormativeActs;