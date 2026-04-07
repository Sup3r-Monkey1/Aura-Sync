import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
  type: 'strength' | 'free-weight' | 'cardio' | 'functional';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── STRENGTH MACHINES ───
  { id: 'm1', name: 'Iso-Lateral Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm2', name: 'Incline Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm3', name: 'Pec Deck / Chest Fly Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm4', name: 'Arm Curl / Bicep Machine', category: 'biceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm5', name: 'Triceps Press Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm6', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm7', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'm8', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm9', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['biceps'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'm10', name: 'T-Bar Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm11', name: 'Leg Press Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 1 },
  { id: 'm12', name: 'Leg Extension Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm13', name: 'Leg Curl Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm14', name: 'Hack Squat Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 2 },
  { id: 'm15', name: 'Glute Ham Developer (GHD)', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['hamstrings', 'glutes'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'm16', name: 'Reverse Hyper Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lower_back', 'glutes'], defaultWeight: 50, defaultReps: 15, difficulty: 2 },
  { id: 'm17', name: 'Hip Thrust Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'm18', name: 'Seated Calf Raise Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 90, defaultReps: 15, difficulty: 1 },
  { id: 'm19', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },

  // ─── FREE WEIGHTS & HEAVY HARDWARE ───
  { id: 'f1', name: 'Olympic Barbell Bench Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'f2', name: 'Dumbbell Incline Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },
  { id: 'f3', name: 'Olympic Deadlift', category: 'back', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'hamstrings'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'f4', name: 'Kettlebell Swings', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['hamstrings', 'glutes'], defaultWeight: 35, defaultReps: 15, difficulty: 2 },
  { id: 'f5', name: 'Trap Bar Deadlift', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 135, defaultReps: 8, difficulty: 2 },
  { id: 'f6', name: 'Dumbbell Lateral Raise', category: 'shoulders', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['side_delts'], defaultWeight: 20, defaultReps: 15, difficulty: 1 },

  // ─── CARDIO EQUIPMENT ───
  { id: 'c1', name: 'Air Bike / Assault Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c2', name: 'Concept2 Rowing Machine', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c3', name: 'Stair Climber / Stepmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes', 'calves'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c4', name: 'Air Runner (Manual)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },

  // ─── FUNCTIONAL & SPECIALIZED ───
  { id: 'x1', name: 'Sled Push / Prowler', category: 'legs', isMachine: false, type: 'functional', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
  { id: 'x2', name: 'Battle Ropes', category: 'cardio', isMachine: false, type: 'functional', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'x3', name: 'Suspension Trainer (TRX)', category: 'core', isMachine: false, type: 'functional', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['core'], defaultWeight: 0, defaultReps: 12, difficulty: 2 },
  { id: 'x4', name: 'Farmer’s Walk Handles', category: 'back', isMachine: false, type: 'functional', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['forearms', 'upper_back'], defaultWeight: 100, defaultReps: 1, difficulty: 2 },
];
