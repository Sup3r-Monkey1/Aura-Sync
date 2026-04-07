import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, MapPin, Calendar as CalIcon } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import ProtocolCalendar from './ProtocolCalendar';

export default function GymLobby() {
  const { totalWorkouts, history, ghostVolume, syncGhost } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    syncGhost(); // Check for missed days on mount
  }, []);

  const myTotalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  const isWinning = myTotalVolume > ghostVolume && myTotalVolume > 0;

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/70">Gym Lobby</h2>
        <button 
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 px-4 py-2 glass border-cobalt/30 text-cobalt text-[10px] font-black uppercase tracking-widest"
        >
          <CalIcon size={12} /> Schedule
        </button>
      </div>

      {/* GHOST RIVALRY HUD */}
      <div className="glass p-6 border-l-2 border-magenta mb-8 relative overflow-hidden">
         <div className="flex items-center gap-2 mb-6">
            <Swords size={16} className="text-magenta" />
            <span className="text-[10px] font-black text-magenta uppercase tracking-[0.3em]">Pace-Matched Rivalry</span>
         </div>

         <div className="space-y-6 relative z-10">
            <div>
               <div className="flex justify-between text-[10px] mb-2 font-black uppercase italic tracking-tighter">
                  <span className="text-white/40">User_Volume</span>
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
               <div className="flex justify-between text-[10px] mb-2 font-black uppercase italic tracking-tighter">
                  <span className="text-white/40">Ghost_Link_Volume</span>
                  <span className="text-magenta/60">{Math.round(ghostVolume).toLocaleString()} lbs</span>
               </div>
               <div className="h-2 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (ghostVolume / Math.max(myTotalVolume, ghostVolume)) * 100)}%` }}
                    className="h-full bg-magenta/30" 
                  />
               </div>
            </div>
         </div>

         {/* Background Pulse if Ghost is winning */}
         {ghostVolume > myTotalVolume && (
           <div className="absolute inset-0 bg-magenta/5 animate-pulse pointer-events-none" />
         )}

         {isWinning && (
           <button onClick={() => setShowDominance(true)} className="w-full mt-6 py-3 bg-magenta/10 border border-magenta/30 text-magenta text-[10px] font-black uppercase tracking-widest"><Crown size={12} className="inline mr-2"/> Claim Dominance</button>
         )}
      </div>

      <AnimatePresence>
        {showCalendar && <ProtocolCalendar onClose={() => setShowCalendar(false)} />}
        {showDominance && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center" onClick={() => setShowDominance(false)}>
             <Crown size={64} className="text-magenta mb-4 text-glow-magenta" />
             <h2 className="text-3xl font-black italic text-magenta tracking-tighter mb-2 uppercase">Lobby Dominance</h2>
             <p className="text-xs text-white/40 uppercase tracking-widest">Ghost Link Overcome</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Crown, MapPin, Calendar as CalIcon } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import ProtocolCalendar from './ProtocolCalendar';

export default function GymLobby() {
  const { totalWorkouts, history, ghostVolume, syncGhost } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    syncGhost(); // Check for missed days on mount
  }, []);

  const myTotalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  const isWinning = myTotalVolume > ghostVolume && myTotalVolume > 0;

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/70">Gym Lobby</h2>
        <button 
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 px-4 py-2 glass border-cobalt/30 text-cobalt text-[10px] font-black uppercase tracking-widest"
        >
          <CalIcon size={12} /> Schedule
        </button>
      </div>

      {/* GHOST RIVALRY HUD */}
      <div className="glass p-6 border-l-2 border-magenta mb-8 relative overflow-hidden">
         <div className="flex items-center gap-2 mb-6">
            <Swords size={16} className="text-magenta" />
            <span className="text-[10px] font-black text-magenta uppercase tracking-[0.3em]">Pace-Matched Rivalry</span>
         </div>

         <div className="space-y-6 relative z-10">
            <div>
               <div className="flex justify-between text-[10px] mb-2 font-black uppercase italic tracking-tighter">
                  <span className="text-white/40">User_Volume</span>
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
               <div className="flex justify-between text-[10px] mb-2 font-black uppercase italic tracking-tighter">
                  <span className="text-white/40">Ghost_Link_Volume</span>
                  <span className="text-magenta/60">{Math.round(ghostVolume).toLocaleString()} lbs</span>
               </div>
               <div className="h-2 bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, (ghostVolume / Math.max(myTotalVolume, ghostVolume)) * 100)}%` }}
                    className="h-full bg-magenta/30" 
                  />
               </div>
            </div>
         </div>

         {/* Background Pulse if Ghost is winning */}
         {ghostVolume > myTotalVolume && (
           <div className="absolute inset-0 bg-magenta/5 animate-pulse pointer-events-none" />
         )}

         {isWinning && (
           <button onClick={() => setShowDominance(true)} className="w-full mt-6 py-3 bg-magenta/10 border border-magenta/30 text-magenta text-[10px] font-black uppercase tracking-widest"><Crown size={12} className="inline mr-2"/> Claim Dominance</button>
         )}
      </div>

      <AnimatePresence>
        {showCalendar && <ProtocolCalendar onClose={() => setShowCalendar(false)} />}
        {showDominance && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center" onClick={() => setShowDominance(false)}>
             <Crown size={64} className="text-magenta mb-4 text-glow-magenta" />
             <h2 className="text-3xl font-black italic text-magenta tracking-tighter mb-2 uppercase">Lobby Dominance</h2>
             <p className="text-xs text-white/40 uppercase tracking-widest">Ghost Link Overcome</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
