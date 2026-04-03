import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Swords, Crown, MapPin, Shield } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const GYM_ZONES = [
  { name: 'Free Weights', users: 8, avgAura: 'Charged', heat: 0.7 },
  { name: 'Machines', users: 12, avgAura: 'Awakened', heat: 0.5 },
  { name: 'Cable Area', users: 5, avgAura: 'Radiant', heat: 0.85 },
  { name: 'Cardio', users: 15, avgAura: 'Dormant', heat: 0.3 },
  { name: 'Stretching', users: 3, avgAura: 'Awakened', heat: 0.2 },
];

const BADGES = [
  { name: 'Iron Ghost', icon: '👻', earned: true },
  { name: 'Volume King', icon: '👑', earned: true },
  { name: 'Silent Rival', icon: '⚔️', earned: false },
  { name: 'Consistency', icon: '🔥', earned: true },
  { name: 'PR Breaker', icon: '💎', earned: false },
  { name: 'Night Owl', icon: '🦉', earned: false },
];

export default function GymLobby() {
  const { evolutionXP } = useWorkoutStore();
  const [showDominance, setShowDominance] = useState(false);

  // Simulated ghost rival
  const rivalVolume = 4200 + Math.floor(Math.random() * 2000);
  const myVolume = 3800 + Math.floor(Math.random() * 2500);
  const isWinning = myVolume > rivalVolume;
  const totalUsers = GYM_ZONES.reduce((s, z) => s + z.users, 0);

  const claimDominance = () => {
    setShowDominance(true);
    setTimeout(() => setShowDominance(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Local Gym Lobby</h2>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="w-3 h-3 text-cobalt/50" />
          <span className="text-[10px] text-white/25">EOS Craig Blvd</span>
        </div>
      </div>

      {/* Room Stats */}
      <div className="px-4 mb-4">
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cobalt" />
              <span className="text-xs text-white/50">Active Users</span>
            </div>
            <span className="text-lg font-black text-cobalt">{totalUsers}</span>
          </div>
          <div className="text-[10px] text-white/20">
            Room Aura Level: <span className="text-cobalt">Charged</span> — {evolutionXP} combined XP in zone
          </div>
        </div>
      </div>

      {/* Zone Heatmap */}
      <div className="px-4 mb-4">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Zone Heatmap</h3>
        <div className="space-y-1.5">
          {GYM_ZONES.map(zone => (
            <div key={zone.name} className="glass p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">{zone.name}</span>
                  <span className="text-[9px] text-cobalt/40">{zone.avgAura}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* User dots — privacy first, no names */}
                  <div className="flex -space-x-1">
                    {Array.from({ length: Math.min(zone.users, 6) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5"
                        style={{
                          backgroundColor: zone.heat > 0.7
                            ? '#ef4444' : zone.heat > 0.4
                            ? '#f97316' : '#2563eb',
                          opacity: 0.4 + (i * 0.1),
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/25">{zone.users}</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.heat * 100}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    backgroundColor: zone.heat > 0.7
                      ? '#ef4444' : zone.heat > 0.4
                      ? '#f97316' : '#2563eb',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ghost Rival */}
      <div className="px-4 mb-4">
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Swords className="w-4 h-4 text-magenta" />
            <span className="text-xs uppercase tracking-widest text-white/50">Ghost Rival</span>
            <span className="text-[9px] text-magenta/60 ml-auto">LIVE</span>
          </div>

          <div className="space-y-3">
            {/* My volume */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-cobalt">You</span>
                <span className="text-white/40">{myVolume.toLocaleString()} lbs</span>
              </div>
              <div className="h-3 bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-cobalt"
                  animate={{ width: `${(myVolume / Math.max(myVolume, rivalVolume)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Rival volume */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-magenta/60">Ghost #{Math.floor(Math.random() * 900) + 100}</span>
                <span className="text-white/40">{rivalVolume.toLocaleString()} lbs</span>
              </div>
              <div className="h-3 bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-magenta/60"
                  animate={{ width: `${(rivalVolume / Math.max(myVolume, rivalVolume)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {isWinning && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={claimDominance}
              className="w-full min-h-[48px] mt-3 bg-gradient-to-r from-magenta/20 to-violet/20 border border-magenta/20 text-magenta text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" /> Claim Dominance
            </motion.button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="px-4">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Lobby Badges</h3>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map(badge => (
            <div
              key={badge.name}
              className={`glass p-3 text-center ${!badge.earned ? 'opacity-25' : ''}`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-[9px] text-white/40 uppercase">{badge.name}</div>
              {badge.earned && (
                <Shield className="w-3 h-3 text-cobalt mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dominance claim overlay */}
      <AnimatePresence>
        {showDominance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/90 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Crown className="w-24 h-24 text-magenta" style={{ filter: 'drop-shadow(0 0 30px #e535ab)' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center"
            >
              <div className="text-xl font-black text-magenta text-glow-magenta">DOMINANCE</div>
              <div className="text-xs text-white/30 mt-1 uppercase tracking-widest">Badge Earned</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
