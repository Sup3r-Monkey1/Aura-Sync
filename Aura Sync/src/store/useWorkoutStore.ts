import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Exercise, ExerciseCard, WorkoutSession, SessionHistory, NutritionEntry, TerminalEvent, MuscleHeat, ReadinessScore } from '../types';
import { createEmptyHeatmap, addHeatFromExercise, applyDecay } from '../engine/heatmap';
import { calculateReadiness, simulateHRV, simulateSleep } from '../engine/readiness';
import { isPR } from '../engine/overload';

interface WorkoutState {
  userName: string;
  userAge: number;
  userWeight: number;
  session: WorkoutSession | null;
  sessionLimit: number;
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
  protocolNotes: string;
  schedule: Record<string, 'gym' | 'home' | 'rest'>;
  scheduleNotes: Record<string, string>;
  ghostVolume: number;

  setUserName: (name: string) => void;
  setUserStats: (age: number, weight: number) => void;
  setSessionLimit: (seconds: number) => void;
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
  updateSchedule: (date: string, type: 'gym' | 'home' | 'rest') => void;
  updateDateNote: (date: string, note: string) => void;
  connectWatch: () => Promise<void>;
  addTerminalEvent: (message: string, type?: TerminalEvent['type']) => void;
  decayHeatmap: () => void;
  hardReset: () => void;
  refreshReadiness: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      userName: "Subject_01",
      userAge: 25,
      userWeight: 185,
      session: null,
      sessionLimit: 3600,
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
      scheduleNotes: {},
      ghostVolume: 0,

      setUserName: (name) => set({ userName: name }),
      setUserStats: (age, weight) => set({ userAge: age, userWeight: weight }),
      setSessionLimit: (s) => set({ sessionLimit: s }),
      startSession: () => set({ session: { id: `ws-${Date.now()}`, startedAt: Date.now(), cards: [] } }),
      endSession: () => {
        const { session, history, evolutionXP, ghostVolume } = get();
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
          totalWorkouts: (get().totalWorkouts || 0) + 1,
          evolutionXP: evolutionXP + Math.round(sessionVol / 100),
          ghostVolume: ghostVolume + (sessionVol * (0.95 + Math.random() * 0.1)),
          activeCardId: null, activeSetIndex: 0
        });
      },
      addExercise: (ex) => {
        const s = get().session;
        if (!s) return;
        const defaultSets = [1, 2, 3].map(i => ({ id: `s-${Date.now()}-${i}`, weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }));
        set({ session: { ...s, cards: [...s.cards, { id: `c-${Date.now()}`, exercise: ex, sets: defaultSets }] } });
      },
      removeExercise: (id) => set({ session: { ...get().session!, cards: get().session!.cards.filter(c => c.id !== id) } }),
      addSet: (cardId) => {
        const s = get().session;
        if (!s) return;
        set({
          session: {
            ...s,
            cards: s.cards.map(c => {
              if (c.id !== cardId) return c;
              const lastSet = c.sets[c.sets.length - 1];
              return { ...c, sets: [...c.sets, { id: `s-${Date.now()}`, weight: lastSet?.weight || 0, reps: lastSet?.reps || 0, completed: false }] };
            })
          }
        });
      },
      removeSet: (cardId, setId) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.filter(st => st.id !== setId) }) } }),
      updateSet: (cardId, setId, field, val) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(st => st.id === setId ? { ...st, [field]: val } : st) }) } }),
      completeSet: (cardId, setId) => {
        const { session, history, muscleHeat, evolutionXP } = get();
        if (!session) return;
        const card = session.cards.find(c => c.id === cardId);
        const setData = card?.sets.find(s => s.id === setId);
        if (!card || !setData) return;
        set({
          session: { ...session, cards: session.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(s => s.id === setId ? { ...s, completed: true, timestamp: Date.now(), isPR: isPR(card.exercise.id, setData.weight, setData.reps, history) } : s) }) },
          muscleHeat: addHeatFromExercise(muscleHeat, card.exercise, 1),
          evolutionXP: evolutionXP + 10
        });
      },
      setTracking: (cardId, index) => set({ activeCardId: cardId, activeSetIndex: index }),
      setDurations: (s, r) => set({ setDuration: s, restDuration: r }),
      startRest: (s) => set({ isResting: true, restSeconds: s }),
      stopRest: () => set({ isResting: false }),
      addNutrition: (n) => set({ nutrition: [...get().nutrition, { ...n, id: `n-${Date.now()}`, timestamp: Date.now() }], evolutionXP: get().evolutionXP + 5 }),
      updateSchedule: (date, type) => set({ schedule: { ...get().schedule, [date]: type } }),
      updateDateNote: (date, note) => set({ scheduleNotes: { ...get().scheduleNotes, [date]: note } }),
      connectWatch: async () => { set({ watchConnected: true }); },
      addTerminalEvent: (m, t) => set({ terminal: [...get().terminal, { id: `${Date.now()}`, timestamp: Date.now(), message: m, type: t || 'info' }] }),
      decayHeatmap: () => set({ muscleHeat: applyDecay(get().muscleHeat) }),
      refreshReadiness: () => set({ readiness: calculateReadiness(simulateHRV(), simulateSleep(), get().history.reduce((s, h) => s + h.totalVolume, 0)) }),
      hardReset: () => { localStorage.clear(); window.location.reload(); }
    }),
    { name: 'aura-sync-storage', storage: createJSONStorage(() => localStorage) }
  )
);
