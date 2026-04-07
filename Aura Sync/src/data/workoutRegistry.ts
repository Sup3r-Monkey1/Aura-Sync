import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
}

export const workoutRegistry: ExtendedExercise[] = [
  // MACHINES
  { id: 'm1', name: 'Chest Press Machine', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm2', name: 'Pec Deck Machine', category: 'chest', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm3', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm4', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'm5', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm6', name: 'Seated Row Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'm7', name: 'T-Bar Row Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm8', name: 'Ab Crunch Machine', category: 'core', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 60, defaultReps: 20, difficulty: 1 },
  { id: 'm9', name: 'Rotary Torso', category: 'core', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm10', name: 'Leg Press Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 1 },
  { id: 'm11', name: 'Leg Extension Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm12', name: 'Leg Curl Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm13', name: 'Hack Squat Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 2 },
  { id: 'm14', name: 'Hip Thrust Machine', category: 'legs', isMachine: true, equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'm15', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },

  // HARDWARE / FREE WEIGHTS
  { id: 'f1', name: 'Olympic Barbell', category: 'chest', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'f2', name: 'Dumbbells', category: 'shoulders', isMachine: false, equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },
  { id: 'f3', name: 'Kettlebells', category: 'legs', isMachine: false, equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 35, defaultReps: 15, difficulty: 2 },
  { id: 'f4', name: 'Trap Bar (Hex Bar)', category: 'back', isMachine: false, equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back'], defaultWeight: 135, defaultReps: 5, difficulty: 3 },
  { id: 'f5', name: 'Sled / Prowler', category: 'legs', isMachine: false, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },

  // CARDIO
  { id: 'c1', name: 'Air Bike / Assault Bike', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c2', name: 'Rowing Machine', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c3', name: 'Stair Climber', category: 'cardio', isMachine: true, equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
];
