export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  description: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  type: 'Strength' | 'Agility' | 'Vitality' | 'Perception';
}

export const exercises: Exercise[] = [
  {
    id: 'pushups',
    name: 'Push Ups',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    description: 'A fundamental exercise to build upper body strength. "100 Push-ups a day!"',
    rank: 'E',
    type: 'Strength'
  },
  {
    id: 'situps',
    name: 'Sit Ups',
    muscleGroups: ['Abs', 'Core'],
    description: 'Strengthen your core to withstand powerful attacks.',
    rank: 'E',
    type: 'Vitality'
  },
  {
    id: 'squats',
    name: 'Squats',
    muscleGroups: ['Legs', 'Glutes'],
    description: 'Build the foundation of your power. Do 100 every day.',
    rank: 'E',
    type: 'Strength'
  },
  {
    id: 'running',
    name: 'Running (10km)',
    muscleGroups: ['Legs', 'Cardio'],
    description: 'Improve your stamina and endurance. Required for the Daily Quest.',
    rank: 'D',
    type: 'Agility'
  },
  {
    id: 'pullups',
    name: 'Pull Ups',
    muscleGroups: ['Back', 'Biceps'],
    description: 'Master your own bodyweight to ascend to higher levels.',
    rank: 'D',
    type: 'Strength'
  },
  {
    id: 'bench_press',
    name: 'Bench Press',
    muscleGroups: ['Chest', 'Triceps'],
    description: 'Push beyond your limits to increase your striking power.',
    rank: 'C',
    type: 'Strength'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroups: ['Back', 'Legs', 'Core'],
    description: 'Lift the weight of the world. Increases overall power significantly.',
    rank: 'S',
    type: 'Strength'
  }
];
