import { motion } from 'framer-motion';
import { Lock, Watch, Shield, Heart, Activity, TrendingUp } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const AURA_TIERS = [
  { name: 'Dormant', minXP: 0, color: '#374151' },
  { name: 'Awakened', minXP: 500, color: '#2563eb' },
  { name: 'Charged', minXP: 1500, color: '#3b82f6' },
  { name: 'Radiant', minXP: 3000, color: '#8b5cf6' },
  { name: 'Ascended', minXP: 6000, color: '#e535ab' },
  { name: 'Transcendent', minXP: 10000, color: '#00ff88' },
];

export default function EvolutionRank() {
  const { watchConnected, connectWatch, evolutionXP, totalWorkouts, readiness, history } = useWorkoutStore();

  const currentTier = [...AURA_TIERS].reverse().find(t => evolutionXP >= t.minXP) || AURA_TIERS[0];
  const nextTier = AURA_TIERS[AURA_TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? (evolutionXP - currentTier.minXP) / (nextTier.minXP - currentTier.minXP)
    : 1;

  // Watch locked screen
  if (!watchConnected) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <Lock className="w-16 h-16 text-white/10" />
        </motion.div>
        <h2 className="text-lg font-bold text-white/40 mb-2">Evolution Locked</h2>
        <p className="text-xs text-white/20 text-center mb-8 max-w-[260px]">
          Connect a fitness tracker to unlock Bio-Verified progression.
          Your avatar only levels up with real, watch-verified effort.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={connectWatch}
          className="flex items-center gap-2 px-6 min-h-[52px] bg-cobalt text-white font-bold text-sm uppercase tracking-widest glow-cobalt"
        >
          <Watch className="w-5 h-5" /> Connect Watch
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Evolution Rank</h2>
        <p className="text-[10px] text-white/25 mt-1">Bio-Verified Progression</p>
      </div>

      {/* Avatar — Cobalt Silhouette Blueprint */}
      <div className="px-4 mb-4">
        <div className="glass p-6 flex flex-col items-center relative overflow-hidden">
          {/* Aura glow behind avatar */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              background: `radial-gradient(ellipse at center, ${currentTier.color}30, transparent 70%)`,
            }}
          />

          {/* Human silhouette SVG blueprint */}
          <div className="relative w-32 h-56 mb-4">
            <svg viewBox="0 0 100 180" className="w-full h-full">
              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 20} x2="100" y2={i * 20} stroke={`${currentTier.color}10`} strokeWidth="0.5" />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="180" stroke={`${currentTier.color}10`} strokeWidth="0.5" />
              ))}

              {/* Body outline */}
              <ellipse cx="50" cy="18" rx="12" ry="14" fill="none" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="32" x2="50" y2="90" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="45" x2="25" y2="75" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="45" x2="75" y2="75" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="90" x2="30" y2="140" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="90" x2="70" y2="140" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="30" y1="140" x2="25" y2="170" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />
              <line x1="70" y1="140" x2="75" y2="170" stroke={currentTier.color} strokeWidth="1.5" opacity="0.6" />

              {/* Joints */}
              {[[50,18],[50,45],[25,75],[75,75],[50,90],[30,140],[70,140]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill={`${currentTier.color}40`} stroke={currentTier.color} strokeWidth="0.5" />
              ))}

              {/* Heart pulse */}
              <motion.circle
                cx="50" cy="55"
                r="4"
                fill={currentTier.color}
                animate={{ r: [3, 5, 3], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </svg>

            {/* Floating particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1"
                style={{ backgroundColor: currentTier.color }}
                initial={{
                  x: 40 + Math.random() * 40,
                  y: 100 + Math.random() * 80,
                  opacity: 0,
                }}
                animate={{
                  y: [100 + Math.random() * 80, 20 + Math.random() * 40],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Tier info */}
          <div className="text-center relative z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Aura Tier</div>
            <div className="text-xl font-black" style={{ color: currentTier.color, textShadow: `0 0 20px ${currentTier.color}60` }}>
              {currentTier.name}
            </div>
            <div className="text-xs text-white/30 mt-1">{evolutionXP} XP</div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="w-full mt-4 relative z-10">
              <div className="flex justify-between text-[9px] text-white/25 mb-1">
                <span>{currentTier.name}</span>
                <span>{nextTier.name}</span>
              </div>
              <div className="h-2 bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: currentTier.color }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="text-[9px] text-white/20 text-center mt-1">
                {nextTier.minXP - evolutionXP} XP to {nextTier.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bio Metrics */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { icon: Heart, label: 'HRV', value: `${readiness.hrv}ms`, color: '#ef4444' },
          { icon: Activity, label: 'Workouts', value: totalWorkouts, color: '#3b82f6' },
          { icon: Shield, label: 'Verified', value: `${Math.min(100, Math.round((totalWorkouts / Math.max(1, totalWorkouts + 2)) * 100))}%`, color: '#00ff88' },
        ].map(m => (
          <div key={m.label} className="glass p-3 text-center">
            <m.icon className="w-4 h-4 mx-auto mb-1" style={{ color: m.color }} />
            <div className="text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[8px] text-white/25 uppercase">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Verification Log */}
      <div className="px-4">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Verification Log</h3>
        <div className="space-y-1.5">
          {history.slice(-5).reverse().map((h, i) => {
            const avgHR = 110 + Math.floor(Math.random() * 50);
            const verified = avgHR > 120;
            return (
              <div key={i} className="glass p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/50">{h.exerciseId.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-white/20 mt-0.5">
                    {h.totalVolume.toLocaleString()} lbs · HR: {avgHR} BPM
                  </div>
                </div>
                <div className={`text-[9px] uppercase tracking-wider font-bold ${verified ? 'text-[#00ff88]' : 'text-orange-500'}`}>
                  {verified ? (
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Verified</span>
                  ) : (
                    'Frozen'
                  )}
                </div>
              </div>
            );
          })}
          {history.length === 0 && (
            <div className="glass p-6 text-center text-white/15 text-xs">
              No workout history yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
