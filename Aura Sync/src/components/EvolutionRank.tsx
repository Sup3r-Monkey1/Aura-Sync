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
  const { history, muscleHeat, muscleVolume, watchConnected, connectWatch, session } = useWorkoutStore();

  const getMColor = (m: string) => {
    const vol = muscleVolume[m] || 0;
    return ([...TIERS].reverse().find(t => vol >= t.minVol) || TIERS[0]).color;
  };

  const getMGlow = (m: string) => {
    if (!session) return "none";
    const h = muscleHeat.find(x => x.group === m)?.heat || 0;
    return h > 40 ? `drop-shadow(0 0 ${h/4}px ${getMColor(m)})` : "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 overflow-x-hidden">
      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic mb-8 px-2">Evolution_Anatomy</h2>

      <div className="glass-strong p-10 mb-8 flex flex-col items-center relative overflow-hidden border-t border-white/10">
        <div className="relative w-64 h-96">
           <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.05)]">
              {/* HEAD */}
              <path d="M85 40 Q100 20 115 40 Q115 65 100 70 Q85 65 85 40 Z" fill={getMColor('core')} />
              {/* CHEST */}
              <path d="M60 80 Q100 70 140 80 L135 150 Q100 160 65 150 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} />
              {/* BACK */}
              <path d="M60 85 L40 140 Q60 145 65 140 Z" fill={getMColor('back')} />
              <path d="M140 85 L160 140 Q140 145 135 140 Z" fill={getMColor('back')} />
              {/* ARMS */}
              <path d="M45 85 Q30 85 30 180 L45 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              <path d="M155 85 Q170 85 170 180 L155 180 Z" fill={getMColor('biceps')} style={{ filter: getMGlow('biceps') }} />
              {/* CORE */}
              <rect x="75" y="155" width="50" height="40" fill={getMColor('core')} rx="2" />
              {/* LEGS */}
              <path d="M65 160 Q55 240 60 360 L90 360 L95 160 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M135 160 Q145 240 140 360 L110 360 L105 160 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>

        <div className="w-full mt-10 grid grid-cols-5 gap-2 border-t border-white/5 pt-6">
           {TIERS.map(t => (
             <div key={t.label} className="flex flex-col items-center">
                <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[7px] font-black text-white/30 mt-2 tracking-tighter">{t.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10">
         <div className="glass p-5 text-center">
            <Heart size={16} className={watchConnected ? "text-red-500 animate-pulse" : "text-white/5"} />
            <div className="text-xl font-black mt-2 text-white">{watchConnected ? "64ms" : "--"}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">HRV</div>
         </div>
         <div className="glass p-5 text-center border-b border-cobalt/40">
            <Activity size={16} className="text-cobalt" />
            <div className="text-xl font-black mt-2 text-white">{history.length}</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Syncs</div>
         </div>
         <div className="glass p-5 text-center">
            <ShieldCheck size={16} className="text-terminal" />
            <div className="text-xl font-black mt-2 text-white">{Math.min(100, history.length*5)}%</div>
            <div className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">Status</div>
         </div>
      </div>
    </div>
  );
}
