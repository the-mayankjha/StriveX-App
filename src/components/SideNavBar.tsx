import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Sword, Dumbbell } from 'lucide-react';
import { cn } from '../utils/cn';
import { useWorkout } from '../hooks/useWorkout';

import { MenuProfile } from './menu/MenuProfile';
import { MenuQuest } from './menu/MenuQuest';
import { MenuBank } from './menu/MenuBank';

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'quest' | 'bank';
}

export function SideNavBar({ isOpen, onClose, initialTab = 'profile' }: SideNavBarProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'quest' | 'bank'>(initialTab);
  const { isSoloLevelingMode } = useWorkout();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              const audio = new Audio('/assets/audio/close.wav');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play blocked:', e));
              onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Slider Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] flex flex-col shadow-2xl overflow-hidden",
              "bg-background/60 backdrop-blur-2xl border-l-[0.5px] border-white/10"
            )}
          >
            {/* Solo Mode Assets */}
            {isSoloLevelingMode && (
              <>
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                  <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                </div>
                {/* Border Lighting */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
              </>
            )}

            {/* Header / Tabs */}
            <div className="p-6 shrink-0 relative z-10 space-y-6">
              <div className="flex items-center justify-between font-black uppercase tracking-tighter italic">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full shadow-glow-blue" />
                  <h2 className="text-2xl text-white">System Menu</h2>
                </div>
                <button 
                  onClick={() => {
                    const audio = new Audio('/assets/audio/close.wav');
                    audio.volume = 0.5;
                    audio.play().catch(err => console.log('Audio play blocked:', err));
                    onClose();
                  }}
                  className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white transition-colors"
                >
                   <X size={20} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 gap-1">
                {[
                  { id: 'profile', icon: User, label: 'Profile' },
                  { id: 'quest', icon: Sword, label: 'Quest' },
                  { id: 'bank', icon: Dumbbell, label: 'Ex Bank' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 flex flex-col items-center py-3 gap-1 rounded-xl transition-all relative overflow-hidden",
                      activeTab === tab.id 
                        ? "text-primary bg-primary/10 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                        : "text-text-muted hover:bg-white/5"
                    )}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? "animate-pulse" : ""} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow-blue" 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-12 relative z-10 transition-all">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && <MenuProfile />}
                {activeTab === 'quest' && <MenuQuest onAddObjective={() => setActiveTab('bank')} />}
                {activeTab === 'bank' && <MenuBank />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
