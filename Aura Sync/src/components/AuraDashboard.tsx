import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Zap, Edit2, ChefHat, ShieldCheck, Watch } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { history, watchConnected, connectWatch, evolutionXP, nutrition, userName, userAge, userWeight, setUserStats, setUserName } = useWorkoutStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const today = new Date().setHours(0, 0, 0, 0);
  const totalCals = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.calories, 0);
  const totalProtein = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.protein, 0);
  const weeklyVol = history.filter(h => h.date > (Date.now() - 604800000)).reduce((s, h) => s + h.totalVolume, 0);

  const getStrategy = () => {
    if (userWeight > 210) return { label: "AGGRESSIVE CUT", cal: 2100, note: "Optimize fat oxidation // Nitrogen preservation." };
    if (userWeight < 165) return { label: "HYPERTROPHY BULK", cal: 3200, note: "Caloric surplus for fiber expansion." };
    return { label: "LEAN RECOMP", cal: 2600, note: "Steady state // High intensity chains." };
  };
  const strategy = getStrategy();

  return (
    <div className="min-h-screen bg-[#050505] pb-24 p-4 pt-10 overflow-x-hidden">
      {/* 🚀 TERMINAL HEADER */}
      <div className="flex justify-between items-start mb-8 px-2">
        <div onClick={() => setIsEditingProfile(true)} className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 bg-cobalt glow-cobalt" />
            <h1 className="text-xl font-black tracking-tighter text-white uppercase aura-text-glow">{userName}</h1>
            <Edit2 size={10} className="text-white/20" />
          </div>
          <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-mono">Status: Subject_01_Online</p>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-white/20 uppercase font-mono tracking-widest">XP_CORE</div>
          <div className="text-2xl font-black text-cobalt italic aura-text-glow leading-none">{evolutionXP}</div>
        </div>
      </div>

      {/* 📊 GLASS STATS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <HudStat icon={Activity} label="Logs" value={history.length} color="text-cobalt" />
        <HudStat icon={Flame} label="Weekly" value={`${(weeklyVol/1000).toFixed(1)}k`} color="text-orange-500" />
        <HudStat icon={Zap} label="Cals" value={totalCals} color="text-terminal" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="text-magenta" />
      </div>

      {/* 🧬 STRATEGY CARD */}
      <div className="aura-card p-5 mb-6 border-l-4 border-magenta">
        <div className="flex items-center gap-2 mb-4 text-[9px] font-black text-magenta uppercase tracking-[0.4em]"><ChefHat size={14}/> Nutritional_Strategy</div>
        <div className="flex justify-between items-end mb-2">
           <div className="text-xl font-black text-white italic tracking-tighter aura-text-glow-magenta">{strategy.label}</div>
           <div className="text-xs font-black text-magenta font-mono">{strategy.cal} KCAL</div>
        </div>
        <p className="text-[10px] text-white/40 font-mono leading-relaxed bg-white/[0.02] p-3 border border-white/5">{strategy.note}</p>
      </div>

      {/* 🛰️ BIOMETRIC HANDSHAKE */}
      <div className="mb-8">
        {watchConnected ? (
          <div className="aura-card p-4 border-l-4 border-terminal flex justify-between items-center">
             <div><div className="text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">Neural_HRV_Link</div><div className="text-2xl font-black text-terminal italic aura-text-glow leading-none">64bpm</div></div>
             <ShieldCheck className="text-terminal shadow-lg" size={24} />
          </div>
        ) : (
          <button onClick={connectWatch} className="w-full aura-card p-6 border-dashed border-white/10 flex flex-col items-center gap-3 active:bg-white/5">
             <Watch size={20} className="text-white/20 animate-pulse" />
             <span className="text-[9px] font-black text-cobalt uppercase tracking-[0.4em]">Establish Biometric Handshake</span>
          </button>
        )}
      </div>

      <BlackBoxTerminal />

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 p-8 flex flex-col justify-center items-center backdrop-blur-md">
             <div className="w-full max-w-xs space-y-6 aura-card-strong p-8">
                <h2 className="text-xl font-black italic uppercase text-white mb-4 border-l-4 border-cobalt pl-4">Update_Identity</h2>
                <div className="space-y-4">
                   <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 block">Subject_Name</span><input className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none font-mono" value={userName} onChange={(e)=>setUserName(e.target.value)}/></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 block">Age</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none font-mono" value={userAge} onChange={(e)=>setUserStats(Number(e.target.value), userWeight)}/></div>
                      <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 block">Weight</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none font-mono" value={userWeight} onChange={(e)=>setUserStats(userAge, Number(e.target.value))}/></div>
                   </div>
                </div>
                <button onClick={()=>setIsEditingProfile(false)} className="w-full py-4 aura-button-aperture text-black font-black uppercase tracking-widest rounded-lg">Authorize</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HudStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="aura-card p-5 text-center flex flex-col items-center justify-center rounded-2xl">
      <Icon className={`w-4 h-4 mb-2 opacity-60 ${color}`} />
      <div className={`text-xl font-black italic tracking-tighter ${color} aura-text-glow`}>{value}</div>
      <div className="text-[8px] text-white/30 uppercase font-black tracking-[0.2em]">{label}</div>
    </div>
  );
}
