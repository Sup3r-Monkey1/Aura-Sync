import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Trash2, Power, RotateCcw, Edit3, Target } from 'lucide-react';
import { useWorkoutStore, triggerAlert } from '../store/useWorkoutStore';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, removeExercise, addSet, removeSet, updateSet, completeSet, setDuration, restDuration, setDurations, activeCardId, activeSetIndex, setTracking, scheduleNotes } = useWorkoutStore();
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

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

  if (!session) return (
    <div className="h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <RotateCcw className="w-12 h-12 text-white/5 mx-auto animate-spin-slow mb-4" />
        <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black">Link_Authorizing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      <div className={`sticky top-0 z-[100] p-6 border-b border-white/5 transition-all duration-1000 backdrop-blur-3xl ${
        timerState === 'SET' ? 'bg-cobalt/30 shadow-[0_0_50px_rgba(0,209,255,0.1)]' : timerState === 'REST' ? 'bg-magenta/30 shadow-[0_0_50px_rgba(189,0,255,0.1)]' : 'bg-black/95'
      }`}>
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 tracking-widest"><Clock size={14}/> {timerState}_Protocol</div>
           <button onClick={endSession} className="px-4 py-1.5 bg-red-500 text-black text-[10px] font-black uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all">End Session</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <button onClick={() => setIsPaused(!isPaused)} className="mt-4 px-12 py-3 bg-white/10 text-[10px] font-black uppercase tracking-[0.3em] border border-white/10">{isPaused ? 'Resume' : 'Pause'}</button>
        </div>
      </div>

      <div className="p-4 space-y-8 mt-6">
        {missionNote && (
          <div className="glass p-5 border-l-2 border-magenta">
             <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-magenta uppercase"><Edit3 size={14}/> Target_Objectives</div>
             <p className="text-xs text-white/70 font-mono leading-relaxed bg-black/20 p-3">{missionNote}</p>
          </div>
        )}

        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-4">
              <div><h3 className="text-lg font-black italic uppercase text-white">{card.exercise.name}</h3><p className="text-[9px] text-white/30 uppercase tracking-widest">{card.exercise.equipment}</p></div>
              <button onClick={() => removeExercise(card.id)} className="text-white/20 p-2"><X size={16}/></button>
            </div>
            <div className="space-y-2">
              {card.sets.map((set, idx) => {
                const isActive = activeCardId === card.id && activeSetIndex === idx;
                return (
                  <div key={set.id} className={`glass p-4 border-l-2 flex items-center justify-between transition-all ${
                    set.completed ? 'border-terminal opacity-30' : isActive ? 'border-cobalt glow-cobalt bg-cobalt/5' : 'border-white/10'
                  }`}>
                    <div className="flex gap-4">
                       <span className={`text-[10px] font-mono ${isActive ? 'text-cobalt' : 'text-white/20'}`}>0{idx+1}</span>
                       <div className="flex gap-4">
                          <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-14 bg-transparent text-xl font-black outline-none" />
                          <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-12 bg-transparent text-xl font-black outline-none" />
                       </div>
                    </div>
                    {!set.completed ? (
                      <button onClick={() => isActive && timerState === 'SET' ? setTimeLeft(0) : setTracking(card.id, idx)} className={`px-6 py-2.5 text-[10px] font-black uppercase ${isActive && timerState === 'SET' ? 'bg-terminal text-black' : 'bg-cobalt text-white'}`}>
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
