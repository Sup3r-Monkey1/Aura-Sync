import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Pause, X, Check, Clock, Trash2 } from 'lucide-react';
import { useWorkoutStore, triggerAlert } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, removeSet, updateSet, completeSet, setDuration, restDuration, setDurations, activeCardId, activeSetIndex, setTracking } = useWorkoutStore();
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showTimerAdjust, setShowTimerAdjust] = useState(false);

  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const currentSet = currentCard?.sets[activeSetIndex];
        if (currentCard && currentSet) { completeSet(activeCardId!, currentSet.id); hapticSetComplete(); }
        setTimerState('REST'); setTimeLeft(restDuration);
        triggerAlert('success'); // 🔊 AUDIO ALERT
      } else if (timerState === 'REST') {
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const nextIndex = activeSetIndex + 1;
        if (currentCard && nextIndex < currentCard.sets.length) {
          setTracking(activeCardId!, nextIndex); setTimerState('SET'); setTimeLeft(setDuration); hapticRestDone();
          triggerAlert('warning'); // 🔊 AUDIO ALERT
        } else {
          setTimerState('IDLE'); setIsPaused(true); setTracking(null, 0); hapticRestDone();
          triggerAlert('success');
        }
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState, session, activeCardId, activeSetIndex]);

  const startChain = (cardId: string, index: number) => {
    setTracking(cardId, index); setTimerState('SET'); setTimeLeft(setDuration); setIsPaused(false); hapticTap();
  };

  if (!session) return <div className="h-screen flex items-center justify-center bg-[#050505] text-white/10 font-black italic uppercase tracking-[0.5em]">Awaiting_link</div>;

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      <div className={`sticky top-0 z-50 p-6 border-b border-white/5 transition-colors duration-700 ${
        timerState === 'SET' ? 'bg-cobalt/20' : timerState === 'REST' ? 'bg-magenta/20' : 'bg-black'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setShowTimerAdjust(true)} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40"><Clock size={14} className="text-cobalt" /> Adjust</button>
          <button onClick={endSession} className="text-[10px] font-black text-hazard border border-hazard/30 px-3 py-1 uppercase">Terminate</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">{timerState === 'IDLE' ? 'Link Ready' : timerState}</div>
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <div className="mt-6 flex gap-4"><button onClick={() => setIsPaused(!isPaused)} className="px-8 py-2 glass text-[10px] font-black uppercase tracking-widest text-white/60">{isPaused ? 'Resume' : 'Pause'}</button></div>
        </div>
      </div>

      <div className="p-4 space-y-12">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-4">
              <div><h3 className="text-lg font-black italic uppercase text-white/90">{card.exercise.name}</h3><p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">{card.exercise.equipment}</p></div>
              <button onClick={() => removeExercise(card.id)} className="text-white/10 p-2"><X size={16}/></button>
            </div>
            <div className="space-y-2">
              {card.sets.map((set, idx) => {
                const isActive = activeCardId === card.id && activeSetIndex === idx;
                return (
                  <div key={set.id} className={`glass p-3 border-l-2 flex items-center justify-between transition-all ${
                    set.completed ? 'border-terminal opacity-30' : isActive ? 'border-cobalt glow-cobalt bg-cobalt/5' : 'border-white/10'
                  }`}>
                    <div className="flex gap-4 items-center">
                      <span className={`text-[10px] font-mono ${isActive ? 'text-cobalt' : 'text-white/20'}`}>0{idx+1}</span>
                      <div className="flex gap-3">
                        <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-12 bg-transparent text-lg font-black text-white outline-none" />
                        <span className="text-white/10">×</span>
                        <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-10 bg-transparent text-lg font-black text-white outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!set.completed ? (
                        <>
                          <button onClick={() => startChain(card.id, idx)} className="px-4 py-2 bg-cobalt text-black text-[10px] font-black uppercase tracking-widest">{isActive && timerState === 'SET' ? 'Lifting' : 'Start'}</button>
                          <button onClick={() => removeSet(card.id, set.id)} className="p-2 text-white/10"><Trash2 size={14}/></button>
                        </>
                      ) : <Check size={20} className="text-terminal" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-2 border border-dashed border-white/5 text-[9px] text-white/20 uppercase tracking-widest">+ Append Set</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-14 w-14 bg-cobalt text-black flex items-center justify-center glow-cobalt z-40 shadow-2xl"><Plus /></button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/98 p-6 overflow-y-auto">
             <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black italic uppercase text-white">Protocols</h2><button onClick={() => setShowAdd(false)} className="p-3 bg-white/5 text-white"><X/></button></div>
             <div className="grid gap-2">
                {workoutRegistry.map(ex => (
                  <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-5 text-left border-white/5 hover:border-cobalt/40 transition-colors">
                    <div className="text-[9px] text-cobalt font-mono uppercase mb-1">{ex.category}</div>
                    <div className="font-bold text-lg uppercase tracking-tight text-white/80">{ex.name}</div>
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
