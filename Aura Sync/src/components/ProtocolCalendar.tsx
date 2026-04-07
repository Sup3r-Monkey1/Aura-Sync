import { motion } from 'framer-motion';
import { X, Dumbbell, Home, Moon } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

export default function ProtocolCalendar({ onClose }: { onClose: () => void }) {
  const { schedule, updateSchedule } = useWorkoutStore();

  const getDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/98 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Sync Schedule</h2>
        <button onClick={onClose} className="p-2 bg-white/5"><X /></button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {getDays().map(dateStr => {
          const date = new Date(dateStr);
          const type = schedule[dateStr] || 'rest';
          
          return (
            <div key={dateStr} className="glass p-4 border-l-2 flex items-center justify-between" style={{ borderColor: type === 'gym' ? '#2563eb' : type === 'home' ? '#e535ab' : '#333' }}>
              <div>
                <div className="text-[10px] font-black uppercase text-white/30">{dayNames[date.getDay()]}</div>
                <div className="text-sm font-bold text-white/80">{dateStr}</div>
              </div>

              <div className="flex gap-2">
                <IconButton icon={<Dumbbell size={14}/>} active={type === 'gym'} onClick={() => updateSchedule(dateStr, 'gym')} color="cobalt" />
                <IconButton icon={<Home size={14}/>} active={type === 'home'} onClick={() => updateSchedule(dateStr, 'home')} color="magenta" />
                <IconButton icon={<Moon size={14}/>} active={type === 'rest'} onClick={() => updateSchedule(dateStr, 'rest')} color="white" />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] text-center mt-6 italic">
        Warning: Missing a scheduled "Gym" or "Home" link will grant the Ghost a +3000 lbs advantage.
      </p>
    </motion.div>
  );
}

function IconButton({ icon, active, onClick, color }: any) {
  const colorMap: any = { cobalt: 'bg-cobalt text-black', magenta: 'bg-magenta text-black', white: 'bg-white/20 text-white' };
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center transition-all ${active ? colorMap[color] : 'bg-white/5 text-white/20 hover:bg-white/10'}`}
    >
      {icon}
    </button>
  );
}
