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
      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic px-2">Evolution_Anatomy</h2>
      <p className="text-[10px] text-white/30 mt-1 px-2 uppercase font-mono tracking-widest font-black">CORE_XP: <span className="text-cobalt">{evolutionXP}</span></p>

      <div className="glass-strong p-10 mt-8 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/10 rounded-3xl">
        <div className="relative w-64 h-96 flex justify-center">
           <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.05)]">
              {/* HEAD */}
              <path d="M88 40 Q100 22 112 40 Q112 65 100 72 Q88 65 88 40 Z" fill={getMColor('core')} />
              {/* CHEST / TORSO */}
              <path d="M65 80 Q100 72 135 80 L130 160 Q100 175 70 160 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} />
              {/* TRAPS / BACK */}
              <path d="M65 80 L50 140 Q65 150 70 140 Z" fill={getMColor('back')} />
              <path d="M135 80 L150 140 Q135 150 130 140 Z" fill={getMColor('back')} />
              {/* ARMS */}
              <path d="M50 82 Q35 85 35 180 L50 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M150 82 Q165 85 165 180 L150 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              {/* LEGS */}
              <path d="M70 170 Q60 250 65 370 L95 370 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M130 170 Q140 250 135 370 L105 370 L100 170 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>
        <div className="w-full mt-10 grid grid-cols-5 gap-1 border-t border-white/5 pt-6">
           {TIERS.map(t => (<div key={t.label} className="flex flex-col items-center"><div className="h-1.5 w-full rounded-full" style={{ backgroundColor: t.color }} /><span className="text-[6px] font-black text-white/30 mt-1 font-mono tracking-tighter">{t.label}</span></div>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10 font-mono">
         <div className="glass p-5 text-center"><Heart size={16} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} /><div className="text-xl font-black mt-2 text-white">{watchConnected ? "64bpm" : "--"}</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Bio_Sync</div></div>
         <div className="glass p-5 text-center border-b border-cobalt/40"><Activity size={16} className="text-cobalt" /><div className="text-xl font-black mt-2 text-white">{history.length}</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Uploads</div></div>
         <div className="glass p-5 text-center"><ShieldCheck size={16} className="text-terminal" /><div className="text-xl font-black mt-2 text-white">{Math.min(100, history.length*5)}%</div><div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Verified</div></div>
      </div>
      {!watchConnected && <button onClick={connectWatch} className="w-full py-5 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.4em] active:bg-cobalt active:text-black transition-all">Pair Hardware Sensor</button>}
    </div>
  );
}
