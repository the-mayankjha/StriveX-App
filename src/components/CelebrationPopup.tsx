import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star } from 'lucide-react';
import { cn } from '../utils/cn';
import { useWorkout } from '../hooks/useWorkout';
import ElectricBorder from './effects/ElectricBorder';


interface CelebrationPopupProps {
  type: 'level-up' | 'quest-complete' | null;
  data?: any;
  onClose: () => void;
}

export function CelebrationPopup({ type, data, onClose }: CelebrationPopupProps) {
  const { isSoloLevelingMode } = useWorkout();

  useEffect(() => {
    if (type) {
      // Trigger Confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      const audio = new Audio(type === 'level-up' ? 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play blocked:', e));

      return () => clearInterval(interval);
    }
  }, [type]);

  return (
    <AnimatePresence>
      {type && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className={cn(
              "w-full max-w-sm relative transition-all duration-500",
              !isSoloLevelingMode && "bg-surface/98 border-2 border-primary/20 shadow-xl rounded-[2rem]",
            )}
          >
            {isSoloLevelingMode ? (
              <ElectricBorder
                color="#3B82F6"
                speed={1.5}
                chaos={0.15}
                borderRadius={0}
                className="w-full"
              >
                <div 
                  className="bg-surface/98 relative overflow-hidden p-6 sm:p-8 space-y-6 sm:space-y-8"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)'
                  }}
                >
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                  </div>

            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary blur-[100px] opacity-20 rounded-full" />
            
            <div className="relative z-10 space-y-6 sm:space-y-8">
              {/* Header Label - Solo Mode Only (Alarm Style) */}
              {isSoloLevelingMode ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  {/* Decorative Ornament */}
                  <div className="opacity-40 animate-pulse">
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-primary">
                      <path d="M10 15 L30 5 L50 15" stroke="currentColor" strokeWidth="1" fill="none" />
                      <circle cx="30" cy="5" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  
                  <div className="flex items-center gap-6 text-primary py-1">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-black">!</span>
                    </div>
                    
                    <h2 className="text-xl font-black uppercase tracking-[0.4em] text-hologram italic">
                      NOTIFICATION
                    </h2>
                    
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-black">!</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>
              ) : (
                <div className="absolute top-0 right-12 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] border-x border-b border-primary/30 text-primary bg-primary/5">
                  Notification
                </div>
              )}

              <div className="space-y-4 sm:space-y-6 text-center pt-4">
                <h2 className={cn(
                  "text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary transition-all duration-300",
                  isSoloLevelingMode && "text-hologram"
                )}>
                  {type === 'level-up' ? "YOU LEVELED UP!" : "QUEST COMPLETED!"}
                </h2>
                
                {isSoloLevelingMode && <div className="h-[2px] w-1/3 mx-auto bg-primary opacity-50" />}

                <p className="text-text-muted font-bold text-sm tracking-widest leading-relaxed uppercase">
                  {type === 'level-up' 
                    ? `SYSTEM: LEVEL ${data?.level || 1} REACHED.`
                    : "DAILY OBJECTIVES ACHIEVED."}
                </p>

                {/* Stat Increases - Level Up Only */}
                {type === 'level-up' && isSoloLevelingMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4 space-y-3"
                  >
                    <div className="text-[10px] font-black text-primary/60 tracking-[0.2em] uppercase">
                      Stat Increases
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {['STR', 'VIT', 'AGI', 'PER', 'INT'].map((stat) => (
                        <div key={stat} className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-primary">+{ (data?.levelsGained || 1) * 2 }</span>
                          <span className="text-[8px] font-bold text-text-muted">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {type === 'level-up' && (
                <div className="flex justify-center gap-6 py-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                    >
                      <Star className="text-primary" size={24} />
                    </motion.div>
                  ))}
                </div>
              )}

                <button
                  onClick={onClose}
                  className={cn(
                    "w-full py-4 sm:py-5 font-black uppercase tracking-[0.4em] transition-all active:scale-[0.98] border-2 relative group overflow-hidden",
                    isSoloLevelingMode 
                      ? "border-primary/50 text-primary hover:bg-primary/10 shadow-glow-blue rounded-none" 
                      : "border-primary/20 text-primary hover:bg-primary/5 rounded-2xl shadow-lg shadow-primary/5"
                  )}
                >
                  <span className="relative z-10 text-xs sm:text-base">Confirm</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                  </button>
                </div>
              </div>

              {/* Decorative Corner Borders - Solo Mode Only */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </ElectricBorder>
          ) : (
            <div className="p-8 space-y-8">
              <div className="absolute top-0 right-12 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] border-x border-b border-primary/30 text-primary bg-primary/5">
                Notification
              </div>

              <div className="space-y-6 text-center pt-4">
                <h2 className="text-3xl font-black uppercase tracking-tight text-primary transition-all duration-300">
                  {type === 'level-up' ? "YOU LEVELED UP!" : "QUEST COMPLETED!"}
                </h2>

                <p className="text-text-muted font-bold text-sm tracking-widest leading-relaxed uppercase">
                  {type === 'level-up' 
                    ? `SYSTEM: LEVEL ${data?.level || 1} REACHED.`
                    : "DAILY OBJECTIVES ACHIEVED."}
                </p>
              </div>

              {type === 'level-up' && (
                <div className="flex justify-center gap-6 py-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                    >
                      <Star className="text-primary" size={24} />
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-5 font-black uppercase tracking-[0.4em] transition-all active:scale-[0.98] border-2 border-primary/20 text-primary hover:bg-primary/5 rounded-2xl shadow-lg shadow-primary/5 relative group overflow-hidden"
              >
                <span className="relative z-10">Confirm</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

