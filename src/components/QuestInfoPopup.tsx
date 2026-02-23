import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock } from 'lucide-react';
import ElectricBorder from './effects/ElectricBorder';


interface QuestInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  questData: {
    category: string;
    exercises: Array<{ name: string; sets: number; reps: number }>;
  };
}

export function QuestInfoPopup({ isOpen, onClose, questData }: QuestInfoPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="w-full max-w-[340px] relative"
          >
            <ElectricBorder
              color="#3B82F6"
              speed={1.5}
              chaos={0.15}
              borderRadius={4}
              className="w-full h-full"
            >
              <div 
                className="bg-[#0A0C12]/95 backdrop-blur-md relative overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)'
                }}
              >
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                  <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                </div>

            <div className="relative z-10 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 pb-4 border-b border-primary/20">
                <AlertCircle className="text-primary animate-pulse" size={20} />
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white text-hologram">
                  Quest Info
                </h2>
              </div>

              {/* Quest Title */}
              <div className="text-center space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                  Daily Quest
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  {questData.category !== 'rest' 
                    ? `TRAIN TO BECOME A FORMIDABLE COMBATANT`
                    : "REST & RECOVERY ACTIVE"}
                </p>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-system-success/30" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-system-success">Goals</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-system-success/30" />
                </div>

                <div className="space-y-3 px-2">
                  {questData.exercises.length > 0 ? (
                    questData.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-text-muted uppercase tracking-tighter truncate max-w-[180px]">-{ex.name}</span>
                        <span className="font-black text-primary min-w-[60px] text-right">[0/{ex.sets * ex.reps}]</span>
                      </div>
                    ))
                  ) : (

                    <p className="text-center text-xs italic text-text-muted">Rest & Recovery Active</p>
                  )}
                </div>
              </div>

              {/* Caution Section */}
              <div className="pt-4 space-y-2 border-t border-primary/10 text-center">
                <p className="text-[10px] leading-relaxed">
                  <span className="text-accent font-black uppercase tracking-widest mr-1 underline decoration-accent/30 decoration-2 underline-offset-4">Caution!</span>
                  <span className="text-text-muted font-bold"> - If the daily quest remains incomplete, penalties will be given accordingly.</span>
                </p>
              </div>

              {/* Footer Icon */}
              <div className="flex justify-center pt-2">
                <Clock className="text-primary/40" size={32} strokeWidth={1.5} />
              </div>

              {/* Confirm Button */}
              <button
                onClick={onClose}
                className="w-full py-3 mt-4 border border-primary/30 text-primary text-[11px] font-black uppercase tracking-[0.5em] hover:bg-primary/10 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/60" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/60" />
        </ElectricBorder>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
}
