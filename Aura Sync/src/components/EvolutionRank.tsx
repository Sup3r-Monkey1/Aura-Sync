import { motion } from 'framer-motion';
import { Heart, Activity, ShieldCheck, Watch } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const TIERS = [
  { label: 'VOID', color: '#1A1A1B', minVol: -1 },
  { label: 'PULSE', color: '#00D1FF', minVol: 5000 },
  { label: 'NEBULA', color: '#BD00FF', minVol: 25000 },
  { label: 'SOLAR', color: '#FFD600', minVol: 75000 },
  { label: 'GOD', color: '#FFFFFF', minVol: 250000 },
];

export default function EvolutionRank() {
  const { history, muscleHeat, muscleVolume, watchConnected, connectWatch, session, evolutionXP } = useWorkoutStore();

  const getMColor = (m: string) => {
    const vol = muscleVolume[m] || 0;
    return ([...TIERS].reverse().find(t => vol >= t.minVol) || TIERS[0]).color;
  };

  const getMGlow = (m: string) => {
    if (!session) return "none";
    const h = muscleHeat.find(x => x.group === m)?.heat || 0;
    return h > 45 ? `drop-shadow(0 0 ${h/5}px ${getMColor(m)})` : "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 overflow-x-hidden">
      <div className="px-2 mb-10">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/80 italic">Anatomical_Evolution</h2>
        <p className="text-[10px] text-white/30 mt-1 uppercase font-mono tracking-widest font-black">CORE_XP: <span className="text-cobalt text-glow-cobalt">{evolutionXP}</span></p>
      </div>

      <div className="glass-strong p-10 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/10 rounded-3xl">
        <div className="relative w-72 h-[450px] flex justify-center">
           <svg viewBox="0 0 200 400" className="w-full h-full">
              {/* ATHLETIC SKULL */}
              <path d="M88 40 Q100 20 112 40 Q112 65 100 75 Q88 65 88 40 Z" fill={getMColor('core')} className="transition-all duration-1000" />
              
              {/* CONTOURED TORSO / ABS */}
              <path d="M60 80 Q100 70 140 80 L135 150 Q100 165 65 150 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} className="transition-all duration-1000" />
              <rect x="85" y="155" width="30" height="40" fill={getMColor('core')} rx="2" className="opacity-80" />

              {/* TRAPS / DELTS */}
              <path d="M60 82 L45 130 Q60 140 65 130 Z" fill={getMColor('back')} className="opacity-90" />
              <path d="M140 82 L155 130 Q140 140 135 130 Z" fill={getMColor('back')} className="opacity-90" />

              {/* BICEP / FOREARM CONTOUR */}
              <path d="M45 85 Q32 85 30 170 Q35 220 45 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M155 85 Q168 85 170 170 Q165 220 155 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />

              {/* LEG / QUAD POWER CONTOUR */}
              <path d="M65 170 Q50 250 55 380 L95 380 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M135 170 Q150 250 145 380 L105 380 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>
        <div className="w-full mt-10 grid grid-cols-5 gap-1 border-t border-white/5 pt-6">
           {TIERS.map(t => (<div key={t.label} className="flex flex-col items-center"><div className="h-1.5 w-full rounded-full" style={{ backgroundColor: t.color }} /><span className="text-[6px] font-black text-white/30 mt-2 tracking-tighter">{t.label}</span></div>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10 font-mono">
         <div className="glass p-5 text-center"><Heart size={16} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} /><div className="text-xl font-black mt-2 text-white">{watchConnected ? "64bpm" : "--"}</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Bio_Link</div></div>
         <div className="glass p-5 text-center border-b border-cobalt/40"><Activity size={16} className="text-cobalt" /><div className="text-xl font-black mt-2 text-white">{history.length}</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Sessions</div></div>
         <div className="glass p-5 text-center"><ShieldCheck size={16} className="text-terminal" /><div className="text-xl font-black mt-2 text-white">{Math.min(100, history.length*5)}%</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Sync</div></div>
      </div>
      {!watchConnected && <button onClick={connectWatch} className="w-full py-5 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.4em] active:bg-cobalt active:text-black transition-all">Authorize Hardware Link</button>}
    </div>
  );
}
