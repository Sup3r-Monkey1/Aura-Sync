import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Trash2, Power, RotateCcw, Cpu, Dumbbell as DbIcon, ShieldCheck, Edit3, Search } from 'lucide-react';
import { useWorkoutStore, triggerAlert } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';

export default function GhostLog() {
  const { session, endSession, removeExercise, addSet, removeSet, updateSet, completeSet, setDuration, restDuration, activeCardId, activeSetIndex, setTracking, dailyProtocols, toggleDailyExercise, startSession, scheduleNotes } = useWorkoutStore();
  
  const [activeDay, setActiveDay] = useState('monday');
  const [activeTab, setActiveTab] = useState<'machines' | 'hardware' | 'cardio'>('machines');
  const [search, setSearch] = useState('');
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const filteredRegistry = useMemo(() => {
    return workoutRegistry
      .filter(ex => {
        if (activeTab === 'machines') return ex.isMachine && ex.type !== 'cardio';
        if (activeTab === 'hardware') return !ex.isMachine;
        return ex.type === 'cardio';
      })
      .filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search]);

  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        const card = session?.cards.find(c => c.id === activeCardId);
        if (card) completeSet(activeCardId!, card.sets[activeSetIndex].id);
        setTimerState('REST'); setTimeLeft(restDuration); triggerAlert('success');
      } else if (timerState === 'REST') {
        const card = session?.cards.find(c => c.id === activeCardId);
        if (card && activeSetIndex + 1 < card.sets.length) {
          setTracking(activeCardId!, activeSetIndex + 1); setTimerState('SET'); setTimeLeft(setDuration);
        } else {
          setTimerState('IDLE'); setIsPaused(true); setTracking(null, 0);
        }
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState, session, activeCardId, activeSetIndex, completeSet, restDuration, setDuration, setTracking]);

  if (!session) return (
    <div className="min-h-screen bg-[#050505] p-4 pt-10 pb-32 overflow-y-auto no-scrollbar">
      <h2 className="text-xl font-black italic text-white uppercase mb-6 px-2 tracking-tighter aura-text-glow">Sovereign_Protocol</h2>
      
      <div className="aura-card p-5 mb-6 rounded-2xl">
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6">
          {days.map(d => (
            <button key={d} onClick={() => setActiveDay(d)} className={`px-4 py-2 shrink-0 text-[10px] font-black uppercase border transition-all ${activeDay === d ? 'bg-cobalt text-black border-cobalt shadow-[0_0_15px_#2563eb]' : 'bg-white/5 border-white/10 text-white/30'}`}>{d.slice(0,3)}</button>
          ))}
        </div>

        <div className="flex gap-4 mb-4">
          <button onClick={() => setActiveTab('machines')} className={`text-[10px] font-black uppercase flex items-center gap-2 ${activeTab === 'machines' ? 'text-cobalt' : 'text-white/20'}`}><Cpu size={14}/> Machines</button>
          <button onClick={() => setActiveTab('hardware')} className={`text-[10px] font-black uppercase flex items-center gap-2 ${activeTab === 'hardware' ? 'text-white' : 'text-white/20'}`}><DbIcon size={14}/> Hardware</button>
          <button onClick={() => setActiveTab('cardio')} className={`text-[10px] font-black uppercase flex items-center gap-2 ${activeTab === 'cardio' ? 'text-magenta' : 'text-white/20'}`}><Clock size={14}/> Cardio</button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search Hardware Matrix..." 
            className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-[10px] uppercase font-black tracking-widest text-white outline-none focus:border-cobalt/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto no-scrollbar mb-6 py-2 border-y border-white/5">
          {filteredRegistry.map(ex => {
            const isSelected = dailyProtocols[activeDay]?.includes(ex.id);
            return (
              <button key={ex.id} onClick={() => toggleDailyExercise(activeDay, ex.id)} className={`flex justify-between items-center p-3 border-l-2 ${isSelected ? 'bg-cobalt/10 border-cobalt' : 'bg-white/[0.01] border-white/5'}`}>
                <span className={`text-[9px] font-bold uppercase text-left ${isSelected ? 'text-white' : 'text-white/30'}`}>{ex.name}</span>
                {isSelected && <ShieldCheck size={14} className="text-cobalt" />}
              </button>
            );
          })}
        </div>
        <button onClick={() => { startSession(workoutRegistry.filter(ex => dailyProtocols[activeDay]?.includes(ex.id))); }} className="w-full py-5 aura-gradient-blue text-black font-black uppercase text-xs tracking-[0.4em] rounded-xl shadow-lg">Initialize Daily Link</button>
      </div>

      <div className="aura-card p-5 border-l-4 border-magenta">
         <div className="text-[9px] font-black text-magenta uppercase mb-3"><Edit3 size={12} className="inline mr-2"/> Daily_Mission_Directives</div>
         <p className="text-[11px] text-white/50 font-mono italic leading-relaxed">{scheduleNotes[today] || "Awaiting target acquisition."}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      <div className={`sticky top-0 z-[100] p-6 border-b border-white/5 transition-all duration-700 backdrop-blur-3xl ${timerState === 'SET' ? 'bg-cobalt/40' : timerState === 'REST' ? 'bg-magenta/40' : 'bg-black/95'}`}>
        <div className="flex justify-between items-center mb-6">
           <div className="text-[9px] font-black uppercase text-white/40 tracking-[0.3em] font-mono italic">{timerState}_LOCKED</div>
           <button onClick={endSession} className="px-5 py-2 bg-red-500 text-black text-[9px] font-black uppercase active:scale-90 transition-all rounded-lg shadow-lg shadow-red-500/20">Abort</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-7xl font-black italic tracking-tighter text-glow-cobalt text-white font-mono leading-none">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <button onClick={() => setIsPaused(!isPaused)} className="mt-4 px-10 py-3 bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 rounded-full">{isPaused ? 'Resume' : 'Pause'}</button>
        </div>
      </div>
      <div className="p-4 space-y-6 mt-6">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-3">
              <div><h3 className="text-base font-black italic uppercase text-white/90 truncate max-w-[200px]">{card.exercise.name}</h3><p className="text-[8px] text-white/30 uppercase tracking-[0.2em]">{card.exercise.equipment}</p></div>
              <button onClick={() => removeExercise(card.id)} className="text-white/10 p-1"><X size={14}/></button>
            </div>
            <div className="space-y-2">
              {card.sets.map((set, idx) => {
                const isActive = activeCardId === card.id && activeSetIndex === idx;
                return (
                  <div key={set.id} className={`glass p-4 border-l-2 flex items-center justify-between transition-all rounded-xl ${set.completed ? 'border-terminal opacity-30' : isActive ? 'border-cobalt glow-cobalt bg-cobalt/5' : 'border-white/10'}`}>
                    <div className="flex gap-4">
                       <span className={`text-[10px] font-mono ${isActive ? 'text-cobalt' : 'text-white/20'}`}>0{idx+1}</span>
                       <div className="flex gap-4">
                          <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-12 bg-transparent text-xl font-black text-white outline-none" />
                          <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-10 bg-transparent text-xl font-black text-white outline-none" />
                       </div>
                    </div>
                    {!set.completed ? (
                      <button onClick={() => isActive && timerState === 'SET' ? setTimeLeft(0) : setTracking(card.id, idx)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${isActive && timerState === 'SET' ? 'bg-terminal text-black' : 'bg-cobalt text-white'}`}>
                        {isActive && timerState === 'SET' ? 'Log' : 'Start'}
                      </button>
                    ) : <Check size={24} className="text-terminal" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
