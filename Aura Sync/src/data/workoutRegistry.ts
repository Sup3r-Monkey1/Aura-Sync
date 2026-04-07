import type { Exercise } from '../types';

export interface ExtendedExercise extends Exercise {
  isMachine: boolean;
  type: 'strength' | 'free-weight' | 'cardio' | 'functional' | 'pneumatic' | 'strongman';
}

export const workoutRegistry: ExtendedExercise[] = [
  // ─── CARDIOVASCULAR SYSTEMS ───
  { id: 'c-tr-m', name: 'Motorized Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c-tr-c', name: 'Curved Slat Treadmill', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['hamstrings'], secondaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c-bk-u', name: 'Upright Stationary Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], secondaryMuscles: [], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c-bk-r', name: 'Recumbent Exercise Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], secondaryMuscles: [], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c-bk-s', name: 'Indoor/Spin Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c-rw-a', name: 'Air Rowing Machine', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c-et', name: 'Elliptical Cross-Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 1 },
  { id: 'c-at', name: 'Arc Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes', 'quads'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },
  { id: 'c-sparc', name: 'SPARC Trainer', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c-jl', name: 'Jacobs Ladder', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c-ab', name: 'Assault/Echo Air Bike', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
  { id: 'c-se', name: 'SkiErg', category: 'cardio', isMachine: true, type: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps', 'core'], defaultWeight: 0, defaultReps: 1, difficulty: 2 },

  // ─── SELECTORIZED UPPER BODY ───
  { id: 's-cp', name: 'Selectorized Chest Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 's-icp', name: 'Selectorized Incline Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 's-pf', name: 'Pec Fly / Rear Delt Machine', category: 'chest', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: ['rear_delts'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 's-lp', name: 'Lat Pulldown (Selectorized)', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 's-sr', name: 'Seated Row Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back'], secondaryMuscles: ['lats'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 's-sp', name: 'Shoulder Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },
  { id: 's-lr', name: 'Lateral Raise Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 30, defaultReps: 15, difficulty: 1 },
  { id: 's-po', name: 'Nautilus Pullover Machine', category: 'back', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lats'], secondaryMuscles: ['chest'], defaultWeight: 80, defaultReps: 10, difficulty: 2 },
  { id: 's-rt', name: 'Rotary Torso Machine', category: 'core', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },

  // ─── SELECTORIZED LOWER BODY ───
  { id: 's-lpr', name: 'Selectorized Leg Press', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 150, defaultReps: 12, difficulty: 1 },
  { id: 's-le', name: 'Leg Extension Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 's-lc-s', name: 'Seated Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 's-lc-p', name: 'Prone/Lying Leg Curl', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], defaultWeight: 60, defaultReps: 12, difficulty: 1 },
  { id: 's-abduction', name: 'Hip Abductor Machine', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },
  { id: 's-scr', name: 'Standing Calf Raise', category: 'legs', isMachine: true, type: 'strength', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], defaultWeight: 120, defaultReps: 15, difficulty: 1 },

  // ─── PLATE-LOADED ENGINEERING ───
  { id: 'p-bp', name: 'Iso-Lateral Bench Press', category: 'chest', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'p-dy', name: 'Iso-Lateral D.Y. Row', category: 'back', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'p-hr', name: 'Iso-Lateral High Row', category: 'back', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['upper_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'p-bs', name: 'Plate-Loaded Belt Squat', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 90, defaultReps: 10, difficulty: 3 },
  { id: 'p-ps', name: 'Pendulum Squat', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 45, defaultReps: 10, difficulty: 3 },
  { id: 'p-gd', name: 'Glute Drive / Hip Thrust', category: 'legs', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'isolation', primaryMuscles: ['glutes'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'p-vp', name: 'Viking Press Machine', category: 'shoulders', isMachine: true, type: 'strength', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },

  // ─── KEISER PNEUMATIC (A300/A400) ───
  { id: 'k-lp', name: 'Keiser A300 Leg Press', category: 'legs', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads'], defaultWeight: 100, defaultReps: 12, difficulty: 2 },
  { id: 'k-sq', name: 'Keiser A300 Squat', category: 'legs', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 100, defaultReps: 10, difficulty: 2 },
  { id: 'k-cp', name: 'Keiser A300 Chest Press', category: 'chest', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 50, defaultReps: 10, difficulty: 1 },
  { id: 'k-ld', name: 'Keiser A300 Lat Pulldown', category: 'back', isMachine: true, type: 'pneumatic', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },

  // ─── BARBELL VARIATIONS ───
  { id: 'b-sq', name: 'Barbell Back Squat', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], defaultWeight: 135, defaultReps: 8, difficulty: 3 },
  { id: 'b-dl', name: 'Barbell Deadlift', category: 'back', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'glutes', 'hamstrings'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'b-bp', name: 'Barbell Bench Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], defaultWeight: 135, defaultReps: 10, difficulty: 3 },
  { id: 'b-op', name: 'Barbell Overhead Press', category: 'shoulders', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['shoulders'], defaultWeight: 95, defaultReps: 8, difficulty: 3 },
  { id: 'b-pc', name: 'Power Clean', category: 'back', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['glutes', 'upper_back'], defaultWeight: 95, defaultReps: 3, difficulty: 3 },
  { id: 'b-zs', name: 'Zercher Squat', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'core'], defaultWeight: 95, defaultReps: 8, difficulty: 3 },

  // ─── SPECIALTY BARS ───
  { id: 'sb-ssb', name: 'Safety Squat Bar Squat', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'lower_back'], defaultWeight: 155, defaultReps: 8, difficulty: 3 },
  { id: 'sb-tb', name: 'Trap Bar Deadlift', category: 'legs', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['glutes', 'quads'], defaultWeight: 135, defaultReps: 8, difficulty: 2 },
  { id: 'sb-fb', name: 'Swiss / Football Bar Press', category: 'chest', isMachine: false, type: 'free-weight', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest', 'triceps'], defaultWeight: 95, defaultReps: 10, difficulty: 2 },

  // ─── STRONGMAN ───
  { id: 'st-as', name: 'Atlas Stones', category: 'back', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['lower_back', 'glutes'], defaultWeight: 100, defaultReps: 1, difficulty: 3 },
  { id: 'st-fw', name: "Farmer's Walk Handles", category: 'back', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['forearms', 'traps'], defaultWeight: 100, defaultReps: 1, difficulty: 2 },
  { id: 'st-sy', name: 'Super Yoke Carry', category: 'legs', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['core', 'quads'], defaultWeight: 200, defaultReps: 1, difficulty: 3 },
  { id: 'st-tf', name: 'Heavy Tire Flip', category: 'legs', isMachine: false, type: 'strongman', equipment: 'hardware', mechanics: 'compound', primaryMuscles: ['glutes', 'back'], defaultWeight: 300, defaultReps: 5, difficulty: 3 },
];
