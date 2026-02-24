import { motion } from 'framer-motion';
import { Sword, Trash2, Dumbbell, Activity, Zap, Target, Brain, Flame, Moon } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { cn } from '../../utils/cn';
import { useMemo } from 'react';

const CATEGORIES = [
  { id: 'push', label: 'Push', icon: Flame },
  { id: 'pull', label: 'Pull', icon: Dumbbell },
  { id: 'legs', label: 'Legs', icon: Activity },
  { id: 'strength', label: 'Strength', icon: Zap },
  { id: 'cardio', label: 'Cardio', icon: Target },
  { id: 'yoga', label: 'Yoga', icon: Brain },
  { id: 'rest', label: 'Rest', icon: Moon },
];

const CornerAccents = () => (
  <>
    <div className="absolute top-0 left-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute top-0 left-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute top-0 right-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute top-0 right-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 left-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 left-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 right-0 w-1.5 h-[1.5px] bg-primary shadow-glow-blue" />
    <div className="absolute bottom-0 right-0 w-[1.5px] h-1.5 bg-primary shadow-glow-blue" />
  </>
);

interface MenuQuestProps {
  onAddObjective: () => void;
}

export function MenuQuest({ onAddObjective }: MenuQuestProps) {
  const { weeklyQuest, updateDailyQuest, dailyProgress, isSoloLevelingMode } = useWorkout();
  const today = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()], []);
  const dailyQuest = weeklyQuest[today] || { category: 'rest', exercises: [] };

  return (
    <motion.div
      key="quest"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className="space-y-5 pt-4"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          {isSoloLevelingMode ? (
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-primary/20" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Active Protocol</h4>
              <div className="h-[1px] flex-1 bg-primary/20" />
            </div>
          ) : (
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Protocol</h4>
          )}
          <div className={cn("flex flex-wrap gap-2", isSoloLevelingMode && "justify-center")}>
            {CATEGORIES.map(cat => {
              const isSelected = dailyQuest.category === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateDailyQuest(today, { ...dailyQuest, category: cat.id })}
                  className={cn(
                    "flex items-center gap-1.5 uppercase transition-all relative",
                    isSoloLevelingMode 
                      ? cn("px-3 py-2 rounded-none text-[10px] font-black", isSelected ? "bg-primary/5 text-primary" : "bg-white/5 text-text-muted hover:bg-white/10")
                      : cn("px-4 py-2 rounded-xl text-[10px] font-bold", isSelected ? "bg-[#3B82F6] text-white" : "bg-[#1a1c21] text-text-muted hover:bg-white/5")
                  )}
                >
                  <Icon size={12} />
                  {cat.label}
                  {isSelected && isSoloLevelingMode && <CornerAccents />}
                </button>
              );
            })}
          </div>
        </div>

        <div className={cn(
          "p-5 relative overflow-hidden group",
          isSoloLevelingMode ? "bg-[#0c1424] border border-primary/10 rounded-none" : "bg-[#1a1c21] rounded-[1.5rem]"
        )}>
           {isSoloLevelingMode && <CornerAccents />}
           <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sword size={isSoloLevelingMode ? 48 : 64} />
           </div>
           <h3 className={cn("text-2xl text-white capitalize", isSoloLevelingMode ? "font-black" : "font-bold tracking-tight italic")}>{dailyQuest.category} Protocol</h3>
           <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-[0.15em]">
             {dailyQuest.exercises.length} Active Objectives • {dailyQuest.exercises.length * 15} MIN EST
           </p>
        </div>

        <div className="space-y-3">
           <div className="flex items-center justify-between px-1">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Objectives</h4>
             <button 
               onClick={onAddObjective}
               className="text-[10px] font-black uppercase text-primary hover:underline transition-all"
             >
               + Add Sub-objective
             </button>
           </div>
           
           <div className={cn(
             "relative flex flex-col gap-3",
             isSoloLevelingMode ? "p-3 bg-[#0c1424] border border-primary/10 rounded-none" : "pt-2 bg-transparent gap-4"
           )}>
               {isSoloLevelingMode && <CornerAccents />}
               {dailyQuest.exercises.length > 0 ? (
                 dailyQuest.exercises.map((ex, idx) => {
                   const isDone = dailyProgress.statuses[ex.id] === 'completed';
                   const isSkipped = dailyProgress.statuses[ex.id] === 'skipped';
                   
                   return (
                     <div key={ex.id} className={cn("relative", !isSoloLevelingMode && "bg-[#18191e] rounded-[1.5rem] p-4")}>
                       {isSoloLevelingMode ? (
                         <div className="flex flex-wrap items-center justify-between gap-3">
                           <div className="flex gap-4 flex-1 min-w-[150px] items-center">
                             <div className={cn(
                               "w-10 h-10 shrink-0 flex items-center justify-center transition-colors border relative rounded-none",
                               isDone ? "text-primary bg-primary/10 border-primary/20" : 
                               isSkipped ? "text-red-500 bg-red-500/10 border-red-500/20" :
                               "bg-background/50 text-text-muted border-white/5"
                             )}>
                               <Sword size={16} />
                             </div>
                             <div className="min-w-0">
                               <h5 className={cn("text-[10px] font-black uppercase tracking-wide truncate mt-1", isDone ? "text-primary" : "text-white")}>
                                 {ex.name}
                               </h5>
                               <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter bg-white/5 py-0.5 mt-1 inline-block border border-white/5 px-1.5 rounded-none">
                                 {ex.target}
                               </span>
                             </div>
                           </div>

                           <div className="flex items-center justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                             <div className="flex items-center gap-2">
                               <span className="text-[8px] font-black text-text-muted uppercase tracking-wider">Intensity</span>
                               <span className="text-[10px] font-black text-white bg-background/50 px-2 py-0.5 border border-white/5 rounded-none">{ex.sets}x{ex.reps}</span>
                             </div>
                             <button 
                               onClick={() => {
                                 const newExercises = dailyQuest.exercises.filter(e => e.id !== ex.id);
                                 updateDailyQuest(today, { ...dailyQuest, exercises: newExercises });
                               }}
                               className="p-2 flex-shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all ml-1 border border-red-500/20 rounded-none"
                             >
                               <Trash2 size={14} />
                             </button>
                           </div>
                         </div>
                       ) : (
                         <div className="flex flex-col">
                           <div className="flex gap-4 items-center">
                             <div className={cn(
                               "w-12 h-12 shrink-0 flex items-center justify-center transition-colors border relative rounded-[1rem]",
                               isDone ? "text-primary bg-primary/10 border-primary/20" : 
                               isSkipped ? "text-red-500 bg-red-500/10 border-red-500/20" :
                               "bg-[#1a1c21] text-text-muted border-white/5 shadow-inner"
                             )}>
                               <Sword size={20} />
                             </div>
                             <div className="min-w-0 pr-2">
                               <h5 className={cn("text-[11px] font-bold uppercase tracking-wide truncate mt-1", isDone ? "text-primary" : "text-white")}>
                                 {ex.name}
                               </h5>
                               <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter bg-white/5 py-0.5 mt-1.5 inline-block border border-white/5 px-2.5 rounded-lg">
                                 {ex.target}
                               </span>
                             </div>
                           </div>

                           <div className="h-[1px] w-full bg-white/5 my-4" />

                           <div className="flex items-center justify-between w-full pl-1">
                             <div className="flex items-center gap-4">
                               <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Intensity</span>
                               <span className="text-[11px] font-bold text-white bg-white/5 px-3 py-1 border border-white/5 rounded-xl">{ex.sets}x{ex.reps}</span>
                             </div>
                             <button 
                               onClick={() => {
                                 const newExercises = dailyQuest.exercises.filter(e => e.id !== ex.id);
                                 updateDailyQuest(today, { ...dailyQuest, exercises: newExercises });
                               }}
                               className="p-2.5 bg-[#25151a] text-[#ef4444] hover:bg-[#321a20] transition-all border border-[#ef4444]/20 flex-shrink-0 rounded-[14px]"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>
                         </div>
                       )}
                       {idx < dailyQuest.exercises.length - 1 && isSoloLevelingMode && <div className="h-[1px] w-full bg-white/5 my-3" />}
                     </div>
                   );
                 })
               ) : (
                 <div className={cn(
                   "p-6 text-center text-text-muted italic text-[10px] border border-dashed border-white/10 flex flex-col items-center gap-3",
                   isSoloLevelingMode ? "rounded-none" : "rounded-2xl"
                 )}>
                   <span>No protocol assigned for today.</span>
                   <button 
                     onClick={onAddObjective}
                     className={cn(
                       "text-primary font-bold uppercase tracking-widest border border-primary/20 px-3 py-1.5 hover:bg-primary/5 transition-all relative",
                       isSoloLevelingMode ? "font-black rounded-none" : "rounded-xl"
                     )}
                   >
                     Assign Objectives
                     {isSoloLevelingMode && <CornerAccents />}
                   </button>
                 </div>
               )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
