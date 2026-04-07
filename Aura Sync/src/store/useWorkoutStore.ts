import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Exercise, ExerciseCard, WorkoutSession,
  SessionHistory, NutritionEntry, TerminalEvent,
  MuscleHeat, ReadinessScore,
} from '../types';

// Import our custom logic engines
import { createEmptyHeatmap, addHeatFromExercise, applyDecay } from '../engine/heatmap';
import { calculateReadiness, simulateHRV, simulateSleep } from '../engine/readiness';
import { isPR } from '../engine/overload';

// ── HELPERS ──────────────────────────────────────────────
let terminalCounter = 0;
function makeTerminalEvent(message: string, type: TerminalEvent['type'] = 'info'): TerminalEvent {
  return { 
    id: `te-${Date.now()}-${terminalCounter++}`, 
    timestamp: Date.now(), 
    message, 
    type 
  };
}

const makeSetId = () => `set-${Math.random().toString(36).slice(2, 9)}`;
const makeCardId = () => `card-${Math.random().toString(36).slice(2, 9)}`;

// ── STORE INTERFACE ──────────────────────────────────────
interface WorkoutState {
  // 1. Active UI State
  session: WorkoutSession | null;
  isResting: boolean;
  restSeconds: number;

  // 2. Persistent "Save File" Data
  history: SessionHistory[];
  muscleHeat: MuscleHeat[];
  nutrition: NutritionEntry[];
  readiness: ReadinessScore;
  terminal: TerminalEvent[];
  evolutionXP: number;
  totalWorkouts: number;
  watchConnected: boolean;

  // 3. Actions — Workout flow
  startSession: () => void;
  endSession: () => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (cardId: string) => void;
  addSet: (cardId: string) => void;
  removeSet: (cardId: string, setId: string) => void;
  updateSet: (cardId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
  completeSet: (cardId: string, setId: string) => void;

  // 4. Actions — Timers & Nutrition
  startRest: (seconds: number) => void;
  stopRest: () => void;
  addNutrition: (entry: Omit<NutritionEntry, 'id' | 'timestamp'>) => void;

  // 5. Actions — System Maintenance
  refreshReadiness: () => void;
  connectWatch: () => void;
  addTerminalEvent: (message: string, type?: TerminalEvent['type']) => void;
  decayHeatmap: () => void;
  hardReset: () => void; // Monday Morning Wipe
}

// ── THE STORE ────────────────────────────────────────────
export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // 🧼 INITIAL "CLEAN SLATE" VALUES (Monday Morning Logic)
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

      // ── SESSION ACTIONS ────────────────────────────────
      startSession: () => {
        const s: WorkoutSession = {
          id: `ws-${Date.now()}`,
          startedAt: Date.now(),
          cards: [],
        };
        set({
          session: s,
          terminal: [...get().terminal, makeTerminalEvent('Link established. Ghost Protocol active.', 'system')],
        });
      },

