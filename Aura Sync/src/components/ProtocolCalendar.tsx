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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-[120] bg-[#050505] p-6 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black italic uppercase text-white aura-text-glow">Sync_Schedule</h2>
        <button onClick={onClose} className="p-2 bg-white/5 text-white/40"><X size={20}/></button>
      </div>

      <div className="flex justify-between items-center mb-8 px-4">
        <button onClick={()=>setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))}><ChevronLeft/></button>
        <div className="text-sm font-black uppercase text-cobalt tracking-widest">{monthName} {viewDate.getFullYear()}</div>
        <button onClick={()=>setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))}><ChevronRight/></button>
      </div>

      <div className="aura-card p-4 rounded-[2rem] border-t-2 border-white/5">
        <div className="grid grid-cols-7 gap-1">
          {['S','M','T','W','T','F','S'].map(d=><div key={d} className="text-center text-[9px] font-black text-white/10 mb-2">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`p-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
            const type = schedule[dateStr] || 'rest';
            return (
              <div key={i} className="flex flex-col gap-1 items-center pb-2">
                 <button onClick={() => updateSchedule(dateStr, type === 'rest' ? 'gym' : type === 'gym' ? 'home' : 'rest')} className={`aspect-square w-full flex flex-col items-center justify-center text-[9px] font-black border transition-all rounded-lg ${type==='gym'?'bg-cobalt text-black border-cobalt':type==='home'?'bg-magenta text-black border-magenta':'bg-white/5 border-white/5 text-white/20'}`}>
                   {i+1}
                   {type === 'gym' && <Dumbbell size={8} />}
                   {type === 'home' && <Home size={8} />}
                   {type === 'rest' && <Moon size={8} />}
                 </button>
                 <button onClick={() => setActiveNoteDate(dateStr)} className="p-1"><Edit3 size={10} className={scheduleNotes[dateStr] ? "text-cobalt" : "text-white/10"}/></button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeNoteDate && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[130] bg-black/95 p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-sm aura-card p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6"><h3 className="text-sm font-black italic uppercase text-white">Daily Protocol Note</h3><button onClick={()=>setActiveNoteDate(null)}><X size={14}/></button></div>
                <textarea className="w-full h-48 bg-white/5 border border-white/10 p-4 text-white text-xs outline-none font-mono rounded-xl resize-none" value={scheduleNotes[activeNoteDate] || ""} onChange={(e)=>updateDateNote(activeNoteDate, e.target.value)} placeholder="Type mission details..."/>
                <button onClick={()=>setActiveNoteDate(null)} className="w-full py-4 aura-gradient-blue text-black font-black uppercase mt-6 rounded-xl">Authorize Note</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
