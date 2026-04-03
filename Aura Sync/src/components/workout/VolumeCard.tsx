import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus, Trash2, Check, Award, Calculator } from 'lucide-react';
import type { ExerciseCard } from '../../types';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { calculateOverload } from '../../engine/overload';
import { calculatePlates, formatPlates, getPlateColor } from '../../engine/plateCalc';
import { EQUIPMENT_LABELS, EQUIPMENT_COLORS } from '../../data/workoutRegistry';
import { hapticSetComplete, hapticPR } from '../../services/haptics';

interface Props {
  card: ExerciseCard;
}

export default function VolumeCard({ card }: Props) {
  const { addSet, removeSet, updateSet, completeSet, startRest, history } = useWorkoutStore();
  const [expanded, setExpanded] = useState(true);
  const [showPlates, setShowPlates] = useState<string | null>(null);
  const removeExercise = useWorkoutStore(s => s.removeExercise);

  const completedSets = card.sets.filter(s => s.completed);
  const totalVol = completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  // Ghost overlay — what did they do last time?
  const lastSession = [...history]
    .filter(h => h.exerciseId === card.exercise.id)
    .sort((a, b) => b.date - a.date)[0];

  // Overload suggestion
  const overload = calculateOverload(card.exercise.id, history, card.exercise.defaultReps);

  const handleComplete = (setId: string) => {
    const setData = card.sets.find(s => s.id === setId);
    if (!setData || setData.completed) return;

    completeSet(card.id, setId);
    startRest(90);

    if (setData.isPR) {
      hapticPR();
    } else {
      hapticSetComplete();
    }
  };

  const isBarbell = card.exercise.equipment === 'barbell' || card.exercise.equipment === 'plate_loaded';
  const eqColor = EQUIPMENT_COLORS[card.exercise.equipment] || '#3b82f6';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="glass"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 min-h-[56px]"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{card.exercise.name}</h3>
            {completedSets.some(s => s.isPR) && (
              <Award className="w-4 h-4 text-magenta animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5"
              style={{ backgroundColor: `${eqColor}20`, color: eqColor, border: `1px solid ${eqColor}40` }}
            >
              {EQUIPMENT_LABELS[card.exercise.equipment]}
            </span>
            <span className="text-[10px] text-white/30">
              {completedSets.length}/{card.sets.length} sets · {totalVol.toLocaleString()} lbs
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Ghost Overlay — last session data */}
      {lastSession && (
        <div className="px-4 pb-2 -mt-1">
          <div className="text-[10px] text-white/20 italic">
            Ghost: {lastSession.sets.map((s, i) =>
              `${s.weight}×${s.reps}${i < lastSession.sets.length - 1 ? ', ' : ''}`
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Overload suggestion */}
            {overload.lastBest && overload.delta !== 0 && (
              <div className="mx-4 mb-3 p-2 border border-white/5" style={{
                backgroundColor: overload.delta > 0 ? 'rgba(229, 53, 171, 0.05)' : 'rgba(249, 115, 22, 0.05)',
              }}>
                <div className="text-[10px] uppercase tracking-wider" style={{
                  color: overload.delta > 0 ? '#e535ab' : '#f97316',
                }}>
                  {overload.delta > 0 ? '↑ Progressive Overload' : '↓ Deload Suggested'}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  Try {overload.suggestedWeight} lbs × {overload.suggestedReps} reps
                  ({overload.delta > 0 ? '+' : ''}{overload.delta}% from last)
                </div>
              </div>
            )}

            {/* Sets */}
            <div className="px-4 pb-3 space-y-2">
              {card.sets.map((s, idx) => (
                <motion.div
                  key={s.id}
                  layout
                  className={`flex items-center gap-2 p-2 ${
                    s.completed ? 'bg-white/[0.02]' : 'bg-white/[0.04]'
                  }`}
                >
                  {/* Set number */}
                  <span className="text-[10px] text-white/25 w-5 shrink-0 text-center">
                    {idx + 1}
                  </span>

                  {/* Weight control — BIG buttons for sweaty fingers */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateSet(card.id, s.id, 'weight', s.weight - 5)}
                      disabled={s.completed}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 active:bg-white/10 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4 text-white/50" />
                    </button>
                    <div className="w-16 text-center">
                      <div className="text-lg font-black text-cobalt-bright">{s.weight}</div>
                      <div className="text-[8px] text-white/20 uppercase">lbs</div>
                    </div>
                    <button
                      onClick={() => updateSet(card.id, s.id, 'weight', s.weight + 5)}
                      disabled={s.completed}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 active:bg-white/10 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4 text-white/50" />
                    </button>
                  </div>

                  <span className="text-white/15 text-xs">×</span>

                  {/* Reps control — BIG buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateSet(card.id, s.id, 'reps', s.reps - 1)}
                      disabled={s.completed}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 active:bg-white/10 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4 text-white/50" />
                    </button>
                    <div className="w-10 text-center">
                      <div className="text-lg font-black text-cobalt-bright">{s.reps}</div>
                      <div className="text-[8px] text-white/20 uppercase">reps</div>
                    </div>
                    <button
                      onClick={() => updateSet(card.id, s.id, 'reps', s.reps + 1)}
                      disabled={s.completed}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 active:bg-white/10 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4 text-white/50" />
                    </button>
                  </div>

                  {/* Complete button */}
                  <button
                    onClick={() => handleComplete(s.id)}
                    disabled={s.completed}
                    className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                      s.completed
                        ? s.isPR ? 'bg-magenta/20' : 'bg-cobalt/20'
                        : 'bg-cobalt active:bg-cobalt-bright'
                    }`}
                  >
                    {s.completed ? (
                      s.isPR ? <Award className="w-5 h-5 text-magenta" /> : <Check className="w-5 h-5 text-cobalt-bright" />
                    ) : (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Plate calc for barbell exercises */}
            {isBarbell && card.sets.length > 0 && (
              <AnimatePresence>
                {showPlates && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden px-4 pb-3"
                  >
                    {(() => {
                      const s = card.sets.find(s => s.id === showPlates);
                      if (!s) return null;
                      const breakdown = calculatePlates(s.weight);
                      return (
                        <div className="p-3 bg-white/[0.03] border border-white/5">
                          <div className="text-[10px] text-white/30 mb-2">{formatPlates(breakdown)}</div>
                          <div className="flex items-center gap-1.5">
                            {breakdown.perSide.map(p => (
                              Array.from({ length: p.count }).map((_, i) => (
                                <div
                                  key={`${p.plate}-${i}`}
                                  className="flex items-center justify-center text-[9px] font-bold text-black"
                                  style={{
                                    backgroundColor: getPlateColor(p.plate),
                                    width: Math.max(20, p.plate * 0.6),
                                    height: 28,
                                  }}
                                >
                                  {p.plate}
                                </div>
                              ))
                            ))}
                            <div className="w-2 h-3 bg-white/20" />
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Bottom actions */}
            <div className="flex items-center gap-2 px-4 pb-4">
              <button
                onClick={() => addSet(card.id)}
                className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 bg-white/5 active:bg-white/10 text-xs text-white/50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Set
              </button>
              {card.sets.length > 1 && (
                <button
                  onClick={() => {
                    const lastSet = card.sets[card.sets.length - 1];
                    if (lastSet && !lastSet.completed) removeSet(card.id, lastSet.id);
                  }}
                  className="min-h-[48px] px-4 flex items-center justify-center bg-white/5 active:bg-white/10 text-xs text-white/30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              )}
              {isBarbell && (
                <button
                  onClick={() => setShowPlates(showPlates ? null : card.sets[0]?.id ?? null)}
                  className="min-h-[48px] px-4 flex items-center justify-center bg-white/5 active:bg-white/10 text-xs text-cobalt/60"
                >
                  <Calculator className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => removeExercise(card.id)}
                className="min-h-[48px] px-4 flex items-center justify-center bg-white/5 active:bg-white/10 text-xs text-red-500/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
