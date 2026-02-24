import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Target, Brain, Activity, Flame } from 'lucide-react';
import { cn } from '../utils/cn';
import { type PlayerStats, calculateRank, getXpRequiredForLevel, RANKS } from '../utils/leveling';
import { useWorkout } from '../hooks/useWorkout';
import { RadarChart } from './RadarChart';
import ElectricBorder from './effects/ElectricBorder';

interface ProfilePopupProps {
  stats: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
}

function ProfileContent({ stats, isSoloLevelingMode, rankInfo, xpProgress, nextLevelXp, radarData, statItems }: any) {
  return (
    <>
      <div className="relative mb-3 flex justify-center pt-4">
        {/* Level Tag (Solo Mode Specific) - Positioned ABOVE avatar */}
        {isSoloLevelingMode && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-max">
            <div 
              className="bg-surfaceHighlight border border-primary/60 px-3 py-0.5 shadow-glow-blue/40 flex items-center justify-center min-w-[60px]"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}
            >
              <span className="text-[10px] font-black tracking-[0.2em] text-primary whitespace-nowrap uppercase">LVL {stats.level}</span>
            </div>
          </div>
        )}

        <div className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 p-0.5 relative group",
          isSoloLevelingMode 
            ? "bg-primary/30 border border-primary/50 shadow-glow-blue/20" 
            : "rounded-full bg-gradient-to-tr from-primary via-purple-500 to-red-500"
        )}
        style={isSoloLevelingMode ? { clipPath: 'polygon(15% 0%, 100% 0, 100% 85%, 85% 100%, 0 100%, 0% 15%)' } : {}}
        >
          <div className={cn(
            "w-full h-full overflow-hidden border-2 border-surface/50 bg-background",
            !isSoloLevelingMode && "rounded-full"
          )}
          style={isSoloLevelingMode ? { clipPath: 'polygon(15% 0%, 100% 0, 100% 85%, 85% 100%, 0 100%, 0% 15%)' } : {}}
          >
            {stats.avatarUrl ? (
              <img src={stats.avatarUrl} alt="Profile" className="w-full h-full object-cover grayscale-[0.2] contrast-125 hover:grayscale-0 transition-all duration-300" />
            ) : (
              <div className="w-full h-full bg-surfaceHighlight flex items-center justify-center text-3xl font-black text-white italic">
                {stats.level}
              </div>
            )}
          </div>
        </div>

        {/* Outer Frame Decoration (Solo Mode) */}
        {isSoloLevelingMode && (
          <div className="absolute -inset-1.5 border border-primary/10 pointer-events-none -z-10" 
               style={{ clipPath: 'polygon(15% 0%, 100% 0, 100% 85%, 85% 100%, 0 100%, 0% 15%)' }}
          />
        )}
      </div>

      {/* Rank Section */}
      <div className="text-center mb-1.5 sm:mb-3">
        <h2 className={cn(
          "text-lg sm:text-xl font-black uppercase tracking-[0.2em] italic mb-0.5",
          rankInfo.color,
          isSoloLevelingMode && "text-hologram animate-pulse-slow font-inter"
        )}>
          {rankInfo.title}
        </h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-text-muted opacity-80">
          Dominating the Shadows
        </p>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full space-y-1.5 sm:space-y-2 mb-1.5 sm:mb-3 px-4 sm:px-6">
        <div className="flex justify-between items-end">
          <span className="text-[8px] sm:text-[9px] font-black uppercase text-text-muted tracking-widest opacity-60">Progress to Level {stats.level + 1}</span>
          <span className="text-[8px] sm:text-[9px] font-black text-primary italic tracking-tight">{Math.round(stats.currentXp)} <span className="text-text-muted font-bold">/</span> {nextLevelXp} XP</span>
        </div>
        <div className={cn(
          "h-1 overflow-hidden p-0",
          isSoloLevelingMode ? "bg-primary/5 border border-primary/20" : "bg-white/5 rounded-full"
        )}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={cn(
              "h-full bg-primary shadow-glow-blue",
              !isSoloLevelingMode && "rounded-full"
            )}
          />
        </div>
      </div>

      {/* Radar Chart Section */}
      <div className="w-full mb-2 flex justify-center">
        <RadarChart stats={radarData} isSoloMode={isSoloLevelingMode} />
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-3 gap-0.5 sm:gap-1 px-1 sm:px-3">
        {statItems.map((item: any) => (
          <div key={item.label} className={cn(
            "p-1 sm:p-1.5 py-1 sm:py-2 flex flex-col items-center justify-center border transition-all group relative",
            isSoloLevelingMode 
              ? "bg-primary/5 border-primary/10 hover:bg-primary/10 hover:border-primary/30 rounded-none shadow-[inset_0_0_10px_rgba(59,130,246,0.05)]" 
              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 rounded-2xl"
          )}>
            {/* Corner Accent for Solo Mode */}
            {isSoloLevelingMode && (
               <div className="absolute top-0 right-0 w-1 h-1 bg-primary/30" />
            )}
            
            <item.icon className={cn(item.color, "transition-transform group-hover:scale-110 mb-0.5 sm:mb-1 opacity-80")} size={isSoloLevelingMode ? 16 : 14} />
            <span className={cn("text-[10px] sm:text-xs font-black tracking-widest", isSoloLevelingMode ? "text-primary/90" : "text-white")}>{item.value}</span>
            <span className="text-[6px] sm:text-[7px] font-black uppercase text-text-muted tracking-widest opacity-50">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-primary/10 w-full text-center pb-2">
         <p className="text-[7px] sm:text-[8px] font-black uppercase text-text-muted/50 tracking-[0.2em]">
           <span className="text-primary/50 tracking-[0.455em]">StriveX System v{__APP_VERSION__}</span><br/>
           Build by Mayank Jha
         </p>
      </div>
    </>
  );
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
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full max-w-sm relative transition-all duration-500",
              isSoloLevelingMode ? "rounded-none" : "bg-surface border-2 border-white/10 shadow-2xl rounded-[2.5rem] p-6 sm:p-8"
            )}
          >
            {isSoloLevelingMode ? (
              <ElectricBorder
                color="#3B82F6"
                speed={1}
                chaos={0.12}
                borderRadius={0}
                className="w-full overflow-visible"
              >
                <div 
                  className="p-4 pt-10 sm:p-6 sm:pt-12 relative max-h-[85vh] overflow-y-auto no-scrollbar bg-background/60 backdrop-blur-2xl"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
                >
                   {/* Scanline Effect */}
                   <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                  </div>
                  
                  {/* Background Branding Glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                  <div className="relative z-20 flex flex-col items-center">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.4em] border border-primary/40 text-primary bg-background/80 backdrop-blur-sm z-30">
                      System Stats
                    </div>



                    <ProfileContent 
                      stats={stats} 
                      isSoloLevelingMode={isSoloLevelingMode}
                      rankInfo={rankInfo}
                      xpProgress={xpProgress}
                      nextLevelXp={nextLevelXp}
                      radarData={radarData}
                      statItems={statItems}
                    />
                  </div>
                  
                  {/* Solo Mode Corner Borders */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
                </div>
              </ElectricBorder>
            ) : (
              <div className="relative">
                {/* Background Branding Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">


                  <ProfileContent 
                    stats={stats} 
                    isSoloLevelingMode={isSoloLevelingMode}
                    rankInfo={rankInfo}
                    xpProgress={xpProgress}
                    nextLevelXp={nextLevelXp}
                    radarData={radarData}
                    statItems={statItems}
                  />
                </div>
              </div>
            )}

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
