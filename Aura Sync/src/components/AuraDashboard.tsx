import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Zap, Timer, Edit2, ShieldCheck, Watch, User, ChefHat } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { history, watchConnected, connectWatch, evolutionXP, nutrition, userName, userAge, userWeight, setUserStats, setUserName } = useWorkoutStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const today = new Date().setHours(0, 0, 0, 0);
  const totalCals = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.calories, 0);
  const totalProtein = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.protein, 0);

  // 🥩 BIO-STRATEGY ENGINE
  const getStrategy = () => {
    if (userWeight > 210) return { label: "AGGRESSIVE CUT", cal: 2100, protein: 220, note: "Target fat oxidation while preserving nitrogen balance." };
    if (userWeight < 165) return { label: "HYPERTROPHY BULK", cal: 3200, protein: 180, note: "Caloric surplus required for myofibrillar expansion." };
    return { label: "LEAN RECOMP", cal: 2600, protein: 200, note: "Maintenance load with high intensity set-chains." };
  };
  const strategy = getStrategy();

  return (
    <div className="min-h-screen bg-[#050505] pb-24 p-4 pt-12 overflow-x-hidden">
      <div className="flex justify-between items-start mb-10">
        <div onClick={() => setIsEditingProfile(true)} className="cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cobalt animate-pulse" />
            <h1 className="text-lg font-black tracking-widest text-white/90 uppercase">{userName}</h1>
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono">BIO_LINK: {userAge}Y // {userWeight}LBS</p>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-white/20 uppercase font-mono">RANK_XP</div>
          <div className="text-2xl font-black text-cobalt italic">{evolutionXP}</div>
        </div>
      </div>

      {/* 🍲 BIO-STRATEGY CARD */}
      <div className="glass p-5 border-l-2 border-magenta mb-6">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-magenta uppercase tracking-widest"><ChefHat size={14}/> Nutritional_Strategy</div>
        <div className="flex justify-between items-end mb-4">
           <div className="text-xl font-black text-white italic tracking-tighter">{strategy.label}</div>
           <div className="text-xs font-black text-magenta">{strategy.cal} KCAL</div>
        </div>
        <p className="text-[10px] text-white/40 font-mono leading-relaxed">{strategy.note}</p>
      </div>

      <div className="px-4 mb-10 mt-10"><BlackBoxTerminal /></div>

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-xs space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white mb-8 border-l-4 border-cobalt pl-4">Update Identity</h2>
                <div className="space-y-4">
                   <div className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Name</span><input className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userName} onChange={(e)=>setUserName(e.target.value)}/></div>
                   <div className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Age</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userAge} onChange={(e)=>setUserStats(Number(e.target.value), userWeight)}/></div>
                   <div className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Weight (Lbs)</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userWeight} onChange={(e)=>setUserStats(userAge, Number(e.target.value))}/></div>
                </div>
                <button onClick={()=>setIsEditingProfile(false)} className="w-full py-4 bg-cobalt text-black font-black uppercase mt-8 tracking-widest">Authorize Changes</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HudStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-3 text-center border-t border-white/5">
      <Icon className="w-3.5 h-3.5 mx-auto mb-1.5 opacity-40" style={{ color }} />
      <div className="text-sm font-black italic tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[8px] text-white/20 uppercase font-bold">{label}</div>
    </div>
  );
}
