import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Exercise, ExerciseCard, WorkoutSession, SessionHistory, NutritionEntry, TerminalEvent, MuscleHeat, ReadinessScore } from '../types';
import { createEmptyHeatmap, addHeatFromExercise, applyDecay } from '../engine/heatmap';
import { calculateReadiness, simulateHRV, simulateSleep } from '../engine/readiness';
import { isPR } from '../engine/overload';

export const triggerAlert = (type: 'success' | 'warning') => {
  try {
    if ('vibrate' in navigator) navigator.vibrate(type === 'success' ? [100, 50, 100] : [300]);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(type === 'success' ? 880 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

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
  muscleVolume: Record<string, number>;
  nutrition: NutritionEntry[];
  readiness: ReadinessScore;
  terminal: TerminalEvent[];
  evolutionXP: number;
  watchConnected: boolean;
  schedule: Record<string, 'gym' | 'home' | 'rest'>;
  scheduleNotes: Record<string, string>;
  dailyProtocols: Record<string, string[]>; // day -> exerciseIds
  ghostVolume: number;

  setUserName: (n: string) => void;
  setUserStats: (a: number, w: number) => void;
  setSessionLimit: (s: number) => void;
  startSession: () => void;
  endSession: () => void;
  addExercise: (ex: Exercise) => void;
  removeExercise: (id: string) => void;
  addSet: (cid: string) => void;
  removeSet: (cid: string, sid: string) => void;
  updateSet: (cid: string, sid: string, f: 'weight'|'reps', v: number) => void;
  completeSet: (cid: string, sid: string) => void;
  setTracking: (id: string | null, i: number) => void;
  setDurations: (s: number, r: number) => void;
  startRest: (s: number) => void;
  stopRest: () => void;
  addNutrition: (n: any) => void;
  updateSchedule: (d: string, t: any) => void;
  updateDateNote: (d: string, n: string) => void;
  toggleDailyExercise: (day: string, id: string) => void;
  connectWatch: () => Promise<void>;
  decayHeatmap: () => void;
  refreshReadiness: () => void;
  hardReset: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      userName: "Subject_01", userAge: 25, userWeight: 185,
      session: null, sessionLimit: 3600, isResting: false,
      restSeconds: 90, setDuration: 60, restDuration: 90,
      activeCardId: null, activeSetIndex: 0,
      history: [], muscleHeat: createEmptyHeatmap(), muscleVolume: {},
      nutrition: [], readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [], evolutionXP: 0, watchConnected: false,
      schedule: {}, scheduleNotes: {}, dailyProtocols: {}, ghostVolume: 0,

      setUserName: (userName) => set({ userName }),
      setUserStats: (userAge, userWeight) => set({ userAge, userWeight }),
      setSessionLimit: (sessionLimit) => set({ sessionLimit }),

      startSession: () => {
        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const protocolIds = get().dailyProtocols[dayOfWeek] || [];
        const { workoutRegistry } = require('../data/workoutRegistry');
        
        const initialCards: ExerciseCard[] = protocolIds.map(id => {
          const ex = workoutRegistry.find((e:any) => e.id === id);
          return {
            id: `c-${Date.now()}-${id}`,
            exercise: ex,
            sets: [1,2,3].map(i => ({ id: `s-${Date.now()}-${id}-${i}`, weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }))
          };
        });

        set({ session: { id: `ws-${Date.now()}`, startedAt: Date.now(), cards: initialCards } });
      },

      endSession: () => {
        const { session, history, evolutionXP, ghostVolume } = get();
        if (!session) return;
        const newEntries = session.cards.map(c => ({
          exerciseId: c.exercise.id, date: Date.now(),
          sets: c.sets.filter(s => s.completed).map(s => ({ weight: s.weight, reps: s.reps })),
          totalVolume: c.sets.filter(s => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0)
        })).filter(e => e.sets.length > 0);
        const sessionVol = newEntries.reduce((s, e) => s + e.totalVolume, 0);
        set({
          session: null, history: [...history, ...newEntries],
          evolutionXP: evolutionXP + Math.round(sessionVol / 100),
          ghostVolume: ghostVolume + (sessionVol * (0.95 + Math.random() * 0.1)),
          activeCardId: null, activeSetIndex: 0
        });
        triggerAlert('success');
      },

      addExercise: (ex) => {
        const s = get().session; if (!s) return;
        const sets = [1,2,3].map(i => ({ id: `s-${Date.now()}-${i}`, weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }));
        set({ session: { ...s, cards: [...s.cards, { id: `c-${Date.now()}`, exercise: ex, sets }] } });
      },

      removeExercise: (id) => set({ session: { ...get().session!, cards: get().session!.cards.filter(c => c.id !== id) } }),
      addSet: (cid) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cid ? c : { ...c, sets: [...c.sets, { id: `s-${Date.now()}`, weight: c.sets[c.sets.length-1]?.weight || 0, reps: c.sets[c.sets.length-1]?.reps || 0, completed: false }] }) } }),
      removeSet: (cid, sid) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cid ? c : { ...c, sets: c.sets.filter(st => st.id !== sid) }) } }),
      updateSet: (cid, sid, f, v) => set({ session: { ...get().session!, cards: get().session!.cards.map(c => c.id !== cid ? c : { ...c, sets: c.sets.map(st => st.id === sid ? { ...st, [f]: v } : st) }) } }),

      completeSet: (cid, sid) => {
        const { session, muscleVolume, muscleHeat, evolutionXP } = get();
        if (!session) return;
        const card = session.cards.find(c => c.id === cid);
        const setData = card?.sets.find(s => s.id === sid);
        if (!card || !setData) return;
        const setVol = setData.weight * setData.reps;
        const newMuscleVol = { ...muscleVolume };
        card.exercise.primaryMuscles.forEach(m => { newMuscleVol[m] = (newMuscleVol[m] || 0) + setVol; });
        set({
          session: { ...session, cards: session.cards.map(c => c.id !== cid ? c : { ...c, sets: c.sets.map(s => s.id === sid ? { ...s, completed: true, timestamp: Date.now() } : s) }) },
          muscleHeat: addHeatFromExercise(muscleHeat, card.exercise, 1),
          muscleVolume: newMuscleVol, evolutionXP: evolutionXP + 10
        });
      },

      setTracking: (activeCardId, activeSetIndex) => set({ activeCardId, activeSetIndex }),
      setDurations: (setDuration, restDuration) => set({ setDuration, restDuration }),
      startRest: (s) => set({ isResting: true, restSeconds: s }),
      stopRest: () => set({ isResting: false }),
      addNutrition: (n) => set({ nutrition: [...get().nutrition, { ...n, id: `n-${Date.now()}`, timestamp: Date.now() }], evolutionXP: get().evolutionXP + 5 }),
      updateSchedule: (date, type) => set({ schedule: { ...get().schedule, [date]: type } }),
      updateDateNote: (date, note) => set({ scheduleNotes: { ...get().scheduleNotes, [date]: note } }),
      
      toggleDailyExercise: (day, id) => {
        const current = get().dailyProtocols[day] || [];
        const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
        set({ dailyProtocols: { ...get().dailyProtocols, [day]: next } });
      },

      connectWatch: async () => {
        try {
          const device = await (navigator as any).bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
          await device.gatt.connect(); set({ watchConnected: true });
        } catch (e) {}
      },
      decayHeatmap: () => set({ muscleHeat: applyDecay(get().muscleHeat) }),
      refreshReadiness: () => set({ readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0) }),
      hardReset: () => { localStorage.clear(); window.location.reload(); }
    }),
    { name: 'aura-sync-storage', storage: createJSONStorage(() => localStorage) }
  )
);
