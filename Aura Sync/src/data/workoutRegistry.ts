import type { Exercise } from '../types';

export const workoutRegistry: Exercise[] = [
  // ─── CARDIO ───
  { id: 'c1', name: 'Curved Slat-Belt Treadmill', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['hamstrings'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c2', name: 'Air Bike / Assault Bike', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c3', name: 'Concept2 Row Erg', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['quads', 'biceps'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c4', name: 'Ski-Erg (Vertical)', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c5', name: 'Jacob’s Ladder', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },

  // ─── CHEST ───
  { id: 'u1', name: 'Iso-Lateral Chest Press', category: 'chest', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 90, defaultReps: 10, difficulty: 1 },
  { id: 'u2', name: 'Pec Deck / Butterfly', category: 'chest', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'u3', name: 'Smith Machine Incline Press', category: 'chest', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 115, defaultReps: 10, difficulty: 2 },

  // ─── BACK ───
  { id: 'b1', name: 'T-Bar Row (Chest Supported)', category: 'back', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'b2', name: 'Seal Row (Barbell)', category: 'back', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'b3', name: 'Helms Row', category: 'back', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['core'], defaultWeight: 60, defaultReps: 10, difficulty: 2 },

  // ─── LEGS ───
  { id: 'l1', name: 'Linear Hack Squat', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes'], defaultWeight: 180, defaultReps: 10, difficulty: 2 },
  { id: 'l2', name: 'Pendulum Squat', category: 'legs', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'l3', name: 'Belt Squat (Pit Shark)', category: 'legs', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['lower_back'], defaultWeight: 135, defaultReps: 12, difficulty: 2 },
  { id: 'l4', name: 'GHD Raise (Glute Ham Developer)', category: 'legs', equipment: 'bodyweight', mechanics: 'isolation', primaryMuscles: ['hamstrings', 'glutes'], secondaryMuscles: ['lower_back'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'l5', name: 'Reverse Hyperextension', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 15, difficulty: 2 },

  // ─── SHOULDERS ───
  { id: 's1', name: 'Viking Press Machine', category: 'shoulders', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['side_delts'], secondaryMuscles: ['triceps'], defaultWeight: 90, defaultReps: 10, difficulty: 3 },
  { id: 's2', name: 'Egyptian Lateral Raise (Cable)', category: 'shoulders', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 15, defaultReps: 15, difficulty: 2 },

  // ─── CORE / FUNCTIONAL ───
  { id: 'f1', name: 'Landmine Rotation', category: 'core', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['core'], secondaryMuscles: ['shoulders'], defaultWeight: 25, defaultReps: 10, difficulty: 2 },
  { id: 'f2', name: 'Sled Push (Heavy Prowler)', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['calves', 'core'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
];

export const CATEGORIES = ['chest', 'back', 'legs', 'shoulders', 'core', 'cardio'] as const;
