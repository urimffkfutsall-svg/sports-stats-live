import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { ClubDocument, ClubDocumentCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { loadClubDocuments, saveClubDocuments } from '@/lib/clubPortalStorage';

const CATEGORY_LABELS: Record<ClubDocumentCategory, string> = {
  licence: 'Licence',
  raport: 'Raport',
  njoftim: 'Njoftim',
  ndeshje: 'Ndeshje',
  tjeter: 'Tjeter',
};

const AdminDocuments: React.FC = () => {
  const { teams, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();
  const [documents, setDocuments] = useState<ClubDocument[]>(() => loadClubDocuments());
  const [showForm, setShowForm] = useState(false);
  const [teamFilter, setTeamFilter] = useState<'all' | string>('all');
  const [form, setForm] = useState({ title: '', url: '', category: 'njoftim' as ClubDocumentCategory, teamId: 'all' });

  const refresh = () => setDocuments(loadClubDocuments());

  const handleAdd = () => {
    if (!form.title || !form.url) return;
    const newDoc: ClubDocument = {
      id: uuidv4(),
      title: form.title,
      url: form.url,
      category: form.category,
      teamId: form.teamId,
      seasonId: activeSeason ? activeSeason.id : '',
      uploadedBy: 'admin',
      createdAt: new Date().toISOString(),
    };
    const all = [...loadClubDocuments(), newDoc];
    saveClubDocuments(all);
    refresh();
    setForm({ title: '', url: '', category: 'njoftim', teamId: 'all' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const all = loadClubDocuments().filter(d => d.id !== id);
    saveClubDocuments(all);
    refresh();
  };

  const visibleDocuments = documents
    .filter(d => teamFilter === 'all' || d.teamId === teamFilter)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Document Center</h2>
          <p className="text-sm text-gray-500">
            Cakto dokumente (licenca, raporte, njoftime) per nje skuadre specifike, ose zgjidh
            "Te gjitha klubet" per njoftime te pergjithshme te FFK-se. Nje klub sheh vetem
            dokumentet e veta + ato te pergjithshme.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-[#0f1830] text-white rounded-xl text-sm font-medium hover:bg-[#1c3570]">
          Shto Dokument
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Titulli i dokumentit" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Linku (PDF/Google Drive/etj.)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ClubDocumentCategory })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <select value={form.teamId} onChange={e => setForm({ ...form, teamId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Te gjitha klubet (njoftim i pergjithshem)</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="px-5 py-2.5 bg-[#0f1830] text-white rounded-xl text-sm font-medium hover:bg-[#1c3570]">Ruaj</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Anulo</button>
          </div>
        </div>
      )}

      <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
        <option value="all">Te gjitha dokumentet</option>
        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Titulli</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Kategoria</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Klubi</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleDocuments.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Nuk ka dokumente</td></tr>
            ) : visibleDocuments.map(d => {
              const team = teams.find(t => t.id === d.teamId);
              return (
                <tr key={d.id}>
                  <td className="px-4 py-3"><a href={d.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0f1830] hover:underline">{d.title}</a></td>
                  <td className="px-4 py-3 text-gray-600">{CATEGORY_LABELS[d.category]}</td>
                  <td className="px-4 py-3 text-gray-600">{d.teamId === 'all' ? 'Te gjitha klubet' : (team?.name || '-')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline text-xs font-medium">Fshi</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDocuments;
