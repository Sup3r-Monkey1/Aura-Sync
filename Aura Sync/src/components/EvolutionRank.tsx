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
    return `0 0 ${h/4}px ${getMColor(m)}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-10 pb-24 overflow-x-hidden">
      <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/60 italic px-2">Evolution_Model</h2>
      
      <div className="aura-card-strong p-8 mt-6 mb-8 flex flex-col items-center relative overflow-hidden rounded-[2rem] border-t border-white/20">
        {/* HOLOGRAPHIC SCANNER LINES */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
        
        <div className="relative w-64 h-96 flex justify-center z-10">
           <svg viewBox="0 0 200 400" className="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              {/* 3D CONTOURED ANATOMY PATHS */}
              <path d="M88 40 Q100 22 112 40 Q112 65 100 72 Q88 65 88 40 Z" fill={getMColor('core')} stroke="white" strokeWidth="0.5" opacity="0.5" />
              <path d="M65 80 Q100 72 135 80 L130 160 Q100 175 70 160 Z" fill={getMColor('chest')} style={{ filter: `drop-shadow(${getMGlow('chest')})` }} className="transition-all duration-1000" stroke="white" strokeWidth="0.2" />
              <path d="M50 82 Q35 85 35 180 L50 180 Z" fill={getMColor('biceps')} style={{ filter: `drop-shadow(${getMGlow('biceps')})` }} stroke="white" strokeWidth="0.2" />
              <path d="M150 82 Q165 85 165 180 L150 180 Z" fill={getMColor('biceps')} style={{ filter: `drop-shadow(${getMGlow('biceps')})` }} stroke="white" strokeWidth="0.2" />
              <path d="M70 170 Q55 250 60 380 L90 380 L95 170 Z" fill={getMColor('quads')} style={{ filter: `drop-shadow(${getMGlow('quads')})` }} stroke="white" strokeWidth="0.2" />
              <path d="M130 170 Q145 250 140 380 L110 380 L105 170 Z" fill={getMColor('quads')} style={{ filter: `drop-shadow(${getMGlow('quads')})` }} stroke="white" strokeWidth="0.2" />
           </svg>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cobalt/5 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
        </div>

        <div className="w-full mt-10 grid grid-cols-5 gap-1 pt-6 border-t border-white/5">
           {TIERS.map(t => (<div key={t.label} className="flex flex-col items-center"><div className="h-1 w-full rounded-full" style={{ backgroundColor: t.color, boxShadow: `0 0 10px ${t.color}40` }} /><span className="text-[6px] font-black text-white/30 mt-1 font-mono tracking-tighter">{t.label}</span></div>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 font-mono">
         <div className="aura-card p-4 text-center rounded-2xl"><Heart size={16} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} /><div className="text-xl font-black mt-2 text-white aura-text-glow">{watchConnected ? "64" : "--"}</div><div className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] mt-1">HRV_Live</div></div>
         <div className="aura-card p-4 text-center rounded-2xl border-b-2 border-cobalt"><Activity size={16} className="text-cobalt" /><div className="text-xl font-black mt-2 text-white aura-text-glow">{history.length}</div><div className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] mt-1">Uploads</div></div>
         <div className="aura-card p-4 text-center rounded-2xl"><ShieldCheck size={16} className="text-terminal" /><div className="text-xl font-black mt-2 text-white aura-text-glow">{Math.min(100, history.length*4)}%</div><div className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] mt-1">Verified</div></div>
      </div>
      {!watchConnected && <button onClick={connectWatch} className="w-full py-5 aura-card border-dashed border-white/20 text-white/40 font-black uppercase text-[10px] tracking-[0.5em] active:bg-cobalt active:text-black transition-all rounded-2xl">Establish Bio-Sync</button>}
    </div>
  );
}
