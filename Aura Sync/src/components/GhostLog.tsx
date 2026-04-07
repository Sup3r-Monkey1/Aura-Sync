import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Clock, Trash2, Power, RotateCcw, Edit3 } from 'lucide-react';
import { useWorkoutStore, triggerAlert } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, removeSet, updateSet, completeSet, setDuration, restDuration, setDurations, activeCardId, activeSetIndex, setTracking, scheduleNotes } = useWorkoutStore();
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const missionNote = scheduleNotes[today];

  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        const cCard = session?.cards.find(c => c.id === activeCardId);
        if (cCard && cCard.sets[activeSetIndex]) { completeSet(activeCardId!, cCard.sets[activeSetIndex].id); hapticSetComplete(); }
        setTimerState('REST'); setTimeLeft(restDuration); triggerAlert('success');
      } else if (timerState === 'REST') {
        const cCard = session?.cards.find(c => c.id === activeCardId);
        if (cCard && activeSetIndex + 1 < cCard.sets.length) {
          setTracking(activeCardId!, activeSetIndex + 1); setTimerState('SET'); setTimeLeft(setDuration); hapticRestDone(); triggerAlert('warning');
        } else {
          setTimerState('IDLE'); setIsPaused(true); setTracking(null, 0); hapticRestDone(); triggerAlert('success');
        }
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState, session, activeCardId, activeSetIndex, completeSet, restDuration, setDuration, setTracking]);

  const startChain = (cid: string, idx: number) => { setTracking(cid, idx); setTimerState('SET'); setTimeLeft(setDuration); setIsPaused(false); hapticTap(); };

  if (!session) return (
    <div className="h-screen flex items-center justify-center bg-[#050505] p-12 text-center">
      <div className="space-y-6">
        <RotateCcw className="w-12 h-12 text-white/5 mx-auto animate-spin-slow" />
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">Awaiting_Link</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-32 overflow-x-hidden">
      <div className={`sticky top-0 z-[100] p-6 border-b border-white/5 transition-colors duration-700 backdrop-blur-xl ${
        timerState === 'SET' ? 'bg-cobalt/40' : timerState === 'REST' ? 'bg-magenta/40' : 'bg-black/90'
      }`}>
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40"><Clock size={14} className="text-cobalt" /> {timerState}</div>
           <button onClick={endSession} className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-black text-[10px] font-black uppercase italic shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all"><Power size={12}/> End Session</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <div className="mt-4 flex gap-4"><button onClick={() => setIsPaused(!isPaused)} className="px-12 py-3 bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 active:bg-white/20">{isPaused ? 'Resume' : 'Pause'}</button></div>
        </div>
      </div>

      <div className="p-4 space-y-8 mt-6">
        {missionNote && (
          <div className="glass p-4 border-l-2 border-magenta/40 mb-6">
            <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-magenta uppercase"><Edit3 size={12}/> Mission_Protocol</div>
            <p className="text-xs text-white/60 font-mono italic leading-relaxed">{missionNote}</p>
          </div>
        )}

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
                    set.completed ? 'border-terminal opacity-30' : isActive ? 'border-cobalt glow-cobalt bg-cobalt/5 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'border-white/10'
                  }`}>
                    <div className="flex gap-5 items-center">
                      <span className={`text-[10px] font-mono ${isActive ? 'text-cobalt' : 'text-white/20'}`}>0{idx+1}</span>
                      <div className="flex gap-4">
                        <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-14 bg-transparent text-xl font-black text-white outline-none" />
                        <span className="text-white/10 self-center font-bold">×</span>
                        <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-12 bg-transparent text-xl font-black text-white outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!set.completed ? (
                        <>
                          <button onClick={() => isActive && timerState === 'SET' ? setTimeLeft(0) : startChain(card.id, idx)} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest ${isActive && timerState === 'SET' ? 'bg-terminal text-black animate-pulse' : 'bg-cobalt text-white shadow-lg shadow-cobalt/20'}`}>{isActive && timerState === 'SET' ? 'Log' : 'Start'}</button>
                          <button onClick={() => removeSet(card.id, set.id)} className="p-2 text-white/10 hover:text-red-500"><Trash2 size={16}/></button>
                        </>
                      ) : <Check size={28} className="text-terminal drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-3 border border-dashed border-white/10 text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">+ New Set Entry</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-16 w-16 bg-cobalt text-black flex items-center justify-center glow-cobalt z-[110] shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all"><Plus size={32}/></button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/98 p-6 overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-center mb-10 font-black italic uppercase text-white"><h2>Sync Protocols</h2><button onClick={() => setShowAdd(false)} className="p-3 bg-white/5 text-white active:bg-white/10"><X size={24}/></button></div>
             <div className="grid gap-2">
                {workoutRegistry.map(ex => (
                  <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-5 text-left border-white/5 hover:border-cobalt transition-colors">
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
