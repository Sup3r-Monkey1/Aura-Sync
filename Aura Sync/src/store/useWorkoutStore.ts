import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Exercise, ExerciseCard, WorkoutSession,
  SessionHistory, NutritionEntry, TerminalEvent,
  MuscleHeat, ReadinessScore,
} from '../types';

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
  session: WorkoutSession | null;
  isResting: boolean;
  restSeconds: number;
  setDuration: number;   // Adjustable lifting window
  restDuration: number;  // Adjustable rest window
  history: SessionHistory[];
  muscleHeat: MuscleHeat[];
  nutrition: NutritionEntry[];
  readiness: ReadinessScore;
  terminal: TerminalEvent[];
  evolutionXP: number;
  totalWorkouts: number;
  watchConnected: boolean;
  mealNotes: string;

  startSession: () => void;
  endSession: () => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (cardId: string) => void;
  addSet: (cardId: string) => void;
  removeSet: (cardId: string, setId: string) => void;
  updateSet: (cardId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
  completeSet: (cardId: string, setId: string) => void;
  setDurations: (set: number, rest: number) => void;
  startRest: (seconds: number) => void;
  stopRest: () => void;
  addNutrition: (entry: Omit<NutritionEntry, 'id' | 'timestamp'>) => void;
  updateMealNotes: (notes: string) => void;
  refreshReadiness: () => void;
  connectWatch: () => Promise<void>;
  addTerminalEvent: (message: string, type?: TerminalEvent['type']) => void;
  decayHeatmap: () => void;
  hardReset: () => void; 
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      session: null,
      isResting: false,
      restSeconds: 90,
      setDuration: 60,  // Default 1m
      restDuration: 90, // Default 1.5m
      history: [],
      muscleHeat: createEmptyHeatmap(),
      nutrition: [],
      readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [makeTerminalEvent('AURA SYNC v2.0 initialized', 'system')],
      evolutionXP: 0,
      totalWorkouts: 0,
      watchConnected: false,
      mealNotes: "", 

      startSession: () => {
        const s: WorkoutSession = { id: `ws-${Date.now()}`, startedAt: Date.now(), cards: [] };
        set({ session: s, terminal: [...get().terminal, makeTerminalEvent('Link established. Ghost Protocol active.', 'system')] });
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
          terminal: [...get().terminal, makeTerminalEvent(`Session Sync: ${totalVolume.toLocaleString()} lbs volume`, 'success')],
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
        set({ session: { ...session, cards: [...session.cards, card] }, terminal: [...get().terminal, makeTerminalEvent(`${exercise.name.toUpperCase()} synced`, 'info')] });
      },

      removeExercise: (cardId) => {
        const { session } = get();
        if (!session) return;
        set({ session: { ...session, cards: session.cards.filter(c => c.id !== cardId) } });
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
                sets: [...c.sets, { id: makeSetId(), weight: lastSet?.weight ?? c.exercise.defaultWeight, reps: lastSet?.reps ?? c.exercise.defaultReps, completed: false }],
              };
            }),
          }
        });
      },

      removeSet: (cardId, setId) => {
        const { session } = get();
        if (!session) return;
        set({ session: { ...session, cards: session.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.filter(s => s.id !== setId) }) } });
      },

      updateSet: (cardId, setId, field, value) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            cards: session.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(s => s.id === setId ? { ...s, [field]: Math.max(0, value) } : s) }),
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
        newEvents.push(makeTerminalEvent(`${card.exercise.name}: ${setData.weight}×${setData.reps}`, 'success'));
        if (prHit) newEvents.push(makeTerminalEvent(`🏆 PR: ${card.exercise.name}`, 'pr'));

        set({
          session: {
            ...session,
            cards: session.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(s => s.id === setId ? { ...s, completed: true, timestamp: Date.now(), isPR: prHit } : s) }),
          },
          muscleHeat: newHeat,
          evolutionXP: evolutionXP + (prHit ? 50 : 10),
          terminal: newEvents,
        });
      },

      setDurations: (setVal, restVal) => set({ setDuration: setVal, restDuration: restVal }),
      startRest: (seconds) => set({ isResting: true, restSeconds: seconds }),
      stopRest: () => set({ isResting: false }),

      addNutrition: (entry) => {
        const { nutrition, evolutionXP } = get();
        const newEntry: NutritionEntry = { ...entry, id: `nut-${Date.now()}`, timestamp: Date.now() };
        const isHighProtein = entry.protein >= 25;
        set({
          nutrition: [...nutrition, newEntry],
          evolutionXP: evolutionXP + (isHighProtein ? 25 : 5),
          terminal: [...get().terminal, makeTerminalEvent(`Logged: ${entry.name}`, isHighProtein ? 'success' : 'info')],
        });
      },

      updateMealNotes: (notes) => set({ mealNotes: notes }),

      refreshReadiness: () => {
        const weekAgo = Date.now() - 604800000;
        const weeklyStrain = get().history.filter(h => h.date > weekAgo).reduce((sum, h) => sum + h.totalVolume, 0);
        set({ readiness: calculateReadiness(simulateHRV(), simulateSleep(), weeklyStrain) });
      },

      connectWatch: async () => {
        try {
          if (!('bluetooth' in navigator)) {
            set({ terminal: [...get().terminal, makeTerminalEvent('Bluetooth not supported', 'warning')] });
            return;
          }
          const device = await (navigator as any).bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
          await device.gatt.connect();
          set({ watchConnected: true, terminal: [...get().terminal, makeTerminalEvent(`Linked: ${device.name}`, 'success')] });
        } catch (e) {
          set({ watchConnected: false, terminal: [...get().terminal, makeTerminalEvent('Link Cancelled', 'info')] });
        }
      },

      addTerminalEvent: (message, type = 'info') => set({ terminal: [...get().terminal, makeTerminalEvent(message, type)] }),
      decayHeatmap: () => set({ muscleHeat: applyDecay(get().muscleHeat) }),

      hardReset: () => {
        localStorage.removeItem('aura-sync-storage');
        set({ history: [], muscleHeat: createEmptyHeatmap(), nutrition: [], evolutionXP: 0, totalWorkouts: 0, terminal: [makeTerminalEvent('SYSTEM REFORMATTED', 'warning')], session: null, watchConnected: false, mealNotes: "" });
        window.location.reload();
      },
    }),
    {
      name: 'aura-sync-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
