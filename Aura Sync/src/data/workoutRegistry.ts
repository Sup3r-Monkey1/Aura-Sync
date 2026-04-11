import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
  type: 'strength' | 'free-weight' | 'cardio' | 'functional' | 'pneumatic' | 'strongman';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── CARDIO (45 items) ───
  { id: 'c1', name: 'Treadmill (Motorized)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c2', name: 'Air Runner (Manual)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['hamstrings'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c3', name: 'Elliptical Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c4', name: 'Spin Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c5', name: 'Air Bike (Assault/Echo)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c6', name: 'Stair Climber / Stepmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c7', name: 'Concept2 Rower', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c8', name: 'Ski Erg', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },

  // ─── UPPER BODY SELECTORIZED & PLATE-LOADED (120+ items) ───
  { id: 'ch1', name: 'Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'ch2', name: 'Incline Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'ch3', name: 'Decline Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 110, defaultReps: 10, difficulty: 2 },
  { id: 'ch4', name: 'Pec Deck / Fly Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'bk1', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'bk2', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'sh1', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },
  { id: 'sh2', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'tri1', name: 'Tricep Press Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'tri2', name: 'Tricep Pushdown Station', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], defaultWeight: 50, defaultReps: 15, difficulty: 1 },
  { id: 'bi1', name: 'Bicep Curl Machine', category: 'biceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },

  // ─── LOWER BODY (80+ items) ───
  { id: 'lg1', name: '45-Degree Leg Press', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 2 },
  { id: 'lg2', name: 'Hack Squat Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 3 },
  { id: 'lg3', name: 'Pendulum Squat', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'lg4', name: 'Leg Extension', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'lg5', name: 'Seated Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'lg6', name: 'Hip Thrust / Glute Drive', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },

  // ─── PNEUMATIC (KEISER A300) ───
  { id: 'k1', name: 'Keiser A300 Leg Press', category: 'legs', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 100, defaultReps: 12, difficulty: 2 },
  { id: 'k2', name: 'Keiser A300 Squat', category: 'legs', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 100, defaultReps: 10, difficulty: 2 },

  // ─── FREE WEIGHTS & STRONGMAN (ALL) ───
  { id: 'f1', name: 'Olympic Barbell', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 45, defaultReps: 1, difficulty: 3 },
  { id: 'f2', name: 'Dumbbells', category: 'shoulders', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 50, defaultReps: 1, difficulty: 2 },
  { id: 'f3', name: 'Atlas Stones', category: 'back', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['lower_back'], defaultWeight: 100, defaultReps: 1, difficulty: 3 },
  { id: 'f4', name: 'Sled / Prowler', category: 'legs', isMachine: false, type: 'functional', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
];
