import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Minus, Plus, Dumbbell, Moon, Droplets, Trash2, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { useWorkout, type QuestExercise } from '../hooks/useWorkout';
import { BottomSheet } from '../components/BottomSheet';
import { exerciseService, type ExerciseDBItem } from '../services/exerciseService';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveNotificationPopup } from '../components/SaveNotificationPopup';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CATEGORIES = [
  { id: 'push', label: 'Push', icon: Dumbbell },
  { id: 'pull', label: 'Pull', icon: Dumbbell },
  { id: 'legs', label: 'Legs', icon: Dumbbell },
  { id: 'strength', label: 'Strength', icon: Dumbbell },
  { id: 'cardio', label: 'Cardio', icon: Droplets },
  { id: 'yoga', label: 'Yoga', icon: Droplets },
  { id: 'rest', label: 'Rest', icon: Moon },
  { id: 'test', label: 'Test', icon: Droplets },
];

export function QuestSystem() {
  const { weeklyQuest, updateDailyQuest } = useWorkout();
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay()]);
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [exercises, setExercises] = useState<QuestExercise[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiExercises, setApiExercises] = useState<ExerciseDBItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedTargetMuscle, setSelectedTargetMuscle] = useState<string | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<'bodyPart' | 'muscle' | 'equipment'>('bodyPart');
  
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);

  // Sync with weeklyQuest when activeDay changes
  useEffect(() => {
    const dayData = weeklyQuest[activeDay];
    if (dayData) {
      setSelectedCategory(dayData.category);
      setExercises(dayData.exercises);
    }
  }, [activeDay, weeklyQuest]);

  // Fetch Exercises from API
  useEffect(() => {
    if (!isBottomSheetOpen) return;

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
        console.error('Error fetching exercises:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchExercises, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, isBottomSheetOpen, selectedBodyPart, selectedEquipment, selectedTargetMuscle]);

  // Fetch Filters
  useEffect(() => {
    if (!isBottomSheetOpen || (bodyParts.length > 0 && equipments.length > 0 && targetMuscles.length > 0)) return;

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
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, [isBottomSheetOpen, bodyParts.length, equipments.length, targetMuscles.length]);

  const updateExercise = (id: string, field: 'sets' | 'reps', delta: number) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: Math.max(0, ex[field] + delta) } : ex
    ));
  };

  const addExercise = (exercise: ExerciseDBItem) => {
    const newEx: QuestExercise = {
      id: `${exercise.exerciseId}_${Date.now()}`,
      name: exercise.name,
      sets: 3,
      reps: 10,
      gifUrl: exercise.gifUrl,
      target: exercise.targetMuscles[0],
      bodyPart: exercise.bodyParts[0]
    };
    setExercises(prev => [...prev, newEx]);
    setIsBottomSheetOpen(false);
    setSearchQuery('');
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setIsSavePopupOpen(true);

    setTimeout(() => {
      updateDailyQuest(activeDay, {
        category: selectedCategory,
        exercises
      });
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white">Quest System</h2>
      </div>

      {/* Weekday Tabs */}
      <div className="relative group">
        <div className="flex overflow-x-auto no-scrollbar gap-4 border-b border-white/5 pb-2 snap-x">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "px-4 pb-2 text-sm font-bold transition-all relative shrink-0 snap-center",
                activeDay === day ? "text-primary" : "text-text-muted hover:text-white/70"
              )}
            >
              {day}
              {activeDay === day && (
                <motion.div 
                  layoutId="activeDayBar"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-glow-blue" 
                />
              )}
            </button>
          ))}
        </div>
        {/* Fade mask for scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-60" />
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white px-1">Select Category for {activeDay}</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-surface border-white/5 text-text-muted hover:border-white/20"
                )}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-white/5 text-text-muted hover:border-white/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Custom Category Input */}
      {isAddingCategory && (
        <div className="flex gap-2 animate-scale-in">
          <input 
            type="text" 
            placeholder="Custom category"
            className="flex-1 bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <button className="p-3 rounded-xl bg-surface border border-white/5"><Dumbbell size={20} /></button>
          <Button size="sm" onClick={() => setIsAddingCategory(false)}>Add</Button>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-medium text-text-muted px-1 uppercase tracking-wider">Exercises:</h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {exercises.map(ex => (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                {/* Delete Background */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl flex items-center justify-end px-6 text-red-500 scale-[0.98]">
                  <Trash2 size={24} />
                </div>

                <motion.div
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  dragSnapToOrigin
                  dragElastic={0.1}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) {
                      removeExercise(ex.id);
                    }
                  }}
                  className="relative z-10"
                >
                  <Card className="p-3 sm:p-4 bg-surface border-white/5 flex flex-col gap-4 active:cursor-grabbing">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-xl sm:rounded-2xl bg-surfaceHighlight overflow-hidden flex items-center justify-center text-primary relative">
                         {/* Border Lighting Trace */}
                        <div className="absolute inset-0 border border-primary/20 rounded-2xl" />
                        {ex.gifUrl ? (
                          <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                        ) : (
                          <Dumbbell size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h4 className="font-black text-white text-sm sm:text-lg leading-tight line-clamp-1 sm:line-clamp-2 uppercase italic tracking-tighter">{ex.name}</h4>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5 px-0.5">
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-1.5 rounded">
                            {ex.target}
                          </span>
                          <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                            {ex.bodyPart}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">Sets</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => updateExercise(ex.id, 'sets', -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-4 sm:w-6 text-center font-black text-white tabular-nums text-xs sm:text-sm">
                            {ex.sets.toString().padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => updateExercise(ex.id, 'sets', 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">Reps</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => updateExercise(ex.id, 'reps', -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-4 sm:w-6 text-center font-black text-white tabular-nums text-xs sm:text-sm">
                            {ex.reps.toString().padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => updateExercise(ex.id, 'reps', 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          {exercises.length > 0 && (
            <button 
              onClick={() => setIsBottomSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface border border-white/5 border-dashed text-text-muted hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-wider"
            >
              <Plus size={18} />
              Add Exercise
            </button>
          )}

          {exercises.length === 0 && (
            <button 
              onClick={() => setIsBottomSheetOpen(true)}
              className="w-full text-center py-10 text-text-muted italic border-2 border-dashed border-white/5 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              No exercises assigned for this day
              <p className="text-[10px] mt-2 font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                + Add Exercise
              </p>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Button 
          onClick={handleSave} 
          fullWidth 
          className={cn(
            "h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all duration-300 rounded-2xl relative overflow-hidden",
            isSaving ? "scale-[0.98] bg-primary/80" : ""
          )}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Zap className="animate-pulse" size={20} />
              SAVING...
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <SaveNotificationPopup 
        isOpen={isSavePopupOpen} 
        onClose={() => setIsSavePopupOpen(false)} 
      />

      {/* Exercise Selection Bottom Sheet */}
      <BottomSheet 
        isOpen={isBottomSheetOpen} 
        onClose={() => setIsBottomSheetOpen(false)}
        title="Select Exercise"
      >
        <div className="space-y-4">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                id="exercise-search"
                name="exercise-search"
                placeholder="Search exercise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111218] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-center justify-center",
                isFilterOpen || selectedBodyPart || selectedEquipment || selectedTargetMuscle
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-surfaceHighlight border-white/5 text-text-muted hover:text-white"
              )}
            >
              <SlidersHorizontal size={18} />
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
                <div className="flex p-1 bg-[#111218] rounded-2xl border border-white/5 gap-1 mx-1">
                  {['bodyPart', 'muscle', 'equipment'].map((fTab) => (
                    <button
                      key={fTab}
                      onClick={() => setActiveFilterTab(fTab as any)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeFilterTab === fTab ? "bg-[#3b82f6] text-white shadow-md" : "text-text-muted hover:text-white"
                      )}
                    >
                      {fTab.replace('Part', '')}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-2 mt-4 px-1">
                  {activeFilterTab === 'bodyPart' && bodyParts.map((part: string) => (
                    <button
                      key={part}
                      onClick={() => setSelectedBodyPart(prev => prev === part ? null : part)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold transition-all border uppercase",
                        selectedBodyPart === part ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-transparent border-white/10 text-text-muted hover:text-white"
                      )}
                    >
                      {part}
                    </button>
                  ))}
                  {activeFilterTab === 'muscle' && targetMuscles.map((m: string) => (
                    <button
                      key={m}
                      onClick={() => setSelectedTargetMuscle(prev => prev === m ? null : m)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold transition-all border uppercase",
                        selectedTargetMuscle === m ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-transparent border-white/10 text-text-muted hover:text-white"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                  {activeFilterTab === 'equipment' && equipments.map((e: string) => (
                    <button
                      key={e}
                      onClick={() => setSelectedEquipment(prev => prev === e ? null : e)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold transition-all border uppercase",
                        selectedEquipment === e ? "bg-[#3b82f6] border-[#3b82f6] text-white" : "bg-transparent border-white/10 text-text-muted hover:text-white"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-3 pb-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-primary gap-4">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-sm font-bold animate-pulse">Summoning Exercises...</p>
              </div>
            ) : (
              apiExercises.map(ex => (
                <button
                  key={ex.exerciseId}
                  onClick={() => addExercise(ex)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surfaceHighlight border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-20 h-20 shrink-0 rounded-xl bg-background overflow-hidden flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    {ex.gifUrl ? (
                      <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                    ) : (
                      <Dumbbell size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{ex.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ex.targetMuscles.slice(0, 2).map(m => (
                        <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-text-muted font-bold uppercase">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))
            )}
            {!isLoading && apiExercises.length === 0 && (
              <div className="text-center py-20 text-text-muted italic">
                No exercises found. Try searching for "Pushup" or "Squat".
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
