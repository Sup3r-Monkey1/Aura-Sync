import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Pause, RotateCcw, X, Check, Award } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, updateSet, completeSet, setDuration, restDuration, setDurations, addTerminalEvent } = useWorkoutStore();
  
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [activeExerciseCardId, setActiveExerciseCardId] = useState<string | null>(null);

  // ⛓️ AUTO-CHAIN TIMER EFFECT
  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        // Switch to Rest automatically
        setTimerState('REST');
        setTimeLeft(restDuration);
        hapticSetComplete();
        addTerminalEvent("LIFTING WINDOW CLOSED — STARTING REST", "info");
      } else if (timerState === 'REST') {
        // Protocol Complete
        setTimerState('IDLE');
        setIsPaused(true);
        hapticRestDone();
        addTerminalEvent("REST EXPIRED — PREPARE NEXT SET", "success");
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState, restDuration]);

  const triggerSet = (cardId: string) => {
    setActiveExerciseCardId(cardId);
    setTimerState('SET');
    setTimeLeft(setDuration);
    setIsPaused(false);
    hapticTap();
  };

  const stopEarly = (cardId: string, setId: string) => {
    completeSet(cardId, setId);
    setTimerState('REST');
    setTimeLeft(restDuration);
    setIsPaused(false);
    hapticSetComplete();
  };

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
        <RotateCcw size={48} className="text-white/10 mb-4 animate-spin-slow" />
        <h2 className="text-lg font-bold text-white/40 uppercase tracking-widest italic">Awaiting Link</h2>
        <motion.button onClick={endSession} className="mt-8 px-8 py-3 bg-cobalt text-black font-black uppercase text-xs glow-cobalt">Re-sync Interface</motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* 💎 BIG HUD TIMER */}
      <div className={`sticky top-0 z-50 transition-colors duration-500 border-b border-white/5 ${
        timerState === 'SET' ? 'bg-cobalt/20' : timerState === 'REST' ? 'bg-magenta/20' : 'bg-[#0a0a0f]'
      }`}>
        <div className="p-4 flex justify-between items-center bg-black/40">
           <div className="flex gap-4">
              <div>
                <span className="text-[8px] text-cobalt font-bold block mb-1 uppercase">Set (S)</span>
                <input type="number" value={setDuration} onChange={(e) => setDurations(Number(e.target.value), restDuration)} className="w-12 bg-transparent text-sm font-black border-b border-cobalt/30 outline-none" />
              </div>
              <div>
                <span className="text-[8px] text-magenta font-bold block mb-1 uppercase">Rest (S)</span>
                <input type="number" value={restDuration} onChange={(e) => setDurations(setDuration, Number(e.target.value))} className="w-12 bg-transparent text-sm font-black border-b border-magenta/30 outline-none" />
              </div>
           </div>
           <button onClick={endSession} className="text-[9px] font-black text-hazard border border-hazard/30 px-3 py-1 uppercase italic">End Link</button>
        </div>

        <div className="py-8 px-4 flex flex-col items-center">
          <h2 className={`text-[10px] font-black tracking-[0.4em] uppercase mb-1 ${timerState === 'REST' ? 'text-magenta' : 'text-cobalt'}`}>
            {timerState === 'IDLE' ? 'Link Ready' : `${timerState}_Protocol`}
          </h2>
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          
          <div className="mt-4 flex gap-2">
            {!isPaused ? (
              <button onClick={() => setIsPaused(true)} className="px-6 py-2 glass text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Pause size={12}/> Pause</button>
            ) : timerState !== 'IDLE' && (
              <button onClick={() => setIsPaused(false)} className="px-6 py-2 bg-cobalt text-black text-[10px] font-black uppercase tracking-widest"><Play size={12}/> Resume</button>
            )}
          </div>
        </div>
      </div>

      {/* 📋 EXERCISE LOG */}
      <div className="p-4 space-y-8 mt-6">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-white/20 pl-4">
               <div>
                  <h3 className="text-lg font-black italic uppercase tracking-tight text-white/90">{card.exercise.name}</h3>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest">{card.exercise.category} Protocol</p>
               </div>
               <button onClick={() => removeExercise(card.id)} className="text-white/10"><X size={16}/></button>
            </div>

            <div className="space-y-2">
              {card.sets.map((set, idx) => (
                <div key={set.id} className={`glass p-3 border-l-2 flex items-center justify-between transition-all ${
                  set.completed ? 'border-terminal opacity-30' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/20 w-4">0{idx+1}</span>
                    <div className="flex gap-4">
                       <div className="flex flex-col">
                          <span className="text-[8px] text-white/20 uppercase font-bold">Lbs</span>
                          <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-12 bg-transparent text-lg font-black tracking-tighter outline-none" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] text-white/20 uppercase font-bold">Reps</span>
                          <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-10 bg-transparent text-lg font-black tracking-tighter outline-none" />
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!set.completed && (
                      <button 
                        onClick={() => timerState === 'SET' ? stopEarly(card.id, set.id) : triggerSet(card.id)}
                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest ${
                          timerState === 'SET' && activeExerciseCardId === card.id ? 'bg-terminal text-black' : 'bg-cobalt text-white'
                        }`}
                      >
                        {timerState === 'SET' && activeExerciseCardId === card.id ? 'Stop & Rest' : 'Start Set'}
                      </button>
                    )}
                    {set.completed && <Check size={20} className="text-terminal mx-4" />}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-2 border border-dashed border-white/5 text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">+ New Set Entry</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-14 w-14 bg-cobalt text-black flex items-center justify-center glow-cobalt z-40"><Plus /></button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/98 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black italic uppercase tracking-tighter">Sync Protocol</h2><button onClick={() => setShowAdd(false)} className="p-2 bg-white/5"><X/></button></div>
            <div className="grid gap-2">
              {workoutRegistry.map(ex => (
                <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-5 text-left border-white/5 hover:border-cobalt/40 transition-colors">
                  <div className="text-[9px] text-cobalt font-mono uppercase mb-1">{ex.category} link</div>
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
