import { useWorkoutStore } from '../store/useWorkoutStore';

export default function MealNotes() {
  const { mealNotes, updateMealNotes } = useWorkoutStore();

  return (
    <div className="px-4">
      <div className="glass p-4 border-l-2 border-magenta/40">
        <h3 className="text-[10px] font-black text-magenta uppercase tracking-[0.2em] mb-3">Intake Script / Notepad</h3>
        <textarea
          value={mealNotes}
          onChange={(e) => updateMealNotes(e.target.value)}
          placeholder="Script your upcoming meals here..."
          className="w-full h-32 bg-transparent text-xs text-white/60 outline-none resize-none placeholder:text-white/10 leading-relaxed font-mono"
        />
      </div>
    </div>
  );
}
