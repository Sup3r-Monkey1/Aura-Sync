import type { Exercise } from '../types';

export const workoutRegistry: Exercise[] = [
  // ─── CARDIOVASCULAR ───
  { id: 'c-treadmill', name: 'Treadmill (Motorized/Manual)', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'calves'], secondaryMuscles: ['hamstrings'], defaultWeight: 0, defaultReps: 10, difficulty: 1 },
  { id: 'c-elliptical', name: 'Elliptical Trainer', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['shoulders'], defaultWeight: 0, defaultReps: 10, difficulty: 1 },
  { id: 'c-bike', name: 'Stationary Bike (Upright/Spin)', category: 'cardio', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 10, difficulty: 1 },
  { id: 'c-airbike', name: 'Air Bike (Fan Bike)', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'c-rower', name: 'Rowing Machine (Air/Water)', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['quads', 'biceps'], defaultWeight: 0, defaultReps: 10, difficulty: 2 },
  { id: 'c-stair-climber', name: 'StairClimber / StepMill', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['glutes', 'quads'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'c-skierg', name: 'Ski Erg', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'triceps'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 10, difficulty: 2 },
  { id: 'c-versaclimber', name: 'Vertical Climber', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'shoulders'], secondaryMuscles: ['lats'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'c-jacobs-ladder', name: "Jacob's Ladder", category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'c-arc-trainer', name: 'Arc Trainer', category: 'cardio', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 0, defaultReps: 10, difficulty: 1 },
  { id: 'c-upper-erg', name: 'Upper-Body Ergometer', category: 'cardio', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['shoulders'], secondaryMuscles: ['triceps'], defaultWeight: 0, defaultReps: 10, difficulty: 1 },

  // ─── UPPER BODY STRENGTH ───
  { id: 'u-chest-press', name: 'Chest Press Machine', category: 'chest', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'u-pec-deck', name: 'Pec Deck / Chest Fly', category: 'chest', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'u-shoulder-press', name: 'Shoulder Press Machine', category: 'shoulders', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },
  { id: 'u-lat-raise', name: 'Lateral Raise Machine', category: 'shoulders', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 15, difficulty: 1 },
  { id: 'u-lat-pulldown', name: 'Lat Pulldown', category: 'back', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'u-seated-row', name: 'Seated Row Machine', category: 'back', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'u-assisted-pullup', name: 'Assisted Pull-Up/Dip', category: 'back', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['lats', 'chest'], secondaryMuscles: ['triceps', 'biceps'], defaultWeight: 60, defaultReps: 8, difficulty: 2 },
  { id: 'u-bicep-curl', name: 'Bicep Curl Machine', category: 'biceps', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'u-tricep-ext', name: 'Tricep Extension Machine', category: 'triceps', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'u-tricep-pushdown', name: 'Cable Tricep Pushdown', category: 'triceps', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },

  // ─── LOWER BODY STRENGTH ───
  { id: 'l-leg-press', name: 'Leg Press (Sled/Seated)', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 200, defaultReps: 12, difficulty: 2 },
  { id: 'l-leg-ext', name: 'Leg Extension', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'l-leg-curl', name: 'Leg Curl (Seated/Lying)', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], secondaryMuscles: [], defaultWeight: 70, defaultReps: 12, difficulty: 1 },
  { id: 'l-hack-squat', name: 'Hack Squat Sled', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'calves'], defaultWeight: 140, defaultReps: 10, difficulty: 3 },
  { id: 'l-smith', name: 'Smith Machine Squat', category: 'legs', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 95, defaultReps: 10, difficulty: 2 },
  { id: 'l-abduction', name: 'Hip Abduction/Adduction', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], secondaryMuscles: ['quads'], defaultWeight: 100, defaultReps: 15, difficulty: 1 },
  { id: 'l-glute-drive', name: 'Glute Drive / Hip Thrust', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'l-calf-raise', name: 'Calf Raise Machine', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], secondaryMuscles: [], defaultWeight: 120, defaultReps: 15, difficulty: 1 },
  { id: 'l-rev-hyper', name: 'Reverse Hyperextension', category: 'back', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['lower_back', 'glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 50, defaultReps: 12, difficulty: 2 },

  // ─── CORE & FUNCTIONAL ───
  { id: 'f-functional-trainer', name: 'Functional Trainer / Cable Matrix', category: 'core', equipment: 'cable', mechanics: 'compound', primaryMuscles: ['core'], secondaryMuscles: ['shoulders'], defaultWeight: 40, defaultReps: 12, difficulty: 2 },
  { id: 'f-roman-chair', name: 'Roman Chair / Back Extension', category: 'core', equipment: 'bodyweight', mechanics: 'isolation', primaryMuscles: ['lower_back', 'glutes'], secondaryMuscles: [], defaultWeight: 0, defaultReps: 15, difficulty: 1 },
  { id: 'f-ab-crunch', name: 'Ab Crunch Machine', category: 'core', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: [], defaultWeight: 60, defaultReps: 20, difficulty: 1 },
  { id: 'f-rotary-torso', name: 'Rotary Torso', category: 'core', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'f-trx', name: 'Suspension Trainer (TRX)', category: 'core', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['core'], secondaryMuscles: ['shoulders'], defaultWeight: 0, defaultReps: 12, difficulty: 2 },
  { id: 'f-sled', name: 'Sled Push/Pull (Prowler)', category: 'cardio', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core', 'calves'], defaultWeight: 180, defaultReps: 10, difficulty: 3 },
  { id: 'f-battle-ropes', name: 'Battle Ropes', category: 'cardio', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['shoulders', 'core'], secondaryMuscles: ['forearms'], defaultWeight: 0, defaultReps: 30, difficulty: 3 },
  { id: 'f-plyo-box', name: 'Plyo Box Jumps', category: 'cardio', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['calves'], defaultWeight: 0, defaultReps: 10, difficulty: 3 },
  { id: 'f-peg-board', name: 'Peg Board Climb', category: 'back', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['upper_back', 'forearms'], secondaryMuscles: ['biceps'], defaultWeight: 0, defaultReps: 1, difficulty: 3 },
];

export const CATEGORIES = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'core', 'cardio'] as const;
