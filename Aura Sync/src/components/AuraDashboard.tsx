import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Flame, Zap, Watch, Edit2, Timer, Lock, ShieldCheck } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { getZoneColor, getZoneLabel } from '../engine/readiness';
import { workoutRegistry } from '../data/workoutRegistry';
import BlackBoxTerminal from './BlackBoxTerminal';

export default function AuraDashboard() {
  const { readiness, history, watchConnected, connectWatch, evolutionXP, nutrition, refreshReadiness, startSession, session, userName, setUserName, userAge, userWeight, setUserStats, sessionLimit, setSessionLimit, endSession } = useWorkoutStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [targetMuscle, setTargetMuscle] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (session) {
      interval = setInterval(() => {
        const elapsed = Date.now() - session.startedAt;
        const remaining = Math.max(0, Math.floor((sessionLimit * 1000 - elapsed) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) endSession();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, sessionLimit, endSession]);

  useEffect(() => { refreshReadiness(); }, [refreshReadiness]);

  const zoneColor = getZoneColor(readiness.zone);

  return (
    <div className="min-h-screen bg-[#050505] pb-24 overflow-x-hidden">
      <div className="px-4 pt-12 pb-6 flex justify-between items-start">
        <div onClick={() => setIsEditingProfile(true)} className="cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-cobalt animate-pulse" />
            <h1 className="text-lg font-black tracking-widest text-white/90 uppercase">{userName}</h1>
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono">Age: {userAge} | Weight: {userWeight} lbs</p>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-white/20 uppercase font-mono tracking-widest">XP_Core</div>
          <div className="text-2xl font-black text-cobalt italic">{evolutionXP}</div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="glass p-5 border-l-2 border-cobalt">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40"><Timer size={14} className="text-cobalt"/> Session_Timer</div>
            {session && <div className="text-sm font-mono text-cobalt font-black animate-pulse">
              {Math.floor(timeLeft/3600)}h {Math.floor((timeLeft%3600)/60)}m {timeLeft%60}s
            </div>}
          </div>
          {!session ? (
            <div className="space-y-4">
               <input type="range" min="300" max="36000" step="300" value={sessionLimit} onChange={(e) => setSessionLimit(Number(e.target.value))} className="w-full accent-cobalt" />
               <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase"><span>5m</span><span>{(sessionLimit/3600).toFixed(1)} hrs</span><span>10h</span></div>
            </div>
          ) : (
            <button onClick={endSession} className="w-full py-3 bg-red-500/20 text-red-500 border border-red-500/40 font-black text-[10px] uppercase tracking-widest">Abort Session</button>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="glass p-5">
           <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Tactical Suggestions</div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
              {['chest', 'legs', 'back', 'shoulders', 'core'].map(m => (
                <button key={m} onClick={() => setTargetMuscle(m)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap border ${targetMuscle === m ? 'bg-cobalt text-black border-cobalt' : 'bg-white/5 border-white/10 text-white/40'}`}>{m}</button>
              ))}
           </div>
           {targetMuscle && (
             <div className="space-y-2">
                {workoutRegistry.filter(ex => ex.category === targetMuscle).slice(0, 2).map(ex => (
                  <div key={ex.id} className="flex justify-between items-center p-3 bg-white/[0.02] border-r-2 border-cobalt">
                    <span className="text-[11px] font-bold text-white/70 uppercase">{ex.name}</span>
                    <span className="text-[8px] text-cobalt font-mono">LINK_READY</span>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="px-4 mb-6">
        {watchConnected ? (
          <div className="glass p-5 border-l-2 border-terminal flex justify-between items-start">
             <div><div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">HRV_Live</div><div className="text-3xl font-black text-terminal italic">64ms</div></div>
             <ShieldCheck className="text-terminal" size={20} />
          </div>
        ) : (
          <button onClick={connectWatch} className="w-full glass p-6 border-dashed border-white/10 flex flex-col items-center gap-3"><Watch className="text-white/20" /><span className="text-[10px] font-black text-cobalt uppercase tracking-[0.3em]">Sync Bio-Sensor for HRV</span></button>
        )}
      </div>

      {!session && <div className="px-4 mb-8"><motion.button whileTap={{ scale: 0.97 }} onClick={() => startSession()} className="w-full py-5 bg-cobalt text-black font-black text-sm uppercase tracking-widest glow-cobalt">Initiate Link</motion.button></div>}
      <div className="px-4"><BlackBoxTerminal /></div>

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 p-8 flex flex-col justify-center items-center">
             <div className="w-full max-w-xs space-y-6">
                <h2 className="text-2xl font-black italic uppercase text-white mb-8 border-l-4 border-cobalt pl-4">Protocol Identity</h2>
                <div className="space-y-4">
                   <label className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Name</span><input className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userName} onChange={(e)=>setUserName(e.target.value)}/></label>
                   <label className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Age</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userAge} onChange={(e)=>setUserStats(Number(e.target.value), userWeight)}/></label>
                   <label className="block"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Weight (Lbs)</span><input type="number" className="w-full bg-white/5 p-4 border border-white/10 text-white outline-none" value={userWeight} onChange={(e)=>setUserStats(userAge, Number(e.target.value))}/></label>
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
