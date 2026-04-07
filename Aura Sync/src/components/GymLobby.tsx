import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Swords, Crown, MapPin, Shield, Zap } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const GYM_ZONES = [
  { name: 'Free Weights', baseUsers: 8, baseHeat: 0.7 },
  { name: 'Machine Deck', baseUsers: 12, baseHeat: 0.5 },
  { name: 'Cable Matrix', baseUsers: 5, baseHeat: 0.85 },
  { name: 'Cardio Grid', baseUsers: 15, baseHeat: 0.3 },
];

export default function GymLobby() {
  const { totalWorkouts, evolutionXP, history } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);

  // Ghost Rival Logic: Scaled based on your progress
  const myTotalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  const rivalVolume = totalWorkouts === 0 ? 0 : 8500 + (totalWorkouts * 500); 
  const isWinning = myTotalVolume > rivalVolume && totalWorkouts > 0;
  
  const activeUsers = totalWorkouts === 0 ? 0 : Math.floor(Math.random() * 25) + 5;

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/70 flex items-center gap-2">
          <MapPin size={14} className="text-cobalt" /> Local Gym Lobby
        </h2>
        <p className="text-[10px] text-white/25 mt-1 font-mono uppercase italic tracking-widest">Zone: EOS Craig Blvd</p>
      </div>

      {/* Dynamic Activity HUD */}
      <div className="px-4 mb-4">
        <div className="glass p-6 flex justify-between items-center border-l-2 border-cobalt">
          <div>
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">Room Activity</div>
            <div className="text-4xl font-black italic tracking-tighter">{activeUsers}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Avg Aura Level</div>
            <div className="text-sm font-bold text-white/60">AWAKENED</div>
          </div>
        </div>
      </div>

      {/* Zone Heatmap (Dynamic) */}
      <div className="px-4 mb-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-black">Zone Occupation</h3>
        <div className="space-y-2">
          {GYM_ZONES.map(zone => (
            <div key={zone.name} className="glass p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-white/60 font-bold uppercase tracking-tight">{zone.name}</span>
                <span className="text-[10px] text-white/20 font-mono">
                  {totalWorkouts === 0 ? 0 : Math.floor(zone.baseUsers * (0.8 + Math.random() * 0.4))} LINKS
                </span>
              </div>
              <div className="h-1 bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: totalWorkouts === 0 ? '0%' : `${zone.baseHeat * 100}%` }}
                  className="h-full bg-cobalt" style={{ opacity: zone.baseHeat }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚔️ GHOST RIVAL (Locked until 1st Sync) */}
      <div className="px-4 mb-6">
        <div className="glass p-5 border-l-2 border-magenta">
          <div className="flex items-center gap-2 mb-6">
            <Swords className="w-4 h-4 text-magenta" />
            <span className="text-[10px] font-black text-magenta uppercase tracking-[0.2em]">Ghost Rivalry</span>
          </div>

          {totalWorkouts === 0 ? (
             <div className="py-6 text-center">
               <div className="text-[10px] text-white/10 uppercase tracking-[0.4em] italic mb-4">Awaiting 1st Session Sync</div>
               <div className="w-full h-1 bg-white/5" />
             </div>
          ) : (
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter">
                    <span className="text-white/40 italic">You</span>
                    <span className="text-cobalt font-bold">{myTotalVolume.toLocaleString()} lbs</span>
                  </div>
                  <div className="h-2 bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-cobalt glow-cobalt" 
                      animate={{ width: `${Math.min(100, (myTotalVolume / Math.max(myTotalVolume, rivalVolume)) * 100)}%` }}
                    />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase tracking-tighter">
                    <span className="text-white/40 italic">Ghost #821</span>
                    <span className="text-magenta/60 font-bold">{rivalVolume.toLocaleString()} lbs</span>
                  </div>
                  <div className="h-2 bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-magenta/30" 
                      animate={{ width: `${Math.min(100, (rivalVolume / Math.max(myTotalVolume, rivalVolume)) * 100)}%` }}
                    />
                  </div>
               </div>
               
               {isWinning && (
                 <motion.button
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setShowDominance(true)}
                   className="w-full mt-4 py-3 border border-magenta/30 bg-magenta/5 text-magenta text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                 >
                   <Crown size={12} /> Claim Dominance
                 </motion.button>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 grid grid-cols-3 gap-2">
        <LobbyBadge icon="👻" label="Ghost" active={totalWorkouts > 0} />
        <LobbyBadge icon="👑" label="Volume" active={myTotalVolume > 10000} />
        <LobbyBadge icon="⚡" label="Sync" active={evolutionXP > 1000} />
      </div>

      {/* Dominance Overlay */}
      <AnimatePresence>
        {showDominance && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
            onClick={() => setShowDominance(false)}
          >
             <Crown size={64} className="text-magenta mb-4 text-glow-magenta" />
             <h2 className="text-3xl font-black italic text-magenta tracking-tighter mb-2 uppercase">Lobby Dominance</h2>
             <p className="text-xs text-white/40 uppercase tracking-widest">You have outperformed the current Ghost Link</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LobbyBadge({ icon, label, active }: any) {
  return (
    <div className={`glass p-4 text-center ${!active ? 'opacity-20 grayscale' : 'border-t border-cobalt/20'}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</div>
    </div>
  );
}
