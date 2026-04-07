import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Home, Moon, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

export default function ProtocolCalendar({ onClose }: { onClose: () => void }) {
  const { schedule, updateSchedule, scheduleNotes, updateDateNote } = useWorkoutStore();
  const [viewDate, setViewDate] = useState(new Date());
  const [activeNoteDate, setActiveNoteDate] = useState<string | null>(null);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-[#050505] p-6 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Month_Sync</h2>
        <button onClick={onClose} className="p-3 bg-white/5 text-white/40"><X size={20}/></button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <button onClick={()=>setViewDate(new Date(year, viewDate.getMonth()-1, 1))}><ChevronLeft/></button>
        <div className="text-sm font-black uppercase text-cobalt tracking-widest">{monthName} {year}</div>
        <button onClick={()=>setViewDate(new Date(year, viewDate.getMonth()+1, 1))}><ChevronRight/></button>
      </div>

      <div className="glass p-4">
        <div className="grid grid-cols-7 gap-1">
          {['S','M','T','W','T','F','S'].map(d=><div key={d} className="text-center text-[9px] font-black text-white/20 mb-2">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`p-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            const type = schedule[dateStr] || 'rest';
            return (
              <div key={i} className="flex flex-col gap-1">
                 <button onClick={() => updateSchedule(dateStr, type === 'rest' ? 'gym' : type === 'gym' ? 'home' : 'rest')} className={`aspect-square flex items-center justify-center text-[10px] font-black border ${type==='gym'?'bg-cobalt text-black':type==='home'?'bg-magenta text-black':'bg-white/5 border-white/5 text-white/40'}`}>{i+1}</button>
                 <button onClick={() => setActiveNoteDate(dateStr)} className="h-6 w-full flex items-center justify-center bg-white/5 active:bg-cobalt/20 transition-colors"><Edit3 size={10} className={scheduleNotes[dateStr] ? "text-cobalt" : "text-white/10"}/></button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeNoteDate && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[130] bg-black/98 p-8 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-black italic uppercase text-white tracking-widest">Protocol Note: {activeNoteDate}</h3><button onClick={()=>setActiveNoteDate(null)}><X/></button></div>
             <textarea className="w-full h-64 bg-white/5 border border-white/10 p-6 text-white text-sm outline-none font-mono" value={scheduleNotes[activeNoteDate] || ""} onChange={(e)=>updateDateNote(activeNoteDate, e.target.value)} placeholder="Type workout details..."/>
             <button onClick={()=>setActiveNoteDate(null)} className="w-full py-4 bg-cobalt text-black font-black uppercase mt-6">Confirm Update</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
