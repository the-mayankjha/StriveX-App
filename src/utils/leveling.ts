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
  return level * 100;
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
  let { level, currentXp } = stats;
  let leveledUp = false;
  let levelsGained = 0;
  
  currentXp += xpGained;
  
  let xpRequired = getXpRequiredForLevel(level);
  
  while (currentXp >= xpRequired) {
    currentXp -= xpRequired;
    level++;
    levelsGained++;
    xpRequired = getXpRequiredForLevel(level);
    leveledUp = true;
  }
  
  return {
    newStats: {
      ...stats,
      level,
      currentXp
    },
    leveledUp,
    levelsGained
  };
}
