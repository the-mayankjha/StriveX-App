import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

import { type PlayerStats, addXpToStats, calculateExerciseXp } from '../utils/leveling';

export interface QuestExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  gifUrl?: string;
  target?: string;
  bodyPart?: string;
}

export interface DailyQuest {
  category: string;
  exercises: QuestExercise[];
}

export type WeeklyQuest = Record<string, DailyQuest>;

export type ExerciseStatus = 'pending' | 'completed' | 'skipped';

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  statuses: Record<string, ExerciseStatus>; // exerciseId -> status
  actualPerformance?: Record<string, { sets: number; reps: number }>; // exerciseId -> performance
  rewardsClaimed: boolean;
}

export function useWorkout() {
  const [history] = useLocalStorage<any[]>('strivex_workout_history', []);
  const [playerStats, setPlayerStats] = useLocalStorage<PlayerStats>('strivex_player_stats', {
    level: 1, currentXp: 0, strength: 10, agility: 10, vitality: 10, perception: 10, intelligence: 10,
    avatarUrl: 'https://i.pravatar.cc/150?img=53', streak: 0
  });
  const [weeklyQuest, setWeeklyQuest] = useLocalStorage<WeeklyQuest>('strivex_weekly_quest', {
    'Sun': { category: 'rest', exercises: [] },
    'Mon': { category: 'push', exercises: [] },
    'Tue': { category: 'pull', exercises: [] },
    'Wed': { category: 'strength', exercises: [
      { id: '1', name: 'Push Ups', sets: 3, reps: 15 },
      { id: '2', name: 'Squats', sets: 4, reps: 12 },
      { id: '3', name: 'Deadlifts', sets: 3, reps: 10 }
    ] },
    'Thu': { category: 'cardio', exercises: [] },
    'Fri': { category: 'yoga', exercises: [] },
    'Sat': { category: 'test', exercises: [] },
  });
  const [dailyProgress, setDailyProgress] = useLocalStorage<DailyProgress>('strivex_daily_progress', {
    date: new Date().toISOString().split('T')[0],
    statuses: {},
    rewardsClaimed: false
  });

  const [celebration, setCelebration] = useState<{ type: 'level-up' | 'quest-complete' | null; data?: any }>({ type: null });

  // Retroactive Stats Initialization based on Level
  useEffect(() => {
    setPlayerStats(currentStats => {
      const expectedBase = 10 + (currentStats.level - 1) * 2;
      
      const needsUpdate = (
        currentStats.strength < expectedBase ||
        currentStats.agility < expectedBase ||
        currentStats.vitality < expectedBase ||
        currentStats.perception < expectedBase ||
        currentStats.intelligence < expectedBase
      );

      if (needsUpdate) {
        return {
          ...currentStats,
          strength: Math.max(currentStats.strength, expectedBase),
          agility: Math.max(currentStats.agility, expectedBase),
          vitality: Math.max(currentStats.vitality, expectedBase),
          perception: Math.max(currentStats.perception, expectedBase),
          intelligence: Math.max(currentStats.intelligence, expectedBase),
        };
      }
      return currentStats;
    });
  }, [setPlayerStats]);

  // Reset progress if date changes
  const todayDate = new Date().toISOString().split('T')[0];
  if (dailyProgress.date !== todayDate) {
    setDailyProgress({
      date: todayDate,
      statuses: {},
      actualPerformance: {},
      rewardsClaimed: false
    });
  }

  const updateDailyQuest = useCallback((day: string, quest: DailyQuest) => {
    setWeeklyQuest(prev => ({ ...prev, [day]: quest }));
  }, [setWeeklyQuest]);

  const updateTodayExercise = useCallback((exerciseId: string, updates: Partial<QuestExercise>) => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = DAYS[new Date().getDay()];
    
    setWeeklyQuest(prev => {
      const todayQuest = prev[today];
      if (!todayQuest) return prev;
      
      const newExercises = todayQuest.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );
      
      return {
        ...prev,
        [today]: { ...todayQuest, exercises: newExercises }
      };
    });
  }, [setWeeklyQuest]);

  const setActualPerformance = useCallback((exerciseId: string, performance: { sets: number; reps: number }) => {
    setDailyProgress(prev => ({
      ...prev,
      actualPerformance: {
        ...(prev.actualPerformance || {}),
        [exerciseId]: performance
      }
    }));
  }, [setDailyProgress]);

  const setExerciseStatus = useCallback((exerciseId: string, status: ExerciseStatus) => {
    setDailyProgress(prev => {
      const newStatuses = { ...prev.statuses, [exerciseId]: status };
      
      let newRewardsClaimed = prev.rewardsClaimed;
      let extraXp = 0;
      
      // Award XP when an exercise is marked as 'completed'
      if (status === 'completed' && prev.statuses[exerciseId] !== 'completed') {
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = DAYS[new Date().getDay()];
        const todayQuest = weeklyQuest[today];
        const exercise = todayQuest?.exercises.find(e => e.id === exerciseId);
        
        if (exercise) {
          const actual = prev.actualPerformance?.[exerciseId] || { sets: exercise.sets, reps: exercise.reps };
          extraXp = calculateExerciseXp({ sets: exercise.sets, reps: exercise.reps }, actual);
        }
      }
      
      // Update Player Stats if XP gained
      if (extraXp > 0) {
        setPlayerStats(stats => {
          const { newStats, leveledUp, levelsGained } = addXpToStats(stats, extraXp);
          if (leveledUp) {
            setCelebration({ type: 'level-up', data: { level: newStats.level, levelsGained } });
          }
          return newStats;
        });
      }
      
      // Check if all exercises for today are done (completed)
      const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = DAYS[new Date().getDay()];
      const todayQuest = weeklyQuest[today];
      
      if (todayQuest && todayQuest.exercises.length > 0 && !newRewardsClaimed) {
        const allDone = todayQuest.exercises.every(ex => newStatuses[ex.id] === 'completed');
        
        if (allDone) {
          newRewardsClaimed = true;
          setPlayerStats(stats => {
            const { newStats, leveledUp, levelsGained } = addXpToStats(stats, 100);
            if (!leveledUp) {
               // Only trigger quest-complete if we didn't just level up (avoid double popups)
               setCelebration({ type: 'quest-complete' });
            } else {
               setCelebration({ type: 'level-up', data: { level: newStats.level, levelsGained } });
            }
            return { ...newStats, streak: stats.streak + 1 };
          });
        }
      }

      return {
        ...prev,
        statuses: newStatuses,
        rewardsClaimed: newRewardsClaimed
      };
    });
  }, [setDailyProgress, weeklyQuest, setPlayerStats]);

  const clearCelebration = useCallback(() => setCelebration({ type: null }), []);

  const [hasSeenQuestInfo, setHasSeenQuestInfo] = useState<boolean>(false);
  const [isSoloLevelingMode, setIsSoloLevelingMode] = useLocalStorage<boolean>('strivex_solo_leveling_mode', true);
  
  const isQuestInfoVisible = isSoloLevelingMode && !hasSeenQuestInfo;
  const markQuestInfoAsSeen = useCallback(() => setHasSeenQuestInfo(true), [setHasSeenQuestInfo]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [sliderTab, setSliderTab] = useState<'profile' | 'quest' | 'bank'>('profile');

  const openSlider = useCallback((tab: 'profile' | 'quest' | 'bank' = 'profile') => {
    setSliderTab(tab);
    setIsSliderOpen(true);
  }, []);

  const closeSlider = useCallback(() => setIsSliderOpen(false), []);

  return {
    playerStats,
    history,
    weeklyQuest,
    updateDailyQuest,
    updateTodayExercise,
    setActualPerformance,
    dailyProgress,
    setExerciseStatus,
    celebration,
    clearCelebration,
    isQuestInfoVisible,
    markQuestInfoAsSeen,
    isSoloLevelingMode,
    setIsSoloLevelingMode,
    isSliderOpen,
    sliderTab,
    openSlider,
    closeSlider
  };
}


