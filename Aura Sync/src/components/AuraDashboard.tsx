import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Zap, Timer, Edit2, ShieldCheck, Watch } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { history, watchConnected, connectWatch, evolutionXP, nutrition, userName, userAge, userWeight, setUserStats } = useWorkoutStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const today = new Date().setHours(0, 0, 0, 0);
  const totalCals = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.calories, 0);
  const totalProtein = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.protein, 0);
  const weeklyVol = history.filter(h => h.date > (Date.now() - 604800000)).reduce((s, h) => s + h.totalVolume, 0);

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
          <div className="text-[9px] text-white/20 uppercase font-mono tracking-widest">RANK_XP</div>
          <div className="text-2xl font-black text-cobalt italic">{evolutionXP}</div>
        </div>
      </div>

      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        <HudStat icon={Activity} label="Logs" value={history.length} color="#3b82f6" />
        <HudStat icon={Flame} label="Weekly" value={`${(weeklyVol/1000).toFixed(1)}k`} color="#f97316" />
        <HudStat icon={Zap} label="Cals" value={totalCals} color="#00ff88" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="#e535ab" />
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
