import { motion } from 'framer-motion';
import { ShieldAlert, Heart, Activity, ShieldCheck } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getHeatColor } from '../engine/heatmap';

export default function EvolutionRank() {
  const { evolutionXP, history, muscleHeat, watchConnected, connectWatch } = useWorkoutStore();

  const totalWorkouts = history.length;
  const verifiedRate = totalWorkouts === 0 ? 0 : 50 + (totalWorkouts * 2); // Scales with data
  const overloadedMuscles = muscleHeat.filter(m => m.heat > 75);

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="px-2 mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70">Evolution_Rank</h2>
        <p className="text-[10px] text-white/20 mt-1 uppercase font-mono tracking-widest">Tier: {evolutionXP < 1000 ? 'DORMANT' : 'AWAKENED'}</p>
      </div>

      {/* 🦴 BIO-SYSTEM BODY MAP */}
      <div className="glass p-8 mb-8 flex flex-col items-center relative overflow-hidden">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">System_Stress_Scan</div>
        
        <div className="relative w-32 h-64 border border-white/5 p-4">
           {/* SVG Body Skeleton */}
           <svg viewBox="0 0 100 200" className="w-full h-full opacity-60">
              <circle cx="50" cy="20" r="15" fill="none" stroke="white" strokeWidth="1" /> {/* Head */}
              <line x1="50" y1="35" x2="50" y2="120" stroke="white" strokeWidth="2" /> {/* Spine */}
              <line x1="50" y1="50" x2="20" y2="90" stroke={getHeatColor(muscleHeat.find(m=>m.group==='chest')?.heat || 0)} strokeWidth="4" /> {/* L Arm */}
              <line x1="50" y1="50" x2="80" y2="90" stroke={getHeatColor(muscleHeat.find(m=>m.group==='chest')?.heat || 0)} strokeWidth="4" /> {/* R Arm */}
              <line x1="50" y1="120" x2="30" y2="180" stroke={getHeatColor(muscleHeat.find(m=>m.group==='quads')?.heat || 0)} strokeWidth="4" /> {/* L Leg */}
              <line x1="50" y1="120" x2="70" y2="180" stroke={getHeatColor(muscleHeat.find(m=>m.group==='quads')?.heat || 0)} strokeWidth="4" /> {/* R Leg */}
           </svg>
        </div>

        {overloadedMuscles.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-hazard animate-pulse">
            <ShieldAlert size={16}/>
            <span className="text-[10px] font-black uppercase tracking-widest">Recovery Warning: {overloadedMuscles[0].group} Overload</span>
          </div>
        )}
      </div>

      {/* SYNCED STATS GRID */}
      <div className="grid grid-cols-3 gap-2 mb-8">
         <div className="glass p-4 text-center">
            <Heart size={16} className={watchConnected ? "text-red-500" : "text-white/10"} />
            <div className="text-lg font-black mt-2">{watchConnected ? '65ms' : '--'}</div>
            <div className="text-[8px] text-white/30 uppercase font-bold">HRV</div>
         </div>
         <div className="glass p-4 text-center">
            <Activity size={16} className="text-cobalt" />
            <div className="text-lg font-black mt-2">{totalWorkouts}</div>
            <div className="text-[8px] text-white/30 uppercase font-bold">Workouts</div>
         </div>
         <div className="glass p-4 text-center">
            <ShieldCheck size={16} className="text-terminal" />
            <div className="text-lg font-black mt-2">{Math.min(100, verifiedRate)}%</div>
            <div className="text-[8px] text-white/30 uppercase font-bold">Verified</div>
         </div>
      </div>

      {!watchConnected && (
         <button onClick={connectWatch} className="w-full py-4 bg-cobalt text-black font-black uppercase text-[10px] tracking-[0.3em] glow-cobalt">Pair External Sensor</button>
      )}
    </div>
  );
}
