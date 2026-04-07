import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Zap, Timer, Edit2, ChefHat, ShieldCheck, Watch } from 'lucide-react';
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
    if (userWeight > 210) return { label: "AGGRESSIVE CUT", cal: 2100, note: "Target fat oxidation // Preserve nitrogen balance." };
    if (userWeight < 165) return { label: "HYPERTROPHY BULK", cal: 3200, note: "Caloric surplus for myofibrillar expansion." };
    return { label: "LEAN RECOMP", cal: 2600, note: "Maintenance load // High intensity set-chains." };
  };
  const strategy = getStrategy();

  return (
    <div className="min-h-screen bg-[#050505] pb-24 p-4 pt-10 overflow-x-hidden">
      {/* COMPACT MOBILE HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div onClick={() => setIsEditingProfile(true)} className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cobalt animate-pulse shrink-0" />
            <h1 className="text-lg font-black tracking-widest text-white uppercase truncate">{userName}</h1>
            <Edit2 size={10} className="opacity-20" />
          </div>
          <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-mono">BIO_LINK: {userAge}Y // {userWeight}LBS</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[8px] text-white/20 uppercase font-mono tracking-widest">RANK_XP</div>
          <div className="text-xl font-black text-cobalt italic leading-none">{evolutionXP}</div>
        </div>
      </div>

      {/* 2x2 MOBILE STATS GRID */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <HudStat icon={Activity} label="Logs" value={history.length} color="#3b82f6" />
        <HudStat icon={Flame} label="Weekly" value={`${(weeklyVol/1000).toFixed(1)}k`} color="#f97316" />
        <HudStat icon={Zap} label="Cals" value={totalCals} color="#00ff88" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="#e535ab" />
      </div>

      <div className="glass p-4 border-l-2 border-magenta mb-6">
        <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-magenta uppercase tracking-widest"><ChefHat size={12}/> Strategy_Node</div>
        <div className="flex justify-between items-end mb-2">
           <div className="text-lg font-black text-white italic tracking-tighter uppercase">{strategy.label}</div>
           <div className="text-[10px] font-black text-magenta">{strategy.cal} KCAL</div>
        </div>
        <p className="text-[9px] text-white/40 font-mono leading-tight">{strategy.note}</p>
      </div>

      {/* BIOMETRIC GATE */}
      <div className="mb-6">
        {watchConnected ? (
          <div className="glass p-4 border-l-2 border-terminal flex justify-between items-center">
             <div><div className="text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">Heart_Rate_Link</div><div className="text-2xl font-black text-terminal italic leading-none">64bpm</div></div>
             <ShieldCheck className="text-terminal" size={20} />
          </div>
        ) : (
          <button onClick={connectWatch} className="w-full glass p-4 border-dashed border-white/10 flex items-center justify-center gap-3 active:bg-white/5 transition-colors">
             <Watch size={14} className="text-white/20" />
             <span className="text-[9px] font-black text-cobalt uppercase tracking-[0.3em]">Authorize Hardware Bio-Link</span>
          </button>
        )}
      </div>

      <BlackBoxTerminal />

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 p-6 flex flex-col justify-center items-center">
             <div className="w-full max-w-xs space-y-6">
                <h2 className="text-xl font-black italic uppercase text-white mb-4 border-l-4 border-cobalt pl-4">Identity</h2>
                <div className="space-y-4">
                   <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Name</span><input className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userName} onChange={(e)=>setUserName(e.target.value)}/></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Age</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userAge} onChange={(e)=>setUserStats(Number(e.target.value), userWeight)}/></div>
                      <div className="block"><span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Weight</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userWeight} onChange={(e)=>setUserStats(userAge, Number(e.target.value))}/></div>
                   </div>
                </div>
                <button onClick={()=>setIsEditingProfile(false)} className="w-full py-4 bg-cobalt text-black font-black uppercase mt-6 tracking-widest rounded-lg">Authorize</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HudStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-4 text-center border-t border-white/5 rounded-xl">
      <Icon className="w-4 h-4 mx-auto mb-1.5 opacity-40 shrink-0" style={{ color }} />
      <div className="text-lg font-black italic tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">{label}</div>
    </div>
  );
}
