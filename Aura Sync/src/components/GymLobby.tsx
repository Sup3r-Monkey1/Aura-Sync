import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, MapPin, Calendar as CalIcon, Zap, Target } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import ProtocolCalendar from './ProtocolCalendar';

export default function GymLobby() {
  const { totalWorkouts, history, ghostVolume, evolutionXP } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const myTotalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  const isWinning = myTotalVolume > ghostVolume && myTotalVolume > 0;
  
  const maxVol = Math.max(myTotalVolume, ghostVolume, 10000);
  const myProgress = (myTotalVolume / maxVol) * 100;
  const ghostProgress = (ghostVolume / maxVol) * 100;

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cobalt text-glow-cobalt mb-1">Zone_Monitor</h2>
          <div className="flex items-center gap-1.5 opacity-50"><MapPin size={10}/><span className="text-[9px] uppercase font-mono tracking-widest">EOS Craig Blvd / Nevada</span></div>
        </div>
        <button 
          onClick={() => setShowCalendar(true)}
          className="relative group overflow-hidden px-5 py-2 bg-white/5 border border-white/10 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2 relative z-10">
            <CalIcon size={12} className="text-cobalt" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Monthly_Link</span>
          </div>
          <div className="absolute inset-0 bg-cobalt/10 translate-y-full group-hover:translate-y-0 transition-transform" />
        </button>
      </div>

      {/* ⚔️ GHOST RIVALRY HUD */}
      <div className="glass-strong p-8 border-t border-white/10 mb-8 relative overflow-hidden">
         <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
               <Swords size={18} className="text-magenta animate-pulse" />
               <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Neural Rivalry</span>
            </div>
            <div className="text-[10px] font-mono text-magenta/60 uppercase">Link Status: {isWinning ? 'DOMINANT' : 'SYNCING...'}</div>
         </div>

         <div className="space-y-10 relative z-10">
            {/* User Volume Bar */}
            <div className="relative">
               <div className="flex justify-between text-[10px] mb-3 font-black uppercase tracking-[0.2em]">
                  <span className="text-white/40 italic flex items-center gap-2"><Zap size={10} className="text-cobalt"/> User_Node</span>
                  <span className="text-cobalt text-glow-cobalt">{myTotalVolume.toLocaleString()} <span className="text-[8px] opacity-50">LBS</span></span>
               </div>
               <div className="h-1.5 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${myProgress}%` }}
                    className="h-full bg-cobalt shadow-[0_0_15px_#2563eb]" 
                    transition={{ duration: 1.5, ease: "circOut" }}
                  />
               </div>
            </div>

            {/* Ghost Volume Bar */}
            <div className="relative">
               <div className="flex justify-between text-[10px] mb-3 font-black uppercase tracking-[0.2em]">
                  <span className="text-white/40 italic flex items-center gap-2"><Target size={10} className="text-magenta"/> Ghost_Link</span>
                  <span className="text-magenta text-glow-magenta">{Math.round(ghostVolume).toLocaleString()} <span className="text-[8px] opacity-50">LBS</span></span>
               </div>
               <div className="h-1.5 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${ghostProgress}%` }}
                    className="h-full bg-magenta/40" 
                    transition={{ duration: 1.5, ease: "circOut" }}
                  />
               </div>
            </div>
         </div>

         {/* Decorative Scanning Line */}
         <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent h-1/2 animate-scan pointer-events-none" />

         {isWinning && (
           <motion.button 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             onClick={() => setShowDominance(true)} 
             className="w-full mt-10 py-4 bg-magenta text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(229,53,171,0.3)] active:scale-95 transition-all"
           >
             Claim Dominance
           </motion.button>
         )}
      </div>

      {/* QUICK STATS HUD */}
      <div className="grid grid-cols-2 gap-3 mb-8">
         <div className="glass p-4 border-l-2 border-cobalt">
            <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Avg_Aura</div>
            <div className="text-lg font-black italic">AWAKENED</div>
         </div>
         <div className="glass p-4 border-l-2 border-magenta">
            <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Global_Rank</div>
            <div className="text-lg font-black italic">#1,402</div>
         </div>
      </div>

      <AnimatePresence>
        {showCalendar && <ProtocolCalendar onClose={() => setShowCalendar(false)} />}
        {showDominance && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/98 flex flex-col items-center justify-center p-6 text-center" onClick={() => setShowDominance(false)}>
             <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mb-6">
               <Crown size={80} className="text-magenta text-glow-magenta" />
             </motion.div>
             <h2 className="text-4xl font-black italic text-magenta tracking-tighter mb-2 uppercase">Lobby Dominance</h2>
             <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Protocol Verified — Target Overcome</p>
             <p className="mt-12 text-[9px] text-white/20 uppercase tracking-[0.5em] animate-pulse">Sync_Restored</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
