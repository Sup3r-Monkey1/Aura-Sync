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

interface WorkoutState {
  session: WorkoutSession | null;
  isResting: boolean;
  restSeconds: number;
  setDuration: number;
  restDuration: number;
  activeCardId: string | null;
  activeSetIndex: number;
  history: SessionHistory[];
  muscleHeat: MuscleHeat[];
  nutrition: NutritionEntry[];
  readiness: ReadinessScore;
  terminal: TerminalEvent[];
  evolutionXP: number;
  totalWorkouts: number;
  watchConnected: boolean;
  mealNotes: string;
  protocolNotes: string; // New: Workout specific notes
  schedule: Record<string, 'gym' | 'home' | 'rest'>; 
  ghostVolume: number;

  startSession: () => void;
  endSession: () => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (cardId: string) => void;
  addSet: (cardId: string) => void;
  removeSet: (cardId: string, setId: string) => void;
  updateSet: (cardId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
  completeSet: (cardId: string, setId: string) => void;
  setTracking: (cardId: string | null, index: number) => void;
  setDurations: (set: number, rest: number) => void;
  startRest: (seconds: number) => void;
  stopRest: () => void;
  addNutrition: (entry: Omit<NutritionEntry, 'id' | 'timestamp'>) => void;
  updateMealNotes: (notes: string) => void;
  updateProtocolNotes: (notes: string) => void;
  updateSchedule: (date: string, type: 'gym' | 'home' | 'rest') => void;
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
      setDuration: 60,
      restDuration: 90,
      activeCardId: null,
      activeSetIndex: 0,
      history: [],
      muscleHeat: createEmptyHeatmap(),
      nutrition: [],
      readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [],
      evolutionXP: 0,
      totalWorkouts: 0,
      watchConnected: false,
      mealNotes: "",
      protocolNotes: "",
      schedule: {},
      ghostVolume: 0,

      startSession: () => set({ session: { id: `ws-${Date.now()}`, startedAt: Date.now(), cards: [] } }),

      endSession: () => {
        const { session, history, evolutionXP, totalWorkouts, ghostVolume } = get();
        if (!session) return;
        const newEntries = session.cards.map(c => ({
          exerciseId: c.exercise.id,
          date: Date.now(),
          sets: c.sets.filter(s => s.completed).map(s => ({ weight: s.weight, reps: s.reps })),
          totalVolume: c.sets.filter(s => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0)
        })).filter(e => e.sets.length > 0);
        
        const sessionVol = newEntries.reduce((s, e) => s + e.totalVolume, 0);
        
        set({
          session: null,
          history: [...history, ...newEntries],
          totalWorkouts: totalWorkouts + 1,
          evolutionXP: evolutionXP + Math.round(sessionVol / 100),
          // Ghost keeps pace with real work (matched volume with slight variance)
          ghostVolume: ghostVolume + (sessionVol * (0.95 + Math.random() * 0.1)),
          activeCardId: null,
          activeSetIndex: 0
        });
      },

      addExercise: (ex) => {
        const s = get().session;
        if (!s) return;
        const defaultSets = [1, 2, 3].map(i => ({ id: `s-${Date.now()}-${i}`, weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }));
        set({ session: { ...s, cards: [...s.cards, { id: `c-${Date.now()}`, exercise: ex, sets: defaultSets }] } });
      },

      addSet: (cardId) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, cards: s.cards.map(c => c.id !== cardId ? c : { ...c, sets: [...c.sets, { id: `s-${Date.now()}`, weight: c.sets[c.sets.length-1].weight, reps: c.sets[c.sets.length-1].reps, completed: false }] }) } });
      },

      removeExercise: (id) => set({ session: { ...get().session!, cards: get().session!.cards.filter(c => c.id !== id) } }),
      removeSet: (cid, sid) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cid ? c : { ...c, sets: c.sets.filter(s => s.id !== sid) }) } }),
      updateSet: (cardId, setId, field, val) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(st => st.id === setId ? { ...st, [field]: val } : st) }) } }),

      completeSet: (cardId, setId) => {
        const { session, history, muscleHeat, evolutionXP } = get();
        if (!session) return;
        const card = session.cards.find(c => c.id === cardId);
        const setData = card?.sets.find(s => s.id === setId);
        if (!card || !setData) return;
        const pr = isPR(card.exercise.id, setData.weight, setData.reps, history);
        set({
          session: { ...session, cards: session.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(s => s.id === setId ? { ...s, completed: true, timestamp: Date.now(), isPR: pr } : s) }) },
          muscleHeat: addHeatFromExercise(muscleHeat, card.exercise, 1),
          evolutionXP: evolutionXP + (pr ? 50 : 10)
        });
      },

      setTracking: (cardId, index) => set({ activeCardId: cardId, activeSetIndex: index }),
      setDurations: (s, r) => set({ setDuration: s, restDuration: r }),
      startRest: (s) => set({ isResting: true, restSeconds: s }),
      stopRest: () => set({ isResting: false }),
      addNutrition: (n) => set({ nutrition: [...get().nutrition, { ...n, id: `n-${Date.now()}`, timestamp: Date.now() }], evolutionXP: get().evolutionXP + (n.protein >= 25 ? 25 : 5) }),
      updateMealNotes: (m) => set({ mealNotes: m }),
      updateProtocolNotes: (p) => set({ protocolNotes: p }),
      updateSchedule: (date, type) => {
        const { schedule, ghostVolume } = get();
        // If changing a 'gym' day to 'rest' or missing a day, Ghost would jump. 
        // Logic: Ghost gets 3000 lbs if user marks a day 'rest' that was previously 'gym'
        set({ schedule: { ...schedule, [date]: type } });
      },
      refreshReadiness: () => set({ readiness: calculateReadiness(simulateHRV(), simulateSleep(), get().history.reduce((s, h) => s + h.totalVolume, 0)) }),
      connectWatch: async () => { set({ watchConnected: true }); },
      addTerminalEvent: (m, t) => set({ terminal: [...get().terminal, { id: `${Date.now()}`, timestamp: Date.now(), message: m, type: t || 'info' }] }),
      decayHeatmap: () => set({ muscleHeat: applyDecay(get().muscleHeat) }),
      hardReset: () => { localStorage.clear(); window.location.reload(); }
    }),
    { name: 'aura-sync-storage', storage: createJSONStorage(() => localStorage) }
  )
);
