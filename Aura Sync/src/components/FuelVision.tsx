import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Utensils, Flame, Zap } from 'lucide-react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const MOCK_FOODS = [
  { name: 'Grilled Chicken Breast', calories: 284, protein: 53, carbs: 0, fats: 6 },
  { name: 'Brown Rice Bowl', calories: 216, protein: 5, carbs: 45, fats: 2 },
  { name: 'Protein Shake', calories: 320, protein: 48, carbs: 12, fats: 8 },
  { name: 'Salmon Fillet', calories: 367, protein: 34, carbs: 0, fats: 22 },
  { name: 'Greek Yogurt', calories: 130, protein: 17, carbs: 6, fats: 4 },
  { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fats: 0 },
  { name: 'Egg Whites (6)', calories: 102, protein: 21, carbs: 1, fats: 0 },
  { name: 'Steak 8oz', calories: 450, protein: 52, carbs: 0, fats: 26 },
];

export default function FuelVision() {
  const { nutrition, addNutrition } = useWorkoutStore();
  const [scanning, setScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<typeof MOCK_FOODS[0] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Today's totals
  const today = new Date().setHours(0, 0, 0, 0);
  const todayEntries = nutrition.filter(n => n.timestamp >= today);
  const totals = todayEntries.reduce(
    (acc, n) => ({ cal: acc.cal + n.calories, p: acc.p + n.protein, c: acc.c + n.carbs, f: acc.f + n.fats }),
    { cal: 0, p: 0, c: 0, f: 0 }
  );

  // Net-Burn ring
  const burnedCals = 420 + Math.floor(Math.random() * 80); // simulated from watch
  const consumedCals = totals.cal;
  const dailyGoal = 2200;
  const netBurn = burnedCals - consumedCals;
  const ringProgress = Math.min(1, consumedCals / dailyGoal);

  // Start camera with back-facing camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);

      // Simulate AI scan after 2.5 seconds
      setTimeout(() => {
        const food = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
        setScannedFood(food);
        setShowConfirm(true);
      }, 2500);
    } catch {
      // Camera not available — use mock mode
      setScanning(true);
      setTimeout(() => {
        const food = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
        setScannedFood(food);
        setShowConfirm(true);
      }, 1500);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setShowConfirm(false);
    setScannedFood(null);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const confirmScan = () => {
    if (scannedFood) {
      addNutrition({
        name: scannedFood.name,
        calories: scannedFood.calories,
        protein: scannedFood.protein,
        carbs: scannedFood.carbs,
        fats: scannedFood.fats,
        verified: scannedFood.protein >= 25,
      });
    }
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      <div className="px-4 pt-12 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Fuel Vision AI</h2>
        <p className="text-[10px] text-white/25 mt-1">Nutritional intelligence system</p>
      </div>

      {/* Net-Burn Ring */}
      <div className="px-4 mb-4">
        <div className="glass p-5">
          <div className="flex items-center gap-6">
            {/* Ring */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff06" strokeWidth="5" />
                {/* Consumed ring */}
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="butt"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - ringProgress) }}
                  transition={{ duration: 1 }}
                />
                {/* Burned ring (inner) */}
                <circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff06" strokeWidth="3" />
                <motion.circle
                  cx="50" cy="50" r="34" fill="none"
                  stroke="#00ff88"
                  strokeWidth="3"
                  strokeLinecap="butt"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - burnedCals / dailyGoal) }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-cobalt">{consumedCals}</span>
                <span className="text-[8px] text-white/25">/ {dailyGoal}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Consumed</span>
                <span className="text-cobalt font-bold">{consumedCals} cal</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Burned</span>
                <span className="text-[#00ff88] font-bold">{burnedCals} cal</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-white/40">Net</span>
                <span className={`font-bold ${netBurn > 0 ? 'text-[#00ff88]' : 'text-orange-400'}`}>
                  {netBurn > 0 ? '+' : ''}{netBurn} cal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Totals */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Protein', value: totals.p, unit: 'g', color: '#e535ab', target: 180 },
          { label: 'Carbs', value: totals.c, unit: 'g', color: '#3b82f6', target: 250 },
          { label: 'Fats', value: totals.f, unit: 'g', color: '#f59e0b', target: 70 },
        ].map(m => (
          <div key={m.label} className="glass p-3 text-center">
            <div className="text-lg font-bold" style={{ color: m.color }}>{m.value}{m.unit}</div>
            <div className="text-[9px] text-white/25 uppercase">{m.label}</div>
            <div className="h-1 bg-white/5 mt-2 overflow-hidden">
              <div className="h-full" style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%`, backgroundColor: m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Scan Button */}
      <div className="px-4 mb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={startCamera}
          className="w-full min-h-[56px] bg-cobalt text-white font-bold text-sm uppercase tracking-widest glow-cobalt flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" /> Snap to Log
        </motion.button>
      </div>

      {/* Today's Log */}
      <div className="px-4">
        <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Today's Fuel</h3>
        {todayEntries.length === 0 ? (
          <div className="glass p-6 text-center text-white/15 text-xs">
            <Utensils className="w-6 h-6 mx-auto mb-2 opacity-30" />
            No meals logged yet
          </div>
        ) : (
          <div className="space-y-1.5">
            {todayEntries.map(entry => (
              <div key={entry.id} className="glass p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/70 flex items-center gap-1.5">
                    {entry.name}
                    {entry.verified && <Zap className="w-3 h-3 text-magenta" />}
                  </div>
                  <div className="text-[10px] text-white/25 mt-0.5">
                    P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fats}g
                  </div>
                </div>
                <div className="text-xs font-bold text-cobalt">{entry.calories}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Camera Scanner Overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Video feed */}
            <div className="relative flex-1 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-cobalt/30 relative">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cobalt" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cobalt" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cobalt" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cobalt" />

                  {/* Scan line */}
                  {!showConfirm && (
                    <div className="absolute left-0 right-0 h-0.5 bg-cobalt animate-scan" style={{
                      boxShadow: '0 0 12px #2563eb',
                    }} />
                  )}
                </div>
              </div>

              {/* HUD Macro Overlay when food detected */}
              <AnimatePresence>
                {showConfirm && scannedFood && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 glass-strong p-5"
                  >
                    <div className="text-sm font-bold text-cobalt mb-3">{scannedFood.name}</div>

                    {/* HUD-style macro display */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-black text-white">{scannedFood.calories}</div>
                        <div className="text-[9px] text-white/30 uppercase">Cal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-magenta">{scannedFood.protein}g</div>
                        <div className="text-[9px] text-white/30 uppercase">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-cobalt">{scannedFood.carbs}g</div>
                        <div className="text-[9px] text-white/30 uppercase">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-amber-400">{scannedFood.fats}g</div>
                        <div className="text-[9px] text-white/30 uppercase">Fats</div>
                      </div>
                    </div>

                    {scannedFood.protein >= 25 && (
                      <div className="mb-3 p-2 bg-magenta/10 border border-magenta/20 text-center">
                        <Flame className="w-4 h-4 text-magenta inline mr-1" />
                        <span className="text-[10px] text-magenta uppercase tracking-wider font-bold">
                          High-Protein Fuel Detected — +25 XP
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={confirmScan}
                        className="flex-1 min-h-[52px] bg-cobalt text-white font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" /> Confirm
                      </button>
                      <button
                        onClick={stopCamera}
                        className="min-h-[52px] px-6 bg-white/5 text-white/40 text-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close button */}
              <button
                onClick={stopCamera}
                className="absolute top-12 right-4 w-12 h-12 flex items-center justify-center bg-black/50"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
