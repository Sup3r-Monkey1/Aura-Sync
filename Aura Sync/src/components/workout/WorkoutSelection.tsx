import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { Exercise, Category, EquipmentType } from '../../types';
import { workoutRegistry, CATEGORIES, EQUIPMENT_LABELS, EQUIPMENT_COLORS } from '../../data/workoutRegistry';
import { searchExercises, groupByCategory } from '../../engine/searchUtils';

interface Props {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  addedIds: string[];
}

export default function WorkoutSelection({ onSelect, onClose, addedIds }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [equipment, setEquipment] = useState<EquipmentType | 'all'>('all');

  const results = useMemo(() => {
    return searchExercises(workoutRegistry, { query, category, equipment });
  }, [query, category, equipment]);

  const grouped = useMemo(() => groupByCategory(results), [results]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505]/95 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">Exercise Library</h2>
        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center">
          <X className="w-5 h-5 text-white/50" />
        </button>
      </div>

      {/* Tactical Glass Search Bar */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 glass px-3 focus-within:glow-cobalt transition-shadow">
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search exercises... (typos ok)"
            autoFocus
            className="flex-1 bg-transparent text-sm text-white py-3.5 outline-none placeholder:text-white/20"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1">
              <X className="w-3.5 h-3.5 text-white/30" />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 mb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 px-3 py-2 text-[10px] uppercase tracking-wider ${
            category === 'all' ? 'bg-cobalt text-white' : 'bg-white/5 text-white/40'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? 'all' : cat)}
            className={`shrink-0 px-3 py-2 text-[10px] uppercase tracking-wider ${
              category === cat ? 'bg-cobalt text-white' : 'bg-white/5 text-white/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Equipment chips */}
      <div className="px-4 mb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {(['all', 'barbell', 'dumbbell', 'machine', 'cable', 'plate_loaded', 'bodyweight'] as const).map(eq => (
          <button
            key={eq}
            onClick={() => setEquipment(eq === equipment ? 'all' : eq)}
            className="shrink-0 px-3 py-1.5 text-[9px] uppercase tracking-wider"
            style={{
              backgroundColor: equipment === eq
                ? `${eq === 'all' ? '#3b82f6' : EQUIPMENT_COLORS[eq]}30`
                : 'rgba(255,255,255,0.03)',
              color: equipment === eq
                ? (eq === 'all' ? '#3b82f6' : EQUIPMENT_COLORS[eq])
                : 'rgba(255,255,255,0.3)',
              border: `1px solid ${equipment === eq
                ? `${eq === 'all' ? '#3b82f6' : EQUIPMENT_COLORS[eq]}40`
                : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            {eq === 'all' ? 'All' : EQUIPMENT_LABELS[eq]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-20">
        <div className="text-[10px] text-white/20 mb-2 uppercase tracking-wider">
          {results.length} exercise{results.length !== 1 ? 's' : ''} found
        </div>

        <AnimatePresence mode="popLayout">
          {Object.entries(grouped).map(([cat, exercises]) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <div className="text-[10px] uppercase tracking-[0.15em] text-cobalt/60 mb-1.5 font-bold">
                {cat}
              </div>
              {exercises.map(ex => {
                const isAdded = addedIds.includes(ex.id);
                return (
                  <motion.button
                    key={ex.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => !isAdded && onSelect(ex)}
                    disabled={isAdded}
                    className={`w-full text-left flex items-center gap-3 p-3 mb-1 min-h-[56px] ${
                      isAdded ? 'opacity-30' : 'bg-white/[0.02] active:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-xs text-white/80">{ex.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[8px] uppercase tracking-wider px-1 py-0.5"
                          style={{
                            color: EQUIPMENT_COLORS[ex.equipment],
                            backgroundColor: `${EQUIPMENT_COLORS[ex.equipment]}15`,
                          }}
                        >
                          {EQUIPMENT_LABELS[ex.equipment]}
                        </span>
                        <span className="text-[9px] text-white/20">
                          {ex.mechanics === 'compound' ? 'Compound' : 'Isolation'}
                        </span>
                        <span className="text-[9px] text-white/15">
                          {ex.primaryMuscles.length > 0 && ex.primaryMuscles.join(', ').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    {isAdded && (
                      <span className="text-[9px] text-cobalt/40 uppercase">Added</span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="text-center py-12 text-white/20 text-sm">
            No exercises found for "{query}"
          </div>
        )}
      </div>
    </motion.div>
  );
}
