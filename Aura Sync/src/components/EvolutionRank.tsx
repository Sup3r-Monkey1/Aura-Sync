import { motion } from 'framer-motion';
import { ShieldAlert, Heart, Activity, ShieldCheck, Watch, Zap } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const EVOLUTION_TIERS = [
  { label: 'VOID', color: '#1A1A1B', minVol: -1 },
  { label: 'PULSE', color: '#00D1FF', minVol: 5000 },
  { label: 'NEBULA', color: '#BD00FF', minVol: 25000 },
  { label: 'SOLAR', color: '#FFD600', minVol: 75000 },
  { label: 'GOD', color: '#FFFFFF', minVol: 250000 },
];

export default function EvolutionRank() {
  const { evolutionXP, history, muscleHeat, muscleVolume, watchConnected, connectWatch, session, activeCardId } = useWorkoutStore();

  const getMuscleColor = (muscle: string) => {
    const vol = muscleVolume[muscle] || 0;
    const tier = [...EVOLUTION_TIERS].reverse().find(t => vol >= t.minVol) || EVOLUTION_TIERS[0];
    return tier.color;
  };

  const getIntensityGlow = (muscle: string) => {
    if (!session) return "0px 0px 0px transparent";
    const heat = muscleHeat.find(m => m.group === muscle)?.heat || 0;
    const isPulsing = heat > 50;
    const isMax = heat > 85;
    
    if (isMax) return `0 0 25px ${getMuscleColor(muscle)}`;
    if (isPulsing) return `0 0 10px ${getMuscleColor(muscle)}`;
    return "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="px-2 mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic">Evolution_Anatomy</h2>
        <p className="text-[10px] text-white/20 mt-1 uppercase font-mono tracking-widest font-black">
          AURA_TIER: <span className="text-cobalt">{evolutionXP < 1000 ? 'DORMANT' : evolutionXP < 5000 ? 'AWAKENED' : 'RADIANT'}</span>
        </p>
      </div>

      <div className="glass p-10 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/5">
        <div className="relative w-48 h-80 flex justify-center">
           <svg viewBox="0 0 100 200" className="w-full h-full">
              {/* HEAD */}
              <circle cx="50" cy="25" r="12" fill={getMuscleColor('core')} className="transition-all duration-1000" />
              {/* CHEST */}
              <rect x="35" y="42" width="30" height="20" fill={getMuscleColor('chest')} style={{ filter: `drop-shadow(${getIntensityGlow('chest')})` }} className="transition-all duration-1000" />
              {/* LATS / BACK */}
              <path d="M35 45 L25 75 L35 75 Z" fill={getMuscleColor('back')} />
              <path d="M65 45 L75 75 L65 75 Z" fill={getMuscleColor('back')} />
              {/* ARMS */}
              <rect x="22" y="45" width="8" height="40" fill={getMuscleColor('biceps')} className="transition-all duration-1000" />
              <rect x="70" y="45" width="8" height="40" fill={getMuscleColor('biceps')} className="transition-all duration-1000" />
              {/* CORE */}
              <rect x="40" y="65" width="20" height="25" fill={getMuscleColor('core')} className="transition-all duration-1000" />
              {/* LEGS */}
              <rect x="35" y="95" width="12" height="60" fill={getMuscleColor('legs')} style={{ filter: `drop-shadow(${getIntensityGlow('legs')})` }} className="transition-all duration-1000" />
              <rect x="53" y="95" width="12" height="60" fill={getMuscleColor('legs')} style={{ filter: `drop-shadow(${getIntensityGlow('legs')})` }} className="transition-all duration-1000" />
           </svg>

           {session && (
             <div className="absolute top-0 right-0 p-2 bg-cobalt text-black text-[8px] font-black uppercase animate-pulse">Live_Sync_Active</div>
           )}
        </div>

        <div className="mt-8 grid grid-cols-5 gap-1 w-full">
           {EVOLUTION_TIERS.map(t => (
             <div key={t.label} className="text-center">
                <div className="h-1 w-full mb-1" style={{ backgroundColor: t.color }} />
                <div className="text-[7px] font-black text-white/30">{t.label}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 font-mono">
         <div className="glass p-5 text-center">
            <Heart size={16} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} />
            <div className="text-xl font-black mt-2 text-white">{watchConnected ? '64bpm' : '--'}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Sync_HR</div>
         </div>
         <div className="glass p-5 text-center border-b border-cobalt/40">
            <Activity size={16} className="text-cobalt" />
            <div className="text-xl font-black mt-2 text-white">{history.length}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest">History</div>
         </div>
         <div className="glass p-5 text-center">
            <ShieldCheck size={16} className="text-terminal" />
            <div className="text-xl font-black mt-2 text-white">{Math.min(100, (history.length * 4))}%</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Verified</div>
         </div>
      </div>

      {!watchConnected && (
         <button onClick={connectWatch} className="w-full py-5 bg-white/5 border border-white/10 text-white/60 font-black uppercase text-[10px] tracking-[0.4em] active:bg-cobalt active:text-black transition-all">
           Link Hardware Sensor
         </button>
      )}
    </div>
  );
}
