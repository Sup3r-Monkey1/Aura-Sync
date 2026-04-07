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
  
  // 📅 CALENDAR & GHOST LOGIC
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
  setActiveSet: (index: number) => void;
  setDurations: (set: number, rest: number) => void;
  startRest: (seconds: number) => void;
  stopRest: () => void;
  addNutrition: (entry: Omit<NutritionEntry, 'id' | 'timestamp'>) => void;
  updateMealNotes: (notes: string) => void;
  updateSchedule: (date: string, type: 'gym' | 'home' | 'rest') => void;
  syncGhost: () => void; // Recalculates Ghost lead
  refreshReadiness: () => void;
  connectWatch: () => Promise<void>;
  addTerminalEvent: (message: string, type?: TerminalEvent['type']) => void;
  decayHeatmap: () => void;
  hardReset: () => void; 
}

let terminalCounter = 0;
function makeTerminalEvent(message: string, type: TerminalEvent['type'] = 'info'): TerminalEvent {
  return { id: `te-${Date.now()}-${terminalCounter++}`, timestamp: Date.now(), message, type };
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      session: null,
      isResting: false,
      restSeconds: 90,
      setDuration: 60,
      restDuration: 90,
      activeSetIndex: 0,
      history: [],
      muscleHeat: createEmptyHeatmap(),
      nutrition: [],
      readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [makeTerminalEvent('AURA SYNC v2.5 initialized', 'system')],
      evolutionXP: 0,
      totalWorkouts: 0,
      watchConnected: false,
      mealNotes: "",
      schedule: {},
      ghostVolume: 2500, // Starting baseline

      startSession: () => {
        set({ session: { id: `ws-${Date.now()}`, startedAt: Date.now(), cards: [] }, terminal: [...get().terminal, makeTerminalEvent('Link established.', 'system')] });
      },

      endSession: () => {
        const { session, history, evolutionXP, totalWorkouts, ghostVolume } = get();
        if (!session) return;
        const newEntries: SessionHistory[] = session.cards.map(c => ({
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
          // Ghost keeps pace: if you log 5000lbs, Ghost logs ~4800lbs (+/- 5%)
          ghostVolume: ghostVolume + (sessionVol * (0.9 + Math.random() * 0.2)),
          terminal: [...get().terminal, makeTerminalEvent(`Sync Complete: ${sessionVol} lbs`, 'success')]
        });
      },

      addExercise: (ex) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, cards: [...s.cards, { id: `c-${Date.now()}`, exercise: ex, sets: [{ id: `s-${Date.now()}`, weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }] }] } });
      },

      updateSet: (cardId, setId, field, val) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, cards: s.cards.map(c => c.id !== cardId ? c : { ...c, sets: c.sets.map(st => st.id === setId ? { ...st, [field]: val } : st) }) } });
      },

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

      setActiveSet: (i) => set({ activeSetIndex: i }),
      setDurations: (s, r) => set({ setDuration: s, restDuration: r }),
      startRest: (s) => set({ isResting: true, restSeconds: s }),
      stopRest: () => set({ isResting: false }),
      addNutrition: (n) => set({ nutrition: [...get().nutrition, { ...n, id: `n-${Date.now()}`, timestamp: Date.now() }], evolutionXP: get().evolutionXP + (n.protein >= 25 ? 25 : 5) }),
      updateMealNotes: (m) => set({ mealNotes: m }),
      
      updateSchedule: (date, type) => set({ schedule: { ...get().schedule, [date]: type } }),

      syncGhost: () => {
        const { schedule, history, ghostVolume } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // 👻 GHOST PENALTY LOGIC
        // If today is a scheduled workout day AND there is no workout in history for today
        const isScheduledToday = schedule[today] && schedule[today] !== 'rest';
        const hasWorkedOutToday = history.some(h => new Date(h.date).toISOString().split('T')[0] === today);

        if (isScheduledToday && !hasWorkedOutToday) {
          // Ghost pulls ahead by 3000 lbs for your missed day
          set({ 
            ghostVolume: ghostVolume + 3000,
            terminal: [...get().terminal, makeTerminalEvent("GHOST LINK DETECTED GAP: RIVAL PULLED AHEAD +3000 LBS", "warning")]
          });
        }
      },

      refreshReadiness: () => set({ readiness: calculateReadiness(simulateHRV(), simulateSleep(), get().history.reduce((s, h) => s + h.totalVolume, 0)) }),
      connectWatch: async () => { /* Bluetooth Logic */ set({ watchConnected: true }); },
      addTerminalEvent: (m, t) => set({ terminal: [...get().terminal, makeTerminalEvent(m, t)] }),
      decayHeatmap: () => set({ muscleHeat: applyDecay(get().muscleHeat) }),
      hardReset: () => { localStorage.clear(); window.location.reload(); }
    }),
    { name: 'aura-sync-storage', storage: createJSONStorage(() => localStorage) }
  )
);