      endSession: () => {
        const { session, history, totalWorkouts, evolutionXP } = get();
        if (!session) return;

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
            ...get().terminal,
            makeTerminalEvent(`Session Sync: ${totalVolume.toLocaleString()} lbs total volume`, 'success'),
          ],
        });
      },

      addExercise: (exercise) => {
        const { session } = get();
        if (!session) return;
        const card: ExerciseCard = {
          id: makeCardId(),
          exercise,
          sets: [{ id: makeSetId(), weight: exercise.defaultWeight, reps: exercise.defaultReps, completed: false }],
        };
        set({
          session: { ...session, cards: [...session.cards, card] },
          terminal: [...get().terminal, makeTerminalEvent(`${exercise.name.toUpperCase()} synced to session`, 'info')],
        });
      },

      removeExercise: (cardId) => {
        const { session } = get();
        if (!session) return;
        set({
          session: { ...session, cards: session.cards.filter(c => c.id !== cardId) }
        });
      },

      addSet: (cardId) => {
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
          }
        });
      },

      removeSet: (cardId, setId) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            cards: session.cards.map(c => {
              if (c.id !== cardId) return c;
              return { ...c, sets: c.sets.filter(s => s.id !== setId) };
            }),
          }
        });
      },

      updateSet: (cardId, setId, field, value) => {
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
          }
        });
      },

      completeSet: (cardId, setId) => {
        const { session, muscleHeat, history, evolutionXP } = get();
        if (!session) return;

        const card = session.cards.find(c => c.id === cardId);
        const setData = card?.sets.find(s => s.id === setId);
        if (!card || !setData) return;

        const prHit = isPR(card.exercise.id, setData.weight, setData.reps, history);
        const newHeat = addHeatFromExercise(muscleHeat, card.exercise, 1);
        const newEvents = [...get().terminal];
        
        newEvents.push(makeTerminalEvent(
          `${card.exercise.name}: ${setData.weight}×${setData.reps}`, 'success'
        ));

        if (prHit) {
          newEvents.push(makeTerminalEvent(`🏆 NEW PERSONAL RECORD: ${card.exercise.name}`, 'pr'));
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

      // ── TIMERS & NUTRITION ─────────────────────────────
      startRest: (seconds) => set({ isResting: true, restSeconds: seconds }),
      stopRest: () => set({ isResting: false }),

      addNutrition: (entry) => {
        const { nutrition, evolutionXP } = get();
        const newEntry: NutritionEntry = { ...entry, id: `nut-${Date.now()}`, timestamp: Date.now() };
        const isHighProtein = entry.protein >= 25;
        
        set({
          nutrition: [...nutrition, newEntry],
          evolutionXP: evolutionXP + (isHighProtein ? 25 : 5),
          terminal: [
            ...get().terminal,
            makeTerminalEvent(`Logged: ${entry.name} (${entry.calories} kcal)`, isHighProtein ? 'success' : 'info')
          ],
        });
      },

      // ── SYSTEM MAINTENANCE ─────────────────────────────
      refreshReadiness: () => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weeklyStrain = get().history
          .filter(h => h.date > weekAgo)
          .reduce((sum, h) => sum + h.totalVolume, 0);
        
        const r = calculateReadiness(simulateHRV(), simulateSleep(), weeklyStrain);
        set({
          readiness: r,
          terminal: [...get().terminal, makeTerminalEvent(`Neural scan complete: ${r.zone}`, 'system')],
        });
      },

      connectWatch: () => set({
        watchConnected: true,
        terminal: [...get().terminal, makeTerminalEvent('Fitness tracker linked via Bluetooth', 'success')],
      }),

      addTerminalEvent: (message, type = 'info') => {
        set({ terminal: [...get().terminal, makeTerminalEvent(message, type)] });
      },

      decayHeatmap: () => {
        set({ muscleHeat: applyDecay(get().muscleHeat) });
      },

      // 🛡️ THE HARD RESET (The "Nuclear" Button)
      hardReset: () => {
        // Clear LocalStorage and Reset Store to defaults
        localStorage.removeItem('aura-sync-storage');
        set({
          history: [],
          muscleHeat: createEmptyHeatmap(),
          nutrition: [],
          evolutionXP: 0,
          totalWorkouts: 0,
          terminal: [makeTerminalEvent('SYSTEM REFORMATTED. AURA SYNC RESET.', 'warning')],
          session: null,
          watchConnected: false
        });
        window.location.reload(); // Refresh the app to clear memory
      },
    }),
    {
      // 💾 AUTOMATIC SAVE LOGIC (Zustand Persist)
      name: 'aura-sync-storage', // The Key in LocalStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Tell Zustand exactly what pieces of data to save to your phone
        history: state.history,
        muscleHeat: state.muscleHeat,
        nutrition: state.nutrition,
        readiness: state.readiness,
        terminal: state.terminal.slice(-50), // Save only the last 50 log entries
        evolutionXP: state.evolutionXP,
        totalWorkouts: state.totalWorkouts,
        watchConnected: state.watchConnected,
        session: state.session, // Even save an unfinished session!
      }),
    }
  )
);
