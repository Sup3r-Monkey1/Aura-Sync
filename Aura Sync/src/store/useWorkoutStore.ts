import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Exercise, ExerciseCard, WorkoutSession,
  SessionHistory, NutritionEntry, TerminalEvent,
  MuscleHeat, ReadinessScore,
} from '../types';
import { createEmptyHeatmap, addHeatFromExercise, applyDecay } from '../engine/heatmap';
import { calculateReadiness, simulateHRV, simulateSleep } from '../engine/readiness';
import { isPR } from '../engine/overload';

// ── Helpers ──────────────────────────────────────────────
let terminalCounter = 0;
function makeTerminalEvent(message: string, type: TerminalEvent['type'] = 'info'): TerminalEvent {
  return { id: `te-${Date.now()}-${terminalCounter++}`, timestamp: Date.now(), message, type };
}

function makeSetId(): string {
  return `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Store Shape ──────────────────────────────────────────
interface WorkoutState {
  // Active session
  session: WorkoutSession | null;
  isResting: boolean;
  restSeconds: number;

  // Persistent data
  history: SessionHistory[];
  muscleHeat: MuscleHeat[];
  nutrition: NutritionEntry[];
  readiness: ReadinessScore;
  terminal: TerminalEvent[];
  evolutionXP: number;
  totalWorkouts: number;
  watchConnected: boolean;

  // Actions — session
  startSession: () => void;
  endSession: () => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (cardId: string) => void;
  addSet: (cardId: string) => void;
  removeSet: (cardId: string, setId: string) => void;
  updateSet: (cardId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
  completeSet: (cardId: string, setId: string) => void;

  // Actions — rest timer
  startRest: (seconds: number) => void;
  stopRest: () => void;

  // Actions — nutrition
  addNutrition: (entry: Omit<NutritionEntry, 'id' | 'timestamp'>) => void;

  // Actions — system
  refreshReadiness: () => void;
  connectWatch: () => void;
  addTerminalEvent: (message: string, type?: TerminalEvent['type']) => void;
  decayHeatmap: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────
      session: null,
      isResting: false,
      restSeconds: 90,
      history: [],
      muscleHeat: createEmptyHeatmap(),
      nutrition: [],
      readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [makeTerminalEvent('AURA SYNC v2.0 initialized', 'system')],
      evolutionXP: 0,
      totalWorkouts: 0,
      watchConnected: false,

      // ── Session Actions ────────────────────────────────
      startSession: () => {
        const s: WorkoutSession = {
          id: `ws-${Date.now()}`,
          startedAt: Date.now(),
          cards: [],
        };
        set({
          session: s,
          terminal: [...get().terminal, makeTerminalEvent('Workout session initiated', 'system')],
        });
      },

      endSession: () => {
        const { session, history, terminal, totalWorkouts, evolutionXP } = get();
        if (!session) return;

        // Convert to history entries
        const newHistory: SessionHistory[] = [];
        for (const card of session.cards) {
          const completedSets = card.sets.filter(s => s.completed);
          if (completedSets.length > 0) {
            newHistory.push({
              exerciseId: card.exercise.id,
              date: Date.now(),
              sets: completedSets.map(s => ({ weight: s.weight, reps: s.reps })),
              totalVolume: completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0),
            });
          }
        }

        const totalVolume = newHistory.reduce((sum, h) => sum + h.totalVolume, 0);

        set({
          session: null,
          history: [...history, ...newHistory],
          totalWorkouts: totalWorkouts + 1,
          evolutionXP: evolutionXP + Math.round(totalVolume / 100),
          terminal: [
            ...terminal,
            makeTerminalEvent(`Session ended — ${totalVolume.toLocaleString()} lbs total volume`, 'success'),
          ],
        });
      },

      addExercise: (exercise: Exercise) => {
        const { session, terminal } = get();
        if (!session) return;
        const card: ExerciseCard = {
          id: makeCardId(),
          exercise,
          sets: [{
            id: makeSetId(),
            weight: exercise.defaultWeight,
            reps: exercise.defaultReps,
            completed: false,
          }],
        };
        set({
          session: { ...session, cards: [...session.cards, card] },
          terminal: [...terminal, makeTerminalEvent(`${exercise.name} added to session`, 'info')],
        });
      },

      removeExercise: (cardId: string) => {
        const { session } = get();
        if (!session) return;
        set({
          session: { ...session, cards: session.cards.filter(c => c.id !== cardId) },
        });
      },

      addSet: (cardId: string) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            cards: session.cards.map(c => {
              if (c.id !== cardId) return c;
              const lastSet = c.sets[c.sets.length - 1];
              return {
                ...c,
                sets: [...c.sets, {
                  id: makeSetId(),
                  weight: lastSet?.weight ?? c.exercise.defaultWeight,
                  reps: lastSet?.reps ?? c.exercise.defaultReps,
                  completed: false,
                }],
              };
            }),
          },
        });
      },

      removeSet: (cardId: string, setId: string) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            cards: session.cards.map(c => {
              if (c.id !== cardId) return c;
              return { ...c, sets: c.sets.filter(s => s.id !== setId) };
            }),
          },
        });
      },

      updateSet: (cardId: string, setId: string, field: 'weight' | 'reps', value: number) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            cards: session.cards.map(c => {
              if (c.id !== cardId) return c;
              return {
                ...c,
                sets: c.sets.map(s => s.id === setId ? { ...s, [field]: Math.max(0, value) } : s),
              };
            }),
          },
        });
      },

      completeSet: (cardId: string, setId: string) => {
        const { session, muscleHeat, history, terminal, evolutionXP } = get();
        if (!session) return;

        const card = session.cards.find(c => c.id === cardId);
        const setData = card?.sets.find(s => s.id === setId);
        if (!card || !setData) return;

        // Check for PR
        const prHit = isPR(card.exercise.id, setData.weight, setData.reps, history);

        // Update heat map
        const newHeat = addHeatFromExercise(muscleHeat, card.exercise, 1);

        // Build terminal events
        const newEvents = [...terminal];
        const vol = setData.weight * setData.reps;
        newEvents.push(makeTerminalEvent(
          `${card.exercise.name}: ${setData.weight}×${setData.reps} = ${vol} lbs`,
          'success'
        ));
        if (prHit) {
          newEvents.push(makeTerminalEvent(
            `🏆 PERSONAL RECORD on ${card.exercise.name}!`,
            'pr'
          ));
        }

        // Hypertrophy detection (volume > 5000 lbs in session)
        const sessionVol = session.cards.reduce((sum, c) =>
          sum + c.sets.filter(s => s.completed).reduce((ss, s) => ss + s.weight * s.reps, 0), 0
        ) + vol;
        if (sessionVol > 5000 && sessionVol - vol <= 5000) {
          newEvents.push(makeTerminalEvent('Hypertrophy Threshold Reached', 'warning'));
        }

        set({
          session: {
            ...session,
            cards: session.cards.map(c => {
              if (c.id !== cardId) return c;
              return {
                ...c,
                sets: c.sets.map(s =>
                  s.id === setId ? { ...s, completed: true, timestamp: Date.now(), isPR: prHit } : s
                ),
              };
            }),
          },
          muscleHeat: newHeat,
          evolutionXP: evolutionXP + (prHit ? 50 : 10),
          terminal: newEvents,
        });
      },

      // ── Rest Timer ─────────────────────────────────────
      startRest: (seconds: number) => set({ isResting: true, restSeconds: seconds }),
      stopRest: () => set({ isResting: false }),

      // ── Nutrition ──────────────────────────────────────
      addNutrition: (entry) => {
        const { nutrition, terminal, evolutionXP } = get();
        const newEntry: NutritionEntry = {
          ...entry,
          id: `nut-${Date.now()}`,
          timestamp: Date.now(),
        };
        const isHighProtein = entry.protein >= 25;
        set({
          nutrition: [...nutrition, newEntry],
          evolutionXP: evolutionXP + (isHighProtein ? 25 : 5),
          terminal: [
            ...terminal,
            makeTerminalEvent(`Logged: ${entry.name} (${entry.calories} cal, ${entry.protein}g P)`, isHighProtein ? 'success' : 'info'),
            ...(isHighProtein ? [makeTerminalEvent('High-protein fuel detected — Evolution XP +25', 'pr')] : []),
          ],
        });
      },

      // ── System ─────────────────────────────────────────
      refreshReadiness: () => {
        const weeklyStrain = get().history
          .filter(h => h.date > Date.now() - 7 * 24 * 60 * 60 * 1000)
          .reduce((sum, h) => sum + h.totalVolume, 0);
        const r = calculateReadiness(simulateHRV(), simulateSleep(), weeklyStrain);
        set({
          readiness: r,
          terminal: [...get().terminal, makeTerminalEvent(`Neural scan: ${r.score}% [${r.zone}]`, 'system')],
        });
      },

      connectWatch: () => set({
        watchConnected: true,
        terminal: [...get().terminal, makeTerminalEvent('Fitness tracker synced — Bio-verification active', 'success')],
      }),

      addTerminalEvent: (message: string, type: TerminalEvent['type'] = 'info') => {
        set({ terminal: [...get().terminal, makeTerminalEvent(message, type)] });
      },

      decayHeatmap: () => {
        set({ muscleHeat: applyDecay(get().muscleHeat) });
      },
    }),
    {
      name: 'aura-sync-storage', // LocalStorage key
      partialize: (state) => ({
        // Persist everything except transient UI state
        history: state.history,
        muscleHeat: state.muscleHeat,
        nutrition: state.nutrition,
        readiness: state.readiness,
        terminal: state.terminal.slice(-50), // keep last 50 events
        evolutionXP: state.evolutionXP,
        totalWorkouts: state.totalWorkouts,
        watchConnected: state.watchConnected,
        session: state.session, // persist active session too!
      }),
    }
  )
);
