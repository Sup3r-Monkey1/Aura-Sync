import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── CHEST ───
  { id: 'm-ch-1', name: 'Iso-Lateral Chest Press', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm-ch-2', name: 'Pec Deck Fly', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'f-ch-1', name: 'Barbell Bench Press', category: 'chest', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'f-ch-2', name: 'Dumbbell Incline Press', category: 'chest', isMachine: false, equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },

  // ─── BACK ───
  { id: 'm-bk-1', name: 'Diverging Lat Pulldown', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'm-bk-2', name: 'Seated Cable Row', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'f-bk-1', name: 'Deadlift (Conventional)', category: 'back', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'glutes'], secondaryMuscles: ['traps'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'f-bk-2', name: 'Weighted Pull-Ups', category: 'back', isMachine: false, equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 0, defaultReps: 8, difficulty: 3 },

  // ─── LEGS ───
  { id: 'm-lg-1', name: 'Linear Hack Squat', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes'], defaultWeight: 180, defaultReps: 10, difficulty: 2 },
  { id: 'm-lg-2', name: 'Lying Leg Curl', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], secondaryMuscles: [], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'f-lg-1', name: 'Barbell Back Squat', category: 'legs', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 185, defaultReps: 8, difficulty: 3 },
  { id: 'f-lg-2', name: 'Walking Lunges', category: 'legs', isMachine: false, equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 40, defaultReps: 20, difficulty: 2 },

  // ─── SHOULDERS ───
  { id: 'm-sh-1', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm-sh-2', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'f-sh-1', name: 'Overhead Press (OHP)', category: 'shoulders', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'core'], defaultWeight: 95, defaultReps: 8, difficulty: 3 },

  // ─── CORE ───
  { id: 'm-cr-1', name: 'Rotary Torso', category: 'core', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 15, difficulty: 1 },
  { id: 'f-cr-1', name: 'Hanging Leg Raises', category: 'core', isMachine: false, equipment: 'bodyweight', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: [], defaultWeight: 0, defaultReps: 15, difficulty: 2 },
];
