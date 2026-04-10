import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
  type: 'strength' | 'free-weight' | 'cardio' | 'functional' | 'core';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── STRENGTH & RESISTANCE MACHINES ───
  { id: 'm1', name: 'Arm Curl Machine', category: 'biceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm2', name: 'Arm Extension Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm3', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm4', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'm5', name: 'Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm6', name: 'Incline Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm7', name: 'Decline Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 110, defaultReps: 10, difficulty: 2 },
  { id: 'm8', name: 'Chest Fly / Pec Deck', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm9', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm10', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['lats'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm11', name: 'T-Bar Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm12', name: 'Ab Crunch Machine', category: 'core', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 60, defaultReps: 20, difficulty: 1 },
  { id: 'm13', name: 'Rotary Torso Machine', category: 'core', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 50, defaultReps: 15, difficulty: 1 },
  { id: 'm14', name: 'Leg Press Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 1 },
  { id: 'm15', name: 'Leg Extension Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm16', name: 'Seated Leg Curl Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm17', name: 'Lying Leg Curl Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 60, defaultReps: 12, difficulty: 1 },
  { id: 'm18', name: 'Hack Squat Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 2 },
  { id: 'm19', name: 'Leg Abduction Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },
  { id: 'm20', name: 'Hip Thrust Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'm21', name: 'Reverse Hyper Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lower_back', 'glutes'], defaultWeight: 50, defaultReps: 15, difficulty: 2 },
  { id: 'm22', name: 'Seated Calf Raise', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 90, defaultReps: 15, difficulty: 1 },
  { id: 'm23', name: 'Standing Calf Raise', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 120, defaultReps: 15, difficulty: 1 },
  { id: 'm24', name: 'Back Extension Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lower_back'], defaultWeight: 100, defaultReps: 12, difficulty: 1 },
  { id: 'm25', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },
  { id: 'm26', name: 'Triceps Press Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },

  // ─── FREE WEIGHTS & HARDWARE ───
  { id: 'f1', name: 'Olympic Barbell', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 45, defaultReps: 1, difficulty: 3 },
  { id: 'f2', name: 'Dumbbells', category: 'shoulders', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 50, defaultReps: 1, difficulty: 2 },
  { id: 'f3', name: 'Kettlebells', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 35, defaultReps: 1, difficulty: 2 },
  { id: 'f4', name: 'Trap Bar / Hex Bar', category: 'back', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back'], defaultWeight: 135, defaultReps: 1, difficulty: 3 },
  { id: 'f5', name: 'Medicine Ball', category: 'core', isMachine: false, type: 'free-weight', equipment: 'hardware', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 20, defaultReps: 1, difficulty: 1 },
  { id: 'f6', name: 'Sandbag', category: 'back', isMachine: false, type: 'free-weight', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['core', 'upper_back'], defaultWeight: 50, defaultReps: 1, difficulty: 3 },

  // ─── CARDIO ───
  { id: 'c1', name: 'Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c2', name: 'Air Bike / Assault Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c3', name: 'Stair Climber / Stepmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c4', name: 'Rowing Machine', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c5', name: 'Ski Erg', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },

  // ─── FUNCTIONAL ───
  { id: 'x1', name: 'Smith Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 10, difficulty: 2 },
  { id: 'x2', name: 'Cable Crossover', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], defaultWeight: 30, defaultReps: 15, difficulty: 2 },
  { id: 'x3', name: 'Battle Ropes', category: 'cardio', isMachine: false, type: 'functional', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'x4', name: 'Sled Push / Prowler', category: 'legs', isMachine: false, type: 'functional', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
  { id: 'x5', name: 'TRX Suspension Trainer', category: 'core', isMachine: false, type: 'functional', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['core'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
];
