import { useState, useEffect } from 'react';
import { useWorkout } from '../hooks/useWorkout';
import { X } from 'lucide-react';
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

import { exerciseService, type ExerciseDBItem } from '../services/exerciseService';

export function SystemMenu({ isOpen, onClose, initialTab = 'quest' }: SystemMenuProps) {
  const { isSoloLevelingMode } = useWorkout();
  const [activeTab, setActiveTab] = useState<'profile' | 'quest' | 'bank'>(initialTab);

  // Preload MenuBank Data
  const [apiExercises, setApiExercises] = useState<ExerciseDBItem[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Pre-fetch bank data so tab switch is instant
      if (apiExercises.length === 0) {
        setIsLoadingBank(true);
        exerciseService.getExercises(0, 20).then(res => {
          setApiExercises(res.data);
          setIsLoadingBank(false);
        }).catch(() => setIsLoadingBank(false));
      }
      if (bodyParts.length === 0) {
        Promise.all([
          exerciseService.getBodyParts(),
          exerciseService.getEquipments(),
          exerciseService.getTargetMuscles()
        ]).then(([parts, equs, targets]) => {
          setBodyParts(parts);
          setEquipments(equs);
          setTargetMuscles(targets);
        }).catch(console.error);
      }
    }
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
            {isSoloLevelingMode ? (
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
                <MenuContent 
                  activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} 
                  isSoloLevelingMode={isSoloLevelingMode}
                  bankData={{ apiExercises, setApiExercises, isLoadingBank, setIsLoadingBank, bodyParts, equipments, targetMuscles }}
                />
              </ElectricBorder>
            ) : (
              <div className="w-full h-full flex flex-col overflow-visible bg-[#0a0f18] rounded-2xl border border-white/10 shadow-2xl relative">
                 <MenuContent 
                    activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} 
                    isSoloLevelingMode={isSoloLevelingMode}
                    bankData={{ apiExercises, setApiExercises, isLoadingBank, setIsLoadingBank, bodyParts, equipments, targetMuscles }}
                 />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MenuContent({ activeTab, setActiveTab, onClose, isSoloLevelingMode, bankData }: any) {
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col w-full h-full min-h-0 relative overflow-hidden",
        isSoloLevelingMode ? "bg-background/95 backdrop-blur-3xl" : "bg-transparent rounded-2xl"
      )}
    >
                {/* Header Container */}
                <div className="shrink-0 relative z-10">
                  {/* Top Bar */}
                  <div className="p-4 pb-3">
                    <div className={cn("flex items-center relative h-10 w-full hover:cursor-default", isSoloLevelingMode ? "justify-center" : "justify-between")}>
                      {/* Title */}
                      <div className={cn("flex items-center gap-2 pointer-events-none", !isSoloLevelingMode && "ml-2")}>
                        {isSoloLevelingMode ? (
                          <AlertCircle className="text-primary animate-pulse" size={20} />
                        ) : (
                          <div className="w-1.5 h-6 bg-primary rounded-full mr-1" />
                        )}
                        <h2 className={cn(
                          "text-xl uppercase whitespace-nowrap",
                          isSoloLevelingMode ? "font-black tracking-[0.2em] text-white text-hologram" : "font-black italic tracking-wide text-white"
                        )}>
                          System Menu
                        </h2>
                      </div>

                      {!isSoloLevelingMode && (
                        <button 
                          onClick={() => {
                            const audio = new Audio('/assets/audio/close.wav');
                            audio.volume = 0.5;
                            audio.play().catch(err => console.log('Audio play blocked:', err));
                            onClose();
                          }}
                          className="p-2 bg-white/5 rounded-full text-text-muted hover:text-white transition-colors border border-white/5"
                        >
                           <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>



                  {/* Tab Switcher */}
                  <div className={cn(
                    "flex px-2 py-2 mx-4 mb-2 gap-1 relative",
                    !isSoloLevelingMode && "bg-[#1a1c21] rounded-2xl p-1.5 mx-5 mt-2 shadow-inner"
                  )}>
                    {[
                      { id: 'profile', icon: User, label: 'Profile' },
                      { id: 'quest', icon: Sword, label: 'Quest' },
                      { id: 'bank', icon: Dumbbell, label: 'Ex Bank' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "flex-1 flex flex-col items-center py-2 gap-1 transition-all relative border group",
                          isSoloLevelingMode ? "rounded-none border-transparent hover:bg-primary/5" : "rounded-xl",
                          activeTab === tab.id 
                            ? isSoloLevelingMode
                                ? "text-primary" 
                                : "text-primary border-white/5 bg-[#1e293b] shadow-md"
                            : isSoloLevelingMode
                                ? "text-text-muted hover:text-primary"
                                : "text-text-muted hover:text-white border-transparent"
                        )}
                      >
                        {isSoloLevelingMode && (
                          <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-300", activeTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                            <CornerAccents />
                          </div>
                        )}
                        <tab.icon size={14} className={cn("relative z-10 transition-colors", activeTab === tab.id && isSoloLevelingMode ? "animate-pulse" : "")} />
                        <span className="text-[9px] font-black uppercase tracking-widest relative z-10">{tab.label}</span>
                      </button>
                    ))}
                  </div>


                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  <div className={activeTab === 'profile' ? 'block' : 'hidden'}><MenuProfile /></div>
                  <div className={activeTab === 'quest' ? 'block' : 'hidden'}><MenuQuest onAddObjective={() => setActiveTab('bank')} /></div>
                  <div className={activeTab === 'bank' ? 'block' : 'hidden'}><MenuBank bankData={bankData} /></div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-primary/10 w-full text-center pb-2">
                     <p className="text-[7px] sm:text-[8px] font-black uppercase text-text-muted/50 tracking-[0.2em]">
                       <span className="text-primary/50 tracking-[0.455em]">StriveX System v1.0.0</span><br/>
                       Build by Mayank Jha
                     </p>
                  </div>
                </div>
                
                {/* Scanline Effect */}
                {isSoloLevelingMode && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                  </div>
                )}
              </div>
  );
}
