import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Flame, Zap, TrendingUp, Timer } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getZoneColor, getZoneLabel } from '../engine/readiness';
import { getHeatColor, muscleName, getTopFatigued, getOverallFatigue } from '../engine/heatmap';
import { calculateOverload } from '../engine/overload';
import { workoutRegistry } from '../data/workoutRegistry';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const {
    readiness, muscleHeat, history, totalWorkouts,
    evolutionXP, nutrition, refreshReadiness, decayHeatmap, startSession, session,
  } = useWorkoutStore();

  // Refresh readiness and decay heatmap on mount
  useEffect(() => {
    refreshReadiness();
    decayHeatmap();
  }, [refreshReadiness, decayHeatmap]);

  const zoneColor = getZoneColor(readiness.zone);
  const topFatigued = getTopFatigued(muscleHeat, 6);
  const overallFatigue = getOverallFatigue(muscleHeat);

  // Today's nutrition
  const today = new Date().setHours(0, 0, 0, 0);
  const todayNutrition = nutrition.filter(n => n.timestamp >= today);
  const totalCals = todayNutrition.reduce((s, n) => s + n.calories, 0);
  const totalProtein = todayNutrition.reduce((s, n) => s + n.protein, 0);

  // Weekly volume
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyVol = history.filter(h => h.date > weekAgo).reduce((s, h) => s + h.totalVolume, 0);

  // Overload suggestions for recently trained exercises
  const recentExerciseIds = [...new Set(history.slice(-10).map(h => h.exerciseId))].slice(0, 3);
  const suggestions = recentExerciseIds.map(id => {
    const ex = workoutRegistry.find(e => e.id === id);
    return { suggestion: calculateOverload(id, history), exercise: ex };
  }).filter(s => s.exercise && s.suggestion.lastBest);

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Zap className="w-5 h-5" style={{ color: zoneColor }} />
          <h1 className="text-lg font-bold tracking-wide">AURA SYNC</h1>
        </div>
        <p className="text-[11px] text-white/40 uppercase tracking-[0.15em]">
          Elite Fitness Ecosystem
        </p>
      </div>

      {/* Neural Readiness Gauge */}
      <div className="px-4 mb-4">
        <motion.div
          className="glass p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ boxShadow: `0 0 30px ${zoneColor}20` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4" style={{ color: zoneColor }} />
            <span className="text-xs uppercase tracking-widest text-white/50">Neural Latency</span>
          </div>

          {/* Score circle */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff08" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={zoneColor}
                  strokeWidth="6"
                  strokeLinecap="butt"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - readiness.score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color: zoneColor }}>
                  {readiness.score}
                </span>
                <span className="text-[9px] text-white/30">%</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: zoneColor }}>
                {readiness.zone}
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                {getZoneLabel(readiness.zone)}
              </p>
              <div className="flex gap-4 text-[10px] text-white/30">
                <span>HRV: {readiness.hrv}ms</span>
                <span>Sleep: {readiness.sleepHours}h</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        {[
          { icon: Activity, label: 'Sessions', value: totalWorkouts, color: '#3b82f6' },
          { icon: Flame, label: 'Weekly Vol', value: `${(weeklyVol / 1000).toFixed(1)}k`, color: '#f97316' },
          { icon: TrendingUp, label: 'Calories', value: totalCals, color: '#00ff88' },
          { icon: Zap, label: 'Protein', value: `${totalProtein}g`, color: '#e535ab' },
        ].map(stat => (
          <div key={stat.label} className="glass p-3 text-center">
            <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
            <div className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[9px] text-white/30 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Muscle Heatmap */}
      <div className="px-4 mb-4">
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs uppercase tracking-widest text-white/50">Muscle Fatigue</span>
            </div>
            <span className="text-[10px] text-white/30">Overall: {overallFatigue}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {topFatigued.map(mh => (
              <div key={mh.group} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/50">{muscleName(mh.group)}</span>
                    <span style={{ color: getHeatColor(mh.heat) }}>
                      {Math.round(mh.heat)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: getHeatColor(mh.heat) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${mh.heat}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overload Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 mb-4">
          <div className="glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cobalt" />
              <span className="text-xs uppercase tracking-widest text-white/50">Overload Intel</span>
            </div>
            <div className="space-y-2">
              {suggestions.map(({ suggestion: s, exercise: ex }) => (
                <div key={s.exerciseId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-xs text-white/70">{ex!.name}</div>
                    <div className="text-[10px] text-white/30">
                      Last: {s.lastBest!.weight}×{s.lastBest!.reps}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: s.delta > 0 ? '#e535ab' : s.delta < 0 ? '#f97316' : '#3b82f6' }}>
                      {s.suggestedWeight} lbs × {s.suggestedReps}
                    </div>
                    <div className="text-[10px]" style={{ color: s.delta > 0 ? '#e535ab' : '#ffffff40' }}>
                      {s.delta > 0 ? `+${s.delta}%` : s.delta < 0 ? `${s.delta}%` : 'maintain'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Start Session Button */}
      {!session && (
        <div className="px-4 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => startSession()}
            className="w-full py-4 bg-cobalt text-white font-bold text-sm uppercase tracking-widest glow-cobalt"
          >
            <div className="flex items-center justify-center gap-2">
              <Timer className="w-5 h-5" />
              Start Session
            </div>
          </motion.button>
        </div>
      )}

      {/* Evolution XP */}
      <div className="px-4 mb-4">
        <div className="glass p-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-white/40 uppercase tracking-widest">Evolution XP</span>
            <span className="text-cobalt-bright font-bold">{evolutionXP} XP</span>
          </div>
          <div className="h-1.5 bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cobalt to-magenta"
              animate={{ width: `${(evolutionXP % 1000) / 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Black Box Terminal — pinned at bottom of dashboard */}
      <div className="px-4">
        <BlackBoxTerminal />
      </div>
{/* SYSTEM RESET (DANGER ZONE) */}
      <div className="px-4 mt-12 pb-12">
        <div className="border border-red-900/20 bg-red-900/5 p-4">
          <h4 className="text-[10px] font-black tracking-widest text-red-500/50 uppercase mb-3">
            System Maintenance
          </h4>
          <button
            onClick={() => {
              if (window.confirm("⚠️ WARNING: This will permanently wipe your Aura XP, History, and Stats. Proceed?")) {
                useWorkoutStore.getState().hardReset();
              }
            }}
            className="text-[9px] font-bold text-red-500/40 hover:text-red-500 uppercase tracking-tighter transition-colors"
          >
            Execute Hard Reset / Wipe Local Storage
          </button>
        </div>
      </div>
    </div>
  );
}
