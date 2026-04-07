import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Pause, X, Check, Clock, Trash2, Power } from 'lucide-react';
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
        triggerAlert('success');
      } else if (timerState === 'REST') {
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const nextIndex = activeSetIndex + 1;
        if (currentCard && nextIndex < currentCard.sets.length) {
          setTracking(activeCardId!, nextIndex); setTimerState('SET'); setTimeLeft(setDuration); hapticRestDone();
          triggerAlert('warning');
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

  if (!session) return <div className="h-screen flex items-center justify-center bg-[#050505] text-white/10 font-black italic tracking-widest animate-pulse uppercase">Awaiting_Sync_Link</div>;

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* 🛡️ IMMUTABLE TIMER HUD (Z-100) */}
      <div className={`sticky top-0 z-[100] p-6 border-b border-white/5 transition-colors duration-700 backdrop-blur-xl ${
        timerState === 'SET' ? 'bg-cobalt/40' : timerState === 'REST' ? 'bg-magenta/40' : 'bg-black/90'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setShowTimerAdjust(true)} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60"><Clock size={14} className="text-cobalt" /> Config</button>
          <button onClick={endSession} className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-black text-[10px] font-black uppercase tracking-tighter italic shadow-[0_0_15px_rgba(239,68,68,0.4)]"><Power size={12}/> End Session</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[9px] font-black tracking-[0.5em] uppercase text-white/40 mb-1">{timerState === 'IDLE' ? 'Link Standby' : timerState}</div>
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <div className="mt-4 flex gap-4"><button onClick={() => setIsPaused(!isPaused)} className="px-10 py-2.5 bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">{isPaused ? 'Resume' : 'Pause'}</button></div>
        </div>
      </div>

      <div className="p-4 space-y-12 mt-6">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-4">
              <div><h3 className="text-lg font-black italic uppercase text-white/90">{card.exercise.name}</h3><p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono">{card.exercise.equipment}</p></div>
              <button onClick={() => removeExercise(card.id)} className="text-white/10 p-2"><X size={16}/></button>
            </div>
            <div className="space-y-2">
              {card.sets.map((set, idx) => {
                const isActive = activeCardId === card.id && activeSetIndex === idx;
                return (
                  <div key={set.id} className={`glass p-4 border-l-2 flex items-center justify-between transition-all ${
                    set.completed ? 'border-terminal opacity-30' : isActive ? 'border-cobalt glow-cobalt bg-cobalt/5' : 'border-white/10'
                  }`}>
                    <div className="flex gap-5 items-center">
                      <span className={`text-[10px] font-mono ${isActive ? 'text-cobalt' : 'text-white/20'}`}>0{idx+1}</span>
                      <div className="flex gap-4">
                        <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-14 bg-transparent text-xl font-black text-white outline-none" />
                        <span className="text-white/10 self-center">×</span>
                        <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-12 bg-transparent text-xl font-black text-white outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!set.completed ? (
                        <>
                          <button onClick={() => isActive && timerState === 'SET' ? setTimeLeft(0) : startChain(card.id, idx)} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest ${isActive && timerState === 'SET' ? 'bg-terminal text-black animate-pulse' : 'bg-cobalt text-white'}`}>{isActive && timerState === 'SET' ? 'Lifting' : 'Start'}</button>
                          <button onClick={() => removeSet(card.id, set.id)} className="p-2 text-white/10"><Trash2 size={16}/></button>
                        </>
                      ) : <Check size={24} className="text-terminal" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-3 border border-dashed border-white/10 text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">+ New Data Entry</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-16 w-16 bg-cobalt text-black flex items-center justify-center glow-cobalt z-[110] shadow-2xl"><Plus size={28}/></button>
    </div>
  );
}
