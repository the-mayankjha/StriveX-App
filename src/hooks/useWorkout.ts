import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

import { type PlayerStats, addXpToStats } from '../utils/leveling';

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

  // Reset progress if date changes
  const todayDate = new Date().toISOString().split('T')[0];
  if (dailyProgress.date !== todayDate) {
    setDailyProgress({
      date: todayDate,
      statuses: {},
      rewardsClaimed: false
    });
  }

  const updateDailyQuest = useCallback((day: string, quest: DailyQuest) => {
    setWeeklyQuest(prev => ({ ...prev, [day]: quest }));
  }, [setWeeklyQuest]);

  const setExerciseStatus = useCallback((exerciseId: string, status: ExerciseStatus) => {
    setDailyProgress(prev => {
      const newStatuses = {
        ...prev.statuses,
        [exerciseId]: status
      };
      
      let newRewardsClaimed = prev.rewardsClaimed;
      
      // Check if all exercises for today are done (completed)
      const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = DAYS[new Date().getDay()];
      const todayQuest = weeklyQuest[today];
      
      if (todayQuest && todayQuest.exercises.length > 0 && !prev.rewardsClaimed) {
        const allDone = todayQuest.exercises.every(ex => newStatuses[ex.id] === 'completed');
        
        if (allDone) {
          newRewardsClaimed = true;
          
          // Award XP and Streak
          const xpGained = 200;
          const { newStats } = addXpToStats(playerStats, xpGained);
          setPlayerStats({
            ...newStats,
            streak: playerStats.streak + 1
          });
        }
      }

      return {
        ...prev,
        statuses: newStatuses,
        rewardsClaimed: newRewardsClaimed
      };
    });
  }, [setDailyProgress, weeklyQuest, playerStats, setPlayerStats]);

  return {
    playerStats,
    history,
    weeklyQuest,
    updateDailyQuest,
    dailyProgress,
    setExerciseStatus
  };
}
