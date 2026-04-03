import type { Exercise, Category, EquipmentType } from '../types';

/**
 * Fuzzy Search Engine
 *
 * Uses Levenshtein distance to allow typos:
 *   "Bnceh" → matches "Bench Press"
 *   "Chest" → matches "Machine Chest Press" AND "Incline Plate Press" (category)
 */

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Check if a query token fuzzy-matches a target word */
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact substring match — instant win
  if (t.includes(q)) return true;

  // Check each word in target
  const words = t.split(/\s+/);
  for (const word of words) {
    // Prefix match
    if (word.startsWith(q.slice(0, 2))) {
      const maxDist = q.length <= 3 ? 1 : Math.floor(q.length * 0.4);
      if (levenshtein(q, word.slice(0, q.length + 2)) <= maxDist) return true;
    }
    // Full word Levenshtein
    const maxDist = Math.floor(q.length * 0.35);
    if (levenshtein(q, word) <= maxDist) return true;
  }
  return false;
}

/** Score how well a query matches an exercise (higher = better) */
function relevanceScore(query: string, exercise: Exercise): number {
  const q = query.toLowerCase();
  const name = exercise.name.toLowerCase();
  const cat = exercise.category.toLowerCase();

  let score = 0;

  // Exact name match
  if (name === q) score += 100;
  // Name starts with query
  else if (name.startsWith(q)) score += 80;
  // Name contains query
  else if (name.includes(q)) score += 60;
  // Category match
  if (cat.includes(q)) score += 40;

  // Token-level matching
  const tokens = q.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (name.includes(token)) score += 20;
    else if (fuzzyMatch(token, name)) score += 10;
    if (cat.includes(token)) score += 5;
  }

  return score;
}

export interface SearchFilters {
  query?: string;
  category?: Category | 'all';
  equipment?: EquipmentType | 'all';
}

/** Filter and rank exercises by search query and filters */
export function searchExercises(
  exercises: Exercise[],
  filters: SearchFilters
): Exercise[] {
  let results = [...exercises];

  // Category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(e => e.category === filters.category);
  }

  // Equipment filter
  if (filters.equipment && filters.equipment !== 'all') {
    results = results.filter(e => e.equipment === filters.equipment);
  }

  // Text search with fuzzy matching
  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim();
    const tokens = q.split(/\s+/).filter(Boolean);

    results = results.filter(ex => {
      // Every token must match something
      return tokens.every(token =>
        fuzzyMatch(token, ex.name) ||
        fuzzyMatch(token, ex.category) ||
        fuzzyMatch(token, ex.equipment)
      );
    });

    // Sort by relevance
    results.sort((a, b) => relevanceScore(q, b) - relevanceScore(q, a));
  } else {
    // Default sort: by category then name
    results.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }

  return results;
}

/** Group exercises by category */
export function groupByCategory(exercises: Exercise[]): Record<string, Exercise[]> {
  const groups: Record<string, Exercise[]> = {};
  for (const ex of exercises) {
    if (!groups[ex.category]) groups[ex.category] = [];
    groups[ex.category].push(ex);
  }
  return groups;
}
