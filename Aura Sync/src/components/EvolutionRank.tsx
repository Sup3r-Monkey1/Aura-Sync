import { motion } from 'framer-motion';
import { Heart, Activity, ShieldCheck, Watch, Zap } from 'lucide-react';
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
    return h > 50 ? `drop-shadow(0 0 ${h/5}px ${getMColor(m)})` : "none";
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="px-2 mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/70 italic underline decoration-cobalt underline-offset-8">Evolution_Anatomy</h2>
      </div>

      <div className="glass-strong p-10 mb-8 flex flex-col items-center relative overflow-hidden">
        <div className="relative w-56 h-96">
           <svg viewBox="0 0 200 400" className="w-full h-full">
              {/* DETAILED HEAD */}
              <path d="M85 40 Q100 20 115 40 Q115 65 100 70 Q85 65 85 40 Z" fill={getMColor('core')} />
              {/* CHEST/TORSO PEAK DEFINITION */}
              <path d="M60 80 Q100 70 140 80 L135 150 Q100 160 65 150 Z" fill={getMColor('chest')} style={{ filter: getMGlow('chest') }} className="transition-all duration-1000" />
              {/* LATS */}
              <path d="M60 85 L40 140 Q60 145 65 140 Z" fill={getMColor('back')} />
              <path d="M140 85 L160 140 Q140 145 135 140 Z" fill={getMColor('back')} />
              {/* ARMS - CONTOURED */}
              <path d="M45 85 Q30 85 30 180 L45 180 Z" fill={getMColor('biceps')} />
              <path d="M155 85 Q170 85 170 180 L155 180 Z" fill={getMColor('biceps')} />
              {/* LEGS - QUAD DEFINITION */}
              <path d="M65 160 Q55 240 60 360 L90 360 L95 160 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
              <path d="M135 160 Q145 240 140 360 L110 360 L105 160 Z" fill={getMColor('quads')} style={{ filter: getMGlow('quads') }} />
           </svg>
        </div>

        <div className="w-full mt-10 grid grid-cols-5 gap-2">
           {TIERS.map(t => (
             <div key={t.label} className="flex flex-col items-center">
                <div className="h-1 w-full" style={{ backgroundColor: t.color }} />
                <span className="text-[6px] font-black text-white/30 mt-1">{t.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10">
         <StatItem icon={<Heart size={14}/>} label="HRV" val={watchConnected ? "64ms" : "--"} color={watchConnected ? "text-red-500" : "text-white/10"} />
         <StatItem icon={<Activity size={14}/>} label="Workouts" val={history.length} color="text-cobalt" />
         <StatItem icon={<ShieldCheck size={14}/>} label="Verified" val={`${Math.min(100, history.length*5)}%`} color="text-terminal" />
      </div>

      {!watchConnected && <button onClick={connectWatch} className="w-full py-5 border border-cobalt/20 bg-cobalt/5 text-cobalt text-[10px] font-black uppercase tracking-[0.4em]">Initialize Hardware Link</button>}
    </div>
  );
}

function StatItem({ icon, label, val, color }: any) {
  return (
    <div className="glass p-4 text-center">
      <div className={`${color} flex justify-center mb-2`}>{icon}</div>
      <div className="text-xl font-black text-white">{val}</div>
      <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{label}</div>
    </div>
  );
}
