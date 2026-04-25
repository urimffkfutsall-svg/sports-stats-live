import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbNtActivities } from '@/lib/supabase-db';

function formatDate(iso: string) {
  if (!iso) return '';
  const p = iso.split('-');
  if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
  return iso;
}

const NtActivitiesSection: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    dbNtActivities.getAll().then(all => {
      const home = all.filter((a: any) => a.showOnHome);
      home.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setActivities(home);
    }).catch(() => {});
  }, []);

  if (activities.length === 0) return null;

  const items = activities.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-7 bg-[#d0a650] rounded-full"></span>
          Aktivitetet e Kombetares
        </h2>
        <Link to="/kombetarja" className="text-sm font-bold text-[#1E6FF2] hover:underline">
          Shiko te gjitha &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((a: any) => (
          <Link key={a.id} to={'/aktivitet/' + a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            {a.photo && (
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={a.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-[10px] font-bold text-white/80 bg-[#1E6FF2] px-2 py-0.5 rounded-full uppercase">Kombetarja</span>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{a.title}</p>
              {a.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{a.description}</p>}
              {a.date && <p className="text-[10px] text-gray-400 mt-2 font-medium">{formatDate(a.date)}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NtActivitiesSection;
