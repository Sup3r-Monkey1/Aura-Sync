import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Timer, Check, X, Award } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, updateSet, completeSet, startRest } = useWorkoutStore();
  const [showAdd, setShowAdd] = useState(false);
  const [activeTimerSetId, setActiveTimerSetId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeTimerSetId) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeTimerSetId]);

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
        <Plus size={48} className="text-white/10 mb-4" />
        <h2 className="text-lg font-bold text-white/40 uppercase tracking-widest">Awaiting Link</h2>
        <p className="text-[10px] text-white/20 mt-2 uppercase">Initialize session via HUD</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-12 pb-32 space-y-8 bg-[#050505] min-h-screen">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Ghost Protocol</h2>
        <button onClick={endSession} className="text-[10px] font-bold text-hazard border border-hazard/30 px-3 py-1">TERMINATE</button>
      </div>

      {session.cards.map((card) => (
        <div key={card.id} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black italic text-lg uppercase tracking-tight text-white/90">{card.exercise.name}</h3>
            <button onClick={() => removeExercise(card.id)} className="text-white/20"><X size={16}/></button>
          </div>

          <div className="space-y-3">
            {card.sets.map((set, idx) => (
              <div key={set.id} className={`glass p-4 border-l-2 ${set.completed ? 'border-terminal/40 opacity-40' : 'border-cobalt/40'}`}>
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Set {idx + 1}</span>
                   {activeTimerSetId === set.id && (
                     <div className="text-cobalt font-mono text-xs animate-pulse">LIFTING: {seconds}s / 60s</div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                   <input 
                    type="number" 
                    value={set.weight} 
                    onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))}
                    className="bg-white/5 p-3 text-xl font-black tracking-tighter focus:outline-none focus:bg-cobalt/10" 
                   />
                   <input 
                    type="number" 
                    value={set.reps} 
                    onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))}
                    className="bg-white/5 p-3 text-xl font-black tracking-tighter focus:outline-none focus:bg-cobalt/10" 
                   />
                </div>

                {!set.completed && (
                  <div className="flex gap-2">
                    {activeTimerSetId !== set.id ? (
                      <button 
                        onClick={() => setActiveTimerSetId(set.id)}
                        className="flex-1 bg-white/5 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Play size={12} /> Start Set
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          completeSet(card.id, set.id);
                          setActiveTimerSetId(null);
                          hapticSetComplete();
                        }}
                        className="flex-1 bg-terminal text-black py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Square size={12} /> Stop & Log
                      </button>
                    )}
                  </div>
                )}

                {set.completed && (
                   <button 
                    onClick={() => { startRest(90); hapticTap(); }}
                    className="w-full border border-cobalt/30 py-2 text-[9px] font-bold text-cobalt uppercase tracking-[0.2em]"
                   >
                     Initiate 90s Rest
                   </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => addSet(card.id)} className="w-full py-2 border border-dashed border-white/10 text-[10px] text-white/20 uppercase tracking-widest">+ Add Set</button>
        </div>
      ))}

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-14 w-14 bg-cobalt text-black flex items-center justify-center glow-cobalt z-40">
        <Plus />
      </button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black italic uppercase tracking-tighter">Protocols</h2><button onClick={() => setShowAdd(false)}><X /></button></div>
            <div className="grid gap-2">
              {workoutRegistry.map(ex => (
                <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-4 text-left border-white/5">
                  <div className="text-[10px] text-cobalt font-mono uppercase mb-1">{ex.category}</div>
                  <div className="font-bold text-lg uppercase tracking-tight">{ex.name}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
