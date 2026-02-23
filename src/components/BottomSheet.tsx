import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-surface border-t border-white/5 rounded-t-[32px] overflow-hidden max-w-md mx-auto"
            style={{ maxHeight: '85vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center p-3">
              <div className="w-12 h-1.5 bg-white/10 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-2 flex justify-between items-center bg-surface border-b border-white/5">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
