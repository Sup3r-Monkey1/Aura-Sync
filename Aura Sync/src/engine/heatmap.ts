import type { MuscleGroup, MuscleHeat, Exercise } from '../types';

/**
 * Biomechanical Heatmap Engine
 *
 * Tracks "heat" (0-100) per muscle group. Heat increases when exercises
 * targeting that muscle are logged, and decays over time using an
 * exponential half-life model.
 *
 * Decay formula:  heat(t) = heat_0 × e^(-λt)
 *   where λ = ln(2) / HALF_LIFE_HOURS
 *   and t = hours since last update
 */

const HALF_LIFE_HOURS = 18; // heat drops to 50% after 18 hours
const LAMBDA = Math.LN2 / HALF_LIFE_HOURS;

const PRIMARY_HEAT_PER_SET = 8;
const SECONDARY_HEAT_PER_SET = 3;
const MAX_HEAT = 100;

export const ALL_MUSCLES: MuscleGroup[] = [
  'chest', 'upper_back', 'lats', 'traps',
  'front_delts', 'side_delts', 'rear_delts',
  'biceps', 'triceps', 'forearms',
  'quads', 'hamstrings', 'glutes', 'calves',
  'core', 'lower_back', 'hip_flexors',
];

/** Create a fresh heatmap with all muscles at 0 */
export function createEmptyHeatmap(): MuscleHeat[] {
  const now = Date.now();
  return ALL_MUSCLES.map(group => ({ group, heat: 0, lastUpdated: now }));
}

/** Apply time-based exponential decay to a heatmap */
export function applyDecay(heatmap: MuscleHeat[]): MuscleHeat[] {
  const now = Date.now();
  return heatmap.map(mh => {
    const hoursElapsed = (now - mh.lastUpdated) / (1000 * 60 * 60);
    const decayedHeat = mh.heat * Math.exp(-LAMBDA * hoursElapsed);
    return {
      ...mh,
      heat: Math.max(0, Math.round(decayedHeat * 10) / 10),
      lastUpdated: now,
    };
  });
}

/** Add heat from completing a set of a given exercise */
export function addHeatFromExercise(
  heatmap: MuscleHeat[],
  exercise: Exercise,
  setsCompleted: number = 1
): MuscleHeat[] {
  const now = Date.now();
  // First apply decay so we're working from current values
  const decayed = applyDecay(heatmap);

  return decayed.map(mh => {
    let addedHeat = 0;
    if (exercise.primaryMuscles.includes(mh.group)) {
      addedHeat = PRIMARY_HEAT_PER_SET * setsCompleted;
    } else if (exercise.secondaryMuscles.includes(mh.group)) {
      addedHeat = SECONDARY_HEAT_PER_SET * setsCompleted;
    }
    return {
      ...mh,
      heat: Math.min(MAX_HEAT, mh.heat + addedHeat),
      lastUpdated: now,
    };
  });
}

/** Get the heat level label */
export function getHeatLevel(heat: number): 'cold' | 'warm' | 'hot' | 'overloaded' {
  if (heat < 15) return 'cold';
  if (heat < 45) return 'warm';
  if (heat < 75) return 'hot';
  return 'overloaded';
}

/** Get color for a heat value */
export function getHeatColor(heat: number): string {
  if (heat < 15) return '#1e3a5f';   // cold blue
  if (heat < 45) return '#2563eb';   // warm cobalt
  if (heat < 75) return '#f97316';   // hot orange
  return '#ef4444';                  // overloaded red
}

/** Get overall fatigue score (average of all muscles) */
export function getOverallFatigue(heatmap: MuscleHeat[]): number {
  const decayed = applyDecay(heatmap);
  const total = decayed.reduce((sum, mh) => sum + mh.heat, 0);
  return Math.round(total / decayed.length);
}

/** Get top N most fatigued muscles */
export function getTopFatigued(heatmap: MuscleHeat[], n: number = 5): MuscleHeat[] {
  return applyDecay(heatmap)
    .sort((a, b) => b.heat - a.heat)
    .slice(0, n);
}

/** Pretty-print a muscle group name */
export function muscleName(group: MuscleGroup): string {
  const names: Record<MuscleGroup, string> = {
    chest: 'Chest', upper_back: 'Upper Back', lats: 'Lats', traps: 'Traps',
    front_delts: 'Front Delts', side_delts: 'Side Delts', rear_delts: 'Rear Delts',
    biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms',
    quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes', calves: 'Calves',
    core: 'Core', lower_back: 'Lower Back', hip_flexors: 'Hip Flexors',
  };
  return names[group];
}
