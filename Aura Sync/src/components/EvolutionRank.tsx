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
    if (!session) return "0px 0px 5px rgba(255,255,255,0.05)";
    const h = muscleHeat.find(x => x.group === m)?.heat || 0;
    return h > 45 ? `drop-shadow(0 0 ${h/5}px ${getMColor(m)})` : "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-10 pb-24 overflow-x-hidden">
      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic px-2 aura-text-glow">Evolution_Anatomy</h2>
      <p className="text-[10px] text-white/30 mt-1 px-2 uppercase font-mono tracking-widest font-black">CORE_XP: <span className="text-cobalt">{evolutionXP}</span></p>

      <div className="glass-strong p-10 mt-8 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/10 rounded-3xl">
        <div className="relative w-64 h-[450px] flex justify-center">
           <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.05)]">
              {/* HEAD */}
              <path d="M88 40 Q100 20 112 40 Q112 65 100 75 Q88 65 88 40 Z" fill={getMColor('core')} />
              {/* CHEST / ABS (CONTOURED) */}
              <path d="M60 80 Q100 70 140 80 L135 150 Q100 165 65 150 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} />
              <rect x="85" y="152" width="30" height="42" fill={getMColor('core')} rx="2" className="opacity-80" />
              {/* BACK / SHOULDERS */}
              <path d="M60 82 L45 130 Q60 140 65 130 Z" fill={getMColor('back')} />
              <path d="M140 82 L155 130 Q140 140 135 130 Z" fill={getMColor('back')} />
              {/* ARMS (ATHLETIC TAPERING) */}
              <path d="M45 85 Q32 85 30 170 Q35 220 45 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M155 85 Q168 85 170 170 Q165 220 155 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              {/* LEGS (QUAD MUSCLE DEFINITION) */}
              <path d="M65 170 Q50 250 55 380 L95 380 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M135 170 Q150 250 145 380 L105 380 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>
        <div className="w-full mt-10 grid grid-cols-5 gap-1 border-t border-white/5 pt-4 font-mono">
           {TIERS.map(t => (<div key={t.label} className="flex flex-col items-center"><div className="h-1 w-full rounded-full" style={{ backgroundColor: t.color }} /><span className="text-[5px] font-black text-white/30 mt-1">{t.label}</span></div>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 font-mono">
         <div className="glass p-4 text-center rounded-xl"><Heart size={14} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} /><div className="text-lg font-black mt-2 text-white aura-text-glow">{watchConnected ? "64bpm" : "--"}</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Bio_Sync</div></div>
         <div className="glass p-4 text-center border-b border-cobalt/40 rounded-xl"><Activity size={14} className="text-cobalt" /><div className="text-lg font-black mt-2 text-white aura-text-glow">{history.length}</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Logs</div></div>
         <div className="glass p-4 text-center rounded-xl"><ShieldCheck size={14} className="text-terminal" /><div className="text-lg font-black mt-2 text-white">{Math.min(100, history.length*5)}%</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Status</div></div>
      </div>
      {!watchConnected && <button onClick={connectWatch} className="w-full py-5 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.4em] active:bg-cobalt active:text-black transition-all rounded-xl shadow-lg font-mono">Authorize Hardware Bio-Link</button>}
    </div>
  );
}
