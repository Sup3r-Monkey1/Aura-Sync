// ... existing imports

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // ── 🧼 THE CLEAN SLATE (Starting at 0) ──────────────
      session: null,
      isResting: false,
      restSeconds: 90,
      history: [], // No past workouts
      muscleHeat: createEmptyHeatmap(), // All muscles at 0%
      nutrition: [], // No meals logged
      readiness: calculateReadiness(simulateHRV(), simulateSleep(), 0),
      terminal: [makeTerminalEvent('AURA SYNC v2.0 initialized', 'system')],
      evolutionXP: 0, // 0 XP
      totalWorkouts: 0, // 0 Sessions
      watchConnected: false,

      // ... existing actions (startSession, addNutrition, etc.)

      // ── 🛡️ THE HARD RESET LOGIC ────────────────────────
      hardReset: () => {
        // This clears the store and the persistence layer
        set({
          history: [],
          muscleHeat: createEmptyHeatmap(),
          nutrition: [],
          evolutionXP: 0,
          totalWorkouts: 0,
          terminal: [makeTerminalEvent('SYSTEM WIPE COMPLETE. AURA RESET TO 0.', 'warning')],
          session: null
        });
        // Optional: Force a reload to ensure a totally clean state
        window.location.reload();
      },
      
      // ... rest of the store
    }),
    {
      name: 'aura-sync-storage', // This is your "aura_stats" key in LocalStorage
      // partialize ensures only what we want is saved
    }
  )
);
