import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Target, Edit3 } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import MealNotes from './MealNotes';

export default function FuelVision() {
  const { addNutrition, nutrition } = useWorkoutStore();
  const [scanning, setScanning] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [manualProt, setManualProt] = useState('');
  const [identifiedItems, setIdentifiedItems] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = useCallback(async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        setIdentifiedItems([{ name: 'Detected Protein Node', cal: 350, p: 42 }]);
      }, 2500);
    } catch (e) { setScanning(false); }
  }, []);

  const manualLog = () => {
    if (!manualName || !manualCal) return;
    addNutrition({ name: manualName, calories: Number(manualCal), protein: Number(manualProt), carbs: 0, fats: 0, verified: true });
    setManualName(''); setManualCal(''); setManualProt('');
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false); setIdentifiedItems([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-4 pt-12 pb-32 space-y-6 overflow-y-auto no-scrollbar">
      <div className="px-2 flex justify-between items-end">
        <div><h2 className="text-xs font-black uppercase tracking-[0.5em] text-cobalt mb-1 aura-text-glow">Fuel_Registry</h2></div>
        <div className="text-[10px] font-black text-white">{nutrition.reduce((s, n) => s + n.calories, 0)} <span className="opacity-30">KCAL</span></div>
      </div>

      <button onClick={startScanner} className="w-full py-10 aura-button-aperture text-black font-black uppercase tracking-[0.6em] flex flex-col items-center justify-center gap-4 rounded-3xl">
        <div className="w-12 h-12 border-4 border-black/10 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-black/20 rounded-full bg-black/5" /></div>
        <span className="text-xs">Launch Camera Scan</span>
      </button>

      {/* MANUAL INPUT */}
      <div className="aura-card p-5 rounded-2xl border-l-4 border-cobalt">
         <div className="text-[9px] font-black text-white/40 uppercase mb-4 tracking-widest"><Edit3 size={12} className="inline mr-2"/> Manual Entry</div>
         <div className="space-y-3">
            <input value={manualName} onChange={e=>setManualName(e.target.value)} placeholder="Food Name" className="w-full bg-white/5 border border-white/10 p-3 text-[10px] uppercase font-black text-white outline-none rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
               <input type="number" value={manualCal} onChange={e=>setManualCal(e.target.value)} placeholder="Calories" className="w-full bg-white/5 border border-white/10 p-3 text-[10px] uppercase font-black text-white outline-none rounded-lg" />
               <input type="number" value={manualProt} onChange={e=>setManualProt(e.target.value)} placeholder="Protein (g)" className="w-full bg-white/5 border border-white/10 p-3 text-[10px] uppercase font-black text-white outline-none rounded-lg" />
            </div>
            <button onClick={manualLog} className="w-full py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest active:bg-cobalt active:text-black rounded-lg">Upload Fuel Node</button>
         </div>
      </div>

      <MealNotes />

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center"><div className="w-72 h-72 border border-white/10 relative"><div className="absolute inset-x-0 h-1 bg-cobalt aura-gradient-blue animate-scan" /></div></div>
            {identifiedItems.length > 0 && (
               <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 aura-card p-8 rounded-t-[2.5rem] border-t-2 border-cobalt">
                  <h3 className="text-xl font-black italic text-white uppercase mb-6 text-center">Nodes Detected</h3>
                  <div className="flex gap-2"><button onClick={() => { identifiedItems.forEach(i => addNutrition({ name: i.name, calories: i.cal, protein: i.p, carbs: 0, fats: 0, verified: true })); stopScanner(); }} className="flex-1 py-4 aura-button-aperture text-black font-black uppercase text-xs rounded-xl">Authorize</button><button onClick={stopScanner} className="px-6 bg-white/5 text-white/40 rounded-xl"><X /></button></div>
               </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
