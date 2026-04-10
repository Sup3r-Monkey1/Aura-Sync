import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
Hhjjjkgvvjhfh CSE gn bf rn v
  type: 'strength' | 'free-weight' | 'cardio' | 'functional';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── CARDIO (UNABRIDGED) ───
  { id: 'c1', name: 'Treadmill (Motorized)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c2', name: 'Incline Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c3', name: 'Curved Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['hamstrings'], secondaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c4', name: 'Manual Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c5', name: 'Elliptical Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c6', name: 'Air Bike / Assault Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c7', name: 'Rowing Machine (Air)', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c8', name: 'Stair Climber / Stepmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c9', name: 'Ski Erg', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c10', name: 'Jacobs Ladder', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c11', name: 'VersaClimber', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['shoulders', 'quads'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },

  // ─── UPPER BODY MACHINES (UNABRIDGED) ───
  { id: 'm-ch1', name: 'Chest Press Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm-ch2', name: 'Incline Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm-ch3', name: 'Decline Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 110, defaultReps: 10, difficulty: 2 },
  { id: 'm-ch4', name: 'Pec Deck / Pec Fly', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm-sh1', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },
  { id: 'm-sh2', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], defaultWeight: 30, defaultReps: 15, difficulty: 1 },
  { id: 'm-bk1', name: 'Lat Pulldown Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'm-bk2', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 110, defaultReps: 10, difficulty: 1 },
  { id: 'm-bk3', name: 'T-Bar Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'm-bk4', name: 'Assisted Pull-Up Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 8, difficulty: 1 },
  { id: 'm-bi1', name: 'Bicep Curl Machine', category: 'biceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm-tri1', name: 'Tricep Extension Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'm-tri2', name: 'Overhead Tricep Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], defaultWeight: 40, defaultReps: 12, difficulty: 2 },
  { id: 'm-tri3', name: 'Triceps Press Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'm-tri4', name: 'Dip Machine', category: 'triceps', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['triceps', 'chest'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },

  // ─── LOWER BODY MACHINES (UNABRIDGED) ───
  { id: 'm-lg1', name: '45-Degree Leg Press', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 200, defaultReps: 12, difficulty: 2 },
  { id: 'm-lg2', name: 'Hack Squat Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 140, defaultReps: 10, difficulty: 3 },
  { id: 'm-lg3', name: 'Pendulum Squat', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'm-lg4', name: 'Leg Extension Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'm-lg5', name: 'Seated Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'm-lg6', name: 'Lying Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 60, defaultReps: 12, difficulty: 1 },
  { id: 'm-lg7', name: 'Hip Abductor Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },
  { id: 'm-lg8', name: 'Hip Adductor Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },
  { id: 'm-lg9', name: 'Hip Thrust / Glute Drive', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'm-lg10', name: 'Seated Calf Raise', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 90, defaultReps: 15, difficulty: 1 },

  // ─── FREE WEIGHTS & HARDWARE (UNABRIDGED) ───
  { id: 'f-b-sq', name: 'Barbell Back Squat', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 135, defaultReps: 8, difficulty: 3 },
  { id: 'f-b-dl', name: 'Barbell Deadlift', category: 'back', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'f-b-bp', name: 'Barbell Bench Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'f-d-bp', name: 'Dumbbell Bench Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },
  { id: 'f-kb-s', name: 'Kettlebell Swing', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'kettlebell', mechanics: 'compound', primaryMuscles: ['glutes', 'hamstrings'], defaultWeight: 35, defaultReps: 15, difficulty: 2 },
  { id: 'f-t-dl', name: 'Trap Bar Deadlift', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 135, defaultReps: 8, difficulty: 2 },

  // ─── STRONGMAN & SPECIALTY ───
  { id: 'st-as', name: 'Atlas Stones', category: 'back', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['lower_back', 'glutes'], defaultWeight: 100, defaultReps: 1, difficulty: 3 },
  { id: 'st-log', name: 'Log Press', category: 'shoulders', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['shoulders', 'triceps'], defaultWeight: 90, defaultReps: 5, difficulty: 3 },
  { id: 'st-fw', name: "Farmer's Walk Handles", category: 'back', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['forearms', 'traps'], defaultWeight: 100, defaultReps: 1, difficulty: 2 },
  { id: 'x-sled', name: 'Sled Push / Prowler', category: 'legs', isMachine: false, type: 'functional', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 180, defaultReps: 1, difficulty: 3 },
  { id: 'x-rope', name: 'Battle Ropes', category: 'cardio', isMachine: false, type: 'functional', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
];
