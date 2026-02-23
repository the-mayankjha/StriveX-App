export const RANKS = {
  E: { min: 1, max: 10, title: 'E-Rank Hunter', color: 'text-gray-400' },
  D: { min: 11, max: 20, title: 'D-Rank Hunter', color: 'text-green-400' },
  C: { min: 21, max: 40, title: 'C-Rank Hunter', color: 'text-blue-400' },
  B: { min: 41, max: 70, title: 'B-Rank Hunter', color: 'text-yellow-400' },
  A: { min: 71, max: 99, title: 'A-Rank Hunter', color: 'text-purple-400' },
  S: { min: 100, max: 999, title: 'S-Rank Hunter', color: 'text-red-500 shadow-glow-red' },
} as const;

export type Rank = keyof typeof RANKS;

export interface PlayerStats {
  level: number;
  currentXp: number;
  strength: number;
  agility: number;
  vitality: number;
  perception: number;
  intelligence: number; // For consistency
  avatarUrl?: string;
  streak: number;
}

export const INITIAL_STATS: PlayerStats = {
  level: 1,
  currentXp: 0,
  strength: 10,
  agility: 10,
  vitality: 10,
  perception: 10,
  intelligence: 10,
  avatarUrl: 'https://i.pravatar.cc/150?img=53',
  streak: 0,
};

export function getXpRequiredForLevel(level: number): number {
  // Level 1: 100 XP (10 standard exercises)
  // Level 2: 200 XP
  // Level 3: 300 XP
  // Proper increment: each level requires more effort than the last
  return level * 100;
}

/**
 * Calculates XP for a single exercise completion
 * Base: 10 XP
 * Bonus: +5 XP per extra set, +2 XP per extra rep
 */
export function calculateExerciseXp(planned: { sets: number, reps: number }, actual: { sets: number, reps: number }): number {
  const baseXP = 10;
  
  const extraSets = Math.max(0, actual.sets - planned.sets);
  const extraReps = Math.max(0, actual.reps - planned.reps);
  
  const bonusXP = (extraSets * 5) + (extraReps * 2);
  
  return baseXP + bonusXP;
}

export function calculateRank(level: number): Rank {
  if (level >= RANKS.S.min) return 'S';
  if (level >= RANKS.A.min) return 'A';
  if (level >= RANKS.B.min) return 'B';
  if (level >= RANKS.C.min) return 'C';
  if (level >= RANKS.D.min) return 'D';
  return 'E';
}

export function addXpToStats(stats: PlayerStats, xpGained: number): { newStats: PlayerStats; leveledUp: boolean; levelsGained: number } {
  let { level, currentXp, strength, agility, vitality, perception, intelligence } = stats;
  let leveledUp = false;
  let levelsGained = 0;
  
  currentXp += Math.round(xpGained);
  
  while (currentXp >= getXpRequiredForLevel(level)) {
    currentXp -= getXpRequiredForLevel(level);
    level++;
    levelsGained++;
    leveledUp = true;
    
    // Increment base stats per level gained
    strength += 2;
    agility += 2;
    vitality += 2;
    perception += 2;
    intelligence += 2;
  }
  
  return {
    newStats: {
      ...stats,
      level,
      currentXp,
      strength,
      agility,
      vitality,
      perception,
      intelligence
    },
    leveledUp,
    levelsGained
  };
}
