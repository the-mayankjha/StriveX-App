import { Settings, Shield, Activity, Target, Brain, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkout } from '../../hooks/useWorkout';
import { RadarChart } from '../RadarChart';
import { RANKS, calculateRank } from '../../utils/leveling';
import { cn } from '../../utils/cn';

function SoloHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-2 mt-4 px-2">
      <div className="h-[1px] flex-1 bg-primary/20" />
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">{title}</h4>
      <div className="h-[1px] flex-1 bg-primary/20" />
    </div>
  );
}

export function MenuProfile() {
  const { playerStats, isSoloLevelingMode, setIsSoloLevelingMode } = useWorkout();
  
  const statItems = [
    { label: 'Strength', short: 'STR', value: playerStats.strength, icon: Zap, color: 'text-orange-500', max: 50 },
    { label: 'Vitality', short: 'VIT', value: playerStats.vitality, icon: Shield, color: 'text-green-500', max: 50 },
    { label: 'Agility', short: 'AGI', value: playerStats.agility, icon: Activity, color: 'text-blue-500', max: 50 },
    { label: 'Perception', short: 'PER', value: playerStats.perception, icon: Target, color: 'text-purple-500', max: 50 },
    { label: 'Intelligence', short: 'INT', value: playerStats.intelligence, icon: Brain, color: 'text-cyan-500', max: 50 },
    { label: 'Streak', short: 'STRK', value: playerStats.streak, icon: Flame, color: 'text-red-500', max: 50 },
  ];

  const radarData = statItems.filter(item => item.short !== 'STRK').map(item => ({
    label: item.short, value: item.value, max: item.max
  }));
  const rankKey = calculateRank(playerStats.level);
  const rankInfo = RANKS[rankKey];

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={cn("space-y-6", !isSoloLevelingMode && "space-y-8")}
    >
      {/* PERSONAL INFO */}
      <div className="space-y-3">
        {isSoloLevelingMode && <SoloHeader title="Personal Info" />}
        <div className={cn(
          "flex items-center gap-4 p-4 border relative overflow-hidden cursor-default",
          isSoloLevelingMode ? "bg-[#0b1220] border-primary/20 rounded-sm shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]" : "bg-[#1a1c21] border-white/5 rounded-[1.2rem]"
        )}>
          <div className={cn(
            "w-16 h-16 shrink-0 overflow-hidden border border-white/10 bg-surfaceHighlight",
            isSoloLevelingMode ? "rounded-sm" : "rounded-xl shadow-lg"
          )}>
            {playerStats.avatarUrl ? (
              <img src={playerStats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-xl font-black text-white">
                {playerStats.level}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className={cn("text-xl font-black text-white tracking-wide", !isSoloLevelingMode && "italic")}>LVL {playerStats.level}</h3>
            <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 text-text-muted")}>
              {rankInfo.title} RANK
            </p>
            <div className={cn(
              "flex items-center gap-2 px-2.5 py-1 w-fit",
              isSoloLevelingMode ? "bg-primary/10 border border-primary/20 rounded-sm" : "bg-[#1a2b4b] rounded-full border border-primary/20 shadow-glow-blue/10"
            )}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-blue" />
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active Player</span>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM POTENTIAL ANALYSIS */}
      <div className="space-y-3">
        {isSoloLevelingMode && <SoloHeader title="System Potential Analysis" />}
        <div className={cn(
          "p-6 border relative",
          isSoloLevelingMode ? "bg-[#0b1220] border-primary/20 rounded-sm shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]" : "bg-[#1a1c21] border-white/5 rounded-[1.5rem]"
        )}>
          {!isSoloLevelingMode && <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6 text-center">System Potential Analysis</h4>}
          <div className="pointer-events-none">
             <RadarChart stats={radarData} isSoloMode={isSoloLevelingMode} />
          </div>
        </div>
      </div>

      {/* SYSTEM STATS */}
      <div className="space-y-3">
        {isSoloLevelingMode && <SoloHeader title="System Stats" />}
        <div className="grid grid-cols-2 gap-3">
          {statItems.map((item) => (
            <div key={item.label} className={cn(
              "p-4 border flex items-center gap-4 cursor-default",
              isSoloLevelingMode ? "bg-[#0b1220] border-primary/20 rounded-sm shadow-[inset_0_0_10px_rgba(59,130,246,0.02)] hover:bg-[#121c30] transition-colors" : "bg-[#1a1c21] border-white/5 rounded-[1.2rem]"
            )}>
              <div className={cn(
                "p-2", item.color,
                isSoloLevelingMode ? "bg-transparent" : "rounded-lg border bg-background border-white/5"
              )}>
                <item.icon size={26} strokeWidth={isSoloLevelingMode ? 2 : 2.5} />
              </div>
              <div className={cn("flex flex-col", isSoloLevelingMode && "ml-2")}>
                <div className="text-xl font-black text-white">{item.value}</div>
                <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="space-y-3">
        {isSoloLevelingMode && <SoloHeader title="System Settings" />}
        <div className={cn(
          "p-6 space-y-4 border relative",
          isSoloLevelingMode ? "bg-[#0b1220] border-primary/20 rounded-sm shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]" : "bg-primary/5 border-primary/10 rounded-[2rem]"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              <h4 className="text-sm font-black uppercase tracking-widest text-white">System Config</h4>
            </div>
            <button 
              onClick={() => setIsSoloLevelingMode(!isSoloLevelingMode)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                isSoloLevelingMode ? "bg-primary" : "bg-white/10"
              )}
            >
              <motion.div 
                animate={{ x: isSoloLevelingMode ? 26 : 2 }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
          <p className="text-[10px] text-text-muted font-bold leading-relaxed uppercase tracking-wider">
            Toggle Solo Leveling Mode for high-tech holographic UI and specialized quest alerts.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
