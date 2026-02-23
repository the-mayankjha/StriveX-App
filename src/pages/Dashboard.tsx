import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  CheckCheck, 
  ChevronRight, 
  Footprints,
  Dumbbell
} from 'lucide-react';
import { Card } from '../components/Card';
import { useWorkout, type QuestExercise } from '../hooks/useWorkout';
import { cn } from '../utils/cn';
import { useNavigate, Link } from 'react-router-dom';
import { ExerciseInfoSheet } from '../components/ExerciseInfoSheet';
import { calculateRank } from '../utils/leveling';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Dashboard() {
  const { playerStats, weeklyQuest, dailyProgress, setExerciseStatus } = useWorkout();
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<QuestExercise | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLongPress = useCallback((ex: QuestExercise) => {
    setSelectedExercise(ex);
    setIsSheetOpen(true);
  }, []);
  
  calculateRank(playerStats.level);

  const today = DAYS[new Date().getDay()];
  const dailyQuest = weeklyQuest[today] || { category: 'rest', exercises: [] as QuestExercise[] };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Today's Quest Card */}
      <div className="space-y-4">
        <Link to="/quest-system" className="block active:scale-[0.98] transition-transform">
          <Card className="p-0 border-0 overflow-hidden relative group bg-surface shadow-2xl">
             <div className="aspect-[16/9] w-full overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop" 
                 alt="Quest"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
             </div>
             
             <div className="p-5 space-y-3">
               <h4 className="text-2xl font-bold text-white">Conquer the Day</h4>
               <p className="text-sm text-gray-400 leading-relaxed">
                 {dailyQuest.category !== 'rest' 
                   ? `Today's focus: ${dailyQuest.category.charAt(0).toUpperCase() + dailyQuest.category.slice(1)}. Complete your quest!`
                   : "It's a rest day! Charge up for your next challenge."}
               </p>

               <div className="pt-2 space-y-2">
                 <div className="flex justify-between text-xs font-bold text-yellow-400">
                   <span>10000 steps</span>
                   <span className="text-gray-500">60%</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '60%' }} />
                 </div>
               </div>
             </div>
          </Card>
        </Link>
      </div>

      {/* Daily Stats Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-white">Daily Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
           {/* Steps Card */}
           <Card className="flex flex-col items-center justify-center p-6 bg-surface border-white/5">
             <div className="text-2xl font-bold text-white mb-1">6,000</div>
             <div className="text-sm text-text-muted font-medium">Steps</div>
           </Card>

           {/* Distance Card */}
           <Card className="flex flex-col items-center justify-center p-6 bg-surface border-white/5">
             <div className="text-2xl font-bold text-white mb-1">4.5 km</div>
             <div className="text-sm text-text-muted font-medium">Distance</div>
           </Card>

           {/* Calories Card */}
           <Card className="flex flex-col items-center justify-center p-6 bg-surface border-white/5">
             <div className="text-2xl font-bold text-white mb-1">350 kcal</div>
             <div className="text-sm text-text-muted font-medium">Calories</div>
           </Card>

           {/* Streak Card */}
           <Card className="flex flex-col items-center justify-center p-6 bg-surface border-white/5">
             <div className="text-2xl font-bold text-primary mb-1">{playerStats.streak}</div>
             <div className="text-sm text-text-muted font-medium">Streak</div>
           </Card>
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xl font-bold text-white">Workouts</h3>
          <button 
            onClick={() => navigate('/quest-system')}
            className="text-sm text-primary font-medium flex items-center gap-1 hover:text-primary/80 transition-colors"
          >
            Set Quests <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {dailyQuest.exercises.length > 0 ? (
              dailyQuest.exercises.map((ex) => (
                <WorkoutItem 
                  key={ex.id} 
                  ex={ex} 
                  status={dailyProgress.statuses[ex.id] || 'pending'}
                  category={dailyQuest.category}
                  setExerciseStatus={setExerciseStatus}
                  onLongPress={() => handleLongPress(ex)}
                />
              ))
            ) : (
              <button 
                onClick={() => navigate('/quest-system')}
                className="w-full py-10 rounded-3xl border-2 border-dashed border-white/5 text-text-muted hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium italic"
              >
                No exercises scheduled for today
              </button>
            )}
          </AnimatePresence>
        </div>
        {/* Static fallback/extra icons just in case */}
        {/* Static fallback/extra icons just in case */}
        {dailyQuest.exercises.length === 0 && dailyQuest.category === 'rest' && (
          <Card className="flex items-center gap-4 p-4 opacity-50">
            <div className="p-3 rounded-2xl bg-surfaceHighlight text-text-muted">
              <Footprints size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">Rest & Recovery</h4>
              <p className="text-xs text-text-muted">Take it easy today</p>
            </div>
          </Card>
        )}
      </div>

      <ExerciseInfoSheet 
        exercise={selectedExercise}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}

