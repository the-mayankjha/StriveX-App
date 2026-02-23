import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, Target, Brain, Activity, Flame } from 'lucide-react';
import { cn } from '../utils/cn';
import { type PlayerStats, calculateRank, getXpRequiredForLevel, RANKS } from '../utils/leveling';
import { useWorkout } from '../hooks/useWorkout';
import { RadarChart } from './RadarChart';

interface ProfilePopupProps {
  stats: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePopup({ stats, isOpen, onClose }: ProfilePopupProps) {
  const { isSoloLevelingMode } = useWorkout();
  const rank = calculateRank(stats.level);
  const rankInfo = RANKS[rank];
  const nextLevelXp = getXpRequiredForLevel(stats.level);
  const xpProgress = (stats.currentXp / nextLevelXp) * 100;

  const statItems = useMemo(() => [
    { label: 'STR', value: stats.strength, icon: Zap, color: 'text-orange-500', max: 50 },
    { label: 'VIT', value: stats.vitality, icon: Shield, color: 'text-green-500', max: 50 },
    { label: 'AGI', value: stats.agility, icon: Activity, color: 'text-blue-500', max: 50 },
    { label: 'PER', value: stats.perception, icon: Target, color: 'text-purple-500', max: 50 },
    { label: 'INT', value: stats.intelligence, icon: Brain, color: 'text-cyan-500', max: 50 },
    { label: 'STRK', value: stats.streak, icon: Flame, color: 'text-red-500', max: 50 },
  ], [stats]);

  const radarData = useMemo(() => statItems
    .filter(item => item.label !== 'STRK')
    .map(item => ({
      label: item.label,
      value: item.value,
      max: item.max
    })), [statItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={cn(
              "w-full max-w-sm bg-surface relative overflow-hidden transition-all duration-500 border-2",
              isSoloLevelingMode 
                ? "border-primary/50 shadow-glow-blue rounded-none" 
                : "border-white/10 shadow-2xl rounded-[2.5rem] p-8"
            )}
            style={isSoloLevelingMode ? {
              clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)'
            } : {}}
          >
            {/* Solo Mode Assets */}
            {isSoloLevelingMode && (
              <>
                {/* Border Lighting Trace */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path
                    d="M 0,0 L 100,0 L 100,90 L 90,100 L 0,100 Z"
                    fill="none"
                    stroke="url(#beam-blue)"
                    strokeWidth="0.8"
                    className="animate-border-beam"
                    strokeDashoffset="0"
                    strokeDasharray="40 160"
                  />
                  <defs>
                    <linearGradient id="beam-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                  <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                </div>
              </>
            )}

            {/* Background Branding Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className={cn("relative z-10 flex flex-col items-center", isSoloLevelingMode && "p-8")}>
              {/* Reset Header for Solo Mode */}
              {isSoloLevelingMode && (
                <div className="absolute top-0 right-12 px-4 py-1 text-[8px] font-black uppercase tracking-[0.3em] border-x border-b border-primary/30 text-primary bg-primary/5">
                  System Stats
                </div>
              )}

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-0 right-0 p-2 rounded-full text-text-muted hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Avatar Section */}
              <div className="relative mb-6">
                <div className={cn(
                  "w-24 h-24 p-1 shadow-xl",
                  isSoloLevelingMode 
                    ? "bg-primary/20 border-2 border-primary rotate-3" 
                    : "rounded-full bg-gradient-to-tr from-primary via-purple-500 to-red-500"
                )}
                style={isSoloLevelingMode ? { clipPath: 'polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%)' } : {}}
                >
                  <div className={cn(
                    "w-full h-full overflow-hidden border-4 border-surface",
                    !isSoloLevelingMode && "rounded-full"
                  )}
                  style={isSoloLevelingMode ? { clipPath: 'polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%)' } : {}}
                  >
                    {stats.avatarUrl ? (
                      <img src={stats.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surfaceHighlight flex items-center justify-center text-2xl font-black text-white">
                        {stats.level}
                      </div>
                    )}
                  </div>
                </div>
                <div className={cn(
                  "absolute -bottom-2 -right-2 font-black text-[10px] px-2 py-1 shadow-lg uppercase tracking-wider transition-all",
                  isSoloLevelingMode 
                    ? "bg-background border border-primary text-primary" 
                    : "bg-primary text-white rounded-lg"
                )}>
                  LVL {stats.level}
                </div>
              </div>

              {/* Rank Section */}
              <div className="text-center mb-6">
                <h2 className={cn(
                  "text-xl font-black uppercase tracking-widest italic mb-1",
                  rankInfo.color,
                  isSoloLevelingMode && "text-hologram"
                )}>
                  {rankInfo.title}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                  Dominating the Shadows
                </p>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full space-y-3 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Progress to Level {stats.level + 1}</span>
                  <span className="text-xs font-black text-primary italic">{Math.round(stats.currentXp)} / {nextLevelXp} XP</span>
                </div>
                <div className={cn(
                  "h-2.5 overflow-hidden p-0.5 ring-1 ring-white/5",
                  isSoloLevelingMode ? "bg-primary/5" : "bg-white/5 rounded-full"
                )}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn(
                      "h-full bg-gradient-to-r from-primary via-blue-400 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]",
                      !isSoloLevelingMode && "rounded-full"
                    )}
                  />
                </div>
              </div>

              {/* Radar Chart Section */}
              <div className="w-full mb-6">
                <RadarChart stats={radarData} isSoloMode={isSoloLevelingMode} />
              </div>

              {/* Stats Grid */}
              <div className="w-full grid grid-cols-3 gap-3">
                {statItems.map((item) => (
                  <div key={item.label} className={cn(
                    "p-3 flex flex-col items-center justify-center border transition-all group",
                    isSoloLevelingMode 
                      ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-none shadow-glow-blue/10" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl"
                  )}>
                    <item.icon className={cn(item.color, "transition-transform group-hover:scale-110 mb-1")} size={isSoloLevelingMode ? 20 : 18} />
                    <span className={cn("text-xs font-black tracking-wider", isSoloLevelingMode ? "text-primary" : "text-white")}>{item.value}</span>
                    <span className="text-[8px] font-black uppercase text-text-muted tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                 <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">
                   System Registered Since 2024
                 </p>
              </div>
            </div>

            {/* Solo Mode Corner Borders */}
            {isSoloLevelingMode && (
              <>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
              </>
            )}

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
