import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 4 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-6 text-left">{dots}</span>;
}

export function Leaderboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-fade-in px-4 relative">
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 relative flex items-center justify-center"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20 blur-[2px]"
        />
        <Trophy size={48} className="text-primary relative z-10" />
      </motion.div>
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-[0.1em] text-white italic font-inter leading-tight">
          GLOBAL<br/>RANKINGS
        </h1>
        <p className="text-xs font-bold text-text-muted tracking-[0.2em] uppercase leading-relaxed">
          Compete with hunters worldwide.<br/>
          <span className="text-primary flex items-center justify-center mt-1">
            System initialization pending<LoadingDots />
          </span>
        </p>
      </div>

      <div className="absolute -bottom-10 left-0 right-0 text-center pointer-events-none">
         <p className="text-[8px] sm:text-[10px] font-black uppercase text-text-muted/50 tracking-[0.2em]">
           <span className="text-primary/50 tracking-[0.455em]">StriveX System v1.0.0</span><br/>
           Build by Mayank Jha
         </p>
      </div>
    </div>
  );
}