interface WorkoutItemProps {
  ex: QuestExercise;
  status: 'pending' | 'completed' | 'skipped';
  category: string;
  setExerciseStatus: (id: string, status: 'completed' | 'skipped') => void;
  onLongPress: () => void;
}

function WorkoutItem({ ex, status, category, setExerciseStatus, onLongPress }: WorkoutItemProps) {
  const x = useMotionValue(0);
  const longPressTimer = useRef<any>(null);
  const isDragging = useRef(false);
  
  const startLongPress = useCallback(() => {
    isDragging.current = false;
    longPressTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        onLongPress();
      }
    }, 500); // 500ms for long press
  }, [onLongPress]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  // Opacity for left/right labels
  const doneOpacity = useTransform(x, [20, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-20, -80], [0, 1]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: status === 'completed' ? 100 : -100 }}
      transition={{ duration: 0.2 }}
      className="relative group h-[100px]"
    >
      {/* Swipe Backgrounds */}
      <div className="absolute inset-0 rounded-3xl flex items-center justify-between px-6 overflow-hidden bg-background">
        <motion.div 
          style={{ opacity: doneOpacity }}
          className="flex items-center gap-2 text-green-500"
        >
          <CheckCheck size={24} />
          <span className="font-bold uppercase text-xs">Done</span>
        </motion.div>
        <motion.div 
          style={{ opacity: skipOpacity }}
          className="flex items-center gap-2 text-red-500"
        >
          <span className="font-bold uppercase text-xs">Skip</span>
          <CheckCheck size={24} />
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragSnapToOrigin
        dragElastic={0.1}
        style={{ x }}
        onDragStart={() => {
          isDragging.current = true;
          cancelLongPress();
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80) {
            setExerciseStatus(ex.id, 'completed');
          } else if (info.offset.x < -80) {
            setExerciseStatus(ex.id, 'skipped');
          }
        }}
        className="relative z-10 h-full"
      >
        <Card 
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          className={cn(
          "flex items-center gap-4 p-4 h-full cursor-grab active:cursor-grabbing transition-colors border-white/5 select-none",
          "bg-surface", // Always solid background
          status === 'completed' && "bg-white/10 border-white/20",
          status === 'skipped' && "bg-white/10 border-white/20"
        )}>
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-surfaceHighlight group-hover:bg-background transition-colors overflow-hidden flex items-center justify-center text-text-muted">
            {ex.gifUrl ? (
              <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" />
            ) : (
              <Dumbbell size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white truncate">{ex.name}</h4>
              {status === 'completed' && <CheckCheck size={18} className="text-green-500" />}
              {status === 'skipped' && <CheckCheck size={18} className="text-red-500" />}
              {status === 'pending' && <CheckCheck size={18} className="text-white/10" />}
            </div>
            <p className="text-sm text-text-muted truncate">
              {category} • {ex.sets} sets x {ex.reps} reps
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
