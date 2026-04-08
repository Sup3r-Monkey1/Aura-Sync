import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Target } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import MealNotes from './MealNotes';

const SCANNED_ITEMS = [
  { id: 1, name: 'Prime Beef Fillet', cal: 350, p: 45 },
  { id: 2, name: 'Whey Isolate', cal: 140, p: 30 },
  { id: 3, name: 'Jasmine Rice', cal: 210, p: 4 },
  { id: 4, name: 'Organic Avocado', cal: 160, p: 2 },
];

export default function FuelVision() {
  const { addNutrition, nutrition } = useWorkoutStore();
  const [scanning, setScanning] = useState(false);
  const [identifiedItems, setIdentifiedItems] = useState<typeof SCANNED_ITEMS>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = useCallback(async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        setIdentifiedItems([...SCANNED_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 3));
      }, 2500);
    } catch (e) { setScanning(false); }
  }, []);

  const confirmLogAll = () => {
    identifiedItems.forEach(item => addNutrition({ name: item.name, calories: item.cal, protein: item.p, carbs: 0, fats: 0, verified: true }));
    stopScanner();
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false);
    setIdentifiedItems([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 space-y-6">
      <div className="px-4 flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-cobalt mb-1">Fuel_Analysis</h2>
          <p className="text-[9px] text-white/20 font-mono italic uppercase">Mode: Multi_Node_Scan</p>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-black text-white aura-text-glow">{nutrition.reduce((s, n) => s + n.calories, 0)} <span className="opacity-30">KCAL</span></div>
        </div>
      </div>

      <div className="px-4">
        <button onClick={startScanner} className="w-full py-10 aura-button-aperture text-black font-black uppercase tracking-[0.6em] flex flex-col items-center justify-center gap-4 rounded-[2rem]">
          <div className="w-12 h-12 border-4 border-black/20 rounded-full flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-black/40 rounded-full bg-black/10" />
          </div>
          <span className="text-xs">Snap Matrix</span>
        </button>
      </div>

      <MealNotes />

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            
            <div className="absolute inset-0">
               {identifiedItems.length === 0 ? (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-72 h-72 border border-white/20 relative">
                       <div className="absolute inset-x-0 h-1 bg-cobalt aura-gradient-blue animate-scan" />
                    </div>
                 </div>
               ) : (
                 identifiedItems.map((item, idx) => (
                   <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute p-4 border border-cobalt bg-black/60 backdrop-blur-md" style={{ top: `${25 + idx * 15}%`, left: `${10 + idx * 10}%` }}>
                      <div className="flex items-center gap-2 text-[9px] font-black text-cobalt uppercase mb-1"><Target size={10}/> Detected_Node_{idx+1}</div>
                      <div className="text-[11px] font-black text-white uppercase">{item.name}</div>
                   </motion.div>
                 ))
               )}
            </div>

            {identifiedItems.length > 0 && (
               <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 aura-card-strong p-8 rounded-t-[3rem] border-t-2 border-cobalt/40">
                  <div className="text-[10px] font-black text-cobalt uppercase tracking-[0.5em] mb-6 text-center">Scan_Success</div>
                  <div className="space-y-3 mb-8">
                     {identifiedItems.map(item => (
                       <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5 font-mono">
                          <span className="text-xs font-bold text-white/60">{item.name}</span>
                          <span className="text-xs text-magenta font-black">{item.p}G P</span>
                       </div>
                     ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={confirmLogAll} className="flex-1 py-4 aura-button-aperture text-black font-black uppercase text-xs tracking-widest rounded-xl">Authorize Log</button>
                    <button onClick={stopScanner} className="px-6 bg-white/5 text-white/40"><X /></button>
                  </div>
               </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
