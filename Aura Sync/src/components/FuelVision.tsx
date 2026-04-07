import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Zap, Flame, Utensils, Target } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import MealNotes from './MealNotes';

const SCANNED_ITEMS = [
  { id: 1, name: 'Premium Grilled Chicken', cal: 280, p: 52, c: 0, f: 6 },
  { id: 2, name: 'Steamed Jasmine Rice', cal: 210, p: 4, c: 45, f: 1 },
  { id: 3, name: 'Organic Avocado', cal: 160, p: 2, c: 8, f: 15 },
  { id: 4, name: 'Prime Beef Fillet', cal: 350, p: 45, c: 0, f: 18 },
  { id: 5, name: 'Whey Isolate Shake', cal: 140, p: 30, c: 2, f: 1 },
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
      
      // AI SIMULATION: Detect 3 items across the plate
      setTimeout(() => {
        const results = [...SCANNED_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 3);
        setIdentifiedItems(results);
      }, 3000);
    } catch (e) { setScanning(false); }
  }, []);

  const confirmLogAll = () => {
    identifiedItems.forEach(item => {
      addNutrition({ name: item.name, calories: item.cal, protein: item.p, carbs: item.c, fats: item.f, verified: true });
    });
    stopScanner();
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false);
    setIdentifiedItems([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 space-y-6">
      <div className="px-4 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cobalt mb-1">Fuel_Analysis_HUD</h2>
          <p className="text-[9px] text-white/20 font-mono">Sensors: Active_Multi_Scan</p>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-black text-white/80">{nutrition.reduce((s, n) => s + n.calories, 0)} <span className="opacity-30">KCAL</span></div>
        </div>
      </div>

      <div className="px-4">
        <button onClick={startScanner} className="w-full py-8 bg-cobalt text-black font-black uppercase tracking-[0.5em] glow-cobalt flex items-center justify-center gap-3 text-sm rounded-xl">
          <Camera size={24} /> Snap Matrix
        </button>
      </div>

      <MealNotes />

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            
            {/* Multi-Target Scan Animation */}
            <div className="absolute inset-0">
               {identifiedItems.length === 0 ? (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border border-white/10 relative overflow-hidden">
                       <div className="absolute inset-x-0 h-1 bg-cobalt/50 animate-scan" />
                    </div>
                 </div>
               ) : (
                 identifiedItems.map((item, idx) => (
                   <motion.div 
                    key={item.id} 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute p-4 border-2 border-cobalt bg-black/40 backdrop-blur-md"
                    style={{ top: `${20 + idx * 20}%`, left: `${15 + idx * 10}%` }}
                   >
                      <div className="flex items-center gap-2 text-[10px] font-black text-cobalt uppercase mb-1">
                        <Target size={12}/> Node_{idx+1}
                      </div>
                      <div className="text-xs font-bold text-white uppercase">{item.name}</div>
                   </motion.div>
                 ))
               )}
            </div>

            {identifiedItems.length > 0 && (
               <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 glass-strong p-8 border-t border-cobalt/40 rounded-t-3xl">
                  <div className="text-[10px] font-black text-cobalt uppercase tracking-[0.4em] mb-4 text-center">Multi_Target_Detection_Success</div>
                  <div className="space-y-2 mb-8">
                     {identifiedItems.map(item => (
                       <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs font-bold text-white/80">{item.name}</span>
                          <span className="text-xs text-magenta font-black">{item.p}g P</span>
                       </div>
                     ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={confirmLogAll} className="flex-1 bg-cobalt text-black py-4 font-black uppercase text-xs tracking-widest rounded-lg">Authorize Multi-Log</button>
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
