import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Flame, Zap, TrendingUp, Lock, Watch, User, Edit2, Check, Clock, Timer } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getZoneColor, getZoneLabel } from '../engine/readiness';
import { getHeatColor, muscleName, getTopFatigued, getOverallFatigue } from '../engine/heatmap';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { readiness, muscleHeat, history, watchConnected, connectWatch, evolutionXP, nutrition, refreshReadiness, decayHeatmap, startSession, session, userName, setUserName, sessionLimit, setSessionLimit, endSession } = useWorkoutStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // ⏱️ SESSION COUNTDOWN LOGIC
  useEffect(() => {
    let interval: any;
    if (session) {
      const start = session.startedAt;
      const limit = sessionLimit * 1000;
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, Math.floor((limit - elapsed) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) endSession();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, sessionLimit]);

  useEffect(() => { refreshReadiness(); decayHeatmap(); }, [refreshReadiness, decayHeatmap]);

  const zoneColor = getZoneColor(readiness.zone);
  const topFatigued = getTopFatigued(muscleHeat, 4);
  const overallFatigue = getOverallFatigue(muscleHeat);

  // 📊 DATA SYNC
  const today = new Date().setHours(0, 0, 0, 0);
  const totalCals = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.calories, 0);
  const totalProtein = nutrition.filter(n => n.timestamp >= today).reduce((s, n) => s + n.protein, 0);
  const weeklyVol = history.filter(h => h.date > (Date.now() - 604800000)).reduce((s, h) => s + h.totalVolume, 0);

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* HEADER */}
      <div className="px-4 pt-12 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cobalt animate-pulse" />
          {isEditingName ? (
            <input autoFocus className="bg-white/5 border-b border-cobalt text-white font-black uppercase outline-none" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={() => setIsEditingName(false)} />
          ) : (
            <h1 className="text-lg font-black tracking-widest text-white/90 uppercase flex items-center gap-2" onClick={() => setIsEditingName(true)}>{userName} <Edit2 size={10} className="opacity-20"/></h1>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/20 uppercase font-mono">Rank_XP</div>
          <div className="text-xl font-black text-cobalt italic">{evolutionXP}</div>
        </div>
      </div>

      {/* ⏱️ SESSION LIMITER (Dashboard Only) */}
      <div className="px-4 mb-6">
        <div className="glass p-5 border-l-2 border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40"><Clock size={14}/> Protocol Duration</div>
            {session && <div className="text-xs font-mono text-cobalt animate-pulse">LOCKED: {Math.floor(timeLeft/3600)}h {Math.floor((timeLeft%3600)/60)}m {timeLeft%60}s</div>}
          </div>
          {!session && (
            <div className="flex items-center gap-4">
               <input 
                type="range" min="1800" max="36000" step="1800" 
                value={sessionLimit} onChange={(e) => setSessionLimit(Number(e.target.value))}
                className="flex-1 accent-cobalt"
               />
               <div className="text-sm font-black text-white">{(sessionLimit/3600).toFixed(1)} <span className="text-[8px] opacity-40">HRS</span></div>
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        <HudStat icon={Activity} label="Workouts" value={history.length} color="#3b82f6" />
        <HudStat icon={Flame} label="Weekly" value={`${(weeklyVol/1000).toFixed(1)}k`} color="#f97316" />
        <HudStat icon={TrendingUp} label="Cals" value={totalCals} color="#00ff88" />
        <HudStat icon={Zap} label="Protein" value={`${totalProtein}g`} color="#e535ab" />
      </div>

      {/* HEATMAP SYNC */}
      <div className="px-4 mb-6">
        <div className="glass p-5">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-6">Heatmap Intensity: {overallFatigue}%</span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
             {topFatigued.map(mh => (
               <div key={mh.group}>
                 <div className="flex justify-between text-[9px] uppercase tracking-tighter mb-1.5 text-white/40"><span>{muscleName(mh.group)}</span><span style={{ color: getHeatColor(mh.heat) }}>{Math.round(mh.heat)}%</span></div>
                 <div className="h-1 bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${mh.heat}%` }} className="h-full" style={{ backgroundColor: getHeatColor(mh.heat) }} /></div>
               </div>
             ))}
             {overallFatigue === 0 && <div className="col-span-2 py-4 text-center text-[10px] text-white/10 uppercase tracking-widest italic">System Cold</div>}
          </div>
        </div>
      </div>

      {!session && <div className="px-4 mb-8"><motion.button whileTap={{ scale: 0.97 }} onClick={() => startSession()} className="w-full py-5 bg-cobalt text-black font-black text-sm uppercase tracking-widest glow-cobalt">Initiate Protocol Link</motion.button></div>}
      <div className="px-4"><BlackBoxTerminal /></div>
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
