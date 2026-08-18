import React, {useState, useEffect} from 'react';
import {dbFfkMoments} from '@/lib/supabase-db';

const FfkMomentsSection: React.FC = () => {
  const [moments, setMoments] = useState<any[]>([]);
  const [bgPhoto, setBgPhoto] = useState('');

  useEffect(() => {
    dbFfkMoments.getAll().then(all => {
      setMoments(all);
      if (all.length > 0) setBgPhoto(all[0].photo || '');
    }).catch(() => {});
  }, []);

  if (moments.length === 0) return null;

  const doubled = [...moments, ...moments];

  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background Photo with Overlay */}
      <div className="absolute inset-0">
        {bgPhoto && <img src={bgPhoto} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-[#0a1628]/85"></div>
      </div>

      <div className="relative z-10">
        {/* Title */}
        <h2 className="text-center mb-8">
          <span className="text-white text-2xl md:text-3xl font-black tracking-wider">FFK </span>
          <span className="text-[#d0a650] text-2xl md:text-3xl italic font-light tracking-wider">FUTSAL MOMENTS</span>
        </h2>

        {/* Scrolling Photos */}
        <div className="relative">
          <div className="flex animate-moments-marquee gap-6 items-center" style={{ width: 'max-content' }}>
            {doubled.map((m: any, i: number) => (
              <div key={m.id + '-' + i} className="flex-shrink-0 group cursor-pointer">
                <div className="w-48 h-64 md:w-56 md:h-72 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl group-hover:border-[#d0a650]/50 transition-all duration-300 group-hover:scale-105">
                  {m.photo && <img src={m.photo} alt={m.caption || ''} className="w-full h-full object-cover" />}
                </div>
                {m.caption && <p className="text-white/50 text-xs text-center mt-2 group-hover:text-white/80 transition-colors">{m.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FfkMomentsSection;
