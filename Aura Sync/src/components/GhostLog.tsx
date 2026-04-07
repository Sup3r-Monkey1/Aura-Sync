import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Pause, X, Check, Award } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, updateSet, completeSet, setDuration, restDuration, setDurations, activeSetIndex, setActiveSet } = useWorkoutStore();
  
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // ⛓️ MASTER AUTO-CHAIN EFFECT
  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        // SET FINISHED -> AUTO REST
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const currentSet = currentCard?.sets[activeSetIndex];
        
        if (currentCard && currentSet) {
          completeSet(activeCardId!, currentSet.id);
          hapticSetComplete();
        }

        setTimerState('REST');
        setTimeLeft(restDuration);
      } else if (timerState === 'REST') {
        // REST FINISHED -> CHECK FOR NEXT SET
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const nextIndex = activeSetIndex + 1;

        if (currentCard && nextIndex < currentCard.sets.length) {
          // AUTO-CHAIN TO NEXT SET
          setActiveSet(nextIndex);
          setTimerState('SET');
          setTimeLeft(setDuration);
          hapticRestDone();
        } else {
          // END OF EXERCISE
          setTimerState('IDLE');
          setIsPaused(true);
          setActiveSet(0);
          hapticRestDone();
        }
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState]);

  const startChain = (cardId: string, index: number) => {
    setActiveCardId(cardId);
    setActiveSet(index);
    setTimerState('SET');
    setTimeLeft(setDuration);
    setIsPaused(false);
    hapticTap();
  };

  if (!session) return <div className="h-screen flex items-center justify-center p-8 bg-[#050505] font-black text-white/20 uppercase tracking-widest italic">Awaiting Link</div>;

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* HUD TIMER */}
      <div className={`sticky top-0 z-50 p-6 border-b border-white/5 transition-colors duration-700 ${
        timerState === 'SET' ? 'bg-cobalt/20' : timerState === 'REST' ? 'bg-magenta/20' : 'bg-black'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <TimerInput label="Set" value={setDuration} onChange={(v) => setDurations(v, restDuration)} color="cobalt" />
            <TimerInput label="Rest" value={restDuration} onChange={(v) => setDurations(setDuration, v)} color="magenta" />
          </div>
          <button onClick={endSession} className="text-[10px] font-black text-hazard border border-hazard/30 px-3 py-1">TERMINATE</button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">{timerState === 'IDLE' ? 'Ready' : timerState}</div>
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <div className="mt-6 flex gap-4">
             <button onClick={() => setIsPaused(!isPaused)} className="px-8 py-2 glass text-[10px] font-black uppercase tracking-widest">
               {isPaused ? 'Resume' : 'Pause'}
             </button>
          </div>
        </div>
      </div>

      {/* LOG ENTRIES */}
      <div className="p-4 space-y-10">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-4">
              <div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter">{card.exercise.name}</h3>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{card.exercise.equipment}</p>
              </div>
              <button onClick={() => removeExercise(card.id)} className="text-white/10"><X size={16}/></button>
            </div>

            <div className="space-y-2">
              {card.sets.map((set, idx) => (
                <div key={set.id} className={`glass p-3 border-l-2 flex items-center justify-between transition-all ${
                  set.completed ? 'border-terminal opacity-30' : 
                  (activeCardId === card.id && activeSetIndex === idx) ? 'border-cobalt glow-cobalt' : 'border-white/10'
                }`}>
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-mono text-white/20">0{idx+1}</span>
                    <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-12 bg-transparent text-lg font-black outline-none" />
                    <span className="text-white/10">×</span>
                    <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-10 bg-transparent text-lg font-black outline-none" />
                  </div>

                  {!set.completed && (
                    <button 
                      onClick={() => startChain(card.id, idx)}
                      className="px-4 py-2 bg-cobalt text-black text-[10px] font-black uppercase tracking-widest"
                    >
                      {activeCardId === card.id && activeSetIndex === idx && timerState === 'SET' ? 'Lifting...' : 'Start'}
                    </button>
                  )}
                  {set.completed && <Check size={20} className="text-terminal" />}
                </div>
              ))}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-2 border border-dashed border-white/10 text-[9px] text-white/20 uppercase tracking-[0.3em]">+ New Set</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-14 w-14 bg-cobalt text-black flex items-center justify-center glow-cobalt z-40"><Plus /></button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/98 p-6 overflow-y-auto">
             <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black italic uppercase">Sync Protocols</h2><button onClick={() => setShowAdd(false)}><X/></button></div>
             <div className="grid gap-2">
                {workoutRegistry.map(ex => (
                  <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-5 text-left border-white/5">
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

function TimerInput({ label, value, onChange, color }: any) {
  return (
    <div>
      <span className={`text-[8px] uppercase font-black block mb-1 text-${color}`}>{label} (S)</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={`w-12 bg-transparent text-sm font-black border-b border-${color}/30 outline-none`} />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Square, Pause, X, Check, Award } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { workoutRegistry } from '../data/workoutRegistry';
import { hapticSetComplete, hapticTap, hapticRestDone } from '../services/haptics';

export default function GhostLog() {
  const { session, endSession, addExercise, removeExercise, addSet, updateSet, completeSet, setDuration, restDuration, setDurations, activeSetIndex, setActiveSet } = useWorkoutStore();
  
  const [timerState, setTimerState] = useState<'IDLE' | 'SET' | 'REST'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // ⛓️ MASTER AUTO-CHAIN EFFECT
  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isPaused) {
      if (timerState === 'SET') {
        // SET FINISHED -> AUTO REST
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const currentSet = currentCard?.sets[activeSetIndex];
        
        if (currentCard && currentSet) {
          completeSet(activeCardId!, currentSet.id);
          hapticSetComplete();
        }

        setTimerState('REST');
        setTimeLeft(restDuration);
      } else if (timerState === 'REST') {
        // REST FINISHED -> CHECK FOR NEXT SET
        const currentCard = session?.cards.find(c => c.id === activeCardId);
        const nextIndex = activeSetIndex + 1;

        if (currentCard && nextIndex < currentCard.sets.length) {
          // AUTO-CHAIN TO NEXT SET
          setActiveSet(nextIndex);
          setTimerState('SET');
          setTimeLeft(setDuration);
          hapticRestDone();
        } else {
          // END OF EXERCISE
          setTimerState('IDLE');
          setIsPaused(true);
          setActiveSet(0);
          hapticRestDone();
        }
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, timerState]);

  const startChain = (cardId: string, index: number) => {
    setActiveCardId(cardId);
    setActiveSet(index);
    setTimerState('SET');
    setTimeLeft(setDuration);
    setIsPaused(false);
    hapticTap();
  };

  if (!session) return <div className="h-screen flex items-center justify-center p-8 bg-[#050505] font-black text-white/20 uppercase tracking-widest italic">Awaiting Link</div>;

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* HUD TIMER */}
      <div className={`sticky top-0 z-50 p-6 border-b border-white/5 transition-colors duration-700 ${
        timerState === 'SET' ? 'bg-cobalt/20' : timerState === 'REST' ? 'bg-magenta/20' : 'bg-black'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <TimerInput label="Set" value={setDuration} onChange={(v) => setDurations(v, restDuration)} color="cobalt" />
            <TimerInput label="Rest" value={restDuration} onChange={(v) => setDurations(setDuration, v)} color="magenta" />
          </div>
          <button onClick={endSession} className="text-[10px] font-black text-hazard border border-hazard/30 px-3 py-1">TERMINATE</button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">{timerState === 'IDLE' ? 'Ready' : timerState}</div>
          <div className="text-8xl font-black italic tracking-tighter text-glow-cobalt">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
          <div className="mt-6 flex gap-4">
             <button onClick={() => setIsPaused(!isPaused)} className="px-8 py-2 glass text-[10px] font-black uppercase tracking-widest">
               {isPaused ? 'Resume' : 'Pause'}
             </button>
          </div>
        </div>
      </div>

      {/* LOG ENTRIES */}
      <div className="p-4 space-y-10">
        {session.cards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="flex justify-between items-end border-l-2 border-cobalt pl-4">
              <div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter">{card.exercise.name}</h3>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{card.exercise.equipment}</p>
              </div>
              <button onClick={() => removeExercise(card.id)} className="text-white/10"><X size={16}/></button>
            </div>

            <div className="space-y-2">
              {card.sets.map((set, idx) => (
                <div key={set.id} className={`glass p-3 border-l-2 flex items-center justify-between transition-all ${
                  set.completed ? 'border-terminal opacity-30' : 
                  (activeCardId === card.id && activeSetIndex === idx) ? 'border-cobalt glow-cobalt' : 'border-white/10'
                }`}>
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-mono text-white/20">0{idx+1}</span>
                    <input type="number" value={set.weight} onChange={(e) => updateSet(card.id, set.id, 'weight', parseFloat(e.target.value))} className="w-12 bg-transparent text-lg font-black outline-none" />
                    <span className="text-white/10">×</span>
                    <input type="number" value={set.reps} onChange={(e) => updateSet(card.id, set.id, 'reps', parseInt(e.target.value))} className="w-10 bg-transparent text-lg font-black outline-none" />
                  </div>

                  {!set.completed && (
                    <button 
                      onClick={() => startChain(card.id, idx)}
                      className="px-4 py-2 bg-cobalt text-black text-[10px] font-black uppercase tracking-widest"
                    >
                      {activeCardId === card.id && activeSetIndex === idx && timerState === 'SET' ? 'Lifting...' : 'Start'}
                    </button>
                  )}
                  {set.completed && <Check size={20} className="text-terminal" />}
                </div>
              ))}
            </div>
            <button onClick={() => addSet(card.id)} className="w-full py-2 border border-dashed border-white/10 text-[9px] text-white/20 uppercase tracking-[0.3em]">+ New Set</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 h-14 w-14 bg-cobalt text-black flex items-center justify-center glow-cobalt z-40"><Plus /></button>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/98 p-6 overflow-y-auto">
             <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black italic uppercase">Sync Protocols</h2><button onClick={() => setShowAdd(false)}><X/></button></div>
             <div className="grid gap-2">
                {workoutRegistry.map(ex => (
                  <button key={ex.id} onClick={() => { addExercise(ex); setShowAdd(false); hapticTap(); }} className="glass p-5 text-left border-white/5">
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

function TimerInput({ label, value, onChange, color }: any) {
  return (
    <div>
      <span className={`text-[8px] uppercase font-black block mb-1 text-${color}`}>{label} (S)</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={`w-12 bg-transparent text-sm font-black border-b border-${color}/30 outline-none`} />
    </div>
  );
}
