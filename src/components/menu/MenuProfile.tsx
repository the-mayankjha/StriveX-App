import { Settings, Shield, Activity, Target, Brain, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkout } from '../../hooks/useWorkout';
import { RadarChart } from '../RadarChart';
import { RANKS, calculateRank } from '../../utils/leveling';
import { cn } from '../../utils/cn';

export function MenuProfile() {
  const { playerStats, isSoloLevelingMode, setIsSoloLevelingMode } = useWorkout();
  
  const statItems = [
    { label: 'STR', value: playerStats.strength, icon: Zap, color: 'text-orange-500', max: 50 },
    { label: 'VIT', value: playerStats.vitality, icon: Shield, color: 'text-green-500', max: 50 },
    { label: 'AGI', value: playerStats.agility, icon: Activity, color: 'text-blue-500', max: 50 },
    { label: 'PER', value: playerStats.perception, icon: Target, color: 'text-purple-500', max: 50 },
    { label: 'INT', value: playerStats.intelligence, icon: Brain, color: 'text-cyan-500', max: 50 },
    { label: 'STRK', value: playerStats.streak, icon: Flame, color: 'text-red-500', max: 50 },
  ];

  const radarData = statItems.filter(item => item.label !== 'STRK').map(item => ({
    label: item.label, value: item.value, max: item.max
  }));
  const rankKey = calculateRank(playerStats.level);
  const rankInfo = RANKS[rankKey];

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 p-4 bg-[#1a1c21] border border-white/5 rounded-[1.2rem] relative overflow-hidden">
        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-surfaceHighlight shadow-lg">
          {playerStats.avatarUrl ? (
            <img src={playerStats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-xl font-black text-white">
              {playerStats.level}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white italic tracking-wide">LVL {playerStats.level}</h3>
          <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 text-text-muted")}>
            {rankInfo.title} RANK
          </p>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#1a2b4b] rounded-full border border-primary/20 w-fit shadow-glow-blue/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-blue" />
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active Player</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#1a1c21] border border-white/5 rounded-[1.5rem]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6 text-center">System Potential Analysis</h4>
        <div className="pointer-events-none">
           <RadarChart stats={radarData} isSoloMode={isSoloLevelingMode} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="p-4 bg-[#1a1c21] border border-white/5 rounded-[1.2rem] flex items-center gap-4">
            <div className={cn("p-2 rounded-lg bg-background border border-white/5", item.color)}>
              <item.icon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black text-white">{item.value}</div>
              <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-4">
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
    </motion.div>
  );
}
