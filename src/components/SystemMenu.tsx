import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sword, Dumbbell, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import ElectricBorder from './effects/ElectricBorder';

import { MenuProfile } from './menu/MenuProfile';
import { MenuQuest } from './menu/MenuQuest';
import { MenuBank } from './menu/MenuBank';

const CornerAccents = () => (
  <>
    <div className="absolute top-0 left-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute top-0 left-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute top-0 right-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute top-0 right-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 left-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 left-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 right-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 right-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
  </>
);

interface SystemMenuProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'quest' | 'bank';
}

export function SystemMenu({ isOpen, onClose, initialTab = 'quest' }: SystemMenuProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'quest' | 'bank'>(initialTab);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            const audio = new Audio('/assets/audio/close.wav');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play blocked:', e));
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm h-full max-h-[85vh] relative flex flex-col"
          >
            <ElectricBorder
              color="#3B82F6"
              speed={1}
              chaos={0.12}
              borderRadius={0}
              className="w-full h-full flex flex-col overflow-visible"
            >
              {/* L-Shape Corner Left Top */}
              <div className="absolute -top-[1px] -left-[1px] w-8 h-8 z-30 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <div className="absolute top-0 left-0 w-[3px] h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
              {/* L-Shape Corner Right Bottom */}
              <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 z-30 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-[3px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <div className="absolute bottom-0 right-0 w-[3px] h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>

              <div 
                className="flex-1 flex flex-col w-full h-full min-h-0 bg-background/95 backdrop-blur-3xl relative overflow-hidden"
              >
                {/* Header Container */}
                <div className="shrink-0 relative z-10">
                  {/* Top Bar */}
                  <div className="p-4 pb-3">
                    <div className="flex items-center justify-center relative h-10 w-full hover:cursor-default">
                      {/* Centered Title */}
                      <div className="flex items-center gap-2 pointer-events-none">
                        <AlertCircle className="text-primary animate-pulse" size={20} />
                        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white text-hologram whitespace-nowrap">
                          System Menu
                        </h2>
                      </div>
                    </div>
                  </div>



                  {/* Tab Switcher */}
                  <div className="flex px-2 py-2 gap-1">
                    {[
                      { id: 'profile', icon: User, label: 'Profile' },
                      { id: 'quest', icon: Sword, label: 'Quest' },
                      { id: 'bank', icon: Dumbbell, label: 'Ex Bank' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "flex-1 flex flex-col items-center py-2 gap-1 rounded-none transition-all relative border",
                          activeTab === tab.id 
                            ? "text-primary border-primary/50 bg-primary/5 shadow-[inset_0_0_15px_rgba(59,130,246,0.05)]" 
                            : "text-text-muted hover:text-white border-transparent"
                        )}
                      >
                        <tab.icon size={14} className={activeTab === tab.id ? "animate-pulse" : ""} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                        {activeTab === tab.id && <CornerAccents />}
                      </button>
                    ))}
                  </div>


                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  <AnimatePresence mode="wait">
                    {activeTab === 'profile' && <MenuProfile />}
                    {activeTab === 'quest' && <MenuQuest onAddObjective={() => setActiveTab('bank')} />}
                    {activeTab === 'bank' && <MenuBank onAssignObjective={() => setActiveTab('quest')} />}
                  </AnimatePresence>
                </div>
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                  <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
