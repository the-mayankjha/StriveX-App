import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ElectricBorder from './effects/ElectricBorder';
import { useWorkout } from '../hooks/useWorkout';

interface SaveNotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveNotificationPopup({ isOpen, onClose }: SaveNotificationPopupProps) {
  const { isSoloLevelingMode } = useWorkout();

  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (isOpen && isSoloLevelingMode && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(e => console.error("Audio play failed:", e));
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }

    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSoloLevelingMode, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => {
            const audio = new Audio('/assets/audio/close.wav');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play blocked:', e));
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-[280px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isSoloLevelingMode ? (
              <ElectricBorder
                color="#3B82F6"
                speed={1.5}
                chaos={0.15}
                borderRadius={4}
                className="w-full"
              >
                <div 
                  className="bg-[#0A0C12]/95 backdrop-blur-md relative overflow-hidden py-8 px-6 text-center shadow-2xl shadow-primary/20"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)'
                  }}
                >
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-blue animate-pulse-slow">
                      <CheckCircle2 className="text-primary" size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white text-hologram animate-pulse mb-1">
                        System Updated
                      </h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                        Quest info successfully saved
                      </p>
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/60" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/60" />
                </div>
              </ElectricBorder>
            ) : (
              <div className="bg-surface border border-white/10 rounded-3xl py-8 px-6 text-center shadow-2xl flex flex-col items-center gap-4">
                 <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-blue">
                    <CheckCircle2 className="text-primary" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-white mb-1">
                      Saved
                    </h2>
                    <p className="text-xs font-bold text-text-muted">
                      Your workout has been updated
                    </p>
                  </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
