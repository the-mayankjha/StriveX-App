import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Minus, Plus, Dumbbell, Moon, Droplets, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { useWorkout, type QuestExercise } from '../hooks/useWorkout';
import { BottomSheet } from '../components/BottomSheet';
import { exerciseService, type ExerciseDBItem } from '../services/exerciseService';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Sync with weeklyQuest when activeDay changes
  useEffect(() => {
    const dayData = weeklyQuest[activeDay];
    if (dayData) {
      setSelectedCategory(dayData.category);
      setExercises(dayData.exercises);
    }
  }, [activeDay, weeklyQuest]);

  // Fetch exercises from API
  useEffect(() => {
    if (!isBottomSheetOpen) return;

    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        let result;
        if (searchQuery.trim().length > 2) {
          result = await exerciseService.searchExercises(searchQuery);
        } else if (searchQuery.trim().length === 0) {
          result = await exerciseService.getExercises(0, 20);
        } else {
          setIsLoading(false);
          return;
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
  }, [searchQuery, isBottomSheetOpen]);

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
    updateDailyQuest(activeDay, {
      category: selectedCategory,
      exercises
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white">Quest System</h2>
      </div>

      {/* Weekday Tabs */}
      <div className="flex justify-between border-b border-white/5 pb-2">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "px-1 pb-2 text-sm font-medium transition-all relative",
              activeDay === day ? "text-white" : "text-text-muted hover:text-white/70"
            )}
          >
            {day}
            {activeDay === day && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
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
                  <Card className="p-4 bg-surface border-white/5 flex flex-col gap-4 active:cursor-grabbing">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-2xl bg-surfaceHighlight overflow-hidden flex items-center justify-center text-primary">
                        {ex.gifUrl ? (
                          <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
                        ) : (
                          <Dumbbell size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg leading-tight">{ex.name}</h4>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                          {ex.target} • {ex.bodyPart}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-text-muted">Sets:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateExercise(ex.id, 'sets', -1)}
                            className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white text-xl font-black"
                          >
                            <Minus size={16} strokeWidth={4} />
                          </button>
                          <span className="w-8 text-center font-bold text-white tabular-nums">
                            {ex.sets.toString().padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => updateExercise(ex.id, 'sets', 1)}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"
                          >
                            <Plus size={16} strokeWidth={4} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-text-muted">Reps:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateExercise(ex.id, 'reps', -1)}
                            className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white"
                          >
                            <Minus size={16} strokeWidth={4} />
                          </button>
                          <span className="w-8 text-center font-bold text-white tabular-nums">
                            {ex.reps.toString().padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => updateExercise(ex.id, 'reps', 1)}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"
                          >
                            <Plus size={16} strokeWidth={4} />
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

      <Button onClick={handleSave} fullWidth className="h-14 text-lg font-bold shadow-lg shadow-primary/20">
        Save
      </Button>

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
                placeholder="Search exercise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surfaceHighlight border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button className="p-4 rounded-2xl bg-surfaceHighlight border border-white/5 text-text-muted hover:text-white hover:border-primary/50 transition-all flex items-center justify-center">
              <SlidersHorizontal size={18} />
            </button>
          </div>

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
