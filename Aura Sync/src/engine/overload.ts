import type { OverloadSuggestion, SessionHistory } from '../types';

/**
 * Progressive Overload Algorithm
 *
 * Analyzes the last 3 sessions for a given exercise and returns
 * an exact weight/rep suggestion for the next session.
 *
 * Rules:
 *  1. If the lifter hit target reps on ALL sets in the last session → +2.5% weight
 *  2. If they hit target reps for 2 consecutive sessions → +5% weight
 *  3. If they FAILED to hit target reps for 2 sessions → deload -10%
 *  4. Otherwise, keep the same weight and aim for +1 rep
 */

const INCREMENT_SMALL = 0.025; // 2.5%
const INCREMENT_BIG   = 0.05;  // 5%
const DELOAD_FACTOR   = 0.10;  // 10%
const ROUND_TO        = 2.5;   // round weights to nearest 2.5 lbs

function roundWeight(w: number): number {
  return Math.round(w / ROUND_TO) * ROUND_TO;
}

export function calculateOverload(
  exerciseId: string,
  history: SessionHistory[],
  targetReps: number = 10
): OverloadSuggestion {
  // Sort by date descending, take last 3
  const sorted = [...history]
    .filter(h => h.exerciseId === exerciseId)
    .sort((a, b) => b.date - a.date)
    .slice(0, 3);

  if (sorted.length === 0) {
    return {
      exerciseId,
      suggestedWeight: 0,
      suggestedReps: targetReps,
      delta: 0,
      confidence: 0,
      lastBest: null,
    };
  }

  // Best set from most recent session
  const latest = sorted[0];
  const bestSet = latest.sets.reduce(
    (best, s) => (s.weight * s.reps > best.weight * best.reps ? s : best),
    latest.sets[0]
  );

  // Did they hit target reps on every set?
  const hitAllReps = (session: SessionHistory) =>
    session.sets.every(s => s.reps >= targetReps);

  const latestHit = hitAllReps(sorted[0]);
  const prevHit = sorted.length >= 2 ? hitAllReps(sorted[1]) : false;
  const latestFailed = !latestHit;
  const prevFailed = sorted.length >= 2 ? !hitAllReps(sorted[1]) : false;

  let suggestedWeight = bestSet.weight;
  let suggestedReps = targetReps;
  let delta = 0;
  let confidence = 50;

  if (latestHit && prevHit) {
    // Two consecutive successes → big jump
    delta = INCREMENT_BIG;
    suggestedWeight = roundWeight(bestSet.weight * (1 + delta));
    confidence = 85;
  } else if (latestHit) {
    // One success → small jump
    delta = INCREMENT_SMALL;
    suggestedWeight = roundWeight(bestSet.weight * (1 + delta));
    confidence = 75;
  } else if (latestFailed && prevFailed) {
    // Two consecutive failures → deload
    delta = -DELOAD_FACTOR;
    suggestedWeight = roundWeight(bestSet.weight * (1 - DELOAD_FACTOR));
    suggestedReps = targetReps;
    confidence = 90;
  } else {
    // Keep weight, try for one more rep
    suggestedWeight = bestSet.weight;
    suggestedReps = Math.min(bestSet.reps + 1, targetReps + 4);
    delta = 0;
    confidence = 60;
  }

  // Minimum weight floor
  suggestedWeight = Math.max(suggestedWeight, ROUND_TO);

  return {
    exerciseId,
    suggestedWeight,
    suggestedReps,
    delta: Math.round(delta * 1000) / 10, // as percentage
    confidence,
    lastBest: { weight: bestSet.weight, reps: bestSet.reps },
  };
}

/** Check if a given set is a Personal Record relative to history */
export function isPR(
  exerciseId: string,
  weight: number,
  reps: number,
  history: SessionHistory[]
): boolean {
  const volume = weight * reps;
  const past = history.filter(h => h.exerciseId === exerciseId);
  for (const session of past) {
    for (const s of session.sets) {
      if (s.weight * s.reps >= volume) return false;
    }
  }
  return past.length > 0 && volume > 0;
}
