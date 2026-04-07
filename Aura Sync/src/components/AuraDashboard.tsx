import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Flame, TrendingUp, Lock, Watch, User, Edit2, Check } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getZoneColor, getZoneLabel } from '../engine/readiness';
import { getHeatColor, muscleName, getTopFatigued, getOverallFatigue } from '../engine/heatmap';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { readiness, muscleHeat, history, watchConnected, connectWatch, evolutionXP, nutrition, refreshReadiness, decayHeatmap, startSession, session, userName, setUserName } = useWorkoutStore();
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => { refreshReadiness(); decayHeatmap(); }, [refreshReadiness, decayHeatmap]);

  const zoneColor = getZoneColor(readiness.zone);
  const topFatigued = getTopFatigued(muscleHeat, 4);
  const overallFatigue = getOverallFatigue(muscleHeat);

  const today = new Date().setHours(0, 0, 0, 0);
  const totalCals = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.calories, 0);
  const totalProtein = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.protein, 0);
  const weeklyVol = history.filter(h => h.date > (Date.now() - 604800000)).reduce((s, h) => s + h.totalVolume, 0);

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* HEADER WITH NAME INPUT */}
      <div className="px-4 pt-12 pb-6 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cobalt animate-pulse" />
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus
                  className="bg-white/5 border-b border-cobalt text-white font-black uppercase outline-none px-2"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
                <Check size={14} className="text-terminal" onClick={() => setIsEditingName(false)} />
              </div>
            ) : (
              <div className="flex items-center gap-2 group" onClick={() => setIsEditingName(true)}>
                <h1 className="text-lg font-black tracking-widest text-white/90 uppercase">{userName}</h1>
                <Edit2 size={12} className="text-white/20 group-hover:text-cobalt opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            )}
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Node_Status: Online</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/20 uppercase font-mono">Rank_XP</div>
          <div className="text-xl font-black text-cobalt italic">{evolutionXP}</div>
        </div>
      </div>

      {/* 🛡️ HARD BLUETOOTH GATE */}
      <div className="px-4 mb-6">
        {watchConnected ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-5 border-l-2" style={{ borderColor: zoneColor }}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2"><Brain size={14}/> Neural Readiness</span>
              <span className="text-[9px] font-mono py-0.5 px-2 bg-white/5" style={{ color: zoneColor }}>{readiness.zone}</span>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-4xl font-black italic tracking-tighter" style={{ color: zoneColor }}>{readiness.score}%</div>
               <div className="flex-1 text-[11px] text-white/60 leading-tight uppercase font-bold tracking-tight">{getZoneLabel(readiness.zone)}</div>
            </div>
          </motion.div>
        ) : (
          <div className="glass p-8 text-center border border-white/5 bg-white/[0.01] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-md select-none"><div className="text-6xl font-black italic tracking-tighter">--%</div></div>
            <div className="relative z-10">
              <Watch className="w-6 h-6 mx-auto mb-3 text-white/10" />
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Neural Metrics Locked</h3>
              <button onClick={() => connectWatch()} className="px-8 py-3 bg-cobalt text-black text-[11px] font-black uppercase tracking-widest glow-cobalt active:scale-95 transition-all">Sync Wearable</button>
              <p className="mt-3 text-[8px] text-white/20 uppercase tracking-widest">Connect Heart Rate Sensor to Unlock HUD</p>
            </div>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        <HudStat icon={Activity} label="Workouts" value={history.length} color="#3b82f6" />
        <HudStat icon={Flame} label="Weekly" value={`${(weeklyVol/1000).toFixed(1)}k`} color="#f97316" />
        <HudStat icon={TrendingUp} label="Cals" value={totalCals} color="#00ff88" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="#e535ab" />
      </div>

      {/* HEATMAP */}
      <div className="px-4 mb-6">
        <div className="glass p-5">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-6">Heatmap Intensity</span>
          {overallFatigue === 0 ? (
            <div className="py-10 text-center text-[10px] text-white/10 uppercase tracking-[0.3em] italic">System Cold</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
               {topFatigued.map(mh => (
                 <div key={mh.group}>
                   <div className="flex justify-between text-[9px] uppercase tracking-tighter mb-1.5 text-white/40"><span>{muscleName(mh.group)}</span><span style={{ color: getHeatColor(mh.heat) }}>{Math.round(mh.heat)}%</span></div>
                   <div className="h-1 bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${mh.heat}%` }} className="h-full" style={{ backgroundColor: getHeatColor(mh.heat) }} /></div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {!session && (
        <div className="px-4 mb-8">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => startSession()} className="w-full py-5 bg-cobalt text-black font-black text-sm uppercase tracking-widest glow-cobalt">Start Sync</motion.button>
        </div>
      )}

      <div className="px-4"><BlackBoxTerminal /></div>
    </div>
  );
}

function HudStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-3 text-center border-t border-white/5">
      <Icon className="w-3.5 h-3.5 mx-auto mb-1.5 opacity-40" style={{ color }} />
      <div className="text-sm font-black italic tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[8px] text-white/20 uppercase tracking-tighter font-bold">{label}</div>
    </div>
  );
}
