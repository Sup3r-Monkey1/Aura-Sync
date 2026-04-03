import { useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';

const TYPE_COLORS: Record<string, string> = {
  info: '#3b82f6',
  success: '#00ff88',
  warning: '#f97316',
  pr: '#e535ab',
  system: '#6b7280',
};

export default function BlackBoxTerminal() {
  const terminal = useWorkoutStore(s => s.terminal);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminal]);

  const recent = terminal.slice(-30);

  return (
    <div className="glass-strong w-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <div className="w-2 h-2 bg-[#00ff88] animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
          Black Box — System Log
        </span>
      </div>
      <div
        ref={scrollRef}
        className="h-[120px] overflow-y-auto no-scrollbar px-3 py-2 font-mono text-[11px] leading-5"
      >
        {recent.map(evt => {
          const time = new Date(evt.timestamp);
          const ts = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
          return (
            <div key={evt.id} className="flex gap-2">
              <span className="text-white/25 shrink-0">[{ts}]</span>
              <span style={{ color: TYPE_COLORS[evt.type] || '#3b82f6' }}>
                {evt.message}
              </span>
            </div>
          );
        })}
        <span className="text-[#00ff88] animate-blink">█</span>
      </div>
    </div>
  );
}
