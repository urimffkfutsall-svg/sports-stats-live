import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import { Match } from '@/types';

const MONTH_NAMES = [
  'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nentor', 'Dhjetor',
];
const WEEKDAYS = ['Hen', 'Mar', 'Mer', 'Enj', 'Pre', 'Sht', 'Die'];

function dotColorFor(m: Match): string {
  if (m.status !== 'finished') return '#94A3B8'; // ⚪ e ardhshme / live
  const hs = m.homeScore ?? 0;
  const as_ = m.awayScore ?? 0;
  if (hs === as_) return '#F59E0B'; // 🟡 barazim
  return '#22C55E'; // 🟢 (nje fitore u shenua ne kete ndeshje)
}

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { matches, competitions, getTeamById } = useData();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [compFilter, setCompFilter] = useState<'all' | string>('all');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const filteredMatches = useMemo(
    () => matches.filter(m => compFilter === 'all' || m.competitionId === compFilter),
    [matches, compFilter]
  );

  const matchesByDate = useMemo(() => {
    const map: Record<string, Match[]> = {};
    filteredMatches.forEach(m => {
      if (!m.date) return;
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    });
    return map;
  }, [filteredMatches]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(iso);
  }

  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const selectedMatches = selectedDay ? (matchesByDate[selectedDay] || []) : [];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kalendari i Ndeshjeve</h1>
          <select
            value={compFilter}
            onChange={e => { setCompFilter(e.target.value); setSelectedDay(null); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
          >
            <option value="all">Te gjitha kompeticionet</option>
            {competitions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <span className="font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-center text-[11px] font-bold text-gray-400 uppercase py-1">{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((iso, i) => {
              if (!iso) return <div key={`empty-${i}`} />;
              const dayMatches = matchesByDate[iso] || [];
              const isToday = iso === todayIso;
              const isSelected = iso === selectedDay;
              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDay(dayMatches.length > 0 ? iso : null)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                    isSelected ? 'bg-[#0f1830] text-white' : isToday ? 'bg-[#0f1830]/10 text-[#0f1830]' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{parseInt(iso.split('-')[2], 10)}</span>
                  {dayMatches.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayMatches.slice(0, 3).map((m, idx) => (
                        <span key={idx} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: isSelected ? '#FFF' : dotColorFor(m) }} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              Ndeshjet me {selectedDay.split('-').reverse().join('/')}
            </h3>
            <div className="space-y-2">
              {selectedMatches.map(m => {
                const home = getTeamById(m.homeTeamId);
                const away = getTeamById(m.awayTeamId);
                return (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/live/${m.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      {home?.logo && <img src={home.logo} alt="" className="w-6 h-6 rounded-full object-cover" />}
                      <span className="text-sm font-semibold text-gray-800">{home?.name}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-700 px-3">
                      {m.status === 'finished' ? `${m.homeScore ?? 0} - ${m.awayScore ?? 0}` : (m.time || 'vs')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{away?.name}</span>
                      {away?.logo && <img src={away.logo} alt="" className="w-6 h-6 rounded-full object-cover" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!selectedDay && (
          <p className="text-center text-xs text-gray-400 mt-6">Kliko mbi nje date me pika ngjyra per te pare ndeshjet e asaj dite.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
