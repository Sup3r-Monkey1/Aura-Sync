// ... existing imports

interface WorkoutState {
  // ... existing state
  activeSetIndex: number; // New: tracks which set we are on in the card
  
  // ... existing actions
  setActiveSet: (index: number) => void;
  // ... existing
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      // ... existing initial state
      activeSetIndex: 0, 

      setActiveSet: (index) => set({ activeSetIndex: index }),

      // MODIFIED completeSet to handle the auto-increment
      completeSet: (cardId, setId) => {
        const { session, muscleHeat, history, evolutionXP, activeSetIndex } = get();
        if (!session) return;
        const card = session.cards.find(c => c.id === cardId);
        const setData = card?.sets.find(s => s.id === setId);
        if (!card || !setData) return;

        const prHit = isPR(card.exercise.id, setData.weight, setData.reps, history);
        set({
          session: {
            ...session,
            cards: session.cards.map(c => c.id !== cardId ? c : {
              ...c,
              sets: c.sets.map(s => s.id === setId ? { ...s, completed: true, timestamp: Date.now(), isPR: prHit } : s)
            }),
          },
          muscleHeat: addHeatFromExercise(muscleHeat, card.exercise, 1),
          evolutionXP: evolutionXP + (prHit ? 50 : 10),
          // We don't increment activeSetIndex here, GhostLog will do it after rest
        });
      },
      // ... rest of store
