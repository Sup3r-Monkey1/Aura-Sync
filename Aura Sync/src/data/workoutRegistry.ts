import type { Exercise } from '../types';

export const workoutRegistry: Exercise[] = [
  // ═══ CHEST ═══
  { id: 'bb-flat-bench', name: 'Barbell Bench Press', category: 'chest', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'bb-incline-bench', name: 'Incline Barbell Press', category: 'chest', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 115, defaultReps: 10, difficulty: 2 },
  { id: 'bb-decline-bench', name: 'Decline Barbell Press', category: 'chest', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'db-flat-bench', name: 'Dumbbell Bench Press', category: 'chest', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 50, defaultReps: 10, difficulty: 2 },
  { id: 'db-incline-bench', name: 'Incline Dumbbell Press', category: 'chest', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 45, defaultReps: 10, difficulty: 2 },
  { id: 'db-fly', name: 'Dumbbell Fly', category: 'chest', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 30, defaultReps: 12, difficulty: 1 },
  { id: 'machine-chest-press', name: 'Machine Chest Press', category: 'chest', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'pec-deck', name: 'Pec Deck Machine', category: 'chest', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: [], defaultWeight: 100, defaultReps: 12, difficulty: 1 },
  { id: 'cable-crossover', name: 'Cable Crossover', category: 'chest', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts'], defaultWeight: 30, defaultReps: 12, difficulty: 1 },
  { id: 'plate-incline-press', name: 'Incline Plate Press', category: 'chest', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['chest'], secondaryMuscles: ['front_delts', 'triceps'], defaultWeight: 90, defaultReps: 10, difficulty: 1 },

  // ═══ BACK ═══
  { id: 'bb-row', name: 'Barbell Row', category: 'back', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['biceps', 'rear_delts'], defaultWeight: 135, defaultReps: 10, difficulty: 2 },
  { id: 'bb-deadlift', name: 'Conventional Deadlift', category: 'back', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['lower_back', 'hamstrings', 'glutes'], secondaryMuscles: ['upper_back', 'traps', 'forearms'], defaultWeight: 225, defaultReps: 5, difficulty: 3 },
  { id: 'db-row', name: 'Single-Arm Dumbbell Row', category: 'back', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps', 'rear_delts'], defaultWeight: 60, defaultReps: 10, difficulty: 1 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', equipment: 'cable', mechanics: 'compound', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'upper_back'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'back', equipment: 'cable', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['biceps', 'rear_delts'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'tbar-row', name: 'T-Bar Row', category: 'back', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['biceps', 'rear_delts', 'lower_back'], defaultWeight: 90, defaultReps: 10, difficulty: 2 },
  { id: 'machine-row', name: 'Machine Seated Row', category: 'back', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['upper_back', 'lats'], secondaryMuscles: ['biceps'], defaultWeight: 100, defaultReps: 10, difficulty: 1 },
  { id: 'pullup', name: 'Pull-Up', category: 'back', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['lats', 'upper_back'], secondaryMuscles: ['biceps', 'forearms'], defaultWeight: 0, defaultReps: 8, difficulty: 3 },
  { id: 'face-pull', name: 'Face Pull', category: 'back', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['rear_delts', 'upper_back'], secondaryMuscles: ['traps'], defaultWeight: 40, defaultReps: 15, difficulty: 1 },

  // ═══ LEGS ═══
  { id: 'bb-squat', name: 'Barbell Back Squat', category: 'legs', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'core', 'lower_back'], defaultWeight: 185, defaultReps: 8, difficulty: 3 },
  { id: 'bb-front-squat', name: 'Front Squat', category: 'legs', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes', 'core'], defaultWeight: 135, defaultReps: 8, difficulty: 3 },
  { id: 'bb-rdl', name: 'Romanian Deadlift', category: 'legs', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['hamstrings', 'glutes'], secondaryMuscles: ['lower_back'], defaultWeight: 155, defaultReps: 10, difficulty: 2 },
  { id: 'leg-press', name: 'Leg Press', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 270, defaultReps: 10, difficulty: 1 },
  { id: 'hack-squat', name: 'Hack Squat', category: 'legs', equipment: 'plate_loaded', mechanics: 'compound', primaryMuscles: ['quads'], secondaryMuscles: ['glutes'], defaultWeight: 180, defaultReps: 10, difficulty: 2 },
  { id: 'leg-extension', name: 'Leg Extension', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['quads'], secondaryMuscles: [], defaultWeight: 100, defaultReps: 12, difficulty: 1 },
  { id: 'leg-curl', name: 'Lying Leg Curl', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], secondaryMuscles: [], defaultWeight: 80, defaultReps: 12, difficulty: 1 },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['hamstrings'], secondaryMuscles: [], defaultWeight: 90, defaultReps: 12, difficulty: 1 },
  { id: 'calf-raise', name: 'Standing Calf Raise', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], secondaryMuscles: [], defaultWeight: 150, defaultReps: 15, difficulty: 1 },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'legs', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['calves'], secondaryMuscles: [], defaultWeight: 90, defaultReps: 15, difficulty: 1 },
  { id: 'hip-thrust', name: 'Barbell Hip Thrust', category: 'legs', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['glutes'], secondaryMuscles: ['hamstrings'], defaultWeight: 185, defaultReps: 10, difficulty: 2 },
  { id: 'db-lunge', name: 'Dumbbell Walking Lunge', category: 'legs', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'core'], defaultWeight: 40, defaultReps: 12, difficulty: 2 },
  { id: 'db-goblet-squat', name: 'Goblet Squat', category: 'legs', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['core'], defaultWeight: 50, defaultReps: 12, difficulty: 1 },

  // ═══ SHOULDERS ═══
  { id: 'bb-ohp', name: 'Overhead Barbell Press', category: 'shoulders', equipment: 'barbell', mechanics: 'compound', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps', 'core'], defaultWeight: 95, defaultReps: 8, difficulty: 2 },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'], defaultWeight: 40, defaultReps: 10, difficulty: 2 },
  { id: 'arnold-press', name: 'Arnold Press', category: 'shoulders', equipment: 'dumbbell', mechanics: 'compound', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'], defaultWeight: 35, defaultReps: 10, difficulty: 2 },
  { id: 'db-lateral-raise', name: 'Dumbbell Lateral Raise', category: 'shoulders', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 20, defaultReps: 15, difficulty: 1 },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'shoulders', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['side_delts'], secondaryMuscles: [], defaultWeight: 15, defaultReps: 15, difficulty: 1 },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', category: 'shoulders', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['front_delts', 'side_delts'], secondaryMuscles: ['triceps'], defaultWeight: 80, defaultReps: 10, difficulty: 1 },
  { id: 'db-rear-fly', name: 'Reverse Dumbbell Fly', category: 'shoulders', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['rear_delts'], secondaryMuscles: ['upper_back'], defaultWeight: 15, defaultReps: 15, difficulty: 1 },
  { id: 'db-front-raise', name: 'Front Raise', category: 'shoulders', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['front_delts'], secondaryMuscles: [], defaultWeight: 20, defaultReps: 12, difficulty: 1 },
  { id: 'db-shrug', name: 'Dumbbell Shrug', category: 'shoulders', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['traps'], secondaryMuscles: [], defaultWeight: 60, defaultReps: 12, difficulty: 1 },

  // ═══ BICEPS ═══
  { id: 'bb-curl', name: 'Barbell Curl', category: 'biceps', equipment: 'barbell', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], defaultWeight: 65, defaultReps: 10, difficulty: 1 },
  { id: 'db-curl', name: 'Dumbbell Curl', category: 'biceps', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], defaultWeight: 30, defaultReps: 12, difficulty: 1 },
  { id: 'db-hammer-curl', name: 'Hammer Curl', category: 'biceps', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['biceps', 'forearms'], secondaryMuscles: [], defaultWeight: 30, defaultReps: 12, difficulty: 1 },
  { id: 'cable-curl', name: 'Cable Bicep Curl', category: 'biceps', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], defaultWeight: 40, defaultReps: 12, difficulty: 1 },
  { id: 'preacher-curl', name: 'Preacher Curl Machine', category: 'biceps', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Curl', category: 'biceps', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['biceps'], secondaryMuscles: [], defaultWeight: 25, defaultReps: 10, difficulty: 1 },

  // ═══ TRICEPS ═══
  { id: 'cable-pushdown', name: 'Cable Tricep Pushdown', category: 'triceps', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 50, defaultReps: 12, difficulty: 1 },
  { id: 'cable-overhead-ext', name: 'Overhead Cable Extension', category: 'triceps', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 40, defaultReps: 12, difficulty: 1 },
  { id: 'bb-skullcrusher', name: 'Skull Crusher', category: 'triceps', equipment: 'barbell', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 55, defaultReps: 10, difficulty: 2 },
  { id: 'db-kickback', name: 'Dumbbell Kickback', category: 'triceps', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 20, defaultReps: 12, difficulty: 1 },
  { id: 'dip', name: 'Dip', category: 'triceps', equipment: 'bodyweight', mechanics: 'compound', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front_delts'], defaultWeight: 0, defaultReps: 10, difficulty: 2 },
  { id: 'tricep-dip-machine', name: 'Tricep Dip Machine', category: 'triceps', equipment: 'machine', mechanics: 'compound', primaryMuscles: ['triceps'], secondaryMuscles: ['chest'], defaultWeight: 120, defaultReps: 10, difficulty: 1 },
  { id: 'db-overhead-ext', name: 'Dumbbell Overhead Extension', category: 'triceps', equipment: 'dumbbell', mechanics: 'isolation', primaryMuscles: ['triceps'], secondaryMuscles: [], defaultWeight: 35, defaultReps: 12, difficulty: 1 },

  // ═══ CORE ═══
  { id: 'cable-crunch', name: 'Cable Crunch', category: 'core', equipment: 'cable', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: ['hip_flexors'], defaultWeight: 60, defaultReps: 15, difficulty: 1 },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'core', equipment: 'bodyweight', mechanics: 'isolation', primaryMuscles: ['core', 'hip_flexors'], secondaryMuscles: [], defaultWeight: 0, defaultReps: 12, difficulty: 2 },
  { id: 'plank', name: 'Plank', category: 'core', equipment: 'bodyweight', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: ['lower_back'], defaultWeight: 0, defaultReps: 60, difficulty: 1 },
  { id: 'ab-machine', name: 'Ab Crunch Machine', category: 'core', equipment: 'machine', mechanics: 'isolation', primaryMuscles: ['core'], secondaryMuscles: [], defaultWeight: 70, defaultReps: 15, difficulty: 1 },
];

export const CATEGORIES = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'core'] as const;

export const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  cable: 'Cable',
  bodyweight: 'Bodyweight',
  plate_loaded: 'Plate Loaded',
};

export const EQUIPMENT_COLORS: Record<string, string> = {
  barbell: '#3b82f6',
  dumbbell: '#8b5cf6',
  machine: '#06b6d4',
  cable: '#10b981',
  bodyweight: '#f59e0b',
  plate_loaded: '#ef4444',
};
