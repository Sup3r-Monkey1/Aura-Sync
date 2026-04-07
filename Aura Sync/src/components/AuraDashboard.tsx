import { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Watch, ShieldCheck, Cpu, Dumbbell as DbIcon } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';

export default function AuraDashboard() {
  const { watchConnected, connectWatch, session, userName, userAge, userWeight, sessionLimit, setSessionLimit, endSession, startSession, dailyProtocols, toggleDailyExercise } = useWorkoutStore();
  const [activeDay, setActiveDay] = useState('monday');
  const [activeTab, setActiveTab] = useState<'machine' | 'free'>('machine');

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleStartSession = () => {
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const ids = dailyProtocols[dayOfWeek] || [];
    const exercises = workoutRegistry.filter(ex => ids.includes(ex.id));
    startSession(exercises);
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-24 p-4 pt-12 overflow-x-hidden">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-black tracking-widest text-white uppercase">{userName}</h1>
          <p className="text-[10px] text-white/40 font-mono tracking-tighter">BIO_DATA: {userAge}Y // {userWeight}LBS</p>
        </div>
        {session && <div className="px-2 py-1 bg-cobalt text-black text-[9px] font-black animate-pulse">LINK_LIVE</div>}
      </div>

      <div className="glass p-5 mb-6">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Daily Matrix Config</div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6">
          {days.map(d => (
            <button key={d} onClick={() => setActiveDay(d)} className={`px-3 py-2 text-[8px] font-black uppercase border transition-all ${activeDay === d ? 'bg-cobalt text-black border-cobalt' : 'bg-white/5 border-white/10 text-white/40'}`}>
              {d.slice(0,3)}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mb-4 border-b border-white/5 pb-2">
          <button onClick={() => setActiveTab('machine')} className={`text-[10px] font-black uppercase flex items-center gap-2 ${activeTab === 'machine' ? 'text-cobalt' : 'text-white/20'}`}><Cpu size={12}/> Machines</button>
          <button onClick={() => setActiveTab('free')} className={`text-[10px] font-black uppercase flex items-center gap-2 ${activeTab === 'free' ? 'text-white' : 'text-white/20'}`}><DbIcon size={12}/> Free Weights</button>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto no-scrollbar pr-2">
          {workoutRegistry
            .filter(ex => (activeTab === 'machine' ? ex.isMachine : !ex.isMachine))
            .map(ex => {
              const isSelected = dailyProtocols[activeDay]?.includes(ex.id);
              return (
                <button 
                  key={ex.id} 
                  onClick={() => toggleDailyExercise(activeDay, ex.id)}
                  className={`flex justify-between items-center p-3 border-r-2 transition-all ${isSelected ? 'bg-cobalt/10 border-cobalt' : 'bg-white/[0.02] border-white/10'}`}
                >
                  <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-white/40'}`}>{ex.name}</span>
                  {isSelected && <ShieldCheck size={12} className="text-cobalt" />}
                </button>
              );
            })}
        </div>
      </div>

      <div className="glass p-5 border-l-2 border-cobalt mb-6">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest"><Timer size={14}/> Session Control</div>
            <div className="text-[10px] font-mono text-white/40 font-bold">{(sessionLimit/3600).toFixed(1)} HRS</div>
         </div>
         {!session ? (
           <div className="space-y-6">
              <input type="range" min="300" max="36000" step="300" value={sessionLimit} onChange={(e) => setSessionLimit(Number(e.target.value))} className="w-full accent-cobalt" />
              <button onClick={handleStartSession} className="w-full py-5 bg-cobalt text-black font-black uppercase text-xs tracking-[0.4em] shadow-[0_0_20px_#2563eb40] active:scale-95 transition-all">Synchronize Daily Link</button>
           </div>
         ) : (
           <button onClick={endSession} className="w-full py-5 bg-red-500/20 text-red-500 border border-red-500/40 font-black uppercase text-xs tracking-widest active:scale-95 transition-all">Terminate Link</button>
         )}
      </div>

      {!watchConnected && (
         <button onClick={connectWatch} className="w-full py-4 border border-dashed border-white/10 text-white/20 text-[9px] font-black uppercase tracking-widest">Authorize External Heart Rate Sensor</button>
      )}
    </div>
  );
}
