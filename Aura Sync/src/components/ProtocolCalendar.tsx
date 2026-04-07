import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Dumbbell, Home, Moon, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

export default function ProtocolCalendar({ onClose }: { onClose: () => void }) {
  const { schedule, updateSchedule, protocolNotes, updateProtocolNotes } = useWorkoutStore();
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  const prevMonth = () => setViewDate(new Date(year, viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, viewDate.getMonth() + 1, 1));

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[110] bg-[#050505] p-6 flex flex-col overflow-y-auto no-scrollbar"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Sync Schedule</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Full Month Operational View</p>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 text-white/40"><X size={20} /></button>
      </div>

      {/* MONTH SELECTOR */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={prevMonth} className="p-2 text-white/40"><ChevronLeft size={20}/></button>
        <div className="text-sm font-black uppercase tracking-widest text-cobalt">{monthName} {year}</div>
        <button onClick={nextMonth} className="p-2 text-white/40"><ChevronRight size={20}/></button>
      </div>

      {/* CALENDAR GRID */}
      <div className="glass p-4 mb-8">
        <div className="grid grid-cols-7 mb-4">
          {dayLabels.map(d => <div key={d} className="text-center text-[10px] font-black text-white/20">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`pad-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const type = schedule[dateStr] || 'rest';
            
            return (
              <button 
                key={dayNum}
                onClick={() => {
                  const nextType = type === 'rest' ? 'gym' : type === 'gym' ? 'home' : 'rest';
                  updateSchedule(dateStr, nextType);
                }}
                className={`aspect-square flex flex-col items-center justify-center border transition-all ${
                  type === 'gym' ? 'bg-cobalt border-cobalt text-black shadow-[0_0_10px_#2563eb40]' : 
                  type === 'home' ? 'bg-magenta border-magenta text-black shadow-[0_0_10px_#e535ab40]' : 
                  'bg-white/5 border-white/5 text-white/40'
                }`}
              >
                <span className="text-[10px] font-black">{dayNum}</span>
                {type === 'gym' && <Dumbbell size={8} />}
                {type === 'home' && <Home size={8} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex gap-4 justify-center mb-8">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cobalt" /><span className="text-[8px] text-white/40 uppercase font-black">Gym</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-magenta" /><span className="text-[8px] text-white/40 uppercase font-black">Home</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/10" /><span className="text-[8px] text-white/40 uppercase font-black">Rest</span></div>
      </div>

      {/* PROTOCOL NOTEPAD */}
      <div className="glass-strong p-6 border-l-2 border-cobalt">
         <div className="flex items-center gap-2 mb-4">
            <Edit3 size={14} className="text-cobalt" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Protocol_Notes</span>
         </div>
         <textarea 
          value={protocolNotes}
          onChange={(e) => updateProtocolNotes(e.target.value)}
          placeholder="Script your workout protocols for this month..."
          className="w-full h-48 bg-transparent text-xs text-white/60 outline-none resize-none placeholder:text-white/10 leading-relaxed font-mono"
         />
      </div>

      <p className="text-[8px] text-white/10 uppercase tracking-[0.4em] text-center mt-12 italic leading-relaxed">
        Neural Sync active. <br/> Schedule failure triggers Ghost Volume boost.
      </p>
    </motion.div>
  );
}
