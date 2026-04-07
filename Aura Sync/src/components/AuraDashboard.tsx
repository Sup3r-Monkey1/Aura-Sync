import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Flame, Zap, TrendingUp, Timer, Lock, Watch, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getZoneColor, getZoneLabel } from '../engine/readiness';
import { getHeatColor, muscleName, getTopFatigued, getOverallFatigue } from '../engine/heatmap';
import { calculateOverload } from '../engine/overload';
import { workoutRegistry } from '../data/workoutRegistry';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const {
    readiness, muscleHeat, history, totalWorkouts, watchConnected, connectWatch,
    evolutionXP, nutrition, refreshReadiness, decayHeatmap, startSession, session, hardReset
  } = useWorkoutStore();

  useEffect(() => {
    refreshReadiness();
    decayHeatmap();
  }, [refreshReadiness, decayHeatmap]);

  const zoneColor = getZoneColor(readiness.zone);
  const topFatigued = getTopFatigued(muscleHeat, 4);
  const overallFatigue = getOverallFatigue(muscleHeat);

  // Stats derived from REAL logged data
  const today = new Date().setHours(0, 0, 0, 0);
  const todayNutrition = nutrition.filter(n => n.timestamp >= today);
  const totalCals = todayNutrition.reduce((s, n) => s + n.calories, 0);
  const totalProtein = todayNutrition.reduce((s, n) => s + n.protein, 0);
  const weeklyVol = history.filter(h => h.date > (Date.now() - 604800000)).reduce((s, h) => s + h.totalVolume, 0);

  // Progressive Overload Suggestions (Only if you have history)
  const recentExerciseIds = [...new Set(history.slice(-5).map(h => h.exerciseId))];
  const suggestions = recentExerciseIds.map(id => ({
    suggestion: calculateOverload(id, history),
    exercise: workoutRegistry.find(e => e.id === id)
  })).filter(s => s.exercise && s.suggestion.lastBest);

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header HUD */}
      <div className="px-4 pt-12 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cobalt animate-pulse" />
            <h1 className="text-lg font-black tracking-widest text-white/90">AURA SYNC</h1>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Bio-Verification Active</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/20 uppercase font-mono">Evolution_XP</div>
          <div className="text-xl font-black text-glow-cobalt text-cobalt-bright italic">{evolutionXP}</div>
        </div>
      </div>

      {/* 🛡️ NEURAL LATENCY (Locked until Watch Connected) */}
      <div className="px-4 mb-6">
        {watchConnected ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass p-5 border-l-2" 
            style={{ borderColor: zoneColor, boxShadow: `0 0 30px ${zoneColor}15` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" style={{ color: zoneColor }} />
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Neural Readiness</span>
              </div>
              <span className="text-[9px] font-mono py-0.5 px-2 bg-white/5" style={{ color: zoneColor }}>{readiness.zone}</span>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-4xl font-black italic tracking-tighter" style={{ color: zoneColor }}>
                 {readiness.score}<span className="text-xs not-italic opacity-40">%</span>
               </div>
               <div className="flex-1 space-y-1">
                  <p className="text-[11px] text-white/60 leading-tight">{getZoneLabel(readiness.zone)}</p>
                  <div className="flex gap-4 text-[9px] font-mono text-white/20">
                    <span>HRV: {readiness.hrv}ms</span>
                    <span>SLEEP: {readiness.sleepHours}h</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass p-8 text-center border-dashed border-white/10 bg-white/[0.01]">
            <Lock className="w-6 h-6 mx-auto mb-3 text-white/10" />
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Neural Data Locked</h3>
            <button 
              onClick={connectWatch}
              className="px-8 py-3 bg-cobalt text-black text-[11px] font-black uppercase tracking-widest glow-cobalt active:scale-95 transition-all"
            >
              Link Wearable
            </button>
          </div>
        )}
      </div>

      {/* 📊 QUICK STATS (Dynamic starting at 0) */}
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        <HudStat icon={Activity} label="Workouts" value={totalWorkouts} color="#3b82f6" />
        <HudStat icon={Flame} label="Weekly Vol" value={`${(weeklyVol/1000).toFixed(1)}k`} color="#f97316" />
        <HudStat icon={TrendingUp} label="Calories" value={totalCals} color="#00ff88" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="#e535ab" />
      </div>

      {/* 🔥 MUSCLE HEATMAP (Conditional Clean Slate) */}
      <div className="px-4 mb-4">
        <div className="glass p-5">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Bio-Verification Heatmap</span>
            <span className="text-[10px] font-mono text-white/20">{overallFatigue}% System Stress</span>
          </div>
          
          {overallFatigue === 0 ? (
            <div className="py-10 text-center">
              <div className="text-[10px] text-white/10 uppercase tracking-[0.3em] italic">System Cold: Awaiting Session Log</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
               {topFatigued.map(mh => (
                 <div key={mh.group}>
                   <div className="flex justify-between text-[9px] uppercase tracking-tighter mb-1.5">
                     <span className="text-white/40">{muscleName(mh.group)}</span>
                     <span style={{ color: getHeatColor(mh.heat) }}>{Math.round(mh.heat)}%</span>
                   </div>
                   <div className="h-1 bg-white/5 overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${mh.heat}%` }}
                        className="h-full" style={{ backgroundColor: getHeatColor(mh.heat) }} 
                      />
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* 📈 OVERLOAD INTEL */}
      {suggestions.length > 0 && (
        <div className="px-4 mb-4">
           <div className="glass p-4 border-l-2 border-magenta">
              <div className="text-[10px] font-black text-magenta uppercase tracking-[0.2em] mb-3">Progressive Overload Intel</div>
              {suggestions.slice(0, 2).map(({ suggestion: s, exercise: ex }) => (
                <div key={ex?.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/60">{ex?.name}</span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-magenta tracking-tighter">{s.suggestedWeight} lbs × {s.suggestedReps}</div>
                    <div className="text-[9px] text-white/20 uppercase">Target Suggestion</div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* ⚡ START SESSION */}
      {!session && (
        <div className="px-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => startSession()}
            className="w-full py-5 bg-cobalt text-black font-black text-sm uppercase tracking-widest glow-cobalt"
          >
            Initiate Ghost Protocol
          </motion.button>
        </div>
      )}

      <div className="px-4"><BlackBoxTerminal /></div>

      {/* ☢️ SYSTEM RESET (Monday Morning Wipe) */}
      <div className="px-4 mt-20 pb-12">
        <div className="border border-red-900/20 bg-red-900/5 p-4 text-center">
          <p className="text-[9px] text-red-500/30 uppercase tracking-widest mb-3 italic">Warning: Data persistence irreversible</p>
          <button
            onClick={() => {
              if (window.confirm("⚠️ SYSTEM WIPE: This will reset all Aura XP and History to 0. Proceed?")) {
                hardReset();
              }
            }}
            className="text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-tighter transition-colors"
          >
            Execute Hard Reset / Clear Local Storage
          </button>
        </div>
      </div>
    </div>
  );
}

function HudStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-3 text-center border-t border-white/5">
      <Icon className="w-3.5 h-3.5 mx-auto mb-1.5 opacity-40" style={{ color }} />
      <div className="text-sm font-black italic tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[8px] text-white/20 uppercase tracking-tighter font-bold">{label}</div>
    </div>
  );
}
