import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, MapPin, Users } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

export default function GymLobby() {
  const { totalWorkouts, history } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);

  // 🛡️ DYNAMIC GHOST LOGIC
  const myTotalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  
  // If user is at 0, Ghost is at a reachable baseline (e.g., 2500 lbs).
  // If user has worked, Ghost is always 15% ahead to keep you motivated.
  const ghostVolume = myTotalVolume === 0 ? 2500 : Math.round(myTotalVolume * 1.15);
  
  const isWinning = myTotalVolume > ghostVolume && myTotalVolume > 0;
  const activeUsers = totalWorkouts === 0 ? 0 : Math.floor(Math.random() * 20) + 5;

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/70">Gym Lobby</h2>
          <div className="flex items-center gap-1 mt-1"><MapPin size={10} className="text-cobalt"/><span className="text-[10px] text-white/20 uppercase font-mono">EOS Craig Blvd</span></div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black italic text-cobalt">{activeUsers}</div>
          <div className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Live Links</div>
        </div>
      </div>

      {/* GHOST RIVALRY CARD */}
      <div className="glass p-6 border-l-2 border-magenta mb-8">
         <div className="flex items-center gap-2 mb-6">
            <Swords size={16} className="text-magenta" />
            <span className="text-[10px] font-black text-magenta uppercase tracking-[0.3em]">Ghost Rivalry Protocol</span>
         </div>

         <div className="space-y-6">
            <div>
               <div className="flex justify-between text-[10px] mb-2 font-black italic uppercase tracking-tighter">
                  <span className="text-white/40 tracking-widest">You</span>
                  <span className="text-cobalt">{myTotalVolume.toLocaleString()} lbs</span>
               </div>
               <div className="h-2 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (myTotalVolume / Math.max(myTotalVolume, ghostVolume)) * 100)}%` }}
                    className="h-full bg-cobalt glow-cobalt" 
                  />
               </div>
            </div>

            <div>
               <div className="flex justify-between text-[10px] mb-2 font-black italic uppercase tracking-tighter">
                  <span className="text-white/40 tracking-widest">Ghost Link #402</span>
                  <span className="text-magenta/60">{ghostVolume.toLocaleString()} lbs</span>
               </div>
               <div className="h-2 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (ghostVolume / Math.max(myTotalVolume, ghostVolume)) * 100)}%` }}
                    className="h-full bg-magenta/30" 
                  />
               </div>
            </div>
         </div>

         {isWinning && (
           <button onClick={() => setShowDominance(true)} className="w-full mt-6 py-3 bg-magenta/10 border border-magenta/30 text-magenta text-[10px] font-black uppercase tracking-widest"><Crown size={12} className="inline mr-2"/> Claim Dominance</button>
         )}
      </div>

      <div className="text-center">
         <p className="text-[9px] text-white/10 uppercase tracking-[0.4em] italic">Scanning Local Zone for Active Biometrics...</p>
      </div>

      <AnimatePresence>
        {showDominance && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center" onClick={() => setShowDominance(false)}>
             <Crown size={64} className="text-magenta mb-4 text-glow-magenta" />
             <h2 className="text-3xl font-black italic text-magenta tracking-tighter mb-2 uppercase">Lobby Dominance</h2>
             <p className="text-xs text-white/40 uppercase tracking-widest">Target Overcome — Protocol Verified</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
