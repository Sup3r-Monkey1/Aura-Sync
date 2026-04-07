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
    return h > 45 ? `drop-shadow(0 0 ${h/6}px ${getMColor(m)})` : "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-10 pb-24 overflow-x-hidden">
      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic px-2">Evolution_Anatomy</h2>
      <p className="text-[9px] text-white/30 mt-1 px-2 uppercase font-mono tracking-widest font-black">CORE_XP: <span className="text-cobalt">{evolutionXP}</span></p>

      <div className="glass-strong p-8 mt-6 mb-6 flex flex-col items-center relative overflow-hidden border-t border-white/10 rounded-3xl">
        <div className="relative w-56 h-80 flex justify-center">
           <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.05)]">
              <path d="M90 45 Q100 28 110 45 Q110 65 100 72 Q90 65 90 45 Z" fill={getMColor('core')} />
              <path d="M70 85 Q100 78 130 85 L125 155 Q100 168 75 155 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} />
              <rect x="88" y="152" width="24" height="35" fill={getMColor('core')} rx="2" className="opacity-80" />
              <path d="M70 88 L55 135 Q70 145 75 135 Z" fill={getMColor('back')} />
              <path d="M130 88 L145 135 Q130 145 125 135 Z" fill={getMColor('back')} />
              <path d="M55 90 Q40 92 40 175 L55 175 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M145 90 Q160 92 160 175 L145 175 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M75 165 Q65 240 70 365 L95 365 L100 165 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M125 165 Q135 240 130 365 L105 365 L100 165 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>
        <div className="w-full mt-6 grid grid-cols-5 gap-1 border-t border-white/5 pt-4 font-mono">
           {TIERS.map(t => (<div key={t.label} className="flex flex-col items-center"><div className="h-1 w-full rounded-full" style={{ backgroundColor: t.color }} /><span className="text-[5px] font-black text-white/30 mt-1">{t.label}</span></div>))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 font-mono">
         <div className="glass p-4 text-center rounded-xl"><Heart size={14} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} /><div className="text-lg font-black mt-2 text-white">{watchConnected ? "64bpm" : "--"}</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Bio_Sync</div></div>
         <div className="glass p-4 text-center border-b border-cobalt/40 rounded-xl"><Activity size={14} className="text-cobalt" /><div className="text-lg font-black mt-2 text-white">{history.length}</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Logs</div></div>
         <div className="glass p-4 text-center rounded-xl"><ShieldCheck size={14} className="text-terminal" /><div className="text-lg font-black mt-2 text-white">{Math.min(100, history.length*5)}%</div><div className="text-[7px] text-white/20 uppercase font-bold tracking-widest mt-1">Status</div></div>
      </div>
    </div>
  );
}
