import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Zap, Flame } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import MealNotes from './MealNotes';

export default function FuelVision() {
  const { addNutrition } = useWorkoutStore();
  const [scanning, setScanning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = useCallback(async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // Simulate AI recognition delay
      setTimeout(() => setShowConfirm(true), 2000);
    } catch (e) {
      console.error("Camera access denied");
      setScanning(false);
    }
  }, []);

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setScanning(false);
    setShowConfirm(false);
  };

  const logMockFood = () => {
    addNutrition({ name: "AI Scanned Meal", calories: 450, protein: 35, carbs: 40, fats: 12, verified: true });
    stopScanner();
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pt-12 pb-24 space-y-6">
      <div className="px-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Fuel Vision AI</h2>
        <p className="text-[10px] text-white/20 mt-1 uppercase">Nutritional Intelligence</p>
      </div>

      <div className="px-4">
        <button onClick={startScanner} className="w-full py-6 bg-cobalt text-black font-black uppercase tracking-widest glow-cobalt flex items-center justify-center gap-3 text-sm">
          <Camera size={20} /> Snap to Log
        </button>
      </div>

      <MealNotes />

      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            
            {/* Scan Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 border border-cobalt/40 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cobalt" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cobalt" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cobalt" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cobalt" />
                  <div className="absolute inset-x-0 h-0.5 bg-cobalt/50 animate-scan shadow-[0_0_15px_#2563eb]" />
               </div>
            </div>

            <AnimatePresence>
              {showConfirm && (
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 glass-strong p-6 text-center">
                  <div className="text-cobalt font-black uppercase tracking-widest mb-4">Protein Detected: ~35g</div>
                  <div className="flex gap-2">
                    <button onClick={logMockFood} className="flex-1 bg-cobalt text-black py-4 font-black uppercase text-xs">Confirm Log</button>
                    <button onClick={stopScanner} className="px-6 bg-white/5 text-white/40"><X /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
