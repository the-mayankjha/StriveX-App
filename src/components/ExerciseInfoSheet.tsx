import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Target, Layers } from 'lucide-react';
import type { QuestExercise } from '../hooks/useWorkout';
import { cn } from '../utils/cn';

interface ExerciseInfoSheetProps {
  exercise: QuestExercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseInfoSheet({ exercise, isOpen, onClose }: ExerciseInfoSheetProps) {
  const [isImgLoading, setIsImgLoading] = useState(true);

  if (!exercise) return null;

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

          {/* Sheet */}
          <motion.div
            initial={{ y: '100vw', opacity: 0 }} // Slightly different entry for premium feel
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-surface rounded-t-[32px] border-t border-white/5 pb-safe max-w-md mx-auto h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="w-full flex justify-center p-4 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-white/10" />
            </div>

            {/* Header */}
            <div className="px-6 flex items-center justify-between shrink-0 mb-4">
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight capitalize">
                {exercise.name}
              </h2>
              <button
                onClick={() => {
                  const audio = new Audio('/assets/audio/close.wav');
                  audio.volume = 0.5;
                  audio.play().catch(e => console.log('Audio play blocked:', e));
                  onClose();
                }}
                className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar">
              {/* Enlarged GIF Container */}
              <div className="aspect-square w-full rounded-3xl bg-surfaceHighlight overflow-hidden mb-6 border border-white/5 relative shadow-inner">
                {exercise.gifUrl ? (
                  <>
                    {isImgLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight animate-pulse">
                        <Dumbbell size={32} className="text-white/10 mb-2" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Loading Asset</span>
                      </div>
                    )}
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      onLoad={() => setIsImgLoading(false)}
                      onError={(e) => {
                        setIsImgLoading(false);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-500",
                        isImgLoading ? "opacity-0" : "opacity-100",
                        "contrast-110 brightness-105" // Subtle filters to pop the low-res GIF
                      )}
                      style={{ imageRendering: 'auto' }} // auto usually handles interpolation better for GIFs
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Dumbbell size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Stats/Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Target size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Target</span>
                  </div>
                  <p className="text-white font-bold capitalize">{exercise.target || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Layers size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Body Part</span>
                  </div>
                  <p className="text-white font-bold capitalize">{exercise.bodyPart || 'N/A'}</p>
                </div>
              </div>

              {/* Routine Details */}
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-4 px-1">
                  Today's Set
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-2xl bg-surfaceHighlight flex flex-col items-center justify-center border border-white/5">
                    <span className="text-3xl font-black text-white">{exercise.sets}</span>
                    <span className="text-[10px] font-black uppercase text-text-muted">Sets</span>
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-surfaceHighlight flex flex-col items-center justify-center border border-white/5">
                    <span className="text-3xl font-black text-white">{exercise.reps}</span>
                    <span className="text-[10px] font-black uppercase text-text-muted">Reps</span>
                  </div>
                </div>
              </div>

              {/* Instructions/Description Placeholder */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-4 px-1">
                  Movement Guide
                </h3>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <p className="text-sm text-text-muted leading-relaxed">
                    Perform this exercise with controlled movements. Focus on the {exercise.target} muscles and maintain proper form throughout the sets.
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pro Tip: Exhale on effort</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
