import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Dumbbell, Plus, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWorkout, type QuestExercise } from '../../hooks/useWorkout';
import { exerciseService, type ExerciseDBItem } from '../../services/exerciseService';

interface MenuBankProps {
  onAssignObjective: () => void;
}

export function MenuBank({ onAssignObjective }: MenuBankProps) {
  const { weeklyQuest, updateDailyQuest } = useWorkout();
  const today = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()], []);
  const dailyQuest = weeklyQuest[today] || { category: 'rest', exercises: [] };

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

  // Fetch Exercises
  useEffect(() => {
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
  }, [searchQuery, selectedBodyPart, selectedEquipment, selectedTargetMuscle]);

  // Fetch Filters
  useEffect(() => {
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
  }, [bodyParts.length, equipments.length, targetMuscles.length]);

  return (
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
            className="w-full bg-[#1a1c21] border border-white/5 rounded-[1.2rem] pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted/30 text-white"
          />
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-[1rem] border transition-all",
              isFilterOpen || selectedBodyPart || selectedEquipment || selectedTargetMuscle
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-surfaceHighlight border-white/5 text-text-muted hover:text-white"
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
              <div className="flex p-1 bg-[#1a1c21] rounded-[1rem] border border-white/5 gap-1">
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
                      selectedBodyPart === part ? "bg-primary border-primary text-white" : "bg-[#1a1c21] border-white/5 text-text-muted"
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
                      selectedTargetMuscle === m ? "bg-primary border-primary text-white" : "bg-[#1a1c21] border-white/5 text-text-muted"
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
                      selectedEquipment === e ? "bg-primary border-primary text-white" : "bg-[#1a1c21] border-white/5 text-text-muted"
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
               onAssignObjective();
             }}
             className="w-full p-4 rounded-[1.2rem] bg-[#1a1c21] border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-all group text-left"
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
  );
}
