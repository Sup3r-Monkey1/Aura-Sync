import { motion } from 'framer-motion';
import { ShieldAlert, Heart, Activity, ShieldCheck, Watch } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getHeatColor } from '../engine/heatmap';

export default function EvolutionRank() {
  const { evolutionXP, history, muscleHeat, watchConnected, connectWatch } = useWorkoutStore();

  const totalWorkouts = history.length;
  const verifiedRate = totalWorkouts === 0 ? 0 : Math.min(100, 50 + (totalWorkouts * 5));
  const overloadedMuscles = muscleHeat.filter(m => m.heat > 70);

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="px-2 mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic">Evolution_Rank</h2>
        <p className="text-[10px] text-white/20 mt-1 uppercase font-mono tracking-widest font-black">
          AURA_TIER: <span className="text-cobalt">{evolutionXP < 500 ? 'DORMANT' : evolutionXP < 1500 ? 'AWAKENED' : 'RADIANT'}</span>
        </p>
      </div>

      <div className="glass p-8 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/5">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">Biomechanical_Analysis</div>
        
        <div className="relative w-32 h-64 flex justify-center">
           <svg viewBox="0 0 100 200" className="w-full h-full">
              <circle cx="50" cy="20" r="15" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
              <line x1="50" y1="35" x2="50" y2="120" stroke="white" strokeWidth="1" opacity="0.2" />
              {/* ARM L */}
              <line x1="50" y1="50" x2="20" y2="90" stroke={getHeatColor(muscleHeat.find(m=>m.group==='chest')?.heat || 0)} strokeWidth="6" />
              {/* ARM R */}
              <line x1="50" y1="50" x2="80" y2="90" stroke={getHeatColor(muscleHeat.find(m=>m.group==='chest')?.heat || 0)} strokeWidth="6" />
              {/* LEG L */}
              <line x1="50" y1="120" x2="30" y2="180" stroke={getHeatColor(muscleHeat.find(m=>m.group==='quads')?.heat || 0)} strokeWidth="8" />
              {/* LEG R */}
              <line x1="50" y1="120" x2="70" y2="180" stroke={getHeatColor(muscleHeat.find(m=>m.group==='quads')?.heat || 0)} strokeWidth="8" />
           </svg>
        </div>

        {overloadedMuscles.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center gap-3 text-hazard animate-pulse bg-hazard/10 px-4 py-2 border border-hazard/30">
            <ShieldAlert size={16}/>
            <span className="text-[10px] font-black uppercase tracking-widest">SYSTEM OVERLOAD: {overloadedMuscles[0].group} NEEDS REST</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
         <div className="glass p-5 text-center">
            <Heart size={16} className={watchConnected ? "text-red-500" : "text-white/5"} />
            <div className="text-xl font-black mt-2 text-white">{watchConnected ? '62ms' : '--'}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold mt-1 tracking-widest">HRV</div>
         </div>
         <div className="glass p-5 text-center">
            <Activity size={16} className="text-cobalt" />
            <div className="text-xl font-black mt-2 text-white">{totalWorkouts}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold mt-1 tracking-widest">Workouts</div>
         </div>
         <div className="glass p-5 text-center">
            <ShieldCheck size={16} className="text-terminal" />
            <div className="text-xl font-black mt-2 text-white">{verifiedRate}%</div>
            <div className="text-[8px] text-white/20 uppercase font-bold mt-1 tracking-widest">Verified</div>
         </div>
      </div>

      {!watchConnected && (
         <button onClick={connectWatch} className="w-full py-5 bg-cobalt text-black font-black uppercase text-[11px] tracking-[0.4em] glow-cobalt flex items-center justify-center gap-3 active:scale-95 transition-all">
           <Watch size={16}/> AUTHORIZE BIO-LINK
         </button>
      )}
    </div>
  );
}
