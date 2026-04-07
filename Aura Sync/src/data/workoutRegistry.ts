import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── STRENGTH & RESISTANCE MACHINES ───
  { id: 'm1', name: 'Chest Press Machine', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm2', name: 'Incline Chest Press Machine', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm3', name: 'Pec Deck / Chest Fly Machine', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm4', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm5', name: 'Seated Row Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'm6', name: 'T-Bar Row Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm7', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm8', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'm9', name: 'Arm Curl Machine', category: 'biceps', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm10', name: 'Arm Extension Machine', category: 'triceps', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm11', name: 'Leg Press Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 1 },
  { id: 'm12', name: 'Leg Extension Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm13', name: 'Leg Curl Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm14', name: 'Hack Squat Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 2 },
  { id: 'm15', name: 'Hip Thrust Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'm16', name: 'Seated Calf Raise Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 90, defaultReps: 15, difficulty: 1 },
  { id: 'm17', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },
  { id: 'm18', name: 'Smith Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 95, defaultReps: 10, difficulty: 2 },

  // ─── FREE WEIGHTS & HARDWARE ───
  { id: 'f1', name: 'Olympic Barbell Bench Press', category: 'chest', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'f2', name: 'Dumbbell Press', category: 'chest', isMachine: false, equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },
  { id: 'f3', name: 'Kettlebell Swing', category: 'legs', isMachine: false, equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['hamstrings', 'glutes'], defaultWeight: 35, defaultReps: 15, difficulty: 2 },
  { id: 'f4', name: 'Olympic Deadlift', category: 'back', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'hamstrings'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'f5', name: 'EZ-Bar Preacher Curl', category: 'biceps', isMachine: false, equipment: 'barbell', mechanics: 'isolation', primaryMuscles: ['biceps'], defaultWeight: 45, defaultReps: 10, difficulty: 1 },
  { id: 'f6', name: 'Trap Bar Shrugs', category: 'back', isMachine: false, equipment: 'barbell', mechanics: 'isolation', primaryMuscles: ['traps'], defaultWeight: 135, defaultReps: 12, difficulty: 1 },

  // ─── CARDIO ───
  { id: 'c1', name: 'Air Bike (Assault Bike)', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c2', name: 'StairClimber (StepMill)', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes', 'calves'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c3', name: 'Rowing Machine', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c4', name: 'Ski Erg', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },

  // ─── FUNCTIONAL ───
  { id: 'x1', name: 'Sled Push/Pull', category: 'legs', isMachine: false, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
  { id: 'x2', name: 'Battle Ropes', category: 'cardio', isMachine: false, equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'x3', name: 'TRX Suspension Trainer', category: 'core', isMachine: false, equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['core'], defaultWeight: 0, defaultReps: 12, difficulty: 2 },
];
