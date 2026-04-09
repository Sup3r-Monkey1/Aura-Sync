import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
  type: 'strength' | 'free-weight' | 'cardio' | 'functional';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── CARDIO ───
  { id: 'c1', name: 'Motorized Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c2', name: 'Curved Treadmill (Manual)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['hamstrings'], secondaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c3', name: 'Elliptical Cross Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c4', name: 'Indoor Spin Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c5', name: 'Assault / Air Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c6', name: 'Concept2 Rower', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c7', name: 'Stair Climber / Stepmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes', 'calves'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c8', name: 'VersaClimber', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },

  // ─── CHEST MACHINES ───
  { id: 'm-ch1', name: 'Seated Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm-ch2', name: 'Incline Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 80, defaultReps: 10, difficulty: 2 },
  { id: 'm-ch3', name: 'Decline Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 110, defaultReps: 10, difficulty: 2 },
  { id: 'm-ch4', name: 'Pec Deck / Fly Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm-ch5', name: 'Hammer Strength Flat Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },

  // ─── BACK MACHINES ───
  { id: 'm-bk1', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm-bk2', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm-bk3', name: 'T-Bar Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm-bk4', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },
  { id: 'm-bk5', name: 'Reverse Grip Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },

  // ─── LEGS MACHINES ───
  { id: 'm-lg1', name: 'Leg Press (45 Degree)', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 2 },
  { id: 'm-lg2', name: 'Hack Squat Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 3 },
  { id: 'm-lg3', name: 'Pendulum Squat', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'm-lg4', name: 'Leg Extension Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm-lg5', name: 'Seated Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm-lg6', name: 'Hip Abductor Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },

  // ─── FREE WEIGHTS ───
  { id: 'f1', name: 'Olympic Barbell', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 45, defaultReps: 1, difficulty: 3 },
  { id: 'f2', name: 'Dumbbell Pair', category: 'shoulders', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 50, defaultReps: 1, difficulty: 2 },
  { id: 'f3', name: 'EZ-Curl Bar', category: 'biceps', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'isolation', primaryMuscles: ['biceps'], defaultWeight: 25, defaultReps: 1, difficulty: 1 },
  { id: 'f4', name: 'Kettlebell', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 35, defaultReps: 1, difficulty: 2 },
  
  // ─── SPECIALTY ───
  { id: 's1', name: 'Smith Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 10, difficulty: 2 },
  { id: 's2', name: 'Cable Crossover Tower', category: 'chest', isMachine: true, type: 'functional', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], defaultWeight: 30, defaultReps: 15, difficulty: 2 },
  { id: 's3', name: 'Battle Ropes', category: 'cardio', isMachine: false, type: 'functional', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 's4', name: 'Sled / Prowler', category: 'legs', isMachine: false, type: 'functional', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
];
