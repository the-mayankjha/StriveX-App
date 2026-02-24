import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Dumbbell, Plus, Loader2, CheckCheck } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWorkout, type QuestExercise } from '../../hooks/useWorkout';
import { exerciseService, type ExerciseDBItem } from '../../services/exerciseService';

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

interface MenuBankProps {
  bankData?: any;
}

export function MenuBank({ bankData = {} }: MenuBankProps) {
  const { weeklyQuest, updateDailyQuest, isSoloLevelingMode } = useWorkout();
  const today = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()], []);
  const dailyQuest = weeklyQuest[today] || { category: 'rest', exercises: [] };

  const {
    apiExercises = [],
    setApiExercises = () => {},
    isLoadingBank: isLoading = false,
    setIsLoadingBank = () => {},
    bodyParts = [],
    equipments = [],
    targetMuscles = []
  } = bankData;

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedTargetMuscle, setSelectedTargetMuscle] = useState<string | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<'bodyPart' | 'muscle' | 'equipment'>('bodyPart');

  // Fetch Exercises based on local filters
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoadingBank(true);
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
          // If no local filters applied and we already preloaded, don't re-fetch here immediately
          if (apiExercises.length > 0) {
            setIsLoadingBank(false);
            return;
          }
          result = await exerciseService.getExercises(0, 20);
        }
        setApiExercises(result.data);
      } catch (err) {
        console.error('Error fetching exercises in slider:', err);
      } finally {
        setIsLoadingBank(false);
      }
    };

    const debounce = setTimeout(fetchExercises, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedBodyPart, selectedEquipment, selectedTargetMuscle]);



  return (
    <motion.div
      key="bank"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className="space-y-6 pt-4"
    >
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            id="menu-bank-search"
            name="menu-bank-search"
            placeholder="Summon Exercise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full border border-white/5 pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/30 text-white",
              isSoloLevelingMode ? "bg-transparent rounded-[1.2rem]" : "bg-[#1a1c21] rounded-2xl"
            )}
          />
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 transition-all",
              isSoloLevelingMode
                ? (isFilterOpen || selectedBodyPart || selectedEquipment || selectedTargetMuscle
                    ? "text-primary"
                    : "text-text-muted hover:text-primary")
                : cn(
                    "rounded-[1rem] border",
                    isFilterOpen || selectedBodyPart || selectedEquipment || selectedTargetMuscle
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surfaceHighlight border-white/5 text-text-muted hover:text-white"
                  )
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
              <div className={cn("flex p-1 gap-1 mx-1", isSoloLevelingMode ? "" : "border border-white/5 bg-[#1a1c21] rounded-[1rem]")}>
                {['bodyPart', 'muscle', 'equipment'].map((fTab) => (
                  <button
                    key={fTab}
                    onClick={() => setActiveFilterTab(fTab as any)}
                    className={cn(
                      "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative",
                      isSoloLevelingMode ? "rounded-none" : "rounded-xl",
                      activeFilterTab === fTab 
                        ? isSoloLevelingMode ? "bg-primary/5 text-primary" : "bg-primary text-white shadow-md" 
                        : isSoloLevelingMode ? "bg-white/5 text-text-muted hover:bg-white/10" : "text-text-muted hover:text-white"
                    )}
                  >
                    {fTab.replace('Part', '')}
                    {isSoloLevelingMode && activeFilterTab === fTab && <CornerAccents />}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-2 mt-4 px-1">
                {activeFilterTab === 'bodyPart' && bodyParts.map((part: string) => (
                  <button
                    key={part}
                    onClick={() => setSelectedBodyPart(prev => prev === part ? null : part)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold transition-all uppercase relative",
                      isSoloLevelingMode ? "rounded-none border-transparent" : "rounded-full border",
                      selectedBodyPart === part 
                        ? isSoloLevelingMode ? "bg-primary/5 text-primary" : "bg-primary border-primary text-white" 
                        : isSoloLevelingMode ? "bg-white/5 text-text-muted hover:bg-white/10" : "bg-[#1a1c21] border-white/5 text-text-muted hover:text-white"
                    )}
                  >
                    {part}
                    {selectedBodyPart === part && isSoloLevelingMode && <CornerAccents />}
                  </button>
                ))}
                {activeFilterTab === 'muscle' && targetMuscles.map((m: string) => (
                  <button
                    key={m}
                    onClick={() => setSelectedTargetMuscle(prev => prev === m ? null : m)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold transition-all uppercase relative",
                      isSoloLevelingMode ? "rounded-none border-transparent" : "rounded-full border",
                      selectedTargetMuscle === m 
                        ? isSoloLevelingMode ? "bg-primary/5 text-primary" : "bg-primary border-primary text-white" 
                        : isSoloLevelingMode ? "bg-white/5 text-text-muted hover:bg-white/10" : "bg-[#1a1c21] border-white/5 text-text-muted hover:text-white"
                    )}
                  >
                    {m}
                    {selectedTargetMuscle === m && isSoloLevelingMode && <CornerAccents />}
                  </button>
                ))}
                {activeFilterTab === 'equipment' && equipments.map((e: string) => (
                  <button
                    key={e}
                    onClick={() => setSelectedEquipment(prev => prev === e ? null : e)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold transition-all uppercase relative",
                      isSoloLevelingMode ? "rounded-none border-transparent" : "rounded-full border",
                      selectedEquipment === e 
                        ? isSoloLevelingMode ? "bg-primary/5 text-primary" : "bg-primary border-primary text-white" 
                        : isSoloLevelingMode ? "bg-white/5 text-text-muted hover:bg-white/10" : "bg-[#1a1c21] border-white/5 text-text-muted hover:text-white"
                    )}
                  >
                    {e}
                    {selectedEquipment === e && isSoloLevelingMode && <CornerAccents />}
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
         ) : apiExercises.map((ex: ExerciseDBItem) => (
           <button
             key={ex.exerciseId}
             onClick={() => {
               const isAlreadyAdded = dailyQuest.exercises.some(e => e.name === ex.name);
               if (isAlreadyAdded) {
                 const newExercises = dailyQuest.exercises.filter(e => e.name !== ex.name);
                 updateDailyQuest(today, { ...dailyQuest, exercises: newExercises });
               } else {
                 const newEx: QuestExercise = {
                   id: `${ex.exerciseId}_${Date.now()}`,
                   name: ex.name,
                   sets: 3,
                   reps: 10,
                   gifUrl: ex.gifUrl,
                   target: ex.targetMuscles[0] || 'Full Body',
                   bodyPart: ex.bodyParts[0] || 'Core'
                 };
                 updateDailyQuest(today, { ...dailyQuest, exercises: [...dailyQuest.exercises, newEx] });
               }
             }}
             className={cn(
               "w-full p-4 border flex items-center gap-4 transition-all group text-left relative",
               isSoloLevelingMode 
                 ? "rounded-xl bg-[#16171f] border-[#252836] hover:border-primary/30" 
                 : "rounded-[1.2rem] bg-[#1a1c21] border-white/5 hover:border-primary/50"
             )}
           >
             <div className={cn(
               "w-14 h-14 shrink-0 overflow-hidden flex items-center justify-center border group-hover:scale-110 transition-transform relative z-10",
               isSoloLevelingMode ? "rounded-lg bg-white p-1 border-transparent" : "rounded-xl bg-surfaceHighlight border-white/10"
             )}>
               {ex.gifUrl ? (
                 <img src={ex.gifUrl} alt={ex.name} className={cn("w-full h-full object-cover", isSoloLevelingMode && "rounded-lg")} />
               ) : (
                 <Dumbbell size={18} className="text-white/20" />
               )}
             </div>
             <div className="flex-1 min-w-0 relative z-10">
               <h4 className={cn("truncate uppercase", isSoloLevelingMode ? "font-black text-[11px] text-white" : "font-black text-xs text-white")}>{ex.name}</h4>
               <p className={cn("uppercase tracking-tighter opacity-80", isSoloLevelingMode ? "text-[9px] font-bold text-[#6b7280] tracking-wider mt-1" : "text-[9px] font-black text-text-muted")}>
                 {ex.bodyParts[0]} • {ex.targetMuscles[0]}
               </p>
             </div>
             <div className="relative z-10">
               {dailyQuest.exercises.some(e => e.name === ex.name) ? (
                 <CheckCheck size={16} strokeWidth={isSoloLevelingMode ? 2.5 : 2} className={cn(isSoloLevelingMode ? "text-[#3b82f6]" : "text-primary")} />
               ) : (
                 <Plus size={16} strokeWidth={isSoloLevelingMode ? 2.5 : 2} className={cn(isSoloLevelingMode ? "text-[#3b82f6] opacity-60" : "text-primary opacity-40", "group-hover:opacity-100 transition-opacity")} />
               )}
             </div>
           </button>
         ))}
      </div>
    </motion.div>
  );
}
