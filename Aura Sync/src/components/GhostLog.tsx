import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Square, Clock, Flame, Dumbbell, X } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import VolumeCard from './workout/VolumeCard';
import WorkoutSelection from './workout/WorkoutSelection';
import { hapticRestDone } from '../services/haptics';
import type { Exercise } from '../types';

export default function GhostLog() {
  const {
    session, isResting, restSeconds,
    startSession, endSession, addExercise,
    stopRest,
  } = useWorkoutStore();

  const [showPicker, setShowPicker] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Session timer
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Rest timer with vibration
  useEffect(() => {
    if (!isResting) return;
    setRestRemaining(restSeconds);
    const interval = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          stopRest();
          // Trigger vibration when rest is done
          hapticRestDone();
          if ('vibrate' in navigator) {
            navigator.vibrate([60, 40, 60, 40, 150]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restSeconds, stopRest]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }, []);

  const handleSelect = (exercise: Exercise) => {
    addExercise(exercise);
    setShowPicker(false);
  };

  // Session stats
  const totalVolume = session?.cards.reduce((sum, c) =>
    sum + c.sets.filter(s => s.completed).reduce((ss, s) => ss + s.weight * s.reps, 0), 0
  ) ?? 0;
  const totalSets = session?.cards.reduce((sum, c) =>
    sum + c.sets.filter(s => s.completed).length, 0
  ) ?? 0;
  const volumeGoal = 20000;
  const volumePercent = Math.min(100, (totalVolume / volumeGoal) * 100);

  // No active session
  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 pb-24">
        <Dumbbell className="w-12 h-12 text-cobalt/30 mb-4" />
        <h2 className="text-lg font-bold text-white/60 mb-2">Ghost Log</h2>
        <p className="text-xs text-white/25 text-center mb-8 max-w-[260px]">
          Your minimalist, high-speed workout tracker. No fluff, just data.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => startSession()}
          className="w-full max-w-[280px] py-5 bg-cobalt text-white font-bold text-sm uppercase tracking-widest glow-cobalt"
        >
          Start Session
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Volume progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-white/5">
        <motion.div
          className="h-full bg-cobalt"
          animate={{ width: `${volumePercent}%` }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: '0 0 12px rgba(37, 99, 235, 0.5)' }}
        />
      </div>

      {/* Session header */}
      <div className="px-4 pt-14 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Ghost Log</h2>
            <span className="text-[10px] text-white/25">Active Session</span>
          </div>
          <button
            onClick={endSession}
            className="flex items-center gap-1.5 px-4 min-h-[44px] bg-red-500/10 text-red-400 text-xs"
          >
            <Square className="w-3.5 h-3.5" /> End
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex gap-2">
          <div className="glass flex-1 p-2.5 text-center">
            <Clock className="w-3.5 h-3.5 mx-auto mb-0.5 text-cobalt/60" />
            <div className="text-sm font-bold text-cobalt">{formatTime(elapsed)}</div>
            <div className="text-[8px] text-white/20 uppercase">Time</div>
          </div>
          <div className="glass flex-1 p-2.5 text-center">
            <Flame className="w-3.5 h-3.5 mx-auto mb-0.5 text-orange-500/60" />
            <div className="text-sm font-bold text-orange-400">{totalVolume.toLocaleString()}</div>
            <div className="text-[8px] text-white/20 uppercase">Volume</div>
          </div>
          <div className="glass flex-1 p-2.5 text-center">
            <Dumbbell className="w-3.5 h-3.5 mx-auto mb-0.5 text-white/30" />
            <div className="text-sm font-bold text-white/60">{totalSets}</div>
            <div className="text-[8px] text-white/20 uppercase">Sets</div>
          </div>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {session.cards.map(card => (
            <VolumeCard key={card.id} card={card} />
          ))}
        </AnimatePresence>

        {/* Add exercise button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowPicker(true)}
          className="w-full min-h-[56px] glass flex items-center justify-center gap-2 text-sm text-cobalt/60 active:bg-white/5"
        >
          <Plus className="w-5 h-5" /> Add Exercise
        </motion.button>
      </div>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 flex flex-col items-center justify-center"
          >
            {/* Pulsing ring */}
            <div className="relative w-52 h-52 mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff06" strokeWidth="4" />
                <motion.circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="butt"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 90 * (restRemaining / restSeconds),
                    filter: ['drop-shadow(0 0 8px #2563eb)', 'drop-shadow(0 0 20px #2563eb)', 'drop-shadow(0 0 8px #2563eb)'],
                  }}
                  transition={{
                    strokeDashoffset: { duration: 1, ease: 'linear' },
                    filter: { duration: 2, repeat: Infinity },
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-cobalt text-glow-cobalt">
                  {formatTime(restRemaining)}
                </div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Rest</div>
              </div>
            </div>

            <button
              onClick={stopRest}
              className="px-8 min-h-[48px] bg-white/5 text-white/40 text-xs uppercase tracking-widest active:bg-white/10"
            >
              <X className="w-4 h-4 inline mr-1.5" /> Skip
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <WorkoutSelection
            onSelect={handleSelect}
            onClose={() => setShowPicker(false)}
            addedIds={session.cards.map(c => c.exercise.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
