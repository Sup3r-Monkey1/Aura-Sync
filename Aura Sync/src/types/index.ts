export type MuscleGroup =
  | 'chest' | 'upper_back' | 'lats' | 'traps'
  | 'front_delts' | 'side_delts' | 'rear_delts'
  | 'biceps' | 'triceps' | 'forearms'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves'
  | 'core' | 'lower_back' | 'hip_flexors';

export type EquipmentType = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'plate_loaded';

export type Mechanics = 'compound' | 'isolation';

export type Category = 'chest' | 'back' | 'legs' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  equipment: EquipmentType;
  mechanics: Mechanics;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  defaultWeight: number;
  defaultReps: number;
  difficulty: 1 | 2 | 3;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp?: number;
  isPR?: boolean;
}

export interface ExerciseCard {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  startedAt: number;
  endedAt?: number;
  cards: ExerciseCard[];
}

export interface SessionHistory {
  exerciseId: string;
  date: number;
  sets: { weight: number; reps: number }[];
  totalVolume: number;
}

export interface NutritionEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
  verified: boolean;
}

export interface TerminalEvent {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'pr' | 'system';
}

export interface MuscleHeat {
  group: MuscleGroup;
  heat: number;       // 0-100
  lastUpdated: number; // timestamp
}

export interface ReadinessScore {
  score: number;
  zone: 'PEAK' | 'PRIMED' | 'MODERATE' | 'FATIGUED' | 'CRITICAL';
  hrv: number;
  sleepHours: number;
  weeklyStrain: number;
}

export interface OverloadSuggestion {
  exerciseId: string;
  suggestedWeight: number;
  suggestedReps: number;
  delta: number;        // percentage change
  confidence: number;   // 0-100
  lastBest: { weight: number; reps: number } | null;
}
