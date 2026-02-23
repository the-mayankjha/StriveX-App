import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Sword, Dumbbell, Zap, Shield, Target, Brain, Activity, Flame, Settings, Search, SlidersHorizontal, Plus, Trash2, Loader2, Moon } from 'lucide-react';
import { cn } from '../utils/cn';
import { useWorkout, type QuestExercise } from '../hooks/useWorkout';
import { RadarChart } from './RadarChart';
import { RANKS, calculateRank } from '../utils/leveling';
import { exerciseService, type ExerciseDBItem } from '../services/exerciseService';

const CATEGORIES = [
  { id: 'push', label: 'Push', icon: Flame },
  { id: 'pull', label: 'Pull', icon: Dumbbell },
  { id: 'legs', label: 'Legs', icon: Activity },
  { id: 'strength', label: 'Strength', icon: Zap },
  { id: 'cardio', label: 'Cardio', icon: Target },
  { id: 'yoga', label: 'Yoga', icon: Brain },
  { id: 'rest', label: 'Rest', icon: Moon },
];

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'quest' | 'bank';
}

export function SideNavBar({ isOpen, onClose, initialTab = 'profile' }: SideNavBarProps) {
  const { 
    playerStats, 
    isSoloLevelingMode, 
    setIsSoloLevelingMode,
    weeklyQuest,
    updateDailyQuest,
    dailyProgress
  } = useWorkout();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'quest' | 'bank'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Bank State
  const [searchQuery, setSearchQuery] = useState('');
  const [apiExercises, setApiExercises] = useState<ExerciseDBItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedTargetMuscle, setSelectedTargetMuscle] = useState<string | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<'bodyPart' | 'muscle' | 'equipment'>('bodyPart');
  
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);

  // Fetch Exercises in Bank
  useEffect(() => {
    if (!isOpen || activeTab !== 'bank') return;

    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        let result;
        const activeFilters = [
          searchQuery.trim(),
          selectedBodyPart,
          selectedTargetMuscle,
          selectedEquipment
        ].filter(Boolean);

        if (activeFilters.length > 1 || (searchQuery.trim().length > 0 && searchQuery.trim().length <= 2)) {
          result = await exerciseService.searchExercises(activeFilters.join(' '));
        } else if (searchQuery.trim().length > 2) {
          result = await exerciseService.searchExercises(searchQuery);
        } else if (selectedBodyPart) {
          result = await exerciseService.getExercisesByBodyPart(selectedBodyPart);
        } else if (selectedEquipment) {
          result = await exerciseService.getExercisesByEquipment(selectedEquipment);
        } else if (selectedTargetMuscle) {
          result = await exerciseService.getExercisesByTarget(selectedTargetMuscle);
        } else {
          result = await exerciseService.getExercises(0, 20);
        }
        setApiExercises(result.data);
      } catch (err) {
        console.error('Error fetching exercises in slider:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchExercises, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedBodyPart, selectedEquipment, selectedTargetMuscle, activeTab, isOpen]);

  // Fetch Filters
  useEffect(() => {
    if (!isOpen) return;
    
    // Only fetch if we don't have data yet
    if (bodyParts.length > 0 && equipments.length > 0 && targetMuscles.length > 0) return;

    const fetchFilters = async () => {
      try {
        const [parts, equs, targets] = await Promise.all([
          exerciseService.getBodyParts(),
          exerciseService.getEquipments(),
          exerciseService.getTargetMuscles()
        ]);
        setBodyParts(parts);
        setEquipments(equs);
        setTargetMuscles(targets);
      } catch (err) {
        console.error('Error fetching filters in slider:', err);
      }
    };
    fetchFilters();
  }, [isOpen, bodyParts.length, equipments.length, targetMuscles.length]);

  const today = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()], []);
  const dailyQuest = weeklyQuest[today] || { category: 'rest', exercises: [] };

  const statItems = useMemo(() => [
    { label: 'STR', value: playerStats.strength, icon: Zap, color: 'text-orange-500', max: 50 },
    { label: 'VIT', value: playerStats.vitality, icon: Shield, color: 'text-green-500', max: 50 },
    { label: 'AGI', value: playerStats.agility, icon: Activity, color: 'text-blue-500', max: 50 },
    { label: 'PER', value: playerStats.perception, icon: Target, color: 'text-purple-500', max: 50 },
    { label: 'INT', value: playerStats.intelligence, icon: Brain, color: 'text-cyan-500', max: 50 },
    { label: 'STRK', value: playerStats.streak, icon: Flame, color: 'text-red-500', max: 50 },
  ], [playerStats]);

  const radarData = useMemo(() => statItems
    .filter(item => item.label !== 'STRK')
    .map(item => ({
      label: item.label,
      value: item.value,
      max: item.max
    })), [statItems]);

  const rankKey = calculateRank(playerStats.level);
  const rankInfo = RANKS[rankKey];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Slider Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface z-[101] flex flex-col border-l border-white/5 shadow-2xl overflow-hidden",
              isSoloLevelingMode && "rounded-none"
            )}
          >
            {/* Solo Mode Assets */}
            {isSoloLevelingMode && (
              <>
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                  <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline" />
                </div>
                {/* Border Lighting */}
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
              </>
            )}

            {/* Header / Tabs */}
            <div className="p-6 shrink-0 relative z-10 space-y-6">
              <div className="flex items-center justify-between font-black uppercase tracking-tighter italic">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full shadow-glow-blue" />
                  <h2 className="text-2xl text-white">System Menu</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 text-text-muted hover:text-white transition-colors"
                >
                   <X size={20} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 gap-1">
                {[
                  { id: 'profile', icon: User, label: 'Profile' },
                  { id: 'quest', icon: Sword, label: 'Quest' },
                  { id: 'bank', icon: Dumbbell, label: 'Ex Bank' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 flex flex-col items-center py-3 gap-1 rounded-xl transition-all relative overflow-hidden",
                      activeTab === tab.id 
                        ? "text-primary bg-primary/10 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                        : "text-text-muted hover:bg-white/5"
                    )}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? "animate-pulse" : ""} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow-blue" 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-12 relative z-10 transition-all">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Simplified Profile Section */}
                    <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-[2rem] relative overflow-hidden group">
                       <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/20 bg-surfaceHighlight">
                         {playerStats.avatarUrl ? (
                           <img src={playerStats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-2xl font-black text-white">
                             {playerStats.level}
                           </div>
                         )}
                       </div>
                       <div>
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">LVL {playerStats.level}</h3>
                         <p className={cn("text-xs font-black uppercase tracking-[0.3em] mb-3", rankInfo.color)}>
                           {rankInfo.title} Rank
                         </p>
                         <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                           <span className="text-[10px] font-black text-primary uppercase">Active Player</span>
                         </div>
                       </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6 text-center">System Potential Analysis</h4>
                      <RadarChart stats={radarData} isSoloMode={isSoloLevelingMode} />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {statItems.map((item) => (
                        <div key={item.label} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                          <div className={cn("p-3 rounded-xl bg-background border border-white/5", item.color)}>
                            <item.icon size={20} />
                          </div>
                          <div>
                            <div className="text-lg font-black text-white">{item.value}</div>
                            <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">{item.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Solo Leveling Settings */}
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
                )}

                {activeTab === 'quest' && (
                  <motion.div
                    key="quest"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Active Protocol</h4>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map(cat => {
                            const isSelected = dailyQuest.category === cat.id;
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => updateDailyQuest(today, { ...dailyQuest, category: cat.id })}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                                  isSelected 
                                    ? "bg-primary border-primary text-white shadow-glow-blue/20" 
                                    : "bg-white/5 border-white/5 text-text-muted hover:border-white/20"
                                )}
                              >
                                <Icon size={12} />
                                {cat.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-6 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sword size={48} />
                         </div>
                         <h3 className="text-2xl font-black text-white italic truncate capitalize">{dailyQuest.category} Protocol</h3>
                         <p className="text-xs text-text-muted mt-2 font-bold uppercase tracking-widest">
                           {dailyQuest.exercises.length} Active Objectives • {dailyQuest.exercises.length * 15} MIN EST
                         </p>
                      </div>

                      <div className="space-y-3">
                         <div className="flex items-center justify-between px-1">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Objectives</h4>
                           <button 
                             onClick={() => setActiveTab('bank')}
                             className="text-[10px] font-black uppercase text-primary hover:underline transition-all"
                           >
                             + Add Sub-objective
                           </button>
                         </div>
                         
                         {dailyQuest.exercises.length > 0 ? (
                           dailyQuest.exercises.map(ex => {
                             const isDone = dailyProgress.statuses[ex.id] === 'completed';
                             const isSkipped = dailyProgress.statuses[ex.id] === 'skipped';
                             
                             return (
                               <div key={ex.id} className={cn(
                                 "p-4 rounded-2xl border transition-all space-y-4",
                                 isDone ? "bg-primary/5 border-primary/30" : 
                                 isSkipped ? "bg-red-500/5 border-red-500/20" :
                                 "bg-white/5 border-white/5"
                               )}>
                                 <div className="flex flex-wrap items-center justify-between gap-4">
                                   <div className="flex gap-4 flex-1 min-w-[150px]">
                                     <div className={cn(
                                       "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors",
                                       isDone ? "border-primary text-primary bg-primary/10 shadow-glow-blue/20" : 
                                       isSkipped ? "border-red-500/50 text-red-500 bg-red-500/10" :
                                       "border-white/10 text-white/20"
                                     )}>
                                       <Sword size={20} />
                                     </div>
                                     <div className="min-w-0">
                                       <h5 className={cn("text-xs font-black uppercase tracking-wide truncate", isDone ? "text-primary" : "text-white")}>
                                         {ex.name}
                                       </h5>
                                       <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter bg-white/5 px-1.5 rounded mt-1 inline-block">
                                         {ex.target}
                                       </span>
                                     </div>
                                   </div>

                                   <div className="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                     <div className="flex items-center gap-2">
                                       <span className="text-[8px] font-black text-text-muted uppercase">Intensity</span>
                                       <span className="text-xs font-black text-white bg-surfaceHighlight px-2 py-0.5 rounded border border-white/5">{ex.sets}x{ex.reps}</span>
                                     </div>
                                     <button 
                                       onClick={() => {
                                         const newExercises = dailyQuest.exercises.filter(e => e.id !== ex.id);
                                         updateDailyQuest(today, { ...dailyQuest, exercises: newExercises });
                                       }}
                                       className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                     >
                                       <Trash2 size={14} />
                                     </button>
                                   </div>
                                 </div>
                               </div>
                             );
                           })
                         ) : (
                           <div className="p-8 text-center text-text-muted italic text-xs border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3">
                             <span>No protocol assigned for today.</span>
                             <button 
                               onClick={() => setActiveTab('bank')}
                               className="text-primary font-black uppercase text-[10px] tracking-widest border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all"
                             >
                               Assign Objectives
                             </button>
                           </div>
                         )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'bank' && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="text"
                          placeholder="Summon Exercise..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/30"
                        />
                        <button 
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border transition-all",
                            isFilterOpen || selectedBodyPart || selectedEquipment || selectedTargetMuscle
                              ? "bg-primary/10 border-primary text-primary" 
                              : "bg-white/5 border-white/5 text-text-muted hover:text-white"
                          )}
                        >
                          <SlidersHorizontal size={16} />
                        </button>
                      </div>

                      {/* Filter Overlay */}
                      <AnimatePresence>
                        {isFilterOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-4 border-b border-white/5 pb-4"
                          >
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 gap-1">
                              {['bodyPart', 'muscle', 'equipment'].map((fTab) => (
                                <button
                                  key={fTab}
                                  onClick={() => setActiveFilterTab(fTab as any)}
                                  className={cn(
                                    "flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                                    activeFilterTab === fTab ? "bg-primary text-white" : "text-text-muted hover:bg-white/5"
                                  )}
                                >
                                  {fTab.replace('Part', '')}
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                              {activeFilterTab === 'bodyPart' && bodyParts.map(part => (
                                <button
                                  key={part}
                                  onClick={() => setSelectedBodyPart(prev => prev === part ? null : part)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border uppercase",
                                    selectedBodyPart === part ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-text-muted"
                                  )}
                                >
                                  {part}
                                </button>
                              ))}
                              {activeFilterTab === 'muscle' && targetMuscles.map(m => (
                                <button
                                  key={m}
                                  onClick={() => setSelectedTargetMuscle(prev => prev === m ? null : m)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border uppercase",
                                    selectedTargetMuscle === m ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-text-muted"
                                  )}
                                >
                                  {m}
                                </button>
                              ))}
                              {activeFilterTab === 'equipment' && equipments.map(e => (
                                <button
                                  key={e}
                                  onClick={() => setSelectedEquipment(prev => prev === e ? null : e)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border uppercase",
                                    selectedEquipment === e ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-text-muted"
                                  )}
                                >
                                  {e}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3">
                       {isLoading ? (
                         <div className="flex flex-col items-center justify-center py-20 gap-4">
                           <Loader2 size={32} className="text-primary animate-spin" />
                           <span className="text-[10px] font-black uppercase text-primary animate-pulse tracking-widest">Scanning Repository...</span>
                         </div>
                       ) : apiExercises.map(ex => (
                         <button
                           key={ex.exerciseId}
                           onClick={() => {
                             const newEx: QuestExercise = {
                               id: `${ex.exerciseId}_${Date.now()}`,
                               name: ex.name,
                               sets: 3,
                               reps: 10,
                               gifUrl: ex.gifUrl,
                               target: ex.targetMuscles[0],
                               bodyPart: ex.bodyParts[0]
                             };
                             updateDailyQuest(today, { ...dailyQuest, exercises: [...dailyQuest.exercises, newEx] });
                             setActiveTab('quest');
                           }}
                           className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-all group text-left"
                         >
                           <div className="w-14 h-14 shrink-0 rounded-xl bg-surfaceHighlight overflow-hidden flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                             {ex.gifUrl ? (
                               <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                             ) : (
                               <Dumbbell size={18} className="text-white/20" />
                             )}
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="text-xs font-black text-white uppercase truncate">{ex.name}</h4>
                             <p className="text-[9px] font-black text-text-muted uppercase tracking-tighter">
                               {ex.bodyParts[0]} • {ex.targetMuscles[0]}
                             </p>
                           </div>
                           <Plus size={16} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                         </button>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
