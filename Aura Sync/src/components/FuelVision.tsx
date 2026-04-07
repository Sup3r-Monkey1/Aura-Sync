import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Zap, Flame, Utensils } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import MealNotes from './MealNotes';

const SCANNED_ITEMS = [
  { name: 'Grilled Chicken Breast', cal: 320, p: 48, c: 0, f: 8 },
  { name: 'Whey Protein Shake', cal: 180, p: 30, c: 5, f: 2 },
  { name: 'Salmon Fillet', cal: 420, p: 38, c: 0, f: 18 },
  { name: 'Lean Beef & Rice', cal: 580, p: 42, c: 55, f: 12 },
  { name: 'Greek Yogurt Bowl', cal: 240, p: 24, c: 18, f: 4 },
];

export default function FuelVision() {
  const { addNutrition, nutrition } = useWorkoutStore();
  const [scanning, setScanning] = useState(false);
  const [identifiedItem, setIdentifiedItem] = useState<typeof SCANNED_ITEMS[0] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = useCallback(async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // AI SIMULATION: Pick a random food after 2 seconds
      setTimeout(() => {
        const food = SCANNED_ITEMS[Math.floor(Math.random() * SCANNED_ITEMS.length)];
        setIdentifiedItem(food);
      }, 2500);
    } catch (e) {
      setScanning(false);
    }
  }, []);

  const confirmLog = () => {
    if (identifiedItem) {
      addNutrition({ 
        name: identifiedItem.name, 
        calories: identifiedItem.cal, 
        protein: identifiedItem.p, 
        carbs: identifiedItem.c, 
        fats: identifiedItem.f, 
        verified: true 
      });
    }
    stopScanner();
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false);
    setIdentifiedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 space-y-6">
      <div className="px-4 flex justify-between items-end">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cobalt mb-1">Fuel_Vision_AI</h2>
          <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Status: Analysis_Standby</p>
        </div>
        <div className="text-right">
           <div className="text-[9px] text-white/20 uppercase font-mono mb-1">Daily_Cals</div>
           <div className="text-xl font-black italic text-glow-cobalt">{nutrition.reduce((s, n) => s + n.calories, 0)}</div>
        </div>
      </div>

      <div className="px-4">
        <button onClick={startScanner} className="w-full py-8 bg-cobalt text-black font-black uppercase tracking-[0.4em] glow-cobalt flex items-center justify-center gap-3 text-sm active:scale-95 transition-all">
          <Camera size={22} /> Snap to Log
        </button>
      </div>

      <div className="px-4"><MealNotes /></div>

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-70" />
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-72 h-72 border border-white/10 relative">
                  <div className="absolute inset-x-0 h-0.5 bg-cobalt animate-scan shadow-[0_0_20px_#2563eb]" />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cobalt" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cobalt" />
               </div>
            </div>

            {identifiedItem && (
               <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 glass-strong p-8 text-center border-t border-cobalt/30">
                  <div className="text-[10px] font-mono text-cobalt uppercase tracking-[0.5em] mb-2 animate-pulse">Item_Identified</div>
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-6">{identifiedItem.name}</h3>
                  
                  <div className="grid grid-cols-4 gap-2 mb-8">
                     <div className="bg-white/5 p-2 border-t border-white/10">
                        <div className="text-lg font-black">{identifiedItem.cal}</div>
                        <div className="text-[8px] text-white/30 uppercase">Cals</div>
                     </div>
                     <div className="bg-magenta/10 p-2 border-t border-magenta/30 text-magenta">
                        <div className="text-lg font-black">{identifiedItem.p}g</div>
                        <div className="text-[8px] uppercase font-black">Protein</div>
                     </div>
                     <div className="bg-white/5 p-2 border-t border-white/10 text-cobalt">
                        <div className="text-lg font-black">{identifiedItem.c}g</div>
                        <div className="text-[8px] uppercase">Carbs</div>
                     </div>
                     <div className="bg-white/5 p-2 border-t border-white/10 text-hazard">
                        <div className="text-lg font-black">{identifiedItem.f}g</div>
                        <div className="text-[8px] uppercase">Fats</div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={confirmLog} className="flex-1 bg-cobalt text-black py-4 font-black uppercase text-xs tracking-widest shadow-lg">Authorize Log</button>
                    <button onClick={stopScanner} className="px-6 bg-white/5 text-white/40"><X /></button>
                  </div>
               </motion.div>
            )}

            <button onClick={stopScanner} className="absolute top-12 right-6 p-4 text-white/20"><X size={32}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
