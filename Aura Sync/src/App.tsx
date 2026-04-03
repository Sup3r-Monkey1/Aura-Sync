import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, Camera, Dna, Users } from 'lucide-react';
import AuraDashboard from './components/AuraDashboard';
import GhostLog from './components/GhostLog';
import FuelVision from './components/FuelVision';
import EvolutionRank from './components/EvolutionRank';
import GymLobby from './components/GymLobby';

type Tab = 'dashboard' | 'ghost' | 'fuel' | 'evolution' | 'lobby';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'HUD', icon: LayoutDashboard },
  { id: 'ghost', label: 'Log', icon: Dumbbell },
  { id: 'fuel', label: 'Fuel', icon: Camera },
  { id: 'evolution', label: 'Rank', icon: Dna },
  { id: 'lobby', label: 'Lobby', icon: Users },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'dashboard' && <AuraDashboard />}
          {tab === 'ghost' && <GhostLog />}
          {tab === 'fuel' && <FuelVision />}
          {tab === 'evolution' && <EvolutionRank />}
          {tab === 'lobby' && <GymLobby />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5">
        <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-col items-center gap-0.5 py-3 px-2 min-w-[56px] min-h-[56px] justify-center"
              >
                <t.icon
                  className={`w-5 h-5 transition-colors ${active ? 'text-cobalt' : 'text-white/20'}`}
                  style={active ? { filter: 'drop-shadow(0 0 6px #2563eb)' } : undefined}
                />
                <span className={`text-[9px] uppercase tracking-wider ${active ? 'text-cobalt' : 'text-white/15'}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
