const BASE_URL = 'https://www.exercisedb.dev/api/v1';

export interface ExerciseDBResponse {
  success: boolean;
  metadata: {
    totalExercises: number;
    totalPages: number;
    currentPage: number;
  };
  data: ExerciseDBItem[];
}

export interface ExerciseDBItem {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

export const exerciseService = {
  async getExercises(offset = 0, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/exercises?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    return response.json();
  },

  async searchExercises(query: string, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to search exercises');
    return response.json();
  }
};
